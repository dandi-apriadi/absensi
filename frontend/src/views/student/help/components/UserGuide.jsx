import React, { useState } from "react";
import { MdExpandMore, MdExpandLess, MdFace, MdQrCode, MdHistory, MdSettings } from "react-icons/md";

const UserGuide = () => {
    const [expandedSection, setExpandedSection] = useState(null);

    const guides = [
        {
            id: 'getting-started',
            title: 'Memulai Menggunakan Sistem',
            icon: MdSettings,
            color: 'blue',
            steps: [
                {
                    title: 'Login ke Sistem',
                    description: 'Masuk menggunakan NIM dan password yang telah diberikan',
                    details: 'Gunakan NIM sebagai username dan password default yang diberikan oleh admin. Pastikan untuk mengganti password setelah login pertama kali.'
                },
                {
                    title: 'Lengkapi Profil',
                    description: 'Update informasi profil dan foto profil Anda',
                    details: 'Masuk ke menu Pengaturan > Profil untuk melengkapi data diri seperti nomor telepon, alamat, dan foto profil.'
                },
                {
                    title: 'Registrasi Wajah',
                    description: 'Daftarkan wajah Anda untuk sistem absensi otomatis',
                    details: 'Klik menu Registrasi Wajah dan ikuti panduan untuk mengambil foto wajah dari berbagai sudut. Minimal 5 foto diperlukan.'
                }
            ]
        },
        {
            id: 'face-recognition',
            title: 'Panduan Face Recognition',
            icon: MdFace,
            color: 'green',
            steps: [
                {
                    title: 'Persiapan Registrasi Wajah',
                    description: 'Tips untuk registrasi wajah yang optimal',
                    details: 'Pastikan pencahayaan cukup, lepaskan kacamata atau aksesoري yang menghalangi wajah, dan posisikan wajah tepat di tengah kamera.'
                },
                {
                    title: 'Proses Pengambilan Foto',
                    description: 'Cara mengambil foto wajah yang baik',
                    details: 'Ambil foto dari sudut yang berbeda: depan, kiri, kanan. Pastikan ekspresi natural dan mata terbuka. Hindari bayangan di wajah.'
                },
                {
                    title: 'Verifikasi Dataset',
                    description: 'Memastikan dataset wajah sudah tersimpan',
                    details: 'Setelah upload, tunggu proses verifikasi dari sistem. Status dataset dapat dilihat di halaman Registrasi Wajah.'
                }
            ]
        },
        {
            id: 'attendance',
            title: 'Panduan Absensi',
            icon: MdHistory,
            color: 'purple',
            steps: [
                {
                    title: 'Absensi dengan Face Recognition',
                    description: 'Cara melakukan absensi menggunakan wajah',
                    details: 'Dekati perangkat absensi, tunggu hingga kamera mendeteksi wajah Anda. Posisikan wajah di dalam frame hijau dan tunggu konfirmasi.'
                },
                {
                    title: 'Absensi dengan QR Code',
                    description: 'Alternatif absensi jika face recognition gagal',
                    details: 'Generate QR Code di aplikasi, tunjukkan ke scanner yang tersedia di ruang kelas. QR Code berlaku selama 5 menit.'
                },
                {
                    title: 'Verifikasi Manual',
                    description: 'Cara meminta verifikasi manual dari dosen',
                    details: 'Jika kedua metode gagal, laporkan ke dosen untuk verifikasi manual. Pastikan membawa kartu mahasiswa sebagai identitas.'
                }
            ]
        },
        {
            id: 'reports',
            title: 'Laporan dan Riwayat',
            icon: MdHistory,
            color: 'yellow',
            steps: [
                {
                    title: 'Melihat Riwayat Kehadiran',
                    description: 'Cara mengakses riwayat kehadiran pribadi',
                    details: 'Masuk ke menu Kehadiran Saya > Riwayat Kehadiran. Gunakan filter untuk melihat data berdasarkan tanggal atau mata kuliah.'
                },
                {
                    title: 'Download Laporan',
                    description: 'Cara mendownload laporan kehadiran',
                    details: 'Di halaman Laporan Kehadiran, pilih periode dan format laporan (PDF/Excel), kemudian klik Download.'
                },
                {
                    title: 'Pengajuan Izin/Sakit',
                    description: 'Cara mengajukan izin tidak masuk',
                    details: 'Masuk ke menu Pengajuan Izin, isi form dengan lengkap, upload dokumen pendukung jika diperlukan, lalu submit.'
                }
            ]
        }
    ];

    const toggleSection = (sectionId) => {
        setExpandedSection(expandedSection === sectionId ? null : sectionId);
    };

    const getColorClasses = (color) => {
        const colors = {
            blue: 'from-blue-500 to-blue-600 border-blue-200',
            green: 'from-green-500 to-green-600 border-green-200',
            purple: 'from-purple-500 to-purple-600 border-purple-200',
            yellow: 'from-yellow-500 to-yellow-600 border-yellow-200'
        };
        return colors[color] || colors.blue;
    };

    return (
        <div className="p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Panduan Pengguna</h3>

            <div className="space-y-4">
                {guides.map((guide) => (
                    <div key={guide.id} className="border border-gray-200 rounded-lg overflow-hidden">
                        <button
                            onClick={() => toggleSection(guide.id)}
                            className={`w-full p-4 bg-gradient-to-r ${getColorClasses(guide.color)} text-white flex items-center justify-between hover:opacity-90 transition-opacity`}
                        >
                            <div className="flex items-center">
                                <guide.icon className="h-6 w-6 mr-3" />
                                <span className="text-lg font-semibold">{guide.title}</span>
                            </div>
                            {expandedSection === guide.id ? (
                                <MdExpandLess className="h-6 w-6" />
                            ) : (
                                <MdExpandMore className="h-6 w-6" />
                            )}
                        </button>

                        {expandedSection === guide.id && (
                            <div className="p-6 bg-white">
                                <div className="space-y-6">
                                    {guide.steps.map((step, index) => (
                                        <div key={index} className="flex">
                                            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm mr-4">
                                                {index + 1}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                                                    {step.title}
                                                </h4>
                                                <p className="text-gray-600 mb-2">
                                                    {step.description}
                                                </p>
                                                <div className="bg-gray-50 p-3 rounded-lg">
                                                    <p className="text-sm text-gray-700">
                                                        <strong>Detail:</strong> {step.details}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Additional Tips */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-blue-800 mb-4">Tips Tambahan</h4>
                <ul className="space-y-2 text-blue-700">
                    <li>• Pastikan koneksi internet stabil saat menggunakan sistem</li>
                    <li>• Update browser ke versi terbaru untuk performa optimal</li>
                    <li>• Laporkan masalah teknis ke admin atau support</li>
                    <li>• Backup data penting secara berkala</li>
                    <li>• Jaga kerahasiaan password dan informasi akun</li>
                </ul>
            </div>
        </div>
    );
};

export default UserGuide;
