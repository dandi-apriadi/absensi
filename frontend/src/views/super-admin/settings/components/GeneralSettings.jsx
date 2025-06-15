import React, { useEffect, useState } from "react";
import { MdSave, MdLanguage, MdDarkMode, MdLightMode, MdSchool, MdLocationOn, MdAccessTime, MdSettings, MdNotifications } from "react-icons/md";
import AOS from "aos";
import "aos/dist/aos.css";

const GeneralSettings = () => {
    const [institutionName, setInstitutionName] = useState("Universitas Teknologi Indonesia");
    const [institutionAddress, setInstitutionAddress] = useState("Jl. Teknologi No. 123, Jakarta");
    const [timezone, setTimezone] = useState("Asia/Jakarta");
    const [language, setLanguage] = useState("id");
    const [theme, setTheme] = useState("light");
    const [dateFormat, setDateFormat] = useState("dd/MM/yyyy");
    const [timeFormat, setTimeFormat] = useState("24");
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
        });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        // Simulate API request
        setTimeout(() => {
            setSaving(false);
            setShowSuccess(true);

            setTimeout(() => {
                setShowSuccess(false);
            }, 3000);
        }, 1500);
    };

    return (
        <div className="p-4 md:p-8">
            <div className="mb-8" data-aos="fade-down">
                <h1 className="text-3xl font-bold text-gray-800">Pengaturan Umum</h1>
                <p className="text-gray-600">Konfigurasi pengaturan dasar sistem</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6" data-aos="fade-up">
                {/* Institution Information */}
                <div className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <MdSchool className="mr-2 h-5 w-5 text-blue-600" />
                        Informasi Institusi
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="institutionName" className="block text-sm font-medium text-gray-700 mb-1">
                                Nama Institusi
                            </label>
                            <input
                                type="text"
                                id="institutionName"
                                value={institutionName}
                                onChange={(e) => setInstitutionName(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                        </div>

                        <div>
                            <label htmlFor="institutionAddress" className="block text-sm font-medium text-gray-700 mb-1">
                                Alamat
                            </label>
                            <input
                                type="text"
                                id="institutionAddress"
                                value={institutionAddress}
                                onChange={(e) => setInstitutionAddress(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Localization Settings */}
                <div className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <MdLanguage className="mr-2 h-5 w-5 text-blue-600" />
                        Lokalisasi
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                            <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-1">
                                Zona Waktu
                            </label>
                            <div className="relative">
                                <MdAccessTime className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <select
                                    id="timezone"
                                    value={timezone}
                                    onChange={(e) => setTimezone(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none"
                                >
                                    <option value="Asia/Jakarta">Asia/Jakarta (GMT+7)</option>
                                    <option value="Asia/Makassar">Asia/Makassar (GMT+8)</option>
                                    <option value="Asia/Jayapura">Asia/Jayapura (GMT+9)</option>
                                    <option value="Asia/Singapore">Asia/Singapore (GMT+8)</option>
                                    <option value="Asia/Bangkok">Asia/Bangkok (GMT+7)</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                                Bahasa
                            </label>
                            <div className="relative">
                                <MdLanguage className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <select
                                    id="language"
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none"
                                >
                                    <option value="id">Bahasa Indonesia</option>
                                    <option value="en">English</option>
                                    <option value="ja">日本語 (Japanese)</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tema
                            </label>
                            <div className="flex items-center space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setTheme("light")}
                                    className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg ${theme === "light" ? "bg-blue-100 text-blue-700 border-2 border-blue-300" : "bg-gray-100 text-gray-700"
                                        }`}
                                >
                                    <MdLightMode className="mr-2" /> Light
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setTheme("dark")}
                                    className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg ${theme === "dark" ? "bg-blue-100 text-blue-700 border-2 border-blue-300" : "bg-gray-100 text-gray-700"
                                        }`}
                                >
                                    <MdDarkMode className="mr-2" /> Dark
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <div>
                            <label htmlFor="dateFormat" className="block text-sm font-medium text-gray-700 mb-1">
                                Format Tanggal
                            </label>
                            <select
                                id="dateFormat"
                                value={dateFormat}
                                onChange={(e) => setDateFormat(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none"
                            >
                                <option value="dd/MM/yyyy">DD/MM/YYYY (31/12/2025)</option>
                                <option value="MM/dd/yyyy">MM/DD/YYYY (12/31/2025)</option>
                                <option value="yyyy-MM-dd">YYYY-MM-DD (2025-12-31)</option>
                                <option value="dd MMM yyyy">DD MMM YYYY (31 Dec 2025)</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="timeFormat" className="block text-sm font-medium text-gray-700 mb-1">
                                Format Waktu
                            </label>
                            <select
                                id="timeFormat"
                                value={timeFormat}
                                onChange={(e) => setTimeFormat(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none"
                            >
                                <option value="24">24 Jam (14:30)</option>
                                <option value="12">12 Jam (2:30 PM)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Notification Settings */}
                <div className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <MdNotifications className="mr-2 h-5 w-5 text-blue-600" />
                        Notifikasi
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-start space-x-3">
                            <input
                                type="checkbox"
                                id="emailNotifications"
                                checked={emailNotifications}
                                onChange={(e) => setEmailNotifications(e.target.checked)}
                                className="h-5 w-5 text-blue-600 focus:ring-blue-500 rounded mt-1"
                            />
                            <div>
                                <label htmlFor="emailNotifications" className="block text-sm font-medium text-gray-700">
                                    Email Notifications
                                </label>
                                <p className="mt-1 text-xs text-gray-500">Kirim notifikasi melalui email</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3">
                            <input
                                type="checkbox"
                                id="pushNotifications"
                                checked={pushNotifications}
                                onChange={(e) => setPushNotifications(e.target.checked)}
                                className="h-5 w-5 text-blue-600 focus:ring-blue-500 rounded mt-1"
                            />
                            <div>
                                <label htmlFor="pushNotifications" className="block text-sm font-medium text-gray-700">
                                    Push Notifications
                                </label>
                                <p className="mt-1 text-xs text-gray-500">Kirim notifikasi ke browser/aplikasi</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* System Settings */}
                <div className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <MdSettings className="mr-2 h-5 w-5 text-blue-600" />
                        Pengaturan Sistem
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                            <label htmlFor="sessionTimeout" className="block text-sm font-medium text-gray-700 mb-1">
                                Timeout Sesi (menit)
                            </label>
                            <select
                                id="sessionTimeout"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none"
                                defaultValue="30"
                            >
                                <option value="15">15 menit</option>
                                <option value="30">30 menit</option>
                                <option value="60">60 menit</option>
                                <option value="120">120 menit</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="itemsPerPage" className="block text-sm font-medium text-gray-700 mb-1">
                                Item Per Halaman
                            </label>
                            <select
                                id="itemsPerPage"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none"
                                defaultValue="25"
                            >
                                <option value="10">10 items</option>
                                <option value="25">25 items</option>
                                <option value="50">50 items</option>
                                <option value="100">100 items</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="logRetention" className="block text-sm font-medium text-gray-700 mb-1">
                                Log Retention (hari)
                            </label>
                            <select
                                id="logRetention"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none"
                                defaultValue="90"
                            >
                                <option value="30">30 hari</option>
                                <option value="60">60 hari</option>
                                <option value="90">90 hari</option>
                                <option value="180">180 hari</option>
                                <option value="365">365 hari</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-gray-200">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
                        disabled={saving}
                    >
                        {saving ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                </svg>
                                Menyimpan...
                            </>
                        ) : (
                            <>
                                <MdSave className="mr-2" /> Simpan Pengaturan
                            </>
                        )}
                    </button>
                </div>
            </form>

            {/* Success Toast */}
            {showSuccess && (
                <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center" data-aos="fade-left">
                    <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p>Pengaturan berhasil disimpan!</p>
                </div>
            )}
        </div>
    );
};

export default GeneralSettings;
