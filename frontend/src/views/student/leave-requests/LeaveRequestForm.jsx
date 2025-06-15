import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { MdLocalHospital, MdUpload, MdSend, MdCalendarToday, MdDescription, MdAttachFile } from "react-icons/md";

const LeaveRequestForm = () => {
    const [formData, setFormData] = useState({
        type: 'sick',
        startDate: '',
        endDate: '',
        reason: '',
        description: '',
        attachments: []
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
        });
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        setFormData(prev => ({
            ...prev,
            attachments: [...prev.attachments, ...files]
        }));
    };

    const removeAttachment = (index) => {
        setFormData(prev => ({
            ...prev,
            attachments: prev.attachments.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        setTimeout(() => {
            alert('Pengajuan izin berhasil dikirim! Status akan diupdate dalam 1-2 hari kerja.');
            setFormData({
                type: 'sick',
                startDate: '',
                endDate: '',
                reason: '',
                description: '',
                attachments: []
            });
            setIsSubmitting(false);
        }, 2000);
    };

    const leaveTypes = [
        { value: 'sick', label: 'Sakit', icon: MdLocalHospital, color: 'red' },
        { value: 'family', label: 'Urusan Keluarga', icon: MdCalendarToday, color: 'blue' },
        { value: 'personal', label: 'Keperluan Pribadi', icon: MdDescription, color: 'green' },
        { value: 'emergency', label: 'Darurat', icon: MdLocalHospital, color: 'orange' }
    ];

    const getTypeInfo = (type) => {
        return leaveTypes.find(t => t.value === type) || leaveTypes[0];
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            {/* Header */}
            <div className="mb-8" data-aos="fade-down">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Pengajuan Izin/Sakit
                </h1>
                <p className="text-gray-600">
                    Ajukan permohonan izin tidak masuk perkuliahan
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Form */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-lg p-6" data-aos="fade-up">
                        <h3 className="text-xl font-semibold text-gray-800 mb-6">Form Pengajuan</h3>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Leave Type Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Jenis Izin
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {leaveTypes.map((type) => (
                                        <button
                                            key={type.value}
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                                            className={`p-4 rounded-lg border-2 transition-all duration-200 ${formData.type === type.value
                                                    ? `border-${type.color}-500 bg-${type.color}-50`
                                                    : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <type.icon className={`h-8 w-8 mx-auto mb-2 ${formData.type === type.value ? `text-${type.color}-600` : 'text-gray-400'
                                                }`} />
                                            <span className={`text-sm font-medium ${formData.type === type.value ? `text-${type.color}-800` : 'text-gray-600'
                                                }`}>
                                                {type.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Date Range */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tanggal Mulai
                                    </label>
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tanggal Selesai
                                    </label>
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* Reason */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Alasan Singkat
                                </label>
                                <input
                                    type="text"
                                    name="reason"
                                    value={formData.reason}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Contoh: Demam tinggi, Acara keluarga, dll"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Keterangan Detail
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    required
                                    rows={4}
                                    placeholder="Jelaskan secara detail alasan izin Anda..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* File Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Dokumen Pendukung
                                    {formData.type === 'sick' && <span className="text-red-500 ml-1">*</span>}
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                                    <input
                                        type="file"
                                        multiple
                                        onChange={handleFileUpload}
                                        className="hidden"
                                        id="file-upload"
                                        accept="image/*,.pdf,.doc,.docx"
                                    />
                                    <label
                                        htmlFor="file-upload"
                                        className="cursor-pointer flex flex-col items-center justify-center"
                                    >
                                        <MdAttachFile className="h-12 w-12 text-gray-400 mb-4" />
                                        <span className="text-lg font-medium text-gray-700 mb-2">
                                            Upload Dokumen
                                        </span>
                                        <span className="text-sm text-gray-500 text-center">
                                            {formData.type === 'sick'
                                                ? 'Surat keterangan dokter wajib untuk izin sakit'
                                                : 'Dokumen pendukung (opsional)'
                                            }
                                        </span>
                                        <span className="text-xs text-gray-400 mt-2">
                                            Format: JPG, PNG, PDF, DOC (Max. 5MB per file)
                                        </span>
                                    </label>
                                </div>

                                {formData.attachments.length > 0 && (
                                    <div className="mt-4 space-y-2">
                                        <h4 className="font-medium text-gray-700">File Terupload:</h4>
                                        {formData.attachments.map((file, index) => (
                                            <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                                                <div className="flex items-center">
                                                    <MdAttachFile className="h-5 w-5 text-gray-400 mr-2" />
                                                    <span className="text-sm text-gray-700">{file.name}</span>
                                                    <span className="text-xs text-gray-500 ml-2">
                                                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                                    </span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeAttachment(index)}
                                                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                                                >
                                                    Hapus
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting || (formData.type === 'sick' && formData.attachments.length === 0)}
                                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        Mengirim Pengajuan...
                                    </>
                                ) : (
                                    <>
                                        <MdSend className="h-5 w-5 mr-2" />
                                        Kirim Pengajuan
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Guidelines */}
                    <div className="bg-white rounded-xl shadow-lg p-6" data-aos="fade-left">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Panduan Pengajuan</h3>

                        <div className="space-y-4">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h4 className="font-medium text-blue-800 mb-2">Persyaratan Umum</h4>
                                <ul className="text-sm text-blue-700 space-y-1">
                                    <li>• Pengajuan maksimal 3 hari sebelum tanggal izin</li>
                                    <li>• Untuk keadaan darurat, hubungi dosen langsung</li>
                                    <li>• Pastikan alasan jelas dan detail</li>
                                </ul>
                            </div>

                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <h4 className="font-medium text-red-800 mb-2">Khusus Izin Sakit</h4>
                                <ul className="text-sm text-red-700 space-y-1">
                                    <li>• Wajib melampirkan surat keterangan dokter</li>
                                    <li>• Surat dari dokter/rumah sakit resmi</li>
                                    <li>• Format PDF atau foto yang jelas</li>
                                </ul>
                            </div>

                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <h4 className="font-medium text-green-800 mb-2">Proses Persetujuan</h4>
                                <ul className="text-sm text-green-700 space-y-1">
                                    <li>• Review oleh dosen: 1-2 hari kerja</li>
                                    <li>• Notifikasi via email dan aplikasi</li>
                                    <li>• Status dapat dilihat di riwayat pengajuan</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-white rounded-xl shadow-lg p-6" data-aos="fade-left" data-aos-delay="200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Statistik Izin</h3>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Izin Semester Ini</span>
                                <span className="font-bold text-blue-600">3</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Pengajuan Pending</span>
                                <span className="font-bold text-yellow-600">1</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Sisa Kuota Izin</span>
                                <span className="font-bold text-green-600">2</span>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <p className="text-xs text-gray-500">
                                Maksimal 5 kali izin per semester sesuai aturan akademik
                            </p>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4" data-aos="fade-left" data-aos-delay="300">
                        <h4 className="font-medium text-yellow-800 mb-2">Butuh Bantuan?</h4>
                        <p className="text-sm text-yellow-700 mb-3">
                            Untuk keadaan darurat atau pertanyaan pengajuan, hubungi:
                        </p>
                        <div className="text-sm text-yellow-800">
                            <p>📧 akademik@university.ac.id</p>
                            <p>📞 (021) 1234-5678</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeaveRequestForm;
