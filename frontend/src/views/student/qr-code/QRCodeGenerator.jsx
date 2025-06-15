import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { MdQrCode, MdRefresh, MdTimer, MdWarning, MdCheckCircle, MdDownload } from "react-icons/md";

const QRCodeGenerator = () => {
    const [qrCode, setQrCode] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isGenerating, setIsGenerating] = useState(false);
    const [currentCourse, setCurrentCourse] = useState('');

    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
        });
    }, []);

    useEffect(() => {
        let interval = null;
        if (timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(timeLeft => timeLeft - 1);
            }, 1000);
        } else if (timeLeft === 0 && qrCode) {
            setQrCode(null);
        }
        return () => clearInterval(interval);
    }, [timeLeft, qrCode]);

    const availableCourses = [
        { id: 'IF301', name: 'Pemrograman Web', schedule: 'Senin, 08:00-10:00' },
        { id: 'IF302', name: 'Database Management', schedule: 'Senin, 10:30-12:30' },
        { id: 'IF303', name: 'Mobile Development', schedule: 'Selasa, 08:00-10:00' },
        { id: 'IF304', name: 'Machine Learning', schedule: 'Rabu, 13:00-15:00' },
        { id: 'IF305', name: 'Software Engineering', schedule: 'Kamis, 08:00-10:00' }
    ];

    const generateQRCode = () => {
        if (!currentCourse) {
            alert('Pilih mata kuliah terlebih dahulu');
            return;
        }

        setIsGenerating(true);

        // Simulate QR code generation
        setTimeout(() => {
            const qrData = {
                studentId: '2021001234',
                studentName: 'John Doe',
                courseId: currentCourse,
                timestamp: new Date().toISOString(),
                validUntil: new Date(Date.now() + 5 * 60 * 1000).toISOString() // 5 minutes
            };

            // Generate a simple QR code placeholder (in real implementation, use a QR library)
            const qrCodeSVG = generateQRCodeSVG(JSON.stringify(qrData));

            setQrCode({
                data: qrData,
                svg: qrCodeSVG
            });
            setTimeLeft(300); // 5 minutes = 300 seconds
            setIsGenerating(false);
        }, 2000);
    };

    const generateQRCodeSVG = (data) => {
        // This is a simplified QR code representation
        // In real implementation, use libraries like qrcode.js or similar
        return `
      <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="white"/>
        <!-- Simplified QR pattern -->
        <g fill="black">
          <!-- Corner markers -->
          <rect x="10" y="10" width="50" height="50"/>
          <rect x="20" y="20" width="30" height="30" fill="white"/>
          <rect x="25" y="25" width="20" height="20"/>
          
          <rect x="140" y="10" width="50" height="50"/>
          <rect x="150" y="20" width="30" height="30" fill="white"/>
          <rect x="155" y="25" width="20" height="20"/>
          
          <rect x="10" y="140" width="50" height="50"/>
          <rect x="20" y="150" width="30" height="30" fill="white"/>
          <rect x="25" y="155" width="20" height="20"/>
          
          <!-- Data pattern (simplified) -->
          ${Array.from({ length: 20 }, (_, i) =>
            Array.from({ length: 20 }, (_, j) =>
                Math.random() > 0.5 ? `<rect x="${70 + j * 5}" y="${70 + i * 5}" width="5" height="5"/>` : ''
            ).join('')
        ).join('')}
        </g>
        <text x="100" y="15" text-anchor="middle" font-size="8" fill="black">ATTENDANCE QR</text>
      </svg>
    `;
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    const downloadQRCode = () => {
        if (!qrCode) return;

        const element = document.createElement('a');
        const file = new Blob([qrCode.svg], { type: 'image/svg+xml' });
        element.href = URL.createObjectURL(file);
        element.download = `qr-code-${currentCourse}-${new Date().getTime()}.svg`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            {/* Header */}
            <div className="mb-8" data-aos="fade-down">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    QR Code Absensi
                </h1>
                <p className="text-gray-600">
                    Generate QR Code untuk absensi manual ketika face recognition tidak tersedia
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2">
                    {/* Course Selection */}
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-8" data-aos="fade-up">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Pilih Mata Kuliah</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {availableCourses.map((course) => (
                                <button
                                    key={course.id}
                                    onClick={() => setCurrentCourse(course.id)}
                                    className={`p-4 border-2 rounded-lg text-left transition-all duration-200 ${currentCourse === course.id
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <h4 className={`font-semibold ${currentCourse === course.id ? 'text-blue-800' : 'text-gray-800'
                                        }`}>
                                        {course.name}
                                    </h4>
                                    <p className={`text-sm ${currentCourse === course.id ? 'text-blue-600' : 'text-gray-600'
                                        }`}>
                                        {course.id} - {course.schedule}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* QR Code Display */}
                    <div className="bg-white rounded-xl shadow-lg p-6" data-aos="fade-up" data-aos-delay="200">
                        <div className="text-center">
                            {!qrCode && !isGenerating && (
                                <div className="py-16">
                                    <MdQrCode className="h-24 w-24 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                        QR Code Belum Dibuat
                                    </h3>
                                    <p className="text-gray-500 mb-6">
                                        Pilih mata kuliah dan klik tombol "Generate QR Code"
                                    </p>
                                    <button
                                        onClick={generateQRCode}
                                        disabled={!currentCourse}
                                        className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center mx-auto"
                                    >
                                        <MdQrCode className="h-5 w-5 mr-2" />
                                        Generate QR Code
                                    </button>
                                </div>
                            )}

                            {isGenerating && (
                                <div className="py-16">
                                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
                                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                        Membuat QR Code...
                                    </h3>
                                    <p className="text-gray-500">
                                        Mohon tunggu sebentar
                                    </p>
                                </div>
                            )}

                            {qrCode && !isGenerating && (
                                <div>
                                    <div className="bg-white p-8 rounded-xl border-2 border-gray-200 inline-block mb-6">
                                        <div dangerouslySetInnerHTML={{ __html: qrCode.svg }} />
                                    </div>

                                    <div className="flex items-center justify-center mb-6">
                                        <MdTimer className="h-5 w-5 text-orange-500 mr-2" />
                                        <span className="text-lg font-semibold text-orange-600">
                                            Berlaku: {formatTime(timeLeft)}
                                        </span>
                                    </div>

                                    <div className="flex justify-center space-x-4 mb-6">
                                        <button
                                            onClick={generateQRCode}
                                            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center"
                                        >
                                            <MdRefresh className="h-5 w-5 mr-2" />
                                            Generate Ulang
                                        </button>
                                        <button
                                            onClick={downloadQRCode}
                                            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center"
                                        >
                                            <MdDownload className="h-5 w-5 mr-2" />
                                            Download
                                        </button>
                                    </div>

                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                        <div className="flex items-center mb-2">
                                            <MdCheckCircle className="h-5 w-5 text-green-600 mr-2" />
                                            <span className="font-medium text-green-800">QR Code Siap Digunakan</span>
                                        </div>
                                        <p className="text-sm text-green-700">
                                            Tunjukkan QR Code ini ke scanner absensi di ruang kelas
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Instructions */}
                    <div className="bg-white rounded-xl shadow-lg p-6" data-aos="fade-left">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Cara Penggunaan</h3>

                        <div className="space-y-4">
                            <div className="flex">
                                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm mr-3">
                                    1
                                </div>
                                <div>
                                    <p className="font-medium text-gray-800">Pilih Mata Kuliah</p>
                                    <p className="text-sm text-gray-600">Pilih mata kuliah yang sedang berlangsung</p>
                                </div>
                            </div>

                            <div className="flex">
                                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm mr-3">
                                    2
                                </div>
                                <div>
                                    <p className="font-medium text-gray-800">Generate QR Code</p>
                                    <p className="text-sm text-gray-600">Klik tombol untuk membuat QR Code baru</p>
                                </div>
                            </div>

                            <div className="flex">
                                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm mr-3">
                                    3
                                </div>
                                <div>
                                    <p className="font-medium text-gray-800">Scan di Kelas</p>
                                    <p className="text-sm text-gray-600">Tunjukkan QR Code ke scanner di ruang kelas</p>
                                </div>
                            </div>

                            <div className="flex">
                                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm mr-3">
                                    4
                                </div>
                                <div>
                                    <p className="font-medium text-gray-800">Konfirmasi</p>
                                    <p className="text-sm text-gray-600">Tunggu konfirmasi keberhasilan absensi</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Important Notes */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6" data-aos="fade-left" data-aos-delay="200">
                        <div className="flex items-start">
                            <MdWarning className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                            <div>
                                <h4 className="font-medium text-yellow-800 mb-2">Penting!</h4>
                                <ul className="text-sm text-yellow-700 space-y-1">
                                    <li>• QR Code berlaku selama 5 menit</li>
                                    <li>• Gunakan hanya untuk keadaan darurat</li>
                                    <li>• Face recognition tetap metode utama</li>
                                    <li>• Satu QR Code hanya untuk satu kali absensi</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white rounded-xl shadow-lg p-6" data-aos="fade-left" data-aos-delay="300">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Aktivitas Terakhir</h3>

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">QR Code dibuat</span>
                                <span className="font-medium">2 kali hari ini</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Absensi berhasil</span>
                                <span className="font-medium text-green-600">1 kali</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Terakhir digunakan</span>
                                <span className="font-medium">2 jam lalu</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QRCodeGenerator;
