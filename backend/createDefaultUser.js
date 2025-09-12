#!/usr/bin/env node

/**
 * SCRIPT UNTUK MEMBUAT USER DEFAULT
 * 
 * Script ini akan membuat user super-admin default untuk testing
 * 
 * Usage: node createDefaultUser.js
 */

import db from "./config/Database.js";
import { User } from "./models/userModel.js";
import argon2 from "argon2";

async function createDefaultUser() {
    console.log('🚀 Creating Default User...');
    console.log('============================');
    
    try {
        // Test database connection
        await db.authenticate();
        console.log('✅ Database connection established.');

        // Check if admin user already exists
        const existingAdmin = await User.findOne({
            where: { email: 'admin@admin.com' }
        });

        if (existingAdmin) {
            console.log('ℹ️  Admin user already exists!');
            console.log('   Email: admin@admin.com');
            console.log('   Role: super-admin');
            return;
        }

        // Hash default password
        const hashedPassword = await argon2.hash('admin123');

        // Create default admin user
        const adminUser = await User.create({
            fullname: 'Super Administrator',
            email: 'admin@admin.com',
            password: hashedPassword,
            role: 'super-admin',
            gender: 'male'
        });

        console.log('✅ Default admin user created successfully!');
        console.log('');
        console.log('📋 Login Credentials:');
        console.log('   Email: admin@admin.com');
        console.log('   Password: admin123');
        console.log('   Role: super-admin');
        console.log('');
        console.log('🎉 You can now login to the system!');
        
    } catch (error) {
        console.error('❌ Error creating default user:', error);
        throw error;
    } finally {
        await db.close();
    }
}

// Run the script
createDefaultUser()
    .then(() => {
        console.log('✅ Script completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Script failed:', error);
        process.exit(1);
    });
