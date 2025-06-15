import React from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const TopPerformingStudentsChart = () => {
    // Dummy data for top performing students
    const data = {
        labels: ["Ahmad F.", "Siti N.", "Budi S.", "Dewi L.", "Rizki M.", "Indah P.", "Andi S."],
        datasets: [
            {
                label: "% Kehadiran",
                data: [100, 98.5, 98.2, 97.8, 97.5, 97.0, 96.8],
                backgroundColor: "rgba(59, 130, 246, 0.8)",
                borderColor: "rgba(59, 130, 246, 1)",
                borderWidth: 1,
                borderRadius: 5,
                barPercentage: 0.6,
                categoryPercentage: 0.8,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.x !== null) {
                            label += context.parsed.x + '%';
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            x: {
                beginAtZero: false,
                min: 90,
                max: 100,
                grid: {
                    display: true,
                    color: "rgba(0, 0, 0, 0.05)",
                },
                ticks: {
                    stepSize: 2,
                    callback: function (value) {
                        return value + '%';
                    }
                }
            },
            y: {
                grid: {
                    display: false
                }
            }
        },
    };

    return <Bar data={data} options={options} />;
};

export default TopPerformingStudentsChart;
