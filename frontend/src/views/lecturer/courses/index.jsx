import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Link } from "react-router-dom";
import Card from "components/card";
import {
    MdSchool,
    MdPeople,
    MdAccessTime,
    MdCalendarToday,
    MdAssignment,
    MdArrowForward,
} from "react-icons/md";

// Dummy Data
const courses = [
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
    },
];

const CourseManagement = () => {
    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: "ease-in-out",
            once: true,
        });
    }, []);

    const getColorClass = (color) => {
        const colors = {
            blue: {
                bg: "bg-blue-100",
                text: "text-blue-600",
                border: "border-blue-200",
            },
            green: {
                bg: "bg-green-100",
                text: "text-green-600",
                border: "border-green-200",
            },
            purple: {
                bg: "bg-purple-100",
                text: "text-purple-600",
                border: "border-purple-200",
            },
            orange: {
                bg: "bg-orange-100",
                text: "text-orange-600",
                border: "border-orange-200",
            },
        };

        return colors[color] || colors.blue;
    };

    return (
        <div className="mt-3">
            <div className="mb-5" data-aos="fade-down">
                <h1 className="text-3xl font-bold text-navy-700 dark:text-white">
                    Manajemen Mata Kuliah
                </h1>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Kelola semua mata kuliah yang Anda ajarkan
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {courses.map((course, index) => {
                    const colorClass = getColorClass(course.color);

                    return (
                        <Card
                            key={course.id}
                            extra={`p-4 hover:border-${course.color}-300 hover:shadow-md transition-all duration-300`}
                            data-aos="fade-up"
                            data-aos-delay={index * 100}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div
                                    className={`text-xs font-semibold py-1 px-3 rounded-full ${colorClass.bg} ${colorClass.text} ${colorClass.border} border`}
                                >
                                    {course.code}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {course.semester}
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-navy-700 dark:text-white mb-3">
                                {course.name}
                            </h3>

                            <div className="flex flex-col space-y-2 mb-4">
                                <div className="flex items-center text-gray-600">
                                    <MdSchool className="mr-2" />
                                    <span className="text-sm">{course.students} Mahasiswa</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <MdCalendarToday className="mr-2" />
                                    <span className="text-sm">{course.day}, {course.time}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <MdAccessTime className="mr-2" />
                                    <span className="text-sm">Pertemuan {course.completedSessions} dari {course.sessions}</span>
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="flex justify-between text-xs text-gray-600 mb-1">
                                    <span>Progress</span>
                                    <span>{Math.round((course.completedSessions / course.sessions) * 100)}%</span>
                                </div>
                                <div className="h-2 w-full bg-gray-200 rounded-full">
                                    <div
                                        className={`h-2 rounded-full bg-${course.color}-500`}
                                        style={{ width: `${(course.completedSessions / course.sessions) * 100}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="flex space-x-2">
                                <Link
                                    to={`/lecturer/attendance/take-attendance?course=${course.id}`}
                                    className="flex-1 py-2 px-4 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors text-center"
                                >
                                    Ambil Absensi
                                </Link>

                                <Link
                                    to={`/lecturer/courses/course-details?id=${course.id}`}
                                    className="flex-1 py-2 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors text-center"
                                >
                                    Detail
                                </Link>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};

export default CourseManagement;
