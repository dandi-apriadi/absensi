import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
    MdArrowBack, 
    MdClass, 
    MdPerson, 
    MdSchedule, 
    MdPeople, 
    MdAccessTime, 
    MdCalendarToday,
    MdLocationOn,
    MdSecurity,
    MdHistory,
    MdInfo,
    MdWarning,
    MdCheckCircle,
    MdDownload,
    MdRefresh
} from "react-icons/md";
import axios from "axios";
import AOS from "aos";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";

const api = axios.create({
    baseURL: API_BASE,
    withCredentials: true
});

const ClassAccessDetail = () => {
    const { classId } = useParams();
    const navigate = useNavigate();
    const [classDetail, setClassDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        AOS.init({ duration: 600, once: true });
        fetchClassDetail();
    }, [classId]);

    const fetchClassDetail = async () => {
        try {
            setLoading(true);
            console.log('Fetching class detail for ID:', classId);
            
            const res = await api.get(`/api/room-access/classes/${classId}/detail`);
            
            console.log('Class detail response:', res.data);
            
            if (res.data.success) {
                setClassDetail(res.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch class detail:', error);
            setMessage({ 
                type: 'error', 
                text: 'Gagal memuat detail kelas: ' + (error.response?.data?.message || error.message)
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRevokeAccess = async () => {
        if (!window.confirm(`Apakah Anda yakin ingin mencabut akses ruangan untuk kelas ${classDetail.course_code} - ${classDetail.class_name}?`)) {
            return;
        }

        try {
            const res = await api.patch(`/api/room-access/classes/${classId}/revoke`);
            
            if (res.data.success) {
                setMessage({ type: 'success', text: res.data.message });
                fetchClassDetail(); // Refresh data
            }
        } catch (error) {
            console.error('Failed to revoke access:', error);
            setMessage({ 
                type: 'error', 
                text: 'Gagal mencabut akses: ' + (error.response?.data?.message || error.message)
            });
        }
    };

    const handleGrantAccess = async () => {
        try {
            const res = await api.patch(`/api/room-access/classes/${classId}/grant`);
            
            if (res.data.success) {
                setMessage({ type: 'success', text: res.data.message });
                fetchClassDetail(); // Refresh data
            }
        } catch (error) {
            console.error('Failed to grant access:', error);
            setMessage({ 
                type: 'error', 
                text: 'Gagal memberikan akses: ' + (error.response?.data?.message || error.message)
            });
        }
    };

    const handleDownloadReport = () => {
        if (!classDetail.accessLogs || classDetail.accessLogs.length === 0) {
            setMessage({ type: 'error', text: 'Tidak ada data akses untuk diunduh' });
            return;
        }

        // Create CSV content
        const headers = ['Tanggal', 'Waktu', 'Nama Mahasiswa', 'NIM', 'Status', 'Sesi'];
        const csvContent = [
            headers.join(','),
            ...classDetail.accessLogs.map(log => [
                log.date,
                formatTime(log.time),
                `"${log.studentName}"`,
                log.studentId,
                log.status === 'present' ? 'Hadir' : 'Terlambat',
                `"${log.sessionName}"`
            ].join(','))
        ].join('\n');

        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `riwayat-akses-${classDetail.course_code}-${classDetail.class_name}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setMessage({ type: 'success', text: 'Laporan berhasil diunduh' });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (timeString) => {
        if (!timeString) return '-';
        const time = new Date(timeString);
        return time.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Clear message after 5 seconds
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    if (loading) {
        return (
            <div className="p-4 md:p-8">
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Memuat detail kelas...</p>
                </div>
            </div>
        );
    }

    if (!classDetail) {
        return (
            <div className="p-4 md:p-8">
                <div className="text-center py-12">
                    <MdWarning className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Kelas Tidak Ditemukan</h3>
                    <p className="text-gray-600 mb-4">Detail kelas yang Anda cari tidak dapat ditemukan.</p>
                    <button 
                        onClick={() => navigate('/admin/room-access')}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        <MdArrowBack className="w-4 h-4 mr-2" />
                        Kembali
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            {/* Message Display */}
            {message && (
                <div className={`mb-6 p-4 rounded-lg border ${
                    message.type === 'success' 
                        ? 'bg-green-50 border-green-200 text-green-800' 
                        : 'bg-red-50 border-red-200 text-red-800'
                }`} data-aos="fade-in">
                    <div className="flex items-center">
                        {message.type === 'success' ? (
                            <MdCheckCircle className="w-5 h-5 mr-3" />
                        ) : (
                            <MdWarning className="w-5 h-5 mr-3" />
                        )}
                        {message.text}
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="mb-8" data-aos="fade-down">
                <div className="flex items-center mb-4">
                    <button 
                        onClick={() => navigate('/admin/room-access')}
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 mr-4"
                    >
                        <MdArrowBack className="w-5 h-5 mr-1" />
                        Kembali
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            {classDetail.course_code} - {classDetail.class_name}
                        </h1>
                        <p className="text-gray-600">{classDetail.course_name}</p>
                    </div>
                </div>
                
                {/* Status Badge */}
                <div className="flex items-center gap-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        classDetail.active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                    }`}>
                        <MdSecurity className="w-4 h-4 mr-2" />
                        {classDetail.active ? 'Akses Aktif' : 'Akses Nonaktif'}
                    </span>
                    
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        <MdLocationOn className="w-4 h-4 mr-2" />
                        Ruang Kelas Utama
                    </span>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Class Information */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Info Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6" data-aos="fade-up">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                            <MdClass className="w-5 h-5 mr-2" />
                            Informasi Kelas
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Kode Mata Kuliah</label>
                                    <p className="text-gray-900 font-medium">{classDetail.course_code}</p>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Nama Mata Kuliah</label>
                                    <p className="text-gray-900">{classDetail.course_name}</p>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Nama Kelas</label>
                                    <p className="text-gray-900 font-medium">{classDetail.class_name}</p>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Dosen Pengampu</label>
                                    <p className="text-gray-900 flex items-center">
                                        <MdPerson className="w-4 h-4 mr-2" />
                                        {classDetail.lecturer}
                                    </p>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Tahun Akademik</label>
                                    <p className="text-gray-900">{classDetail.academic_year} - {classDetail.semester_period}</p>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Kapasitas Maksimum</label>
                                    <p className="text-gray-900 flex items-center">
                                        <MdPeople className="w-4 h-4 mr-2" />
                                        {classDetail.max_students} mahasiswa
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Schedule Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6" data-aos="fade-up" data-aos-delay="100">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                            <MdSchedule className="w-5 h-5 mr-2" />
                            Jadwal Perkuliahan
                        </h2>
                        
                        {classDetail.schedule && classDetail.schedule.length > 0 ? (
                            <div className="space-y-3">
                                {classDetail.schedule.map((schedule, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center">
                                            <MdCalendarToday className="w-4 h-4 mr-3 text-blue-600" />
                                            <span className="font-medium text-gray-900">{schedule.day}</span>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <MdAccessTime className="w-4 h-4 mr-2" />
                                            <span>{schedule.start_time || schedule.start} - {schedule.end_time || schedule.end}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <MdSchedule className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                <p>Tidak ada jadwal yang ditetapkan</p>
                            </div>
                        )}
                    </div>

                    {/* Access Logs */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6" data-aos="fade-up" data-aos-delay="200">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                                <MdHistory className="w-5 h-5 mr-2" />
                                Riwayat Akses (7 Hari Terakhir)
                            </h2>
                            {classDetail.accessLogs && classDetail.accessLogs.length > 0 && (
                                <button
                                    onClick={handleDownloadReport}
                                    className="inline-flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <MdDownload className="w-4 h-4 mr-1" />
                                    Unduh CSV
                                </button>
                            )}
                        </div>
                        
                        {classDetail.accessLogs && classDetail.accessLogs.length > 0 ? (
                            <div className="space-y-2 max-h-96 overflow-y-auto">
                                {classDetail.accessLogs.map((log, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                <span className="text-blue-600 font-medium text-sm">
                                                    {log.studentName?.charAt(0)?.toUpperCase() || 'M'}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{log.studentName}</p>
                                                <p className="text-sm text-gray-500">{log.studentId}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-gray-900">
                                                {formatDate(log.date)}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {formatTime(log.time)} - {log.sessionName}
                                            </p>
                                            <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                                                log.status === 'present' 
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                                {log.status === 'present' ? 'Hadir' : 'Terlambat'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <MdHistory className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                <p>Belum ada riwayat akses</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Stats Sidebar */}
                <div className="space-y-6">
                    {/* Quick Stats */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6" data-aos="fade-up" data-aos-delay="300">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Statistik Kelas</h3>
                        
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Mahasiswa Terdaftar</span>
                                <span className="font-bold text-2xl text-blue-600">{classDetail.enrolled_students}</span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Total Akses</span>
                                <span className="font-bold text-2xl text-green-600">
                                    {classDetail.accessLogs ? classDetail.accessLogs.length : 0}
                                </span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Kapasitas Maksimum</span>
                                <span className="font-bold text-xl text-gray-600">{classDetail.max_students}</span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Status</span>
                                <span className={`font-medium ${classDetail.active ? 'text-green-600' : 'text-gray-600'}`}>
                                    {classDetail.active ? 'Aktif' : 'Nonaktif'}
                                </span>
                            </div>

                            {/* Progress Bar */}
                            <div className="pt-2">
                                <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                                    <span>Penggunaan Kapasitas</span>
                                    <span>{Math.round((classDetail.enrolled_students / classDetail.max_students) * 100)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                        className={`h-2 rounded-full ${
                                            (classDetail.enrolled_students / classDetail.max_students) > 0.9 
                                                ? 'bg-red-500' 
                                                : (classDetail.enrolled_students / classDetail.max_students) > 0.7 
                                                    ? 'bg-yellow-500' 
                                                    : 'bg-green-500'
                                        }`}
                                        style={{ width: `${Math.min((classDetail.enrolled_students / classDetail.max_students) * 100, 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6" data-aos="fade-up" data-aos-delay="400">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Aksi</h3>
                        
                        <div className="space-y-3">
                            {classDetail.active ? (
                                <button 
                                    onClick={handleRevokeAccess}
                                    className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    <MdSecurity className="w-4 h-4 mr-2" />
                                    Cabut Akses Ruangan
                                </button>
                            ) : (
                                <button 
                                    onClick={handleGrantAccess}
                                    className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    <MdSecurity className="w-4 h-4 mr-2" />
                                    Berikan Akses Ruangan
                                </button>
                            )}
                            
                            <button 
                                onClick={fetchClassDetail}
                                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <MdRefresh className="w-4 h-4 mr-2" />
                                Refresh Data
                            </button>

                            {classDetail.accessLogs && classDetail.accessLogs.length > 0 && (
                                <button 
                                    onClick={handleDownloadReport}
                                    className="w-full flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    <MdDownload className="w-4 h-4 mr-2" />
                                    Unduh Laporan CSV
                                </button>
                            )}
                        </div>
                    </div>

                    {/* System Info */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6" data-aos="fade-up" data-aos-delay="500">
                        <h3 className="text-lg font-semibold text-blue-800 mb-3">Informasi Sistem</h3>
                        <div className="space-y-2 text-sm text-blue-700">
                            <p>• Sistem menggunakan satu pintu untuk semua kelas</p>
                            <p>• Akses diatur berdasarkan jadwal perkuliahan</p>
                            <p>• Riwayat akses tersimpan selama 30 hari</p>
                            <p>• Status dapat diubah sewaktu-waktu oleh admin</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClassAccessDetail;