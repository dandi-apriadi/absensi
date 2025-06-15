import React, { useEffect, useState } from "react";
import { MdSchedule, MdAdd, MdEdit, MdDelete, MdPlayArrow, MdPause, MdEmail, MdCalendarToday, MdAccessTime, MdRepeat, MdMoreVert, MdHistory } from "react-icons/md";
import AOS from "aos";
import "aos/dist/aos.css";

const ScheduledReports = () => {
    const [scheduledReports, setScheduledReports] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
    const [reportToDelete, setReportToDelete] = useState(null);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
        });

        // Load mock data
        loadScheduledReports();
    }, []);

    const loadScheduledReports = () => {
        // Mock data for scheduled reports
        const mockReports = [
            {
                id: 1,
                name: "Laporan Bulanan Kehadiran",
                schedule: "Monthly",
                nextRun: "2025-06-01T08:00:00",
                lastRun: "2025-05-01T08:05:12",
                recipients: ["admin@universitasteknologi.ac.id", "dekan@universitasteknologi.ac.id"],
                format: "PDF",
                status: "active",
                reportType: "Attendance Monthly Summary",
            },
            {
                id: 2,
                name: "Rekap Mingguan Program Studi",
                schedule: "Weekly",
                nextRun: "2025-05-22T06:00:00",
                lastRun: "2025-05-15T06:02:45",
                recipients: ["prodi-ti@universitasteknologi.ac.id"],
                format: "Excel",
                status: "active",
                reportType: "Program Study Attendance",
            },
            {
                id: 3,
                name: "Laporan Kehadiran Rendah",
                schedule: "Weekly",
                nextRun: "2025-05-22T07:00:00",
                lastRun: "2025-05-15T07:01:18",
                recipients: ["bimbingan@universitasteknologi.ac.id"],
                format: "PDF",
                status: "active",
                reportType: "Low Attendance Alert",
            },
            {
                id: 4,
                name: "Dataset Verification Status",
                schedule: "Daily",
                nextRun: "2025-05-16T22:00:00",
                lastRun: "2025-05-15T22:00:07",
                recipients: ["teknis@universitasteknologi.ac.id"],
                format: "PDF",
                status: "paused",
                reportType: "Face Dataset Status",
            },
            {
                id: 5,
                name: "Laporan Akses Pintu Masuk",
                schedule: "Daily",
                nextRun: "2025-05-16T23:00:00",
                lastRun: "2025-05-15T23:01:22",
                recipients: ["security@universitasteknologi.ac.id"],
                format: "PDF",
                status: "active",
                reportType: "Door Access Summary",
            }
        ];

        setScheduledReports(mockReports);
    };

    const handleDeleteReport = (report) => {
        setReportToDelete(report);
        setShowConfirmDeleteModal(true);
    };

    const confirmDelete = () => {
        // In a real app, you would call an API to delete the report
        setScheduledReports(scheduledReports.filter(report => report.id !== reportToDelete.id));
        setShowConfirmDeleteModal(false);
        setReportToDelete(null);
    };

    const toggleReportStatus = (reportId) => {
        setScheduledReports(scheduledReports.map(report =>
            report.id === reportId
                ? { ...report, status: report.status === "active" ? "paused" : "active" }
                : report
        ));
    };

    const runReportNow = (reportId) => {
        // In a real app, this would trigger the report generation
        alert(`Report ${reportId} is being generated. You will be notified when it's ready.`);
    };

    const getStatusBadge = (status) => {
        return status === "active"
            ? <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Active</span>
            : <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Paused</span>;
    };

    const getScheduleLabel = (schedule) => {
        switch (schedule) {
            case "Daily": return "Harian";
            case "Weekly": return "Mingguan";
            case "Monthly": return "Bulanan";
            case "Quarterly": return "Triwulanan";
            default: return schedule;
        }
    };

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Filter reports based on selected filter
    const filteredReports = filter === "all"
        ? scheduledReports
        : scheduledReports.filter(report => report.status === filter);

    return (
        <div className="p-4 md:p-8">
            <div className="mb-8" data-aos="fade-down">
                <h1 className="text-3xl font-bold text-gray-800">Laporan Terjadwal</h1>
                <p className="text-gray-600">Kelola laporan yang berjalan secara otomatis berdasarkan jadwal</p>
            </div>

            {/* Controls */}
            <div className="bg-white rounded-xl shadow-md p-4 mb-8 flex flex-wrap justify-between items-center gap-4" data-aos="fade-up">
                <div className="flex space-x-2">
                    <button
                        className={`px-3 py-1 text-sm rounded-lg ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                        onClick={() => setFilter('all')}
                    >
                        Semua
                    </button>
                    <button
                        className={`px-3 py-1 text-sm rounded-lg ${filter === 'active' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                        onClick={() => setFilter('active')}
                    >
                        Aktif
                    </button>
                    <button
                        className={`px-3 py-1 text-sm rounded-lg ${filter === 'paused' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                        onClick={() => setFilter('paused')}
                    >
                        Dijeda
                    </button>
                </div>

                <button
                    onClick={() => setShowAddModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center hover:bg-blue-700 transition-colors"
                >
                    <MdAdd className="mr-2" /> Jadwalkan Laporan Baru
                </button>
            </div>

            {/* Scheduled Reports Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden" data-aos="fade-up" data-aos-delay="200">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Laporan</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jadwal</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Akan Dijalankan</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Terakhir Dijalankan</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Penerima</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Format</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tindakan</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredReports.length > 0 ? (
                                filteredReports.map((report) => (
                                    <tr key={report.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <MdSchedule className="h-5 w-5 text-blue-500 mr-3" />
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{report.name}</div>
                                                    <div className="text-xs text-gray-500">{report.reportType}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <MdRepeat className="h-5 w-5 text-gray-400 mr-1" />
                                                <span className="text-sm text-gray-900">{getScheduleLabel(report.schedule)}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <MdCalendarToday className="h-5 w-5 text-gray-400 mr-1" />
                                                <span className="text-sm text-gray-900">{formatDateTime(report.nextRun)}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <MdHistory className="h-5 w-5 text-gray-400 mr-1" />
                                                <span className="text-sm text-gray-900">{formatDateTime(report.lastRun)}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <MdEmail className="h-5 w-5 text-gray-400 mr-1" />
                                                <span className="text-sm text-gray-900">{report.recipients.length} penerima</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">{report.format}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(report.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => toggleReportStatus(report.id)}
                                                    className="text-gray-600 hover:text-gray-900"
                                                    title={report.status === "active" ? "Pause" : "Activate"}
                                                >
                                                    {report.status === "active" ? <MdPause className="h-5 w-5" /> : <MdPlayArrow className="h-5 w-5" />}
                                                </button>
                                                <button
                                                    onClick={() => runReportNow(report.id)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                    title="Run Now"
                                                >
                                                    <MdPlayArrow className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={() => { }}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                    title="Edit"
                                                >
                                                    <MdEdit className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteReport(report)}
                                                    className="text-red-600 hover:text-red-900"
                                                    title="Delete"
                                                >
                                                    <MdDelete className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="px-6 py-10 text-center text-gray-500">
                                        Tidak ada laporan terjadwal yang ditemukan. Buat jadwal baru dengan mengklik tombol "Jadwalkan Laporan Baru".
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Run History */}
            <div className="bg-white rounded-xl shadow-md p-6 mt-8" data-aos="fade-up" data-aos-delay="300">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Riwayat Eksekusi Terakhir</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Laporan</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu Eksekusi</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durasi</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ukuran</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            <tr className="hover:bg-gray-50">
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Laporan Bulanan Kehadiran</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">01 Mei 2025, 08:05</td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Success</span>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">12 detik</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">2.4 MB</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Rekap Mingguan Program Studi</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">15 Mei 2025, 06:02</td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Success</span>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">45 detik</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">5.7 MB</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Dataset Verification Status</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">15 Mei 2025, 22:00</td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Success</span>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">7 detik</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">1.2 MB</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Laporan Kehadiran Rendah</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">15 Mei 2025, 07:01</td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Success</span>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">18 detik</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">1.8 MB</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Laporan Akses Pintu Masuk</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">15 Mei 2025, 23:01</td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Success</span>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">22 detik</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">3.1 MB</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Report Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-3xl w-full p-6" data-aos="zoom-in">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Jadwalkan Laporan Baru</h2>

                        <form className="space-y-6">
                            <div>
                                <label htmlFor="report-name" className="block text-sm font-medium text-gray-700 mb-1">Nama Laporan</label>
                                <input
                                    type="text"
                                    id="report-name"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Masukkan nama laporan"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="report-type" className="block text-sm font-medium text-gray-700 mb-1">Jenis Laporan</label>
                                    <select
                                        id="report-type"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Pilih jenis laporan</option>
                                        <option value="attendance-monthly">Laporan Bulanan Kehadiran</option>
                                        <option value="attendance-program">Laporan Program Studi</option>
                                        <option value="low-attendance">Laporan Kehadiran Rendah</option>
                                        <option value="face-dataset">Laporan Dataset Wajah</option>
                                        <option value="door-access">Laporan Akses Pintu</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="format" className="block text-sm font-medium text-gray-700 mb-1">Format</label>
                                    <select
                                        id="format"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="pdf">PDF</option>
                                        <option value="excel">Excel</option>
                                        <option value="csv">CSV</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="schedule-type" className="block text-sm font-medium text-gray-700 mb-1">Frekuensi</label>
                                    <select
                                        id="schedule-type"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="daily">Harian</option>
                                        <option value="weekly">Mingguan</option>
                                        <option value="monthly">Bulanan</option>
                                        <option value="quarterly">Triwulanan</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">Waktu</label>
                                    <input
                                        type="time"
                                        id="time"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        defaultValue="08:00"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="recipients" className="block text-sm font-medium text-gray-700 mb-1">Penerima Email (pisahkan dengan koma)</label>
                                <input
                                    type="text"
                                    id="recipients"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="email@example.com, another@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Opsi Tambahan</label>
                                <div className="space-y-2">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="include-charts"
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            defaultChecked
                                        />
                                        <label htmlFor="include-charts" className="ml-2 text-sm text-gray-700">
                                            Sertakan grafik dan visualisasi
                                        </label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="include-details"
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            defaultChecked
                                        />
                                        <label htmlFor="include-details" className="ml-2 text-sm text-gray-700">
                                            Sertakan data detail
                                        </label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="active-immediately"
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            defaultChecked
                                        />
                                        <label htmlFor="active-immediately" className="ml-2 text-sm text-gray-700">
                                            Aktifkan jadwal segera
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                    onClick={() => setShowAddModal(false)}
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    onClick={() => {
                                        // In a real app, this would save the scheduled report
                                        setShowAddModal(false);
                                        // Refresh the list
                                        loadScheduledReports();
                                    }}
                                >
                                    Jadwalkan Laporan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Confirm Delete Modal */}
            {showConfirmDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6" data-aos="zoom-in">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Konfirmasi Penghapusan</h2>
                        <p className="text-gray-600 mb-6">
                            Apakah Anda yakin ingin menghapus laporan terjadwal "{reportToDelete?.name}"? Tindakan ini tidak dapat dibatalkan.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                onClick={() => setShowConfirmDeleteModal(false)}
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                onClick={confirmDelete}
                            >
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScheduledReports;
