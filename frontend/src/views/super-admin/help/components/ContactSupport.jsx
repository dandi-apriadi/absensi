import React, { useEffect, useState } from "react";
import { MdEmail, MdPhone, MdChat, MdSend, MdAttachFile, MdCheckCircle, MdInfoOutline } from "react-icons/md";
import AOS from "aos";
import "aos/dist/aos.css";

const ContactSupport = () => {
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [category, setCategory] = useState("technical");
    const [priority, setPriority] = useState("medium");
    const [attachment, setAttachment] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
        });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API request
        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);

            // Reset form after submission
            setSubject("");
            setMessage("");
            setCategory("technical");
            setPriority("medium");
            setAttachment(null);

            // Reset submitted state after a few seconds
            setTimeout(() => {
                setSubmitted(false);
            }, 5000);
        }, 1500);
    };

    const handleAttachment = (e) => {
        const file = e.target.files[0];
        if (file && file.size <= 5 * 1024 * 1024) { // 5MB max
            setAttachment(file);
        } else if (file) {
            alert("Ukuran file maksimal 5MB");
        }
    };

    return (
        <div className="p-4 md:p-8">
            <div className="mb-8" data-aos="fade-down">
                <h1 className="text-3xl font-bold text-gray-800">Hubungi Support</h1>
                <p className="text-gray-600">Dapatkan bantuan dari tim dukungan teknis kami</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Contact Methods */}
                <div className="lg:col-span-1" data-aos="fade-up">
                    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Kontak Kami</h2>
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <div className="bg-blue-100 p-3 rounded-full">
                                    <MdEmail className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-sm font-medium text-gray-800">Email Support</h3>
                                    <p className="text-sm text-gray-600 mt-1">support@absensi-tech.ac.id</p>
                                    <p className="text-xs text-gray-500 mt-1">Respon dalam 24 jam</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="bg-green-100 p-3 rounded-full">
                                    <MdPhone className="h-6 w-6 text-green-600" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-sm font-medium text-gray-800">Telepon</h3>
                                    <p className="text-sm text-gray-600 mt-1">+62 21 5551234</p>
                                    <p className="text-xs text-gray-500 mt-1">Senin-Jumat, 08:00-16:00 WIB</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="bg-purple-100 p-3 rounded-full">
                                    <MdChat className="h-6 w-6 text-purple-600" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-sm font-medium text-gray-800">Live Chat</h3>
                                    <p className="text-sm text-gray-600 mt-1">Tersedia pada jam kerja</p>
                                    <button className="text-sm text-purple-600 font-medium mt-1">Mulai Chat</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6" data-aos="fade-up" data-aos-delay="100">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Informasi Berguna</h2>
                        <div className="space-y-3">
                            <div className="bg-blue-50 p-3 rounded-lg">
                                <h3 className="text-sm font-medium text-blue-800">Jam Operasional</h3>
                                <p className="text-sm text-blue-600 mt-1">Senin-Jumat: 08:00-16:00 WIB</p>
                            </div>

                            <div className="bg-green-50 p-3 rounded-lg">
                                <h3 className="text-sm font-medium text-green-800">Waktu Respon</h3>
                                <p className="text-sm text-green-600 mt-1">Tiket prioritas tinggi: 2-4 jam</p>
                                <p className="text-sm text-green-600">Tiket standar: 24 jam kerja</p>
                            </div>

                            <div className="bg-purple-50 p-3 rounded-lg">
                                <h3 className="text-sm font-medium text-purple-800">Dokumentasi</h3>
                                <p className="text-sm text-purple-600 mt-1">
                                    <a href="/super-admin/help/user-guide" className="underline">Panduan Pengguna</a> dan
                                    <a href="/super-admin/help/faq" className="underline"> FAQ</a> mungkin dapat menjawab pertanyaan Anda dengan cepat.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Support Ticket Form */}
                <div className="lg:col-span-2" data-aos="fade-up" data-aos-delay="200">
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Kirim Tiket Support</h2>

                        {submitted ? (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                                <MdCheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                                <h3 className="text-xl font-medium text-green-800 mb-2">Tiket Terkirim!</h3>
                                <p className="text-green-700">Terima kasih atas pertanyaan Anda. Tim support kami akan segera menghubungi Anda.</p>
                                <p className="text-green-600 mt-2">ID Tiket: <span className="font-medium">TICK-{Math.floor(Math.random() * 10000)}</span></p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                                        <select
                                            id="category"
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        >
                                            <option value="technical">Masalah Teknis</option>
                                            <option value="account">Akun & Akses</option>
                                            <option value="feature">Permintaan Fitur</option>
                                            <option value="data">Data & Laporan</option>
                                            <option value="billing">Penagihan</option>
                                            <option value="other">Lainnya</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">Prioritas</label>
                                        <select
                                            id="priority"
                                            value={priority}
                                            onChange={(e) => setPriority(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        >
                                            <option value="low">Rendah - Pertanyaan umum</option>
                                            <option value="medium">Sedang - Mengalami masalah minor</option>
                                            <option value="high">Tinggi - Fungsi penting terganggu</option>
                                            <option value="critical">Kritis - Sistem tidak dapat digunakan</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subjek</label>
                                    <input
                                        type="text"
                                        id="subject"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Jelaskan masalah Anda secara singkat"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Pesan</label>
                                    <textarea
                                        id="message"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Jelaskan masalah dengan detail..."
                                        rows="6"
                                        required
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Lampiran (opsional)</label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors">
                                        <MdAttachFile className="mx-auto h-8 w-8 text-gray-400" />
                                        <p className="text-sm text-gray-600 mt-2">
                                            Klik untuk mengunggah file atau seret dan lepas file di sini
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            PNG, JPG, PDF, DOC hingga 5MB
                                        </p>
                                        <input
                                            type="file"
                                            id="attachment"
                                            onChange={handleAttachment}
                                            className="hidden"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => document.getElementById("attachment").click()}
                                            className="mt-2 px-4 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm"
                                        >
                                            Pilih File
                                        </button>
                                    </div>
                                    {attachment && (
                                        <div className="mt-2 flex items-center justify-between bg-blue-50 p-2 rounded-lg">
                                            <p className="text-sm text-blue-700 truncate">{attachment.name}</p>
                                            <button
                                                type="button"
                                                onClick={() => setAttachment(null)}
                                                className="text-red-500 text-sm"
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="bg-yellow-50 p-4 rounded-lg flex items-start">
                                    <MdInfoOutline className="h-5 w-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-yellow-700">
                                        Respon biasanya diberikan dalam 24 jam kerja. Untuk masalah yang mendesak, gunakan opsi prioritas Tinggi atau Kritis.
                                    </p>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                                </svg>
                                                Mengirim...
                                            </>
                                        ) : (
                                            <>
                                                <MdSend className="mr-2" /> Kirim Tiket
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            {/* Support Statistics */}
            <div className="bg-white rounded-xl shadow-md p-6 mt-8" data-aos="fade-up" data-aos-delay="300">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Statistik Support</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">95%</div>
                        <div className="text-sm text-blue-800 mt-1">Tingkat Kepuasan</div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">4h</div>
                        <div className="text-sm text-green-800 mt-1">Waktu Respon Rata-rata</div>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">98%</div>
                        <div className="text-sm text-purple-800 mt-1">Resolusi Pertama</div>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">24/7</div>
                        <div className="text-sm text-yellow-800 mt-1">Dukungan Kritis</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactSupport;
