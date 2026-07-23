// DoctorBookings.jsx - Complete Doctor Bookings Component
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
  Plus
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DoctorNavbar from "./DoctorNavbar";
import * as XLSX from 'xlsx';
import "./Dashboard.css";

const API_URL = "http://localhost:5003";

const BookingDoctor = () => {
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
  
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewBooking, setViewBooking] = useState(null);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentBooking, setPaymentBooking] = useState(null);
  const [newPaymentStatus, setNewPaymentStatus] = useState("");
  const [amountPaid, setAmountPaid] = useState(0);
  const [updatingPayment, setUpdatingPayment] = useState(false);

  const [showReplaceModal, setShowReplaceModal] = useState(false);
  const [replaceBooking, setReplaceBooking] = useState(null);
  const [selectedChamber, setSelectedChamber] = useState("");
  const [replaceLoading, setReplaceLoading] = useState(false);
  const [selectedChamberData, setSelectedChamberData] = useState(null);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelBooking, setCancelBooking] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  const currentUser = (() => {
    try {
      const u = localStorage.getItem("doctor");
      if (u) return JSON.parse(u);
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

  // ─── OLD ENDPOINT: /api/bookings/user ───
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to view your bookings");
        navigate("/login");
        return;
      }

      // OLD ENDPOINT: /api/bookings/user
      const res = await axios.get(
        `${API_URL}/api/bookings/user`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const bookingsData = res.data.bookings || [];
      setBookings(bookingsData);
      
      if (bookingsData.length === 0) {
        toast.info("You have no bookings yet");
      }
      
    } catch (error) {
      console.error("Error fetching bookings:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("doctor");
        navigate("/login");
      } else {
        toast.error("Failed to fetch bookings: " + (error.response?.data?.error || error.message));
      }
    } finally {
      setLoading(false);
    }
  };

  // ─── OLD ENDPOINT: /api/cabins ───
  const fetchChambers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      // OLD ENDPOINT: /api/cabins
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
    fetchBookings();
    fetchChambers();
  }, []);

  // Calculate price difference when chamber is selected
  useEffect(() => {
    if (selectedChamber && replaceBooking) {
      const chamber = allChambers.find(c => c._id === selectedChamber);
      setSelectedChamberData(chamber || null);
    } else {
      setSelectedChamberData(null);
    }
  }, [selectedChamber, allChambers, replaceBooking]);

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
      if (filteredBookings.length === 0) {
        toast.warning("No bookings to export");
        return;
      }
      const data = filteredBookings.map((b, i) => ({
        'S.No': i + 1,
        'Chamber': b.cabin?.name || b.chamberName || 'Unknown',
        'User': b.patientName || b.name || 'N/A',
        'Mobile': b.patientMobile || b.mobile || 'N/A',
        'From': b.startDate || b.date,
        'To': b.endDate,
        'From Time': b.startTime || b.time,
        'To Time': b.endTime,
        'Hours': b.totalHours || 0,
        'Seats': b.seatCount || 0,
        'Extra Charge': b.extraCharge || 0,
        'Total (₹)': b.totalPrice || b.amount || 0,
        'Status': getStatusBadge(b.status).label,
        'Payment': getPaymentMethodBadge(b.paymentMethod).label,
        'Pmt Status': getPaymentStatusBadge(b.paymentStatus).label,
        'Terms': b.termsAccepted ? 'Yes' : 'No',
        'Created': b.createdAt ? formatDateTime(b.createdAt) : 'N/A'
      }));
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Bookings');
      XLSX.writeFile(wb, `doctor_bookings_${new Date().toISOString().split('T')[0]}.xlsx`);
      toast.success(`Exported ${filteredBookings.length} bookings!`);
    } catch (error) {
      console.error(error);
      toast.error("Export failed");
    }
  };

  const handleViewBooking = (booking) => {
    setViewBooking(booking);
    setShowViewModal(true);
  };

  // ─── OLD ENDPOINT: /api/bookings/replace-booking ───
  const handleReplaceBooking = async () => {
    if (!selectedChamber) {
      toast.error("Please select a chamber to replace");
      return;
    }

    setReplaceLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_URL}/api/bookings/replace-booking/${replaceBooking._id}`,
        { newCabinId: selectedChamber },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Booking replaced successfully!");
        setShowReplaceModal(false);
        setReplaceBooking(null);
        setSelectedChamber("");
        setSelectedChamberData(null);
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

  // ─── OLD ENDPOINT: /api/bookings/cancel-booking ───
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

  // ─── OLD ENDPOINT: /api/bookings/bookingpayment-status ───
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
        { paymentStatus: newPaymentStatus, amountPaid: amountPaid || paymentBooking.totalPrice },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setBookings(bookings.map(b =>
          b._id === paymentBooking._id ? { ...b, paymentStatus: newPaymentStatus, amountPaid: amountPaid } : b
        ));
        toast.success(`Payment status updated to ${newPaymentStatus}`);
        setShowPaymentModal(false);
        setPaymentBooking(null);
        setNewPaymentStatus("");
        setAmountPaid(0);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update");
    } finally {
      setUpdatingPayment(false);
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
        </style>
        </head><body>
          <div class="header">
            <div><h1>${(owner.organizationName || 'IRYAX SPACE').toUpperCase()}</h1>
            <p>GST: ${owner.gstNumber || 'N/A'}</p></div>
            <div><p><strong>Invoice #${booking._id.slice(-8).toUpperCase()}</strong></p>
            <p>${new Date().toLocaleDateString()}</p></div>
          </div>
          <div class="info">
            <div><strong>User:</strong><br>${booking.patientName || booking.name || 'User'}<br>${booking.patientMobile || booking.mobile || 'N/A'}<br>${booking.patientEmail || booking.email || 'N/A'}</div>
            <div><strong>Chamber:</strong><br>${cabin.name || booking.chamberName || 'Unknown'}<br>${cabin.address || 'N/A'}</div>
          </div>
          ${booking.selectedSeats && booking.selectedSeats.length > 0 ? `
            <div class="seat-section">
              <strong>Selected Seats:</strong>
              <div style="margin-top:5px;">${seatListHtml}</div>
              <div style="margin-top:5px;font-size:12px;color:#666;">Total: ${booking.seatCount} seats • Extra Charge: ₹${booking.extraCharge || 0}</div>
            </div>
          ` : ''}
          <table>
            <tr><th>Description</th><th>Details</th><th>Amount</th></tr>
            <tr><td><strong>${cabin.name || booking.chamberName || 'Chamber Booking'}</strong></td>
            <td>${booking.startDate || booking.date} ${booking.startTime || booking.time} - ${booking.endDate} ${booking.endTime}<br>${booking.totalHours}h • ${booking.bookingBasis === 'plan' ? 'Plan' : 'Hourly'}</td>
            <td>₹${(booking.subtotal || 0).toFixed(2)}</td></tr>
            ${booking.extraCharge > 0 ? `
            <tr><td><strong>Seat Charges</strong></td>
            <td>${booking.seatCount} seats × ₹${booking.seatExtraChargePerSeat || 100}</td>
            <td>₹${(booking.extraCharge || 0).toFixed(2)}</td></tr>
            ` : ''}
          </table>
          <div style="display:flex;gap:20px;margin:10px 0;flex-wrap:wrap;">
            <span><strong>Payment:</strong> <span class="badge ${getPaymentMethodBadge(booking.paymentMethod).color.replace('bg-','bg-')}">${getPaymentMethodBadge(booking.paymentMethod).label}</span></span>
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

  // Filter bookings - Updated to use From/To date range and cabin filter
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
    
    // Cabin filter
    const matchCabin = filters.cabinId === 'all' || b.cabin?._id === filters.cabinId;
    
    const matchStatus = filters.status === 'all' || b.status === filters.status;
    const matchPaymentStatus = filters.paymentStatus === 'all' || b.paymentStatus === filters.paymentStatus;
    const matchPaymentMethod = filters.paymentMethod === 'all' || b.paymentMethod === filters.paymentMethod;
    
    return matchDateRange && matchCabin && matchStatus && matchPaymentStatus && matchPaymentMethod;
  });

  // Calculate price difference
  const getPriceDifference = () => {
    if (!replaceBooking || !selectedChamberData) return null;
    
    const currentPrice = replaceBooking.totalPrice || 0;
    const newPrice = selectedChamberData.price || 0;
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

  // Get counts
  const totalCount = bookings.length;
  const activeCount = bookings.filter(b => b.status === 'active' || b.status === 'confirmed').length;
  const pendingCount = bookings.filter(b => b.status === 'pending').length;
  const completedCount = bookings.filter(b => b.status === 'completed').length;

  // Clear filters
  const clearFilters = () => {
    setFilters({
      status: 'all',
      paymentStatus: 'all',
      paymentMethod: 'all',
      cabinId: 'all'
    });
    setFilterDateFrom('');
    setFilterDateTo('');
  };

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
        {/* Header */}
        <div className="admin-dash__header">
          <div>
            <h1 className="admin-dash__greeting">
              Doctor <span>Bookings</span>
            </h1>
          </div>
        
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 shadow-sm">
            <p className="text-xs text-gray-500 font-medium">Total Bookings</p>
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
        </div>

        <div className="space-y-6">
          {/* Bookings Table Section */}
          <div className="admin-dash__card" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}>
            {/* Header with Filters - Updated */}
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

                {/* Cabin Filter */}
                <select
                  value={filters.cabinId}
                  onChange={(e) => setFilters({...filters, cabinId: e.target.value})}
                  className="text-sm bg-white border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium text-gray-700 min-w-[150px]"
                >
                  <option value="all">All Chambers</option>
                  {allChambers.map(cabin => (
                    <option key={cabin._id} value={cabin._id}>
                      {cabin.name}
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

                {/* Export Button */}
                {filteredBookings.length > 0 && (
                  <button
                    onClick={exportToExcel}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium hover:bg-indigo-100 transition-colors border border-indigo-200"
                  >
                    <Download size={14} />
                    <span className="hidden xs:inline">Export</span>
                  </button>
                )}

                {/* My Chambers Button */}
                <button
                  onClick={() => navigate("/mychambers")}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 transition-colors"
                >
                  <Building2 size={14} />
                  <span className="hidden xs:inline">Chambers</span>
                  <span className="xs:hidden">Chambers</span>
                </button>
              </div>
            </div>

            {/* Table Container - Updated columns */}
            <div className="admin-dash__card-body p-0 overflow-x-auto" style={{ backgroundColor: '#ffffff' }}>
              {filteredBookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 py-20 text-gray-400">
                  <Calendar size={48} className="opacity-20" />
                  <p className="text-lg font-medium">No bookings found</p>
                  <p className="text-sm">Try adjusting your filters.</p>
                </div>
              ) : (
                <table className="w-full min-w-[1400px] text-left">
                  <thead>
                    <tr className="border-b border-gray-100" style={{ backgroundColor: '#f9fafb' }}>
                      <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">#</th>
                      <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Chamber</th>
                      <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">User</th>
                      <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">From</th>
                      <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">To</th>
                      <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">From Time</th>
                      <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">To Time</th>
                      <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Hours</th>
                      <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Seats</th>
                      <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Status</th>
                      <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Payment</th>
                      <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Pmt Status</th>
                      <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Amount</th>
                      <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredBookings.map((b, idx) => {
                      const status = getStatusBadge(b.status);
                      const pmtMethod = getPaymentMethodBadge(b.paymentMethod);
                      const pmtStatus = getPaymentStatusBadge(b.paymentStatus);
                      const isCashPending = (b.paymentMethod === 'cash' || b.paymentMethod === 'counter') && b.paymentStatus === 'pending';
                      const seatCount = b.seatCount || 0;
                      const seatNames = b.selectedSeats?.map(s => s.name).join(', ') || 'N/A';
                      
                      return (
                        <tr key={b._id} className="transition-colors group hover:bg-gray-50/80">
                          <td className="p-4">
                            <span className="text-sm font-semibold text-gray-400">#{idx + 1}</span>
                          </td>
                          <td className="p-4">
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">{b.cabin?.name || b.chamberName || 'Unknown'}</p>
                              <p className="text-[10px] text-gray-400 flex items-center gap-1">
                                <MapPin size={10} /> {b.cabin?.address?.split(',')[0] || 'N/A'}
                              </p>
                            </div>
                          </td>
                          <td className="p-4">
                            <p className="font-medium text-gray-800 text-sm">{b.patientName || b.name || 'N/A'}</p>
                            <p className="text-xs text-gray-400">{b.patientMobile || b.mobile || 'N/A'}</p>
                          </td>
                          <td className="p-4">
                            <p className="text-sm text-gray-700">{b.startDate || b.date || 'N/A'}</p>
                          </td>
                          <td className="p-4">
                            <p className="text-sm text-gray-700">{b.endDate || b.startDate || b.date || 'N/A'}</p>
                          </td>
                          <td className="p-4">
                            <p className="text-sm text-gray-700">{b.startTime || b.time || 'N/A'}</p>
                          </td>
                          <td className="p-4">
                            <p className="text-sm text-gray-700">{b.endTime || 'N/A'}</p>
                          </td>
                          <td className="p-4">
                            <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold">{b.totalHours}h</span>
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
                              <span className="text-sm font-bold text-indigo-600">₹{b.totalPrice || b.amount || 0}</span>
                              {b.extraCharge > 0 && (
                                <p className="text-[9px] text-amber-500">+₹{b.extraCharge} seat</p>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <button
                                onClick={() => handleViewBooking(b)}
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors whitespace-nowrap"
                                title="View"
                              >
                                <Eye size={13} /> View
                              </button>
                              <button
                                onClick={() => downloadInvoice(b)}
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors whitespace-nowrap"
                                title="Invoice"
                              >
                                <FileDown size={13} /> Invoice
                              </button>

                              {(b.status === 'confirmed' || b.status === 'active') && (
                                <button
                                  onClick={() => {
                                    setReplaceBooking(b);
                                    setSelectedChamber("");
                                    setSelectedChamberData(null);
                                    setShowReplaceModal(true);
                                  }}
                                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors whitespace-nowrap"
                                  title="Replace Space"
                                >
                                  <RefreshCw size={13} /> Replace
                                </button>
                              )}

                              {(b.status === 'pending' || b.status === 'confirmed') && (
                                <button
                                  onClick={() => {
                                    setCancelBooking(b);
                                    setShowCancelModal(true);
                                  }}
                                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-700 hover:bg-red-100 transition-colors whitespace-nowrap"
                                  title="Cancel Booking"
                                >
                                  <XIcon size={13} /> Cancel
                                </button>
                              )}

                              {isCashPending && (
                                <button
                                  onClick={() => {
                                    setPaymentBooking(b);
                                    setNewPaymentStatus(b.paymentStatus || 'pending');
                                    setAmountPaid(b.totalPrice || 0);
                                    setShowPaymentModal(true);
                                  }}
                                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-yellow-50 text-yellow-700 hover:bg-yellow-100 transition-colors whitespace-nowrap"
                                  title="Update Payment"
                                >
                                  <Edit size={13} /> Update
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* Footer */}
            {!loading && filteredBookings.length > 0 && (
              <div className="px-4 py-3 border-t border-gray-100 rounded-b-2xl flex flex-wrap items-center justify-between gap-2" style={{ backgroundColor: '#fafafa' }}>
                <span className="text-xs text-gray-500">
                  Showing <strong>{filteredBookings.length}</strong> of <strong>{bookings.length}</strong> bookings
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
      </div>

      {/* View Modal */}
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
                  <p className="mt-1 font-semibold text-gray-800">{viewBooking.cabin?.name || viewBooking.chamberName || 'N/A'}</p>
                  <p className="text-xs text-gray-400">{viewBooking.cabin?.address || 'N/A'}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">User</p>
                  <p className="mt-1 font-semibold text-gray-800">{viewBooking.patientName || viewBooking.name || 'N/A'}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Mobile</p>
                  <p className="mt-1 font-semibold text-gray-800">{viewBooking.patientMobile || viewBooking.mobile || 'N/A'}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email</p>
                  <p className="mt-1 font-semibold text-gray-800 text-sm break-all">{viewBooking.patientEmail || viewBooking.email || 'N/A'}</p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Schedule</p>
                <p className="mt-1 font-semibold text-gray-800">From: {viewBooking.startDate || viewBooking.date} {viewBooking.startTime || viewBooking.time}</p>
                <p className="mt-0.5 font-semibold text-gray-800">To: {viewBooking.endDate || viewBooking.startDate || viewBooking.date} {viewBooking.endTime}</p>
                <p className="text-xs text-gray-500 mt-0.5">{viewBooking.totalHours}h • {viewBooking.bookingBasis === 'plan' ? 'Plan' : 'Hourly'}</p>
              </div>

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

              <div className="border-t border-gray-200 pt-4 space-y-1">
                <div className="flex justify-between text-sm"><span className="text-gray-500">Subtotal</span><span>₹{viewBooking.subtotal || 0}</span></div>
                {viewBooking.extraCharge > 0 && (
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Seat Charges</span><span>₹{viewBooking.extraCharge}</span></div>
                )}
                <div className="flex justify-between text-sm"><span className="text-gray-500">GST (18%)</span><span>₹{viewBooking.gstAmount || 0}</span></div>
                <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2 mt-2">
                  <span>Total</span>
                  <span className="text-indigo-600">₹{viewBooking.totalPrice || viewBooking.amount || 0}</span>
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
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Replace Modal */}
      {showReplaceModal && replaceBooking && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowReplaceModal(false)}>
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-5 rounded-t-3xl flex justify-between items-center shrink-0">
              <div>
                <h3 className="text-xl font-bold">Replace Space</h3>
                <p className="text-sm text-blue-200">{replaceBooking.cabin?.name || replaceBooking.chamberName} → New Space</p>
              </div>
              <button onClick={() => setShowReplaceModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4 overflow-y-auto flex-1">
              <div className="bg-blue-50 rounded-xl p-4 text-sm">
                <p className="font-bold text-blue-800">Current Booking</p>
                <p className="text-slate-600 mt-1">{replaceBooking.cabin?.name || replaceBooking.chamberName}</p>
                <p className="text-xs text-slate-500">From: {replaceBooking.startDate || replaceBooking.date} {replaceBooking.startTime || replaceBooking.time}</p>
                <p className="text-xs text-slate-500">To: {replaceBooking.endDate || replaceBooking.startDate || replaceBooking.date} {replaceBooking.endTime}</p>
                <p className="text-xs font-bold text-slate-700 mt-1">Total: ₹{replaceBooking.totalPrice || replaceBooking.amount}</p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Select New Chamber</label>
                <div className="relative">
                  <select
                    value={selectedChamber}
                    onChange={(e) => setSelectedChamber(e.target.value)}
                    className="w-full p-3 pr-10 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                  >
                    <option value="">Select a chamber...</option>
                    {allChambers
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

              {selectedChamberData && priceDiff && (
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-3">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Price Comparison</p>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-[10px] text-blue-600 font-medium">Current Chamber</p>
                      <p className="font-bold text-slate-800">₹{replaceBooking.cabin?.price || 0}/hr</p>
                      <p className="text-xs text-slate-500">{replaceBooking.totalHours}h = ₹{replaceBooking.totalPrice || replaceBooking.amount}</p>
                    </div>
                    <div className="bg-emerald-50 rounded-lg p-3">
                      <p className="text-[10px] text-emerald-600 font-medium">New Chamber</p>
                      <p className="font-bold text-slate-800">₹{selectedChamberData.price}/hr</p>
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
                disabled={replaceLoading || !selectedChamber}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {replaceLoading ? 'Replacing...' : <><RefreshCw size={16} /> Replace Booking</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && cancelBooking && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowCancelModal(false)}>
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-br from-red-600 to-red-700 text-white p-5 rounded-t-3xl flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">Cancel Booking</h3>
                <p className="text-sm text-red-200">{cancelBooking.cabin?.name || cancelBooking.chamberName}</p>
              </div>
              <button onClick={() => setShowCancelModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-red-50 rounded-xl p-4 text-sm">
                <p className="font-bold text-red-800">Are you sure you want to cancel this booking?</p>
                <div className="mt-2 space-y-1 text-slate-600">
                  <p><span className="text-slate-500">Chamber:</span> {cancelBooking.cabin?.name || cancelBooking.chamberName}</p>
                  <p><span className="text-slate-500">From:</span> {cancelBooking.startDate || cancelBooking.date} {cancelBooking.startTime || cancelBooking.time}</p>
                  <p><span className="text-slate-500">To:</span> {cancelBooking.endDate || cancelBooking.startDate || cancelBooking.date} {cancelBooking.endTime}</p>
                  <p><span className="text-slate-500">Total:</span> ₹{cancelBooking.totalPrice || cancelBooking.amount}</p>
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

      {/* Payment Modal */}
      {showPaymentModal && paymentBooking && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowPaymentModal(false)}>
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-5 rounded-t-3xl flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">Update Payment</h3>
                <p className="text-sm text-yellow-100">₹{paymentBooking.totalPrice || paymentBooking.amount}</p>
              </div>
              <button onClick={() => setShowPaymentModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-2">
                <div className="flex justify-between"><span className="text-slate-500">Current Status</span><span className={`px-3 py-1 text-xs font-bold rounded-full ${getPaymentStatusBadge(paymentBooking.paymentStatus).color}`}>{getPaymentStatusBadge(paymentBooking.paymentStatus).label}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Method</span><span className={`px-3 py-1 text-xs font-bold rounded-full ${getPaymentMethodBadge(paymentBooking.paymentMethod).color}`}>{getPaymentMethodBadge(paymentBooking.paymentMethod).label}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Terms</span><span className={`px-3 py-1 text-xs font-bold rounded-full ${getTermsBadge(paymentBooking.termsAccepted).color}`}>{paymentBooking.termsAccepted ? 'Accepted' : 'Not Accepted'}</span></div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Amount Paid (₹)</label>
                <input
                  type="number"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(Number(e.target.value))}
                  disabled={newPaymentStatus !== 'paid'}
                  className="w-full mt-1 p-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter amount"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">New Status</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {['pending','paid','failed','refunded'].map(s => {
                    const badge = getPaymentStatusBadge(s);
                    return (
                      <button
                        key={s}
                        onClick={() => {
                          setNewPaymentStatus(s);
                          if(s === 'paid') setAmountPaid(paymentBooking.totalPrice || paymentBooking.amount);
                          else setAmountPaid(0);
                        }}
                        className={`py-2.5 rounded-xl text-xs font-bold border transition ${newPaymentStatus === s ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 hover:bg-gray-50 text-gray-700'}`}
                      >
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>{badge.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleUpdatePaymentStatus}
                  disabled={updatingPayment || !newPaymentStatus}
                  className="flex-1 py-3 bg-yellow-500 text-white rounded-xl font-bold hover:bg-yellow-600 transition disabled:opacity-50"
                >
                  {updatingPayment ? 'Updating...' : 'Update'}
                </button>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="px-5 py-3 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition"
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

export default BookingDoctor;