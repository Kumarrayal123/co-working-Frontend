// DoctorDashboard.jsx - With Profile Completion Circle
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
  Percent,
  Sparkles,
  Zap,
  Gift,
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
import "./Dashboard.css";

const API_URL = "https://spaceapi.iryax.com";
const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000";

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

const DoctorDashboard = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [missingFields, setMissingFields] = useState([]);
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  
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

  // My Chambers data
  const [chambers, setChambers] = useState([]);
  const [chamberCount, setChamberCount] = useState(0);

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

  // Calculate profile completion percentage
  const calculateCompletion = (userData) => {
    const fields = [
      { key: 'name', label: 'Full Name', required: true },
      { key: 'email', label: 'Email Address', required: true },
      { key: 'mobile', label: 'Mobile Number', required: true },
      { key: 'address', label: 'Address', required: true },
      { key: 'organizationName', label: 'Organization Name', required: false },
      { key: 'gstNumber', label: 'GST Number', required: false },
      { key: 'dmhoNumber', label: 'DMHO Number', required: false },
      { key: 'panNumber', label: 'PAN Number', required: false },
      { key: 'adharCardStatus', label: 'Aadhar Card', required: false, isDoc: true },
      { key: 'panCardStatus', label: 'PAN Card', required: false, isDoc: true },
      { key: 'mbbsCertificateStatus', label: 'MBBS Certificate', required: false, isDoc: true },
      { key: 'pmcRegistrationStatus', label: 'PMC Registration', required: false, isDoc: true },
      { key: 'nmrIdStatus', label: 'NMR ID', required: false, isDoc: true },
    ];

    let completed = 0;
    let total = 0;
    const missing = [];

    fields.forEach(field => {
      const value = userData[field.key];
      
      if (field.isDoc) {
        if (value === 'approved') {
          completed++;
        }
        total++;
        if (value !== 'approved') {
          missing.push(field.label);
        }
      } else {
        if (field.required) {
          total++;
          if (value && value.toString().trim() !== '') {
            completed++;
          } else {
            missing.push(field.label);
          }
        } else {
          if (value && value.toString().trim() !== '') {
            completed++;
          }
          total++;
        }
      }
    });

    let percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    if (userData._id && percentage < 10) {
      percentage = 10;
    }

    return { percentage, missing };
  };

  // Animate percentage on load
  useEffect(() => {
    if (completionPercentage > 0) {
      let start = 0;
      const duration = 1500;
      const step = Math.max(1, Math.floor(completionPercentage / 60));
      
      const timer = setInterval(() => {
        start += step;
        if (start >= completionPercentage) {
          setAnimatedPercentage(completionPercentage);
          clearInterval(timer);
        } else {
          setAnimatedPercentage(start);
        }
      }, 20);
      
      return () => clearInterval(timer);
    }
  }, [completionPercentage]);

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
        const { percentage, missing } = calculateCompletion(res.data.user);
        setCompletionPercentage(percentage);
        setMissingFields(missing);
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
      fetchChambers(userId);
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

  // ─── FETCH MY CHAMBER BOOKINGS ───
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
      console.error("Failed to fetch chamber bookings:", error);
    }
  };

  // ─── FETCH MY CHAMBERS ───
  const fetchChambers = async (userId) => {
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
      const chamberList = Array.isArray(data) ? data : [];
      setChambers(chamberList);
      setChamberCount(chamberList.length);
    } catch (err) {
      console.error("Error fetching chambers:", err);
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

  const getImageUrl = (img) => {
    if (!img) return PLACEHOLDER_IMAGE;
    if (img.startsWith("http")) return img;
    const cleanPath = img.replace(/\\/g, "/").replace(/^\/+/, "");
    return `${API_URL}/${cleanPath}`;
  };

  const getChamberStatus = (chamber) => {
    if (chamber.isActive === true) {
      return { status: 'Active', color: 'green' };
    }
    return { status: 'Inactive', color: 'gray' };
  };

  // Circular Progress Component
  const CircularProgress = ({ percentage, size = 100, strokeWidth = 8 }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;
    
    const getColor = (p) => {
      if (p >= 80) return '#10b981';
      if (p >= 50) return '#f59e0b';
      return '#ef4444';
    };
    const color = getColor(percentage);

    return (
      <div className="relative inline-flex items-center justify-center">
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-500 ease-in-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold" style={{ color: color }}>
            {percentage}%
          </span>
          <span className="text-[7px] font-medium text-gray-500 uppercase tracking-wider">
            Complete
          </span>
        </div>
      </div>
    );
  };

  const getCompletionColor = (percentage) => {
    if (percentage >= 80) return 'text-emerald-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-red-500';
  };

  const getCompletionBgColor = (percentage) => {
    if (percentage >= 80) return 'bg-emerald-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getCompletionEmoji = (percentage) => {
    if (percentage >= 80) return '🎉';
    if (percentage >= 50) return '📈';
    if (percentage >= 30) return '📝';
    return '⚠️';
  };

  if (loading) {
    return (
      <div className="admin-dash">
        <DoctorNavbar />
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
        <DoctorNavbar />
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

  // ✅ STATS CARDS
  const statsCards = [
    {
      label: "My Bookings",
      value: totalBookings,
      meta: `${monthlyStats?.bookingsThisMonth || 0} this month`,
      icon: Calendar,
      iconBg: "bg-indigo-100 text-indigo-600",
      onClick: () => navigate("/doctorbookings")
    },
    {
      label: "My Chambers",
      value: myCabinsCount,
      meta: `${totalCabins} total spaces available`,
      icon: Home,
      iconBg: "bg-emerald-100 text-emerald-600",
      onClick: () => navigate("/mychambers")
    },
    {
      label: "Chamber Bookings",
      value: cabinBookingsCount,
      meta: `₹${cabinRevenue.toLocaleString('en-IN')} revenue`,
      icon: Building2,
      iconBg: "bg-rose-100 text-rose-600",
      onClick: () => navigate("/chamberbookings")
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
      onClick: () => navigate("/doctorwallet")
    }
  ];

  // ✅ FOOTER STATS - 4 cards
  // const footerStats = [
  //   {
  //     label: "Total Revenue",
  //     value: formatCurrency(cabinRevenue),
  //     icon: IndianRupee,
  //     iconBg: "bg-emerald-100 text-emerald-600"
  //   },
  //   {
  //     label: "Total Bookings",
  //     value: cabinBookingsCount,
  //     icon: Calendar,
  //     iconBg: "bg-blue-100 text-blue-600"
  //   },
  //   {
  //     label: "Wallet Withdrawals",
  //     value: wallet.withdrawals || 0,
  //     icon: Wallet,
  //     iconBg: "bg-rose-100 text-rose-600"
  //   }
  // ];

  const latestMyBookings = myBookings.slice(0, 5);
  const latestCabinBookings = myCabinBookings.slice(0, 5);

  // Get profile user name
  const profileName = profile?.name || user?.name || 'Doctor';

  return (
    <div className="admin-dash" style={{ backgroundColor: '#ffffff' }}>
      <DoctorNavbar />

      <div className="pt-20 px-3 sm:px-4 md:px-6 lg:px-8 max-w-full mx-auto pb-16">
        {/* Header with Profile Completion */}
        <div className="admin-dash__header" style={{ marginBottom: "8px" }}>
          <div>
            <h1 className="admin-dash__greeting" style={{ fontSize: "1.25rem" }}>
              Doctor <span>Dashboard</span>
            </h1>
            <p className="admin-dash__subtitle" style={{ fontSize: "11px" }}>
              Welcome back, <span className="font-semibold text-gray-700">{profileName}</span>
            </p>
          </div>
        </div>

        {/* Profile Completion Card with Circular Progress */}
        <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-xl border border-indigo-200 shadow-sm p-3 sm:p-4 mb-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            {/* Circular Progress */}
            <div className="flex-shrink-0 flex justify-center">
              <CircularProgress 
                percentage={animatedPercentage || completionPercentage} 
                size={80}
                strokeWidth={7}
              />
            </div>

            {/* Details */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-lg">{getCompletionEmoji(completionPercentage)}</span>
                <h3 className="text-xs font-semibold text-gray-800">Profile Completion</h3>
              </div>
              
              <div className="flex flex-wrap items-center gap-1.5">
                <div className="flex items-center gap-1 bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded-lg border border-gray-200">
                  <span className="text-[8px] font-medium text-gray-500">Completed:</span>
                  <span className={`text-xs font-bold ${getCompletionColor(completionPercentage)}`}>{completionPercentage}%</span>
                </div>
                <div className="flex items-center gap-1 bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded-lg border border-gray-200">
                  <span className="text-[8px] font-medium text-gray-500">Pending:</span>
                  <span className="text-xs font-bold text-amber-600">{missingFields.length}</span>
                </div>
              </div>

              {missingFields.length > 0 && (
                <div className="mt-1 flex flex-wrap items-center gap-1 bg-white/60 backdrop-blur-sm px-2 py-1 rounded-lg border border-amber-200">
                  <AlertTriangle size={10} className="text-amber-500 flex-shrink-0" />
                  <p className="text-[8px] text-gray-700">
                    <span className="font-semibold text-amber-600">{missingFields.length}</span> fields remaining
                  </p>
                  <button
                    onClick={() => navigate("/doctorprofile")}
                    className="inline-flex items-center gap-0.5 text-[8px] font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    Complete Now <ArrowRight size={8} />
                  </button>
                </div>
              )}
              
              {missingFields.length === 0 && (
                <div className="mt-1 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                  <CheckCircle size={10} className="text-emerald-500" />
                  <p className="text-[8px] font-medium text-emerald-700">Your profile is 100% complete! 🎉</p>
                </div>
              )}

              {/* Missing Fields Tags - Small */}
              {/* (Hidden on doctor dashboard for cleaner parity with /userdashboard) */}
            </div>
            
            {/* Quick Action Button */}
            <button
              onClick={() => navigate("/doctorprofile")}
              className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 bg-indigo-600 text-white rounded-lg text-[10px] font-medium hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
            >
              <User size={12} />
              View Profile
            </button>
          </div>
        </div>

        {/* Row 1: Stats Cards */}
        <div className="admin-dash__stats" style={{ marginBottom: "16px" }}>
          {statsCards.map((stat, index) => (
            <div
              key={index}
              className="admin-dash__stat cursor-pointer"
              onClick={stat.onClick}
              style={{
                padding: "12px 14px",
                minHeight: "80px",
              }}
            >
              <div className="admin-dash__stat-top">
                <span className="admin-dash__stat-label" style={{ fontSize: "11px" }}>
                  {stat.label}
                </span>
                <div
                  className={`admin-dash__stat-icon ${stat.iconBg}`}
                  style={{ width: "28px", height: "28px" }}
                >
                  <stat.icon size={14} />
                </div>
              </div>
              <div className="admin-dash__stat-value" style={{ fontSize: "18px", fontWeight: "700" }}>
                {stat.value}
              </div>
              <div className="admin-dash__stat-meta" style={{ fontSize: "9px" }}>
                {stat.meta}
              </div>
            </div>
          ))}
        </div>

        {/* Row 2: Footer Stats */}
        {/* <div className="admin-dash__stats mt-4">
          {footerStats.map((stat, index) => (
            <div
              key={index}
              className="admin-dash__stat"
              style={{
                padding: "12px 14px",
                minHeight: "80px",
              }}
            >
              <div className="admin-dash__stat-top">
                <span className="admin-dash__stat-label" style={{ fontSize: "11px" }}>
                  {stat.label}
                </span>
                <div
                  className={`admin-dash__stat-icon ${stat.iconBg}`}
                  style={{ width: "28px", height: "28px" }}
                >
                  <stat.icon size={14} />
                </div>
              </div>
              <div className="admin-dash__stat-value" style={{ fontSize: "18px", fontWeight: "700" }}>
                {stat.value}
              </div>
            </div>
          ))}
        
          <div className="admin-dash__stat" style={{ visibility: 'hidden' }}>
          </div>
        </div> */}

        {/* Row 3: Filter Section (match /userdashboard style) */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 mb-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                <Filter size={16} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-800">Filters</h4>
                <p className="text-[10px] text-gray-400">Refine analytics view</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
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

              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-500">From</span>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-500">To</span>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                />
              </div>

              <button
                onClick={applyFilters}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition flex items-center gap-2 shadow-sm shadow-indigo-200"
              >
                <Filter size={16} />
                Apply
              </button>

              {(selectedMonth !== "all" || selectedStatus !== "all" || dateFrom || dateTo) && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Row 4: Charts & Quick Stats Section - (Keep existing code) */}
        <div className="admin-dash__charts-grid mt-6">
          {/* Monthly Bookings Chart - Left side */}
          <div className="admin-dash__card admin-dash__chart-wrap">
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

          {/* Quick Stats - Right side */}
          <div className="admin-dash__card admin-dash__chart-wrap">
            <div className="admin-dash__card-header py-3 px-4">
              <h3 className="admin-dash__card-title text-sm">Quick Overview</h3>
            </div>
            <div className="admin-dash__card-body flex-1 p-4">
              <div className="grid grid-cols-2 gap-3 h-full">
                {/* Total Earnings Card */}
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl p-3 flex flex-col items-center justify-center border border-emerald-200/50">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center mb-2">
                    <IndianRupee size={20} className="text-emerald-600" />
                  </div>
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Earnings</p>
                  <p className="text-lg font-bold text-emerald-700">₹{cabinRevenue.toLocaleString('en-IN')}</p>
                  <p className="text-[8px] text-emerald-500/70">Total earned</p>
                </div>

                {/* Active Bookings Card */}
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-xl p-3 flex flex-col items-center justify-center border border-indigo-200/50">
                  <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center mb-2">
                    <Activity size={20} className="text-indigo-600" />
                  </div>
                  <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Active</p>
                  <p className="text-lg font-bold text-indigo-700">{statusDistribution?.active || 0}</p>
                  <p className="text-[8px] text-indigo-500/70">Current bookings</p>
                </div>

                {/* Completion Rate Card */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-3 flex flex-col items-center justify-center border border-blue-200/50">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mb-2">
                    <TrendingUp size={20} className="text-blue-600" />
                  </div>
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Completion</p>
                  <p className="text-lg font-bold text-blue-700">
                    {totalBookings > 0 ? Math.round((statusDistribution?.completed || 0) / totalBookings * 100) : 0}%
                  </p>
                  <p className="text-[8px] text-blue-500/70">Completed rate</p>
                </div>

                {/* Total Chambers Card */}
                <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl p-3 flex flex-col items-center justify-center border border-amber-200/50">
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center mb-2">
                    <Building2 size={20} className="text-amber-600" />
                  </div>
                  <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Chambers</p>
                  <p className="text-lg font-bold text-amber-700">{myCabinsCount}</p>
                  <p className="text-[8px] text-amber-500/70">Total spaces</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Row 5: My Chambers Section - (Keep existing code) */}
        <div className="admin-dash__card mt-6" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}>
          <div className="admin-dash__card-header flex flex-wrap items-center justify-between gap-3" style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb' }}>
            <div className="flex items-center gap-3">
              <h3 className="admin-dash__card-title text-sm">My Chambers</h3>
              <span className="px-2.5 py-0.5 text-xs font-bold text-indigo-700 bg-indigo-100 rounded-full">
                {chambers.length}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => navigate("/mychambers")}
                className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100"
              >
                View All <ArrowUpRight size={12} />
              </button>
            </div>
          </div>
          <div className="admin-dash__card-body p-0 overflow-x-auto" style={{ backgroundColor: '#ffffff' }}>
            {chambers.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-12 text-gray-400">
                <Home size={36} className="opacity-20" />
                <p className="text-sm font-medium">No chambers found</p>
                <button
                  onClick={() => navigate("/mychambers")}
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-800 mt-2 bg-indigo-50 px-4 py-2 rounded-lg hover:bg-indigo-100"
                >
                  Go to My Chambers
                </button>
              </div>
            ) : (
              <table className="w-full min-w-[700px] text-left">
                <thead>
                  <tr className="border-b border-gray-100" style={{ backgroundColor: '#f9fafb' }}>
                    <th className="p-3 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">S.No</th>
                    <th className="p-3 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Chamber</th>
                    <th className="p-3 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Address</th>
                    <th className="p-3 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Type</th>
                    <th className="p-3 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Price</th>
                    <th className="p-3 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Status</th>
                    <th className="p-3 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {chambers.slice(0, 5).map((chamber, index) => {
                    const chamberStatus = getChamberStatus(chamber);
                    const isExclusive = chamber.cabinType === 'exclusive';
                    return (
                      <tr key={chamber._id} className="transition-colors hover:bg-gray-50/80 cursor-pointer" onClick={() => navigate(`/cabin/${chamber._id}`)}>
                        <td className="p-3">
                          <span className="text-xs font-semibold text-gray-400">{index + 1}</span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2.5">
                            <div className="flex-shrink-0 w-8 h-8 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                              <img
                                src={chamber.images?.[0] ? getImageUrl(chamber.images[0]) : PLACEHOLDER_IMAGE}
                                alt={chamber.name}
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }}
                              />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">{chamber.name || 'N/A'}</p>
                              <p className="text-[10px] text-gray-400">{chamber.cabin || 'N/A'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="text-sm text-gray-600 flex items-center gap-1">
                            <MapPin size={12} className="text-gray-400" />
                            <span className="truncate max-w-[120px]">{chamber.address || "N/A"}</span>
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
                          <span className="text-sm font-bold text-gray-900">₹{chamber.price || 0}</span>
                          <span className="text-[10px] text-gray-400">/hr</span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${
                            chamberStatus.color === 'green' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {chamberStatus.status}
                          </span>
                        </td>
                        <td className="p-3">
                          <button
                            onClick={(e) => { e.stopPropagation(); navigate(`/cabin/${chamber._id}`); }}
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

        {/* Row 6: My Latest Bookings Table - (Keep existing code) */}
        <div className="admin-dash__card mt-4" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}>
          <div className="admin-dash__card-header flex flex-wrap items-center justify-between gap-3" style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb' }}>
            <div className="flex items-center gap-3">
              <h3 className="admin-dash__card-title text-sm">My Latest Bookings</h3>
              <span className="px-2.5 py-0.5 text-xs font-bold text-indigo-700 bg-indigo-100 rounded-full">
                {latestMyBookings.length}
              </span>
            </div>
            <button
              onClick={() => navigate("/doctorbookings")}
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
                    <th className="p-3 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">S.No</th>
                    <th className="p-3 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Chamber</th>
                    <th className="p-3 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Date</th>
                    <th className="p-3 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Status</th>
                    <th className="p-3 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {latestMyBookings.map((b, idx) => {
                    const status = getStatusBadgeSimple(b.status);
                    const cabinName = b.cabin?.name || b.cabinName || 'Unknown';
                    const cabinAddress = b.cabin?.address || b.cabinAddress || 'N/A';
                    return (
                      <tr key={b._id} className="transition-colors hover:bg-gray-50/80 cursor-pointer" onClick={() => navigate("/doctorbookings")}>
                        <td className="p-3">
                          <span className="text-xs font-semibold text-gray-400">{idx + 1}</span>
                        </td>
                        <td className="p-3">
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{cabinName}</p>
                            <p className="text-[10px] text-gray-400 flex items-center gap-1">
                              <MapPin size={10} /> {cabinAddress?.split(',')[0] || 'N/A'}
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

        {/* Row 7: My Chamber Bookings Table - (Keep existing code) */}
        <div className="admin-dash__card mt-4" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}>
          <div className="admin-dash__card-header flex flex-wrap items-center justify-between gap-3" style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb' }}>
            <div className="flex items-center gap-3">
              <h3 className="admin-dash__card-title text-sm">My Chamber Bookings</h3>
              <span className="px-2.5 py-0.5 text-xs font-bold text-amber-700 bg-amber-100 rounded-full">
                {latestCabinBookings.length}
              </span>
            </div>
            <button
              onClick={() => navigate("/chamberbookings")}
              className="text-xs font-medium text-amber-600 hover:text-amber-800 transition-colors flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-lg hover:bg-amber-100"
            >
              View All <ArrowUpRight size={12} />
            </button>
          </div>
          <div className="admin-dash__card-body p-0 overflow-x-auto" style={{ backgroundColor: '#ffffff' }}>
            {latestCabinBookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-12 text-gray-400">
                <Building2 size={36} className="opacity-20" />
                <p className="text-sm font-medium">No chamber bookings found</p>
              </div>
            ) : (
              <table className="w-full min-w-[700px] text-left">
                <thead>
                  <tr className="border-b border-gray-100" style={{ backgroundColor: '#f9fafb' }}>
                    <th className="p-3 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">S.No</th>
                    <th className="p-3 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Chamber</th>
                    <th className="p-3 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Customer</th>
                    <th className="p-3 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Date</th>
                    <th className="p-3 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Status</th>
                    <th className="p-3 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Amount</th>
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
                      <tr key={b._id} className="transition-colors hover:bg-gray-50/80 cursor-pointer" onClick={() => navigate("/chamberbookings")}>
                        <td className="p-3">
                          <span className="text-xs font-semibold text-gray-400">{idx + 1}</span>
                        </td>
                        <td className="p-3">
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{cabinName}</p>
                            <p className="text-[10px] text-gray-400 flex items-center gap-1">
                              <MapPin size={10} /> {cabinAddress?.split(',')[0] || 'N/A'}
                            </p>
                          </div>
                        </td>
                        <td className="p-3">
                          <p className="font-medium text-gray-800 text-sm">{customerName}</p>
                          <p className="text-[10px] text-gray-400">{customerMobile}</p>
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

export default DoctorDashboard;





