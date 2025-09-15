import mysql from 'mysql2/promise';

async function checkClassData() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: '',
            database: 'elearning'
        });
        
        console.log('\n=== CHECKING CLASS SCHEDULE DATA ===');
        
        // Check course_classes table
        const [classes] = await connection.execute('SELECT * FROM course_classes LIMIT 5');
        console.log('\nCourse Classes:');
        console.table(classes);
        
        // Check attendance_sessions table  
        const [sessions] = await connection.execute('SELECT * FROM attendance_sessions WHERE session_date >= CURDATE() LIMIT 5');
        console.log('\nAttendance Sessions (today and future):');
        console.table(sessions);
        
        // Check student_enrollments table
        const [students] = await connection.execute('SELECT se.*, u.fullname FROM student_enrollments se JOIN users u ON se.student_id = u.user_id LIMIT 5');
        console.log('\nStudent Enrollments:');
        console.table(students);
        
        // Check for specific user Dandi
        const [dandi] = await connection.execute('SELECT * FROM users WHERE fullname LIKE ?', ['%dandi%']);
        console.log('\nDandi User Data:');
        console.table(dandi);
        
        if (dandi.length > 0) {
            const dandiUserId = dandi[0].user_id; // Use user_id field, not id
            const [dandiClasses] = await connection.execute(`
                SELECT 
                    cc.class_name,
                    c.course_name,
                    se.student_id,
                    cc.schedule
                FROM student_enrollments se
                JOIN course_classes cc ON se.class_id = cc.id
                JOIN courses c ON cc.course_id = c.id
                WHERE se.student_id = ?
            `, [dandiUserId]);
            console.log('\nDandi Class Enrollments:');
            console.table(dandiClasses);
            
            const [dandiSessions] = await connection.execute(`
                SELECT 
                    ats.session_date,
                    ats.start_time,
                    ats.end_time,
                    ats.topic,
                    cc.class_name,
                    c.course_name
                FROM attendance_sessions ats
                JOIN course_classes cc ON ats.class_id = cc.id
                JOIN courses c ON cc.course_id = c.id
                JOIN student_enrollments se ON cc.id = se.class_id
                WHERE se.student_id = ? AND ats.session_date >= CURDATE()
            `, [dandiUserId]);
            console.log('\nDandi Scheduled Sessions:');
            console.table(dandiSessions);
        }
        
        await connection.end();
    } catch (error) {
        console.error('Error:', error);
    }
}

checkClassData();