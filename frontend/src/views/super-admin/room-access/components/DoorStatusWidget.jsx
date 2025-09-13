import React, { useState, useEffect } from 'react';
import {
    MdLock,
    MdLockOpen,
    MdSignalWifi4Bar,
    MdSignalWifiOff,
    MdSecurity,
    MdWarning,
    MdCheckCircle,
    MdRefresh,
    MdSettings,
    MdNotifications,
    MdPowerSettingsNew,
    MdSignalCellular4Bar,
    MdSignalCellularOff,
    MdTimer,
    MdAccessTime
} from 'react-icons/md';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";

const api = axios.create({
    baseURL: API_BASE,
    withCredentials: true
});

const DoorStatusWidget = ({ onStatusUpdate }) => {
    const [doorStatus, setDoorStatus] = useState({
        status: "locked",
        health: "online",
        lastUpdate: new Date().toISOString(),
        temperature: 24,
        battery: 85,
        signal: 95,
        uptime: "2d 14h 23m"
    });
    const [loading, setLoading] = useState(false);
    const [autoRefresh, setAutoRefresh] = useState(true);

    const fetchDoorStatus = async () => {
        try {
            setLoading(true);
            const res = await api.get('/api/room-access/door/status');
            
            if (res.data.success) {
                const newStatus = {
                    ...res.data.data,
                    lastUpdate: new Date().toISOString(),
                    temperature: Math.floor(Math.random() * 10) + 20, // Simulate temperature
                    battery: Math.floor(Math.random() * 30) + 70, // Simulate battery
                    signal: Math.floor(Math.random() * 20) + 80, // Simulate signal
                    uptime: "2d 14h 23m" // Simulate uptime
                };
                setDoorStatus(newStatus);
                if (onStatusUpdate) {
                    onStatusUpdate(newStatus);
                }
            }
        } catch (error) {
            console.error('Failed to fetch door status:', error);
        } finally {
            setLoading(false);
        }
    };

    // Auto refresh every 30 seconds
    useEffect(() => {
        fetchDoorStatus();
        
        if (autoRefresh) {
            const interval = setInterval(fetchDoorStatus, 30000);
            return () => clearInterval(interval);
        }
    }, [autoRefresh]);

    const getStatusColor = () => {
        if (doorStatus.health !== 'online') return 'from-red-500 to-red-600';
        return doorStatus.status === 'locked' 
            ? 'from-red-500 to-red-600' 
            : 'from-green-500 to-green-600';
    };

    const getHealthColor = () => {
        return doorStatus.health === 'online' 
            ? 'text-green-500' 
            : 'text-red-500';
    };

    const formatLastUpdate = () => {
        const now = new Date();
        const lastUpdate = new Date(doorStatus.lastUpdate);
        const diff = Math.floor((now - lastUpdate) / 1000);
        
        if (diff < 60) return `${diff} detik lalu`;
        if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
        return `${Math.floor(diff / 3600)} jam lalu`;
    };

    return (
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-800 flex items-center">
                    <MdSecurity className="w-6 h-6 mr-3 text-blue-600" />
                    Status Pintu Sistem
                </h3>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setAutoRefresh(!autoRefresh)}
                        className={`p-2 rounded-lg transition-colors ${
                            autoRefresh 
                                ? 'bg-green-100 text-green-600' 
                                : 'bg-gray-100 text-gray-600'
                        }`}
                        title={autoRefresh ? 'Auto-refresh aktif' : 'Auto-refresh nonaktif'}
                    >
                        <MdNotifications className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={fetchDoorStatus}
                        disabled={loading}
                        className="p-2 rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-50"
                        title="Refresh manual"
                    >
                        <MdRefresh className={`w-4 h-4 text-slate-600 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Main Status Display */}
            <div className="mb-6">
                <div className="flex items-center justify-center mb-4">
                    <div className={`w-24 h-24 rounded-3xl flex items-center justify-center shadow-2xl bg-gradient-to-br ${getStatusColor()}`}>
                        {doorStatus.status === 'locked' ? (
                            <MdLock className="w-12 h-12 text-white" />
                        ) : (
                            <MdLockOpen className="w-12 h-12 text-white" />
                        )}
                    </div>
                </div>
                
                <div className="text-center">
                    <p className="text-3xl font-bold text-slate-800 mb-1">
                        {doorStatus.status === 'locked' ? 'TERKUNCI' : 'TERBUKA'}
                    </p>
                    <p className="text-slate-600">Status Pintu Utama</p>
                </div>
            </div>

            {/* System Health Indicators */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Connection Status */}
                <div className="bg-slate-50/80 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-600">Koneksi</span>
                        {doorStatus.health === 'online' ? (
                            <MdSignalWifi4Bar className={`w-5 h-5 ${getHealthColor()}`} />
                        ) : (
                            <MdSignalWifiOff className={`w-5 h-5 ${getHealthColor()}`} />
                        )}
                    </div>
                    <p className={`font-bold ${getHealthColor()}`}>
                        {doorStatus.health === 'online' ? 'Online' : 'Offline'}
                    </p>
                </div>

                {/* Signal Strength */}
                <div className="bg-slate-50/80 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-600">Sinyal</span>
                        {doorStatus.signal > 50 ? (
                            <MdSignalCellular4Bar className="w-5 h-5 text-green-500" />
                        ) : (
                            <MdSignalCellularOff className="w-5 h-5 text-red-500" />
                        )}
                    </div>
                    <p className="font-bold text-slate-800">{doorStatus.signal}%</p>
                </div>

                {/* Battery Level */}
                <div className="bg-slate-50/80 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-600">Baterai</span>
                        <div className={`w-5 h-3 border-2 rounded-sm ${
                            doorStatus.battery > 50 ? 'border-green-500' : 'border-red-500'
                        }`}>
                            <div 
                                className={`h-full rounded-xs ${
                                    doorStatus.battery > 50 ? 'bg-green-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${doorStatus.battery}%` }}
                            ></div>
                        </div>
                    </div>
                    <p className="font-bold text-slate-800">{doorStatus.battery}%</p>
                </div>

                {/* Temperature */}
                <div className="bg-slate-50/80 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-600">Suhu</span>
                        <MdPowerSettingsNew className="w-5 h-5 text-blue-500" />
                    </div>
                    <p className="font-bold text-slate-800">{doorStatus.temperature}°C</p>
                </div>
            </div>

            {/* Status Timeline */}
            <div className="mb-6">
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Status Terakhir</h4>
                <div className="space-y-2">
                    <div className="flex items-center p-3 bg-green-50 rounded-lg border border-green-200">
                        <MdCheckCircle className="w-4 h-4 text-green-600 mr-3" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-green-800">Sistem Normal</p>
                            <p className="text-xs text-green-600">{formatLastUpdate()}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* System Metrics */}
            <div className="bg-slate-50/80 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Metrik Sistem</h4>
                <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <MdTimer className="w-4 h-4 text-slate-500 mr-2" />
                            <span className="text-slate-600">Uptime</span>
                        </div>
                        <span className="font-medium text-slate-800">{doorStatus.uptime}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <MdAccessTime className="w-4 h-4 text-slate-500 mr-2" />
                            <span className="text-slate-600">Update Terakhir</span>
                        </div>
                        <span className="font-medium text-slate-800">{formatLastUpdate()}</span>
                    </div>
                </div>
            </div>

            {/* Auto Refresh Indicator */}
            {autoRefresh && (
                <div className="mt-4 flex items-center justify-center text-xs text-slate-500">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                    Auto-refresh aktif (30s)
                </div>
            )}
        </div>
    );
};

export default DoorStatusWidget;