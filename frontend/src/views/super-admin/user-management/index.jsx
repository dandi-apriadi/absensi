import React, { useState, useEffect, useCallback } from "react";
import {
    MdPeople,
    MdAdd,
    MdSearch,
    MdFilterList,
    MdEdit,
    MdDelete,
    MdSchool,
    MdPersonOutline,
    MdEmail,
    MdPhone,
    MdCheckCircle,
    MdCancel
} from "react-icons/md";
import AOS from 'aos';
import 'aos/dist/aos.css';
import {
    fetchUsers,
    createUser as apiCreateUser,
    updateUser as apiUpdateUser,
    deleteUser as apiDeleteUser,
    updateUserStatus as apiUpdateUserStatus,
    fetchDashboard
} from '../../../services/userManagementService';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const UserManagement = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterRole, setFilterRole] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage, setUsersPerPage] = useState(6);
    const [users, setUsers] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [creating, setCreating] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [newUser, setNewUser] = useState({ 
        full_name: '', 
        email: '', 
        user_id: '',
        phone: '',
        role: 'student', 
        status: 'active',
        password: '',
        department: '',
        program_study: ''
    });
    const [statsData, setStatsData] = useState({ loading: true, error: null, overview: null });

    const loadUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const apiRole = filterRole === 'all' ? '' : filterRole; // send 'student', 'lecturer', 'super-admin' directly
            const data = await fetchUsers({
                page: currentPage,
                limit: usersPerPage,
                search: searchTerm,
                role: apiRole,
                status: filterStatus === 'all' ? '' : filterStatus
            });
            
            console.log('Raw API data:', data); // Debug log
            console.log('Raw users array:', data.users); // Debug log
            
            // backend returns users with fields role maybe in english (lecturer/student) adjust mapping
            const mapped = (data.users || []).map((u, index) => {
                console.log(`Processing user ${index + 1}:`, u); // Debug log
                console.log('Available fields:', Object.keys(u)); // Debug log
                console.log('id field:', u.id); // Debug log
                console.log('user_id field:', u.user_id); // Debug log
                
                const userName = u.full_name || u.fullname || u.name || 'Nama tidak tersedia';
                // user_id is the primary key (UUID), use it as id
                const primaryId = u.user_id; // Backend uses user_id as primary key
                
                console.log('Final userName:', userName); // Debug log
                console.log('Final primaryId:', primaryId); // Debug log
                
                return {
                    id: primaryId, // Use user_id as primary identifier for API calls
                    user_id: u.user_id || '-',
                    name: userName,
                    email: u.email || '-',
                    phone: u.phone || '-',
                    role: u.role, // keep original role value for filtering
                    roleDisplay: u.role === 'lecturer' ? 'dosen' : (u.role === 'student' ? 'mahasiswa' : (u.role === 'super-admin' ? 'super-admin' : u.role)),
                    status: u.status || 'active',
                    department: u.department || u.program_study || '-',
                    avatar: u.profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=random`,
                    lastLogin: u.last_login ? new Date(u.last_login).toLocaleDateString('id-ID') : '-',
                    gender: u.gender || '-',
                    address: u.address || '-',
                    birth_date: u.birth_date || '-',
                    created_at: u.created_at,
                    updated_at: u.updated_at
                };
            });
            setUsers(mapped);
            if (data.pagination) {
                setTotalPages(data.pagination.totalPages || 1);
                setTotalItems(data.pagination.totalItems || mapped.length);
                // sinkronkan current page jika backend mengembalikan berbeda
                if (data.pagination.currentPage && data.pagination.currentPage !== currentPage) {
                    setCurrentPage(data.pagination.currentPage);
                }
            } else {
                setTotalPages(1);
                setTotalItems(mapped.length);
            }
        } catch (e) {
            console.error(e);
            setError('Gagal memuat data pengguna');
        } finally {
            setLoading(false);
        }
    }, [currentPage, usersPerPage, searchTerm, filterRole, filterStatus]);

    useEffect(() => {
        AOS.init({
            duration: 800,
            offset: 100,
            easing: 'ease-in-out',
            once: true
        });
    }, []);

    useEffect(() => { loadUsers(); }, [loadUsers]);

    const filteredUsers = users; // sudah difilter dari backend
    const currentUsers = users; // backend sudah memberi data halaman saat ini

    const getRoleColor = (role) => {
        switch(role) {
            case 'dosen':
            case 'lecturer':
                return 'bg-purple-100 text-purple-800';
            case 'mahasiswa':
            case 'student':
                return 'bg-blue-100 text-blue-800';
            case 'super-admin':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'inactive':
                return 'bg-red-100 text-red-800';
            case 'suspended':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const stats = (() => {
        const o = statsData.overview;
        return [
            { key: 'totalUsers', title: 'Total Pengguna', value: o?.totalUsers ?? '-', change: '', icon: MdPeople, color: 'bg-gradient-to-r from-blue-500 to-blue-600' },
            { key: 'totalStudents', title: 'Mahasiswa', value: o?.totalStudents ?? '-', change: '', icon: MdPersonOutline, color: 'bg-gradient-to-r from-green-500 to-green-600' },
            { key: 'activeUsers', title: 'Pengguna Aktif', value: o?.activeUsers ?? '-', change: '', icon: MdCheckCircle, color: 'bg-gradient-to-r from-emerald-500 to-emerald-600' }
        ];
    })();

    // Fetch dashboard stats sekali saat mount
    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setStatsData(s => ({ ...s, loading: true, error: null }));
                const data = await fetchDashboard();
                if (mounted) setStatsData({ loading: false, error: null, overview: data.overview });
            } catch (e) {
                if (mounted) setStatsData({ loading: false, error: e.response?.data?.message || 'Gagal memuat statistik', overview: null });
            }
        })();
        return () => { mounted = false; };
    }, []);

    const handleCreate = async () => {
        setCreating(true);
        try {
            const payload = {
                user_id: newUser.user_id || 'USR' + Date.now(),
                email: newUser.email,
                password: newUser.password || 'Password123!',
                // Backend expects 'fullname'
                fullname: newUser.full_name,
                phone: newUser.phone,
                role: newUser.role, // send as is since backend expects 'student', 'lecturer', 'super-admin'
                status: newUser.status,
                department: newUser.department,
                program_study: newUser.program_study
            };
            await apiCreateUser(payload);
            await loadUsers();
            setNewUser({ 
                full_name: '', 
                email: '', 
                user_id: '',
                phone: '',
                role: 'student', 
                status: 'active',
                password: '',
                department: '',
                program_study: ''
            });
            Swal.fire('Sukses', 'User berhasil dibuat', 'success');
        } catch (e) {
            Swal.fire('Error', e.response?.data?.message || 'Gagal membuat user', 'error');
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: 'Hapus User?',
            text: 'Tindakan ini tidak dapat dibatalkan. Data user akan dihapus permanen.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: '<i class="fas fa-trash"></i> Ya, Hapus!',
            cancelButtonText: '<i class="fas fa-times"></i> Batal',
            reverseButtons: true,
            customClass: {
                confirmButton: 'px-6 py-2 rounded-lg',
                cancelButton: 'px-6 py-2 rounded-lg'
            }
        });
        
        if (!confirm.isConfirmed) return;
        
        // Show loading indicator
        Swal.fire({
            title: 'Menghapus...',
            text: 'Mohon tunggu sebentar',
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        
        try {
            await apiDeleteUser(id);
            await loadUsers();
            Swal.fire({
                icon: 'success',
                title: 'Berhasil Dihapus!',
                text: 'User berhasil dihapus dari sistem',
                showConfirmButton: false,
                timer: 2000
            });
        } catch (e) {
            console.error('Error deleting user:', e);
            Swal.fire({
                icon: 'error',
                title: 'Gagal Menghapus',
                text: e.response?.data?.message || 'Terjadi kesalahan saat menghapus user',
                confirmButtonText: 'OK',
                confirmButtonColor: '#3085d6'
            });
        }
    };

    const handleStatusToggle = async (user) => {
        const newStatus = user.status === 'active' ? 'inactive' : 'active';
        try {
            await apiUpdateUserStatus(user.id, newStatus);
            await loadUsers();
            Swal.fire({
                icon: 'success',
                title: 'Status Diperbarui!',
                text: `Status user berhasil diubah menjadi ${newStatus === 'active' ? 'aktif' : 'tidak aktif'}`,
                showConfirmButton: false,
                timer: 2000
            });
        } catch (e) {
            console.error('Error updating status:', e);
            Swal.fire({
                icon: 'error',
                title: 'Gagal Mengubah Status',
                text: e.response?.data?.message || 'Terjadi kesalahan saat mengubah status',
                confirmButtonText: 'OK'
            });
        }
    };

    const handleEditUser = (user) => {
        console.log('=== EDIT USER CLICKED ===');
        console.log('User object:', user);
        console.log('User ID:', user.id);
        console.log('User user_id:', user.user_id);
        console.log('========================');
        
        if (!user.id) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'ID user tidak ditemukan. Silakan refresh halaman dan coba lagi.',
                confirmButtonText: 'OK'
            });
            return;
        }
        
        setEditUser({
            id: user.id,
            full_name: user.name,
            email: user.email,
            user_id: user.user_id,
            phone: user.phone !== '-' ? user.phone : '',
            role: user.role,
            status: user.status,
            department: user.department !== '-' ? user.department : '',
            gender: user.gender !== '-' ? user.gender : '',
            address: user.address !== '-' ? user.address : '',
            birth_date: user.birth_date !== '-' ? user.birth_date : ''
        });
        setShowEditModal(true);
    };

    const handleUpdateUser = async () => {
        if (!editUser) return;
        
        console.log('=== UPDATE USER ===');
        console.log('editUser object:', editUser);
        console.log('editUser.id:', editUser.id);
        console.log('==================');
        
        if (!editUser.id) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'ID user tidak valid. Silakan tutup modal dan coba lagi.',
                confirmButtonText: 'OK'
            });
            return;
        }
        
        try {
            const nullIfEmpty = (v) => (typeof v === 'string' ? (v.trim() === '' ? null : v.trim()) : v);
            const normalizeGender = (g) => {
                if (!g) return null;
                const val = (g || '').toString().toLowerCase();
                if (val === 'laki-laki' || val === 'male') return 'male';
                if (val === 'perempuan' || val === 'female') return 'female';
                return null; // fallback to null for invalid values
            };
            const payload = {
                full_name: nullIfEmpty(editUser.full_name),
                email: nullIfEmpty(editUser.email),
                user_id: editUser.user_id, // will be ignored by backend for safety
                phone: nullIfEmpty(editUser.phone),
                role: editUser.role,
                status: editUser.status,
                department: nullIfEmpty(editUser.department),
                gender: normalizeGender(editUser.gender),
                address: nullIfEmpty(editUser.address),
                birth_date: nullIfEmpty(editUser.birth_date)
            };
            
            console.log('Calling apiUpdateUser with ID:', editUser.id);
            console.log('Payload:', payload);
            
            await apiUpdateUser(editUser.id, payload);
            await loadUsers();
            setShowEditModal(false);
            setEditUser(null);
            
            Swal.fire({
                icon: 'success',
                title: 'Berhasil Diperbarui!',
                text: 'Data user berhasil diperbarui',
                showConfirmButton: false,
                timer: 2000
            });
        } catch (e) {
            console.error('Error updating user:', e);
            Swal.fire({
                icon: 'error',
                title: 'Gagal Memperbarui',
                text: e.response?.data?.message || 'Terjadi kesalahan saat memperbarui data',
                confirmButtonText: 'OK'
            });
        }
    };

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
                    <div className="flex flex-col md:flex-row gap-3 md:items-end">
                        <div className="flex flex-col">
                            <input value={newUser.full_name} onChange={e=>setNewUser(n=>({...n, full_name:e.target.value}))} placeholder="Nama Lengkap" className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                        </div>
                        <div className="flex flex-col">
                            <input value={newUser.user_id} onChange={e=>setNewUser(n=>({...n, user_id:e.target.value}))} placeholder="User ID (NIM/NIP)" className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                        </div>
                        <div className="flex flex-col">
                            <input value={newUser.email} onChange={e=>setNewUser(n=>({...n, email:e.target.value}))} placeholder="Email" className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                        </div>
                        <div className="flex flex-col">
                            <input value={newUser.phone} onChange={e=>setNewUser(n=>({...n, phone:e.target.value}))} placeholder="No. Telepon" className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                        </div>
                        <div className="flex flex-col">
                            <select value={newUser.role} onChange={e=>setNewUser(n=>({...n, role:e.target.value}))} className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                                <option value="student">Mahasiswa</option>
                                <option value="lecturer">Dosen</option>
                                <option value="super-admin">Super Admin</option>
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <select value={newUser.status} onChange={e=>setNewUser(n=>({...n, status:e.target.value}))} className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                                <option value="active">Aktif</option>
                                <option value="inactive">Tidak Aktif</option>
                                <option value="suspended">Suspended</option>
                            </select>
                        </div>
                    <button onClick={handleCreate} disabled={creating} className="mt-4 lg:mt-0 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                        <MdAdd className="w-5 h-5" />
                        {creating ? 'Menyimpan...' : 'Tambah Pengguna'}
                    </button>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
                                                <h3 className="text-3xl font-bold text-gray-800">
                                                    {statsData.loading ? '...' : stat.value}
                                                </h3>
                                                <p className="text-green-600 text-xs font-medium mt-1">
                                                    {statsData.error ? <span className="text-red-500">{statsData.error}</span> : (stat.change || ' ')}
                                                </p>
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
                        <option value="student">Mahasiswa</option>
                        <option value="lecturer">Dosen</option>
                        <option value="super-admin">Super Admin</option>
                    </select>
                    <select
                        className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="all">Semua Status</option>
                        <option value="active">Aktif</option>
                        <option value="inactive">Tidak Aktif</option>
                        <option value="suspended">Suspended</option>
                    </select>
                </div>
            </div>

            {/* Users Grid */}
            {error && <div className="text-red-600 mb-4">{error}</div>}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-8" data-aos="fade-up">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 text-xs uppercase tracking-wider font-semibold">
                            <tr>
                                <th className="px-4 py-4 text-left">#</th>
                                <th className="px-4 py-4 text-left">
                                    <div className="flex items-center gap-2">
                                        <MdPersonOutline className="w-4 h-4" />
                                        Pengguna
                                    </div>
                                </th>
                                <th className="px-4 py-4 text-left">
                                    <div className="flex items-center gap-2">
                                        <MdSchool className="w-4 h-4" />
                                        User ID
                                    </div>
                                </th>
                                <th className="px-4 py-4 text-left">
                                    <div className="flex items-center gap-2">
                                        <MdEmail className="w-4 h-4" />
                                        Email
                                    </div>
                                </th>
                                <th className="px-4 py-4 text-left">
                                    <div className="flex items-center gap-2">
                                        <MdPhone className="w-4 h-4" />
                                        Telepon
                                    </div>
                                </th>
                                <th className="px-4 py-4 text-left">Role</th>
                                <th className="px-4 py-4 text-left">Status</th>
                                <th className="px-4 py-4 text-left">Dept/Prodi</th>
                                <th className="px-4 py-4 text-left">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading && (
                                <tr><td colSpan={9} className="px-4 py-6 text-center text-gray-500">Memuat data...</td></tr>
                            )}
                            {!loading && currentUsers.length === 0 && (
                                <tr><td colSpan={9} className="px-4 py-10 text-center text-gray-500">Tidak ada data pengguna</td></tr>
                            )}
                            {!loading && currentUsers.map((user, idx) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 align-top">{(currentPage - 1) * usersPerPage + idx + 1}</td>
                                    <td className="px-4 py-3 align-top">
                                        <div className="flex items-center gap-3">
                                            <img 
                                                src={user.avatar} 
                                                alt={user.name || 'User'} 
                                                className="w-10 h-10 rounded-full object-cover border border-gray-200" 
                                                onError={(e) => {
                                                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=6366f1&color=fff`;
                                                }}
                                            />
                                            <div>
                                                <div className="font-medium text-gray-800">{user.name}</div>
                                                <div className="text-xs text-gray-500">
                                                    {user.gender === 'male' ? 'Laki-laki' : user.gender === 'female' ? 'Perempuan' : '-'}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 align-top">
                                        <div className="font-mono text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded border">
                                            {user.user_id}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 align-top text-gray-700">
                                        <div className="max-w-xs truncate" title={user.email}>
                                            {user.email}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 align-top text-gray-700">
                                        <div className="text-sm">
                                            {user.phone === '-' ? 
                                                <span className="text-gray-400 italic">Belum diisi</span> : 
                                                user.phone
                                            }
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 align-top">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getRoleColor(user.role)}`}>
                                            {user.role === 'student' ? 'Mahasiswa' : user.role === 'lecturer' ? 'Dosen' : user.role === 'super-admin' ? 'Super Admin' : user.role}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 align-top">
                                        <button onClick={() => handleStatusToggle(user)} className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(user.status)} hover:opacity-80 transition-opacity`}>
                                            {user.status === 'active' ? 'Aktif' : user.status === 'inactive' ? 'Tidak Aktif' : 'Suspended'}
                                        </button>
                                    </td>
                                    <td className="px-4 py-3 align-top text-gray-700">
                                        <div className="text-sm">
                                            {user.department === '-' ? 
                                                <span className="text-gray-400 italic">Belum diisi</span> : 
                                                user.department
                                            }
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 align-top">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <button 
                                                onClick={() => handleEditUser(user)}
                                                className="flex items-center gap-1 px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-xs font-medium"
                                                title="Edit Data"
                                            >
                                                <MdEdit className="w-4 h-4" />
                                                <span className="hidden sm:inline">Edit</span>
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(user.id)} 
                                                className="flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-xs font-medium"
                                                title="Hapus User"
                                            >
                                                <MdDelete className="w-4 h-4" />
                                                <span className="hidden sm:inline">Hapus</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8" data-aos="fade-up">
                <div className="text-sm text-gray-600">
                    {totalItems > 0 && (
                        <>Menampilkan {(currentPage - 1) * usersPerPage + 1} - {Math.min(currentPage * usersPerPage, totalItems)} dari {totalItems} pengguna</>
                    )}
                </div>
                <div className="flex items-center gap-4">
                    <select
                        value={usersPerPage}
                        onChange={(e) => { setUsersPerPage(parseInt(e.target.value)); setCurrentPage(1); }}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    >
                        {[6, 10, 20, 50].map(size => <option key={size} value={size}>{size} / page</option>)}
                    </select>
                    {totalPages > 1 && (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50"
                            >Prev</button>
                            <div className="flex gap-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).slice(
                                    Math.max(0, Math.min(totalPages - 5, currentPage - 3)),
                                    Math.max(0, Math.min(totalPages - 5, currentPage - 3)) + Math.min(5, totalPages)
                                ).map(p => (
                                    <button key={p} onClick={() => setCurrentPage(p)}
                                        className={`px-3 py-2 rounded-lg text-sm ${p === currentPage ? 'bg-blue-600 text-white' : 'border border-gray-300 hover:bg-gray-50'}`}>{p}</button>
                                ))}
                            </div>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50"
                            >Next</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Empty State */}
            {(!loading && filteredUsers.length === 0) && (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center" data-aos="fade-up">
                    <MdPeople className="h-20 w-20 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">Tidak ada data pengguna</h3>
                    <p className="text-gray-500">Coba ubah filter pencarian atau tambah pengguna baru</p>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && editUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowEditModal(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 rounded-t-2xl">
                            <div className="flex items-center justify-between text-white">
                                <h2 className="text-2xl font-bold">Edit Pengguna</h2>
                                <button onClick={() => setShowEditModal(false)} className="hover:bg-white/20 p-2 rounded-lg transition-colors">
                                    <MdCancel className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Lengkap *</label>
                                    <input 
                                        type="text"
                                        value={editUser.full_name}
                                        onChange={(e) => setEditUser({...editUser, full_name: e.target.value})}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="Masukkan nama lengkap"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">User ID (NIM/NIP) *</label>
                                    <input 
                                        type="text"
                                        value={editUser.user_id}
                                        readOnly
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
                                        placeholder="User ID tidak dapat diubah"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                                    <input 
                                        type="email"
                                        value={editUser.email}
                                        onChange={(e) => setEditUser({...editUser, email: e.target.value})}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="Masukkan email"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">No. Telepon</label>
                                    <input 
                                        type="text"
                                        value={editUser.phone}
                                        onChange={(e) => setEditUser({...editUser, phone: e.target.value})}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="Masukkan nomor telepon"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Role *</label>
                                    <select 
                                        value={editUser.role}
                                        onChange={(e) => setEditUser({...editUser, role: e.target.value})}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    >
                                        <option value="student">Mahasiswa</option>
                                        <option value="lecturer">Dosen</option>
                                        <option value="super-admin">Super Admin</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Status *</label>
                                    <select 
                                        value={editUser.status}
                                        onChange={(e) => setEditUser({...editUser, status: e.target.value})}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    >
                                        <option value="active">Aktif</option>
                                        <option value="inactive">Tidak Aktif</option>
                                        <option value="suspended">Suspended</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Departemen/Prodi</label>
                                    <input 
                                        type="text"
                                        value={editUser.department}
                                        onChange={(e) => setEditUser({...editUser, department: e.target.value})}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="Masukkan departemen/prodi"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Jenis Kelamin</label>
                                    <select 
                                        value={editUser.gender}
                                        onChange={(e) => setEditUser({...editUser, gender: e.target.value})}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    >
                                        <option value="">Pilih jenis kelamin</option>
                                        <option value="male">Laki-laki</option>
                                        <option value="female">Perempuan</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Tanggal Lahir</label>
                                    <input 
                                        type="date"
                                        value={editUser.birth_date}
                                        onChange={(e) => setEditUser({...editUser, birth_date: e.target.value})}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Alamat</label>
                                    <textarea 
                                        value={editUser.address}
                                        onChange={(e) => setEditUser({...editUser, address: e.target.value})}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="Masukkan alamat lengkap"
                                        rows="3"
                                    />
                                </div>
                            </div>
                            
                            <div className="mt-6 pt-6 border-t border-gray-200 flex gap-3">
                                <button 
                                    onClick={() => setShowEditModal(false)}
                                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                                >
                                    Batal
                                </button>
                                <button 
                                    onClick={handleUpdateUser}
                                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                                >
                                    Simpan Perubahan
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
