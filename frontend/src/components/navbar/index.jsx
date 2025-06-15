import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleSidebar } from "../../store/slices/authSlice";
import { Link } from "react-router-dom";
import {
  FiMenu, FiX, FiSearch, FiBell, FiHome, FiUser, FiSettings,
  FiChevronLeft, FiChevronRight, FiSidebar, FiLayers
} from "react-icons/fi";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { RiNotification3Line } from "react-icons/ri";
import Dropdown from "components/dropdown";
import avatar from "assets/img/avatars/avatar4.png";

const Navbar = ({ onOpenSidenav, brandText: initialBrandText }) => {
  const [brandText, setBrandText] = useState(initialBrandText);
  const dispatch = useDispatch();
  const { microPage, user, sidebarOpen } = useSelector((state) => state.auth);

  useEffect(() => {
    setBrandText(microPage !== "unset" ? microPage : initialBrandText);
  }, [microPage, initialBrandText]);

  // Role-based color scheme
  const roleColorScheme = {
    admin: "from-red-500 to-red-600",
    lecture: "from-blue-500 to-indigo-600",
    student: "from-emerald-500 to-green-600",
  };

  const currentScheme = roleColorScheme[user?.role] || roleColorScheme.lecture;

  // Simplified toggle handler - uses Redux directly
  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
    if (typeof onOpenSidenav === 'function') onOpenSidenav();
  };

  return (
    <header className="sticky top-0 z-30 w-full">
      {/* Modern Navbar Container */}
      <div className="mx-4 mt-4 mb-2">
        <nav className="flex items-center justify-between h-16 px-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-gray-200/30 dark:border-slate-700/30 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">

          {/* Left Section */}
          <div className="flex items-center space-x-4">
            {/* Enhanced Mobile Toggle Button with Animation - Fixed height to avoid layout shifts */}
            <button
              onClick={handleToggleSidebar}
              className={`
                lg:hidden
                relative p-3 rounded-xl group
                bg-gradient-to-r ${currentScheme}
                text-white shadow-md hover:shadow-lg
                transform hover:scale-105 active:scale-95
                transition-all duration-200
                border border-white/20
                focus:outline-none focus:ring-2 focus:ring-white/50
                cursor-pointer z-50
                overflow-hidden
                w-11 h-11
              `}
              type="button"
              aria-label="Toggle sidebar on mobile"
              data-testid="mobile-sidebar-toggle"
            >
              {/* Background animation on hover */}
              <span className="absolute inset-0 w-full h-full bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>

              {/* Fixed width/height container for icons to prevent layout shifts */}
              <div className="relative z-10 pointer-events-none w-5 h-5 flex items-center justify-center">
                <FiMenu className={`absolute w-5 h-5 transition-all duration-300 ${sidebarOpen ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}`} />
                <FiX className={`absolute w-5 h-5 transition-all duration-300 ${sidebarOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`} />
              </div>

              {/* Active indicator */}
              {sidebarOpen && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse border-2 border-white pointer-events-none"></div>
              )}
            </button>

            {/* Enhanced Desktop Toggle Button with Animation - Fixed dimensions */}
            <button
              onClick={handleToggleSidebar}
              className={`
                hidden lg:flex items-center justify-between
                px-4 py-2 rounded-xl
                transition-all duration-300 ease-in-out
                ${sidebarOpen
                  ? 'bg-gradient-to-r from-gray-100 to-gray-50 dark:from-slate-800 dark:to-slate-700 text-gray-700 dark:text-white border border-gray-200 dark:border-slate-600'
                  : 'bg-gradient-to-r ' + currentScheme + ' text-white border border-white/20'}
                shadow-md hover:shadow-lg
                hover:scale-105 active:scale-95
                focus:outline-none
                group
                min-w-[140px]
              `}
              type="button"
              aria-label="Toggle sidebar on desktop"
              data-testid="desktop-sidebar-toggle"
            >
              {/* Fixed width container for text and icons */}
              <div className="flex items-center space-x-2">
                {/* Icon container with transition */}
                <div className="relative w-5 h-5 flex items-center justify-center">
                  <FiSidebar className={`
                    absolute w-5 h-5 transition-all duration-300
                    ${sidebarOpen
                      ? 'opacity-100 transform-none'
                      : 'opacity-0 -translate-y-4'}
                  `} />
                  <FiLayers className={`
                    absolute w-5 h-5 transition-all duration-300
                    ${!sidebarOpen
                      ? 'opacity-100 transform-none'
                      : 'opacity-0 translate-y-4'}
                  `} />
                </div>

                {/* Text label */}
                <span className="text-sm font-medium">
                  {sidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
                </span>
              </div>

              {/* Animated directional indicator */}
              <div className="relative w-4 h-4">
                <FiChevronLeft className={`
                  absolute w-4 h-4 transition-all duration-300
                  ${sidebarOpen
                    ? 'opacity-100 transform-none'
                    : 'opacity-0 translate-x-2'}
                `} />
                <FiChevronRight className={`
                  absolute w-4 h-4 transition-all duration-300
                  ${!sidebarOpen
                    ? 'opacity-100 transform-none'
                    : 'opacity-0 -translate-x-2'}
                `} />
              </div>
            </button>

            {/* Modern Breadcrumb */}
            <div className="flex items-center space-x-2">
              <Link
                to="/auth/homepage"
                className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
              >
                <FiHome className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              <div className="text-gray-300 dark:text-gray-600">/</div>
              <span className="px-3 py-1.5 text-sm font-bold text-gray-900 dark:text-white capitalize">
                {brandText}
              </span>
            </div>
          </div>

          {/* Center Section - Modern Search */}
          <div className="hidden lg:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type="search"
                placeholder="Search anything..."
                className="w-full pl-12 pr-4 py-3 text-sm bg-gray-50/80 dark:bg-slate-800/80 border border-gray-200/60 dark:border-slate-600/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-white dark:focus:bg-slate-800 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white transition-all duration-300 shadow-sm focus:shadow-md"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* Search Button for Mobile */}
            <button className="lg:hidden p-2.5 rounded-lg bg-gray-50 hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-400 transition-all duration-200 border border-gray-200 dark:border-slate-600 shadow-sm hover:shadow-md">
              <FiSearch className="h-5 w-5" />
            </button>

            {/* Enhanced Status Indicator for Sidebar - Using Redux state */}
            <div className="hidden lg:block">
              <div
                className={`
                  px-2.5 py-1 rounded-lg text-xs font-medium
                  flex items-center space-x-1.5
                  transition-all duration-300
                  ${sidebarOpen
                    ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-900/30'
                    : 'bg-gray-50 text-gray-500 dark:bg-slate-800 dark:text-gray-400 border-gray-200 dark:border-slate-700'}
                  border
                `}
                data-testid="sidebar-status-indicator"
              >
                <span className={`
                  w-2 h-2 rounded-full 
                  ${sidebarOpen ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}
                `}></span>
                <span>Sidebar {sidebarOpen ? 'Active' : 'Hidden'}</span>
              </div>
            </div>

            {/* Modern Notifications */}
            <Dropdown
              button={
                <div className="relative p-2.5 rounded-lg bg-gray-50 hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-600 hover:text-orange-600 dark:text-gray-400 dark:hover:text-orange-400 transition-all duration-200 cursor-pointer border border-gray-200 dark:border-slate-600 shadow-sm hover:shadow-md hover:scale-105">
                  <RiNotification3Line className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  </span>
                </div>
              }
              children={
                <div className="w-80">
                  <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden">
                    {/* Header */}
                    <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-700 dark:to-slate-600 border-b border-gray-100 dark:border-slate-600">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                            <FiBell className="h-4 w-4 text-white" />
                          </div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                        </div>
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium px-2 py-1 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20">
                          Mark all read
                        </button>
                      </div>
                    </div>

                    {/* Notification Items */}
                    <div className="max-h-80 overflow-y-auto">
                      <div className="p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 cursor-pointer border-b border-gray-100 dark:border-slate-700">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                            <FiBell className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 dark:text-white mb-1">
                              System Update Available
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              New features and improvements are ready to install
                            </p>
                            <div className="flex items-center space-x-2 text-xs">
                              <span className="text-gray-500">2 minutes ago</span>
                              <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full font-medium">High Priority</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-3 bg-gray-50 dark:bg-slate-700/50 border-t border-gray-100 dark:border-slate-600">
                      <button className="w-full text-sm text-center text-blue-600 hover:text-blue-700 font-semibold py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20">
                        View all notifications
                      </button>
                    </div>
                  </div>
                </div>
              }
              classNames="py-2 top-full mt-2 -right-4 z-50"
            />

            {/* Modern Profile Dropdown */}
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
                      {user?.role || "Member"}
                    </p>
                  </div>
                  <HiOutlineDotsVertical className="h-4 w-4 text-gray-400 hidden sm:block" />
                </div>
              }
              children={
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
                            {user?.role || "Member"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <a
                        href="#"
                        className="flex items-center px-6 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors group"
                      >
                        <div className="w-10 h-10 bg-gray-100 dark:bg-slate-700 rounded-xl flex items-center justify-center mr-4 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20">
                          <FiUser className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-600" />
                        </div>
                        <span className="font-medium">Profile Settings</span>
                      </a>
                      <a
                        href="#"
                        className="flex items-center px-6 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors group"
                      >
                        <div className="w-10 h-10 bg-gray-100 dark:bg-slate-700 rounded-xl flex items-center justify-center mr-4 group-hover:bg-purple-50 dark:group-hover:bg-purple-900/20">
                          <FiSettings className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-purple-600" />
                        </div>
                        <span className="font-medium">Settings</span>
                      </a>
                    </div>

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
              }
              classNames="py-2 top-full mt-2 -right-4 z-50"
            />
          </div>
        </nav>
      </div>
    </header>
  );
};


export default Navbar;
