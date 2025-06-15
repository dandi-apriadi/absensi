import React, { useEffect, useState } from "react";
import { MdWarning, MdRestartAlt, MdDelete, MdBackup, MdRefresh, MdLock, MdShield } from "react-icons/md";
import AOS from "aos";
import "aos/dist/aos.css";

const SystemReset = () => {
    const [confirmReset, setConfirmReset] = useState(false);
    const [resetType, setResetType] = useState("");
    const [confirmText, setConfirmText] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [resultSuccess, setResultSuccess] = useState(false);

    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
        });
    }, []);

    const resetOptions = [
        {
            id: "soft-reset",
            name: "Soft Reset",
            description: "Restart all services without affecting data. Application downtime: ~2 minutes.",
            dangerLevel: "low",
            requiresPassword: true,
            backupRecommended: false
        },
        {
            id: "config-reset",
            name: "Configuration Reset",
            description: "Reset all system configurations to defaults while preserving attendance and user data.",
            dangerLevel: "medium",
            requiresPassword: true,
            backupRecommended: true
        },
        {
            id: "database-reset",
            name: "Database Reset",
            description: "Clear all attendance records while preserving user accounts and face datasets.",
            dangerLevel: "high",
            requiresPassword: true,
            backupRecommended: true
        },
        {
            id: "factory-reset",
            name: "Factory Reset",
            description: "Reset entire system to factory defaults. ALL DATA WILL BE LOST.",
            dangerLevel: "critical",
            requiresPassword: true,
            backupRecommended: true
        }
    ];

    const handleResetClick = (type) => {
        setResetType(type);
        setConfirmText("");
        setConfirmPassword("");
        setConfirmReset(true);
    };

    const handleConfirmReset = () => {
        setIsProcessing(true);

        // Simulate reset process
        setTimeout(() => {
            setIsProcessing(false);
            setConfirmReset(false);
            setShowResult(true);

            // For demo purposes, always show success
            setResultSuccess(true);

            // Clear result message after a while
            setTimeout(() => {
                setShowResult(false);
            }, 5000);
        }, 3000);
    };

    const getDangerLevelStyle = (level) => {
        switch (level) {
            case "low":
                return "bg-blue-100 text-blue-800 border-blue-200";
            case "medium":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "high":
                return "bg-orange-100 text-orange-800 border-orange-200";
            case "critical":
                return "bg-red-100 text-red-800 border-red-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    return (
        <div className="p-4 md:p-8">
            <div className="mb-8" data-aos="fade-down">
                <h1 className="text-3xl font-bold text-gray-800">System Reset</h1>
                <p className="text-gray-600">Reset options for system maintenance and troubleshooting</p>
            </div>

            {/* Warning Banner */}
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r-lg" data-aos="fade-up">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        <MdWarning className="h-6 w-6 text-red-500" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">CAUTION: System Reset Operations</h3>
                        <div className="mt-2 text-sm text-red-700">
                            <p>
                                Reset operations can potentially cause data loss and system downtime. Always create a backup before proceeding with any reset operation. These actions should only be performed by authorized system administrators.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reset Options */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8" data-aos="fade-up" data-aos-delay="100">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <MdRestartAlt className="mr-2 h-5 w-5 text-gray-600" /> Reset Options
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {resetOptions.map((option) => (
                        <div
                            key={option.id}
                            className={`border rounded-lg p-4 ${getDangerLevelStyle(option.dangerLevel)}`}
                        >
                            <div className="flex justify-between items-start">
                                <h3 className="text-md font-medium">{option.name}</h3>
                                <span className={`text-xs uppercase font-bold px-2 py-1 rounded-full ${option.dangerLevel === "low" ? "bg-blue-200 text-blue-800" :
                                        option.dangerLevel === "medium" ? "bg-yellow-200 text-yellow-800" :
                                            option.dangerLevel === "high" ? "bg-orange-200 text-orange-800" :
                                                "bg-red-200 text-red-800"
                                    }`}>
                                    {option.dangerLevel}
                                </span>
                            </div>
                            <p className="text-sm mt-2 mb-4">{option.description}</p>
                            {option.backupRecommended && (
                                <div className="flex items-center text-xs mb-4">
                                    <MdBackup className="mr-1 h-4 w-4" />
                                    <span>Backup recommended before proceeding</span>
                                </div>
                            )}
                            <button
                                onClick={() => handleResetClick(option.id)}
                                className={`w-full py-2 rounded-lg text-white ${option.dangerLevel === "low" ? "bg-blue-500 hover:bg-blue-600" :
                                        option.dangerLevel === "medium" ? "bg-yellow-500 hover:bg-yellow-600" :
                                            option.dangerLevel === "high" ? "bg-orange-500 hover:bg-orange-600" :
                                                "bg-red-500 hover:bg-red-600"
                                    } transition-colors`}
                            >
                                {option.dangerLevel === "critical" ? "Factory Reset" : "Reset"}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Backup Recommendation */}
            <div className="bg-white rounded-xl shadow-md p-6" data-aos="fade-up" data-aos-delay="200">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <MdShield className="mr-2 h-5 w-5 text-gray-600" /> Before You Reset
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                        <h3 className="text-md font-medium text-blue-800 mb-2">Create a System Backup</h3>
                        <p className="text-sm text-blue-700 mb-4">
                            It's highly recommended to create a complete system backup before performing any reset operation. This ensures you can recover your data if needed.
                        </p>
                        <button
                            className="w-full py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                        >
                            Go to Backup & Restore
                        </button>
                    </div>

                    <div className="border border-indigo-200 rounded-lg p-4 bg-indigo-50">
                        <h3 className="text-md font-medium text-indigo-800 mb-2">System Health Check</h3>
                        <p className="text-sm text-indigo-700 mb-4">
                            Run a full system health check to identify issues before resetting. Many problems can be fixed without a full reset.
                        </p>
                        <button
                            className="w-full py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-colors"
                        >
                            Run System Health Check
                        </button>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {confirmReset && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" data-aos="zoom-in">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <div className="text-center mb-4">
                            <MdWarning className={`h-16 w-16 mx-auto ${resetOptions.find(opt => opt.id === resetType)?.dangerLevel === "critical" ? "text-red-500" :
                                    resetOptions.find(opt => opt.id === resetType)?.dangerLevel === "high" ? "text-orange-500" :
                                        resetOptions.find(opt => opt.id === resetType)?.dangerLevel === "medium" ? "text-yellow-500" :
                                            "text-blue-500"
                                }`} />
                            <h3 className="text-xl font-bold mt-2">Confirm {resetOptions.find(opt => opt.id === resetType)?.name}</h3>
                        </div>

                        <p className="text-sm text-gray-600 mb-4">
                            You are about to perform a {resetOptions.find(opt => opt.id === resetType)?.name.toLowerCase()}.
                            {resetOptions.find(opt => opt.id === resetType)?.dangerLevel === "critical" &&
                                " This will permanently delete ALL system data and cannot be undone."}
                        </p>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Type "{resetOptions.find(opt => opt.id === resetType)?.name}" to confirm
                            </label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                                value={confirmText}
                                onChange={(e) => setConfirmText(e.target.value)}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Enter your admin password
                            </label>
                            <div className="relative">
                                <input
                                    type="password"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <MdLock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
                                onClick={() => setConfirmReset(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className={`px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center ${isProcessing || confirmText !== resetOptions.find(opt => opt.id === resetType)?.name || !confirmPassword
                                        ? 'opacity-50 cursor-not-allowed'
                                        : ''
                                    }`}
                                disabled={isProcessing || confirmText !== resetOptions.find(opt => opt.id === resetType)?.name || !confirmPassword}
                                onClick={handleConfirmReset}
                            >
                                {isProcessing ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                        </svg>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <MdRestartAlt className="mr-1" />
                                        Confirm Reset
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Result Notification */}
            {showResult && (
                <div className={`fixed bottom-4 right-4 ${resultSuccess ? 'bg-green-600' : 'bg-red-600'} text-white px-6 py-3 rounded-lg shadow-lg flex items-center`} data-aos="fade-left">
                    {resultSuccess ? (
                        <MdRefresh className="h-5 w-5 mr-2" />
                    ) : (
                        <MdWarning className="h-5 w-5 mr-2" />
                    )}
                    <p>{resultSuccess ? 'System reset completed successfully!' : 'System reset failed. Please try again.'}</p>
                </div>
            )}
        </div>
    );
};

export default SystemReset;
