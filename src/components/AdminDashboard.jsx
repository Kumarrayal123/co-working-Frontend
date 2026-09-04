// AdminDashboard.jsx - Polished UI matching Owner Dashboard reference
import axios from "axios";
import {
  Building2,
  Calendar,
  Ticket,
  Users,
  CreditCard,
  IndianRupee,
  CheckCircle,
  TrendingUp,
  Clock,
  Wallet,
  Eye,
  ArrowUpRight,
  Home,
  User,
  Phone,
  Mail,
  MapPin,
  RefreshCw,
  Search,
  X as XIcon,
  Plus,
  XCircle,
  Sparkles,
  ShieldCheck
} from "lucide-react";
import { useEffect, useState, useMemo, useCallback } from "react";
import {
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Area,
  AreaChart,
  Legend
} from "recharts";
import AdminNavbar from "./AdminNavbar";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const API_URL = "https://spaceapi.iryax.com";
const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    totalCabins: 0,
    totalBookings: 0,
    totalUsers: 0,
    totalPayments: 0,
    totalCabinRevenue: 0,
    bookingRevenue: 0,
    confirmedPaidCount: 0,
    recentBookings: [],
    bookingChartData: [],
    recentCabins: [],
    recentUsers: []
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [paymentStatus, setPaymentStatus] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const adminString = localStorage.getItem("admin");
  const adminUser = adminString ? JSON.parse(adminString) : { name: "Admin" };

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return "₹0";
    return `₹${Number(amount).toLocaleString('en-IN')}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getImageUrl = (img) => {
    if (!img) return PLACEHOLDER_IMAGE;
    if (img.startsWith("http")) return img;
    const cleanPath = img.replace(/\\/g, "/").replace(/^\/+/, "");
    return `${API_URL}/${cleanPath}`;
  };

  const fetchDashboard = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);
    try {
      const res = await axios.get(`${API_URL}/api/admin/dashboard`);

      if (res.data.success) {
        setDashboardData({
          totalCabins: res.data.data.totalCabins || 0,
          totalBookings: res.data.data.totalBookings || 0,
          totalUsers: res.data.data.totalUsers || 0,
          totalPayments: res.data.data.totalPayments || 0,
          totalCabinRevenue: res.data.data.totalCabinRevenue || 0,
          bookingRevenue: res.data.data.bookingRevenue || 0,
          confirmedPaidCount: res.data.data.confirmedPaidCount || 0,
          recentBookings: res.data.data.recentBookings || [],
          bookingChartData: res.data.data.bookingChartData || [],
          recentCabins: res.data.data.recentCabins || [],
          recentUsers: res.data.data.recentUsers || []
        });
      } else {
        setError(res.data.error || "Failed to fetch dashboard data");
      }
    } catch (err) {
      console.error("Dashboard error:", err);
      setError("Failed to fetch dashboard data. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedStatus("all");
    setPaymentStatus("all");
    setDateFrom("");
    setDateTo("");
  }, []);

  const isFilterActive = searchTerm || selectedStatus !== "all" || paymentStatus !== "all" || dateFrom || dateTo;

  // Filtered recent bookings
  const filteredBookings = useMemo(() => {
    let list = [...(dashboardData.recentBookings || [])];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      list = list.filter(b => {
        const name = (b.name || "").toLowerCase();
        const cabin = (b.cabinName || "").toLowerCase();
        const mobile = (b.mobile || "").toLowerCase();
        return name.includes(term) || cabin.includes(term) || mobile.includes(term);
      });
    }

    if (selectedStatus !== "all") {
      list = list.filter(b => (b.status || "").toLowerCase() === selectedStatus.toLowerCase());
    }

    if (paymentStatus !== "all") {
      list = list.filter(b => (b.paymentStatus || "").toLowerCase() === paymentStatus.toLowerCase());
    }

    if (dateFrom) {
      const from = new Date(dateFrom);
      list = list.filter(b => b.createdAt && new Date(b.createdAt) >= from);
    }

    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      list = list.filter(b => b.createdAt && new Date(b.createdAt) <= to);
    }

    return list;
  }, [dashboardData.recentBookings, searchTerm, selectedStatus, paymentStatus, dateFrom, dateTo]);

  // Filtered cabins
  const filteredCabins = useMemo(() => {
    let list = [...(dashboardData.recentCabins || [])];
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      list = list.filter(c => {
        const name = (c.name || "").toLowerCase();
        const addr = (c.address || "").toLowerCase();
        const cabinType = (c.cabin || "").toLowerCase();
        return name.includes(term) || addr.includes(term) || cabinType.includes(term);
      });
    }
    return list;
  }, [dashboardData.recentCabins, searchTerm]);

  // Filtered users
  const filteredUsers = useMemo(() => {
    let list = [...(dashboardData.recentUsers || [])];
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      list = list.filter(u => {
        const name = (u.name || "").toLowerCase();
        const email = (u.email || "").toLowerCase();
        const mobile = (u.mobile || "").toLowerCase();
        const role = (u.role || "").toLowerCase();
        return name.includes(term) || email.includes(term) || mobile.includes(term) || role.includes(term);
      });
    }
    return list;
  }, [dashboardData.recentUsers, searchTerm]);

  const ChartTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-xl shadow-xl border border-gray-100 text-xs min-w-[140px]">
          <p className="font-bold text-gray-900 mb-1 border-b border-gray-100 pb-1 flex items-center justify-between">
            <span>{data.month}</span>
            <span className="text-[10px] text-gray-400 font-normal">Analytics</span>
          </p>
          <div className="space-y-1 mt-1.5">
            {payload.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-1.5" style={{ color: item.color }}>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}:
                </span>
                <span className="font-bold text-gray-800">{item.value}</span>
              </div>
            ))}
          </div>
          {data.cabinNames && data.cabinNames.length > 0 && (
            <div className="mt-2 pt-2 border-t border-gray-100">
              <p className="text-[10px] text-gray-400 font-semibold mb-1">Spaces:</p>
              <div className="space-y-0.5 max-h-24 overflow-y-auto">
                {data.cabinNames.map((name, idx) => (
                  <p key={idx} className="text-[10px] text-gray-600 truncate">• {name}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const getStatusBadge = (status, payStatus) => {
    const s = (status || "").toLowerCase();
    const p = (payStatus || "").toLowerCase();

    if (s === 'confirmed' && p === 'paid') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle size={11} /> Completed
        </span>
      );
    }
    if (s === 'confirmed') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
          <Clock size={11} /> Confirmed
        </span>
      );
    }
    if (s === 'cancelled' || s === 'rejected') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-lg bg-red-50 text-red-700 border border-red-200">
          <XCircle size={11} /> Cancelled
        </span>
      );
    }
    if (s === 'active') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">
          <Clock size={11} /> Active
        </span>
      );
    }
    if (s === 'completed') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle size={11} /> Completed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
        <Clock size={11} /> Pending
      </span>
    );
  };

  const getCabinStatus = (cabin) => {
    if (cabin && cabin.isActive === true) {
      return { 
        status: 'Active', 
        badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
      };
    }
    return { 
      status: 'Inactive', 
      badgeClass: 'bg-gray-100 text-gray-600 border border-gray-200' 
    };
  };

  const getRoleBadge = (role) => {
    const roleMap = {
      'doctor': { label: 'Doctor', color: 'bg-purple-50 text-purple-700 border border-purple-200' },
      'admin': { label: 'Admin', color: 'bg-amber-50 text-amber-700 border border-amber-200' },
      'user': { label: 'User', color: 'bg-blue-50 text-blue-700 border border-blue-200' }
    };
    return roleMap[role?.toLowerCase()] || roleMap.user;
  };

  const getStatusUserBadge = (status) => {
    const statusMap = {
      'active': { label: 'Active', color: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
      'approved': { label: 'Approved', color: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
      'pending': { label: 'Pending', color: 'bg-yellow-50 text-yellow-700 border border-yellow-200' },
      'rejected': { label: 'Rejected', color: 'bg-red-50 text-red-700 border border-red-200' }
    };
    return statusMap[status?.toLowerCase()] || statusMap.pending;
  };

  // Loading state
  if (loading) {
    return (
      <div className="admin-dash">
        <AdminNavbar />
        <div className="admin-dash__loading">
          <div className="admin-dash__spinner" />
          <p className="admin-dash__loading-text">Loading admin dashboard analytics...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="admin-dash">
        <AdminNavbar />
        <div className="admin-dash__error">
          <XCircle size={48} className="text-red-500" />
          <p className="admin-dash__error-title">Failed to load dashboard</p>
          <p className="admin-dash__error-message">{error}</p>
          <button
            onClick={() => fetchDashboard()}
            className="admin-dash__btn admin-dash__btn--primary"
          >
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      </div>
    );
  }

  const {
    totalCabins,
    totalBookings,
    totalUsers,
    totalPayments,
    totalCabinRevenue,
    bookingRevenue,
    confirmedPaidCount,
    bookingChartData
  } = dashboardData;

  // 7 KPI Stat Cards - styled identically to Owner Dashboard
  const statsCards = [
    {
      label: "Total Cabins",
      value: totalCabins,
      meta: "all registered workspaces",
      icon: Home,
      color: "emerald",
      onClick: () => navigate("/adminspaces")
    },
    {
      label: "Total Bookings",
      value: totalBookings,
      meta: "all reservations made",
      icon: Ticket,
      color: "indigo",
      onClick: () => navigate("/allbookings")
    },
    {
      label: "Total Users",
      value: totalUsers,
      meta: "registered members",
      icon: Users,
      color: "rose",
      onClick: () => navigate("/allusers")
    },
    {
      label: "Total Payments",
      value: totalPayments,
      meta: "cabin order transactions",
      icon: CreditCard,
      color: "cyan",
      onClick: () => navigate("/cabinpayments")
    },
    {
      label: "Completed",
      value: confirmedPaidCount,
      meta: "confirmed & paid",
      icon: CheckCircle,
      color: "purple",
      onClick: () => navigate("/allbookings")
    },
    {
      label: "Cabin Revenue",
      value: formatCurrency(totalCabinRevenue),
      meta: "from space registrations",
      icon: Wallet,
      color: "orange",
      onClick: () => navigate("/space-revenue")
    },
    {
      label: "Booking Revenue",
      value: formatCurrency(bookingRevenue),
      meta: "from confirmed bookings",
      icon: IndianRupee,
      color: "amber",
      onClick: () => navigate("/booking-revenue")
    }
  ];

  const currentDateFormatted = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric"
  });

  return (
    <div className="admin-dash">
      <AdminNavbar />

      <main className="pt-20 px-3 sm:px-4 md:px-6 lg:px-8 max-w-full mx-auto pb-16">
        {/* Header - Matching Owner Dashboard */}
        <div className="admin-dash__header">
          <div>
            <h1 className="admin-dash__greeting">
              Admin <span>Dashboard</span>
            </h1>
            <p className="admin-dash__subtitle">
              Welcome back, <span className="font-semibold text-gray-700">{adminUser?.name || "Administrator"}</span> • System overview & real-time analytics
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-2.5">
            <div className="admin-dash__date-pill">
              <Calendar size={14} />
              <span>{currentDateFormatted}</span>
            </div>

            <button
              onClick={() => fetchDashboard(true)}
              className="admin-dash__btn hover:border-indigo-300"
              title="Refresh dashboard data"
              disabled={refreshing}
            >
              <RefreshCw size={14} className={refreshing ? "animate-spin text-indigo-600" : "text-gray-500"} />
              <span className="text-xs font-medium">{refreshing ? "Refreshing..." : "Refresh"}</span>
            </button>

            <button
              onClick={() => navigate("/adminaddcabin")}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 bg-[length:200%_100%] text-white hover:bg-[position:100%_0] transition-all duration-500 shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-300 transform hover:scale-105 active:scale-95"
            >
              <Plus size={14} /> Add Space
            </button>
          </div>
        </div>

        {/* Stats Cards - Responsive 7-card grid matching Owner Dashboard */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 md:gap-4 mb-6">
          {statsCards.map((stat, index) => (
            <div
              key={index}
              className="admin-dash__stat cursor-pointer hover:scale-105 transition-transform duration-200"
              onClick={stat.onClick}
              title={stat.onClick ? "Click to view" : undefined}
            >
              <div className="admin-dash__stat-top">
                <span className="admin-dash__stat-label">
                  {stat.label}
                </span>
                <div className={`admin-dash__stat-icon admin-dash__stat-icon--${stat.color}`}>
                  <stat.icon size={15} />
                </div>
              </div>
              <div className="admin-dash__stat-value truncate" title={String(stat.value)}>
                {stat.value}
              </div>
              <div className="admin-dash__stat-meta truncate">
                {stat.meta}
              </div>
            </div>
          ))}
        </div>

        {/* Charts & Quick Activity Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-6">
          {/* Left Column (7 cols): Booking Trends Curve Chart */}
          <div className="lg:col-span-7 admin-dash__card flex flex-col">
            <div className="admin-dash__card-header">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-md shadow-indigo-200">
                  <TrendingUp size={18} className="text-white" />
                </div>
                <div>
                  <h3 className="admin-dash__card-title">Booking Trends</h3>
                  <p className="admin-dash__card-desc">Monthly booking hours, reservations & cabins registered</p>
                </div>
              </div>
              <span className="admin-dash__badge admin-dash__badge--info">
                {bookingChartData?.length || 0} Months
              </span>
            </div>

            <div className="admin-dash__card-body flex-1 p-3">
              {bookingChartData && Array.isArray(bookingChartData) && bookingChartData.some(d => (d.hours || 0) > 0 || (d.bookings || 0) > 0 || (d.cabins || 0) > 0) ? (
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={bookingChartData} margin={{ top: 15, right: 15, left: -15, bottom: 5 }}>
                      <defs>
                        <linearGradient id="adminColorHours" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02}/>
                        </linearGradient>
                        <linearGradient id="adminColorBookings" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.35}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.02}/>
                        </linearGradient>
                        <linearGradient id="adminColorCabins" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.35}/>
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.02}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }}
                        interval={0}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748b', fontSize: 11 }}
                      />
                      <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#cbd5e1', strokeDasharray: '3 3' }} />
                      <Legend 
                        verticalAlign="top" 
                        height={32}
                        iconType="circle"
                        iconSize={8}
                        wrapperStyle={{ fontSize: '11px', color: '#475467', paddingBottom: '8px' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="hours" 
                        stroke="#6366f1" 
                        strokeWidth={2.5}
                        fill="url(#adminColorHours)"
                        dot={{ r: 3.5, fill: "#6366f1", strokeWidth: 1.5, stroke: "#fff" }}
                        activeDot={{ r: 6, fill: "#6366f1" }}
                        name="Total Hours"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="bookings" 
                        stroke="#10b981" 
                        strokeWidth={2.5}
                        fill="url(#adminColorBookings)"
                        dot={{ r: 3.5, fill: "#10b981", strokeWidth: 1.5, stroke: "#fff" }}
                        activeDot={{ r: 6, fill: "#10b981" }}
                        name="Bookings"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="cabins" 
                        stroke="#f59e0b" 
                        strokeWidth={2.5}
                        fill="url(#adminColorCabins)"
                        dot={{ r: 3.5, fill: "#f59e0b", strokeWidth: 1.5, stroke: "#fff" }}
                        activeDot={{ r: 6, fill: "#f59e0b" }}
                        name="Cabins"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-2">
                  <div className="p-3 bg-gray-50 rounded-2xl">
                    <Calendar size={36} className="text-gray-300" />
                  </div>
                  <p className="text-xs font-semibold text-gray-500">No chart data available yet</p>
                  <p className="text-[10px] text-gray-400">Monthly booking hours and stats will appear here</p>
                </div>
              )}

              {/* Chart footer metrics matching ownerdashboard */}
              <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-3 border-t border-gray-100 text-xs text-gray-600 bg-gray-50/60 rounded-xl px-4 py-2.5">
                <span className="flex items-center gap-2 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                  Total Hours: <span className="text-indigo-600 font-bold">{bookingChartData?.reduce((sum, d) => sum + (d.hours || 0), 0) || 0} hrs</span>
                </span>
                <span className="flex items-center gap-2 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  Total Bookings: <span className="text-emerald-600 font-bold">{bookingChartData?.reduce((sum, d) => sum + (d.bookings || 0), 0) || 0}</span>
                </span>
                <span className="flex items-center gap-2 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  Active Months: <span className="text-amber-600 font-bold">{bookingChartData?.filter(d => (d.bookings || 0) > 0 || (d.hours || 0) > 0).length || 0}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Recent Bookings Quick Stream */}
          <div className="lg:col-span-5 admin-dash__card flex flex-col">
            <div className="admin-dash__card-header">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-md shadow-blue-200">
                  <Calendar size={18} className="text-white" />
                </div>
                <div>
                  <h3 className="admin-dash__card-title">Recent Activity</h3>
                  <p className="admin-dash__card-desc">Latest workspace bookings</p>
                </div>
              </div>
              <button
                onClick={() => navigate("/allbookings")}
                className="user-dash__card-link text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                View All <ArrowUpRight size={13} />
              </button>
            </div>

            <div className="admin-dash__card-body p-0 flex-1 overflow-y-auto max-h-[360px]">
              {(dashboardData.recentBookings || []).length === 0 ? (
                <div className="flex flex-col items-center justify-center h-56 text-gray-400 gap-2">
                  <Ticket size={32} className="opacity-20" />
                  <p className="text-xs font-medium">No recent bookings</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {(dashboardData.recentBookings || []).slice(0, 6).map((b) => (
                    <div
                      key={b._id}
                      onClick={() => navigate("/allbookings")}
                      className="p-3 sm:px-4 flex items-center justify-between gap-3 hover:bg-gray-50/80 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-sm flex-shrink-0">
                          {b.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 text-xs truncate group-hover:text-indigo-600 transition-colors">
                            {b.name || "User"}
                          </p>
                          <p className="text-[11px] text-gray-500 truncate">
                            {b.cabinName || "Workspace"}
                          </p>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0 flex flex-col items-end gap-1">
                        <span className="text-xs font-bold text-indigo-600">
                          {b.amount > 0 ? formatCurrency(b.amount) : "—"}
                        </span>
                        {getStatusBadge(b.status, b.paymentStatus)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Filter Section - Matching Owner Dashboard filter bar */}
        <div className="admin-dash__filters">
          <div className="admin-dash__filter-group">
            <div className="flex-1 min-w-[200px] relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by customer, space, phone, address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="admin-dash__filter-input w-full pl-9"
              />
            </div>

            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="admin-dash__filter-input"
              title="From date"
            />

            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="admin-dash__filter-input"
              title="To date"
            />

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="admin-dash__filter-select"
            >
              <option value="all">All Booking Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="admin-dash__filter-select"
            >
              <option value="all">All Payment Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>

            {isFilterActive && (
              <button
                onClick={clearFilters}
                className="admin-dash__btn hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                title="Clear filters"
              >
                <XIcon size={15} /> Clear
              </button>
            )}
          </div>

          <div className="mt-2 text-[11px] text-gray-500 font-medium flex items-center justify-between">
            <span>Showing {filteredBookings.length} of {(dashboardData.recentBookings || []).length} bookings</span>
            {isFilterActive && (
              <span className="text-indigo-600 font-semibold">• Filters Active</span>
            )}
          </div>
        </div>

        {/* Section: All Recent Bookings Table */}
        <div className="admin-dash__card mb-6">
          <div className="admin-dash__card-header">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl shadow-md shadow-indigo-200">
                <Ticket size={18} className="text-white" />
              </div>
              <div>
                <h3 className="admin-dash__card-title">All Recent Bookings</h3>
                <p className="admin-dash__card-desc">Reservations across all workspaces</p>
              </div>
              <span className="admin-dash__badge admin-dash__badge--info">
                {filteredBookings.length}
              </span>
            </div>
            <button
              onClick={() => navigate("/allbookings")}
              className="user-dash__card-link"
            >
              View All <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="admin-dash__card-body p-0 overflow-x-auto">
            {filteredBookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-14 text-gray-400">
                <div className="p-3 bg-gray-100 rounded-2xl">
                  <Ticket size={40} className="text-gray-300" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-600">No bookings found</p>
                  <p className="text-xs text-gray-400 mt-0.5">Try adjusting your search or filters</p>
                </div>
              </div>
            ) : (
              <table className="admin-dash__table">
                <thead>
                  <tr>
                    <th className="w-14 text-center">#</th>
                    <th>Customer</th>
                    <th>Cabin / Space</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.slice(0, 7).map((b, idx) => (
                    <tr
                      key={b._id}
                      className="group cursor-pointer hover:bg-indigo-50/40 transition-colors"
                      onClick={() => navigate("/allbookings")}
                    >
                      <td className="text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-xs font-bold text-gray-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                          {idx + 1}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-sm flex-shrink-0">
                            {b.name?.charAt(0)?.toUpperCase() || "U"}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-xs sm:text-sm group-hover:text-indigo-600 transition-colors">
                              {b.name || "—"}
                            </p>
                            <p className="text-[11px] text-gray-400 flex items-center gap-1">
                              <Phone size={10} /> {b.mobile || "—"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <p className="font-semibold text-gray-800 text-xs sm:text-sm">{b.cabinName || "—"}</p>
                          {b.address && (
                            <p className="text-[10px] text-gray-400 flex items-center gap-1 truncate max-w-[180px]">
                              <MapPin size={10} /> {b.address}
                            </p>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className="text-xs font-medium text-gray-600">{formatDate(b.createdAt)}</span>
                      </td>
                      <td>
                        <span className="text-sm font-bold text-indigo-600">
                          {b.amount > 0 ? formatCurrency(b.amount) : "—"}
                        </span>
                      </td>
                      <td>
                        {getStatusBadge(b.status, b.paymentStatus)}
                      </td>
                      <td className="text-center">
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate("/allbookings"); }}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 bg-[length:200%_100%] text-white hover:bg-[position:100%_0] transition-all duration-500 shadow-sm shadow-indigo-300/50 hover:shadow-md hover:shadow-indigo-400/60 transform hover:scale-105 active:scale-95"
                        >
                          <Eye size={12} /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Section: Latest Cabins Table */}
        <div className="admin-dash__card mb-6">
          <div className="admin-dash__card-header">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl shadow-md shadow-emerald-200">
                <Home size={18} className="text-white" />
              </div>
              <div>
                <h3 className="admin-dash__card-title">Latest Cabins</h3>
                <p className="admin-dash__card-desc">Registered workspaces on IRYAX</p>
              </div>
              <span className="admin-dash__badge admin-dash__badge--success">
                {filteredCabins.length}
              </span>
            </div>
            <button
              onClick={() => navigate("/adminspaces")}
              className="user-dash__card-link"
            >
              View All <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="admin-dash__card-body p-0 overflow-x-auto">
            {filteredCabins.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-14 text-gray-400">
                <div className="p-3 bg-gray-100 rounded-2xl">
                  <Home size={40} className="text-gray-300" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-600">No cabins found</p>
                  <p className="text-xs text-gray-400 mt-0.5">No spaces registered yet</p>
                </div>
              </div>
            ) : (
              <table className="admin-dash__table">
                <thead>
                  <tr>
                    <th className="w-14 text-center">#</th>
                    <th>Cabin / Space</th>
                    <th>Location / Address</th>
                    <th>Price / Hr</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCabins.slice(0, 6).map((cabin, idx) => {
                    const status = getCabinStatus(cabin);
                    return (
                      <tr
                        key={cabin._id}
                        className="group cursor-pointer hover:bg-emerald-50/40 transition-colors"
                        onClick={() => navigate(`/cabin/${cabin._id}`)}
                      >
                        <td className="text-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-xs font-bold text-gray-500 group-hover:bg-emerald-100 group-hover:text-emerald-700 transition-colors">
                            {idx + 1}
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-11 h-11 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shadow-sm">
                              <img
                                src={cabin.images && cabin.images[0] ? getImageUrl(cabin.images[0]) : PLACEHOLDER_IMAGE}
                                alt={cabin.name || "Cabin"}
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }}
                              />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 text-xs sm:text-sm group-hover:text-emerald-700 transition-colors">
                                {cabin.name || "—"}
                              </p>
                              <p className="text-[11px] text-gray-400">{cabin.cabin || "Space"}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center gap-1.5 text-xs text-gray-600">
                            <MapPin size={12} className="text-gray-400 flex-shrink-0" />
                            <span className="truncate max-w-[220px]">{cabin.address || "—"}</span>
                          </div>
                        </td>
                        <td>
                          <div className="flex items-baseline gap-1">
                            <span className="text-sm font-bold text-gray-900">₹{cabin.price || 0}</span>
                            <span className="text-[10px] text-gray-400 font-medium">/hr</span>
                          </div>
                        </td>
                        <td>
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-lg ${status.badgeClass}`}>
                            {status.status === 'Active' && <CheckCircle size={10} />}
                            {status.status}
                          </span>
                        </td>
                        <td>
                          <span className="text-xs text-gray-500">{formatDate(cabin.createdAt)}</span>
                        </td>
                        <td className="text-center">
                          <button
                            onClick={(e) => { e.stopPropagation(); navigate(`/cabin/${cabin._id}`); }}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 bg-[length:200%_100%] text-white hover:bg-[position:100%_0] transition-all duration-500 shadow-sm shadow-emerald-300/50 hover:shadow-md hover:shadow-emerald-400/60 transform hover:scale-105 active:scale-95"
                          >
                            <Eye size={12} /> View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Section: Latest Users Table */}
        <div className="admin-dash__card">
          <div className="admin-dash__card-header">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl shadow-md shadow-rose-200">
                <Users size={18} className="text-white" />
              </div>
              <div>
                <h3 className="admin-dash__card-title">Latest Users</h3>
                <p className="admin-dash__card-desc">Registered platform members & clients</p>
              </div>
              <span className="admin-dash__badge admin-dash__badge--danger">
                {filteredUsers.length}
              </span>
            </div>
            <button
              onClick={() => navigate("/allusers")}
              className="user-dash__card-link"
            >
              View All <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="admin-dash__card-body p-0 overflow-x-auto">
            {filteredUsers.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-14 text-gray-400">
                <div className="p-3 bg-gray-100 rounded-2xl">
                  <Users size={40} className="text-gray-300" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-600">No users found</p>
                  <p className="text-xs text-gray-400 mt-0.5">No registered users matching filters</p>
                </div>
              </div>
            ) : (
              <table className="admin-dash__table">
                <thead>
                  <tr>
                    <th className="w-14 text-center">#</th>
                    <th>User</th>
                    <th>Contact</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.slice(0, 6).map((user, idx) => {
                    const role = getRoleBadge(user.role);
                    const status = getStatusUserBadge(user.status);
                    return (
                      <tr
                        key={user._id}
                        className="group cursor-pointer hover:bg-rose-50/40 transition-colors"
                        onClick={() => navigate("/allusers")}
                      >
                        <td className="text-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-xs font-bold text-gray-500 group-hover:bg-rose-100 group-hover:text-rose-700 transition-colors">
                            {idx + 1}
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white font-bold text-xs shadow-sm flex-shrink-0">
                              {user.name?.charAt(0)?.toUpperCase() || "U"}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 text-xs sm:text-sm group-hover:text-rose-700 transition-colors">
                                {user.name || "—"}
                              </p>
                              <p className="text-[11px] text-gray-400 flex items-center gap-1">
                                <Mail size={10} /> {user.email || "—"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <p className="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                            <Phone size={12} className="text-gray-400" />
                            {user.mobile || "—"}
                          </p>
                        </td>
                        <td>
                          <span className={`inline-flex items-center px-2.5 py-1 text-[10px] font-bold rounded-lg ${role.color}`}>
                            {role.label}
                          </span>
                        </td>
                        <td>
                          <span className={`inline-flex items-center px-2.5 py-1 text-[10px] font-bold rounded-lg ${status.color}`}>
                            {status.label}
                          </span>
                        </td>
                        <td>
                          <span className="text-xs text-gray-500">{formatDate(user.createdAt)}</span>
                        </td>
                        <td className="text-center">
                          <button
                            onClick={(e) => { e.stopPropagation(); navigate("/allusers"); }}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 bg-[length:200%_100%] text-white hover:bg-[position:100%_0] transition-all duration-500 shadow-sm shadow-rose-300/50 hover:shadow-md hover:shadow-rose-400/60 transform hover:scale-105 active:scale-95"
                          >
                            <Eye size={12} /> View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;