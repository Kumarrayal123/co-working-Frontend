import axios from "axios";
import {
  ArrowLeft,
  ArrowRight,
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
  Armchair,
  Calendar,
  Clock,
  PhoneCall
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import UsersNavbar from "./UsersNavbar";
import AdminNavbar from "./AdminNavbar";
import SimpleUserNavbar from "./SimpleUserNavbar";
import DoctorNavbar from "./DoctorNavbar";
import "./Dashboard.css";

const API_URL = "https://spaceapi.iryax.com";
const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000";
const GST_RATE = 0.18;
const SEAT_EXTRA_CHARGE = 100;

// Helper function to convert 12-hour time to 24-hour format
const convertTo24Hour = (time12, amPm) => {
  if (!time12) return "";
  const [hours, minutes] = time12.split(':').map(Number);
  if (isNaN(hours) || isNaN(minutes)) return time12;
  
  let hours24 = hours;
  if (amPm === 'PM' && hours !== 12) {
    hours24 = hours + 12;
  } else if (amPm === 'AM' && hours === 12) {
    hours24 = 0;
  }
  
  return `${String(hours24).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

const getTodayDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getCurrentTimeString = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

const BookCabin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // ✅ Get user data from localStorage
  const getUserData = () => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        if (userData && (userData.role === "doctor" || userData.isDoctor === true)) {
          return { user: userData, role: "doctor" };
        }
        if (userData && userData._id) {
          return { user: userData, role: userData.role || "user" };
        }
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }

    const doctorFlag = localStorage.getItem("doctor") || localStorage.getItem("isDoctor");
    if (doctorFlag === "true") {
      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          const parsed = JSON.parse(userData);
          if (parsed && parsed._id) {
            return { user: parsed, role: parsed.role || "doctor" };
          }
        } catch (e) {
          console.error("Error parsing user data:", e);
        }
      }
      return { user: null, role: "doctor" };
    }

    const adminStr = localStorage.getItem("admin");
    if (adminStr) {
      try {
        const adminData = JSON.parse(adminStr);
        if (adminData && adminData._id) {
          return { user: adminData, role: "admin" };
        }
      } catch (e) {
        console.error("Error parsing admin data:", e);
      }
    }

    return { user: null, role: "user" };
  };

  const { user: currentUser, role: userRole } = getUserData();
  
  const isAdmin = userRole === "admin";
  const isDoctor = userRole === "doctor";

  const renderNavbar = () => {
    if (isDoctor) {
      return <DoctorNavbar />;
    } else if (isAdmin) {
      return <AdminNavbar />;
    } else if (userRole === "user") {
      return <SimpleUserNavbar />;
    } else {
      return <UsersNavbar />;
    }
  };

  const [cabin, setCabin] = useState(null);
  const [relatedCabins, setRelatedCabins] = useState([]);

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [startAmPm, setStartAmPm] = useState("AM");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [endAmPm, setEndAmPm] = useState("PM");

  const handleNameChange = (e) => {
    const val = e.target.value.replace(/[^A-Za-z\s]/g, "").slice(0, 25);
    setName(val);
  };

  const handleMobileChange = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
    setMobile(val);
  };

  const handleStartDateChange = (e) => {
    const val = e.target.value;
    const todayStr = getTodayDateString();
    if (val && val < todayStr) {
      toast.error("Previous dates cannot be selected.");
      setStartDate(todayStr);
      return;
    }
    setStartDate(val);
    if (endDate && endDate < val) {
      setEndDate(val);
    }
  };

  const handleStartTimeChange = (e) => {
    const val = e.target.value;
    setStartTime(val);
  };

  const handleEndDateChange = (e) => {
    const val = e.target.value;
    const minDate = startDate || getTodayDateString();
    if (val && val < minDate) {
      toast.error("End date cannot be before start date.");
      setEndDate(minDate);
      return;
    }
    setEndDate(val);
  };

  const handleEndTimeChange = (e) => {
    const val = e.target.value;
    setEndTime(val);
  };

  const [bookingBasis, setBookingBasis] = useState("hourly");
  const [selectedPlan, setSelectedPlan] = useState(null);

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [termsExpanded, setTermsExpanded] = useState(true);

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedSeatCount, setSelectedSeatCount] = useState(0);
  const [extraCharge, setExtraCharge] = useState(0);

  const [totalHours, setTotalHours] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [gstAmount, setGstAmount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [availabilityError, setAvailabilityError] = useState("");
  const [loading, setLoading] = useState(false);
  
  // ✅ Multi-day slots
  const [bookingSlots, setBookingSlots] = useState([]);

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

  // ✅ Convert to Indian time format for display
  const convertToIndianTime = (timeStr) => {
    if (!timeStr) return "N/A";
    if (timeStr.includes('AM') || timeStr.includes('PM')) return timeStr;
    try {
      const parts = timeStr.split(':');
      if (parts.length >= 2) {
        let hours = parseInt(parts[0]);
        const minutes = parts[1];
        if (isNaN(hours)) return timeStr;
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const hour12 = hours % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
      }
      return timeStr;
    } catch (e) {
      return timeStr;
    }
  };

  // ✅ Format date in Indian format
  const formatDateIndian = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = String(d.getFullYear()).slice(2);
    return `${day}/${month}/${year}`;
  };

  // ✅ Generate daily slots between start and end date automatically
  const generateDailySlots = (start, end, startTimeStr, endTimeStr) => {
    const slots = [];
    const [startYear, startMonth, startDay] = start.split('-').map(Number);
    const [endYear, endMonth, endDay] = end.split('-').map(Number);

    const current = new Date(startYear, startMonth - 1, startDay);
    const endDateObj = new Date(endYear, endMonth - 1, endDay);

    current.setHours(0, 0, 0, 0);
    endDateObj.setHours(0, 0, 0, 0);

    let dayCount = 0;
    while (current <= endDateObj) {
      const year = current.getFullYear();
      const month = String(current.getMonth() + 1).padStart(2, '0');
      const day = String(current.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      slots.push({
        date: dateStr,
        startTime: startTimeStr,
        endTime: endTimeStr,
        hours: calculateDailyHours(startTimeStr, endTimeStr)
      });
      current.setDate(current.getDate() + 1);
      dayCount++;

      // Safety limit to prevent infinite loops
      if (dayCount > 365) break;
    }

    return slots;
  };

  const calculateDailyHours = (startTimeStr, endTimeStr) => {
    try {
      const start = new Date(`2000-01-01T${startTimeStr}`);
      const end = new Date(`2000-01-01T${endTimeStr}`);
      
      if (end <= start) {
        end.setDate(end.getDate() + 1);
      }
      
      return Math.max(0, (end - start) / (1000 * 60 * 60));
    } catch (e) {
      return 0;
    }
  };

  const calculateTotalHours = (slots) => {
    return slots.reduce((total, slot) => total + slot.hours, 0);
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

  // ✅ Auto-generate booking slots when date/time changes
  useEffect(() => {
    if (bookingBasis === "hourly" && startDate && startTime && endDate && endTime) {
      const start24 = convertTo24Hour(startTime, startAmPm);
      const end24 = convertTo24Hour(endTime, endAmPm);
      
      if (start24 && end24) {
        const start = new Date(`${startDate}T${start24}`);
        const end = new Date(`${endDate}T${end24}`);
        
        if (end > start) {
          const slots = generateDailySlots(startDate, endDate, start24, end24);
          setBookingSlots(slots);
        } else {
          setBookingSlots([]);
        }
      }
    } else if (bookingBasis === "hourly") {
      setBookingSlots([]);
    }
  }, [bookingBasis, startDate, startTime, startAmPm, endDate, endTime, endAmPm]);

  // ✅ Calculate pricing
  useEffect(() => {
    if (!cabin) return;

    let hours = 0;
    let basePrice = 0;

    if (bookingBasis === "plan" && selectedPlan) {
      hours = selectedPlan.hours || 0;
      basePrice = selectedPlan.cost || 0;
    } else if (bookingBasis === "hourly") {
      // Calculate from booking slots or direct date/time
      if (bookingSlots.length > 0) {
        hours = calculateTotalHours(bookingSlots);
        basePrice = hours * (cabin.price || 0);
      } else if (startDate && startTime && endDate && endTime) {
        const start24 = convertTo24Hour(startTime, startAmPm);
        const end24 = convertTo24Hour(endTime, endAmPm);
        
        if (start24 && end24) {
          const start = new Date(`${startDate}T${start24}`);
          const end = new Date(`${endDate}T${end24}`);
          if (end > start) {
            hours = (end - start) / (1000 * 60 * 60);
            basePrice = hours * (cabin.price || 0);
          }
        }
      }
    }

    // Calculate seat charges
    const seatExtra = selectedSeats.length * SEAT_EXTRA_CHARGE;
    const subtotalAmount = basePrice + seatExtra;
    const gst = subtotalAmount * GST_RATE;
    const total = subtotalAmount + gst;

    setTotalHours(hours);
    setExtraCharge(seatExtra);
    setSubtotal(subtotalAmount);
    setGstAmount(gst);
    setTotalPrice(total);
    
  }, [cabin, bookingBasis, selectedPlan, bookingSlots, startDate, startTime, startAmPm, endDate, endTime, endAmPm, selectedSeats]);

  // ✅ Check availability
  useEffect(() => {
    const checkAvailability = async () => {
      if (!cabin || !startDate || !startTime || !endDate || !endTime) {
        setAvailabilityError("");
        return;
      }

      try {
        const start24 = convertTo24Hour(startTime, startAmPm);
        const end24 = convertTo24Hour(endTime, endAmPm);
        
        const response = await axios.post(`${API_URL}/api/cabins/check-availability`, {
          cabinId: id,
          startDate,
          startTime: start24,
          endDate,
          endTime: end24,
        });
        
        if (!response.data.available) {
          setAvailabilityError("This time slot is already booked. Please choose a different time.");
        } else {
          setAvailabilityError("");
        }
      } catch (err) {
        console.error("Availability check failed:", err);
      }
    };

    checkAvailability();
  }, [cabin, id, startDate, startTime, startAmPm, endDate, endTime, endAmPm]);

  // ✅ Toggle terms
  const toggleTerms = () => {
    setTermsExpanded(!termsExpanded);
  };

  // ✅ Handle booking submission
  const handleBooking = async (e) => {
    e.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) {
      toast.error("Please enter your full name.");
      return;
    }
    if (trimmedName.length > 25) {
      toast.error("Full Name cannot exceed 25 characters.");
      return;
    }
    if (!/^[A-Za-z\s]+$/.test(trimmedName)) {
      toast.error("Full Name must contain only letters.");
      return;
    }

    if (!mobile) {
      toast.error("Please enter your mobile number.");
      return;
    }
    if (mobile.length !== 10) {
      toast.error("Mobile number must be exactly 10 digits.");
      return;
    }
    if (!/^[6-9]/.test(mobile)) {
      toast.error("Mobile number must start with 6, 7, 8, or 9.");
      return;
    }

    const todayStr = getTodayDateString();
    const currentTimeStr = getCurrentTimeString();

    if (!startDate) {
      toast.error("Please select a start date.");
      return;
    }
    if (!startTime) {
      toast.error("Please select a start time.");
      return;
    }
    if (startDate < todayStr) {
      toast.error("Start date cannot be in the past.");
      return;
    }
    
    const start24 = convertTo24Hour(startTime, startAmPm);
    const end24 = convertTo24Hour(endTime, endAmPm);
    
    if (startDate === todayStr && start24 < currentTimeStr) {
      toast.error("Start time cannot be in the past.");
      return;
    }

    if (!endDate) {
      toast.error("Please select an end date.");
      return;
    }
    if (!endTime) {
      toast.error("Please select an end time.");
      return;
    }
    if (endDate < startDate) {
      toast.error("End date cannot be before start date.");
      return;
    }
    if (startDate === endDate && end24 <= start24) {
      toast.error("End time must be after start time.");
      return;
    }

    if (!termsAccepted) {
      toast.error("Please accept the terms and conditions.");
      return;
    }

    if (availabilityError) {
      toast.error(availabilityError);
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to book a cabin.");
        navigate("/login");
        setLoading(false);
        return;
      }

      const bookingData = {
        cabinId: id,
        name,
        mobile,
        email: currentUser?.email || "",
        startDate,
        startTime: start24,
        endDate,
        endTime: end24,
        bookingBasis,
        selectedPlan,
        selectedSeats: selectedSeats || [],
        extraCharge: extraCharge || 0,
        seatCount: selectedSeats.length || 0,
        totalPrice,
        bookingSlots: bookingSlots.length > 0 ? bookingSlots : undefined,
        termsAccepted
      };

      const response = await axios.post(
        `${API_URL}/api/bookings/createbooking/${currentUser._id}`,
        bookingData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Booking successful!");
        navigate("/mybookings");
      } else {
        toast.error(response.data.message || "Booking failed");
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast.error(error.response?.data?.error || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  if (!cabin) {
    return (
      <div className="admin-dash" style={{ backgroundColor: '#ffffff' }}>
        {renderNavbar()}
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dash" style={{ backgroundColor: '#ffffff' }}>
      {renderNavbar()}

      <div className="pt-24 px-3 sm:px-4 md:px-6 lg:px-8 max-w-7xl mx-auto pb-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <button onClick={() => navigate(-1)} className="hover:text-indigo-600 transition-colors">
            <ArrowLeft size={16} />
          </button>
          <span>/</span>
          <span className="text-slate-900 font-medium">Book Space</span>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left: Space Details */}
          <div className="lg:col-span-3 space-y-6">
            <div className="admin-dash__card overflow-hidden rounded-2xl shadow-sm border border-slate-100">
              <div className="relative h-48 sm:h-64">
                <img
                  src={getImageUrl(cabin.images?.[0])}
                  alt={cabin.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-indigo-600 shadow-sm">
                    {cabin.cabinType === 'exclusive' ? 'Premium' : 'Standard'}
                  </span>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 mb-1">{cabin.name}</h1>
                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                      <MapPin size={14} />
                      <span>{cabin.address}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl sm:text-3xl font-black text-indigo-600">
                      ₹{cabin.price}
                    </div>
                    <div className="text-xs text-slate-500">per hour</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-50 rounded-xl p-3 text-center">
                    <Users size={20} className="mx-auto mb-1 text-indigo-600" />
                    <div className="text-lg font-bold text-slate-900">{cabin.capacity}</div>
                    <div className="text-xs text-slate-500">Capacity</div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 text-center">
                    <Armchair size={20} className="mx-auto mb-1 text-indigo-600" />
                    <div className="text-lg font-bold text-slate-900">{cabin.cabin}</div>
                    <div className="text-xs text-slate-500">Space</div>
                  </div>
                </div>

                {cabin.amenities && Object.keys(cabin.amenities).filter(key => cabin.amenities[key]).length > 0 && (
                  <div className="border-t border-slate-100 pt-4">
                    <h3 className="text-sm font-bold text-slate-900 mb-3">Amenities</h3>
                    <div className="flex flex-wrap gap-2">
                      {Object.keys(cabin.amenities).filter(key => cabin.amenities[key]).map(amenity => (
                        <span key={amenity} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">
                          {amenity.charAt(0).toUpperCase() + amenity.slice(1)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Seat Selection */}
            {cabin.capacity > 1 && (
              <div className="admin-dash__card p-5 sm:p-6 bg-white shadow-sm border border-slate-100 rounded-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg">
                    <Users size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Select Seats</h3>
                    <p className="text-xs text-slate-500">Choose additional seats (₹{SEAT_EXTRA_CHARGE}/seat)</p>
                  </div>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {Array.from({ length: cabin.capacity }, (_, i) => i + 1).map((seat) => (
                    <button
                      key={seat}
                      type="button"
                      onClick={() => {
                        if (selectedSeats.includes(seat)) {
                          setSelectedSeats(selectedSeats.filter(s => s !== seat));
                        } else {
                          setSelectedSeats([...selectedSeats, seat]);
                        }
                      }}
                      className={`py-3 rounded-xl font-bold text-sm transition-all ${
                        selectedSeats.includes(seat)
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {seat}
                    </button>
                  ))}
                </div>

                {selectedSeats.length > 0 && (
                  <div className="mt-3 text-sm text-indigo-600 font-medium">
                    Selected: {selectedSeats.length} seat(s) (+₹{selectedSeats.length * SEAT_EXTRA_CHARGE})
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

          {/* Right: Booking Form */}
          <div className="lg:col-span-2 space-y-6">
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
                        onChange={handleNameChange}
                        maxLength={25}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Mobile Number</label>
                    <div className="relative">
                      <PhoneCall className="absolute left-4 top-4 text-slate-400" size={18} />
                      <input
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-semibold text-sm text-slate-900 placeholder:text-slate-300"
                        placeholder="e.g. 9876543210"
                        value={mobile}
                        onChange={handleMobileChange}
                        maxLength={10}
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
                    Plan Booking
                  </button>
                </div>
              )}

              <div className="admin-dash__card p-6 sm:p-8 bg-white shadow-sm border border-slate-100 rounded-2xl">
                <div className="flex items-center gap-3 mb-6 sm:mb-8">
                  <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg">
                    <Calendar size={20} />
                  </div>
                  <h3 className="text-base sm:text-lg font-black uppercase text-slate-900 tracking-tight">
                    {bookingBasis === "hourly" ? "Booking Schedule" : "Plan Start Window"}
                  </h3>
                </div>

                {bookingBasis === "plan" && selectedPlan ? (
                  <div className="space-y-4">
                    <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-indigo-900">{selectedPlan.label}</span>
                        <span className="text-lg font-black text-indigo-600">₹{selectedPlan.cost}</span>
                      </div>
                      <div className="text-xs text-indigo-700">
                        {selectedPlan.hours} hours • Valid for {selectedPlan.validity}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Start Date</label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={handleStartDateChange}
                          min={getTodayDateString()}
                          className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-semibold text-sm text-slate-900"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Start Time</label>
                        <div className="flex gap-2">
                          <input
                            type="time"
                            value={startTime}
                            onChange={handleStartTimeChange}
                            className="flex-1 px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-semibold text-sm text-slate-900"
                            required
                          />
                          <select
                            value={startAmPm}
                            onChange={(e) => setStartAmPm(e.target.value)}
                            className="px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-semibold text-sm text-slate-900"
                          >
                            <option value="AM">AM</option>
                            <option value="PM">PM</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Start Date</label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={handleStartDateChange}
                          min={getTodayDateString()}
                          className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-semibold text-sm text-slate-900"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Start Time</label>
                        <div className="flex gap-2">
                          <input
                            type="time"
                            value={startTime}
                            onChange={handleStartTimeChange}
                            className="flex-1 px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-semibold text-sm text-slate-900"
                            required
                          />
                          <select
                            value={startAmPm}
                            onChange={(e) => setStartAmPm(e.target.value)}
                            className="px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-semibold text-sm text-slate-900"
                          >
                            <option value="AM">AM</option>
                            <option value="PM">PM</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">End Date</label>
                        <input
                          type="date"
                          value={endDate}
                          onChange={handleEndDateChange}
                          min={startDate || getTodayDateString()}
                          className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-semibold text-sm text-slate-900"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">End Time</label>
                        <div className="flex gap-2">
                          <input
                            type="time"
                            value={endTime}
                            onChange={handleEndTimeChange}
                            className="flex-1 px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-semibold text-sm text-slate-900"
                            required
                          />
                          <select
                            value={endAmPm}
                            onChange={(e) => setEndAmPm(e.target.value)}
                            className="px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-semibold text-sm text-slate-900"
                          >
                            <option value="AM">AM</option>
                            <option value="PM">PM</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Display Daily Slots */}
                    {bookingSlots.length > 0 && (
                      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-bold text-indigo-900">Daily Schedule</h4>
                          <span className="text-xs bg-indigo-600 text-white px-2 py-1 rounded-full">
                            {bookingSlots.length} day(s)
                          </span>
                        </div>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {bookingSlots.map((slot, index) => (
                            <div key={index} className="bg-white rounded-xl p-3 border border-indigo-200">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-slate-800">
                                  {(() => {
                                    const [year, month, day] = slot.date.split('-');
                                    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                                    return date.toLocaleDateString('en-IN', {
                                      day: '2-digit',
                                      month: 'short',
                                      year: 'numeric'
                                    });
                                  })()}
                                </span>
                                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                                  {slot.hours.toFixed(1)}h
                                </span>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                                <Clock size={12} />
                                <span>{convertToIndianTime(slot.startTime)} - {convertToIndianTime(slot.endTime)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 text-xs text-slate-500 bg-indigo-50 p-2 rounded-xl text-center">
                          Total: <strong className="text-indigo-700">{totalHours.toFixed(1)} hours</strong> across {bookingSlots.length} days
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="admin-dash__card p-6 sm:p-8 bg-white border border-slate-200 rounded-2xl">
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={toggleTerms}
                >
                  <div className="flex items-center gap-3">
                    <FileText size={20} className="text-indigo-600" />
                    <h3 className="text-base font-bold text-slate-900">Terms and Conditions</h3>
                  </div>
                  {termsExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>

                {termsExpanded && (
                  <div className="mt-4 text-xs text-slate-600 space-y-2 leading-relaxed">
                    <p>1. Booking confirmation is subject to availability.</p>
                    <p>2. Cancellations must be made at least 24 hours before the scheduled time.</p>
                    <p>3. No-show bookings will be charged in full.</p>
                    <p>4. Users must adhere to workspace rules and regulations.</p>
                    <p>5. The management reserves the right to refuse entry.</p>
                    <p>6. Payment is to be made at the counter upon arrival.</p>
                    <p>7. Valid ID proof is required for check-in.</p>
                    <p>8. Additional time usage will be charged at the standard rate.</p>
                  </div>
                )}

                <div className="mt-4 flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-1 w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                  />
                  <label htmlFor="terms" className="text-xs text-slate-600">
                    I have read and agree to the terms and conditions
                  </label>
                </div>
              </div>

              {/* Price Summary - Always visible when there's a valid booking */}
              {totalPrice > 0 && (
                <div className=" p-6 sm:p-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-lg shadow-indigo-500/20 text-white">
                  <h3 className="text-lg font-black mb-4">Price Summary</h3>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-indigo-200">Hours</span>
                      <span className="font-semibold">{totalHours.toFixed(1)}h</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-indigo-200">Base Price</span>
                      <span className="font-semibold">₹{(totalPrice - gstAmount - extraCharge).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-indigo-200">GST (18%)</span>
                      <span className="font-semibold">₹{gstAmount.toFixed(2)}</span>
                    </div>
                    {extraCharge > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-indigo-200">Extra Seats</span>
                        <span className="font-semibold">₹{extraCharge.toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-white/20 pt-4 flex justify-between items-center">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-2xl sm:text-3xl font-black">₹{totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {availabilityError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
                  {availabilityError}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || availabilityError || !totalPrice || isNaN(totalPrice) || totalPrice === 0}
                className={`w-full py-4 rounded-xl font-bold text-white text-sm sm:text-base transition-all ${
                  loading || availabilityError || !totalPrice || isNaN(totalPrice) || totalPrice === 0
                    ? 'bg-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg hover:shadow-indigo-500/20'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : totalPrice && !isNaN(totalPrice) && totalPrice > 0 ? (
                  `Confirm Booking • ₹${totalPrice.toFixed(2)}`
                ) : (
                  'Select date and time to book'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Related Spaces */}
        {relatedCabins.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-black text-slate-900 mb-6">Related Spaces</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedCabins.map((relatedCabin) => (
                <div
                  key={relatedCabin._id}
                  onClick={() => navigate(`/book/${relatedCabin._id}`)}
                  className="admin-dash__card overflow-hidden rounded-2xl shadow-sm border border-slate-100 cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="h-40">
                    <img
                      src={getImageUrl(relatedCabin.images?.[0])}
                      alt={relatedCabin.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-slate-900 mb-1">{relatedCabin.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">{relatedCabin.address}</span>
                      <span className="font-bold text-indigo-600">₹{relatedCabin.price}/hr</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCabin;