import {
    Users,
    FaceDatasets,
    db
} from "../../models/index.js";
import multer from "multer";
import path from "path";
import fs from "fs";

// ===============================================
// FACE DATASET MANAGEMENT CONTROLLERS
// ===============================================

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(process.cwd(), 'public', 'uploads', 'face-datasets');

        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}_${req.session.userId}_${file.originalname}`;
        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only JPEG, JPG, and PNG files are allowed'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

/**
 * Upload Face Dataset
 */
export const uploadFaceDataset = async (req, res) => {
    try {
        // Use multer middleware
        upload.array('face_images', 5)(req, res, async (err) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    message: err.message || "Error uploading files"
                });
            }

            if (!req.files || req.files.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "Minimal satu foto wajah harus diupload"
                });
            }

            // Check if user exists
            const user = await Users.findByPk(req.session.userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User tidak ditemukan"
                });
            }

            // Check if user already has pending or approved datasets
            const existingDatasets = await FaceDatasets.findAll({
                where: {
                    user_id: req.session.userId,
                    verification_status: ['pending', 'approved']
                }
            });

            if (existingDatasets.length >= 5) {
                // Delete uploaded files if limit exceeded
                req.files.forEach(file => {
                    fs.unlinkSync(file.path);
                });

                return res.status(400).json({
                    success: false,
                    message: "Maksimal 5 foto per user. Hapus foto lama terlebih dahulu."
                });
            }

            const uploadedDatasets = [];

            // Process each uploaded file
            for (const file of req.files) {
                try {
                    // Create face dataset record
                    const faceDataset = await FaceDatasets.create({
                        user_id: req.session.userId,
                        image_path: file.path,
                        image_name: file.originalname,
                        image_quality: 'good', // This would be determined by face detection in production
                        is_primary: uploadedDatasets.length === 0, // First image is primary
                        verification_status: 'pending',
                        upload_method: 'single_upload'
                    });

                    uploadedDatasets.push(faceDataset);

                } catch (dbError) {
                    console.error('Database error for file:', file.originalname, dbError);
                    // Delete the file if database save failed
                    fs.unlinkSync(file.path);
                }
            }

            if (uploadedDatasets.length === 0) {
                return res.status(500).json({
                    success: false,
                    message: "Gagal menyimpan foto ke database"
                });
            }

            res.status(201).json({
                success: true,
                message: `${uploadedDatasets.length} foto berhasil diupload dan menunggu verifikasi`,
                data: {
                    uploadedCount: uploadedDatasets.length,
                    datasets: uploadedDatasets.map(dataset => ({
                        id: dataset.id,
                        image_name: dataset.image_name,
                        verification_status: dataset.verification_status,
                        is_primary: dataset.is_primary,
                        created_at: dataset.created_at
                    }))
                }
            });
        });

    } catch (error) {
        console.error('Upload face dataset error:', error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan server"
        });
    }
};

/**
 * Get User's Face Datasets
 */
export const getMyFaceDatasets = async (req, res) => {
    try {
        const datasets = await FaceDatasets.findAll({
            where: { user_id: req.session.userId },
            order: [['created_at', 'DESC']]
        });

        // Get verification statistics
        const stats = await FaceDatasets.findAll({
            where: { user_id: req.session.userId },
            attributes: [
                'verification_status',
                [db.Sequelize.fn('COUNT', db.Sequelize.col('verification_status')), 'count']
            ],
            group: ['verification_status']
        });

        const verificationStats = {
            pending: 0,
            approved: 0,
            rejected: 0
        };

        stats.forEach(stat => {
            verificationStats[stat.verification_status] = parseInt(stat.dataValues.count);
        });

        res.status(200).json({
            success: true,
            data: {
                datasets: datasets.map(dataset => ({
                    id: dataset.id,
                    image_name: dataset.image_name,
                    image_path: dataset.image_path.replace(process.cwd(), ''),
                    image_quality: dataset.image_quality,
                    verification_status: dataset.verification_status,
                    is_primary: dataset.is_primary,
                    verified_at: dataset.verified_at,
                    upload_method: dataset.upload_method,
                    created_at: dataset.created_at
                })),
                statistics: verificationStats
            }
        });

    } catch (error) {
        console.error('Get face datasets error:', error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan server"
        });
    }
};

/**
 * Delete Face Dataset
 */
export const deleteFaceDataset = async (req, res) => {
    try {
        const { datasetId } = req.params;

        // Find dataset
        const dataset = await FaceDatasets.findOne({
            where: {
                id: parseInt(datasetId),
                user_id: req.session.userId
            }
        });

        if (!dataset) {
            return res.status(404).json({
                success: false,
                message: "Dataset tidak ditemukan"
            });
        }

        // Check if it's approved and primary (shouldn't be deleted)
        if (dataset.verification_status === 'approved' && dataset.is_primary) {
            return res.status(400).json({
                success: false,
                message: "Foto utama yang sudah diverifikasi tidak dapat dihapus"
            });
        }

        // Delete file from filesystem
        if (fs.existsSync(dataset.image_path)) {
            fs.unlinkSync(dataset.image_path);
        }

        // Delete from database
        await dataset.destroy();

        res.status(200).json({
            success: true,
            message: "Dataset berhasil dihapus"
        });

    } catch (error) {
        console.error('Delete face dataset error:', error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan server"
        });
    }
};

/**
 * Set Primary Face Dataset
 */
export const setPrimaryDataset = async (req, res) => {
    try {
        const { datasetId } = req.params;

        // Find dataset
        const dataset = await FaceDatasets.findOne({
            where: {
                id: parseInt(datasetId),
                user_id: req.session.userId,
                verification_status: 'approved'
            }
        });

        if (!dataset) {
            return res.status(404).json({
                success: false,
                message: "Dataset tidak ditemukan atau belum diverifikasi"
            });
        }

        // Unset other primary datasets for this user
        await FaceDatasets.update(
            { is_primary: false },
            {
                where: {
                    user_id: req.session.userId,
                    id: { [db.Sequelize.Op.ne]: parseInt(datasetId) }
                }
            }
        );

        // Set this dataset as primary
        await dataset.update({ is_primary: true });

        res.status(200).json({
            success: true,
            message: "Foto utama berhasil diatur",
            data: {
                dataset: {
                    id: dataset.id,
                    image_name: dataset.image_name,
                    is_primary: dataset.is_primary
                }
            }
        });

    } catch (error) {
        console.error('Set primary dataset error:', error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan server"
        });
    }
};

// ===============================================
// ADMIN CONTROLLERS FOR FACE DATASET VERIFICATION
// ===============================================

/**
 * Get Pending Face Datasets for Verification (Admin Only)
 */
export const getPendingDatasets = async (req, res) => {
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
            user_id,
            image_quality
        } = req.query;

        // Build where clause
        const whereClause = { verification_status: 'pending' };

        if (user_id) {
            whereClause.user_id = parseInt(user_id);
        }
        if (image_quality) {
            whereClause.image_quality = image_quality;
        }

        // Calculate offset
        const offset = (parseInt(page) - 1) * parseInt(limit);

        // Get pending datasets with pagination
        const { count, rows: datasets } = await FaceDatasets.findAndCountAll({
            where: whereClause,
            include: [{
                model: Users,
                as: 'user',
                attributes: ['id', 'user_id', 'full_name', 'email', 'role']
            }],
            order: [['created_at', 'ASC']],
            limit: parseInt(limit),
            offset: offset
        });

        // Calculate pagination info
        const totalPages = Math.ceil(count / parseInt(limit));

        res.status(200).json({
            success: true,
            data: {
                datasets: datasets.map(dataset => ({
                    id: dataset.id,
                    user: dataset.user,
                    image_name: dataset.image_name,
                    image_path: dataset.image_path.replace(process.cwd(), ''),
                    image_quality: dataset.image_quality,
                    is_primary: dataset.is_primary,
                    upload_method: dataset.upload_method,
                    created_at: dataset.created_at
                })),
                pagination: {
                    currentPage: parseInt(page),
                    totalPages,
                    totalItems: count,
                    itemsPerPage: parseInt(limit)
                }
            }
        });

    } catch (error) {
        console.error('Get pending datasets error:', error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan server"
        });
    }
};

/**
 * Verify Face Dataset (Admin Only)
 */
export const verifyFaceDataset = async (req, res) => {
    try {
        // Check if user is super admin
        if (req.session.userRole !== 'super-admin') {
            return res.status(403).json({
                success: false,
                message: "Akses ditolak. Hanya super admin yang diizinkan."
            });
        }

        const { datasetId } = req.params;
        const {
            verification_status,
            image_quality,
            notes
        } = req.body;

        // Validation
        if (!['approved', 'rejected'].includes(verification_status)) {
            return res.status(400).json({
                success: false,
                message: "Status verifikasi tidak valid"
            });
        }

        // Find dataset
        const dataset = await FaceDatasets.findByPk(parseInt(datasetId), {
            include: [{
                model: Users,
                as: 'user',
                attributes: ['full_name', 'email']
            }]
        });

        if (!dataset) {
            return res.status(404).json({
                success: false,
                message: "Dataset tidak ditemukan"
            });
        }

        if (dataset.verification_status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: "Dataset sudah diverifikasi sebelumnya"
            });
        }

        // Update dataset
        await dataset.update({
            verification_status,
            image_quality: image_quality || dataset.image_quality,
            verified_by: req.session.userId,
            verified_at: new Date()
        });

        // If rejected, remove the file
        if (verification_status === 'rejected') {
            if (fs.existsSync(dataset.image_path)) {
                fs.unlinkSync(dataset.image_path);
            }
        }

        res.status(200).json({
            success: true,
            message: `Dataset berhasil ${verification_status === 'approved' ? 'disetujui' : 'ditolak'}`,
            data: {
                dataset: {
                    id: dataset.id,
                    user_name: dataset.user.full_name,
                    image_name: dataset.image_name,
                    verification_status: dataset.verification_status,
                    verified_at: dataset.verified_at
                }
            }
        });

    } catch (error) {
        console.error('Verify face dataset error:', error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan server"
        });
    }
};

/**
 * Bulk Verify Face Datasets (Admin Only)
 */
export const bulkVerifyDatasets = async (req, res) => {
    try {
        // Check if user is super admin
        if (req.session.userRole !== 'super-admin') {
            return res.status(403).json({
                success: false,
                message: "Akses ditolak. Hanya super admin yang diizinkan."
            });
        }

        const { datasetIds, verification_status } = req.body;

        // Validation
        if (!Array.isArray(datasetIds) || datasetIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Array dataset IDs harus disediakan"
            });
        }

        if (!['approved', 'rejected'].includes(verification_status)) {
            return res.status(400).json({
                success: false,
                message: "Status verifikasi tidak valid"
            });
        }

        // Find datasets
        const datasets = await FaceDatasets.findAll({
            where: {
                id: {
                    [db.Sequelize.Op.in]: datasetIds
                },
                verification_status: 'pending'
            }
        });

        if (datasets.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Tidak ada dataset pending yang ditemukan"
            });
        }

        // Update datasets
        const updatePromises = datasets.map(dataset => {
            // If rejecting, delete the file
            if (verification_status === 'rejected' && fs.existsSync(dataset.image_path)) {
                fs.unlinkSync(dataset.image_path);
            }

            return dataset.update({
                verification_status,
                verified_by: req.session.userId,
                verified_at: new Date()
            });
        });

        await Promise.all(updatePromises);

        res.status(200).json({
            success: true,
            message: `${datasets.length} dataset berhasil ${verification_status === 'approved' ? 'disetujui' : 'ditolak'}`,
            data: {
                updatedCount: datasets.length,
                requestedCount: datasetIds.length
            }
        });

    } catch (error) {
        console.error('Bulk verify datasets error:', error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan server"
        });
    }
};

/**
 * Get All Face Datasets (Admin Only)
 */
export const getAllFaceDatasets = async (req, res) => {
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
            verification_status,
            user_id,
            image_quality
        } = req.query;

        // Build where clause
        const whereClause = {};

        if (verification_status) {
            whereClause.verification_status = verification_status;
        }
        if (user_id) {
            whereClause.user_id = parseInt(user_id);
        }
        if (image_quality) {
            whereClause.image_quality = image_quality;
        }

        // Calculate offset
        const offset = (parseInt(page) - 1) * parseInt(limit);

        // Get datasets with pagination
        const { count, rows: datasets } = await FaceDatasets.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: Users,
                    as: 'user',
                    attributes: ['id', 'user_id', 'full_name', 'email', 'role']
                },
                {
                    model: Users,
                    as: 'verifier',
                    attributes: ['full_name'],
                    required: false
                }
            ],
            order: [['created_at', 'DESC']],
            limit: parseInt(limit),
            offset: offset
        });

        // Calculate pagination info
        const totalPages = Math.ceil(count / parseInt(limit));

        // Get statistics
        const stats = await FaceDatasets.findAll({
            attributes: [
                'verification_status',
                [db.Sequelize.fn('COUNT', db.Sequelize.col('verification_status')), 'count']
            ],
            group: ['verification_status']
        });

        const statistics = {
            pending: 0,
            approved: 0,
            rejected: 0
        };

        stats.forEach(stat => {
            statistics[stat.verification_status] = parseInt(stat.dataValues.count);
        });

        res.status(200).json({
            success: true,
            data: {
                datasets,
                statistics,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages,
                    totalItems: count,
                    itemsPerPage: parseInt(limit)
                }
            }
        });

    } catch (error) {
        console.error('Get all face datasets error:', error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan server"
        });
    }
};
