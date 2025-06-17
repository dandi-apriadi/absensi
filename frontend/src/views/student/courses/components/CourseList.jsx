import React, { useState } from "react";
import { MdVisibility, MdSchedule, MdPeople, MdClose, MdLocationOn, MdBook, MdCalendarToday, MdAccessTime } from "react-icons/md";

const CourseList = ({ courses = [] }) => {
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Dummy data for demonstration
    const dummyCourses = [
        {
            id: 1, code: "TI101",
            course: "Algoritma dan Pemrograman",
            room: "Lab Komputer 1",
            lecturer: "Dr. Ahmad Susanto, M.Kom",
            credits: 3,
            day: "Senin",
            time: "08:00 - 10:30",
            description: "Mata kuliah ini membahas konsep dasar algoritma dan pemrograman menggunakan bahasa pemrograman modern.",
            semester: "Semester 1",
            prerequisites: "Tidak ada",
            attendanceRate: 85
        },
        {
            id: 2, code: "TI102",
            course: "Basis Data",
            room: "Ruang 201",
            lecturer: "Prof. Siti Nurhaliza, M.T",
            credits: 3,
            day: "Selasa",
            time: "10:30 - 13:00",
            description: "Mata kuliah ini membahas konsep dasar basis data, desain database, dan implementasi sistem basis data.",
            semester: "Semester 2",
            prerequisites: "Algoritma dan Pemrograman",
            attendanceRate: 92
        },
        {
            id: 3, code: "TI103",
            course: "Jaringan Komputer",
            room: "Lab Jaringan",
            lecturer: "Ir. Budi Santoso, M.Sc",
            credits: 2,
            day: "Rabu",
            time: "13:00 - 15:30",
            description: "Mata kuliah ini membahas konsep jaringan komputer, protokol komunikasi, dan keamanan jaringan.",
            semester: "Semester 3",
            prerequisites: "Sistem Operasi",
            attendanceRate: 78
        },
        {
            id: 4, code: "TI104",
            course: "Rekayasa Perangkat Lunak",
            room: "Ruang 301",
            lecturer: "Dr. Maya Sari, S.Kom, M.T",
            credits: 3,
            day: "Kamis",
            time: "08:00 - 10:30",
            description: "Mata kuliah ini membahas metodologi pengembangan perangkat lunak dan manajemen proyek software.",
            semester: "Semester 4",
            prerequisites: "Algoritma dan Pemrograman, Basis Data",
            attendanceRate: 88
        },
        {
            id: 5, code: "TI105",
            course: "Sistem Operasi",
            room: "Lab Komputer 2",
            lecturer: "Drs. Hendra Wijaya, M.Kom",
            credits: 2,
            day: "Jumat",
            time: "10:30 - 13:00",
            description: "Mata kuliah ini membahas konsep sistem operasi, manajemen memori, dan proses scheduling.",
            semester: "Semester 2",
            prerequisites: "Algoritma dan Pemrograman",
            attendanceRate: 95
        },
        {
            id: 6, code: "TI106",
            course: "Pemrograman Web",
            room: "Lab Multimedia",
            lecturer: "Andi Pratama, S.Kom, M.T",
            credits: 3,
            day: "Senin",
            time: "13:00 - 15:30",
            description: "Mata kuliah ini membahas pengembangan aplikasi web menggunakan teknologi modern seperti HTML, CSS, JavaScript, dan framework web.",
            semester: "Semester 3",
            prerequisites: "Algoritma dan Pemrograman, Basis Data",
            attendanceRate: 90
        }
    ];    // Use passed courses if available, otherwise use dummy data
    const courseList = Array.isArray(courses) && courses.length > 0 ? courses : dummyCourses;

    const openModal = (course) => {
        setSelectedCourse(course);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedCourse(null);
        setIsModalOpen(false);
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6" data-aos="fade-up">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Daftar Mata Kuliah</h3>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Kode</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Mata Kuliah</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Dosen</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">SKS</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Jadwal</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courseList.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="py-8 px-4 text-center text-gray-500">
                                    Tidak ada mata kuliah yang tersedia
                                </td>
                            </tr>
                        ) : (
                            courseList.map((course, index) => (
                                <tr
                                    key={course.id}
                                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                >
                                    <td className="py-4 px-4">
                                        <span className="font-medium text-gray-900">{course.code}</span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div>
                                            <p className="font-medium text-gray-900">{course.course}</p>
                                            <p className="text-sm text-gray-600">{course.room}</p>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="text-gray-700">{course.lecturer}</span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                                            {course.credits} SKS
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="text-sm">
                                            <p className="font-medium text-gray-900">{course.day}</p>
                                            <p className="text-gray-600">{course.time}</p>
                                        </div>
                                    </td>                                    <td className="py-4 px-4">
                                        <button
                                            onClick={() => openModal(course)}
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors flex items-center"
                                        >
                                            <MdVisibility className="h-4 w-4 mr-1" />
                                            Detail
                                        </button>
                                    </td>
                                </tr>
                            )))}                    </tbody>
                </table>
            </div>            {/* Detail Modal */}
            {isModalOpen && selectedCourse && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm" onClick={closeModal}>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[88vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 relative">
                            <button
                                onClick={closeModal}
                                className="absolute top-4 right-4 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-all duration-200"
                            >
                                <MdClose className="h-5 w-5" />
                            </button>
                            <div className="pr-12">
                                <h2 className="text-2xl font-bold mb-2">{selectedCourse.course}</h2>
                                <div className="flex items-center space-x-3 text-blue-100">
                                    <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs font-medium">
                                        {selectedCourse.code}
                                    </span>
                                    <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs font-medium">
                                        {selectedCourse.credits} SKS
                                    </span>
                                    <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs font-medium">
                                        {selectedCourse.semester}
                                    </span>
                                </div>
                            </div>
                        </div>                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto max-h-[calc(88vh-120px)]">
                            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                {/* Informasi Jadwal */}
                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                                    <div className="flex items-center mb-4">
                                        <div className="bg-green-500 p-2 rounded-lg">
                                            <MdCalendarToday className="h-4 w-4 text-white" />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-800 ml-3">Jadwal Kuliah</h3>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center p-2 bg-white rounded-lg shadow-sm">
                                            <MdCalendarToday className="h-4 w-4 text-green-500 mr-3" />
                                            <div>
                                                <p className="text-xs text-gray-500 font-medium">Hari</p>
                                                <p className="text-sm font-bold text-gray-800">{selectedCourse.day}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center p-2 bg-white rounded-lg shadow-sm">
                                            <MdAccessTime className="h-4 w-4 text-green-500 mr-3" />
                                            <div>
                                                <p className="text-xs text-gray-500 font-medium">Waktu</p>
                                                <p className="text-sm font-bold text-gray-800">{selectedCourse.time}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center p-2 bg-white rounded-lg shadow-sm">
                                            <MdLocationOn className="h-4 w-4 text-green-500 mr-3" />
                                            <div>
                                                <p className="text-xs text-gray-500 font-medium">Ruangan</p>
                                                <p className="text-sm font-bold text-gray-800">{selectedCourse.room}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Informasi Dosen */}
                                <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-4 border border-purple-100">
                                    <div className="flex items-center mb-4">
                                        <div className="bg-purple-500 p-2 rounded-lg">
                                            <MdPeople className="h-4 w-4 text-white" />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-800 ml-3">Dosen Pengampu</h3>
                                    </div>
                                    <div className="bg-white rounded-lg p-3 shadow-sm">
                                        <p className="text-base font-bold text-gray-800 mb-3">{selectedCourse.lecturer}</p>
                                        <div className="space-y-2">
                                            <div>
                                                <p className="text-xs text-gray-500 font-medium">Prasyarat</p>
                                                <p className="text-sm font-semibold text-gray-700">{selectedCourse.prerequisites}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Tingkat Kehadiran */}
                                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-100">
                                    <div className="flex items-center mb-4">
                                        <div className="bg-orange-500 p-2 rounded-lg">
                                            <MdSchedule className="h-4 w-4 text-white" />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-800 ml-3">Kehadiran</h3>
                                    </div>
                                    <div className="bg-white rounded-lg p-4 shadow-sm text-center">
                                        <div className="relative w-20 h-20 mx-auto mb-3">
                                            <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                                                <path
                                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                    fill="none"
                                                    stroke="#fed7aa"
                                                    strokeWidth="2.5"
                                                />
                                                <path
                                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                    fill="none"
                                                    stroke="#f97316"
                                                    strokeWidth="2.5"
                                                    strokeDasharray={`${selectedCourse.attendanceRate}, 100`}
                                                    className="drop-shadow-sm"
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-lg font-bold text-gray-800">{selectedCourse.attendanceRate}%</span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-600 font-medium">Kehadiran Semester Ini</p>
                                        <div className="mt-2 p-2 bg-orange-50 rounded-lg">
                                            <p className="text-xs text-orange-700">
                                                {selectedCourse.attendanceRate >= 80 ? "Kehadiran Baik ✓" : "Perlu Ditingkatkan ⚠️"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Deskripsi Mata Kuliah - Full Width */}
                            <div className="mt-6 bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-4 border border-gray-200">
                                <div className="flex items-center mb-3">
                                    <div className="bg-gray-600 p-2 rounded-lg">
                                        <MdBook className="h-4 w-4 text-white" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-800 ml-3">Deskripsi Mata Kuliah</h3>
                                </div>
                                <div className="bg-white rounded-lg p-4 shadow-sm">
                                    <p className="text-gray-700 leading-relaxed text-sm">{selectedCourse.description}</p>
                                </div>
                            </div>
                        </div>                        {/* Modal Footer */}
                        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                            <div className="flex justify-end">
                                <button
                                    onClick={closeModal}
                                    className="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm"
                                >
                                    Tutup
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseList;
