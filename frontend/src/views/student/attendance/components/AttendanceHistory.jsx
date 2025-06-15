import React, { useState } from "react";
import { MdFilterList, MdSearch, MdCalendarToday } from "react-icons/md";

const AttendanceHistory = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterMonth, setFilterMonth] = useState('all');

    const attendanceHistory = [
        { id: 1, date: '2024-01-25', course: 'Pemrograman Web', lecturer: 'Dr. Ahmad Fauzi', status: 'present', time: '08:15', method: 'face' },
        { id: 2, date: '2024-01-25', course: 'Database', lecturer: 'Prof. Maria Sari', status: 'present', time: '10:05', method: 'face' },
        { id: 3, date: '2024-01-24', course: 'Mobile Dev', lecturer: 'Dr. Budi Santoso', status: 'late', time: '13:10', method: 'qr' },
        { id: 4, date: '2024-01-24', course: 'Machine Learning', lecturer: 'Dr. Lisa Wijaya', status: 'present', time: '08:30', method: 'face' },
        { id: 5, date: '2024-01-23', course: 'Software Eng', lecturer: 'Prof. Andi Rahman', status: 'absent', time: '-', method: '-' },
        { id: 6, date: '2024-01-23', course: 'Pemrograman Web', lecturer: 'Dr. Ahmad Fauzi', status: 'present', time: '08:12', method: 'face' },
        { id: 7, date: '2024-01-22', course: 'Database', lecturer: 'Prof. Maria Sari', status: 'late', time: '10:15', method: 'manual' },
        { id: 8, date: '2024-01-22', course: 'Mobile Dev', lecturer: 'Dr. Budi Santoso', status: 'present', time: '13:05', method: 'face' },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'present': return 'bg-green-100 text-green-800';
            case 'absent': return 'bg-red-100 text-red-800';
            case 'late': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'present': return 'Hadir';
            case 'absent': return 'Tidak Hadir';
            case 'late': return 'Terlambat';
            default: return 'Unknown';
        }
    };

    const getMethodText = (method) => {
        switch (method) {
            case 'face': return 'Face Recognition';
            case 'qr': return 'QR Code';
            case 'manual': return 'Manual';
            default: return '-';
        }
    };

    const filteredHistory = attendanceHistory.filter(item => {
        const matchesSearch = item.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.lecturer.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
        const matchesMonth = filterMonth === 'all' || item.date.includes(`2024-${filterMonth}`);

        return matchesSearch && matchesStatus && matchesMonth;
    });

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                    <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                        type="text"
                        placeholder="Cari mata kuliah atau dosen..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="all">Semua Status</option>
                    <option value="present">Hadir</option>
                    <option value="late">Terlambat</option>
                    <option value="absent">Tidak Hadir</option>
                </select>

                <select
                    value={filterMonth}
                    onChange={(e) => setFilterMonth(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="all">Semua Bulan</option>
                    <option value="01">Januari</option>
                    <option value="02">Februari</option>
                    <option value="03">Maret</option>
                    <option value="04">April</option>
                    <option value="05">Mei</option>
                </select>

                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center">
                    <MdFilterList className="h-5 w-5 mr-2" />
                    Filter
                </button>
            </div>

            {/* History Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tanggal
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Mata Kuliah
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Dosen
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Waktu
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Metode
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredHistory.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <MdCalendarToday className="h-4 w-4 text-gray-400 mr-2" />
                                            <span className="text-sm text-gray-900">{item.date}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{item.course}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{item.lecturer}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{item.time}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                                            {getStatusText(item.status)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{getMethodText(item.method)}</div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredHistory.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-gray-500">Tidak ada data yang sesuai dengan filter</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                    Menampilkan {filteredHistory.length} dari {attendanceHistory.length} data
                </div>
                <div className="flex space-x-2">
                    <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                        Previous
                    </button>
                    <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm">
                        1
                    </button>
                    <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                        2
                    </button>
                    <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AttendanceHistory;
