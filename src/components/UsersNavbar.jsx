import {
  LogOut,
  Menu,
  LayoutDashboard,
  Building2,
  Calendar,
  Home,
  X,
  ChevronDown,
  User,
  Wallet,
  CreditCard,
  Grid,
  BookOpen,
  FileText,
  Receipt,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function UsersNavbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [sectionOpen, setSectionOpen] = useState({});
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

  const toggleSection = (section) => {
    setSectionOpen((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Navigation Data
  const navSections = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      links: [{ name: "Dashboard", path: "/ownerdashboard", icon: LayoutDashboard, description: "Overview & stats" }],
    },
    {
      id: "coworking",
      label: "Co-Working",
      icon: Building2,
      links: [
        { name: "All Spaces", path: "/spaces", icon: Grid, description: "Browse workspaces" },
        { name: "My Spaces", path: "/mycabin", icon: Home, description: "Your registered spaces" },
      ],
    },
    {
      id: "bookings",
      label: "Bookings",
      icon: Calendar,
      links: [
        { name: "My Bookings", path: "/mybookings", icon: BookOpen, description: "Your reservations" },
        { name: "My Space Bookings", path: "/cabin-bookings", icon: FileText, description: "Your space bookings" },
      ],
    },
    {
      id: "payments",
      label: "Payments",
      icon: CreditCard,
      links: [{ name: "My Reg. Payments", path: "/my-cabin-payments", icon: Receipt, description: "Registration payments" }],
    },
    {
      id: "wallet",
      label: "Wallet",
      icon: Wallet,
      links: [{ name: "My Wallet", path: "/my-wallet", icon: Wallet, description: "Your earnings & balance" }],
    },
  ];

  const userString = localStorage.getItem("user");
  const currentUser = userString ? JSON.parse(userString) : { name: "User" };
  const initials = currentUser.name?.substring(0, 2).toUpperCase() || "US";

  const isSectionActive = (section) => {
    return section.links.some((link) => isActive(link.path));
  };

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
          <Link to="/ownerdashboard" className="flex items-center gap-2.5 no-underline flex-shrink-0">
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

          {/* Desktop Nav Links */}
          <ul className="hidden md:flex items-center gap-0.5 flex-1 justify-center list-none m-0 p-0">
            {navSections.map((section) => {
              const isSectionActiveNow = isSectionActive(section);
              return (
                <li key={section.id} className="relative">
                  <button
                    className={`
                      flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium 
                      transition-all duration-150
                      ${isSectionActiveNow 
                        ? 'text-indigo-600 bg-indigo-50' 
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                      }
                    `}
                    onClick={() => toggleSection(section.id)}
                    aria-expanded={sectionOpen[section.id]}
                  >
                    <section.icon size={15} />
                    <span>{section.label}</span>
                    <ChevronDown
                      size={12}
                      className={`transition-transform duration-200 ${
                        sectionOpen[section.id] ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {sectionOpen[section.id] && (
                    <ul className="absolute top-full left-0 mt-1.5 min-w-[180px] bg-white rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.04)] p-1 z-50 animate-[dropdownIn_0.15s_ease]">
                      {section.links.map((link) => (
                        <li key={link.path}>
                          <Link
                            to={link.path}
                            className={`
                              flex items-center gap-2.5 px-3 py-1.75 rounded-lg text-xs font-medium 
                              transition-all duration-150 relative
                              ${isActive(link.path)
                                ? 'text-indigo-600 bg-indigo-50'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                              }
                            `}
                            title={link.description}
                          >
                            <link.icon size={13} />
                            <span>{link.name}</span>
                            {isActive(link.path) && (
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 absolute bottom-1 left-1/2 -translate-x-1/2 animate-[pulseDot_2s_ease-in-out_infinite]" />
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Right Section */}
          <div className="flex items-center gap-3 flex-shrink-0">
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
                  <span className="text-[10px] font-medium text-slate-400">Workspace Member</span>
                </div>
                <ChevronDown
                  size={14}
                  className={`text-slate-400 transition-transform duration-200 ${
                    profileOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {profileOpen && (
                <div className="absolute top-full right-0 mt-1.5 min-w-[220px] bg-white rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.04)] p-1 z-50 animate-[dropdownIn_0.15s_ease]">
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
                      navigate("/myprofile");
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

          {/* Mobile Navigation */}
          <p className="text-[10px] font-bold uppercase tracking-[0.06em] text-slate-400 px-1 pb-1.5 m-0">
            Navigation
          </p>
          <ul className="list-none m-0 p-0">
            {navSections.map((section) => {
              const isSectionActiveNow = isSectionActive(section);
              return (
                <li key={section.id} className="mb-4">
                  <button
                    className={`
                      flex items-center w-full gap-2 px-3 py-2 rounded-lg text-sm font-medium 
                      transition-all duration-150 border-none bg-transparent cursor-pointer font-inherit
                      ${isSectionActiveNow
                        ? 'text-indigo-600 bg-indigo-50'
                        : 'text-slate-600 hover:bg-slate-100'
                      }
                    `}
                    onClick={() => toggleSection(section.id)}
                  >
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex-shrink-0">
                      <section.icon size={16} />
                    </span>
                    <span className="flex-1 text-left">{section.label}</span>
                    <ChevronDown
                      size={12}
                      className={`transition-transform duration-200 ${
                        sectionOpen[section.id] ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {sectionOpen[section.id] && (
                    <ul className="list-none m-0 p-0">
                      {section.links.map((link) => (
                        <li key={link.path}>
                          <Link
                            to={link.path}
                            onClick={() => setOpen(false)}
                            className={`
                              flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium 
                              transition-all duration-150 relative
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
                            <div className="flex flex-col flex-1">
                              <span className="text-sm font-medium text-slate-900">{link.name}</span>
                              <span className="text-[11px] text-slate-400">{link.description}</span>
                            </div>
                            {isActive(link.path) && (
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 flex-shrink-0" />
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Footer */}
          <div className="pt-3 border-t border-slate-100 mt-2 flex flex-col gap-1">
            <button
              onClick={() => {
                setOpen(false);
                navigate("/myprofile");
              }}
              className="flex items-center gap-2.5 w-full px-3 py-2.5 border-none bg-transparent rounded-lg text-sm font-medium text-slate-600 cursor-pointer transition-all duration-150 hover:bg-slate-100 hover:text-slate-900 font-inherit"
            >
              <User size={17} className="text-slate-400" />
              <span>My Profile</span>
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

      {/* Global Animations - Add to your global CSS or index.css */}
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

        @keyframes pulseDot {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(0.8);
          }
        }

        /* Scrollbar styling for mobile drawer */
        .an-mobile-drawer::-webkit-scrollbar {
          width: 4px;
        }
        .an-mobile-drawer::-webkit-scrollbar-track {
          background: transparent;
        }
        .an-mobile-drawer::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 4px;
        }
        .an-mobile-drawer::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }

        /* Focus styles */
        button:focus-visible,
        a:focus-visible {
          outline: 2px solid #4f46e5;
          outline-offset: 2px;
        }
      `}</style>
    </>
  );
}

export default UsersNavbar;