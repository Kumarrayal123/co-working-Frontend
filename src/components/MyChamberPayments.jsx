// MyChamberPayments.jsx - Complete with All Data and Professional Invoice (Redesigned)
import axios from "axios";
import {
  CreditCard,
  Calendar,
  Clock,
  IndianRupee,
  Building2,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
  FileDown,
  Printer,
  Timer,
  RefreshCw,
  History,
  Hash,
  Receipt,
  DollarSign,
  Tag,
  User,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  Percent,
  Filter,
  Search,
  ArrowUpRight,
  Download
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DoctorNavbar from "./DoctorNavbar";
import "./Dashboard.css";

const API_URL = "http://localhost:5003";

const MyChamberPayments = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    expired: 0,
    totalAmount: 0
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [renewOrder, setRenewOrder] = useState(null);
  const [renewing, setRenewing] = useState(false);
  const [countdowns, setCountdowns] = useState({});
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterChamberName, setFilterChamberName] = useState("");
  const navigate = useNavigate();

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        navigate("/login");
        return;
      }

      const res = await axios.get(
        `${API_URL}/api/cabins/my-cabinpayments`,
        getAuthHeader()
      );

      setOrders(res.data.orders || []);
      setStats(res.data.stats || { total: 0, active: 0, expired: 0, totalAmount: 0 });
      
      const initialCountdowns = {};
      (res.data.orders || []).forEach(order => {
        if (order.status === 'active') {
          const expiry = new Date(order.expiryDate);
          const now = new Date();
          const diff = Math.max(0, Math.floor((expiry - now) / 1000));
          initialCountdowns[order._id] = diff;
        }
      });
      setCountdowns(initialCountdowns);
      
    } catch (err) {
      console.error("Error fetching payments:", err);
      toast.error("Failed to fetch payment history");
    } finally {
      setLoading(false);
    }
  };

  // Countdown timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdowns(prev => {
        const updated = { ...prev };
        let hasChanges = false;
        Object.keys(updated).forEach(key => {
          if (updated[key] > 0) {
            updated[key] = updated[key] - 1;
            hasChanges = true;
          }
        });
        return hasChanges ? updated : prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchPayments();
  }, []);

  // Filter orders - No search, only status and chamber name filters
  const filteredOrders = orders.filter(order => {
    const matchStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchChamberName = filterChamberName === "" || order.cabin?.name?.toLowerCase().includes(filterChamberName.toLowerCase());
    return matchStatus && matchChamberName;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const getStatusBadge = (status, expiryDate) => {
    if (status === 'active') {
      const now = new Date();
      const expiry = new Date(expiryDate);
      if (expiry < now) {
        return { 
          label: 'Expired', 
          color: 'bg-red-100 text-red-700 border-red-200',
          icon: <XCircle size={14} />
        };
      }
      const daysLeft = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
      return { 
        label: `Active (${daysLeft}d)`, 
        color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        icon: <CheckCircle size={14} />
      };
    }
    return { 
      label: status.charAt(0).toUpperCase() + status.slice(1), 
      color: 'bg-gray-100 text-gray-700 border-gray-200',
      icon: <AlertCircle size={14} />
    };
  };

  const formatCountdown = (seconds) => {
    if (!seconds || seconds <= 0) return 'Expired';
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m ${secs}s`;
    }
    return `${hours}h ${minutes}m ${secs}s`;
  };

  const getCountdownColor = (seconds) => {
    if (!seconds || seconds <= 0) return 'text-red-600';
    if (seconds < 86400) return 'text-orange-500';
    if (seconds < 172800) return 'text-yellow-500';
    return 'text-emerald-600';
  };

  const getChamberName = (order) => {
    return order.cabin?.name || 'Chamber Deleted';
  };

  const getChamberAddress = (order) => {
    return order.cabin?.address || 'N/A';
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateTime = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  // ======================
  // RENEW PAYMENT FUNCTION
  // ======================
  const handleRenewPayment = async () => {
    if (!renewOrder) return;
    
    setRenewing(true);
    try {
      const token = localStorage.getItem("token");
      
      const res = await axios.post(
        `${API_URL}/api/cabins/renew-payment`,
        { orderId: renewOrder._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(`Chamber renewed successfully! Amount: ₹${res.data.amount}`);
      setShowRenewModal(false);
      setRenewOrder(null);
      
      await fetchPayments();
      
    } catch (err) {
      console.error("Renew payment error:", err);
      toast.error(err.response?.data?.error || "Failed to renew chamber");
    } finally {
      setRenewing(false);
    }
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

      // Dynamically import xlsx
      const XLSX = require('xlsx');

      const exportData = filteredOrders.map((order, index) => ({
        'S.No': index + 1,
        'Chamber Name': getChamberName(order),
        'Address': getChamberAddress(order),
        'Amount': order.amount || 0,
        'Transaction ID': order.transactionId || 'N/A',
        'Payment Count': order.paymentCount || 1,
        'Status': getStatusBadge(order.status, order.expiryDate).label,
        'Start Date': formatDate(order.startDate),
        'Expiry Date': formatDate(order.expiryDate),
        'Payment Status': order.paymentStatus === 'completed' ? 'Completed' : 'Pending',
        'Created At': formatDateTime(order.createdAt),
        'Updated At': formatDateTime(order.updatedAt)
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Chamber_Payments');
      
      const date = new Date().toISOString().split('T')[0];
      XLSX.writeFile(wb, `chamber_payments_${date}.xlsx`);
      
      toast.success(`Exported ${filteredOrders.length} payments to Excel!`);
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export payments");
    }
  };

  // ======================
  // PROFESSIONAL INVOICE DOWNLOAD
  // ======================
  const downloadInvoice = (order) => {
    try {
      const cabin = order.cabin || {};
      const chamberName = cabin.name || 'Chamber Deleted';
      const chamberAddress = cabin.address || 'N/A';
      
      const amount = order.amount || 0;
      const baseAmount = order.baseAmount || amount;
      const gstAmount = order.gstAmount || 0;
      const gstRate = order.gstRate || 0.18;
      const orderId = order._id.slice(-8).toUpperCase();
      const startDate = formatDate(order.startDate);
      const expiryDate = formatDate(order.expiryDate);
      const status = order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'N/A';
      const paymentStatus = order.paymentStatus === 'completed' ? 'Paid' : 'Pending';
      const transactionId = order.transactionId || 'N/A';
      const paymentCount = order.paymentCount || 1;
      const today = new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
      
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
              .brand .gst { font-size: 11px; color: #666666; margin-top: 2px; }
              .brand .address-line { font-size: 11px; color: #666666; margin-top: 2px; }
              .invoice-number { text-align: right; }
              .invoice-number .label { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #666666; }
              .invoice-number .number { font-size: 22px; font-weight: 700; color: #000000; margin-top: 2px; }
              .invoice-number .date { font-size: 12px; color: #333333; margin-top: 4px; }
              .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 25px; padding-bottom: 20px; border-bottom: 1px solid #cccccc; }
              .info-group .title { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #666666; margin-bottom: 6px; }
              .info-group .value { font-size: 14px; font-weight: 600; color: #000000; line-height: 1.6; }
              .info-group .value-small { font-size: 12px; font-weight: 400; color: #333333; }
              .info-group .address-line { font-size: 12px; color: #333333; margin-top: 2px; }
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
              .status-row { display: flex; gap: 30px; margin-top: 15px; padding-top: 15px; border-top: 1px solid #cccccc; flex-wrap: wrap; }
              .status-row .item { font-size: 12px; }
              .status-row .item .label { color: #666666; text-transform: uppercase; font-weight: 700; font-size: 9px; letter-spacing: 0.5px; }
              .status-row .item .value { font-weight: 600; color: #000000; margin-top: 2px; }
              .footer { text-align: center; padding-top: 25px; margin-top: 25px; border-top: 2px solid #000000; }
              .footer .powered { font-size: 14px; font-weight: 700; letter-spacing: 2px; color: #1a56db; }
              .footer .sub { font-size: 10px; color: #666666; margin-top: 4px; }
              .print-btn { position: fixed; bottom: 30px; right: 30px; padding: 14px 28px; background: #000000; color: #ffffff; border: none; border-radius: 4px; font-weight: 600; font-size: 13px; cursor: pointer; box-shadow: 0 4px 20px rgba(0,0,0,0.15); display: flex; align-items: center; gap: 10px; font-family: 'Segoe UI', Arial, sans-serif; letter-spacing: 0.5px; }
              .print-btn:hover { background: #222222; }
              @media print { body { background: white; padding: 20px; } .invoice-container { border: 1px solid #000000; padding: 30px; } .print-btn { display: none !important; } }
              @media (max-width: 640px) { body { padding: 20px; } .invoice-container { padding: 25px; } .invoice-header { flex-direction: column; text-align: center; gap: 15px; } .invoice-number { text-align: center; } .info-grid { grid-template-columns: 1fr; gap: 15px; } .totals { justify-content: center; } .totals-box { width: 100%; } .status-row { flex-direction: column; gap: 8px; } }
            </style>
          </head>
          <body>
            <div class="invoice-container">
              <div class="invoice-header">
                <div class="brand"><h1>${chamberName.toUpperCase()}</h1><div class="gst">GST: ${(gstRate * 100).toFixed(0)}%</div><div class="address-line">${chamberAddress}</div></div>
                <div class="invoice-number"><div class="label">Invoice</div><div class="number">#${orderId}</div><div class="date">${today}</div></div>
              </div>
              <div class="info-grid">
                <div><div class="title">Bill To</div><div class="value">${localStorage.getItem('userName') || 'Customer'}</div><div class="value-small">Chamber Registration</div></div>
                <div><div class="title">Chamber Details</div><div class="value">${chamberName}</div><div class="address-line">${chamberAddress}</div><div class="value-small" style="margin-top:4px;">${order.isFirstCabin ? '⭐ First Chamber' : 'Payment #' + paymentCount}</div></div>
              </div>
              <table class="invoice-table"><thead><tr><th>Description</th><th>Details</th><th>Amount</th></tr></thead>
                <tbody><tr><td><strong>Chamber Registration</strong></td><td>${chamberName}<br><span style="font-size:11px;color:#666666;">${order.isFirstCabin ? 'First Chamber Registration' : 'Chamber Registration'}</span>${transactionId !== 'N/A' ? `<br><span style="font-size:10px;color:#888888;font-family:monospace;">TXN: ${transactionId}</span>` : ''}${paymentCount > 1 ? `<br><span style="font-size:11px;color:#059669;font-weight:600;">🔄 Renewal #${paymentCount}</span>` : ''}</td><td>₹${baseAmount.toFixed(2)}</td></tr></tbody></table>
              <div class="status-row"><div class="item"><div class="label">Payment Method</div><div class="value">Online</div></div><div class="item"><div class="label">Payment Status</div><div class="value">${paymentStatus}</div></div><div class="item"><div class="label">Order Status</div><div class="value">${status}</div></div>${transactionId !== 'N/A' ? `<div class="item"><div class="label">Transaction ID</div><div class="value" style="font-family:monospace;font-size:11px;">${transactionId}</div></div>` : ''}</div>
              <div class="totals"><div class="totals-box"><div class="totals-row"><span>Subtotal</span><span>₹${baseAmount.toFixed(2)}</span></div><div class="totals-row"><span>GST (${(gstRate * 100).toFixed(0)}%)</span><span>₹${gstAmount.toFixed(2)}</span></div><div class="totals-row total"><span>Total Amount</span><span class="amount">₹${amount.toFixed(2)}</span></div></div></div>
              <div class="footer"><div class="powered">POWERED BY <span>IRYAX SPACE</span></div><div class="sub">Thank you for choosing ${chamberName}</div><div class="sub" style="margin-top:2px;">This is a system generated invoice</div></div>
            </div>
            <button class="print-btn" onclick="window.print()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M18 9H6"/><path d="M18 13v6H6v-6"/><rect x="8" y="2" width="8" height="4" rx="1"/><rect x="8" y="13" width="8" height="4" rx="1"/></svg>Print / Save PDF</button>
          </body></html>
        `);
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

  const clearFilters = () => {
    setFilterStatus("all");
    setFilterChamberName("");
    setCurrentPage(1);
  };

  return (
    <div className="admin-dash" style={{ backgroundColor: '#ffffff' }}>
      <DoctorNavbar />

      <div className="pt-24 px-3 sm:px-4 md:px-6 lg:px-8 max-w-full mx-auto pb-16">
        {/* Header */}
        <div className="admin-dash__header">
          <div>
            <h1 className="admin-dash__greeting">
              My <span>Chamber Payments</span>
            </h1>
            <p className="admin-dash__subtitle">
              Track all your chamber registration payments and orders.
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
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Total Orders</p>
                <p className="text-2xl font-bold text-indigo-600 mt-1">{stats.total}</p>
              </div>
              <div className="bg-indigo-100 p-2 rounded-lg">
                <Receipt size={20} className="text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Active</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.active}</p>
              </div>
              <div className="bg-emerald-100 p-2 rounded-lg">
                <CheckCircle size={20} className="text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-red-600">Expired</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{stats.expired}</p>
              </div>
              <div className="bg-red-100 p-2 rounded-lg">
                <XCircle size={20} className="text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-purple-600">Total Spent</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">
                  {formatCurrency(stats.totalAmount)}
                </p>
              </div>
              <div className="bg-purple-100 p-2 rounded-lg">
                <IndianRupee size={20} className="text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="admin-dash__card" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}>
          <div className="admin-dash__card-header flex flex-wrap items-center justify-between gap-3" style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb' }}>
            <div className="flex items-center gap-3">
              <h3 className="admin-dash__card-title">Payment History</h3>
              <span className="px-2.5 py-0.5 text-xs font-bold text-indigo-700 bg-indigo-100 rounded-full">
                {filteredOrders.length}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {/* Chamber Name Filter */}
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500 font-medium">Chamber:</span>
                <input
                  type="text"
                  placeholder="Filter by chamber..."
                  value={filterChamberName}
                  onChange={(e) => setFilterChamberName(e.target.value)}
                  className="text-sm bg-white border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium text-gray-700 w-40"
                />
              </div>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-sm bg-white border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium text-gray-700"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>

              {/* Clear Filters */}
              {(filterStatus !== 'all' || filterChamberName) && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X size={14} /> Clear
                </button>
              )}

              {/* Export Button - Excel Download */}
              {filteredOrders.length > 0 && (
                <button
                  onClick={exportToExcel}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-medium hover:bg-emerald-100 transition-colors border border-emerald-200"
                >
                  <Download size={14} />
                  <span>Export</span>
                </button>
              )}

              <button
                onClick={fetchPayments}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium hover:bg-indigo-100 transition-colors border border-indigo-200"
              >
                <RefreshCw size={14} />
                <span className="hidden xs:inline">Refresh</span>
              </button>

              <button
                onClick={() => navigate("/my-cabins")}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors"
              >
                <Building2 size={14} className="text-indigo-600" />
                <span className="hidden xs:inline">Chambers</span>
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="admin-dash__card-body p-0 overflow-x-auto" style={{ backgroundColor: '#ffffff' }}>
            {loading ? (
              <div className="flex flex-col items-center justify-center gap-3 py-20">
                <div className="w-12 h-12 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin" />
                <p className="text-gray-500">Loading payments...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-20 text-gray-400">
                <CreditCard size={48} className="opacity-20" />
                <p className="text-lg font-medium">No payments found</p>
                <p className="text-sm">Add a chamber to start your payment history.</p>
              </div>
            ) : (
              <table className="w-full min-w-[1000px] text-left">
                <thead>
                  <tr className="border-b border-gray-100" style={{ backgroundColor: '#f9fafb' }}>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">#</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Chamber</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Amount</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">TXN ID</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Payments</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Status</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Expiry</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentOrders.map((order, idx) => {
                    const status = getStatusBadge(order.status, order.expiryDate);
                    const countdown = countdowns[order._id] || 0;
                    const isExpired = order.status === 'expired' || (order.status === 'active' && new Date(order.expiryDate) < new Date());
                    const isExpiringSoon = countdown > 0 && countdown < 86400;
                    
                    return (
                      <tr key={order._id} className="transition-colors group hover:bg-gray-50/80">
                        <td className="p-4">
                          <span className="text-sm font-semibold text-gray-400">#{indexOfFirstItem + idx + 1}</span>
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="font-semibold text-gray-900 text-sm flex items-center gap-1">
                              {getChamberName(order)}
                              {order.isFirstCabin && (
                                <span className="text-[10px] text-indigo-600 font-bold">⭐</span>
                              )}
                            </p>
                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                              <MapPin size={12} className="text-gray-400" />
                              {getChamberAddress(order)}
                            </p>
                            {order.cabin === null && (
                              <span className="text-[10px] text-red-500 font-medium">⚠️ Chamber Deleted</span>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-sm font-bold text-indigo-600">{formatCurrency(order.amount)}</span>
                        </td>
                        <td className="p-4">
                          {order.transactionId ? (
                            <span className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                              {order.transactionId.slice(0, 8)}...
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">N/A</span>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1">
                            <History size={14} className="text-indigo-400" />
                            <span className="text-sm font-semibold text-gray-700">{order.paymentCount || 1}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col gap-1">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-full border ${status.color}`}>
                              {status.icon} {status.label}
                            </span>
                            {order.status === 'active' && countdown > 0 && (
                              <span className={`text-xs font-mono font-medium flex items-center gap-1 ${getCountdownColor(countdown)}`}>
                                <Timer size={12} />
                                {formatCountdown(countdown)}
                              </span>
                            )}
                            {isExpired && (
                              <span className="text-[10px] text-red-500 font-medium">🔴 Expired - Renew now!</span>
                            )}
                            {isExpiringSoon && order.status === 'active' && (
                              <span className="text-[10px] text-orange-500 font-medium animate-pulse">⚠️ Expiring soon!</span>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-gray-600">{formatDate(order.expiryDate)}</span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {/* View Button with Label */}
                            <button
                              onClick={() => handleViewDetails(order)}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors whitespace-nowrap"
                              title="View Details"
                            >
                              <Eye size={13} /> View
                            </button>
                            
                            {/* Download Invoice Button with Label */}
                            <button
                              onClick={() => downloadInvoice(order)}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors whitespace-nowrap"
                              title="Download Invoice"
                            >
                              <FileDown size={13} /> Invoice
                            </button>
                            
                            {/* Renew Button with Label */}
                            <button
                              onClick={() => { setRenewOrder(order); setShowRenewModal(true); }}
                              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${isExpired ? 'bg-red-50 text-red-700 hover:bg-red-100' : 'bg-orange-50 text-orange-700 hover:bg-orange-100'}`}
                              title={isExpired ? "Renew Expired Chamber" : "Extend Validity"}
                            >
                              <RefreshCw size={13} /> Renew
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

          {/* Footer with stats */}
          {!loading && filteredOrders.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-100 rounded-b-2xl flex flex-wrap items-center justify-between gap-2" style={{ backgroundColor: '#fafafa' }}>
              <span className="text-xs text-gray-500">
                Showing <strong>{filteredOrders.length}</strong> of <strong>{orders.length}</strong> payments
              </span>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Active: {stats.active}
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  Expired: {stats.expired}
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  Total: {stats.total}
                </span>
              </div>
            </div>
          )}

          {/* Pagination */}
          {!loading && filteredOrders.length > 0 && totalPages > 1 && (
            <div className="px-4 py-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3" style={{ backgroundColor: '#fafafa' }}>
              <p className="text-xs text-gray-500">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredOrders.length)} of {filteredOrders.length} entries
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                >
                  Previous
                </button>
                <span className="text-xs font-medium text-gray-600 px-2">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                >
                  Next
                </button>
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
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-gradient-to-br from-indigo-600 to-purple-600 text-white p-6 rounded-t-3xl flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <CreditCard size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Order Details</h3>
                  <p className="text-sm text-indigo-200">#{selectedOrder._id.slice(-6).toUpperCase()}</p>
                </div>
              </div>
              <button onClick={() => setShowDetailModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Chamber Details</p>
                <p className="mt-1 font-semibold text-gray-800">{getChamberName(selectedOrder)}</p>
                <p className="text-sm text-gray-600 flex items-center gap-1 mt-0.5">
                  <MapPin size={14} /> {getChamberAddress(selectedOrder)}
                </p>
                {selectedOrder.isFirstCabin && (
                  <span className="text-xs text-indigo-600 font-medium mt-1 inline-block">⭐ First Chamber</span>
                )}
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

              {selectedOrder.transactionId && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Hash size={18} className="text-indigo-600" />
                      <span className="text-sm font-medium text-gray-700">Transaction ID</span>
                    </div>
                    <span className="text-sm font-mono font-bold text-indigo-600">{selectedOrder.transactionId}</span>
                  </div>
                </div>
              )}

              <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <History size={18} className="text-purple-600" />
                    <span className="text-sm font-medium text-gray-700">Payment Count</span>
                  </div>
                  <span className="text-xl font-bold text-purple-600">{selectedOrder.paymentCount || 1}</span>
                </div>
              </div>

              {selectedOrder.status === 'active' && countdowns[selectedOrder._id] > 0 && (
                <div className={`rounded-xl p-4 border ${countdowns[selectedOrder._id] < 86400 ? 'bg-orange-50 border-orange-200' : 'bg-emerald-50 border-emerald-200'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Timer size={18} className={countdowns[selectedOrder._id] < 86400 ? 'text-orange-500' : 'text-emerald-500'} />
                      <span className="text-sm font-medium text-gray-700">Time Remaining</span>
                    </div>
                    <span className={`text-xl font-bold font-mono ${countdowns[selectedOrder._id] < 86400 ? 'text-orange-600' : 'text-emerald-600'}`}>
                      {formatCountdown(countdowns[selectedOrder._id])}
                    </span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Amount</p>
                  <p className="text-xl font-bold text-indigo-600 mt-1">{formatCurrency(selectedOrder.amount)}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Status</p>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-full border mt-1 ${getStatusBadge(selectedOrder.status, selectedOrder.expiryDate).color}`}>
                    {getStatusBadge(selectedOrder.status, selectedOrder.expiryDate).icon}
                    {getStatusBadge(selectedOrder.status, selectedOrder.expiryDate).label}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Start Date</p>
                  <p className="text-sm font-medium text-gray-700 mt-1">{formatDate(selectedOrder.startDate)}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Expiry Date</p>
                  <p className="text-sm font-medium text-gray-700 mt-1">{formatDate(selectedOrder.expiryDate)}</p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => { setShowDetailModal(false); downloadInvoice(selectedOrder); }}
                  className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-sm active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <FileDown size={16} /> Download Invoice
                </button>
                <button
                  onClick={() => { setShowDetailModal(false); setRenewOrder(selectedOrder); setShowRenewModal(true); }}
                  className={`w-full py-3 rounded-xl font-bold transition shadow-sm active:scale-[0.98] flex items-center justify-center gap-2 ${
                    selectedOrder.status === 'expired' || new Date(selectedOrder.expiryDate) < new Date()
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-orange-500 text-white hover:bg-orange-600'
                  }`}
                >
                  <RefreshCw size={16} />
                  {selectedOrder.status === 'expired' || new Date(selectedOrder.expiryDate) < new Date()
                    ? `Renew (${formatCurrency(selectedOrder.amount)})`
                    : `Extend (${formatCurrency(selectedOrder.amount)})`
                  }
                </button>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="w-full py-3 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================== */}
      {/* RENEW PAYMENT MODAL */}
      {/* ====================== */}
      {showRenewModal && renewOrder && (
        <div className="fixed inset-0 z-[1300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) { setShowRenewModal(false); setRenewOrder(null); } }}>
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className={`p-6 text-center text-white ${renewOrder.status === 'expired' || new Date(renewOrder.expiryDate) < new Date() ? 'bg-gradient-to-br from-red-500 to-red-600' : 'bg-gradient-to-br from-orange-500 to-orange-600'}`}>
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
                <RefreshCw size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold">
                {renewOrder.status === 'expired' || new Date(renewOrder.expiryDate) < new Date()
                  ? 'Renew Expired Chamber'
                  : 'Extend Chamber Validity'
                }
              </h3>
              <p className="text-sm opacity-80 mt-1">
                {renewOrder.status === 'expired' || new Date(renewOrder.expiryDate) < new Date()
                  ? 'Your chamber has expired. Renew to activate for 30 more days.'
                  : 'Extend your chamber validity for 30 more days.'
                }
              </p>
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-gray-50 rounded-xl p-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Chamber</span>
                  <span className="font-semibold text-gray-800">{getChamberName(renewOrder)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Current Status</span>
                  <span className={`font-medium ${renewOrder.status === 'expired' || new Date(renewOrder.expiryDate) < new Date() ? 'text-red-600' : 'text-emerald-600'}`}>
                    {renewOrder.status === 'expired' || new Date(renewOrder.expiryDate) < new Date() ? 'Expired' : 'Active'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Expiry Date</span>
                  <span className="font-medium">{formatDate(renewOrder.expiryDate)}</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2">
                  <span className="text-gray-500 font-bold">Renewal Fee</span>
                  <span className="text-xl font-bold text-indigo-600">{formatCurrency(renewOrder.amount)}</span>
                </div>
              </div>

              <div className="bg-amber-50 rounded-xl p-3 text-xs text-amber-700 flex items-start gap-2 border border-amber-200">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>Your chamber will be active for 30 more days after successful renewal.</span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleRenewPayment}
                  disabled={renewing}
                  className={`flex-1 py-3 rounded-xl text-white font-bold transition flex items-center justify-center gap-2 ${
                    renewing ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg'
                  }`}
                >
                  {renewing ? 'Processing...' : `Pay ${formatCurrency(renewOrder.amount)}`}
                </button>
                <button
                  onClick={() => { setShowRenewModal(false); setRenewOrder(null); }}
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

export default MyChamberPayments;