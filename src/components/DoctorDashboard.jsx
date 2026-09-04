// DoctorDashboard.jsx - With Profile Completion Circle - Cabin Bookings Chart with Hover Tooltip - FILTERS ONLY ON CHART with Custom Date Range
import axios from "axios";
import {
  Calendar,
  Building2,
  Home,
  Plus,
  Wallet,
  IndianRupee,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  Activity,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Eye,
  MapPin,
  Search,
  RefreshCw,
  Crown,
  Stethoscope,
  User,
  Award,
  Clock as ClockIcon,
  Calendar as CalendarIcon,
  BarChart3,
  DollarSign,
  Menu,
  X,
  ChevronDown,
  LogOut,
  FileText,
  Star,
  Loader2,
  Upload,
  Shield,
  Lock,
  Bath,
  Armchair,
  Wifi,
  ParkingCircle,
  Receipt,
  CreditCard,
  AlertCircle,
  Coffee,
  Dumbbell,
  Fan,
  Tv,
  Printer,
  Phone,
  Video,
  Play,
  FileVideo,
  Sun,
  Moon,
  Check,
  Crown as CrownIcon,
  AlertTriangle,
  ArrowRight,
  Edit,
  Mail,
  Phone as PhoneIcon
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DoctorNavbar from "./DoctorNavbar";
import "./UserDashboard.css";

const API_URL = "https://spaceapi.iryax.com";
const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000";

const ALL_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const DoctorDashboard = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  
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

  // Filter States - Only for Chart
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [availableMonths, setAvailableMonths] = useState([]);
  const [originalCabinBookings, setOriginalCabinBookings] = useState([]);
  const [filteredCabinBookings, setFilteredCabinBookings] = useState([]);
  
  // Cabin Bookings Chart Data with revenue per month
  const [cabinChartData, setCabinChartData] = useState([]);
  const [hoveredBar, setHoveredBar] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // My Bookings data for table
  const [myBookings, setMyBookings] = useState([]);
  const [myCabinBookings, setMyCabinBookings] = useState([]);

  // My Cabins data
  const [cabins, setCabins] = useState([]);
  const [cabinCount, setCabinCount] = useState(0);

  const navigate = useNavigate();

  const getUserId = () => {
    let userId = localStorage.getItem("userId");

    if (!userId) {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1]));
          userId = payload.userId || payload.id || payload._id;
          if (userId) {
            localStorage.setItem("userId", userId);
          }
        }
      } catch (err) {
        console.error("Error extracting userId from token:", err);
      }
    }

    return userId;
  };

  // Fetch profile for completion
  const fetchProfile = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(
        `${API_URL}/api/auth/profile/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success && res.data.user) {
        setProfile(res.data.user);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  useEffect(() => {
    const doctorData = localStorage.getItem("doctor");
    if (doctorData) {
      try {
        const parsed = JSON.parse(doctorData);
        setUser(parsed);
        if (parsed._id) {
          localStorage.setItem("userId", parsed._id);
        }
      } catch (e) {
        console.error("Error parsing doctor data:", e);
      }
    }

    const userId = getUserId();
    if (userId) {
      fetchUserDashboard(userId);
      fetchMyBookings(userId);
      fetchMyCabinBookings(userId);
      fetchCabins(userId);
      fetchProfile(userId);
    } else {
      toast.error("User ID not found. Please login again.");
      setLoading(false);
    }
  }, []);

  // ─── FETCH USER DASHBOARD ───
  const fetchUserDashboard = async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_URL}/api/bookings/user-dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'user': JSON.stringify({ _id: userId })
        }
      });

      const data = await res.json();

      if (data.success) {
        const bookings = data.data.recentBookings || [];
        const cabinBookings = data.data.recentCabinBookings || [];
        
        const statusDist = {
          pending: 0,
          confirmed: 0,
          active: 0,
          completed: 0,
          cancelled: 0
        };

        bookings.forEach(booking => {
          const status = booking.status?.toLowerCase() || 'pending';
          if (status === 'completed') {
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

        setOriginalCabinBookings(cabinBookings);
        setFilteredCabinBookings(cabinBookings);

        // Generate Cabin Bookings Chart Data with all months Jan-Dec
        updateCabinChart(cabinBookings);

        setDashboardData({
          totalBookings: data.data.totalBookings || 0,
          totalSpent: data.data.totalSpent || 0,
          myCabinsCount: data.data.myCabinsCount || 0,
          cabinBookingsCount: data.data.cabinBookingsCount || 0,
          cabinRevenue: data.data.cabinRevenue || 0,
          totalCabins: data.data.totalCabins || 0,
          wallet: data.data.wallet || { balance: 0, totalEarned: 0, transactions: 0, withdrawals: 0 },
          recentBookings: data.data.recentBookings || [],
          recentCabinBookings: data.data.recentCabinBookings || [],
          bookingChartData: data.data.bookingChartData || [],
          monthlyStats: data.data.monthlyStats || { bookingsThisMonth: 0, spentThisMonth: 0, earningsThisMonth: 0, growth: 0 },
          statusDistribution: statusDist
        });

        generateAvailableMonths(cabinBookings);
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

  // ─── FETCH MY BOOKINGS ───
  const fetchMyBookings = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(
        `${API_URL}/api/bookings/user`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'user': JSON.stringify({ _id: userId })
          }
        }
      );
      setMyBookings(res.data.bookings || []);
    } catch (error) {
      console.error("Failed to fetch my bookings:", error);
    }
  };

  // ─── FETCH MY CABIN BOOKINGS ───
  const fetchMyCabinBookings = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(
        `${API_URL}/api/bookings/owner-bookings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'user': JSON.stringify({ _id: userId })
          }
        }
      );
      setMyCabinBookings(res.data.bookings || []);
    } catch (error) {
      console.error("Failed to fetch cabin bookings:", error);
    }
  };

  // ─── FETCH MY CABINS ───
  const fetchCabins = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(`${API_URL}/api/cabins/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'user': JSON.stringify({ _id: userId })
        }
      });
      const data = res.data.cabins || res.data;
      const cabinList = Array.isArray(data) ? data : [];
      setCabins(cabinList);
      setCabinCount(cabinList.length);
    } catch (err) {
      console.error("Error fetching cabins:", err);
    }
  };

  // ─── GENERATE AVAILABLE MONTHS ───
  const generateAvailableMonths = (bookings) => {
    const months = new Set();
    bookings.forEach(booking => {
      if (booking.createdAt) {
        const date = new Date(booking.createdAt);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        months.add(monthKey);
      }
    });

    if (months.size === 0) {
      const now = new Date();
      const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      months.add(currentMonth);
    }

    setAvailableMonths(Array.from(months).sort());
  };

  // ─── UPDATE CABIN CHART ───
  const updateCabinChart = (bookings) => {
    const cabinMonthMap = {};
    ALL_MONTHS.forEach(month => {
      cabinMonthMap[month] = { month, bookings: 0, revenue: 0 };
    });

    bookings.forEach(booking => {
      if (!booking.createdAt) return;
      const date = new Date(booking.createdAt);
      const monthName = date.toLocaleString('default', { month: 'short' });
      
      if (cabinMonthMap[monthName]) {
        cabinMonthMap[monthName].bookings += 1;
        cabinMonthMap[monthName].revenue += (booking.totalPrice || booking.amount || 0);
      }
    });
    
    const cabinChart = Object.values(cabinMonthMap);
    setCabinChartData(cabinChart);
  };

  // ─── APPLY FILTERS (Only for Chart) ───
  const applyFilters = () => {
    let filtered = [...originalCabinBookings];

    // Month filter
    if (selectedMonth !== "all") {
      const [year, month] = selectedMonth.split('-');
      filtered = filtered.filter(booking => {
        if (!booking.createdAt) return false;
        const date = new Date(booking.createdAt);
        return date.getFullYear() === parseInt(year) &&
          (date.getMonth() + 1) === parseInt(month);
      });
    }

    // Status filter
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

    // Date From filter
    if (dateFrom) {
      const from = new Date(dateFrom);
      from.setHours(0, 0, 0, 0);
      filtered = filtered.filter(booking => {
        if (!booking.createdAt) return false;
        const bookingDate = new Date(booking.createdAt);
        return bookingDate >= from;
      });
    }

    // Date To filter
    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      filtered = filtered.filter(booking => {
        if (!booking.createdAt) return false;
        const bookingDate = new Date(booking.createdAt);
        return bookingDate <= to;
      });
    }

    setFilteredCabinBookings(filtered);
    updateCabinChart(filtered);
    
    toast.success(`Filtered: ${filtered.length} cabin bookings found`);
  };

  // ─── CLEAR FILTERS ───
  const clearFilters = () => {
    setSelectedMonth("all");
    setSelectedStatus("all");
    setDateFrom("");
    setDateTo("");
    setFilteredCabinBookings(originalCabinBookings);
    updateCabinChart(originalCabinBookings);
    toast.success('Filters cleared');
  };

  const formatCurrency = (amount) => {
    const value = Number(amount || 0);
    return `₹${value.toLocaleString('en-IN')}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadgeSimple = (status) => {
    const map = {
      pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
      confirmed: { label: 'Confirmed', color: 'bg-emerald-100 text-emerald-700' },
      active: { label: 'Active', color: 'bg-indigo-100 text-indigo-700' },
      completed: { label: 'Completed', color: 'bg-blue-100 text-blue-700' },
      cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700' }
    };
    return map[status?.toLowerCase()] || { label: status || 'Unknown', color: 'bg-gray-100 text-gray-700' };
  };

  const getImageUrl = (img) => {
    if (!img) return PLACEHOLDER_IMAGE;
    if (img.startsWith("http")) return img;
    const cleanPath = img.replace(/\\/g, "/").replace(/^\/+/, "");
    return `${API_URL}/${cleanPath}`;
  };

  const getCabinStatus = (cabin) => {
    if (cabin.isActive === true) {
      return { status: 'Active', color: 'green' };
    }
    return { status: 'Inactive', color: 'gray' };
  };

  // Handle mouse enter on bar
  const handleBarHover = (item, index, event) => {
    setHoveredBar({ item, index });
    setTooltipPosition({
      x: event.clientX || 0,
      y: (event.clientY || 0) - 90
    });
  };

  const handleBarLeave = () => {
    setHoveredBar(null);
  };

  if (loading) {
    return (
      <div className="user-dash">
        <DoctorNavbar />
        <div className="user-dash__loading">
          <div className="user-dash__spinner" />
          <p className="user-dash__loading-text">Loading dashboard analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-dash">
        <DoctorNavbar />
        <div className="user-dash__error">
          <p className="user-dash__error-title">Oops!</p>
          <p className="user-dash__error-message">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="user-dash__btn user-dash__btn--primary"
          >
            Retry
          </button>
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
    bookingChartData,
    monthlyStats,
    statusDistribution
  } = dashboardData;

  // Stats Cards - Matching UserDashboard style
  const statsCards = [
    {
      label: "My Bookings",
      value: totalBookings,
      meta: `${monthlyStats?.bookingsThisMonth || 0} this month`,
      icon: Calendar,
      color: "indigo",
      onClick: () => navigate("/doctorbookings")
    },
    {
      label: "Pending",
      value: statusDistribution.pending || 0,
      meta: "awaiting confirmation",
      icon: Clock,
      color: "amber",
      onClick: () => {
        // Filter to pending
      }
    },
    {
      label: "My Cabins",
      value: myCabinsCount,
      meta: `${totalCabins} total spaces available`,
      icon: Home,
      color: "emerald",
      onClick: () => navigate("/mychambers")
    },
    {
      label: "Cabin Bookings",
      value: cabinBookingsCount,
      meta: `₹${cabinRevenue.toLocaleString('en-IN')} revenue`,
      icon: Building2,
      color: "rose",
      onClick: () => navigate("/chamberbookings")
    },
    {
      label: "Total Spent",
      value: formatCurrency(totalSpent),
      meta: `${formatCurrency(monthlyStats?.spentThisMonth || 0)} this month`,
      icon: IndianRupee,
      color: "purple"
    },
    {
      label: "Wallet Balance",
      value: formatCurrency(wallet.balance || 0),
      meta: `${wallet.transactions || 0} transactions`,
      icon: Wallet,
      color: "cyan",
      onClick: () => navigate("/doctorwallet")
    }
  ];

  const latestMyBookings = myBookings.slice(0, 5);
  const latestCabinBookings = myCabinBookings.slice(0, 5);
  const activeBookingsCount = statusDistribution.active || 0;

  // Check if any filter is active
  const isFilterActive = selectedMonth !== "all" || 
                         selectedStatus !== "all" || 
                         dateFrom || 
                         dateTo;

  // Get profile user name
  const profileName = profile?.name || user?.name || 'Doctor';

  return (
    <div className="user-dash">
      <DoctorNavbar />

      <main className="pt-20 px-3 sm:px-4 md:px-6 lg:px-8 max-w-full mx-auto pb-16">
        {/* Header */}
        <div className="user-dash__header">
          <div>
            <h1 className="user-dash__greeting">
              My <span>Dashboard</span>
            </h1>
            <p className="user-dash__subtitle">
              Welcome back, <span className="font-semibold text-gray-700">{profileName}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            {activeBookingsCount > 0 && (
              <span className="user-dash__date-pill">
                <Activity size={14} />
                {activeBookingsCount} Active
              </span>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 md:gap-4 mb-6">
          {statsCards.map((stat, index) => {
            const clickable = Boolean(stat.onClick);
            return (
              <div
                key={index}
                className={[
                  "user-dash__stat",
                  clickable
                    ? "cursor-pointer hover:scale-105 transition-transform duration-200"
                    : "cursor-default"
                ].join(" ")}
                onClick={clickable ? stat.onClick : undefined}
                onKeyDown={(e) => {
                  if (!clickable) return;
                  if (e.key === "Enter" || e.key === " ") stat.onClick();
                }}
                role={clickable ? "button" : undefined}
                tabIndex={clickable ? 0 : undefined}
                title={clickable ? "Click to view" : undefined}
              >
                <div className="user-dash__stat-top">
                  <span className="user-dash__stat-label">{stat.label}</span>
                  <div className={`user-dash__stat-icon user-dash__stat-icon--${stat.color}`}>
                    <stat.icon size={14} />
                  </div>
                </div>
                <div className="user-dash__stat-value">{stat.value}</div>
                <div className="user-dash__stat-meta">{stat.meta}</div>
              </div>
            );
          })}
        </div>

        {/* Filter Section - Only for Chart */}
        <div className="user-dash__card">
          <div className="user-dash__card-header">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl shadow-md shadow-indigo-200">
                <Filter size={16} className="text-white" />
              </div>
              <div>
                <h3 className="user-dash__card-title">Chart Filters</h3>
                <p className="user-dash__card-desc">Filter cabin bookings chart</p>
              </div>
            </div>
          </div>

          <div className="user-dash__card-body">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2 w-full">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
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

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <div className="flex items-center gap-1">
                <span className="text-[10px] text-gray-500 font-medium">From</span>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="px-2.5 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white w-32"
                />
              </div>

              <div className="flex items-center gap-1">
                <span className="text-[10px] text-gray-500 font-medium">To</span>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="px-2.5 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white w-32"
                />
              </div>

              <button
                onClick={applyFilters}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition flex items-center gap-2 shadow-sm shadow-indigo-200"
              >
                <Filter size={16} />
                Apply
              </button>

              {isFilterActive && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition text-sm font-medium"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
        </div>

        {/* Cabin Bookings Chart - Full Width with Hover Tooltip */}
        <div className="user-dash__chart">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl shadow-md shadow-amber-200">
                <BarChart3 size={18} className="text-white" />
              </div>
              <div>
                <h3 className="user-dash__card-title">Cabin Bookings</h3>
                <p className="user-dash__card-desc">Monthly booking trends with revenue</p>
              </div>
              <span className="px-2.5 py-1 text-xs font-bold text-amber-700 bg-amber-100 rounded-full">
                {cabinChartData.reduce((sum, d) => sum + d.bookings, 0) || 0} total
              </span>
              <span className="px-2.5 py-1 text-xs font-bold text-emerald-700 bg-emerald-100 rounded-full">
                {formatCurrency(cabinChartData.reduce((sum, d) => sum + d.revenue, 0))}
              </span>
            </div>
          </div>
          <div className="h-52 flex items-end justify-between gap-1 px-2 relative">
            {cabinChartData.map((item, idx) => {
              const maxVal = Math.max(...cabinChartData.map(d => d.bookings), 1);
              const height = maxVal > 0 ? (item.bookings / maxVal) * 100 : 0;
              const isHovered = hoveredBar && hoveredBar.index === idx;
              
              return (
                <div 
                  key={idx} 
                  className="flex-1 flex flex-col items-center gap-1.5 relative group"
                  onMouseEnter={(e) => handleBarHover(item, idx, e)}
                  onMouseLeave={handleBarLeave}
                >
                  <div className="w-full flex justify-center items-end h-36">
                    <div 
                      className={`w-8 rounded-t-lg transition-all duration-300 cursor-pointer ${
                        item.bookings > 0 
                          ? 'bg-gradient-to-t from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500' 
                          : 'bg-gray-200'
                      } ${isHovered ? 'scale-110 shadow-lg' : ''}`}
                      style={{ 
                        height: `${Math.max(height, 4)}%`,
                        opacity: item.bookings > 0 ? 1 : 0.3
                      }}
                    />
                  </div>
                  <span className={`text-[9px] font-medium ${item.bookings > 0 ? 'text-gray-600' : 'text-gray-300'} truncate max-w-[40px]`}>
                    {item.month}
                  </span>
                  <span className={`text-[7px] font-bold ${item.bookings > 0 ? 'text-amber-600' : 'text-gray-300'}`}>
                    {item.bookings}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Hover Tooltip with Revenue */}
          {hoveredBar && (
            <div 
              className="fixed bg-gray-900 text-white px-4 py-3 rounded-lg shadow-xl text-xs font-medium z-50 pointer-events-none transition-opacity duration-150"
              style={{
                left: tooltipPosition.x,
                top: tooltipPosition.y,
                transform: 'translateX(-50%)',
                minWidth: '120px',
                textAlign: 'center'
              }}
            >
              <div className="font-bold text-amber-400 text-sm">{hoveredBar.item.month}</div>
              <div className="border-t border-gray-700 my-1.5"></div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-gray-400">📊</span>
                <span className="text-white font-semibold">{hoveredBar.item.bookings} bookings</span>
              </div>
              <div className="flex items-center justify-center gap-2 mt-0.5">
                <span className="text-gray-400">💰</span>
                <span className="text-emerald-400 font-bold">{formatCurrency(hoveredBar.item.revenue)}</span>
              </div>
              <div className="text-gray-400 text-[8px] mt-1">
                {hoveredBar.item.bookings > 0 
                  ? `${Math.round((hoveredBar.item.bookings / cabinChartData.reduce((sum, d) => sum + d.bookings, 0)) * 100)}% of total`
                  : 'No bookings'}
              </div>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
            </div>
          )}

          <div className="flex justify-between mt-3 text-[10px] text-gray-500 bg-gray-50 rounded-xl px-4 py-2">
            <span className="flex items-center gap-2 font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Total: {cabinChartData.reduce((sum, d) => sum + d.bookings, 0) || 0} cabin bookings
            </span>
            <span className="flex items-center gap-2 font-medium">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              {cabinChartData.filter(d => d.bookings > 0).length || 0} months with bookings
            </span>
            <span className="flex items-center gap-2 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Revenue: {formatCurrency(cabinChartData.reduce((sum, d) => sum + d.revenue, 0))}
            </span>
          </div>
        </div>

        {/* My Cabins Section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3 p-5 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl shadow-md shadow-emerald-200">
                <Home size={18} className="text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-800">My Cabins</h3>
                <p className="text-xs text-gray-500">Manage your registered spaces</p>
              </div>
              <span className="px-3 py-1 text-xs font-bold text-emerald-700 bg-emerald-100 rounded-full">
                {cabins.length}
              </span>
            </div>
            <button
              onClick={() => navigate("/mychambers")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
            >
              View All <ArrowUpRight size={14} />
            </button>
          </div>
          <div className="p-0 overflow-x-auto">
            {cabins.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4 py-16 text-gray-400">
                <div className="p-4 bg-gray-100 rounded-2xl">
                  <Home size={48} className="text-gray-300" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-500">No cabins found</p>
                  <p className="text-xs text-gray-400 mt-1">You haven't registered any cabins yet.</p>
                </div>
              </div>
            ) : (
              <table className="w-full min-w-[700px] text-left">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="p-4 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">S.No</th>
                    <th className="p-4 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Cabin</th>
                    <th className="p-4 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Address</th>
                    <th className="p-4 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Type</th>
                    <th className="p-4 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Price</th>
                    <th className="p-4 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Status</th>
                    <th className="p-4 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {cabins.slice(0, 5).map((cabin, index) => {
                    const cabinStatus = getCabinStatus(cabin);
                    const isExclusive = cabin.cabinType === 'exclusive';
                    return (
                      <tr key={cabin._id} className="transition-all hover:bg-gradient-to-r hover:from-gray-50 hover:to-indigo-50/30 cursor-pointer group" onClick={() => navigate(`/cabin/${cabin._id}`)}>
                        <td className="p-4">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-xs font-bold text-gray-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                            {index + 1}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-12 h-12 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shadow-sm">
                              <img
                                src={cabin.images?.[0] ? getImageUrl(cabin.images[0]) : PLACEHOLDER_IMAGE}
                                alt={cabin.name}
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }}
                              />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 text-sm">{cabin.name || 'N/A'}</p>
                              <p className="text-[10px] text-gray-500 font-medium">{cabin.cabin || 'N/A'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1.5 text-sm text-gray-600">
                            <MapPin size={14} className="text-gray-400 flex-shrink-0" />
                            <span className="truncate max-w-[140px]">{cabin.address || "N/A"}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold rounded-lg ${
                            isExclusive 
                              ? 'bg-gradient-to-r from-amber-100 to-amber-50 text-amber-700 border border-amber-200' 
                              : 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 border border-blue-200'
                          }`}>
                            {isExclusive ? <Crown size={11} /> : null}
                            {isExclusive ? 'Exclusive' : 'Normal'}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-baseline gap-1">
                            <span className="text-base font-bold text-gray-900">₹{cabin.price || 0}</span>
                            <span className="text-[10px] text-gray-400 font-medium">/hr</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold rounded-lg ${
                            cabinStatus.color === 'green' 
                              ? 'bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-700 border border-emerald-200' 
                              : 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-600 border border-gray-200'
                          }`}>
                            {cabinStatus.color === 'green' && <CheckCircle size={11} />}
                            {cabinStatus.status}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={(e) => { e.stopPropagation(); navigate(`/cabin/${cabin._id}`); }}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-bold bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 transition-all shadow-md shadow-indigo-200/50 hover:shadow-indigo-300/50"
                          >
                            <Eye size={11} /> View
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

        {/* My Latest Bookings */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3 p-5 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl shadow-md shadow-indigo-200">
                <Calendar size={18} className="text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-800">My Latest Bookings</h3>
                <p className="text-xs text-gray-500">Recent space reservations</p>
              </div>
              <span className="px-3 py-1 text-xs font-bold text-indigo-700 bg-indigo-100 rounded-full">
                {latestMyBookings.length}
              </span>
            </div>
            <button
              onClick={() => navigate("/doctorbookings")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
            >
              View All <ArrowUpRight size={14} />
            </button>
          </div>
          <div className="p-0 overflow-x-auto">
            {latestMyBookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4 py-16 text-gray-400">
                <div className="p-4 bg-gray-100 rounded-2xl">
                  <Calendar size={48} className="text-gray-300" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-500">No bookings found</p>
                  <p className="text-xs text-gray-400 mt-1">You haven't made any bookings yet.</p>
                </div>
              </div>
            ) : (
              <table className="w-full min-w-[700px] text-left">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="p-4 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">S.No</th>
                    <th className="p-4 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Cabin</th>
                    <th className="p-4 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Date</th>
                    <th className="p-4 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Status</th>
                    <th className="p-4 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {latestMyBookings.map((b, idx) => {
                    const status = getStatusBadgeSimple(b.status);
                    const cabinName = b.cabin?.name || b.cabinName || 'Unknown';
                    const cabinAddress = b.cabin?.address || b.cabinAddress || 'N/A';
                    return (
                      <tr key={b._id} className="transition-all hover:bg-gradient-to-r hover:from-gray-50 hover:to-indigo-50/30 cursor-pointer group" onClick={() => navigate("/doctorbookings")}>
                        <td className="p-4">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-xs font-bold text-gray-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                            {idx + 1}
                          </span>
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="font-bold text-gray-900 text-sm">{cabinName}</p>
                            <p className="text-[10px] text-gray-500 font-medium flex items-center gap-1">
                              <MapPin size={10} /> {cabinAddress?.split(',')[0] || 'N/A'}
                            </p>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="text-sm font-semibold text-gray-700">{b.startDate}</p>
                          <p className="text-[10px] text-gray-500">{b.startTime} - {b.endTime}</p>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold rounded-lg ${status.color}`}>{status.label}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-base font-bold text-indigo-600">₹{b.totalPrice}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* My Cabin Bookings */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3 p-5 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl shadow-md shadow-rose-200">
                <Building2 size={18} className="text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-800">My Cabin Bookings</h3>
                <p className="text-xs text-gray-500">Bookings received for your cabins</p>
              </div>
              <span className="px-3 py-1 text-xs font-bold text-rose-700 bg-rose-100 rounded-full">
                {latestCabinBookings.length}
              </span>
            </div>
            <button
              onClick={() => navigate("/chamberbookings")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
            >
              View All <ArrowUpRight size={14} />
            </button>
          </div>
          <div className="p-0 overflow-x-auto">
            {latestCabinBookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4 py-16 text-gray-400">
                <div className="p-4 bg-gray-100 rounded-2xl">
                  <Building2 size={48} className="text-gray-300" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-500">No cabin bookings found</p>
                  <p className="text-xs text-gray-400 mt-1">No one has booked your cabins yet.</p>
                </div>
              </div>
            ) : (
              <table className="w-full min-w-[700px] text-left">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="p-4 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">S.No</th>
                    <th className="p-4 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Cabin</th>
                    <th className="p-4 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Customer</th>
                    <th className="p-4 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Date</th>
                    <th className="p-4 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Status</th>
                    <th className="p-4 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {latestCabinBookings.map((b, idx) => {
                    const status = getStatusBadgeSimple(b.status);
                    const cabinName = b.cabin?.name || b.cabinName || 'Unknown';
                    const cabinAddress = b.cabin?.address || b.cabinAddress || 'N/A';
                    const customerName = b.name || b.userId?.name || 'Unknown';
                    const customerMobile = b.mobile || b.userId?.mobile || 'N/A';
                    return (
                      <tr key={b._id} className="transition-all hover:bg-gradient-to-r hover:from-gray-50 hover:to-rose-50/30 cursor-pointer group" onClick={() => navigate("/chamberbookings")}>
                        <td className="p-4">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-xs font-bold text-gray-500 group-hover:bg-rose-100 group-hover:text-rose-600 transition-colors">
                            {idx + 1}
                          </span>
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="font-bold text-gray-900 text-sm">{cabinName}</p>
                            <p className="text-[10px] text-gray-500 font-medium flex items-center gap-1">
                              <MapPin size={10} /> {cabinAddress?.split(',')[0] || 'N/A'}
                            </p>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="font-semibold text-gray-800 text-sm">{customerName}</p>
                          <p className="text-[10px] text-gray-500">{customerMobile}</p>
                        </td>
                        <td className="p-4">
                          <p className="text-sm font-semibold text-gray-700">{b.startDate}</p>
                          <p className="text-[10px] text-gray-500">{b.startTime} - {b.endTime}</p>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold rounded-lg ${status.color}`}>{status.label}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-base font-bold text-rose-600">₹{b.totalPrice}</span>
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

export default DoctorDashboard;