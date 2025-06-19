import React from "react";
// Admin Imports
import Logout from "views/auth/Logout";
// Icon Imports
import {
  MdExitToApp,
  MdDashboard,
  MdSettings,
  MdSchool,
  MdFace,
  MdHistory,
  MdBook,
  MdAccessTime,
  MdVerified,
  MdAutoGraph,
  MdEventNote,
  MdNotifications,
  MdPersonPin
} from "react-icons/md";

// Import components (these would need to be created)
import LecturerDashboard from "views/lecturer/dashboard";
import CourseManagement from "views/lecturer/courses";
import AttendanceManagement from "views/lecturer/attendance";
import TakeAttendance from "views/lecturer/attendance/components/TakeAttendance";
import AttendanceHistory from "views/lecturer/attendance/components/AttendanceHistory";
import ManualAttendance from "views/lecturer/attendance/components/ManualAttendance";
import StudentPerformance from "views/lecturer/students";
import ProfileSettings from "views/lecturer/settings";
import AttendancePatterns from "views/lecturer/analytics/AttendancePatterns";
import SessionManagement from "views/lecturer/sessions";
import NotificationCenter from "views/lecturer/notifications/NotificationCenter";
import LecturerProfile from "views/lecturer/profile/LecturerProfile";
import QRCodeScanner from "views/lecturer/qr-code/QRCodeScanner";

const routes = [
  // ================================
  // MAIN DASHBOARD
  // ================================
  {
    name: "Dashboard",
    layout: "/lecturer",
    path: "default",
    icon: <MdDashboard className="h-6 w-6" />,
    component: <LecturerDashboard />,
  },

  // ================================
  // COURSE MANAGEMENT (CONSOLIDATED)
  // ================================
  {
    name: "Manajemen Mata Kuliah",
    layout: "/lecturer",
    path: "courses",
    icon: <MdBook className="h-6 w-6" />,
    component: <CourseManagement />,
  },

  // ================================
  // ATTENDANCE MANAGEMENT
  // ================================
  {
    name: "Manajemen Absensi",
    layout: "/lecturer",
    path: "attendance",
    icon: <MdAccessTime className="h-6 w-6" />,
    component: <AttendanceManagement />,
  },
  {
    name: "Ambil Absensi",
    layout: "/lecturer",
    parentPath: "attendance",
    path: "take-attendance",
    icon: <MdFace className="h-6 w-6 ml-10" />,
    component: <TakeAttendance />,
    secondary: true,
  },
  {
    name: "Riwayat Absensi",
    layout: "/lecturer",
    parentPath: "attendance",
    path: "attendance-history",
    icon: <MdHistory className="h-6 w-6 ml-10" />,
    component: <AttendanceHistory />,
    secondary: true,
  }, {
    name: "Absensi Manual",
    layout: "/lecturer",
    parentPath: "attendance",
    path: "manual-attendance",
    icon: <MdVerified className="h-6 w-6 ml-10" />,
    component: <ManualAttendance />,
    secondary: true,
  },

  // ================================
  // STUDENT MANAGEMENT (CONSOLIDATED)
  // ================================
  {
    name: "Performa Mahasiswa",
    layout: "/lecturer",
    path: "students",
    icon: <MdSchool className="h-6 w-6" />,
    component: <StudentPerformance />,
  },


  // ================================
  // ANALYTICS - KEPT SEPARATE FOR DETAILED ANALYSIS
  // ================================
  {
    name: "Analisis Pola Kehadiran",
    layout: "/lecturer",
    path: "attendance-patterns",
    icon: <MdAutoGraph className="h-6 w-6" />,
    component: <AttendancePatterns />,
  },

  // ================================
  // SESSION MANAGEMENT (CONSOLIDATED)
  // ================================
  {
    name: "Manajemen Sesi",
    layout: "/lecturer",
    path: "sessions",
    icon: <MdEventNote className="h-6 w-6" />,
    component: <SessionManagement />,
  },

  // ================================
  // NOTIFICATIONS
  // ================================
  {
    name: "Notifikasi",
    layout: "/lecturer",
    path: "notifications",
    icon: <MdNotifications className="h-6 w-6" />,
    component: <NotificationCenter />,
  },

  // ================================
  // PROFILE & SETTINGS
  // ================================
  {
    name: "Profil Saya",
    layout: "/lecturer",
    path: "profile",
    icon: <MdPersonPin className="h-6 w-6" />,
    component: <LecturerProfile />,
  },
  {
    name: "Pengaturan",
    layout: "/lecturer",
    path: "settings",
    icon: <MdSettings className="h-6 w-6" />,
    component: <ProfileSettings />,
  },

  {
    name: "Logout",
    layout: "/lecturer",
    path: "logout",
    icon: <MdExitToApp className="h-6 w-6" />,
    component: <Logout />,
  },
];
export default routes;
