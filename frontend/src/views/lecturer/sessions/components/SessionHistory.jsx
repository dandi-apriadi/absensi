import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Card from "components/card";
import {
    MdSearch,
    MdCalendarToday,
    MdAccessTime,
    MdRoom,
    MdFileDownload,
    MdSort,
    MdArrowBack,
    MdArrowForward,
    MdInfo
} from "react-icons/md";

// Dummy Data
const courses = [
    { id: 1, code: "CS-101", name: "Algoritma dan Pemrograman" },
    { id: 2, code: "CS-102", name: "Basis Data" },
    { id: 3, code: "CS-103", name: "Pemrograman Web" },
    { id: 4, code: "CS-104", name: "Kecerdasan Buatan" },
];

const sessions = [
    { id: 1, course: "CS-101", topic: "Algoritma Sorting", date: "2023-10-15", time: "10:00 - 12:00", room: "Ruang 101", attendedCount: 30, totalStudents: 40 },
    { id: 2, course: "CS-102", topic: "Algoritma Greedy", date: "2023-10-22", time: "10:00 - 12:00", room: "Ruang 102", attendedCount: 25, totalStudents: 40 },
    { id: 3, course: "CS-103", topic: "Dynamic Programming", date: "2023-10-29", time: "10:00 - 12:00", room: "Ruang 103", attendedCount: 35, totalStudents: 40 },
];

const SessionHistory = () => {
    const [selectedCourse, setSelectedCourse] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [dateRange, setDateRange] = useState({ start: "", end: "" });
    const [sortField, setSortField] = useState("date");
    const [sortOrder, setSortOrder] = useState("desc");
    const [currentPage, setCurrentPage] = useState(1);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [sessionDetails, setSessionDetails] = useState(null);

    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: "ease-in-out",
            once: true,
        });
    }, []);

    const filteredSessions = sessions.filter(session => {
        const withinDateRange = (!dateRange.start || new Date(session.date) >= new Date(dateRange.start)) &&
            (!dateRange.end || new Date(session.date) <= new Date(dateRange.end));
        const matchesSearchTerm = session.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
            session.topic.toLowerCase().includes(searchTerm.toLowerCase());
        return withinDateRange && matchesSearchTerm;
    });

    const sortedSessions = [...filteredSessions].sort((a, b) => {
        let compareResult = 0;

        if (sortField === "date") {
            compareResult = new Date(a.date) - new Date(b.date);
        }
        else if (sortField === "attendance") {
            compareResult = (a.attendedCount / a.totalStudents) - (b.attendedCount / b.totalStudents);
        }
        else if (sortField === "course") {
            compareResult = a.course.localeCompare(b.course);
        }

        return sortOrder === "asc" ? compareResult : -compareResult;
    });

    // Paginate sessions
    const ITEMS_PER_PAGE = 10;
    const totalPages = Math.ceil(sortedSessions.length / ITEMS_PER_PAGE);
    const paginatedSessions = sortedSessions.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // Handle pagination
    const handlePageChange = (pageNum) => {
        setCurrentPage(pageNum);
    };

    // Calculate stats
    const totalSessions = filteredSessions.length;
    const totalStudentsAttended = filteredSessions.reduce((sum, session) => sum + session.attendedCount, 0);
    const totalStudentsPossible = filteredSessions.reduce((sum, session) => sum + session.totalStudents, 0);
    const averageAttendanceRate = totalStudentsPossible ? Math.round((totalStudentsAttended / totalStudentsPossible) * 100) : 0;

    // Format date
    const formatDate = (dateString) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    const handleViewDetails = (session) => {
        setSessionDetails(session);
        setShowDetailsModal(true);
    };

    return (
        <div className="mt-3">
            <div className="mb-5" data-aos="fade-down">
                <h1 className="text-3xl font-bold text-navy-700 dark:text-white">
                    Riwayat Sesi
                </h1>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Lihat riwayat sesi perkuliahan yang telah selesai
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 mb-5">
                <Card extra="p-4 !flex flex-col items-center" data-aos="fade-up" data-aos-delay="100">
                    <div className="rounded-full bg-indigo-100 p-3 mb-2">
                        <MdCalendarToday className="h-6 w-6 text-indigo-600" />
                    </div>
                    <p className="text-xl font-bold">{totalSessions}</p>
                    <p className="text-sm text-gray-500">Total Sesi</p>
                </Card>

                <Card extra="p-4 !flex flex-col items-center" data-aos="fade-up" data-aos-delay="200">
                    <div className="rounded-full bg-green-100 p-3 mb-2">
                        <MdAccessTime className="h-6 w-6 text-green-600" />
                    </div>
                    <p className="text-xl font-bold">{totalStudentsAttended}</p>
                    <p className="text-sm text-gray-500">Total Kehadiran</p>
                </Card>

                <Card extra="p-4 !flex flex-col items-center" data-aos="fade-up" data-aos-delay="300">
                    <div className="rounded-full bg-blue-100 p-3 mb-2">
                        <MdSort className="h-6 w-6 text-blue-600" />
                    </div>
                    <p className="text-xl font-bold">{averageAttendanceRate}%</p>
                    <p className="text-sm text-gray-500">Rata-rata Kehadiran</p>
                </Card>

                <Card extra="p-4 !flex flex-col items-center" data-aos="fade-up" data-aos-delay="400">
                    <div className="rounded-full bg-purple-100 p-3 mb-2">
                        <MdRoom className="h-6 w-6 text-purple-600" />
                    </div>
                    <p className="text-xl font-bold">{courses.length}</p>
                    <p className="text-sm text-gray-500">Mata Kuliah</p>
                </Card>
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
                        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4">
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
                                onClick={() => alert('Export laporan sesi')}
                                className="w-full lg:w-auto py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
                            >
                                <MdFileDownload className="mr-2" /> Export Laporan
                            </button>
                        </div>
                    </div>
                </div>

                {paginatedSessions.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Sesi
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
                                {paginatedSessions.map((session, index) => (
                                    <tr key={session.id} data-aos="fade-up" data-aos-delay={(index * 50)}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{session.course}</div>
                                                <div className="text-sm text-gray-500">{session.topic}</div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    <span className="inline-block mr-2">
                                                        <MdAccessTime className="inline text-gray-400 mr-1" />
                                                        {session.time}
                                                    </span>
                                                    <span>
                                                        <MdRoom className="inline text-gray-400 mr-1" />
                                                        {session.room}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{formatDate(session.date)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-full max-w-[100px]">
                                                    <div className="h-2 bg-gray-200 rounded-full">
                                                        <div
                                                            className={`h-2 rounded-full ${(session.attendedCount / session.totalStudents) * 100 >= 90
                                                                    ? "bg-green-500"
                                                                    : (session.attendedCount / session.totalStudents) * 100 >= 75
                                                                        ? "bg-yellow-500"
                                                                        : "bg-red-500"
                                                                }`}
                                                            style={{ width: `${(session.attendedCount / session.totalStudents) * 100}%` }}
                                                        />
                                                    </div>
                                                </div>
                                                <span className="ml-3 text-sm font-medium text-gray-900">
                                                    {session.attendedCount}/{session.totalStudents} ({Math.round((session.attendedCount / session.totalStudents) * 100)}%)
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <button
                                                onClick={() => handleViewDetails(session)}
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
                                onClick={() => handlePageChange(currentPage - 1)}
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
                                    onClick={() => handlePageChange(i + 1)}
                                    className={`px-3 py-1 rounded-md ${currentPage === i + 1
                                            ? "bg-indigo-600 text-white"
                                            : "text-gray-500 hover:bg-gray-100"
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
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

            {/* Session Details Modal */}
            {showDetailsModal && sessionDetails && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                    <div className="relative bg-white rounded-xl shadow-lg w-full max-w-2xl" data-aos="zoom-in">
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                                Detail Sesi Perkuliahan
                            </h3>

                            <div className="space-y-6">
                                <div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Mata Kuliah</p>
                                            <p className="text-base font-medium">{sessionDetails.course}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Topik</p>
                                            <p className="text-base font-medium">{sessionDetails.topic}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Tanggal & Waktu</p>
                                            <p className="text-base font-medium">{formatDate(sessionDetails.date)} - {sessionDetails.time}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Ruangan</p>
                                            <p className="text-base font-medium">{sessionDetails.room}</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-medium">Statistik Kehadiran</h4>
                                        <div className="text-sm text-gray-500">
                                            {sessionDetails.attendedCount} dari {sessionDetails.totalStudents} mahasiswa hadir
                                        </div>
                                    </div>

                                    <div className="w-full h-2.5 bg-gray-200 rounded-full">
                                        <div
                                            className={`h-2.5 rounded-full ${(sessionDetails.attendedCount / sessionDetails.totalStudents) * 100 >= 90
                                                    ? "bg-green-500"
                                                    : (sessionDetails.attendedCount / sessionDetails.totalStudents) * 100 >= 75
                                                        ? "bg-yellow-500"
                                                        : "bg-red-500"
                                                }`}
                                            style={{ width: `${(sessionDetails.attendedCount / sessionDetails.totalStudents) * 100}%` }}
                                        />
                                    </div>

                                    <div className="mt-1 flex justify-between text-xs">
                                        <span className="text-gray-500">
                                            {Math.round((sessionDetails.attendedCount / sessionDetails.totalStudents) * 100)}% Kehadiran
                                        </span>
                                        <span className="text-gray-500">
                                            {sessionDetails.totalStudents - sessionDetails.attendedCount} Tidak Hadir
                                        </span>
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                                    <button
                                        onClick={() => alert('Detail daftar hadir akan ditampilkan')}
                                        className="py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                    >
                                        Lihat Daftar Hadir
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

export default SessionHistory;