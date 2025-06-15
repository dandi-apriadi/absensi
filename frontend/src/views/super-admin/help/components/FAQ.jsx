import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdQuestionAnswer, MdKeyboardArrowDown, MdKeyboardArrowUp, MdSearch } from "react-icons/md";
import AOS from "aos";
import "aos/dist/aos.css";

const FAQ = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeCategory, setActiveCategory] = useState("all");
    const [activeQuestion, setActiveQuestion] = useState(null);
    const [faqs, setFaqs] = useState([]);

    useEffect(() => {
        AOS.init();
        // Fetch FAQs from API or define statically
        fetchFAQs();
    }, []);

    const fetchFAQs = async () => {
        // Replace with API call
        const response = await fetch("/api/faqs");
        const data = await response.json();
        setFaqs(data);
    };

    const filteredFAQs = faqs.filter(faq => {
        const matchesSearchTerm = faq.question.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
        return matchesSearchTerm && matchesCategory;
    });

    const toggleQuestion = (id) => {
        setActiveQuestion(activeQuestion === id ? null : id);
    };

    return (
        <div className="p-4 md:p-8">
            <div className="mb-8" data-aos="fade-down">
                <h1 className="text-3xl font-bold text-gray-800">Pertanyaan Yang Sering Diajukan (FAQ)</h1>
                <p className="text-gray-600">Temukan jawaban untuk pertanyaan umum tentang sistem absensi face recognition</p>
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-xl shadow-md p-4 mb-8" data-aos="fade-up">
                <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
                    <div className="relative flex-grow">
                        <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="text"
                            placeholder="Cari pertanyaan..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex space-x-2">
                        <button
                            className={`px-3 py-1 rounded-lg text-sm ${activeCategory === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            onClick={() => setActiveCategory('all')}
                        >
                            Semua
                        </button>
                        <button
                            className={`px-3 py-1 rounded-lg text-sm ${activeCategory === 'general' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            onClick={() => setActiveCategory('general')}
                        >
                            Umum
                        </button>
                        <button
                            className={`px-3 py-1 rounded-lg text-sm ${activeCategory === 'technical' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            onClick={() => setActiveCategory('technical')}
                        >
                            Teknis
                        </button>
                        <button
                            className={`px-3 py-1 rounded-lg text-sm ${activeCategory === 'security' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            onClick={() => setActiveCategory('security')}
                        >
                            Keamanan
                        </button>
                        <button
                            className={`px-3 py-1 rounded-lg text-sm ${activeCategory === 'administrative' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            onClick={() => setActiveCategory('administrative')}
                        >
                            Administratif
                        </button>
                    </div>
                </div>
            </div>

            {/* FAQ Questions */}
            <div className="space-y-4" data-aos="fade-up" data-aos-delay="100">
                {filteredFAQs.map((faq) => (
                    <div key={faq.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                        <button
                            className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                            onClick={() => toggleQuestion(faq.id)}
                        >
                            <div className="flex items-center">
                                <MdQuestionAnswer className="h-6 w-6 text-blue-600 mr-3" />
                                <h2 className="text-lg font-medium text-gray-800">{faq.question}</h2>
                            </div>
                            {activeQuestion === faq.id ? (
                                <MdKeyboardArrowUp className="h-6 w-6 text-gray-500" />
                            ) : (
                                <MdKeyboardArrowDown className="h-6 w-6 text-gray-500" />
                            )}
                        </button>

                        {activeQuestion === faq.id && (
                            <div className="px-6 pb-6 border-t border-gray-100">
                                <div
                                    className="prose prose-blue max-w-none pt-4"
                                    dangerouslySetInnerHTML={{ __html: faq.answer }}
                                />
                            </div>
                        )}
                    </div>
                ))}

                {filteredFAQs.length === 0 && (
                    <div className="bg-white rounded-xl shadow-md p-8 text-center">
                        <MdSearch className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">Tidak ada FAQ yang cocok dengan kriteria pencarian Anda.</p>
                    </div>
                )}
            </div>

            {/* Ask a Question */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mt-8" data-aos="fade-up" data-aos-delay="200">
                <h2 className="text-lg font-semibold text-blue-800 mb-4">Tidak menemukan yang Anda cari?</h2>
                <p className="text-blue-700 mb-4">
                    Jika Anda memiliki pertanyaan yang tidak terjawab di sini, silakan hubungi tim support kami.
                </p>
                <Link
                    to="/super-admin/help/contact-support"
                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Ajukan Pertanyaan
                </Link>
            </div>

            {/* Related Resources */}
            <div className="bg-white rounded-xl shadow-md p-6 mt-8" data-aos="fade-up" data-aos-delay="300">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Sumber Daya Terkait</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <a href="/super-admin/help/user-guide" className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <h3 className="font-medium text-gray-800 mb-2">Panduan Pengguna</h3>
                        <p className="text-sm text-gray-600">Panduan lengkap untuk menggunakan semua fitur sistem</p>
                    </a>
                    <a href="/super-admin/help/video-tutorials" className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <h3 className="font-medium text-gray-800 mb-2">Video Tutorial</h3>
                        <p className="text-sm text-gray-600">Pelajari cara menggunakan sistem melalui video</p>
                    </a>
                    <a href="/super-admin/help/glossary" className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <h3 className="font-medium text-gray-800 mb-2">Glosarium</h3>
                        <p className="text-sm text-gray-600">Istilah-istilah teknis dalam sistem absensi</p>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default FAQ;