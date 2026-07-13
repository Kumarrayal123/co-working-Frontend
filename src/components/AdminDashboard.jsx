// AdminDashboard.jsx
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
  Wallet
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
    bookingChartData: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const adminString = localStorage.getItem("admin");
  const adminUser = adminString ? JSON.parse(adminString) : { name: "Admin" };

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_URL}/api/admin/dashboard`);

      if (res.data.success) {
        setDashboardData(res.data.data);
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
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-100 text-emerald-700">
          <CheckCircle size={10} /> Completed
        </span>
      );
    }
    if (status === 'confirmed') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-100 text-blue-700">
          <Clock size={10} /> Confirmed
        </span>
      );
    }
    if (status === 'cancelled') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-100 text-red-700">
          ✕ Cancelled
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-yellow-100 text-yellow-700">
        <Clock size={10} /> Pending
      </span>
    );
  };

  if (loading) {
    return (
      <div className="admin-dash">
        <AdminNavbar />
        <div className="admin-dash__loading">
          <div className="admin-dash__spinner" />
          <p className="admin-dash__loading-text">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dash">
        <AdminNavbar />
        <div className="admin-dash__error">
          <p className="admin-dash__error-title">Oops!</p>
          <p className="admin-dash__error-message">{error}</p>
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
    bookingChartData
  } = dashboardData;

  // Stats cards data - 7 cards now
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
    <div className="admin-dash">
      <AdminNavbar />

      <main className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16">
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

        {/* Stats Grid - 7 cards */}
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
          <div className="admin-dash__card admin-dash__chart-wrap">
            <div className="admin-dash__card-header">
              <div>
                <h3 className="admin-dash__card-title">Booking Trends</h3>
                <p className="admin-dash__card-desc">Monthly booking statistics</p>
              </div>
            </div>
            <div className="admin-dash__card-body flex-1">
              {bookingChartData.some(d => d.bookings > 0) ? (
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
                    <Bar dataKey="bookings" radius={[4, 4, 0, 0]} barSize={24} fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="admin-dash__empty-chart">
                  <Calendar size={32} className="text-slate-300" />
                  <p className="text-slate-400">No booking data available</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="admin-dash__card admin-dash__chart-wrap">
            <div className="admin-dash__card-header">
              <div>
                <h3 className="admin-dash__card-title">Recent Activity</h3>
                <p className="admin-dash__card-desc">Latest workspace reservations</p>
              </div>
            </div>
            <div className="admin-dash__card-body flex-1">
              {recentBookings.length === 0 ? (
                <div className="admin-dash__empty-chart">
                  <Calendar size={32} className="text-slate-300" />
                  <p className="text-slate-400">No recent activity</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentBookings.map((b) => (
                    <div
                      key={b._id}
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-all duration-200 border border-transparent hover:border-slate-100"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm">
                        {b.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold text-slate-900 truncate">
                            {b.name || "User"}
                          </p>
                          {getStatusBadge(b.status, b.paymentStatus)}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 truncate">
                          <span className="font-medium text-slate-700">{b.cabinName}</span>
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          {b.amount > 0 && (
                            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                              {formatCurrency(b.amount)}
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400 font-medium">
                            {new Date(b.createdAt).toLocaleDateString("en-US", {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
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
      </main>
    </div>
  );
};

export default AdminDashboard;