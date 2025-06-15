import React from "react";
import { MdArrowBack, MdSchedule, MdRoom, MdPerson, MdBook, MdAssignment } from "react-icons/md";

const CourseDetails = () => {
    const courseData = {
        code: 'IF301',
        name: 'Pemrograman Web',
        credits: 3,
        lecturer: 'Dr. Ahmad Fauzi',
        schedule: 'Senin, 08:00 - 10:00',
        room: 'Lab Komputer 1',
        description: 'Mata kuliah ini membahas konsep dasar pengembangan aplikasi web modern menggunakan teknologi terkini seperti HTML5, CSS3, JavaScript, dan framework web populer.',
        objectives: [
            'Memahami konsep dasar teknologi web',
            'Mampu mengembangkan aplikasi web responsif',
            'Menguasai framework web modern',
            'Memahami konsep keamanan web'
        ],
        attendance: {
            total: 12,
            attended: 10,
            percentage: 83.3
        },
        assignments: [
            { title: 'Tugas 1: HTML & CSS Dasar', dueDate: '2024-02-15', status: 'completed' },
            { title: 'Tugas 2: JavaScript Interaktif', dueDate: '2024-02-28', status: 'pending' },
            { title: 'Project Akhir: Web Application', dueDate: '2024-03-15', status: 'upcoming' }
        ]
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            {/* Header */}
            <div className="flex items-center mb-8" data-aos="fade-down">
                <button className="mr-4 p-2 hover:bg-gray-200 rounded-lg transition-colors">
                    <MdArrowBack className="h-6 w-6 text-gray-600" />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Detail Mata Kuliah</h1>
                    <p className="text-gray-600">{courseData.code} - {courseData.name}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Course Info */}
                    <div className="bg-white rounded-xl shadow-lg p-6" data-aos="fade-up">
                        <h3 className="text-xl font-semibold text-gray-800 mb-6">Informasi Mata Kuliah</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                                <MdBook className="h-8 w-8 text-blue-500 mr-4" />
                                <div>
                                    <p className="text-sm text-gray-600">Kode Mata Kuliah</p>
                                    <p className="font-semibold text-gray-800">{courseData.code}</p>
                                </div>
                            </div>

                            <div className="flex items-center p-4 bg-green-50 rounded-lg">
                                <MdAssignment className="h-8 w-8 text-green-500 mr-4" />
                                <div>
                                    <p className="text-sm text-gray-600">SKS</p>
                                    <p className="font-semibold text-gray-800">{courseData.credits} SKS</p>
                                </div>
                            </div>

                            <div className="flex items-center p-4 bg-purple-50 rounded-lg">
                                <MdPerson className="h-8 w-8 text-purple-500 mr-4" />
                                <div>
                                    <p className="text-sm text-gray-600">Dosen Pengampu</p>
                                    <p className="font-semibold text-gray-800">{courseData.lecturer}</p>
                                </div>
                            </div>

                            <div className="flex items-center p-4 bg-yellow-50 rounded-lg">
                                <MdSchedule className="h-8 w-8 text-yellow-500 mr-4" />
                                <div>
                                    <p className="text-sm text-gray-600">Jadwal</p>
                                    <p className="font-semibold text-gray-800">{courseData.schedule}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h4 className="text-lg font-semibold text-gray-800 mb-3">Deskripsi</h4>
                            <p className="text-gray-600 leading-relaxed">{courseData.description}</p>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold text-gray-800 mb-3">Tujuan Pembelajaran</h4>
                            <ul className="space-y-2">
                                {courseData.objectives.map((objective, index) => (
                                    <li key={index} className="flex items-start">
                                        <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                                            {index + 1}
                                        </span>
                                        <span className="text-gray-600">{objective}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Assignments */}
                    <div className="bg-white rounded-xl shadow-lg p-6" data-aos="fade-up" data-aos-delay="200">
                        <h3 className="text-xl font-semibold text-gray-800 mb-6">Tugas & Project</h3>

                        <div className="space-y-4">
                            {courseData.assignments.map((assignment, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-medium text-gray-800">{assignment.title}</h4>
                                            <p className="text-sm text-gray-600">Deadline: {assignment.dueDate}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${assignment.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                assignment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-blue-100 text-blue-800'
                                            }`}>
                                            {assignment.status === 'completed' ? 'Selesai' :
                                                assignment.status === 'pending' ? 'Dikerjakan' : 'Akan Datang'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    {/* Attendance Summary */}
                    <div className="bg-white rounded-xl shadow-lg p-6" data-aos="fade-left">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Ringkasan Kehadiran</h3>

                        <div className="text-center mb-6">
                            <div className="relative w-24 h-24 mx-auto mb-4">
                                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                                    <path
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        stroke="#E5E7EB"
                                        strokeWidth="2"
                                    />
                                    <path
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        stroke="#3B82F6"
                                        strokeWidth="2"
                                        strokeDasharray={`${courseData.attendance.percentage}, 100`}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-xl font-bold text-gray-800">
                                        {courseData.attendance.percentage}%
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total Pertemuan</span>
                                <span className="font-medium">{courseData.attendance.total}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Hadir</span>
                                <span className="font-medium text-green-600">{courseData.attendance.attended}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Tidak Hadir</span>
                                <span className="font-medium text-red-600">{courseData.attendance.total - courseData.attendance.attended}</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-xl shadow-lg p-6" data-aos="fade-left" data-aos-delay="200">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Aksi Cepat</h3>

                        <div className="space-y-3">
                            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                                Lihat Riwayat Kehadiran
                            </button>
                            <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                                Download Materi
                            </button>
                            <button className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                                Forum Diskusi
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetails;
