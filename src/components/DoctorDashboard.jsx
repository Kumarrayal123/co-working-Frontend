// DoctorDashboard.jsx - Complete Doctor Dashboard with Updated Add Chamber Modal
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
  Crown as CrownIcon
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DoctorNavbar from "./DoctorNavbar";
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

const DoctorDashboard = () => {
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

  // My Chambers data
  const [chambers, setChambers] = useState([]);
  const [chamberCount, setChamberCount] = useState(0);

  // ============================================
  // ADD CHAMBER MODAL STATES (UPDATED)
  // ============================================
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [pricingPlans, setPricingPlans] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  // ✅ New States for Updated Modal
  const [openTime, setOpenTime] = useState('09:00');
  const [closeTime, setCloseTime] = useState('21:00');
  const [is24x7, setIs24x7] = useState(false);
  const [isChamber, setIsChamber] = useState(false);

  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [videoPreviews, setVideoPreviews] = useState([]);

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

  // ─── GET USER ID FROM LOCALSTORAGE ───
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

  // ─── ADD CHAMBER FUNCTIONS (UPDATED) ───
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

  // Image handling
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  // Video handling
  const handleVideoChange = (e) => {
    const files = Array.from(e.target.files);
    setVideos(files);
    const previews = files.map(file => URL.createObjectURL(file));
    setVideoPreviews(previews);
  };

  const removeVideo = (index) => {
    setVideos(videos.filter((_, i) => i !== index));
    setVideoPreviews(videoPreviews.filter((_, i) => i !== index));
  };

  // Open/Close Time handlers
  const handleOpenTimeChange = (e) => {
    setOpenTime(e.target.value);
  };

  const handleCloseTimeChange = (e) => {
    setCloseTime(e.target.value);
  };

  const toggle24x7 = () => {
    setIs24x7(!is24x7);
    if (!is24x7) {
      setOpenTime('00:00');
      setCloseTime('23:59');
    } else {
      setOpenTime('09:00');
      setCloseTime('21:00');
    }
  };

  const toggleIsChamber = () => {
    setIsChamber(!isChamber);
  };

  const calculateGST = (amount) => {
    const gstAmount = amount * GST_RATE;
    const totalWithGST = amount + gstAmount;
    return { gstAmount, totalWithGST };
  };

  const getFeeWithGST = () => {
    const isFirstChamber = chamberCount === 0;
    const baseFee = isFirstChamber ? 2000 : 1000;
    const { gstAmount, totalWithGST } = calculateGST(baseFee);
    return { baseFee, gstAmount, totalWithGST };
  };

  const getImageUrl = (img) => {
    if (!img) return PLACEHOLDER_IMAGE;
    if (img.startsWith("http")) return img;
    const cleanPath = img.replace(/\\/g, "/").replace(/^\/+/, "");
    return `${API_URL}/${cleanPath}`;
  };

  const getMediaUrl = (media) => {
    if (!media) return null;
    if (media.startsWith("http")) return media;
    const cleanPath = media.replace(/\\/g, "/").replace(/^\/+/, "");
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
        name: "Chamber Registration",
        description: `Chamber #${chamberCount + 1} Registration Fee (incl. GST)`,
        order_id: orderData.order.razorpayOrderId,
        handler: async function (response) {
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
              setImagePreviews([]);
              setVideos([]);
              setVideoPreviews([]);
              setPricingPlans([]);
              setOpenTime('09:00');
              setCloseTime('21:00');
              setIs24x7(false);
              setIsChamber(false);

              const userId = getUserId();
              if (userId) {
                await fetchChambers(userId);
                await fetchUserDashboard(userId);
              }
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
          name: localStorage.getItem("doctorName") || "",
          email: localStorage.getItem("doctorEmail") || "",
          contact: localStorage.getItem("doctorPhone") || "",
        },
        theme: {
          color: "#6366f1",
        },
        modal: {
          ondismiss: function () {
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

  const createChamberAndOrder = async () => {
    setSubmitting(true);
    const data = new FormData();
    const chamberName = formData.cabin ? `${formData.name} - ${formData.cabin}` : formData.name;
    data.append("name", chamberName);
    data.append("description", formData.description);
    data.append("capacity", formData.capacity);
    data.append("address", formData.address);
    data.append("price", formData.price);
    data.append("cabinType", formData.cabinType);
    data.append("pricingPlans", JSON.stringify(pricingPlans));
    data.append("amenities", JSON.stringify(formData.amenities));

    // Add open/close time
    data.append("openTime", openTime);
    data.append("closeTime", closeTime);
    data.append("is24x7", is24x7 ? "true" : "false");
    data.append("isChamber", isChamber ? "true" : "false");

    images.forEach((img) => data.append("images", img));
    videos.forEach((video) => data.append("videos", video));

    try {
      const token = localStorage.getItem("token");

      const cabinRes = await axios.post(`${API_URL}/api/cabins`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
      });

      const newCabin = cabinRes.data.cabin;
      toast.success("Chamber created successfully!");

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
      toast.error(err.response?.data?.error || "Failed to create chamber");
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

    // Validate open/close time
    if (!is24x7) {
      if (!openTime || !closeTime) {
        toast.error("Please set both opening and closing times");
        return;
      }
      if (openTime >= closeTime) {
        toast.error("Opening time must be before closing time");
        return;
      }
    }

    setShowConfirmModal(true);
  };

  const getChamberStatus = (chamber) => {
    if (chamber.isActive === true) {
      return { status: 'Active', color: 'green' };
    }
    return { status: 'Inactive', color: 'gray' };
  };

  const { baseFee, gstAmount, totalWithGST } = getFeeWithGST();
  const currentAmenities = getAmenitiesForType(formData.cabinType);
  const isFirstChamber = chamberCount === 0;

  // Format time for display
  const formatTimeDisplay = (time) => {
    if (!time) return 'N/A';
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm}`;
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

 // ✅ FOOTER STATS - 3 cards with different info
const footerStats = [
  {
    label: "Total Revenue",
    value: formatCurrency(cabinRevenue),
    icon: IndianRupee,
    iconBg: "bg-emerald-100 text-emerald-600"
  },
  {
    label: "Total Bookings",
    value: cabinBookingsCount,
    icon: Calendar,
    iconBg: "bg-blue-100 text-blue-600"
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
      <DoctorNavbar />

      <div className="pt-24 px-3 sm:px-4 md:px-6 lg:px-8 max-w-full mx-auto pb-16">
        {/* Header */}
        <div className="admin-dash__header">
          <div>
            <h1 className="admin-dash__greeting">
              Doctor <span>Dashboard</span>
            </h1>
          </div>
        </div>

        {/* Row 1: Stats Cards */}
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

        {/* Row 2: Footer Stats + Add Chamber */}
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
          <div
            className="cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full px-6 py-4 flex items-center justify-center gap-3 hover:shadow-lg transition-all hover:scale-[1.02] shadow-md shadow-indigo-200"
            onClick={() => {
              setIsModalOpen(true);
              setImagePreviews([]);
              setVideoPreviews([]);
              setOpenTime('09:00');
              setCloseTime('21:00');
              setIs24x7(false);
              setIsChamber(false);
            }}
          >
            <Plus size={20} className="text-white" />
            <span className="font-bold text-sm tracking-wide">+ Chamber</span>
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

        {/* Row 4: Charts & Quick Stats Section (Pie Chart Removed) */}
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

          {/* Quick Stats - Right side (Replacing Pie Chart) */}
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

        {/* Row 5: My Chambers Section */}
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
                onClick={() => {
                  setIsModalOpen(true);
                  setImagePreviews([]);
                  setVideoPreviews([]);
                  setOpenTime('09:00');
                  setCloseTime('21:00');
                  setIs24x7(false);
                  setIsChamber(false);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 transition-colors"
              >
                <Plus size={14} />
                <span className="hidden xs:inline">Add Chamber</span>
              </button>
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
                  onClick={() => {
                    setIsModalOpen(true);
                    setImagePreviews([]);
                    setVideoPreviews([]);
                    setOpenTime('09:00');
                    setCloseTime('21:00');
                    setIs24x7(false);
                    setIsChamber(false);
                  }}
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-800 mt-2 bg-indigo-50 px-4 py-2 rounded-lg hover:bg-indigo-100"
                >
                  Add Your First Chamber
                </button>
              </div>
            ) : (
              <table className="w-full min-w-[700px] text-left">
                <thead>
                  <tr className="border-b border-gray-100" style={{ backgroundColor: '#f9fafb' }}>
                    <th className="p-3 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">#</th>
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
                          <span className="text-xs font-semibold text-gray-400">#{index + 1}</span>
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
                    <th className="p-3 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">#</th>
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
                          <span className="text-xs font-semibold text-gray-400">#{idx + 1}</span>
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

        {/* Row 7: My Chamber Bookings Table */}
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
                    <th className="p-3 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">#</th>
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
                          <span className="text-xs font-semibold text-gray-400">#{idx + 1}</span>
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

      {/* ============================================ */}
      {/* ADD CHAMBER MODAL - UPDATED (Same as MyChamber) */}
      {/* ============================================ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1100] flex items-end sm:items-center justify-center p-2 sm:p-4 bg-slate-900/50 backdrop-blur-sm">
          <div
            className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200"
            style={{ maxHeight: "95vh" }}
          >
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 sm:p-5 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-white/20 flex items-center justify-center">
                  <Home size={18} className="text-white sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white">
                    Add New Chamber #{chamberCount + 1}
                  </h2>
                  <p className="text-[10px] sm:text-xs text-white/75">
                    Fee: ₹{isFirstChamber ? '2,000' : '1,000'} + GST (18%)
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setImagePreviews([]);
                  setVideoPreviews([]);
                }}
                className="w-8 h-8 rounded-xl bg-white/15 hover:bg-white/25 transition-colors flex items-center justify-center text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="overflow-y-auto p-4 sm:p-6 flex-1">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Building Name *</label>
                    <input
                      className="w-full mt-1 px-3 py-2.5 sm:py-3 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                      type="text" name="name"
                      placeholder="e.g. Medical Center"
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

                <div className="grid grid-cols-1 xs:grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Room/Suite *</label>
                    <input
                      className="w-full mt-1 px-3 py-2.5 sm:py-3 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                      type="text" name="cabin"
                      placeholder="e.g. Suite 101"
                      value={formData.cabin}
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
                  <div>
                    <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Capacity *</label>
                    <input
                      className="w-full mt-1 px-3 py-2.5 sm:py-3 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                      type="number" name="capacity" min="1"
                      placeholder="e.g. 5"
                      value={formData.capacity}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* ✅ isChamber Checkbox */}
                <div>
                  <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Chamber Type</label>
                  <div className="mt-2 flex items-center gap-4">
                    <div
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border-2 cursor-pointer transition-all ${
                        isChamber
                          ? 'border-rose-500 bg-rose-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                      onClick={toggleIsChamber}
                    >
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                        isChamber ? 'bg-rose-500' : 'bg-slate-200'
                      }`}>
                        {isChamber && <Check size={14} className="text-white" />}
                      </div>
                      <div>
                        <span className="text-sm font-medium text-slate-700">This is a Chamber</span>
                        <p className="text-[10px] text-slate-400">Mark as dedicated chamber space</p>
                      </div>
                    </div>
                    {isChamber && (
                      <span className="text-xs font-bold text-rose-600 bg-rose-100 px-3 py-1 rounded-full">
                        ✅ Chamber
                      </span>
                    )}
                  </div>
                </div>

                {/* ✅ Open/Close Time Section */}
                <div>
                  <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Operating Hours *</label>
                  <div className="mt-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={toggle24x7}
                        className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
                          is24x7 ? 'bg-indigo-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                            is24x7 ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                      <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <ClockIcon size={16} className="text-indigo-500" />
                        24×7 Open
                      </span>
                      {is24x7 && (
                        <span className="text-xs text-emerald-600 font-bold">✅ Always Open</span>
                      )}
                    </div>

                    {!is24x7 && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Opening Time</label>
                          <div className="flex items-center gap-2 mt-1">
                            <Sun size={16} className="text-amber-500" />
                            <input
                              type="time"
                              value={openTime}
                              onChange={handleOpenTimeChange}
                              className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                              required={!is24x7}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Closing Time</label>
                          <div className="flex items-center gap-2 mt-1">
                            <Moon size={16} className="text-indigo-500" />
                            <input
                              type="time"
                              value={closeTime}
                              onChange={handleCloseTimeChange}
                              className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                              required={!is24x7}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  {!is24x7 && openTime && closeTime && openTime >= closeTime && (
                    <p className="text-[10px] text-red-500 mt-1">⚠️ Opening time must be before closing time</p>
                  )}
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
                    placeholder="Describe your chamber..."
                    value={formData.description}
                    onChange={handleChange}
                    rows={2}
                  />
                </div>

                {/* Image Upload */}
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
                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 gap-2 mt-2">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200">
                          <img src={preview} alt="preview" className="w-full h-full object-cover" />
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

                {/* Video Upload */}
                <div>
                  <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <Video size={14} /> Videos (Optional)
                  </label>
                  <div className="mt-1 border-2 border-dashed border-purple-200 rounded-xl p-4 sm:p-6 text-center hover:border-purple-400 transition-colors relative">
                    <input
                      type="file" multiple accept="video/*"
                      onChange={handleVideoChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <FileVideo size={24} className="mx-auto text-purple-400 sm:w-7 sm:h-7" />
                    <p className="text-[10px] sm:text-xs text-slate-500 mt-1">Click to upload videos</p>
                    <p className="text-[8px] sm:text-[10px] text-slate-400">MP4, WEBM, MOV</p>
                  </div>
                  {videoPreviews.length > 0 && (
                    <div className="grid grid-cols-2 xs:grid-cols-3 gap-2 mt-2">
                      {videoPreviews.map((preview, index) => (
                        <div key={index} className="relative rounded-lg overflow-hidden border border-slate-200 bg-black/5">
                          <video
                            src={preview}
                            className="w-full h-28 object-cover"
                            controls
                          />
                          <button
                            type="button"
                            onClick={() => removeVideo(index)}
                            className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs z-10"
                          >
                            ×
                          </button>
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <Play size={24} className="text-white/60 drop-shadow-lg" />
                          </div>
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
                      <CrownIcon size={16} className="text-amber-600 sm:w-5 sm:h-5" />
                    ) : (
                      <CreditCard size={16} className="text-emerald-600 sm:w-5 sm:h-5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] sm:text-xs font-bold text-slate-700">
                        Chamber #{chamberCount + 1} {formData.cabinType === 'exclusive' ? '⭐ Exclusive' : 'Normal'}
                        {isChamber && ' 🏛️ Chamber'}
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
                    onClick={() => {
                      setIsModalOpen(false);
                      setImagePreviews([]);
                      setVideoPreviews([]);
                    }}
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
                {formData.cabinType === 'exclusive' ? '⭐ Exclusive Chamber' : 'Confirm Chamber'}
                {isChamber && ' 🏛️'}
              </h3>
              <p className="text-white/80 text-xs sm:text-sm">
                {formData.cabinType === 'exclusive' ? 'Premium exclusive chamber' : 'Review details below'}
                {isChamber && ' (Marked as Chamber)'}
              </p>
            </div>

            <div className="p-4 sm:p-6">
              <div className="bg-slate-50 rounded-xl p-3 sm:p-4 space-y-2 sm:space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Chamber</span><span className="font-semibold">#{chamberCount + 1}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Type</span>
                  <span className={`font-semibold ${formData.cabinType === 'exclusive' ? 'text-amber-600' : 'text-indigo-600'}`}>
                    {formData.cabinType === 'exclusive' ? '⭐ Exclusive' : 'Normal'}
                  </span>
                </div>
                <div className="flex justify-between"><span className="text-slate-500">Chamber</span>
                  <span className={`font-semibold ${isChamber ? 'text-rose-600' : 'text-slate-400'}`}>
                    {isChamber ? '✅ Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between"><span className="text-slate-500">Capacity</span>
                  <span className="font-semibold">{formData.capacity} people</span>
                </div>
                <div className="flex justify-between"><span className="text-slate-500">Timing</span>
                  <span className="font-semibold">
                    {is24x7 ? '24×7' : `${formatTimeDisplay(openTime)} - ${formatTimeDisplay(closeTime)}`}
                  </span>
                </div>
                <div className="flex justify-between"><span className="text-slate-500">Amenities</span>
                  <span className="font-semibold">{Object.values(formData.amenities).filter(v => v).length} / {currentAmenities.length}</span>
                </div>
                <div className="flex justify-between"><span className="text-slate-500">Images</span>
                  <span className="font-semibold">{images.length} images</span>
                </div>
                <div className="flex justify-between"><span className="text-slate-500">Videos</span>
                  <span className="font-semibold">{videos.length} videos</span>
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
                  onClick={createChamberAndOrder}
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

export default DoctorDashboard;