import React, { useEffect, useMemo, useState } from "react";
import { MdMeetingRoom, MdSecurity, MdWarning, MdGroups, MdAccessTime, MdInfo, MdRefresh } from "react-icons/md";
import AOS from "aos";
import "aos/dist/aos.css";

const RoomAccess = () => {
    useEffect(() => {
        AOS.init({ duration: 600, once: true });
    }, []);

    // Single door concept: we only have 1 physical door, classes are scheduled users of that door
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");
    const doorStatus = "locked"; // could be fetched later
    const doorHealth = "online"; // online | degraded | offline

    // Dummy merged classes (would come from API: course_classes + courses)
    const classes = useMemo(() => ([
        {
            id: 1,
            course_code: "IF101",
            course_name: "Algoritma & Pemrograman",
            class_name: "A",
            schedule: [{ day: "Senin", start: "08:00", end: "09:40" }],
            lecturer: "Dr. Budi",
            active: true,
            todayAccessCount: 12,
            lastAccess: "08:05",
        },
        {
            id: 2,
            course_code: "IF201",
            course_name: "Struktur Data",
            class_name: "B",
            schedule: [{ day: "Selasa", start: "10:00", end: "11:40" }],
            lecturer: "Dr. Rina",
            active: true,
            todayAccessCount: 9,
            lastAccess: "10:07",
        },
        {
            id: 3,
            course_code: "IF301",
            course_name: "Basis Data",
            class_name: "A",
            schedule: [{ day: "Rabu", start: "13:00", end: "14:40" }],
            lecturer: "Ir. Ahmad",
            active: false,
            todayAccessCount: 0,
            lastAccess: null,
        },
    ]), []);

    const filtered = classes.filter(c => {
        if (filter === 'active' && !c.active) return false;
        if (filter === 'inactive' && c.active) return false;
        if (search && !(c.course_name + c.course_code + c.class_name).toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

    const totalAccess = filtered.reduce((a, c) => a + c.todayAccessCount, 0);

    return (
        <div className="p-4 md:p-8">
            <div className="mb-8" data-aos="fade-down">
                <h1 className="text-3xl font-bold text-gray-800">Akses Pintu Kelas</h1>
                <p className="text-gray-600">Sistem satu pintu: daftar kelas yang memiliki hak akses hari ini.</p>
            </div>

            {/* Door Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-md p-6" data-aos="fade-up">
                    <div className="flex items-center">
                        <div className="bg-blue-100 p-4 rounded-full mr-4">
                            <MdMeetingRoom className="h-8 w-8 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Total Kelas Terdaftar</p>
                            <h3 className="text-3xl font-bold text-gray-800">{classes.length}</h3>
                        </div>
                    </div>
                    <div className="mt-4 text-xs text-gray-500 flex items-center">
                        <MdInfo className="mr-1" /> Semua kelas memakai pintu yang sama.
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6" data-aos="fade-up" data-aos-delay="100">
                    <div className="flex items-center">
                        <div className="bg-green-100 p-4 rounded-full mr-4">
                            <MdSecurity className="h-8 w-8 text-green-600" />
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Status Pintu</p>
                            <h3 className="text-2xl font-bold text-gray-800 capitalize">{doorStatus}</h3>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                        <span className={`text-xs font-medium px-2 py-1 rounded ${doorHealth === 'online' ? 'bg-green-50 text-green-700' : doorHealth === 'degraded' ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700'}`}>Health: {doorHealth}</span>
                        <button className="text-xs text-blue-600 hover:underline flex items-center"><MdRefresh className="mr-1" /> Refresh</button>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6" data-aos="fade-up" data-aos-delay="200">
                    <div className="flex items-center">
                        <div className="bg-yellow-100 p-4 rounded-full mr-4">
                            <MdAccessTime className="h-8 w-8 text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Total Akses Hari Ini</p>
                            <h3 className="text-3xl font-bold text-gray-800">{totalAccess}</h3>
                        </div>
                    </div>
                    <div className="mt-4 text-xs text-gray-500">
                        Dari seluruh kelas yang aktif.
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4" data-aos="fade-up">
                <div className="flex items-center gap-2 text-sm">
                    <button onClick={() => setFilter('all')} className={`px-3 py-1 rounded-full border text-xs ${filter === 'all' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200'}`}>Semua</button>
                    <button onClick={() => setFilter('active')} className={`px-3 py-1 rounded-full border text-xs ${filter === 'active' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200'}`}>Aktif</button>
                    <button onClick={() => setFilter('inactive')} className={`px-3 py-1 rounded-full border text-xs ${filter === 'inactive' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200'}`}>Tidak Aktif</button>
                </div>
                <div className="flex items-center gap-2 flex-1 md:justify-end">
                    <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari kelas / kode..." className="w-full md:w-64 text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
            </div>

            {/* Class Access List */}
            <div data-aos="fade-up" className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-800">Kelas Memiliki Akses</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map(cls => (
                        <div key={cls.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h3 className="font-semibold text-gray-800">{cls.course_code} - {cls.class_name}</h3>
                                    <p className="text-sm text-gray-600 line-clamp-1">{cls.course_name}</p>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-full ${cls.active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{cls.active ? 'Aktif' : 'Nonaktif'}</span>
                            </div>
                            <div className="text-xs space-y-1 mb-3">
                                <div className="flex items-center justify-between"><span className="text-gray-500">Dosen</span><span className="font-medium text-gray-700">{cls.lecturer}</span></div>
                                <div className="flex items-center justify-between"><span className="text-gray-500">Jadwal</span><span>{cls.schedule.map(s => `${s.day} ${s.start}-${s.end}`).join(', ')}</span></div>
                                <div className="flex items-center justify-between"><span className="text-gray-500">Akses Hari Ini</span><span>{cls.todayAccessCount}</span></div>
                                <div className="flex items-center justify-between"><span className="text-gray-500">Last Access</span><span>{cls.lastAccess || '-'}</span></div>
                            </div>
                            <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100">
                                <button className="text-xs text-blue-600 hover:underline flex items-center"><MdInfo className="mr-1" /> Detail</button>
                                <button disabled={!cls.active} className={`text-xs px-2 py-1 rounded ${cls.active ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}>Revoke Akses</button>
                            </div>
                        </div>
                    ))}
                </div>
                {filtered.length === 0 && (
                    <div className="text-center py-10 bg-white rounded-xl border border-dashed border-gray-300">
                        <p className="text-sm text-gray-500">Tidak ada kelas ditemukan.</p>
                    </div>
                )}
            </div>

            {/* Simple System Note */}
            <div className="mt-10 text-xs text-gray-400" data-aos="fade-up">
                Sistem akses pintu ini hanya mendukung 1 perangkat fisik. Semua kelas terjadwal menggunakan pintu yang sama.
            </div>
        </div>
    );
};

export default RoomAccess;
