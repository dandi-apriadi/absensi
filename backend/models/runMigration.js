#!/usr/bin/env node

/**
 * SCRIPT UNTUK MENJALANKAN MIGRATION DATABASE
 * 
 * Usage:
 * node runMigration.js --action=migrate
 * node runMigration.js --action=rollback --timestamp=2024_01_15_10_30_00
 * node runMigration.js --action=test
 */

import DatabaseMigration from './migrationScript.js';
import { syncSimplifiedModels } from './simplifiedModels.js';

const args = process.argv.slice(2);
const action = args.find(arg => arg.startsWith('--action='))?.split('=')[1] || 'test';
const timestamp = args.find(arg => arg.startsWith('--timestamp='))?.split('=')[1];

async function main() {
    console.log('🚀 Database Migration Tool');
    console.log('============================');
    
    const migration = new DatabaseMigration();
    
    try {
        switch (action) {
            case 'migrate':
                console.log('📦 Starting full migration...');
                const result = await migration.runMigration();
                console.log('✅ Migration completed successfully!');
                console.log('📋 Migration Summary:');
                console.log(`   - Timestamp: ${result.timestamp}`);
                console.log(`   - Log entries: ${result.migrationLog.length}`);
                break;
                
            case 'rollback':
                if (!timestamp) {
                    console.error('❌ Rollback requires --timestamp parameter');
                    console.log('   Example: node runMigration.js --action=rollback --timestamp=2024_01_15_10_30_00');
                    process.exit(1);
                }
                console.log(`🔄 Rolling back to timestamp: ${timestamp}`);
                await migration.rollbackMigration(timestamp);
                console.log('✅ Rollback completed successfully!');
                break;
                
            case 'test':
                console.log('🧪 Testing new simplified models...');
                await syncSimplifiedModels({ force: false, alter: false });
                console.log('✅ Simplified models are ready!');
                console.log('');
                console.log('📋 Available Models:');
                console.log('   - Users (unified table for all roles)');
                console.log('   - Courses (mata kuliah)');
                console.log('   - Rooms (ruangan)');
                console.log('   - Schedules (jadwal kuliah)');
                console.log('   - Enrollments (pendaftaran mahasiswa)');
                console.log('   - FaceDatasets (dataset wajah)');
                console.log('   - AttendanceSessions (sesi absensi)');
                console.log('   - Attendances (record absensi)');
                console.log('   - DoorAccessLogs (log akses pintu)');
                console.log('   - Notifications (notifikasi)');
                break;
                
            default:
                console.log('❌ Invalid action. Available actions:');
                console.log('   - migrate: Run full migration');
                console.log('   - rollback: Rollback to previous state');
                console.log('   - test: Test new models without migration');
                break;
        }
        
    } catch (error) {
        console.error('💥 Error:', error.message);
        console.error('📚 Stack trace:', error.stack);
        process.exit(1);
    }
}

// Menjalankan script
main().catch(console.error);
