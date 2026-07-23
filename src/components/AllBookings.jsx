// AllBookings.jsx - Complete with Full Features
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminNavbar from "./AdminNavbar";
import {
  Calendar,
  User,
  Phone,
  MapPin,
  Clock,
  IndianRupee,
  Search,
  X,
  Calendar as CalendarIcon,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  AlertCircle,
  Eye,
  Edit,
  FileDown,
  Timer,
  Download,
  TrendingUp,
  Users,
  CreditCard,
  PieChart,
  Store,
  Building2,
  Receipt,
  Hash,
  Crown,
  Star,
  Plus,
  Trash2,
  History,
  Filter,
  XCircle as XCircleIcon,
  ArrowUpRight,
  Image,
  Upload,
  QrCode,
  Smartphone,
  Printer,
  Armchair,
  Wallet as WalletIcon,
  Banknote
} from "lucide-react";
import { toast } from "react-toastify";
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import "./Dashboard.css";

const API_URL = "http://localhost:5003";

const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [filterCabinName, setFilterCabinName] = useState("");
  const [filterOwner, setFilterOwner] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    paymentStatus: 'all',
    paymentMethod: 'all'
  });
  const navigate = useNavigate();

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [updating, setUpdating] = useState(false);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentBooking, setPaymentBooking] = useState(null);
  const [newPaymentStatus, setNewPaymentStatus] = useState("");
  const [amountPaid, setAmountPaid] = useState(0);
  const [updatingPayment, setUpdatingPayment] = useState(false);

  const [paymentDetails, setPaymentDetails] = useState({
    paymentMode: 'cash',
    cardNumber: '',
    cardHolderName: '',
    cardExpiry: '',
    cardCVV: '',
    upiId: '',
    upiApp: '',
    transactionId: '',
    paymentDate: '',
    notes: ''
  });
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [paymentScreenshotPreview, setPaymentScreenshotPreview] = useState(null);

  const [showViewModal, setShowViewModal] = useState(false);
  const [viewBooking, setViewBooking] = useState(null);

  const [showTimingModal, setShowTimingModal] = useState(false);
  const [timingBooking, setTimingBooking] = useState(null);
  const [newTiming, setNewTiming] = useState({
    date: "",
    checkIn: "",
    checkOut: ""
  });
  const [updatingTiming, setUpdatingTiming] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteBooking, setDeleteBooking] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [stats, setStats] = useState({
    totalBookings: 0,
    confirmed: 0,
    active: 0,
    completed: 0,
    cancelled: 0,
    pending: 0,
    totalRevenue: 0,
    confirmedRevenue: 0,
    completedRevenue: 0
  });

  // Get unique cabin names and owners for filters
  const cabinNames = [...new Set(bookings.map(b => b.cabin?.name).filter(Boolean))];
  const owners = [...new Set(bookings.map(b => b.cabin?.owner?.name || b.cabin?.owner?.email || 'Unknown').filter(Boolean))];

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: {
        label: 'Pending',
        color: 'bg-yellow-100 text-yellow-700',
        icon: <ClockIcon size={12} className="text-yellow-500" />
      },
      confirmed: {
        label: 'Confirmed',
        color: 'bg-emerald-100 text-emerald-700',
        icon: <CheckCircle size={12} className="text-emerald-500" />
      },
      active: {
        label: 'Active',
        color: 'bg-indigo-100 text-indigo-700',
        icon: <Timer size={12} className="text-indigo-500" />
      },
      completed: {
        label: 'Completed',
        color: 'bg-blue-100 text-blue-700',
        icon: <CheckCircle size={12} className="text-blue-500" />
      },
      cancelled: {
        label: 'Cancelled',
        color: 'bg-red-100 text-red-700',
        icon: <XCircle size={12} className="text-red-500" />
      }
    };
    return statusMap[status?.toLowerCase()] || { label: status || 'Unknown', color: 'bg-gray-100 text-gray-700', icon: <AlertCircle size={12} className="text-gray-500" /> };
  };

  const getPaymentMethodBadge = (method) => {
    if (method === 'cash' || method === 'counter') {
      return { label: 'Cash', color: 'bg-orange-100 text-orange-700', icon: <Store size={12} className="text-orange-500" /> };
    }
    if (method === 'upi') {
      return { label: 'UPI', color: 'bg-purple-100 text-purple-700', icon: <Smartphone size={12} className="text-purple-500" /> };
    }
    if (method === 'card') {
      return { label: 'Card', color: 'bg-blue-100 text-blue-700', icon: <CreditCard size={12} className="text-blue-500" /> };
    }
    return { label: 'Online', color: 'bg-blue-100 text-blue-700', icon: <CreditCard size={12} className="text-blue-500" /> };
  };

  const getPaymentStatusBadge = (status) => {
    if (status === 'paid') return { label: 'Paid', color: 'bg-emerald-100 text-emerald-700', icon: <CheckCircle size={12} className="text-emerald-500" /> };
    if (status === 'refunded') return { label: 'Refunded', color: 'bg-purple-100 text-purple-700', icon: <XCircle size={12} className="text-purple-500" /> };
    if (status === 'failed') return { label: 'Failed', color: 'bg-red-100 text-red-700', icon: <XCircle size={12} className="text-red-500" /> };
    return { label: 'Pending', color: 'bg-yellow-100 text-yellow-700', icon: <ClockIcon size={12} className="text-yellow-500" /> };
  };

  const calculateStats = (bookingsData) => {
    const total = bookingsData.length;
    const confirmed = bookingsData.filter(b => b.status === 'confirmed').length;
    const active = bookingsData.filter(b => b.status === 'active').length;
    const completed = bookingsData.filter(b => b.status === 'completed').length;
    const cancelled = bookingsData.filter(b => b.status === 'cancelled').length;
    const pending = bookingsData.filter(b => b.status === 'pending').length;

    const totalRevenue = bookingsData.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    const confirmedRevenue = bookingsData.filter(b => b.status === 'confirmed').reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    const completedRevenue = bookingsData.filter(b => b.status === 'completed').reduce((sum, b) => sum + (b.totalPrice || 0), 0);

    setStats({ totalBookings: total, confirmed, active, completed, cancelled, pending, totalRevenue, confirmedRevenue, completedRevenue });
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/api/bookings`);
        const bookingsData = res.data.bookings || [];
        setBookings(bookingsData);
        calculateStats(bookingsData);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
        toast.error("Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // ─── INDIAN DATE FORMAT (DD/MM/YY) ───
  const formatDateIndian = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = String(d.getFullYear()).slice(2);
    return `${day}/${month}/${year}`;
  };

  // ─── TIME FORMAT (12-hour with AM/PM) ───
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

  // ─── FULL DATE TIME FORMAT ───
  const formatDateTimeIndian = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = String(d.getFullYear()).slice(2);
    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
  };

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const handleUpdateStatus = async () => {
    if (!selectedBooking || !newStatus) { toast.error("Please select a status"); return; }
    setUpdating(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`${API_URL}/api/bookings/update-status/${selectedBooking._id}`, { status: newStatus }, { headers: { Authorization: `Bearer ${token}` } });
      if (response.data.success) {
        const updatedBookings = bookings.map(b => b._id === selectedBooking._id ? { ...b, status: newStatus } : b);
        setBookings(updatedBookings);
        calculateStats(updatedBookings);
        toast.success(`Booking status updated to ${newStatus}`);
        setShowStatusModal(false);
        setSelectedBooking(null);
        setNewStatus("");
      } else {
        toast.error(response.data.message || "Failed to update status");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update status");
    } finally { setUpdating(false); }
  };

  const handlePaymentScreenshotChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPaymentScreenshot(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentScreenshotPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdatePaymentStatus = async () => {
    if (!paymentBooking || !newPaymentStatus) { toast.error("Please select a payment status"); return; }
    if (newPaymentStatus === 'paid' && (!amountPaid || amountPaid <= 0)) { toast.error("Please enter amount paid"); return; }

    if (paymentDetails.paymentMode === 'card') {
      if (!paymentDetails.cardNumber || paymentDetails.cardNumber.replace(/\s/g, '').length < 16) {
        toast.error("Please enter valid card number");
        return;
      }
      if (!paymentDetails.cardHolderName) {
        toast.error("Please enter card holder name");
        return;
      }
      if (!paymentDetails.cardExpiry) {
        toast.error("Please enter card expiry date");
        return;
      }
      if (!paymentDetails.cardCVV || paymentDetails.cardCVV.length < 3) {
        toast.error("Please enter valid CVV");
        return;
      }
    }

    if (paymentDetails.paymentMode === 'upi') {
      if (!paymentDetails.upiId) {
        toast.error("Please enter UPI ID");
        return;
      }
      if (!paymentDetails.upiApp) {
        toast.error("Please enter UPI app name");
        return;
      }
    }

    if (!paymentDetails.transactionId) {
      toast.error("Please enter transaction ID");
      return;
    }

    setUpdatingPayment(true);
    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append('paymentStatus', newPaymentStatus);
      formData.append('amountPaid', amountPaid || paymentBooking.totalPrice);
      formData.append('paymentMode', paymentDetails.paymentMode);
      formData.append('transactionId', paymentDetails.transactionId);
      formData.append('paymentDate', paymentDetails.paymentDate || new Date().toISOString().split('T')[0]);
      formData.append('notes', paymentDetails.notes || '');

      if (paymentDetails.paymentMode === 'card') {
        formData.append('cardNumber', paymentDetails.cardNumber);
        formData.append('cardHolderName', paymentDetails.cardHolderName);
        formData.append('cardExpiry', paymentDetails.cardExpiry);
        formData.append('cardCVV', paymentDetails.cardCVV);
      }

      if (paymentDetails.paymentMode === 'upi') {
        formData.append('upiId', paymentDetails.upiId);
        formData.append('upiApp', paymentDetails.upiApp);
      }

      if (paymentScreenshot) {
        formData.append('screenshot', paymentScreenshot);
      }

      const response = await axios.put(
        `${API_URL}/api/bookings/bookingpayment-status/${paymentBooking._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        const updatedBookings = bookings.map(b =>
          b._id === paymentBooking._id ? {
            ...b,
            paymentStatus: newPaymentStatus,
            paymentDetails: {
              mode: paymentDetails.paymentMode,
              transactionId: paymentDetails.transactionId,
              paymentDate: paymentDetails.paymentDate,
              ...(paymentDetails.paymentMode === 'card' && {
                cardNumber: paymentDetails.cardNumber,
                cardHolderName: paymentDetails.cardHolderName
              }),
              ...(paymentDetails.paymentMode === 'upi' && {
                upiId: paymentDetails.upiId,
                upiApp: paymentDetails.upiApp
              }),
              screenshot: response.data.screenshotUrl || null
            }
          } : b
        );
        setBookings(updatedBookings);
        calculateStats(updatedBookings);
        toast.success(`Payment status updated to ${newPaymentStatus}`);
        setShowPaymentModal(false);
        setPaymentBooking(null);
        setNewPaymentStatus("");
        setAmountPaid(0);
        setPaymentDetails({
          paymentMode: 'cash',
          cardNumber: '',
          cardHolderName: '',
          cardExpiry: '',
          cardCVV: '',
          upiId: '',
          upiApp: '',
          transactionId: '',
          paymentDate: '',
          notes: ''
        });
        setPaymentScreenshot(null);
        setPaymentScreenshotPreview(null);
      } else {
        toast.error(response.data.error || "Failed to update payment status");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update payment status");
    } finally { setUpdatingPayment(false); }
  };

  const resetPaymentModal = () => {
    setShowPaymentModal(false);
    setPaymentBooking(null);
    setNewPaymentStatus("");
    setAmountPaid(0);
    setPaymentDetails({
      paymentMode: 'cash',
      cardNumber: '',
      cardHolderName: '',
      cardExpiry: '',
      cardCVV: '',
      upiId: '',
      upiApp: '',
      transactionId: '',
      paymentDate: '',
      notes: ''
    });
    setPaymentScreenshot(null);
    setPaymentScreenshotPreview(null);
  };

  const handleAddTiming = async () => {
    if (!timingBooking || !newTiming.date || !newTiming.checkIn || !newTiming.checkOut) {
      toast.error("Please fill all timing fields");
      return;
    }
    setUpdatingTiming(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`${API_URL}/api/bookings/update-timings/${timingBooking._id}`, { date: newTiming.date, checkIn: newTiming.checkIn, checkOut: newTiming.checkOut }, { headers: { Authorization: `Bearer ${token}` } });
      if (response.data.success) {
        const updatedBookings = bookings.map(b => b._id === timingBooking._id ? { ...b, visitingTimings: response.data.booking.visitingTimings } : b);
        setBookings(updatedBookings);
        toast.success("Timing added successfully!");
        setShowTimingModal(false);
        setTimingBooking(null);
        setNewTiming({ date: "", checkIn: "", checkOut: "" });
        const res = await axios.get(`${API_URL}/api/bookings`, { headers: { Authorization: `Bearer ${token}` } });
        setBookings(res.data.bookings || []);
        calculateStats(res.data.bookings || []);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update timing");
    } finally { setUpdatingTiming(false); }
  };

  const handleDeleteTiming = async (bookingId, timingIndex) => {
    if (!window.confirm("Are you sure you want to delete this timing entry?")) return;
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`${API_URL}/api/bookings/delete-timing/${bookingId}`, { timingIndex }, { headers: { Authorization: `Bearer ${token}` } });
      if (response.data.success) {
        const updatedBookings = bookings.map(b => b._id === bookingId ? { ...b, visitingTimings: response.data.booking.visitingTimings } : b);
        setBookings(updatedBookings);
        toast.success("Timing deleted successfully!");
        const res = await axios.get(`${API_URL}/api/bookings`, { headers: { Authorization: `Bearer ${token}` } });
        setBookings(res.data.bookings || []);
        calculateStats(res.data.bookings || []);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to delete timing");
    }
  };

  const handleViewBooking = (booking) => {
    setViewBooking(booking);
    setShowViewModal(true);
  };

  const handleDeleteBooking = async () => {
    if (!deleteBooking) return;
    
    setDeleting(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${API_URL}/api/bookings/deletebooking/${deleteBooking._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        const updatedBookings = bookings.filter(b => b._id !== deleteBooking._id);
        setBookings(updatedBookings);
        calculateStats(updatedBookings);

        toast.success("Booking deleted successfully");
        setShowDeleteModal(false);
        setDeleteBooking(null);
      } else {
        toast.error(response.data.message || "Failed to delete booking");
      }
    } catch (error) {
      console.error("Delete booking error:", error);
      toast.error(error.response?.data?.error || "Failed to delete booking");
    } finally {
      setDeleting(false);
    }
  };

  const exportToExcel = () => {
    try {
      if (filteredBookings.length === 0) { toast.warning("No bookings to export"); return; }
      const exportData = filteredBookings.map((booking, index) => {
        const statusBadge = getStatusBadge(booking.status);
        const paymentMethod = getPaymentMethodBadge(booking.paymentMethod);
        const paymentStatus = getPaymentStatusBadge(booking.paymentStatus);
        return {
          'S.No': index + 1, 'Booking Type': booking.bookingBasis === 'plan' ? 'Plan Booking' : 'Hourly Booking',
          'Cabin Name': booking.cabin?.name || 'Unknown Cabin', 'Address': booking.cabin?.address || 'No Address',
          'Customer Name': booking.name || booking.user?.name || 'Unknown Guest', 'Mobile': booking.mobile || booking.user?.mobile || 'N/A',
          'Email': booking.email || booking.user?.email || 'N/A', 'Start Date': formatDateIndian(booking.startDate),
          'Start Time': formatTime12(booking.startTime), 'End Date': formatDateIndian(booking.endDate),
          'End Time': formatTime12(booking.endTime),
          'Duration (Hours)': booking.totalHours || 0, 'Subtotal (₹)': booking.subtotal || 0,
          'GST (18%)': booking.gstAmount || 0, 'Total (₹)': booking.totalPrice || 0,
          'Seats': booking.seatCount || 0, 'Extra Charge': booking.extraCharge || 0,
          'Status': statusBadge.label, 'Payment Method': paymentMethod.label,
          'Payment Status': paymentStatus.label, 'Transaction ID': booking.transactionId || 'N/A',
          'Visiting Days': booking.visitingTimings?.length || 0
        };
      });
      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'All_Bookings');
      const date = new Date().toISOString().split('T')[0];
      XLSX.writeFile(wb, `all_bookings_${date}.xlsx`);
      toast.success(`Exported ${filteredBookings.length} bookings to Excel!`);
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export bookings");
    }
  };

  const generateReceiptHTML = (booking) => {
    const cabin = booking.cabin || {};
    const cabinName = cabin.name || 'Unknown Cabin';
    const cabinAddress = cabin.address || 'N/A';
    const amount = booking.totalPrice || 0;
    const subtotal = booking.subtotal || 0;
    const gstAmount = booking.gstAmount || 0;
    const extraCharge = booking.extraCharge || 0;
    const seatCount = booking.seatCount || 0;
    const selectedSeats = booking.selectedSeats || [];
    const orderId = booking._id.slice(-8).toUpperCase();
    const startDate = formatDateIndian(booking.startDate);
    const startTime = formatTime12(booking.startTime);
    const endDate = formatDateIndian(booking.endDate);
    const endTime = formatTime12(booking.endTime);
    const status = booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1) || 'N/A';
    const paymentStatus = booking.paymentStatus === 'paid' ? 'PAID' : 'PENDING';
    const paymentMethod = booking.paymentMethod === 'cash' || booking.paymentMethod === 'counter' ? 'CASH' :
                         booking.paymentMethod === 'upi' ? 'UPI' :
                         booking.paymentMethod === 'card' ? 'CARD' : 'ONLINE';
    const totalHours = booking.totalHours || 0;
    const customerName = booking.name || booking.user?.name || 'Customer';
    const customerMobile = booking.mobile || booking.user?.mobile || 'N/A';
    const customerEmail = booking.email || booking.user?.email || 'N/A';
    const transactionId = booking.transactionId || 'N/A';
    const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const visitingTimings = booking.visitingTimings || [];
    const currentTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    const pmtDetails = booking.paymentDetails || {};
    const upiId = pmtDetails.upiId || 'N/A';
    const upiApp = pmtDetails.upiApp || 'N/A';
    const cardNumber = pmtDetails.cardNumber || 'N/A';
    const cardHolder = pmtDetails.cardHolderName || 'N/A';

    const formatDateFn = (dateStr) => {
      if (!dateStr) return "N/A";
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    let seatListHtml = '';
    if (selectedSeats && selectedSeats.length > 0) {
      seatListHtml = selectedSeats.map(s => 
        `<span style="display:inline-block;background:#f0fdf4;padding:1px 8px;border-radius:10px;margin:1px;font-size:8px;border:1px solid #86efac;">${s.name} (#${s.number})</span>`
      ).join('');
    }

    return `
      <div id="receipt-content" style="font-family:'Courier New',Courier,monospace;max-width:280px;margin:0 auto;padding:8px 6px;background:#fff;color:#000;font-size:11px;line-height:1.5;">
        <div style="text-align:center;border-bottom:1px dashed #000;padding-bottom:6px;margin-bottom:6px;">
          <h1 style="font-size:15px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#000;margin:0;">${cabinName.toUpperCase()}</h1>
          <div style="font-size:9px;color:#444;margin-top:2px;">${cabinAddress}</div>
          <div style="font-size:9px;color:#666;margin-top:2px;">GST: 18%</div>
        </div>

        <div style="text-align:center;font-size:13px;font-weight:700;margin:3px 0;">#${orderId}</div>
        <div style="text-align:center;font-size:9px;color:#666;margin-bottom:4px;">${today}</div>

        <div style="border-top:1px dashed #000;margin:4px 0;"></div>

        <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-top:4px;margin-bottom:2px;color:#000;border-bottom:1px solid #000;padding-bottom:2px;">Customer Details</div>
        <div style="display:flex;justify-content:space-between;padding:1px 0;font-size:10px;"><span style="color:#555;">Name</span><span style="font-weight:600;">${customerName}</span></div>
        <div style="display:flex;justify-content:space-between;padding:1px 0;font-size:10px;"><span style="color:#555;">Mobile</span><span style="font-weight:600;">${customerMobile}</span></div>
        ${customerEmail !== 'N/A' ? `<div style="display:flex;justify-content:space-between;padding:1px 0;font-size:9px;"><span style="color:#555;">Email</span><span style="font-weight:600;font-size:8px;">${customerEmail}</span></div>` : ''}

        <div style="border-top:1px dashed #000;margin:4px 0;"></div>

        <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-top:4px;margin-bottom:2px;color:#000;border-bottom:1px solid #000;padding-bottom:2px;">Booking Details</div>
        <div style="display:flex;justify-content:space-between;padding:1px 0;font-size:10px;"><span style="color:#555;">From</span><span style="font-weight:600;">${startDate} ${startTime}</span></div>
        <div style="display:flex;justify-content:space-between;padding:1px 0;font-size:10px;"><span style="color:#555;">To</span><span style="font-weight:600;">${endDate} ${endTime}</span></div>
        <div style="display:flex;justify-content:space-between;padding:1px 0;font-size:10px;"><span style="color:#555;">Duration</span><span style="font-weight:600;">${totalHours} Hrs</span></div>
        <div style="display:flex;justify-content:space-between;padding:1px 0;font-size:10px;"><span style="color:#555;">Type</span><span style="font-weight:600;">${booking.bookingBasis === 'plan' ? 'PLAN' : 'HOURLY'}</span></div>
        ${booking.bookingBasis === 'plan' && booking.selectedPlan ? `<div style="display:flex;justify-content:space-between;padding:1px 0;font-size:10px;"><span style="color:#555;">Plan</span><span style="font-weight:600;">${booking.selectedPlan.label || 'Subscription'}</span></div>` : ''}
        ${seatCount > 0 ? `<div style="display:flex;justify-content:space-between;padding:1px 0;font-size:10px;"><span style="color:#555;">Seats</span><span style="font-weight:600;">${seatCount}</span></div>` : ''}

        ${selectedSeats.length > 0 ? `
          <div style="margin:3px 0;padding:3px;background:#f8fafc;border-radius:4px;border:1px solid #e2e8f0;">
            <div style="font-size:8px;color:#555;margin-bottom:2px;">Selected Seats:</div>
            <div style="display:flex;flex-wrap:wrap;gap:2px;">${seatListHtml}</div>
          </div>
        ` : ''}

        <div style="border-top:1px dashed #000;margin:4px 0;"></div>

        <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-top:4px;margin-bottom:2px;color:#000;border-bottom:1px solid #000;padding-bottom:2px;">Price Breakdown</div>
        <div style="display:flex;justify-content:space-between;padding:1px 0;font-size:10px;"><span style="color:#555;">Subtotal (${totalHours}h)</span><span style="font-weight:600;">₹${subtotal.toFixed(2)}</span></div>
        ${extraCharge > 0 ? `<div style="display:flex;justify-content:space-between;padding:1px 0;font-size:10px;"><span style="color:#555;">Seat Charges</span><span style="font-weight:600;">₹${extraCharge.toFixed(2)}</span></div>` : ''}
        <div style="display:flex;justify-content:space-between;padding:1px 0;font-size:10px;"><span style="color:#555;">GST (18%)</span><span style="font-weight:600;">₹${gstAmount.toFixed(2)}</span></div>
        <div style="border-top:2px solid #000;margin:4px 0;"></div>

        <div style="background:#ffffff;padding:6px;margin:4px 0;border:1.5px solid #000;text-align:center;">
          <div style="font-size:8px;text-transform:uppercase;color:#000;font-weight:700;">Total Amount</div>
          <div style="font-size:18px;font-weight:700;color:#000;">₹${amount.toFixed(2)}</div>
        </div>

        <div style="border-top:1px dashed #000;margin:4px 0;"></div>
        <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-top:4px;margin-bottom:2px;color:#000;border-bottom:1px solid #000;padding-bottom:2px;">Payment Details</div>
        <div style="display:flex;justify-content:space-between;padding:1px 0;font-size:10px;"><span style="color:#555;">Method</span><span style="font-weight:600;">${paymentMethod}</span></div>
        <div style="display:flex;justify-content:space-between;padding:1px 0;font-size:10px;"><span style="color:#555;">Status</span><span style="font-weight:600;">${paymentStatus}</span></div>
        ${paymentMethod === 'UPI' && upiId !== 'N/A' ? `<div style="display:flex;justify-content:space-between;padding:1px 0;font-size:9px;"><span style="color:#555;">UPI ID</span><span style="font-weight:600;font-size:8px;">${upiId}</span></div>` : ''}
        ${paymentMethod === 'UPI' && upiApp !== 'N/A' ? `<div style="display:flex;justify-content:space-between;padding:1px 0;font-size:10px;"><span style="color:#555;">UPI App</span><span style="font-weight:600;">${upiApp}</span></div>` : ''}
        ${paymentMethod === 'CARD' && cardNumber !== 'N/A' ? `<div style="display:flex;justify-content:space-between;padding:1px 0;font-size:9px;"><span style="color:#555;">Card</span><span style="font-weight:600;font-size:8px;">${cardNumber}</span></div>` : ''}
        ${paymentMethod === 'CARD' && cardHolder !== 'N/A' ? `<div style="display:flex;justify-content:space-between;padding:1px 0;font-size:10px;"><span style="color:#555;">Card Holder</span><span style="font-weight:600;">${cardHolder}</span></div>` : ''}
        ${transactionId !== 'N/A' ? `<div style="display:flex;justify-content:space-between;padding:1px 0;font-size:9px;"><span style="color:#555;">TXN ID</span><span style="font-weight:600;font-size:8px;">${transactionId}</span></div>` : ''}

        <div style="padding:3px 6px;text-align:center;font-weight:700;font-size:10px;letter-spacing:0.5px;margin:3px 0;background:#ffffff;color:#000;border:1.5px solid #000;">
          ${paymentStatus === 'PAID' ? '✓ PAID' : 'PENDING PAYMENT'}
        </div>

        ${visitingTimings.length > 0 ? `
          <div style="border-top:1px dashed #000;margin:4px 0;"></div>
          <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-top:4px;margin-bottom:2px;color:#000;border-bottom:1px solid #000;padding-bottom:2px;">Visit Log</div>
          ${visitingTimings.map((t, i) => `
            <div style="display:flex;justify-content:space-between;padding:1px 0;font-size:8px;">
              <span>Day ${i+1}: ${formatDateFn(t.date)}</span>
              <span>${t.checkIn} - ${t.checkOut}</span>
            </div>
          `).join('')}
        ` : ''}

        <div style="text-align:center;font-size:8px;color:#666;border-top:1px dashed #000;padding-top:6px;margin-top:6px;">
          <div style="font-size:10px;font-weight:700;color:#000;letter-spacing:0.5px;">IRYAX SPACE</div>
          <div>Thank you for choosing ${cabinName}</div>
          <div>System Generated Receipt</div>
          <div>${today} ${currentTime}</div>
        </div>
      </div>
    `;
  };

  const getReceiptPageStyles = () => `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }
    html, body {
      background: #ffffff;
      padding: 4px;
      margin: 0 auto;
      max-width: 280px;
    }
    @page {
      size: 80mm auto;
      margin: 0;
    }
    @media print {
      html, body { padding: 2px; width: 80mm; }
      .no-print { display: none !important; }
    }
    .action-btn {
      display: block;
      width: 100%;
      max-width: 280px;
      padding: 10px;
      margin: 8px auto;
      border: none;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      font-family: 'Courier New', monospace;
      color: #fff;
    }
    .btn-print { background: #1a56db; }
    .btn-print:hover { background: #1e40af; }
    .btn-pdf { background: #059669; }
    .btn-pdf:hover { background: #047857; }
    .btn-close { background: #6b7280; }
    .btn-close:hover { background: #4b5563; }
    .hint {
      text-align: center;
      font-size: 10px;
      color: #6b7280;
      margin: 4px auto 0;
      max-width: 280px;
      font-family: 'Courier New', monospace;
    }
  `;

  const printReceipt = (booking) => {
    try {
      const html = generateReceiptHTML(booking);
      const win = window.open('', '_blank', 'width=300,height=600');
      if (win) {
        win.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Receipt</title>
            <style>${getReceiptPageStyles()}</style>
          </head>
          <body>
            ${html}
            <button class="action-btn btn-print no-print" onclick="window.print()">🖨️ PRINT RECEIPT</button>
            <button class="action-btn btn-close no-print" onclick="window.close()">✕ CLOSE</button>
            <p class="hint no-print">Print dialog me "Background graphics" ON rakhein, warna colors nahi aayenge.</p>
          </body>
          </html>
        `);
        win.document.close();
        win.focus();
        toast.success('Receipt ready! Click Print.');
      } else {
        toast.error('Please allow popups');
      }
    } catch (error) {
      console.error('Receipt error:', error);
      toast.error('Failed to generate receipt');
    }
  };

  const downloadPDF = async (booking) => {
    const toastId = toast.loading('Generating PDF...');
    let iframe = null;
    try {
      const html = generateReceiptHTML(booking);

      iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.top = '0';
      iframe.style.left = '-99999px';
      iframe.style.width = '320px';
      iframe.style.height = '900px';
      iframe.style.border = 'none';
      document.body.appendChild(iframe);

      const idoc = iframe.contentDocument || iframe.contentWindow.document;
      idoc.open();
      idoc.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            html, body { background: #ffffff; }
          </style>
        </head>
        <body>${html}</body>
        </html>
      `);
      idoc.close();

      await new Promise((resolve) => setTimeout(resolve, 120));

      const target = idoc.querySelector('#receipt-content') || idoc.body;

      const canvas = await html2canvas(target, {
        scale: 3,
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');

      const pageWidthMM = 80;
      const pageHeightMM = (canvas.height * pageWidthMM) / canvas.width;

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [pageWidthMM, pageHeightMM]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, pageWidthMM, pageHeightMM);

      const orderId = booking._id.slice(-8).toUpperCase();
      pdf.save(`receipt_${orderId}.pdf`);

      toast.update(toastId, { render: 'Receipt downloaded as PDF!', type: 'success', isLoading: false, autoClose: 2500 });
    } catch (error) {
      console.error('PDF download error:', error);
      toast.update(toastId, { render: 'Failed to download PDF', type: 'error', isLoading: false, autoClose: 3000 });
    } finally {
      if (iframe && iframe.parentNode) {
        iframe.parentNode.removeChild(iframe);
      }
    }
  };

  const clearFilters = () => {
    setFilters({ status: 'all', paymentStatus: 'all', paymentMethod: 'all' });
    setFilterDateFrom('');
    setFilterDateTo('');
    setFilterCabinName('');
    setFilterOwner('');
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesDateFrom = filterDateFrom ? b.startDate >= filterDateFrom : true;
    const matchesDateTo = filterDateTo ? b.endDate <= filterDateTo : true;
    const matchesCabinName = filterCabinName ? b.cabin?.name?.toLowerCase().includes(filterCabinName.toLowerCase()) : true;
    const matchesOwner = filterOwner ? (b.cabin?.owner?.name || b.cabin?.owner?.email || '').toLowerCase().includes(filterOwner.toLowerCase()) : true;
    const matchesStatus = filters.status === 'all' || b.status === filters.status;
    const matchesPaymentStatus = filters.paymentStatus === 'all' || b.paymentStatus === filters.paymentStatus;
    const matchesPaymentMethod = filters.paymentMethod === 'all' || b.paymentMethod === filters.paymentMethod;
    return matchesDateFrom && matchesDateTo && matchesCabinName && matchesOwner && matchesStatus && matchesPaymentStatus && matchesPaymentMethod;
  });

  if (loading) {
    return (
      <div className="admin-dash" style={{ backgroundColor: '#ffffff' }}>
        <AdminNavbar />
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dash" style={{ backgroundColor: '#ffffff' }}>
      <AdminNavbar />

      <div className="pt-24 px-3 sm:px-4 md:px-6 lg:px-8 max-w-full mx-auto pb-16">
        <div className="admin-dash__header">
          <div>
            <h1 className="admin-dash__greeting">
              All <span>Bookings</span>
            </h1>
          </div>
        </div>

        {/* Small Stats Cards - One Row */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-4">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-2 text-center text-white shadow-lg shadow-indigo-500/20">
            <p className="text-[8px] font-bold uppercase tracking-wider text-indigo-200">Total</p>
            <p className="text-lg font-bold">{stats.totalBookings}</p>
          </div>
          <div className="bg-emerald-50 rounded-xl p-2 text-center border border-emerald-200">
            <p className="text-[8px] font-bold uppercase tracking-wider text-emerald-600">Confirmed</p>
            <p className="text-lg font-bold text-emerald-600">{stats.confirmed}</p>
          </div>
          <div className="bg-indigo-50 rounded-xl p-2 text-center border border-indigo-200">
            <p className="text-[8px] font-bold uppercase tracking-wider text-indigo-600">Active</p>
            <p className="text-lg font-bold text-indigo-600">{stats.active}</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-2 text-center border border-blue-200">
            <p className="text-[8px] font-bold uppercase tracking-wider text-blue-600">Completed</p>
            <p className="text-lg font-bold text-blue-600">{stats.completed}</p>
          </div>
          <div className="bg-yellow-50 rounded-xl p-2 text-center border border-yellow-200">
            <p className="text-[8px] font-bold uppercase tracking-wider text-yellow-600">Pending</p>
            <p className="text-lg font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-red-50 rounded-xl p-2 text-center border border-red-200">
            <p className="text-[8px] font-bold uppercase tracking-wider text-red-600">Cancelled</p>
            <p className="text-lg font-bold text-red-600">{stats.cancelled}</p>
          </div>
        </div>

        {/* Filters - Always Expanded - No Clear Button */}
        <div className="bg-gray-50 rounded-xl p-3 mb-4 border border-gray-200">
          <div className="flex flex-wrap items-end gap-3">
            {/* From Date */}
            <div className="min-w-[120px]">
              <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">From Date</label>
              <input type="date" value={filterDateFrom} onChange={(e) => setFilterDateFrom(e.target.value)} className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
            </div>
            {/* To Date */}
            <div className="min-w-[120px]">
              <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">To Date</label>
              <input type="date" value={filterDateTo} onChange={(e) => setFilterDateTo(e.target.value)} className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
            </div>
            {/* Cabin Name */}
            <div className="min-w-[140px]">
              <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Cabin Name</label>
              <select value={filterCabinName} onChange={(e) => setFilterCabinName(e.target.value)} className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
                <option value="">All Cabins</option>
                {cabinNames.map((name, i) => (
                  <option key={i} value={name}>{name}</option>
                ))}
              </select>
            </div>
            {/* Owner */}
            <div className="min-w-[140px]">
              <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Owner</label>
              <select value={filterOwner} onChange={(e) => setFilterOwner(e.target.value)} className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
                <option value="">All Owners</option>
                {owners.map((owner, i) => (
                  <option key={i} value={owner}>{owner}</option>
                ))}
              </select>
            </div>
            {/* Status */}
            <div className="min-w-[110px]">
              <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Status</label>
              <select value={filters.status} onChange={(e) => setFilters({...filters, status: e.target.value})} className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            {/* Payment Status */}
            <div className="min-w-[110px]">
              <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Payment Status</label>
              <select value={filters.paymentStatus} onChange={(e) => setFilters({...filters, paymentStatus: e.target.value})} className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
            {/* Payment Method */}
            <div className="min-w-[110px]">
              <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Payment Method</label>
              <select value={filters.paymentMethod} onChange={(e) => setFilters({...filters, paymentMethod: e.target.value})} className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
                <option value="all">All</option>
                <option value="online">Online</option>
                <option value="cash">Cash</option>
                <option value="counter">Counter</option>
                <option value="upi">UPI</option>
                <option value="card">Card</option>
              </select>
            </div>
            {/* Export Button - Only Export, No Clear Button */}
            {filteredBookings.length > 0 && (
              <button onClick={exportToExcel} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium hover:bg-indigo-100 transition-colors border border-indigo-200 whitespace-nowrap">
                <Download size={14} /> Export
              </button>
            )}
          </div>
        </div>

        {/* Table Section */}
        <div className="admin-dash__card" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}>
          <div className="admin-dash__card-header flex flex-wrap items-center justify-between gap-3" style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb' }}>
            <div className="flex items-center gap-3">
              <h3 className="admin-dash__card-title">All Bookings</h3>
              <span className="px-2.5 py-0.5 text-xs font-bold text-indigo-700 bg-indigo-100 rounded-full">
                {filteredBookings.length}
              </span>
            </div>
          </div>

          <div className="admin-dash__card-body p-0 overflow-x-auto" style={{ backgroundColor: '#ffffff' }}>
            {filteredBookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-20 text-gray-400">
                <Calendar size={48} className="opacity-20" />
                <p className="text-lg font-medium">No bookings found</p>
                <p className="text-sm">Try adjusting your filters.</p>
              </div>
            ) : (
              <table className="w-full min-w-[1000px] text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-100" style={{ backgroundColor: '#f9fafb' }}>
                    <th className="p-2 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">#</th>
                    <th className="p-2 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Cabin</th>
                    <th className="p-2 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Customer</th>
                    <th className="p-2 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">From</th>
                    <th className="p-2 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">To</th>
                    <th className="p-2 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Hours</th>
                    <th className="p-2 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Seats</th>
                    <th className="p-2 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Status</th>
                    <th className="p-2 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Payment</th>
                    <th className="p-2 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Pmt Status</th>
                    <th className="p-2 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Visits</th>
                    <th className="p-2 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Amount</th>
                    <th className="p-2 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredBookings.map((booking, idx) => {
                    const statusBadge = getStatusBadge(booking.status);
                    const paymentMethodBadge = getPaymentMethodBadge(booking.paymentMethod);
                    const paymentStatusBadge = getPaymentStatusBadge(booking.paymentStatus);
                    const visitCount = booking.visitingTimings?.length || 0;
                    const seatCount = booking.seatCount || 0;

                    return (
                      <tr key={booking._id} className="transition-colors group hover:bg-gray-50/80">
                        <td className="p-2"><span className="text-xs font-semibold text-gray-400">#{idx + 1}</span></td>
                        <td className="p-2">
                          <div>
                            <p className="font-semibold text-gray-800 text-xs">{booking.cabin?.name || "Unknown"}</p>
                            <p className="text-[10px] text-gray-400 truncate max-w-[120px]">{booking.cabin?.address?.split(",")[0] || "No Address"}</p>
                          </div>
                        </td>
                        <td className="p-2">
                          <div>
                            <p className="font-medium text-gray-800 text-xs">{booking.name || booking.user?.name || "Unknown"}</p>
                            <p className="text-[10px] text-gray-400">{booking.mobile || booking.user?.mobile || "N/A"}</p>
                          </div>
                        </td>
                        <td className="p-2">
                          <div>
                            <p className="font-medium text-gray-800 text-xs">{formatDateIndian(booking.startDate)}</p>
                            <p className="text-[10px] text-gray-500">{formatTime12(booking.startTime)}</p>
                          </div>
                        </td>
                        <td className="p-2">
                          <div>
                            <p className="font-medium text-gray-800 text-xs">{formatDateIndian(booking.endDate)}</p>
                            <p className="text-[10px] text-gray-500">{formatTime12(booking.endTime)}</p>
                          </div>
                        </td>
                        <td className="p-2">
                          <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-bold">{booking.totalHours}h</span>
                        </td>
                        <td className="p-2">
                          <span className="flex items-center gap-1 text-xs font-medium text-gray-700">
                            <Armchair size={12} className="text-indigo-500" />
                            {seatCount}
                          </span>
                        </td>
                        <td className="p-2">
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full inline-flex items-center gap-1 ${statusBadge.color}`}>
                            {statusBadge.icon} {statusBadge.label}
                          </span>
                        </td>
                        <td className="p-2">
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full inline-flex items-center gap-1 ${paymentMethodBadge.color}`}>
                            {paymentMethodBadge.icon} {paymentMethodBadge.label}
                          </span>
                        </td>
                        <td className="p-2">
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full inline-flex items-center gap-1 ${paymentStatusBadge.color}`}>
                            {paymentStatusBadge.icon} {paymentStatusBadge.label}
                          </span>
                        </td>
                        <td className="p-2">
                          <div className="flex items-center gap-1">
                            <History size={12} className="text-indigo-400" />
                            <span className="text-xs font-semibold text-gray-700">{visitCount}</span>
                          </div>
                        </td>
                        <td className="p-2">
                          <span className="flex items-center gap-1 text-indigo-600 font-bold text-xs">
                            <IndianRupee size={12} />
                            {booking.totalPrice?.toLocaleString("en-IN") || "0"}
                          </span>
                        </td>
                        <td className="p-2">
                          <div className="flex items-center gap-1 justify-center overflow-x-auto max-w-[280px] py-1 scrollbar-thin scrollbar-thumb-gray-300">
                            <button onClick={() => handleViewBooking(booking)} className="flex items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors whitespace-nowrap">
                              <Eye size={11} /> View
                            </button>
                            <button onClick={() => printReceipt(booking)} className="flex items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors whitespace-nowrap">
                              <Printer size={11} /> Print
                            </button>
                            <button onClick={() => downloadPDF(booking)} className="flex items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors whitespace-nowrap">
                              <FileDown size={11} /> PDF
                            </button>
                            <button onClick={() => { setTimingBooking(booking); setNewTiming({ date: "", checkIn: "", checkOut: "" }); setShowTimingModal(true); }} className="flex items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors whitespace-nowrap">
                              <Plus size={11} /> Timing
                            </button>
                            <button onClick={() => { setSelectedBooking(booking); setNewStatus(booking.status || 'pending'); setShowStatusModal(true); }} className="flex items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] font-medium bg-orange-50 text-orange-700 hover:bg-orange-100 transition-colors whitespace-nowrap">
                              <Edit size={11} /> Status
                            </button>
                            <button 
                              onClick={() => {
                                setPaymentBooking(booking);
                                setNewPaymentStatus(booking.paymentStatus || 'pending');
                                setAmountPaid(booking.totalPrice || 0);
                                setPaymentDetails({
                                  paymentMode: 'cash',
                                  cardNumber: '',
                                  cardHolderName: '',
                                  cardExpiry: '',
                                  cardCVV: '',
                                  upiId: '',
                                  upiApp: '',
                                  transactionId: '',
                                  paymentDate: new Date().toISOString().split('T')[0],
                                  notes: ''
                                });
                                setPaymentScreenshot(null);
                                setPaymentScreenshotPreview(null);
                                setShowPaymentModal(true);
                              }} 
                              className="flex items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] font-medium bg-yellow-50 text-yellow-700 hover:bg-yellow-100 transition-colors whitespace-nowrap"
                            >
                              <CreditCard size={11} /> Payment
                            </button>
                            <button 
                              onClick={() => { setDeleteBooking(booking); setShowDeleteModal(true); }} 
                              className="flex items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] font-medium bg-red-50 text-red-700 hover:bg-red-100 transition-colors whitespace-nowrap"
                            >
                              <Trash2 size={11} /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {!loading && filteredBookings.length > 0 && (
            <div className="px-4 py-2 border-t border-gray-100 rounded-b-2xl flex flex-wrap items-center justify-between gap-2" style={{ backgroundColor: '#fafafa' }}>
              <span className="text-[10px] text-gray-500">
                Showing <strong>{filteredBookings.length}</strong> of <strong>{bookings.length}</strong> bookings
              </span>
              <div className="flex items-center gap-2 text-[10px] text-gray-500">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> {stats.confirmed}</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-500"></span> {stats.active}</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500"></span> {stats.pending}</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> {stats.cancelled}</span>
                <span className="flex items-center gap-1 font-semibold text-gray-700">Revenue: {formatCurrency(stats.totalRevenue)}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ====================== */}
      {/* VIEW BOOKING MODAL - FULL DETAILS */}
      {/* ====================== */}
      {showViewModal && viewBooking && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) setShowViewModal(false); }}>
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-gradient-to-br from-indigo-600 to-purple-600 text-white p-6 rounded-t-3xl flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold">Booking Details</h3>
                <p className="text-sm text-indigo-200">#{viewBooking._id.slice(-6).toUpperCase()}</p>
              </div>
              <button onClick={() => setShowViewModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Cabin Details */}
              <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-200">
                <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-2">
                  <Building2 size={14} /> Cabin Details
                </p>
                <div className="mt-2 space-y-1 text-sm">
                  <p><span className="text-gray-500">Name:</span> <span className="font-semibold">{viewBooking.cabin?.name || 'N/A'}</span></p>
                  <p><span className="text-gray-500">Address:</span> <span className="font-medium">{viewBooking.cabin?.address || 'N/A'}</span></p>
                  <p><span className="text-gray-500">Capacity:</span> <span className="font-medium">{viewBooking.cabin?.capacity || 'N/A'} people</span></p>
                  <p><span className="text-gray-500">Price per day:</span> <span className="font-medium">₹{viewBooking.cabin?.price || 0}</span></p>
                </div>
              </div>

              {/* Customer Details */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center gap-2">
                  <User size={14} /> Customer Details
                </p>
                <div className="mt-2 space-y-1 text-sm">
                  <p><span className="text-gray-500">Name:</span> <span className="font-semibold">{viewBooking.name || viewBooking.user?.name || 'N/A'}</span></p>
                  <p><span className="text-gray-500">Mobile:</span> <span className="font-medium">{viewBooking.mobile || viewBooking.user?.mobile || 'N/A'}</span></p>
                  <p><span className="text-gray-500">Email:</span> <span className="font-medium break-all">{viewBooking.email || viewBooking.user?.email || 'N/A'}</span></p>
                </div>
              </div>

              {/* Schedule */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                  <Clock size={14} /> Schedule
                </p>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500">From</p>
                    <p className="font-semibold">{formatDateIndian(viewBooking.startDate)} {formatTime12(viewBooking.startTime)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">To</p>
                    <p className="font-semibold">{formatDateIndian(viewBooking.endDate)} {formatTime12(viewBooking.endTime)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Duration</p>
                    <p className="font-semibold">{viewBooking.totalHours}h</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Type</p>
                    <p className="font-semibold">{viewBooking.bookingBasis === 'plan' ? 'Plan Booking' : 'Hourly Booking'}</p>
                  </div>
                </div>
              </div>

              {/* Seats */}
              {viewBooking.selectedSeats && viewBooking.selectedSeats.length > 0 && (
                <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-200">
                  <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-2">
                    <Armchair size={14} /> Selected Seats ({viewBooking.seatCount})
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {viewBooking.selectedSeats.map((seat) => (
                      <span key={seat._id} className="px-3 py-1.5 bg-white rounded-lg border border-indigo-200 text-sm font-medium text-gray-700">
                        {seat.name} <span className="text-gray-400 text-xs">#{seat.number}</span>
                      </span>
                    ))}
                  </div>
                  {viewBooking.extraCharge > 0 && (
                    <p className="text-xs text-amber-600 mt-2">Extra Seat Charge: ₹{viewBooking.extraCharge}</p>
                  )}
                </div>
              )}

              {/* Status */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-indigo-50 rounded-xl text-center">
                  <p className="text-[10px] text-indigo-500 font-bold uppercase">Status</p>
                  <span className={`px-3 py-1 text-xs font-bold rounded-full inline-block mt-1 ${getStatusBadge(viewBooking.status).color}`}>
                    {getStatusBadge(viewBooking.status).label}
                  </span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl text-center">
                  <p className="text-[10px] text-gray-500 font-bold uppercase">Payment Method</p>
                  <span className={`px-3 py-1 text-xs font-bold rounded-full inline-block mt-1 ${getPaymentMethodBadge(viewBooking.paymentMethod).color}`}>
                    {getPaymentMethodBadge(viewBooking.paymentMethod).label}
                  </span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl text-center">
                  <p className="text-[10px] text-gray-500 font-bold uppercase">Payment Status</p>
                  <span className={`px-3 py-1 text-xs font-bold rounded-full inline-block mt-1 ${getPaymentStatusBadge(viewBooking.paymentStatus).color}`}>
                    {getPaymentStatusBadge(viewBooking.paymentStatus).label}
                  </span>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                  <IndianRupee size={14} /> Price Breakdown
                </p>
                <div className="mt-2 space-y-1 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Subtotal ({viewBooking.totalHours}h)</span><span className="font-medium">₹{viewBooking.subtotal?.toFixed(2) || '0'}</span></div>
                  {viewBooking.extraCharge > 0 && (
                    <div className="flex justify-between"><span className="text-gray-500">Seat Charges</span><span className="font-medium">₹{viewBooking.extraCharge?.toFixed(2) || '0'}</span></div>
                  )}
                  <div className="flex justify-between"><span className="text-gray-500">GST (18%)</span><span className="font-medium">₹{viewBooking.gstAmount?.toFixed(2) || '0'}</span></div>
                  <div className="border-t border-gray-300 pt-2 mt-2 flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-indigo-600">₹{viewBooking.totalPrice?.toLocaleString('en-IN') || 0}</span>
                  </div>
                </div>
              </div>

              {/* Payment Details - Full */}
              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-2">
                  <WalletIcon size={14} /> Payment Details
                </p>
                <div className="mt-2 space-y-1 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Method</span><span className="font-medium">{viewBooking.paymentMethod || 'N/A'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Status</span><span className={`font-medium ${viewBooking.paymentStatus === 'paid' ? 'text-emerald-600' : 'text-yellow-600'}`}>{viewBooking.paymentStatus || 'N/A'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Transaction ID</span><span className="font-mono text-xs">{viewBooking.transactionId || 'N/A'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Amount Paid</span><span className="font-bold text-emerald-600">₹{viewBooking.amountPaid?.toLocaleString('en-IN') || viewBooking.totalPrice || 0}</span></div>
                  
                  {viewBooking.paymentDetails && (
                    <>
                      <div className="border-t border-emerald-200 pt-2 mt-2">
                        <p className="text-[10px] font-semibold text-emerald-700">Payment Mode Details:</p>
                      </div>
                      <div className="flex justify-between"><span className="text-gray-500">Mode</span><span className="font-medium">{viewBooking.paymentDetails.mode || 'N/A'}</span></div>
                      {viewBooking.paymentDetails.upiId && (
                        <div className="flex justify-between"><span className="text-gray-500">UPI ID</span><span className="font-mono text-xs">{viewBooking.paymentDetails.upiId}</span></div>
                      )}
                      {viewBooking.paymentDetails.upiApp && (
                        <div className="flex justify-between"><span className="text-gray-500">UPI App</span><span className="font-medium">{viewBooking.paymentDetails.upiApp}</span></div>
                      )}
                      {viewBooking.paymentDetails.cardNumber && (
                        <div className="flex justify-between"><span className="text-gray-500">Card Number</span><span className="font-mono text-xs">•••• {viewBooking.paymentDetails.cardNumber.slice(-4)}</span></div>
                      )}
                      {viewBooking.paymentDetails.cardHolderName && (
                        <div className="flex justify-between"><span className="text-gray-500">Card Holder</span><span className="font-medium">{viewBooking.paymentDetails.cardHolderName}</span></div>
                      )}
                      {viewBooking.paymentDetails.paymentDate && (
                        <div className="flex justify-between"><span className="text-gray-500">Payment Date</span><span className="font-medium">{formatDateIndian(viewBooking.paymentDetails.paymentDate)}</span></div>
                      )}
                      {viewBooking.paymentDetails.screenshot && (
                        <div className="mt-2">
                          <p className="text-gray-500 text-xs">Screenshot:</p>
                          <img src={`${API_URL}${viewBooking.paymentDetails.screenshot}`} alt="Payment Screenshot" className="mt-1 max-h-48 rounded-lg border border-gray-200" />
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Visiting Timings */}
              {viewBooking.visitingTimings && viewBooking.visitingTimings.length > 0 && (
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
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

              {/* Created At */}
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Created At</span>
                  <span className="font-medium">{formatDateTimeIndian(viewBooking.createdAt)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button onClick={() => { setShowViewModal(false); printReceipt(viewBooking); }} className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition shadow-sm active:scale-[0.98] flex items-center justify-center gap-2">
                  <Printer size={16} /> Print
                </button>
                <button onClick={() => { setShowViewModal(false); downloadPDF(viewBooking); }} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-sm active:scale-[0.98] flex items-center justify-center gap-2">
                  <FileDown size={16} /> PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STATUS UPDATE MODAL */}
      {showStatusModal && selectedBooking && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) { setShowStatusModal(false); setSelectedBooking(null); setNewStatus(""); } }}>
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-5 text-white rounded-t-3xl flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center"><Edit size={20} className="text-white" /></div>
                <div><h3 className="text-xl font-bold">Update Status</h3><p className="text-sm text-indigo-200">{selectedBooking.cabin?.name}</p></div>
              </div>
              <button onClick={() => { setShowStatusModal(false); setSelectedBooking(null); setNewStatus(""); }} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"><X size={20} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-gray-50 rounded-xl p-4 flex justify-between items-center">
                <span className="text-sm text-gray-500">Current Status</span>
                <span className={`px-3 py-1 text-xs font-bold rounded-full inline-flex items-center gap-1.5 ${getStatusBadge(selectedBooking.status).color}`}>
                  {getStatusBadge(selectedBooking.status).icon} {getStatusBadge(selectedBooking.status).label}
                </span>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Select New Status</label>
                <div className="grid grid-cols-2 gap-2">
                  {['pending', 'confirmed', 'active', 'completed', 'cancelled'].map((status) => {
                    const badge = getStatusBadge(status);
                    const isSelected = newStatus === status;
                    return (
                      <button key={status} onClick={() => setNewStatus(status)} className={`py-2.5 rounded-xl text-xs font-bold border transition ${isSelected ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 hover:bg-gray-50 text-gray-700'}`}>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>{badge.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="bg-amber-50 rounded-xl p-3 text-xs text-amber-700 flex items-start gap-2 border border-amber-200">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>Changing status will update the booking visibility and availability.</span>
              </div>
              <div className="flex gap-3">
                <button onClick={handleUpdateStatus} disabled={updating || !newStatus} className={`flex-1 py-3 rounded-xl text-white font-bold transition ${(updating || !newStatus) ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg'}`}>
                  {updating ? 'Updating...' : 'Update Status'}
                </button>
                <button onClick={() => { setShowStatusModal(false); setSelectedBooking(null); setNewStatus(""); }} className="px-5 py-3 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PAYMENT STATUS UPDATE MODAL */}
      {showPaymentModal && paymentBooking && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) resetPaymentModal(); }}>
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-y-auto max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-gradient-to-br from-amber-500 to-amber-600 p-5 text-white rounded-t-3xl flex justify-between items-center z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center"><CreditCard size={20} className="text-white" /></div>
                <div><h3 className="text-xl font-bold">Update Payment</h3><p className="text-sm text-amber-100">₹{paymentBooking.totalPrice}</p></div>
              </div>
              <button onClick={resetPaymentModal} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"><X size={20} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Customer</span><span className="font-semibold">{paymentBooking.name || 'N/A'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Cabin</span><span className="font-semibold">{paymentBooking.cabin?.name || 'N/A'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Current Status</span><span className={`px-3 py-1 text-xs font-bold rounded-full ${getPaymentStatusBadge(paymentBooking.paymentStatus).color}`}>{getPaymentStatusBadge(paymentBooking.paymentStatus).label}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Total Amount</span><span className="font-bold text-gray-800">₹{paymentBooking.totalPrice}</span></div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">New Payment Status</label>
                <div className="grid grid-cols-2 gap-2">
                  {['pending','paid','failed','refunded'].map(s => {
                    const badge = getPaymentStatusBadge(s);
                    const isSelected = newPaymentStatus === s;
                    return (
                      <button key={s} onClick={() => { setNewPaymentStatus(s); if(s === 'paid') setAmountPaid(paymentBooking.totalPrice); else setAmountPaid(0); }} className={`py-2.5 rounded-xl text-xs font-bold border transition ${isSelected ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-gray-200 hover:bg-gray-50 text-gray-700'}`}>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>{badge.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {newPaymentStatus === 'paid' && (
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Amount Paid (₹)</label>
                  <input type="number" value={amountPaid} onChange={(e) => setAmountPaid(Number(e.target.value))} placeholder="Enter amount" className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>
              )}

              {newPaymentStatus === 'paid' && (
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Payment Mode</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button onClick={() => setPaymentDetails({...paymentDetails, paymentMode: 'cash'})} className={`py-2.5 rounded-xl text-xs font-bold border transition ${paymentDetails.paymentMode === 'cash' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-200 hover:bg-gray-50 text-gray-700'}`}>
                      <Store size={16} className="mx-auto mb-1" /> Cash
                    </button>
                    <button onClick={() => setPaymentDetails({...paymentDetails, paymentMode: 'upi'})} className={`py-2.5 rounded-xl text-xs font-bold border transition ${paymentDetails.paymentMode === 'upi' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 hover:bg-gray-50 text-gray-700'}`}>
                      <Smartphone size={16} className="mx-auto mb-1" /> UPI
                    </button>
                    <button onClick={() => setPaymentDetails({...paymentDetails, paymentMode: 'card'})} className={`py-2.5 rounded-xl text-xs font-bold border transition ${paymentDetails.paymentMode === 'card' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:bg-gray-50 text-gray-700'}`}>
                      <CreditCard size={16} className="mx-auto mb-1" /> Card
                    </button>
                  </div>
                </div>
              )}

              {paymentDetails.paymentMode === 'card' && newPaymentStatus === 'paid' && (
                <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-blue-200">
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center gap-2">
                    <CreditCard size={14} /> Card Details
                  </p>
                  <div>
                    <label className="text-xs font-medium text-gray-600 block mb-1">Card Number</label>
                    <input type="text" placeholder="1234 5678 9012 3456" value={paymentDetails.cardNumber} onChange={(e) => setPaymentDetails({...paymentDetails, cardNumber: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 block mb-1">Card Holder Name</label>
                    <input type="text" placeholder="John Doe" value={paymentDetails.cardHolderName} onChange={(e) => setPaymentDetails({...paymentDetails, cardHolderName: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-gray-600 block mb-1">Expiry Date</label>
                      <input type="text" placeholder="MM/YY" value={paymentDetails.cardExpiry} onChange={(e) => setPaymentDetails({...paymentDetails, cardExpiry: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600 block mb-1">CVV</label>
                      <input type="password" placeholder="***" maxLength="4" value={paymentDetails.cardCVV} onChange={(e) => setPaymentDetails({...paymentDetails, cardCVV: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                </div>
              )}

              {paymentDetails.paymentMode === 'upi' && newPaymentStatus === 'paid' && (
                <div className="space-y-3 bg-purple-50 p-4 rounded-xl border border-purple-200">
                  <p className="text-xs font-bold text-purple-600 uppercase tracking-wider flex items-center gap-2">
                    <Smartphone size={14} /> UPI Details
                  </p>
                  <div>
                    <label className="text-xs font-medium text-gray-600 block mb-1">UPI ID</label>
                    <input type="text" placeholder="example@upi" value={paymentDetails.upiId} onChange={(e) => setPaymentDetails({...paymentDetails, upiId: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 block mb-1">UPI App</label>
                    <select value={paymentDetails.upiApp} onChange={(e) => setPaymentDetails({...paymentDetails, upiApp: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                      <option value="">Select UPI App</option>
                      <option value="Google Pay">Google Pay</option>
                      <option value="PhonePe">PhonePe</option>
                      <option value="Paytm">Paytm</option>
                      <option value="Amazon Pay">Amazon Pay</option>
                      <option value="BHIM">BHIM</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              )}

              {newPaymentStatus === 'paid' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Transaction ID</label>
                    <input type="text" placeholder="TXN123456789" value={paymentDetails.transactionId} onChange={(e) => setPaymentDetails({...paymentDetails, transactionId: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Payment Date</label>
                    <input type="date" value={paymentDetails.paymentDate} onChange={(e) => setPaymentDetails({...paymentDetails, paymentDate: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
                  </div>
                </div>
              )}

              {newPaymentStatus === 'paid' && paymentDetails.paymentMode !== 'cash' && (
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Payment Screenshot</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-amber-400 transition cursor-pointer relative" onClick={() => document.getElementById('screenshotUpload').click()}>
                    <input id="screenshotUpload" type="file" accept="image/*" className="hidden" onChange={handlePaymentScreenshotChange} />
                    {paymentScreenshotPreview ? (
                      <div className="relative">
                        <img src={paymentScreenshotPreview} alt="Screenshot Preview" className="max-h-48 mx-auto rounded-lg" />
                        <button onClick={(e) => { e.stopPropagation(); setPaymentScreenshot(null); setPaymentScreenshotPreview(null); }} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition">
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="py-4">
                        <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">Click to upload screenshot</p>
                        <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {newPaymentStatus === 'paid' && (
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Notes (Optional)</label>
                  <textarea rows="2" placeholder="Any additional notes about this payment..." value={paymentDetails.notes} onChange={(e) => setPaymentDetails({...paymentDetails, notes: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none" />
                </div>
              )}

              <div className="bg-amber-50 rounded-xl p-3 text-xs text-amber-700 flex items-start gap-2 border border-amber-200">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>Marking as paid will add the amount to the owner's wallet. All payment details will be securely stored.</span>
              </div>
              <div className="flex gap-3">
                <button onClick={handleUpdatePaymentStatus} disabled={updatingPayment || !newPaymentStatus || (newPaymentStatus === 'paid' && (!amountPaid || amountPaid <= 0))} className={`flex-1 py-3 rounded-xl text-white font-bold transition ${(updatingPayment || !newPaymentStatus || (newPaymentStatus === 'paid' && (!amountPaid || amountPaid <= 0))) ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:shadow-lg'}`}>
                  {updatingPayment ? 'Updating...' : 'Update Payment'}
                </button>
                <button onClick={resetPaymentModal} className="px-5 py-3 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VISITING TIMINGS MODAL */}
      {showTimingModal && timingBooking && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) { setShowTimingModal(false); setTimingBooking(null); setNewTiming({ date: "", checkIn: "", checkOut: "" }); } }}>
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-5 text-white rounded-t-3xl flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center"><Plus size={20} className="text-white" /></div>
                <div><h3 className="text-xl font-bold">Add Visit Timing</h3><p className="text-sm text-blue-200">{timingBooking.cabin?.name}</p></div>
              </div>
              <button onClick={() => { setShowTimingModal(false); setTimingBooking(null); setNewTiming({ date: "", checkIn: "", checkOut: "" }); }} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"><X size={20} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Customer</span><span className="font-semibold">{timingBooking.name || 'N/A'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Period</span><span className="font-medium">{formatDateIndian(timingBooking.startDate)} - {formatDateIndian(timingBooking.endDate)}</span></div>
                <div className="flex justify-between pt-2 border-t border-gray-200"><span className="text-gray-500">Visits Logged</span><span className="font-bold text-blue-600">{timingBooking.visitingTimings?.length || 0}</span></div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Visit Date</label>
                <input type="date" value={newTiming.date} onChange={(e) => setNewTiming({ ...newTiming, date: e.target.value })} className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Check In</label>
                  <input type="time" value={newTiming.checkIn} onChange={(e) => setNewTiming({ ...newTiming, checkIn: e.target.value })} className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Check Out</label>
                  <input type="time" value={newTiming.checkOut} onChange={(e) => setNewTiming({ ...newTiming, checkOut: e.target.value })} className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              {timingBooking.visitingTimings && timingBooking.visitingTimings.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Existing Visits</p>
                  <div className="space-y-1 mt-1.5">
                    {timingBooking.visitingTimings.map((t, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">{formatDateIndian(t.date)}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-600 font-medium">{formatTime12(t.checkIn)}</span>
                          <span className="text-gray-300">-</span>
                          <span className="text-red-500 font-medium">{formatTime12(t.checkOut)}</span>
                          <button onClick={() => { if (window.confirm("Delete this timing entry?")) { handleDeleteTiming(timingBooking._id, idx); } }} className="text-red-400 hover:text-red-600 transition-colors"><Trash2 size={12} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="bg-blue-50 rounded-xl p-3 text-xs text-blue-700 flex items-start gap-2 border border-blue-200">
                <Clock size={16} className="shrink-0 mt-0.5" />
                <span>Add check-in and check-out times for each visit day.</span>
              </div>
              <div className="flex gap-3">
                <button onClick={handleAddTiming} disabled={updatingTiming} className={`flex-1 py-3 rounded-xl text-white font-bold transition ${updatingTiming ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:shadow-lg'}`}>
                  {updatingTiming ? 'Adding...' : 'Add Timing'}
                </button>
                <button onClick={() => { setShowTimingModal(false); setTimingBooking(null); setNewTiming({ date: "", checkIn: "", checkOut: "" }); }} className="px-5 py-3 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE BOOKING MODAL */}
      {showDeleteModal && deleteBooking && (
        <div className="fixed inset-0 z-[1300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) { setShowDeleteModal(false); setDeleteBooking(null); } }}>
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-br from-red-500 to-red-600 p-5 text-white rounded-t-3xl flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center"><Trash2 size={20} className="text-white" /></div>
                <div><h3 className="text-xl font-bold">Delete Booking</h3><p className="text-sm text-red-200">{deleteBooking.cabin?.name}</p></div>
              </div>
              <button onClick={() => { setShowDeleteModal(false); setDeleteBooking(null); }} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"><X size={20} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-red-50 rounded-xl p-4 space-y-2 text-sm">
                <p className="font-bold text-red-800">Are you sure you want to delete this booking?</p>
                <div className="space-y-1 text-gray-600">
                  <p><span className="text-gray-500">Cabin:</span> {deleteBooking.cabin?.name || 'N/A'}</p>
                  <p><span className="text-gray-500">Customer:</span> {deleteBooking.name || deleteBooking.user?.name || 'N/A'}</p>
                  <p><span className="text-gray-500">Date:</span> {formatDateIndian(deleteBooking.startDate)} · {formatTime12(deleteBooking.startTime)}</p>
                  <p><span className="text-gray-500">Amount:</span> ₹{deleteBooking.totalPrice}</p>
                </div>
              </div>
              <div className="bg-amber-50 rounded-xl p-3 text-xs text-amber-700 flex items-start gap-2 border border-amber-200">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>This action cannot be undone. All associated data will be permanently removed.</span>
              </div>
              <div className="flex gap-3">
                <button onClick={handleDeleteBooking} disabled={deleting} className={`flex-1 py-3 rounded-xl text-white font-bold transition ${deleting ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-red-500 to-red-600 hover:shadow-lg'}`}>
                  {deleting ? 'Deleting...' : 'Confirm Delete'}
                </button>
                <button onClick={() => { setShowDeleteModal(false); setDeleteBooking(null); }} className="px-5 py-3 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllBookings;