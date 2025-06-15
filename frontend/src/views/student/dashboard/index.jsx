import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { MdVerified, MdSchedule, MdWarning, MdTrendingUp } from "react-icons/md";
import AttendanceStats from "./components/AttendanceStats";
import AttendanceCalendar from "./components/AttendanceCalendar";
import QuickActions from "./components/QuickActions";

const StudentDashboard = () => {
    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
        });
    }, []);

    const attendanceData = {
        totalClasses: 48,
        attended: 42,
        absent: 4,
        late: 2,
        percentage: 87.5
    };

    const todaySchedule = [
        { time: "08:00", course: "Pemrograman Web", room: "Lab 1", status: "upcoming" },
        { time: "10:00", course: "Database", room: "R201", status: "attended" },
        { time: "13:00", course: "Mobile Dev", room: "Lab 2", status: "upcoming" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            {/* Header */}
            <div className="mb-8" data-aos="fade-down">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Dashboard Mahasiswa
                </h1>
                <p className="text-gray-600">
                    Selamat datang, John Doe - NIM: 2021001234
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500" data-aos="fade-up" data-aos-delay="100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Kehadiran Hari Ini</p>
                            <p className="text-2xl font-bold text-green-600">3/4</p>
                        </div>
                        <MdVerified className="h-8 w-8 text-green-500" />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500" data-aos="fade-up" data-aos-delay="200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Persentase Kehadiran</p>
                            <p className="text-2xl font-bold text-blue-600">{attendanceData.percentage}%</p>
                        </div>
                        <MdTrendingUp className="h-8 w-8 text-blue-500" />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500" data-aos="fade-up" data-aos-delay="300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Kelas Berikutnya</p>
                            <p className="text-sm font-bold text-yellow-600">Mobile Dev - 13:00</p>
                        </div>
                        <MdSchedule className="h-8 w-8 text-yellow-500" />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500" data-aos="fade-up" data-aos-delay="400">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Peringatan</p>
                            <p className="text-sm font-bold text-red-600">2 Kelas Terlambat</p>
                        </div>
                        <MdWarning className="h-8 w-8 text-red-500" />
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-8">
                    <AttendanceStats data={attendanceData} />
                    <AttendanceCalendar />
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                    {/* Today's Schedule */}
                    <div className="bg-white rounded-xl shadow-lg p-6" data-aos="fade-left">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Jadwal Hari Ini</h3>
                        <div className="space-y-3">
                            {todaySchedule.map((schedule, index) => (
                                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-800">{schedule.course}</p>
                                        <p className="text-sm text-gray-600">{schedule.time} - {schedule.room}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${schedule.status === 'attended'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {schedule.status === 'attended' ? 'Hadir' : 'Belum'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <QuickActions />
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
