import React, { useEffect, useState } from "react";
import {
    MdSearch,
    MdCalendarToday,
    MdVerified,
    MdClose,
    MdPersonAdd,
    MdPerson,
    MdNoteAdd,
    MdAccessTime,
    MdSchool,
    MdCheckCircle,
    MdCancel,
    MdWarning,
    MdInfo,
    MdFilterList,
    MdRefresh,
    MdHistory,
    MdTrendingUp,
    MdGroup
} from "react-icons/md";
import AOS from "aos";
import "aos/dist/aos.css";

const ManualVerification = () => {
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedCourse, setSelectedCourse] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSession, setSelectedSession] = useState("");
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [reason, setReason] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [filterStatus, setFilterStatus] = useState("all");
    const [verificationMode, setVerificationMode] = useState("individual");

    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
        });
    }, []);

    // Enhanced dummy data
    const courses = [
        { id: "", name: "Pilih Mata Kuliah", code: "" },
        { id: "cs101", name: "Pemrograman Web", code: "CS101", credits: 3, enrolled: 45 },
        { id: "cs102", name: "Algoritma dan Struktur Data", code: "CS102", credits: 4, enrolled: 38 },
        { id: "cs103", name: "Basis Data", code: "CS103", credits: 3, enrolled: 42 },
        { id: "cs104", name: "Kecerdasan Buatan", code: "CS104", credits: 3, enrolled: 35 },
        { id: "cs105", name: "Rekayasa Perangkat Lunak", code: "CS105", credits: 4, enrolled: 40 },
    ];

    const sessions = [
        { id: "", time: "Pilih Sesi", duration: "" },
        { id: "s1", time: "08:00 - 11:00", period: "Pagi", duration: "3 jam", room: "Lab A1" },
        { id: "s2", time: "13:00 - 15:30", period: "Siang", duration: "2.5 jam", room: "Lab B2" },
        { id: "s3", time: "15:30 - 18:00", period: "Sore", duration: "2.5 jam", room: "Lab C3" },
    ];

    const students = [
        {
            id: 1,
            nim: "2021010101",
            name: "Ahmad Fauzi Rahman",
            program: "Teknik Informatika",
            semester: 6,
            status: "Aktif",
            attendanceRate: 95,
            lastAttendance: "2 jam yang lalu",
            totalAbsent: 2,
            avatar: "AF",
            phone: "08123456789",
            email: "ahmad.fauzi@student.ac.id"
        },
        {
            id: 2,
            nim: "2021010102",
            name: "Siti Nurhaliza Dewi",
            program: "Teknik Informatika",
            semester: 6,
            status: "Aktif",
            attendanceRate: 88,
            lastAttendance: "5 jam yang lalu",
            totalAbsent: 5,
            avatar: "SN",
            phone: "08198765432",
            email: "siti.nurhaliza@student.ac.id"
        },
        {
            id: 3,
            nim: "2021010201",
            name: "Budi Santoso Wijaya",
            program: "Sistem Informasi",
            semester: 6,
            status: "Aktif",
            attendanceRate: 92,
            lastAttendance: "1 hari yang lalu",
            totalAbsent: 3,
            avatar: "BS",
            phone: "08156789123",
            email: "budi.santoso@student.ac.id"
        },
        {
            id: 4,
            nim: "2020010101",
            name: "Indah Permata Sari",
            program: "Teknik Informatika",
            semester: 8,
            status: "Aktif",
            attendanceRate: 97,
            lastAttendance: "2 hari yang lalu",
            totalAbsent: 1,
            avatar: "IP",
            phone: "08167890234",
            email: "indah.permata@student.ac.id"
        },
        {
            id: 5,
            nim: "2022010101",
            name: "Dewi Lestari Putri",
            program: "Teknik Informatika",
            semester: 4,
            status: "Aktif",
            attendanceRate: 85,
            lastAttendance: "1 jam yang lalu",
            totalAbsent: 6,
            avatar: "DL",
            phone: "08178901345",
            email: "dewi.lestari@student.ac.id"
        },
        {
            id: 6,
            nim: "2021020101",
            name: "Muhammad Rifqi Alfarizi",
            program: "Sistem Informasi",
            semester: 6,
            status: "Aktif",
            attendanceRate: 90,
            lastAttendance: "3 jam yang lalu",
            totalAbsent: 4,
            avatar: "MR",
            phone: "08189012456",
            email: "rifqi.alfarizi@student.ac.id"
        }
    ];

    const recentVerifications = [
        {
            id: 1,
            studentName: "Ahmad Fauzi Rahman",
            nim: "2021010101",
            course: "Pemrograman Web",
            status: "present",
            time: "2 menit yang lalu",
            verifiedBy: "Admin"
        },
        {
            id: 2,
            studentName: "Siti Nurhaliza Dewi",
            nim: "2021010102",
            course: "Basis Data",
            status: "late",
            time: "15 menit yang lalu",
            verifiedBy: "Admin"
        },
        {
            id: 3,
            studentName: "Budi Santoso Wijaya",
            nim: "2021010201",
            course: "Algoritma dan Struktur Data",
            status: "excused",
            time: "1 jam yang lalu",
            verifiedBy: "Admin"
        }
    ];

    const stats = [
        {
            title: "Total Mahasiswa",
            value: students.length.toString(),
            icon: MdGroup,
            color: "bg-blue-500",
            change: "+2 semester ini"
        },
        {
            title: "Rata-rata Kehadiran",
            value: Math.round(students.reduce((acc, student) => acc + student.attendanceRate, 0) / students.length) + "%",
            icon: MdTrendingUp,
            color: "bg-green-500",
            change: "+3% dari bulan lalu"
        },
        {
            title: "Verifikasi Hari Ini",
            value: "12",
            icon: MdVerified,
            color: "bg-purple-500",
            change: "3 pending"
        }
    ];

    const filteredStudents = students.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.nim.includes(searchTerm);
        return matchesSearch;
    });

    const handleVerify = () => {
        setIsModalOpen(true);
    };

    const handleSubmit = (status) => {
        setIsModalOpen(false);
        setShowConfirmation(true);
        setTimeout(() => setShowConfirmation(false), 3000);
        setReason("");
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'present': return <MdCheckCircle className="text-green-500" />;
            case 'late': return <MdWarning className="text-yellow-500" />;
            case 'excused': return <MdInfo className="text-blue-500" />;
            case 'absent': return <MdCancel className="text-red-500" />;
            default: return <MdInfo className="text-gray-500" />;
        }
    };

    const getAttendanceColor = (rate) => {
        if (rate >= 90) return "text-green-600 bg-green-100";
        if (rate >= 75) return "text-yellow-600 bg-yellow-100";
        return "text-red-600 bg-red-100";
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-4 md:p-8">
            {/* Header Section */}
            <div className="mb-8" data-aos="fade-down">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                        <MdVerified className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                            Verifikasi Absensi Manual
                        </h1>
                        <p className="text-gray-600 text-lg">Kelola dan verifikasi kehadiran mahasiswa dengan mudah</p>
                    </div>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100"
                        data-aos="fade-up"
                        data-aos-delay={index * 100}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                                <p className="text-3xl font-bold text-gray-800 mt-1">{stat.value}</p>
                                <p className="text-gray-500 text-xs mt-2">{stat.change}</p>
                            </div>
                            <div className={`p-4 rounded-2xl ${stat.color} shadow-lg`}>
                                <stat.icon className="h-8 w-8 text-white" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="xl:col-span-2 space-y-6">
                    {/* Selection Form */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100" data-aos="fade-up">
                        <div className="flex items-center gap-3 mb-6">
                            <MdFilterList className="h-6 w-6 text-indigo-500" />
                            <h2 className="text-2xl font-bold text-gray-800">Filter & Pencarian</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            <div>
                                <label htmlFor="date" className="block text-sm font-semibold text-gray-700 mb-2">Tanggal</label>
                                <div className="relative">
                                    <MdCalendarToday className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
                                    <input
                                        type="date"
                                        id="date"
                                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-300"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="course" className="block text-sm font-semibold text-gray-700 mb-2">Mata Kuliah</label>
                                <select
                                    id="course"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none bg-white transition-all duration-300"
                                    value={selectedCourse}
                                    onChange={(e) => setSelectedCourse(e.target.value)}
                                >
                                    {courses.map(course => (
                                        <option key={course.id} value={course.id}>
                                            {course.code ? `${course.code} - ${course.name}` : course.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="session" className="block text-sm font-semibold text-gray-700 mb-2">Sesi Perkuliahan</label>
                                <select
                                    id="session"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none bg-white transition-all duration-300"
                                    value={selectedSession}
                                    onChange={(e) => setSelectedSession(e.target.value)}
                                >
                                    {sessions.map(session => (
                                        <option key={session.id} value={session.id}>
                                            {session.time ? `${session.time} (${session.period})` : session.time}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-grow">
                                <label htmlFor="search" className="block text-sm font-semibold text-gray-700 mb-2">Cari Mahasiswa</label>
                                <div className="relative">
                                    <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
                                    <input
                                        type="text"
                                        id="search"
                                        placeholder="Cari berdasarkan nama atau NIM..."
                                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-300"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl flex items-center hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-lg font-medium"
                                    disabled={!selectedCourse || !selectedDate || !selectedSession}
                                >
                                    <MdSearch className="mr-2" /> Tampilkan
                                </button>
                                <button className="bg-gray-100 text-gray-600 px-4 py-3 rounded-xl hover:bg-gray-200 transition-all duration-300">
                                    <MdRefresh className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        {/* Course Info */}
                        {selectedCourse && courses.find(c => c.id === selectedCourse) && (
                            <div className="mt-6 p-4 bg-indigo-50 rounded-xl border border-indigo-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold text-indigo-800">
                                            {courses.find(c => c.id === selectedCourse)?.name}
                                        </h3>
                                        <p className="text-sm text-indigo-600">
                                            {courses.find(c => c.id === selectedCourse)?.credits} SKS •
                                            {courses.find(c => c.id === selectedCourse)?.enrolled} mahasiswa terdaftar
                                        </p>
                                    </div>
                                    {selectedSession && (
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-indigo-800">
                                                {sessions.find(s => s.id === selectedSession)?.time}
                                            </p>
                                            <p className="text-xs text-indigo-600">
                                                {sessions.find(s => s.id === selectedSession)?.room}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Students List */}
                    {(selectedCourse && selectedDate && selectedSession) && (
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden" data-aos="fade-up" data-aos-delay="100">
                            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-800">Daftar Mahasiswa</h2>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {filteredStudents.length} dari {students.length} mahasiswa ditampilkan
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-200 transition-colors">
                                            Verifikasi Massal
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Mahasiswa</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Program</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Kehadiran</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredStudents.map((student, index) => (
                                            <tr key={student.id} className="hover:bg-gray-50 transition-colors duration-200"
                                                data-aos="fade-up" data-aos-delay={index * 50}>
                                                <td className="px-6 py-6">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-12 w-12">
                                                            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                                                {student.avatar}
                                                            </div>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-bold text-gray-900">{student.name}</div>
                                                            <div className="text-sm text-gray-500">NIM: {student.nim}</div>
                                                            <div className="text-xs text-gray-400">Semester {student.semester}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{student.program}</div>
                                                    <div className="text-xs text-gray-500">{student.lastAttendance}</div>
                                                </td>
                                                <td className="px-6 py-6 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className={`text-sm font-bold px-3 py-1 rounded-full ${getAttendanceColor(student.attendanceRate)}`}>
                                                            {student.attendanceRate}%
                                                        </div>
                                                        <div className="ml-2 text-xs text-gray-500">
                                                            {student.totalAbsent} alfa
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6 whitespace-nowrap">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${student.status === "Aktif" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                                                        }`}>
                                                        {student.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-6 whitespace-nowrap text-sm font-medium">
                                                    <button
                                                        className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-md flex items-center"
                                                        onClick={() => {
                                                            setSelectedStudent(student);
                                                            handleVerify();
                                                        }}
                                                    >
                                                        <MdVerified className="h-4 w-4 mr-1" />
                                                        Verifikasi
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {filteredStudents.length === 0 && (
                                <div className="p-12 text-center">
                                    <MdSearch className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500 text-lg">Tidak ada mahasiswa yang ditemukan</p>
                                    <p className="text-gray-400 text-sm">Coba ubah kriteria pencarian Anda</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Recent Verifications */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100" data-aos="fade-left">
                        <div className="flex items-center gap-3 mb-6">
                            <MdHistory className="h-6 w-6 text-indigo-500" />
                            <h2 className="text-xl font-bold text-gray-800">Verifikasi Terbaru</h2>
                        </div>

                        <div className="space-y-4">
                            {recentVerifications.map((verification, index) => (
                                <div
                                    key={verification.id}
                                    className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-300 hover:border-gray-300"
                                    data-aos="fade-left"
                                    data-aos-delay={index * 100}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-800 text-sm">
                                                {verification.studentName}
                                            </h3>
                                            <p className="text-xs text-gray-600">NIM: {verification.nim}</p>
                                        </div>
                                        <div className="flex items-center">
                                            {getStatusIcon(verification.status)}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-gray-600">
                                            <span className="font-medium">Mata Kuliah:</span> {verification.course}
                                        </p>
                                        <p className="text-xs text-gray-600">
                                            <span className="font-medium">Waktu:</span> {verification.time}
                                        </p>
                                        <p className="text-xs text-gray-600">
                                            <span className="font-medium">Oleh:</span> {verification.verifiedBy}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button className="w-full mt-4 py-2 px-4 text-indigo-600 hover:text-indigo-700 font-medium text-sm border border-indigo-200 rounded-xl hover:bg-indigo-50 transition-colors duration-300">
                            Lihat Semua Verifikasi
                        </button>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100" data-aos="fade-left" data-aos-delay="100">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Aksi Cepat</h2>

                        <div className="space-y-3">
                            <button className="w-full p-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-md flex items-center justify-center">
                                <MdPersonAdd className="h-5 w-5 mr-2" />
                                Tambah Mahasiswa Baru
                            </button>
                            <button className="w-full p-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 shadow-md flex items-center justify-center">
                                <MdRefresh className="h-5 w-5 mr-2" />
                                Sinkronisasi Data
                            </button>
                            <button className="w-full p-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-300 shadow-md flex items-center justify-center">
                                <MdSchool className="h-5 w-5 mr-2" />
                                Kelola Mata Kuliah
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Verification Modal */}
            {isModalOpen && selectedStudent && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" data-aos="zoom-in">
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-gray-900">Verifikasi Kehadiran</h3>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    <MdClose className="h-6 w-6" />
                                </button>
                            </div>

                            {/* Student Info Card */}
                            <div className="mb-6 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200">
                                <div className="flex items-center mb-4">
                                    <div className="h-16 w-16 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg mr-4">
                                        {selectedStudent.avatar}
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-gray-800">{selectedStudent.name}</h4>
                                        <p className="text-gray-600">NIM: {selectedStudent.nim}</p>
                                        <p className="text-sm text-gray-500">{selectedStudent.program} • Semester {selectedStudent.semester}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white p-3 rounded-lg">
                                        <p className="text-xs text-gray-500 font-medium">Tingkat Kehadiran</p>
                                        <p className={`text-lg font-bold ${getAttendanceColor(selectedStudent.attendanceRate).split(' ')[0]}`}>
                                            {selectedStudent.attendanceRate}%
                                        </p>
                                    </div>
                                    <div className="bg-white p-3 rounded-lg">
                                        <p className="text-xs text-gray-500 font-medium">Total Tidak Hadir</p>
                                        <p className="text-lg font-bold text-gray-800">{selectedStudent.totalAbsent} kali</p>
                                    </div>
                                </div>
                            </div>

                            {/* Course & Session Info */}
                            <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Mata Kuliah</p>
                                        <p className="text-lg font-semibold text-gray-900">
                                            {courses.find(c => c.id === selectedCourse)?.name}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Sesi & Tanggal</p>
                                        <p className="text-lg font-semibold text-gray-900">
                                            {sessions.find(s => s.id === selectedSession)?.time} • {selectedDate}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Reason Input */}
                            <div className="mb-6">
                                <label htmlFor="reason" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Catatan / Alasan (Opsional)
                                </label>
                                <textarea
                                    id="reason"
                                    rows={3}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-300"
                                    placeholder="Tambahkan catatan atau alasan verifikasi manual..."
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                ></textarea>
                            </div>

                            {/* Status Buttons */}
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-xl flex items-center justify-center hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg font-semibold"
                                    onClick={() => handleSubmit('present')}
                                >
                                    <MdCheckCircle className="mr-2 h-5 w-5" /> Hadir
                                </button>
                                <button
                                    className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-4 rounded-xl flex items-center justify-center hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 shadow-lg font-semibold"
                                    onClick={() => handleSubmit('late')}
                                >
                                    <MdAccessTime className="mr-2 h-5 w-5" /> Terlambat
                                </button>
                                <button
                                    className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-6 py-4 rounded-xl flex items-center justify-center hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 shadow-lg font-semibold"
                                    onClick={() => handleSubmit('excused')}
                                >
                                    <MdNoteAdd className="mr-2 h-5 w-5" /> Izin/Sakit
                                </button>
                                <button
                                    className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-4 rounded-xl flex items-center justify-center hover:from-red-600 hover:to-pink-700 transition-all duration-300 shadow-lg font-semibold"
                                    onClick={() => handleSubmit('absent')}
                                >
                                    <MdCancel className="mr-2 h-5 w-5" /> Tidak Hadir
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Enhanced Confirmation Toast */}
            {showConfirmation && (
                <div className="fixed bottom-6 right-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center z-50" data-aos="fade-left">
                    <div className="bg-white bg-opacity-20 p-2 rounded-full mr-3">
                        <MdCheckCircle className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="font-semibold">Berhasil!</p>
                        <p className="text-sm opacity-90">Absensi telah dicatat dalam sistem</p>
                    </div>
                </div>
            )}

            {/* Enhanced Instructions */}
            <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-200" data-aos="fade-up" data-aos-delay="200">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-indigo-500 rounded-lg">
                        <MdInfo className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-indigo-800">Panduan Verifikasi Manual</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-semibold text-indigo-700 mb-3">Langkah-langkah:</h4>
                        <ul className="space-y-2 text-indigo-600">
                            <li className="flex items-start">
                                <span className="bg-indigo-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center mr-3 mt-0.5">1</span>
                                Pilih tanggal, mata kuliah, dan sesi perkuliahan
                            </li>
                            <li className="flex items-start">
                                <span className="bg-indigo-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center mr-3 mt-0.5">2</span>
                                Gunakan fitur pencarian untuk menemukan mahasiswa
                            </li>
                            <li className="flex items-start">
                                <span className="bg-indigo-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center mr-3 mt-0.5">3</span>
                                Klik tombol "Verifikasi" pada mahasiswa yang dipilih
                            </li>
                            <li className="flex items-start">
                                <span className="bg-indigo-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center mr-3 mt-0.5">4</span>
                                Pilih status kehadiran dan tambahkan catatan jika perlu
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-indigo-700 mb-3">Status Kehadiran:</h4>
                        <div className="space-y-2">
                            <div className="flex items-center text-sm text-indigo-600">
                                <MdCheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                <span className="font-medium">Hadir:</span> Mahasiswa hadir tepat waktu
                            </div>
                            <div className="flex items-center text-sm text-indigo-600">
                                <MdAccessTime className="h-4 w-4 text-yellow-500 mr-2" />
                                <span className="font-medium">Terlambat:</span> Mahasiswa hadir tetapi terlambat
                            </div>
                            <div className="flex items-center text-sm text-indigo-600">
                                <MdNoteAdd className="h-4 w-4 text-blue-500 mr-2" />
                                <span className="font-medium">Izin/Sakit:</span> Mahasiswa tidak hadir dengan keterangan
                            </div>
                            <div className="flex items-center text-sm text-indigo-600">
                                <MdCancel className="h-4 w-4 text-red-500 mr-2" />
                                <span className="font-medium">Tidak Hadir:</span> Mahasiswa tidak hadir tanpa keterangan
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManualVerification;
