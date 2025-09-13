import {
    Users,
    db
} from "../../models/index.js";
import argon2 from "argon2";

// ===============================================
// AUTHENTICATION CONTROLLERS
// ===============================================

/**
 * User Login
 */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email dan password harus diisi"
            });
        }        // Find user by email
        const user = await Users.findOne({
            where: { email }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User tidak ditemukan"
            });
        }

        // Verify password
        const isValidPassword = await argon2.verify(user.password, password);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: "Password salah"
            });
        }

        // Create session (normalized snake_case keys to match middleware)
        req.session.user_id = user.user_id;
        req.session.role = user.role;
        // Backward compatibility fields (optional; can remove later)
        req.session.userId = user.user_id;
        req.session.userRole = user.role;

        console.log('Session after login:', {
            id: req.session.id,
            user_id: req.session.user_id,
            role: req.session.role
        });

        // Prepare simplified response data
        const userData = {
            user_id: user.user_id,
            fullname: user.fullname,
            email: user.email,
            role: user.role,
            gender: user.gender,
            student_id: user.student_id,
            created_at: user.created_at
        };

        res.status(200).json({
            success: true,
            message: "Login berhasil",
            data: {
                user: userData,
                role: user.role,
                sessionId: req.sessionID
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan server"
        });
    }
};

/**
 * User Registration
 */
export const register = async (req, res) => {
    try {
        const {
            fullname,
            email,
            password,
            role,
            gender,
            student_id
        } = req.body;

        // Validation
        if (!fullname || !email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "Nama lengkap, email, password, dan role harus diisi"
            });
        }

        // Validate role
        if (!['super-admin', 'student'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Role harus 'super-admin' atau 'student'"
            });
        }

        // Check if user already exists
        const existingUser = await Users.findOne({
            where: {
                [db.Sequelize.Op.or]: [
                    { email },
                    ...(student_id ? [{ student_id }] : [])
                ]
            }
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email atau Student ID sudah terdaftar"
            });
        }

        // Hash password
        const hashedPassword = await argon2.hash(password);

        // Prepare simplified user data
        const userData = {
            fullname,
            email,
            password: hashedPassword,
            role,
            gender: gender || null,
            student_id: student_id || null
        };

        // Create user with simplified data
        const newUser = await Users.create(userData);

        // Return user data without password
        const userResponse = {
            user_id: newUser.user_id,
            fullname: newUser.fullname,
            email: newUser.email,
            role: newUser.role,
            gender: newUser.gender,
            student_id: newUser.student_id,
            created_at: newUser.created_at
        };

        res.status(201).json({
            success: true,
            message: "Registrasi berhasil",
            data: {
                user: userResponse
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan server",
            error: error.message
        });
    }
};

/**
 * Get Current User Profile
 */
export const getProfile = async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({
                success: false,
                message: "Tidak ada sesi aktif"
            });
        }

        const user = await Users.findOne({
            where: { user_id: req.session.userId }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User tidak ditemukan"
            });
        }

        // Return simplified user data without password
        const userData = {
            user_id: user.user_id,
            fullname: user.fullname,
            email: user.email,
            role: user.role,
            gender: user.gender,
            student_id: user.student_id,
            created_at: user.created_at,
            updated_at: user.updated_at
        };

        res.status(200).json({
            success: true,
            data: {
                user: userData
            }
        });

    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan server"
        });
    }
};

/**
 * User Logout
 */
export const logout = async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({
                success: false,
                message: "Tidak ada sesi aktif"
            });
        }

        // Destroy session
        req.session.destroy((err) => {
            if (err) {
                console.error('Logout error:', err);
                return res.status(500).json({
                    success: false,
                    message: "Gagal logout"
                });
            }

            res.clearCookie('connect.sid');
            res.status(200).json({
                success: true,
                message: "Logout berhasil"
            });
        });

    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan server"
        });
    }
};

// Keep old function name for backward compatibility
export const logOut = logout;
export const Me = getProfile;
export const registrasi = register;
