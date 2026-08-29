// CafeRevenue.jsx - Complete Cafe Revenue Analytics
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IndianRupee,
  Calendar,
  TrendingUp,
  Download,
  Filter,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
  Receipt,
  Percent,
  BarChart3,
  PieChart,
  CalendarDays,
  Layers,
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Clock,
  CreditCard,
  Calendar as CalendarIcon,
  FileText,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Coffee,
  UtensilsCrossed
} from "lucide-react";
import { toast } from "react-toastify";
import * as XLSX from 'xlsx';
import CafeNavbar from "./CafeNavbar";
import "./Dashboard.css";

const API_URL = "https://spaceapi.iryax.com";

const formatCurrency = (amount) => {
  return `₹${(amount || 0).toLocaleString('en-IN')}`;
};

// ===================== BOOKING DETAILS POPUP =====================
const BookingDetailsPopup = ({ booking, onClose }) => {
  if (!booking) return null;

  const statusBadge = (status) => {
    const map = {
      pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
      confirmed: { label: 'Confirmed', color: 'bg-emerald-100 text-emerald-700' },
      active: { label: 'Active', color: 'bg-indigo-100 text-indigo-700' },
      completed: { label: 'Completed', color: 'bg-blue-100 text-blue-700' },
      cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700' }
    };
    return map[status?.toLowerCase()] || { label: status || 'Unknown', color: 'bg-gray-100 text-gray-700' };
  };

  const paymentBadge = (status) => {
    const map = {
      paid: { label: 'Paid', color: 'bg-emerald-100 text-emerald-700' },
      pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
      failed: { label: 'Failed', color: 'bg-red-100 text-red-700' },
      refunded: { label: 'Refunded', color: 'bg-purple-100 text-purple-700' }
    };
    return map[status?.toLowerCase()] || { label: status || 'Unknown', color: 'bg-gray-100 text-gray-700' };
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  };

  const status = statusBadge(booking.status);
  const payment = paymentBadge(booking.paymentStatus);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Receipt size={18} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Booking Details</h3>
              <p className="text-xs text-white/70">#{booking._id?.slice(-8) || 'N/A'}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-200">
              <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-2">
                <Coffee size={14} /> Cafe Details
              </p>
              <p className="mt-2 font-semibold text-gray-800">{booking.cabin?.name || 'Unknown Cafe'}</p>
              <p className="text-xs text-gray-500">{booking.cabin?.address || 'N/A'}</p>
              <p className="text-xs text-gray-500">Table: {booking.cabin?.tableNumber || booking.cabin?.cabin || 'N/A'}</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center gap-2">
                <User size={14} /> Customer
              </p>
              <p className="mt-2 font-semibold text-gray-800">{booking.name || booking.user?.name || 'N/A'}</p>
              <p className="text-xs text-gray-500">{booking.mobile || booking.user?.mobile || 'N/A'}</p>
              {booking.email && <p className="text-xs text-gray-500">{booking.email}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Start</p>
              <p className="font-semibold text-gray-800">{formatDate(booking.startDate)}</p>
              <p className="text-sm text-indigo-600">{booking.startTime}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">End</p>
              <p className="font-semibold text-gray-800">{formatDate(booking.endDate)}</p>
              <p className="text-sm text-indigo-600">{booking.endTime}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-emerald-50 rounded-xl p-4 text-center border border-emerald-200">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Amount</p>
              <p className="text-xl font-bold text-emerald-600">{formatCurrency(booking.totalPrice)}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Status</p>
              <span className={`px-3 py-1 text-xs font-bold rounded-full inline-block mt-1 ${status.color}`}>{status.label}</span>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Payment</p>
              <span className={`px-3 py-1 text-xs font-bold rounded-full inline-block mt-1 ${payment.color}`}>{payment.label}</span>
            </div>
          </div>

          <div className="flex gap-3 pt-2 border-t border-gray-200">
            <button onClick={onClose} className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-semibold">Close</button>
            <button onClick={() => window.print()} className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2">
              <Receipt size={16} /> Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ===================== MAIN COMPONENT =====================
const CafeRevenue = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    completedBookings: 0,
    pendingPayments: 0,
    avgRevenuePerBooking: 0,
    revenueByCafe: [],
    revenueByMonth: [],
    revenueByStatus: []
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPaymentStatus, setFilterPaymentStatus] = useState("all");
  const [filterCafe, setFilterCafe] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [availableCafes, setAvailableCafes] = useState([]);
  const [viewMode, setViewMode] = useState("chart");
  
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const navigate = useNavigate();

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const formatDateDMY = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  };

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

  const getPaymentStatusBadge = (status) => {
    const map = {
      paid: { label: 'Paid', color: 'bg-emerald-100 text-emerald-700' },
      pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
      failed: { label: 'Failed', color: 'bg-red-100 text-red-700' },
      refunded: { label: 'Refunded', color: 'bg-purple-100 text-purple-700' }
    };
    return map[status?.toLowerCase()] || { label: status || 'Unknown', color: 'bg-gray-100 text-gray-700' };
  };

  const isCafeBooking = (b) => {
    if (!b) return false;
    const cabin = b.cabin || b.cabinId;
    if (!cabin) return false;
    if (cabin.isCafe === true) return true;
    const name = (cabin.name || "").toLowerCase();
    return name.includes("cafe") || name.includes("coffee") || name.includes("dining") || name.includes("restaurant");
  };

  const calculateStats = (data) => {
    const cafeBookings = data.filter(b => isCafeBooking(b) && b.bookingType !== 'visit');

    const totalRevenue = cafeBookings
      .filter(b => b.status === 'completed' || b.status === 'confirmed')
      .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

    const completedBookings = cafeBookings.filter(b => b.status === 'completed').length;
    const pendingPayments = cafeBookings.filter(b => b.paymentStatus === 'pending').length;

    const revenueByCafeMap = new Map();
    cafeBookings.forEach(b => {
      if (b.cabin && b.cabin._id) {
        const cafeName = b.cabin.name || 'Unknown Cafe';
        if (!revenueByCafeMap.has(cafeName)) {
          revenueByCafeMap.set(cafeName, { name: cafeName, revenue: 0, count: 0 });
        }
        revenueByCafeMap.get(cafeName).revenue += (b.totalPrice || 0);
        revenueByCafeMap.get(cafeName).count += 1;
      }
    });
    const revenueByCafe = Array.from(revenueByCafeMap.values()).sort((a, b) => b.revenue - a.revenue);

    const revenueByMonthMap = new Map();
    cafeBookings.forEach(b => {
      if (b.createdAt) {
        const date = new Date(b.createdAt);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const monthName = date.toLocaleString('default', { month: 'short' });
        if (!revenueByMonthMap.has(monthKey)) {
          revenueByMonthMap.set(monthKey, { month: monthName, year: date.getFullYear(), revenue: 0, count: 0 });
        }
        revenueByMonthMap.get(monthKey).revenue += (b.totalPrice || 0);
        revenueByMonthMap.get(monthKey).count += 1;
      }
    });
    const revenueByMonth = Array.from(revenueByMonthMap.values());

    const statusMap = new Map();
    cafeBookings.forEach(b => {
      const status = b.status || 'unknown';
      if (!statusMap.has(status)) {
        statusMap.set(status, { status, revenue: 0, count: 0 });
      }
      statusMap.get(status).revenue += (b.totalPrice || 0);
      statusMap.get(status).count += 1;
    });
    const revenueByStatus = Array.from(statusMap.values());

    const avgRevenuePerBooking = completedBookings > 0 ? totalRevenue / completedBookings : 0;

    setStats({
      totalRevenue,
      totalBookings: cafeBookings.length,
      completedBookings,
      pendingPayments,
      avgRevenuePerBooking,
      revenueByCafe,
      revenueByMonth,
      revenueByStatus
    });
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to continue");
        setLoading(false);
        return;
      }

      const res = await axios.get(
        `${API_URL}/api/bookings/owner-bookings`,
        getAuthHeader()
      );

      if (res.data.success) {
        const bookingsData = res.data.bookings || [];
        setBookings(bookingsData);
        setFilteredBookings(bookingsData);

        const cafeMap = new Map();
        bookingsData.forEach(b => {
          if (b.cabin && b.cabin._id && isCafeBooking(b)) {
            cafeMap.set(b.cabin._id, b.cabin.name);
          }
        });
        setAvailableCafes(Array.from(cafeMap.entries()).map(([id, name]) => ({ id, name })));

        calculateStats(bookingsData);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      toast.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...bookings];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(b =>
        b.cabin?.name?.toLowerCase().includes(term) ||
        b.name?.toLowerCase().includes(term)
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter(b => b.status === filterStatus);
    }

    if (filterPaymentStatus !== "all") {
      filtered = filtered.filter(b => b.paymentStatus === filterPaymentStatus);
    }

    if (filterCafe !== "all") {
      filtered = filtered.filter(b => b.cabin?._id === filterCafe);
    }

    if (dateFrom) {
      const from = new Date(dateFrom);
      filtered = filtered.filter(b => {
        if (!b.createdAt) return false;
        return new Date(b.createdAt) >= from;
      });
    }

    if (dateTo) {
      const to = new Date(dateTo);
      filtered = filtered.filter(b => {
        if (!b.createdAt) return false;
        return new Date(b.createdAt) <= to;
      });
    }

    setFilteredBookings(filtered);
    calculateStats(filtered);
    toast.success(`Filtered: ${filtered.length} bookings found`);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterStatus("all");
    setFilterPaymentStatus("all");
    setFilterCafe("all");
    setDateFrom("");
    setDateTo("");
    setFilteredBookings(bookings);
    calculateStats(bookings);
    toast.success("Filters cleared");
  };

  const exportToExcel = () => {
    try {
      if (filteredBookings.length === 0) {
        toast.warning("No data to export");
        return;
      }

      const exportData = filteredBookings.filter(b => isCafeBooking(b) && b.bookingType !== 'visit').map((b, index) => ({
        'S.No': index + 1,
        'Cafe Name': b.cabin?.name || 'N/A',
        'Table': b.cabin?.tableNumber || b.cabin?.cabin || 'N/A',
        'Customer': b.name || b.user?.name || 'N/A',
        'Mobile': b.mobile || b.user?.mobile || 'N/A',
        'Amount': b.totalPrice || 0,
        'Status': b.status || 'N/A',
        'Payment Status': b.paymentStatus || 'N/A',
        'Date': b.createdAt ? formatDateDMY(b.createdAt) : 'N/A'
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Cafe_Revenue');
      XLSX.writeFile(wb, `cafe_revenue_${new Date().toISOString().split('T')[0]}.xlsx`);
      toast.success(`Exported ${exportData.length} bookings!`);
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export");
    }
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedBooking(null);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const hasActiveFilters = () => {
    return searchTerm !== "" || filterStatus !== "all" || filterPaymentStatus !== "all" ||
           filterCafe !== "all" || dateFrom !== "" || dateTo !== "";
  };

  const displayBookings = filteredBookings.filter(b => isCafeBooking(b) && b.bookingType !== 'visit');

  // Calculate max for chart
  const maxRevenue = stats.revenueByMonth.length > 0 ? Math.max(...stats.revenueByMonth.map(d => d.revenue)) : 1;

  // Revenue trend
  const getRevenueTrend = () => {
    if (stats.revenueByMonth.length < 2) return { trend: 'neutral', percentage: 0 };
    const last = stats.revenueByMonth[stats.revenueByMonth.length - 1];
    const prev = stats.revenueByMonth[stats.revenueByMonth.length - 2];
    if (!last || !prev) return { trend: 'neutral', percentage: 0 };
    const diff = last.revenue - prev.revenue;
    const pct = prev.revenue > 0 ? (diff / prev.revenue) * 100 : 0;
    return { trend: diff > 0 ? 'up' : diff < 0 ? 'down' : 'neutral', percentage: Math.abs(pct).toFixed(1) };
  };

  const trend = getRevenueTrend();

  if (loading) {
    return (
      <div className="admin-dash" style={{ backgroundColor: '#f8fafc' }}>
        <CafeNavbar />
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dash" style={{ backgroundColor: '#f8fafc' }}>
      <CafeNavbar />

      <div className="pt-24 px-3 sm:px-4 md:px-6 lg:px-8 max-w-full mx-auto pb-16">
        {/* Header */}
        <div className="admin-dash__header mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="admin-dash__greeting">
              <span style={{ color: '#4f46e5' }}>Cafe</span> Revenue
            </h1>
            <p className="text-sm text-slate-500 mt-1">Track and analyze your cafe earnings</p>
          </div>
          <div className="flex items-center gap-2">
            {displayBookings.length > 0 && (
              <button
                onClick={exportToExcel}
                className="flex items-center gap-1.5 px-3 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium hover:bg-indigo-100 transition border border-indigo-200"
              >
                <Download size={14} /> Export
              </button>
            )}
            <button
              onClick={() => navigate("/cafe-bookings")}
              className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 transition shadow-sm shadow-indigo-200"
            >
              <UtensilsCrossed size={14} /> View All
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="admin-dash__stats" style={{ marginBottom: '16px' }}>
          {[
            {
              label: "Total Revenue",
              value: formatCurrency(stats.totalRevenue),
              meta: "completed & confirmed",
              icon: IndianRupee,
              color: "emerald"
            },
            {
              label: "Total Bookings",
              value: stats.totalBookings,
              meta: "cafe reservations",
              icon: Calendar,
              color: "indigo"
            },
            {
              label: "Avg Per Booking",
              value: formatCurrency(stats.avgRevenuePerBooking),
              meta: "average revenue",
              icon: TrendingUp,
              color: "purple"
            },
            {
              label: "Completed",
              value: stats.completedBookings,
              meta: "successfully completed",
              icon: CheckCircle,
              color: "blue"
            },
            {
              label: "Pending Payments",
              value: stats.pendingPayments,
              meta: "awaiting payment",
              icon: AlertCircle,
              color: "amber"
            }
          ].map((stat, index) => (
            <div
              key={index}
              className="admin-dash__stat"
              style={{ 
                padding: '12px 14px',
                minHeight: '80px'
              }}
            >
              <div className="admin-dash__stat-top">
                <span className="admin-dash__stat-label" style={{ fontSize: '11px' }}>{stat.label}</span>
                <div className={`admin-dash__stat-icon admin-dash__stat-icon--${stat.color}`} style={{ width: '28px', height: '28px' }}>
                  <stat.icon size={14} />
                </div>
              </div>
              <div className="admin-dash__stat-value" style={{ fontSize: '18px', fontWeight: '700' }}>{stat.value}</div>
              <div className="admin-dash__stat-meta" style={{ fontSize: '9px' }}>{stat.meta}</div>
            </div>
          ))}
        </div>

        {/* Revenue Trend Alert */}
        {trend.trend !== 'neutral' && stats.revenueByMonth.length > 1 && (
          <div className={`mb-4 px-4 py-3 rounded-xl flex items-center gap-3 ${
            trend.trend === 'up' ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' : 'bg-red-50 border border-red-200 text-red-700'
          } shadow-sm`}>
            {trend.trend === 'up' ? <ArrowUpRight size={18} className="text-emerald-500" /> : <ArrowDownRight size={18} className="text-red-500" />}
            <span className="text-sm font-medium">
              {trend.trend === 'up' ? '📈 Revenue increased by' : '📉 Revenue decreased by'} 
              <strong className="mx-1">{trend.percentage}%</strong> compared to last month
            </span>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 mb-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search cafes, customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
              />
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
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
                value={filterPaymentStatus}
                onChange={(e) => setFilterPaymentStatus(e.target.value)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
              >
                <option value="all">Payment Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
              <select
                value={filterCafe}
                onChange={(e) => setFilterCafe(e.target.value)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
              >
                <option value="all">All Cafes</option>
                {availableCafes.map(cafe => (
                  <option key={cafe.id} value={cafe.id}>{cafe.name}</option>
                ))}
              </select>
              {hasActiveFilters() && (
                <button
                  onClick={clearFilters}
                  className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                  title="Clear filters"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
          <div className="mt-1.5 text-[10px] text-gray-400">
            Showing {displayBookings.length} of {bookings.length} bookings
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center gap-1 mb-4 bg-gray-100 rounded-xl p-1 border border-gray-200 w-fit">
          <button onClick={() => setViewMode("chart")} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${viewMode === "chart" ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'}`}>
            <BarChart3 size={16} className="inline mr-2" /> Charts
          </button>
          <button onClick={() => setViewMode("summary")} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${viewMode === "summary" ? 'bg-purple-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'}`}>
            <PieChart size={16} className="inline mr-2" /> Summary
          </button>
          <button onClick={() => setViewMode("table")} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${viewMode === "table" ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'}`}>
            <Receipt size={16} className="inline mr-2" /> Details
          </button>
        </div>

        {/* ============================================= */}
        {/* CHART VIEW */}
        {/* ============================================= */}
        {viewMode === "chart" && (
          <div className="space-y-4">
            {/* Monthly Revenue Chart */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <h3 className="text-sm font-bold text-gray-700 mb-4">Monthly Revenue</h3>
              <div className="h-52 flex items-end justify-between gap-2 px-1">
                {stats.revenueByMonth && stats.revenueByMonth.length > 0 ? (
                  stats.revenueByMonth.map((item, idx) => {
                    const height = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0;
                    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                        <div className="w-full flex justify-center items-end h-40 relative">
                          <div 
                            className="w-10 rounded-t-lg transition-all duration-500 shadow-sm" 
                            style={{ 
                              height: `${Math.max(height, 4)}%`,
                              background: `linear-gradient(to top, ${colors[idx % colors.length]}, ${colors[(idx + 1) % colors.length]})`
                            }}
                          >
                            <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-[9px] font-medium px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
                              {formatCurrency(item.revenue)}
                            </div>
                          </div>
                        </div>
                        <span className="text-[8px] text-gray-500 font-medium">{item.month}</span>
                        <span className="text-[7px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-full">{item.count}</span>
                      </div>
                    );
                  })
                ) : (
                  <div className="w-full text-center text-gray-400 py-8">No revenue data available</div>
                )}
              </div>
            </div>

            {/* Pie Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                <h3 className="text-sm font-bold text-gray-700 mb-3">Revenue by Cafe</h3>
                {stats.revenueByCafe && stats.revenueByCafe.length > 0 ? (
                  <div className="space-y-2.5">
                    {stats.revenueByCafe.map((item, idx) => {
                      const total = stats.revenueByCafe.reduce((sum, d) => sum + d.revenue, 0);
                      const pct = total > 0 ? (item.revenue / total) * 100 : 0;
                      const colors = ['#6366f1', '#8b5cf6', '#d946ef', '#ec4899', '#f43f5e', '#f59e0b'];
                      return (
                        <div key={idx} className="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-2 hover:bg-gray-100 transition">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[idx % colors.length] }}></div>
                          <span className="text-xs text-gray-600 flex-1 truncate font-medium">{item.name}</span>
                          <span className="text-xs font-bold text-gray-800">{formatCurrency(item.revenue)}</span>
                          <span className="text-[10px] text-gray-400 bg-white px-1.5 py-0.5 rounded-full">({pct.toFixed(1)}%)</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center text-gray-400 py-8">No data available</div>
                )}
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                <h3 className="text-sm font-bold text-gray-700 mb-3">Revenue by Status</h3>
                {stats.revenueByStatus && stats.revenueByStatus.length > 0 ? (
                  <div className="space-y-2.5">
                    {stats.revenueByStatus.map((item, idx) => {
                      const total = stats.revenueByStatus.reduce((sum, d) => sum + d.revenue, 0);
                      const pct = total > 0 ? (item.revenue / total) * 100 : 0;
                      const status = getStatusBadge(item.status);
                      const colors = ['#10b981', '#6366f1', '#f59e0b', '#ef4444', '#8b5cf6'];
                      return (
                        <div key={idx} className="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-2 hover:bg-gray-100 transition">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[idx % colors.length] }}></div>
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${status.color}`}>{status.label}</span>
                          <span className="text-xs font-bold text-gray-800 ml-auto">{formatCurrency(item.revenue)}</span>
                          <span className="text-[10px] text-gray-400 bg-white px-1.5 py-0.5 rounded-full">({pct.toFixed(1)}%)</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center text-gray-400 py-8">No data available</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ============================================= */}
        {/* SUMMARY VIEW */}
        {/* ============================================= */}
        {viewMode === "summary" && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue), icon: IndianRupee, color: 'emerald' },
              { label: 'Total Bookings', value: stats.totalBookings, icon: Calendar, color: 'indigo' },
              { label: 'Avg Revenue', value: formatCurrency(stats.avgRevenuePerBooking), icon: TrendingUp, color: 'purple' },
              { label: 'Pending Payments', value: stats.pendingPayments, icon: AlertCircle, color: 'amber' },
              { label: 'Completed', value: stats.completedBookings, icon: CheckCircle, color: 'blue' },
              { label: 'Unique Cafes', value: availableCafes.length, icon: Coffee, color: 'indigo' },
              { label: 'Completion Rate', value: stats.totalBookings > 0 ? Math.round((stats.completedBookings / stats.totalBookings) * 100) : 0 + '%', icon: Percent, color: 'purple' }
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                    <item.icon size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{item.label}</p>
                    <p className="text-lg font-bold text-gray-800">{item.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ============================================= */}
        {/* TABLE VIEW - WITH ALL BOOKINGS */}
        {/* ============================================= */}
        {viewMode === "table" && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-3 py-2.5 text-[9px] font-bold tracking-wider text-gray-500 uppercase">#</th>
                    <th className="px-3 py-2.5 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Cafe</th>
                    <th className="px-3 py-2.5 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Table</th>
                    <th className="px-3 py-2.5 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Customer</th>
                    <th className="px-3 py-2.5 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Amount</th>
                    <th className="px-3 py-2.5 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Status</th>
                    <th className="px-3 py-2.5 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Payment</th>
                    <th className="px-3 py-2.5 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Date</th>
                    <th className="px-3 py-2.5 text-[9px] font-bold tracking-wider text-gray-500 uppercase text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {displayBookings.length === 0 ? (
                    <tr><td colSpan={9} className="px-3 py-12 text-center text-gray-400"><Coffee size={32} className="mx-auto mb-2 opacity-20" /><p className="text-sm font-medium">No cafe bookings found</p></td></tr>
                  ) : (
                    displayBookings.map((b, idx) => {
                      const status = getStatusBadge(b.status);
                      const paymentStatus = getPaymentStatusBadge(b.paymentStatus);
                      return (
                        <tr key={b._id} className="hover:bg-gray-50/80 transition-colors">
                          <td className="px-3 py-2.5"><span className="text-[10px] font-semibold text-gray-400">{idx + 1}</span></td>
                          <td className="px-3 py-2.5">
                            <div>
                              <p className="font-semibold text-gray-900 text-xs">{b.cabin?.name || 'Unknown'}</p>
                              <p className="text-[9px] text-gray-400">{b.cabin?.address?.split(',')[0] || 'N/A'}</p>
                            </div>
                          </td>
                          <td className="px-3 py-2.5"><span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">{b.cabin?.tableNumber || b.cabin?.cabin || 'N/A'}</span></td>
                          <td className="px-3 py-2.5">
                            <p className="font-medium text-gray-800 text-xs">{b.name || b.user?.name || 'Unknown'}</p>
                            <p className="text-[9px] text-gray-400">{b.mobile || b.user?.mobile || 'N/A'}</p>
                          </td>
                          <td className="px-3 py-2.5"><span className="text-xs font-bold text-emerald-600">{formatCurrency(b.totalPrice)}</span></td>
                          <td className="px-3 py-2.5"><span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${status.color}`}>{status.label}</span></td>
                          <td className="px-3 py-2.5"><span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${paymentStatus.color}`}>{paymentStatus.label}</span></td>
                          <td className="px-3 py-2.5"><span className="text-[9px] text-gray-500">{formatDateDMY(b.createdAt)}</span></td>
                          <td className="px-3 py-2.5 text-center">
                            <button onClick={() => handleViewDetails(b)} className="p-1.5 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition" title="View Details">
                              <Eye size={14} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-3 py-2 border-t border-gray-200 bg-gray-50/50 flex justify-between text-[9px] text-gray-500">
              <span className="flex items-center gap-1"><Coffee size={12} /> Showing {displayBookings.length} cafe bookings</span>
              <span className="font-semibold text-indigo-600">Total Revenue: {formatCurrency(stats.totalRevenue)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Booking Details Popup */}
      {isPopupOpen && <BookingDetailsPopup booking={selectedBooking} onClose={closePopup} />}
    </div>
  );
};

export default CafeRevenue;