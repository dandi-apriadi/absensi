import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FiHelpCircle, FiFileText, FiGlobe, FiGithub, FiMail, FiExternalLink } from "react-icons/fi";

const Footer = () => {
  const { user, sidebarOpen } = useSelector(state => state.auth);

  // Role-based color scheme (matching sidebar)
  const roleColorScheme = {
    admin: "from-red-500 to-red-600",
    lecture: "from-blue-500 to-indigo-600",
    student: "from-emerald-500 to-green-600",
  };

  const currentYear = new Date().getFullYear();
  const currentScheme = roleColorScheme[user?.role] || roleColorScheme.lecture;
  const appVersion = "v2.0.3";

  return (
    <footer className={`
      transition-all duration-300 rounded-xl 
      bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm 
      border border-gray-200/30 dark:border-slate-700/30 
      shadow-md hover:shadow-lg 
      ${sidebarOpen ? 'px-6' : 'px-8'}
    `}>
      <div className="flex flex-col lg:flex-row items-center lg:justify-between py-5 gap-4">
        {/* Company & App Info Section */}
        <div className="flex flex-col items-center lg:items-start">
          <div className="flex items-center space-x-2">
            <div className={`h-8 w-8 rounded-lg bg-gradient-to-r ${currentScheme} flex items-center justify-center shadow-md`}>
              <span className="text-white font-bold text-xs">SA</span>
            </div>
            <h3 className="text-base font-bold text-gray-800 dark:text-white">SiAbsensi</h3>
            <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-full">
              {appVersion}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Smart Attendance System © {currentYear} All Rights Reserved
          </p>
        </div>

        {/* Quick Links Section */}
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/help" className="footer-link">
            <FiHelpCircle className="h-4 w-4" />
            <span>Help</span>
          </Link>

          <Link to="/docs" className="footer-link">
            <FiFileText className="h-4 w-4" />
            <span>Documentation</span>
          </Link>

          <a href="mailto:support@siabsensi.edu" className="footer-link">
            <FiMail className="h-4 w-4" />
            <span>Support</span>
          </a>

          <Link to="/about" className="footer-link">
            <FiExternalLink className="h-4 w-4" />
            <span>About</span>
          </Link>
        </div>

        {/* System Status */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center px-3 py-1.5 bg-gray-50 dark:bg-slate-800 rounded-lg">
            <div className="flex items-center space-x-1.5">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-gray-600 dark:text-gray-300">System Online</span>
            </div>
          </div>

          <div className="flex space-x-2">
            <a
              href="https://github.com/siabsensi"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="GitHub"
            >
              <FiGithub className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </a>
            <a
              href="https://siabsensi.edu"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Website"
            >
              <FiGlobe className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="py-2 border-t border-gray-100 dark:border-slate-700/50 text-center">
        <p className="text-xs text-gray-400 dark:text-gray-500">
          {user?.role === 'admin' ? 'Super Admin Portal' : user?.role === 'lecture' ? 'Lecturer Portal' : 'Student Portal'}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
