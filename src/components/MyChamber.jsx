// MyChamber.jsx - Complete My Chambers Component with isChamber Checkbox & Image Popup
import axios from "axios";
import {
  Building2,
  CheckCircle,
  FileText,
  Home,
  IndianRupee,
  MapPin,
  Plus,
  Search,
  Trash2,
  Upload,
  Users,
  X,
  Building2 as BuildingIcon,
  CreditCard,
  Calendar,
  Clock,
  AlertCircle,
  Check,
  Loader2,
  Star,
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
  Clipboard,
  Receipt,
  Percent,
  Menu,
  ArrowLeft,
  Eye,
  Filter,
  XCircle,
  Timer,
  List as ListIcon,
  Grid as GridIcon,
  Video,
  Play,
  FileVideo,
  Sun,
  Moon,
  Clock as ClockIcon
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DoctorNavbar from "./DoctorNavbar";
import "./Dashboard.css";

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

const API_URL = "http://localhost:5003";
const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000";
const GST_RATE = 0.18;

// Normal Amenities
const NORMAL_AMENITIES = [
  { key: "wifi", label: "Wi-Fi", emoji: "📶", icon: Wifi },
  { key: "parking", label: "Parking", emoji: "🅿️", icon: ParkingCircle },
  { key: "lockers", label: "Lockers", emoji: "🔐", icon: Lock },
  { key: "comfortSeating", label: "Comfort Seating", emoji: "🪑", icon: Armchair },
];

// Exclusive Amenities
const EXCLUSIVE_AMENITIES = [
  { key: "wifi", label: "High-Speed Wi-Fi", emoji: "📶", icon: Wifi },
  { key: "parking", label: "Reserved Parking", emoji: "🅿️", icon: ParkingCircle },
  { key: "lockers", label: "Secure Lockers", emoji: "🔐", icon: Lock },
  { key: "privateWashroom", label: "Private Washroom", emoji: "🚿", icon: Bath },
  { key: "secureAccess", label: "24/7 Secure Access", emoji: "🛡️", icon: Shield },
  { key: "comfortSeating", label: "Premium Seating", emoji: "🪑", icon: Armchair },
  { key: "coffee", label: "Coffee & Tea", emoji: "☕", icon: Coffee },
  { key: "gym", label: "Gym Access", emoji: "💪", icon: Dumbbell },
  { key: "ac", label: "Air Conditioning", emoji: "❄️", icon: Fan },
  { key: "tv", label: "Smart TV", emoji: "📺", icon: Tv },
  { key: "printer", label: "Printer Access", emoji: "🖨️", icon: Printer },
  { key: "phone", label: "Conference Phone", emoji: "📞", icon: Phone },
];

const MyChamber = () => {
  const [chambers, setChambers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [pricingPlans, setPricingPlans] = useState([]);
  const [chamberCount, setChamberCount] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedChamber, setSelectedChamber] = useState(null);
  const [filters, setFilters] = useState({
    name: '',
    address: '',
    priceMin: '',
    priceMax: '',
    status: 'all'
  });
  const [countdowns, setCountdowns] = useState({});
  const navigate = useNavigate();

  // ✅ IMAGE POPUP STATE
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  // Open/Close Time state
  const [openTime, setOpenTime] = useState('09:00');
  const [closeTime, setCloseTime] = useState('21:00');
  const [is24x7, setIs24x7] = useState(false);
  
  // isChamber state
  const [isChamber, setIsChamber] = useState(false);

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
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [videoPreviews, setVideoPreviews] = useState([]);

  // ✅ IMAGE POPUP FUNCTIONS
  const openImagePopup = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowImagePopup(true);
  };

  const closeImagePopup = () => {
    setShowImagePopup(false);
    setSelectedImage('');
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

  // Countdown timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdowns(prev => {
        const updated = { ...prev };
        let hasChanges = false;
        Object.keys(updated).forEach(key => {
          if (updated[key] > 0) {
            updated[key] = updated[key] - 1;
            hasChanges = true;
          }
        });
        return hasChanges ? updated : prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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

  // ─── FETCH CHAMBERS ───
  const fetchChambers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        navigate("/login");
        return;
      }

      const res = await axios.get(`${API_URL}/api/cabins/user`, getAuthHeader());
      const data = res.data.cabins || res.data;
      const chamberList = Array.isArray(data) ? data : [];
      setChambers(chamberList);
      setChamberCount(chamberList.length);
      
      const initialCountdowns = {};
      chamberList.forEach(chamber => {
        if (chamber.expiryDate) {
          const expiry = new Date(chamber.expiryDate);
          const now = new Date();
          const diff = Math.max(0, Math.floor((expiry - now) / 1000));
          initialCountdowns[chamber._id] = diff;
        }
      });
      setCountdowns(initialCountdowns);
      
    } catch (err) {
      console.error("Error fetching chambers:", err);
      toast.error("Failed to fetch chambers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChambers();
  }, []);

  // ─── DELETE ───
  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this chamber?")) return;

    try {
      await axios.delete(`${API_URL}/api/cabins/${id}`, getAuthHeader());
      setChambers(chambers.filter(c => c._id !== id));
      setChamberCount(prev => prev - 1);
      toast.success("Chamber deleted successfully");
    } catch (error) {
      console.error("Error deleting chamber", error);
      toast.error("Failed to delete chamber");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
    const baseFee = isFirstChamber ? 2000 : 1000;
    const { gstAmount, totalWithGST } = calculateGST(baseFee);
    return { baseFee, gstAmount, totalWithGST };
  };

  // ─── PAYMENT ───
  const initiateRazorpayPayment = async (chamberId, orderData) => {
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
        handler: async function(response) {
          try {
            const verifyRes = await axios.post(
              `${API_URL}/api/cabins/verify-cabin-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                cabinId: chamberId
              },
              getAuthHeader()
            );

            if (verifyRes.data.success) {
              const transactionId = verifyRes.data.transactionId || 
                                   verifyRes.data.order?.transactionId || 
                                   'N/A';
              
              toast.success(
                <div>
                  <div style={{ fontWeight: 'bold' }}>Payment Successful! 🎉</div>
                  <div style={{ fontSize: '0.8rem', marginTop: '4px' }}>
                    Transaction ID: {transactionId}
                  </div>
                </div>,
                { autoClose: 5000 }
              );
              
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
              await fetchChambers();
            } else {
              toast.error('Payment verification failed');
              setPaymentProcessing(false);
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            toast.error(error.response?.data?.error || "Payment verification failed");
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
      toast.error("Failed to initiate payment: " + error.message);
      setPaymentProcessing(false);
    }
  };

  // ─── CREATE CHAMBER ───
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
    
    data.append("openTime", openTime);
    data.append("closeTime", closeTime);
    data.append("is24x7", is24x7 ? "true" : "false");
    data.append("isChamber", isChamber ? "true" : "false");
    
    images.forEach((img) => data.append("images", img));
    videos.forEach((video) => data.append("videos", video));

    try {
      const token = localStorage.getItem("token");
      
      const chamberRes = await axios.post(`${API_URL}/api/cabins`, data, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
      });

      const newChamber = chamberRes.data.cabin;
      toast.success("Chamber created successfully!");

      const orderRes = await axios.post(
        `${API_URL}/api/cabins/createcabinorder`,
        { cabinId: newChamber._id },
        getAuthHeader()
      );

      if (orderRes.data.success) {
        setShowConfirmModal(false);
        setSubmitting(false);
        await initiateRazorpayPayment(newChamber._id, orderRes.data);
      }
      
    } catch (err) {
      console.error("Error:", err);
      toast.error(err.response?.data?.error || "Failed to create chamber and order");
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

  // Filter chambers
  const filteredChambers = chambers.filter(chamber => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = chamber.name?.toLowerCase().includes(searchLower) ||
                         chamber.address?.toLowerCase().includes(searchLower);
    
    const matchesName = chamber.name?.toLowerCase().includes(filters.name.toLowerCase());
    const matchesAddress = chamber.address?.toLowerCase().includes(filters.address.toLowerCase());
    
    const price = chamber.price || 0;
    const matchesPriceMin = filters.priceMin === '' || price >= Number(filters.priceMin);
    const matchesPriceMax = filters.priceMax === '' || price <= Number(filters.priceMax);
    
    const isActive = chamber.isActive === true;
    const matchesStatus = filters.status === 'all' || 
                         (filters.status === 'active' && isActive) ||
                         (filters.status === 'inactive' && !isActive);
    
    return matchesSearch && matchesName && matchesAddress && 
           matchesPriceMin && matchesPriceMax && matchesStatus;
  });

  const getChamberStatus = (chamber) => {
    if (chamber.isActive === true) {
      return { status: 'Active', color: 'green' };
    }
    return { status: 'Inactive', color: 'gray' };
  };

  const isFirstChamber = chamberCount === 0;
  const currentAmenities = getAmenitiesForType(formData.cabinType);
  const { baseFee, gstAmount, totalWithGST } = getFeeWithGST();

  const handleViewChamber = (chamber) => {
    setSelectedChamber(chamber);
    setShowViewModal(true);
  };

  const closeViewModal = () => {
    setShowViewModal(false);
    setSelectedChamber(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCountdown = (seconds) => {
    if (!seconds || seconds <= 0) return 'Expired';
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (days > 0) {
      return `${days}d ${hours}h`;
    }
    return `${hours}h ${minutes}m`;
  };

  const getCountdownColor = (seconds) => {
    if (!seconds || seconds <= 0) return 'text-red-600';
    if (seconds < 86400) return 'text-orange-500';
    if (seconds < 172800) return 'text-yellow-500';
    return 'text-emerald-600';
  };

  const clearFilters = () => {
    setFilters({
      name: '',
      address: '',
      priceMin: '',
      priceMax: '',
      status: 'all'
    });
    setSearchTerm('');
  };

  const activeCount = chambers.filter(c => c.isActive === true).length;
  const inactiveCount = chambers.filter(c => c.isActive !== true).length;
  const exclusiveCount = chambers.filter(c => c.cabinType === 'exclusive').length;
  const chamberCountFilter = chambers.filter(c => c.isChamber === true).length;

  const formatTimeDisplay = (time) => {
    if (!time) return 'N/A';
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm}`;
  };

  // ============================================================
  // RETURN - JSX
  // ============================================================
  return (
    <div className="admin-dash" style={{ backgroundColor: '#ffffff' }}>
      <DoctorNavbar />

      <div className="pt-24 px-3 sm:px-4 md:px-6 lg:px-8 max-w-full mx-auto pb-16">
        {/* Header */}
        <div className="admin-dash__header">
          <div>
            <h1 className="admin-dash__greeting">
              My <span>Chambers</span>
            </h1>
          </div>
          
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 shadow-sm">
            <p className="text-xs text-gray-500 font-medium">Total Chambers</p>
            <p className="text-xl sm:text-2xl font-bold text-indigo-600">{chambers.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 shadow-sm">
            <p className="text-xs text-gray-500 font-medium">Active</p>
            <p className="text-xl sm:text-2xl font-bold text-emerald-600">{activeCount}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 shadow-sm">
            <p className="text-xs text-gray-500 font-medium">Inactive</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-600">{inactiveCount}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 shadow-sm">
            <p className="text-xs text-gray-500 font-medium">Exclusive</p>
            <p className="text-xl sm:text-2xl font-bold text-amber-600">{exclusiveCount}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 shadow-sm">
            <p className="text-xs text-gray-500 font-medium">Chambers</p>
            <p className="text-xl sm:text-2xl font-bold text-rose-600">{chamberCountFilter}</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Chambers Table Section */}
          <div className="admin-dash__card" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}>
            {/* Header with Filters */}
            <div className="admin-dash__card-header flex flex-wrap items-center justify-between gap-3" style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb' }}>
              <div className="flex items-center gap-3">
                <h3 className="admin-dash__card-title">Registered Chambers</h3>
                <span className="px-2.5 py-0.5 text-xs font-bold text-indigo-700 bg-indigo-100 rounded-full">
                  {filteredChambers.length}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  placeholder="Filter by name..."
                  value={filters.name}
                  onChange={(e) => setFilters({...filters, name: e.target.value})}
                  className="w-28 sm:w-36 px-3 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
                <input
                  type="text"
                  placeholder="Filter by address..."
                  value={filters.address}
                  onChange={(e) => setFilters({...filters, address: e.target.value})}
                  className="w-28 sm:w-36 px-3 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.priceMin}
                    onChange={(e) => setFilters({...filters, priceMin: e.target.value})}
                    className="w-16 sm:w-20 px-2 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                  <span className="text-gray-400 text-xs">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.priceMax}
                    onChange={(e) => setFilters({...filters, priceMax: e.target.value})}
                    className="w-16 sm:w-20 px-2 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                  className="text-sm bg-white border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium text-gray-700"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                {(filters.name || filters.address || filters.priceMin || filters.priceMax || filters.status !== 'all') && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <XCircle size={14} />
                    Clear
                  </button>
                )}
                <button
                  onClick={() => navigate("/mychamberpayments")}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium hover:bg-indigo-100 transition-colors border border-indigo-200"
                >
                  <CreditCard size={14} />
                  <span>Payments</span>
                </button>
                <button
                  onClick={() => navigate("/chamberbookings")}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors"
                >
                  <FileText size={14} className="text-indigo-600" />
                  <span>Bookings</span>
                </button>
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
                  <span>Add Chamber</span>
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="admin-dash__card-body p-0 overflow-x-auto" style={{ backgroundColor: '#ffffff' }}>
              {loading ? (
                <div className="flex flex-col items-center justify-center gap-3 py-20">
                  <div className="w-12 h-12 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
                  <p className="text-gray-500">Loading chambers...</p>
                </div>
              ) : (
                <table className="w-full min-w-[1200px] text-left">
                  <thead>
                    <tr className="border-b border-gray-100" style={{ backgroundColor: '#f9fafb' }}>
                      <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">#</th>
                      <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Chamber</th>
                      <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Address</th>
                      <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Type</th>
                      <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Price</th>
                      <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Timing</th>
                      <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Status</th>
                      <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Expiry</th>
                      <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Joined</th>
                      <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredChambers.length > 0 ? (
                      filteredChambers.map((chamber, index) => {
                        const chamberStatus = getChamberStatus(chamber);
                        const isExclusive = chamber.cabinType === 'exclusive';
                        const countdown = countdowns[chamber._id] || 0;
                        const hasExpiry = chamber.expiryDate ? true : false;
                        const isExpired = chamber.expiryDate && new Date(chamber.expiryDate) < new Date();
                        const is24x7 = chamber.is24x7 === true;
                        const openTimeDisplay = chamber.openTime ? formatTimeDisplay(chamber.openTime) : 'N/A';
                        const closeTimeDisplay = chamber.closeTime ? formatTimeDisplay(chamber.closeTime) : 'N/A';
                        
                        return (
                          <tr key={chamber._id} className="transition-colors group hover:bg-gray-50/80">
                            <td className="p-4">
                              <span className="text-sm font-semibold text-gray-400">#{index + 1}</span>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
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
                            <td className="p-4">
                              <span className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                                <MapPin size={14} className="text-gray-400 flex-shrink-0" />
                                <span className="truncate max-w-[150px]">{chamber.address || "N/A"}</span>
                              </span>
                            </td>
                            <td className="p-4">
                              <span className={`px-3 py-1 text-xs font-bold rounded-full inline-flex items-center gap-1.5 ${
                                isExclusive ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                              }`}>
                                {isExclusive ? <><Crown size={12} /> Exclusive</> : 'Normal'}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className="text-sm font-bold text-gray-900">₹{chamber.price || 0}</span>
                              <span className="text-xs text-gray-400 ml-0.5">/hr</span>
                            </td>
                            <td className="p-4">
                              {is24x7 ? (
                                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium flex items-center gap-1.5 w-fit">
                                  <ClockIcon size={12} /> 24×7
                                </span>
                              ) : (
                                <div className="flex flex-col gap-0.5 text-xs">
                                  <span className="flex items-center gap-1 text-gray-600">
                                    <Sun size={12} className="text-amber-500" />
                                    {openTimeDisplay}
                                  </span>
                                  <span className="flex items-center gap-1 text-gray-600">
                                    <Moon size={12} className="text-indigo-500" />
                                    {closeTimeDisplay}
                                  </span>
                                </div>
                              )}
                            </td>
                            <td className="p-4">
                              <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                                chamberStatus.color === 'green' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
                              }`}>
                                {chamberStatus.status}
                              </span>
                            </td>
                            <td className="p-4">
                              {hasExpiry ? (
                                <div className="flex flex-col gap-0.5">
                                  <span className="text-sm text-gray-600">{formatDate(chamber.expiryDate)}</span>
                                  {countdown > 0 && (
                                    <span className={`text-[10px] font-mono font-medium flex items-center gap-1 ${getCountdownColor(countdown)}`}>
                                      <Timer size={10} />
                                      {formatCountdown(countdown)}
                                    </span>
                                  )}
                                  {isExpired && <span className="text-[10px] text-red-500 font-medium">🔴 Expired</span>}
                                </div>
                              ) : (
                                <span className="text-sm text-gray-400">No expiry</span>
                              )}
                            </td>
                            <td className="p-4">
                              <span className="text-sm text-gray-500">{formatDate(chamber.createdAt)}</span>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <button
                                  onClick={() => handleViewChamber(chamber)}
                                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors whitespace-nowrap"
                                >
                                  <Eye size={13} /> View
                                </button>
                                <button
                                  onClick={() => navigate(`/cabin/${chamber._id}`)}
                                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-orange-50 text-orange-700 hover:bg-orange-100 transition-colors whitespace-nowrap"
                                >
                                  <Home size={13} /> Open
                                </button>
                                <button 
                                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-700 hover:bg-red-100 transition-colors whitespace-nowrap"
                                  onClick={(e) => handleDelete(e, chamber._id)}
                                >
                                  <Trash2 size={13} /> Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={10} className="p-12 text-center">
                          <div className="flex flex-col items-center justify-center gap-3 text-gray-400">
                            <BuildingIcon size={48} className="opacity-20" />
                            <p className="text-lg font-medium">No chambers found</p>
                            <p className="text-sm">Try adjusting your filters or add a new chamber.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>

            {/* Footer */}
            {!loading && filteredChambers.length > 0 && (
              <div className="px-4 py-3 border-t border-gray-100 rounded-b-2xl flex flex-wrap items-center justify-between gap-2" style={{ backgroundColor: '#fafafa' }}>
                <span className="text-xs text-gray-500">
                  Showing <strong>{filteredChambers.length}</strong> of <strong>{chambers.length}</strong> chambers
                </span>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Active: {activeCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                    Inactive: {inactiveCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    Exclusive: {exclusiveCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    Chambers: {chamberCountFilter}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* VIEW CHAMBER MODAL */}
      {/* ============================================================ */}
      {showViewModal && selectedChamber && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeViewModal();
            }
          }}
        >
          <div 
            className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`p-6 ${
              selectedChamber.cabinType === 'exclusive' 
                ? 'bg-gradient-to-br from-amber-500 to-amber-600' 
                : 'bg-gradient-to-br from-indigo-600 to-purple-600'
            } text-white sticky top-0 z-10`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center overflow-hidden backdrop-blur-sm">
                    {selectedChamber.images?.[0] ? (
                      <img 
                        src={getImageUrl(selectedChamber.images[0])} 
                        alt={selectedChamber.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Building2 size={28} className="text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold flex items-center gap-2">
                      {selectedChamber.name || 'N/A'}
                      {selectedChamber.isChamber && (
                        <span className="text-xs bg-rose-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                          🏛️ Chamber
                        </span>
                      )}
                    </h3>
                    <p className="text-sm opacity-80 flex items-center gap-2">
                      <MapPin size={14} />
                      {selectedChamber.address || 'No address'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeViewModal}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Images Gallery */}
              {selectedChamber.images && selectedChamber.images.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Building2 size={14} /> Photos ({selectedChamber.images.length})
                  </p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {selectedChamber.images.map((img, idx) => (
                      <div 
                        key={idx} 
                        className="aspect-square rounded-lg overflow-hidden border border-gray-200 cursor-pointer group relative"
                        onClick={() => openImagePopup(getImageUrl(img))}
                      >
                        <img 
                          src={getImageUrl(img)} 
                          alt={`Chamber ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full p-2">
                            <Eye size={20} className="text-indigo-600" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Videos */}
              {selectedChamber.videos && selectedChamber.videos.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Video size={14} /> Videos ({selectedChamber.videos.length})
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedChamber.videos.map((video, idx) => (
                      <div key={idx} className="bg-black/5 rounded-lg border border-gray-200 overflow-hidden">
                        <video 
                          src={getMediaUrl(video)} 
                          controls 
                          className="w-full h-40 object-cover"
                          poster={selectedChamber.images?.[0] ? getImageUrl(selectedChamber.images[0]) : undefined}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Type</p>
                  <p className="mt-1 font-medium text-gray-700 flex items-center gap-2">
                    {selectedChamber.cabinType === 'exclusive' ? (
                      <><Crown size={16} className="text-amber-500" /> Exclusive</>
                    ) : (
                      <Building2 size={16} className="text-indigo-500" />
                    )}
                    {selectedChamber.cabinType || 'Normal'}
                  </p>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Price</p>
                  <p className="mt-1 font-bold text-gray-700 flex items-center gap-1">
                    ₹{selectedChamber.price || 0}
                    <span className="text-sm font-normal text-gray-400">/hr</span>
                  </p>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Capacity</p>
                  <p className="mt-1 font-medium text-gray-700 flex items-center gap-2">
                    <Users size={16} className="text-gray-400" />
                    {selectedChamber.capacity || 0} people
                  </p>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Chamber</p>
                  <p className="mt-1 font-medium">
                    {selectedChamber.isChamber ? (
                      <span className="text-rose-600 flex items-center gap-1.5">
                        <CheckCircle size={16} className="text-rose-500" /> Yes
                      </span>
                    ) : (
                      <span className="text-gray-400">No</span>
                    )}
                  </p>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</p>
                  <p className="mt-1 font-medium">
                    <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                      selectedChamber.isActive === true 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {selectedChamber.isActive === true ? 'Active' : 'Inactive'}
                    </span>
                  </p>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Timing</p>
                  {selectedChamber.is24x7 ? (
                    <p className="mt-1 font-medium text-emerald-600 flex items-center gap-2">
                      <ClockIcon size={16} className="text-emerald-500" />
                      24×7
                    </p>
                  ) : (
                    <div className="mt-1 space-y-0.5">
                      <p className="text-xs text-gray-700 flex items-center gap-1.5">
                        <Sun size={12} className="text-amber-500" />
                        {selectedChamber.openTime ? formatTimeDisplay(selectedChamber.openTime) : 'N/A'}
                      </p>
                      <p className="text-xs text-gray-700 flex items-center gap-1.5">
                        <Moon size={12} className="text-indigo-500" />
                        {selectedChamber.closeTime ? formatTimeDisplay(selectedChamber.closeTime) : 'N/A'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Expiry Date */}
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Expiry Date</p>
                <p className="mt-1 font-medium text-gray-700 flex items-center gap-2">
                  <Calendar size={16} className="text-gray-400" />
                  {selectedChamber.expiryDate ? (
                    <span className="flex items-center gap-2">
                      {formatDate(selectedChamber.expiryDate)}
                      {new Date(selectedChamber.expiryDate) < new Date() ? (
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-red-100 text-red-700 rounded-full">Expired</span>
                      ) : (
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-700 rounded-full">Valid</span>
                      )}
                    </span>
                  ) : (
                    <span className="text-gray-400">No expiry date set</span>
                  )}
                </p>
              </div>

              {/* Description */}
              {selectedChamber.description && (
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Description</p>
                  <p className="mt-1 text-gray-700 text-sm">{selectedChamber.description}</p>
                </div>
              )}

              {/* Amenities */}
              {selectedChamber.amenities && Object.values(selectedChamber.amenities).some(v => v) && (
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <Star size={14} /> Amenities
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {Object.entries(selectedChamber.amenities)
                      .filter(([key, value]) => value)
                      .map(([key]) => {
                        const allAmenities = [...NORMAL_AMENITIES, ...EXCLUSIVE_AMENITIES];
                        const amenity = allAmenities.find(a => a.key === key);
                        const Icon = amenity?.icon;
                        return (
                          <span key={key} className="px-2.5 py-1 bg-white rounded-full text-xs text-gray-700 border border-gray-200 flex items-center gap-1">
                            {Icon && <Icon size={12} className="text-indigo-500" />}
                            {amenity?.label || key}
                          </span>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* Pricing Plans */}
              {selectedChamber.pricingPlans && selectedChamber.pricingPlans.length > 0 && (
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <CreditCard size={14} /> Pricing Plans
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                    {selectedChamber.pricingPlans.map((plan, idx) => (
                      <div key={idx} className="bg-white p-2 rounded-lg border border-gray-200 text-center">
                        <p className="text-xs font-bold text-gray-700">{plan.label || `Plan ${idx + 1}`}</p>
                        <p className="text-xs text-gray-500">{plan.hours}h · ₹{plan.cost}</p>
                        <p className="text-[10px] text-gray-400">{plan.validity}d validity</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Room/Suite */}
              {selectedChamber.cabin && (
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Room/Suite</p>
                  <p className="mt-1 font-medium text-gray-700">{selectedChamber.cabin}</p>
                </div>
              )}

              {/* Joined Date */}
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Joined</p>
                <p className="mt-1 font-medium text-gray-700 flex items-center gap-2">
                  <Clock size={14} className="text-gray-400" />
                  {formatDate(selectedChamber.createdAt)}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    closeViewModal();
                    navigate(`/cabin/${selectedChamber._id}`);
                  }}
                  className="flex-1 min-w-[120px] py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-sm active:scale-[0.98]"
                >
                  <Home size={16} className="inline mr-2" />
                  Open Chamber
                </button>
                <button
                  onClick={() => {
                    closeViewModal();
                    navigate("/chamberbookings");
                  }}
                  className="flex-1 min-w-[120px] py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition shadow-sm active:scale-[0.98]"
                >
                  <Calendar size={16} className="inline mr-2" />
                  View Bookings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* IMAGE FULLSCREEN POPUP */}
      {/* ============================================================ */}
      {showImagePopup && (
        <div 
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/90 backdrop-blur-md"
          onClick={closeImagePopup}
        >
          <div 
            className="relative max-w-[90vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeImagePopup}
              className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors p-2"
            >
              <X size={32} />
            </button>
            <img 
              src={selectedImage} 
              alt="Full size"
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl"
              onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }}
            />
            <button
              onClick={closeImagePopup}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 hover:text-white transition-colors text-sm bg-black/50 px-6 py-2 rounded-full backdrop-blur-sm"
            >
              Click anywhere to close
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* ADD CHAMBER MODAL */}
      {/* ============================================================ */}
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

                {/* isChamber Checkbox */}
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

                {/* Open/Close Time */}
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
                      <Crown size={16} className="text-amber-600 sm:w-5 sm:h-5" />
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

                {/* Submit Buttons */}
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

      {/* ============================================================ */}
      {/* CONFIRM MODAL */}
      {/* ============================================================ */}
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

export default MyChamber;