import React, { useEffect, useState } from "react";
import { MdFace, MdSave, MdRefresh, MdVerified, MdWarning, MdLock, MdPeople, MdHistory } from "react-icons/md";
import AOS from "aos";
import "aos/dist/aos.css";

const FaceRecognitionSettings = () => {
    const [antiSpoofingEnabled, setAntiSpoofingEnabled] = useState(true);
    const [livenessDetection, setLivenessDetection] = useState(true);
    const [disableRecognition, setDisableRecognition] = useState(false);
    const [showRestartPrompt, setShowRestartPrompt] = useState(false);

    useEffect(() => {
        AOS.init();
    }, []);

    const handleSaveSettings = () => {
        // Logic to save settings
        setShowRestartPrompt(true);
    };

    return (
        <div className="p-6">
            <div className="bg-white rounded-xl shadow-md p-6 mb-6" data-aos="fade-up">
                <div className="flex items-center mb-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                        <MdFace className="h-6 w-6 text-blue-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-800 ml-3">Face Recognition Settings</h2>
                </div>

                <div className="mb-4 space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Anti-Spoofing:</span>
                        <span className={`text-sm font-medium ${antiSpoofingEnabled ? 'text-green-600' : 'text-red-600'}`}>
                            {antiSpoofingEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Liveness Detection:</span>
                        <span className={`text-sm font-medium ${livenessDetection ? 'text-green-600' : 'text-red-600'}`}>
                            {livenessDetection ? 'Enabled' : 'Disabled'}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Spoofing Attempts (30d):</span>
                        <span className="text-sm font-medium text-yellow-600">17</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Security Audit:</span>
                        <span className="text-sm font-medium">Last run: 3 days ago</span>
                    </div>
                </div>

                {disableRecognition && (
                    <div className="bg-red-50 border border-red-100 rounded-lg p-3 flex items-start">
                        <MdWarning className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
                        <p className="text-sm text-red-700">
                            Face Recognition is currently disabled. System is using fallback authentication methods.
                        </p>
                    </div>
                )}
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 mb-6 mt-6" data-aos="fade-up" data-aos-delay="200">
                <div className="flex items-center mb-4">
                    <div className="bg-purple-100 p-3 rounded-full">
                        <MdLock className="h-6 w-6 text-purple-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-800 ml-3">Security Status</h2>
                </div>

                <div className="mb-4 space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Anti-Spoofing:</span>
                        <span className={`text-sm font-medium ${antiSpoofingEnabled ? 'text-green-600' : 'text-red-600'}`}>
                            {antiSpoofingEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Liveness Detection:</span>
                        <span className={`text-sm font-medium ${livenessDetection ? 'text-green-600' : 'text-red-600'}`}>
                            {livenessDetection ? 'Enabled' : 'Disabled'}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Spoofing Attempts (30d):</span>
                        <span className="text-sm font-medium text-yellow-600">17</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Security Audit:</span>
                        <span className="text-sm font-medium">Last run: 3 days ago</span>
                    </div>
                </div>

                {disableRecognition && (
                    <div className="bg-red-50 border border-red-100 rounded-lg p-3 flex items-start">
                        <MdWarning className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
                        <p className="text-sm text-red-700">
                            Face Recognition is currently disabled. System is using fallback authentication methods.
                        </p>
                    </div>
                )}
            </div>

            <div className="bg-white rounded-xl shadow-md p-6" data-aos="fade-up" data-aos-delay="300">
                <div className="flex items-center mb-4">
                    <div className="bg-orange-100 p-3 rounded-full">
                        <MdPeople className="h-6 w-6 text-orange-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-800 ml-3">Dataset Stats</h2>
                </div>

                <div className="mb-4 space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Total Students:</span>
                        <span className="text-sm font-medium">1,257</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">With Face Dataset:</span>
                        <span className="text-sm font-medium">1,180 (94%)</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Dataset Quality:</span>
                        <div className="flex items-center">
                            <span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span>
                            <span className="text-sm font-medium text-green-600">Good</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Need Updates:</span>
                        <span className="text-sm font-medium">32 students</span>
                    </div>
                </div>

                <button className="w-full mt-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg flex items-center justify-center hover:bg-blue-200 transition-colors">
                    <MdRefresh className="mr-2" /> Analyze Dataset Quality
                </button>
            </div>

            {/* Restart Service Prompt */}
            {showRestartPrompt && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6" data-aos="zoom-in">
                        <div className="mb-4 text-center">
                            <div className="mx-auto bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                                <MdVerified className="h-8 w-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">Settings Saved Successfully</h3>
                            <p className="text-gray-600 mt-2">
                                Some changes require a restart of the face recognition service to take effect.
                            </p>
                        </div>

                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={() => setShowRestartPrompt(false)}
                                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Restart Later
                            </button>
                            <button
                                onClick={() => {
                                    // Here you would implement the restart logic
                                    setShowRestartPrompt(false);
                                }}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Restart Now
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FaceRecognitionSettings;