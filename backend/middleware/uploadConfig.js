import multer from 'multer';
import path from 'path';
import fs from 'fs';

// ===============================================
// MULTER CONFIGURATION FOR FILE UPLOADS
// ===============================================

// Ensure upload directories exist
const ensureDirectoryExists = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

// Face dataset storage configuration
const faceDatasetStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(process.cwd(), 'backend', 'public', 'uploads', 'face-datasets');
        ensureDirectoryExists(uploadPath);
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const userId = req.session.userId || 'unknown';
        const timestamp = Date.now();
        const extension = path.extname(file.originalname);
        const filename = `face_${userId}_${timestamp}${extension}`;
        cb(null, filename);
    }
});

// Profile image storage configuration
const profileImageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(process.cwd(), 'backend', 'public', 'images', 'profiles');
        ensureDirectoryExists(uploadPath);
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const userId = req.session.userId || 'unknown';
        const timestamp = Date.now();
        const extension = path.extname(file.originalname);
        const filename = `profile_${userId}_${timestamp}${extension}`;
        cb(null, filename);
    }
});

// File filter for images
const imageFileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only image files (JPEG, JPG, PNG, GIF) are allowed'), false);
    }
};

// Multer instances
export const uploadFaceDataset = multer({
    storage: faceDatasetStorage,
    fileFilter: imageFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 10 // Maximum 10 files at once
    }
});

export const uploadProfileImage = multer({
    storage: profileImageStorage,
    fileFilter: imageFileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024, // 2MB limit
        files: 1 // Only 1 file
    }
});

// General file upload (for other purposes)
export const uploadGeneral = multer({
    dest: path.join(process.cwd(), 'backend', 'public', 'uploads', 'temp'),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
        files: 5
    }
});

// Error handling middleware for multer
export const handleMulterError = (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File terlalu besar. Maksimal ukuran file adalah 5MB.'
            });
        }
        if (error.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                success: false,
                message: 'Terlalu banyak file. Maksimal 10 file per upload.'
            });
        }
        if (error.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({
                success: false,
                message: 'Field file tidak sesuai dengan yang diharapkan.'
            });
        }
    }

    if (error.message === 'Only image files (JPEG, JPG, PNG, GIF) are allowed') {
        return res.status(400).json({
            success: false,
            message: 'Hanya file gambar (JPEG, JPG, PNG, GIF) yang diperbolehkan.'
        });
    }

    next(error);
};

// File cleanup utility
export const cleanupFile = (filePath) => {
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`File deleted: ${filePath}`);
        }
    } catch (error) {
        console.error(`Error deleting file ${filePath}:`, error);
    }
};

// Multiple file cleanup
export const cleanupFiles = (filePaths) => {
    if (Array.isArray(filePaths)) {
        filePaths.forEach(filePath => cleanupFile(filePath));
    }
};
