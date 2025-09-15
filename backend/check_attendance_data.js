import mysql from 'mysql2/promise';

async function checkAttendanceData() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: '',
            database: 'elearning'
        });
        
        console.log('\n=== CHECKING ATTENDANCE DATA ===');
        
        // Check attendance_sessions table
        const [sessions] = await connection.execute('SELECT * FROM attendance_sessions ORDER BY id DESC LIMIT 10');
        console.log('\nAttendance Sessions:');
        console.table(sessions);
        
        // Check student_attendances table
        const [attendances] = await connection.execute('SELECT * FROM student_attendances ORDER BY id DESC LIMIT 10');
        console.log('\nStudent Attendances:');
        console.table(attendances);
        
        // Check face_recognition_logs table
        const [faceLogs] = await connection.execute('SELECT * FROM face_recognition_logs ORDER BY id DESC LIMIT 10');
        console.log('\nFace Recognition Logs:');
        console.table(faceLogs);
        
        // Check for class 15 specifically
        const [class15Sessions] = await connection.execute('SELECT * FROM attendance_sessions WHERE class_id = 15');
        console.log('\nAttendance Sessions for Class 15:');
        console.table(class15Sessions);
        
        // Check all course_classes
        const [classes] = await connection.execute('SELECT id, class_name, status FROM course_classes');
        console.log('\nAll Course Classes:');
        console.table(classes);
        
        await connection.end();
    } catch (error) {
        console.error('Error:', error);
    }
}

checkAttendanceData();