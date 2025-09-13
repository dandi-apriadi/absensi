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
    MdSearch
} from "react-icons/md";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";

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
    const [stats, setStats] = useState({
        totalClasses: 0,
        activeClasses: 0,
        totalAccess: 0
    });

    useEffect(() => {
        AOS.init({ duration: 600, once: true });
        fetchClassesWithAccess();
        fetchDoorStatus();
    }, []);

    // Refetch when filter or search changes
    useEffect(() => {
        fetchClassesWithAccess();
    }, [filter, search]);

    const fetchClassesWithAccess = async () => {
        try {
            setLoading(true);
            console.log('Fetching classes with room access...');
            
            const res = await api.get('/api/room-access/classes', {
                params: { filter, search }
            });
            
            console.log('Classes response:', res.data);
            
            if (res.data.success) {
                setClasses(res.data.data.classes || []);
                setStats({
                    totalClasses: res.data.data.totalClasses || 0,
                    activeClasses: res.data.data.activeClasses || 0,
                    totalAccess: res.data.data.totalAccess || 0
                });
            }
        } catch (error) {
            console.error('Failed to fetch classes:', error);
            setMessage({ 
                type: 'error', 
                text: 'Gagal memuat data kelas: ' + (error.response?.data?.message || error.message)
            });
            setClasses([]);
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
            // Don't show error message for door status as it's not critical
        }
    };

    const handleRevokeAccess = async (classId, className) => {
        if (!window.confirm(`Apakah Anda yakin ingin mencabut akses ruangan untuk kelas ${className}?`)) {
            return;
        }

        try {
            console.log('Revoking access for class:', classId);
            
            const res = await api.patch(`/api/room-access/classes/${classId}/revoke`);
            
            console.log('Revoke response:', res.data);
            
            if (res.data.success) {
                setMessage({ type: 'success', text: res.data.message });
                fetchClassesWithAccess(); // Refresh data
            }
        } catch (error) {
            console.error('Failed to revoke access:', error);
            setMessage({ 
                type: 'error', 
                text: 'Gagal mencabut akses: ' + (error.response?.data?.message || error.message)
            });
        }
    };

    const handleGrantAccess = async (classId, className) => {
        try {
            console.log('Granting access for class:', classId);
            
            const res = await api.patch(`/api/room-access/classes/${classId}/grant`);
            
            console.log('Grant response:', res.data);
            
            if (res.data.success) {
                setMessage({ type: 'success', text: res.data.message });
                fetchClassesWithAccess(); // Refresh data
            }
        } catch (error) {
            console.error('Failed to grant access:', error);
            setMessage({ 
                type: 'error', 
                text: 'Gagal memberikan akses: ' + (error.response?.data?.message || error.message)
            });
        }
    };

    const handleRefresh = () => {
        fetchClassesWithAccess();
        fetchDoorStatus();
    };

    // Filter classes based on current filter and search
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
        <div className="p-4 md:p-8">
            {/* Message Display */}
            {message && (
                <div className={`mb-6 p-4 rounded-lg border ${
                    message.type === 'success' 
                        ? 'bg-green-50 border-green-200 text-green-800' 
                        : 'bg-red-50 border-red-200 text-red-800'
                }`}>
                    <div className="flex items-center">
                        {message.type === 'success' ? (
                            <MdInfo className="w-5 h-5 mr-3" />
                        ) : (
                            <MdWarning className="w-5 h-5 mr-3" />
                        )}
                        {message.text}
                    </div>
                </div>
            )}

            <div className="mb-8" data-aos="fade-down">
                <h1 className="text-3xl font-bold text-gray-800">Akses Pintu Kelas</h1>
                <p className="text-gray-600">Sistem satu pintu: daftar kelas yang memiliki hak akses hari ini.</p>
            </div>

            {/* Door Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-md p-6" data-aos="fade-up">
                    <div className="flex items-center">
                        <div className="bg-blue-100 p-4 rounded-full mr-4">
                            <MdMeetingRoom className="h-8 w-8 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Total Kelas Terdaftar</p>
                            <h3 className="text-3xl font-bold text-gray-800">{displayStats.totalClasses}</h3>
                        </div>
                    </div>
                    <div className="mt-4 text-xs text-gray-500 flex items-center">
                        <MdInfo className="mr-1" /> Semua kelas memakai pintu yang sama.
                    </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-md p-6" data-aos="fade-up" data-aos-delay="100">
                    <div className="flex items-center">
                        <div className="bg-green-100 p-4 rounded-full mr-4">
                            <MdSecurity className="h-8 w-8 text-green-600" />
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Status Pintu</p>
                            <h3 className="text-2xl font-bold text-gray-800 capitalize">{doorStatus.status}</h3>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                        <span className={`text-xs font-medium px-2 py-1 rounded ${
                            doorStatus.health === 'online' 
                                ? 'bg-green-50 text-green-700' 
                                : doorStatus.health === 'degraded' 
                                    ? 'bg-yellow-50 text-yellow-700' 
                                    : 'bg-red-50 text-red-700'
                        }`}>
                            Health: {doorStatus.health}
                        </span>
                        <button 
                            onClick={handleRefresh}
                            className="text-xs text-blue-600 hover:underline flex items-center"
                            disabled={loading}
                        >
                            <MdRefresh className={`mr-1 ${loading ? 'animate-spin' : ''}`} /> 
                            Refresh
                        </button>
                    </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-md p-6" data-aos="fade-up" data-aos-delay="200">
                    <div className="flex items-center">
                        <div className="bg-yellow-100 p-4 rounded-full mr-4">
                            <MdAccessTime className="h-8 w-8 text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Total Akses Hari Ini</p>
                            <h3 className="text-3xl font-bold text-gray-800">{displayStats.totalAccess}</h3>
                        </div>
                    </div>
                    <div className="mt-4 text-xs text-gray-500">
                        Dari {displayStats.activeClasses} kelas yang aktif.
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4" data-aos="fade-up">
                <div className="flex items-center gap-2 text-sm">
                    <button 
                        onClick={() => setFilter('all')} 
                        className={`px-3 py-1 rounded-full border text-xs ${
                            filter === 'all' 
                                ? 'bg-blue-600 text-white border-blue-600' 
                                : 'bg-white text-gray-600 border-gray-200'
                        }`}
                    >
                        Semua
                    </button>
                    <button 
                        onClick={() => setFilter('active')} 
                        className={`px-3 py-1 rounded-full border text-xs ${
                            filter === 'active' 
                                ? 'bg-blue-600 text-white border-blue-600' 
                                : 'bg-white text-gray-600 border-gray-200'
                        }`}
                    >
                        Aktif
                    </button>
                    <button 
                        onClick={() => setFilter('inactive')} 
                        className={`px-3 py-1 rounded-full border text-xs ${
                            filter === 'inactive' 
                                ? 'bg-blue-600 text-white border-blue-600' 
                                : 'bg-white text-gray-600 border-gray-200'
                        }`}
                    >
                        Tidak Aktif
                    </button>
                </div>
                <div className="flex items-center gap-2 flex-1 md:justify-end">
                    <input 
                        value={search} 
                        onChange={(e) => setSearch(e.target.value)} 
                        placeholder="Cari kelas / kode..." 
                        className="w-full md:w-64 text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                </div>
            </div>

            {/* Class Access List */}
            <div data-aos="fade-up" className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-800">Kelas Memiliki Akses</h2>
                
                {loading && (
                    <div className="text-center py-10 bg-white rounded-xl border border-gray-200">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-sm text-gray-500">Memuat data...</p>
                    </div>
                )}

                {!loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredClasses.map(cls => (
                            <div key={cls.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="font-semibold text-gray-800">{cls.course_code} - {cls.class_name}</h3>
                                        <p className="text-sm text-gray-600 line-clamp-1">{cls.course_name}</p>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                        cls.active 
                                            ? 'bg-green-50 text-green-700' 
                                            : 'bg-gray-100 text-gray-500'
                                    }`}>
                                        {cls.active ? 'Aktif' : 'Nonaktif'}
                                    </span>
                                </div>
                                
                                <div className="text-xs space-y-1 mb-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500">Dosen</span>
                                        <span className="font-medium text-gray-700">{cls.lecturer}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500">Jadwal</span>
                                        <span>
                                            {cls.schedule && cls.schedule.length > 0 
                                                ? cls.schedule.map(s => `${s.day} ${s.start_time || s.start}-${s.end_time || s.end}`).join(', ')
                                                : 'Tidak ada jadwal'
                                            }
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500">Akses Hari Ini</span>
                                        <span>{cls.todayAccessCount || 0}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500">Last Access</span>
                                        <span>{cls.lastAccess || '-'}</span>
                                    </div>
                                </div>
                                
                                <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100">
                                    <button 
                                        onClick={() => navigate(`/admin/room-access/${cls.id}/detail`)}
                                        className="text-xs text-blue-600 hover:underline flex items-center"
                                    >
                                        <MdInfo className="mr-1" /> Detail
                                    </button>
                                    {cls.active ? (
                                        <button 
                                            onClick={() => handleRevokeAccess(cls.id, `${cls.course_code} - ${cls.class_name}`)}
                                            className="text-xs px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                                        >
                                            Revoke Akses
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={() => handleGrantAccess(cls.id, `${cls.course_code} - ${cls.class_name}`)}
                                            className="text-xs px-2 py-1 rounded bg-green-600 text-white hover:bg-green-700"
                                        >
                                            Grant Akses
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && filteredClasses.length === 0 && (
                    <div className="text-center py-10 bg-white rounded-xl border border-dashed border-gray-300">
                        <p className="text-sm text-gray-500">Tidak ada kelas ditemukan.</p>
                    </div>
                )}
            </div>

            {/* Simple System Note */}
            <div className="mt-10 text-xs text-gray-400" data-aos="fade-up">
                Sistem akses pintu ini hanya mendukung 1 perangkat fisik. Semua kelas terjadwal menggunakan pintu yang sama.
            </div>
        </div>
    );
};

export default RoomAccess;
