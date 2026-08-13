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
  PhoneCall,
  AlertCircle,
  Info
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
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

const resolveSeatIds = (selections, cabinSeats) => {
  if (!selections?.length || !cabinSeats?.length) return [];

  const cabinSeatIds = cabinSeats
    .filter((seat) => seat?._id)
    .map((seat) => String(seat._id));

  return selections
    .map((selectedId) => {
      const idStr = String(selectedId).trim();

      if (cabinSeatIds.includes(idStr)) return idStr;

      const seatNumber = Number(idStr.startsWith("num-") ? idStr.slice(4) : idStr);
      if (!Number.isNaN(seatNumber)) {
        const matchedSeat = cabinSeats.find(
          (seat) => Number(seat.number) === seatNumber || String(seat.number) === idStr
        );
        if (matchedSeat?._id) return String(matchedSeat._id);
      }

      return null;
    })
    .filter(Boolean);
};

// Helper function to convert time to 24-hour format
const convertTo24Hour = (timeStr, amPm) => {
  if (!timeStr) return "";
  
  const parts = timeStr.split(':');
  if (parts.length !== 2) return timeStr;
  
  let hours = parseInt(parts[0]);
  const minutes = parts[1];
  
  if (isNaN(hours) || isNaN(minutes)) return timeStr;
  
  if (amPm === 'PM' && hours < 12) {
    hours = hours + 12;
  } else if (amPm === 'AM' && hours === 12) {
    hours = 0;
  }
  
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

// Helper to convert 24hr to 12hr for display
const convertTo12Hour = (time24) => {
  if (!time24) return "N/A";
  try {
    const [hours, minutes] = time24.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) return time24;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    return `${hour12}:${String(minutes).padStart(2, '0')} ${ampm}`;
  } catch {
    return time24;
  }
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

// Custom Calendar Component
const CustomCalendar = ({ selectedDate, onSelectDate, bookedDates, onClose }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [viewDate, setViewDate] = useState(new Date());

  useEffect(() => {
    if (selectedDate) {
      const [year, month, day] = selectedDate.split('-').map(Number);
      setViewDate(new Date(year, month - 1, day));
      setCurrentMonth(new Date(year, month - 1, day));
    }
  }, [selectedDate]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    return { daysInMonth, firstDayOfMonth };
  };

  const { daysInMonth, firstDayOfMonth } = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleString('default', { month: 'long' });
  const year = currentMonth.getFullYear();

  const isDateBooked = (dateStr) => {
    return bookedDates.some(b => b.startDate === dateStr);
  };

  const isToday = (dateStr) => {
    return dateStr === getTodayDateString();
  };

  const isSelected = (dateStr) => {
    return dateStr === selectedDate;
  };

  const handleDateSelect = (day) => {
    const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateStr = `${currentMonth.getFullYear()}-${month}-${dayStr}`;
    onSelectDate(dateStr);
    onClose();
  };

  const changeMonth = (delta) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + delta);
    setCurrentMonth(newDate);
  };

  // Get bookings for selected date to show in tooltip
  const getBookingsForDate = (dateStr) => {
    return bookedDates.filter(b => b.startDate === dateStr);
  };

  const [hoveredDate, setHoveredDate] = useState(null);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full mx-4 p-6 shadow-2xl animate-in zoom-in duration-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900">Select Date</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => changeMonth(-1)}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <ArrowLeft size={18} className="text-slate-600" />
          </button>
          <span className="text-sm font-bold text-slate-900">
            {monthName} {year}
          </span>
          <button
            onClick={() => changeMonth(1)}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <ArrowRight size={18} className="text-slate-600" />
          </button>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day) => (
            <div key={day} className="text-center text-xs font-bold text-slate-400 py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for days before month starts */}
          {Array.from({ length: firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1 }).map((_, index) => (
            <div key={`empty-${index}`} className="aspect-square" />
          ))}

          {/* Days of the month */}
          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;
            const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
            const dayStr = String(day).padStart(2, '0');
            const dateStr = `${currentMonth.getFullYear()}-${month}-${dayStr}`;
            const isBooked = isDateBooked(dateStr);
            const isTodayDate = isToday(dateStr);
            const isSelectedDate = isSelected(dateStr);
            const bookings = getBookingsForDate(dateStr);
            const isPast = dateStr < getTodayDateString();

            return (
              <div
                key={day}
                className="relative aspect-square flex items-center justify-center"
                onMouseEnter={() => setHoveredDate(dateStr)}
                onMouseLeave={() => setHoveredDate(null)}
              >
                <button
                  onClick={() => handleDateSelect(day)}
                  disabled={isPast}
                  className={`
                    w-full h-full rounded-xl text-sm font-medium transition-all
                    ${isPast ? 'text-slate-300 cursor-not-allowed' : 'hover:bg-indigo-50'}
                    ${isSelectedDate ? 'bg-indigo-600 text-white hover:bg-indigo-700' : ''}
                    ${!isSelectedDate && !isPast ? 'text-slate-700 hover:bg-indigo-50' : ''}
                  `}
                >
                  {day}
                </button>
                
                {/* Blue dot for booked dates */}
                {isBooked && !isPast && (
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  </div>
                )}

                {/* Today indicator */}
                {isTodayDate && !isPast && (
                  <div className="absolute top-1 right-1">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                  </div>
                )}

                {/* Hover tooltip for booked dates */}
                {isBooked && hoveredDate === dateStr && bookings.length > 0 && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-10 bg-slate-800 text-white rounded-xl p-3 min-w-[180px] shadow-xl">
                    <div className="text-xs font-bold mb-1">
                      {bookings.length} booking{bookings.length > 1 ? 's' : ''}
                    </div>
                    {bookings.slice(0, 3).map((booking, idx) => (
                      <div key={idx} className="text-[10px] text-slate-300 py-0.5 border-t border-slate-700 mt-1 first:border-t-0 first:mt-0">
                        {booking.name || 'Guest'} • {booking.startTime} - {booking.endTime}
                      </div>
                    ))}
                    {bookings.length > 3 && (
                      <div className="text-[10px] text-slate-400 mt-1">
                        +{bookings.length - 3} more...
                      </div>
                    )}
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                      <div className="w-2 h-2 bg-slate-800 rotate-45"></div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-xs text-slate-500">Booked</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <span className="text-xs text-slate-500">Today</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 bg-indigo-600 rounded-md"></div>
            <span className="text-xs text-slate-500">Selected</span>
          </div>
        </div>

        {/* Clear and Today Buttons */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => {
              onSelectDate('');
              onClose();
            }}
            className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-colors text-sm"
          >
            Clear
          </button>
          <button
            onClick={() => {
              onSelectDate(getTodayDateString());
              onClose();
            }}
            className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors text-sm"
          >
            Today
          </button>
        </div>
      </div>
    </div>
  );
};

const BookCabin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);
  const startTimeRef = useRef(null);
  const endTimeRef = useRef(null);
  
  const getUserData = () => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const userData = JSON.parse(userStr);
        if (userData && userData._id) {
          const isCoworking = userData.role === "coworking" || userData.isCoworking === true;
          const isCabinOwner = userData.role === "cabinOwner";
          const isDoctor = userData.isDoctor === true || userData.role === "doctor";
          const isAdmin = userData.role === "admin";
          
          let role = "user";
          if (isAdmin) role = "admin";
          else if (isDoctor) role = "doctor";
          else if (isCabinOwner) role = "cabinOwner";
          else if (isCoworking) role = "coworking";
          else role = "user";
          
          return { 
            user: userData, 
            role: role
          };
        }
      }

      const adminStr = localStorage.getItem("admin");
      if (adminStr) {
        const adminData = JSON.parse(adminStr);
        if (adminData && adminData._id) {
          return { user: adminData, role: "admin" };
        }
      }

      const token = localStorage.getItem("token");
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const role = payload.role || payload.userRole || "user";
          return { user: null, role: role };
        } catch (e) {
          return { user: null, role: "user" };
        }
      }

      return { user: null, role: "user" };
    } catch (e) {
      console.error("Error getting user data:", e);
      return { user: null, role: "user" };
    }
  };

  const { user: currentUser, role: userRole } = getUserData();
  
  const isAdmin = userRole === "admin";
  const isDoctor = userRole === "doctor";
  const isCoworking = userRole === "coworking";
  const isCabinOwner = userRole === "cabinOwner";

  const renderNavbar = () => {
    if (isAdmin) {
      return <AdminNavbar />;
    } else if (isDoctor) {
      return <DoctorNavbar />;
    } else if (isCoworking || isCabinOwner) {
      // Show UsersNavbar for both coworking and cabinOwner
      return <UsersNavbar />;
    } else {
      // Only show SimpleUserNavbar for regular 'user' role
      return <SimpleUserNavbar />;
    }
  };

  const [cabin, setCabin] = useState(null);
  const [relatedCabins, setRelatedCabins] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);

  // Calendar state
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [startAmPm, setStartAmPm] = useState("AM");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [endAmPm, setEndAmPm] = useState("PM");

  const [timeError, setTimeError] = useState("");
  const [showTimeErrorModal, setShowTimeErrorModal] = useState(false);

  const handleNameChange = (e) => {
    const val = e.target.value.replace(/[^A-Za-z\s]/g, "").slice(0, 25);
    setName(val);
  };

  const handleMobileChange = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
    setMobile(val);
  };

  const handleStartDateClick = () => {
    setShowStartCalendar(true);
  };

  const handleEndDateClick = () => {
    setShowEndCalendar(true);
  };

  const handleStartDateSelect = (date) => {
    const todayStr = getTodayDateString();
    if (date && date < todayStr) {
      toast.error("Previous dates cannot be selected.");
      return;
    }
    setStartDate(date);
    if (endDate && endDate < date) {
      setEndDate(date);
    }
    setTimeError("");
    setShowTimeErrorModal(false);
  };

  const handleEndDateSelect = (date) => {
    const minDate = startDate || getTodayDateString();
    if (date && date < minDate) {
      toast.error("End date cannot be before start date.");
      return;
    }
    setEndDate(date);
    setTimeError("");
    setShowTimeErrorModal(false);
  };

  const handleStartTimeChange = (e) => {
    const val = e.target.value;
    setStartTime(val);
    if (val && endTime) {
      validateTimeRange(val, startAmPm, endTime, endAmPm);
    } else if (val && cabin && !cabin.is24x7) {
      const openTime = cabin.openTime || "09:00";
      const start24 = convertTo24Hour(val, startAmPm);
      if (start24 < openTime) {
        setTimeError(`Start time must be after ${convertTo12Hour(openTime)}`);
        setShowTimeErrorModal(true);
      } else {
        setTimeError("");
        setShowTimeErrorModal(false);
      }
    } else {
      setTimeError("");
      setShowTimeErrorModal(false);
    }
  };

  const handleEndTimeChange = (e) => {
    const val = e.target.value;
    setEndTime(val);
    if (startTime && val) {
      validateTimeRange(startTime, startAmPm, val, endAmPm);
    } else if (val && cabin && !cabin.is24x7) {
      const closeTime = cabin.closeTime || "21:00";
      const end24 = convertTo24Hour(val, endAmPm);
      if (end24 > closeTime) {
        setTimeError(`End time must be before ${convertTo12Hour(closeTime)}`);
        setShowTimeErrorModal(true);
      } else {
        setTimeError("");
        setShowTimeErrorModal(false);
      }
    } else {
      setTimeError("");
      setShowTimeErrorModal(false);
    }
  };

  const handleStartAmPmChange = (e) => {
    const val = e.target.value;
    setStartAmPm(val);
    if (startTime && endTime) {
      validateTimeRange(startTime, val, endTime, endAmPm);
    } else if (startTime && cabin && !cabin.is24x7) {
      const openTime = cabin.openTime || "09:00";
      const start24 = convertTo24Hour(startTime, val);
      if (start24 < openTime) {
        setTimeError(`Start time must be after ${convertTo12Hour(openTime)}`);
        setShowTimeErrorModal(true);
      } else {
        setTimeError("");
        setShowTimeErrorModal(false);
      }
    }
  };

  const handleEndAmPmChange = (e) => {
    const val = e.target.value;
    setEndAmPm(val);
    if (startTime && endTime) {
      validateTimeRange(startTime, startAmPm, endTime, val);
    } else if (endTime && cabin && !cabin.is24x7) {
      const closeTime = cabin.closeTime || "21:00";
      const end24 = convertTo24Hour(endTime, val);
      if (end24 > closeTime) {
        setTimeError(`End time must be before ${convertTo12Hour(closeTime)}`);
        setShowTimeErrorModal(true);
      } else {
        setTimeError("");
        setShowTimeErrorModal(false);
      }
    }
  };

  const validateTimeRange = (start12, startAmPmVal, end12, endAmPmVal) => {
    if (!cabin) return;
    
    if (cabin.is24x7) {
      setTimeError("");
      setShowTimeErrorModal(false);
      return;
    }

    const openTime = cabin.openTime || "09:00";
    const closeTime = cabin.closeTime || "21:00";

    const start24 = convertTo24Hour(start12, startAmPmVal);
    const end24 = convertTo24Hour(end12, endAmPmVal);

    if (!start24 || !end24) {
      setTimeError("");
      setShowTimeErrorModal(false);
      return;
    }

    if (start24 < openTime) {
      setTimeError(`Start time must be after ${convertTo12Hour(openTime)}`);
      setShowTimeErrorModal(true);
      return;
    }

    if (end24 > closeTime) {
      setTimeError(`End time must be before ${convertTo12Hour(closeTime)}`);
      setShowTimeErrorModal(true);
      return;
    }

    if (end24 <= start24) {
      setTimeError("End time must be after start time");
      setShowTimeErrorModal(true);
      return;
    }

    setTimeError("");
    setShowTimeErrorModal(false);
  };

  const [bookingBasis, setBookingBasis] = useState("hourly");
  const [selectedPlan, setSelectedPlan] = useState(null);

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsExpanded, setTermsExpanded] = useState(true);

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [extraCharge, setExtraCharge] = useState(0);

  const [totalHours, setTotalHours] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [gstAmount, setGstAmount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [availabilityError, setAvailabilityError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [bookingSlots, setBookingSlots] = useState([]);

  const getBookableSeats = () => {
    if (!cabin) return [];

    if (cabin.seats && cabin.seats.length > 0) {
      return cabin.seats.map((seat) => ({
        id: seat._id ? String(seat._id) : `num-${seat.number}`,
        name: seat.name || `Seat ${seat.number}`,
        number: seat.number,
      }));
    }

    const capacity = Number(cabin.capacity) || 0;
    if (capacity > 1) {
      return Array.from({ length: capacity }, (_, index) => ({
        id: index + 1,
        name: `Seat ${index + 1}`,
        number: index + 1,
      }));
    }

    return [];
  };

  const bookableSeats = getBookableSeats();
  const showSeatSelection = bookableSeats.length > 0;

  const toggleSeatSelection = (seatId) => {
    const idStr = String(seatId);
    setSelectedSeats((prev) =>
      prev.some((selectedId) => String(selectedId) === idStr)
        ? prev.filter((selectedId) => String(selectedId) !== idStr)
        : [...prev, idStr]
    );
  };

  const getSelectedSeatLabels = () =>
    bookableSeats
      .filter((seat) => selectedSeats.some((selectedId) => String(selectedId) === String(seat.id)))
      .map((seat) => seat.name);

  const getImageUrl = (img) => {
    if (!img) return PLACEHOLDER_IMAGE;
    if (img.startsWith("http")) return img;
    const cleanPath = img.replace(/\\/g, "/").replace(/^\/+/, "");
    return `${API_URL}/${cleanPath}`;
  };

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

  const formatDateIndian = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = String(d.getFullYear()).slice(2);
    return `${day}/${month}/${year}`;
  };

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

      let dailyStartTime = startTimeStr;
      let dailyEndTime = endTimeStr;

      if (dayCount === 0) {
        dailyStartTime = startTimeStr;
      } else {
        dailyStartTime = cabin.openTime || "09:00";
      }

      if (current.getTime() === endDateObj.getTime()) {
        dailyEndTime = endTimeStr;
      } else {
        dailyEndTime = cabin.closeTime || "21:00";
      }

      const hours = calculateDailyHours(dailyStartTime, dailyEndTime);
      
      if (hours > 0) {
        slots.push({
          date: dateStr,
          startTime: dailyStartTime,
          endTime: dailyEndTime,
          hours: hours
        });
      }
      
      current.setDate(current.getDate() + 1);
      dayCount++;

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

  // Fetch booked slots
  const fetchBookedSlots = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/bookings/cabin/${id}`);
      if (response.data && response.data.bookedSlots) {
        setBookedSlots(response.data.bookedSlots);
      } else {
        setBookedSlots([]);
      }
    } catch (err) {
      console.error("Error fetching booked slots:", err);
      setBookedSlots([]);
    }
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
        await fetchBookedSlots();
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (bookingBasis === "hourly" && startDate && startTime && endDate && endTime && !timeError) {
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
  }, [bookingBasis, startDate, startTime, startAmPm, endDate, endTime, endAmPm, timeError, cabin]);

  useEffect(() => {
    if (!cabin) return;

    let hours = 0;
    let basePrice = 0;

    if (bookingBasis === "plan" && selectedPlan) {
      hours = selectedPlan.hours || 0;
      basePrice = selectedPlan.cost || 0;
    } else if (bookingBasis === "hourly") {
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

  useEffect(() => {
    const checkAvailability = async () => {
      if (!cabin || !startDate || !startTime || !endDate || !endTime || timeError) {
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
  }, [cabin, id, startDate, startTime, startAmPm, endDate, endTime, endAmPm, timeError]);

  const toggleTerms = () => {
    setTermsExpanded(!termsExpanded);
  };

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
      toast.error(`⏰ Start time (${convertTo12Hour(start24)}) is in the past. Current time is ${convertTo12Hour(currentTimeStr)}. Please select a future time.`);
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

    if (timeError) {
      setShowTimeErrorModal(true);
      toast.error("Please fix the time error before booking.");
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

      let userId = currentUser?._id;
      if (!userId) {
        try {
          const userStr = localStorage.getItem("user");
          if (userStr) {
            const userData = JSON.parse(userStr);
            userId = userData._id;
          }
        } catch (e) {
          console.error("Error getting user ID:", e);
        }
      }

      if (!userId) {
        toast.error("User ID not found. Please login again.");
        navigate("/login");
        setLoading(false);
        return;
      }

      const resolvedSelectedSeats = resolveSeatIds(selectedSeats, cabin.seats || []);

      if (
        selectedSeats.length > 0 &&
        cabin.seats?.length > 0 &&
        resolvedSelectedSeats.length !== selectedSeats.length
      ) {
        toast.error("Invalid seat selection. Please re-select your seats.");
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
        selectedSeats: resolvedSelectedSeats,
        extraCharge: extraCharge || 0,
        seatCount: resolvedSelectedSeats.length || selectedSeats.length || 0,
        totalPrice,
        paymentMethod: "cash",
        bookingSlots: bookingSlots.length > 0 ? bookingSlots : undefined,
        termsAccepted
      };

      const response = await axios.post(
        `${API_URL}/api/bookings/createbooking/${userId}`,
        bookingData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Booking successful!");
        // Navigate based on user role
        if (userRole === "admin") {
          navigate("/adminbookings");
        } else if (userRole === "doctor") {
          navigate("/doctorbookings");
        } else if (userRole === "coworking" || userRole === "cabinOwner") {
          navigate("/coworkingbookings");
        } else {
          // Regular user goes to userbooking
          navigate("/userbooking");
        }
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

  // Time Error Modal Component
  const TimeErrorModal = () => {
    if (!showTimeErrorModal) return null;
    
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
        <div className="bg-white rounded-3xl max-w-md w-full mx-4 p-6 shadow-2xl animate-in zoom-in duration-200">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-red-100 rounded-2xl flex-shrink-0">
              <AlertCircle size={28} className="text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-slate-900 mb-1">Invalid Time</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{timeError}</p>
            </div>
            <button
              onClick={() => setShowTimeErrorModal(false)}
              className="p-1 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0"
            >
              <X size={20} className="text-slate-400" />
            </button>
          </div>
          
          <div className="mt-6 pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-500 mb-3">
              Please select a valid time within the workspace operating hours.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowTimeErrorModal(false)}
                className="flex-1 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl transition-colors"
              >
                Dismiss
              </button>
              <button
                onClick={() => {
                  setTimeError("");
                  setShowTimeErrorModal(false);
                }}
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors"
              >
                Fix Time
              </button>
            </div>
          </div>
        </div>
      </div>
    );
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

      {/* Time Error Modal */}
      <TimeErrorModal />

      {/* Custom Calendar for Start Date */}
      {showStartCalendar && (
        <CustomCalendar
          selectedDate={startDate}
          onSelectDate={handleStartDateSelect}
          bookedDates={bookedSlots}
          onClose={() => setShowStartCalendar(false)}
        />
      )}

      {/* Custom Calendar for End Date */}
      {showEndCalendar && (
        <CustomCalendar
          selectedDate={endDate}
          onSelectDate={handleEndDateSelect}
          bookedDates={bookedSlots}
          onClose={() => setShowEndCalendar(false)}
        />
      )}

      <div className="pt-24 px-3 sm:px-4 md:px-6 lg:px-8 max-w-7xl mx-auto pb-16">
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
                <div className="absolute bottom-4 left-4 flex gap-2">
                  {!cabin.is24x7 && cabin.openTime && cabin.closeTime && (
                    <span className="px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full text-[10px] text-white font-medium">
                      ⏰ {convertTo12Hour(cabin.openTime)} - {convertTo12Hour(cabin.closeTime)}
                    </span>
                  )}
                  {cabin.is24x7 && (
                    <span className="px-3 py-1 bg-emerald-600/80 backdrop-blur-sm rounded-full text-[10px] text-white font-medium">
                      🕐 24x7 Open
                    </span>
                  )}
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
                    {!cabin.is24x7 && cabin.openTime && cabin.closeTime && (
                      <div className="flex items-center gap-1 text-xs text-indigo-600 font-medium mt-1">
                        <Clock size={12} />
                        <span>Open: {convertTo12Hour(cabin.openTime)} - {convertTo12Hour(cabin.closeTime)}</span>
                      </div>
                    )}
                    {cabin.is24x7 && (
                      <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium mt-1">
                        <Clock size={12} />
                        <span>24x7 Open</span>
                      </div>
                    )}
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
            {showSeatSelection && (
              <div className="admin-dash__card p-5 sm:p-6 bg-white shadow-sm border border-slate-100 rounded-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg">
                    <Users size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Select Seats</h3>
                    <p className="text-xs text-slate-500">Choose seats by name (₹{SEAT_EXTRA_CHARGE}/seat)</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {bookableSeats.map((seat) => {
                    const isSelected = selectedSeats.some(
                      (selectedId) => String(selectedId) === String(seat.id)
                    );

                    return (
                      <button
                        key={seat.id}
                        type="button"
                        onClick={() => toggleSeatSelection(seat.id)}
                        className={`p-3 rounded-xl border-2 text-center transition-all ${
                          isSelected
                            ? "border-indigo-600 bg-indigo-50 shadow-md shadow-indigo-500/20"
                            : "border-slate-200 bg-slate-50/50 hover:border-indigo-300 hover:bg-indigo-50/40"
                        }`}
                      >
                        <Armchair
                          size={18}
                          className={`mx-auto mb-1 ${isSelected ? "text-indigo-600" : "text-slate-400"}`}
                        />
                        <div
                          className={`text-xs font-bold truncate ${
                            isSelected ? "text-indigo-700" : "text-slate-700"
                          }`}
                        >
                          {seat.name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium">#{seat.number}</div>
                      </button>
                    );
                  })}
                </div>

                {selectedSeats.length > 0 && (
                  <div className="mt-3 text-sm text-indigo-600 font-medium">
                    Selected: {getSelectedSeatLabels().join(", ")} ({selectedSeats.length} seat
                    {selectedSeats.length > 1 ? "s" : ""}) (+₹{selectedSeats.length * SEAT_EXTRA_CHARGE})
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

                {!cabin.is24x7 && cabin.openTime && cabin.closeTime && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
                    <div className="flex items-center gap-2 text-xs text-amber-700">
                      <Clock size={14} />
                      <span>Available: <strong>{convertTo12Hour(cabin.openTime)}</strong> to <strong>{convertTo12Hour(cabin.closeTime)}</strong></span>
                    </div>
                  </div>
                )}
                {cabin.is24x7 && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 mb-4">
                    <div className="flex items-center gap-2 text-xs text-emerald-700">
                      <Clock size={14} />
                      <span>Available: <strong>24x7</strong> - Always Open</span>
                    </div>
                  </div>
                )}

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
                        <div 
                          className="relative cursor-pointer" 
                          onClick={handleStartDateClick}
                        >
                          <input
                            type="text"
                            value={startDate ? formatDateIndian(startDate) : ''}
                            placeholder="dd-mm-yyyy"
                            className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-semibold text-sm text-slate-900 cursor-pointer"
                            readOnly
                          />
                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          {startDate && bookedSlots.some(b => b.startDate === startDate) && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Start Time</label>
                        <div className="flex gap-2">
                          <div className="relative flex-1" onClick={() => startTimeRef.current?.showPicker?.() || startTimeRef.current?.click()}>
                            <input
                              ref={startTimeRef}
                              type="time"
                              value={startTime}
                              onChange={handleStartTimeChange}
                              className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-semibold text-sm text-slate-900 cursor-pointer [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden"
                            />
                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                          </div>
                          <select
                            value={startAmPm}
                            onChange={handleStartAmPmChange}
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
                        <div 
                          className="relative cursor-pointer" 
                          onClick={handleStartDateClick}
                        >
                          <input
                            type="text"
                            value={startDate ? formatDateIndian(startDate) : ''}
                            placeholder="dd-mm-yyyy"
                            className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-semibold text-sm text-slate-900 cursor-pointer"
                            readOnly
                          />
                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          {startDate && bookedSlots.some(b => b.startDate === startDate) && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Start Time</label>
                        <div className="flex gap-2">
                          <div className="relative flex-1" onClick={() => startTimeRef.current?.showPicker?.() || startTimeRef.current?.click()}>
                            <input
                              ref={startTimeRef}
                              type="time"
                              value={startTime}
                              onChange={handleStartTimeChange}
                              className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-semibold text-sm text-slate-900 cursor-pointer [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden"
                            />
                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                          </div>
                          <select
                            value={startAmPm}
                            onChange={handleStartAmPmChange}
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
                        <div 
                          className="relative cursor-pointer" 
                          onClick={handleEndDateClick}
                        >
                          <input
                            type="text"
                            value={endDate ? formatDateIndian(endDate) : ''}
                            placeholder="dd-mm-yyyy"
                            className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-semibold text-sm text-slate-900 cursor-pointer"
                            readOnly
                          />
                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          {endDate && bookedSlots.some(b => b.startDate === endDate) && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">End Time</label>
                        <div className="flex gap-2">
                          <div className="relative flex-1" onClick={() => endTimeRef.current?.showPicker?.() || endTimeRef.current?.click()}>
                            <input
                              ref={endTimeRef}
                              type="time"
                              value={endTime}
                              onChange={handleEndTimeChange}
                              className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-semibold text-sm text-slate-900 cursor-pointer [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden"
                            />
                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                          </div>
                          <select
                            value={endAmPm}
                            onChange={handleEndAmPmChange}
                            className="px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-semibold text-sm text-slate-900"
                          >
                            <option value="AM">AM</option>
                            <option value="PM">PM</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {bookingSlots.length > 0 && !timeError && (
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

              {/* Price Summary */}
              {totalPrice > 0 && !timeError && (
                <div className="p-6 sm:p-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-lg shadow-indigo-500/20 text-white">
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

              {availabilityError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
                  {availabilityError}
                </div>
              )}

              {/* Booking Button */}
              <button
                type="submit"
                disabled={loading || availabilityError || timeError || !totalPrice || isNaN(totalPrice) || totalPrice === 0}
                className={`w-full py-4 rounded-xl font-bold text-white text-sm sm:text-base transition-all ${
                  loading || availabilityError || timeError || !totalPrice || isNaN(totalPrice) || totalPrice === 0
                    ? 'bg-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg hover:shadow-indigo-500/20'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : timeError ? (
                  <span className="flex items-center justify-center gap-2">
                    <AlertCircle size={18} className="text-yellow-300" />
                    Please select a valid time
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