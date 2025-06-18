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

const TopPerformingStudentsChart = ({ data: propData = [] }) => {
    // Use prop data if available, otherwise fallback to dummy data
    const fallbackData = {
        labels: ["Ahmad F.", "Siti N.", "Budi S.", "Dewi L.", "Rizki M.", "Indah P.", "Andi S."],
        values: [100, 98.5, 98.2, 97.8, 97.5, 97.0, 96.8]
    };

    const chartLabels = propData.length > 0
        ? propData.map(student => student.name.split(' ').slice(0, 2).join(' '))
        : fallbackData.labels;

    const chartValues = propData.length > 0
        ? propData.map(student => student.attendance)
        : fallbackData.values;

    const data = {
        labels: chartLabels,
        datasets: [
            {
                label: "% Kehadiran",
                data: chartValues,
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
