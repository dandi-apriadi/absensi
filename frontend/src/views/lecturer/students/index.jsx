import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import Card from "components/card";
import {
    MdGroups,
    MdPerson,
    MdBarChart,
    MdWarning,
    MdNotifications,
    MdTrendingUp,
    MdDownload,
    MdCheckCircle,
    MdCancel,
    MdArrowForward
} from "react-icons/md";

// Dummy Data
const totalStats = {
    totalStudents: 137,
    activeStudents: 134,
    inactiveStudents: 3,
    highAttendance: 98,
    mediumAttendance: 32,
    lowAttendance: 7
};

const courseStats = [
    {
        id: 1,
        course: "Algoritma dan Pemrograman",
        students: 35,
        attendanceRate: 92,
        lowAttendanceCount: 2
    },
    {
        id: 2,
        course: "Basis Data",
        students: 42,
        attendanceRate: 89,
        lowAttendanceCount: 3
    },
    {
        id: 3,
        course: "Pemrograman Web",
        students: 28,
        attendanceRate: 85,
        lowAttendanceCount: 4
    },
    {
        id: 4,
        course: "Kecerdasan Buatan",
        students: 32,
        attendanceRate: 88,
        lowAttendanceCount: 2
    },
];

const studentsWithLowAttendance = [
    { id: 1, nim: "20210003", name: "Ahmad Rizki", attendanceRate: 72, course: "Pemrograman Web", status: "kritis" },
    { id: 2, nim: "20210007", name: "Dimas Pratama", attendanceRate: 74, course: "Algoritma dan Pemrograman", status: "kritis" },
    { id: 3, nim: "20210005", name: "Farhan Abdullah", attendanceRate: 78, course: "Basis Data", status: "perhatian" },
    { id: 4, nim: "20210002", name: "Siti Nuraini", attendanceRate: 82, course: "Kecerdasan Buatan", status: "perhatian" },
];

const StudentPerformance = () => {
    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: "ease-in-out",
            once: true,
        });
    }, []);

    return (
        <div className="mt-3">
            <div className="mb-5" data-aos="fade-down">
                <h1 className="text-3xl font-bold text-navy-700 dark:text-white">
                    Performa Mahasiswa
                </h1>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Overview performa kehadiran mahasiswa di semua mata kuliah
                </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 mb-5">
                <Card extra="!flex flex-col items-center p-5" data-aos="fade-up" data-aos-delay="100">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                        <MdGroups className="h-8 w-8 text-green-500" />
                    </div>
                    <p className="mt-4 text-xl font-bold text-navy-700 dark:text-white">{totalStats.totalStudents}</p>
                    <p className="mt-1 text-sm text-gray-600">Total Mahasiswa</p>
                    <div className="mt-3 flex space-x-2 text-xs">
                        <div className="flex items-center text-green-600">
                            <MdCheckCircle className="mr-1" />
                            <span>{totalStats.activeStudents} Aktif</span>
                        </div>
                        <div className="flex items-center text-red-600">
                            <MdCancel className="mr-1" />
                            <span>{totalStats.inactiveStudents} Tidak Aktif</span>
                        </div>
                    </div>
                </Card>

                <Card extra="!flex flex-col p-5" data-aos="fade-up" data-aos-delay="200">
                    <div className="mb-3 flex justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                            <MdBarChart className="h-6 w-6 text-indigo-500" />
                        </div>
                        <span className="flex items-center text-sm font-medium text-green-600">
                            <MdTrendingUp className="mr-1" />
                            88.5% Rata-rata
                        </span>
                    </div>
                    <h5 className="text-base font-medium text-navy-700 dark:text-white">Statistik Kehadiran</h5>
                    <div className="mt-3 flex flex-wrap gap-2">
                        <div className="rounded-lg bg-green-100 px-2 py-1 text-xs text-green-800">
                            {totalStats.highAttendance} Tinggi (85%)
                        </div>
                        <div className="rounded-lg bg-yellow-100 px-2 py-1 text-xs text-yellow-800">
                            {totalStats.mediumAttendance} Sedang (75-85%)
                        </div>
                        <div className="rounded-lg bg-red-100 px-2 py-1 text-xs text-red-800">
                            {totalStats.lowAttendance} Rendah (75%)
                        </div>
                    </div>
                </Card>

                <Card extra="!flex flex-col p-5" data-aos="fade-up" data-aos-delay="300">
                    <div className="mb-3 flex justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                            <MdWarning className="h-6 w-6 text-red-500" />
                        </div>
                        <Link
                            to="/lecturer/students/attendance-stats"
                            className="flex items-center text-sm text-indigo-600 hover:text-indigo-800"
                        >
                            Lihat Detail
                        </Link>
                    </div>
                    <h5 className="text-base font-medium text-navy-700 dark:text-white mb-1">Perhatian Khusus</h5>
                    <p className="text-xs text-gray-600 mb-3">Mahasiswa dengan tingkat kehadiran rendah</p>
                    <div className="flex items-center justify-between py-2 px-3 bg-red-50 rounded-lg">
                        <span className="text-sm font-medium text-red-800">{totalStats.lowAttendance} mahasiswa</span>
                        <span className="text-xs text-gray-500">Perlu tindak lanjut</span>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
                <Card extra="p-5 lg:col-span-2" data-aos="fade-up" data-aos-delay="400">
                    <div className="mb-4 flex items-center justify-between">
                        <h4 className="text-lg font-bold text-navy-700 dark:text-white flex items-center">
                            <MdGroups className="mr-2 h-5 w-5" /> Statistik Per Mata Kuliah
                        </h4>
                        <button className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center" onClick={() => alert('Fitur Export belum tersedia')}>
                            <MdDownload className="mr-1" /> Export
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500">Mata Kuliah</th>
                                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500">Jumlah</th>
                                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500">Kehadiran</th>
                                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courseStats.map((course) => (
                                    <tr key={course.id} className="border-b border-gray-200">
                                        <td className="py-3 px-4 text-sm font-medium text-gray-900">{course.course}</td>
                                        <td className="py-3 px-4 text-sm text-gray-500">{course.students} mahasiswa</td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center">
                                                <div className="w-36 h-2 bg-gray-200 rounded-full mr-3">
                                                    <div
                                                        className={`h-2 rounded-full ${course.attendanceRate >= 90
                                                            ? "bg-green-500"
                                                            : course.attendanceRate >= 80
                                                                ? "bg-yellow-500"
                                                                : "bg-red-500"
                                                            }`}
                                                        style={{ width: `${course.attendanceRate}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm font-medium text-gray-900">
                                                    {course.attendanceRate}%
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            {course.lowAttendanceCount > 0 ? (
                                                <div className="flex items-center text-red-600 text-xs font-medium">
                                                    <MdWarning className="mr-1" />
                                                    {course.lowAttendanceCount} mahasiswa perlu perhatian
                                                </div>
                                            ) : (
                                                <div className="flex items-center text-green-600 text-xs font-medium">
                                                    <MdCheckCircle className="mr-1" />
                                                    Semua mahasiswa baik
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                <Card extra="p-5" data-aos="fade-up" data-aos-delay="500">
                    <div className="mb-4 flex items-center justify-between">
                        <h4 className="text-lg font-bold text-navy-700 dark:text-white flex items-center">
                            <MdWarning className="mr-2 h-5 w-5 text-red-500" /> Kehadiran Rendah
                        </h4>
                        <Link
                            to="/lecturer/students/attendance-stats"
                            className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
                        >
                            Semua <MdArrowForward className="ml-1" />
                        </Link>
                    </div>

                    <div className="space-y-3">
                        {studentsWithLowAttendance.map((student) => (
                            <div key={student.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200">
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm font-medium text-gray-900">{student.name}</span>
                                    <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${student.status === "kritis"
                                        ? "bg-red-100 text-red-800"
                                        : "bg-yellow-100 text-yellow-800"
                                        }`}>
                                        {student.attendanceRate}%
                                    </span>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>{student.nim}</span>
                                    <span>{student.course}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4">
                        <button
                            className="w-full py-2 px-4 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors flex items-center justify-center"
                            onClick={() => alert('Fitur notifikasi belum tersedia')}
                        >
                            <MdNotifications className="mr-2" />
                            Kirim Notifikasi
                        </button>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <Link to="/lecturer/students/students-list" data-aos="fade-up" data-aos-delay="600">
                    <Card extra="p-5 cursor-pointer hover:border-indigo-200 hover:shadow-md transition-all duration-200 h-full">
                        <div className="flex flex-col items-center text-center">
                            <div className="rounded-full bg-indigo-100 p-3 mb-3">
                                <MdPerson className="h-8 w-8 text-indigo-600" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Daftar Mahasiswa</h3>
                            <p className="text-sm text-gray-600">
                                Lihat daftar lengkap semua mahasiswa di mata kuliah Anda
                            </p>
                        </div>
                    </Card>
                </Link>

                <Link to="/lecturer/students/attendance-stats" data-aos="fade-up" data-aos-delay="700">
                    <Card extra="p-5 cursor-pointer hover:border-indigo-200 hover:shadow-md transition-all duration-200 h-full">
                        <div className="flex flex-col items-center text-center">
                            <div className="rounded-full bg-blue-100 p-3 mb-3">
                                <MdTrendingUp className="h-8 w-8 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Statistik Kehadiran</h3>
                            <p className="text-sm text-gray-600">
                                Analisis mendalam tentang pola kehadiran mahasiswa
                            </p>
                        </div>
                    </Card>
                </Link>
            </div>
        </div>
    );
};

export default StudentPerformance;
