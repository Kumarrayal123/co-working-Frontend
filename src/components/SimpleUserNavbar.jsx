import {
  LogOut,
  Menu,
  LayoutDashboard,
  Building2,
  Calendar,
  X,
  ChevronDown,
  User,
  Wallet,
  Grid,
  BookOpen
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function SimpleUserNavbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const profileRef = useRef(null);

  // Effects
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
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setProfileOpen(false);
        setOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Helpers
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    navigate("/login");
  };

  // Navigation Data - Simplified for User
  const navLinks = [
    { name: "Dashboard", path: "/userdashboard", icon: LayoutDashboard },
    { name: "Spaces", path: "/spaceforusers", icon: Building2 },
    { name: "My Bookings", path: "/userbooking", icon: Calendar },
  ];

  const userString = localStorage.getItem("user");
  const currentUser = userString ? JSON.parse(userString) : { name: "User" };
  const initials = currentUser.name?.substring(0, 2).toUpperCase() || "US";

  return (
    <>
      {/* Desktop Navbar */}
      <nav
        className={`
          fixed top-0 left-0 right-0 z-[1100] 
          transition-all duration-300 ease-in-out
          h-16
          ${scrolled 
            ? 'bg-white/95 shadow-[0_1px_12px_rgba(0,0,0,0.06)]' 
            : 'bg-white/85 backdrop-blur-[12px] border-b border-slate-200/60'
          }
        `}
      >
        <div className="max-w-[1400px] mx-auto px-5 h-16 flex items-center justify-between gap-3">
          {/* Logo */}
          <Link to="/userdashboard" className="flex items-center gap-2.5 no-underline flex-shrink-0">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-extrabold text-sm tracking-tight">I</span>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-base font-bold text-slate-900 tracking-tight">IRYAX SPACE</span>
              <span className="text-[9px] font-bold uppercase tracking-[0.06em] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded w-fit">
                User Portal
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links - Simple */}
          <ul className="hidden md:flex items-center gap-1 flex-1 justify-center list-none m-0 p-0">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`
                    flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium 
                    transition-all duration-150
                    ${isActive(link.path)
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                    }
                  `}
                >
                  <link.icon size={16} />
                  <span>{link.name}</span>
                  {isActive(link.path) && (
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right Section */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Quick Action Buttons */}
            <button
              onClick={() => navigate("/spaceforusers")}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-all duration-200 hover:shadow-md hover:scale-[1.02]"
            >
              <Building2 size={14} />
              <span>Find Space</span>
            </button>

            <span className="hidden md:block w-px h-7 bg-slate-200" />

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-lg border-none bg-transparent cursor-pointer transition-all duration-150 hover:bg-slate-100 font-inherit"
                onClick={() => setProfileOpen(!profileOpen)}
                aria-expanded={profileOpen}
                aria-haspopup="true"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {initials}
                </div>
                <div className="hidden sm:flex flex-col leading-tight text-left">
                  <span className="text-xs font-semibold text-slate-900">{currentUser.name || "User"}</span>
                  <span className="text-[10px] font-medium text-slate-400">Member</span>
                </div>
                <ChevronDown
                  size={14}
                  className={`text-slate-400 transition-transform duration-200 ${
                    profileOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {profileOpen && (
                <div className="absolute top-full right-0 mt-1.5 min-w-[200px] bg-white rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.04)] p-1 z-50 animate-[dropdownIn_0.15s_ease]">
                  {/* Profile Header */}
                  <div className="flex items-center gap-3 px-3 py-2.5">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                      {initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 m-0">{currentUser.name || "User"}</p>
                      <p className="text-[11px] text-slate-400 m-0">Workspace Member</p>
                    </div>
                  </div>
                  <div className="h-px bg-slate-100 mx-2 my-1" />

                  {/* My Wallet */}
                  <button
                    className="flex items-center gap-2.5 w-full px-3 py-1.75 border-none bg-transparent rounded-lg text-xs font-medium text-slate-600 cursor-pointer transition-all duration-150 hover:bg-slate-100 hover:text-slate-900 font-inherit"
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/my-wallet");
                    }}
                  >
                    <Wallet size={15} className="text-slate-400" /> My Wallet
                  </button>

                  {/* My Profile */}
                  <button
                    className="flex items-center gap-2.5 w-full px-3 py-1.75 border-none bg-transparent rounded-lg text-xs font-medium text-slate-600 cursor-pointer transition-all duration-150 hover:bg-slate-100 hover:text-slate-900 font-inherit"
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/userprofile");
                    }}
                  >
                    <User size={15} className="text-slate-400" /> My Profile
                  </button>

                  <div className="h-px bg-slate-100 mx-2 my-1" />

                  {/* Logout */}
                  <button
                    className="flex items-center gap-2.5 w-full px-3 py-1.75 border-none bg-transparent rounded-lg text-xs font-medium text-red-500 cursor-pointer transition-all duration-150 hover:bg-red-50 font-inherit"
                    onClick={handleLogout}
                  >
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              className="md:hidden bg-none border-none p-1 cursor-pointer text-slate-600 rounded-md hover:bg-slate-100"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div
        className={`
          fixed inset-0 z-[1200] 
          ${open ? 'block' : 'hidden'}
        `}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />

        {/* Drawer */}
        <div className="absolute top-0 left-0 bottom-0 w-[300px] max-w-[85vw] bg-white p-5 overflow-y-auto animate-[mobileIn_0.25s_ease]">
          {/* Drawer Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-extrabold text-sm tracking-tight">I</span>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-base font-bold text-slate-900">IRYAX</span>
                <span className="text-[9px] font-bold uppercase tracking-[0.06em] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded w-fit">
                  User Portal
                </span>
              </div>
            </div>
            <button
              className="bg-none border-none p-1 cursor-pointer text-slate-500 rounded-md hover:bg-slate-100"
              onClick={() => setOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          {/* User Card */}
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl mb-5">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
              {initials}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 m-0">{currentUser.name || "User"}</p>
              <p className="text-[11px] text-slate-400 m-0">Workspace Member</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2 mb-5">
            <button
              onClick={() => { setOpen(false); navigate("/spaceforusers"); }}
              className="flex flex-col items-center gap-1 p-3 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors"
            >
              <Building2 size={18} className="text-indigo-600" />
              <span className="text-[10px] font-semibold text-indigo-600">Find Space</span>
            </button>
            <button
              onClick={() => { setOpen(false); navigate("/userbooking"); }}
              className="flex flex-col items-center gap-1 p-3 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors"
            >
              <Calendar size={18} className="text-emerald-600" />
              <span className="text-[10px] font-semibold text-emerald-600">My Bookings</span>
            </button>
          </div>

          {/* Mobile Navigation - Simple */}
          <p className="text-[10px] font-bold uppercase tracking-[0.06em] text-slate-400 px-1 pb-1.5 m-0">
            Navigation
          </p>
          <ul className="list-none m-0 p-0">
            {navLinks.map((link) => (
              <li key={link.path} className="mb-1">
                <Link
                  to={link.path}
                  onClick={() => setOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium 
                    transition-all duration-150
                    ${isActive(link.path)
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-slate-600 hover:bg-slate-100'
                    }
                  `}
                >
                  <span className={`
                    flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0
                    ${isActive(link.path)
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'bg-slate-100 text-slate-500'
                    }
                  `}>
                    <link.icon size={16} />
                  </span>
                  <span className="flex-1">{link.name}</span>
                  {isActive(link.path) && (
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 flex-shrink-0" />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* Footer */}
          <div className="pt-3 border-t border-slate-100 mt-3 flex flex-col gap-1">
            <button
              onClick={() => {
                setOpen(false);
                navigate("/userprofile");
              }}
              className="flex items-center gap-2.5 w-full px-3 py-2.5 border-none bg-transparent rounded-lg text-sm font-medium text-slate-600 cursor-pointer transition-all duration-150 hover:bg-slate-100 hover:text-slate-900 font-inherit"
            >
              <User size={17} className="text-slate-400" />
              <span>My Profile</span>
            </button>

            <button
              onClick={() => {
                setOpen(false);
                navigate("/my-wallet");
              }}
              className="flex items-center gap-2.5 w-full px-3 py-2.5 border-none bg-transparent rounded-lg text-sm font-medium text-slate-600 cursor-pointer transition-all duration-150 hover:bg-slate-100 hover:text-slate-900 font-inherit"
            >
              <Wallet size={17} className="text-slate-400" />
              <span>My Wallet</span>
            </button>

            <button
              className="flex items-center gap-2.5 w-full px-3 py-2.5 border-none bg-transparent rounded-lg text-sm font-medium text-red-500 cursor-pointer transition-all duration-150 hover:bg-red-50 font-inherit"
              onClick={handleLogout}
            >
              <LogOut size={17} />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Global Animations */}
      <style>{`
        @keyframes dropdownIn {
          from {
            opacity: 0;
            transform: translateY(-8px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes mobileIn {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        button:focus-visible,
        a:focus-visible {
          outline: 2px solid #4f46e5;
          outline-offset: 2px;
        }
      `}</style>
    </>
  );
}

export default SimpleUserNavbar;