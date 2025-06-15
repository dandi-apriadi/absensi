import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import Card from "components/card";
import {
    MdQrCode,
    MdFace,
    MdHistory,
    MdEdit,
    MdFileDownload,
    MdNotifications,
    MdPeople,
    MdVerified
} from "react-icons/md";

// Dummy Data
const coursesStats = [
    {
        id: 1,
        name: "Algoritma dan Pemrograman",
        totalStudents: 35,
        attendanceRate: 92,
        lastSession: "2023-10-15"
    },
    {
        id: 2,
        name: "Basis Data",
        totalStudents: 42,
        attendanceRate: 89,
        lastSession: "2023-10-16"
    },
    {
        id: 3,
        name: "Pemrograman Web",
        totalStudents: 28,
        attendanceRate: 85,
        lastSession: "2023-10-17"
    },
    {
        id: 4,
        name: "Kecerdasan Buatan",
        totalStudents: 32,
        attendanceRate: 88,
        lastSession: "2023-10-18"
    }
];

const AttendanceManagement = () => {
    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: "ease-in-out",
            once: true,
        });
    }, []);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    return (
        <div className="mt-3">
            <div className="mb-5" data-aos="fade-down">
                <h1 className="text-3xl font-bold text-navy-700 dark:text-white">
                    Manajemen Absensi
                </h1>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Kelola absensi mahasiswa untuk semua mata kuliah Anda
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-5">
                <Link to="/lecturer/attendance/take-attendance" data-aos="fade-up" data-aos-delay="100">
                    <Card extra="p-4 cursor-pointer hover:border-indigo-200 hover:shadow-md transition-all duration-200 h-full">
                        <div className="flex flex-col items-center text-center">
                            <div className="rounded-full bg-indigo-100 p-3 mb-3">
                                <MdQrCode className="h-8 w-8 text-indigo-600" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Ambil Absensi</h3>
                            <p className="text-sm text-gray-600">
                                Ambil absensi kehadiran mahasiswa melalui QR Code atau Face Recognition
                            </p>
                        </div>
                    </Card>
                </Link>

                <Link to="/lecturer/attendance/attendance-history" data-aos="fade-up" data-aos-delay="200">
                    <Card extra="p-4 cursor-pointer hover:border-indigo-200 hover:shadow-md transition-all duration-200 h-full">
                        <div className="flex flex-col items-center text-center">
                            <div className="rounded-full bg-green-100 p-3 mb-3">
                                <MdHistory className="h-8 w-8 text-green-600" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Riwayat Absensi</h3>
                            <p className="text-sm text-gray-600">
                                Lihat dan kelola riwayat absensi dari semua sesi perkuliahan
                            </p>
                        </div>
                    </Card>
                </Link>

                <Link to="/lecturer/attendance/manual-attendance" data-aos="fade-up" data-aos-delay="300">
                    <Card extra="p-4 cursor-pointer hover:border-indigo-200 hover:shadow-md transition-all duration-200 h-full">
                        <div className="flex flex-col items-center text-center">
                            <div className="rounded-full bg-blue-100 p-3 mb-3">
                                <MdEdit className="h-8 w-8 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Absensi Manual</h3>
                            <p className="text-sm text-gray-600">
                                Input atau edit data kehadiran mahasiswa secara manual
                            </p>
                        </div>
                    </Card>
                </Link>

                <Link to="/lecturer/attendance/export-attendance" data-aos="fade-up" data-aos-delay="400">
                    <Card extra="p-4 cursor-pointer hover:border-indigo-200 hover:shadow-md transition-all duration-200 h-full">
                        <div className="flex flex-col items-center text-center">
                            <div className="rounded-full bg-purple-100 p-3 mb-3">
                                <MdFileDownload className="h-8 w-8 text-purple-600" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Export Data</h3>
                            <p className="text-sm text-gray-600">
                                Download laporan absensi dalam berbagai format
                            </p>
                        </div>
                    </Card>
                </Link>
            </div>

            <Card extra="p-5 mb-5" data-aos="fade-up" data-aos-delay="500">
                <div className="mb-4 flex items-center justify-between">
                    <h4 className="text-lg font-bold text-navy-700 dark:text-white flex items-center">
                        <MdNotifications className="mr-2 h-5 w-5" /> Perhatian Khusus
                    </h4>
                </div>

                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100 mb-4">
                    <p className="text-sm text-yellow-800">
                        Terdapat 5 mahasiswa dengan tingkat kehadiran di bawah 75% yang memerlukan perhatian khusus.
                    </p>
                    <Link to="/lecturer/students/attendance-stats" className="text-sm text-indigo-600 hover:text-indigo-800 mt-2 inline-block">
                        Lihat Detail →
                    </Link>
                </div>
            </Card>

            <Card extra="p-5" data-aos="fade-up" data-aos-delay="600">
                <div className="mb-4 flex items-center justify-between">
                    <h4 className="text-lg font-bold text-navy-700 dark:text-white flex items-center">
                        <MdPeople className="mr-2 h-5 w-5" /> Statistik Absensi Per Mata Kuliah
                    </h4>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500">Mata Kuliah</th>
                                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500">Mahasiswa</th>
                                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500">Tingkat Kehadiran</th>
                                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500">Sesi Terakhir</th>
                                <th className="py-3 px-4 text-right text-xs font-semibold text-gray-500">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {coursesStats.map((course) => (
                                <tr key={course.id} className="border-b border-gray-200">
                                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{course.name}</td>
                                    <td className="py-3 px-4 text-sm text-gray-500">{course.totalStudents} mahasiswa</td>
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
                                    <td className="py-3 px-4 text-sm text-gray-500">{formatDate(course.lastSession)}</td>
                                    <td className="py-3 px-4 text-right">
                                        <Link
                                            to={`/lecturer/attendance/take-attendance?course=${course.id}`}
                                            className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                                        >
                                            Ambil Absensi
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default AttendanceManagement;
