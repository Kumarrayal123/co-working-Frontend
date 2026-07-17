import { Calendar, Building2, Home, Plus, LogOut, Wallet, IndianRupee, TrendingUp, TrendingDown, Clock, CheckCircle, XCircle, BarChart3, PieChart, Activity, DollarSign, Users, ArrowUpRight, ArrowDownRight, RefreshCw, Sparkles, Zap, Star, Gift, Filter, ChevronDown } from "lucide-react";
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
  const [activePieSlice, setActivePieSlice] = useState(null);
  
  // Filter States
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [availableMonths, setAvailableMonths] = useState([]);
  const [originalBookings, setOriginalBookings] = useState([]);
  
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
        const bookings = data.data.recentBookings || [];
        const statusDist = {
          pending: 0,
          confirmed: 0,
          active: 0,
          completed: 0,
          cancelled: 0
        };
        
        bookings.forEach(booking => {
          const status = booking.status?.toLowerCase() || 'pending';
          if (status === 'confirmed' && booking.paymentStatus === 'paid') {
            statusDist.completed += 1;
          } else if (status === 'confirmed') {
            statusDist.confirmed += 1;
          } else if (status === 'cancelled') {
            statusDist.cancelled += 1;
          } else if (status === 'active') {
            statusDist.active += 1;
          } else {
            statusDist.pending += 1;
          }
        });
        
        const today = new Date().toISOString().split('T')[0];
        bookings.forEach(booking => {
          if (booking.status === 'confirmed' && 
              booking.startDate <= today && 
              booking.endDate >= today) {
            if (statusDist.confirmed > 0) {
              statusDist.confirmed -= 1;
              statusDist.active += 1;
            }
          }
        });

        setDashboardData({
          ...data.data,
          statusDistribution: statusDist
        });
        
        // Store original bookings
        setOriginalBookings(bookings);
        setFilteredBookings(bookings);
        
        // Generate available months
        generateAvailableMonths(bookings);
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

  // Generate available months from bookings
  const generateAvailableMonths = (bookings) => {
    const months = new Set();
    bookings.forEach(booking => {
      if (booking.createdAt) {
        const date = new Date(booking.createdAt);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        months.add(monthKey);
      }
    });
    
    // If no bookings, add current month
    if (months.size === 0) {
      const now = new Date();
      const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      months.add(currentMonth);
    }
    
    setAvailableMonths(Array.from(months).sort());
  };

  // Apply filters
  const applyFilters = () => {
    let filtered = [...originalBookings];
    
    // Filter by month
    if (selectedMonth !== "all") {
      const [year, month] = selectedMonth.split('-');
      filtered = filtered.filter(booking => {
        if (!booking.createdAt) return false;
        const date = new Date(booking.createdAt);
        return date.getFullYear() === parseInt(year) && 
               (date.getMonth() + 1) === parseInt(month);
      });
    }
    
    // Filter by status
    if (selectedStatus !== "all") {
      filtered = filtered.filter(booking => {
        if (selectedStatus === 'completed') {
          return booking.status === 'confirmed' && booking.paymentStatus === 'paid';
        } else if (selectedStatus === 'active') {
          const today = new Date().toISOString().split('T')[0];
          return booking.status === 'confirmed' && 
                 booking.startDate <= today && 
                 booking.endDate >= today;
        } else {
          return booking.status === selectedStatus;
        }
      });
    }
    
    setFilteredBookings(filtered);
    
    // Update chart data based on filtered bookings
    updateChartData(filtered);
  };

  // Update chart data based on filtered bookings
  const updateChartData = (filtered) => {
    if (filtered.length === 0) {
      // Show empty chart
      setDashboardData(prev => ({
        ...prev,
        bookingChartData: []
      }));
      return;
    }
    
    // Group filtered bookings by month
    const monthMap = {};
    filtered.forEach(booking => {
      if (!booking.createdAt) return;
      const date = new Date(booking.createdAt);
      const monthName = date.toLocaleString('default', { month: 'short' });
      
      if (!monthMap[monthName]) {
        monthMap[monthName] = { month: monthName, bookings: 0 };
      }
      monthMap[monthName].bookings += 1;
    });
    
    const chartData = Object.values(monthMap);
    setDashboardData(prev => ({
      ...prev,
      bookingChartData: chartData
    }));
  };

  // Reset filters
  const clearFilters = () => {
    setSelectedMonth("all");
    setSelectedStatus("all");
    setFilteredBookings(originalBookings);
    
    // Reset chart data to original
    if (originalBookings.length > 0) {
      const monthMap = {};
      originalBookings.forEach(booking => {
        if (!booking.createdAt) return;
        const date = new Date(booking.createdAt);
        const monthName = date.toLocaleString('default', { month: 'short' });
        
        if (!monthMap[monthName]) {
          monthMap[monthName] = { month: monthName, bookings: 0 };
        }
        monthMap[monthName].bookings += 1;
      });
      
      const chartData = Object.values(monthMap);
      setDashboardData(prev => ({
        ...prev,
        bookingChartData: chartData
      }));
    }
  };

  // Handle month filter change
  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  // Handle status filter change
  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
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
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium bg-gradient-to-r from-emerald-400 to-green-500 text-white shadow-sm shadow-emerald-200">
          <CheckCircle size={10} /> Completed
        </span>
      );
    }
    if (status === 'confirmed') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium bg-gradient-to-r from-blue-400 to-indigo-500 text-white shadow-sm shadow-blue-200">
          <Clock size={10} /> Confirmed
        </span>
      );
    }
    if (status === 'cancelled') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium bg-gradient-to-r from-rose-400 to-red-500 text-white shadow-sm shadow-rose-200">
          <XCircle size={10} /> Cancelled
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-sm shadow-amber-200">
        <Clock size={10} /> Pending
      </span>
    );
  };

  // ─── PIE CHART COMPONENT ───
  const PieChartComponent = ({ data }) => {
    const total = Object.values(data).reduce((a, b) => a + b, 0) || 1;
    
    const segments = [
      { key: 'pending', label: 'Pending', color: '#f59e0b', bg: 'bg-amber-100', text: 'text-amber-700', gradient: 'from-amber-400 to-orange-500' },
      { key: 'confirmed', label: 'Confirmed', color: '#3b82f6', bg: 'bg-blue-100', text: 'text-blue-700', gradient: 'from-blue-400 to-indigo-500' },
      { key: 'active', label: 'Active', color: '#8b5cf6', bg: 'bg-violet-100', text: 'text-violet-700', gradient: 'from-violet-400 to-purple-500' },
      { key: 'completed', label: 'Completed', color: '#10b981', bg: 'bg-emerald-100', text: 'text-emerald-700', gradient: 'from-emerald-400 to-green-500' },
      { key: 'cancelled', label: 'Cancelled', color: '#ef4444', bg: 'bg-red-100', text: 'text-red-700', gradient: 'from-rose-400 to-red-500' }
    ];

    const activeSegments = segments.filter(s => data[s.key] > 0);
    
    if (activeSegments.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-48">
          <div className="w-32 h-32 rounded-full bg-gradient-to-r from-slate-100 to-slate-200 flex items-center justify-center shadow-inner">
            <span className="text-slate-400 text-xs font-medium">No Bookings</span>
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
                  strokeWidth="1"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center bg-white/80 backdrop-blur-sm rounded-full w-16 h-16 flex flex-col items-center justify-center shadow-lg">
              <p className="text-lg font-bold text-slate-900">{total}</p>
              <p className="text-[6px] text-slate-400 uppercase tracking-wider">Total</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {activeSegments.map((seg) => (
            <div 
              key={seg.key} 
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-medium transition-all bg-gradient-to-r ${seg.gradient} text-white shadow-sm ${
                activePieSlice === seg.key ? 'ring-2 ring-slate-400 scale-105 shadow-lg' : ''
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
      description: "Browse available coworking spaces",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Calendar,
      label: "My Bookings",
      path: "/mybookings",
      description: "View your booking history",
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: Home,
      label: "My Cabins",
      path: "/mycabin",
      description: "Manage your listed properties",
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: Wallet,
      label: "My Wallet",
      path: "/userwallet",
      description: "View wallet & transactions",
      color: "from-amber-500 to-orange-500"
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

  const statsCards = [
    {
      label: "My Bookings",
      value: totalBookings,
      meta: `${monthlyStats?.bookingsThisMonth || 0} this month`,
      icon: Calendar,
      gradient: "from-indigo-500 to-purple-600",
      iconBg: "bg-indigo-100 text-indigo-600",
      onClick: () => navigate("/mybookings")
    },
    {
      label: "My Cabins",
      value: myCabinsCount,
      meta: `${totalCabins} total spaces available`,
      icon: Home,
      gradient: "from-emerald-500 to-teal-600",
      iconBg: "bg-emerald-100 text-emerald-600",
      onClick: () => navigate("/mycabin")
    },
    {
      label: "Cabin Bookings",
      value: cabinBookingsCount,
      meta: `₹${cabinRevenue.toLocaleString('en-IN')} revenue`,
      icon: Building2,
      gradient: "from-rose-500 to-pink-600",
      iconBg: "bg-rose-100 text-rose-600",
      onClick: () => navigate("/cabin-bookings")
    },
    {
      label: "Total Spent",
      value: formatCurrency(totalSpent),
      meta: `₹${monthlyStats?.spentThisMonth || 0} this month`,
      icon: IndianRupee,
      gradient: "from-amber-500 to-orange-600",
      iconBg: "bg-amber-100 text-amber-600"
    },
    {
      label: "Wallet Balance",
      value: formatCurrency(wallet.balance || 0),
      meta: `${wallet.transactions || 0} transactions`,
      icon: Wallet,
      gradient: "from-cyan-500 to-blue-600",
      iconBg: "bg-cyan-100 text-cyan-600",
      onClick: () => navigate("/userwallet")
    }
  ];

  return (
    <div className="admin-dash">
      <UsersNavbar />

      <main className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16">
        {/* Header with Gradient */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 mb-8 shadow-xl shadow-indigo-200">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -ml-16 -mb-16"></div>
          
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <Sparkles size={24} className="text-yellow-300 animate-pulse" />
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  Welcome back, <span className="text-yellow-200">{user?.name?.split(' ')[0] || 'User'}</span>!
                </h1>
              </div>
              <p className="text-indigo-100 mt-1 flex items-center gap-2">
                <Zap size={14} />
                Manage your workspace bookings and properties from one place.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchUserDashboard}
                className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors text-white"
                title="Refresh Dashboard"
              >
                <RefreshCw size={18} />
              </button>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl text-white text-sm flex items-center gap-2">
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
        </div>

        {/* ─── STATS GRID ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {statsCards.map((stat, index) => (
            <div
              key={index}
              className="relative overflow-hidden bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-xl transition-all cursor-pointer hover:-translate-y-1 group"
              onClick={stat.onClick}
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-indigo-50 to-transparent rounded-full -mr-8 -mt-8"></div>
              <div className="flex items-center justify-between">
                <div className={`p-2.5 rounded-xl ${stat.iconBg} group-hover:scale-110 transition-transform`}>
                  <stat.icon size={18} />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900 mt-3">{stat.value}</p>
              <p className="text-xs text-slate-500 mt-1">{stat.meta}</p>
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient} group-hover:h-1.5 transition-all`}></div>
            </div>
          ))}
        </div>

        {/* ─── FILTERS SECTION ─── */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <Filter size={16} className="text-slate-400" />
            <span className="text-xs font-medium text-slate-600">Filters:</span>
            
            {/* Month Filter */}
            <select
              value={selectedMonth}
              onChange={handleMonthChange}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Months</option>
              {availableMonths.map(month => {
                const [year, monthNum] = month.split('-');
                const date = new Date(parseInt(year), parseInt(monthNum) - 1);
                return (
                  <option key={month} value={month}>
                    {date.toLocaleString('default', { month: 'long', year: 'numeric' })}
                  </option>
                );
              })}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={handleStatusChange}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Apply Button */}
            <button
              onClick={applyFilters}
              className="px-4 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition-colors flex items-center gap-2 shadow-sm shadow-indigo-200"
            >
              <Filter size={14} />
              Apply Filters
            </button>

            {(selectedMonth !== "all" || selectedStatus !== "all") && (
              <button
                onClick={clearFilters}
                className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors flex items-center gap-1"
              >
                <XCircle size={14} />
                Clear
              </button>
            )}

            <span className="text-xs text-slate-500 ml-auto">
              Showing {filteredBookings.length} of {originalBookings.length} bookings
            </span>
          </div>
          
          {/* Active filters display */}
          {(selectedMonth !== "all" || selectedStatus !== "all") && (
            <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-100">
              <span className="text-[10px] text-slate-500 font-medium">Active Filters:</span>
              {selectedMonth !== "all" && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[10px] font-medium">
                  Month: {new Date(parseInt(selectedMonth.split('-')[0]), parseInt(selectedMonth.split('-')[1]) - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
                  <button onClick={() => { setSelectedMonth("all"); applyFilters(); }} className="hover:text-indigo-900">
                    <XCircle size={10} />
                  </button>
                </span>
              )}
              {selectedStatus !== "all" && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-[10px] font-medium">
                  Status: {selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)}
                  <button onClick={() => { setSelectedStatus("all"); applyFilters(); }} className="hover:text-purple-900">
                    <XCircle size={10} />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* ─── CHARTS SECTION ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Chart 1: Monthly Bookings */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <BarChart3 size={16} className="text-indigo-600" />
                  Monthly Bookings
                </h3>
                <p className="text-xs text-slate-400">
                  {selectedMonth !== "all" || selectedStatus !== "all" ? 'Filtered view' : 'All bookings'}
                </p>
              </div>
              <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                <span className="px-2.5 py-1 text-[10px] font-medium bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded shadow-sm">
                  {filteredBookings.length} Bookings
                </span>
              </div>
            </div>
            <div className="h-40 flex items-end justify-between gap-1 px-1">
              {bookingChartData && bookingChartData.length > 0 ? (
                bookingChartData.map((item, idx) => {
                  const maxVal = Math.max(...bookingChartData.map(d => d.bookings), 1);
                  const height = maxVal > 0 ? (item.bookings / maxVal) * 100 : 0;
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1.5">
                      <div className="w-full flex justify-center items-end h-24">
                        <div 
                          className="w-8 rounded-t-lg bg-gradient-to-t from-indigo-500 to-indigo-400 hover:from-indigo-600 hover:to-indigo-500 transition-all duration-500"
                          style={{ height: `${Math.max(height, 4)}%` }}
                        >
                          <div className="opacity-0 hover:opacity-100 transition-opacity absolute -mt-6 bg-slate-800 text-white text-[8px] px-1.5 py-0.5 rounded whitespace-nowrap">
                            {item.bookings} bookings
                          </div>
                        </div>
                      </div>
                      <span className="text-[9px] text-slate-400 font-medium truncate max-w-[40px]">{item.month}</span>
                    </div>
                  );
                })
              ) : (
                <div className="w-full text-center text-slate-400 text-sm">No data available for selected filters</div>
              )}
            </div>
            <div className="flex justify-between mt-3 text-[10px] text-slate-400 bg-slate-50 rounded-xl px-3 py-2">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                Total: {bookingChartData?.reduce((sum, d) => sum + d.bookings, 0) || 0} bookings
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                {bookingChartData?.filter(d => d.bookings > 0).length || 0} months with bookings
              </span>
            </div>
          </div>

          {/* Chart 2: Pie Chart */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <PieChart size={16} className="text-indigo-600" />
                  Booking Status
                </h3>
                <p className="text-xs text-slate-400">Distribution by status</p>
              </div>
              <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-full">
                <Activity size={12} />
                Active
              </span>
            </div>
            <PieChartComponent data={statusDistribution || { pending: 0, confirmed: 0, active: 0, completed: 0, cancelled: 0 }} />
          </div>
        </div>

        {/* ─── QUICK OVERVIEW ROW ─── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-xl p-3 text-center border border-indigo-200/50 hover:shadow-md transition-all hover:scale-105">
            <p className="text-[10px] font-medium text-indigo-600 uppercase tracking-wider">Total Bookings</p>
            <p className="text-2xl font-bold text-indigo-700 mt-1">{totalBookings}</p>
            <p className="text-[9px] text-indigo-400 mt-0.5">+{monthlyStats?.bookingsThisMonth || 0} this month</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl p-3 text-center border border-emerald-200/50 hover:shadow-md transition-all hover:scale-105">
            <p className="text-[10px] font-medium text-emerald-600 uppercase tracking-wider">Total Spent</p>
            <p className="text-2xl font-bold text-emerald-700 mt-1">{formatCurrency(totalSpent)}</p>
            <p className="text-[9px] text-emerald-400 mt-0.5">+{formatCurrency(monthlyStats?.spentThisMonth || 0)} this month</p>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl p-3 text-center border border-amber-200/50 hover:shadow-md transition-all hover:scale-105">
            <p className="text-[10px] font-medium text-amber-600 uppercase tracking-wider">My Cabins</p>
            <p className="text-2xl font-bold text-amber-700 mt-1">{myCabinsCount}</p>
            <p className="text-[9px] text-amber-400 mt-0.5">{totalCabins} total spaces</p>
          </div>
          <div className="bg-gradient-to-br from-cyan-50 to-cyan-100/50 rounded-xl p-3 text-center border border-cyan-200/50 hover:shadow-md transition-all hover:scale-105">
            <p className="text-[10px] font-medium text-cyan-600 uppercase tracking-wider">Wallet</p>
            <p className="text-2xl font-bold text-cyan-700 mt-1">{formatCurrency(wallet.balance || 0)}</p>
            <p className="text-[9px] text-cyan-400 mt-0.5">{wallet.transactions || 0} transactions</p>
          </div>
        </div>

        {/* ─── QUICK ACTIONS & RECENT BOOKINGS ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Zap size={16} className="text-amber-500" />
                  Quick Actions
                </h3>
                <p className="text-xs text-slate-400">Common shortcuts and workspace tools</p>
              </div>
              <Gift size={20} className="text-amber-400" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="group bg-slate-50 rounded-xl p-3 border border-slate-100 hover:shadow-lg hover:bg-white transition-all text-left flex items-start gap-3"
                >
                  <div className={`p-2.5 rounded-xl bg-gradient-to-r ${item.color} text-white group-hover:scale-110 transition-transform`}>
                    <item.icon size={16} />
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
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Clock size={16} className="text-indigo-600" />
                  Recent Bookings
                </h3>
                <p className="text-xs text-slate-400">
                  {selectedMonth !== "all" || selectedStatus !== "all" ? 'Filtered results' : 'Your latest reservations'}
                </p>
              </div>
              <button
                onClick={() => navigate("/mybookings")}
                className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100"
              >
                View All <ArrowUpRight size={12} />
              </button>
            </div>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {filteredBookings.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <Calendar size={32} className="mx-auto text-slate-300 mb-2" />
                  <p className="text-sm">No bookings found</p>
                  {(selectedMonth !== "all" || selectedStatus !== "all") && (
                    <button
                      onClick={clearFilters}
                      className="text-xs text-indigo-600 hover:text-indigo-800 mt-2 font-medium"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              ) : (
                filteredBookings.slice(0, 5).map((b) => (
                  <div key={b._id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-indigo-50 hover:to-transparent transition-all border border-transparent hover:border-indigo-100">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-sm shadow-indigo-200 shrink-0">
                      {b.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {b.cabinName}
                        </p>
                        {getStatusBadge(b.status, b.paymentStatus)}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {b.name} • {formatCurrency(b.amount)}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {b.createdAt ? new Date(b.createdAt).toLocaleDateString("en-US", {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        }) : 'N/A'}
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
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-3 text-center border border-slate-200">
            <p className="text-[9px] text-slate-400 uppercase tracking-wider">Total Cabins</p>
            <p className="text-lg font-bold text-slate-800 mt-1">{totalCabins}</p>
          </div>
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-3 text-center border border-slate-200">
            <p className="text-[9px] text-slate-400 uppercase tracking-wider">Cabin Bookings</p>
            <p className="text-lg font-bold text-slate-800 mt-1">{cabinBookingsCount}</p>
          </div>
          <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl p-3 text-center border border-emerald-200">
            <p className="text-[9px] text-emerald-500 uppercase tracking-wider">Cabin Revenue</p>
            <p className="text-lg font-bold text-emerald-600 mt-1">{formatCurrency(cabinRevenue)}</p>
          </div>
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-3 text-center border border-slate-200">
            <p className="text-[9px] text-slate-400 uppercase tracking-wider">Wallet Withdrawals</p>
            <p className="text-lg font-bold text-slate-800 mt-1">{wallet.withdrawals || 0}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;