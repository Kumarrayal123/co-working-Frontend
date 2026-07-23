// CabinRevenue.jsx - Complete Cabin Revenue Analytics
import axios from "axios";
import {
  CreditCard,
  IndianRupee,
  Calendar,
  Clock,
  Building2,
  User,
  Phone,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  X,
  Download,
  TrendingUp,
  Wallet,
  RefreshCw,
  FileDown,
  Edit,
  Trash2,
  Printer,
  Receipt,
  Hash,
  Percent,
  DollarSign,
  History,
  XCircle as XCircleIcon,
  Crown,
  PieChart,
  BarChart3,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AdminNavbar from "./AdminNavbar";
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

const CabinRevenue = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCabinName, setFilterCabinName] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    averageRevenue: 0,
    highestRevenue: 0,
    activeRevenue: 0,
    expiredRevenue: 0,
    pendingRevenue: 0,
    cancelledRevenue: 0,
    firstCabinRevenue: 0,
    renewalRevenue: 0
  });
  
  const [chartData, setChartData] = useState({
    monthlyRevenue: [],
    statusRevenue: [],
    paymentMethodRevenue: [],
    topCabins: []
  });

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [cabinNames, setCabinNames] = useState([]);

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${API_URL}/api/cabins/all-cabinpayments`,
        token ? getAuthHeader() : {}
      );

      if (res.data.success) {
        const ordersData = res.data.orders || [];
        setOrders(ordersData);
        
        // Get unique cabin names
        const names = [...new Set(ordersData.map(o => o.cabin?.name).filter(Boolean))];
        setCabinNames(names);
        
        calculateStats(ordersData);
        processChartData(ordersData);
      }
    } catch (err) {
      console.error("Error fetching payments:", err);
      toast.error("Failed to fetch cabin payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      active: {
        label: 'Active',
        color: 'bg-emerald-100 text-emerald-700',
        icon: <CheckCircle size={12} className="text-emerald-500" />
      },
      expired: {
        label: 'Expired',
        color: 'bg-red-100 text-red-700',
        icon: <XCircle size={12} className="text-red-500" />
      },
      pending: {
        label: 'Pending',
        color: 'bg-yellow-100 text-yellow-700',
        icon: <Clock size={12} className="text-yellow-500" />
      },
      cancelled: {
        label: 'Cancelled',
        color: 'bg-gray-100 text-gray-700',
        icon: <XCircle size={12} className="text-gray-500" />
      }
    };
    return statusMap[status?.toLowerCase()] || {
      label: status || 'Unknown',
      color: 'bg-gray-100 text-gray-700',
      icon: <AlertCircle size={12} className="text-gray-500" />
    };
  };

  const calculateStats = (data) => {
    const totalRevenue = data.reduce((sum, o) => sum + (o.amount || 0), 0);
    const totalOrders = data.length;
    const averageRevenue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    const revenues = data.map(o => o.amount || 0);
    const highestRevenue = revenues.length > 0 ? Math.max(...revenues) : 0;
    
    const activeRevenue = data.filter(o => o.status === 'active').reduce((sum, o) => sum + (o.amount || 0), 0);
    const expiredRevenue = data.filter(o => o.status === 'expired').reduce((sum, o) => sum + (o.amount || 0), 0);
    const pendingRevenue = data.filter(o => o.status === 'pending').reduce((sum, o) => sum + (o.amount || 0), 0);
    const cancelledRevenue = data.filter(o => o.status === 'cancelled').reduce((sum, o) => sum + (o.amount || 0), 0);
    
    const firstCabinRevenue = data.filter(o => o.isFirstCabin).reduce((sum, o) => sum + (o.amount || 0), 0);
    const renewalRevenue = data.filter(o => !o.isFirstCabin).reduce((sum, o) => sum + (o.amount || 0), 0);

    setStats({
      totalRevenue,
      totalOrders,
      averageRevenue,
      highestRevenue,
      activeRevenue,
      expiredRevenue,
      pendingRevenue,
      cancelledRevenue,
      firstCabinRevenue,
      renewalRevenue
    });
  };

  const processChartData = (data) => {
    // Monthly Revenue Data
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyMap = {};
    months.forEach(m => { monthlyMap[m] = 0; });
    
    data.forEach(o => {
      if (o.createdAt) {
        const date = new Date(o.createdAt);
        const month = months[date.getMonth()];
        monthlyMap[month] = (monthlyMap[month] || 0) + (o.amount || 0);
      }
    });
    
    const monthlyRevenue = months.map(m => ({
      month: m,
      revenue: monthlyMap[m] || 0
    }));
    
    // Status Revenue Distribution
    const statusMap = {};
    data.forEach(o => {
      const status = o.status || 'pending';
      statusMap[status] = (statusMap[status] || 0) + (o.amount || 0);
    });
    const statusColors = {
      active: '#10b981',
      expired: '#ef4444',
      pending: '#f59e0b',
      cancelled: '#6b7280'
    };
    const statusRevenue = Object.keys(statusMap).map(key => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: statusMap[key],
      color: statusColors[key] || '#6b7280'
    }));
    
    // Top Cabins by Revenue
    const cabinMap = {};
    data.forEach(o => {
      const name = o.cabin?.name || 'Unknown Cabin';
      cabinMap[name] = (cabinMap[name] || 0) + (o.amount || 0);
    });
    const topCabins = Object.keys(cabinMap)
      .map(key => ({ name: key, revenue: cabinMap[key] }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    setChartData({
      monthlyRevenue,
      statusRevenue,
      topCabins
    });
  };

  const clearFilters = () => {
    setFilterStatus("all");
    setFilterCabinName("");
    setFilterDateFrom("");
    setFilterDateTo("");
  };

  const filteredOrders = orders.filter((order) => {
    const cabinName = order.cabin?.name?.toLowerCase() || "";
    
    const matchesStatus = filterStatus === "all" || order.status === filterStatus;
    const matchesCabinName = filterCabinName === "" || cabinName.includes(filterCabinName.toLowerCase());
    const matchesDateFrom = filterDateFrom ? order.createdAt >= filterDateFrom : true;
    const matchesDateTo = filterDateTo ? order.createdAt <= filterDateTo : true;
    
    return matchesStatus && matchesCabinName && matchesDateFrom && matchesDateTo;
  });

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  // ======================
  // EXPORT TO EXCEL
  // ======================
  const exportToExcel = () => {
    try {
      if (filteredOrders.length === 0) {
        toast.warning("No data to export");
        return;
      }

      const exportData = filteredOrders.map((order, index) => ({
        'S.No': index + 1,
        'Cabin Name': order.cabin?.name || 'Cabin Deleted',
        'Owner Name': order.cabin?.owner?.name || order.owner?.name || 'N/A',
        'Total Amount': order.amount || 0,
        'GST Amount': order.gstAmount || 0,
        'Order Status': order.status || 'unknown',
        'Transaction ID': order.transactionId || 'N/A',
        'Payment Count': order.paymentCount || 1,
        'Start Date': order.startDate ? formatDate(order.startDate) : 'N/A',
        'Expiry Date': order.expiryDate ? formatDate(order.expiryDate) : 'N/A',
        'Order Date': order.createdAt ? formatDate(order.createdAt) : 'N/A',
        'First Cabin': order.isFirstCabin ? 'Yes' : 'No'
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Cabin_Revenue');
      
      const date = new Date().toISOString().split('T')[0];
      XLSX.writeFile(wb, `cabin_revenue_${date}.xlsx`);
      
      toast.success(`Exported ${filteredOrders.length} records to Excel!`);
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export");
    }
  };

  // ======================
  // INVOICE DOWNLOAD
  // ======================
  const downloadInvoice = (order) => {
    try {
      const cabin = order.cabin || {};
      const owner = cabin.owner || {};
      const cabinName = cabin.name || 'Cabin Deleted';
      const cabinAddress = cabin.address || 'N/A';
      const ownerOrganization = owner.organizationName || 'IRYAX Workspace';
      const ownerGst = owner.gstNumber || 'N/A';
      const amount = order.amount || 0;
      const baseAmount = order.baseAmount || amount;
      const gstAmount = order.gstAmount || 0;
      const gstRate = order.gstRate || 0.18;
      const orderId = order._id.slice(-8).toUpperCase();
      const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
      const isFirstCabin = order.isFirstCabin || false;

      const win = window.open('', '_blank', 'width=900,height=700');
      if (win) {
        win.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <title>Invoice #${orderId}</title>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { font-family: 'Times New Roman', 'Georgia', serif; background: #ffffff; padding: 40px; display: flex; justify-content: center; min-height: 100vh; color: #000000; }
              .invoice-container { max-width: 800px; width: 100%; background: #ffffff; border: 2px solid #000000; padding: 40px 45px; }
              .invoice-header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px double #000000; padding-bottom: 20px; margin-bottom: 25px; }
              .brand h1 { font-size: 28px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #1a56db; }
              .invoice-number .number { font-size: 22px; font-weight: 700; color: #000000; margin-top: 2px; }
              .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 25px; padding-bottom: 20px; border-bottom: 1px solid #cccccc; }
              .invoice-table { width: 100%; border-collapse: collapse; margin: 20px 0 25px; }
              .invoice-table thead { border-top: 2px solid #000000; border-bottom: 2px solid #000000; }
              .invoice-table thead th { padding: 10px 12px; text-align: left; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #000000; }
              .invoice-table thead th:last-child { text-align: right; }
              .invoice-table tbody td { padding: 10px 12px; font-size: 13px; color: #000000; border-bottom: 1px solid #eeeeee; }
              .invoice-table tbody td:last-child { text-align: right; font-weight: 600; }
              .totals { margin-top: 20px; padding-top: 20px; border-top: 2px solid #000000; display: flex; justify-content: flex-end; }
              .totals-box { width: 320px; }
              .totals-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; color: #333333; }
              .totals-row.total { font-size: 20px; font-weight: 700; color: #000000; border-top: 2px solid #000000; padding-top: 12px; margin-top: 6px; }
              .footer { text-align: center; padding-top: 25px; margin-top: 25px; border-top: 2px solid #000000; }
              .print-btn { position: fixed; bottom: 30px; right: 30px; padding: 14px 28px; background: #000000; color: #ffffff; border: none; border-radius: 4px; font-weight: 600; font-size: 13px; cursor: pointer; }
              @media print { .print-btn { display: none !important; } }
            </style>
          </head>
          <body>
            <div class="invoice-container">
              <div class="invoice-header">
                <div class="brand"><h1>${ownerOrganization.toUpperCase()}</h1></div>
                <div class="invoice-number"><div class="number">#${orderId}</div><div>${today}</div></div>
              </div>
              <div class="info-grid">
                <div><strong>Bill To</strong><br>${owner.name || 'Owner'}</div>
                <div><strong>Cabin</strong><br>${cabinName}<br>${cabinAddress}</div>
              </div>
              <table class="invoice-table">
                <thead><tr><th>Description</th><th>Details</th><th>Amount</th></tr></thead>
                <tbody>
                  <tr>
                    <td><strong>Cabin Registration</strong></td>
                    <td>${cabinName}<br>${isFirstCabin ? '⭐ First Cabin' : 'Renewal #' + (order.paymentCount || 1)}</td>
                    <td>₹${baseAmount.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
              <div class="totals">
                <div class="totals-box">
                  <div class="totals-row"><span>Subtotal</span><span>₹${baseAmount.toFixed(2)}</span></div>
                  <div class="totals-row"><span>GST (${(gstRate * 100).toFixed(0)}%)</span><span>₹${gstAmount.toFixed(2)}</span></div>
                  <div class="totals-row total"><span>Total</span><span>₹${amount.toFixed(2)}</span></div>
                </div>
              </div>
              <div class="footer"><div>POWERED BY IRYAX SPACE</div></div>
            </div>
            <button class="print-btn" onclick="window.print()">🖨️ Print / Save PDF</button>
          </body></html>
        `);
        win.document.close();
        win.focus();
        toast.success('Invoice opened! Click Print to save as PDF.');
      } else {
        toast.error('Please allow popups');
      }
    } catch (error) {
      console.error('Invoice error:', error);
      toast.error('Failed to generate invoice');
    }
  };

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
              Cabin <span>Revenue</span>
            </h1>
           
          </div>
          
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-4 text-white shadow-lg shadow-indigo-500/25">
            <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-200">Total Revenue</p>
            <p className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
            <div className="mt-2 pt-2 border-t border-white/20 flex justify-between text-[10px]">
              <span className="text-indigo-200">Orders</span>
              <span className="font-semibold">{stats.totalOrders}</span>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Active Revenue</p>
            <p className="text-2xl font-bold text-emerald-600">{formatCurrency(stats.activeRevenue)}</p>
            <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between text-[10px]">
              <span className="text-gray-500">Active Orders</span>
              <span className="font-semibold text-gray-900">{orders.filter(o => o.status === 'active').length}</span>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Avg Revenue</p>
            <p className="text-2xl font-bold text-amber-600">{formatCurrency(stats.averageRevenue)}</p>
            <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between text-[10px]">
              <span className="text-gray-500">Per Order</span>
              <span className="font-semibold text-gray-900">Avg</span>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">First Cabin</p>
            <p className="text-2xl font-bold text-indigo-600">{formatCurrency(stats.firstCabinRevenue)}</p>
            <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between text-[10px]">
              <span className="text-gray-500">Renewals</span>
              <span className="font-semibold text-gray-900">{formatCurrency(stats.renewalRevenue)}</span>
            </div>
          </div>
        </div>

        {/* Filters - Always Visible */}
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
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <button onClick={clearFilters} className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-red-600 transition-colors">
              <XCircleIcon size={14} /> Clear
            </button>
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
                <AreaChart data={chartData.monthlyRevenue} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                  <defs>
                    <linearGradient id="revenueGradient2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={(value) => `₹${value/1000}K`} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fill="url(#revenueGradient2)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Status Revenue Distribution */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-gray-800">Revenue by Status</h3>
                <p className="text-[10px] text-gray-400">Distribution by order status</p>
              </div>
              <PieChart size={16} className="text-purple-500" />
            </div>
            <div className="p-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={chartData.statusRevenue}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {chartData.statusRevenue.map((entry, index) => (
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
            <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-600">Active</p>
            <p className="text-lg font-bold text-emerald-600">{formatCurrency(stats.activeRevenue)}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm">
            <p className="text-[9px] font-bold uppercase tracking-wider text-red-600">Expired</p>
            <p className="text-lg font-bold text-red-600">{formatCurrency(stats.expiredRevenue)}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm">
            <p className="text-[9px] font-bold uppercase tracking-wider text-yellow-600">Pending</p>
            <p className="text-lg font-bold text-yellow-600">{formatCurrency(stats.pendingRevenue)}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm">
            <p className="text-[9px] font-bold uppercase tracking-wider text-gray-600">Cancelled</p>
            <p className="text-lg font-bold text-gray-600">{formatCurrency(stats.cancelledRevenue)}</p>
          </div>
        </div>

        {/* Top Cabins by Revenue */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-4">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-gray-800">Top Cabins by Revenue</h3>
              <p className="text-[10px] text-gray-400">Highest earning cabins</p>
            </div>
            <Building2 size={16} className="text-emerald-500" />
          </div>
          <div className="p-4">
            {chartData.topCabins.length === 0 ? (
              <div className="flex items-center justify-center h-20 text-gray-400 text-sm">No data available</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {chartData.topCabins.map((cabin, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-400 w-5">#{idx + 1}</span>
                      <span className="text-xs font-medium text-gray-700 truncate max-w-[150px]">{cabin.name}</span>
                    </div>
                    <span className="text-xs font-bold text-indigo-600">{formatCurrency(cabin.revenue)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Revenue Details Table */}
        <div className="admin-dash__card" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}>
          <div className="admin-dash__card-header flex flex-wrap items-center justify-between gap-3" style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb' }}>
            <div className="flex items-center gap-3">
              <h3 className="admin-dash__card-title">Revenue Details</h3>
              <span className="px-2.5 py-0.5 text-xs font-bold text-indigo-700 bg-indigo-100 rounded-full">
                {filteredOrders.length}
              </span>
            </div>
          </div>

          <div className="admin-dash__card-body p-0 overflow-x-auto" style={{ backgroundColor: '#ffffff' }}>
            {filteredOrders.length === 0 ? (
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
                    <th className="p-2 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Owner</th>
                    <th className="p-2 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Amount</th>
                    <th className="p-2 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">GST</th>
                    <th className="p-2 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Status</th>
                    <th className="p-2 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Type</th>
                    <th className="p-2 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Date</th>
                    <th className="p-2 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredOrders.slice(0, 20).map((order, idx) => {
                    const statusBadge = getStatusBadge(order.status);
                    const isFirstCabin = order.isFirstCabin || false;
                    
                    return (
                      <tr key={order._id} className="transition-colors hover:bg-gray-50/80">
                        <td className="p-2"><span className="text-xs font-semibold text-gray-400">#{idx + 1}</span></td>
                        <td className="p-2">
                          <p className="font-semibold text-gray-800 text-xs">
                            {order.cabin?.name || 'Cabin Deleted'}
                            {isFirstCabin && <span className="text-[10px] text-indigo-600 font-bold ml-1">⭐</span>}
                          </p>
                        </td>
                        <td className="p-2">
                          <p className="font-medium text-gray-700 text-xs">{order.cabin?.owner?.name || order.owner?.name || 'N/A'}</p>
                        </td>
                        <td className="p-2">
                          <span className="text-xs font-bold text-indigo-600">{formatCurrency(order.amount || 0)}</span>
                        </td>
                        <td className="p-2">
                          <span className="text-xs text-emerald-600">₹{(order.gstAmount || 0).toFixed(2)}</span>
                        </td>
                        <td className="p-2">
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${statusBadge.color}`}>
                            {statusBadge.label}
                          </span>
                        </td>
                        <td className="p-2">
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${isFirstCabin ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                            {isFirstCabin ? '⭐ First' : 'Renewal'}
                          </span>
                        </td>
                        <td className="p-2">
                          <span className="text-xs text-gray-500">{formatDate(order.createdAt)}</span>
                        </td>
                        <td className="p-2">
                          <div className="flex items-center gap-1">
                            <button onClick={() => handleViewDetails(order)} className="flex items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors">
                              <Eye size={11} /> View
                            </button>
                            <button onClick={() => downloadInvoice(order)} className="flex items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors">
                              <FileDown size={11} /> Inv
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {!loading && filteredOrders.length > 0 && (
            <div className="px-4 py-2 border-t border-gray-100 rounded-b-2xl flex flex-wrap items-center justify-between gap-2" style={{ backgroundColor: '#fafafa' }}>
              <span className="text-[10px] text-gray-500">
                Showing <strong>{filteredOrders.length}</strong> of <strong>{orders.length}</strong> orders
              </span>
              <div className="flex items-center gap-2 text-[10px] text-gray-500">
                <span className="flex items-center gap-1 font-semibold text-indigo-600">Total: {formatCurrency(stats.totalRevenue)}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ====================== */}
      {/* ORDER DETAIL MODAL */}
      {/* ====================== */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) setShowDetailModal(false); }}>
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-gradient-to-br from-indigo-600 to-purple-600 text-white p-6 rounded-t-3xl flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Receipt size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Revenue Details</h3>
                  <p className="text-sm text-indigo-200">#{selectedOrder._id.slice(-6).toUpperCase()}</p>
                </div>
              </div>
              <button onClick={() => setShowDetailModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Cabin</p>
                  <p className="mt-1 font-semibold text-gray-800">{selectedOrder.cabin?.name || 'Cabin Deleted'}</p>
                  {selectedOrder.isFirstCabin && (
                    <p className="text-xs text-indigo-600 font-medium mt-1">⭐ First Cabin</p>
                  )}
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Owner</p>
                  <p className="mt-1 font-semibold text-gray-800">{selectedOrder.cabin?.owner?.name || selectedOrder.owner?.name || 'N/A'}</p>
                </div>
              </div>

              <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Amount Breakdown</p>
                <div className="mt-2 space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Base Amount</span>
                    <span className="font-semibold">₹{selectedOrder.baseAmount?.toFixed(2) || selectedOrder.amount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">GST ({(selectedOrder.gstRate * 100).toFixed(0)}%)</span>
                    <span className="font-semibold">₹{selectedOrder.gstAmount?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="border-t border-indigo-200 pt-1.5 flex justify-between text-sm font-bold">
                    <span>Total</span>
                    <span className="text-indigo-600">₹{selectedOrder.amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Order Status</p>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-full mt-1 ${getStatusBadge(selectedOrder.status).color}`}>
                    {getStatusBadge(selectedOrder.status).icon} {getStatusBadge(selectedOrder.status).label}
                  </span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Payment Count</p>
                  <p className="mt-1 text-2xl font-bold text-purple-600">{selectedOrder.paymentCount || 1}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Start Date</p>
                  <p className="mt-1 font-medium text-gray-800 text-sm">{formatDate(selectedOrder.startDate)}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Expiry Date</p>
                  <p className="mt-1 font-medium text-gray-800 text-sm">{formatDate(selectedOrder.expiryDate)}</p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button onClick={() => { setShowDetailModal(false); downloadInvoice(selectedOrder); }} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-sm active:scale-[0.98] flex items-center justify-center gap-2">
                  <FileDown size={16} /> Download Invoice
                </button>
                <button onClick={() => setShowDetailModal(false)} className="w-full py-3 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CabinRevenue;