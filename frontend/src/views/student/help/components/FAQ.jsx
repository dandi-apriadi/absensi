import React, { useState } from "react";
import { MdExpandMore, MdExpandLess, MdSearch } from "react-icons/md";

const FAQ = () => {
    const [expandedFAQ, setExpandedFAQ] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const faqs = [
        {
            id: 1,
            category: 'Akun & Login',
            question: 'Bagaimana cara login pertama kali?',
            answer: 'Gunakan NIM sebagai username dan password default yang diberikan oleh admin. Setelah login pertama, Anda akan diminta mengganti password. Jika mengalami masalah, hubungi admin sistem.',
            tags: ['login', 'password', 'akun']
        },
        {
            id: 2,
            category: 'Akun & Login',
            question: 'Lupa password, bagaimana cara reset?',
            answer: 'Klik "Lupa Password" di halaman login, masukkan NIM, dan ikuti instruksi yang dikirim ke email Anda. Jika tidak menerima email, periksa folder spam atau hubungi admin.',
            tags: ['password', 'reset', 'email']
        },
        {
            id: 3,
            category: 'Face Recognition',
            question: 'Wajah saya tidak terdeteksi saat absensi, apa yang harus dilakukan?',
            answer: 'Pastikan pencahayaan cukup, posisi wajah tepat di tengah kamera, dan tidak ada penghalang seperti masker atau kacamata tebal. Jika masih gagal, gunakan QR Code atau minta verifikasi manual dari dosen.',
            tags: ['face recognition', 'deteksi', 'kamera']
        },
        {
            id: 4,
            category: 'Face Recognition',
            question: 'Berapa foto yang diperlukan untuk registrasi wajah?',
            answer: 'Minimal 5 foto dari sudut yang berbeda (depan, kiri, kanan) dengan pencahayaan yang baik. Lebih banyak foto akan meningkatkan akurasi pengenalan wajah.',
            tags: ['registrasi', 'foto', 'dataset']
        },
        {
            id: 5,
            category: 'Absensi',
            question: 'Sampai jam berapa bisa melakukan absensi?',
            answer: 'Absensi dapat dilakukan maksimal 15 menit setelah jam kuliah dimulai. Setelah itu, sistem akan mencatat sebagai terlambat. Batas maksimal absensi adalah 30 menit setelah jam mulai.',
            tags: ['absensi', 'waktu', 'terlambat']
        },
        {
            id: 6,
            category: 'Absensi',
            question: 'Bagaimana cara menggunakan QR Code untuk absensi?',
            answer: 'Masuk ke menu QR Code, generate kode baru, dan tunjukkan ke scanner di ruang kelas. QR Code berlaku selama 5 menit. Pastikan kode masih aktif saat melakukan scan.',
            tags: ['qr code', 'scanner', 'generate']
        },
        {
            id: 7,
            category: 'Laporan',
            question: 'Bagaimana cara download laporan kehadiran?',
            answer: 'Masuk ke menu Kehadiran Saya > Laporan Kehadiran, pilih periode dan format yang diinginkan (PDF/Excel), lalu klik Download. Laporan akan otomatis terunduh ke perangkat Anda.',
            tags: ['laporan', 'download', 'kehadiran']
        },
        {
            id: 8,
            category: 'Izin/Sakit',
            question: 'Bagaimana cara mengajukan izin tidak masuk kuliah?',
            answer: 'Masuk ke menu Pengajuan Izin/Sakit, isi form dengan lengkap, upload dokumen pendukung (surat dokter untuk sakit), dan submit. Dosen akan mereview dan menyetujui pengajuan.',
            tags: ['izin', 'sakit', 'pengajuan']
        },
        {
            id: 9,
            category: 'Izin/Sakit',
            question: 'Berapa lama proses persetujuan izin?',
            answer: 'Proses persetujuan biasanya 1-2 hari kerja. Anda akan mendapat notifikasi melalui email dan aplikasi ketika status pengajuan berubah. Untuk keadaan darurat, hubungi dosen langsung.',
            tags: ['persetujuan', 'notifikasi', 'waktu']
        },
        {
            id: 10,
            category: 'Teknis',
            question: 'Aplikasi error atau tidak bisa diakses, apa yang harus dilakukan?',
            answer: 'Coba refresh halaman, clear cache browser, atau gunakan browser berbeda. Jika masih bermasalah, screenshot error dan laporkan ke tim support melalui menu Hubungi Support.',
            tags: ['error', 'teknis', 'browser']
        },
        {
            id: 11,
            category: 'Teknis',
            question: 'Apakah sistem bisa diakses melalui smartphone?',
            answer: 'Ya, sistem fully responsive dan dapat diakses melalui smartphone. Untuk performa optimal, gunakan browser Chrome atau Safari versi terbaru dan pastikan koneksi internet stabil.',
            tags: ['mobile', 'smartphone', 'responsive']
        },
        {
            id: 12,
            category: 'Keamanan',
            question: 'Apakah data wajah saya aman?',
            answer: 'Ya, semua data biometrik dienkripsi dan disimpan dengan standar keamanan tinggi. Data hanya digunakan untuk keperluan absensi dan akan dihapus ketika Anda lulus atau tidak aktif lagi.',
            tags: ['keamanan', 'data', 'privasi']
        }
    ];

    const categories = [...new Set(faqs.map(faq => faq.category))];

    const filteredFAQs = faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const toggleFAQ = (faqId) => {
        setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
    };

    return (
        <div className="p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h3>

            {/* Search */}
            <div className="mb-6">
                <div className="relative">
                    <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                        type="text"
                        placeholder="Cari pertanyaan..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Categories */}
            <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Kategori</h4>
                <div className="flex flex-wrap gap-2">
                    {categories.map(category => (
                        <span
                            key={category}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                        >
                            {category}
                        </span>
                    ))}
                </div>
            </div>

            {/* FAQ List */}
            <div className="space-y-4">
                {filteredFAQs.map((faq) => (
                    <div key={faq.id} className="border border-gray-200 rounded-lg overflow-hidden">
                        <button
                            onClick={() => toggleFAQ(faq.id)}
                            className="w-full p-4 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
                        >
                            <div>
                                <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full mr-3">
                                    {faq.category}
                                </span>
                                <span className="text-lg font-medium text-gray-800">
                                    {faq.question}
                                </span>
                            </div>
                            {expandedFAQ === faq.id ? (
                                <MdExpandLess className="h-6 w-6 text-gray-400" />
                            ) : (
                                <MdExpandMore className="h-6 w-6 text-gray-400" />
                            )}
                        </button>

                        {expandedFAQ === faq.id && (
                            <div className="px-4 pb-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-gray-700 leading-relaxed mb-3">
                                        {faq.answer}
                                    </p>
                                    <div className="flex flex-wrap gap-1">
                                        {faq.tags.map(tag => (
                                            <span
                                                key={tag}
                                                className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {filteredFAQs.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-500">Tidak ada FAQ yang sesuai dengan pencarian Anda.</p>
                </div>
            )}

            {/* Contact Info */}
            <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-yellow-800 mb-2">
                    Tidak menemukan jawaban yang Anda cari?
                </h4>
                <p className="text-yellow-700 mb-4">
                    Hubungi tim support kami untuk mendapatkan bantuan lebih lanjut.
                </p>
                <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                    Hubungi Support
                </button>
            </div>
        </div>
    );
};

export default FAQ;
