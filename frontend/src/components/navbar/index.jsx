/**
 * Smart Attendance System - Ultra Modern Navbar Component
 * Features: Glassmorphism design, micro-interactions, adaptive theming
 */

// Core React & Redux imports
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

// State management
import { toggleSidebar } from "../../store/slices/authSlice";

// UI Components
import Dropdown from "components/dropdown";

// Icons - Modern icon set
import {
  // Menu & Navigation
  FiMenu, FiX, FiChevronLeft, FiChevronRight, FiSidebar, FiLayers,
  // User & Profile
  FiUser, FiSettings,
  // System & Time
  FiClock, FiCalendar, FiShield, FiZap, FiActivity
} from "react-icons/fi";
import { HiOutlineDotsVertical, HiOutlineSparkles } from "react-icons/hi";
import { MdOutlineSchedule, MdFaceRetouchingNatural, MdOutlineAutoAwesome } from "react-icons/md";

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
  }, [microPage, initialBrandText]);  // ===== CONFIGURATIONS =====
  // Clean gradient schemes with vibrant colors
  const roleColorScheme = {
    admin: {
      primary: "from-violet-600 via-purple-600 to-indigo-600",
      secondary: "from-violet-500/20 to-purple-500/20",
      accent: "violet-500"
    },
    lecture: {
      primary: "from-blue-500 via-cyan-500 to-teal-500",
      secondary: "from-blue-500/20 to-cyan-500/20",
      accent: "blue-500"
    },
    student: {
      primary: "from-emerald-500 via-green-500 to-lime-500",
      secondary: "from-emerald-500/20 to-green-500/20",
      accent: "emerald-500"
    },
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
   * Clean Mobile Sidebar Toggle
   */
  const MobileSidebarToggle = ({ sidebarOpen, currentScheme, onToggle }) => (
    <button
      onClick={onToggle}
      className={`
      lg:hidden relative p-3 rounded-2xl group overflow-hidden
      bg-gradient-to-br ${currentScheme.primary}
      text-white hover:opacity-90
      transform hover:scale-110 active:scale-95
      transition-all duration-300 ease-out
      border border-white/10 backdrop-blur-xl
      before:absolute before:inset-0 before:bg-white/10 before:opacity-0 
      before:hover:opacity-100 before:transition-opacity before:duration-300
      w-12 h-12
    `}
      type="button"
      aria-label="Toggle sidebar on mobile"
      data-testid="mobile-sidebar-toggle"
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-all duration-500"></div>

      {/* Clean icon container with smooth morphing */}
      <div className="relative z-10 w-6 h-6 flex items-center justify-center">
        <FiMenu className={`absolute w-6 h-6 transition-all duration-500 ease-out ${sidebarOpen ? 'opacity-0 scale-50 rotate-90' : 'opacity-100 scale-100 rotate-0'}`} />
        <FiX className={`absolute w-6 h-6 transition-all duration-500 ease-out ${sidebarOpen ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 -rotate-90'}`} />
      </div>

      {/* Clean status indicator */}
      {sidebarOpen && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-bounce border-2 border-white">
          <div className="absolute inset-1 bg-white rounded-full animate-pulse"></div>
        </div>
      )}
    </button>
  );  /**
   * Clean Desktop Sidebar Toggle
   */
  const DesktopSidebarToggle = ({ sidebarOpen, currentScheme, onToggle }) => (
    <button
      onClick={onToggle}
      className={`
      hidden lg:flex items-center justify-between
      px-5 py-3 rounded-2xl min-w-[160px] group
      transition-all duration-500 ease-out transform
      ${sidebarOpen
          ? 'bg-white/90 dark:bg-slate-800/90 text-gray-700 dark:text-white border border-gray-200/50 dark:border-slate-600/50 backdrop-blur-xl'
          : `bg-gradient-to-r ${currentScheme.primary} text-white border border-white/20 backdrop-blur-xl`}
      hover:scale-105 hover:opacity-90 active:scale-95
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${currentScheme.accent}
      overflow-hidden relative
    `}
      type="button"
      aria-label="Toggle sidebar on desktop"
      data-testid="desktop-sidebar-toggle"
    >
      {/* Animated background overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-all duration-700"></div>

      {/* Content container */}
      <div className="relative z-10 flex items-center space-x-3">
        <div className="relative w-6 h-6 flex items-center justify-center">
          <FiSidebar className={`absolute w-6 h-6 transition-all duration-500 ease-out ${sidebarOpen ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-75 rotate-45'}`} />
          <FiLayers className={`absolute w-6 h-6 transition-all duration-500 ease-out ${!sidebarOpen ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-75 -rotate-45'}`} />
        </div>
        <span className="text-sm font-semibold tracking-wide">
          {sidebarOpen ? "Hide Panel" : "Show Panel"}
        </span>
      </div>

      {/* Clean directional indicator */}
      <div className="relative w-5 h-5 z-10">
        <FiChevronLeft className={`absolute w-5 h-5 transition-all duration-500 ease-out ${sidebarOpen ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-75 rotate-180'}`} />
        <FiChevronRight className={`absolute w-5 h-5 transition-all duration-500 ease-out ${!sidebarOpen ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-75 -rotate-180'}`} />
      </div>
    </button>
  );  /**
   * Clean System Breadcrumb with Glassmorphism
   */
  const SystemBreadcrumb = ({ brandText }) => (
    <div className="flex items-center space-x-3">
      <Link
        to="/auth/homepage"
        className="flex items-center space-x-3 px-4 py-2.5 rounded-2xl text-sm font-semibold 
                   text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 
                   bg-white/60 hover:bg-white/80 dark:bg-slate-800/60 dark:hover:bg-slate-800/80
                   backdrop-blur-xl border border-gray-200/50 dark:border-slate-700/50
                   hover:scale-105 transition-all duration-300 group"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center transition-all duration-300">
          <MdFaceRetouchingNatural className="h-4 w-4 text-white" />
        </div>
        <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          SiAbsensi
        </span>
        <HiOutlineSparkles className="h-4 w-4 text-blue-500 animate-pulse" />
      </Link>

      <div className="w-1 h-1 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-500 rounded-full"></div>

      <div className="px-4 py-2.5 bg-gradient-to-r from-gray-50/80 to-white/80 dark:from-slate-800/80 dark:to-slate-700/80 
                      backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-slate-700/50">
        <span className="text-sm font-bold bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-200 dark:to-white bg-clip-text text-transparent capitalize tracking-wide">
          {brandText}
        </span>
      </div>
    </div>
  );  /**
   * Clean System Status Center
   */
  const SystemStatusCenter = ({ currentTime }) => (
    <div className="flex items-center space-x-4">
      {/* Clean Real-time Clock */}
      <div className="group flex items-center space-x-3 px-4 py-3 
                      bg-gradient-to-r from-slate-50/90 to-white/90 dark:from-slate-800/90 dark:to-slate-700/90 
                      backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-slate-600/50 
                      hover:scale-105 transition-all duration-300">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center transition-all duration-300">
          <FiClock className="h-5 w-5 text-white animate-pulse" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider uppercase">Live Time</span>
          <span className="text-sm font-mono font-bold bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-200 dark:to-white bg-clip-text text-transparent">
            {currentTime.toLocaleTimeString('id-ID', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })}
          </span>
        </div>
      </div>

      {/* Clean Date Display */}
      <div className="group flex items-center space-x-3 px-4 py-3 
                      bg-gradient-to-r from-emerald-50/90 to-green-50/90 dark:from-emerald-900/30 dark:to-green-900/30 
                      backdrop-blur-xl rounded-2xl border border-emerald-200/50 dark:border-emerald-800/50 
                      hover:scale-105 transition-all duration-300">
        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center transition-all duration-300">
          <FiCalendar className="h-5 w-5 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 tracking-wider uppercase">Today</span>
          <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
            {currentTime.toLocaleDateString('id-ID', {
              weekday: 'short',
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })}
          </span>
        </div>
      </div>

      {/* System Status Indicator */}
      <div className="group flex items-center space-x-3 px-4 py-3 
                      bg-gradient-to-r from-violet-50/90 to-purple-50/90 dark:from-violet-900/30 dark:to-purple-900/30 
                      backdrop-blur-xl rounded-2xl border border-violet-200/50 dark:border-violet-800/50 
                      hover:scale-105 transition-all duration-300">
        <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center transition-all duration-300">
          <FiActivity className="h-5 w-5 text-white animate-pulse" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-medium text-violet-600 dark:text-violet-400 tracking-wider uppercase">System</span>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-semibold text-violet-700 dark:text-violet-300">Online</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    </div>
  );  /**
   * Clean Quick Action Buttons
   */
  const QuickActionButtons = ({ userRole }) => (
    <>
      {/* Admin/Lecturer Live Monitor with clean styling */}
      {(userRole === 'admin' || userRole === 'lecture') && (
        <button className="group hidden md:flex items-center space-x-3 px-5 py-3 
                          bg-gradient-to-r from-blue-500/10 to-cyan-500/10 hover:from-blue-500/20 hover:to-cyan-500/20
                          dark:from-blue-500/20 dark:to-cyan-500/20 dark:hover:from-blue-500/30 dark:hover:to-cyan-500/30
                          text-blue-700 dark:text-blue-300 rounded-2xl 
                          border border-blue-200/50 dark:border-blue-800/50 
                          backdrop-blur-xl hover:scale-105 
                          transition-all duration-300 active:scale-95
                          focus:outline-none focus:ring-2 focus:ring-blue-500/50">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center transition-all duration-300">
            <MdOutlineSchedule className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-semibold tracking-wide">Live Monitor</span>
          <FiZap className="h-4 w-4 text-blue-500 animate-pulse" />
        </button>
      )}
    </>
  );

  /**
   * Clean User Profile Dropdown
   */
  const UserProfileDropdown = ({ user, currentScheme, getRoleDisplayName }) => (
    <Dropdown
      button={
        <div className="group flex items-center space-x-3 p-3 rounded-2xl 
                        bg-white/60 hover:bg-white/80 dark:bg-slate-800/60 dark:hover:bg-slate-800/80 
                        backdrop-blur-xl cursor-pointer border border-gray-200/50 dark:border-slate-600/50 
                        hover:scale-105 transition-all duration-300">
          <div className="relative">
            <img
              className="h-10 w-10 rounded-2xl object-cover border-2 border-white/50 dark:border-slate-700/50"
              src={avatar}
              alt={user?.fullname || "User"}
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white dark:border-slate-800">
              <div className="w-full h-full bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-bold bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-200 dark:to-white bg-clip-text text-transparent">
              {user?.fullname || "User"}
            </p>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 capitalize tracking-wide">
              {getRoleDisplayName(user?.role)}
            </p>
          </div>
          <div className="hidden sm:flex items-center justify-center w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-600 rounded-xl group-hover:from-blue-100 group-hover:to-blue-200 dark:group-hover:from-blue-900/50 dark:group-hover:to-blue-800/50 transition-all duration-300">
            <HiOutlineDotsVertical className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
          </div>
        </div>
      }
      children={<ProfileDropdownContent user={user} currentScheme={currentScheme} getRoleDisplayName={getRoleDisplayName} />}
      classNames="py-2 top-full mt-2 -right-4 z-50"
    />
  );  /**
   * Clean Profile Dropdown Content
   */
  const ProfileDropdownContent = ({ user, currentScheme, getRoleDisplayName }) => (
    <div className="w-80">
      <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-slate-700/50 overflow-hidden">
        {/* Clean Profile Header */}
        <div className={`px-6 py-6 bg-gradient-to-br ${currentScheme.primary} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-white/10"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full translate-y-12 -translate-x-12"></div>

          <div className="relative flex items-center space-x-4">
            <div className="relative">
              <img
                className="h-16 w-16 rounded-2xl object-cover border-3 border-white/30"
                src={avatar}
                alt={user?.fullname || "User"}
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div className="flex-1">
              <p className="font-bold text-white text-xl mb-1">
                {user?.fullname || "User"}
              </p>
              <p className="text-white/90 capitalize font-semibold text-sm tracking-wide">
                {getRoleDisplayName(user?.role)}
              </p>

              {/* Clean Role Badge */}
              <div className="mt-3">
                <div className="inline-flex items-center px-3 py-1.5 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30">
                  <div className="w-6 h-6 bg-white/30 rounded-lg flex items-center justify-center mr-2">
                    {user?.role === 'admin' && <FiShield className="h-3 w-3 text-white" />}
                    {user?.role === 'lecture' && <MdOutlineSchedule className="h-3 w-3 text-white" />}
                    {user?.role === 'student' && <FiUser className="h-3 w-3 text-white" />}
                  </div>
                  <span className="text-xs font-bold text-white tracking-wider uppercase">
                    {user?.role === 'admin' ? 'Full Access' : user?.role === 'lecture' ? 'Instructor' : 'Student'}
                  </span>
                  <MdOutlineAutoAwesome className="h-3 w-3 text-white ml-1 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Clean Menu Items */}
        <ProfileMenuItems userRole={user?.role} />

        {/* Clean Sign Out Section */}
        <div className="border-t border-gray-100 dark:border-slate-700/50 p-2">
          <button className="w-full group flex items-center px-4 py-4 text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 dark:hover:from-red-900/20 dark:hover:to-red-800/20 transition-all duration-300 rounded-2xl">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mr-4 transition-all duration-300">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            <div className="flex-1 text-left">
              <p className="font-bold text-red-600 text-sm">Sign Out</p>
              <p className="text-xs text-red-400">End your session securely</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );  /**
   * Clean Profile Menu Items
   */
  const ProfileMenuItems = ({ userRole }) => (
    <div className="p-2 space-y-1">
      {/* Common Profile Settings */}
      <ProfileMenuItem
        icon={<FiUser className="h-5 w-5 text-white" />}
        iconBg="from-blue-500 to-blue-600"
        bgColor="group-hover:bg-blue-50/80 dark:group-hover:bg-blue-900/30"
        label="Profile & Settings"
        subtitle="Manage your account"
      />

      {/* Student-specific menu */}
      {userRole === 'student' && (
        <ProfileMenuItem
          icon={<FiCalendar className="h-5 w-5 text-white" />}
          iconBg="from-emerald-500 to-emerald-600"
          bgColor="group-hover:bg-emerald-50/80 dark:group-hover:bg-emerald-900/30"
          label="My Attendance"
          subtitle="View attendance history"
        />
      )}

      {/* Admin/Lecturer-specific menu */}
      {(userRole === 'admin' || userRole === 'lecture') && (
        <ProfileMenuItem
          icon={<MdOutlineSchedule className="h-5 w-5 text-white" />}
          iconBg="from-indigo-500 to-indigo-600"
          bgColor="group-hover:bg-indigo-50/80 dark:group-hover:bg-indigo-900/30"
          label="Class Management"
          subtitle="Manage classes & students"
        />
      )}

      {/* System Preferences */}
      <ProfileMenuItem
        icon={<FiSettings className="h-5 w-5 text-white" />}
        iconBg="from-purple-500 to-purple-600"
        bgColor="group-hover:bg-purple-50/80 dark:group-hover:bg-purple-900/30"
        label="System Preferences"
        subtitle="App settings & theme"
      />
    </div>
  );  /**
   * Clean Profile Menu Item
   */
  const ProfileMenuItem = ({ icon, iconBg, bgColor, label, subtitle }) => (
    <a href="#" className={`group flex items-center px-4 py-4 text-gray-700 dark:text-gray-200 ${bgColor} transition-all duration-300 rounded-2xl hover:scale-[1.02]`}>
      <div className={`w-12 h-12 bg-gradient-to-br ${iconBg} rounded-2xl flex items-center justify-center mr-4 transition-all duration-300`}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="font-semibold text-sm text-gray-900 dark:text-white">{label}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
      </div>
      <FiChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-300" />
    </a>
  );  // ===== MAIN COMPONENT RENDER =====
  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Clean Glassmorphism Container */}
      <div className="mx-4 mt-4 mb-2">
        <nav className="group flex items-center justify-between h-18 px-8 
                        bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl 
                        border border-white/20 dark:border-slate-700/20 
                        rounded-3xl hover:bg-white/80 dark:hover:bg-slate-900/80
                        hover:border-white/30 dark:hover:border-slate-700/30
                        transition-all duration-500 ease-out
                        relative overflow-hidden">

          {/* Animated background gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

          {/* Floating orbs for visual depth */}
          <div className="absolute top-2 left-4 w-2 h-2 bg-blue-400/30 rounded-full animate-pulse"></div>
          <div className="absolute bottom-2 right-8 w-1 h-1 bg-purple-400/40 rounded-full animate-bounce"></div>

          {/* ===== LEFT SECTION: Navigation Controls ===== */}
          <div className="relative z-10 flex items-center space-x-6">
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
          <div className="relative z-10 hidden lg:flex flex-1 max-w-4xl mx-8 justify-center">
            <SystemStatusCenter currentTime={currentTime} />
          </div>

          {/* ===== RIGHT SECTION: User Actions & Profile ===== */}
          <div className="relative z-10 flex items-center space-x-4">
            <QuickActionButtons userRole={user?.role} />
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
