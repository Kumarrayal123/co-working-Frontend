import axios from "axios";
import {
  Users,
  Mail,
  Phone,
  MapPin,
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
  Clock,
  XCircle as XCircleIcon,
  User as UserIcon,
  Crown,
  Shield,
  Download,
  FileText,
  Stethoscope,
  Calendar
} from "lucide-react";
import { useEffect, useState } from "react";
import AdminNavbar from "./AdminNavbar";
import "./Dashboard.css";
import { toast } from "react-toastify";
import * as XLSX from 'xlsx';

const API_URL = "https://spaceapi.iryax.com";

const ROLE_COLORS = {
  user:   { bg: "bg-blue-100 text-blue-700", label: "User" },
  doctor: { bg: "bg-purple-100 text-purple-700", label: "Doctor" },
  admin:  { bg: "bg-amber-100 text-amber-700", label: "Admin" }
};

const STATUS_COLORS = {
  active:   { bg: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
  pending:  { bg: "bg-yellow-100 text-yellow-700", dot: "bg-yellow-500" },
  approved: { bg: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
  rejected: { bg: "bg-red-100 text-red-700", dot: "bg-red-500" }
};

const getStatus = (s) => STATUS_COLORS[s] || STATUS_COLORS.pending;
const getRole = (r) => ROLE_COLORS[r] || ROLE_COLORS.user;

// ✅ Format date to dd/mm/yyyy
const formatDateDDMMYYYY = (dateStr) => {
  if (!dateStr) return "N/A";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "N/A";
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

// ✅ Format date to dd/mm/yyyy with time
const formatDateTimeDDMMYYYY = (dateStr) => {
  if (!dateStr) return "N/A";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "N/A";
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
};

// Alias for backward compatibility
const formatDate = formatDateDDMMYYYY;

const formatCurrency = (amount) => {
  return `₹${amount?.toLocaleString('en-IN') || 0}`;
};

export default function AllUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterName, setFilterName] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPhone, setFilterPhone] = useState("");
  const [filterAddress, setFilterAddress] = useState("");
  const [filterJoinedFrom, setFilterJoinedFrom] = useState("");
  const [filterJoinedTo, setFilterJoinedTo] = useState("");
  const [viewUser, setViewUser] = useState(null);

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

  const clearFilters = () => {
    setFilterName("");
    setFilterRole("all");
    setFilterStatus("all");
    setFilterPhone("");
    setFilterAddress("");
    setFilterJoinedFrom("");
    setFilterJoinedTo("");
  };

  const filtered = users.filter((u) => {
    const matchName = filterName ? u.name?.toLowerCase().includes(filterName.toLowerCase()) : true;
    const matchRole = filterRole === "all" || u.role === filterRole;
    const matchStatus = filterStatus === "all" || u.status === filterStatus;
    const matchPhone = filterPhone ? u.mobile?.includes(filterPhone) : true;
    const matchAddress = filterAddress ? u.address?.toLowerCase().includes(filterAddress.toLowerCase()) : true;
    
    let matchDate = true;
    if (filterJoinedFrom) {
      const fromDate = new Date(filterJoinedFrom);
      const userDate = new Date(u.createdAt);
      if (userDate < fromDate) matchDate = false;
    }
    if (filterJoinedTo && matchDate) {
      const toDate = new Date(filterJoinedTo);
      const userDate = new Date(u.createdAt);
      toDate.setHours(23, 59, 59, 999);
      if (userDate > toDate) matchDate = false;
    }
    
    return matchName && matchRole && matchStatus && matchPhone && matchAddress && matchDate;
  });

  const totalUsers = users.length;
  const totalDoctors = users.filter((u) => u.role === "doctor").length;
  const totalActive = users.filter((u) => u.status === "active" || u.status === "approved").length;
  const totalPending = users.filter((u) => u.status === "pending").length;
  const totalRejected = users.filter((u) => u.status === "rejected").length;

  const exportToExcel = () => {
    try {
      if (filtered.length === 0) {
        toast.warning("No users to export");
        return;
      }

      const exportData = filtered.map((user, index) => ({
        'S.No': index + 1,
        'Name': user.name || 'N/A',
        'Email': user.email || 'N/A',
        'Mobile': user.mobile || 'N/A',
        'Address': user.address || 'N/A',
        'Role': user.role || 'user',
        'Status': user.status || 'pending',
        'Organization': user.organizationName || 'N/A',
        'Total Cabins': user.cabinStats?.total || 0,
        'Active Cabins': user.cabinStats?.active || 0,
        'Inactive Cabins': user.cabinStats?.inactive || 0,
        'Total Earnings': user.cabinStats?.totalEarnings || 0,
        'Active Orders': user.cabinStats?.activeOrders || 0,
        'Joined': formatDateDDMMYYYY(user.createdAt)
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'All_Users');
      
      const date = new Date().toISOString().split('T')[0];
      XLSX.writeFile(wb, `all_users_${date}.xlsx`);
      
      toast.success(`Exported ${filtered.length} users to Excel!`);
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export users");
    }
  };

  const hasActiveFilters = filterName || filterRole !== 'all' || filterStatus !== 'all' || filterPhone || filterAddress || filterJoinedFrom || filterJoinedTo;

  if (loading) {
    return (
      <div className="admin-dash" style={{ backgroundColor: '#ffffff' }}>
        <AdminNavbar />
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dash" style={{ backgroundColor: '#f8fafc' }}>
      <AdminNavbar />

      <div className="pt-24 px-3 sm:px-4 md:px-6 lg:px-8 max-w-full mx-auto pb-16">
        {/* Header */}
        <div className="admin-dash__header">
          <div>
            <h1 className="admin-dash__greeting">
              All <span>Users</span>
            </h1>
            <p className="admin-dash__subtitle">Manage and monitor all registered users</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchUsers}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-indigo-700 rounded-lg text-xs font-medium hover:bg-indigo-50 transition-all duration-200 border border-gray-200 shadow-sm hover:shadow-md"
              title="Refresh"
            >
              <RefreshCw size={14} />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="admin-dash__stats" style={{ marginBottom: '20px' }}>
          {[
            {
              label: "Total Users",
              value: totalUsers,
              meta: "registered members",
              icon: Users,
              color: "rose"
            },
            {
              label: "Doctors",
              value: totalDoctors,
              meta: "medical practitioners",
              icon: Stethoscope,
              color: "indigo"
            },
            {
              label: "Active",
              value: totalActive,
              meta: "active & approved",
              icon: CheckCircle,
              color: "emerald"
            },
            {
              label: "Pending",
              value: totalPending,
              meta: "awaiting approval",
              icon: Clock,
              color: "amber"
            },
            {
              label: "Rejected",
              value: totalRejected,
              meta: "rejected accounts",
              icon: UserX,
              color: "cyan"
            }
          ].map((stat, index) => (
            <div
              key={index}
              className="admin-dash__stat"
              style={{ 
                padding: '16px',
                minHeight: '95px',
                transition: 'all 0.3s ease'
              }}
            >
              <div className="admin-dash__stat-top">
                <span className="admin-dash__stat-label" style={{ fontSize: '12px', fontWeight: '600' }}>{stat.label}</span>
                <div className={`admin-dash__stat-icon admin-dash__stat-icon--${stat.color}`} style={{ width: '32px', height: '32px' }}>
                  <stat.icon size={16} />
                </div>
              </div>
              <div className="admin-dash__stat-value" style={{ fontSize: '24px', fontWeight: '700', letterSpacing: '-0.02em' }}>{stat.value}</div>
              <div className="admin-dash__stat-meta" style={{ fontSize: '11px', fontWeight: '500' }}>{stat.meta}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex-1 relative">
              <Users size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name..."
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Phone..."
                  value={filterPhone}
                  onChange={(e) => setFilterPhone(e.target.value)}
                  className="pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 w-36 transition-all duration-200"
                />
              </div>
              <div className="relative">
                <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  value={filterJoinedFrom}
                  onChange={(e) => setFilterJoinedFrom(e.target.value)}
                  className="pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white transition-all duration-200"
                />
              </div>
              <div className="relative">
                <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  value={filterJoinedTo}
                  onChange={(e) => setFilterJoinedTo(e.target.value)}
                  className="pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white transition-all duration-200"
                />
              </div>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white transition-all duration-200 cursor-pointer"
              >
                <option value="all">All Roles</option>
                <option value="user">User</option>
                <option value="doctor">Doctor</option>
                <option value="admin">Admin</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white transition-all duration-200 cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
                  title="Clear filters"
                >
                  <XCircleIcon size={18} />
                </button>
              )}
              {filtered.length > 0 && (
                <button
                  onClick={exportToExcel}
                  className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md"
                  title="Export to Excel"
                >
                  <Download size={16} />
                  Export
                </button>
              )}
            </div>
          </div>
          <div className="mt-3 text-xs text-gray-500 font-medium">
            Showing <span className="text-indigo-600 font-bold">{filtered.length}</span> of <span className="text-gray-700 font-bold">{users.length}</span> users
          </div>
        </div>

        {/* Table Section */}
        <div className="admin-dash__card" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>

          {/* Table Container */}
          <div className="admin-dash__card-body p-0 overflow-x-auto" style={{ backgroundColor: '#ffffff' }}>
            {error ? (
              <div className="flex flex-col items-center justify-center gap-4 py-24 text-gray-400">
                <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
                  <UserX size={40} className="text-red-400" />
                </div>
                <p className="text-lg font-semibold text-red-600">{error}</p>
                <button
                  onClick={fetchUsers}
                  className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Try Again
                </button>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4 py-24 text-gray-400">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                  <Users size={40} className="text-gray-400" />
                </div>
                <p className="text-lg font-semibold text-gray-600">No users found</p>
                <p className="text-sm text-gray-500">Try adjusting your filters.</p>
              </div>
            ) : (
              <table className="w-full min-w-[1100px] text-left">
                <thead>
                  <tr className="border-b border-gray-200" style={{ backgroundColor: '#f8fafc' }}>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-600 uppercase whitespace-nowrap">S.No</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-600 uppercase whitespace-nowrap">User</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-600 uppercase whitespace-nowrap">Contact</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-600 uppercase whitespace-nowrap">Role</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-600 uppercase whitespace-nowrap">Cabins</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-600 uppercase whitespace-nowrap">Status</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-600 uppercase whitespace-nowrap">Joined</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-600 uppercase whitespace-nowrap text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((user, idx) => {
                    const st = getStatus(user.status);
                    const rl = getRole(user.role);
                    const cabinCount = user.cabinStats?.total || user.cabins?.length || 0;
                    
                    return (
                      <tr key={user._id} className="transition-all duration-200 group hover:bg-indigo-50/50 hover:shadow-sm">
                        <td className="p-4">
                          <span className="text-sm font-bold text-gray-400 group-hover:text-indigo-600 transition-colors">{idx + 1}</span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                              {user.name?.charAt(0)?.toUpperCase() || "U"}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 text-sm">{user.name || "—"}</p>
                              <p className="text-xs text-gray-500 flex items-center gap-1">
                                <Mail size={11} className="text-gray-400" />
                                {user.email || "—"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="text-sm text-gray-700 flex items-center gap-1.5 font-medium">
                              <Phone size={14} className="text-gray-400" />
                              {user.mobile || "—"}
                            </p>
                            {user.address && (
                              <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                <MapPin size={11} className="text-gray-400" />
                                <span className="truncate max-w-[140px]">{user.address}</span>
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full ${rl.bg} shadow-sm`}>
                            {user.role === 'admin' && <Crown size={12} />}
                            {user.role === 'doctor' && <Shield size={12} />}
                            {rl.label}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${
                            cabinCount > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                          }`}>
                            <Home size={12} />
                            {cabinCount}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full ${st.bg} shadow-sm`}>
                            <span className={`w-2 h-2 rounded-full ${st.dot}`}></span>
                            {user.status || "pending"}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-gray-600 font-medium">{formatDateDDMMYYYY(user.createdAt)}</span>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-2 flex-wrap">
                            {user.status === "pending" && (
                              <>
                                <button
                                  onClick={() => handleApprove(user._id)}
                                  className="p-2.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-all duration-200 shadow-sm hover:shadow-md"
                                  title="Approve User"
                                >
                                  <UserCheck size={16} />
                                </button>
                                <button
                                  onClick={() => handleReject(user._id)}
                                  className="p-2.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-all duration-200 shadow-sm hover:shadow-md"
                                  title="Reject User"
                                >
                                  <UserX size={16} />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => setViewUser(user)}
                              className="p-2.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-all duration-200 shadow-sm hover:shadow-md"
                              title="View Details"
                            >
                              <Eye size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Footer with stats */}
          {!loading && filtered.length > 0 && (
            <div className="px-5 py-4 border-t border-gray-200 rounded-b-2xl flex flex-wrap items-center justify-between gap-3" style={{ backgroundColor: '#f8fafc' }}>
              <span className="text-sm text-gray-600 font-medium">
                Showing <strong className="text-indigo-600">{filtered.length}</strong> of <strong className="text-gray-800">{users.length}</strong> users
              </span>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm"></span>
                  <span className="font-medium">Active: {totalActive}</span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm"></span>
                  <span className="font-medium">Pending: {totalPending}</span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm"></span>
                  <span className="font-medium">Rejected: {totalRejected}</span>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ====================== */}
      {/* USER DETAIL MODAL */}
      {/* ====================== */}
      {viewUser && (
        <div
          className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setViewUser(null)}
        >
          <div
            className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 p-6 text-white rounded-t-3xl flex justify-between items-center flex-shrink-0 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold border-2 border-white/30 shadow-inner backdrop-blur-sm">
                  {viewUser.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">{viewUser.name || "—"}</h2>
                  <div className="flex flex-wrap items-center gap-2 mt-1.5">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full ${getRole(viewUser.role).bg} shadow-sm`}>
                      {getRole(viewUser.role).label}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full ${getStatus(viewUser.status).bg} shadow-sm`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${getStatus(viewUser.status).dot}`}></span>
                      {viewUser.status || "pending"}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setViewUser(null)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 hover:scale-110"
                title="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6 custom-scrollbar">
              {/* User Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <Mail size={12} className="text-indigo-500" /> Email
                  </p>
                  <p className="font-semibold text-gray-800 text-sm break-all">{viewUser.email || "—"}</p>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <Phone size={12} className="text-indigo-500" /> Mobile
                  </p>
                  <p className="font-semibold text-gray-800 text-sm">{viewUser.mobile || "—"}</p>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <MapPin size={12} className="text-indigo-500" /> Address
                  </p>
                  <p className="font-semibold text-gray-800 text-sm">{viewUser.address || "—"}</p>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <Building2 size={12} className="text-indigo-500" /> Organization
                  </p>
                  <p className="font-semibold text-gray-800 text-sm">{viewUser.organizationName || "—"}</p>
                </div>
              </div>

              {/* Cabin Stats */}
              {viewUser.cabinStats && (
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                    <Home size={12} className="text-indigo-500" /> Cabin Statistics
                  </p>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                    <div className="bg-white rounded-lg p-3 text-center border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <p className="text-[10px] font-bold text-gray-500 uppercase">Total</p>
                      <p className="text-xl font-bold text-indigo-600">{viewUser.cabinStats.total || 0}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center border border-emerald-200 shadow-sm hover:shadow-md transition-shadow">
                      <p className="text-[10px] font-bold text-emerald-500 uppercase">Active</p>
                      <p className="text-xl font-bold text-emerald-600">{viewUser.cabinStats.active || 0}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center border border-red-200 shadow-sm hover:shadow-md transition-shadow">
                      <p className="text-[10px] font-bold text-red-500 uppercase">Inactive</p>
                      <p className="text-xl font-bold text-red-600">{viewUser.cabinStats.inactive || 0}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center border border-amber-200 shadow-sm hover:shadow-md transition-shadow">
                      <p className="text-[10px] font-bold text-amber-500 uppercase">Earnings</p>
                      <p className="text-lg font-bold text-amber-600">{formatCurrency(viewUser.cabinStats.totalEarnings || 0)}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
                      <p className="text-[10px] font-bold text-blue-500 uppercase">Active Orders</p>
                      <p className="text-xl font-bold text-blue-600">{viewUser.cabinStats.activeOrders || 0}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* User's Cabins */}
              {viewUser.cabins && viewUser.cabins.length > 0 && (
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                    <Home size={12} className="text-indigo-500" /> Cabins ({viewUser.cabins.length})
                  </p>
                  <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                    {viewUser.cabins.map((cabin) => (
                      <div key={cabin._id} className="flex items-center justify-between bg-white rounded-lg p-3 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">{cabin.name || "—"}</p>
                          <p className="text-xs text-gray-500">{cabin.address || "—"} • ₹{cabin.price}/hr • {cabin.capacity} seats</p>
                        </div>
                        <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full shadow-sm ${
                          cabin.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {cabin.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* User's Orders */}
              {viewUser.orders && viewUser.orders.length > 0 && (
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                    <ShoppingBag size={12} className="text-indigo-500" /> Recent Orders ({viewUser.orders.length})
                  </p>
                  <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                    {viewUser.orders.slice(0, 5).map((order) => (
                      <div key={order._id} className="flex items-center justify-between bg-white rounded-lg p-3 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">{formatCurrency(order.amount)}</p>
                          <p className="text-xs text-gray-500">{formatDateDDMMYYYY(order.startDate)} — {formatDateDDMMYYYY(order.expiryDate)}</p>
                        </div>
                        <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full shadow-sm ${
                          order.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                          order.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                          'bg-red-100 text-red-600'
                        }`}>
                          {order.status || 'pending'}
                        </span>
                      </div>
                    ))}
                    {viewUser.orders.length > 5 && (
                      <p className="text-xs text-gray-500 text-center font-medium">+{viewUser.orders.length - 5} more orders</p>
                    )}
                  </div>
                </div>
              )}

              {/* Documents */}
              {(viewUser.role === "doctor" || viewUser.adharCard || viewUser.panCard) && (
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                    <FileText size={12} className="text-indigo-500" /> Documents
                  </p>
                  <div className="space-y-2">
                    {[
                      { label: "Aadhar Card", file: viewUser.adharCard },
                      { label: "PAN Card", file: viewUser.panCard },
                      { label: "MBBS Certificate", file: viewUser.mbbsCertificate },
                      { label: "PMC Registration", file: viewUser.pmcRegistration },
                      { label: "NMR ID", file: viewUser.nmrId },
                    ].map(({ label, file }) => {
                      if (!file) return null;
                      const fileUrl = file.startsWith("http") ? file : `${API_URL}/${file}`;
                      return (
                        <div key={label} className="flex items-center justify-between bg-white rounded-lg p-3 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                          <span className="text-sm font-semibold text-gray-700">{label}</span>
                          <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors">
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
            <div className="p-5 border-t border-gray-200 flex flex-wrap gap-3 flex-shrink-0 bg-gray-50">
              {viewUser.status === "pending" ? (
                <>
                  <button
                    onClick={() => handleApprove(viewUser._id)}
                    className="flex-1 min-w-[120px] py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    <UserCheck size={16} /> Approve
                  </button>
                  <button
                    onClick={() => handleReject(viewUser._id)}
                    className="flex-1 min-w-[120px] py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    <UserX size={16} /> Reject
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setViewUser(null)}
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition-all duration-200 active:scale-[0.98]"
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