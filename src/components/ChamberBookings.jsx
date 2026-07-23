// ChamberBookings.jsx - Complete with THERMAL PDF Download (NO EXTERNAL LIBRARY)
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DoctorNavbar from "./DoctorNavbar";
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
  Armchair
} from "lucide-react";
import { toast } from "react-toastify";
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import "./Dashboard.css";

const API_URL = "http://localhost:5003";

const ChamberBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [allChambers, setAllChambers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [filters, setFilters] = useState({
    status: 'all',
    paymentStatus: 'all',
    paymentMethod: 'all',
    cabinId: 'all'
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
  const [uploadingScreenshot, setUploadingScreenshot] = useState(false);

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

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

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

  // Fetch chambers for filter dropdown
  const fetchChambers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await axios.get(`${API_URL}/api/cabins`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const activeChambers = res.data.filter(c => c.isActive === true);
      setAllChambers(activeChambers);
    } catch (error) {
      console.error("Failed to fetch chambers:", error);
    }
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) { setLoading(false); return; }
        
        const res = await axios.get(`${API_URL}/api/bookings/owner-bookings`, { headers: { Authorization: `Bearer ${token}` } });
        const bookingsData = res.data.bookings || [];
        setBookings(bookingsData);
        calculateStats(bookingsData);
      } catch (err) {
        console.error("Failed to fetch chamber bookings:", err);
        toast.error("Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
    fetchChambers();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
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
        const res = await axios.get(`${API_URL}/api/bookings/owner-bookings`, { headers: { Authorization: `Bearer ${token}` } });
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
        const res = await axios.get(`${API_URL}/api/bookings/owner-bookings`, { headers: { Authorization: `Bearer ${token}` } });
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

  const exportToExcel = () => {
    try {
      if (filteredBookings.length === 0) { toast.warning("No bookings to export"); return; }
      const exportData = filteredBookings.map((booking, index) => {
        const statusBadge = getStatusBadge(booking.status);
        const paymentMethod = getPaymentMethodBadge(booking.paymentMethod);
        const paymentStatus = getPaymentStatusBadge(booking.paymentStatus);
        return {
          'S.No': index + 1, 'Booking Type': booking.bookingBasis === 'plan' ? 'Plan Booking' : 'Hourly Booking',
          'Chamber Name': booking.cabin?.name || 'Unknown Chamber', 'Address': booking.cabin?.address || 'No Address',
          'Customer Name': booking.name || booking.user?.name || 'Unknown Guest', 'Mobile': booking.mobile || booking.user?.mobile || 'N/A',
          'Email': booking.email || booking.user?.email || 'N/A', 'Start Date': booking.startDate || 'N/A',
          'Start Time': booking.startTime || 'N/A', 'End Date': booking.endDate || 'N/A', 'End Time': booking.endTime || 'N/A',
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
      XLSX.utils.book_append_sheet(wb, ws, 'Chamber_Bookings');
      const date = new Date().toISOString().split('T')[0];
      XLSX.writeFile(wb, `chamber_bookings_${date}.xlsx`);
      toast.success(`Exported ${filteredBookings.length} bookings to Excel!`);
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export bookings");
    }
  };

  // ============================================================
  // GENERATE THERMAL RECEIPT HTML
  // ============================================================
  const generateReceiptHTML = (booking) => {
    const cabin = booking.cabin || {};
    const cabinName = cabin.name || 'Unknown Chamber';
    const cabinAddress = cabin.address || 'N/A';
    const amount = booking.totalPrice || 0;
    const subtotal = booking.subtotal || 0;
    const gstAmount = booking.gstAmount || 0;
    const extraCharge = booking.extraCharge || 0;
    const seatCount = booking.seatCount || 0;
    const selectedSeats = booking.selectedSeats || [];
    const orderId = booking._id.slice(-8).toUpperCase();
    const startDate = booking.startDate || 'N/A';
    const startTime = booking.startTime || 'N/A';
    const endDate = booking.endDate || 'N/A';
    const endTime = booking.endTime || 'N/A';
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

    // Generate seat list HTML
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
        <div style="display:flex;justify-content:space-between;padding:1px 0;font-size:10px;"><span style="color:#555;">Date</span><span style="font-weight:600;">${startDate}</span></div>
        <div style="display:flex;justify-content:space-between;padding:1px 0;font-size:10px;"><span style="color:#555;">Time</span><span style="font-weight:600;">${startTime} - ${endTime}</span></div>
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

  // ============================================================
  // Shared print/PDF <style> block
  // ============================================================
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

  // ============================================================
  // THERMAL PRINTER RECEIPT - Print Direct
  // ============================================================
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

  // ============================================================
  // DOWNLOAD AS PDF - DIRECT SILENT DOWNLOAD
  // ============================================================
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
    setFilters({ status: 'all', paymentStatus: 'all', paymentMethod: 'all', cabinId: 'all' });
    setFilterDateFrom('');
    setFilterDateTo('');
  };

  // Updated filter logic with From/To dates and chamber filter
  const filteredBookings = bookings.filter((b) => {
    const bookingDate = b.startDate || b.date;
    
    // Date range filter
    let matchDateRange = true;
    if (filterDateFrom && filterDateTo) {
      matchDateRange = bookingDate >= filterDateFrom && bookingDate <= filterDateTo;
    } else if (filterDateFrom) {
      matchDateRange = bookingDate >= filterDateFrom;
    } else if (filterDateTo) {
      matchDateRange = bookingDate <= filterDateTo;
    }
    
    // Chamber filter
    const matchCabin = filters.cabinId === 'all' || b.cabin?._id === filters.cabinId;
    
    const matchStatus = filters.status === 'all' || b.status === filters.status;
    const matchPaymentStatus = filters.paymentStatus === 'all' || b.paymentStatus === filters.paymentStatus;
    const matchPaymentMethod = filters.paymentMethod === 'all' || b.paymentMethod === filters.paymentMethod;
    
    return matchDateRange && matchCabin && matchStatus && matchPaymentStatus && matchPaymentMethod;
  });

  if (loading) {
    return (
      <div className="admin-dash" style={{ backgroundColor: '#ffffff' }}>
        <DoctorNavbar />
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dash" style={{ backgroundColor: '#ffffff' }}>
      <DoctorNavbar />

      <div className="pt-24 px-3 sm:px-4 md:px-6 lg:px-8 max-w-full mx-auto pb-16">
        <div className="admin-dash__header">
          <div>
            <h1 className="admin-dash__greeting">
              Chamber <span>Bookings</span>
            </h1>
            
          </div>
          
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-4 sm:p-5 text-white shadow-lg shadow-indigo-500/25">
            <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-200">Total Bookings</p>
            <p className="text-2xl sm:text-3xl font-bold mt-1">{stats.totalBookings}</p>
            <div className="mt-2 pt-2 border-t border-white/20 flex justify-between text-[10px]">
              <span className="text-indigo-200">Revenue</span>
              <span className="font-semibold">{formatCurrency(stats.totalRevenue)}</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Confirmed</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.confirmed}</p>
              </div>
              <div className="bg-emerald-100 p-2.5 rounded-xl">
                <CheckCircle size={20} className="text-emerald-600" />
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between text-[10px]">
              <span className="text-gray-500">Revenue</span>
              <span className="font-semibold text-gray-900">{formatCurrency(stats.confirmedRevenue)}</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">Active</p>
                <p className="text-2xl font-bold text-indigo-600 mt-1">{stats.active}</p>
              </div>
              <div className="bg-indigo-100 p-2.5 rounded-xl">
                <Timer size={20} className="text-indigo-600" />
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between text-[10px]">
              <span className="text-gray-500">In Progress</span>
              <span className="font-semibold text-gray-900">{stats.active}</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Completed</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{stats.completed}</p>
              </div>
              <div className="bg-blue-100 p-2.5 rounded-xl">
                <CheckCircle size={20} className="text-blue-600" />
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between text-[10px]">
              <span className="text-gray-500">Revenue</span>
              <span className="font-semibold text-gray-900">{formatCurrency(stats.completedRevenue)}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-3 text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-yellow-600">Pending</p>
            <p className="text-xl font-bold text-yellow-700">{stats.pending}</p>
          </div>
          <div className="bg-red-50 rounded-xl border border-red-200 p-3 text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-red-600">Cancelled</p>
            <p className="text-xl font-bold text-red-700">{stats.cancelled}</p>
          </div>
          <div className="bg-purple-50 rounded-xl border border-purple-200 p-3 text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-purple-600">Total Revenue</p>
            <p className="text-xl font-bold text-purple-700">{formatCurrency(stats.totalRevenue)}</p>
          </div>
        </div>

        <div className="admin-dash__card" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}>
          <div className="admin-dash__card-header flex flex-wrap items-center justify-between gap-3" style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb' }}>
            <div className="flex items-center gap-3">
              <h3 className="admin-dash__card-title">All Bookings</h3>
              <span className="px-2.5 py-0.5 text-xs font-bold text-indigo-700 bg-indigo-100 rounded-full">
                {filteredBookings.length}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {/* From Date Filter */}
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500 font-medium">From:</span>
                <input
                  type="date"
                  value={filterDateFrom}
                  onChange={(e) => setFilterDateFrom(e.target.value)}
                  className="text-sm bg-white border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium text-gray-700"
                />
              </div>

              {/* To Date Filter */}
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500 font-medium">To:</span>
                <input
                  type="date"
                  value={filterDateTo}
                  onChange={(e) => setFilterDateTo(e.target.value)}
                  className="text-sm bg-white border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium text-gray-700"
                />
              </div>

              {/* Chamber Filter */}
              <select
                value={filters.cabinId}
                onChange={(e) => setFilters({...filters, cabinId: e.target.value})}
                className="text-sm bg-white border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium text-gray-700 min-w-[150px]"
              >
                <option value="all">All Chambers</option>
                {allChambers.map(chamber => (
                  <option key={chamber._id} value={chamber._id}>
                    {chamber.name}
                  </option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="text-sm bg-white border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium text-gray-700"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              {/* Payment Status Filter */}
              <select
                value={filters.paymentStatus}
                onChange={(e) => setFilters({...filters, paymentStatus: e.target.value})}
                className="text-sm bg-white border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium text-gray-700"
              >
                <option value="all">All Payment</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>

              {/* Payment Method Filter */}
              <select
                value={filters.paymentMethod}
                onChange={(e) => setFilters({...filters, paymentMethod: e.target.value})}
                className="text-sm bg-white border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium text-gray-700"
              >
                <option value="all">All Method</option>
                <option value="online">Online</option>
                <option value="cash">Cash</option>
                <option value="counter">Counter</option>
                <option value="upi">UPI</option>
                <option value="card">Card</option>
              </select>

              {/* Clear Filters */}
              {(filterDateFrom || filterDateTo || filters.status !== 'all' || filters.paymentStatus !== 'all' || filters.paymentMethod !== 'all' || filters.cabinId !== 'all') && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <XCircleIcon size={14} />
                  Clear
                </button>
              )}

              {filteredBookings.length > 0 && (
                <button onClick={exportToExcel} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium hover:bg-indigo-100 transition-colors border border-indigo-200">
                  <Download size={14} />
                  <span className="hidden xs:inline">Export</span>
                </button>
              )}

              <button onClick={() => navigate("/mychamberpayments")} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors">
                <CreditCard size={14} className="text-indigo-600" />
                <span className="hidden xs:inline">Payments</span>
              </button>
              <button onClick={() => navigate("/mychambers")} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 transition-colors">
                <Building2 size={14} />
                <span className="hidden xs:inline">Chambers</span>
              </button>
            </div>
          </div>

          <div className="admin-dash__card-body p-0 overflow-x-auto" style={{ backgroundColor: '#ffffff' }}>
            {/* Table with default headers always visible */}
            <table className="w-full min-w-[1300px] text-left">
              <thead>
                <tr className="border-b border-gray-100" style={{ backgroundColor: '#f9fafb' }}>
                  <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">#</th>
                  <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Chamber</th>
                  <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Customer</th>
                  <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">From Date</th>
                  <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">To Date</th>
                  <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Time</th>
                  <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Hours</th>
                  <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Seats</th>
                  <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Status</th>
                  <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Payment</th>
                  <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Pmt Status</th>
                  <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Visits</th>
                  <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Amount</th>
                  <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan="14">
                      <div className="flex flex-col items-center justify-center gap-3 py-20 text-gray-400">
                        <Calendar size={48} className="opacity-20" />
                        <p className="text-lg font-medium">No bookings found</p>
                        <p className="text-sm">Try adjusting your filters.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking, idx) => {
                    const statusBadge = getStatusBadge(booking.status);
                    const paymentMethodBadge = getPaymentMethodBadge(booking.paymentMethod);
                    const paymentStatusBadge = getPaymentStatusBadge(booking.paymentStatus);
                    const visitCount = booking.visitingTimings?.length || 0;
                    const isCashPending = (booking.paymentMethod === 'cash' || booking.paymentMethod === 'counter') && booking.paymentStatus === 'pending';
                    const seatCount = booking.seatCount || 0;
                    const seatNames = booking.selectedSeats?.map(s => s.name).join(', ') || 'N/A';

                    return (
                      <tr key={booking._id} className="transition-colors group hover:bg-gray-50/80">
                        <td className="p-4"><span className="text-sm font-semibold text-gray-400">#{idx + 1}</span></td>
                        <td className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                              <Building2 size={18} className="text-indigo-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">{booking.cabin?.name || "Unknown"}</p>
                              <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                                <MapPin size={12} className="text-indigo-500" />
                                {booking.cabin?.address?.split(",")[0] || "No Address"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                              <User size={18} className="text-gray-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-800 text-sm">{booking.name || booking.user?.name || "Unknown"}</p>
                              <p className="text-xs text-gray-400">{booking.mobile || booking.user?.mobile || "N/A"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="text-sm text-gray-900 font-medium">{booking.startDate || 'N/A'}</p>
                        </td>
                        <td className="p-4">
                          <p className="text-sm text-gray-900 font-medium">{booking.endDate || booking.startDate || 'N/A'}</p>
                        </td>
                        <td className="p-4">
                          <p className="text-sm text-gray-500">{booking.startTime || 'N/A'} - {booking.endTime || 'N/A'}</p>
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold">{booking.totalHours}h</span>
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
                          <span className={`px-3 py-1 text-xs font-bold rounded-full inline-flex items-center gap-1.5 ${statusBadge.color}`}>
                            {statusBadge.icon} {statusBadge.label}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 text-xs font-bold rounded-full inline-flex items-center gap-1.5 ${paymentMethodBadge.color}`}>
                            {paymentMethodBadge.icon} {paymentMethodBadge.label}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 text-xs font-bold rounded-full inline-flex items-center gap-1.5 ${paymentStatusBadge.color}`}>
                            {paymentStatusBadge.icon} {paymentStatusBadge.label}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1">
                            <History size={14} className="text-indigo-400" />
                            <span className="text-sm font-semibold text-gray-700">{visitCount}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div>
                            <span className="flex items-center gap-1 text-indigo-600 font-bold text-sm">
                              <IndianRupee size={14} />
                              {booking.totalPrice?.toLocaleString("en-IN") || "0"}
                            </span>
                            {booking.extraCharge > 0 && (
                              <p className="text-[9px] text-amber-500">+₹{booking.extraCharge} seat</p>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <button onClick={() => handleViewBooking(booking)} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors whitespace-nowrap">
                              <Eye size={13} /> View
                            </button>
                            <button onClick={() => printReceipt(booking)} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors whitespace-nowrap">
                              <Printer size={13} /> Print
                            </button>
                            <button onClick={() => downloadPDF(booking)} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors whitespace-nowrap">
                              <FileDown size={13} /> PDF
                            </button>
                            <button onClick={() => { setTimingBooking(booking); setNewTiming({ date: "", checkIn: "", checkOut: "" }); setShowTimingModal(true); }} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors whitespace-nowrap">
                              <Plus size={13} /> Timing
                            </button>
                            <button onClick={() => { setSelectedBooking(booking); setNewStatus(booking.status || 'pending'); setShowStatusModal(true); }} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-orange-50 text-orange-700 hover:bg-orange-100 transition-colors whitespace-nowrap">
                              <Edit size={13} /> Status
                            </button>
                            {isCashPending && (
                              <button onClick={() => {
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
                              }} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-yellow-50 text-yellow-700 hover:bg-yellow-100 transition-colors whitespace-nowrap">
                                <CreditCard size={13} /> Payment
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {!loading && filteredBookings.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-100 rounded-b-2xl flex flex-wrap items-center justify-between gap-2" style={{ backgroundColor: '#fafafa' }}>
              <span className="text-xs text-gray-500">
                Showing <strong>{filteredBookings.length}</strong> of <strong>{bookings.length}</strong> bookings
              </span>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Confirmed: {stats.confirmed}</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-500"></span> Active: {stats.active}</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500"></span> Pending: {stats.pending}</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Cancelled: {stats.cancelled}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* VIEW BOOKING MODAL */}
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
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Chamber</p>
                  <p className="mt-1 font-semibold text-gray-800">{viewBooking.cabin?.name || 'N/A'}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Customer</p>
                  <p className="mt-1 font-semibold text-gray-800">{viewBooking.name || viewBooking.user?.name || 'N/A'}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Mobile</p>
                  <p className="mt-1 font-semibold text-gray-800">{viewBooking.mobile || viewBooking.user?.mobile || 'N/A'}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email</p>
                  <p className="mt-1 font-semibold text-gray-800 text-sm break-all">{viewBooking.email || viewBooking.user?.email || 'N/A'}</p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Schedule</p>
                <p className="mt-1 font-semibold text-gray-800">From: {viewBooking.startDate || 'N/A'} {viewBooking.startTime || 'N/A'}</p>
                <p className="mt-0.5 font-semibold text-gray-800">To: {viewBooking.endDate || viewBooking.startDate || 'N/A'} {viewBooking.endTime || 'N/A'}</p>
                <p className="text-xs text-gray-500 mt-0.5">{viewBooking.totalHours}h • {viewBooking.bookingBasis === 'plan' ? 'Plan' : 'Hourly'}</p>
              </div>

              {/* Seats Section */}
              {viewBooking.selectedSeats && viewBooking.selectedSeats.length > 0 && (
                <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200">
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
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Subtotal</p>
                  <p className="mt-1 font-semibold text-gray-800">₹{viewBooking.subtotal?.toFixed(2) || '0'}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">GST (18%)</p>
                  <p className="mt-1 font-semibold text-gray-800">₹{viewBooking.gstAmount?.toFixed(2) || '0'}</p>
                </div>
              </div>

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
                          <span className="text-slate-600">{formatDate(timing.date)}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-medium text-emerald-600">IN: {timing.checkIn}</span>
                          <span className="text-xs font-medium text-red-500">OUT: {timing.checkOut}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Amount</p>
                  <p className="text-xl font-bold text-indigo-600 mt-1">₹{viewBooking.totalPrice?.toLocaleString('en-IN') || 0}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Created</p>
                  <p className="mt-1 font-semibold text-gray-800 text-sm">{formatDate(viewBooking.createdAt)}</p>
                </div>
              </div>

              {viewBooking.transactionId && (
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Transaction ID</p>
                  <p className="mt-1 font-mono text-xs text-gray-700 break-all">{viewBooking.transactionId}</p>
                </div>
              )}

              {viewBooking.paymentDetails?.screenshot && (
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Payment Screenshot</p>
                  <img src={`${API_URL}${viewBooking.paymentDetails.screenshot}`} alt="Payment Screenshot" className="mt-2 max-h-48 rounded-lg border border-gray-200" />
                </div>
              )}

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
                <div className="flex justify-between"><span className="text-gray-500">Chamber</span><span className="font-semibold">{paymentBooking.cabin?.name || 'N/A'}</span></div>
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
                <div className="flex justify-between"><span className="text-gray-500">Period</span><span className="font-medium">{timingBooking.startDate} - {timingBooking.endDate}</span></div>
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
                        <span className="text-gray-600">{formatDate(t.date)}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-600 font-medium">{t.checkIn}</span>
                          <span className="text-gray-300">-</span>
                          <span className="text-red-500 font-medium">{t.checkOut}</span>
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
    </div>
  );
};

export default ChamberBookings;