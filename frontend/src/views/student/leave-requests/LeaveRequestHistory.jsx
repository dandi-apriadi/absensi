import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { MdFilterList, MdSearch, MdVisibility, MdEdit, MdDelete, MdDownload } from "react-icons/md";

const LeaveRequestHistory = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterType, setFilterType] = useState('all');

    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
        });
    }, []);

    const leaveRequests = [
        {
            id: 1,
            type: 'sick',
            reason: 'Demam tinggi',
            startDate: '2024-01-20',
            endDate: '2024-01-21',
            status: 'approved',
            submittedDate: '2024-01-18',
            reviewedBy: 'Dr. Ahmad Fauzi',
            reviewDate: '2024-01-19',
            attachments: ['surat-dokter.pdf']
        },
        {
            id: 2,
            type: 'family',
            reason: 'Acara pernikahan keluarga',
            startDate: '2024-01-15',
            endDate: '2024-01-15',
            status: 'approved',
            submittedDate: '2024-01-12',
            reviewedBy: 'Prof. Maria Sari',
            reviewDate: '2024-01-13',
            attachments: ['undangan.jpg']
        },
        {
            id: 3,
            type: 'personal',
            reason: 'Urusan administrasi penting',
            startDate: '2024-01-25',
            endDate: '2024-01-25',
            status: 'pending',
            submittedDate: '2024-01-23',
            reviewedBy: null,
            reviewDate: null,
            attachments: []
        },
        {
            id: 4,
            type: 'sick',
            reason: 'Sakit perut',
            startDate: '2024-01-10',
            endDate: '2024-01-10',
            status: 'rejected',
            submittedDate: '2024-01-10',
            reviewedBy: 'Dr. Budi Santoso',
            reviewDate: '2024-01-11',
            attachments: [],
            rejectionReason: 'Dokumen pendukung tidak lengkap'
        },
        {
            id: 5,
            type: 'emergency',
            reason: 'Kecelakaan keluarga',
            startDate: '2024-01-05',
            endDate: '2024-01-06',
            status: 'approved',
            submittedDate: '2024-01-05',
            reviewedBy: 'Dr. Lisa Wijaya',
            reviewDate: '2024-01-05',
            attachments: ['laporan-kecelakaan.pdf']
        }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'approved': return 'Disetujui';
            case 'rejected': return 'Ditolak';
            case 'pending': return 'Menunggu';
            default: return 'Unknown';
        }
    };

    const getTypeText = (type) => {
        switch (type) {
            case 'sick': return 'Sakit';
            case 'family': return 'Keluarga';
            case 'personal': return 'Pribadi';
            case 'emergency': return 'Darurat';
            default: return 'Unknown';
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'sick': return 'bg-red-100 text-red-800';
            case 'family': return 'bg-blue-100 text-blue-800';
            case 'personal': return 'bg-green-100 text-green-800';
            case 'emergency': return 'bg-orange-100 text-orange-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredRequests = leaveRequests.filter(request => {
        const matchesSearch = request.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.type.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
        const matchesType = filterType === 'all' || request.type === filterType;

        return matchesSearch && matchesStatus && matchesType;
    });

    const handleViewDetails = (request) => {
        alert(`Detail pengajuan: ${request.reason}\nStatus: ${getStatusText(request.status)}`);
    };

    const handleEdit = (request) => {
        if (request.status === 'pending') {
            alert('Fitur edit akan segera tersedia');
        } else {
            alert('Pengajuan tidak dapat diedit setelah diproses');
        }
    };

    const handleDelete = (request) => {
        if (request.status === 'pending') {
            if (window.confirm('Yakin ingin menghapus pengajuan ini?')) {
                alert('Pengajuan berhasil dihapus');
            }
        } else {
            alert('Pengajuan tidak dapat dihapus setelah diproses');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            {/* Header */}
            <div className="mb-8" data-aos="fade-down">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Riwayat Pengajuan Izin
                </h1>
                <p className="text-gray-600">
                    Lihat status dan riwayat pengajuan izin Anda
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-xl shadow-lg p-6" data-aos="fade-up" data-aos-delay="100">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">
                            {leaveRequests.length}
                        </p>
                        <p className="text-sm text-gray-600">Total Pengajuan</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6" data-aos="fade-up" data-aos-delay="200">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">
                            {leaveRequests.filter(r => r.status === 'approved').length}
                        </p>
                        <p className="text-sm text-gray-600">Disetujui</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6" data-aos="fade-up" data-aos-delay="300">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-yellow-600">
                            {leaveRequests.filter(r => r.status === 'pending').length}
                        </p>
                        <p className="text-sm text-gray-600">Menunggu</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6" data-aos="fade-up" data-aos-delay="400">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-red-600">
                            {leaveRequests.filter(r => r.status === 'rejected').length}
                        </p>
                        <p className="text-sm text-gray-600">Ditolak</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8" data-aos="fade-up">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative">
                        <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="text"
                            placeholder="Cari alasan izin..."
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
                        <option value="approved">Disetujui</option>
                        <option value="pending">Menunggu</option>
                        <option value="rejected">Ditolak</option>
                    </select>

                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">Semua Jenis</option>
                        <option value="sick">Sakit</option>
                        <option value="family">Keluarga</option>
                        <option value="personal">Pribadi</option>
                        <option value="emergency">Darurat</option>
                    </select>

                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center">
                        <MdFilterList className="h-5 w-5 mr-2" />
                        Filter
                    </button>
                </div>
            </div>

            {/* Requests List */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden" data-aos="fade-up" data-aos-delay="200">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Jenis & Alasan
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tanggal Izin
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Diajukan
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Reviewer
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredRequests.map((request) => (
                                <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mb-1 ${getTypeColor(request.type)}`}>
                                                {getTypeText(request.type)}
                                            </span>
                                            <p className="text-sm font-medium text-gray-900">{request.reason}</p>
                                            {request.attachments.length > 0 && (
                                                <p className="text-xs text-blue-600">
                                                    📎 {request.attachments.length} lampiran
                                                </p>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {request.startDate}
                                            {request.startDate !== request.endDate && (
                                                <span> - {request.endDate}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                                            {getStatusText(request.status)}
                                        </span>
                                        {request.status === 'rejected' && request.rejectionReason && (
                                            <p className="text-xs text-red-600 mt-1">
                                                {request.rejectionReason}
                                            </p>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{request.submittedDate}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {request.reviewedBy || '-'}
                                            {request.reviewDate && (
                                                <p className="text-xs text-gray-500">{request.reviewDate}</p>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleViewDetails(request)}
                                                className="text-blue-600 hover:text-blue-900 transition-colors"
                                                title="Lihat detail"
                                            >
                                                <MdVisibility className="h-5 w-5" />
                                            </button>
                                            {request.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleEdit(request)}
                                                        className="text-green-600 hover:text-green-900 transition-colors"
                                                        title="Edit pengajuan"
                                                    >
                                                        <MdEdit className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(request)}
                                                        className="text-red-600 hover:text-red-900 transition-colors"
                                                        title="Hapus pengajuan"
                                                    >
                                                        <MdDelete className="h-5 w-5" />
                                                    </button>
                                                </>
                                            )}
                                            {request.attachments.length > 0 && (
                                                <button
                                                    className="text-purple-600 hover:text-purple-900 transition-colors"
                                                    title="Download lampiran"
                                                >
                                                    <MdDownload className="h-5 w-5" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredRequests.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-gray-500">Tidak ada pengajuan yang sesuai dengan filter</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-700">
                    Menampilkan {filteredRequests.length} dari {leaveRequests.length} pengajuan
                </div>
                <div className="flex space-x-2">
                    <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                        Previous
                    </button>
                    <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm">
                        1
                    </button>
                    <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LeaveRequestHistory;
