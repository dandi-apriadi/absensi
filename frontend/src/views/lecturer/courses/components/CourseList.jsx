import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import Card from "components/card";
import {
    MdSearch,
    MdFilterAlt,
    MdSort,
    MdAdd,
    MdPeople,
    MdMoreVert,
    MdEdit,
    MdBarChart,
    MdDelete,
    MdAssignment,
    MdAccessTime,
    MdCalendarToday,
    MdRoom,
    MdSchool
} from "react-icons/md";

// Dummy Data
const courses = [
    {
        id: 1,
        code: "CS-101",
        name: "Algoritma dan Pemrograman",
        semester: "Ganjil 2023/2024",
        students: 35,
        sessions: 16,
        completedSessions: 8,
        day: "Senin",
        time: "08:00 - 09:40",
        room: "Lab 301",
        attendanceRate: 92
    },
    {
        id: 2,
        code: "CS-102",
        name: "Basis Data",
        semester: "Ganjil 2023/2024",
        students: 42,
        sessions: 16,
        completedSessions: 7,
        day: "Selasa",
        time: "10:00 - 11:40",
        room: "Lab 302",
        attendanceRate: 89
    },
    {
        id: 3,
        code: "CS-103",
        name: "Pemrograman Web",
        semester: "Ganjil 2023/2024",
        students: 28,
        sessions: 16,
        completedSessions: 6,
        day: "Rabu",
        time: "13:00 - 14:40",
        room: "Lab 303",
        attendanceRate: 85
    },
    {
        id: 4,
        code: "CS-104",
        name: "Kecerdasan Buatan",
        semester: "Ganjil 2023/2024",
        students: 32,
        sessions: 16,
        completedSessions: 8,
        day: "Kamis",
        time: "15:00 - 16:40",
        room: "Lab 304",
        attendanceRate: 88
    },
];

const CourseList = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("name");
    const [sortOrder, setSortOrder] = useState("asc");
    const [dropdownOpen, setDropdownOpen] = useState(null);

    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: "ease-in-out",
            once: true,
        });
    }, []);

    const handleToggleDropdown = (courseId) => {
        if (dropdownOpen === courseId) {
            setDropdownOpen(null);
        } else {
            setDropdownOpen(courseId);
        }
    };

    // Filter and sort courses
    const filteredCourses = courses
        .filter(course =>
            course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.code.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            let comparison = 0;

            if (sortBy === "name") {
                comparison = a.name.localeCompare(b.name);
            } else if (sortBy === "code") {
                comparison = a.code.localeCompare(b.code);
            } else if (sortBy === "students") {
                comparison = a.students - b.students;
            } else if (sortBy === "attendance") {
                comparison = a.attendanceRate - b.attendanceRate;
            }

            return sortOrder === "asc" ? comparison : -comparison;
        });

    return (
        <div className="mt-3">
            <div className="mb-5" data-aos="fade-down">
                <h1 className="text-3xl font-bold text-navy-700 dark:text-white">
                    Daftar Mata Kuliah
                </h1>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Kelola semua mata kuliah yang Anda ajarkan
                </p>
            </div>

            <Card extra="p-5 mb-5" data-aos="fade-up">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="relative flex-1">
                        <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Cari mata kuliah berdasarkan nama atau kode..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <select
                                className="appearance-none pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                value={`${sortBy}-${sortOrder}`}
                                onChange={(e) => {
                                    const [newSortBy, newSortOrder] = e.target.value.split('-');
                                    setSortBy(newSortBy);
                                    setSortOrder(newSortOrder);
                                }}
                            >
                                <option value="name-asc">Nama (A-Z)</option>
                                <option value="name-desc">Nama (Z-A)</option>
                                <option value="code-asc">Kode (A-Z)</option>
                                <option value="code-desc">Kode (Z-A)</option>
                                <option value="students-desc">Jumlah Mahasiswa (Terbanyak)</option>
                                <option value="students-asc">Jumlah Mahasiswa (Tersedikit)</option>
                                <option value="attendance-desc">Kehadiran (Tertinggi)</option>
                                <option value="attendance-asc">Kehadiran (Terendah)</option>
                            </select>
                            <MdSort className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        </div>

                        <button
                            className="py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                            onClick={() => alert('Fitur belum tersedia')}
                        >
                            <MdAdd className="mr-1" /> Tambah
                        </button>
                    </div>
                </div>
            </Card>

            <div className="space-y-4" data-aos="fade-up" data-aos-delay="100">
                {filteredCourses.map((course, index) => (
                    <Card
                        key={course.id}
                        extra="p-5 hover:border-indigo-200 hover:shadow-md transition-all duration-200"
                        data-aos="fade-up"
                        data-aos-delay={(index + 1) * 100}
                    >
                        <div className="flex flex-col lg:flex-row lg:items-center">
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                        {course.code}
                                    </span>
                                    <div className="text-xs text-gray-500">
                                        {course.semester}
                                    </div>
                                </div>

                                <h3 className="text-lg font-semibold text-navy-700 dark:text-white mb-3">
                                    {course.name}
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <MdCalendarToday className="mr-2 text-gray-400" />
                                        {course.day}
                                    </div>

                                    <div className="flex items-center text-sm text-gray-600">
                                        <MdAccessTime className="mr-2 text-gray-400" />
                                        {course.time}
                                    </div>

                                    <div className="flex items-center text-sm text-gray-600">
                                        <MdRoom className="mr-2 text-gray-400" />
                                        {course.room}
                                    </div>

                                    <div className="flex items-center text-sm text-gray-600">
                                        <MdSchool className="mr-2 text-gray-400" />
                                        {course.students} Mahasiswa
                                    </div>
                                </div>

                                <div className="flex items-center mb-2">
                                    <div className="flex-1">
                                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                                            <span>Pertemuan</span>
                                            <span>{course.completedSessions} dari {course.sessions}</span>
                                        </div>
                                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-2 bg-indigo-600 rounded-full"
                                                style={{ width: `${(course.completedSessions / course.sessions) * 100}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="ml-6 text-right">
                                        <div className="text-xs text-gray-600 mb-1">Tingkat Kehadiran</div>
                                        <div className="text-lg font-semibold text-indigo-600">{course.attendanceRate}%</div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 lg:mt-0 lg:ml-6 flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2">
                                <Link
                                    to={`/lecturer/attendance/take-attendance?course=${course.id}`}
                                    className="flex-1 lg:w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-center text-sm font-medium"
                                >
                                    Ambil Absensi
                                </Link>

                                <Link
                                    to={`/lecturer/courses/course-details?id=${course.id}`}
                                    className="flex-1 lg:w-full py-2 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-center text-sm font-medium"
                                >
                                    Lihat Detail
                                </Link>

                                <div className="relative">
                                    <button
                                        onClick={() => handleToggleDropdown(course.id)}
                                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                                    >
                                        <MdMoreVert />
                                    </button>

                                    {dropdownOpen === course.id && (
                                        <div className="absolute right-0 mt-1 py-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                                            <button
                                                onClick={() => alert('Fitur belum tersedia')}
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                            >
                                                <MdEdit className="mr-2" /> Edit Mata Kuliah
                                            </button>
                                            <button
                                                onClick={() => alert('Fitur belum tersedia')}
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                            >
                                                <MdBarChart className="mr-2" /> Laporan Kehadiran
                                            </button>
                                            <button
                                                onClick={() => alert('Fitur belum tersedia')}
                                                className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 flex items-center text-red-600"
                                            >
                                                <MdDelete className="mr-2" /> Hapus
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {filteredCourses.length === 0 && (
                <Card extra="p-10 text-center" data-aos="fade-up">
                    <div className="flex flex-col items-center">
                        <div className="rounded-full bg-gray-100 p-4 mb-4">
                            <MdAssignment className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">Tidak ada mata kuliah ditemukan</h3>
                        <p className="text-gray-500 mb-4">Tidak ada mata kuliah yang sesuai dengan kriteria pencarian Anda</p>
                        <button
                            onClick={() => setSearchTerm("")}
                            className="py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Reset Pencarian
                        </button>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default CourseList;
