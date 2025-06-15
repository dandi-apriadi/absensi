import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toggleSidebar, closeSidebar, openSidebar } from "../../store/slices/authSlice";
import Navbar from "components/navbar";
import Sidebar from "components/sidebar";
import Footer from "components/footer/Footer";
import routes from "routes/routes-super-admin";
import "../../assets/css/sidebar-layout.css";

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
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50 dark:bg-slate-900">
      {/* Sidebar Component */}
      <Sidebar onClose={closeSidebarHandler} />

      {/* Main Content Wrapper - Dynamically adjusts width based on sidebar state */}
      <div
        className={`
          main-content-wrapper content-expand-animation
          relative flex flex-col h-full transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'w-[calc(100%-16rem)] ml-64' : 'w-full ml-0'}
        `}
        id="main-content-wrapper"
      >
        {/* Navbar Component */}
        <Navbar
          onOpenSidenav={handleSidebarToggle}
          logoText={"Super Admin Portal"}
          brandText={currentRoute}
          secondary={getActiveNavbar(routes)}
        />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-y-auto">
          {/* Content Container */}
          <div className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6">
            <div className="w-full mx-auto transition-all duration-300">
              <Routes>
                {getRoutes(routes)}
                <Route path="/" element={<Navigate to="/super-admin/default" replace />} />
              </Routes>
            </div>
          </div>

          {/* Footer */}
          <div className="w-full px-4 sm:px-6 lg:px-8 pb-6">
            <div className="w-full mx-auto transition-all duration-300">
              <Footer />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}