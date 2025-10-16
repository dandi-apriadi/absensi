// Migration script to add extra fields to users table
import db from '../config/Database.js';

const addColumnIfNotExists = async (table, column, definitionSql) => {
    const [results] = await db.query(`
        SELECT COLUMN_NAME 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = :table 
          AND COLUMN_NAME = :column 
          AND TABLE_SCHEMA = DATABASE()
    `, { replacements: { table, column } });

    if (results.length === 0) {
        await db.query(`ALTER TABLE ${table} ADD COLUMN ${definitionSql}`);
        console.log(`✅ Added column ${column} to ${table}`);
        return true;
    } else {
        console.log(`ℹ️  Column ${column} already exists on ${table}`);
        return false;
    }
};

const addUserExtraFields = async () => {
    try {
        console.log('🔄 Starting migration: Add extra user fields to users table...');

        const table = 'users';

        // Add columns if they don't exist
        await addColumnIfNotExists(table, 'phone', "phone VARCHAR(50) NULL AFTER email");
        await addColumnIfNotExists(table, 'address', "address TEXT NULL AFTER phone");
        await addColumnIfNotExists(table, 'department', "department VARCHAR(100) NULL AFTER address");
        await addColumnIfNotExists(table, 'birth_date', "birth_date DATE NULL AFTER department");
        await addColumnIfNotExists(table, 'status', "status ENUM('active','inactive','suspended') NOT NULL DEFAULT 'active' AFTER role");
        await addColumnIfNotExists(table, 'profile_picture', "profile_picture VARCHAR(255) NULL AFTER address");
        await addColumnIfNotExists(table, 'last_login', "last_login DATETIME NULL AFTER profile_picture");

        console.log('✅ Migration completed: Extra user fields ensured');

    } catch (error) {
        console.error('❌ Migration failed:', error);
        throw error;
    }
};

// Execute immediately when this script is run (robust for Windows path formats)
addUserExtraFields()
    .then(() => {
        console.log('🎉 Migration finished successfully.');
        if (process.env.RUN_EXIT !== 'false') process.exit(0);
    })
    .catch((err) => {
        console.error('💥 Migration encountered an error:', err.message);
        if (process.env.RUN_EXIT !== 'false') process.exit(1);
    });

export default addUserExtraFields;
