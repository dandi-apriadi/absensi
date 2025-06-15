import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Card from "components/card";
import {
    MdPerson,
    MdNotifications,
    MdLock,
    MdEmail,
    MdPhone,
    MdSave,
    MdInfo,
    MdCheckCircle,
    MdSettings,
    MdDevices
} from "react-icons/md";

// Dummy lecturer data
const lecturerData = {
    id: 1,
    name: "Dr. Ahmad Saputra, S.Kom., M.Cs.",
    email: "ahmad.saputra@university.ac.id",
    phone: "081234567890",
    department: "Teknik Informatika",
    faculty: "Fakultas Ilmu Komputer",
    position: "Dosen Tetap",
    address: "Jl. Merdeka No. 123, Kota Baru",
    profilePicture: null
};

const ProfileSettings = () => {
    const [activeTab, setActiveTab] = useState("profile");
    const [profileData, setProfileData] = useState({ ...lecturerData });
    const [password, setPassword] = useState({
        current: "",
        new: "",
        confirm: ""
    });
    const [notificationSettings, setNotificationSettings] = useState({
        email: true,
        push: true,
        sms: false,
        attendanceAlert: true,
        leaveRequests: true,
        systemUpdates: true,
        lowAttendance: true,
        weeklyReport: true
    });
    const [showSuccess, setShowSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: "ease-in-out",
            once: true,
        });
    }, []);

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        }, 1000);
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setShowSuccess(true);
            setPassword({
                current: "",
                new: "",
                confirm: ""
            });
            setTimeout(() => setShowSuccess(false), 3000);
        }, 1000);
    };

    const handleNotificationSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        }, 1000);
    };

    return (
        <div className="mt-3">
            <div className="mb-5" data-aos="fade-down">
                <h1 className="text-3xl font-bold text-navy-700 dark:text-white">
                    Pengaturan
                </h1>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Kelola informasi akun dan preferensi Anda
                </p>
            </div>

            {showSuccess && (
                <div className="mb-5 p-4 bg-green-100 border border-green-200 rounded-lg flex items-start" data-aos="fade-down">
                    <MdCheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-2" />
                    <div>
                        <p className="text-green-800">Perubahan berhasil disimpan!</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                <div className="md:col-span-1">
                    <Card extra="p-0" data-aos="fade-right">
                        <div className="p-4 border-b border-gray-200">
                            <h4 className="text-base font-medium text-navy-700 dark:text-white">
                                Menu Pengaturan
                            </h4>
                        </div>
                        <div className="flex flex-col">
                            <button
                                className={`flex items-center py-3 px-4 ${activeTab === "profile"
                                        ? "bg-indigo-50 text-indigo-700 border-l-4 border-indigo-700"
                                        : "hover:bg-gray-50 text-gray-700"
                                    }`}
                                onClick={() => setActiveTab("profile")}
                            >
                                <MdPerson className="mr-2 h-5 w-5" />
                                Informasi Profil
                            </button>
                            <button
                                className={`flex items-center py-3 px-4 ${activeTab === "password"
                                        ? "bg-indigo-50 text-indigo-700 border-l-4 border-indigo-700"
                                        : "hover:bg-gray-50 text-gray-700"
                                    }`}
                                onClick={() => setActiveTab("password")}
                            >
                                <MdLock className="mr-2 h-5 w-5" />
                                Keamanan & Password
                            </button>
                            <button
                                className={`flex items-center py-3 px-4 ${activeTab === "notifications"
                                        ? "bg-indigo-50 text-indigo-700 border-l-4 border-indigo-700"
                                        : "hover:bg-gray-50 text-gray-700"
                                    }`}
                                onClick={() => setActiveTab("notifications")}
                            >
                                <MdNotifications className="mr-2 h-5 w-5" />
                                Notifikasi
                            </button>
                            <button
                                className={`flex items-center py-3 px-4 ${activeTab === "devices"
                                        ? "bg-indigo-50 text-indigo-700 border-l-4 border-indigo-700"
                                        : "hover:bg-gray-50 text-gray-700"
                                    }`}
                                onClick={() => setActiveTab("devices")}
                            >
                                <MdDevices className="mr-2 h-5 w-5" />
                                Perangkat Terhubung
                            </button>
                        </div>
                    </Card>
                </div>

                <div className="md:col-span-3">
                    {activeTab === "profile" && (
                        <Card extra="p-5" data-aos="fade-left">
                            <div className="mb-4">
                                <h4 className="text-lg font-bold text-navy-700 dark:text-white">
                                    Informasi Profil
                                </h4>
                                <p className="text-sm text-gray-600">
                                    Perbarui informasi profil Anda
                                </p>
                            </div>

                            <form onSubmit={handleProfileSubmit}>
                                <div className="mb-6">
                                    <div className="flex flex-col items-center mb-6">
                                        <div className="h-24 w-24 rounded-full bg-indigo-100 flex items-center justify-center mb-2">
                                            <MdPerson className="h-12 w-12 text-indigo-600" />
                                        </div>
                                        <button type="button" className="text-sm text-indigo-600 hover:text-indigo-800">
                                            Ganti Foto Profil
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Nama Lengkap
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full rounded-lg border border-gray-300 p-3 text-sm outline-none focus:border-indigo-500"
                                                value={profileData.name}
                                                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                className="w-full rounded-lg border border-gray-300 p-3 text-sm outline-none focus:border-indigo-500"
                                                value={profileData.email}
                                                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Nomor Telepon
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full rounded-lg border border-gray-300 p-3 text-sm outline-none focus:border-indigo-500"
                                                value={profileData.phone}
                                                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Fakultas
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full rounded-lg border border-gray-300 p-3 text-sm outline-none focus:border-indigo-500"
                                                value={profileData.faculty}
                                                onChange={(e) => setProfileData({ ...profileData, faculty: e.target.value })}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Program Studi
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full rounded-lg border border-gray-300 p-3 text-sm outline-none focus:border-indigo-500"
                                                value={profileData.department}
                                                onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Jabatan
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full rounded-lg border border-gray-300 p-3 text-sm outline-none focus:border-indigo-500"
                                                value={profileData.position}
                                                onChange={(e) => setProfileData({ ...profileData, position: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Alamat
                                        </label>
                                        <textarea
                                            className="w-full rounded-lg border border-gray-300 p-3 text-sm outline-none focus:border-indigo-500"
                                            rows="3"
                                            value={profileData.address}
                                            onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                                        ></textarea>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        className="py-2 px-6 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                                                Menyimpan...
                                            </>
                                        ) : (
                                            <>
                                                <MdSave className="mr-2" /> Simpan Perubahan
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </Card>
                    )}

                    {activeTab === "password" && (
                        <Card extra="p-5" data-aos="fade-left">
                            <div className="mb-4">
                                <h4 className="text-lg font-bold text-navy-700 dark:text-white">
                                    Keamanan & Password
                                </h4>
                                <p className="text-sm text-gray-600">
                                    Ubah password dan atur pengaturan keamanan akun
                                </p>
                            </div>

                            <form onSubmit={handlePasswordSubmit}>
                                <div className="mb-6 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Password Saat Ini
                                        </label>
                                        <input
                                            type="password"
                                            className="w-full rounded-lg border border-gray-300 p-3 text-sm outline-none focus:border-indigo-500"
                                            value={password.current}
                                            onChange={(e) => setPassword({ ...password, current: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Password Baru
                                        </label>
                                        <input
                                            type="password"
                                            className="w-full rounded-lg border border-gray-300 p-3 text-sm outline-none focus:border-indigo-500"
                                            value={password.new}
                                            onChange={(e) => setPassword({ ...password, new: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Konfirmasi Password Baru
                                        </label>
                                        <input
                                            type="password"
                                            className="w-full rounded-lg border border-gray-300 p-3 text-sm outline-none focus:border-indigo-500"
                                            value={password.confirm}
                                            onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="p-4 bg-yellow-50 rounded-lg mb-6">
                                    <div className="flex items-start">
                                        <MdInfo className="text-yellow-600 mt-0.5 mr-2" />
                                        <div>
                                            <p className="text-sm text-yellow-700">Pedoman password yang kuat:</p>
                                            <ul className="text-xs text-yellow-700 list-disc pl-5 mt-1">
                                                <li>Minimal 8 karakter</li>
                                                <li>Kombinasi huruf besar dan kecil</li>
                                                <li>Minimal satu angka</li>
                                                <li>Minimal satu karakter khusus (!, @, #, $, dll)</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        className="py-2 px-6 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                                                Menyimpan...
                                            </>
                                        ) : (
                                            <>
                                                <MdSave className="mr-2" /> Ubah Password
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </Card>
                    )}

                    {activeTab === "notifications" && (
                        <Card extra="p-5" data-aos="fade-left">
                            <div className="mb-4">
                                <h4 className="text-lg font-bold text-navy-700 dark:text-white">
                                    Pengaturan Notifikasi
                                </h4>
                                <p className="text-sm text-gray-600">
                                    Atur preferensi notifikasi Anda
                                </p>
                            </div>

                            <form onSubmit={handleNotificationSubmit}>
                                <div className="mb-6">
                                    <h5 className="text-base font-medium text-gray-700 mb-3">Metode Notifikasi</h5>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <MdEmail className="h-5 w-5 text-gray-400 mr-2" />
                                                <label className="text-sm text-gray-700">Email</label>
                                            </div>
                                            <div className="relative inline-block w-10 mr-2 align-middle select-none">
                                                <input
                                                    type="checkbox"
                                                    id="email-toggle"
                                                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                                                    checked={notificationSettings.email}
                                                    onChange={() => setNotificationSettings({ ...notificationSettings, email: !notificationSettings.email })}
                                                />
                                                <label
                                                    htmlFor="email-toggle"
                                                    className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                                                ></label>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <MdNotifications className="h-5 w-5 text-gray-400 mr-2" />
                                                <label className="text-sm text-gray-700">Push Notification</label>
                                            </div>
                                            <div className="relative inline-block w-10 mr-2 align-middle select-none">
                                                <input
                                                    type="checkbox"
                                                    id="push-toggle"
                                                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                                                    checked={notificationSettings.push}
                                                    onChange={() => setNotificationSettings({ ...notificationSettings, push: !notificationSettings.push })}
                                                />
                                                <label
                                                    htmlFor="push-toggle"
                                                    className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                                                ></label>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <MdPhone className="h-5 w-5 text-gray-400 mr-2" />
                                                <label className="text-sm text-gray-700">SMS</label>
                                            </div>
                                            <div className="relative inline-block w-10 mr-2 align-middle select-none">
                                                <input
                                                    type="checkbox"
                                                    id="sms-toggle"
                                                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                                                    checked={notificationSettings.sms}
                                                    onChange={() => setNotificationSettings({ ...notificationSettings, sms: !notificationSettings.sms })}
                                                />
                                                <label
                                                    htmlFor="sms-toggle"
                                                    className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                                                ></label>
                                            </div>
                                        </div>
                                    </div>

                                    <style jsx>{`
                    .toggle-checkbox:checked {
                      right: 0;
                      border-color: #4F46E5;
                    }
                    .toggle-checkbox:checked + .toggle-label {
                      background-color: #4F46E5;
                    }
                    .toggle-checkbox {
                      right: auto;
                      left: 0;
                    }
                  `}</style>
                                </div>

                                <div className="mb-6">
                                    <h5 className="text-base font-medium text-gray-700 mb-3">Jenis Notifikasi</h5>
                                    <div className="space-y-3">
                                        <div className="flex items-center">
                                            <input
                                                id="attendance-alert"
                                                type="checkbox"
                                                checked={notificationSettings.attendanceAlert}
                                                onChange={() => setNotificationSettings({ ...notificationSettings, attendanceAlert: !notificationSettings.attendanceAlert })}
                                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                            />
                                            <label htmlFor="attendance-alert" className="ml-2 text-sm text-gray-700">
                                                Peringatan absensi (ketika mahasiswa tidak hadir)
                                            </label>
                                        </div>

                                        <div className="flex items-center">
                                            <input
                                                id="leave-requests"
                                                type="checkbox"
                                                checked={notificationSettings.leaveRequests}
                                                onChange={() => setNotificationSettings({ ...notificationSettings, leaveRequests: !notificationSettings.leaveRequests })}
                                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                            />
                                            <label htmlFor="leave-requests" className="ml-2 text-sm text-gray-700">
                                                Permintaan izin baru
                                            </label>
                                        </div>

                                        <div className="flex items-center">
                                            <input
                                                id="system-updates"
                                                type="checkbox"
                                                checked={notificationSettings.systemUpdates}
                                                onChange={() => setNotificationSettings({ ...notificationSettings, systemUpdates: !notificationSettings.systemUpdates })}
                                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                            />
                                            <label htmlFor="system-updates" className="ml-2 text-sm text-gray-700">
                                                Pembaruan sistem
                                            </label>
                                        </div>

                                        <div className="flex items-center">
                                            <input
                                                id="low-attendance"
                                                type="checkbox"
                                                checked={notificationSettings.lowAttendance}
                                                onChange={() => setNotificationSettings({ ...notificationSettings, lowAttendance: !notificationSettings.lowAttendance })}
                                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                            />
                                            <label htmlFor="low-attendance" className="ml-2 text-sm text-gray-700">
                                                Peringatan kehadiran rendah
                                            </label>
                                        </div>

                                        <div className="flex items-center">
                                            <input
                                                id="weekly-report"
                                                type="checkbox"
                                                checked={notificationSettings.weeklyReport}
                                                onChange={() => setNotificationSettings({ ...notificationSettings, weeklyReport: !notificationSettings.weeklyReport })}
                                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                            />
                                            <label htmlFor="weekly-report" className="ml-2 text-sm text-gray-700">
                                                Laporan mingguan
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        className="py-2 px-6 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                                                Menyimpan...
                                            </>
                                        ) : (
                                            <>
                                                <MdSave className="mr-2" /> Simpan Perubahan
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </Card>
                    )}

                    {activeTab === "devices" && (
                        <Card extra="p-5" data-aos="fade-left">
                            <div className="mb-4">
                                <h4 className="text-lg font-bold text-navy-700 dark:text-white">
                                    Perangkat Terhubung
                                </h4>
                                <p className="text-sm text-gray-600">
                                    Kelola perangkat yang sedang terhubung ke akun Anda
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 border border-gray-200 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center">
                                            <MdDevices className="h-5 w-5 text-gray-500 mr-2" />
                                            <h6 className="text-sm font-medium text-gray-900">Asus ZenBook Pro (Browser Chrome)</h6>
                                        </div>
                                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Saat Ini</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs text-gray-500">
                                        <span>Jakarta, Indonesia</span>
                                        <span>Terakhir aktif: Saat ini</span>
                                    </div>
                                </div>

                                <div className="p-4 border border-gray-200 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center">
                                            <MdDevices className="h-5 w-5 text-gray-500 mr-2" />
                                            <h6 className="text-sm font-medium text-gray-900">iPhone 13 Pro (Aplikasi Mobile)</h6>
                                        </div>
                                        <button className="px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-800 hover:bg-red-200">
                                            Hapus
                                        </button>
                                    </div>
                                    <div className="flex justify-between items-center text-xs text-gray-500">
                                        <span>Jakarta, Indonesia</span>
                                        <span>Terakhir aktif: 3 jam yang lalu</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                <div className="flex items-start">
                                    <MdInfo className="text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                                    <p className="text-sm text-blue-700">
                                        Jika Anda melihat perangkat yang tidak Anda kenali, segera hapus dan ubah password Anda untuk keamanan.
                                    </p>
                                </div>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;
