import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import Card from "components/card";
import {
    MdApproval,
    MdHistory,
    MdPeople,
    MdAutorenew,
    MdSick,
    MdCheckCircle,
    MdCancel,
    MdInsights,
    MdAssessment,
    MdArrowForward
} from "react-icons/md";

// Dummy Data
const leaveStats = {
    pending: 5,
    approved: 23,
    rejected: 8,
    totalStudents: 137,
    sickPercentage: 65,
    leavePercentage: 35
};

const pendingRequests = [
    {
        id: 1,
        student: { nim: "20210001", name: "Budi Santoso" },
        course: "Algoritma dan Pemrograman",
        date: "2023-10-15",
        type: "sick",
        reason: "Demam tinggi dan flu",
        submittedAt: "2023-10-14T15:30:22Z"
    },
    {
        id: 2,
        student: { nim: "20210002", name: "Siti Nuraini" },
        course: "Basis Data",
        date: "2023-10-16",
        type: "leave",
        reason: "Urusan keluarga penting",
        submittedAt: "2023-10-14T09:20:10Z"
    },
    {
        id: 3,
        student: { nim: "20210005", name: "Farhan Abdullah" },
        course: "Pemrograman Web",
        date: "2023-10-17",
        type: "sick",
        reason: "Rawat inap karena demam berdarah",
        submittedAt: "2023-10-14T11:05:45Z"
    }
];

const LeaveRequestManagement = () => {
    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: "ease-in-out",
            once: true,
        });
    }, []);

    // Format date
    const formatDate = (dateString) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
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
                    Manajemen Izin/Sakit
                </h1>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Kelola permintaan izin dan sakit dari mahasiswa
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
                <Card extra="!flex flex-col items-center p-4" data-aos="fade-up" data-aos-delay="100">
                    <div className="rounded-full bg-yellow-100 p-3 mb-2">
                        <MdAutorenew className="h-6 w-6 text-yellow-600" />
                    </div>
                    <p className="text-xl font-bold">{leaveStats.pending}</p>
                    <p className="text-sm text-gray-500">Permintaan Tertunda</p>
                </Card>

                <Card extra="!flex flex-col items-center p-4" data-aos="fade-up" data-aos-delay="200">
                    <div className="rounded-full bg-green-100 p-3 mb-2">
                        <MdCheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <p className="text-xl font-bold">{leaveStats.approved}</p>
                    <p className="text-sm text-gray-500">Permintaan Disetujui</p>
                </Card>

                <Card extra="!flex flex-col items-center p-4" data-aos="fade-up" data-aos-delay="300">
                    <div className="rounded-full bg-red-100 p-3 mb-2">
                        <MdCancel className="h-6 w-6 text-red-600" />
                    </div>
                    <p className="text-xl font-bold">{leaveStats.rejected}</p>
                    <p className="text-sm text-gray-500">Permintaan Ditolak</p>
                </Card>

                <Card extra="!flex flex-col items-center p-4" data-aos="fade-up" data-aos-delay="400">
                    <div className="rounded-full bg-blue-100 p-3 mb-2">
                        <MdPeople className="h-6 w-6 text-blue-600" />
                    </div>
                    <p className="text-xl font-bold">{leaveStats.totalStudents}</p>
                    <p className="text-sm text-gray-500">Total Mahasiswa</p>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
                <Card extra="p-5 lg:col-span-2" data-aos="fade-up">
                    <div className="mb-4 flex items-center justify-between">
                        <h4 className="text-lg font-bold text-navy-700 dark:text-white">
                            Permintaan Terbaru
                        </h4>

                        <Link to="/lecturer/leave-requests/pending-requests" className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center">
                            Lihat Semua <MdArrowForward className="ml-1" />
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {pendingRequests.map((request) => (
                            <div key={request.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h5 className="text-base font-medium text-gray-900">{request.student.name} <span className="text-sm font-normal text-gray-500">({request.student.nim})</span></h5>
                                        <div className="flex items-center space-x-2 mt-1">
                                            <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${request.type === "sick"
                                                ? "bg-red-100 text-red-800"
                                                : "bg-blue-100 text-blue-800"
                                                }`}>
                                                {request.type === "sick" ? "Sakit" : "Izin"}
                                            </span>
                                            <span className="text-xs text-gray-500">{request.course}</span>
                                            <span className="text-xs text-gray-500">{formatDate(request.date)}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-2">{request.reason}</p>
                                    </div>
                                    <span className="text-xs text-gray-500">
                                        {getTimeAgo(request.submittedAt)}
                                    </span>
                                </div>

                                <div className="mt-3 flex justify-end space-x-2">
                                    <Link
                                        to={`/lecturer/leave-requests/pending-requests?id=${request.id}`}
                                        className="py-1 px-3 bg-indigo-600 text-white rounded text-xs hover:bg-indigo-700"
                                    >
                                        Lihat Detail
                                    </Link>

                                    <button className="py-1 px-3 bg-green-600 text-white rounded text-xs hover:bg-green-700">
                                        Setujui
                                    </button>

                                    <button className="py-1 px-3 bg-red-600 text-white rounded text-xs hover:bg-red-700">
                                        Tolak
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {pendingRequests.length === 0 && (
                        <div className="text-center py-8">
                            <MdApproval className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                            <h3 className="text-lg text-gray-500 font-medium">Tidak ada permintaan tertunda</h3>
                        </div>
                    )}
                </Card>

                <Card extra="p-5" data-aos="fade-up" data-aos-delay="100">
                    <div className="mb-4">
                        <h4 className="text-lg font-bold text-navy-700 dark:text-white">
                            Statistik Izin
                        </h4>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h5 className="text-sm font-medium mb-2">Distribusi Tipe Izin</h5>
                            <div className="w-full h-5 bg-gray-200 rounded-full overflow-hidden mb-2">
                                <div className="h-full flex">
                                    <div
                                        className="bg-red-500 text-xs text-white flex items-center justify-center"
                                        style={{ width: `${leaveStats.sickPercentage}%` }}
                                    >
                                        {leaveStats.sickPercentage}%
                                    </div>
                                    <div
                                        className="bg-blue-500 text-xs text-white flex items-center justify-center"
                                        style={{ width: `${leaveStats.leavePercentage}%` }}
                                    >
                                        {leaveStats.leavePercentage}%
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500">
                                <div className="flex items-center">
                                    <span className="h-3 w-3 bg-red-500 rounded-full inline-block mr-1"></span>
                                    <span>Sakit</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="h-3 w-3 bg-blue-500 rounded-full inline-block mr-1"></span>
                                    <span>Izin</span>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-4">
                            <h5 className="text-sm font-medium mb-2">Status Permintaan</h5>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="text-center">
                                    <div className="rounded-full h-16 w-16 mx-auto mb-2 bg-yellow-100 flex items-center justify-center">
                                        <MdAutorenew className="h-8 w-8 text-yellow-600" />
                                    </div>
                                    <p className="text-lg font-semibold">{leaveStats.pending}</p>
                                    <p className="text-xs">Tertunda</p>
                                </div>
                                <div className="text-center">
                                    <div className="rounded-full h-16 w-16 mx-auto mb-2 bg-green-100 flex items-center justify-center">
                                        <MdCheckCircle className="h-8 w-8 text-green-600" />
                                    </div>
                                    <p className="text-lg font-semibold">{leaveStats.approved}</p>
                                    <p className="text-xs">Disetujui</p>
                                </div>
                                <div className="text-center">
                                    <div className="rounded-full h-16 w-16 mx-auto mb-2 bg-red-100 flex items-center justify-center">
                                        <MdCancel className="h-8 w-8 text-red-600" />
                                    </div>
                                    <p className="text-lg font-semibold">{leaveStats.rejected}</p>
                                    <p className="text-xs">Ditolak</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <Link to="/lecturer/leave-requests/pending-requests" data-aos="fade-up" data-aos-delay="200">
                    <Card extra="p-5 cursor-pointer hover:border-indigo-200 hover:shadow-md transition-all duration-200 h-full">
                        <div className="flex flex-col items-center text-center">
                            <div className="rounded-full bg-indigo-100 p-3 mb-3">
                                <MdApproval className="h-8 w-8 text-indigo-600" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Permintaan Tertunda</h3>
                            <p className="text-sm text-gray-600">
                                Lihat dan proses semua permintaan izin yang tertunda
                            </p>
                        </div>
                    </Card>
                </Link>

                <Link to="/lecturer/leave-requests/request-history" data-aos="fade-up" data-aos-delay="300">
                    <Card extra="p-5 cursor-pointer hover:border-indigo-200 hover:shadow-md transition-all duration-200 h-full">
                        <div className="flex flex-col items-center text-center">
                            <div className="rounded-full bg-blue-100 p-3 mb-3">
                                <MdHistory className="h-8 w-8 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Riwayat Permintaan</h3>
                            <p className="text-sm text-gray-600">
                                Lihat histori permintaan izin yang telah diproses
                            </p>
                        </div>
                    </Card>
                </Link>
            </div>
        </div>
    );
};

export default LeaveRequestManagement;
