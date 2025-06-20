import db from './config/Database.js';

// Script untuk membersihkan database dan membuat ulang tabel
const resetDatabase = async () => {
    try {
        console.log('🔄 Starting database reset...');

        // Authenticate first
        await db.authenticate();
        console.log('✅ Database connection established');

        // Disable foreign key checks
        await db.query('SET FOREIGN_KEY_CHECKS = 0');
        console.log('🔐 Foreign key checks disabled');

        // Get all tables in the database
        const [tables] = await db.query(`
            SELECT TABLE_NAME 
            FROM INFORMATION_SCHEMA.TABLES 
            WHERE TABLE_SCHEMA = DATABASE()
            AND TABLE_TYPE = 'BASE TABLE'
        `);

        console.log(`📋 Found ${tables.length} tables to drop`);

        // Drop all tables
        for (const table of tables) {
            try {
                await db.query(`DROP TABLE IF EXISTS \`${table.TABLE_NAME}\``);
                console.log(`🗑️  Dropped table: ${table.TABLE_NAME}`);
            } catch (error) {
                console.log(`⚠️  Could not drop table ${table.TABLE_NAME}: ${error.message}`);
            }
        }

        // Re-enable foreign key checks
        await db.query('SET FOREIGN_KEY_CHECKS = 1');
        console.log('🔐 Foreign key checks re-enabled');

        console.log('✅ Database reset completed successfully');
        console.log('🚀 Now run your main application to recreate tables');

    } catch (error) {
        console.error('❌ Database reset failed:', error);

        // Make sure to re-enable foreign key checks even on error
        try {
            await db.query('SET FOREIGN_KEY_CHECKS = 1');
        } catch (fkError) {
            console.error('❌ Could not re-enable foreign key checks:', fkError);
        }

        process.exit(1);
    } finally {
        // Close the database connection
        await db.close();
        console.log('🔌 Database connection closed');
        process.exit(0);
    }
};

// Run the reset
resetDatabase();
