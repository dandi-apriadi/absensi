import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Card from "components/card";
import Chart from "react-apexcharts";
import { MdBarChart, MdPeople, MdBook, MdClass, MdSchool } from "react-icons/md";

// Dummy Data
const courses = [
    {
        id: 1,
        code: "CS-101",
        name: "Algoritma dan Pemrograman",
        students: 35,
        attendanceRate: 92,
        absentRate: 5,
        leaveRate: 3,
        weeklyData: [95, 93, 90, 92, 94, 91, 89, 88]
    },
    {
        id: 2,
        code: "CS-102",
        name: "Basis Data",
        students: 42,
        attendanceRate: 89,
        absentRate: 7,
        leaveRate: 4,
        weeklyData: [90, 92, 88, 89, 87, 85, 90, 92]
    },
    {
        id: 3,
        code: "CS-103",
        name: "Pemrograman Web",
        students: 28,
        attendanceRate: 85,
        absentRate: 10,
        leaveRate: 5,
        weeklyData: [88, 85, 87, 82, 83, 86, 84, 85]
    },
    {
        id: 4,
        code: "CS-104",
        name: "Kecerdasan Buatan",
        students: 32,
        attendanceRate: 88,
        absentRate: 8,
        leaveRate: 4,
        weeklyData: [90, 87, 88, 89, 86, 87, 90, 89]
    }
];

const CourseAttendanceStats = () => {
    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: "ease-in-out",
            once: true,
        });
    }, []);

    // Chart options
    const barChartOptions = {
        chart: {
            type: 'bar',
            height: 150,
            toolbar: {
                show: false
            },
            foreColor: "#697a8d"
        },
        plotOptions: {
            bar: {
                columnWidth: '55%',
                borderRadius: 4,
            },
        },
        colors: ['#4F46E5'],
        dataLabels: {
            enabled: false
        },
        grid: {
            show: false
        },
        xaxis: {
            categories: ['1', '2', '3', '4', '5', '6', '7', '8'],
            labels: {
                show: false
            },
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false
            }
        },
        yaxis: {
            labels: {
                show: false
            }
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return val + "%"
                }
            }
        }
    };

    return (
        <div className="mt-3">
            <div className="mb-5" data-aos="fade-down">
                <h1 className="text-3xl font-bold text-navy-700 dark:text-white">
                    Statistik Mata Kuliah
                </h1>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Statistik kehadiran untuk setiap mata kuliah yang Anda ampu
                </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 mb-5">
                <Card extra="p-4" data-aos="fade-up">
                    <div className="mb-4 flex items-center justify-between">
                        <h4 className="text-lg font-bold text-navy-700 dark:text-white flex items-center">
                            <MdBook className="mr-2 h-5 w-5" /> Ringkasan Mata Kuliah
                        </h4>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[500px]">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500">Kode</th>
                                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500">Mata Kuliah</th>
                                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500">Mahasiswa</th>
                                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500">Kehadiran</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courses.map((course) => (
                                    <tr key={course.id} className="border-b border-gray-200">
                                        <td className="py-3 px-4 text-sm font-medium text-gray-900">{course.code}</td>
                                        <td className="py-3 px-4 text-sm text-gray-500">{course.name}</td>
                                        <td className="py-3 px-4 text-sm text-gray-500">{course.students} mahasiswa</td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center">
                                                <div className="w-full max-w-[100px]">
                                                    <div className="h-2 w-full bg-gray-200 rounded-full">
                                                        <div
                                                            className={`h-2 rounded-full ${course.attendanceRate >= 90
                                                                    ? "bg-green-500"
                                                                    : course.attendanceRate >= 80
                                                                        ? "bg-yellow-500"
                                                                        : "bg-red-500"
                                                                }`}
                                                            style={{ width: `${course.attendanceRate}%` }}
                                                        />
                                                    </div>
                                                </div>
                                                <span className="ml-3 text-sm font-medium text-gray-900">
                                                    {course.attendanceRate}%
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                <Card extra="p-4" data-aos="fade-up" data-aos-delay="100">
                    <div className="mb-4 flex items-center justify-between">
                        <h4 className="text-lg font-bold text-navy-700 dark:text-white flex items-center">
                            <MdPeople className="mr-2 h-5 w-5" /> Tingkat Kehadiran
                        </h4>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="flex flex-col items-center p-4 bg-green-50 rounded-lg border border-green-100">
                            <p className="text-2xl font-bold text-green-700">88.5%</p>
                            <p className="text-xs text-gray-500">Hadir</p>
                        </div>
                        <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg border border-blue-100">
                            <p className="text-2xl font-bold text-blue-700">7.5%</p>
                            <p className="text-xs text-gray-500">Izin/Sakit</p>
                        </div>
                        <div className="flex flex-col items-center p-4 bg-red-50 rounded-lg border border-red-100">
                            <p className="text-2xl font-bold text-red-700">4.0%</p>
                            <p className="text-xs text-gray-500">Tidak Hadir</p>
                        </div>
                    </div>
                    <div className="h-48">
                        <Chart
                            options={{
                                ...barChartOptions,
                                xaxis: {
                                    ...barChartOptions.xaxis,
                                    categories: ['Algoritma', 'Basis Data', 'Pemrograman Web', 'Kecerdasan Buatan']
                                },
                                plotOptions: {
                                    bar: {
                                        ...barChartOptions.plotOptions.bar,
                                        columnWidth: '40%'
                                    }
                                }
                            }}
                            series={[{
                                name: 'Tingkat Kehadiran',
                                data: courses.map(course => course.attendanceRate)
                            }]}
                            type="bar"
                            height="100%"
                        />
                    </div>
                </Card>
            </div>

            <div className="space-y-5 mb-5">
                {courses.map((course, index) => (
                    <Card
                        key={course.id}
                        extra="p-4"
                        data-aos="fade-up"
                        data-aos-delay={(index + 1) * 100}
                    >
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                            <div>
                                <h4 className="text-lg font-bold text-navy-700 dark:text-white flex items-center">
                                    <MdClass className="mr-2 h-5 w-5" /> {course.code} - {course.name}
                                </h4>
                                <p className="text-sm text-gray-500">
                                    <span className="font-medium">{course.students}</span> mahasiswa terdaftar
                                </p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="flex flex-col items-center">
                                    <p className="text-xl font-bold text-green-600">{course.attendanceRate}%</p>
                                    <p className="text-xs text-gray-500">Hadir</p>
                                </div>
                                <div className="flex flex-col items-center">
                                    <p className="text-xl font-bold text-blue-600">{course.leaveRate}%</p>
                                    <p className="text-xs text-gray-500">Izin</p>
                                </div>
                                <div className="flex flex-col items-center">
                                    <p className="text-xl font-bold text-red-600">{course.absentRate}%</p>
                                    <p className="text-xs text-gray-500">Tidak Hadir</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                                <span>Tren Kehadiran (8 Minggu Terakhir)</span>
                            </div>
                            <div className="h-24">
                                <Chart
                                    options={barChartOptions}
                                    series={[{
                                        name: 'Tingkat Kehadiran',
                                        data: course.weeklyData
                                    }]}
                                    type="bar"
                                    height="100%"
                                />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default CourseAttendanceStats;
