// Custom hook untuk mengelola state dan logic course management
import { useState, useEffect } from "react";

export const useCourseManagement = (courses) => {
    const [activeFilter, setActiveFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("name");
    const [filteredCourses, setFilteredCourses] = useState(courses);
    const [currentView, setCurrentView] = useState("list");
    const [selectedCourse, setSelectedCourse] = useState(null);

    // Filter dan sort logic
    useEffect(() => {
        let filtered = courses;

        // Filter by status
        if (activeFilter !== "all") {
            filtered = filtered.filter(course => {
                switch (activeFilter) {
                    case "active":
                        return course.status === "active";
                    case "attention":
                        return course.averageAttendance < 80;
                    case "excellent":
                        return course.averageAttendance >= 90;
                    default:
                        return true;
                }
            });
        }

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(course =>
                course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                course.code.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Sort courses
        filtered.sort((a, b) => {
            switch (sortBy) {
                case "name":
                    return a.name.localeCompare(b.name);
                case "attendance":
                    return b.averageAttendance - a.averageAttendance;
                case "students":
                    return b.students - a.students;
                default:
                    return 0;
            }
        });

        setFilteredCourses(filtered);
    }, [activeFilter, searchTerm, sortBy, courses]);

    // Actions
    const handleTakeAttendance = (course) => {
        setSelectedCourse(course);
        setCurrentView("attendance");
    };

    const handleViewDetail = (course) => {
        setSelectedCourse(course);
        setCurrentView("detail");
    };

    const handleBackToList = () => {
        setCurrentView("list");
        setSelectedCourse(null);
    };

    // Calculate statistics
    const overallStats = {
        totalCourses: courses.length,
        totalStudents: courses.reduce((sum, course) => sum + course.students, 0),
        averageAttendance: Math.round(courses.reduce((sum, course) => sum + course.averageAttendance, 0) / courses.length),
        completedSessions: courses.reduce((sum, course) => sum + course.completedSessions, 0),
        upcomingClasses: 3,
        needsAttention: courses.filter(course => course.averageAttendance < 80).length
    };

    return {
        // State
        activeFilter,
        searchTerm,
        sortBy,
        filteredCourses,
        currentView,
        selectedCourse,
        overallStats,

        // Setters
        setActiveFilter,
        setSearchTerm,
        setSortBy,
        setCurrentView,

        // Actions
        handleTakeAttendance,
        handleViewDetail,
        handleBackToList
    };
};

// Utility functions
export const generateStudentData = (count) => {
    return Array.from({ length: count }, (_, index) => ({
        id: index + 1,
        nim: `2021000${String(index + 1).padStart(2, '0')}`,
        name: `Mahasiswa ${index + 1}`,
        status: 'pending' // pending, present, late, absent
    }));
};

export const calculateAttendanceStats = (students) => {
    const present = students.filter(s => s.status === 'present').length;
    const late = students.filter(s => s.status === 'late').length;
    const absent = students.filter(s => s.status === 'absent').length;
    const pending = students.filter(s => s.status === 'pending').length;

    return { present, late, absent, pending };
};
