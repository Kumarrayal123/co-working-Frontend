// DoctorNavbar.jsx - Complete Doctor Navbar with Tailwind CSS
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Stethoscope,
  LayoutDashboard,
  Calendar,
  Building2,
  Users,
  Wallet,
  LogOut,
  Menu,
  X,
  ChevronDown,
  User,
  Settings,
  Award,
  Clock,
  Activity,
  HeartPulse,
  TrendingUp,
  FileText,
  Home,
  ChevronRight,
  CreditCard,
  History,
  Banknote
} from "lucide-react";
import logo from "../assets/logo.png";

const DoctorNavbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [chambersOpen, setChambersOpen] = useState(false);
  const [bookingsOpen, setBookingsOpen] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);
  const [paymentsOpen, setPaymentsOpen] = useState(false);
  const profileRef = useRef(null);
  const chambersRef = useRef(null);
  const bookingsRef = useRef(null);
  const walletRef = useRef(null);
  const paymentsRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
      if (chambersRef.current && !chambersRef.current.contains(event.target)) {
        setChambersOpen(false);
      }
      if (bookingsRef.current && !bookingsRef.current.contains(event.target)) {
        setBookingsOpen(false);
      }
      if (walletRef.current && !walletRef.current.contains(event.target)) {
        setWalletOpen(false);
      }
      if (paymentsRef.current && !paymentsRef.current.contains(event.target)) {
        setPaymentsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const isActive = (path) => location.pathname === path;
  const isParentActive = (paths) => paths.some(p => location.pathname === p);

  const handleLogout = () => {
    localStorage.removeItem("doctor");
    localStorage.removeItem("token");
    navigate("/doctorlogin");
  };

  const handleProfileClick = () => {
    setProfileOpen(false);
    navigate("/doctorprofile");
  };

  const doctorString = localStorage.getItem("doctor");
  const doctorUser = doctorString ? JSON.parse(doctorString) : { name: "Doctor" };
  const initials = doctorUser.name?.substring(0, 2).toUpperCase() || "DR";

  const chambersLinks = [
    { name: "All Chambers", path: "/allchambers", icon: Building2 },
    { name: "My Chambers", path: "/mychambers", icon: Home },
  ];

  const bookingsLinks = [
    { name: "My Bookings", path: "/doctorbookings", icon: Calendar },
    { name: "Chamber Bookings", path: "/chamberbookings", icon: Building2 },
  ];

  const walletLinks = [
    { name: "My Wallet", path: "/doctorwallet", icon: Wallet },
    { name: "Withdrawals", path: "/doctorwithdrawals", icon: Banknote },
  ];

  const paymentsLinks = [
    { name: "Chamber Payments", path: "/mychamberpayments", icon: CreditCard },
  ];

  const chambersActive = isParentActive(chambersLinks.map(l => l.path));
  const bookingsActive = isParentActive(bookingsLinks.map(l => l.path));
  const walletActive = isParentActive(walletLinks.map(l => l.path));
  const paymentsActive = isParentActive(paymentsLinks.map(l => l.path));

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 h-[72px] px-4 sm:px-6 transition-all duration-300 flex items-center ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-gray-100' : 'bg-white/90 backdrop-blur-sm border-b border-gray-100/50'
      }`}>
        <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
          {/* Logo */}
          <button onClick={() => navigate('/doctordashbaord')} className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-indigo-200/50 bg-white/10 flex items-center justify-center group-hover:scale-105 transition">
              <img src={logo} alt="Logo" className="w-full h-full object-contain p-1.5" />
            </div>
            <div className="hidden sm:block">
              <span className="text-sm font-bold tracking-tight text-slate-800">
                IRYAX SPACE
              </span>
              <span className="block text-[9px] font-medium text-indigo-600 tracking-widest uppercase">Doctor's Chamber</span>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {/* Dashboard */}
            <button
              onClick={() => navigate('/doctordashbaord')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                isActive('/doctordashbaord')
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <LayoutDashboard size={16} />
              <span>Dashboard</span>
            </button>

            {/* Chambers Dropdown */}
            <div className="relative" ref={chambersRef}>
              <button
                onClick={() => setChambersOpen(!chambersOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  chambersActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Building2 size={16} />
                <span>Chambers</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${chambersOpen ? 'rotate-180' : ''}`} />
              </button>

              {chambersOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                  {chambersLinks.map((link) => (
                    <button
                      key={link.path}
                      onClick={() => { navigate(link.path); setChambersOpen(false); }}
                      className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors ${
                        isActive(link.path)
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <link.icon size={16} className={isActive(link.path) ? 'text-indigo-500' : 'text-slate-400'} />
                      {link.name}
                      {isActive(link.path) && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Bookings Dropdown */}
            <div className="relative" ref={bookingsRef}>
              <button
                onClick={() => setBookingsOpen(!bookingsOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  bookingsActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Calendar size={16} />
                <span>Bookings</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${bookingsOpen ? 'rotate-180' : ''}`} />
              </button>

              {bookingsOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                  {bookingsLinks.map((link) => (
                    <button
                      key={link.path}
                      onClick={() => { navigate(link.path); setBookingsOpen(false); }}
                      className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors ${
                        isActive(link.path)
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <link.icon size={16} className={isActive(link.path) ? 'text-indigo-500' : 'text-slate-400'} />
                      {link.name}
                      {isActive(link.path) && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Payments Dropdown */}
            <div className="relative" ref={paymentsRef}>
              <button
                onClick={() => setPaymentsOpen(!paymentsOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  paymentsActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <CreditCard size={16} />
                <span>Payments</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${paymentsOpen ? 'rotate-180' : ''}`} />
              </button>

              {paymentsOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                  {paymentsLinks.map((link) => (
                    <button
                      key={link.path}
                      onClick={() => { navigate(link.path); setPaymentsOpen(false); }}
                      className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors ${
                        isActive(link.path)
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <link.icon size={16} className={isActive(link.path) ? 'text-indigo-500' : 'text-slate-400'} />
                      {link.name}
                      {isActive(link.path) && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Wallet Dropdown - Moved to Last */}
            <div className="relative" ref={walletRef}>
              <button
                onClick={() => setWalletOpen(!walletOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  walletActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Wallet size={16} />
                <span>Wallet</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${walletOpen ? 'rotate-180' : ''}`} />
              </button>

              {walletOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                  {walletLinks.map((link) => (
                    <button
                      key={link.path}
                      onClick={() => { navigate(link.path); setWalletOpen(false); }}
                      className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors ${
                        isActive(link.path)
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <link.icon size={16} className={isActive(link.path) ? 'text-indigo-500' : 'text-slate-400'} />
                      {link.name}
                      {isActive(link.path) && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Profile Dropdown - Simplified */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-full hover:bg-slate-100 transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
                  {initials}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold leading-tight text-slate-800">
                    {doctorUser.name || "Doctor"}
                  </p>
                  <p className="text-[9px] font-medium leading-tight text-slate-400">
                    Doctor
                  </p>
                </div>
                <ChevronDown size={14} className={`transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''} text-slate-400`} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
                    <p className="text-sm font-bold text-slate-800">{doctorUser.name || "Doctor"}</p>
                    <p className="text-[10px] text-slate-500">Doctor • {doctorUser.email || 'doctor@iriax.com'}</p>
                  </div>
                  <div className="p-1">
                    <button
                      onClick={handleProfileClick}
                      className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-slate-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      <User size={16} className="text-indigo-500" /> Profile
                    </button>
                    <div className="border-t border-gray-100 my-1" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <LogOut size={16} className="text-red-500" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              {mobileOpen ? (
                <X size={22} className="text-slate-800" />
              ) : (
                <Menu size={22} className="text-slate-800" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div className={`fixed inset-0 z-40 transition-all duration-300 ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
        <div className={`absolute top-0 right-0 bottom-0 w-72 bg-white shadow-2xl transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-5 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                {initials}
              </div>
              <div>
                <p className="font-bold text-slate-800">{doctorUser.name || "Doctor"}</p>
                <p className="text-[10px] text-slate-400">Doctor</p>
              </div>
            </div>
          </div>

          <div className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-120px)] pb-20">
            {/* Dashboard */}
            <button
              onClick={() => { navigate('/doctordashbaord'); setMobileOpen(false); }}
              className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive('/doctordashbaord')
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <LayoutDashboard size={18} className={isActive('/doctordashbaord') ? 'text-indigo-500' : 'text-slate-400'} />
              Dashboard
              {isActive('/doctordashbaord') && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500" />}
            </button>

            {/* Chambers Section */}
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 pt-3 pb-1">Chambers</p>
            {chambersLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => { navigate(link.path); setMobileOpen(false); }}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <link.icon size={18} className={isActive(link.path) ? 'text-indigo-500' : 'text-slate-400'} />
                {link.name}
                {isActive(link.path) && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500" />}
              </button>
            ))}

            {/* Bookings Section */}
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 pt-3 pb-1">Bookings</p>
            {bookingsLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => { navigate(link.path); setMobileOpen(false); }}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <link.icon size={18} className={isActive(link.path) ? 'text-indigo-500' : 'text-slate-400'} />
                {link.name}
                {isActive(link.path) && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500" />}
              </button>
            ))}

            {/* Payments Section */}
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 pt-3 pb-1">Payments</p>
            {paymentsLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => { navigate(link.path); setMobileOpen(false); }}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <link.icon size={18} className={isActive(link.path) ? 'text-indigo-500' : 'text-slate-400'} />
                {link.name}
                {isActive(link.path) && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500" />}
              </button>
            ))}

            {/* Wallet Section - Moved to Last */}
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 pt-3 pb-1">Wallet</p>
            {walletLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => { navigate(link.path); setMobileOpen(false); }}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <link.icon size={18} className={isActive(link.path) ? 'text-indigo-500' : 'text-slate-400'} />
                {link.name}
                {isActive(link.path) && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500" />}
              </button>
            ))}
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-white">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={18} className="text-red-500" /> Sign Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DoctorNavbar;