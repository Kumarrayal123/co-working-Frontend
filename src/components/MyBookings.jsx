// MyBookings.jsx - Complete with ALL Fields from API Response
import axios from "axios";
import {
  Calendar,
  Clock,
  IndianRupee,
  MapPin,
  Search,
  User,
  X,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Eye,
  FileDown,
  CreditCard,
  Store,
  Receipt,
  Building2,
  Edit,
  RefreshCw,
  X as XIcon,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Filter,
  XCircle as XCircleIcon,
  Users,
  Armchair,
  CalendarPlus,
  Stethoscope,
  Briefcase,
  Layers,
  CalendarDays,
  Wallet,
  Clock as ClockIcon,
  History,
  Calculator,
  Info
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import UsersNavbar from "./UsersNavbar";
import AdminNavbar from "./AdminNavbar";
import SimpleUserNavbar from "./SimpleUserNavbar";
import * as XLSX from 'xlsx';
import "./Dashboard.css";

const API_URL = "https://spaceapi.iryax.com";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [allCabins, setAllCabins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filters, setFilters] = useState({
    status: 'all',
    paymentStatus: 'all',
    paymentMethod: 'all'
  });
  const [activeTab, setActiveTab] = useState('all');
  const isAdmin = localStorage.getItem("admin") !== null;
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isRegularUser = user?.role === "user";
  const navigate = useNavigate();
  
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewBooking, setViewBooking] = useState(null);

  const [showReplaceModal, setShowReplaceModal] = useState(false);
  const [replaceBooking, setReplaceBooking] = useState(null);
  const [selectedCabin, setSelectedCabin] = useState("");
  const [replaceLoading, setReplaceLoading] = useState(false);
  const [selectedCabinData, setSelectedCabinData] = useState(null);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelBooking, setCancelBooking] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  const currentUser = (() => {
    try {
      const u = localStorage.getItem("user");
      const a = localStorage.getItem("admin");
      if (u) return JSON.parse(u);
      if (a) return JSON.parse(a);
      return null;
    } catch (err) {
      return null;
    }
  })();

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return d.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  const formatDateIndian = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = String(d.getFullYear()).slice(2);
    return `${day}/${month}/${year}`;
  };

  const formatTime12 = (timeStr) => {
    if (!timeStr) return "N/A";
    try {
      const [hours, minutes] = timeStr.split(':').map(Number);
      if (isNaN(hours) || isNaN(minutes)) return timeStr;
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const hours12 = hours % 12 || 12;
      return `${hours12}:${String(minutes).padStart(2, '0')} ${ampm}`;
    } catch {
      return timeStr;
    }
  };

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Token:", token);
      
      if (!token) {
        console.log("No token found, redirecting to login...");
        toast.error("Please login to view your bookings");
        navigate("/login");
        return;
      }

      const isAdminUser = localStorage.getItem("admin") !== null;
      
      let url;
      if (isAdminUser) {
        url = `${API_URL}/api/bookings`;
      } else {
        url = `${API_URL}/api/bookings/user`;
      }
      
      console.log("Fetching from URL:", url);
      console.log("Is Admin:", isAdminUser);
      
      const res = await axios.get(
        url,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log("Response data:", res.data);
      
      let bookingsData = res.data.bookings || [];
      
      if (isAdminUser) {
        const adminId = currentUser?._id || currentUser?.id;
        console.log("Admin ID:", adminId);
        
        bookingsData = bookingsData.filter(b => {
          const userId = b.user?._id || b.userId?.toString() || b.userId;
          
          if (!userId) {
            console.log("Guest booking found:", b._id, b.name);
            return true;
          }
          
          if (userId === adminId) {
            console.log("Admin's own booking found:", b._id, b.name);
            return true;
          }
          
          console.log("Filtered out booking:", b._id, "user:", userId);
          return false;
        });
        
        console.log("Filtered bookings for admin:", bookingsData.length);
      }
      
      setBookings(bookingsData);
      
      if (bookingsData.length === 0) {
        console.log("No bookings found");
        if (isAdminUser) {
          toast.info("No bookings found for admin");
        } else {
          toast.info("You have no bookings yet");
        }
      }
      
    } catch (error) {
      console.error("Error fetching bookings:", error);
      
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("admin");
        navigate("/login");
      } else {
        toast.error("Failed to fetch bookings: " + (error.response?.data?.error || error.message));
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchCabins = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token for cabins fetch");
        return;
      }
      const res = await axios.get(`${API_URL}/api/cabins`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const activeCabins = res.data.filter(c => c.isActive === true);
      setAllCabins(activeCabins);
    } catch (error) {
      console.error("Failed to fetch cabins:", error);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchCabins();
  }, []);

  useEffect(() => {
    if (selectedCabin && replaceBooking) {
      const cabin = allCabins.find(c => c._id === selectedCabin);
      setSelectedCabinData(cabin || null);
    } else {
      setSelectedCabinData(null);
    }
  }, [selectedCabin, allCabins, replaceBooking]);

  const getStatusBadge = (status) => {
    const map = {
      pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
      confirmed: { label: 'Confirmed', color: 'bg-emerald-100 text-emerald-700' },
      active: { label: 'Active', color: 'bg-indigo-100 text-indigo-700' },
      completed: { label: 'Completed', color: 'bg-blue-100 text-blue-700' },
      cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700' }
    };
    return map[status?.toLowerCase()] || { label: status || 'Unknown', color: 'bg-gray-100 text-gray-700' };
  };

  const getPaymentMethodBadge = (method) => {
    if (method === 'cash' || method === 'counter') {
      return { label: 'Cash', color: 'bg-orange-100 text-orange-700' };
    }
    if (method === 'upi') {
      return { label: 'UPI', color: 'bg-purple-100 text-purple-700' };
    }
    if (method === 'card') {
      return { label: 'Card', color: 'bg-blue-100 text-blue-700' };
    }
    return { label: 'Online', color: 'bg-blue-100 text-blue-700' };
  };

  const getPaymentStatusBadge = (status) => {
    if (status === 'paid') return { label: 'Paid', color: 'bg-emerald-100 text-emerald-700' };
    if (status === 'failed') return { label: 'Failed', color: 'bg-red-100 text-red-700' };
    if (status === 'refunded') return { label: 'Refunded', color: 'bg-purple-100 text-purple-700' };
    return { label: 'Pending', color: 'bg-yellow-100 text-yellow-700' };
  };

  const getTermsBadge = (accepted) => {
    if (accepted) return { label: '✓', color: 'bg-emerald-100 text-emerald-700' };
    return { label: '✗', color: 'bg-red-100 text-red-700' };
  };

  const exportToExcel = () => {
    try {
      if (displayBookings.length === 0) {
        toast.warning("No bookings to export");
        return;
      }
      const data = displayBookings.map((b, i) => ({
        'S.No': i + 1,
        'Booking ID': b._id?.slice(-8).toUpperCase() || 'N/A',
        'Type': b.bookingType || 'booking',
        'Basis': b.bookingBasis || 'hourly',
        'Cabin': b.cabin?.name || 'Unknown',
        'Space Type': b.cabin?.isChamber ? 'Medical Chamber' : 'Co-Working Space',
        'Customer': b.name || 'N/A',
        'Mobile': b.mobile || 'N/A',
        'Start Date': b.startDate || 'N/A',
        'Start Time': formatTime12(b.startTime),
        'End Date': b.endDate || 'N/A',
        'End Time': formatTime12(b.endTime),
        'Total Hours': b.totalHours || 0,
        'Total Days': b.totalDays || 0,
        'Daily Hours': b.dailyHours?.join(', ') || 'N/A',
        'Slots': b.bookingSlots?.map(s => `${formatDateIndian(s.date)} ${s.startTime}-${s.endTime}`).join('; ') || 'N/A',
        'Seats': b.seatCount || 0,
        'Seat Names': b.selectedSeats?.map(s => s.name).join(', ') || 'N/A',
        'Extra Charge': b.extraCharge || 0,
        'Subtotal (₹)': b.subtotal || 0,
        'GST (₹)': b.gstAmount || 0,
        'Total (₹)': b.totalPrice || 0,
        'Status': getStatusBadge(b.status).label,
        'Payment': getPaymentMethodBadge(b.paymentMethod).label,
        'Pmt Status': getPaymentStatusBadge(b.paymentStatus).label,
        'Terms': b.termsAccepted ? 'Yes' : 'No',
        'Transaction ID': b.transactionId || 'N/A',
        'UPI ID': b.paymentDetails?.upiId || 'N/A',
        'UPI App': b.paymentDetails?.upiApp || 'N/A',
        'Check-in': b.checkInTime || 'N/A',
        'Check-out': b.checkOutTime || 'N/A',
        'Visits': b.visitingTimings?.length || 0,
        'Created At': b.createdAt ? formatDateTime(b.createdAt) : 'N/A'
      }));
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Bookings');
      XLSX.writeFile(wb, `bookings_${new Date().toISOString().split('T')[0]}.xlsx`);
      toast.success(`Exported ${displayBookings.length} bookings!`);
    } catch (error) {
      console.error(error);
      toast.error("Export failed");
    }
  };

  const handleViewBooking = (booking) => {
    setViewBooking(booking);
    setShowViewModal(true);
  };

  const handleReplaceBooking = async () => {
    if (!selectedCabin) {
      toast.error("Please select a cabin to replace");
      return;
    }

    setReplaceLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_URL}/api/bookings/replace-booking/${replaceBooking._id}`,
        { newCabinId: selectedCabin },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Booking replaced successfully!");
        setShowReplaceModal(false);
        setReplaceBooking(null);
        setSelectedCabin("");
        setSelectedCabinData(null);
        fetchBookings();
      } else {
        toast.error(response.data.error || "Failed to replace booking");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to replace booking");
    } finally {
      setReplaceLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    setCancelLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_URL}/api/bookings/cancel-booking/${cancelBooking._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success(response.data.message || "Booking cancelled successfully!");
        setShowCancelModal(false);
        setCancelBooking(null);
        fetchBookings();
      } else {
        toast.error(response.data.error || "Failed to cancel booking");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to cancel booking");
    } finally {
      setCancelLoading(false);
    }
  };

  const downloadInvoice = (booking) => {
    try {
      const cabin = booking.cabin || {};
      const owner = cabin.owner || {};
      const win = window.open('', '_blank', 'width=800,height=600');
      if (!win) {
        toast.error('Please allow popups');
        return;
      }
      
      let seatListHtml = '';
      if (booking.selectedSeats && booking.selectedSeats.length > 0) {
        seatListHtml = booking.selectedSeats.map(s => 
          `<span style="display:inline-block;background:#f0fdf4;padding:2px 10px;border-radius:12px;margin:2px;font-size:11px;border:1px solid #86efac;">${s.name} (#${s.number})</span>`
        ).join('');
      }

      let slotsHtml = '';
      if (booking.bookingSlots && booking.bookingSlots.length > 0) {
        slotsHtml = booking.bookingSlots.map(s => 
          `<span style="display:inline-block;background:#eff6ff;padding:2px 10px;border-radius:10px;margin:2px;font-size:10px;border:1px solid #93c5fd;">${formatDateIndian(s.date)} ${s.startTime}-${s.endTime} (${s.hours}h)</span>`
        ).join('');
      }

      const isChamber = cabin.isChamber || false;
      const spaceTypeLabel = isChamber ? '🏥 MEDICAL CHAMBER' : '💼 CO-WORKING SPACE';

      win.document.write(`
        <html><head><title>Invoice</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: auto; }
          .header { border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 20px; display: flex; justify-content: space-between; }
          h1 { color: #1a56db; margin: 0; }
          .info { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background: #f8fafc; font-weight: 700; }
          .total { font-size: 20px; font-weight: 700; text-align: right; margin-top: 20px; border-top: 2px solid #000; padding-top: 15px; }
          .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 2px solid #000; color: #666; font-size: 12px; }
          .badge { display: inline-block; padding: 2px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; }
          .seat-section { margin: 10px 0; padding: 10px; background: #f8fafc; border-radius: 8px; }
          .slot-section { margin: 10px 0; padding: 10px; background: #f0f9ff; border-radius: 8px; border: 1px solid #bae6fd; }
          .space-type { font-size: 12px; font-weight: 700; color: ${isChamber ? '#166534' : '#1e40af'}; }
        </style>
        </head><body>
          <div class="header">
            <div><h1>${(owner.organizationName || 'IRYAX Workspace').toUpperCase()}</h1>
            <div class="space-type">${spaceTypeLabel}</div>
            <p>GST: ${owner.gstNumber || 'N/A'}</p></div>
            <div><p><strong>Invoice #${booking._id.slice(-8).toUpperCase()}</strong></p>
            <p>${new Date().toLocaleDateString()}</p></div>
          </div>
          <div class="info">
            <div><strong>Bill To:</strong><br>${booking.name || 'Customer'}<br>${booking.mobile || 'N/A'}<br>${booking.email || 'N/A'}</div>
            <div><strong>Cabin:</strong><br>${cabin.name || 'Unknown'}<br>${cabin.address || 'N/A'}<br>Capacity: ${cabin.capacity || 'N/A'} seats</div>
          </div>
          ${booking.bookingSlots && booking.bookingSlots.length > 0 ? `
            <div class="slot-section">
              <strong>📅 Booking Slots (${booking.bookingSlots.length} days)</strong>
              <div style="margin-top:5px;">${slotsHtml}</div>
              <div style="margin-top:5px;font-size:12px;color:#1e40af;">Daily Hours: ${booking.dailyHours?.join(', ') || 'N/A'}h</div>
            </div>
          ` : ''}
          ${booking.selectedSeats && booking.selectedSeats.length > 0 ? `
            <div class="seat-section">
              <strong>🪑 Selected Seats (${booking.seatCount})</strong>
              <div style="margin-top:5px;">${seatListHtml}</div>
              <div style="margin-top:5px;font-size:12px;color:#666;">Extra Charge: ₹${booking.extraCharge || 0}</div>
            </div>
          ` : ''}
          <table>
            <tr><th>Description</th><th>Details</th><th>Amount</th></tr>
            <tr><td><strong>${cabin.name || 'Cabin Booking'}</strong></td>
            <td>${booking.startDate} ${formatTime12(booking.startTime)} - ${booking.endDate} ${formatTime12(booking.endTime)}<br>${booking.totalHours}h • ${booking.totalDays || 0} days • ${booking.bookingBasis === 'plan' ? 'Plan' : 'Hourly'}</td>
            <td>₹${(booking.subtotal || 0).toFixed(2)}</td></tr>
            ${booking.extraCharge > 0 ? `
            <tr><td><strong>Seat Charges</strong></td>
            <td>${booking.seatCount} seats × ₹${booking.seatExtraChargePerSeat || 100}</td>
            <td>₹${(booking.extraCharge || 0).toFixed(2)}</td></tr>
            ` : ''}
          </table>
          <div style="display:flex;gap:20px;margin:10px 0;flex-wrap:wrap;">
            <span><strong>Payment:</strong> <span class="badge ${getPaymentMethodBadge(booking.paymentMethod).color}">${getPaymentMethodBadge(booking.paymentMethod).label}</span></span>
            <span><strong>Status:</strong> <span class="badge ${getStatusBadge(booking.status).color}">${getStatusBadge(booking.status).label}</span></span>
            <span><strong>Pmt Status:</strong> <span class="badge ${getPaymentStatusBadge(booking.paymentStatus).color}">${getPaymentStatusBadge(booking.paymentStatus).label}</span></span>
            <span><strong>Terms:</strong> <span class="badge ${getTermsBadge(booking.termsAccepted).color}">${booking.termsAccepted ? 'Accepted' : 'Not Accepted'}</span></span>
          </div>
          <div class="total">Subtotal: ₹${(booking.subtotal || 0).toFixed(2)}<br>${booking.extraCharge > 0 ? `Seat Charges: ₹${(booking.extraCharge || 0).toFixed(2)}<br>` : ''}GST (18%): ₹${(booking.gstAmount || 0).toFixed(2)}<br>Total: ₹${(booking.totalPrice || 0).toFixed(2)}</div>
          <div class="footer">Powered by IRYAX SPACE<br>${formatDateTime(booking.createdAt)}</div>
        </body></html>
      `);
      win.document.close();
      win.focus();
      toast.success('Invoice opened! Click Print to save as PDF.');
    } catch (error) {
      toast.error('Failed to generate invoice');
    }
  };

  // ✅ FILTERED BOOKINGS
  const filteredBookings = bookings.filter((b) => {
    const search = searchTerm.toLowerCase();
    const matchSearch = b.cabin?.name?.toLowerCase().includes(search) ||
                        b.cabin?.address?.toLowerCase().includes(search) ||
                        b.name?.toLowerCase().includes(search) ||
                        b.mobile?.includes(searchTerm);
    const matchDate = filterDate ? b.startDate === filterDate : true;
    const matchStatus = filters.status === 'all' || b.status === filters.status;
    const matchPaymentStatus = filters.paymentStatus === 'all' || b.paymentStatus === filters.paymentStatus;
    const matchPaymentMethod = filters.paymentMethod === 'all' || b.paymentMethod === filters.paymentMethod;
    return matchSearch && matchDate && matchStatus && matchPaymentStatus && matchPaymentMethod;
  });

  // ✅ TAB BASED FILTERING
  const getFilteredByTab = () => {
    if (activeTab === 'visits') {
      return filteredBookings.filter(b => b.bookingType === 'visit');
    } else if (activeTab === 'spaces') {
      return filteredBookings.filter(b => b.bookingType !== 'visit');
    } else {
      return filteredBookings;
    }
  };

  const displayBookings = getFilteredByTab();

  // Stats
  const totalCount = bookings.length;
  const activeCount = bookings.filter(b => b.status === 'active' || b.status === 'confirmed').length;
  const pendingCount = bookings.filter(b => b.status === 'pending').length;
  const completedCount = bookings.filter(b => b.status === 'completed').length;
  const visitCount = bookings.filter(b => b.bookingType === 'visit').length;
  const spaceCount = bookings.filter(b => b.bookingType !== 'visit').length;

  const getPriceDifference = () => {
    if (!replaceBooking || !selectedCabinData) return null;
    
    const currentPrice = replaceBooking.totalPrice || 0;
    const newPrice = selectedCabinData.price || 0;
    const totalHours = replaceBooking.totalHours || 1;
    const newTotal = newPrice * totalHours;
    const difference = newTotal - currentPrice;
    const gstDifference = difference * 0.18;
    const totalWithGst = newTotal + (newTotal * 0.18);
    const currentWithGst = currentPrice + (currentPrice * 0.18);
    const finalDifference = totalWithGst - currentWithGst;
    
    return {
      currentPrice,
      newPrice,
      totalHours,
      newTotal,
      difference,
      gstDifference,
      totalWithGst,
      currentWithGst,
      finalDifference
    };
  };

  const priceDiff = getPriceDifference();

  const clearFilters = () => {
    setFilters({
      status: 'all',
      paymentStatus: 'all',
      paymentMethod: 'all'
    });
    setSearchTerm('');
    setFilterDate('');
  };

  // ✅ RENDER NAVBAR
  const renderNavbar = () => {
    if (isAdmin) return <AdminNavbar />;
    if (isRegularUser) return <SimpleUserNavbar />;
    return <UsersNavbar />;
  };

  if (loading) {
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

      <div className="pt-24 px-3 sm:px-4 md:px-6 lg:px-8 max-w-full mx-auto pb-16">
        {/* Header */}
        <div className="admin-dash__header">
          <div>
            <h1 className="admin-dash__greeting">
              {isAdmin ? 'Admin' : 'My'} <span>Bookings</span>
            </h1>
            <p className="admin-dash__subtitle">
              {isAdmin ? 'Manage and view bookings created by you.' : 'Manage and view all your bookings.'}
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 shadow-sm">
            <p className="text-xs text-gray-500 font-medium">Total</p>
            <p className="text-xl sm:text-2xl font-bold text-indigo-600">{totalCount}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 shadow-sm">
            <p className="text-xs text-gray-500 font-medium">Active</p>
            <p className="text-xl sm:text-2xl font-bold text-emerald-600">{activeCount}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 shadow-sm">
            <p className="text-xs text-gray-500 font-medium">Pending</p>
            <p className="text-xl sm:text-2xl font-bold text-yellow-600">{pendingCount}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 shadow-sm">
            <p className="text-xs text-gray-500 font-medium">Completed</p>
            <p className="text-xl sm:text-2xl font-bold text-blue-600">{completedCount}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 shadow-sm">
            <p className="text-xs text-gray-500 font-medium">Visits</p>
            <p className="text-xl sm:text-2xl font-bold text-purple-600">{visitCount}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-50 rounded-xl p-3 mb-4 border border-gray-200">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[200px] relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <div className="min-w-[140px]">
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <div className="min-w-[120px]">
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="min-w-[130px]">
              <select
                value={filters.paymentStatus}
                onChange={(e) => setFilters({...filters, paymentStatus: e.target.value})}
                className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
              >
                <option value="all">Payment Status</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
            <div className="min-w-[130px]">
              <select
                value={filters.paymentMethod}
                onChange={(e) => setFilters({...filters, paymentMethod: e.target.value})}
                className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
              >
                <option value="all">Payment Method</option>
                <option value="online">Online</option>
                <option value="cash">Cash</option>
                <option value="counter">Counter</option>
                <option value="upi">UPI</option>
                <option value="card">Card</option>
              </select>
            </div>
            {(filters.status !== 'all' || filters.paymentStatus !== 'all' || filters.paymentMethod !== 'all' || filterDate || searchTerm) && (
              <button onClick={clearFilters} className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors">
                <XCircleIcon size={14} /> Clear
              </button>
            )}
            {displayBookings.length > 0 && (
              <button onClick={exportToExcel} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium hover:bg-indigo-100 transition-colors border border-indigo-200">
                <Download size={14} /> Export
              </button>
            )}
          </div>
        </div>

        {/* ✅ TAB SWITCHER */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 mb-4 flex">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'all'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            All Bookings
            <span className={`ml-1.5 px-1.5 py-0.5 text-[9px] rounded-full ${
              activeTab === 'all' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {totalCount}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('visits')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'visits'
                ? 'bg-purple-600 text-white shadow-sm shadow-purple-200'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            Site Visits
            <span className={`ml-1.5 px-1.5 py-0.5 text-[9px] rounded-full ${
              activeTab === 'visits' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {visitCount}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('spaces')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'spaces'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-200'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            Space Bookings
            <span className={`ml-1.5 px-1.5 py-0.5 text-[9px] rounded-full ${
              activeTab === 'spaces' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {spaceCount}
            </span>
          </button>
        </div>

        {/* Table Section */}
        <div className="admin-dash__card" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}>
          <div className="admin-dash__card-header flex flex-wrap items-center justify-between gap-3" style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb' }}>
            <div className="flex items-center gap-3">
              <h3 className="admin-dash__card-title">
                {activeTab === 'all' ? 'All Bookings' : activeTab === 'visits' ? 'Site Visits' : 'Space Bookings'}
              </h3>
              <span className="px-2.5 py-0.5 text-xs font-bold text-indigo-700 bg-indigo-100 rounded-full">
                {displayBookings.length}
              </span>
            </div>
          </div>

          <div className="admin-dash__card-body p-0 overflow-x-auto" style={{ backgroundColor: '#ffffff' }}>
            {displayBookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-20 text-gray-400">
                <Calendar size={48} className="opacity-20" />
                <p className="text-lg font-medium">No bookings found</p>
                <p className="text-sm">Try adjusting your filters.</p>
              </div>
            ) : (
              <table className="w-full min-w-[1500px] text-left">
                <thead>
                  <tr className="border-b border-gray-100" style={{ backgroundColor: '#f9fafb' }}>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">#</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Booking ID</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Cabin</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Space</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Customer</th>
                    {activeTab === 'visits' ? (
                      <>
                        <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Visit Date</th>
                        <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Visit Time</th>
                        <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Status</th>
                        <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Created At</th>
                        <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Actions</th>
                      </>
                    ) : (
                      <>
                        <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Start</th>
                        <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">End</th>
                        <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Hours</th>
                        <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Days</th>
                        <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Daily Hrs</th>
                        <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Seats</th>
                        <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Status</th>
                        <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Payment</th>
                        <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Pmt Status</th>
                        <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Amount</th>
                        <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Actions</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {displayBookings.map((b, idx) => {
                    const status = getStatusBadge(b.status);
                    const pmtMethod = getPaymentMethodBadge(b.paymentMethod);
                    const pmtStatus = getPaymentStatusBadge(b.paymentStatus);
                    const seatCount = b.seatCount || 0;
                    const seatNames = b.selectedSeats?.map(s => s.name).join(', ') || 'N/A';
                    const isVisit = b.bookingType === 'visit';
                    const isChamber = b.cabin?.isChamber || false;
                    const totalDays = b.totalDays || 0;
                    const dailyHours = b.dailyHours?.join(', ') || 'N/A';
                    const bookingId = b._id?.slice(-8).toUpperCase() || 'N/A';

                    return (
                      <tr key={b._id} className="transition-colors group hover:bg-gray-50/80">
                        <td className="p-4">
                          <span className="text-sm font-semibold text-gray-400">#{idx + 1}</span>
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="font-mono text-xs font-bold text-indigo-600">{bookingId}</p>
                            <p className="text-[9px] text-gray-400">{b.bookingType === 'visit' ? 'Visit' : 'Booking'}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{b.cabin?.name || 'Unknown'}</p>
                            <p className="text-[10px] text-gray-400 flex items-center gap-1">
                              <MapPin size={10} /> {b.cabin?.address?.split(',')[0] || 'N/A'}
                            </p>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full inline-flex items-center gap-1 ${
                            isChamber 
                              ? 'bg-emerald-100 text-emerald-700' 
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {isChamber ? (
                              <>
                                <Stethoscope size={10} /> Medical
                              </>
                            ) : (
                              <>
                                <Briefcase size={10} /> Co-Working
                              </>
                            )}
                          </span>
                        </td>
                        <td className="p-4">
                          <p className="font-medium text-gray-800 text-sm">{b.name || 'N/A'}</p>
                          <p className="text-xs text-gray-400">{b.mobile || 'N/A'}</p>
                        </td>

                        {isVisit ? (
                          <>
                            <td className="p-4">
                              <span className="text-sm font-medium text-gray-700">{b.startDate || 'N/A'}</span>
                            </td>
                            <td className="p-4">
                              <span className="text-sm font-medium text-gray-700">{formatTime12(b.startTime)}</span>
                            </td>
                            <td className="p-4">
                              <span className={`px-3 py-1 text-xs font-bold rounded-full ${status.color}`}>{status.label}</span>
                            </td>
                            <td className="p-4">
                              <span className="text-[10px] text-gray-500 font-medium">{formatDateTime(b.createdAt)}</span>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleViewBooking(b)}
                                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors whitespace-nowrap"
                                  title="View"
                                >
                                  <Eye size={12} /> View
                                </button>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="p-4">
                              <div>
                                <span className="text-sm font-medium text-gray-700">{b.startDate || 'N/A'}</span>
                                <p className="text-[10px] text-indigo-600 font-medium">{formatTime12(b.startTime)}</p>
                              </div>
                            </td>
                            <td className="p-4">
                              <div>
                                <span className="text-sm font-medium text-gray-700">{b.endDate || 'N/A'}</span>
                                <p className="text-[10px] text-indigo-600 font-medium">{formatTime12(b.endTime)}</p>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold">{b.totalHours}h</span>
                            </td>
                            <td className="p-4">
                              <span className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-bold">{totalDays}d</span>
                            </td>
                            <td className="p-4">
                              <div className="flex flex-wrap gap-0.5">
                                {b.dailyHours?.map((h, i) => (
                                  <span key={i} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[9px] font-medium">
                                    {h}h
                                  </span>
                                )) || <span className="text-xs text-gray-400">N/A</span>}
                              </div>
                            </td>
                            <td className="p-4">
                              <div>
                                <span className="flex items-center gap-1 text-sm font-medium text-gray-700">
                                  <Armchair size={14} className="text-indigo-500" />
                                  {seatCount}
                                </span>
                                {seatCount > 0 && (
                                  <p className="text-[10px] text-gray-400 truncate max-w-[120px]" title={seatNames}>
                                    {seatNames}
                                  </p>
                                )}
                              </div>
                            </td>
                            <td className="p-4">
                              <span className={`px-3 py-1 text-xs font-bold rounded-full ${status.color}`}>{status.label}</span>
                            </td>
                            <td className="p-4">
                              <span className={`px-3 py-1 text-xs font-bold rounded-full ${pmtMethod.color}`}>{pmtMethod.label}</span>
                            </td>
                            <td className="p-4">
                              <span className={`px-3 py-1 text-xs font-bold rounded-full ${pmtStatus.color}`}>{pmtStatus.label}</span>
                            </td>
                            <td className="p-4">
                              <div>
                                <span className="text-sm font-bold text-indigo-600">₹{b.totalPrice}</span>
                                {b.extraCharge > 0 && (
                                  <p className="text-[9px] text-amber-500">+₹{b.extraCharge} seat</p>
                                )}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-1 flex-wrap max-w-[220px]">
                                <button
                                  onClick={() => handleViewBooking(b)}
                                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors whitespace-nowrap"
                                  title="View"
                                >
                                  <Eye size={12} /> View
                                </button>
                                <button
                                  onClick={() => downloadInvoice(b)}
                                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors whitespace-nowrap"
                                  title="Invoice"
                                >
                                  <FileDown size={12} /> Invoice
                                </button>
                                {(b.status === 'confirmed' || b.status === 'active') && (
                                  <button
                                    onClick={() => {
                                      setReplaceBooking(b);
                                      setSelectedCabin("");
                                      setSelectedCabinData(null);
                                      setShowReplaceModal(true);
                                    }}
                                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors whitespace-nowrap"
                                    title="Replace Space"
                                  >
                                    <RefreshCw size={12} /> Replace
                                  </button>
                                )}
                                {(b.status === 'pending' || b.status === 'confirmed') && (
                                  <button
                                    onClick={() => {
                                      setCancelBooking(b);
                                      setShowCancelModal(true);
                                    }}
                                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium bg-red-50 text-red-700 hover:bg-red-100 transition-colors whitespace-nowrap"
                                    title="Cancel Booking"
                                  >
                                    <XIcon size={12} /> Cancel
                                  </button>
                                )}
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Footer */}
          {!loading && displayBookings.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-100 rounded-b-2xl flex flex-wrap items-center justify-between gap-2" style={{ backgroundColor: '#fafafa' }}>
              <span className="text-xs text-gray-500">
                Showing <strong>{displayBookings.length}</strong> of <strong>{bookings.length}</strong> bookings
              </span>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Active: {activeCount}
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                  Pending: {pendingCount}
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Completed: {completedCount}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* View Modal - Updated with ALL Fields */}
      {showViewModal && viewBooking && (
        <div 
          className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowViewModal(false);
            }
          }}
        >
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-gradient-to-br from-indigo-600 to-purple-600 text-white p-6 rounded-t-3xl flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold">Booking Details</h3>
                <p className="text-sm text-indigo-200">#{viewBooking._id?.slice(-8).toUpperCase()}</p>
                <p className="text-xs text-indigo-200">{viewBooking.bookingType === 'visit' ? 'Site Visit' : 'Chamber Booking'}</p>
              </div>
              <button onClick={() => setShowViewModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Cabin & Space Type */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Cabin</p>
                  <p className="mt-1 font-semibold text-gray-800">{viewBooking.cabin?.name || 'N/A'}</p>
                  <p className="text-xs text-gray-400">{viewBooking.cabin?.address || 'N/A'}</p>
                  <p className="text-xs text-gray-400">Capacity: {viewBooking.cabin?.capacity || 'N/A'} seats</p>
                </div>
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                  <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1">
                    <Layers size={12} /> Space Type
                  </p>
                  <div className="mt-2">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full inline-flex items-center gap-2 ${
                      viewBooking.cabin?.isChamber 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {viewBooking.cabin?.isChamber ? (
                        <><Stethoscope size={14} /> Medical Chamber</>
                      ) : (
                        <><Briefcase size={14} /> Co-Working Space</>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Customer Details */}
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1">
                  <User size={12} /> Customer Details
                </p>
                <div className="mt-2 space-y-1 text-sm">
                  <p><span className="text-gray-500">Name:</span> <span className="font-semibold">{viewBooking.name || viewBooking.user?.name || 'N/A'}</span></p>
                  <p><span className="text-gray-500">Mobile:</span> <span className="font-medium">{viewBooking.mobile || viewBooking.user?.mobile || 'N/A'}</span></p>
                  <p><span className="text-gray-500">Email:</span> <span className="font-medium break-all">{viewBooking.email || viewBooking.user?.email || 'N/A'}</span></p>
                </div>
              </div>

              {/* Schedule */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Start</p>
                  <p className="mt-1 font-semibold text-gray-800">{viewBooking.startDate || 'N/A'}</p>
                  <p className="text-sm font-medium text-indigo-600">{formatTime12(viewBooking.startTime)}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">End</p>
                  <p className="mt-1 font-semibold text-gray-800">{viewBooking.endDate || 'N/A'}</p>
                  <p className="text-sm font-medium text-indigo-600">{formatTime12(viewBooking.endTime)}</p>
                </div>
              </div>

              {/* Booking Info */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Booking Info</p>
                <div className="flex items-center gap-4 mt-1 flex-wrap">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold">{viewBooking.totalHours}h Total</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">{viewBooking.totalDays || 0} Days</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Daily: {viewBooking.dailyHours?.join(', ') || 'N/A'}h</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium capitalize">{viewBooking.bookingBasis || 'Hourly'}</span>
                  {viewBooking.selectedPlan && <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">Plan: {viewBooking.selectedPlan.label || 'N/A'}</span>}
                </div>
              </div>

              {/* Multi-Day Slots */}
              {viewBooking.bookingSlots && viewBooking.bookingSlots.length > 0 && (
                <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200">
                  <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-2">
                    <CalendarDays size={14} />
                    Booking Slots ({viewBooking.bookingSlots.length} days)
                  </p>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {viewBooking.bookingSlots.map((slot, idx) => (
                      <div key={idx} className="bg-white p-2 rounded-lg border border-indigo-100">
                        <p className="text-xs font-bold text-gray-700">{formatDateIndian(slot.date)}</p>
                        <p className="text-[10px] text-gray-500">{slot.startTime} - {slot.endTime}</p>
                        <p className="text-[10px] font-bold text-indigo-600">{slot.hours}h</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Seats */}
              {viewBooking.selectedSeats && viewBooking.selectedSeats.length > 0 && (
                <div className="p-4 bg-indigo-50 rounded-xl">
                  <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-2">
                    <Armchair size={14} />
                    Selected Seats ({viewBooking.seatCount})
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {viewBooking.selectedSeats.map((seat) => (
                      <span key={seat._id} className="px-3 py-1.5 bg-white rounded-lg border border-indigo-200 text-sm font-medium text-gray-700">
                        {seat.name} <span className="text-gray-400 text-xs">#{seat.number}</span>
                      </span>
                    ))}
                  </div>
                  {viewBooking.extraCharge > 0 && (
                    <p className="text-xs text-amber-600 mt-2">Extra Charge: ₹{viewBooking.extraCharge}</p>
                  )}
                </div>
              )}

              {/* Visiting Timings */}
              {viewBooking.visitingTimings && viewBooking.visitingTimings.length > 0 && (
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-xs font-medium text-blue-600 uppercase tracking-wider flex items-center gap-1">
                    <History size={14} /> Visit Log ({viewBooking.visitingTimings.length} entries)
                  </p>
                  <div className="space-y-1.5 mt-2">
                    {viewBooking.visitingTimings.map((timing, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm bg-white rounded-lg p-2 border border-blue-100">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-blue-600">Day {idx + 1}</span>
                          <span className="text-slate-600">{formatDateIndian(timing.date)}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-medium text-emerald-600">IN: {formatTime12(timing.checkIn)}</span>
                          <span className="text-xs font-medium text-red-500">OUT: {formatTime12(timing.checkOut)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Check-in/Check-out Info */}
              {(viewBooking.checkInTime || viewBooking.checkOutTime) && (
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                    <ClockIcon size={14} /> Check-in/Check-out
                  </p>
                  <div className="grid grid-cols-2 gap-2 mt-1 text-sm">
                    <div>
                      <p className="text-gray-500">Check-in</p>
                      <p className="font-medium">{viewBooking.checkInTime || 'Not checked in'}</p>
                      {viewBooking.actualCheckIn && (
                        <p className="text-xs text-gray-400">Actual: {viewBooking.actualCheckIn}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-gray-500">Check-out</p>
                      <p className="font-medium">{viewBooking.checkOutTime || 'Not checked out'}</p>
                      {viewBooking.actualCheckOut && (
                        <p className="text-xs text-gray-400">Actual: {viewBooking.actualCheckOut}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="border-t border-gray-200 pt-4 space-y-1">
                <div className="flex justify-between text-sm"><span className="text-gray-500">Subtotal ({viewBooking.totalHours}h)</span><span>₹{viewBooking.subtotal || 0}</span></div>
                {viewBooking.extraCharge > 0 && (
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Seat Charges</span><span>₹{viewBooking.extraCharge}</span></div>
                )}
                <div className="flex justify-between text-sm"><span className="text-gray-500">GST (18%)</span><span>₹{viewBooking.gstAmount || 0}</span></div>
                <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2 mt-2">
                  <span>Total</span>
                  <span className="text-indigo-600">₹{viewBooking.totalPrice || 0}</span>
                </div>
              </div>

              {/* Payment Details */}
              {(viewBooking.transactionId || viewBooking.paymentDetails) && (
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <p className="text-xs font-bold text-blue-700 uppercase tracking-wider flex items-center gap-2 mb-2">
                    <Wallet size={14} /> Payment Details
                  </p>
                  <div className="space-y-1 text-sm">
                    {viewBooking.transactionId && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Transaction ID</span>
                        <span className="font-mono font-medium text-gray-800">{viewBooking.transactionId}</span>
                      </div>
                    )}
                    {viewBooking.paymentDetails?.upiId && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">UPI ID</span>
                        <span className="font-mono font-medium text-gray-800">{viewBooking.paymentDetails.upiId}</span>
                      </div>
                    )}
                    {viewBooking.paymentDetails?.upiApp && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">UPI App</span>
                        <span className="font-medium text-gray-800">{viewBooking.paymentDetails.upiApp}</span>
                      </div>
                    )}
                    {viewBooking.paymentDetails?.cardNumber && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Card Number</span>
                        <span className="font-mono font-medium text-gray-800">•••• {viewBooking.paymentDetails.cardNumber.slice(-4)}</span>
                      </div>
                    )}
                    {viewBooking.paymentDetails?.paymentDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Date</span>
                        <span className="font-medium text-gray-800">{formatDate(viewBooking.paymentDetails.paymentDate)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Mode</span>
                      <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${getPaymentMethodBadge(viewBooking.paymentMethod).color}`}>
                        {getPaymentMethodBadge(viewBooking.paymentMethod).label}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Paid to Owner</span>
                      <span className="text-sm font-medium">
                        {viewBooking.isPaidToOwner ? '✅ Yes' : '❌ No'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Status & Payment */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-indigo-50 rounded-xl text-center">
                  <p className="text-[10px] text-indigo-500 font-bold uppercase">Status</p>
                  <span className={`px-3 py-1 text-xs font-bold rounded-full inline-block mt-1 ${getStatusBadge(viewBooking.status).color}`}>
                    {getStatusBadge(viewBooking.status).label}
                  </span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl text-center">
                  <p className="text-[10px] text-gray-500 font-bold uppercase">Payment</p>
                  <span className={`px-3 py-1 text-xs font-bold rounded-full inline-block mt-1 ${getPaymentMethodBadge(viewBooking.paymentMethod).color}`}>
                    {getPaymentMethodBadge(viewBooking.paymentMethod).label}
                  </span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl text-center">
                  <p className="text-[10px] text-gray-500 font-bold uppercase">Pmt Status</p>
                  <span className={`px-3 py-1 text-xs font-bold rounded-full inline-block mt-1 ${getPaymentStatusBadge(viewBooking.paymentStatus).color}`}>
                    {getPaymentStatusBadge(viewBooking.paymentStatus).label}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Terms</p>
                  <span className={`px-3 py-1 text-xs font-bold rounded-full inline-block mt-1 ${getTermsBadge(viewBooking.termsAccepted).color}`}>
                    {viewBooking.termsAccepted ? 'Accepted' : 'Not Accepted'}
                  </span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Created</p>
                  <p className="mt-1 font-semibold text-gray-800 text-sm">{formatDateTime(viewBooking.createdAt)}</p>
                </div>
              </div>

              {viewBooking.transactionId && (
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Transaction ID</p>
                  <p className="mt-1 font-mono text-xs text-gray-700 break-all">{viewBooking.transactionId}</p>
                </div>
              )}

              <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-200">
                <button
                  onClick={() => { setShowViewModal(false); downloadInvoice(viewBooking); }}
                  className="flex-1 min-w-[120px] py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-sm active:scale-[0.98]"
                >
                  <FileDown size={16} className="inline mr-2" />
                  Download Invoice
                </button>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Replace Modal - Updated with Days info */}
      {showReplaceModal && replaceBooking && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowReplaceModal(false)}>
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-5 rounded-t-3xl flex justify-between items-center shrink-0">
              <div>
                <h3 className="text-xl font-bold">Replace Space</h3>
                <p className="text-sm text-blue-200">{replaceBooking.cabin?.name} → New Space</p>
              </div>
              <button onClick={() => setShowReplaceModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4 overflow-y-auto flex-1">
              <div className="bg-blue-50 rounded-xl p-4 text-sm">
                <p className="font-bold text-blue-800">Current Booking</p>
                <p className="text-slate-600 mt-1">{replaceBooking.cabin?.name}</p>
                <p className="text-xs text-slate-500">{replaceBooking.startDate} {formatTime12(replaceBooking.startTime)} - {replaceBooking.endDate} {formatTime12(replaceBooking.endTime)}</p>
                <p className="text-xs font-bold text-slate-700 mt-1">Total: ₹{replaceBooking.totalPrice}</p>
                {replaceBooking.totalDays > 0 && (
                  <p className="text-xs text-slate-500">{replaceBooking.totalDays} days • {replaceBooking.totalHours}h total</p>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Select New Cabin</label>
                <div className="relative">
                  <select
                    value={selectedCabin}
                    onChange={(e) => setSelectedCabin(e.target.value)}
                    className="w-full p-3 pr-10 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                  >
                    <option value="">Select a cabin...</option>
                    {allCabins
                      .filter(c => c._id !== replaceBooking.cabin?._id)
                      .map(c => (
                        <option key={c._id} value={c._id}>
                          {c.name} - ₹{c.price}/hr
                        </option>
                      ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {selectedCabinData && priceDiff && (
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-3">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Price Comparison</p>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-[10px] text-blue-600 font-medium">Current Cabin</p>
                      <p className="font-bold text-slate-800">₹{replaceBooking.cabin?.price}/hr</p>
                      <p className="text-xs text-slate-500">{replaceBooking.totalHours}h = ₹{replaceBooking.totalPrice}</p>
                    </div>
                    <div className="bg-emerald-50 rounded-lg p-3">
                      <p className="text-[10px] text-emerald-600 font-medium">New Cabin</p>
                      <p className="font-bold text-slate-800">₹{selectedCabinData.price}/hr</p>
                      <p className="text-xs text-slate-500">{replaceBooking.totalHours}h = ₹{priceDiff.newTotal}</p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-3">
                    {priceDiff.finalDifference > 0 ? (
                      <div className="flex items-center justify-between text-amber-600 bg-amber-50 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <TrendingUp size={16} />
                          <span className="text-sm font-medium">You need to pay extra</span>
                        </div>
                        <span className="font-bold text-lg">+₹{Math.round(priceDiff.finalDifference)}</span>
                      </div>
                    ) : priceDiff.finalDifference < 0 ? (
                      <div className="flex items-center justify-between text-emerald-600 bg-emerald-50 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <TrendingDown size={16} />
                          <span className="text-sm font-medium">You will get refund</span>
                        </div>
                        <span className="font-bold text-lg">-₹{Math.round(Math.abs(priceDiff.finalDifference))}</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-slate-600 bg-slate-100 rounded-lg p-3">
                        <span className="text-sm font-medium">No price difference</span>
                        <span className="font-bold text-lg">₹0</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="bg-amber-50 rounded-xl p-3 text-xs text-amber-700 flex items-start gap-2">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>Replacement is subject to availability. Price difference (if any) will be adjusted.</span>
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 shrink-0">
              <button
                onClick={handleReplaceBooking}
                disabled={replaceLoading || !selectedCabin}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {replaceLoading ? 'Replacing...' : <><RefreshCw size={16} /> Replace Booking</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal - Updated with Days info */}
      {showCancelModal && cancelBooking && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowCancelModal(false)}>
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-br from-red-600 to-red-700 text-white p-5 rounded-t-3xl flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">Cancel Booking</h3>
                <p className="text-sm text-red-200">{cancelBooking.cabin?.name}</p>
              </div>
              <button onClick={() => setShowCancelModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-red-50 rounded-xl p-4 text-sm">
                <p className="font-bold text-red-800">Are you sure you want to cancel this booking?</p>
                <div className="mt-2 space-y-1 text-slate-600">
                  <p><span className="text-slate-500">Cabin:</span> {cancelBooking.cabin?.name}</p>
                  <p><span className="text-slate-500">Start:</span> {cancelBooking.startDate} {formatTime12(cancelBooking.startTime)}</p>
                  <p><span className="text-slate-500">End:</span> {cancelBooking.endDate} {formatTime12(cancelBooking.endTime)}</p>
                  <p><span className="text-slate-500">Total:</span> ₹{cancelBooking.totalPrice}</p>
                  {cancelBooking.totalDays > 0 && (
                    <p><span className="text-slate-500">Days:</span> {cancelBooking.totalDays} days ({cancelBooking.totalHours}h)</p>
                  )}
                </div>
              </div>

              <div className="bg-amber-50 rounded-xl p-3 text-xs text-amber-700 flex items-start gap-2">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Cancellation Policy:</p>
                  <ul className="list-disc pl-4 mt-1 space-y-0.5">
                    <li>Free cancellation within <span className="font-bold">24 hours</span> of booking</li>
                    <li>50% refund for cancellations after 24 hours</li>
                    <li>No refund for no-shows</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCancelBooking}
                  disabled={cancelLoading}
                  className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {cancelLoading ? 'Cancelling...' : <><XIcon size={16} /> Cancel Booking</>}
                </button>
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="px-5 py-3 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;