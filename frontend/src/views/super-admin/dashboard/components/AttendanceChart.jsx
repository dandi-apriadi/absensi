import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const AttendanceChart = () => {
    const data = {
        labels: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"],
        datasets: [
            {
                label: "Hadir",
                data: [420, 380, 430, 450, 410, 120, 0],
                borderColor: "rgba(34, 197, 94, 0.8)",
                backgroundColor: "rgba(34, 197, 94, 0.2)",
                tension: 0.3,
                fill: true,
            },
            {
                label: "Telat",
                data: [85, 90, 75, 60, 70, 30, 0],
                borderColor: "rgba(249, 115, 22, 0.8)",
                backgroundColor: "rgba(249, 115, 22, 0.2)",
                tension: 0.3,
                fill: true,
            },
            {
                label: "Tidak Hadir",
                data: [120, 150, 125, 100, 130, 40, 0],
                borderColor: "rgba(239, 68, 68, 0.8)",
                backgroundColor: "rgba(239, 68, 68, 0.2)",
                tension: 0.3,
                fill: true,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top",
                labels: {
                    boxWidth: 10,
                    usePointStyle: true,
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: "rgba(0, 0, 0, 0.05)",
                },
            },
            x: {
                grid: {
                    display: false,
                },
            },
        },
    };

    return <Line data={data} options={options} />;
};

export default AttendanceChart;
