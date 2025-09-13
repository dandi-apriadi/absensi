// Migration script to add lecturer_name field to course_classes table
import db from '../config/Database.js';

const addLecturerNameField = async () => {
    try {
        console.log('🔄 Starting migration: Adding lecturer_name field to course_classes table...');
        
        // Add lecturer_name column if it doesn't exist
        const [results] = await db.query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_NAME = 'course_classes' 
            AND COLUMN_NAME = 'lecturer_name' 
            AND TABLE_SCHEMA = DATABASE()
        `);
        
        if (results.length === 0) {
            await db.query(`
                ALTER TABLE course_classes 
                ADD COLUMN lecturer_name VARCHAR(100) NULL 
                COMMENT 'Nama dosen pengampu mata kuliah' 
                AFTER lecturer_id
            `);
            console.log('✅ Successfully added lecturer_name field to course_classes table');
        } else {
            console.log('ℹ️  lecturer_name field already exists in course_classes table');
        }
        
        // Sync database to ensure all changes are applied
        await db.sync({ alter: true });
        console.log('✅ Database synchronized successfully');
        
    } catch (error) {
        console.error('❌ Migration failed:', error);
        throw error;
    }
};

// Run migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    addLecturerNameField()
        .then(() => {
            console.log('🎉 Migration completed successfully!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 Migration failed:', error);
            process.exit(1);
        });
}

export default addLecturerNameField;