// import React, { useState } from "react";
// import { Menu, X } from "lucide-react";
// import { Link } from "react-router-dom";


// function UsersNavbar() {
//   const [open, setOpen] = useState(false);

//   return (
//     <nav className="user-navbar">
//       <div className="user-navbar-inner">

//         {/* LOGO */}
//        <img style={{width:'150px'}} src="/src/assets/logo.png" alt="Logo" className="user-logo-img" />


//         {/* Desktop Menu */}
//         <div className="user-menu">
//           <Link to="/">Home</Link>
//           <Link to="/spaces">Spaces</Link>
//           <Link to="/bookings">My Bookings</Link>
//           <Link to="/profile">Profile</Link>
//         </div>

//         {/* Hamburger */}
//         <button className="hamburger" onClick={() => setOpen(!open)}>
//           {open ? <X size={26} /> : <Menu size={26} />}
//         </button>
//       </div>

//       {/* Mobile Menu */}
//       {open && (
//         <div className="mobile-menu">
//           <Link onClick={() => setOpen(false)} to="/">Home</Link>
//           <Link onClick={() => setOpen(false)} to="/spaces">Spaces</Link>

//           <Link onClick={() => setOpen(false)} to="/profile">Profile</Link>
//         </div>
//       )}
//     </nav>
//   );
// }

// export default UsersNavbar;





import React, { useState, useEffect } from "react";
import { Menu, X, ChevronDown, User, LogOut, Building, Calendar } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

function UsersNavbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: "Register", path: "/register" },
    { name: "Login",path:"/login"},
    { name: "Spaces", path: "/spaces" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled
        ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 py-3"
        : "bg-transparent py-5"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
              <div className="relative bg-white rounded-lg p-1">
                {/* Use existing logo asset or text fallback if image fails handling needs more logic, sticking to image for now but styling it */}
                <img
                  src="/src/assets/logo.png"
                  alt="Logo"
                  className="h-8 w-auto object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <span style={{ display: 'none' }} className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Cowork</span>
              </div>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors duration-200 ${isActive(link.path)
                    ? "text-emerald-600"
                    : "text-gray-600 hover:text-emerald-600"
                    }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="w-px h-6 bg-gray-200"></div>

            {/* Profile Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-2 py-2 px-3 rounded-full hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <User size={16} />
                </div>
                <span>Account</span>
                <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-600 transition-transform group-hover:rotate-180" />
              </button>

              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right focus-within:opacity-100 focus-within:visible">
                <div className="p-2 space-y-1">
                  <Link to="/profile" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50 hover:text-emerald-600 transition-colors">
                    <User size={16} /> My Profile
                  </Link>
                  <Link to="/mybookings" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50 hover:text-emerald-600 transition-colors">
                    <Calendar size={16} /> My Bookings
                  </Link>
                  <Link to="/addcabin" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50 hover:text-emerald-600 transition-colors">
                    <Building size={16} /> AddCabin
                  </Link>
                  <Link to="/mycabin" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50 hover:text-emerald-600 transition-colors">
                    <Building size={16} /> My Cabin
                  </Link>
                  <div className="h-px bg-gray-100 my-1"></div>
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50 transition-colors text-left">
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-emerald-600 transition-colors"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-white/95 backdrop-blur-sm transition-transform duration-300 md:hidden ${open ? "translate-x-0" : "translate-x-full"
          }`}
        style={{ top: "0" }}
      >
        <div className="flex flex-col h-full pt-24 px-6 pb-6 overflow-y-auto">
          {/* Close button inside overlay for better UX */}
          <button
            onClick={() => setOpen(false)}
            className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full text-gray-600"
          >
            <X size={20} />
          </button>

          <div className="flex flex-col space-y-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setOpen(false)}
                className={`text-lg font-medium ${isActive(link.path) ? "text-emerald-600" : "text-gray-800"
                  }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="h-px bg-gray-100 my-2"></div>

            <div className="space-y-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Account</p>
              <Link to="/profile" onClick={() => setOpen(false)} className="flex items-center gap-3 text-gray-600">
                <User size={20} /> My Profile
              </Link>
              <Link to="/mybookings" onClick={() => setOpen(false)} className="flex items-center gap-3 text-gray-600">
                <Calendar size={20} /> My Bookings
              </Link>
              <Link to="/addcabin" onClick={() => setOpen(false)} className="flex items-center gap-3 text-gray-600">
                <Building size={20} /> AddCabin
              </Link>
              <Link to="/mycabin" onClick={() => setOpen(false)} className="flex items-center gap-3 text-gray-600">
                <Building size={20} /> My Cabin
              </Link>
              <Link to="/invoices" onClick={() => setOpen(false)} className="flex items-center gap-3 text-gray-600">
                <Building size={20} /> Invoices
              </Link>
              <button className="flex items-center gap-3 text-red-600 pt-4">
                <LogOut size={20} /> Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default UsersNavbar;
