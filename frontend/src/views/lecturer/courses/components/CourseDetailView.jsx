import React from "react";
import Card from "components/card";
import {
    MdArrowBack,
    MdEdit,
    MdQrCode,
    MdPeople,
    MdBarChart,
    MdAssignment,
    MdCalendarToday,
    MdSchool,
    MdHistory,
    MdTrendingUp,
    MdTrendingDown,
} from "react-icons/md";

const CourseDetailView = ({ course, onBack }) => {
    if (!course) return null;

    return (
        <div className="mt-3">
            {/* Header */}
            <div className="mb-5 flex justify-between items-start" data-aos="fade-down">
                <div>
                    <div className="flex items-center">
                        <button
                            onClick={onBack}
                            className="mr-3 p-2 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <MdArrowBack className="h-6 w-6 text-gray-500" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-navy-700 dark:text-white">
                                {course.code}: {course.name}
                            </h1>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                {course.semester} • {course.students} Mahasiswa
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex space-x-2">
                    <button className="py-2 px-4 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
                        <MdEdit className="mr-2 h-4 w-4" /> Edit
                    </button>
                    <button className="py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center">
                        <MdQrCode className="mr-2 h-4 w-4" /> Ambil Absensi
                    </button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
                <Card extra="!flex flex-col items-center p-5" data-aos="fade-up" data-aos-delay="100">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                        <MdPeople className="h-8 w-8 text-green-500" />
                    </div>
                    <p className="mt-4 text-xl font-bold text-navy-700 dark:text-white">{course.students}</p>
                    <p className="mt-1 text-sm text-gray-600">Total Mahasiswa</p>
                </Card>

                <Card extra="!flex flex-col items-center p-5" data-aos="fade-up" data-aos-delay="200">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
                        <MdBarChart className="h-8 w-8 text-indigo-500" />
                    </div>
                    <p className="mt-4 text-xl font-bold text-navy-700 dark:text-white">
                        {course.averageAttendance}%
                    </p>
                    <p className="mt-1 text-sm text-gray-600">Rata-rata Kehadiran</p>
                    <div className="mt-2 flex items-center text-sm text-green-600">
                        {course.trend === "up" ? (
                            <MdTrendingUp className="mr-1 h-3 w-3" />
                        ) : (
                            <MdTrendingDown className="mr-1 h-3 w-3" />
                        )}
                        <span>Trend {course.trend === "up" ? "Naik" : "Turun"}</span>
                    </div>
                </Card>

                <Card extra="!flex flex-col items-center p-5" data-aos="fade-up" data-aos-delay="300">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                        <MdAssignment className="h-8 w-8 text-blue-500" />
                    </div>
                    <p className="mt-4 text-xl font-bold text-navy-700 dark:text-white">
                        {course.completedSessions}/{course.sessions}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">Pertemuan Selesai</p>
                </Card>

                <Card extra="!flex flex-col items-center p-5" data-aos="fade-up" data-aos-delay="400">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                        <MdCalendarToday className="h-8 w-8 text-orange-500" />
                    </div>
                    <p className="mt-4 text-xl font-bold text-navy-700 dark:text-white">
                        {course.day}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">{course.time}</p>
                </Card>
            </div>

            {/* Course Information */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <Card extra="p-6 lg:col-span-2" data-aos="fade-up">
                    <h3 className="text-lg font-bold text-navy-700 dark:text-white mb-4 flex items-center">
                        <MdSchool className="mr-2 h-5 w-5" />
                        Informasi Mata Kuliah
                    </h3>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700">Kode Mata Kuliah</label>
                                <p className="text-base text-navy-700 font-semibold">{course.code}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Nama Mata Kuliah</label>
                                <p className="text-base text-navy-700 font-semibold">{course.name}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700">Semester</label>
                                <p className="text-base text-navy-700 font-semibold">{course.semester}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Ruang</label>
                                <p className="text-base text-navy-700 font-semibold">{course.room}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700">Hari & Waktu</label>
                                <p className="text-base text-navy-700 font-semibold">{course.day}, {course.time}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Jumlah Mahasiswa</label>
                                <p className="text-base text-navy-700 font-semibold">{course.students} Mahasiswa</p>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card extra="p-6" data-aos="fade-up" data-aos-delay="100">
                    <h3 className="text-lg font-bold text-navy-700 dark:text-white mb-4 flex items-center">
                        <MdBarChart className="mr-2 h-5 w-5" />
                        Statistik Kehadiran
                    </h3>
                    <div className="space-y-4">
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <p className="text-2xl font-bold text-green-600">{course.averageAttendance}%</p>
                            <p className="text-sm text-green-700">Rata-rata Kehadiran</p>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Hadir</span>
                                <span className="font-medium">{Math.round(course.students * course.averageAttendance / 100)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Tidak Hadir</span>
                                <span className="font-medium">{course.students - Math.round(course.students * course.averageAttendance / 100)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Progress</span>
                                <span className="font-medium">{Math.round((course.completedSessions / course.sessions) * 100)}%</span>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Recent Sessions */}
            <Card extra="p-6" data-aos="fade-up">
                <h3 className="text-lg font-bold text-navy-700 dark:text-white mb-4 flex items-center">
                    <MdHistory className="mr-2 h-5 w-5" />
                    Pertemuan Terakhir
                </h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Pertemuan
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tanggal
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Kehadiran
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {[...Array(5)].map((_, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        Pertemuan {course.completedSessions - index}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(Date.now() - index * 7 * 24 * 60 * 60 * 1000).toLocaleDateString('id-ID')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {Math.round(course.students * (course.averageAttendance + Math.random() * 10 - 5) / 100)}/{course.students}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                            Selesai
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default CourseDetailView;
