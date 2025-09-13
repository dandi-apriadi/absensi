const API_BASE = 'http://localhost:5001';

// Simple fetch wrapper for Node.js
async function post(url, data) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`HTTP ${response.status}: ${error}`);
  }
  
  return await response.json();
}

// Data mata kuliah Teknik Informatika Politeknik Negeri Manado
const TI_COURSES = [
  // Semester 1
  { code: "TI101", name: "Algoritma dan Pemrograman I", credits: 3, semester: 1, description: "Mata kuliah dasar algoritma dan pemrograman menggunakan bahasa pemrograman terstruktur untuk membangun logika pemrograman" },
  { code: "TI102", name: "Matematika Diskrit", credits: 3, semester: 1, description: "Matematika diskrit mencakup logika proposisional, teori himpunan, relasi, fungsi, dan graf untuk dasar ilmu komputer" },
  { code: "TI103", name: "Pengantar Teknologi Informasi", credits: 2, semester: 1, description: "Pengenalan konsep dasar teknologi informasi, sistem komputer, jaringan, dan perkembangan teknologi digital" },
  { code: "TI104", name: "Bahasa Inggris I", credits: 2, semester: 1, description: "Pembelajaran bahasa Inggris dasar dengan fokus pada vocabulary dan grammar untuk bidang teknologi informasi" },
  { code: "TI105", name: "Pancasila", credits: 2, semester: 1, description: "Pendidikan Pancasila sebagai dasar negara dan pandangan hidup bangsa Indonesia" },
  { code: "TI106", name: "Sistem Digital", credits: 3, semester: 1, description: "Pengenalan sistem bilangan, gerbang logika, rangkaian kombinasional dan sekuensial dalam sistem digital" },
  { code: "TI107", name: "Fisika Dasar", credits: 3, semester: 1, description: "Konsep dasar fisika yang berkaitan dengan teknologi informasi termasuk listrik, magnet, dan gelombang" },

  // Semester 2
  { code: "TI201", name: "Algoritma dan Pemrograman II", credits: 3, semester: 2, description: "Lanjutan pemrograman dengan konsep object-oriented programming, array, string, dan file handling" },
  { code: "TI202", name: "Struktur Data", credits: 3, semester: 2, description: "Implementasi struktur data linear dan non-linear: stack, queue, linked list, tree, dan graph" },
  { code: "TI203", name: "Matematika Terapan", credits: 3, semester: 2, description: "Kalkulus, aljabar linear, dan statistika yang diterapkan dalam bidang teknologi informasi" },
  { code: "TI204", name: "Bahasa Inggris II", credits: 2, semester: 2, description: "Bahasa Inggris lanjutan dengan fokus pada technical writing dan communication skills" },
  { code: "TI205", name: "Kewarganegaraan", credits: 2, semester: 2, description: "Pendidikan kewarganegaraan untuk membentuk karakter dan jiwa nasionalisme" },
  { code: "TI206", name: "Organisasi dan Arsitektur Komputer", credits: 3, semester: 2, description: "Arsitektur sistem komputer, CPU, memori, I/O, dan organisasi sistem komputer modern" },
  { code: "TI207", name: "Elektronika Dasar", credits: 3, semester: 2, description: "Komponen elektronika, rangkaian analog dan digital, serta aplikasinya dalam sistem komputer" },

  // Semester 3
  { code: "TI301", name: "Pemrograman Berorientasi Objek", credits: 3, semester: 3, description: "Konsep OOP lengkap: encapsulation, inheritance, polymorphism menggunakan Java atau C++" },
  { code: "TI302", name: "Basis Data I", credits: 3, semester: 3, description: "Konsep database, entity relationship diagram, normalisasi, dan SQL untuk manajemen data" },
  { code: "TI303", name: "Sistem Operasi", credits: 3, semester: 3, description: "Prinsip sistem operasi: process management, memory management, file system, dan I/O" },
  { code: "TI304", name: "Jaringan Komputer I", credits: 3, semester: 3, description: "Dasar jaringan komputer, protokol TCP/IP, OSI layer, dan teknologi jaringan LAN/WAN" },
  { code: "TI305", name: "Statistika dan Probabilitas", credits: 3, semester: 3, description: "Statistika deskriptif, inferensial, dan probabilitas untuk analisis data dan machine learning" },
  { code: "TI306", name: "Interaksi Manusia dan Komputer", credits: 2, semester: 3, description: "Prinsip desain user interface, user experience, dan usability testing" },
  { code: "TI307", name: "Bahasa Indonesia", credits: 2, semester: 3, description: "Penggunaan bahasa Indonesia yang baik dan benar dalam komunikasi ilmiah dan teknis" },

  // Semester 4
  { code: "TI401", name: "Rekayasa Perangkat Lunak", credits: 3, semester: 4, description: "Metodologi pengembangan software: SDLC, requirement analysis, design pattern, testing" },
  { code: "TI402", name: "Basis Data II", credits: 3, semester: 4, description: "Database lanjutan: stored procedure, trigger, indexing, optimization, dan database administration" },
  { code: "TI403", name: "Pemrograman Web I", credits: 3, semester: 4, description: "Pengembangan web front-end menggunakan HTML5, CSS3, JavaScript, dan framework modern" },
  { code: "TI404", name: "Jaringan Komputer II", credits: 3, semester: 4, description: "Jaringan lanjutan: routing, switching, network security, dan wireless technology" },
  { code: "TI405", name: "Analisis dan Perancangan Sistem", credits: 3, semester: 4, description: "Analisis kebutuhan sistem, perancangan sistem informasi, dan pemodelan sistem" },
  { code: "TI406", name: "Metodologi Penelitian", credits: 2, semester: 4, description: "Metode penelitian ilmiah, penulisan proposal, dan teknik presentasi akademik" },
  { code: "TI407", name: "Grafika Komputer", credits: 3, semester: 4, description: "Algoritma grafika komputer, 2D/3D rendering, transformasi geometri, dan computer vision" },

  // Semester 5
  { code: "TI501", name: "Pemrograman Web II", credits: 3, semester: 5, description: "Back-end development dengan PHP/Python/Node.js, REST API, dan integrasi database" },
  { code: "TI502", name: "Keamanan Jaringan", credits: 3, semester: 5, description: "Cybersecurity, enkripsi, firewall, intrusion detection, dan ethical hacking" },
  { code: "TI503", name: "Kecerdasan Buatan", credits: 3, semester: 5, description: "Machine learning, neural networks, algoritma AI, dan aplikasi artificial intelligence" },
  { code: "TI504", name: "Data Mining", credits: 3, semester: 5, description: "Teknik ekstraksi pola dari big data, clustering, classification, dan predictive analytics" },
  { code: "TI505", name: "Mobile Programming", credits: 3, semester: 5, description: "Pengembangan aplikasi mobile Android/iOS menggunakan native atau cross-platform framework" },
  { code: "TI506", name: "E-Commerce", credits: 2, semester: 5, description: "Konsep bisnis digital, payment gateway, digital marketing, dan platform e-commerce" },
  { code: "TI507", name: "Sistem Informasi Manajemen", credits: 3, semester: 5, description: "Penerapan TI dalam bisnis, ERP, CRM, dan strategic information systems" },

  // Semester 6
  { code: "TI601", name: "Kerja Praktik", credits: 2, semester: 6, description: "Praktik kerja industri untuk menerapkan ilmu teknologi informasi di dunia kerja nyata" },
  { code: "TI602", name: "Proyek Akhir", credits: 4, semester: 6, description: "Tugas akhir berupa pengembangan sistem informasi atau penelitian di bidang teknologi informasi" },
  { code: "TI603", name: "Sistem Terdistribusi", credits: 3, semester: 6, description: "Arsitektur sistem terdistribusi, microservices, cloud computing, dan distributed algorithms" },
  { code: "TI604", name: "Cloud Computing", credits: 3, semester: 6, description: "Teknologi cloud: IaaS, PaaS, SaaS, containerization, dan deployment cloud applications" },
  { code: "TI605", name: "Internet of Things (IoT)", credits: 3, semester: 6, description: "Sensor networks, embedded systems, protokol IoT, dan pengembangan aplikasi IoT" },
  { code: "TI606", name: "Teknologi Multimedia", credits: 3, semester: 6, description: "Digital image processing, audio/video processing, dan pengembangan aplikasi multimedia" },
  { code: "TI607", name: "Kewirausahaan", credits: 2, semester: 6, description: "Konsep entrepreneurship, business plan, startup technology, dan manajemen bisnis IT" }
];

async function seedCourses() {
  console.log('🌱 Starting to seed Teknik Informatika courses...');
  console.log(`📚 Total courses to add: ${TI_COURSES.length}`);
  
  let successCount = 0;
  let failCount = 0;
  const failedCourses = [];

  for (let i = 0; i < TI_COURSES.length; i++) {
    const course = TI_COURSES[i];
    
    try {
      const payload = {
        course_code: course.code,
        course_name: course.name,
        description: course.description,
        credits: course.credits,
        semester: course.semester,
        program_study: "Teknik Informatika",
        status: "active"
      };

      const response = await post(`${API_BASE}/api/courses`, payload);
      
      successCount++;
      console.log(`✅ [${i+1}/${TI_COURSES.length}] ${course.code} - ${course.name} berhasil ditambahkan`);
      
    } catch (error) {
      failCount++;
      const errorMsg = error.message || 'Unknown error';
      failedCourses.push({ course: course.code, error: errorMsg });
      console.log(`❌ [${i+1}/${TI_COURSES.length}] ${course.code} gagal: ${errorMsg}`);
    }

    // Small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  console.log('\n📊 HASIL SEEDING:');
  console.log(`✅ Berhasil: ${successCount} mata kuliah`);
  console.log(`❌ Gagal: ${failCount} mata kuliah`);
  
  if (failedCourses.length > 0) {
    console.log('\n❌ Mata kuliah yang gagal:');
    failedCourses.forEach(item => {
      console.log(`   - ${item.course}: ${item.error}`);
    });
  }

  if (successCount > 0) {
    console.log('\n🎉 Seeding selesai! Mata kuliah Teknik Informatika telah ditambahkan ke database.');
    console.log('💡 Anda sekarang dapat membuat kelas untuk mata kuliah tersebut di halaman "Tambah Kelas".');
  }
}

// Run the seeding
seedCourses().catch(error => {
  console.error('💥 Error during seeding:', error.message);
  process.exit(1);
});