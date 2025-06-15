import React from "react";
import { MdTrendingUp, MdTrendingDown } from "react-icons/md";

const AttendanceStats = ({ data }) => {
    const weeklyData = [
        { day: 'Sen', attended: 4, total: 4 },
        { day: 'Sel', attended: 3, total: 4 },
        { day: 'Rab', attended: 4, total: 4 },
        { day: 'Kam', attended: 2, total: 3 },
        { day: 'Jum', attended: 3, total: 3 },
    ];

    return (
        <div className="bg-white rounded-xl shadow-lg p-6" data-aos="fade-up">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Statistik Kehadiran</h3>
                <div className="flex items-center text-green-600">
                    <MdTrendingUp className="h-5 w-5 mr-1" />
                    <span className="text-sm font-medium">+5% dari minggu lalu</span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Kehadiran Keseluruhan</span>
                    <span className="text-sm font-bold text-gray-900">{data.attended}/{data.totalClasses}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                        className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${data.percentage}%` }}
                    ></div>
                </div>
                <p className="text-right text-sm text-gray-600 mt-1">{data.percentage}%</p>
            </div>

            {/* Weekly Chart */}
            <div>
                <h4 className="text-lg font-medium text-gray-800 mb-4">Kehadiran Mingguan</h4>
                <div className="flex items-end justify-between h-32">
                    {weeklyData.map((day, index) => (
                        <div key={index} className="flex flex-col items-center">
                            <div className="relative w-8 bg-gray-200 rounded-t" style={{ height: '100px' }}>
                                <div
                                    className="absolute bottom-0 w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t transition-all duration-500"
                                    style={{ height: `${(day.attended / day.total) * 100}%` }}
                                ></div>
                            </div>
                            <span className="text-xs text-gray-600 mt-2">{day.day}</span>
                            <span className="text-xs font-medium text-gray-800">{day.attended}/{day.total}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div className="flex justify-center space-x-6 mt-6 pt-4 border-t">
                <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">Hadir ({data.attended})</span>
                </div>
                <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">Tidak Hadir ({data.absent})</span>
                </div>
                <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">Terlambat ({data.late})</span>
                </div>
            </div>
        </div>
    );
};

export default AttendanceStats;
