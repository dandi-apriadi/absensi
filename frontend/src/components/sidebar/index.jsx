import React, { useMemo, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { closeSidebar, openSidebar, getMe } from "../../store/slices/authSlice";
import { HiX } from "react-icons/hi";
import { FaUserCircle } from "react-icons/fa";
import { SidebarLinks } from "./components/Links";

// Route imports
import routesAdmin from "../../routes/routes-super-admin.js";
import routesLecture from "../../routes/routes-lecturer.js";
import routesStudent from "../../routes/routes-student.js";

// Assets
import proposalLogo from "../../assets/img/profile/poli.png";

// Validate routes to ensure they contain valid components
const validateRoutes = (routes) => {
  if (!Array.isArray(routes)) {
    return [];
  }

  return routes.filter(route => {
    if (!route || typeof route !== 'object') {
      return false;
    }

    // Check if route has required properties
    if (!route.name || !route.layout || !route.path) {
      return false;
    }

    // Check if component exists and is valid
    if (!route.component) {
      return false;
    }

    const isValidComponent = (
      typeof route.component === 'function' ||
      typeof route.component === 'string' ||
      React.isValidElement(route.component)
    );

    return isValidComponent;
  });
};

const Sidebar = ({ onClose }) => {
  const dispatch = useDispatch();
  const { user, microPage, sidebarOpen, isLoading } = useSelector((state) => state.auth);
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

  // Fetch user data if not available
  useEffect(() => {
    if (!user) {
      dispatch(getMe()).catch((error) => {
        console.error("Failed to fetch user data:", error);
      });
    }
  }, [dispatch, user]);

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

      const selectedRoutes = roleRoutes[user?.role];

      // If no routes found for user role, return empty array
      if (!selectedRoutes) {
        return [];
      }

      const validatedRoutes = validateRoutes(selectedRoutes);

      return validatedRoutes;
    } catch (error) {
      console.error("Error processing routes:", error);
      return [];
    }
  }, [user?.role]);
  return (
    <>
      {/* Clean Sidebar */}
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
          <div className="h-full bg-white dark:bg-slate-900 shadow-lg border-r border-gray-200 dark:border-slate-700 flex flex-col">

            {/* Simple Header */}
            <div className="px-4 py-4 border-b border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500 p-2 shadow-md">
                    <img
                      src={proposalLogo}
                      alt="Logo"
                      className="w-full h-full object-cover rounded-sm"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h1 className="text-base font-bold text-gray-900 dark:text-white">
                      SiAbsensi
                    </h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Smart Attendance System
                    </p>
                  </div>
                </div>

                {/* Close button for mobile */}
                <button
                  onClick={handleClose}
                  className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 
                           transition-colors lg:hidden"
                  aria-label="Close sidebar"
                >
                  <HiX className="h-5 w-5" />
                </button>              </div>
            </div>

            {/* Clean Minimal User Profile */}
            <div className="px-4 py-4 border-b border-gray-200 dark:border-slate-700">
              {isLoading ? (
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-slate-700 animate-pulse"></div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
                    <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded animate-pulse w-16"></div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  {/* Simple Clean Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden border-2 border-gray-200 dark:border-slate-600">
                    {user?.profile_picture && user.profile_picture !== 'default-profile.png' ? (
                      <img
                        src={user.profile_picture}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FaUserCircle className="h-6 w-6 text-gray-400" />
                    )}
                  </div>

                  {/* Clean User Details */}
                  <div className="flex-1 min-w-0">
                    {/* User Name Row */}
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                        {user?.fullname && user.fullname !== '-' ? user.fullname : user?.email?.split('@')[0] || 'Guest User'}
                      </h3>
                      {user?.verified && (
                        <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Simple Role Badge */}
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${user?.role === 'super-admin'
                      ? 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800'
                      : user?.role === 'lecturer'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800'
                        : 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800'
                      }`}>
                      {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || 'Guest'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Simple Page Title */}
            <div className="px-4 py-3 border-b border-gray-200 dark:border-slate-700">              <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
                {microPage !== "unset" ? microPage : "Dashboard"}
              </h2>
            </div>

              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {new Date().toLocaleDateString('id-ID', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'short'
                })} • {new Date().toLocaleTimeString('id-ID', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>

            {/* Simple Navigation Header */}
            <div className="px-4 py-2">
              <h2 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                Navigation
              </h2>
            </div>

            {/* Simple Navigation Links */}
            <div className="flex-1 px-2 pb-4 overflow-hidden">
              <div className="h-full overflow-y-auto pr-2">
                {isLoading ? (
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-12 bg-gray-100 dark:bg-slate-800 rounded-lg animate-pulse"></div>
                    ))}
                  </div>
                ) : Array.isArray(routes) && routes.length > 0 ? (
                  <SidebarLinks routes={routes} />
                ) : (
                  <div className="text-center py-6 px-3">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-slate-800 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6" />
                      </svg>
                    </div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      {!user ? 'Please login to access navigation' : 'No navigation available'}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {!user ? 'Authentication required' : 'Check your permissions'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Simple Footer */}
            <div className="px-4 py-3 border-t border-gray-200 dark:border-slate-700">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-1">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    System Online
                  </p>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  © 2025 SiAbsensi v2.0
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30 transition-opacity duration-300"
          onClick={handleClose}
        />
      )}
    </>
  );
};

export default Sidebar;
