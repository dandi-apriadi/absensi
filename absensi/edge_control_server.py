"""
Edge Control HTTP Server

Purpose: Allow authorized remote/manual door open without using the GUI.
Security: Protected by a pre-shared token via HTTP header X-EDGE-TOKEN or query param token.

Endpoints:
  - GET  /api/edge/health                 -> { ok: true }
  - GET  /api/edge/door/status            -> { status: "LOCKED"|"UNLOCKED", debug: {...} }
  - POST /api/edge/door/open              -> JSON body { duration?: number }
       Headers: X-EDGE-TOKEN: <token>  or query ?token=<token>

Env vars:
  EDGE_CONTROL_ENABLED=true|false (default: false)
  EDGE_CONTROL_PORT=5055
  EDGE_CONTROL_HOST=0.0.0.0 (default to 0.0.0.0)
  EDGE_CONTROL_TOKEN=<your-secret>

Run standalone:
  python edge_control_server.py  # requires Flask
"""

import os
from threading import Thread
from typing import Optional

from dotenv import load_dotenv

load_dotenv()

_server_started = False

def _create_app():
    try:
        from flask import Flask, request, jsonify  # type: ignore
    except Exception as e:
        raise RuntimeError(
            "Flask is required to run the Edge Control server. Install dependencies via 'pip install -r absensi/requirements.txt' or 'pip install Flask'."
        ) from e
    from relay_control import activate_door, get_door_status, get_door_debug
    from backend_api import backend_api

    app = Flask(__name__)

    EDGE_TOKEN = os.getenv('EDGE_CONTROL_TOKEN')

    def _authorized(req) -> bool:
        if not EDGE_TOKEN:
            # If no token configured, deny by default
            return False
        sent = req.headers.get('X-EDGE-TOKEN') or req.args.get('token') or ''
        return str(sent).strip() == str(EDGE_TOKEN).strip()

    @app.get('/api/edge/health')
    def health():
        return jsonify({ 'ok': True }), 200

    @app.get('/api/edge/door/status')
    def door_status():
        status = get_door_status()
        dbg = get_door_debug()
        return jsonify({ 'status': status, 'debug': dbg }), 200

    @app.post('/api/edge/door/open')
    def door_open():
        if not _authorized(request):
            return jsonify({ 'success': False, 'message': 'Unauthorized' }), 401
        try:
            payload = request.get_json(silent=True) or {}
            dur = payload.get('duration') or request.args.get('duration') or os.getenv('RELAY_DEFAULT_DURATION', '5')
            try:
                duration = float(dur)
            except Exception:
                duration = 5.0
            # clamp duration
            duration = max(1.0, min(30.0, duration))

            ok = activate_door(duration=duration)

            # Log access for audit
            try:
                backend_api.log_door_access(
                    user_id=None,
                    access_type='remote_manual',
                    access_status=('granted' if ok else 'failed'),
                    reason=f'Remote manual open for {int(duration)}s'
                )
            except Exception:
                pass

            return jsonify({ 'success': bool(ok), 'duration': duration }), (200 if ok else 500)
        except Exception as e:
            return jsonify({ 'success': False, 'error': str(e) }), 500

    return app

def start_edge_server(host: Optional[str]=None, port: Optional[int]=None, in_thread: bool=True):
    global _server_started
    if _server_started:
        return False
    host = host or os.getenv('EDGE_CONTROL_HOST', '0.0.0.0')
    try:
        port = int(port or os.getenv('EDGE_CONTROL_PORT', '5055'))
    except Exception:
        port = 5055

    token_present = bool(os.getenv('EDGE_CONTROL_TOKEN'))
    if not token_present:
        print('[EDGE] EDGE_CONTROL_TOKEN not set. Refusing to start edge server for security.')
        return False

    try:
        app = _create_app()
    except Exception as e:
        print(f"[EDGE] Cannot start edge server: {e}")
        return False

    def _run():
        try:
            print(f"[EDGE] Starting Edge Control server on {host}:{port}")
            app.run(host=host, port=port, debug=False, use_reloader=False)
        except Exception as e:
            print(f"[EDGE] Server error: {e}")

    if in_thread:
        t = Thread(target=_run, daemon=True)
        t.start()
        _server_started = True
        return True
    else:
        _server_started = True
        _run()
        return True

if __name__ == '__main__':
    enabled = os.getenv('EDGE_CONTROL_ENABLED', 'false').lower() in ('1','true','yes')
    if not enabled:
        print('[EDGE] EDGE_CONTROL_ENABLED is false; set it to true to run this server.')
    else:
        start_edge_server(in_thread=False)
