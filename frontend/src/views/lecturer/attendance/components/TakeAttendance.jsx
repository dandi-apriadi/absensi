import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import Card from "components/card";
import {
    MdQrCode,
    MdFace,
    MdPhoto,
    MdTimer,
    MdRefresh,
    MdDownload,
    MdPersonSearch,
    MdInfo,
    MdAccessTime,
    MdPeople,
    MdRoom,
    MdVideocam,
    MdDevices,
    MdCheck,
    MdContentPaste,
    MdTune,
    MdHistory
} from "react-icons/md";

// Dummy Data
const courses = [
    { id: 1, code: "CS-101", name: "Algoritma dan Pemrograman", students: 35 },
    { id: 2, code: "CS-102", name: "Basis Data", students: 42 },
    { id: 3, code: "CS-103", name: "Pemrograman Web", students: 28 },
    { id: 4, code: "CS-104", name: "Kecerdasan Buatan", students: 32 },
];

const presentStudents = [
    { id: 1, nim: "20210001", name: "Budi Santoso", time: "08:02", verified: true },
    { id: 2, nim: "20210002", name: "Siti Nuraini", time: "08:05", verified: true },
    { id: 5, nim: "20210005", name: "Farhan Abdullah", time: "08:10", verified: true },
    { id: 6, nim: "20210006", name: "Anisa Wulandari", time: "08:12", verified: true },
    { id: 8, nim: "20210008", name: "Ratna Sari", time: "08:15", verified: true },
];

const TakeAttendance = () => {
    const [searchParams] = useSearchParams();
    const courseIdParam = searchParams.get("course");
    const methodParam = searchParams.get("method") || "qr";

    const [selectedCourse, setSelectedCourse] = useState(courseIdParam || "");
    const [attendanceMethod, setAttendanceMethod] = useState(methodParam);
    const [isSessionStarted, setIsSessionStarted] = useState(false);
    const [showQR, setShowQR] = useState(false);
    const [showCamera, setShowCamera] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [timer, setTimer] = useState(300);
    const [attendees, setAttendees] = useState([]);
    const [cameraAccess, setCameraAccess] = useState(true);
    const [qrValidTime, setQrValidTime] = useState(3);

    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: "ease-in-out",
            once: true,
        });
    }, []);

    useEffect(() => {
        if (isSessionStarted) {
            setAttendees(presentStudents);

            // QR code timer countdown
            if (attendanceMethod === "qr" && showQR) {
                const countdown = setInterval(() => {
                    setTimer((prev) => {
                        if (prev <= 1) {
                            refreshQR();
                            return 300; // Reset to 5 minutes
                        }
                        return prev - 1;
                    });
                }, 1000);

                return () => clearInterval(countdown);
            }
        } else {
            setAttendees([]);
        }
    }, [isSessionStarted, showQR, attendanceMethod]);

    // Format seconds to MM:SS
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const startAttendanceSession = () => {
        setIsSessionStarted(true);
        if (attendanceMethod === "qr") {
            setShowQR(true);
        } else {
            setShowCamera(true);
        }
    };

    const endAttendanceSession = () => {
        if (window.confirm("Anda yakin ingin mengakhiri sesi absensi ini?")) {
            setIsSessionStarted(false);
            setShowQR(false);
            setShowCamera(false);
        }
    };

    const refreshQR = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setTimer(qrValidTime * 60); // Reset timer based on selected time
        }, 1000);
    };

    return (
        <div className="mt-3">
            <div className="mb-5" data-aos="fade-down">
                <h1 className="text-3xl font-bold text-navy-700 dark:text-white">
                    Ambil Absensi
                </h1>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Ambil absensi kehadiran mahasiswa melalui QR Code atau Face Recognition
                </p>
            </div>

            {!isSessionStarted ? (
                <Card extra="p-5" data-aos="fade-up">
                    <div className="mb-6">
                        <h4 className="text-lg font-bold text-navy-700 dark:text-white mb-3">
                            Pengaturan Absensi
                        </h4>

                        <div className="space-y-6">
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-2">
                                    Pilih Mata Kuliah
                                </label>
                                <select
                                    className="w-full rounded-lg border border-gray-300 p-3 text-sm outline-none focus:border-indigo-500"
                                    value={selectedCourse}
                                    onChange={(e) => setSelectedCourse(e.target.value)}
                                    required
                                >
                                    <option value="">Pilih Mata Kuliah</option>
                                    {courses.map((course) => (
                                        <option key={course.id} value={course.id}>
                                            {course.code} - {course.name} ({course.students} mahasiswa)
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-2">
                                    Metode Absensi
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div
                                        className={`p-4 border-2 rounded-xl cursor-pointer flex items-center ${attendanceMethod === "qr"
                                                ? "border-indigo-500 bg-indigo-50"
                                                : "border-gray-200 hover:bg-gray-50"
                                            }`}
                                        onClick={() => setAttendanceMethod("qr")}
                                    >
                                        <div className="rounded-full bg-indigo-100 p-3 mr-3">
                                            <MdQrCode className="h-6 w-6 text-indigo-600" />
                                        </div>
                                        <div>
                                            <h5 className="text-base font-medium">QR Code</h5>
                                            <p className="text-sm text-gray-600">Tampilkan QR code untuk dipindai mahasiswa</p>
                                        </div>
                                    </div>

                                    <div
                                        className={`p-4 border-2 rounded-xl cursor-pointer flex items-center ${attendanceMethod === "face"
                                                ? "border-indigo-500 bg-indigo-50"
                                                : "border-gray-200 hover:bg-gray-50"
                                            }`}
                                        onClick={() => setAttendanceMethod("face")}
                                    >
                                        <div className="rounded-full bg-purple-100 p-3 mr-3">
                                            <MdFace className="h-6 w-6 text-purple-600" />
                                        </div>
                                        <div>
                                            <h5 className="text-base font-medium">Face Recognition</h5>
                                            <p className="text-sm text-gray-600">Gunakan pengenalan wajah untuk absensi</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {attendanceMethod === "qr" && (
                                <div>
                                    <label className="text-sm font-medium text-gray-700 block mb-2">
                                        QR Code Valid Selama
                                    </label>
                                    <select
                                        className="w-full rounded-lg border border-gray-300 p-3 text-sm outline-none focus:border-indigo-500"
                                        value={qrValidTime}
                                        onChange={(e) => setQrValidTime(parseInt(e.target.value))}
                                    >
                                        <option value={1}>1 menit</option>
                                        <option value={3}>3 menit</option>
                                        <option value={5}>5 menit</option>
                                        <option value={10}>10 menit</option>
                                    </select>
                                    <p className="text-xs text-gray-500 mt-1">
                                        QR Code akan berubah setiap {qrValidTime} menit untuk keamanan
                                    </p>
                                </div>
                            )}

                            {attendanceMethod === "face" && (
                                <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-lg">
                                    <div className="flex items-start">
                                        <MdInfo className="text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                                        <p className="text-sm text-yellow-700">
                                            Pastikan pencahayaan ruangan cukup terang dan kamera laptop/komputer Anda berfungsi dengan baik untuk hasil pengenalan wajah yang optimal.
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="pt-4 border-t border-gray-200">
                                <button
                                    onClick={startAttendanceSession}
                                    disabled={!selectedCourse}
                                    className={`w-full py-3 rounded-lg text-white font-medium flex items-center justify-center ${selectedCourse
                                            ? "bg-indigo-600 hover:bg-indigo-700"
                                            : "bg-indigo-300 cursor-not-allowed"
                                        }`}
                                >
                                    {attendanceMethod === "qr" ? (
                                        <>
                                            <MdQrCode className="mr-2" /> Mulai Sesi dengan QR Code
                                        </>
                                    ) : (
                                        <>
                                            <MdFace className="mr-2" /> Mulai Sesi dengan Face Recognition
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </Card>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    <div className="lg:col-span-2">
                        <Card extra="p-5" data-aos="fade-up">
                            <div className="mb-4 flex items-center justify-between">
                                <h4 className="text-lg font-bold text-navy-700 dark:text-white">
                                    {attendanceMethod === "qr" ? "QR Code Absensi" : "Face Recognition"}
                                </h4>

                                <div>
                                    <button
                                        onClick={endAttendanceSession}
                                        className="py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                                    >
                                        Akhiri Sesi
                                    </button>
                                </div>
                            </div>

                            <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div className="flex items-center text-sm text-gray-600">
                                    <MdAccessTime className="mr-2 text-gray-400" />
                                    {new Date().toLocaleTimeString()}
                                </div>

                                <div className="flex items-center text-sm text-gray-600">
                                    <MdPeople className="mr-2 text-gray-400" />
                                    {attendees.length} dari {courses.find(c => c.id == selectedCourse)?.students || 0} hadir
                                </div>

                                <div className="flex items-center text-sm text-gray-600">
                                    <MdRoom className="mr-2 text-gray-400" />
                                    {attendanceMethod === "qr" ? "QR Code" : "Face Recognition"}
                                </div>
                            </div>

                            {attendanceMethod === "qr" && showQR ? (
                                <div className="flex flex-col items-center">
                                    <div className="bg-white p-4 rounded-xl mb-4 border-4 border-indigo-200">
                                        {isProcessing ? (
                                            <div className="flex items-center justify-center h-64 w-64">
                                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                                            </div>
                                        ) : (
                                            <img
                                                src="/qr-placeholder.png"
                                                alt="QR Code"
                                                className="h-64 w-64"
                                                onError={(e) => {
                                                    e.target.src = "https://via.placeholder.com/250?text=QR+Code";
                                                }}
                                            />
                                        )}
                                    </div>

                                    <div className="flex flex-col items-center mb-4">
                                        <p className="text-sm text-gray-500">QR Code berlaku hingga:</p>
                                        <div className="flex items-center">
                                            <MdTimer className="text-indigo-600 mr-1" />
                                            <span className="text-xl font-bold text-indigo-600">{formatTime(timer)}</span>
                                        </div>
                                        <button
                                            onClick={refreshQR}
                                            disabled={isProcessing}
                                            className="mt-4 py-2 px-4 bg-white border border-gray-300 text-indigo-600 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                                        >
                                            <MdRefresh className="mr-1" /> Perbarui QR Code
                                        </button>
                                    </div>

                                    <p className="text-sm text-center text-gray-500 max-w-md">
                                        Arahkan mahasiswa untuk memindai QR code ini menggunakan aplikasi mobile mereka untuk melakukan absensi
                                    </p>
                                </div>
                            ) : attendanceMethod === "face" && showCamera ? (
                                <div className="flex flex-col items-center">
                                    <div className="bg-gray-900 rounded-lg overflow-hidden mb-4 w-full aspect-video">
                                        {cameraAccess ? (
                                            <div className="flex flex-col items-center justify-center h-full">
                                                <MdVideocam className="h-12 w-12 text-gray-500 mb-2" />
                                                <p className="text-gray-300">Kamera Aktif</p>
                                                <p className="text-sm text-gray-500 mt-1">Arahkan wajah mahasiswa ke kamera untuk absensi</p>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-full">
                                                <MdDevices className="h-12 w-12 text-red-500 mb-2" />
                                                <p className="text-red-400">Tidak dapat mengakses kamera</p>
                                                <button className="mt-2 py-1 px-3 bg-indigo-600 text-white text-sm rounded-lg">
                                                    Izinkan Akses Kamera
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                        <button className="py-2 px-4 bg-white border border-gray-300 text-indigo-600 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center">
                                            <MdPhoto className="mr-2" /> Ambil Gambar
                                        </button>

                                        <button className="py-2 px-4 bg-white border border-gray-300 text-indigo-600 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center">
                                            <MdTune className="mr-2" /> Pengaturan Kamera
                                        </button>
                                    </div>
                                </div>
                            ) : null}
                        </Card>
                    </div>

                    <div>
                        <Card extra="p-5" data-aos="fade-up" data-aos-delay="100">
                            <div className="mb-3 flex items-center justify-between">
                                <h4 className="text-lg font-bold text-navy-700 dark:text-white flex items-center">
                                    <MdPeople className="mr-2 h-5 w-5" /> Mahasiswa Hadir
                                </h4>
                                <div className="text-sm text-gray-500">
                                    {attendees.length} / {courses.find(c => c.id == selectedCourse)?.students || 0}
                                </div>
                            </div>

                            <div className="relative mb-4">
                                <MdPersonSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Cari mahasiswa..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                            </div>

                            <div className="overflow-y-auto max-h-80 mb-4">
                                {attendees.length > 0 ? (
                                    <div className="space-y-3">
                                        {attendees.map((student) => (
                                            <div key={student.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">{student.name}</p>
                                                        <p className="text-xs text-gray-500">{student.nim}</p>
                                                    </div>
                                                    <div className="flex flex-col items-end">
                                                        <p className="text-xs text-gray-500">{student.time}</p>
                                                        {student.verified && (
                                                            <span className="text-xs text-green-600 flex items-center">
                                                                <MdCheck className="mr-0.5" /> Terverifikasi
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <MdInfo className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                                        <p className="text-gray-500">Belum ada mahasiswa yang hadir</p>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    className="py-2 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                                    onClick={() => alert('Fitur export belum tersedia')}
                                >
                                    <MdDownload className="mr-2" /> Export
                                </button>

                                <button
                                    className="py-2 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                                    onClick={() => alert('Fitur daftar hadir belum tersedia')}
                                >
                                    <MdContentPaste className="mr-2" /> Daftar
                                </button>
                            </div>
                        </Card>

                        <Link to="/lecturer/attendance/attendance-history" className="mt-3 block" data-aos="fade-up" data-aos-delay="200">
                            <Card extra="p-4 hover:bg-gray-50 transition-all duration-200">
                                <div className="flex items-center">
                                    <div className="rounded-full bg-blue-100 p-2 mr-3">
                                        <MdHistory className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h5 className="text-sm font-medium">Lihat Riwayat Absensi</h5>
                                        <p className="text-xs text-gray-500">Lihat semua riwayat absensi mahasiswa</p>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TakeAttendance;
