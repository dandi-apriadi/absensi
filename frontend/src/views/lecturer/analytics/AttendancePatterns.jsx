import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Card from "components/card";
import Chart from "react-apexcharts";
import {
    MdBarChart,
    MdAutoGraph,
    MdPieChart,
    MdCalendarViewWeek,
    MdAccessTime,
    MdFilterList,
    MdFileDownload,
    MdWarning,
    MdInfo
} from "react-icons/md";

// Dummy Data
const courses = [
    { id: 1, code: "CS-101", name: "Algoritma dan Pemrograman" },
    { id: 2, code: "CS-102", name: "Basis Data" },
    { id: 3, code: "CS-103", name: "Pemrograman Web" },
    { id: 4, code: "CS-104", name: "Kecerdasan Buatan" },
];

const weeks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

const AttendancePatterns = () => {
    const [selectedCourse, setSelectedCourse] = useState("");
    const [selectedTimeframe, setSelectedTimeframe] = useState("weekly");

    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: "ease-in-out",
            once: true,
        });
    }, []);

    // Chart data
    const weekdayAttendanceData = {
        series: [
            {
                name: "Tingkat Kehadiran",
                data: [92, 87, 85, 90, 84]
            }
        ],
        categories: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"]
    };

    const timeOfDayData = {
        series: [
            {
                name: "Tingkat Kehadiran",
                data: [88, 92, 84, 78]
            }
        ],
        categories: ["Pagi (08:00-10:00)", "Siang (10:00-13:00)", "Sore (13:00-16:00)", "Malam (16:00-19:00)"]
    };

    const weeklyTrendData = {
        series: [
            {
                name: "Algoritma dan Pemrograman",
                data: [94, 92, 90, 89, 91, 88, 87, 86, 85, 83, 82, 80, 79, 78]
            },
            {
                name: "Basis Data",
                data: [90, 92, 91, 93, 92, 90, 89, 91, 87, 85, 84, 82, 81, 80]
            },
            {
                name: "Pemrograman Web",
                data: [86, 85, 84, 82, 83, 80, 78, 77, 79, 76, 75, 73, 74, 72]
            },
            {
                name: "Kecerdasan Buatan",
                data: [89, 88, 87, 90, 91, 89, 88, 87, 85, 84, 82, 83, 80, 79]
            }
        ],
        categories: weeks.map(week => `Minggu ${week}`)
    };

    const absenceReasonData = {
        series: [45, 30, 15, 10],
        labels: ["Sakit", "Urusan Keluarga", "Kegiatan Akademik", "Alasan Lainnya"]
    };

    // Chart options
    const barChartOptions = {
        chart: {
            type: 'bar',
            height: 350,
            toolbar: {
                show: false
            },
            foreColor: "#697a8d"
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                borderRadius: 5,
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
        },
        xaxis: {
            categories: weekdayAttendanceData.categories,
        },
        yaxis: {
            title: {
                text: 'Persentase (%)'
            },
            min: 0,
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
        colors: ["#4F46E5"]
    };

    const lineChartOptions = {
        chart: {
            height: 350,
            type: "line",
            dropShadow: {
                enabled: true,
                color: '#000',
                top: 18,
                left: 7,
                blur: 10,
                opacity: 0.2
            },
            toolbar: {
                show: false
            },
            foreColor: "#697a8d"
        },
        colors: ['#4F46E5', '#22C55E', '#EF4444', '#F59E0B'],
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: 'smooth',
            width: 3
        },
        grid: {
            borderColor: '#e7e7e7',
            row: {
                colors: ['#f3f3f3', 'transparent'],
                opacity: 0.5
            },
        },
        markers: {
            size: 1
        },
        xaxis: {
            categories: weeklyTrendData.categories,
        },
        yaxis: {
            title: {
                text: 'Persentase (%)'
            },
            min: 70,
            max: 100
        },
        legend: {
            position: 'top',
            horizontalAlign: 'right',
            floating: true,
            offsetY: -10,
            offsetX: -5
        }
    };

    const pieChartOptions = {
        chart: {
            type: 'pie',
            foreColor: "#697a8d"
        },
        labels: absenceReasonData.labels,
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
        }],
        colors: ['#4F46E5', '#22C55E', '#EF4444', '#F59E0B']
    };

    return (
        <div className="mt-3">
            <div className="mb-5" data-aos="fade-down">
                <h1 className="text-3xl font-bold text-navy-700 dark:text-white">
                    Analisis Pola Kehadiran
                </h1>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Analisis mendalam tentang pola kehadiran mahasiswa
                </p>
            </div>

            <div className="mb-5 flex flex-col md:flex-row md:items-center gap-4" data-aos="fade-up">
                <div className="w-full md:w-64">
                    <label className="text-sm text-gray-700 block mb-1">Mata Kuliah</label>
                    <select
                        className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 appearance-none"
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                    >
                        <option value="">Semua Mata Kuliah</option>
                        {courses.map((course) => (
                            <option key={course.id} value={course.name}>
                                {course.code} - {course.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="w-full md:w-64">
                    <label className="text-sm text-gray-700 block mb-1">Rentang Waktu</label>
                    <select
                        className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 appearance-none"
                        value={selectedTimeframe}
                        onChange={(e) => setSelectedTimeframe(e.target.value)}
                    >
                        <option value="weekly">Mingguan</option>
                        <option value="monthly">Bulanan</option>
                        <option value="semester">Semesteran</option>
                    </select>
                </div>

                <div className="md:ml-auto md:self-end">
                    <button
                        className="flex items-center justify-center py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors w-full md:w-auto"
                        onClick={() => alert('Eksport data analisis kehadiran')}
                    >
                        <MdFileDownload className="mr-2" />
                        Eksport Laporan
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
                <Card extra="p-4" data-aos="fade-up" data-aos-delay="100">
                    <div className="mb-4 flex items-center justify-between">
                        <h4 className="text-lg font-bold text-navy-700 dark:text-white flex items-center">
                            <MdCalendarViewWeek className="mr-2 h-5 w-5" /> Tingkat Kehadiran Berdasarkan Hari
                        </h4>
                    </div>
                    <div className="h-80">
                        <Chart
                            options={barChartOptions}
                            series={weekdayAttendanceData.series}
                            type="bar"
                            height="100%"
                        />
                    </div>
                    <div className="mt-4 text-sm text-gray-500">
                        <MdInfo className="inline-block mr-1" />
                        Kehadiran cenderung lebih tinggi di awal minggu (Senin, Selasa) dibanding akhir minggu.
                    </div>
                </Card>

                <Card extra="p-4" data-aos="fade-up" data-aos-delay="200">
                    <div className="mb-4 flex items-center justify-between">
                        <h4 className="text-lg font-bold text-navy-700 dark:text-white flex items-center">
                            <MdAccessTime className="mr-2 h-5 w-5" /> Tingkat Kehadiran Berdasarkan Waktu
                        </h4>
                    </div>
                    <div className="h-80">
                        <Chart
                            options={{ ...barChartOptions, xaxis: { categories: timeOfDayData.categories } }}
                            series={timeOfDayData.series}
                            type="bar"
                            height="100%"
                        />
                    </div>
                    <div className="mt-4 text-sm text-gray-500">
                        <MdInfo className="inline-block mr-1" />
                        Kelas di siang hari memiliki tingkat kehadiran tertinggi, sementara kelas malam hari terendah.
                    </div>
                </Card>
            </div>

            <Card extra="p-4 mb-5" data-aos="fade-up" data-aos-delay="300">
                <div className="mb-4 flex items-center justify-between">
                    <h4 className="text-lg font-bold text-navy-700 dark:text-white flex items-center">
                        <MdAutoGraph className="mr-2 h-5 w-5" /> Tren Kehadiran Mingguan
                    </h4>
                </div>
                <div className="h-96">
                    <Chart
                        options={lineChartOptions}
                        series={weeklyTrendData.series}
                        type="line"
                        height="100%"
                    />
                </div>
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                    <p className="text-sm text-gray-700 flex items-start">
                        <MdWarning className="text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>
                            Teridentifikasi tren penurunan kehadiran di semua mata kuliah mulai dari minggu ke-9.
                            Kemungkinan penyebab: peningkatan beban tugas di akhir semester, kelelahan, atau persiapan ujian.
                        </span>
                    </p>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
                <Card extra="p-4" data-aos="fade-up" data-aos-delay="400">
                    <div className="mb-4 flex items-center justify-between">
                        <h4 className="text-lg font-bold text-navy-700 dark:text-white flex items-center">
                            <MdPieChart className="mr-2 h-5 w-5" /> Distribusi Alasan Ketidakhadiran
                        </h4>
                    </div>
                    <div className="h-80 flex justify-center items-center">
                        <Chart
                            options={pieChartOptions}
                            series={absenceReasonData.series}
                            type="pie"
                            width="380"
                        />
                    </div>
                    <div className="mt-4 text-sm text-gray-500">
                        <MdInfo className="inline-block mr-1" />
                        Sakit merupakan alasan ketidakhadiran terbanyak (45%), diikuti oleh urusan keluarga (30%).
                    </div>
                </Card>

                <Card extra="p-4" data-aos="fade-up" data-aos-delay="500">
                    <div className="mb-4">
                        <h4 className="text-lg font-bold text-navy-700 dark:text-white">
                            Wawasan & Rekomendasi
                        </h4>
                    </div>
                    <div className="space-y-4">
                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                            <h5 className="text-base font-medium text-blue-800 mb-1">Pola Kehadiran</h5>
                            <p className="text-sm text-gray-700">
                                Terjadi penurunan kehadiran sebesar 15% dari minggu ke-1 hingga minggu ke-14 di semua mata kuliah.
                                Kelas pagi dan sore hari memiliki tingkat ketidakhadiran lebih tinggi dibandingkan kelas siang.
                            </p>
                        </div>

                        <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                            <h5 className="text-base font-medium text-green-800 mb-1">Rekomendasi</h5>
                            <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                                <li>Tingkatkan interaksi dan aktivitas di kelas pagi dan sore untuk meningkatkan kehadiran</li>
                                <li>Distribusikan beban tugas lebih merata sepanjang semester untuk menghindari penurunan kehadiran di akhir semester</li>
                                <li>Lakukan pengecekan kesehatan rutin untuk mengurangi ketidakhadiran karena sakit</li>
                                <li>Pertimbangkan penyesuaian jadwal untuk menghindari hari dengan tingkat kehadiran rendah</li>
                            </ul>
                        </div>

                        <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                            <h5 className="text-base font-medium text-purple-800 mb-1">Faktor yang Mempengaruhi</h5>
                            <p className="text-sm text-gray-700">
                                Berdasarkan analisis, faktor-faktor yang mempengaruhi tingkat kehadiran antara lain: waktu kelas,
                                beban tugas, jarak tempat tinggal mahasiswa dengan kampus, dan kondisi kesehatan mahasiswa.
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AttendancePatterns;
