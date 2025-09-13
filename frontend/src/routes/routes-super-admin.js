import React from "react";
// Admin Imports
import Logout from "../views/auth/Logout";

import {
  MdExitToApp,
  MdDashboard,
  MdPeople,
  MdAccessTime,
  MdHistory,
  MdMeetingRoom,
  MdManageAccounts,
  MdPersonAdd
} from "react-icons/md";

// Import components (cleaned up - removed unused components)
import SuperAdminDashboard from "../views/super-admin/dashboard";
import UserManagement from "../views/super-admin/user-management";
import AddUser from "../views/super-admin/user-management/components/AddUser";
import AttendanceManagement from "../views/super-admin/attendance";
import AttendanceHistory from "../views/super-admin/attendance/components/AttendanceHistory";
import RoomAccess from "../views/super-admin/room-access";
import ClassAccessDetail from "../views/super-admin/room-access/ClassAccessDetail";
import AddClass from "../views/super-admin/courses/AddClass";
import ManageClassUsers from "../views/super-admin/courses/ManageClassUsers";
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
    name: "Akses Pintu & Ruangan",
    layout: "/admin",
    path: "room-access",
    icon: <MdMeetingRoom className="h-6 w-6" />,
    component: <RoomAccess />,
  },
  {
    name: "Detail Akses Kelas",
    layout: "/admin",
    parentPath: "room-access",
    path: "room-access/:classId/detail",
    component: <ClassAccessDetail />,
    secondary: true,
    hidden: true, // Don't show in sidebar
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
    name: "Logout",
    layout: "/admin",
    path: "logout",
    icon: <MdExitToApp className="h-6 w-6" />,
    component: <Logout />,
  },
];

export default routes;
