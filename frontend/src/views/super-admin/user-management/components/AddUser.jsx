import React, { useState, useEffect } from "react";
import {
    MdPersonAdd,
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
    MdInfo
} from "react-icons/md";
import AOS from 'aos';
import 'aos/dist/aos.css';

const AddUser = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const [formData, setFormData] = useState({
        // Personal Information
        fullName: "",
        email: "",
        phone: "",
        birthDate: "",
        gender: "",
        address: "",

        // Academic Information
        userType: "",
        nim: "",
        nidn: "",
        department: "",
        studyProgram: "",
        year: "",
        position: "",
        education: "",
        specialization: "",

        // Account Information
        username: "",
        password: "",
        confirmPassword: "",
        status: "active",

        // Additional Information
        emergencyContact: "",
        emergencyPhone: "",
        notes: ""
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        AOS.init({
            duration: 800,
            offset: 100,
            easing: 'ease-in-out',
            once: true
        });
    }, []);

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

    const validateStep = (step) => {
        const newErrors = {};

        switch (step) {
            case 1:
                if (!formData.fullName) newErrors.fullName = "Nama lengkap wajib diisi";
                if (!formData.email) newErrors.email = "Email wajib diisi";
                if (!formData.phone) newErrors.phone = "Nomor telepon wajib diisi";
                if (!formData.userType) newErrors.userType = "Tipe pengguna wajib dipilih";
                break;
            case 2:
                if (formData.userType === "mahasiswa") {
                    if (!formData.nim) newErrors.nim = "NIM wajib diisi";
                    if (!formData.studyProgram) newErrors.studyProgram = "Program studi wajib dipilih";
                    if (!formData.year) newErrors.year = "Angkatan wajib dipilih";
                } else if (formData.userType === "dosen") {
                    if (!formData.nidn) newErrors.nidn = "NIDN wajib diisi";
                    if (!formData.position) newErrors.position = "Jabatan wajib dipilih";
                    if (!formData.education) newErrors.education = "Pendidikan wajib diisi";
                }
                if (!formData.department) newErrors.department = "Jurusan wajib dipilih";
                break;
            case 3:
                if (!formData.username) newErrors.username = "Username wajib diisi";
                if (!formData.password) newErrors.password = "Password wajib diisi";
                if (formData.password !== formData.confirmPassword) {
                    newErrors.confirmPassword = "Konfirmasi password tidak sesuai";
                }
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep(currentStep) && currentStep < 4) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateStep(3)) {
            console.log('Form Data:', formData);
            console.log('Profile Image:', profileImage);
            alert('Pengguna berhasil ditambahkan!');
            // Reset form or redirect
        }
    };

    const steps = [
        { number: 1, title: "Informasi Pribadi", icon: MdPerson },
        { number: 2, title: "Informasi Akademik", icon: MdSchool },
        { number: 3, title: "Informasi Akun", icon: MdSecurity },
        { number: 4, title: "Konfirmasi", icon: MdCheckCircle }
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
                <div className="flex items-center gap-4 mb-4">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-3 rounded-xl text-white">
                        <MdPersonAdd className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                            Tambah Pengguna Baru
                        </h1>
                        <p className="text-gray-600 text-lg">Tambahkan pengguna baru ke dalam sistem absensi</p>
                    </div>
                </div>
            </div>

            {/* Progress Steps */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100" data-aos="fade-up">
                <div className="flex items-center justify-between">
                    {steps.map((step, index) => (
                        <div key={step.number} className="flex items-center">
                            <div className={`flex flex-col items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}>
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${currentStep >= step.number
                                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                                        : 'bg-gray-200 text-gray-600'
                                    }`}>
                                    <step.icon className="w-6 h-6" />
                                </div>
                                <div className="text-center mt-2">
                                    <p className={`text-sm font-medium ${currentStep >= step.number ? 'text-blue-600' : 'text-gray-500'
                                        }`}>
                                        {step.title}
                                    </p>
                                </div>
                            </div>
                            {index < steps.length - 1 && (
                                <div className={`flex-1 h-1 mx-4 transition-all duration-300 ${currentStep > step.number ? 'bg-blue-600' : 'bg-gray-200'
                                    }`} />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Form Container */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100" data-aos="fade-up" data-aos-delay="100">
                <form onSubmit={handleSubmit} className="p-8">
                    {/* Step 1: Personal Information */}
                    {currentStep === 1 && (
                        <div className="space-y-6" data-aos="fade-right">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">Informasi Pribadi</h2>
                                <p className="text-gray-600">Masukkan informasi pribadi pengguna</p>
                            </div>

                            {/* Profile Image Upload */}
                            <div className="flex justify-center mb-8">
                                <div className="relative">
                                    <div className="w-32 h-32 rounded-full bg-gray-200 border-4 border-gray-300 flex items-center justify-center overflow-hidden">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <MdImage className="w-12 h-12 text-gray-400" />
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

                                {/* User Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tipe Pengguna <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="userType"
                                        value={formData.userType}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 ${errors.userType ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    >
                                        <option value="">Pilih Tipe Pengguna</option>
                                        <option value="mahasiswa">Mahasiswa</option>
                                        <option value="dosen">Dosen</option>
                                    </select>
                                    {errors.userType && <p className="text-red-500 text-sm mt-1">{errors.userType}</p>}
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
                        </div>
                    )}

                    {/* Step 2: Academic Information */}
                    {currentStep === 2 && (
                        <div className="space-y-6" data-aos="fade-right">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">Informasi Akademik</h2>
                                <p className="text-gray-600">Masukkan informasi akademik sesuai tipe pengguna</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Department */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Jurusan <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="department"
                                        value={formData.department}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 ${errors.department ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    >
                                        <option value="">Pilih Jurusan</option>
                                        {departments.map((dept, index) => (
                                            <option key={index} value={dept}>{dept}</option>
                                        ))}
                                    </select>
                                    {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
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
                                                Angkatan <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                name="year"
                                                value={formData.year}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 ${errors.year ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                            >
                                                <option value="">Pilih Angkatan</option>
                                                {yearOptions.map((year, index) => (
                                                    <option key={index} value={year}>{year}</option>
                                                ))}
                                            </select>
                                            {errors.year && <p className="text-red-500 text-sm mt-1">{errors.year}</p>}
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
                                                Pendidikan <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="education"
                                                value={formData.education}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 ${errors.education ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                                placeholder="Contoh: S3 Ilmu Komputer"
                                            />
                                            {errors.education && <p className="text-red-500 text-sm mt-1">{errors.education}</p>}
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

                            {/* Emergency Contact */}
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Kontak Darurat</h3>
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

                    {/* Step 3: Account Information */}
                    {currentStep === 3 && (
                        <div className="space-y-6" data-aos="fade-right">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">Informasi Akun</h2>
                                <p className="text-gray-600">Buat akun untuk login sistem</p>
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

                                {/* Status */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Status Akun
                                    </label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300"
                                    >
                                        <option value="active">Aktif</option>
                                        <option value="inactive">Tidak Aktif</option>
                                    </select>
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Password <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 ${errors.password ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            placeholder="Masukkan password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        >
                                            {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                                        </button>
                                    </div>
                                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Konfirmasi Password <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            placeholder="Konfirmasi password"
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

                            {/* Password Guidelines */}
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                <div className="flex items-start">
                                    <MdInfo className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
                                    <div>
                                        <h4 className="text-blue-800 font-medium mb-2">Panduan Password:</h4>
                                        <ul className="text-blue-700 text-sm space-y-1">
                                            <li>• Minimal 8 karakter</li>
                                            <li>• Gunakan kombinasi huruf besar, huruf kecil, dan angka</li>
                                            <li>• Hindari penggunaan informasi pribadi</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Confirmation */}
                    {currentStep === 4 && (
                        <div className="space-y-6" data-aos="fade-right">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">Konfirmasi Data</h2>
                                <p className="text-gray-600">Periksa kembali data yang akan disimpan</p>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-lg">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="font-semibold text-gray-800 mb-3">Informasi Pribadi</h3>
                                        <div className="space-y-2 text-sm">
                                            <p><span className="text-gray-600">Nama:</span> {formData.fullName}</p>
                                            <p><span className="text-gray-600">Email:</span> {formData.email}</p>
                                            <p><span className="text-gray-600">Telepon:</span> {formData.phone}</p>
                                            <p><span className="text-gray-600">Tipe:</span> {formData.userType}</p>
                                            {formData.birthDate && <p><span className="text-gray-600">Tanggal Lahir:</span> {formData.birthDate}</p>}
                                            {formData.gender && <p><span className="text-gray-600">Jenis Kelamin:</span> {formData.gender}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-gray-800 mb-3">Informasi Akademik</h3>
                                        <div className="space-y-2 text-sm">
                                            <p><span className="text-gray-600">Jurusan:</span> {formData.department}</p>
                                            {formData.userType === "mahasiswa" && (
                                                <>
                                                    <p><span className="text-gray-600">NIM:</span> {formData.nim}</p>
                                                    <p><span className="text-gray-600">Program Studi:</span> {formData.studyProgram}</p>
                                                    <p><span className="text-gray-600">Angkatan:</span> {formData.year}</p>
                                                </>
                                            )}
                                            {formData.userType === "dosen" && (
                                                <>
                                                    <p><span className="text-gray-600">NIDN:</span> {formData.nidn}</p>
                                                    <p><span className="text-gray-600">Jabatan:</span> {formData.position}</p>
                                                    <p><span className="text-gray-600">Pendidikan:</span> {formData.education}</p>
                                                    {formData.specialization && <p><span className="text-gray-600">Spesialisasi:</span> {formData.specialization}</p>}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {(formData.emergencyContact || formData.emergencyPhone) && (
                                    <div className="mt-6 pt-6 border-t border-gray-200">
                                        <h3 className="font-semibold text-gray-800 mb-3">Kontak Darurat</h3>
                                        <div className="space-y-2 text-sm">
                                            {formData.emergencyContact && <p><span className="text-gray-600">Nama:</span> {formData.emergencyContact}</p>}
                                            {formData.emergencyPhone && <p><span className="text-gray-600">Telepon:</span> {formData.emergencyPhone}</p>}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between pt-8 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={prevStep}
                            disabled={currentStep === 1}
                            className={`px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-300 flex items-center gap-2 ${currentStep === 1 ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                        >
                            <MdCancel className="h-4 w-4" />
                            Sebelumnya
                        </button>

                        {currentStep < 4 ? (
                            <button
                                type="button"
                                onClick={nextStep}
                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
                            >
                                Selanjutnya
                                <MdSave className="h-4 w-4" />
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
                            >
                                <MdSave className="h-4 w-4" />
                                Simpan Pengguna
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddUser;
