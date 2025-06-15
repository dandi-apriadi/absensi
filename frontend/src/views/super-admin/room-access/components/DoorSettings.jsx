import React, { useEffect } from "react";
import { MdLock, MdSecurity, MdSettings, MdMeetingRoom, MdEdit } from "react-icons/md";
import AOS from "aos";
import "aos/dist/aos.css";

const DoorSettings = () => {
    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
        });
    }, []);

    // Mock door settings data
    const doorSettings = [
        {
            id: 1,
            name: "Lab Komputer 1",
            status: "active",
            accessLevel: "Student & Staff",
            scheduleRestrictions: "Monday-Friday, 07:00-18:00",
            deviceStatus: "Online",
            lastMaintenance: "15 Apr 2025"
        },
        {
            id: 2,
            name: "Lab Komputer 2",
            status: "active",
            accessLevel: "Staff Only",
            scheduleRestrictions: "Monday-Friday, 07:00-20:00",
            deviceStatus: "Online",
            lastMaintenance: "12 Apr 2025"
        },
        {
            id: 3,
            name: "Ruang 2.01",
            status: "active",
            accessLevel: "Student & Staff",
            scheduleRestrictions: "Monday-Saturday, 07:00-16:00",
            deviceStatus: "Online",
            lastMaintenance: "10 Apr 2025"
        }
    ];

    return (
        <div className="p-4 md:p-8">
            <div className="mb-8" data-aos="fade-down">
                <h1 className="text-3xl font-bold text-gray-800">Konfigurasi Pintu Akses</h1>
                <p className="text-gray-600">Kelola pengaturan dan akses untuk sistem pintu cerdas</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 mb-6" data-aos="fade-up">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold text-gray-800">Pengaturan Pintu Akses</h2>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                        Tambah Pintu
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Ruangan</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level Akses</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batasan Jadwal</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Perangkat</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pemeliharaan Terakhir</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Tindakan</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {doorSettings.map((door) => (
                                <tr key={door.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <MdMeetingRoom className="h-5 w-5 text-gray-500 mr-2" />
                                            <span className="text-sm font-medium text-gray-900">{door.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            {door.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {door.accessLevel}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {door.scheduleRestrictions}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            {door.deviceStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {door.lastMaintenance}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                        <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                                            <MdEdit className="h-5 w-5" />
                                        </button>
                                        <button className="text-indigo-600 hover:text-indigo-900">
                                            <MdSettings className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6" data-aos="fade-up" data-aos-delay="200">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Pengaturan Keamanan</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center mb-3">
                            <MdSecurity className="h-6 w-6 text-blue-600 mr-2" />
                            <h3 className="text-md font-medium text-gray-800">Anti-Spoofing Controls</h3>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-700">3D Face Detection</span>
                                <div className="relative">
                                    <input type="checkbox" id="3dface" className="sr-only" defaultChecked />
                                    <div className="block bg-gray-600 w-10 h-6 rounded-full"></div>
                                    <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-700">Liveness Detection</span>
                                <div className="relative">
                                    <input type="checkbox" id="liveness" className="sr-only" defaultChecked />
                                    <div className="block bg-gray-600 w-10 h-6 rounded-full"></div>
                                    <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-700">Face Mask Detection</span>
                                <div className="relative">
                                    <input type="checkbox" id="mask" className="sr-only" />
                                    <div className="block bg-gray-600 w-10 h-6 rounded-full"></div>
                                    <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center mb-3">
                            <MdLock className="h-6 w-6 text-red-600 mr-2" />
                            <h3 className="text-md font-medium text-gray-800">Failover Options</h3>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-700">Manual Override</span>
                                <div className="relative">
                                    <input type="checkbox" id="override" className="sr-only" defaultChecked />
                                    <div className="block bg-gray-600 w-10 h-6 rounded-full"></div>
                                    <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-700">RFID Fallback</span>
                                <div className="relative">
                                    <input type="checkbox" id="rfid" className="sr-only" defaultChecked />
                                    <div className="block bg-gray-600 w-10 h-6 rounded-full"></div>
                                    <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-700">Emergency Unlock</span>
                                <div className="relative">
                                    <input type="checkbox" id="emergency" className="sr-only" defaultChecked />
                                    <div className="block bg-gray-600 w-10 h-6 rounded-full"></div>
                                    <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                        Simpan Pengaturan
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DoorSettings;
