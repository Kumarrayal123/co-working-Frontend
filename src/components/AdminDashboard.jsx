// AdminDashboard.jsx - Complete with Latest Tables
import axios from "axios";
import {
  Building,
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
  MapPin
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import AdminNavbar from "./AdminNavbar";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const API_URL = "http://62.72.29.27:5003";

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
  const [error, setError] = useState(null);

  const adminString = localStorage.getItem("admin");
  const adminUser = adminString ? JSON.parse(adminString) : { name: "Admin" };

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const fetchDashboard = async () => {
    setLoading(true);
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
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const ChartTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="admin-dash__tooltip">
          <p className="admin-dash__tooltip-title">{payload[0].payload.month}</p>
          <p className="admin-dash__tooltip-value">Bookings: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  const getStatusBadge = (status, paymentStatus) => {
    if (status === 'confirmed' && paymentStatus === 'paid') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
          <CheckCircle size={10} /> Completed
        </span>
      );
    }
    if (status === 'confirmed') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
          <Clock size={10} /> Confirmed
        </span>
      );
    }
    if (status === 'cancelled') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-700">
          ✕ Cancelled
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-yellow-100 text-yellow-700">
        <Clock size={10} /> Pending
      </span>
    );
  };

  const getCabinStatus = (cabin) => {
    if (cabin && cabin.isActive === true) {
      return { status: 'Active', color: 'bg-emerald-100 text-emerald-700' };
    }
    return { status: 'Inactive', color: 'bg-gray-100 text-gray-600' };
  };

  const getRoleBadge = (role) => {
    const roleMap = {
      'doctor': { label: 'Doctor', color: 'bg-purple-100 text-purple-700' },
      'admin': { label: 'Admin', color: 'bg-amber-100 text-amber-700' },
      'user': { label: 'User', color: 'bg-blue-100 text-blue-700' }
    };
    return roleMap[role] || roleMap.user;
  };

  const getStatusUserBadge = (status) => {
    const statusMap = {
      'active': { label: 'Active', color: 'bg-emerald-100 text-emerald-700' },
      'approved': { label: 'Approved', color: 'bg-emerald-100 text-emerald-700' },
      'pending': { label: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
      'rejected': { label: 'Rejected', color: 'bg-red-100 text-red-700' }
    };
    return statusMap[status] || statusMap.pending;
  };

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

  if (error) {
    return (
      <div className="admin-dash" style={{ backgroundColor: '#ffffff' }}>
        <AdminNavbar />
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-gray-400">
          <p className="text-lg font-medium text-red-500">{error}</p>
          <button
            onClick={fetchDashboard}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 transition-colors"
          >
            Try Again
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
    recentBookings,
    bookingChartData,
    recentCabins,
    recentUsers
  } = dashboardData;

  const statsCards = [
    {
      label: "Total Cabins",
      value: totalCabins,
      meta: "all workspaces",
      icon: Building,
      color: "emerald",
      onClick: () => navigate("/adminspaces")
    },
    {
      label: "Total Bookings",
      value: totalBookings,
      meta: "all reservations",
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
      meta: "transactions",
      icon: CreditCard,
      color: "cyan",
      onClick: () => navigate("/cabinpayments")
    },
    {
      label: "Completed Bookings",
      value: confirmedPaidCount,
      meta: "confirmed & paid",
      icon: CheckCircle,
      color: "purple",
      onClick: () => navigate("/allbookings")
    },
    {
      label: "Cabin Revenue",
      value: formatCurrency(totalCabinRevenue),
      meta: "from cabin creation",
      icon: Wallet,
      color: "orange"
    },
    {
      label: "Booking Revenue",
      value: formatCurrency(bookingRevenue),
      meta: "from confirmed bookings",
      icon: IndianRupee,
      color: "amber"
    }
  ];

  return (
    <div className="admin-dash" style={{ backgroundColor: '#ffffff' }}>
      <AdminNavbar />

      <div className="pt-24 px-3 sm:px-4 md:px-6 lg:px-8 max-w-full mx-auto pb-16">
        {/* Header */}
        <div className="admin-dash__header">
          <div>
            <h1 className="admin-dash__greeting">
              Admin <span>Dashboard</span>
            </h1>
            <p className="admin-dash__subtitle">
              Welcome back, <span className="font-bold">{adminUser.name}</span>! Track your workspace performance.
            </p>
          </div>
          <div className="admin-dash__date-pill">
            <Calendar size={16} />
            <span>
              {new Date().toLocaleDateString("en-US", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Stats Cards - 7 cards */}
        <div className="admin-dash__stats">
          {statsCards.map((stat, index) => (
            <div
              key={index}
              className="admin-dash__stat"
              onClick={stat.onClick}
              style={{ cursor: stat.onClick ? 'pointer' : 'default' }}
            >
              <div className="admin-dash__stat-top">
                <span className="admin-dash__stat-label">{stat.label}</span>
                <div className={`admin-dash__stat-icon admin-dash__stat-icon--${stat.color}`}>
                  <stat.icon size={18} />
                </div>
              </div>
              <div className="admin-dash__stat-value">{stat.value}</div>
              <div className="admin-dash__stat-meta">{stat.meta}</div>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="admin-dash__charts-grid">
          {/* Booking Trends Chart */}
          <div className="admin-dash__card admin-dash__chart-wrap" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}>
            <div className="admin-dash__card-header py-3 px-4" style={{ borderBottom: '1px solid #e5e7eb' }}>
              <div>
                <h3 className="admin-dash__card-title">Booking Trends</h3>
                <p className="admin-dash__card-desc text-[10px] text-gray-400">Monthly booking statistics</p>
              </div>
            </div>
            <div className="admin-dash__card-body flex-1 p-3">
              {bookingChartData && Array.isArray(bookingChartData) && bookingChartData.some(d => d.bookings > 0) ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bookingChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748b', fontSize: 11 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748b', fontSize: 11 }}
                    />
                    <Tooltip content={<ChartTooltip />} cursor={{ fill: '#f8fafc' }} />
                    <Bar dataKey="bookings" radius={[4, 4, 0, 0]} barSize={24} fill="#6366f1" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-32 text-gray-400">
                  <Calendar size={32} className="text-gray-300 mb-2" />
                  <p className="text-sm">No booking data available</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="admin-dash__card admin-dash__chart-wrap" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}>
            <div className="admin-dash__card-header py-3 px-4" style={{ borderBottom: '1px solid #e5e7eb' }}>
              <div>
                <h3 className="admin-dash__card-title">Recent Activity</h3>
                <p className="admin-dash__card-desc text-[10px] text-gray-400">Latest workspace reservations</p>
              </div>
            </div>
            <div className="admin-dash__card-body flex-1 p-3">
              {recentBookings && Array.isArray(recentBookings) && recentBookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-gray-400">
                  <Calendar size={32} className="text-gray-300 mb-2" />
                  <p className="text-sm">No recent activity</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {(recentBookings || []).slice(0, 5).map((b) => (
                    <div
                      key={b._id}
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-transparent hover:border-gray-200 cursor-pointer"
                      onClick={() => navigate("/allbookings")}
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm">
                        {b.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {b.name || "User"}
                          </p>
                          {getStatusBadge(b.status, b.paymentStatus)}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5 truncate">
                          <span className="font-medium text-gray-700">{b.cabinName}</span>
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          {b.amount > 0 && (
                            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                              {formatCurrency(b.amount)}
                            </span>
                          )}
                          <span className="text-[10px] text-gray-400 font-medium">
                            {formatDate(b.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Latest Bookings Table */}
        <div className="admin-dash__card mt-6" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}>
          <div className="admin-dash__card-header flex flex-wrap items-center justify-between gap-3 py-3 px-4" style={{ borderBottom: '1px solid #e5e7eb' }}>
            <div className="flex items-center gap-3">
              <h3 className="admin-dash__card-title">Latest Bookings</h3>
              <span className="px-2.5 py-0.5 text-xs font-bold text-indigo-700 bg-indigo-100 rounded-full">
                {(recentBookings || []).length}
              </span>
            </div>
            <button
              onClick={() => navigate("/allbookings")}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium hover:bg-indigo-100 transition-colors border border-indigo-200"
            >
              View All <ArrowUpRight size={12} />
            </button>
          </div>
          <div className="admin-dash__card-body p-0 overflow-x-auto">
            {(recentBookings || []).length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-12 text-gray-400">
                <Ticket size={36} className="opacity-20" />
                <p className="text-sm font-medium">No bookings found</p>
              </div>
            ) : (
              <table className="w-full min-w-[800px] text-left">
                <thead>
                  <tr className="border-b border-gray-100" style={{ backgroundColor: '#f9fafb' }}>
                    <th className="p-4 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">#</th>
                    <th className="p-4 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Customer</th>
                    <th className="p-4 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Cabin</th>
                    <th className="p-4 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Date</th>
                    <th className="p-4 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Amount</th>
                    <th className="p-4 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {(recentBookings || []).slice(0, 5).map((b, idx) => (
                    <tr key={b._id} className="transition-colors hover:bg-gray-50/80 cursor-pointer" onClick={() => navigate("/allbookings")}>
                      <td className="p-4">
                        <span className="text-sm font-semibold text-gray-400">#{idx + 1}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                            {b.name?.charAt(0)?.toUpperCase() || "U"}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{b.name || "—"}</p>
                            <p className="text-[10px] text-gray-400">{b.mobile || "—"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-medium text-gray-800 text-sm">{b.cabinName}</p>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-gray-600">{formatDate(b.createdAt)}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm font-bold text-indigo-600">{formatCurrency(b.amount)}</span>
                      </td>
                      <td className="p-4">
                        {getStatusBadge(b.status, b.paymentStatus)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Latest Cabins Table */}
        <div className="admin-dash__card mt-4" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}>
          <div className="admin-dash__card-header flex flex-wrap items-center justify-between gap-3 py-3 px-4" style={{ borderBottom: '1px solid #e5e7eb' }}>
            <div className="flex items-center gap-3">
              <h3 className="admin-dash__card-title">Latest Cabins</h3>
              <span className="px-2.5 py-0.5 text-xs font-bold text-emerald-700 bg-emerald-100 rounded-full">
                {(recentCabins || []).length}
              </span>
            </div>
            <button
              onClick={() => navigate("/adminspaces")}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-medium hover:bg-emerald-100 transition-colors border border-emerald-200"
            >
              View All <ArrowUpRight size={12} />
            </button>
          </div>
          <div className="admin-dash__card-body p-0 overflow-x-auto">
            {(recentCabins || []).length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-12 text-gray-400">
                <Home size={36} className="opacity-20" />
                <p className="text-sm font-medium">No cabins found</p>
              </div>
            ) : (
              <table className="w-full min-w-[800px] text-left">
                <thead>
                  <tr className="border-b border-gray-100" style={{ backgroundColor: '#f9fafb' }}>
                    <th className="p-4 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">#</th>
                    <th className="p-4 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Cabin</th>
                    <th className="p-4 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Address</th>
                    <th className="p-4 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Price</th>
                    <th className="p-4 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Status</th>
                    <th className="p-4 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {(recentCabins || []).slice(0, 5).map((cabin, idx) => {
                    const status = getCabinStatus(cabin);
                    return (
                      <tr key={cabin._id} className="transition-colors hover:bg-gray-50/80 cursor-pointer" onClick={() => navigate("/adminspaces")}>
                        <td className="p-4">
                          <span className="text-sm font-semibold text-gray-400">#{idx + 1}</span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2.5">
                            <div className="flex-shrink-0 w-8 h-8 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                              {cabin.images && cabin.images[0] ? (
                                <img
                                  src={`${API_URL}/${cabin.images[0].replace(/\\/g, "/")}`}
                                  alt={cabin.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000"; }}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                  <Home size={16} className="text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">{cabin.name || "—"}</p>
                              <p className="text-[10px] text-gray-400">{cabin.cabin || "—"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-gray-600 flex items-center gap-1">
                            <MapPin size={12} className="text-gray-400" />
                            {cabin.address || "—"}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm font-bold text-gray-900">₹{cabin.price || 0}</span>
                          <span className="text-[10px] text-gray-400">/hr</span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${status.color}`}>
                            {status.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-gray-500">{formatDate(cabin.createdAt)}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Latest Users Table */}
        <div className="admin-dash__card mt-4" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}>
          <div className="admin-dash__card-header flex flex-wrap items-center justify-between gap-3 py-3 px-4" style={{ borderBottom: '1px solid #e5e7eb' }}>
            <div className="flex items-center gap-3">
              <h3 className="admin-dash__card-title">Latest Users</h3>
              <span className="px-2.5 py-0.5 text-xs font-bold text-rose-700 bg-rose-100 rounded-full">
                {(recentUsers || []).length}
              </span>
            </div>
            <button
              onClick={() => navigate("/allusers")}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-700 rounded-lg text-xs font-medium hover:bg-rose-100 transition-colors border border-rose-200"
            >
              View All <ArrowUpRight size={12} />
            </button>
          </div>
          <div className="admin-dash__card-body p-0 overflow-x-auto">
            {(recentUsers || []).length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-12 text-gray-400">
                <Users size={36} className="opacity-20" />
                <p className="text-sm font-medium">No users found</p>
              </div>
            ) : (
              <table className="w-full min-w-[800px] text-left">
                <thead>
                  <tr className="border-b border-gray-100" style={{ backgroundColor: '#f9fafb' }}>
                    <th className="p-4 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">#</th>
                    <th className="p-4 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">User</th>
                    <th className="p-4 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Contact</th>
                    <th className="p-4 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Role</th>
                    <th className="p-4 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Status</th>
                    <th className="p-4 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {(recentUsers || []).slice(0, 5).map((user, idx) => {
                    const role = getRoleBadge(user.role);
                    const status = getStatusUserBadge(user.status);
                    return (
                      <tr key={user._id} className="transition-colors hover:bg-gray-50/80 cursor-pointer" onClick={() => navigate("/allusers")}>
                        <td className="p-4">
                          <span className="text-sm font-semibold text-gray-400">#{idx + 1}</span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                              {user.name?.charAt(0)?.toUpperCase() || "U"}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">{user.name || "—"}</p>
                              <p className="text-[10px] text-gray-400 flex items-center gap-1">
                                <Mail size={10} className="text-gray-400" />
                                {user.email || "—"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="text-sm text-gray-700 flex items-center gap-1.5">
                            <Phone size={14} className="text-gray-400" />
                            {user.mobile || "—"}
                          </p>
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${role.color}`}>
                            {role.label}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${status.color}`}>
                            {status.label}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-gray-500">{formatDate(user.createdAt)}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;