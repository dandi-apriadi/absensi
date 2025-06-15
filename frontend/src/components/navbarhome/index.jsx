import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from "react-redux";
import { getMe, logoutUser, reset } from "../../store/slices/authSlice";
import {
  MdFace, MdMenu, MdClose, MdArrowForward,
  MdAutoAwesome, MdDevices, MdTimer, MdSchool,
  MdLogin, MdDashboard, MdPerson, MdOutlineLogout,
  MdKeyboardArrowDown, MdNotifications, MdSettings,
  MdHelp, MdInfoOutline, MdStarBorder, MdChevronRight
} from 'react-icons/md';
import "./style.css";
import logo from "../../assets/img/homepage/logo.png";

const Navbar = () => {
  // Redux state and hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoading } = useSelector((state) => state.auth);

  // Local state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  // Refs
  const mobileMenuRef = useRef(null);
  const profileMenuRef = useRef(null);

  // Navigation items for homepage sections
  const navItems = [
    { name: "Beranda", link: "#hero", icon: <MdFace /> },
    { name: "Fitur", link: "#features", icon: <MdAutoAwesome /> },
    { name: "Teknologi", link: "#technology", icon: <MdDevices /> },
    { name: "Alur Kerja", link: "#workflow", icon: <MdTimer /> },
    { name: "Role Akses", link: "#roles", icon: <MdSchool /> },
  ];

  // Check if we're on the homepage
  const isHomepage = location.pathname === '/';

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      // Update scrolled state for navbar styling
      const offset = window.scrollY;
      setScrolled(offset > 80);

      // Update active section on homepage
      if (isHomepage) {
        const sections = ['hero', 'features', 'technology', 'workflow', 'roles'];

        // Find the currently visible section
        for (const section of sections) {
          const element = document.getElementById(section);
          if (element) {
            const rect = element.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom >= 100) {
              setActiveSection(section);
              break;
            }
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomepage]);

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        await dispatch(getMe()).unwrap();
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUser();
  }, [dispatch]);

  // Set document title
  useEffect(() => {
    document.title = user?.name ? `SmartAccess | ${user.name}` : "SmartAccess";
  }, [user]);

  // Handle mobile menu toggle
  const toggleMobileMenu = (e) => {
    e?.stopPropagation();
    setIsMobileMenuOpen(!isMobileMenuOpen);
    document.body.style.overflow = !isMobileMenuOpen ? 'hidden' : '';
  };

  // Handle mobile menu close
  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = '';
  };

  // Handle profile menu toggle
  const toggleProfileMenu = (e) => {
    e?.stopPropagation();
    setIsProfileOpen(!isProfileOpen);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      // Close profile menu if clicking outside
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }

      // Close mobile menu if clicking outside
      if (mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target) &&
        !e.target.closest('.menu-button')) {
        handleMobileMenuClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      dispatch(reset());
      setIsProfileOpen(false);
      navigate('/auth/sign-in');
    } catch (error) {
      console.error('Logout failed:', error.message);
    }
  };

  // Determine navbar background style based on scroll and page
  const getNavbarStyle = () => {
    if (scrolled) {
      return "bg-white shadow-sm";
    }
    if (isHomepage) {
      return "bg-transparent";
    }
    return "bg-white shadow-sm";
  };

  // Loading indicator component
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm z-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full"
        />
      </div>
    );
  }

  return (
    <>
      {/* Main navbar with glassmorphism effect */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
            ? 'bg-white/90 backdrop-blur-lg shadow-lg py-3'
            : (isHomepage ? 'py-6 bg-transparent' : 'bg-white/90 backdrop-blur-md shadow-md py-3')
          }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Enhanced logo with animations */}
            <Link to="/" className="group flex items-center">
              <div className={`h-10 w-10 overflow-hidden rounded-xl transition-all duration-500 shadow-lg ${scrolled || !isHomepage
                  ? 'bg-gradient-to-br from-blue-600 to-indigo-700 shadow-blue-500/20'
                  : 'bg-white/20 backdrop-blur-lg border border-white/20'
                }`}>
                <motion.div
                  className="h-full w-full flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <MdFace className={`text-2xl ${scrolled || !isHomepage ? 'text-white' : 'text-white'
                    }`} />
                </motion.div>
              </div>
              <div className="ml-3">
                <motion.span
                  className={`font-bold text-xl tracking-tight ${scrolled || !isHomepage ? 'text-slate-800' : 'text-white'
                    } transition-colors duration-300`}
                  whileHover={{ scale: 1.02 }}
                >
                  Smart<span className="text-blue-600">Access</span>
                </motion.span>
                {scrolled &&
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500"
                  />
                }
              </div>
            </Link>

            {/* Desktop nav links with improved animations */}
            {isHomepage && (
              <div className="hidden md:flex items-center space-x-1">
                {navItems.map((item, index) => (
                  <motion.a
                    key={index}
                    href={item.link}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center relative overflow-hidden ${activeSection === item.link.substring(1)
                        ? (scrolled
                          ? 'text-blue-600 bg-blue-50/80 shadow-sm'
                          : 'text-white bg-white/15 backdrop-blur-md border border-white/10 shadow-lg shadow-white/5')
                        : (scrolled
                          ? 'text-slate-600 hover:text-blue-600 hover:bg-blue-50/80'
                          : 'text-white/80 hover:text-white hover:bg-white/10')
                      }`}
                  >
                    <span className="mr-1.5">{item.icon}</span>
                    {item.name}
                    {activeSection === item.link.substring(1) && (
                      <motion.div
                        layoutId="navIndicator"
                        className={`absolute bottom-0 inset-x-0 h-0.5 ${scrolled ? 'bg-blue-500' : 'bg-white/70'}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      />
                    )}
                  </motion.a>
                ))}
              </div>
            )}

            {/* Auth buttons / User menu with enhanced design */}
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="relative profile-menu" ref={profileMenuRef}>
                  <motion.button
                    onClick={toggleProfileMenu}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`flex items-center space-x-2 rounded-xl py-2 px-3 transition-all duration-300 ${scrolled || !isHomepage
                        ? 'bg-slate-100 border border-slate-200 hover:bg-slate-200'
                        : 'bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/15'
                      }`}
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-lg flex items-center justify-center shadow-inner shadow-blue-600/30">
                      {user.name ? user.name[0].toUpperCase() : <MdPerson />}
                    </div>
                    <span className={`text-sm font-medium hidden sm:block ${scrolled || !isHomepage ? 'text-slate-800' : 'text-white'
                      }`}>
                      {user.name?.split(' ')[0] || 'Pengguna'}
                    </span>
                    <motion.div
                      animate={{ rotate: isProfileOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <MdKeyboardArrowDown className={
                        scrolled || !isHomepage ? 'text-slate-500' : 'text-white/70'
                      } />
                    </motion.div>
                  </motion.button>

                  {/* Enhanced dropdown menu with better animations */}
                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, type: "spring", stiffness: 350 }}
                        className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50"
                      >
                        {/* User info card with gradient background */}
                        <div className="bg-gradient-to-br from-slate-50 to-blue-50 px-6 py-4 border-b border-slate-200">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl flex items-center justify-center text-xl font-semibold shadow-lg shadow-blue-600/20">
                              {user.name ? user.name[0].toUpperCase() : <MdPerson />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-base font-bold text-slate-900 truncate">{user.name}</p>
                              <p className="text-xs text-slate-500 truncate">{user.email}</p>
                              <div className="flex items-center mt-1">
                                <span className="inline-flex items-center text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                                  <MdStarBorder className="mr-1 text-xs" />
                                  Active User
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Menu items with hover effects */}
                        <div className="py-2">
                          <Link
                            to="/dashboard"
                            className="flex items-center px-6 py-3 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 group"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <div className="p-2 rounded-lg bg-blue-50 text-blue-600 mr-3 group-hover:bg-blue-100 transition-colors">
                              <MdDashboard />
                            </div>
                            <span>Dashboard</span>
                            <MdChevronRight className="ml-auto text-slate-400 group-hover:text-blue-500 transition-colors" />
                          </Link>

                          <Link
                            to="/profile"
                            className="flex items-center px-6 py-3 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 group"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <div className="p-2 rounded-lg bg-blue-50 text-blue-600 mr-3 group-hover:bg-blue-100 transition-colors">
                              <MdPerson />
                            </div>
                            <span>Profil Saya</span>
                            <MdChevronRight className="ml-auto text-slate-400 group-hover:text-blue-500 transition-colors" />
                          </Link>

                          <Link
                            to="/notifications"
                            className="flex items-center justify-between px-6 py-3 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 group"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <div className="flex items-center">
                              <div className="p-2 rounded-lg bg-blue-50 text-blue-600 mr-3 group-hover:bg-blue-100 transition-colors">
                                <MdNotifications />
                              </div>
                              <span>Notifikasi</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-medium px-2 py-1 rounded-full shadow-sm">3</span>
                              <MdChevronRight className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                            </div>
                          </Link>

                          <Link
                            to="/settings"
                            className="flex items-center px-6 py-3 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 group"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <div className="p-2 rounded-lg bg-blue-50 text-blue-600 mr-3 group-hover:bg-blue-100 transition-colors">
                              <MdSettings />
                            </div>
                            <span>Pengaturan</span>
                            <MdChevronRight className="ml-auto text-slate-400 group-hover:text-blue-500 transition-colors" />
                          </Link>

                          <div className="border-t border-slate-100 my-2"></div>

                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center px-6 py-3 text-sm text-red-600 hover:bg-red-50 group"
                          >
                            <div className="p-2 rounded-lg bg-red-50 text-red-500 mr-3 group-hover:bg-red-100 transition-colors">
                              <MdOutlineLogout />
                            </div>
                            <span>Keluar</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Link
                    to="/auth/sign-in"
                    className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center space-x-2 ${scrolled || !isHomepage
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg shadow-blue-500/20'
                        : 'bg-white hover:bg-white/90 text-blue-600 shadow-md'
                      }`}
                  >
                    <MdLogin className="text-lg" />
                    <span>Masuk Sistem</span>
                  </Link>
                </motion.div>
              )}

              {/* Enhanced mobile menu button with animations */}
              <motion.button
                onClick={toggleMobileMenu}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`menu-button md:hidden p-2.5 rounded-lg ${scrolled || !isHomepage
                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                    : 'bg-white/10 backdrop-blur-lg text-white hover:bg-white/15 border border-white/20'
                  } focus:outline-none`}
                aria-label="Menu"
              >
                {isMobileMenuOpen ?
                  <MdClose className="w-6 h-6" /> :
                  <MdMenu className="w-6 h-6" />
                }
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Redesigned mobile menu with improved animations and UX */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop with blur effect */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-40 md:hidden"
              onClick={handleMobileMenuClose}
            />

            {/* Menu panel with improved visual design */}
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              ref={mobileMenuRef}
              className="fixed inset-y-0 right-0 z-50 w-full sm:max-w-[360px] bg-white shadow-2xl flex flex-col md:hidden"
            >
              {/* Header with improved design */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-6 text-white">
                <div className="flex justify-between items-center">
                  <Link to="/" onClick={handleMobileMenuClose} className="flex items-center">
                    <div className="h-9 w-9 bg-white/20 flex items-center justify-center rounded-lg backdrop-blur-sm border border-white/20">
                      <MdFace className="text-xl text-white" />
                    </div>
                    <span className="ml-2 font-bold text-lg">SmartAccess</span>
                  </Link>
                  <motion.button
                    onClick={handleMobileMenuClose}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-lg text-white bg-white/10 hover:bg-white/20 focus:outline-none"
                    aria-label="Close menu"
                  >
                    <MdClose className="w-6 h-6" />
                  </motion.button>
                </div>

                {/* User quick info */}
                {user && (
                  <div className="mt-6 flex items-center space-x-4">
                    <div className="h-14 w-14 bg-white/10 backdrop-blur-md text-white rounded-xl flex items-center justify-center text-2xl font-semibold border border-white/10">
                      {user.name ? user.name[0].toUpperCase() : <MdPerson />}
                    </div>
                    <div>
                      <h3 className="font-medium text-white text-lg">{user.name}</h3>
                      <p className="text-sm text-blue-100">{user.email}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex-1 overflow-y-auto">
                {/* Navigation links section */}
                {isHomepage && (
                  <div className="p-6 border-b border-slate-100">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4 ml-2">
                      Navigasi
                    </h3>
                    <div className="space-y-1">
                      {navItems.map((item, idx) => (
                        <motion.a
                          key={idx}
                          href={item.link}
                          onClick={handleMobileMenuClose}
                          className={`flex items-center w-full px-4 py-3 rounded-xl transition-all group ${activeSection === item.link.substring(1)
                              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md'
                              : 'text-slate-700 hover:bg-blue-50'
                            }`}
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span className={`p-2 rounded-lg mr-3 ${activeSection === item.link.substring(1)
                              ? 'bg-white/20 text-white'
                              : 'bg-blue-100 text-blue-600 group-hover:bg-blue-200'
                            } transition-colors`}>
                            {item.icon}
                          </span>
                          {item.name}
                          {activeSection === item.link.substring(1) && (
                            <motion.div
                              className="ml-auto bg-white/20 rounded-full w-2 h-2"
                              layoutId="mobileActiveIndicator"
                            />
                          )}
                        </motion.a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick actions section */}
                <div className="p-6">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4 ml-2">
                    {user ? 'Menu Utama' : 'Akses Pengguna'}
                  </h3>

                  {user ? (
                    <div className="space-y-2">
                      <motion.div
                        className="grid grid-cols-2 gap-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <Link
                          to="/dashboard"
                          onClick={handleMobileMenuClose}
                          className="flex flex-col items-center justify-center p-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-center"
                        >
                          <MdDashboard className="text-2xl mb-2" />
                          <span className="text-sm font-medium">Dashboard</span>
                        </Link>

                        <Link
                          to="/profile"
                          onClick={handleMobileMenuClose}
                          className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors text-center"
                        >
                          <MdPerson className="text-2xl mb-2" />
                          <span className="text-sm font-medium">Profil</span>
                        </Link>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Link
                          to="/notifications"
                          onClick={handleMobileMenuClose}
                          className="flex items-center justify-between w-full px-4 py-3.5 mt-3 text-slate-700 bg-blue-50 hover:bg-blue-100 rounded-xl group transition-colors"
                        >
                          <div className="flex items-center">
                            <span className="p-2 bg-blue-200 text-blue-700 rounded-lg mr-3 group-hover:bg-blue-300 transition-colors">
                              <MdNotifications />
                            </span>
                            <span className="font-medium">Notifikasi</span>
                          </div>
                          <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-medium px-2 py-1 rounded-full shadow-sm">
                            3
                          </span>
                        </Link>
                      </motion.div>

                      {/* Additional menu items */}
                      <div className="mt-4 space-y-1">
                        <Link
                          to="/settings"
                          onClick={handleMobileMenuClose}
                          className="flex items-center w-full px-4 py-3 text-slate-700 hover:bg-slate-100 rounded-xl"
                        >
                          <span className="p-2 bg-slate-200 rounded-lg text-slate-700 mr-3">
                            <MdSettings />
                          </span>
                          Pengaturan
                        </Link>
                        <Link
                          to="/help"
                          onClick={handleMobileMenuClose}
                          className="flex items-center w-full px-4 py-3 text-slate-700 hover:bg-slate-100 rounded-xl"
                        >
                          <span className="p-2 bg-slate-200 rounded-lg text-slate-700 mr-3">
                            <MdHelp />
                          </span>
                          Bantuan
                        </Link>
                      </div>

                      <div className="border-t border-slate-200 my-4"></div>

                      <motion.button
                        onClick={() => {
                          handleLogout();
                          handleMobileMenuClose();
                        }}
                        className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl"
                        whileHover={{ x: 4 }}
                      >
                        <span className="p-2 bg-red-100 rounded-lg text-red-600 mr-3">
                          <MdOutlineLogout />
                        </span>
                        <span className="font-medium">Keluar</span>
                      </motion.button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <Link
                          to="/auth/sign-in"
                          onClick={handleMobileMenuClose}
                          className="flex items-center justify-center w-full px-5 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg shadow-blue-500/20 font-medium"
                        >
                          <MdLogin className="mr-2 text-xl" />
                          Masuk Sistem
                        </Link>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <Link
                          to="/info"
                          onClick={handleMobileMenuClose}
                          className="flex items-center justify-center w-full px-5 py-4 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl"
                        >
                          <MdInfoOutline className="mr-2 text-xl" />
                          Info Lebih Lanjut
                        </Link>
                      </motion.div>

                      {/* Quick links section for non-logged in users */}
                      <div className="border-t border-slate-100 pt-4 mt-6">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3 ml-2">
                          Quick Links
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          <a href="#features" onClick={handleMobileMenuClose} className="flex flex-col items-center p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                            <MdAutoAwesome className="text-blue-600 text-xl mb-1" />
                            <span className="text-xs font-medium text-slate-700">Fitur</span>
                          </a>
                          <a href="#technology" onClick={handleMobileMenuClose} className="flex flex-col items-center p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                            <MdDevices className="text-blue-600 text-xl mb-1" />
                            <span className="text-xs font-medium text-slate-700">Teknologi</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer with improved design */}
              <div className="p-6 border-t border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50">
                <div className="text-center">
                  <div className="flex justify-center mb-3">
                    <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white text-sm">
                      <MdFace />
                    </div>
                  </div>
                  <p className="text-sm font-medium text-slate-800">Smart Access System</p>
                  <p className="text-xs text-slate-500 mt-1">© {new Date().getFullYear()} SmartAccess</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Notification indicator */}
      {user && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="fixed bottom-6 right-6 z-40 md:hidden"
        >
          <Link
            to="/notifications"
            className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
          >
            <div className="relative">
              <MdNotifications className="text-2xl" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">3</span>
            </div>
          </Link>
        </motion.div>
      )}
    </>
  );
};

export default Navbar;