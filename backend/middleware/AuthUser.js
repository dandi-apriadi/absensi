import { User } from "../models/userModel.js";

// Middleware to verify if the user is authenticated
export const verifyUser = async (req, res, next) => {
    // Check if user is logged in (session validation)
    console.log('=== VERIFY USER MIDDLEWARE ===');
    console.log('Request method:', req.method);
    console.log('Request URL:', req.url);
    console.log('req.secure:', req.secure, 'x-forwarded-proto:', req.headers['x-forwarded-proto']);
    console.log('Session exists:', !!req.session);
    console.log('Session ID:', req.session?.id);
    console.log('Session user_id:', req.session?.user_id);
    console.log('Session role:', req.session?.role);
    // Extract SID from cookie for diagnostics
    try {
        const rawCookie = req.headers.cookie || '';
        const match = rawCookie.match(/connect\.sid=s%3A([^\.]+)\./);
        const cookieSid = match ? decodeURIComponent(match[1]) : null;
        console.log('Incoming Cookie SID:', cookieSid);
    } catch (e) {
        console.log('Cookie SID parse error:', e?.message);
    }
    console.log('Full session data:', req.session);
    console.log('Request headers:', req.headers);
    console.log('Cookies:', req.headers.cookie);
    console.log('==============================');
    // Fallback normalization (supports legacy keys userId/userRole)
    if (req.session) {
        if (!req.session.user_id && req.session.userId) {
            req.session.user_id = req.session.userId;
        }
        if (!req.session.role && req.session.userRole) {
            req.session.role = req.session.userRole;
        }
    }

    if (!req.session.user_id) {
        // Attempt to detect stale/invalid signed cookie and clear it
        try {
            const rawCookie = req.headers.cookie || '';
            const match = rawCookie.match(/connect\.sid=s%3A([^\.]+)\./);
            const cookieSid = match ? decodeURIComponent(match[1]) : null;
            if (cookieSid && cookieSid !== req.session?.id) {
                console.warn('🧹 Clearing stale/invalid connect.sid cookie. Cookie SID does not match active session ID.');
                const host = req.hostname || req.headers.host || '';
                const envDomain = process.env.COOKIE_DOMAIN || '';
                const domainVariants = Array.from(new Set([
                    undefined,
                    envDomain || undefined,
                    host || undefined,
                    host ? `.${host.replace(/^\./, '')}` : undefined,
                    envDomain ? `.${envDomain.replace(/^\./, '')}` : undefined,
                ].filter(Boolean)));
                for (const d of domainVariants) {
                    const opts = { path: '/' };
                    if (d) opts.domain = d;
                    res.clearCookie('connect.sid', opts);
                }
            }
        } catch {}

        console.log('❌ No user_id in session - returning 401');
        return res.status(401).json({ 
            msg: "Mohon login ke Akun Anda!", 
            sessionData: req.session,
            hasSession: !!req.session 
        });
    }

    try {
        const user = await User.findOne({
            where: {
                user_id: req.session.user_id
            }
        });

        if (!user) {
            console.log('❌ User not found in database - returning 404');
            return res.status(404).json({ msg: "User tidak ditemukan" });
        }

        console.log('✅ User verified:', { user_id: user.user_id, role: user.role });
        req.user_id = user.user_id;
        req.role = user.role;

        next();
    } catch (error) {
        console.error("Error verifying user:", error); // Log error for debugging
        res.status(500).json({ msg: "Terjadi kesalahan pada server" });
    }
}

// Middleware to restrict access to admin users only
export const adminOnly = async (req, res, next) => {
    try {
        // User should be already authenticated by verifyUser middleware
        if (!req.user_id) {
            return res.status(401).json({
                status: "error",
                message: "Unauthorized"
            });
        }

        // Get user from database to check role
        const user = await User.findOne({
            where: {
                user_id: req.user_id
            }
        });

        if (!user || user.role !== 'admin') {
            return res.status(403).json({
                status: "error",
                message: "Access denied. Admin privileges required."
            });
        }

        next();
    } catch (error) {
        console.error("Admin authorization error:", error);
        res.status(500).json({
            status: "error",
            message: "Internal server error"
        });
    }
};