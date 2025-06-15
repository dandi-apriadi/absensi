import React from "react";
import { MdGroups } from "react-icons/md";

const LecturerManagement = () => {
    return (
        <div className="p-4 md:p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Manajemen Dosen</h1>
                <p className="text-gray-600">Kelola data dan informasi dosen</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-center h-40 flex-col">
                    <MdGroups className="h-16 w-16 text-blue-500 mb-4" />
                    <h2 className="text-xl text-gray-600">Manajemen dosen sedang dalam pengembangan</h2>
                </div>
            </div>
        </div>
    );
};

export default LecturerManagement;
