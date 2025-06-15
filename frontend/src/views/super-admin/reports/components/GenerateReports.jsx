import React, { useEffect, useState } from "react";
import { MdFilterList, MdCalendarToday, MdDownload, MdEmail, MdPrint, MdPreview, MdAdd, MdTune, MdSave } from "react-icons/md";
import AOS from "aos";
import "aos/dist/aos.css";

const GenerateReports = () => {
    const [reportType, setReportType] = useState("attendance");
    const [timeRange, setTimeRange] = useState("last30");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [selectedProgram, setSelectedProgram] = useState("all");
    const [selectedBatch, setSelectedBatch] = useState("all");
    const [reportFormat, setReportFormat] = useState("pdf");
    const [includeCharts, setIncludeCharts] = useState(true);
    const [includeDetails, setIncludeDetails] = useState(true);
    const [includeSummary, setIncludeSummary] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
        });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsGenerating(true);

        // Simulate report generation
        setTimeout(() => {
            setIsGenerating(false);
            setShowPreview(true);
        }, 2000);
    };

    const reportTypes = [
        { id: "attendance", name: "Laporan Absensi", description: "Rekap kehadiran mahasiswa dalam periode tertentu" },
        { id: "students", name: "Laporan Mahasiswa", description: "Daftar mahasiswa dan status dataset wajah" },
        { id: "rooms", name: "Laporan Akses Ruangan", description: "Data penggunaan dan akses ruangan" },
        { id: "analytics", name: "Laporan Analitik", description: "Analisis dan tren kehadiran" },
        { id: "dataset", name: "Laporan Dataset Wajah", description: "Status dan kelengkapan dataset wajah" },
    ];

    return (
        <div className="p-4 md:p-8">
            <div className="mb-8" data-aos="fade-down">
                <h1 className="text-3xl font-bold text-gray-800">Generate Laporan</h1>
                <p className="text-gray-600">Buat laporan kustom sesuai kebutuhan Anda</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Report Configuration Form */}
                <div className="lg:col-span-1 bg-white rounded-xl shadow-md p-6" data-aos="fade-up">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Parameter Laporan</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            {/* Report Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Laporan</label>
                                <div className="space-y-2">
                                    {reportTypes.map((type) => (
                                        <div key={type.id} className="flex items-center">
                                            <input
                                                type="radio"
                                                id={`type-${type.id}`}
                                                name="reportType"
                                                value={type.id}
                                                checked={reportType === type.id}
                                                onChange={() => setReportType(type.id)}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                            />
                                            <label htmlFor={`type-${type.id}`} className="ml-2 block">
                                                <div className="text-sm font-medium text-gray-800">{type.name}</div>
                                                <div className="text-xs text-gray-500">{type.description}</div>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Time Range */}
                            <div>
                                <label htmlFor="timeRange" className="block text-sm font-medium text-gray-700 mb-1">Rentang Waktu</label>
                                <select
                                    id="timeRange"
                                    value={timeRange}
                                    onChange={(e) => setTimeRange(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="last7">7 Hari Terakhir</option>
                                    <option value="last30">30 Hari Terakhir</option>
                                    <option value="currentMonth">Bulan Ini</option>
                                    <option value="lastMonth">Bulan Lalu</option>
                                    <option value="currentSemester">Semester Ini</option>
                                    <option value="custom">Kustom</option>
                                </select>
                            </div>

                            {/* Custom Date Range */}
                            {timeRange === "custom" && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai</label>
                                        <div className="relative">
                                            <MdCalendarToday className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="date"
                                                id="startDate"
                                                value={startDate}
                                                onChange={(e) => setStartDate(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">Tanggal Selesai</label>
                                        <div className="relative">
                                            <MdCalendarToday className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="date"
                                                id="endDate"
                                                value={endDate}
                                                onChange={(e) => setEndDate(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Program & Batch */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="program" className="block text-sm font-medium text-gray-700 mb-1">Program Studi</label>
                                    <div className="relative">
                                        <MdFilterList className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <select
                                            id="program"
                                            value={selectedProgram}
                                            onChange={(e) => setSelectedProgram(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="all">Semua Program</option>
                                            <option value="informatics">Teknik Informatika</option>
                                            <option value="is">Sistem Informasi</option>
                                            <option value="cs">Ilmu Komputer</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="batch" className="block text-sm font-medium text-gray-700 mb-1">Angkatan</label>
                                    <div className="relative">
                                        <MdFilterList className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <select
                                            id="batch"
                                            value={selectedBatch}
                                            onChange={(e) => setSelectedBatch(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="all">Semua Angkatan</option>
                                            <option value="2024">2024</option>
                                            <option value="2023">2023</option>
                                            <option value="2022">2022</option>
                                            <option value="2021">2021</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Report Format */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Format Laporan</label>
                                <div className="flex space-x-4">
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            id="format-pdf"
                                            name="reportFormat"
                                            value="pdf"
                                            checked={reportFormat === "pdf"}
                                            onChange={() => setReportFormat("pdf")}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                        />
                                        <label htmlFor="format-pdf" className="ml-2 block text-sm text-gray-700">PDF</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            id="format-excel"
                                            name="reportFormat"
                                            value="excel"
                                            checked={reportFormat === "excel"}
                                            onChange={() => setReportFormat("excel")}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                        />
                                        <label htmlFor="format-excel" className="ml-2 block text-sm text-gray-700">Excel</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            id="format-csv"
                                            name="reportFormat"
                                            value="csv"
                                            checked={reportFormat === "csv"}
                                            onChange={() => setReportFormat("csv")}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                        />
                                        <label htmlFor="format-csv" className="ml-2 block text-sm text-gray-700">CSV</label>
                                    </div>
                                </div>
                            </div>

                            {/* Report Components */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Komponen Laporan</label>
                                <div className="space-y-2">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="includeSummary"
                                            checked={includeSummary}
                                            onChange={(e) => setIncludeSummary(e.target.checked)}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="includeSummary" className="ml-2 block text-sm text-gray-700">Ringkasan Eksekutif</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="includeDetails"
                                            checked={includeDetails}
                                            onChange={(e) => setIncludeDetails(e.target.checked)}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="includeDetails" className="ml-2 block text-sm text-gray-700">Data Detail</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="includeCharts"
                                            checked={includeCharts}
                                            onChange={(e) => setIncludeCharts(e.target.checked)}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="includeCharts" className="ml-2 block text-sm text-gray-700">Grafik & Visualisasi</label>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col space-y-2">
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white py-2 px-4 rounded-lg flex justify-center items-center hover:bg-blue-700 transition-colors"
                                    disabled={isGenerating}
                                >
                                    {isGenerating ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                            </svg>
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <MdAdd className="mr-2" /> Generate Report
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg flex justify-center items-center hover:bg-gray-200 transition-colors"
                                >
                                    <MdTune className="mr-2" /> Reset Filters
                                </button>
                                <button
                                    type="button"
                                    className="bg-green-600 text-white py-2 px-4 rounded-lg flex justify-center items-center hover:bg-green-700 transition-colors"
                                >
                                    <MdSave className="mr-2" /> Save As Template
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Report Preview */}
                <div className="lg:col-span-2" data-aos="fade-up" data-aos-delay="100">
                    <div className="bg-white rounded-xl shadow-md p-6 h-full">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-800">Preview Laporan</h2>
                            <div className="flex space-x-2">
                                <button className="text-gray-700 hover:text-gray-900">
                                    <MdPreview className="h-5 w-5" />
                                </button>
                                <button className="text-gray-700 hover:text-gray-900">
                                    <MdDownload className="h-5 w-5" />
                                </button>
                                <button className="text-gray-700 hover:text-gray-900">
                                    <MdEmail className="h-5 w-5" />
                                </button>
                                <button className="text-gray-700 hover:text-gray-900">
                                    <MdPrint className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        {showPreview ? (
                            <div className="border border-gray-200 rounded-lg p-4 h-[600px] overflow-auto bg-gray-50">
                                {/* Report Header */}
                                <div className="border-b border-gray-300 pb-4 mb-4">
                                    <div className="text-center">
                                        <h1 className="text-xl font-bold text-gray-800">Laporan Absensi Mahasiswa</h1>
                                        <p className="text-sm text-gray-600">Periode: 15 April 2025 - 15 Mei 2025</p>
                                        <p className="text-sm text-gray-600">Program Studi: Semua Program</p>
                                        <p className="text-sm text-gray-600">Dihasilkan pada: 15 Mei 2025, 13:45:22</p>
                                    </div>
                                </div>

                                {/* Report Summary */}
                                {includeSummary && (
                                    <div className="mb-6">
                                        <h2 className="text-lg font-semibold text-gray-800 mb-2">Ringkasan Eksekutif</h2>
                                        <div className="grid grid-cols-3 gap-4 mb-4">
                                            <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
                                                <div className="text-2xl font-bold text-blue-600">87.5%</div>
                                                <div className="text-sm text-gray-600">Rata-rata Kehadiran</div>
                                            </div>
                                            <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
                                                <div className="text-2xl font-bold text-green-600">92.1%</div>
                                                <div className="text-sm text-gray-600">Kehadiran Tertinggi</div>
                                            </div>
                                            <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
                                                <div className="text-2xl font-bold text-red-600">78.3%</div>
                                                <div className="text-sm text-gray-600">Kehadiran Terendah</div>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-700">
                                            Tingkat rata-rata kehadiran mahasiswa selama periode 15 April hingga 15 Mei 2025 adalah 87.5%,
                                            naik 2.3% dibandingkan dengan periode sebelumnya. Program studi Teknik Informatika mencatat tingkat
                                            kehadiran tertinggi dengan 92.1%, sementara Ilmu Komputer mencatat tingkat kehadiran terendah dengan 78.3%.

                                            Terdapat 35 mahasiswa yang mencapai tingkat kehadiran 100%, meningkat dari 28 mahasiswa pada periode sebelumnya.
                                            Terdapat 15 mahasiswa dengan kehadiran di bawah 75% yang memerlukan perhatian khusus.
                                        </p>
                                    </div>
                                )}

                                {/* Charts */}
                                {includeCharts && (
                                    <div className="mb-6">
                                        <h2 className="text-lg font-semibold text-gray-800 mb-2">Visualisasi Data</h2>
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                                                <h3 className="text-sm font-medium text-gray-700 mb-2">Kehadiran per Program Studi</h3>
                                                <div className="h-40 bg-gray-100 flex items-center justify-center">
                                                    <p className="text-gray-500">[Bar Chart Placeholder]</p>
                                                </div>
                                            </div>
                                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                                                <h3 className="text-sm font-medium text-gray-700 mb-2">Tren Kehadiran Harian</h3>
                                                <div className="h-40 bg-gray-100 flex items-center justify-center">
                                                    <p className="text-gray-500">[Line Chart Placeholder]</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Detailed Data */}
                                {includeDetails && (
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-800 mb-2">Data Detail</h2>
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No.</th>
                                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIM</th>
                                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program</th>
                                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Kehadiran</th>
                                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Persentase</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {[
                                                        { nim: "2021010101", name: "Ahmad Fauzi", program: "Teknik Informatika", total: "20/20", percentage: "100%" },
                                                        { nim: "2021010102", name: "Siti Nurhaliza", program: "Teknik Informatika", total: "19/20", percentage: "95%" },
                                                        { nim: "2021010201", name: "Budi Santoso", program: "Sistem Informasi", total: "18/20", percentage: "90%" },
                                                        { nim: "2020010101", name: "Indah Permata", program: "Teknik Informatika", total: "17/20", percentage: "85%" },
                                                        { nim: "2020010105", name: "Rudi Hermawan", program: "Sistem Informasi", total: "15/20", percentage: "75%" },
                                                        { nim: "2022010101", name: "Dewi Lestari", program: "Teknik Informatika", total: "18/20", percentage: "90%" },
                                                        { nim: "2022010102", name: "Muhammad Rizki", program: "Sistem Informasi", total: "16/20", percentage: "80%" },
                                                        { nim: "2022010103", name: "Anisa Rahmawati", program: "Teknik Informatika", total: "19/20", percentage: "95%" },
                                                    ].map((student, index) => (
                                                        <tr key={index} className="hover:bg-gray-50">
                                                            <td className="px-4 py-2 text-sm text-gray-900">{index + 1}</td>
                                                            <td className="px-4 py-2 text-sm text-gray-900">{student.nim}</td>
                                                            <td className="px-4 py-2 text-sm text-gray-900">{student.name}</td>
                                                            <td className="px-4 py-2 text-sm text-gray-500">{student.program}</td>
                                                            <td className="px-4 py-2 text-sm text-gray-500">{student.total}</td>
                                                            <td className="px-4 py-2 text-sm font-medium text-gray-900">{student.percentage}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="mt-4 text-right">
                                            <p className="text-sm text-gray-500">Showing 8 of 525 records</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="h-[600px] flex flex-col items-center justify-center text-gray-400">
                                <MdPreview className="h-16 w-16 mb-4" />
                                <p className="text-lg">Laporan akan ditampilkan di sini</p>
                                <p className="text-sm mt-2">Pilih parameter dan klik Generate Report</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GenerateReports;
