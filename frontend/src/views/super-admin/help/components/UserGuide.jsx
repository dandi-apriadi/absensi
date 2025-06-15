import React, { useEffect, useState } from "react";
import { MdSchool, MdKeyboardArrowDown, MdKeyboardArrowUp, MdSearch } from "react-icons/md";
import AOS from "aos";
import "aos/dist/aos.css";

const UserGuide = () => {
    const [activeSection, setActiveSection] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
        });
    }, []);

    const toggleSection = (sectionId) => {
        if (activeSection === sectionId) {
            setActiveSection(null);
        } else {
            setActiveSection(sectionId);
        }
    };

    // Dummy guide sections for demonstration
    const guideSections = [
        {
            id: 1,
            title: "Memulai dengan Sistem Absensi",
            content: `
        <h3>Pendahuluan</h3>
        <p>Sistem absensi dengan face recognition dirancang untuk memudahkan proses pencatatan kehadiran mahasiswa secara akurat dan efisien. Panduan ini akan membantu Anda memahami cara menggunakan sistem dari perspektif admin.</p>
        
        <h3>Komponen Utama</h3>
        <ul>
          <li>Dashboard - Melihat ringkasan absensi dan statistik</li>
          <li>Manajemen Pengguna - Mengelola data mahasiswa dan dosen</li>
          <li>Dataset Wajah - Mengatur data wajah untuk pengenalan</li>
          <li>Laporan - Menghasilkan berbagai laporan absensi</li>
        </ul>

        <h3>Memulai</h3>
        <p>Sebagai Super Admin, Anda memiliki akses ke semua fitur sistem. Mulailah dengan memastikan semua mahasiswa telah terdaftar dan memiliki dataset wajah yang terverifikasi.</p>
      `
        },
        {
            id: 2,
            title: "Mengelola Dataset Wajah",
            content: `
        <h3>Penambahan Dataset Wajah</h3>
        <p>Dataset wajah adalah elemen kunci dalam sistem pengenalan wajah. Berikut adalah langkah-langkah untuk mengelola dataset wajah mahasiswa:</p>
        
        <ol>
          <li>Buka menu "Manajemen Dataset Wajah"</li>
          <li>Pilih "Upload Dataset" untuk menambahkan data baru</li>
          <li>Upload minimal 5-10 foto wajah per mahasiswa dengan berbagai ekspresi dan sudut</li>
          <li>Pastikan foto memiliki pencahayaan yang baik dan wajah terlihat jelas</li>
          <li>Verifikasi kualitas dataset menggunakan fitur "Verifikasi Dataset"</li>
        </ol>

        <h3>Tips Kualitas Dataset</h3>
        <p>Dataset berkualitas tinggi akan meningkatkan akurasi pengenalan wajah. Pastikan:</p>
        <ul>
          <li>Wajah terlihat dengan jelas</li>
          <li>Variasi ekspresi wajah (netral, tersenyum, serius)</li>
          <li>Variasi aksesori (dengan/tanpa kacamata jika relevan)</li>
          <li>Beberapa sudut wajah (lurus, sedikit menoleh)</li>
        </ul>
      `
        },
        {
            id: 3,
            title: "Mengonfigurasi Sistem Pintu Akses",
            content: `
        <h3>Konfigurasi Perangkat</h3>
        <p>Sistem pintu akses terintegrasi dengan pengenalan wajah dan dapat dikonfigurasi sesuai kebutuhan. Langkah-langkah konfigurasi:</p>
        
        <ol>
          <li>Buka menu "Akses Pintu & Ruangan"</li>
          <li>Pilih "Konfigurasi Pintu" untuk menyesuaikan pengaturan</li>
          <li>Atur jadwal akses untuk masing-masing pintu</li>
          <li>Tetapkan level akses (mahasiswa, dosen, atau keduanya)</li>
          <li>Konfigurasikan pengaturan keamanan seperti anti-spoofing</li>
        </ol>

        <h3>Pengaturan Failover</h3>
        <p>Penting untuk mengonfigurasi metode failover jika sistem pengenalan wajah mengalami masalah:</p>
        <ul>
          <li>Aktifkan RFID Fallback untuk cadangan autentikasi</li>
          <li>Atur Manual Override untuk keadaan darurat</li>
          <li>Konfigurasikan notifikasi otomatis jika sistem mengalami gangguan</li>
        </ul>
      `
        },
        {
            id: 4,
            title: "Menghasilkan dan Menjadwalkan Laporan",
            content: `
        <h3>Jenis Laporan</h3>
        <p>Sistem menyediakan berbagai jenis laporan untuk monitoring kehadiran:</p>
        
        <ul>
          <li>Laporan Harian - Ringkasan kehadiran harian</li>
          <li>Laporan Mingguan/Bulanan - Analisis tren kehadiran</li>
          <li>Laporan per Program Studi - Perbandingan kehadiran antar program</li>
          <li>Laporan per Mahasiswa - Detail kehadiran individual</li>
          <li>Laporan Anomali - Pola kehadiran tidak normal</li>
        </ul>

        <h3>Cara Menjadwalkan Laporan</h3>
        <ol>
          <li>Buka menu "Report Generator"</li>
          <li>Pilih "Scheduled Reports" untuk membuat jadwal laporan rutin</li>
          <li>Tentukan jenis laporan, frekuensi, dan format (PDF, Excel, CSV)</li>
          <li>Atur penerima laporan otomatis via email</li>
          <li>Aktifkan penjadwalan dan monitor status laporan</li>
        </ol>
      `
        },
        {
            id: 5,
            title: "Menangani Masalah Umum",
            content: `
        <h3>Troubleshooting Face Recognition</h3>
        <p>Jika terjadi masalah dengan pengenalan wajah:</p>
        
        <ul>
          <li>Periksa kualitas dataset wajah dan perbarui jika diperlukan</li>
          <li>Pastikan pencahayaan di area kamera memadai</li>
          <li>Verifikasi bahwa kamera berfungsi dengan baik</li>
          <li>Atur sensitivitas pengenalan wajah di pengaturan sistem</li>
        </ul>

        <h3>Masalah Koneksi Sistem</h3>
        <p>Jika terjadi masalah koneksi:</p>
        <ol>
          <li>Periksa status jaringan di "Hardware Monitoring"</li>
          <li>Pastikan semua perangkat terhubung dengan benar</li>
          <li>Restart perangkat door controller jika diperlukan</li>
          <li>Verifikasi status server di "System Logs"</li>
        </ol>

        <h3>Backup dan Restore</h3>
        <p>Langkah-langkah untuk backup emergency:</p>
        <ol>
          <li>Buka "Backup & Restore" di menu Pengaturan Sistem</li>
          <li>Pilih "Create Backup Now" untuk backup manual</li>
          <li>Simpan backup ke lokasi yang aman</li>
        </ol>
      `
        }
    ];

    // Filter sections based on search term
    const filteredSections = guideSections.filter(section =>
        section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        section.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4 md:p-8">
            <div className="mb-8" data-aos="fade-down">
                <h1 className="text-3xl font-bold text-gray-800">Panduan Pengguna</h1>
                <p className="text-gray-600">Petunjuk lengkap penggunaan sistem absensi dengan face recognition</p>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-xl shadow-md p-4 mb-8" data-aos="fade-up">
                <div className="relative">
                    <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                        type="text"
                        placeholder="Cari panduan..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Guide Sections */}
            <div className="space-y-4" data-aos="fade-up" data-aos-delay="100">
                {filteredSections.map((section) => (
                    <div key={section.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                        <button
                            className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                            onClick={() => toggleSection(section.id)}
                        >
                            <div className="flex items-center">
                                <MdSchool className="h-6 w-6 text-blue-600 mr-3" />
                                <h2 className="text-lg font-semibold text-gray-800">{section.title}</h2>
                            </div>
                            {activeSection === section.id ? (
                                <MdKeyboardArrowUp className="h-6 w-6 text-gray-500" />
                            ) : (
                                <MdKeyboardArrowDown className="h-6 w-6 text-gray-500" />
                            )}
                        </button>

                        {activeSection === section.id && (
                            <div className="px-6 pb-6">
                                <div
                                    className="prose max-w-none"
                                    dangerouslySetInnerHTML={{ __html: section.content }}
                                />
                            </div>
                        )}
                    </div>
                ))}

                {filteredSections.length === 0 && (
                    <div className="bg-white rounded-xl shadow-md p-8 text-center">
                        <MdSearch className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">Tidak ada panduan yang cocok dengan pencarian Anda.</p>
                    </div>
                )}
            </div>

            {/* Quick Help */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mt-8" data-aos="fade-up" data-aos-delay="200">
                <h2 className="text-lg font-semibold text-blue-800 mb-4">Butuh Bantuan Lebih?</h2>
                <p className="text-blue-700 mb-4">
                    Jika Anda tidak menemukan informasi yang dibutuhkan di panduan ini, silakan:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <a href="/super-admin/help/faq" className="bg-white p-4 rounded-lg border border-blue-200 hover:shadow-md transition-shadow text-center">
                        <p className="font-medium text-blue-600">Lihat FAQ</p>
                    </a>
                    <a href="/super-admin/help/tutorial-videos" className="bg-white p-4 rounded-lg border border-blue-200 hover:shadow-md transition-shadow text-center">
                        <p className="font-medium text-blue-600">Tonton Video Tutorial</p>
                    </a>
                    <a href="/super-admin/help/contact-support" className="bg-white p-4 rounded-lg border border-blue-200 hover:shadow-md transition-shadow text-center">
                        <p className="font-medium text-blue-600">Hubungi Support</p>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default UserGuide;
