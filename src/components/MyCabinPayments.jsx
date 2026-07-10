// MyCabinPayments.jsx
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
  Clock as ClockIcon
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import UsersNavbar from "./UsersNavbar";
import "./Dashboard.css";

const API_URL = "http://localhost:5000";

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
  // INVOICE DOWNLOAD FUNCTION
  // ======================
  const downloadInvoice = (order) => {
    try {
      const cabinName = getCabinName(order);
      const cabinAddress = getCabinAddress(order);
      const amount = formatCurrency(order.amount);
      const orderId = order._id.slice(-8).toUpperCase();
      const startDate = formatDate(order.startDate);
      const expiryDate = formatDate(order.expiryDate);
      const status = order.status.charAt(0).toUpperCase() + order.status.slice(1);
      const paymentStatus = order.paymentStatus === 'completed' ? 'Completed ✅' : 'Pending ⏳';
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
              font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
              background: #f0f2f5;
              padding: 40px;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
            }
            .invoice-container {
              max-width: 900px;
              width: 100%;
              background: #ffffff;
              border-radius: 20px;
              box-shadow: 0 20px 60px rgba(0,0,0,0.10);
              overflow: hidden;
            }
            .invoice-header {
              background: linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4f46e5 100%);
              padding: 35px 45px;
              color: white;
              display: flex;
              justify-content: space-between;
              align-items: center;
              position: relative;
            }
            .invoice-header::after {
              content: '';
              position: absolute;
              bottom: 0;
              left: 0;
              right: 0;
              height: 4px;
              background: linear-gradient(90deg, #818cf8, #c7d2fe, #818cf8);
            }
            .brand {
              display: flex;
              align-items: center;
              gap: 15px;
            }
            .brand-icon {
              width: 50px;
              height: 50px;
              background: rgba(255,255,255,0.15);
              border-radius: 12px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 28px;
            }
            .brand h1 {
              font-size: 26px;
              font-weight: 800;
              letter-spacing: -0.5px;
            }
            .brand .tagline {
              font-size: 12px;
              opacity: 0.7;
              font-weight: 400;
              letter-spacing: 1px;
            }
            .invoice-number {
              text-align: right;
            }
            .invoice-number .label {
              font-size: 11px;
              opacity: 0.6;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .invoice-number .number {
              font-size: 22px;
              font-weight: 700;
              margin-top: 4px;
            }
            .invoice-body {
              padding: 40px 45px;
            }
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 30px;
              margin-bottom: 30px;
              padding-bottom: 25px;
              border-bottom: 2px solid #f1f5f9;
            }
            .info-group .title {
              font-size: 11px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.8px;
              color: #94a3b8;
              margin-bottom: 8px;
            }
            .info-group .value {
              font-size: 15px;
              font-weight: 600;
              color: #0f172a;
              line-height: 1.6;
            }
            .info-group .value-small {
              font-size: 13px;
              font-weight: 400;
              color: #475569;
            }
            .invoice-table {
              width: 100%;
              border-collapse: collapse;
              margin: 25px 0;
            }
            .invoice-table thead {
              background: #f8fafc;
              border-radius: 10px;
            }
            .invoice-table thead th {
              padding: 14px 16px;
              text-align: left;
              font-size: 11px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.8px;
              color: #64748b;
              border-bottom: 2px solid #e2e8f0;
            }
            .invoice-table thead th:last-child {
              text-align: right;
            }
            .invoice-table tbody td {
              padding: 14px 16px;
              font-size: 14px;
              color: #1e293b;
              border-bottom: 1px solid #f1f5f9;
            }
            .invoice-table tbody td:last-child {
              text-align: right;
              font-weight: 600;
            }
            .invoice-table tbody tr:last-child td {
              border-bottom: none;
            }
            .badge {
              display: inline-block;
              padding: 4px 14px;
              border-radius: 20px;
              font-size: 11px;
              font-weight: 600;
            }
            .badge-active { background: #d1fae5; color: #065f46; }
            .badge-expired { background: #fee2e2; color: #991b1b; }
            .badge-cancelled { background: #fef3c7; color: #92400e; }
            .badge-completed { background: #d1fae5; color: #065f46; }
            .badge-pending { background: #fef3c7; color: #92400e; }
            .countdown-box {
              background: linear-gradient(135deg, #f0fdf4, #dcfce7);
              border: 1px solid #86efac;
              border-radius: 12px;
              padding: 16px 20px;
              margin: 15px 0;
              display: flex;
              align-items: center;
              justify-content: space-between;
            }
            .countdown-box .label { font-size: 13px; font-weight: 600; color: #065f46; }
            .countdown-box .time { font-size: 20px; font-weight: 700; color: #065f46; }
            .payment-history-box {
              background: #f8fafc;
              border-radius: 12px;
              padding: 16px 20px;
              margin: 15px 0;
              border: 1px solid #e2e8f0;
            }
            .payment-history-box .title {
              font-size: 12px;
              font-weight: 600;
              color: #94a3b8;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .payment-history-box .count {
              font-size: 18px;
              font-weight: 700;
              color: #1e293b;
            }
            .totals {
              margin-top: 25px;
              padding-top: 25px;
              border-top: 2px solid #f1f5f9;
              display: flex;
              justify-content: flex-end;
            }
            .totals-box { width: 320px; }
            .totals-row {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
              font-size: 14px;
              color: #475569;
            }
            .totals-row.total {
              font-size: 20px;
              font-weight: 800;
              color: #0f172a;
              border-top: 2px solid #e2e8f0;
              padding-top: 14px;
              margin-top: 6px;
            }
            .totals-row.total .amount { color: #4f46e5; }
            .invoice-footer {
              padding: 20px 45px;
              background: #f8fafc;
              text-align: center;
              border-top: 1px solid #e2e8f0;
            }
            .invoice-footer p { font-size: 12px; color: #94a3b8; }
            .invoice-footer .highlight { color: #4f46e5; font-weight: 600; }
            .print-btn {
              position: fixed;
              bottom: 30px;
              right: 30px;
              padding: 14px 32px;
              background: linear-gradient(135deg, #4f46e5, #6366f1);
              color: white;
              border: none;
              border-radius: 14px;
              font-weight: 600;
              font-size: 14px;
              cursor: pointer;
              box-shadow: 0 8px 30px rgba(79, 70, 229, 0.4);
              display: flex;
              align-items: center;
              gap: 10px;
              transition: all 0.3s ease;
              z-index: 999;
            }
            .print-btn:hover {
              transform: translateY(-2px);
              box-shadow: 0 12px 40px rgba(79, 70, 229, 0.5);
            }
            @media print {
              body { background: white; padding: 0; }
              .invoice-container { box-shadow: none; border-radius: 0; }
              .print-btn { display: none !important; }
              .invoice-header { background: #1e1b4b !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              .invoice-header::after { display: none; }
              .badge-active, .badge-expired, .badge-cancelled, .badge-completed, .badge-pending {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              .countdown-box { background: #f0fdf4 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              .payment-history-box { background: #f8fafc !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
            @media (max-width: 640px) {
              body { padding: 20px; }
              .invoice-header { flex-direction: column; text-align: center; gap: 15px; padding: 25px; }
              .invoice-number { text-align: center; }
              .info-grid { grid-template-columns: 1fr; gap: 15px; }
              .invoice-body { padding: 25px; }
              .invoice-table thead th { font-size: 10px; padding: 10px 12px; }
              .invoice-table tbody td { font-size: 12px; padding: 10px 12px; }
              .totals { justify-content: center; }
              .totals-box { width: 100%; }
              .print-btn { bottom: 20px; right: 20px; padding: 12px 20px; font-size: 12px; }
              .countdown-box { flex-direction: column; gap: 8px; text-align: center; }
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <div class="invoice-header">
              <div class="brand">
                <div class="brand-icon">🏢</div>
                <div>
                  <h1>IRYAX Workspace</h1>
                  <div class="tagline">Premium Coworking Spaces</div>
                </div>
              </div>
              <div class="invoice-number">
                <div class="label">Invoice #</div>
                <div class="number">${orderId}</div>
              </div>
            </div>

            <div class="invoice-body">
              <div class="info-grid">
                <div>
                  <div class="title">Bill To</div>
                  <div class="value">${localStorage.getItem('userName') || 'Customer'}</div>
                  <div class="value-small">Cabin Registration</div>
                </div>
                <div>
                  <div class="title">Invoice Details</div>
                  <div class="value-small">
                    <div>📅 Date: ${today}</div>
                    <div>🆔 Order: #${order._id.slice(-12)}</div>
                    ${order.transactionId ? `<div>💳 TXN: ${order.transactionId}</div>` : ''}
                  </div>
                </div>
              </div>

              ${order.status === 'active' ? `
              <div class="countdown-box">
                <span class="label">⏱️ Time Remaining</span>
                <span class="time">${daysRemaining} days ${new Date(order.expiryDate).getHours()}h ${new Date(order.expiryDate).getMinutes()}m</span>
              </div>
              ` : `
              <div class="countdown-box" style="background:#fef2f2;border-color:#fca5a5;">
                <span class="label" style="color:#991b1b;">⏱️ Expired</span>
                <span class="time" style="color:#991b1b;">Renew to activate</span>
              </div>
              `}

              <div class="payment-history-box">
                <div class="title">💰 Payment History</div>
                <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;">
                  <span class="count">${order.paymentCount || 1} payments</span>
                  <span style="font-size:13px;color:#64748b;">Total: ${formatCurrency((order.paymentCount || 1) * order.amount)}</span>
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
                      <div>${cabinName}</div>
                      <div style="font-size:12px;color:#94a3b8;">${cabinAddress}</div>
                      ${order.isFirstCabin ? '<div style="font-size:11px;color:#4f46e5;font-weight:600;">⭐ First Cabin</div>' : ''}
                      ${order.paymentCount > 1 ? `<div style="font-size:11px;color:#059669;font-weight:600;">🔄 Renewal #${order.paymentCount}</div>` : ''}
                      ${order.transactionId ? `<div style="font-size:10px;color:#64748b;font-family:monospace;margin-top:4px;">TXN: ${order.transactionId}</div>` : ''}
                    </td>
                    <td>${amount}</td>
                  </tr>
                </tbody>
              </table>

              <div style="display:flex;gap:20px;flex-wrap:wrap;margin:10px 0 20px;">
                <div>
                  <span style="font-size:12px;color:#94a3b8;">Payment Status</span>
                  <div><span class="badge badge-${order.paymentStatus}">${paymentStatus}</span></div>
                </div>
                <div>
                  <span style="font-size:12px;color:#94a3b8;">Order Status</span>
                  <div><span class="badge badge-${order.status}">${status}</span></div>
                </div>
                <div>
                  <span style="font-size:12px;color:#94a3b8;">Validity</span>
                  <div style="font-size:14px;font-weight:600;color:#0f172a;">${startDate} — ${expiryDate}</div>
                </div>
                ${order.razorpayPaymentId ? `
                <div>
                  <span style="font-size:12px;color:#94a3b8;">Payment ID</span>
                  <div style="font-size:12px;font-family:monospace;color:#475569;">${order.razorpayPaymentId}</div>
                </div>
                ` : ''}
              </div>

              <div class="totals">
                <div class="totals-box">
                  <div class="totals-row">
                    <span>Subtotal</span>
                    <span>${amount}</span>
                  </div>
                  <div class="totals-row">
                    <span>Tax (GST)</span>
                    <span>₹0.00</span>
                  </div>
                  <div class="totals-row total">
                    <span>Total Amount</span>
                    <span class="amount">${amount}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="invoice-footer">
              <p>
                Thank you for choosing <span class="highlight">IRYAX Workspace</span> • 
                This is a system generated invoice • Valid for 30 days
              </p>
              <p style="font-size:10px;margin-top:6px;color:#cbd5e1;">
                For any queries, contact support@ingrainworkspace.com
              </p>
            </div>
          </div>

          <button class="print-btn" onclick="window.print()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <p className="font-bold text-indigo-600 text-sm">
                              {formatCurrency(order.amount)}
                            </p>
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

      {/* Order Detail Modal - Fixed Overlay */}
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
                {/* Cabin Info */}
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Cabin Details</p>
                  <p className="font-semibold text-slate-800 mt-1">{getCabinName(selectedOrder)}</p>
                  <p className="text-sm text-slate-600 flex items-center gap-1 mt-0.5">
                    <MapPin size={14} />
                    {getCabinAddress(selectedOrder)}
                  </p>
                  {selectedOrder.cabin === null && (
                    <span className="text-xs text-red-500 font-medium mt-1 inline-block">⚠️ Cabin Deleted</span>
                  )}
                </div>

                {/* Transaction ID */}
                {selectedOrder.transactionId && (
                  <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
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

                {/* Payment Count */}
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <History size={18} className="text-purple-600" />
                      <span className="text-sm font-medium text-slate-700">Total Payments</span>
                    </div>
                    <span className="text-xl font-bold text-purple-600">
                      {selectedOrder.paymentCount || 1}
                    </span>
                  </div>
                </div>

                {/* Countdown in Modal */}
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

                {/* Payment Info */}
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

                {/* Razorpay Details */}
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

                {/* Dates */}
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

                {/* Order Info */}
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
                  {selectedOrder.isFirstCabin && (
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-sm text-slate-600">Type</span>
                      <span className="text-sm font-medium text-indigo-600">⭐ First Cabin</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
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

                  {/* Renew Button - ALWAYS VISIBLE in Modal */}
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