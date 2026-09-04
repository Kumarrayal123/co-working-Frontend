// AllCabinPayments.jsx - Complete with All Filters in Single Row
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
  CalendarDays,
  Search
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AdminNavbar from "./AdminNavbar";
import * as XLSX from 'xlsx';
import "./Dashboard.css";

const API_URL = "https://spaceapi.iryax.com";

const AllCabinPayments = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCabinName, setFilterCabinName] = useState("");
  const [filterOwnerName, setFilterOwnerName] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  
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

  // ✅ Format date to dd/mm/yyyy
  const formatDateDDMMYYYY = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "N/A";
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // ✅ Format datetime to dd/mm/yyyy HH:MM AM/PM
  const formatDateTimeDDMMYYYY = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "N/A";
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
  };

  // Alias for backward compatibility
  const formatDate = formatDateDDMMYYYY;
  const formatDateTime = formatDateTimeDDMMYYYY;

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`;
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

  const getPaymentStatusBadge = (status) => {
    if (status === 'completed') {
      return {
        label: 'Completed',
        color: 'bg-emerald-100 text-emerald-700',
        icon: <CheckCircle size={12} className="text-emerald-500" />
      };
    }
    return {
      label: status || 'Pending',
      color: 'bg-yellow-100 text-yellow-700',
      icon: <Clock size={12} className="text-yellow-500" />
    };
  };

  const clearFilters = () => {
    setFilterStatus("all");
    setFilterCabinName("");
    setFilterOwnerName("");
    setFilterDateFrom("");
    setFilterDateTo("");
  };

  const filteredOrders = orders.filter((order) => {
    const cabinName = order.cabin?.name?.toLowerCase() || "";
    const ownerName = order.cabin?.owner?.name?.toLowerCase() || order.owner?.name?.toLowerCase() || "";
    const transactionId = order.transactionId?.toLowerCase() || "";
    
    const matchesStatus = filterStatus === "all" || order.status === filterStatus;
    const matchesCabinName = filterCabinName === "" || cabinName.includes(filterCabinName.toLowerCase());
    const matchesOwnerName = filterOwnerName === "" || ownerName.includes(filterOwnerName.toLowerCase());
    
    let matchesDateRange = true;
    const orderDate = order.createdAt ? order.createdAt.split('T')[0] : null;
    
    if (filterDateFrom && orderDate) {
      matchesDateRange = matchesDateRange && orderDate >= filterDateFrom;
    }
    if (filterDateTo && orderDate) {
      matchesDateRange = matchesDateRange && orderDate <= filterDateTo;
    }
    
    return matchesStatus && matchesCabinName && matchesOwnerName && matchesDateRange;
  });

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

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
        'Base Amount': order.baseAmount || order.amount || 0,
        'GST Amount': order.gstAmount || 0,
        'Total Amount': order.amount || 0,
        'Payment Status': order.paymentStatus || 'pending',
        'Order Status': order.status || 'unknown',
        'Transaction ID': order.transactionId || 'N/A',
        'Payment Count': order.paymentCount || 1,
        'Start Date': order.startDate ? formatDateDDMMYYYY(order.startDate) : 'N/A',
        'Expiry Date': order.expiryDate ? formatDateDDMMYYYY(order.expiryDate) : 'N/A',
        'Order Date': order.createdAt ? formatDateDDMMYYYY(order.createdAt) : 'N/A',
        'First Cabin': order.isFirstCabin ? 'Yes' : 'No'
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      ws['!cols'] = [
        { wch: 6 }, { wch: 25 }, { wch: 30 }, { wch: 20 },
        { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 },
        { wch: 15 }, { wch: 15 }, { wch: 20 }, { wch: 12 },
        { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 10 }
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

  const downloadInvoice = (order) => {
    try {
      const cabin = order.cabin || {};
      const owner = cabin.owner || {};
      const cabinName = cabin.name || 'Cabin Deleted';
      const cabinAddress = cabin.address || 'N/A';
      const ownerOrganization = owner.organizationName || 'IRYAX Workspace';
      const ownerGst = owner.gstNumber || 'N/A';
      const ownerAddress = owner.address || 'N/A';
      
      const amount = order.amount || 0;
      const baseAmount = order.baseAmount || amount;
      const gstAmount = order.gstAmount || 0;
      const gstRate = order.gstRate || 0.18;
      const orderId = order._id.slice(-8).toUpperCase();
      const startDate = order.startDate ? formatDateDDMMYYYY(order.startDate) : 'N/A';
      const expiryDate = order.expiryDate ? formatDateDDMMYYYY(order.expiryDate) : 'N/A';
      const status = order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'N/A';
      const paymentStatus = order.paymentStatus === 'completed' ? 'Paid' : 'Pending';
      const transactionId = order.transactionId || 'N/A';
      const paymentCount = order.paymentCount || 1;
      const today = formatDateDDMMYYYY(new Date());
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
                <div class="brand"><h1>${ownerOrganization.toUpperCase()}</h1><div class="gst">GST: ${ownerGst}</div><div class="address-line">${ownerAddress}</div></div>
                <div class="invoice-number"><div class="label">Invoice</div><div class="number">#${orderId}</div><div class="date">${today}</div></div>
              </div>
              <div class="info-grid">
                <div><div class="title">Bill To</div><div class="value">${owner.name || 'Owner'}</div><div class="value-small">${owner.mobile || 'N/A'}</div><div class="value-small">${owner.email || 'N/A'}</div></div>
                <div><div class="title">Cabin Details</div><div class="value">${cabinName}</div><div class="address-line">${cabinAddress}</div><div class="value-small" style="margin-top:4px;">${isFirstCabin ? '⭐ First Cabin' : 'Cabin Registration'}</div></div>
              </div>
              <table class="invoice-table"><thead><tr><th>Description</th><th>Details</th><th>Amount</th></tr></thead>
                <tbody><tr><td><strong>Cabin Registration</strong></td><td>${cabinName}<br>${isFirstCabin ? '<span style="font-size:11px;color:#4f46e5;font-weight:600;">⭐ First Cabin Registration</span>' : '<span style="font-size:11px;color:#666666;">Cabin Registration Fee</span>'}${paymentCount > 1 ? `<br><span style="font-size:11px;color:#059669;font-weight:600;">🔄 Renewal #${paymentCount}</span>` : ''}${transactionId !== 'N/A' ? `<br><span style="font-size:10px;color:#888888;font-family:monospace;">TXN: ${transactionId}</span>` : ''}</td><td>₹${baseAmount.toFixed(2)}</td></tr></tbody></table>
              <div class="status-row"><div class="item"><div class="label">Payment Status</div><div class="value">${paymentStatus}</div></div><div class="item"><div class="label">Order Status</div><div class="value">${status}</div></div><div class="item"><div class="label">Payments Made</div><div class="value">${paymentCount}</div></div>${transactionId !== 'N/A' ? `<div class="item"><div class="label">Transaction ID</div><div class="value" style="font-family:monospace;font-size:11px;">${transactionId}</div></div>` : ''}</div>
              <div class="totals"><div class="totals-box"><div class="totals-row"><span>Subtotal</span><span>₹${baseAmount.toFixed(2)}</span></div><div class="totals-row"><span>GST (${(gstRate * 100).toFixed(0)}%)</span><span>₹${gstAmount.toFixed(2)}</span></div><div class="totals-row total"><span>Total Amount</span><span>₹${amount.toFixed(2)}</span></div></div></div>
              <div class="footer"><div class="powered">POWERED BY <span>IRYAX SPACE</span></div><div class="sub">Thank you for choosing ${ownerOrganization}</div><div class="sub" style="margin-top:2px;">This is a system generated invoice</div></div>
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

  if (loading) {
    return (
      <div className="admin-dash" style={{ backgroundColor: '#f8fafc' }}>
        <AdminNavbar />
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dash" style={{ backgroundColor: '#f8fafc' }}>
      <AdminNavbar />

      <div className="pt-24 px-3 sm:px-4 md:px-6 lg:px-8 max-w-full mx-auto pb-16">
        {/* Header */}
        <div className="admin-dash__header">
          <div>
            <h1 className="admin-dash__greeting">
              Cabin <span>Billings</span>
            </h1>
            <p className="admin-dash__subtitle">Manage and monitor all cabin payment transactions</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchPayments}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-indigo-700 rounded-lg text-xs font-medium hover:bg-indigo-50 transition-all duration-200 border border-gray-200 shadow-sm hover:shadow-md"
              title="Refresh"
            >
              <RefreshCw size={14} />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="admin-dash__stats" style={{ marginBottom: '20px' }}>
          {[
            {
              label: "Total Orders",
              value: stats.total,
              meta: "all transactions",
              icon: CreditCard,
              color: "indigo"
            },
            {
              label: "Total Amount",
              value: formatCurrency(stats.totalAmount),
              meta: "from cabin orders",
              icon: IndianRupee,
              color: "amber"
            },
            {
              label: "Active",
              value: stats.active,
              meta: "active subscriptions",
              icon: CheckCircle,
              color: "emerald"
            },
            {
              label: "Expired",
              value: stats.expired,
              meta: "expired subscriptions",
              icon: XCircle,
              color: "rose"
            },
            {
              label: "Payments",
              value: stats.totalPayments,
              meta: "total payment entries",
              icon: Wallet,
              color: "cyan"
            }
          ].map((stat, index) => (
            <div
              key={index}
              className="admin-dash__stat"
              style={{ 
                padding: '16px',
                minHeight: '95px',
                transition: 'all 0.3s ease'
              }}
            >
              <div className="admin-dash__stat-top">
                <span className="admin-dash__stat-label" style={{ fontSize: '12px', fontWeight: '600' }}>{stat.label}</span>
                <div className={`admin-dash__stat-icon admin-dash__stat-icon--${stat.color}`} style={{ width: '32px', height: '32px' }}>
                  <stat.icon size={16} />
                </div>
              </div>
              <div className="admin-dash__stat-value" style={{ fontSize: '24px', fontWeight: '700', letterSpacing: '-0.02em' }}>{stat.value}</div>
              <div className="admin-dash__stat-meta" style={{ fontSize: '11px', fontWeight: '500' }}>{stat.meta}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search cabin..."
                value={filterCabinName}
                onChange={(e) => setFilterCabinName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Owner name..."
                  value={filterOwnerName}
                  onChange={(e) => setFilterOwnerName(e.target.value)}
                  className="pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 w-40 transition-all duration-200"
                />
              </div>
              <div className="relative">
                <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  value={filterDateFrom}
                  onChange={(e) => setFilterDateFrom(e.target.value)}
                  className="pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white transition-all duration-200"
                />
              </div>
              <div className="relative">
                <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  value={filterDateTo}
                  onChange={(e) => setFilterDateTo(e.target.value)}
                  className="pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white transition-all duration-200"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white transition-all duration-200 cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
              {(filterStatus !== "all" || filterCabinName || filterOwnerName || filterDateFrom || filterDateTo) && (
                <button
                  onClick={clearFilters}
                  className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
                  title="Clear filters"
                >
                  <XCircleIcon size={18} />
                </button>
              )}
              {filteredOrders.length > 0 && (
                <button
                  onClick={exportToExcel}
                  className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md"
                  title="Export to Excel"
                >
                  <Download size={16} />
                  Export
                </button>
              )}
            </div>
          </div>
          <div className="mt-3 text-xs text-gray-500 font-medium">
            Showing <span className="text-indigo-600 font-bold">{filteredOrders.length}</span> of <span className="text-gray-700 font-bold">{orders.length}</span> payments
          </div>
        </div>

        {/* Table Section */}
        <div className="admin-dash__card" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div className="admin-dash__card-body p-0 overflow-x-auto" style={{ backgroundColor: '#ffffff' }}>
            {filteredOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4 py-24 text-gray-400">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                  <CreditCard size={40} className="text-gray-400" />
                </div>
                <p className="text-lg font-semibold text-gray-600">No payments found</p>
                <p className="text-sm text-gray-500">Try adjusting your filters.</p>
              </div>
            ) : (
              <table className="w-full min-w-[1300px] text-left">
                <thead>
                  <tr className="border-b border-gray-200" style={{ backgroundColor: '#f8fafc' }}>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-600 uppercase whitespace-nowrap">S.No</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-600 uppercase whitespace-nowrap">Cabin</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-600 uppercase whitespace-nowrap">Owner</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-600 uppercase whitespace-nowrap">Amount</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-600 uppercase whitespace-nowrap">GST</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-600 uppercase whitespace-nowrap">Payments</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-600 uppercase whitespace-nowrap">Status</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-600 uppercase whitespace-nowrap">Order Date</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-600 uppercase whitespace-nowrap">Expiry</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-600 uppercase whitespace-nowrap text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredOrders.map((order, idx) => {
                    const statusBadge = getStatusBadge(order.status);
                    const paymentBadge = getPaymentStatusBadge(order.paymentStatus);
                    const cabinName = order.cabin?.name || 'Cabin Deleted';
                    const ownerName = order.cabin?.owner?.name || order.owner?.name || 'N/A';
                    const ownerMobile = order.cabin?.owner?.mobile || order.owner?.mobile || 'N/A';
                    const gstAmount = order.gstAmount || 0;
                    const isFirstCabin = order.isFirstCabin || false;
                    
                    return (
                      <tr key={order._id} className="transition-all duration-200 group hover:bg-indigo-50/50 hover:shadow-sm">
                        <td className="p-4">
                          <span className="text-sm font-bold text-gray-400 group-hover:text-indigo-600 transition-colors">{idx + 1}</span>
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="font-bold text-gray-900 text-sm flex items-center gap-1">
                              {cabinName}
                              {isFirstCabin && (
                                <span className="text-[10px] text-indigo-600 font-bold">⭐</span>
                              )}
                            </p>
                            {order.cabin?.address && (
                              <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                <MapPin size={12} className="text-gray-400" />
                                {order.cabin.address.split(',')[0]}
                              </p>
                            )}
                            {!order.cabin && (
                              <p className="text-xs text-red-500 font-medium">⚠️ Deleted</p>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="font-semibold text-gray-800 text-sm">{ownerName}</p>
                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                              <Phone size={12} className="text-gray-400" />
                              {ownerMobile}
                            </p>
                          </div>
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="text-sm font-bold text-indigo-600">{formatCurrency(order.amount)}</p>
                            {order.baseAmount && order.baseAmount !== order.amount && (
                              <p className="text-[10px] text-gray-400">Base: ₹{order.baseAmount}</p>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          {gstAmount > 0 ? (
                            <div>
                              <p className="text-sm font-bold text-emerald-600">₹{gstAmount.toFixed(2)}</p>
                              <p className="text-[10px] text-gray-400">@ {(order.gstRate * 100).toFixed(0)}%</p>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">N/A</span>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1">
                            <History size={14} className="text-purple-400" />
                            <span className="text-sm font-semibold text-gray-700">{order.paymentCount || 1}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col gap-1">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-full shadow-sm ${statusBadge.color}`}>
                              {statusBadge.icon} {statusBadge.label}
                            </span>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full shadow-sm ${paymentBadge.color}`}>
                              {paymentBadge.icon} {paymentBadge.label}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm text-gray-600 font-medium">
                            {formatDateDDMMYYYY(order.createdAt)}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm text-gray-600 font-medium">
                            {formatDateDDMMYYYY(order.expiryDate)}
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-2 flex-wrap">
                            <button
                              onClick={() => handleViewDetails(order)}
                              className="p-2.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-all duration-200 shadow-sm hover:shadow-md"
                              title="View Details"
                            >
                              <Eye size={15} />
                            </button>
                            <button
                              onClick={() => downloadInvoice(order)}
                              className="p-2.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-all duration-200 shadow-sm hover:shadow-md"
                              title="Download Invoice"
                            >
                              <FileDown size={15} />
                            </button>
                            <button
                              onClick={() => { setEditOrder(order); setEditStatus(order.status || 'active'); setShowEditModal(true); }}
                              className="p-2.5 rounded-lg bg-orange-50 text-orange-700 hover:bg-orange-100 transition-all duration-200 shadow-sm hover:shadow-md"
                              title="Update Status"
                            >
                              <Edit size={15} />
                            </button>
                            <button
                              onClick={() => { setDeleteOrder(order); setShowDeleteModal(true); }}
                              className="p-2.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-all duration-200 shadow-sm hover:shadow-md"
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
            )}
          </div>

          {/* Footer with stats */}
          {!loading && filteredOrders.length > 0 && (
            <div className="px-5 py-4 border-t border-gray-200 rounded-b-2xl flex flex-wrap items-center justify-between gap-3" style={{ backgroundColor: '#f8fafc' }}>
              <span className="text-sm text-gray-600 font-medium">
                Showing <strong className="text-indigo-600">{filteredOrders.length}</strong> of <strong className="text-gray-800">{orders.length}</strong> payments
              </span>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm"></span>
                  <span className="font-medium">Active: {stats.active}</span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm"></span>
                  <span className="font-medium">Expired: {stats.expired}</span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-sm"></span>
                  <span className="font-medium">Total: {stats.total}</span>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ====================== */}
      {/* ORDER DETAIL MODAL */}
      {/* ====================== */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={(e) => { if (e.target === e.currentTarget) setShowDetailModal(false); }}>
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 text-white p-6 rounded-t-3xl flex justify-between items-center shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shadow-inner backdrop-blur-sm">
                  <Receipt size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold tracking-tight">Payment Details</h3>
                  <p className="text-sm text-indigo-200">#{selectedOrder._id.slice(-6).toUpperCase()}</p>
                </div>
              </div>
              <button onClick={() => setShowDetailModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 hover:scale-110">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-4 custom-scrollbar">
              {/* Order Date */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <Calendar size={12} className="text-indigo-500" /> Order Date
                </p>
                <p className="font-semibold text-gray-800">{formatDateTimeDDMMYYYY(selectedOrder.createdAt)}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <Building2 size={12} className="text-indigo-500" /> Cabin
                  </p>
                  <p className="font-semibold text-gray-800">{selectedOrder.cabin?.name || 'Cabin Deleted'}</p>
                  {selectedOrder.cabin?.address && (
                    <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                      <MapPin size={14} /> {selectedOrder.cabin.address}
                    </p>
                  )}
                  {selectedOrder.isFirstCabin && (
                    <p className="text-xs text-indigo-600 font-bold mt-1">⭐ First Cabin</p>
                  )}
                </div>
                <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <User size={12} className="text-indigo-500" /> Owner
                  </p>
                  <p className="font-semibold text-gray-800">{selectedOrder.cabin?.owner?.name || selectedOrder.owner?.name || 'N/A'}</p>
                  <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                    <Phone size={14} /> {selectedOrder.cabin?.owner?.mobile || selectedOrder.owner?.mobile || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-4 border border-indigo-200 shadow-sm">
                <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                  <IndianRupee size={12} /> Amount Breakdown
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Base Amount</span>
                    <span className="font-semibold">₹{selectedOrder.baseAmount?.toFixed(2) || selectedOrder.amount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">GST ({(selectedOrder.gstRate * 100).toFixed(0)}%)</span>
                    <span className="font-semibold">₹{selectedOrder.gstAmount?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="border-t border-indigo-300 pt-2 flex justify-between text-sm font-bold">
                    <span>Total</span>
                    <span className="text-indigo-600">₹{selectedOrder.amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 text-center shadow-sm hover:shadow-md transition-shadow">
                  <p className="text-[10px] font-bold text-purple-600 uppercase">Payments</p>
                  <p className="text-2xl font-bold text-purple-600">{selectedOrder.paymentCount || 1}</p>
                </div>
                <div className={`p-4 rounded-xl border text-center shadow-sm hover:shadow-md transition-shadow ${selectedOrder.isFirstCabin ? 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200' : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200'}`}>
                  <p className={`text-[10px] font-bold uppercase ${selectedOrder.isFirstCabin ? 'text-amber-600' : 'text-gray-500'}`}>Type</p>
                  <p className={`text-lg font-bold ${selectedOrder.isFirstCabin ? 'text-amber-700' : 'text-gray-700'}`}>
                    {selectedOrder.isFirstCabin ? '⭐ First' : 'Standard'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Order Status</p>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-full mt-2 shadow-sm ${getStatusBadge(selectedOrder.status).color}`}>
                    {getStatusBadge(selectedOrder.status).icon} {getStatusBadge(selectedOrder.status).label}
                  </span>
                </div>
                <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Payment Status</p>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-full mt-2 shadow-sm ${getPaymentStatusBadge(selectedOrder.paymentStatus).color}`}>
                    {getPaymentStatusBadge(selectedOrder.paymentStatus).icon} {getPaymentStatusBadge(selectedOrder.paymentStatus).label}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <Calendar size={12} className="text-indigo-500" /> Start Date
                  </p>
                  <p className="font-medium text-gray-800 text-sm">{formatDateDDMMYYYY(selectedOrder.startDate)}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <Calendar size={12} className="text-indigo-500" /> Expiry Date
                  </p>
                  <p className="font-medium text-gray-800 text-sm">{formatDateDDMMYYYY(selectedOrder.expiryDate)}</p>
                </div>
              </div>

              {selectedOrder.transactionId && (
                <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <Hash size={12} className="text-indigo-500" /> Transaction ID
                  </p>
                  <p className="font-mono text-xs text-gray-700 break-all">{selectedOrder.transactionId}</p>
                </div>
              )}

              <div className="flex flex-col gap-3 pt-2">
                <button onClick={() => { setShowDetailModal(false); downloadInvoice(selectedOrder); }} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2">
                  <FileDown size={16} /> Download Invoice
                </button>
                <button onClick={() => setShowDetailModal(false)} className="w-full py-3 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-all duration-200">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================== */}
      {/* EDIT STATUS MODAL */}
      {/* ====================== */}
      {showEditModal && editOrder && (
        <div className="fixed inset-0 z-[1300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={(e) => { if (e.target === e.currentTarget) { setShowEditModal(false); setEditOrder(null); setEditStatus(""); } }}>
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-5 text-white rounded-t-3xl flex justify-between items-center shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shadow-inner backdrop-blur-sm"><Edit size={24} className="text-white" /></div>
                <div><h3 className="text-xl font-bold tracking-tight">Update Status</h3><p className="text-sm text-amber-100">{editOrder.cabin?.name}</p></div>
              </div>
              <button onClick={() => { setShowEditModal(false); setEditOrder(null); setEditStatus(""); }} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 hover:scale-110"><X size={20} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 flex justify-between items-center border border-gray-200">
                <span className="text-sm text-gray-600 font-medium">Current Status</span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full shadow-sm ${getStatusBadge(editOrder.status).color}`}>
                  {getStatusBadge(editOrder.status).icon} {getStatusBadge(editOrder.status).label}
                </span>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Select New Status</label>
                <div className="grid grid-cols-2 gap-2">
                  {['active', 'expired', 'pending', 'cancelled'].map((status) => {
                    const badge = getStatusBadge(status);
                    const isSelected = editStatus === status;
                    return (
                      <button key={status} onClick={() => setEditStatus(status)} className={`py-2.5 rounded-xl text-xs font-bold border transition-all duration-200 ${isSelected ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm' : 'border-gray-200 hover:bg-gray-50 text-gray-700'}`}>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>{badge.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={handleUpdateStatus} disabled={updating || !editStatus} className={`flex-1 py-3 rounded-xl text-white font-bold transition-all duration-200 ${(updating || !editStatus) ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:shadow-lg'}`}>
                  {updating ? 'Updating...' : 'Update Status'}
                </button>
                <button onClick={() => { setShowEditModal(false); setEditOrder(null); setEditStatus(""); }} className="px-5 py-3 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-all duration-200">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================== */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ====================== */}
      {showDeleteModal && deleteOrder && (
        <div className="fixed inset-0 z-[1300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={(e) => { if (e.target === e.currentTarget) { setShowDeleteModal(false); setDeleteOrder(null); } }}>
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-br from-red-500 to-red-600 p-5 text-white rounded-t-3xl flex justify-between items-center shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shadow-inner backdrop-blur-sm"><Trash2 size={24} className="text-white" /></div>
                <div><h3 className="text-xl font-bold tracking-tight">Delete Order</h3><p className="text-sm text-red-200">{deleteOrder.cabin?.name}</p></div>
              </div>
              <button onClick={() => { setShowDeleteModal(false); setDeleteOrder(null); }} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 hover:scale-110"><X size={20} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 space-y-2 text-sm border border-red-200">
                <p className="font-bold text-red-800">Are you sure you want to delete this order?</p>
                <div className="space-y-1 text-gray-600">
                  <p><span className="text-gray-500">Order:</span> #{deleteOrder._id.slice(-6)}</p>
                  <p><span className="text-gray-500">Cabin:</span> {deleteOrder.cabin?.name || 'N/A'}</p>
                  <p><span className="text-gray-500">Amount:</span> {formatCurrency(deleteOrder.amount)}</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-3 text-xs text-amber-700 flex items-start gap-2 border border-amber-200">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span className="font-medium">This action cannot be undone. All associated data will be permanently removed.</span>
              </div>
              <div className="flex gap-3">
                <button onClick={handleDeleteOrder} disabled={deleting} className={`flex-1 py-3 rounded-xl text-white font-bold transition-all duration-200 ${deleting ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-red-500 to-red-600 hover:shadow-lg'}`}>
                  {deleting ? 'Deleting...' : 'Confirm Delete'}
                </button>
                <button onClick={() => { setShowDeleteModal(false); setDeleteOrder(null); }} className="px-5 py-3 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-all duration-200">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllCabinPayments;