import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { MdSchedule, MdRoom, MdPerson, MdAccessTime } from "react-icons/md";
import CourseList from "./components/CourseList";

const CourseSchedule = () => {
    const [selectedDay, setSelectedDay] = useState('all');

    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
        });
    }, []);

    const scheduleData = [
        {
            id: 1,
            day: 'Senin',
            time: '08:00 - 10:00',
            course: 'Pemrograman Web',
            lecturer: 'Dr. Ahmad Fauzi',
            room: 'Lab Komputer 1',
            code: 'IF301',
            credits: 3,
            color: 'blue'
        },
        {
            id: 2,
            day: 'Senin',
            time: '10:30 - 12:30',
            course: 'Database Management',
            lecturer: 'Prof. Maria Sari',
            room: 'R201',
            code: 'IF302',
            credits: 3,
            color: 'green'
        },
        {
            id: 3,
            day: 'Selasa',
            time: '08:00 - 10:00',
            course: 'Mobile Development',
            lecturer: 'Dr. Budi Santoso',
            room: 'Lab Komputer 2',
            code: 'IF303',
            credits: 3,
            color: 'purple'
        },
        {
            id: 4,
            day: 'Rabu',
            time: '13:00 - 15:00',
            course: 'Machine Learning',
            lecturer: 'Dr. Lisa Wijaya',
            room: 'R301',
            code: 'IF304',
            credits: 3,
            color: 'red'
        },
        {
            id: 5,
            day: 'Kamis',
            time: '08:00 - 10:00',
            course: 'Software Engineering',
            lecturer: 'Prof. Andi Rahman',
            room: 'R202',
            code: 'IF305',
            credits: 3,
            color: 'yellow'
        }
    ];

    const days = ['all', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];

    const filteredSchedule = selectedDay === 'all'
        ? scheduleData
        : scheduleData.filter(item => item.day === selectedDay);

    const getColorClasses = (color) => {
        const colors = {
            blue: 'from-blue-500 to-blue-600 border-blue-200',
            green: 'from-green-500 to-green-600 border-green-200',
            purple: 'from-purple-500 to-purple-600 border-purple-200',
            red: 'from-red-500 to-red-600 border-red-200',
            yellow: 'from-yellow-500 to-yellow-600 border-yellow-200'
        };
        return colors[color] || colors.blue;
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            {/* Header */}
            <div className="mb-8" data-aos="fade-down">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Jadwal Perkuliahan
                </h1>
                <p className="text-gray-600">
                    Lihat jadwal mata kuliah semester ini
                </p>
            </div>

            {/* Day Filter */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8" data-aos="fade-up">
                <div className="flex flex-wrap gap-2">
                    {days.map((day) => (
                        <button
                            key={day}
                            onClick={() => setSelectedDay(day)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${selectedDay === day
                                    ? 'bg-blue-500 text-white shadow-lg'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {day === 'all' ? 'Semua Hari' : day}
                        </button>
                    ))}
                </div>
            </div>

            {/* Schedule Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {filteredSchedule.map((schedule, index) => (
                    <div
                        key={schedule.id}
                        className={`bg-gradient-to-br ${getColorClasses(schedule.color)} rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300`}
                        data-aos="fade-up"
                        data-aos-delay={index * 100}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold mb-1">{schedule.course}</h3>
                                <p className="text-sm opacity-90">{schedule.code} - {schedule.credits} SKS</p>
                            </div>
                            <span className="bg-white bg-opacity-20 px-2 py-1 rounded-lg text-xs font-medium">
                                {schedule.day}
                            </span>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center">
                                <MdAccessTime className="h-5 w-5 mr-3" />
                                <span className="text-sm">{schedule.time}</span>
                            </div>
                            <div className="flex items-center">
                                <MdRoom className="h-5 w-5 mr-3" />
                                <span className="text-sm">{schedule.room}</span>
                            </div>
                            <div className="flex items-center">
                                <MdPerson className="h-5 w-5 mr-3" />
                                <span className="text-sm">{schedule.lecturer}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Course List Component */}
            <CourseList courses={scheduleData} />
        </div>
    );
};

export default CourseSchedule;
