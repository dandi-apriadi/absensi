import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Card from "components/card";
import {
    MdEmail,
    MdPhone,
    MdChat,
    MdSend,
    MdAttachFile,
    MdCheck,
    MdError,
    MdHelp,
    MdAccessTime,
    MdDevices
} from "react-icons/md";

const ContactSupport = () => {
    const [formData, setFormData] = useState({
        subject: "",
        category: "",
        message: "",
        attachment: null
    });

    const [submitStatus, setSubmitStatus] = useState(null); // null, 'success', 'error'

    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: "ease-in-out",
            once: true,
        });
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            attachment: e.target.files[0]
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Simulate API call
        setTimeout(() => {
            if (formData.subject && formData.category && formData.message) {
                setSubmitStatus('success');
                setFormData({
                    subject: "",
                    category: "",
                    message: "",
                    attachment: null
                });
            } else {
                setSubmitStatus('error');
            }
        }, 1000);
    };

    return (
        <div className="mt-3">
            <div className="mb-5" data-aos="fade-down">
                <h1 className="text-3xl font-bold text-navy-700 dark:text-white">
                    Hubungi Support
                </h1>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Kirim pesan ke tim support untuk mendapatkan bantuan
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
                <div className="lg:col-span-2">
                    <Card extra="p-5" data-aos="fade-up">
                        <div className="mb-6">
                            <h4 className="text-lg font-bold text-navy-700 dark:text-white mb-1">
                                Formulir Kontak
                            </h4>
                            <p className="text-sm text-gray-600">
                                Isi formulir dibawah ini dengan detail masalah yang Anda hadapi
                            </p>
                        </div>

                        {submitStatus === 'success' && (
                            <div className="mb-6 p-4 bg-green-100 border border-green-200 rounded-lg flex items-start">
                                <MdCheck className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                                <div>
                                    <h5 className="font-medium text-green-800 mb-1">Pesan Terkirim!</h5>
                                    <p className="text-sm text-green-700">
                                        Terima kasih atas pesan Anda. Tim support kami akan merespons dalam waktu 24 jam kerja.
                                    </p>
                                </div>
                            </div>
                        )}

                        {submitStatus === 'error' && (
                            <div className="mb-6 p-4 bg-red-100 border border-red-200 rounded-lg flex items-start">
                                <MdError className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                                <div>
                                    <h5 className="font-medium text-red-800 mb-1">Terjadi Kesalahan</h5>
                                    <p className="text-sm text-red-700">
                                        Pastikan semua field yang wajib diisi telah diisi dengan benar.
                                    </p>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Subjek <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleInputChange}
                                        placeholder="Contoh: Masalah pada fitur absensi"
                                        className="w-full rounded-lg border border-gray-300 p-3 text-sm outline-none focus:border-indigo-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Kategori <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full rounded-lg border border-gray-300 p-3 text-sm outline-none focus:border-indigo-500"
                                        required
                                    >
                                        <option value="">Pilih kategori</option>
                                        <option value="technical">Masalah Teknis</option>
                                        <option value="feature">Fitur Aplikasi</option>
                                        <option value="account">Akun & Login</option>
                                        <option value="data">Data & Laporan</option>
                                        <option value="other">Lainnya</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Pesan <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        rows="6"
                                        placeholder="Deskripsikan masalah Anda secara detail..."
                                        className="w-full rounded-lg border border-gray-300 p-3 text-sm outline-none focus:border-indigo-500"
                                        required
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Lampiran (opsional)
                                    </label>
                                    <div className="flex items-center">
                                        <label className="flex items-center py-2 px-4 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200">
                                            <MdAttachFile className="mr-2" />
                                            <span>Pilih File</span>
                                            <input
                                                type="file"
                                                name="attachment"
                                                onChange={handleFileChange}
                                                className="hidden"
                                            />
                                        </label>
                                        {formData.attachment && (
                                            <span className="ml-3 text-sm text-gray-600">
                                                {formData.attachment.name}
                                            </span>
                                        )}
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500">
                                        Format yang didukung: JPG, PNG, PDF. Maksimal 5MB.
                                    </p>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        className="py-3 px-6 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
                                    >
                                        <MdSend className="mr-2" /> Kirim Pesan
                                    </button>
                                </div>
                            </div>
                        </form>
                    </Card>
                </div>

                <div className="lg:col-span-1">
                    <Card extra="p-5" data-aos="fade-up" data-aos-delay="100">
                        <div className="mb-4">
                            <h4 className="text-lg font-bold text-navy-700 dark:text-white">
                                Kontak Support
                            </h4>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start">
                                <div className="rounded-full bg-indigo-100 p-3">
                                    <MdEmail className="h-6 w-6 text-indigo-600" />
                                </div>
                                <div className="ml-4">
                                    <h5 className="text-base font-medium text-gray-900 mb-1">Email</h5>
                                    <p className="text-sm text-gray-600">support@absensi.ac.id</p>
                                    <p className="text-xs text-gray-500 mt-1">Respon dalam 24 jam kerja</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="rounded-full bg-green-100 p-3">
                                    <MdPhone className="h-6 w-6 text-green-600" />
                                </div>
                                <div className="ml-4">
                                    <h5 className="text-base font-medium text-gray-900 mb-1">Telepon</h5>
                                    <p className="text-sm text-gray-600">(021) 1234-5678</p>
                                    <p className="text-xs text-gray-500 mt-1">Senin - Jumat, 08.00 - 16.00 WIB</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="rounded-full bg-blue-100 p-3">
                                    <MdChat className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <h5 className="text-base font-medium text-gray-900 mb-1">Live Chat</h5>
                                    <p className="text-sm text-gray-600">Tersedia di aplikasi mobile</p>
                                    <p className="text-xs text-gray-500 mt-1">09.00 - 15.00 WIB setiap hari kerja</p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card extra="p-5 mt-5" data-aos="fade-up" data-aos-delay="200">
                        <div className="mb-4">
                            <h4 className="text-lg font-bold text-navy-700 dark:text-white">
                                FAQ Populer
                            </h4>
                        </div>

                        <div className="space-y-3">
                            <a
                                href="/lecturer/help/faq"
                                className="block p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition duration-150"
                            >
                                <div className="flex items-center">
                                    <MdHelp className="h-5 w-5 text-indigo-600 mr-3" />
                                    <p className="text-sm">Bagaimana cara mengambil absensi mahasiswa?</p>
                                </div>
                            </a>

                            <a
                                href="/lecturer/help/faq"
                                className="block p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition duration-150"
                            >
                                <div className="flex items-center">
                                    <MdHelp className="h-5 w-5 text-indigo-600 mr-3" />
                                    <p className="text-sm">Aplikasi tidak merespon atau mengalami error?</p>
                                </div>
                            </a>

                            <a
                                href="/lecturer/help/faq"
                                className="block p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition duration-150"
                            >
                                <div className="flex items-center">
                                    <MdHelp className="h-5 w-5 text-indigo-600 mr-3" />
                                    <p className="text-sm">Bagaimana cara mengekspor data absensi?</p>
                                </div>
                            </a>
                        </div>

                        <a
                            href="/lecturer/help/faq"
                            className="flex items-center justify-center mt-4 text-sm text-indigo-600 hover:text-indigo-800"
                        >
                            Lihat Semua FAQ
                        </a>
                    </Card>

                    <Card extra="p-5 mt-5" data-aos="fade-up" data-aos-delay="300">
                        <div className="mb-4">
                            <h4 className="text-lg font-bold text-navy-700 dark:text-white flex items-center">
                                <MdDevices className="mr-2 h-5 w-5" /> Sistem Status
                            </h4>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Aplikasi Web</span>
                                <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Operasional</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Aplikasi Mobile</span>
                                <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Operasional</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">API</span>
                                <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Operasional</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Database</span>
                                <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Operasional</span>
                            </div>
                        </div>

                        <div className="mt-4 text-xs flex items-center text-gray-500">
                            <MdAccessTime className="mr-1" />
                            <span>Terakhir diperbarui: 10 menit yang lalu</span>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ContactSupport;
