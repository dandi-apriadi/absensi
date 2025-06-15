import React from "react";
import { MdAccessTime, MdFace, MdPersonAdd, MdSettings, MdSecurity } from "react-icons/md";

const activityData = [
    {
        id: 1,
        activity: "Login berhasil",
        user: "Admin Sistem",
        timestamp: "15 menit yang lalu",
        icon: <MdSecurity className="h-5 w-5 text-green-500" />,
    },
    {
        id: 2,
        activity: "Dataset wajah ditambahkan",
        user: "Ahmad Fauzi (2021010101)",
        timestamp: "32 menit yang lalu",
        icon: <MdFace className="h-5 w-5 text-blue-500" />,
    },
    {
        id: 3,
        activity: "Mahasiswa baru ditambahkan",
        user: "Siti Nurhaliza (2021010102)",
        timestamp: "1 jam yang lalu",
        icon: <MdPersonAdd className="h-5 w-5 text-purple-500" />,
    },
    {
        id: 4,
        activity: "Pengaturan sistem diubah",
        user: "Admin Sistem",
        timestamp: "3 jam yang lalu",
        icon: <MdSettings className="h-5 w-5 text-orange-500" />,
    },
    {
        id: 5,
        activity: "Absensi tercatat",
        user: "35 mahasiswa (Kelas Pemrograman Web)",
        timestamp: "4 jam yang lalu",
        icon: <MdAccessTime className="h-5 w-5 text-indigo-500" />,
    },
];

const RecentActivityTable = () => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full">
                <thead>
                    <tr className="border-b border-gray-200">
                        <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aktivitas</th>
                        <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {activityData.map((activity) => (
                        <tr key={activity.id} className="hover:bg-gray-50">
                            <td className="px-2 py-3 text-sm text-gray-800">
                                <div className="flex items-center">
                                    <div className="mr-3">{activity.icon}</div>
                                    {activity.activity}
                                </div>
                            </td>
                            <td className="px-2 py-3 text-sm text-gray-800">{activity.user}</td>
                            <td className="px-2 py-3 text-sm text-gray-500">{activity.timestamp}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="mt-4">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200">
                    Lihat semua aktivitas
                </button>
            </div>
        </div>
    );
};

export default RecentActivityTable;
