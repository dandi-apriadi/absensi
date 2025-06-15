import React, { useEffect, useState } from "react";
import { MdAutoGraph, MdCalendarToday, MdDownload, MdArrowDropDown, MdCompare, MdFilterList, MdInsights } from "react-icons/md";
import AOS from "aos";
import "aos/dist/aos.css";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const AttendanceTrends = () => {
    const [timeRange, setTimeRange] = useState("semester");
    const [selectedProgram, setSelectedProgram] = useState("all");
    const [selectedYear, setSelectedYear] = useState("all");
    const [comparisonMode, setComparisonMode] = useState(false);

    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
        });
    }, []);

    // Monthly attendance data (dummy)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const attendanceData = [88.5, 85.2, 89.0, 90.5, 88.7, 82.3, 78.5, 89.2, 92.1, 93.5, 91.2, 87.8];
    const lastYearData = [84.2, 83.1, 86.5, 87.0, 85.2, 80.5, 76.0, 86.5, 89.3, 90.1, 88.4, 84.7];

    // Trend statistics (dummy)
    const trendStats = [
        {
            label: "Rata-rata Kehadiran",
            value: "87.8%",
            change: "+2.1%",
            isPositive: true
        },
        {
            label: "Tingkat Keterlambatan",
            value: "8.3%",
            change: "-1.5%",
            isPositive: true
        },
        {
            label: "Konsistensi Kehadiran",
            value: "92.4%",
            change: "+4.2%",
            isPositive: true
        },
        {
            label: "Absensi Terverifikasi",
            value: "99.7%",
            change: "+0.4%",
            isPositive: true
        }
    ];

    // Chart data for monthly trends
    const trendChartData = {
        labels: months,
        datasets: [
            {
                label: "Kehadiran Tahun Ini",
                data: attendanceData,
                borderColor: "rgba(59, 130, 246, 1)",
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                tension: 0.4,
                fill: true,
                pointRadius: 3,
                pointHoverRadius: 6,
            },
            ...(comparisonMode ? [{
                label: "Kehadiran Tahun Lalu",
                data: lastYearData,
                borderColor: "rgba(107, 114, 128, 1)",
                backgroundColor: "rgba(0, 0, 0, 0)",
                borderDash: [5, 5],
                tension: 0.4,
                pointRadius: 2,
                pointHoverRadius: 4,
            }] : [])
        ],
    };

    const trendChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    boxWidth: 10,
                    usePointStyle: true,
                },
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += context.parsed.y + '%';
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            y: {
                min: 70,
                max: 100,
                grid: {
                    color: "rgba(0, 0, 0, 0.05)",
                },
                ticks: {
                    callback: function (value) {
                        return value + '%';
                    }
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        },
    };

    // Dummy trend insights data
    const trendInsights = [
        {
            title: "Peningkatan Kehadiran di Akhir Semester",
            description: "Terjadi peningkatan kehadiran sebesar 5.3% pada akhir semester dibanding awal semester.",
            type: "positive"
        },
        {
            title: "Drop Kehadiran di Juli",
            description: "Tingkat kehadiran turun signifikan di bulan Juli, bertepatan dengan periode ujian akhir dan libur.",
            type: "negative"
        },
        {
            title: "Konsistensi Tinggi di Program Teknik Informatika",
            description: "Program Teknik Informatika mempertahankan kehadiran di atas 90% sepanjang 5 bulan terakhir.",
            type: "positive"
        },
        {
            title: "Pola Keterlambatan Meningkat di Jam Pagi",
            description: "Terjadi peningkatan 8% keterlambatan pada kelas pagi (08:00) dibanding semester sebelumnya.",
            type: "warning"
        }
    ];

    return (
        <div className="p-4 md:p-8">
            <div className="mb-8" data-aos="fade-down">
                <h1 className="text-3xl font-bold text-gray-800">Tren Kehadiran</h1>
                <p className="text-gray-600">Analisis tren dan pola kehadiran mahasiswa dari waktu ke waktu</p>
            </div>

            {/* Controls */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8" data-aos="fade-up">
                <div className="flex flex-wrap items-center gap-4">
                    <div>
                        <label htmlFor="timeRange" className="block text-sm font-medium text-gray-700 mb-1">Rentang Waktu</label>
                        <div className="relative">
                            <MdCalendarToday className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <select
                                id="timeRange"
                                className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                                value={timeRange}
                                onChange={(e) => setTimeRange(e.target.value)}
                            >
                                <option value="semester">1 Semester Terakhir</option>
                                <option value="year">1 Tahun Terakhir</option>
                                <option value="custom">Custom Range</option>
                            </select>
                            <MdArrowDropDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="program" className="block text-sm font-medium text-gray-700 mb-1">Program Studi</label>
                        <div className="relative">
                            <MdFilterList className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <select
                                id="program"
                                className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                                value={selectedProgram}
                                onChange={(e) => setSelectedProgram(e.target.value)}
                            >
                                <option value="all">Semua Program</option>
                                <option value="informatics">Teknik Informatika</option>
                                <option value="is">Sistem Informasi</option>
                                <option value="cs">Ilmu Komputer</option>
                            </select>
                            <MdArrowDropDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">Angkatan</label>
                        <div className="relative">
                            <MdFilterList className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <select
                                id="year"
                                className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                            >
                                <option value="all">Semua Angkatan</option>
                                <option value="2024">2024</option>
                                <option value="2023">2023</option>
                                <option value="2022">2022</option>
                                <option value="2021">2021</option>
                            </select>
                            <MdArrowDropDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>

                    <div className="flex-grow"></div>

                    <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="comparison"
                                checked={comparisonMode}
                                onChange={() => setComparisonMode(!comparisonMode)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="comparison" className="ml-2 text-sm text-gray-700">
                                Compare with previous period
                            </label>
                        </div>

                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors">
                            <MdDownload className="mr-2" /> Export Data
                        </button>
                    </div>
                </div>
            </div>

            {/* Trend Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {trendStats.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-xl shadow-md p-6"
                        data-aos="fade-up"
                        data-aos-delay={index * 100}
                    >
                        <div className="flex justify-between items-start">
                            <h3 className="text-sm font-medium text-gray-500">{stat.label}</h3>
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${stat.isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                {stat.change}
                            </span>
                        </div>
                        <p className="mt-4 text-2xl font-bold text-gray-800">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Main Trend Chart */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8" data-aos="fade-up" data-aos-delay="200">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Tren Kehadiran Bulanan</h3>
                    <div className="flex items-center">
                        <MdAutoGraph className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-500">{comparisonMode ? 'Menampilkan perbandingan dengan periode sebelumnya' : 'Showing current period only'}</span>
                    </div>
                </div>
                <div className="h-96">
                    <Line data={trendChartData} options={trendChartOptions} />
                </div>
            </div>

            {/* Trend Insights */}
            <div className="mb-8" data-aos="fade-up" data-aos-delay="300">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <MdInsights className="mr-2 h-5 w-5 text-blue-600" /> Insight Tren
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {trendInsights.map((insight, index) => (
                        <div
                            key={index}
                            className={`p-5 rounded-xl border-l-4 ${insight.type === 'positive' ? 'border-green-500 bg-green-50' :
                                    insight.type === 'negative' ? 'border-red-500 bg-red-50' :
                                        'border-yellow-500 bg-yellow-50'
                                }`}
                        >
                            <h4 className={`font-medium mb-2 ${insight.type === 'positive' ? 'text-green-800' :
                                    insight.type === 'negative' ? 'text-red-800' :
                                        'text-yellow-800'
                                }`}>
                                {insight.title}
                            </h4>
                            <p className={`text-sm ${insight.type === 'positive' ? 'text-green-700' :
                                    insight.type === 'negative' ? 'text-red-700' :
                                        'text-yellow-700'
                                }`}>
                                {insight.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Further Analysis */}
            <div className="bg-white rounded-xl shadow-md p-6" data-aos="fade-up" data-aos-delay="400">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Analisis Lanjutan</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                        <h4 className="font-medium text-gray-800 mb-2">Analisis Berdasarkan Hari</h4>
                        <p className="text-sm text-gray-600">Lihat pola kehadiran berdasarkan hari dalam seminggu untuk identifikasi tren.</p>
                        <button className="mt-3 text-blue-600 text-sm font-medium">Lihat Analisis</button>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                        <h4 className="font-medium text-gray-800 mb-2">Analisis Per Mata Kuliah</h4>
                        <p className="text-sm text-gray-600">Bandingkan kehadiran di berbagai mata kuliah untuk identifikasi pola.</p>
                        <button className="mt-3 text-blue-600 text-sm font-medium">Lihat Analisis</button>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                        <h4 className="font-medium text-gray-800 mb-2">Korelasi Performa Akademik</h4>
                        <p className="text-sm text-gray-600">Lihat hubungan kehadiran dengan performa akademik mahasiswa.</p>
                        <button className="mt-3 text-blue-600 text-sm font-medium">Lihat Analisis</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttendanceTrends;
