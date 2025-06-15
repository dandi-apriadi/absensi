import React from "react";
import { MdTrendingUp, MdTrendingDown } from "react-icons/md";

const colorVariants = {
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
    purple: "bg-purple-100 text-purple-800",
    red: "bg-red-100 text-red-800",
};

const StatisticsCard = ({ title, value, icon, trend, color = "blue" }) => {
    const isPositive = trend && trend.startsWith('+');

    return (
        <div className="bg-white rounded-xl shadow-md p-5 h-full">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
                    {trend && (
                        <p className={`mt-1 text-xs font-medium inline-flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                            {isPositive ? <MdTrendingUp className="mr-1" /> : <MdTrendingDown className="mr-1" />}
                            {trend} <span className="text-gray-500 ml-1">dari bulan lalu</span>
                        </p>
                    )}
                </div>
                <div className={`p-2 rounded-lg ${colorVariants[color]}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
};

export default StatisticsCard;
