// MyCabin.jsx
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
  Loader2
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

const API_URL = "http://localhost:5000";
const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000";

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

  // Add Cabin Form State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    capacity: "",
    address: "",
    price: "",
    cabin: "",
    amenities: {
      wifi: false,
      parking: false,
      lockers: false,
      privateWashroom: false,
      secureAccess: false,
      comfortSeating: false,
    },
  });
  const [images, setImages] = useState([]);

  // Load Razorpay script on component mount
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

  // ======================
  // RAZORPAY PAYMENT HANDLER
  // ======================
  const initiateRazorpayPayment = async (cabinId, orderData) => {
    setPaymentProcessing(true);
    try {
      // Check if Razorpay is loaded
      if (typeof window.Razorpay === 'undefined') {
        toast.error('Razorpay not loaded. Please refresh the page.');
        setPaymentProcessing(false);
        return;
      }

      // Ensure we have the key
      const razorpayKey = orderData.razorpayKey || 'rzp_test_BxtRNvflG06PTV';
      
      console.log('Initiating Razorpay payment with:', {
        key: razorpayKey,
        amount: orderData.order.amount * 100,
        orderId: orderData.order.razorpayOrderId
      });

      const options = {
        key: razorpayKey,
        amount: orderData.order.amount * 100,
        currency: "INR",
        name: "Cabin Registration",
        description: `Cabin #${cabinCount + 1} Registration Fee`,
        order_id: orderData.order.razorpayOrderId,
        handler: async function(response) {
          console.log('Payment response:', response);
          // Verify payment on backend
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

            console.log('Verify response:', verifyRes.data);

            if (verifyRes.data.success) {
              // Get transaction ID from response
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
              
              // Reset form
              setFormData({
                name: "",
                description: "",
                capacity: "",
                address: "",
                price: "",
                cabin: "",
                amenities: {
                  wifi: false,
                  parking: false,
                  lockers: false,
                  privateWashroom: false,
                  secureAccess: false,
                  comfortSeating: false,
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

  // Create Cabin and Order with Razorpay
  const createCabinAndOrder = async () => {
    setSubmitting(true);
    const data = new FormData();
    const cabinName = formData.cabin ? `${formData.name} - ${formData.cabin}` : formData.name;
    data.append("name", cabinName);
    data.append("description", formData.description);
    data.append("capacity", formData.capacity);
    data.append("address", formData.address);
    data.append("price", formData.price);
    data.append("pricingPlans", JSON.stringify(pricingPlans));
    data.append("amenities", JSON.stringify(formData.amenities));
    images.forEach((img) => data.append("images", img));

    try {
      const token = localStorage.getItem("token");
      
      // Step 1: Create Cabin
      const cabinRes = await axios.post(`${API_URL}/api/cabins`, data, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
      });

      const newCabin = cabinRes.data.cabin;
      toast.success("Cabin created successfully!");

      // Step 2: Create Cabin Order with Razorpay
      const orderRes = await axios.post(
        `${API_URL}/api/cabins/createcabinorder`,
        { cabinId: newCabin._id },
        getAuthHeader()
      );

      if (orderRes.data.success) {
        // Close confirmation modal and open Razorpay
        setShowConfirmModal(false);
        setSubmitting(false);
        
        // Initiate Razorpay payment
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

  // Handle Form Submit - Show Confirmation Modal
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.address || !formData.capacity || !formData.price || !formData.cabin) {
      toast.error("Please fill all required fields");
      return;
    }
    
    // Show confirmation modal
    setShowConfirmModal(true);
  };

  const filteredCabins = cabins.filter(cabin =>
    cabin.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cabin.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCabinOrderStatus = (cabin) => {
    if (cabin.isActive && cabin.hasActiveOrder) {
      return { 
        status: 'Active', 
        color: 'green', 
        daysLeft: 30 
      };
    }
    return { status: 'Inactive', color: 'gray', daysLeft: 0 };
  };

  const isFirstCabin = cabinCount === 0;

  return (
    <div className="admin-dash">
      <UsersNavbar />

      <main className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16">
        {/* Header */}
        <div className="admin-dash__header">
          <div>
            <h1 className="admin-dash__greeting">
              My <span>Cabins</span>
            </h1>
            <p className="admin-dash__subtitle">
              Total Cabins: <strong>{cabinCount}</strong> | 
              Next Cabin #{cabinCount + 1} | 
              Fee: ₹{isFirstCabin ? '2,000' : '1,000'}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-grow sm:flex-grow-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search cabins..."
                className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all w-full sm:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => navigate("/my-cabin-payments")}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-50 text-indigo-700 rounded-xl text-sm font-medium hover:bg-indigo-100 transition-colors border border-indigo-200"
              >
                <CreditCard size={16} />
                My Payments
              </button>
              <button
                onClick={() => navigate("/cabin-bookings")}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                <FileText size={16} className="text-indigo-600" />
                View Bookings
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                <Plus size={16} />
                Add New Cabin
              </button>
            </div>
          </div>
        </div>

        {/* Cabin Count Info Card */}
        <div className="mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-4 border border-indigo-100">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-indigo-100 p-3 rounded-xl">
                <Building2 size={24} className="text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-indigo-700 font-medium">Your Cabin Stats</p>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-2xl font-bold text-slate-900">{cabinCount}</span>
                  <span className="text-sm text-slate-600">Total Cabins</span>
                  <span className="w-px h-6 bg-slate-300"></span>
                  <span className="text-sm font-semibold text-indigo-600">
                    Next: #{cabinCount + 1}
                  </span>
                  <span className="w-px h-6 bg-slate-300"></span>
                  <span className="text-sm font-semibold text-emerald-600">
                    Fee: ₹{isFirstCabin ? '2,000' : '1,000'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs bg-white px-3 py-2 rounded-lg shadow-sm">
              <Clock size={14} className="text-indigo-500" />
              <span className="text-slate-600">30 days validity after payment</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="admin-dash__loading">
            <div className="admin-dash__spinner" />
            <p className="admin-dash__loading-text">Loading cabins...</p>
          </div>
        ) : filteredCabins.length === 0 ? (
          <div className="admin-dash__error" style={{ background: '#f8fafc', borderColor: '#e2e8f0' }}>
            <BuildingIcon size={48} className="text-slate-300 mb-4" />
            <p className="admin-dash__error-title" style={{ color: '#475569' }}>No cabins found</p>
            <p className="admin-dash__error-message">Add your first workspace to get started. (First cabin: ₹2,000)</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCabins.map((cabin, index) => {
              const orderStatus = getCabinOrderStatus(cabin);
              return (
                <div
                  key={cabin._id}
                  onClick={() => navigate(`/cabin/${cabin._id}`)}
                  className="admin-dash__card group cursor-pointer flex flex-col h-full relative"
                >
                  <div className="relative h-48 overflow-hidden rounded-t-2xl">
                    <div className="absolute inset-0 bg-slate-200 animate-pulse" />
                    <img
                      src={cabin.images?.[0] ? getImageUrl(cabin.images[0]) : PLACEHOLDER_IMAGE}
                      alt={cabin.name}
                      className="w-full h-full object-cover relative z-10 group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = PLACEHOLDER_IMAGE;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent z-20 opacity-40" />

                    <div className="absolute top-3 left-3 z-30 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-indigo-700 shadow-sm flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                      Cabin #{index + 1}
                    </div>

                    <div className={`absolute top-3 right-3 z-30 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm flex items-center gap-1 ${
                      orderStatus.color === 'green' ? 'text-emerald-600' : 
                      orderStatus.color === 'red' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        orderStatus.color === 'green' ? 'bg-emerald-500' : 
                        orderStatus.color === 'red' ? 'bg-red-500' : 'bg-gray-400'
                      }`}></span>
                      {orderStatus.status}
                    </div>

                    <div className="absolute bottom-3 right-3 z-30 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-[9px] font-medium text-white flex items-center gap-1">
                      <Calendar size={10} />
                      {orderStatus.daysLeft > 0 ? `${orderStatus.daysLeft}d left` : 'No order'}
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-grow">
                    <div className="mb-4">
                      <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-1">Coworking Space</p>
                      <h3 className="text-base font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors line-clamp-1">
                        {cabin.name}
                      </h3>
                    </div>

                    <div className="flex items-start gap-3 mb-3">
                      <div className="p-2 bg-indigo-50 rounded-lg shrink-0 text-indigo-600">
                        <MapPin size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 line-clamp-1">{cabin.address?.split(',')[0] || "Location"}</p>
                        <p className="text-xs text-slate-500 line-clamp-1">{cabin.address}</p>
                      </div>
                    </div>

                    <p className="text-slate-500 text-xs leading-relaxed mb-4 line-clamp-2">
                      {cabin.description || "Experience a premium workspace designed for focus and collaboration, featuring modern amenities."}
                    </p>

                    <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="flex items-baseline gap-0.5">
                          <span className="text-xl font-bold text-slate-900">₹{cabin.price || '0'}</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase">/ Hour</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-medium text-slate-500 mt-0.5">
                          <Users size={10} />
                          {cabin.capacity} Seats
                        </div>
                      </div>

                      <div 
                        className="h-10 w-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors"
                        onClick={(e) => handleDelete(e, cabin._id)}
                      >
                        <Trash2 size={16} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Add Cabin Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1100] flex items-end sm:items-center justify-center p-4 sm:p-6 bg-slate-900/50 backdrop-blur-sm">
          <div
            className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200"
            style={{ maxHeight: "90vh" }}
          >
            <style>{`
              .cabin-field {
                width:100%; padding:0.65rem 0.875rem;
                border:1.5px solid #e2e8f0; border-radius:10px;
                font-size:0.875rem; font-family:inherit; color:#1e293b;
                outline:none; transition:border-color 180ms, box-shadow 180ms;
                background:#fff; box-sizing:border-box;
              }
              .cabin-field:focus {
                border-color:#6366f1;
                box-shadow:0 0 0 3px rgba(99,102,241,0.12);
              }
              .cabin-field-icon { position:relative; }
              .cabin-field-icon svg {
                position:absolute; left:12px; top:50%;
                transform:translateY(-50%); color:#94a3b8; pointer-events:none;
              }
              .cabin-field-icon .cabin-field { padding-left:2.5rem; }
              .cabin-amenity {
                display:flex; align-items:center; gap:8px;
                padding:0.5rem 0.875rem; border-radius:10px;
                border:1.5px solid #e2e8f0; background:#fff;
                font-size:0.8rem; font-weight:600; color:#64748b;
                cursor:pointer; transition:all 180ms; user-select:none;
              }
              .cabin-amenity.active {
                border-color:#6366f1; background:rgba(99,102,241,0.07);
                color:#4f46e5;
              }
              .cabin-amenity .dot {
                width:8px; height:8px; border-radius:50%;
                border:2px solid #cbd5e1; flex-shrink:0; transition:all 180ms;
              }
              .cabin-amenity.active .dot {
                border-color:#6366f1; background:#6366f1;
                box-shadow:0 0 0 3px rgba(99,102,241,0.2);
              }
              .cabin-label {
                display:block; font-size:0.7rem; font-weight:700;
                letter-spacing:0.06em; text-transform:uppercase;
                color:#64748b; margin-bottom:6px;
              }
            `}</style>

            <div style={{
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 60%, #06b6d4 100%)",
              padding: "1.25rem 1.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Home size={22} color="#fff" />
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>
                    Add New Cabin #{cabinCount + 1}
                  </h2>
                  <p style={{ margin: 0, fontSize: "0.75rem", color: "rgba(255,255,255,0.75)", marginTop: 2 }}>
                    Total Cabins: {cabinCount} | 
                    Fee: ₹{isFirstCabin ? '2,000' : '1,000'} 
                    {isFirstCabin ? ' (First Cabin)' : ` (Cabin #${cabinCount + 1})`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: "rgba(255,255,255,0.15)", border: "none",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", color: "#fff", transition: "background 150ms",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.25)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ overflowY: "auto", padding: "1.5rem", flex: 1 }} className="custom-scrollbar">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="cabin-label">Building Name</label>
                    <input
                      className="cabin-field"
                      type="text" name="name"
                      placeholder="e.g. Tech Hub Alpha"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="cabin-label">Address / Location</label>
                    <div className="cabin-field-icon">
                      <MapPin size={16} />
                      <input
                        className="cabin-field"
                        type="text" name="address"
                        placeholder="e.g. Floor 4, Suite 10, Bangalore"
                        value={formData.address}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="cabin-label">Cabin Spec</label>
                    <div className="cabin-field-icon">
                      <Building2 size={16} />
                      <input
                        className="cabin-field"
                        type="text" name="cabin"
                        placeholder="e.g. Private Office B"
                        value={formData.cabin}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="cabin-label">Capacity (Seats)</label>
                    <div className="cabin-field-icon">
                      <Users size={16} />
                      <input
                        className="cabin-field"
                        type="number" name="capacity" min="1"
                        placeholder="e.g. 10"
                        value={formData.capacity}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="cabin-label">Price / Hour (₹)</label>
                    <div className="cabin-field-icon">
                      <IndianRupee size={16} />
                      <input
                        className="cabin-field"
                        type="number" name="price" min="0"
                        placeholder="e.g. 25000"
                        value={formData.price}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: "1rem", borderTop: "1.5px solid #f1f5f9", paddingTop: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                    <label className="cabin-label" style={{ margin: 0 }}>Pricing Plans (Packages)</label>
                    <button
                      type="button"
                      onClick={() => {
                        const label = prompt("Plan Label (e.g. Monthly Plan, Weekly Plan):");
                        const hours = prompt("Included Hours (e.g. 50):");
                        const cost = prompt("Cost (e.g. 8000):");
                        const validity = prompt("Validity in Days (e.g. 30):");
                        if (hours && cost && validity) {
                          setPricingPlans([...pricingPlans, {
                            label: (label || "").trim(),
                            hours: Number(hours),
                            cost: Number(cost),
                            validity: Number(validity)
                          }]);
                        }
                      }}
                      style={{
                        padding: "0.25rem 0.65rem", borderRadius: 8, border: "1.5px solid #6366f1",
                        fontSize: "0.75rem", cursor: "pointer", background: "rgba(99,102,241,0.07)",
                        color: "#4f46e5", fontWeight: "bold"
                      }}
                    >
                      + Add Plan
                    </button>
                  </div>
                  {pricingPlans.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {pricingPlans.map((plan, idx) => (
                        <div key={idx} style={{ padding: "0.65rem", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: "0.75rem", background: "#f8fafc", position: "relative" }}>
                          <div><strong>{plan.label || "Plan"}</strong></div>
                          <div>Hours: {plan.hours} hrs | Price: ₹{plan.cost}</div>
                          <div>Validity: {plan.validity} Days</div>
                          <button
                            type="button"
                            onClick={() => setPricingPlans(pricingPlans.filter((_, i) => i !== idx))}
                            style={{ position: "absolute", top: 4, right: 4, border: "none", background: "none", color: "#ef4444", cursor: "pointer", fontSize: "1rem", fontWeight: "bold" }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ margin: 0, fontSize: "0.75rem", color: "#94a3b8" }}>No plans defined. Cabin will only support hourly booking.</p>
                  )}
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <label className="cabin-label">Included Amenities</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { key: "wifi", label: "Wi-Fi", emoji: "📶" },
                      { key: "parking", label: "Parking", emoji: "🅿️" },
                      { key: "lockers", label: "Lockers", emoji: "🔐" },
                      { key: "privateWashroom", label: "Private Washroom", emoji: "🚿" },
                      { key: "secureAccess", label: "Secure Access", emoji: "🛡️" },
                      { key: "comfortSeating", label: "Comfort Seating", emoji: "🪑" },
                    ].map(item => (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => toggleAmenity(item.key)}
                        className={`cabin-amenity${formData.amenities[item.key] ? " active" : ""}`}
                      >
                        <span className="dot" />
                        <span style={{ fontSize: "1rem" }}>{item.emoji}</span>
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <label className="cabin-label">Space Description</label>
                  <div className="cabin-field-icon" style={{ alignItems: "flex-start" }}>
                    <FileText size={16} style={{ top: "14px" }} />
                    <textarea
                      className="cabin-field"
                      name="description"
                      placeholder="Describe this workspace — layout, vibe, special features…"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      style={{ resize: "vertical", paddingTop: "0.65rem" }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: "1.5rem" }}>
                  <label className="cabin-label">Photo Gallery</label>
                  <div style={{
                    border: "2px dashed #c7d2fe", borderRadius: 14,
                    padding: "1.5rem", textAlign: "center",
                    background: "rgba(99,102,241,0.03)",
                    cursor: "pointer", position: "relative",
                    transition: "border-color 180ms, background 180ms",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#6366f1"; e.currentTarget.style.background = "rgba(99,102,241,0.06)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#c7d2fe"; e.currentTarget.style.background = "rgba(99,102,241,0.03)"; }}
                  >
                    <input
                      type="file" multiple accept="image/*"
                      onChange={handleImageChange}
                      style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", width: "100%", height: "100%" }}
                    />
                    <div style={{ display: "flex", flexDirection: "column", items: "center", gap: 8, pointerEvents: "none" }}>
                      <div style={{
                        width: 48, height: 48, borderRadius: 12,
                        background: "rgba(99,102,241,0.1)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <Upload size={22} color="#6366f1" />
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 600, color: "#4f46e5" }}>
                          Click to upload photos
                        </p>
                        <p style={{ margin: "2px 0 0", fontSize: "0.72rem", color: "#94a3b8" }}>
                          PNG, JPG, WEBP — multiple files allowed
                        </p>
                      </div>
                    </div>
                  </div>

                  {images.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-3">
                      {images.map((file, index) => (
                        <div key={index} style={{
                          position: "relative", aspectRatio: "1",
                          borderRadius: 10, overflow: "hidden",
                          border: "1.5px solid #e2e8f0",
                          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                        }}>
                          <img src={URL.createObjectURL(file)} alt="preview"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            style={{
                              position: "absolute", top: 4, right: 4,
                              width: 20, height: 20, borderRadius: "50%",
                              background: "#ef4444", border: "none",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              cursor: "pointer", color: "#fff",
                              boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
                            }}
                          >
                            <X size={11} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ 
                  background: "#f0fdf4", 
                  border: "1px solid #86efac",
                  borderRadius: 10,
                  padding: "0.75rem 1rem",
                  marginBottom: "1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem"
                }}>
                  <CreditCard size={18} className="text-emerald-600" />
                  <div>
                    <p style={{ margin: 0, fontSize: "0.8rem", fontWeight: 600, color: "#065f46" }}>
                      Cabin #{cabinCount + 1} Registration
                    </p>
                    <p style={{ margin: 0, fontSize: "0.7rem", color: "#047857" }}>
                      Fee: ₹{isFirstCabin ? '2,000' : '1,000'} | 
                      Validity: 30 days | 
                      {isFirstCabin ? ' First Cabin' : ` ${cabinCount} cabins already added`}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 border-t border-slate-100 pt-5">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    style={{
                      flex: 1, padding: "0.75rem",
                      borderRadius: 10, border: "1.5px solid #e2e8f0",
                      background: "#fff", fontFamily: "inherit",
                      fontSize: "0.875rem", fontWeight: 600, color: "#64748b",
                      cursor: "pointer", transition: "all 160ms",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.borderColor = "#cbd5e1"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#e2e8f0"; }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={paymentProcessing}
                    style={{
                      flex: 2, padding: "0.75rem",
                      borderRadius: 10, border: "none",
                      background: paymentProcessing
                        ? "#a5b4fc"
                        : "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                      color: "#fff", fontFamily: "inherit",
                      fontSize: "0.875rem", fontWeight: 700,
                      cursor: paymentProcessing ? "not-allowed" : "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      boxShadow: paymentProcessing ? "none" : "0 4px 14px rgba(99,102,241,0.35)",
                      transition: "all 160ms",
                    }}
                    onMouseEnter={e => { if (!paymentProcessing) e.currentTarget.style.transform = "scale(1.02)"; }}
                    onMouseLeave={e => { if (!paymentProcessing) e.currentTarget.style.transform = "scale(1)"; }}
                  >
                    {paymentProcessing ? (
                      <>
                        <Loader2 size={17} className="animate-spin" />
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <CreditCard size={17} /> 
                        Proceed to Pay ₹{isFirstCabin ? '2,000' : '1,000'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Payment Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div style={{
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 60%, #06b6d4 100%)",
              padding: "1.5rem",
              textAlign: "center"
            }}>
              <div style={{
                width: 64, height: 64, borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 0.75rem"
              }}>
                <CreditCard size={32} color="#fff" />
              </div>
              <h3 style={{ margin: 0, color: "#fff", fontSize: "1.25rem", fontWeight: 700 }}>
                Confirm Cabin Addition
              </h3>
              <p style={{ margin: "0.25rem 0 0", color: "rgba(255,255,255,0.8)", fontSize: "0.875rem" }}>
                Please review the details below
              </p>
            </div>
            
            <div style={{ padding: "1.5rem" }}>
              <div style={{ 
                background: "#f8fafc", 
                borderRadius: 12, 
                padding: "1rem",
                marginBottom: "1.25rem"
              }}>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span style={{ color: "#64748b", fontSize: "0.875rem" }}>Cabin Number</span>
                    <span style={{ fontWeight: 600, color: "#1e293b" }}>#{cabinCount + 1}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: "#64748b", fontSize: "0.875rem" }}>Total Cabins</span>
                    <span style={{ fontWeight: 600, color: "#1e293b" }}>{cabinCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: "#64748b", fontSize: "0.875rem" }}>Registration Fee</span>
                    <span style={{ fontSize: "1.25rem", fontWeight: 700, color: "#6366f1" }}>
                      ₹{isFirstCabin ? '2,000' : '1,000'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-t border-slate-200 pt-2">
                    <span style={{ color: "#64748b", fontSize: "0.75rem" }}>Validity</span>
                    <span style={{ fontSize: "0.75rem", fontWeight: 500, color: "#059669" }}>
                      <Calendar size={12} className="inline mr-1" />
                      30 Days
                    </span>
                  </div>
                </div>
              </div>
              
              <div style={{ 
                background: "#fef3c7", 
                borderRadius: 8, 
                padding: "0.75rem",
                marginBottom: "1.25rem",
                fontSize: "0.75rem",
                color: "#92400e",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}>
                <AlertCircle size={16} className="shrink-0" />
                <span>This is a one-time registration fee. Your cabin will be active for 30 days.</span>
              </div>
              
              <div className="flex flex-col gap-2">
                <button
                  onClick={createCabinAndOrder}
                  disabled={submitting || !razorpayLoaded || paymentProcessing}
                  style={{
                    width: "100%",
                    padding: "0.875rem",
                    borderRadius: 10,
                    border: "none",
                    background: (submitting || !razorpayLoaded || paymentProcessing)
                      ? "#a5b4fc"
                      : "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                    color: "#fff",
                    fontFamily: "inherit",
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    cursor: (submitting || !razorpayLoaded || paymentProcessing) ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    boxShadow: (submitting || !razorpayLoaded || paymentProcessing) ? "none" : "0 4px 14px rgba(99,102,241,0.35)",
                    transition: "all 160ms",
                  }}
                >
                  {submitting || paymentProcessing ? (
                    <>
                      <Loader2 size={17} className="animate-spin" />
                      {paymentProcessing ? 'Processing Payment...' : 'Creating Cabin & Order...'}
                    </>
                  ) : !razorpayLoaded ? (
                    "Loading Payment Gateway..."
                  ) : (
                    <>Pay ₹{isFirstCabin ? '2,000' : '1,000'}</>
                  )}
                </button>
                <button
                  onClick={() => setShowConfirmModal(false)}
                  disabled={paymentProcessing}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: 10,
                    border: "1.5px solid #e2e8f0",
                    background: "#fff",
                    color: paymentProcessing ? "#94a3b8" : "#64748b",
                    fontFamily: "inherit",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    cursor: paymentProcessing ? "not-allowed" : "pointer",
                    transition: "all 160ms",
                  }}
                  onMouseEnter={e => { if (!paymentProcessing) e.currentTarget.style.background = "#f8fafc"; }}
                  onMouseLeave={e => { if (!paymentProcessing) e.currentTarget.style.background = "#fff"; }}
                >
                  Cancel
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