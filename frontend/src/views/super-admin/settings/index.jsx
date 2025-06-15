import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { MdSettings, MdFace, MdMeetingRoom, MdBackup, MdNotifications, MdLanguage, MdSecurity, MdDashboard } from "react-icons/md";
import AOS from "aos";
import "aos/dist/aos.css";

const SystemSettings = () => {
    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
        });
    }, []);

    return (
        <div className="p-4 md:p-8">
            <div className="mb-8" data-aos="fade-down">
                <h1 className="text-3xl font-bold text-gray-800">Pengaturan Sistem</h1>
                <p className="text-gray-600">Konfigurasi parameter sistem dan preferensi aplikasi</p>
            </div>

            {/* Settings Categories */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link to="/super-admin/settings/general-settings" className="block">
                    <div
                        className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 h-full"
                        data-aos="fade-up"
                    >
                        <div className="bg-blue-100 p-4 rounded-full w-16 h-16 flex justify-center items-center mb-4">
                            <MdSettings className="h-8 w-8 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Pengaturan Umum</h3>
                        <p className="text-gray-600">
                            Konfigurasi pengaturan dasar sistem seperti nama institusi, zona waktu, dan opsi tampilan.
                        </p>
                        <button className="mt-4 text-blue-600 font-medium flex items-center">
                            Kelola Pengaturan Umum
                            <svg className="w-5 h-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </Link>

                <Link to="/super-admin/settings/face-recognition-settings" className="block">
                    <div
                        className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 h-full"
                        data-aos="fade-up"
                        data-aos-delay="100"
                    >
                        <div className="bg-purple-100 p-4 rounded-full w-16 h-16 flex justify-center items-center mb-4">
                            <MdFace className="h-8 w-8 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Pengenalan Wajah</h3>
                        <p className="text-gray-600">
                            Konfigurasi parameter pengenalan wajah, threshold pencocokan, dan pengaturan anti-spoofing.
                        </p>
                        <button className="mt-4 text-purple-600 font-medium flex items-center">
                            Kelola Pengenalan Wajah
                            <svg className="w-5 h-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </Link>

                <Link to="/super-admin/settings/room-settings" className="block">
                    <div
                        className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 h-full"
                        data-aos="fade-up"
                        data-aos-delay="200"
                    >
                        <div className="bg-green-100 p-4 rounded-full w-16 h-16 flex justify-center items-center mb-4">
                            <MdMeetingRoom className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Pengaturan Ruangan</h3>
                        <p className="text-gray-600">
                            Kelola informasi ruangan, jadwal akses, dan konfigurasi perangkat.
                        </p>
                        <button className="mt-4 text-green-600 font-medium flex items-center">
                            Kelola Pengaturan Ruangan
                            <svg className="w-5 h-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </Link>

                <Link to="/super-admin/settings/backup-restore" className="block">
                    <div
                        className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 h-full"
                        data-aos="fade-up"
                        data-aos-delay="300"
                    >
                        <div className="bg-red-100 p-4 rounded-full w-16 h-16 flex justify-center items-center mb-4">
                            <MdBackup className="h-8 w-8 text-red-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Backup & Restore</h3>
                        <p className="text-gray-600">
                            Konfigurasi jadwal backup otomatis, restore data, dan manajemen penyimpanan.
                        </p>
                        <button className="mt-4 text-red-600 font-medium flex items-center">
                            Kelola Backup & Restore
                            <svg className="w-5 h-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </Link>

                <div
                    className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 h-full"
                    data-aos="fade-up"
                    data-aos-delay="400"
                >
                    <div className="bg-orange-100 p-4 rounded-full w-16 h-16 flex justify-center items-center mb-4">
                        <MdNotifications className="h-8 w-8 text-orange-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Notifikasi</h3>
                    <p className="text-gray-600">
                        Konfigurasi pengaturan notifikasi email, push notification, dan alert sistem.
                    </p>
                    <button className="mt-4 text-orange-600 font-medium flex items-center">
                        Kelola Notifikasi
                        <svg className="w-5 h-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>

                <div
                    className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 h-full"
                    data-aos="fade-up"
                    data-aos-delay="500"
                >
                    <div className="bg-indigo-100 p-4 rounded-full w-16 h-16 flex justify-center items-center mb-4">
                        <MdSecurity className="h-8 w-8 text-indigo-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Keamanan</h3>
                    <p className="text-gray-600">
                        Pengaturan keamanan seperti kebijakan kata sandi, autentikasi dua faktor, dan batas percobaan login.
                    </p>
                    <button className="mt-4 text-indigo-600 font-medium flex items-center">
                        Kelola Keamanan
                        <svg className="w-5 h-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Quick Settings */}
            <div className="mt-8 bg-white rounded-xl shadow-md p-6" data-aos="fade-up" data-aos-delay="600">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Settings</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center">
                            <MdLanguage className="h-5 w-5 text-gray-600 mr-3" />
                            <div>
                                <p className="text-sm font-medium text-gray-800">Bahasa</p>
                                <p className="text-xs text-gray-500">Indonesia</p>
                            </div>
                        </div>
                        <button className="text-blue-600 text-sm">Change</button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center">
                            <MdDashboard className="h-5 w-5 text-gray-600 mr-3" />
                            <div>
                                <p className="text-sm font-medium text-gray-800">Theme</p>
                                <p className="text-xs text-gray-500">Light Mode</p>
                            </div>
                        </div>
                        <button className="text-blue-600 text-sm">Toggle</button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center">
                            <MdNotifications className="h-5 w-5 text-gray-600 mr-3" />
                            <div>
                                <p className="text-sm font-medium text-gray-800">Notifikasi</p>
                                <p className="text-xs text-gray-500">Email & Push</p>
                            </div>
                        </div>
                        <button className="text-blue-600 text-sm">Configure</button>
                    </div>
                </div>
            </div>

            {/* System Status */}
            <div className="mt-8 bg-white rounded-xl shadow-md p-6" data-aos="fade-up" data-aos-delay="700">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Status Sistem</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-xs text-gray-500 uppercase">Versi Sistem</p>
                        <p className="text-sm font-medium text-gray-800 mt-1">v2.5.3</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-xs text-gray-500 uppercase">Update Terakhir</p>
                        <p className="text-sm font-medium text-gray-800 mt-1">12 Mei 2025</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-xs text-gray-500 uppercase">Database Size</p>
                        <p className="text-sm font-medium text-gray-800 mt-1">2.3 GB</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-xs text-gray-500 uppercase">Last Backup</p>
                        <p className="text-sm font-medium text-gray-800 mt-1">15 Mei 2025, 01:00</p>
                    </div>
                </div>

                <div className="mt-4">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors">
                        Check for Updates
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SystemSettings;
