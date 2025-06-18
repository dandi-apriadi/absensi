import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    MdCloudUpload,
    MdFace,
    MdVerified,
    MdDataset,
    MdPerson,
    MdPhotoCamera,
    MdDeleteSweep,
    MdRefresh,
    MdSearch,
    MdFilterList,
    MdVisibility,
    MdEdit,
    MdDelete,
    MdAdd,
    MdPersonAdd,
    MdCheckCircle,
    MdError,
    MdWarning,
    MdCloudSync,
    MdSettings,
    MdAnalytics,
    MdGroup,
    MdSchool,
    MdAccessTime,
    MdTrendingUp,
    MdImageSearch,
    MdFaceRetouchingNatural,
    MdCameraAlt,
    MdCollections,
    MdHistory
} from "react-icons/md";
import AOS from "aos";
import "aos/dist/aos.css";

const FaceDatasetManagement = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterDepartment, setFilterDepartment] = useState('all');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        AOS.init({
            duration: 800,
            offset: 100,
            easing: 'ease-in-out',
            once: true,
        });
    }, []);

    // Dummy data for statistics
    const statsData = [
        {
            title: "Total Dataset Wajah",
            value: 1180,
            text: "dari 1257 pengguna",
            color: "bg-gradient-to-r from-blue-500 to-blue-600",
            percentage: 94,
            icon: MdFace,
            trend: "+15",
            trendLabel: "minggu ini"
        },
        {
            title: "Dataset Terverifikasi",
            value: 1120,
            text: "kualitas tinggi",
            color: "bg-gradient-to-r from-green-500 to-green-600",
            percentage: 95,
            icon: MdVerified,
            trend: "+8",
            trendLabel: "minggu ini"
        },
        {
            title: "Perlu Dataset",
            value: 77,
            text: "belum memiliki",
            color: "bg-gradient-to-r from-orange-500 to-orange-600",
            percentage: 6,
            icon: MdDataset,
            trend: "-12",
            trendLabel: "minggu ini"
        },
        {
            title: "Akurasi Pengenalan",
            value: "98.7%",
            text: "rata-rata sistem",
            color: "bg-gradient-to-r from-purple-500 to-purple-600",
            percentage: 98.7,
            icon: MdAnalytics,
            trend: "+2.1%",
            trendLabel: "bulan ini"
        }
    ];

    // Dummy data for users without face dataset
    const usersWithoutDataset = [
        {
            id: 1,
            name: "Ahmad Fauzi Rahman",
            nim: "2021010101",
            department: "Teknik Informatika",
            email: "ahmad.fauzi@student.univ.ac.id",
            registrationDate: "2024-06-15",
            status: "pending",
            lastLogin: "2024-06-16"
        },
        {
            id: 2,
            name: "Sarah Wijaya",
            nim: "2022010102",
            department: "Sistem Informasi",
            email: "sarah.wijaya@student.univ.ac.id",
            registrationDate: "2024-06-10",
            status: "pending",
            lastLogin: "2024-06-17"
        },
        {
            id: 3,
            name: "Dr. Budi Santoso, M.Kom",
            nip: "197801012005011001",
            department: "Teknik Informatika",
            email: "budi.santoso@lecturer.univ.ac.id",
            registrationDate: "2024-06-08",
            status: "pending",
            lastLogin: "2024-06-16"
        }
    ];

    // Dummy data for users with face dataset
    const usersWithDataset = [
        {
            id: 1,
            name: "Rina Melati",
            nim: "2020010104",
            department: "Manajemen Informatika",
            email: "rina.melati@student.univ.ac.id",
            faceImages: 15,
            lastUpdate: "2024-06-15",
            status: "verified",
            accuracy: 99.2,
            thumbnail: "/api/placeholder/60/60"
        },
        {
            id: 2,
            name: "Prof. Dr. Indira Sari, M.T",
            nip: "196505101990032001",
            department: "Teknik Informatika",
            email: "indira.sari@lecturer.univ.ac.id",
            faceImages: 12,
            lastUpdate: "2024-06-14",
            status: "verified",
            accuracy: 98.8,
            thumbnail: "/api/placeholder/60/60"
        },
        {
            id: 3,
            name: "Muhammad Rizky",
            nim: "2021010105",
            department: "Sistem Informasi",
            email: "muhammad.rizky@student.univ.ac.id",
            faceImages: 10,
            lastUpdate: "2024-06-12",
            status: "needs_review",
            accuracy: 92.1,
            thumbnail: "/api/placeholder/60/60"
        },
        {
            id: 4,
            name: "Dewi Kartika",
            nim: "2022010106",
            department: "Teknik Informatika",
            email: "dewi.kartika@student.univ.ac.id",
            faceImages: 18,
            lastUpdate: "2024-06-11",
            status: "verified",
            accuracy: 99.5,
            thumbnail: "/api/placeholder/60/60"
        }
    ];

    // Dummy recent activities
    const recentActivities = [
        {
            id: 1,
            type: "upload",
            user: "Ahmad Fauzi Rahman",
            action: "Mengunggah 5 foto wajah baru",
            timestamp: "2024-06-17T10:30:00",
            status: "success"
        },
        {
            id: 2,
            type: "verify",
            user: "System",
            action: "Memverifikasi dataset Sarah Wijaya",
            timestamp: "2024-06-17T09:15:00",
            status: "success"
        },
        {
            id: 3,
            type: "delete",
            user: "Admin",
            action: "Menghapus dataset dengan kualitas rendah",
            timestamp: "2024-06-17T08:45:00",
            status: "warning"
        },
        {
            id: 4,
            type: "train",
            user: "System",
            action: "Melatih model dengan 150 dataset baru",
            timestamp: "2024-06-16T23:00:00",
            status: "success"
        }
    ];

    const handleBulkUpload = () => {
        setIsUploading(true);
        setUploadProgress(0);

        const interval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsUploading(false);
                    setShowUploadModal(false);
                    return 100;
                }
                return prev + 10;
            });
        }, 200);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'verified': return 'bg-green-100 text-green-800';
            case 'needs_review': return 'bg-yellow-100 text-yellow-800';
            case 'pending': return 'bg-blue-100 text-blue-800';
            case 'error': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'verified': return <MdCheckCircle className="w-4 h-4" />;
            case 'needs_review': return <MdWarning className="w-4 h-4" />;
            case 'pending': return <MdAccessTime className="w-4 h-4" />;
            case 'error': return <MdError className="w-4 h-4" />;
            default: return <MdAccessTime className="w-4 h-4" />;
        }
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: MdAnalytics },
        { id: 'with_dataset', label: 'Memiliki Dataset', icon: MdFaceRetouchingNatural },
        { id: 'without_dataset', label: 'Perlu Dataset', icon: MdPersonAdd },
        { id: 'activities', label: 'Aktivitas', icon: MdHistory }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 p-4 md:p-8">
            {/* Header */}
            <div className="mb-8" data-aos="fade-down">
                <div className="flex items-center gap-4 mb-6">
                    <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-3 rounded-xl text-white">
                        <MdFace className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                            Manajemen Dataset Wajah
                        </h1>
                        <p className="text-gray-600 text-lg">Kelola dataset wajah untuk sistem pengenalan wajah AI</p>
                    </div>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statsData.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100"
                        data-aos="fade-up"
                        data-aos-delay={index * 100}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`${stat.color} p-3 rounded-xl text-white`}>
                                <stat.icon className="w-8 h-8" />
                            </div>
                            <div className="text-right">
                                <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                                    <MdTrendingUp className="w-4 h-4" />
                                    {stat.trend}
                                </span>
                                <p className="text-xs text-gray-500">{stat.trendLabel}</p>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</h3>
                            <p className="text-gray-600 text-sm font-medium mb-2">{stat.title}</p>
                            <p className="text-gray-500 text-sm">{stat.text}</p>
                        </div>
                        {typeof stat.percentage === 'number' && (
                            <div className="mt-4">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-2 rounded-full transition-all duration-1000"
                                        style={{ width: `${Math.min(stat.percentage, 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white rounded-2xl shadow-lg mb-8 border border-gray-100" data-aos="fade-up">
                <div className="flex flex-wrap border-b border-gray-200">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-4 font-medium transition-all duration-300 ${activeTab === tab.id
                                ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                                : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                                }`}
                        >
                            <tab.icon className="w-5 h-5" />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Container */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100" data-aos="fade-up" data-aos-delay="200">
                <div className="p-8">
                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <div className="space-y-8" data-aos="fade-right">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">Dataset Overview</h2>
                                <p className="text-gray-600">Ringkasan kondisi dataset wajah sistem</p>
                            </div>

                            {/* Quick Actions */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="bg-blue-600 p-3 rounded-xl text-white">
                                            <MdCloudUpload className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800">Bulk Upload</h3>
                                            <p className="text-gray-600 text-sm">Upload multiple face datasets</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowUploadModal(true)}
                                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
                                    >
                                        Mulai Upload
                                    </button>
                                </div>

                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="bg-green-600 p-3 rounded-xl text-white">
                                            <MdCloudSync className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800">Sync Dataset</h3>
                                            <p className="text-gray-600 text-sm">Synchronize with AI model</p>
                                        </div>
                                    </div>
                                    <button className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300">
                                        Sinkronisasi
                                    </button>
                                </div>

                                <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-200">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="bg-purple-600 p-3 rounded-xl text-white">
                                            <MdSettings className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800">Model Training</h3>
                                            <p className="text-gray-600 text-sm">Train recognition model</p>
                                        </div>
                                    </div>
                                    <button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-300">
                                        Latih Model
                                    </button>
                                </div>
                            </div>

                            {/* Recent Activities */}
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">Aktivitas Terbaru</h3>
                                <div className="space-y-4">
                                    {recentActivities.map((activity) => (
                                        <div key={activity.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                                            <div className={`p-2 rounded-lg ${activity.status === 'success' ? 'bg-green-100 text-green-600' :
                                                activity.status === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                                                    'bg-red-100 text-red-600'
                                                }`}>
                                                {activity.type === 'upload' && <MdCloudUpload className="w-5 h-5" />}
                                                {activity.type === 'verify' && <MdVerified className="w-5 h-5" />}
                                                {activity.type === 'delete' && <MdDelete className="w-5 h-5" />}
                                                {activity.type === 'train' && <MdSettings className="w-5 h-5" />}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-800">{activity.action}</p>
                                                <p className="text-sm text-gray-600">oleh {activity.user}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-gray-500">
                                                    {new Date(activity.timestamp).toLocaleDateString('id-ID', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Users with Dataset Tab */}
                    {activeTab === 'with_dataset' && (
                        <div className="space-y-6" data-aos="fade-right">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Pengguna dengan Dataset</h2>
                                    <p className="text-gray-600">Kelola pengguna yang sudah memiliki dataset wajah</p>
                                </div>
                                <div className="flex gap-3">
                                    <div className="relative">
                                        <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            placeholder="Cari pengguna..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                    <select
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="all">Semua Status</option>
                                        <option value="verified">Terverifikasi</option>
                                        <option value="needs_review">Perlu Review</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {usersWithDataset.map((user) => (
                                    <div key={user.id} className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-all duration-300 hover:shadow-lg">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-800">{user.name}</h3>
                                                <p className="text-sm text-gray-600">{user.nim || user.nip}</p>
                                                <p className="text-xs text-gray-500">{user.department}</p>
                                            </div>
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                                                {getStatusIcon(user.status)}
                                                {user.status === 'verified' ? 'Verified' : 'Review'}
                                            </span>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Foto Wajah:</span>
                                                <span className="font-medium">{user.faceImages} foto</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Akurasi:</span>
                                                <span className={`font-medium ${user.accuracy >= 95 ? 'text-green-600' : 'text-yellow-600'}`}>
                                                    {user.accuracy}%
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Update:</span>
                                                <span className="text-gray-500">{new Date(user.lastUpdate).toLocaleDateString('id-ID')}</span>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 mt-4">
                                            <button className="flex-1 bg-indigo-600 text-white py-2 px-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200 text-sm flex items-center justify-center gap-1">
                                                <MdVisibility className="w-4 h-4" />
                                                Lihat
                                            </button>
                                            <button className="flex-1 bg-gray-600 text-white py-2 px-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 text-sm flex items-center justify-center gap-1">
                                                <MdEdit className="w-4 h-4" />
                                                Edit
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Users without Dataset Tab */}
                    {activeTab === 'without_dataset' && (
                        <div className="space-y-6" data-aos="fade-right">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Pengguna Tanpa Dataset</h2>
                                    <p className="text-gray-600">Kelola pengguna yang belum memiliki dataset wajah</p>
                                </div>
                                <button className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-3 rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all duration-300 flex items-center gap-2">
                                    <MdAdd className="w-5 h-5" />
                                    Tambah Dataset
                                </button>
                            </div>

                            <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
                                <div className="flex items-center gap-3 mb-3">
                                    <MdWarning className="w-6 h-6 text-orange-600" />
                                    <h3 className="text-lg font-semibold text-orange-800">Perhatian</h3>
                                </div>
                                <p className="text-orange-700">
                                    {usersWithoutDataset.length} pengguna belum memiliki dataset wajah.
                                    Sistem pengenalan wajah tidak akan berfungsi untuk pengguna ini.
                                </p>
                            </div>

                            <div className="space-y-4">
                                {usersWithoutDataset.map((user) => (
                                    <div key={user.id} className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors duration-200">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white font-bold">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-800">{user.name}</h3>
                                                    <p className="text-sm text-gray-600">{user.nim || user.nip} • {user.department}</p>
                                                    <p className="text-xs text-gray-500">
                                                        Terdaftar: {new Date(user.registrationDate).toLocaleDateString('id-ID')} •
                                                        Login terakhir: {new Date(user.lastLogin).toLocaleDateString('id-ID')}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm flex items-center gap-1">
                                                    <MdCameraAlt className="w-4 h-4" />
                                                    Upload Dataset
                                                </button>
                                                <button className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors duration-200 text-sm flex items-center gap-1">
                                                    <MdPerson className="w-4 h-4" />
                                                    Detail
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Activities Tab */}
                    {activeTab === 'activities' && (
                        <div className="space-y-6" data-aos="fade-right">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">Log Aktivitas</h2>
                                <p className="text-gray-600">Riwayat semua aktivitas pada dataset wajah</p>
                            </div>

                            <div className="space-y-4">
                                {recentActivities.concat([
                                    {
                                        id: 5,
                                        type: "upload",
                                        user: "Dewi Kartika",
                                        action: "Mengunggah 8 foto wajah baru",
                                        timestamp: "2024-06-16T15:20:00",
                                        status: "success"
                                    },
                                    {
                                        id: 6,
                                        type: "verify",
                                        user: "System",
                                        action: "Memverifikasi dataset Muhammad Rizky",
                                        timestamp: "2024-06-16T14:10:00",
                                        status: "warning"
                                    }
                                ]).map((activity) => (
                                    <div key={activity.id} className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors duration-200">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-xl ${activity.status === 'success' ? 'bg-green-100 text-green-600' :
                                                activity.status === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                                                    'bg-red-100 text-red-600'
                                                }`}>
                                                {activity.type === 'upload' && <MdCloudUpload className="w-6 h-6" />}
                                                {activity.type === 'verify' && <MdVerified className="w-6 h-6" />}
                                                {activity.type === 'delete' && <MdDelete className="w-6 h-6" />}
                                                {activity.type === 'train' && <MdSettings className="w-6 h-6" />}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-800">{activity.action}</h3>
                                                <p className="text-sm text-gray-600">oleh {activity.user}</p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {new Date(activity.timestamp).toLocaleDateString('id-ID', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${activity.status === 'success' ? 'bg-green-100 text-green-800' :
                                                activity.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                {getStatusIcon(activity.status)}
                                                {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full" data-aos="zoom-in">
                        <div className="text-center">
                            <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4">
                                <MdCloudUpload className="w-8 h-8 text-blue-600 mx-auto" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Bulk Upload Dataset</h3>
                            <p className="text-gray-600 mb-6">Upload multiple face datasets sekaligus</p>

                            {!isUploading ? (
                                <div className="space-y-4">
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                                        <MdCollections className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                        <p className="text-gray-500 text-sm">Drag & drop folder atau klik untuk pilih</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={handleBulkUpload}
                                            className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                        >
                                            Mulai Upload
                                        </button>
                                        <button
                                            onClick={() => setShowUploadModal(false)}
                                            className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-colors duration-200"
                                        >
                                            Batal
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div
                                            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                                            style={{ width: `${uploadProgress}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-blue-600 font-medium">Uploading... {uploadProgress}%</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FaceDatasetManagement;
