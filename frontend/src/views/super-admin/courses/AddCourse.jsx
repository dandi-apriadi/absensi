import React, { useState } from "react";
import axios from "axios";
import { 
  MdAdd, 
  MdSave, 
  MdWarning, 
  MdAutoAwesome,
  MdSchool,
  MdBook,
  MdNumbers,
  MdDescription
} from "react-icons/md";
import AOS from "aos";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";

// Data mata kuliah Teknik Informatika Politeknik Negeri Manado
const TI_COURSES = [
  // Semester 1
  { code: "TI101", name: "Algoritma dan Pemrograman I", credits: 3, semester: 1 },
  { code: "TI102", name: "Matematika Diskrit", credits: 3, semester: 1 },
  { code: "TI103", name: "Pengantar Teknologi Informasi", credits: 2, semester: 1 },
  { code: "TI104", name: "Bahasa Inggris I", credits: 2, semester: 1 },
  { code: "TI105", name: "Pancasila", credits: 2, semester: 1 },
  { code: "TI106", name: "Sistem Digital", credits: 3, semester: 1 },
  { code: "TI107", name: "Fisika Dasar", credits: 3, semester: 1 },

  // Semester 2
  { code: "TI201", name: "Algoritma dan Pemrograman II", credits: 3, semester: 2 },
  { code: "TI202", name: "Struktur Data", credits: 3, semester: 2 },
  { code: "TI203", name: "Matematika Terapan", credits: 3, semester: 2 },
  { code: "TI204", name: "Bahasa Inggris II", credits: 2, semester: 2 },
  { code: "TI205", name: "Kewarganegaraan", credits: 2, semester: 2 },
  { code: "TI206", name: "Organisasi dan Arsitektur Komputer", credits: 3, semester: 2 },
  { code: "TI207", name: "Elektronika Dasar", credits: 3, semester: 2 },

  // Semester 3
  { code: "TI301", name: "Pemrograman Berorientasi Objek", credits: 3, semester: 3 },
  { code: "TI302", name: "Basis Data I", credits: 3, semester: 3 },
  { code: "TI303", name: "Sistem Operasi", credits: 3, semester: 3 },
  { code: "TI304", name: "Jaringan Komputer I", credits: 3, semester: 3 },
  { code: "TI305", name: "Statistika dan Probabilitas", credits: 3, semester: 3 },
  { code: "TI306", name: "Interaksi Manusia dan Komputer", credits: 2, semester: 3 },
  { code: "TI307", name: "Bahasa Indonesia", credits: 2, semester: 3 },

  // Semester 4
  { code: "TI401", name: "Rekayasa Perangkat Lunak", credits: 3, semester: 4 },
  { code: "TI402", name: "Basis Data II", credits: 3, semester: 4 },
  { code: "TI403", name: "Pemrograman Web I", credits: 3, semester: 4 },
  { code: "TI404", name: "Jaringan Komputer II", credits: 3, semester: 4 },
  { code: "TI405", name: "Analisis dan Perancangan Sistem", credits: 3, semester: 4 },
  { code: "TI406", name: "Metodologi Penelitian", credits: 2, semester: 4 },
  { code: "TI407", name: "Grafika Komputer", credits: 3, semester: 4 },

  // Semester 5
  { code: "TI501", name: "Pemrograman Web II", credits: 3, semester: 5 },
  { code: "TI502", name: "Keamanan Jaringan", credits: 3, semester: 5 },
  { code: "TI503", name: "Kecerdasan Buatan", credits: 3, semester: 5 },
  { code: "TI504", name: "Data Mining", credits: 3, semester: 5 },
  { code: "TI505", name: "Mobile Programming", credits: 3, semester: 5 },
  { code: "TI506", name: "E-Commerce", credits: 2, semester: 5 },
  { code: "TI507", name: "Sistem Informasi Manajemen", credits: 3, semester: 5 },

  // Semester 6
  { code: "TI601", name: "Kerja Praktik", credits: 2, semester: 6 },
  { code: "TI602", name: "Proyek Akhir", credits: 4, semester: 6 },
  { code: "TI603", name: "Sistem Terdistribusi", credits: 3, semester: 6 },
  { code: "TI604", name: "Cloud Computing", credits: 3, semester: 6 },
  { code: "TI605", name: "Internet of Things (IoT)", credits: 3, semester: 6 },
  { code: "TI606", name: "Teknologi Multimedia", credits: 3, semester: 6 },
  { code: "TI607", name: "Kewirausahaan", credits: 2, semester: 6 }
];

const AddCourse = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [progress, setProgress] = useState({ completed: 0, total: TI_COURSES.length });
  const [completedCourses, setCompletedCourses] = useState([]);

  React.useEffect(() => {
    AOS.init({
      duration: 600,
      once: true,
      easing: 'ease-out-cubic'
    });
  }, []);

  const createCourse = async (courseData) => {
    try {
      const payload = {
        course_code: courseData.code,
        course_name: courseData.name,
        description: `Mata kuliah ${courseData.name} untuk Program Studi Teknik Informatika semester ${courseData.semester}`,
        credits: courseData.credits,
        semester: courseData.semester,
        program_study: "Teknik Informatika",
        status: "active"
      };

      const response = await axios.post(`${API_BASE}/api/courses`, payload, {
        withCredentials: true
      });

      return { success: true, data: response.data };
    } catch (error) {
      console.error(`Failed to create ${courseData.code}:`, error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message 
      };
    }
  };

  const seedAllCourses = async () => {
    if (!window.confirm('Apakah Anda yakin ingin menambahkan semua 35 mata kuliah Teknik Informatika?')) {
      return;
    }

    setLoading(true);
    setMessage(null);
    setProgress({ completed: 0, total: TI_COURSES.length });
    setCompletedCourses([]);

    let successCount = 0;
    let failCount = 0;
    const completed = [];

    for (let i = 0; i < TI_COURSES.length; i++) {
      const course = TI_COURSES[i];
      const result = await createCourse(course);
      
      if (result.success) {
        successCount++;
        completed.push({ ...course, status: 'success' });
      } else {
        failCount++;
        completed.push({ ...course, status: 'failed', error: result.error });
      }

      setProgress({ completed: i + 1, total: TI_COURSES.length });
      setCompletedCourses([...completed]);

      // Small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    setLoading(false);
    
    if (successCount > 0) {
      setMessage({ 
        type: "success", 
        text: `Berhasil menambahkan ${successCount} mata kuliah. ${failCount > 0 ? `${failCount} gagal.` : ''}` 
      });
    } else {
      setMessage({ 
        type: "error", 
        text: `Gagal menambahkan mata kuliah. Pastikan Anda sudah login sebagai Super Admin.` 
      });
    }
  };

  const groupedCourses = TI_COURSES.reduce((acc, course) => {
    const semester = `Semester ${course.semester}`;
    if (!acc[semester]) acc[semester] = [];
    acc[semester].push(course);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 md:p-8">
      {/* Header Section */}
      <div className="mb-8" data-aos="fade-down">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="mb-4 lg:mb-0">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                <MdSchool className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Tambah Mata Kuliah
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
              Menambahkan 35 mata kuliah untuk Program Studi Teknik Informatika Politeknik Negeri Manado.
            </p>
          </div>
          
          <button
            onClick={seedAllCourses}
            disabled={loading}
            className="self-start lg:self-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 font-medium"
            data-aos="fade-left"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Menambahkan...
              </>
            ) : (
              <>
                <MdAdd className="w-5 h-5" />
                Tambah Semua Mata Kuliah
              </>
            )}
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

      {/* Progress Bar */}
      {loading && (
        <div className="mb-6 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6" data-aos="fade-up">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-500">{progress.completed}/{progress.total}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(progress.completed / progress.total) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Course List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {Object.entries(groupedCourses).map(([semester, courses]) => (
          <div key={semester} className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8" data-aos="fade-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                <MdBook className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">{semester}</h2>
              <span className="ml-auto px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-600">
                {courses.length} mata kuliah
              </span>
            </div>
            
            <div className="space-y-3">
              {courses.map((course) => {
                const completed = completedCourses.find(c => c.code === course.code);
                return (
                  <div key={course.code} className={`p-4 rounded-2xl border transition-all duration-300 ${
                    completed?.status === 'success' ? 'bg-green-50 border-green-200' :
                    completed?.status === 'failed' ? 'bg-red-50 border-red-200' :
                    'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-blue-600">{course.code}</span>
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                            {course.credits} SKS
                          </span>
                          {completed && (
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                              completed.status === 'success' ? 'bg-green-100 text-green-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {completed.status === 'success' ? '✓ Berhasil' : '✗ Gagal'}
                            </span>
                          )}
                        </div>
                        <h3 className="font-medium text-gray-800">{course.name}</h3>
                        {completed?.error && (
                          <p className="text-xs text-red-600 mt-1">{completed.error}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Info Card */}
      <div className="mt-8 bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8" data-aos="fade-up">
        <div className="flex items-start gap-3">
          <MdAutoAwesome className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-gray-800 mb-2">Informasi Penting</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p>• <strong>Total Mata Kuliah:</strong> 35 mata kuliah dari semester 1-6</p>
              <p>• <strong>Total SKS:</strong> {TI_COURSES.reduce((sum, course) => sum + course.credits, 0)} SKS</p>
              <p>• <strong>Autentikasi:</strong> Pastikan Anda sudah login sebagai Super Admin</p>
              <p>• <strong>Setelah berhasil:</strong> Mata kuliah akan tersedia di form "Tambah Kelas"</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCourse;