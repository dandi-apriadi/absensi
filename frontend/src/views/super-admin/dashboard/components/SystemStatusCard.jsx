import React from "react";

const SystemStatusCard = ({ name, status, uptime, load }) => {
    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case "online":
                return "bg-green-100 text-green-800";
            case "warning":
                return "bg-yellow-100 text-yellow-800";
            case "offline":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getLoadColor = (load) => {
        const loadValue = parseInt(load);
        if (loadValue < 50) return "bg-green-500";
        if (loadValue < 80) return "bg-yellow-500";
        return "bg-red-500";
    };

    return (
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0">
            <div>
                <h4 className="font-medium text-sm text-gray-800">{name}</h4>
                <div className="flex items-center mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(status)}`}>
                        {status}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">Uptime: {uptime}</span>
                </div>
            </div>
            <div className="flex items-center">
                <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className={`h-full ${getLoadColor(load)}`}
                        style={{ width: load }}
                    ></div>
                </div>
                <span className="text-xs text-gray-600 ml-2">{load}</span>
            </div>
        </div>
    );
};

export default SystemStatusCard;
