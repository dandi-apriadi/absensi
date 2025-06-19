import React from "react";
import Card from "components/card";
import {
    MdBarChart,
    MdPeople,
    MdClass,
    MdAssignment,
    MdWarning,
    MdTrendingUp,
    MdTrendingDown,
} from "react-icons/md";

const StatisticsCard = ({ title, value, icon, color, trend, delay }) => {
    const getIcon = (iconName) => {
        const icons = {
            courses: MdClass,
            students: MdPeople,
            attendance: MdBarChart,
            sessions: MdAssignment,
            warning: MdWarning,
        };
        return icons[iconName] || MdClass;
    };

    const getColorClasses = (colorName) => {
        const colors = {
            blue: { bg: "bg-blue-100", text: "text-blue-600" },
            green: { bg: "bg-green-100", text: "text-green-600" },
            purple: { bg: "bg-purple-100", text: "text-purple-600" },
            orange: { bg: "bg-orange-100", text: "text-orange-600" },
            red: { bg: "bg-red-100", text: "text-red-600" },
        };
        return colors[colorName] || colors.blue;
    };

    const IconComponent = getIcon(icon);
    const colorClasses = getColorClasses(color);

    return (
        <Card
            extra="!flex flex-col items-center p-5"
            data-aos="fade-up"
            data-aos-delay={delay}
        >
            <div className={`flex h-16 w-16 items-center justify-center rounded-full ${colorClasses.bg}`}>
                <IconComponent className={`h-8 w-8 ${colorClasses.text}`} />
            </div>
            <p className="mt-4 text-xl font-bold text-navy-700 dark:text-white">{value}</p>
            <p className="mt-1 text-sm text-gray-600 text-center">{title}</p>
            {trend && (
                <div className={`mt-2 flex items-center text-sm ${trend === "up" ? "text-green-600" : "text-red-600"
                    }`}>
                    {trend === "up" ? (
                        <MdTrendingUp className="mr-1 h-3 w-3" />
                    ) : (
                        <MdTrendingDown className="mr-1 h-3 w-3" />
                    )}
                    <span>{trend === "up" ? "Naik" : "Turun"}</span>
                </div>
            )}
        </Card>
    );
};

export default StatisticsCard;
