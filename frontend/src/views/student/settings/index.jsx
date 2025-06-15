import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { MdPerson, MdSecurity, MdNotifications, MdLanguage, MdColorLens, MdSave } from "react-icons/md";

const ProfileSettings = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [formData, setFormData] = useState({
        name: 'John Doe',
        nim: '2021001234',
        email: 'john.doe@university.ac.id',
        phone: '081234567890',
        address: 'Jl. Pendidikan No. 123, Jakarta',
        program: 'Teknik Informatika',
        semester: '6',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        emailNotifications: true,
        pushNotifications: true,
        attendanceReminder: true,
        assignmentReminder: false,
        language: 'id',
        theme: 'light'
    });

    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
        });
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = () => {
        // Simulate save
        alert('Pengaturan berhasil disimpan!');
    };

    const tabs = [
        { id: 'profile', label: 'Profil', icon: MdPerson },
        { id: 'security', label: 'Keamanan', icon: MdSecurity },
        { id: 'notifications', label: 'Notifikasi', icon: MdNotifications },
        { id: 'preferences', label: 'Preferensi', icon: MdColorLens },
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            {/* Header */}
            <div className="mb-8" data-aos="fade-down">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Pengaturan Profil
                </h1>
                <p className="text-gray-600">
                    Kelola informasi profil dan preferensi sistem Anda
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-lg p-6" data-aos="fade-right">
                        <div className="space-y-2">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-all duration-200 ${activeTab === tab.id
                                            ? 'bg-blue-500 text-white shadow-lg'
                                            : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    <tab.icon className="h-5 w-5 mr-3" />
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-xl shadow-lg p-6" data-aos="fade-left">
                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-6">Informasi Profil</h3>

                                {/* Profile Picture */}
                                <div className="flex items-center mb-8">
                                    <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-6">
                                        JD
                                    </div>
                                    <div>
                                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors mr-3">
                                            Ubah Foto
                                        </button>
                                        <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                                            Hapus
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nama Lengkap
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            NIM
                                        </label>
                                        <input
                                            type="text"
                                            name="nim"
                                            value={formData.nim}
                                            onChange={handleInputChange}
                                            disabled
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            No. Telepon
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Alamat
                                        </label>
                                        <textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Program Studi
                                        </label>
                                        <input
                                            type="text"
                                            name="program"
                                            value={formData.program}
                                            onChange={handleInputChange}
                                            disabled
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Semester
                                        </label>
                                        <input
                                            type="text"
                                            name="semester"
                                            value={formData.semester}
                                            onChange={handleInputChange}
                                            disabled
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Security Tab */}
                        {activeTab === 'security' && (
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-6">Keamanan Akun</h3>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Password Saat Ini
                                        </label>
                                        <input
                                            type="password"
                                            name="currentPassword"
                                            value={formData.currentPassword}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Password Baru
                                        </label>
                                        <input
                                            type="password"
                                            name="newPassword"
                                            value={formData.newPassword}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Konfirmasi Password Baru
                                        </label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                        <h4 className="font-medium text-yellow-800 mb-2">Tips Keamanan:</h4>
                                        <ul className="text-sm text-yellow-700 space-y-1">
                                            <li>• Gunakan kombinasi huruf besar, kecil, angka, dan simbol</li>
                                            <li>• Minimal 8 karakter</li>
                                            <li>• Jangan gunakan informasi pribadi yang mudah ditebak</li>
                                            <li>• Ubah password secara berkala</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Notifications Tab */}
                        {activeTab === 'notifications' && (
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-6">Pengaturan Notifikasi</h3>

                                <div className="space-y-6">
                                    <div className="border border-gray-200 rounded-lg p-4">
                                        <h4 className="font-medium text-gray-800 mb-4">Notifikasi Email</h4>
                                        <div className="space-y-3">
                                            <label className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    name="emailNotifications"
                                                    checked={formData.emailNotifications}
                                                    onChange={handleInputChange}
                                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                />
                                                <span className="ml-3 text-gray-700">Aktifkan notifikasi email</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    name="attendanceReminder"
                                                    checked={formData.attendanceReminder}
                                                    onChange={handleInputChange}
                                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                />
                                                <span className="ml-3 text-gray-700">Pengingat kehadiran</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    name="assignmentReminder"
                                                    checked={formData.assignmentReminder}
                                                    onChange={handleInputChange}
                                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                />
                                                <span className="ml-3 text-gray-700">Pengingat tugas</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="border border-gray-200 rounded-lg p-4">
                                        <h4 className="font-medium text-gray-800 mb-4">Notifikasi Push</h4>
                                        <div className="space-y-3">
                                            <label className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    name="pushNotifications"
                                                    checked={formData.pushNotifications}
                                                    onChange={handleInputChange}
                                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                />
                                                <span className="ml-3 text-gray-700">Aktifkan notifikasi push</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Preferences Tab */}
                        {activeTab === 'preferences' && (
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-6">Preferensi Sistem</h3>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Bahasa
                                        </label>
                                        <select
                                            name="language"
                                            value={formData.language}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="id">Bahasa Indonesia</option>
                                            <option value="en">English</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Tema
                                        </label>
                                        <select
                                            name="theme"
                                            value={formData.theme}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="light">Terang</option>
                                            <option value="dark">Gelap</option>
                                            <option value="auto">Otomatis</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Save Button */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <button
                                onClick={handleSave}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
                            >
                                <MdSave className="h-5 w-5 mr-2" />
                                Simpan Perubahan
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;
