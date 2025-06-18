import React, { useEffect, useState } from "react";
import { MdSearch, MdAdd, MdFileUpload, MdFileDownload, MdFilterList, MdEdit, MdDelete, MdFace, MdCheckCircle, MdError, MdSchool, MdClose, MdSave, MdCancel } from "react-icons/md";
import AOS from "aos";
import "aos/dist/aos.css";

const dummyStudents = [
    {
        id: 1,
        nim: "2021010101",
        name: "Ahmad Fauzi",
        program: "Teknik Informatika",
        year: "2021",
        status: "Aktif",
        faceDataset: true,
        lastAttendance: "2 jam yang lalu"
    },
    {
        id: 2,
        nim: "2021010102",
        name: "Siti Nurhaliza",
        program: "Teknik Informatika",
        year: "2021",
        status: "Aktif",
        faceDataset: true,
        lastAttendance: "5 jam yang lalu"
    },
    {
        id: 3,
        nim: "2021010201",
        name: "Budi Santoso",
        program: "Sistem Informasi",
        year: "2021",
        status: "Aktif",
        faceDataset: false,
        lastAttendance: "1 hari yang lalu"
    },
    {
        id: 4,
        nim: "2020010101",
        name: "Indah Permata",
        program: "Teknik Informatika",
        year: "2020",
        status: "Aktif",
        faceDataset: true,
        lastAttendance: "2 hari yang lalu"
    },
    {
        id: 5,
        nim: "2020010105",
        name: "Rudi Hermawan",
        program: "Sistem Informasi",
        year: "2020",
        status: "Non-Aktif",
        faceDataset: false,
        lastAttendance: "30 hari yang lalu"
    },
    {
        id: 6,
        nim: "2022010101",
        name: "Dewi Lestari",
        program: "Teknik Informatika",
        year: "2022",
        status: "Aktif",
        faceDataset: true,
        lastAttendance: "1 jam yang lalu"
    },
    {
        id: 7,
        nim: "2022010102",
        name: "Muhammad Rizki",
        program: "Sistem Informasi",
        year: "2022",
        status: "Aktif",
        faceDataset: true,
        lastAttendance: "4 jam yang lalu"
    },
    {
        id: 8,
        nim: "2022010103",
        name: "Anisa Rahmawati",
        program: "Teknik Informatika",
        year: "2022",
        status: "Aktif",
        faceDataset: true,
        lastAttendance: "2 jam yang lalu"
    }
];

const programOptions = ["Semua Program", "Teknik Informatika", "Sistem Informasi"];
const yearOptions = ["Semua Angkatan", "2020", "2021", "2022", "2023"];
const statusOptions = ["Semua Status", "Aktif", "Non-Aktif"];
const datasetOptions = ["Semua", "Ada Dataset", "Tidak Ada Dataset"];

const StudentManagement = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProgram, setSelectedProgram] = useState("Semua Program");
    const [selectedYear, setSelectedYear] = useState("Semua Angkatan");
    const [selectedStatus, setSelectedStatus] = useState("Semua Status");
    const [selectedDataset, setSelectedDataset] = useState("Semua");
    const [filteredStudents, setFilteredStudents] = useState(dummyStudents);

    // Modal states
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [editFormData, setEditFormData] = useState({
        nim: "",
        name: "",
        program: "",
        year: "",
        status: "",
        faceDataset: false
    });

    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
        });
    }, []);

    useEffect(() => {
        let result = dummyStudents;

        // Apply search filter
        if (searchTerm) {
            result = result.filter(student =>
                student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.nim.includes(searchTerm)
            );
        }

        // Apply program filter
        if (selectedProgram !== "Semua Program") {
            result = result.filter(student => student.program === selectedProgram);
        }

        // Apply year filter
        if (selectedYear !== "Semua Angkatan") {
            result = result.filter(student => student.year === selectedYear);
        }

        // Apply status filter
        if (selectedStatus !== "Semua Status") {
            result = result.filter(student => student.status === selectedStatus);
        }

        // Apply dataset filter
        if (selectedDataset !== "Semua") {
            const hasDataset = selectedDataset === "Ada Dataset";
            result = result.filter(student => student.faceDataset === hasDataset);
        } setFilteredStudents(result);
    }, [searchTerm, selectedProgram, selectedYear, selectedStatus, selectedDataset]);

    // Modal functions
    const openEditModal = (student) => {
        setSelectedStudent(student);
        setEditFormData({
            nim: student.nim,
            name: student.name,
            program: student.program,
            year: student.year,
            status: student.status,
            faceDataset: student.faceDataset
        });
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedStudent(null);
        setEditFormData({
            nim: "",
            name: "",
            program: "",
            year: "",
            status: "",
            faceDataset: false
        });
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSaveStudent = () => {
        // Here you would typically make an API call to update the student
        console.log('Saving student:', editFormData);

        // For now, we'll just update the local state
        const updatedStudents = dummyStudents.map(student =>
            student.id === selectedStudent.id
                ? { ...student, ...editFormData }
                : student
        );

        // Update filtered students to reflect changes
        setFilteredStudents(updatedStudents);

        // Close modal
        closeEditModal();

        // Show success message (you can implement toast notification here)
        alert('Data mahasiswa berhasil diperbarui!');
    };

    return (
        <div className="p-4 md:p-8">
            <div className="mb-8" data-aos="fade-down">
                <h1 className="text-3xl font-bold text-gray-800">Manajemen Mahasiswa</h1>
                <p className="text-gray-600">Kelola data dan informasi mahasiswa</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-6" data-aos="fade-up">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-300">
                    <MdAdd className="mr-2" /> Tambah Mahasiswa
                </button>
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-300">
                    <MdFileUpload className="mr-2" /> Import Data
                </button>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-300">
                    <MdFileDownload className="mr-2" /> Export Data
                </button>
                <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-300">
                    <MdFace className="mr-2" /> Upload Dataset Wajah
                </button>
            </div>

            {/* Filter and Search */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6" data-aos="fade-up">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="w-full lg:w-1/3">
                        <div className="relative">
                            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari mahasiswa (Nama/NIM)"
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <div className="flex items-center">
                            <MdFilterList className="text-gray-400 mr-2" />
                            <select
                                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                value={selectedProgram}
                                onChange={(e) => setSelectedProgram(e.target.value)}
                            >
                                {programOptions.map((option, index) => (
                                    <option key={index} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                        <select
                            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                        >
                            {yearOptions.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                            ))}
                        </select>
                        <select
                            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                        >
                            {statusOptions.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                            ))}
                        </select>
                        <select
                            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            value={selectedDataset}
                            onChange={(e) => setSelectedDataset(e.target.value)}
                        >
                            {datasetOptions.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Students Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden" data-aos="fade-up" data-aos-delay="100">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIM</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program Studi</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Angkatan</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dataset Wajah</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kehadiran Terakhir</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredStudents.map((student) => (
                                <tr key={student.id} className="hover:bg-gray-50 transition-colors duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.nim}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.program}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.year}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${student.status === "Aktif" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                                            }`}>
                                            {student.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {student.faceDataset ? (
                                            <span className="flex items-center text-green-600">
                                                <MdCheckCircle className="mr-1" /> Ada
                                            </span>
                                        ) : (
                                            <span className="flex items-center text-red-600">
                                                <MdError className="mr-1" /> Tidak Ada
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.lastAttendance}</td>                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button
                                            className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                                            onClick={() => openEditModal(student)}
                                            title="Edit Mahasiswa"
                                        >
                                            <MdEdit className="h-5 w-5" />
                                        </button>
                                        <button className="text-red-600 hover:text-red-900 transition-colors duration-200" title="Hapus Mahasiswa">
                                            <MdDelete className="h-5 w-5" />
                                        </button>
                                        {!student.faceDataset && (
                                            <button className="text-green-600 hover:text-green-900 transition-colors duration-200" title="Upload Dataset Wajah">
                                                <MdFace className="h-5 w-5" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
                    <div className="flex-1 flex justify-between sm:hidden">
                        <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                            Previous
                        </button>
                        <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                            Next
                        </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Showing <span className="font-medium">1</span> to <span className="font-medium">8</span> of{" "}
                                <span className="font-medium">8</span> results
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                    Previous
                                </button>
                                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                                    1
                                </button>
                                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                                    2
                                </button>
                                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                                    3
                                </button>
                                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                    Next
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>            {/* Under Development Message */}
            <div className="bg-white rounded-xl shadow-md p-6" data-aos="fade-up">
                <div className="flex items-center justify-center h-40 flex-col">
                    <MdSchool className="h-16 w-16 text-blue-500 mb-4" />
                    <h2 className="text-xl text-gray-600">Manajemen mahasiswa sedang dalam pengembangan</h2>
                </div>
            </div>

            {/* Edit Student Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">Edit Data Mahasiswa</h2>
                                <p className="text-gray-600 mt-1">Perbarui informasi mahasiswa</p>
                            </div>
                            <button
                                onClick={closeEditModal}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                            >
                                <MdClose className="h-6 w-6 text-gray-600" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6">
                            <form className="space-y-6">
                                {/* NIM Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        NIM <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="nim"
                                        value={editFormData.nim}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300"
                                        placeholder="Masukkan NIM mahasiswa"
                                        required
                                    />
                                </div>

                                {/* Name Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nama Lengkap <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={editFormData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300"
                                        placeholder="Masukkan nama lengkap"
                                        required
                                    />
                                </div>

                                {/* Program and Year Row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Program Field */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Program Studi <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="program"
                                            value={editFormData.program}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300"
                                            required
                                        >
                                            <option value="">Pilih Program Studi</option>
                                            <option value="Teknik Informatika">Teknik Informatika</option>
                                            <option value="Sistem Informasi">Sistem Informasi</option>
                                            <option value="Manajemen Informatika">Manajemen Informatika</option>
                                        </select>
                                    </div>

                                    {/* Year Field */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Angkatan <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="year"
                                            value={editFormData.year}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300"
                                            required
                                        >
                                            <option value="">Pilih Angkatan</option>
                                            <option value="2020">2020</option>
                                            <option value="2021">2021</option>
                                            <option value="2022">2022</option>
                                            <option value="2023">2023</option>
                                            <option value="2024">2024</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Status Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Status <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="status"
                                        value={editFormData.status}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300"
                                        required
                                    >
                                        <option value="">Pilih Status</option>
                                        <option value="Aktif">Aktif</option>
                                        <option value="Non-Aktif">Non-Aktif</option>
                                        <option value="Cuti">Cuti</option>
                                        <option value="Lulus">Lulus</option>
                                    </select>
                                </div>

                                {/* Face Dataset Checkbox */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-start">
                                        <div className="flex items-center h-5">
                                            <input
                                                type="checkbox"
                                                name="faceDataset"
                                                checked={editFormData.faceDataset}
                                                onChange={handleInputChange}
                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                            />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label className="font-medium text-gray-700">
                                                Dataset Wajah Tersedia
                                            </label>
                                            <p className="text-gray-500">
                                                Centang jika mahasiswa sudah memiliki dataset wajah untuk sistem absensi
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Current Student Info */}
                                {selectedStudent && (
                                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                        <h4 className="font-medium text-blue-800 mb-2">Informasi Saat Ini:</h4>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="text-blue-600">NIM:</span>
                                                <span className="ml-2 text-blue-800">{selectedStudent.nim}</span>
                                            </div>
                                            <div>
                                                <span className="text-blue-600">Nama:</span>
                                                <span className="ml-2 text-blue-800">{selectedStudent.name}</span>
                                            </div>
                                            <div>
                                                <span className="text-blue-600">Program:</span>
                                                <span className="ml-2 text-blue-800">{selectedStudent.program}</span>
                                            </div>
                                            <div>
                                                <span className="text-blue-600">Status:</span>
                                                <span className="ml-2 text-blue-800">{selectedStudent.status}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </form>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-end gap-4 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                            <button
                                type="button"
                                onClick={closeEditModal}
                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-300 flex items-center gap-2"
                            >
                                <MdCancel className="h-4 w-4" />
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleSaveStudent}
                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
                            >
                                <MdSave className="h-4 w-4" />
                                Simpan Perubahan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentManagement;
