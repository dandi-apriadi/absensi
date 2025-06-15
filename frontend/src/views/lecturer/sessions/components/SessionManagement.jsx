import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
// Icon Imports
import {
    MdAdd,
    MdEdit,
    MdDelete,
    MdEvent,
    MdAccessTime,
    MdCalendarToday,
    MdRoom,
    MdPeople,
    MdInfo,
    MdArrowBack,
    MdArrowForward,
    MdDone,
    MdClear
} from "react-icons/md";
// Component Imports
import Card from "components/Card";

const SessionManagement = () => {
    const [view, setView] = useState("list"); // list, calendar
    const [currentDate, setCurrentDate] = useState(new Date());
    const [formData, setFormData] = useState({
        course: "",
        topic: "",
        date: "",
        startTime: "",
        endTime: "",
        room: "",
        notes: "",
        recurrence: "none", // none, weekly, biweekly, monthly
        dayOfWeek: ""
    });
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState("add"); // add, edit
    const [currentSession, setCurrentSession] = useState(null);
    const [sessionsList, setSessionsList] = useState([
        {
            id: 1,
            course: "Algoritma dan Pemrograman",
            topic: "Pertemuan 1: Pengantar",
            date: "2023-04-03",
            time: "08:00 - 09:40",
            room: "Ruang 101",
            totalStudents: 30,
            status: "upcoming",
            notes: "Jangan lupa bawa laptop",
            recurrence: "none",
            dayOfWeek: ""
        },
        {
            id: 2,
            course: "Basis Data",
            topic: "Normalisasi Database",
            date: "2023-04-10",
            time: "10:00 - 11:40",
            room: "Ruang 102",
            totalStudents: 28,
            status: "upcoming",
            notes: "",
            recurrence: "weekly",
            dayOfWeek: "Selasa"
        },
        {
            id: 3,
            course: "Pemrograman Web",
            topic: "JavaScript Lanjutan",
            date: "2023-04-12",
            time: "13:00 - 14:40",
            room: "Ruang 103",
            totalStudents: 25,
            status: "completed",
            notes: "Tugas dikumpulkan sebelum jam mulai",
            recurrence: "biweekly",
            dayOfWeek: "Kamis"
        }
    ]);
    const courses = [
        { id: 1, code: "CS101", name: "Algoritma dan Pemrograman", totalStudents: 30 },
        { id: 2, code: "DB101", name: "Basis Data", totalStudents: 28 },
        { id: 3, code: "WEB101", name: "Pemrograman Web", totalStudents: 25 }
    ];
    const rooms = ["Ruang 101", "Ruang 102", "Ruang 103", "Ruang 104"];

    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: "ease-in-out",
            once: true,
        });
    }, []);

    const handleAddSession = () => {
        setModalMode("add");
        setFormData({
            course: "",
            topic: "",
            date: "",
            startTime: "",
            endTime: "",
            room: "",
            notes: "",
            recurrence: "none",
            dayOfWeek: ""
        });
        setShowModal(true);
    };

    const handleEditSession = (session) => {
        setModalMode("edit");
        setCurrentSession(session);

        // Extract start and end time from the time string
        const [startTime, endTime] = session.time.split(" - ");

        setFormData({
            course: session.course,
            topic: session.topic,
            date: session.date,
            startTime: startTime,
            endTime: endTime,
            room: session.room,
            notes: session.notes || "",
            recurrence: session.recurrence || "none",
            dayOfWeek: session.dayOfWeek || ""
        });
        setShowModal(true);
    };

    const handleDeleteSession = (sessionId) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus sesi ini?")) {
            setSessionsList(sessionsList.filter(session => session.id !== sessionId));
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();

        // Format time for display
        const formattedTime = `${formData.startTime} - ${formData.endTime}`;

        if (modalMode === "add") {
            // Create new session with a unique ID
            const newSession = {
                id: sessionsList.length + 1,
                course: formData.course,
                topic: formData.topic,
                date: formData.date,
                time: formattedTime,
                room: formData.room,
                totalStudents: courses.find(c => c.name === formData.course)?.totalStudents || 0,
                status: "upcoming",
                notes: formData.notes,
                recurrence: formData.recurrence,
                dayOfWeek: formData.dayOfWeek
            };

            setSessionsList([...sessionsList, newSession]);
        } else {
            // Update existing session
            setSessionsList(
                sessionsList.map(session =>
                    session.id === currentSession.id
                        ? {
                            ...session,
                            course: formData.course,
                            topic: formData.topic,
                            date: formData.date,
                            time: formattedTime,
                            room: formData.room,
                            notes: formData.notes,
                            recurrence: formData.recurrence,
                            dayOfWeek: formData.dayOfWeek
                        }
                        : session
                )
            );
        }

        setShowModal(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const formatDate = (dateString) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    const getSessionStatusBadge = (status) => {
        switch (status) {
            case 'completed':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><MdDone className="mr-1" /> Selesai</span>;
            case 'ongoing':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"><MdAccessTime className="mr-1" /> Berlangsung</span>;
            case 'upcoming':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><MdEvent className="mr-1" /> Akan Datang</span>;
            case 'canceled':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><MdClear className="mr-1" /> Dibatalkan</span>;
            default:
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">-</span>;
        }
    };

    const getRecurrenceText = (recurrence, dayOfWeek) => {
        if (recurrence === 'weekly') {
            return `Setiap ${dayOfWeek}`;
        } else if (recurrence === 'biweekly') {
            return `Setiap 2 minggu pada ${dayOfWeek}`;
        } else if (recurrence === 'monthly') {
            return 'Setiap bulan';
        }
        return 'Tidak berulang';
    };

    return (
        <div className="mt-3">
            <div className="mb-5" data-aos="fade-down">
                <h1 className="text-3xl font-bold text-navy-700 dark:text-white">
                    Manajemen Sesi Perkuliahan
                </h1>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Kelola sesi perkuliahan untuk semua mata kuliah Anda
                </p>
            </div>

            <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" data-aos="fade-up">
                <div className="flex items-center">
                    <button
                        onClick={() => setView("list")}
                        className={`px-4 py-2 rounded-l-lg ${view === "list"
                                ? "bg-indigo-600 text-white"
                                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                            }`}
                    >
                        <MdList className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() => setView("calendar")}
                        className={`px-4 py-2 rounded-r-lg ${view === "calendar"
                                ? "bg-indigo-600 text-white"
                                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                            }`}
                    >
                        <MdCalendarToday className="h-5 w-5" />
                    </button>
                </div>

                <button
                    onClick={handleAddSession}
                    className="py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
                >
                    <MdAdd className="mr-2" /> Tambah Sesi Baru
                </button>
            </div>

            {view === "list" ? (
                <div className="space-y-5" data-aos="fade-up" data-aos-delay="100">
                    {sessionsList.map((session, index) => (
                        <Card
                            key={session.id}
                            extra="p-4 border-2 border-transparent hover:border-indigo-100 hover:shadow-md transition-all duration-200"
                            data-aos="fade-up"
                            data-aos-delay={index * 100}
                        >
                            <div className="flex flex-col lg:flex-row lg:items-center">
                                <div className="flex-1">
                                    <div className="flex items-center mb-2">
                                        <span className="text-xs font-semibold px-2 py-1 rounded bg-gray-100 text-gray-600 mr-2">
                                            {session.course}
                                        </span>

                                        {session.recurrence !== "none" && (
                                            <span className="text-xs px-2 py-1 rounded bg-purple-100 text-purple-600">
                                                {getRecurrenceText(session.recurrence, session.dayOfWeek)}
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="text-lg font-semibold text-navy-700 dark:text-white mb-2">
                                        {session.topic}
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <MdCalendarToday className="mr-2 text-gray-400" />
                                            {formatDate(session.date)}
                                        </div>

                                        <div className="flex items-center text-sm text-gray-600">
                                            <MdAccessTime className="mr-2 text-gray-400" />
                                            {session.time}
                                        </div>

                                        <div className="flex items-center text-sm text-gray-600">
                                            <MdRoom className="mr-2 text-gray-400" />
                                            {session.room}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <MdPeople className="mr-2 text-gray-400" />
                                            {session.totalStudents} Mahasiswa
                                        </div>

                                        <div>
                                            {getSessionStatusBadge(session.status)}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center mt-4 lg:mt-0 lg:ml-4 space-x-2">
                                    <button
                                        onClick={() => handleEditSession(session)}
                                        className="p-2 rounded-lg bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
                                        title="Edit Sesi"
                                    >
                                        <MdEdit className="h-5 w-5" />
                                    </button>

                                    <button
                                        onClick={() => handleDeleteSession(session.id)}
                                        className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
                                        title="Hapus Sesi"
                                    >
                                        <MdDelete className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            {session.notes && (
                                <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                                    <p className="text-sm text-gray-700">
                                        <MdInfo className="inline-block mr-2" />
                                        <span className="font-medium">Catatan:</span> {session.notes}
                                    </p>
                                </div>
                            )}
                        </Card>
                    ))}
                </div>
            ) : (
                <Card extra="p-4" data-aos="fade-up" data-aos-delay="100">
                    <div className="flex justify-between items-center mb-6">
                        <button
                            onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
                            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                        >
                            <MdArrowBack className="h-5 w-5" />
                        </button>

                        <h3 className="text-lg font-bold">
                            {new Date(currentDate).toLocaleString('id-ID', { month: 'long', year: 'numeric' })}
                        </h3>

                        <button
                            onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
                            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                        >
                            <MdArrowForward className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="grid grid-cols-7 gap-2 mb-2">
                        {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((day, i) => (
                            <div key={i} className="text-center text-sm font-medium text-gray-600 py-1">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                        {/* Calendar grid would be implemented here */}
                        <div className="text-center text-sm p-2 text-gray-400">28</div>
                        <div className="text-center text-sm p-2 text-gray-400">29</div>
                        <div className="text-center text-sm p-2 text-gray-400">30</div>
                        <div className="text-center text-sm p-2">1</div>
                        <div className="text-center text-sm p-2">2</div>
                        <div className="text-center text-sm p-2">3</div>
                        <div className="text-center text-sm p-2">4</div>
                        <div className="text-center text-sm p-2">5</div>
                        <div className="text-center text-sm p-2">6</div>
                        <div className="text-center text-sm p-2">7</div>
                        <div className="text-center text-sm p-2">8</div>
                        <div className="text-center text-sm p-2">9</div>
                        <div className="text-center text-sm p-2">10</div>
                        <div className="text-center text-sm p-2">11</div>
                        <div className="text-center text-sm p-2">12</div>
                        <div className="text-center text-sm p-2">13</div>
                        <div className="text-center text-sm p-2">14</div>
                        <div className="text-center text-sm p-2">15</div>
                        <div className="text-center text-sm p-2">16</div>
                        <div className="text-center text-sm p-2">17</div>
                        <div className="text-center text-sm p-2">18</div>
                        <div className="text-center text-sm p-2">19</div>
                        <div className="text-center text-sm p-2">20</div>
                        <div className="text-center text-sm p-2">21</div>
                        <div className="text-center text-sm p-2">22</div>
                        <div className="text-center text-sm p-2">23</div>
                        <div className="text-center text-sm p-2">24</div>
                        <div className="text-center text-sm p-2">25</div>
                        <div className="text-center text-sm p-2 bg-indigo-100 text-indigo-800 font-semibold rounded-lg relative group">
                            26
                            <div className="h-1 w-5 bg-indigo-600 rounded-full absolute bottom-1 left-1/2 transform -translate-x-1/2"></div>
                            <div className="hidden group-hover:block absolute z-10 bg-white p-2 rounded-lg shadow-lg text-left w-48 left-full ml-2">
                                <p className="text-xs font-semibold text-gray-900">Algoritma dan Pemrograman</p>
                                <p className="text-xs text-gray-600">Algoritma Sorting</p>
                                <p className="text-xs text-gray-600">08:00 - 09:40</p>
                            </div>
                        </div>
                        <div className="text-center text-sm p-2">27</div>
                        <div className="text-center text-sm p-2 bg-indigo-100 text-indigo-800 font-semibold rounded-lg relative group">
                            28
                            <div className="h-1 w-5 bg-indigo-600 rounded-full absolute bottom-1 left-1/2 transform -translate-x-1/2"></div>
                            <div className="hidden group-hover:block absolute z-10 bg-white p-2 rounded-lg shadow-lg text-left w-48 left-full ml-2">
                                <p className="text-xs font-semibold text-gray-900">Algoritma dan Pemrograman</p>
                                <p className="text-xs text-gray-600">Algoritma Sorting</p>
                                <p className="text-xs text-gray-600">08:00 - 09:40</p>
                            </div>
                        </div>
                        <div className="text-center text-sm p-2 bg-blue-100 text-blue-800 font-semibold rounded-lg relative group">
                            29
                            <div className="h-1 w-5 bg-blue-600 rounded-full absolute bottom-1 left-1/2 transform -translate-x-1/2"></div>
                            <div className="hidden group-hover:block absolute z-10 bg-white p-2 rounded-lg shadow-lg text-left w-48 left-full ml-2">
                                <p className="text-xs font-semibold text-gray-900">Basis Data</p>
                                <p className="text-xs text-gray-600">Normalisasi Database</p>
                                <p className="text-xs text-gray-600">10:00 - 11:40</p>
                            </div>
                        </div>
                        <div className="text-center text-sm p-2 bg-purple-100 text-purple-800 font-semibold rounded-lg relative group">
                            30
                            <div className="h-1 w-5 bg-purple-600 rounded-full absolute bottom-1 left-1/2 transform -translate-x-1/2"></div>
                            <div className="hidden group-hover:block absolute z-10 bg-white p-2 rounded-lg shadow-lg text-left w-48 left-full ml-2">
                                <p className="text-xs font-semibold text-gray-900">Pemrograman Web</p>
                                <p className="text-xs text-gray-600">JavaScript Lanjutan</p>
                                <p className="text-xs text-gray-600">13:00 - 14:40</p>
                            </div>
                        </div>
                        <div className="text-center text-sm p-2 bg-orange-100 text-orange-800 font-semibold rounded-lg relative group">
                            31
                            <div className="h-1 w-5 bg-orange-600 rounded-full absolute bottom-1 left-1/2 transform -translate-x-1/2"></div>
                            <div className="hidden group-hover:block absolute z-10 bg-white p-2 rounded-lg shadow-lg text-left w-48 left-full ml-2">
                                <p className="text-xs font-semibold text-gray-900">Kecerdasan Buatan</p>
                                <p className="text-xs text-gray-600">Neural Networks</p>
                                <p className="text-xs text-gray-600">15:00 - 16:40</p>
                            </div>
                        </div>
                        <div className="text-center text-sm p-2 text-gray-400">1</div>
                    </div>
                </Card>
            )}

            {/* Modal for adding/editing sessions */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                    <div className="relative bg-white rounded-xl shadow-lg w-full max-w-2xl" data-aos="zoom-in">
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                                {modalMode === "add" ? "Tambah Sesi Baru" : "Edit Sesi"}
                            </h3>

                            <form onSubmit={handleFormSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Mata Kuliah</label>
                                        <select
                                            name="course"
                                            value={formData.course}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full rounded-lg border border-gray-300 p-2 text-sm outline-none focus:border-indigo-500"
                                        >
                                            <option value="">Pilih Mata Kuliah</option>
                                            {courses.map((course) => (
                                                <option key={course.id} value={course.name}>
                                                    {course.code} - {course.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Topik/Judul</label>
                                        <input
                                            type="text"
                                            name="topic"
                                            value={formData.topic}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="Contoh: Pertemuan 1: Pengantar"
                                            className="w-full rounded-lg border border-gray-300 p-2 text-sm outline-none focus:border-indigo-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                                        <input
                                            type="date"
                                            name="date"
                                            value={formData.date}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full rounded-lg border border-gray-300 p-2 text-sm outline-none focus:border-indigo-500"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Waktu Mulai</label>
                                            <input
                                                type="time"
                                                name="startTime"
                                                value={formData.startTime}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full rounded-lg border border-gray-300 p-2 text-sm outline-none focus:border-indigo-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Waktu Selesai</label>
                                            <input
                                                type="time"
                                                name="endTime"
                                                value={formData.endTime}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full rounded-lg border border-gray-300 p-2 text-sm outline-none focus:border-indigo-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Ruangan</label>
                                        <select
                                            name="room"
                                            value={formData.room}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full rounded-lg border border-gray-300 p-2 text-sm outline-none focus:border-indigo-500"
                                        >
                                            <option value="">Pilih Ruangan</option>
                                            {rooms.map((room, index) => (
                                                <option key={index} value={room}>
                                                    {room}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Perulangan</label>
                                        <select
                                            name="recurrence"
                                            value={formData.recurrence}
                                            onChange={handleInputChange}
                                            className="w-full rounded-lg border border-gray-300 p-2 text-sm outline-none focus:border-indigo-500"
                                        >
                                            <option value="none">Tidak berulang</option>
                                            <option value="weekly">Mingguan</option>
                                            <option value="biweekly">Dua mingguan</option>
                                            <option value="monthly">Bulanan</option>
                                        </select>
                                    </div>
                                </div>

                                {formData.recurrence !== "none" && (
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Hari</label>
                                        <select
                                            name="dayOfWeek"
                                            value={formData.dayOfWeek}
                                            onChange={handleInputChange}
                                            className="w-full rounded-lg border border-gray-300 p-2 text-sm outline-none focus:border-indigo-500"
                                        >
                                            <option value="">Pilih Hari</option>
                                            <option value="Senin">Senin</option>
                                            <option value="Selasa">Selasa</option>
                                            <option value="Rabu">Rabu</option>
                                            <option value="Kamis">Kamis</option>
                                            <option value="Jumat">Jumat</option>
                                            <option value="Sabtu">Sabtu</option>
                                        </select>
                                    </div>
                                )}

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Catatan (opsional)</label>
                                    <textarea
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleInputChange}
                                        placeholder="Tambahkan catatan tentang sesi ini"
                                        rows="3"
                                        className="w-full rounded-lg border border-gray-300 p-2 text-sm outline-none focus:border-indigo-500"
                                    ></textarea>
                                </div>

                                <div className="flex justify-end pt-4 border-t border-gray-200">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors mr-3"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        className="py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                    >
                                        {modalMode === "add" ? "Tambahkan" : "Simpan Perubahan"}
                                    </button>
                                </div>
                            </form>
                        </div>

                        <button
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
                            onClick={() => setShowModal(false)}
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SessionManagement;