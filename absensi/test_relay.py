"""
Quick relay test for Raspberry Pi

Usage:
  - Ensure dependencies installed on Raspberry Pi: RPi.GPIO, gpiozero
  - Optionally create .env (copy .env.example) to set RELAY_PIN, RELAY_ACTIVE_LOW, RELAY_DEFAULT_DURATION
  - Run:
      python3 test_relay.py

This will attempt to unlock the door relay for 3-5 seconds (depending on env) and then auto-lock.
It prints diagnostics before/after.
"""

import os
import time

from relay_control import activate_door, get_door_status, get_door_debug, cleanup_gpio

def main():
    try:
        print("[TEST] Starting relay test…")
        dbg = get_door_debug()
        print(f"[TEST] Initial debug: {dbg}")
        print(f"[TEST] Door status: {get_door_status()}")

        dur_env = os.getenv("RELAY_DEFAULT_DURATION")
        duration = 5
        if dur_env:
            try:
                duration = float(dur_env)
            except Exception:
                pass

        print(f"[TEST] Activating door for {duration} seconds…")
        ok = activate_door(duration=duration)
        print(f"[TEST] activate_door returned: {ok}")
        print(f"[TEST] After activate, door status: {get_door_status()}")

        # Wait a bit longer than duration to allow auto-lock
        time.sleep(duration + 1.0)
        print(f"[TEST] After timeout, door status: {get_door_status()}")
        print(f"[TEST] Final debug: {get_door_debug()}")
    finally:
        try:
            cleanup_gpio()
        except Exception:
            pass

if __name__ == "__main__":
    main()
