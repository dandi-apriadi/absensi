import React, { useEffect, useState } from "react";
import { MdSearch, MdFilterList, MdCalendarToday, MdPrint, MdFileDownload, MdAccessTime } from "react-icons/md";
import { MdHistory } from "react-icons/md";
import AOS from "aos";
import "aos/dist/aos.css";

const AttendanceHistory = () => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCourse, setSelectedCourse] = useState("all");
    const [selectedStatus, setSelectedStatus] = useState("all");

    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
        });
    }, []);

    // Dummy data for courses and attendance records
    const courses = [
        { id: "all", name: "Semua Mata Kuliah" },
        { id: "cs101", name: "Pemrograman Web" },
        { id: "cs102", name: "Algoritma dan Struktur Data" },
        { id: "cs103", name: "Basis Data" },
        { id: "cs104", name: "Kecerdasan Buatan" },
        { id: "cs105", name: "Jaringan Komputer" }
    ];

    const statusOptions = [
        { id: "all", name: "Semua Status" },
        { id: "present", name: "Hadir" },
        { id: "late", name: "Terlambat" },
        { id: "absent", name: "Tidak Hadir" },
        { id: "excused", name: "Izin/Sakit" }
    ];

    const attendanceRecords = [
        {
            id: 1,
            date: "2025-05-15",
            time: "08:15:22",
            nim: "2021010101",
            name: "Ahmad Fauzi",
            course: "Pemrograman Web",
            room: "Lab Komputer 1",
            status: "present",
            verificationMethod: "Face Recognition",
            verifiedBy: "System"
        },
        {
            id: 2,
            date: "2025-05-15",
            time: "08:17:45",
            nim: "2021010102",
            name: "Siti Nurhaliza",
            course: "Pemrograman Web",
            room: "Lab Komputer 1",
            status: "present",
            verificationMethod: "Face Recognition",
            verifiedBy: "System"
        },
        {
            id: 3,
            date: "2025-05-15",
            time: "08:32:18",
            nim: "2021010201",
            name: "Budi Santoso",
            course: "Pemrograman Web",
            room: "Lab Komputer 1",
            status: "late",
            verificationMethod: "Face Recognition",
            verifiedBy: "System"
        },
        {
            id: 4,
            date: "2025-05-15",
            time: "08:35:01",
            nim: "2020010101",
            name: "Indah Permata",
            course: "Pemrograman Web",
            room: "Lab Komputer 1",
            status: "late",
            verificationMethod: "QR Code",
            verifiedBy: "Dr. Budi Santoso"
        },
        {
            id: 5,
            date: "2025-05-15",
            time: "09:30:45",
            nim: "2022010101",
            name: "Dewi Lestari",
            course: "Algoritma dan Struktur Data",
            room: "Ruang 2.01",
            status: "present",
            verificationMethod: "Face Recognition",
            verifiedBy: "System"
        },
        {
            id: 6,
            date: "2025-05-15",
            time: "09:45:22",
            nim: "2022010102",
            name: "Muhammad Rizki",
            course: "Algoritma dan Struktur Data",
            room: "Ruang 2.01",
            status: "present",
            verificationMethod: "Face Recognition",
            verifiedBy: "System"
        },
        {
            id: 7,
            date: "2025-05-15",
            time: "",
            nim: "2022010103",
            name: "Anisa Rahmawati",
            course: "Algoritma dan Struktur Data",
            room: "Ruang 2.01",
            status: "absent",
            verificationMethod: "-",
            verifiedBy: "System"
        },
        {
            id: 8,
            date: "2025-05-15",
            time: "",
            nim: "2020010105",
            name: "Rudi Hermawan",
            course: "Algoritma dan Struktur Data",
            room: "Ruang 2.01",
            status: "excused",
            verificationMethod: "Manual Entry",
            verifiedBy: "Dr. Indah Permata"
        },
    ];

    // Filter attendance records based on search and filters
    const filteredRecords = attendanceRecords.filter(record => {
        const matchesSearch = searchTerm === "" ||
            record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.nim.includes(searchTerm);

        const matchesCourse = selectedCourse === "all" || record.course === courses.find(c => c.id === selectedCourse)?.name;

        const matchesStatus = selectedStatus === "all" || record.status === selectedStatus;

        // Date filtering would go here if we were using real date objects

        return matchesSearch && matchesCourse && matchesStatus;
    });

    const getStatusBadge = (status) => {
        switch (status) {
            case "present":
                return <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Hadir</span>;
            case "late":
                return <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Terlambat</span>;
            case "absent":
                return <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Tidak Hadir</span>;
            case "excused":
                return <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Izin/Sakit</span>;
            default:
                return <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Unknown</span>;
        }
    };

    const getVerificationBadge = (method) => {
        switch (method) {
            case "Face Recognition":
                return <span className="text-green-600 text-sm">Face Recognition</span>;
            case "QR Code":
                return <span className="text-purple-600 text-sm">QR Code</span>;
            case "Manual Entry":
                return <span className="text-blue-600 text-sm">Manual Entry</span>;
            default:
                return <span className="text-gray-600 text-sm">-</span>;
        }
    };

    return (
        <div className="p-4 md:p-8">
            <div className="mb-8" data-aos="fade-down">
                <h1 className="text-3xl font-bold text-gray-800">Riwayat Absensi</h1>
                <p className="text-gray-600">Pencarian dan filter riwayat absensi mahasiswa</p>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6" data-aos="fade-up">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="relative">
                        <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari nama/NIM mahasiswa"
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <div className="flex-1">
                            <div className="relative">
                                <MdFilterList className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <select
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none"
                                    value={selectedCourse}
                                    onChange={(e) => setSelectedCourse(e.target.value)}
                                >
                                    {courses.map(course => (
                                        <option key={course.id} value={course.id}>{course.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <div className="flex-1">
                            <div className="relative">
                                <MdFilterList className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <select
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none"
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                >
                                    {statusOptions.map(option => (
                                        <option key={option.id} value={option.id}>{option.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <div className="flex-1">
                            <div className="relative">
                                <MdCalendarToday className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="date"
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>
                        </div>
                        <span className="text-gray-500">to</span>
                        <div className="flex-1">
                            <div className="relative">
                                <MdCalendarToday className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="date"
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors">
                        <MdSearch className="mr-2" /> Filter Results
                    </button>
                    <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center hover:bg-gray-200 transition-colors">
                        Clear Filters
                    </button>
                    <div className="flex-grow"></div>
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-700 transition-colors">
                        <MdPrint className="mr-2" /> Print
                    </button>
                    <button className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-purple-700 transition-colors">
                        <MdFileDownload className="mr-2" /> Export
                    </button>
                </div>
            </div>

            {/* Attendance Records Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden" data-aos="fade-up" data-aos-delay="100">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIM</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mata Kuliah</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ruangan</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verifikasi</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diverifikasi Oleh</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredRecords.map((record) => (
                                <tr key={record.id} className="hover:bg-gray-50 transition-colors duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.time || "-"}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.nim}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.course}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.room}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {getStatusBadge(record.status)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {getVerificationBadge(record.verificationMethod)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.verifiedBy}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
                    <div className="flex-1 flex justify-between sm:hidden">
                        <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                            Previous
                        </button>
                        <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                            Next
                        </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Showing <span className="font-medium">1</span> to <span className="font-medium">8</span> of{" "}
                                <span className="font-medium">8</span> results
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                    <span className="sr-only">Previous</span>
                                    &laquo;
                                </button>
                                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                                    1
                                </button>
                                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                                    2
                                </button>
                                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                                    3
                                </button>
                                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                    <span className="sr-only">Next</span>
                                    &raquo;
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6" data-aos="fade-up" data-aos-delay="200">
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Records</p>
                            <h3 className="text-xl font-bold text-gray-900 mt-1">8</h3>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-full">
                            <MdAccessTime className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Present</p>
                            <h3 className="text-xl font-bold text-green-600 mt-1">4 (50%)</h3>
                        </div>
                        <div className="bg-green-100 p-3 rounded-full">
                            <MdAccessTime className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Late</p>
                            <h3 className="text-xl font-bold text-yellow-600 mt-1">2 (25%)</h3>
                        </div>
                        <div className="bg-yellow-100 p-3 rounded-full">
                            <MdAccessTime className="h-6 w-6 text-yellow-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Absent/Excused</p>
                            <h3 className="text-xl font-bold text-red-600 mt-1">2 (25%)</h3>
                        </div>
                        <div className="bg-red-100 p-3 rounded-full">
                            <MdAccessTime className="h-6 w-6 text-red-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Development Notice */}
            <div className="bg-white rounded-xl shadow-md p-6 mt-8" data-aos="fade-up">
                <div className="flex items-center justify-center h-40 flex-col">
                    <MdHistory className="h-16 w-16 text-blue-500 mb-4" />
                    <h2 className="text-xl text-gray-600">Riwayat absensi sedang dalam pengembangan</h2>
                </div>
            </div>
        </div>
    );
};

export default AttendanceHistory;
