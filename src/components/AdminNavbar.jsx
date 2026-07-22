import {
  LogOut,
  Menu,
  LayoutDashboard,
  Building2,
  Calendar,
  Home,
  Users,
  X,
  ChevronDown,
  Ticket,
  CreditCard,
  Wallet,
  Banknote,
  MoreHorizontal,
  Plus,
  MessageCircle
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./AdminNavbar.css";

function AdminNavbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const profileRef = useRef(null);
  const moreRef = useRef(null);

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
      if (moreRef.current && !moreRef.current.contains(event.target)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setProfileOpen(false);
        setMoreOpen(false);
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
    localStorage.removeItem("admin");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const mainNavLinks = [
    { name: "Dashboard", path: "/admindashboard", icon: LayoutDashboard },
    { name: "Spaces", path: "/adminspaces", icon: Building2 },
    { name: "Bookings", path: "/allbookings", icon: Ticket },
    { name: "My Bookings", path: "/mybookings", icon: Calendar },
    { name: "My Cabins", path: "/admincabin", icon: Home },
    { name: "Users", path: "/allusers", icon: Users },
  ];

  const moreLinks = [
    { name: "Cabin Payments", path: "/cabinpayments", icon: CreditCard },
    { name: "User Wallets", path: "/userwallets", icon: Wallet },
    { name: "Withdrawals", path: "/withdrawals", icon: Banknote },
    { name: "User Queries", path: "/userqueries", icon: MessageCircle }, // ✅ NEW
  ];

  const adminString = localStorage.getItem("admin");
  const adminUser = adminString ? JSON.parse(adminString) : { name: "Admin" };
  const initials = adminUser.name?.substring(0, 2).toUpperCase() || "AD";
  const isMoreActive = moreLinks.some(link => isActive(link.path));

  return (
    <>
      <nav className={`an-nav${scrolled ? " an-nav--scrolled" : ""}`}>
        <div className="an-nav__inner">

          <Link to="/admindashboard" className="an-nav__logo">
            <div className="an-nav__logo-icon">
              <span className="an-nav__logo-ig">IG</span>
            </div>
            <div className="an-nav__logo-text">
              <span className="an-nav__logo-title">IRYAX CO</span>
              <span className="an-nav__logo-badge">Admin</span>
            </div>
          </Link>

          <ul className="an-nav__links">
            {mainNavLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`an-nav__link${isActive(link.path) ? " an-nav__link--active" : ""}`}
                >
                  <link.icon size={17} />
                  <span>{link.name}</span>
                  {isActive(link.path) && <span className="an-nav__link-dot" />}
                </Link>
              </li>
            ))}

            <li className="an-nav__more-wrap" ref={moreRef}>
              <button
                className={`an-nav__link an-nav__link--more${isMoreActive ? " an-nav__link--active" : ""}`}
                onClick={() => setMoreOpen(!moreOpen)}
              >
                <MoreHorizontal size={17} />
                <span>More</span>
                <ChevronDown size={12} className={`an-nav__more-chevron${moreOpen ? " an-nav__more-chevron--open" : ""}`} />
                {isMoreActive && <span className="an-nav__link-dot" />}
              </button>

              {moreOpen && (
                <div className="an-nav__more-dropdown">
                  {moreLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMoreOpen(false)}
                      className={`an-nav__more-item${isActive(link.path) ? " an-nav__more-item--active" : ""}`}
                    >
                      <span className="an-nav__more-icon">
                        <link.icon size={16} />
                      </span>
                      <span>{link.name}</span>
                      {isActive(link.path) && <span className="an-nav__more-active-dot" />}
                    </Link>
                  ))}
                </div>
              )}
            </li>
          </ul>

          <div className="an-nav__right">
            <div className="an-nav__dropdown-wrap" ref={profileRef}>
              <button
                className="an-nav__profile-btn"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                <div className="an-nav__avatar">{initials}</div>
                <div className="an-nav__profile-info">
                  <span className="an-nav__profile-name">{adminUser.name || "Admin"}</span>
                  <span className="an-nav__profile-role">Admin</span>
                </div>
                <ChevronDown size={14} className={`an-nav__profile-chevron${profileOpen ? " an-nav__profile-chevron--open" : ""}`} />
              </button>

              {profileOpen && (
                <div className="an-nav__profile-dropdown">
                  <div className="an-nav__profile-header">
                    <div className="an-nav__avatar an-nav__avatar--lg">{initials}</div>
                    <div>
                      <p className="an-nav__dd-name">{adminUser.name || "Admin"}</p>
                      <p className="an-nav__dd-role">Administrator</p>
                    </div>
                  </div>
                  <div className="an-nav__dd-divider" />
                  <button className="an-nav__dd-logout" onClick={handleLogout}>
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>

            <button
              className="an-nav__hamburger"
              onClick={() => setOpen(!open)}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      <div className={`an-mobile${open ? " an-mobile--open" : ""}`}>
        <div className="an-mobile__backdrop" onClick={() => setOpen(false)} />
        <div className="an-mobile__drawer">
          <div className="an-mobile__head">
            <div className="an-mobile__logo">
              <div className="an-nav__logo-icon">
                <span className="an-nav__logo-ig">IG</span>
              </div>
              <div>
                <span className="an-mobile__logo-title">IRYAX CO</span>
                <span className="an-mobile__logo-badge">Admin</span>
              </div>
            </div>
            <button className="an-mobile__close" onClick={() => setOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <div className="an-mobile__admin-card">
            <div className="an-nav__avatar an-nav__avatar--lg">{initials}</div>
            <div>
              <p className="an-mobile__admin-name">{adminUser.name || "Admin"}</p>
              <p className="an-mobile__admin-role">Administrator</p>
            </div>
          </div>

          <div className="an-mobile__section">
            <p className="an-mobile__section-label">Main</p>
            {mainNavLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setOpen(false)}
                className={`an-mobile__link${isActive(link.path) ? " an-mobile__link--active" : ""}`}
              >
                <link.icon size={18} />
                <span>{link.name}</span>
                {isActive(link.path) && <span className="an-mobile__link-dot" />}
              </Link>
            ))}
          </div>

          <div className="an-mobile__section">
            <p className="an-mobile__section-label">Finance</p>
            {moreLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setOpen(false)}
                className={`an-mobile__link${isActive(link.path) ? " an-mobile__link--active" : ""}`}
              >
                <link.icon size={18} />
                <span>{link.name}</span>
                {isActive(link.path) && <span className="an-mobile__link-dot" />}
              </Link>
            ))}
          </div>

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