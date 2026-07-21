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
  Percent
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import UsersNavbar from "./UsersNavbar";
import "./Dashboard.css";

const API_URL = "https://spaceapi.iryax.com";
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

// Load Razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

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
  
  // Add Cabin Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [pricingPlans, setPricingPlans] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    capacity: "",
    address: "",
    price: "",
    cabin: "",
    cabinType: "normal",
    amenities: {
      wifi: false,
      parking: false,
      lockers: false,
      privateWashroom: false,
      secureAccess: false,
      comfortSeating: false,
      coffee: false,
      gym: false,
      ac: false,
      tv: false,
      printer: false,
      phone: false,
    },
  });
  
  const navigate = useNavigate();

  const getAmenitiesForType = (type) => {
    return type === 'exclusive' ? EXCLUSIVE_AMENITIES : NORMAL_AMENITIES;
  };

  const resetAmenitiesForType = (type) => {
    const amenitiesKeys = getAmenitiesForType(type).map(a => a.key);
    const newAmenities = {};
    amenitiesKeys.forEach(key => {
      newAmenities[key] = false;
    });
    setFormData(prev => ({
      ...prev,
      amenities: newAmenities
    }));
  };

  useEffect(() => {
    loadRazorpayScript().then((loaded) => {
      setRazorpayLoaded(loaded);
      if (!loaded) {
        toast.error("Failed to load Razorpay. Please refresh the page.");
      }
    });
  }, []);

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

  // ─── PIE CHART COMPONENT ───
  const PieChartComponent = ({ data }) => {
    const total = Object.values(data).reduce((a, b) => a + b, 0) || 1;
    
    const segments = [
      { key: 'pending', label: 'Pending', color: '#f59e0b', gradient: 'from-amber-400 to-orange-500' },
      { key: 'confirmed', label: 'Confirmed', color: '#3b82f6', gradient: 'from-blue-400 to-indigo-500' },
      { key: 'active', label: 'Active', color: '#8b5cf6', gradient: 'from-violet-400 to-purple-500' },
      { key: 'completed', label: 'Completed', color: '#10b981', gradient: 'from-emerald-400 to-green-500' },
      { key: 'cancelled', label: 'Cancelled', color: '#ef4444', gradient: 'from-rose-400 to-red-500' }
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
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-medium bg-gradient-to-r ${seg.gradient} text-white shadow-sm`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: seg.color }}></span>
              {seg.label}: {data[seg.key]} ({Math.round((data[seg.key] / total) * 100)}%)
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ─── ADD CABIN FUNCTIONS ───
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCabinTypeChange = (type) => {
    setFormData({ ...formData, cabinType: type });
    resetAmenitiesForType(type);
  };

  const toggleAmenity = (key) => {
    setFormData((prev) => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [key]: !prev.amenities[key],
      },
    }));
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const calculateGST = (amount) => {
    const gstAmount = amount * GST_RATE;
    const totalWithGST = amount + gstAmount;
    return { gstAmount, totalWithGST };
  };

  const getFeeWithGST = () => {
    const isFirstCabin = cabinCount === 0;
    const baseFee = isFirstCabin ? 2000 : 1000;
    const { gstAmount, totalWithGST } = calculateGST(baseFee);
    return { baseFee, gstAmount, totalWithGST };
  };

  const getImageUrl = (img) => {
    if (!img) return PLACEHOLDER_IMAGE;
    if (img.startsWith("http")) return img;
    const cleanPath = img.replace(/\\/g, "/").replace(/^\/+/, "");
    return `${API_URL}/${cleanPath}`;
  };

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const initiateRazorpayPayment = async (cabinId, orderData) => {
    setPaymentProcessing(true);
    try {
      if (typeof window.Razorpay === 'undefined') {
        toast.error('Razorpay not loaded. Please refresh the page.');
        setPaymentProcessing(false);
        return;
      }

      const razorpayKey = orderData.razorpayKey || 'rzp_test_BxtRNvflG06PTV';
      
      const options = {
        key: razorpayKey,
        amount: orderData.order.amount * 100,
        currency: "INR",
        name: "Cabin Registration",
        description: `Cabin #${cabinCount + 1} Registration Fee (incl. GST)`,
        order_id: orderData.order.razorpayOrderId,
        handler: async function(response) {
          try {
            const verifyRes = await axios.post(
              `${API_URL}/api/cabins/verify-cabin-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                cabinId: cabinId
              },
              getAuthHeader()
            );

            if (verifyRes.data.success) {
              toast.success('Payment Successful! 🎉');
              setShowConfirmModal(false);
              setIsModalOpen(false);
              setPaymentProcessing(false);
              
              setFormData({
                name: "",
                description: "",
                capacity: "",
                address: "",
                price: "",
                cabin: "",
                cabinType: "normal",
                amenities: {
                  wifi: false,
                  parking: false,
                  lockers: false,
                  privateWashroom: false,
                  secureAccess: false,
                  comfortSeating: false,
                  coffee: false,
                  gym: false,
                  ac: false,
                  tv: false,
                  printer: false,
                  phone: false,
                },
              });
              setImages([]);
              setPricingPlans([]);
              await fetchCabins();
              await fetchUserDashboard();
            } else {
              toast.error('Payment verification failed');
              setPaymentProcessing(false);
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            toast.error("Payment verification failed");
            setPaymentProcessing(false);
          }
        },
        prefill: {
          name: localStorage.getItem("userName") || "",
          email: localStorage.getItem("userEmail") || "",
          contact: localStorage.getItem("userPhone") || "",
        },
        theme: {
          color: "#6366f1",
        },
        modal: {
          ondismiss: function() {
            toast.warning("Payment cancelled");
            setPaymentProcessing(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Razorpay error:", error);
      toast.error("Failed to initiate payment");
      setPaymentProcessing(false);
    }
  };

  const createCabinAndOrder = async () => {
    setSubmitting(true);
    const data = new FormData();
    const cabinName = formData.cabin ? `${formData.name} - ${formData.cabin}` : formData.name;
    data.append("name", cabinName);
    data.append("description", formData.description);
    data.append("capacity", formData.capacity);
    data.append("address", formData.address);
    data.append("price", formData.price);
    data.append("cabinType", formData.cabinType);
    data.append("pricingPlans", JSON.stringify(pricingPlans));
    data.append("amenities", JSON.stringify(formData.amenities));
    images.forEach((img) => data.append("images", img));

    try {
      const token = localStorage.getItem("token");
      
      const cabinRes = await axios.post(`${API_URL}/api/cabins`, data, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
      });

      const newCabin = cabinRes.data.cabin;
      toast.success("Cabin created successfully!");

      const orderRes = await axios.post(
        `${API_URL}/api/cabins/createcabinorder`,
        { cabinId: newCabin._id },
        getAuthHeader()
      );

      if (orderRes.data.success) {
        setShowConfirmModal(false);
        setSubmitting(false);
        await initiateRazorpayPayment(newCabin._id, orderRes.data);
      }
      
    } catch (err) {
      console.error("Error:", err);
      toast.error(err.response?.data?.error || "Failed to create cabin");
      setSubmitting(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.address || !formData.capacity || !formData.price || !formData.cabin) {
      toast.error("Please fill all required fields");
      return;
    }
    
    setShowConfirmModal(true);
  };

  const getCabinStatus = (cabin) => {
    if (cabin.isActive === true) {
      return { status: 'Active', color: 'green' };
    }
    return { status: 'Inactive', color: 'gray' };
  };

  const { baseFee, gstAmount, totalWithGST } = getFeeWithGST();
  const currentAmenities = getAmenitiesForType(formData.cabinType);
  const isFirstCabin = cabinCount === 0;

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

  const footerStats = [
    {
      label: "Total Cabins",
      value: totalCabins,
      icon: Home,
      iconBg: "bg-indigo-100 text-indigo-600"
    },
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
              Welcome <span>back</span>
            </h1>
            <p className="admin-dash__subtitle">
              {user?.name?.split(' ')[0] || 'User'}! Manage your workspace bookings and properties from one place.
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

        {/* Row 2: 4 Footer Stats Cards with Add Cabin Button - Capsule Style */}
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
          {/* Add Cabin Button - Capsule Style Blue Button */}
          <div 
            className="cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full px-6 py-4 flex items-center justify-center gap-3 hover:shadow-lg transition-all hover:scale-[1.02] shadow-md shadow-indigo-200"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={20} className="text-white" />
            <span className="font-bold text-sm tracking-wide">+ Cabin</span>
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
          <div className="admin-dash__card admin-dash__chart-wrap">
            <div className="admin-dash__card-header py-3 px-4">
              <h3 className="admin-dash__card-title text-sm">Booking Status</h3>
            </div>
            <div className="admin-dash__card-body flex-1 p-3">
              <PieChartComponent data={statusDistribution || { pending: 0, confirmed: 0, active: 0, completed: 0, cancelled: 0 }} />
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
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 transition-colors"
              >
                <Plus size={14} />
                <span className="hidden xs:inline">Add Cabin</span>
              </button>
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
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-800 mt-2 bg-indigo-50 px-4 py-2 rounded-lg hover:bg-indigo-100"
                >
                  Add Your First Cabin
                </button>
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

      {/* ─── ADD CABIN MODAL ─── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1100] flex items-end sm:items-center justify-center p-2 sm:p-4 bg-slate-900/50 backdrop-blur-sm">
          <div
            className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200"
            style={{ maxHeight: "95vh" }}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 sm:p-5 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-white/20 flex items-center justify-center">
                  <Home size={18} className="text-white sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white">
                    Add New Cabin #{cabinCount + 1}
                  </h2>
                  <p className="text-[10px] sm:text-xs text-white/75">
                    Fee: ₹{isFirstCabin ? '2,000' : '1,000'} + GST (18%)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-white/15 hover:bg-white/25 transition-colors flex items-center justify-center text-white"
              >
                <XIcon size={18} />
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="overflow-y-auto p-4 sm:p-6 flex-1">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                {/* Basic Info - Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Building Name *</label>
                    <input
                      className="w-full mt-1 px-3 py-2.5 sm:py-3 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                      type="text" name="name"
                      placeholder="e.g. Tech Hub"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Address *</label>
                    <input
                      className="w-full mt-1 px-3 py-2.5 sm:py-3 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                      type="text" name="address"
                      placeholder="e.g. Bangalore"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Cabin Details - Grid */}
                <div className="grid grid-cols-1 xs:grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Cabin Spec *</label>
                    <input
                      className="w-full mt-1 px-3 py-2.5 sm:py-3 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                      type="text" name="cabin"
                      placeholder="e.g. Office B"
                      value={formData.cabin}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Capacity *</label>
                    <input
                      className="w-full mt-1 px-3 py-2.5 sm:py-3 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                      type="number" name="capacity" min="1"
                      placeholder="10"
                      value={formData.capacity}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Price/hr *</label>
                    <input
                      className="w-full mt-1 px-3 py-2.5 sm:py-3 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                      type="number" name="price" min="0"
                      placeholder="25000"
                      value={formData.price}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Cabin Type */}
                <div>
                  <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Cabin Type</label>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-1">
                    <button
                      type="button"
                      onClick={() => handleCabinTypeChange("normal")}
                      className={`py-2.5 sm:py-3 px-3 rounded-xl text-xs sm:text-sm font-semibold border-2 transition-all ${
                        formData.cabinType === 'normal'
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Building2 size={14} className="inline mr-1.5" />
                      Normal
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCabinTypeChange("exclusive")}
                      className={`py-2.5 sm:py-3 px-3 rounded-xl text-xs sm:text-sm font-semibold border-2 transition-all ${
                        formData.cabinType === 'exclusive'
                          ? 'border-amber-500 bg-amber-50 text-amber-600'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Crown size={14} className="inline mr-1.5 text-amber-500" />
                      Exclusive
                    </button>
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Amenities</label>
                  <div className="grid grid-cols-2 xs:grid-cols-3 gap-1.5 sm:gap-2 mt-1">
                    {currentAmenities.map(item => {
                      const Icon = item.icon;
                      const isActive = formData.amenities[item.key] || false;
                      return (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => toggleAmenity(item.key)}
                          className={`flex items-center gap-1.5 sm:gap-2 p-2 sm:p-2.5 rounded-lg text-[10px] sm:text-xs font-semibold border transition-all ${
                            isActive
                              ? 'border-indigo-500 bg-indigo-50 text-indigo-600'
                              : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full border-2 ${
                            isActive ? 'border-indigo-500 bg-indigo-500' : 'border-slate-300'
                          }`}></span>
                          <Icon size={12} className="sm:w-3.5 sm:h-3.5" />
                          <span className="truncate">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Pricing Plans */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Pricing Plans</label>
                    <button
                      type="button"
                      onClick={() => {
                        const label = prompt("Plan Label:");
                        const hours = prompt("Included Hours:");
                        const cost = prompt("Cost (₹):");
                        const validity = prompt("Validity (Days):");
                        if (hours && cost && validity) {
                          setPricingPlans([...pricingPlans, {
                            label: (label || "").trim(),
                            hours: Number(hours),
                            cost: Number(cost),
                            validity: Number(validity)
                          }]);
                        }
                      }}
                      className="text-[10px] sm:text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 sm:px-3 py-1 rounded-lg hover:bg-indigo-100 transition-colors"
                    >
                      + Add Plan
                    </button>
                  </div>
                  {pricingPlans.length > 0 ? (
                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-1.5 sm:gap-2">
                      {pricingPlans.map((plan, idx) => (
                        <div key={idx} className="p-2 sm:p-2.5 bg-slate-50 rounded-lg text-[10px] sm:text-xs border border-slate-200 relative">
                          <div><strong>{plan.label || "Plan"}</strong></div>
                          <div>{plan.hours}h · ₹{plan.cost}</div>
                          <div className="text-slate-400">{plan.validity}d validity</div>
                          <button
                            type="button"
                            onClick={() => setPricingPlans(pricingPlans.filter((_, i) => i !== idx))}
                            className="absolute top-1 right-1 text-red-500 hover:text-red-700 text-xs font-bold"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[10px] sm:text-xs text-slate-400">No plans defined. Hourly booking only.</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Description</label>
                  <textarea
                    className="w-full mt-1 px-3 py-2.5 sm:py-3 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all resize-none"
                    name="description"
                    placeholder="Describe your workspace..."
                    value={formData.description}
                    onChange={handleChange}
                    rows={2}
                  />
                </div>

                {/* Images */}
                <div>
                  <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Photos</label>
                  <div className="mt-1 border-2 border-dashed border-indigo-200 rounded-xl p-4 sm:p-6 text-center hover:border-indigo-400 transition-colors relative">
                    <input
                      type="file" multiple accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Upload size={20} className="mx-auto text-indigo-400 sm:w-6 sm:h-6" />
                    <p className="text-[10px] sm:text-xs text-slate-500 mt-1">Click to upload photos</p>
                    <p className="text-[8px] sm:text-[10px] text-slate-400">PNG, JPG, WEBP</p>
                  </div>
                  {images.length > 0 && (
                    <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 gap-2 mt-2">
                      {images.map((file, index) => (
                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200">
                          <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Fee Summary */}
                <div className={`p-3 sm:p-4 rounded-xl ${
                  formData.cabinType === 'exclusive' ? 'bg-amber-50 border border-amber-200' : 'bg-emerald-50 border border-emerald-200'
                }`}>
                  <div className="flex items-center gap-2 sm:gap-3">
                    {formData.cabinType === 'exclusive' ? (
                      <Crown size={16} className="text-amber-600 sm:w-5 sm:h-5" />
                    ) : (
                      <CreditCard size={16} className="text-emerald-600 sm:w-5 sm:h-5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] sm:text-xs font-bold text-slate-700">
                        Cabin #{cabinCount + 1} {formData.cabinType === 'exclusive' ? '⭐ Exclusive' : 'Normal'}
                      </p>
                      <p className="text-[8px] sm:text-[10px] text-slate-600 truncate">
                        Base: ₹{baseFee} | GST: ₹{gstAmount.toFixed(2)} | Total: ₹{totalWithGST.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="py-2.5 sm:py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs sm:text-sm hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={paymentProcessing}
                    className={`py-2.5 sm:py-3 rounded-xl text-white font-bold text-xs sm:text-sm transition-all ${
                      paymentProcessing
                        ? 'bg-slate-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg'
                    }`}
                  >
                    {paymentProcessing ? (
                      <Loader2 size={16} className="animate-spin mx-auto" />
                    ) : (
                      `Pay ₹${totalWithGST.toFixed(2)}`
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ─── CONFIRM MODAL ─── */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm sm:max-w-md rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className={`p-4 sm:p-6 text-center ${
              formData.cabinType === 'exclusive' 
                ? 'bg-gradient-to-r from-amber-500 to-amber-600'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600'
            }`}>
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto">
                {formData.cabinType === 'exclusive' ? (
                  <Crown size={24} className="text-white sm:w-8 sm:h-8" />
                ) : (
                  <CreditCard size={24} className="text-white sm:w-8 sm:h-8" />
                )}
              </div>
              <h3 className="text-white font-bold text-base sm:text-lg mt-2">
                {formData.cabinType === 'exclusive' ? '⭐ Exclusive Cabin' : 'Confirm Cabin'}
              </h3>
              <p className="text-white/80 text-xs sm:text-sm">
                {formData.cabinType === 'exclusive' ? 'Premium exclusive cabin' : 'Review details below'}
              </p>
            </div>

            <div className="p-4 sm:p-6">
              <div className="bg-slate-50 rounded-xl p-3 sm:p-4 space-y-2 sm:space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Cabin</span><span className="font-semibold">#{cabinCount + 1}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Type</span>
                  <span className={`font-semibold ${formData.cabinType === 'exclusive' ? 'text-amber-600' : 'text-indigo-600'}`}>
                    {formData.cabinType === 'exclusive' ? '⭐ Exclusive' : 'Normal'}
                  </span>
                </div>
                <div className="flex justify-between"><span className="text-slate-500">Amenities</span>
                  <span className="font-semibold">{Object.values(formData.amenities).filter(v => v).length} / {currentAmenities.length}</span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between"><span className="text-slate-500">Base Fee</span><span>₹{baseFee}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">GST (18%)</span><span>₹{gstAmount.toFixed(2)}</span></div>
                <div className="border-t border-slate-200 pt-2 flex justify-between font-bold"><span>Total</span><span className="text-indigo-600">₹{totalWithGST.toFixed(2)}</span></div>
              </div>

              <div className="mt-3 sm:mt-4 p-2.5 sm:p-3 bg-amber-50 rounded-lg text-[10px] sm:text-xs text-amber-700 flex items-start gap-2">
                <Receipt size={14} className="shrink-0 mt-0.5" />
                <span>Total includes 18% GST (₹{gstAmount.toFixed(2)})</span>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-3 sm:mt-4">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  disabled={paymentProcessing}
                  className="py-2.5 sm:py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs sm:text-sm hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={createCabinAndOrder}
                  disabled={submitting || !razorpayLoaded || paymentProcessing}
                  className={`py-2.5 sm:py-3 rounded-xl text-white font-bold text-xs sm:text-sm transition-all ${
                    (submitting || !razorpayLoaded || paymentProcessing)
                      ? 'bg-slate-400 cursor-not-allowed'
                      : formData.cabinType === 'exclusive'
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:shadow-lg'
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg'
                  }`}
                >
                  {submitting || paymentProcessing ? (
                    <Loader2 size={16} className="animate-spin mx-auto" />
                  ) : !razorpayLoaded ? (
                    "Loading..."
                  ) : (
                    `Pay ₹${totalWithGST.toFixed(2)}`
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;