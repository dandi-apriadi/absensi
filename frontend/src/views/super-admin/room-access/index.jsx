import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
    MdMeetingRoom, 
    MdSecurity, 
    MdWarning, 
    MdGroups, 
    MdAccessTime, 
    MdInfo, 
    MdRefresh,
    MdDashboard,
    MdTrendingUp,
    MdPeople,
    MdLock,
    MdLockOpen,
    MdSignalWifi4Bar,
    MdSignalWifiOff,
    MdFilterList,
    MdSearch,
    MdSchedule,
    MdClass,
    MdVisibility,
    MdCheckCircle,
    MdCancel,
    MdAccessAlarms
} from "react-icons/md";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import NotificationCenter from "./components/NotificationCenter";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";

// Create axios instance
const api = axios.create({
    baseURL: API_BASE,
    withCredentials: true
});

const RoomAccess = () => {
    const navigate = useNavigate();
    const [classes, setClasses] = useState([]);
    const [doorStatus, setDoorStatus] = useState({ status: "locked", health: "online" });
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [soundEnabled, setSoundEnabled] = useState(true);

    useEffect(() => {
        AOS.init({ duration: 600, once: true });
        fetchClassesWithAccess();
        fetchDoorStatus();
    }, []);

    const fetchClassesWithAccess = async () => {
        try {
            setLoading(true);
            console.log('Fetching classes with access...');
            
            const res = await api.get('/api/room-access/classes');
            console.log('Classes response:', res.data);
            
            if (res.data.success) {
                setClasses(res.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch classes:', error);
            setMessage({ 
                type: 'error', 
                text: 'Gagal memuat data kelas: ' + (error.response?.data?.message || error.message)
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchDoorStatus = async () => {
        try {
            console.log('Fetching door status...');
            
            const res = await api.get('/api/room-access/door/status');
            console.log('Door status response:', res.data);
            
            if (res.data.success) {
                setDoorStatus(res.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch door status:', error);
            setMessage({ 
                type: 'error', 
                text: 'Gagal memuat status pintu: ' + (error.response?.data?.message || error.message)
            });
        }
    };

    const handleRevokeAccess = async (classId, className) => {
        if (!window.confirm(`Apakah Anda yakin ingin mencabut akses ruangan untuk kelas ${className}?`)) {
            return;
        }

        try {
            const res = await api.patch(`/api/room-access/classes/${classId}/revoke`);
            
            if (res.data.success) {
                setMessage({ type: 'success', text: res.data.message });
                addNotification({
                    id: Date.now(),
                    type: 'warning',
                    title: 'Akses Dicabut',
                    message: `Akses untuk ${className} telah dicabut`
                });
                fetchClassesWithAccess(); // Refresh data
            }
        } catch (error) {
            console.error('Failed to revoke access:', error);
            const errorMsg = 'Gagal mencabut akses: ' + (error.response?.data?.message || error.message);
            setMessage({ type: 'error', text: errorMsg });
            addNotification({
                id: Date.now(),
                type: 'error',
                title: 'Gagal Mencabut Akses',
                message: error.response?.data?.message || error.message
            });
        }
    };

    const handleGrantAccess = async (classId, className) => {
        try {
            const res = await api.patch(`/api/room-access/classes/${classId}/grant`);
            
            if (res.data.success) {
                setMessage({ type: 'success', text: res.data.message });
                addNotification({
                    id: Date.now(),
                    type: 'success',
                    title: 'Akses Diberikan',
                    message: `Akses untuk ${className} telah diberikan`
                });
                fetchClassesWithAccess(); // Refresh data
            }
        } catch (error) {
            console.error('Failed to grant access:', error);
            const errorMsg = 'Gagal memberikan akses: ' + (error.response?.data?.message || error.message);
            setMessage({ type: 'error', text: errorMsg });
            addNotification({
                id: Date.now(),
                type: 'error',
                title: 'Gagal Memberikan Akses',
                message: error.response?.data?.message || error.message
            });
        }
    };

    const addNotification = (notification) => {
        setNotifications(prev => [notification, ...prev]);
    };

    const dismissNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    // Filter and search classes
    const filteredClasses = useMemo(() => {
        let filtered = classes;

        if (filter === 'active') {
            filtered = filtered.filter(c => c.active);
        } else if (filter === 'inactive') {
            filtered = filtered.filter(c => !c.active);
        }

        if (search) {
            const searchLower = search.toLowerCase();
            filtered = filtered.filter(c => 
                (c.course_name + c.course_code + c.class_name + c.lecturer)
                    .toLowerCase()
                    .includes(searchLower)
            );
        }

        return filtered;
    }, [classes, filter, search]);

    // Update stats when filter changes
    const displayStats = useMemo(() => {
        return {
            totalClasses: classes.length,
            activeClasses: classes.filter(c => c.active).length,
            totalAccess: filteredClasses.reduce((sum, c) => sum + (c.todayAccessCount || 0), 0)
        };
    }, [classes, filteredClasses]);

    // Clear message after 5 seconds
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            {/* Notification Center */}
            <NotificationCenter 
                notifications={notifications}
                onDismiss={dismissNotification}
                soundEnabled={soundEnabled}
                onToggleSound={() => setSoundEnabled(!soundEnabled)}
            />
            
            <div className="p-4 md:p-8 max-w-7xl mx-auto">
                {/* Message Display */}
                {message && (
                    <div className={`mb-6 p-4 rounded-xl border backdrop-blur-sm ${
                        message.type === 'success' 
                            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-800' 
                            : 'bg-red-50/80 border-red-200 text-red-800'
                    }`} data-aos="fade-down">
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

                {/* Header Section */}
                <div className="mb-8" data-aos="fade-down">
                    <div className="flex items-center mb-6">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                            <MdSecurity className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                                Sistem Akses Ruangan
                            </h1>
                            <p className="text-slate-600 mt-1">Kelola akses pintu kelas dan monitoring keamanan</p>
                        </div>
                    </div>
                </div>

                {/* Door Status and Quick Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
                    {/* Door Status Card */}
                    <div className="lg:col-span-7 bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6" data-aos="fade-up">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-semibold text-slate-800 flex items-center">
                                <MdMeetingRoom className="w-6 h-6 mr-3" />
                                Status Pintu Utama
                            </h3>
                            <button 
                                onClick={fetchDoorStatus}
                                className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
                            >
                                <MdRefresh className="w-5 h-5 text-slate-600" />
                            </button>
                        </div>
                        
                        <div className="flex items-center space-x-8">
                            {/* Door Status */}
                            <div className="flex items-center">
                                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mr-6 shadow-lg ${
                                    doorStatus.status === 'locked' 
                                        ? 'bg-gradient-to-br from-red-500 to-red-600' 
                                        : 'bg-gradient-to-br from-green-500 to-green-600'
                                }`}>
                                    {doorStatus.status === 'locked' ? (
                                        <MdLock className="w-10 h-10 text-white" />
                                    ) : (
                                        <MdLockOpen className="w-10 h-10 text-white" />
                                    )}
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-slate-800">
                                        {doorStatus.status === 'locked' ? 'Terkunci' : 'Terbuka'}
                                    </p>
                                    <p className="text-slate-600">Status Pintu</p>
                                </div>
                            </div>
                            
                            {/* Health Status */}
                            <div className="border-l border-slate-200 pl-8">
                                <div className="flex items-center mb-3">
                                    {doorStatus.health === 'online' ? (
                                        <MdSignalWifi4Bar className="w-6 h-6 text-green-500 mr-3" />
                                    ) : (
                                        <MdSignalWifiOff className="w-6 h-6 text-red-500 mr-3" />
                                    )}
                                    <span className={`text-xl font-semibold ${
                                        doorStatus.health === 'online' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                        {doorStatus.health === 'online' ? 'Online' : 'Offline'}
                                    </span>
                                </div>
                                <p className="text-slate-600">Koneksi Sistem</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="lg:col-span-5 grid grid-cols-1 gap-4">
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white" data-aos="fade-up" data-aos-delay="100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-3xl font-bold">{displayStats.totalClasses}</p>
                                    <p className="text-blue-100">Total Kelas</p>
                                </div>
                                <MdDashboard className="w-8 h-8 text-blue-200" />
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-xl p-6 text-white" data-aos="fade-up" data-aos-delay="200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-3xl font-bold">{displayStats.activeClasses}</p>
                                    <p className="text-emerald-100">Kelas Aktif</p>
                                </div>
                                <MdTrendingUp className="w-8 h-8 text-emerald-200" />
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white" data-aos="fade-up" data-aos-delay="300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-3xl font-bold">{displayStats.totalAccess}</p>
                                    <p className="text-purple-100">Akses Hari Ini</p>
                                </div>
                                <MdPeople className="w-8 h-8 text-purple-200" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-8" data-aos="fade-up">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div className="flex items-center space-x-4">
                            <MdFilterList className="w-6 h-6 text-slate-600" />
                            <span className="font-semibold text-slate-700">Filter Kelas:</span>
                            <div className="flex space-x-2">
                                {[
                                    { key: 'all', label: 'Semua', count: classes.length },
                                    { key: 'active', label: 'Aktif', count: classes.filter(c => c.active).length },
                                    { key: 'inactive', label: 'Nonaktif', count: classes.filter(c => !c.active).length }
                                ].map(filterOption => (
                                    <button
                                        key={filterOption.key}
                                        onClick={() => setFilter(filterOption.key)}
                                        className={`px-5 py-3 rounded-xl text-sm font-medium transition-all ${
                                            filter === filterOption.key
                                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-105'
                                                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 hover:shadow-md'
                                        }`}
                                    >
                                        {filterOption.label} <span className="font-bold">({filterOption.count})</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        <div className="relative">
                            <MdSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input 
                                value={search} 
                                onChange={(e) => setSearch(e.target.value)} 
                                placeholder="Cari kelas, kode, atau dosen..." 
                                className="pl-12 pr-4 py-3 w-full lg:w-80 text-sm border border-slate-200 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm" 
                            />
                        </div>
                    </div>
                </div>

                {/* Class Access List */}
                <div data-aos="fade-up" className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-slate-800">Daftar Kelas dengan Akses</h2>
                        <span className="text-slate-600">
                            Menampilkan {filteredClasses.length} dari {classes.length} kelas
                        </span>
                    </div>
                    
                    {loading && (
                        <div className="text-center py-16 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-slate-500">Memuat data kelas...</p>
                        </div>
                    )}

                    {!loading && (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredClasses.map(cls => (
                                <div key={cls.id} className="group bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                                    {/* Header with Status */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center mb-2">
                                                <MdClass className="w-5 h-5 text-blue-600 mr-2" />
                                                <h3 className="font-bold text-slate-800 text-lg">{cls.course_code}</h3>
                                            </div>
                                            <h4 className="font-semibold text-slate-700 mb-1">{cls.class_name}</h4>
                                            <p className="text-sm text-slate-600 line-clamp-2">{cls.course_name}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                            cls.active 
                                                ? 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border border-emerald-200' 
                                                : 'bg-gradient-to-r from-gray-100 to-slate-100 text-slate-600 border border-slate-200'
                                        }`}>
                                            {cls.active ? 'AKTIF' : 'NONAKTIF'}
                                        </span>
                                    </div>
                                    
                                    {/* Details Grid */}
                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center justify-between p-3 bg-slate-50/80 rounded-xl">
                                            <div className="flex items-center">
                                                <MdPeople className="w-4 h-4 text-slate-500 mr-2" />
                                                <span className="text-sm text-slate-600">Dosen</span>
                                            </div>
                                            <span className="text-sm font-medium text-slate-800">{cls.lecturer}</span>
                                        </div>
                                        
                                        <div className="flex items-center justify-between p-3 bg-slate-50/80 rounded-xl">
                                            <div className="flex items-center">
                                                <MdSchedule className="w-4 h-4 text-slate-500 mr-2" />
                                                <span className="text-sm text-slate-600">Jadwal</span>
                                            </div>
                                            <span className="text-sm font-medium text-slate-800 text-right">
                                                {cls.schedule && cls.schedule.length > 0 
                                                    ? cls.schedule.map(s => `${s.day} ${s.start_time || s.start}-${s.end_time || s.end}`).join(', ')
                                                    : 'Belum dijadwalkan'
                                                }
                                            </span>
                                        </div>
                                        
                                        <div className="flex items-center justify-between p-3 bg-slate-50/80 rounded-xl">
                                            <div className="flex items-center">
                                                <MdAccessAlarms className="w-4 h-4 text-slate-500 mr-2" />
                                                <span className="text-sm text-slate-600">Akses Hari Ini</span>
                                            </div>
                                            <span className="text-sm font-bold text-blue-600">{cls.todayAccessCount || 0}</span>
                                        </div>
                                        
                                        <div className="flex items-center justify-between p-3 bg-slate-50/80 rounded-xl">
                                            <div className="flex items-center">
                                                <MdAccessTime className="w-4 h-4 text-slate-500 mr-2" />
                                                <span className="text-sm text-slate-600">Akses Terakhir</span>
                                            </div>
                                            <span className="text-sm font-medium text-slate-800">{cls.lastAccess || 'Belum ada'}</span>
                                        </div>
                                    </div>
                                    
                                    {/* Action Buttons */}
                                    <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                                        <button 
                                            onClick={() => navigate(`/admin/room-access/${cls.id}/detail`)}
                                            className="flex items-center px-4 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <MdVisibility className="w-4 h-4 mr-2" /> 
                                            Detail
                                        </button>
                                        
                                        {cls.active ? (
                                            <button 
                                                onClick={() => handleRevokeAccess(cls.id, `${cls.course_code} - ${cls.class_name}`)}
                                                className="flex items-center px-4 py-2 text-sm bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-lg"
                                            >
                                                <MdCancel className="w-4 h-4 mr-2" />
                                                Cabut Akses
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => handleGrantAccess(cls.id, `${cls.course_code} - ${cls.class_name}`)}
                                                className="flex items-center px-4 py-2 text-sm bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg hover:from-emerald-600 hover:to-green-700 transition-all shadow-lg"
                                            >
                                                <MdCheckCircle className="w-4 h-4 mr-2" />
                                                Berikan Akses
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {!loading && filteredClasses.length === 0 && (
                        <div className="text-center py-16 bg-white/70 backdrop-blur-sm rounded-2xl border border-dashed border-slate-300">
                            <MdWarning className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-slate-800 mb-2">Tidak ada kelas ditemukan</h3>
                            <p className="text-slate-600">Coba ubah filter atau kata kunci pencarian.</p>
                        </div>
                    )}
                </div>

                {/* Footer Info */}
                <div className="mt-12 text-center text-sm text-slate-500" data-aos="fade-up">
                    <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <p className="mb-2">
                            🔒 Sistem Keamanan Akses Ruangan - Terpusat pada satu perangkat pintu utama
                        </p>
                        <p>
                            Semua kelas menggunakan pintu yang sama dengan sistem kontrol akses berdasarkan jadwal dan status kelas
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomAccess;