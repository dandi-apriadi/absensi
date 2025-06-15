import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Card from "components/card";
import Chart from "react-apexcharts";
import {
    MdFilterList,
    MdSearch,
    MdDownload,
    MdWarning,
    MdMail,
    MdPerson,
    MdTrendingUp,
    MdTrendingDown,
    MdInfo
} from "react-icons/md";

// Dummy Data
const courses = [
    { id: 1, code: "CS-101", name: "Algoritma dan Pemrograman" },
    { id: 2, code: "CS-102", name: "Basis Data" },
    { id: 3, code: "CS-103", name: "Pemrograman Web" },
    { id: 4, code: "CS-104", name: "Kecerdasan Buatan" },
];

const attendanceStats = {
    weeklyAverage: [92, 90, 88, 87, 86, 84, 83, 82],
    courseComparison: {
        categories: ["Algoritma", "Basis Data", "Web", "Kecerdasan Buatan"],
        series: [
            { name: "Minggu 1-4", data: [92, 89, 85, 88] },
            { name: "Minggu 5-8", data: [87, 86, 80, 85] }
        ]
    },
    attendanceDistribution: [
        { status: "Tinggi (>90%)", count: 71, percentage: 52, color: "#22c55e" },
        { status: "Sedang (75-90%)", count: 57, percentage: 41, color: "#eab308" },
        { status: "Rendah (<75%)", count: 9, percentage: 7, color: "#ef4444" }
    ]
};

const lowAttendanceStudents = [
    { id: 1, nim: "20210003", name: "Ahmad Rizki", attendanceRate: 72, trend: "down", course: "Pemrograman Web", lastAttendance: "2023-10-10", status: "kritis" },
    { id: 2, nim: "20210007", name: "Dimas Pratama", attendanceRate: 74, trend: "stable", course: "Algoritma dan Pemrograman", lastAttendance: "2023-10-15", status: "kritis" },
    { id: 3, nim: "20210005", name: "Farhan Abdullah", attendanceRate: 78, trend: "up", course: "Basis Data", lastAttendance: "2023-10-16", status: "perhatian" },
    { id: 4, nim: "20210002", name: "Siti Nuraini", attendanceRate: 82, trend: "down", course: "Kecerdasan Buatan", lastAttendance: "2023-10-12", status: "perhatian" },
    { id: 5, nim: "20210009", name: "Rini Anjani", attendanceRate: 73, trend: "down", course: "Pemrograman Web", lastAttendance: "2023-10-08", status: "kritis" }
];

const AttendanceStats = () => {
    const [selectedCourse, setSelectedCourse] = useState("all");
    const [filter, setFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [viewMode, setViewMode] = useState("chart");

    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: "ease-in-out",
            once: true,
        });
    }, []);

    const handleSendNotifications = () => {
        alert("Notifikasi telah dikirim ke mahasiswa dengan kehadiran rendah");
    };

    // Filter students based on search and filters
    const filteredStudents = lowAttendanceStudents.filter(student => {
        const matchesSearch =
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.nim.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCourse = selectedCourse === "all" || student.course === courses.find(c => c.id == selectedCourse)?.name;
        const matchesFilter = filter === "all" ||
            (filter === "critical" && student.status === "kritis") ||
            (filter === "attention" && student.status === "perhatian");

        return matchesSearch && matchesCourse && matchesFilter;
    });

    // Chart options
    const lineChartOptions = {
        chart: {
            height: 350,
            type: 'line',
            toolbar: {
                show: false
            },
            foreColor: "#697a8d"
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth',
            width: 3
        },
        colors: ['#4F46E5'],
        xaxis: {
            categories: ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4', 'Minggu 5', 'Minggu 6', 'Minggu 7', 'Minggu 8'],
        },
        yaxis: {
            title: {
                text: 'Persentase Kehadiran'
            },
            min: 70,
            max: 100
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return val + "%";
                }
            }
        }
    };

    const barChartOptions = {
        chart: {
            type: 'bar',
            height: 350,
            stacked: false,
            toolbar: {
                show: false
            },
            foreColor: "#697a8d"
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                borderRadius: 4,
            },
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
        },
        xaxis: {
            categories: attendanceStats.courseComparison.categories,
        },
        yaxis: {
            title: {
                text: 'Persentase Kehadiran (%)'
            },
            min: 70,
            max: 100
        },
        fill: {
            opacity: 1
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return val + "%"
                }
            }
        },
        legend: {
            position: 'top',
            horizontalAlign: 'right',
        },
        colors: ['#4F46E5', '#22c55e']
    };

    const pieChartOptions = {
        chart: {
            type: 'pie',
            foreColor: "#697a8d"
        },
        labels: attendanceStats.attendanceDistribution.map(d => d.status),
        colors: attendanceStats.attendanceDistribution.map(d => d.color),
        legend: {
            position: 'bottom'
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 200
                },
                legend: {
                    position: 'bottom'
                }
            }
        }]
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    return (
        <div className="mt-3">
            <div className="mb-5" data-aos="fade-down">
                <h1 className="text-3xl font-bold text-navy-700 dark:text-white">
                    Statistik Kehadiran
                </h1>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Analisis mendalam tentang pola kehadiran mahasiswa
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                <div className="md:col-span-2">
                    <Card extra="p-5" data-aos="fade-up">
                        <div className="mb-4 flex justify-between items-center">
                            <h4 className="text-lg font-bold text-navy-700 dark:text-white">
                                Tren Tingkat Kehadiran
                            </h4>
                            <div className="flex bg-gray-100 rounded-lg p-1">
                                <button
                                    onClick={() => setViewMode("chart")}
                                    className={`px-3 py-1 text-xs rounded-lg ${viewMode === "chart" ? "bg-indigo-600 text-white" : "text-gray-600"}`}
                                >
                                    Grafik
                                </button>
                                <button
                                    onClick={() => setViewMode("comparison")}
                                    className={`px-3 py-1 text-xs rounded-lg ${viewMode === "comparison" ? "bg-indigo-600 text-white" : "text-gray-600"}`}
                                >
                                    Perbandingan
                                </button>
                            </div>
                        </div>

                        <div className="h-80">
                            {viewMode === "chart" ? (
                                <Chart
                                    options={lineChartOptions}
                                    series={[
                                        {
                                            name: "Tingkat Kehadiran",
                                            data: attendanceStats.weeklyAverage
                                        }
                                    ]}
                                    type="line"
                                    height="100%"
                                />
                            ) : (
                                <Chart
                                    options={barChartOptions}
                                    series={[
                                        {
                                            name: "Minggu 1-4",
                                            data: attendanceStats.courseComparison.series[0].data
                                        },
                                        {
                                            name: "Minggu 5-8",
                                            data: attendanceStats.courseComparison.series[1].data
                                        }
                                    ]}
                                    type="bar"
                                    height="100%"
                                />
                            )}
                        </div>

                        <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                            <div className="flex items-start">
                                <MdInfo className="text-yellow-600 mt-0.5 mr-2" />
                                <p className="text-sm text-yellow-700">
                                    {viewMode === "chart" ?
                                        "Terdapat tren penurunan kehadiran dalam 8 minggu terakhir. Rata-rata kehadiran minggu ini adalah 82%, menurun 10% dari awal semester." :
                                        "Mata kuliah Pemrograman Web mengalami penurunan kehadiran paling signifikan dengan selisih 5% antara awal dan akhir periode."}
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>

                <Card extra="p-5" data-aos="fade-up" data-aos-delay="100">
                    <div className="mb-4">
                        <h4 className="text-lg font-bold text-navy-700 dark:text-white">
                            Distribusi Status Kehadiran
                        </h4>
                    </div>

                    <div className="h-72 flex items-center justify-center">
                        <Chart
                            options={pieChartOptions}
                            series={attendanceStats.attendanceDistribution.map(d => d.count)}
                            type="pie"
                            width="100%"
                        />
                    </div>

                    <div className="mt-6 space-y-3">
                        {attendanceStats.attendanceDistribution.map((item, index) => (
                            <div key={index} className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                    <span className="ml-2 text-sm text-gray-600">{item.status}</span>
                                </div>
                                <div className="text-sm font-medium">{item.count} mahasiswa ({item.percentage}%)</div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            <Card extra="p-5 mb-5" data-aos="fade-up" data-aos-delay="200">
                <div className="mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <h4 className="text-lg font-bold text-navy-700 dark:text-white">
                            Mahasiswa dengan Kehadiran Rendah
                        </h4>
                        <button
                            onClick={handleSendNotifications}
                            className="py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                        >
                            <MdMail className="mr-2" /> Kirim Notifikasi
                        </button>
                    </div>

                    <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="flex-1 relative">
                            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Cari berdasarkan nama atau NIM..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div>
                            <select
                                className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 appearance-none"
                                value={selectedCourse}
                                onChange={(e) => setSelectedCourse(e.target.value)}
                            >
                                <option value="all">Semua Mata Kuliah</option>
                                {courses.map((course) => (
                                    <option key={course.id} value={course.id}>
                                        {course.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <select
                                className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 appearance-none"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                            >
                                <option value="all">Semua Status</option>
                                <option value="critical">Kritis (&lt;75%)</option>
                                <option value="attention">Perhatian (75-85%)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Mahasiswa
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Mata Kuliah
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Kehadiran
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tren
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Terakhir Hadir
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredStudents.map((student) => (
                                <tr key={student.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                                                <MdPerson className="h-4 w-4 text-gray-600" />
                                            </div>
                                            <div className="ml-3">
                                                <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                                <div className="text-xs text-gray-500">{student.nim}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {student.course}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-24 h-2 bg-gray-200 rounded-full mr-3">
                                                <div
                                                    className={`h-2 rounded-full ${student.attendanceRate >= 85
                                                            ? "bg-green-500"
                                                            : student.attendanceRate >= 75
                                                                ? "bg-yellow-500"
                                                                : "bg-red-500"
                                                        }`}
                                                    style={{ width: `${student.attendanceRate}%` }}
                                                />
                                            </div>
                                            <span className={`text-sm font-medium ${student.attendanceRate >= 85
                                                    ? "text-green-600"
                                                    : student.attendanceRate >= 75
                                                        ? "text-yellow-600"
                                                        : "text-red-600"
                                                }`}>
                                                {student.attendanceRate}%
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {student.trend === "up" && (
                                            <div className="flex items-center text-green-600">
                                                <MdTrendingUp className="mr-1" />
                                                <span className="text-sm">Membaik</span>
                                            </div>
                                        )}
                                        {student.trend === "down" && (
                                            <div className="flex items-center text-red-600">
                                                <MdTrendingDown className="mr-1" />
                                                <span className="text-sm">Menurun</span>
                                            </div>
                                        )}
                                        {student.trend === "stable" && (
                                            <span className="text-sm text-gray-500">Stabil</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(student.lastAttendance)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                                            Lihat Detail
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredStudents.length === 0 && (
                    <div className="text-center py-8">
                        <MdInfo className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                        <h3 className="text-lg font-medium text-gray-700">Tidak ada data yang sesuai</h3>
                        <p className="text-gray-500 mt-1">Coba ubah filter atau kata kunci pencarian Anda</p>
                    </div>
                )}
            </Card>

            <Card extra="p-5" data-aos="fade-up" data-aos-delay="300">
                <div className="mb-4">
                    <h4 className="text-lg font-bold text-navy-700 dark:text-white">
                        Rekomendasi Tindakan
                    </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                        <h5 className="text-base font-medium text-red-800 flex items-center mb-2">
                            <MdWarning className="mr-2" /> Tindakan Segera
                        </h5>
                        <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
                            <li>Kirim notifikasi kepada 5 mahasiswa dengan tingkat kehadiran kritis</li>
                            <li>Jadwalkan pertemuan dengan mahasiswa Ahmad Rizki dan Dimas Pratama</li>
                            <li>Tambahkan catatan kehadiran pada nilai ujian tengah semester</li>
                        </ul>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <h5 className="text-base font-medium text-blue-800 flex items-center mb-2">
                            <MdInfo className="mr-2" /> Perhatian
                        </h5>
                        <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
                            <li>Pantau kehadiran 2 mahasiswa dengan status perhatian</li>
                            <li>Evaluasi metode absensi untuk mata kuliah Pemrograman Web</li>
                            <li>Pertimbangkan untuk mengubah waktu mata kuliah yang memiliki tingkat kehadiran rendah</li>
                        </ul>
                    </div>
                </div>

                <div className="flex justify-end mt-6">
                    <button
                        onClick={() => alert('Laporan statistik kehadiran berhasil diunduh')}
                        className="py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                    >
                        <MdDownload className="mr-2" /> Unduh Laporan Lengkap
                    </button>
                </div>
            </Card>
        </div>
    );
};

export default AttendanceStats;
