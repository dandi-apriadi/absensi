import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import Card from "components/card";
import BarChart from "components/charts/BarChart";
import PieChart from "components/charts/PieChart";
import LineChart from "components/charts/LineChart";
import {
    MdPeople,
    MdClass,
    MdAssessment,
    MdArrowForward,
    MdWarning,
    MdAccessTime,
    MdTrendingUp,
    MdTrendingDown,
    MdCheckCircle,
    MdCancel,
    MdEventNote,
    MdBarChart,
    MdPieChart,
    MdShowChart,
    MdNotifications,
    MdTimer,
    MdSchool,
    MdGroup,
    MdCalendarToday,
    MdAutorenew,
    MdInsights,
    MdSick,
    MdInfo
} from "react-icons/md";

// Comprehensive Dashboard Data
const dashboardStats = {
    totalStudents: 137,
    activeCourses: 4,
    sessionsThisWeek: 12,
    completedSessions: 42,
    pendingLeaveRequests: 8,
    approvedLeaveRequests: 23,
    rejectedLeaveRequests: 5,
    averageAttendance: 86.5,
    highAttendanceStudents: 98,
    mediumAttendanceStudents: 32,
    lowAttendanceStudents: 7,
    todaySessions: 2,
    activeSessions: 1
};

const courses = [
    {
        id: 1,
        name: "Algoritma dan Pemrograman",
        totalStudents: 35,
        attendanceRate: 89,
        sessions: 12,
        lowAttendanceCount: 2,
        nextSession: "Senin, 08:00"
    },
    {
        id: 2,
        name: "Basis Data",
        totalStudents: 42,
        attendanceRate: 93,
        sessions: 10,
        lowAttendanceCount: 1,
        nextSession: "Selasa, 10:00"
    },
    {
        id: 3,
        name: "Pemrograman Web",
        totalStudents: 28,
        attendanceRate: 78,
        sessions: 8,
        lowAttendanceCount: 4,
        nextSession: "Rabu, 13:00"
    },
    {
        id: 4,
        name: "Kecerdasan Buatan",
        totalStudents: 32,
        attendanceRate: 85,
        sessions: 6,
        lowAttendanceCount: 3,
        nextSession: "Kamis, 15:00"
    },
];

const upcomingClasses = [
    {
        id: 1,
        course: "Algoritma dan Pemrograman",
        time: "08:00 - 09:40",
        room: "Lab 301",
        day: "Senin",
        date: "2023-10-30",
        expectedStudents: 35,
        type: "teori"
    },
    {
        id: 2,
        course: "Basis Data",
        time: "10:00 - 11:40",
        room: "Lab 302",
        day: "Selasa",
        date: "2023-10-31",
        expectedStudents: 42,
        type: "praktikum"
    },
    {
        id: 3,
        course: "Pemrograman Web",
        time: "13:00 - 14:40",
        room: "Lab 303",
        day: "Rabu",
        date: "2023-11-01",
        expectedStudents: 28,
        type: "praktikum"
    },
];

const recentActivities = [
    {
        id: 1,
        type: "attendance",
        message: "Sesi Algoritma dan Pemrograman selesai",
        detail: "32/35 mahasiswa hadir (91.4%)",
        time: "2 jam yang lalu",
        icon: MdCheckCircle,
        color: "text-green-600"
    },
    {
        id: 2,
        type: "leave_request",
        message: "Permintaan izin baru dari Budi Santoso",
        detail: "Sakit - Demam tinggi",
        time: "4 jam yang lalu",
        icon: MdSick,
        color: "text-yellow-600"
    },
    {
        id: 3,
        type: "session",
        message: "Sesi Basis Data dijadwalkan",
        detail: "Besok, 10:00 - 11:40 di Lab 302",
        time: "6 jam yang lalu",
        icon: MdEventNote,
        color: "text-blue-600"
    },
    {
        id: 4,
        type: "attendance",
        message: "Alert: Kehadiran rendah terdeteksi",
        detail: "5 mahasiswa dengan kehadiran < 75%",
        time: "1 hari yang lalu",
        icon: MdWarning,
        color: "text-red-600"
    }
];

const weeklyAttendanceData = [
    { day: "Sen", attendance: 88 },
    { day: "Sel", attendance: 92 },
    { day: "Rab", attendance: 85 },
    { day: "Kam", attendance: 89 },
    { day: "Jum", attendance: 83 }
];

const monthlySessionsData = [
    { month: "Jul", sessions: 18 },
    { month: "Agu", sessions: 22 },
    { month: "Sep", sessions: 20 },
    { month: "Okt", sessions: 16 }
];

// Chart Configurations
const attendanceWeeklyChartOptions = {
    chart: {
        type: 'line',
        toolbar: { show: false }
    },
    stroke: {
        curve: 'smooth',
        width: 3
    },
    colors: ['#3B82F6'],
    xaxis: {
        categories: weeklyAttendanceData.map(item => item.day),
        labels: {
            style: {
                colors: '#6B7280',
                fontSize: '12px'
            }
        }
    },
    yaxis: {
        min: 75,
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
        colors: ['#3B82F6'],
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

const attendanceWeeklyChartData = [
    {
        name: 'Tingkat Kehadiran',
        data: weeklyAttendanceData.map(item => item.attendance)
    }
];

const sessionsMonthlyChartOptions = {
    chart: {
        type: 'bar',
        toolbar: { show: false }
    },
    colors: ['#10B981'],
    plotOptions: {
        bar: {
            horizontal: false,
            columnWidth: '55%',
            endingShape: 'rounded'
        }
    },
    dataLabels: { enabled: false },
    xaxis: {
        categories: monthlySessionsData.map(item => item.month),
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
    }
};

const sessionsMonthlyChartData = [
    {
        name: 'Jumlah Sesi',
        data: monthlySessionsData.map(item => item.sessions)
    }
];

const attendanceDistributionPieOptions = {
    chart: { type: 'pie' },
    colors: ['#10B981', '#F59E0B', '#EF4444'],
    labels: ['Tinggi (≥85%)', 'Sedang (75-84%)', 'Rendah (<75%)'],
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
                return val + " mahasiswa"
            }
        }
    }
};

const attendanceDistributionPieData = [
    dashboardStats.highAttendanceStudents,
    dashboardStats.mediumAttendanceStudents,
    dashboardStats.lowAttendanceStudents
];

const LecturerDashboard = () => {
    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: "ease-in-out",
            once: true,
        });
    }, []); const formatDate = (dateString) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    return (
        <div className="mt-3">
            {/* Header */}
            <div className="mb-6" data-aos="fade-down">
                <h1 className="text-3xl font-bold text-navy-700 dark:text-white">
                    Dashboard Dosen
                </h1>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Selamat datang kembali, Dr. Ahmad Saputra - Ringkasan aktivitas perkuliahan Anda
                </p>
            </div>

            {/* Main Statistics Cards */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4 mb-6">
                <Card data-aos="zoom-in" data-aos-delay="100" extra="!flex flex-col items-center p-5 hover:shadow-lg transition-shadow">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                        <MdPeople className="h-8 w-8 text-blue-500" />
                    </div>
                    <p className="mt-4 text-2xl font-bold text-navy-700 dark:text-white">{dashboardStats.totalStudents}</p>
                    <p className="mt-1 text-sm text-gray-600">Total Mahasiswa</p>
                    <div className="mt-2 flex items-center text-xs">
                        <span className="text-green-500 flex items-center">
                            <MdTrendingUp className="mr-1" /> {dashboardStats.highAttendanceStudents} aktif tinggi
                        </span>
                    </div>
                </Card>

                <Card data-aos="zoom-in" data-aos-delay="200" extra="!flex flex-col items-center p-5 hover:shadow-lg transition-shadow">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                        <MdClass className="h-8 w-8 text-green-500" />
                    </div>
                    <p className="mt-4 text-2xl font-bold text-navy-700 dark:text-white">{dashboardStats.activeCourses}</p>
                    <p className="mt-1 text-sm text-gray-600">Mata Kuliah Aktif</p>
                    <div className="mt-2 flex items-center text-xs">
                        <span className="text-blue-500 flex items-center">
                            <MdEventNote className="mr-1" /> {dashboardStats.completedSessions} sesi selesai
                        </span>
                    </div>
                </Card>

                <Card data-aos="zoom-in" data-aos-delay="300" extra="!flex flex-col items-center p-5 hover:shadow-lg transition-shadow">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                        <MdAccessTime className="h-8 w-8 text-purple-500" />
                    </div>
                    <p className="mt-4 text-2xl font-bold text-navy-700 dark:text-white">{dashboardStats.sessionsThisWeek}</p>
                    <p className="mt-1 text-sm text-gray-600">Sesi Minggu Ini</p>
                    <div className="mt-2 flex items-center text-xs">
                        <span className="text-purple-500 flex items-center">
                            <MdTimer className="mr-1" /> {dashboardStats.todaySessions} hari ini
                        </span>
                    </div>
                </Card>

                <Card data-aos="zoom-in" data-aos-delay="400" extra="!flex flex-col items-center p-5 hover:shadow-lg transition-shadow">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
                        <MdWarning className="h-8 w-8 text-yellow-500" />
                    </div>
                    <p className="mt-4 text-2xl font-bold text-navy-700 dark:text-white">{dashboardStats.pendingLeaveRequests}</p>
                    <p className="mt-1 text-sm text-gray-600">Permintaan Izin</p>
                    <div className="mt-2 flex items-center text-xs">
                        <span className="text-green-500 flex items-center mr-2">
                            <MdCheckCircle className="mr-1" /> {dashboardStats.approvedLeaveRequests}
                        </span>
                        <span className="text-red-500 flex items-center">
                            <MdCancel className="mr-1" /> {dashboardStats.rejectedLeaveRequests}
                        </span>
                    </div>
                </Card>
            </div>

            {/* Attendance Overview Card */}
            <Card data-aos="fade-up" extra="w-full p-5 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xl font-bold text-navy-700 dark:text-white flex items-center">
                        <MdInsights className="mr-2 h-6 w-6" />
                        Ringkasan Kehadiran
                    </h4>
                    <div className="flex items-center space-x-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{dashboardStats.averageAttendance}%</div>
                            <div className="text-xs text-gray-500">Rata-rata</div>
                        </div>
                        <Link to="/lecturer/students" className="flex items-center text-sm text-blue-500 hover:text-blue-700">
                            Detail <MdArrowForward className="ml-1" />
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Attendance Distribution */}
                    <div className="lg:col-span-1">
                        <h5 className="text-sm font-medium mb-3 text-gray-700">Distribusi Kehadiran</h5>
                        <div className="h-48">
                            <PieChart
                                options={attendanceDistributionPieOptions}
                                series={attendanceDistributionPieData}
                            />
                        </div>
                    </div>

                    {/* Weekly Attendance Trend */}
                    <div className="lg:col-span-2">
                        <h5 className="text-sm font-medium mb-3 text-gray-700">Tren Kehadiran Mingguan</h5>
                        <div className="h-48">
                            <LineChart
                                options={attendanceWeeklyChartOptions}
                                series={attendanceWeeklyChartData}
                            />
                        </div>
                    </div>
                </div>
            </Card>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6">
                {/* Course Overview */}
                <div className="lg:col-span-2">
                    <Card data-aos="fade-up" extra="w-full p-5">
                        <div className="mb-4 flex items-center justify-between">
                            <h4 className="text-lg font-bold text-navy-700 dark:text-white flex items-center">
                                <MdSchool className="mr-2 h-5 w-5" />
                                Mata Kuliah & Performa
                            </h4>
                            <Link to="/lecturer/courses" className="flex items-center text-sm text-blue-500 hover:text-blue-700">
                                Kelola Semua <MdArrowForward className="ml-1" />
                            </Link>
                        </div>

                        <div className="space-y-4">
                            {courses.map((course) => (
                                <div key={course.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center justify-between mb-3">
                                        <h5 className="text-base font-semibold text-navy-700 dark:text-white">
                                            {course.name}
                                        </h5>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${course.attendanceRate >= 90 ? 'bg-green-100 text-green-800' :
                                            course.attendanceRate >= 80 ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                            {course.attendanceRate >= 90 ? 'Sangat Baik' :
                                                course.attendanceRate >= 80 ? 'Baik' : 'Perlu Perhatian'}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                                        <div className="text-center">
                                            <div className="text-lg font-bold text-blue-600">{course.totalStudents}</div>
                                            <div className="text-xs text-gray-500">Mahasiswa</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-lg font-bold text-green-600">{course.sessions}</div>
                                            <div className="text-xs text-gray-500">Sesi</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-lg font-bold text-purple-600">{course.attendanceRate}%</div>
                                            <div className="text-xs text-gray-500">Kehadiran</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-lg font-bold text-red-600">{course.lowAttendanceCount}</div>
                                            <div className="text-xs text-gray-500">Alert</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex-1 mr-3">
                                            <div className="w-full h-2 rounded-full bg-gray-200">
                                                <div
                                                    className={`h-2 rounded-full transition-all duration-300 ${course.attendanceRate >= 90 ? "bg-green-500" :
                                                        course.attendanceRate >= 80 ? "bg-yellow-500" : "bg-red-500"
                                                        }`}
                                                    style={{ width: `${course.attendanceRate}%` }}
                                                />
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs text-gray-500">Sesi Berikutnya:</div>
                                            <div className="text-xs font-medium text-navy-700">{course.nextSession}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Upcoming Sessions */}
                <div className="lg:col-span-1">
                    <Card data-aos="fade-up" data-aos-delay="200" extra="w-full p-5">
                        <div className="mb-4 flex items-center justify-between">
                            <h4 className="text-lg font-bold text-navy-700 dark:text-white flex items-center">
                                <MdEventNote className="mr-2 h-5 w-5" />
                                Jadwal Terdekat
                            </h4>
                            <Link to="/lecturer/sessions" className="flex items-center text-sm text-blue-500 hover:text-blue-700">
                                Semua <MdArrowForward className="ml-1" />
                            </Link>
                        </div>

                        <div className="space-y-4">
                            {upcomingClasses.map((session) => (
                                <div key={session.id} className="p-3 rounded-xl border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50 transition-all duration-200">
                                    <div className="flex items-start">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 flex-shrink-0">
                                            <p className="text-sm font-bold text-indigo-600">{session.day.substring(0, 2)}</p>
                                        </div>
                                        <div className="ml-3 flex-1">
                                            <h5 className="text-sm font-semibold text-navy-700 dark:text-white mb-1">
                                                {session.course}
                                            </h5>
                                            <div className="space-y-1">
                                                <div className="flex items-center text-xs text-gray-600">
                                                    <MdAccessTime className="mr-1 h-3 w-3" />
                                                    {session.time}
                                                </div>
                                                <div className="flex items-center text-xs text-gray-600">
                                                    <MdClass className="mr-1 h-3 w-3" />
                                                    {session.room}
                                                </div>
                                                <div className="flex items-center text-xs text-gray-600">
                                                    <MdGroup className="mr-1 h-3 w-3" />
                                                    {session.expectedStudents} mahasiswa
                                                </div>
                                            </div>
                                            <div className="mt-2">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${session.type === 'praktikum' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                                                    }`}>
                                                    {session.type}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 pt-3 border-t border-gray-200">
                            <button className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
                                Buat Sesi Baru
                            </button>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Analytics & Recent Activities */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-6">
                {/* Monthly Sessions Chart */}
                <Card data-aos="fade-up" data-aos-delay="100" extra="w-full p-5">
                    <div className="mb-4 flex items-center justify-between">
                        <h4 className="text-lg font-bold text-navy-700 dark:text-white flex items-center">
                            <MdBarChart className="mr-2 h-5 w-5" />
                            Aktivitas Bulanan
                        </h4>
                        <Link to="/lecturer/sessions?tab=analytics" className="flex items-center text-sm text-blue-500 hover:text-blue-700">
                            Detail <MdArrowForward className="ml-1" />
                        </Link>
                    </div>

                    <div className="h-64">
                        <BarChart
                            chartOptions={sessionsMonthlyChartOptions}
                            chartData={sessionsMonthlyChartData}
                        />
                    </div>
                </Card>

                {/* Recent Activities */}
                <Card data-aos="fade-up" data-aos-delay="200" extra="w-full p-5">
                    <div className="mb-4 flex items-center justify-between">
                        <h4 className="text-lg font-bold text-navy-700 dark:text-white flex items-center">
                            <MdNotifications className="mr-2 h-5 w-5" />
                            Aktivitas Terkini
                        </h4>
                        <Link to="/lecturer/notifications" className="flex items-center text-sm text-blue-500 hover:text-blue-700">
                            Semua <MdArrowForward className="ml-1" />
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {recentActivities.map((activity) => (
                            <div key={activity.id} className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 flex-shrink-0`}>
                                    <activity.icon className={`h-4 w-4 ${activity.color}`} />
                                </div>
                                <div className="ml-3 flex-1">
                                    <p className="text-sm font-medium text-navy-700 dark:text-white">
                                        {activity.message}
                                    </p>
                                    <p className="text-xs text-gray-600 mt-1">
                                        {activity.detail}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {activity.time}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card data-aos="fade-up" data-aos-delay="300" extra="w-full p-5">
                <h4 className="text-lg font-bold text-navy-700 dark:text-white mb-4 flex items-center">
                    <MdShowChart className="mr-2 h-5 w-5" />
                    Aksi Cepat
                </h4>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link to="/lecturer/attendance/take-attendance" className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group">
                        <div className="flex flex-col items-center text-center">
                            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                <MdCheckCircle className="h-6 w-6 text-blue-600" />
                            </div>
                            <p className="mt-2 text-sm font-medium text-blue-700">Ambil Absensi</p>
                        </div>
                    </Link>                    <Link to="/lecturer/attendance" className="p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors group">
                        <div className="flex flex-col items-center text-center">
                            <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
                                <MdAutorenew className="h-6 w-6 text-yellow-600" />
                            </div>
                            <p className="mt-2 text-sm font-medium text-yellow-700">Kelola Absensi</p>
                        </div>
                    </Link>

                    <Link to="/lecturer/sessions" className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors group">
                        <div className="flex flex-col items-center text-center">
                            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                                <MdEventNote className="h-6 w-6 text-green-600" />
                            </div>
                            <p className="mt-2 text-sm font-medium text-green-700">Jadwal Sesi</p>
                        </div>
                    </Link>

                    <Link to="/lecturer/students" className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors group">
                        <div className="flex flex-col items-center text-center">
                            <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                                <MdAssessment className="h-6 w-6 text-purple-600" />
                            </div>
                            <p className="mt-2 text-sm font-medium text-purple-700">Analisis Mahasiswa</p>
                        </div>
                    </Link>
                </div>
            </Card>        </div>
    );
};

export default LecturerDashboard;
