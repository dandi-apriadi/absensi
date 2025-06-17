import React, { useMemo, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { closeSidebar, openSidebar } from "../../store/slices/authSlice";
import { HiX } from "react-icons/hi";
import { FaUserCircle } from "react-icons/fa";
import Links from "./components/Links";

// Route imports
import routesAdmin from "../../routes/routes-super-admin.js";
import routesLecture from "../../routes/routes-lecturer.js";
import routesStudent from "../../routes/routes-student.js";

// Assets
import proposalLogo from "../../assets/img/profile/poli.png";

// Validate routes to ensure they contain valid components
const validateRoutes = (routes) => {
  if (!Array.isArray(routes)) return [];
  return routes.filter(route => {
    return route && typeof route === 'object' && (
      typeof route.component === 'function' ||
      typeof route.component === 'string' ||
      React.isValidElement(route.component)
    );
  });
};

const Sidebar = ({ onClose }) => {
  const dispatch = useDispatch();
  const { user, microPage, sidebarOpen } = useSelector((state) => state.auth);
  const sidebarRef = useRef(null);
  // Set sidebar open by default on desktop
  useEffect(() => {
    const checkScreenSize = () => {
      const isDesktop = window.innerWidth >= 1024; // lg breakpoint
      if (isDesktop && !sidebarOpen) {
        dispatch(openSidebar());
      } else if (!isDesktop && sidebarOpen) {
        // Close sidebar on mobile for better UX
        dispatch(closeSidebar());
      }
    };

    // Check on mount
    checkScreenSize();

    // Check on resize with debounce
    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkScreenSize, 150);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []); // Remove sidebarOpen dependency to prevent loops

  // Update DOM classes when sidebar state changes
  useEffect(() => {
    if (sidebarRef.current) {
      if (sidebarOpen) {
        sidebarRef.current.classList.add('sidebar-visible');
        document.body.classList.add('sidebar-is-open');
      } else {
        sidebarRef.current.classList.remove('sidebar-visible');
        document.body.classList.remove('sidebar-is-open');
      }
    }
  }, [sidebarOpen]);
  // Handle sidebar close
  const handleClose = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    dispatch(closeSidebar());
    if (typeof onClose === 'function') {
      onClose();
    }
  };

  // Use useMemo to only recalculate routes when user role changes
  const routes = useMemo(() => {
    try {
      const roleRoutes = {
        'super-admin': routesAdmin,
        'lecturer': routesLecture,
        'student': routesStudent,
      };

      const selectedRoutes = roleRoutes[user?.role] || routesStudent;
      return validateRoutes(selectedRoutes);
    } catch (error) {
      console.error("Error processing routes:", error);
      return [];
    }
  }, [user?.role]);

  // Simplified and cleaner color scheme
  const roleColorScheme = useMemo(() => {
    const schemes = {
      'super-admin': {
        primary: 'from-red-500 to-red-600',
        bg: 'bg-red-50/60',
        accent: 'bg-red-500',
        text: 'text-red-700',
        border: 'border-red-200'
      },
      'lecturer': {
        primary: 'from-blue-500 to-indigo-600',
        bg: 'bg-blue-50/60',
        accent: 'bg-blue-500',
        text: 'text-blue-700',
        border: 'border-blue-200'
      },
      'student': {
        primary: 'from-emerald-500 to-green-600',
        bg: 'bg-emerald-50/60',
        accent: 'bg-emerald-500',
        text: 'text-emerald-700',
        border: 'border-emerald-200'
      }
    };
    return schemes[user?.role] || schemes.student;
  }, [user?.role]);

  return (
    <>      {/* Improved sidebar with better positioning */}
      <div
        id="main-sidebar"
        ref={sidebarRef}
        className={`
          fixed top-0 left-0 z-40 h-full
          transition-all duration-300 ease-in-out
          ${sidebarOpen ? "w-64 translate-x-0 opacity-100" : "w-0 -translate-x-full opacity-0"}
        `}
        style={{
          visibility: sidebarOpen ? 'visible' : 'hidden',
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          width: sidebarOpen ? '16rem' : '0',
          boxShadow: sidebarOpen ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' : 'none',
          pointerEvents: sidebarOpen ? 'auto' : 'none',
        }}
        data-state={sidebarOpen ? "open" : "closed"}
        aria-hidden={!sidebarOpen}
      >
        {/* Only render sidebar content if open, to avoid tab order issues */}
        {sidebarOpen && (
          <div className="h-full bg-white dark:bg-slate-900 shadow-2xl border-r border-gray-200 dark:border-slate-700 flex flex-col">

            {/* Clean Header */}
            <div className="px-4 py-4 border-b border-gray-100 dark:border-slate-700">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${roleColorScheme.primary} p-1.5 shadow-lg`}>
                  <img
                    src={proposalLogo}
                    alt="Logo"
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-base font-bold text-gray-900 dark:text-white truncate">
                    SiAbsensi
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    Smart Attendance System
                  </p>
                </div>

                {/* Enhanced Close button with better visibility */}
                <button
                  onClick={handleClose}
                  className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 
                           transition-colors lg:hidden flex items-center justify-center"
                  aria-label="Close sidebar"
                >
                  <HiX className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Page Title & Welcome Section */}
            <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700">
              <div className="space-y-2">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white capitalize truncate">
                  {microPage !== "unset" ? microPage : "Dashboard"}
                </h2>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span>Welcome back, <span className="font-semibold">{user?.fullname || "User"}</span></span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                  <div className="flex items-center justify-between">
                    <span>{new Date().toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono">{new Date().toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Clean User Profile */}
            <div className="px-4 py-3">
              <div className={`
                rounded-lg ${roleColorScheme.bg} dark:bg-slate-800/50
                p-3 border ${roleColorScheme.border} dark:border-slate-700
                shadow-sm
              `}>
                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-md bg-gradient-to-r ${roleColorScheme.primary} p-0.5 shadow-md`}>
                    <div className="w-full h-full bg-white dark:bg-slate-800 rounded-sm flex items-center justify-center">
                      <FaUserCircle className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-xs truncate">
                      {user?.fullname || 'User Name'}
                    </h3>
                    <span className={`
                      inline-flex items-center px-1.5 py-0.5 rounded-md text-xs font-medium mt-0.5
                      bg-gradient-to-r ${roleColorScheme.primary} text-white shadow-sm
                    `}>
                      <div className="w-1 h-1 bg-white/80 rounded-full mr-1"></div>
                      {user?.role || 'User'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Clean Navigation Header */}
            <div className="px-4 py-2">
              <h2 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                Navigation
              </h2>
            </div>

            {/* Clean Navigation Links */}
            <div className="flex-1 px-2 pb-4 overflow-hidden">
              <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent pr-2">
                {Array.isArray(routes) && routes.length > 0 ? (
                  <Links routes={routes} />
                ) : (
                  <div className="text-center py-6 px-3">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-slate-800 rounded-lg flex items-center justify-center mx-auto mb-3 shadow-sm">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6" />
                      </svg>
                    </div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">No navigation available</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">Check your permissions</p>
                  </div>
                )}
              </div>
            </div>

            {/* Clean Footer */}
            <div className="px-4 py-3 border-t border-gray-100 dark:border-slate-700">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  System Online
                </p>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
                © 2025 SiAbsensi v2.0
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Improved backdrop for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30 transition-opacity duration-300"
          onClick={handleClose}
        />)}
    </>
  );
};

export default Sidebar;