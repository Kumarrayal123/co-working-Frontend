// RevenueAnalytics.jsx - Complete Revenue Analytics Dashboard
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminNavbar from "./AdminNavbar";
import {
  Calendar,
  IndianRupee,
  TrendingUp,
  TrendingDown,
  Download,
  Filter,
  XCircle as XCircleIcon,
  ArrowUpRight,
  Building2,
  Users,
  Clock,
  CheckCircle,
  Wallet,
  Banknote,
  PieChart,
  BarChart3,
  Eye,
  FileDown,
  Printer,
  CreditCard,
  Store,
  Smartphone,
  AlertCircle,
  Search,
  X,
  ArrowUp,
  ArrowDown,
  DollarSign,
  Percent
} from "lucide-react";
import { toast } from "react-toastify";
import * as XLSX from 'xlsx';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  PieChart as RePieChart,
  Pie,
  Cell
} from "recharts";
import "./Dashboard.css";

const API_URL = "http://localhost:5003";

const RevenueAnalytics = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  
  // Filter States
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [filterCabinName, setFilterCabinName] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  
  // Stats
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    averageRevenue: 0,
    highestRevenue: 0,
    lowestRevenue: 0,
    confirmedRevenue: 0,
    completedRevenue: 0,
    pendingRevenue: 0,
    cancelledRevenue: 0,
    cashRevenue: 0,
    onlineRevenue: 0,
    upiRevenue: 0,
    cardRevenue: 0
  });
  
  // Chart Data
  const [monthlyData, setMonthlyData] = useState([]);
  const [statusRevenueData, setStatusRevenueData] = useState([]);
  const [paymentMethodData, setPaymentMethodData] = useState([]);
  const [topCabinsData, setTopCabinsData] = useState([]);
  
  // Cabin names for filter
  const [cabinNames, setCabinNames] = useState([]);

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
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

  const getPaymentMethodBadge = (method) => {
    const map = {
      cash: { label: 'Cash', color: 'bg-orange-100 text-orange-700' },
      counter: { label: 'Cash', color: 'bg-orange-100 text-orange-700' },
      upi: { label: 'UPI', color: 'bg-purple-100 text-purple-700' },
      card: { label: 'Card', color: 'bg-blue-100 text-blue-700' },
      online: { label: 'Online', color: 'bg-indigo-100 text-indigo-700' }
    };
    return map[method] || { label: method || 'Unknown', color: 'bg-gray-100 text-gray-700' };
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/bookings`);
      const bookingsData = res.data.bookings || [];
      setBookings(bookingsData);
      setFilteredData(bookingsData);
      
      // Get unique cabin names
      const names = [...new Set(bookingsData.map(b => b.cabin?.name).filter(Boolean))];
      setCabinNames(names);
      
      calculateStats(bookingsData);
      processChartData(bookingsData);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
      toast.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    const totalRevenue = data.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    const totalBookings = data.length;
    const averageRevenue = totalBookings > 0 ? totalRevenue / totalBookings : 0;
    
    const revenues = data.map(b => b.totalPrice || 0);
    const highestRevenue = revenues.length > 0 ? Math.max(...revenues) : 0;
    const lowestRevenue = revenues.length > 0 ? Math.min(...revenues) : 0;
    
    const confirmedRevenue = data.filter(b => b.status === 'confirmed').reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    const completedRevenue = data.filter(b => b.status === 'completed').reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    const pendingRevenue = data.filter(b => b.status === 'pending').reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    const cancelledRevenue = data.filter(b => b.status === 'cancelled').reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    
    const cashRevenue = data.filter(b => b.paymentMethod === 'cash' || b.paymentMethod === 'counter').reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    const onlineRevenue = data.filter(b => b.paymentMethod === 'online').reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    const upiRevenue = data.filter(b => b.paymentMethod === 'upi').reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    const cardRevenue = data.filter(b => b.paymentMethod === 'card').reduce((sum, b) => sum + (b.totalPrice || 0), 0);

    setStats({
      totalRevenue,
      totalBookings,
      averageRevenue,
      highestRevenue,
      lowestRevenue,
      confirmedRevenue,
      completedRevenue,
      pendingRevenue,
      cancelledRevenue,
      cashRevenue,
      onlineRevenue,
      upiRevenue,
      cardRevenue
    });
  };

  const processChartData = (data) => {
    // Monthly Revenue Data
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyMap = {};
    months.forEach(m => { monthlyMap[m] = 0; });
    
    data.forEach(b => {
      if (b.createdAt) {
        const date = new Date(b.createdAt);
        const month = months[date.getMonth()];
        monthlyMap[month] = (monthlyMap[month] || 0) + (b.totalPrice || 0);
      }
    });
    
    const monthlyData = months.map(m => ({
      month: m,
      revenue: monthlyMap[m] || 0
    }));
    setMonthlyData(monthlyData);

    // Status Revenue Distribution
    const statusMap = {};
    data.forEach(b => {
      const status = b.status || 'pending';
      statusMap[status] = (statusMap[status] || 0) + (b.totalPrice || 0);
    });
    const statusColors = {
      pending: '#f59e0b',
      confirmed: '#10b981',
      active: '#8b5cf6',
      completed: '#3b82f6',
      cancelled: '#ef4444'
    };
    const statusRevenueData = Object.keys(statusMap).map(key => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: statusMap[key],
      color: statusColors[key] || '#6b7280'
    }));
    setStatusRevenueData(statusRevenueData);

    // Payment Method Revenue
    const pmtMap = {};
    data.forEach(b => {
      const method = b.paymentMethod || 'unknown';
      pmtMap[method] = (pmtMap[method] || 0) + (b.totalPrice || 0);
    });
    const pmtColors = {
      cash: '#f97316',
      counter: '#f97316',
      upi: '#8b5cf6',
      card: '#3b82f6',
      online: '#6366f1',
      unknown: '#6b7280'
    };
    const paymentMethodData = Object.keys(pmtMap).map(key => ({
      name: getPaymentMethodBadge(key).label,
      value: pmtMap[key],
      color: pmtColors[key] || '#6b7280'
    }));
    setPaymentMethodData(paymentMethodData);

    // Top Cabins by Revenue
    const cabinMap = {};
    data.forEach(b => {
      const name = b.cabin?.name || 'Unknown Cabin';
      cabinMap[name] = (cabinMap[name] || 0) + (b.totalPrice || 0);
    });
    const topCabins = Object.keys(cabinMap)
      .map(key => ({ name: key, revenue: cabinMap[key] }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
    setTopCabinsData(topCabins);
  };

  const applyFilters = () => {
    let filtered = [...bookings];
    
    if (filterDateFrom) {
      filtered = filtered.filter(b => b.startDate >= filterDateFrom);
    }
    if (filterDateTo) {
      filtered = filtered.filter(b => b.endDate <= filterDateTo);
    }
    if (filterCabinName) {
      filtered = filtered.filter(b => b.cabin?.name === filterCabinName);
    }
    if (filterStatus !== 'all') {
      filtered = filtered.filter(b => b.status === filterStatus);
    }
    
    setFilteredData(filtered);
    calculateStats(filtered);
    processChartData(filtered);
  };

  const clearFilters = () => {
    setFilterDateFrom("");
    setFilterDateTo("");
    setFilterCabinName("");
    setFilterStatus("all");
    setFilteredData(bookings);
    calculateStats(bookings);
    processChartData(bookings);
  };

  const exportToExcel = () => {
    try {
      if (filteredData.length === 0) {
        toast.warning("No data to export");
        return;
      }
      const exportData = filteredData.map((b, i) => ({
        'S.No': i + 1,
        'Cabin': b.cabin?.name || 'Unknown',
        'Customer': b.name || b.user?.name || 'Unknown',
        'Mobile': b.mobile || b.user?.mobile || 'N/A',
        'Start Date': b.startDate || 'N/A',
        'End Date': b.endDate || 'N/A',
        'Hours': b.totalHours || 0,
        'Amount (₹)': b.totalPrice || 0,
        'Status': getStatusBadge(b.status).label,
        'Payment Method': getPaymentMethodBadge(b.paymentMethod).label,
        'Payment Status': b.paymentStatus || 'N/A'
      }));
      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Revenue_Analytics');
      const date = new Date().toISOString().split('T')[0];
      XLSX.writeFile(wb, `revenue_analytics_${date}.xlsx`);
      toast.success(`Exported ${filteredData.length} records!`);
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const ChartTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800">{payload[0].payload.month || payload[0].name}</p>
          <p className="text-indigo-600 font-bold">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

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
        {/* Header */}
        <div className="admin-dash__header">
          <div>
            <h1 className="admin-dash__greeting">
              Revenue <span>Analytics</span>
            </h1>
          </div>
        
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-4 text-white shadow-lg shadow-indigo-500/25">
            <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-200">Total Revenue</p>
            <p className="text-2xl sm:text-3xl font-bold mt-1">{formatCurrency(stats.totalRevenue)}</p>
            <div className="mt-2 pt-2 border-t border-white/20 flex justify-between text-[10px]">
              <span className="text-indigo-200">Bookings</span>
              <span className="font-semibold">{stats.totalBookings}</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Avg Revenue</p>
            <p className="text-xl sm:text-2xl font-bold text-emerald-600 mt-1">{formatCurrency(stats.averageRevenue)}</p>
            <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between text-[10px]">
              <span className="text-gray-500">Per Booking</span>
              <span className="font-semibold text-gray-900">Avg</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Highest Booking</p>
            <p className="text-xl sm:text-2xl font-bold text-blue-600 mt-1">{formatCurrency(stats.highestRevenue)}</p>
            <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between text-[10px]">
              <span className="text-gray-500">Max Revenue</span>
              <span className="font-semibold text-gray-900">Single</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Completed Revenue</p>
            <p className="text-xl sm:text-2xl font-bold text-amber-600 mt-1">{formatCurrency(stats.completedRevenue)}</p>
            <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between text-[10px]">
              <span className="text-gray-500">Closed Bookings</span>
              <span className="font-semibold text-gray-900">{formatCurrency(stats.completedRevenue)}</span>
            </div>
          </div>
        </div>

        {/* Filters - Always Expanded */}
        <div className="bg-gray-50 rounded-xl p-3 mb-4 border border-gray-200">
          <div className="flex flex-wrap items-end gap-3">
            <div className="min-w-[120px]">
              <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">From Date</label>
              <input type="date" value={filterDateFrom} onChange={(e) => setFilterDateFrom(e.target.value)} className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
            </div>
            <div className="min-w-[120px]">
              <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">To Date</label>
              <input type="date" value={filterDateTo} onChange={(e) => setFilterDateTo(e.target.value)} className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
            </div>
            <div className="min-w-[140px]">
              <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Cabin Name</label>
              <select value={filterCabinName} onChange={(e) => setFilterCabinName(e.target.value)} className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
                <option value="">All Cabins</option>
                {cabinNames.map((name, i) => (
                  <option key={i} value={name}>{name}</option>
                ))}
              </select>
            </div>
            <div className="min-w-[110px]">
              <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Status</label>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <button onClick={applyFilters} className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors">
              Apply
            </button>
            <button onClick={clearFilters} className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-red-600 transition-colors">
              <XCircleIcon size={14} /> Clear
            </button>
            {filteredData.length > 0 && (
              <button onClick={exportToExcel} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium hover:bg-indigo-100 transition-colors border border-indigo-200">
                <Download size={14} /> Export
              </button>
            )}
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {/* Monthly Revenue Trend */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-gray-800">Monthly Revenue Trend</h3>
                <p className="text-[10px] text-gray-400">Revenue by month</p>
              </div>
              <TrendingUp size={16} className="text-indigo-500" />
            </div>
            <div className="p-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={(value) => `₹${value/1000}K`} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fill="url(#revenueGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Status Revenue Distribution */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-gray-800">Revenue by Status</h3>
                <p className="text-[10px] text-gray-400">Distribution by booking status</p>
              </div>
              <PieChart size={16} className="text-purple-500" />
            </div>
            <div className="p-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={statusRevenueData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {statusRevenueData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: '10px' }}
                  />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Additional Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <div className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm">
            <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-600">Confirmed</p>
            <p className="text-lg font-bold text-emerald-600">{formatCurrency(stats.confirmedRevenue)}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm">
            <p className="text-[9px] font-bold uppercase tracking-wider text-blue-600">Completed</p>
            <p className="text-lg font-bold text-blue-600">{formatCurrency(stats.completedRevenue)}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm">
            <p className="text-[9px] font-bold uppercase tracking-wider text-yellow-600">Pending</p>
            <p className="text-lg font-bold text-yellow-600">{formatCurrency(stats.pendingRevenue)}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm">
            <p className="text-[9px] font-bold uppercase tracking-wider text-red-600">Cancelled</p>
            <p className="text-lg font-bold text-red-600">{formatCurrency(stats.cancelledRevenue)}</p>
          </div>
        </div>

        {/* Payment Method & Top Cabins */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {/* Payment Method Revenue */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-gray-800">Revenue by Payment Method</h3>
                <p className="text-[10px] text-gray-400">Distribution by payment type</p>
              </div>
              <CreditCard size={16} className="text-blue-500" />
            </div>
            <div className="p-4 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={paymentMethodData} layout="vertical" margin={{ top: 5, right: 10, left: 40, bottom: 5 }}>
                  <XAxis type="number" tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={(value) => `₹${value/1000}K`} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: '#64748b' }} width={60} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {paymentMethodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || '#6366f1'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Cabins by Revenue */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-gray-800">Top Cabins by Revenue</h3>
                <p className="text-[10px] text-gray-400">Highest earning cabins</p>
              </div>
              <Building2 size={16} className="text-emerald-500" />
            </div>
            <div className="p-4 h-48 overflow-y-auto">
              {topCabinsData.length === 0 ? (
                <div className="flex items-center justify-center h-32 text-gray-400 text-sm">No data available</div>
              ) : (
                <div className="space-y-2">
                  {topCabinsData.map((cabin, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-400 w-5">#{idx + 1}</span>
                        <span className="text-xs font-medium text-gray-700 truncate max-w-[120px]">{cabin.name}</span>
                      </div>
                      <span className="text-xs font-bold text-indigo-600">{formatCurrency(cabin.revenue)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Bookings Table */}
        <div className="admin-dash__card" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}>
          <div className="admin-dash__card-header flex flex-wrap items-center justify-between gap-3" style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb' }}>
            <div className="flex items-center gap-3">
              <h3 className="admin-dash__card-title">Revenue Details</h3>
              <span className="px-2.5 py-0.5 text-xs font-bold text-indigo-700 bg-indigo-100 rounded-full">
                {filteredData.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium">Total Revenue: <span className="font-bold text-indigo-600">{formatCurrency(stats.totalRevenue)}</span></span>
            </div>
          </div>

          <div className="admin-dash__card-body p-0 overflow-x-auto" style={{ backgroundColor: '#ffffff' }}>
            {filteredData.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-20 text-gray-400">
                <DollarSign size={48} className="opacity-20" />
                <p className="text-lg font-medium">No revenue data found</p>
                <p className="text-sm">Try adjusting your filters.</p>
              </div>
            ) : (
              <table className="w-full min-w-[900px] text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-100" style={{ backgroundColor: '#f9fafb' }}>
                    <th className="p-2 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">#</th>
                    <th className="p-2 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Cabin</th>
                    <th className="p-2 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Customer</th>
                    <th className="p-2 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Date</th>
                    <th className="p-2 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Hours</th>
                    <th className="p-2 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Status</th>
                    <th className="p-2 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Payment</th>
                    <th className="p-2 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredData.slice(0, 20).map((booking, idx) => {
                    const status = getStatusBadge(booking.status);
                    const pmtMethod = getPaymentMethodBadge(booking.paymentMethod);
                    return (
                      <tr key={booking._id} className="transition-colors hover:bg-gray-50/80">
                        <td className="p-2"><span className="text-xs font-semibold text-gray-400">#{idx + 1}</span></td>
                        <td className="p-2">
                          <p className="font-semibold text-gray-800 text-xs">{booking.cabin?.name || "Unknown"}</p>
                        </td>
                        <td className="p-2">
                          <p className="font-medium text-gray-800 text-xs">{booking.name || booking.user?.name || "Unknown"}</p>
                          <p className="text-[10px] text-gray-400">{booking.mobile || booking.user?.mobile || "N/A"}</p>
                        </td>
                        <td className="p-2">
                          <p className="text-xs text-gray-700">{booking.startDate}</p>
                          <p className="text-[10px] text-gray-400">{booking.startTime} - {booking.endTime}</p>
                        </td>
                        <td className="p-2">
                          <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-bold">{booking.totalHours}h</span>
                        </td>
                        <td className="p-2">
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${status.color}`}>{status.label}</span>
                        </td>
                        <td className="p-2">
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${pmtMethod.color}`}>{pmtMethod.label}</span>
                        </td>
                        <td className="p-2">
                          <span className="text-xs font-bold text-indigo-600">{formatCurrency(booking.totalPrice || 0)}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {!loading && filteredData.length > 0 && (
            <div className="px-4 py-2 border-t border-gray-100 rounded-b-2xl flex flex-wrap items-center justify-between gap-2" style={{ backgroundColor: '#fafafa' }}>
              <span className="text-[10px] text-gray-500">
                Showing <strong>{filteredData.length}</strong> of <strong>{bookings.length}</strong> bookings
              </span>
              <div className="flex items-center gap-2 text-[10px] text-gray-500">
                <span className="flex items-center gap-1 font-semibold text-indigo-600">Total Revenue: {formatCurrency(stats.totalRevenue)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RevenueAnalytics;