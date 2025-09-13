import React, { useEffect, useState } from "react";
import { MdSearch, MdFilterList, MdCalendarToday, MdPrint, MdFileDownload, MdAccessTime } from "react-icons/md";
import { MdHistory } from "react-icons/md";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";

// API Configuration
const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";
const api = axios.create({
    baseURL: API_BASE,
    withCredentials: true
});

const AttendanceHistory = () => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCourse, setSelectedCourse] = useState("all");
    const [selectedStatus, setSelectedStatus] = useState("all");
    
    // Backend integration states
    const [courses, setCourses] = useState([]);
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [statistics, setStatistics] = useState({
        totalRecords: 0,
        present: 0,
        late: 0,
        absent: 0,
        excused: 0
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const recordsPerPage = 10;

    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
        });
        
        // Load initial data
        fetchCourses();
        fetchAttendanceHistory();
    }, []);

    // Fetch attendance history when filters change
    useEffect(() => {
        fetchAttendanceHistory();
    }, [currentPage, selectedCourse, selectedStatus, startDate, endDate, searchTerm]);

    const fetchCourses = async () => {
        try {
            setError(null);
            const response = await api.get('/api/attendance/courses');
            
            if (response.data.success) {
                const coursesWithAll = [
                    { id: "all", name: "Semua Mata Kuliah" },
                    ...response.data.data
                ];
                setCourses(coursesWithAll);
            } else {
                setError(response.data.message || 'Gagal memuat data mata kuliah');
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
            setError('Gagal memuat data mata kuliah: ' + (error.response?.data?.message || error.message));
            // Fallback to default data
            setCourses([{ id: "all", name: "Semua Mata Kuliah" }]);
        }
    };

    const fetchAttendanceHistory = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const params = {
                page: currentPage,
                limit: recordsPerPage,
                course: selectedCourse !== 'all' ? selectedCourse : '',
                status: selectedStatus !== 'all' ? selectedStatus : '',
                startDate: startDate || '',
                endDate: endDate || '',
                search: searchTerm || ''
            };

            const response = await api.get('/api/attendance/history', { params });
            
            if (response.data.success) {
                setAttendanceRecords(response.data.data.records || []);
                setTotalPages(response.data.data.totalPages || 1);
                setTotalRecords(response.data.data.totalRecords || 0);
                setStatistics(response.data.data.statistics || {
                    totalRecords: 0,
                    present: 0,
                    late: 0,
                    absent: 0,
                    excused: 0
                });
            } else {
                setError(response.data.message || 'Gagal memuat data riwayat absensi');
                setAttendanceRecords([]);
                setTotalPages(1);
                setTotalRecords(0);
            }
        } catch (error) {
            console.error('Error fetching attendance history:', error);
            setError('Gagal memuat data riwayat absensi: ' + (error.response?.data?.message || error.message));
            setAttendanceRecords([]);
            setTotalPages(1);
            setTotalRecords(0);
        } finally {
            setLoading(false);
        }
    };

    const handleExportData = async (format = 'excel') => {
        try {
            setLoading(true);
            
            const params = {
                course: selectedCourse !== 'all' ? selectedCourse : '',
                status: selectedStatus !== 'all' ? selectedStatus : '',
                startDate: startDate || '',
                endDate: endDate || '',
                search: searchTerm || '',
                format: format
            };

            const response = await api.get('/api/attendance/export', { 
                params,
                responseType: 'blob'
            });
            
            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `attendance_history_${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : 'pdf'}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error exporting data:', error);
            setError('Gagal mengekspor data: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    // Status options for filter dropdown
    const statusOptions = [
        { id: "all", name: "Semua Status" },
        { id: "present", name: "Hadir" },
        { id: "late", name: "Terlambat" },
        { id: "absent", name: "Tidak Hadir" },
        { id: "excused", name: "Izin/Sakit" }
    ];

    // Filtered records based on current filters
    const filteredRecords = attendanceRecords.filter(record => {
        const matchesSearch = !searchTerm || 
            record.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.student_nim?.includes(searchTerm);

        const matchesCourse = selectedCourse === "all" || record.course_id == selectedCourse;
        const matchesStatus = selectedStatus === "all" || record.status === selectedStatus;

        return matchesSearch && matchesCourse && matchesStatus;
    });

    const getStatusBadge = (status) => {
        switch (status) {
            case "present":
                return <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Hadir</span>;
            case "late":
                return <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Terlambat</span>;
            case "absent":
                return <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Tidak Hadir</span>;
            case "excused":
                return <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Izin/Sakit</span>;
            default:
                return <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Unknown</span>;
        }
    };

    const getVerificationBadge = (method) => {
        switch (method) {
            case "face_recognition":
            case "Face Recognition":
                return <span className="text-green-600 text-sm">Face Recognition</span>;
            case "qr_code":
            case "QR Code":
                return <span className="text-purple-600 text-sm">QR Code</span>;
            case "manual":
            case "Manual Entry":
                return <span className="text-blue-600 text-sm">Manual Entry</span>;
            case "auto":
                return <span className="text-indigo-600 text-sm">Auto</span>;
            default:
                return <span className="text-gray-600 text-sm">-</span>;
        }
    };

    return (
        <div className="p-4 md:p-8">
            <div className="mb-8" data-aos="fade-down">
                <h1 className="text-3xl font-bold text-gray-800">Riwayat Absensi</h1>
                <p className="text-gray-600">Pencarian dan filter riwayat absensi mahasiswa</p>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6" data-aos="fade-up">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="relative">
                        <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari nama/NIM mahasiswa"
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <div className="flex-1">
                            <div className="relative">
                                <MdFilterList className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <select
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none"
                                    value={selectedCourse}
                                    onChange={(e) => setSelectedCourse(e.target.value)}
                                >
                                    {courses.map(course => (
                                        <option key={course.id} value={course.id}>{course.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <div className="flex-1">
                            <div className="relative">
                                <MdFilterList className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <select
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none"
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                >
                                    {statusOptions.map(option => (
                                        <option key={option.id} value={option.id}>{option.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <div className="flex-1">
                            <div className="relative">
                                <MdCalendarToday className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="date"
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>
                        </div>
                        <span className="text-gray-500">to</span>
                        <div className="flex-1">
                            <div className="relative">
                                <MdCalendarToday className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="date"
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                    <button 
                        onClick={fetchAttendanceHistory}
                        disabled={loading}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <MdSearch className="mr-2" /> {loading ? 'Loading...' : 'Refresh Data'}
                    </button>
                    <button 
                        onClick={() => {
                            setSearchTerm("");
                            setSelectedCourse("all");
                            setSelectedStatus("all");
                            setStartDate("");
                            setEndDate("");
                            setCurrentPage(1);
                        }}
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center hover:bg-gray-200 transition-colors"
                    >
                        Clear Filters
                    </button>
                    <div className="flex-grow"></div>
                    <button 
                        onClick={() => handleExportData('pdf')}
                        disabled={loading}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <MdPrint className="mr-2" /> Print PDF
                    </button>
                    <button 
                        onClick={() => handleExportData('excel')}
                        disabled={loading}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <MdFileDownload className="mr-2" /> Export Excel
                    </button>
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6" data-aos="fade-up">
                    <div className="flex items-center">
                        <div className="text-red-600 mr-3">⚠️</div>
                        <div>
                            <h3 className="text-red-800 font-medium">Error</h3>
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                        <button 
                            onClick={() => setError(null)}
                            className="ml-auto text-red-600 hover:text-red-800"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="bg-white rounded-xl shadow-md p-8 text-center" data-aos="fade-up">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Memuat data riwayat absensi...</p>
                </div>
            )}

            {/* Attendance Records Table */}
            {!loading && (
                <div className="bg-white rounded-xl shadow-md overflow-hidden" data-aos="fade-up" data-aos-delay="100">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">
                            Riwayat Absensi ({totalRecords} records)
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIM</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mata Kuliah</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ruangan</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verifikasi</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diverifikasi Oleh</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredRecords.length === 0 ? (
                                    <tr>
                                        <td colSpan="9" className="px-6 py-8 text-center text-gray-500">
                                            <MdHistory className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                            <p>Tidak ada data riwayat absensi yang ditemukan</p>
                                            <p className="text-sm">Coba ubah filter atau criteria pencarian</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredRecords.map((record) => (
                                        <tr key={record.id} className="hover:bg-gray-50 transition-colors duration-150">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {record.attendance_date ? new Date(record.attendance_date).toLocaleDateString('id-ID') : '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {record.attendance_time || "-"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {record.student_nim || "-"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {record.student_name || "-"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {record.course_name || "-"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {record.room_name || "-"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {getStatusBadge(record.status)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {getVerificationBadge(record.verification_method)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {record.verified_by || "System"}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button 
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1 || loading}
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <button 
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages || loading}
                                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Showing <span className="font-medium">{((currentPage - 1) * recordsPerPage) + 1}</span> to{' '}
                                    <span className="font-medium">
                                        {Math.min(currentPage * recordsPerPage, totalRecords)}
                                    </span>{' '}
                                    of <span className="font-medium">{totalRecords}</span> results
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1 || loading}
                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <span className="sr-only">Previous</span>
                                        &laquo;
                                    </button>
                                    
                                    {/* Page numbers */}
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        const pageNum = i + Math.max(1, currentPage - 2);
                                        if (pageNum > totalPages) return null;
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => setCurrentPage(pageNum)}
                                                disabled={loading}
                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium disabled:cursor-not-allowed ${
                                                    currentPage === pageNum
                                                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                    
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages || loading}
                                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <span className="sr-only">Next</span>
                                        &raquo;
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Summary Stats */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6" data-aos="fade-up" data-aos-delay="200">
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Records</p>
                            <h3 className="text-xl font-bold text-gray-900 mt-1">{statistics.totalRecords}</h3>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-full">
                            <MdAccessTime className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Present</p>
                            <h3 className="text-xl font-bold text-green-600 mt-1">
                                {statistics.present} ({statistics.totalRecords > 0 ? Math.round((statistics.present / statistics.totalRecords) * 100) : 0}%)
                            </h3>
                        </div>
                        <div className="bg-green-100 p-3 rounded-full">
                            <MdAccessTime className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Late</p>
                            <h3 className="text-xl font-bold text-yellow-600 mt-1">
                                {statistics.late} ({statistics.totalRecords > 0 ? Math.round((statistics.late / statistics.totalRecords) * 100) : 0}%)
                            </h3>
                        </div>
                        <div className="bg-yellow-100 p-3 rounded-full">
                            <MdAccessTime className="h-6 w-6 text-yellow-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Absent/Excused</p>
                            <h3 className="text-xl font-bold text-red-600 mt-1">
                                {(statistics.absent + statistics.excused)} ({statistics.totalRecords > 0 ? Math.round(((statistics.absent + statistics.excused) / statistics.totalRecords) * 100) : 0}%)
                            </h3>
                        </div>
                        <div className="bg-red-100 p-3 rounded-full">
                            <MdAccessTime className="h-6 w-6 text-red-600" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttendanceHistory;
