import db from './models/index.js';

async function checkRealData() {
  try {
    // Cek data absensi yang asli
    const [attendanceRecords] = await db.sequelize.query(`
      SELECT 
        sa.id, sa.student_id, sa.attendance_time, sa.status, sa.notes,
        u.fullname, u.username,
        cc.class_name, c.course_name,
        ase.session_date, ase.start_time, ase.end_time
      FROM student_attendances sa
      JOIN users u ON sa.student_id = u.id
      JOIN attendance_sessions ase ON sa.session_id = ase.id
      JOIN course_classes cc ON ase.class_id = cc.id
      JOIN courses c ON cc.course_id = c.id
      ORDER BY sa.attendance_time DESC
      LIMIT 10
    `);
    
    console.log('Real attendance data:');
    console.log(JSON.stringify(attendanceRecords, null, 2));
    
    // Cek attendance sessions
    const [sessions] = await db.sequelize.query(`
      SELECT 
        ase.id, ase.class_id, ase.session_date, ase.start_time, ase.end_time,
        cc.class_name, c.course_name
      FROM attendance_sessions ase
      JOIN course_classes cc ON ase.class_id = cc.id
      JOIN courses c ON cc.course_id = c.id
      ORDER BY ase.session_date DESC
      LIMIT 5
    `);
    
    console.log('\nAttendance sessions:');
    console.log(JSON.stringify(sessions, null, 2));
    
    // Cek face recognition logs
    const [faceLogs] = await db.sequelize.query(`
      SELECT 
        frl.id, frl.user_id, frl.class_id, frl.recognition_time, frl.confidence_score, frl.status,
        u.fullname, u.username,
        cc.class_name, c.course_name
      FROM face_recognition_logs frl
      JOIN users u ON frl.user_id = u.id
      JOIN course_classes cc ON frl.class_id = cc.id
      JOIN courses c ON cc.course_id = c.id
      ORDER BY frl.recognition_time DESC
      LIMIT 10
    `);
    
    console.log('\nFace recognition logs:');
    console.log(JSON.stringify(faceLogs, null, 2));
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkRealData();