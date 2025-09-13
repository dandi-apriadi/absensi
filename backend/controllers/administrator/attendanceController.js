import { Op, QueryTypes } from 'sequelize';
import db from '../../config/Database.js';
import { StudentAttendances, AttendanceSessions } from '../../models/attendanceModel.js';
import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';

// Get attendance history with filtering, pagination, and statistics
export const getAttendanceHistory = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            course = '',
            status = '',
            startDate = '',
            endDate = '',
            search = ''
        } = req.query;

        const offset = (parseInt(page) - 1) * parseInt(limit);
        
        // Build where conditions
        let whereConditions = {};
        let sessionWhereConditions = {};
        
        // Status filter
        if (status && status !== 'all') {
            whereConditions.status = status;
        }
        
        // Date range filter
        if (startDate || endDate) {
            const dateFilter = {};
            if (startDate) dateFilter[Op.gte] = new Date(startDate);
            if (endDate) dateFilter[Op.lte] = new Date(endDate + ' 23:59:59');
            whereConditions.attendance_date = dateFilter;
        }
        
        // Course filter
        if (course && course !== 'all') {
            sessionWhereConditions.class_id = course;
        }

        // Build the complex query using raw SQL for better performance
        let baseQuery = `
            SELECT 
                sa.id,
                sa.check_in_time as attendance_date,
                CAST(sa.check_in_time AS TIME) as attendance_time,
                sa.status,
                sa.attendance_method as verification_method,
                COALESCE(verifier.fullname, 'System') as verified_by,
                sa.notes,
                u.student_id as student_nim,
                u.fullname as student_name,
                cc.course_name,
                cc.course_code,
                cc.class_name,
                'N/A' as room_name,
                asess.session_number,
                asess.topic
            FROM student_attendances sa
            LEFT JOIN attendance_sessions asess ON sa.session_id = asess.id
            LEFT JOIN users u ON sa.student_id = u.user_id
            LEFT JOIN course_classes cc ON asess.class_id = cc.id
            LEFT JOIN users verifier ON sa.verified_by = verifier.user_id
            WHERE 1=1
        `;
        
        let queryParams = [];
        let paramIndex = 1;
        
        // Add filters to query
        if (status && status !== 'all') {
            baseQuery += ` AND sa.status = $${paramIndex}`;
            queryParams.push(status);
            paramIndex++;
        }
        
        if (startDate) {
            baseQuery += ` AND DATE(sa.check_in_time) >= $${paramIndex}`;
            queryParams.push(startDate);
            paramIndex++;
        }
        
        if (endDate) {
            baseQuery += ` AND DATE(sa.check_in_time) <= $${paramIndex}`;
            queryParams.push(endDate);
            paramIndex++;
        }
        
        if (course && course !== 'all') {
            baseQuery += ` AND asess.class_id = $${paramIndex}`;
            queryParams.push(course);
            paramIndex++;
        }
        
        if (search) {
            baseQuery += ` AND (u.fullname ILIKE $${paramIndex} OR u.student_id ILIKE $${paramIndex + 1} OR cc.course_name ILIKE $${paramIndex + 2})`;
            queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
            paramIndex += 3;
        }
        
        // Get total count
        const countQuery = `
            SELECT COUNT(*) as total
            FROM (${baseQuery}) as filtered_results
        `;
        
        const [countResult] = await db.query(countQuery, {
            bind: queryParams,
            type: QueryTypes.SELECT
        });
        
        const totalRecords = parseInt(countResult.total);
        const totalPages = Math.ceil(totalRecords / parseInt(limit));
        
        // Add pagination to main query
        baseQuery += ` ORDER BY sa.check_in_time DESC`;
        baseQuery += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
        queryParams.push(parseInt(limit), offset);
        
        // Execute main query
        const records = await db.query(baseQuery, {
            bind: queryParams,
            type: QueryTypes.SELECT
        });
        
        // Get statistics
        const statsQuery = `
            SELECT 
                COUNT(*) as total_records,
                COUNT(CASE WHEN sa.status = 'present' THEN 1 END) as present,
                COUNT(CASE WHEN sa.status = 'late' THEN 1 END) as late,
                COUNT(CASE WHEN sa.status = 'absent' THEN 1 END) as absent,
                COUNT(CASE WHEN sa.status = 'excused' OR sa.status = 'sick' THEN 1 END) as excused
            FROM student_attendances sa
            LEFT JOIN attendance_sessions asess ON sa.session_id = asess.id
            LEFT JOIN users u ON sa.student_id = u.user_id
            LEFT JOIN course_classes cc ON asess.class_id = cc.id
            WHERE 1=1
        `;
        
        let statsQueryWithFilters = statsQuery;
        let statsParams = [];
        let statsParamIndex = 1;
        
        // Apply same filters to statistics
        if (status && status !== 'all') {
            statsQueryWithFilters += ` AND sa.status = $${statsParamIndex}`;
            statsParams.push(status);
            statsParamIndex++;
        }
        
        if (startDate) {
            statsQueryWithFilters += ` AND DATE(sa.check_in_time) >= $${statsParamIndex}`;
            statsParams.push(startDate);
            statsParamIndex++;
        }
        
        if (endDate) {
            statsQueryWithFilters += ` AND DATE(sa.check_in_time) <= $${statsParamIndex}`;
            statsParams.push(endDate);
            statsParamIndex++;
        }
        
        if (course && course !== 'all') {
            statsQueryWithFilters += ` AND asess.class_id = $${statsParamIndex}`;
            statsParams.push(course);
            statsParamIndex++;
        }
        
        if (search) {
            statsQueryWithFilters += ` AND (u.fullname ILIKE $${statsParamIndex} OR u.student_id ILIKE $${statsParamIndex + 1} OR cc.course_name ILIKE $${statsParamIndex + 2})`;
            statsParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }
        
        const [statistics] = await db.query(statsQueryWithFilters, {
            bind: statsParams,
            type: QueryTypes.SELECT
        });
        
        res.json({
            success: true,
            data: {
                records: records || [],
                totalRecords,
                totalPages,
                currentPage: parseInt(page),
                recordsPerPage: parseInt(limit),
                statistics: {
                    totalRecords: parseInt(statistics.total_records) || 0,
                    present: parseInt(statistics.present) || 0,
                    late: parseInt(statistics.late) || 0,
                    absent: parseInt(statistics.absent) || 0,
                    excused: parseInt(statistics.excused) || 0
                }
            },
            message: 'Attendance history retrieved successfully'
        });
        
    } catch (error) {
        console.error('Error fetching attendance history:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error: ' + error.message
        });
    }
};

// Get courses for dropdown filter
export const getCourses = async (req, res) => {
    try {
        const coursesQuery = `
            SELECT DISTINCT
                cc.id,
                cc.course_name as name,
                cc.course_code,
                cc.class_name
            FROM course_classes cc
            INNER JOIN attendance_sessions asess ON cc.id = asess.class_id
            WHERE cc.active = true
            ORDER BY cc.course_name, cc.class_name
        `;
        
        const courses = await db.query(coursesQuery, {
            type: QueryTypes.SELECT
        });
        
        res.json({
            success: true,
            data: courses || [],
            message: 'Courses retrieved successfully'
        });
        
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error: ' + error.message
        });
    }
};

// Export attendance data to Excel
export const exportToExcel = async (req, res) => {
    try {
        const {
            course = '',
            status = '',
            startDate = '',
            endDate = '',
            search = ''
        } = req.query;

        // Use the same query logic as getAttendanceHistory but without pagination
        let baseQuery = `
            SELECT 
                sa.check_in_time as attendance_date,
                CAST(sa.check_in_time AS TIME) as attendance_time,
                sa.status,
                sa.attendance_method as verification_method,
                COALESCE(verifier.fullname, 'System') as verified_by,
                sa.notes,
                u.student_id as student_nim,
                u.fullname as student_name,
                cc.course_name,
                cc.course_code,
                cc.class_name,
                'N/A' as room_name,
                asess.session_number,
                asess.topic
            FROM student_attendances sa
            LEFT JOIN attendance_sessions asess ON sa.session_id = asess.id
            LEFT JOIN users u ON sa.student_id = u.user_id
            LEFT JOIN course_classes cc ON asess.class_id = cc.id
            LEFT JOIN users verifier ON sa.verified_by = verifier.user_id
            WHERE 1=1
        `;
        
        let queryParams = [];
        let paramIndex = 1;
        
        // Add filters
        if (status && status !== 'all') {
            baseQuery += ` AND sa.status = $${paramIndex}`;
            queryParams.push(status);
            paramIndex++;
        }
        
        if (startDate) {
            baseQuery += ` AND DATE(sa.check_in_time) >= $${paramIndex}`;
            queryParams.push(startDate);
            paramIndex++;
        }
        
        if (endDate) {
            baseQuery += ` AND DATE(sa.check_in_time) <= $${paramIndex}`;
            queryParams.push(endDate);
            paramIndex++;
        }
        
        if (course && course !== 'all') {
            baseQuery += ` AND asess.class_id = $${paramIndex}`;
            queryParams.push(course);
            paramIndex++;
        }
        
        if (search) {
            baseQuery += ` AND (u.fullname ILIKE $${paramIndex} OR u.student_id ILIKE $${paramIndex + 1} OR cc.course_name ILIKE $${paramIndex + 2})`;
            queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }
        
        baseQuery += ` ORDER BY sa.check_in_time DESC`;
        
        const records = await db.query(baseQuery, {
            bind: queryParams,
            type: QueryTypes.SELECT
        });

        // Create workbook
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Riwayat Absensi');

        // Add headers
        worksheet.columns = [
            { header: 'Tanggal', key: 'attendance_date', width: 15 },
            { header: 'Waktu', key: 'attendance_time', width: 10 },
            { header: 'NIM', key: 'student_nim', width: 15 },
            { header: 'Nama Mahasiswa', key: 'student_name', width: 25 },
            { header: 'Mata Kuliah', key: 'course_name', width: 25 },
            { header: 'Kode MK', key: 'course_code', width: 10 },
            { header: 'Kelas', key: 'class_name', width: 15 },
            { header: 'Ruangan', key: 'room_name', width: 15 },
            { header: 'Status', key: 'status', width: 12 },
            { header: 'Metode Verifikasi', key: 'verification_method', width: 20 },
            { header: 'Diverifikasi Oleh', key: 'verified_by', width: 20 },
            { header: 'Catatan', key: 'notes', width: 30 }
        ];

        // Add data
        records.forEach(record => {
            worksheet.addRow({
                attendance_date: record.attendance_date,
                attendance_time: record.attendance_time || '-',
                student_nim: record.student_nim,
                student_name: record.student_name,
                course_name: record.course_name,
                course_code: record.course_code,
                class_name: record.class_name,
                room_name: record.room_name || '-',
                status: record.status,
                verification_method: record.verification_method || '-',
                verified_by: record.verified_by || 'System',
                notes: record.notes || '-'
            });
        });

        // Style headers
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE6E6FA' }
        };

        // Set response headers
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="attendance_history_${new Date().toISOString().split('T')[0]}.xlsx"`);

        // Send the file
        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        console.error('Error exporting to Excel:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to export data: ' + error.message
        });
    }
};

// Export attendance data to PDF
export const exportToPDF = async (req, res) => {
    try {
        const {
            course = '',
            status = '',
            startDate = '',
            endDate = '',
            search = ''
        } = req.query;

        // Use the same query logic as exportToExcel
        let baseQuery = `
            SELECT 
                sa.check_in_time as attendance_date,
                CAST(sa.check_in_time AS TIME) as attendance_time,
                sa.status,
                u.student_id as student_nim,
                u.fullname as student_name,
                cc.course_name,
                cc.class_name,
                'N/A' as room_name
            FROM student_attendances sa
            LEFT JOIN attendance_sessions asess ON sa.session_id = asess.id
            LEFT JOIN users u ON sa.student_id = u.user_id
            LEFT JOIN course_classes cc ON asess.class_id = cc.id
            WHERE 1=1
        `;
        
        let queryParams = [];
        let paramIndex = 1;
        
        // Add filters (same logic as before)
        if (status && status !== 'all') {
            baseQuery += ` AND sa.status = $${paramIndex}`;
            queryParams.push(status);
            paramIndex++;
        }
        
        if (startDate) {
            baseQuery += ` AND DATE(sa.check_in_time) >= $${paramIndex}`;
            queryParams.push(startDate);
            paramIndex++;
        }
        
        if (endDate) {
            baseQuery += ` AND DATE(sa.check_in_time) <= $${paramIndex}`;
            queryParams.push(endDate);
            paramIndex++;
        }
        
        if (course && course !== 'all') {
            baseQuery += ` AND asess.class_id = $${paramIndex}`;
            queryParams.push(course);
            paramIndex++;
        }
        
        if (search) {
            baseQuery += ` AND (u.fullname ILIKE $${paramIndex} OR u.student_id ILIKE $${paramIndex + 1} OR cc.course_name ILIKE $${paramIndex + 2})`;
            queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }
        
        baseQuery += ` ORDER BY sa.check_in_time DESC LIMIT 1000`; // Limit for PDF performance
        
        const records = await db.query(baseQuery, {
            bind: queryParams,
            type: QueryTypes.SELECT
        });

        // Create PDF
        const doc = new PDFDocument({ margin: 50 });
        
        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="attendance_history_${new Date().toISOString().split('T')[0]}.pdf"`);
        
        // Pipe PDF to response
        doc.pipe(res);

        // Add title
        doc.fontSize(16).font('Helvetica-Bold').text('Laporan Riwayat Absensi', 50, 50);
        doc.fontSize(10).font('Helvetica').text(`Generated: ${new Date().toLocaleDateString('id-ID')}`, 50, 75);
        
        // Add filters info
        let filterInfo = [];
        if (course && course !== 'all') filterInfo.push(`Course: ${course}`);
        if (status && status !== 'all') filterInfo.push(`Status: ${status}`);
        if (startDate) filterInfo.push(`From: ${startDate}`);
        if (endDate) filterInfo.push(`To: ${endDate}`);
        if (search) filterInfo.push(`Search: ${search}`);
        
        if (filterInfo.length > 0) {
            doc.text(`Filters: ${filterInfo.join(', ')}`, 50, 90);
        }

        // Add table headers
        const startY = 120;
        let currentY = startY;
        
        doc.fontSize(8).font('Helvetica-Bold');
        doc.text('Date', 50, currentY);
        doc.text('Time', 100, currentY);
        doc.text('NIM', 140, currentY);
        doc.text('Name', 190, currentY);
        doc.text('Course', 280, currentY);
        doc.text('Status', 380, currentY);
        doc.text('Room', 430, currentY);
        
        currentY += 20;
        
        // Add records
        doc.fontSize(7).font('Helvetica');
        records.forEach(record => {
            if (currentY > 750) { // New page if needed
                doc.addPage();
                currentY = 50;
            }
            
            doc.text(record.attendance_date || '-', 50, currentY);
            doc.text(record.attendance_time || '-', 100, currentY);
            doc.text(record.student_nim || '-', 140, currentY);
            doc.text((record.student_name || '-').substring(0, 15), 190, currentY);
            doc.text((record.course_name || '-').substring(0, 20), 280, currentY);
            doc.text(record.status || '-', 380, currentY);
            doc.text((record.room_name || '-').substring(0, 10), 430, currentY);
            
            currentY += 12;
        });

        // Add footer
        doc.fontSize(8).text(`Total Records: ${records.length}`, 50, currentY + 20);
        
        // Finalize PDF
        doc.end();

    } catch (error) {
        console.error('Error exporting to PDF:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to export PDF: ' + error.message
        });
    }
};