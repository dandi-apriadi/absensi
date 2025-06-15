import React from "react";
// Admin Imports
import Logout from "views/auth/Logout";
// Icon Imports
import {
  MdExitToApp,
  MdDashboard,
  MdSettings,
  MdSchool,
  MdPerson,
  MdFace,
  MdQrCode,
  MdInsights,
  MdBarChart,
  MdAssessment,
  MdHistory,
  MdGroups,
  MdAnalytics,
  MdBook,
  MdClass,
  MdAccessTime,
  MdList,
  MdVerified,
  MdFileDownload,
  MdHelpCenter,
  MdMessage,
  MdEmail,
  MdTrendingUp,
  MdAutoGraph,
  MdEventNote,
  MdPresentToAll,
  MdNotifications,
  MdPersonPin,
  MdApproval,
  MdSick
} from "react-icons/md";

// Import components (these would need to be created)
import LecturerDashboard from "views/lecturer/dashboard";
import AttendanceOverview from "views/lecturer/dashboard/components/AttendanceOverview";
import CourseAttendanceStats from "views/lecturer/dashboard/components/CourseAttendanceStats";
import CourseManagement from "views/lecturer/courses";
import CourseList from "views/lecturer/courses/components/CourseList";
import CourseDetails from "views/lecturer/courses/components/CourseDetails";
import AttendanceManagement from "views/lecturer/attendance";
import TakeAttendance from "views/lecturer/attendance/components/TakeAttendance";
import AttendanceHistory from "views/lecturer/attendance/components/AttendanceHistory";
import ManualAttendance from "views/lecturer/attendance/components/ManualAttendance";
import ExportAttendance from "views/lecturer/attendance/components/ExportAttendance";
import StudentPerformance from "views/lecturer/students";
import StudentsList from "views/lecturer/students/components/StudentsList";
import AttendanceStats from "views/lecturer/students/components/AttendanceStats";
import ProfileSettings from "views/lecturer/settings";
import Help from "views/lecturer/help";
import UserGuide from "views/lecturer/help/components/UserGuide";
import FAQ from "views/lecturer/help/components/FAQ";
import ContactSupport from "views/lecturer/help/components/ContactSupport";
import AttendancePatterns from "views/lecturer/analytics/AttendancePatterns";
import SessionManagement from "views/lecturer/sessions";
import ActiveSessions from "views/lecturer/sessions/components/ActiveSessions";
import SessionHistory from "views/lecturer/sessions/components/SessionHistory";
import LeaveRequestManagement from "views/lecturer/leave-requests/LeaveRequestManagement";
import PendingRequests from "views/lecturer/leave-requests/components/PendingRequests";
import RequestHistory from "views/lecturer/leave-requests/components/RequestHistory";
import NotificationCenter from "views/lecturer/notifications/NotificationCenter";
import LecturerProfile from "views/lecturer/profile/LecturerProfile";
import QRCodeScanner from "views/lecturer/qr-code/QRCodeScanner";

const routes = [
  {
    name: "Dashboard",
    layout: "/lecturer",
    path: "default",
    icon: <MdDashboard className="h-6 w-6" />,
    component: <LecturerDashboard />,
  },
  {
    name: "Overview Absensi",
    layout: "/lecturer",
    parentPath: "default",
    path: "attendance-overview",
    icon: <MdInsights className="h-6 w-6 ml-10" />,
    component: <AttendanceOverview />,
    secondary: true,
  },
  {
    name: "Statistik Mata Kuliah",
    layout: "/lecturer",
    parentPath: "default",
    path: "course-stats",
    icon: <MdBarChart className="h-6 w-6 ml-10" />,
    component: <CourseAttendanceStats />,
    secondary: true,
  },
  {
    name: "Manajemen Mata Kuliah",
    layout: "/lecturer",
    path: "courses",
    icon: <MdBook className="h-6 w-6" />,
    component: <CourseManagement />,
  },
  {
    name: "Daftar Mata Kuliah",
    layout: "/lecturer",
    parentPath: "courses",
    path: "course-list",
    icon: <MdList className="h-6 w-6 ml-10" />,
    component: <CourseList />,
    secondary: true,
  },
  {
    name: "Detail Mata Kuliah",
    layout: "/lecturer",
    parentPath: "courses",
    path: "course-details",
    icon: <MdClass className="h-6 w-6 ml-10" />,
    component: <CourseDetails />,
    secondary: true,
  },
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
  },
  {
    name: "Absensi Manual",
    layout: "/lecturer",
    parentPath: "attendance",
    path: "manual-attendance",
    icon: <MdVerified className="h-6 w-6 ml-10" />,
    component: <ManualAttendance />,
    secondary: true,
  },
  {
    name: "Export Data Absensi",
    layout: "/lecturer",
    parentPath: "attendance",
    path: "export-attendance",
    icon: <MdFileDownload className="h-6 w-6 ml-10" />,
    component: <ExportAttendance />,
    secondary: true,
  },
  {
    name: "QR Code Scanner",
    layout: "/lecturer",
    parentPath: "attendance",
    path: "qr-code-scanner",
    icon: <MdQrCode className="h-6 w-6 ml-10" />,
    component: <QRCodeScanner />,
    secondary: true,
  },
  {
    name: "Performa Mahasiswa",
    layout: "/lecturer",
    path: "students",
    icon: <MdSchool className="h-6 w-6" />,
    component: <StudentPerformance />,
  },
  {
    name: "Daftar Mahasiswa",
    layout: "/lecturer",
    parentPath: "students",
    path: "students-list",
    icon: <MdGroups className="h-6 w-6 ml-10" />,
    component: <StudentsList />,
    secondary: true,
  },
  {
    name: "Statistik Kehadiran",
    layout: "/lecturer",
    parentPath: "students",
    path: "attendance-stats",
    icon: <MdTrendingUp className="h-6 w-6 ml-10" />,
    component: <AttendanceStats />,
    secondary: true,
  },
  {
    name: "Manajemen Izin/Sakit",
    layout: "/lecturer",
    path: "leave-requests",
    icon: <MdSick className="h-6 w-6" />,
    component: <LeaveRequestManagement />,
  },
  {
    name: "Permintaan Tertunda",
    layout: "/lecturer",
    parentPath: "leave-requests",
    path: "pending-requests",
    icon: <MdApproval className="h-6 w-6 ml-10" />,
    component: <PendingRequests />,
    secondary: true,
  },
  {
    name: "Riwayat Permintaan",
    layout: "/lecturer",
    parentPath: "leave-requests",
    path: "request-history",
    icon: <MdHistory className="h-6 w-6 ml-10" />,
    component: <RequestHistory />,
    secondary: true,
  },
  {
    name: "Analisis Pola Kehadiran",
    layout: "/lecturer",
    path: "attendance-patterns",
    icon: <MdAutoGraph className="h-6 w-6" />,
    component: <AttendancePatterns />,
  },
  {
    name: "Manajemen Sesi",
    layout: "/lecturer",
    path: "sessions",
    icon: <MdEventNote className="h-6 w-6" />,
    component: <SessionManagement />,
  },
  {
    name: "Sesi Aktif",
    layout: "/lecturer",
    parentPath: "sessions",
    path: "active-sessions",
    icon: <MdPresentToAll className="h-6 w-6 ml-10" />,
    component: <ActiveSessions />,
    secondary: true,
  },
  {
    name: "Riwayat Sesi",
    layout: "/lecturer",
    parentPath: "sessions",
    path: "session-history",
    icon: <MdHistory className="h-6 w-6 ml-10" />,
    component: <SessionHistory />,
    secondary: true,
  },
  {
    name: "Notifikasi",
    layout: "/lecturer",
    path: "notifications",
    icon: <MdNotifications className="h-6 w-6" />,
    component: <NotificationCenter />,
  },
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
    name: "Bantuan",
    layout: "/lecturer",
    path: "help",
    icon: <MdHelpCenter className="h-6 w-6" />,
    component: <Help />,
  },
  {
    name: "Panduan Pengguna",
    layout: "/lecturer",
    parentPath: "help",
    path: "user-guide",
    icon: <MdSchool className="h-6 w-6 ml-10" />,
    component: <UserGuide />,
    secondary: true,
  },
  {
    name: "FAQ",
    layout: "/lecturer",
    parentPath: "help",
    path: "faq",
    icon: <MdMessage className="h-6 w-6 ml-10" />,
    component: <FAQ />,
    secondary: true,
  },
  {
    name: "Hubungi Support",
    layout: "/lecturer",
    parentPath: "help",
    path: "contact-support",
    icon: <MdEmail className="h-6 w-6 ml-10" />,
    component: <ContactSupport />,
    secondary: true,
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
