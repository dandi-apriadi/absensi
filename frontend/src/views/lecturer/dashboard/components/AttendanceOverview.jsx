import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Chart from "react-apexcharts";
import Card from "components/card";

// Dummy Data for the charts
const overallAttendanceData = {
    series: [75, 15, 10],
    labels: ["Hadir", "Izin/Sakit", "Tidak Hadir"]
};

const weeklyAttendanceData = {
    series: [{
        name: "Tingkat Kehadiran",
        data: [89, 92, 85, 91, 88, 95, 87, 93]
    }],
    categories: ["Minggu 1", "Minggu 2", "Minggu 3", "Minggu 4", "Minggu 5", "Minggu 6", "Minggu 7", "Minggu 8"]
};

const courseComparisonData = {
    series: [
        { name: "Hadir", data: [85, 92, 78, 89] },
        { name: "Izin/Sakit", data: [10, 5, 12, 7] },
        { name: "Tidak Hadir", data: [5, 3, 10, 4] }
    ],
    categories: ["Algoritma", "Basis Data", "Web", "Kecerdasan Buatan"]
};

const AttendanceOverview = () => {
    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: "ease-in-out",
            once: true,
        });
    }, []);

    // Chart Options
    const pieChartOptions = {
        labels: overallAttendanceData.labels,
        colors: ["#4CAF50", "#2196F3", "#F44336"],
        chart: {
            foreColor: "#697a8d"
        },
        legend: {
            position: "bottom"
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 280
                },
                legend: {
                    position: "bottom"
                }
            }
        }]
    };

    const lineChartOptions = {
        chart: {
            height: 350,
            type: "line",
            foreColor: "#697a8d",
            toolbar: {
                show: false
            }
        },
        colors: ["#3F51B5"],
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: "smooth",
            width: 3
        },
        grid: {
            borderColor: "#e0e6ed",
            strokeDashArray: 5,
            xaxis: {
                lines: {
                    show: true
                }
            },
            yaxis: {
                lines: {
                    show: true
                }
            }
        },
        xaxis: {
            categories: weeklyAttendanceData.categories
        },
        yaxis: {
            min: 0,
            max: 100,
            title: {
                text: "Persentase (%)"
            }
        },
        tooltip: {
            y: {
                formatter: function (value) {
                    return value + "%";
                }
            }
        }
    };

    const barChartOptions = {
        chart: {
            type: 'bar',
            height: 350,
            stacked: true,
            foreColor: "#697a8d",
            toolbar: {
                show: false
            }
        },
        colors: ["#4CAF50", "#2196F3", "#F44336"],
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '60%',
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
            categories: courseComparisonData.categories,
        },
        yaxis: {
            title: {
                text: 'Persentase (%)'
            },
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
            position: 'bottom'
        }
    };

    return (
        <div className="mt-3">
            <div className="mb-5" data-aos="fade-down">
                <h1 className="text-3xl font-bold text-navy-700 dark:text-white">
                    Overview Absensi
                </h1>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Statistik kehadiran mahasiswa di semua mata kuliah Anda
                </p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4 mb-5" data-aos="fade-up">
                <Card extra="!flex p-5">
                    <div className="flex items-center">
                        <div className="rounded-full bg-green-100 p-3">
                            <span className="flex items-center justify-center rounded-full bg-green-500 text-white h-6 w-6">
                                75%
                            </span>
                        </div>
                        <div className="ml-4">
                            <p className="text-xs text-gray-600">Rata-rata Kehadiran</p>
                            <p className="text-lg font-bold text-navy-700 dark:text-white">
                                75%
                            </p>
                        </div>
                    </div>
                </Card>

                <Card extra="!flex p-5">
                    <div className="flex items-center">
                        <div className="rounded-full bg-blue-100 p-3">
                            <span className="flex items-center justify-center rounded-full bg-blue-500 text-white h-6 w-6">
                                15%
                            </span>
                        </div>
                        <div className="ml-4">
                            <p className="text-xs text-gray-600">Izin/Sakit</p>
                            <p className="text-lg font-bold text-navy-700 dark:text-white">
                                15%
                            </p>
                        </div>
                    </div>
                </Card>

                <Card extra="!flex p-5">
                    <div className="flex items-center">
                        <div className="rounded-full bg-red-100 p-3">
                            <span className="flex items-center justify-center rounded-full bg-red-500 text-white h-6 w-6">
                                10%
                            </span>
                        </div>
                        <div className="ml-4">
                            <p className="text-xs text-gray-600">Tidak Hadir</p>
                            <p className="text-lg font-bold text-navy-700 dark:text-white">
                                10%
                            </p>
                        </div>
                    </div>
                </Card>

                <Card extra="!flex p-5">
                    <div className="flex items-center">
                        <div className="rounded-full bg-purple-100 p-3">
                            <span className="flex items-center justify-center rounded-full bg-purple-500 text-white h-6 w-6">
                                8
                            </span>
                        </div>
                        <div className="ml-4">
                            <p className="text-xs text-gray-600">Total Pertemuan</p>
                            <p className="text-lg font-bold text-navy-700 dark:text-white">
                                32 Pertemuan
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2 mb-5">
                <Card extra="p-4" data-aos="fade-right">
                    <div className="mb-4">
                        <h4 className="text-lg font-bold text-navy-700 dark:text-white">
                            Distribusi Status Kehadiran
                        </h4>
                    </div>
                    <div className="flex justify-center">
                        <div className="h-64 w-full max-w-sm">
                            <Chart
                                options={pieChartOptions}
                                series={overallAttendanceData.series}
                                type="pie"
                                height="100%"
                            />
                        </div>
                    </div>
                </Card>

                <Card extra="p-4" data-aos="fade-left">
                    <div className="mb-4">
                        <h4 className="text-lg font-bold text-navy-700 dark:text-white">
                            Tingkat Kehadiran per Minggu
                        </h4>
                    </div>
                    <div className="h-64">
                        <Chart
                            options={lineChartOptions}
                            series={weeklyAttendanceData.series}
                            type="line"
                            height="100%"
                        />
                    </div>
                </Card>
            </div>

            <Card extra="p-4 mb-5" data-aos="fade-up">
                <div className="mb-4">
                    <h4 className="text-lg font-bold text-navy-700 dark:text-white">
                        Perbandingan Kehadiran antar Mata Kuliah
                    </h4>
                </div>
                <div className="h-72">
                    <Chart
                        options={barChartOptions}
                        series={courseComparisonData.series}
                        type="bar"
                        height="100%"
                    />
                </div>
            </Card>
        </div>
    );
};

export default AttendanceOverview;
