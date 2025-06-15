import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import Card from "components/card";
import {
    MdHelp,
    MdQuestionAnswer,
    MdEmail,
    MdBook,
    MdVideocam,
    MdSchool,
    MdAccessTime,
    MdNotificationsActive,
    MdArrowForward,
    MdSearch,
    MdSupportAgent,
    MdPeople,
    MdPhone
} from "react-icons/md";

const helpTopics = [
    {
        id: 1,
        title: "Mengambil Absensi",
        icon: <MdAccessTime className="h-8 w-8 text-indigo-600" />,
        description: "Pelajari cara mengambil dan mengelola absensi mahasiswa",
        url: "/lecturer/help/user-guide#attendance"
    },
    {
        id: 2,
        title: "Mengelola Mahasiswa",
        icon: <MdPeople className="h-8 w-8 text-green-600" />,
        description: "Panduan untuk mengelola data mahasiswa dan statistik kehadiran",
        url: "/lecturer/help/user-guide#students"
    },
    {
        id: 3,
        title: "Permintaan Izin/Sakit",
        icon: <MdNotificationsActive className="h-8 w-8 text-orange-600" />,
        description: "Cara menyetujui atau menolak permintaan izin mahasiswa",
        url: "/lecturer/help/user-guide#leave-requests"
    },
    {
        id: 4,
        title: "Laporan & Ekspor Data",
        icon: <MdBook className="h-8 w-8 text-purple-600" />,
        description: "Cara menghasilkan dan mengunduh laporan absensi",
        url: "/lecturer/help/user-guide#reports"
    },
];

const popularQuestions = [
    {
        id: 1,
        question: "Bagaimana cara mengambil absensi melalui QR code?",
        url: "/lecturer/help/faq#qr-code"
    },
    {
        id: 2,
        question: "Bagaimana cara menyetujui permintaan izin mahasiswa?",
        url: "/lecturer/help/faq#leave-approve"
    },
    {
        id: 3,
        question: "Bagaimana cara mengekspor data kehadiran?",
        url: "/lecturer/help/faq#export-data"
    },
    {
        id: 4,
        question: "Apa yang harus dilakukan jika terjadi error pada sistem?",
        url: "/lecturer/help/faq#system-error"
    },
];

const Help = () => {
    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: "ease-in-out",
            once: true,
        });
    }, []);

    return (
        <div className="mt-3">
            <div className="mb-5" data-aos="fade-down">
                <h1 className="text-3xl font-bold text-navy-700 dark:text-white">
                    Pusat Bantuan
                </h1>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Temukan bantuan dan panduan penggunaan sistem
                </p>
            </div>

            <Card extra="p-5 mb-5" data-aos="fade-up">
                <div className="relative">
                    <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-6 w-6" />
                    <input
                        type="text"
                        placeholder="Cari bantuan..."
                        className="w-full pl-12 pr-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-5">
                {helpTopics.map((topic, index) => (
                    <Link to={topic.url} key={topic.id}>
                        <Card
                            extra="p-5 hover:shadow-lg transition-all duration-200 h-full cursor-pointer"
                            data-aos="fade-up"
                            data-aos-delay={(index + 1) * 100}
                        >
                            <div className="flex flex-col items-center text-center">
                                <div className="rounded-full bg-gray-100 p-4 mb-3">
                                    {topic.icon}
                                </div>
                                <h3 className="text-lg font-semibold mb-2">{topic.title}</h3>
                                <p className="text-sm text-gray-600">{topic.description}</p>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
                <Card extra="p-5 lg:col-span-2" data-aos="fade-up" data-aos-delay="200">
                    <div className="mb-4 flex justify-between items-center">
                        <h4 className="text-lg font-bold text-navy-700 dark:text-white flex items-center">
                            <MdQuestionAnswer className="mr-2 h-5 w-5" /> Pertanyaan Populer
                        </h4>
                        <Link to="/lecturer/help/faq" className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center">
                            Lihat Semua FAQ <MdArrowForward className="ml-1" />
                        </Link>
                    </div>

                    <div className="space-y-3">
                        {popularQuestions.map((q) => (
                            <Link
                                key={q.id}
                                to={q.url}
                                className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-150"
                            >
                                <div className="flex items-center">
                                    <MdHelp className="h-5 w-5 text-indigo-600 mr-2 flex-shrink-0" />
                                    <p className="text-sm">{q.question}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </Card>

                <Card extra="p-5" data-aos="fade-up" data-aos-delay="300">
                    <div className="mb-4">
                        <h4 className="text-lg font-bold text-navy-700 dark:text-white flex items-center">
                            <MdSupportAgent className="mr-2 h-5 w-5" /> Dukungan Teknis
                        </h4>
                    </div>

                    <div className="mb-4 flex items-center border-b border-gray-200 pb-4">
                        <div className="rounded-full bg-blue-100 p-3 mr-3">
                            <MdEmail className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <h5 className="text-base font-medium text-gray-900">Email</h5>
                            <p className="text-sm text-gray-600">support@absensi.ac.id</p>
                            <p className="text-xs text-gray-500 mt-1">Respon dalam 24 jam</p>
                        </div>
                    </div>

                    <div className="mb-4 flex items-center border-b border-gray-200 pb-4">
                        <div className="rounded-full bg-green-100 p-3 mr-3">
                            <MdPhone className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                            <h5 className="text-base font-medium text-gray-900">Telepon</h5>
                            <p className="text-sm text-gray-600">(021) 1234-5678</p>
                            <p className="text-xs text-gray-500 mt-1">Senin - Jumat, 08:00 - 16:00</p>
                        </div>
                    </div>

                    <Link
                        to="/lecturer/help/contact-support"
                        className="w-full py-2 px-4 mt-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
                    >
                        <MdEmail className="mr-2" /> Hubungi Support
                    </Link>
                </Card>
            </div>

            <Card extra="p-5" data-aos="fade-up" data-aos-delay="400">
                <div className="mb-4">
                    <h4 className="text-lg font-bold text-navy-700 dark:text-white">
                        Video Tutorial
                    </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                        <div className="aspect-video bg-gray-100 flex items-center justify-center relative">
                            <MdVideocam className="h-12 w-12 text-gray-400" />
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                <div className="h-14 w-14 rounded-full bg-white bg-opacity-80 flex items-center justify-center cursor-pointer">
                                    <div className="h-0 w-0 border-y-8 border-y-transparent border-l-12 border-l-indigo-600 ml-1"></div>
                                </div>
                            </div>
                        </div>
                        <div className="p-3">
                            <h5 className="font-medium text-sm">Cara Mengambil Absensi dengan QR Code</h5>
                            <p className="text-xs text-gray-500 mt-1">03:45 • Tutorial dasar</p>
                        </div>
                    </div>

                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                        <div className="aspect-video bg-gray-100 flex items-center justify-center relative">
                            <MdVideocam className="h-12 w-12 text-gray-400" />
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                <div className="h-14 w-14 rounded-full bg-white bg-opacity-80 flex items-center justify-center cursor-pointer">
                                    <div className="h-0 w-0 border-y-8 border-y-transparent border-l-12 border-l-indigo-600 ml-1"></div>
                                </div>
                            </div>
                        </div>
                        <div className="p-3">
                            <h5 className="font-medium text-sm">Cara Menyetujui Permintaan Izin Mahasiswa</h5>
                            <p className="text-xs text-gray-500 mt-1">02:30 • Tutorial dasar</p>
                        </div>
                    </div>

                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                        <div className="aspect-video bg-gray-100 flex items-center justify-center relative">
                            <MdVideocam className="h-12 w-12 text-gray-400" />
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                <div className="h-14 w-14 rounded-full bg-white bg-opacity-80 flex items-center justify-center cursor-pointer">
                                    <div className="h-0 w-0 border-y-8 border-y-transparent border-l-12 border-l-indigo-600 ml-1"></div>
                                </div>
                            </div>
                        </div>
                        <div className="p-3">
                            <h5 className="font-medium text-sm">Cara Menganalisis Statistik Kehadiran Mahasiswa</h5>
                            <p className="text-xs text-gray-500 mt-1">04:15 • Tutorial lanjutan</p>
                        </div>
                    </div>
                </div>

                <div className="mt-4 text-center">
                    <Link
                        to="/lecturer/help/video-tutorials"
                        className="py-2 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center"
                    >
                        Lihat Semua Video Tutorial <MdArrowForward className="ml-2" />
                    </Link>
                </div>
            </Card>
        </div>
    );
};

export default Help;
