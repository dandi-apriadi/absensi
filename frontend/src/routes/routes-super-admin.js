import React from "react";
// Admin Imports
import Logout from "../views/auth/Logout";
// Icon Imports
import {
  MdExitToApp,
  MdDashboard,
  MdSettings,
  MdPeople,
  MdSchool,
  MdFace,
  MdInsights,
  MdBarChart,
  MdAssessment,
  MdHistory,
  MdGroups,
  MdAnalytics,
  MdManageAccounts,
  MdPersonAdd,
  MdUpload,
  MdFolderShared,
  MdDocumentScanner,
  MdNotifications,
  MdEmail,
  MdMessage,
  MdLock,
  MdSecurity,
  MdBackup,
  MdUpdate,
  MdMeetingRoom,
  MdMonitor,
  MdAccessTime,
  MdAppRegistration,
  MdHelpCenter,
  MdFileUpload,
  MdDataset,
  MdVerified,
  MdEdit,
  MdDelete,
  MdImportExport,
  MdGroup,
  MdReport,
  MdBugReport,
  MdAdminPanelSettings,
  MdRestartAlt,
  MdStorage,
  MdAutoGraph,
  MdPersonPin
} from "react-icons/md";

// Import components (these would need to be created)
import SuperAdminDashboard from "../views/super-admin/dashboard";
import UserManagement from "../views/super-admin/user-management";
import AddUser from "../views/super-admin/user-management/components/AddUser";
import EditUser from "../views/super-admin/user-management/components/EditUser";
import UsersList from "../views/super-admin/user-management/components/UsersList";
import ImportExportUsers from "../views/super-admin/user-management/components/ImportExportUsers";
import StudentManagement from "../views/super-admin/user-management/components/StudentManagement";
import LecturerManagement from "../views/super-admin/user-management/components/LecturerManagement";
import FaceDatasetManagement from "../views/super-admin/face-dataset";
import UploadDataset from "../views/super-admin/face-dataset/components/UploadDataset";
import ManageDataset from "../views/super-admin/face-dataset/components/ManageDataset";
import VerifyDataset from "../views/super-admin/face-dataset/components/VerifyDataset";
import AttendanceManagement from "../views/super-admin/attendance";
import AttendanceHistory from "../views/super-admin/attendance/components/AttendanceHistory";
import AttendanceExport from "../views/super-admin/attendance/components/AttendanceExport";
import ManualVerification from "../views/super-admin/attendance/components/ManualVerification";
import RoomAccess from "../views/super-admin/room-access";
import AccessLogs from "../views/super-admin/room-access/components/AccessLogs";
import AccessMonitoring from "../views/super-admin/room-access/components/AccessMonitoring";
import DoorSettings from "../views/super-admin/room-access/components/DoorSettings";
import SystemLogs from "../views/super-admin/system-logs";
import ActivityLogs from "../views/super-admin/system-logs/components/ActivityLogs";
import SecurityAlerts from "../views/super-admin/system-logs/components/SecurityAlerts";
import SystemSettings from "../views/super-admin/settings";
import GeneralSettings from "../views/super-admin/settings/components/GeneralSettings";
import FaceRecognitionSettings from "../views/super-admin/settings/components/FaceRecognitionSettings";
import RoomSettings from "../views/super-admin/settings/components/RoomSettings";
import BackupRestore from "../views/super-admin/settings/components/BackupRestore";
import Help from "../views/super-admin/help";
import UserGuide from "../views/super-admin/help/components/UserGuide";
import FAQ from "../views/super-admin/help/components/FAQ";
import ReportGenerator from "../views/super-admin/reports";
import GenerateReports from "../views/super-admin/reports/components/GenerateReports";
import ScheduledReports from "../views/super-admin/reports/components/ScheduledReports";
import ReportTemplates from "../views/super-admin/reports/components/ReportTemplates";
import AnalyticsDashboard from "../views/super-admin/analytics";
import AttendanceTrends from "../views/super-admin/analytics/components/AttendanceTrends";
import PredictiveAnalytics from "../views/super-admin/analytics/components/PredictiveAnalytics";
import SystemReset from "../views/super-admin/system-admin/SystemReset";
import BulkOperations from "../views/super-admin/system-admin/BulkOperations";
import HardwareMonitoring from "../views/super-admin/system-admin/HardwareMonitoring";
import NotificationCenter from "../views/super-admin/notifications/NotificationCenter";
import AdminProfile from "../views/super-admin/profile/AdminProfile";

const routes = [
  {
    name: "Dashboard",
    layout: "/super-admin",
    path: "default",
    icon: <MdDashboard className="h-6 w-6" />,
    component: <SuperAdminDashboard />,
  },
  {
    name: "Manajemen Pengguna",
    layout: "/super-admin",
    path: "user-management",
    icon: <MdManageAccounts className="h-6 w-6" />,
    component: <UserManagement />,
  },
  {
    name: "Manajemen Mahasiswa",
    layout: "/super-admin",
    parentPath: "user-management",
    path: "student-management",
    icon: <MdSchool className="h-6 w-6 ml-10" />,
    component: <StudentManagement />,
    secondary: true,
  },
  {
    name: "Manajemen Dosen",
    layout: "/super-admin",
    parentPath: "user-management",
    path: "lecturer-management",
    icon: <MdGroups className="h-6 w-6 ml-10" />,
    component: <LecturerManagement />,
    secondary: true,
  },
  {
    name: "Tambah Pengguna",
    layout: "/super-admin",
    parentPath: "user-management",
    path: "add-user",
    icon: <MdPersonAdd className="h-6 w-6 ml-10" />,
    component: <AddUser />,
    secondary: true,
  },
  {
    name: "Edit Pengguna",
    layout: "/super-admin",
    parentPath: "user-management",
    path: "edit-user",
    icon: <MdEdit className="h-6 w-6 ml-10" />,
    component: <EditUser />,
    secondary: true,
  },
  {
    name: "Daftar Pengguna",
    layout: "/super-admin",
    parentPath: "user-management",
    path: "users-list",
    icon: <MdPeople className="h-6 w-6 ml-10" />,
    component: <UsersList />,
    secondary: true,
  },
  {
    name: "Import/Export Pengguna",
    layout: "/super-admin",
    parentPath: "user-management",
    path: "import-export-users",
    icon: <MdImportExport className="h-6 w-6 ml-10" />,
    component: <ImportExportUsers />,
    secondary: true,
  },
  {
    name: "Manajemen Dataset Wajah",
    layout: "/super-admin",
    path: "face-dataset",
    icon: <MdFace className="h-6 w-6" />,
    component: <FaceDatasetManagement />,
  },
  {
    name: "Upload Dataset",
    layout: "/super-admin",
    parentPath: "face-dataset",
    path: "upload-dataset",
    icon: <MdFileUpload className="h-6 w-6 ml-10" />,
    component: <UploadDataset />,
    secondary: true,
  },
  {
    name: "Kelola Dataset",
    layout: "/super-admin",
    parentPath: "face-dataset",
    path: "manage-dataset",
    icon: <MdDataset className="h-6 w-6 ml-10" />,
    component: <ManageDataset />,
    secondary: true,
  },
  {
    name: "Verifikasi Dataset",
    layout: "/super-admin",
    parentPath: "face-dataset",
    path: "verify-dataset",
    icon: <MdVerified className="h-6 w-6 ml-10" />,
    component: <VerifyDataset />,
    secondary: true,
  },
  {
    name: "Manajemen Absensi",
    layout: "/super-admin",
    path: "attendance",
    icon: <MdAccessTime className="h-6 w-6" />,
    component: <AttendanceManagement />,
  },
  {
    name: "Riwayat Absensi",
    layout: "/super-admin",
    parentPath: "attendance",
    path: "attendance-history",
    icon: <MdHistory className="h-6 w-6 ml-10" />,
    component: <AttendanceHistory />,
    secondary: true,
  },
  {
    name: "Export Absensi",
    layout: "/super-admin",
    parentPath: "attendance",
    path: "attendance-export",
    icon: <MdImportExport className="h-6 w-6 ml-10" />,
    component: <AttendanceExport />,
    secondary: true,
  },
  {
    name: "Verifikasi Manual",
    layout: "/super-admin",
    parentPath: "attendance",
    path: "manual-verification",
    icon: <MdVerified className="h-6 w-6 ml-10" />,
    component: <ManualVerification />,
    secondary: true,
  },
  {
    name: "Akses Pintu & Ruangan",
    layout: "/super-admin",
    path: "room-access",
    icon: <MdMeetingRoom className="h-6 w-6" />,
    component: <RoomAccess />,
  },
  {
    name: "Log Akses",
    layout: "/super-admin",
    parentPath: "room-access",
    path: "access-logs",
    icon: <MdHistory className="h-6 w-6 ml-10" />,
    component: <AccessLogs />,
    secondary: true,
  },
  {
    name: "Monitoring Akses",
    layout: "/super-admin",
    parentPath: "room-access",
    path: "access-monitoring",
    icon: <MdMonitor className="h-6 w-6 ml-10" />,
    component: <AccessMonitoring />,
    secondary: true,
  },
  {
    name: "Konfigurasi Pintu",
    layout: "/super-admin",
    parentPath: "room-access",
    path: "door-settings",
    icon: <MdLock className="h-6 w-6 ml-10" />,
    component: <DoorSettings />,
    secondary: true,
  },
  {
    name: "Hardware Monitoring",
    layout: "/super-admin",
    path: "hardware-monitoring",
    icon: <MdMonitor className="h-6 w-6" />,
    component: <HardwareMonitoring />,
  },
  {
    name: "Log Sistem",
    layout: "/super-admin",
    path: "system-logs",
    icon: <MdBugReport className="h-6 w-6" />,
    component: <SystemLogs />,
  },
  {
    name: "Log Aktivitas",
    layout: "/super-admin",
    parentPath: "system-logs",
    path: "activity-logs",
    icon: <MdInsights className="h-6 w-6 ml-10" />,
    component: <ActivityLogs />,
    secondary: true,
  },
  {
    name: "Alert Keamanan",
    layout: "/super-admin",
    parentPath: "system-logs",
    path: "security-alerts",
    icon: <MdSecurity className="h-6 w-6 ml-10" />,
    component: <SecurityAlerts />,
    secondary: true,
  },
  {
    name: "Pengaturan Sistem",
    layout: "/super-admin",
    path: "settings",
    icon: <MdSettings className="h-6 w-6" />,
    component: <SystemSettings />,
  },
  {
    name: "Pengaturan Umum",
    layout: "/super-admin",
    parentPath: "settings",
    path: "general-settings",
    icon: <MdSettings className="h-6 w-6 ml-10" />,
    component: <GeneralSettings />,
    secondary: true,
  },
  {
    name: "Pengaturan Pengenalan Wajah",
    layout: "/super-admin",
    parentPath: "settings",
    path: "face-recognition-settings",
    icon: <MdFace className="h-6 w-6 ml-10" />,
    component: <FaceRecognitionSettings />,
    secondary: true,
  },
  {
    name: "Pengaturan Ruangan",
    layout: "/super-admin",
    parentPath: "settings",
    path: "room-settings",
    icon: <MdMeetingRoom className="h-6 w-6 ml-10" />,
    component: <RoomSettings />,
    secondary: true,
  },
  {
    name: "Backup & Restore",
    layout: "/super-admin",
    parentPath: "settings",
    path: "backup-restore",
    icon: <MdBackup className="h-6 w-6 ml-10" />,
    component: <BackupRestore />,
    secondary: true,
  },
  {
    name: "Report Generator",
    layout: "/super-admin",
    path: "reports",
    icon: <MdAssessment className="h-6 w-6" />,
    component: <ReportGenerator />,
  },
  {
    name: "Generate Reports",
    layout: "/super-admin",
    parentPath: "reports",
    path: "generate-reports",
    icon: <MdDocumentScanner className="h-6 w-6 ml-10" />,
    component: <GenerateReports />,
    secondary: true,
  },
  {
    name: "Scheduled Reports",
    layout: "/super-admin",
    parentPath: "reports",
    path: "scheduled-reports",
    icon: <MdAccessTime className="h-6 w-6 ml-10" />,
    component: <ScheduledReports />,
    secondary: true,
  },
  {
    name: "Report Templates",
    layout: "/super-admin",
    parentPath: "reports",
    path: "report-templates",
    icon: <MdFolderShared className="h-6 w-6 ml-10" />,
    component: <ReportTemplates />,
    secondary: true,
  },
  {
    name: "Analytics Dashboard",
    layout: "/super-admin",
    path: "analytics",
    icon: <MdAnalytics className="h-6 w-6" />,
    component: <AnalyticsDashboard />,
  },
  {
    name: "Attendance Trends",
    layout: "/super-admin",
    parentPath: "analytics",
    path: "attendance-trends",
    icon: <MdAutoGraph className="h-6 w-6 ml-10" />,
    component: <AttendanceTrends />,
    secondary: true,
  },
  {
    name: "Predictive Analytics",
    layout: "/super-admin",
    parentPath: "analytics",
    path: "predictive-analytics",
    icon: <MdBarChart className="h-6 w-6 ml-10" />,
    component: <PredictiveAnalytics />,
    secondary: true,
  },
  {
    name: "Notifikasi Sistem",
    layout: "/super-admin",
    path: "notifications",
    icon: <MdNotifications className="h-6 w-6" />,
    component: <NotificationCenter />,
  },
  {
    name: "Profil Admin",
    layout: "/super-admin",
    path: "profile",
    icon: <MdPersonPin className="h-6 w-6" />,
    component: <AdminProfile />,
  },
  {
    name: "System Reset",
    layout: "/super-admin",
    path: "system-reset",
    icon: <MdRestartAlt className="h-6 w-6" />,
    component: <SystemReset />,
  },
  {
    name: "Bulk Data Operations",
    layout: "/super-admin",
    path: "bulk-operations",
    icon: <MdStorage className="h-6 w-6" />,
    component: <BulkOperations />,
  },
  {
    name: "Bantuan",
    layout: "/super-admin",
    path: "help",
    icon: <MdHelpCenter className="h-6 w-6" />,
    component: <Help />,
  },
  {
    name: "Panduan Pengguna",
    layout: "/super-admin",
    parentPath: "help",
    path: "user-guide",
    icon: <MdSchool className="h-6 w-6 ml-10" />,
    component: <UserGuide />,
    secondary: true,
  },
  {
    name: "FAQ",
    layout: "/super-admin",
    parentPath: "help",
    path: "faq",
    icon: <MdMessage className="h-6 w-6 ml-10" />,
    component: <FAQ />,
    secondary: true,
  },
  {
    name: "Logout",
    layout: "/super-admin",
    path: "logout",
    icon: <MdExitToApp className="h-6 w-6" />,
    component: <Logout />,
  },
];

export default routes;
