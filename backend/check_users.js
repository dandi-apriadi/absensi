import mysql from 'mysql2/promise';

async function checkUsers() {
  const connection = await mysql.createConnection({
    host: 'localhost', user: 'root', password: '', database: 'elearning'
  });

  try {
    const [users] = await connection.execute('SELECT * FROM users LIMIT 10');
    console.log('Users data:');
    console.log(JSON.stringify(users, null, 2));
    
    const [userFields] = await connection.execute('DESCRIBE users');
    console.log('\nUsers table structure:');
    console.log(JSON.stringify(userFields, null, 2));
  } finally {
    await connection.end();
  }
}

checkUsers();