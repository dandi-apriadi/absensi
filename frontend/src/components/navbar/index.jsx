/**
 * Smart Attendance System - Modern Navbar Component
 * Features: Role-based access, real-time status, face recognition integration
 */

// Core React & Redux imports
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

// State management
import { toggleSidebar } from "../../store/slices/authSlice";

// UI Components
import Dropdown from "components/dropdown";

// Icons - Organized by category
import {
  // Menu & Navigation
  FiMenu, FiX, FiChevronLeft, FiChevronRight, FiSidebar, FiLayers,
  // User & Profile
  FiUser, FiBell, FiSettings,
  // System & Time
  FiClock, FiCalendar, FiCamera, FiShield
} from "react-icons/fi";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { RiNotification3Line } from "react-icons/ri";
import { MdOutlineSchedule, MdFaceRetouchingNatural } from "react-icons/md";

// Assets
import avatar from "assets/img/avatars/avatar4.png";

// Styling
import "../../assets/css/attendance-navbar.css";

/**
 * Main Navbar Component for Smart Attendance System
 * @param {Function} onOpenSidenav - Legacy sidebar toggle handler (optional)
 * @param {string} brandText - Initial breadcrumb text
 */
const Navbar = ({ onOpenSidenav, brandText: initialBrandText }) => {
  // ===== STATE MANAGEMENT =====
  const [brandText, setBrandText] = useState(initialBrandText);
  const [currentTime, setCurrentTime] = useState(new Date());
  const dispatch = useDispatch();
  const { microPage, user, sidebarOpen } = useSelector((state) => state.auth);

  // ===== EFFECTS =====
  // Real-time clock update
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Dynamic breadcrumb update
  useEffect(() => {
    setBrandText(microPage !== "unset" ? microPage : initialBrandText);
  }, [microPage, initialBrandText]);

  // ===== CONFIGURATIONS =====
  // Role-based color schemes for attendance system branding
  const roleColorScheme = {
    admin: "from-red-500 to-red-600",     // Super Admin - System oversight
    lecture: "from-blue-500 to-indigo-600", // Lecturer - Class management
    student: "from-emerald-500 to-green-600", // Student - Personal access
  };

  const currentScheme = roleColorScheme[user?.role] || roleColorScheme.lecture;

  // ===== UTILITY FUNCTIONS =====
  const getRoleDisplayName = (role) => {
    const roleNames = {
      admin: "Super Admin",
      lecture: "Lecturer",
      student: "Student"
    };
    return roleNames[role] || "User";
  };

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
    // Legacy support for external handlers
    if (typeof onOpenSidenav === 'function') onOpenSidenav();
  };
  // ===== SUB-COMPONENTS FOR BETTER ORGANIZATION =====

  /**
   * Mobile Sidebar Toggle Button Component
   */
  const MobileSidebarToggle = ({ sidebarOpen, currentScheme, onToggle }) => (
    <button
      onClick={onToggle}
      className={`
      lg:hidden relative p-3 rounded-xl group
      bg-gradient-to-r ${currentScheme}
      text-white shadow-md hover:shadow-lg
      transform hover:scale-105 active:scale-95
      transition-all duration-200
      border border-white/20
      focus:outline-none focus:ring-2 focus:ring-white/50
      cursor-pointer z-50 overflow-hidden
      w-11 h-11
    `}
      type="button"
      aria-label="Toggle sidebar on mobile"
      data-testid="mobile-sidebar-toggle"
    >
      {/* Hover background animation */}
      <span className="absolute inset-0 w-full h-full bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>

      {/* Icon container - prevents layout shifts */}
      <div className="relative z-10 pointer-events-none w-5 h-5 flex items-center justify-center">
        <FiMenu className={`absolute w-5 h-5 transition-all duration-300 ${sidebarOpen ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}`} />
        <FiX className={`absolute w-5 h-5 transition-all duration-300 ${sidebarOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`} />
      </div>

      {/* Active state indicator */}
      {sidebarOpen && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse border-2 border-white pointer-events-none"></div>
      )}
    </button>
  );

  /**
   * Desktop Sidebar Toggle Button Component
   */
  const DesktopSidebarToggle = ({ sidebarOpen, currentScheme, onToggle }) => (
    <button
      onClick={onToggle}
      className={`
      hidden lg:flex items-center justify-between
      px-4 py-2 rounded-xl min-w-[140px]
      transition-all duration-300 ease-in-out
      ${sidebarOpen
          ? 'bg-gradient-to-r from-gray-100 to-gray-50 dark:from-slate-800 dark:to-slate-700 text-gray-700 dark:text-white border border-gray-200 dark:border-slate-600'
          : 'bg-gradient-to-r ' + currentScheme + ' text-white border border-white/20'}
      shadow-md hover:shadow-lg
      hover:scale-105 active:scale-95
      focus:outline-none group
    `}
      type="button"
      aria-label="Toggle sidebar on desktop"
      data-testid="desktop-sidebar-toggle"
    >
      {/* Left side: Icon and text */}
      <div className="flex items-center space-x-2">
        <div className="relative w-5 h-5 flex items-center justify-center">
          <FiSidebar className={`absolute w-5 h-5 transition-all duration-300 ${sidebarOpen ? 'opacity-100 transform-none' : 'opacity-0 -translate-y-4'}`} />
          <FiLayers className={`absolute w-5 h-5 transition-all duration-300 ${!sidebarOpen ? 'opacity-100 transform-none' : 'opacity-0 translate-y-4'}`} />
        </div>
        <span className="text-sm font-medium">
          {sidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
        </span>
      </div>

      {/* Right side: Directional indicator */}
      <div className="relative w-4 h-4">
        <FiChevronLeft className={`absolute w-4 h-4 transition-all duration-300 ${sidebarOpen ? 'opacity-100 transform-none' : 'opacity-0 translate-x-2'}`} />
        <FiChevronRight className={`absolute w-4 h-4 transition-all duration-300 ${!sidebarOpen ? 'opacity-100 transform-none' : 'opacity-0 -translate-x-2'}`} />
      </div>
    </button>
  );

  /**
   * System Breadcrumb Navigation Component
   */
  const SystemBreadcrumb = ({ brandText }) => (
    <div className="flex items-center space-x-2">
      <Link
        to="/auth/homepage"
        className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
      >
        <MdFaceRetouchingNatural className="h-4 w-4" />
        <span>SiAbsensi</span>
      </Link>
      <div className="text-gray-300 dark:text-gray-600">/</div>
      <span className="px-3 py-1.5 text-sm font-bold text-gray-900 dark:text-white capitalize">
        {brandText}
      </span>
    </div>
  );

  /**
   * Real-time System Status Center Component
   */
  const SystemStatusCenter = ({ currentTime }) => (
    <div className="flex items-center space-x-6">
      {/* Real-time Clock */}
      <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50/80 dark:bg-slate-800/50 rounded-lg border border-gray-200/60 dark:border-slate-600/60">
        <FiClock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        <span className="text-sm font-mono font-medium text-gray-700 dark:text-gray-300">
          {currentTime.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })}
        </span>
      </div>

      {/* Today's Date */}
      <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50/80 dark:bg-slate-800/50 rounded-lg border border-gray-200/60 dark:border-slate-600/60">
        <FiCalendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {currentTime.toLocaleDateString('id-ID', {
            weekday: 'short',
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          })}
        </span>
      </div>

      {/* Face Recognition Status */}
      <div className="flex items-center space-x-2 px-3 py-2 bg-green-50/80 dark:bg-green-900/20 rounded-lg border border-green-200/60 dark:border-green-900/30">
        <FiCamera className="h-4 w-4 text-green-600 dark:text-green-400" />
        <span className="text-sm font-medium text-green-700 dark:text-green-300">
          Face Recognition Online
        </span>
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      </div>
    </div>
  );

  /**
   * Role-based Quick Action Buttons Component
   */
  const QuickActionButtons = ({ userRole }) => (
    <>
      {/* Student Quick Check-in */}
      {userRole === 'student' && (
        <button className="hidden md:flex items-center space-x-2 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-lg border border-emerald-200 dark:border-emerald-900/30 transition-all duration-200 hover:scale-105">
          <FiCamera className="h-4 w-4" />
          <span className="text-sm font-medium">Quick Check-in</span>
        </button>
      )}

      {/* Admin/Lecturer Live Monitor */}
      {(userRole === 'admin' || userRole === 'lecture') && (
        <button className="hidden md:flex items-center space-x-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg border border-blue-200 dark:border-blue-900/30 transition-all duration-200 hover:scale-105">
          <MdOutlineSchedule className="h-4 w-4" />
          <span className="text-sm font-medium">Live Monitor</span>
        </button>
      )}
    </>
  );

  /**
   * Sidebar Status Indicator Component
   */
  const SidebarStatusIndicator = ({ sidebarOpen }) => (
    <div className="hidden lg:block">
      <div
        className={`
        px-2.5 py-1 rounded-lg text-xs font-medium
        flex items-center space-x-1.5
        transition-all duration-300 border
        ${sidebarOpen
            ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-900/30'
            : 'bg-gray-50 text-gray-500 dark:bg-slate-800 dark:text-gray-400 border-gray-200 dark:border-slate-700'}
      `}
        data-testid="sidebar-status-indicator"
      >
        <span className={`w-2 h-2 rounded-full ${sidebarOpen ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>
        <span>Sidebar {sidebarOpen ? 'Active' : 'Hidden'}</span>
      </div>
    </div>
  );

  /**
   * Notifications Dropdown Component
   */
  const NotificationsDropdown = () => (
    <Dropdown
      button={
        <div className="relative p-2.5 rounded-lg bg-gray-50 hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-600 hover:text-orange-600 dark:text-gray-400 dark:hover:text-orange-400 transition-all duration-200 cursor-pointer border border-gray-200 dark:border-slate-600 shadow-sm hover:shadow-md hover:scale-105">
          <RiNotification3Line className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
          </span>
        </div>
      }
      children={<NotificationDropdownContent />}
      classNames="py-2 top-full mt-2 -right-4 z-50"
    />
  );

  /**
   * Notification Dropdown Content Component
   */
  const NotificationDropdownContent = () => (
    <div className="w-80">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-700 dark:to-slate-600 border-b border-gray-100 dark:border-slate-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <FiBell className="h-4 w-4 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Attendance Alerts</h3>
            </div>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium px-2 py-1 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20">
              Mark all read
            </button>
          </div>
        </div>

        {/* Notification Items */}
        <div className="max-h-80 overflow-y-auto">
          <NotificationItem
            icon={<FiCamera className="h-5 w-5 text-white" />}
            iconBg="from-emerald-500 to-green-600"
            title="Face Recognition Alert"
            message="Multiple failed recognition attempts detected for Student ID: 220401001"
            time="3 minutes ago"
            badge="Security Alert"
            badgeColor="yellow"
          />

          <NotificationItem
            icon={<MdOutlineSchedule className="h-5 w-5 text-white" />}
            iconBg="from-blue-500 to-indigo-600"
            title="Class Session Started"
            message="Data Structures - Room 301. Attendance recording is now active."
            time="5 minutes ago"
            badge="Class Alert"
            badgeColor="blue"
          />

          <NotificationItem
            icon={<FiShield className="h-5 w-5 text-white" />}
            iconBg="from-red-500 to-orange-500"
            title="Door Access Attempt"
            message="Unauthorized access attempt detected at entrance. Review security logs."
            time="10 minutes ago"
            badge="High Priority"
            badgeColor="red"
          />
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-gray-50 dark:bg-slate-700/50 border-t border-gray-100 dark:border-slate-600">
          <button className="w-full text-sm text-center text-blue-600 hover:text-blue-700 font-semibold py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20">
            View attendance logs
          </button>
        </div>
      </div>
    </div>
  );

  /**
   * Individual Notification Item Component
   */
  const NotificationItem = ({ icon, iconBg, title, message, time, badge, badgeColor }) => {
    const badgeColors = {
      yellow: 'bg-yellow-100 text-yellow-600',
      blue: 'bg-blue-100 text-blue-600',
      red: 'bg-red-100 text-red-600'
    };

    return (
      <div className="p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 cursor-pointer border-b border-gray-100 dark:border-slate-700">
        <div className="flex items-start space-x-3">
          <div className={`w-10 h-10 bg-gradient-to-r ${iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
            {icon}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900 dark:text-white mb-1">{title}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{message}</p>
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-gray-500">{time}</span>
              <span className={`px-2 py-1 ${badgeColors[badgeColor]} rounded-full font-medium`}>
                {badge}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  /**
   * User Profile Dropdown Component
   */
  const UserProfileDropdown = ({ user, currentScheme, getRoleDisplayName }) => (
    <Dropdown
      button={
        <div className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer border border-gray-200 dark:border-slate-600 shadow-sm hover:shadow-md transition-all duration-200">
          <img
            className="h-9 w-9 rounded-xl object-cover border-2 border-white dark:border-slate-700 shadow-md"
            src={avatar}
            alt={user?.fullname || "User"}
          />
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {user?.fullname || "User"}
            </p>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 capitalize">
              {getRoleDisplayName(user?.role)}
            </p>
          </div>
          <HiOutlineDotsVertical className="h-4 w-4 text-gray-400 hidden sm:block" />
        </div>
      }
      children={<ProfileDropdownContent user={user} currentScheme={currentScheme} getRoleDisplayName={getRoleDisplayName} />}
      classNames="py-2 top-full mt-2 -right-4 z-50"
    />
  );

  /**
   * Profile Dropdown Content Component
   */
  const ProfileDropdownContent = ({ user, currentScheme, getRoleDisplayName }) => (
    <div className="w-72">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden">
        {/* Profile Header */}
        <div className={`px-6 py-5 bg-gradient-to-r ${currentScheme} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative flex items-center space-x-4">
            <img
              className="h-14 w-14 rounded-xl object-cover border-3 border-white/30 shadow-lg"
              src={avatar}
              alt={user?.fullname || "User"}
            />
            <div>
              <p className="font-bold text-white text-lg drop-shadow-sm">
                {user?.fullname || "User"}
              </p>
              <p className="text-white/90 capitalize font-medium">
                {getRoleDisplayName(user?.role)}
              </p>
              {/* Role-specific access badge */}
              <div className="mt-1">
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-white/20 text-white backdrop-blur-sm">
                  {user?.role === 'admin' && <FiShield className="h-3 w-3 mr-1" />}
                  {user?.role === 'lecture' && <MdOutlineSchedule className="h-3 w-3 mr-1" />}
                  {user?.role === 'student' && <FiUser className="h-3 w-3 mr-1" />}
                  Access Level: {user?.role === 'admin' ? 'Full' : user?.role === 'lecture' ? 'Instructor' : 'Student'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <ProfileMenuItems userRole={user?.role} />

        {/* Sign Out Section */}
        <div className="border-t border-gray-100 dark:border-slate-700 py-2">
          <button className="w-full flex items-center px-6 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group">
            <div className="w-10 h-10 bg-red-50 dark:bg-red-900/20 rounded-xl flex items-center justify-center mr-4 group-hover:bg-red-100 dark:group-hover:bg-red-900/30">
              <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            <span className="font-semibold">Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );

  /**
   * Profile Menu Items Component
   */
  const ProfileMenuItems = ({ userRole }) => (
    <div className="py-2">
      {/* Common Profile Settings */}
      <ProfileMenuItem
        icon={<FiUser className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-600" />}
        bgColor="group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20"
        label="Profile & Settings"
      />

      {/* Student-specific menu */}
      {userRole === 'student' && (
        <ProfileMenuItem
          icon={<FiCalendar className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-emerald-600" />}
          bgColor="group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20"
          label="My Attendance"
        />
      )}

      {/* Admin/Lecturer-specific menu */}
      {(userRole === 'admin' || userRole === 'lecture') && (
        <ProfileMenuItem
          icon={<MdOutlineSchedule className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-indigo-600" />}
          bgColor="group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20"
          label="Class Management"
        />
      )}

      {/* System Preferences */}
      <ProfileMenuItem
        icon={<FiSettings className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-purple-600" />}
        bgColor="group-hover:bg-purple-50 dark:group-hover:bg-purple-900/20"
        label="System Preferences"
      />
    </div>
  );

  /**
   * Profile Menu Item Component
   */
  const ProfileMenuItem = ({ icon, bgColor, label }) => (
    <a href="#" className="flex items-center px-6 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors group">
      <div className={`w-10 h-10 bg-gray-100 dark:bg-slate-700 rounded-xl flex items-center justify-center mr-4 ${bgColor}`}>
        {icon}
      </div>
      <span className="font-medium">{label}</span>
    </a>
  );
  // ===== MAIN COMPONENT RENDER =====
  return (
    <header className="sticky top-0 z-30 w-full">
      {/* Modern Glass-morphism Container */}
      <div className="mx-4 mt-4 mb-2">
        <nav className="flex items-center justify-between h-16 px-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-gray-200/30 dark:border-slate-700/30 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">

          {/* ===== LEFT SECTION: Navigation Controls ===== */}
          <div className="flex items-center space-x-4">
            <MobileSidebarToggle
              sidebarOpen={sidebarOpen}
              currentScheme={currentScheme}
              onToggle={handleToggleSidebar}
            />
            <DesktopSidebarToggle
              sidebarOpen={sidebarOpen}
              currentScheme={currentScheme}
              onToggle={handleToggleSidebar}
            />
            <SystemBreadcrumb brandText={brandText} />
          </div>

          {/* ===== CENTER SECTION: Real-time System Status ===== */}
          <div className="hidden lg:flex flex-1 max-w-lg mx-8 justify-center">
            <SystemStatusCenter currentTime={currentTime} />
          </div>

          {/* ===== RIGHT SECTION: User Actions & Profile ===== */}
          <div className="flex items-center space-x-3">
            <QuickActionButtons userRole={user?.role} />
            <SidebarStatusIndicator sidebarOpen={sidebarOpen} />
            <NotificationsDropdown />
            <UserProfileDropdown
              user={user}
              currentScheme={currentScheme}
              getRoleDisplayName={getRoleDisplayName}
            />
          </div>
        </nav>
      </div>
    </header>
  );
};

// ===== EXPORT =====
export default Navbar;
