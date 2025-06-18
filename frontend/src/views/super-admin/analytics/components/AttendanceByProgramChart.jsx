import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const AttendanceByProgramChart = ({ data: propData = [] }) => {
    // Use prop data if available, otherwise fallback to dummy data
    const fallbackData = {
        labels: ['Teknik Informatika', 'Sistem Informasi', 'Ilmu Komputer', 'Teknik Elektro', 'Teknik Telekomunikasi'],
        values: [92, 85, 88, 82, 79]
    };

    const chartLabels = propData.length > 0
        ? propData.map(item => item.program)
        : fallbackData.labels;

    const chartValues = propData.length > 0
        ? propData.map(item => item.attendance)
        : fallbackData.values;

    const data = {
        labels: chartLabels,
        datasets: [
            {
                data: chartValues,
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)', // blue
                    'rgba(16, 185, 129, 0.8)', // green
                    'rgba(139, 92, 246, 0.8)', // purple
                    'rgba(249, 115, 22, 0.8)', // orange
                    'rgba(236, 72, 153, 0.8)', // pink
                ],
                borderColor: [
                    'rgba(59, 130, 246, 1)',
                    'rgba(16, 185, 129, 1)',
                    'rgba(139, 92, 246, 1)',
                    'rgba(249, 115, 22, 1)',
                    'rgba(236, 72, 153, 1)',
                ],
                borderWidth: 1,
                hoverOffset: 15,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    boxWidth: 12,
                    padding: 15,
                    font: {
                        size: 11
                    }
                }
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed !== null) {
                            label += context.parsed + '% kehadiran';
                        }
                        return label;
                    }
                }
            }
        },
        layout: {
            padding: {
                left: 10,
                right: 10,
                top: 0,
                bottom: 10
            }
        },
        cutout: '50%',
    };

    return (
        <div className="h-full flex items-center justify-center">
            <div className="w-full h-full">
                <Pie data={data} options={options} />
            </div>
            <div className="absolute text-center">
                <p className="text-3xl font-bold text-gray-700">87.5%</p>
                <p className="text-sm text-gray-500">Rata-rata</p>
            </div>
        </div>
    );
};

export default AttendanceByProgramChart;
