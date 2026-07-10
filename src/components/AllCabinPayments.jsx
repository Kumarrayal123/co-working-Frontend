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
  Search,
  X,
  Download,
  TrendingUp,
  Wallet,
  RefreshCw,
  FileDown,
  Edit,
  Trash2,
  Printer
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AdminNavbar from "./AdminNavbar";
import * as XLSX from 'xlsx';
import "./Dashboard.css";

const API_URL = "http://localhost:5000";

const AllCabinPayments = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    expired: 0,
    totalAmount: 0,
    totalPayments: 0
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteOrder, setDeleteOrder] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editOrder, setEditOrder] = useState(null);
  const [editStatus, setEditStatus] = useState("");
  const [updating, setUpdating] = useState(false);

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
        setOrders(res.data.orders || []);
        setStats(res.data.stats || {
          total: 0,
          active: 0,
          expired: 0,
          totalAmount: 0,
          totalPayments: 0
        });
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
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      active: {
        label: 'Active',
        color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        icon: <CheckCircle size={12} className="text-emerald-500" />
      },
      expired: {
        label: 'Expired',
        color: 'bg-red-50 text-red-700 border-red-200',
        icon: <XCircle size={12} className="text-red-500" />
      },
      pending: {
        label: 'Pending',
        color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
        icon: <Clock size={12} className="text-yellow-500" />
      },
      cancelled: {
        label: 'Cancelled',
        color: 'bg-gray-50 text-gray-700 border-gray-200',
        icon: <XCircle size={12} className="text-gray-500" />
      }
    };
    return statusMap[status?.toLowerCase()] || {
      label: status || 'Unknown',
      color: 'bg-gray-50 text-gray-700 border-gray-200',
      icon: <AlertCircle size={12} className="text-gray-500" />
    };
  };

  const getPaymentStatusBadge = (status) => {
    if (status === 'completed') {
      return {
        label: 'Completed',
        color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        icon: <CheckCircle size={12} className="text-emerald-500" />
      };
    }
    return {
      label: status || 'Pending',
      color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      icon: <Clock size={12} className="text-yellow-500" />
    };
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

 // AllCabinPayments.jsx - Update delete function

// DELETE ORDER (No auth header)
const handleDeleteOrder = async () => {
  if (!deleteOrder) return;
  
  setDeleting(true);
  try {
    const res = await axios.delete(
      `${API_URL}/api/cabins/order/${deleteOrder._id}`
    );

    if (res.data.success) {
      const updatedOrders = orders.filter(o => o._id !== deleteOrder._id);
      setOrders(updatedOrders);
      
      const newStats = {
        total: updatedOrders.length,
        active: updatedOrders.filter(o => o.status === 'active').length,
        expired: updatedOrders.filter(o => o.status === 'expired').length,
        totalAmount: updatedOrders.reduce((sum, o) => sum + o.amount, 0),
        totalPayments: updatedOrders.reduce((sum, o) => sum + (o.paymentCount || 1), 0)
      };
      setStats(newStats);

      toast.success("Order deleted successfully");
      setShowDeleteModal(false);
      setDeleteOrder(null);
    }
  } catch (error) {
    console.error("Delete order error:", error);
    toast.error(error.response?.data?.error || "Failed to delete order");
  } finally {
    setDeleting(false);
  }
};

// UPDATE ORDER STATUS (No auth header)
const handleUpdateStatus = async () => {
  if (!editOrder || !editStatus) {
    toast.error("Please select a status");
    return;
  }
  
  setUpdating(true);
  try {
    const response = await axios.put(
      `${API_URL}/api/cabins/order-status/${editOrder._id}`,
      { status: editStatus }
    );

    if (response.data.success) {
      const updatedOrders = orders.map(o =>
        o._id === editOrder._id ? { ...o, status: editStatus } : o
      );
      setOrders(updatedOrders);
      
      const newStats = {
        total: updatedOrders.length,
        active: updatedOrders.filter(o => o.status === 'active').length,
        expired: updatedOrders.filter(o => o.status === 'expired').length,
        totalAmount: updatedOrders.reduce((sum, o) => sum + o.amount, 0),
        totalPayments: updatedOrders.reduce((sum, o) => sum + (o.paymentCount || 1), 0)
      };
      setStats(newStats);

      toast.success(`Status updated to ${editStatus}`);
      setShowEditModal(false);
      setEditOrder(null);
      setEditStatus("");
    } else {
      toast.error(response.data.message || "Failed to update status");
    }
  } catch (error) {
    console.error("Update status error:", error);
    toast.error(error.response?.data?.error || "Failed to update status");
  } finally {
    setUpdating(false);
  }
};

  // DOWNLOAD INVOICE
  const downloadInvoice = (order) => {
    try {
      const cabinName = order.cabin?.name || 'Cabin Deleted';
      const cabinAddress = order.cabin?.address || 'N/A';
      const amount = order.amount || 0;
      const orderId = order._id.slice(-8).toUpperCase();
      const startDate = order.startDate ? formatDate(order.startDate) : 'N/A';
      const expiryDate = order.expiryDate ? formatDate(order.expiryDate) : 'N/A';
      const status = order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'N/A';
      const paymentStatus = order.paymentStatus === 'completed' ? 'Paid ✅' : 'Pending ⏳';
      const ownerName = order.cabin?.owner?.name || order.owner?.name || 'N/A';
      const ownerMobile = order.cabin?.owner?.mobile || order.owner?.mobile || 'N/A';
      const transactionId = order.transactionId || 'N/A';
      const paymentCount = order.paymentCount || 1;

      const invoiceHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Invoice #${orderId}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: 'Segoe UI', Arial, sans-serif;
              background: #f0f2f5;
              padding: 40px;
              display: flex;
              justify-content: center;
              min-height: 100vh;
            }
            .invoice-container {
              max-width: 800px;
              width: 100%;
              background: white;
              border-radius: 16px;
              box-shadow: 0 10px 40px rgba(0,0,0,0.08);
              overflow: hidden;
            }
            .invoice-header {
              background: linear-gradient(135deg, #1e1b4b 0%, #4f46e5 100%);
              padding: 30px 40px;
              color: white;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .invoice-header h1 { font-size: 28px; font-weight: 700; }
            .invoice-header .sub { font-size: 14px; opacity: 0.8; }
            .invoice-header .order-id {
              background: rgba(255,255,255,0.2);
              padding: 8px 16px;
              border-radius: 8px;
              font-size: 14px;
              font-weight: 600;
            }
            .invoice-body { padding: 40px; }
            .invoice-row {
              display: flex;
              justify-content: space-between;
              padding: 12px 0;
              border-bottom: 1px solid #f1f5f9;
            }
            .invoice-row:last-child { border-bottom: none; }
            .invoice-label { color: #64748b; font-size: 14px; font-weight: 500; }
            .invoice-value { color: #0f172a; font-size: 14px; font-weight: 600; }
            .invoice-value.amount { font-size: 24px; color: #4f46e5; }
            .invoice-total {
              background: #f8fafc;
              border-radius: 12px;
              padding: 20px 24px;
              margin-top: 20px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .invoice-total .label { color: #475569; font-size: 16px; font-weight: 600; }
            .invoice-total .amount { font-size: 28px; font-weight: 700; color: #4f46e5; }
            .status-badge {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: 600;
            }
            .status-badge.active { background: #d1fae5; color: #065f46; }
            .status-badge.expired { background: #fee2e2; color: #991b1b; }
            .status-badge.pending { background: #fef3c7; color: #92400e; }
            .status-badge.cancelled { background: #fee2e2; color: #991b1b; }
            .status-badge.completed { background: #d1fae5; color: #065f46; }
            .footer {
              text-align: center;
              padding: 20px 40px;
              border-top: 1px solid #f1f5f9;
              color: #94a3b8;
              font-size: 12px;
            }
            .footer strong { color: #4f46e5; }
            .print-btn {
              position: fixed;
              bottom: 30px;
              right: 30px;
              padding: 12px 24px;
              background: #4f46e5;
              color: white;
              border: none;
              border-radius: 12px;
              font-weight: 600;
              cursor: pointer;
              box-shadow: 0 4px 14px rgba(79,70,229,0.4);
              display: flex;
              align-items: center;
              gap: 10px;
            }
            .print-btn:hover { background: #4338ca; }
            @media print {
              body { background: white; padding: 0; }
              .invoice-container { box-shadow: none; border-radius: 0; }
              .print-btn { display: none !important; }
              .invoice-header { background: #1e1b4b !important; -webkit-print-color-adjust: exact; }
              .status-badge { -webkit-print-color-adjust: exact; }
            }
            @media (max-width: 640px) {
              body { padding: 20px; }
              .invoice-header { flex-direction: column; text-align: center; gap: 15px; padding: 25px; }
              .invoice-body { padding: 25px; }
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <div class="invoice-header">
              <div>
                <h1>🧾 INVOICE</h1>
                <div class="sub">IRYAX Workspace • Cabin Registration</div>
              </div>
              <div class="order-id">#${orderId}</div>
            </div>
            <div class="invoice-body">
              <div class="invoice-row">
                <span class="invoice-label">Cabin</span>
                <span class="invoice-value">${cabinName}</span>
              </div>
              <div class="invoice-row">
                <span class="invoice-label">Address</span>
                <span class="invoice-value">${cabinAddress}</span>
              </div>
              <div class="invoice-row">
                <span class="invoice-label">Owner</span>
                <span class="invoice-value">${ownerName}</span>
              </div>
              <div class="invoice-row">
                <span class="invoice-label">Owner Mobile</span>
                <span class="invoice-value">${ownerMobile}</span>
              </div>
              <div class="invoice-row">
                <span class="invoice-label">Amount</span>
                <span class="invoice-value amount">${formatCurrency(amount)}</span>
              </div>
              <div class="invoice-row">
                <span class="invoice-label">Payment Status</span>
                <span class="invoice-value"><span class="status-badge ${order.paymentStatus}">${paymentStatus}</span></span>
              </div>
              <div class="invoice-row">
                <span class="invoice-label">Order Status</span>
                <span class="invoice-value"><span class="status-badge ${order.status}">${status}</span></span>
              </div>
              <div class="invoice-row">
                <span class="invoice-label">Start Date</span>
                <span class="invoice-value">${startDate}</span>
              </div>
              <div class="invoice-row">
                <span class="invoice-label">Expiry Date</span>
                <span class="invoice-value">${expiryDate}</span>
              </div>
              <div class="invoice-row">
                <span class="invoice-label">Payments Made</span>
                <span class="invoice-value">${paymentCount}</span>
              </div>
              <div class="invoice-row">
                <span class="invoice-label">Transaction ID</span>
                <span class="invoice-value" style="font-family:monospace;font-size:12px;">${transactionId}</span>
              </div>
              <div class="invoice-total">
                <span class="label">Total Amount</span>
                <span class="amount">${formatCurrency(amount)}</span>
              </div>
            </div>
            <div class="footer">
              Thank you for choosing <strong>IRYAX Workspace</strong> • System generated invoice
            </div>
          </div>
          <button class="print-btn" onclick="window.print()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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

  // Export to Excel
  const exportToExcel = () => {
    try {
      if (filteredOrders.length === 0) {
        toast.warning("No orders to export");
        return;
      }

      const exportData = filteredOrders.map((order, index) => ({
        'S.No': index + 1,
        'Cabin Name': order.cabin?.name || 'Cabin Deleted',
        'Cabin Address': order.cabin?.address || 'N/A',
        'Owner Name': order.cabin?.owner?.name || order.owner?.name || 'N/A',
        'Owner Mobile': order.cabin?.owner?.mobile || order.owner?.mobile || 'N/A',
        'Amount': order.amount || 0,
        'Payment Status': order.paymentStatus || 'pending',
        'Order Status': order.status || 'unknown',
        'Transaction ID': order.transactionId || 'N/A',
        'Payment Count': order.paymentCount || 1,
        'Start Date': order.startDate ? formatDate(order.startDate) : 'N/A',
        'Expiry Date': order.expiryDate ? formatDate(order.expiryDate) : 'N/A'
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      ws['!cols'] = [
        { wch: 6 }, { wch: 25 }, { wch: 30 }, { wch: 20 },
        { wch: 15 }, { wch: 12 }, { wch: 15 }, { wch: 15 },
        { wch: 20 }, { wch: 12 }, { wch: 15 }, { wch: 15 }
      ];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Cabin_Payments');
      
      const date = new Date().toISOString().split('T')[0];
      XLSX.writeFile(wb, `cabin_payments_${date}.xlsx`);
      
      toast.success(`Exported ${filteredOrders.length} orders to Excel!`);
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export");
    }
  };

  const filteredOrders = orders.filter((order) => {
    const cabinName = order.cabin?.name?.toLowerCase() || "";
    const ownerName = order.cabin?.owner?.name?.toLowerCase() || order.owner?.name?.toLowerCase() || "";
    const transactionId = order.transactionId?.toLowerCase() || "";
    
    const matchesSearch =
      cabinName.includes(searchTerm.toLowerCase()) ||
      ownerName.includes(searchTerm.toLowerCase()) ||
      transactionId.includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || order.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="admin-dash">
        <AdminNavbar />
        <div className="admin-dash__loading">
          <div className="admin-dash__spinner" />
          <p className="admin-dash__loading-text">Loading cabin payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dash">
      <AdminNavbar />

      <main className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16">
        {/* Header */}
        <div className="admin-dash__header">
          <div>
            <h1 className="admin-dash__greeting">
              Cabin <span>Payments</span>
            </h1>
            <p className="admin-dash__subtitle">
              Manage and track all cabin registration payments.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-grow sm:flex-grow-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search by cabin, owner, transaction..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all w-full sm:w-64"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all w-full sm:w-auto"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {filteredOrders.length > 0 && (
              <button
                onClick={exportToExcel}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors w-full sm:w-auto"
              >
                <Download size={16} />
                Export Excel
              </button>
            )}

            <button
              onClick={fetchPayments}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors w-full sm:w-auto"
            >
              <RefreshCw size={16} />
              Refresh
            </button>

            {(searchTerm || filterStatus !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterStatus("all");
                }}
                className="flex items-center justify-center gap-2 p-2.5 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 transition-colors w-full sm:w-auto"
                title="Clear Filters"
              >
                <X size={18} />
                <span className="sm:hidden text-sm font-medium">Clear Filters</span>
              </button>
            )}

            <div className="px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm flex sm:flex-col justify-between items-center sm:items-start gap-2 sm:gap-1">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider leading-none mb-0 sm:mb-1">Found</p>
              <p className="text-lg font-black text-slate-900 leading-none">
                {filteredOrders.length} <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest ml-1">Orders</span>
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-4 text-white shadow-lg shadow-indigo-500/25">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[8px] font-bold uppercase tracking-wider text-indigo-200">Total Orders</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div className="bg-white/20 p-2 rounded-xl">
                <CreditCard size={20} className="text-white" />
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-white/20 flex justify-between text-[10px]">
              <span className="text-indigo-200">Total Amount</span>
              <span className="font-semibold">{formatCurrency(stats.totalAmount)}</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm text-center">
            <p className="text-[8px] font-bold uppercase tracking-wider text-emerald-600">Active</p>
            <p className="text-2xl font-bold text-emerald-600">{stats.active}</p>
            <p className="text-[8px] text-slate-400 mt-1">Valid orders</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm text-center">
            <p className="text-[8px] font-bold uppercase tracking-wider text-red-600">Expired</p>
            <p className="text-2xl font-bold text-red-600">{stats.expired}</p>
            <p className="text-[8px] text-slate-400 mt-1">Need renewal</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm text-center">
            <p className="text-[8px] font-bold uppercase tracking-wider text-purple-600">Total Payments</p>
            <p className="text-2xl font-bold text-purple-600">{stats.totalPayments}</p>
            <p className="text-[8px] text-slate-400 mt-1">All transactions</p>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="admin-dash__error" style={{ background: '#f8fafc', borderColor: '#e2e8f0' }}>
            <CreditCard size={48} className="text-slate-300 mb-4" />
            <p className="admin-dash__error-title" style={{ color: '#475569' }}>No payments found</p>
            <p className="admin-dash__error-message">We couldn't find any cabin payments matching your search criteria.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Cabin</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Owner</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Payments</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Validity</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.map((order) => {
                    const statusBadge = getStatusBadge(order.status);
                    const paymentBadge = getPaymentStatusBadge(order.paymentStatus);
                    const cabinName = order.cabin?.name || 'Cabin Deleted';
                    const ownerName = order.cabin?.owner?.name || order.owner?.name || 'N/A';
                    const ownerMobile = order.cabin?.owner?.mobile || order.owner?.mobile || 'N/A';
                    
                    return (
                      <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-semibold text-slate-800 text-sm">
                              {cabinName}
                            </p>
                            {order.cabin?.address && (
                              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                                <MapPin size={12} className="text-indigo-400" />
                                {order.cabin.address}
                              </div>
                            )}
                            {!order.cabin && (
                              <p className="text-xs text-red-500 mt-0.5">⚠️ Cabin deleted</p>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-slate-700 text-sm">
                              {ownerName}
                            </p>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                              <Phone size={12} className="text-indigo-400" />
                              {ownerMobile}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-bold text-indigo-600 text-sm">
                            {formatCurrency(order.amount)}
                          </p>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            <CreditCard size={14} className="text-purple-400" />
                            <span className="font-semibold text-slate-700 text-sm">
                              {order.paymentCount || 1}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="space-y-1">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${statusBadge.color}`}>
                              {statusBadge.icon}
                              {statusBadge.label}
                            </span>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-medium border ${paymentBadge.color}`}>
                              {paymentBadge.icon}
                              {paymentBadge.label}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5 text-xs text-slate-600">
                              <Calendar size={12} className="text-indigo-400" />
                              <span>From: {formatDate(order.startDate)}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-600">
                              <Clock size={12} className="text-indigo-400" />
                              <span>To: {formatDate(order.expiryDate)}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center gap-1.5 flex-wrap">
                            <button
                              onClick={() => handleViewDetails(order)}
                              className="p-1.5 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                              title="View Details"
                            >
                              <Eye size={15} />
                            </button>
                            
                            <button
                              onClick={() => downloadInvoice(order)}
                              className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
                              title="Download Invoice"
                            >
                              <FileDown size={15} />
                            </button>
                            
                            <button
                              onClick={() => {
                                setEditOrder(order);
                                setEditStatus(order.status || 'active');
                                setShowEditModal(true);
                              }}
                              className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                              title="Edit Status"
                            >
                              <Edit size={15} />
                            </button>
                            
                            <button
                              onClick={() => {
                                setDeleteOrder(order);
                                setShowDeleteModal(true);
                              }}
                              className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                              title="Delete Order"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
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
                    Payment Details
                  </h3>
                  <p style={{ margin: 0, color: "rgba(255,255,255,0.8)", fontSize: "0.75rem" }}>
                    Order #{selectedOrder._id.slice(-6)}
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
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">🏢 Cabin</p>
                  <p className="font-semibold text-slate-800 mt-1">
                    {selectedOrder.cabin?.name || 'Cabin Deleted'}
                  </p>
                  {selectedOrder.cabin?.address && (
                    <p className="text-sm text-slate-600 flex items-center gap-1 mt-0.5">
                      <MapPin size={14} />
                      {selectedOrder.cabin.address}
                    </p>
                  )}
                  {!selectedOrder.cabin && (
                    <p className="text-sm text-red-500 mt-0.5">⚠️ This cabin has been deleted</p>
                  )}
                </div>

                {/* Owner Info */}
                <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                  <p className="text-xs font-medium text-indigo-600 uppercase tracking-wider">👤 Owner</p>
                  <p className="font-semibold text-slate-800 mt-1">
                    {selectedOrder.cabin?.owner?.name || selectedOrder.owner?.name || 'N/A'}
                  </p>
                  <p className="text-sm text-slate-600 flex items-center gap-1 mt-0.5">
                    <Phone size={14} className="text-indigo-500" />
                    {selectedOrder.cabin?.owner?.mobile || selectedOrder.owner?.mobile || 'N/A'}
                  </p>
                </div>

                {/* Payment Info */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200 text-center">
                    <p className="text-[8px] font-bold text-emerald-600 uppercase tracking-wider">Amount</p>
                    <p className="text-2xl font-bold text-emerald-600">
                      {formatCurrency(selectedOrder.amount)}
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4 border border-purple-200 text-center">
                    <p className="text-[8px] font-bold text-purple-600 uppercase tracking-wider">Payments</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {selectedOrder.paymentCount || 1}
                    </p>
                  </div>
                </div>

                {/* Status */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Order Status</p>
                    <div className="mt-1">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadge(selectedOrder.status).color}`}>
                        {getStatusBadge(selectedOrder.status).icon}
                        {getStatusBadge(selectedOrder.status).label}
                      </span>
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Payment Status</p>
                    <div className="mt-1">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${getPaymentStatusBadge(selectedOrder.paymentStatus).color}`}>
                        {getPaymentStatusBadge(selectedOrder.paymentStatus).icon}
                        {getPaymentStatusBadge(selectedOrder.paymentStatus).label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <Calendar size={12} />
                      Start Date
                    </p>
                    <p className="font-semibold text-slate-800 mt-1">
                      {formatDate(selectedOrder.startDate)}
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <Clock size={12} />
                      Expiry Date
                    </p>
                    <p className="font-semibold text-slate-800 mt-1">
                      {formatDate(selectedOrder.expiryDate)}
                    </p>
                  </div>
                </div>

                {/* Transaction ID */}
                {selectedOrder.transactionId && (
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Transaction ID</p>
                    <p className="font-mono text-sm text-slate-700 mt-1">{selectedOrder.transactionId}</p>
                  </div>
                )}

                {/* Razorpay IDs */}
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Razorpay Details</p>
                  <div className="mt-1 space-y-1">
                    <p className="text-xs text-slate-600">
                      <span className="font-medium">Order ID:</span> {selectedOrder.razorpayOrderId || 'N/A'}
                    </p>
                    <p className="text-xs text-slate-600">
                      <span className="font-medium">Payment ID:</span> {selectedOrder.razorpayPaymentId || 'N/A'}
                    </p>
                  </div>
                </div>

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
      )}

      {/* Edit Status Modal */}
      {showEditModal && editOrder && (
        <div className="fixed inset-0 z-[1300] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowEditModal(false);
            setEditOrder(null);
            setEditStatus("");
          }
        }}>
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div style={{
              background: "linear-gradient(135deg, #f59e0b 0%, #d97706 60%, #b45309 100%)",
              padding: "1.25rem 1.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}>
              <div className="flex items-center gap-3">
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: "rgba(255,255,255,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <Edit size={20} color="#fff" />
                </div>
                <div>
                  <h3 style={{ margin: 0, color: "#fff", fontSize: "1rem", fontWeight: 700 }}>
                    Update Order Status
                  </h3>
                  <p style={{ margin: 0, color: "rgba(255,255,255,0.8)", fontSize: "0.75rem" }}>
                    {editOrder.cabin?.name || 'Cabin'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditOrder(null);
                  setEditStatus("");
                }}
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
              <div style={{
                background: "#f8fafc",
                borderRadius: 10,
                padding: "0.75rem 1rem",
                marginBottom: "1.25rem"
              }}>
                <div className="flex justify-between items-center">
                  <span style={{ color: "#64748b", fontSize: "0.875rem" }}>Current Status</span>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusBadge(editOrder.status).color}`}>
                    {getStatusBadge(editOrder.status).icon}
                    {getStatusBadge(editOrder.status).label}
                  </span>
                </div>
              </div>

              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{
                  display: "block",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: "0.5rem"
                }}>
                  Select New Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['active', 'expired', 'pending', 'cancelled'].map((status) => {
                    const badge = getStatusBadge(status);
                    const isSelected = editStatus === status;
                    return (
                      <button
                        key={status}
                        onClick={() => setEditStatus(status)}
                        style={{
                          padding: "0.6rem",
                          borderRadius: 10,
                          border: isSelected ? `2px solid #6366f1` : "1.5px solid #e2e8f0",
                          background: isSelected ? "rgba(99,102,241,0.06)" : "#fff",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.5rem",
                          transition: "all 160ms",
                          fontWeight: isSelected ? 700 : 500,
                          color: isSelected ? "#4f46e5" : "#64748b"
                        }}
                      >
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${badge.color}`}>
                          {badge.icon}
                          {badge.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={handleUpdateStatus}
                  disabled={updating || !editStatus}
                  style={{
                    width: "100%",
                    padding: "0.875rem",
                    borderRadius: 10,
                    border: "none",
                    background: (updating || !editStatus)
                      ? "#fcd34d"
                      : "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                    color: "#fff",
                    fontFamily: "inherit",
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    cursor: (updating || !editStatus) ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    boxShadow: (updating || !editStatus) ? "none" : "0 4px 14px rgba(245, 158, 11, 0.35)",
                    transition: "all 160ms",
                  }}
                >
                  {updating ? (
                    <>
                      <span style={{
                        width: 16, height: 16, borderRadius: "50%",
                        border: "2px solid rgba(255,255,255,0.4)",
                        borderTopColor: "#fff",
                        animation: "spin 0.7s linear infinite",
                        display: "inline-block",
                      }} />
                      Updating...
                    </>
                  ) : (
                    <>Update Status</>
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditOrder(null);
                    setEditStatus("");
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deleteOrder && (
        <div className="fixed inset-0 z-[1300] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowDeleteModal(false);
            setDeleteOrder(null);
          }
        }}>
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div style={{
              background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 60%, #991b1b 100%)",
              padding: "1.25rem 1.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}>
              <div className="flex items-center gap-3">
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: "rgba(255,255,255,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <Trash2 size={20} color="#fff" />
                </div>
                <div>
                  <h3 style={{ margin: 0, color: "#fff", fontSize: "1rem", fontWeight: 700 }}>
                    Delete Order
                  </h3>
                  <p style={{ margin: 0, color: "rgba(255,255,255,0.8)", fontSize: "0.75rem" }}>
                    {deleteOrder.cabin?.name || 'Order'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteOrder(null);
                }}
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
              <div style={{
                background: "#fef2f2",
                borderRadius: 12,
                padding: "1rem",
                marginBottom: "1.25rem",
                border: "1px solid #fecaca"
              }}>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span style={{ color: "#64748b", fontSize: "0.875rem" }}>Order</span>
                    <span style={{ fontWeight: 600, color: "#1e293b" }}>
                      #{deleteOrder._id.slice(-6)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: "#64748b", fontSize: "0.875rem" }}>Cabin</span>
                    <span style={{ fontWeight: 600, color: "#1e293b" }}>
                      {deleteOrder.cabin?.name || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: "#64748b", fontSize: "0.875rem" }}>Amount</span>
                    <span style={{ fontWeight: 600, color: "#1e293b" }}>
                      {formatCurrency(deleteOrder.amount)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-red-200">
                    <span style={{ color: "#991b1b", fontSize: "0.75rem" }}>⚠️ This action cannot be undone</span>
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
                <span>Deleting this order will permanently remove all associated data.</span>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={handleDeleteOrder}
                  disabled={deleting}
                  style={{
                    width: "100%",
                    padding: "0.875rem",
                    borderRadius: 10,
                    border: "none",
                    background: deleting
                      ? "#fca5a5"
                      : "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
                    color: "#fff",
                    fontFamily: "inherit",
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    cursor: deleting ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    boxShadow: deleting ? "none" : "0 4px 14px rgba(220,38,38,0.35)",
                    transition: "all 160ms",
                  }}
                >
                  {deleting ? (
                    <>
                      <span style={{
                        width: 16, height: 16, borderRadius: "50%",
                        border: "2px solid rgba(255,255,255,0.4)",
                        borderTopColor: "#fff",
                        animation: "spin 0.7s linear infinite",
                        display: "inline-block",
                      }} />
                      Deleting...
                    </>
                  ) : (
                    <>Confirm Delete</>
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteOrder(null);
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

export default AllCabinPayments;