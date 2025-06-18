import React, { useState, useEffect } from "react";
import {
    MdEdit,
    MdSave,
    MdCancel,
    MdUpload,
    MdVisibility,
    MdVisibilityOff,
    MdPerson,
    MdEmail,
    MdPhone,
    MdSchool,
    MdWork,
    MdLocationOn,
    MdDateRange,
    MdSecurity,
    MdImage,
    MdCheckCircle,
    MdError,
    MdInfo,
    MdHistory,
    MdDeleteOutline,
    MdLock,
    MdLockOpen
} from "react-icons/md";
import AOS from 'aos';
import 'aos/dist/aos.css';

const EditUser = () => {
    const [activeTab, setActiveTab] = useState('personal');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Dummy user data - simulating fetched data from API
    const [userData, setUserData] = useState({
        id: 1,
        fullName: "Ahmad Fauzi Rahman",
        email: "ahmad.fauzi@student.univ.ac.id",
        phone: "+62 812-3456-7890",
        birthDate: "2001-05-15",
        gender: "laki-laki",
        address: "Jl. Merdeka No. 123, Jakarta Selatan",

        // Academic Information
        userType: "mahasiswa",
        nim: "2021010101",
        nidn: "",
        department: "Teknik Informatika",
        studyProgram: "Teknik Informatika",
        year: "2021",
        position: "",
        education: "",
        specialization: "",

        // Account Information
        username: "ahmad.fauzi",
        password: "",
        confirmPassword: "",
        status: "active",
        lastLogin: "2024-06-17T10:30:00",
        joinDate: "2021-08-01",

        // Additional Information
        emergencyContact: "Budi Rahman",
        emergencyPhone: "+62 813-9876-5432",
        notes: "Mahasiswa aktif dengan prestasi akademik yang baik",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    });

    const [formData, setFormData] = useState({ ...userData });
    const [errors, setErrors] = useState({});
    const [hasChanges, setHasChanges] = useState(false);

    // Activity log dummy data
    const [activityLog] = useState([
        {
            id: 1,
            action: "Login",
            timestamp: "2024-06-17T08:30:00",
            ip: "192.168.1.100",
            device: "Chrome Browser"
        },
        {
            id: 2,
            action: "Profile Update",
            timestamp: "2024-06-15T14:22:00",
            ip: "192.168.1.100",
            device: "Mobile App"
        },
        {
            id: 3,
            action: "Password Change",
            timestamp: "2024-06-10T16:45:00",
            ip: "192.168.1.102",
            device: "Firefox Browser"
        },
        {
            id: 4,
            action: "Login",
            timestamp: "2024-06-08T09:15:00",
            ip: "192.168.1.100",
            device: "Chrome Browser"
        }
    ]);

    useEffect(() => {
        AOS.init({
            duration: 800,
            offset: 100,
            easing: 'ease-in-out',
            once: true
        });

        // Set initial image preview if avatar exists
        if (userData.avatar) {
            setImagePreview(userData.avatar);
        }
    }, [userData.avatar]);

    useEffect(() => {
        // Check if form data has changed
        const hasFormChanges = JSON.stringify(formData) !== JSON.stringify(userData);
        setHasChanges(hasFormChanges);
    }, [formData, userData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullName) newErrors.fullName = "Nama lengkap wajib diisi";
        if (!formData.email) newErrors.email = "Email wajib diisi";
        if (!formData.phone) newErrors.phone = "Nomor telepon wajib diisi";
        if (!formData.username) newErrors.username = "Username wajib diisi";

        if (formData.userType === "mahasiswa") {
            if (!formData.nim) newErrors.nim = "NIM wajib diisi";
            if (!formData.studyProgram) newErrors.studyProgram = "Program studi wajib dipilih";
        } else if (formData.userType === "dosen") {
            if (!formData.nidn) newErrors.nidn = "NIDN wajib diisi";
            if (!formData.position) newErrors.position = "Jabatan wajib dipilih";
        }

        if (formData.password && formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Konfirmasi password tidak sesuai";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            setIsLoading(true);
            // Simulate API call
            setTimeout(() => {
                console.log('Updated User Data:', formData);
                console.log('Profile Image:', profileImage);
                setIsLoading(false);
                alert('Data pengguna berhasil diperbarui!');
                setUserData({ ...formData });
                setHasChanges(false);
            }, 2000);
        }
    };

    const handleReset = () => {
        setFormData({ ...userData });
        setImagePreview(userData.avatar);
        setProfileImage(null);
        setErrors({});
        setHasChanges(false);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const tabs = [
        { id: 'personal', label: 'Informasi Pribadi', icon: MdPerson },
        { id: 'academic', label: 'Informasi Akademik', icon: MdSchool },
        { id: 'account', label: 'Informasi Akun', icon: MdSecurity },
        { id: 'activity', label: 'Aktivitas', icon: MdHistory }
    ];

    const departments = [
        "Teknik Informatika",
        "Sistem Informasi",
        "Manajemen Informatika",
        "Teknik Komputer",
        "Keamanan Siber"
    ];

    const studyPrograms = [
        "Teknik Informatika",
        "Sistem Informasi",
        "Manajemen Informatika"
    ];

    const positions = [
        "Profesor",
        "Lektor Kepala",
        "Lektor",
        "Asisten Profesor",
        "Pengajar"
    ];

    const yearOptions = [
        "2020", "2021", "2022", "2023", "2024", "2025"
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 p-4 md:p-8">
            {/* Header */}
            <div className="mb-8" data-aos="fade-down">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-r from-green-600 to-green-700 p-3 rounded-xl text-white">
                            <MdEdit className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                Edit Pengguna
                            </h1>
                            <p className="text-gray-600 text-lg">Ubah informasi pengguna yang ada</p>
                        </div>
                    </div>

                    {hasChanges && (
                        <div className="bg-orange-100 border border-orange-300 rounded-lg px-4 py-2 flex items-center gap-2">
                            <MdInfo className="w-5 h-5 text-orange-600" />
                            <span className="text-orange-800 text-sm font-medium">Ada perubahan yang belum disimpan</span>
                        </div>
                    )}
                </div>
            </div>

            {/* User Info Header */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100" data-aos="fade-up">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-gray-300 flex items-center justify-center overflow-hidden">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <MdPerson className="w-12 h-12 text-gray-400" />
                            )}
                        </div>
                        <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer transition-colors duration-200">
                            <MdUpload className="w-4 h-4" />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                        </label>
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-2xl font-bold text-gray-800">{userData.fullName}</h2>
                        <p className="text-gray-600">{userData.email}</p>
                        <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${userData.userType === 'mahasiswa' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                                }`}>
                                {userData.userType === 'mahasiswa' ? 'Mahasiswa' : 'Dosen'}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${userData.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                {userData.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {userData.department}
                            </span>
                        </div>
                    </div>

                    <div className="text-center md:text-right">
                        <p className="text-sm text-gray-500">Login Terakhir</p>
                        <p className="text-sm font-medium text-gray-800">{formatDate(userData.lastLogin)}</p>
                        <p className="text-sm text-gray-500 mt-2">Bergabung</p>
                        <p className="text-sm font-medium text-gray-800">{formatDate(userData.joinDate)}</p>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white rounded-2xl shadow-lg mb-8 border border-gray-100" data-aos="fade-up" data-aos-delay="100">
                <div className="flex flex-wrap border-b border-gray-200">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-4 font-medium transition-all duration-300 ${activeTab === tab.id
                                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                                }`}
                        >
                            <tab.icon className="w-5 h-5" />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Form Container */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100" data-aos="fade-up" data-aos-delay="200">
                <form onSubmit={handleSubmit} className="p-8">
                    {/* Personal Information Tab */}
                    {activeTab === 'personal' && (
                        <div className="space-y-6" data-aos="fade-right">
                            <div className="mb-6">
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">Informasi Pribadi</h3>
                                <p className="text-gray-600">Ubah informasi pribadi pengguna</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Full Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nama Lengkap <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 ${errors.fullName ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="Masukkan nama lengkap"
                                    />
                                    {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 ${errors.email ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="Masukkan email"
                                    />
                                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nomor Telepon <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 ${errors.phone ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="Masukkan nomor telepon"
                                    />
                                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                                </div>

                                {/* Birth Date */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tanggal Lahir
                                    </label>
                                    <input
                                        type="date"
                                        name="birthDate"
                                        value={formData.birthDate}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300"
                                    />
                                </div>

                                {/* Gender */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Jenis Kelamin
                                    </label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300"
                                    >
                                        <option value="">Pilih Jenis Kelamin</option>
                                        <option value="laki-laki">Laki-laki</option>
                                        <option value="perempuan">Perempuan</option>
                                    </select>
                                </div>

                                {/* Status */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Status Pengguna
                                    </label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300"
                                    >
                                        <option value="active">Aktif</option>
                                        <option value="inactive">Tidak Aktif</option>
                                        <option value="suspended">Ditangguhkan</option>
                                    </select>
                                </div>
                            </div>

                            {/* Address */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Alamat
                                </label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300"
                                    placeholder="Masukkan alamat lengkap"
                                />
                            </div>

                            {/* Emergency Contact */}
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <h4 className="text-lg font-semibold text-gray-800 mb-4">Kontak Darurat</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nama Kontak Darurat
                                        </label>
                                        <input
                                            type="text"
                                            name="emergencyContact"
                                            value={formData.emergencyContact}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300"
                                            placeholder="Nama keluarga atau wali"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nomor Kontak Darurat
                                        </label>
                                        <input
                                            type="tel"
                                            name="emergencyPhone"
                                            value={formData.emergencyPhone}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300"
                                            placeholder="Nomor telepon darurat"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Academic Information Tab */}
                    {activeTab === 'academic' && (
                        <div className="space-y-6" data-aos="fade-right">
                            <div className="mb-6">
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">Informasi Akademik</h3>
                                <p className="text-gray-600">Ubah informasi akademik sesuai tipe pengguna</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* User Type (Read Only) */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tipe Pengguna
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.userType === 'mahasiswa' ? 'Mahasiswa' : 'Dosen'}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                                        readOnly
                                    />
                                    <p className="text-sm text-gray-500 mt-1">Tipe pengguna tidak dapat diubah</p>
                                </div>

                                {/* Department */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Jurusan <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="department"
                                        value={formData.department}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300"
                                    >
                                        <option value="">Pilih Jurusan</option>
                                        {departments.map((dept, index) => (
                                            <option key={index} value={dept}>{dept}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Student specific fields */}
                                {formData.userType === "mahasiswa" && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                NIM <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="nim"
                                                value={formData.nim}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 ${errors.nim ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                                placeholder="Masukkan NIM"
                                            />
                                            {errors.nim && <p className="text-red-500 text-sm mt-1">{errors.nim}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Program Studi <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                name="studyProgram"
                                                value={formData.studyProgram}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 ${errors.studyProgram ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                            >
                                                <option value="">Pilih Program Studi</option>
                                                {studyPrograms.map((program, index) => (
                                                    <option key={index} value={program}>{program}</option>
                                                ))}
                                            </select>
                                            {errors.studyProgram && <p className="text-red-500 text-sm mt-1">{errors.studyProgram}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Angkatan
                                            </label>
                                            <select
                                                name="year"
                                                value={formData.year}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300"
                                            >
                                                <option value="">Pilih Angkatan</option>
                                                {yearOptions.map((year, index) => (
                                                    <option key={index} value={year}>{year}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </>
                                )}

                                {/* Lecturer specific fields */}
                                {formData.userType === "dosen" && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                NIDN <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="nidn"
                                                value={formData.nidn}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 ${errors.nidn ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                                placeholder="Masukkan NIDN"
                                            />
                                            {errors.nidn && <p className="text-red-500 text-sm mt-1">{errors.nidn}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Jabatan <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                name="position"
                                                value={formData.position}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 ${errors.position ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                            >
                                                <option value="">Pilih Jabatan</option>
                                                {positions.map((position, index) => (
                                                    <option key={index} value={position}>{position}</option>
                                                ))}
                                            </select>
                                            {errors.position && <p className="text-red-500 text-sm mt-1">{errors.position}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Pendidikan
                                            </label>
                                            <input
                                                type="text"
                                                name="education"
                                                value={formData.education}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300"
                                                placeholder="Contoh: S3 Ilmu Komputer"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Spesialisasi
                                            </label>
                                            <input
                                                type="text"
                                                name="specialization"
                                                value={formData.specialization}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300"
                                                placeholder="Contoh: Artificial Intelligence"
                                            />
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Catatan Tambahan
                                </label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300"
                                    placeholder="Catatan atau informasi tambahan"
                                />
                            </div>
                        </div>
                    )}

                    {/* Account Information Tab */}
                    {activeTab === 'account' && (
                        <div className="space-y-6" data-aos="fade-right">
                            <div className="mb-6">
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">Informasi Akun</h3>
                                <p className="text-gray-600">Ubah informasi akun dan keamanan</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Username */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Username <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 ${errors.username ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="Masukkan username"
                                    />
                                    {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
                                </div>

                                {/* Join Date (Read Only) */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tanggal Bergabung
                                    </label>
                                    <input
                                        type="text"
                                        value={formatDate(formData.joinDate)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                                        readOnly
                                    />
                                </div>
                            </div>

                            {/* Password Section */}
                            <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                                <h4 className="text-lg font-semibold text-yellow-800 mb-4 flex items-center gap-2">
                                    <MdLock className="w-5 h-5" />
                                    Ubah Password
                                </h4>
                                <p className="text-yellow-700 text-sm mb-4">Kosongkan jika tidak ingin mengubah password</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* New Password */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Password Baru
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300"
                                                placeholder="Masukkan password baru"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                            >
                                                {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Confirm New Password */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Konfirmasi Password Baru
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                                placeholder="Konfirmasi password baru"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                            >
                                                {showConfirmPassword ? <MdVisibilityOff /> : <MdVisibility />}
                                            </button>
                                        </div>
                                        {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Activity Log Tab */}
                    {activeTab === 'activity' && (
                        <div className="space-y-6" data-aos="fade-right">
                            <div className="mb-6">
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">Log Aktivitas</h3>
                                <p className="text-gray-600">Riwayat aktivitas pengguna dalam sistem</p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-6">
                                <div className="space-y-4">
                                    {activityLog.map((activity) => (
                                        <div key={activity.id} className="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-2 rounded-lg ${activity.action === 'Login' ? 'bg-green-100 text-green-600' :
                                                        activity.action === 'Profile Update' ? 'bg-blue-100 text-blue-600' :
                                                            'bg-orange-100 text-orange-600'
                                                    }`}>
                                                    {activity.action === 'Login' ? <MdLockOpen className="w-5 h-5" /> :
                                                        activity.action === 'Profile Update' ? <MdEdit className="w-5 h-5" /> :
                                                            <MdLock className="w-5 h-5" />}
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-gray-800">{activity.action}</h4>
                                                    <p className="text-sm text-gray-600">{activity.device}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-medium text-gray-800">{formatDate(activity.timestamp)}</p>
                                                <p className="text-sm text-gray-500">{activity.ip}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    {activeTab !== 'activity' && (
                        <div className="flex items-center justify-between pt-8 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={handleReset}
                                disabled={!hasChanges}
                                className={`px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-300 flex items-center gap-2 ${!hasChanges ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                            >
                                <MdCancel className="h-4 w-4" />
                                Reset
                            </button>

                            <button
                                type="submit"
                                disabled={!hasChanges || isLoading}
                                className={`px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl ${!hasChanges || isLoading ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                            >
                                <MdSave className="h-4 w-4" />
                                {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default EditUser;
