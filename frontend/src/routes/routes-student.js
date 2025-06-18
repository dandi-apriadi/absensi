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
  MdQrCode,
  MdHistory,
  MdCalendarToday,
  MdBook,
  MdClass,
  MdHelpCenter,
  MdMessage,
  MdEmail,
  MdAssessment,
  MdFileDownload,
  MdVerified,
  MdSick,
  MdLocalHospital,
  MdQrCodeScanner,
  MdNotifications,
  MdPersonPin
} from "react-icons/md";

// Import components (these would need to be created)
import StudentDashboard from "views/student/dashboard";
import AttendanceCalendar from "views/student/dashboard/components/AttendanceCalendar";
import CourseSchedule from "views/student/courses";
import CourseList from "views/student/courses/components/CourseList";
import CourseDetails from "views/student/courses/components/CourseDetails";
import MyAttendance from "views/student/attendance";
import AttendanceHistory from "views/student/attendance/components/AttendanceHistory";
import AttendanceReport from "views/student/attendance/components/AttendanceReport";
import FaceRegistration from "views/student/face-registration";
import ProfileSettings from "views/student/settings";
import Help from "views/student/help";
import UserGuide from "views/student/help/components/UserGuide";
import FAQ from "views/student/help/components/FAQ";
import ContactSupport from "views/student/help/components/ContactSupport";
import LeaveRequestForm from "views/student/leave-requests/LeaveRequestForm";
import LeaveRequestHistory from "views/student/leave-requests/LeaveRequestHistory";
import QRCodeGenerator from "views/student/qr-code/QRCodeGenerator";
import NotificationCenter from "views/student/notifications/NotificationCenter";
import StudentProfile from "views/student/profile/StudentProfile";

const routes = [
  {
    name: "Dashboard",
    layout: "/student",
    path: "default",
    icon: <MdDashboard className="h-6 w-6" />,
    component: <StudentDashboard />,
  },
  {
    name: "Kalender Kehadiran",
    layout: "/student",
    parentPath: "default",
    path: "attendance-calendar",
    icon: <MdCalendarToday className="h-6 w-6 ml-10" />,
    component: <AttendanceCalendar />,
    secondary: true,
  },
  {
    name: "Jadwal Perkuliahan",
    layout: "/student",
    path: "schedule",
    icon: <MdBook className="h-6 w-6" />,
    component: <CourseSchedule />,
  },
  {
    name: "Daftar Mata Kuliah",
    layout: "/student",
    parentPath: "schedule",
    path: "course-list",
    icon: <MdClass className="h-6 w-6 ml-10" />,
    component: <CourseList />,
    secondary: true,
  },
  {
    name: "Detail Mata Kuliah",
    layout: "/student",
    parentPath: "schedule",
    path: "course-details",
    icon: <MdSchool className="h-6 w-6 ml-10" />,
    component: <CourseDetails />,
    secondary: true,
  },
  {
    name: "Kehadiran Saya",
    layout: "/student",
    path: "my-attendance",
    icon: <MdVerified className="h-6 w-6" />,
    component: <MyAttendance />,
  },
  {
    name: "Riwayat Kehadiran",
    layout: "/student",
    parentPath: "my-attendance",
    path: "attendance-history",
    icon: <MdHistory className="h-6 w-6 ml-10" />,
    component: <AttendanceHistory />,
    secondary: true,
  },
  {
    name: "Laporan Kehadiran",
    layout: "/student",
    parentPath: "my-attendance",
    path: "attendance-report",
    icon: <MdFileDownload className="h-6 w-6 ml-10" />,
    component: <AttendanceReport />,
    secondary: true,
  },
  {
    name: "Registrasi Wajah",
    layout: "/student",
    path: "face-registration",
    icon: <MdFace className="h-6 w-6" />,
    component: <FaceRegistration />,
  },
  {
    name: "QR Code Absensi",
    layout: "/student",
    path: "qr-code",
    icon: <MdQrCodeScanner className="h-6 w-6" />,
    component: <QRCodeGenerator />,
  },
  {
    name: "Pengajuan Izin/Sakit",
    layout: "/student",
    path: "leave-requests",
    icon: <MdLocalHospital className="h-6 w-6" />,
    component: <LeaveRequestForm />,
  },
  {
    name: "Riwayat Pengajuan",
    layout: "/student",
    parentPath: "leave-requests",
    path: "request-history",
    icon: <MdHistory className="h-6 w-6 ml-10" />,
    component: <LeaveRequestHistory />,
    secondary: true,
  },
  {
    name: "Notifikasi",
    layout: "/student",
    path: "notifications",
    icon: <MdNotifications className="h-6 w-6" />,
    component: <NotificationCenter />,
  },
  {
    name: "Profil Saya",
    layout: "/student",
    path: "profile",
    icon: <MdPersonPin className="h-6 w-6" />,
    component: <StudentProfile />,
  },
  {
    name: "Pengaturan",
    layout: "/student",
    path: "settings",
    icon: <MdSettings className="h-6 w-6" />,
    component: <ProfileSettings />,
  },
  {
    name: "Bantuan",
    layout: "/student",
    path: "help",
    icon: <MdHelpCenter className="h-6 w-6" />,
    component: <Help />,
  },
  {
    name: "Panduan Pengguna",
    layout: "/student",
    parentPath: "help",
    path: "user-guide",
    icon: <MdSchool className="h-6 w-6 ml-10" />,
    component: <UserGuide />,
    secondary: true,
  },
  {
    name: "FAQ",
    layout: "/student",
    parentPath: "help",
    path: "faq",
    icon: <MdMessage className="h-6 w-6 ml-10" />,
    component: <FAQ />,
    secondary: true,
  },
  {
    name: "Hubungi Support",
    layout: "/student",
    parentPath: "help",
    path: "contact-support",
    icon: <MdEmail className="h-6 w-6 ml-10" />,
    component: <ContactSupport />,
    secondary: true,
  },
  {
    name: "Logout",
    layout: "/student",
    path: "logout",
    icon: <MdExitToApp className="h-6 w-6" />,
    component: <Logout />,
  },
];

export default routes;
