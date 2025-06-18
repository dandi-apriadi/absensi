import React, { useState, useEffect, useRef } from "react";
import {
    MdFileUpload,
    MdCloudUpload,
    MdPhotoCamera,
    MdFace,
    MdDelete,
    MdCheckCircle,
    MdError,
    MdWarning,
    MdInfo,
    MdClose,
    MdRefresh,
    MdVisibility,
    MdDownload,
    MdPerson,
    MdCollections,
    MdCameraAlt,
    MdImageSearch, MdFaceRetouchingNatural,
    MdCloudDone,
    MdSync,
    MdAutoAwesome,
    MdSettings,
    MdDeleteSweep,
    MdFilterAlt,
    MdZoomIn,
    MdCrop,
    MdBrightness6
} from "react-icons/md";
import AOS from "aos";
import "aos/dist/aos.css";

const UploadDataset = () => {
    const [activeTab, setActiveTab] = useState('single');
    const [selectedUser, setSelectedUser] = useState(null);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [uploadProgress, setUploadProgress] = useState({});
    const [isUploading, setIsUploading] = useState(false);
    const [previewImages, setPreviewImages] = useState([]);
    const [validationResults, setValidationResults] = useState([]);
    const [showPreview, setShowPreview] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [cameraActive, setCameraActive] = useState(false);
    const [uploadSettings, setUploadSettings] = useState({
        autoResize: true,
        faceDetection: true,
        qualityCheck: true,
        duplicateCheck: true
    });

    const fileInputRef = useRef(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        AOS.init({
            duration: 800,
            offset: 100,
            easing: 'ease-in-out',
            once: true,
        });
    }, []);

    // Dummy users data for selection
    const availableUsers = [
        {
            id: 1,
            name: "Ahmad Fauzi Rahman",
            nim: "2021010101",
            department: "Teknik Informatika",
            email: "ahmad.fauzi@student.univ.ac.id",
            hasDataset: false,
            avatar: "/api/placeholder/50/50"
        },
        {
            id: 2,
            name: "Sarah Wijaya",
            nim: "2022010102",
            department: "Sistem Informasi",
            email: "sarah.wijaya@student.univ.ac.id",
            hasDataset: false,
            avatar: "/api/placeholder/50/50"
        },
        {
            id: 3,
            name: "Dr. Budi Santoso, M.Kom",
            nip: "197801012005011001",
            department: "Teknik Informatika",
            email: "budi.santoso@lecturer.univ.ac.id",
            hasDataset: false,
            avatar: "/api/placeholder/50/50"
        },
        {
            id: 4,
            name: "Rina Melati",
            nim: "2020010104",
            department: "Manajemen Informatika",
            email: "rina.melati@student.univ.ac.id",
            hasDataset: true,
            avatar: "/api/placeholder/50/50"
        }
    ];

    // Dummy validation results
    const generateValidationResults = (files) => {
        return files.map((file, index) => ({
            id: index,
            fileName: file.name,
            status: Math.random() > 0.3 ? 'valid' : (Math.random() > 0.5 ? 'warning' : 'error'),
            faceDetected: Math.random() > 0.2,
            quality: Math.floor(Math.random() * 30) + 70,
            issues: Math.random() > 0.7 ? ['Pencahayaan kurang', 'Wajah terlalu kecil'] : [],
            size: Math.floor(Math.random() * 2000) + 500 + 'KB',
            resolution: '1920x1080',
            confidence: Math.floor(Math.random() * 20) + 80
        }));
    };

    const handleFileUpload = (files) => {
        const fileArray = Array.from(files);
        setUploadedFiles(prev => [...prev, ...fileArray]);

        // Generate preview images
        const newPreviews = fileArray.map((file, index) => ({
            id: Date.now() + index,
            file: file,
            url: URL.createObjectURL(file),
            name: file.name,
            size: file.size,
            type: file.type
        }));

        setPreviewImages(prev => [...prev, ...newPreviews]);
        setValidationResults(generateValidationResults(fileArray));
        setShowPreview(true);

        // Simulate upload progress
        fileArray.forEach((file, index) => {
            const fileId = Date.now() + index;
            setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));

            const interval = setInterval(() => {
                setUploadProgress(prev => {
                    const currentProgress = prev[fileId] || 0;
                    if (currentProgress >= 100) {
                        clearInterval(interval);
                        return prev;
                    }
                    return { ...prev, [fileId]: currentProgress + 10 };
                });
            }, 200);
        });
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragActive(false);
        const files = e.dataTransfer.files;
        handleFileUpload(files);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragActive(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragActive(false);
    };

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user' }
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setCameraActive(true);
            }
        } catch (error) {
            console.error('Error accessing camera:', error);
        }
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0);

            canvas.toBlob((blob) => {
                const file = new File([blob], `capture_${Date.now()}.jpg`, { type: 'image/jpeg' });
                handleFileUpload([file]);
            });
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject;
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
            setCameraActive(false);
        }
    };

    const removeImage = (id) => {
        setPreviewImages(prev => prev.filter(img => img.id !== id));
        setUploadedFiles(prev => prev.filter((_, index) => index !== id));
    };

    const startUpload = () => {
        if (!selectedUser || previewImages.length === 0) return;

        setIsUploading(true);

        // Simulate upload process
        setTimeout(() => {
            setIsUploading(false);
            // Show success message
        }, 3000);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'valid': return 'bg-green-100 text-green-800';
            case 'warning': return 'bg-yellow-100 text-yellow-800';
            case 'error': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'valid': return <MdCheckCircle className="w-4 h-4" />;
            case 'warning': return <MdWarning className="w-4 h-4" />;
            case 'error': return <MdError className="w-4 h-4" />;
            default: return <MdInfo className="w-4 h-4" />;
        }
    };

    const tabs = [
        { id: 'single', label: 'Upload Single', icon: MdPerson },
        { id: 'bulk', label: 'Bulk Upload', icon: MdCollections },
        { id: 'camera', label: 'Camera Capture', icon: MdPhotoCamera }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 p-4 md:p-8">
            {/* Header */}
            <div className="mb-8" data-aos="fade-down">
                <div className="flex items-center gap-4 mb-6">
                    <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 p-3 rounded-xl text-white">
                        <MdCloudUpload className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                            Upload Dataset Wajah
                        </h1>
                        <p className="text-gray-600 text-lg">Upload dan kelola dataset wajah untuk sistem pengenalan AI</p>
                    </div>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100" data-aos="fade-up">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium mb-1">Dataset Hari Ini</p>
                            <h3 className="text-3xl font-bold text-gray-800">24</h3>
                            <p className="text-green-600 text-sm">+8 dari kemarin</p>
                        </div>
                        <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-xl text-white">
                            <MdCloudDone className="w-8 h-8" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100" data-aos="fade-up" data-aos-delay="100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium mb-1">Sedang Diproses</p>
                            <h3 className="text-3xl font-bold text-gray-800">5</h3>
                            <p className="text-blue-600 text-sm">Upload aktif</p>
                        </div>                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-xl text-white">
                            <MdSync className="w-8 h-8" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100" data-aos="fade-up" data-aos-delay="200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium mb-1">Kualitas Rata-rata</p>
                            <h3 className="text-3xl font-bold text-gray-800">94%</h3>
                            <p className="text-purple-600 text-sm">Sangat baik</p>
                        </div>
                        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3 rounded-xl text-white">
                            <MdAutoAwesome className="w-8 h-8" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100" data-aos="fade-up" data-aos-delay="300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium mb-1">Error Rate</p>
                            <h3 className="text-3xl font-bold text-gray-800">2.1%</h3>
                            <p className="text-orange-600 text-sm">Perlu perhatian</p>
                        </div>
                        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-3 rounded-xl text-white">
                            <MdError className="w-8 h-8" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white rounded-2xl shadow-lg mb-8 border border-gray-100" data-aos="fade-up">
                <div className="flex flex-wrap border-b border-gray-200">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-4 font-medium transition-all duration-300 ${activeTab === tab.id
                                ? 'text-cyan-600 border-b-2 border-cyan-600 bg-cyan-50'
                                : 'text-gray-600 hover:text-cyan-600 hover:bg-gray-50'
                                }`}
                        >
                            <tab.icon className="w-5 h-5" />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Upload Area */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8" data-aos="fade-up" data-aos-delay="200">
                        {/* User Selection */}
                        <div className="mb-8">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Pilih Pengguna</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {availableUsers.filter(user => !user.hasDataset).map((user) => (
                                    <div
                                        key={user.id}
                                        onClick={() => setSelectedUser(user)}
                                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${selectedUser?.id === user.id
                                            ? 'border-cyan-500 bg-cyan-50'
                                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-800">{user.name}</h4>
                                                <p className="text-sm text-gray-600">{user.nim || user.nip}</p>
                                                <p className="text-xs text-gray-500">{user.department}</p>
                                            </div>
                                            {selectedUser?.id === user.id && (
                                                <MdCheckCircle className="w-6 h-6 text-cyan-600" />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Upload Methods */}
                        {activeTab === 'single' && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-semibold text-gray-800">Upload Foto Wajah</h3>

                                {/* File Upload Area */}
                                <div
                                    className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${dragActive
                                        ? 'border-cyan-500 bg-cyan-50'
                                        : 'border-gray-300 hover:border-cyan-400 hover:bg-gray-50'
                                        }`}
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                >
                                    <MdCloudUpload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <h4 className="text-lg font-semibold text-gray-700 mb-2">
                                        Drop foto disini atau klik untuk upload
                                    </h4>
                                    <p className="text-gray-500 mb-6">
                                        Mendukung JPG, PNG, JPEG (Max: 5MB per file)
                                        <br />
                                        <span className="text-sm">Minimal 5 foto untuk akurasi optimal</span>
                                    </p>
                                    <div className="flex gap-3 justify-center">
                                        <label className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white px-6 py-3 rounded-lg cursor-pointer hover:from-cyan-700 hover:to-cyan-800 transition-all duration-300">
                                            <MdFileUpload className="w-5 h-5" />
                                            Pilih File
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={(e) => handleFileUpload(e.target.files)}
                                                className="hidden"
                                            />
                                        </label>
                                        <button
                                            onClick={startCamera}
                                            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
                                        >
                                            <MdCameraAlt className="w-5 h-5" />
                                            Buka Camera
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'bulk' && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-semibold text-gray-800">Bulk Upload Dataset</h3>

                                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                                    <div className="flex items-start gap-3">
                                        <MdInfo className="w-6 h-6 text-blue-600 mt-1" />
                                        <div>
                                            <h4 className="font-semibold text-blue-800 mb-2">Panduan Bulk Upload</h4>
                                            <ul className="text-blue-700 text-sm space-y-1">
                                                <li>• Buat folder dengan nama NIM/NIP pengguna</li>
                                                <li>• Setiap folder berisi minimal 5 foto wajah</li>
                                                <li>• Format: JPG, PNG, JPEG (Max: 5MB per file)</li>
                                                <li>• Nama file: bebas (contoh: foto1.jpg, selfie.png)</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-cyan-400 hover:bg-gray-50 transition-all duration-300">
                                    <MdCollections className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <h4 className="text-lg font-semibold text-gray-700 mb-2">Upload Multiple Folders</h4>
                                    <p className="text-gray-500 mb-6">Pilih folder yang berisi dataset untuk multiple users</p>
                                    <label className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-lg cursor-pointer hover:from-purple-700 hover:to-purple-800 transition-all duration-300">
                                        <MdFileUpload className="w-5 h-5" />
                                        Pilih Folders
                                        <input
                                            type="file"
                                            multiple
                                            webkitdirectory=""
                                            onChange={(e) => handleFileUpload(e.target.files)}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                            </div>
                        )}

                        {activeTab === 'camera' && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-semibold text-gray-800">Camera Capture</h3>

                                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8">
                                    {!cameraActive ? (
                                        <div className="text-center">
                                            <MdPhotoCamera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                            <h4 className="text-lg font-semibold text-gray-700 mb-2">Real-time Camera Capture</h4>
                                            <p className="text-gray-500 mb-6">Ambil foto langsung menggunakan camera untuk dataset</p>
                                            <button
                                                onClick={startCamera}
                                                className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 flex items-center gap-2 mx-auto"
                                            >
                                                <MdCameraAlt className="w-5 h-5" />
                                                Mulai Camera
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="relative bg-black rounded-xl overflow-hidden">
                                                <video
                                                    ref={videoRef}
                                                    autoPlay
                                                    playsInline
                                                    className="w-full h-64 object-cover"
                                                />
                                                <div className="absolute inset-0 border-2 border-cyan-500 rounded-xl pointer-events-none"></div>
                                            </div>
                                            <div className="flex gap-3 justify-center">
                                                <button
                                                    onClick={capturePhoto}
                                                    className="bg-gradient-to-r from-cyan-600 to-cyan-700 text-white px-6 py-3 rounded-lg hover:from-cyan-700 hover:to-cyan-800 transition-all duration-300 flex items-center gap-2"
                                                >
                                                    <MdPhotoCamera className="w-5 h-5" />
                                                    Capture
                                                </button>
                                                <button
                                                    onClick={stopCamera}
                                                    className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 flex items-center gap-2"
                                                >
                                                    <MdClose className="w-5 h-5" />
                                                    Stop
                                                </button>
                                            </div>
                                            <canvas ref={canvasRef} className="hidden" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar - Settings & Preview */}
                <div className="space-y-6">
                    {/* Upload Settings */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6" data-aos="fade-left">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <MdSettings className="w-5 h-5" />
                            Pengaturan Upload
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-700">Auto Resize</p>
                                    <p className="text-sm text-gray-500">Resize otomatis ke 512x512</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={uploadSettings.autoResize}
                                        onChange={(e) => setUploadSettings({ ...uploadSettings, autoResize: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-700">Face Detection</p>
                                    <p className="text-sm text-gray-500">Deteksi wajah otomatis</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={uploadSettings.faceDetection}
                                        onChange={(e) => setUploadSettings({ ...uploadSettings, faceDetection: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-700">Quality Check</p>
                                    <p className="text-sm text-gray-500">Validasi kualitas gambar</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={uploadSettings.qualityCheck}
                                        onChange={(e) => setUploadSettings({ ...uploadSettings, qualityCheck: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Preview Images */}
                    {previewImages.length > 0 && (
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6" data-aos="fade-left" data-aos-delay="100">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                    <MdVisibility className="w-5 h-5" />
                                    Preview ({previewImages.length})
                                </span>
                                <button
                                    onClick={() => setPreviewImages([])}
                                    className="text-red-600 hover:text-red-700 transition-colors duration-200"
                                >
                                    <MdDeleteSweep className="w-5 h-5" />
                                </button>
                            </h3>

                            <div className="space-y-3 max-h-80 overflow-y-auto">
                                {previewImages.map((image, index) => (
                                    <div key={image.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <img
                                            src={image.url}
                                            alt={image.name}
                                            className="w-12 h-12 object-cover rounded-lg"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-800 truncate">{image.name}</p>
                                            <p className="text-sm text-gray-500">{Math.round(image.size / 1024)} KB</p>
                                        </div>
                                        {validationResults[index] && (
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(validationResults[index].status)}`}>
                                                {getStatusIcon(validationResults[index].status)}
                                                {validationResults[index].status}
                                            </span>
                                        )}
                                        <button
                                            onClick={() => removeImage(image.id)}
                                            className="text-red-600 hover:text-red-700 transition-colors duration-200"
                                        >
                                            <MdDelete className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {selectedUser && previewImages.length > 0 && (
                                <div className="mt-6 pt-4 border-t border-gray-200">
                                    <button
                                        onClick={startUpload}
                                        disabled={isUploading}
                                        className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        {isUploading ? (
                                            <>
                                                <MdRefresh className="w-5 h-5 animate-spin" />
                                                Uploading...
                                            </>
                                        ) : (
                                            <>
                                                <MdCloudUpload className="w-5 h-5" />
                                                Upload Dataset
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Validation Results */}
                    {validationResults.length > 0 && (
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6" data-aos="fade-left" data-aos-delay="200">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <MdImageSearch className="w-5 h-5" />
                                Hasil Validasi
                            </h3>

                            <div className="space-y-3">
                                {validationResults.map((result, index) => (
                                    <div key={result.id} className="p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="font-medium text-gray-800 text-sm truncate">{result.fileName}</p>
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(result.status)}`}>
                                                {getStatusIcon(result.status)}
                                                {result.status}
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray-600 space-y-1">
                                            <p>Wajah: {result.faceDetected ? '✓ Terdeteksi' : '✗ Tidak terdeteksi'}</p>
                                            <p>Kualitas: {result.quality}%</p>
                                            <p>Confidence: {result.confidence}%</p>
                                            {result.issues.length > 0 && (
                                                <div className="text-red-600">
                                                    Issues: {result.issues.join(', ')}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UploadDataset;
