import {
    Users,
    getUserWithRoleDetails,
    db
} from "../../models/index.js";
import argon2 from "argon2";

// ===============================================
// USER MANAGEMENT CONTROLLERS FOR SUPER ADMIN
// ===============================================

/**
 * Get Dashboard Statistics
 */
export const getDashboard = async (req, res) => {
    try {
        // Check if user is super admin
        if (req.session.userRole !== 'super-admin') {
            return res.status(403).json({
                success: false,
                message: "Akses ditolak. Hanya super admin yang diizinkan."
            });
        }
        // Statistik sesuai struktur tabel saat ini (role: super-admin | student, tidak ada kolom status)
        const totalUsers = await Users.count();
        const totalStudents = await Users.count({ where: { role: 'student' } });
        const totalSuperAdmins = await Users.count({ where: { role: 'super-admin' } });
        const totalLecturers = 0; // tidak ada role 'lecturer' di enum model saat ini
        const activeUsers = null; // kolom status tidak tersedia
        const inactiveUsers = null;
        const suspendedUsers = null;

        // Get recent registrations (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentRegistrations = await Users.count({
            where: {
                created_at: {
                    [db.Sequelize.Op.gte]: thirtyDaysAgo
                }
            }
        });

        // Get users by role breakdown
        const usersByRoleRaw = await Users.findAll({
            attributes: [
                'role',
                [db.Sequelize.fn('COUNT', db.Sequelize.col('role')), 'count']
            ],
            group: ['role']
        });
        const usersByRole = usersByRoleRaw.map(item => ({
            role: item.role,
            count: parseInt(item.dataValues.count)
        }));

        res.status(200).json({
            success: true,
            data: {
                overview: {
                    totalUsers,
                    totalStudents,
                    totalLecturers,
                    totalSuperAdmins,
                    activeUsers,
                    inactiveUsers,
                    suspendedUsers,
                    recentRegistrations
                },
                usersByRole
            }
        });

    } catch (error) {
        console.error('Get dashboard error:', error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan server"
        });
    }
};

/**
 * Get All Users with Pagination and Filters
 */
export const getAllUsers = async (req, res) => {
    try {
        // Check if user is super admin
        if (req.session.userRole !== 'super-admin') {
            return res.status(403).json({
                success: false,
                message: "Akses ditolak. Hanya super admin yang diizinkan."
            });
        }

        const {
            page = 1,
            limit = 10,
            role,
            status,
            search,
            sortBy = 'created_at',
            sortOrder = 'DESC'
        } = req.query;

        // Build where clause
        const whereClause = {};

        if (role) {
            whereClause.role = role;
        }

        if (status) {
            whereClause.status = status;
        }

        if (search) {
            whereClause[db.Sequelize.Op.or] = [
                { full_name: { [db.Sequelize.Op.like]: `%${search}%` } },
                { email: { [db.Sequelize.Op.like]: `%${search}%` } },
                { user_id: { [db.Sequelize.Op.like]: `%${search}%` } }
            ];
        }        // Calculate offset
        const offset = (parseInt(page) - 1) * parseInt(limit);

        // Get users with pagination
        const { count, rows: users } = await Users.findAndCountAll({
            where: whereClause,
            attributes: { exclude: ['password'] },
            order: [[sortBy, sortOrder.toUpperCase()]],
            limit: parseInt(limit),
            offset: offset
        });

        // Format users with role-specific data (fallback jika method tidak tersedia)
        const formattedUsers = users.map(user => {
            if (typeof user.getRoleSpecificData === 'function') {
                return user.getRoleSpecificData();
            }
            const base = user.toJSON();
            return {
                id: base.id,
                user_id: base.user_id,
                email: base.email,
                full_name: base.full_name,
                role: base.role,
                status: base.status,
                phone: base.phone,
                address: base.address,
                profile_picture: base.profile_picture,
                last_login: base.last_login,
                created_at: base.created_at,
                updated_at: base.updated_at
            };
        });

        // Calculate pagination info
        const totalPages = Math.ceil(count / parseInt(limit));

        res.status(200).json({
            success: true,
            data: {
                users: formattedUsers,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages,
                    totalItems: count,
                    itemsPerPage: parseInt(limit),
                    hasNextPage: parseInt(page) < totalPages,
                    hasPrevPage: parseInt(page) > 1
                }
            }
        });

    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan server"
        });
    }
};

/**
 * Get User by ID
 */
export const getUserById = async (req, res) => {
    try {
        // Check if user is super admin
        if (req.session.userRole !== 'super-admin') {
            return res.status(403).json({
                success: false,
                message: "Akses ditolak. Hanya super admin yang diizinkan."
            });
        }

        const { id } = req.params;

        const user = await getUserWithRoleDetails(parseInt(id));

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User tidak ditemukan"
            });
        }

        // Remove password from response
        const { password, ...userData } = user.toJSON();

        res.status(200).json({
            success: true,
            data: {
                user: userData
            }
        });

    } catch (error) {
        console.error('Get user by ID error:', error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan server"
        });
    }
};

/**
 * Create New User
 */
export const createUser = async (req, res) => {
    try {
        // Check if user is super admin
        if (req.session.userRole !== 'super-admin') {
            return res.status(403).json({
                success: false,
                message: "Akses ditolak. Hanya super admin yang diizinkan."
            });
        }

        const {
            user_id,
            email,
            password,
            full_name,
            role,
            phone,
            address,
            status = 'active',
            // Student specific
            nim,
            program_study,
            semester,
            academic_year,
            entry_year,
            guardian_name,
            guardian_phone,
            // Lecturer specific
            nip,
            department,
            position,
            expertise,
            education_level,
            room_office,
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

        // Create user
        const newUser = await Users.create({
            user_id,
            email,
            password: hashedPassword,
            full_name,
            role,
            phone,
            address,
            status
        });

        // Create role-specific details
        let roleDetail = null;

        if (role === 'student') {
            if (!nim || !program_study || !semester || !entry_year) {
                await newUser.destroy();
                return res.status(400).json({
                    success: false,
                    message: "Data mahasiswa tidak lengkap"
                });
            }

            roleDetail = await Students.create({
                user_id: newUser.id,
                nim,
                program_study,
                semester,
                academic_year: academic_year || `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`,
                entry_year,
                guardian_name,
                guardian_phone
            });
        }
        else if (role === 'lecturer') {
            if (!nip || !department || !position) {
                await newUser.destroy();
                return res.status(400).json({
                    success: false,
                    message: "Data dosen tidak lengkap"
                });
            }

            roleDetail = await Lecturers.create({
                user_id: newUser.id,
                nip,
                department,
                position,
                expertise,
                education_level,
                room_office
            });
        }
        else if (role === 'super-admin') {
            if (!admin_level) {
                await newUser.destroy();
                return res.status(400).json({
                    success: false,
                    message: "Level admin harus ditentukan"
                });
            }

            roleDetail = await SuperAdmins.create({
                user_id: newUser.id,
                admin_level,
                permissions: permissions || [],
                department_access: department_access || []
            });
        }

        // Get complete user data
        const completeUser = await getUserWithRoleDetails(newUser.id);
        const { password: _, ...userData } = completeUser.toJSON();

        res.status(201).json({
            success: true,
            message: "User berhasil dibuat",
            data: {
                user: userData
            }
        });

    } catch (error) {
        console.error('Create user error:', error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan server"
        });
    }
};

/**
 * Update User
 */
export const updateUser = async (req, res) => {
    try {
        // Check if user is super admin
        if (req.session.userRole !== 'super-admin') {
            return res.status(403).json({
                success: false,
                message: "Akses ditolak. Hanya super admin yang diizinkan."
            });
        }

        const { id } = req.params;
        const updateData = req.body;

        // Find user
        const user = await Users.findByPk(parseInt(id));
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User tidak ditemukan"
            });
        }

        // Check if email/user_id is being changed and already exists
        if (updateData.email && updateData.email !== user.email) {
            const existingUser = await Users.findOne({
                where: {
                    email: updateData.email,
                    id: { [db.Sequelize.Op.ne]: parseInt(id) }
                }
            });
            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    message: "Email sudah digunakan"
                });
            }
        }

        if (updateData.user_id && updateData.user_id !== user.user_id) {
            const existingUser = await Users.findOne({
                where: {
                    user_id: updateData.user_id,
                    id: { [db.Sequelize.Op.ne]: parseInt(id) }
                }
            });
            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    message: "User ID sudah digunakan"
                });
            }
        }

        // Hash password if provided
        if (updateData.password) {
            updateData.password = await argon2.hash(updateData.password);
        }

        // Update user
        await user.update(updateData);

        // Update role-specific details if provided
        if (user.role === 'student' && updateData.studentDetail) {
            const student = await Students.findOne({ where: { user_id: user.id } });
            if (student) {
                await student.update(updateData.studentDetail);
            }
        }
        else if (user.role === 'lecturer' && updateData.lecturerDetail) {
            const lecturer = await Lecturers.findOne({ where: { user_id: user.id } });
            if (lecturer) {
                await lecturer.update(updateData.lecturerDetail);
            }
        }
        else if (user.role === 'super-admin' && updateData.superAdminDetail) {
            const superAdmin = await SuperAdmins.findOne({ where: { user_id: user.id } });
            if (superAdmin) {
                await superAdmin.update(updateData.superAdminDetail);
            }
        }

        // Get updated user data
        const updatedUser = await getUserWithRoleDetails(parseInt(id));
        const { password, ...userData } = updatedUser.toJSON();

        res.status(200).json({
            success: true,
            message: "User berhasil diperbarui",
            data: {
                user: userData
            }
        });

    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan server"
        });
    }
};

/**
 * Delete User
 */
export const deleteUser = async (req, res) => {
    try {
        // Check if user is super admin
        if (req.session.userRole !== 'super-admin') {
            return res.status(403).json({
                success: false,
                message: "Akses ditolak. Hanya super admin yang diizinkan."
            });
        }

        const { id } = req.params;

        // Check if trying to delete self
        if (parseInt(id) === req.session.userId) {
            return res.status(400).json({
                success: false,
                message: "Tidak dapat menghapus akun sendiri"
            });
        }

        // Find user
        const user = await Users.findByPk(parseInt(id));
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User tidak ditemukan"
            });
        }

        // Delete user (cascade will handle role-specific details)
        await user.destroy();

        res.status(200).json({
            success: true,
            message: "User berhasil dihapus"
        });

    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan server"
        });
    }
};

/**
 * Update User Status
 */
export const updateUserStatus = async (req, res) => {
    try {
        // Check if user is super admin
        if (req.session.userRole !== 'super-admin') {
            return res.status(403).json({
                success: false,
                message: "Akses ditolak. Hanya super admin yang diizinkan."
            });
        }

        const { id } = req.params;
        const { status } = req.body;

        // Validation
        if (!['active', 'inactive', 'suspended'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Status tidak valid"
            });
        }

        // Check if trying to suspend self
        if (parseInt(id) === req.session.userId && status === 'suspended') {
            return res.status(400).json({
                success: false,
                message: "Tidak dapat menangguhkan akun sendiri"
            });
        }

        // Find user
        const user = await Users.findByPk(parseInt(id));
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User tidak ditemukan"
            });
        }

        // Update status
        await user.update({ status });

        res.status(200).json({
            success: true,
            message: `Status user berhasil diubah menjadi ${status}`,
            data: {
                user: {
                    id: user.id,
                    user_id: user.user_id,
                    full_name: user.full_name,
                    status: user.status
                }
            }
        });

    } catch (error) {
        console.error('Update user status error:', error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan server"
        });
    }
};

/**
 * Bulk Operations
 */
export const bulkUpdateStatus = async (req, res) => {
    try {
        // Check if user is super admin
        if (req.session.userRole !== 'super-admin') {
            return res.status(403).json({
                success: false,
                message: "Akses ditolak. Hanya super admin yang diizinkan."
            });
        }

        const { userIds, status } = req.body;

        // Validation
        if (!Array.isArray(userIds) || userIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Array user IDs harus disediakan"
            });
        }

        if (!['active', 'inactive', 'suspended'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Status tidak valid"
            });
        }

        // Remove current user from the list if trying to suspend
        const filteredUserIds = status === 'suspended'
            ? userIds.filter(id => parseInt(id) !== req.session.userId)
            : userIds;

        // Update users
        const [updatedCount] = await Users.update(
            { status },
            {
                where: {
                    id: {
                        [db.Sequelize.Op.in]: filteredUserIds
                    }
                }
            }
        );

        res.status(200).json({
            success: true,
            message: `${updatedCount} user berhasil diperbarui`,
            data: {
                updatedCount,
                requestedCount: userIds.length
            }
        });

    } catch (error) {
        console.error('Bulk update status error:', error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan server"
        });
    }
};
