import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import Card from "components/card";
import BarChart from "components/charts/BarChart";
import PieChart from "components/charts/PieChart";
import LineChart from "components/charts/LineChart";
import {
    MdEventNote,
    MdAdd,
    MdCalendarToday,
    MdPeopleAlt,
    MdPresentToAll,
    MdHistory,
    MdAssessment,
    MdArrowForward,
    MdTimer,
    MdBarChart,
    MdPieChart,
    MdShowChart,
    MdSearch,
    MdFilterList,
    MdSort,
    MdDownload,
    MdTrendingUp,
    MdInsights,
    MdCheckCircle,
    MdCancel,
    MdWarning,
    MdGroup,
    MdSchool
} from "react-icons/md";

// Dummy Data
const sessionStats = {
    scheduledToday: 2,
    completedToday: 1,
    upcomingWeek: 6,
    totalSessions: 48,
    completedSessions: 32,
    averageAttendance: 88,
    activeSessions: 3,
    totalStudents: 137,
    attendanceRate: 85.5,
    cancelledSessions: 2
};

const upcomingSessions = [
    {
        id: 1,
        course: "Algoritma dan Pemrograman",
        topic: "Algoritma Sorting",
        date: "2023-10-28",
        time: "08:00 - 09:40",
        room: "Lab 301",
        expectedStudents: 35,
        status: "scheduled"
    },
    {
        id: 2,
        course: "Basis Data",
        topic: "Normalisasi Database",
        date: "2023-10-28",
        time: "10:00 - 11:40",
        room: "Lab 302",
        expectedStudents: 42,
        status: "scheduled"
    },
    {
        id: 3,
        course: "Pemrograman Web",
        topic: "JavaScript Lanjutan",
        date: "2023-10-29",
        time: "13:00 - 14:40",
        room: "Lab 303",
        expectedStudents: 38,
        status: "scheduled"
    },
    {
        id: 4,
        course: "Kecerdasan Buatan",
        topic: "Deep Learning",
        date: "2023-10-30",
        time: "15:00 - 16:40",
        room: "Lab 304",
        expectedStudents: 29,
        status: "scheduled"
    },
    {
        id: 5,
        course: "Rekayasa Perangkat Lunak",
        topic: "Agile Development",
        date: "2023-10-31",
        time: "09:00 - 10:40",
        room: "Lab 305",
        expectedStudents: 32,
        status: "scheduled"
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
        attendanceRate: 91,
        studentsPresent: 26,
        totalStudents: 29,
        status: "completed"
    },
    {
        id: 2,
        course: "Algoritma dan Pemrograman",
        topic: "Dynamic Programming",
        date: "2023-10-26",
        time: "08:00 - 09:40",
        room: "Lab 301",
        attendanceRate: 85,
        studentsPresent: 30,
        totalStudents: 35,
        status: "completed"
    },
    {
        id: 3,
        course: "Basis Data",
        topic: "Query Optimization",
        date: "2023-10-25",
        time: "10:00 - 11:40",
        room: "Lab 302",
        attendanceRate: 88,
        studentsPresent: 37,
        totalStudents: 42,
        status: "completed"
    },
    {
        id: 4,
        course: "Pemrograman Web",
        topic: "React Components",
        date: "2023-10-24",
        time: "13:00 - 14:40",
        room: "Lab 303",
        attendanceRate: 82,
        studentsPresent: 31,
        totalStudents: 38,
        status: "completed"
    },
    {
        id: 5,
        course: "Rekayasa Perangkat Lunak",
        topic: "Testing Strategies",
        date: "2023-10-23",
        time: "09:00 - 10:40",
        room: "Lab 305",
        attendanceRate: 90,
        studentsPresent: 29,
        totalStudents: 32,
        status: "completed"
    }
];

// Extended session data for comprehensive management  
const allSessions = [
    ...upcomingSessions,
    ...recentSessions,
    {
        id: 6,
        course: "Matematika Diskrit",
        topic: "Graph Theory",
        date: "2023-10-20",
        time: "14:00 - 15:40",
        room: "Lab 306",
        attendanceRate: 75,
        studentsPresent: 24,
        totalStudents: 32,
        status: "completed"
    },
    {
        id: 7,
        course: "Sistem Operasi",
        topic: "Process Management",
        date: "2023-10-19",
        time: "11:00 - 12:40",
        room: "Lab 307",
        attendanceRate: 0,
        studentsPresent: 0,
        totalStudents: 35,
        status: "cancelled",
        reason: "Dosen sakit"
    }
];

// Statistics for charts
const sessionStatistics = {
    weekly: [
        { week: "Minggu 1", scheduled: 8, completed: 7, cancelled: 1, attendance: 87 },
        { week: "Minggu 2", scheduled: 9, completed: 8, cancelled: 1, attendance: 85 },
        { week: "Minggu 3", scheduled: 8, completed: 8, cancelled: 0, attendance: 89 },
        { week: "Minggu 4", scheduled: 10, completed: 9, cancelled: 1, attendance: 83 },
        { week: "Minggu 5", scheduled: 7, completed: 7, cancelled: 0, attendance: 91 },
        { week: "Minggu 6", scheduled: 9, completed: 8, cancelled: 1, attendance: 86 },
        { week: "Minggu 7", scheduled: 8, completed: 7, cancelled: 1, attendance: 88 },
        { week: "Minggu 8", scheduled: 10, completed: 10, cancelled: 0, attendance: 90 }
    ],
    courseDistribution: [
        { course: "Algoritma dan Pemrograman", sessions: 12, avgAttendance: 86 },
        { course: "Basis Data", sessions: 10, avgAttendance: 89 },
        { course: "Pemrograman Web", sessions: 8, avgAttendance: 84 },
        { course: "Kecerdasan Buatan", sessions: 6, avgAttendance: 91 },
        { course: "Rekayasa Perangkat Lunak", sessions: 7, avgAttendance: 87 },
        { course: "Matematika Diskrit", sessions: 5, avgAttendance: 78 }
    ],
    attendancePatterns: [
        { day: "Senin", avgAttendance: 88 },
        { day: "Selasa", avgAttendance: 85 },
        { day: "Rabu", avgAttendance: 90 },
        { day: "Kamis", avgAttendance: 83 },
        { day: "Jumat", avgAttendance: 79 }
    ]
};

// Chart Configurations
const weeklySessionsChartOptions = {
    chart: {
        type: 'bar',
        toolbar: { show: false }
    },
    colors: ['#3B82F6', '#10B981', '#EF4444'],
    plotOptions: {
        bar: {
            horizontal: false,
            columnWidth: '55%',
            endingShape: 'rounded'
        }
    },
    dataLabels: { enabled: false },
    stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
    },
    xaxis: {
        categories: sessionStatistics.weekly.map(item => item.week),
        labels: {
            style: {
                colors: '#6B7280',
                fontSize: '12px'
            }
        }
    },
    yaxis: {
        labels: {
            style: {
                colors: '#6B7280',
                fontSize: '12px'
            }
        }
    },
    fill: { opacity: 1 },
    tooltip: {
        y: {
            formatter: function (val) {
                return val + " sesi"
            }
        }
    },
    legend: {
        position: 'top',
        horizontalAlign: 'right'
    }
};

const weeklySessionsChartData = [
    {
        name: 'Dijadwalkan',
        data: sessionStatistics.weekly.map(item => item.scheduled)
    },
    {
        name: 'Selesai',
        data: sessionStatistics.weekly.map(item => item.completed)
    },
    {
        name: 'Dibatalkan',
        data: sessionStatistics.weekly.map(item => item.cancelled)
    }
];

const attendancePatternLineOptions = {
    chart: {
        type: 'line',
        toolbar: { show: false }
    },
    stroke: {
        curve: 'smooth',
        width: 3
    },
    colors: ['#6366F1'],
    xaxis: {
        categories: sessionStatistics.attendancePatterns.map(item => item.day),
        labels: {
            style: {
                colors: '#6B7280',
                fontSize: '12px'
            }
        }
    },
    yaxis: {
        min: 70,
        max: 100,
        labels: {
            style: {
                colors: '#6B7280',
                fontSize: '12px'
            },
            formatter: function (val) {
                return val + "%"
            }
        }
    },
    grid: {
        borderColor: '#E5E7EB',
        strokeDashArray: 4
    },
    markers: {
        size: 6,
        colors: ['#6366F1'],
        strokeColors: '#fff',
        strokeWidth: 2
    },
    tooltip: {
        y: {
            formatter: function (val) {
                return val + "%"
            }
        }
    }
};

const attendancePatternLineData = [
    {
        name: 'Tingkat Kehadiran',
        data: sessionStatistics.attendancePatterns.map(item => item.avgAttendance)
    }
];

const courseDistributionPieOptions = {
    chart: { type: 'pie' },
    colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'],
    labels: sessionStatistics.courseDistribution.map(item => item.course),
    legend: {
        position: 'bottom',
        fontSize: '12px'
    },
    dataLabels: {
        enabled: true,
        formatter: function (val) {
            return Math.round(val) + "%"
        }
    },
    tooltip: {
        y: {
            formatter: function (val, opts) {
                return val + " sesi"
            }
        }
    }
};

const courseDistributionPieData = sessionStatistics.courseDistribution.map(item => item.sessions);

const SessionManagement = () => {
    const [activeTab, setActiveTab] = useState("overview");
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [courseFilter, setCourseFilter] = useState("");
    const [sortBy, setSortBy] = useState("date");
    const [sortOrder, setSortOrder] = useState("desc");

    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: "ease-in-out",
            once: true,
        });
    }, []);

    // Filter sessions based on search and filters
    const filteredSessions = allSessions.filter(session => {
        const matchesSearch = session.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
            session.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
            session.room.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "" || session.status === statusFilter;
        const matchesCourse = courseFilter === "" || session.course === courseFilter;
        return matchesSearch && matchesStatus && matchesCourse;
    });

    // Sort sessions
    const sortedSessions = [...filteredSessions].sort((a, b) => {
        let aValue = a[sortBy];
        let bValue = b[sortBy];

        if (sortBy === "date") {
            aValue = new Date(aValue);
            bValue = new Date(bValue);
        }

        if (typeof aValue === "string") {
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
        }

        if (sortOrder === "asc") {
            return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
            return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
    });

    const getStatusColor = (status) => {
        switch (status) {
            case "scheduled": return "bg-blue-100 text-blue-800";
            case "completed": return "bg-green-100 text-green-800";
            case "cancelled": return "bg-red-100 text-red-800";
            case "ongoing": return "bg-yellow-100 text-yellow-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case "scheduled": return "Dijadwalkan";
            case "completed": return "Selesai";
            case "cancelled": return "Dibatalkan";
            case "ongoing": return "Berlangsung";
            default: return status;
        }
    }; const formatDate = (dateString) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    const getTimeAgo = (dateString) => {
        const now = new Date();
        const past = new Date(dateString);
        const diffInDays = Math.floor((now - past) / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) return "Hari ini";
        if (diffInDays === 1) return "Kemarin";
        if (diffInDays < 7) return `${diffInDays} hari yang lalu`;

        return formatDate(dateString);
    };

    return (
        <div className="mt-3">
            <div className="mb-5" data-aos="fade-down">
                <h1 className="text-3xl font-bold text-navy-700 dark:text-white">
                    Manajemen Sesi
                </h1>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Kelola dan jadwalkan sesi perkuliahan dengan analisis mendalam
                </p>
            </div>

            {/* Tab Navigation */}
            <div className="mb-6" data-aos="fade-up">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setActiveTab("overview")}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === "overview"
                                    ? "border-indigo-500 text-indigo-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                        >
                            <MdInsights className="inline-block mr-2 h-5 w-5" />
                            Overview
                        </button>
                        <button
                            onClick={() => setActiveTab("active")}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === "active"
                                    ? "border-indigo-500 text-indigo-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                        >
                            <MdPresentToAll className="inline-block mr-2 h-5 w-5" />
                            Sesi Aktif
                        </button>
                        <button
                            onClick={() => setActiveTab("history")}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === "history"
                                    ? "border-indigo-500 text-indigo-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                        >
                            <MdHistory className="inline-block mr-2 h-5 w-5" />
                            Riwayat Sesi
                        </button>
                        <button
                            onClick={() => setActiveTab("analytics")}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === "analytics"
                                    ? "border-indigo-500 text-indigo-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                        >
                            <MdBarChart className="inline-block mr-2 h-5 w-5" />
                            Analisis
                        </button>
                    </nav>
                </div>
            </div>

            {/* Overview Tab Content */}
            {activeTab === "overview" && (
                <div>
                    {/* Stats Cards */}
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

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
                        <Card extra="p-5 lg:col-span-2" data-aos="fade-up">
                            <div className="mb-4 flex items-center justify-between">
                                <h4 className="text-lg font-bold text-navy-700 dark:text-white">
                                    Sesi Mendatang
                                </h4>
                                <button
                                    onClick={() => setActiveTab("active")}
                                    className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
                                >
                                    Lihat Semua <MdArrowForward className="ml-1" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {upcomingSessions.slice(0, 3).map((session) => (
                                    <div key={session.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200">
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
                                                    <span className="text-xs text-gray-500 flex items-center">
                                                        <MdGroup className="mr-1" /> {session.expectedStudents} mahasiswa
                                                    </span>
                                                </div>
                                            </div>
                                            <button className="mt-3 md:mt-0 py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-xs md:text-sm">
                                                Kelola Sesi
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 flex justify-center">
                                <button className="py-2 px-4 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors flex items-center">
                                    <MdAdd className="mr-2" /> Buat Sesi Baru
                                </button>
                            </div>
                        </Card>

                        <Card extra="p-5" data-aos="fade-up" data-aos-delay="100">
                            <div className="mb-4">
                                <h4 className="text-lg font-bold text-navy-700 dark:text-white">
                                    Distribusi Mata Kuliah
                                </h4>
                            </div>

                            <div className="h-48 mb-4">
                                <PieChart
                                    options={courseDistributionPieOptions}
                                    series={courseDistributionPieData}
                                />
                            </div>
                        </Card>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                        <button
                            onClick={() => setActiveTab("active")}
                            data-aos="fade-up"
                            data-aos-delay="200"
                            className="text-left"
                        >
                            <Card extra="p-5 cursor-pointer hover:border-indigo-200 hover:shadow-md transition-all duration-200 h-full">
                                <div className="flex items-center">
                                    <div className="rounded-full bg-indigo-100 p-3 mr-4">
                                        <MdPresentToAll className="h-6 w-6 text-indigo-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold mb-1">Sesi Aktif</h3>
                                        <p className="text-sm text-gray-600">
                                            {sessionStats.activeSessions} sesi berlangsung
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </button>

                        <button
                            onClick={() => setActiveTab("history")}
                            data-aos="fade-up"
                            data-aos-delay="300"
                            className="text-left"
                        >
                            <Card extra="p-5 cursor-pointer hover:border-indigo-200 hover:shadow-md transition-all duration-200 h-full">
                                <div className="flex items-center">
                                    <div className="rounded-full bg-blue-100 p-3 mr-4">
                                        <MdAssessment className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold mb-1">Riwayat Sesi</h3>
                                        <p className="text-sm text-gray-600">
                                            {sessionStats.completedSessions} sesi selesai
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </button>

                        <button
                            onClick={() => setActiveTab("analytics")}
                            data-aos="fade-up"
                            data-aos-delay="400"
                            className="text-left"
                        >
                            <Card extra="p-5 cursor-pointer hover:border-indigo-200 hover:shadow-md transition-all duration-200 h-full">
                                <div className="flex items-center">
                                    <div className="rounded-full bg-green-100 p-3 mr-4">
                                        <MdBarChart className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold mb-1">Analisis</h3>
                                        <p className="text-sm text-gray-600">
                                            Statistik dan laporan
                                        </p>
                                    </div>
                                </div>
                            </Card>                        </button>
                    </div>
                </div>
            )}

            {/* Active Sessions Tab Content */}
            {activeTab === "active" && (
                <div>
                    {/* Search and Filter Controls */}
                    <Card extra="p-4 mb-5" data-aos="fade-up">
                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                            <div className="flex-1 flex gap-4 items-center">
                                <div className="relative flex-1 max-w-md">
                                    <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <input
                                        type="text"
                                        placeholder="Cari sesi, mata kuliah, atau ruangan..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                >
                                    <option value="">Semua Status</option>
                                    <option value="scheduled">Dijadwalkan</option>
                                    <option value="ongoing">Berlangsung</option>
                                    <option value="completed">Selesai</option>
                                </select>
                            </div>
                            <button className="py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center">
                                <MdAdd className="mr-2" /> Buat Sesi Baru
                            </button>
                        </div>
                    </Card>

                    {/* Active Sessions List */}
                    <Card extra="p-4" data-aos="fade-up" data-aos-delay="200">
                        <div className="mb-4 flex items-center justify-between">
                            <h4 className="text-lg font-bold text-navy-700 dark:text-white flex items-center">
                                <MdPresentToAll className="mr-2 h-5 w-5" />
                                Sesi Aktif ({sortedSessions.filter(s => s.status === "scheduled" || s.status === "ongoing").length})
                            </h4>
                        </div>

                        <div className="space-y-4">
                            {sortedSessions.filter(session => session.status === "scheduled" || session.status === "ongoing").map((session) => (
                                <div key={session.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200">
                                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center">
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <h5 className="text-base font-medium text-gray-900">{session.course}</h5>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                                                    {getStatusLabel(session.status)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-2">{session.topic}</p>
                                            <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                                                <span className="flex items-center">
                                                    <MdCalendarToday className="mr-1" /> {formatDate(session.date)}
                                                </span>
                                                <span className="flex items-center">
                                                    <MdTimer className="mr-1" /> {session.time}
                                                </span>
                                                <span className="flex items-center">
                                                    <MdEventNote className="mr-1" /> {session.room}
                                                </span>
                                                <span className="flex items-center">
                                                    <MdGroup className="mr-1" /> {session.expectedStudents} mahasiswa
                                                </span>
                                            </div>
                                        </div>
                                        <div className="mt-3 lg:mt-0 lg:ml-4 flex space-x-2">
                                            <button className="py-2 px-3 bg-indigo-600 text-white rounded text-xs hover:bg-indigo-700">
                                                Kelola
                                            </button>
                                            <button className="py-2 px-3 bg-green-600 text-white rounded text-xs hover:bg-green-700">
                                                Mulai
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {sortedSessions.filter(s => s.status === "scheduled" || s.status === "ongoing").length === 0 && (
                            <div className="text-center py-8">
                                <MdPresentToAll className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                                <h3 className="text-lg text-gray-500 font-medium">Tidak ada sesi aktif</h3>
                            </div>
                        )}
                    </Card>
                </div>
            )}

            {/* History Tab Content */}
            {activeTab === "history" && (
                <div>
                    {/* Search and Filter Controls */}
                    <Card extra="p-4 mb-5" data-aos="fade-up">
                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                            <div className="flex-1 flex gap-4 items-center">
                                <div className="relative flex-1 max-w-md">
                                    <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <input
                                        type="text"
                                        placeholder="Cari riwayat sesi..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>
                                <select
                                    value={courseFilter}
                                    onChange={(e) => setCourseFilter(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                >
                                    <option value="">Semua Mata Kuliah</option>
                                    {Array.from(new Set(allSessions.map(s => s.course))).map(course => (
                                        <option key={course} value={course}>{course}</option>
                                    ))}
                                </select>
                            </div>
                            <button className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center">
                                <MdDownload className="mr-1" /> Export Riwayat
                            </button>
                        </div>
                    </Card>

                    {/* History Table */}
                    <Card extra="p-4" data-aos="fade-up" data-aos-delay="200">
                        <div className="mb-4 flex items-center justify-between">
                            <h4 className="text-lg font-bold text-navy-700 dark:text-white flex items-center">
                                <MdHistory className="mr-2 h-5 w-5" />
                                Riwayat Sesi ({sortedSessions.filter(s => s.status === "completed" || s.status === "cancelled").length})
                            </h4>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500">Mata Kuliah</th>
                                        <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500">Topik</th>
                                        <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500">Tanggal</th>
                                        <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500">Waktu</th>
                                        <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500">Ruangan</th>
                                        <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500">Kehadiran</th>
                                        <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedSessions.filter(session => session.status === "completed" || session.status === "cancelled").map((session) => (
                                        <tr key={session.id} className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="py-3 px-4">
                                                <div className="text-sm font-medium text-gray-900">{session.course}</div>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-500">{session.topic}</td>
                                            <td className="py-3 px-4 text-sm text-gray-500">{getTimeAgo(session.date)}</td>
                                            <td className="py-3 px-4 text-sm text-gray-500">{session.time}</td>
                                            <td className="py-3 px-4 text-sm text-gray-500">{session.room}</td>
                                            <td className="py-3 px-4">
                                                {session.status === "completed" ? (
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {session.studentsPresent}/{session.totalStudents}
                                                        </div>
                                                        <div className="text-xs text-gray-500">{session.attendanceRate}%</div>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-gray-400">-</span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                                                    {getStatusLabel(session.status)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            )}

            {/* Analytics Tab Content */}
            {activeTab === "analytics" && (
                <div>
                    {/* Analytics Header */}
                    <Card extra="p-5 mb-5" data-aos="fade-up">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-bold text-navy-700 dark:text-white flex items-center">
                                <MdBarChart className="mr-2 h-5 w-5" />
                                Analisis Sesi Perkuliahan
                            </h4>
                            <button className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center">
                                <MdDownload className="mr-1" /> Export Laporan
                            </button>
                        </div>

                        {/* Summary Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center p-3 bg-blue-50 rounded-lg">
                                <div className="text-2xl font-bold text-blue-700">{sessionStats.totalSessions}</div>
                                <div className="text-xs text-blue-600">Total Sesi</div>
                            </div>
                            <div className="text-center p-3 bg-green-50 rounded-lg">
                                <div className="text-2xl font-bold text-green-700">{sessionStats.completedSessions}</div>
                                <div className="text-xs text-green-600">Sesi Selesai</div>
                            </div>
                            <div className="text-center p-3 bg-yellow-50 rounded-lg">
                                <div className="text-2xl font-bold text-yellow-700">{sessionStats.averageAttendance}%</div>
                                <div className="text-xs text-yellow-600">Rata-rata Kehadiran</div>
                            </div>
                            <div className="text-center p-3 bg-red-50 rounded-lg">
                                <div className="text-2xl font-bold text-red-700">{sessionStats.cancelledSessions}</div>
                                <div className="text-xs text-red-600">Sesi Dibatalkan</div>
                            </div>
                        </div>
                    </Card>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
                        {/* Weekly Sessions Chart */}
                        <Card extra="p-5" data-aos="fade-up" data-aos-delay="100">
                            <div className="mb-4">
                                <h4 className="text-lg font-bold text-navy-700 dark:text-white flex items-center">
                                    <MdShowChart className="mr-2 h-5 w-5" /> Tren Sesi Mingguan
                                </h4>
                            </div>

                            <div className="h-64">
                                <BarChart
                                    chartOptions={weeklySessionsChartOptions}
                                    chartData={weeklySessionsChartData}
                                />
                            </div>
                        </Card>

                        {/* Attendance Pattern Chart */}
                        <Card extra="p-5" data-aos="fade-up" data-aos-delay="200">
                            <div className="mb-4">
                                <h4 className="text-lg font-bold text-navy-700 dark:text-white flex items-center">
                                    <MdTrendingUp className="mr-2 h-5 w-5" /> Pola Kehadiran Harian
                                </h4>
                            </div>

                            <div className="h-64">
                                <LineChart
                                    options={attendancePatternLineOptions}
                                    series={attendancePatternLineData}
                                />
                            </div>
                        </Card>
                    </div>

                    {/* Course Performance Table */}
                    <Card extra="p-5" data-aos="fade-up" data-aos-delay="300">
                        <div className="mb-4">
                            <h4 className="text-lg font-bold text-navy-700 dark:text-white flex items-center">
                                <MdSchool className="mr-2 h-5 w-5" /> Performa Mata Kuliah
                            </h4>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500">Mata Kuliah</th>
                                        <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500">Total Sesi</th>
                                        <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500">Rata-rata Kehadiran</th>
                                        <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500">Performa</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sessionStatistics.courseDistribution.map((course, index) => (
                                        <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="py-3 px-4">
                                                <div className="text-sm font-medium text-gray-900">{course.course}</div>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-500">{course.sessions}</td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center">
                                                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                                        <div
                                                            className="bg-indigo-600 h-2 rounded-full"
                                                            style={{ width: `${course.avgAttendance}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-900">{course.avgAttendance}%</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${course.avgAttendance >= 90 ? 'bg-green-100 text-green-800' :
                                                        course.avgAttendance >= 80 ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-red-100 text-red-800'
                                                    }`}>
                                                    {course.avgAttendance >= 90 ? 'Sangat Baik' :
                                                        course.avgAttendance >= 80 ? 'Baik' : 'Perlu Perhatian'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default SessionManagement;
