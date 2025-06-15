import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { MdEdit, MdSchool, MdEmail, MdPhone, MdLocationOn, MdCalendarToday, MdTrendingUp, MdVerified, MdWarning, MdSave, MdCamera } from "react-icons/md";

const StudentProfile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        name: 'John Doe',
        nim: '2021001234',
        email: 'john.doe@university.ac.id',
        phone: '081234567890',
        address: 'Jl. Pendidikan No. 123, Jakarta Selatan',
        program: 'Teknik Informatika',
        faculty: 'Fakultas Teknologi Informasi',
        semester: '6',
        academicYear: '2021/2025',
        enrollmentDate: '2021-08-15',
        gpa: '3.65',
        totalCredits: 120,
        profilePicture: null
    });

    const [attendanceStats, setAttendanceStats] = useState({
        totalClasses: 156,
        attended: 142,
        absent: 10,
        late: 4,
        percentage: 91.0,
        currentSemesterAttendance: 87.5,
        bestSubject: 'Pemrograman Web',
        worstSubject: 'Machine Learning'
    });

    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
        });
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = () => {
        // Simulate save
        setIsEditing(false);
        alert('Profil berhasil diperbarui!');
    };

    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setProfileData(prev => ({
                    ...prev,
                    profilePicture: e.target.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const getAttendanceColor = (percentage) => {
        if (percentage >= 90) return 'text-green-600';
        if (percentage >= 75) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getAttendanceStatus = (percentage) => {
        if (percentage >= 90) return 'Sangat Baik';
        if (percentage >= 75) return 'Baik';
        return 'Perlu Ditingkatkan';
    };

    const subjectPerformance = [
        { subject: 'Pemrograman Web', attendance: 95, grade: 'A' },
        { subject: 'Database Management', attendance: 92, grade: 'A-' },
        { subject: 'Mobile Development', attendance: 88, grade: 'B+' },
        { subject: 'Machine Learning', attendance: 82, grade: 'B' },
        { subject: 'Software Engineering', attendance: 90, grade: 'A-' }
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            {/* Header */}
            <div className="mb-8" data-aos="fade-down">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            Profil Mahasiswa
                        </h1>
                        <p className="text-gray-600">
                            Informasi pribadi dan statistik akademik Anda
                        </p>
                    </div>
                    <button
                        onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center"
                    >
                        {isEditing ? (
                            <>
                                <MdSave className="h-5 w-5 mr-2" />
                                Simpan
                            </>
                        ) : (
                            <>
                                <MdEdit className="h-5 w-5 mr-2" />
                                Edit Profil
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-lg p-6" data-aos="fade-right">
                        {/* Profile Picture */}
                        <div className="text-center mb-6">
                            <div className="relative inline-block">
                                {profileData.profilePicture ? (
                                    <img
                                        src={profileData.profilePicture}
                                        alt="Profile"
                                        className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
                                    />
                                ) : (
                                    <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold border-4 border-blue-500">
                                        {profileData.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                )}
                                {isEditing && (
                                    <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600 transition-colors">
                                        <MdCamera className="h-4 w-4" />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleProfilePictureChange}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mt-4">{profileData.name}</h3>
                            <p className="text-gray-600">{profileData.nim}</p>
                            <p className="text-sm text-gray-500">{profileData.program}</p>
                        </div>

                        {/* Quick Stats */}
                        <div className="space-y-4">
                            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-green-700">Kehadiran Keseluruhan</p>
                                        <p className={`text-2xl font-bold ${getAttendanceColor(attendanceStats.percentage)}`}>
                                            {attendanceStats.percentage}%
                                        </p>
                                    </div>
                                    <MdTrendingUp className="h-8 w-8 text-green-600" />
                                </div>
                                <p className="text-xs text-green-600 mt-1">
                                    {getAttendanceStatus(attendanceStats.percentage)}
                                </p>
                            </div>

                            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-blue-700">IPK Saat Ini</p>
                                        <p className="text-2xl font-bold text-blue-600">{profileData.gpa}</p>
                                    </div>
                                    <MdSchool className="h-8 w-8 text-blue-600" />
                                </div>
                                <p className="text-xs text-blue-600 mt-1">
                                    {profileData.totalCredits} SKS
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Academic Info */}
                    <div className="bg-white rounded-xl shadow-lg p-6 mt-6" data-aos="fade-right" data-aos-delay="200">
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">Informasi Akademik</h4>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Semester</span>
                                <span className="font-medium">Semester {profileData.semester}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Tahun Akademik</span>
                                <span className="font-medium">{profileData.academicYear}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Tanggal Masuk</span>
                                <span className="font-medium">{new Date(profileData.enrollmentDate).toLocaleDateString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Status</span>
                                <span className="flex items-center font-medium text-green-600">
                                    <MdVerified className="h-4 w-4 mr-1" />
                                    Aktif
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Personal Information */}
                    <div className="bg-white rounded-xl shadow-lg p-6" data-aos="fade-left">
                        <h3 className="text-xl font-semibold text-gray-800 mb-6">Informasi Pribadi</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nama Lengkap
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="name"
                                        value={profileData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                ) : (
                                    <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                                        <span className="text-gray-800">{profileData.name}</span>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    NIM
                                </label>
                                <div className="flex items-center p-2 bg-gray-100 rounded-lg">
                                    <span className="text-gray-600">{profileData.nim}</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                {isEditing ? (
                                    <div className="relative">
                                        <MdEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={profileData.email}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                                        <MdEmail className="h-5 w-5 text-gray-400 mr-2" />
                                        <span className="text-gray-800">{profileData.email}</span>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    No. Telepon
                                </label>
                                {isEditing ? (
                                    <div className="relative">
                                        <MdPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={profileData.phone}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                                        <MdPhone className="h-5 w-5 text-gray-400 mr-2" />
                                        <span className="text-gray-800">{profileData.phone}</span>
                                    </div>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Alamat
                                </label>
                                {isEditing ? (
                                    <div className="relative">
                                        <MdLocationOn className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                                        <textarea
                                            name="address"
                                            value={profileData.address}
                                            onChange={handleInputChange}
                                            rows={3}
                                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex items-start p-2 bg-gray-50 rounded-lg">
                                        <MdLocationOn className="h-5 w-5 text-gray-400 mr-2 mt-1" />
                                        <span className="text-gray-800">{profileData.address}</span>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Program Studi
                                </label>
                                <div className="flex items-center p-2 bg-gray-100 rounded-lg">
                                    <span className="text-gray-600">{profileData.program}</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Fakultas
                                </label>
                                <div className="flex items-center p-2 bg-gray-100 rounded-lg">
                                    <span className="text-gray-600">{profileData.faculty}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Attendance Statistics */}
                    <div className="bg-white rounded-xl shadow-lg p-6" data-aos="fade-left" data-aos-delay="200">
                        <h3 className="text-xl font-semibold text-gray-800 mb-6">Statistik Kehadiran</h3>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                                <p className="text-2xl font-bold text-blue-600">{attendanceStats.totalClasses}</p>
                                <p className="text-sm text-gray-600">Total Kelas</p>
                            </div>
                            <div className="text-center p-4 bg-green-50 rounded-lg">
                                <p className="text-2xl font-bold text-green-600">{attendanceStats.attended}</p>
                                <p className="text-sm text-gray-600">Hadir</p>
                            </div>
                            <div className="text-center p-4 bg-red-50 rounded-lg">
                                <p className="text-2xl font-bold text-red-600">{attendanceStats.absent}</p>
                                <p className="text-sm text-gray-600">Tidak Hadir</p>
                            </div>
                            <div className="text-center p-4 bg-yellow-50 rounded-lg">
                                <p className="text-2xl font-bold text-yellow-600">{attendanceStats.late}</p>
                                <p className="text-sm text-gray-600">Terlambat</p>
                            </div>
                        </div>

                        {/* Subject Performance */}
                        <div>
                            <h4 className="font-semibold text-gray-800 mb-4">Performa per Mata Kuliah</h4>
                            <div className="space-y-3">
                                {subjectPerformance.map((subject, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="font-medium text-gray-800">{subject.subject}</span>
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-sm font-medium text-gray-600">Grade: {subject.grade}</span>
                                                    <span className={`text-sm font-bold ${getAttendanceColor(subject.attendance)}`}>
                                                        {subject.attendance}%
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full transition-all duration-500 ${subject.attendance >= 90 ? 'bg-green-500' :
                                                            subject.attendance >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                                                        }`}
                                                    style={{ width: `${subject.attendance}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Attendance Warning */}
                    {attendanceStats.percentage < 80 && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6" data-aos="fade-left" data-aos-delay="300">
                            <div className="flex items-start">
                                <MdWarning className="h-6 w-6 text-yellow-600 mr-3 mt-1" />
                                <div>
                                    <h4 className="font-semibold text-yellow-800 mb-2">Peringatan Kehadiran</h4>
                                    <p className="text-yellow-700 text-sm mb-3">
                                        Persentase kehadiran Anda saat ini {attendanceStats.percentage}%.
                                        Untuk memenuhi syarat mengikuti ujian, minimal kehadiran adalah 80%.
                                    </p>
                                    <ul className="text-sm text-yellow-700 space-y-1">
                                        <li>• Tingkatkan kehadiran pada pertemuan selanjutnya</li>
                                        <li>• Hubungi dosen jika ada kendala kehadiran</li>
                                        <li>• Pertimbangkan pengajuan izin resmi jika tidak bisa hadir</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;
