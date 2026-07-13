// MyCabin.jsx - Fully Responsive with Fixed Status Display
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
  ArrowLeft
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import UsersNavbar from "./UsersNavbar";
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

const API_URL = "http://62.72.29.27:5003";
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

const MyCabin = () => {
  const [cabins, setCabins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [pricingPlans, setPricingPlans] = useState([]);
  const [cabinCount, setCabinCount] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const navigate = useNavigate();

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

  const fetchCabins = async () => {
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
      const cabinList = Array.isArray(data) ? data : [];
      setCabins(cabinList);
      setCabinCount(cabinList.length);
      
    } catch (err) {
      console.error("Error fetching cabins:", err);
      toast.error("Failed to fetch cabins");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCabins();
  }, []);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this cabin?")) return;

    try {
      await axios.delete(`${API_URL}/api/cabins/${id}`, getAuthHeader());
      setCabins(cabins.filter(c => c._id !== id));
      setCabinCount(prev => prev - 1);
      toast.success("Cabin deleted successfully");
    } catch (error) {
      console.error("Error deleting cabin", error);
      toast.error("Failed to delete cabin");
    }
  };

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
    const baseFee = isFirstCabin ? 2000 : 1000;
    const { gstAmount, totalWithGST } = calculateGST(baseFee);
    return { baseFee, gstAmount, totalWithGST };
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
              setPricingPlans([]);
              await fetchCabins();
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
      toast.error("Failed to initiate payment: " + error.message);
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
      toast.error(err.response?.data?.error || "Failed to create cabin and order");
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

  const filteredCabins = cabins.filter(cabin =>
    cabin.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cabin.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ FIXED: Get cabin status from isActive
  const getCabinStatus = (cabin) => {
    if (cabin.isActive === true) {
      return { status: 'Active', color: 'green' };
    }
    return { status: 'Inactive', color: 'gray' };
  };

  const isFirstCabin = cabinCount === 0;
  const currentAmenities = getAmenitiesForType(formData.cabinType);
  const { baseFee, gstAmount, totalWithGST } = getFeeWithGST();

  return (
    <div className="admin-dash">
      <UsersNavbar />

      <main className="pt-24 px-3 sm:px-4 md:px-6 lg:px-8 max-w-7xl mx-auto pb-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              My <span className="text-indigo-600">Cabins</span>
            </h1>
            <p className="text-sm text-slate-500 mt-1 flex flex-wrap items-center gap-2">
              <span>Total: <strong className="text-slate-900">{cabinCount}</strong></span>
              <span className="hidden xs:inline">•</span>
              <span>Next: <strong className="text-indigo-600">#{cabinCount + 1}</strong></span>
              <span className="hidden xs:inline">•</span>
              <span>Fee: <strong className="text-emerald-600">₹{isFirstCabin ? '2,000' : '1,000'} + GST</strong></span>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => navigate("/my-cabin-payments")}
              className="flex items-center gap-1.5 px-3 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-xs sm:text-sm font-medium hover:bg-indigo-100 transition-colors border border-indigo-200"
            >
              <CreditCard size={15} />
              <span className="hidden xs:inline">My Payments</span>
              <span className="xs:hidden">Payments</span>
            </button>
            <button
              onClick={() => navigate("/cabin-bookings")}
              className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs sm:text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              <FileText size={15} className="text-indigo-600" />
              <span className="hidden xs:inline">View Bookings</span>
              <span className="xs:hidden">Bookings</span>
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              <Plus size={15} />
              <span className="hidden xs:inline">Add New Cabin</span>
              <span className="xs:hidden">Add</span>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-xs sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search cabins..."
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Cabin Count Info Card */}
        <div className="mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-4 border border-indigo-100">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-100 p-2.5 rounded-xl">
                <Building2 size={20} className="text-indigo-600" />
              </div>
              <div>
                <p className="text-xs text-indigo-700 font-medium">Your Cabin Stats</p>
                <div className="flex flex-wrap items-center gap-2 mt-0.5">
                  <span className="text-xl font-bold text-slate-900">{cabinCount}</span>
                  <span className="text-xs text-slate-600">Total</span>
                  <span className="w-px h-4 bg-slate-300 hidden xs:block"></span>
                  <span className="text-xs font-semibold text-indigo-600">Next: #{cabinCount + 1}</span>
                  <span className="w-px h-4 bg-slate-300 hidden xs:block"></span>
                  <span className="text-xs font-semibold text-emerald-600">Fee: ₹{isFirstCabin ? '2,000' : '1,000'}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] bg-white px-3 py-1.5 rounded-lg shadow-sm">
              <Clock size={12} className="text-indigo-500" />
              <span className="text-slate-600">30 days validity</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="admin-dash__spinner" />
          </div>
        ) : filteredCabins.length === 0 ? (
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-12 text-center">
            <BuildingIcon size={48} className="text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600 font-medium">No cabins found</p>
            <p className="text-sm text-slate-400 mt-1">Add your first workspace to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {filteredCabins.map((cabin, index) => {
              const cabinStatus = getCabinStatus(cabin);
              const isExclusive = cabin.cabinType === 'exclusive';
              
              return (
                <div
                  key={cabin._id}
                  onClick={() => navigate(`/cabin/${cabin._id}`)}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden group"
                >
                  <div className="relative h-40 xs:h-44 sm:h-48 overflow-hidden">
                    <img
                      src={cabin.images?.[0] ? getImageUrl(cabin.images[0]) : PLACEHOLDER_IMAGE}
                      alt={cabin.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent opacity-40" />

                    <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-full text-[9px] font-bold text-indigo-700 shadow-sm flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-indigo-500"></span>
                      #{index + 1}
                    </div>

                    {/* ✅ Status Badge - Shows Active/Inactive from isActive */}
                    <div className={`absolute top-2 right-2 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-full text-[9px] font-bold shadow-sm flex items-center gap-1 ${
                      cabinStatus.color === 'green' ? 'text-emerald-600' : 'text-gray-600'
                    }`}>
                      <span className={`w-1 h-1 rounded-full ${
                        cabinStatus.color === 'green' ? 'bg-emerald-500' : 'bg-gray-400'
                      }`}></span>
                      {cabinStatus.status}
                    </div>

                    <div className="absolute bottom-2 left-2">
                      {isExclusive ? (
                        <span className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-2 py-0.5 rounded-full text-[8px] font-bold flex items-center gap-1 shadow-lg">
                          <Crown size={10} />
                          Exclusive
                        </span>
                      ) : (
                        <span className="bg-blue-500/80 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-[8px] font-bold shadow-lg">
                          Normal
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded text-[8px] font-medium text-white flex items-center gap-1">
                      <Calendar size={8} />
                      {cabinStatus.color === 'green' ? '30d left' : 'No order'}
                    </div>
                  </div>

                  <div className="p-3 sm:p-4">
                    <h3 className="text-sm font-bold text-slate-900 leading-tight line-clamp-1 group-hover:text-indigo-600 transition-colors">
                      {cabin.name}
                    </h3>
                    {isExclusive && (
                      <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full mt-0.5">
                        <Star size={9} /> Premium
                      </span>
                    )}
                    
                    <div className="flex items-start gap-2 mt-2">
                      <MapPin size={13} className="text-indigo-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-slate-500 line-clamp-1">{cabin.address}</p>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="flex items-baseline gap-0.5">
                          <span className="text-lg font-bold text-slate-900">₹{cabin.price || '0'}</span>
                          <span className="text-[9px] text-slate-400 font-bold">/hr</span>
                        </div>
                        <div className="flex items-center gap-1 text-[9px] font-medium text-slate-500">
                          <Users size={9} />
                          {cabin.capacity} seats
                        </div>
                      </div>
                      <button 
                        className="p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-red-600 hover:text-white transition-colors"
                        onClick={(e) => handleDelete(e, cabin._id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Add Cabin Modal - Responsive */}
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
                <X size={18} />
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
                      <span className="text-[9px] sm:text-[10px] text-slate-400 block sm:inline sm:ml-1">
                        ({NORMAL_AMENITIES.length} amenities)
                      </span>
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
                      <span className="text-[9px] sm:text-[10px] text-slate-400 block sm:inline sm:ml-1">
                        ({EXCLUSIVE_AMENITIES.length} amenities)
                      </span>
                    </button>
                  </div>
                  {formData.cabinType === 'exclusive' && (
                    <div className="mt-2 p-2.5 sm:p-3 bg-amber-50 rounded-lg text-xs sm:text-sm text-amber-700 flex items-start gap-2">
                      <Star size={14} className="shrink-0 mt-0.5" />
                      <span>Exclusive cabins get premium visibility, higher booking priority, and {EXCLUSIVE_AMENITIES.length} premium amenities.</span>
                    </div>
                  )}
                </div>

                {/* Amenities */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Amenities ({currentAmenities.length} available)
                    </label>
                    <span className="text-[9px] sm:text-[10px] text-slate-400">
                      {formData.cabinType === 'exclusive' ? '⭐ Premium' : 'Standard'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 xs:grid-cols-3 gap-1.5 sm:gap-2">
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
                  {formData.cabinType === 'normal' && (
                    <p className="mt-1.5 text-[9px] sm:text-[10px] text-slate-400">
                      💡 Upgrade to Exclusive for {EXCLUSIVE_AMENITIES.length - NORMAL_AMENITIES.length} more premium amenities
                    </p>
                  )}
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

      {/* Confirm Modal - Responsive */}
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

export default MyCabin;