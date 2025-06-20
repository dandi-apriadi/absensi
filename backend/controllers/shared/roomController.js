import {
    Rooms,
    CourseClasses,
    RoomAccessPermissions,
    Users,
    DoorAccessLogs,
    AttendanceSessions,
    Courses
} from "../../models/index.js";
import { Op } from "sequelize";

// ===============================================
// ROOM MANAGEMENT CONTROLLERS
// ===============================================

/**
 * Get all rooms
 */
export const getRooms = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, room_type, building } = req.query;
        const offset = (page - 1) * limit;

        let whereClause = {};

        if (search) {
            whereClause[Op.or] = [
                { room_name: { [Op.iLike]: `%${search}%` } },
                { room_code: { [Op.iLike]: `%${search}%` } }
            ];
        }

        if (room_type) {
            whereClause.room_type = room_type;
        }

        if (building) {
            whereClause.building = { [Op.iLike]: `%${building}%` };
        }

        const rooms = await Rooms.findAndCountAll({
            where: whereClause,
            order: [['building', 'ASC'], ['room_name', 'ASC']],
            limit: parseInt(limit),
            offset: offset
        });

        res.status(200).json({
            success: true,
            data: {
                rooms: rooms.rows,
                pagination: {
                    total: rooms.count,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(rooms.count / limit)
                }
            }
        });
    } catch (error) {
        console.error('Get rooms error:', error);
        res.status(500).json({
            success: false,
            message: "Gagal mengambil data ruangan"
        });
    }
};

/**
 * Get room by ID
 */
export const getRoomById = async (req, res) => {
    try {
        const { id } = req.params;

        const room = await Rooms.findByPk(id);

        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Ruangan tidak ditemukan"
            });
        }

        res.status(200).json({
            success: true,
            data: room
        });
    } catch (error) {
        console.error('Get room by ID error:', error);
        res.status(500).json({
            success: false,
            message: "Gagal mengambil data ruangan"
        });
    }
};

/**
 * Create new room (Super Admin only)
 */
export const createRoom = async (req, res) => {
    try {
        if (req.session.role !== 'super-admin') {
            return res.status(403).json({
                success: false,
                message: "Akses ditolak. Hanya super admin yang dapat membuat ruangan"
            });
        }

        const {
            room_code,
            room_name,
            room_type,
            building,
            floor,
            capacity,
            equipment,
            description,
            has_face_recognition,
            has_door_access_control
        } = req.body;

        // Validation
        if (!room_code || !room_name || !room_type || !building) {
            return res.status(400).json({
                success: false,
                message: "Kode ruangan, nama ruangan, tipe, dan gedung harus diisi"
            });
        }

        // Check if room code already exists
        const existingRoom = await Rooms.findOne({
            where: { room_code }
        });

        if (existingRoom) {
            return res.status(400).json({
                success: false,
                message: "Kode ruangan sudah ada"
            });
        }

        const room = await Rooms.create({
            room_code,
            room_name,
            room_type,
            building,
            floor,
            capacity: capacity || 0,
            equipment: equipment || null,
            description,
            has_face_recognition: has_face_recognition || false,
            has_door_access_control: has_door_access_control || false,
            status: 'active'
        });

        res.status(201).json({
            success: true,
            message: "Ruangan berhasil dibuat",
            data: room
        });
    } catch (error) {
        console.error('Create room error:', error);
        res.status(500).json({
            success: false,
            message: "Gagal membuat ruangan"
        });
    }
};

/**
 * Update room (Super Admin only)
 */
export const updateRoom = async (req, res) => {
    try {
        if (req.session.role !== 'super-admin') {
            return res.status(403).json({
                success: false,
                message: "Akses ditolak. Hanya super admin yang dapat mengubah ruangan"
            });
        }

        const { id } = req.params;
        const updateData = req.body;

        const room = await Rooms.findByPk(id);
        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Ruangan tidak ditemukan"
            });
        }

        // If updating room_code, check if it already exists
        if (updateData.room_code && updateData.room_code !== room.room_code) {
            const existingRoom = await Rooms.findOne({
                where: { room_code: updateData.room_code }
            });

            if (existingRoom) {
                return res.status(400).json({
                    success: false,
                    message: "Kode ruangan sudah ada"
                });
            }
        }

        await room.update(updateData);

        res.status(200).json({
            success: true,
            message: "Ruangan berhasil diperbarui",
            data: room
        });
    } catch (error) {
        console.error('Update room error:', error);
        res.status(500).json({
            success: false,
            message: "Gagal memperbarui ruangan"
        });
    }
};

/**
 * Delete room (Super Admin only)
 */
export const deleteRoom = async (req, res) => {
    try {
        if (req.session.role !== 'super-admin') {
            return res.status(403).json({
                success: false,
                message: "Akses ditolak. Hanya super admin yang dapat menghapus ruangan"
            });
        }

        const { id } = req.params;

        const room = await Rooms.findByPk(id);
        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Ruangan tidak ditemukan"
            });
        }

        // Check if room is being used by any classes
        const classCount = await CourseClasses.count({
            where: { room_id: id }
        });

        if (classCount > 0) {
            return res.status(400).json({
                success: false,
                message: "Tidak dapat menghapus ruangan yang sedang digunakan oleh kelas"
            });
        }

        await room.destroy();

        res.status(200).json({
            success: true,
            message: "Ruangan berhasil dihapus"
        });
    } catch (error) {
        console.error('Delete room error:', error);
        res.status(500).json({
            success: false,
            message: "Gagal menghapus ruangan"
        });
    }
};

/**
 * Get room schedule
 */
export const getRoomSchedule = async (req, res) => {
    try {
        const { id } = req.params;
        const { start_date, end_date } = req.query;

        const room = await Rooms.findByPk(id);
        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Ruangan tidak ditemukan"
            });
        }

        // Get regular class schedules
        const classes = await CourseClasses.findAll({
            where: {
                room_id: id,
                status: 'active'
            },
            include: [
                {
                    model: Courses,
                    as: 'course',
                    attributes: ['course_name', 'course_code']
                }
            ]
        });

        // Get attendance sessions within date range (if provided)
        let whereClause = {};
        if (start_date && end_date) {
            whereClause.session_date = {
                [Op.between]: [start_date, end_date]
            };
        } else if (start_date) {
            whereClause.session_date = {
                [Op.gte]: start_date
            };
        } else if (end_date) {
            whereClause.session_date = {
                [Op.lte]: end_date
            };
        }

        const sessions = await AttendanceSessions.findAll({
            where: whereClause,
            include: [
                {
                    model: CourseClasses,
                    as: 'courseClass',
                    where: { room_id: id },
                    include: [
                        {
                            model: Courses,
                            as: 'course',
                            attributes: ['course_name', 'course_code']
                        }
                    ]
                }
            ],
            order: [['session_date', 'ASC'], ['start_time', 'ASC']]
        });

        res.status(200).json({
            success: true,
            data: {
                room,
                regular_classes: classes,
                sessions: sessions
            }
        });
    } catch (error) {
        console.error('Get room schedule error:', error);
        res.status(500).json({
            success: false,
            message: "Gagal mengambil jadwal ruangan"
        });
    }
};

/**
 * Check room availability
 */
export const checkRoomAvailability = async (req, res) => {
    try {
        const { id } = req.params;
        const { date, start_time, end_time } = req.query;

        if (!date || !start_time || !end_time) {
            return res.status(400).json({
                success: false,
                message: "Tanggal, waktu mulai, dan waktu selesai harus diisi"
            });
        }

        const room = await Rooms.findByPk(id);
        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Ruangan tidak ditemukan"
            });
        }

        // Check for conflicts with existing sessions
        const conflictingSessions = await AttendanceSessions.findAll({
            where: {
                session_date: date,
                [Op.or]: [
                    {
                        start_time: {
                            [Op.between]: [start_time, end_time]
                        }
                    },
                    {
                        end_time: {
                            [Op.between]: [start_time, end_time]
                        }
                    },
                    {
                        [Op.and]: [
                            { start_time: { [Op.lte]: start_time } },
                            { end_time: { [Op.gte]: end_time } }
                        ]
                    }
                ]
            },
            include: [
                {
                    model: CourseClasses,
                    as: 'courseClass',
                    where: { room_id: id }
                }
            ]
        });

        // Check for conflicts with regular class schedules
        const dayOfWeek = new Date(date).getDay();
        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const dayName = dayNames[dayOfWeek];

        const conflictingClasses = await CourseClasses.findAll({
            where: {
                room_id: id,
                schedule_day: dayName,
                status: 'active',
                [Op.or]: [
                    {
                        start_time: {
                            [Op.between]: [start_time, end_time]
                        }
                    },
                    {
                        end_time: {
                            [Op.between]: [start_time, end_time]
                        }
                    },
                    {
                        [Op.and]: [
                            { start_time: { [Op.lte]: start_time } },
                            { end_time: { [Op.gte]: end_time } }
                        ]
                    }
                ]
            }
        });

        const isAvailable = conflictingSessions.length === 0 && conflictingClasses.length === 0;

        res.status(200).json({
            success: true,
            data: {
                room,
                is_available: isAvailable,
                conflicts: {
                    sessions: conflictingSessions,
                    classes: conflictingClasses
                }
            }
        });
    } catch (error) {
        console.error('Check room availability error:', error);
        res.status(500).json({
            success: false,
            message: "Gagal memeriksa ketersediaan ruangan"
        });
    }
};

/**
 * Get room access history
 */
export const getRoomAccessHistory = async (req, res) => {
    try {
        if (req.session.role !== 'super-admin' && req.session.role !== 'lecturer') {
            return res.status(403).json({
                success: false,
                message: "Akses ditolak. Hanya admin atau dosen yang dapat melihat riwayat akses ruangan"
            });
        }

        const { id } = req.params;
        const { page = 1, limit = 20, start_date, end_date } = req.query;
        const offset = (page - 1) * limit;

        let whereClause = { room_id: id };

        if (start_date && end_date) {
            whereClause.access_time = {
                [Op.between]: [start_date, end_date]
            };
        }

        const accessLogs = await DoorAccessLogs.findAndCountAll({
            where: whereClause,
            order: [['access_time', 'DESC']],
            limit: parseInt(limit),
            offset: offset,
            include: [
                {
                    model: Users,
                    as: 'user',
                    attributes: ['full_name', 'user_id', 'role'],
                    required: false
                },
                {
                    model: Rooms,
                    as: 'room',
                    attributes: ['room_name', 'building']
                }
            ]
        });

        res.status(200).json({
            success: true,
            data: {
                access_logs: accessLogs.rows,
                pagination: {
                    total: accessLogs.count,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(accessLogs.count / limit)
                }
            }
        });
    } catch (error) {
        console.error('Get room access history error:', error);
        res.status(500).json({
            success: false,
            message: "Gagal mengambil riwayat akses ruangan"
        });
    }
};
