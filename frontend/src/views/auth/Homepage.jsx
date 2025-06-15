import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  MdFace, MdDoorFront, MdFingerprint, MdVerifiedUser, MdDashboard,
  MdAccessTime, MdLock, MdSchool, MdAdminPanelSettings, MdOutlinePersonPin,
  MdArrowForward, MdSpeed, MdKeyboardArrowDown, MdCheck, MdPerson,
  MdTimer, MdAutoAwesome, MdApi, MdOutlinePrivacyTip, MdHistory,
  MdSecurity, MdDevices, MdChevronRight, MdPlayArrow, MdMouse
} from 'react-icons/md';

const Homepage = () => {
  // State and refs
  const [activeFeature, setActiveFeature] = useState(0);
  const [visibleSection, setVisibleSection] = useState('');
  const heroRef = useRef(null);
  const sectionRefs = useRef({});

  // Setup section references
  useEffect(() => {
    const sections = ['hero', 'features', 'technology', 'workflow', 'roles'];
    sections.forEach(section => {
      sectionRefs.current[section] = document.getElementById(section);
    });
  }, []);

  // Scroll tracking for animations
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;

      // Check which section is currently visible
      for (const section in sectionRefs.current) {
        const element = sectionRefs.current[section];
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            if (visibleSection !== section) setVisibleSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, [visibleSection]);

  // Parallax effect setup
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.8], [1, 0.9]);
  const heroY = useTransform(scrollYProgress, [0, 0.8], [0, 80]);

  // Features data with improved descriptions and new images
  const features = [
    {
      id: "face-recognition",
      title: "Pengenalan Wajah Canggih",
      description: "Teknologi AI dengan akurasi >99% dan sistem anti-spoofing untuk identifikasi wajah yang cepat dan aman",
      icon: <MdFace className="text-4xl" />,
      color: "from-blue-600 to-indigo-700",
      image: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=1160",
      bgColor: "bg-blue-50"
    },
    {
      id: "smart-door",
      title: "Akses Pintu Cerdas",
      description: "Sistem Electromagnetic lock terintegrasi dengan sensor proximity dan LED indikator untuk kemudahan monitoring status",
      icon: <MdDoorFront className="text-4xl" />,
      color: "from-emerald-600 to-teal-700",
      image: "https://images.unsplash.com/photo-1558402529-d2638a7023e9?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=1470",
      bgColor: "bg-emerald-50"
    },
    {
      id: "automated-attendance",
      title: "Absensi Otomatis Realtime",
      description: "Pencatatan kehadiran secara instan dengan analitik komprehensif untuk monitoring performa mahasiswa",
      icon: <MdAccessTime className="text-4xl" />,
      color: "from-violet-600 to-purple-700",
      image: "https://images.unsplash.com/photo-1484863137850-59afcfe05386?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=1471",
      bgColor: "bg-violet-50"
    },
    {
      id: "data-security",
      title: "Keamanan Data Biometrik",
      description: "Perlindungan data dengan enkripsi AES-256 dan kepatuhan penuh terhadap regulasi privasi data biometrik",
      icon: <MdLock className="text-4xl" />,
      color: "from-red-600 to-rose-700",
      image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=1332",
      bgColor: "bg-rose-50"
    }
  ];

  // System workflow steps with enhanced descriptions
  const workflowSteps = [
    {
      icon: <MdPerson />,
      title: "Deteksi Pendekatan",
      description: "Sensor proximity mendeteksi orang mendekati pintu dan mengaktifkan sistem secara otomatis",
      image: "https://images.unsplash.com/photo-1543286386-2e659306cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=1470"
    },
    {
      icon: <MdFace />,
      title: "Pengenalan Wajah",
      description: "AI melakukan face detection dan ekstraksi fitur untuk diverifikasi terhadap database wajah terdaftar",
      image: "https://images.unsplash.com/photo-1526378800651-c32d170fe6f8?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=1469"
    },
    {
      icon: <MdVerifiedUser />,
      title: "Verifikasi & Anti-Spoofing",
      description: "Sistem memverifikasi identitas dan melakukan pemeriksaan anti-spoofing melalui deteksi liveness",
      image: "https://images.unsplash.com/photo-1614064642639-e398cf05badb?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=1470"
    },
    {
      icon: <MdDoorFront />,
      title: "Kontrol Akses Pintu",
      description: "Electromagnetic lock membuka pintu otomatis jika verifikasi mencapai minimal 95% confidence threshold",
      image: "https://images.unsplash.com/photo-1587614381634-068e8bd9d478?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=1470"
    },
    {
      icon: <MdDashboard />,
      title: "Pencatatan Absensi",
      description: "Data kehadiran terekam ke database secara real-time dan tersedia pada dashboard monitoring",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=1470"
    }
  ];

  // User roles with enhanced descriptions and images
  const roles = [
    {
      icon: <MdAdminPanelSettings className="text-5xl" />,
      title: "Super Admin",
      features: [
        "Manajemen pengguna dan konfigurasi global sistem",
        "Monitoring keamanan dan audit trail lengkap",
        "Pengelolaan dataset wajah mahasiswa",
        "Dashboard analitik keseluruhan sistem",
        "Reset sistem dan operasi data massal"
      ],
      color: "from-blue-900 to-blue-600",
      accentColor: "bg-blue-900",
      lightColor: "bg-blue-50",
      image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=1470"
    },
    {
      icon: <MdOutlinePersonPin className="text-5xl" />,
      title: "Dosen",
      features: [
        "Dashboard absensi untuk setiap mata kuliah",
        "Verifikasi manual dan override kehadiran",
        "Analisis pola kehadiran mahasiswa real-time",
        "Export laporan untuk evaluasi perkuliahan",
        "Monitoring performa akademik mahasiswa"
      ],
      color: "from-violet-900 to-violet-600",
      accentColor: "bg-violet-900",
      lightColor: "bg-violet-50",
      image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=1470"
    },
    {
      icon: <MdSchool className="text-5xl" />,
      title: "Mahasiswa",
      features: [
        "Dashboard kehadiran personal yang komprehensif",
        "Pengajuan dan tracking izin/sakit online",
        "Akses QR code untuk absensi darurat",
        "Upload dan manajemen foto untuk dataset",
        "Akses jadwal dan rekap kehadiran per semester"
      ],
      color: "from-teal-900 to-teal-600",
      accentColor: "bg-teal-900",
      lightColor: "bg-teal-50",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=1470"
    }
  ];

  // Technology cards with improved descriptions
  const technologies = [
    {
      icon: <MdAutoAwesome />,
      title: "Deep Learning",
      description: "Model AI TensorFlow Lite teroptimasi untuk pengenalan wajah akurat dengan kemampuan adaptif"
    },
    {
      icon: <MdTimer />,
      title: "Proses Cepat",
      description: "Algoritma matching <500ms dengan pemrosesan edge computing untuk respons real-time"
    },
    {
      icon: <MdSecurity />,
      title: "Anti-Spoofing",
      description: "Deteksi 3D depth, eye movement tracking, dan pengecekan liveness berbasis AI"
    },
    {
      icon: <MdDevices />,
      title: "Edge Computing",
      description: "Pemrosesan lokal di perangkat mengurangi latency dan dependensi koneksi internet"
    },
    {
      icon: <MdApi />,
      title: "RESTful API",
      description: "Integrasi mulus dengan sistem akademik dan manajemen kampus yang sudah ada"
    },
    {
      icon: <MdOutlinePrivacyTip />,
      title: "Privacy Compliance",
      description: "Kepatuhan penuh pada regulasi privasi data biometrik dengan kontrol transparan"
    }
  ];

  // Stats with smooth counter animation
  const stats = [
    { number: "99.9%", label: "Akurasi Pengenalan" },
    { number: "<500ms", label: "Waktu Verifikasi" },
    { number: "24/7", label: "Monitoring Sistem" },
    { number: "100%", label: "Data Terenkripsi" }
  ];

  // Quick navigation component
  const QuickNavigation = () => (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <motion.div
        className="flex space-x-3 bg-white/90 backdrop-blur-lg px-5 py-3 rounded-full shadow-xl border border-slate-200"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <a
          href="#hero"
          className={`p-2.5 rounded-full transition-all duration-300 ${visibleSection === 'hero' ? 'bg-blue-100 text-blue-600' : 'text-slate-500 hover:text-blue-600'}`}
          title="Beranda"
        >
          <MdFace className="text-xl" />
        </a>
        <a
          href="#features"
          className={`p-2.5 rounded-full transition-all duration-300 ${visibleSection === 'features' ? 'bg-blue-100 text-blue-600' : 'text-slate-500 hover:text-blue-600'}`}
          title="Fitur"
        >
          <MdAutoAwesome className="text-xl" />
        </a>
        <a
          href="#technology"
          className={`p-2.5 rounded-full transition-all duration-300 ${visibleSection === 'technology' ? 'bg-blue-100 text-blue-600' : 'text-slate-500 hover:text-blue-600'}`}
          title="Teknologi"
        >
          <MdDevices className="text-xl" />
        </a>
        <a
          href="#workflow"
          className={`p-2.5 rounded-full transition-all duration-300 ${visibleSection === 'workflow' ? 'bg-blue-100 text-blue-600' : 'text-slate-500 hover:text-blue-600'}`}
          title="Alur Kerja"
        >
          <MdTimer className="text-xl" />
        </a>
        <a
          href="#roles"
          className={`p-2.5 rounded-full transition-all duration-300 ${visibleSection === 'roles' ? 'bg-blue-100 text-blue-600' : 'text-slate-500 hover:text-blue-600'}`}
          title="Role Pengguna"
        >
          <MdSchool className="text-xl" />
        </a>
      </motion.div>
    </div>
  );

  return (
    <div className="font-sans bg-white text-slate-800 overflow-x-hidden scroll-smooth">
      {/* Quick Navigation */}
      <QuickNavigation />

      {/* Hero section with enhanced image */}
      <section
        id="hero"
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900"
      >
        {/* Abstract background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[10%] left-[10%] w-80 h-80 bg-blue-500/30 rounded-full filter blur-[120px] animate-pulse"></div>
          <div className="absolute top-[40%] right-[15%] w-96 h-96 bg-violet-500/30 rounded-full filter blur-[120px] animate-pulse" style={{ animationDelay: '2s', animationDuration: '15s' }}></div>
          <div className="absolute bottom-[15%] left-[20%] w-72 h-72 bg-teal-400/20 rounded-full filter blur-[100px] animate-pulse" style={{ animationDelay: '1s', animationDuration: '10s' }}></div>
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-grid-white/[0.03] bg-[length:50px_50px]"></div>

        <motion.div
          className="relative max-w-7xl mx-auto px-6 lg:px-8 z-10 flex flex-col lg:flex-row items-center py-20"
          style={{ opacity: heroOpacity, y: heroY, scale: heroScale }}
        >
          <div className="lg:w-1/2 text-center lg:text-left mb-16 lg:mb-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <span className="inline-block px-4 py-1 rounded-full bg-blue-500/10 text-blue-300 font-medium mb-6 backdrop-blur-sm border border-blue-500/20">
                Teknologi Absensi Mahasiswa Modern
              </span>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-8 leading-tight">
                Sistem Pintu <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
                  Akses Cerdas
                </span>
              </h1>
              <p className="text-xl text-blue-100 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
                Optimalisasi proses absensi mahasiswa dengan teknologi pengenalan wajah dan pintu
                akses otomatis yang aman, akurat, dan efisien.
              </p>
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-5">
                <Link to="/login" className="btn-primary group">
                  <span>Masuk ke Sistem</span>
                  <MdArrowForward className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a href="#features" className="btn-secondary">
                  <MdPlayArrow className="mr-2" />
                  <span>Pelajari Lebih Lanjut</span>
                </a>
              </div>
            </motion.div>
          </div>

          <div className="lg:w-1/2">
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              {/* Enhanced 3D-like mockup with new image */}
              <div className="perspective-1200">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-blue-500/30 transform hover:scale-[1.02] transition-all duration-700 border border-white/10">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-violet-600/10 backdrop-blur-sm z-10"></div>
                  <img
                    src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=1448"
                    alt="Face recognition technology in action"
                    className="w-full h-[500px] object-cover"
                    loading="eager"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-8 z-20">
                    <h3 className="text-2xl font-bold text-white mb-2">Face Recognition Technology</h3>
                    <p className="text-blue-200 text-lg">Deep learning untuk identifikasi akurat dan aman</p>
                  </div>
                </div>
              </div>

              {/* Redesigned floating elements */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 flex items-center space-x-3 backdrop-blur-sm border border-slate-100"
              >
                <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
                  <MdFace className="text-2xl" />
                </div>
                <div>
                  <span className="font-bold text-slate-900">99.9%</span>
                  <p className="text-sm text-slate-600">Akurasi Pengenalan</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl p-4 flex items-center space-x-3 backdrop-blur-sm border border-slate-100"
              >
                <div className="p-3 bg-teal-100 rounded-xl text-teal-600">
                  <MdSpeed className="text-2xl" />
                </div>
                <div>
                  <span className="font-bold text-slate-900">&lt;500ms</span>
                  <p className="text-sm text-slate-600">Kecepatan Verifikasi</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.4, duration: 0.5 }}
                className="absolute top-1/3 -right-6 bg-white rounded-2xl shadow-xl p-4 flex items-center space-x-3 backdrop-blur-sm border border-slate-100"
              >
                <div className="p-3 bg-violet-100 rounded-xl text-violet-600">
                  <MdHistory className="text-2xl" />
                </div>
                <div>
                  <span className="font-bold text-slate-900">Real-time</span>
                  <p className="text-sm text-slate-600">Pencatatan Absensi</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Enhanced scroll indicator */}
        <motion.a
          href="#features"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-blue-300 hover:text-white transition-colors"
        >
          <span className="text-sm mb-2 backdrop-blur-sm px-6 py-2 rounded-full bg-white/5 border border-white/10 flex items-center">
            <MdMouse className="mr-2" />
            Scroll untuk menjelajahi
          </span>
          <MdKeyboardArrowDown className="animate-bounce text-2xl mt-2" />
        </motion.a>
      </section>

      {/* Feature Showcase - improved readability and visual hierarchy */}
      <section
        id="features"
        className="py-28 bg-gradient-to-b from-white to-slate-50"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.97), rgba(248, 250, 252, 0.97)), url('https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=1470')`,
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-700 font-medium mb-3">
              Fitur Utama
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-6 text-slate-900">
              Teknologi Canggih untuk Absensi Modern
            </h2>
            <p className="max-w-3xl mx-auto text-slate-600 text-xl leading-relaxed">
              Sistem pintu akses cerdas kami menggabungkan inovasi terbaru untuk menghadirkan keamanan
              dan efisiensi dalam proses absensi mahasiswa
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-12">
            {/* Feature selector - improved visual design */}
            <div className="lg:col-span-5 space-y-4">
              {features.map((feature, idx) => (
                <motion.button
                  key={feature.id}
                  onClick={() => setActiveFeature(idx)}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  className={`w-full flex items-center text-left p-5 rounded-2xl transition-all duration-300 ${activeFeature === idx
                    ? `bg-gradient-to-r ${feature.color} text-white shadow-xl`
                    : `${feature.bgColor} text-slate-800 hover:shadow-md`
                    }`}
                  aria-label={`Select ${feature.title}`}
                >
                  <div className={`p-4 rounded-xl ${activeFeature === idx ? 'bg-white/20' : 'bg-white'} mr-5 shadow-lg`}>
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-1">{feature.title}</h3>
                    {activeFeature === idx && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="text-sm leading-relaxed"
                      >
                        {feature.description}
                      </motion.p>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Feature display - enhanced visuals */}
            <div className="lg:col-span-7 rounded-3xl overflow-hidden shadow-2xl h-[550px] border border-slate-200">
              <div className="relative h-full">
                {features.map((feature, idx) => (
                  <motion.div
                    key={feature.id}
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: activeFeature === idx ? 1 : 0,
                      scale: activeFeature === idx ? 1 : 0.9
                    }}
                    transition={{ duration: 0.5 }}
                    className={`absolute inset-0 ${activeFeature === idx ? 'z-10' : 'z-0'}`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent z-10"></div>
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-10 z-20 text-white">
                      <h3 className="text-3xl font-bold mb-4">{feature.title}</h3>
                      <p className="text-white text-xl max-w-lg leading-relaxed">{feature.description}</p>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '100px' }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="h-1 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full mt-6"
                      ></motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Showcase - improved readability and card design */}
      <section
        id="technology"
        className="py-28 relative text-white overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.9), rgba(30, 27, 75, 0.9)), url('https://images.unsplash.com/photo-1639322537504-6427a16b0a28?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=1632')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1 rounded-full bg-blue-900 text-blue-200 font-medium mb-3">
              Teknologi
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-6 text-white">
              Powered by Advanced Technology
            </h2>
            <p className="max-w-3xl mx-auto text-slate-300 text-xl leading-relaxed">
              Menggunakan teknologi terdepan di industri untuk memastikan keamanan, akurasi,
              dan kecepatan proses absensi mahasiswa
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {technologies.map((tech, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="bg-slate-800/80 backdrop-blur-lg rounded-2xl p-8 border border-slate-700 hover:border-blue-500/30 transition-all hover:shadow-lg hover:shadow-blue-500/10 group"
              >
                <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-600/10 to-violet-600/10 border border-slate-700 text-blue-400 group-hover:text-blue-300 transition-colors inline-block mb-6">
                  {tech.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">{tech.title}</h3>
                <p className="text-slate-300 leading-relaxed text-lg">{tech.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats section - cleaner design with enhanced readability */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
              >
                <div className="relative">
                  <div
                    className="text-5xl md:text-6xl font-extrabold mb-2 text-white"
                  >
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.5 + idx * 0.1 }}
                    >
                      {stat.number}
                    </motion.span>
                  </div>
                  <div className="text-blue-100 font-medium text-xl">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works / Workflow - enhanced visual clarity with images */}
      <section id="workflow" className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-700 font-medium mb-3">
              Alur Kerja
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-6 text-slate-900">
              Bagaimana Sistem Bekerja?
            </h2>
            <p className="max-w-3xl mx-auto text-slate-600 text-xl leading-relaxed">
              Proses identifikasi dan absensi yang cepat, aman, dan tanpa kontak fisik
              untuk pengalaman pengguna yang optimal
            </p>
          </motion.div>

          <div className="relative mt-24">
            {/* Timeline connector - enhanced design */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-2 bg-gradient-to-b from-blue-300 via-blue-500 to-indigo-600 rounded-full"></div>

            {/* Steps - improved readability and visual structure with images */}
            <div className="space-y-40">
              {workflowSteps.map((step, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center`}
                >
                  <div className={`md:w-5/12 ${idx % 2 === 0 ? 'md:text-right md:pr-10' : 'md:text-left md:pl-10'} mb-10 md:mb-0`}>
                    <motion.div
                      initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, delay: 0.2 }}
                    >
                      <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-2">
                        Step {idx + 1}
                      </span>
                      <h3 className="text-2xl md:text-3xl font-bold mb-4 text-slate-800">{step.title}</h3>
                      <p className="text-slate-600 text-lg md:text-xl leading-relaxed">{step.description}</p>

                      {/* Image for step - visible only on mobile */}
                      <div className="mt-6 md:hidden rounded-2xl overflow-hidden shadow-lg">
                        <img
                          src={step.image}
                          alt={step.title}
                          className="w-full h-48 object-cover"
                          loading="lazy"
                        />
                      </div>
                    </motion.div>
                  </div>

                  <motion.div
                    className="relative mx-4 flex-shrink-0"
                    initial={{ scale: 0.5, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="h-20 w-20 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white text-3xl z-10 relative shadow-lg shadow-blue-500/30">
                      {step.icon}
                    </div>
                    <div className="absolute inset-0 rounded-2xl bg-blue-400/20 animate-ping"></div>
                  </motion.div>

                  <div className="md:w-5/12">
                    {/* Image for step - visible only on desktop */}
                    <motion.div
                      className="hidden md:block rounded-2xl overflow-hidden shadow-xl"
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, delay: 0.4 }}
                    >
                      <img
                        src={step.image}
                        alt={step.title}
                        className="w-full h-64 object-cover"
                        loading="lazy"
                      />
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Role-based Access - improved card design with background images */}
      <section id="roles" className="py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-700 font-medium mb-3">
              Role Akses
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-6 text-slate-900">
              Sistem Berbasis User Role
            </h2>
            <p className="max-w-3xl mx-auto text-slate-600 text-xl leading-relaxed">
              Akses dan fitur yang disesuaikan untuk setiap peran dalam sistem
              untuk pengalaman pengguna yang optimal
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {roles.map((role, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2, duration: 0.6 }}
                className="rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 group"
              >
                {/* Role Card Header with background image */}
                <div
                  className={`p-10 text-white relative bg-gradient-to-br ${role.color} overflow-hidden`}
                >
                  <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
                    <img
                      src={role.image}
                      alt={role.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="relative z-10">
                    <div className="p-5 bg-white/10 inline-block rounded-2xl mb-5 group-hover:bg-white/20 transition-colors shadow-lg">
                      {role.icon}
                    </div>
                    <h3 className="text-3xl font-bold mb-3">{role.title}</h3>
                    <div className="h-1 w-16 bg-white/40 rounded-full"></div>
                  </div>
                </div>

                {/* Role Card Features - improved readability */}
                <div className={`${role.lightColor} p-8 group-hover:bg-white transition-colors`}>
                  <ul className="space-y-5">
                    {role.features.map((feature, fidx) => (
                      <motion.li
                        key={fidx}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + fidx * 0.1 }}
                        className="flex items-start"
                      >
                        <div className={`p-1.5 ${role.accentColor} rounded-full text-white mr-3 mt-1 flex-shrink-0`}>
                          <MdCheck className="text-sm" />
                        </div>
                        <span className="text-slate-800 text-lg">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - modern design with better readability and background image */}
      <section
        className="relative py-24 text-white overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(30, 41, 59, 0.9), rgba(30, 27, 75, 0.9)), url('https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=1470')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Abstract background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full filter blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-500/20 rounded-full filter blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-indigo-500/20 rounded-full filter blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-grid-white/[0.03] bg-[length:50px_50px]"></div>

        <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white leading-tight">
              Siap Mengimplementasikan Sistem Absensi Modern?
            </h2>
            <p className="text-xl text-blue-100 mb-12 mx-auto leading-relaxed">
              Tingkatkan efisiensi absensi dan keamanan akses ruangan kampus dengan teknologi
              pengenalan wajah terdepan yang terintegrasi penuh dengan sistem akademik
            </p>
            <motion.div
              className="flex flex-wrap justify-center gap-5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <Link to="/login" className="btn-primary-light group">
                <span>Mulai Sekarang</span>
                <MdArrowForward className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/demo" className="btn-outline-light">
                <span>Jadwalkan Demo</span>
                <MdChevronRight className="ml-1" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Global styles */}
      <style jsx global>{`
        /* Background with grid pattern */
        .bg-grid-white {
          background-image: linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
        }
        
        /* Button Styles - enhanced for better visibility */
        .btn-primary {
          @apply bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-medium flex items-center justify-center transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-600/30 border border-blue-500;
        }
        
        .btn-secondary {
          @apply bg-white/10 border border-white/30 text-blue-100 hover:bg-white/20 px-8 py-4 rounded-full font-medium flex items-center justify-center transition-all backdrop-blur-sm;
        }
        
        .btn-primary-light {
          @apply bg-white hover:bg-blue-50 text-blue-700 hover:text-blue-800 px-8 py-4 rounded-full font-medium flex items-center justify-center transition-colors shadow-lg;
        }
        
        .btn-outline-light {
          @apply bg-transparent border border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-full font-medium flex items-center justify-center transition-all backdrop-blur-sm;
        }
        
        /* Enhanced 3D effects */
        .perspective-1200 {
          perspective: 1200px;
        }
        
        /* Improved smooth scrolling */
        html {
          scroll-behavior: smooth;
          scroll-padding-top: 20px;
        }
        
        /* Enhanced text rendering */
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      `}</style>
    </div>
  );
};

export default Homepage;