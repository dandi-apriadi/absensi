import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import {
    MdNotifications,
    MdMarkAsUnread,
    MdDelete,
    MdSettings,
    MdCheckCircle,
    MdWarning,
    MdInfo,
    MdError
} from "react-icons/md";

const NotificationCenter = () => {
    const [notifications, setNotifications] = useState([]);
    const [filter, setFilter] = useState('all');
    const [selectedNotifications, setSelectedNotifications] = useState([]);

    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
        });

        // Load dummy notifications
        const dummyNotifications = [
            {
                id: 1,
                type: 'success',
                title: 'Absensi Berhasil',
                message: 'Absensi untuk mata kuliah Pemrograman Web berhasil dicatat pada 08:15',
                timestamp: '2024-01-25 08:15:30',
                isRead: false,
                category: 'attendance'
            },
            {
                id: 2,
                type: 'info',
                title: 'Pengingat Kelas',
                message: 'Kelas Database Management dimulai dalam 30 menit di Ruang R201',
                timestamp: '2024-01-25 09:30:00',
                isRead: false,
                category: 'reminder'
            },
            {
                id: 3,
                type: 'warning',
                title: 'Persentase Kehadiran Rendah',
                message: 'Persentase kehadiran Anda untuk mata kuliah Mobile Development adalah 75%. Tingkatkan kehadiran Anda.',
                timestamp: '2024-01-24 14:00:00',
                isRead: true,
                category: 'attendance'
            },
            {
                id: 4,
                type: 'success',
                title: 'Pengajuan Izin Disetujui',
                message: 'Pengajuan izin sakit tanggal 20-21 Januari 2024 telah disetujui oleh Dr. Ahmad Fauzi',
                timestamp: '2024-01-19 10:20:00',
                isRead: true,
                category: 'leave'
            },
            {
                id: 5,
                type: 'error',
                title: 'Face Recognition Gagal',
                message: 'Pengenalan wajah gagal untuk absensi mata kuliah Software Engineering. Gunakan QR Code atau hubungi dosen.',
                timestamp: '2024-01-23 08:45:00',
                isRead: false,
                category: 'system'
            },
            {
                id: 6,
                type: 'info',
                title: 'Dataset Wajah Perlu Update',
                message: 'Dataset wajah Anda terakhir diupdate 3 bulan lalu. Pertimbangkan untuk memperbarui dataset untuk akurasi yang lebih baik.',
                timestamp: '2024-01-22 16:00:00',
                isRead: true,
                category: 'system'
            },
            {
                id: 7,
                type: 'info',
                title: 'Laporan Kehadiran Tersedia',
                message: 'Laporan kehadiran bulan Januari 2024 sudah dapat didownload di menu Kehadiran Saya.',
                timestamp: '2024-01-21 09:00:00',
                isRead: true,
                category: 'report'
            }
        ];

        setNotifications(dummyNotifications);
    }, []);

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'success': return MdCheckCircle;
            case 'warning': return MdWarning;
            case 'error': return MdError;
            default: return MdInfo;
        }
    };

    const getNotificationColor = (type) => {
        switch (type) {
            case 'success': return 'text-green-600 bg-green-100';
            case 'warning': return 'text-yellow-600 bg-yellow-100';
            case 'error': return 'text-red-600 bg-red-100';
            default: return 'text-blue-600 bg-blue-100';
        }
    };

    const getCategoryText = (category) => {
        switch (category) {
            case 'attendance': return 'Kehadiran';
            case 'reminder': return 'Pengingat';
            case 'leave': return 'Izin/Sakit';
            case 'system': return 'Sistem';
            case 'report': return 'Laporan';
            default: return 'Umum';
        }
    };

    const filteredNotifications = notifications.filter(notification => {
        if (filter === 'all') return true;
        if (filter === 'unread') return !notification.isRead;
        if (filter === 'read') return notification.isRead;
        return notification.category === filter;
    });

    const markAsRead = (id) => {
        setNotifications(prev =>
            prev.map(notification =>
                notification.id === id
                    ? { ...notification, isRead: true }
                    : notification
            )
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev =>
            prev.map(notification => ({ ...notification, isRead: true }))
        );
    };

    const deleteNotification = (id) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
    };

    const toggleNotificationSelection = (id) => {
        setSelectedNotifications(prev =>
            prev.includes(id)
                ? prev.filter(notifId => notifId !== id)
                : [...prev, id]
        );
    };

    const deleteSelectedNotifications = () => {
        setNotifications(prev =>
            prev.filter(notification => !selectedNotifications.includes(notification.id))
        );
        setSelectedNotifications([]);
    };

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

        if (diffInHours < 1) return 'Baru saja';
        if (diffInHours < 24) return `${diffInHours} jam lalu`;
        if (diffInHours < 48) return 'Kemarin';
        return date.toLocaleDateString('id-ID');
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    // Filter options data
    const filterOptions = [
        { id: 'all', label: 'Semua', count: notifications.length },
        { id: 'unread', label: 'Belum Dibaca', count: unreadCount },
        { id: 'read', label: 'Sudah Dibaca', count: notifications.length - unreadCount },
        { id: 'attendance', label: 'Kehadiran', count: notifications.filter(n => n.category === 'attendance').length },
        { id: 'reminder', label: 'Pengingat', count: notifications.filter(n => n.category === 'reminder').length },
        { id: 'leave', label: 'Izin/Sakit', count: notifications.filter(n => n.category === 'leave').length },
        { id: 'system', label: 'Sistem', count: notifications.filter(n => n.category === 'system').length }
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            {/* Header */}
            <div className="mb-8" data-aos="fade-down">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            Pusat Notifikasi
                        </h1>
                        <p className="text-gray-600">
                            {unreadCount > 0
                                ? `Anda memiliki ${unreadCount} notifikasi yang belum dibaca`
                                : 'Semua notifikasi sudah dibaca'
                            }
                        </p>
                    </div>
                    <div className="flex space-x-3">
                        <button
                            onClick={markAllAsRead}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                        >
                            <MdCheckCircle className="h-5 w-5 mr-2" />
                            Tandai Semua Dibaca
                        </button>
                        <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center">
                            <MdSettings className="h-5 w-5 mr-2" />
                            Pengaturan
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats and Filters */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                {/* Stats */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-lg p-6" data-aos="fade-up">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Ringkasan</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total</span>
                                <span className="font-bold text-gray-800">{notifications.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Belum Dibaca</span>
                                <span className="font-bold text-red-600">{unreadCount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Sudah Dibaca</span>
                                <span className="font-bold text-green-600">{notifications.length - unreadCount}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-xl shadow-lg p-6" data-aos="fade-up" data-aos-delay="100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">Filter Notifikasi</h3>
                            {selectedNotifications.length > 0 && (
                                <button
                                    onClick={deleteSelectedNotifications}
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                                >
                                    <MdDelete className="h-5 w-5 mr-2" />
                                    Hapus Terpilih ({selectedNotifications.length})
                                </button>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {filterOptions.map((filterOption) => (
                                <button
                                    key={filterOption.id}
                                    onClick={() => setFilter(filterOption.id)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${filter === filterOption.id
                                        ? 'bg-blue-500 text-white shadow-lg'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {filterOption.label} ({filterOption.count})
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Notifications List */}
            <div className="bg-white rounded-xl shadow-lg" data-aos="fade-up" data-aos-delay="300">
                <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-6">
                        {filter === 'all' ? 'Semua Notifikasi' :
                            filter === 'unread' ? 'Notifikasi Belum Dibaca' :
                                filter === 'read' ? 'Notifikasi Sudah Dibaca' :
                                    filteredNotifications.length > 0 ? `Notifikasi ${getCategoryText(filter)}` : 'Notifikasi'}
                    </h3>

                    <div className="space-y-4">
                        {filteredNotifications.map((notification) => {
                            const IconComponent = getNotificationIcon(notification.type);
                            return (
                                <div
                                    key={notification.id}
                                    className={`p-4 rounded-lg border-l-4 transition-all duration-200 hover:shadow-md ${notification.isRead ? 'bg-gray-50 border-gray-300' : 'bg-white border-blue-500 shadow-sm'
                                        }`}
                                >
                                    <div className="flex items-start">
                                        <input
                                            type="checkbox"
                                            checked={selectedNotifications.includes(notification.id)}
                                            onChange={() => toggleNotificationSelection(notification.id)}
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-4 mt-1"
                                        />

                                        <div className={`p-2 rounded-full mr-4 ${getNotificationColor(notification.type)}`}>
                                            <IconComponent className="h-5 w-5" />
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <div className="flex items-center mb-1">
                                                        <h4 className={`font-semibold ${notification.isRead ? 'text-gray-700' : 'text-gray-900'}`}>
                                                            {notification.title}
                                                        </h4>
                                                        {!notification.isRead && (
                                                            <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full"></span>
                                                        )}
                                                    </div>
                                                    <p className={`text-sm mb-2 ${notification.isRead ? 'text-gray-600' : 'text-gray-700'}`}>
                                                        {notification.message}
                                                    </p>
                                                    <div className="flex items-center text-xs text-gray-500">
                                                        <span className={`px-2 py-1 rounded-full mr-3 ${notification.category === 'attendance' ? 'bg-green-100 text-green-700' :
                                                            notification.category === 'reminder' ? 'bg-blue-100 text-blue-700' :
                                                                notification.category === 'leave' ? 'bg-yellow-100 text-yellow-700' :
                                                                    notification.category === 'system' ? 'bg-purple-100 text-purple-700' :
                                                                        'bg-gray-100 text-gray-700'
                                                            }`}>
                                                            {getCategoryText(notification.category)}
                                                        </span>
                                                        <span>{formatTimestamp(notification.timestamp)}</span>
                                                    </div>
                                                </div>

                                                <div className="flex space-x-2">
                                                    {!notification.isRead && (
                                                        <button
                                                            onClick={() => markAsRead(notification.id)}
                                                            className="text-blue-600 hover:text-blue-800 transition-colors"
                                                            title="Tandai sudah dibaca"
                                                        >
                                                            <MdMarkAsUnread className="h-5 w-5" />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => deleteNotification(notification.id)}
                                                        className="text-red-600 hover:text-red-800 transition-colors"
                                                        title="Hapus notifikasi"
                                                    >
                                                        <MdDelete className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {filteredNotifications.length === 0 && (
                        <div className="text-center py-12">
                            <MdNotifications className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-500 mb-2">
                                Tidak ada notifikasi
                            </h3>
                            <p className="text-gray-400">
                                {filter === 'unread'
                                    ? 'Semua notifikasi sudah dibaca'
                                    : filter === 'all'
                                        ? 'Belum ada notifikasi untuk ditampilkan'
                                        : `Tidak ada notifikasi kategori ${getCategoryText(filter)}`
                                }
                            </p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {filteredNotifications.length > 0 && (
                    <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                            Menampilkan {filteredNotifications.length} dari {notifications.length} notifikasi
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
                )}
            </div>
        </div>
    );
};

export default NotificationCenter;