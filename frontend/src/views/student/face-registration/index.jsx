import React, { useEffect, useState, useRef } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { MdCameraAlt, MdUpload, MdRefresh, MdCheckCircle, MdWarning, MdInfo } from "react-icons/md";

const FaceRegistration = () => {
    const [step, setStep] = useState(1);
    const [capturedImages, setCapturedImages] = useState([]);
    const [isCapturing, setIsCapturing] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
        });
    }, []);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: 640,
                    height: 480,
                    facingMode: 'user'
                }
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setIsCapturing(true);
        } catch (error) {
            console.error('Error accessing camera:', error);
            alert('Tidak dapat mengakses kamera. Pastikan izin kamera telah diberikan.');
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        setIsCapturing(false);
    };

    const captureImage = () => {
        if (videoRef.current && canvasRef.current) {
            const canvas = canvasRef.current;
            const video = videoRef.current;
            const context = canvas.getContext('2d');

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0);

            const imageData = canvas.toDataURL('image/jpeg', 0.8);
            setCapturedImages(prev => [...prev, {
                id: Date.now(),
                data: imageData,
                timestamp: new Date().toLocaleString()
            }]);
        }
    };

    const removeImage = (id) => {
        setCapturedImages(prev => prev.filter(img => img.id !== id));
    };

    const uploadImages = () => {
        if (capturedImages.length < 5) {
            alert('Minimal 5 foto diperlukan untuk dataset yang optimal');
            return;
        }

        setStep(3);

        // Simulate upload progress
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            setUploadProgress(progress);

            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => setStep(4), 1000);
            }
        }, 200);
    };

    const resetProcess = () => {
        setStep(1);
        setCapturedImages([]);
        setUploadProgress(0);
        stopCamera();
    };

    const instructions = [
        "Pastikan wajah Anda dalam kondisi pencahayaan yang baik",
        "Lepaskan kacamata atau aksesoris yang menutupi wajah",
        "Ambil foto dari berbagai sudut (depan, kiri, kanan)",
        "Pastikan ekspresi wajah natural dan mata terbuka",
        "Minimal 5 foto untuk hasil optimal"
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            {/* Header */}
            <div className="mb-8" data-aos="fade-down">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Registrasi Wajah
                </h1>
                <p className="text-gray-600">
                    Daftarkan wajah Anda untuk sistem absensi otomatis
                </p>
            </div>

            {/* Progress Steps */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8" data-aos="fade-up">
                <div className="flex items-center justify-between mb-6">
                    {[1, 2, 3, 4].map((stepNumber) => (
                        <div key={stepNumber} className="flex items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= stepNumber
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-500'
                                }`}>
                                {step > stepNumber ? <MdCheckCircle className="h-6 w-6" /> : stepNumber}
                            </div>
                            {stepNumber < 4 && (
                                <div className={`w-16 h-1 mx-2 transition-all ${step > stepNumber ? 'bg-blue-500' : 'bg-gray-200'
                                    }`}></div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-800">
                        {step === 1 && "Persiapan"}
                        {step === 2 && "Pengambilan Foto"}
                        {step === 3 && "Upload Dataset"}
                        {step === 4 && "Selesai"}
                    </h3>
                </div>
            </div>

            {/* Step Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2">
                    {step === 1 && (
                        <div className="bg-white rounded-xl shadow-lg p-6" data-aos="fade-up">
                            <h3 className="text-xl font-semibold text-gray-800 mb-6">Petunjuk Registrasi Wajah</h3>

                            <div className="space-y-4 mb-8">
                                {instructions.map((instruction, index) => (
                                    <div key={index} className="flex items-start">
                                        <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                                            {index + 1}
                                        </div>
                                        <p className="text-gray-600">{instruction}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                                <div className="flex items-start">
                                    <MdWarning className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-yellow-800">Penting!</p>
                                        <p className="text-sm text-yellow-700">
                                            Data wajah akan digunakan untuk sistem keamanan. Pastikan hanya Anda yang mengambil foto ini.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setStep(2)}
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center"
                            >
                                <MdCameraAlt className="h-5 w-5 mr-2" />
                                Mulai Pengambilan Foto
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="bg-white rounded-xl shadow-lg p-6" data-aos="fade-up">
                            <h3 className="text-xl font-semibold text-gray-800 mb-6">Pengambilan Foto Wajah</h3>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Camera Section */}
                                <div>
                                    <div className="relative bg-gray-900 rounded-lg overflow-hidden mb-4" style={{ aspectRatio: '4/3' }}>
                                        {isCapturing ? (
                                            <video
                                                ref={videoRef}
                                                autoPlay
                                                playsInline
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-white">
                                                <div className="text-center">
                                                    <MdCameraAlt className="h-16 w-16 mx-auto mb-4 opacity-50" />
                                                    <p>Kamera Tidak Aktif</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Face Detection Overlay */}
                                        {isCapturing && (
                                            <div className="absolute inset-0 pointer-events-none">
                                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-green-400 rounded-full opacity-70"></div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        {!isCapturing ? (
                                            <button
                                                onClick={startCamera}
                                                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                                            >
                                                <MdCameraAlt className="h-5 w-5 mr-2" />
                                                Aktifkan Kamera
                                            </button>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={captureImage}
                                                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                                                >
                                                    <MdCameraAlt className="h-5 w-5 mr-2" />
                                                    Ambil Foto
                                                </button>
                                                <button
                                                    onClick={stopCamera}
                                                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                                                >
                                                    Stop
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Captured Images */}
                                <div>
                                    <h4 className="font-medium text-gray-800 mb-4">
                                        Foto Tersimpan ({capturedImages.length}/5)
                                    </h4>
                                    <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                                        {capturedImages.map((image) => (
                                            <div key={image.id} className="relative group">
                                                <img
                                                    src={image.data}
                                                    alt="Captured face"
                                                    className="w-full aspect-square object-cover rounded-lg"
                                                />
                                                <button
                                                    onClick={() => removeImage(image.id)}
                                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    {capturedImages.length >= 5 && (
                                        <button
                                            onClick={uploadImages}
                                            className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                                        >
                                            <MdUpload className="h-5 w-5 mr-2" />
                                            Upload Dataset
                                        </button>
                                    )}
                                </div>
                            </div>

                            <canvas ref={canvasRef} className="hidden" />
                        </div>
                    )}

                    {step === 3 && (
                        <div className="bg-white rounded-xl shadow-lg p-6" data-aos="fade-up">
                            <h3 className="text-xl font-semibold text-gray-800 mb-6">Mengupload Dataset</h3>

                            <div className="text-center py-8">
                                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <MdUpload className="h-12 w-12 text-blue-500" />
                                </div>

                                <h4 className="text-lg font-medium text-gray-800 mb-2">
                                    Sedang Memproses Dataset...
                                </h4>
                                <p className="text-gray-600 mb-6">
                                    Mohon tunggu, sistem sedang memproses {capturedImages.length} foto wajah Anda
                                </p>

                                <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                                    <div
                                        className="bg-blue-500 h-4 rounded-full transition-all duration-300"
                                        style={{ width: `${uploadProgress}%` }}
                                    ></div>
                                </div>
                                <p className="text-sm text-gray-600">{uploadProgress}% selesai</p>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="bg-white rounded-xl shadow-lg p-6" data-aos="fade-up">
                            <div className="text-center py-8">
                                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <MdCheckCircle className="h-12 w-12 text-green-500" />
                                </div>

                                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                    Registrasi Berhasil!
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Dataset wajah Anda telah berhasil diupload dan siap digunakan untuk sistem absensi
                                </p>

                                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                                    <p className="text-sm text-green-800">
                                        <strong>Dataset ID:</strong> FACE_{new Date().getTime()}<br />
                                        <strong>Jumlah Foto:</strong> {capturedImages.length}<br />
                                        <strong>Status:</strong> Aktif
                                    </p>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={resetProcess}
                                        className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                                    >
                                        <MdRefresh className="h-5 w-5 mr-2" />
                                        Registrasi Ulang
                                    </button>
                                    <button
                                        onClick={() => window.history.back()}
                                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                                    >
                                        Kembali ke Dashboard
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Current Dataset Info */}
                    <div className="bg-white rounded-xl shadow-lg p-6" data-aos="fade-left">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Dataset Saat Ini</h3>

                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Status</span>
                                <span className="font-medium text-green-600">Aktif</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Terakhir Update</span>
                                <span className="font-medium">15 Jan 2024</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Jumlah Foto</span>
                                <span className="font-medium">8 foto</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Akurasi</span>
                                <span className="font-medium text-green-600">95.2%</span>
                            </div>
                        </div>
                    </div>

                    {/* Tips */}
                    <div className="bg-white rounded-xl shadow-lg p-6" data-aos="fade-left" data-aos-delay="200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Tips Registrasi</h3>

                        <div className="space-y-3">
                            <div className="flex items-start">
                                <MdInfo className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                                <p className="text-sm text-gray-600">
                                    Ambil foto dalam kondisi pencahayaan yang berbeda
                                </p>
                            </div>
                            <div className="flex items-start">
                                <MdInfo className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                                <p className="text-sm text-gray-600">
                                    Variasikan sudut wajah (depan, kiri, kanan)
                                </p>
                            </div>
                            <div className="flex items-start">
                                <MdInfo className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                                <p className="text-sm text-gray-600">
                                    Pastikan wajah terlihat jelas tanpa bayangan
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FaceRegistration;
