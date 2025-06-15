import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import Card from "components/card";
import {
    MdPeople,
    MdClass,
    MdAssessment,
    MdArrowForward,
    MdWarning,
    MdAccessTime,
} from "react-icons/md";

// Dummy Data
const courses = [
    { id: 1, name: "Algoritma dan Pemrograman", totalStudents: 35, attendanceRate: 89 },
    { id: 2, name: "Basis Data", totalStudents: 42, attendanceRate: 93 },
    { id: 3, name: "Pemrograman Web", totalStudents: 28, attendanceRate: 78 },
    { id: 4, name: "Kecerdasan Buatan", totalStudents: 32, attendanceRate: 85 },
];

const upcomingClasses = [
    { id: 1, course: "Algoritma dan Pemrograman", time: "08:00 - 09:40", room: "Lab 301", day: "Senin" },
    { id: 2, course: "Basis Data", time: "10:00 - 11:40", room: "Lab 302", day: "Selasa" },
    { id: 3, course: "Pemrograman Web", time: "13:00 - 14:40", room: "Lab 303", day: "Rabu" },
];

const LecturerDashboard = () => {
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
                    Dashboard Dosen
                </h1>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Selamat datang kembali, Dr. Ahmad Saputra
                </p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-5">
                <Card data-aos="zoom-in" data-aos-delay="100" extra="!flex flex-col items-center p-5">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                        <MdPeople className="h-8 w-8 text-blue-500" />
                    </div>
                    <p className="mt-4 text-xl font-bold text-navy-700 dark:text-white">137</p>
                    <p className="mt-1 text-sm text-gray-600">Total Mahasiswa</p>
                </Card>

                <Card data-aos="zoom-in" data-aos-delay="200" extra="!flex flex-col items-center p-5">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                        <MdClass className="h-8 w-8 text-green-500" />
                    </div>
                    <p className="mt-4 text-xl font-bold text-navy-700 dark:text-white">4</p>
                    <p className="mt-1 text-sm text-gray-600">Mata Kuliah Aktif</p>
                </Card>

                <Card data-aos="zoom-in" data-aos-delay="300" extra="!flex flex-col items-center p-5">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                        <MdAccessTime className="h-8 w-8 text-purple-500" />
                    </div>
                    <p className="mt-4 text-xl font-bold text-navy-700 dark:text-white">12</p>
                    <p className="mt-1 text-sm text-gray-600">Sesi Minggu Ini</p>
                </Card>

                <Card data-aos="zoom-in" data-aos-delay="400" extra="!flex flex-col items-center p-5">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                        <MdWarning className="h-8 w-8 text-red-500" />
                    </div>
                    <p className="mt-4 text-xl font-bold text-navy-700 dark:text-white">8</p>
                    <p className="mt-1 text-sm text-gray-600">Permintaan Izin</p>
                </Card>
            </div>

            {/* Course Overview */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 mb-5">
                <Card data-aos="fade-up" extra="w-full p-4">
                    <div className="mb-4 flex items-center justify-between">
                        <h4 className="text-lg font-bold text-navy-700 dark:text-white">
                            Mata Kuliah
                        </h4>
                        <Link to="/lecturer/courses" className="flex items-center text-sm text-blue-500 hover:text-blue-700">
                            Lihat Semua <MdArrowForward className="ml-1" />
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="py-3 px-2 text-left text-sm font-semibold text-gray-600">Mata Kuliah</th>
                                    <th className="py-3 px-2 text-left text-sm font-semibold text-gray-600">Mahasiswa</th>
                                    <th className="py-3 px-2 text-left text-sm font-semibold text-gray-600">Kehadiran</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courses.map((course) => (
                                    <tr key={course.id} className="border-b border-gray-200">
                                        <td className="py-3 px-2 text-sm font-medium text-navy-700 dark:text-white">
                                            {course.name}
                                        </td>
                                        <td className="py-3 px-2 text-sm font-medium text-gray-600">
                                            {course.totalStudents} mahasiswa
                                        </td>
                                        <td className="py-3 px-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-navy-700">
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
                                                <span className="text-sm font-medium text-gray-600">
                                                    {course.attendanceRate}%
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                <Card data-aos="fade-up" data-aos-delay="200" extra="w-full p-4">
                    <div className="mb-4 flex items-center justify-between">
                        <h4 className="text-lg font-bold text-navy-700 dark:text-white">
                            Jadwal Perkuliahan
                        </h4>
                        <Link to="/lecturer/sessions" className="flex items-center text-sm text-blue-500 hover:text-blue-700">
                            Lihat Semua <MdArrowForward className="ml-1" />
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {upcomingClasses.map((session) => (
                            <div key={session.id} className="flex items-start p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition duration-150">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                                    <p className="text-sm font-bold text-indigo-600">{session.day.substring(0, 2)}</p>
                                </div>
                                <div className="ml-4">
                                    <h5 className="text-base font-semibold text-navy-700 dark:text-white">
                                        {session.course}
                                    </h5>
                                    <div className="flex flex-wrap items-center gap-3 mt-1">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <MdAccessTime className="mr-1" />
                                            {session.time}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {session.room}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default LecturerDashboard;
