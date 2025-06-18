import React, { useState, useEffect } from "react";
import {
    MdPeople,
    MdAdd,
    MdSearch,
    MdFilterList,
    MdEdit,
    MdDelete,
    MdVisibility,
    MdMoreVert,
    MdSchool,
    MdPersonOutline,
    MdEmail,
    MdPhone,
    MdDateRange,
    MdCheckCircle,
    MdCancel
} from "react-icons/md";
import AOS from 'aos';
import 'aos/dist/aos.css';

const UserManagement = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterRole, setFilterRole] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [showDropdown, setShowDropdown] = useState(null);
    const usersPerPage = 6;

    // Dummy data untuk pengguna
    const dummyUsers = [
        {
            id: 1,
            name: "Dr. Ahmad Sudrajat",
            email: "ahmad.sudrajat@univ.ac.id",
            phone: "+62 812-3456-7890",
            role: "dosen",
            status: "active",
            joinDate: "2021-03-15",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
            department: "Teknik Informatika",
            lastLogin: "2 jam yang lalu"
        },
        {
            id: 2,
            name: "Sarah Wijaya",
            email: "sarah.wijaya@student.univ.ac.id",
            phone: "+62 813-9876-5432",
            role: "mahasiswa",
            status: "active",
            joinDate: "2023-08-20",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b2e66de4?w=150&h=150&fit=crop&crop=face",
            department: "Sistem Informasi",
            lastLogin: "1 hari yang lalu"
        },
        {
            id: 3,
            name: "Prof. Dr. Budi Santoso",
            email: "budi.santoso@univ.ac.id",
            phone: "+62 814-1234-5678",
            role: "dosen",
            status: "active",
            joinDate: "2019-01-10",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
            department: "Teknik Informatika",
            lastLogin: "3 jam yang lalu"
        },
        {
            id: 4,
            name: "Rina Melati",
            email: "rina.melati@student.univ.ac.id",
            phone: "+62 815-2468-1357",
            role: "mahasiswa",
            status: "inactive",
            joinDate: "2022-09-05",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
            department: "Manajemen Informatika",
            lastLogin: "1 minggu yang lalu"
        },
        {
            id: 5,
            name: "Muhammad Rizki",
            email: "m.rizki@student.univ.ac.id",
            phone: "+62 816-3691-2580",
            role: "mahasiswa",
            status: "active",
            joinDate: "2023-01-15",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
            department: "Teknik Informatika",
            lastLogin: "5 jam yang lalu"
        },
        {
            id: 6,
            name: "Dr. Siti Nurhaliza",
            email: "siti.nurhaliza@univ.ac.id",
            phone: "+62 817-4815-1623",
            role: "dosen",
            status: "active",
            joinDate: "2020-06-12",
            avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
            department: "Sistem Informasi",
            lastLogin: "1 jam yang lalu"
        },
        {
            id: 7,
            name: "Dimas Prasetyo",
            email: "dimas.prasetyo@student.univ.ac.id",
            phone: "+62 818-7410-9632",
            role: "mahasiswa",
            status: "active",
            joinDate: "2023-07-22",
            avatar: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face",
            department: "Manajemen Informatika",
            lastLogin: "4 jam yang lalu"
        },
        {
            id: 8,
            name: "Indira Putri",
            email: "indira.putri@student.univ.ac.id",
            phone: "+62 819-8527-4163",
            role: "mahasiswa",
            status: "inactive",
            joinDate: "2022-02-28",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
            department: "Teknik Informatika",
            lastLogin: "2 minggu yang lalu"
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

    // Filter users
    const filteredUsers = dummyUsers.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === "all" || user.role === filterRole;
        const matchesStatus = filterStatus === "all" || user.status === filterStatus;

        return matchesSearch && matchesRole && matchesStatus;
    });

    // Pagination
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    const handleDropdownToggle = (userId) => {
        setShowDropdown(showDropdown === userId ? null : userId);
    };

    const getRoleColor = (role) => {
        return role === 'dosen' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800';
    };

    const getStatusColor = (status) => {
        return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
    };

    const stats = [
        {
            title: "Total Pengguna",
            value: dummyUsers.length,
            change: "+12%",
            icon: MdPeople,
            color: "bg-gradient-to-r from-blue-500 to-blue-600"
        },
        {
            title: "Dosen",
            value: dummyUsers.filter(u => u.role === 'dosen').length,
            change: "+5%",
            icon: MdSchool,
            color: "bg-gradient-to-r from-purple-500 to-purple-600"
        },
        {
            title: "Mahasiswa",
            value: dummyUsers.filter(u => u.role === 'mahasiswa').length,
            change: "+18%",
            icon: MdPersonOutline,
            color: "bg-gradient-to-r from-green-500 to-green-600"
        },
        {
            title: "Pengguna Aktif",
            value: dummyUsers.filter(u => u.status === 'active').length,
            change: "+8%",
            icon: MdCheckCircle,
            color: "bg-gradient-to-r from-emerald-500 to-emerald-600"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 p-4 md:p-8">
            {/* Header Section */}
            <div className="mb-8" data-aos="fade-down">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
                            Manajemen Pengguna
                        </h1>
                        <p className="text-gray-600 text-lg">Kelola semua pengguna sistem termasuk mahasiswa dan dosen</p>
                    </div>
                    <button className="mt-4 lg:mt-0 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                        <MdAdd className="w-5 h-5" />
                        Tambah Pengguna
                    </button>
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
                                <p className="text-green-600 text-sm font-medium mt-1">{stat.change} dari bulan lalu</p>
                            </div>
                            <div className={`${stat.color} p-3 rounded-xl text-white`}>
                                <stat.icon className="w-8 h-8" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Search and Filter Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100" data-aos="fade-up">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1 relative">
                        <MdSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Cari pengguna berdasarkan nama atau email..."
                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                    >
                        <option value="all">Semua Role</option>
                        <option value="dosen">Dosen</option>
                        <option value="mahasiswa">Mahasiswa</option>
                    </select>
                    <select
                        className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="all">Semua Status</option>
                        <option value="active">Aktif</option>
                        <option value="inactive">Tidak Aktif</option>
                    </select>
                </div>
            </div>

            {/* Users Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {currentUsers.map((user, index) => (
                    <div
                        key={user.id}
                        className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
                        data-aos="fade-up"
                        data-aos-delay={index * 100}
                    >
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-4">
                                    <img
                                        src={user.avatar}
                                        alt={user.name}
                                        className="w-16 h-16 rounded-full object-cover border-4 border-gray-100"
                                    />
                                    <div>
                                        <h3 className="font-bold text-gray-800 text-lg">{user.name}</h3>
                                        <p className="text-gray-600 text-sm">{user.department}</p>
                                    </div>
                                </div>
                                <div className="relative">
                                    <button
                                        onClick={() => handleDropdownToggle(user.id)}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                    >
                                        <MdMoreVert className="w-5 h-5 text-gray-600" />
                                    </button>
                                    {showDropdown === user.id && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-10">
                                            <button className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200">
                                                <MdVisibility className="w-4 h-4 text-blue-600" />
                                                <span className="text-sm text-gray-700">Lihat Detail</span>
                                            </button>
                                            <button className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200">
                                                <MdEdit className="w-4 h-4 text-green-600" />
                                                <span className="text-sm text-gray-700">Edit</span>
                                            </button>
                                            <button className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 rounded-b-xl">
                                                <MdDelete className="w-4 h-4 text-red-600" />
                                                <span className="text-sm text-gray-700">Hapus</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-3">
                                    <MdEmail className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm text-gray-600">{user.email}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <MdPhone className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm text-gray-600">{user.phone}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <MdDateRange className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm text-gray-600">Login terakhir: {user.lastLogin}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex gap-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getRoleColor(user.role)}`}>
                                        {user.role}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(user.status)}`}>
                                        {user.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mb-8" data-aos="fade-up">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200"
                    >
                        Previous
                    </button>

                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`px-4 py-2 rounded-lg transition-colors duration-200 ${currentPage === i + 1
                                    ? 'bg-blue-600 text-white'
                                    : 'border border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200"
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Empty State */}
            {filteredUsers.length === 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center" data-aos="fade-up">
                    <MdPeople className="h-20 w-20 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">Tidak ada data pengguna</h3>
                    <p className="text-gray-500">Coba ubah filter pencarian atau tambah pengguna baru</p>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
