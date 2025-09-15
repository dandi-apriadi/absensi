import mysql from 'mysql2/promise';

async function insertTestAttendanceData() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: '',
            database: 'elearning'
        });
        
        console.log('\n=== INSERTING TEST ATTENDANCE DATA FOR CLASS 15 ===');
        
        // Insert test attendance data for session 2 (class 15)
        const currentTime = new Date();
        
        // Insert for student001 (Dandi)
        const [result1] = await connection.execute(`
            INSERT INTO student_attendances 
            (session_id, student_id, status, check_in_time, attendance_method, confidence_score, created_at, updated_at)
            VALUES (2, 'student001', 'present', ?, 'face_recognition', 0.8942, ?, ?)
        `, [currentTime, currentTime, currentTime]);
        
        console.log('✅ Inserted attendance for student001:', result1.insertId);
        
        // Insert for student002 (Siti Aminah) 
        const timeForStudent2 = new Date(currentTime.getTime() + 5 * 60 * 1000); // 5 minutes later
        const [result2] = await connection.execute(`
            INSERT INTO student_attendances 
            (session_id, student_id, status, check_in_time, attendance_method, confidence_score, created_at, updated_at)
            VALUES (2, 'student002', 'late', ?, 'face_recognition', 0.7834, ?, ?)
        `, [timeForStudent2, timeForStudent2, timeForStudent2]);
        
        console.log('✅ Inserted attendance for student002:', result2.insertId);
        
        // Insert for student003 (Budi Santoso) - absent
        const [result3] = await connection.execute(`
            INSERT INTO student_attendances 
            (session_id, student_id, status, check_in_time, attendance_method, created_at, updated_at)
            VALUES (2, 'student003', 'absent', NULL, 'manual', ?, ?)
        `, [currentTime, currentTime]);
        
        console.log('✅ Inserted attendance for student003:', result3.insertId);
        
        // Insert face recognition log for student001
        const [logResult] = await connection.execute(`
            INSERT INTO face_recognition_logs 
            (session_id, recognized_user_id, confidence_score, recognition_status, processing_time, camera_id, created_at)
            VALUES (2, 'student001', 0.8942, 'success', 150, 'camera_1', ?)
        `, [currentTime]);
        
        console.log('✅ Inserted face recognition log:', logResult.insertId);
        
        // Verify inserted data
        const [verify] = await connection.execute(`
            SELECT sa.*, u.fullname 
            FROM student_attendances sa 
            JOIN users u ON sa.student_id = u.user_id 
            WHERE sa.session_id = 2
            ORDER BY sa.check_in_time ASC
        `);
        
        console.log('\n=== VERIFICATION: Attendance Data for Session 2 (Class 15) ===');
        console.table(verify);
        
        await connection.end();
        console.log('\n✅ Test data insertion completed!');
        
    } catch (error) {
        console.error('Error:', error);
    }
}

insertTestAttendanceData();