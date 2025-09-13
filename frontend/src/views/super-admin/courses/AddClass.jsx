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

// Program Studi yang tersedia di Politeknik Negeri Manado
const POLIMDO_PROGRAMS = [
  "Teknik Informatika",
  "Teknik Elektro", 
  "Teknik Mesin",
  "Teknik Sipil",
  "Akuntansi",
  "Administrasi Bisnis"
];

// Static data mata kuliah untuk setiap program studi
const STATIC_COURSES = {
  "Teknik Informatika": [
    // Semester 1
    { id: 101, course_code: "TI101", course_name: "Algoritma dan Pemrograman I", credits: 3, semester: 1 },
    { id: 102, course_code: "TI102", course_name: "Matematika Diskrit", credits: 3, semester: 1 },
    { id: 103, course_code: "TI103", course_name: "Pengantar Teknologi Informasi", credits: 2, semester: 1 },
    { id: 104, course_code: "TI104", course_name: "Bahasa Inggris I", credits: 2, semester: 1 },
    { id: 105, course_code: "TI105", course_name: "Pancasila", credits: 2, semester: 1 },
    { id: 106, course_code: "TI106", course_name: "Sistem Digital", credits: 3, semester: 1 },
    { id: 107, course_code: "TI107", course_name: "Fisika Dasar", credits: 3, semester: 1 },

    // Semester 2
    { id: 201, course_code: "TI201", course_name: "Algoritma dan Pemrograman II", credits: 3, semester: 2 },
    { id: 202, course_code: "TI202", course_name: "Struktur Data", credits: 3, semester: 2 },
    { id: 203, course_code: "TI203", course_name: "Matematika Terapan", credits: 3, semester: 2 },
    { id: 204, course_code: "TI204", course_name: "Bahasa Inggris II", credits: 2, semester: 2 },
    { id: 205, course_code: "TI205", course_name: "Kewarganegaraan", credits: 2, semester: 2 },
    { id: 206, course_code: "TI206", course_name: "Organisasi dan Arsitektur Komputer", credits: 3, semester: 2 },
    { id: 207, course_code: "TI207", course_name: "Elektronika Dasar", credits: 3, semester: 2 },

    // Semester 3
    { id: 301, course_code: "TI301", course_name: "Pemrograman Berorientasi Objek", credits: 3, semester: 3 },
    { id: 302, course_code: "TI302", course_name: "Basis Data I", credits: 3, semester: 3 },
    { id: 303, course_code: "TI303", course_name: "Sistem Operasi", credits: 3, semester: 3 },
    { id: 304, course_code: "TI304", course_name: "Jaringan Komputer I", credits: 3, semester: 3 },
    { id: 305, course_code: "TI305", course_name: "Statistika dan Probabilitas", credits: 3, semester: 3 },
    { id: 306, course_code: "TI306", course_name: "Interaksi Manusia dan Komputer", credits: 2, semester: 3 },
    { id: 307, course_code: "TI307", course_name: "Bahasa Indonesia", credits: 2, semester: 3 },

    // Semester 4
    { id: 401, course_code: "TI401", course_name: "Rekayasa Perangkat Lunak", credits: 3, semester: 4 },
    { id: 402, course_code: "TI402", course_name: "Basis Data II", credits: 3, semester: 4 },
    { id: 403, course_code: "TI403", course_name: "Pemrograman Web I", credits: 3, semester: 4 },
    { id: 404, course_code: "TI404", course_name: "Jaringan Komputer II", credits: 3, semester: 4 },
    { id: 405, course_code: "TI405", course_name: "Analisis dan Perancangan Sistem", credits: 3, semester: 4 },
    { id: 406, course_code: "TI406", course_name: "Metodologi Penelitian", credits: 2, semester: 4 },
    { id: 407, course_code: "TI407", course_name: "Grafika Komputer", credits: 3, semester: 4 },

    // Semester 5
    { id: 501, course_code: "TI501", course_name: "Pemrograman Web II", credits: 3, semester: 5 },
    { id: 502, course_code: "TI502", course_name: "Keamanan Jaringan", credits: 3, semester: 5 },
    { id: 503, course_code: "TI503", course_name: "Kecerdasan Buatan", credits: 3, semester: 5 },
    { id: 504, course_code: "TI504", course_name: "Data Mining", credits: 3, semester: 5 },
    { id: 505, course_code: "TI505", course_name: "Mobile Programming", credits: 3, semester: 5 },
    { id: 506, course_code: "TI506", course_name: "E-Commerce", credits: 2, semester: 5 },
    { id: 507, course_code: "TI507", course_name: "Sistem Informasi Manajemen", credits: 3, semester: 5 },

    // Semester 6
    { id: 601, course_code: "TI601", course_name: "Kerja Praktik", credits: 2, semester: 6 },
    { id: 602, course_code: "TI602", course_name: "Proyek Akhir", credits: 4, semester: 6 },
    { id: 603, course_code: "TI603", course_name: "Sistem Terdistribusi", credits: 3, semester: 6 },
    { id: 604, course_code: "TI604", course_name: "Cloud Computing", credits: 3, semester: 6 },
    { id: 605, course_code: "TI605", course_name: "Internet of Things (IoT)", credits: 3, semester: 6 },
    { id: 606, course_code: "TI606", course_name: "Teknologi Multimedia", credits: 3, semester: 6 },
    { id: 607, course_code: "TI607", course_name: "Kewirausahaan", credits: 2, semester: 6 }
  ],
  "Teknik Elektro": [
    { id: 1001, course_code: "TE101", course_name: "Dasar Teknik Elektro", credits: 3, semester: 1 },
    { id: 1002, course_code: "TE102", course_name: "Matematika Teknik I", credits: 3, semester: 1 },
    { id: 1003, course_code: "TE103", course_name: "Fisika Listrik", credits: 3, semester: 1 },
    { id: 1004, course_code: "TE104", course_name: "Rangkaian Listrik I", credits: 3, semester: 1 },
    { id: 1005, course_code: "TE105", course_name: "Bahasa Inggris Teknik", credits: 2, semester: 1 }
  ],
  "Teknik Mesin": [
    { id: 2001, course_code: "TM101", course_name: "Gambar Teknik", credits: 3, semester: 1 },
    { id: 2002, course_code: "TM102", course_name: "Matematika Teknik", credits: 3, semester: 1 },
    { id: 2003, course_code: "TM103", course_name: "Fisika Mekanika", credits: 3, semester: 1 },
    { id: 2004, course_code: "TM104", course_name: "Material Teknik", credits: 3, semester: 1 },
    { id: 2005, course_code: "TM105", course_name: "Mekanika Teknik", credits: 3, semester: 1 }
  ],
  "Teknik Sipil": [
    { id: 3001, course_code: "TS101", course_name: "Gambar Teknik Sipil", credits: 3, semester: 1 },
    { id: 3002, course_code: "TS102", course_name: "Matematika Teknik Sipil", credits: 3, semester: 1 },
    { id: 3003, course_code: "TS103", course_name: "Fisika Bangunan", credits: 3, semester: 1 },
    { id: 3004, course_code: "TS104", course_name: "Material Konstruksi", credits: 3, semester: 1 },
    { id: 3005, course_code: "TS105", course_name: "Survei dan Pemetaan", credits: 3, semester: 1 }
  ],
  "Akuntansi": [
    { id: 4001, course_code: "AK101", course_name: "Pengantar Akuntansi I", credits: 3, semester: 1 },
    { id: 4002, course_code: "AK102", course_name: "Matematika Bisnis", credits: 3, semester: 1 },
    { id: 4003, course_code: "AK103", course_name: "Pengantar Ekonomi", credits: 3, semester: 1 },
    { id: 4004, course_code: "AK104", course_name: "Pengantar Manajemen", credits: 3, semester: 1 },
    { id: 4005, course_code: "AK105", course_name: "Aplikasi Komputer Akuntansi", credits: 2, semester: 1 }
  ],
  "Administrasi Bisnis": [
    { id: 5001, course_code: "AB101", course_name: "Pengantar Administrasi Bisnis", credits: 3, semester: 1 },
    { id: 5002, course_code: "AB102", course_name: "Matematika Bisnis", credits: 3, semester: 1 },
    { id: 5003, course_code: "AB103", course_name: "Pengantar Ekonomi Bisnis", credits: 3, semester: 1 },
    { id: 5004, course_code: "AB104", course_name: "Komunikasi Bisnis", credits: 2, semester: 1 },
    { id: 5005, course_code: "AB105", course_name: "Aplikasi Perkantoran", credits: 2, semester: 1 }
  ]
};

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
    lecturer_name: "", // Changed from lecturer_id to lecturer_name
    academic_year: "2024/2025",
    semester_period: "ganjil",
    max_students: 40,
    program_study: "Teknik Informatika", // Default to Teknik Informatika
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
      
      // Use static data based on selected program study
      const staticCourses = STATIC_COURSES[form.program_study] || [];
      setCourses(staticCourses);
      
      // Optional: Also try to fetch from API and merge with static data
      // Uncomment below if you want to combine static + dynamic data
      /*
      try {
        const res = await axios.get(`${API_BASE}/api/courses`, {
          withCredentials: true,
          params: { 
            limit: 1000, 
            status: "active", 
            program_study: form.program_study 
          },
        });
        const apiCourses = res.data?.data?.courses || [];
        
        // Merge static and API courses (avoid duplicates by course_code)
        const allCourses = [...staticCourses];
        apiCourses.forEach(apiCourse => {
          if (!allCourses.find(sc => sc.course_code === apiCourse.course_code)) {
            allCourses.push(apiCourse);
          }
        });
        setCourses(allCourses);
      } catch (apiError) {
        // If API fails, just use static data
        console.log('API not available, using static data only');
        setCourses(staticCourses);
      }
      */
      
    } catch (e) {
      setMessage({ type: "error", text: "Gagal memuat daftar mata kuliah" });
      // Fallback to static data
      setCourses(STATIC_COURSES[form.program_study] || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [form.program_study]); // Re-fetch when program study changes

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
        lecturer_name: form.lecturer_name || undefined, // Changed from lecturer_id
        max_students: Number(form.max_students) || 40,
        schedule,
      };
      const res = await axios.post(`${API_BASE}/api/courses/classes/demo`, payload, {
        headers: {
          'Content-Type': 'application/json'
        }
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
                    Politeknik Negeri Manado
                  </span>
                  <MdAutoAwesome className="w-4 h-4 text-blue-500 animate-pulse" />
                </div>
              </div>
            </div>
            <p className="text-gray-600 text-lg max-w-2xl">
              Buat kelas baru untuk mata kuliah di Politeknik Negeri Manado dengan mudah dan cepat.
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
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Program Studi
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white shadow-sm"
                value={form.program_study}
                onChange={(e) => setForm({ ...form, program_study: e.target.value, course_id: "" })}
                required
              >
                {POLIMDO_PROGRAMS.map((program) => (
                  <option key={program} value={program}>
                    {program}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Mata Kuliah ({form.program_study})
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
                  {STATIC_COURSES[form.program_study] ? 
                    `Mata kuliah ${form.program_study} sedang dimuat...` : 
                    `Mata kuliah untuk ${form.program_study} belum tersedia.`
                  }
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
                Nama Dosen (Opsional)
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white shadow-sm"
                value={form.lecturer_name}
                onChange={(e) => setForm({ ...form, lecturer_name: e.target.value })}
                placeholder="Masukkan nama dosen pengampu (kosongkan jika belum ada)"
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
