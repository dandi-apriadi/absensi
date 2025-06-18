import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    MdAnalytics,
    MdCalendarToday,
    MdGroup,
    MdAccessTime,
    MdDownload,
    MdArrowDropDown,
    MdBarChart,
    MdAutoGraph,
    MdPieChart,
    MdGroups,
    MdStar,
    MdTrendingUp,
    MdTrendingDown,
    MdInsights,
    MdShowChart,
    MdTimeline,
    MdAssessment,
    MdFilterList,
    MdRefresh,
    MdFileDownload,
    MdWarning,
    MdCheckCircle,
    MdInfo,
    MdSchool,
    MdPeople,
    MdEventNote,
    MdSpeed
} from "react-icons/md";
import AOS from "aos";
import "aos/dist/aos.css";

// Error Boundary for Charts
class ChartErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Chart Error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <MdWarning className="h-12 w-12 mb-2" />
                    <p className="text-sm">Chart tidak dapat dimuat</p>
                    <button
                        onClick={() => this.setState({ hasError: false })}
                        className="mt-2 px-3 py-1 bg-blue-500 text-white text-xs rounded"
                    >
                        Coba Lagi
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

// Lazy load chart components with error handling
const DailyAttendanceChart = React.lazy(() =>
    import("./components/DailyAttendanceChart").catch(() => ({
        default: () => (
            <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                    <MdBarChart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p>Chart tidak tersedia</p>
                </div>
            </div>
        )
    }))
);

const AttendanceByProgramChart = React.lazy(() =>
    import("./components/AttendanceByProgramChart").catch(() => ({
        default: () => (
            <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                    <MdPieChart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p>Chart tidak tersedia</p>
                </div>
            </div>
        )
    }))
);

const AttendanceHeatmapChart = React.lazy(() =>
    import("./components/AttendanceHeatmapChart").catch(() => ({
        default: () => (
            <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                    <MdAssessment className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p>Chart tidak tersedia</p>
                </div>
            </div>
        )
    }))
);

const TopPerformingStudentsChart = React.lazy(() =>
    import("./components/TopPerformingStudentsChart").catch(() => ({
        default: () => (
            <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                    <MdStar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p>Chart tidak tersedia</p>
                </div>
            </div>
        )
    }))
);

const AnalyticsDashboard = () => {
    const [dailyAttendanceData, setDailyAttendanceData] = useState([]);
    const [attendanceByProgramData, setAttendanceByProgramData] = useState([]);
    const [attendanceHeatmapData, setAttendanceHeatmapData] = useState([]);
    const [topPerformingStudentsData, setTopPerformingStudentsData] = useState([]);
    const [selectedPeriod, setSelectedPeriod] = useState('month');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true
        });
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setIsLoading(true);
        try {
            await Promise.all([
                fetchDailyAttendanceData(),
                fetchAttendanceByProgramData(),
                fetchAttendanceHeatmapData(),
                fetchTopPerformingStudentsData()
            ]);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchDailyAttendanceData = async () => {
        // Simulate API call with dummy data
        const dummyData = [
            { date: '2025-06-01', present: 85, late: 12, absent: 8 },
            { date: '2025-06-02', present: 89, late: 10, absent: 6 },
            { date: '2025-06-03', present: 92, late: 8, absent: 5 },
            { date: '2025-06-04', present: 87, late: 11, absent: 7 },
            { date: '2025-06-05', present: 94, late: 6, absent: 5 }
        ];
        setDailyAttendanceData(dummyData);
    };

    const fetchAttendanceByProgramData = async () => {
        const dummyData = [
            { program: 'Teknik Informatika', attendance: 92, students: 156 },
            { program: 'Sistem Informasi', attendance: 88, students: 134 },
            { program: 'Teknik Komputer', attendance: 85, students: 98 },
            { program: 'Manajemen Informatika', attendance: 90, students: 112 }
        ];
        setAttendanceByProgramData(dummyData);
    };

    const fetchAttendanceHeatmapData = async () => {
        const dummyData = {
            labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum'],
            datasets: [
                { time: '08:00', data: [85, 82, 88, 90, 87] },
                { time: '10:00', data: [92, 89, 91, 88, 85] },
                { time: '13:00', data: [78, 80, 82, 85, 83] },
                { time: '15:00', data: [88, 85, 87, 89, 86] }
            ]
        };
        setAttendanceHeatmapData(dummyData);
    };

    const fetchTopPerformingStudentsData = async () => {
        const dummyData = [
            { name: 'Ahmad Fauzi Rahman', nim: '2021010101', attendance: 98, program: 'Teknik Informatika' },
            { name: 'Siti Nurhaliza Dewi', nim: '2021010102', attendance: 97, program: 'Sistem Informasi' },
            { name: 'Budi Santoso Wijaya', nim: '2021010201', attendance: 96, program: 'Teknik Komputer' },
            { name: 'Indah Permata Sari', nim: '2020010101', attendance: 95, program: 'Teknik Informatika' },
            { name: 'Dewi Lestari Putri', nim: '2022010101', attendance: 94, program: 'Manajemen Informatika' }
        ];
        setTopPerformingStudentsData(dummyData);
    };

    // Enhanced dummy statistics
    const statisticsData = [
        {
            title: 'Total Mahasiswa',
            value: '500',
            change: '+12',
            changePercent: '+2.4%',
            icon: MdSchool,
            color: 'bg-blue-500',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600',
            trend: 'up'
        },
        {
            title: 'Rata-rata Kehadiran',
            value: '89.2%',
            change: '+3.5%',
            changePercent: '+3.5%',
            icon: MdTrendingUp,
            color: 'bg-green-500',
            bgColor: 'bg-green-50',
            textColor: 'text-green-600',
            trend: 'up'
        },
        {
            title: 'Kelas Aktif',
            value: '24',
            change: '+2',
            changePercent: '+9.1%',
            icon: MdEventNote,
            color: 'bg-purple-500',
            bgColor: 'bg-purple-50',
            textColor: 'text-purple-600',
            trend: 'up'
        },
        {
            title: 'Keterlambatan',
            value: '8.4%',
            change: '-1.2%',
            changePercent: '-12.5%',
            icon: MdAccessTime,
            color: 'bg-orange-500',
            bgColor: 'bg-orange-50',
            textColor: 'text-orange-600',
            trend: 'down'
        }
    ];

    const insights = [
        {
            type: 'success',
            icon: MdTrendingUp,
            title: 'Peningkatan Kehadiran',
            description: 'Kehadiran mahasiswa meningkat 3.2% dibandingkan bulan lalu',
            color: 'text-green-600',
            bgColor: 'bg-green-100'
        },
        {
            type: 'improvement',
            icon: MdSpeed,
            title: 'Keterlambatan Menurun',
            description: 'Keterlambatan pada kelas pagi menurun 4.5% setelah implementasi sistem baru',
            color: 'text-blue-600',
            bgColor: 'bg-blue-100'
        },
        {
            type: 'info',
            icon: MdStar,
            title: 'Program Terbaik',
            description: 'Teknik Informatika memiliki rata-rata kehadiran tertinggi (92.3%)',
            color: 'text-purple-600',
            bgColor: 'bg-purple-100'
        }
    ];

    const recommendations = [
        {
            priority: 'high',
            icon: MdWarning,
            title: 'Perbarui Dataset Wajah',
            description: '32 mahasiswa memerlukan pembaruan data biometrik untuk akurasi yang lebih baik',
            color: 'text-red-600',
            bgColor: 'bg-red-100'
        },
        {
            priority: 'medium',
            icon: MdInfo,
            title: 'Tinjau Jadwal Kelas',
            description: 'Jadwal kelas Sistem Informasi perlu ditinjau untuk mengurangi keterlambatan',
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-100'
        },
        {
            priority: 'medium',
            icon: MdPeople,
            title: 'Perhatian Khusus',
            description: 'Mahasiswa angkatan 2023 membutuhkan pendampingan (kehadiran rata-rata 78%)',
            color: 'text-orange-600',
            bgColor: 'bg-orange-100'
        }
    ];

    const quickActions = [
        {
            title: 'Analisis Kehadiran Harian',
            description: 'Lihat tren kehadiran harian dan pola mahasiswa',
            icon: MdCalendarToday,
            color: 'from-blue-500 to-cyan-600',
            link: '/super-admin/analytics/daily-attendance'
        },
        {
            title: 'Kehadiran per Program Studi',
            description: 'Bandingkan performa kehadiran antar program studi',
            icon: MdBarChart,
            color: 'from-green-500 to-emerald-600',
            link: '/super-admin/analytics/attendance-by-program'
        },
        {
            title: 'Heatmap Kehadiran',
            description: 'Visualisasi pola kehadiran berdasarkan waktu dan hari',
            icon: MdShowChart,
            color: 'from-purple-500 to-pink-600',
            link: '/super-admin/analytics/attendance-heatmap'
        },
        {
            title: 'Mahasiswa Berprestasi',
            description: 'Identifikasi mahasiswa dengan kehadiran terbaik',
            icon: MdStar,
            color: 'from-yellow-500 to-orange-500',
            link: '/super-admin/analytics/top-performing-students'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
            {/* Header Section */}
            <div className="mb-8" data-aos="fade-down">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
                            <MdAnalytics className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                Dashboard Analitik
                            </h1>
                            <p className="text-gray-600 text-lg">Wawasan mendalam tentang kehadiran dan performa mahasiswa</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <select
                            className="px-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            value={selectedPeriod}
                            onChange={(e) => setSelectedPeriod(e.target.value)}
                        >
                            <option value="week">Minggu Ini</option>
                            <option value="month">Bulan Ini</option>
                            <option value="semester">Semester Ini</option>
                            <option value="year">Tahun Ini</option>
                        </select>

                        <button
                            onClick={fetchAllData}
                            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg flex items-center gap-2"
                            disabled={isLoading}
                        >
                            <MdRefresh className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
                            {isLoading ? 'Loading...' : 'Refresh'}
                        </button>

                        <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2">
                            <MdFileDownload className="h-5 w-5" />
                            Export
                        </button>
                    </div>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statisticsData.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100"
                        data-aos="fade-up"
                        data-aos-delay={index * 100}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-2xl ${stat.bgColor}`}>
                                <stat.icon className={`h-8 w-8 ${stat.textColor}`} />
                            </div>
                            <div className={`flex items-center text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                {stat.trend === 'up' ? <MdTrendingUp className="h-4 w-4 mr-1" /> : <MdTrendingDown className="h-4 w-4 mr-1" />}
                                {stat.changePercent}
                            </div>
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                            <p className="text-3xl font-bold text-gray-800 mt-1">{stat.value}</p>
                            <p className="text-gray-500 text-sm mt-1">{stat.change} dari periode sebelumnya</p>
                        </div>
                    </div>
                ))}
            </div>            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Daily Attendance Chart */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100" data-aos="fade-up">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <MdTimeline className="h-6 w-6 text-blue-500" />
                            <h2 className="text-xl font-bold text-gray-800">Tren Kehadiran Harian</h2>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                            Lihat Detail
                        </button>
                    </div>
                    <div className="h-80">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                            </div>
                        ) : (
                            <ChartErrorBoundary>
                                <React.Suspense fallback={
                                    <div className="flex items-center justify-center h-full text-gray-500">
                                        <div className="animate-pulse">Loading chart...</div>
                                    </div>
                                }>
                                    <DailyAttendanceChart data={dailyAttendanceData} />
                                </React.Suspense>
                            </ChartErrorBoundary>
                        )}
                    </div>
                </div>

                {/* Attendance by Program Chart */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100" data-aos="fade-up" data-aos-delay="200">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <MdPieChart className="h-6 w-6 text-green-500" />
                            <h2 className="text-xl font-bold text-gray-800">Kehadiran per Program Studi</h2>
                        </div>
                        <button className="text-green-600 hover:text-green-700 font-medium text-sm">
                            Lihat Detail
                        </button>
                    </div>
                    <div className="h-80">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                            </div>
                        ) : (
                            <ChartErrorBoundary>
                                <React.Suspense fallback={
                                    <div className="flex items-center justify-center h-full text-gray-500">
                                        <div className="animate-pulse">Loading chart...</div>
                                    </div>
                                }>
                                    <AttendanceByProgramChart data={attendanceByProgramData} />
                                </React.Suspense>
                            </ChartErrorBoundary>
                        )}
                    </div>
                </div>

                {/* Attendance Heatmap Chart */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100" data-aos="fade-up" data-aos-delay="400">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <MdAssessment className="h-6 w-6 text-purple-500" />
                            <h2 className="text-xl font-bold text-gray-800">Pola Kehadiran Mingguan</h2>
                        </div>
                        <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">
                            Lihat Detail
                        </button>
                    </div>
                    <div className="h-80">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                            </div>
                        ) : (
                            <ChartErrorBoundary>
                                <React.Suspense fallback={
                                    <div className="flex items-center justify-center h-full text-gray-500">
                                        <div className="animate-pulse">Loading chart...</div>
                                    </div>
                                }>
                                    <AttendanceHeatmapChart data={attendanceHeatmapData} />
                                </React.Suspense>
                            </ChartErrorBoundary>
                        )}
                    </div>
                </div>

                {/* Top Performing Students Chart */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100" data-aos="fade-up" data-aos-delay="600">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <MdStar className="h-6 w-6 text-yellow-500" />
                            <h2 className="text-xl font-bold text-gray-800">Mahasiswa Berprestasi</h2>
                        </div>
                        <button className="text-yellow-600 hover:text-yellow-700 font-medium text-sm">
                            Lihat Detail
                        </button>
                    </div>
                    <div className="h-80">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
                            </div>
                        ) : (
                            <ChartErrorBoundary>
                                <React.Suspense fallback={
                                    <div className="flex items-center justify-center h-full text-gray-500">
                                        <div className="animate-pulse">Loading chart...</div>
                                    </div>
                                }>
                                    <TopPerformingStudentsChart data={topPerformingStudentsData} />
                                </React.Suspense>
                            </ChartErrorBoundary>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-6" data-aos="fade-right">
                    <MdInsights className="h-6 w-6 text-blue-500" />
                    <h2 className="text-2xl font-bold text-gray-800">Analisis Lanjutan</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {quickActions.map((action, index) => (
                        <Link key={index} to={action.link} className="block group">
                            <div
                                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group-hover:scale-105"
                                data-aos="fade-up"
                                data-aos-delay={index * 100}
                            >
                                <div className={`p-4 rounded-2xl bg-gradient-to-r ${action.color} mb-4 w-fit shadow-lg`}>
                                    <action.icon className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                                    {action.title}
                                </h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {action.description}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Insights and Recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Insights */}
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100" data-aos="fade-right">
                    <div className="flex items-center gap-3 mb-6">
                        <MdInsights className="h-6 w-6 text-green-500" />
                        <h2 className="text-xl font-bold text-gray-800">Wawasan Terkini</h2>
                    </div>

                    <div className="space-y-4">
                        {insights.map((insight, index) => (
                            <div
                                key={index}
                                className="flex items-start gap-4 p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300"
                            >
                                <div className={`p-2 rounded-lg ${insight.bgColor} flex-shrink-0`}>
                                    <insight.icon className={`h-5 w-5 ${insight.color}`} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-800 mb-1">{insight.title}</h4>
                                    <p className="text-gray-600 text-sm">{insight.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recommendations */}
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100" data-aos="fade-left">
                    <div className="flex items-center gap-3 mb-6">
                        <MdCheckCircle className="h-6 w-6 text-blue-500" />
                        <h2 className="text-xl font-bold text-gray-800">Rekomendasi Tindakan</h2>
                    </div>

                    <div className="space-y-4">
                        {recommendations.map((rec, index) => (
                            <div
                                key={index}
                                className="flex items-start gap-4 p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300"
                            >
                                <div className={`p-2 rounded-lg ${rec.bgColor} flex-shrink-0`}>
                                    <rec.icon className={`h-5 w-5 ${rec.color}`} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-semibold text-gray-800">{rec.title}</h4>
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${rec.priority === 'high' ? 'bg-red-100 text-red-600' :
                                            rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                                                'bg-green-100 text-green-600'
                                            }`}>
                                            {rec.priority === 'high' ? 'Tinggi' : rec.priority === 'medium' ? 'Sedang' : 'Rendah'}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 text-sm">{rec.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
