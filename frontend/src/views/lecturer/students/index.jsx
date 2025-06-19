import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import Card from "components/card";
import PieChart from "components/charts/PieChart";
import BarChart from "components/charts/BarChart";
import LineChart from "components/charts/LineChart";
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
    MdArrowForward,
    MdSearch,
    MdFilterList,
    MdSort,
    MdEmail,
    MdPhone,
    MdSchool,
    MdCalendarToday,
    MdAccessTime,
    MdPieChart,
    MdShowChart,
    MdAssessment,
    MdInsights
} from "react-icons/md";

// Dummy Data
const totalStats = {
    totalStudents: 137,
    activeStudents: 134,
    inactiveStudents: 3,
    highAttendance: 98,      // ≥90%
    mediumAttendance: 32,    // 75-89%
    lowAttendance: 7,        // ≤75%
    averageAttendance: 88.5
};

// Additional attendance metrics
const attendanceMetrics = {
    totalSessions: 64,
    completedSessions: 58,
    totalAttendanceRecords: 7952,
    presentCount: 7023,
    absentCount: 929,
    sickLeave: 412,
    permissionLeave: 338,
    unauthorizedAbsent: 179,
    attendancePercentage: 88.3,
    improvementFromPrevious: 2.1
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

// Comprehensive student data
const allStudents = [
    { id: 1, nim: "20210001", name: "Budi Santoso", email: "budi.santoso@email.com", phone: "08123456789", attendanceRate: 95, totalSessions: 16, present: 15, absent: 1, course: "Algoritma dan Pemrograman", status: "aktif" },
    { id: 2, nim: "20210002", name: "Siti Nuraini", email: "siti.nuraini@email.com", phone: "08123456790", attendanceRate: 82, totalSessions: 16, present: 13, absent: 3, course: "Kecerdasan Buatan", status: "aktif" },
    { id: 3, nim: "20210003", name: "Ahmad Rizki", email: "ahmad.rizki@email.com", phone: "08123456791", attendanceRate: 72, totalSessions: 16, present: 11, absent: 5, course: "Pemrograman Web", status: "perhatian" },
    { id: 4, nim: "20210004", name: "Dewi Lestari", email: "dewi.lestari@email.com", phone: "08123456792", attendanceRate: 92, totalSessions: 16, present: 14, absent: 2, course: "Basis Data", status: "aktif" },
    { id: 5, nim: "20210005", name: "Farhan Abdullah", email: "farhan.abdullah@email.com", phone: "08123456793", attendanceRate: 78, totalSessions: 16, present: 12, absent: 4, course: "Basis Data", status: "perhatian" },
    { id: 6, nim: "20210006", name: "Anisa Wulandari", email: "anisa.wulandari@email.com", phone: "08123456794", attendanceRate: 89, totalSessions: 16, present: 14, absent: 2, course: "Algoritma dan Pemrograman", status: "aktif" },
    { id: 7, nim: "20210007", name: "Dimas Pratama", email: "dimas.pratama@email.com", phone: "08123456795", attendanceRate: 74, totalSessions: 16, present: 11, absent: 5, course: "Algoritma dan Pemrograman", status: "kritis" },
    { id: 8, nim: "20210008", name: "Ratna Sari", email: "ratna.sari@email.com", phone: "08123456796", attendanceRate: 96, totalSessions: 16, present: 15, absent: 1, course: "Pemrograman Web", status: "aktif" },
    { id: 9, nim: "20210009", name: "Eko Prasetyo", email: "eko.prasetyo@email.com", phone: "08123456797", attendanceRate: 85, totalSessions: 16, present: 13, absent: 3, course: "Kecerdasan Buatan", status: "aktif" },
    { id: 10, nim: "20210010", name: "Maya Sari", email: "maya.sari@email.com", phone: "08123456798", attendanceRate: 91, totalSessions: 16, present: 14, absent: 2, course: "Basis Data", status: "aktif" },
];

// Attendance statistics by time period
const attendanceStats = {
    weekly: [
        { week: "Minggu 1", present: 95, absent: 5, sick: 3, permission: 2 },
        { week: "Minggu 2", present: 92, absent: 8, sick: 4, permission: 4 },
        { week: "Minggu 3", present: 89, absent: 11, sick: 6, permission: 5 },
        { week: "Minggu 4", present: 93, absent: 7, sick: 3, permission: 4 },
        { week: "Minggu 5", present: 87, absent: 13, sick: 8, permission: 5 },
        { week: "Minggu 6", present: 91, absent: 9, sick: 5, permission: 4 },
        { week: "Minggu 7", present: 88, absent: 12, sick: 7, permission: 5 },
        { week: "Minggu 8", present: 94, absent: 6, sick: 2, permission: 4 },
    ],
    daily: [
        { day: "Senin", attendanceRate: 92 },
        { day: "Selasa", attendanceRate: 87 },
        { day: "Rabu", attendanceRate: 85 },
        { day: "Kamis", attendanceRate: 90 },
        { day: "Jumat", attendanceRate: 84 },
    ]
};

// Chart configurations for attendance visualization
const attendanceDistributionChartOptions = {
    chart: {
        type: 'pie',
        height: 300,
        animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 800
        }
    },
    labels: ['Kehadiran Tinggi (≥90%)', 'Kehadiran Sedang (75-89%)', 'Kehadiran Rendah (≤75%)'],
    series: [totalStats.highAttendance, totalStats.mediumAttendance, totalStats.lowAttendance],
    colors: ['#10B981', '#F59E0B', '#EF4444'],
    legend: {
        position: 'bottom',
        fontSize: '13px',
        fontWeight: 500,
        markers: {
            width: 12,
            height: 12
        }
    },
    dataLabels: {
        enabled: true,
        formatter: function (val, opts) {
            const value = opts.w.config.series[opts.seriesIndex];
            const percentage = ((value / totalStats.totalStudents) * 100).toFixed(1);
            return value + ' (' + percentage + '%)';
        },
        style: {
            fontSize: '12px',
            fontWeight: 'bold'
        }
    },
    tooltip: {
        y: {
            formatter: function (val) {
                const percentage = ((val / totalStats.totalStudents) * 100).toFixed(1);
                return val + " mahasiswa (" + percentage + "%)";
            }
        }
    },
    plotOptions: {
        pie: {
            donut: {
                size: '0%'
            }
        }
    }
};

const weeklyAttendanceChartOptions = {
    chart: {
        type: 'line',
        height: 350,
        toolbar: {
            show: true,
            tools: {
                download: true,
                selection: true,
                zoom: true,
                zoomin: true,
                zoomout: true,
                pan: true,
                reset: true
            }
        },
        animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 800
        }
    },
    series: [
        {
            name: 'Hadir',
            data: attendanceStats.weekly.map(w => w.present),
            color: '#10B981'
        },
        {
            name: 'Tidak Hadir',
            data: attendanceStats.weekly.map(w => w.absent),
            color: '#EF4444'
        },
        {
            name: 'Sakit',
            data: attendanceStats.weekly.map(w => w.sick),
            color: '#F59E0B'
        },
        {
            name: 'Izin',
            data: attendanceStats.weekly.map(w => w.permission),
            color: '#8B5CF6'
        }
    ],
    xaxis: {
        categories: attendanceStats.weekly.map(w => w.week),
        labels: {
            style: {
                colors: '#64748B',
                fontSize: '12px',
                fontWeight: 500
            }
        },
        title: {
            text: 'Periode Mingguan',
            style: {
                fontSize: '13px',
                fontWeight: 600,
                color: '#374151'
            }
        }
    },
    yaxis: {
        labels: {
            style: {
                colors: '#64748B',
                fontSize: '12px'
            },
            formatter: function (val) {
                return Math.round(val) + ' mahasiswa';
            }
        },
        title: {
            text: 'Jumlah Mahasiswa',
            style: {
                fontSize: '13px',
                fontWeight: 600,
                color: '#374151'
            }
        }
    },
    stroke: {
        curve: 'smooth',
        width: 3
    },
    markers: {
        size: 5,
        hover: {
            size: 7
        }
    },
    grid: {
        borderColor: '#E2E8F0',
        strokeDashArray: 3
    },
    legend: {
        position: 'top',
        fontSize: '13px',
        fontWeight: 500,
        markers: {
            width: 12,
            height: 12
        }
    },
    tooltip: {
        y: {
            formatter: function (val) {
                return val + " mahasiswa";
            }
        }
    }
};

const dailyAttendanceChartOptions = {
    chart: {
        type: 'bar',
        height: 320,
        toolbar: {
            show: false
        },
        animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 800
        }
    },
    series: [{
        name: 'Tingkat Kehadiran',
        data: attendanceStats.daily.map(d => d.attendanceRate),
        color: '#3B82F6'
    }],
    xaxis: {
        categories: attendanceStats.daily.map(d => d.day),
        labels: {
            style: {
                colors: '#64748B',
                fontSize: '12px',
                fontWeight: 500
            }
        },
        title: {
            text: 'Hari dalam Seminggu',
            style: {
                fontSize: '13px',
                fontWeight: 600,
                color: '#374151'
            }
        }
    },
    yaxis: {
        labels: {
            style: {
                colors: '#64748B',
                fontSize: '12px'
            },
            formatter: function (val) {
                return val + "%";
            }
        },
        min: 75,
        max: 100,
        title: {
            text: 'Persentase Kehadiran',
            style: {
                fontSize: '13px',
                fontWeight: 600,
                color: '#374151'
            }
        }
    },
    dataLabels: {
        enabled: true,
        formatter: function (val) {
            return val + "%";
        },
        style: {
            colors: ['#FFFFFF'],
            fontSize: '12px',
            fontWeight: 'bold'
        }
    },
    grid: {
        borderColor: '#E2E8F0',
        strokeDashArray: 3
    },
    plotOptions: {
        bar: {
            borderRadius: 6,
            columnWidth: '65%',
            distributed: false
        }
    },
    tooltip: {
        y: {
            formatter: function (val) {
                return val + "% kehadiran";
            }
        }
    }
};

const courseAttendanceChartOptions = {
    chart: {
        type: 'bar',
        height: 380,
        toolbar: {
            show: true,
            tools: {
                download: true
            }
        },
        animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 800
        }
    },
    series: [{
        name: 'Tingkat Kehadiran',
        data: courseStats.map(c => c.attendanceRate),
        color: '#8B5CF6'
    }, {
        name: 'Jumlah Mahasiswa',
        data: courseStats.map(c => c.students),
        color: '#06B6D4'
    }],
    xaxis: {
        categories: courseStats.map(c => c.course.length > 15 ? c.course.substring(0, 15) + '...' : c.course),
        labels: {
            style: {
                colors: '#64748B',
                fontSize: '11px',
                fontWeight: 500
            },
            rotate: -45
        },
        title: {
            text: 'Mata Kuliah',
            style: {
                fontSize: '13px',
                fontWeight: 600,
                color: '#374151'
            }
        }
    },
    yaxis: [{
        title: {
            text: 'Persentase Kehadiran (%)',
            style: {
                fontSize: '13px',
                fontWeight: 600,
                color: '#374151'
            }
        },
        labels: {
            style: {
                colors: '#64748B',
                fontSize: '12px'
            },
            formatter: function (val) {
                return val + "%";
            }
        },
        min: 70,
        max: 100
    }, {
        opposite: true,
        title: {
            text: 'Jumlah Mahasiswa',
            style: {
                fontSize: '13px',
                fontWeight: 600,
                color: '#374151'
            }
        },
        labels: {
            style: {
                colors: '#64748B',
                fontSize: '12px'
            }
        }
    }],
    dataLabels: {
        enabled: true,
        formatter: function (val, opts) {
            if (opts.seriesIndex === 0) {
                return val + "%";
            } else {
                return val + " mhs";
            }
        },
        style: {
            colors: ['#FFFFFF'],
            fontSize: '11px',
            fontWeight: 'bold'
        }
    },
    grid: {
        borderColor: '#E2E8F0',
        strokeDashArray: 3
    },
    plotOptions: {
        bar: {
            borderRadius: 4,
            columnWidth: '75%'
        }
    },
    legend: {
        position: 'top',
        fontSize: '13px',
        fontWeight: 500
    },
    tooltip: {
        y: {
            formatter: function (val, opts) {
                if (opts.seriesIndex === 0) {
                    return val + "% tingkat kehadiran";
                } else {
                    return val + " mahasiswa";
                }
            }
        }
    }
};

const StudentPerformance = () => {
    const [activeTab, setActiveTab] = React.useState("overview");
    const [searchTerm, setSearchTerm] = React.useState("");
    const [selectedCourse, setSelectedCourse] = React.useState("");
    const [sortBy, setSortBy] = React.useState("name");
    const [sortOrder, setSortOrder] = React.useState("asc");

    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: "ease-in-out",
            once: true,
        });
    }, []);

    // Filter students based on search and course
    const filteredStudents = allStudents.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.nim.includes(searchTerm);
        const matchesCourse = selectedCourse === "" || student.course === selectedCourse;
        return matchesSearch && matchesCourse;
    });

    // Sort students
    const sortedStudents = [...filteredStudents].sort((a, b) => {
        let aValue = a[sortBy];
        let bValue = b[sortBy];

        if (sortBy === "attendanceRate") {
            return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
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
            case "aktif": return "bg-green-100 text-green-800";
            case "perhatian": return "bg-yellow-100 text-yellow-800";
            case "kritis": return "bg-red-100 text-red-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    const getAttendanceColor = (rate) => {
        if (rate >= 90) return "text-green-600";
        if (rate >= 80) return "text-yellow-600";
        return "text-red-600";
    }; return (
        <div className="mt-3">
            <div className="mb-5" data-aos="fade-down">
                <h1 className="text-3xl font-bold text-navy-700 dark:text-white">
                    Performa Mahasiswa
                </h1>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Overview performa kehadiran mahasiswa di semua mata kuliah
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
                            <MdBarChart className="inline mr-2" />
                            Overview
                        </button>
                        <button
                            onClick={() => setActiveTab("students")}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === "students"
                                ? "border-indigo-500 text-indigo-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                        >
                            <MdGroups className="inline mr-2" />
                            Daftar Mahasiswa
                        </button>
                        <button
                            onClick={() => setActiveTab("statistics")}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === "statistics"
                                ? "border-indigo-500 text-indigo-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                        >
                            <MdShowChart className="inline mr-2" />
                            Statistik Kehadiran
                        </button>
                    </nav>
                </div>
            </div>            {/* Overview Tab Content */}
            {activeTab === "overview" && (
                <div>
                    {/* Stats Cards */}
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
                                <button
                                    onClick={() => setActiveTab("students")}
                                    className="flex items-center text-sm text-indigo-600 hover:text-indigo-800"
                                >
                                    Lihat Detail
                                </button>
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
                                    Kirim Notifikasi                        </button>
                            </div>
                        </Card>
                    </div>

                    {/* Course Stats and Low Attendance Students */}
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
                                <button
                                    onClick={() => setActiveTab("students")}
                                    className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
                                >
                                    Semua <MdArrowForward className="ml-1" />
                                </button>
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
                </div>
            )}

            {/* Students List Tab Content */}
            {activeTab === "students" && (
                <div>
                    {/* Search and Filter Controls */}
                    <Card extra="p-4 mb-5" data-aos="fade-up">
                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                            <div className="flex-1 flex gap-4 items-center">
                                <div className="relative flex-1 max-w-md">
                                    <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <input
                                        type="text"
                                        placeholder="Cari nama atau NIM..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>
                                <select
                                    value={selectedCourse}
                                    onChange={(e) => setSelectedCourse(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                >
                                    <option value="">Semua Mata Kuliah</option>
                                    {courseStats.map((course) => (
                                        <option key={course.id} value={course.course}>
                                            {course.course}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex gap-2 items-center">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                >
                                    <option value="name">Nama</option>
                                    <option value="nim">NIM</option>
                                    <option value="attendanceRate">Kehadiran</option>
                                    <option value="course">Mata Kuliah</option>
                                </select>
                                <button
                                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    <MdSort className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </Card>

                    {/* Students Table */}
                    <Card extra="p-4" data-aos="fade-up" data-aos-delay="200">
                        <div className="mb-4 flex items-center justify-between">
                            <h4 className="text-lg font-bold text-navy-700 dark:text-white flex items-center">
                                <MdGroups className="mr-2 h-5 w-5" />
                                Daftar Mahasiswa ({sortedStudents.length})
                            </h4>
                            <button className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center">
                                <MdDownload className="mr-1" /> Export Data
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500">Mahasiswa</th>
                                        <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500">Mata Kuliah</th>
                                        <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500">Kehadiran</th>
                                        <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500">Sesi</th>
                                        <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500">Status</th>
                                        <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500">Kontak</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedStudents.map((student) => (
                                        <tr key={student.id} className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="py-3 px-4">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                                    <div className="text-sm text-gray-500">{student.nim}</div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-500">{student.course}</td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center">
                                                    <span className={`text-sm font-medium ${getAttendanceColor(student.attendanceRate)}`}>
                                                        {student.attendanceRate}%
                                                    </span>
                                                    <div className="w-20 h-1.5 bg-gray-200 rounded-full ml-2">
                                                        <div
                                                            className={`h-1.5 rounded-full ${student.attendanceRate >= 90
                                                                ? "bg-green-500"
                                                                : student.attendanceRate >= 80
                                                                    ? "bg-yellow-500"
                                                                    : "bg-red-500"
                                                                }`}
                                                            style={{ width: `${student.attendanceRate}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-500">
                                                {student.present}/{student.totalSessions}
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                                                    {student.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex gap-2">
                                                    <button className="text-indigo-600 hover:text-indigo-800" title="Email">
                                                        <MdEmail className="h-4 w-4" />
                                                    </button>
                                                    <button className="text-green-600 hover:text-green-800" title="WhatsApp">
                                                        <MdPhone className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {sortedStudents.length === 0 && (
                            <div className="text-center py-8">
                                <MdPerson className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada mahasiswa ditemukan</h3>
                                <p className="mt-1 text-sm text-gray-500">Coba ubah filter pencarian Anda.</p>
                            </div>
                        )}
                    </Card>
                </div>
            )}            {/* Statistics Tab Content */}
            {activeTab === "statistics" && (
                <div className="space-y-8">                    {/* Header Section */}
                    <div className="text-center mb-5" data-aos="fade-down">
                        <h2 className="text-2xl font-bold text-navy-700 dark:text-white mb-2">
                            Statistik Kehadiran Mahasiswa
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Analisis komprehensif tingkat kehadiran dan performa mahasiswa
                        </p>
                    </div>

                    {/* Main Statistics Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-5" data-aos="fade-up">
                        <Card extra="!flex flex-col items-center p-5" data-aos-delay="100">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                <MdTrendingUp className="h-8 w-8 text-green-500" />
                            </div>
                            <p className="mt-4 text-xl font-bold text-navy-700 dark:text-white">{totalStats.averageAttendance}%</p>
                            <p className="mt-1 text-sm text-gray-600">Rata-rata Kehadiran</p>
                            <div className="mt-3 flex items-center text-xs text-green-600">
                                <MdTrendingUp className="mr-1 h-3 w-3" />
                                <span>+{attendanceMetrics.improvementFromPrevious}% dari bulan lalu</span>
                            </div>
                        </Card>

                        <Card extra="!flex flex-col items-center p-5" data-aos-delay="200">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                                <MdGroups className="h-8 w-8 text-blue-500" />
                            </div>
                            <p className="mt-4 text-xl font-bold text-navy-700 dark:text-white">{totalStats.highAttendance}</p>
                            <p className="mt-1 text-sm text-gray-600">Kehadiran Tinggi (≥90%)</p>
                            <div className="mt-3 text-xs text-blue-600">
                                {((totalStats.highAttendance / totalStats.totalStudents) * 100).toFixed(1)}% dari total mahasiswa
                            </div>
                        </Card>

                        <Card extra="!flex flex-col items-center p-5" data-aos-delay="300">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
                                <MdWarning className="h-8 w-8 text-yellow-500" />
                            </div>
                            <p className="mt-4 text-xl font-bold text-navy-700 dark:text-white">{totalStats.mediumAttendance}</p>
                            <p className="mt-1 text-sm text-gray-600">Kehadiran Sedang (75-89%)</p>
                            <div className="mt-3 text-xs text-yellow-600">
                                {((totalStats.mediumAttendance / totalStats.totalStudents) * 100).toFixed(1)}% dari total mahasiswa
                            </div>
                        </Card>

                        <Card extra="!flex flex-col items-center p-5" data-aos-delay="400">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                                <MdCancel className="h-8 w-8 text-red-500" />
                            </div>
                            <p className="mt-4 text-xl font-bold text-navy-700 dark:text-white">{totalStats.lowAttendance}</p>
                            <p className="mt-1 text-sm text-gray-600">Kehadiran Rendah (≤75%)</p>
                            <div className="mt-3 text-xs text-red-600">
                                Perlu perhatian khusus
                            </div>
                        </Card>
                    </div>                    {/* Additional Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-5" data-aos="fade-up" data-aos-delay="200">
                        <Card extra="!flex flex-col p-5">
                            <div className="mb-3 flex justify-between">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                                    <MdCalendarToday className="h-6 w-6 text-indigo-500" />
                                </div>
                                <span className="text-xs text-gray-500">Total</span>
                            </div>
                            <h5 className="text-base font-medium text-navy-700 dark:text-white">Sesi Perkuliahan</h5>
                            <p className="text-xl font-bold text-indigo-600 mt-1">{attendanceMetrics.totalSessions}</p>
                            <p className="text-xs text-gray-600 mt-1">{attendanceMetrics.completedSessions} selesai</p>
                        </Card>

                        <Card extra="!flex flex-col p-5">
                            <div className="mb-3 flex justify-between">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                                    <MdCheckCircle className="h-6 w-6 text-emerald-500" />
                                </div>
                                <span className="text-xs text-gray-500">Hadir</span>
                            </div>
                            <h5 className="text-base font-medium text-navy-700 dark:text-white">Total Kehadiran</h5>
                            <p className="text-xl font-bold text-emerald-600 mt-1">{attendanceMetrics.presentCount.toLocaleString()}</p>
                            <p className="text-xs text-gray-600 mt-1">dari {attendanceMetrics.totalAttendanceRecords.toLocaleString()} record</p>
                        </Card>

                        <Card extra="!flex flex-col p-5">
                            <div className="mb-3 flex justify-between">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                                    <MdAccessTime className="h-6 w-6 text-orange-500" />
                                </div>
                                <span className="text-xs text-gray-500">Absen</span>
                            </div>
                            <h5 className="text-base font-medium text-navy-700 dark:text-white">Ketidakhadiran</h5>
                            <p className="text-xl font-bold text-orange-600 mt-1">{attendanceMetrics.absentCount}</p>
                            <p className="text-xs text-gray-600 mt-1">{attendanceMetrics.sickLeave} sakit, {attendanceMetrics.permissionLeave} izin</p>
                        </Card>

                        <Card extra="!flex flex-col p-5">
                            <div className="mb-3 flex justify-between">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                                    <MdAssessment className="h-6 w-6 text-purple-500" />
                                </div>
                                <span className="text-xs text-gray-500">Trend</span>
                            </div>
                            <h5 className="text-base font-medium text-navy-700 dark:text-white">Performa Bulanan</h5>
                            <p className="text-xl font-bold text-purple-600 mt-1">+{attendanceMetrics.improvementFromPrevious}%</p>
                            <p className="text-xs text-gray-600 mt-1">Peningkatan dari bulan lalu</p>
                        </Card>
                    </div>                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
                        {/* Attendance Distribution Pie Chart */}
                        <Card extra="p-5" data-aos="fade-up" data-aos-delay="100">
                            <div className="mb-4 flex items-center justify-between">
                                <h4 className="text-lg font-bold text-navy-700 dark:text-white flex items-center">
                                    <MdPieChart className="mr-2 h-5 w-5" /> Distribusi Kehadiran
                                </h4>
                                <button className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center">
                                    <MdDownload className="mr-1" /> Export
                                </button>
                            </div>
                            <PieChart
                                options={attendanceDistributionChartOptions}
                                series={attendanceDistributionChartOptions.series}
                            />
                        </Card>

                        {/* Daily Attendance Pattern Bar Chart */}
                        <Card extra="p-5" data-aos="fade-up" data-aos-delay="200">
                            <div className="mb-4 flex items-center justify-between">
                                <h4 className="text-lg font-bold text-navy-700 dark:text-white flex items-center">
                                    <MdBarChart className="mr-2 h-5 w-5" /> Pola Kehadiran Harian
                                </h4>
                                <button className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center">
                                    <MdDownload className="mr-1" /> Export
                                </button>
                            </div>
                            <BarChart
                                options={dailyAttendanceChartOptions}
                                series={dailyAttendanceChartOptions.series}
                            />
                        </Card>
                    </div>

                    {/* Weekly Attendance Trend Line Chart */}
                    <Card extra="p-5 mb-5" data-aos="fade-up" data-aos-delay="300">
                        <div className="mb-4 flex items-center justify-between">
                            <h4 className="text-lg font-bold text-navy-700 dark:text-white flex items-center">
                                <MdShowChart className="mr-2 h-5 w-5" /> Tren Kehadiran Mingguan
                            </h4>
                            <div className="flex space-x-2">
                                <button className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center">
                                    <MdFilterList className="mr-1" /> Filter
                                </button>
                                <button className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center">
                                    <MdDownload className="mr-1" /> Export
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            {attendanceStats.weekly.slice(-4).map((week, index) => (
                                <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                                    <div className="text-sm font-medium text-gray-600">{week.week}</div>
                                    <div className="text-xl font-bold text-navy-700 mt-1">{week.present}</div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {week.absent} tidak hadir
                                    </div>
                                </div>
                            ))}
                        </div>

                        <LineChart
                            options={weeklyAttendanceChartOptions}
                            series={weeklyAttendanceChartOptions.series}
                        />
                    </Card>

                    {/* Course-wise Attendance Comparison */}
                    <Card extra="p-5 mb-5" data-aos="fade-up" data-aos-delay="400">
                        <div className="mb-4 flex items-center justify-between">
                            <h4 className="text-lg font-bold text-navy-700 dark:text-white flex items-center">
                                <MdSchool className="mr-2 h-5 w-5" /> Perbandingan Kehadiran Per Mata Kuliah
                            </h4>
                            <button className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center">
                                <MdDownload className="mr-1" /> Export
                            </button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            {courseStats.map((course, index) => (
                                <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                                    <div className="text-xs font-medium text-gray-600 mb-1">
                                        {course.course.length > 15 ? course.course.substring(0, 15) + '...' : course.course}
                                    </div>
                                    <div className="text-lg font-bold text-navy-700">{course.attendanceRate}%</div>
                                    <div className="text-xs text-gray-500">{course.students} mahasiswa</div>
                                    {course.lowAttendanceCount > 0 && (
                                        <div className="text-xs text-red-500 mt-1">
                                            {course.lowAttendanceCount} perlu perhatian
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <BarChart
                            options={courseAttendanceChartOptions}
                            series={courseAttendanceChartOptions.series}
                        />
                    </Card>                    {/* Detailed Statistics */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
                        {/* Attendance Status Legend */}
                        <Card extra="p-5" data-aos="fade-up" data-aos-delay="500">
                            <div className="mb-4">
                                <h4 className="text-lg font-bold text-navy-700 dark:text-white flex items-center">
                                    <MdAssessment className="mr-2 h-5 w-5" /> Status Kehadiran
                                </h4>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                    <div className="flex items-center">
                                        <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                                        <span className="text-sm font-medium text-green-800">Kehadiran Tinggi (≥90%)</span>
                                    </div>
                                    <span className="text-sm font-bold text-green-800">{totalStats.highAttendance}</span>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                                    <div className="flex items-center">
                                        <div className="w-4 h-4 bg-yellow-500 rounded-full mr-3"></div>
                                        <span className="text-sm font-medium text-yellow-800">Kehadiran Sedang (75-89%)</span>
                                    </div>
                                    <span className="text-sm font-bold text-yellow-800">{totalStats.mediumAttendance}</span>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                                    <div className="flex items-center">
                                        <div className="w-4 h-4 bg-red-500 rounded-full mr-3"></div>
                                        <span className="text-sm font-medium text-red-800">Kehadiran Rendah (≤75%)</span>
                                    </div>
                                    <span className="text-sm font-bold text-red-800">{totalStats.lowAttendance}</span>
                                </div>
                            </div>
                        </Card>

                        {/* Weekly Summary */}
                        <Card extra="p-5" data-aos="fade-up" data-aos-delay="600">
                            <div className="mb-4">
                                <h4 className="text-lg font-bold text-navy-700 dark:text-white flex items-center">
                                    <MdCalendarToday className="mr-2 h-5 w-5" /> Ringkasan Mingguan
                                </h4>
                            </div>

                            <div className="space-y-3">
                                {attendanceStats.weekly.slice(-3).map((week, index) => (
                                    <div key={index} className="p-3 border border-gray-200 rounded-lg">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-medium text-gray-700">{week.week}</span>
                                            <span className="text-sm font-bold text-navy-700">{week.present} hadir</span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2 text-xs">
                                            <div className="text-center">
                                                <div className="text-red-600 font-medium">{week.absent}</div>
                                                <div className="text-gray-500">Tidak hadir</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-yellow-600 font-medium">{week.sick}</div>
                                                <div className="text-gray-500">Sakit</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-blue-600 font-medium">{week.permission}</div>
                                                <div className="text-gray-500">Izin</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Overall Performance */}
                        <Card extra="p-5" data-aos="fade-up" data-aos-delay="700">
                            <div className="mb-4">
                                <h4 className="text-lg font-bold text-navy-700 dark:text-white flex items-center">
                                    <MdInsights className="mr-2 h-5 w-5" /> Performa Keseluruhan
                                </h4>
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 bg-indigo-50 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-indigo-800">Rata-rata Kehadiran</span>
                                        <span className="text-xl font-bold text-indigo-900">88.5%</span>
                                    </div>
                                    <div className="w-full h-2 bg-indigo-200 rounded-full">
                                        <div className="h-2 bg-indigo-600 rounded-full" style={{ width: "88.5%" }}></div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="text-center p-3 bg-green-50 rounded-lg">
                                        <div className="text-lg font-bold text-green-700">{totalStats.activeStudents}</div>
                                        <div className="text-xs text-green-600">Mahasiswa Aktif</div>
                                    </div>
                                    <div className="text-center p-3 bg-red-50 rounded-lg">
                                        <div className="text-lg font-bold text-red-700">{totalStats.lowAttendance}</div>
                                        <div className="text-xs text-red-600">Perlu Perhatian</div>
                                    </div>
                                </div>                                <div className="mt-4">
                                    <button className="w-full py-2 px-4 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors flex items-center justify-center">
                                        <MdDownload className="mr-2" />
                                        Download Laporan
                                    </button>
                                </div>
                            </div>
                        </Card>
                    </div>                    {/* Advanced Analytics Section */}
                    <div className="mb-5" data-aos="fade-up" data-aos-delay="800">
                        <h3 className="text-xl font-bold text-navy-700 dark:text-white mb-5 flex items-center">
                            <MdInsights className="mr-3 h-6 w-6 text-indigo-600" />
                            Analisis Mendalam & Rekomendasi
                        </h3>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
                            {/* Attendance Trends Analysis */}
                            <Card extra="p-5">
                                <h4 className="text-lg font-semibold text-navy-700 dark:text-white mb-4 flex items-center">
                                    <MdTrendingUp className="mr-2 h-5 w-5 text-green-600" />
                                    Analisis Tren Kehadiran
                                </h4>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                                            <span className="text-sm font-medium text-green-800">Tren Positif</span>
                                        </div>
                                        <span className="text-sm font-bold text-green-800">+{attendanceMetrics.improvementFromPrevious}%</span>
                                    </div>

                                    <div className="text-sm text-gray-600 space-y-2">
                                        <p>• Minggu terakhir menunjukkan peningkatan kehadiran yang signifikan</p>
                                        <p>• Hari Senin dan Kamis memiliki tingkat kehadiran tertinggi</p>
                                        <p>• {totalStats.highAttendance} mahasiswa ({((totalStats.highAttendance / totalStats.totalStudents) * 100).toFixed(1)}%) menunjukkan konsistensi kehadiran yang baik</p>
                                        <p>• Tingkat kehadiran sakit menurun {Math.floor(Math.random() * 15) + 10}% dibandingkan periode sebelumnya</p>
                                    </div>
                                </div>
                            </Card>                            {/* Risk Assessment */}
                            <Card extra="p-5">
                                <h4 className="text-lg font-semibold text-navy-700 dark:text-white mb-4 flex items-center">
                                    <MdWarning className="mr-2 h-5 w-5 text-red-600" />
                                    Penilaian Risiko
                                </h4>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                                            <span className="text-sm font-medium text-red-800">Risiko Tinggi</span>
                                        </div>
                                        <span className="text-sm font-bold text-red-800">{totalStats.lowAttendance} mahasiswa</span>
                                    </div>

                                    <div className="text-sm text-gray-600 space-y-2">
                                        <p>• {Math.floor(totalStats.lowAttendance * 0.6)} mahasiswa memiliki kehadiran ≤70%</p>
                                        <p>• Pemrograman Web menunjukkan tingkat kehadiran terendah (85%)</p>
                                        <p>• {attendanceMetrics.unauthorizedAbsent} kasus ketidakhadiran tanpa keterangan</p>
                                        <p>• Diperlukan intervensi untuk {Math.ceil(totalStats.lowAttendance * 0.7)} mahasiswa</p>
                                    </div>
                                </div>
                            </Card>
                        </div>                        {/* Recommendations */}
                        <Card extra="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
                            <h4 className="text-lg font-semibold text-navy-700 dark:text-white mb-4 flex items-center">
                                <MdSchool className="mr-2 h-5 w-5 text-blue-600" />
                                Rekomendasi Tindakan
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h5 className="font-semibold text-green-700 mb-3 flex items-center">
                                        <MdCheckCircle className="mr-2 h-4 w-4" />
                                        Tindakan Positif
                                    </h5>
                                    <ul className="text-sm text-gray-600 space-y-2">
                                        <li>• Berikan apresiasi kepada {totalStats.highAttendance} mahasiswa berprestasi</li>
                                        <li>• Pertahankan metode pengajaran di mata kuliah Basis Data (93%)</li>
                                        <li>• Implementasikan sistem reward untuk kehadiran konsisten</li>
                                        <li>• Dokumentasikan best practices dari minggu dengan kehadiran tinggi</li>
                                    </ul>
                                </div>

                                <div>
                                    <h5 className="font-semibold text-red-700 mb-3 flex items-center">
                                        <MdWarning className="mr-2 h-4 w-4" />
                                        Tindakan Korektif
                                    </h5>
                                    <ul className="text-sm text-gray-600 space-y-2">
                                        <li>• Lakukan konseling individual untuk {totalStats.lowAttendance} mahasiswa berisiko</li>
                                        <li>• Evaluasi metode pengajaran mata kuliah Pemrograman Web</li>
                                        <li>• Implementasikan sistem early warning untuk kehadiran rendah</li>
                                        <li>• Hubungi orang tua/wali untuk mahasiswa dengan kehadiran ≤70%</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="mt-6 flex flex-wrap gap-3">
                                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                                    <MdDownload className="mr-2 h-4 w-4" />
                                    Download Laporan Lengkap
                                </button>
                                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center">
                                    <MdNotifications className="mr-2 h-4 w-4" />
                                    Kirim Notifikasi
                                </button>
                                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center">
                                    <MdAssessment className="mr-2 h-4 w-4" />
                                    Buat Assessment
                                </button>
                            </div>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentPerformance;
