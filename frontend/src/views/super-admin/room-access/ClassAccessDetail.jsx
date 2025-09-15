import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
    MdArrowBack, 
    MdClass, 
    MdPerson, 
    MdSchedule, 
    MdPeople, 
    MdAccessTime, 
    MdCalendarToday,
    MdLocationOn,
    MdSecurity,
    MdHistory,
    MdInfo,
    MdWarning,
    MdCheckCircle,
    MdDownload,
    MdRefresh,
    MdEdit,
    MdAdd,
    MdDelete,
    MdSave,
    MdCancel
} from "react-icons/md";
import axios from "axios";
import AOS from "aos";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";

const api = axios.create({
    baseURL: API_BASE,
    withCredentials: true
});

const ClassAccessDetail = () => {
    const { classId } = useParams();
    const navigate = useNavigate();
    const [classDetail, setClassDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);
    
    // Attendance data states
    const [attendanceData, setAttendanceData] = useState([]);
    const [loadingAttendance, setLoadingAttendance] = useState(false);
    const [attendanceStats, setAttendanceStats] = useState({
        totalSessions: 0,
        totalAttendances: 0,
        presentCount: 0,
        lateCount: 0,
        absentCount: 0
    });
    
    // Schedule editing states
    const [isEditingSchedule, setIsEditingSchedule] = useState(false);
    const [scheduleData, setScheduleData] = useState([]);
    const [conflicts, setConflicts] = useState([]);
    const [savingSchedule, setSavingSchedule] = useState(false);

    useEffect(() => {
        AOS.init({ duration: 600, once: true });
        fetchClassDetail();
        fetchAttendanceData();
    }, [classId]);

    const fetchClassDetail = async () => {
        try {
            setLoading(true);
            console.log('Fetching class detail for ID:', classId);
            
            const res = await api.get(`/api/room-access/classes/${classId}/detail`);
            
            console.log('Class detail response:', res.data);
            
            if (res.data.success) {
                const classData = res.data.data;
                
                // Ensure schedule is always an array
                if (classData.schedule) {
                    if (typeof classData.schedule === 'string') {
                        try {
                            classData.schedule = JSON.parse(classData.schedule);
                        } catch (e) {
                            console.error('Error parsing schedule string:', e);
                            classData.schedule = [];
                        }
                    }
                    if (!Array.isArray(classData.schedule)) {
                        classData.schedule = [];
                    }
                } else {
                    classData.schedule = [];
                }
                
                console.log('Processed class data with schedule:', classData);
                setClassDetail(classData);
            }
        } catch (error) {
            console.error('Failed to fetch class detail:', error);
            setMessage({ 
                type: 'error', 
                text: 'Gagal memuat detail kelas: ' + (error.response?.data?.message || error.message)
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchAttendanceData = async () => {
        try {
            setLoadingAttendance(true);
            console.log('Fetching attendance data for class ID:', classId);
            
            const res = await api.get(`/api/attendance/class/${classId}/attendance-data`);
            
            console.log('Attendance data response:', res.data);
            
            if (res.data.success) {
                const data = res.data.data;
                setAttendanceData(data.attendance_records || []);
                setAttendanceStats({
                    totalSessions: data.statistics.total_sessions || 0,
                    totalAttendances: data.attendance_records?.length || 0,
                    presentCount: data.statistics.total_present || 0,
                    lateCount: data.statistics.total_late || 0,
                    absentCount: data.statistics.total_absent || 0
                });
            }
        } catch (error) {
            console.error('Failed to fetch attendance data:', error);
            // Don't show error for attendance data as it's secondary information
        } finally {
            setLoadingAttendance(false);
        }
    };

    const handleRevokeAccess = async () => {
        if (!window.confirm(`Apakah Anda yakin ingin mencabut akses ruangan untuk kelas ${classDetail.course_code} - ${classDetail.class_name}?`)) {
            return;
        }

        try {
            const res = await api.patch(`/api/room-access/classes/${classId}/revoke`);
            
            if (res.data.success) {
                setMessage({ type: 'success', text: res.data.message });
                fetchClassDetail(); // Refresh data
            }
        } catch (error) {
            console.error('Failed to revoke access:', error);
            setMessage({ 
                type: 'error', 
                text: 'Gagal mencabut akses: ' + (error.response?.data?.message || error.message)
            });
        }
    };

    const handleGrantAccess = async () => {
        try {
            const res = await api.patch(`/api/room-access/classes/${classId}/grant`);
            
            if (res.data.success) {
                setMessage({ type: 'success', text: res.data.message });
                fetchClassDetail(); // Refresh data
            }
        } catch (error) {
            console.error('Failed to grant access:', error);
            setMessage({ 
                type: 'error', 
                text: 'Gagal memberikan akses: ' + (error.response?.data?.message || error.message)
            });
        }
    };

    const handleDownloadReport = () => {
        if (!classDetail.accessLogs || classDetail.accessLogs.length === 0) {
            setMessage({ type: 'error', text: 'Tidak ada data akses untuk diunduh' });
            return;
        }

        // Create CSV content
        const headers = ['Tanggal', 'Waktu', 'Nama Mahasiswa', 'NIM', 'Status', 'Sesi'];
        const csvContent = [
            headers.join(','),
            ...classDetail.accessLogs.map(log => [
                log.date,
                formatTime(log.time),
                `"${log.studentName}"`,
                log.studentId,
                log.status === 'present' ? 'Hadir' : 'Terlambat',
                `"${log.sessionName}"`
            ].join(','))
        ].join('\n');

        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `riwayat-akses-${classDetail.course_code}-${classDetail.class_name}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setMessage({ type: 'success', text: 'Laporan berhasil diunduh' });
    };

    const handleDownloadAttendance = () => {
        if (!attendanceData || attendanceData.length === 0) {
            setMessage({ type: 'error', text: 'Tidak ada data absensi untuk diunduh' });
            return;
        }

        // Create CSV content for attendance
        const headers = ['Tanggal Sesi', 'Nomor Sesi', 'Topik', 'Nama Mahasiswa', 'NIM', 'Status', 'Waktu Check-in', 'Metode Absensi', 'Confidence Score'];
        const csvContent = [
            headers.join(','),
            ...attendanceData.map(attendance => [
                attendance.session_date,
                attendance.session_number,
                `"${attendance.session_topic || '-'}"`,
                `"${attendance.student_name}"`,
                attendance.student_id,
                attendance.status === 'present' ? 'Hadir' : attendance.status === 'late' ? 'Terlambat' : 'Tidak Hadir',
                attendance.check_in_time ? formatTime(attendance.check_in_time) : '-',
                attendance.attendance_method === 'face_recognition' ? 'Face Recognition' : 
                attendance.attendance_method === 'manual' ? 'Manual' : 'QR Code',
                attendance.confidence_score ? (attendance.confidence_score * 100).toFixed(1) + '%' : '-'
            ].join(','))
        ].join('\n');

        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `data-absensi-${classDetail.course_code}-${classDetail.class_name}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setMessage({ type: 'success', text: 'Data absensi berhasil diunduh' });
    };

    // Schedule editing functions
    const handleEditSchedule = () => {
        setScheduleData(classDetail.schedule || []);
        setConflicts([]);
        setIsEditingSchedule(true);
    };

    const handleCancelEditSchedule = () => {
        setIsEditingSchedule(false);
        setScheduleData([]);
        setConflicts([]);
    };

    const addScheduleSlot = () => {
        const newSlot = {
            id: Date.now(),
            day: '',
            start_time: '',
            end_time: ''
        };
        setScheduleData([...scheduleData, newSlot]);
    };

    const removeScheduleSlot = (index) => {
        const newData = scheduleData.filter((_, i) => i !== index);
        setScheduleData(newData);
        checkScheduleConflicts(newData);
    };

    const updateScheduleSlot = (index, field, value) => {
        const newData = [...scheduleData];
        newData[index] = { ...newData[index], [field]: value };
        setScheduleData(newData);
        checkScheduleConflicts(newData);
    };

    const checkScheduleConflicts = (schedules) => {
        const conflicts = [];
        
        for (let i = 0; i < schedules.length; i++) {
            for (let j = i + 1; j < schedules.length; j++) {
                const schedule1 = schedules[i];
                const schedule2 = schedules[j];
                
                // Check if same day and overlapping time
                if (schedule1.day === schedule2.day && 
                    schedule1.day !== '' && 
                    schedule1.start_time && schedule1.end_time &&
                    schedule2.start_time && schedule2.end_time) {
                    
                    const start1 = new Date(`2000-01-01 ${schedule1.start_time}`);
                    const end1 = new Date(`2000-01-01 ${schedule1.end_time}`);
                    const start2 = new Date(`2000-01-01 ${schedule2.start_time}`);
                    const end2 = new Date(`2000-01-01 ${schedule2.end_time}`);
                    
                    if ((start1 < end2 && end1 > start2)) {
                        conflicts.push({
                            indices: [i, j],
                            message: `Konflik jadwal pada ${schedule1.day}: ${schedule1.start_time}-${schedule1.end_time} dengan ${schedule2.start_time}-${schedule2.end_time}`
                        });
                    }
                }
            }
        }
        
        setConflicts(conflicts);
        return conflicts.length === 0;
    };

    const handleSaveSchedule = async () => {
        // Validate all fields are filled
        const invalidSlots = scheduleData.filter(slot => 
            !slot.day || !slot.start_time || !slot.end_time
        );
        
        if (invalidSlots.length > 0) {
            setMessage({ 
                type: 'error', 
                text: 'Semua field jadwal harus diisi dengan lengkap' 
            });
            return;
        }

        // Check for conflicts
        if (!checkScheduleConflicts(scheduleData)) {
            setMessage({ 
                type: 'error', 
                text: 'Terdapat konflik jadwal. Silakan perbaiki terlebih dahulu.' 
            });
            return;
        }

        setSavingSchedule(true);
        
        try {
            const res = await api.put(`/api/room-access/classes/${classId}/schedule`, {
                schedule: scheduleData
            });
            
            if (res.data.success) {
                setMessage({ type: 'success', text: 'Jadwal berhasil diperbarui' });
                setIsEditingSchedule(false);
                fetchClassDetail(); // Refresh data
            }
        } catch (error) {
            console.error('Failed to update schedule:', error);
            setMessage({ 
                type: 'error', 
                text: 'Gagal memperbarui jadwal: ' + (error.response?.data?.message || error.message)
            });
        } finally {
            setSavingSchedule(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (timeString) => {
        if (!timeString) return '-';
        const time = new Date(timeString);
        return time.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Clear message after 5 seconds
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    if (loading) {
        return (
            <div className="p-4 md:p-8">
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Memuat detail kelas...</p>
                </div>
            </div>
        );
    }

    if (!classDetail) {
        return (
            <div className="p-4 md:p-8">
                <div className="text-center py-12">
                    <MdWarning className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Kelas Tidak Ditemukan</h3>
                    <p className="text-gray-600 mb-4">Detail kelas yang Anda cari tidak dapat ditemukan.</p>
                    <button 
                        onClick={() => navigate('/admin/room-access')}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        <MdArrowBack className="w-4 h-4 mr-2" />
                        Kembali
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            {/* Message Display */}
            {message && (
                <div className={`mb-6 p-4 rounded-lg border ${
                    message.type === 'success' 
                        ? 'bg-green-50 border-green-200 text-green-800' 
                        : 'bg-red-50 border-red-200 text-red-800'
                }`} data-aos="fade-in">
                    <div className="flex items-center">
                        {message.type === 'success' ? (
                            <MdCheckCircle className="w-5 h-5 mr-3" />
                        ) : (
                            <MdWarning className="w-5 h-5 mr-3" />
                        )}
                        {message.text}
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="mb-8" data-aos="fade-down">
                <div className="flex items-center mb-4">
                    <button 
                        onClick={() => navigate('/admin/room-access')}
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 mr-4"
                    >
                        <MdArrowBack className="w-5 h-5 mr-1" />
                        Kembali
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            {classDetail.course_code} - {classDetail.class_name}
                        </h1>
                        <p className="text-gray-600">{classDetail.course_name}</p>
                    </div>
                </div>
                
                {/* Status Badge */}
                <div className="flex items-center gap-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        classDetail.active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                    }`}>
                        <MdSecurity className="w-4 h-4 mr-2" />
                        {classDetail.active ? 'Akses Aktif' : 'Akses Nonaktif'}
                    </span>
                    
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        <MdLocationOn className="w-4 h-4 mr-2" />
                        Ruang Kelas Utama
                    </span>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Class Information */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Info Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6" data-aos="fade-up">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                            <MdClass className="w-5 h-5 mr-2" />
                            Informasi Kelas
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Kode Mata Kuliah</label>
                                    <p className="text-gray-900 font-medium">{classDetail.course_code}</p>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Nama Mata Kuliah</label>
                                    <p className="text-gray-900">{classDetail.course_name}</p>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Nama Kelas</label>
                                    <p className="text-gray-900 font-medium">{classDetail.class_name}</p>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Dosen Pengampu</label>
                                    <p className="text-gray-900 flex items-center">
                                        <MdPerson className="w-4 h-4 mr-2" />
                                        {classDetail.lecturer}
                                    </p>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Tahun Akademik</label>
                                    <p className="text-gray-900">{classDetail.academic_year} - {classDetail.semester_period}</p>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Kapasitas Maksimum</label>
                                    <p className="text-gray-900 flex items-center">
                                        <MdPeople className="w-4 h-4 mr-2" />
                                        {classDetail.max_students} mahasiswa
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Schedule Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6" data-aos="fade-up" data-aos-delay="100">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                                <MdSchedule className="w-5 h-5 mr-2" />
                                Jadwal Perkuliahan
                            </h2>
                            <button
                                onClick={handleEditSchedule}
                                className="inline-flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <MdEdit className="w-4 h-4 mr-1" />
                                Edit Jadwal
                            </button>
                        </div>
                        
                        {classDetail.schedule && Array.isArray(classDetail.schedule) && classDetail.schedule.length > 0 ? (
                            <div className="space-y-3">
                                {classDetail.schedule.map((schedule, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center">
                                            <MdCalendarToday className="w-4 h-4 mr-3 text-blue-600" />
                                            <span className="font-medium text-gray-900">{schedule.day}</span>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <MdAccessTime className="w-4 h-4 mr-2" />
                                            <span>{schedule.start_time || schedule.start} - {schedule.end_time || schedule.end}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <MdSchedule className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                <p>Tidak ada jadwal yang ditetapkan</p>
                                <button
                                    onClick={handleEditSchedule}
                                    className="mt-3 inline-flex items-center px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <MdAdd className="w-4 h-4 mr-1" />
                                    Tambah Jadwal
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Attendance History */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6" data-aos="fade-up" data-aos-delay="200">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                                <MdHistory className="w-5 h-5 mr-2" />
                                Riwayat Absensi
                            </h2>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={fetchAttendanceData}
                                    disabled={loadingAttendance}
                                    className="inline-flex items-center px-3 py-1.5 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                                >
                                    <MdRefresh className={`w-4 h-4 mr-1 ${loadingAttendance ? 'animate-spin' : ''}`} />
                                    Refresh
                                </button>
                                {attendanceData && attendanceData.length > 0 && (
                                    <button
                                        onClick={handleDownloadAttendance}
                                        className="inline-flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        <MdDownload className="w-4 h-4 mr-1" />
                                        Unduh
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Attendance Stats Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-blue-50 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-blue-600">{attendanceStats.totalSessions}</div>
                                <div className="text-sm text-blue-600">Total Sesi</div>
                            </div>
                            <div className="bg-green-50 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-green-600">{attendanceStats.presentCount}</div>
                                <div className="text-sm text-green-600">Hadir</div>
                            </div>
                            <div className="bg-yellow-50 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-yellow-600">{attendanceStats.lateCount}</div>
                                <div className="text-sm text-yellow-600">Terlambat</div>
                            </div>
                            <div className="bg-red-50 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-red-600">{attendanceStats.absentCount}</div>
                                <div className="text-sm text-red-600">Tidak Hadir</div>
                            </div>
                        </div>
                        
                        {loadingAttendance ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                <p className="text-sm text-gray-500">Memuat data absensi...</p>
                            </div>
                        ) : attendanceData && attendanceData.length > 0 ? (
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {attendanceData.map((attendance, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                <span className="text-blue-600 font-medium text-sm">
                                                    {attendance.student_name?.charAt(0)?.toUpperCase() || 'M'}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{attendance.student_name}</p>
                                                <p className="text-sm text-gray-500">{attendance.student_id}</p>
                                                <p className="text-xs text-gray-400">
                                                    Sesi {attendance.session_number} - {attendance.session_topic}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-gray-900">
                                                {formatDate(attendance.session_date)}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {attendance.check_in_time ? formatTime(attendance.check_in_time) : '-'}
                                            </p>
                                            <div className="flex items-center space-x-2 mt-1">
                                                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                                                    attendance.status === 'present' 
                                                        ? 'bg-green-100 text-green-700'
                                                        : attendance.status === 'late'
                                                            ? 'bg-yellow-100 text-yellow-700'
                                                            : 'bg-red-100 text-red-700'
                                                }`}>
                                                    {attendance.status === 'present' ? 'Hadir' : 
                                                     attendance.status === 'late' ? 'Terlambat' : 'Tidak Hadir'}
                                                </span>
                                                {attendance.attendance_method && (
                                                    <span className="text-xs text-gray-400">
                                                        {attendance.attendance_method === 'face_recognition' ? 'Face Recognition' : 
                                                         attendance.attendance_method === 'manual' ? 'Manual' : 'QR Code'}
                                                    </span>
                                                )}
                                            </div>
                                            {attendance.confidence_score && (
                                                <p className="text-xs text-gray-400">
                                                    Confidence: {(attendance.confidence_score * 100).toFixed(1)}%
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <MdHistory className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                <p>Belum ada data absensi</p>
                                <p className="text-sm text-gray-400 mt-1">
                                    Data absensi akan muncul setelah mahasiswa melakukan check-in
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Stats Sidebar */}
                <div className="space-y-6">
                    {/* Quick Stats */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6" data-aos="fade-up" data-aos-delay="300">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Statistik Kelas</h3>
                        
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Mahasiswa Terdaftar</span>
                                <span className="font-bold text-2xl text-blue-600">{classDetail.enrolled_students}</span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Total Akses</span>
                                <span className="font-bold text-2xl text-green-600">
                                    {classDetail.accessLogs ? classDetail.accessLogs.length : 0}
                                </span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Kapasitas Maksimum</span>
                                <span className="font-bold text-xl text-gray-600">{classDetail.max_students}</span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Status</span>
                                <span className={`font-medium ${classDetail.active ? 'text-green-600' : 'text-gray-600'}`}>
                                    {classDetail.active ? 'Aktif' : 'Nonaktif'}
                                </span>
                            </div>

                            {/* Progress Bar */}
                            <div className="pt-2">
                                <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                                    <span>Penggunaan Kapasitas</span>
                                    <span>{Math.round((classDetail.enrolled_students / classDetail.max_students) * 100)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                        className={`h-2 rounded-full ${
                                            (classDetail.enrolled_students / classDetail.max_students) > 0.9 
                                                ? 'bg-red-500' 
                                                : (classDetail.enrolled_students / classDetail.max_students) > 0.7 
                                                    ? 'bg-yellow-500' 
                                                    : 'bg-green-500'
                                        }`}
                                        style={{ width: `${Math.min((classDetail.enrolled_students / classDetail.max_students) * 100, 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6" data-aos="fade-up" data-aos-delay="400">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Aksi</h3>
                        
                        <div className="space-y-3">
                            {classDetail.active ? (
                                <button 
                                    onClick={handleRevokeAccess}
                                    className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    <MdSecurity className="w-4 h-4 mr-2" />
                                    Cabut Akses Ruangan
                                </button>
                            ) : (
                                <button 
                                    onClick={handleGrantAccess}
                                    className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    <MdSecurity className="w-4 h-4 mr-2" />
                                    Berikan Akses Ruangan
                                </button>
                            )}
                            
                            <button 
                                onClick={fetchClassDetail}
                                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <MdRefresh className="w-4 h-4 mr-2" />
                                Refresh Data
                            </button>

                            {classDetail.accessLogs && classDetail.accessLogs.length > 0 && (
                                <button 
                                    onClick={handleDownloadReport}
                                    className="w-full flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    <MdDownload className="w-4 h-4 mr-2" />
                                    Unduh Laporan CSV
                                </button>
                            )}
                        </div>
                    </div>

                    {/* System Info */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6" data-aos="fade-up" data-aos-delay="500">
                        <h3 className="text-lg font-semibold text-blue-800 mb-3">Informasi Sistem</h3>
                        <div className="space-y-2 text-sm text-blue-700">
                            <p>• Sistem menggunakan satu pintu untuk semua kelas</p>
                            <p>• Akses diatur berdasarkan jadwal perkuliahan</p>
                            <p>• Riwayat akses tersimpan selama 30 hari</p>
                            <p>• Status dapat diubah sewaktu-waktu oleh admin</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Schedule Edit Modal */}
            {isEditingSchedule && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-semibold text-gray-800">Edit Jadwal Perkuliahan</h3>
                                <button
                                    onClick={handleCancelEditSchedule}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <MdCancel className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            {/* Conflict warnings */}
                            {conflicts.length > 0 && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <div className="flex items-center mb-2">
                                        <MdWarning className="w-5 h-5 text-red-600 mr-2" />
                                        <h4 className="font-medium text-red-800">Konflik Jadwal Ditemukan</h4>
                                    </div>
                                    <ul className="text-sm text-red-700 space-y-1">
                                        {conflicts.map((conflict, index) => (
                                            <li key={index}>• {conflict.message}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Schedule slots */}
                            <div className="space-y-4">
                                {scheduleData.map((schedule, index) => (
                                    <div key={schedule.id || index} className={`p-4 border rounded-lg ${
                                        conflicts.some(c => c.indices.includes(index)) 
                                            ? 'border-red-300 bg-red-50' 
                                            : 'border-gray-200 bg-gray-50'
                                    }`}>
                                        <div className="flex items-center justify-between mb-3">
                                            <h5 className="font-medium text-gray-800">Jadwal {index + 1}</h5>
                                            {scheduleData.length > 1 && (
                                                <button
                                                    onClick={() => removeScheduleSlot(index)}
                                                    className="text-red-600 hover:text-red-800 p-1"
                                                >
                                                    <MdDelete className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {/* Day selection */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Hari
                                                </label>
                                                <select
                                                    value={schedule.day || ''}
                                                    onChange={(e) => updateScheduleSlot(index, 'day', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                >
                                                    <option value="">Pilih Hari</option>
                                                    <option value="Senin">Senin</option>
                                                    <option value="Selasa">Selasa</option>
                                                    <option value="Rabu">Rabu</option>
                                                    <option value="Kamis">Kamis</option>
                                                    <option value="Jumat">Jumat</option>
                                                    <option value="Sabtu">Sabtu</option>
                                                    <option value="Minggu">Minggu</option>
                                                </select>
                                            </div>

                                            {/* Start time */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Waktu Mulai
                                                </label>
                                                <input
                                                    type="time"
                                                    value={schedule.start_time || ''}
                                                    onChange={(e) => updateScheduleSlot(index, 'start_time', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>

                                            {/* End time */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Waktu Selesai
                                                </label>
                                                <input
                                                    type="time"
                                                    value={schedule.end_time || ''}
                                                    onChange={(e) => updateScheduleSlot(index, 'end_time', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Add schedule button */}
                            <div className="mt-4">
                                <button
                                    onClick={addScheduleSlot}
                                    className="inline-flex items-center px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <MdAdd className="w-4 h-4 mr-1" />
                                    Tambah Jadwal
                                </button>
                            </div>
                        </div>

                        {/* Modal footer */}
                        <div className="p-6 border-t border-gray-200 flex items-center justify-end space-x-3">
                            <button
                                onClick={handleCancelEditSchedule}
                                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                disabled={savingSchedule}
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleSaveSchedule}
                                disabled={savingSchedule || conflicts.length > 0}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
                            >
                                {savingSchedule ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        <MdSave className="w-4 h-4 mr-1" />
                                        Simpan Jadwal
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClassAccessDetail;