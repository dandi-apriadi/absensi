import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Card from "components/card";
import {
    MdEdit,
    MdPerson,
    MdEmail,
    MdPhone,
    MdSchool,
    MdLocationOn,
    MdCalendarToday,
    MdWork,
    MdAccessTime,
    MdBook,
    MdPeople,
    MdTimeline,
    MdVerified
} from "react-icons/md";

// Dummy Data
const lecturerData = {
    id: 1,
    nip: "198507202010121002",
    name: "Dr. Ahmad Saputra, S.Kom., M.Cs.",
    email: "ahmad.saputra@university.ac.id",
    phone: "081234567890",
    department: "Teknik Informatika",
    faculty: "Fakultas Ilmu Komputer",
    position: "Dosen Tetap",
    joinDate: "2010-08-15",
    education: [
        { degree: "S3", major: "Computer Science", university: "University of Technology", year: "2017" },
        { degree: "S2", major: "Information Systems", university: "National University", year: "2008" },
        { degree: "S1", major: "Computer Science", university: "State University", year: "2006" }
    ],
    address: "Jl. Merdeka No. 123, Kota Baru",
    expertise: ["Artificial Intelligence", "Machine Learning", "Database Systems", "Software Engineering"],
    bio: "Dr. Ahmad Saputra adalah dosen dengan pengalaman lebih dari 10 tahun dalam bidang ilmu komputer. Fokus penelitiannya adalah pada bidang kecerdasan buatan dan pembelajaran mesin. Beliau telah menerbitkan lebih dari 15 publikasi internasional dan aktif dalam berbagai proyek penelitian."
};

const coursesTaught = [
    { id: 1, code: "CS-101", name: "Algoritma dan Pemrograman", semester: "Ganjil 2023/2024", students: 35 },
    { id: 2, code: "CS-102", name: "Basis Data", semester: "Ganjil 2023/2024", students: 42 },
    { id: 3, code: "CS-103", name: "Pemrograman Web", semester: "Ganjil 2023/2024", students: 28 },
    { id: 4, code: "CS-104", name: "Kecerdasan Buatan", semester: "Ganjil 2023/2024", students: 32 }
];

const attendanceStats = {
    totalSessions: 124,
    totalDays: 89,
    totalStudents: 137,
    averageAttendanceRate: 88,
    totalCourses: 4
};

const achievements = [
    { id: 1, title: "Best Lecturer Award", organization: "Faculty of Computer Science", year: "2022" },
    { id: 2, title: "Research Excellence", organization: "University Research Board", year: "2021" },
    { id: 3, title: "Innovation in Teaching", organization: "Ministry of Education", year: "2020" }
];

const LecturerProfile = () => {
    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: "ease-in-out",
            once: true,
        });
    }, []);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    return (
        <div className="mt-3">
            <div className="mb-5" data-aos="fade-down">
                <h1 className="text-3xl font-bold text-navy-700 dark:text-white">
                    Profil Dosen
                </h1>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Informasi lengkap profil Anda
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
                <div className="lg:col-span-1">
                    <Card extra="p-5" data-aos="fade-right">
                        <div className="flex flex-col items-center">
                            <div className="h-32 w-32 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                                <MdPerson className="h-16 w-16 text-indigo-600" />
                            </div>

                            <h2 className="text-xl font-bold text-navy-700 dark:text-white text-center">
                                {lecturerData.name}
                            </h2>

                            <p className="mt-1 text-sm text-gray-600 text-center">
                                {lecturerData.position} - {lecturerData.department}
                            </p>

                            <p className="mt-1 text-xs text-gray-500 text-center">
                                NIP: {lecturerData.nip}
                            </p>

                            <button className="mt-4 flex items-center justify-center py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors w-full">
                                <MdEdit className="mr-2" /> Edit Profil
                            </button>
                        </div>

                        <div className="mt-6 space-y-4">
                            <div className="flex items-start">
                                <div className="rounded-full bg-blue-100 p-2">
                                    <MdEmail className="h-5 w-5 text-blue-600" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-xs text-gray-500">Email</p>
                                    <p className="text-sm font-medium">{lecturerData.email}</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="rounded-full bg-green-100 p-2">
                                    <MdPhone className="h-5 w-5 text-green-600" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-xs text-gray-500">No. Telepon</p>
                                    <p className="text-sm font-medium">{lecturerData.phone}</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="rounded-full bg-purple-100 p-2">
                                    <MdSchool className="h-5 w-5 text-purple-600" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-xs text-gray-500">Fakultas</p>
                                    <p className="text-sm font-medium">{lecturerData.faculty}</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="rounded-full bg-orange-100 p-2">
                                    <MdLocationOn className="h-5 w-5 text-orange-600" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-xs text-gray-500">Alamat</p>
                                    <p className="text-sm font-medium">{lecturerData.address}</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="rounded-full bg-red-100 p-2">
                                    <MdCalendarToday className="h-5 w-5 text-red-600" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-xs text-gray-500">Bergabung Sejak</p>
                                    <p className="text-sm font-medium">{formatDate(lecturerData.joinDate)}</p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card extra="p-5 mt-5" data-aos="fade-right" data-aos-delay="100">
                        <div className="mb-4">
                            <h4 className="text-lg font-bold text-navy-700 dark:text-white">
                                Pendidikan
                            </h4>
                        </div>

                        <div className="space-y-4">
                            {lecturerData.education.map((edu, index) => (
                                <div key={index} className="p-3 border border-gray-200 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-semibold">{edu.degree} - {edu.major}</span>
                                        <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                                            {edu.year}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">{edu.university}</p>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card extra="p-5 mt-5" data-aos="fade-right" data-aos-delay="200">
                        <div className="mb-4">
                            <h4 className="text-lg font-bold text-navy-700 dark:text-white">
                                Bidang Keahlian
                            </h4>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {lecturerData.expertise.map((skill, index) => (
                                <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-2">
                    <Card extra="p-5" data-aos="fade-left">
                        <div className="mb-4">
                            <h4 className="text-lg font-bold text-navy-700 dark:text-white">
                                Biografi
                            </h4>
                        </div>
                        <p className="text-sm text-gray-600">
                            {lecturerData.bio}
                        </p>
                    </Card>

                    <Card extra="p-5 mt-5" data-aos="fade-left" data-aos-delay="100">
                        <div className="mb-4">
                            <h4 className="text-lg font-bold text-navy-700 dark:text-white">
                                Mata Kuliah yang Diampu
                            </h4>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[500px]">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500">Kode</th>
                                        <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500">Mata Kuliah</th>
                                        <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500">Semester</th>
                                        <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500">Mahasiswa</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {coursesTaught.map((course) => (
                                        <tr key={course.id} className="border-b border-gray-200">
                                            <td className="py-3 px-4 text-sm font-medium text-gray-900">{course.code}</td>
                                            <td className="py-3 px-4 text-sm text-gray-500">{course.name}</td>
                                            <td className="py-3 px-4 text-sm text-gray-500">{course.semester}</td>
                                            <td className="py-3 px-4 text-sm text-gray-500">{course.students} mahasiswa</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                        <Card extra="p-5" data-aos="fade-left" data-aos-delay="200">
                            <div className="mb-4">
                                <h4 className="text-lg font-bold text-navy-700 dark:text-white flex items-center">
                                    <MdVerified className="mr-2 h-5 w-5" /> Prestasi
                                </h4>
                            </div>

                            <div className="space-y-3">
                                {achievements.map((achievement) => (
                                    <div key={achievement.id} className="p-3 border border-gray-200 rounded-lg">
                                        <h6 className="text-sm font-semibold text-gray-900">{achievement.title}</h6>
                                        <div className="flex justify-between mt-1">
                                            <span className="text-xs text-gray-500">{achievement.organization}</span>
                                            <span className="text-xs font-medium text-indigo-600">{achievement.year}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <Card extra="p-5" data-aos="fade-left" data-aos-delay="300">
                            <div className="mb-4">
                                <h4 className="text-lg font-bold text-navy-700 dark:text-white flex items-center">
                                    <MdTimeline className="mr-2 h-5 w-5" /> Statistik
                                </h4>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <div className="rounded-full bg-indigo-100 p-2">
                                        <MdBook className="h-5 w-5 text-indigo-600" />
                                    </div>
                                    <div className="ml-3 flex-1">
                                        <div className="flex justify-between">
                                            <p className="text-xs text-gray-500">Total Mata Kuliah</p>
                                            <p className="text-sm font-semibold">{attendanceStats.totalCourses}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <div className="rounded-full bg-blue-100 p-2">
                                        <MdAccessTime className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div className="ml-3 flex-1">
                                        <div className="flex justify-between">
                                            <p className="text-xs text-gray-500">Total Sesi Mengajar</p>
                                            <p className="text-sm font-semibold">{attendanceStats.totalSessions}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <div className="rounded-full bg-green-100 p-2">
                                        <MdPeople className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div className="ml-3 flex-1">
                                        <div className="flex justify-between">
                                            <p className="text-xs text-gray-500">Total Mahasiswa</p>
                                            <p className="text-sm font-semibold">{attendanceStats.totalStudents}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <div className="rounded-full bg-purple-100 p-2">
                                        <MdWork className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <div className="ml-3 flex-1">
                                        <div className="flex justify-between">
                                            <p className="text-xs text-gray-500">Rata-Rata Kehadiran</p>
                                            <p className="text-sm font-semibold">{attendanceStats.averageAttendanceRate}%</p>
                                        </div>
                                        <div className="mt-1 h-1.5 w-full bg-gray-200 rounded-full">
                                            <div
                                                className="h-1.5 rounded-full bg-purple-500"
                                                style={{ width: `${attendanceStats.averageAttendanceRate}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LecturerProfile;
