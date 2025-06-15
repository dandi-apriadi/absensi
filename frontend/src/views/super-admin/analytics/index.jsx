import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdAnalytics, MdCalendarToday, MdGroup, MdAccessTime, MdDownload, MdArrowDropDown, MdBarChart, MdAutoGraph, MdPieChart, MdGroups, MdStar } from "react-icons/md";
import AOS from "aos";
import "aos/dist/aos.css";
import DailyAttendanceChart from "./components/DailyAttendanceChart";
import AttendanceByProgramChart from "./components/AttendanceByProgramChart";
import AttendanceHeatmapChart from "./components/AttendanceHeatmapChart";
import TopPerformingStudentsChart from "./components/TopPerformingStudentsChart";

const AnalyticsDashboard = () => {
    const [dailyAttendanceData, setDailyAttendanceData] = useState([]);
    const [attendanceByProgramData, setAttendanceByProgramData] = useState([]);
    const [attendanceHeatmapData, setAttendanceHeatmapData] = useState([]);
    const [topPerformingStudentsData, setTopPerformingStudentsData] = useState([]);

    useEffect(() => {
        AOS.init();
        // Fetch data for charts
        fetchDailyAttendanceData();
        fetchAttendanceByProgramData();
        fetchAttendanceHeatmapData();
        fetchTopPerformingStudentsData();
    }, []);

    const fetchDailyAttendanceData = async () => {
        // Fetch daily attendance data from API
        const response = await fetch("/api/attendance/daily");
        const data = await response.json();
        setDailyAttendanceData(data);
    };

    const fetchAttendanceByProgramData = async () => {
        // Fetch attendance by program data from API
        const response = await fetch("/api/attendance/by-program");
        const data = await response.json();
        setAttendanceByProgramData(data);
    };

    const fetchAttendanceHeatmapData = async () => {
        // Fetch attendance heatmap data from API
        const response = await fetch("/api/attendance/heatmap");
        const data = await response.json();
        setAttendanceHeatmapData(data);
    };

    const fetchTopPerformingStudentsData = async () => {
        // Fetch top performing students data from API
        const response = await fetch("/api/students/top-performing");
        const data = await response.json();
        setTopPerformingStudentsData(data);
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Analitik</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Daily Attendance Chart */}
                <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100" data-aos="fade-up">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Kehadiran Harian</h2>
                    <DailyAttendanceChart data={dailyAttendanceData} />
                </div>

                {/* Attendance by Program Chart */}
                <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100" data-aos="fade-up" data-aos-delay="200">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Kehadiran Berdasarkan Program Studi</h2>
                    <AttendanceByProgramChart data={attendanceByProgramData} />
                </div>

                {/* Attendance Heatmap Chart */}
                <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100" data-aos="fade-up" data-aos-delay="400">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Heatmap Kehadiran</h2>
                    <AttendanceHeatmapChart data={attendanceHeatmapData} />
                </div>

                {/* Top Performing Students Chart */}
                <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100" data-aos="fade-up" data-aos-delay="600">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Mahasiswa Berprestasi</h2>
                    <TopPerformingStudentsChart data={topPerformingStudentsData} />
                </div>
            </div>

            {/* Quick Links */}
            <div className="mt-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Tautan Cepat</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link to="/super-admin/analytics/daily-attendance" className="block">
                        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
                            <div className="bg-blue-100 p-4 rounded-full w-16 h-16 flex justify-center items-center mb-4">
                                <MdCalendarToday className="h-8 w-8 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Kehadiran Harian</h3>
                            <p className="text-gray-600">
                                Lihat dan analisis data kehadiran harian mahasiswa.
                            </p>
                        </div>
                    </Link>

                    <Link to="/super-admin/analytics/attendance-by-program" className="block">
                        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
                            <div className="bg-green-100 p-4 rounded-full w-16 h-16 flex justify-center items-center mb-4">
                                <MdGroup className="h-8 w-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Kehadiran Berdasarkan Program Studi</h3>
                            <p className="text-gray-600">
                                Analisis kehadiran berdasarkan program studi mahasiswa.
                            </p>
                        </div>
                    </Link>

                    <Link to="/super-admin/analytics/attendance-heatmap" className="block">
                        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
                            <div className="bg-red-100 p-4 rounded-full w-16 h-16 flex justify-center items-center mb-4">
                                <MdAccessTime className="h-8 w-8 text-red-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Heatmap Kehadiran</h3>
                            <p className="text-gray-600">
                                Lihat pola kehadiran mahasiswa dalam bentuk heatmap.
                            </p>
                        </div>
                    </Link>

                    <Link to="/super-admin/analytics/top-performing-students" className="block">
                        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
                            <div className="bg-purple-100 p-4 rounded-full w-16 h-16 flex justify-center items-center mb-4">
                                <MdStar className="h-8 w-8 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Mahasiswa Berprestasi</h3>
                            <p className="text-gray-600">
                                Identifikasi mahasiswa dengan performa kehadiran terbaik.
                            </p>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Info Cards */}
            <div className="bg-white rounded-xl shadow-md p-6 mt-8" data-aos="fade-up" data-aos-delay="700">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Informasi Analitik</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Tren yang Teridentifikasi</h3>
                        <ul className="space-y-2">
                            <li className="flex items-start">
                                <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-green-100 text-green-600 mr-2 mt-0.5 flex-shrink-0">↑</span>
                                <p className="text-sm text-gray-600">Kehadiran mahasiswa meningkat 3.2% dibandingkan periode sebelumnya</p>
                            </li>
                            <li className="flex items-start">
                                <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-red-100 text-red-600 mr-2 mt-0.5 flex-shrink-0">↓</span>
                                <p className="text-sm text-gray-600">Keterlambatan pada kelas pagi menurun 4.5% setelah implementasi absensi facial</p>
                            </li>
                            <li className="flex items-start">
                                <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 text-blue-600 mr-2 mt-0.5 flex-shrink-0">→</span>
                                <p className="text-sm text-gray-600">Program Teknik Informatika memiliki rata-rata kehadiran tertinggi (92%)</p>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Rekomendasi</h3>
                        <ul className="space-y-2">
                            <li className="flex items-start">
                                <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-purple-100 text-purple-600 mr-2 mt-0.5 flex-shrink-0">!</span>
                                <p className="text-sm text-gray-600">Pertimbangkan pembaruan dataset wajah untuk 32 mahasiswa dengan tingkat error tinggi</p>
                            </li>
                            <li className="flex items-start">
                                <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-purple-100 text-purple-600 mr-2 mt-0.5 flex-shrink-0">!</span>
                                <p className="text-sm text-gray-600">Tinjau jadwal kelas program Sistem Informasi untuk mengurangi keterlambatan</p>
                            </li>
                            <li className="flex items-start">
                                <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-purple-100 text-purple-600 mr-2 mt-0.5 flex-shrink-0">!</span>
                                <p className="text-sm text-gray-600">Kelompok mahasiswa angkatan 2023 membutuhkan perhatian khusus (kehadiran 78%)</p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;