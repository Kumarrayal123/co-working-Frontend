import { Calendar, Building2, Home, Plus, LogOut, Wallet, IndianRupee, TrendingUp, TrendingDown, Clock, CheckCircle, XCircle, BarChart3, PieChart, Activity, DollarSign, Users, ArrowUpRight, ArrowDownRight, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UsersNavbar from "./UsersNavbar";
import "./Dashboard.css";

const API_URL = "http://62.72.29.27:5003";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    totalBookings: 0,
    totalSpent: 0,
    myCabinsCount: 0,
    cabinBookingsCount: 0,
    cabinRevenue: 0,
    totalCabins: 0,
    wallet: {
      balance: 0,
      totalEarned: 0,
      transactions: 0,
      withdrawals: 0
    },
    recentBookings: [],
    recentCabinBookings: [],
    bookingChartData: [],
    monthlyStats: {
      bookingsThisMonth: 0,
      spentThisMonth: 0,
      earningsThisMonth: 0,
      growth: 0
    },
    statusDistribution: {
      pending: 0,
      confirmed: 0,
      active: 0,
      completed: 0,
      cancelled: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeChart, setActiveChart] = useState("bookings");
  const [activePieSlice, setActivePieSlice] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchUserDashboard();
  }, []);

  const fetchUserDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");
      
      const res = await fetch(`${API_URL}/api/bookings/user-dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'user': userData || ''
        }
      });
      
      const data = await res.json();

      if (data.success) {
        setDashboardData(data.data);
      } else {
        setError(data.error || "Failed to fetch dashboard data");
      }
    } catch (err) {
      console.error("Dashboard error:", err);
      setError("Failed to fetch dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    navigate("/login");
  };

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`;
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
          <XCircle size={10} /> Cancelled
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-yellow-100 text-yellow-700">
        <Clock size={10} /> Pending
      </span>
    );
  };

  // ─── SIMPLE CHART BARS ───
  const ChartBar = ({ data, maxValue, label, value, color = "indigo" }) => {
    const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
    const colors = {
      indigo: "bg-indigo-500 hover:bg-indigo-600",
      emerald: "bg-emerald-500 hover:bg-emerald-600",
      rose: "bg-rose-500 hover:bg-rose-600",
      amber: "bg-amber-500 hover:bg-amber-600",
      cyan: "bg-cyan-500 hover:bg-cyan-600",
      violet: "bg-violet-500 hover:bg-violet-600"
    };

    return (
      <div className="flex-1 flex flex-col items-center gap-1.5">
        <div className="w-full flex justify-center items-end h-24">
          <div 
            className={`w-8 rounded-t-lg transition-all duration-500 ${colors[color] || colors.indigo}`}
            style={{ height: `${Math.max(height, 4)}%` }}
          >
            <div className="opacity-0 hover:opacity-100 transition-opacity absolute -mt-6 bg-slate-800 text-white text-[8px] px-1.5 py-0.5 rounded">
              {formatCurrency(value)}
            </div>
          </div>
        </div>
        <span className="text-[9px] text-slate-400 font-medium truncate max-w-[40px]">{label}</span>
      </div>
    );
  };

  // ─── PIE CHART COMPONENT ───
  const PieChartComponent = ({ data }) => {
    const total = Object.values(data).reduce((a, b) => a + b, 0) || 1;
    
    const segments = [
      { key: 'pending', label: 'Pending', color: '#f59e0b', bg: 'bg-amber-100', text: 'text-amber-700' },
      { key: 'confirmed', label: 'Confirmed', color: '#3b82f6', bg: 'bg-blue-100', text: 'text-blue-700' },
      { key: 'active', label: 'Active', color: '#8b5cf6', bg: 'bg-violet-100', text: 'text-violet-700' },
      { key: 'completed', label: 'Completed', color: '#10b981', bg: 'bg-emerald-100', text: 'text-emerald-700' },
      { key: 'cancelled', label: 'Cancelled', color: '#ef4444', bg: 'bg-red-100', text: 'text-red-700' }
    ];

    // Filter out zero values
    const activeSegments = segments.filter(s => data[s.key] > 0);
    
    // If no data, show empty state
    if (activeSegments.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-48">
          <div className="w-32 h-32 rounded-full bg-slate-100 flex items-center justify-center">
            <span className="text-slate-400 text-xs">No Data</span>
          </div>
        </div>
      );
    }

    let startAngle = -90;
    const getPath = (percentage) => {
      const angle = (percentage / 100) * 360;
      const endAngle = startAngle + angle;
      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;
      const x1 = 50 + 35 * Math.cos(startRad);
      const y1 = 50 + 35 * Math.sin(startRad);
      const x2 = 50 + 35 * Math.cos(endRad);
      const y2 = 50 + 35 * Math.sin(endRad);
      const largeArc = angle > 180 ? 1 : 0;
      
      startAngle = endAngle;
      
      return `M 50 50 L ${x1} ${y1} A 35 35 0 ${largeArc} 1 ${x2} ${y2} Z`;
    };

    return (
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="relative w-48 h-48">
          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
            {activeSegments.map((seg, idx) => {
              const percentage = (data[seg.key] / total) * 100;
              if (percentage < 0.1) return null;
              return (
                <path
                  key={idx}
                  d={getPath(percentage)}
                  fill={seg.color}
                  className="transition-all duration-500 cursor-pointer hover:opacity-80"
                  onMouseEnter={() => setActivePieSlice(seg.key)}
                  onMouseLeave={() => setActivePieSlice(null)}
                  stroke="#fff"
                  strokeWidth="0.5"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-lg font-bold text-slate-900">{total}</p>
              <p className="text-[8px] text-slate-400 uppercase tracking-wider">Total</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {activeSegments.map((seg) => (
            <div 
              key={seg.key} 
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium transition-all ${seg.bg} ${seg.text} ${
                activePieSlice === seg.key ? 'ring-2 ring-slate-400 scale-105' : ''
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: seg.color }}></span>
              {seg.label}: {data[seg.key]} ({Math.round((data[seg.key] / total) * 100)}%)
            </div>
          ))}
        </div>
      </div>
    );
  };

  const navItems = [
    {
      icon: Building2,
      label: "All Spaces",
      path: "/spaces",
      description: "Browse available coworking spaces"
    },
    {
      icon: Calendar,
      label: "My Bookings",
      path: "/mybookings",
      description: "View your booking history"
    },
    {
      icon: Home,
      label: "My Cabins",
      path: "/mycabin",
      description: "Manage your listed properties"
    },
    {
      icon: Wallet,
      label: "My Wallet",
      path: "/userwallet",
      description: "View wallet & transactions"
    }
  ];

  if (loading) {
    return (
      <div className="admin-dash">
        <UsersNavbar />
        <div className="admin-dash__loading">
          <div className="admin-dash__spinner" />
          <p className="admin-dash__loading-text">Loading dashboard analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dash">
        <UsersNavbar />
        <div className="admin-dash__error">
          <p className="admin-dash__error-title">Oops!</p>
          <p className="admin-dash__error-message">{error}</p>
        </div>
      </div>
    );
  }

  const {
    totalBookings,
    totalSpent,
    myCabinsCount,
    cabinBookingsCount,
    cabinRevenue,
    totalCabins,
    wallet,
    recentBookings,
    recentCabinBookings,
    bookingChartData,
    monthlyStats,
    statusDistribution
  } = dashboardData;

  // ─── CHART DATA ───
  const chartData = bookingChartData && bookingChartData.length > 0 ? bookingChartData : [
    { month: 'Jan', bookings: 4, amount: 1200 },
    { month: 'Feb', bookings: 7, amount: 2100 },
    { month: 'Mar', bookings: 3, amount: 900 },
    { month: 'Apr', bookings: 8, amount: 2400 },
    { month: 'May', bookings: 5, amount: 1500 },
    { month: 'Jun', bookings: 12, amount: 3600 }
  ];

  const maxBookings = Math.max(...chartData.map(d => d.bookings), 1);
  const maxAmount = Math.max(...chartData.map(d => d.amount), 1);

  // ─── STATS CARDS ───
  const statsCards = [
    {
      label: "My Bookings",
      value: totalBookings,
      meta: `${monthlyStats?.bookingsThisMonth || 0} this month`,
      icon: Calendar,
      color: "indigo",
      trend: "+12%",
      trendUp: true,
      onClick: () => navigate("/mybookings")
    },
    {
      label: "My Cabins",
      value: myCabinsCount,
      meta: `${totalCabins} total spaces available`,
      icon: Home,
      color: "emerald",
      trend: "+2",
      trendUp: true,
      onClick: () => navigate("/mycabin")
    },
    {
      label: "Cabin Bookings",
      value: cabinBookingsCount,
      meta: `₹${cabinRevenue.toLocaleString('en-IN')} revenue`,
      icon: Building2,
      color: "rose",
      trend: "+18%",
      trendUp: true,
      onClick: () => navigate("/cabin-bookings")
    },
    {
      label: "Total Spent",
      value: formatCurrency(totalSpent),
      meta: `₹${monthlyStats?.spentThisMonth || 0} this month`,
      icon: IndianRupee,
      color: "amber",
      trend: "-5%",
      trendUp: false
    },
    {
      label: "Wallet Balance",
      value: formatCurrency(wallet.balance || 0),
      meta: `${wallet.transactions || 0} transactions`,
      icon: Wallet,
      color: "cyan",
      trend: "+₹${wallet.totalEarned || 0}",
      trendUp: true,
      onClick: () => navigate("/userwallet")
    }
  ];

  return (
    <div className="admin-dash">
      <UsersNavbar />

      <main className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16">
        {/* Header */}
        <div className="admin-dash__header">
          <div>
            <h1 className="admin-dash__greeting">
              Welcome back, <span>{user?.name?.split(' ')[0] || 'User'}</span>!
            </h1>
            <p className="admin-dash__subtitle">
              Manage your workspace bookings and properties from one place.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchUserDashboard}
              className="p-2 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
              title="Refresh Dashboard"
            >
              <RefreshCw size={16} className="text-slate-600" />
            </button>
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
        </div>

        {/* ─── STATS GRID ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {statsCards.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-indigo-300"
              onClick={stat.onClick}
            >
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-xl ${stat.color === 'indigo' ? 'bg-indigo-50 text-indigo-600' : 
                  stat.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                  stat.color === 'rose' ? 'bg-rose-50 text-rose-600' :
                  stat.color === 'amber' ? 'bg-amber-50 text-amber-600' :
                  'bg-cyan-50 text-cyan-600'}`}>
                  <stat.icon size={18} />
                </div>
                {stat.trend && (
                  <div className={`flex items-center gap-0.5 text-[10px] font-semibold ${stat.trendUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {stat.trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {stat.trend}
                  </div>
                )}
              </div>
              <p className="text-2xl font-bold text-slate-900 mt-3">{stat.value}</p>
              <p className="text-xs text-slate-500 mt-1">{stat.meta}</p>
            </div>
          ))}
        </div>

        {/* ─── CHARTS SECTION ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Chart 1: Monthly Bookings (2 columns) */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <BarChart3 size={16} className="text-indigo-600" />
                  Monthly Bookings
                </h3>
                <p className="text-xs text-slate-400">Booking activity over last 6 months</p>
              </div>
              <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveChart('bookings')}
                  className={`px-2.5 py-1 text-[10px] font-medium rounded transition ${activeChart === 'bookings' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Bookings
                </button>
                <button
                  onClick={() => setActiveChart('amount')}
                  className={`px-2.5 py-1 text-[10px] font-medium rounded transition ${activeChart === 'amount' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Amount
                </button>
              </div>
            </div>
            <div className="h-40 flex items-end justify-between gap-1 px-1">
              {chartData.map((item, idx) => (
                <ChartBar
                  key={idx}
                  data={item}
                  maxValue={activeChart === 'bookings' ? maxBookings : maxAmount}
                  value={activeChart === 'bookings' ? item.bookings : item.amount}
                  label={item.month}
                  color={activeChart === 'bookings' ? 'indigo' : 'emerald'}
                />
              ))}
            </div>
            <div className="flex justify-between mt-3 text-[10px] text-slate-400">
              <span>Total: {chartData.reduce((sum, d) => sum + d.bookings, 0)} bookings</span>
              <span>Total: {formatCurrency(chartData.reduce((sum, d) => sum + d.amount, 0))}</span>
            </div>
          </div>

          {/* Chart 2: Pie Chart (1 column) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <PieChart size={16} className="text-indigo-600" />
                  Booking Status
                </h3>
                <p className="text-xs text-slate-400">Distribution by status</p>
              </div>
              <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                <Activity size={12} />
                Active
              </span>
            </div>
            <PieChartComponent data={statusDistribution || { pending: 0, confirmed: 0, active: 0, completed: 0, cancelled: 0 }} />
          </div>
        </div>

        {/* ─── QUICK OVERVIEW ROW ─── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-indigo-50 rounded-xl p-3 text-center">
            <p className="text-[10px] font-medium text-indigo-600 uppercase tracking-wider">Total Bookings</p>
            <p className="text-2xl font-bold text-indigo-700 mt-1">{totalBookings}</p>
            <p className="text-[9px] text-indigo-400 mt-0.5">+{monthlyStats?.bookingsThisMonth || 0} this month</p>
          </div>
          <div className="bg-emerald-50 rounded-xl p-3 text-center">
            <p className="text-[10px] font-medium text-emerald-600 uppercase tracking-wider">Total Spent</p>
            <p className="text-2xl font-bold text-emerald-700 mt-1">{formatCurrency(totalSpent)}</p>
            <p className="text-[9px] text-emerald-400 mt-0.5">+{formatCurrency(monthlyStats?.spentThisMonth || 0)} this month</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-3 text-center">
            <p className="text-[10px] font-medium text-amber-600 uppercase tracking-wider">My Cabins</p>
            <p className="text-2xl font-bold text-amber-700 mt-1">{myCabinsCount}</p>
            <p className="text-[9px] text-amber-400 mt-0.5">{totalCabins} total spaces</p>
          </div>
          <div className="bg-cyan-50 rounded-xl p-3 text-center">
            <p className="text-[10px] font-medium text-cyan-600 uppercase tracking-wider">Wallet</p>
            <p className="text-2xl font-bold text-cyan-700 mt-1">{formatCurrency(wallet.balance || 0)}</p>
            <p className="text-[9px] text-cyan-400 mt-0.5">{wallet.transactions || 0} transactions</p>
          </div>
        </div>

        {/* ─── QUICK ACTIONS & RECENT BOOKINGS ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Quick Actions</h3>
                <p className="text-xs text-slate-400">Common shortcuts and workspace tools</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="group bg-slate-50 rounded-xl p-3 border border-slate-100 hover:shadow-md hover:bg-slate-100 transition-all text-left flex items-start gap-3"
                >
                  <div className="p-2 bg-white rounded-lg w-fit group-hover:bg-indigo-50 transition-colors shrink-0">
                    <item.icon className="text-slate-600 group-hover:text-indigo-600 transition-colors" size={16} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs group-hover:text-indigo-600 transition-colors">{item.label}</h4>
                    <p className="text-[9px] text-slate-500 mt-0.5">{item.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Bookings Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Clock size={16} className="text-indigo-600" />
                  Recent Bookings
                </h3>
                <p className="text-xs text-slate-400">Your latest reservations</p>
              </div>
              <button
                onClick={() => navigate("/mybookings")}
                className="text-xs text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
              >
                View All →
              </button>
            </div>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {recentBookings.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <Calendar size={32} className="mx-auto text-slate-300 mb-2" />
                  <p className="text-sm">No recent bookings</p>
                </div>
              ) : (
                recentBookings.map((b) => (
                  <div key={b._id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs shrink-0">
                      {b.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {b.cabinName}
                        </p>
                        {getStatusBadge(b.status, b.paymentStatus)}
                      </div>
                      <p className="text-xs text-slate-500">
                        {b.name} • {formatCurrency(b.amount)}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {new Date(b.createdAt).toLocaleDateString("en-US", {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ─── FOOTER STATS ─── */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-50 rounded-xl p-3 text-center">
            <p className="text-[9px] text-slate-400 uppercase tracking-wider">Total Cabins</p>
            <p className="text-lg font-bold text-slate-800">{totalCabins}</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 text-center">
            <p className="text-[9px] text-slate-400 uppercase tracking-wider">Cabin Bookings</p>
            <p className="text-lg font-bold text-slate-800">{cabinBookingsCount}</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 text-center">
            <p className="text-[9px] text-slate-400 uppercase tracking-wider">Cabin Revenue</p>
            <p className="text-lg font-bold text-emerald-600">{formatCurrency(cabinRevenue)}</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 text-center">
            <p className="text-[9px] text-slate-400 uppercase tracking-wider">Wallet Withdrawals</p>
            <p className="text-lg font-bold text-slate-800">{wallet.withdrawals || 0}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;