import React, { useEffect, useState } from "react";
import { MdBackup, MdRestore, MdDownload, MdUpload, MdWarning, MdCheckCircle, MdSchedule, MdCalendarToday, MdStorage } from "react-icons/md";
import AOS from "aos";
import "aos/dist/aos.css";

const BackupRestore = () => {
    const [backupList, setBackupList] = useState([]);
    const [isBackingUp, setIsBackingUp] = useState(false);
    const [isRestoring, setIsRestoring] = useState(false);
    const [restoreSource, setRestoreSource] = useState(null);
    const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);

    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
        });

        // Simulate fetching backup data
        loadBackups();
    }, []);

    const loadBackups = () => {
        // Dummy backup data
        const dummyBackups = [
            { id: 1, name: "Full Backup - 15 May 2025", date: "2025-05-15T08:00:00", size: "1.24 GB", type: "Full", status: "Completed" },
            { id: 2, name: "Incremental Backup - 14 May 2025", date: "2025-05-14T08:00:00", size: "250 MB", type: "Incremental", status: "Completed" },
            { id: 3, name: "Incremental Backup - 13 May 2025", date: "2025-05-13T08:00:00", size: "220 MB", type: "Incremental", status: "Completed" },
            { id: 4, name: "Incremental Backup - 12 May 2025", date: "2025-05-12T08:00:00", size: "215 MB", type: "Incremental", status: "Completed" },
            { id: 5, name: "Full Backup - 11 May 2025", date: "2025-05-11T08:00:00", size: "1.21 GB", type: "Full", status: "Completed" }
        ];

        setBackupList(dummyBackups);
    };

    const handleBackup = () => {
        setIsBackingUp(true);

        // Simulate backup process
        setTimeout(() => {
            setIsBackingUp(false);
            loadBackups(); // Refresh the list

            // Show notification (would be replaced with a proper notification system)
            alert("Backup created successfully!");
        }, 2000);
    };

    const initiateRestore = (backup) => {
        setRestoreSource(backup);
        setShowRestoreConfirm(true);
    };

    const confirmRestore = () => {
        setShowRestoreConfirm(false);
        setIsRestoring(true);

        // Simulate restore process
        setTimeout(() => {
            setIsRestoring(false);

            // Show notification (would be replaced with a proper notification system)
            alert("System restored successfully! You should log in again.");
        }, 3000);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    return (
        <div className="p-4 md:p-8">
            <div className="mb-8" data-aos="fade-down">
                <h1 className="text-3xl font-bold text-gray-800">Backup & Restore</h1>
                <p className="text-gray-600">Kelola backup dan restore data sistem</p>
            </div>

            {/* Warning Banner */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 rounded-md" data-aos="fade-up">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        <MdWarning className="h-6 w-6 text-yellow-500" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">Perhatian: Operasi Sensitif</h3>
                        <div className="mt-2 text-sm text-yellow-700">
                            <p>
                                Operasi backup dan restore melibatkan data sensitif sistem. Pastikan Anda memiliki izin yang memadai dan berhati-hati saat melakukan operasi ini.
                                Restore sistem dapat menyebabkan penghapusan data yang ada.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Panel: Backup Controls */}
                <div className="lg:col-span-1" data-aos="fade-up" data-aos-delay="100">
                    <div className="bg-white rounded-xl shadow-md p-6 h-full">
                        <h2 className="text-lg font-semibold text-gray-800 mb-6">Create Backup</h2>

                        <div className="space-y-6">
                            <div>
                                <label htmlFor="backup-type" className="block text-sm font-medium text-gray-700 mb-1">Backup Type</label>
                                <select
                                    id="backup-type"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="full">Full Backup</option>
                                    <option value="incremental">Incremental Backup</option>
                                    <option value="database-only">Database Only</option>
                                    <option value="config-only">Configuration Only</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Include Components</label>
                                <div className="space-y-2">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="include-database"
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            defaultChecked
                                        />
                                        <label htmlFor="include-database" className="ml-2 text-sm text-gray-700">Database</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="include-face-datasets"
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            defaultChecked
                                        />
                                        <label htmlFor="include-face-datasets" className="ml-2 text-sm text-gray-700">Face Datasets</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="include-configs"
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            defaultChecked
                                        />
                                        <label htmlFor="include-configs" className="ml-2 text-sm text-gray-700">System Configuration</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="include-logs"
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="include-logs" className="ml-2 text-sm text-gray-700">System Logs</label>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="backup-destination" className="block text-sm font-medium text-gray-700 mb-1">Backup Destination</label>
                                <select
                                    id="backup-destination"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="local">Local Storage</option>
                                    <option value="cloud">Cloud Storage (S3)</option>
                                    <option value="external">External Drive</option>
                                </select>
                            </div>

                            <button
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
                                onClick={handleBackup}
                                disabled={isBackingUp}
                            >
                                {isBackingUp ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                        </svg>
                                        Creating Backup...
                                    </>
                                ) : (
                                    <>
                                        <MdBackup className="mr-2" /> Create Backup Now
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="mt-8">
                            <h3 className="text-md font-medium text-gray-800 mb-4">Scheduled Backups</h3>
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-sm font-medium text-gray-700">Daily Backup</span>
                                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-500 mb-2">
                                    <MdSchedule className="mr-2 h-5 w-5 text-gray-400" />
                                    <span>Every day at 03:00 AM</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                    <MdStorage className="mr-2 h-5 w-5 text-gray-400" />
                                    <span>Retention: 7 days</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Backup List */}
                <div className="lg:col-span-2" data-aos="fade-up" data-aos-delay="200">
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-6">Available Backups</h2>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Backup Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {backupList.map((backup) => (
                                        <tr key={backup.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm font-medium text-gray-900">{backup.name}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(backup.date)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${backup.type === "Full" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                                                    }`}>
                                                    {backup.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {backup.size}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                    {backup.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                <button
                                                    className="text-blue-600 hover:text-blue-900"
                                                    onClick={() => initiateRestore(backup)}
                                                    disabled={isRestoring}
                                                >
                                                    <MdRestore className="h-5 w-5" />
                                                </button>
                                                <button className="text-green-600 hover:text-green-900">
                                                    <MdDownload className="h-5 w-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {backupList.length === 0 && (
                            <div className="text-center py-6">
                                <p className="text-gray-500">No backups available</p>
                            </div>
                        )}

                        <div className="mt-8">
                            <h3 className="text-md font-medium text-gray-800 mb-4">Restore from File</h3>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                                <MdUpload className="mx-auto h-12 w-12 text-gray-400" />
                                <p className="mt-2 text-sm text-gray-600">
                                    Drag and drop a backup file here, or
                                </p>
                                <input
                                    type="file"
                                    id="file-upload"
                                    className="hidden"
                                />
                                <label
                                    htmlFor="file-upload"
                                    className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 cursor-pointer"
                                >
                                    Select File
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Restore Confirmation Modal */}
            {showRestoreConfirm && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full">
                        <div className="text-center mb-4">
                            <MdWarning className="h-12 w-12 text-yellow-500 mx-auto" />
                            <h3 className="text-lg font-medium text-gray-900 mt-2">Confirm Restore</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-6">
                            You are about to restore your system to: <strong>{restoreSource?.name}</strong>. This operation will replace all current data with the data from this backup. This action cannot be undone.
                        </p>
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <MdWarning className="h-5 w-5 text-yellow-400" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-yellow-700">
                                        Current data will be lost. Users may be logged out during this process.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                                onClick={() => setShowRestoreConfirm(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                                onClick={confirmRestore}
                            >
                                Yes, Restore System
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Loading Overlay for Restore */}
            {isRestoring && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full text-center">
                        <svg className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900">Restoring System</h3>
                        <p className="mt-2 text-sm text-gray-600">
                            Please wait while the system is being restored. This may take several minutes.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BackupRestore;
