import React, { useState } from "react";
import Card from "components/card";
import {
    MdArrowBack,
    MdQrCode,
    MdPerson,
    MdTimer,
    MdCheckCircle,
    MdCancel,
    MdVisibility,
    MdRefresh,
    MdSave,
    MdStop,
} from "react-icons/md";

const TakeAttendanceView = ({ course, onBack }) => {
    const [activeMethod, setActiveMethod] = useState("qr");
    const [sessionStatus, setSessionStatus] = useState("ready"); // ready, active, completed
    const [attendanceData, setAttendanceData] = useState([]);

    if (!course) return null;

    // Generate mock students for demonstration
    const students = Array.from({ length: course.students }, (_, index) => ({
        id: index + 1,
        name: `Mahasiswa ${index + 1}`,
        nim: `230${String(index + 1).padStart(3, '0')}`,
        status: sessionStatus === "active" ? (Math.random() > 0.2 ? "present" : "absent") : "pending",
        timestamp: sessionStatus === "active" ? new Date() : null
    }));

    const handleStartSession = () => {
        setSessionStatus("active");
        setAttendanceData(students.map(student => ({
            ...student,
            status: Math.random() > 0.2 ? "present" : "absent"
        })));
    };

    const handleEndSession = () => {
        setSessionStatus("completed");
    };

    const getMethodIcon = (method) => {
        switch (method) {
            case "qr": return MdQrCode;
            case "face": return MdVisibility;
            default: return MdPerson;
        }
    };

    const presentCount = attendanceData.filter(s => s.status === "present").length;
    const absentCount = attendanceData.filter(s => s.status === "absent").length;

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
                                Ambil Absensi - {course.code}
                            </h1>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                {course.name} • Pertemuan ke-{course.completedSessions + 1}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex space-x-2">
                    {sessionStatus === "ready" && (
                        <button
                            onClick={handleStartSession}
                            className="py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                        >
                            <MdTimer className="mr-2 h-4 w-4" /> Mulai Sesi
                        </button>
                    )}
                    {sessionStatus === "active" && (
                        <>
                            <button className="py-2 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center">
                                <MdRefresh className="mr-2 h-4 w-4" /> Refresh
                            </button>
                            <button
                                onClick={handleEndSession}
                                className="py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
                            >
                                <MdStop className="mr-2 h-4 w-4" /> Selesai
                            </button>
                        </>
                    )}
                    {sessionStatus === "completed" && (
                        <button className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
                            <MdSave className="mr-2 h-4 w-4" /> Simpan
                        </button>
                    )}
                </div>
            </div>

            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
                <Card extra="!flex flex-col items-center p-5" data-aos="fade-up">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                        <MdTimer className="h-8 w-8 text-blue-500" />
                    </div>
                    <p className="mt-4 text-xl font-bold text-navy-700 dark:text-white">
                        {sessionStatus === "ready" ? "Siap" : sessionStatus === "active" ? "Aktif" : "Selesai"}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">Status Sesi</p>
                </Card>

                <Card extra="!flex flex-col items-center p-5" data-aos="fade-up" data-aos-delay="100">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                        <MdCheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                    <p className="mt-4 text-xl font-bold text-navy-700 dark:text-white">{presentCount}</p>
                    <p className="mt-1 text-sm text-gray-600">Hadir</p>
                </Card>

                <Card extra="!flex flex-col items-center p-5" data-aos="fade-up" data-aos-delay="200">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                        <MdCancel className="h-8 w-8 text-red-500" />
                    </div>
                    <p className="mt-4 text-xl font-bold text-navy-700 dark:text-white">{absentCount}</p>
                    <p className="mt-1 text-sm text-gray-600">Tidak Hadir</p>
                </Card>

                <Card extra="!flex flex-col items-center p-5" data-aos="fade-up" data-aos-delay="300">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                        <MdPerson className="h-8 w-8 text-purple-500" />
                    </div>
                    <p className="mt-4 text-xl font-bold text-navy-700 dark:text-white">
                        {presentCount > 0 ? Math.round((presentCount / course.students) * 100) : 0}%
                    </p>
                    <p className="mt-1 text-sm text-gray-600">Persentase</p>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Attendance Method Selection */}
                <Card extra="p-6" data-aos="fade-up">
                    <h3 className="text-lg font-bold text-navy-700 dark:text-white mb-4">
                        Metode Absensi
                    </h3>
                    <div className="space-y-3">
                        {[
                            { id: "qr", name: "QR Code", desc: "Scan QR code dengan smartphone" },
                            { id: "face", name: "Face Recognition", desc: "Deteksi wajah otomatis" },
                            { id: "manual", name: "Manual", desc: "Input manual oleh dosen" }
                        ].map((method) => {
                            const IconComponent = getMethodIcon(method.id);
                            return (
                                <button
                                    key={method.id}
                                    onClick={() => setActiveMethod(method.id)}
                                    className={`w-full p-4 rounded-lg border-2 transition-all ${activeMethod === method.id
                                            ? "border-indigo-500 bg-indigo-50"
                                            : "border-gray-200 hover:border-gray-300"
                                        }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <IconComponent className={`h-6 w-6 ${activeMethod === method.id ? "text-indigo-600" : "text-gray-400"
                                            }`} />
                                        <div className="text-left">
                                            <p className={`font-medium ${activeMethod === method.id ? "text-indigo-900" : "text-gray-900"
                                                }`}>
                                                {method.name}
                                            </p>
                                            <p className="text-sm text-gray-500">{method.desc}</p>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </Card>

                {/* Attendance Interface */}
                <Card extra="p-6 lg:col-span-2" data-aos="fade-up" data-aos-delay="100">
                    <h3 className="text-lg font-bold text-navy-700 dark:text-white mb-4">
                        Interface Absensi
                    </h3>

                    {sessionStatus === "ready" && (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">⏱️</div>
                            <h4 className="text-xl font-semibold text-gray-700 mb-2">
                                Sesi Belum Dimulai
                            </h4>
                            <p className="text-gray-500 mb-6">
                                Klik "Mulai Sesi" untuk memulai proses absensi
                            </p>
                            <button
                                onClick={handleStartSession}
                                className="py-3 px-6 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center mx-auto"
                            >
                                <MdTimer className="mr-2 h-5 w-5" /> Mulai Sesi Absensi
                            </button>
                        </div>
                    )}

                    {sessionStatus === "active" && activeMethod === "qr" && (
                        <div className="text-center py-8">
                            <div className="w-48 h-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg mx-auto mb-4 flex items-center justify-center">
                                <div className="text-center">
                                    <MdQrCode className="h-20 w-20 text-gray-400 mx-auto mb-2" />
                                    <p className="text-sm text-gray-500">QR Code akan muncul di sini</p>
                                </div>
                            </div>
                            <p className="text-lg font-semibold text-gray-700 mb-2">
                                Tunjukkan QR Code ke Mahasiswa
                            </p>
                            <p className="text-gray-500">
                                Mahasiswa dapat scan QR code ini untuk melakukan absensi
                            </p>
                        </div>
                    )}

                    {sessionStatus === "active" && activeMethod === "face" && (
                        <div className="text-center py-8">
                            <div className="w-full h-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg mb-4 flex items-center justify-center">
                                <div className="text-center">
                                    <MdVisibility className="h-20 w-20 text-gray-400 mx-auto mb-2" />
                                    <p className="text-sm text-gray-500">Camera feed akan muncul di sini</p>
                                </div>
                            </div>
                            <p className="text-lg font-semibold text-gray-700 mb-2">
                                Face Recognition Aktif
                            </p>
                            <p className="text-gray-500">
                                Sistem akan mendeteksi wajah mahasiswa secara otomatis
                            </p>
                        </div>
                    )}

                    {sessionStatus === "completed" && (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">✅</div>
                            <h4 className="text-xl font-semibold text-gray-700 mb-2">
                                Sesi Absensi Selesai
                            </h4>
                            <p className="text-gray-500 mb-4">
                                {presentCount} dari {course.students} mahasiswa hadir ({Math.round((presentCount / course.students) * 100)}%)
                            </p>
                            <div className="flex space-x-3 justify-center">
                                <button className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
                                    <MdSave className="mr-2 h-4 w-4" /> Simpan Data
                                </button>
                                <button onClick={onBack} className="py-2 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                                    Kembali
                                </button>
                            </div>
                        </div>
                    )}
                </Card>
            </div>

            {/* Student List */}
            {sessionStatus !== "ready" && (
                <Card extra="p-6 mt-6" data-aos="fade-up">
                    <h3 className="text-lg font-bold text-navy-700 dark:text-white mb-4">
                        Daftar Kehadiran
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        NIM
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Nama
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Waktu
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {attendanceData.map((student) => (
                                    <tr key={student.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {student.nim}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {student.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${student.status === "present"
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                                }`}>
                                                {student.status === "present" ? "Hadir" : "Tidak Hadir"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {student.timestamp ? student.timestamp.toLocaleTimeString('id-ID') : "-"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default TakeAttendanceView;
