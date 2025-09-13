/**
 * Smart Attendance System - Simple Navbar Component
 * Features: Clean design, essential functionality only
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
  FiMenu, FiX, FiChevronRight,
  // User & Profile
  FiUser, FiSettings,
  // System
  FiShield
} from "react-icons/fi";
import { HiOutlineDotsVertical, HiOutlineSparkles } from "react-icons/hi";
import { MdOutlineSchedule, MdFaceRetouchingNatural, MdOutlineAutoAwesome } from "react-icons/md";

// Assets
import avatar from "assets/img/avatars/avatar4.png";

// Styling
import "../../assets/css/attendance-navbar.css";

/**
 * Simple Navbar Component for Smart Attendance System
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
  // Dynamic breadcrumb update
  useEffect(() => {
    setBrandText(microPage !== "unset" ? microPage : initialBrandText);
  }, [microPage, initialBrandText]);

  // Real-time clock update
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);  // ===== CONFIGURATIONS =====
  // Clean gradient schemes with vibrant colors (Admin-only system)
  const roleColorScheme = {
    'super-admin': {
      primary: "from-violet-600 via-purple-600 to-indigo-600",
      secondary: "from-violet-500/20 to-purple-500/20",
      accent: "violet-500"
    },
    admin: {
      primary: "from-violet-600 via-purple-600 to-indigo-600",
      secondary: "from-violet-500/20 to-purple-500/20",
      accent: "violet-500"
    }
  };

  const currentScheme = roleColorScheme[user?.role] || roleColorScheme['super-admin'];

  // ===== UTILITY FUNCTIONS =====
  const getRoleDisplayName = (role) => {
    const roleNames = {
      'super-admin': "Super Administrator",
      admin: "Administrator"
    };
    return roleNames[role] || "Administrator";
  };

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
    // Legacy support for external handlers
    if (typeof onOpenSidenav === 'function') onOpenSidenav();
  };

  // ===== SUB-COMPONENTS FOR BETTER ORGANIZATION =====

  /**
   * Mobile Sidebar Toggle
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
    </button>
  );  /**
   * System Breadcrumb with Glassmorphism
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
  );

  /**
   * System Status Indicators
   */
  const SystemStatus = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [systemLoad, setSystemLoad] = useState(Math.floor(Math.random() * 40) + 10); // Simulated

    useEffect(() => {
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      // Simulate system load updates
      const loadTimer = setInterval(() => {
        setSystemLoad(Math.floor(Math.random() * 40) + 10);
      }, 5000);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        clearInterval(loadTimer);
      };
    }, []);

    return (
      <div className="hidden lg:flex items-center space-x-2 px-3 py-2 rounded-xl 
                      bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl 
                      border border-gray-200/30 dark:border-slate-700/30">
        {/* Online Status */}
        <div className="flex items-center space-x-1.5">
          <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
          <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>

        <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>

        {/* System Load */}
        <div className="flex items-center space-x-1.5">
          <div className="w-2 h-2 rounded-full bg-blue-400"></div>
          <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
            Load: {systemLoad}%
          </span>
        </div>

        <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>

        {/* Active Sessions */}
        <div className="flex items-center space-x-1.5">
          <div className="w-2 h-2 rounded-full bg-purple-400"></div>
          <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
            Sessions: {user ? '1' : '0'}
          </span>
        </div>
      </div>
    );
  };

  /**
   * Notification Center
   */
  const NotificationCenter = () => {
    const [notifications, setNotifications] = useState([
      {
        id: 1,
        type: 'success',
        title: 'System Online',
        message: 'Attendance system is running normally',
        time: new Date(),
        read: false
      },
      {
        id: 2,
        type: 'info',
        title: 'Face Recognition Active',
        message: 'AI detection models are loaded and ready',
        time: new Date(Date.now() - 300000), // 5 minutes ago
        read: false
      },
      {
        id: 3,
        type: 'warning',
        title: 'Backup Scheduled',
        message: 'Daily backup will start in 2 hours',
        time: new Date(Date.now() - 900000), // 15 minutes ago
        read: true
      }
    ]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAsRead = (id) => {
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    };

    const getNotificationIcon = (type) => {
      switch (type) {
        case 'success':
          return <div className="w-2 h-2 bg-green-400 rounded-full"></div>;
        case 'warning':
          return <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>;
        case 'error':
          return <div className="w-2 h-2 bg-red-400 rounded-full"></div>;
        default:
          return <div className="w-2 h-2 bg-blue-400 rounded-full"></div>;
      }
    };

    const formatNotificationTime = (time) => {
      const now = new Date();
      const diff = Math.floor((now - time) / 1000);
      
      if (diff < 60) return 'Just now';
      if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
      if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
      return time.toLocaleDateString('id-ID');
    };

    return (
      <Dropdown
        button={
          <div className="relative group flex items-center justify-center w-10 h-10 
                          bg-white/60 hover:bg-white/80 dark:bg-slate-800/60 dark:hover:bg-slate-800/80 
                          backdrop-blur-xl cursor-pointer rounded-2xl border border-gray-200/50 dark:border-slate-600/50 
                          hover:scale-110 transition-all duration-300">
            <svg className="h-5 w-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 6L12 10.5 8.5 8 12 5.5 15.5 8z" />
            </svg>
            {unreadCount > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">{unreadCount > 9 ? '9+' : unreadCount}</span>
              </div>
            )}
          </div>
        }
        children={
          <div className="w-80">
            <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-slate-700/50 overflow-hidden">
              {/* Header */}
              <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700/50">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                  <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full">
                    {unreadCount} new
                  </span>
                </div>
              </div>

              {/* Notifications List */}
              <div className="max-h-64 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => markAsRead(notification.id)}
                    className={`p-4 border-b border-gray-50 dark:border-slate-700/30 cursor-pointer transition-all duration-200 ${
                      !notification.read 
                        ? 'bg-blue-50/50 dark:bg-blue-900/10 hover:bg-blue-100/50 dark:hover:bg-blue-900/20' 
                        : 'hover:bg-gray-50 dark:hover:bg-slate-700/30'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={`text-sm font-medium ${!notification.read ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}>
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          {formatNotificationTime(notification.time)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-4 py-3 border-t border-gray-100 dark:border-slate-700/50">
                <button className="w-full text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-200">
                  View All Notifications
                </button>
              </div>
            </div>
          </div>
        }
        classNames="py-2 top-full mt-2 -right-4 z-50"
      />
    );
  };

  /**
   * Real-time Date and Time Display
   */
  const DateTimeDisplay = ({ currentTime }) => {
    const formatTime = (date) => {
      return date.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
    };

    const formatDate = (date) => {
      return date.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    };

    return (
      <div className="hidden md:flex items-center space-x-4 px-4 py-2.5 rounded-2xl 
                      bg-white/60 hover:bg-white/80 dark:bg-slate-800/60 dark:hover:bg-slate-800/80 
                      backdrop-blur-xl border border-gray-200/50 dark:border-slate-700/50
                      hover:scale-105 transition-all duration-300">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-mono tracking-wider">
              {formatTime(currentTime)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              {formatDate(currentTime)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  /**
   * User Profile Dropdown
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
   * Profile Dropdown Content
   */
  const ProfileDropdownContent = ({ user, currentScheme, getRoleDisplayName }) => {
    const [sessionStart] = useState(new Date()); // Track session start time
    const [sessionDuration, setSessionDuration] = useState('0m');

    useEffect(() => {
      const timer = setInterval(() => {
        const now = new Date();
        const diff = Math.floor((now - sessionStart) / 1000);
        const hours = Math.floor(diff / 3600);
        const minutes = Math.floor((diff % 3600) / 60);
        
        if (hours > 0) {
          setSessionDuration(`${hours}h ${minutes}m`);
        } else {
          setSessionDuration(`${minutes}m`);
        }
      }, 60000); // Update every minute

      return () => clearInterval(timer);
    }, [sessionStart]);

    const getLastLoginTime = () => {
      // Simulate last login time (in real app, this would come from user data)
      const lastLogin = new Date();
      lastLogin.setMinutes(lastLogin.getMinutes() - Math.floor(Math.random() * 30));
      return lastLogin.toLocaleString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        day: 'numeric',
        month: 'short'
      });
    };

    return (
      <div className="w-80">
        <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-slate-700/50 overflow-hidden">
          {/* Profile Header */}
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
                  {user?.fullname || user?.name || "Administrator"}
                </p>
                <p className="text-white/90 capitalize font-semibold text-sm tracking-wide">
                  {getRoleDisplayName(user?.role)}
                </p>

                {/* Session Info */}
                <div className="mt-2 space-y-1">
                  <div className="text-xs text-white/80">
                    Session: {sessionDuration} • Last: {getLastLoginTime()}
                  </div>
                </div>

                {/* Role Badge */}
                <div className="mt-3">
                  <div className="inline-flex items-center px-3 py-1.5 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30">
                    <div className="w-6 h-6 bg-white/30 rounded-lg flex items-center justify-center mr-2">
                      <FiShield className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-xs font-bold text-white tracking-wider uppercase">
                      Full Access
                    </span>
                    <MdOutlineAutoAwesome className="h-3 w-3 text-white ml-1 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* System Statistics */}
          <div className="px-6 py-4 bg-gray-50/80 dark:bg-slate-900/50 border-b border-gray-100 dark:border-slate-700/50">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {new Date().getDate()}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Today
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600 dark:text-green-400">
                  {user ? '1' : '0'}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Sessions
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                  100%
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Uptime
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <ProfileMenuItems userRole={user?.role} />

          {/* Sign Out Section */}
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
    );
  };  /**
   * Profile Menu Items (Admin-only system)
   */
  const ProfileMenuItems = ({ userRole }) => (
    <div className="p-2 space-y-1">
      {/* Profile Settings */}
      <ProfileMenuItem
        icon={<FiUser className="h-5 w-5 text-white" />}
        iconBg="from-blue-500 to-blue-600"
        bgColor="group-hover:bg-blue-50/80 dark:group-hover:bg-blue-900/30"
        label="Profile & Settings"
        subtitle="Manage your account"
      />

      {/* System Management */}
      <ProfileMenuItem
        icon={<FiShield className="h-5 w-5 text-white" />}
        iconBg="from-purple-500 to-purple-600"
        bgColor="group-hover:bg-purple-50/80 dark:group-hover:bg-purple-900/30"
        label="System Management"
        subtitle="User & system administration"
      />

      {/* Attendance Analytics */}
      <ProfileMenuItem
        icon={<svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>}
        iconBg="from-emerald-500 to-emerald-600"
        bgColor="group-hover:bg-emerald-50/80 dark:group-hover:bg-emerald-900/30"
        label="Attendance Analytics"
        subtitle="Reports & data insights"
      />

      {/* Face Recognition Config */}
      <ProfileMenuItem
        icon={<MdFaceRetouchingNatural className="h-5 w-5 text-white" />}
        iconBg="from-indigo-500 to-indigo-600"
        bgColor="group-hover:bg-indigo-50/80 dark:group-hover:bg-indigo-900/30"
        label="Face Recognition"
        subtitle="AI model configuration"
      />

      {/* System Preferences */}
      <ProfileMenuItem
        icon={<FiSettings className="h-5 w-5 text-white" />}
        iconBg="from-gray-500 to-gray-600"
        bgColor="group-hover:bg-gray-50/80 dark:group-hover:bg-gray-900/30"
        label="System Preferences"
        subtitle="App settings & theme"
      />
    </div>
  );  /**
   * Profile Menu Item
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
  );

  // ===== MAIN COMPONENT RENDER =====
  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Glassmorphism Container */}
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
            <SystemBreadcrumb brandText={brandText} />
          </div>

          {/* ===== RIGHT SECTION: System Status, Notifications, DateTime & User Profile ===== */}
          <div className="relative z-10 flex items-center space-x-3">
            <SystemStatus />
            <NotificationCenter />
            <DateTimeDisplay currentTime={currentTime} />
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
