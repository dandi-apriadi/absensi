import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { MdHelpCenter, MdBook, MdQuestionAnswer, MdSupport, MdSearch } from "react-icons/md";
import UserGuide from "./components/UserGuide";
import FAQ from "./components/FAQ";
import ContactSupport from "./components/ContactSupport";

const Help = () => {
    const [activeTab, setActiveTab] = useState('guide');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
        });
    }, []);

    const helpSections = [
        {
            id: 'guide',
            title: 'Panduan Pengguna',
            description: 'Panduan lengkap menggunakan sistem absensi',
            icon: MdBook,
            color: 'blue'
        },
        {
            id: 'faq',
            title: 'FAQ',
            description: 'Pertanyaan yang sering diajukan',
            icon: MdQuestionAnswer,
            color: 'green'
        },
        {
            id: 'support',
            title: 'Hubungi Support',
            description: 'Dapatkan bantuan dari tim support',
            icon: MdSupport,
            color: 'purple'
        }
    ];

    const quickHelp = [
        {
            title: 'Cara Melakukan Absensi',
            description: 'Panduan step-by-step melakukan absensi dengan face recognition',
            category: 'Absensi'
        },
        {
            title: 'Upload Foto Wajah',
            description: 'Cara mendaftarkan wajah untuk sistem absensi',
            category: 'Registrasi'
        },
        {
            title: 'Lihat Riwayat Kehadiran',
            description: 'Cara melihat dan download riwayat kehadiran',
            category: 'Laporan'
        },
        {
            title: 'Mengajukan Izin/Sakit',
            description: 'Proses pengajuan izin tidak masuk kuliah',
            category: 'Izin'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            {/* Header */}
            <div className="mb-8" data-aos="fade-down">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Pusat Bantuan
                </h1>
                <p className="text-gray-600">
                    Temukan panduan dan jawaban untuk pertanyaan Anda
                </p>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8" data-aos="fade-up">
                <div className="relative max-w-md mx-auto">
                    <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                        type="text"
                        placeholder="Cari bantuan..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Help Sections */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {helpSections.map((section, index) => (
                    <button
                        key={section.id}
                        onClick={() => setActiveTab(section.id)}
                        className={`p-6 rounded-xl shadow-lg text-left transition-all duration-300 transform hover:scale-105 ${activeTab === section.id
                                ? `bg-${section.color}-500 text-white`
                                : 'bg-white hover:shadow-xl'
                            }`}
                        data-aos="fade-up"
                        data-aos-delay={index * 100}
                    >
                        <section.icon className={`h-12 w-12 mb-4 ${activeTab === section.id ? 'text-white' : `text-${section.color}-500`
                            }`} />
                        <h3 className={`text-xl font-semibold mb-2 ${activeTab === section.id ? 'text-white' : 'text-gray-800'
                            }`}>
                            {section.title}
                        </h3>
                        <p className={activeTab === section.id ? 'text-white opacity-90' : 'text-gray-600'}>
                            {section.description}
                        </p>
                    </button>
                ))}
            </div>

            {/* Quick Help */}
            {activeTab === 'guide' && (
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8" data-aos="fade-up">
                    <h3 className="text-xl font-semibold text-gray-800 mb-6">Bantuan Cepat</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {quickHelp.map((item, index) => (
                            <div
                                key={index}
                                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-800 mb-1">{item.title}</h4>
                                        <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                                        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                            {item.category}
                                        </span>
                                    </div>
                                    <MdHelpCenter className="h-5 w-5 text-gray-400 ml-2" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Tab Content */}
            <div className="bg-white rounded-xl shadow-lg" data-aos="fade-up" data-aos-delay="200">
                {activeTab === 'guide' && <UserGuide />}
                {activeTab === 'faq' && <FAQ />}
                {activeTab === 'support' && <ContactSupport />}
            </div>
        </div>
    );
};

export default Help;
