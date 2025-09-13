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
  MdAutoAwesome
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
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const fetchAllClasses = async () => {
    try {
      setLoading(true);
      // Fetch Teknik Informatika courses then load their classes (concurrently)
      const coursesRes = await api.get(`/api/courses`, { params: { limit: 200, program_study: "Teknik Informatika" } });
      const courseList = coursesRes.data?.data?.courses || [];
      if (courseList.length === 0) {
        setClasses([]);
        return;
      }
      const classPromises = courseList.map(c =>
        api.get(`/api/courses/${c.id}/classes`, { params: { limit: 200 } })
          .then(r => (r.data?.data?.classes || []).map(k => ({ ...k, course: c })))
          .catch(() => [])
      );
      const results = await Promise.all(classPromises);
      const all = results.flat();
      // Deduplicate & ensure each item has a stable key
      const unique = [];
      const seen = new Set();
      let duplicateCount = 0;
      for (const item of all) {
        if (!item) continue;
        const key = item.id ?? `${item.course_id || item.course?.id || 'x'}-${item.class_name}`;
        if (seen.has(key)) {
          duplicateCount++;
          continue;
        }
        seen.add(key);
        unique.push(item);
      }
      if (duplicateCount > 0) {
        console.warn(`Filtered out ${duplicateCount} duplicate class entries (same id/key)`);
      }
      setClasses(unique);
      if (unique[0]?.id) setClassId(String(unique[0].id));
    } catch (e) {
      console.error('Failed to fetch classes:', e);
      if (e.response?.status === 401) {
        setMessage({ type: "error", text: "Sesi berakhir. Silakan login kembali." });
      } else if (e.response?.status === 403) {
        setMessage({ type: "error", text: "Akses ditolak. Pastikan Anda sudah login dengan benar." });
      } else {
        setMessage({ type: "error", text: "Gagal memuat daftar kelas" });
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrollments = async (id) => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await api.get(`/api/courses/classes/${id}/enrollments`, { params: { limit: 500 } });
      setEnrollments(res.data?.data?.enrollments || []);
    } catch (e) {
      console.error('Failed to fetch enrollments:', e);
      if (e.response?.status === 401) {
        setMessage({ type: "error", text: "Sesi berakhir. Silakan login kembali." });
      } else if (e.response?.status === 403) {
        setMessage({ type: "error", text: "Akses ditolak. Pastikan Anda sudah login dengan benar." });
      } else {
        setMessage({ type: "error", text: "Gagal memuat daftar anggota kelas" });
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      // Backend expects 'role=student' and supports 'full_name' mapped to fullname; we request with sortBy full_name for clarity
      const res = await api.get(`/api/admin/users`, {
        params: {
          role: 'student',
          limit: 500,
            // use full_name to map to backend sort mapping; search left empty
          sortBy: 'full_name',
          sortOrder: 'ASC'
        }
      });
      const rawUsers = res.data?.data?.users || [];
      // Normalize naming (backend returns full_name already, but ensure fallback)
      const normalized = rawUsers.map(u => ({
        ...u,
        full_name: u.full_name || u.fullname || u.fullName || ''
      }));
      setStudents(normalized);
    } catch (e) {
      console.error('Failed to fetch students:', e);
      if (e.response?.status === 401) {
        setMessage({ type: "error", text: "Sesi berakhir. Silakan login kembali sebagai super admin." });
      } else if (e.response?.status === 403) {
        setMessage({ type: "error", text: "Akses ditolak. Pastikan Anda login sebagai super admin." });
      } else {
        setMessage({ type: "error", text: "Gagal memuat daftar mahasiswa" });
      }
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-out-cubic'
    });
    fetchAllClasses();
    fetchStudents();
  }, []);

  useEffect(() => {
    if (classId) {
      fetchEnrollments(classId);
    } else {
      setEnrollments([]);
    }
  }, [classId]);

  // Clear message after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const visibleStudents = useMemo(() => {
    if (!search && !classId) return students;
    
    let filtered = students;
    
    // Filter by search term
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter((u) => `${u.full_name} ${u.user_id}`.toLowerCase().includes(s));
    }
    
    // Filter out already enrolled students
    if (classId && enrollments.length > 0) {
      const enrolledStudentIds = enrollments.map(e => e.student_id);
      filtered = filtered.filter(student => !enrolledStudentIds.includes(student.id));
    }
    
    return filtered;
  }, [students, search, classId, enrollments]);

  const enroll = async (student_id) => {
    if (!classId) return;
    try {
      setLoading(true);
      await api.post(`/api/courses/enrollments`, { class_id: Number(classId), student_id });
      setMessage({ type: "success", text: "Mahasiswa berhasil ditambahkan" });
      fetchEnrollments(classId);
    } catch (e) {
      const text = e?.response?.data?.message || "Gagal menambahkan mahasiswa";
      setMessage({ type: "error", text });
    } finally {
      setLoading(false);
    }
  };

  const removeEnrollment = async (enrollmentId, studentName) => {
    if (!enrollmentId) return;
    // Show confirmation dialog
    if (!window.confirm(`Apakah Anda yakin ingin menghapus ${studentName} dari kelas ini?`)) {
      return;
    }
    
    try {
      setLoading(true);
      await api.delete(`/api/courses/enrollments/${enrollmentId}`);
      setMessage({ type: "success", text: "Mahasiswa berhasil dihapus dari kelas" });
      fetchEnrollments(classId);
    } catch (e) {
      const text = e?.response?.data?.message || "Gagal menghapus mahasiswa";
      setMessage({ type: "error", text });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center" data-aos="fade-up">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
              <MdGroup className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Kelola Pengguna Kelas
            </h1>
          </div>
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full border border-blue-200">
              <div className="flex items-center gap-2 text-sm font-medium text-blue-700">
                <MdSchool className="w-4 h-4" />
                Teknik Informatika
              </div>
            </div>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Kelola pendaftaran mahasiswa ke dalam kelas Program Studi Teknik Informatika dengan mudah dan efisien.
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
              Kelas Tersedia (Teknik Informatika)
            </label>
            <select 
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm text-sm"
              value={classId} 
              onChange={(e) => setClassId(e.target.value)}
            >
              {classes.map((k) => {
                const optionKey = k.id ?? `${k.course_id || k.course?.id || 'c'}-${k.class_name}`;
                return (
                  <option key={optionKey} value={k.id}>
                    {k.course?.course_code || 'MK'} - {k.class_name} ({k.academic_year} {k.semester_period})
                  </option>
                );
              })}
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
              {visibleStudents.map((u) => {
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
                      <div className="text-xs text-gray-500">{u.user_id}</div>
                    </div>
                  </div>
                  <button 
                    disabled={loading} 
                    onClick={() => enroll(u.id)} 
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 disabled:transform-none"
                  >
                    Tambah
                  </button>
                </div>
                );
              })}
              {visibleStudents.length === 0 && !loading && (
                <div className="text-center py-8">
                  <MdPeople className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  {students.length === 0 ? (
                    <p className="text-gray-500">Tidak ada mahasiswa tersedia</p>
                  ) : search ? (
                    <p className="text-gray-500">Tidak ada mahasiswa yang sesuai dengan pencarian</p>
                  ) : (
                    <p className="text-gray-500">Semua mahasiswa sudah terdaftar di kelas ini</p>
                  )}
                </div>
              )}
              {loading && (
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
                    disabled={loading}
                    className="px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 disabled:transform-none flex items-center gap-2"
                  >
                    <MdDelete className="w-4 h-4" /> 
                    Hapus
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
                </div>
                <div className="space-y-2">
                  <p>• <strong>Tambah Mahasiswa:</strong> Klik tombol "Tambah" untuk mendaftarkan mahasiswa ke kelas</p>
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
