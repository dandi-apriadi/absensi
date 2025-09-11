#!/usr/bin/env node

/**
 * SCRIPT UNTUK RESET USER TABLE
 * 
 * Script ini akan:
 * 1. Drop table users yang ada (dengan 30+ fields)
 * 2. Recreate table users dengan model yang simplified
 * 
 * Usage: node resetUserTable.js
 */

import db from "./config/Database.js";
import { User } from "./models/userModel.js";

async function resetUserTable() {
    console.log('🚀 Resetting User Table...');
    console.log('============================');
    
    try {
        // Test database connection
        await db.authenticate();
        console.log('✅ Database connection established.');

        // Drop existing users table if exists
        console.log('🗑️  Dropping existing users table...');
        await db.query('DROP TABLE IF EXISTS users');
        console.log('✅ Old users table dropped.');

        // Sync User model to create new simplified table
        console.log('📦 Creating simplified users table...');
        await User.sync({ force: true });
        console.log('✅ New simplified users table created successfully!');

        console.log('');
        console.log('📋 New users table structure:');
        console.log('   - user_id (UUID, Primary Key)');
        console.log('   - fullname (String)');
        console.log('   - role (super-admin | student)');
        console.log('   - gender (male | female)');
        console.log('   - email (String, Unique)');
        console.log('   - password (String, Hashed)');
        console.log('   - student_id (String, Unique, Optional)');
        console.log('   - created_at (DateTime)');
        console.log('   - updated_at (DateTime)');
        console.log('');
        console.log('🎉 User table reset completed successfully!');
        
    } catch (error) {
        console.error('❌ Error resetting user table:', error);
        throw error;
    } finally {
        await db.close();
    }
}

// Run the script
resetUserTable()
    .then(() => {
        console.log('✅ Script completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Script failed:', error);
        process.exit(1);
    });
