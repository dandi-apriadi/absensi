import React, { useEffect, useState } from "react";
import { MdAccessTime, MdPerson, MdCheck, MdClose, MdWarning, MdCalendarToday, MdSearch, MdFilterList } from "react-icons/md";
import AOS from "aos";
import "aos/dist/aos.css";

const AttendanceManagement = () => {
    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true
        });
    }, []);

    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    // Dummy data for attendance
    const attendanceData = [
        { id: 1, name: "Ahmad Fauzi", nim: "1901234", class: "Pemrograman Web", date: "2023-05-15", time: "08:05", status: "present" },
        { id: 2, name: "Siti Nuraini", nim: "1901235", class: "Pemrograman Web", date: "2023-05-15", time: "07:55", status: "present" },
        { id: 3, name: "Budi Santoso", nim: "1901236", class: "Pemrograman Web", date: "2023-05-15", time: "08:30", status: "late" },
        { id: 4, name: "Dewi Anggraini", nim: "1901237", class: "Pemrograman Web", date: "2023-05-15", time: "-", status: "absent" },
        { id: 5, name: "Eko Prasetyo", nim: "1901238", class: "Pemrograman Web", date: "2023-05-15", time: "08:02", status: "present" },
        { id: 6, name: "Fitriani", nim: "1901239", class: "Pemrograman Web", date: "2023-05-15", time: "08:25", status: "late" },
        { id: 7, name: "Gunawan", nim: "1901240", class: "Pemrograman Web", date: "2023-05-15", time: "-", status: "absent" },
        { id: 8, name: "Hani Permata", nim: "1901241", class: "Pemrograman Web", date: "2023-05-15", time: "07:58", status: "present" },
    ];

    // Stats calculation
    const presentCount = attendanceData.filter(item => item.status === "present").length;
    const lateCount = attendanceData.filter(item => item.status === "late").length;
    const absentCount = attendanceData.filter(item => item.status === "absent").length;
    const totalStudents = attendanceData.length;

    // Filter and search functionality
    const filteredData = attendanceData.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.nim.includes(searchTerm);
        const matchesFilter = filterStatus === "all" || item.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    // Status badge component
    const StatusBadge = ({ status }) => {
        switch (status) {
            case "present":
                return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium flex items-center"><MdCheck className="mr-1" /> Hadir</span>;
            case "late":
                return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium flex items-center"><MdWarning className="mr-1" /> Terlambat</span>;
            case "absent":
                return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium flex items-center"><MdClose className="mr-1" /> Absen</span>;
            default:
                return null;
        }
    };

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            <div className="mb-8" data-aos="fade-right">
                <h1 className="text-3xl font-bold text-gray-800">Manajemen Absensi</h1>
                <p className="text-gray-600">Kelola data absensi mahasiswa secara efisien</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div
                    data-aos="zoom-in"
                    data-aos-delay="100"
                    className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500 hover:shadow-md transition-shadow"
                >
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Mahasiswa</p>
                            <p className="text-2xl font-bold text-gray-800">{totalStudents}</p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-full">
                            <MdPerson className="h-6 w-6 text-blue-500" />
                        </div>
                    </div>
                </div>

                <div
                    data-aos="zoom-in"
                    data-aos-delay="200"
                    className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500 hover:shadow-md transition-shadow"
                >
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Hadir</p>
                            <p className="text-2xl font-bold text-gray-800">{presentCount}</p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-full">
                            <MdCheck className="h-6 w-6 text-green-500" />
                        </div>
                    </div>
                </div>

                <div
                    data-aos="zoom-in"
                    data-aos-delay="300"
                    className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-yellow-500 hover:shadow-md transition-shadow"
                >
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Terlambat</p>
                            <p className="text-2xl font-bold text-gray-800">{lateCount}</p>
                        </div>
                        <div className="p-3 bg-yellow-100 rounded-full">
                            <MdWarning className="h-6 w-6 text-yellow-500" />
                        </div>
                    </div>
                </div>

                <div
                    data-aos="zoom-in"
                    data-aos-delay="400"
                    className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-red-500 hover:shadow-md transition-shadow"
                >
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Tidak Hadir</p>
                            <p className="text-2xl font-bold text-gray-800">{absentCount}</p>
                        </div>
                        <div className="p-3 bg-red-100 rounded-full">
                            <MdClose className="h-6 w-6 text-red-500" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Date and Filter Controls */}
            <div
                className="bg-white rounded-xl shadow-sm p-6 mb-8"
                data-aos="fade-up"
                data-aos-delay="100"
            >
                <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                    <div className="flex items-center mb-4 md:mb-0">
                        <MdCalendarToday className="mr-2 text-blue-500" />
                        <span className="font-medium">Pemrograman Web - 15 Mei 2023</span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Cari nama/NIM..."
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <MdSearch className="absolute left-3 top-2.5 text-gray-400" />
                        </div>
                        <div className="relative">
                            <select
                                className="appearance-none pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="all">Semua Status</option>
                                <option value="present">Hadir</option>
                                <option value="late">Terlambat</option>
                                <option value="absent">Absen</option>
                            </select>
                            <MdFilterList className="absolute left-3 top-2.5 text-gray-400" />
                        </div>
                    </div>
                </div>

                {/* Attendance Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIM</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredData.length > 0 ? (
                                filteredData.map((student, index) => (
                                    <tr key={student.id}
                                        className="hover:bg-gray-50"
                                        data-aos="fade-up"
                                        data-aos-delay={100 + (index * 50)}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.nim}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.time}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <StatusBadge status={student.status} />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                        Tidak ada data yang sesuai dengan pencarian.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Additional Info Card */}
            <div
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow-md p-6 flex items-center justify-between"
                data-aos="fade-up"
            >
                <div>
                    <h3 className="text-xl font-bold mb-2">Perlu bantuan?</h3>
                    <p className="opacity-80">Kontak administrator sistem untuk informasi lebih lanjut tentang sistem absensi.</p>
                </div>
                <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                    Hubungi Admin
                </button>
            </div>
        </div>
    );
};

export default AttendanceManagement;
