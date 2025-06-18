import React, { useEffect, useState } from "react";
import { MdVerified, MdWarning, MdError, MdCheckCircle, MdPerson, MdSearch, MdFilterList, MdRefresh, MdArrowForward } from "react-icons/md";
import AOS from "aos";
import "aos/dist/aos.css";

const VerifyDataset = () => {
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: false,
            mirror: false,
        });
    }, []);

    // Dummy data for dataset verification
    const stats = [
        { title: "Total Dataset", value: 1248, icon: MdPerson, color: "blue", increase: "+12%" },
        { title: "Terverifikasi", value: 876, icon: MdCheckCircle, color: "green", increase: "+5%" },
        { title: "Perlu Review", value: 234, icon: MdWarning, color: "yellow", increase: "-3%" },
        { title: "Ditolak", value: 138, icon: MdError, color: "red", increase: "+2%" },
    ];

    const recentVerifications = [
        { id: 1, name: "Ahmad Farhan", department: "IT", status: "verified", date: "2025-04-15", imageSrc: "https://i.pravatar.cc/150?img=1", accuracy: 98 },
        { id: 2, name: "Siti Aisyah", department: "HR", status: "pending", date: "2025-04-14", imageSrc: "https://i.pravatar.cc/150?img=5", accuracy: 76 },
        { id: 3, name: "Budi Santoso", department: "Marketing", status: "rejected", date: "2025-04-14", imageSrc: "https://i.pravatar.cc/150?img=8", accuracy: 45 },
        { id: 4, name: "Dewi Lestari", department: "Finance", status: "verified", date: "2025-04-13", imageSrc: "https://i.pravatar.cc/150?img=9", accuracy: 92 },
        { id: 5, name: "Eko Prabowo", department: "Operations", status: "verified", date: "2025-04-13", imageSrc: "https://i.pravatar.cc/150?img=12", accuracy: 95 },
    ];

    const departments = ["IT", "HR", "Marketing", "Finance", "Operations"];

    const filteredVerifications = recentVerifications.filter(person => {
        if (filter !== 'all' && person.status !== filter) return false;
        if (searchTerm && !person.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !person.department.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        return true;
    });

    const getStatusBadge = (status) => {
        switch (status) {
            case "verified":
                return <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-800 flex items-center gap-1"><MdCheckCircle /> Terverifikasi</span>;
            case "pending":
                return <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 flex items-center gap-1"><MdWarning /> Perlu Review</span>;
            case "rejected":
                return <span className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-800 flex items-center gap-1"><MdError /> Ditolak</span>;
            default:
                return null;
        }
    };

    const handleRefresh = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, 1500);
    };

    // Calculate percentages for chart visualization
    const verificationStats = {
        verified: recentVerifications.filter(p => p.status === 'verified').length,
        pending: recentVerifications.filter(p => p.status === 'pending').length,
        rejected: recentVerifications.filter(p => p.status === 'rejected').length,
    };

    return (
        <div className="p-4 md:p-8 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
            <div className="mb-8" data-aos="fade-up">
                <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Verifikasi Dataset Wajah</span>
                    <MdVerified className="ml-2 h-8 w-8 text-blue-500" />
                </h1>
                <p className="text-gray-600">Memastikan kualitas dan akurasi dataset wajah untuk sistem absensi</p>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-xl shadow-md border border-gray-100 p-6 flex items-center transition-all hover:shadow-lg group cursor-pointer"
                        data-aos="zoom-in"
                        data-aos-delay={index * 100}
                    >
                        <div className={`p-4 rounded-lg bg-${stat.color}-100 mr-4 group-hover:bg-${stat.color}-500 group-hover:text-white transition-colors duration-300`}>
                            <stat.icon className={`h-8 w-8 text-${stat.color}-500 group-hover:text-white transition-colors duration-300`} />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">{stat.title}</p>
                            <div className="flex items-center">
                                <p className="text-2xl font-bold text-gray-800">{stat.value.toLocaleString()}</p>
                                <span className={`ml-2 text-xs font-medium ${stat.increase.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                                    {stat.increase}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters and Search */}
            <div className="flex flex-wrap gap-4 items-center mb-6" data-aos="fade-up">
                <div className="bg-white rounded-lg shadow-sm p-2 flex items-center border border-gray-200 flex-1">
                    <MdSearch className="text-gray-400 w-5 h-5 ml-2" />
                    <input
                        type="text"
                        placeholder="Cari nama atau departemen..."
                        className="ml-2 p-1 outline-none flex-1"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                    >
                        Semua
                    </button>
                    <button
                        onClick={() => setFilter('verified')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'verified' ? 'bg-green-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                    >
                        Terverifikasi
                    </button>
                    <button
                        onClick={() => setFilter('pending')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                    >
                        Review
                    </button>
                    <button
                        onClick={() => setFilter('rejected')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'rejected' ? 'bg-red-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                    >
                        Ditolak
                    </button>
                </div>

                <button
                    onClick={handleRefresh}
                    className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                    disabled={isLoading}
                >
                    <MdRefresh className={`w-5 h-5 ${isLoading ? 'animate-spin text-blue-500' : 'text-gray-500'}`} />
                </button>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Verification Tool */}
                <div className="lg:col-span-2" data-aos="fade-right">
                    <div className="bg-white rounded-xl shadow-md p-6 h-full">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-800">Dataset Terbaru</h2>
                            <div className="flex items-center text-sm text-gray-500">
                                <span className="mr-2">Diurutkan berdasarkan tanggal</span>
                                <MdFilterList />
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="space-y-4">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className="flex items-center p-4 rounded-lg animate-pulse">
                                        <div className="w-14 h-14 rounded-full bg-gray-200"></div>
                                        <div className="ml-4 flex-1">
                                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                        </div>
                                        <div className="w-20 h-6 bg-gray-200 rounded-full"></div>
                                    </div>
                                ))}
                            </div>
                        ) : filteredVerifications.length > 0 ? (
                            <div className="space-y-4">
                                {filteredVerifications.map((person, idx) => (
                                    <div
                                        key={person.id}
                                        className="flex items-center bg-white border border-gray-100 rounded-lg p-4 transition-all hover:shadow-md hover:border-blue-200"
                                        data-aos="fade-up"
                                        data-aos-delay={idx * 50}
                                    >
                                        <div className="relative">
                                            <img
                                                src={person.imageSrc}
                                                alt={person.name}
                                                className="w-14 h-14 rounded-full object-cover border-2 border-white shadow"
                                            />
                                            <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${person.status === 'verified' ? 'bg-green-500' :
                                                    person.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                                                }`}></div>
                                        </div>
                                        <div className="ml-4 flex-1">
                                            <h3 className="font-medium text-gray-800">{person.name}</h3>
                                            <p className="text-gray-500 text-sm flex items-center">
                                                {person.department}
                                                <span className="mx-2 text-gray-300">•</span>
                                                <span className="text-xs">Akurasi: {person.accuracy}%</span>
                                            </p>
                                        </div>
                                        <div>
                                            {getStatusBadge(person.status)}
                                            <p className="text-gray-500 text-xs mt-1 text-right">{person.date}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-64 flex-col text-gray-400">
                                <MdSearch className="h-16 w-16 mb-4" />
                                <p>Tidak ada data yang sesuai dengan filter</p>
                            </div>
                        )}

                        {filteredVerifications.length > 0 && (
                            <div className="mt-6 flex justify-between items-center text-sm">
                                <p className="text-gray-500">Menampilkan {filteredVerifications.length} dari {recentVerifications.length} data</p>
                                <button className="text-blue-500 hover:text-blue-700 flex items-center font-medium">
                                    Lihat semua <MdArrowForward className="ml-1" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div>
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white mb-6" data-aos="fade-left">
                        <div className="flex items-center mb-4">
                            <MdVerified className="h-8 w-8 mr-2" />
                            <h2 className="text-xl font-semibold">Status Verifikasi</h2>
                        </div>

                        <div className="mb-4">
                            <div className="flex justify-between items-center mb-1">
                                <p className="text-sm text-blue-100">Progress</p>
                                <p className="text-sm font-medium">70%</p>
                            </div>
                            <div className="w-full bg-blue-800/50 rounded-full h-2.5 overflow-hidden">
                                <div
                                    className="bg-white h-2.5 rounded-full transition-all duration-1000"
                                    style={{ width: '70%' }}
                                    data-aos="slide-right"
                                    data-aos-delay="300"
                                    data-aos-duration="1200"
                                ></div>
                            </div>
                        </div>

                        {/* Chart-like visualization */}
                        <div className="flex items-center justify-between my-6">
                            <div className="text-center">
                                <div className="w-full flex items-center justify-center">
                                    <div className="relative w-16 h-16">
                                        <svg className="w-full h-full" viewBox="0 0 36 36">
                                            <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                                            <circle
                                                cx="18" cy="18" r="15"
                                                fill="none"
                                                stroke="#ffffff"
                                                strokeWidth="3"
                                                strokeDasharray={`${Math.round(verificationStats.verified / recentVerifications.length * 100)} 100`}
                                                strokeLinecap="round"
                                                transform="rotate(-90 18 18)"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                                            {Math.round(verificationStats.verified / recentVerifications.length * 100)}%
                                        </div>
                                    </div>
                                </div>
                                <p className="mt-2 text-xs">Terverifikasi</p>
                            </div>

                            <div className="text-center">
                                <div className="w-full flex items-center justify-center">
                                    <div className="relative w-16 h-16">
                                        <svg className="w-full h-full" viewBox="0 0 36 36">
                                            <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                                            <circle
                                                cx="18" cy="18" r="15"
                                                fill="none"
                                                stroke="rgba(255,226,77,0.9)"
                                                strokeWidth="3"
                                                strokeDasharray={`${Math.round(verificationStats.pending / recentVerifications.length * 100)} 100`}
                                                strokeLinecap="round"
                                                transform="rotate(-90 18 18)"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                                            {Math.round(verificationStats.pending / recentVerifications.length * 100)}%
                                        </div>
                                    </div>
                                </div>
                                <p className="mt-2 text-xs">Perlu Review</p>
                            </div>

                            <div className="text-center">
                                <div className="w-full flex items-center justify-center">
                                    <div className="relative w-16 h-16">
                                        <svg className="w-full h-full" viewBox="0 0 36 36">
                                            <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                                            <circle
                                                cx="18" cy="18" r="15"
                                                fill="none"
                                                stroke="rgba(255,100,100,0.8)"
                                                strokeWidth="3"
                                                strokeDasharray={`${Math.round(verificationStats.rejected / recentVerifications.length * 100)} 100`}
                                                strokeLinecap="round"
                                                transform="rotate(-90 18 18)"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                                            {Math.round(verificationStats.rejected / recentVerifications.length * 100)}%
                                        </div>
                                    </div>
                                </div>
                                <p className="mt-2 text-xs">Ditolak</p>
                            </div>
                        </div>

                        <p className="text-blue-100 text-sm mb-4">
                            Dataset wajah perlu diverifikasi secara berkala untuk memastikan akurasi sistem.
                        </p>

                        <button className="w-full bg-white text-blue-600 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors flex items-center justify-center">
                            Mulai Verifikasi Baru
                        </button>
                    </div>

                    {/* Department Statistics */}
                    <div className="bg-white rounded-xl shadow-md p-6 mb-6" data-aos="fade-up">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Statistik Departemen</h2>
                        <div className="space-y-4">
                            {departments.map((dept, idx) => {
                                const count = recentVerifications.filter(p => p.department === dept).length;
                                const percentage = Math.round((count / recentVerifications.length) * 100);
                                return (
                                    <div key={dept} className="group cursor-pointer hover:bg-blue-50 p-2 rounded-lg transition-colors" data-aos="fade-left" data-aos-delay={idx * 50}>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm text-gray-700 font-medium">{dept}</span>
                                            <span className="text-sm text-gray-500">{count} User</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-500 h-2 rounded-full group-hover:bg-blue-600 transition-all"
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6" data-aos="fade-up" data-aos-delay="200">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Tips Verifikasi</h2>
                        <ul className="space-y-3 text-gray-600">
                            <li className="flex items-start group hover:text-blue-700 transition-colors cursor-pointer">
                                <span className="text-blue-500 mr-2 group-hover:text-blue-700">•</span>
                                <span className="group-hover:translate-x-1 transition-transform">Pastikan pencahayaan pada foto wajah sudah baik</span>
                            </li>
                            <li className="flex items-start group hover:text-blue-700 transition-colors cursor-pointer">
                                <span className="text-blue-500 mr-2 group-hover:text-blue-700">•</span>
                                <span className="group-hover:translate-x-1 transition-transform">Periksa posisi wajah berada di tengah frame</span>
                            </li>
                            <li className="flex items-start group hover:text-blue-700 transition-colors cursor-pointer">
                                <span className="text-blue-500 mr-2 group-hover:text-blue-700">•</span>
                                <span className="group-hover:translate-x-1 transition-transform">Wajah tidak tertutup masker atau aksesoris</span>
                            </li>
                            <li className="flex items-start group hover:text-blue-700 transition-colors cursor-pointer">
                                <span className="text-blue-500 mr-2 group-hover:text-blue-700">•</span>
                                <span className="group-hover:translate-x-1 transition-transform">Dataset minimal 5 foto per karyawan</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyDataset;
