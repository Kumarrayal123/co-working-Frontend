import React, { useState, useEffect } from "react";
import { Menu, X, LayoutDashboard, Users, PlusSquare, Home, LogOut, Shield,CalendarCheck ,Building2} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

function AdminNavbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  // Clear admin session
  const handleLogout = () => {
    localStorage.removeItem("admin");
    window.location.href = "/";
  };

  const navLinks = [
    { name: "Home", path: "/spaces", icon: Home },
    { name: "Users", path: "/allusers", icon: Users },
    { name: "Add Cabin", path: "/adminaddcabin", icon: PlusSquare },
    { name: "Bookings", path: "/allbookings", icon: CalendarCheck },
    { name: "My Bookings", path: "/adminbookings", icon: CalendarCheck },
    { name: "My Cabin", path: "/admincabin", icon: Building2 },
    

    
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled
        ? "bg-slate-900/95 backdrop-blur-md shadow-lg border-b border-slate-700 py-3"
        : "bg-slate-900 py-4"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/admindashboard" className="flex items-center gap-2 group">
            <div className="bg-indigo-500/10 p-1.5 rounded-lg border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-colors">
              <Shield size={24} className="text-indigo-500" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">Admin<span className="text-indigo-500">Portal</span></span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive(link.path)
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                    : "text-slate-300 hover:text-white hover:bg-slate-800"
                    }`}
                >
                  <link.icon size={16} />
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="w-px h-6 bg-slate-700"></div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-medium text-red-400 hover:text-red-300 transition-colors px-3 py-2 rounded-lg hover:bg-red-500/10"
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-slate-900/95 backdrop-blur-sm transition-transform duration-300 md:hidden pt-24 ${open ? "translate-x-0" : "translate-x-full"
          }`}
        style={{ top: "0" }}
      >
        <button
          onClick={() => setOpen(false)}
          className="absolute top-6 right-6 p-2 bg-slate-800 rounded-full text-slate-400"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col space-y-4 px-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-4 text-lg font-medium p-3 rounded-xl ${isActive(link.path)
                ? "bg-indigo-600 text-white"
                : "text-slate-300 hover:bg-slate-800"
                }`}
            >
              <link.icon size={20} />
              {link.name}
            </Link>
          ))}

          <div className="h-px bg-slate-800 my-4"></div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-4 text-lg font-medium text-red-400 p-3 hover:bg-slate-800 rounded-xl"
          >
            <LogOut size={20} /> Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
}

export default AdminNavbar;