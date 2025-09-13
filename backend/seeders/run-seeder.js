#!/usr/bin/env node

/**
 * Script untuk menambahkan mata kuliah Politeknik Negeri Manado
 * 
 * Usage:
 * node backend/seeders/run-seeder.js all                    # Seed semua program studi
 * node backend/seeders/run-seeder.js "Teknik Informatika"   # Seed program studi tertentu
 */

import fetch from 'node-fetch';
import readline from 'readline';

// Polyfill untuk axios jika tidak tersedia
global.fetch = fetch;

const API_BASE = 'http://localhost:5001';

// Data mata kuliah berdasarkan kurikulum Politeknik Negeri Manado
const POLIMDO_COURSES = {
  "Teknik Informatika": [
    // Semester 1
    { code: "TI101", name: "Algoritma dan Pemrograman I", credits: 3, semester: 1 },
    { code: "TI102", name: "Matematika Diskrit", credits: 3, semester: 1 },
    { code: "TI103", name: "Pengantar Teknologi Informasi", credits: 2, semester: 1 },
    { code: "TI104", name: "Bahasa Inggris I", credits: 2, semester: 1 },
    { code: "TI105", name: "Pancasila", credits: 2, semester: 1 },
    { code: "TI106", name: "Sistem Digital", credits: 3, semester: 1 },
    { code: "TI107", name: "Fisika Dasar", credits: 3, semester: 1 },

    // Semester 2
    { code: "TI201", name: "Algoritma dan Pemrograman II", credits: 3, semester: 2 },
    { code: "TI202", name: "Struktur Data", credits: 3, semester: 2 },
    { code: "TI203", name: "Matematika Terapan", credits: 3, semester: 2 },
    { code: "TI204", name: "Bahasa Inggris II", credits: 2, semester: 2 },
    { code: "TI205", name: "Kewarganegaraan", credits: 2, semester: 2 },
    { code: "TI206", name: "Organisasi dan Arsitektur Komputer", credits: 3, semester: 2 },
    { code: "TI207", name: "Elektronika Dasar", credits: 3, semester: 2 },

    // Semester 3
    { code: "TI301", name: "Pemrograman Berorientasi Objek", credits: 3, semester: 3 },
    { code: "TI302", name: "Basis Data I", credits: 3, semester: 3 },
    { code: "TI303", name: "Sistem Operasi", credits: 3, semester: 3 },
    { code: "TI304", name: "Jaringan Komputer I", credits: 3, semester: 3 },
    { code: "TI305", name: "Statistika dan Probabilitas", credits: 3, semester: 3 },
    { code: "TI306", name: "Interaksi Manusia dan Komputer", credits: 2, semester: 3 },
    { code: "TI307", name: "Bahasa Indonesia", credits: 2, semester: 3 },

    // Semester 4
    { code: "TI401", name: "Rekayasa Perangkat Lunak", credits: 3, semester: 4 },
    { code: "TI402", name: "Basis Data II", credits: 3, semester: 4 },
    { code: "TI403", name: "Pemrograman Web I", credits: 3, semester: 4 },
    { code: "TI404", name: "Jaringan Komputer II", credits: 3, semester: 4 },
    { code: "TI405", name: "Analisis dan Perancangan Sistem", credits: 3, semester: 4 },
    { code: "TI406", name: "Metodologi Penelitian", credits: 2, semester: 4 },
    { code: "TI407", name: "Grafika Komputer", credits: 3, semester: 4 },

    // Semester 5
    { code: "TI501", name: "Pemrograman Web II", credits: 3, semester: 5 },
    { code: "TI502", name: "Keamanan Jaringan", credits: 3, semester: 5 },
    { code: "TI503", name: "Kecerdasan Buatan", credits: 3, semester: 5 },
    { code: "TI504", name: "Data Mining", credits: 3, semester: 5 },
    { code: "TI505", name: "Mobile Programming", credits: 3, semester: 5 },
    { code: "TI506", name: "E-Commerce", credits: 2, semester: 5 },
    { code: "TI507", name: "Sistem Informasi Manajemen", credits: 3, semester: 5 },

    // Semester 6
    { code: "TI601", name: "Kerja Praktik", credits: 2, semester: 6 },
    { code: "TI602", name: "Proyek Akhir", credits: 4, semester: 6 },
    { code: "TI603", name: "Sistem Terdistribusi", credits: 3, semester: 6 },
    { code: "TI604", name: "Cloud Computing", credits: 3, semester: 6 },
    { code: "TI605", name: "Internet of Things (IoT)", credits: 3, semester: 6 },
    { code: "TI606", name: "Teknologi Multimedia", credits: 3, semester: 6 },
    { code: "TI607", name: "Kewirausahaan", credits: 2, semester: 6 }
  ],

  "Teknik Elektro": [
    // Semester 1
    { code: "TE101", name: "Matematika Teknik I", credits: 3, semester: 1 },
    { code: "TE102", name: "Fisika Teknik I", credits: 3, semester: 1 },
    { code: "TE103", name: "Kimia Dasar", credits: 2, semester: 1 },
    { code: "TE104", name: "Gambar Teknik", credits: 2, semester: 1 },
    { code: "TE105", name: "Pengantar Teknik Elektro", credits: 2, semester: 1 },
    { code: "TE106", name: "Bahasa Inggris I", credits: 2, semester: 1 },
    { code: "TE107", name: "Pancasila", credits: 2, semester: 1 },

    // Semester 2
    { code: "TE201", name: "Matematika Teknik II", credits: 3, semester: 2 },
    { code: "TE202", name: "Fisika Teknik II", credits: 3, semester: 2 },
    { code: "TE203", name: "Rangkaian Listrik I", credits: 3, semester: 2 },
    { code: "TE204", name: "Elektronika Analog I", credits: 3, semester: 2 },
    { code: "TE205", name: "Pemrograman Komputer", credits: 2, semester: 2 },
    { code: "TE206", name: "Bahasa Inggris II", credits: 2, semester: 2 },
    { code: "TE207", name: "Kewarganegaraan", credits: 2, semester: 2 }
  ],

  "Akuntansi": [
    // Semester 1
    { code: "AK101", name: "Pengantar Akuntansi I", credits: 3, semester: 1 },
    { code: "AK102", name: "Matematika Bisnis", credits: 3, semester: 1 },
    { code: "AK103", name: "Pengantar Ekonomi Mikro", credits: 3, semester: 1 },
    { code: "AK104", name: "Bahasa Inggris Bisnis I", credits: 2, semester: 1 },
    { code: "AK105", name: "Pancasila", credits: 2, semester: 1 },
    { code: "AK106", name: "Pengantar Teknologi Informasi", credits: 2, semester: 1 },
    { code: "AK107", name: "Komunikasi Bisnis", credits: 2, semester: 1 }
  ]
};

// Function to create courses via API
async function createCourse(courseData, programStudy) {
  try {
    const payload = {
      course_code: courseData.code,
      course_name: courseData.name,
      description: `Mata kuliah ${courseData.name} untuk Program Studi ${programStudy} semester ${courseData.semester}`,
      credits: courseData.credits,
      semester: courseData.semester,
      program_study: programStudy,
      prerequisites: courseData.prerequisites || null
    };

    const response = await fetch(`${API_BASE}/api/courses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      console.log(`✅ Created: ${courseData.code} - ${courseData.name}`);
      return await response.json();
    } else {
      const error = await response.json();
      console.error(`❌ Failed to create ${courseData.code}:`, error.message);
      return null;
    }
  } catch (error) {
    console.error(`❌ Network error for ${courseData.code}:`, error.message);
    return null;
  }
}

// Function to ask for user confirmation
function askQuestion(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

// Main seeding function
async function seedPolimkCourses() {
  console.log('🏫 Politeknik Negeri Manado - Course Seeder');
  console.log('=' .repeat(50));
  console.log('🌱 Starting to seed courses...\n');

  for (const [programStudy, courses] of Object.entries(POLIMDO_COURSES)) {
    console.log(`\n📚 Creating courses for ${programStudy}:`);
    console.log('-' .repeat(40));

    for (const course of courses) {
      await createCourse(course, programStudy);
      // Small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }

  console.log('\n🎉 Course seeding completed!');
  console.log('\n📊 Summary:');
  for (const [programStudy, courses] of Object.entries(POLIMDO_COURSES)) {
    console.log(`   ${programStudy}: ${courses.length} courses`);
  }
}

// Function to seed specific program
async function seedSpecificProgram(programName) {
  if (!POLIMDO_COURSES[programName]) {
    console.error(`❌ Program study "${programName}" not found!`);
    console.log('\n📚 Available programs:');
    Object.keys(POLIMDO_COURSES).forEach(prog => console.log(`   - ${prog}`));
    return;
  }

  console.log(`🌱 Seeding courses for ${programName}...\n`);
  
  const courses = POLIMDO_COURSES[programName];
  for (const course of courses) {
    await createCourse(course, programName);
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  console.log(`\n✅ Completed seeding ${courses.length} courses for ${programName}`);
}

// Main execution
async function main() {
  const arg = process.argv[2];
  
  if (!arg) {
    console.log('📋 Usage:');
    console.log('  node run-seeder.js all                    # Seed all programs');
    console.log('  node run-seeder.js "Teknik Informatika"   # Seed specific program');
    console.log('\n📚 Available programs:');
    Object.keys(POLIMDO_COURSES).forEach(prog => console.log(`   - ${prog}`));
    return;
  }

  // Check if server is running
  try {
    const response = await fetch(`${API_BASE}/api/courses`);
    if (!response.ok) {
      throw new Error('Server not responding properly');
    }
  } catch (error) {
    console.error('❌ Backend server is not running or not accessible!');
    console.log('Please make sure the backend server is running on http://localhost:5001');
    return;
  }

  const answer = await askQuestion('\n⚠️  This will add courses to the database. Continue? (y/N): ');
  if (answer.toLowerCase() !== 'y' && answer.toLowerCase() !== 'yes') {
    console.log('🚫 Operation cancelled.');
    return;
  }

  if (arg === 'all') {
    await seedPolimkCourses();
  } else {
    await seedSpecificProgram(arg);
  }
}

main().catch(console.error);