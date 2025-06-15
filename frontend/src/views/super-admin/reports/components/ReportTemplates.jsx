import React, { useEffect, useState } from "react";
import { MdFolderShared, MdEdit, MdDelete, MdContentCopy, MdAdd, MdOutlineDescription, MdCalendarToday, MdPerson, MdStar, MdStarOutline, MdFilterList, MdSearch } from "react-icons/md";
import AOS from "aos";
import "aos/dist/aos.css";

const ReportTemplates = () => {
    const [filter, setFilter] = useState('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
    const [templateToDelete, setTemplateToDelete] = useState(null);
    const [templates, setTemplates] = useState([
        // Sample data
        {
            id: 1,
            name: "Template Kehadiran Harian",
            description: "Template untuk laporan kehadiran harian mahasiswa.",
            type: "attendance",
            favorite: true,
            createdBy: "Admin",
            lastModified: "2023-10-10",
        },
        {
            id: 2,
            name: "Template Dataset Mahasiswa",
            description: "Template untuk laporan dataset mahasiswa.",
            type: "dataset",
            favorite: false,
            createdBy: "Admin",
            lastModified: "2023-10-12",
        },
        {
            id: 3,
            name: "Template Akses Pintu",
            description: "Template untuk laporan akses pintu dan ruangan.",
            type: "access",
            favorite: false,
            createdBy: "Admin",
            lastModified: "2023-10-15",
        },
        {
            id: 4,
            name: "Template Analitik Kehadiran",
            description: "Template untuk laporan analitik kehadiran mahasiswa.",
            type: "analytics",
            favorite: true,
            createdBy: "Admin",
            lastModified: "2023-10-18",
        },
    ]);
    const [filteredTemplates, setFilteredTemplates] = useState(templates);

    useEffect(() => {
        AOS.init();
        // Filter templates based on selected filter
        if (filter === 'all') {
            setFilteredTemplates(templates);
        } else {
            setFilteredTemplates(templates.filter(template => template.type === filter));
        }
    }, [filter, templates]);

    const getTypeColor = (type) => {
        switch (type) {
            case 'attendance':
                return 'bg-green-100 text-green-600';
            case 'dataset':
                return 'bg-blue-100 text-blue-600';
            case 'access':
                return 'bg-red-100 text-red-600';
            case 'analytics':
                return 'bg-yellow-100 text-yellow-600';
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };

    const getTypeLabel = (type) => {
        switch (type) {
            case 'attendance':
                return 'Kehadiran';
            case 'dataset':
                return 'Dataset';
            case 'access':
                return 'Akses Pintu';
            case 'analytics':
                return 'Analitik';
            default:
                return 'Lainnya';
        }
    };

    const toggleFavorite = (id) => {
        setTemplates(templates.map(template =>
            template.id === id ? { ...template, favorite: !template.favorite } : template
        ));
    };

    const handleDeleteTemplate = (template) => {
        setTemplateToDelete(template);
        setShowConfirmDeleteModal(true);
    };

    const confirmDelete = () => {
        setTemplates(templates.filter(template => template.id !== templateToDelete.id));
        setShowConfirmDeleteModal(false);
    };

    const loadTemplates = () => {
        // In a real app, this would fetch the template list from the server
        setTemplates([
            {
                id: 1,
                name: "Template Kehadiran Harian",
                description: "Template untuk laporan kehadiran harian mahasiswa.",
                type: "attendance",
                favorite: true,
                createdBy: "Admin",
                lastModified: "2023-10-10",
            },
            {
                id: 2,
                name: "Template Dataset Mahasiswa",
                description: "Template untuk laporan dataset mahasiswa.",
                type: "dataset",
                favorite: false,
                createdBy: "Admin",
                lastModified: "2023-10-12",
            },
            {
                id: 3,
                name: "Template Akses Pintu",
                description: "Template untuk laporan akses pintu dan ruangan.",
                type: "access",
                favorite: false,
                createdBy: "Admin",
                lastModified: "2023-10-15",
            },
            {
                id: 4,
                name: "Template Analitik Kehadiran",
                description: "Template untuk laporan analitik kehadiran mahasiswa.",
                type: "analytics",
                favorite: true,
                createdBy: "Admin",
                lastModified: "2023-10-18",
            },
        ]);
    };

    return (
        <div className="p-4 md:p-8">
            <div className="mb-8" data-aos="fade-down">
                <h1 className="text-3xl font-bold text-gray-800">Template Laporan</h1>
                <p className="text-gray-600">Kelola template untuk pembuatan laporan yang konsisten</p>
            </div>

            {/* Controls */}
            <div className="bg-white rounded-xl shadow-md p-4 mb-8 flex flex-wrap justify-between items-center gap-4" data-aos="fade-up">
                <div className="flex space-x-2">
                    <button
                        className={`px-3 py-1 text-sm rounded-lg ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                        onClick={() => setFilter('all')}
                    >
                        Semua
                    </button>
                    <button
                        className={`px-3 py-1 text-sm rounded-lg ${filter === 'attendance' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                        onClick={() => setFilter('attendance')}
                    >
                        Kehadiran
                    </button>
                    <button
                        className={`px-3 py-1 text-sm rounded-lg ${filter === 'dataset' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                        onClick={() => setFilter('dataset')}
                    >
                        Dataset
                    </button>
                    <button
                        className={`px-3 py-1 text-sm rounded-lg ${filter === 'access' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                        onClick={() => setFilter('access')}
                    >
                        Akses Pintu
                    </button>
                    <button
                        className={`px-3 py-1 text-sm rounded-lg ${filter === 'analytics' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                        onClick={() => setFilter('analytics')}
                    >
                        Analitik
                    </button>
                </div>

                <div className="flex items-center">
                    <div className="relative mr-4">
                        <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari template..."
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <button
                        onClick={() => setShowAddModal(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center hover:bg-blue-700 transition-colors"
                    >
                        <MdAdd className="mr-2" /> Template Baru
                    </button>
                </div>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-aos="fade-up" data-aos-delay="200">
                {filteredTemplates.length > 0 ? (
                    filteredTemplates.map((template) => (
                        <div key={template.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all">
                            <div className={`h-2 ${getTypeColor(template.type)}`}></div>
                            <div className="p-6">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-start">
                                        <div className={`p-2 rounded-lg ${getTypeColor(template.type)} mr-3 flex-shrink-0`}>
                                            <MdOutlineDescription className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-1">{template.name}</h3>
                                            <p className="text-sm text-gray-500 line-clamp-2">{template.description}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => toggleFavorite(template.id)}
                                        className="text-yellow-400 hover:text-yellow-500"
                                    >
                                        {template.favorite ? <MdStar className="h-6 w-6" /> : <MdStarOutline className="h-6 w-6" />}
                                    </button>
                                </div>

                                <div className="mt-4 space-y-2">
                                    <div className="flex items-center text-sm text-gray-500">
                                        <MdPerson className="mr-2 text-gray-400" />
                                        <span>Dibuat oleh: {template.createdBy}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <MdCalendarToday className="mr-2 text-gray-400" />
                                        <span>Terakhir diubah: {template.lastModified}</span>
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center justify-between">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(template.type)}`}>
                                        {getTypeLabel(template.type)}
                                    </span>

                                    <div className="flex space-x-2">
                                        <button
                                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                            title="Edit"
                                            onClick={() => { }}
                                        >
                                            <MdEdit className="h-5 w-5 text-blue-600" />
                                        </button>
                                        <button
                                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                            title="Duplicate"
                                            onClick={() => { }}
                                        >
                                            <MdContentCopy className="h-5 w-5 text-green-600" />
                                        </button>
                                        <button
                                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                            title="Delete"
                                            onClick={() => handleDeleteTemplate(template)}
                                        >
                                            <MdDelete className="h-5 w-5 text-red-600" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full bg-white rounded-xl shadow-md p-8 text-center">
                        <MdFolderShared className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-800 mb-2">Tidak ada template ditemukan</h3>
                        <p className="text-gray-500 mb-4">
                            {filter === 'all' ?
                                'Belum ada template yang dibuat. Buat template baru untuk memulai.' :
                                `Tidak ada template dengan kategori ${getTypeLabel(filter)}. Coba kategori lain atau buat template baru.`
                            }
                        </p>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
                        >
                            <MdAdd className="mr-2" /> Buat Template Baru
                        </button>
                    </div>
                )}
            </div>

            {/* Helpful Tips */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mt-8" data-aos="fade-up" data-aos-delay="400">
                <h2 className="text-lg font-semibold text-blue-800 mb-4">Tips Penggunaan Template</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-sm font-medium text-blue-700 mb-2">Apa itu template laporan?</h3>
                        <p className="text-sm text-blue-600">
                            Template laporan adalah format laporan yang telah dikonfigurasi sebelumnya. Template menyimpan pengaturan tampilan, filter,
                            parameter, dan format output. Gunakan template untuk menghasilkan laporan secara konsisten dan cepat.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-blue-700 mb-2">Cara menggunakan template</h3>
                        <ol className="text-sm text-blue-600 list-decimal pl-4 space-y-1">
                            <li>Buka menu "Generate Reports"</li>
                            <li>Pilih template dari daftar</li>
                            <li>Sesuaikan parameter jika diperlukan</li>
                            <li>Klik "Generate Report"</li>
                            <li>Laporan akan dibuat sesuai dengan format template</li>
                        </ol>
                    </div>
                </div>
            </div>

            {/* Add Template Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-3xl w-full p-6" data-aos="zoom-in">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Template Laporan Baru</h2>

                        <form className="space-y-6">
                            <div>
                                <label htmlFor="template-name" className="block text-sm font-medium text-gray-700 mb-1">Nama Template</label>
                                <input
                                    type="text"
                                    id="template-name"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Masukkan nama template"
                                />
                            </div>

                            <div>
                                <label htmlFor="template-description" className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                                <textarea
                                    id="template-description"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Masukkan deskripsi template"
                                    rows="3"
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="template-type" className="block text-sm font-medium text-gray-700 mb-1">Jenis Template</label>
                                    <select
                                        id="template-type"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="attendance">Kehadiran</option>
                                        <option value="dataset">Dataset</option>
                                        <option value="access">Akses Pintu</option>
                                        <option value="analytics">Analitik</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="output-format" className="block text-sm font-medium text-gray-700 mb-1">Format Output</label>
                                    <select
                                        id="output-format"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="pdf">PDF</option>
                                        <option value="excel">Excel</option>
                                        <option value="csv">CSV</option>
                                        <option value="html">HTML</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Komponen Laporan</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="include-charts"
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            defaultChecked
                                        />
                                        <label htmlFor="include-charts" className="ml-2 text-sm text-gray-700">
                                            Sertakan grafik dan visualisasi
                                        </label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="include-summary"
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            defaultChecked
                                        />
                                        <label htmlFor="include-summary" className="ml-2 text-sm text-gray-700">
                                            Sertakan halaman ringkasan
                                        </label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="include-details"
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            defaultChecked
                                        />
                                        <label htmlFor="include-details" className="ml-2 text-sm text-gray-700">
                                            Sertakan data detail
                                        </label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="include-cover"
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            defaultChecked
                                        />
                                        <label htmlFor="include-cover" className="ml-2 text-sm text-gray-700">
                                            Sertakan halaman sampul
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                    onClick={() => setShowAddModal(false)}
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    onClick={() => {
                                        // In a real app, this would save the template
                                        setShowAddModal(false);
                                        // Refresh the list
                                        loadTemplates();
                                    }}
                                >
                                    Simpan Template
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Confirm Delete Modal */}
            {showConfirmDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6" data-aos="zoom-in">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Konfirmasi Penghapusan</h2>
                        <p className="text-gray-600 mb-6">
                            Apakah Anda yakin ingin menghapus template "{templateToDelete?.name}"? Tindakan ini tidak dapat dibatalkan.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                onClick={() => setShowConfirmDeleteModal(false)}
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                onClick={confirmDelete}
                            >
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportTemplates;