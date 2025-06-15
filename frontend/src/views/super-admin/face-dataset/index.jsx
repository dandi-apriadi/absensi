import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { MdCloudUpload, MdFace, MdVerified, MdDataset } from "react-icons/md";
import AOS from "aos";
import "aos/dist/aos.css";

const FaceDatasetManagement = () => {
    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
        });
    }, []);

    const statsData = [
        {
            title: "Total Dataset Wajah",
            value: 1180,
            text: "dari 1257 mahasiswa",
            color: "bg-blue-500",
            percentage: 94,
            icon: <MdFace className="h-8 w-8 text-blue-100" />
        },
        {
            title: "Dataset Terverifikasi",
            value: 1120,
            text: "dari 1180 dataset",
            color: "bg-green-500",
            percentage: 95,
            icon: <MdVerified className="h-8 w-8 text-green-100" />
        },
        {
            title: "Belum Memiliki Dataset",
            value: 77,
            text: "perlu ditambahkan segera",
            color: "bg-red-500",
            percentage: 6,
            icon: <MdDataset className="h-8 w-8 text-red-100" />
        }
    ];

    return (
        <div className="p-4 md:p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Manajemen Dataset Wajah</h1>
                <p className="text-gray-600">Kelola dataset wajah untuk sistem pengenalan wajah</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-center h-40 flex-col">
                    <MdFace className="h-16 w-16 text-blue-500 mb-4" />
                    <h2 className="text-xl text-gray-600">Manajemen dataset wajah sedang dalam pengembangan</h2>
                </div>
            </div>
        </div>
    );
};

export default FaceDatasetManagement;
