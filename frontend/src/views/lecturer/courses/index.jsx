import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

// Import modular components
import CourseCard from "./components/CourseCard";
import StatisticsCard from "./components/StatisticsCard";
import FilterSection from "./components/FilterSection";
import Sidebar from "./components/Sidebar";
import CourseDetailView from "./components/CourseDetailView";
import TakeAttendanceView from "./components/TakeAttendanceView";
import { useCourseManagement } from "./hooks/useCourseManagement";

// Sample data - in real app, this would come from API
const coursesData = [
    {
        id: 1,
        code: "CS-101",
        name: "Algoritma dan Pemrograman",
        semester: "Ganjil 2023/2024",
        students: 35,
        sessions: 16,
        completedSessions: 8,
        day: "Senin",
        time: "08:00 - 09:40",
        room: "Lab 301",
        color: "blue",
        averageAttendance: 92,
        trend: "up",
        lastSessionDate: "2023-10-15",
        status: "active"
    },
    {
        id: 2,
        code: "CS-102",
        name: "Basis Data",
        semester: "Ganjil 2023/2024",
        students: 42,
        sessions: 16,
        completedSessions: 7,
        day: "Selasa",
        time: "10:00 - 11:40",
        room: "Lab 302",
        color: "green",
        averageAttendance: 88,
        trend: "up",
        lastSessionDate: "2023-10-14",
        status: "active"
    },
    {
        id: 3,
        code: "CS-103",
        name: "Pemrograman Web",
        semester: "Ganjil 2023/2024",
        students: 28,
        sessions: 16,
        completedSessions: 6,
        day: "Rabu",
        time: "13:00 - 14:40",
        room: "Lab 303",
        color: "purple",
        averageAttendance: 78,
        trend: "down",
        lastSessionDate: "2023-10-13",
        status: "attention"
    },
    {
        id: 4,
        code: "CS-104",
        name: "Kecerdasan Buatan",
        semester: "Ganjil 2023/2024",
        students: 32,
        sessions: 16,
        completedSessions: 8,
        day: "Kamis",
        time: "15:00 - 16:40",
        room: "Lab 304",
        color: "orange",
        averageAttendance: 95,
        trend: "up",
        lastSessionDate: "2023-10-12",
        status: "excellent"
    },
];

const recentActivitiesData = [
    {
        id: 1,
        type: "attendance",
        course: "CS-101",
        message: "Absensi pertemuan ke-8 selesai",
        time: "2 jam yang lalu",
        color: "green"
    },
    {
        id: 2,
        type: "alert",
        course: "CS-103",
        message: "Kehadiran rendah terdeteksi (78%)",
        time: "1 hari yang lalu",
        color: "yellow"
    },
    {
        id: 3,
        type: "schedule",
        course: "CS-102",
        message: "Jadwal perkuliahan besok",
        time: "2 hari yang lalu",
        color: "blue"
    }
];

const CourseManagement = () => {
    const {
        activeFilter,
        searchTerm,
        sortBy,
        filteredCourses,
        currentView,
        selectedCourse,
        overallStats,
        setActiveFilter,
        setSearchTerm,
        setSortBy,
        handleTakeAttendance,
        handleViewDetail,
        handleBackToList
    } = useCourseManagement(coursesData);

    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: "ease-in-out",
            once: true,
        });
    }, []);

    // Render different views based on currentView state
    const renderCurrentView = () => {
        switch (currentView) {
            case "detail":
                return (
                    <CourseDetailView
                        course={selectedCourse}
                        onBack={handleBackToList}
                    />
                );
            case "attendance":
                return (
                    <TakeAttendanceView
                        course={selectedCourse}
                        onBack={handleBackToList}
                    />
                );
            default:
                return (
                    <div className="mt-3">
                        {/* Header */}
                        <div className="mb-5 flex justify-between items-start" data-aos="fade-down">
                            <div>
                                <h1 className="text-3xl font-bold text-navy-700 dark:text-white">
                                    Manajemen Mata Kuliah
                                </h1>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                    Kelola mata kuliah dan pantau kehadiran mahasiswa
                                </p>
                            </div>
                        </div>

                        {/* Statistics Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
                            <StatisticsCard
                                title="Total Mata Kuliah"
                                value={overallStats.totalCourses}
                                icon="courses"
                                color="blue"
                                delay="100"
                            />
                            <StatisticsCard
                                title="Total Mahasiswa"
                                value={overallStats.totalStudents}
                                icon="students"
                                color="green"
                                delay="200"
                            />
                            <StatisticsCard
                                title="Rata-rata Kehadiran"
                                value={`${overallStats.averageAttendance}%`}
                                icon="attendance"
                                color="purple"
                                trend={overallStats.averageAttendance >= 80 ? "up" : "down"}
                                delay="300"
                            />
                            <StatisticsCard
                                title="Perlu Perhatian"
                                value={overallStats.needsAttention}
                                icon="warning"
                                color="orange"
                                delay="400"
                            />
                        </div>

                        {/* Main Content */}
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                            {/* Courses Section */}
                            <div className="lg:col-span-3 space-y-6">
                                {/* Filter Section */}
                                <FilterSection
                                    activeFilter={activeFilter}
                                    searchTerm={searchTerm}
                                    sortBy={sortBy}
                                    onFilterChange={setActiveFilter}
                                    onSearchChange={setSearchTerm}
                                    onSortChange={setSortBy}
                                />

                                {/* Course Grid */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {filteredCourses.map((course, index) => (
                                        <CourseCard
                                            key={course.id}
                                            course={course}
                                            index={index}
                                            onTakeAttendance={() => handleTakeAttendance(course)}
                                            onViewDetail={() => handleViewDetail(course)}
                                        />
                                    ))}
                                </div>

                                {filteredCourses.length === 0 && (
                                    <div className="text-center py-12" data-aos="fade-up">
                                        <div className="text-gray-400 text-6xl mb-4">📚</div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                                            Tidak ada mata kuliah ditemukan
                                        </h3>
                                        <p className="text-gray-500">
                                            Coba ubah filter atau kata kunci pencarian
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Sidebar */}
                            <div className="lg:col-span-1">
                                <Sidebar
                                    recentActivities={recentActivitiesData}
                                    upcomingClasses={overallStats.upcomingClasses}
                                />
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return renderCurrentView();
};

export default CourseManagement;