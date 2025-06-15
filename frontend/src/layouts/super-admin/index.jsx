import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toggleSidebar, closeSidebar, openSidebar } from "../../store/slices/authSlice";
import Navbar from "components/navbar";
import Sidebar from "components/sidebar";
import Footer from "components/footer/Footer";
import routes from "routes/routes-super-admin";

export default function SuperAdminLayout() {
  const { pathname } = useLocation();
  const [currentRoute, setCurrentRoute] = useState("Main Dashboard");
  const dispatch = useDispatch();
  const { sidebarOpen } = useSelector((state) => state.auth);

  // Simplified toggle function - less verbose
  const handleSidebarToggle = () => {
    dispatch(toggleSidebar());
  };

  // Simple handlers for open/close
  const openSidebarHandler = () => dispatch(openSidebar());
  const closeSidebarHandler = () => dispatch(closeSidebar());

  // Ensure body class is updated when sidebar state changes
  useEffect(() => {
    if (sidebarOpen) {
      document.body.classList.add('sidebar-is-open');
    } else {
      document.body.classList.remove('sidebar-is-open');
    }
  }, [sidebarOpen]);

  // Track route changes
  useEffect(() => {
    getActiveRoute(routes);
  }, [pathname]);

  const getActiveRoute = (routes) => {
    let activeRoute = "Super Admin Dashboard";
    for (let i = 0; i < routes.length; i++) {
      if (
        window.location.href.indexOf(
          routes[i].layout + "/" + routes[i].path
        ) !== -1
      ) {
        setCurrentRoute(routes[i].name);
      }
    }
    return activeRoute;
  };

  const getActiveNavbar = (routes) => {
    let activeNavbar = false;
    for (let i = 0; i < routes.length; i++) {
      if (
        window.location.href.indexOf(routes[i].layout + "/" + routes[i].path) !== -1
      ) {
        return routes[i].secondary;
      }
    }
    return activeNavbar;
  };

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/super-admin") {
        return (
          <Route path={`/${prop.path}`} element={prop.component} key={key} />
        );
      } else {
        return null;
      }
    });
  };

  document.documentElement.dir = "ltr";

  return (
    // IMPORTANT: Use className instead of style for better performance
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50 dark:bg-slate-900">
      {/* Sidebar Component - Only pass onClose handler */}
      <Sidebar onClose={closeSidebarHandler} />

      {/* Main Content Wrapper - Using Tailwind classes for transitions */}
      <div
        className={`
          relative flex flex-col flex-1 h-full w-full transition-all duration-300
          ${sidebarOpen ? 'ml-64' : 'ml-0'}
        `}
        id="main-content-wrapper"
      >
        {/* Navbar Component - Pass toggle handler */}
        <Navbar
          onOpenSidenav={handleSidebarToggle}
          logoText={"Super Admin Portal"}
          brandText={currentRoute}
          secondary={getActiveNavbar(routes)}
        />

        {/* Main Content - Scrollable container */}
        <main className="flex-1 flex flex-col overflow-y-auto">
          {/* Debug buttons - Optional utility controls */}
          <div className="fixed top-20 right-4 z-50 flex flex-col space-y-2">
            <button
              onClick={handleSidebarToggle}
              className="bg-purple-600 text-white px-3 py-1 rounded text-xs font-mono"
            >
              Toggle Sidebar
            </button>
            <button onClick={openSidebarHandler} className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-mono">
              Open Sidebar
            </button>
            <button onClick={closeSidebarHandler} className="bg-orange-600 text-white px-3 py-1 rounded text-xs font-mono">
              Close Sidebar
            </button>
          </div>

          {/* Content Area - Full width with padding */}
          <div className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6">
            {/* Content with max-width when sidebar is closed */}
            <div className={`w-full mx-auto ${!sidebarOpen ? 'max-w-7xl' : ''}`}>
              <Routes>
                {getRoutes(routes)}
                <Route path="/" element={<Navigate to="/super-admin/default" replace />} />
              </Routes>
            </div>
          </div>

          {/* Footer - Automatic width */}
          <div className="w-full px-4 sm:px-6 lg:px-8 pb-6">
            <div className={`w-full mx-auto ${!sidebarOpen ? 'max-w-7xl' : ''}`}>
              <Footer />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}