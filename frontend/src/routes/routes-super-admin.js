import React from "react";
// Admin Imports
import Logout from "../views/auth/Logout";

/**
 * OPTIMASI ROUTES SUPER ADMIN - VERSI ULTRA SIMPLIFIED
 * ====================================================
 * 
 * HALAMAN YANG DINONAKTIFKAN (dengan komentar):
 * 1. StudentManagement & LecturerManagement - REDUNDAN dengan UsersList (gunakan filter)
 * 2. AttendanceExport - DIGABUNG ke AttendanceHistory
 * 3. AccessLogs & AccessMonitoring - DIGABUNG ke RoomAccess dengan tab
 * 4. HardwareMonitoring - DIGABUNG ke SystemLogs
 * 5. ActivityLogs & SecurityAlerts - DIGABUNG ke SystemLogs dengan filter
 * 6. SystemLogs - DIHILANGKAN (terlalu teknis untuk admin basic)
 * 7. SystemSettings (semua sub-pages) - DIHILANGKAN (terlalu kompleks)
 * 8. ReportGenerator (semua sub-pages) - DIHILANGKAN (tidak diperlukan sistem basic)
 * 9. AnalyticsDashboard & sub-pages - DIHILANGKAN (tidak diperlukan sistem basic) * 10. SystemReset & BulkOperations - DIHAPUS/DIGABUNG (berbahaya/redundan)
 * 11. Help & sub-pages - DIHILANGKAN (tidak diperlukan admin berpengalaman)
 * 12. Import/Export Users - DIHILANGKAN (memperkompleks UI, tidak diperlukan sistem basic)
 * 
 * SISTEM SEKARANG FOKUS PADA CORE FUNCTIONALITY SAJA:
 * - Dashboard, User Management (basic), Face Dataset, Attendance, Room Access
 * - Notifications, Profile, Logout
 * 
 * TOTAL PENGURANGAN: 30 halaman → 7 halaman core (77% reduction)
 */
// Icon Imports (cleaned up - removed unused icons)
import {
  MdExitToApp,
  MdDashboard,
  MdPeople,
  MdFace,
  MdAccessTime,
  MdHistory,
  MdMeetingRoom,
  MdNotifications,
  MdManageAccounts,
  MdPersonAdd,
  MdFileUpload,
  MdDataset,
  MdVerified,
  MdEdit,
  MdLock,
  MdPersonPin
} from "react-icons/md";

// Import components (cleaned up - removed unused components)
import SuperAdminDashboard from "../views/super-admin/dashboard";
import UserManagement from "../views/super-admin/user-management";
import AddUser from "../views/super-admin/user-management/components/AddUser";
import EditUser from "../views/super-admin/user-management/components/EditUser";
import UsersList from "../views/super-admin/user-management/components/UsersList";
import FaceDatasetManagement from "../views/super-admin/face-dataset";
import UploadDataset from "../views/super-admin/face-dataset/components/UploadDataset";
import ManageDataset from "../views/super-admin/face-dataset/components/ManageDataset";
import VerifyDataset from "../views/super-admin/face-dataset/components/VerifyDataset";
import AttendanceManagement from "../views/super-admin/attendance";
import AttendanceHistory from "../views/super-admin/attendance/components/AttendanceHistory";
import ManualVerification from "../views/super-admin/attendance/components/ManualVerification";
import RoomAccess from "../views/super-admin/room-access";
import DoorSettings from "../views/super-admin/room-access/components/DoorSettings";
import NotificationCenter from "../views/super-admin/notifications/NotificationCenter";
import AdminProfile from "../views/super-admin/profile/AdminProfile";

const routes = [
  {
    name: "Dashboard",
    layout: "/admin",
    path: "default",
    icon: <MdDashboard className="h-6 w-6" />,
    component: <SuperAdminDashboard />,
  },
  {
    name: "Manajemen Pengguna",
    layout: "/admin",
    path: "user-management",
    icon: <MdManageAccounts className="h-6 w-6" />,
    component: <UserManagement />,
  },
  {
    name: "Tambah Pengguna",
    layout: "/admin",
    parentPath: "user-management",
    path: "add-user",
    icon: <MdPersonAdd className="h-6 w-6 ml-10" />,
    component: <AddUser />,
    secondary: true,
  },
  {
    name: "Edit Pengguna",
    layout: "/admin",
    parentPath: "user-management",
    path: "edit-user",
    icon: <MdEdit className="h-6 w-6 ml-10" />,
    component: <EditUser />,
    secondary: true,
  },
  {
    name: "Daftar Pengguna",
    layout: "/admin",
    parentPath: "user-management",
    path: "users-list",
    icon: <MdPeople className="h-6 w-6 ml-10" />,
    component: <UsersList />,
    secondary: true,
  },
  {
    name: "Manajemen Dataset Wajah",
    layout: "/admin",
    path: "face-dataset",
    icon: <MdFace className="h-6 w-6" />,
    component: <FaceDatasetManagement />,
  },
  {
    name: "Upload Dataset",
    layout: "/admin",
    parentPath: "face-dataset",
    path: "upload-dataset",
    icon: <MdFileUpload className="h-6 w-6 ml-10" />,
    component: <UploadDataset />,
    secondary: true,
  },
  {
    name: "Kelola Dataset",
    layout: "/admin",
    parentPath: "face-dataset",
    path: "manage-dataset",
    icon: <MdDataset className="h-6 w-6 ml-10" />,
    component: <ManageDataset />,
    secondary: true,
  },
  {
    name: "Verifikasi Dataset",
    layout: "/admin",
    parentPath: "face-dataset",
    path: "verify-dataset",
    icon: <MdVerified className="h-6 w-6 ml-10" />,
    component: <VerifyDataset />,
    secondary: true,
  },
  {
    name: "Manajemen Absensi",
    layout: "/admin",
    path: "attendance",
    icon: <MdAccessTime className="h-6 w-6" />,
    component: <AttendanceManagement />,
  },
  {
    name: "Riwayat Absensi",
    layout: "/admin",
    parentPath: "attendance",
    path: "attendance-history",
    icon: <MdHistory className="h-6 w-6 ml-10" />,
    component: <AttendanceHistory />,
    secondary: true,
  },
  {
    name: "Verifikasi Manual",
    layout: "/admin",
    parentPath: "attendance",
    path: "manual-verification",
    icon: <MdVerified className="h-6 w-6 ml-10" />,
    component: <ManualVerification />,
    secondary: true,
  },
  {
    name: "Akses Pintu & Ruangan",
    layout: "/admin",
    path: "room-access",
    icon: <MdMeetingRoom className="h-6 w-6" />,
    component: <RoomAccess />,
  },
  {
    name: "Konfigurasi Pintu",
    layout: "/admin",
    parentPath: "room-access",
    path: "door-settings",
    icon: <MdLock className="h-6 w-6 ml-10" />,
    component: <DoorSettings />,
    secondary: true,
  },
  {
    name: "Notifikasi Sistem",
    layout: "/admin",
    path: "notifications",
    icon: <MdNotifications className="h-6 w-6" />,
    component: <NotificationCenter />,
  },
  {
    name: "Profil Admin",
    layout: "/admin",
    path: "profile",
    icon: <MdPersonPin className="h-6 w-6" />,
    component: <AdminProfile />,
  },
  {
    name: "Logout",
    layout: "/admin",
    path: "logout",
    icon: <MdExitToApp className="h-6 w-6" />,
    component: <Logout />,
  },
];

export default routes;
