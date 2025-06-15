import React, { useState } from "react";
import { MdEmail, MdPhone, MdLocationOn, MdSend, MdAttachFile, MdBugReport, MdHelp, MdFeedback } from "react-icons/md";

const ContactSupport = () => {
    const [formData, setFormData] = useState({
        subject: '',
        category: 'technical',
        priority: 'medium',
        message: '',
        attachments: []
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

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
            alert('Tiket support berhasil dikirim! Tim kami akan merespons dalam 24 jam.');
            setFormData({
                subject: '',
                category: 'technical',
                priority: 'medium',
                message: '',
                attachments: []
            });
            setIsSubmitting(false);
        }, 2000);
    };

    const supportChannels = [
        {
            icon: MdEmail,
            title: 'Email Support',
            value: 'support@university.ac.id',
            description: 'Respon dalam 24 jam',
            color: 'blue'
        },
        {
            icon: MdPhone,
            title: 'Telepon',
            value: '+62 21 1234-5678',
            description: 'Sen-Jum 08:00-17:00',
            color: 'green'
        },
        {
            icon: MdLocationOn,
            title: 'Lokasi',
            value: 'Gedung IT Lt. 2',
            description: 'Kampus Utama',
            color: 'purple'
        }
    ];

    const quickIssues = [
        {
            icon: MdBugReport,
            title: 'Laporkan Bug',
            description: 'Laporkan masalah teknis atau error',
            category: 'technical'
        },
        {
            icon: MdHelp,
            title: 'Bantuan Umum',
            description: 'Pertanyaan seputar penggunaan sistem',
            category: 'general'
        },
        {
            icon: MdFeedback,
            title: 'Saran & Masukan',
            description: 'Berikan feedback untuk perbaikan sistem',
            category: 'feedback'
        }
    ];

    return (
        <div className="p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Hubungi Support</h3>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Contact Form */}
                <div className="lg:col-span-2">
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h4 className="text-xl font-semibold text-gray-800 mb-6">Kirim Tiket Support</h4>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Subjek
                                </label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Jelaskan masalah Anda secara singkat"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Kategori
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="technical">Masalah Teknis</option>
                                        <option value="account">Akun & Login</option>
                                        <option value="attendance">Masalah Absensi</option>
                                        <option value="general">Pertanyaan Umum</option>
                                        <option value="feedback">Saran & Masukan</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Prioritas
                                    </label>
                                    <select
                                        name="priority"
                                        value={formData.priority}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="low">Rendah</option>
                                        <option value="medium">Sedang</option>
                                        <option value="high">Tinggi</option>
                                        <option value="urgent">Mendesak</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Deskripsi Masalah
                                </label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    required
                                    rows={6}
                                    placeholder="Jelaskan masalah Anda dengan detail. Sertakan langkah-langkah yang telah dilakukan dan pesan error jika ada."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Lampiran (Opsional)
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
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
                                        <MdAttachFile className="h-8 w-8 text-gray-400 mb-2" />
                                        <span className="text-sm text-gray-600">
                                            Klik untuk upload file atau drag & drop
                                        </span>
                                        <span className="text-xs text-gray-500 mt-1">
                                            Format: JPG, PNG, PDF, DOC (Max. 10MB)
                                        </span>
                                    </label>
                                </div>

                                {formData.attachments.length > 0 && (
                                    <div className="mt-3 space-y-2">
                                        {formData.attachments.map((file, index) => (
                                            <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                                <span className="text-sm text-gray-700">{file.name}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeAttachment(index)}
                                                    className="text-red-500 hover:text-red-700 text-sm"
                                                >
                                                    Hapus
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        Mengirim...
                                    </>
                                ) : (
                                    <>
                                        <MdSend className="h-5 w-5 mr-2" />
                                        Kirim Tiket
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Contact Info */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">Kontak Langsung</h4>
                        <div className="space-y-4">
                            {supportChannels.map((channel, index) => (
                                <div key={index} className="flex items-start">
                                    <div className={`p-2 rounded-lg bg-${channel.color}-100 mr-3`}>
                                        <channel.icon className={`h-5 w-5 text-${channel.color}-600`} />
                                    </div>
                                    <div>
                                        <h5 className="font-medium text-gray-800">{channel.title}</h5>
                                        <p className="text-sm text-gray-600">{channel.value}</p>
                                        <p className="text-xs text-gray-500">{channel.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Issues */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">Masalah Umum</h4>
                        <div className="space-y-3">
                            {quickIssues.map((issue, index) => (
                                <button
                                    key={index}
                                    onClick={() => setFormData(prev => ({ ...prev, category: issue.category }))}
                                    className="w-full text-left p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start">
                                        <issue.icon className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                                        <div>
                                            <h5 className="font-medium text-gray-800 text-sm">{issue.title}</h5>
                                            <p className="text-xs text-gray-600">{issue.description}</p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Response Time */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-green-800 mb-2">Waktu Respon</h4>
                        <ul className="text-sm text-green-700 space-y-1">
                            <li>• Email: 24 jam</li>
                            <li>• Telepon: Langsung</li>
                            <li>• Tiket Mendesak: 2-4 jam</li>
                            <li>• Tiket Normal: 1-2 hari</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactSupport;
