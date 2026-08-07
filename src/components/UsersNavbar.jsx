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
  BarChart3
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

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
  const isParentActive = (paths) => paths.some(p => location.pathname === p);

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

  // Close dropdown when clicking on a link that's already active
  const handleLinkClick = (sectionId, linkPath) => {
    // Check if the clicked link is already active
    if (isActive(linkPath)) {
      // Close the dropdown
      setSectionOpen((prev) => ({
        ...prev,
        [sectionId]: false,
      }));
    }
    // Close mobile drawer if open
    setOpen(false);
  };

  // Navigation Data
  const navSections = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/ownerdashboard",
      description: "Overview & stats",
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
      label: "Billings",
      icon: CreditCard,
      path: "/my-cabin-payments",
      description: "Registration payments",
    },
    {
      id: "revenue",
      label: "Revenue",
      icon: BarChart3,
      path: "/spacerevenue",
      description: "Track your earnings",
    },
    {
      id: "wallet",
      label: "Wallet",
      icon: Wallet,
      path: "/my-wallet",
      description: "Your earnings & balance",
    },
  ];

  const userString = localStorage.getItem("user");
  const currentUser = userString ? JSON.parse(userString) : { name: "User" };
  const initials = currentUser.name?.substring(0, 2).toUpperCase() || "US";

  // Check if section has links or a direct path
  const isSectionActive = (section) => {
    if (section.path) {
      return isActive(section.path);
    }
    if (section.links && Array.isArray(section.links)) {
      return section.links.some((link) => isActive(link.path));
    }
    return false;
  };

  // For parent active state for dropdowns
  const isParentSectionActive = (section) => {
    if (section.links && Array.isArray(section.links)) {
      return isParentActive(section.links.map(l => l.path));
    }
    return false;
  };

  return (
    <>
      {/* Desktop Navbar - MATCHING DOCTOR NAVBAR STYLE */}
      <nav
        className={`
          fixed top-0 left-0 right-0 z-[1100] 
          transition-all duration-300 ease-in-out
          h-[72px]
          ${scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-gray-100'
            : 'bg-white/90 backdrop-blur-sm border-b border-gray-100/50'
          }
        `}
      >
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 h-[72px] flex items-center justify-between">
          {/* Logo - MATCHING DOCTOR NAVBAR */}
          <button onClick={() => navigate('/ownerdashboard')} className="flex items-center gap-3 group no-underline">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-indigo-200/50 bg-white/10 flex items-center justify-center group-hover:scale-105 transition">
              <img src={logo} alt="Logo" className="w-full h-full object-contain p-1.5" />
            </div>
            <div className="hidden sm:block">
              <span className="text-sm font-bold tracking-tight text-slate-800">
                IRYAX SPACE
              </span>
              <span className="block text-[9px] font-medium text-indigo-600 tracking-widest uppercase">Workspace Portal</span>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <ul className="hidden md:flex items-center gap-1 list-none m-0 p-0">
            {navSections.map((section) => {
              const isSectionActiveNow = isSectionActive(section);
              const isParentActiveNow = isParentSectionActive(section);

              // For sections with direct path
              if (section.path) {
                return (
                  <li key={section.id} className="relative">
                    <Link
                      to={section.path}
                      className={`
                        flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium 
                        transition-all duration-150 no-underline
                        ${isSectionActiveNow
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                          : 'text-slate-700 hover:bg-slate-100'
                        }
                      `}
                    >
                      <section.icon size={16} />
                      <span>{section.label}</span>
                    </Link>
                  </li>
                );
              }

              // For sections with dropdown links
              return (
                <li key={section.id} className="relative">
                  <button
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium 
                      transition-all duration-150
                      ${isSectionActiveNow || isParentActiveNow
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                        : 'text-slate-700 hover:bg-slate-100'
                      }
                    `}
                    onClick={() => toggleSection(section.id)}
                    aria-expanded={sectionOpen[section.id]}
                  >
                    <section.icon size={16} />
                    <span>{section.label}</span>
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${sectionOpen[section.id] ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {sectionOpen[section.id] && section.links && (
                    <ul className="absolute top-full left-0 mt-1 min-w-[200px] bg-white rounded-xl shadow-xl border border-gray-100 p-1 z-50 animate-in slide-in-from-top-2 duration-200">
                      {section.links.map((link) => (
                        <li key={link.path}>
                          <Link
                            to={link.path}
                            onClick={() => handleLinkClick(section.id, link.path)}
                            className={`
                              flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium 
                              transition-all duration-150 relative no-underline
                              ${isActive(link.path)
                                ? 'bg-indigo-50 text-indigo-700'
                                : 'text-slate-600 hover:bg-slate-50'
                              }
                            `}
                            title={link.description}
                          >
                            <link.icon size={16} className={isActive(link.path) ? 'text-indigo-500' : 'text-slate-400'} />
                            <span>{link.name}</span>
                            {isActive(link.path) && (
                              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500" />
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

          {/* Right Section - MATCHING DOCTOR NAVBAR */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                className="flex items-center gap-2 px-2 py-1.5 rounded-full hover:bg-slate-100 transition-all border-none bg-transparent cursor-pointer font-inherit"
                onClick={() => setProfileOpen(!profileOpen)}
                aria-expanded={profileOpen}
                aria-haspopup="true"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 shadow-md">
                  {initials}
                </div>
                <div className="hidden sm:flex flex-col leading-tight text-left">
                  <span className="text-xs font-semibold text-slate-800">{currentUser.name || "User"}</span>
                  <span className="text-[9px] font-medium text-slate-400">Workspace Member</span>
                </div>
                <ChevronDown
                  size={14}
                  className={`text-slate-400 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {profileOpen && (
                <div className="absolute top-full right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
                    <p className="text-sm font-bold text-slate-800">{currentUser.name || "User"}</p>
                    <p className="text-[10px] text-slate-500">Workspace Member • {currentUser.email || 'user@iriax.com'}</p>
                  </div>
                  <div className="p-1">
                    {/* My Wallet */}
                    <button
                      className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-slate-600 hover:bg-emerald-50 rounded-lg transition-colors border-none bg-transparent cursor-pointer font-inherit"
                      onClick={() => {
                        setProfileOpen(false);
                        navigate("/my-wallet");
                      }}
                    >
                      <Wallet size={16} className="text-emerald-500" /> My Wallet
                    </button>

                    {/* My Profile */}
                    <button
                      className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-slate-600 hover:bg-indigo-50 rounded-lg transition-colors border-none bg-transparent cursor-pointer font-inherit"
                      onClick={() => {
                        setProfileOpen(false);
                        navigate("/myprofile");
                      }}
                    >
                      <User size={16} className="text-indigo-500" /> My Profile
                    </button>

                    {/* My Revenue */}
                    <button
                      className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-slate-600 hover:bg-cyan-50 rounded-lg transition-colors border-none bg-transparent cursor-pointer font-inherit"
                      onClick={() => {
                        setProfileOpen(false);
                        navigate("/spacerevenue");
                      }}
                    >
                      <BarChart3 size={16} className="text-cyan-500" /> My Revenue
                    </button>

                    <div className="border-t border-gray-100 my-1" />

                    {/* Logout */}
                    <button
                      className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors border-none bg-transparent cursor-pointer font-inherit"
                      onClick={handleLogout}
                    >
                      <LogOut size={16} className="text-red-500" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors border-none bg-transparent cursor-pointer"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? <X size={22} className="text-slate-800" /> : <Menu size={22} className="text-slate-800" />}
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
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />

        {/* Drawer */}
        <div className="absolute top-0 left-0 bottom-0 w-72 max-w-[85vw] bg-white shadow-2xl p-5 overflow-y-auto animate-in slide-in-from-left duration-300">
          {/* Drawer Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-indigo-200/50 bg-white/10 flex items-center justify-center">
                <img src={logo} alt="Logo" className="w-full h-full object-contain p-1.5" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-bold text-slate-800">IRYAX SPACE</span>
                <span className="text-[9px] font-bold uppercase tracking-[0.06em] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded w-fit">
                  User Portal
                </span>
              </div>
            </div>
            <button
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors border-none bg-transparent cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <X size={20} className="text-slate-500" />
            </button>
          </div>

          {/* User Card */}
          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl mb-5">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-lg font-bold flex items-center justify-center flex-shrink-0 shadow-md">
              {initials}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800 m-0">{currentUser.name || "User"}</p>
              <p className="text-[10px] text-slate-400 m-0">Workspace Member</p>
            </div>
          </div>

          {/* Mobile Navigation */}
          <p className="text-[10px] font-bold uppercase tracking-[0.06em] text-slate-400 px-1 pb-1.5 m-0">
            Navigation
          </p>
          <ul className="list-none m-0 p-0">
            {navSections.map((section) => {
              const isSectionActiveNow = isSectionActive(section);
              const isParentActiveNow = isParentSectionActive(section);

              // For sections with direct path
              if (section.path) {
                return (
                  <li key={section.id} className="mb-1">
                    <Link
                      to={section.path}
                      onClick={() => setOpen(false)}
                      className={`
                        flex items-center w-full gap-3 px-3 py-2.5 rounded-lg text-sm font-medium 
                        transition-all duration-150 no-underline
                        ${isSectionActiveNow
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'text-slate-600 hover:bg-slate-50'
                        }
                      `}
                    >
                      <span className={`flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0 ${
                        isSectionActiveNow ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'
                      }`}>
                        <section.icon size={16} />
                      </span>
                      <span className="flex-1 text-left">{section.label}</span>
                      {isSectionActiveNow && (
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
                      )}
                    </Link>
                  </li>
                );
              }

              // For sections with dropdown links
              return (
                <li key={section.id} className="mb-1">
                  <button
                    className={`
                      flex items-center w-full gap-3 px-3 py-2.5 rounded-lg text-sm font-medium 
                      transition-all duration-150 border-none bg-transparent cursor-pointer font-inherit
                      ${isSectionActiveNow || isParentActiveNow
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-slate-600 hover:bg-slate-50'
                      }
                    `}
                    onClick={() => toggleSection(section.id)}
                  >
                    <span className={`flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0 ${
                      isSectionActiveNow || isParentActiveNow ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'
                    }`}>
                      <section.icon size={16} />
                    </span>
                    <span className="flex-1 text-left">{section.label}</span>
                    <ChevronDown
                      size={12}
                      className={`transition-transform duration-200 ${sectionOpen[section.id] ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {sectionOpen[section.id] && section.links && (
                    <ul className="list-none m-0 p-0 pl-4">
                      {section.links.map((link) => (
                        <li key={link.path}>
                          <Link
                            to={link.path}
                            onClick={() => {
                              // Check if the clicked link is already active
                              if (isActive(link.path)) {
                                // Close the dropdown
                                setSectionOpen((prev) => ({
                                  ...prev,
                                  [section.id]: false,
                                }));
                              }
                              setOpen(false);
                            }}
                            className={`
                              flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium 
                              transition-all duration-150 relative no-underline
                              ${isActive(link.path)
                                ? 'bg-indigo-50 text-indigo-700'
                                : 'text-slate-600 hover:bg-slate-50'
                              }
                            `}
                          >
                            <span className={`flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0 ${
                              isActive(link.path) ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'
                            }`}>
                              <link.icon size={16} />
                            </span>
                            <div className="flex flex-col flex-1">
                              <span className="text-sm font-medium text-slate-900">{link.name}</span>
                              <span className="text-[10px] text-slate-400">{link.description}</span>
                            </div>
                            {isActive(link.path) && (
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
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
          <div className="pt-3 border-t border-gray-100 mt-2 flex flex-col gap-1">
            <button
              onClick={() => {
                setOpen(false);
                navigate("/myprofile");
              }}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-indigo-50 transition-colors border-none bg-transparent cursor-pointer font-inherit"
            >
              <User size={17} className="text-indigo-500" />
              <span>My Profile</span>
            </button>

            <button
              onClick={() => {
                setOpen(false);
                navigate("/my-wallet");
              }}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-emerald-50 transition-colors border-none bg-transparent cursor-pointer font-inherit"
            >
              <Wallet size={17} className="text-emerald-500" />
              <span>My Wallet</span>
            </button>

            <button
              onClick={() => {
                setOpen(false);
                navigate("/spacerevenue");
              }}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-cyan-50 transition-colors border-none bg-transparent cursor-pointer font-inherit"
            >
              <BarChart3 size={17} className="text-cyan-500" />
              <span>My Revenue</span>
            </button>

            <div className="border-t border-gray-100 my-1" />

            <button
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors border-none bg-transparent cursor-pointer font-inherit"
              onClick={handleLogout}
            >
              <LogOut size={17} className="text-red-500" />
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

        @keyframes slide-in-from-top-2 {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in-from-left {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
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

        .animate-in {
          animation: fadeIn 0.2s ease-out;
        }
        .slide-in-from-top-2 {
          animation: slide-in-from-top-2 0.2s ease-out;
        }
        .slide-in-from-left {
          animation: slide-in-from-left 0.3s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Scrollbar styling */
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