import React, { useState, useEffect } from "react";
import {
    MdGroups,
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
    MdClose,
    MdSave
} from "react-icons/md";
import AOS from 'aos';
import 'aos/dist/aos.css';

const LecturerManagement = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterDepartment, setFilterDepartment] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterPosition, setFilterPosition] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [showDropdown, setShowDropdown] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedLecturer, setSelectedLecturer] = useState(null);
    const [editFormData, setEditFormData] = useState({
        nidn: "",
        name: "",
        email: "",
        phone: "",
        department: "",
        position: "",
        status: "",
        education: "",
        specialization: ""
    });

    const lecturersPerPage = 6;

    // Dummy data untuk dosen
    const dummyLecturers = [
        {
            id: 1,
            nidn: "0412078901",
            name: "Prof. Dr. Ahmad Sudrajat, M.Kom",
            email: "ahmad.sudrajat@univ.ac.id",
            phone: "+62 812-3456-7890",
            department: "Teknik Informatika",
            position: "Profesor",
            status: "active",
            education: "S3 Ilmu Komputer",
            specialization: "Artificial Intelligence",
            joinDate: "2015-03-15",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
            lastLogin: "2 jam yang lalu",
            totalSubjects: 3,
            totalStudents: 120
        },
        {
            id: 2,
            nidn: "0425068902",
            name: "Dr. Siti Nurhaliza, S.Kom, M.T",
            email: "siti.nurhaliza@univ.ac.id",
            phone: "+62 813-9876-5432",
            department: "Sistem Informasi",
            position: "Lektor Kepala",
            status: "active",
            education: "S3 Teknik Informatika",
            specialization: "Database Systems",
            joinDate: "2017-08-20",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b2e66de4?w=150&h=150&fit=crop&crop=face",
            lastLogin: "1 jam yang lalu",
            totalSubjects: 4,
            totalStudents: 95
        },
        {
            id: 3,
            nidn: "0408078903",
            name: "Dr. Budi Santoso, M.Kom",
            email: "budi.santoso@univ.ac.id",
            phone: "+62 814-1234-5678",
            department: "Teknik Informatika",
            position: "Lektor",
            status: "active",
            education: "S3 Ilmu Komputer",
            specialization: "Software Engineering",
            joinDate: "2019-01-10",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
            lastLogin: "3 jam yang lalu",
            totalSubjects: 2,
            totalStudents: 78
        },
        {
            id: 4,
            nidn: "0430088904",
            name: "Dr. Rina Melati, S.T, M.T",
            email: "rina.melati@univ.ac.id",
            phone: "+62 815-2468-1357",
            department: "Manajemen Informatika",
            position: "Asisten Profesor",
            status: "active",
            education: "S3 Teknik Informatika",
            specialization: "Human Computer Interaction",
            joinDate: "2020-09-05",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
            lastLogin: "5 jam yang lalu",
            totalSubjects: 3,
            totalStudents: 65
        },
        {
            id: 5,
            nidn: "0415078905",
            name: "Muhammad Rizki, S.Kom, M.Kom",
            email: "m.rizki@univ.ac.id",
            phone: "+62 816-3691-2580",
            department: "Teknik Informatika",
            position: "Lektor",
            status: "inactive",
            education: "S2 Teknik Informatika",
            specialization: "Network Security",
            joinDate: "2021-01-15",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
            lastLogin: "1 minggu yang lalu",
            totalSubjects: 2,
            totalStudents: 45
        },
        {
            id: 6,
            nidn: "0422078906",
            name: "Dr. Indira Putri, S.Si, M.Kom",
            email: "indira.putri@univ.ac.id",
            phone: "+62 817-4815-1623",
            department: "Sistem Informasi",
            position: "Lektor Kepala",
            status: "active",
            education: "S3 Sistem Informasi",
            specialization: "Data Mining",
            joinDate: "2018-06-12",
            avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
            lastLogin: "4 jam yang lalu",
            totalSubjects: 3,
            totalStudents: 110
        },
        {
            id: 7,
            nidn: "0418088907",
            name: "Dimas Prasetyo, S.Kom, M.T",
            email: "dimas.prasetyo@univ.ac.id",
            phone: "+62 818-7410-9632",
            department: "Manajemen Informatika",
            position: "Asisten Profesor",
            status: "active",
            education: "S2 Teknik Informatika",
            specialization: "Mobile Development",
            joinDate: "2022-07-22",
            avatar: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face",
            lastLogin: "6 jam yang lalu",
            totalSubjects: 2,
            totalStudents: 55
        },
        {
            id: 8,
            nidn: "0420088908",
            name: "Dr. Lestari Wulandari, M.Kom",
            email: "lestari.wulandari@univ.ac.id",
            phone: "+62 819-8527-4163",
            department: "Teknik Informatika",
            position: "Profesor",
            status: "active",
            education: "S3 Ilmu Komputer",
            specialization: "Computer Vision",
            joinDate: "2016-02-28",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
            lastLogin: "1 jam yang lalu",
            totalSubjects: 4,
            totalStudents: 135
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

    // Filter lecturers
    const filteredLecturers = dummyLecturers.filter(lecturer => {
        const matchesSearch = lecturer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lecturer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lecturer.nidn.includes(searchTerm);
        const matchesDepartment = filterDepartment === "all" || lecturer.department === filterDepartment;
        const matchesStatus = filterStatus === "all" || lecturer.status === filterStatus;
        const matchesPosition = filterPosition === "all" || lecturer.position === filterPosition;

        return matchesSearch && matchesDepartment && matchesStatus && matchesPosition;
    });

    // Pagination
    const indexOfLastLecturer = currentPage * lecturersPerPage;
    const indexOfFirstLecturer = indexOfLastLecturer - lecturersPerPage;
    const currentLecturers = filteredLecturers.slice(indexOfFirstLecturer, indexOfLastLecturer);
    const totalPages = Math.ceil(filteredLecturers.length / lecturersPerPage);

    const handleDropdownToggle = (lecturerId) => {
        setShowDropdown(showDropdown === lecturerId ? null : lecturerId);
    };

    // Modal functions
    const openEditModal = (lecturer) => {
        setSelectedLecturer(lecturer);
        setEditFormData({
            nidn: lecturer.nidn,
            name: lecturer.name,
            email: lecturer.email,
            phone: lecturer.phone,
            department: lecturer.department,
            position: lecturer.position,
            status: lecturer.status,
            education: lecturer.education,
            specialization: lecturer.specialization
        });
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedLecturer(null);
        setEditFormData({
            nidn: "",
            name: "",
            email: "",
            phone: "",
            department: "",
            position: "",
            status: "",
            education: "",
            specialization: ""
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveLecturer = () => {
        console.log('Saving lecturer:', editFormData);
        closeEditModal();
        alert('Data dosen berhasil diperbarui!');
    };

    const getStatusColor = (status) => {
        return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
    };

    const getPositionColor = (position) => {
        const colors = {
            'Profesor': 'bg-purple-100 text-purple-800',
            'Lektor Kepala': 'bg-blue-100 text-blue-800',
            'Lektor': 'bg-indigo-100 text-indigo-800',
            'Asisten Profesor': 'bg-green-100 text-green-800'
        };
        return colors[position] || 'bg-gray-100 text-gray-800';
    };

    const stats = [
        {
            title: "Total Dosen",
            value: dummyLecturers.length,
            change: "+3%",
            icon: MdGroups,
            color: "bg-gradient-to-r from-blue-500 to-blue-600"
        },
        {
            title: "Profesor",
            value: dummyLecturers.filter(l => l.position === 'Profesor').length,
            change: "+1%",
            icon: MdSchool,
            color: "bg-gradient-to-r from-purple-500 to-purple-600"
        },
        {
            title: "Dosen Aktif",
            value: dummyLecturers.filter(l => l.status === 'active').length,
            change: "+5%",
            icon: MdCheckCircle,
            color: "bg-gradient-to-r from-green-500 to-green-600"
        },
        {
            title: "Total Mahasiswa",
            value: dummyLecturers.reduce((sum, l) => sum + l.totalStudents, 0),
            change: "+15%",
            icon: MdPerson,
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
                            Manajemen Dosen
                        </h1>
                        <p className="text-gray-600 text-lg">Kelola data dan informasi dosen pengajar</p>
                    </div>
                    <div className="flex flex-wrap gap-3 mt-4 lg:mt-0">
                        <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                            <MdAdd className="w-5 h-5" />
                            Tambah Dosen
                        </button>
                        <button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                            <MdFileUpload className="w-5 h-5" />
                            Import Data
                        </button>
                        <button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                            <MdFileDownload className="w-5 h-5" />
                            Export Data
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
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1 relative">
                        <MdSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Cari dosen berdasarkan nama, email, atau NIDN..."
                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        value={filterDepartment}
                        onChange={(e) => setFilterDepartment(e.target.value)}
                    >
                        <option value="all">Semua Jurusan</option>
                        <option value="Teknik Informatika">Teknik Informatika</option>
                        <option value="Sistem Informasi">Sistem Informasi</option>
                        <option value="Manajemen Informatika">Manajemen Informatika</option>
                    </select>
                    <select
                        className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        value={filterPosition}
                        onChange={(e) => setFilterPosition(e.target.value)}
                    >
                        <option value="all">Semua Jabatan</option>
                        <option value="Profesor">Profesor</option>
                        <option value="Lektor Kepala">Lektor Kepala</option>
                        <option value="Lektor">Lektor</option>
                        <option value="Asisten Profesor">Asisten Profesor</option>
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

            {/* Lecturers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {currentLecturers.map((lecturer, index) => (
                    <div
                        key={lecturer.id}
                        className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
                        data-aos="fade-up"
                        data-aos-delay={index * 100}
                    >
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-4">
                                    <img
                                        src={lecturer.avatar}
                                        alt={lecturer.name}
                                        className="w-16 h-16 rounded-full object-cover border-4 border-gray-100"
                                    />
                                    <div>
                                        <h3 className="font-bold text-gray-800 text-lg leading-tight">{lecturer.name}</h3>
                                        <p className="text-gray-600 text-sm">{lecturer.department}</p>
                                        <p className="text-gray-500 text-xs">NIDN: {lecturer.nidn}</p>
                                    </div>
                                </div>
                                <div className="relative">
                                    <button
                                        onClick={() => handleDropdownToggle(lecturer.id)}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                    >
                                        <MdMoreVert className="w-5 h-5 text-gray-600" />
                                    </button>
                                    {showDropdown === lecturer.id && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-10">
                                            <button className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200">
                                                <MdVisibility className="w-4 h-4 text-blue-600" />
                                                <span className="text-sm text-gray-700">Lihat Detail</span>
                                            </button>
                                            <button
                                                className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200"
                                                onClick={() => openEditModal(lecturer)}
                                            >
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
                                    <span className="text-sm text-gray-600 truncate">{lecturer.email}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <MdPhone className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm text-gray-600">{lecturer.phone}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <MdWork className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm text-gray-600">{lecturer.specialization}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <MdDateRange className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm text-gray-600">Login terakhir: {lecturer.lastLogin}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mb-4">
                                <div className="flex gap-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPositionColor(lecturer.position)}`}>
                                        {lecturer.position}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(lecturer.status)}`}>
                                        {lecturer.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-blue-600">{lecturer.totalSubjects}</p>
                                    <p className="text-xs text-gray-500">Mata Kuliah</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-green-600">{lecturer.totalStudents}</p>
                                    <p className="text-xs text-gray-500">Mahasiswa</p>
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
            {filteredLecturers.length === 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center" data-aos="fade-up">
                    <MdGroups className="h-20 w-20 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">Tidak ada data dosen</h3>
                    <p className="text-gray-500">Coba ubah filter pencarian atau tambah dosen baru</p>
                </div>
            )}

            {/* Edit Lecturer Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">Edit Data Dosen</h2>
                                <p className="text-gray-600 mt-1">Perbarui informasi dosen</p>
                            </div>
                            <button
                                onClick={closeEditModal}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                            >
                                <MdClose className="h-6 w-6 text-gray-600" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6">
                            <form className="space-y-6">
                                {/* NIDN and Name Row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            NIDN <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="nidn"
                                            value={editFormData.nidn}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300"
                                            placeholder="Masukkan NIDN"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nama Lengkap <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={editFormData.name}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300"
                                            placeholder="Masukkan nama lengkap"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Email and Phone Row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={editFormData.email}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300"
                                            placeholder="Masukkan email"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nomor Telepon <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={editFormData.phone}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300"
                                            placeholder="Masukkan nomor telepon"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Department and Position Row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Jurusan <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="department"
                                            value={editFormData.department}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300"
                                            required
                                        >
                                            <option value="">Pilih Jurusan</option>
                                            <option value="Teknik Informatika">Teknik Informatika</option>
                                            <option value="Sistem Informasi">Sistem Informasi</option>
                                            <option value="Manajemen Informatika">Manajemen Informatika</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Jabatan <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="position"
                                            value={editFormData.position}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300"
                                            required
                                        >
                                            <option value="">Pilih Jabatan</option>
                                            <option value="Profesor">Profesor</option>
                                            <option value="Lektor Kepala">Lektor Kepala</option>
                                            <option value="Lektor">Lektor</option>
                                            <option value="Asisten Profesor">Asisten Profesor</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Education and Specialization Row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Pendidikan <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="education"
                                            value={editFormData.education}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300"
                                            placeholder="Masukkan pendidikan terakhir"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Spesialisasi <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="specialization"
                                            value={editFormData.specialization}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300"
                                            placeholder="Masukkan bidang spesialisasi"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Status Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Status <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="status"
                                        value={editFormData.status}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300"
                                        required
                                    >
                                        <option value="">Pilih Status</option>
                                        <option value="active">Aktif</option>
                                        <option value="inactive">Tidak Aktif</option>
                                        <option value="cuti">Cuti</option>
                                        <option value="pensiun">Pensiun</option>
                                    </select>
                                </div>

                                {/* Current Lecturer Info */}
                                {selectedLecturer && (
                                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                        <h4 className="font-medium text-blue-800 mb-2">Informasi Saat Ini:</h4>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="text-blue-600">NIDN:</span>
                                                <span className="ml-2 text-blue-800">{selectedLecturer.nidn}</span>
                                            </div>
                                            <div>
                                                <span className="text-blue-600">Nama:</span>
                                                <span className="ml-2 text-blue-800">{selectedLecturer.name}</span>
                                            </div>
                                            <div>
                                                <span className="text-blue-600">Jurusan:</span>
                                                <span className="ml-2 text-blue-800">{selectedLecturer.department}</span>
                                            </div>
                                            <div>
                                                <span className="text-blue-600">Jabatan:</span>
                                                <span className="ml-2 text-blue-800">{selectedLecturer.position}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </form>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-end gap-4 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                            <button
                                type="button"
                                onClick={closeEditModal}
                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-300 flex items-center gap-2"
                            >
                                <MdCancel className="h-4 w-4" />
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleSaveLecturer}
                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
                            >
                                <MdSave className="h-4 w-4" />
                                Simpan Perubahan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LecturerManagement;
