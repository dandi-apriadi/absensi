import React, { useEffect, useState } from "react";
import {
    MdAutoGraph,
    MdCalendarToday,
    MdDownload,
    MdArrowDropDown,
    MdCompare,
    MdFilterList,
    MdInsights,
    MdTrendingUp,
    MdTrendingDown,
    MdShowChart,
    MdAnalytics,
    MdAccessTime,
    MdSchool,
    MdWarning,
    MdCheckCircle,
    MdInfo,
    MdRefresh,
    MdFileDownload,
    MdTimeline,
    MdBarChart,
    MdSpeed,
    MdVisibility
} from "react-icons/md";
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
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        AOS.init({
            duration: 1000,
            easing: 'ease-in-out',
            once: true,
        });
    }, []);

    // Enhanced dummy data with more realistic patterns
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const weekData = ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4', 'Minggu 5', 'Minggu 6', 'Minggu 7', 'Minggu 8'];

    const attendanceData = timeRange === 'semester' ?
        [88.5, 85.2, 89.0, 90.5, 88.7, 82.3, 78.5, 89.2, 92.1, 93.5, 91.2, 87.8] :
        [85.4, 87.8, 89.2, 86.5, 88.9, 91.3, 89.7, 92.4];

    const lastPeriodData = timeRange === 'semester' ?
        [84.2, 83.1, 86.5, 87.0, 85.2, 80.5, 76.0, 86.5, 89.3, 90.1, 88.4, 84.7] :
        [82.1, 84.5, 86.8, 83.2, 85.7, 88.9, 87.3, 89.6];

    // Enhanced trend statistics with more detailed data
    const trendStats = [
        {
            label: "Rata-rata Kehadiran",
            value: "89.2%",
            change: "+3.4%",
            changeValue: "+2.9",
            isPositive: true,
            icon: MdTrendingUp,
            color: "blue",
            description: "Dari periode sebelumnya"
        },
        {
            label: "Tingkat Keterlambatan",
            value: "7.8%",
            change: "-1.8%",
            changeValue: "-1.2",
            isPositive: true,
            icon: MdAccessTime,
            color: "green",
            description: "Penurunan signifikan"
        },
        {
            label: "Konsistensi Kehadiran",
            value: "94.1%",
            change: "+5.3%",
            changeValue: "+4.8",
            isPositive: true,
            icon: MdSpeed,
            color: "purple",
            description: "Peningkatan konsistensi"
        },
        {
            label: "Prediksi Akhir Semester",
            value: "91.5%",
            change: "+2.7%",
            changeValue: "+2.2",
            isPositive: true,
            icon: MdAnalytics,
            color: "orange",
            description: "Proyeksi berdasarkan trend"
        }
    ];    // Chart data for trends with enhanced styling
    const trendChartData = {
        labels: timeRange === 'semester' ? months : weekData,
        datasets: [
            {
                label: "Kehadiran Periode Ini",
                data: attendanceData,
                borderColor: "rgba(59, 130, 246, 1)",
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                tension: 0.4,
                fill: true,
                pointRadius: 4,
                pointHoverRadius: 8,
                pointBackgroundColor: "rgba(59, 130, 246, 1)",
                pointBorderColor: "#ffffff",
                pointBorderWidth: 2,
                pointHoverBackgroundColor: "rgba(59, 130, 246, 1)",
                pointHoverBorderColor: "#ffffff",
                pointHoverBorderWidth: 3,
            },
            ...(comparisonMode ? [{
                label: "Periode Sebelumnya",
                data: lastPeriodData,
                borderColor: "rgba(156, 163, 175, 1)",
                backgroundColor: "rgba(156, 163, 175, 0.05)",
                borderDash: [8, 4],
                tension: 0.4,
                fill: false,
                pointRadius: 3,
                pointHoverRadius: 6,
                pointBackgroundColor: "rgba(156, 163, 175, 1)",
                pointBorderColor: "#ffffff",
                pointBorderWidth: 2,
            }] : [])
        ],
    };

    const trendChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    boxWidth: 12,
                    usePointStyle: true,
                    pointStyle: 'circle',
                    padding: 20,
                    font: {
                        size: 12,
                        weight: '500'
                    }
                },
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#ffffff',
                bodyColor: '#ffffff',
                borderColor: 'rgba(59, 130, 246, 0.5)',
                borderWidth: 1,
                cornerRadius: 8,
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
                min: 65,
                max: 100,
                grid: {
                    color: "rgba(0, 0, 0, 0.05)",
                    drawBorder: false,
                },
                ticks: {
                    callback: function (value) {
                        return value + '%';
                    },
                    font: {
                        size: 11
                    }
                },
                border: {
                    display: false
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    font: {
                        size: 11
                    }
                },
                border: {
                    display: false
                }
            }
        },
    };    // Enhanced trend insights with more comprehensive data
    const trendInsights = [
        {
            title: "Puncak Kehadiran di Semester Akhir",
            description: "Terjadi peningkatan kehadiran sebesar 8.7% pada 3 bulan terakhir semester, menunjukkan kesadaran tinggi mahasiswa menjelang ujian akhir.",
            type: "positive",
            icon: MdTrendingUp,
            impact: "high",
            recommendation: "Pertahankan momentum ini dengan program motivasi berkelanjutan"
        },
        {
            title: "Anomali Kehadiran Bulan Juli",
            description: "Tingkat kehadiran turun drastis hingga 78.5% di bulan Juli, bertepatan dengan periode ujian tengah semester dan aktivitas kemahasiswaan.",
            type: "negative",
            icon: MdTrendingDown,
            impact: "medium",
            recommendation: "Evaluasi jadwal ujian dan koordinasi dengan kegiatan non-akademik"
        },
        {
            title: "Konsistensi Program Teknik Informatika",
            description: "Program Teknik Informatika mempertahankan kehadiran konsisten di atas 90% selama 8 bulan terakhir, menjadi benchmark untuk program lain.",
            type: "positive",
            icon: MdSchool,
            impact: "high",
            recommendation: "Implementasikan best practices ke program studi lain"
        },
        {
            title: "Pola Keterlambatan Kelas Pagi",
            description: "Analisis menunjukkan peningkatan 12% keterlambatan pada kelas jam 08:00-09:00 dibanding kelas siang, terutama hari Senin dan Jumat.",
            type: "warning",
            icon: MdAccessTime,
            impact: "medium",
            recommendation: "Pertimbangkan penyesuaian jadwal atau sistem reminder"
        },
        {
            title: "Korelasi Cuaca dan Kehadiran",
            description: "Data menunjukkan penurunan kehadiran 5-7% pada hari hujan, terutama mempengaruhi mahasiswa yang tinggal jauh dari kampus.",
            type: "info",
            icon: MdInfo,
            impact: "low",
            recommendation: "Siapkan sistem pembelajaran online cadangan untuk cuaca ekstrem"
        },
        {
            title: "Efektivitas Sistem Reminder",
            description: "Implementasi sistem reminder WhatsApp meningkatkan kehadiran 4.2% dalam 2 bulan terakhir, dengan respon terbaik pada reminder H-1.",
            type: "positive",
            icon: MdCheckCircle,
            impact: "medium",
            recommendation: "Optimalkan timing dan personalisasi pesan reminder"
        }
    ];

    // Program comparison data
    const programComparisonData = [
        { program: 'Teknik Informatika', current: 92.3, previous: 89.1, students: 156, trend: 'up' },
        { program: 'Sistem Informasi', current: 88.7, previous: 90.2, students: 134, trend: 'down' },
        { program: 'Teknik Komputer', current: 86.4, previous: 83.8, students: 98, trend: 'up' },
        { program: 'Manajemen Informatika', current: 91.2, previous: 88.5, students: 112, trend: 'up' },
        { program: 'Teknik Elektro', current: 84.9, previous: 86.7, students: 89, trend: 'down' }
    ];

    // Weekly pattern data
    const weeklyPatterns = [
        { day: 'Senin', attendance: 85.2, late: 12.3, absent: 2.5 },
        { day: 'Selasa', attendance: 91.7, late: 6.8, absent: 1.5 },
        { day: 'Rabu', attendance: 93.4, late: 5.2, absent: 1.4 },
        { day: 'Kamis', attendance: 90.8, late: 7.1, absent: 2.1 },
        { day: 'Jumat', attendance: 87.3, late: 10.4, absent: 2.3 },
        { day: 'Sabtu', attendance: 82.6, late: 14.2, absent: 3.2 }
    ];

    const handleRefreshData = () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
        }, 1500);
    }; return (
        <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 md:p-8">
            {/* Modern Header Section */}
            <div className="mb-8" data-aos="fade-down">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-xl">
                            <MdTimeline className="h-10 w-10 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                Analisis Tren Kehadiran
                            </h1>
                            <p className="text-gray-600 text-lg mt-1">
                                Wawasan mendalam tentang pola dan tren kehadiran mahasiswa sepanjang waktu
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleRefreshData}
                            disabled={isLoading}
                            className="px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300 flex items-center gap-2 shadow-sm"
                        >
                            <MdRefresh className={`h-5 w-5 text-gray-600 ${isLoading ? 'animate-spin' : ''}`} />
                            <span className="text-gray-700">{isLoading ? 'Loading...' : 'Refresh'}</span>
                        </button>

                        <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg flex items-center gap-2">
                            <MdFileDownload className="h-5 w-5" />
                            Export Data
                        </button>
                    </div>
                </div>
            </div>

            {/* Enhanced Controls */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8" data-aos="fade-up">
                <div className="flex flex-wrap items-center gap-6">
                    <div className="flex-1 min-w-[200px]">
                        <label htmlFor="timeRange" className="block text-sm font-semibold text-gray-700 mb-2">
                            Rentang Waktu
                        </label>
                        <div className="relative">
                            <MdCalendarToday className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
                            <select
                                id="timeRange"
                                className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm appearance-none transition-all duration-200"
                                value={timeRange}
                                onChange={(e) => setTimeRange(e.target.value)}
                            >
                                <option value="week">8 Minggu Terakhir</option>
                                <option value="semester">1 Semester Terakhir</option>
                                <option value="year">1 Tahun Terakhir</option>
                                <option value="custom">Rentang Kustom</option>
                            </select>
                            <MdArrowDropDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    <div className="flex-1 min-w-[200px]">
                        <label htmlFor="program" className="block text-sm font-semibold text-gray-700 mb-2">
                            Program Studi
                        </label>
                        <div className="relative">
                            <MdSchool className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
                            <select
                                id="program"
                                className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm appearance-none transition-all duration-200"
                                value={selectedProgram}
                                onChange={(e) => setSelectedProgram(e.target.value)}
                            >
                                <option value="all">Semua Program</option>
                                <option value="informatics">Teknik Informatika</option>
                                <option value="is">Sistem Informasi</option>
                                <option value="cs">Teknik Komputer</option>
                                <option value="mi">Manajemen Informatika</option>
                                <option value="te">Teknik Elektro</option>
                            </select>
                            <MdArrowDropDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    <div className="flex-1 min-w-[200px]">
                        <label htmlFor="year" className="block text-sm font-semibold text-gray-700 mb-2">
                            Angkatan
                        </label>
                        <div className="relative">
                            <MdFilterList className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
                            <select
                                id="year"
                                className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm appearance-none transition-all duration-200"
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                            >
                                <option value="all">Semua Angkatan</option>
                                <option value="2024">Angkatan 2024</option>
                                <option value="2023">Angkatan 2023</option>
                                <option value="2022">Angkatan 2022</option>
                                <option value="2021">Angkatan 2021</option>
                                <option value="2020">Angkatan 2020</option>
                            </select>
                            <MdArrowDropDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center bg-blue-50 p-3 rounded-xl border border-blue-200">
                            <input
                                type="checkbox"
                                id="comparison"
                                checked={comparisonMode}
                                onChange={() => setComparisonMode(!comparisonMode)}
                                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-all duration-200"
                            />
                            <label htmlFor="comparison" className="ml-3 text-sm font-medium text-blue-700 flex items-center gap-2">
                                <MdCompare className="h-4 w-4" />
                                Bandingkan Periode
                            </label>
                        </div>
                    </div>                </div>
            </div>

            {/* Enhanced Trend Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {trendStats.map((stat, index) => {
                    const colorMap = {
                        blue: {
                            bg: 'bg-blue-50',
                            text: 'text-blue-600',
                            border: 'border-blue-200',
                            gradient: 'from-blue-500 to-blue-600'
                        },
                        green: {
                            bg: 'bg-green-50',
                            text: 'text-green-600',
                            border: 'border-green-200',
                            gradient: 'from-green-500 to-green-600'
                        },
                        purple: {
                            bg: 'bg-purple-50',
                            text: 'text-purple-600',
                            border: 'border-purple-200',
                            gradient: 'from-purple-500 to-purple-600'
                        },
                        orange: {
                            bg: 'bg-orange-50',
                            text: 'text-orange-600',
                            border: 'border-orange-200',
                            gradient: 'from-orange-500 to-orange-600'
                        }
                    };

                    const colors = colorMap[stat.color];

                    return (
                        <div
                            key={index}
                            className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border ${colors.border} p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}
                            data-aos="fade-up"
                            data-aos-delay={index * 100}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-2xl bg-gradient-to-r ${colors.gradient} shadow-lg`}>
                                    <stat.icon className="h-6 w-6 text-white" />
                                </div>
                                <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${stat.isPositive
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-100 text-red-700'
                                    }`}>
                                    {stat.isPositive ? <MdTrendingUp className="h-3 w-3" /> : <MdTrendingDown className="h-3 w-3" />}
                                    {stat.change}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-600 mb-1">{stat.label}</h3>
                                <p className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</p>
                                <p className="text-xs text-gray-500">{stat.description}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Main Trend Chart with Enhanced Design */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8" data-aos="fade-up" data-aos-delay="200">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                            <MdShowChart className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-800">
                                Tren Kehadiran {timeRange === 'semester' ? 'Bulanan' : 'Mingguan'}
                            </h3>
                            <p className="text-sm text-gray-600">
                                {comparisonMode
                                    ? 'Perbandingan dengan periode sebelumnya'
                                    : 'Data periode saat ini'
                                }
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-xl border border-blue-200">
                        <MdAutoGraph className="h-5 w-5 text-blue-600" />
                        <span className="text-sm font-medium text-blue-700">Live Analytics</span>
                    </div>
                </div>
                <div className="h-96 relative">
                    {isLoading ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-xl">
                            <div className="flex flex-col items-center gap-3">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                <p className="text-sm text-gray-600">Loading chart data...</p>
                            </div>
                        </div>
                    ) : (
                        <Line data={trendChartData} options={trendChartOptions} />
                    )}
                </div>
            </div>            {/* Enhanced Trend Insights */}
            <div className="mb-8" data-aos="fade-up" data-aos-delay="300">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl">
                        <MdInsights className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">Wawasan Analitik Mendalam</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {trendInsights.map((insight, index) => {
                        const typeConfig = {
                            positive: {
                                border: 'border-l-green-500',
                                bg: 'bg-gradient-to-r from-green-50 to-emerald-50',
                                text: 'text-green-800',
                                subtext: 'text-green-700',
                                icon: 'text-green-600'
                            },
                            negative: {
                                border: 'border-l-red-500',
                                bg: 'bg-gradient-to-r from-red-50 to-rose-50',
                                text: 'text-red-800',
                                subtext: 'text-red-700',
                                icon: 'text-red-600'
                            },
                            warning: {
                                border: 'border-l-yellow-500',
                                bg: 'bg-gradient-to-r from-yellow-50 to-amber-50',
                                text: 'text-yellow-800',
                                subtext: 'text-yellow-700',
                                icon: 'text-yellow-600'
                            },
                            info: {
                                border: 'border-l-blue-500',
                                bg: 'bg-gradient-to-r from-blue-50 to-cyan-50',
                                text: 'text-blue-800',
                                subtext: 'text-blue-700',
                                icon: 'text-blue-600'
                            }
                        };

                        const config = typeConfig[insight.type];

                        return (
                            <div
                                key={index}
                                className={`${config.bg} ${config.border} border-l-4 p-6 rounded-r-2xl shadow-lg hover:shadow-xl transition-all duration-300`}
                                data-aos="fade-up"
                                data-aos-delay={300 + index * 100}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`p-2 bg-white rounded-xl shadow-sm ${config.icon}`}>
                                        <insight.icon className="h-6 w-6" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className={`font-bold text-lg ${config.text}`}>
                                                {insight.title}
                                            </h4>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${insight.impact === 'high' ? 'bg-red-100 text-red-700' :
                                                insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-green-100 text-green-700'
                                                }`}>
                                                {insight.impact === 'high' ? 'High Impact' :
                                                    insight.impact === 'medium' ? 'Medium Impact' : 'Low Impact'}
                                            </span>
                                        </div>
                                        <p className={`${config.subtext} mb-3 leading-relaxed`}>
                                            {insight.description}
                                        </p>
                                        <div className="bg-white/60 rounded-xl p-3 border border-white/40">
                                            <p className="text-xs font-medium text-gray-600 mb-1">Rekomendasi:</p>
                                            <p className="text-sm text-gray-700">{insight.recommendation}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Program Comparison Section */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8" data-aos="fade-up" data-aos-delay="400">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl">
                        <MdBarChart className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">Perbandingan Antar Program Studi</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {programComparisonData.map((program, index) => (
                        <div
                            key={index}
                            className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300"
                            data-aos="fade-up"
                            data-aos-delay={400 + index * 100}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="font-semibold text-gray-800 text-sm">{program.program}</h4>
                                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${program.trend === 'up'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-100 text-red-700'
                                    }`}>
                                    {program.trend === 'up' ? <MdTrendingUp className="h-3 w-3" /> : <MdTrendingDown className="h-3 w-3" />}
                                    {((program.current - program.previous) / program.previous * 100).toFixed(1)}%
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs text-gray-600">Kehadiran Saat Ini</span>
                                        <span className="text-lg font-bold text-gray-800">{program.current}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full ${program.trend === 'up' ? 'bg-green-500' : 'bg-red-500'}`}
                                            style={{ width: `${program.current}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center text-xs text-gray-600">
                                    <span>Periode Sebelumnya: {program.previous}%</span>
                                    <span>{program.students} mahasiswa</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Weekly Pattern Analysis */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8" data-aos="fade-up" data-aos-delay="500">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-xl">
                        <MdCalendarToday className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">Pola Kehadiran Mingguan</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {weeklyPatterns.map((day, index) => (
                        <div
                            key={index}
                            className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 border border-gray-200"
                            data-aos="fade-up"
                            data-aos-delay={500 + index * 50}
                        >
                            <h4 className="font-semibold text-gray-800 mb-3">{day.day}</h4>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-green-600 font-medium">Hadir</span>
                                    <span className="text-sm font-bold text-green-700">{day.attendance}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div
                                        className="h-1.5 rounded-full bg-green-500"
                                        style={{ width: `${day.attendance}%` }}
                                    ></div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                                    <div className="flex items-center justify-between">
                                        <span className="text-yellow-600">Terlambat</span>
                                        <span className="font-medium">{day.late}%</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-red-600">Absen</span>
                                        <span className="font-medium">{day.absent}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>            {/* Enhanced Further Analysis */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8" data-aos="fade-up" data-aos-delay="600">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-gradient-to-r from-cyan-500 to-teal-600 rounded-xl">
                        <MdAnalytics className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">Analisis Lanjutan & Eksplorasi Data</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="group bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-blue-500 rounded-xl shadow-lg group-hover:bg-blue-600 transition-colors">
                                <MdCalendarToday className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h4 className="font-bold text-blue-800">Analisis Harian Mendalam</h4>
                                <p className="text-xs text-blue-600">Pattern Recognition</p>
                            </div>
                        </div>
                        <p className="text-sm text-blue-700 mb-4 leading-relaxed">
                            Identifikasi pola kehadiran berdasarkan hari dalam seminggu, termasuk analisis cuaca, event kampus, dan faktor eksternal lainnya.
                        </p>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-blue-600 font-medium">Ready to analyze</span>
                            <button className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2">
                                <MdVisibility className="h-4 w-4" />
                                Lihat Detail
                            </button>
                        </div>
                    </div>

                    <div className="group bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-green-500 rounded-xl shadow-lg group-hover:bg-green-600 transition-colors">
                                <MdSchool className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h4 className="font-bold text-green-800">Analisis Per Mata Kuliah</h4>
                                <p className="text-xs text-green-600">Subject Comparison</p>
                            </div>
                        </div>
                        <p className="text-sm text-green-700 mb-4 leading-relaxed">
                            Bandingkan kehadiran di berbagai mata kuliah, identifikasi mata kuliah dengan tingkat kehadiran rendah dan faktor penyebabnya.
                        </p>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-green-600 font-medium">15 subjects tracked</span>
                            <button className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2">
                                <MdVisibility className="h-4 w-4" />
                                Lihat Detail
                            </button>
                        </div>
                    </div>

                    <div className="group bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-purple-500 rounded-xl shadow-lg group-hover:bg-purple-600 transition-colors">
                                <MdSpeed className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h4 className="font-bold text-purple-800">Korelasi Performa Akademik</h4>
                                <p className="text-xs text-purple-600">Performance Analysis</p>
                            </div>
                        </div>
                        <p className="text-sm text-purple-700 mb-4 leading-relaxed">
                            Analisis hubungan antara tingkat kehadiran dengan nilai akademik, identifikasi threshold kehadiran optimal untuk performa terbaik.
                        </p>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-purple-600 font-medium">High correlation detected</span>
                            <button className="px-4 py-2 bg-purple-500 text-white text-sm font-medium rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2">
                                <MdVisibility className="h-4 w-4" />
                                Lihat Detail
                            </button>
                        </div>
                    </div>

                    <div className="group bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-orange-500 rounded-xl shadow-lg group-hover:bg-orange-600 transition-colors">
                                <MdAccessTime className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h4 className="font-bold text-orange-800">Analisis Keterlambatan</h4>
                                <p className="text-xs text-orange-600">Tardiness Patterns</p>
                            </div>
                        </div>
                        <p className="text-sm text-orange-700 mb-4 leading-relaxed">
                            Pola keterlambatan berdasarkan waktu, hari, dan karakteristik mahasiswa. Identifikasi mahasiswa yang sering terlambat dan solusinya.
                        </p>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-orange-600 font-medium">Patterns identified</span>
                            <button className="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2">
                                <MdVisibility className="h-4 w-4" />
                                Lihat Detail
                            </button>
                        </div>
                    </div>

                    <div className="group bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-indigo-500 rounded-xl shadow-lg group-hover:bg-indigo-600 transition-colors">
                                <MdShowChart className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h4 className="font-bold text-indigo-800">Prediksi Kehadiran</h4>
                                <p className="text-xs text-indigo-600">AI Forecasting</p>
                            </div>
                        </div>
                        <p className="text-sm text-indigo-700 mb-4 leading-relaxed">
                            Model prediksi berbasis AI untuk memperkirakan tingkat kehadiran masa depan berdasarkan tren historis dan faktor musiman.
                        </p>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-indigo-600 font-medium">91.5% accuracy</span>
                            <button className="px-4 py-2 bg-indigo-500 text-white text-sm font-medium rounded-lg hover:bg-indigo-600 transition-colors flex items-center gap-2">
                                <MdVisibility className="h-4 w-4" />
                                Lihat Detail
                            </button>
                        </div>
                    </div>

                    <div className="group bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-teal-500 rounded-xl shadow-lg group-hover:bg-teal-600 transition-colors">
                                <MdInsights className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h4 className="font-bold text-teal-800">Rekomendasi Strategis</h4>
                                <p className="text-xs text-teal-600">Action Items</p>
                            </div>
                        </div>
                        <p className="text-sm text-teal-700 mb-4 leading-relaxed">
                            Rekomendasi berbasis data untuk meningkatkan kehadiran, termasuk strategi intervensi dan program peningkatan motivasi mahasiswa.
                        </p>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-teal-600 font-medium">8 recommendations</span>
                            <button className="px-4 py-2 bg-teal-500 text-white text-sm font-medium rounded-lg hover:bg-teal-600 transition-colors flex items-center gap-2">
                                <MdVisibility className="h-4 w-4" />
                                Lihat Detail
                            </button>
                        </div>
                    </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-4 mt-8 pt-6 border-t border-gray-200">
                    <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg flex items-center gap-2">
                        <MdFileDownload className="h-5 w-5" />
                        Export Laporan Lengkap
                    </button>

                    <button className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all duration-300 flex items-center gap-2">
                        <MdRefresh className="h-5 w-5" />
                        Refresh All Data
                    </button>

                    <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg flex items-center gap-2">
                        <MdAnalytics className="h-5 w-5" />
                        Generate Report
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AttendanceTrends;
