import { User } from "../models/userModel.js";

// Middleware to verify if the user is authenticated
export const verifyUser = async (req, res, next) => {
    // Check if user is logged in (session validation)
    console.log('=== VERIFY USER MIDDLEWARE ===');
    console.log('Request method:', req.method);
    console.log('Request URL:', req.url);
    console.log('Session exists:', !!req.session);
    console.log('Session ID:', req.session?.id);
    console.log('Session user_id:', req.session?.user_id);
    console.log('Session role:', req.session?.role);
    console.log('Full session data:', req.session);
    console.log('Request headers:', req.headers);
    console.log('Cookies:', req.headers.cookie);
    console.log('==============================');
    
    if (!req.session.user_id) {
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