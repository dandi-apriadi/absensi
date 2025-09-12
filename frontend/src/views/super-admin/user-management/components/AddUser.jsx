import React, { useState, useEffect } from "react";
import {
    MdPersonAdd,
    MdSave,
    MdCancel,
    MdVisibility,
    MdVisibilityOff,
    MdPerson,
    MdSecurity,
    MdCheckCircle,
    MdError,
    MdInfo
} from "react-icons/md";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { createUser } from "../../../../services/userManagementService";

const AddUser = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const [formData, setFormData] = useState({
        // Personal Information (sesuai model database)
        fullname: "",
        email: "",
        gender: "",
        role: "",
        student_id: "",

        // Account Information
        password: "",
        confirmPassword: ""
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

    const validateStep = (step) => {
        const newErrors = {};

        switch (step) {
            case 1:
                if (!formData.fullname) newErrors.fullname = "Nama lengkap wajib diisi";
                if (!formData.email) newErrors.email = "Email wajib diisi";
                if (!formData.role) newErrors.role = "Role pengguna wajib dipilih";
                if (formData.role === "student" && !formData.student_id) {
                    newErrors.student_id = "Student ID wajib diisi untuk mahasiswa";
                }
                break;
            case 2:
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
        if (validateStep(currentStep) && currentStep < 3) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateStep(2)) return;

        setIsLoading(true);
        try {
            // Prepare data sesuai dengan model database
            const userData = {
                fullname: formData.fullname,
                email: formData.email,
                password: formData.password,
                role: formData.role,
                gender: formData.gender || null,
                student_id: formData.role === 'student' ? formData.student_id : null
            };

            console.log('Sending user data:', userData);
            
            const response = await createUser(userData);
            console.log('User created successfully:', response);
            
            setSubmitSuccess(true);
            
            // Reset form after success
            setTimeout(() => {
                setFormData({
                    fullname: "",
                    email: "",
                    gender: "",
                    role: "",
                    student_id: "",
                    password: "",
                    confirmPassword: ""
                });
                setCurrentStep(1);
                setSubmitSuccess(false);
            }, 2000);

        } catch (error) {
            console.error('Error creating user:', error);
            
            let errorMessage = 'Terjadi kesalahan saat menyimpan data pengguna';
            
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            setErrors({ 
                general: errorMessage 
            });
        } finally {
            setIsLoading(false);
        }
    };

    const steps = [
        { number: 1, title: "Informasi Pengguna", icon: MdPerson },
        { number: 2, title: "Informasi Akun", icon: MdSecurity },
        { number: 3, title: "Konfirmasi", icon: MdCheckCircle }
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
                {/* Success Message */}
                {submitSuccess && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-t-2xl">
                        <div className="flex items-center">
                            <MdCheckCircle className="w-5 h-5 text-green-600 mr-3" />
                            <p className="text-green-800 font-medium">Pengguna berhasil ditambahkan!</p>
                        </div>
                    </div>
                )}

                {/* General Error Message */}
                {errors.general && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-t-2xl">
                        <div className="flex items-center">
                            <MdError className="w-5 h-5 text-red-600 mr-3" />
                            <p className="text-red-800">{errors.general}</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="p-8">
                    {/* Step 1: User Information */}
                    {currentStep === 1 && (
                        <div className="space-y-6" data-aos="fade-right">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">Informasi Pengguna</h2>
                                <p className="text-gray-600">Masukkan informasi dasar pengguna</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Full Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nama Lengkap <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="fullname"
                                        value={formData.fullname}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 ${errors.fullname ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="Masukkan nama lengkap"
                                    />
                                    {errors.fullname && <p className="text-red-500 text-sm mt-1">{errors.fullname}</p>}
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

                                {/* Role */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Role Pengguna <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 ${errors.role ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    >
                                        <option value="">Pilih Role Pengguna</option>
                                        <option value="super-admin">Super Admin</option>
                                        <option value="student">Student</option>
                                    </select>
                                    {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
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
                                        <option value="male">Laki-laki</option>
                                        <option value="female">Perempuan</option>
                                    </select>
                                </div>

                                {/* Student ID - hanya tampil jika role adalah student */}
                                {formData.role === "student" && (
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Student ID <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="student_id"
                                            value={formData.student_id}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 ${errors.student_id ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            placeholder="Masukkan Student ID"
                                        />
                                        {errors.student_id && <p className="text-red-500 text-sm mt-1">{errors.student_id}</p>}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Account Information */}
                    {currentStep === 2 && (
                        <div className="space-y-6" data-aos="fade-right">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">Informasi Akun</h2>
                                <p className="text-gray-600">Buat password untuk login sistem</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                    {/* Step 3: Confirmation */}
                    {currentStep === 3 && (
                        <div className="space-y-6" data-aos="fade-right">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">Konfirmasi Data</h2>
                                <p className="text-gray-600">Periksa kembali data yang akan disimpan</p>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-lg">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="font-semibold text-gray-800 mb-3">Informasi Pengguna</h3>
                                        <div className="space-y-2 text-sm">
                                            <p><span className="text-gray-600">Nama:</span> {formData.fullname}</p>
                                            <p><span className="text-gray-600">Email:</span> {formData.email}</p>
                                            <p><span className="text-gray-600">Role:</span> {formData.role === 'super-admin' ? 'Super Admin' : 'Student'}</p>
                                            {formData.gender && <p><span className="text-gray-600">Jenis Kelamin:</span> {formData.gender === 'male' ? 'Laki-laki' : 'Perempuan'}</p>}
                                            {formData.student_id && <p><span className="text-gray-600">Student ID:</span> {formData.student_id}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-gray-800 mb-3">Informasi Akun</h3>
                                        <div className="space-y-2 text-sm">
                                            <p><span className="text-gray-600">Password:</span> ********</p>
                                            <p className="text-green-600 text-xs">✓ Password telah dikonfirmasi</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Final confirmation note */}
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                <div className="flex items-start">
                                    <MdInfo className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
                                    <div>
                                        <h4 className="text-blue-800 font-medium mb-2">Catatan:</h4>
                                        <p className="text-blue-700 text-sm">
                                            Pastikan semua data yang dimasukkan sudah benar. Data akan disimpan ke dalam sistem setelah Anda mengklik tombol "Simpan Pengguna".
                                        </p>
                                    </div>
                                </div>
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

                        {currentStep < 3 ? (
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
                                disabled={isLoading}
                                className={`px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <MdSave className="h-4 w-4" />
                                {isLoading ? 'Menyimpan...' : 'Simpan Pengguna'}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddUser;
