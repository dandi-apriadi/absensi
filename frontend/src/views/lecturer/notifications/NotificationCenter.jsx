import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Card from "components/card";
import {
    MdNotifications,
    MdAccessTime,
    MdCheckCircle,
    MdDelete,
    MdFilterList,
    MdReadMore,
    MdPeople,
    MdWarning,
    MdApproval,
    MdUpdate,
    MdSettings
} from "react-icons/md";

// Dummy Data
const notifications = [
    {
        id: 1,
        title: "Permintaan Izin Baru",
        message: "Budi Santoso (20210001) mengajukan izin sakit untuk mata kuliah Algoritma dan Pemrograman pada 15 Oktober 2023",
        type: "leave_request",
        isRead: false,
        createdAt: "2023-10-14T15:30:22Z",
        action: "/lecturer/leave-requests/pending-requests"
    },
    {
        id: 2,
        title: "Tingkat Kehadiran Rendah",
        message: "3 mahasiswa memiliki tingkat kehadiran di bawah 75% di mata kuliah Pemrograman Web",
        type: "attendance_alert",
        isRead: false,
        createdAt: "2023-10-14T09:20:10Z",
        action: "/lecturer/students/attendance-stats"
    },
    {
        id: 3,
        title: "Permintaan Izin Disetujui",
        message: "Anda menyetujui permintaan izin Diana Putri (20210004) untuk mata kuliah Algoritma dan Pemrograman",
        type: "leave_approved",
        isRead: true,
        createdAt: "2023-10-13T13:45:30Z",
        action: "/lecturer/leave-requests/request-history"
    },
    {
        id: 4,
        title: "Sesi Kelas Akan Datang",
        message: "Anda memiliki kelas Basis Data - Normalisasi Database dalam 2 jam di Lab 302",
        type: "upcoming_session",
        isRead: true,
        createdAt: "2023-10-13T08:00:00Z",
        action: "/lecturer/sessions"
    },
    {
        id: 5,
        title: "Permintaan Izin Baru",
        message: "Siti Nuraini (20210002) mengajukan izin untuk mata kuliah Basis Data pada 16 Oktober 2023",
        type: "leave_request",
        isRead: true,
        createdAt: "2023-10-12T11:10:40Z",
        action: "/lecturer/leave-requests/pending-requests"
    },
    {
        id: 6,
        title: "Pengaturan Sistem Diperbarui",
        message: "Administrator telah memperbarui pengaturan sistem. Harap periksa panduan terbaru",
        type: "system",
        isRead: false,
        createdAt: "2023-10-11T16:20:15Z",
        action: "/lecturer/help/user-guide"
    },
    {
        id: 7,
        title: "Rekap Absensi Mingguan",
        message: "Rekap absensi mingguan untuk semua mata kuliah Anda telah tersedia",
        type: "report",
        isRead: true,
        createdAt: "2023-10-10T09:30:00Z",
        action: "/lecturer/attendance/attendance-history"
    }
];

const NotificationCenter = () => {
    const [notificationsList, setNotificationsList] = useState([]);
    const [filter, setFilter] = useState("all");
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: "ease-in-out",
            once: true,
        });

        // Initialize notifications
        setNotificationsList(notifications);

        // Count unread notifications
        setUnreadCount(notifications.filter(notif => !notif.isRead).length);
    }, []);

    const markAsRead = (id) => {
        const updatedNotifications = notificationsList.map(notif =>
            notif.id === id ? { ...notif, isRead: true } : notif
        );
        setNotificationsList(updatedNotifications);
        setUnreadCount(updatedNotifications.filter(notif => !notif.isRead).length);
    };

    const deleteNotification = (id) => {
        const updatedNotifications = notificationsList.filter(notif => notif.id !== id);
        setNotificationsList(updatedNotifications);
        setUnreadCount(updatedNotifications.filter(notif => !notif.isRead).length);
    };

    const markAllAsRead = () => {
        const updatedNotifications = notificationsList.map(notif => ({ ...notif, isRead: true }));
        setNotificationsList(updatedNotifications);
        setUnreadCount(0);
    };

    const getTimeAgo = (timestamp) => {
        const now = new Date();
        const notifDate = new Date(timestamp);
        const diffInSeconds = Math.floor((now - notifDate) / 1000);

        if (diffInSeconds < 60) {
            return `${diffInSeconds} detik yang lalu`;
        }

        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) {
            return `${diffInMinutes} menit yang lalu`;
        }

        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) {
            return `${diffInHours} jam yang lalu`;
        }

        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 30) {
            return `${diffInDays} hari yang lalu`;
        }

        const diffInMonths = Math.floor(diffInDays / 30);
        if (diffInMonths < 12) {
            return `${diffInMonths} bulan yang lalu`;
        }

        const diffInYears = Math.floor(diffInMonths / 12);
        return `${diffInYears} tahun yang lalu`;
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'leave_request':
                return <MdApproval className="h-8 w-8 text-indigo-500" />;
            case 'attendance_alert':
                return <MdWarning className="h-8 w-8 text-red-500" />;
            case 'leave_approved':
                return <MdCheckCircle className="h-8 w-8 text-green-500" />;
            case 'upcoming_session':
                return <MdAccessTime className="h-8 w-8 text-blue-500" />;
            case 'system':
                return <MdSettings className="h-8 w-8 text-gray-500" />;
            case 'report':
                return <MdUpdate className="h-8 w-8 text-purple-500" />;
            default:
                return <MdNotifications className="h-8 w-8 text-gray-500" />;
        }
    };

    const filteredNotifications = notificationsList.filter(notif => {
        if (filter === "unread") return !notif.isRead;
        if (filter === "leave_request") return notif.type === "leave_request";
        if (filter === "alerts") return notif.type === "attendance_alert";
        if (filter === "system") return notif.type === "system" || notif.type === "report";
        return true;
    });

    return (
        <div className="mt-3">
            <div className="mb-5" data-aos="fade-down">
                <h1 className="text-3xl font-bold text-navy-700 dark:text-white">
                    Pusat Notifikasi
                </h1>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Kelola semua notifikasi dan pemberitahuan
                </p>
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-5 mb-5">
                <div className="lg:col-span-1">
                    <Card extra="p-4" data-aos="fade-right">
                        <div className="mb-4">
                            <h4 className="text-lg font-bold text-navy-700 dark:text-white flex items-center">
                                <MdFilterList className="mr-2 h-5 w-5" /> Filter
                            </h4>
                        </div>

                        <div className="space-y-2">
                            <button
                                onClick={() => setFilter("all")}
                                className={`w-full py-2 px-4 rounded-lg text-left text-sm flex items-center ${filter === "all"
                                        ? "bg-indigo-100 text-indigo-800"
                                        : "hover:bg-gray-100 text-gray-700"
                                    }`}
                            >
                                <MdNotifications className="mr-3" />
                                Semua Notifikasi
                                <span className="ml-auto bg-gray-200 text-gray-800 px-2 py-0.5 rounded-full text-xs">
                                    {notificationsList.length}
                                </span>
                            </button>

                            <button
                                onClick={() => setFilter("unread")}
                                className={`w-full py-2 px-4 rounded-lg text-left text-sm flex items-center ${filter === "unread"
                                        ? "bg-indigo-100 text-indigo-800"
                                        : "hover:bg-gray-100 text-gray-700"
                                    }`}
                            >
                                <MdReadMore className="mr-3" />
                                Belum Dibaca
                                <span className="ml-auto bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs">
                                    {unreadCount}
                                </span>
                            </button>

                            <button
                                onClick={() => setFilter("leave_request")}
                                className={`w-full py-2 px-4 rounded-lg text-left text-sm flex items-center ${filter === "leave_request"
                                        ? "bg-indigo-100 text-indigo-800"
                                        : "hover:bg-gray-100 text-gray-700"
                                    }`}
                            >
                                <MdApproval className="mr-3" />
                                Permintaan Izin
                            </button>

                            <button
                                onClick={() => setFilter("alerts")}
                                className={`w-full py-2 px-4 rounded-lg text-left text-sm flex items-center ${filter === "alerts"
                                        ? "bg-indigo-100 text-indigo-800"
                                        : "hover:bg-gray-100 text-gray-700"
                                    }`}
                            >
                                <MdWarning className="mr-3" />
                                Peringatan
                            </button>

                            <button
                                onClick={() => setFilter("system")}
                                className={`w-full py-2 px-4 rounded-lg text-left text-sm flex items-center ${filter === "system"
                                        ? "bg-indigo-100 text-indigo-800"
                                        : "hover:bg-gray-100 text-gray-700"
                                    }`}
                            >
                                <MdSettings className="mr-3" />
                                Sistem & Laporan
                            </button>
                        </div>

                        <div className="mt-6">
                            <button
                                onClick={markAllAsRead}
                                disabled={unreadCount === 0}
                                className={`w-full py-2 px-4 rounded-lg text-center text-sm ${unreadCount > 0
                                        ? "bg-indigo-600 text-white hover:bg-indigo-700"
                                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                                    }`}
                            >
                                <MdCheckCircle className="inline-block mr-2" />
                                Tandai Semua Dibaca
                            </button>
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-4">
                    <Card extra="p-4" data-aos="fade-left">
                        <div className="mb-4 flex justify-between items-center">
                            <h4 className="text-lg font-bold text-navy-700 dark:text-white">
                                {filter === "all" && "Semua Notifikasi"}
                                {filter === "unread" && "Notifikasi Belum Dibaca"}
                                {filter === "leave_request" && "Permintaan Izin"}
                                {filter === "alerts" && "Peringatan"}
                                {filter === "system" && "Sistem & Laporan"}
                            </h4>
                            <div className="text-sm text-gray-500">
                                <span className="mr-1">{filteredNotifications.length}</span>
                                {filter === "all" ? "notifikasi" : "hasil"}
                            </div>
                        </div>

                        {filteredNotifications.length > 0 ? (
                            <div className="space-y-3">
                                {filteredNotifications.map((notif, index) => (
                                    <div
                                        key={notif.id}
                                        className={`p-4 rounded-xl border flex items-start transition duration-150 ${notif.isRead
                                                ? "bg-white border-gray-200"
                                                : "bg-indigo-50 border-indigo-200"
                                            }`}
                                        data-aos="fade-up"
                                        data-aos-delay={index * 50}
                                    >
                                        <div className="rounded-full bg-gray-100 p-2 flex-shrink-0">
                                            {getNotificationIcon(notif.type)}
                                        </div>

                                        <div className="ml-4 flex-grow">
                                            <div className="flex items-start justify-between">
                                                <h5 className={`font-medium ${notif.isRead ? "text-gray-900" : "text-indigo-800"}`}>
                                                    {notif.title}
                                                </h5>
                                                <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                                                    {getTimeAgo(notif.createdAt)}
                                                </span>
                                            </div>

                                            <p className="text-sm text-gray-600 mt-1">
                                                {notif.message}
                                            </p>

                                            <div className="mt-2 flex items-center justify-between">
                                                <a
                                                    href={notif.action}
                                                    className="text-sm text-indigo-600 hover:text-indigo-800"
                                                >
                                                    Lihat Detail
                                                </a>

                                                <div className="flex items-center space-x-2">
                                                    {!notif.isRead && (
                                                        <button
                                                            onClick={() => markAsRead(notif.id)}
                                                            className="p-1 text-gray-500 hover:text-indigo-600"
                                                            title="Tandai sudah dibaca"
                                                        >
                                                            <MdCheckCircle className="h-5 w-5" />
                                                        </button>
                                                    )}

                                                    <button
                                                        onClick={() => deleteNotification(notif.id)}
                                                        className="p-1 text-gray-500 hover:text-red-600"
                                                        title="Hapus notifikasi"
                                                    >
                                                        <MdDelete className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                                <MdNotifications className="h-12 w-12 text-gray-300 mb-3" />
                                <h3 className="text-lg font-medium mb-1">Tidak ada notifikasi</h3>
                                <p className="text-sm text-center">
                                    {filter !== "all" ? "Tidak ada notifikasi yang cocok dengan filter yang dipilih" : "Anda tidak memiliki notifikasi saat ini"}
                                </p>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default NotificationCenter;
