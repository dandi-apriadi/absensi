import React from "react";
import { MdWarning, MdError, MdInfo } from "react-icons/md";

const AlertCard = ({ type, message, time }) => {
    const getTypeInfo = () => {
        switch (type) {
            case "warning":
                return {
                    icon: <MdWarning className="h-5 w-5" />,
                    bgColor: "bg-yellow-50",
                    textColor: "text-yellow-800",
                    iconColor: "text-yellow-500",
                };
            case "error":
                return {
                    icon: <MdError className="h-5 w-5" />,
                    bgColor: "bg-red-50",
                    textColor: "text-red-800",
                    iconColor: "text-red-500",
                };
            case "info":
            default:
                return {
                    icon: <MdInfo className="h-5 w-5" />,
                    bgColor: "bg-blue-50",
                    textColor: "text-blue-800",
                    iconColor: "text-blue-500",
                };
        }
    };

    const { icon, bgColor, textColor, iconColor } = getTypeInfo();

    return (
        <div className={`${bgColor} rounded-lg p-3 flex items-start`}>
            <div className={`mt-0.5 mr-3 ${iconColor}`}>{icon}</div>
            <div>
                <p className={`text-sm ${textColor}`}>{message}</p>
                <p className="text-xs text-gray-500 mt-1">{time}</p>
            </div>
        </div>
    );
};

export default AlertCard;
