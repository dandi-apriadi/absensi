import React from "react";
import { MdPeople } from "react-icons/md";

const UserManagement = () => {
    return (
        <div className="p-4 md:p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Manajemen Pengguna</h1>
                <p className="text-gray-600">Kelola semua pengguna sistem termasuk mahasiswa dan dosen</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-center h-40 flex-col">
                    <MdPeople className="h-16 w-16 text-blue-500 mb-4" />
                    <h2 className="text-xl text-gray-600">Halaman ini sedang dalam pengembangan</h2>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
