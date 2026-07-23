// BookCabin.jsx - Complete with Pay on Counter Only (Seats Optional)
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
  CheckCircle,
  IndianRupee,
  Receipt,
  FileText,
  X,
  ChevronDown,
  ChevronUp,
  Armchair
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import UsersNavbar from "./UsersNavbar";
import AdminNavbar from "./AdminNavbar";
import "./Dashboard.css";

const API_URL = "http://localhost:5003";
const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000";
const GST_RATE = 0.18;
const SEAT_EXTRA_CHARGE = 100; // ₹100 per seat

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

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [termsExpanded, setTermsExpanded] = useState(true);

  // Seat selection state - OPTIONAL
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedSeatCount, setSelectedSeatCount] = useState(0);
  const [extraCharge, setExtraCharge] = useState(0);

  const [totalHours, setTotalHours] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [gstAmount, setGstAmount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [availabilityError, setAvailabilityError] = useState("");
  const [loading, setLoading] = useState(false);

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

  // Update extra charge when selected seats change
  useEffect(() => {
    const count = selectedSeats.length;
    setSelectedSeatCount(count);
    const extra = count * SEAT_EXTRA_CHARGE;
    setExtraCharge(extra);
  }, [selectedSeats]);

  useEffect(() => {
    if (startDate && startTime && totalPrice > 0) {
      setShowTerms(true);
      setTermsExpanded(true);
    } else {
      setShowTerms(false);
      setTermsAccepted(false);
    }
  }, [startDate, startTime, totalPrice]);

  // Handle seat selection toggle
  const toggleSeat = (seatId) => {
    setSelectedSeats(prev => {
      if (prev.includes(seatId)) {
        return prev.filter(id => id !== seatId);
      } else {
        return [...prev, seatId];
      }
    });
  };

  // Reset seat selection
  const resetSeats = () => {
    setSelectedSeats([]);
  };

  useEffect(() => {
    let hours = 0;
    let price = 0;

    if (bookingBasis === "hourly") {
      if (startDate && startTime && endDate && endTime) {
        const start = new Date(`${startDate}T${startTime}`);
        const end = new Date(`${endDate}T${endTime}`);

        if (end <= start) {
          setTotalHours(0);
          setSubtotal(0);
          setGstAmount(0);
          setTotalPrice(0);
          return;
        }

        hours = Math.ceil((end - start) / (1000 * 60 * 60));
        price = hours * (cabin?.price || 0);
        setTotalHours(hours);
        setSubtotal(price);
      }
    } else {
      if (selectedPlan) {
        hours = Number(selectedPlan.hours) || 0;
        price = Number(selectedPlan.cost) || 0;
        setTotalHours(hours);
        setSubtotal(price);
        
        if (startDate && startTime) {
          const start = new Date(`${startDate}T${startTime}`);
          const validityDays = Number(selectedPlan.validity) || 30;
          const end = new Date(start.getTime() + validityDays * 24 * 60 * 60 * 1000);
          setEndDate(end.toISOString().split("T")[0]);
          setEndTime(startTime);
        }
      } else {
        setTotalHours(0);
        setSubtotal(0);
        setGstAmount(0);
        setTotalPrice(0);
        return;
      }
    }

    // Add extra charge for seats if any selected
    const totalWithSeats = price + extraCharge;
    const gst = totalWithSeats * GST_RATE;
    const total = totalWithSeats + gst;
    
    setGstAmount(gst);
    setTotalPrice(total);
    setAvailabilityError("");
  }, [startDate, startTime, endDate, endTime, bookingBasis, selectedPlan, cabin, extraCharge]);

  const handleBooking = async (e) => {
    e.preventDefault();
    
    // ✅ Seat selection is OPTIONAL - No validation needed
    // User can book with 0 seats

    if (!termsAccepted) {
      toast.error("Please accept Terms & Conditions to proceed");
      return;
    }

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
        selectedSeats: selectedSeats || [], // ✅ Empty array if no seats selected
        extraCharge: extraCharge || 0,
        seatCount: selectedSeats.length || 0,
        paymentMethod: "cash",
        subtotal: subtotal,
        gstAmount: gstAmount,
        totalAmount: totalPrice,
        termsAccepted: true
      };

      console.log("Booking Data:", bookingData);

      const res = await axios.post(
        `${API_URL}/api/bookings/createbooking/${userId}`,
        bookingData,
        getAuthHeader()
      );

      if (res.data.success) {
        toast.success(`Booking confirmed! Total: ₹${totalPrice.toFixed(2)} (incl. GST ₹${gstAmount.toFixed(2)})`);
        if (selectedSeats.length > 0) {
          toast.info(`Selected ${selectedSeats.length} seat(s). Extra charge: ₹${extraCharge}`);
        }
        toast.info("Please pay cash at the counter.");
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

  const toggleTerms = () => {
    setTermsExpanded(!termsExpanded);
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

              {/* Seat Selection Section - OPTIONAL */}
              {cabin.seats && cabin.seats.length > 0 && (
                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                      <Armchair size={14} className="text-indigo-600" />
                      Select Seats <span className="text-[8px] text-slate-400 font-normal">(Optional)</span>
                    </h3>
                    {selectedSeats.length > 0 && (
                      <button
                        onClick={resetSeats}
                        className="text-[10px] font-bold text-red-500 hover:text-red-700 transition-colors"
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {cabin.seats.map((seat) => {
                      const isSelected = selectedSeats.includes(seat._id);
                      return (
                        <button
                          key={seat._id}
                          onClick={() => toggleSeat(seat._id)}
                          className={`
                            relative p-2 rounded-xl border-2 text-center transition-all
                            ${isSelected 
                              ? 'border-indigo-600 bg-indigo-50 shadow-md shadow-indigo-100' 
                              : 'border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30'
                            }
                            group
                          `}
                        >
                          <Armchair 
                            size={16} 
                            className={`mx-auto mb-1 transition-colors ${
                              isSelected ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-500'
                            }`}
                          />
                          <div className="text-[10px] font-bold text-slate-700 truncate">
                            {seat.name}
                          </div>
                          <div className="text-[8px] text-slate-400 font-medium">
                            #{seat.number}
                          </div>
                          {isSelected && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center">
                              <CheckCircle size={12} className="text-white" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Seat Selection Summary */}
                  {selectedSeats.length > 0 && (
                    <div className="mt-3 p-3 bg-indigo-50/50 rounded-xl border border-indigo-100">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600 font-medium">
                          Selected: <strong className="text-indigo-600">{selectedSeats.length}</strong> seat{selectedSeats.length > 1 ? 's' : ''}
                        </span>
                        <span className="text-slate-600 font-medium">
                          Extra: <strong className="text-amber-600">₹{extraCharge}</strong>
                        </span>
                      </div>
                      {selectedSeats.length > 0 && (
                        <div className="mt-1 text-[10px] text-amber-600 font-medium">
                          ₹{SEAT_EXTRA_CHARGE} per seat
                        </div>
                      )}
                    </div>
                  )}
                  
                  {selectedSeats.length === 0 && (
                    <div className="mt-2 text-[10px] text-slate-400 text-center">
                      No seats selected. You can book without selecting seats.
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center gap-3 pt-5 border-t border-slate-100 text-slate-500 text-xs font-medium">
                <ShieldCheck size={16} className="text-emerald-600" />
                Verified professional workspace
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <form onSubmit={handleBooking} className="space-y-6">
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

              <div className="admin-dash__card p-4 sm:p-5 bg-white shadow-sm border border-slate-100 rounded-2xl">
                <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <IndianRupee size={20} className="text-emerald-600" />
                  <div>
                    <p className="text-sm font-bold text-emerald-700">Pay on Counter</p>
                    <p className="text-xs text-emerald-600">Pay cash when you arrive at the workspace</p>
                  </div>
                </div>
              </div>

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

              {/* Terms & Conditions */}
              {showTerms && (
                <div className="admin-dash__card p-6 sm:p-8 bg-white border border-slate-200 rounded-2xl animate-in fade-in slide-in-from-top duration-300">
                  <div 
                    className="flex items-center justify-between cursor-pointer"
                    onClick={toggleTerms}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600 shrink-0">
                        <FileText size={18} />
                      </div>
                      <h4 className="text-sm font-semibold text-slate-900">Terms & Conditions</h4>
                    </div>
                    <button
                      type="button"
                      className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
                    >
                      {termsExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  </div>

                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    termsExpanded ? 'max-h-[800px] opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'
                  }`}>
                    <div className="space-y-3 text-sm text-slate-600">
                      <div className="pl-3 border-l-2 border-indigo-400">
                        <p className="font-medium text-slate-700">1. Booking Confirmation</p>
                        <p className="text-slate-500 text-xs mt-0.5">Your booking becomes active immediately upon successful payment or cash confirmation at the counter.</p>
                      </div>

                      <div className="pl-3 border-l-2 border-amber-400">
                        <p className="font-medium text-slate-700">2. Booking Replacement / Reschedule</p>
                        <p className="text-slate-500 text-xs mt-0.5">
                          You may replace or reschedule your booking within 24 hours of the scheduled start time, subject to availability of another cabin under the same owner.
                        </p>
                        <p className="text-slate-500 text-xs mt-1">
                          <span className="font-medium text-slate-700">Price Adjustment:</span> If the replacement cabin has a higher price, you will need to pay the remaining amount difference. If the replacement cabin has a lower price, the difference will be refunded to your account.
                        </p>
                      </div>

                      <div className="pl-3 border-l-2 border-emerald-400">
                        <p className="font-medium text-slate-700">3. Refund Policy — Single Day Booking</p>
                        <p className="text-slate-500 text-xs mt-0.5">
                          For bookings of 1 day or less, cancellations made within 24 hours of booking confirmation are eligible for a full refund, minus applicable payment gateway charges.
                        </p>
                      </div>

                      <div className="pl-3 border-l-2 border-rose-400">
                        <p className="font-medium text-slate-700">4. Refund Policy — Multi-Day Booking</p>
                        <p className="text-slate-500 text-xs mt-0.5">
                          For bookings exceeding 1 day, cancellations will receive a 50% refund of the total booking amount. No refunds are applicable for no-shows or late cancellations.
                        </p>
                      </div>

                      <div className="pl-3 border-l-2 border-indigo-400">
                        <p className="font-medium text-slate-700">5. Seat Selection & Charges</p>
                        <p className="text-slate-500 text-xs mt-0.5">
                          Seat selection is optional. Each selected seat incurs an extra charge of ₹{SEAT_EXTRA_CHARGE} per hour.
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="termsCheckbox"
                          checked={termsAccepted}
                          onChange={(e) => setTermsAccepted(e.target.checked)}
                          className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        />
                        <label htmlFor="termsCheckbox" className="text-xs font-medium text-slate-700 cursor-pointer">
                          I have read and accept the Terms & Conditions
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {totalPrice > 0 && (
                <div className="rounded-2xl p-6 sm:p-8 shadow-2xl bg-gradient-to-r from-emerald-600 to-teal-600 shadow-emerald-500/30 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">Price Breakdown</span>
                    <Receipt size={18} className="text-white/60" />
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center text-white/80">
                      <span>Subtotal ({totalHours} hours)</span>
                      <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                    </div>
                    {selectedSeats.length > 0 && (
                      <div className="flex justify-between items-center text-white/80">
                        <span>Seat Charges ({selectedSeats.length} × ₹{SEAT_EXTRA_CHARGE})</span>
                        <span className="font-semibold">₹{extraCharge.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-white/80">
                      <span>GST (18%)</span>
                      <span className="font-semibold">₹{gstAmount.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-white/20 pt-2 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-white/90">Total Amount</span>
                        <div className="text-2xl sm:text-3xl font-black tracking-tighter">
                          ₹{totalPrice.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    {selectedSeats.length > 0 ? (
                      <div className="text-[10px] text-white/60 text-center mt-1">
                        {selectedSeats.length} seat{selectedSeats.length > 1 ? 's' : ''} selected • ₹{SEAT_EXTRA_CHARGE} per seat
                      </div>
                    ) : (
                      <div className="text-[10px] text-white/60 text-center mt-1">
                        No seats selected
                      </div>
                    )}
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
                disabled={loading || totalPrice <= 0 || (showTerms && !termsAccepted)}
                className={`w-full py-4 rounded-xl font-bold text-sm uppercase tracking-[0.1em] flex justify-center items-center gap-3 transition-all shadow-lg active:scale-[0.98] ${
                  loading || totalPrice <= 0 || (showTerms && !termsAccepted)
                    ? "bg-slate-100 text-slate-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 shadow-emerald-500/20"
                }`}
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Confirming...
                  </>
                ) : (showTerms && !termsAccepted) ? (
                  <>
                    <FileText size={18} />
                    Accept Terms First
                  </>
                ) : (
                  <>
                    <IndianRupee size={18} />
                    Pay on Counter ₹{totalPrice.toFixed(2)}
                  </>
                )}
                {!loading && termsAccepted && <ArrowRight size={18} />}
              </button>

              <div className="text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                <IndianRupee size={14} className="text-emerald-500" />
                Pay cash at the counter when you arrive
              </div>
            </form>
          </div>
        </div>

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