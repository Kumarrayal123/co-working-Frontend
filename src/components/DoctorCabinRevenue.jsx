// DoctorCabinRevenue.jsx - COMPLETE FIXED CODE WITH ATTRACTIVE PIE CHARTS
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
  Circle
} from "lucide-react";
import { toast } from "react-toastify";
import * as XLSX from 'xlsx';
import DoctorNavbar from "./DoctorNavbar";
import "./Dashboard.css";

const API_URL = "https://spaceapi.iryax.com";

const formatCurrency = (amount) => {
  return `₹${(amount || 0).toLocaleString('en-IN')}`;
};

// ATTRACTIVE PIE CHART WITH MULTI-COLORS AND SHINE EFFECT
const CustomPieChart = ({ data, colors, title }) => {
  // Filter out zero/negative/invalid values
  const validData = (data || []).filter(d => d && typeof d.value === 'number' && d.value > 0);

  if (!validData || validData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-gray-400">
        <PieChart size={32} className="opacity-20 mb-2" />
        <p className="text-sm font-medium">No data available</p>
      </div>
    );
  }

  const total = validData.reduce((sum, d) => sum + d.value, 0);
  
  // Extended vibrant color palette with shine effects
  const defaultColors = [
    '#6366f1', // Indigo
    '#8b5cf6', // Purple
    '#ec4899', // Pink
    '#f59e0b', // Amber
    '#10b981', // Emerald
    '#3b82f6', // Blue
    '#ef4444', // Red
    '#06b6d4', // Cyan
    '#f472b6', // Light Pink
    '#34d399', // Light Green
    '#fbbf24', // Yellow
    '#a78bfa', // Light Purple
    '#fb923c', // Orange
    '#60a5fa', // Light Blue
    '#f87171', // Light Red
  ];

  // Calculate cumulative percentages
  let cumulativePercent = 0;
  const slices = validData.map((item, index) => {
    const percentage = total > 0 ? (item.value / total) * 100 : 0;
    const startPercent = cumulativePercent;
    cumulativePercent += percentage;
    const color = colors?.[index] || defaultColors[index % defaultColors.length];
    return { ...item, percentage, startPercent, color };
  });

  const isSingleSlice = slices.length === 1;

  // Generate shine gradient for each slice
  const getShineGradient = (color, index) => {
    const shades = {
      '#6366f1': { light: '#818cf8', dark: '#4f46e5' },
      '#8b5cf6': { light: '#a78bfa', dark: '#7c3aed' },
      '#ec4899': { light: '#f472b6', dark: '#db2777' },
      '#f59e0b': { light: '#fbbf24', dark: '#d97706' },
      '#10b981': { light: '#34d399', dark: '#059669' },
      '#3b82f6': { light: '#60a5fa', dark: '#2563eb' },
      '#ef4444': { light: '#f87171', dark: '#dc2626' },
      '#06b6d4': { light: '#22d3ee', dark: '#0891b2' },
      '#f472b6': { light: '#f9a8d4', dark: '#ec4899' },
      '#34d399': { light: '#6ee7b7', dark: '#10b981' },
      '#fbbf24': { light: '#fcd34d', dark: '#f59e0b' },
      '#a78bfa': { light: '#c4b5fd', dark: '#8b5cf6' },
      '#fb923c': { light: '#fdba74', dark: '#f97316' },
      '#60a5fa': { light: '#93c5fd', dark: '#3b82f6' },
      '#f87171': { light: '#fca5a5', dark: '#ef4444' },
    };
    return shades[color] || { light: color, dark: color };
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="relative">
        <svg width={220} height={220} viewBox="0 0 220 220">
          <defs>
            {slices.map((slice, index) => {
              const shine = getShineGradient(slice.color, index);
              return (
                <radialGradient
                  key={`gradient-${index}`}
                  id={`shine-${index}`}
                  cx="40%"
                  cy="40%"
                  r="70%"
                >
                  <stop offset="0%" stopColor={shine.light} stopOpacity="1" />
                  <stop offset="70%" stopColor={slice.color} stopOpacity="1" />
                  <stop offset="100%" stopColor={shine.dark} stopOpacity="0.9" />
                </radialGradient>
              );
            })}
          </defs>
          
          {isSingleSlice ? (
            <circle
              cx={110}
              cy={110}
              r={80}
              fill={`url(#shine-0)`}
              stroke="#fff"
              strokeWidth="3"
              className="transition-all duration-300 cursor-pointer hover:opacity-80 hover:scale-105"
            />
          ) : (
            slices.map((slice, index) => {
              const startAngle = (slice.startPercent / 100) * 360;
              const endAngle = ((slice.startPercent + slice.percentage) / 100) * 360;
              const x1 = 110 + 80 * Math.cos((startAngle - 90) * Math.PI / 180);
              const y1 = 110 + 80 * Math.sin((startAngle - 90) * Math.PI / 180);
              const x2 = 110 + 80 * Math.cos((endAngle - 90) * Math.PI / 180);
              const y2 = 110 + 80 * Math.sin((endAngle - 90) * Math.PI / 180);
              const largeArc = slice.percentage > 50 ? 1 : 0;

              return (
                <path
                  key={index}
                  d={`M 110 110 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`}
                  fill={`url(#shine-${index})`}
                  stroke="#fff"
                  strokeWidth="3"
                  className="transition-all duration-300 cursor-pointer hover:opacity-80 hover:scale-105"
                />
              );
            })
          )}
          
          {/* Inner glow ring */}
          <circle cx={110} cy={110} r={38} fill="white" opacity="0.95" />
          <circle cx={110} cy={110} r={38} stroke="#e5e7eb" strokeWidth="1" fill="none" opacity="0.5" />
          
          <text x={110} y={106} textAnchor="middle" className="text-lg font-bold fill-gray-800">
            {formatCurrency(total)}
          </text>
          <text x={110} y={123} textAnchor="middle" className="text-[8px] fill-gray-400 font-medium">Total</text>
        </svg>
        
        {/* Shine overlay effect */}
        <div className="absolute inset-0 pointer-events-none rounded-full overflow-hidden">
          <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-white via-transparent to-transparent opacity-20 rounded-full transform -translate-x-1/4 -translate-y-1/4"></div>
        </div>
      </div>

      {/* Styled Legend with colored dots */}
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {slices.map((slice, index) => (
          <div key={index} className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-full border border-gray-100 hover:shadow-md transition-all duration-200">
            <div 
              className="w-2.5 h-2.5 rounded-full shadow-sm"
              style={{ backgroundColor: slice.color }}
            />
            <span className="text-[9px] text-gray-600 font-medium max-w-[60px] truncate">{slice.label}</span>
            <span className="text-[9px] font-bold text-gray-800">{formatCurrency(slice.value)}</span>
            <span className="text-[8px] text-gray-400 bg-white px-1.5 py-0.5 rounded-full">({slice.percentage.toFixed(1)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
};

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

  const pieColors = [
    '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', 
    '#10b981', '#3b82f6', '#ef4444', '#06b6d4'
  ];
  
  const statusColors = {
    completed: '#3b82f6',
    confirmed: '#10b981',
    pending: '#f59e0b',
    active: '#6366f1',
    cancelled: '#ef4444'
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
        <div className="flex justify-between items-center mb-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Cabin <span className="text-indigo-600">Revenue</span>
            </h1>
            <p className="text-sm text-gray-500">Track and analyze your cabin earnings</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={exportToExcel}
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-medium hover:bg-emerald-100 transition-colors border border-emerald-200"
            >
              <Download size={14} />
              Export
            </button>
            <button
              onClick={() => navigate("/chamberbookings")}
              className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 transition shadow-sm shadow-indigo-200"
            >
              <Building2 size={14} />
              View All Bookings
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Total Revenue</span>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                <IndianRupee size={14} />
              </div>
            </div>
            <div className="text-xl font-bold text-emerald-600 mt-1">{formatCurrency(stats.totalRevenue)}</div>
            <div className="text-[8px] text-gray-400">{stats.completedBookings} completed bookings</div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Total Bookings</span>
              <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Calendar size={14} />
              </div>
            </div>
            <div className="text-xl font-bold text-indigo-600 mt-1">{stats.totalBookings}</div>
            <div className="text-[8px] text-gray-400">Total cabin bookings</div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Avg Per Booking</span>
              <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                <TrendingUp size={14} />
              </div>
            </div>
            <div className="text-xl font-bold text-purple-600 mt-1">{formatCurrency(stats.avgRevenuePerBooking)}</div>
            <div className="text-[8px] text-gray-400">Average revenue</div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Completed</span>
              <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                <CheckCircle size={14} />
              </div>
            </div>
            <div className="text-xl font-bold text-blue-600 mt-1">{stats.completedBookings}</div>
            <div className="text-[8px] text-gray-400">Successfully completed</div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Pending Payments</span>
              <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                <AlertCircle size={14} />
              </div>
            </div>
            <div className="text-xl font-bold text-amber-600 mt-1">{stats.pendingPayments}</div>
            <div className="text-[8px] text-gray-400">Awaiting payment</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 mb-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                <Filter size={16} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-800">Filters</h4>
                <p className="text-[10px] text-gray-400">Refine revenue data</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <div className="relative">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="text-xs bg-white border border-gray-200 rounded-lg pl-8 pr-2.5 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500/20 w-28 sm:w-36"
                />
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-xs bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500/20"
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
                className="text-xs bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="all">Payment Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>

              <select
                value={filterCabin}
                onChange={(e) => setFilterCabin(e.target.value)}
                className="text-xs bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500/20 max-w-[120px]"
              >
                <option value="all">All Cabins</option>
                {availableCabins.map(cabin => (
                  <option key={cabin.id} value={cabin.id}>{cabin.name}</option>
                ))}
              </select>

              <div className="flex items-center gap-1">
                <span className="text-[9px] text-gray-400">From</span>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="text-xs bg-white border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500/20 w-28"
                />
              </div>

              <div className="flex items-center gap-1">
                <span className="text-[9px] text-gray-400">To</span>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="text-xs bg-white border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500/20 w-28"
                />
              </div>

              <button
                onClick={applyFilters}
                className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 transition flex items-center gap-1 shadow-sm shadow-indigo-200"
              >
                <Filter size={13} />
                Apply
              </button>

              {hasActiveFilters() && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200 transition"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center gap-2 mb-4 border-b border-gray-200">
          <button
            onClick={() => setViewMode("chart")}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
              viewMode === "chart"
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <BarChart3 size={16} className="inline mr-2" />
            Charts
          </button>
          <button
            onClick={() => setViewMode("summary")}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
              viewMode === "summary"
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <PieChart size={16} className="inline mr-2" />
            Summary
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
              viewMode === "table"
                ? 'border-amber-600 text-amber-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Receipt size={16} className="inline mr-2" />
            Details
          </button>
        </div>

        {/* ============================================= */}
        {/* CHART VIEW - PIE CHARTS IN SINGLE ROW */}
        {/* ============================================= */}
        {viewMode === "chart" && (
          <div className="space-y-4">
            {/* Monthly Revenue Bar Chart */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <CalendarDays size={16} className="text-indigo-600" />
                  Monthly Revenue
                </h3>
                <span className="text-xs font-medium text-gray-500">
                  Total: {formatCurrency(stats.totalRevenue)}
                </span>
              </div>
              <div className="h-48 flex items-end justify-between gap-2 px-1">
                {stats.revenueByMonth && stats.revenueByMonth.length > 0 ? (
                  stats.revenueByMonth.map((item, idx) => {
                    const height = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0;
                    // Gradient colors for bars
                    const barColors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#06b6d4'];
                    const color = barColors[idx % barColors.length];
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 group">
                        <div className="w-full flex justify-center items-end h-36">
                          <div
                            className="w-10 rounded-t-lg transition-all duration-500 relative"
                            style={{ 
                              height: `${Math.max(height, 4)}%`,
                              background: `linear-gradient(to top, ${color}, ${color}dd)`
                            }}
                          >
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-[9px] font-medium px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              {formatCurrency(item.revenue)}
                            </div>
                          </div>
                        </div>
                        <span className="text-[8px] text-gray-500 font-medium truncate max-w-[40px]">{item.month}</span>
                        <span className="text-[7px] font-bold text-indigo-600">{item.count}</span>
                      </div>
                    );
                  })
                ) : (
                  <div className="w-full text-center text-gray-400 text-sm py-8">No revenue data available</div>
                )}
              </div>
            </div>

            {/* TWO PIE CHARTS IN SINGLE ROW - ATTRACTIVE */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Revenue by Cabin - PIE CHART */}
              <div className="bg-gradient-to-br from-white to-indigo-50/30 rounded-xl border border-gray-200 p-4 shadow-md hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <Building2 size={16} className="text-emerald-600" />
                    Revenue by Cabin
                  </h3>
                  <span className="text-[10px] font-medium text-gray-400 bg-white px-2 py-0.5 rounded-full border border-gray-200">
                    {stats.revenueByCabin?.length || 0} cabins
                  </span>
                </div>
                {stats.revenueByCabin && stats.revenueByCabin.length > 0 ? (
                  <CustomPieChart
                    data={stats.revenueByCabin.map(item => ({
                      label: item.name,
                      value: item.revenue
                    }))}
                    colors={pieColors}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                    <PieChart size={32} className="opacity-20 mb-2" />
                    <p className="text-sm font-medium">No cabin revenue data available</p>
                  </div>
                )}
              </div>

              {/* Revenue by Status - PIE CHART */}
              <div className="bg-gradient-to-br from-white to-purple-50/30 rounded-xl border border-gray-200 p-4 shadow-md hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <Layers size={16} className="text-purple-600" />
                    Revenue by Status
                  </h3>
                  <span className="text-[10px] font-medium text-gray-400 bg-white px-2 py-0.5 rounded-full border border-gray-200">
                    {stats.revenueByStatus?.length || 0} statuses
                  </span>
                </div>
                {stats.revenueByStatus && stats.revenueByStatus.length > 0 ? (
                  <CustomPieChart
                    data={stats.revenueByStatus.map(item => ({
                      label: getStatusBadge(item.status).label,
                      value: item.revenue
                    }))}
                    colors={Object.values(statusColors)}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                    <PieChart size={32} className="opacity-20 mb-2" />
                    <p className="text-sm font-medium">No status revenue data available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Stats Cards with shine */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-white to-emerald-50/50 rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-200">
                    <IndianRupee size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Revenue</p>
                    <p className="text-lg font-bold text-emerald-600">{formatCurrency(stats.totalRevenue)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-white to-purple-50/50 rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white shadow-md shadow-purple-200">
                    <TrendingUp size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Avg Revenue</p>
                    <p className="text-lg font-bold text-purple-600">{formatCurrency(stats.avgRevenuePerBooking)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-white to-cyan-50/50 rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-white shadow-md shadow-cyan-200">
                    <Users size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Unique Cabins</p>
                    <p className="text-lg font-bold text-cyan-600">{availableCabins.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================= */}
        {/* SUMMARY VIEW */}
        {/* ============================================= */}
        {viewMode === "summary" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <IndianRupee size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Revenue</p>
                  <p className="text-lg font-bold text-emerald-600">{formatCurrency(stats.totalRevenue)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Bookings</p>
                  <p className="text-lg font-bold text-indigo-600">{stats.totalBookings}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                  <TrendingUp size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Avg Revenue</p>
                  <p className="text-lg font-bold text-purple-600">{formatCurrency(stats.avgRevenuePerBooking)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                  <AlertCircle size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pending Payments</p>
                  <p className="text-lg font-bold text-amber-600">{stats.pendingPayments}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <CheckCircle size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Completed</p>
                  <p className="text-lg font-bold text-blue-600">{stats.completedBookings}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                  <XCircle size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Cancelled</p>
                  <p className="text-lg font-bold text-rose-600">
                    {filteredBookings.filter(b => b.status === 'cancelled' && b.bookingType !== 'visit').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600">
                  <Users size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Unique Cabins</p>
                  <p className="text-lg font-bold text-cyan-600">{availableCabins.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                  <Percent size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Completion Rate</p>
                  <p className="text-lg font-bold text-orange-600">
                    {stats.totalBookings > 0 ? Math.round((stats.completedBookings / stats.totalBookings) * 100) : 0}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================= */}
        {/* TABLE VIEW */}
        {/* ============================================= */}
        {viewMode === "table" && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">
                <thead>
                  <tr className="border-b border-gray-100" style={{ backgroundColor: '#f9fafb' }}>
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
                  {filteredBookings.filter(b => b.bookingType !== 'visit').length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-3 py-12 text-center text-gray-400">
                        <Receipt size={32} className="mx-auto mb-2 opacity-20" />
                        <p className="text-sm font-medium">No cabin bookings found</p>
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.filter(b => b.bookingType !== 'visit').map((b, idx) => {
                      const status = getStatusBadge(b.status);
                      const paymentStatus = getPaymentStatusBadge(b.paymentStatus);
                      return (
                        <tr key={b._id} className="transition-colors hover:bg-gray-50/80">
                          <td className="px-3 py-2.5">
                            <span className="text-[10px] font-semibold text-gray-400">#{idx + 1}</span>
                          </td>
                          <td className="px-3 py-2.5">
                            <div>
                              <p className="font-semibold text-gray-900 text-xs">{b.cabin?.name || 'Unknown'}</p>
                              <p className="text-[9px] text-gray-400">{b.cabin?.address?.split(',')[0] || 'N/A'}</p>
                            </div>
                          </td>
                          <td className="px-3 py-2.5">
                            <p className="font-medium text-gray-800 text-xs">{b.name || b.user?.name || 'Unknown'}</p>
                            <p className="text-[9px] text-gray-400">{b.mobile || b.user?.mobile || 'N/A'}</p>
                          </td>
                          <td className="px-3 py-2.5">
                            <span className="text-xs font-bold text-emerald-600">{formatCurrency(b.totalPrice)}</span>
                          </td>
                          <td className="px-3 py-2.5">
                            <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${status.color}`}>{status.label}</span>
                          </td>
                          <td className="px-3 py-2.5">
                            <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${paymentStatus.color}`}>{paymentStatus.label}</span>
                          </td>
                          <td className="px-3 py-2.5">
                            <span className="text-[9px] text-gray-500">{formatDateDMY(b.createdAt)}</span>
                          </td>
                          <td className="px-3 py-2.5 text-center">
                            <button
                              onClick={() => navigate("/chamberbookings")}
                              className="p-1 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
                              title="View Details"
                            >
                              <Eye size={13} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-3 py-2 border-t border-gray-100 bg-gray-50/50 flex justify-between text-[9px] text-gray-500">
              <span>Showing {filteredBookings.filter(b => b.bookingType !== 'visit').length} cabin bookings</span>
              <span>Total Revenue: {formatCurrency(stats.totalRevenue)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorCabinRevenue;