import React from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const DailyAttendanceChart = () => {
    // Dummy data for daily attendance over 30 days
    const labels = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - 30 + i + 1);
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    });

    const data = {
        labels,
        datasets: [
            {
                label: "Hadir",
                data: [420, 430, 448, 470, 453, 450, 462, 120, 30, 425, 435, 455, 465, 450, 440, 435, 455, 447, 460, 465, 475, 485, 430, 440, 450, 100, 15, 435, 445, 455],
                borderColor: "rgba(34, 197, 94, 1)",
                backgroundColor: "rgba(34, 197, 94, 0.1)",
                tension: 0.4,
                fill: true,
                pointRadius: 2,
                pointHoverRadius: 4,
            },
            {
                label: "Terlambat",
                data: [50, 45, 40, 35, 42, 38, 35, 15, 5, 40, 42, 38, 40, 45, 40, 48, 42, 38, 35, 38, 40, 35, 42, 40, 45, 20, 3, 42, 40, 38],
                borderColor: "rgba(234, 179, 8, 1)",
                backgroundColor: "rgba(234, 179, 8, 0.1)",
                tension: 0.4,
                fill: true,
                pointRadius: 2,
                pointHoverRadius: 4,
            },
            {
                label: "Tidak Hadir",
                data: [30, 25, 12, 20, 25, 32, 23, 5, 2, 35, 23, 27, 20, 25, 40, 22, 28, 35, 30, 22, 15, 10, 28, 30, 25, 10, 2, 23, 30, 27],
                borderColor: "rgba(239, 68, 68, 1)",
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                tension: 0.4,
                fill: true,
                pointRadius: 2,
                pointHoverRadius: 4,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += context.parsed.y + ' mahasiswa';
                        }
                        return label;
                    }
                }
            }
        },
        interaction: {
            mode: 'index',
            intersect: false,
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    display: true,
                    color: "rgba(0, 0, 0, 0.05)",
                },
                ticks: {
                    precision: 0
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    maxRotation: 45,
                    minRotation: 45
                }
            }
        },
    };

    return <Line data={data} options={options} />;
};

export default DailyAttendanceChart;
