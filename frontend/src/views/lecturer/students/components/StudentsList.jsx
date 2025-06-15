import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Card from "components/card";
import {
    MdSearch,
    MdFilterList,
    MdSort,
    MdNotifications,
    MdInfo,
    MdMail,
    MdArrowForward,
    MdArrowBack,
    MdPerson,
    MdTrendingUp,
    MdTrendingDown,
    MdRemoveRedEye
} from "react-icons/md";

// Dummy Data
const courses = [
    { id: 1, name: "Algoritma dan Pemrograman" },
    { id: 2, name: "Basis Data" },
    { id: 3, name: "Pemrograman Web" },
    { id: 4, name: "Kecerdasan Buatan" },
];

const students = [
    {
        id: 1,
        nim: "20210001",
        name: "Budi Santoso",
        gender: "Laki-laki",
        email: "budi.santoso@example.com",
        phone: "081234567890",
        courses: ["Algoritma dan Pemrograman", "Basis Data", "Pemrograman Web"],
        attendanceRate: 92,
        trend: "up"
    },
    {
        id: 2,
        nim: "20210002",
        name: "Siti Nuraini",
        gender: "Perempuan",
        email: "siti.nuraini@example.com",
        phone: "081234567891",
        courses: ["Algoritma dan Pemrograman", "Basis Data", "Kecerdasan Buatan"],
        attendanceRate: 88,
        trend: "down"
    },
    {
        id: 3,
        nim: "20210003",
        name: "Ahmad Rizki",
        gender: "Laki-laki",
        email: "ahmad.rizki@example.com",
        phone: "081234567892",
        courses: ["Algoritma dan Pemrograman", "Pemrograman Web", "Kecerdasan Buatan"],
        attendanceRate: 75,
        trend: "down"
    },
    {
        id: 4,
        nim: "20210004",
        name: "Diana Putri",
        gender: "Perempuan",
        email: "diana.putri@example.com",
        phone: "081234567893",
        courses: ["Basis Data", "Pemrograman Web", "Kecerdasan Buatan"],
        attendanceRate: 95,
        trend: "stable"
    },
    {
        id: 5,
        nim: "20210005",
        name: "Farhan Abdullah",
        gender: "Laki-laki",
        email: "farhan.abdullah@example.com",
        phone: "081234567894",
        courses: ["Algoritma dan Pemrograman", "Basis Data", "Kecerdasan Buatan"],
        attendanceRate: 80,
        trend: "up"
    },
    {
        id: 6,
        nim: "20210006",
        name: "Anisa Wulandari",
        gender: "Perempuan",
        email: "anisa.wulandari@example.com",
        phone: "081234567895",
        courses: ["Algoritma dan Pemrograman", "Pemrograman Web", "Kecerdasan Buatan"],
        attendanceRate: 90,
        trend: "stable"
    },
    {
        id: 7,
        nim: "20210007",
        name: "Dimas Pratama",
        gender: "Laki-laki",
        email: "dimas.pratama@example.com",
        phone: "081234567896",
        courses: ["Algoritma dan Pemrograman", "Basis Data", "Pemrograman Web"],
        attendanceRate: 73,
        trend: "down"
    },
    {
        id: 8,
        nim: "20210008",
        name: "Ratna Sari",
        gender: "Perempuan",
        email: "ratna.sari@example.com",
        phone: "081234567897",
        courses: ["Basis Data", "Pemrograman Web", "Kecerdasan Buatan"],
        attendanceRate: 87,
        trend: "up"
    },
];

const ITEMS_PER_PAGE = 6;

const StudentsList = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCourse, setSelectedCourse] = useState("");
    const [sortField, setSortField] = useState("name");
    const [sortOrder, setSortOrder] = useState("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const [studentDetails, setStudentDetails] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: "ease-in-out",
            once: true,
        });
    }, []);

    const handleViewDetails = (student) => {
        setStudentDetails(student);
        setShowDetailsModal(true);
    };

    // Filter students based on search and course
    const filteredStudents = students.filter(student => {
        // Search filter
        const matchesSearch =
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.nim.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email.toLowerCase().includes(searchTerm.toLowerCase());

        // Course filter  
        const matchesCourse = !selectedCourse || student.courses.includes(courses.find(c => c.id == selectedCourse)?.name);

        return matchesSearch && matchesCourse;
    });

    // Sort students
    const sortedStudents = [...filteredStudents].sort((a, b) => {
        let compareResult = 0;

        if (sortField === "name") {
            compareResult = a.name.localeCompare(b.name);
        }
        else if (sortField === "nim") {
            compareResult = a.nim.localeCompare(b.nim);
        }
        else if (sortField === "attendance") {
            compareResult = a.attendanceRate - b.attendanceRate;
        }

        return sortOrder === "asc" ? compareResult : -compareResult;
    });

    // Paginate students
    const totalPages = Math.ceil(sortedStudents.length / ITEMS_PER_PAGE);
    const paginatedStudents = sortedStudents.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const getAttendanceStatusClass = (rate) => {
        if (rate >= 90) return "text-green-600";
        if (rate >= 75) return "text-yellow-600";
        return "text-red-600";
    };

    return (
        <div className="mt-3">
            <div className="mb-5" data-aos="fade-down">
                <h1 className="text-3xl font-bold text-navy-700 dark:text-white">
                    Daftar Mahasiswa
                </h1>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Kelola dan lihat informasi mahasiswa
                </p>
            </div>

            <Card extra="p-5 mb-5" data-aos="fade-up">
                <div className="flex flex-col lg:flex-row gap-4 items-end">
                    <div className="flex-1 relative">
                        <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Cari berdasarkan nama, NIM, atau email..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="w-full md:w-64">
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

                    <div className="w-full md:w-64">
                        <select
                            className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 appearance-none"
                            value={`${sortField}-${sortOrder}`}
                            onChange={(e) => {
                                const [field, order] = e.target.value.split('-');
                                setSortField(field);
                                setSortOrder(order);
                            }}
                        >
                            <option value="name-asc">Nama (A-Z)</option>
                            <option value="name-desc">Nama (Z-A)</option>
                            <option value="nim-asc">NIM (Terkecil)</option>
                            <option value="nim-desc">NIM (Terbesar)</option>
                            <option value="attendance-desc">Kehadiran (Tertinggi)</option>
                            <option value="attendance-asc">Kehadiran (Terendah)</option>
                        </select>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-5" data-aos="fade-up">
                {paginatedStudents.map((student, index) => (
                    <Card
                        key={student.id}
                        extra="p-4 hover:shadow-md transition-all duration-200"
                        data-aos="fade-up"
                        data-aos-delay={(index * 100)}
                    >
                        <div className="flex items-center mb-3">
                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                <MdPerson className="h-6 w-6 text-indigo-600" />
                            </div>
                            <div className="ml-3">
                                <h4 className="text-base font-medium text-navy-700 dark:text-white">
                                    {student.name}
                                </h4>
                                <p className="text-xs text-gray-500">{student.nim}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-3">
                            <div>
                                <p className="text-xs text-gray-500">Email</p>
                                <p className="text-sm truncate">{student.email}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Jenis Kelamin</p>
                                <p className="text-sm">{student.gender}</p>
                            </div>
                        </div>

                        <div className="mb-3">
                            <p className="text-xs text-gray-500 mb-1">Mata Kuliah</p>
                            <div className="flex flex-wrap gap-1">
                                {student.courses.map((course, i) => (
                                    <span
                                        key={i}
                                        className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full"
                                    >
                                        {course}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="mb-3">
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-gray-500">Tingkat Kehadiran</span>
                                <div className="flex items-center">
                                    <span className={getAttendanceStatusClass(student.attendanceRate)}>
                                        {student.attendanceRate}%
                                    </span>
                                    {student.trend === "up" && <MdTrendingUp className="ml-1 text-green-500" />}
                                    {student.trend === "down" && <MdTrendingDown className="ml-1 text-red-500" />}
                                </div>
                            </div>
                            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${student.attendanceRate >= 90
                                            ? "bg-green-500"
                                            : student.attendanceRate >= 75
                                                ? "bg-yellow-500"
                                                : "bg-red-500"
                                        }`}
                                    style={{ width: `${student.attendanceRate}%` }}
                                />
                            </div>
                        </div>

                        <div className="flex justify-between">
                            <button
                                onClick={() => handleViewDetails(student)}
                                className="py-1.5 px-3 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                            >
                                <MdRemoveRedEye className="mr-1" /> Detail
                            </button>

                            <button
                                className="py-1.5 px-3 bg-blue-50 text-blue-700 text-sm rounded-lg hover:bg-blue-100 transition-colors flex items-center"
                                onClick={() => alert(`Email to ${student.email}`)}
                            >
                                <MdMail className="mr-1" /> Email
                            </button>
                        </div>
                    </Card>
                ))}
            </div>

            {paginatedStudents.length === 0 && (
                <Card extra="p-10 text-center" data-aos="fade-up">
                    <div className="flex flex-col items-center">
                        <MdInfo className="h-12 w-12 text-gray-300 mb-3" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">Tidak ada mahasiswa ditemukan</h3>
                        <p className="text-gray-500 mb-4">Tidak ada mahasiswa yang sesuai dengan kriteria pencarian Anda</p>
                        <button
                            onClick={() => {
                                setSearchTerm("");
                                setSelectedCourse("");
                            }}
                            className="py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Reset Filter
                        </button>
                    </div>
                </Card>
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

            {/* Student Details Modal */}
            {showDetailsModal && studentDetails && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                    <div className="relative bg-white rounded-xl shadow-lg w-full max-w-2xl" data-aos="zoom-in">
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                Detail Mahasiswa
                            </h3>

                            <div className="flex items-start mb-6">
                                <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                                    <MdPerson className="h-8 w-8 text-indigo-600" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold">{studentDetails.name}</h4>
                                    <p className="text-sm text-gray-500">{studentDetails.nim}</p>
                                    <div className="mt-1 flex items-center">
                                        <span className={`text-sm font-medium ${getAttendanceStatusClass(studentDetails.attendanceRate)}`}>
                                            Tingkat Kehadiran: {studentDetails.attendanceRate}%
                                        </span>
                                        {studentDetails.trend === "up" && <MdTrendingUp className="ml-1 text-green-500" />}
                                        {studentDetails.trend === "down" && <MdTrendingDown className="ml-1 text-red-500" />}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div>
                                    <h5 className="text-sm font-medium text-gray-700 mb-2">Informasi Kontak</h5>
                                    <div className="space-y-2">
                                        <p className="text-sm">
                                            <span className="text-gray-500">Email:</span> {studentDetails.email}
                                        </p>
                                        <p className="text-sm">
                                            <span className="text-gray-500">Telepon:</span> {studentDetails.phone}
                                        </p>
                                        <p className="text-sm">
                                            <span className="text-gray-500">Jenis Kelamin:</span> {studentDetails.gender}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <h5 className="text-sm font-medium text-gray-700 mb-2">Mata Kuliah</h5>
                                    <div className="flex flex-wrap gap-2">
                                        {studentDetails.courses.map((course, i) => (
                                            <span
                                                key={i}
                                                className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full"
                                            >
                                                {course}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => alert('Kirim notifikasi')}
                                    className="py-2 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                                >
                                    <MdNotifications className="mr-2" /> Notifikasi
                                </button>

                                <button
                                    onClick={() => alert('Tinjau kehadiran')}
                                    className="py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                                >
                                    <MdTrendingUp className="mr-2" /> Tinjau Kehadiran
                                </button>

                                <button
                                    onClick={() => setShowDetailsModal(false)}
                                    className="py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    Tutup
                                </button>
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

export default StudentsList;
