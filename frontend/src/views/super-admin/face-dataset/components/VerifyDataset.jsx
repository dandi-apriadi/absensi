import React from "react";
import { MdVerified } from "react-icons/md";

const VerifyDataset = () => {
    return (
        <div className="p-4 md:p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Verifikasi Dataset Wajah</h1>
                <p className="text-gray-600">Verifikasi kualitas dan akurasi dataset wajah</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-center h-40 flex-col">
                    <MdVerified className="h-16 w-16 text-blue-500 mb-4" />
                    <h2 className="text-xl text-gray-600">Verifikasi dataset wajah sedang dalam pengembangan</h2>
                </div>
            </div>
        </div>
    );
};

export default VerifyDataset;
