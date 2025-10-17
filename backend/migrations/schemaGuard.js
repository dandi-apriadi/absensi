// Lightweight schema guard to auto-fix critical column mismatches in production
// Safe to run repeatedly (idempotent per column/index check)
import db from '../config/Database.js';

async function columnExists(table, column) {
  const [rows] = await db.query(
    `SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = :table AND COLUMN_NAME = :column 
     LIMIT 1`,
    { replacements: { table, column } }
  );
  return Array.isArray(rows) ? rows.length > 0 : !!rows;
}

async function createIndexIfNotExists(table, indexName, indexSql) {
  const [rows] = await db.query(
    `SELECT 1 FROM INFORMATION_SCHEMA.STATISTICS 
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = :table AND INDEX_NAME = :indexName 
     LIMIT 1`,
    { replacements: { table, indexName } }
  );
  const exists = Array.isArray(rows) ? rows.length > 0 : !!rows;
  if (!exists) {
    await db.query(indexSql);
    console.log(`✅ Created index ${indexName} on ${table}`);
  } else {
    console.log(`ℹ️  Index ${indexName} already exists on ${table}`);
  }
}

export async function runSchemaGuard() {
  try {
    console.log('🔍 Running schema guard checks...');

    // USERS table: ensure extra columns used by app exist
    const userColumns = [
      { name: 'status', sql: "ADD COLUMN status ENUM('active','inactive','suspended') NOT NULL DEFAULT 'active' AFTER role" },
      { name: 'gender', sql: "ADD COLUMN gender ENUM('male','female') NULL AFTER status" },
      { name: 'phone', sql: "ADD COLUMN phone VARCHAR(50) NULL AFTER email" },
      { name: 'address', sql: "ADD COLUMN address TEXT NULL AFTER phone" },
      { name: 'department', sql: "ADD COLUMN department VARCHAR(100) NULL AFTER address" },
      { name: 'birth_date', sql: "ADD COLUMN birth_date DATE NULL AFTER department" },
      { name: 'profile_picture', sql: "ADD COLUMN profile_picture VARCHAR(255) NULL AFTER birth_date" },
      { name: 'last_login', sql: "ADD COLUMN last_login DATETIME NULL AFTER profile_picture" },
      { name: 'student_id', sql: "ADD COLUMN student_id VARCHAR(191) NULL AFTER last_login" }
    ];

    for (const col of userColumns) {
      const exists = await columnExists('users', col.name);
      if (!exists) {
        await db.query(`ALTER TABLE users ${col.sql}`);
        console.log(`✅ Added users.${col.name}`);
      } else {
        console.log(`ℹ️  users.${col.name} exists`);
      }
    }

    // Ensure unique indexes on users
    await createIndexIfNotExists('users', 'idx_users_email_unique', 'CREATE UNIQUE INDEX idx_users_email_unique ON users(email)');
    await createIndexIfNotExists('users', 'idx_users_student_id_unique', 'CREATE UNIQUE INDEX idx_users_student_id_unique ON users(student_id)');

    // COURSE_CLASSES: ensure lecturer_name column (used in UI)
    const lecturerNameExists = await columnExists('course_classes', 'lecturer_name');
    if (!lecturerNameExists) {
      await db.query(`ALTER TABLE course_classes ADD COLUMN lecturer_name VARCHAR(100) NULL COMMENT 'Nama dosen pengampu mata kuliah' AFTER lecturer_id`);
      console.log('✅ Added course_classes.lecturer_name');
    } else {
      console.log('ℹ️  course_classes.lecturer_name exists');
    }

    console.log('✅ Schema guard completed');
  } catch (err) {
    console.error('❌ Schema guard error:', err?.message || err);
  }
}

export default runSchemaGuard;
