import express from "express";
import { 
    getAttendanceHistory, 
    getCourses, 
    exportToExcel, 
    exportToPDF 
} from "../../controllers/administrator/attendanceController.js";

const router = express.Router();

// Attendance History Routes
router.get('/history', getAttendanceHistory);
router.get('/courses', getCourses);
router.get('/export', (req, res) => {
    const format = req.query.format;
    if (format === 'excel') {
        exportToExcel(req, res);
    } else if (format === 'pdf') {
        exportToPDF(req, res);
    } else {
        res.status(400).json({
            success: false,
            message: 'Invalid export format. Use "excel" or "pdf"'
        });
    }
});

export default router;