import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Card from "components/card";
import {
    MdFileDownload,
    MdCalendarToday,
    MdPeople,
    MdFilterAlt,
    MdDownload,
    MdPrint,
    MdEmail,
    MdCloudDownload,
    MdInfo,
    MdCheckCircle
} from "react-icons/md";

// Dummy Data
const courses = [
    { id: 1, code: "CS-101", name: "Algoritma dan Pemrograman" },
    { id: 2, code: "CS-102", name: "Basis Data" },
    { id: 3, code: "CS-103", name: "Pemrograman Web" },
    { id: 4, code: "CS-104", name: "Kecerdasan Buatan" },
];

const exportFormats = [
    { id: "excel", name: "Microsoft Excel (.xlsx)", icon: "excel-icon.png" },
    { id: "csv", name: "CSV (.csv)", icon: "csv-icon.png" },
    { id: "pdf", name: "PDF Document (.pdf)", icon: "pdf-icon.png" }
];

const ExportAttendance = () => {
    const [selectedCourse, setSelectedCourse] = useState("all");
    const [dateRange, setDateRange] = useState({ start: "", end: "" });
    const [selectedFormat, setSelectedFormat] = useState("excel");
    const [includeDetails, setIncludeDetails] = useState(true);
    const [includeSummary, setIncludeSummary] = useState(true);
    const [showSuccessMsg, setShowSuccessMsg] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: "ease-in-out",
            once: true,
        });
    }, []);

    const handleExport = () => {
        setIsLoading(true);

        // Simulate export process
        setTimeout(() => {
            setIsLoading(false);
            setShowSuccessMsg(true);
            setTimeout(() => setShowSuccessMsg(false), 3000);
        }, 1500);
    };

    const isFormValid = () => {
        return dateRange.start && dateRange.end;
    };

    return (
        <div className="mt-3">
            <div className="mb-5" data-aos="fade-down">
                <h1 className="text-3xl font-bold text-navy-700 dark:text-white">
                    Export Data Absensi
                </h1>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Download laporan absensi mahasiswa dalam berbagai format
                </p>
            </div>

            {showSuccessMsg && (
                <div className="mb-5 p-4 bg-green-100 border border-green-200 rounded-lg flex items-start" data-aos="fade-up">
                    <MdCheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-2" />
                    <div>
                        <p className="text-green-800">Export berhasil! File laporan siap diunduh.</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                <div className="md:col-span-2">
                    <Card extra="p-5" data-aos="fade-up">
                        <div className="mb-4">
                            <h4 className="text-lg font-bold text-navy-700 dark:text-white flex items-center">
                                <MdFilterAlt className="mr-2 h-5 w-5" /> Filter Data
                            </h4>
                            <p className="text-sm text-gray-600">
                                Pilih data yang ingin diexport
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="text-sm text-navy-700 dark:text-white font-medium mb-2 block">
                                    Mata Kuliah
                                </label>
                                <select
                                    className="w-full rounded-lg border border-gray-300 p-3 text-sm outline-none focus:border-indigo-500"
                                    value={selectedCourse}
                                    onChange={(e) => setSelectedCourse(e.target.value)}
                                >
                                    <option value="all">Semua Mata Kuliah</option>
                                    {courses.map((course) => (
                                        <option key={course.id} value={course.id}>
                                            {course.code} - {course.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-sm text-navy-700 dark:text-white font-medium mb-2 block">
                                    Format Export
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {exportFormats.map((format) => (
                                        <div key={format.id} className="text-center">
                                            <button
                                                className={`w-full p-3 border rounded-lg flex flex-col items-center ${selectedFormat === format.id
                                                        ? "border-indigo-500 bg-indigo-50"
                                                        : "border-gray-200 hover:bg-gray-50"
                                                    }`}
                                                onClick={() => setSelectedFormat(format.id)}
                                            >
                                                <img
                                                    src={`/${format.icon}`}
                                                    alt={format.name}
                                                    className="h-8 w-8 mb-2"
                                                    onError={(e) => {
                                                        e.target.src = `https://via.placeholder.com/32?text=${format.id.toUpperCase()}`;
                                                    }}
                                                />
                                                <span className="text-xs text-gray-700">{format.id.toUpperCase()}</span>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="text-sm text-navy-700 dark:text-white font-medium mb-2 block">
                                Rentang Waktu
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <div className="text-xs text-gray-500 mb-1">Dari Tanggal</div>
                                    <input
                                        type="date"
                                        className="w-full rounded-lg border border-gray-300 p-3 text-sm outline-none focus:border-indigo-500"
                                        value={dateRange.start}
                                        onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500 mb-1">Sampai Tanggal</div>
                                    <input
                                        type="date"
                                        className="w-full rounded-lg border border-gray-300 p-3 text-sm outline-none focus:border-indigo-500"
                                        value={dateRange.end}
                                        onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="text-sm text-navy-700 dark:text-white font-medium mb-2 block">
                                Opsi Tambahan
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="flex items-center">
                                    <input
                                        id="includeSummary"
                                        type="checkbox"
                                        checked={includeSummary}
                                        onChange={() => setIncludeSummary(!includeSummary)}
                                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                    />
                                    <label htmlFor="includeSummary" className="ml-2 text-sm text-gray-700">
                                        Sertakan ringkasan statistik
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        id="includeDetails"
                                        type="checkbox"
                                        checked={includeDetails}
                                        onChange={() => setIncludeDetails(!includeDetails)}
                                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                    />
                                    <label htmlFor="includeDetails" className="ml-2 text-sm text-gray-700">
                                        Sertakan detail per sesi
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                onClick={handleExport}
                                disabled={!isFormValid() || isLoading}
                                className={`py-2 px-6 rounded-lg flex items-center ${isFormValid() && !isLoading
                                        ? "bg-indigo-600 text-white hover:bg-indigo-700"
                                        : "bg-indigo-300 text-white cursor-not-allowed"
                                    }`}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                                        Sedang Mengeksport...
                                    </>
                                ) : (
                                    <>
                                        <MdFileDownload className="mr-2" /> Export Data
                                    </>
                                )}
                            </button>
                        </div>
                    </Card>
                </div>

                <div>
                    <Card extra="p-5" data-aos="fade-up" data-aos-delay="100">
                        <div className="mb-4">
                            <h4 className="text-lg font-bold text-navy-700 dark:text-white flex items-center">
                                <MdInfo className="mr-2 h-5 w-5" /> Pratinjau Export
                            </h4>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200 flex flex-col items-center justify-center">
                            <div className={`text-center py-10 ${isFormValid() ? "" : "opacity-50"}`}>
                                {selectedFormat === "excel" && <MdCloudDownload className="h-16 w-16 mx-auto text-green-600 mb-3" />}
                                {selectedFormat === "csv" && <MdDownload className="h-16 w-16 mx-auto text-orange-600 mb-3" />}
                                {selectedFormat === "pdf" && <MdPrint className="h-16 w-16 mx-auto text-red-600 mb-3" />}

                                <p className="text-sm text-gray-700 mb-1">
                                    {selectedCourse === "all" ? "Semua Mata Kuliah" : courses.find(c => c.id == selectedCourse)?.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {dateRange.start && dateRange.end
                                        ? `${new Date(dateRange.start).toLocaleDateString()} - ${new Date(dateRange.end).toLocaleDateString()}`
                                        : "Pilih rentang tanggal"}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center">
                                <div className="rounded-full bg-green-100 p-2 mr-3 flex-shrink-0">
                                    <MdCalendarToday className="h-4 w-4 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Periode</p>
                                    <p className="text-sm">
                                        {dateRange.start && dateRange.end
                                            ? `${new Date(dateRange.start).toLocaleDateString('id-ID')} - ${new Date(dateRange.end).toLocaleDateString('id-ID')}`
                                            : "Belum dipilih"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <div className="rounded-full bg-purple-100 p-2 mr-3 flex-shrink-0">
                                    <MdPeople className="h-4 w-4 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Total Data</p>
                                    <p className="text-sm">
                                        {selectedCourse === "all"
                                            ? "Data dari semua mata kuliah"
                                            : `Data dari ${courses.find(c => c.id == selectedCourse)?.name}`}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <div className="rounded-full bg-blue-100 p-2 mr-3 flex-shrink-0">
                                    <MdFileDownload className="h-4 w-4 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Format File</p>
                                    <p className="text-sm">
                                        {exportFormats.find(f => f.id === selectedFormat)?.name}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card extra="p-5 mt-5" data-aos="fade-up" data-aos-delay="200">
                        <div className="mb-4">
                            <h4 className="text-lg font-bold text-navy-700 dark:text-white flex items-center">
                                <MdEmail className="mr-2 h-5 w-5" /> Laporan Terjadwal
                            </h4>
                        </div>

                        <p className="text-sm text-gray-600 mb-4">
                            Jadwalkan laporan absensi untuk dikirim ke email Anda secara berkala
                        </p>

                        <button
                            onClick={() => alert("Fitur akan datang!")}
                            className="w-full py-2 px-4 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                        >
                            Atur Laporan Terjadwal
                        </button>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ExportAttendance;
