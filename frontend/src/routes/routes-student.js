import React from "react";
// Admin Imports
import Logout from "views/auth/Logout";
import {
  MdExitToApp,
  MdDashboard,
  MdBook,
  MdVerified,
  MdNotifications,
  MdPersonPin
} from "react-icons/md";

// Import components (cleaned up - removed unused components)
import StudentDashboard from "views/student/dashboard";
import CourseSchedule from "views/student/courses";
import MyAttendance from "views/student/attendance";
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
    name: "Kehadiran Saya",
    layout: "/student",
    path: "my-attendance",
    icon: <MdVerified className="h-6 w-6" />,
    component: <MyAttendance />,
  },
  {
    name: "Jadwal Perkuliahan",
    layout: "/student",
    path: "schedule",
    icon: <MdBook className="h-6 w-6" />,
    component: <CourseSchedule />,
  },
  {
    name: "Profil Saya",
    layout: "/student",
    path: "profile",
    icon: <MdPersonPin className="h-6 w-6" />,
    component: <StudentProfile />,
  },
  {
    name: "Notifikasi",
    layout: "/student",
    path: "notifications",
    icon: <MdNotifications className="h-6 w-6" />,
    component: <NotificationCenter />,
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
