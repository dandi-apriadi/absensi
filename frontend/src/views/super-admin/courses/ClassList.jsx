import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AOS from 'aos';
import {
  MdAdd,
  MdClass,
  MdPeople,
  MdSchool,
  MdPerson,
  MdAccessTime,
  MdCalendarToday,
  MdBarChart,
  MdSearch,
  MdFilterList,
  MdRefresh,
  MdEdit,
  MdDelete,
  MdInfo,
  MdCheckCircle,
  MdCancel,
  MdSchedule,
  MdWarning
} from 'react-icons/md';

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5001";

const ClassList = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterProgram, setFilterProgram] = useState('all');
  const [stats, setStats] = useState({
    totalClasses: 0,
    activeClasses: 0,
    totalStudents: 0,
    averageStudents: 0
  });
  const [editingClass, setEditingClass] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingClass, setDeletingClass] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 600,
      once: true,
      easing: 'ease-out-cubic'
    });
  }, []);

  // Fetch classes from API
  const fetchClasses = async () => {
    try {
      setLoading(true);
      
      // Use the new endpoint that gets all classes with statistics
      const response = await axios.get(`${API_BASE}/api/courses/classes/all-with-stats`, {
        withCredentials: true,
        params: { 
          limit: 1000 
        }
      });
      
      const classesData = response.data?.data?.classes || [];
      setClasses(classesData);
      calculateStats(classesData);
      
    } catch (error) {
      console.error('Error fetching classes:', error);
      // Fallback to empty array if API fails
      setClasses([]);
      calculateStats([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const calculateStats = (classesData) => {
    const totalClasses = classesData.length;
    const activeClasses = classesData.filter(cls => cls.status === 'active').length;
    const totalStudents = classesData.reduce((sum, cls) => sum + (cls.enrolled_count || 0), 0);
    const averageStudents = totalClasses > 0 ? Math.round(totalStudents / totalClasses) : 0;
    
    setStats({
      totalClasses,
      activeClasses,
      totalStudents,
      averageStudents
    });
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  // Filter classes based on search and filters
  const filteredClasses = classes.filter(cls => {
    const matchesSearch = 
      cls.class_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.course?.course_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.course?.course_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.lecturer_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || cls.status === filterStatus;
    const matchesProgram = filterProgram === 'all' || cls.course?.program_study === filterProgram;
    
    return matchesSearch && matchesStatus && matchesProgram;
  });

  // Get unique program studies for filter
  const programStudies = [...new Set(classes.map(cls => cls.course?.program_study).filter(Boolean))];

  // Format schedule for display
  const formatSchedule = (schedule) => {
    try {
      const scheduleArray = typeof schedule === 'string' ? JSON.parse(schedule) : schedule;
      if (Array.isArray(scheduleArray) && scheduleArray.length > 0) {
        return scheduleArray.map(sch => `${sch.day} ${sch.start_time}-${sch.end_time}`).join(', ');
      }
    } catch (e) {
      console.log('Error parsing schedule:', e);
    }
    return 'Belum dijadwalkan';
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <MdCheckCircle className="w-4 h-4" />;
      case 'completed':
        return <MdSchedule className="w-4 h-4" />;
      case 'cancelled':
        return <MdCancel className="w-4 h-4" />;
      default:
        return <MdInfo className="w-4 h-4" />;
    }
  };

  // Handle edit class
  const handleEditClass = (cls) => {
    setEditingClass({
      id: cls.id,
      class_name: cls.class_name,
      lecturer_name: cls.lecturer_name || '',
      academic_year: cls.academic_year,
      semester_period: cls.semester_period,
      max_students: cls.max_students,
      status: cls.status,
      course_name: cls.course?.course_name || '',
      course_code: cls.course?.course_code || ''
    });
    setShowEditModal(true);
  };

  // Save edited class
  const saveEditedClass = async () => {
    if (!editingClass) return;
    
    try {
      setActionLoading(true);
      
      const updateData = {
        class_name: editingClass.class_name,
        lecturer_name: editingClass.lecturer_name,
        academic_year: editingClass.academic_year,
        semester_period: editingClass.semester_period,
        max_students: parseInt(editingClass.max_students),
        status: editingClass.status
      };

      await axios.put(`${API_BASE}/api/courses/classes/${editingClass.id}`, updateData, {
        withCredentials: true
      });

      // Refresh data
      await fetchClasses();
      setShowEditModal(false);
      setEditingClass(null);
      
      // Show success message
      setMessage({ type: 'success', text: 'Kelas berhasil diperbarui!' });
      setTimeout(() => setMessage(null), 5000);
      
    } catch (error) {
      console.error('Error updating class:', error);
      setMessage({ 
        type: 'error', 
        text: 'Gagal memperbarui kelas: ' + (error.response?.data?.message || error.message) 
      });
      setTimeout(() => setMessage(null), 5000);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle delete class
  const handleDeleteClass = (cls) => {
    setDeletingClass(cls);
    setShowDeleteModal(true);
  };

  // Test authentication before delete
  const testAuth = async () => {
    try {
      console.log('Testing authentication...');
      const response = await axios.get(`${API_BASE}/api/test-auth`, {
        withCredentials: true
      });
      console.log('Auth test result:', response.data);
      return response.data;
    } catch (error) {
      console.error('Auth test failed:', error);
      return null;
    }
  };

  // Confirm delete class
  const confirmDeleteClass = async () => {
    if (!deletingClass) return;

    try {
      setActionLoading(true);

      // Test auth first
      const authResult = await testAuth();
      console.log('Auth test before delete:', authResult);

      await axios.delete(`${API_BASE}/api/courses/classes/${deletingClass.id}`, {
        withCredentials: true
      });

      // Refresh data
      await fetchClasses();
      setShowDeleteModal(false);
      setDeletingClass(null);
      
      // Show success message
      setMessage({ type: 'success', text: 'Kelas berhasil dihapus!' });
      setTimeout(() => setMessage(null), 5000);
      
    } catch (error) {
      console.error('Error deleting class:', error);
      setMessage({ 
        type: 'error', 
        text: 'Gagal menghapus kelas: ' + (error.response?.data?.message || error.message) 
      });
      setTimeout(() => setMessage(null), 5000);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data kelas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 md:p-8">
      {/* Header Section */}
      <div className="mb-8" data-aos="fade-down">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="mb-4 lg:mb-0">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                <MdClass className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Manajemen Kelas
                </h1>
                <p className="text-gray-600 mt-1">Kelola semua kelas mata kuliah</p>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/admin/add-class')}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <MdAdd className="w-5 h-5" />
              Tambah Kelas
            </button>
            <button
              onClick={() => navigate('/admin/add-course')}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <MdSchool className="w-5 h-5" />
              Tambah Mata Kuliah
            </button>
            <button
              onClick={fetchClasses}
              className="flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-xl border border-white/20 text-gray-700 rounded-2xl font-medium hover:bg-white/90 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <MdRefresh className="w-5 h-5" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Alert Messages */}
      {message && (
        <div 
          className={`mb-8 p-4 rounded-2xl backdrop-blur-xl border shadow-lg ${
            message.type === 'success' 
              ? 'bg-green-50/80 border-green-200 text-green-800' 
              : 'bg-red-50/80 border-red-200 text-red-800'
          }`}
          data-aos="fade-up"
        >
          <div className="flex items-center gap-3">
            {message.type === 'success' ? (
              <MdCheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            ) : (
              <MdWarning className="w-5 h-5 text-red-600 flex-shrink-0" />
            )}
            <span className="font-medium">{message.text}</span>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" data-aos="fade-up">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
              <MdClass className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Kelas</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalClasses}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
              <MdCheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Kelas Aktif</p>
              <p className="text-2xl font-bold text-gray-800">{stats.activeClasses}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
              <MdPeople className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Mahasiswa</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalStudents}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl">
              <MdBarChart className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Rata-rata/Kelas</p>
              <p className="text-2xl font-bold text-gray-800">{stats.averageStudents}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-6 mb-8" data-aos="fade-up" data-aos-delay="100">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari kelas, mata kuliah, atau dosen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white shadow-sm"
              />
            </div>
          </div>
          
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white shadow-sm min-w-[150px]"
            >
              <option value="all">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="completed">Selesai</option>
              <option value="cancelled">Dibatalkan</option>
            </select>
            
            <select
              value={filterProgram}
              onChange={(e) => setFilterProgram(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white shadow-sm min-w-[200px]"
            >
              <option value="all">Semua Program Studi</option>
              {programStudies.map(program => (
                <option key={program} value={program}>{program}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Classes List */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 overflow-hidden" data-aos="fade-up" data-aos-delay="200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Daftar Kelas</h2>
            <span className="text-sm text-gray-600">
              Menampilkan {filteredClasses.length} dari {classes.length} kelas
            </span>
          </div>
        </div>
        
        {filteredClasses.length === 0 ? (
          <div className="p-12 text-center">
            <MdClass className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">Tidak ada kelas ditemukan</h3>
            <p className="text-gray-600 mb-6">
              {classes.length === 0 
                ? "Belum ada kelas yang dibuat. Mulai dengan menambah kelas baru."
                : "Coba ubah filter atau kata kunci pencarian."
              }
            </p>
            {classes.length === 0 && (
              <button
                onClick={() => navigate('/admin/add-class')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105"
              >
                <MdAdd className="w-5 h-5" />
                Tambah Kelas Pertama
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/80">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mata Kuliah
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kelas
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dosen
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jadwal
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mahasiswa
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredClasses.map((cls, index) => (
                  <tr key={cls.id} className="hover:bg-gray-50/50 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          {cls.course?.course_name || 'Mata Kuliah Tidak Diketahui'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {cls.course?.course_code} • {cls.course?.credits} SKS
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {cls.course?.program_study}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{cls.class_name}</div>
                      <div className="text-sm text-gray-500">
                        {cls.academic_year} • {cls.semester_period}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <MdPerson className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">
                          {cls.lecturer_name || 'Belum ditentukan'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {formatSchedule(cls.schedule)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-center">
                        <div className="font-medium text-gray-900">
                          {cls.enrolled_count || 0} / {cls.max_students}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ 
                              width: `${Math.min(((cls.enrolled_count || 0) / cls.max_students) * 100, 100)}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(cls.status)}`}>
                        {getStatusIcon(cls.status)}
                        {cls.status === 'active' ? 'Aktif' : 
                         cls.status === 'completed' ? 'Selesai' : 
                         cls.status === 'cancelled' ? 'Dibatalkan' : cls.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/admin/manage-class-users?class=${cls.id}`)}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                          title="Kelola mahasiswa"
                        >
                          <MdPeople className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditClass(cls)}
                          className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-all duration-200"
                          title="Edit kelas"
                        >
                          <MdEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClass(cls)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                          title="Hapus kelas"
                        >
                          <MdDelete className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && editingClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Edit Kelas</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <MdCancel className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mata Kuliah
                  </label>
                  <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-600">
                    {editingClass.course_code} - {editingClass.course_name}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Kelas
                  </label>
                  <input
                    type="text"
                    value={editingClass.class_name}
                    onChange={(e) => setEditingClass({...editingClass, class_name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="A, B, C, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Dosen
                  </label>
                  <input
                    type="text"
                    value={editingClass.lecturer_name}
                    onChange={(e) => setEditingClass({...editingClass, lecturer_name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="Nama lengkap dosen"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tahun Akademik
                    </label>
                    <select
                      value={editingClass.academic_year}
                      onChange={(e) => setEditingClass({...editingClass, academic_year: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    >
                      <option value="2023/2024">2023/2024</option>
                      <option value="2024/2025">2024/2025</option>
                      <option value="2025/2026">2025/2026</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Semester
                    </label>
                    <select
                      value={editingClass.semester_period}
                      onChange={(e) => setEditingClass({...editingClass, semester_period: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    >
                      <option value="ganjil">Ganjil</option>
                      <option value="genap">Genap</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Mahasiswa
                    </label>
                    <input
                      type="number"
                      value={editingClass.max_students}
                      onChange={(e) => setEditingClass({...editingClass, max_students: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      min="1"
                      max="100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={editingClass.status}
                      onChange={(e) => setEditingClass({...editingClass, status: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    >
                      <option value="active">Aktif</option>
                      <option value="completed">Selesai</option>
                      <option value="cancelled">Dibatalkan</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                  disabled={actionLoading}
                >
                  Batal
                </button>
                <button
                  onClick={saveEditedClass}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {actionLoading ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Hapus Kelas</h3>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <MdCancel className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl border border-red-200">
                  <MdDelete className="w-8 h-8 text-red-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-red-800">
                      Yakin ingin menghapus kelas ini?
                    </p>
                    <p className="text-sm text-red-600 mt-1">
                      {deletingClass.course?.course_code} - {deletingClass.class_name}
                    </p>
                    <p className="text-xs text-red-500 mt-2">
                      Tindakan ini tidak dapat dibatalkan dan akan menghapus semua data terkait kelas.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                  disabled={actionLoading}
                >
                  Batal
                </button>
                <button
                  onClick={confirmDeleteClass}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {actionLoading ? 'Menghapus...' : 'Hapus'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassList;