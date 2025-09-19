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

                    {/* Attendance History - Minimal Table */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6" data-aos="fade-up" data-aos-delay="200">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-slate-800">Riwayat Absensi</h2>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={fetchAttendanceData}
                                    disabled={loadingAttendance}
                                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-slate-700 border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50"
                                >
                                    <MdRefresh className={`w-4 h-4 mr-1 ${loadingAttendance ? 'animate-spin' : ''}`} />
                                    {loadingAttendance ? 'Memuat' : 'Refresh'}
                                </button>
                                {attendanceData && attendanceData.length > 0 && (
                                    <button
                                        onClick={handleDownloadAttendance}
                                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-slate-700 border border-slate-300 rounded-md hover:bg-slate-50"
                                    >
                                        <MdDownload className="w-4 h-4 mr-1" />
                                        Unduh CSV
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Compact summary chips */}
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                            <span className="px-2.5 py-1 text-xs font-medium text-slate-700 border border-slate-300 rounded-md">Total Sesi: {attendanceStats.totalSessions}</span>
                            <span className="px-2.5 py-1 text-xs font-medium text-slate-700 border border-slate-300 rounded-md">Hadir: {attendanceStats.presentCount}</span>
                            <span className="px-2.5 py-1 text-xs font-medium text-slate-700 border border-slate-300 rounded-md">Terlambat: {attendanceStats.lateCount}</span>
                            <span className="px-2.5 py-1 text-xs font-medium text-slate-700 border border-slate-300 rounded-md">Tidak Hadir: {attendanceStats.absentCount}</span>
                        </div>

                        {loadingAttendance ? (
                            <div className="py-10 text-center text-slate-600 text-sm">Memuat data absensi...</div>
                        ) : attendanceData && attendanceData.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm">
                                    <thead className="bg-slate-50 border-b border-slate-200">
                                        <tr>
                                            <th className="px-3 py-2 text-left font-semibold text-slate-700">No</th>
                                            <th className="px-3 py-2 text-left font-semibold text-slate-700">Nama</th>
                                            <th className="px-3 py-2 text-left font-semibold text-slate-700">NIM</th>
                                            <th className="px-3 py-2 text-left font-semibold text-slate-700">Status</th>
                                            <th className="px-3 py-2 text-left font-semibold text-slate-700">Sesi</th>
                                            <th className="px-3 py-2 text-left font-semibold text-slate-700">Tanggal</th>
                                            <th className="px-3 py-2 text-left font-semibold text-slate-700">Check-in</th>
                                            <th className="px-3 py-2 text-left font-semibold text-slate-700">Metode</th>
                                            <th className="px-3 py-2 text-left font-semibold text-slate-700">Confidence</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {attendanceData.map((attendance, index) => (
                                            <tr key={index} className="hover:bg-slate-50">
                                                <td className="px-3 py-2 text-slate-700">{index + 1}</td>
                                                <td className="px-3 py-2 text-slate-800">{attendance.student_name}</td>
                                                <td className="px-3 py-2 text-slate-700">{attendance.student_number || attendance.student_id}</td>
                                                <td className="px-3 py-2">
                                                    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded ${
                                                        attendance.status === 'present' ? 'bg-slate-100 text-slate-800' :
                                                        attendance.status === 'late' ? 'bg-slate-100 text-slate-800' : 'bg-slate-100 text-slate-800'
                                                    }`}>
                                                        {attendance.status === 'present' ? 'Hadir' : attendance.status === 'late' ? 'Terlambat' : 'Tidak Hadir'}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-2 text-slate-700">{attendance.session_number} - {attendance.session_topic || '-'}</td>
                                                <td className="px-3 py-2 text-slate-700">{formatDate(attendance.session_date)}</td>
                                                <td className="px-3 py-2 text-slate-700">{attendance.check_in_time ? formatTime(attendance.check_in_time) : '-'}</td>
                                                <td className="px-3 py-2 text-slate-700">
                                                    {attendance.attendance_method === 'face_recognition' ? 'Face ID' : attendance.attendance_method === 'manual' ? 'Manual' : 'QR Code'}
                                                </td>
                                                <td className="px-3 py-2 text-slate-700">{attendance.confidence_score ? `${(attendance.confidence_score * 100).toFixed(1)}%` : '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="py-10 text-center text-slate-600 text-sm">Belum ada data absensi.</div>
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