import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { MdHelpCenter, MdSchool, MdMessage, MdEmail, MdArticle, MdVideoLibrary, MdQuestionAnswer, MdAutorenew, MdSupportAgent } from "react-icons/md";
import AOS from "aos";
import "aos/dist/aos.css";

const Help = () => {
    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
        });
    }, []);

    return (
        <div className="p-4 md:p-8">
            <div className="mb-8" data-aos="fade-down">
                <h1 className="text-3xl font-bold text-gray-800">Pusat Bantuan</h1>
                <p className="text-gray-600">Temukan bantuan dan dukungan untuk sistem absensi</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Link to="/super-admin/help/user-guide" className="block" data-aos="fade-up">
                    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 h-full">
                        <div className="bg-blue-100 p-4 rounded-full w-16 h-16 flex justify-center items-center mb-4">
                            <MdSchool className="h-8 w-8 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Panduan Pengguna</h3>
                        <p className="text-gray-600">
                            Pelajari cara menggunakan fitur-fitur sistem absensi dengan panduan langkah demi langkah.
                        </p>
                        <button className="mt-4 text-blue-600 font-medium flex items-center">
                            Lihat Panduan
                            <svg className="w-5 h-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </Link>

                <Link to="/super-admin/help/faq" className="block" data-aos="fade-up" data-aos-delay="100">
                    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 h-full">
                        <div className="bg-purple-100 p-4 rounded-full w-16 h-16 flex justify-center items-center mb-4">
                            <MdQuestionAnswer className="h-8 w-8 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Pertanyaan Umum (FAQ)</h3>
                        <p className="text-gray-600">
                            Temukan jawaban untuk pertanyaan yang sering ditanyakan tentang sistem absensi.
                        </p>
                        <button className="mt-4 text-purple-600 font-medium flex items-center">
                            Lihat FAQ
                            <svg className="w-5 h-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </Link>

                <Link to="/super-admin/help/contact-support" className="block" data-aos="fade-up" data-aos-delay="200">
                    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 h-full">
                        <div className="bg-green-100 p-4 rounded-full w-16 h-16 flex justify-center items-center mb-4">
                            <MdEmail className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Hubungi Support</h3>
                        <p className="text-gray-600">
                            Dapatkan bantuan dari tim support kami untuk masalah yang tidak dapat Anda selesaikan sendiri.
                        </p>
                        <button className="mt-4 text-green-600 font-medium flex items-center">
                            Kontak Support
                            <svg className="w-5 h-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 mb-8" data-aos="fade-up" data-aos-delay="300">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Video Tutorial</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-100 h-48 flex items-center justify-center">
                            <MdVideoLibrary className="h-16 w-16 text-gray-400" />
                        </div>
                        <div className="p-4">
                            <h3 className="font-medium text-gray-800 mb-1">Pengenalan Sistem</h3>
                            <p className="text-sm text-gray-600 mb-3">Video pengenalan fitur-fitur utama sistem absensi</p>
                            <button className="text-blue-600 text-sm font-medium">Tonton Video</button>
                        </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-100 h-48 flex items-center justify-center">
                            <MdVideoLibrary className="h-16 w-16 text-gray-400" />
                        </div>
                        <div className="p-4">
                            <h3 className="font-medium text-gray-800 mb-1">Manajemen Mahasiswa</h3>
                            <p className="text-sm text-gray-600 mb-3">Cara mengelola data mahasiswa dan dataset wajah</p>
                            <button className="text-blue-600 text-sm font-medium">Tonton Video</button>
                        </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-100 h-48 flex items-center justify-center">
                            <MdVideoLibrary className="h-16 w-16 text-gray-400" />
                        </div>
                        <div className="p-4">
                            <h3 className="font-medium text-gray-800 mb-1">Konfigurasi Sistem</h3>
                            <p className="text-sm text-gray-600 mb-3">Cara mengonfigurasi pengaturan sistem absensi</p>
                            <button className="text-blue-600 text-sm font-medium">Tonton Video</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6" data-aos="fade-up" data-aos-delay="400">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Artikel Bantuan Populer</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border-l-4 border-blue-500 pl-4">
                        <h3 className="font-medium text-gray-800 mb-1">Cara Mengelola Dataset Wajah</h3>
                        <p className="text-sm text-gray-600 mb-2">Panduan untuk mengelola dan memperbarui dataset wajah mahasiswa</p>
                        <button className="text-blue-600 text-sm font-medium">Baca Selengkapnya</button>
                    </div>

                    <div className="border-l-4 border-blue-500 pl-4">
                        <h3 className="font-medium text-gray-800 mb-1">Menangani Error Absensi</h3>
                        <p className="text-sm text-gray-600 mb-2">Solusi untuk masalah umum pada sistem absensi wajah</p>
                        <button className="text-blue-600 text-sm font-medium">Baca Selengkapnya</button>
                    </div>

                    <div className="border-l-4 border-blue-500 pl-4">
                        <h3 className="font-medium text-gray-800 mb-1">Ekspor dan Analisis Laporan</h3>
                        <p className="text-sm text-gray-600 mb-2">Cara menghasilkan dan menganalisis laporan absensi</p>
                        <button className="text-blue-600 text-sm font-medium">Baca Selengkapnya</button>
                    </div>

                    <div className="border-l-4 border-blue-500 pl-4">
                        <h3 className="font-medium text-gray-800 mb-1">Keamanan Sistem Absensi</h3>
                        <p className="text-sm text-gray-600 mb-2">Praktik terbaik untuk menjaga keamanan data biometrik</p>
                        <button className="text-blue-600 text-sm font-medium">Baca Selengkapnya</button>
                    </div>
                </div>
            </div>

            <div className="bg-blue-50 rounded-xl border border-blue-100 p-6 mt-8" data-aos="fade-up" data-aos-delay="500">
                <div className="flex items-center">
                    <div className="bg-blue-100 p-4 rounded-full">
                        <MdSupportAgent className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="ml-6">
                        <h3 className="text-lg font-semibold text-blue-800 mb-1">Butuh bantuan lebih?</h3>
                        <p className="text-blue-600">
                            Tim support kami siap membantu Anda dengan pertanyaan atau masalah teknis.
                            <Link to="/super-admin/help/contact-support" className="ml-2 font-medium">Hubungi kami</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Help;
