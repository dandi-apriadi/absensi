import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import Card from "components/card";
import {
    MdBook,
    MdPeople,
    MdCalendarToday,
    MdAccessTime,
    MdRoom,
    MdBarChart,
    MdTrendingUp,
    MdOutlineDashboard,
    MdOutlineTableChart,
    MdEdit,
    MdPrint,
    MdArrowBack,
    MdCheckCircle,
    MdFace,
    MdQrCode,
    MdVerified,
    MdWarning,
    MdHistory,
    MdInfo,
    MdMessage,
    MdPersonAdd,
    MdPersonRemove,
    MdDownload,
    MdSearch
} from "react-icons/md";

// Dummy Data
const courseDetails = {
    id: 1,
    code: "CS-101",
    name: "Algoritma dan Pemrograman",
    semester: "Ganjil 2023/2024",
    credits: 3,
    description: "Mata kuliah ini membahas tentang konsep dasar algoritma dan pemrograman, meliputi struktur data, algoritma sorting, searching, dan kompleksitas algoritma.",
    schedule: [
        { day: "Senin", time: "08:00 - 09:40", room: "Lab 301" },
        { day: "Rabu", time: "10:00 - 11:40", room: "Lab 301" }
    ],
    totalStudents: 35,
    attendanceStats: {
        average: 92,
        lastSession: 94,
        trend: "up",
        bySessions: [90, 91, 89, 93, 92, 94],
        byStatus: [
            { status: "Hadir", percentage: 92, count: 32 },
            { status: "Izin/Sakit", percentage: 5, count: 2 },
            { status: "Tidak Hadir", percentage: 3, count: 1 }
        ]
    },
    lastSessions: [
        { id: 1, date: "2023-10-15", topic: "Algoritma Sorting", attendanceRate: 94 },
        { id: 2, date: "2023-10-08", topic: "Data Structures", attendanceRate: 92 },
        { id: 3, date: "2023-10-01", topic: "Searching Algorithms", attendanceRate: 93 }
    ],
    studentManagement: {
        lowAttendance: [
            { id: 1, nim: "20210003", name: "Ahmad Rizki", attendanceRate: 72 },
            { id: 2, nim: "20210007", name: "Dimas Pratama", attendanceRate: 74 }
        ]
    }
};

const CourseDetails = () => {
    const [searchParams] = useSearchParams();
    const courseId = searchParams.get("id") || courseDetails.id;
    const [activeTab, setActiveTab] = useState("overview");
    const [course, setCourse] = useState(courseDetails);

    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: "ease-in-out",
            once: true,
        });

        // In a real app, you would fetch the course details based on courseId
        // For now, we're using the dummy data
    }, [courseId]);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    return (
        <div className="mt-3">
            <div className="mb-5 flex justify-between items-start" data-aos="fade-down">
                <div>
                    <div className="flex items-center">
                        <Link to="/lecturer/courses" className="mr-2 p-1 rounded-full hover:bg-gray-100">
                            <MdArrowBack className="h-6 w-6 text-gray-500" />
                        </Link>
                        <h1 className="text-3xl font-bold text-navy-700 dark:text-white">
                            {course.code}: {course.name}
                        </h1>
                    </div>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {course.semester} • {course.credits} SKS
                    </p>
                </div>
                <div className="flex space-x-2">
                    <button className="py-2 px-4 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
                        <MdEdit className="mr-2" /> Edit
                    </button>
                    <button className="py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center">
                        <MdQrCode className="mr-2" /> Ambil Absensi
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 mb-5">
                <Card extra="!flex flex-col items-center p-5" data-aos="fade-up" data-aos-delay="100">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                        <MdPeople className="h-8 w-8 text-green-500" />
                    </div>
                    <p className="mt-4 text-xl font-bold text-navy-700 dark:text-white">{course.totalStudents}</p>
                    <p className="mt-1 text-sm text-gray-600">Total Mahasiswa</p>
                </Card>

                <Card extra="!flex flex-col items-center p-5" data-aos="fade-up" data-aos-delay="200">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
                        <MdBarChart className="h-8 w-8 text-indigo-500" />
                    </div>
                    <p className="mt-4 text-xl font-bold text-navy-700 dark:text-white">
                        {course.attendanceStats.average}%
                    </p>
                    <p className="mt-1 text-sm text-gray-600">Rata-rata Kehadiran</p>
                    <div className="mt-2 flex items-center text-sm text-green-600">
                        <MdTrendingUp className="mr-1" />
                        <span>+{course.attendanceStats.trend === "up" ? "2" : "0"}% dari sebelumnya</span>
                    </div>
                </Card>

                <Card extra="!flex flex-col items-center p-5" data-aos="fade-up" data-aos-delay="300">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                        <MdWarning className="h-8 w-8 text-red-500" />
                    </div>
                    <p className="mt-4 text-xl font-bold text-navy-700 dark:text-white">
                        {course.studentManagement.lowAttendance.length}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">Kehadiran Rendah</p>
                </Card>

                <Card extra="!flex flex-col items-center p-5" data-aos="fade-up" data-aos-delay="400">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                        <MdAccessTime className="h-8 w-8 text-blue-500" />
                    </div>
                    <p className="mt-4 text-xl font-bold text-navy-700 dark:text-white">
                        {course.attendanceStats.lastSession}%
                    </p>
                    <p className="mt-1 text-sm text-gray-600">Kehadiran Terakhir</p>
                </Card>
            </div>

            <div className="mb-5" data-aos="fade-up">
                <div className="flex border-b border-gray-200">
                    <button
                        className={`py-3 px-6 font-medium text-sm border-b-2 ${activeTab === "overview" ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                        onClick={() => setActiveTab("overview")}
                    >
                        <div className="flex items-center">
                            <MdOutlineDashboard className="mr-2" /> Overview
                        </div>
                    </button>
                    <button
                        className={`py-3 px-6 font-medium text-sm border-b-2 ${activeTab === "attendance" ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                        onClick={() => setActiveTab("attendance")}
                    >
                        <div className="flex items-center">
                            <MdFace className="mr-2" /> Kehadiran
                        </div>
                    </button>
                    <button
                        className={`py-3 px-6 font-medium text-sm border-b-2 ${activeTab === "students" ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                        onClick={() => setActiveTab("students")}
                    >
                        <div className="flex items-center">
                            <MdPeople className="mr-2" /> Mahasiswa
                        </div>
                    </button>
                </div>
            </div>

            {activeTab === "overview" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    <Card extra="p-5 lg:col-span-2" data-aos="fade-up">
                        <div className="mb-4">
                            <h3 className="text-lg font-bold text-navy-700 dark:text-white flex items-center">
                                <MdBook className="mr-2" /> Informasi Mata Kuliah
                            </h3>
                        </div>
                        <div className="mb-6">
                            <p className="text-sm text-gray-600">{course.description}</p>
                        </div>
                        <div>
                            <h4 className="text-base font-semibold text-navy-700 dark:text-white mb-3">Jadwal Perkuliahan</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {course.schedule.map((schedule, index) => (
                                    <div key={index} className="p-3 border border-gray-200 rounded-lg">
                                        <div className="flex items-center mb-2">
                                            <div className="p-2 rounded-full bg-indigo-100 mr-3">
                                                <MdCalendarToday className="h-5 w-5 text-indigo-600" />
                                            </div>
                                            <span className="text-base font-medium">{schedule.day}</span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-500 ml-11 mb-1">
                                            <MdAccessTime className="mr-2" />
                                            {schedule.time}
                                        </div>
                                        <div className="flex items-center text-sm text-gray-500 ml-11">
                                            <MdRoom className="mr-2" />
                                            {schedule.room}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>

                    <Card extra="p-5" data-aos="fade-up" data-aos-delay="100">
                        <div className="mb-4">
                            <h3 className="text-lg font-bold text-navy-700 dark:text-white flex items-center">
                                <MdBarChart className="mr-2" /> Statistik Kehadiran
                            </h3>
                        </div>

                        <div>
                            <h4 className="text-sm font-semibold mb-2">Distribusi Status</h4>
                            <div className="space-y-3 mb-6">
                                {course.attendanceStats.byStatus.map((item, index) => (
                                    <div key={index}>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span>{item.status}</span>
                                            <span>{item.percentage}% ({item.count} mahasiswa)</span>
                                        </div>
                                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${index === 0 ? "bg-green-500" : index === 1 ? "bg-blue-500" : "bg-red-500"
                                                    }`}
                                                style={{ width: `${item.percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <h4 className="text-sm font-semibold mb-2">Tren Kehadiran (6 Pertemuan Terakhir)</h4>
                            <div className="flex items-end h-40 space-x-2">
                                {course.attendanceStats.bySessions.map((rate, index) => (
                                    <div key={index} className="flex-1 flex flex-col items-center">
                                        <div
                                            className={`w-full ${rate >= 90 ? "bg-green-500" : rate >= 75 ? "bg-yellow-500" : "bg-red-500"
                                                } rounded-t-sm`}
                                            style={{ height: `${rate}%` }}
                                        ></div>
                                        <span className="text-xs mt-1">{index + 1}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {activeTab === "attendance" && (
                <div className="space-y-5">
                    <Card extra="p-5" data-aos="fade-up">
                        <div className="mb-4 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-navy-700 dark:text-white flex items-center">
                                <MdHistory className="mr-2" /> Riwayat Absensi
                            </h3>

                            <Link to="/lecturer/attendance/attendance-history" className="text-sm text-indigo-600 hover:text-indigo-800">
                                Lihat Semua
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Pertemuan
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
                                    {course.lastSessions.map((session) => (
                                        <tr key={session.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {session.topic}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(session.date)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="w-24 h-2 bg-gray-200 rounded-full mr-3">
                                                        <div
                                                            className={`h-2 rounded-full ${session.attendanceRate >= 90
                                                                ? "bg-green-500"
                                                                : session.attendanceRate >= 75
                                                                    ? "bg-yellow-500"
                                                                    : "bg-red-500"
                                                                }`}
                                                            style={{ width: `${session.attendanceRate}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {session.attendanceRate}%
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                                <button className="text-indigo-600 hover:text-indigo-900">
                                                    Detail
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <Card extra="p-5" data-aos="fade-up">
                            <div className="flex flex-col items-center">
                                <div className="rounded-full bg-indigo-100 p-3 mb-3">
                                    <MdQrCode className="h-8 w-8 text-indigo-600" />
                                </div>
                                <h4 className="text-base font-semibold mb-2">Ambil Absensi QR Code</h4>
                                <p className="text-sm text-gray-500 text-center mb-4">
                                    Gunakan QR Code untuk absensi mahasiswa dengan cepat
                                </p>
                                <button className="py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 w-full">
                                    Mulai Sesi QR Code
                                </button>
                            </div>
                        </Card>

                        <Card extra="p-5" data-aos="fade-up" data-aos-delay="100">
                            <div className="flex flex-col items-center">
                                <div className="rounded-full bg-blue-100 p-3 mb-3">
                                    <MdFace className="h-8 w-8 text-blue-600" />
                                </div>
                                <h4 className="text-base font-semibold mb-2">Face Recognition</h4>
                                <p className="text-sm text-gray-500 text-center mb-4">
                                    Gunakan pengenalan wajah untuk absensi mahasiswa
                                </p>
                                <button className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full">
                                    Mulai Face Recognition
                                </button>
                            </div>
                        </Card>

                        <Card extra="p-5" data-aos="fade-up" data-aos-delay="200">
                            <div className="flex flex-col items-center">
                                <div className="rounded-full bg-green-100 p-3 mb-3">
                                    <MdVerified className="h-8 w-8 text-green-600" />
                                </div>
                                <h4 className="text-base font-semibold mb-2">Absensi Manual</h4>
                                <p className="text-sm text-gray-500 text-center mb-4">
                                    Input absensi mahasiswa secara manual
                                </p>
                                <button className="py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 w-full">
                                    Input Manual
                                </button>
                            </div>
                        </Card>
                    </div>
                </div>
            )}

            {activeTab === "students" && (
                <div className="space-y-5">
                    <Card extra="p-5" data-aos="fade-up">
                        <div className="mb-4 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-navy-700 dark:text-white flex items-center">
                                <MdPeople className="mr-2" /> Daftar Mahasiswa
                            </h3>

                            <div className="flex space-x-2">
                                <button className="py-1.5 px-3 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 text-sm flex items-center">
                                    <MdPersonAdd className="mr-1" /> Tambah
                                </button>
                                <button className="py-1.5 px-3 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 text-sm flex items-center">
                                    <MdDownload className="mr-1" /> Export
                                </button>
                            </div>
                        </div>

                        <div className="mb-4 flex items-center">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    placeholder="Cari mahasiswa..."
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                    <MdSearch className="h-5 w-5 text-gray-400" />
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Mahasiswa
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            NIM
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
                                    {/* This would be populated with actual student data */}
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            Budi Santoso
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            20210001
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-24 h-2 bg-gray-200 rounded-full mr-3">
                                                    <div
                                                        className="h-2 rounded-full bg-green-500"
                                                        style={{ width: "95%" }}
                                                    />
                                                </div>
                                                <span className="text-sm font-medium text-gray-900">
                                                    95%
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                            <button className="text-indigo-600 hover:text-indigo-900 mr-2">
                                                Detail
                                            </button>
                                            <button className="text-red-600 hover:text-red-900">
                                                <MdPersonRemove />
                                            </button>
                                        </td>
                                    </tr>

                                    {/* Add more rows here for other students */}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-4 text-center text-sm text-gray-500">
                            Menampilkan 10 dari 35 mahasiswa
                        </div>
                    </Card>

                    <Card extra="p-5" data-aos="fade-up">
                        <div className="mb-4">
                            <h3 className="text-lg font-bold text-navy-700 dark:text-white flex items-center">
                                <MdWarning className="mr-2 text-red-500" /> Mahasiswa dengan Kehadiran Rendah
                            </h3>
                        </div>

                        <div className="space-y-3 mb-4">
                            {course.studentManagement.lowAttendance.map((student) => (
                                <div key={student.id} className="p-3 border border-red-100 bg-red-50 rounded-lg">
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-medium text-gray-900">{student.name}</span>
                                        <span className="text-xs font-medium px-1.5 py-0.5 rounded-full bg-red-100 text-red-800">
                                            {student.attendanceRate}%
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-500">
                                        <span>{student.nim}</span>
                                        <button className="text-indigo-600 hover:text-indigo-800">
                                            Kirim Notifikasi
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                            <div className="flex items-start">
                                <MdInfo className="text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                                <p className="text-sm text-yellow-700">
                                    Mahasiswa dengan kehadiran di bawah 75% berisiko tidak memenuhi syarat untuk mengikuti ujian.
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default CourseDetails;
