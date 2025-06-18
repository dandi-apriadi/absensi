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
    MdEmail,
    MdPhone,
    MdDateRange,
    MdCheckCircle,
    MdCancel,
    MdPerson,
    MdWork,
    MdLocationOn,
    MdFileUpload,
    MdFileDownload,
    MdSort,
    MdViewList,
    MdViewModule,
    MdRefresh,
    MdPersonAdd,
    MdGroup,
    MdTrendingUp,
    MdAccessTime
} from "react-icons/md";
import AOS from 'aos';
import 'aos/dist/aos.css';

const UsersList = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterRole, setFilterRole] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterDepartment, setFilterDepartment] = useState("all");
    const [sortBy, setSortBy] = useState("name");
    const [sortOrder, setSortOrder] = useState("asc");
    const [viewMode, setViewMode] = useState("grid"); // grid or list
    const [currentPage, setCurrentPage] = useState(1);
    const [showDropdown, setShowDropdown] = useState(null);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const usersPerPage = 9;

    // Comprehensive dummy data for users
    const dummyUsers = [
        {
            id: 1,
            name: "Prof. Dr. Ahmad Sudrajat, M.Kom",
            email: "ahmad.sudrajat@univ.ac.id",
            phone: "+62 812-3456-7890",
            role: "dosen",
            status: "active",
            department: "Teknik Informatika",
            position: "Profesor",
            nim: "",
            nidn: "0412078901",
            joinDate: "2015-03-15",
            lastLogin: "2024-06-17T10:30:00",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
            totalSubjects: 3,
            totalStudents: 120
        },
        {
            id: 2,
            name: "Ahmad Fauzi Rahman",
            email: "ahmad.fauzi@student.univ.ac.id",
            phone: "+62 813-9876-5432",
            role: "mahasiswa",
            status: "active",
            department: "Teknik Informatika",
            position: "",
            nim: "2021010101",
            nidn: "",
            joinDate: "2021-08-20",
            lastLogin: "2024-06-17T08:15:00",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
            year: "2021",
            gpa: "3.85"
        },
        {
            id: 3,
            name: "Dr. Siti Nurhaliza, S.Kom, M.T",
            email: "siti.nurhaliza@univ.ac.id",
            phone: "+62 814-1234-5678",
            role: "dosen",
            status: "active",
            department: "Sistem Informasi",
            position: "Lektor Kepala",
            nim: "",
            nidn: "0425068902",
            joinDate: "2017-01-10",
            lastLogin: "2024-06-17T09:22:00",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b2e66de4?w=150&h=150&fit=crop&crop=face",
            totalSubjects: 4,
            totalStudents: 95
        },
        {
            id: 4,
            name: "Sarah Wijaya",
            email: "sarah.wijaya@student.univ.ac.id",
            phone: "+62 815-2468-1357",
            role: "mahasiswa",
            status: "active",
            department: "Sistem Informasi",
            position: "",
            nim: "2022010201",
            nidn: "",
            joinDate: "2022-09-05",
            lastLogin: "2024-06-16T16:45:00",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
            year: "2022",
            gpa: "3.92"
        },
        {
            id: 5,
            name: "Dr. Budi Santoso, M.Kom",
            email: "budi.santoso@univ.ac.id",
            phone: "+62 816-3691-2580",
            role: "dosen",
            status: "active",
            department: "Teknik Informatika",
            position: "Lektor",
            nim: "",
            nidn: "0408078903",
            joinDate: "2019-01-15",
            lastLogin: "2024-06-17T07:30:00",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
            totalSubjects: 2,
            totalStudents: 78
        },
        {
            id: 6,
            name: "Rina Melati",
            email: "rina.melati@student.univ.ac.id",
            phone: "+62 817-4815-1623",
            role: "mahasiswa",
            status: "inactive",
            department: "Manajemen Informatika",
            position: "",
            nim: "2020010105",
            nidn: "",
            joinDate: "2020-06-12",
            lastLogin: "2024-06-10T14:20:00",
            avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
            year: "2020",
            gpa: "3.45"
        },
        {
            id: 7,
            name: "Muhammad Rizki",
            email: "m.rizki@student.univ.ac.id",
            phone: "+62 818-7410-9632",
            role: "mahasiswa",
            status: "active",
            department: "Teknik Informatika",
            position: "",
            nim: "2023010101",
            nidn: "",
            joinDate: "2023-07-22",
            lastLogin: "2024-06-17T11:15:00",
            avatar: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face",
            year: "2023",
            gpa: "3.78"
        },
        {
            id: 8,
            name: "Dr. Indira Putri, S.Si, M.Kom",
            email: "indira.putri@univ.ac.id",
            phone: "+62 819-8527-4163",
            role: "dosen",
            status: "active",
            department: "Sistem Informasi",
            position: "Lektor Kepala",
            nim: "",
            nidn: "0422078906",
            joinDate: "2018-02-28",
            lastLogin: "2024-06-17T09:45:00",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
            totalSubjects: 3,
            totalStudents: 110
        },
        {
            id: 9,
            name: "Dimas Prasetyo",
            email: "dimas.prasetyo@student.univ.ac.id",
            phone: "+62 820-9638-7410",
            role: "mahasiswa",
            status: "active",
            department: "Manajemen Informatika",
            position: "",
            nim: "2022010301",
            nidn: "",
            joinDate: "2022-08-15",
            lastLogin: "2024-06-17T13:30:00",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
            year: "2022",
            gpa: "3.67"
        },
        {
            id: 10,
            name: "Lestari Wulandari, M.Kom",
            email: "lestari.wulandari@univ.ac.id",
            phone: "+62 821-1472-5836",
            role: "dosen",
            status: "active",
            department: "Manajemen Informatika",
            position: "Asisten Profesor",
            nim: "",
            nidn: "0420088908",
            joinDate: "2021-03-10",
            lastLogin: "2024-06-17T08:00:00",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b2e66de4?w=150&h=150&fit=crop&crop=face",
            totalSubjects: 2,
            totalStudents: 65
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

    // Filter and sort users
    const filteredAndSortedUsers = React.useMemo(() => {
        let result = dummyUsers.filter(user => {
            const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (user.nim && user.nim.includes(searchTerm)) ||
                (user.nidn && user.nidn.includes(searchTerm));
            const matchesRole = filterRole === "all" || user.role === filterRole;
            const matchesStatus = filterStatus === "all" || user.status === filterStatus;
            const matchesDepartment = filterDepartment === "all" || user.department === filterDepartment;

            return matchesSearch && matchesRole && matchesStatus && matchesDepartment;
        });

        // Sort users
        result.sort((a, b) => {
            let aValue, bValue;
            switch (sortBy) {
                case 'name':
                    aValue = a.name.toLowerCase();
                    bValue = b.name.toLowerCase();
                    break;
                case 'email':
                    aValue = a.email.toLowerCase();
                    bValue = b.email.toLowerCase();
                    break;
                case 'joinDate':
                    aValue = new Date(a.joinDate);
                    bValue = new Date(b.joinDate);
                    break;
                case 'lastLogin':
                    aValue = new Date(a.lastLogin);
                    bValue = new Date(b.lastLogin);
                    break;
                default:
                    aValue = a.name.toLowerCase();
                    bValue = b.name.toLowerCase();
            }

            if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

        return result;
    }, [searchTerm, filterRole, filterStatus, filterDepartment, sortBy, sortOrder]);

    // Pagination
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredAndSortedUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredAndSortedUsers.length / usersPerPage);

    const handleDropdownToggle = (userId) => {
        setShowDropdown(showDropdown === userId ? null : userId);
    };

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    const handleUserSelect = (userId) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const handleSelectAll = () => {
        if (selectedUsers.length === currentUsers.length) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(currentUsers.map(user => user.id));
        }
    };

    const getRoleColor = (role) => {
        return role === 'dosen' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800';
    };

    const getStatusColor = (status) => {
        return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatDateTime = (dateString) => {
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
            icon: MdPersonAdd,
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

    const departments = ["Teknik Informatika", "Sistem Informasi", "Manajemen Informatika"];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 p-4 md:p-8">
            {/* Header Section */}
            <div className="mb-8" data-aos="fade-down">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
                            Daftar Pengguna
                        </h1>
                        <p className="text-gray-600 text-lg">Lihat dan kelola semua pengguna dalam sistem</p>
                    </div>
                    <div className="flex flex-wrap gap-3 mt-4 lg:mt-0">
                        <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                            <MdAdd className="w-5 h-5" />
                            Tambah Pengguna
                        </button>
                        <button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                            <MdFileUpload className="w-5 h-5" />
                            Import
                        </button>
                        <button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                            <MdFileDownload className="w-5 h-5" />
                            Export
                        </button>
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
                <div className="flex flex-col lg:flex-row gap-4 mb-6">
                    <div className="flex-1 relative">
                        <MdSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Cari pengguna berdasarkan nama, email, NIM, atau NIDN..."
                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-wrap gap-3">
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
                            value={filterDepartment}
                            onChange={(e) => setFilterDepartment(e.target.value)}
                        >
                            <option value="all">Semua Jurusan</option>
                            {departments.map((dept, index) => (
                                <option key={index} value={dept}>{dept}</option>
                            ))}
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

                {/* Toolbar */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Urutkan:</span>
                            <select
                                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="name">Nama</option>
                                <option value="email">Email</option>
                                <option value="joinDate">Tanggal Bergabung</option>
                                <option value="lastLogin">Login Terakhir</option>
                            </select>
                            <button
                                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                            >
                                <MdSort className={`w-4 h-4 text-gray-600 transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                            </button>
                        </div>

                        {selectedUsers.length > 0 && (
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-blue-600 font-medium">
                                    {selectedUsers.length} pengguna dipilih
                                </span>
                                <button className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 transition-colors duration-200">
                                    Hapus
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-colors duration-200 ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <MdViewModule className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-colors duration-200 ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <MdViewList className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                            <MdRefresh className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Users Display */}
            {viewMode === 'grid' ? (
                // Grid View
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
                                        <div className="relative">
                                            <img
                                                src={user.avatar}
                                                alt={user.name}
                                                className="w-16 h-16 rounded-full object-cover border-4 border-gray-100"
                                            />
                                            <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${user.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                                                }`}></div>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-800 text-lg leading-tight">{user.name}</h3>
                                            <p className="text-gray-600 text-sm">{user.department}</p>
                                            <p className="text-gray-500 text-xs">
                                                {user.role === 'mahasiswa' ? `NIM: ${user.nim}` : `NIDN: ${user.nidn}`}
                                            </p>
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
                                        <span className="text-sm text-gray-600 truncate">{user.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <MdPhone className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm text-gray-600">{user.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <MdAccessTime className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm text-gray-600">Login: {formatDateTime(user.lastLogin)}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex gap-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                                            {user.role === 'mahasiswa' ? 'Mahasiswa' : 'Dosen'}
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                                            {user.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                                        </span>
                                    </div>
                                </div>

                                {user.role === 'dosen' && (
                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-blue-600">{user.totalSubjects}</p>
                                            <p className="text-xs text-gray-500">Mata Kuliah</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-green-600">{user.totalStudents}</p>
                                            <p className="text-xs text-gray-500">Mahasiswa</p>
                                        </div>
                                    </div>
                                )}

                                {user.role === 'mahasiswa' && (
                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-purple-600">{user.year}</p>
                                            <p className="text-xs text-gray-500">Angkatan</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-orange-600">{user.gpa}</p>
                                            <p className="text-xs text-gray-500">IPK</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                // List View
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8" data-aos="fade-up">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left">
                                        <input
                                            type="checkbox"
                                            checked={selectedUsers.length === currentUsers.length && currentUsers.length > 0}
                                            onChange={handleSelectAll}
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Pengguna
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Role & Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Kontak
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Login Terakhir
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input
                                                type="checkbox"
                                                checked={selectedUsers.includes(user.id)}
                                                onChange={() => handleUserSelect(user.id)}
                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="relative flex-shrink-0 h-12 w-12">
                                                    <img className="h-12 w-12 rounded-full object-cover" src={user.avatar} alt={user.name} />
                                                    <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white ${user.status === 'active' ? 'bg-green-400' : 'bg-red-400'
                                                        }`}></div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                    <div className="text-sm text-gray-500">{user.department}</div>
                                                    <div className="text-xs text-gray-400">
                                                        {user.role === 'mahasiswa' ? `NIM: ${user.nim}` : `NIDN: ${user.nidn}`}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col gap-1">
                                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                                                    {user.role === 'mahasiswa' ? 'Mahasiswa' : 'Dosen'}
                                                </span>
                                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
                                                    {user.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div>{user.email}</div>
                                            <div>{user.phone}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDateTime(user.lastLogin)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center space-x-2">
                                                <button className="text-blue-600 hover:text-blue-900 transition-colors duration-200">
                                                    <MdVisibility className="h-5 w-5" />
                                                </button>
                                                <button className="text-green-600 hover:text-green-900 transition-colors duration-200">
                                                    <MdEdit className="h-5 w-5" />
                                                </button>
                                                <button className="text-red-600 hover:text-red-900 transition-colors duration-200">
                                                    <MdDelete className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

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
            {filteredAndSortedUsers.length === 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center" data-aos="fade-up">
                    <MdPeople className="h-20 w-20 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">Tidak ada pengguna ditemukan</h3>
                    <p className="text-gray-500">Coba ubah filter pencarian atau tambah pengguna baru</p>
                </div>
            )}
        </div>
    );
};

export default UsersList;
