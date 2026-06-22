import {
  LogOut,
  Menu,
  LayoutDashboard,
  Building2,
  Calendar,
  Home,
  X,
  ChevronDown,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./AdminNavbar.css";

function AdminNavbar() {
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

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on Escape key
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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navLinks = [
    { name: "Dashboard", path: "/admindashboard", icon: LayoutDashboard, description: "Overview & analytics" },
    { name: "Spaces",    path: "/spaces",          icon: Building2,       description: "Manage workspaces"   },
    { name: "Bookings",  path: "/mybookings",       icon: Calendar,        description: "View reservations"   },
    { name: "My Cabins", path: "/admincabin",       icon: Home,            description: "Your spaces"         },
  ];

  const adminString = localStorage.getItem("admin");
  const adminUser   = adminString ? JSON.parse(adminString) : { name: "Admin" };
  const initials    = adminUser.name?.substring(0, 2).toUpperCase() || "AD";

  return (
    <>
      <nav className={`an-nav${scrolled ? " an-nav--scrolled" : ""}`}>
        <div className="an-nav__inner">

          {/* ── Logo ── */}
          <Link to="/admindashboard" className="an-nav__logo">
            <div className="an-nav__logo-icon">
              <span className="an-nav__logo-ig">IG</span>
            </div>
            <div className="an-nav__logo-text">
              <span className="an-nav__logo-title">Ingrain workspace</span>
              <span className="an-nav__logo-badge">Admin Portal</span>
            </div>
          </Link>

          {/* ── Desktop Nav Links ── */}
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

          {/* ── Right: Profile + Logout ── */}
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
                  <span className="an-nav__profile-name">{adminUser.name || "Admin"}</span>
                  <span className="an-nav__profile-role">Administrator</span>
                </div>
                <ChevronDown
                  size={14}
                  className={`an-nav__chevron${profileOpen ? " an-nav__chevron--open" : ""}`}
                />
              </button>

              {profileOpen && (
                <div className="an-nav__dropdown an-nav__dropdown--profile">
                  {/* Profile header */}
                  <div className="an-nav__dropdown-head--profile">
                    <div className="an-nav__avatar an-nav__avatar--lg">{initials}</div>
                    <div>
                      <p className="an-nav__dd-name">{adminUser.name || "Admin"}</p>
                      <p className="an-nav__dd-role">Administrator</p>
                    </div>
                  </div>
                  <div className="an-nav__dd-sep" />
                  {/* Logout only */}
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

      {/* ── Mobile Drawer ── */}
      <div className={`an-mobile${open ? " an-mobile--open" : ""}`}>
        {/* Backdrop */}
        <div className="an-mobile__backdrop" onClick={() => setOpen(false)} />

        {/* Drawer */}
        <div className="an-mobile__drawer">

          {/* Drawer Header */}
          <div className="an-mobile__head">
            <div className="an-mobile__logo">
              <div className="an-nav__logo-icon">
                <span className="an-nav__logo-ig">IG</span>
              </div>
              <div className="an-nav__logo-text">
                <span className="an-nav__logo-title">Ingrain workspace</span>
                <span className="an-nav__logo-badge">Admin Portal</span>
              </div>
            </div>
            <button className="an-mobile__close" onClick={() => setOpen(false)}>
              <X size={20} />
            </button>
          </div>

          {/* Admin Card */}
          <div className="an-mobile__admin-card">
            <div className="an-nav__avatar an-nav__avatar--lg">{initials}</div>
            <div>
              <p className="an-mobile__admin-name">{adminUser.name || "Admin"}</p>
              <p className="an-mobile__admin-role">Administrator</p>
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

          {/* Logout */}
          <div className="an-mobile__footer">
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

export default AdminNavbar;
