// MyCabinPayments.jsx - Complete with All Data and Professional Invoice
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
  Percent
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import UsersNavbar from "./UsersNavbar";
import "./Dashboard.css";

const API_URL = "http://62.72.29.27:5003";

const MyCabinPayments = () => {
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

      console.log("Payments response:", res.data);

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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(orders.length / itemsPerPage);

  const getStatusBadge = (status, expiryDate, orderId) => {
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

  const getCabinName = (order) => {
    return order.cabin?.name || 'Cabin Deleted';
  };

  const getCabinAddress = (order) => {
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

      toast.success(`Cabin renewed successfully! Amount: ₹${res.data.amount}`);
      setShowRenewModal(false);
      setRenewOrder(null);
      
      await fetchPayments();
      
    } catch (err) {
      console.error("Renew payment error:", err);
      toast.error(err.response?.data?.error || "Failed to renew cabin");
    } finally {
      setRenewing(false);
    }
  };

  // ======================
  // PROFESSIONAL INVOICE DOWNLOAD
  // ======================
  const downloadInvoice = (order) => {
    try {
      const cabin = order.cabin || {};
      const cabinName = cabin.name || 'Cabin Deleted';
      const cabinAddress = cabin.address || 'N/A';
      
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
      
      const now = new Date();
      const expiry = new Date(order.expiryDate);
      const daysRemaining = Math.max(0, Math.ceil((expiry - now) / (1000 * 60 * 60 * 24)));
      
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
                <div class="gst">GST: ${order.gstRate ? (order.gstRate * 100) + '%' : '18%'}</div>
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
                <div class="value">${localStorage.getItem('userName') || 'Customer'}</div>
                <div class="value-small">Cabin Registration</div>
              </div>
              <div>
                <div class="title">Cabin Details</div>
                <div class="value">${cabinName}</div>
                <div class="address-line">${cabinAddress}</div>
                <div class="value-small" style="margin-top:4px;">${order.isFirstCabin ? '⭐ First Cabin' : 'Cabin #' + (orders.indexOf(order) + 1)}</div>
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
                  <td><strong>Cabin Registration</strong></td>
                  <td>
                    ${cabinName}<br>
                    <span style="font-size:11px;color:#666666;">${order.isFirstCabin ? 'First Cabin Registration' : 'Cabin Registration'}</span>
                    ${order.transactionId ? `<br><span style="font-size:10px;color:#888888;font-family:monospace;">TXN: ${order.transactionId}</span>` : ''}
                    ${order.paymentCount > 1 ? `<br><span style="font-size:11px;color:#059669;font-weight:600;">🔄 Renewal #${order.paymentCount}</span>` : ''}
                  </td>
                  <td>₹${baseAmount.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>

            <div class="status-row">
              <div class="item">
                <div class="label">Payment Method</div>
                <div class="value">Online</div>
              </div>
              <div class="item">
                <div class="label">Payment Status</div>
                <div class="value">${paymentStatus}</div>
              </div>
              <div class="item">
                <div class="label">Order Status</div>
                <div class="value">${status}</div>
              </div>
              ${order.transactionId ? `
              <div class="item">
                <div class="label">Transaction ID</div>
                <div class="value" style="font-family:monospace;font-size:11px;">${order.transactionId}</div>
              </div>
              ` : ''}
            </div>

            <div class="totals">
              <div class="totals-box">
                <div class="totals-row">
                  <span>Subtotal</span>
                  <span>₹${baseAmount.toFixed(2)}</span>
                </div>
                <div class="totals-row">
                  <span>GST (${(gstRate * 100).toFixed(0)}%)</span>
                  <span>₹${gstAmount.toFixed(2)}</span>
                </div>
                <div class="totals-row total">
                  <span>Total Amount</span>
                  <span class="amount">₹${amount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div class="footer">
              <div class="powered">POWERED BY <span>IRYAX SPACE</span></div>
              <div class="sub">Thank you for choosing ${cabinName}</div>
              <div class="sub" style="margin-top:2px;">This is a system generated invoice</div>
              <div class="sub" style="margin-top:2px;font-size:8px;">${order.isFirstCabin ? '⭐ First Cabin Registration' : `Payment #${order.paymentCount || 1}`}</div>
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

  return (
    <div className="admin-dash">
      <UsersNavbar />

      <main className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16">
        {/* Header */}
        <div className="admin-dash__header">
          <div>
            <h1 className="admin-dash__greeting">
              My <span>Payments</span>
            </h1>
            <p className="admin-dash__subtitle">
              Track all your cabin registration payments and orders.
            </p>
          </div>
          <button
            onClick={fetchPayments}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase">Total Orders</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</p>
              </div>
              <div className="bg-indigo-100 p-2 rounded-lg">
                <Receipt size={20} className="text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase">Active</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.active}</p>
              </div>
              <div className="bg-emerald-100 p-2 rounded-lg">
                <CheckCircle size={20} className="text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase">Expired</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{stats.expired}</p>
              </div>
              <div className="bg-red-100 p-2 rounded-lg">
                <XCircle size={20} className="text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase">Total Spent</p>
                <p className="text-2xl font-bold text-indigo-600 mt-1">
                  {formatCurrency(stats.totalAmount)}
                </p>
              </div>
              <div className="bg-purple-100 p-2 rounded-lg">
                <IndianRupee size={20} className="text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <h3 className="text-sm font-semibold text-slate-700">Payment History</h3>
            <span className="text-xs text-slate-500">{orders.length} records</span>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="admin-dash__spinner mx-auto" />
              <p className="text-sm text-slate-500 mt-3">Loading payments...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center">
              <CreditCard size={48} className="text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 font-medium">No payments found</p>
              <p className="text-sm text-slate-400">Add a cabin to start your payment history.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Cabin
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        TXN ID
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Payment
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Payments
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Expiry
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Status / Countdown
                      </th>
                      <th className="text-center py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentOrders.map((order) => {
                      const status = getStatusBadge(order.status, order.expiryDate, order._id);
                      const countdown = countdowns[order._id] || 0;
                      const isExpiringSoon = countdown > 0 && countdown < 86400;
                      const isExpired = order.status === 'expired' || (order.status === 'active' && new Date(order.expiryDate) < new Date());
                      
                      return (
                        <tr key={order._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium text-slate-800 text-sm">
                                {getCabinName(order)}
                              </p>
                              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                <MapPin size={12} />
                                {getCabinAddress(order)}
                              </p>
                              {order.cabin === null && (
                                <span className="text-[10px] text-red-500 font-medium">⚠️ Cabin Deleted</span>
                              )}
                              {order.isFirstCabin && (
                                <span className="text-[10px] text-indigo-600 font-medium ml-1">⭐ First</span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-bold text-indigo-600 text-sm">
                                {formatCurrency(order.amount)}
                              </p>
                              {order.baseAmount && order.gstAmount && (
                                <p className="text-[8px] text-slate-400">
                                  Base: ₹{order.baseAmount} + GST: ₹{order.gstAmount}
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            {order.transactionId ? (
                              <span className="text-xs font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded">
                                {order.transactionId}
                              </span>
                            ) : (
                              <span className="text-xs text-slate-400">N/A</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                              order.paymentStatus === 'completed' 
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {order.paymentStatus === 'completed' ? (
                                <CheckCircle size={12} />
                              ) : (
                                <Clock size={12} />
                              )}
                              {order.paymentStatus === 'completed' ? 'Completed' : 'Pending'}
                            </span>
                            {order.razorpayPaymentId && (
                              <p className="text-[10px] text-slate-400 font-mono mt-0.5 truncate max-w-[80px]">
                                {order.razorpayPaymentId}
                              </p>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1">
                              <History size={14} className="text-indigo-400" />
                              <span className="text-sm font-semibold text-slate-700">
                                {order.paymentCount || 1}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm text-slate-600">
                              {formatDate(order.expiryDate)}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex flex-col gap-1">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${status.color}`}>
                                {status.icon}
                                {status.label}
                              </span>
                              {order.status === 'active' && countdown > 0 && (
                                <span className={`text-xs font-mono font-medium flex items-center gap-1 ${getCountdownColor(countdown)}`}>
                                  <Timer size={12} />
                                  {formatCountdown(countdown)}
                                </span>
                              )}
                              {order.status === 'active' && countdown > 0 && isExpiringSoon && (
                                <span className="text-[10px] text-orange-500 font-medium animate-pulse">
                                  ⚠️ Expiring soon!
                                </span>
                              )}
                              {isExpired && (
                                <span className="text-[10px] text-red-500 font-medium">
                                  🔴 Expired - Renew now!
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-center gap-1.5 flex-wrap">
                              {/* View Details */}
                              <button
                                onClick={() => handleViewDetails(order)}
                                className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                                title="View Details"
                              >
                                <Eye size={16} />
                              </button>
                              
                              {/* Download Invoice */}
                              <button
                                onClick={() => downloadInvoice(order)}
                                className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
                                title="Download Invoice"
                              >
                                <FileDown size={16} />
                              </button>
                              
                              {/* Renew Payment - ALWAYS VISIBLE */}
                              <button
                                onClick={() => {
                                  setRenewOrder(order);
                                  setShowRenewModal(true);
                                }}
                                className={`p-1.5 rounded-lg transition-colors ${
                                  isExpired 
                                    ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                                    : 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                                }`}
                                title={isExpired ? "Renew Expired Cabin" : "Extend Validity"}
                              >
                                <RefreshCw size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-sm text-slate-500">
                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, orders.length)} of {orders.length} entries
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`p-2 rounded-lg border border-slate-200 transition-colors ${
                        currentPage === 1 
                          ? 'opacity-50 cursor-not-allowed' 
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <span className="text-sm font-medium text-slate-600 px-3">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className={`p-2 rounded-lg border border-slate-200 transition-colors ${
                        currentPage === totalPages 
                          ? 'opacity-50 cursor-not-allowed' 
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Order Detail Modal */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={(e) => {
          if (e.target === e.currentTarget) setShowDetailModal(false);
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
                  <CreditCard size={20} color="#fff" />
                </div>
                <div>
                  <h3 style={{ margin: 0, color: "#fff", fontSize: "1rem", fontWeight: 700 }}>
                    Order Details
                  </h3>
                  <p style={{ margin: 0, color: "rgba(255,255,255,0.8)", fontSize: "0.75rem" }}>
                    #{selectedOrder._id.slice(-6)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
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
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Cabin Details</p>
                  <p className="font-semibold text-slate-800 mt-1">{getCabinName(selectedOrder)}</p>
                  <p className="text-sm text-slate-600 flex items-center gap-1 mt-0.5">
                    <MapPin size={14} />
                    {getCabinAddress(selectedOrder)}
                  </p>
                  {selectedOrder.isFirstCabin && (
                    <span className="text-xs text-indigo-600 font-medium mt-1 inline-block">⭐ First Cabin</span>
                  )}
                  {selectedOrder.cabin === null && (
                    <span className="text-xs text-red-500 font-medium mt-1 inline-block">⚠️ Cabin Deleted</span>
                  )}
                </div>

                {/* Amount Breakdown */}
                <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                  <p className="text-xs font-medium text-indigo-600 uppercase tracking-wider">Amount Breakdown</p>
                  <div className="mt-2 space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Base Amount</span>
                      <span className="font-semibold">₹{selectedOrder.baseAmount?.toFixed(2) || selectedOrder.amount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">GST ({(selectedOrder.gstRate * 100).toFixed(0)}%)</span>
                      <span className="font-semibold">₹{selectedOrder.gstAmount?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="border-t border-indigo-200 pt-1.5 flex justify-between text-sm font-bold">
                      <span>Total</span>
                      <span className="text-indigo-600">₹{selectedOrder.amount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {selectedOrder.transactionId && (
                  <div className="bg-slate-50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Hash size={18} className="text-indigo-600" />
                        <span className="text-sm font-medium text-slate-700">Transaction ID</span>
                      </div>
                      <span className="text-sm font-mono font-bold text-indigo-600">
                        {selectedOrder.transactionId}
                      </span>
                    </div>
                  </div>
                )}

                <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <History size={18} className="text-purple-600" />
                      <span className="text-sm font-medium text-slate-700">Payment Count</span>
                    </div>
                    <span className="text-xl font-bold text-purple-600">
                      {selectedOrder.paymentCount || 1}
                    </span>
                  </div>
                </div>

                {selectedOrder.status === 'active' && countdowns[selectedOrder._id] > 0 && (
                  <div className={`rounded-xl p-4 border ${
                    countdowns[selectedOrder._id] < 86400 
                      ? 'bg-orange-50 border-orange-200' 
                      : 'bg-emerald-50 border-emerald-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Timer size={18} className={countdowns[selectedOrder._id] < 86400 ? 'text-orange-500' : 'text-emerald-500'} />
                        <span className="text-sm font-medium text-slate-700">Time Remaining</span>
                      </div>
                      <span className={`text-xl font-bold font-mono ${
                        countdowns[selectedOrder._id] < 86400 ? 'text-orange-600' : 'text-emerald-600'
                      }`}>
                        {formatCountdown(countdowns[selectedOrder._id])}
                      </span>
                    </div>
                    {countdowns[selectedOrder._id] < 86400 && (
                      <p className="text-xs text-orange-500 mt-2 font-medium animate-pulse">
                        ⚠️ Your cabin will expire soon! Please renew.
                      </p>
                    )}
                  </div>
                )}

                {(selectedOrder.status === 'expired' || new Date(selectedOrder.expiryDate) < new Date()) && (
                  <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <XCircle size={18} className="text-red-600" />
                        <span className="text-sm font-medium text-red-700">Cabin Expired</span>
                      </div>
                      <span className="text-sm font-bold text-red-600">Renew Now!</span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Amount</p>
                    <p className="text-xl font-bold text-indigo-600 mt-1">
                      {formatCurrency(selectedOrder.amount)}
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Status</p>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border mt-1 ${
                      getStatusBadge(selectedOrder.status, selectedOrder.expiryDate, selectedOrder._id).color
                    }`}>
                      {getStatusBadge(selectedOrder.status, selectedOrder.expiryDate, selectedOrder._id).icon}
                      {getStatusBadge(selectedOrder.status, selectedOrder.expiryDate, selectedOrder._id).label}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Payment Details</p>
                  {selectedOrder.razorpayPaymentId && (
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-sm text-slate-600">Razorpay Payment ID</span>
                      <span className="text-xs font-mono text-slate-500">{selectedOrder.razorpayPaymentId}</span>
                    </div>
                  )}
                  {selectedOrder.razorpayOrderId && (
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-sm text-slate-600">Razorpay Order ID</span>
                      <span className="text-xs font-mono text-slate-500">{selectedOrder.razorpayOrderId}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-sm text-slate-600">Payment Status</span>
                    <span className={`text-sm font-medium ${
                      selectedOrder.paymentStatus === 'completed' 
                        ? 'text-emerald-600' 
                        : 'text-yellow-600'
                    }`}>
                      {selectedOrder.paymentStatus === 'completed' ? '✅ Completed' : '⏳ Pending'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <CalendarIcon size={12} />
                      Start Date
                    </p>
                    <p className="text-sm font-medium text-slate-700 mt-1">
                      {formatDate(selectedOrder.startDate)}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {formatDateTime(selectedOrder.startDate)}
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <ClockIcon size={12} />
                      Expiry Date
                    </p>
                    <p className="text-sm font-medium text-slate-700 mt-1">
                      {formatDate(selectedOrder.expiryDate)}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {formatDateTime(selectedOrder.expiryDate)}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Order Info</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-sm text-slate-600">Order ID</span>
                    <span className="text-xs font-mono text-slate-500">{selectedOrder._id}</span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-sm text-slate-600">Created At</span>
                    <span className="text-xs text-slate-500">{formatDateTime(selectedOrder.createdAt)}</span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-sm text-slate-600">Last Updated</span>
                    <span className="text-xs text-slate-500">{formatDateTime(selectedOrder.updatedAt)}</span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-sm text-slate-600">Payment Count</span>
                    <span className="text-sm font-medium text-slate-700">{selectedOrder.paymentCount || 1}</span>
                  </div>
                  {selectedOrder.isFirstCabin && (
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-sm text-slate-600">Type</span>
                      <span className="text-sm font-medium text-indigo-600">⭐ First Cabin</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      downloadInvoice(selectedOrder);
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
                    onClick={() => {
                      setShowDetailModal(false);
                      setRenewOrder(selectedOrder);
                      setShowRenewModal(true);
                    }}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      borderRadius: 10,
                      border: "none",
                      background: (selectedOrder.status === 'expired' || new Date(selectedOrder.expiryDate) < new Date())
                        ? "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
                        : "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                      color: "#fff",
                      fontFamily: "inherit",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      boxShadow: "0 4px 14px rgba(245, 158, 11, 0.35)",
                      transition: "all 160ms",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)" }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)" }}
                  >
                    <RefreshCw size={18} />
                    {selectedOrder.status === 'expired' || new Date(selectedOrder.expiryDate) < new Date() 
                      ? `Renew Expired Cabin (${formatCurrency(selectedOrder.amount)})`
                      : `Extend Validity (${formatCurrency(selectedOrder.amount)})`
                    }
                  </button>

                  <button
                    onClick={() => setShowDetailModal(false)}
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
        </div>
      )}

      {/* Renew Payment Modal */}
      {showRenewModal && renewOrder && (
        <div className="fixed inset-0 z-[1300] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowRenewModal(false);
            setRenewOrder(null);
          }
        }}>
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div style={{
              background: (renewOrder.status === 'expired' || new Date(renewOrder.expiryDate) < new Date())
                ? "linear-gradient(135deg, #ef4444 0%, #dc2626 60%, #b91c1c 100%)"
                : "linear-gradient(135deg, #f59e0b 0%, #d97706 60%, #b45309 100%)",
              padding: "1.5rem",
              textAlign: "center"
            }}>
              <div style={{
                width: 64, height: 64, borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 0.75rem"
              }}>
                <RefreshCw size={32} color="#fff" />
              </div>
              <h3 style={{ margin: 0, color: "#fff", fontSize: "1.25rem", fontWeight: 700 }}>
                {renewOrder.status === 'expired' || new Date(renewOrder.expiryDate) < new Date() 
                  ? 'Renew Expired Cabin' 
                  : 'Extend Cabin Validity'
                }
              </h3>
              <p style={{ margin: "0.25rem 0 0", color: "rgba(255,255,255,0.8)", fontSize: "0.875rem" }}>
                {renewOrder.status === 'expired' || new Date(renewOrder.expiryDate) < new Date()
                  ? 'Your cabin has expired. Renew to activate for 30 more days.'
                  : 'Extend your cabin validity for 30 more days.'
                }
              </p>
            </div>

            <div style={{ padding: "1.5rem" }}>
              <div style={{ 
                background: "#f8fafc", 
                borderRadius: 12, 
                padding: "1rem",
                marginBottom: "1.25rem"
              }}>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span style={{ color: "#64748b", fontSize: "0.875rem" }}>Cabin</span>
                    <span style={{ fontWeight: 600, color: "#1e293b" }}>{getCabinName(renewOrder)}</span>
                  </div>
                  {renewOrder.transactionId && (
                    <div className="flex justify-between items-center">
                      <span style={{ color: "#64748b", fontSize: "0.875rem" }}>Transaction ID</span>
                      <span style={{ fontWeight: 500, color: "#4f46e5", fontSize: "0.75rem", fontFamily: "monospace" }}>
                        {renewOrder.transactionId}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span style={{ color: "#64748b", fontSize: "0.875rem" }}>Current Status</span>
                    <span className={`text-sm font-medium ${renewOrder.status === 'expired' || new Date(renewOrder.expiryDate) < new Date() ? 'text-red-600' : 'text-emerald-600'}`}>
                      {renewOrder.status === 'expired' || new Date(renewOrder.expiryDate) < new Date() ? 'Expired' : 'Active'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: "#64748b", fontSize: "0.875rem" }}>Expiry Date</span>
                    <span style={{ fontWeight: 500, color: "#1e293b" }}>{formatDate(renewOrder.expiryDate)}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-slate-200 pt-2">
                    <span style={{ color: "#64748b", fontSize: "0.875rem" }}>Renewal Fee</span>
                    <span style={{ fontSize: "1.25rem", fontWeight: 700, color: "#d97706" }}>
                      {formatCurrency(renewOrder.amount)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: "#64748b", fontSize: "0.75rem" }}>New Validity</span>
                    <span style={{ fontSize: "0.75rem", fontWeight: 500, color: "#059669" }}>
                      <Calendar size={12} className="inline mr-1" />
                      30 Days from renewal
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: "#64748b", fontSize: "0.75rem" }}>Total Payments</span>
                    <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#6366f1" }}>
                      <History size={12} className="inline mr-1" />
                      {(renewOrder.paymentCount || 0) + 1}
                    </span>
                  </div>
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
                <span>Your cabin will be active for 30 more days after successful renewal.</span>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={handleRenewPayment}
                  disabled={renewing}
                  style={{
                    width: "100%",
                    padding: "0.875rem",
                    borderRadius: 10,
                    border: "none",
                    background: renewing
                      ? "#fcd34d"
                      : "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                    color: "#fff",
                    fontFamily: "inherit",
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    cursor: renewing ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    boxShadow: renewing ? "none" : "0 4px 14px rgba(245, 158, 11, 0.35)",
                    transition: "all 160ms",
                  }}
                >
                  {renewing ? (
                    <>
                      <span style={{
                        width: 16, height: 16, borderRadius: "50%",
                        border: "2px solid rgba(255,255,255,0.4)",
                        borderTopColor: "#fff",
                        animation: "spin 0.7s linear infinite",
                        display: "inline-block",
                      }} />
                      Processing...
                    </>
                  ) : (
                    <>Confirm Renewal & Pay {formatCurrency(renewOrder.amount)}</>
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowRenewModal(false);
                    setRenewOrder(null);
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

export default MyCabinPayments;