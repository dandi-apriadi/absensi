import React, { useState, useEffect } from "react";
import {
    MdImportExport,
    MdFileUpload,
    MdFileDownload,
    MdCloudUpload,
    MdCloudDownload,
    MdDescription,
    MdCheckCircle,
    MdError,
    MdWarning,
    MdInfo,
    MdClose,
    MdRefresh,
    MdVisibility,
    MdGetApp,
    MdPublish,
    MdTableChart,
    MdPeople,
    MdSchool,
    MdPersonAdd,
    MdHistory,
    MdSchedule,
    MdDone,
    MdErrorOutline,
    MdProgressIcon,
    MdDelete,
    MdEdit
} from "react-icons/md";
import AOS from 'aos';
import 'aos/dist/aos.css';

const ImportExportUsers = () => {
    const [activeTab, setActiveTab] = useState('import');
    const [importFile, setImportFile] = useState(null);
    const [importProgress, setImportProgress] = useState(0);
    const [isImporting, setIsImporting] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [exportProgress, setExportProgress] = useState(0);
    const [importResults, setImportResults] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [previewData, setPreviewData] = useState([]);

    // Export filters
    const [exportFilters, setExportFilters] = useState({
        userType: 'all',
        department: 'all',
        status: 'all',
        dateRange: 'all'
    });

    // Dummy import history data
    const [importHistory] = useState([
        {
            id: 1,
            fileName: "mahasiswa_batch_2024.xlsx",
            type: "import",
            status: "success",
            recordsProcessed: 150,
            recordsSuccess: 145,
            recordsError: 5,
            timestamp: "2024-06-15T10:30:00",
            uploadedBy: "Admin System",
            size: "2.3 MB"
        },
        {
            id: 2,
            fileName: "dosen_data_update.csv",
            type: "import",
            status: "warning",
            recordsProcessed: 25,
            recordsSuccess: 22,
            recordsError: 3,
            timestamp: "2024-06-10T14:22:00",
            uploadedBy: "Super Admin",
            size: "1.1 MB"
        },
        {
            id: 3,
            fileName: "all_users_backup.xlsx",
            type: "export",
            status: "success",
            recordsProcessed: 500,
            recordsSuccess: 500,
            recordsError: 0,
            timestamp: "2024-06-08T09:15:00",
            uploadedBy: "Admin System",
            size: "5.8 MB"
        },
        {
            id: 4,
            fileName: "student_import_failed.csv",
            type: "import",
            status: "error",
            recordsProcessed: 75,
            recordsSuccess: 0,
            recordsError: 75,
            timestamp: "2024-06-05T16:45:00",
            uploadedBy: "Admin User",
            size: "800 KB"
        }
    ]);

    // Dummy preview data
    const samplePreviewData = [
        {
            id: 1,
            name: "Ahmad Fauzi Rahman",
            email: "ahmad.fauzi@student.univ.ac.id",
            nim: "2021010101",
            department: "Teknik Informatika",
            year: "2021",
            status: "Valid",
            errors: []
        },
        {
            id: 2,
            name: "Sarah Wijaya",
            email: "sarah.wijaya@student.univ.ac.id",
            nim: "2022010102",
            department: "Sistem Informasi",
            year: "2022",
            status: "Valid",
            errors: []
        },
        {
            id: 3,
            name: "Budi Santoso",
            email: "invalid-email",
            nim: "2021010103",
            department: "Teknik Informatika",
            year: "2021",
            status: "Error",
            errors: ["Email format tidak valid"]
        },
        {
            id: 4,
            name: "",
            email: "rina.melati@student.univ.ac.id",
            nim: "2020010104",
            department: "Manajemen Informatika",
            year: "2020",
            status: "Error",
            errors: ["Nama tidak boleh kosong"]
        }
    ];

    useEffect(() => {
        AOS.init({
            duration: 800,
            offset: 100,
            easing: 'ease-in-out',
            once: true
        });
    }, []);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImportFile(file);
            // Simulate file preview
            setPreviewData(samplePreviewData);
            setShowPreview(true);
        }
    };

    const handleImport = async () => {
        if (!importFile) return;

        setIsImporting(true);
        setImportProgress(0);

        // Simulate import progress
        const interval = setInterval(() => {
            setImportProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsImporting(false);
                    setImportResults({
                        total: 4,
                        success: 2,
                        errors: 2,
                        details: samplePreviewData
                    });
                    return 100;
                }
                return prev + 10;
            });
        }, 200);
    };

    const handleExport = async () => {
        setIsExporting(true);
        setExportProgress(0);

        // Simulate export progress
        const interval = setInterval(() => {
            setExportProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsExporting(false);
                    // Simulate file download
                    const link = document.createElement('a');
                    link.href = '#';
                    link.download = 'users_export.xlsx';
                    link.click();
                    return 100;
                }
                return prev + 15;
            });
        }, 300);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'success': return 'bg-green-100 text-green-800';
            case 'error': return 'bg-red-100 text-red-800';
            case 'warning': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'success': return <MdCheckCircle className="w-4 h-4" />;
            case 'error': return <MdError className="w-4 h-4" />;
            case 'warning': return <MdWarning className="w-4 h-4" />;
            default: return <MdInfo className="w-4 h-4" />;
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const stats = [
        {
            title: "Total Import",
            value: importHistory.filter(h => h.type === 'import').length,
            change: "+2 bulan ini",
            icon: MdFileUpload,
            color: "bg-gradient-to-r from-blue-500 to-blue-600"
        },
        {
            title: "Total Export",
            value: importHistory.filter(h => h.type === 'export').length,
            change: "+1 bulan ini",
            icon: MdFileDownload,
            color: "bg-gradient-to-r from-green-500 to-green-600"
        },
        {
            title: "Berhasil Diproses",
            value: importHistory.reduce((sum, h) => sum + h.recordsSuccess, 0),
            change: "672 total record",
            icon: MdCheckCircle,
            color: "bg-gradient-to-r from-emerald-500 to-emerald-600"
        },
        {
            title: "Error Record",
            value: importHistory.reduce((sum, h) => sum + h.recordsError, 0),
            change: "83 total error",
            icon: MdErrorOutline,
            color: "bg-gradient-to-r from-red-500 to-red-600"
        }
    ];

    const tabs = [
        { id: 'import', label: 'Import Data', icon: MdFileUpload },
        { id: 'export', label: 'Export Data', icon: MdFileDownload },
        { id: 'history', label: 'Riwayat', icon: MdHistory }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 p-4 md:p-8">
            {/* Header */}
            <div className="mb-8" data-aos="fade-down">
                <div className="flex items-center gap-4 mb-6">
                    <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-3 rounded-xl text-white">
                        <MdImportExport className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                            Import & Export Pengguna
                        </h1>
                        <p className="text-gray-600 text-lg">Kelola data pengguna dengan import dan export file</p>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100"
                        data-aos="fade-up"
                        data-aos-delay={index * 100}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium mb-1">{stat.title}</p>
                                <h3 className="text-3xl font-bold text-gray-800">{stat.value}</h3>
                                <p className="text-gray-500 text-sm mt-1">{stat.change}</p>
                            </div>
                            <div className={`${stat.color} p-3 rounded-xl text-white`}>
                                <stat.icon className="w-8 h-8" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white rounded-2xl shadow-lg mb-8 border border-gray-100" data-aos="fade-up">
                <div className="flex flex-wrap border-b border-gray-200">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-4 font-medium transition-all duration-300 ${activeTab === tab.id
                                    ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                                    : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
                                }`}
                        >
                            <tab.icon className="w-5 h-5" />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Container */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100" data-aos="fade-up" data-aos-delay="200">
                <div className="p-8">
                    {/* Import Tab */}
                    {activeTab === 'import' && (
                        <div className="space-y-8" data-aos="fade-right">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">Import Data Pengguna</h2>
                                <p className="text-gray-600">Upload file CSV atau Excel untuk menambahkan data pengguna secara massal</p>
                            </div>

                            {/* Upload Area */}
                            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-purple-500 transition-colors duration-300">
                                <div className="max-w-md mx-auto">
                                    <MdCloudUpload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                        {importFile ? importFile.name : 'Pilih file untuk diupload'}
                                    </h3>
                                    <p className="text-gray-500 mb-6">
                                        Drag & drop file atau klik untuk memilih
                                        <br />
                                        <span className="text-sm">Mendukung format: .csv, .xlsx, .xls (Max: 10MB)</span>
                                    </p>
                                    <label className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-lg cursor-pointer hover:from-purple-700 hover:to-purple-800 transition-all duration-300">
                                        <MdFileUpload className="w-5 h-5" />
                                        Pilih File
                                        <input
                                            type="file"
                                            accept=".csv,.xlsx,.xls"
                                            onChange={handleFileUpload}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                            </div>

                            {/* File Preview */}
                            {showPreview && (
                                <div className="bg-gray-50 rounded-2xl p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-gray-800">Preview Data</h3>
                                        <button
                                            onClick={() => setShowPreview(false)}
                                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                                        >
                                            <MdClose className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-sm">
                                            <thead className="bg-gray-100">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">NIM</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jurusan</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {previewData.map((row, index) => (
                                                    <tr key={index} className={row.status === 'Error' ? 'bg-red-50' : ''}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.name}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.email}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.nim}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.department}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${row.status === 'Valid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                                }`}>
                                                                {row.status === 'Valid' ? <MdCheckCircle className="w-3 h-3" /> : <MdError className="w-3 h-3" />}
                                                                {row.status}
                                                            </span>
                                                            {row.errors.length > 0 && (
                                                                <div className="text-xs text-red-600 mt-1">
                                                                    {row.errors.join(', ')}
                                                                </div>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="flex justify-between items-center mt-6">
                                        <div className="text-sm text-gray-600">
                                            <span className="font-medium text-green-600">2 valid</span>,
                                            <span className="font-medium text-red-600 ml-1">2 error</span> dari 4 record
                                        </div>
                                        <button
                                            onClick={handleImport}
                                            disabled={isImporting}
                                            className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2"
                                        >
                                            {isImporting ? <MdRefresh className="w-5 h-5 animate-spin" /> : <MdPublish className="w-5 h-5" />}
                                            {isImporting ? 'Memproses...' : 'Mulai Import'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Import Progress */}
                            {isImporting && (
                                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-blue-800">Sedang Memproses Import</h3>
                                        <span className="text-sm text-blue-600">{importProgress}%</span>
                                    </div>
                                    <div className="w-full bg-blue-200 rounded-full h-3">
                                        <div
                                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300"
                                            style={{ width: `${importProgress}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-blue-700 text-sm mt-2">Memproses data pengguna...</p>
                                </div>
                            )}

                            {/* Import Results */}
                            {importResults && (
                                <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                                    <div className="flex items-center gap-3 mb-4">
                                        <MdCheckCircle className="w-6 h-6 text-green-600" />
                                        <h3 className="text-lg font-semibold text-green-800">Import Selesai</h3>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4 mb-4">
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-gray-800">{importResults.total}</p>
                                            <p className="text-sm text-gray-600">Total Record</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-green-600">{importResults.success}</p>
                                            <p className="text-sm text-gray-600">Berhasil</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-red-600">{importResults.errors}</p>
                                            <p className="text-sm text-gray-600">Error</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setImportResults(null)}
                                        className="text-green-700 hover:text-green-900 text-sm font-medium"
                                    >
                                        Tutup
                                    </button>
                                </div>
                            )}

                            {/* Template Download */}
                            <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-200">
                                <div className="flex items-start gap-4">
                                    <MdInfo className="w-6 h-6 text-yellow-600 mt-1" />
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-yellow-800 mb-2">Template Import</h3>
                                        <p className="text-yellow-700 mb-4">
                                            Download template untuk memastikan format data yang benar sebelum melakukan import.
                                        </p>
                                        <div className="flex gap-3">
                                            <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors duration-200 flex items-center gap-2">
                                                <MdGetApp className="w-4 h-4" />
                                                Template Mahasiswa
                                            </button>
                                            <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors duration-200 flex items-center gap-2">
                                                <MdGetApp className="w-4 h-4" />
                                                Template Dosen
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Export Tab */}
                    {activeTab === 'export' && (
                        <div className="space-y-8" data-aos="fade-right">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">Export Data Pengguna</h2>
                                <p className="text-gray-600">Export data pengguna ke dalam file Excel atau CSV</p>
                            </div>

                            {/* Export Filters */}
                            <div className="bg-gray-50 rounded-2xl p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Filter Data Export</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Tipe Pengguna</label>
                                        <select
                                            value={exportFilters.userType}
                                            onChange={(e) => setExportFilters({ ...exportFilters, userType: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                        >
                                            <option value="all">Semua</option>
                                            <option value="mahasiswa">Mahasiswa</option>
                                            <option value="dosen">Dosen</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Jurusan</label>
                                        <select
                                            value={exportFilters.department}
                                            onChange={(e) => setExportFilters({ ...exportFilters, department: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                        >
                                            <option value="all">Semua Jurusan</option>
                                            <option value="teknik-informatika">Teknik Informatika</option>
                                            <option value="sistem-informasi">Sistem Informasi</option>
                                            <option value="manajemen-informatika">Manajemen Informatika</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                        <select
                                            value={exportFilters.status}
                                            onChange={(e) => setExportFilters({ ...exportFilters, status: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                        >
                                            <option value="all">Semua Status</option>
                                            <option value="active">Aktif</option>
                                            <option value="inactive">Tidak Aktif</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Rentang Tanggal</label>
                                        <select
                                            value={exportFilters.dateRange}
                                            onChange={(e) => setExportFilters({ ...exportFilters, dateRange: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                        >
                                            <option value="all">Semua</option>
                                            <option value="today">Hari Ini</option>
                                            <option value="week">Minggu Ini</option>
                                            <option value="month">Bulan Ini</option>
                                            <option value="year">Tahun Ini</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Export Options */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="bg-green-600 p-3 rounded-xl text-white">
                                            <MdTableChart className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800">Export ke Excel</h3>
                                            <p className="text-gray-600 text-sm">Format .xlsx dengan formatting lengkap</p>
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-600 mb-4">
                                        <p>• Data terstruktur dengan header</p>
                                        <p>• Mendukung formula dan formatting</p>
                                        <p>• Ukuran file lebih besar</p>
                                    </div>
                                    <button
                                        onClick={handleExport}
                                        disabled={isExporting}
                                        className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg hover:from-green-700 hover:to-green-800 disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        <MdFileDownload className="w-5 h-5" />
                                        Export Excel
                                    </button>
                                </div>

                                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="bg-blue-600 p-3 rounded-xl text-white">
                                            <MdDescription className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800">Export ke CSV</h3>
                                            <p className="text-gray-600 text-sm">Format .csv untuk kompatibilitas universal</p>
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-600 mb-4">
                                        <p>• Format ringan dan portable</p>
                                        <p>• Kompatibel dengan semua aplikasi</p>
                                        <p>• Ukuran file lebih kecil</p>
                                    </div>
                                    <button
                                        onClick={handleExport}
                                        disabled={isExporting}
                                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        <MdFileDownload className="w-5 h-5" />
                                        Export CSV
                                    </button>
                                </div>
                            </div>

                            {/* Export Progress */}
                            {isExporting && (
                                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-blue-800">Sedang Memproses Export</h3>
                                        <span className="text-sm text-blue-600">{exportProgress}%</span>
                                    </div>
                                    <div className="w-full bg-blue-200 rounded-full h-3">
                                        <div
                                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300"
                                            style={{ width: `${exportProgress}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-blue-700 text-sm mt-2">Menyiapkan file download...</p>
                                </div>
                            )}

                            {/* Export Preview */}
                            <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200">
                                <div className="flex items-center gap-3 mb-4">
                                    <MdVisibility className="w-6 h-6 text-purple-600" />
                                    <h3 className="text-lg font-semibold text-purple-800">Preview Data Export</h3>
                                </div>
                                <div className="text-sm text-purple-700 mb-4">
                                    Berdasarkan filter yang dipilih, akan diekspor:
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="text-center bg-white rounded-lg p-4">
                                        <p className="text-2xl font-bold text-gray-800">250</p>
                                        <p className="text-sm text-gray-600">Total Pengguna</p>
                                    </div>
                                    <div className="text-center bg-white rounded-lg p-4">
                                        <p className="text-2xl font-bold text-blue-600">180</p>
                                        <p className="text-sm text-gray-600">Mahasiswa</p>
                                    </div>
                                    <div className="text-center bg-white rounded-lg p-4">
                                        <p className="text-2xl font-bold text-purple-600">70</p>
                                        <p className="text-sm text-gray-600">Dosen</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* History Tab */}
                    {activeTab === 'history' && (
                        <div className="space-y-6" data-aos="fade-right">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">Riwayat Import & Export</h2>
                                <p className="text-gray-600">Lihat riwayat semua aktivitas import dan export data</p>
                            </div>

                            <div className="space-y-4">
                                {importHistory.map((item, index) => (
                                    <div key={item.id} className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors duration-200">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-3 rounded-xl ${item.type === 'import' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                                                    }`}>
                                                    {item.type === 'import' ? <MdFileUpload className="w-6 h-6" /> : <MdFileDownload className="w-6 h-6" />}
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-800">{item.fileName}</h3>
                                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                                        <span>{formatDate(item.timestamp)}</span>
                                                        <span>•</span>
                                                        <span>{item.uploadedBy}</span>
                                                        <span>•</span>
                                                        <span>{item.size}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(item.status)}`}>
                                                    {getStatusIcon(item.status)}
                                                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                                </span>
                                                <div className="text-sm text-gray-600 mt-1">
                                                    {item.recordsSuccess}/{item.recordsProcessed} berhasil
                                                </div>
                                            </div>
                                        </div>

                                        {item.recordsError > 0 && (
                                            <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
                                                <div className="flex items-center gap-2 text-red-800">
                                                    <MdError className="w-4 h-4" />
                                                    <span className="text-sm font-medium">{item.recordsError} record gagal diproses</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            <div className="flex justify-center">
                                <div className="flex items-center space-x-2">
                                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                                        Previous
                                    </button>
                                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg">1</button>
                                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">2</button>
                                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">3</button>
                                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImportExportUsers;
