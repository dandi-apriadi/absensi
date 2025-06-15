import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Card from "components/card";
import {
    MdAccessTime,
    MdPeople,
    MdRoom,
    MdQrCode,
    MdFace,
    MdList,
    MdRefresh,
    MdCalendarToday,
    MdMoreVert,
    MdContentPaste,
    MdEditNote,
    MdCancel,
    MdInfo,
    MdCheckCircle
} from "react-icons/md";

// Dummy Data for active sessions
const activeSessions = [
    {
        id: 1,
        course: "Algoritma dan Pemrograman",
        topic: "Algoritma Sorting",
        date: "2023-10-28",
        startTime: "08:00",
        endTime: "09:40",
        room: "Lab 301",
        totalStudents: 35,
        attendedCount: 32,
        notAttendedCount: 3,
        status: "ongoing",
        progress: 45, // percentage of elapsed time
        attendanceMethod: "qr",
        qrExpiry: 10, // minutes
    },
    {
        id: 2,
        course: "Basis Data",
        topic: "Normalisasi Database",
        date: "2023-10-28",
        startTime: "10:00",
        endTime: "11:40",
        room: "Lab 302",
        totalStudents: 42,
        attendedCount: 0,
        notAttendedCount: 42,
        status: "upcoming",
        progress: 0,
        attendanceMethod: "face",
        qrExpiry: 15,
    },
    {
        id: 3,
        course: "Pemrograman Web",
        topic: "JavaScript Lanjutan",
        date: "2023-10-28",
        startTime: "13:00",
        endTime: "14:40",
        room: "Lab 303",
        totalStudents: 28,
        attendedCount: 0,
        notAttendedCount: 28,
        status: "upcoming",
        progress: 0,
        attendanceMethod: "qr",
        qrExpiry: 15,
    }
];

const ActiveSessions = () => {
    const [sessions, setSessions] = useState(activeSessions);
    const [dropdownOpen, setDropdownOpen] = useState(null);
    const [qrModalOpen, setQrModalOpen] = useState(false);
    const [selectedSession, setSelectedSession] = useState(null);

    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: "ease-in-out",
            once: true,
        });
    }, []);

    const handleToggleDropdown = (sessionId) => {
        if (dropdownOpen === sessionId) {
            setDropdownOpen(null);
        } else {
            setDropdownOpen(sessionId);
        }
    };

    const handleShowQR = (session) => {
        setSelectedSession(session);
        setQrModalOpen(true);
        setDropdownOpen(null);
    };

    const formatTimeRange = (startTime, endTime) => {
        return `${startTime} - ${endTime}`;
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'ongoing':
                return "text-green-600 bg-green-100";
            case 'upcoming':
                return "text-blue-600 bg-blue-100";
            default:
                return "text-gray-600 bg-gray-100";
        }
    };

    const formatDate = (dateString) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    const calcRemainingTime = (startTime, endTime) => {
        const now = new Date();
        const today = now.toISOString().split('T')[0];

        const sessionStart = new Date(`${today}T${startTime}:00`);
        const sessionEnd = new Date(`${today}T${endTime}:00`);

        if (now < sessionStart) {
            // Session hasn't started yet
            const diff = Math.floor((sessionStart - now) / 60000); // in minutes
            return `Dimulai dalam ${diff} menit`;
        } else if (now > sessionEnd) {
            // Session has ended
            return "Sesi telah selesai";
        } else {
            // Session is ongoing
            const diff = Math.floor((sessionEnd - now) / 60000); // in minutes
            return `${diff} menit tersisa`;
        }
    };

    return (
        <div className="mt-3">
            <div className="mb-5" data-aos="fade-down">
                <h1 className="text-3xl font-bold text-navy-700 dark:text-white">
                    Sesi Aktif
                </h1>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Kelola sesi perkuliahan yang sedang aktif atau akan datang
                </p>
            </div>

            {sessions.length > 0 ? (
                <div className="space-y-5" data-aos="fade-up" data-aos-delay="100">
                    {sessions.map((session, index) => (
                        <Card
                            key={session.id}
                            extra={`p-4 border-2 ${session.status === 'ongoing' ? 'border-green-200' : 'border-transparent'} hover:border-indigo-100 hover:shadow-md transition-all duration-200`}
                            data-aos="fade-up"
                            data-aos-delay={index * 100}
                        >
                            <div className="flex flex-col lg:flex-row">
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center">
                                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getStatusColor(session.status)}`}>
                                                {session.status === 'ongoing' ? 'Berlangsung' : 'Akan Datang'}
                                            </span>
                                            <span className="ml-2 text-xs font-medium text-gray-500">
                                                {calcRemainingTime(session.startTime, session.endTime)}
                                            </span>
                                        </div>

                                        <div className="relative">
                                            <button
                                                onClick={() => handleToggleDropdown(session.id)}
                                                className="p-1.5 rounded-full hover:bg-gray-100"
                                            >
                                                <MdMoreVert className="h-5 w-5 text-gray-500" />
                                            </button>

                                            {dropdownOpen === session.id && (
                                                <div className="absolute right-0 mt-1 py-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                                                    <button
                                                        onClick={() => handleShowQR(session)}
                                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                                    >
                                                        <MdQrCode className="mr-2" /> Tampilkan QR Code
                                                    </button>
                                                    <button
                                                        onClick={() => alert('Fitur belum tersedia')}
                                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                                    >
                                                        <MdEditNote className="mr-2" /> Edit Sesi
                                                    </button>
                                                    <button
                                                        onClick={() => alert('Fitur belum tersedia')}
                                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                                    >
                                                        <MdList className="mr-2" /> Daftar Hadir
                                                    </button>
                                                    <button
                                                        onClick={() => alert('Fitur belum tersedia')}
                                                        className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 flex items-center text-red-600"
                                                    >
                                                        <MdCancel className="mr-2" /> Batalkan Sesi
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-semibold text-navy-700 dark:text-white mb-2">
                                        {session.course} - {session.topic}
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <MdCalendarToday className="mr-2 text-gray-400" />
                                            {formatDate(session.date)}
                                        </div>

                                        <div className="flex items-center text-sm text-gray-600">
                                            <MdAccessTime className="mr-2 text-gray-400" />
                                            {formatTimeRange(session.startTime, session.endTime)}
                                        </div>

                                        <div className="flex items-center text-sm text-gray-600">
                                            <MdRoom className="mr-2 text-gray-400" />
                                            {session.room}
                                        </div>
                                    </div>

                                    <div className="flex flex-col space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <MdPeople className="mr-2 text-gray-400" />
                                                <span>Kehadiran: {session.attendedCount}/{session.totalStudents}</span>
                                            </div>

                                            <div className="flex items-center text-sm">
                                                <span className="text-green-600 font-medium">{Math.round((session.attendedCount / session.totalStudents) * 100) || 0}%</span>
                                            </div>
                                        </div>

                                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-green-500 rounded-full"
                                                style={{ width: `${(session.attendedCount / session.totalStudents) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    {session.status === 'ongoing' && (
                                        <div className="mt-4">
                                            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                                                <span>Progress Sesi</span>
                                                <span>{session.progress}%</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-indigo-500 rounded-full"
                                                    style={{ width: `${session.progress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4 lg:mt-0 lg:ml-6 lg:flex lg:flex-col lg:justify-center lg:border-l lg:border-gray-200 lg:pl-6 flex-shrink-0">
                                    <div className="flex items-center mb-4">
                                        <div className="rounded-full bg-indigo-100 p-2">
                                            {session.attendanceMethod === 'qr' ? (
                                                <MdQrCode className="h-5 w-5 text-indigo-600" />
                                            ) : (
                                                <MdFace className="h-5 w-5 text-indigo-600" />
                                            )}
                                        </div>
                                        <div className="ml-3">
                                            <span className="text-xs text-gray-500">Metode Absensi</span>
                                            <p className="text-sm font-medium">
                                                {session.attendanceMethod === 'qr' ? 'QR Code' : 'Face Recognition'}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleShowQR(session)}
                                        className={`py-2 px-4 rounded-lg flex items-center justify-center w-full ${session.status === 'ongoing'
                                            ? "bg-indigo-600 text-white hover:bg-indigo-700"
                                            : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                                            }`}
                                    >
                                        {session.attendanceMethod === 'qr' ? (
                                            <>
                                                <MdQrCode className="mr-2" />
                                                Tampilkan QR
                                            </>
                                        ) : (
                                            <>
                                                <MdFace className="mr-2" />
                                                Mulai Pengenalan
                                            </>
                                        )}
                                    </button>

                                    <button
                                        className="mt-2 py-2 px-4 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 flex items-center justify-center w-full"
                                        onClick={() => alert('Fitur belum tersedia')}
                                    >
                                        <MdContentPaste className="mr-2" />
                                        Daftar Hadir
                                    </button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card extra="p-12 text-center" data-aos="fade-up">
                    <div className="flex flex-col items-center justify-center">
                        <div className="rounded-full bg-gray-100 p-4 mb-4">
                            <MdAccessTime className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-medium text-gray-900 mb-2">Tidak Ada Sesi Aktif</h3>
                        <p className="text-gray-500 mb-6">Anda tidak memiliki sesi perkuliahan aktif atau yang akan datang saat ini.</p>
                        <a
                            href="/lecturer/sessions"
                            className="py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                        >
                            Kelola Sesi
                        </a>
                    </div>
                </Card>
            )}

            {/* QR Code Modal */}
            {qrModalOpen && selectedSession && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                    <div className="relative bg-white rounded-xl shadow-lg w-full max-w-md" data-aos="zoom-in">
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                QR Code Absensi
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">
                                {selectedSession.course} - {selectedSession.topic}
                            </p>

                            <div className="bg-white p-4 rounded-xl flex items-center justify-center mb-4">
                                <div className="border-4 border-indigo-200 rounded-xl p-4">
                                    <img
                                        src="/qr-placeholder.png"
                                        alt="QR Code"
                                        className="w-64 h-64"
                                        onError={(e) => {
                                            e.target.src = "https://via.placeholder.com/250?text=QR+Code";
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="text-center mb-4">
                                <div className="mb-2">
                                    <span className="text-xs text-gray-500">QR Code berlaku sampai</span>
                                    <div className="text-2xl font-semibold text-indigo-600">{selectedSession.qrExpiry} menit</div>
                                </div>

                                <button
                                    onClick={() => alert('QR Code diperbarui')}
                                    className="py-2 px-4 bg-white border border-gray-300 text-indigo-600 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center mx-auto"
                                >
                                    <MdRefresh className="mr-2" /> Perbarui QR Code
                                </button>
                            </div>

                            <div className="p-3 bg-indigo-50 rounded-lg mb-4">
                                <div className="flex items-start">
                                    <MdInfo className="h-5 w-5 text-indigo-600 mt-0.5 mr-3 flex-shrink-0" />
                                    <p className="text-sm text-indigo-800">
                                        Tampilkan QR Code ini kepada mahasiswa untuk melakukan absensi.
                                        QR Code akan berubah secara otomatis setiap {selectedSession.qrExpiry} menit untuk keamanan.
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-between">
                                <button
                                    onClick={() => setQrModalOpen(false)}
                                    className="py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    Tutup
                                </button>

                                <button
                                    onClick={() => alert('Fitur belum tersedia')}
                                    className="py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                                >
                                    <MdContentPaste className="mr-2" /> Lihat Daftar Hadir
                                </button>
                            </div>
                        </div>

                        <button
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
                            onClick={() => setQrModalOpen(false)}
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActiveSessions;
