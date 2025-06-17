import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Card from "components/card";
import {
    MdExpandMore,
    MdExpandLess,
    MdSearch,
    MdQuestionAnswer,
    MdCategory,
    MdInfo
} from "react-icons/md";

// FAQ Data
const faqData = [
    {
        id: 1,
        category: "attendance",
        question: "Bagaimana cara mengambil absensi mahasiswa?",
        answer: "Anda dapat mengambil absensi mahasiswa melalui beberapa cara: menggunakan QR Code, Face Recognition, atau input manual. Untuk menggunakan QR Code, buka menu 'Manajemen Absensi' > 'Ambil Absensi', pilih mata kuliah dan metode QR Code, kemudian mulai absensi. Mahasiswa dapat memindai QR Code yang ditampilkan menggunakan aplikasi mobile mereka."
    },
    {
        id: 2,
        category: "attendance",
        question: "Apa yang harus dilakukan jika ada mahasiswa yang tidak bisa melakukan absensi secara online?",
        answer: "Jika mahasiswa tidak dapat melakukan absensi secara online, Anda dapat menggunakan fitur 'Absensi Manual'. Buka menu 'Manajemen Absensi' > 'Absensi Manual', pilih mata kuliah dan sesi, kemudian masukkan data kehadiran mahasiswa secara manual."
    },
    {
        id: 3,
        category: "leave",
        question: "Bagaimana cara menyetujui atau menolak permintaan izin mahasiswa?",
        answer: "Untuk menyetujui atau menolak permintaan izin, buka menu 'Manajemen Izin/Sakit' > 'Permintaan Tertunda'. Anda akan melihat daftar permintaan yang belum diproses. Klik tombol 'Lihat Detail' pada permintaan yang ingin diproses, kemudian klik tombol 'Setujui' atau 'Tolak' sesuai keputusan Anda."
    },
    {
        id: 4,
        category: "leave",
        question: "Berapa lama waktu yang diberikan untuk memproses permintaan izin?",
        answer: "Sebaiknya permintaan izin diproses dalam waktu 24 jam setelah pengajuan. Sistem akan memberikan notifikasi untuk permintaan yang belum diproses lebih dari 24 jam."
    },
    {
        id: 5,
        category: "session",
        question: "Bagaimana cara membuat sesi perkuliahan baru?",
        answer: "Untuk membuat sesi perkuliahan baru, kunjungi menu 'Manajemen Sesi' dan klik tombol 'Tambah Sesi Baru'. Isi semua informasi yang diperlukan seperti mata kuliah, topik, tanggal, waktu, dan ruangan. Anda juga dapat mengatur perulangan untuk sesi yang rutin."
    },
    {
        id: 6,
        category: "session",
        question: "Apakah saya bisa mengatur sesi perkuliahan berulang?",
        answer: "Ya, saat membuat atau mengedit sesi perkuliahan, Anda dapat mengatur opsi 'Perulangan' menjadi 'Mingguan', 'Dua mingguan', atau 'Bulanan'. Pilih juga hari dalam minggu untuk sesi berulang tersebut."
    },
    {
        id: 7,
        category: "technical",
        question: "Aplikasi tidak merespon atau mengalami error, apa yang harus dilakukan?",
        answer: "Jika aplikasi tidak merespon atau mengalami error, coba lakukan refresh halaman. Jika masalah berlanjut, Anda bisa mencoba keluar dan masuk kembali ke aplikasi. Bila masalah masih terjadi, hubungi tim support melalui menu 'Bantuan' > 'Hubungi Support' dengan menyertakan detail error yang dialami."
    },
    {
        id: 8,
        category: "technical",
        question: "Browser apa yang direkomendasikan untuk menggunakan sistem ini?",
        answer: "Sistem ini berjalan optimal pada browser modern seperti Google Chrome, Mozilla Firefox, Microsoft Edge, atau Safari versi terbaru. Pastikan browser Anda sudah diperbarui ke versi terkini untuk pengalaman terbaik."
    },
    {
        id: 9,
        category: "data",
        question: "Bagaimana cara mengekspor data absensi mahasiswa?",
        answer: "Untuk mengekspor data absensi, buka menu 'Manajemen Absensi' > 'Export Data Absensi'. Pilih mata kuliah, rentang tanggal, dan format file yang diinginkan (Excel atau CSV), kemudian klik tombol 'Ekspor Data'."
    },
    {
        id: 10,
        category: "data",
        question: "Berapa lama data absensi tersimpan dalam sistem?",
        answer: "Data absensi akan tersimpan selama 5 tahun dalam sistem untuk keperluan arsip dan pelaporan. Setelah periode tersebut, data akan diarsipkan dan dipindahkan ke penyimpanan sekunder."
    }
];

// Categories
const categories = [
    { id: "all", name: "Semua Kategori" },
    { id: "attendance", name: "Pengambilan Absensi" },
    { id: "leave", name: "Permintaan Izin" },
    { id: "session", name: "Manajemen Sesi" },
    { id: "technical", name: "Teknis & Error" },
    { id: "data", name: "Data & Laporan" }
];

const FAQ = () => {
    const [activeQuestions, setActiveQuestions] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");

    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: "ease-in-out",
            once: true,
        });
    }, []);

    const toggleQuestion = (questionId) => {
        setActiveQuestions(prev =>
            prev.includes(questionId)
                ? prev.filter(id => id !== questionId)
                : [...prev, questionId]
        );
    };

    const filteredFAQs = faqData.filter(faq => {
        const matchesSearch =
            faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    return (
        <div className="mt-3">
            <div className="mb-5" data-aos="fade-down">
                <h1 className="text-3xl font-bold text-navy-700 dark:text-white">
                    Pertanyaan yang Sering Diajukan (FAQ)
                </h1>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Temukan jawaban untuk pertanyaan umum tentang sistem absensi
                </p>
            </div>

            <Card extra="p-5 mb-5" data-aos="fade-up">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="relative flex-1">
                        <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Cari pertanyaan atau jawaban..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="w-full md:w-64">
                        <select
                            className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 appearance-none"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </Card>

            <div className="mb-5" data-aos="fade-up" data-aos-delay="100">
                {filteredFAQs.length > 0 ? (
                    <div className="space-y-4">
                        {filteredFAQs.map((faq, index) => (
                            <Card
                                key={faq.id}
                                extra="p-0 overflow-hidden border-2 border-transparent hover:border-indigo-100 transition-all duration-200"
                                data-aos="fade-up"
                                data-aos-delay={index * 50}
                            >
                                <button
                                    onClick={() => toggleQuestion(faq.id)}
                                    className={`w-full flex items-center justify-between p-4 text-left ${activeQuestions.includes(faq.id) ? "bg-indigo-50" : ""
                                        }`}
                                >
                                    <div className="flex items-start">
                                        <MdQuestionAnswer className={`h-5 w-5 mt-0.5 ${activeQuestions.includes(faq.id)
                                            ? "text-indigo-600"
                                            : "text-gray-400"
                                            }`} />
                                        <span className={`ml-3 font-medium ${activeQuestions.includes(faq.id)
                                            ? "text-indigo-800"
                                            : "text-gray-800"
                                            }`}>
                                            {faq.question}
                                        </span>
                                    </div>
                                    {activeQuestions.includes(faq.id) ? (
                                        <MdExpandLess className="h-6 w-6 text-gray-500" />
                                    ) : (
                                        <MdExpandMore className="h-6 w-6 text-gray-500" />
                                    )}
                                </button>

                                {activeQuestions.includes(faq.id) && (
                                    <div className="p-4 pt-0 border-t border-gray-200">
                                        <div className="flex mt-4">
                                            <div className="w-5 flex-shrink-0"></div>
                                            <div className="ml-3">
                                                <p className="text-gray-600">{faq.answer}</p>

                                                <div className="mt-3 flex items-center">
                                                    <MdCategory className="h-4 w-4 text-gray-400" />
                                                    <span className="ml-1 text-xs text-gray-500">
                                                        Kategori: {categories.find(cat => cat.id === faq.category)?.name}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card extra="p-12" data-aos="fade-up">
                        <div className="flex flex-col items-center justify-center text-gray-500">
                            <MdInfo className="h-12 w-12 text-gray-300 mb-3" />
                            <h3 className="text-lg font-medium mb-1">Tidak ada hasil ditemukan</h3>
                            <p className="text-sm text-center">
                                Tidak ada FAQ yang cocok dengan pencarian Anda. Coba ubah kata kunci atau kategori.
                            </p>
                        </div>
                    </Card>
                )}
            </div>

            <Card extra="p-5" data-aos="fade-up" data-aos-delay="200">
                <div className="mb-4">
                    <h4 className="text-lg font-bold text-navy-700 dark:text-white">
                        Punya pertanyaan lain?
                    </h4>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                    Jika Anda tidak menemukan jawaban untuk pertanyaan Anda di sini, jangan ragu untuk menghubungi tim support kami.
                </p>

                <a
                    href="/lecturer/help/contact-support"
                    className="inline-flex items-center py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    Hubungi Support
                </a>
            </Card>
        </div>
    );
};

export default FAQ;
