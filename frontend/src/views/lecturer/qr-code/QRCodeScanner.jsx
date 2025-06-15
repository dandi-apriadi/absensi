import React, { useState, useEffect, useRef } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Card from "components/card";
import {
    MdQrCode,
    MdCameraAlt,
    MdRefresh,
    MdFlashOn,
    MdFlashOff,
    MdLightbulbOutline,
    MdCheck,
    MdDevices,
    MdInfo,
    MdCameraswitch
} from "react-icons/md";

const QRCodeScanner = () => {
    const [scanning, setScanning] = useState(false);
    const [scannedData, setScannedData] = useState(null);
    const [cameraPermission, setCameraPermission] = useState(false);
    const [cameraList, setCameraList] = useState([]);
    const [selectedCamera, setSelectedCamera] = useState(null);
    const [torchEnabled, setTorchEnabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);

    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: "ease-in-out",
            once: true,
        });
    }, []);

    useEffect(() => {
        // List available cameras
        if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
            navigator.mediaDevices.enumerateDevices()
                .then(devices => {
                    const cameras = devices.filter(device => device.kind === 'videoinput');
                    setCameraList(cameras);
                    if (cameras.length > 0) {
                        setSelectedCamera(cameras[0].deviceId);
                    }
                })
                .catch(error => {
                    console.error("Error listing cameras:", error);
                });
        }
    }, []);

    // Start scanning
    const startScanner = async () => {
        setIsLoading(true);

        try {
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                if (streamRef.current) {
                    streamRef.current.getTracks().forEach(track => track.stop());
                }

                const constraints = {
                    video: {
                        deviceId: selectedCamera ? { exact: selectedCamera } : undefined,
                    }
                };

                const stream = await navigator.mediaDevices.getUserMedia(constraints);
                streamRef.current = stream;

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.play();
                }

                setCameraPermission(true);
                setScanning(true);

                // Simulate QR code scanning (in a real app, you'd use a library like jsQR)
                simulateScanning();
            } else {
                alert("Your browser does not support camera access.");
                setCameraPermission(false);
            }
        } catch (error) {
            console.error("Error accessing camera:", error);
            alert("Could not access the camera. Please make sure camera permissions are enabled.");
            setCameraPermission(false);
        }

        setIsLoading(false);
    };

    // Stop scanning
    const stopScanner = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setScanning(false);
    };

    // Toggle torch/flashlight
    const toggleTorch = () => {
        if (streamRef.current) {
            const track = streamRef.current.getVideoTracks()[0];
            if (track && track.getCapabilities && track.getCapabilities().torch) {
                track.applyConstraints({
                    advanced: [{ torch: !torchEnabled }]
                }).then(() => {
                    setTorchEnabled(!torchEnabled);
                }).catch(err => {
                    console.error("Error toggling torch:", err);
                    alert("Could not toggle flashlight");
                });
            } else {
                alert("Your device does not support flashlight control");
            }
        }
    };

    // Change camera
    const changeCamera = (deviceId) => {
        setSelectedCamera(deviceId);

        if (scanning) {
            stopScanner();
            setTimeout(() => {
                startScanner();
            }, 300);
        }
    };

    // Simulate QR code scanning (for demo purposes)
    const simulateScanning = () => {
        setTimeout(() => {
            const randomStudent = [
                { nim: "20210001", name: "Budi Santoso", course: "Algoritma dan Pemrograman" },
                { nim: "20210002", name: "Siti Nuraini", course: "Basis Data" },
                { nim: "20210003", name: "Ahmad Rizki", course: "Pemrograman Web" }
            ][Math.floor(Math.random() * 3)];

            setScannedData(randomStudent);
            setScanning(false);
        }, 3000);
    };

    // Reset scanner
    const resetScanner = () => {
        setScannedData(null);
        startScanner();
    };

    return (
        <div className="mt-3">
            <div className="mb-5" data-aos="fade-down">
                <h1 className="text-3xl font-bold text-navy-700 dark:text-white">
                    QR Code Scanner
                </h1>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Pindai QR Code untuk verifikasi kehadiran
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <Card extra="p-5 lg:col-span-2" data-aos="fade-up">
                    <div className="mb-4 flex items-center justify-between">
                        <h4 className="text-lg font-bold text-navy-700 dark:text-white">
                            Pemindai QR Code
                        </h4>

                        <div>
                            {scanning ? (
                                <button
                                    onClick={stopScanner}
                                    className="py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    Hentikan Pemindaian
                                </button>
                            ) : scannedData ? (
                                <button
                                    onClick={resetScanner}
                                    className="py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                                >
                                    <MdRefresh className="mr-2" /> Pindai Lagi
                                </button>
                            ) : (
                                <button
                                    onClick={startScanner}
                                    disabled={isLoading}
                                    className={`py-2 px-4 rounded-lg flex items-center ${isLoading ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-indigo-600 text-white hover:bg-indigo-700"
                                        }`}
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                                            Memulai...
                                        </>
                                    ) : (
                                        <>
                                            <MdQrCode className="mr-2" /> Mulai Pemindaian
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>

                    {cameraList.length > 1 && (
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Kamera</label>
                            <select
                                className="w-full rounded-lg border border-gray-300 p-2 text-sm outline-none focus:border-indigo-500"
                                value={selectedCamera}
                                onChange={(e) => changeCamera(e.target.value)}
                            >
                                {cameraList.map((camera, index) => (
                                    <option key={camera.deviceId} value={camera.deviceId}>
                                        Kamera {index + 1} - {camera.label || `Camera ${index + 1}`}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="relative">
                        {/* Scanner View */}
                        <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center">
                            {scanning ? (
                                <>
                                    <video
                                        ref={videoRef}
                                        className="w-full h-full object-cover"
                                        playsInline
                                        muted
                                    ></video>
                                    <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                                        <div className="animate-pulse bg-green-500 w-3 h-3 rounded-full"></div>
                                        {streamRef.current && streamRef.current.getVideoTracks()[0].getCapabilities().torch && (
                                            <button
                                                onClick={toggleTorch}
                                                className="p-2 bg-gray-800 bg-opacity-70 text-white rounded-lg"
                                            >
                                                {torchEnabled ? <MdFlashOn className="h-5 w-5" /> : <MdFlashOff className="h-5 w-5" />}
                                            </button>
                                        )}
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="border-2 border-indigo-500 w-64 h-64 rounded-lg opacity-60"></div>
                                    </div>
                                </>
                            ) : scannedData ? (
                                <div className="w-full h-full flex flex-col items-center justify-center p-6">
                                    <div className="p-3 bg-green-100 text-green-700 rounded-full mb-4">
                                        <MdCheck className="h-12 w-12" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-1">QR Code Berhasil Dipindai</h3>
                                    <p className="text-gray-300 mb-6 text-center">Informasi mahasiswa berhasil terverifikasi</p>
                                    <div className="bg-gray-800 p-4 rounded-lg w-full max-w-md text-center">
                                        <p className="text-lg font-bold text-white mb-1">{scannedData.name}</p>
                                        <p className="text-gray-300 mb-1">{scannedData.nim}</p>
                                        <p className="text-gray-400 text-sm">{scannedData.course}</p>
                                        <div className="flex justify-center mt-4">
                                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                                Terverifikasi
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ) : !cameraPermission ? (
                                <div className="flex flex-col items-center justify-center p-6">
                                    <MdDevices className="h-16 w-16 text-gray-500 mb-4" />
                                    <h3 className="text-xl font-bold text-gray-400 mb-2">Izin Kamera Diperlukan</h3>
                                    <p className="text-gray-500 mb-6 text-center">
                                        Aplikasi memerlukan akses ke kamera untuk memindai QR Code. Klik tombol di atas untuk memulai.
                                    </p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center p-6">
                                    <MdQrCode className="h-16 w-16 text-gray-500 mb-4" />
                                    <h3 className="text-xl font-bold text-gray-400 mb-2">Siap Memindai</h3>
                                    <p className="text-gray-500 text-center">
                                        Klik tombol "Mulai Pemindaian" untuk memulai pemindai QR Code.
                                    </p>
                                </div>
                            )}
                        </div>
                        <canvas ref={canvasRef} className="hidden"></canvas>
                    </div>

                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-start">
                            <MdLightbulbOutline className="text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                            <p className="text-sm text-blue-700">
                                Arahkan kamera ke QR Code yang ditampilkan pada perangkat mahasiswa. QR Code akan dipindai secara otomatis.
                                Pastikan QR Code terlihat jelas dan pencahayaan cukup.
                            </p>
                        </div>
                    </div>
                </Card>

                <Card extra="p-5" data-aos="fade-up" data-aos-delay="100">
                    <div className="mb-4">
                        <h4 className="text-lg font-bold text-navy-700 dark:text-white">
                            Panduan Pemindaian
                        </h4>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h5 className="text-base font-medium mb-2 flex items-center">
                                <div className="rounded-full bg-indigo-100 p-1 mr-2">
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white text-xs">1</span>
                                </div>
                                Mulai Pemindaian
                            </h5>
                            <p className="text-sm text-gray-600 ml-10">
                                Klik tombol "Mulai Pemindaian" untuk mengaktifkan kamera. Berikan izin akses kamera jika diminta oleh browser.
                            </p>
                        </div>

                        <div>
                            <h5 className="text-base font-medium mb-2 flex items-center">
                                <div className="rounded-full bg-indigo-100 p-1 mr-2">
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white text-xs">2</span>
                                </div>
                                Arahkan Kamera
                            </h5>
                            <p className="text-sm text-gray-600 ml-10">
                                Arahkan kamera ke QR Code yang ditampilkan pada perangkat mahasiswa. Pastikan QR Code terlihat jelas dalam bingkai.
                            </p>
                        </div>

                        <div>
                            <h5 className="text-base font-medium mb-2 flex items-center">
                                <div className="rounded-full bg-indigo-100 p-1 mr-2">
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white text-xs">3</span>
                                </div>
                                Verifikasi Hasil
                            </h5>
                            <p className="text-sm text-gray-600 ml-10">
                                Setelah QR Code berhasil dipindai, data mahasiswa akan ditampilkan. Verifikasi bahwa data tersebut sesuai.
                            </p>
                        </div>

                        <div>
                            <h5 className="text-base font-medium mb-2 flex items-center">
                                <div className="rounded-full bg-indigo-100 p-1 mr-2">
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white text-xs">4</span>
                                </div>
                                Pindai Kembali
                            </h5>
                            <p className="text-sm text-gray-600 ml-10">
                                Klik tombol "Pindai Lagi" untuk memindai QR Code mahasiswa berikutnya.
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                        <div className="flex items-start">
                            <MdInfo className="text-yellow-600 mt-0.5 mr-2" />
                            <div>
                                <h5 className="text-sm font-medium text-yellow-800 mb-1">Catatan</h5>
                                <p className="text-xs text-yellow-700">
                                    QR Code unik diberikan kepada setiap mahasiswa dan hanya berlaku untuk satu kali sesi absensi.
                                    Sistem secara otomatis mencatat waktu kehadiran mahasiswa.
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default QRCodeScanner;