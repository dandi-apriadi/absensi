import React, { useState, useEffect } from "react";
import { MdCheckCircle } from "react-icons/md";

const PredictiveAnalytics = () => {
    const [atRiskStudents, setAtRiskStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate fetching data from an API
        setTimeout(() => {
            setAtRiskStudents([
                { id: 1, name: "John Doe", pattern: "Irregular" },
                { id: 2, name: "Jane Smith", pattern: "Frequent Lateness" },
                { id: 3, name: "Alice Johnson", pattern: "Consistent Absence" },
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    const handleApplyInterventions = () => {
        // Logic to apply recommended interventions
        console.log("Interventions applied to at-risk students.");
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Predictive Analytics Dashboard</h2>

            {/* At-Risk Students Overview */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8" data-aos="fade-up">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">At-Risk Students Overview</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Pattern</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {atRiskStudents.map((student) => (
                                <tr key={student.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.pattern}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button className="text-indigo-600 hover:text-indigo-900 px-2 py-1 text-xs border border-indigo-300 rounded-md hover:bg-indigo-50">View Details</button>
                                            <button className="text-green-600 hover:text-green-900 px-2 py-1 text-xs border border-green-300 rounded-md hover:bg-green-50">Intervene</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="mt-4 flex justify-between">
                    <p className="text-sm text-gray-500">Showing {atRiskStudents.length} at-risk students</p>
                    <button className="text-blue-600 text-sm font-medium">View All At-Risk Students</button>
                </div>
            </div>

            {/* Intervention Strategies */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8" data-aos="fade-up" data-aos-delay="700">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Strategi Intervensi yang Direkomendasikan</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-blue-50 p-4 rounded-xl border-l-4 border-blue-500">
                        <h4 className="text-blue-800 font-medium mb-2">Notifikasi Reminder</h4>
                        <p className="text-sm text-blue-700 mb-3">Kirim pengingat sebelum kelas untuk mahasiswa dengan riwayat keterlambatan.</p>
                        <p className="text-xs text-blue-600">Recommended for: 8 students</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-xl border-l-4 border-purple-500">
                        <h4 className="text-purple-800 font-medium mb-2">Konseling Akademik</h4>
                        <p className="text-sm text-purple-700 mb-3">Jadwalkan konseling untuk mahasiswa dengan penurunan kehadiran konsisten.</p>
                        <p className="text-xs text-purple-600">Recommended for: 5 students</p>
                    </div>
                    <div className="bg-amber-50 p-4 rounded-xl border-l-4 border-amber-500">
                        <h4 className="text-amber-800 font-medium mb-2">Penyesuaian Jadwal</h4>
                        <p className="text-sm text-amber-700 mb-3">Pertimbangkan perubahan jadwal untuk kelas dengan tingkat ketidakhadiran tinggi.</p>
                        <p className="text-xs text-amber-600">Recommended for: 2 classes</p>
                    </div>
                </div>
                <div className="mt-4 flex justify-center">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors" onClick={handleApplyInterventions}>
                        <MdCheckCircle className="mr-2" /> Apply Recommended Interventions
                    </button>
                </div>
            </div>

            {/* Model Info */}
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-6" data-aos="fade-up" data-aos-delay="800">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Informasi Model Prediksi</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Model Type</h4>
                        <p className="text-sm">Gradient Boosting Classifier</p>
                        <p className="text-xs text-gray-500 mt-1">Last trained: 3 days ago</p>
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Model Accuracy</h4>
                        <p className="text-sm">92.5% (F1-Score)</p>
                        <p className="text-xs text-gray-500 mt-1">Validation: 5-fold cross validation</p>
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Features Used</h4>
                        <p className="text-sm">Historical attendance, time patterns, course type, weather, semester progress</p>
                        <p className="text-xs text-gray-500 mt-1">15 features total</p>
                    </div>
                </div>
                <div className="mt-4 text-center">
                    <p className="text-xs text-gray-500">Predictions are updated daily and based on latest student attendance data. Model is automatically retrained weekly.</p>
                </div>
            </div>
        </div>
    );
};

export default PredictiveAnalytics;