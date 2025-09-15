import mysql from 'mysql2/promise';

async function checkTableStructure() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'elearning'
  });

  try {
    // Cek struktur tabel student_attendances
    const [attendanceFields] = await connection.execute("DESCRIBE student_attendances");
    console.log('student_attendances table structure:');
    console.log(JSON.stringify(attendanceFields, null, 2));
    
    // Cek struktur tabel face_recognition_logs
    const [faceLogFields] = await connection.execute("DESCRIBE face_recognition_logs");
    console.log('\nface_recognition_logs table structure:');
    console.log(JSON.stringify(faceLogFields, null, 2));
    
    // Cek data yang ada
    const [attendanceData] = await connection.execute("SELECT * FROM student_attendances LIMIT 5");
    console.log('\nSample student_attendances data:');
    console.log(JSON.stringify(attendanceData, null, 2));
    
    const [faceLogData] = await connection.execute("SELECT * FROM face_recognition_logs LIMIT 5");
    console.log('\nSample face_recognition_logs data:');
    console.log(JSON.stringify(faceLogData, null, 2));
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.end();
  }
}

checkTableStructure();