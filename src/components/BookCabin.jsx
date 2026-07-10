// BookCabin.jsx - Updated with Pay on Counter option (Frontend only)
import axios from "axios";
import {
  ArrowLeft,
  ArrowRight,
  History,
  MapPin,
  User,
  Users,
  CreditCard,
  ShieldCheck,
  Store,
  CheckCircle
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import UsersNavbar from "./UsersNavbar";
import AdminNavbar from "./AdminNavbar";
import "./Dashboard.css";

const API_URL = "http://localhost:5000";
const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000";

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

const BookCabin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem("admin") !== null;

  const [cabin, setCabin] = useState(null);
  const [relatedCabins, setRelatedCabins] = useState([]);

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");

  const [bookingBasis, setBookingBasis] = useState("hourly");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("online");

  const [totalHours, setTotalHours] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [availabilityError, setAvailabilityError] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

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

  // FETCH DATA
  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      try {
        const [cabinRes, spacesRes] = await Promise.all([
          axios.get(`${API_URL}/api/cabins/${id}`),
          axios.get(`${API_URL}/api/cabins`),
        ]);
        setCabin(cabinRes.data);
        setRelatedCabins(
          spacesRes.data.filter((c) => c._id !== id).slice(0, 3)
        );
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [id]);

  // PRICE CALC
  useEffect(() => {
    if (bookingBasis === "hourly") {
      if (startDate && startTime && endDate && endTime) {
        const start = new Date(`${startDate}T${startTime}`);
        const end = new Date(`${endDate}T${endTime}`);

        if (end <= start) {
          setTotalHours(0);
          setTotalPrice(0);
          return;
        }

        const hours = Math.ceil((end - start) / (1000 * 60 * 60));
        setTotalHours(hours);
        setTotalPrice(hours * (cabin?.price || 0));
        setAvailabilityError("");
      }
    } else {
      if (selectedPlan) {
        setTotalHours(Number(selectedPlan.hours) || 0);
        setTotalPrice(Number(selectedPlan.cost) || 0);
        
        if (startDate && startTime) {
          const start = new Date(`${startDate}T${startTime}`);
          const validityDays = Number(selectedPlan.validity) || 30;
          const end = new Date(start.getTime() + validityDays * 24 * 60 * 60 * 1000);
          setEndDate(end.toISOString().split("T")[0]);
          setEndTime(startTime);
        }
      } else {
        setTotalHours(0);
        setTotalPrice(0);
      }
    }
  }, [startDate, startTime, endDate, endTime, bookingBasis, selectedPlan, cabin]);

  // BOOK WITH PAY ON COUNTER
const handleCounterBooking = async (e) => {
  e.preventDefault();
  setLoading(true);

  if (totalPrice <= 0) {
    toast.error("Please select valid date/time or plan");
    setLoading(false);
    return;
  }

  const userStr = localStorage.getItem("user");
  const adminStr = localStorage.getItem("admin");
  let currentUser = null;
  if (userStr) currentUser = JSON.parse(userStr);
  else if (adminStr) currentUser = JSON.parse(adminStr);

  const userId = currentUser?._id || currentUser?.id;

  if (!userId) {
    toast.error("Please log in to book a cabin.");
    navigate("/login");
    setLoading(false);
    return;
  }

  try {
    const bookingData = {
      cabinId: id,
      name,
      mobile,
      email: currentUser?.email || "",
      startDate,
      startTime,
      endDate,
      endTime,
      bookingBasis,
      selectedPlan,
      paymentMethod: "counter" // ✅ Send payment method
    };

    const res = await axios.post(
      `${API_URL}/api/bookings/createbooking/${userId}`,
      bookingData,
      getAuthHeader()
    );

    if (res.data.success) {
      toast.success("Booking confirmed! Please pay at the counter.");
      navigate("/mybookings");
    }
  } catch (err) {
    const errorMsg = err.response?.data?.error || "Booking failed. Please try again.";
    setAvailabilityError(errorMsg);
    toast.error(errorMsg);
  } finally {
    setLoading(false);
  }
};
  // BOOK WITH RAZORPAY PAYMENT
  const handleOnlineBooking = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (totalPrice <= 0) {
      toast.error("Please select valid date/time or plan");
      setLoading(false);
      return;
    }

    const userStr = localStorage.getItem("user");
    const adminStr = localStorage.getItem("admin");
    let currentUser = null;
    if (userStr) currentUser = JSON.parse(userStr);
    else if (adminStr) currentUser = JSON.parse(adminStr);

    const userId = currentUser?._id || currentUser?.id;

    if (!userId) {
      toast.error("Please log in to book a cabin.");
      navigate("/login");
      setLoading(false);
      return;
    }

    try {
      const bookingData = {
        cabinId: id,
        name,
        mobile,
        email: currentUser?.email || "",
        startDate,
        startTime,
        endDate,
        endTime,
        bookingBasis,
        selectedPlan,
        paymentMethod: "online"
      };

      const res = await axios.post(
        `${API_URL}/api/bookings/createbooking/${userId}`,
        bookingData,
        getAuthHeader()
      );

      if (res.data.success) {
        const { razorpay, booking } = res.data;
        
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          toast.error("Payment gateway failed to load. Please try again.");
          setLoading(false);
          return;
        }

        setPaymentProcessing(true);
        const options = {
          key: razorpay.key,
          amount: razorpay.amount,
          currency: razorpay.currency,
          name: "IRYAX Workspace",
          description: `Booking - ${booking.cabinName}`,
          image: "https://iryax.com/logo.png",
          order_id: razorpay.orderId,
          handler: async function (response) {
            try {
              const verifyRes = await axios.post(
                `${API_URL}/api/bookings/verify-payment`,
                {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  bookingId: booking.id
                },
                getAuthHeader()
              );

              if (verifyRes.data.success) {
                toast.success("Payment successful! Booking confirmed.");
                navigate("/mybookings");
              } else {
                toast.error("Payment verification failed. Please contact support.");
              }
            } catch (error) {
              console.error("Payment verification error:", error);
              toast.error("Payment verification failed. Please contact support.");
            } finally {
              setPaymentProcessing(false);
              setLoading(false);
            }
          },
          prefill: {
            name: name,
            email: currentUser?.email || "",
            contact: mobile
          },
          notes: {
            cabinId: id,
            bookingId: booking.id
          },
          theme: {
            color: "#6366f1"
          },
          modal: {
            ondismiss: function() {
              toast.info("Payment cancelled");
              setPaymentProcessing(false);
              setLoading(false);
            }
          }
        };

        const razorpayInstance = new window.Razorpay(options);
        razorpayInstance.open();
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Booking failed. Please try again.";
      setAvailabilityError(errorMsg);
      toast.error(errorMsg);
      setLoading(false);
      setPaymentProcessing(false);
    }
  };

  const handleSubmit = (e) => {
    if (paymentMethod === "online") {
      handleOnlineBooking(e);
    } else {
      handleCounterBooking(e);
    }
  };

  if (!cabin) {
    return (
      <div className="admin-dash">
        {isAdmin ? <AdminNavbar /> : <UsersNavbar />}
        <div className="admin-dash__loading">
          <div className="admin-dash__spinner" />
          <p className="admin-dash__loading-text">Preparing workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dash">
      {isAdmin ? <AdminNavbar /> : <UsersNavbar />}

      <main className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-slate-400 hover:text-indigo-600 mb-6 transition-colors"
        >
          <ArrowLeft size={14} /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
          {/* Left Summary */}
          <div className="lg:col-span-5">
            <div className="admin-dash__card p-6 sticky top-28">
              <div className="h-48 sm:h-60 rounded-2xl overflow-hidden mb-6 relative group">
                <img
                  src={getImageUrl(cabin.images?.[0])}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  alt=""
                  onError={(e) => {
                    e.target.src = PLACEHOLDER_IMAGE;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-indigo-700 shadow-sm">
                  Premium
                </div>
              </div>

              <h2 className="text-xl font-bold uppercase text-slate-900 mb-1">
                {cabin.name}
              </h2>

              <div className="flex items-center gap-2 text-slate-500 text-sm font-semibold mb-6">
                <div className="p-1.5 bg-indigo-50 rounded-lg">
                  <MapPin size={16} className="text-indigo-500" />
                </div>
                {cabin.address}
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-300 flex flex-col justify-center">
                  <div className="text-[10px] uppercase tracking-[0.1em] text-indigo-700 font-bold mb-1">
                    Capacity
                  </div>
                  <div className="font-black text-slate-900 text-base flex items-center gap-1.5">
                    <Users size={18} className="text-indigo-600" /> {cabin.capacity} <span className="text-[10px] text-slate-400 uppercase">Seats</span>
                  </div>
                </div>

                <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-300 flex flex-col justify-center">
                  <div className="text-[10px] uppercase tracking-[0.1em] text-indigo-700 font-bold mb-1">
                    Rate
                  </div>
                  <div className="font-black text-slate-900 text-base flex items-baseline gap-0.5">
                    ₹{cabin.price} <span className="text-[10px] text-slate-400">/ HOUR</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-5 border-t border-slate-100 text-slate-500 text-xs font-medium">
                <ShieldCheck size={16} className="text-emerald-600" />
                Verified professional workspace
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="lg:col-span-7 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* User */}
              <div className="admin-dash__card p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6 sm:mb-8">
                  <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg">
                    <User size={20} />
                  </div>
                  <h3 className="text-base sm:text-lg font-black uppercase text-slate-900 tracking-tight">
                    Client Credential
                  </h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-4 text-slate-400" size={18} />
                      <input
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-semibold text-sm text-slate-900 placeholder:text-slate-300"
                        placeholder="e.g. John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Mobile Number</label>
                    <div className="relative">
                      <History className="absolute left-4 top-4 text-slate-400" size={18} />
                      <input
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-semibold text-sm text-slate-900 placeholder:text-slate-300"
                        placeholder="e.g. +91 9876543210"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="admin-dash__card p-4 sm:p-5 bg-white shadow-sm border border-slate-100 rounded-2xl">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 block ml-1">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("online")}
                    className={`flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all border ${
                      paymentMethod === "online"
                        ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-500/20"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50 bg-white"
                    }`}
                  >
                    <CreditCard size={18} />
                    Online Payment
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("counter")}
                    className={`flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all border ${
                      paymentMethod === "counter"
                        ? "bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-500/20"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50 bg-white"
                    }`}
                  >
                    <Store size={18} />
                    Pay at Counter
                  </button>
                </div>
                {paymentMethod === "counter" && (
                  <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-700 text-sm font-medium">
                    <CheckCircle size={16} />
                    Booking confirmed immediately. Pay at the counter when you arrive.
                  </div>
                )}
              </div>

              {/* Hourly / Plan Toggles */}
              {cabin.pricingPlans && cabin.pricingPlans.length > 0 && (
                <div className="admin-dash__card p-4 sm:p-5 flex gap-4 bg-white shadow-sm border border-slate-100 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => {
                      setBookingBasis("hourly");
                      setSelectedPlan(null);
                    }}
                    className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all border ${
                      bookingBasis === "hourly"
                        ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-500/20"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50 bg-white"
                    }`}
                  >
                    Hourly Booking
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setBookingBasis("plan");
                      setSelectedPlan(cabin.pricingPlans[0]);
                    }}
                    className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all border ${
                      bookingBasis === "plan"
                        ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-500/20"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50 bg-white"
                    }`}
                  >
                    Plan Subscription
                  </button>
                </div>
              )}

              {/* Plan Selector */}
              {bookingBasis === "plan" && cabin.pricingPlans && cabin.pricingPlans.length > 0 && (
                <div className="admin-dash__card p-6 sm:p-8 bg-white shadow-sm border border-slate-100 rounded-2xl">
                  <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-4 ml-1">
                    Select pricing plan
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {cabin.pricingPlans.map((plan) => (
                      <div
                        key={plan._id}
                        onClick={() => setSelectedPlan(plan)}
                        className={`cursor-pointer rounded-2xl p-5 border-2 transition-all relative ${
                          selectedPlan?._id === plan._id
                            ? "border-indigo-600 bg-indigo-50/40 shadow-sm"
                            : "border-slate-200 hover:border-slate-300 bg-white"
                        }`}
                      >
                        {selectedPlan?._id === plan._id && (
                          <div className="absolute top-3.5 right-3.5 bg-indigo-600 text-white p-1 rounded-full">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                            </svg>
                          </div>
                        )}
                        <h4 className="font-extrabold text-slate-900 text-sm mb-2">{plan.label || "Plan"}</h4>
                        <div className="space-y-1.5 text-xs text-slate-600 font-semibold">
                          <p className="text-indigo-600">{plan.hours} Hours included</p>
                          <p className="text-emerald-700">₹{plan.cost.toLocaleString("en-IN")}</p>
                          <p className="text-slate-400">Validity: {plan.validity} Days</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Schedule */}
              <div className="admin-dash__card p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6 sm:mb-8">
                  <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg">
                    <History size={20} />
                  </div>
                  <h3 className="text-base sm:text-lg font-black uppercase text-slate-900 tracking-tight">
                    {bookingBasis === "hourly" ? "Booking Schedule" : "Plan Start Window"}
                  </h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-500 mb-2 block uppercase tracking-widest px-1">Start Date & Time</label>
                    <div className="flex gap-2">
                      <input
                        type="date"
                        className="flex-1 rounded-xl bg-slate-50 border border-slate-200 p-4 outline-none font-bold text-sm text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                      />
                      <input
                        type="time"
                        className="w-32 rounded-xl bg-slate-50 border border-slate-200 p-4 outline-none font-bold text-sm text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {bookingBasis === "hourly" ? (
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-slate-500 mb-2 block uppercase tracking-widest px-1">End Date & Time</label>
                      <div className="flex gap-2">
                        <input
                          type="date"
                          className="flex-1 rounded-xl bg-slate-50 border border-slate-200 p-4 outline-none font-bold text-sm text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          required
                        />
                        <input
                          type="time"
                          className="w-32 rounded-xl bg-slate-50 border border-slate-200 p-4 outline-none font-bold text-sm text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  ) : (
                    selectedPlan && endDate && (
                      <div className="space-y-2 bg-indigo-50/40 border border-indigo-100 rounded-2xl p-4 flex flex-col justify-center">
                        <p className="text-[10px] uppercase font-bold text-indigo-700 tracking-wider">Plan Validity</p>
                        <p className="text-sm font-bold text-slate-800">
                          Active until: <span className="text-indigo-600">{endDate}</span>
                        </p>
                        <p className="text-xs text-slate-400">Valid for {selectedPlan.validity} days from start date</p>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Price Overview */}
              {totalHours > 0 && (
                <div className={`rounded-2xl p-6 sm:p-8 shadow-2xl flex items-center justify-between ${
                  paymentMethod === "online" 
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 shadow-indigo-500/30 text-white"
                    : "bg-gradient-to-r from-emerald-600 to-teal-600 shadow-emerald-500/30 text-white"
                }`}>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70 block mb-2">Total Amount</span>
                    <div className="text-3xl sm:text-4xl font-black tracking-tighter">
                      ₹{totalPrice.toLocaleString("en-IN")}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70 block mb-2">Duration</span>
                    <div className="text-lg sm:text-xl font-black text-white/90 uppercase tracking-tight">
                      {totalHours} HOURS
                    </div>
                  </div>
                </div>
              )}

              {availabilityError && (
                <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm font-semibold border border-red-100 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  {availabilityError}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || paymentProcessing || totalPrice <= 0}
                className={`w-full py-4 rounded-xl font-bold text-sm uppercase tracking-[0.1em] flex justify-center items-center gap-3 transition-all shadow-lg active:scale-[0.98] ${
                  loading || paymentProcessing || totalPrice <= 0
                    ? "bg-slate-100 text-slate-300 cursor-not-allowed"
                    : paymentMethod === "online"
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-indigo-500/20"
                      : "bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 shadow-emerald-500/20"
                }`}
              >
                {paymentProcessing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing Payment...
                  </>
                ) : loading ? (
                  "Synchronizing…"
                ) : paymentMethod === "online" ? (
                  <>
                    <CreditCard size={18} />
                    Pay ₹{totalPrice.toLocaleString("en-IN")} & Book
                  </>
                ) : (
                  <>
                    <Store size={18} />
                    Confirm & Pay at Counter
                  </>
                )}
                {!loading && !paymentProcessing && <ArrowRight size={18} />}
              </button>

              {paymentMethod === "online" ? (
                <div className="text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                  <ShieldCheck size={14} className="text-emerald-500" />
                  Secure payment via Razorpay
                </div>
              ) : (
                <div className="text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                  <Store size={14} className="text-emerald-500" />
                  Pay at the counter when you arrive
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Related */}
        {relatedCabins.length > 0 && (
          <div className="mt-16 border-t border-slate-200 pt-12">
            <h2 className="text-xl sm:text-2xl font-bold uppercase text-slate-900 mb-6 sm:mb-8 tracking-tight">
              Related Workspaces
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedCabins.map((rc) => (
                <div
                  key={rc._id}
                  onClick={() => navigate(`/cabin/${rc._id}`)}
                  className="admin-dash__card cursor-pointer hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="h-48 overflow-hidden rounded-t-2xl relative">
                    <img
                      src={getImageUrl(rc.images?.[0])}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      alt=""
                      onError={(e) => {
                        e.target.src = PLACEHOLDER_IMAGE;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-indigo-700 shadow-sm">
                      Available
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <h4 className="text-base font-bold uppercase text-slate-900 truncate">
                      {rc.name}
                    </h4>

                    <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                      <MapPin size={14} />
                      {rc.address?.split(",")[0]}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <span className="text-base font-bold text-slate-900">
                        ₹{rc.price}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 group-hover:underline">
                        View
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default BookCabin;