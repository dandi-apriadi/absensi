import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Card from "components/card";
import {
    MdSearch,
    MdFilterList,
    MdHistory,
    MdSortByAlpha,
    MdCheckCircle,
    MdCancel,
    MdInfo,
    MdCalendarToday,
    MdAttachFile,
    MdRemoveRedEye,
    MdArrowBack,
    MdArrowForward,
    MdFileDownload,
    MdEvent,
    MdSort
} from "react-icons/md";

// Dummy Data
const processedRequests = [
    {
        id: 1,
        student: { nim: "20210001", name: "Budi Santoso" },
        course: "Algoritma dan Pemrograman",
        date: "2023-10-10",
        type: "sick",
        reason: "Demam tinggi dan flu",
        attachment: "surat-dokter-budi.pdf",
        processedAt: "2023-10-08T15:30:22Z",
        status: "approved",
        comment: "Surat dokter sudah diperiksa, semoga cepat sembuh."
    },
    {
        id: 2,
        student: { nim: "20210002", name: "Siti Nuraini" },
        course: "Basis Data",
        date: "2023-10-09",
        type: "leave",
        reason: "Urusan keluarga penting",
        attachment: "surat-izin-siti.pdf",
        processedAt: "2023-10-07T09:20:10Z",
        status: "approved",
        comment: "Sudah dikonfirmasi dengan orang tua."
    },
    {
        id: 3,
        student: { nim: "20210005", name: "Farhan Abdullah" },
        course: "Pemrograman Web",
        date: "2023-10-08",
        type: "sick",
        reason: "Rawat inap karena demam berdarah",
        attachment: "surat-dokter-farhan.pdf",
        processedAt: "2023-10-06T11:05:45Z",
        status: "approved",
        comment: ""
    },
    {
        id: 4,
        student: { nim: "20210009", name: "Rini Anjani" },
        course: "Algoritma dan Pemrograman",
        date: "2023-10-07",
        type: "leave",
        reason: "Mengikuti kompetisi nasional",
        attachment: "surat-undangan-rini.pdf",
        processedAt: "2023-10-05T16:20:10Z",
        status: "rejected",
        comment: "Undangan tidak resmi, tidak ada cap dari institusi penyelenggara."
    },
    {
        id: 5,
        student: { nim: "20210012", name: "Arif Wijaya" },
        course: "Kecerdasan Buatan",
        date: "2023-10-06",
        type: "sick",
        reason: "Cedera kaki saat olahraga",
        attachment: "surat-dokter-arif.pdf",
        processedAt: "2023-10-04T10:15:30Z",
        status: "approved",
        comment: "Surat dokter sudah diperiksa dan valid."
    },
    {
        id: 6,
        student: { nim: "20210007", name: "Dimas Pratama" },
        course: "Basis Data",
        date: "2023-10-05",
        type: "leave",
        reason: "Acara keluarga",
        attachment: "",
        processedAt: "2023-10-03T14:10:25Z",
        status: "rejected",
        comment: "Tidak ada bukti pendukung yang dilampirkan."
    },
    {
        id: 7,
        student: { nim: "20210008", name: "Ratna Sari" },
        course: "Pemrograman Web",
        date: "2023-10-04",
        type: "sick",
        reason: "Migrain",
        attachment: "surat-dokter-ratna.pdf",
        processedAt: "2023-10-02T09:35:15Z",
        status: "approved",
        comment: ""
    }
];

const courses = [
    { id: 1, code: "CS-101", name: "Algoritma dan Pemrograman" },
    { id: 2, code: "CS-102", name: "Basis Data" },
    { id: 3, code: "CS-103", name: "Pemrograman Web" },
    { id: 4, code: "CS-104", name: "Kecerdasan Buatan" },
];

const ITEMS_PER_PAGE = 5;

const RequestHistory = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCourse, setSelectedCourse] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [selectedType, setSelectedType] = useState("all");
    const [sortField, setSortField] = useState("date");
    const [sortOrder, setSortOrder] = useState("desc");
    const [currentPage, setCurrentPage] = useState(1);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [dateRange, setDateRange] = useState({ start: "", end: "" });

    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: "ease-in-out",
            once: true,
        });
    }, []);

    const handleViewDetails = (request) => {
        setSelectedRequest(request);
        setShowDetailsModal(true);
    };

    // Filter requests based on all filters
    const filteredRequests = processedRequests.filter(request => {
        // Search filter
        const matchesSearch =
            request.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.student.nim.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.reason.toLowerCase().includes(searchTerm.toLowerCase());

        // Course filter
        const matchesCourse = !selectedCourse || request.course === courses.find(c => c.id == selectedCourse)?.name;

        // Status filter
        const matchesStatus = selectedStatus === "all" || request.status === selectedStatus;

        // Type filter
        const matchesType = selectedType === "all" || request.type === selectedType;

        // Date range filter
        let matchesDateRange = true;
        if (dateRange.start && dateRange.end) {
            const requestDate = new Date(request.date);
            const startDate = new Date(dateRange.start);
            const endDate = new Date(dateRange.end);
            endDate.setHours(23, 59, 59); // Include the entire end day

            matchesDateRange = requestDate >= startDate && requestDate <= endDate;
        }

        return matchesSearch && matchesCourse && matchesStatus && matchesType && matchesDateRange;
    });

    // Sort requests
    const sortedRequests = [...filteredRequests].sort((a, b) => {
        let compareResult = 0;

        if (sortField === "date") {
            compareResult = new Date(a.date) - new Date(b.date);
        }
        else if (sortField === "processedAt") {
            compareResult = new Date(a.processedAt) - new Date(b.processedAt);
        }
        else if (sortField === "student") {
            compareResult = a.student.name.localeCompare(b.student.name);
        }

        return sortOrder === "asc" ? compareResult : -compareResult;
    });

    // Paginate requests
    const totalPages = Math.ceil(sortedRequests.length / ITEMS_PER_PAGE);
    const paginatedRequests = sortedRequests.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // Format date
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    // Format date and time
    const formatDateTime = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    return (
        <div className="mt-3">
            <div className="mb-5" data-aos="fade-down">
                <h1 className="text-3xl font-bold text-navy-700 dark:text-white">
                    Riwayat Permintaan Izin
                </h1>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Lihat riwayat permintaan izin yang telah diproses
                </p>
            </div>

            <Card extra="p-5 mb-5" data-aos="fade-up">
                <div className="mb-6">
                    <div className="flex flex-col lg:flex-row gap-4 mb-4">
                        <div className="flex-1 relative">
                            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Cari berdasarkan nama, NIM, atau alasan..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="w-full md:w-64">
                            <select
                                className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 appearance-none"
                                value={selectedCourse}
                                onChange={(e) => setSelectedCourse(e.target.value)}
                            >
                                <option value="">Semua Mata Kuliah</option>
                                {courses.map((course) => (
                                    <option key={course.id} value={course.id}>
                                        {course.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
                        <div>
                            <select
                                className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 appearance-none"
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                            >
                                <option value="all">Semua Status</option>
                                <option value="approved">Disetujui</option>
                                <option value="rejected">Ditolak</option>
                            </select>
                        </div>

                        <div>
                            <select
                                className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 appearance-none"
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                            >
                                <option value="all">Semua Tipe</option>
                                <option value="sick">Sakit</option>
                                <option value="leave">Izin</option>
                            </select>
                        </div>

                        <div>
                            <input
                                type="date"
                                className="w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                placeholder="Dari Tanggal"
                                value={dateRange.start}
                                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                            />
                        </div>

                        <div>
                            <input
                                type="date"
                                className="w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                placeholder="Sampai Tanggal"
                                value={dateRange.end}
                                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="w-full md:w-auto mb-4 md:mb-0">
                            <select
                                className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 appearance-none"
                                value={`${sortField}-${sortOrder}`}
                                onChange={(e) => {
                                    const [field, order] = e.target.value.split('-');
                                    setSortField(field);
                                    setSortOrder(order);
                                }}
                            >
                                <option value="date-desc">Tanggal Izin (Terbaru)</option>
                                <option value="date-asc">Tanggal Izin (Terlama)</option>
                                <option value="processedAt-desc">Tanggal Diproses (Terbaru)</option>
                                <option value="processedAt-asc">Tanggal Diproses (Terlama)</option>
                                <option value="student-asc">Nama Mahasiswa (A-Z)</option>
                                <option value="student-desc">Nama Mahasiswa (Z-A)</option>
                            </select>
                        </div>

                        <button
                            onClick={() => alert('Download laporan')}
                            className="py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                        >
                            <MdFileDownload className="mr-2" /> Export Laporan
                        </button>
                    </div>
                </div>

                {paginatedRequests.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Mahasiswa
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Informasi Izin
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {paginatedRequests.map((request) => (
                                    <tr key={request.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{request.student.name}</div>
                                                    <div className="text-sm text-gray-500">{request.student.nim}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="text-sm text-gray-900 mb-1">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${request.type === "sick" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"
                                                        }`}>
                                                        {request.type === "sick" ? "Sakit" : "Izin"}
                                                    </span>
                                                    <span className="ml-2">
                                                        {request.course}
                                                    </span>
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    <span className="flex items-center">
                                                        <MdEvent className="mr-1" /> {formatDate(request.date)}
                                                    </span>
                                                    <span className="text-xs block truncate max-w-xs mt-1">
                                                        {request.reason.length > 50 ? request.reason.substring(0, 50) + '...' : request.reason}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col items-center justify-center">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${request.status === "approved" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                                    }`}>
                                                    {request.status === "approved" ? (
                                                        <>
                                                            <MdCheckCircle className="mr-1" /> Disetujui
                                                        </>
                                                    ) : (
                                                        <>
                                                            <MdCancel className="mr-1" /> Ditolak
                                                        </>
                                                    )}
                                                </span>
                                                <span className="text-xs text-gray-500 mt-2">{formatDateTime(request.processedAt)}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <button
                                                onClick={() => handleViewDetails(request)}
                                                className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                                            >
                                                Detail
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="py-10 text-center">
                        <MdInfo className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-gray-700">Tidak ada data yang sesuai</h3>
                        <p className="text-gray-500 mt-1">Coba ubah filter atau rentang tanggal Anda</p>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-6 flex justify-center">
                        <nav className="flex items-center space-x-2">
                            <button
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`p-2 rounded-md ${currentPage === 1
                                        ? "text-gray-300 cursor-not-allowed"
                                        : "text-gray-500 hover:bg-gray-100"
                                    }`}
                            >
                                <MdArrowBack className="h-5 w-5" />
                            </button>

                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`px-3 py-1 rounded-md ${currentPage === i + 1
                                            ? "bg-indigo-600 text-white"
                                            : "text-gray-500 hover:bg-gray-100"
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`p-2 rounded-md ${currentPage === totalPages
                                        ? "text-gray-300 cursor-not-allowed"
                                        : "text-gray-500 hover:bg-gray-100"
                                    }`}
                            >
                                <MdArrowForward className="h-5 w-5" />
                            </button>
                        </nav>
                    </div>
                )}
            </Card>

            {/* Request Detail Modal */}
            {showDetailsModal && selectedRequest && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                    <div className="relative bg-white rounded-xl shadow-lg w-full max-w-2xl" data-aos="zoom-in">
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                                Detail Permintaan Izin
                            </h3>

                            <div className="mb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center">
                                        <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${selectedRequest.type === "sick"
                                                ? "bg-red-100 text-red-800"
                                                : "bg-blue-100 text-blue-800"
                                            }`}>
                                            {selectedRequest.type === "sick" ? "Sakit" : "Izin"}
                                        </span>
                                    </div>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${selectedRequest.status === "approved" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                        }`}>
                                        {selectedRequest.status === "approved" ? (
                                            <>
                                                <MdCheckCircle className="mr-1" /> Disetujui
                                            </>
                                        ) : (
                                            <>
                                                <MdCancel className="mr-1" /> Ditolak
                                            </>
                                        )}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <p className="text-sm text-gray-500">Mahasiswa</p>
                                    <p className="font-medium">{selectedRequest.student.name} ({selectedRequest.student.nim})</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">Mata Kuliah</p>
                                    <p className="font-medium">{selectedRequest.course}</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">Tanggal Izin</p>
                                    <p className="font-medium">{formatDate(selectedRequest.date)}</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">Diproses Pada</p>
                                    <p className="font-medium">{formatDateTime(selectedRequest.processedAt)}</p>
                                </div>
                            </div>

                            <div className="mb-4">
                                <p className="text-sm text-gray-500">Alasan</p>
                                <p className="p-3 bg-gray-50 rounded-lg mt-1">{selectedRequest.reason}</p>
                            </div>

                            {selectedRequest.attachment && (
                                <div className="mb-4">
                                    <p className="text-sm text-gray-500">Lampiran</p>
                                    <div className="mt-1 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                        <a
                                            href="#"
                                            onClick={(e) => e.preventDefault()}
                                            className="flex items-center text-indigo-600 hover:text-indigo-800"
                                        >
                                            <MdAttachFile className="mr-2" />
                                            {selectedRequest.attachment}
                                        </a>
                                    </div>
                                </div>
                            )}

                            <div className="mb-4">
                                <p className="text-sm text-gray-500">Catatan</p>
                                <p className="p-3 bg-gray-50 rounded-lg mt-1">
                                    {selectedRequest.comment || "Tidak ada catatan"}
                                </p>
                            </div>

                            <div className="flex justify-end pt-4 border-t border-gray-200">
                                <button
                                    onClick={() => setShowDetailsModal(false)}
                                    className="py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    Tutup
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowDetailsModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RequestHistory;