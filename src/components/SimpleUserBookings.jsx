// SimpleUserBookings.jsx - Simple bookings page for regular users with seat details
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
  ArrowUpRight
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SimpleUserNavbar from "./SimpleUserNavbar";
import * as XLSX from 'xlsx';

const API_URL = "https://spaceapi.iryax.com";

const SimpleUserBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filters, setFilters] = useState({
    status: 'all',
    paymentStatus: 'all'
  });
  const navigate = useNavigate();
  
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewBooking, setViewBooking] = useState(null);

  const currentUser = (() => {
    try {
      const u = localStorage.getItem("user");
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

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        toast.error("Please login to view your bookings");
        navigate("/login");
        return;
      }

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
        localStorage.removeItem("user");
        navigate("/login");
      } else {
        toast.error("Failed to fetch bookings");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

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
        'Cabin': b.cabin?.name || 'Unknown',
        'Start': `${b.startDate} ${b.startTime}`,
        'End': `${b.endDate} ${b.endTime}`,
        'Hours': b.totalHours || 0,
        'Seats': b.seatCount || 0,
        'Total (₹)': b.totalPrice || 0,
        'Status': getStatusBadge(b.status).label,
        'Payment': getPaymentMethodBadge(b.paymentMethod).label,
        'Pmt Status': getPaymentStatusBadge(b.paymentStatus).label
      }));
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Bookings');
      XLSX.writeFile(wb, `my_bookings_${new Date().toISOString().split('T')[0]}.xlsx`);
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

  const downloadInvoice = (booking) => {
    try {
      const cabin = booking.cabin || {};
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
            <div><h1>IRYAX Workspace</h1></div>
            <div><p><strong>Invoice #${booking._id.slice(-8).toUpperCase()}</strong></p>
            <p>${new Date().toLocaleDateString()}</p></div>
          </div>
          <div class="info">
            <div><strong>Bill To:</strong><br>${booking.name || 'Customer'}<br>${booking.mobile || 'N/A'}</div>
            <div><strong>Cabin:</strong><br>${cabin.name || 'Unknown'}<br>${cabin.address || 'N/A'}</div>
          </div>
          ${booking.selectedSeats && booking.selectedSeats.length > 0 ? `
            <div class="seat-section">
              <strong>Selected Seats:</strong>
              <div style="margin-top:5px;">${seatListHtml}</div>
              <div style="margin-top:5px;font-size:12px;color:#666;">Total: ${booking.seatCount} seats</div>
            </div>
          ` : ''}
          <table>
            <tr><th>Description</th><th>Details</th><th>Amount</th></tr>
            <tr><td><strong>${cabin.name || 'Cabin Booking'}</strong></td>
            <td>${booking.startDate} ${booking.startTime} - ${booking.endDate} ${booking.endTime}<br>${booking.totalHours}h</td>
            <td>₹${(booking.subtotal || 0).toFixed(2)}</td></tr>
          </table>
          <div style="display:flex;gap:20px;margin:10px 0;flex-wrap:wrap;">
            <span><strong>Status:</strong> <span class="badge ${getStatusBadge(booking.status).color}">${getStatusBadge(booking.status).label}</span></span>
            <span><strong>Payment:</strong> <span class="badge ${getPaymentMethodBadge(booking.paymentMethod).color}">${getPaymentMethodBadge(booking.paymentMethod).label}</span></span>
          </div>
          <div class="total">Total: ₹${(booking.totalPrice || 0).toFixed(2)}</div>
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
    const matchSearch = b.cabin?.name?.toLowerCase().includes(search) ||
                        b.cabin?.address?.toLowerCase().includes(search) ||
                        b.name?.toLowerCase().includes(search) ||
                        b.mobile?.includes(searchTerm);
    const matchDate = filterDate ? b.startDate === filterDate : true;
    const matchStatus = filters.status === 'all' || b.status === filters.status;
    const matchPaymentStatus = filters.paymentStatus === 'all' || b.paymentStatus === filters.paymentStatus;
    return matchSearch && matchDate && matchStatus && matchPaymentStatus;
  });

  const totalCount = bookings.length;
  const activeCount = bookings.filter(b => b.status === 'active' || b.status === 'confirmed').length;
  const pendingCount = bookings.filter(b => b.status === 'pending').length;
  const completedCount = bookings.filter(b => b.status === 'completed').length;

  const clearFilters = () => {
    setFilters({
      status: 'all',
      paymentStatus: 'all'
    });
    setSearchTerm('');
    setFilterDate('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SimpleUserNavbar />
        <div className="pt-24 px-4 max-w-full mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-gray-500 text-sm">Loading bookings...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SimpleUserNavbar />

      <div className="pt-24 px-4 sm:px-6 md:px-8 max-w-full mx-auto pb-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
            <p className="text-sm text-gray-500">Manage all your workspace bookings</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/spaceforusers")}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition flex items-center gap-2 shadow-sm shadow-indigo-200"
            >
              <Building2 size={16} />
              Find New Space
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
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
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                placeholder="Filter by date"
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
                value={filters.paymentStatus}
                onChange={(e) => setFilters({...filters, paymentStatus: e.target.value})}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
              >
                <option value="all">Payment Status</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
              </select>
              {(filters.status !== 'all' || filters.paymentStatus !== 'all' || filterDate || searchTerm) && (
                <button
                  onClick={clearFilters}
                  className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
                  title="Clear filters"
                >
                  <XIcon size={16} />
                </button>
              )}
              {filteredBookings.length > 0 && (
                <button
                  onClick={exportToExcel}
                  className="flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium hover:bg-indigo-100 transition"
                >
                  <Download size={14} />
                  <span className="hidden xs:inline">Export</span>
                </button>
              )}
            </div>
          </div>
          <div className="mt-1.5 text-[10px] text-gray-400">
            Showing {filteredBookings.length} of {bookings.length} bookings
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          {filteredBookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <Calendar size={48} className="opacity-20 mb-3" />
              <p className="text-sm font-medium">No bookings found</p>
              <p className="text-xs text-gray-400 mt-1">
                {bookings.length === 0 ? "You haven't made any bookings yet." : "Try adjusting your filters."}
              </p>
              {bookings.length === 0 && (
                <button
                  onClick={() => navigate("/spaceforusers")}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
                >
                  Browse Spaces
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">#</th>
                    <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Cabin</th>
                    <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Date &amp; Time</th>
                    <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Hours</th>
                    <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Seats</th>
                    <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Status</th>
                    <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Payment</th>
                    <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Amount</th>
                    <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredBookings.map((b, idx) => {
                    const status = getStatusBadge(b.status);
                    const pmtMethod = getPaymentMethodBadge(b.paymentMethod);
                    const pmtStatus = getPaymentStatusBadge(b.paymentStatus);
                    const seatCount = b.seatCount || 0;
                    
                    return (
                      <tr key={b._id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="px-3 py-2">
                          <span className="text-[10px] font-semibold text-gray-400">#{idx + 1}</span>
                        </td>
                        <td className="px-3 py-2">
                          <div>
                            <p className="font-semibold text-gray-900 text-xs">
                              {b.cabin?.name || 'Unknown Cabin'}
                            </p>
                            <p className="text-[9px] text-gray-400 flex items-center gap-0.5">
                              <MapPin size={9} />
                              {b.cabin?.address?.split(',')[0] || 'N/A'}
                            </p>
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <p className="text-xs text-gray-700">{formatDate(b.startDate)}</p>
                          <p className="text-[9px] text-gray-400">
                            {b.startTime} - {b.endTime}
                          </p>
                        </td>
                        <td className="px-3 py-2">
                          <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full text-[9px] font-bold">{b.totalHours}h</span>
                        </td>
                        <td className="px-3 py-2">
                          <span className="flex items-center gap-1 text-xs font-medium text-gray-700">
                            <Armchair size={12} className="text-indigo-500" />
                            {seatCount}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${status.color}`}>{status.label}</span>
                        </td>
                        <td className="px-3 py-2">
                          <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${pmtMethod.color}`}>{pmtMethod.label}</span>
                          <span className={`ml-1 px-2 py-0.5 text-[9px] font-bold rounded-full ${pmtStatus.color}`}>{pmtStatus.label}</span>
                        </td>
                        <td className="px-3 py-2">
                          <span className="text-xs font-bold text-indigo-600">₹{b.totalPrice}</span>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleViewBooking(b)}
                              className="p-1 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition"
                              title="View"
                            >
                              <Eye size={13} />
                            </button>
                            <button
                              onClick={() => downloadInvoice(b)}
                              className="p-1 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition"
                              title="Invoice"
                            >
                              <FileDown size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-[9px] text-gray-400 font-medium tracking-wider">
          © IRYAX SPACE — All Rights Reserved
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
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Cabin</p>
                  <p className="mt-1 font-semibold text-gray-800">{viewBooking.cabin?.name || 'N/A'}</p>
                  <p className="text-xs text-gray-400">{viewBooking.cabin?.address || 'N/A'}</p>
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
                <p className="text-xs text-gray-500 mt-0.5">{viewBooking.totalHours}h</p>
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

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-indigo-600">₹{viewBooking.totalPrice || 0}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => { setShowViewModal(false); downloadInvoice(viewBooking); }}
                  className="flex-1 min-w-[120px] py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-sm"
                >
                  <FileDown size={16} className="inline mr-2" />
                  Download Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleUserBookings;