import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Card from "components/card";
import {
    MdSchool,
    MdPeopleAlt,
    MdQrCode,
    MdAssignment,
    MdPrint,
    MdEdit,
    MdChevronRight,
    MdAccessTime,
    MdApproval,
    MdBarChart,
    MdFileDownload,
    MdPlayArrow,
    MdOutlineInfo,
    MdQuestionAnswer,
    MdEmail
} from "react-icons/md";

// Sections data
const sections = [
    {
        id: "attendance",
        title: "Pengambilan Absensi",
        icon: <MdQrCode className="h-6 w-6 text-indigo-600" />,
        content: [
            {
                title: "Menggunakan QR Code untuk Absensi",
                steps: [
                    "Buka menu 'Manajemen Absensi' -> 'Ambil Absensi'",
                    "Pilih mata kuliah dan metode 'QR Code'",
                    "Klik tombol 'Mulai Sesi dengan QR Code'",
                    "QR Code akan ditampilkan pada layar dan mahasiswa dapat memindainya melalui aplikasi mobile untuk melakukan absensi",
                    "QR Code akan berubah secara otomatis setiap beberapa menit untuk keamanan",
                    "Daftar mahasiswa yang hadir akan ditampilkan secara real-time di sebelah kanan layar"
                ],
                image: "/assets/guide/qr-code-attendance.png"
            },
            {
                title: "Menggunakan Face Recognition",
                steps: [
                    "Buka menu 'Manajemen Absensi' -> 'Ambil Absensi'",
                    "Pilih mata kuliah dan metode 'Face Recognition'",
                    "Klik tombol 'Mulai Sesi dengan Face Recognition'",
                    "Pastikan pencahayaan ruangan cukup terang untuk hasil optimal",
                    "Arahkan wajah mahasiswa ke kamera untuk dikenali oleh sistem",
                    "Daftar mahasiswa yang hadir akan ditampilkan secara real-time di sebelah kanan layar"
                ],
                image: "/assets/guide/face-recognition.png"
            },
            {
                title: "Input Absensi Manual",
                steps: [
                    "Buka menu 'Manajemen Absensi' -> 'Absensi Manual'",
                    "Pilih mata kuliah dan pertemuan yang ingin diinput absensinya",
                    "Sistem akan menampilkan daftar mahasiswa",
                    "Klik tombol status sesuai kehadiran mahasiswa: Hadir, Tidak Hadir, atau Izin",
                    "Klik 'Simpan Perubahan' untuk menyimpan data absensi"
                ],
                image: "/assets/guide/manual-attendance.png"
            }
        ]
    }, {
        id: "manual-attendance",
        title: "Verifikasi Absensi Manual",
        icon: <MdApproval className="h-6 w-6 text-green-600" />,
        content: [
            {
                title: "Memverifikasi Absensi Mahasiswa",
                steps: [
                    "Buka menu 'Manajemen Absensi' -> 'Absensi Manual'",
                    "Pilih mata kuliah dan tanggal yang ingin diverifikasi",
                    "Daftar mahasiswa dan status kehadiran akan ditampilkan",
                    "Periksa data absensi yang telah tercatat",
                    "Ubah status jika diperlukan koreksi",
                    "Klik 'Simpan Perubahan' untuk menyimpan verifikasi"],
                image: "/assets/guide/manual-verification.png"
            },
            {
                title: "Melihat Riwayat Absensi",
                steps: [
                    "Buka menu 'Manajemen Absensi' -> 'Riwayat Absensi'",
                    "Anda dapat memfilter berdasarkan mata kuliah, tanggal, atau kata kunci",
                    "Klik tombol 'Lihat Detail' untuk melihat detail absensi yang telah tercatat"
                ],
                image: "/assets/guide/attendance-history.png"
            }
        ]
    },
    {
        id: "reports",
        title: "Laporan & Export Data",
        icon: <MdFileDownload className="h-6 w-6 text-blue-600" />,
        content: [
            {
                title: "Mengekspor Data Absensi",
                steps: [
                    "Buka menu 'Manajemen Absensi' -> 'Export Data Absensi'",
                    "Pilih mata kuliah yang ingin diekspor datanya",
                    "Tentukan rentang tanggal",
                    "Pilih format file (Excel, CSV, atau PDF)",
                    "Klik 'Export Data' untuk mengunduh laporan"
                ],
                image: "/assets/guide/export-data.png"
            },
            {
                title: "Melihat Statistik Kehadiran",
                steps: [
                    "Buka menu 'Dashboard' atau 'Performa Mahasiswa' -> 'Statistik Kehadiran'",
                    "Pilih mata kuliah untuk melihat data spesifik",
                    "Sistem akan menampilkan visualisasi data kehadiran dalam bentuk grafik",
                    "Analisis tren kehadiran dan identifikasi mahasiswa yang memerlukan perhatian khusus"
                ],
                image: "/assets/guide/attendance-stats.png"
            }
        ]
    },
    {
        id: "students",
        title: "Manajemen Mahasiswa",
        icon: <MdPeopleAlt className="h-6 w-6 text-purple-600" />,
        content: [
            {
                title: "Melihat Daftar Mahasiswa",
                steps: [
                    "Buka menu 'Performa Mahasiswa' -> 'Daftar Mahasiswa'",
                    "Anda dapat memfilter berdasarkan mata kuliah",
                    "Klik pada nama mahasiswa untuk melihat detail profil dan kehadiran"
                ],
                image: "/assets/guide/students-list.png"
            },
            {
                title: "Menganalisis Performa Kehadiran",
                steps: [
                    "Buka menu 'Performa Mahasiswa' -> 'Statistik Kehadiran'",
                    "Sistem akan menampilkan mahasiswa dengan tingkat kehadiran rendah",
                    "Anda dapat mengirim notifikasi peringatan kepada mahasiswa tersebut",
                    "Analisis tren kehadiran berdasarkan hari, waktu, dan mata kuliah"
                ],
                image: "/assets/guide/performance-analysis.png"
            }
        ]
    }
];

const UserGuide = () => {
    const [activeSection, setActiveSection] = useState("attendance");
    const currentSection = sections.find(section => section.id === activeSection);

    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: "ease-in-out",
            once: true,
        });

        // Check if URL has a section hash
        if (window.location.hash) {
            const sectionId = window.location.hash.substring(1);
            if (sections.some(section => section.id === sectionId)) {
                setActiveSection(sectionId);
            }
        }
    }, []);

    return (
        <div className="mt-3">
            <div className="mb-5" data-aos="fade-down">
                <h1 className="text-3xl font-bold text-navy-700 dark:text-white">
                    Panduan Pengguna
                </h1>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Panduan lengkap penggunaan sistem absensi untuk dosen
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
                <div className="lg:col-span-1">
                    <Card extra="p-3" data-aos="fade-right">
                        <nav>
                            <ul className="space-y-1">
                                {sections.map((section) => (
                                    <li key={section.id}>
                                        <button
                                            onClick={() => setActiveSection(section.id)}
                                            className={`w-full flex items-center px-3 py-2 rounded-lg text-left ${activeSection === section.id
                                                ? "bg-indigo-50 text-indigo-700"
                                                : "text-gray-700 hover:bg-gray-100"
                                                }`}
                                        >
                                            {section.icon}
                                            <span className="ml-3 text-sm font-medium">{section.title}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                            <p className="text-sm text-blue-700 flex items-start">
                                <MdOutlineInfo className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                                <span>
                                    Butuh bantuan lebih lanjut? Kunjungi{" "}
                                    <a href="/lecturer/help/faq" className="text-indigo-600 hover:underline">FAQ</a>{" "}
                                    atau{" "}
                                    <a href="/lecturer/help/contact-support" className="text-indigo-600 hover:underline">Hubungi Support</a>.
                                </span>
                            </p>
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-3">
                    <Card extra="p-5" data-aos="fade-left">
                        <div className="mb-6 flex items-center">
                            {currentSection.icon}
                            <h2 className="text-2xl font-bold ml-3">
                                {currentSection.title}
                            </h2>
                        </div>

                        <div className="space-y-8">
                            {currentSection.content.map((item, index) => (
                                <div key={index} className="border-b border-gray-200 pb-8 last:border-b-0" data-aos="fade-up" data-aos-delay={(index + 1) * 100}>
                                    <h3 className="text-lg font-semibold mb-4">
                                        {item.title}
                                    </h3>

                                    <div className="mb-4">
                                        <ol className="list-decimal pl-5 space-y-2">
                                            {item.steps.map((step, stepIndex) => (
                                                <li key={stepIndex} className="text-sm text-gray-600 pl-2">
                                                    {step}
                                                </li>
                                            ))}
                                        </ol>
                                    </div>

                                    {item.image && (
                                        <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
                                            <div className="bg-gray-100 p-6 flex items-center justify-center">
                                                <div className="text-gray-400 text-center">
                                                    <MdAssignment className="h-12 w-12 mx-auto mb-2" />
                                                    <p className="text-sm">Gambar ilustrasi untuk {item.title}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {index < currentSection.content.length - 1 && (
                                        <div className="flex justify-center mt-6">
                                            <MdChevronRight className="h-8 w-8 text-gray-300" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between items-center border-t border-gray-200 pt-5 mt-6">
                            <div>
                                <a
                                    href="/lecturer/help/faq"
                                    className="flex items-center text-indigo-600 text-sm hover:text-indigo-800"
                                >
                                    <MdQuestionAnswer className="mr-2" /> Lihat FAQ
                                </a>
                            </div>

                            <div>
                                <a
                                    href="/lecturer/help/contact-support"
                                    className="flex items-center text-indigo-600 text-sm hover:text-indigo-800"
                                >
                                    <MdEmail className="mr-2" /> Hubungi Support
                                </a>
                            </div>
                        </div>
                    </Card>

                    <div className="mt-5" data-aos="fade-up" data-aos-delay="300">
                        <Card extra="p-5">
                            <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0 p-2 rounded-full bg-indigo-100">
                                    <MdPlayArrow className="h-6 w-6 text-indigo-600" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-navy-700 dark:text-white">Video Tutorial: {currentSection.title}</h4>
                                    <p className="text-sm text-gray-500">Pelajari lebih lanjut melalui video tutorial interaktif</p>
                                </div>
                            </div>

                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <a href="#" className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-all">
                                    <div className="flex items-center">
                                        <div className="bg-gray-100 p-3 rounded-lg mr-3">
                                            <MdPlayArrow className="h-5 w-5 text-gray-500" />
                                        </div>
                                        <div>
                                            <h5 className="text-sm font-medium">{currentSection.title} - Dasar</h5>
                                            <p className="text-xs text-gray-500 mt-1">3:45 • Tingkat dasar</p>
                                        </div>
                                    </div>
                                </a>

                                <a href="#" className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-all">
                                    <div className="flex items-center">
                                        <div className="bg-gray-100 p-3 rounded-lg mr-3">
                                            <MdPlayArrow className="h-5 w-5 text-gray-500" />
                                        </div>
                                        <div>
                                            <h5 className="text-sm font-medium">{currentSection.title} - Lanjutan</h5>
                                            <p className="text-xs text-gray-500 mt-1">5:12 • Tingkat lanjutan</p>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserGuide;
