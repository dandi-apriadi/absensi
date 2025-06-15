import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Card from "components/card";
import {
    MdFilterList,
    MdSearch,
    MdCheckCircle,
    MdCancel,
    MdInfo,
    MdCalendarToday,
    MdAttachFile,
    MdRemoveRedEye,
    MdSick,
    MdMessage
} from "react-icons/md";

// Dummy Data
const pendingRequests = [
    {
        id: 1,
        student: { nim: "20210001", name: "Budi Santoso" },
        course: "Algoritma dan Pemrograman",
        date: "2023-10-15",
        type: "sick",
        reason: "Demam tinggi dan flu",
        attachment: "surat-dokter-budi.pdf",
        submittedAt: "2023-10-14 15:30:22Z"
    },
    {
        id: 2,
        student: { nim: "20210002", name: "Siti Nuraini" },
        course: "Basis Data",
        date: "2023-10-16",
        type: "leave",
        reason: "Urusan keluarga penting",
        attachment: "surat-izin-siti.pdf",
        submittedAt: "2023-10-14 09:20:10Z"
    },
    {
        id: 3,
        student: { nim: "20210005", name: "Farhan Abdullah" },
        course: "Pemrograman Web",
        date: "2023-10-17",
        type: "sick",
        reason: "Rawat inap karena demam berdarah",
        attachment: "surat-dokter-farhan.pdf",
        submittedAt: "2023-10-14 11:05:45Z"
    },
    {
        id: 4,
        student: { nim: "20210009", name: "Rini Anjani" },
        course: "Algoritma dan Pemrograman",
        date: "2023-10-17",
        type: "leave",
        reason: "Mengikuti kompetisi nasional",
        attachment: "surat-undangan-rini.pdf",
        submittedAt: "2023-10-13 16:20:10Z"
    },
    {
        id: 5,
        student: { nim: "20210012", name: "Arif Wijaya" },
        course: "Kecerdasan Buatan",
        date: "2023-10-18",
        type: "sick",
        reason: "Cedera kaki saat olahraga",
        attachment: "surat-dokter-arif.pdf",
        submittedAt: "2023-10-13 10:15:30Z"
    }
];

const courses = [
    { id: 1, code: "CS-101", name: "Algoritma dan Pemrograman" },
    { id: 2, code: "CS-102", name: "Basis Data" },
    { id: 3, code: "CS-103", name: "Pemrograman Web" },
    { id: 4, code: "CS-104", name: "Kecerdasan Buatan" },
];

const PendingRequests = () => {
    const [requests, setRequests] = useState(pendingRequests);
    const [selectedFilter, setSelectedFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentRequest, setCurrentRequest] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [filterCourse, setFilterCourse] = useState("");
    const [actionComment, setActionComment] = useState("");

    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: "ease-in-out",
            once: true,
        });
    }, []);

    const handleViewDetails = (request) => {
        setCurrentRequest(request);
        setShowModal(true);
    };

    const handleApprove = (requestId) => {
        // In a real app, this would call an API to approve the request
        setRequests(requests.filter(req => req.id !== requestId));
        setShowModal(false);
        setActionComment("");
        alert("Permintaan izin telah disetujui");
    };

    const handleReject = (requestId) => {
        // In a real app, this would call an API to reject the request
        setRequests(requests.filter(req => req.id !== requestId));
        setShowModal(false);
        setActionComment("");
        alert("Permintaan izin telah ditolak");
    };

    // Filter requests based on search and filters
    const filteredRequests = requests.filter(request => {
        // Search filter
        const matchesSearch =
            request.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.student.nim.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.reason.toLowerCase().includes(searchTerm.toLowerCase());

        // Type filter
        const matchesType = selectedFilter === "all" || request.type === selectedFilter;

        // Course filter
        const matchesCourse = !filterCourse || request.course === courses.find(c => c.id == filterCourse)?.name;

        return matchesSearch && matchesType && matchesCourse;
    });

    // Format date
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    // Format relative time (e.g., "2 hours ago")
    const getTimeAgo = (dateString) => {
        const now = new Date();
        const past = new Date(dateString);
        const diffInSeconds = Math.floor((now - past) / 1000);

        if (diffInSeconds < 60) {
            return `${diffInSeconds} detik yang lalu`;
        }

        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) {
            return `${diffInMinutes} menit yang lalu`;
        }

        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) {
            return `${diffInHours} jam yang lalu`;
        }

        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays} hari yang lalu`;
    };

    return (
        <div className="mt-3">
            <div className="mb-5" data-aos="fade-down">
                <h1 className="text-3xl font-bold text-navy-700 dark:text-white">
                    Permintaan Izin Tertunda
                </h1>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Tinjau dan proses permintaan izin/sakit dari mahasiswa
                </p>
            </div>

            <Card extra="p-5 mb-5" data-aos="fade-up">
                <div className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="w-full md:w-96 relative">
                        <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Cari berdasarkan nama atau NIM..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="w-full md:w-64">
                        <select
                            className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 appearance-none"
                            value={selectedFilter}
                            onChange={(e) => setSelectedFilter(e.target.value)}
                        >
                            <option value="all">Semua Jenis</option>
                            <option value="sick">Sakit</option>
                            <option value="leave">Izin</option>
                        </select>
                    </div>

                    <div className="w-full md:w-64">
                        <select
                            className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 appearance-none"
                            value={filterCourse}
                            onChange={(e) => setFilterCourse(e.target.value)}
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
            </Card>

            <div className="space-y-4 mb-5" data-aos="fade-up">
                {filteredRequests.length > 0 ? (
                    filteredRequests.map((request, index) => (
                        <Card
                            key={request.id}
                            extra="p-5 hover:shadow-md transition-all duration-200"
                            data-aos="fade-up"
                            data-aos-delay={index * 100}
                        >
                            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                        <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${request.type === "sick"
                                                ? "bg-red-100 text-red-800"
                                                : "bg-blue-100 text-blue-800"
                                            }`}>
                                            {request.type === "sick" ? "Sakit" : "Izin"}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            Diajukan {getTimeAgo(request.submittedAt)}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-bold text-navy-700 dark:text-white mb-1">
                                        {request.student.name} <span className="text-sm font-normal text-gray-500">({request.student.nim})</span>
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <MdCalendarToday className="mr-1 text-gray-400" />
                                            {formatDate(request.date)}
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            {request.course}
                                        </div>
                                    </div>

                                    <p className="text-sm mb-3">{request.reason}</p>

                                    {request.attachment && (
                                        <div className="flex items-center text-sm text-indigo-600 hover:text-indigo-800">
                                            <MdAttachFile className="mr-1" />
                                            <a href="#" onClick={(e) => e.preventDefault()}>
                                                Lihat Lampiran
                                            </a>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4 md:mt-0 md:ml-6 flex md:flex-col gap-3 md:gap-2">
                                    <button
                                        onClick={() => handleViewDetails(request)}
                                        className="flex-1 md:w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
                                    >
                                        <MdRemoveRedEye className="mr-2" /> Lihat Detail
                                    </button>

                                    <button
                                        onClick={() => {
                                            setCurrentRequest(request);
                                            handleApprove(request.id);
                                        }}
                                        className="flex-1 md:w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                                    >
                                        <MdCheckCircle className="mr-2" /> Setujui
                                    </button>

                                    <button
                                        onClick={() => {
                                            setCurrentRequest(request);
                                            handleReject(request.id);
                                        }}
                                        className="flex-1 md:w-full py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                                    >
                                        <MdCancel className="mr-2" /> Tolak
                                    </button>
                                </div>
                            </div>
                        </Card>
                    ))
                ) : (
                    <Card extra="p-10 text-center" data-aos="fade-up">
                        <div className="flex flex-col items-center">
                            <MdInfo className="h-12 w-12 text-gray-300 mb-3" />
                            <h3 className="text-lg font-medium text-gray-900 mb-1">Tidak Ada Permintaan Tertunda</h3>
                            <p className="text-gray-500">Saat ini tidak ada permintaan izin yang perlu diproses.</p>
                        </div>
                    </Card>
                )}
            </div>

            {/* Request Detail Modal */}
            {showModal && currentRequest && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                    <div className="relative bg-white rounded-xl shadow-lg w-full max-w-2xl" data-aos="zoom-in">
                        <div className="p-6">
                            <div className="mb-4 flex justify-between items-center">
                                <h3 className="text-xl font-bold text-gray-900">
                                    Detail Permintaan Izin
                                </h3>
                                <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${currentRequest.type === "sick"
                                        ? "bg-red-100 text-red-800 flex items-center"
                                        : "bg-blue-100 text-blue-800 flex items-center"
                                    }`}>
                                    {currentRequest.type === "sick" ? (
                                        <>
                                            <MdSick className="mr-1" /> Sakit
                                        </>
                                    ) : (
                                        <>
                                            <MdMessage className="mr-1" /> Izin
                                        </>
                                    )}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <p className="text-sm text-gray-500">Mahasiswa</p>
                                    <p className="font-medium">{currentRequest.student.name} ({currentRequest.student.nim})</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">Mata Kuliah</p>
                                    <p className="font-medium">{currentRequest.course}</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">Tanggal</p>
                                    <p className="font-medium">{formatDate(currentRequest.date)}</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">Waktu Pengajuan</p>
                                    <p className="font-medium">{currentRequest.submittedAt}</p>
                                </div>
                            </div>

                            <div className="mb-4">
                                <p className="text-sm text-gray-500">Alasan</p>
                                <p className="p-3 bg-gray-50 rounded-lg mt-1">{currentRequest.reason}</p>
                            </div>

                            {currentRequest.attachment && (
                                <div className="mb-4">
                                    <p className="text-sm text-gray-500">Lampiran</p>
                                    <div className="mt-1 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                        <a
                                            href="#"
                                            onClick={(e) => e.preventDefault()}
                                            className="flex items-center text-indigo-600 hover:text-indigo-800"
                                        >
                                            <MdAttachFile className="mr-2" />
                                            {currentRequest.attachment}
                                        </a>
                                    </div>
                                </div>
                            )}

                            <div className="mb-4">
                                <p className="text-sm text-gray-500">Catatan (opsional)</p>
                                <textarea
                                    className="w-full rounded-lg border border-gray-300 p-3 text-sm mt-1 outline-none focus:border-indigo-500"
                                    rows="3"
                                    placeholder="Tambahkan catatan untuk mahasiswa (opsional)"
                                    value={actionComment}
                                    onChange={(e) => setActionComment(e.target.value)}
                                ></textarea>
                            </div>

                            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                                <button
                                    onClick={() => handleReject(currentRequest.id)}
                                    className="py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                                >
                                    <MdCancel className="mr-2" /> Tolak
                                </button>

                                <button
                                    onClick={() => handleApprove(currentRequest.id)}
                                    className="py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                                >
                                    <MdCheckCircle className="mr-2" /> Setujui
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowModal(false)}
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

export default PendingRequests;
