import React, { useState, useEffect } from "react";
import {
    MdDataset,
    MdFace,
    MdPerson,
    MdEdit,
    MdDelete,
    MdVisibility,
    MdDownload,
    MdSearch,
    MdFilterList,
    MdGridView,
    MdViewList,
    MdMoreVert,
    MdCheckCircle,
    MdError,
    MdWarning,
    MdInfo,
    MdRefresh,
    MdCloudSync,
    MdSettings,
    MdAnalytics,
    MdGroup,
    MdSchool,
    MdPersonAdd,
    MdImageSearch,
    MdCollections,
    MdFaceRetouchingNatural,
    MdVerified,
    MdClose,
    MdZoomIn,
    MdCrop,
    MdBrightness6,
    MdAutoAwesome,
    MdTune,
    MdSort,
    MdSelectAll,
    MdDeleteSweep,
    MdCloudUpload, MdHistory,
    MdTrendingUp,
    MdAccessTime,
    MdUpdate,
    MdStars
} from "react-icons/md";
import AOS from "aos";
import "aos/dist/aos.css";

const ManageDataset = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [viewMode, setViewMode] = useState('grid'); // grid or list
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterDepartment, setFilterDepartment] = useState('all');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [sortBy, setSortBy] = useState('name');

    useEffect(() => {
        AOS.init({
            duration: 800,
            offset: 100,
            easing: 'ease-in-out',
            once: true,
        });
    }, []);

    // Dummy dataset statistics
    const datasetStats = [
        {
            title: "Total Pengguna",
            value: 1257,
            change: "+23",
            changeLabel: "minggu ini",
            icon: MdGroup,
            color: "bg-gradient-to-r from-blue-500 to-blue-600",
            description: "Jumlah total pengguna"
        },
        {
            title: "Memiliki Dataset",
            value: 1180,
            change: "+15",
            changeLabel: "minggu ini",
            icon: MdFaceRetouchingNatural,
            color: "bg-gradient-to-r from-green-500 to-green-600",
            description: "Pengguna dengan dataset"
        },
        {
            title: "Kualitas Tinggi",
            value: 1098, change: "+12",
            changeLabel: "minggu ini",
            icon: MdStars,
            color: "bg-gradient-to-r from-purple-500 to-purple-600",
            description: "Dataset berkualitas > 90%"
        },
        {
            title: "Perlu Review",
            value: 82,
            change: "-5",
            changeLabel: "minggu ini",
            icon: MdWarning,
            color: "bg-gradient-to-r from-orange-500 to-orange-600",
            description: "Dataset perlu ditinjau"
        }
    ];

    // Dummy users with datasets
    const usersWithDatasets = [
        {
            id: 1,
            name: "Ahmad Fauzi Rahman",
            nim: "2021010101",
            department: "Teknik Informatika",
            email: "ahmad.fauzi@student.univ.ac.id",
            images: [
                { id: 1, url: "/api/placeholder/150/150", quality: 95, timestamp: "2024-06-15T10:30:00" },
                { id: 2, url: "/api/placeholder/150/150", quality: 92, timestamp: "2024-06-15T10:31:00" },
                { id: 3, url: "/api/placeholder/150/150", quality: 88, timestamp: "2024-06-15T10:32:00" },
                { id: 4, url: "/api/placeholder/150/150", quality: 94, timestamp: "2024-06-15T10:33:00" },
                { id: 5, url: "/api/placeholder/150/150", quality: 91, timestamp: "2024-06-15T10:34:00" }
            ],
            totalImages: 5,
            avgQuality: 92,
            lastUpdate: "2024-06-15T10:34:00",
            status: "verified",
            recognition_accuracy: 98.5
        },
        {
            id: 2,
            name: "Sarah Wijaya",
            nim: "2022010102",
            department: "Sistem Informasi",
            email: "sarah.wijaya@student.univ.ac.id",
            images: [
                { id: 6, url: "/api/placeholder/150/150", quality: 89, timestamp: "2024-06-14T14:20:00" },
                { id: 7, url: "/api/placeholder/150/150", quality: 95, timestamp: "2024-06-14T14:21:00" },
                { id: 8, url: "/api/placeholder/150/150", quality: 87, timestamp: "2024-06-14T14:22:00" },
                { id: 9, url: "/api/placeholder/150/150", quality: 93, timestamp: "2024-06-14T14:23:00" }
            ],
            totalImages: 4,
            avgQuality: 91,
            lastUpdate: "2024-06-14T14:23:00",
            status: "needs_review",
            recognition_accuracy: 94.2
        },
        {
            id: 3,
            name: "Dr. Budi Santoso, M.Kom",
            nip: "197801012005011001",
            department: "Teknik Informatika",
            email: "budi.santoso@lecturer.univ.ac.id",
            images: [
                { id: 10, url: "/api/placeholder/150/150", quality: 97, timestamp: "2024-06-13T09:15:00" },
                { id: 11, url: "/api/placeholder/150/150", quality: 94, timestamp: "2024-06-13T09:16:00" },
                { id: 12, url: "/api/placeholder/150/150", quality: 96, timestamp: "2024-06-13T09:17:00" },
                { id: 13, url: "/api/placeholder/150/150", quality: 92, timestamp: "2024-06-13T09:18:00" },
                { id: 14, url: "/api/placeholder/150/150", quality: 98, timestamp: "2024-06-13T09:19:00" },
                { id: 15, url: "/api/placeholder/150/150", quality: 95, timestamp: "2024-06-13T09:20:00" }
            ],
            totalImages: 6,
            avgQuality: 95,
            lastUpdate: "2024-06-13T09:20:00",
            status: "verified",
            recognition_accuracy: 99.1
        },
        {
            id: 4,
            name: "Rina Melati",
            nim: "2020010104",
            department: "Manajemen Informatika",
            email: "rina.melati@student.univ.ac.id",
            images: [
                { id: 16, url: "/api/placeholder/150/150", quality: 85, timestamp: "2024-06-12T16:30:00" },
                { id: 17, url: "/api/placeholder/150/150", quality: 79, timestamp: "2024-06-12T16:31:00" },
                { id: 18, url: "/api/placeholder/150/150", quality: 82, timestamp: "2024-06-12T16:32:00" }
            ],
            totalImages: 3,
            avgQuality: 82,
            lastUpdate: "2024-06-12T16:32:00",
            status: "low_quality",
            recognition_accuracy: 87.3
        }
    ];

    // Dummy recent activities
    const recentActivities = [
        {
            id: 1,
            type: "upload",
            user: "Ahmad Fauzi Rahman",
            action: "Menambahkan 3 foto dataset baru",
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
            type: "update",
            user: "Dr. Budi Santoso",
            action: "Memperbarui foto profil dataset",
            timestamp: "2024-06-17T08:45:00",
            status: "success"
        },
        {
            id: 4,
            type: "delete",
            user: "Admin",
            action: "Menghapus dataset dengan kualitas rendah",
            timestamp: "2024-06-16T17:20:00",
            status: "warning"
        }
    ];

    const handleUserSelect = (userId) => {
        setSelectedUsers(prev => {
            if (prev.includes(userId)) {
                return prev.filter(id => id !== userId);
            }
            return [...prev, userId];
        });
    };

    const handleSelectAll = () => {
        if (selectedUsers.length === usersWithDatasets.length) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(usersWithDatasets.map(user => user.id));
        }
    };

    const handleImageClick = (image, user) => {
        setSelectedImage({ ...image, userName: user.name });
        setShowImageModal(true);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'verified': return 'bg-green-100 text-green-800';
            case 'needs_review': return 'bg-yellow-100 text-yellow-800';
            case 'low_quality': return 'bg-red-100 text-red-800';
            case 'pending': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'verified': return <MdCheckCircle className="w-4 h-4" />;
            case 'needs_review': return <MdWarning className="w-4 h-4" />;
            case 'low_quality': return <MdError className="w-4 h-4" />;
            case 'pending': return <MdAccessTime className="w-4 h-4" />;
            default: return <MdInfo className="w-4 h-4" />;
        }
    };

    const filteredUsers = usersWithDatasets.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.nim && user.nim.includes(searchTerm)) ||
            (user.nip && user.nip.includes(searchTerm));
        const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
        const matchesDepartment = filterDepartment === 'all' || user.department === filterDepartment;

        return matchesSearch && matchesStatus && matchesDepartment;
    });

    const tabs = [
        { id: 'overview', label: 'Overview', icon: MdAnalytics },
        { id: 'datasets', label: 'Kelola Dataset', icon: MdCollections },
        { id: 'activities', label: 'Aktivitas', icon: MdHistory }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 p-4 md:p-8">
            {/* Header */}
            <div className="mb-8" data-aos="fade-down">
                <div className="flex items-center gap-4 mb-6">
                    <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-3 rounded-xl text-white">
                        <MdDataset className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                            Kelola Dataset Wajah
                        </h1>
                        <p className="text-gray-600 text-lg">Lihat, kelola, dan analisis dataset wajah pengguna</p>
                    </div>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {datasetStats.map((stat, index) => (
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
                                <span className={`text-sm font-medium flex items-center gap-1 ${stat.change.includes('+') ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    <MdTrendingUp className="w-4 h-4" />
                                    {stat.change}
                                </span>
                                <p className="text-xs text-gray-500">{stat.changeLabel}</p>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</h3>
                            <p className="text-gray-600 text-sm font-medium mb-1">{stat.title}</p>
                            <p className="text-gray-500 text-xs">{stat.description}</p>
                        </div>
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
                                ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50'
                                : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
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
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">Dashboard Dataset</h2>
                                <p className="text-gray-600">Ringkasan kondisi dan performa dataset wajah</p>
                            </div>

                            {/* Quick Actions */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="bg-blue-600 p-3 rounded-xl text-white">
                                            <MdCloudSync className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800">Sync Dataset</h3>
                                            <p className="text-gray-600 text-sm">Sinkronisasi dengan model AI</p>
                                        </div>
                                    </div>
                                    <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300">
                                        Mulai Sinkronisasi
                                    </button>
                                </div>

                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="bg-green-600 p-3 rounded-xl text-white">
                                            <MdAutoAwesome className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800">Auto Optimize</h3>
                                            <p className="text-gray-600 text-sm">Optimisasi kualitas otomatis</p>
                                        </div>
                                    </div>
                                    <button className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300">
                                        Optimisasi Dataset
                                    </button>
                                </div>

                                <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-200">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="bg-purple-600 p-3 rounded-xl text-white">
                                            <MdAnalytics className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800">Generate Report</h3>
                                            <p className="text-gray-600 text-sm">Laporan analisis dataset</p>
                                        </div>
                                    </div>
                                    <button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-300">
                                        Buat Laporan
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
                                                {activity.type === 'update' && <MdUpdate className="w-5 h-5" />}
                                                {activity.type === 'delete' && <MdDelete className="w-5 h-5" />}
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

                    {/* Datasets Management Tab */}
                    {activeTab === 'datasets' && (
                        <div className="space-y-6" data-aos="fade-right">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Kelola Dataset Pengguna</h2>
                                    <p className="text-gray-600">Lihat dan kelola dataset wajah setiap pengguna</p>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleSelectAll}
                                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center gap-2"
                                    >
                                        <MdSelectAll className="w-4 h-4" />
                                        {selectedUsers.length === usersWithDatasets.length ? 'Deselect All' : 'Select All'}
                                    </button>
                                    {selectedUsers.length > 0 && (
                                        <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center gap-2">
                                            <MdDeleteSweep className="w-4 h-4" />
                                            Delete Selected ({selectedUsers.length})
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Filters and Search */}
                            <div className="flex flex-wrap gap-4">
                                <div className="relative flex-1 min-w-64">
                                    <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="Cari nama, NIM, atau NIP..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    />
                                </div>
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                >
                                    <option value="all">Semua Status</option>
                                    <option value="verified">Terverifikasi</option>
                                    <option value="needs_review">Perlu Review</option>
                                    <option value="low_quality">Kualitas Rendah</option>
                                </select>
                                <select
                                    value={filterDepartment}
                                    onChange={(e) => setFilterDepartment(e.target.value)}
                                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                >
                                    <option value="all">Semua Jurusan</option>
                                    <option value="Teknik Informatika">Teknik Informatika</option>
                                    <option value="Sistem Informasi">Sistem Informasi</option>
                                    <option value="Manajemen Informatika">Manajemen Informatika</option>
                                </select>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-3 rounded-lg transition-colors duration-200 ${viewMode === 'grid' ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                            }`}
                                    >
                                        <MdGridView className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-3 rounded-lg transition-colors duration-200 ${viewMode === 'list' ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                            }`}
                                    >
                                        <MdViewList className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Users Dataset Grid/List */}
                            {viewMode === 'grid' ? (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {filteredUsers.map((user) => (
                                        <div key={user.id} className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-all duration-300 hover:shadow-lg">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedUsers.includes(user.id)}
                                                        onChange={() => handleUserSelect(user.id)}
                                                        className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500"
                                                    />
                                                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                                                        {user.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-gray-800">{user.name}</h3>
                                                        <p className="text-sm text-gray-600">{user.nim || user.nip}</p>
                                                        <p className="text-xs text-gray-500">{user.department}</p>
                                                    </div>
                                                </div>
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                                                    {getStatusIcon(user.status)}
                                                    {user.status.replace('_', ' ')}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-5 gap-2 mb-4">
                                                {user.images.slice(0, 5).map((image) => (
                                                    <div
                                                        key={image.id}
                                                        className="aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-emerald-500 transition-all duration-200"
                                                        onClick={() => handleImageClick(image, user)}
                                                    >
                                                        <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                                                            <MdFace className="w-6 h-6 text-gray-600" />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                                                <div className="text-center">
                                                    <p className="font-semibold text-gray-800">{user.totalImages}</p>
                                                    <p className="text-gray-600">Foto</p>
                                                </div>
                                                <div className="text-center">
                                                    <p className="font-semibold text-gray-800">{user.avgQuality}%</p>
                                                    <p className="text-gray-600">Kualitas</p>
                                                </div>
                                                <div className="text-center">
                                                    <p className="font-semibold text-gray-800">{user.recognition_accuracy}%</p>
                                                    <p className="text-gray-600">Akurasi</p>
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                <button className="flex-1 bg-emerald-600 text-white py-2 px-3 rounded-lg hover:bg-emerald-700 transition-colors duration-200 text-sm flex items-center justify-center gap-1">
                                                    <MdVisibility className="w-4 h-4" />
                                                    Lihat
                                                </button>
                                                <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm flex items-center justify-center gap-1">
                                                    <MdEdit className="w-4 h-4" />
                                                    Edit
                                                </button>
                                                <button className="bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm">
                                                    <MdDelete className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {filteredUsers.map((user) => (
                                        <div key={user.id} className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors duration-200">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedUsers.includes(user.id)}
                                                        onChange={() => handleUserSelect(user.id)}
                                                        className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500"
                                                    />
                                                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                                                        {user.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-gray-800">{user.name}</h3>
                                                        <p className="text-sm text-gray-600">{user.nim || user.nip} • {user.department}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    <div className="text-center">
                                                        <p className="font-semibold text-gray-800">{user.totalImages}</p>
                                                        <p className="text-xs text-gray-600">Foto</p>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="font-semibold text-gray-800">{user.avgQuality}%</p>
                                                        <p className="text-xs text-gray-600">Kualitas</p>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="font-semibold text-gray-800">{user.recognition_accuracy}%</p>
                                                        <p className="text-xs text-gray-600">Akurasi</p>
                                                    </div>
                                                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                                                        {getStatusIcon(user.status)}
                                                        {user.status.replace('_', ' ')}
                                                    </span>
                                                    <div className="flex gap-2">
                                                        <button className="bg-emerald-600 text-white py-2 px-3 rounded-lg hover:bg-emerald-700 transition-colors duration-200 text-sm">
                                                            <MdVisibility className="w-4 h-4" />
                                                        </button>
                                                        <button className="bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm">
                                                            <MdEdit className="w-4 h-4" />
                                                        </button>
                                                        <button className="bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm">
                                                            <MdDelete className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Activities Tab */}
                    {activeTab === 'activities' && (
                        <div className="space-y-6" data-aos="fade-right">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">Log Aktivitas Dataset</h2>
                                <p className="text-gray-600">Riwayat semua aktivitas pada dataset wajah</p>
                            </div>

                            <div className="space-y-4">
                                {recentActivities.concat([
                                    {
                                        id: 5,
                                        type: "upload",
                                        user: "Dewi Kartika",
                                        action: "Mengunggah 5 foto dataset baru",
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
                                    },
                                    {
                                        id: 7,
                                        type: "delete",
                                        user: "Admin",
                                        action: "Menghapus dataset berkualitas rendah",
                                        timestamp: "2024-06-16T13:45:00",
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
                                                {activity.type === 'update' && <MdUpdate className="w-6 h-6" />}
                                                {activity.type === 'delete' && <MdDelete className="w-6 h-6" />}
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

            {/* Image Modal */}
            {showImageModal && selectedImage && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={() => setShowImageModal(false)}>
                    <div className="bg-white rounded-2xl p-6 max-w-lg w-full" onClick={(e) => e.stopPropagation()} data-aos="zoom-in">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">{selectedImage.userName}</h3>
                            <button
                                onClick={() => setShowImageModal(false)}
                                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                            >
                                <MdClose className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="bg-gray-200 rounded-lg aspect-square mb-4 flex items-center justify-center">
                            <MdFace className="w-16 h-16 text-gray-600" />
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Kualitas:</span>
                                <span className="font-medium">{selectedImage.quality}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Upload:</span>
                                <span className="font-medium">{new Date(selectedImage.timestamp).toLocaleDateString('id-ID')}</span>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-6">
                            <button className="flex-1 bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-200">
                                Download
                            </button>
                            <button className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors duration-200">
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageDataset;
