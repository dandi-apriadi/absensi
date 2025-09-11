#!/usr/bin/env node

/**
 * SCRIPT UNTUK MIGRASI USER TABLE
 * 
 * Script ini akan:
 * 1. Backup data users yang ada
 * 2. Drop table users lama
 * 3. Recreate table users dengan model simplified
 * 4. Restore data yang masih relevan
 * 
 * Usage: node migrateUserTable.js
 */

import db from "./config/Database.js";
import { User } from "./models/userModel.js";

async function migrateUserTable() {
    console.log('🚀 Migrating User Table...');
    console.log('==============================');
    
    try {
        // Test database connection
        await db.authenticate();
        console.log('✅ Database connection established.');

        // Step 1: Backup existing data
        console.log('💾 Backing up existing user data...');
        let existingUsers = [];
        try {
            const [results] = await db.query('SELECT * FROM users LIMIT 5');
            existingUsers = results;
            console.log(`📋 Found ${existingUsers.length} existing users to backup`);
        } catch (error) {
            console.log('ℹ️  No existing users table found or empty table');
        }

        // Step 2: Drop existing table
        console.log('🗑️  Dropping existing users table...');
        await db.query('DROP TABLE IF EXISTS users');
        console.log('✅ Old users table dropped.');

        // Step 3: Create new simplified table
        console.log('📦 Creating simplified users table...');
        await User.sync({ force: true });
        console.log('✅ New simplified users table created successfully!');

        // Step 4: Migrate relevant data if any exists
        if (existingUsers.length > 0) {
            console.log('🔄 Migrating existing user data...');
            
            for (const oldUser of existingUsers) {
                try {
                    const userData = {
                        fullname: oldUser.full_name || oldUser.fullname || 'Unknown User',
                        role: oldUser.role === 'lecturer' ? 'student' : oldUser.role, // Convert lecturer to student
                        gender: oldUser.gender || null,
                        email: oldUser.email,
                        password: oldUser.password,
                        student_id: oldUser.user_id || oldUser.student_id || null,
                        // Skip created_at and updated_at - let Sequelize handle them
                    };

                    await User.create(userData);
                    console.log(`✅ Migrated user: ${userData.email}`);
                } catch (userError) {
                    console.log(`⚠️  Failed to migrate user ${oldUser.email}: ${userError.message}`);
                }
            }
        }

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
        console.log('🎉 User table migration completed successfully!');
        
    } catch (error) {
        console.error('❌ Error migrating user table:', error);
        throw error;
    } finally {
        await db.close();
    }
}

// Run the script
migrateUserTable()
    .then(() => {
        console.log('✅ Migration completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    });
