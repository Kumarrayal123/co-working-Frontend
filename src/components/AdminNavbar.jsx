import {
  CalendarCheck,
  Home,
  LogOut,
  Menu,
  PlusSquare,
  Shield,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.png";

function AdminNavbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  // Clear admin session
  const handleLogout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navLinks = [
    { name: "Dashboard", path: "/admindashboard" },
    // { name: "Users", path: "/allusers" },
    { name: "Spaces", path: "/spaces" },
    // { name: "Add Cabin", path: "/adminaddcabin" },
    { name: "Bookings", path: "/mybookings" },
    { name: 'My Cabins', path: '/admincabin' }
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled
        ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200 py-3"
        : "bg-transparent py-4"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/admindashboard" className="flex items-center gap-2">
            <img src={Logo} alt="TimelyHealth" className="h-12 w-auto object-contain" />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex gap-1.5">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${isActive(link.path)
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                    : "text-slate-500 hover:text-emerald-700 hover:bg-emerald-50"
                    }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="w-px h-6 bg-slate-200"></div>

            {/* PROFILE / LOGOUT */}
            <div className="relative group">
              <div className="w-10 h-10 rounded-full border-2 border-slate-100 bg-white flex items-center justify-center cursor-pointer transition-colors group-hover:border-emerald-200">
                <Shield size={20} className="text-slate-600 group-hover:text-emerald-600" />
              </div>

              <div className="
                absolute right-0 mt-4 w-48
                bg-white border border-slate-100 rounded-2xl shadow-xl
                opacity-0 invisible group-hover:opacity-100 group-hover:visible
                transition-all duration-200 transform origin-top-right z-50
              ">
                <div className="p-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <LogOut size={16} />
                    Log Out
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-slate-600 hover:text-emerald-600 transition"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-white/95 backdrop-blur-xl transition-transform duration-300 md:hidden pt-28 ${open ? "translate-x-0" : "translate-x-full"
          }`}
        style={{ top: "0" }}
      >
        <button
          onClick={() => setOpen(false)}
          className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
        >
          <X size={20} />
        </button>

        <div className="flex justify-center mb-8">
          <img src={Logo} alt="TimelyHealth" className="h-16 w-auto object-contain" />
        </div>

        <div className="flex flex-col px-8 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setOpen(false)}
              className={`p-4 rounded-2xl text-lg font-semibold transition ${isActive(link.path)
                ? "bg-emerald-600 text-white shadow-xl shadow-emerald-600/20"
                : "text-slate-600 hover:bg-slate-50"
                }`}
            >
              {link.name}
            </Link>
          ))}

          <div className="h-px my-4 bg-slate-100"></div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-4 p-4 text-lg font-semibold text-red-500 hover:bg-red-50 rounded-2xl transition-colors"
          >
            <LogOut size={20} /> Log Out
          </button>
        </div>
      </div>
    </nav>
  );
}

export default AdminNavbar;
