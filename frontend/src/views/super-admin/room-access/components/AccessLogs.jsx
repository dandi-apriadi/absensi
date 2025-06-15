import React, { useEffect, useState } from "react";
import { MdSearch, MdFilterList, MdCalendarToday, MdDownload, MdRefresh, MdChevronLeft, MdChevronRight, MdFace, MdCreditCard, MdPerson, MdComputer, MdHelp, MdDoorFront, MdCheckCircle, MdCancel, MdWarning } from "react-icons/md";
import AOS from "aos";
import "aos/dist/aos.css";

const AccessLogs = () => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRoom, setSelectedRoom] = useState("all");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [selectedType, setSelectedType] = useState("all");

    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
        });
    }, []);

    // Dummy data
    const rooms = [
        { id: "all", name: "Semua Ruangan" },
        { id: "lab1", name: "Lab Komputer 1" },
        { id: "lab2", name: "Lab Komputer 2" },
        { id: "r201", name: "Ruang 2.01" },
        { id: "r202", name: "Ruang 2.02" },
        { id: "labnet", name: "Lab Jaringan" },
    ];

    const statusOptions = [
        { id: "all", name: "Semua Status" },
        { id: "granted", name: "Akses Diberikan" },
        { id: "denied", name: "Akses Ditolak" },
        { id: "warning", name: "Peringatan" },
    ];

    const typeOptions = [
        { id: "all", name: "Semua Tipe" },
        { id: "face", name: "Face Recognition" },
        { id: "rfid", name: "RFID Card" },
        { id: "manual", name: "Manual Override" },
        { id: "system", name: "System Action" }
    ];

    const accessLogs = [
        {
            id: 1,
            timestamp: "2025-05-15 08:15:22",
            user: "Ahmad Fauzi (2021010101)",
            room: "Lab Komputer 1",
            accessType: "face",
            status: "granted",
            duration: "2h 45m",
            notes: ""
        },
        {
            id: 2,
            timestamp: "2025-05-15 08:17:45",
            user: "Siti Nurhaliza (2021010102)",
            room: "Lab Komputer 1",
            accessType: "face",
            status: "granted",
            duration: "3h 10m",
            notes: ""
        },
        {
            id: 3,
            timestamp: "2025-05-15 08:23:12",
            user: "Unknown Person",
            room: "Ruang 2.01",
            accessType: "face",
            status: "denied",
            duration: "-",
            notes: "Face not recognized in database"
        },
        {
            id: 4,
            timestamp: "2025-05-15 09:05:33",
            user: "Dr. Budi Santoso (Dosen)",
            room: "Lab Komputer 2",
            accessType: "rfid",
            status: "granted",
            duration: "1h 30m",
            notes: "Used RFID card after face recognition failure"
        },
        {
            id: 5,
            timestamp: "2025-05-15 09:15:47",
            user: "System Admin",
            room: "Ruang 2.02",
            accessType: "manual",
            status: "granted",
            duration: "10m",
            notes: "Maintenance check"
        },
        {
            id: 6,
            timestamp: "2025-05-15 10:33:21",
            user: "Unknown Person",
            room: "Lab Jaringan",
            accessType: "face",
            status: "warning",
            duration: "-",
            notes: "Multiple failed attempts - possible spoofing attempt"
        },
        {
            id: 7,
            timestamp: "2025-05-15 11:45:19",
            user: "Indah Permata (2020010101)",
            room: "Ruang 2.01",
            accessType: "face",
            status: "granted",
            duration: "45m",
            notes: ""
        },
        {
            id: 8,
            timestamp: "2025-05-15 12:10:05",
            user: "System",
            room: "Lab Komputer 1",
            accessType: "system",
            status: "granted",
            duration: "-",
            notes: "Scheduled door unlock for class"
        }
    ];

    // Filter logs based on filters
    const filteredLogs = accessLogs.filter(log => {
        // Search filter
        const matchesSearch = searchTerm === "" ||
            log.user.toLowerCase().includes(searchTerm.toLowerCase());

        // Room filter
        const matchesRoom = selectedRoom === "all" || log.room === rooms.find(r => r.id === selectedRoom)?.name;

        // Status filter
        const matchesStatus = selectedStatus === "all" || log.status === selectedStatus;

        // Type filter
        const matchesType = selectedType === "all" || log.accessType === selectedType;

        // Date filtering would be implemented here with real dates

        return matchesSearch && matchesRoom && matchesStatus && matchesType;
    });

    const getStatusBadge = (status) => {
        switch (status) {
            case "granted":
                return <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Diberikan</span>;
            case "denied":
                return <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Ditolak</span>;
            case "warning":
                return <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Peringatan</span>;
            default:
                return <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Unknown</span>;
        }
    };

    const getAccessTypeIcon = (type) => {
        switch (type) {
            case "face":
                return <span className="text-blue-600 flex items-center"><MdFace className="h-4 w-4 mr-1" /> Face</span>;
            case "rfid":
                return <span className="text-purple-600 flex items-center"><MdCreditCard className="h-4 w-4 mr-1" /> RFID</span>;
            case "manual":
                return <span className="text-orange-600 flex items-center"><MdPerson className="h-4 w-4 mr-1" /> Manual</span>;
            case "system":
                return <span className="text-green-600 flex items-center"><MdComputer className="h-4 w-4 mr-1" /> System</span>;
            default:
                return <span className="text-gray-600 flex items-center"><MdHelp className="h-4 w-4 mr-1" /> Unknown</span>;
        }
    };

    return (
        <div className="p-4 md:p-8">
            <div className="mb-8" data-aos="fade-down">
                <h1 className="text-3xl font-bold text-gray-800">Log Akses Ruangan</h1>
                <p className="text-gray-600">Riwayat akses masuk dan keluar ruangan</p>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6" data-aos="fade-up">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="relative">
                        <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari pengguna..."
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
                                    value={selectedRoom}
                                    onChange={(e) => setSelectedRoom(e.target.value)}
                                >
                                    {rooms.map(room => (
                                        <option key={room.id} value={room.id}>{room.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="flex space-x-2">
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

                        <div className="flex-1">
                            <div className="relative">
                                <MdFilterList className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <select
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none"
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                >
                                    {typeOptions.map(option => (
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
                        <MdDownload className="mr-2" /> Export
                    </button>
                </div>
            </div>

            {/* Access Logs Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden" data-aos="fade-up" data-aos-delay="100">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pengguna</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ruangan</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metode</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durasi</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catatan</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredLogs.map((log) => (
                                <tr key={log.id} className="hover:bg-gray-50 transition-colors duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{log.timestamp}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.user}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.room}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {getAccessTypeIcon(log.accessType)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {getStatusBadge(log.status)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.duration}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{log.notes || "-"}</td>
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
                                    <MdChevronLeft />
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
                                    <MdChevronRight />
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
                            <p className="text-sm font-medium text-gray-600">Total Akses</p>
                            <h3 className="text-xl font-bold text-gray-900 mt-1">8</h3>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-full">
                            <MdDoorFront className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Akses Diberikan</p>
                            <h3 className="text-xl font-bold text-green-600 mt-1">5 (62.5%)</h3>
                        </div>
                        <div className="bg-green-100 p-3 rounded-full">
                            <MdCheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Akses Ditolak</p>
                            <h3 className="text-xl font-bold text-red-600 mt-1">1 (12.5%)</h3>
                        </div>
                        <div className="bg-red-100 p-3 rounded-full">
                            <MdCancel className="h-6 w-6 text-red-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Peringatan</p>
                            <h3 className="text-xl font-bold text-yellow-600 mt-1">1 (12.5%)</h3>
                        </div>
                        <div className="bg-yellow-100 p-3 rounded-full">
                            <MdWarning className="h-6 w-6 text-yellow-600" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccessLogs;
