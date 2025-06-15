import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import Card from "components/card";
import {
    MdEventNote,
    MdAdd,
    MdCalendarToday,
    MdPeopleAlt,
    MdPresentToAll,
    MdHistory,
    MdAssessment,
    MdArrowForward,
    MdTimer
} from "react-icons/md";

// Dummy Data
const sessionStats = {
    scheduledToday: 2,
    completedToday: 1,
    upcomingWeek: 6,
    totalSessions: 48,
    completedSessions: 32,
    averageAttendance: 88
};

const upcomingSessions = [
    {
        id: 1,
        course: "Algoritma dan Pemrograman",
        topic: "Algoritma Sorting",
        date: "2023-10-28",
        time: "08:00 - 09:40",
        room: "Lab 301"
    },
    {
        id: 2,
        course: "Basis Data",
        topic: "Normalisasi Database",
        date: "2023-10-28",
        time: "10:00 - 11:40",
        room: "Lab 302"
    },
    {
        id: 3,
        course: "Pemrograman Web",
        topic: "JavaScript Lanjutan",
        date: "2023-10-29",
        time: "13:00 - 14:40",
        room: "Lab 303"
    }
];

const recentSessions = [
    {
        id: 1,
        course: "Kecerdasan Buatan",
        topic: "Neural Networks",
        date: "2023-10-27",
        time: "15:00 - 16:40",
        room: "Lab 304",
        attendanceRate: 91
    },
    {
        id: 2,
        course: "Algoritma dan Pemrograman",
        topic: "Dynamic Programming",
        date: "2023-10-26",
        time: "08:00 - 09:40",
        room: "Lab 301",
        attendanceRate: 85
    }
];

const SessionManagement = () => {
    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: "ease-in-out",
            once: true,
        });
    }, []);

    const formatDate = (dateString) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    return (
        <div className="mt-3">
            <div className="mb-5" data-aos="fade-down">
                <h1 className="text-3xl font-bold text-navy-700 dark:text-white">
                    Manajemen Sesi
                </h1>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Kelola dan jadwalkan sesi perkuliahan
                </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4 mb-5">
                <Card extra="!flex flex-col items-center p-4" data-aos="fade-up" data-aos-delay="100">
                    <div className="rounded-full bg-indigo-100 p-3 mb-2">
                        <MdEventNote className="h-6 w-6 text-indigo-600" />
                    </div>
                    <p className="text-xl font-bold">{sessionStats.scheduledToday}</p>
                    <p className="text-sm text-gray-500">Sesi Hari Ini</p>
                </Card>

                <Card extra="!flex flex-col items-center p-4" data-aos="fade-up" data-aos-delay="200">
                    <div className="rounded-full bg-green-100 p-3 mb-2">
                        <MdTimer className="h-6 w-6 text-green-600" />
                    </div>
                    <p className="text-xl font-bold">{sessionStats.upcomingWeek}</p>
                    <p className="text-sm text-gray-500">Sesi Minggu Ini</p>
                </Card>

                <Card extra="!flex flex-col items-center p-4" data-aos="fade-up" data-aos-delay="300">
                    <div className="rounded-full bg-purple-100 p-3 mb-2">
                        <MdPeopleAlt className="h-6 w-6 text-purple-600" />
                    </div>
                    <p className="text-xl font-bold">{sessionStats.averageAttendance}%</p>
                    <p className="text-sm text-gray-500">Rata-rata Kehadiran</p>
                </Card>

                <Card extra="!flex flex-col items-center p-4" data-aos="fade-up" data-aos-delay="400">
                    <div className="rounded-full bg-blue-100 p-3 mb-2">
                        <MdHistory className="h-6 w-6 text-blue-600" />
                    </div>
                    <p className="text-xl font-bold">{sessionStats.completedSessions}/{sessionStats.totalSessions}</p>
                    <p className="text-sm text-gray-500">Sesi Selesai</p>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
                <Card extra="p-5 lg:col-span-2" data-aos="fade-up">
                    <div className="mb-4 flex items-center justify-between">
                        <h4 className="text-lg font-bold text-navy-700 dark:text-white">
                            Sesi Mendatang
                        </h4>

                        <Link to="/lecturer/sessions/active-sessions" className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center">
                            Lihat Semua <MdArrowForward className="ml-1" />
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {upcomingSessions.map((session) => (
                            <Link key={session.id} to={`/lecturer/sessions/active-sessions?id=${session.id}`}>
                                <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer">
                                    <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                                        <div>
                                            <h5 className="text-base font-medium text-gray-900 mb-1">{session.course}</h5>
                                            <p className="text-sm text-gray-600">{session.topic}</p>
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                <span className="text-xs text-gray-500 flex items-center">
                                                    <MdCalendarToday className="mr-1" /> {formatDate(session.date)}
                                                </span>
                                                <span className="text-xs text-gray-500 flex items-center">
                                                    <MdTimer className="mr-1" /> {session.time}
                                                </span>
                                                <span className="text-xs text-gray-500 flex items-center">
                                                    <MdEventNote className="mr-1" /> {session.room}
                                                </span>
                                            </div>
                                        </div>
                                        <button className="mt-3 md:mt-0 py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-xs md:text-sm">
                                            Kelola Sesi
                                        </button>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {upcomingSessions.length === 0 && (
                        <div className="text-center py-8">
                            <MdEventNote className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                            <h3 className="text-lg text-gray-500 font-medium">Tidak ada sesi mendatang</h3>
                        </div>
                    )}

                    <div className="mt-4 flex justify-center">
                        <button className="py-2 px-4 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors flex items-center">
                            <MdAdd className="mr-2" /> Buat Sesi Baru
                        </button>
                    </div>
                </Card>

                <Card extra="p-5" data-aos="fade-up" data-aos-delay="100">
                    <div className="mb-4 flex items-center justify-between">
                        <h4 className="text-lg font-bold text-navy-700 dark:text-white">
                            Sesi Terakhir
                        </h4>

                        <Link to="/lecturer/sessions/session-history" className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center">
                            Lihat Riwayat <MdArrowForward className="ml-1" />
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {recentSessions.map((session) => (
                            <div key={session.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200">
                                <h5 className="text-base font-medium text-gray-900">{session.course}</h5>
                                <p className="text-sm text-gray-600 mb-2">{session.topic}</p>
                                <div className="flex justify-between mb-2">
                                    <span className="text-xs text-gray-500 flex items-center">
                                        <MdCalendarToday className="mr-1" /> {formatDate(session.date)}
                                    </span>
                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                        {session.attendanceRate}% Kehadiran
                                    </span>
                                </div>
                                <Link
                                    to={`/lecturer/sessions/session-history?id=${session.id}`}
                                    className="text-xs text-indigo-600 hover:text-indigo-800"
                                >
                                    Lihat Detail
                                </Link>
                            </div>
                        ))}
                    </div>

                    {recentSessions.length === 0 && (
                        <div className="text-center py-8">
                            <MdHistory className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                            <h3 className="text-lg text-gray-500 font-medium">Belum ada sesi selesai</h3>
                        </div>
                    )}
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <Link to="/lecturer/sessions/active-sessions" data-aos="fade-up" data-aos-delay="200">
                    <Card extra="p-5 cursor-pointer hover:border-indigo-200 hover:shadow-md transition-all duration-200 h-full">
                        <div className="flex flex-col items-center text-center">
                            <div className="rounded-full bg-indigo-100 p-3 mb-3">
                                <MdPresentToAll className="h-8 w-8 text-indigo-600" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Sesi Aktif</h3>
                            <p className="text-sm text-gray-600">
                                Kelola sesi kuliah yang sedang berlangsung atau akan datang
                            </p>
                        </div>
                    </Card>
                </Link>

                <Link to="/lecturer/sessions/session-history" data-aos="fade-up" data-aos-delay="300">
                    <Card extra="p-5 cursor-pointer hover:border-indigo-200 hover:shadow-md transition-all duration-200 h-full">
                        <div className="flex flex-col items-center text-center">
                            <div className="rounded-full bg-blue-100 p-3 mb-3">
                                <MdAssessment className="h-8 w-8 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Riwayat & Laporan</h3>
                            <p className="text-sm text-gray-600">
                                Lihat riwayat sesi dan analisis data kehadiran
                            </p>
                        </div>
                    </Card>
                </Link>
            </div>
        </div>
    );
};

export default SessionManagement;
