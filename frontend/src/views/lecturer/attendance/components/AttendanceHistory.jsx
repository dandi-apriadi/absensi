import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Card from "components/card";
import {
    MdSearch,
    MdFilterList,
    MdCalendarToday,
    MdDownload,
    MdAccessTime,
    MdRoom,
    MdPeople,
    MdArrowBack,
    MdArrowForward,
    MdInfo,
    MdVisibility,
    MdSort
} from "react-icons/md";

// Dummy Data
const courses = [
    { id: 1, code: "CS-101", name: "Algoritma dan Pemrograman" },
    { id: 2, code: "CS-102", name: "Basis Data" },
    { id: 3, code: "CS-103", name: "Pemrograman Web" },
    { id: 4, code: "CS-104", name: "Kecerdasan Buatan" },
];

const attendanceRecords = [
    {
        id: 1,
        date: "2023-10-15",
        course: "Algoritma dan Pemrograman",
        topic: "Algoritma Sorting",
        time: "08:00 - 09:40",
        room: "Lab 301",
        attendanceRate: 91,
        totalStudents: 35,
        attendedCount: 32,
        method: "qr"
    },
    {
        id: 2,
        date: "2023-10-14",
        course: "Basis Data",
        topic: "Normalisasi Database",
        time: "10:00 - 11:40",
        room: "Lab 302",
        attendanceRate: 88,
        totalStudents: 42,
        attendedCount: 37,
        method: "face"
    },
    {
        id: 3,
        date: "2023-10-13",
        course: "Pemrograman Web",
        topic: "JavaScript Lanjutan",
        time: "13:00 - 14:40",
        room: "Lab 303",
        attendanceRate: 85,
        totalStudents: 28,
        attendedCount: 24,
        method: "qr"
    },
    {
        id: 4,
        date: "2023-10-12",
        course: "Kecerdasan Buatan",
        topic: "Neural Networks",
        time: "15:00 - 16:40",
        room: "Lab 304",
        attendanceRate: 90,
        totalStudents: 32,
        attendedCount: 29,
        method: "manual"
    },
    {
        id: 5,
        date: "2023-10-11",
        course: "Algoritma dan Pemrograman",
        topic: "Algoritma Greedy",
        time: "08:00 - 09:40",
        room: "Lab 301",
        attendanceRate: 94,
        totalStudents: 35,
        attendedCount: 33,
        method: "qr"
    },
    {
        id: 6,
        date: "2023-10-10",
        course: "Basis Data",
        topic: "SQL JOIN",
        time: "10:00 - 11:40",
        room: "Lab 302",
        attendanceRate: 90,
        totalStudents: 42,
        attendedCount: 38,
        method: "qr"
    }
];

const ITEMS_PER_PAGE = 5;

const AttendanceHistory = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCourse, setSelectedCourse] = useState("");
    const [dateRange, setDateRange] = useState({ start: "", end: "" });
    const [sortField, setSortField] = useState("date");
    const [sortOrder, setSortOrder] = useState("desc");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: "ease-in-out",
            once: true,
        });
    }, []);

    const handleViewDetails = (record) => {
        setSelectedRecord(record);
        setShowDetailsModal(true);
    };

    // Filter records based on search, course and date range
    const filteredRecords = attendanceRecords.filter(record => {
        // Search filter
        const matchesSearch =
            record.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.room.toLowerCase().includes(searchTerm.toLowerCase());

        // Course filter  
        const matchesCourse = !selectedCourse || record.course === courses.find(c => c.id == selectedCourse)?.name;

        // Date range filter
        let matchesDateRange = true;
        if (dateRange.start && dateRange.end) {
            const recordDate = new Date(record.date);
            const startDate = new Date(dateRange.start);
            const endDate = new Date(dateRange.end);
            endDate.setHours(23, 59, 59); // Include the entire end day

            matchesDateRange = recordDate >= startDate && recordDate <= endDate;
        }

        return matchesSearch && matchesCourse && matchesDateRange;
    });

    // Sort records
    const sortedRecords = [...filteredRecords].sort((a, b) => {
        let compareResult = 0;

        if (sortField === "date") {
            compareResult = new Date(a.date) - new Date(b.date);
        }
        else if (sortField === "attendance") {
            compareResult = a.attendanceRate - b.attendanceRate;
        }
        else if (sortField === "course") {
            compareResult = a.course.localeCompare(b.course);
        }

        return sortOrder === "asc" ? compareResult : -compareResult;
    });

    // Paginate records
    const totalPages = Math.ceil(sortedRecords.length / ITEMS_PER_PAGE);
    const paginatedRecords = sortedRecords.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // Format date
    const formatDate = (dateString) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    const getMethodName = (method) => {
        switch (method) {
            case 'qr': return 'QR Code';
            case 'face': return 'Face Recognition';
            case 'manual': return 'Manual';
            default: return 'Lainnya';
        }
    };

    return (
        <div className="mt-3">
            <div className="mb-5" data-aos="fade-down">
                <h1 className="text-3xl font-bold text-navy-700 dark:text-white">
                    Riwayat Absensi
                </h1>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Lihat riwayat absensi yang telah diambil
                </p>
            </div>

            <Card extra="p-5 mb-5" data-aos="fade-up">
                <div className="mb-6">
                    <div className="flex flex-col lg:flex-row gap-4 mb-4">
                        <div className="flex-1 relative">
                            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Cari berdasarkan mata kuliah, topik, atau ruangan..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="w-full lg:w-64">
                            <select
                                className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 appearance-none"
                                value={selectedCourse}
                                onChange={(e) => setSelectedCourse(e.target.value)}
                            >
                                <option value="">Semua Mata Kuliah</option>
                                {courses.map((course) => (
                                    <option key={course.id} value={course.id}>
                                        {course.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-4 items-end">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">Dari Tanggal</label>
                                <input
                                    type="date"
                                    className="w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    value={dateRange.start}
                                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">Sampai Tanggal</label>
                                <input
                                    type="date"
                                    className="w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    value={dateRange.end}
                                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">Urutkan Berdasarkan</label>
                                <div className="relative">
                                    <select
                                        className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 appearance-none"
                                        value={`${sortField}-${sortOrder}`}
                                        onChange={(e) => {
                                            const [field, order] = e.target.value.split('-');
                                            setSortField(field);
                                            setSortOrder(order);
                                        }}
                                    >
                                        <option value="date-desc">Tanggal (Terbaru)</option>
                                        <option value="date-asc">Tanggal (Terlama)</option>
                                        <option value="attendance-desc">Kehadiran (Tertinggi)</option>
                                        <option value="attendance-asc">Kehadiran (Terendah)</option>
                                        <option value="course-asc">Mata Kuliah (A-Z)</option>
                                        <option value="course-desc">Mata Kuliah (Z-A)</option>
                                    </select>
                                    <MdSort className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                </div>
                            </div>
                        </div>

                        <div>
                            <button
                                onClick={() => alert('Export data absensi')}
                                className="w-full lg:w-auto py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
                            >
                                <MdDownload className="mr-2" /> Export Data
                            </button>
                        </div>
                    </div>
                </div>

                {paginatedRecords.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Sesi Absensi
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tanggal
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Kehadiran
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {paginatedRecords.map((record) => (
                                    <tr key={record.id} data-aos="fade-up">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{record.course}</div>
                                                <div className="text-sm text-gray-500">{record.topic}</div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    <span className="inline-block mr-2">
                                                        <MdAccessTime className="inline text-gray-400 mr-1" />
                                                        {record.time}
                                                    </span>
                                                    <span className="inline-block mr-2">
                                                        <MdRoom className="inline text-gray-400 mr-1" />
                                                        {record.room}
                                                    </span>
                                                    <span className="inline-block">
                                                        <MdFilterList className="inline text-gray-400 mr-1" />
                                                        {getMethodName(record.method)}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{formatDate(record.date)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-full max-w-[100px]">
                                                    <div className="h-2 bg-gray-200 rounded-full">
                                                        <div
                                                            className={`h-2 rounded-full ${record.attendanceRate >= 90
                                                                ? "bg-green-500"
                                                                : record.attendanceRate >= 75
                                                                    ? "bg-yellow-500"
                                                                    : "bg-red-500"
                                                                }`}
                                                            style={{ width: `${record.attendanceRate}%` }}
                                                        />
                                                    </div>
                                                </div>
                                                <span className="ml-3 text-sm font-medium">
                                                    {record.attendedCount}/{record.totalStudents} ({record.attendanceRate}%)
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <button
                                                onClick={() => handleViewDetails(record)}
                                                className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                                            >
                                                Lihat Detail
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="py-10 text-center">
                        <MdInfo className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-gray-700">Tidak ada data yang sesuai</h3>
                        <p className="text-gray-500 mt-1">Coba ubah filter atau rentang tanggal Anda</p>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-6 flex justify-center">
                        <nav className="flex items-center space-x-2">
                            <button
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`p-2 rounded-md ${currentPage === 1
                                    ? "text-gray-300 cursor-not-allowed"
                                    : "text-gray-500 hover:bg-gray-100"
                                    }`}
                            >
                                <MdArrowBack className="h-5 w-5" />
                            </button>

                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`px-3 py-1 rounded-md ${currentPage === i + 1
                                        ? "bg-indigo-600 text-white"
                                        : "text-gray-500 hover:bg-gray-100"
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`p-2 rounded-md ${currentPage === totalPages
                                    ? "text-gray-300 cursor-not-allowed"
                                    : "text-gray-500 hover:bg-gray-100"
                                    }`}
                            >
                                <MdArrowForward className="h-5 w-5" />
                            </button>
                        </nav>
                    </div>
                )}
            </Card>

            {/* Details Modal */}
            {showDetailsModal && selectedRecord && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                    <div className="relative bg-white rounded-xl shadow-lg w-full max-w-2xl" data-aos="zoom-in">
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                                Detail Absensi
                            </h3>

                            <div className="space-y-6">
                                <div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Mata Kuliah</p>
                                            <p className="text-base font-medium">{selectedRecord.course}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Topik</p>
                                            <p className="text-base font-medium">{selectedRecord.topic}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Tanggal & Waktu</p>
                                            <p className="text-base font-medium">{formatDate(selectedRecord.date)} - {selectedRecord.time}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Metode Absensi</p>
                                            <p className="text-base font-medium">{getMethodName(selectedRecord.method)}</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-medium">Statistik Kehadiran</h4>
                                        <div className="text-sm text-gray-500">
                                            {selectedRecord.attendedCount} dari {selectedRecord.totalStudents} mahasiswa hadir
                                        </div>
                                    </div>

                                    <div className="w-full h-2.5 bg-gray-200 rounded-full">
                                        <div
                                            className={`h-2.5 rounded-full ${selectedRecord.attendanceRate >= 90
                                                ? "bg-green-500"
                                                : selectedRecord.attendanceRate >= 75
                                                    ? "bg-yellow-500"
                                                    : "bg-red-500"
                                                }`}
                                            style={{ width: `${selectedRecord.attendanceRate}%` }}
                                        />
                                    </div>

                                    <div className="mt-1 flex justify-between text-xs">
                                        <span className="text-gray-500">
                                            {selectedRecord.attendanceRate}% Kehadiran
                                        </span>
                                        <span className="text-gray-500">
                                            {selectedRecord.totalStudents - selectedRecord.attendedCount} Tidak Hadir
                                        </span>
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                                    <button
                                        onClick={() => alert('Detail daftar hadir akan ditampilkan')}
                                        className="py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                                    >
                                        <MdPeople className="mr-2" /> Lihat Daftar Hadir
                                    </button>

                                    <button
                                        onClick={() => setShowDetailsModal(false)}
                                        className="py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                                    >
                                        Tutup
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowDetailsModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AttendanceHistory;
