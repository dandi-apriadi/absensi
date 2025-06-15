import React, { useEffect, useState } from "react";
import { MdUpload, MdDownload, MdDelete, MdSync, MdCheckCircle, MdError, MdWarning, MdPersonAdd, MdAutorenew, MdStorage, MdSecurity, MdCloudUpload, MdPeople, MdFace, MdAccessTime, MdPersonRemove, MdDeviceHub, MdTaskAlt } from "react-icons/md";
import AOS from "aos";
import "aos/dist/aos.css";

const BulkOperations = () => {
    const [activeTab, setActiveTab] = useState('import');
    const [selectedOperation, setSelectedOperation] = useState('students');
    const [file, setFile] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState(null);
    const [previewData, setPreviewData] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        AOS.init();
    }, []);

    const operations = {
        import: [
            { id: 'students', name: 'Import Students', description: 'Add new students to the system' },
            { id: 'lecturers', name: 'Import Lecturers', description: 'Add new lecturers to the system' },
            { id: 'face-dataset', name: 'Import Face Dataset', description: 'Upload face images for recognition' }
        ],
        export: [
            { id: 'students', name: 'Export Students', description: 'Download student data' },
            { id: 'lecturers', name: 'Export Lecturers', description: 'Download lecturer data' },
            { id: 'attendance', name: 'Export Attendance', description: 'Download attendance records' }
        ],
        clean: [
            { id: 'old-attendance', name: 'Clean Old Attendance', description: 'Remove attendance records older than 6 months' },
            { id: 'inactive-students', name: 'Remove Inactive Students', description: 'Permanently delete inactive student records' }
        ],
        sync: [
            { id: 'database', name: 'Sync Database', description: 'Synchronize data with external database' },
            { id: 'face-recognition', name: 'Sync Face Recognition Data', description: 'Update face recognition data' }
        ]
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        setSelectedFile(selectedFile);

        // For demo purposes, show preview for CSV/Excel files
        if (selectedFile && (selectedFile.name.endsWith('.csv') || selectedFile.name.endsWith('.xlsx'))) {
            // Simulate parsing file
            const fakePreview = [
                { nim: "2021010101", name: "Ahmad Fauzi", program: "Teknik Informatika", status: "Active" },
                { nim: "2021010102", name: "Siti Nurhaliza", program: "Teknik Informatika", status: "Active" },
                { nim: "2021010201", name: "Budi Santoso", program: "Sistem Informasi", status: "Active" },
                // More data rows would appear here in a real implementation
            ];
            setPreviewData(fakePreview);
        } else {
            setPreviewData(null);
        }
    };

    const resetForm = () => {
        setFile(null);
        setPreviewData(null);
        setIsProcessing(false);
        setResult(null);
    };

    const handleSubmit = () => {
        setIsProcessing(true);
        // Submit logic here
    };

    // Get operation icon
    const getOperationIcon = (id) => {
        switch (id) {
            case 'students':
                return <MdPersonAdd className="h-5 w-5" />;
            case 'lecturers':
                return <MdPeople className="h-5 w-5" />;
            case 'face-dataset':
                return <MdFace className="h-5 w-5" />;
            case 'attendance':
                return <MdAccessTime className="h-5 w-5" />;
            case 'old-attendance':
                return <MdDelete className="h-5 w-5" />;
            case 'inactive-students':
                return <MdPersonRemove className="h-5 w-5" />;
            case 'database':
                return <MdStorage className="h-5 w-5" />;
            case 'face-recognition':
                return <MdFace className="h-5 w-5" />;
            default:
                return <MdDeviceHub className="h-5 w-5" />;
        }
    };

    // Get status badge
    const getStatusBadge = (status) => {
        switch (status) {
            case "online":
                return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full flex items-center"><MdTaskAlt className="mr-1 h-3 w-3" /> Online</span>;
            case "offline":
                return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full flex items-center"><MdError className="mr-1 h-3 w-3" /> Offline</span>;
            case "warning":
                return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full flex items-center"><MdWarning className="mr-1 h-3 w-3" /> Warning</span>;
            default:
                return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">Unknown</span>;
        }
    };

    return (
        <div className="p-4 md:p-8">
            <div className="mb-8" data-aos="fade-down">
                <h1 className="text-3xl font-bold text-gray-800">Bulk Data Operations</h1>
                <p className="text-gray-600">Perform bulk import, export, and maintenance operations</p>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-md mb-8" data-aos="fade-up">
                <div className="flex overflow-x-auto hide-scrollbar border-b border-gray-200">
                    <button
                        className={`px-6 py-3 text-sm font-medium border-b-2 ${activeTab === 'import' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        onClick={() => { resetForm(); setActiveTab('import'); setSelectedOperation('students'); }}
                    >
                        <div className="flex items-center">
                            <MdUpload className="h-5 w-5 mr-2" />
                            Import Data
                        </div>
                    </button>
                    <button
                        className={`px-6 py-3 text-sm font-medium border-b-2 ${activeTab === 'export' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        onClick={() => { resetForm(); setActiveTab('export'); setSelectedOperation('students'); }}
                    >
                        <div className="flex items-center">
                            <MdDownload className="h-5 w-5 mr-2" />
                            Export Data
                        </div>
                    </button>
                    <button
                        className={`px-6 py-3 text-sm font-medium border-b-2 ${activeTab === 'clean' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        onClick={() => { resetForm(); setActiveTab('clean'); setSelectedOperation('old-attendance'); }}
                    >
                        <div className="flex items-center">
                            <MdDelete className="h-5 w-5 mr-2" />
                            Clean Data
                        </div>
                    </button>
                    <button
                        className={`px-6 py-3 text-sm font-medium border-b-2 ${activeTab === 'sync' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        onClick={() => { resetForm(); setActiveTab('sync'); setSelectedOperation('database'); }}
                    >
                        <div className="flex items-center">
                            <MdSync className="h-5 w-5 mr-2" />
                            Sync Data
                        </div>
                    </button>
                </div>

                <div className="p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                        {activeTab === 'import' ? 'Import Data' :
                            activeTab === 'export' ? 'Export Data' :
                                activeTab === 'clean' ? 'Clean Data' : 'Sync Data'}
                    </h2>

                    {/* Operation Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {operations[activeTab].map((operation) => (
                            <div
                                key={operation.id}
                                className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedOperation === operation.id ?
                                    'border-blue-500 bg-blue-50' :
                                    'border-gray-200 hover:border-blue-300 hover:bg-blue-50/30'
                                    }`}
                                onClick={() => { resetForm(); setSelectedOperation(operation.id); }}
                            >
                                <div className="flex items-center">
                                    <div className={`p-2 rounded-full ${selectedOperation === operation.id ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {getOperationIcon(operation.id)}
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="font-medium text-gray-900">{operation.name}</h3>
                                        <p className="text-sm text-gray-500">{operation.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Action Panel */}
                    <div className="mt-8">
                        {activeTab === 'import' && (
                            <div className="border border-gray-200 rounded-lg p-6" data-aos="fade-up" data-aos-delay="100">
                                <h3 className="text-md font-medium text-gray-900 mb-4">File Upload</h3>

                                {!file ? (
                                    <div
                                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
                                        onClick={() => document.getElementById('fileInput').click()}
                                    >
                                        <MdCloudUpload className="h-12 w-12 mx-auto text-gray-400" />
                                        <p className="mt-2 text-sm text-gray-600">Click to select or drag and drop files here</p>
                                        <p className="mt-1 text-xs text-gray-500">
                                            {selectedOperation === 'students' || selectedOperation === 'lecturers' ?
                                                'CSV, Excel files (.xlsx, .csv)' :
                                                selectedOperation === 'face-dataset' ?
                                                    'ZIP files containing images (.zip)' : 'CSV, Excel, or JSON files'}
                                        </p>
                                        <input
                                            type="file"
                                            id="fileInput"
                                            className="hidden"
                                            accept={
                                                selectedOperation === 'students' || selectedOperation === 'lecturers' ?
                                                    '.csv,.xlsx,.xls' :
                                                    selectedOperation === 'face-dataset' ?
                                                        '.zip' : '.csv,.xlsx,.xls,.json'
                                            }
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="bg-blue-50 rounded-lg p-4 flex items-center">
                                            <div className="bg-blue-100 p-2 rounded-full">
                                                <MdCheckCircle className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <div className="ml-3">
                                                <h4 className="text-sm font-medium text-blue-900">{selectedFile.name}</h4>
                                                <p className="text-xs text-blue-700">{(selectedFile.size / 1024).toFixed(2)} KB uploaded</p>
                                            </div>
                                            <button
                                                className="ml-auto text-sm text-red-600 hover:text-red-800"
                                                onClick={resetForm}
                                            >
                                                Remove
                                            </button>
                                        </div>

                                        {previewData && (
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-700 mb-2">Data Preview</h4>
                                                <div className="border border-gray-200 rounded-lg overflow-hidden">
                                                    <div className="overflow-x-auto">
                                                        <table className="min-w-full divide-y divide-gray-200">
                                                            <thead className="bg-gray-50">
                                                                <tr>
                                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIM</th>
                                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program</th>
                                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="bg-white divide-y divide-gray-200">
                                                                {previewData.map((row, index) => (
                                                                    <tr key={index} className="hover:bg-gray-50">
                                                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{row.nim}</td>
                                                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{row.name}</td>
                                                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{row.program}</td>
                                                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{row.status}</td>
                                                                    </tr>
                                                                ))}
                                                                <tr>
                                                                    <td colSpan="4" className="px-4 py-2 text-center text-xs text-gray-500">Showing first {previewData.length} rows of data</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div>
                                            <h4 className="text-sm font-medium text-gray-700 mb-2">Import Options</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        id="overwrite"
                                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                        defaultChecked={true}
                                                    />
                                                    <label htmlFor="overwrite" className="ml-2 text-sm text-gray-700">
                                                        Overwrite existing data
                                                    </label>
                                                </div>
                                                <div className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        id="validate"
                                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                        defaultChecked={true}
                                                    />
                                                    <label htmlFor="validate" className="ml-2 text-sm text-gray-700">
                                                        Validate data before import
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-end space-x-3">
                                            <button
                                                type="button"
                                                onClick={resetForm}
                                                className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleSubmit}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                                                disabled={isProcessing}
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
                                                        <MdUpload className="mr-2" /> Start Import
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'export' && (
                            <div className="border border-gray-200 rounded-lg p-6" data-aos="fade-up" data-aos-delay="100">
                                <h3 className="text-md font-medium text-gray-900 mb-4">Export Options</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
                                        <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500">
                                            <option value="csv">CSV (.csv)</option>
                                            <option value="excel">Microsoft Excel (.xlsx)</option>
                                            <option value="json">JSON (.json)</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="date"
                                                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                            <span>to</span>
                                            <input
                                                type="date"
                                                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="includeDetails"
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            defaultChecked={true}
                                        />
                                        <label htmlFor="includeDetails" className="ml-2 text-sm text-gray-700">
                                            Include detailed information
                                        </label>
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="includeDeleted"
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="includeDeleted" className="ml-2 text-sm text-gray-700">
                                            Include deleted/archived records
                                        </label>
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="compress"
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            defaultChecked={true}
                                        />
                                        <label htmlFor="compress" className="ml-2 text-sm text-gray-700">
                                            Compress output file (ZIP)
                                        </label>
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                                        disabled={isProcessing}
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
                                                <MdDownload className="mr-2" /> Export Data
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'clean' && (
                            <div className="border border-gray-200 rounded-lg p-6" data-aos="fade-up" data-aos-delay="100">
                                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                                    <div className="flex">
                                        <MdWarning className="h-5 w-5 text-yellow-400 mr-2" />
                                        <div>
                                            <p className="text-sm text-yellow-700">
                                                Warning: Data cleaning operations permanently remove data from the system.
                                                Make sure you have a backup before proceeding.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <h3 className="text-md font-medium text-gray-900 mb-4">Cleaning Options</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Delete Data Older Than</label>
                                        <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500">
                                            <option value="30">30 days</option>
                                            <option value="90">3 months</option>
                                            <option value="180">6 months</option>
                                            <option value="365">1 year</option>
                                            <option value="custom">Custom date</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Action After Cleaning</label>
                                        <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500">
                                            <option value="delete">Permanent Delete</option>
                                            <option value="archive">Archive to Backup</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="backupBeforeCleaning"
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            defaultChecked={true}
                                        />
                                        <label htmlFor="backupBeforeCleaning" className="ml-2 text-sm text-gray-700">
                                            Create backup before cleaning
                                        </label>
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="generateReport"
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            defaultChecked={true}
                                        />
                                        <label htmlFor="generateReport" className="ml-2 text-sm text-gray-700">
                                            Generate report of removed data
                                        </label>
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                                        disabled={isProcessing}
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
                                                <MdDelete className="mr-2" /> Start Cleaning
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'sync' && (
                            <div className="border border-gray-200 rounded-lg p-6" data-aos="fade-up" data-aos-delay="100">
                                <h3 className="text-md font-medium text-gray-900 mb-4">Sync Options</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Sync Direction</label>
                                        <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500">
                                            <option value="bidirectional">Bidirectional</option>
                                            <option value="pull">Pull Only (From External)</option>
                                            <option value="push">Push Only (To External)</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Conflict Resolution</label>
                                        <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500">
                                            <option value="newest">Use Newest</option>
                                            <option value="local">Keep Local</option>
                                            <option value="external">Use External</option>
                                            <option value="manual">Manual Resolution</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="dryRun"
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            defaultChecked={true}
                                        />
                                        <label htmlFor="dryRun" className="ml-2 text-sm text-gray-700">
                                            Dry run (preview changes without applying)
                                        </label>
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="forceSync"
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="forceSync" className="ml-2 text-sm text-gray-700">
                                            Force sync (override conflict resolution)
                                        </label>
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="logDetails"
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            defaultChecked={true}
                                        />
                                        <label htmlFor="logDetails" className="ml-2 text-sm text-gray-700">
                                            Log detailed sync actions
                                        </label>
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                                        disabled={isProcessing}
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
                                                <MdSync className="mr-2" /> Start Sync
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Results */}
                    {result && (
                        <div className={`mt-6 border rounded-lg p-6 ${result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`} data-aos="fade-up" data-aos-delay="200">
                            <div className="flex items-start">
                                <div className={`p-2 rounded-full ${result.success ? 'bg-green-100' : 'bg-red-100'}`}>
                                    {result.success ? (
                                        <MdCheckCircle className={`h-6 w-6 ${result.success ? 'text-green-600' : 'text-red-600'}`} />
                                    ) : (
                                        <MdError className="h-6 w-6 text-red-600" />
                                    )}
                                </div>
                                <div className="ml-3">
                                    <h3 className={`text-lg font-medium ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                                        {result.success ? "Operation Successful" : "Operation Failed"}
                                    </h3>
                                    <p className={`text-sm ${result.success ? 'text-green-700' : 'text-red-700'}`}>{result.message}</p>

                                    {result.details && (
                                        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div className="bg-white rounded-lg p-3">
                                                <p className="text-xs text-gray-500">Processed</p>
                                                <p className="text-lg font-semibold">{result.details.processed}</p>
                                            </div>
                                            <div className="bg-white rounded-lg p-3">
                                                <p className="text-xs text-gray-500">Successful</p>
                                                <p className="text-lg font-semibold text-green-600">{result.details.successful}</p>
                                            </div>
                                            <div className="bg-white rounded-lg p-3">
                                                <p className="text-xs text-gray-500">Failed</p>
                                                <p className="text-lg font-semibold text-red-600">{result.details.failed}</p>
                                            </div>
                                            <div className="bg-white rounded-lg p-3">
                                                <p className="text-xs text-gray-500">Warnings</p>
                                                <p className="text-lg font-semibold text-yellow-600">{result.details.warnings}</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-4 flex space-x-3">
                                        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                                            View Detailed Report
                                        </button>
                                        <button
                                            className="text-sm text-gray-600 hover:text-gray-800 font-medium"
                                            onClick={resetForm}
                                        >
                                            Start New Operation
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Best Practices */}
            <div className="bg-blue-50 rounded-xl border border-blue-100 p-6" data-aos="fade-up" data-aos-delay="300">
                <h2 className="text-lg font-semibold text-blue-800 mb-4">Best Practices for Bulk Operations</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-sm font-medium text-blue-700 mb-2">Importing Data</h3>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-blue-600">
                            <li>Ensure your CSV/Excel file uses the correct format</li>
                            <li>Always validate data before finalizing import</li>
                            <li>For face datasets, use clear photos in supported format</li>
                            <li>Large imports should be scheduled during off-peak hours</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-blue-700 mb-2">Cleaning Data</h3>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-blue-600">
                            <li>Always create a backup before cleaning data</li>
                            <li>Review system usage patterns before setting clean-up frequency</li>
                            <li>Archive important historical data instead of deleting</li>
                            <li>Schedule regular maintenance to optimize system performance</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BulkOperations;