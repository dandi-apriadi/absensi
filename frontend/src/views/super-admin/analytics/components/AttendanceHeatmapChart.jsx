import React from "react";

const AttendanceHeatmapChart = ({ data: propData = null }) => {
    const defaultDays = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const defaultTimeSlots = ["08:00", "09:30", "11:00", "13:00", "14:30", "16:00"];

    // Use prop data if available, otherwise generate dummy data
    const days = propData?.labels || defaultDays;
    const timeSlots = propData?.datasets?.map(d => d.time) || defaultTimeSlots;

    // Generate dummy data for the heatmap if no prop data
    const generateData = () => {
        const data = [];
        for (let day = 0; day < days.length; day++) {
            const dayData = [];
            for (let slot = 0; slot < timeSlots.length; slot++) {
                // Generate random value between 60 and 95
                const value = Math.floor(Math.random() * 35) + 60;
                dayData.push(value);
            }
            data.push(dayData);
        }
        return data;
    };

    const attendanceData = propData ?
        timeSlots.map((_, slotIndex) =>
            days.map((_, dayIndex) =>
                propData.datasets[slotIndex]?.data[dayIndex] || 0
            )
        ) : generateData();

    // Function to determine color based on value
    const getColor = (value) => {
        if (value >= 90) return "bg-green-500";
        if (value >= 80) return "bg-green-400";
        if (value >= 70) return "bg-yellow-400";
        if (value >= 60) return "bg-yellow-500";
        return "bg-red-500";
    };

    // Function to determine text color based on background color
    const getTextColor = (value) => {
        return value >= 70 ? "text-gray-800" : "text-white";
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full">
                <thead>
                    <tr>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                        {timeSlots.map((slot, index) => (
                            <th key={index} className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {slot}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {days.map((day, dayIndex) => (
                        <tr key={dayIndex}>
                            <td className="px-2 py-2 whitespace-nowrap text-sm font-medium text-gray-800">
                                {day}
                            </td>                            {timeSlots.map((_, slotIndex) => {
                                const value = propData ?
                                    (propData.datasets.find(d => d.time === timeSlots[slotIndex])?.data[dayIndex] || 0) :
                                    attendanceData[dayIndex][slotIndex];
                                return (
                                    <td key={slotIndex} className="px-2 py-2 whitespace-nowrap text-center">
                                        <div
                                            className={`w-16 h-12 flex items-center justify-center rounded-md ${getColor(value)} ${getTextColor(value)}`}
                                        >
                                            <span className="font-medium">{value}%</span>
                                        </div>
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="flex justify-center mt-6">
                <div className="flex items-center space-x-2 text-sm">
                    <span>Rendah</span>
                    <div className="flex space-x-1">
                        <div className="w-5 h-5 bg-red-500 rounded"></div>
                        <div className="w-5 h-5 bg-yellow-500 rounded"></div>
                        <div className="w-5 h-5 bg-yellow-400 rounded"></div>
                        <div className="w-5 h-5 bg-green-400 rounded"></div>
                        <div className="w-5 h-5 bg-green-500 rounded"></div>
                    </div>
                    <span>Tinggi</span>
                </div>
            </div>
        </div>
    );
};

export default AttendanceHeatmapChart;
