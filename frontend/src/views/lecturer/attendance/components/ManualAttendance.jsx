import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Card from "components/card";
import {
    MdVerified,
    MdSearch,
    MdCalendarToday,
    MdCheckCircle,
    MdCancel,
    MdSick,
    MdSave,
    MdRefresh,
    MdWarning,
    MdInfo
} from "react-icons/md";

// Dummy Data
const courses = [
    { id: 1, code: "CS-101", name: "Algoritma dan Pemrograman" },
    { id: 2, code: "CS-102", name: "Basis Data" },
    { id: 3, code: "CS-103", name: "Pemrograman Web" },
    { id: 4, code: "CS-104", name: "Kecerdasan Buatan" },
];

const sessions = [
    { id: 1, name: "Pertemuan 8: Algoritma Sorting", date: "2023-10-15" },
    { id: 2, name: "Pertemuan 9: Algoritma Greedy", date: "2023-10-22" },
    { id: 3, name: "Pertemuan 10: Dynamic Programming", date: "2023-10-29" },
];

const students = [
    { id: 1, nim: "20210001", name: "Budi Santoso", status: "present" },
    { id: 2, nim: "20210002", name: "Siti Nuraini", status: "present" },
    { id: 3, nim: "20210003", name: "Ahmad Rizki", status: "absent" },
    { id: 4, nim: "20210004", name: "Diana Putri", status: "leave", reason: "Sakit - Demam (Surat Dokter)" },
    { id: 5, nim: "20210005", name: "Farhan Abdullah", status: "present" },
    { id: 6, nim: "20210006", name: "Anisa Wulandari", status: "present" },
    { id: 7, nim: "20210007", name: "Dimas Pratama", status: "absent" },
    { id: 8, nim: "20210008", name: "Ratna Sari", status: "present" },
];

const ManualAttendance = () => {
    const [selectedCourse, setSelectedCourse] = useState("");
    const [selectedSession, setSelectedSession] = useState("");
    const [attendanceList, setAttendanceList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showSuccessMsg, setShowSuccessMsg] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: "ease-in-out",
            once: true,
        });
    }, []);

    useEffect(() => {
        // Reset attendance list when course or session changes
        if (selectedCourse && selectedSession) {
            setIsLoading(true);
            // Simulate API call delay
            setTimeout(() => {
                setAttendanceList(students);
                setIsLoading(false);
            }, 500);
        } else {
            setAttendanceList([]);
        }
    }, [selectedCourse, selectedSession]);

    const handleStatusChange = (studentId, newStatus) => {
        setAttendanceList(
            attendanceList.map(student =>
                student.id === studentId ? { ...student, status: newStatus } : student
            )
        );
        setHasChanges(true);
    };

    const handleSaveChanges = () => {
        // Simulate API call
        setIsLoading(true);
        setTimeout(() => {
            setShowSuccessMsg(true);
            setIsLoading(false);
            setHasChanges(false);
            setTimeout(() => setShowSuccessMsg(false), 3000);
        }, 1000);
    };

    const handleResetChanges = () => {
        // Reset to original data
        setIsLoading(true);
        setTimeout(() => {
            setAttendanceList(students);
            setIsLoading(false);
            setHasChanges(false);
        }, 500);
    };

    const filteredStudents = attendanceList.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.nim.includes(searchTerm)
    );

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    return (
        <div className="mt-3">
            <div className="mb-5" data-aos="fade-down">
                <h1 className="text-3xl font-bold text-navy-700 dark:text-white">
                    Absensi Manual
                </h1>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Input atau edit absensi mahasiswa secara manual
                </p>
            </div>

            <Card extra="p-5 mb-5" data-aos="fade-up">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-sm text-navy-700 dark:text-white font-medium mb-2 block">
                            Pilih Mata Kuliah
                        </label>
                        <select
                            className="w-full rounded-lg border border-gray-300 p-3 text-sm outline-none focus:border-indigo-500"
                            value={selectedCourse}
                            onChange={(e) => setSelectedCourse(e.target.value)}
                        >
                            <option value="">Pilih Mata Kuliah</option>
                            {courses.map((course) => (
                                <option key={course.id} value={course.id}>
                                    {course.code} - {course.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-sm text-navy-700 dark:text-white font-medium mb-2 block">
                            Pilih Pertemuan
                        </label>
                        <select
                            className="w-full rounded-lg border border-gray-300 p-3 text-sm outline-none focus:border-indigo-500"
                            value={selectedSession}
                            onChange={(e) => setSelectedSession(e.target.value)}
                            disabled={!selectedCourse}
                        >
                            <option value="">Pilih Pertemuan</option>
                            {sessions.map((session) => (
                                <option key={session.id} value={session.id}>
                                    {session.name} ({formatDate(session.date)})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </Card>

            {showSuccessMsg && (
                <div className="mb-5 p-4 bg-green-100 border border-green-200 rounded-lg flex items-start" data-aos="fade-up">
                    <MdCheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-2" />
                    <div>
                        <p className="text-green-800">Data absensi berhasil disimpan!</p>
                    </div>
                </div>
            )}

            {selectedCourse && selectedSession ? (
                <Card extra="p-5" data-aos="fade-up">
                    <div className="mb-6">
                        <div className="relative">
                            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Cari berdasarkan nama atau NIM..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                        </div>
                    ) : filteredStudents.length > 0 ? (
                        <>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Mahasiswa
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status Absensi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredStudents.map((student) => (
                                            <tr key={student.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                                            <div className="text-sm text-gray-500">{student.nim}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex justify-center space-x-2">
                                                        <button
                                                            onClick={() => handleStatusChange(student.id, "present")}
                                                            className={`p-2 rounded-md ${student.status === "present"
                                                                    ? "bg-green-100 text-green-800 border-2 border-green-500"
                                                                    : "bg-gray-100 text-gray-800 hover:bg-green-50"
                                                                }`}
                                                            title="Hadir"
                                                        >
                                                            <MdCheckCircle className="h-5 w-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusChange(student.id, "absent")}
                                                            className={`p-2 rounded-md ${student.status === "absent"
                                                                    ? "bg-red-100 text-red-800 border-2 border-red-500"
                                                                    : "bg-gray-100 text-gray-800 hover:bg-red-50"
                                                                }`}
                                                            title="Tidak Hadir"
                                                        >
                                                            <MdCancel className="h-5 w-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusChange(student.id, "leave")}
                                                            className={`p-2 rounded-md ${student.status === "leave"
                                                                    ? "bg-blue-100 text-blue-800 border-2 border-blue-500"
                                                                    : "bg-gray-100 text-gray-800 hover:bg-blue-50"
                                                                }`}
                                                            title="Izin"
                                                        >
                                                            <MdSick className="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                    {student.status === "leave" && student.reason && (
                                                        <div className="mt-2 text-xs text-gray-500 text-center">
                                                            Alasan: {student.reason}
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex justify-between mt-6">
                                <div>
                                    <button
                                        onClick={handleResetChanges}
                                        disabled={!hasChanges || isLoading}
                                        className={`py-2 px-4 rounded-lg flex items-center ${hasChanges && !isLoading
                                                ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                            }`}
                                    >
                                        <MdRefresh className="mr-2" /> Reset Perubahan
                                    </button>
                                </div>
                                <div>
                                    <button
                                        onClick={handleSaveChanges}
                                        disabled={!hasChanges || isLoading}
                                        className={`py-2 px-6 rounded-lg flex items-center ${hasChanges && !isLoading
                                                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                                                : "bg-indigo-300 text-white cursor-not-allowed"
                                            }`}
                                    >
                                        <MdSave className="mr-2" /> Simpan Perubahan
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <MdInfo className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                            <h3 className="text-lg font-medium text-gray-900">Tidak ada data</h3>
                            <p className="text-gray-500 mt-1">
                                {searchTerm ? "Tidak ada mahasiswa yang cocok dengan pencarian Anda" : "Tidak ada data mahasiswa untuk sesi ini"}
                            </p>
                        </div>
                    )}
                </Card>
            ) : (
                <Card extra="p-8 text-center" data-aos="fade-up">
                    <div className="flex flex-col items-center">
                        <div className="rounded-full bg-indigo-100 p-4 mb-4">
                            <MdVerified className="h-8 w-8 text-indigo-600" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Pilih Mata Kuliah dan Pertemuan</h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                            Silakan pilih mata kuliah dan pertemuan terlebih dahulu untuk menampilkan daftar absensi mahasiswa.
                        </p>
                    </div>
                </Card>
            )}

            {selectedCourse && selectedSession && (
                <div className="mt-5" data-aos="fade-up">
                    <Card extra="p-5">
                        <div className="flex items-start">
                            <MdInfo className="h-5 w-5 text-indigo-600 mt-0.5 mr-3 flex-shrink-0" />
                            <div>
                                <h5 className="font-medium text-gray-900 mb-1">Panduan Absensi Manual</h5>
                                <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
                                    <li>Klik tombol status sesuai kehadiran mahasiswa: Hadir, Tidak Hadir, atau Izin.</li>
                                    <li>Jika status "Izin", seharusnya sudah ada dokumen pendukung yang dikirimkan oleh mahasiswa.</li>
                                    <li>Pastikan untuk menyimpan perubahan setelah selesai mengedit data absensi.</li>
                                    <li>Data absensi yang sudah disimpan dapat diubah kembali bila diperlukan.</li>
                                </ul>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default ManualAttendance;
