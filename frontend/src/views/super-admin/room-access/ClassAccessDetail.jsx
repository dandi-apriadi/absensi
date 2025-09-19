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
    MdCancel,
    MdFace,
    MdQrCode
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
                (attendance.student_number || attendance.student_id),
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
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-12 text-center max-w-md w-full">
                    <div className="relative mb-8">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mx-auto flex items-center justify-center shadow-2xl">
                            <MdClass className="w-10 h-10 text-white" />
                        </div>
                        <div className="absolute inset-0 w-20 h-20 mx-auto border-4 border-blue-200 rounded-2xl animate-pulse"></div>
                        <div className="absolute inset-0 w-20 h-20 mx-auto">
                            <div className="w-full h-full border-4 border-transparent border-t-blue-600 rounded-2xl animate-spin"></div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-slate-800 tracking-tight">Memuat Detail Kelas</h3>
                        <p className="text-slate-600 leading-relaxed">Sedang mengambil informasi kelas dan data terkait. Mohon tunggu sebentar...</p>
                        <div className="flex justify-center space-x-2 mt-6">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!classDetail) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-12 text-center max-w-lg w-full">
                    <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-orange-100 rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-xl">
                        <MdWarning className="w-12 h-12 text-red-500" />
                    </div>
                    <div className="space-y-6">
                        <h3 className="text-3xl font-bold text-slate-800 tracking-tight">Kelas Tidak Ditemukan</h3>
                        <p className="text-slate-600 leading-relaxed text-lg">Detail kelas yang Anda cari tidak dapat ditemukan dalam sistem. Pastikan ID kelas sudah benar atau hubungi administrator.</p>
                        <div className="pt-4">
                            <button 
                                onClick={() => navigate('/admin/room-access')}
                                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 font-semibold text-lg"
                            >
                                <MdArrowBack className="w-6 h-6 mr-3" />
                                Kembali ke Daftar Kelas
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Top Navigation Bar - Enhanced */}
            <div className="bg-white/95 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-20 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-18">
                        <div className="flex items-center">
                            <button 
                                onClick={() => navigate('/admin/room-access')}
                                className="inline-flex items-center text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg px-3 py-2 mr-4 transition-all duration-200 group"
                            >
                                <MdArrowBack className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                                <span className="font-medium">Kembali</span>
                            </button>
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                                    <MdClass className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-slate-800 tracking-tight">
                                        {classDetail.course_code} - {classDetail.class_name}
                                    </h1>
                                    <p className="text-sm text-slate-600 font-medium mt-1">{classDetail.course_name}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            <span className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold shadow-sm transition-all duration-200 ${
                                classDetail.active 
                                    ? 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border border-emerald-200/60' 
                                    : 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-200/60'
                            }`}>
                                <div className={`w-2.5 h-2.5 rounded-full mr-2 animate-pulse ${
                                    classDetail.active ? 'bg-emerald-500' : 'bg-red-500'
                                }`}></div>
                                {classDetail.active ? 'Akses Aktif' : 'Akses Nonaktif'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Message Display - Enhanced */}
                {message && (
                    <div className={`mb-8 p-5 rounded-2xl border-l-4 shadow-lg backdrop-blur-sm transition-all duration-300 ${
                        message.type === 'success' 
                            ? 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-400 text-emerald-800' 
                            : 'bg-gradient-to-r from-red-50 to-rose-50 border-red-400 text-red-800'
                    }`} data-aos="fade-in">
                        <div className="flex items-center">
                            {message.type === 'success' ? (
                                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mr-4">
                                    <MdCheckCircle className="w-6 h-6 text-emerald-600" />
                                </div>
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-4">
                                    <MdWarning className="w-6 h-6 text-red-600" />
                                </div>
                            )}
                            <div>
                                <p className="font-semibold text-lg">{message.text}</p>
                                <p className="text-sm opacity-75 mt-1">
                                    {message.type === 'success' ? 'Operasi berhasil dilakukan' : 'Terjadi kesalahan pada sistem'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

            {/* Main Content Grid - Enhanced */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Left Column - Class Information */}
                <div className="xl:col-span-2 space-y-8">
                    {/* Basic Info Card - Enhanced */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300" data-aos="fade-up">
                        <div className="flex items-center mb-6">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                                <MdClass className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Informasi Kelas</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="group">
                                    <label className="block text-sm font-semibold text-slate-600 mb-2 uppercase tracking-wide">Kode Mata Kuliah</label>
                                    <p className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-200">{classDetail.course_code}</p>
                                </div>
                                
                                <div className="group">
                                    <label className="block text-sm font-semibold text-slate-600 mb-2 uppercase tracking-wide">Nama Mata Kuliah</label>
                                    <p className="text-lg text-slate-800 group-hover:text-blue-600 transition-colors duration-200">{classDetail.course_name}</p>
                                </div>
                                
                                <div className="group">
                                    <label className="block text-sm font-semibold text-slate-600 mb-2 uppercase tracking-wide">Nama Kelas</label>
                                    <p className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-200">{classDetail.class_name}</p>
                                </div>
                            </div>
                            
                            <div className="space-y-6">
                                <div className="group">
                                    <label className="block text-sm font-semibold text-slate-600 mb-2 uppercase tracking-wide">Dosen Pengampu</label>
                                    <div className="flex items-center text-lg text-slate-800 group-hover:text-blue-600 transition-colors duration-200">
                                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-green-500 rounded-lg flex items-center justify-center mr-3">
                                            <MdPerson className="w-5 h-5 text-white" />
                                        </div>
                                        {classDetail.lecturer}
                                    </div>
                                </div>
                                
                                <div className="group">
                                    <label className="block text-sm font-semibold text-slate-600 mb-2 uppercase tracking-wide">Tahun Akademik</label>
                                    <p className="text-lg text-slate-800 group-hover:text-blue-600 transition-colors duration-200">{classDetail.academic_year} - {classDetail.semester_period}</p>
                                </div>
                                
                                <div className="group">
                                    <label className="block text-sm font-semibold text-slate-600 mb-2 uppercase tracking-wide">Kapasitas Maksimum</label>
                                    <div className="flex items-center text-lg text-slate-800 group-hover:text-blue-600 transition-colors duration-200">
                                        <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                                            <MdPeople className="w-5 h-5 text-white" />
                                        </div>
                                        {classDetail.max_students} mahasiswa
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Schedule Card - Enhanced */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300" data-aos="fade-up" data-aos-delay="100">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                                    <MdSchedule className="w-6 h-6 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Jadwal Perkuliahan</h2>
                            </div>
                            <button
                                onClick={handleEditSchedule}
                                className="inline-flex items-center px-5 py-2.5 text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                <MdEdit className="w-4 h-4 mr-2" />
                                Edit Jadwal
                            </button>
                        </div>
                        
                        {classDetail.schedule && Array.isArray(classDetail.schedule) && classDetail.schedule.length > 0 ? (
                            <div className="space-y-4">
                                {classDetail.schedule.map((schedule, index) => (
                                    <div key={index} className="group relative overflow-hidden">
                                        <div className="flex items-center justify-between p-5 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border border-slate-200/60 hover:border-blue-300/60 transition-all duration-300 hover:shadow-lg">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-4 shadow-md">
                                                    <MdCalendarToday className="w-5 h-5 text-white" />
                                                </div>
                                                <span className="font-bold text-slate-900 text-lg">{schedule.day}</span>
                                            </div>
                                            <div className="flex items-center text-slate-700 bg-white/60 rounded-lg px-4 py-2 backdrop-blur-sm">
                                                <MdAccessTime className="w-5 h-5 mr-3 text-blue-600" />
                                                <span className="font-semibold">{schedule.start_time || schedule.start} - {schedule.end_time || schedule.end}</span>
                                            </div>
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl border-2 border-dashed border-slate-300">
                                <div className="w-20 h-20 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <MdSchedule className="w-10 h-10 text-slate-500" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-700 mb-3">Tidak ada jadwal yang ditetapkan</h3>
                                <p className="text-slate-500 mb-6 max-w-md mx-auto">Jadwal perkuliahan belum diatur untuk kelas ini. Silakan tambahkan jadwal untuk mengaktifkan sistem akses ruangan.</p>
                                <button
                                    onClick={handleEditSchedule}
                                    className="inline-flex items-center px-6 py-3 text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                >
                                    <MdAdd className="w-5 h-5 mr-2" />
                                    Tambah Jadwal
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Attendance History - Enhanced */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300" data-aos="fade-up" data-aos-delay="200">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                                    <MdHistory className="w-6 h-6 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Riwayat Absensi</h2>
                            </div>
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={fetchAttendanceData}
                                    disabled={loadingAttendance}
                                    className="inline-flex items-center px-5 py-2.5 text-sm font-semibold text-slate-700 bg-white/80 border border-slate-300 rounded-xl hover:bg-slate-50 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                >
                                    <MdRefresh className={`w-4 h-4 mr-2 ${loadingAttendance ? 'animate-spin' : ''}`} />
                                    {loadingAttendance ? 'Memuat...' : 'Refresh'}
                                </button>
                                {attendanceData && attendanceData.length > 0 && (
                                    <button
                                        onClick={handleDownloadAttendance}
                                        className="inline-flex items-center px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-green-700 border border-transparent rounded-xl hover:from-emerald-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                    >
                                        <MdDownload className="w-4 h-4 mr-2" />
                                        Unduh Data
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Attendance Stats Cards - Enhanced */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                            <div className="bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 rounded-2xl p-6 text-center border border-blue-200/60 hover:shadow-lg transition-all duration-300 group">
                                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <MdCalendarToday className="w-7 h-7 text-white" />
                                </div>
                                <div className="text-3xl font-bold text-blue-700 mb-2">{attendanceStats.totalSessions}</div>
                                <div className="text-sm font-semibold text-blue-800 uppercase tracking-wide">Total Sesi</div>
                            </div>
                            <div className="bg-gradient-to-br from-emerald-50 via-green-100 to-emerald-200 rounded-2xl p-6 text-center border border-emerald-200/60 hover:shadow-lg transition-all duration-300 group">
                                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <MdCheckCircle className="w-7 h-7 text-white" />
                                </div>
                                <div className="text-3xl font-bold text-emerald-700 mb-2">{attendanceStats.presentCount}</div>
                                <div className="text-sm font-semibold text-emerald-800 uppercase tracking-wide">Hadir</div>
                            </div>
                            <div className="bg-gradient-to-br from-amber-50 via-yellow-100 to-orange-200 rounded-2xl p-6 text-center border border-amber-200/60 hover:shadow-lg transition-all duration-300 group">
                                <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <MdSchedule className="w-7 h-7 text-white" />
                                </div>
                                <div className="text-3xl font-bold text-amber-700 mb-2">{attendanceStats.lateCount}</div>
                                <div className="text-sm font-semibold text-amber-800 uppercase tracking-wide">Terlambat</div>
                            </div>
                            <div className="bg-gradient-to-br from-red-50 via-rose-100 to-red-200 rounded-2xl p-6 text-center border border-red-200/60 hover:shadow-lg transition-all duration-300 group">
                                <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <MdCancel className="w-7 h-7 text-white" />
                                </div>
                                <div className="text-3xl font-bold text-red-700 mb-2">{attendanceStats.absentCount}</div>
                                <div className="text-sm font-semibold text-red-800 uppercase tracking-wide">Tidak Hadir</div>
                            </div>
                        </div>
                        
                        {loadingAttendance ? (
                            <div className="text-center py-16 bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl border-2 border-dashed border-slate-300">
                                <div className="relative mb-8">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mx-auto flex items-center justify-center shadow-2xl">
                                        <MdHistory className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="absolute inset-0 w-16 h-16 mx-auto border-4 border-blue-200 rounded-2xl animate-pulse"></div>
                                    <div className="absolute inset-0 w-16 h-16 mx-auto">
                                        <div className="w-full h-full border-4 border-transparent border-t-blue-600 rounded-2xl animate-spin"></div>
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-slate-700 mb-3">Memuat Data Absensi</h3>
                                <p className="text-slate-500 mb-6 max-w-md mx-auto">Sedang mengambil riwayat absensi mahasiswa dari database. Mohon tunggu sebentar...</p>
                                <div className="flex justify-center space-x-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                </div>
                            </div>
                        ) : attendanceData && attendanceData.length > 0 ? (
                            <div className="space-y-6 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-400 scrollbar-track-slate-200">
                                {attendanceData.map((attendance, index) => (
                                    <div key={index} className="group relative overflow-hidden bg-white/60 backdrop-blur-sm rounded-2xl border border-white/40 hover:border-blue-300/60 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="relative p-6">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-5">
                                                    {/* Enhanced Avatar */}
                                                    <div className={`relative w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-white text-xl shadow-xl transform group-hover:scale-110 transition-transform duration-300 ${
                                                        attendance.status === 'present' ? 'bg-gradient-to-br from-emerald-400 to-green-600' :
                                                        attendance.status === 'late' ? 'bg-gradient-to-br from-amber-400 to-orange-600' :
                                                        'bg-gradient-to-br from-red-400 to-rose-600'
                                                    }`}>
                                                        {attendance.student_name?.charAt(0)?.toUpperCase() || 'M'}
                                                        <div className="absolute inset-0 bg-white/20 rounded-2xl animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                    </div>
                                                    
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center space-x-3 mb-2">
                                                            <h4 className="font-bold text-slate-900 text-xl truncate">{attendance.student_name}</h4>
                                                            <span className={`inline-flex items-center px-3 py-1 rounded-xl text-xs font-bold shadow-sm ${
                                                                attendance.status === 'present' 
                                                                    ? 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border border-emerald-200'
                                                                    : attendance.status === 'late'
                                                                        ? 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border border-amber-200'
                                                                        : 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-200'
                                                            }`}>
                                                                {attendance.status === 'present' ? 'HADIR' : 
                                                                 attendance.status === 'late' ? 'TERLAMBAT' : 'TIDAK HADIR'}
                                                            </span>
                                                        </div>
                                                        
                                                        <p className="text-sm text-slate-600 font-semibold mb-1">{attendance.student_number || attendance.student_id}</p>
                                                        <p className="text-xs text-slate-500 bg-slate-100 rounded-lg px-3 py-1 inline-block">
                                                            Sesi {attendance.session_number} - {attendance.session_topic}
                                                        </p>
                                                    </div>
                                                </div>
                                                
                                                <div className="text-right space-y-2 min-w-0">
                                                    <p className="text-sm font-bold text-slate-900 bg-slate-100 rounded-lg px-3 py-1">
                                                        {formatDate(attendance.session_date)}
                                                    </p>
                                                    <p className="text-xl font-bold text-blue-600">
                                                        {attendance.check_in_time ? formatTime(attendance.check_in_time) : '-'}
                                                    </p>
                                                    
                                                    <div className="flex items-center justify-end space-x-2 mt-3">
                                                        {attendance.attendance_method && (
                                                            <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-white/80 text-slate-700 border border-slate-200 shadow-sm">
                                                                {attendance.attendance_method === 'face_recognition' ? (
                                                                    <>
                                                                        <MdFace className="w-3 h-3 mr-1" />
                                                                        Face ID
                                                                    </>
                                                                ) : attendance.attendance_method === 'manual' ? (
                                                                    <>
                                                                        <MdEdit className="w-3 h-3 mr-1" />
                                                                        Manual
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <MdQrCode className="w-3 h-3 mr-1" />
                                                                        QR Code
                                                                    </>
                                                                )}
                                                            </span>
                                                        )}
                                                    </div>
                                                    
                                                    {attendance.confidence_score && (
                                                        <div className="flex items-center justify-end mt-2">
                                                            <span className="text-xs text-slate-500 font-medium mr-1">Confidence: </span>
                                                            <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                                                                attendance.confidence_score >= 0.8 ? 'bg-emerald-100 text-emerald-700' :
                                                                attendance.confidence_score >= 0.6 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                                                            }`}>
                                                                {(attendance.confidence_score * 100).toFixed(1)}%
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl border-2 border-dashed border-slate-300">
                                <div className="w-24 h-24 bg-gradient-to-br from-slate-200 to-slate-300 rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-xl">
                                    <MdHistory className="w-12 h-12 text-slate-500" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-700 mb-4">Belum Ada Data Absensi</h3>
                                <div className="max-w-md mx-auto space-y-3">
                                    <p className="text-slate-500 leading-relaxed">Data absensi akan muncul setelah mahasiswa melakukan check-in menggunakan sistem face recognition atau QR code.</p>
                                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-6">
                                        <h4 className="font-semibold text-blue-800 mb-2">Tips untuk Administrator:</h4>
                                        <ul className="text-sm text-blue-700 space-y-1 text-left">
                                            <li>• Pastikan sistem face recognition sudah aktif</li>
                                            <li>• Verify mahasiswa sudah terdaftar dalam sistem</li>
                                            <li>• Check jadwal perkuliahan sudah sesuai</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Sidebar - Enhanced */}
                <div className="space-y-8">
                    {/* Quick Stats - Enhanced */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300" data-aos="fade-up" data-aos-delay="300">
                        <div className="flex items-center mb-6">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                                <MdInfo className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 tracking-tight">Statistik Kelas</h3>
                        </div>
                        
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                                <span className="text-slate-600 font-semibold">Mahasiswa Terdaftar</span>
                                <span className="font-bold text-3xl text-blue-600">{classDetail.enrolled_students}</span>
                            </div>
                            
                            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-100">
                                <span className="text-slate-600 font-semibold">Total Akses</span>
                                <span className="font-bold text-3xl text-emerald-600">
                                    {classDetail.accessLogs ? classDetail.accessLogs.length : 0}
                                </span>
                            </div>
                            
                            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl border border-slate-100">
                                <span className="text-slate-600 font-semibold">Kapasitas Maksimum</span>
                                <span className="font-bold text-2xl text-slate-600">{classDetail.max_students}</span>
                            </div>
                            
                            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                                <span className="text-slate-600 font-semibold">Status</span>
                                <span className={`font-bold text-lg ${classDetail.active ? 'text-emerald-600' : 'text-slate-600'}`}>
                                    {classDetail.active ? 'Aktif' : 'Nonaktif'}
                                </span>
                            </div>

                            {/* Enhanced Progress Bar */}
                            <div className="pt-4">
                                <div className="flex items-center justify-between text-sm text-slate-600 mb-3">
                                    <span className="font-semibold">Penggunaan Kapasitas</span>
                                    <span className="font-bold text-lg">{Math.round((classDetail.enrolled_students / classDetail.max_students) * 100)}%</span>
                                </div>
                                <div className="relative w-full bg-slate-200 rounded-full h-4 overflow-hidden shadow-inner">
                                    <div 
                                        className={`h-4 rounded-full transition-all duration-1000 ease-out relative overflow-hidden ${
                                            (classDetail.enrolled_students / classDetail.max_students) > 0.9 
                                                ? 'bg-gradient-to-r from-red-500 to-red-600' 
                                                : (classDetail.enrolled_students / classDetail.max_students) > 0.7 
                                                    ? 'bg-gradient-to-r from-amber-500 to-orange-600' 
                                                    : 'bg-gradient-to-r from-emerald-500 to-green-600'
                                        }`}
                                        style={{ width: `${Math.min((classDetail.enrolled_students / classDetail.max_students) * 100, 100)}%` }}
                                    >
                                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions - Enhanced */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300" data-aos="fade-up" data-aos-delay="400">
                        <div className="flex items-center mb-6">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                                <MdSecurity className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 tracking-tight">Aksi</h3>
                        </div>
                        
                        <div className="space-y-4">
                            {classDetail.active ? (
                                <button 
                                    onClick={handleRevokeAccess}
                                    className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-red-600 to-rose-700 text-white rounded-xl hover:from-red-700 hover:to-rose-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold"
                                >
                                    <MdSecurity className="w-5 h-5 mr-3" />
                                    Cabut Akses Ruangan
                                </button>
                            ) : (
                                <button 
                                    onClick={handleGrantAccess}
                                    className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-emerald-600 to-green-700 text-white rounded-xl hover:from-emerald-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold"
                                >
                                    <MdSecurity className="w-5 h-5 mr-3" />
                                    Berikan Akses Ruangan
                                </button>
                            )}
                            
                            <button 
                                onClick={fetchClassDetail}
                                className="w-full flex items-center justify-center px-6 py-4 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-semibold"
                            >
                                <MdRefresh className="w-5 h-5 mr-3" />
                                Refresh Data
                            </button>

                            {classDetail.accessLogs && classDetail.accessLogs.length > 0 && (
                                <button 
                                    onClick={handleDownloadReport}
                                    className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-slate-600 to-gray-700 text-white rounded-xl hover:from-slate-700 hover:to-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold"
                                >
                                    <MdDownload className="w-5 h-5 mr-3" />
                                    Unduh Laporan CSV
                                </button>
                            )}
                        </div>
                    </div>

                    {/* System Info - Enhanced */}
                    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border border-blue-200/60 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300" data-aos="fade-up" data-aos-delay="500">
                        <div className="flex items-center mb-6">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                                <MdInfo className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-blue-800 tracking-tight">Informasi Sistem</h3>
                        </div>
                        <div className="space-y-4 text-sm text-blue-700">
                            <div className="flex items-start">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                <p className="leading-relaxed">Sistem menggunakan satu pintu untuk semua kelas dengan kontrol akses terpusat</p>
                            </div>
                            <div className="flex items-start">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                <p className="leading-relaxed">Akses diatur berdasarkan jadwal perkuliahan yang telah ditetapkan</p>
                            </div>
                            <div className="flex items-start">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                <p className="leading-relaxed">Riwayat akses tersimpan selama 30 hari untuk keperluan audit</p>
                            </div>
                            <div className="flex items-start">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                <p className="leading-relaxed">Status akses dapat diubah sewaktu-waktu oleh administrator</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Schedule Edit Modal - Enhanced */}
            {isEditingSchedule && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
                    <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 max-w-5xl w-full max-h-[90vh] overflow-hidden animate-slideIn">
                        {/* Modal Header */}
                        <div className="relative p-8 border-b border-slate-200/60 bg-gradient-to-r from-blue-600 to-indigo-700">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-4">
                                        <MdSchedule className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-white tracking-tight">Edit Jadwal Perkuliahan</h3>
                                        <p className="text-blue-100 mt-1">Atur jadwal kelas untuk mengoptimalkan akses ruangan</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleCancelEditSchedule}
                                    className="text-white/80 hover:text-white hover:bg-white/20 rounded-xl p-2 transition-all duration-200"
                                >
                                    <MdCancel className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-8 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-400 scrollbar-track-slate-200">
                            {/* Conflict warnings - Enhanced */}
                            {conflicts.length > 0 && (
                                <div className="mb-8 p-6 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200/60 rounded-2xl shadow-lg">
                                    <div className="flex items-center mb-4">
                                        <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center mr-4">
                                            <MdWarning className="w-6 h-6 text-red-600" />
                                        </div>
                                        <h4 className="font-bold text-red-800 text-lg">Konflik Jadwal Ditemukan</h4>
                                    </div>
                                    <ul className="text-sm text-red-700 space-y-2 bg-white/60 rounded-xl p-4">
                                        {conflicts.map((conflict, index) => (
                                            <li key={index} className="flex items-start">
                                                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                                <span>{conflict.message}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Schedule slots - Enhanced */}
                            <div className="space-y-6">
                                {scheduleData.map((schedule, index) => (
                                    <div key={schedule.id || index} className={`relative overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
                                        conflicts.some(c => c.indices.includes(index)) 
                                            ? 'border-red-300 bg-gradient-to-r from-red-50 to-rose-50 shadow-lg' 
                                            : 'border-slate-200 bg-gradient-to-r from-white to-slate-50 hover:border-blue-300 hover:shadow-lg'
                                    }`}>
                                        {/* Header */}
                                        <div className="flex items-center justify-between p-6 border-b border-slate-200/60">
                                            <div className="flex items-center">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 shadow-md ${
                                                    conflicts.some(c => c.indices.includes(index)) 
                                                        ? 'bg-red-500' 
                                                        : 'bg-gradient-to-br from-blue-500 to-indigo-600'
                                                }`}>
                                                    <span className="text-white font-bold">{index + 1}</span>
                                                </div>
                                                <h5 className="font-bold text-slate-800 text-lg">Slot Jadwal {index + 1}</h5>
                                            </div>
                                            {scheduleData.length > 1 && (
                                                <button
                                                    onClick={() => removeScheduleSlot(index)}
                                                    className="text-red-600 hover:text-red-800 hover:bg-red-100 rounded-xl p-2 transition-all duration-200"
                                                >
                                                    <MdDelete className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>

                                        {/* Form Fields */}
                                        <div className="p-6">
                                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                                {/* Day selection */}
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
                                                        Hari Perkuliahan
                                                    </label>
                                                    <select
                                                        value={schedule.day || ''}
                                                        onChange={(e) => updateScheduleSlot(index, 'day', e.target.value)}
                                                        className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm hover:border-slate-400 font-medium"
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
                                                    <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
                                                        Waktu Mulai
                                                    </label>
                                                    <input
                                                        type="time"
                                                        value={schedule.start_time || ''}
                                                        onChange={(e) => updateScheduleSlot(index, 'start_time', e.target.value)}
                                                        className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm hover:border-slate-400 font-medium"
                                                    />
                                                </div>

                                                {/* End time */}
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
                                                        Waktu Selesai
                                                    </label>
                                                    <input
                                                        type="time"
                                                        value={schedule.end_time || ''}
                                                        onChange={(e) => updateScheduleSlot(index, 'end_time', e.target.value)}
                                                        className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm hover:border-slate-400 font-medium"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Add schedule button - Enhanced */}
                            <div className="mt-8 text-center">
                                <button
                                    onClick={addScheduleSlot}
                                    className="inline-flex items-center px-6 py-3 text-sm font-semibold border-2 border-dashed border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                >
                                    <MdAdd className="w-5 h-5 mr-2" />
                                    Tambah Slot Jadwal Baru
                                </button>
                            </div>
                        </div>

                        {/* Modal footer - Enhanced */}
                        <div className="p-8 border-t border-slate-200/60 bg-slate-50/80 backdrop-blur-sm flex items-center justify-end space-x-4">
                            <button
                                onClick={handleCancelEditSchedule}
                                className="px-6 py-3 text-slate-700 font-semibold border-2 border-slate-300 rounded-xl hover:bg-slate-100 hover:border-slate-400 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                disabled={savingSchedule}
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleSaveSchedule}
                                disabled={savingSchedule || conflicts.length > 0}
                                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
                            >
                                {savingSchedule ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                        Menyimpan Jadwal...
                                    </>
                                ) : (
                                    <>
                                        <MdSave className="w-5 h-5 mr-2" />
                                        Simpan Jadwal
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            </div>
        </div>
    );
};

export default ClassAccessDetail;