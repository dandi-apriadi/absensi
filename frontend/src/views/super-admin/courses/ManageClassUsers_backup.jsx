import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { 
  MdGroup, 
  MdPersonAdd, 
  MdDelete, 
  MdSearch, 
  MdRefresh,
  MdSchool,
  MdClass,
  MdPeople,
  MdCheckCircle,
  MdWarning,
  MdAutoAwesome,
  MdDashboard,
  MdTrendingUp,
  MdAssignment,
  MdFilterList,
  MdViewList
} from "react-icons/md";
import AOS from 'aos';

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";

// Create axios instance to avoid repeating config
const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true
});

const ManageClassUsers = () => {
  const [classId, setClassId] = useState("");
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]); // ideally from API users role=student
  const [enrollments, setEnrollments] = useState([]);
  const [allEnrollments, setAllEnrollments] = useState([]); // All enrollments across all classes
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  // Fine-grained action states
  const [enrollingId, setEnrollingId] = useState(null);
  const [removingId, setRemovingId] = useState(null);

  const fetchAllClasses = async () => {
    try {
      setLoading(true);
      console.log('Fetching all classes from all study programs...');
      
      // Use the new endpoint that gets all classes with stats directly - remove program_study filter
      const res = await api.get('/api/courses/classes/all-with-stats', { 
        params: { 
          limit: 500 // Increase limit to get more classes from all programs
        } 
      });
      
      console.log('Classes API response:', res.data);
      const classList = res.data?.data?.classes || [];
      console.log('Fetched classes:', classList);
      
      // Filter out null entries and ensure each item has required fields
      const validClasses = classList.filter(cls => cls && cls.id && cls.course);
      console.log('Valid classes after filtering:', validClasses);
      
      setClasses(validClasses);
      if (validClasses.length > 0 && validClasses[0]?.id) {
        console.log('Setting default class ID:', validClasses[0].id);
        setClassId(String(validClasses[0].id));
      }
      
      if (validClasses.length === 0) {
        console.log('No valid classes found');
        setMessage({ type: "info", text: "Tidak ada kelas yang tersedia di database." });
      }
    } catch (e) {
      console.error('Failed to fetch classes:', e);
      console.error('Error response:', e.response?.data);
      console.error('Error status:', e.response?.status);
      console.error('Error message:', e.message);
      console.error('Full error object:', e);
      if (e.response?.status === 401) {
        setMessage({ type: "error", text: "Sesi berakhir. Silakan login kembali." });
      } else if (e.response?.status === 403) {
        setMessage({ type: "error", text: "Akses ditolak. Pastikan Anda sudah login dengan benar." });
      } else {
        setMessage({ type: "error", text: "Gagal memuat daftar kelas. " + (e.response?.data?.message || e.message) });
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrollments = async (id) => {
    if (!id) return;
    try {
      setLoading(true);
      console.log('Fetching enrollments for class ID:', id);
      const res = await api.get(`/api/courses/classes/${id}/enrollments`, { params: { limit: 500 } });
      console.log('Enrollments API response:', res.data);
      setEnrollments(res.data?.data?.enrollments || []);
    } catch (e) {
      console.error('Failed to fetch enrollments:', e);
      console.error('Error response:', e.response?.data);
      console.error('Error status:', e.response?.status);
      console.error('Error message:', e.message);
      if (e.response?.status === 401) {
        setMessage({ type: "error", text: "Sesi berakhir. Silakan login kembali." });
      } else if (e.response?.status === 403) {
        setMessage({ type: "error", text: "Akses ditolak. Pastikan Anda sudah login dengan benar." });
      } else {
        setMessage({ type: "error", text: "Gagal memuat daftar anggota kelas. " + (e.response?.data?.message || e.message) });
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAllEnrollments = async () => {
    try {
      console.log('Fetching all enrollments across all classes...');
      
      // Get all enrollments across all classes to check for conflicts
      const enrollmentPromises = classes.map(async (cls) => {
        try {
          const res = await api.get(`/api/courses/classes/${cls.id}/enrollments`, { params: { limit: 500 } });
          return res.data?.data?.enrollments || [];
        } catch (e) {
          console.error(`Failed to fetch enrollments for class ${cls.id}:`, e);
          return [];
        }
      });
      
      const allClassEnrollments = await Promise.all(enrollmentPromises);
      const flatEnrollments = allClassEnrollments.flat();
      
      console.log('All enrollments loaded:', flatEnrollments.length);
      setAllEnrollments(flatEnrollments);
    } catch (e) {
      console.error('Failed to fetch all enrollments:', e);
      setAllEnrollments([]);
    }
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      console.log('Fetching all students from all study programs...');
      // Get all students regardless of program study
      const res = await api.get(`/api/admin/users`, {
        params: {
          role: 'student',
          limit: 1000, // Increase limit to get more students
          sortBy: 'full_name',
          sortOrder: 'ASC'
        }
      });
      console.log('Students API response:', res.data);
      const rawUsers = res.data?.data?.users || [];
      console.log('Raw users data:', rawUsers);
      // Normalize naming (backend returns full_name already, but ensure fallback)
      const normalized = rawUsers.map(u => ({
        ...u,
        full_name: u.full_name || u.fullname || u.fullName || ''
      }));
      console.log('Normalized students:', normalized);
      setStudents(normalized);
    } catch (e) {
      console.error('Failed to fetch students:', e);
      console.error('Error response:', e.response?.data);
      console.error('Error status:', e.response?.status);
      console.error('Error message:', e.message);
      if (e.response?.status === 401) {
        setMessage({ type: "error", text: "Sesi berakhir. Silakan login kembali sebagai super admin." });
      } else if (e.response?.status === 403) {
        setMessage({ type: "error", text: "Akses ditolak. Pastikan Anda login sebagai super admin." });
      } else {
        setMessage({ type: "error", text: "Gagal memuat daftar mahasiswa. " + (e.response?.data?.message || e.message) });
      }
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Component mounted, initializing...');
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-out-cubic'
    });
    console.log('Starting to fetch classes and students...');
    fetchAllClasses();
    fetchStudents();
  }, []);

  useEffect(() => {
    console.log('Class ID changed to:', classId);
    if (classId) {
      console.log('Fetching enrollments for new class ID:', classId);
      fetchEnrollments(classId);
    } else {
      console.log('No class ID selected, clearing enrollments');
      setEnrollments([]);
    }
  }, [classId]);

  // Fetch all enrollments when classes are loaded
  useEffect(() => {
    if (classes.length > 0) {
      console.log('Classes loaded, fetching all enrollments...');
      fetchAllEnrollments();
    }
  }, [classes]);

  // Clear message after 5 seconds
  useEffect(() => {
    if (message) {
      console.log('Message set:', message);
      const timer = setTimeout(() => {
        setMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Debug logging for current state
  useEffect(() => {
    console.log('=== CURRENT STATE ===');
    console.log('Classes:', classes.length, classes);
    console.log('Students:', students.length, students);
    console.log('Enrollments:', enrollments.length, enrollments);
    console.log('Selected Class ID:', classId);
    console.log('Loading:', loading);
    console.log('Message:', message);
    console.log('Visible Students:', visibleStudents.length);
    console.log('=====================');
  });

  const visibleStudents = useMemo(() => {
    console.log('Computing visible students...', {
      totalStudents: students.length,
      search,
      classId,
      enrollmentsCount: enrollments.length,
      allEnrollmentsCount: allEnrollments.length
    });
    
    if (!search && !classId) return students;
    
    let filtered = students;
    
    // Filter by search term
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter((u) => `${u.full_name} ${u.user_id}`.toLowerCase().includes(s));
      console.log('After search filter:', filtered.length);
    }
    
    // Filter out already enrolled students in current class
    if (classId && enrollments.length > 0) {
      const enrolledStudentIds = enrollments.map(e => e.student_id);
      console.log('Enrolled student IDs in current class:', enrolledStudentIds);
      filtered = filtered.filter(student => !enrolledStudentIds.includes(student.user_id));
      console.log('After current class enrollment filter:', filtered.length);
    }
    
    // Filter out students already enrolled in any other class (only show students not enrolled anywhere)
    if (allEnrollments.length > 0) {
      const allEnrolledStudentIds = allEnrollments
        .filter(e => e.status === 'enrolled' || e.status === 'active') // Only active enrollments
        .filter(e => e.class_id !== Number(classId)) // Exclude current class
        .map(e => e.student_id);
      
      console.log('Student IDs enrolled in other classes:', allEnrolledStudentIds);
      
      const beforeOtherClassFilter = filtered.length;
      filtered = filtered.filter(student => !allEnrolledStudentIds.includes(student.user_id));
      
      console.log(`After other class enrollment filter: ${beforeOtherClassFilter} -> ${filtered.length}`);
      
      // Log which students were filtered out for debugging
      const filteredOutStudents = students.filter(student => 
        allEnrolledStudentIds.includes(student.user_id)
      );
      if (filteredOutStudents.length > 0) {
        console.log('Students filtered out (already enrolled elsewhere):', 
          filteredOutStudents.map(s => `${s.full_name} (${s.user_id})`));
      }
    }
    
    console.log('Final visible students:', filtered.length);
    return filtered;
  }, [students, search, classId, enrollments, allEnrollments]);

  const enroll = async (student_user_id) => {
    console.log('=== ENROLL FUNCTION CALLED ===');
    console.log('student_user_id:', student_user_id);
    console.log('classId:', classId);
    console.log('enrollingId:', enrollingId);
    
    if (!classId || enrollingId) {
      console.log('Aborting: missing classId or already enrolling');
      return;
    }
    
    // Prevent duplicate enroll if already present locally
    if (enrollments.some(e => e.student_id === student_user_id)) {
      console.log('Aborting: student already enrolled locally');
      setMessage({ type: 'error', text: 'Mahasiswa sudah terdaftar (lokal).' });
      return;
    }
    
    setEnrollingId(student_user_id);
    try {
      const payload = { class_id: Number(classId), student_id: student_user_id };
      const studentRef = students.find(s => s.user_id === student_user_id);
      
      console.log('Enrolling student with payload:', payload);
      console.log('Student reference found:', studentRef);
      console.log('Sending request to:', `${API_BASE}/api/courses/enrollments`);
      
      // Validate payload before sending
      if (!payload.class_id || !payload.student_id) {
        throw new Error(`Payload validation failed: class_id=${payload.class_id}, student_id=${payload.student_id}`);
      }
      
      // Optimistic update
      setEnrollments(prev => ([
        ...prev,
        {
          id: `temp-${Date.now()}`,
          class_id: payload.class_id,
          student_id: student_user_id,
          enrollment_date: new Date().toISOString(),
          status: 'enrolled',
          student: studentRef ? {
            id: studentRef.id,
            user_id: studentRef.user_id,
            full_name: studentRef.full_name
          } : null,
          _optimistic: true
        }
      ]));
      
      const res = await api.post(`/api/courses/enrollments`, payload);
      console.log('Enrollment response:', res.data);
      
      setMessage({ type: 'success', text: res.data?.message || 'Mahasiswa berhasil ditambahkan' });
      
      // Refresh to replace optimistic temp item with real DB record
      await fetchEnrollments(classId);
      
      // Refresh all enrollments to update the global enrollment state
      await fetchAllEnrollments();
    } catch (e) {
      console.error('Enrollment error:', e);
      
      // Rollback optimistic item
      setEnrollments(prev => prev.filter(en => !String(en.id).startsWith('temp-')));
      
      const backendMsg = e?.response?.data?.message;
      let friendly = backendMsg || 'Gagal menambahkan mahasiswa';
      
      if (/sudah terdaftar/i.test(friendly)) friendly = 'Mahasiswa sudah terdaftar di kelas ini';
      if (/hanya dapat terdaftar di satu kelas aktif/i.test(friendly)) friendly = friendly; // Keep the detailed message from backend
      if (/penuh/i.test(friendly)) friendly = 'Kelas sudah penuh';
      if (e.response?.status === 401) friendly = 'Sesi berakhir. Silakan login kembali.';
      if (e.response?.status === 403) friendly = 'Tidak memiliki izin untuk menambah mahasiswa.';
      
      setMessage({ type: 'error', text: friendly });
    } finally {
      setEnrollingId(null);
    }
  };

  const removeEnrollment = async (enrollmentId, studentName) => {
    if (!enrollmentId || removingId) return;
    if (!window.confirm(`Apakah Anda yakin ingin menghapus ${studentName} dari kelas ini?`)) return;
    setRemovingId(enrollmentId);
    try {
      console.log('Removing enrollment ID:', enrollmentId);
      await api.delete(`/api/courses/enrollments/${enrollmentId}`);
      console.log('Enrollment removed successfully');
      setMessage({ type: 'success', text: 'Mahasiswa berhasil dihapus dari kelas' });
      // Optimistic removal (quick feedback) while refetching
      setEnrollments(prev => prev.filter(e => e.id !== enrollmentId));
      await fetchEnrollments(classId);
      
      // Refresh all enrollments to update the global enrollment state
      await fetchAllEnrollments();
    } catch (e) {
      console.error('Failed to remove enrollment:', e);
      console.error('Error response:', e.response?.data);
      console.error('Error status:', e.response?.status);
      console.error('Error message:', e.message);
      const backendMsg = e?.response?.data?.message;
      let friendly = backendMsg || 'Gagal menghapus mahasiswa';
      if (e.response?.status === 401) friendly = 'Sesi berakhir. Silakan login kembali.';
      if (e.response?.status === 403) friendly = 'Tidak memiliki izin untuk menghapus.';
      setMessage({ type: 'error', text: friendly });
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-600 rounded-lg">
                <MdGroup className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Manajemen Kelas</h1>
                <p className="text-sm text-gray-600">Kelola pendaftaran mahasiswa ke kelas</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  fetchAllClasses();
                  fetchStudents();
                  if (classId) fetchEnrollments(classId);
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <MdRefresh className="w-4 h-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Message Display */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg border ${
            message.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`} data-aos="fade-in">
            <div className="flex items-center">
              {message.type === 'success' ? (
                <MdCheckCircle className="w-5 h-5 mr-3" />
              ) : (
                <MdWarning className="w-5 h-5 mr-3" />
              )}
              {message.text}
            </div>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8" data-aos="fade-up">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MdClass className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Kelas</p>
                <p className="text-2xl font-bold text-gray-900">{classes.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <MdPeople className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Mahasiswa</p>
                <p className="text-2xl font-bold text-gray-900">{students.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MdAssignment className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Kelas Terpilih</p>
                <p className="text-2xl font-bold text-gray-900">{classId ? enrollments.length : '-'}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <MdTrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tersedia</p>
                <p className="text-2xl font-bold text-gray-900">{classId ? visibleStudents.length : '-'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Class Selection */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8" data-aos="fade-up" data-aos-delay="100">
          <div className="flex items-center mb-4">
            <MdFilterList className="w-5 h-5 text-gray-400 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Pilih Kelas</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kelas Tersedia
              </label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={classId} 
                onChange={(e) => setClassId(e.target.value)}
                disabled={classes.length === 0}
              >
                {classes.length === 0 ? (
                  <option value="">Tidak ada kelas tersedia</option>
                ) : (
                  <>
                    <option value="">Pilih kelas...</option>
                    {classes.map((k) => {
                      const optionKey = k.id ?? `${k.course_id || k.course?.id || 'c'}-${k.class_name}`;
                      return (
                        <option key={optionKey} value={k.id}>
                          [{k.course?.program_study || 'Program Studi'}] {k.course?.course_code || 'MK'} - {k.class_name} ({k.academic_year} {k.semester_period})
                        </option>
                      );
                    })}
                  </>
                )}
              </select>
            </div>
            {classId && (
              <div className="flex items-end">
                <div className="w-full p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-900">Kelas Terpilih</p>
                      <p className="text-xs text-blue-700">
                        {classes.find(c => c.id === Number(classId))?.course?.course_name || 'Mata Kuliah'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-900">{enrollments.length}</p>
                      <p className="text-xs text-blue-700">Mahasiswa terdaftar</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
              <div className="flex items-center gap-2 text-sm font-medium text-blue-700">
                <MdSchool className="w-4 h-4" />
                Semua Program Studi
              </div>
            </div>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Kelola pendaftaran mahasiswa ke dalam kelas dari seluruh Program Studi dengan mudah dan efisien.
          </p>
        </div>

        {/* Alert Messages */}
        {message && (
          <div 
            className={`p-4 rounded-2xl backdrop-blur-xl border shadow-lg ${
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
              <p className="font-medium">{message.text}</p>
            </div>
          </div>
        )}

        {/* Class Selection Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8" data-aos="fade-up" data-aos-delay="100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                <MdClass className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Pilih Kelas</h2>
            </div>
            <button 
              onClick={() => classId && fetchEnrollments(classId)} 
              className="px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-2xl flex items-center gap-2 font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              disabled={loading}
            >
              <MdRefresh className="w-5 h-5" /> 
              Refresh
            </button>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-600 uppercase tracking-wide">
              Kelas Tersedia (Semua Program Studi)
            </label>
            <select 
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm text-sm"
              value={classId} 
              onChange={(e) => setClassId(e.target.value)}
              disabled={classes.length === 0}
            >
              {classes.length === 0 ? (
                <option value="">Tidak ada kelas tersedia</option>
              ) : (
                <>
                  <option value="">Pilih kelas...</option>
                  {classes.map((k) => {
                    const optionKey = k.id ?? `${k.course_id || k.course?.id || 'c'}-${k.class_name}`;
                    return (
                      <option key={optionKey} value={k.id}>
                        [{k.course?.program_study || 'Program Studi'}] {k.course?.course_code || 'MK'} - {k.class_name} ({k.academic_year} {k.semester_period})
                      </option>
                    );
                  })}
                </>
              )}
            </select>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add Students Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8" data-aos="fade-up" data-aos-delay="200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                  <MdPersonAdd className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Tambah Mahasiswa</h2>
              </div>
              <div className="flex items-center gap-2 bg-gray-50/80 rounded-2xl px-4 py-2 border border-gray-200">
                <MdSearch className="w-4 h-4 text-gray-500" />
                <input 
                  value={search} 
                  onChange={(e) => setSearch(e.target.value)} 
                  className="bg-transparent border-none outline-none text-sm placeholder-gray-400 flex-1 min-w-0" 
                  placeholder="Cari nama/NIM" 
                />
              </div>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-auto">
              {!classId && (
                <div className="text-center py-8">
                  <MdClass className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Pilih kelas terlebih dahulu untuk menambahkan mahasiswa</p>
                </div>
              )}
              {classId && visibleStudents.map((u) => {
                const userKey = u.id ?? `student-${u.user_id}`;
                return (
                  <div key={userKey} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {u.full_name?.charAt(0)?.toUpperCase() || 'M'}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">{u.full_name}</div>
                      <div className="text-xs text-gray-500">
                        {u.user_id} • {u.program_study || 'Program Studi tidak diketahui'}
                      </div>
                    </div>
                  </div>
                  <button 
                    disabled={loading || enrollingId === u.user_id || !classId} 
                    onClick={() => enroll(u.user_id)} 
                    className={`px-4 py-2 ${enrollingId === u.user_id ? 'from-gray-400 to-gray-500 cursor-wait' : !classId ? 'from-gray-300 to-gray-400 cursor-not-allowed' : 'from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'} bg-gradient-to-r disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg transform ${enrollingId === u.user_id || !classId ? '' : 'hover:scale-105'} disabled:transform-none`}
                  >
                    {enrollingId === u.user_id ? 'Memproses...' : !classId ? 'Pilih Kelas' : 'Tambah'}
                  </button>
                </div>
                );
              })}
              {classId && visibleStudents.length === 0 && !loading && (
                <div className="text-center py-8">
                  <MdPeople className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  {students.length === 0 ? (
                    <p className="text-gray-500">Tidak ada mahasiswa tersedia</p>
                  ) : search ? (
                    <p className="text-gray-500">Tidak ada mahasiswa yang sesuai dengan pencarian</p>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-gray-500">Tidak ada mahasiswa tersedia untuk ditambahkan</p>
                      <p className="text-xs text-gray-400">
                        Mahasiswa sudah terdaftar di kelas ini atau di kelas lain
                      </p>
                      <p className="text-xs text-gray-400">
                        (Satu mahasiswa hanya dapat terdaftar di satu kelas aktif)
                      </p>
                    </div>
                  )}
                </div>
              )}
              {classId && loading && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
                  <p className="text-gray-500">Memuat data...</p>
                </div>
              )}
            </div>
          </div>

          {/* Enrolled Students Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8" data-aos="fade-up" data-aos-delay="300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                <MdGroup className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Mahasiswa Terdaftar</h2>
              <div className="ml-auto px-3 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full">
                <span className="text-sm font-medium text-indigo-700">
                  {enrollments.length} siswa
                </span>
              </div>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-auto">
              {enrollments.map((e) => {
                const enrollmentKey = e.id ?? `enroll-${e.class_id}-${e.student_id}`;
                return (
                  <div key={enrollmentKey} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {e.student?.full_name?.charAt(0)?.toUpperCase() || 'M'}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">{e.student?.full_name || '-'}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-2">
                        {e.student?.user_id || ''} 
                        {e.student?.program_study && (
                          <>
                            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                            <span>{e.student.program_study}</span>
                          </>
                        )}
                        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          e.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {e.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeEnrollment(e.id, e.student?.full_name || 'mahasiswa ini')}
                    disabled={loading || removingId === e.id}
                    className={`px-3 py-2 bg-gradient-to-r ${removingId === e.id ? 'from-gray-400 to-gray-500 cursor-wait' : 'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'} disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg transform ${removingId === e.id ? '' : 'hover:scale-105'} disabled:transform-none flex items-center gap-2`}
                  >
                    <MdDelete className="w-4 h-4" /> 
                    {removingId === e.id ? 'Menghapus...' : 'Hapus'}
                  </button>
                </div>
                );
              })}
              {enrollments.length === 0 && !loading && (
                <div className="text-center py-8">
                  <MdGroup className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Belum ada mahasiswa terdaftar</p>
                  <p className="text-xs text-gray-400 mt-1">Mulai tambahkan mahasiswa dari panel sebelah kiri</p>
                </div>
              )}
              {loading && enrollments.length === 0 && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-3"></div>
                  <p className="text-gray-500">Memuat data pendaftaran...</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8" data-aos="fade-up" data-aos-delay="400">
          <div className="flex items-start gap-3">
            <MdAutoAwesome className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-gray-800 mb-2">Tips Pengelolaan Kelas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="space-y-2">
                  <p>• <strong>Pilih Kelas:</strong> Gunakan dropdown untuk memilih kelas yang akan dikelola</p>
                  <p>• <strong>Cari Mahasiswa:</strong> Gunakan fitur pencarian untuk menemukan mahasiswa dengan cepat</p>
                  <p>• <strong>Aturan Pendaftaran:</strong> Satu mahasiswa hanya dapat terdaftar di satu kelas aktif</p>
                </div>
                <div className="space-y-2">
                  <p>• <strong>Tambah Mahasiswa:</strong> Klik tombol "Tambah" untuk mendaftarkan mahasiswa ke kelas</p>
                  <p>• <strong>Hapus Mahasiswa:</strong> Hapus mahasiswa dari kelas untuk memindahkan ke kelas lain</p>
                  <p>• <strong>Refresh Data:</strong> Gunakan tombol refresh untuk memperbarui data terbaru</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageClassUsers;
