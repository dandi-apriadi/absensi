import React, { useState, useEffect } from "react";
import {
    MdImportExport,
    MdFileDownload,
    MdCalendarToday,
    MdPeople,
    MdFilterList,
    MdCheckCircle,
    MdDescription,
    MdTableChart,
    MdPictureAsPdf,
    MdInsertDriveFile
} from "react-icons/md";
import AOS from 'aos';
import 'aos/dist/aos.css';

const AttendanceExport = () => {
    const [selectedFormat, setSelectedFormat] = useState('excel');
    const [selectedDateRange, setSelectedDateRange] = useState('month');
    const [selectedDepartment, setSelectedDepartment] = useState('all');
    const [isExporting, setIsExporting] = useState(false);

    // Dummy data
    const exportFormats = [
        {
            id: 'excel',
            name: 'Excel (.xlsx)',
            icon: MdTableChart,
            description: 'Format tabel yang mudah diedit',
            color: 'bg-green-100 text-green-600 border-green-200'
        },
        {
            id: 'pdf',
            name: 'PDF (.pdf)',
            icon: MdPictureAsPdf,
            description: 'Format dokumen yang tidak dapat diedit',
            color: 'bg-red-100 text-red-600 border-red-200'
        },
        {
            id: 'csv',
            name: 'CSV (.csv)',
            icon: MdInsertDriveFile,
            description: 'Format data terstruktur',
            color: 'bg-blue-100 text-blue-600 border-blue-200'
        }
    ];

    const departments = [
        { id: 'all', name: 'Semua Departemen', count: 156 },
        { id: 'it', name: 'IT Department', count: 24 },
        { id: 'hr', name: 'Human Resources', count: 18 },
        { id: 'finance', name: 'Finance', count: 22 },
        { id: 'marketing', name: 'Marketing', count: 19 },
        { id: 'operations', name: 'Operations', count: 28 },
        { id: 'sales', name: 'Sales', count: 45 }
    ];

    const dateRanges = [
        { id: 'today', name: 'Hari Ini', description: '18 Juni 2025' },
        { id: 'week', name: 'Minggu Ini', description: '12 - 18 Juni 2025' },
        { id: 'month', name: 'Bulan Ini', description: 'Juni 2025' },
        { id: 'quarter', name: 'Kuartal Ini', description: 'Q2 2025' },
        { id: 'custom', name: 'Custom Range', description: 'Pilih tanggal manual' }
    ];

    const recentExports = [
        {
            id: 1,
            filename: 'Attendance_June_2025.xlsx',
            format: 'Excel',
            department: 'Semua Departemen',
            date: '17 Juni 2025',
            size: '2.4 MB',
            status: 'completed'
        },
        {
            id: 2,
            filename: 'IT_Department_Weekly.pdf',
            format: 'PDF',
            department: 'IT Department',
            date: '15 Juni 2025',
            size: '1.8 MB',
            status: 'completed'
        },
        {
            id: 3,
            filename: 'HR_Monthly_Report.csv',
            format: 'CSV',
            department: 'Human Resources',
            date: '10 Juni 2025',
            size: '0.9 MB',
            status: 'completed'
        }
    ];

    const stats = [
        {
            title: 'Total Karyawan',
            value: '156',
            icon: MdPeople,
            color: 'bg-blue-500',
            change: '+5 dari bulan lalu'
        },
        {
            title: 'Data Absensi',
            value: '4,680',
            icon: MdCheckCircle,
            color: 'bg-green-500',
            change: 'Bulan ini'
        },
        {
            title: 'Export Bulan Ini',
            value: '24',
            icon: MdFileDownload,
            color: 'bg-purple-500',
            change: '+12 dari bulan lalu'
        }
    ];

    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true
        });
    }, []);

    const handleExport = async () => {
        setIsExporting(true);
        // Simulate export process
        setTimeout(() => {
            setIsExporting(false);
            // You can add success notification here
        }, 3000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
            {/* Header Section */}
            <div className="mb-8" data-aos="fade-down">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
                        <MdImportExport className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                            Export Absensi
                        </h1>
                        <p className="text-gray-600 text-lg">Export dan analisis data kehadiran karyawan</p>
                    </div>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100"
                        data-aos="fade-up"
                        data-aos-delay={index * 100}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                                <p className="text-3xl font-bold text-gray-800 mt-1">{stat.value}</p>
                                <p className="text-gray-500 text-xs mt-2">{stat.change}</p>
                            </div>
                            <div className={`p-4 rounded-2xl ${stat.color} shadow-lg`}>
                                <stat.icon className="h-8 w-8 text-white" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Export Configuration */}
                <div className="xl:col-span-2 space-y-6">
                    {/* Format Selection */}
                    <div
                        className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
                        data-aos="fade-right"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <MdDescription className="h-6 w-6 text-blue-500" />
                            <h2 className="text-2xl font-bold text-gray-800">Pilih Format Export</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {exportFormats.map((format) => (
                                <div
                                    key={format.id}
                                    className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${selectedFormat === format.id
                                            ? `${format.color} shadow-lg`
                                            : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                                        }`}
                                    onClick={() => setSelectedFormat(format.id)}
                                >
                                    <div className="flex flex-col items-center text-center">
                                        <format.icon className={`h-12 w-12 mb-3 ${selectedFormat === format.id ? '' : 'text-gray-400'
                                            }`} />
                                        <h3 className="font-bold text-lg mb-2">{format.name}</h3>
                                        <p className="text-sm text-gray-600">{format.description}</p>
                                    </div>
                                    {selectedFormat === format.id && (
                                        <div className="absolute top-3 right-3">
                                            <MdCheckCircle className="h-6 w-6 text-green-500" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Date Range Selection */}
                    <div
                        className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
                        data-aos="fade-right"
                        data-aos-delay="100"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <MdCalendarToday className="h-6 w-6 text-blue-500" />
                            <h2 className="text-2xl font-bold text-gray-800">Periode Data</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {dateRanges.map((range) => (
                                <div
                                    key={range.id}
                                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${selectedDateRange === range.id
                                            ? 'border-blue-500 bg-blue-50 shadow-md'
                                            : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                                        }`}
                                    onClick={() => setSelectedDateRange(range.id)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-semibold text-gray-800">{range.name}</h3>
                                            <p className="text-sm text-gray-600 mt-1">{range.description}</p>
                                        </div>
                                        {selectedDateRange === range.id && (
                                            <MdCheckCircle className="h-5 w-5 text-blue-500" />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Department Selection */}
                    <div
                        className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
                        data-aos="fade-right"
                        data-aos-delay="200"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <MdFilterList className="h-6 w-6 text-blue-500" />
                            <h2 className="text-2xl font-bold text-gray-800">Filter Departemen</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {departments.map((dept) => (
                                <div
                                    key={dept.id}
                                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${selectedDepartment === dept.id
                                            ? 'border-green-500 bg-green-50 shadow-md'
                                            : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                                        }`}
                                    onClick={() => setSelectedDepartment(dept.id)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-semibold text-gray-800">{dept.name}</h3>
                                            <p className="text-sm text-gray-600">{dept.count} karyawan</p>
                                        </div>
                                        {selectedDepartment === dept.id && (
                                            <MdCheckCircle className="h-5 w-5 text-green-500" />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Export Button */}
                    <div
                        className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
                        data-aos="fade-up"
                        data-aos-delay="300"
                    >
                        <button
                            onClick={handleExport}
                            disabled={isExporting}
                            className={`w-full py-4 px-8 rounded-xl font-bold text-lg transition-all duration-300 ${isExporting
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                                } text-white`}
                        >
                            {isExporting ? (
                                <div className="flex items-center justify-center gap-3">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                    <span>Mengexport...</span>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-3">
                                    <MdFileDownload className="h-6 w-6" />
                                    <span>Export Data Absensi</span>
                                </div>
                            )}
                        </button>
                    </div>
                </div>

                {/* Recent Exports Sidebar */}
                <div className="space-y-6">
                    <div
                        className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
                        data-aos="fade-left"
                    >
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Export Terbaru</h2>

                        <div className="space-y-4">
                            {recentExports.map((export_item, index) => (
                                <div
                                    key={export_item.id}
                                    className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-300 hover:border-gray-300"
                                    data-aos="fade-left"
                                    data-aos-delay={index * 100}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-800 mb-1 text-sm">
                                                {export_item.filename}
                                            </h3>
                                            <div className="space-y-1">
                                                <p className="text-xs text-gray-600">
                                                    <span className="font-medium">Format:</span> {export_item.format}
                                                </p>
                                                <p className="text-xs text-gray-600">
                                                    <span className="font-medium">Dept:</span> {export_item.department}
                                                </p>
                                                <p className="text-xs text-gray-600">
                                                    <span className="font-medium">Tanggal:</span> {export_item.date}
                                                </p>
                                                <p className="text-xs text-gray-600">
                                                    <span className="font-medium">Ukuran:</span> {export_item.size}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="ml-3">
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Selesai
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button className="w-full mt-4 py-2 px-4 text-blue-600 hover:text-blue-700 font-medium text-sm border border-blue-200 rounded-xl hover:bg-blue-50 transition-colors duration-300">
                            Lihat Semua Export
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttendanceExport;
