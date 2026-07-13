// CabinBookings.jsx - Complete with Visiting Timings
import React, { useEffect, useState } from "react";
import axios from "axios";
import UsersNavbar from "./UsersNavbar";
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
  History
} from "lucide-react";
import { toast } from "react-toastify";
import * as XLSX from 'xlsx';
import "./Dashboard.css";

const API_URL = "http://62.72.29.27:5003";

const CabinBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const isAdmin = localStorage.getItem("admin") !== null;

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [updating, setUpdating] = useState(false);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentBooking, setPaymentBooking] = useState(null);
  const [newPaymentStatus, setNewPaymentStatus] = useState("");
  const [amountPaid, setAmountPaid] = useState(0);
  const [updatingPayment, setUpdatingPayment] = useState(false);

  const [showViewModal, setShowViewModal] = useState(false);
  const [viewBooking, setViewBooking] = useState(null);

  // ✅ Visiting Timings Modal
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
        color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
        icon: <ClockIcon size={12} className="text-yellow-500" />
      },
      confirmed: {
        label: 'Confirmed',
        color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        icon: <CheckCircle size={12} className="text-emerald-500" />
      },
      active: {
        label: 'Active',
        color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        icon: <Timer size={12} className="text-indigo-500" />
      },
      completed: {
        label: 'Completed',
        color: 'bg-blue-50 text-blue-700 border-blue-200',
        icon: <CheckCircle size={12} className="text-blue-500" />
      },
      cancelled: {
        label: 'Cancelled',
        color: 'bg-red-50 text-red-700 border-red-200',
        icon: <XCircle size={12} className="text-red-500" />
      }
    };
    const defaultStatus = {
      label: status || 'Unknown',
      color: 'bg-gray-50 text-gray-700 border-gray-200',
      icon: <AlertCircle size={12} className="text-gray-500" />
    };
    return statusMap[status?.toLowerCase()] || defaultStatus;
  };

  const getPaymentMethodBadge = (method) => {
    if (method === 'cash' || method === 'counter') {
      return {
        label: 'Cash',
        color: 'bg-orange-50 text-orange-700 border-orange-200',
        icon: <Store size={12} className="text-orange-500" />
      };
    }
    return {
      label: 'Online',
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: <CreditCard size={12} className="text-blue-500" />
    };
  };

  const getPaymentStatusBadge = (status) => {
    if (status === 'paid') {
      return {
        label: 'Paid',
        color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        icon: <CheckCircle size={12} className="text-emerald-500" />
      };
    }
    if (status === 'refunded') {
      return {
        label: 'Refunded',
        color: 'bg-purple-50 text-purple-700 border-purple-200',
        icon: <XCircle size={12} className="text-purple-500" />
      };
    }
    if (status === 'failed') {
      return {
        label: 'Failed',
        color: 'bg-red-50 text-red-700 border-red-200',
        icon: <XCircle size={12} className="text-red-500" />
      };
    }
    return {
      label: 'Pending',
      color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      icon: <ClockIcon size={12} className="text-yellow-500" />
    };
  };

  const calculateStats = (bookingsData) => {
    const total = bookingsData.length;
    const confirmed = bookingsData.filter(b => b.status === 'confirmed').length;
    const active = bookingsData.filter(b => b.status === 'active').length;
    const completed = bookingsData.filter(b => b.status === 'completed').length;
    const cancelled = bookingsData.filter(b => b.status === 'cancelled').length;
    const pending = bookingsData.filter(b => b.status === 'pending').length;
    
    const totalRevenue = bookingsData.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    const confirmedRevenue = bookingsData
      .filter(b => b.status === 'confirmed')
      .reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    const completedRevenue = bookingsData
      .filter(b => b.status === 'completed')
      .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

    setStats({
      totalBookings: total,
      confirmed,
      active,
      completed,
      cancelled,
      pending,
      totalRevenue,
      confirmedRevenue,
      completedRevenue
    });
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }
        const res = await axios.get(
          `${API_URL}/api/bookings/owner-bookings`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const bookingsData = res.data.bookings || [];
        setBookings(bookingsData);
        calculateStats(bookingsData);
      } catch (err) {
        console.error("Failed to fetch owner bookings:", err);
        toast.error("Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  // ======================
  // UPDATE BOOKING STATUS
  // ======================
  const handleUpdateStatus = async () => {
    if (!selectedBooking || !newStatus) {
      toast.error("Please select a status");
      return;
    }
    
    setUpdating(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_URL}/api/bookings/update-status/${selectedBooking._id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        const updatedBookings = bookings.map(b =>
          b._id === selectedBooking._id ? { ...b, status: newStatus } : b
        );
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
      console.error("Update status error:", error);
      toast.error(error.response?.data?.error || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  // ======================
  // UPDATE PAYMENT STATUS
  // ======================
  const handleUpdatePaymentStatus = async () => {
    if (!paymentBooking || !newPaymentStatus) {
      toast.error("Please select a payment status");
      return;
    }
    
    if (newPaymentStatus === 'paid' && (!amountPaid || amountPaid <= 0)) {
      toast.error("Please enter amount paid");
      return;
    }
    
    setUpdatingPayment(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_URL}/api/bookings/bookingpayment-status/${paymentBooking._id}`,
        { 
          paymentStatus: newPaymentStatus,
          amountPaid: amountPaid || paymentBooking.totalPrice 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        const updatedBookings = bookings.map(b =>
          b._id === paymentBooking._id ? { ...b, paymentStatus: newPaymentStatus } : b
        );
        setBookings(updatedBookings);
        calculateStats(updatedBookings);

        toast.success(`Payment status updated to ${newPaymentStatus}`);
        setShowPaymentModal(false);
        setPaymentBooking(null);
        setNewPaymentStatus("");
        setAmountPaid(0);
      } else {
        toast.error(response.data.error || "Failed to update payment status");
      }
    } catch (error) {
      console.error("Update payment status error:", error);
      toast.error(error.response?.data?.error || "Failed to update payment status");
    } finally {
      setUpdatingPayment(false);
    }
  };

  // ======================
  // UPDATE VISITING TIMINGS
  // ======================
  const handleAddTiming = async () => {
    if (!timingBooking || !newTiming.date || !newTiming.checkIn || !newTiming.checkOut) {
      toast.error("Please fill all timing fields");
      return;
    }

    setUpdatingTiming(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_URL}/api/bookings/update-timings/${timingBooking._id}`,
        { 
          date: newTiming.date,
          checkIn: newTiming.checkIn,
          checkOut: newTiming.checkOut
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        const updatedBookings = bookings.map(b =>
          b._id === timingBooking._id ? { ...b, visitingTimings: response.data.booking.visitingTimings } : b
        );
        setBookings(updatedBookings);

        toast.success("Timing added successfully!");
        setShowTimingModal(false);
        setTimingBooking(null);
        setNewTiming({ date: "", checkIn: "", checkOut: "" });
        
        // Refresh bookings
        const res = await axios.get(
          `${API_URL}/api/bookings/owner-bookings`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBookings(res.data.bookings || []);
        calculateStats(res.data.bookings || []);
      }
    } catch (error) {
      console.error("Update timing error:", error);
      toast.error(error.response?.data?.error || "Failed to update timing");
    } finally {
      setUpdatingTiming(false);
    }
  };

  const handleDeleteTiming = async (bookingId, timingIndex) => {
    if (!window.confirm("Are you sure you want to delete this timing entry?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_URL}/api/bookings/delete-timing/${bookingId}`,
        { timingIndex },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        const updatedBookings = bookings.map(b =>
          b._id === bookingId ? { ...b, visitingTimings: response.data.booking.visitingTimings } : b
        );
        setBookings(updatedBookings);

        toast.success("Timing deleted successfully!");
        
        const res = await axios.get(
          `${API_URL}/api/bookings/owner-bookings`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBookings(res.data.bookings || []);
        calculateStats(res.data.bookings || []);
      }
    } catch (error) {
      console.error("Delete timing error:", error);
      toast.error(error.response?.data?.error || "Failed to delete timing");
    }
  };

  const handleViewBooking = (booking) => {
    setViewBooking(booking);
    setShowViewModal(true);
  };

  const exportToExcel = () => {
    try {
      if (filteredBookings.length === 0) {
        toast.warning("No bookings to export");
        return;
      }

      const exportData = filteredBookings.map((booking, index) => {
        const statusBadge = getStatusBadge(booking.status);
        const paymentMethod = getPaymentMethodBadge(booking.paymentMethod);
        const paymentStatus = getPaymentStatusBadge(booking.paymentStatus);
        return {
          'S.No': index + 1,
          'Booking Type': booking.bookingBasis === 'plan' ? 'Plan Booking' : 'Hourly Booking',
          'Cabin Name': booking.cabinId?.name || 'Unknown Cabin',
          'Address': booking.cabinId?.address || 'No Address',
          'Customer Name': booking.name || booking.userId?.name || 'Unknown Guest',
          'Mobile': booking.mobile || booking.userId?.mobile || 'N/A',
          'Email': booking.email || booking.userId?.email || 'N/A',
          'Start Date': booking.startDate || 'N/A',
          'Start Time': booking.startTime || 'N/A',
          'End Date': booking.endDate || 'N/A',
          'End Time': booking.endTime || 'N/A',
          'Duration (Hours)': booking.totalHours || 0,
          'Subtotal (₹)': booking.subtotal || 0,
          'GST (18%)': booking.gstAmount || 0,
          'Total (₹)': booking.totalPrice || 0,
          'Status': statusBadge.label,
          'Payment Method': paymentMethod.label,
          'Payment Status': paymentStatus.label,
          'Transaction ID': booking.transactionId || 'N/A',
          'Visiting Days': booking.visitingTimings?.length || 0
        };
      });

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Cabin_Bookings');
      
      const date = new Date().toISOString().split('T')[0];
      XLSX.writeFile(wb, `cabin_bookings_${date}.xlsx`);
      
      toast.success(`Exported ${filteredBookings.length} bookings to Excel!`);
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export bookings");
    }
  };

  // ======================
  // PROFESSIONAL INVOICE DOWNLOAD
  // ======================
  const downloadInvoice = (booking) => {
    try {
      const cabin = booking.cabinId || {};
      const cabinName = cabin.name || 'Unknown Cabin';
      const cabinAddress = cabin.address || 'N/A';
      
      const amount = booking.totalPrice || 0;
      const subtotal = booking.subtotal || 0;
      const gstAmount = booking.gstAmount || 0;
      const orderId = booking._id.slice(-8).toUpperCase();
      const startDate = booking.startDate || 'N/A';
      const startTime = booking.startTime || 'N/A';
      const endDate = booking.endDate || 'N/A';
      const endTime = booking.endTime || 'N/A';
      const status = booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1) || 'N/A';
      const paymentStatus = booking.paymentStatus === 'paid' ? 'Paid' : 'Pending';
      const paymentMethod = booking.paymentMethod === 'cash' || booking.paymentMethod === 'counter' ? 'Cash' : 'Online';
      const totalHours = booking.totalHours || 0;
      const customerName = booking.name || booking.userId?.name || 'Customer';
      const customerMobile = booking.mobile || booking.userId?.mobile || 'N/A';
      const customerEmail = booking.email || booking.userId?.email || 'N/A';
      const transactionId = booking.transactionId || 'N/A';
      const today = new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });

      const visitingTimings = booking.visitingTimings || [];

      const invoiceHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Invoice #${orderId}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: 'Times New Roman', 'Georgia', serif;
              background: #ffffff;
              padding: 40px;
              display: flex;
              justify-content: center;
              min-height: 100vh;
              color: #000000;
            }
            .invoice-container {
              max-width: 800px;
              width: 100%;
              background: #ffffff;
              border: 2px solid #000000;
              padding: 40px 45px;
            }
            .invoice-header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              border-bottom: 3px double #000000;
              padding-bottom: 20px;
              margin-bottom: 25px;
            }
            .brand h1 {
              font-size: 28px;
              font-weight: 700;
              letter-spacing: 2px;
              text-transform: uppercase;
              color: #1a56db;
            }
            .brand .gst {
              font-size: 11px;
              color: #666666;
              margin-top: 2px;
            }
            .brand .address-line {
              font-size: 11px;
              color: #666666;
              margin-top: 2px;
            }
            .invoice-number {
              text-align: right;
            }
            .invoice-number .label {
              font-size: 10px;
              text-transform: uppercase;
              letter-spacing: 1px;
              color: #666666;
            }
            .invoice-number .number {
              font-size: 22px;
              font-weight: 700;
              color: #000000;
              margin-top: 2px;
            }
            .invoice-number .date {
              font-size: 12px;
              color: #333333;
              margin-top: 4px;
            }
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 30px;
              margin-bottom: 25px;
              padding-bottom: 20px;
              border-bottom: 1px solid #cccccc;
            }
            .info-group .title {
              font-size: 10px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 1px;
              color: #666666;
              margin-bottom: 6px;
            }
            .info-group .value {
              font-size: 14px;
              font-weight: 600;
              color: #000000;
              line-height: 1.6;
            }
            .info-group .value-small {
              font-size: 12px;
              font-weight: 400;
              color: #333333;
            }
            .info-group .address-line {
              font-size: 12px;
              color: #333333;
              margin-top: 2px;
            }
            .invoice-table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0 25px;
            }
            .invoice-table thead {
              border-top: 2px solid #000000;
              border-bottom: 2px solid #000000;
            }
            .invoice-table thead th {
              padding: 10px 12px;
              text-align: left;
              font-size: 10px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 1px;
              color: #000000;
            }
            .invoice-table thead th:last-child {
              text-align: right;
            }
            .invoice-table tbody td {
              padding: 10px 12px;
              font-size: 13px;
              color: #000000;
              border-bottom: 1px solid #eeeeee;
            }
            .invoice-table tbody td:last-child {
              text-align: right;
              font-weight: 600;
            }
            .invoice-table tbody tr:last-child td {
              border-bottom: none;
            }
            .totals {
              margin-top: 20px;
              padding-top: 20px;
              border-top: 2px solid #000000;
              display: flex;
              justify-content: flex-end;
            }
            .totals-box {
              width: 320px;
            }
            .totals-row {
              display: flex;
              justify-content: space-between;
              padding: 6px 0;
              font-size: 13px;
              color: #333333;
            }
            .totals-row.total {
              font-size: 20px;
              font-weight: 700;
              color: #000000;
              border-top: 2px solid #000000;
              padding-top: 12px;
              margin-top: 6px;
            }
            .status-row {
              display: flex;
              gap: 30px;
              margin-top: 15px;
              padding-top: 15px;
              border-top: 1px solid #cccccc;
              flex-wrap: wrap;
            }
            .status-row .item {
              font-size: 12px;
            }
            .status-row .item .label {
              color: #666666;
              text-transform: uppercase;
              font-weight: 700;
              font-size: 9px;
              letter-spacing: 0.5px;
            }
            .status-row .item .value {
              font-weight: 600;
              color: #000000;
              margin-top: 2px;
            }
            .footer {
              text-align: center;
              padding-top: 25px;
              margin-top: 25px;
              border-top: 2px solid #000000;
            }
            .footer .powered {
              font-size: 14px;
              font-weight: 700;
              letter-spacing: 2px;
              color: #1a56db;
            }
            .footer .powered span {
              color: #1a56db;
            }
            .footer .sub {
              font-size: 10px;
              color: #666666;
              margin-top: 4px;
            }
            .print-btn {
              position: fixed;
              bottom: 30px;
              right: 30px;
              padding: 14px 28px;
              background: #000000;
              color: #ffffff;
              border: none;
              border-radius: 4px;
              font-weight: 600;
              font-size: 13px;
              cursor: pointer;
              box-shadow: 0 4px 20px rgba(0,0,0,0.15);
              display: flex;
              align-items: center;
              gap: 10px;
              font-family: 'Segoe UI', Arial, sans-serif;
              letter-spacing: 0.5px;
            }
            .print-btn:hover {
              background: #222222;
            }
            @media print {
              body { background: white; padding: 20px; }
              .invoice-container { border: 1px solid #000000; padding: 30px; }
              .print-btn { display: none !important; }
            }
            @media (max-width: 640px) {
              body { padding: 20px; }
              .invoice-container { padding: 25px; }
              .invoice-header { flex-direction: column; text-align: center; gap: 15px; }
              .invoice-number { text-align: center; }
              .info-grid { grid-template-columns: 1fr; gap: 15px; }
              .totals { justify-content: center; }
              .totals-box { width: 100%; }
              .status-row { flex-direction: column; gap: 8px; }
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <div class="invoice-header">
              <div class="brand">
                <h1>${cabinName.toUpperCase()}</h1>
                <div class="gst">GST: 18%</div>
                <div class="address-line">${cabinAddress}</div>
              </div>
              <div class="invoice-number">
                <div class="label">Invoice</div>
                <div class="number">#${orderId}</div>
                <div class="date">${today}</div>
              </div>
            </div>

            <div class="info-grid">
              <div>
                <div class="title">Bill To</div>
                <div class="value">${customerName}</div>
                <div class="value-small">${customerMobile}</div>
                <div class="value-small">${customerEmail}</div>
              </div>
              <div>
                <div class="title">Cabin Details</div>
                <div class="value">${cabinName}</div>
                <div class="address-line">${cabinAddress}</div>
                <div class="value-small" style="margin-top:4px;">${totalHours} Hours • ${booking.bookingBasis === 'plan' ? 'Plan Booking' : 'Hourly'}</div>
              </div>
            </div>

            <table class="invoice-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Details</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Cabin Booking</strong></td>
                  <td>
                    ${cabinName}<br>
                    <span style="font-size:11px;color:#666666;">${startDate} · ${startTime} to ${endDate} · ${endTime}</span>
                    ${booking.bookingBasis === 'plan' && booking.selectedPlan ? `<br><span style="font-size:11px;color:#666666;">Plan: ${booking.selectedPlan.label || 'Subscription'}</span>` : ''}
                    ${transactionId !== 'N/A' ? `<br><span style="font-size:10px;color:#888888;font-family:monospace;">TXN: ${transactionId}</span>` : ''}
                    ${visitingTimings.length > 0 ? `<br><span style="font-size:10px;color:#059669;font-weight:600;">📍 ${visitingTimings.length} Visit${visitingTimings.length > 1 ? 's' : ''} Logged</span>` : ''}
                  </td>
                  <td>₹${subtotal.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>

            ${visitingTimings.length > 0 ? `
            <div style="margin:15px 0;padding:10px;border:1px solid #cccccc;border-radius:4px;">
              <p style="font-size:10px;font-weight:700;text-transform:uppercase;color:#666666;margin-bottom:6px;">📋 Visit Log</p>
              ${visitingTimings.map((t, i) => `
                <div style="font-size:11px;color:#333333;padding:4px 0;border-bottom:1px solid #eeeeee;">
                  <strong>Day ${i+1}:</strong> ${formatDate(t.date)} · ${t.checkIn} - ${t.checkOut}
                </div>
              `).join('')}
            </div>
            ` : ''}

            <div class="status-row">
              <div class="item">
                <div class="label">Payment Method</div>
                <div class="value">${paymentMethod}</div>
              </div>
              <div class="item">
                <div class="label">Payment Status</div>
                <div class="value">${paymentStatus}</div>
              </div>
              <div class="item">
                <div class="label">Booking Status</div>
                <div class="value">${status}</div>
              </div>
              ${transactionId !== 'N/A' ? `
              <div class="item">
                <div class="label">Transaction ID</div>
                <div class="value" style="font-family:monospace;font-size:11px;">${transactionId}</div>
              </div>
              ` : ''}
            </div>

            <div class="totals">
              <div class="totals-box">
                <div class="totals-row">
                  <span>Subtotal</span>
                  <span>₹${subtotal.toFixed(2)}</span>
                </div>
                <div class="totals-row">
                  <span>GST (18%)</span>
                  <span>₹${gstAmount.toFixed(2)}</span>
                </div>
                <div class="totals-row total">
                  <span>Total Amount</span>
                  <span>₹${amount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div class="footer">
              <div class="powered">POWERED BY <span>IRYAX SPACE</span></div>
              <div class="sub">Thank you for choosing ${cabinName}</div>
              <div class="sub" style="margin-top:2px;">This is a system generated invoice</div>
            </div>
          </div>

          <button class="print-btn" onclick="window.print()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 6 2 18 2 18 9"/>
              <path d="M18 9H6"/>
              <path d="M18 13v6H6v-6"/>
              <rect x="8" y="2" width="8" height="4" rx="1"/>
              <rect x="8" y="13" width="8" height="4" rx="1"/>
            </svg>
            Print / Save PDF
          </button>
        </body>
        </html>
      `;

      const win = window.open('', '_blank', 'width=900,height=700');
      if (win) {
        win.document.write(invoiceHTML);
        win.document.close();
        win.focus();
        toast.success('Invoice opened! Click Print to save as PDF.');
      } else {
        toast.error('Please allow popups to download invoice');
      }

    } catch (error) {
      console.error('Invoice download error:', error);
      toast.error('Failed to generate invoice');
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch = 
      b.cabinId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      b.cabinId?.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.mobile?.includes(searchTerm) ||
      b.userId?.mobile?.includes(searchTerm);
    
    const matchesDate = filterDate ? b.startDate === filterDate : true;
    return matchesSearch && matchesDate;
  });

  if (loading) {
    return (
      <div className="admin-dash">
        {isAdmin ? <AdminNavbar /> : <UsersNavbar />}
        <div className="admin-dash__loading">
          <div className="admin-dash__spinner" />
          <p className="admin-dash__loading-text">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dash">
      {isAdmin ? <AdminNavbar /> : <UsersNavbar />}

      <main className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="admin-dash__header">
          <div>
            <h1 className="admin-dash__greeting">
              Cabin <span>Bookings</span>
            </h1>
            <p className="admin-dash__subtitle">
              A live overview of reservations across your listed cabins
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-grow sm:flex-grow-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all w-full sm:w-64"
              />
            </div>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all w-full sm:w-auto"
            />
            
            {filteredBookings.length > 0 && (
              <button
                onClick={exportToExcel}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors w-full sm:w-auto"
              >
                <Download size={16} />
                Export Excel
              </button>
            )}
            
            {(searchTerm || filterDate) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterDate("");
                }}
                className="flex items-center justify-center gap-2 p-2.5 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 transition-colors w-full sm:w-auto"
                title="Clear Filters"
              >
                <X size={18} />
                <span className="sm:hidden text-sm font-medium">Clear Filters</span>
              </button>
            )}
            <div className="px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm flex sm:flex-col justify-between items-center sm:items-start gap-2 sm:gap-1">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider leading-none mb-0 sm:mb-1">Found</p>
              <p className="text-lg font-black text-slate-900 leading-none">
                {filteredBookings.length} <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest ml-1">Results</span>
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-5 text-white shadow-lg shadow-indigo-500/25">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-200">Total Bookings</p>
                <p className="text-2xl font-bold mt-1">{stats.totalBookings}</p>
              </div>
              <div className="bg-white/20 p-2.5 rounded-xl">
                <CreditCard size={20} className="text-white" />
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-white/20 flex justify-between text-[10px]">
              <span className="text-indigo-200">Revenue</span>
              <span className="font-semibold">{formatCurrency(stats.totalRevenue)}</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Confirmed</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.confirmed}</p>
              </div>
              <div className="bg-emerald-100 p-2.5 rounded-xl">
                <CheckCircle size={20} className="text-emerald-600" />
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-100 flex justify-between text-[10px]">
              <span className="text-slate-500">Revenue</span>
              <span className="font-semibold text-slate-900">{formatCurrency(stats.confirmedRevenue)}</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">Active</p>
                <p className="text-2xl font-bold text-indigo-600 mt-1">{stats.active}</p>
              </div>
              <div className="bg-indigo-100 p-2.5 rounded-xl">
                <Timer size={20} className="text-indigo-600" />
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-100 flex justify-between text-[10px]">
              <span className="text-slate-500">In Progress</span>
              <span className="font-semibold text-slate-900">{stats.active} active</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Completed</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{stats.completed}</p>
              </div>
              <div className="bg-blue-100 p-2.5 rounded-xl">
                <CheckCircle size={20} className="text-blue-600" />
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-100 flex justify-between text-[10px]">
              <span className="text-slate-500">Revenue</span>
              <span className="font-semibold text-slate-900">{formatCurrency(stats.completedRevenue)}</span>
            </div>
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
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

        {filteredBookings.length === 0 ? (
          <div className="admin-dash__error" style={{ background: '#f8fafc', borderColor: '#e2e8f0' }}>
            <CalendarIcon size={48} className="text-slate-300 mb-4" />
            <p className="admin-dash__error-title" style={{ color: '#475569' }}>No bookings found</p>
            <p className="admin-dash__error-message">We couldn't find any bookings matching your search criteria.</p>
            {(searchTerm || filterDate) && (
              <button
                onClick={() => { setSearchTerm(""); setFilterDate(""); }}
                className="mt-4 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Cabin</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Period</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Hours</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Payment</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Pmt Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Visits</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBookings.map((booking) => {
                    const statusBadge = getStatusBadge(booking.status);
                    const paymentMethodBadge = getPaymentMethodBadge(booking.paymentMethod);
                    const paymentStatusBadge = getPaymentStatusBadge(booking.paymentStatus);
                    const visitCount = booking.visitingTimings?.length || 0;
                    
                    return (
                    <tr 
                      key={booking._id} 
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        {booking.bookingBasis === "plan" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 inline-block"></span>
                            Plan
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                            Hourly
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                            <Building2 size={18} className="text-indigo-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 text-sm">
                              {booking.cabinId?.name || "Unknown Cabin"}
                            </p>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                              <MapPin size={12} className="text-indigo-500" />
                              {booking.cabinId?.address?.split(",")[0] || "No Address"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                            <User size={18} className="text-slate-600" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 text-sm">
                              {booking.name || booking.userId?.name || "Unknown Guest"}
                            </p>
                            <p className="text-xs text-slate-400">{booking.mobile || booking.userId?.mobile || "No Mobile"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <p className="text-sm text-slate-900 font-medium">
                            {booking.startDate} · {booking.startTime}
                          </p>
                          <p className="text-sm text-slate-500">
                            {booking.endDate} · {booking.endTime}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">
                          {booking.totalHours}h
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${statusBadge.color}`}>
                          {statusBadge.icon}
                          {statusBadge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${paymentMethodBadge.color}`}>
                          {paymentMethodBadge.icon}
                          {paymentMethodBadge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${paymentStatusBadge.color}`}>
                          {paymentStatusBadge.icon}
                          {paymentStatusBadge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <History size={14} className="text-indigo-400" />
                          <span className="text-sm font-semibold text-slate-700">{visitCount}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1 text-indigo-600 font-bold text-lg">
                          <IndianRupee size={18} />
                          {booking.totalPrice?.toLocaleString("en-IN") || "0"}
                        </div>
                        {booking.subtotal && booking.gstAmount && (
                          <p className="text-[8px] text-slate-400">
                            Base: ₹{booking.subtotal} + GST: ₹{booking.gstAmount}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1.5 flex-wrap">
                          <button
                            onClick={() => handleViewBooking(booking)}
                            className="p-1.5 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                            title="View Details"
                          >
                            <Eye size={15} />
                          </button>
                          
                          <button
                            onClick={() => downloadInvoice(booking)}
                            className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
                            title="Download Invoice"
                          >
                            <FileDown size={15} />
                          </button>
                          
                          {/* ✅ Add Timing Button */}
                          <button
                            onClick={() => {
                              setTimingBooking(booking);
                              setNewTiming({ date: "", checkIn: "", checkOut: "" });
                              setShowTimingModal(true);
                            }}
                            className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                            title="Add Visit Timing"
                          >
                            <Plus size={15} />
                          </button>
                          
                          <button
                            onClick={() => {
                              setSelectedBooking(booking);
                              setNewStatus(booking.status || 'pending');
                              setShowStatusModal(true);
                            }}
                            className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                            title="Update Status"
                          >
                            <Edit size={15} />
                          </button>

                          {/* Payment Status Update - Only for cash/counter payments with pending status */}
                          {(booking.paymentMethod === 'cash' || booking.paymentMethod === 'counter') && booking.paymentStatus === 'pending' && (
                            <button
                              onClick={() => {
                                setPaymentBooking(booking);
                                setNewPaymentStatus(booking.paymentStatus || 'pending');
                                setAmountPaid(booking.totalPrice || 0);
                                setShowPaymentModal(true);
                              }}
                              className="p-1.5 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition-colors"
                              title="Mark as Paid"
                            >
                              <CreditCard size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* ====================== */}
      {/* VIEW BOOKING MODAL */}
      {/* ====================== */}
      {showViewModal && viewBooking && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={(e) => {
          if (e.target === e.currentTarget) setShowViewModal(false);
        }}>
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div style={{
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 60%, #06b6d4 100%)",
              padding: "1.25rem 1.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              position: "sticky",
              top: 0,
              zIndex: 10
            }}>
              <div className="flex items-center gap-3">
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: "rgba(255,255,255,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <Receipt size={20} color="#fff" />
                </div>
                <div>
                  <h3 style={{ margin: 0, color: "#fff", fontSize: "1rem", fontWeight: 700 }}>
                    Booking Details
                  </h3>
                  <p style={{ margin: 0, color: "rgba(255,255,255,0.8)", fontSize: "0.75rem" }}>
                    #{viewBooking._id.slice(-6)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowViewModal(false)}
                style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: "rgba(255,255,255,0.15)", border: "none",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", color: "#fff"
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: "1.5rem" }}>
              <div className="space-y-4">
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Cabin</p>
                  <p className="font-semibold text-slate-800 mt-1">{viewBooking.cabinId?.name || 'Unknown'}</p>
                  <p className="text-sm text-slate-600 flex items-center gap-1 mt-0.5">
                    <MapPin size={14} />
                    {viewBooking.cabinId?.address || 'N/A'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Customer</p>
                    <p className="font-semibold text-slate-800 mt-1">{viewBooking.name || viewBooking.userId?.name || 'N/A'}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Mobile</p>
                    <p className="font-semibold text-slate-800 mt-1">{viewBooking.mobile || viewBooking.userId?.mobile || 'N/A'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                    <p className="text-xs font-medium text-orange-600 uppercase tracking-wider">Payment Method</p>
                    <div className="mt-1">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${getPaymentMethodBadge(viewBooking.paymentMethod).color}`}>
                        {getPaymentMethodBadge(viewBooking.paymentMethod).icon}
                        {getPaymentMethodBadge(viewBooking.paymentMethod).label}
                      </span>
                    </div>
                  </div>
                  <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
                    <p className="text-xs font-medium text-yellow-600 uppercase tracking-wider">Payment Status</p>
                    <div className="mt-1">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${getPaymentStatusBadge(viewBooking.paymentStatus).color}`}>
                        {getPaymentStatusBadge(viewBooking.paymentStatus).icon}
                        {getPaymentStatusBadge(viewBooking.paymentStatus).label}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Start</p>
                    <p className="font-semibold text-slate-800 mt-1">{viewBooking.startDate} · {viewBooking.startTime}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">End</p>
                    <p className="font-semibold text-slate-800 mt-1">{viewBooking.endDate} · {viewBooking.endTime}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-indigo-50 rounded-xl p-3 text-center">
                    <p className="text-[8px] font-bold text-indigo-500 uppercase tracking-wider">Total</p>
                    <p className="text-lg font-bold text-indigo-700">{viewBooking.totalHours}h</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 text-center">
                    <p className="text-[8px] font-bold text-slate-500 uppercase tracking-wider">Booking</p>
                    <p className="text-lg font-bold text-slate-700">{viewBooking.bookingBasis === 'plan' ? 'Plan' : 'Hourly'}</p>
                  </div>
                  <div className="bg-emerald-50 rounded-xl p-3 text-center">
                    <p className="text-[8px] font-bold text-emerald-500 uppercase tracking-wider">Amount</p>
                    <p className="text-lg font-bold text-emerald-700">₹{viewBooking.totalPrice}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Subtotal</p>
                    <p className="font-semibold text-slate-800 mt-1">₹{viewBooking.subtotal?.toFixed(2) || '0'}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">GST (18%)</p>
                    <p className="font-semibold text-slate-800 mt-1">₹{viewBooking.gstAmount?.toFixed(2) || '0'}</p>
                  </div>
                </div>

                {/* ✅ Visiting Timings Display */}
                {viewBooking.visitingTimings && viewBooking.visitingTimings.length > 0 && (
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-medium text-blue-600 uppercase tracking-wider flex items-center gap-1">
                        <History size={14} />
                        Visit Log ({viewBooking.visitingTimings.length} entries)
                      </p>
                    </div>
                    <div className="space-y-1.5">
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

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Status</p>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border mt-1 ${getStatusBadge(viewBooking.status).color}`}>
                      {getStatusBadge(viewBooking.status).icon}
                      {getStatusBadge(viewBooking.status).label}
                    </span>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Amount</p>
                    <p className="text-xl font-bold text-indigo-600 mt-1">
                      ₹{viewBooking.totalPrice?.toLocaleString('en-IN') || 0}
                    </p>
                  </div>
                </div>

                {viewBooking.transactionId && (
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Transaction ID</p>
                    <p className="font-mono text-sm text-slate-700 mt-1">{viewBooking.transactionId}</p>
                  </div>
                )}

                <button
                  onClick={() => {
                    setShowViewModal(false);
                    downloadInvoice(viewBooking);
                  }}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: 10,
                    border: "none",
                    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                    color: "#fff",
                    fontFamily: "inherit",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    boxShadow: "0 4px 14px rgba(99,102,241,0.35)",
                    transition: "all 160ms",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)" }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)" }}
                >
                  <FileDown size={18} />
                  Download Invoice
                </button>

                <button
                  onClick={() => setShowViewModal(false)}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: 10,
                    border: "1.5px solid #e2e8f0",
                    background: "#fff",
                    color: "#64748b",
                    fontFamily: "inherit",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 160ms",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#f8fafc"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#fff"; }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================== */}
      {/* STATUS UPDATE MODAL */}
      {/* ====================== */}
      {showStatusModal && selectedBooking && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowStatusModal(false);
            setSelectedBooking(null);
            setNewStatus("");
          }
        }}>
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div style={{
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 60%, #06b6d4 100%)",
              padding: "1.25rem 1.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}>
              <div className="flex items-center gap-3">
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: "rgba(255,255,255,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <Edit size={20} color="#fff" />
                </div>
                <div>
                  <h3 style={{ margin: 0, color: "#fff", fontSize: "1rem", fontWeight: 700 }}>
                    Update Booking Status
                  </h3>
                  <p style={{ margin: 0, color: "rgba(255,255,255,0.8)", fontSize: "0.75rem" }}>
                    {selectedBooking.cabinId?.name || "Cabin"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowStatusModal(false);
                  setSelectedBooking(null);
                  setNewStatus("");
                }}
                style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: "rgba(255,255,255,0.15)", border: "none",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", color: "#fff"
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: "1.5rem" }}>
              <div style={{
                background: "#f8fafc",
                borderRadius: 10,
                padding: "0.75rem 1rem",
                marginBottom: "1.25rem"
              }}>
                <div className="flex justify-between items-center">
                  <span style={{ color: "#64748b", fontSize: "0.875rem" }}>Current Status</span>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusBadge(selectedBooking.status).color}`}>
                    {getStatusBadge(selectedBooking.status).icon}
                    {getStatusBadge(selectedBooking.status).label}
                  </span>
                </div>
              </div>

              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{
                  display: "block",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: "0.5rem"
                }}>
                  Select New Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['pending', 'confirmed', 'active', 'completed', 'cancelled'].map((status) => {
                    const badge = getStatusBadge(status);
                    const isSelected = newStatus === status;
                    return (
                      <button
                        key={status}
                        onClick={() => setNewStatus(status)}
                        style={{
                          padding: "0.6rem",
                          borderRadius: 10,
                          border: isSelected ? `2px solid #6366f1` : "1.5px solid #e2e8f0",
                          background: isSelected ? "rgba(99,102,241,0.06)" : "#fff",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.5rem",
                          transition: "all 160ms",
                          fontWeight: isSelected ? 700 : 500,
                          color: isSelected ? "#4f46e5" : "#64748b"
                        }}
                      >
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${badge.color}`}>
                          {badge.icon}
                          {badge.label}
                        </span>
                      </button>
                    );
                  })}
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
                <span>Changing status will update the booking visibility and availability.</span>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={handleUpdateStatus}
                  disabled={updating || !newStatus}
                  style={{
                    width: "100%",
                    padding: "0.875rem",
                    borderRadius: 10,
                    border: "none",
                    background: (updating || !newStatus)
                      ? "#a5b4fc"
                      : "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                    color: "#fff",
                    fontFamily: "inherit",
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    cursor: (updating || !newStatus) ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    boxShadow: (updating || !newStatus) ? "none" : "0 4px 14px rgba(99,102,241,0.35)",
                    transition: "all 160ms",
                  }}
                >
                  {updating ? (
                    <>
                      <span style={{
                        width: 16, height: 16, borderRadius: "50%",
                        border: "2px solid rgba(255,255,255,0.4)",
                        borderTopColor: "#fff",
                        animation: "spin 0.7s linear infinite",
                        display: "inline-block",
                      }} />
                      Updating...
                    </>
                  ) : (
                    <>Update Status</>
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowStatusModal(false);
                    setSelectedBooking(null);
                    setNewStatus("");
                  }}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: 10,
                    border: "1.5px solid #e2e8f0",
                    background: "#fff",
                    color: "#64748b",
                    fontFamily: "inherit",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 160ms",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#f8fafc"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#fff"; }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================== */}
      {/* PAYMENT STATUS UPDATE MODAL */}
      {/* ====================== */}
      {showPaymentModal && paymentBooking && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowPaymentModal(false);
            setPaymentBooking(null);
            setNewPaymentStatus("");
            setAmountPaid(0);
          }
        }}>
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div style={{
              background: "linear-gradient(135deg, #f59e0b 0%, #d97706 60%, #b45309 100%)",
              padding: "1.25rem 1.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}>
              <div className="flex items-center gap-3">
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: "rgba(255,255,255,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <CreditCard size={20} color="#fff" />
                </div>
                <div>
                  <h3 style={{ margin: 0, color: "#fff", fontSize: "1rem", fontWeight: 700 }}>
                    Update Payment Status
                  </h3>
                  <p style={{ margin: 0, color: "rgba(255,255,255,0.8)", fontSize: "0.75rem" }}>
                    {paymentBooking.cabinId?.name || "Cabin"} - Total: ₹{paymentBooking.totalPrice}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setPaymentBooking(null);
                  setNewPaymentStatus("");
                  setAmountPaid(0);
                }}
                style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: "rgba(255,255,255,0.15)", border: "none",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", color: "#fff"
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: "1.5rem" }}>
              <div style={{
                background: "#f8fafc",
                borderRadius: 10,
                padding: "0.75rem 1rem",
                marginBottom: "1.25rem"
              }}>
                <div className="flex justify-between items-center">
                  <span style={{ color: "#64748b", fontSize: "0.875rem" }}>Current Payment Status</span>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${getPaymentStatusBadge(paymentBooking.paymentStatus).color}`}>
                    {getPaymentStatusBadge(paymentBooking.paymentStatus).icon}
                    {getPaymentStatusBadge(paymentBooking.paymentStatus).label}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-200">
                  <span style={{ color: "#64748b", fontSize: "0.875rem" }}>Payment Method</span>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${getPaymentMethodBadge(paymentBooking.paymentMethod).color}`}>
                    {getPaymentMethodBadge(paymentBooking.paymentMethod).icon}
                    {getPaymentMethodBadge(paymentBooking.paymentMethod).label}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-200">
                  <span style={{ color: "#64748b", fontSize: "0.875rem" }}>Total Amount</span>
                  <span style={{ fontWeight: 700, color: "#1e293b" }}>₹{paymentBooking.totalPrice}</span>
                </div>
              </div>

              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{
                  display: "block",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: "0.5rem"
                }}>
                  Amount Paid (₹)
                </label>
                <input
                  type="number"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(Number(e.target.value))}
                  disabled={newPaymentStatus !== 'paid'}
                  placeholder="Enter amount paid"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: 10,
                    border: newPaymentStatus === 'paid' ? "2px solid #6366f1" : "1.5px solid #e2e8f0",
                    background: newPaymentStatus === 'paid' ? "#fff" : "#f1f5f9",
                    fontSize: "1rem",
                    fontWeight: 600,
                    color: "#1e293b",
                    outline: "none",
                    transition: "all 160ms",
                    cursor: newPaymentStatus === 'paid' ? "text" : "not-allowed"
                  }}
                />
                {newPaymentStatus === 'paid' && (
                  <p style={{ fontSize: "0.7rem", color: "#94a3b8", marginTop: "4px" }}>
                    Amount will be added to owner's wallet
                  </p>
                )}
              </div>

              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{
                  display: "block",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: "0.5rem"
                }}>
                  Select New Payment Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['pending', 'paid', 'failed', 'refunded'].map((status) => {
                    const badge = getPaymentStatusBadge(status);
                    const isSelected = newPaymentStatus === status;
                    return (
                      <button
                        key={status}
                        onClick={() => {
                          setNewPaymentStatus(status);
                          if (status === 'paid') {
                            setAmountPaid(paymentBooking.totalPrice);
                          } else {
                            setAmountPaid(0);
                          }
                        }}
                        style={{
                          padding: "0.6rem",
                          borderRadius: 10,
                          border: isSelected ? `2px solid #6366f1` : "1.5px solid #e2e8f0",
                          background: isSelected ? "rgba(99,102,241,0.06)" : "#fff",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.5rem",
                          transition: "all 160ms",
                          fontWeight: isSelected ? 700 : 500,
                          color: isSelected ? "#4f46e5" : "#64748b"
                        }}
                      >
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${badge.color}`}>
                          {badge.icon}
                          {badge.label}
                        </span>
                      </button>
                    );
                  })}
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
                <span>Marking as paid will add the amount to the owner's wallet.</span>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={handleUpdatePaymentStatus}
                  disabled={updatingPayment || !newPaymentStatus || (newPaymentStatus === 'paid' && (!amountPaid || amountPaid <= 0))}
                  style={{
                    width: "100%",
                    padding: "0.875rem",
                    borderRadius: 10,
                    border: "none",
                    background: (updatingPayment || !newPaymentStatus || (newPaymentStatus === 'paid' && (!amountPaid || amountPaid <= 0)))
                      ? "#fcd34d"
                      : "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                    color: "#fff",
                    fontFamily: "inherit",
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    cursor: (updatingPayment || !newPaymentStatus || (newPaymentStatus === 'paid' && (!amountPaid || amountPaid <= 0))) ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    boxShadow: (updatingPayment || !newPaymentStatus || (newPaymentStatus === 'paid' && (!amountPaid || amountPaid <= 0))) ? "none" : "0 4px 14px rgba(245, 158, 11, 0.35)",
                    transition: "all 160ms",
                  }}
                >
                  {updatingPayment ? (
                    <>
                      <span style={{
                        width: 16, height: 16, borderRadius: "50%",
                        border: "2px solid rgba(255,255,255,0.4)",
                        borderTopColor: "#fff",
                        animation: "spin 0.7s linear infinite",
                        display: "inline-block",
                      }} />
                      Updating...
                    </>
                  ) : (
                    <>Update Payment Status</>
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    setPaymentBooking(null);
                    setNewPaymentStatus("");
                    setAmountPaid(0);
                  }}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: 10,
                    border: "1.5px solid #e2e8f0",
                    background: "#fff",
                    color: "#64748b",
                    fontFamily: "inherit",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 160ms",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#f8fafc"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#fff"; }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================== */}
      {/* VISITING TIMINGS MODAL */}
      {/* ====================== */}
      {showTimingModal && timingBooking && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowTimingModal(false);
            setTimingBooking(null);
            setNewTiming({ date: "", checkIn: "", checkOut: "" });
          }
        }}>
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div style={{
              background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 60%, #1e40af 100%)",
              padding: "1.25rem 1.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}>
              <div className="flex items-center gap-3">
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: "rgba(255,255,255,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <Plus size={20} color="#fff" />
                </div>
                <div>
                  <h3 style={{ margin: 0, color: "#fff", fontSize: "1rem", fontWeight: 700 }}>
                    Add Visit Timing
                  </h3>
                  <p style={{ margin: 0, color: "rgba(255,255,255,0.8)", fontSize: "0.75rem" }}>
                    {timingBooking.cabinId?.name || "Cabin"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowTimingModal(false);
                  setTimingBooking(null);
                  setNewTiming({ date: "", checkIn: "", checkOut: "" });
                }}
                style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: "rgba(255,255,255,0.15)", border: "none",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", color: "#fff"
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: "1.5rem" }}>
              <div style={{
                background: "#f8fafc",
                borderRadius: 10,
                padding: "0.75rem 1rem",
                marginBottom: "1.25rem"
              }}>
                <div className="flex justify-between items-center">
                  <span style={{ color: "#64748b", fontSize: "0.875rem" }}>Customer</span>
                  <span style={{ fontWeight: 600, color: "#1e293b" }}>{timingBooking.name || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span style={{ color: "#64748b", fontSize: "0.875rem" }}>Booking Period</span>
                  <span style={{ fontWeight: 500, color: "#1e293b" }}>{timingBooking.startDate} - {timingBooking.endDate}</span>
                </div>
                <div className="flex justify-between items-center mt-1 pt-1 border-t border-slate-200">
                  <span style={{ color: "#64748b", fontSize: "0.875rem" }}>Total Visits Logged</span>
                  <span style={{ fontWeight: 600, color: "#2563eb" }}>{timingBooking.visitingTimings?.length || 0}</span>
                </div>
              </div>

              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{
                  display: "block",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: "0.5rem"
                }}>
                  Visit Date
                </label>
                <input
                  type="date"
                  value={newTiming.date}
                  onChange={(e) => setNewTiming({ ...newTiming, date: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: 10,
                    border: "1.5px solid #e2e8f0",
                    background: "#fff",
                    fontSize: "0.875rem",
                    color: "#1e293b",
                    outline: "none",
                    transition: "all 160ms",
                  }}
                  onFocus={e => { e.target.style.borderColor = "#6366f1"; e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.12)" }}
                  onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none" }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3" style={{ marginBottom: "1.25rem" }}>
                <div>
                  <label style={{
                    display: "block",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: "0.5rem"
                  }}>
                    Check In
                  </label>
                  <input
                    type="time"
                    value={newTiming.checkIn}
                    onChange={(e) => setNewTiming({ ...newTiming, checkIn: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      borderRadius: 10,
                      border: "1.5px solid #e2e8f0",
                      background: "#fff",
                      fontSize: "0.875rem",
                      color: "#1e293b",
                      outline: "none",
                      transition: "all 160ms",
                    }}
                    onFocus={e => { e.target.style.borderColor = "#22c55e"; e.target.style.boxShadow = "0 0 0 3px rgba(34,197,94,0.12)" }}
                    onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none" }}
                  />
                </div>
                <div>
                  <label style={{
                    display: "block",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: "0.5rem"
                  }}>
                    Check Out
                  </label>
                  <input
                    type="time"
                    value={newTiming.checkOut}
                    onChange={(e) => setNewTiming({ ...newTiming, checkOut: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      borderRadius: 10,
                      border: "1.5px solid #e2e8f0",
                      background: "#fff",
                      fontSize: "0.875rem",
                      color: "#1e293b",
                      outline: "none",
                      transition: "all 160ms",
                    }}
                    onFocus={e => { e.target.style.borderColor = "#ef4444"; e.target.style.boxShadow = "0 0 0 3px rgba(239,68,68,0.12)" }}
                    onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none" }}
                  />
                </div>
              </div>

              {/* Show existing timings */}
              {timingBooking.visitingTimings && timingBooking.visitingTimings.length > 0 && (
                <div style={{
                  background: "#f8fafc",
                  borderRadius: 10,
                  padding: "0.75rem 1rem",
                  marginBottom: "1.25rem"
                }}>
                  <p style={{
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: "0.5rem"
                  }}>
                    Existing Visits
                  </p>
                  <div className="space-y-1">
                    {timingBooking.visitingTimings.map((t, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <span className="text-slate-600">{formatDate(t.date)}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-600 font-medium">{t.checkIn}</span>
                          <span className="text-slate-300">-</span>
                          <span className="text-red-500 font-medium">{t.checkOut}</span>
                          <button
                            onClick={() => {
                              if (window.confirm("Delete this timing entry?")) {
                                handleDeleteTiming(timingBooking._id, idx);
                              }
                            }}
                            className="text-red-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{
                background: "#eff6ff",
                borderRadius: 8,
                padding: "0.75rem",
                marginBottom: "1.25rem",
                fontSize: "0.75rem",
                color: "#1e40af",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}>
                <Clock size={16} className="shrink-0" />
                <span>Add check-in and check-out times for each visit day.</span>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={handleAddTiming}
                  disabled={updatingTiming}
                  style={{
                    width: "100%",
                    padding: "0.875rem",
                    borderRadius: 10,
                    border: "none",
                    background: updatingTiming
                      ? "#93c5fd"
                      : "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                    color: "#fff",
                    fontFamily: "inherit",
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    cursor: updatingTiming ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    boxShadow: updatingTiming ? "none" : "0 4px 14px rgba(37,99,235,0.35)",
                    transition: "all 160ms",
                  }}
                >
                  {updatingTiming ? (
                    <>
                      <span style={{
                        width: 16, height: 16, borderRadius: "50%",
                        border: "2px solid rgba(255,255,255,0.4)",
                        borderTopColor: "#fff",
                        animation: "spin 0.7s linear infinite",
                        display: "inline-block",
                      }} />
                      Adding...
                    </>
                  ) : (
                    <>Add Visit Timing</>
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowTimingModal(false);
                    setTimingBooking(null);
                    setNewTiming({ date: "", checkIn: "", checkOut: "" });
                  }}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: 10,
                    border: "1.5px solid #e2e8f0",
                    background: "#fff",
                    color: "#64748b",
                    fontFamily: "inherit",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 160ms",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#f8fafc"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#fff"; }}
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

export default CabinBookings;