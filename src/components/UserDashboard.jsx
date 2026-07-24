import axios from "axios";
import {
  Calendar,
  Building2,
  Home,
  Plus,
  LogOut,
  Wallet,
  IndianRupee,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  BarChart3,
  PieChart,
  Activity,
  DollarSign,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Sparkles,
  Zap,
  Star,
  Gift,
  Filter,
  ChevronDown,
  Search,
  Eye,
  Edit,
  MapPin,
  ChevronRight,
  FileText,
  Crown,
  Wifi,
  ParkingCircle,
  Lock,
  Bath,
  Shield,
  Armchair,
  Coffee,
  Dumbbell,
  Fan,
  Tv,
  Printer,
  Phone,
  Upload,
  Loader2,
  Receipt,
  X as XIcon,
  CreditCard,
  Menu,
  ArrowLeft,
  Clipboard,
  Percent,
  Sun,
  Moon,
  Clock as ClockIcon,
  Video,
  FileVideo,
  Play
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import UsersNavbar from "./UsersNavbar";
import "./Dashboard.css";

const API_URL = "http://localhost:5003";
const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000";
const GST_RATE = 0.18;

// Normal Amenities
const NORMAL_AMENITIES = [
  { key: "wifi", label: "Wi-Fi", icon: Wifi },
  { key: "parking", label: "Parking", icon: ParkingCircle },
  { key: "lockers", label: "Lockers", icon: Lock },
  { key: "comfortSeating", label: "Comfort Seating", icon: Armchair },
];

// Exclusive Amenities
const EXCLUSIVE_AMENITIES = [
  { key: "wifi", label: "High-Speed Wi-Fi", icon: Wifi },
  { key: "parking", label: "Reserved Parking", icon: ParkingCircle },
  { key: "lockers", label: "Secure Lockers", icon: Lock },
  { key: "privateWashroom", label: "Private Washroom", icon: Bath },
  { key: "secureAccess", label: "24/7 Secure Access", icon: Shield },
  { key: "comfortSeating", label: "Premium Seating", icon: Armchair },
  { key: "coffee", label: "Coffee & Tea", icon: Coffee },
  { key: "gym", label: "Gym Access", icon: Dumbbell },
  { key: "ac", label: "Air Conditioning", icon: Fan },
  { key: "tv", label: "Smart TV", icon: Tv },
  { key: "printer", label: "Printer Access", icon: Printer },
  { key: "phone", label: "Conference Phone", icon: Phone },
];

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
  
  // Filter States
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [availableMonths, setAvailableMonths] = useState([]);
  const [originalBookings, setOriginalBookings] = useState([]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  
  // My Bookings data for table
  const [myBookings, setMyBookings] = useState([]);
  const [myCabinBookings, setMyCabinBookings] = useState([]);
  
  // My Cabins data
  const [cabins, setCabins] = useState([]);
  const [cabinCount, setCabinCount] = useState(0);
  
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchUserDashboard();
    fetchMyBookings();
    fetchMyCabinBookings();
    fetchCabins();
  }, []);

  // Fetch My Cabins
  const fetchCabins = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await axios.get(`${API_URL}/api/cabins/user`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = res.data.cabins || res.data;
      const cabinList = Array.isArray(data) ? data : [];
      setCabins(cabinList);
      setCabinCount(cabinList.length);
    } catch (err) {
      console.error("Error fetching cabins:", err);
    }
  };

  // Fetch My Bookings
  const fetchMyBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await axios.get(
        `${API_URL}/api/bookings/user`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMyBookings(res.data.bookings || []);
    } catch (error) {
      console.error("Failed to fetch my bookings:", error);
    }
  };

  // Fetch My Cabin Bookings
  const fetchMyCabinBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await axios.get(
        `${API_URL}/api/bookings/owner-bookings`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMyCabinBookings(res.data.bookings || []);
    } catch (error) {
      console.error("Failed to fetch cabin bookings:", error);
    }
  };

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
        
        setOriginalBookings(bookings);
        setFilteredBookings(bookings);
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

  const applyFilters = () => {
    let filtered = [...originalBookings];
    
    if (selectedMonth !== "all") {
      const [year, month] = selectedMonth.split('-');
      filtered = filtered.filter(booking => {
        if (!booking.createdAt) return false;
        const date = new Date(booking.createdAt);
        return date.getFullYear() === parseInt(year) && 
               (date.getMonth() + 1) === parseInt(month);
      });
    }
    
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

    if (dateFrom) {
      const from = new Date(dateFrom);
      filtered = filtered.filter(booking => {
        if (!booking.createdAt) return false;
        return new Date(booking.createdAt) >= from;
      });
    }

    if (dateTo) {
      const to = new Date(dateTo);
      filtered = filtered.filter(booking => {
        if (!booking.createdAt) return false;
        return new Date(booking.createdAt) <= to;
      });
    }
    
    setFilteredBookings(filtered);
    updateChartData(filtered);
  };

  const updateChartData = (filtered) => {
    if (filtered.length === 0) {
      setDashboardData(prev => ({
        ...prev,
        bookingChartData: []
      }));
      return;
    }
    
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

  const clearFilters = () => {
    setSelectedMonth("all");
    setSelectedStatus("all");
    setDateFrom("");
    setDateTo("");
    setFilteredBookings(originalBookings);
    
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

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`;
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

  const getCabinStatus = (cabin) => {
    if (cabin.isActive === true) {
      return { status: 'Active', color: 'green' };
    }
    return { status: 'Inactive', color: 'gray' };
  };

  const getImageUrl = (img) => {
    if (!img) return PLACEHOLDER_IMAGE;
    if (img.startsWith("http")) return img;
    const cleanPath = img.replace(/\\/g, "/").replace(/^\/+/, "");
    return `${API_URL}/${cleanPath}`;
  };

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
    bookingChartData,
    monthlyStats,
    statusDistribution
  } = dashboardData;

  // ✅ STATS CARDS - Add Cabin Button REMOVED
  const statsCards = [
    {
      label: "My Bookings",
      value: totalBookings,
      meta: `${monthlyStats?.bookingsThisMonth || 0} this month`,
      icon: Calendar,
      iconBg: "bg-indigo-100 text-indigo-600",
      onClick: () => navigate("/mybookings")
    },
    {
      label: "My Cabins",
      value: myCabinsCount,
      meta: `${totalCabins} total spaces available`,
      icon: Home,
      iconBg: "bg-emerald-100 text-emerald-600",
      onClick: () => navigate("/mycabin")
    },
    {
      label: "Cabin Bookings",
      value: cabinBookingsCount,
      meta: `₹${cabinRevenue.toLocaleString('en-IN')} revenue`,
      icon: Building2,
      iconBg: "bg-rose-100 text-rose-600",
      onClick: () => navigate("/cabin-bookings")
    },
    {
      label: "Total Spent",
      value: formatCurrency(totalSpent),
      meta: `₹${monthlyStats?.spentThisMonth || 0} this month`,
      icon: IndianRupee,
      iconBg: "bg-amber-100 text-amber-600"
    },
    {
      label: "Wallet Balance",
      value: formatCurrency(wallet.balance || 0),
      meta: `${wallet.transactions || 0} transactions`,
      icon: Wallet,
      iconBg: "bg-cyan-100 text-cyan-600",
      onClick: () => navigate("/userwallet")
    }
  ];

  // ✅ FOOTER STATS - 3 cards only (Add Cabin removed)
  const footerStats = [
    {
      label: "Cabin Bookings",
      value: cabinBookingsCount,
      icon: Building2,
      iconBg: "bg-amber-100 text-amber-600"
    },
    {
      label: "Cabin Revenue",
      value: formatCurrency(cabinRevenue),
      icon: IndianRupee,
      iconBg: "bg-emerald-100 text-emerald-600"
    },
    {
      label: "Wallet Withdrawals",
      value: wallet.withdrawals || 0,
      icon: Wallet,
      iconBg: "bg-rose-100 text-rose-600"
    }
  ];

  const latestMyBookings = myBookings.slice(0, 5);
  const latestCabinBookings = myCabinBookings.slice(0, 5);

  return (
    <div className="admin-dash" style={{ backgroundColor: '#ffffff' }}>
      <UsersNavbar />

      <div className="pt-24 px-3 sm:px-4 md:px-6 lg:px-8 max-w-full mx-auto pb-16">
        {/* Header */}
        <div className="admin-dash__header">
          <div>
            <h1 className="admin-dash__greeting">
              <span>Dashboard</span>
            </h1>
          </div>
        </div>

        {/* Row 1: 5 Stats Cards */}
        <div className="admin-dash__stats">
          {statsCards.map((stat, index) => (
            <div
              key={index}
              className="admin-dash__stat cursor-pointer"
              onClick={stat.onClick}
            >
              <div className="admin-dash__stat-top">
                <span className="admin-dash__stat-label">{stat.label}</span>
                <div className={`admin-dash__stat-icon ${stat.iconBg}`}>
                  <stat.icon size={18} />
                </div>
              </div>
              <div className="admin-dash__stat-value">{stat.value}</div>
              <div className="admin-dash__stat-meta">{stat.meta}</div>
            </div>
          ))}
        </div>

        {/* Row 2: 3 Footer Stats Cards (Add Cabin REMOVED) */}
        <div className="admin-dash__stats mt-4">
          {footerStats.map((stat, index) => (
            <div
              key={index}
              className="admin-dash__stat"
            >
              <div className="admin-dash__stat-top">
                <span className="admin-dash__stat-label">{stat.label}</span>
                <div className={`admin-dash__stat-icon ${stat.iconBg}`}>
                  <stat.icon size={18} />
                </div>
              </div>
              <div className="admin-dash__stat-value">{stat.value}</div>
            </div>
          ))}
          {/* ❌ ADD CABIN BUTTON REMOVED - Empty space for consistency */}
          <div className="admin-dash__stat" style={{ visibility: 'hidden' }}>
            {/* Hidden placeholder to maintain grid layout */}
          </div>
        </div>

        {/* Row 3: Filter Section */}
        <div className="admin-dash__card mt-6">
          <div className="admin-dash__card-body py-3 px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                  <Filter size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-800">Filter Analytics</h4>
                  <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">Select Filters</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="text-xs bg-white border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold text-gray-700 shadow-sm"
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
                  className="text-xs bg-white border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold text-gray-700 shadow-sm"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border flex-1 md:flex-none">
                  <span className="text-[8px] font-black text-gray-400 uppercase">From</span>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="bg-transparent text-xs font-bold outline-none text-gray-700"
                  />
                </div>
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border flex-1 md:flex-none">
                  <span className="text-[8px] font-black text-gray-400 uppercase">To</span>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="bg-transparent text-xs font-bold outline-none text-gray-700"
                  />
                </div>

                <button
                  onClick={applyFilters}
                  className="px-4 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-xs font-bold hover:from-indigo-700 hover:to-purple-700 transition-colors flex items-center gap-2 shadow-sm shadow-indigo-200"
                >
                  <Filter size={14} />
                  Apply
                </button>

                {(selectedMonth !== "all" || selectedStatus !== "all" || dateFrom || dateTo) && (
                  <button
                    onClick={clearFilters}
                    className="px-3 py-1.5 text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Row 4: Charts Section */}
        <div className="admin-dash__charts-grid mt-6">
          <div className="admin-dash__card admin-dash__chart-wrap" style={{ gridColumn: 'span 2' }}>
            <div className="admin-dash__card-header py-3 px-4">
              <h3 className="admin-dash__card-title text-sm">Monthly Bookings</h3>
            </div>
            <div className="admin-dash__card-body flex-1 p-3">
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
                          />
                        </div>
                        <span className="text-[9px] text-slate-400 font-medium truncate max-w-[40px]">{item.month}</span>
                      </div>
                    );
                  })
                ) : (
                  <div className="w-full text-center text-slate-400 text-sm">No data available</div>
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
          </div>
        </div>

        {/* Row 5: My Cabins Section */}
        <div className="admin-dash__card mt-6" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}>
          <div className="admin-dash__card-header flex flex-wrap items-center justify-between gap-3" style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb' }}>
            <div className="flex items-center gap-3">
              <h3 className="admin-dash__card-title text-sm">My Cabins</h3>
              <span className="px-2.5 py-0.5 text-xs font-bold text-indigo-700 bg-indigo-100 rounded-full">
                {cabins.length}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => navigate("/mycabin")}
                className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100"
              >
                View All <ArrowUpRight size={12} />
              </button>
            </div>
          </div>
          <div className="admin-dash__card-body p-0 overflow-x-auto" style={{ backgroundColor: '#ffffff' }}>
            {cabins.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-12 text-gray-400">
                <Home size={36} className="opacity-20" />
                <p className="text-sm font-medium">No cabins found</p>
                <p className="text-xs text-gray-400">You haven't registered any cabins yet.</p>
              </div>
            ) : (
              <table className="w-full min-w-[700px] text-left">
                <thead>
                  <tr className="border-b border-gray-100" style={{ backgroundColor: '#f9fafb' }}>
                    <th className="p-3 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">#</th>
                    <th className="p-3 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Cabin</th>
                    <th className="p-3 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Address</th>
                    <th className="p-3 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Type</th>
                    <th className="p-3 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Price</th>
                    <th className="p-3 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Status</th>
                    <th className="p-3 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {cabins.slice(0, 5).map((cabin, index) => {
                    const cabinStatus = getCabinStatus(cabin);
                    const isExclusive = cabin.cabinType === 'exclusive';
                    return (
                      <tr key={cabin._id} className="transition-colors hover:bg-gray-50/80 cursor-pointer" onClick={() => navigate(`/cabin/${cabin._id}`)}>
                        <td className="p-3">
                          <span className="text-xs font-semibold text-gray-400">#{index + 1}</span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2.5">
                            <div className="flex-shrink-0 w-8 h-8 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                              <img
                                src={cabin.images?.[0] ? getImageUrl(cabin.images[0]) : PLACEHOLDER_IMAGE}
                                alt={cabin.name}
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }}
                              />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">{cabin.name || 'N/A'}</p>
                              <p className="text-[10px] text-gray-400">{cabin.cabin || 'N/A'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="text-sm text-gray-600 flex items-center gap-1">
                            <MapPin size={12} className="text-gray-400" />
                            <span className="truncate max-w-[120px]">{cabin.address || "N/A"}</span>
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full inline-flex items-center gap-1 ${
                            isExclusive ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {isExclusive ? <Crown size={10} /> : null}
                            {isExclusive ? 'Exclusive' : 'Normal'}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="text-sm font-bold text-gray-900">₹{cabin.price || 0}</span>
                          <span className="text-[10px] text-gray-400">/hr</span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${
                            cabinStatus.color === 'green' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {cabinStatus.status}
                          </span>
                        </td>
                        <td className="p-3">
                          <button
                            onClick={(e) => { e.stopPropagation(); navigate(`/cabin/${cabin._id}`); }}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
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

        {/* Row 6: My Latest Bookings Table */}
        <div className="admin-dash__card mt-4" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}>
          <div className="admin-dash__card-header flex flex-wrap items-center justify-between gap-3" style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb' }}>
            <div className="flex items-center gap-3">
              <h3 className="admin-dash__card-title text-sm">My Latest Bookings</h3>
              <span className="px-2.5 py-0.5 text-xs font-bold text-indigo-700 bg-indigo-100 rounded-full">
                {latestMyBookings.length}
              </span>
            </div>
            <button
              onClick={() => navigate("/mybookings")}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100"
            >
              View All <ArrowUpRight size={12} />
            </button>
          </div>
          <div className="admin-dash__card-body p-0 overflow-x-auto" style={{ backgroundColor: '#ffffff' }}>
            {latestMyBookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-12 text-gray-400">
                <Calendar size={36} className="opacity-20" />
                <p className="text-sm font-medium">No bookings found</p>
              </div>
            ) : (
              <table className="w-full min-w-[700px] text-left">
                <thead>
                  <tr className="border-b border-gray-100" style={{ backgroundColor: '#f9fafb' }}>
                    <th className="p-3 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">#</th>
                    <th className="p-3 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Cabin</th>
                    <th className="p-3 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Date</th>
                    <th className="p-3 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Status</th>
                    <th className="p-3 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {latestMyBookings.map((b, idx) => {
                    const status = getStatusBadgeSimple(b.status);
                    return (
                      <tr key={b._id} className="transition-colors hover:bg-gray-50/80 cursor-pointer" onClick={() => navigate("/mybookings")}>
                        <td className="p-3">
                          <span className="text-xs font-semibold text-gray-400">#{idx + 1}</span>
                        </td>
                        <td className="p-3">
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{b.cabinId?.name || 'Unknown'}</p>
                            <p className="text-[10px] text-gray-400 flex items-center gap-1">
                              <MapPin size={10} /> {b.cabinId?.address?.split(',')[0] || 'N/A'}
                            </p>
                          </div>
                        </td>
                        <td className="p-3">
                          <p className="text-sm text-gray-700">{b.startDate}</p>
                          <p className="text-[10px] text-gray-400">{b.startTime} - {b.endTime}</p>
                        </td>
                        <td className="p-3">
                          <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${status.color}`}>{status.label}</span>
                        </td>
                        <td className="p-3">
                          <span className="text-sm font-bold text-indigo-600">₹{b.totalPrice}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Row 7: My Cabin Bookings Table */}
        <div className="admin-dash__card mt-4" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}>
          <div className="admin-dash__card-header flex flex-wrap items-center justify-between gap-3" style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb' }}>
            <div className="flex items-center gap-3">
              <h3 className="admin-dash__card-title text-sm">My Cabin Bookings</h3>
              <span className="px-2.5 py-0.5 text-xs font-bold text-amber-700 bg-amber-100 rounded-full">
                {latestCabinBookings.length}
              </span>
            </div>
            <button
              onClick={() => navigate("/cabin-bookings")}
              className="text-xs font-medium text-amber-600 hover:text-amber-800 transition-colors flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-lg hover:bg-amber-100"
            >
              View All <ArrowUpRight size={12} />
            </button>
          </div>
          <div className="admin-dash__card-body p-0 overflow-x-auto" style={{ backgroundColor: '#ffffff' }}>
            {latestCabinBookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-12 text-gray-400">
                <Building2 size={36} className="opacity-20" />
                <p className="text-sm font-medium">No cabin bookings found</p>
              </div>
            ) : (
              <table className="w-full min-w-[700px] text-left">
                <thead>
                  <tr className="border-b border-gray-100" style={{ backgroundColor: '#f9fafb' }}>
                    <th className="p-3 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">#</th>
                    <th className="p-3 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Cabin</th>
                    <th className="p-3 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Customer</th>
                    <th className="p-3 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Date</th>
                    <th className="p-3 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Status</th>
                    <th className="p-3 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {latestCabinBookings.map((b, idx) => {
                    const status = getStatusBadgeSimple(b.status);
                    return (
                      <tr key={b._id} className="transition-colors hover:bg-gray-50/80 cursor-pointer" onClick={() => navigate("/cabin-bookings")}>
                        <td className="p-3">
                          <span className="text-xs font-semibold text-gray-400">#{idx + 1}</span>
                        </td>
                        <td className="p-3">
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{b.cabinId?.name || 'Unknown'}</p>
                            <p className="text-[10px] text-gray-400 flex items-center gap-1">
                              <MapPin size={10} /> {b.cabinId?.address?.split(',')[0] || 'N/A'}
                            </p>
                          </div>
                        </td>
                        <td className="p-3">
                          <p className="font-medium text-gray-800 text-sm">{b.name || b.userId?.name || 'Unknown'}</p>
                          <p className="text-[10px] text-gray-400">{b.mobile || b.userId?.mobile || 'N/A'}</p>
                        </td>
                        <td className="p-3">
                          <p className="text-sm text-gray-700">{b.startDate}</p>
                          <p className="text-[10px] text-gray-400">{b.startTime} - {b.endTime}</p>
                        </td>
                        <td className="p-3">
                          <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${status.color}`}>{status.label}</span>
                        </td>
                        <td className="p-3">
                          <span className="text-sm font-bold text-amber-600">₹{b.totalPrice}</span>
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

export default UserDashboard;