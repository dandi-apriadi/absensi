import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  MdAdd, 
  MdClass, 
  MdSchedule, 
  MdSave, 
  MdWarning, 
  MdRefresh,
  MdAutoAwesome,
  MdCalendarToday,
  MdPeople,
  MdSchool,
  MdDeleteOutline,
  MdAccessTime
} from "react-icons/md";
import AOS from "aos";
import "aos/dist/aos.css";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";

const weekdays = [
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
  "Minggu",
];

const AddClass = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    course_id: "",
    class_name: "A",
    lecturer_id: "",
    academic_year: "2024/2025",
    semester_period: "ganjil",
    max_students: 40,
  });
  const [schedule, setSchedule] = useState([
    { day: "Senin", start_time: "08:00", end_time: "09:40" },
  ]);
  const [message, setMessage] = useState(null);

  // Initialize AOS for animations
  useEffect(() => {
    AOS.init({
      duration: 600,
      once: true,
      easing: 'ease-out-cubic'
    });
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/api/courses`, {
        withCredentials: true,
        params: { limit: 1000, status: "active", program_study: "Teknik Informatika" },
      });
      setCourses(res.data?.data?.courses || []);
    } catch (e) {
      setMessage({ type: "error", text: "Gagal memuat daftar mata kuliah" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const addScheduleRow = () => {
    setSchedule((s) => [...s, { day: "Senin", start_time: "07:00", end_time: "08:40" }]);
  };
  const removeScheduleRow = (idx) => {
    setSchedule((s) => s.filter((_, i) => i !== idx));
  };

  const updateSchedule = (idx, key, value) => {
    setSchedule((s) => s.map((row, i) => (i === idx ? { ...row, [key]: value } : row)));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      setLoading(true);
      const payload = {
        ...form,
        course_id: Number(form.course_id),
        lecturer_id: form.lecturer_id ? Number(form.lecturer_id) : undefined,
        max_students: Number(form.max_students) || 40,
        schedule,
      };
      const res = await axios.post(`${API_BASE}/api/courses/classes`, payload, {
        withCredentials: true,
      });
      setMessage({ type: "success", text: "Kelas berhasil dibuat" });
      // Reset minimal
      setForm((f) => ({ ...f, class_name: "A" }));
    } catch (err) {
      const text = err?.response?.data?.message || "Gagal membuat kelas";
      setMessage({ type: "error", text });
    } finally {
      setLoading(false);
    }
  };

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
                  Tambah Kelas
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-medium rounded-full">
                    Teknik Informatika
                  </span>
                  <MdAutoAwesome className="w-4 h-4 text-blue-500 animate-pulse" />
                </div>
              </div>
            </div>
            <p className="text-gray-600 text-lg max-w-2xl">
              Buat kelas baru untuk mata kuliah Program Studi Teknik Informatika dengan mudah dan cepat.
            </p>
          </div>
          
          <button
            onClick={fetchCourses}
            disabled={loading}
            className="self-start lg:self-center px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-2 font-medium"
            data-aos="fade-left"
          >
            <MdRefresh className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            Perbarui Data
          </button>
        </div>
      </div>

      {/* Alert Message */}
      {message && (
        <div
          className={`mb-6 p-4 rounded-2xl border backdrop-blur-sm ${
            message.type === "success" 
              ? "bg-emerald-50/80 border-emerald-200 text-emerald-800" 
              : "bg-red-50/80 border-red-200 text-red-800"
          }`}
          data-aos="fade-up"
        >
          <div className="flex items-center gap-3">
            {message.type === "success" ? (
              <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                <MdAutoAwesome className="w-4 h-4 text-white" />
              </div>
            ) : (
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <MdWarning className="w-4 h-4 text-white" />
              </div>
            )}
            <span className="font-medium">{message.text}</span>
          </div>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={onSubmit} className="space-y-8" data-aos="fade-up">
        {/* Course Selection Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
              <MdSchool className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Pilih Mata Kuliah</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Mata Kuliah (Teknik Informatika)
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white shadow-sm"
                value={form.course_id}
                onChange={(e) => setForm({ ...form, course_id: e.target.value })}
                required
              >
                <option value="">-- Pilih Mata Kuliah --</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.course_code} - {c.course_name} ({c.credits} SKS)
                  </option>
                ))}
              </select>
              {courses.length === 0 && !loading && (
                <p className="text-sm text-gray-500 mt-2">
                  Tidak ada mata kuliah tersedia. Klik "Perbarui Data" untuk memuat ulang.
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Nama Kelas
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white shadow-sm"
                value={form.class_name}
                onChange={(e) => setForm({ ...form, class_name: e.target.value })}
                placeholder="A, B, C, etc."
                required
              />
            </div>
          </div>
        </div>

        {/* Class Details Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl">
              <MdCalendarToday className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Detail Kelas</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Tahun Akademik
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white shadow-sm"
                value={form.academic_year}
                onChange={(e) => setForm({ ...form, academic_year: e.target.value })}
                placeholder="2024/2025"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Periode Semester
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white shadow-sm"
                value={form.semester_period}
                onChange={(e) => setForm({ ...form, semester_period: e.target.value })}
                required
              >
                <option value="ganjil">Semester Ganjil</option>
                <option value="genap">Semester Genap</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <MdPeople className="w-4 h-4" />
                Maksimal Mahasiswa
              </label>
              <input
                type="number"
                min={1}
                max={100}
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white shadow-sm"
                value={form.max_students}
                onChange={(e) => setForm({ ...form, max_students: e.target.value })}
              />
            </div>
            
            <div className="space-y-2 md:col-span-2 lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700">
                ID Dosen (Opsional)
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white shadow-sm"
                value={form.lecturer_id}
                onChange={(e) => setForm({ ...form, lecturer_id: e.target.value })}
                placeholder="Masukkan ID user dosen (kosongkan jika belum ada)"
              />
            </div>
          </div>
        </div>        {/* Schedule Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl">
                <MdSchedule className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Jadwal Kelas</h2>
            </div>
            <button 
              type="button" 
              onClick={addScheduleRow} 
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-2xl flex items-center gap-2 font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <MdAdd className="w-5 h-5" /> 
              Tambah Jadwal
            </button>
          </div>
          
          <div className="space-y-4">
            {schedule.map((row, idx) => (
              <div key={idx} className="flex flex-col lg:flex-row gap-4 p-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
                      Hari
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-sm bg-white"
                      value={row.day}
                      onChange={(e) => updateSchedule(idx, "day", e.target.value)}
                    >
                      {weekdays.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="flex items-center gap-1 text-xs font-medium text-gray-600 uppercase tracking-wide">
                      <MdAccessTime className="w-3 h-3" />
                      Waktu Mulai
                    </label>
                    <input
                      type="time"
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-sm bg-white"
                      value={row.start_time}
                      onChange={(e) => updateSchedule(idx, "start_time", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="flex items-center gap-1 text-xs font-medium text-gray-600 uppercase tracking-wide">
                      <MdAccessTime className="w-3 h-3" />
                      Waktu Selesai
                    </label>
                    <input
                      type="time"
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-sm bg-white"
                      value={row.end_time}
                      onChange={(e) => updateSchedule(idx, "end_time", e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => removeScheduleRow(idx)}
                    className="px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-300 flex items-center gap-2 text-sm font-medium"
                    disabled={schedule.length === 1}
                  >
                    <MdDeleteOutline className="w-4 h-4" />
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl">
            <div className="flex items-start gap-3">
              <MdWarning className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-medium mb-1">Sistem Satu Pintu</p>
                <p>Semua kelas menggunakan ruangan fisik yang sama. Pastikan tidak ada konflik jadwal dengan kelas lain.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Section */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <button
              type="button"
              onClick={() => navigate('/super-admin/courses')}
              className="px-8 py-3 border-2 border-gray-300 text-gray-600 rounded-2xl font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 transform hover:scale-105"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-2xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[140px]"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Menyimpan...
                </>
              ) : (
                <>
                  <MdSave className="w-5 h-5" />
                  Simpan Kelas
                </>
              )}
            </button>
          </div>
          
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl">
            <div className="flex items-start gap-3">
              <MdAutoAwesome className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Tips Sukses</p>
                <p>Pastikan semua data sudah benar sebelum menyimpan. Setelah kelas dibuat, Anda dapat mengelola pendaftaran mahasiswa pada menu "Kelola Pengguna Kelas".</p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddClass;
