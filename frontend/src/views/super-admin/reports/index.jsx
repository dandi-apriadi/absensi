import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { MdAssessment, MdDocumentScanner, MdSchedule, MdFolderShared, MdDownload, MdPreview, MdEmail, MdPrint, MdZoomOut, MdInsertChart, MdFace, MdMeetingRoom } from "react-icons/md";
import AOS from "aos";
import "aos/dist/aos.css";

const ReportGenerator = () => {
    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
        });
    }, []);

    // Sample recent reports data
    const recentReports = [
        {
            id: 1,
            name: "Laporan Kehadiran Bulanan",
            type: "attendance",
            date: "15 Mei 2025",
            size: "2.4 MB",
            program: "Semua Program",
            format: "PDF",
            createdBy: "System"
        },
        {
            id: 2,
            name: "Laporan Mahasiswa Berisiko",
            type: "analytics",
            date: "14 Mei 2025",
            size: "1.8 MB",
            program: "Teknik Informatika",
            format: "XLSX",
            createdBy: "Admin Sistem"
        },
        {
            id: 3,
            name: "Laporan Dataset Wajah",
            type: "dataset",
            date: "10 Mei 2025",
            size: "3.2 MB",
            program: "Semua Program",
            format: "PDF",
            createdBy: "System"
        },
        {
            id: 4,
            name: "Rekap Absensi Semester",
            type: "attendance",
            date: "5 Mei 2025",
            size: "5.7 MB",
            program: "Semua Program",
            format: "XLSX",
            createdBy: "Admin Sistem"
        }
    ];

    return (
        <div className="p-4 md:p-8">
            <div className="mb-8" data-aos="fade-down">
                <h1 className="text-3xl font-bold text-gray-800">Laporan & Statistik</h1>
                <p className="text-gray-600">Buat, kelola, dan jadwalkan laporan untuk berbagai data absensi</p>
            </div>

            {/* Quick Report Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Link to="/super-admin/reports/generate-reports" className="block">
                    <div
                        className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 h-full"
                        data-aos="fade-up"
                    >
                        <div className="bg-blue-100 p-4 rounded-full w-16 h-16 flex justify-center items-center mb-4">
                            <MdDocumentScanner className="h-8 w-8 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Buat Laporan</h3>
                        <p className="text-gray-600">
                            Buat laporan kustom berdasarkan berbagai parameter dan filter data.
                        </p>
                        <button className="mt-4 text-blue-600 font-medium flex items-center">
                            Buat Laporan
                            <svg className="w-5 h-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </Link>

                <Link to="/super-admin/reports/scheduled-reports" className="block">
                    <div
                        className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 h-full"
                        data-aos="fade-up"
                        data-aos-delay="100"
                    >
                        <div className="bg-green-100 p-4 rounded-full w-16 h-16 flex justify-center items-center mb-4">
                            <MdSchedule className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Laporan Terjadwal</h3>
                        <p className="text-gray-600">
                            Kelola laporan yang dijadwalkan rutin dan konfigurasi pengirimannya.
                        </p>
                        <button className="mt-4 text-green-600 font-medium flex items-center">
                            Kelola Jadwal
                            <svg className="w-5 h-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </Link>

                <Link to="/super-admin/reports/report-templates" className="block">
                    <div
                        className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 h-full"
                        data-aos="fade-up"
                        data-aos-delay="200"
                    >
                        <div className="bg-purple-100 p-4 rounded-full w-16 h-16 flex justify-center items-center mb-4">
                            <MdFolderShared className="h-8 w-8 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Template Laporan</h3>
                        <p className="text-gray-600">
                            Kelola dan kustomisasi template laporan yang dapat digunakan berulang kali.
                        </p>
                        <button className="mt-4 text-purple-600 font-medium flex items-center">
                            Kelola Template
                            <svg className="w-5 h-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </Link>
            </div>

            {/* Quick Reports Section */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8" data-aos="fade-up" data-aos-delay="300">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Laporan Cepat</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all">
                        <MdInsertChart className="h-8 w-8 text-blue-500 mb-2" />
                        <span className="text-gray-800 text-sm font-medium">Laporan Kehadiran Harian</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all">
                        <MdAssessment className="h-8 w-8 text-green-500 mb-2" />
                        <span className="text-gray-800 text-sm font-medium">Laporan Kehadiran Mingguan</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all">
                        <MdFace className="h-8 w-8 text-purple-500 mb-2" />
                        <span className="text-gray-800 text-sm font-medium">Laporan Dataset Wajah</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all">
                        <MdMeetingRoom className="h-8 w-8 text-orange-500 mb-2" />
                        <span className="text-gray-800 text-sm font-medium">Laporan Akses Ruangan</span>
                    </button>
                </div>
            </div>

            {/* Recent Reports */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8" data-aos="fade-up" data-aos-delay="400">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">Laporan Terbaru</h2>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Lihat Semua</button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Laporan</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program Studi</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Format</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ukuran</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dibuat Oleh</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {recentReports.map((report) => (
                                <tr key={report.id} className="hover:bg-gray-50 transition-colors duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                                                {report.type === 'attendance' && <MdAssessment className="h-4 w-4 text-blue-500" />}
                                                {report.type === 'analytics' && <MdInsertChart className="h-4 w-4 text-purple-500" />}
                                                {report.type === 'dataset' && <MdFace className="h-4 w-4 text-green-500" />}
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-gray-900">{report.name}</p>
                                                <p className="text-xs text-gray-500">{report.type}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.program}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${report.format === 'PDF' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                            }`}>
                                            {report.format}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.size}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.createdBy}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button className="text-blue-600 hover:text-blue-900">
                                            <MdPreview className="h-5 w-5" />
                                        </button>
                                        <button className="text-green-600 hover:text-green-900">
                                            <MdDownload className="h-5 w-5" />
                                        </button>
                                        <button className="text-purple-600 hover:text-purple-900">
                                            <MdEmail className="h-5 w-5" />
                                        </button>
                                        <button className="text-gray-600 hover:text-gray-900">
                                            <MdPrint className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Report Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8" data-aos="fade-up" data-aos-delay="500">
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Laporan Dibuat</p>
                            <h3 className="text-2xl font-bold text-gray-800 mt-1">147</h3>
                            <p className="text-xs text-gray-500 mt-1">30 hari terakhir</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-full">
                            <MdDocumentScanner className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Laporan Terjadwal</p>
                            <h3 className="text-2xl font-bold text-gray-800 mt-1">8</h3>
                            <p className="text-xs text-gray-500 mt-1">Aktif</p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-full">
                            <MdSchedule className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Template Kustom</p>
                            <h3 className="text-2xl font-bold text-gray-800 mt-1">12</h3>
                            <p className="text-xs text-gray-500 mt-1">Tersedia</p>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-full">
                            <MdFolderShared className="h-6 w-6 text-purple-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Unduhan Laporan</p>
                            <h3 className="text-2xl font-bold text-gray-800 mt-1">253</h3>
                            <p className="text-xs text-gray-500 mt-1">30 hari terakhir</p>
                        </div>
                        <div className="bg-orange-100 p-3 rounded-full">
                            <MdDownload className="h-6 w-6 text-orange-600" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportGenerator;
