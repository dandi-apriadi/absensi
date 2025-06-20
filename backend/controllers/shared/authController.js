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

        // Check if user is active
        if (user.status !== 'active') {
            return res.status(403).json({
                success: false,
                message: `Akun Anda dalam status ${user.status}. Hubungi administrator.`
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

        // Update last login
        await user.update({ last_login: new Date() });

        // Create session
        req.session.userId = user.id;
        req.session.userRole = user.role;        // Prepare response data dengan role-specific data
        const userData = user.getRoleSpecificData();

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
            user_id,
            email,
            password,
            full_name,
            role,
            phone,
            address,
            birth_date,
            gender,
            emergency_contact,
            emergency_phone,
            notes,
            // Student specific
            program_study,
            semester,
            academic_year,
            entrance_year,
            gpa,
            guardian_name,
            guardian_phone,
            // Lecturer specific
            department,
            position,
            specialization,
            education_level,
            office_room,
            employee_id,
            // Super Admin specific
            admin_level,
            permissions,
            department_access
        } = req.body;

        // Validation
        if (!user_id || !email || !password || !full_name || !role) {
            return res.status(400).json({
                success: false,
                message: "Data wajib harus diisi"
            });
        }

        // Check if user already exists
        const existingUser = await Users.findOne({
            where: {
                [db.Sequelize.Op.or]: [
                    { email },
                    { user_id }
                ]
            }
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email atau User ID sudah terdaftar"
            });
        }

        // Hash password
        const hashedPassword = await argon2.hash(password);

        // Prepare user data dengan field role-specific
        const userData = {
            user_id,
            email,
            password: hashedPassword,
            full_name,
            role,
            phone,
            address,
            birth_date,
            gender,
            emergency_contact,
            emergency_phone,
            notes,
            status: 'active'
        };

        // Add role-specific fields
        if (role === 'student') {
            // Validasi field student yang required
            if (!program_study || !semester || !entrance_year) {
                return res.status(400).json({
                    success: false,
                    message: "Data mahasiswa tidak lengkap (program_study, semester, entrance_year)"
                });
            }

            userData.program_study = program_study;
            userData.semester = semester;
            userData.academic_year = academic_year || `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`;
            userData.entrance_year = entrance_year;
            userData.gpa = gpa;
            userData.guardian_name = guardian_name;
            userData.guardian_phone = guardian_phone;
        }
        else if (role === 'lecturer') {
            // Validasi field lecturer yang required
            if (!department || !position || !employee_id) {
                return res.status(400).json({
                    success: false,
                    message: "Data dosen tidak lengkap (department, position, employee_id)"
                });
            }

            userData.department = department;
            userData.position = position;
            userData.specialization = specialization;
            userData.education_level = education_level;
            userData.office_room = office_room;
            userData.employee_id = employee_id;
        }
        else if (role === 'super-admin') {
            // Validasi field admin yang required
            if (!admin_level) {
                return res.status(400).json({
                    success: false,
                    message: "Level admin harus ditentukan"
                });
            }

            userData.admin_level = admin_level;
            userData.permissions = permissions || [];
            userData.department_access = department_access || [];
            userData.department = department;
        }

        // Create user dengan semua data termasuk role-specific
        const newUser = await Users.create(userData);

        // Get user data dengan role-specific formatting
        const completeUserData = newUser.getRoleSpecificData();

        res.status(201).json({
            success: true,
            message: "Registrasi berhasil",
            data: {
                user: completeUserData
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

        const user = await Users.findByPk(req.session.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User tidak ditemukan"
            });
        }

        // Get user data dengan role-specific formatting
        const userData = user.getRoleSpecificData();

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
