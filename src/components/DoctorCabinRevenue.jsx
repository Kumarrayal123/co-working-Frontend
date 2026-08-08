// DoctorCabinRevenue.jsx - COMPLETE FIXED CODE WITH DETAILS POPUP
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
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
  Circle,
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Clock,
  Tag,
  CreditCard,
  Calendar as CalendarIcon,
  FileText,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { toast } from "react-toastify";
import * as XLSX from 'xlsx';
import DoctorNavbar from "./DoctorNavbar";
import "./Dashboard.css";

const API_URL = "https://spaceapi.iryax.com";

const formatCurrency = (amount) => {
  return `₹${(amount || 0).toLocaleString('en-IN')}`;
};

// ===================== ATTRACTIVE PIE CHART WITH GRADIENTS =====================
const CustomPieChart = ({ data, gradientColors }) => {
  const validData = (data || []).filter(d => d && typeof d.value === 'number' && d.value > 0);

  if (!validData || validData.length === 0) {
    return <div className="flex flex-col items-center justify-center h-48 text-gray-400"><PieChart size={32} className="opacity-20 mb-2" /><p className="text-sm font-medium">No data available</p></div>;
  }

  const total = validData.reduce((sum, d) => sum + d.value, 0);
  
  const defaultGradients = [
    ['#6366f1', '#8b5cf6'], ['#8b5cf6', '#d946ef'], ['#ec4899', '#f43f5e'],
    ['#f59e0b', '#f97316'], ['#10b981', '#34d399'], ['#3b82f6', '#06b6d4'],
    ['#ef4444', '#f87171'], ['#06b6d4', '#22d3ee'], ['#f472b6', '#f9a8d4']
  ];

  let cumulativePercent = 0;
  const slices = validData.map((item, index) => {
    const percentage = total > 0 ? (item.value / total) * 100 : 0;
    const startPercent = cumulativePercent;
    cumulativePercent += percentage;
    const gradient = gradientColors?.[index] || defaultGradients[index % defaultGradients.length];
    return { ...item, percentage, startPercent, gradient };
  });

  // Format large numbers - show in K, L, Cr format
  const formatValue = (value) => {
    if (value >= 10000000) return `₹${(value/10000000).toFixed(1)}Cr`;
    if (value >= 100000) return `₹${(value/100000).toFixed(1)}L`;
    if (value >= 1000) return `₹${(value/1000).toFixed(1)}K`;
    return `₹${value}`;
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="relative">
        <svg width={220} height={220} viewBox="0 0 220 220">
          <defs>
            {slices.map((slice, index) => (
              <linearGradient key={`grad-${index}`} id={`pie-grad-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={slice.gradient[0]} stopOpacity="1" />
                <stop offset="100%" stopColor={slice.gradient[1]} stopOpacity="0.9" />
              </linearGradient>
            ))}
            <filter id="glow"><feGaussianBlur stdDeviation="3" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          </defs>
          
          {slices.map((slice, index) => {
            const startAngle = (slice.startPercent / 100) * 360;
            const endAngle = ((slice.startPercent + slice.percentage) / 100) * 360;
            const x1 = 110 + 80 * Math.cos((startAngle - 90) * Math.PI / 180);
            const y1 = 110 + 80 * Math.sin((startAngle - 90) * Math.PI / 180);
            const x2 = 110 + 80 * Math.cos((endAngle - 90) * Math.PI / 180);
            const y2 = 110 + 80 * Math.sin((endAngle - 90) * Math.PI / 180);
            const largeArc = slice.percentage > 50 ? 1 : 0;
            return <path key={index} d={`M 110 110 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`} fill={`url(#pie-grad-${index})`} stroke="#fff" strokeWidth="3" filter="url(#glow)" className="transition-all duration-300 cursor-pointer hover:opacity-80 hover:scale-105" />;
          })}
          
          <circle cx={110} cy={110} r={38} fill="white" opacity="0.95" />
          <circle cx={110} cy={110} r={38} stroke="#e5e7eb" strokeWidth="1.5" fill="none" opacity="0.5" />
          <text x={110} y={106} textAnchor="middle" className="text-base font-bold fill-gray-800">{formatValue(total)}</text>
          <text x={110} y={123} textAnchor="middle" className="text-[8px] fill-gray-400 font-medium">Total</text>
        </svg>
        <div className="absolute inset-0 pointer-events-none rounded-full overflow-hidden">
          <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-white via-transparent to-transparent opacity-20 rounded-full transform -translate-x-1/4 -translate-y-1/4"></div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-1.5 mt-3 max-w-full">
        {slices.map((slice, index) => (
          <div key={index} className="flex items-center gap-1 px-2 py-0.5 bg-white rounded-full border border-gray-200 hover:shadow-lg hover:scale-105 transition-all duration-200 shadow-sm text-[8px] max-w-full">
            <div className="w-2 h-2 rounded-full shadow-sm flex-shrink-0" style={{ background: `linear-gradient(135deg, ${slice.gradient[0]}, ${slice.gradient[1]})` }} />
            <span className="text-gray-600 font-medium truncate max-w-[50px]">{slice.label}</span>
            <span className="font-bold text-gray-800 whitespace-nowrap">{formatValue(slice.value)}</span>
            <span className="text-gray-400 bg-gray-50 px-1 py-0.5 rounded-full whitespace-nowrap">({slice.percentage.toFixed(1)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ===================== BOOKING DETAILS POPUP COMPONENT =====================
const BookingDetailsPopup = ({ booking, onClose }) => {
  if (!booking) return null;

  const statusBadge = (status) => {
    const map = {
      pending: { label: 'Pending', color: 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white' },
      confirmed: { label: 'Confirmed', color: 'bg-gradient-to-r from-emerald-400 to-emerald-500 text-white' },
      active: { label: 'Active', color: 'bg-gradient-to-r from-indigo-400 to-indigo-500 text-white' },
      completed: { label: 'Completed', color: 'bg-gradient-to-r from-blue-400 to-blue-500 text-white' },
      cancelled: { label: 'Cancelled', color: 'bg-gradient-to-r from-red-400 to-red-500 text-white' }
    };
    return map[status?.toLowerCase()] || { label: status || 'Unknown', color: 'bg-gradient-to-r from-gray-400 to-gray-500 text-white' };
  };

  const paymentBadge = (status) => {
    const map = {
      paid: { label: 'Paid', color: 'bg-gradient-to-r from-emerald-400 to-emerald-500 text-white' },
      pending: { label: 'Pending', color: 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white' },
      failed: { label: 'Failed', color: 'bg-gradient-to-r from-red-400 to-red-500 text-white' },
      refunded: { label: 'Refunded', color: 'bg-gradient-to-r from-purple-400 to-purple-500 text-white' }
    };
    return map[status?.toLowerCase()] || { label: status || 'Unknown', color: 'bg-gradient-to-r from-gray-400 to-gray-500 text-white' };
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  const status = statusBadge(booking.status);
  const payment = paymentBadge(booking.paymentStatus);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 animate-slideUp">
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white px-6 py-4 flex items-center justify-between z-10 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <Receipt size={18} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Booking Details</h3>
              <p className="text-xs text-white/70">ID: #{booking._id?.slice(-8) || 'N/A'}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors backdrop-blur-sm">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="bg-gradient-to-br from-indigo-50/80 via-purple-50/80 to-pink-50/80 rounded-xl p-4 border border-indigo-100 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200 flex-shrink-0">
                <Building2 size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-bold text-gray-800">{booking.cabin?.name || 'Unknown Cabin'}</h4>
                {booking.cabin?.address && (
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><MapPin size={12} />{booking.cabin.address}</p>
                )}
                <span className="inline-block mt-1 text-[8px] bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-2 py-0.5 rounded-full font-medium shadow-sm">✦ Cabin</span>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={`px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1.5 ${status.color}`}>{status.label}</span>
                <span className={`px-3 py-0.5 text-[10px] font-bold rounded-full ${payment.color}`}>{payment.label}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-50/80 to-cyan-50/80 rounded-xl p-4 border border-blue-100 shadow-sm">
              <h5 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-3 flex items-center gap-2"><User size={14} /> Customer Details</h5>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-800">{booking.name || booking.user?.name || 'N/A'}</p>
                <p className="text-xs text-gray-600 flex items-center gap-2"><Phone size={12} className="text-blue-400" />{booking.mobile || booking.user?.mobile || 'N/A'}</p>
                {booking.email && <p className="text-xs text-gray-600 flex items-center gap-2"><Mail size={12} className="text-blue-400" />{booking.email}</p>}
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50/80 to-pink-50/80 rounded-xl p-4 border border-purple-100 shadow-sm">
              <h5 className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-3 flex items-center gap-2"><CalendarIcon size={14} /> Booking Details</h5>
              <div className="space-y-2">
                <p className="text-xs text-gray-600 flex items-center gap-2"><Clock size={12} className="text-purple-400" /><span className="font-medium">Created:</span> {formatDate(booking.createdAt)}</p>
                {booking.bookingDate && <p className="text-xs text-gray-600 flex items-center gap-2"><CalendarIcon size={12} className="text-purple-400" /><span className="font-medium">Booking Date:</span> {formatDate(booking.bookingDate)}</p>}
                {booking.timeSlot && <p className="text-xs text-gray-600 flex items-center gap-2"><Clock size={12} className="text-purple-400" /><span className="font-medium">Time Slot:</span> {booking.timeSlot}</p>}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50/80 via-teal-50/80 to-cyan-50/80 rounded-xl p-4 border border-emerald-100 shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Amount</p><p className="text-xl font-bold text-emerald-600">{formatCurrency(booking.totalPrice)}</p></div>
              {booking.discount && booking.discount > 0 && <div><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Discount</p><p className="text-lg font-bold text-purple-600">-{formatCurrency(booking.discount)}</p></div>}
              {booking.tax && booking.tax > 0 && <div><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tax</p><p className="text-lg font-bold text-amber-600">+{formatCurrency(booking.tax)}</p></div>}
              <div><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Payment Method</p><p className="text-sm font-semibold text-gray-700 capitalize flex items-center gap-1"><CreditCard size={12} className="text-emerald-500" />{booking.paymentMethod || 'N/A'}</p></div>
            </div>
          </div>

          {(booking.notes || booking.specialRequests) && (
            <div className="bg-gradient-to-br from-gray-50/80 to-slate-50/80 rounded-xl p-4 border border-gray-100 shadow-sm">
              <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2"><FileText size={14} /> Additional Notes</h5>
              <p className="text-sm text-gray-600">{booking.notes || booking.specialRequests || 'No additional notes'}</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-semibold transition-all">Close</button>
            <button onClick={() => window.print()} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-600 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2">
              <Receipt size={16} /> Print Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ===================== MAIN COMPONENT =====================
const DoctorCabinRevenue = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    completedBookings: 0,
    pendingPayments: 0,
    avgRevenuePerBooking: 0,
    revenueByCabin: [],
    revenueByMonth: [],
    revenueByStatus: []
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPaymentStatus, setFilterPaymentStatus] = useState("all");
  const [filterCabin, setFilterCabin] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [availableCabins, setAvailableCabins] = useState([]);
  const [viewMode, setViewMode] = useState("chart");
  
  // Popup state
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
      pending: { label: 'Pending', color: 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white' },
      confirmed: { label: 'Confirmed', color: 'bg-gradient-to-r from-emerald-400 to-emerald-500 text-white' },
      active: { label: 'Active', color: 'bg-gradient-to-r from-indigo-400 to-indigo-500 text-white' },
      completed: { label: 'Completed', color: 'bg-gradient-to-r from-blue-400 to-blue-500 text-white' },
      cancelled: { label: 'Cancelled', color: 'bg-gradient-to-r from-red-400 to-red-500 text-white' }
    };
    return map[status?.toLowerCase()] || { label: status || 'Unknown', color: 'bg-gradient-to-r from-gray-400 to-gray-500 text-white' };
  };

  const getPaymentStatusBadge = (status) => {
    const map = {
      paid: { label: 'Paid', color: 'bg-gradient-to-r from-emerald-400 to-emerald-500 text-white' },
      pending: { label: 'Pending', color: 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white' },
      failed: { label: 'Failed', color: 'bg-gradient-to-r from-red-400 to-red-500 text-white' },
      refunded: { label: 'Refunded', color: 'bg-gradient-to-r from-purple-400 to-purple-500 text-white' }
    };
    return map[status?.toLowerCase()] || { label: status || 'Unknown', color: 'bg-gradient-to-r from-gray-400 to-gray-500 text-white' };
  };

  const calculateStats = (data) => {
    const cabinBookings = data.filter(b => b.bookingType !== 'visit');

    const totalRevenue = cabinBookings
      .filter(b => b.status === 'completed' || b.status === 'confirmed')
      .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

    const completedBookings = cabinBookings.filter(b => b.status === 'completed').length;
    const pendingPayments = cabinBookings.filter(b => b.paymentStatus === 'pending').length;

    const revenueByCabinMap = new Map();
    cabinBookings.forEach(b => {
      if (b.cabin && b.cabin._id) {
        const cabinName = b.cabin.name || 'Unknown Cabin';
        if (!revenueByCabinMap.has(cabinName)) {
          revenueByCabinMap.set(cabinName, { name: cabinName, revenue: 0, count: 0 });
        }
        revenueByCabinMap.get(cabinName).revenue += (b.totalPrice || 0);
        revenueByCabinMap.get(cabinName).count += 1;
      }
    });
    const revenueByCabin = Array.from(revenueByCabinMap.values()).sort((a, b) => b.revenue - a.revenue);

    const revenueByMonthMap = new Map();
    cabinBookings.forEach(b => {
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
    const revenueByMonth = Array.from(revenueByMonthMap.values()).sort((a, b) => {
      return new Date(a.year, new Date(`${a.month} 1`).getMonth()) - new Date(b.year, new Date(`${b.month} 1`).getMonth());
    });

    const statusMap = new Map();
    cabinBookings.forEach(b => {
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
      totalBookings: cabinBookings.length,
      completedBookings,
      pendingPayments,
      avgRevenuePerBooking,
      revenueByCabin,
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

        const cabinMap = new Map();
        bookingsData.forEach(b => {
          if (b.cabin && b.cabin._id) {
            cabinMap.set(b.cabin._id, b.cabin.name);
          }
        });
        setAvailableCabins(Array.from(cabinMap.entries()).map(([id, name]) => ({ id, name })));

        calculateStats(bookingsData);
      } else {
        toast.error(res.data.message || "Failed to fetch bookings");
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      toast.error(err.response?.data?.error || "Failed to fetch bookings");
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
        b.name?.toLowerCase().includes(term) ||
        b.user?.name?.toLowerCase().includes(term)
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter(b => b.status === filterStatus);
    }

    if (filterPaymentStatus !== "all") {
      filtered = filtered.filter(b => b.paymentStatus === filterPaymentStatus);
    }

    if (filterCabin !== "all") {
      filtered = filtered.filter(b => b.cabin?._id === filterCabin);
    }

    if (dateFrom) {
      const from = new Date(dateFrom);
      from.setHours(0, 0, 0, 0);
      filtered = filtered.filter(b => {
        if (!b.createdAt) return false;
        return new Date(b.createdAt) >= from;
      });
    }

    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
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
    setFilterCabin("all");
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

      const exportData = filteredBookings.filter(b => b.bookingType !== 'visit').map((b, index) => ({
        'S.No': index + 1,
        'Cabin Name': b.cabin?.name || 'N/A',
        'Customer': b.name || b.user?.name || 'N/A',
        'Mobile': b.mobile || b.user?.mobile || 'N/A',
        'Amount': b.totalPrice || 0,
        'Status': b.status || 'N/A',
        'Payment Status': b.paymentStatus || 'N/A',
        'Date': b.createdAt ? formatDateDMY(b.createdAt) : 'N/A'
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Cabin_Revenue');
      XLSX.writeFile(wb, `cabin_revenue_${new Date().toISOString().split('T')[0]}.xlsx`);
      toast.success(`Exported ${exportData.length} bookings to Excel!`);
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

  const getMaxRevenue = (data) => {
    if (!data || data.length === 0) return 100;
    const max = Math.max(...data.map(d => d.revenue));
    return max > 0 ? max : 100;
  };

  const maxRevenue = getMaxRevenue(stats.revenueByMonth);
  const hasActiveFilters = () => {
    return searchTerm !== "" || filterStatus !== "all" || filterPaymentStatus !== "all" ||
           filterCabin !== "all" || dateFrom !== "" || dateTo !== "";
  };

  const cabinGradients = [
    ['#6366f1', '#8b5cf6'], ['#8b5cf6', '#d946ef'], ['#ec4899', '#f43f5e'],
    ['#f59e0b', '#f97316'], ['#10b981', '#34d399'], ['#3b82f6', '#06b6d4']
  ];

  const displayBookings = filteredBookings.filter(b => b.bookingType !== 'visit');

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
        <DoctorNavbar />
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dash" style={{ backgroundColor: '#f8fafc' }}>
      <DoctorNavbar />

      <div className="pt-24 px-3 sm:px-4 md:px-6 lg:px-8 max-w-full mx-auto pb-16">
        {/* Header with Gradient */}
        <div className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-6 shadow-xl shadow-indigo-200">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4"></div>
          
          <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-full text-[8px] font-bold text-white uppercase tracking-wider">✦ Cabin</div>
                <div className="px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-full text-[8px] font-bold text-white uppercase tracking-wider">Revenue Analytics</div>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
                <Sparkles size={24} className="text-yellow-300" />
                Cabin Revenue
              </h1>
              <p className="text-white/80 text-sm">Track and analyze your cabin earnings in real-time</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 text-white">
                <p className="text-[8px] font-bold uppercase tracking-wider text-white/70">Total Revenue</p>
                <p className="text-xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
              </div>
              <button onClick={exportToExcel} className="flex items-center gap-1.5 px-4 py-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-xl text-xs font-semibold transition-all border border-white/20">
                <Download size={14} /> Export
              </button>
              <button onClick={() => navigate("/chamberbookings")} className="flex items-center gap-1.5 px-4 py-2 bg-white text-indigo-600 rounded-xl text-xs font-semibold hover:shadow-lg transition-all hover:scale-105">
                <Building2 size={14} /> View All
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
          <div className="bg-gradient-to-br from-emerald-50 via-emerald-100/50 to-emerald-200/30 rounded-xl border border-emerald-200 p-3 shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-wider">Total Revenue</span>
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-200 group-hover:scale-110 transition">
                <IndianRupee size={14} />
              </div>
            </div>
            <div className="text-xl font-bold text-emerald-700 mt-1">{formatCurrency(stats.totalRevenue)}</div>
            <div className="text-[8px] text-emerald-500/70">{stats.completedBookings} completed bookings</div>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 via-indigo-100/50 to-indigo-200/30 rounded-xl border border-indigo-200 p-3 shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold text-indigo-700 uppercase tracking-wider">Total Bookings</span>
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:scale-110 transition">
                <Calendar size={14} />
              </div>
            </div>
            <div className="text-xl font-bold text-indigo-700 mt-1">{stats.totalBookings}</div>
            <div className="text-[8px] text-indigo-500/70">Total cabin bookings</div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 via-purple-100/50 to-purple-200/30 rounded-xl border border-purple-200 p-3 shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold text-purple-700 uppercase tracking-wider">Avg Per Booking</span>
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-200 group-hover:scale-110 transition">
                <TrendingUp size={14} />
              </div>
            </div>
            <div className="text-xl font-bold text-purple-700 mt-1">{formatCurrency(stats.avgRevenuePerBooking)}</div>
            <div className="text-[8px] text-purple-500/70">Average revenue</div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 via-blue-100/50 to-blue-200/30 rounded-xl border border-blue-200 p-3 shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold text-blue-700 uppercase tracking-wider">Completed</span>
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-200 group-hover:scale-110 transition">
                <CheckCircle size={14} />
              </div>
            </div>
            <div className="text-xl font-bold text-blue-700 mt-1">{stats.completedBookings}</div>
            <div className="text-[8px] text-blue-500/70">Successfully completed</div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 via-amber-100/50 to-amber-200/30 rounded-xl border border-amber-200 p-3 shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold text-amber-700 uppercase tracking-wider">Pending Payments</span>
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-lg shadow-amber-200 group-hover:scale-110 transition">
                <AlertCircle size={14} />
              </div>
            </div>
            <div className="text-xl font-bold text-amber-700 mt-1">{stats.pendingPayments}</div>
            <div className="text-[8px] text-amber-500/70">Awaiting payment</div>
          </div>
        </div>

        {/* Revenue Trend Alert */}
        {trend.trend !== 'neutral' && stats.revenueByMonth.length > 1 && (
          <div className={`mb-4 px-4 py-3 rounded-xl flex items-center gap-3 ${
            trend.trend === 'up' ? 'bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 text-emerald-700' : 'bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-700'
          } shadow-sm`}>
            {trend.trend === 'up' ? <ArrowUpRight size={18} className="text-emerald-500" /> : <ArrowDownRight size={18} className="text-red-500" />}
            <span className="text-sm font-medium">
              {trend.trend === 'up' ? '📈 Revenue increased by' : '📉 Revenue decreased by'} 
              <strong className="mx-1">{trend.percentage}%</strong> compared to last month
            </span>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white shadow-sm shadow-indigo-200">
                <Filter size={16} />
              </div>
              <div><h4 className="text-sm font-semibold text-gray-800">Filters</h4><p className="text-[10px] text-gray-400">Refine revenue data</p></div>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <div className="relative">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="text-xs bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-2.5 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 w-28 sm:w-36 transition" />
              </div>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition">
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select value={filterPaymentStatus} onChange={(e) => setFilterPaymentStatus(e.target.value)} className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition">
                <option value="all">Payment Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
              <select value={filterCabin} onChange={(e) => setFilterCabin(e.target.value)} className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition max-w-[120px]">
                <option value="all">All Cabins</option>
                {availableCabins.map(cabin => <option key={cabin.id} value={cabin.id}>{cabin.name}</option>)}
              </select>
              <div className="flex items-center gap-1">
                <span className="text-[9px] text-gray-400">From</span>
                <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 w-28 transition" />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[9px] text-gray-400">To</span>
                <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 w-28 transition" />
              </div>
              <button onClick={applyFilters} className="px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-xs font-medium hover:from-indigo-700 hover:to-purple-700 transition shadow-sm shadow-indigo-200 flex items-center gap-1">
                <Filter size={13} /> Apply
              </button>
              {hasActiveFilters() && <button onClick={clearFilters} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200 transition">Reset</button>}
            </div>
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center gap-1 mb-4 bg-gray-100 rounded-xl p-1 border border-gray-200 w-fit">
          <button onClick={() => setViewMode("chart")} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${viewMode === "chart" ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'}`}>
            <BarChart3 size={16} /> Charts
          </button>
          <button onClick={() => setViewMode("summary")} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${viewMode === "summary" ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'}`}>
            <PieChart size={16} /> Summary
          </button>
          <button onClick={() => setViewMode("table")} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${viewMode === "table" ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md' : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'}`}>
            <Receipt size={16} /> Details
          </button>
        </div>

        {/* ============================================= */}
        {/* CHART VIEW - PIE CHARTS IN SINGLE ROW */}
        {/* ============================================= */}
        {viewMode === "chart" && (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-white via-gray-50 to-gray-100/50 rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
                    <CalendarDays size={14} />
                  </div>
                  Monthly Revenue
                </h3>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Total: {formatCurrency(stats.totalRevenue)}</span>
                  {trend.trend === 'up' && <span className="text-xs font-medium text-emerald-600 bg-gradient-to-r from-emerald-50 to-emerald-100 px-2 py-1 rounded-full flex items-center gap-1"><ArrowUpRight size={12} /> +{trend.percentage}%</span>}
                </div>
              </div>
              <div className="h-52 flex items-end justify-between gap-2 px-1">
                {stats.revenueByMonth && stats.revenueByMonth.length > 0 ? (
                  stats.revenueByMonth.map((item, idx) => {
                    const height = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0;
                    const barGradients = [
                      ['#6366f1', '#8b5cf6'], ['#8b5cf6', '#d946ef'], ['#ec4899', '#f43f5e'],
                      ['#f59e0b', '#f97316'], ['#10b981', '#34d399'], ['#3b82f6', '#06b6d4'],
                      ['#ef4444', '#f87171'], ['#06b6d4', '#22d3ee']
                    ];
                    const grad = barGradients[idx % barGradients.length];
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 group">
                        <div className="w-full flex justify-center items-end h-40">
                          <div className="w-10 rounded-t-lg transition-all duration-500 relative shadow-sm" style={{ height: `${Math.max(height, 4)}%`, background: `linear-gradient(to top, ${grad[0]}, ${grad[1]})` }}>
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-[9px] font-medium px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
                              {formatCurrency(item.revenue)}
                            </div>
                            {item.revenue === maxRevenue && (
                              <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 text-[8px] font-bold text-yellow-400 bg-gradient-to-r from-yellow-400/20 to-yellow-500/20 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">★ Highest</div>
                            )}
                          </div>
                        </div>
                        <span className="text-[8px] text-gray-500 font-medium truncate max-w-[40px]">{item.month}</span>
                        <span className="text-[7px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-full">{item.count}</span>
                      </div>
                    );
                  })
                ) : (
                  <div className="w-full text-center text-gray-400 text-sm py-8">No revenue data available</div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/30 rounded-xl border border-gray-200 p-4 shadow-md hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-sm">
                      <Building2 size={13} />
                    </div>
                    Revenue by Cabin
                  </h3>
                  <span className="text-[10px] font-medium text-gray-400 bg-white px-2 py-0.5 rounded-full border border-gray-200 shadow-sm">{stats.revenueByCabin?.length || 0} cabins</span>
                </div>
                {stats.revenueByCabin && stats.revenueByCabin.length > 0 ? (
                  <CustomPieChart data={stats.revenueByCabin.map(item => ({ label: item.name, value: item.revenue }))} gradientColors={cabinGradients} />
                ) : (
                  <div className="flex flex-col items-center justify-center h-48 text-gray-400"><PieChart size={32} className="opacity-20 mb-2" /><p className="text-sm font-medium">No cabin revenue data available</p></div>
                )}
              </div>

              <div className="bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 rounded-xl border border-gray-200 p-4 shadow-md hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-sm">
                      <Layers size={13} />
                    </div>
                    Revenue by Status
                  </h3>
                  <span className="text-[10px] font-medium text-gray-400 bg-white px-2 py-0.5 rounded-full border border-gray-200 shadow-sm">{stats.revenueByStatus?.length || 0} statuses</span>
                </div>
                {stats.revenueByStatus && stats.revenueByStatus.length > 0 ? (
                  <CustomPieChart 
                    data={stats.revenueByStatus.map(item => ({
                      label: getStatusBadge(item.status).label,
                      value: item.revenue
                    }))} 
                    gradientColors={[
                      ['#10b981', '#34d399'],
                      ['#6366f1', '#8b5cf6'],
                      ['#f59e0b', '#f97316'],
                      ['#ef4444', '#f87171'],
                      ['#8b5cf6', '#d946ef']
                    ]}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-48 text-gray-400"><PieChart size={32} className="opacity-20 mb-2" /><p className="text-sm font-medium">No status revenue data available</p></div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-emerald-50 via-emerald-100/50 to-emerald-200/30 rounded-xl border border-emerald-200 p-4 shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-200 group-hover:scale-110 transition">
                    <IndianRupee size={18} />
                  </div>
                  <div><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Revenue</p><p className="text-lg font-bold text-emerald-600">{formatCurrency(stats.totalRevenue)}</p></div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 via-purple-100/50 to-purple-200/30 rounded-xl border border-purple-200 p-4 shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-purple-200 group-hover:scale-110 transition">
                    <TrendingUp size={18} />
                  </div>
                  <div><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Avg Revenue</p><p className="text-lg font-bold text-purple-600">{formatCurrency(stats.avgRevenuePerBooking)}</p></div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-cyan-50 via-cyan-100/50 to-cyan-200/30 rounded-xl border border-cyan-200 p-4 shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center text-white shadow-md shadow-cyan-200 group-hover:scale-110 transition">
                    <Users size={18} />
                  </div>
                  <div><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Unique Cabins</p><p className="text-lg font-bold text-cyan-600">{availableCabins.length}</p></div>
                </div>
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
              { label: 'Cancelled', value: displayBookings.filter(b => b.status === 'cancelled').length, icon: XCircle, color: 'rose' },
              { label: 'Unique Cabins', value: availableCabins.length, icon: Users, color: 'cyan' },
              { label: 'Completion Rate', value: stats.totalBookings > 0 ? Math.round((stats.completedBookings / stats.totalBookings) * 100) : 0 + '%', icon: Percent, color: 'orange' }
            ].map((item, idx) => (
              <div key={idx} className={`bg-gradient-to-br from-${item.color}-50 via-${item.color}-100/50 to-${item.color}-200/30 rounded-xl border border-${item.color}-200 p-4 shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-${item.color}-500 to-${item.color}-600 flex items-center justify-center text-white shadow-md`}>
                    <item.icon size={18} />
                  </div>
                  <div><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{item.label}</p><p className="text-lg font-bold text-${item.color}-600">{item.value}</p></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ============================================= */}
        {/* TABLE VIEW WITH POPUP ON VIEW ICON CLICK */}
        {/* ============================================= */}
        {viewMode === "table" && (
          <div className="bg-gradient-to-br from-white via-gray-50 to-gray-100/50 rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">
                <thead>
                  <tr className="border-b border-gray-200" style={{ backgroundColor: '#f1f5f9' }}>
                    <th className="px-3 py-2.5 text-[9px] font-bold tracking-wider text-gray-500 uppercase">#</th>
                    <th className="px-3 py-2.5 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Cabin</th>
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
                    <tr><td colSpan={8} className="px-3 py-12 text-center text-gray-400"><Receipt size={32} className="mx-auto mb-2 opacity-20" /><p className="text-sm font-medium">No cabin bookings found</p></td></tr>
                  ) : (
                    displayBookings.map((b, idx) => {
                      const status = getStatusBadge(b.status);
                      const paymentStatus = getPaymentStatusBadge(b.paymentStatus);
                      return (
                        <tr key={b._id} className="transition-colors hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50">
                          <td className="px-3 py-2.5"><span className="text-[10px] font-semibold text-gray-400">#{idx + 1}</span></td>
                          <td className="px-3 py-2.5">
                            <div><p className="font-semibold text-gray-900 text-xs">{b.cabin?.name || 'Unknown'}<span className="text-[8px] bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-1.5 py-0.5 rounded-full font-medium">Cabin</span></p><p className="text-[9px] text-gray-400">{b.cabin?.address?.split(',')[0] || 'N/A'}</p></div>
                          </td>
                          <td className="px-3 py-2.5"><p className="font-medium text-gray-800 text-xs">{b.name || b.user?.name || 'Unknown'}</p><p className="text-[9px] text-gray-400">{b.mobile || b.user?.mobile || 'N/A'}</p></td>
                          <td className="px-3 py-2.5"><span className="text-xs font-bold text-emerald-600">{formatCurrency(b.totalPrice)}</span></td>
                          <td className="px-3 py-2.5"><span className={`px-2 py-0.5 text-[9px] font-bold rounded-full text-white ${status.color}`}>{status.label}</span></td>
                          <td className="px-3 py-2.5"><span className={`px-2 py-0.5 text-[9px] font-bold rounded-full text-white ${paymentStatus.color}`}>{paymentStatus.label}</span></td>
                          <td className="px-3 py-2.5"><span className="text-[9px] text-gray-500">{formatDateDMY(b.createdAt)}</span></td>
                          <td className="px-3 py-2.5 text-center">
                            <button onClick={() => handleViewDetails(b)} className="p-1.5 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 hover:from-indigo-100 hover:to-purple-100 transition-all hover:shadow-md group" title="View Details">
                              <Eye size={14} className="group-hover:scale-110 transition" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-3 py-2 border-t border-gray-200 bg-gradient-to-r from-gray-50/50 to-gray-100/50 flex justify-between text-[9px] text-gray-500">
              <span className="flex items-center gap-1"><Receipt size={12} /> Showing {displayBookings.length} cabin bookings</span>
              <span className="font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Total Revenue: {formatCurrency(stats.totalRevenue)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Booking Details Popup */}
      {isPopupOpen && <BookingDetailsPopup booking={selectedBooking} onClose={closePopup} />}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
        .bg-clip-text { -webkit-background-clip: text; background-clip: text; }
        .hover\\:scale-105:hover { transform: scale(1.05); }
        .hover\\:shadow-xl:hover { box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04); }
      `}</style>
    </div>
  );
};

export default DoctorCabinRevenue;