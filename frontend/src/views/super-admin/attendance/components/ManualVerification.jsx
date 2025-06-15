import React, { useEffect, useState } from "react";
import { MdSearch, MdCalendarToday, MdVerified, MdClose, MdPersonAdd, MdPerson, MdNoteAdd } from "react-icons/md";
import AOS from "aos";
import "aos/dist/aos.css";

const ManualVerification = () => {
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedCourse, setSelectedCourse] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSession, setSelectedSession] = useState("");
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [reason, setReason] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
        });
    }, []);

    // Dummy data
    const courses = [
        { id: "", name: "Pilih Mata Kuliah" },
        { id: "cs101", name: "Pemrograman Web" },
        { id: "cs102", name: "Algoritma dan Struktur Data" },
        { id: "cs103", name: "Basis Data" },
        { id: "cs104", name: "Kecerdasan Buatan" },
    ];

    const sessions = [
        { id: "", time: "Pilih Sesi" },
        { id: "s1", time: "08:00 - 11:00 (Pagi)" },
        { id: "s2", time: "13:00 - 15:30 (Siang)" },
        { id: "s3", time: "15:30 - 18:00 (Sore)" },
    ];

    const students = [
        {
            id: 1,
            nim: "2021010101",
            name: "Ahmad Fauzi",
            program: "Teknik Informatika",
            status: "Aktif",
            lastAttendance: "2 jam yang lalu"
        },
        {
            id: 2,
            nim: "2021010102",
            name: "Siti Nurhaliza",
            program: "Teknik Informatika",
            status: "Aktif",
            lastAttendance: "5 jam yang lalu"
        },
        {
            id: 3,
            nim: "2021010201",
            name: "Budi Santoso",
            program: "Sistem Informasi",
            status: "Aktif",
            lastAttendance: "1 hari yang lalu"
        },
        {
            id: 4,
            nim: "2020010101",
            name: "Indah Permata",
            program: "Teknik Informatika",
            status: "Aktif",
            lastAttendance: "2 hari yang lalu"
        },
        {
            id: 5,
            nim: "2022010101",
            name: "Dewi Lestari",
            program: "Teknik Informatika",
            status: "Aktif",
            lastAttendance: "1 jam yang lalu"
        }
    ];

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.nim.includes(searchTerm)
    );

    const handleVerify = () => {
        setIsModalOpen(true);
    };

    const handleSubmit = (status) => {
        // Here we would submit the attendance record
        setIsModalOpen(false);
        setShowConfirmation(true);
        setTimeout(() => setShowConfirmation(false), 3000);
    };

    return (
        <div className="p-4 md:p-8">
            <div className="mb-8" data-aos="fade-down">
                <h1 className="text-3xl font-bold text-gray-800">Verifikasi Absensi Manual</h1>
                <p className="text-gray-600">Tambahkan atau verifikasi absensi mahasiswa secara manual</p>
            </div>

            {/* Selection Form */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6" data-aos="fade-up">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex-1">
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                        <div className="relative">
                            <MdCalendarToday className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="date"
                                id="date"
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex-1">
                        <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-1">Mata Kuliah</label>
                        <select
                            id="course"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none"
                            value={selectedCourse}
                            onChange={(e) => setSelectedCourse(e.target.value)}
                        >
                            {courses.map(course => (
                                <option key={course.id} value={course.id}>{course.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex-1">
                        <label htmlFor="session" className="block text-sm font-medium text-gray-700 mb-1">Sesi</label>
                        <select
                            id="session"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none"
                            value={selectedSession}
                            onChange={(e) => setSelectedSession(e.target.value)}
                        >
                            {sessions.map(session => (
                                <option key={session.id} value={session.id}>{session.time}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-grow">
                        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Cari Mahasiswa</label>
                        <div className="relative">
                            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                id="search"
                                placeholder="Nama atau NIM mahasiswa"
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
                        disabled={!selectedCourse || !selectedDate || !selectedSession}
                    >
                        <MdSearch className="mr-2" /> Cari
                    </button>
                </div>
            </div>

            {/* Students List */}
            {(selectedCourse && selectedDate && selectedSession) && (
                <div className="bg-white rounded-xl shadow-md overflow-hidden" data-aos="fade-up" data-aos-delay="100">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800">Daftar Mahasiswa</h2>
                        <p className="text-sm text-gray-600">
                            Mata Kuliah: {courses.find(c => c.id === selectedCourse)?.name || '-'} |
                            Sesi: {sessions.find(s => s.id === selectedSession)?.time || '-'} |
                            Tanggal: {selectedDate}
                        </p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIM</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program Studi</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredStudents.map((student) => (
                                    <tr key={student.id} className="hover:bg-gray-50 transition-colors duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.nim}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.program}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${student.status === "Aktif" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                                                }`}>
                                                {student.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                className="text-blue-600 hover:text-blue-900 mr-3"
                                                onClick={() => {
                                                    setSelectedStudent(student);
                                                    handleVerify();
                                                }}
                                            >
                                                <MdVerified className="h-5 w-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredStudents.length === 0 && (
                        <div className="p-8 text-center">
                            <p className="text-gray-500">No students found matching your search criteria.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Verification Modal */}
            {isModalOpen && selectedStudent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6" data-aos="zoom-in">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Verifikasi Absensi Manual</h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <MdClose className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center mb-2">
                                <MdPerson className="h-5 w-5 text-gray-500 mr-2" />
                                <p className="text-gray-800 font-medium">{selectedStudent.name}</p>
                            </div>
                            <p className="text-gray-600 text-sm">NIM: {selectedStudent.nim}</p>
                            <p className="text-gray-600 text-sm">Program: {selectedStudent.program}</p>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">Catatan / Alasan (Opsional)</label>
                            <textarea
                                id="reason"
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                placeholder="Masukkan catatan atau alasan..."
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                            ></textarea>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center justify-center hover:bg-green-700 transition-colors"
                                onClick={() => handleSubmit('present')}
                            >
                                <MdVerified className="mr-2" /> Hadir
                            </button>
                            <button
                                className="bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center justify-center hover:bg-yellow-700 transition-colors"
                                onClick={() => handleSubmit('late')}
                            >
                                <MdVerified className="mr-2" /> Terlambat
                            </button>
                            <button
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
                                onClick={() => handleSubmit('excused')}
                            >
                                <MdNoteAdd className="mr-2" /> Izin/Sakit
                            </button>
                            <button
                                className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center justify-center hover:bg-red-700 transition-colors"
                                onClick={() => handleSubmit('absent')}
                            >
                                <MdClose className="mr-2" /> Tidak Hadir
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation Toast */}
            {showConfirmation && (
                <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center" data-aos="fade-left">
                    <MdVerified className="h-5 w-5 mr-2" />
                    <p>Absensi berhasil dicatat!</p>
                </div>
            )}

            {/* Instructions */}
            <div className="mt-6 bg-blue-50 rounded-xl p-6 border border-blue-100" data-aos="fade-up" data-aos-delay="200">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Instruksi Verifikasi Manual</h3>
                <ul className="list-disc pl-5 space-y-1 text-blue-700">
                    <li>Pilih tanggal, mata kuliah, dan sesi terlebih dahulu</li>
                    <li>Cari mahasiswa menggunakan nama atau NIM</li>
                    <li>Klik ikon verifikasi untuk menandai kehadiran</li>
                    <li>Pilih status kehadiran (Hadir/Terlambat/Izin/Tidak Hadir)</li>
                    <li>Tambahkan catatan jika diperlukan</li>
                    <li>Semua verifikasi manual akan dicatat dalam log sistem</li>
                </ul>
            </div>
        </div>
    );
};

export default ManualVerification;
