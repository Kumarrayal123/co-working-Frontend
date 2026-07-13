import axios from "axios";
import {
  Users,
  Search,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Eye,
  X,
  UserCheck,
  UserX,
  Building2,
  RefreshCw,
  Home,
  ShoppingBag,
  IndianRupee,
  TrendingUp,
  CheckCircle,
  Clock
} from "lucide-react";
import { useEffect, useState } from "react";
import AdminNavbar from "./AdminNavbar";
import "./Dashboard.css";
import { toast } from "react-toastify";

const API_URL = "http://62.72.29.27:5003";

const ROLE_COLORS = {
  user:   { bg: "#eff6ff", color: "#1d4ed8", label: "User" },
  doctor: { bg: "#fdf4ff", color: "#7c3aed", label: "Doctor" },
};

const STATUS_COLORS = {
  active:   { bg: "#f0fdf4", color: "#15803d", dot: "#16a34a" },
  pending:  { bg: "#fffbeb", color: "#b45309", dot: "#f59e0b" },
  approved: { bg: "#f0fdf4", color: "#15803d", dot: "#16a34a" },
  rejected: { bg: "#fef2f2", color: "#b91c1c", dot: "#ef4444" },
};

const getStatus = (s) => STATUS_COLORS[s] ?? STATUS_COLORS.pending;
const getRole   = (r) => ROLE_COLORS[r]   ?? ROLE_COLORS.user;

const fmt = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
};

const fmtCurrency = (amount) => {
  return `₹${amount?.toLocaleString('en-IN') || 0}`;
};

export default function AllUsers() {
  const [users,       setUsers]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [search,      setSearch]      = useState("");
  const [roleFilter,  setRoleFilter]  = useState("all");
  const [viewUser,    setViewUser]    = useState(null);

  const handleApprove = async (id) => {
    try {
      const res = await axios.put(`${API_URL}/api/admin/approve/${id}`);
      toast.success(res.data.message || "User approved successfully");
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, status: "approved" } : u))
      );
      if (viewUser && viewUser._id === id) {
        setViewUser((prev) => prev ? { ...prev, status: "approved" } : null);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to approve user");
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await axios.put(`${API_URL}/api/admin/reject/${id}`);
      toast.success(res.data.message || "User rejected successfully");
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, status: "rejected" } : u))
      );
      if (viewUser && viewUser._id === id) {
        setViewUser((prev) => prev ? { ...prev, status: "rejected" } : null);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to reject user");
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_URL}/api/admin/users`);
      if (res.data && res.data.success) {
        setUsers(Array.isArray(res.data.users) ? res.data.users : []);
      } else if (Array.isArray(res.data)) {
        setUsers(res.data);
      } else {
        setUsers([]);
        setError("Invalid response format");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch =
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.mobile?.includes(q);
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const totalUsers   = users.length;
  const totalDoctors = users.filter((u) => u.role === "doctor").length;
  const totalActive  = users.filter((u) => u.status === "active" || u.status === "approved").length;
  const totalPending = users.filter((u) => u.status === "pending").length;

  return (
    <div className="admin-dash">
      <AdminNavbar />

      <main className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16">

        {/* ── Header ── */}
        <div className="admin-dash__header">
          <div>
            <h1 className="admin-dash__greeting">
              Registered <span>Users</span>
            </h1>
            <p className="admin-dash__subtitle">
              View and manage all registered members on the platform.
            </p>
          </div>
          <button
            onClick={fetchUsers}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "0.55rem 1rem",
              background: "#fff", border: "1px solid #e4e7ec",
              borderRadius: 10, fontSize: "0.8rem", fontWeight: 600,
              color: "#475569", cursor: "pointer",
              boxShadow: "0 1px 2px rgba(16,24,40,0.05)",
              transition: "all 150ms",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
            onMouseLeave={e => e.currentTarget.style.background = "#fff"}
          >
            <RefreshCw size={15} />
            Refresh
          </button>
        </div>

        {/* ── Stats ── */}
        <style>{`
          .au-stats { display:grid; grid-template-columns:repeat(2,1fr); gap:0.75rem; margin-bottom:1.5rem; }
          @media(min-width:768px){ .au-stats { grid-template-columns:repeat(4,1fr); } }
          .au-table-wrap { background:#fff; border:1px solid #e4e7ec; border-radius:16px; overflow:hidden; box-shadow:0 1px 2px rgba(16,24,40,.05); }
          .au-thead { display:grid; grid-template-columns:2fr 2fr 1.5fr 0.8fr 1fr 1fr 120px; padding:.75rem 1.25rem; background:#f8fafc; border-bottom:1px solid #e4e7ec; gap:.75rem; }
          .au-trow  { display:grid; grid-template-columns:2fr 2fr 1.5fr 0.8fr 1fr 1fr 120px; padding:.875rem 1.25rem; gap:.75rem; align-items:center; border-bottom:1px solid #f1f5f9; transition:background 120ms; }
          .au-trow:last-child { border-bottom:none; }
          .au-trow:hover { background:#fafafa; }
          .au-mobile-card { display:none; flex-direction:column; gap:0; border-radius:16px; overflow:hidden; border:1px solid #e4e7ec; background:#fff; box-shadow:0 1px 2px rgba(16,24,40,.05); }
          .au-card-row { padding:1rem; border-bottom:1px solid #f1f5f9; }
          .au-card-row:last-child { border-bottom:none; }
          @media(max-width:767px) {
            .au-thead, .au-table-wrap { display:none; }
            .au-mobile-card { display:flex; }
          }
        `}</style>
        <div className="au-stats">
          {[
            { label: "Total Users",    value: totalUsers,   icon: Users,     cls: "admin-dash__stat-icon--indigo"  },
            { label: "Doctors",        value: totalDoctors, icon: UserCheck, cls: "admin-dash__stat-icon--violet"  },
            { label: "Active Members", value: totalActive,  icon: UserCheck, cls: "admin-dash__stat-icon--emerald" },
            { label: "Pending",        value: totalPending, icon: UserX,     cls: "admin-dash__stat-icon--amber"   },
          ].map(({ label, value, icon: Icon, cls }) => (
            <div key={label} className="admin-dash__stat" style={{ cursor: "default" }}>
              <div className="admin-dash__stat-top">
                <span className="admin-dash__stat-label">{label}</span>
                <div className={`admin-dash__stat-icon ${cls}`}>
                  <Icon size={16} />
                </div>
              </div>
              <div className="admin-dash__stat-value">{value}</div>
              <div className="admin-dash__stat-meta">registered members</div>
            </div>
          ))}
        </div>

        {/* ── Filters ── */}
        <div style={{
          display: "flex", gap: "0.75rem", flexWrap: "wrap",
          marginBottom: "1.25rem", alignItems: "center",
        }}>
          <div style={{ position: "relative", flex: "1 1 260px", minWidth: 220 }}>
            <Search
              size={16}
              style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}
            />
            <input
              type="text"
              placeholder="Search by name, email or phone..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: "100%", paddingLeft: 36, paddingRight: 12,
                paddingTop: "0.55rem", paddingBottom: "0.55rem",
                border: "1px solid #e4e7ec", borderRadius: 10,
                fontSize: "0.85rem", fontFamily: "inherit",
                color: "#1e293b", outline: "none",
                background: "#fff", boxSizing: "border-box",
                transition: "border-color 180ms",
              }}
              onFocus={e => e.target.style.borderColor = "#6366f1"}
              onBlur={e  => e.target.style.borderColor = "#e4e7ec"}
            />
          </div>

          {["all", "user", "doctor"].map(r => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              style={{
                padding: "0.45rem 1rem",
                border: `1.5px solid ${roleFilter === r ? "#6366f1" : "#e4e7ec"}`,
                borderRadius: 999,
                background: roleFilter === r ? "#eef2ff" : "#fff",
                color: roleFilter === r ? "#4f46e5" : "#64748b",
                fontSize: "0.8rem", fontWeight: 600,
                cursor: "pointer", transition: "all 150ms",
                textTransform: "capitalize",
              }}
            >
              {r === "all" ? "All Roles" : r}
            </button>
          ))}

          <span style={{ marginLeft: "auto", fontSize: "0.78rem", color: "#94a3b8", fontWeight: 500 }}>
            {filtered.length} of {totalUsers} users
          </span>
        </div>

        {/* ── Content ── */}
        {loading ? (
          <div className="admin-dash__loading">
            <div className="admin-dash__spinner" />
            <p className="admin-dash__loading-text">Loading users...</p>
          </div>
        ) : error ? (
          <div className="admin-dash__error">
            <UserX size={40} style={{ opacity: 0.4 }} />
            <p className="admin-dash__error-title">{error}</p>
            <button
              onClick={fetchUsers}
              style={{
                marginTop: 8, padding: "0.5rem 1.25rem",
                background: "#6366f1", color: "#fff",
                border: "none", borderRadius: 8,
                fontWeight: 600, cursor: "pointer", fontSize: "0.85rem",
              }}
            >
              Try Again
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            minHeight: 320, gap: "0.75rem",
            background: "#f8fafc", border: "1px solid #e4e7ec",
            borderRadius: 16,
          }}>
            <Users size={48} style={{ color: "#cbd5e1" }} />
            <p style={{ fontWeight: 700, color: "#64748b", fontSize: "1rem", margin: 0 }}>No users found</p>
            <p style={{ color: "#94a3b8", fontSize: "0.82rem", margin: 0 }}>Try adjusting your search or filter</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="au-table-wrap">
              <div className="au-thead">
                {["User", "Contact", "Address", "Cabins", "Role", "Status", "Action"].map(h => (
                  <span key={h} style={{
                    fontSize: "0.68rem", fontWeight: 700,
                    color: "#64748b", textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}>
                    {h}
                  </span>
                ))}
              </div>

              {filtered.map((user, idx) => {
                const st  = getStatus(user.status);
                const rl  = getRole(user.role);
                const cabinCount = user.cabinStats?.total || user.cabins?.length || 0;
                return (
                  <div
                    key={user._id}
                    className="au-trow"
                    style={{ borderBottom: idx < filtered.length - 1 ? "1px solid #f1f5f9" : "none" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: 0 }}>
                      <div style={{
                        width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
                        background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#fff", fontWeight: 700, fontSize: "0.8rem",
                      }}>
                        {user.name?.substring(0, 2).toUpperCase() || "US"}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: "0.85rem", color: "#101828", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {user.name || "—"}
                        </p>
                        <p style={{ margin: 0, fontSize: "0.7rem", color: "#94a3b8", marginTop: 1 }}>
                          Joined {fmt(user.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3 }}>
                        <Mail size={12} color="#6366f1" />
                        <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#334155", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {user.email || "—"}
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <Phone size={12} color="#6366f1" />
                        <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
                          {user.mobile || "—"}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "flex-start", gap: 5, minWidth: 0 }}>
                      <MapPin size={12} color="#94a3b8" style={{ marginTop: 2, flexShrink: 0 }} />
                      <span style={{ fontSize: "0.75rem", color: "#64748b", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                        {user.address || "—"}
                      </span>
                    </div>

                    {/* ─── CABIN COUNT COLUMN ─── */}
                    <div>
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 4,
                        padding: "3px 10px",
                        borderRadius: 999,
                        fontSize: "0.68rem", fontWeight: 700,
                        background: cabinCount > 0 ? "#f0fdf4" : "#f1f5f9",
                        color: cabinCount > 0 ? "#15803d" : "#94a3b8",
                      }}>
                        <Home size={12} />
                        {cabinCount}
                      </span>
                    </div>

                    <div>
                      <span style={{
                        display: "inline-block",
                        padding: "3px 10px",
                        borderRadius: 999,
                        fontSize: "0.68rem", fontWeight: 700,
                        background: rl.bg, color: rl.color,
                        textTransform: "capitalize",
                      }}>
                        {rl.label}
                      </span>
                    </div>

                    <div>
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 5,
                        padding: "3px 10px",
                        borderRadius: 999,
                        fontSize: "0.68rem", fontWeight: 700,
                        background: st.bg, color: st.color,
                        textTransform: "capitalize",
                      }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: st.dot, flexShrink: 0 }} />
                        {user.status || "pending"}
                      </span>
                    </div>

                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                      {user.status === "pending" ? (
                        <>
                          <button
                            onClick={() => handleReject(user._id)}
                            title="Reject User"
                            style={{
                              display: "flex", alignItems: "center", justifyContent: "center",
                              width: 28, height: 28, borderRadius: 6,
                              background: "#fef2f2", color: "#b91c1c",
                              border: "1px solid #fee2e2", cursor: "pointer",
                              transition: "all 140ms",
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = "#ef4444"; e.currentTarget.style.color = "#fff"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "#fef2f2"; e.currentTarget.style.color = "#b91c1c"; }}
                          >
                            <UserX size={14} />
                          </button>
                          <button
                            onClick={() => handleApprove(user._id)}
                            title="Approve User"
                            style={{
                              display: "flex", alignItems: "center", justifyContent: "center",
                              width: 28, height: 28, borderRadius: 6,
                              background: "#f0fdf4", color: "#15803d",
                              border: "1px solid #dcfce7", cursor: "pointer",
                              transition: "all 140ms",
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = "#22c55e"; e.currentTarget.style.color = "#fff"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "#f0fdf4"; e.currentTarget.style.color = "#15803d"; }}
                          >
                            <UserCheck size={14} />
                          </button>
                        </>
                      ) : null}
                      <button
                        onClick={() => setViewUser(user)}
                        style={{
                          display: "flex", alignItems: "center", gap: 5,
                          padding: "0.35rem 0.65rem",
                          background: "#eef2ff", color: "#4f46e5",
                          border: "1px solid #c7d2fe",
                          borderRadius: 8, fontSize: "0.75rem", fontWeight: 600,
                          cursor: "pointer", transition: "all 140ms",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = "#6366f1"; e.currentTarget.style.color = "#fff"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "#eef2ff"; e.currentTarget.style.color = "#4f46e5"; }}
                      >
                        <Eye size={13} /> View
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mobile Cards */}
            <div className="au-mobile-card">
              {filtered.map((user) => {
                const st = getStatus(user.status);
                const rl = getRole(user.role);
                const cabinCount = user.cabinStats?.total || user.cabins?.length || 0;
                return (
                  <div key={user._id} className="au-card-row">
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", marginBottom: "0.75rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", minWidth: 0 }}>
                        <div style={{
                          width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                          background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: "#fff", fontWeight: 700, fontSize: "0.85rem",
                        }}>
                          {user.name?.substring(0, 2).toUpperCase() || "US"}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ margin: 0, fontWeight: 700, fontSize: "0.875rem", color: "#101828", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {user.name || "—"}
                          </p>
                          <p style={{ margin: 0, fontSize: "0.7rem", color: "#94a3b8", marginTop: 1 }}>Joined {fmt(user.createdAt)}</p>
                        </div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
                        <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 999, fontSize: "0.65rem", fontWeight: 700, background: rl.bg, color: rl.color, textTransform: "capitalize" }}>{rl.label}</span>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 999, fontSize: "0.65rem", fontWeight: 700, background: st.bg, color: st.color, textTransform: "capitalize" }}>
                          <span style={{ width: 5, height: 5, borderRadius: "50%", background: st.dot }} />{user.status || "pending"}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: "0.78rem", color: "#475569", marginBottom: "0.75rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}><Mail size={12} color="#6366f1" /><span style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{user.email || "—"}</span></div>
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}><Phone size={12} color="#6366f1" /><span>{user.mobile || "—"}</span></div>
                      {user.address && <div style={{ display: "flex", alignItems: "flex-start", gap: 5 }}><MapPin size={12} color="#94a3b8" style={{ marginTop: 2, flexShrink: 0 }} /><span>{user.address}</span></div>}
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <Home size={12} color="#6366f1" />
                        <span style={{ fontWeight: 600, color: "#1e293b" }}>{cabinCount} {cabinCount === 1 ? 'Cabin' : 'Cabins'}</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      {user.status === "pending" && (
                        <>
                          <button onClick={() => handleReject(user._id)} style={{ flex: 1, padding: "0.45rem", background: "#fef2f2", color: "#b91c1c", border: "1px solid #fee2e2", borderRadius: 8, fontWeight: 700, fontSize: "0.78rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                            <UserX size={13} /> Reject
                          </button>
                          <button onClick={() => handleApprove(user._id)} style={{ flex: 1, padding: "0.45rem", background: "#f0fdf4", color: "#15803d", border: "1px solid #dcfce7", borderRadius: 8, fontWeight: 700, fontSize: "0.78rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                            <UserCheck size={13} /> Approve
                          </button>
                        </>
                      )}
                      <button onClick={() => setViewUser(user)} style={{ flex: 1, padding: "0.45rem", background: "#eef2ff", color: "#4f46e5", border: "1px solid #c7d2fe", borderRadius: 8, fontWeight: 700, fontSize: "0.78rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                        <Eye size={13} /> View
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>

      {/* ── User Detail Modal WITH CABIN STATS ── */}
      {viewUser && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 1200,
            background: "rgba(15,23,42,0.55)", backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "1rem",
          }}
          onClick={() => setViewUser(null)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: "#fff", borderRadius: 20,
              width: "100%", maxWidth: 560,
              boxShadow: "0 24px 60px rgba(0,0,0,0.18)",
              overflow: "hidden",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              animation: "modalIn 200ms cubic-bezier(0.34,1.3,0.64,1) forwards",
            }}
          >
            <style>{`@keyframes modalIn { from { opacity:0; transform:scale(0.94) translateY(12px); } to { opacity:1; transform:scale(1) translateY(0); } }`}</style>

            {/* Modal Header */}
            <div style={{
              background: "linear-gradient(135deg,#6366f1 0%,#8b5cf6 60%,#06b6d4 100%)",
              padding: "1.5rem",
              position: "relative",
              flexShrink: 0,
            }}>
              <button
                onClick={() => setViewUser(null)}
                style={{
                  position: "absolute", top: 14, right: 14,
                  width: 32, height: 32, borderRadius: 8,
                  background: "rgba(255,255,255,0.15)", border: "none",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", color: "#fff",
                }}
              >
                <X size={18} />
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{
                  width: 60, height: 60, borderRadius: "50%",
                  background: "rgba(255,255,255,0.2)",
                  border: "3px solid rgba(255,255,255,0.4)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.25rem", fontWeight: 800, color: "#fff",
                }}>
                  {viewUser.name?.substring(0, 2).toUpperCase() || "US"}
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 800, color: "#fff" }}>
                    {viewUser.name || "—"}
                  </h2>
                  <div style={{ display: "flex", gap: "0.5rem", marginTop: 6, flexWrap: "wrap" }}>
                    <span style={{
                      padding: "2px 10px", borderRadius: 999, fontSize: "0.68rem",
                      fontWeight: 700, background: "rgba(255,255,255,0.2)", color: "#fff",
                      textTransform: "capitalize",
                    }}>
                      {viewUser.role || "user"}
                    </span>
                    <span style={{
                      padding: "2px 10px", borderRadius: 999, fontSize: "0.68rem",
                      fontWeight: 700,
                      background: getStatus(viewUser.status).bg,
                      color: getStatus(viewUser.status).color,
                      textTransform: "capitalize",
                    }}>
                      {viewUser.status || "pending"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Body - Scrollable */}
            <div style={{ padding: "1.5rem", overflowY: "auto", flex: 1 }} className="custom-scrollbar">

              {/* User Details */}
              <div style={{ marginBottom: "1rem" }}>
                <h4 style={{ margin: "0 0 0.75rem 0", fontSize: "0.75rem", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  User Information
                </h4>
                {[
                  { icon: Mail,      label: "Email",        value: viewUser.email },
                  { icon: Phone,     label: "Mobile",       value: viewUser.mobile },
                  { icon: MapPin,    label: "Address",      value: viewUser.address },
                  { icon: Building2, label: "Organization", value: viewUser.organizationName || "—" },
                  { icon: Calendar,  label: "Registered",   value: fmt(viewUser.createdAt) },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} style={{
                    display: "flex", alignItems: "flex-start", gap: "0.875rem",
                    padding: "0.6rem 0",
                    borderBottom: "1px solid #f1f5f9",
                  }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                      background: "#eef2ff",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Icon size={16} color="#6366f1" />
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: "0.68rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        {label}
                      </p>
                      <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 600, color: "#101828", marginTop: 2 }}>
                        {value || "—"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* ─── CABIN STATS ─── */}
              {viewUser.cabinStats && (
                <div style={{ marginBottom: "1rem" }}>
                  <h4 style={{ margin: "0 0 0.75rem 0", fontSize: "0.75rem", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    <Home size={14} style={{ display: "inline", marginRight: 4 }} /> Cabin Statistics
                  </h4>
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
                    gap: "0.5rem",
                  }}>
                    <div style={{
                      background: "#f8fafc",
                      borderRadius: 10,
                      padding: "0.75rem",
                      textAlign: "center",
                      border: "1px solid #e4e7ec",
                    }}>
                      <p style={{ margin: 0, fontSize: "0.6rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        Total Cabins
                      </p>
                      <p style={{ margin: 0, fontSize: "1.25rem", fontWeight: 800, color: "#1e293b" }}>
                        {viewUser.cabinStats.total || 0}
                      </p>
                    </div>
                    <div style={{
                      background: "#f0fdf4",
                      borderRadius: 10,
                      padding: "0.75rem",
                      textAlign: "center",
                      border: "1px solid #dcfce7",
                    }}>
                      <p style={{ margin: 0, fontSize: "0.6rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        Active
                      </p>
                      <p style={{ margin: 0, fontSize: "1.25rem", fontWeight: 800, color: "#15803d" }}>
                        {viewUser.cabinStats.active || 0}
                      </p>
                    </div>
                    <div style={{
                      background: "#fef2f2",
                      borderRadius: 10,
                      padding: "0.75rem",
                      textAlign: "center",
                      border: "1px solid #fee2e2",
                    }}>
                      <p style={{ margin: 0, fontSize: "0.6rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        Inactive
                      </p>
                      <p style={{ margin: 0, fontSize: "1.25rem", fontWeight: 800, color: "#dc2626" }}>
                        {viewUser.cabinStats.inactive || 0}
                      </p>
                    </div>
                    <div style={{
                      background: "#fefce8",
                      borderRadius: 10,
                      padding: "0.75rem",
                      textAlign: "center",
                      border: "1px solid #fef08a",
                    }}>
                      <p style={{ margin: 0, fontSize: "0.6rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        <IndianRupee size={10} style={{ display: "inline" }} /> Earnings
                      </p>
                      <p style={{ margin: 0, fontSize: "1rem", fontWeight: 800, color: "#ca8a04" }}>
                        {fmtCurrency(viewUser.cabinStats.totalEarnings || 0)}
                      </p>
                    </div>
                    <div style={{
                      background: "#eff6ff",
                      borderRadius: 10,
                      padding: "0.75rem",
                      textAlign: "center",
                      border: "1px solid #bfdbfe",
                    }}>
                      <p style={{ margin: 0, fontSize: "0.6rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        <ShoppingBag size={10} style={{ display: "inline" }} /> Active Orders
                      </p>
                      <p style={{ margin: 0, fontSize: "1.25rem", fontWeight: 800, color: "#2563eb" }}>
                        {viewUser.cabinStats.activeOrders || 0}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ─── USER'S CABINS ─── */}
              {viewUser.cabins && viewUser.cabins.length > 0 && (
                <div style={{ marginBottom: "1rem" }}>
                  <h4 style={{ margin: "0 0 0.75rem 0", fontSize: "0.75rem", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    <Home size={14} style={{ display: "inline", marginRight: 4 }} /> User's Cabins ({viewUser.cabins.length})
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {viewUser.cabins.map((cabin) => (
                      <div key={cabin._id} style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "0.5rem 0.75rem",
                        background: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        borderRadius: 8,
                      }}>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ margin: 0, fontSize: "0.78rem", fontWeight: 600, color: "#1e293b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {cabin.name || "—"}
                          </p>
                          <p style={{ margin: 0, fontSize: "0.65rem", color: "#94a3b8" }}>
                            {cabin.address || "—"} • ₹{cabin.price}/hr • {cabin.capacity} seats
                          </p>
                        </div>
                        <span style={{
                          display: "inline-flex", alignItems: "center", gap: 4,
                          padding: "2px 8px",
                          borderRadius: 999,
                          fontSize: "0.6rem",
                          fontWeight: 700,
                          background: cabin.isActive ? "#f0fdf4" : "#fef2f2",
                          color: cabin.isActive ? "#15803d" : "#dc2626",
                        }}>
                          {cabin.isActive ? <CheckCircle size={10} /> : <X size={10} />}
                          {cabin.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ─── USER'S ORDERS ─── */}
              {viewUser.orders && viewUser.orders.length > 0 && (
                <div style={{ marginBottom: "1rem" }}>
                  <h4 style={{ margin: "0 0 0.75rem 0", fontSize: "0.75rem", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    <ShoppingBag size={14} style={{ display: "inline", marginRight: 4 }} /> Recent Orders ({viewUser.orders.length})
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {viewUser.orders.slice(0, 5).map((order) => (
                      <div key={order._id} style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "0.5rem 0.75rem",
                        background: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        borderRadius: 8,
                      }}>
                        <div>
                          <p style={{ margin: 0, fontSize: "0.75rem", fontWeight: 600, color: "#1e293b" }}>
                            {fmtCurrency(order.amount)}
                          </p>
                          <p style={{ margin: 0, fontSize: "0.6rem", color: "#94a3b8" }}>
                            {order.startDate ? fmt(order.startDate) : "—"} • {order.expiryDate ? fmt(order.expiryDate) : "—"}
                          </p>
                        </div>
                        <span style={{
                          display: "inline-flex", alignItems: "center", gap: 4,
                          padding: "2px 8px",
                          borderRadius: 999,
                          fontSize: "0.6rem",
                          fontWeight: 700,
                          background: order.status === "active" ? "#f0fdf4" : order.status === "completed" ? "#eff6ff" : "#fef2f2",
                          color: order.status === "active" ? "#15803d" : order.status === "completed" ? "#2563eb" : "#dc2626",
                        }}>
                          {order.status === "active" ? <Clock size={10} /> : order.status === "completed" ? <CheckCircle size={10} /> : <X size={10} />}
                          {order.status || "pending"}
                        </span>
                      </div>
                    ))}
                    {viewUser.orders.length > 5 && (
                      <p style={{ fontSize: "0.65rem", color: "#94a3b8", textAlign: "center" }}>
                        +{viewUser.orders.length - 5} more orders
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Uploaded Documents */}
              {(viewUser.role === "doctor" || viewUser.adharCard || viewUser.panCard || viewUser.mbbsCertificate) && (
                <div style={{ marginTop: "0.5rem" }}>
                  <h4 style={{ margin: "0 0 0.75rem 0", fontSize: "0.75rem", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    Uploaded Documents
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {[
                      { label: "Aadhar Card", file: viewUser.adharCard },
                      { label: "PAN Card", file: viewUser.panCard },
                      { label: "MBBS Certificate", file: viewUser.mbbsCertificate },
                      { label: "PMC Registration", file: viewUser.pmcRegistration },
                      { label: "NMR ID Card", file: viewUser.nmrId },
                    ].map(({ label, file }) => {
                      if (!file) return null;
                      const fileUrl = file.startsWith("http") ? file : `${API_URL}/${file}`;
                      return (
                        <div key={label} style={{
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                          padding: "0.5rem 0.75rem", background: "#f8fafc",
                          border: "1px solid #e2e8f0", borderRadius: 8,
                        }}>
                          <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#334155" }}>{label}</span>
                          <a href={fileUrl} target="_blank" rel="noopener noreferrer" style={{
                            fontSize: "0.7rem", fontWeight: 600, color: "#6366f1",
                            textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 3,
                          }}
                          onMouseEnter={e => e.target.style.textDecoration = "underline"}
                          onMouseLeave={e => e.target.style.textDecoration = "none"}
                          >
                            <Eye size={12} /> View
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #f1f5f9", display: "flex", gap: "0.75rem", flexShrink: 0 }}>
              {viewUser.status === "pending" ? (
                <>
                  <button
                    onClick={() => handleReject(viewUser._id)}
                    style={{
                      flex: 1, padding: "0.75rem",
                      background: "#fef2f2", color: "#b91c1c",
                      border: "1px solid #fee2e2", borderRadius: 10,
                      fontWeight: 700, fontSize: "0.82rem", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                      transition: "all 150ms"
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "#fee2e2"}
                    onMouseLeave={e => e.currentTarget.style.background = "#fef2f2"}
                  >
                    <UserX size={15} /> Reject
                  </button>
                  <button
                    onClick={() => handleApprove(viewUser._id)}
                    style={{
                      flex: 1, padding: "0.75rem",
                      background: "#f0fdf4", color: "#15803d",
                      border: "1px solid #dcfce7", borderRadius: 10,
                      fontWeight: 700, fontSize: "0.82rem", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                      transition: "all 150ms"
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "#dcfce7"}
                    onMouseLeave={e => e.currentTarget.style.background = "#f0fdf4"}
                  >
                    <UserCheck size={15} /> Approve
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setViewUser(null)}
                  style={{
                    width: "100%", padding: "0.75rem",
                    background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                    color: "#fff", border: "none", borderRadius: 10,
                    fontWeight: 700, fontSize: "0.875rem", cursor: "pointer",
                  }}
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}