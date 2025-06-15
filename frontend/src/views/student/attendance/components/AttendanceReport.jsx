import React, { useState } from "react";
import { MdFileDownload, MdVisibility, MdDateRange, MdSchool } from "react-icons/md";

const AttendanceReport = () => {
    const [reportType, setReportType] = useState('monthly');
    const [selectedMonth, setSelectedMonth] = useState('01');
    const [selectedCourse, setSelectedCourse] = useState('all');
    const [reportFormat, setReportFormat] = useState('pdf');

    const courses = [
        { id: 'IF301', name: 'Pemrograman Web' },
        { id: 'IF302', name: 'Database Management' },
        { id: 'IF303', name: 'Mobile Development' },
        { id: 'IF304', name: 'Machine Learning' },
        { id: 'IF305', name: 'Software Engineering' }
    ];

    const reportSummary = {
        totalClasses: 52,
        attended: 45,
        absent: 5,
        late: 2,
        percentage: 86.5,
        courseBreakdown: [
            { course: 'Pemrograman Web', attended: 10, total: 12, percentage: 83.3 },
            { course: 'Database Management', attended: 9, total: 10, percentage: 90.0 },
            { course: 'Mobile Development', attended: 8, total: 10, percentage: 80.0 },
            { course: 'Machine Learning', attended: 9, total: 10, percentage: 90.0 },
            { course: 'Software Engineering', attended: 9, total: 10, percentage: 90.0 }
        ]
    };

    const handleDownloadReport = () => {
        // Simulate report download
        alert(`Downloading ${reportType} report in ${reportFormat.toUpperCase()} format...`);
    };

    const handlePreviewReport = () => {
        // Simulate report preview
        alert('Opening report preview...');
    };

    return (
        <div className="space-y-6">
            {/* Report Configuration */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Konfigurasi Laporan</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Jenis Laporan
                        </label>
                        <select
                            value={reportType}
                            onChange={(e) => setReportType(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="monthly">Bulanan</option>
                            <option value="semester">Semester</option>
                            <option value="yearly">Tahunan</option>
                            <option value="custom">Kustom</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Bulan
                        </label>
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="01">Januari</option>
                            <option value="02">Februari</option>
                            <option value="03">Maret</option>
                            <option value="04">April</option>
                            <option value="05">Mei</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mata Kuliah
                        </label>
                        <select
                            value={selectedCourse}
                            onChange={(e) => setSelectedCourse(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">Semua Mata Kuliah</option>
                            {courses.map(course => (
                                <option key={course.id} value={course.id}>{course.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Format
                        </label>
                        <select
                            value={reportFormat}
                            onChange={(e) => setReportFormat(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="pdf">PDF</option>
                            <option value="excel">Excel</option>
                            <option value="csv">CSV</option>
                        </select>
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 mt-6">
                    <button
                        onClick={handlePreviewReport}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center"
                    >
                        <MdVisibility className="h-5 w-5 mr-2" />
                        Preview
                    </button>
                    <button
                        onClick={handleDownloadReport}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center"
                    >
                        <MdFileDownload className="h-5 w-5 mr-2" />
                        Download Laporan
                    </button>
                </div>
            </div>

            {/* Report Summary */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Ringkasan Laporan</h3>

                {/* Overall Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{reportSummary.totalClasses}</div>
                        <div className="text-sm text-gray-600">Total Kelas</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{reportSummary.attended}</div>
                        <div className="text-sm text-gray-600">Hadir</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">{reportSummary.absent}</div>
                        <div className="text-sm text-gray-600">Tidak Hadir</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">{reportSummary.late}</div>
                        <div className="text-sm text-gray-600">Terlambat</div>
                    </div>
                </div>

                {/* Overall Percentage */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-lg font-medium text-gray-800">Persentase Kehadiran Keseluruhan</span>
                        <span className="text-2xl font-bold text-blue-600">{reportSummary.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                        <div
                            className="bg-gradient-to-r from-blue-500 to-green-500 h-4 rounded-full transition-all duration-500"
                            style={{ width: `${reportSummary.percentage}%` }}
                        ></div>
                    </div>
                </div>

                {/* Course Breakdown */}
                <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Breakdown per Mata Kuliah</h4>
                    <div className="space-y-4">
                        {reportSummary.courseBreakdown.map((course, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center">
                                        <MdSchool className="h-5 w-5 text-blue-500 mr-2" />
                                        <span className="font-medium text-gray-800">{course.course}</span>
                                    </div>
                                    <span className="text-sm font-medium text-gray-600">
                                        {course.attended}/{course.total} kelas
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <div className="flex-1 bg-gray-200 rounded-full h-2 mr-4">
                                        <div
                                            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${course.percentage}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-sm font-bold text-gray-800">{course.percentage}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Reports */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Laporan Cepat</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group">
                        <MdDateRange className="h-8 w-8 text-gray-400 group-hover:text-blue-500 mx-auto mb-2" />
                        <div className="text-sm font-medium text-gray-600 group-hover:text-blue-600">
                            Laporan Minggu Ini
                        </div>
                    </button>

                    <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all group">
                        <MdSchool className="h-8 w-8 text-gray-400 group-hover:text-green-500 mx-auto mb-2" />
                        <div className="text-sm font-medium text-gray-600 group-hover:text-green-600">
                            Laporan per Mata Kuliah
                        </div>
                    </button>

                    <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all group">
                        <MdFileDownload className="h-8 w-8 text-gray-400 group-hover:text-purple-500 mx-auto mb-2" />
                        <div className="text-sm font-medium text-gray-600 group-hover:text-purple-600">
                            Laporan Semester
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AttendanceReport;
