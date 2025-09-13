import React from "react";
// Admin Imports
import Logout from "../views/auth/Logout";

import {
  MdExitToApp,
  MdDashboard,
  MdPeople,
  MdFace,
  MdAccessTime,
  MdHistory,
  MdMeetingRoom,
  MdManageAccounts,
  MdPersonAdd,
  MdFileUpload,
  MdDataset,
  MdVerified,
  MdPersonPin,
  MdSchool
} from "react-icons/md";

// Import components (cleaned up - removed unused components)
import SuperAdminDashboard from "../views/super-admin/dashboard";
import UserManagement from "../views/super-admin/user-management";
import AddUser from "../views/super-admin/user-management/components/AddUser";
import FaceDatasetManagement from "../views/super-admin/face-dataset";
import UploadDataset from "../views/super-admin/face-dataset/components/UploadDataset";
import ManageDataset from "../views/super-admin/face-dataset/components/ManageDataset";
import VerifyDataset from "../views/super-admin/face-dataset/components/VerifyDataset";
import AttendanceManagement from "../views/super-admin/attendance";
import AttendanceHistory from "../views/super-admin/attendance/components/AttendanceHistory";
import ManualVerification from "../views/super-admin/attendance/components/ManualVerification";
import RoomAccess from "../views/super-admin/room-access";
import AdminProfile from "../views/super-admin/profile/AdminProfile";
import AddClass from "../views/super-admin/courses/AddClass";
import ManageClassUsers from "../views/super-admin/courses/ManageClassUsers";
import AddCourse from "../views/super-admin/courses/AddCourse";
import ClassList from "../views/super-admin/courses/ClassList";

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
    name: "Manajemen Kelas",
    layout: "/admin",
    path: "class-management",
    icon: <MdPeople className="h-6 w-6" />,
    component: <ClassList />, // Updated to use ClassList component
  },
  {
    name: "Tambah Kelas",
    layout: "/admin",
    parentPath: "class-management",
    path: "add-class",
    icon: <MdPersonAdd className="h-6 w-6 ml-10" />,
    component: <AddClass />,
    secondary: true,
  },
  {
    name: "Atur User Kelas",
    layout: "/admin",
    parentPath: "class-management",
    path: "manage-class-users",
    icon: <MdManageAccounts className="h-6 w-6 ml-10" />,
    component: <ManageClassUsers />,
    secondary: true,
  },
  {
    name: "Tambah Mata Kuliah",
    layout: "/admin",
    parentPath: "class-management",
    path: "add-course",
    icon: <MdSchool className="h-6 w-6 ml-10" />,
    component: <AddCourse />,
    secondary: true,
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
