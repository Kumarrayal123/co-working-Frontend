// AdminBookings.jsx - Complete with ALL Fields from API Response + Owner Bookings API
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
  Stethoscope,
  Briefcase,
  Layers,
  CalendarDays,
  Wallet,
  Calculator,
  Info
} from "lucide-react";
import { toast } from "react-toastify";
import * as XLSX from 'xlsx';
import "./Dashboard.css";

const API_URL = "https://spaceapi.iryax.com";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [activeTab, setActiveTab] = useState('all');
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
    if (status === 'refunded') return { label: 'Refunded', color: 'bg-purple-100 text-purple-700' };
    if (status === 'failed') return { label: 'Failed', color: 'bg-red-100 text-red-700' };
    return { label: 'Pending', color: 'bg-yellow-100 text-yellow-700' };
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

  // FETCH BOOKINGS USING OWNER-BOOKINGS API
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please login to view bookings");
          navigate("/login");
          return;
        }

        const res = await axios.get(`${API_URL}/api/bookings/owner-bookings`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const bookingsData = res.data.bookings || [];
        console.log("✅ Owner Bookings fetched:", bookingsData.length);
        setBookings(bookingsData);
        calculateStats(bookingsData);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
        toast.error(err.response?.data?.error || "Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // ============================================================
  // DATE FORMATTING FUNCTIONS - All in dd/mm/yyyy format
  // ============================================================
  
  const formatDateDDMMYYYY = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
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

  const formatDateTimeDDMMYYYY = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
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

  const handleViewBooking = (booking) => {
    setViewBooking(booking);
    setShowViewModal(true);
  };

  // ✅ PROFESSIONAL BLACK & GRAY INVOICE - MATCHES MyBookings EXACTLY
  const downloadInvoice = (booking) => {
    try {
      const cabin = booking.cabin || {};
      const owner = cabin.owner || {};

      const win = window.open('', '_blank', 'width=900,height=700');
      if (!win) {
        toast.error('Please allow popups');
        return;
      }

      let seatListHtml = '';
      if (booking.selectedSeats && booking.selectedSeats.length > 0) {
        seatListHtml = booking.selectedSeats.map(s => 
          `<span style="display:inline-block;background:#f5f5f5;padding:4px 12px;border-radius:2px;margin:3px;font-size:11px;border:1px solid #e0e0e0;color:#333;">${s.name} (#${s.number})</span>`
        ).join('');
      }

      let slotsHtml = '';
      if (booking.bookingSlots && booking.bookingSlots.length > 0) {
        slotsHtml = booking.bookingSlots.map(s => 
          `<span style="display:inline-block;background:#f5f5f5;padding:2px 10px;border-radius:2px;margin:2px;font-size:10px;border:1px solid #e0e0e0;color:#333;">${formatDateDDMMYYYY(s.date)} ${s.startTime}-${s.endTime} (${s.hours}h)</span>`
        ).join('');
      }

      const status = getStatusBadge(booking.status);
      const pmtMethod = getPaymentMethodBadge(booking.paymentMethod);
      const pmtStatus = getPaymentStatusBadge(booking.paymentStatus);

      const ownerName = owner.name || owner.organizationName || 'IRYAX SPACE';
      const ownerAddress = owner.address || 'Premium Workspaces';

      win.document.write(`
        <html><head><title>Invoice</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Arial, sans-serif; 
            padding: 40px; 
            max-width: 900px; 
            margin: auto; 
            background: #f5f5f5; 
          }
          .invoice-wrapper { 
            background: #ffffff; 
            padding: 40px; 
            box-shadow: 0 2px 20px rgba(0,0,0,0.08); 
          }
          .header { 
            display: flex; 
            justify-content: space-between; 
            align-items: flex-start; 
            padding-bottom: 25px; 
            border-bottom: 2px solid #333333; 
            margin-bottom: 30px; 
          }
          .header-left h1 { 
            color: #000000; 
            font-size: 24px; 
            font-weight: 700; 
            margin: 0; 
            letter-spacing: -0.5px;
          }
          .header-left .subtitle { 
            color: #666666; 
            font-size: 12px; 
            margin-top: 4px; 
            letter-spacing: 0.5px;
          }
          .header-right { 
            text-align: right; 
          }
          .header-right .invoice-date { 
            font-size: 12px; 
            color: #666666; 
            margin-top: 2px;
          }
          .badge { 
            display: inline-block; 
            padding: 2px 10px; 
            border-radius: 2px; 
            font-size: 10px; 
            font-weight: 600; 
            text-transform: uppercase;
            letter-spacing: 0.3px;
          }
          .badge-pending { background: #f5f5f5; color: #666666; }
          .badge-confirmed { background: #e8f5e9; color: #2e7d32; }
          .badge-active { background: #e3f2fd; color: #1565c0; }
          .badge-completed { background: #e8f5e9; color: #2e7d32; }
          .badge-cancelled { background: #fce4ec; color: #c62828; }
          .info-grid { 
            display: grid; 
            grid-template-columns: 1fr 1fr; 
            gap: 20px; 
            background: #fafafa; 
            padding: 20px; 
            margin-bottom: 25px; 
            border: 1px solid #eeeeee;
          }
          .info-item .label { 
            font-size: 9px; 
            font-weight: 700; 
            color: #999999; 
            text-transform: uppercase; 
            letter-spacing: 0.5px; 
          }
          .info-item .value { 
            font-size: 14px; 
            font-weight: 600; 
            color: #000000; 
            margin-top: 3px; 
          }
          .info-item .sub-value {
            font-size: 12px;
            color: #666666;
            margin-top: 1px;
          }
          .section { 
            margin-bottom: 25px; 
          }
          .section-title { 
            font-size: 10px; 
            font-weight: 700; 
            color: #999999; 
            text-transform: uppercase; 
            letter-spacing: 0.5px; 
            margin-bottom: 10px; 
            border-bottom: 1px solid #eeeeee;
            padding-bottom: 6px;
          }
          .slots-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
            gap: 6px;
            margin-top: 8px;
          }
          .slots-grid .slot-item {
            background: #fafafa;
            padding: 6px 10px;
            border: 1px solid #eeeeee;
            font-size: 11px;
            color: #333333;
          }
          .slots-grid .slot-item .slot-date {
            font-weight: 600;
            color: #000000;
          }
          .seat-section { 
            background: #fafafa; 
            padding: 15px; 
            margin-bottom: 20px; 
            border: 1px solid #eeeeee; 
          }
          .seat-section .seat-title {
            font-size: 10px;
            font-weight: 700;
            color: #999999;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .seat-section .seat-list {
            margin-top: 8px;
          }
          .breakdown-table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 15px 0; 
          }
          .breakdown-table th { 
            text-align: left; 
            padding: 8px 0; 
            font-size: 9px; 
            font-weight: 700; 
            color: #999999; 
            text-transform: uppercase; 
            letter-spacing: 0.5px;
            border-bottom: 1px solid #eeeeee; 
          }
          .breakdown-table td { 
            padding: 8px 0; 
            border-bottom: 1px solid #f5f5f5; 
            font-size: 13px; 
            color: #333333; 
          }
          .breakdown-table .amount { 
            font-weight: 600; 
            text-align: right; 
          }
          .breakdown-table .total-row td { 
            font-weight: 700; 
            font-size: 16px; 
            border-top: 2px solid #333333; 
            padding-top: 12px; 
          }
          .breakdown-table .total-row .amount { 
            font-size: 18px; 
            color: #000000; 
          }
          .payment-details { 
            background: #fafafa; 
            padding: 15px; 
            margin: 15px 0; 
            border: 1px solid #eeeeee; 
          }
          .payment-details .detail-row { 
            display: flex; 
            justify-content: space-between; 
            padding: 3px 0; 
            font-size: 12px; 
            color: #333333; 
          }
          .payment-details .detail-row .label-text {
            color: #999999;
          }
          .status-section { 
            display: flex; 
            gap: 20px; 
            flex-wrap: wrap; 
            margin: 20px 0; 
            padding: 15px; 
            background: #fafafa; 
            border: 1px solid #eeeeee; 
          }
          .status-item { 
            display: flex; 
            align-items: center; 
            gap: 6px; 
            font-size: 12px; 
          }
          .status-item .label-text { 
            color: #999999; 
            font-weight: 500; 
          }
          .footer { 
            text-align: center; 
            margin-top: 30px; 
            padding-top: 20px; 
            border-top: 1px solid #eeeeee; 
            color: #999999; 
            font-size: 10px; 
            letter-spacing: 0.3px;
          }
          .footer .brand { 
            font-weight: 700; 
            color: #000000; 
          }
          .footer .powered {
            font-weight: 700;
            color: #000000;
            letter-spacing: 1px;
            font-size: 11px;
          }
          .space-type-badge {
            display: inline-block;
            background: #f0f0f0;
            padding: 2px 12px;
            border-radius: 2px;
            font-size: 11px;
            font-weight: 600;
            color: #555555;
            margin-top: 6px;
          }
          @media print { 
            body { background: #ffffff; padding: 20px; } 
            .invoice-wrapper { box-shadow: none; padding: 20px; } 
          }
        </style>
        </head><body>
        <div class="invoice-wrapper">
          <!-- HEADER -->
          <div class="header">
            <div class="header-left">
              <h1>${ownerName}</h1>
              <div class="subtitle">${ownerAddress}</div>
              <div style="margin-top:6px;">
                <span class="space-type-badge">${cabin.isChamber ? '🏥 MEDICAL CHAMBER' : '💼 CO-WORKING SPACE'}</span>
              </div>
            </div>
            <div class="header-right">
              <div style="font-size:13px;font-weight:700;color:#000000;letter-spacing:1px;">INVOICE</div>
              <div class="invoice-date">${formatDateDDMMYYYY(new Date().toISOString())}</div>
            </div>
          </div>

          <!-- BILL TO & CABIN -->
          <div class="info-grid">
            <div class="info-item">
              <div class="label">Bill To</div>
              <div class="value">${booking.name || booking.user?.name || 'Customer'}</div>
              <div class="sub-value">${booking.mobile || booking.user?.mobile || 'N/A'}</div>
              <div class="sub-value">${booking.email || booking.user?.email || 'N/A'}</div>
            </div>
            <div class="info-item">
              <div class="label">Space Details</div>
              <div class="value">${cabin.name || 'Unknown'}</div>
              <div class="sub-value">${cabin.address || 'N/A'}</div>
              <div class="sub-value">Capacity: ${cabin.capacity || 'N/A'} seats | Type: ${cabin.cabinType || 'Normal'}</div>
            </div>
          </div>

          <!-- SCHEDULE -->
          <div class="info-grid">
            <div class="info-item">
              <div class="label">Start</div>
              <div class="value">${formatDateDDMMYYYY(booking.startDate || booking.date)}</div>
              <div class="sub-value" style="color:#000000;font-weight:600;">${formatTime12(booking.startTime || booking.time)}</div>
            </div>
            <div class="info-item">
              <div class="label">End</div>
              <div class="value">${formatDateDDMMYYYY(booking.endDate || booking.startDate)}</div>
              <div class="sub-value" style="color:#000000;font-weight:600;">${formatTime12(booking.endTime)}</div>
            </div>
          </div>

          <!-- BOOKING INFO -->
          <div style="display:flex;gap:16px;flex-wrap:wrap;margin-bottom:20px;padding:12px 16px;background:#fafafa;border:1px solid #eeeeee;">
            <div><span style="color:#999999;font-size:10px;text-transform:uppercase;letter-spacing:0.3px;">Total Hours</span><br><strong>${booking.totalHours || 0}h</strong></div>
            <div><span style="color:#999999;font-size:10px;text-transform:uppercase;letter-spacing:0.3px;">Total Days</span><br><strong>${booking.totalDays || 0} days</strong></div>
            <div><span style="color:#999999;font-size:10px;text-transform:uppercase;letter-spacing:0.3px;">Daily Hours</span><br><strong>${booking.dailyHours?.join(', ') || 'N/A'}</strong></div>
            <div><span style="color:#999999;font-size:10px;text-transform:uppercase;letter-spacing:0.3px;">Booking Type</span><br><strong>${booking.bookingBasis || 'Hourly'}</strong></div>
            ${booking.selectedPlan ? `<div><span style="color:#999999;font-size:10px;text-transform:uppercase;letter-spacing:0.3px;">Plan</span><br><strong>${booking.selectedPlan.label || 'N/A'}</strong></div>` : ''}
          </div>

          <!-- SLOTS -->
          ${booking.bookingSlots && booking.bookingSlots.length > 0 ? `
            <div class="section">
              <div class="section-title">Booking Slots (${booking.bookingSlots.length} days)</div>
              <div class="slots-grid">
                ${booking.bookingSlots.map(s => `
                  <div class="slot-item">
                    <div class="slot-date">${formatDateDDMMYYYY(s.date)}</div>
                    <div>${s.startTime} - ${s.endTime}</div>
                    <div style="font-size:10px;color:#999999;">${s.hours}h</div>
                  </div>
                `).join('')}
              </div>
              <div style="margin-top:8px;font-size:11px;color:#666666;">Daily Hours: ${booking.dailyHours?.join(', ') || 'N/A'}h</div>
            </div>
          ` : ''}

          <!-- SEATS -->
          ${booking.selectedSeats && booking.selectedSeats.length > 0 ? `
            <div class="seat-section">
              <div class="seat-title">Selected Seats (${booking.seatCount})</div>
              <div class="seat-list">${seatListHtml}</div>
              <div style="margin-top:6px;font-size:11px;color:#666666;">Extra Charge: ₹${booking.extraCharge || 0}</div>
            </div>
          ` : ''}

          <!-- PRICE BREAKDOWN -->
          <div class="section">
            <div class="section-title">Price Breakdown</div>
            <table class="breakdown-table">
              <thead>
                <tr><th>Description</th><th style="text-align:right;">Amount</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td>Subtotal (${booking.totalHours || 0}h × ₹${cabin.price || 0})</td>
                  <td class="amount">₹${(booking.subtotal || 0).toFixed(2)}</td>
                </tr>
                ${booking.extraCharge > 0 ? `
                  <tr>
                    <td>Seat Charges (${booking.seatCount} seats × ₹${booking.seatExtraChargePerSeat || 100})</td>
                    <td class="amount">₹${(booking.extraCharge || 0).toFixed(2)}</td>
                  </tr>
                ` : ''}
                <tr>
                  <td>GST (${(booking.gstRate || 0.18) * 100}%)</td>
                  <td class="amount">₹${(booking.gstAmount || 0).toFixed(2)}</td>
                </tr>
                <tr class="total-row">
                  <td>Total Amount</td>
                  <td class="amount">₹${(booking.totalPrice || booking.amount || 0).toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- PAYMENT DETAILS -->
          ${booking.transactionId || booking.paymentDetails?.transactionId ? `
            <div class="payment-details">
              <div style="font-size:9px;font-weight:700;color:#999999;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;">Payment Details</div>
              <div class="detail-row"><span class="label-text">Transaction ID</span> <strong>${booking.transactionId || booking.paymentDetails?.transactionId || 'N/A'}</strong></div>
              ${booking.paymentDetails?.upiId ? `<div class="detail-row"><span class="label-text">UPI ID</span> <strong>${booking.paymentDetails.upiId}</strong></div>` : ''}
              ${booking.paymentDetails?.upiApp ? `<div class="detail-row"><span class="label-text">UPI App</span> <strong>${booking.paymentDetails.upiApp}</strong></div>` : ''}
              ${booking.paymentDetails?.cardNumber ? `<div class="detail-row"><span class="label-text">Card</span> <strong>•••• ${booking.paymentDetails.cardNumber.slice(-4)}</strong></div>` : ''}
              <div class="detail-row"><span class="label-text">Payment Mode</span> <strong>${pmtMethod.label}</strong></div>
            </div>
          ` : ''}

          <!-- STATUS -->
          <div class="status-section">
            <div class="status-item"><span class="label-text">Status</span> <span class="badge badge-${booking.status}">${status.label}</span></div>
            <div class="status-item"><span class="label-text">Payment</span> <span class="badge badge-${booking.paymentStatus === 'paid' ? 'confirmed' : 'pending'}">${pmtStatus.label}</span></div>
            <div class="status-item"><span class="label-text">Payment Method</span> <span style="font-weight:600;color:#333333;font-size:12px;">${pmtMethod.label}</span></div>
            ${booking.isPaidToOwner ? `<div class="status-item"><span class="label-text">Paid to Owner</span> <span style="font-weight:600;color:#2e7d32;font-size:12px;">Yes</span></div>` : ''}
          </div>

          <!-- VISIT LOG -->
          ${booking.visitingTimings && booking.visitingTimings.length > 0 ? `
            <div style="background:#fafafa;padding:12px 16px;margin:10px 0;border:1px solid #eeeeee;">
              <div style="font-size:9px;font-weight:700;color:#999999;text-transform:uppercase;letter-spacing:0.5px;">Visit Log (${booking.visitingTimings.length} entries)</div>
              ${booking.visitingTimings.map((t, i) => `
                <div style="display:flex;justify-content:space-between;font-size:12px;padding:4px 0;border-bottom:1px solid #f0f0f0;color:#333333;">
                  <span>Day ${i+1}: ${formatDateDDMMYYYY(t.date)}</span>
                  <span>${formatTime12(t.checkIn)} - ${formatTime12(t.checkOut)}</span>
                </div>
              `).join('')}
            </div>
          ` : ''}

          <!-- FOOTER -->
          <div class="footer">
            <span class="brand">${ownerName}</span> — ${ownerAddress}<br>
            Created: ${formatDateTimeDDMMYYYY(booking.createdAt)}<br>
            <div style="margin-top:6px;padding-top:6px;border-top:1px solid #eeeeee;">
              <span class="powered">POWERED BY IRYAX SPACE</span>
            </div>
          </div>
        </div>
        </body></html>
      `);
      win.document.close();
      win.focus();
      toast.success('Invoice generated! Click Print to save as PDF.');
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate invoice');
    }
  };

  const exportToExcel = () => {
    try {
      if (displayBookings.length === 0) { toast.warning("No bookings to export"); return; }
      const exportData = displayBookings.map((booking, index) => {
        const statusBadge = getStatusBadge(booking.status);
        const paymentMethod = getPaymentMethodBadge(booking.paymentMethod);
        const paymentStatus = getPaymentStatusBadge(booking.paymentStatus);
        return {
          'S.No': index + 1,
          'Booking ID': booking._id?.slice(-8).toUpperCase() || 'N/A',
          'Type': booking.bookingType || 'booking',
          'Basis': booking.bookingBasis === 'plan' ? 'Plan' : 'Hourly',
          'Space Name': booking.cabin?.name || 'Unknown Cabin',
          'Address': booking.cabin?.address || 'No Address',
          'Space Type': booking.cabin?.isChamber ? 'Medical Chamber' : 'Co-Working Space',
          'Customer Name': booking.name || booking.user?.name || 'Unknown Guest',
          'Mobile': booking.mobile || booking.user?.mobile || 'N/A',
          'Email': booking.email || booking.user?.email || 'N/A',
          'From Date': formatDateDDMMYYYY(booking.startDate),
          'From Time': formatTime12(booking.startTime),
          'To Date': formatDateDDMMYYYY(booking.endDate),
          'To Time': formatTime12(booking.endTime),
          'Total Hours': booking.totalHours || 0,
          'Total Days': booking.totalDays || 0,
          'Daily Hours': booking.dailyHours?.join(', ') || 'N/A',
          'Slots': booking.bookingSlots?.map(s => `${formatDateDDMMYYYY(s.date)} ${s.startTime}-${s.endTime}`).join('; ') || 'N/A',
          'Subtotal (₹)': booking.subtotal || 0,
          'GST (18%)': booking.gstAmount || 0,
          'Total (₹)': booking.totalPrice || 0,
          'Seats': booking.seatCount || 0,
          'Seat Names': booking.selectedSeats?.map(s => s.name).join(', ') || 'N/A',
          'Extra Charge': booking.extraCharge || 0,
          'Status': statusBadge.label,
          'Payment Method': paymentMethod.label,
          'Payment Status': paymentStatus.label,
          'Transaction ID': booking.transactionId || 'N/A',
          'UPI ID': booking.paymentDetails?.upiId || 'N/A',
          'UPI App': booking.paymentDetails?.upiApp || 'N/A',
          'Check-in': booking.checkInTime || 'N/A',
          'Check-out': booking.checkOutTime || 'N/A',
          'Visits': booking.visitingTimings?.length || 0,
          'Created At': formatDateTimeDDMMYYYY(booking.createdAt)
        };
      });
      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Admin_Bookings');
      const date = new Date().toISOString().split('T')[0];
      XLSX.writeFile(wb, `admin_bookings_${date}.xlsx`);
      toast.success(`Exported ${displayBookings.length} bookings to Excel!`);
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export bookings");
    }
  };

  const clearFilters = () => {
    setFilters({ status: 'all', paymentStatus: 'all', paymentMethod: 'all' });
    setSearchTerm('');
    setFilterDateFrom('');
    setFilterDateTo('');
  };

  // FILTERED BOOKINGS
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch = b.cabin?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.cabin?.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.mobile?.includes(searchTerm) ||
      b.user?.mobile?.includes(searchTerm);

    const matchesDateFrom = filterDateFrom ? b.startDate >= filterDateFrom : true;
    const matchesDateTo = filterDateTo ? b.startDate <= filterDateTo : true;

    const matchesStatus = filters.status === 'all' || b.status === filters.status;
    const matchesPaymentStatus = filters.paymentStatus === 'all' || b.paymentStatus === filters.paymentStatus;
    const matchesPaymentMethod = filters.paymentMethod === 'all' || b.paymentMethod === filters.paymentMethod;
    return matchesSearch && matchesDateFrom && matchesDateTo && matchesStatus && matchesPaymentStatus && matchesPaymentMethod;
  });

  // TAB BASED FILTERING
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

  // Stats for counts
  const totalCount = bookings.length;
  const visitCount = bookings.filter(b => b.bookingType === 'visit').length;
  const spaceCount = bookings.filter(b => b.bookingType !== 'visit').length;

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
              Admin <span>Bookings</span>
            </h1>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 mb-6">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-4 sm:p-5 text-white shadow-lg shadow-indigo-500/25">
            <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-200">Total</p>
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
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-purple-600">Visits</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">{visitCount}</p>
              </div>
              <div className="bg-purple-100 p-2.5 rounded-xl">
                <Calendar size={20} className="text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 mb-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="date"
                value={filterDateFrom}
                onChange={(e) => setFilterDateFrom(e.target.value)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                placeholder="From date"
              />
              <input
                type="date"
                value={filterDateTo}
                onChange={(e) => setFilterDateTo(e.target.value)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                placeholder="To date"
              />
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
              >
                <option value="all">All Bookings ({totalCount})</option>
                <option value="visits">Site Visits ({visitCount})</option>
                <option value="spaces">Space Bookings ({spaceCount})</option>
              </select>
              <select
                value={filters.paymentStatus}
                onChange={(e) => setFilters({...filters, paymentStatus: e.target.value})}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
              >
                <option value="all">Payment Status</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
              <select
                value={filters.paymentMethod}
                onChange={(e) => setFilters({...filters, paymentMethod: e.target.value})}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
              >
                <option value="all">Payment Method</option>
                <option value="online">Online</option>
                <option value="cash">Cash</option>
                <option value="counter">Counter</option>
                <option value="upi">UPI</option>
                <option value="card">Card</option>
              </select>
              {(filters.status !== 'all' || filters.paymentStatus !== 'all' || filters.paymentMethod !== 'all' || filterDateFrom || filterDateTo || searchTerm) && (
                <button
                  onClick={clearFilters}
                  className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
                  title="Clear filters"
                >
                  <XCircleIcon size={16} />
                </button>
              )}
              {displayBookings.length > 0 && (
                <button
                  onClick={exportToExcel}
                  className="flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium hover:bg-indigo-100 transition"
                  title="Export to Excel"
                >
                  <Download size={14} />
                </button>
              )}
            </div>
          </div>
          <div className="mt-1.5 text-[10px] text-gray-400">
            Showing {displayBookings.length} of {bookings.length} bookings
          </div>
        </div>

        {/* TAB SWITCHER */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 mt-4 mb-4 flex">
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
          <div className="admin-dash__card-body p-0 overflow-x-auto" style={{ backgroundColor: '#ffffff' }}>
            {displayBookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-20 text-gray-400">
                <Calendar size={48} className="opacity-20" />
                <p className="text-lg font-medium">No bookings found</p>
                <p className="text-sm">Try adjusting your filters.</p>
              </div>
            ) : (
              <table className="w-full min-w-[1700px] text-left">
                <thead>
                  <tr className="border-b border-gray-100" style={{ backgroundColor: '#f9fafb' }}>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">S.No</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Space</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Type</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Customer</th>
                    {activeTab === 'visits' ? (
                      <>
                        <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Visit Date</th>
                        <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Visit Time</th>
                        <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Status</th>
                        <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Created At</th>
                        <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap text-center">Actions</th>
                      </>
                    ) : (
                      <>
                        <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Start</th>
                        <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">End</th>
                        <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Hours</th>
                        <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Days</th>
                        <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Seats</th>
                        <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Status</th>
                        <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Payment</th>
                        <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Pmt Status</th>
                        <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Visits</th>
                        <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Amount</th>
                        <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap text-center">Actions</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {displayBookings.map((booking, idx) => {
                    const statusBadge = getStatusBadge(booking.status);
                    const paymentMethodBadge = getPaymentMethodBadge(booking.paymentMethod);
                    const paymentStatusBadge = getPaymentStatusBadge(booking.paymentStatus);
                    const visitCount = booking.visitingTimings?.length || 0;
                    const isCashPending = (booking.paymentMethod === 'cash' || booking.paymentMethod === 'counter') && booking.paymentStatus === 'pending';
                    const seatCount = booking.seatCount || 0;
                    const seatNames = booking.selectedSeats?.map(s => s.name).join(', ') || 'N/A';
                    const isVisit = booking.bookingType === 'visit';
                    const isChamber = booking.cabin?.isChamber || false;
                    const totalDays = booking.totalDays || 0;

                    return (
                      <tr key={booking._id} className="transition-colors group hover:bg-gray-50/80">
                        <td className="p-4"><span className="text-sm font-semibold text-gray-400">{idx + 1}</span></td>
                        <td className="p-4">
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{booking.cabin?.name || "Unknown"}</p>
                            <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                              <MapPin size={12} className="text-indigo-500" />
                              {booking.cabin?.address?.split(",")[0] || "No Address"}
                            </div>
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
                          <div>
                            <p className="font-medium text-gray-800 text-sm">{booking.name || booking.user?.name || "Unknown"}</p>
                            <p className="text-xs text-gray-400">{booking.mobile || booking.user?.mobile || "N/A"}</p>
                          </div>
                        </td>

                        {isVisit ? (
                          <>
                            <td className="p-4">
                              <span className="text-sm text-gray-900 font-medium">{formatDateDDMMYYYY(booking.startDate)}</span>
                            </td>
                            <td className="p-4">
                              <span className="text-sm text-gray-500">{formatTime12(booking.startTime)}</span>
                            </td>
                            <td className="p-4">
                              <span className={`px-3 py-1 text-xs font-bold rounded-full inline-flex items-center gap-1.5 ${statusBadge.color}`}>
                                {statusBadge.icon} {statusBadge.label}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className="text-[10px] text-gray-500 font-medium">{formatDateTimeDDMMYYYY(booking.createdAt)}</span>
                            </td>
                            <td className="p-4 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button onClick={() => handleViewBooking(booking)} className="p-2 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors" title="View Details">
                                  <Eye size={16} />
                                </button>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="p-4">
                              <div className="space-y-1">
                                <p className="text-sm text-gray-900 font-medium">{formatDateDDMMYYYY(booking.startDate)}</p>
                                <p className="text-[10px] text-indigo-600 font-medium">{formatTime12(booking.startTime)}</p>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="space-y-1">
                                <p className="text-sm text-gray-900 font-medium">{formatDateDDMMYYYY(booking.endDate)}</p>
                                <p className="text-[10px] text-indigo-600 font-medium">{formatTime12(booking.endTime)}</p>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold">{booking.totalHours}h</span>
                            </td>
                            <td className="p-4">
                              <span className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-bold">{totalDays}d</span>
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
                              <div className="flex items-center gap-1.5">
                                <button onClick={() => handleViewBooking(booking)} className="p-2 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors" title="View Details">
                                  <Eye size={16} />
                                </button>
                                <button onClick={() => downloadInvoice(booking)} className="p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors" title="Download Invoice">
                                  <Receipt size={16} />
                                </button>
                                <button onClick={() => { setSelectedBooking(booking); setNewStatus(booking.status || 'pending'); setShowStatusModal(true); }} className="p-2 rounded-lg bg-orange-50 text-orange-700 hover:bg-orange-100 transition-colors" title="Update Status">
                                  <Edit size={16} />
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
                                  }} className="p-2 rounded-lg bg-yellow-50 text-yellow-700 hover:bg-yellow-100 transition-colors" title="Update Payment">
                                    <CreditCard size={16} />
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

          {!loading && displayBookings.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-100 rounded-b-2xl flex flex-wrap items-center justify-between gap-2" style={{ backgroundColor: '#fafafa' }}>
              <span className="text-xs text-gray-500">
                Showing <strong>{displayBookings.length}</strong> of <strong>{bookings.length}</strong> bookings
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
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1">
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
                  <p className="mt-1 font-semibold text-gray-800">{formatDateDDMMYYYY(viewBooking.startDate)}</p>
                  <p className="text-sm font-medium text-indigo-600">{formatTime12(viewBooking.startTime)}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">End</p>
                  <p className="mt-1 font-semibold text-gray-800">{formatDateDDMMYYYY(viewBooking.endDate)}</p>
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
                        <p className="text-xs font-bold text-gray-700">{formatDateDDMMYYYY(slot.date)}</p>
                        <p className="text-[10px] text-gray-500">{slot.startTime} - {slot.endTime}</p>
                        <p className="text-[10px] font-bold text-indigo-600">{slot.hours}h</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Seats */}
              {viewBooking.selectedSeats && viewBooking.selectedSeats.length > 0 && (
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                  <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-2">
                    <Armchair size={14} />
                    Selected Seats ({viewBooking.seatCount})
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {viewBooking.selectedSeats.map((seat) => (
                      <span key={seat._id} className="px-3 py-1.5 bg-white rounded-lg border border-emerald-200 text-sm font-medium text-gray-700">
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
                          <span className="text-slate-600">{formatDateDDMMYYYY(timing.date)}</span>
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
              <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
                <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-2 mb-3">
                  <Calculator size={14} /> Price Breakdown
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center border-b border-emerald-100 pb-1.5">
                    <span className="text-gray-600">Subtotal ({viewBooking.totalHours || 0}h × ₹{viewBooking.cabin?.price || 0})</span>
                    <span className="font-semibold text-gray-800">₹{(viewBooking.subtotal || 0).toFixed(2)}</span>
                  </div>
                  {viewBooking.extraCharge > 0 && (
                    <div className="flex justify-between items-center border-b border-emerald-100 pb-1.5">
                      <span className="text-gray-600">Seat Charges ({viewBooking.seatCount} × ₹{viewBooking.seatExtraChargePerSeat || 100})</span>
                      <span className="font-semibold text-amber-600">₹{(viewBooking.extraCharge || 0).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center border-b border-emerald-100 pb-1.5">
                    <span className="text-gray-600">GST ({(viewBooking.gstRate || 0.18) * 100}%)</span>
                    <span className="font-semibold text-gray-800">₹{(viewBooking.gstAmount || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t-2 border-emerald-300">
                    <span className="font-bold text-gray-800">Total Amount</span>
                    <span className="text-xl font-bold text-emerald-700">₹{(viewBooking.totalPrice || viewBooking.amount || 0).toFixed(2)}</span>
                  </div>
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
                        <span className="font-medium text-gray-800">{formatDateDDMMYYYY(viewBooking.paymentDetails.paymentDate)}</span>
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

              {/* Status */}
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

              <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-200">
                <button
                  onClick={() => { setShowViewModal(false); downloadInvoice(viewBooking); }}
                  className="flex-1 min-w-[120px] py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-sm active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Receipt size={16} /> Invoice
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
    </div>
  );
}

export default AdminBookings;