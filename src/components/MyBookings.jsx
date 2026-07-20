// MyBookings.jsx - Complete with Price Difference Display (MyCabins Style)
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
  Users
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import UsersNavbar from "./UsersNavbar";
import AdminNavbar from "./AdminNavbar";
import * as XLSX from 'xlsx';
import "./Dashboard.css";

const API_URL = "http://62.72.29.27:5003";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [allCabins, setAllCabins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    paymentStatus: 'all',
    paymentMethod: 'all'
  });
  const isAdmin = localStorage.getItem("admin") !== null;
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

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      const res = await axios.get(
        `${API_URL}/api/bookings/user`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBookings(res.data.bookings || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  const fetchCabins = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/cabins`);
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

  // Calculate price difference when cabin is selected
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
        'Cabin': b.cabinId?.name || 'Unknown',
        'Customer': b.name || 'N/A',
        'Mobile': b.mobile || 'N/A',
        'Start': `${b.startDate} ${b.startTime}`,
        'End': `${b.endDate} ${b.endTime}`,
        'Hours': b.totalHours || 0,
        'Total (₹)': b.totalPrice || 0,
        'Status': getStatusBadge(b.status).label,
        'Payment': getPaymentMethodBadge(b.paymentMethod).label,
        'Pmt Status': getPaymentStatusBadge(b.paymentStatus).label,
        'Terms': b.termsAccepted ? 'Yes' : 'No',
        'Created': b.createdAt ? formatDateTime(b.createdAt) : 'N/A'
      }));
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Bookings');
      XLSX.writeFile(wb, `bookings_${new Date().toISOString().split('T')[0]}.xlsx`);
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

  // Replace Booking
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

  // Cancel Booking
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

  // Update Payment Status
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
      const cabin = booking.cabinId || {};
      const owner = cabin.owner || {};
      const win = window.open('', '_blank', 'width=800,height=600');
      if (!win) {
        toast.error('Please allow popups');
        return;
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
        </style>
        </head><body>
          <div class="header">
            <div><h1>${(owner.organizationName || 'IRYAX Workspace').toUpperCase()}</h1>
            <p>GST: ${owner.gstNumber || 'N/A'}</p></div>
            <div><p><strong>Invoice #${booking._id.slice(-8).toUpperCase()}</strong></p>
            <p>${new Date().toLocaleDateString()}</p></div>
          </div>
          <div class="info">
            <div><strong>Bill To:</strong><br>${booking.name || 'Customer'}<br>${booking.mobile || 'N/A'}<br>${booking.email || 'N/A'}</div>
            <div><strong>Cabin:</strong><br>${cabin.name || 'Unknown'}<br>${cabin.address || 'N/A'}</div>
          </div>
          <table>
            <tr><th>Description</th><th>Details</th><th>Amount</th></tr>
            <tr><td><strong>${cabin.name || 'Cabin Booking'}</strong></td>
            <td>${booking.startDate} ${booking.startTime} - ${booking.endDate} ${booking.endTime}<br>${booking.totalHours}h • ${booking.bookingBasis === 'plan' ? 'Plan' : 'Hourly'}</td>
            <td>₹${(booking.subtotal || 0).toFixed(2)}</td></tr>
          </table>
          <div style="display:flex;gap:20px;margin:10px 0;flex-wrap:wrap;">
            <span><strong>Payment:</strong> <span class="badge ${getPaymentMethodBadge(booking.paymentMethod).color.replace('bg-','bg-')}">${getPaymentMethodBadge(booking.paymentMethod).label}</span></span>
            <span><strong>Status:</strong> <span class="badge ${getStatusBadge(booking.status).color}">${getStatusBadge(booking.status).label}</span></span>
            <span><strong>Pmt Status:</strong> <span class="badge ${getPaymentStatusBadge(booking.paymentStatus).color}">${getPaymentStatusBadge(booking.paymentStatus).label}</span></span>
            <span><strong>Terms:</strong> <span class="badge ${getTermsBadge(booking.termsAccepted).color}">${booking.termsAccepted ? 'Accepted' : 'Not Accepted'}</span></span>
          </div>
          <div class="total">Subtotal: ₹${(booking.subtotal || 0).toFixed(2)}<br>GST (18%): ₹${(booking.gstAmount || 0).toFixed(2)}<br>Total: ₹${(booking.totalPrice || 0).toFixed(2)}</div>
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

  // Filter bookings
  const filteredBookings = bookings.filter((b) => {
    const search = searchTerm.toLowerCase();
    const matchSearch = b.cabinId?.name?.toLowerCase().includes(search) ||
                        b.cabinId?.address?.toLowerCase().includes(search) ||
                        b.name?.toLowerCase().includes(search) ||
                        b.mobile?.includes(searchTerm);
    const matchDate = filterDate ? b.startDate === filterDate : true;
    const matchStatus = filters.status === 'all' || b.status === filters.status;
    const matchPaymentStatus = filters.paymentStatus === 'all' || b.paymentStatus === filters.paymentStatus;
    const matchPaymentMethod = filters.paymentMethod === 'all' || b.paymentMethod === filters.paymentMethod;
    return matchSearch && matchDate && matchStatus && matchPaymentStatus && matchPaymentMethod;
  });

  // Calculate price difference
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
      paymentMethod: 'all'
    });
    setSearchTerm('');
    setFilterDate('');
  };

  if (loading) {
    return (
      <div className="admin-dash" style={{ backgroundColor: '#ffffff' }}>
        {isAdmin ? <AdminNavbar /> : <UsersNavbar />}
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dash" style={{ backgroundColor: '#ffffff' }}>
      {isAdmin ? <AdminNavbar /> : <UsersNavbar />}

      <div className="pt-24 px-3 sm:px-4 md:px-6 lg:px-8 max-w-full mx-auto pb-16">
        {/* Header - Same as Partners Page */}
        <div className="admin-dash__header">
          <div>
            <h1 className="admin-dash__greeting">
              {isAdmin ? 'Admin' : 'My'} <span>Bookings</span>
            </h1>
            <p className="admin-dash__subtitle">
              Manage and view all your bookings.
            </p>
          </div>
          <div className="admin-dash__date-pill">
            <Calendar size={16} />
            <span>
              {new Date().toLocaleDateString("en-US", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
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
            <div className="admin-dash__card-header flex flex-wrap items-center justify-between gap-3" style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb' }}>
              <div className="flex items-center gap-3">
                <h3 className="admin-dash__card-title">All Bookings</h3>
                <span className="px-2.5 py-0.5 text-xs font-bold text-indigo-700 bg-indigo-100 rounded-full">
                  {filteredBookings.length}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {/* Search Bar */}
                <div className="relative w-full sm:w-56">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Search bookings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
                
                {/* Filter Toggle Button */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    showFilters ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Filter size={14} />
                  Filters
                  {(filters.status !== 'all' || filters.paymentStatus !== 'all' || filters.paymentMethod !== 'all' || filterDate) && (
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  )}
                </button>

                {filteredBookings.length > 0 && (
                  <button
                    onClick={exportToExcel}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium hover:bg-indigo-100 transition-colors border border-indigo-200"
                  >
                    <Download size={14} />
                    <span className="hidden xs:inline">Export</span>
                  </button>
                )}

                <button
                  onClick={() => navigate("/my-cabin-payments")}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors"
                >
                  <CreditCard size={14} className="text-indigo-600" />
                  <span className="hidden xs:inline">Payments</span>
                </button>
                <button
                  onClick={() => navigate("/my-cabins")}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 transition-colors"
                >
                  <Building2 size={14} />
                  <span className="hidden xs:inline">Cabins</span>
                  <span className="xs:hidden">Cabins</span>
                </button>
              </div>
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <div className="px-4 pt-4 pb-3 border-b border-gray-100" style={{ backgroundColor: '#fafafa' }}>
                <div className="flex flex-wrap items-end gap-3">
                  <div className="min-w-[130px]">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Date</label>
                    <input
                      type="date"
                      value={filterDate}
                      onChange={(e) => setFilterDate(e.target.value)}
                      className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>
                  <div className="min-w-[130px]">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status</label>
                    <select
                      value={filters.status}
                      onChange={(e) => setFilters({...filters, status: e.target.value})}
                      className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    >
                      <option value="all">All</option>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div className="min-w-[130px]">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Payment Status</label>
                    <select
                      value={filters.paymentStatus}
                      onChange={(e) => setFilters({...filters, paymentStatus: e.target.value})}
                      className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    >
                      <option value="all">All</option>
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="failed">Failed</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </div>
                  <div className="min-w-[130px]">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Payment Method</label>
                    <select
                      value={filters.paymentMethod}
                      onChange={(e) => setFilters({...filters, paymentMethod: e.target.value})}
                      className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    >
                      <option value="all">All</option>
                      <option value="online">Online</option>
                      <option value="cash">Cash</option>
                      <option value="counter">Counter</option>
                    </select>
                  </div>
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <XCircleIcon size={14} />
                    Clear
                  </button>
                </div>
              </div>
            )}

            {/* Table Container - Full Width */}
            <div className="admin-dash__card-body p-0 overflow-x-auto" style={{ backgroundColor: '#ffffff' }}>
              {filteredBookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 py-20 text-gray-400">
                  <Calendar size={48} className="opacity-20" />
                  <p className="text-lg font-medium">No bookings found</p>
                  <p className="text-sm">Try adjusting your filters.</p>
                </div>
              ) : (
                <table className="w-full min-w-[1200px] text-left">
                  <thead>
                    <tr className="border-b border-gray-100" style={{ backgroundColor: '#f9fafb' }}>
                      <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">#</th>
                      <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Cabin</th>
                      <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Customer</th>
                      <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Date & Time</th>
                      <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Hours</th>
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
                      const terms = getTermsBadge(b.termsAccepted);
                      const isCashPending = (b.paymentMethod === 'cash' || b.paymentMethod === 'counter') && b.paymentStatus === 'pending';
                      
                      return (
                        <tr key={b._id} className="transition-colors group hover:bg-gray-50/80">
                          <td className="p-4">
                            <span className="text-sm font-semibold text-gray-400">#{idx + 1}</span>
                          </td>
                          <td className="p-4">
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">{b.cabinId?.name || 'Unknown'}</p>
                              <p className="text-[10px] text-gray-400 flex items-center gap-1">
                                <MapPin size={10} /> {b.cabinId?.address?.split(',')[0] || 'N/A'}
                              </p>
                            </div>
                          </td>
                          <td className="p-4">
                            <p className="font-medium text-gray-800 text-sm">{b.name || 'N/A'}</p>
                            <p className="text-xs text-gray-400">{b.mobile || 'N/A'}</p>
                          </td>
                          <td className="p-4">
                            <p className="text-sm text-gray-700">{b.startDate}</p>
                            <p className="text-xs text-gray-400">{b.startTime} - {b.endTime}</p>
                          </td>
                          <td className="p-4">
                            <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold">{b.totalHours}h</span>
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
                            <span className="text-sm font-bold text-indigo-600">₹{b.totalPrice}</span>
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
                                    setSelectedCabin("");
                                    setSelectedCabinData(null);
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

            {/* Footer with stats */}
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
            {/* Header */}
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
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Cabin</p>
                  <p className="mt-1 font-semibold text-gray-800">{viewBooking.cabinId?.name || 'N/A'}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Customer</p>
                  <p className="mt-1 font-semibold text-gray-800">{viewBooking.name || 'N/A'}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Mobile</p>
                  <p className="mt-1 font-semibold text-gray-800">{viewBooking.mobile || 'N/A'}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email</p>
                  <p className="mt-1 font-semibold text-gray-800 text-sm break-all">{viewBooking.email || 'N/A'}</p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Schedule</p>
                <p className="mt-1 font-semibold text-gray-800">{viewBooking.startDate} {viewBooking.startTime} - {viewBooking.endDate} {viewBooking.endTime}</p>
                <p className="text-xs text-gray-500 mt-0.5">{viewBooking.totalHours}h • {viewBooking.bookingBasis === 'plan' ? 'Plan' : 'Hourly'}</p>
              </div>

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
                <div className="flex justify-between text-sm"><span className="text-gray-500">GST (18%)</span><span>₹{viewBooking.gstAmount || 0}</span></div>
                <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2 mt-2">
                  <span>Total</span>
                  <span className="text-indigo-600">₹{viewBooking.totalPrice || 0}</span>
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

      {/* ====================== */}
      {/* REPLACE BOOKING MODAL WITH PRICE DIFFERENCE */}
      {/* ====================== */}
      {showReplaceModal && replaceBooking && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowReplaceModal(false)}>
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-5 rounded-t-3xl flex justify-between items-center shrink-0">
              <div>
                <h3 className="text-xl font-bold">Replace Space</h3>
                <p className="text-sm text-blue-200">{replaceBooking.cabinId?.name} → New Space</p>
              </div>
              <button onClick={() => setShowReplaceModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4 overflow-y-auto flex-1">
              <div className="bg-blue-50 rounded-xl p-4 text-sm">
                <p className="font-bold text-blue-800">Current Booking</p>
                <p className="text-slate-600 mt-1">{replaceBooking.cabinId?.name}</p>
                <p className="text-xs text-slate-500">{replaceBooking.startDate} {replaceBooking.startTime} - {replaceBooking.endDate} {replaceBooking.endTime}</p>
                <p className="text-xs font-bold text-slate-700 mt-1">Total: ₹{replaceBooking.totalPrice}</p>
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
                      .filter(c => c._id !== replaceBooking.cabinId?._id)
                      .map(c => (
                        <option key={c._id} value={c._id}>
                          {c.name} - ₹{c.price}/hr
                        </option>
                      ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* ─── PRICE DIFFERENCE DISPLAY ─── */}
              {selectedCabinData && priceDiff && (
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-3">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Price Comparison</p>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-[10px] text-blue-600 font-medium">Current Cabin</p>
                      <p className="font-bold text-slate-800">₹{replaceBooking.cabinId?.price}/hr</p>
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

                  <div className="text-[10px] text-slate-400 flex justify-between border-t border-gray-200 pt-2">
                    <span>Current Total: ₹{Math.round(priceDiff.currentWithGst)}</span>
                    <span>New Total: ₹{Math.round(priceDiff.totalWithGst)}</span>
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

      {/* ====================== */}
      {/* CANCEL BOOKING MODAL */}
      {/* ====================== */}
      {showCancelModal && cancelBooking && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowCancelModal(false)}>
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-br from-red-600 to-red-700 text-white p-5 rounded-t-3xl flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">Cancel Booking</h3>
                <p className="text-sm text-red-200">{cancelBooking.cabinId?.name}</p>
              </div>
              <button onClick={() => setShowCancelModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-red-50 rounded-xl p-4 text-sm">
                <p className="font-bold text-red-800">Are you sure you want to cancel this booking?</p>
                <div className="mt-2 space-y-1 text-slate-600">
                  <p><span className="text-slate-500">Cabin:</span> {cancelBooking.cabinId?.name}</p>
                  <p><span className="text-slate-500">Date:</span> {cancelBooking.startDate} {cancelBooking.startTime} - {cancelBooking.endDate} {cancelBooking.endTime}</p>
                  <p><span className="text-slate-500">Total:</span> ₹{cancelBooking.totalPrice}</p>
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
                <p className="text-sm text-yellow-100">₹{paymentBooking.totalPrice}</p>
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
                          if(s === 'paid') setAmountPaid(paymentBooking.totalPrice);
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

export default MyBookings;