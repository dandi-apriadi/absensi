import React, { useEffect, useState } from "react";
import { MdMeetingRoom, MdAdd, MdEdit, MdDelete, MdSave, MdPeople, MdCamera, MdFingerprintIcon, MdAccessTime, MdDevice } from "react-icons/md";
import AOS from "aos";
import "aos/dist/aos.css";

const RoomSettings = () => {
    const [rooms, setRooms] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        type: 'classroom',
        capacity: '',
        building: 'main',
        floor: '1',
        doorDeviceId: '',
        cameraDeviceId: '',
        accessMethods: ['face', 'rfid'],
        scheduleRestriction: false
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
        });

        // Load dummy room data
        setRooms([
            {
                id: 1,
                name: "Lab Komputer 1",
                type: "laboratory",
                capacity: 40,
                building: "main",
                floor: "1",
                doorDeviceId: "DOOR-001",
                cameraDeviceId: "CAM-001",
                accessMethods: ["face", "rfid", "pin"],
                scheduleRestriction: true,
                status: "active"
            },
            {
                id: 2,
                name: "Lab Komputer 2",
                type: "laboratory",
                capacity: 30,
                building: "main",
                floor: "1",
                doorDeviceId: "DOOR-002",
                cameraDeviceId: "CAM-002",
                accessMethods: ["face", "rfid"],
                scheduleRestriction: true,
                status: "active"
            },
            {
                id: 3,
                name: "Ruang 2.01",
                type: "classroom",
                capacity: 25,
                building: "main",
                floor: "2",
                doorDeviceId: "DOOR-101",
                cameraDeviceId: "CAM-101",
                accessMethods: ["face", "rfid"],
                scheduleRestriction: true,
                status: "active"
            },
            {
                id: 4,
                name: "Ruang 2.02",
                type: "classroom",
                capacity: 25,
                building: "main",
                floor: "2",
                doorDeviceId: "DOOR-102",
                cameraDeviceId: "CAM-102",
                accessMethods: ["face", "rfid"],
                scheduleRestriction: true,
                status: "maintenance"
            },
            {
                id: 5,
                name: "Lab Jaringan",
                type: "laboratory",
                capacity: 20,
                building: "engineering",
                floor: "1",
                doorDeviceId: "DOOR-201",
                cameraDeviceId: "CAM-201",
                accessMethods: ["face", "rfid", "pin"],
                scheduleRestriction: false,
                status: "active"
            }
        ]);
    }, []);

    const handleAddRoom = () => {
        setEditingRoom(null);
        setFormData({
            name: '',
            type: 'classroom',
            capacity: '',
            building: 'main',
            floor: '1',
            doorDeviceId: '',
            cameraDeviceId: '',
            accessMethods: ['face', 'rfid'],
            scheduleRestriction: false
        });
        setIsModalOpen(true);
    };

    const handleEditRoom = (room) => {
        setEditingRoom(room);
        setFormData({
            name: room.name,
            type: room.type,
            capacity: room.capacity,
            building: room.building,
            floor: room.floor,
            doorDeviceId: room.doorDeviceId,
            cameraDeviceId: room.cameraDeviceId,
            accessMethods: room.accessMethods,
            scheduleRestriction: room.scheduleRestriction
        });
        setIsModalOpen(true);
    };

    const handleDeleteRoom = (roomId) => {
        if (window.confirm('Are you sure you want to delete this room?')) {
            setRooms(rooms.filter(room => room.id !== roomId));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSaving(true);

        // Simulate saving
        setTimeout(() => {
            if (editingRoom) {
                setRooms(rooms.map(room =>
                    room.id === editingRoom.id ? { ...room, ...formData, status: room.status } : room
                ));
            } else {
                const newRoom = {
                    id: Date.now(), // Just for demo
                    ...formData,
                    status: 'active'
                };
                setRooms([...rooms, newRoom]);
            }

            setIsModalOpen(false);
            setSaving(false);
        }, 1000);
    };

    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            if (name === 'scheduleRestriction') {
                setFormData({ ...formData, [name]: checked });
            } else {
                // Handle access methods checkboxes
                const accessMethod = name.replace('accessMethod-', '');
                const accessMethods = checked
                    ? [...formData.accessMethods, accessMethod]
                    : formData.accessMethods.filter(method => method !== accessMethod);

                setFormData({ ...formData, accessMethods });
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const getRoomTypeDisplay = (type) => {
        switch (type) {
            case "classroom": return "Ruang Kelas";
            case "laboratory": return "Laboratorium";
            case "office": return "Ruang Kantor";
            case "meeting": return "Ruang Rapat";
            default: return type;
        }
    };

    const getRoomTypeColor = (type) => {
        switch (type) {
            case "classroom": return "bg-blue-100 text-blue-800";
            case "laboratory": return "bg-purple-100 text-purple-800";
            case "office": return "bg-gray-100 text-gray-800";
            case "meeting": return "bg-green-100 text-green-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    const getRoomStatusColor = (status) => {
        switch (status) {
            case "active": return "bg-green-100 text-green-800";
            case "maintenance": return "bg-yellow-100 text-yellow-800";
            case "inactive": return "bg-red-100 text-red-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="p-4 md:p-8">
            <div className="mb-8" data-aos="fade-down">
                <h1 className="text-3xl font-bold text-gray-800">Pengaturan Ruangan</h1>
                <p className="text-gray-600">Kelola informasi dan konfigurasi ruangan</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 mb-6" data-aos="fade-up">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">Daftar Ruangan</h2>
                        <p className="text-sm text-gray-600">Total {rooms.length} ruangan terdaftar</p>
                    </div>

                    <button
                        onClick={handleAddRoom}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
                    >
                        <MdAdd className="mr-2" /> Tambah Ruangan
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Ruangan</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipe</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kapasitas</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gedung</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lantai</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metode Akses</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {rooms.map((room) => (
                                <tr key={room.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{room.name}</div>
                                        <div className="text-xs text-gray-500">ID: {room.doorDeviceId}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs rounded-full ${getRoomTypeColor(room.type)}`}>
                                            {getRoomTypeDisplay(room.type)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {room.capacity} orang
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {room.building.charAt(0).toUpperCase() + room.building.slice(1)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        Lantai {room.floor}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs rounded-full ${getRoomStatusColor(room.status)}`}>
                                            {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex space-x-1">
                                            {room.accessMethods.includes('face') && (
                                                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">Face</span>
                                            )}
                                            {room.accessMethods.includes('rfid') && (
                                                <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">RFID</span>
                                            )}
                                            {room.accessMethods.includes('pin') && (
                                                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">PIN</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => handleEditRoom(room)}
                                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                                        >
                                            <MdEdit className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteRoom(room.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            <MdDelete className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Room Settings Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full p-6" data-aos="zoom-in">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold text-gray-900">
                                {editingRoom ? 'Edit Ruangan' : 'Tambah Ruangan Baru'}
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                        Nama Ruangan *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleFormChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                                        Tipe Ruangan
                                    </label>
                                    <select
                                        id="type"
                                        name="type"
                                        value={formData.type}
                                        onChange={handleFormChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none"
                                    >
                                        <option value="classroom">Ruang Kelas</option>
                                        <option value="laboratory">Laboratorium</option>
                                        <option value="office">Ruang Kantor</option>
                                        <option value="meeting">Ruang Rapat</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
                                        Kapasitas
                                    </label>
                                    <input
                                        type="number"
                                        id="capacity"
                                        name="capacity"
                                        min="1"
                                        value={formData.capacity}
                                        onChange={handleFormChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="building" className="block text-sm font-medium text-gray-700 mb-1">
                                            Gedung
                                        </label>
                                        <select
                                            id="building"
                                            name="building"
                                            value={formData.building}
                                            onChange={handleFormChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none"
                                        >
                                            <option value="main">Main Building</option>
                                            <option value="engineering">Engineering Building</option>
                                            <option value="science">Science Building</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="floor" className="block text-sm font-medium text-gray-700 mb-1">
                                            Lantai
                                        </label>
                                        <select
                                            id="floor"
                                            name="floor"
                                            value={formData.floor}
                                            onChange={handleFormChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none"
                                        >
                                            <option value="1">Lantai 1</option>
                                            <option value="2">Lantai 2</option>
                                            <option value="3">Lantai 3</option>
                                            <option value="4">Lantai 4</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="doorDeviceId" className="block text-sm font-medium text-gray-700 mb-1">
                                        ID Perangkat Pintu
                                    </label>
                                    <input
                                        type="text"
                                        id="doorDeviceId"
                                        name="doorDeviceId"
                                        value={formData.doorDeviceId}
                                        onChange={handleFormChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                        placeholder="e.g., DOOR-001"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="cameraDeviceId" className="block text-sm font-medium text-gray-700 mb-1">
                                        ID Perangkat Kamera
                                    </label>
                                    <input
                                        type="text"
                                        id="cameraDeviceId"
                                        name="cameraDeviceId"
                                        value={formData.cameraDeviceId}
                                        onChange={handleFormChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                        placeholder="e.g., CAM-001"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Metode Akses
                                </label>
                                <div className="flex space-x-6">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="accessMethod-face"
                                            name="accessMethod-face"
                                            checked={formData.accessMethods.includes('face')}
                                            onChange={handleFormChange}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="accessMethod-face" className="ml-2 text-sm text-gray-700">
                                            Face Recognition
                                        </label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="accessMethod-rfid"
                                            name="accessMethod-rfid"
                                            checked={formData.accessMethods.includes('rfid')}
                                            onChange={handleFormChange}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="accessMethod-rfid" className="ml-2 text-sm text-gray-700">
                                            RFID Card
                                        </label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="accessMethod-pin"
                                            name="accessMethod-pin"
                                            checked={formData.accessMethods.includes('pin')}
                                            onChange={handleFormChange}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="accessMethod-pin" className="ml-2 text-sm text-gray-700">
                                            PIN Code
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="scheduleRestriction"
                                    name="scheduleRestriction"
                                    checked={formData.scheduleRestriction}
                                    onChange={handleFormChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="scheduleRestriction" className="ml-2 text-sm text-gray-700">
                                    Batasi Akses Berdasarkan Jadwal Perkuliahan
                                </label>
                            </div>

                            <div className="flex justify-end pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors mr-3"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
                                    disabled={saving}
                                >
                                    {saving ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                            </svg>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <MdSave className="mr-2" /> Save
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Help Section */}
            <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-100" data-aos="fade-up">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Informasi Pengaturan Ruangan</h3>
                <ul className="list-disc pl-5 space-y-1 text-blue-700">
                    <li>Setiap ruangan harus memiliki perangkat pintu dan kamera yang terhubung</li>
                    <li>Pastikan ID perangkat pintu dan kamera sesuai dengan konfigurasi hardware</li>
                    <li>Minimal satu metode akses harus diaktifkan untuk setiap ruangan</li>
                    <li>Pembatasan jadwal akan mengunci ruangan di luar jadwal perkuliahan</li>
                    <li>Untuk ruangan yang sedang dalam maintenance, status akses akan non-aktif</li>
                </ul>
            </div>
        </div>
    );
};

export default RoomSettings;
