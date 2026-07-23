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
  MessageCircle,
  ChevronRight,
  TrendingUp
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./AdminNavbar.css";

function AdminNavbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [spacesOpen, setSpacesOpen] = useState(false);
  const [bookingsOpen, setBookingsOpen] = useState(false);
  const [paymentsOpen, setPaymentsOpen] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);
  const [revenueOpen, setRevenueOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const profileRef = useRef(null);
  const spacesRef = useRef(null);
  const bookingsRef = useRef(null);
  const paymentsRef = useRef(null);
  const walletRef = useRef(null);
  const revenueRef = useRef(null);

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
      if (spacesRef.current && !spacesRef.current.contains(event.target)) {
        setSpacesOpen(false);
      }
      if (bookingsRef.current && !bookingsRef.current.contains(event.target)) {
        setBookingsOpen(false);
      }
      if (paymentsRef.current && !paymentsRef.current.contains(event.target)) {
        setPaymentsOpen(false);
      }
      if (walletRef.current && !walletRef.current.contains(event.target)) {
        setWalletOpen(false);
      }
      if (revenueRef.current && !revenueRef.current.contains(event.target)) {
        setRevenueOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setProfileOpen(false);
        setSpacesOpen(false);
        setBookingsOpen(false);
        setPaymentsOpen(false);
        setWalletOpen(false);
        setRevenueOpen(false);
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
  const isParentActive = (paths) => paths.some(p => location.pathname === p);

  const handleLogout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("token");
    navigate("/login");
  };

  // ─── DROPDOWN LINKS ───
  const spacesLinks = [
    { name: "All Spaces", path: "/adminspaces", icon: Building2 },
    { name: "My Spaces", path: "/admincabin", icon: Home },
  ];

  const bookingsLinks = [
    { name: "All Bookings", path: "/allbookings", icon: Ticket },
    { name: "My Bookings", path: "/mybookings", icon: Calendar },
  ];

  const paymentsLinks = [
    { name: "Users Payments", path: "/cabinpayments", icon: CreditCard },
  ];

  const walletLinks = [
    { name: "Users Wallet", path: "/userwallets", icon: Wallet },
    { name: "Withdrawals", path: "/withdrawals", icon: Banknote },
  ];

  const revenueLinks = [
    { name: "Booking Revenue", path: "/booking-revenue", icon: TrendingUp },
    { name: "Reg. Revenue", path: "/space-revenue", icon: TrendingUp },
  ];

  const spacesActive = isParentActive(spacesLinks.map(l => l.path));
  const bookingsActive = isParentActive(bookingsLinks.map(l => l.path));
  const paymentsActive = isParentActive(paymentsLinks.map(l => l.path));
  const walletActive = isParentActive(walletLinks.map(l => l.path));
  const revenueActive = isParentActive(revenueLinks.map(l => l.path));

  const adminString = localStorage.getItem("admin");
  const adminUser = adminString ? JSON.parse(adminString) : { name: "Admin" };
  const initials = adminUser.name?.substring(0, 2).toUpperCase() || "AD";

  return (
    <>
      <nav className={`an-nav${scrolled ? " an-nav--scrolled" : ""}`}>
        <div className="an-nav__inner">

          <Link to="/admindashboard" className="an-nav__logo">
            <div className="an-nav__logo-icon">
              <span className="an-nav__logo-ig">IG</span>
            </div>
            <div className="an-nav__logo-text">
              <span className="an-nav__logo-title">IRYAX SPACE</span>
              <span className="an-nav__logo-badge">Admin</span>
            </div>
          </Link>

          <ul className="an-nav__links">
            {/* Dashboard */}
            <li>
              <Link
                to="/admindashboard"
                className={`an-nav__link${isActive("/admindashboard") ? " an-nav__link--active" : ""}`}
              >
                <LayoutDashboard size={17} />
                <span>Dashboard</span>
                {isActive("/admindashboard") && <span className="an-nav__link-dot" />}
              </Link>
            </li>

            {/* Spaces Dropdown */}
            <li className="an-nav__dropdown-wrap" ref={spacesRef}>
              <button
                className={`an-nav__link an-nav__link--dropdown${spacesActive ? " an-nav__link--active" : ""}`}
                onClick={() => setSpacesOpen(!spacesOpen)}
              >
                <Building2 size={17} />
                <span>Spaces</span>
                <ChevronDown size={14} className={`an-nav__dropdown-chevron${spacesOpen ? " an-nav__dropdown-chevron--open" : ""}`} />
                {spacesActive && <span className="an-nav__link-dot" />}
              </button>

              {spacesOpen && (
                <div className="an-nav__dropdown-menu">
                  {spacesLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setSpacesOpen(false)}
                      className={`an-nav__dropdown-item${isActive(link.path) ? " an-nav__dropdown-item--active" : ""}`}
                    >
                      <link.icon size={16} />
                      <span>{link.name}</span>
                      {isActive(link.path) && <span className="an-nav__dropdown-active-dot" />}
                    </Link>
                  ))}
                </div>
              )}
            </li>

            {/* Bookings Dropdown */}
            <li className="an-nav__dropdown-wrap" ref={bookingsRef}>
              <button
                className={`an-nav__link an-nav__link--dropdown${bookingsActive ? " an-nav__link--active" : ""}`}
                onClick={() => setBookingsOpen(!bookingsOpen)}
              >
                <Ticket size={17} />
                <span>Bookings</span>
                <ChevronDown size={14} className={`an-nav__dropdown-chevron${bookingsOpen ? " an-nav__dropdown-chevron--open" : ""}`} />
                {bookingsActive && <span className="an-nav__link-dot" />}
              </button>

              {bookingsOpen && (
                <div className="an-nav__dropdown-menu">
                  {bookingsLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setBookingsOpen(false)}
                      className={`an-nav__dropdown-item${isActive(link.path) ? " an-nav__dropdown-item--active" : ""}`}
                    >
                      <link.icon size={16} />
                      <span>{link.name}</span>
                      {isActive(link.path) && <span className="an-nav__dropdown-active-dot" />}
                    </Link>
                  ))}
                </div>
              )}
            </li>

            {/* Users */}
            <li>
              <Link
                to="/allusers"
                className={`an-nav__link${isActive("/allusers") ? " an-nav__link--active" : ""}`}
              >
                <Users size={17} />
                <span>Users</span>
                {isActive("/allusers") && <span className="an-nav__link-dot" />}
              </Link>
            </li>

            {/* Payments Dropdown */}
            <li className="an-nav__dropdown-wrap" ref={paymentsRef}>
              <button
                className={`an-nav__link an-nav__link--dropdown${paymentsActive ? " an-nav__link--active" : ""}`}
                onClick={() => setPaymentsOpen(!paymentsOpen)}
              >
                <CreditCard size={17} />
                <span>Payments</span>
                <ChevronDown size={14} className={`an-nav__dropdown-chevron${paymentsOpen ? " an-nav__dropdown-chevron--open" : ""}`} />
                {paymentsActive && <span className="an-nav__link-dot" />}
              </button>

              {paymentsOpen && (
                <div className="an-nav__dropdown-menu">
                  {paymentsLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setPaymentsOpen(false)}
                      className={`an-nav__dropdown-item${isActive(link.path) ? " an-nav__dropdown-item--active" : ""}`}
                    >
                      <link.icon size={16} />
                      <span>{link.name}</span>
                      {isActive(link.path) && <span className="an-nav__dropdown-active-dot" />}
                    </Link>
                  ))}
                </div>
              )}
            </li>

            {/* Wallet Dropdown */}
            <li className="an-nav__dropdown-wrap" ref={walletRef}>
              <button
                className={`an-nav__link an-nav__link--dropdown${walletActive ? " an-nav__link--active" : ""}`}
                onClick={() => setWalletOpen(!walletOpen)}
              >
                <Wallet size={17} />
                <span>Wallet</span>
                <ChevronDown size={14} className={`an-nav__dropdown-chevron${walletOpen ? " an-nav__dropdown-chevron--open" : ""}`} />
                {walletActive && <span className="an-nav__link-dot" />}
              </button>

              {walletOpen && (
                <div className="an-nav__dropdown-menu">
                  {walletLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setWalletOpen(false)}
                      className={`an-nav__dropdown-item${isActive(link.path) ? " an-nav__dropdown-item--active" : ""}`}
                    >
                      <link.icon size={16} />
                      <span>{link.name}</span>
                      {isActive(link.path) && <span className="an-nav__dropdown-active-dot" />}
                    </Link>
                  ))}
                </div>
              )}
            </li>

            {/* Revenue Dropdown */}
            <li className="an-nav__dropdown-wrap" ref={revenueRef}>
              <button
                className={`an-nav__link an-nav__link--dropdown${revenueActive ? " an-nav__link--active" : ""}`}
                onClick={() => setRevenueOpen(!revenueOpen)}
              >
                <TrendingUp size={17} />
                <span>Revenue</span>
                <ChevronDown size={14} className={`an-nav__dropdown-chevron${revenueOpen ? " an-nav__dropdown-chevron--open" : ""}`} />
                {revenueActive && <span className="an-nav__link-dot" />}
              </button>

              {revenueOpen && (
                <div className="an-nav__dropdown-menu">
                  {revenueLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setRevenueOpen(false)}
                      className={`an-nav__dropdown-item${isActive(link.path) ? " an-nav__dropdown-item--active" : ""}`}
                    >
                      <link.icon size={16} />
                      <span>{link.name}</span>
                      {isActive(link.path) && <span className="an-nav__dropdown-active-dot" />}
                    </Link>
                  ))}
                </div>
              )}
            </li>

            {/* User Support - Renamed from Queries */}
            <li>
              <Link
                to="/userqueries"
                className={`an-nav__link${isActive("/userqueries") ? " an-nav__link--active" : ""}`}
              >
                <MessageCircle size={17} />
                <span>Support Tickets</span>
                {isActive("/userqueries") && <span className="an-nav__link-dot" />}
              </Link>
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

      {/* ─── MOBILE DRAWER ─── */}
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
            <p className="an-mobile__section-label">Dashboard</p>
            <Link
              to="/admindashboard"
              onClick={() => setOpen(false)}
              className={`an-mobile__link${isActive("/admindashboard") ? " an-mobile__link--active" : ""}`}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
              {isActive("/admindashboard") && <span className="an-mobile__link-dot" />}
            </Link>
          </div>

          <div className="an-mobile__section">
            <p className="an-mobile__section-label">Spaces</p>
            {spacesLinks.map((link) => (
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
            <p className="an-mobile__section-label">Bookings</p>
            {bookingsLinks.map((link) => (
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
            <p className="an-mobile__section-label">Users</p>
            <Link
              to="/allusers"
              onClick={() => setOpen(false)}
              className={`an-mobile__link${isActive("/allusers") ? " an-mobile__link--active" : ""}`}
            >
              <Users size={18} />
              <span>All Users</span>
              {isActive("/allusers") && <span className="an-mobile__link-dot" />}
            </Link>
          </div>

          <div className="an-mobile__section">
            <p className="an-mobile__section-label">Payments</p>
            {paymentsLinks.map((link) => (
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
            <p className="an-mobile__section-label">Wallet</p>
            {walletLinks.map((link) => (
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
            <p className="an-mobile__section-label">Revenue</p>
            {revenueLinks.map((link) => (
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
            <p className="an-mobile__section-label">Support</p>
            <Link
              to="/userqueries"
              onClick={() => setOpen(false)}
              className={`an-mobile__link${isActive("/userqueries") ? " an-mobile__link--active" : ""}`}
            >
              <MessageCircle size={18} />
              <span>User Support</span>
              {isActive("/userqueries") && <span className="an-mobile__link-dot" />}
            </Link>
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