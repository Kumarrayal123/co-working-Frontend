import {
  LogOut,
  Menu,
  LayoutDashboard,
  Building2,
  Calendar,
  Home,
  Plus,
  X,
  ChevronDown,
  User,
  Wallet,
  CreditCard,
  Store,
  Banknote
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./AdminNavbar.css";

function UsersNavbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const profileRef = useRef(null);

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
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    navigate("/login");
  };

  const navLinks = [
    { name: "Dashboard", path: "/userdashboard", icon: LayoutDashboard, description: "Overview & stats" },
    { name: "All Spaces", path: "/spaces", icon: Building2, description: "Browse workspaces" },
    { name: "My Bookings", path: "/mybookings", icon: Calendar, description: "Your reservations" },
    { name: "My Cabins", path: "/mycabin", icon: Home, description: "Your spaces" },
    { name: "My Wallet", path: "/my-wallet", icon: Wallet, description: "Your earnings" },
  ];

  const userString = localStorage.getItem("user");
  const currentUser = userString ? JSON.parse(userString) : { name: "User" };
  const initials = currentUser.name?.substring(0, 2).toUpperCase() || "US";

  return (
    <>
      <nav className={`an-nav${scrolled ? " an-nav--scrolled" : ""}`}>
        <div className="an-nav__inner">

          {/* Logo */}
          <Link to="/userdashboard" className="an-nav__logo">
            <div className="an-nav__logo-icon">
              <span className="an-nav__logo-ig">I</span>
            </div>
            <div className="an-nav__logo-text">
              <span className="an-nav__logo-title">IRYAX</span>
              <span className="an-nav__logo-badge">User Portal</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <ul className="an-nav__links">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`an-nav__link${isActive(link.path) ? " an-nav__link--active" : ""}`}
                  title={link.description}
                >
                  <link.icon size={15} />
                  <span>{link.name}</span>
                  {isActive(link.path) && <span className="an-nav__link-dot" />}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right: Profile + Logout */}
          <div className="an-nav__right">

            {/* Divider */}
            <span className="an-nav__divider" />

            {/* Profile Dropdown */}
            <div className="an-nav__dropdown-wrap" ref={profileRef}>
              <button
                className="an-nav__profile-btn"
                onClick={() => setProfileOpen(!profileOpen)}
                aria-expanded={profileOpen}
                aria-haspopup="true"
              >
                <div className="an-nav__avatar">{initials}</div>
                <div className="an-nav__profile-info">
                  <span className="an-nav__profile-name">{currentUser.name || "User"}</span>
                  <span className="an-nav__profile-role">Workspace Member</span>
                </div>
                <ChevronDown
                  size={14}
                  className={`an-nav__profile-chevron${profileOpen ? " an-nav__profile-chevron--open" : ""}`}
                />
              </button>

              {profileOpen && (
                <div className="an-nav__profile-dropdown">
                  {/* Profile header */}
                  <div className="an-nav__profile-header">
                    <div className="an-nav__avatar an-nav__avatar--lg">{initials}</div>
                    <div>
                      <p className="an-nav__dd-name">{currentUser.name || "User"}</p>
                      <p className="an-nav__dd-role">Workspace Member</p>
                    </div>
                  </div>
                  <div className="an-nav__dd-divider" />
                  
                  {/* My Wallet */}
                  <button 
                    className="an-nav__dd-item" 
                    onClick={() => { 
                      setProfileOpen(false); 
                      navigate("/my-wallet"); 
                    }}
                  >
                    <Wallet size={15} /> My Wallet
                  </button>
                  
                  {/* My Profile */}
                  <button 
                    className="an-nav__dd-item" 
                    onClick={() => { 
                      setProfileOpen(false); 
                      navigate("/myprofile"); 
                    }}
                  >
                    <User size={15} /> My Profile
                  </button>
                  
                  <div className="an-nav__dd-divider" />
                  
                  {/* Logout */}
                  <button className="an-nav__dd-logout" onClick={handleLogout}>
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              className="an-nav__hamburger"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div className={`an-mobile${open ? " an-mobile--open" : ""}`}>
        <div className="an-mobile__backdrop" onClick={() => setOpen(false)} />

        <div className="an-mobile__drawer">
          {/* Drawer Header */}
          <div className="an-mobile__head">
            <div className="an-mobile__logo">
              <div className="an-nav__logo-icon">
                <span className="an-nav__logo-ig">I</span>
              </div>
              <div className="an-nav__logo-text">
                <span className="an-nav__logo-title">IRYAX</span>
                <span className="an-nav__logo-badge">User Portal</span>
              </div>
            </div>
            <button className="an-mobile__close" onClick={() => setOpen(false)}>
              <X size={20} />
            </button>
          </div>

          {/* User Card */}
          <div className="an-mobile__admin-card">
            <div className="an-nav__avatar an-nav__avatar--lg">{initials}</div>
            <div>
              <p className="an-mobile__admin-name">{currentUser.name || "User"}</p>
              <p className="an-mobile__admin-role">Workspace Member</p>
            </div>
          </div>

          {/* Nav Links */}
          <p className="an-mobile__section-label">Navigation</p>
          <ul className="an-mobile__links">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  onClick={() => setOpen(false)}
                  className={`an-mobile__link${isActive(link.path) ? " an-mobile__link--active" : ""}`}
                >
                  <span className="an-mobile__link-icon">
                    <link.icon size={18} />
                  </span>
                  <div className="an-mobile__link-body">
                    <span className="an-mobile__link-name">{link.name}</span>
                    <span className="an-mobile__link-desc">{link.description}</span>
                  </div>
                  {isActive(link.path) && <span className="an-mobile__link-active-dot" />}
                </Link>
              </li>
            ))}
          </ul>

          {/* Footer controls */}
          <div className="an-mobile__footer">
            {/* My Wallet - Mobile */}
            <button
              onClick={() => { setOpen(false); navigate("/my-wallet"); }}
              className="an-mobile__footer-btn"
            >
              <Wallet size={17} />
              <span>My Wallet</span>
            </button>

            {/* My Profile - Mobile */}
            <button
              onClick={() => { setOpen(false); navigate("/myprofile"); }}
              className="an-mobile__footer-btn"
            >
              <User size={17} />
              <span>My Profile</span>
            </button>

            {/* Logout - Mobile */}
            <button className="an-mobile__logout" onClick={handleLogout}>
              <LogOut size={17} />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default UsersNavbar;