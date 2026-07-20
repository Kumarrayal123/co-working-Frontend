// AllWithdrawals.jsx - Complete with Organization & GST (Redesigned)
import axios from "axios";
import {
  Wallet,
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
  RefreshCw,
  FileDown,
  Edit,
  Trash2,
  Printer,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Banknote,
  Loader,
  Mail,
  Building,
  Receipt,
  Filter,
  XCircle as XCircleIcon,
  Crown
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AdminNavbar from "./AdminNavbar";
import * as XLSX from 'xlsx';
import "./Dashboard.css";

const API_URL = "http://62.72.29.27:5003";

const AllWithdrawals = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterOwner, setFilterOwner] = useState("");
  const [filterBank, setFilterBank] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    failed: 0,
    rejected: 0,
    totalAmount: 0,
    uniqueUsers: 0
  });
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteWithdrawal, setDeleteWithdrawal] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editWithdrawal, setEditWithdrawal] = useState(null);
  const [editStatus, setEditStatus] = useState("");
  const [updating, setUpdating] = useState(false);

  const fetchWithdrawals = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/bookings/all-withdrawals`);

      if (res.data.success) {
        setWithdrawals(res.data.withdrawals || []);
        setStats(res.data.stats || {
          total: 0,
          pending: 0,
          completed: 0,
          failed: 0,
          rejected: 0,
          totalAmount: 0,
          uniqueUsers: 0
        });
      }
    } catch (err) {
      console.error("Error fetching withdrawals:", err);
      toast.error("Failed to fetch withdrawals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
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

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return d.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: {
        label: 'Pending',
        color: 'bg-yellow-100 text-yellow-700',
        icon: <Clock size={12} className="text-yellow-500" />
      },
      completed: {
        label: 'Completed',
        color: 'bg-emerald-100 text-emerald-700',
        icon: <CheckCircle size={12} className="text-emerald-500" />
      },
      failed: {
        label: 'Failed',
        color: 'bg-red-100 text-red-700',
        icon: <XCircle size={12} className="text-red-500" />
      },
      rejected: {
        label: 'Rejected',
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

  const clearFilters = () => {
    setSearchTerm("");
    setFilterStatus("all");
    setFilterOwner("");
    setFilterBank("");
  };

  const filteredWithdrawals = withdrawals.filter((w) => {
    const ownerName = w.owner?.name?.toLowerCase() || "";
    const ownerEmail = w.owner?.email?.toLowerCase() || "";
    const ownerOrganization = w.ownerOrganization?.toLowerCase() || "";
    const bankName = w.bankName?.toLowerCase() || "";
    const accountNumber = w.accountNumber || "";
    
    const matchesSearch =
      ownerName.includes(searchTerm.toLowerCase()) ||
      ownerEmail.includes(searchTerm.toLowerCase()) ||
      ownerOrganization.includes(searchTerm.toLowerCase()) ||
      bankName.includes(searchTerm.toLowerCase()) ||
      accountNumber.includes(searchTerm);
    
    const matchesStatus = filterStatus === "all" || w.status === filterStatus;
    const matchesOwner = filterOwner === "" || ownerName.includes(filterOwner.toLowerCase()) || ownerOrganization.includes(filterOwner.toLowerCase());
    const matchesBank = filterBank === "" || bankName.includes(filterBank.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesOwner && matchesBank;
  });

  const handleViewDetails = (withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setShowDetailModal(true);
  };

  const handleDeleteWithdrawal = async () => {
    if (!deleteWithdrawal) return;
    
    setDeleting(true);
    try {
      const res = await axios.delete(
        `${API_URL}/api/bookings/deletewithdrawal/${deleteWithdrawal._id}`
      );

      if (res.data.success) {
        const updatedWithdrawals = withdrawals.filter(w => w._id !== deleteWithdrawal._id);
        setWithdrawals(updatedWithdrawals);
        
        const newStats = {
          total: updatedWithdrawals.length,
          pending: updatedWithdrawals.filter(w => w.status === 'pending').length,
          completed: updatedWithdrawals.filter(w => w.status === 'completed').length,
          failed: updatedWithdrawals.filter(w => w.status === 'failed').length,
          rejected: updatedWithdrawals.filter(w => w.status === 'rejected').length,
          totalAmount: updatedWithdrawals.reduce((sum, w) => sum + w.amount, 0),
          uniqueUsers: new Set(updatedWithdrawals.map(w => w.walletId)).size
        };
        setStats(newStats);

        toast.success(res.data.message || "Withdrawal deleted successfully");
        setShowDeleteModal(false);
        setDeleteWithdrawal(null);
      }
    } catch (error) {
      console.error("Delete withdrawal error:", error);
      toast.error(error.response?.data?.error || "Failed to delete withdrawal");
    } finally {
      setDeleting(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!editWithdrawal || !editStatus) {
      toast.error("Please select a status");
      return;
    }
    
    setUpdating(true);
    try {
      const response = await axios.put(
        `${API_URL}/api/bookings/withdrawalstatus/${editWithdrawal._id}`,
        { status: editStatus }
      );

      if (response.data.success) {
        const updatedWithdrawals = withdrawals.map(w =>
          w._id === editWithdrawal._id ? { ...w, status: editStatus } : w
        );
        setWithdrawals(updatedWithdrawals);
        
        const newStats = {
          total: updatedWithdrawals.length,
          pending: updatedWithdrawals.filter(w => w.status === 'pending').length,
          completed: updatedWithdrawals.filter(w => w.status === 'completed').length,
          failed: updatedWithdrawals.filter(w => w.status === 'failed').length,
          rejected: updatedWithdrawals.filter(w => w.status === 'rejected').length,
          totalAmount: updatedWithdrawals.reduce((sum, w) => sum + w.amount, 0),
          uniqueUsers: new Set(updatedWithdrawals.map(w => w.walletId)).size
        };
        setStats(newStats);

        toast.success(`Status updated to ${editStatus}`);
        setShowEditModal(false);
        setEditWithdrawal(null);
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

  const downloadWithdrawalDetails = (withdrawal) => {
    try {
      const ownerName = withdrawal.owner?.name || 'N/A';
      const ownerEmail = withdrawal.owner?.email || 'N/A';
      const ownerMobile = withdrawal.owner?.mobile || 'N/A';
      const ownerAddress = withdrawal.owner?.address || 'N/A';
      const ownerOrganization = withdrawal.ownerOrganization || 'N/A';
      const ownerGst = withdrawal.ownerGst || 'N/A';
      const withdrawalId = withdrawal._id.slice(-8).toUpperCase();
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
            <title>Withdrawal #${withdrawalId}</title>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { font-family: 'Times New Roman', 'Georgia', serif; background: #ffffff; padding: 40px; display: flex; justify-content: center; min-height: 100vh; color: #000000; }
              .container { max-width: 800px; width: 100%; background: #ffffff; border: 2px solid #000000; padding: 40px 45px; }
              .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px double #000000; padding-bottom: 20px; margin-bottom: 25px; }
              .brand h1 { font-size: 28px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #1a56db; }
              .brand .gst { font-size: 11px; color: #666666; margin-top: 2px; }
              .brand .address-line { font-size: 11px; color: #666666; margin-top: 2px; }
              .brand .org-name { font-size: 14px; font-weight: 600; color: #000000; margin-top: 4px; }
              .withdrawal-number { text-align: right; }
              .withdrawal-number .label { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #666666; }
              .withdrawal-number .number { font-size: 22px; font-weight: 700; color: #000000; margin-top: 2px; }
              .withdrawal-number .date { font-size: 12px; color: #333333; margin-top: 4px; }
              .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 25px; padding-bottom: 20px; border-bottom: 1px solid #cccccc; }
              .info-group .title { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #666666; margin-bottom: 6px; }
              .info-group .value { font-size: 14px; font-weight: 600; color: #000000; line-height: 1.6; }
              .info-group .value-small { font-size: 12px; font-weight: 400; color: #333333; }
              .amount-box { background: #fef2f2; border: 2px solid #dc2626; border-radius: 4px; padding: 16px 20px; margin: 15px 0; display: flex; justify-content: space-between; align-items: center; }
              .amount-box .label { font-size: 14px; font-weight: 600; color: #991b1b; }
              .amount-box .amount { font-size: 28px; font-weight: 700; color: #dc2626; }
              .details-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
              .details-table thead { border-top: 2px solid #000000; border-bottom: 2px solid #000000; }
              .details-table thead th { padding: 10px 12px; text-align: left; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #000000; }
              .details-table tbody td { padding: 10px 12px; font-size: 12px; color: #000000; border-bottom: 1px solid #eeeeee; }
              .badge { display: inline-block; padding: 2px 10px; border-radius: 12px; font-size: 10px; font-weight: 600; }
              .badge.pending { background: #fef3c7; color: #92400e; }
              .badge.completed { background: #d1fae5; color: #065f46; }
              .badge.failed { background: #fee2e2; color: #991b1b; }
              .badge.rejected { background: #f1f5f9; color: #475569; }
              .footer { text-align: center; padding-top: 25px; margin-top: 25px; border-top: 2px solid #000000; }
              .footer .powered { font-size: 14px; font-weight: 700; letter-spacing: 2px; color: #1a56db; }
              .footer .sub { font-size: 10px; color: #666666; margin-top: 4px; }
              .print-btn { position: fixed; bottom: 30px; right: 30px; padding: 14px 28px; background: #000000; color: #ffffff; border: none; border-radius: 4px; font-weight: 600; font-size: 13px; cursor: pointer; box-shadow: 0 4px 20px rgba(0,0,0,0.15); display: flex; align-items: center; gap: 10px; font-family: 'Segoe UI', Arial, sans-serif; letter-spacing: 0.5px; }
              .print-btn:hover { background: #222222; }
              @media print { body { background: white; padding: 20px; } .container { border: 1px solid #000000; padding: 30px; } .print-btn { display: none !important; } }
              @media (max-width: 640px) { body { padding: 20px; } .container { padding: 25px; } .header { flex-direction: column; text-align: center; gap: 15px; } .withdrawal-number { text-align: center; } .info-grid { grid-template-columns: 1fr; gap: 15px; } }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="brand"><h1>${ownerOrganization.toUpperCase()}</h1><div class="org-name">${ownerName}</div><div class="gst">GST: ${ownerGst}</div><div class="address-line">${ownerAddress}</div></div>
                <div class="withdrawal-number"><div class="label">Withdrawal</div><div class="number">#${withdrawalId}</div><div class="date">${today}</div></div>
              </div>
              <div class="info-grid">
                <div><div class="title">Account Holder</div><div class="value">${ownerName}</div><div class="value-small">${ownerEmail}</div><div class="value-small">${ownerMobile}</div></div>
                <div><div class="title">Bank Details</div><div class="value">${withdrawal.bankName || 'N/A'}</div><div class="value-small">Account: ${withdrawal.accountNumber || 'N/A'}</div><div class="value-small">IFSC: ${withdrawal.ifscCode || 'N/A'}</div></div>
              </div>
              <div class="amount-box"><span class="label">Withdrawal Amount</span><span class="amount">${formatCurrency(withdrawal.amount)}</span></div>
              <table class="details-table"><thead><tr><th>Field</th><th>Details</th></tr></thead>
                <tbody>
                  <tr><td><strong>Status</strong></td><td><span class="badge ${withdrawal.status}">${withdrawal.status.toUpperCase()}</span></td></tr>
                  <tr><td><strong>Description</strong></td><td>${withdrawal.description || 'N/A'}</td></tr>
                  <tr><td><strong>Requested On</strong></td><td>${formatDateTime(withdrawal.createdAt)}</td></tr>
                  <tr><td><strong>Wallet Balance</strong></td><td>${formatCurrency(withdrawal.walletBalance || 0)}</td></tr>
                  <tr><td><strong>Organization</strong></td><td>${ownerOrganization}</td></tr>
                  <tr><td><strong>GST Number</strong></td><td>${ownerGst}</td></tr>
                </tbody>
              </table>
              <div class="footer"><div class="powered">POWERED BY <span>IRYAX SPACE</span></div><div class="sub">Thank you for choosing ${ownerOrganization}</div><div class="sub" style="margin-top:2px;">This is a system generated document</div></div>
            </div>
            <button class="print-btn" onclick="window.print()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M18 9H6"/><path d="M18 13v6H6v-6"/><rect x="8" y="2" width="8" height="4" rx="1"/><rect x="8" y="13" width="8" height="4" rx="1"/></svg>Print / Save PDF</button>
          </body></html>
        `);
        win.document.close();
        win.focus();
        toast.success('Withdrawal details opened! Click Print to save as PDF.');
      } else {
        toast.error('Please allow popups to download');
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to generate document: ' + error.message);
    }
  };

  const exportToExcel = () => {
    try {
      if (filteredWithdrawals.length === 0) {
        toast.warning("No withdrawals to export");
        return;
      }

      const exportData = filteredWithdrawals.map((w, index) => ({
        'S.No': index + 1,
        'Owner Name': w.owner?.name || 'N/A',
        'Organization': w.ownerOrganization || 'N/A',
        'GST Number': w.ownerGst || 'N/A',
        'Email': w.owner?.email || 'N/A',
        'Mobile': w.owner?.mobile || 'N/A',
        'Amount': w.amount || 0,
        'Status': w.status || 'N/A',
        'Bank Name': w.bankName || 'N/A',
        'Account Number': w.accountNumber || 'N/A',
        'IFSC Code': w.ifscCode || 'N/A',
        'Description': w.description || 'N/A',
        'Requested On': w.createdAt ? formatDate(w.createdAt) : 'N/A',
        'Wallet Balance': w.walletBalance || 0
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Withdrawals');
      
      const date = new Date().toISOString().split('T')[0];
      XLSX.writeFile(wb, `withdrawals_${date}.xlsx`);
      
      toast.success(`Exported ${filteredWithdrawals.length} withdrawals to Excel!`);
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export");
    }
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
              Withdrawal <span>Requests</span>
            </h1>
            <p className="admin-dash__subtitle">
              Manage and track all user withdrawal requests.
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
          <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-4 text-white shadow-lg shadow-red-500/25">
            <p className="text-[10px] font-bold uppercase tracking-wider text-red-200">Total Requests</p>
            <p className="text-2xl font-bold">{stats.total}</p>
            <div className="mt-2 pt-2 border-t border-white/20 flex justify-between text-[10px]">
              <span className="text-red-200">Amount</span>
              <span className="font-semibold">{formatCurrency(stats.totalAmount)}</span>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-yellow-600">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Completed</p>
            <p className="text-2xl font-bold text-emerald-600">{stats.completed}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-purple-600">Unique Users</p>
            <p className="text-2xl font-bold text-purple-600">{stats.uniqueUsers}</p>
          </div>
        </div>

        {/* Table Section */}
        <div className="admin-dash__card" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}>
          <div className="admin-dash__card-header flex flex-wrap items-center justify-between gap-3" style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb' }}>
            <div className="flex items-center gap-3">
              <h3 className="admin-dash__card-title">Withdrawal Requests</h3>
              <span className="px-2.5 py-0.5 text-xs font-bold text-indigo-700 bg-indigo-100 rounded-full">
                {filteredWithdrawals.length}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {/* Search Bar */}
              <div className="relative w-full sm:w-48">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search withdrawals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
              
              {/* Filter Toggle Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${showFilters ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                <Filter size={14} />
                Filters
                {(filterStatus !== 'all' || filterOwner || filterBank) && (
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                )}
              </button>

              {filteredWithdrawals.length > 0 && (
                <button onClick={exportToExcel} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium hover:bg-indigo-100 transition-colors border border-indigo-200">
                  <Download size={14} />
                  <span className="hidden xs:inline">Export</span>
                </button>
              )}

              <button onClick={fetchWithdrawals} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors">
                <RefreshCw size={14} />
                <span className="hidden xs:inline">Refresh</span>
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="px-4 pt-4 pb-3 border-b border-gray-100" style={{ backgroundColor: '#fafafa' }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Owner</label>
                  <input
                    type="text"
                    placeholder="Filter by owner..."
                    value={filterOwner}
                    onChange={(e) => setFilterOwner(e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Bank</label>
                  <input
                    type="text"
                    placeholder="Filter by bank..."
                    value={filterBank}
                    onChange={(e) => setFilterBank(e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
                <div className="flex items-end">
                  <button onClick={clearFilters} className="w-full px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-red-600 transition-colors border border-gray-200 rounded-lg hover:border-red-300 flex items-center justify-center gap-1">
                    <XCircleIcon size={14} /> Clear All
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Table Container */}
          <div className="admin-dash__card-body p-0 overflow-x-auto" style={{ backgroundColor: '#ffffff' }}>
            {filteredWithdrawals.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-20 text-gray-400">
                <Banknote size={48} className="opacity-20" />
                <p className="text-lg font-medium">No withdrawals found</p>
                <p className="text-sm">Try adjusting your filters.</p>
              </div>
            ) : (
              <table className="w-full min-w-[1200px] text-left">
                <thead>
                  <tr className="border-b border-gray-100" style={{ backgroundColor: '#f9fafb' }}>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">#</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Owner</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Organization</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Bank</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Amount</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Status</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Requested</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredWithdrawals.map((withdrawal, idx) => {
                    const statusBadge = getStatusBadge(withdrawal.status);
                    const ownerName = withdrawal.owner?.name || 'N/A';
                    const ownerOrganization = withdrawal.ownerOrganization || 'N/A';
                    const ownerMobile = withdrawal.owner?.mobile || 'N/A';
                    
                    return (
                      <tr key={withdrawal._id} className="transition-colors group hover:bg-gray-50/80">
                        <td className="p-4">
                          <span className="text-sm font-semibold text-gray-400">#{idx + 1}</span>
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{ownerName}</p>
                            <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                              <Phone size={10} className="text-gray-400" />
                              {ownerMobile}
                            </p>
                          </div>
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="font-medium text-indigo-600 text-sm">{ownerOrganization}</p>
                            {withdrawal.ownerGst && withdrawal.ownerGst !== 'N/A' && (
                              <p className="text-[10px] text-gray-400">GST: {withdrawal.ownerGst}</p>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="font-medium text-gray-800 text-sm">{withdrawal.bankName || 'N/A'}</p>
                            <p className="text-[10px] text-gray-400 font-mono">IFSC: {withdrawal.ifscCode || 'N/A'}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-sm font-bold text-red-600">{formatCurrency(withdrawal.amount)}</span>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full ${statusBadge.color}`}>
                            {statusBadge.icon} {statusBadge.label}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-gray-600">{formatDate(withdrawal.createdAt)}</span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <button
                              onClick={() => handleViewDetails(withdrawal)}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors whitespace-nowrap"
                            >
                              <Eye size={13} /> View
                            </button>
                            <button
                              onClick={() => downloadWithdrawalDetails(withdrawal)}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors whitespace-nowrap"
                            >
                              <FileDown size={13} /> Invoice
                            </button>
                            <button
                              onClick={() => { setEditWithdrawal(withdrawal); setEditStatus(withdrawal.status || 'pending'); setShowEditModal(true); }}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-orange-50 text-orange-700 hover:bg-orange-100 transition-colors whitespace-nowrap"
                            >
                              <Edit size={13} /> Status
                            </button>
                            <button
                              onClick={() => { setDeleteWithdrawal(withdrawal); setShowDeleteModal(true); }}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-700 hover:bg-red-100 transition-colors whitespace-nowrap"
                            >
                              <Trash2 size={13} /> Delete
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
          {!loading && filteredWithdrawals.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-100 rounded-b-2xl flex flex-wrap items-center justify-between gap-2" style={{ backgroundColor: '#fafafa' }}>
              <span className="text-xs text-gray-500">
                Showing <strong>{filteredWithdrawals.length}</strong> of <strong>{withdrawals.length}</strong> requests
              </span>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500"></span> Pending: {stats.pending}</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Completed: {stats.completed}</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Failed: {stats.failed}</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-500"></span> Total: {stats.total}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ====================== */}
      {/* DETAIL MODAL */}
      {/* ====================== */}
      {showDetailModal && selectedWithdrawal && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) setShowDetailModal(false); }}>
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-t-3xl flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Receipt size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Withdrawal Details</h3>
                  <p className="text-sm text-red-200">#{selectedWithdrawal._id.slice(-6).toUpperCase()}</p>
                </div>
              </div>
              <button onClick={() => setShowDetailModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Owner</p>
                <p className="mt-1 font-semibold text-gray-800">{selectedWithdrawal.owner?.name || 'N/A'}</p>
                {selectedWithdrawal.ownerOrganization && selectedWithdrawal.ownerOrganization !== 'N/A' && (
                  <p className="text-sm text-indigo-600 font-medium mt-1 flex items-center gap-1">
                    <Building2 size={14} /> {selectedWithdrawal.ownerOrganization}
                  </p>
                )}
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <Mail size={14} className="text-indigo-500" />
                    {selectedWithdrawal.owner?.email || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <Phone size={14} className="text-indigo-500" />
                    {selectedWithdrawal.owner?.mobile || 'N/A'}
                  </p>
                  {selectedWithdrawal.ownerGst && selectedWithdrawal.ownerGst !== 'N/A' && (
                    <p className="text-sm text-gray-600 flex items-center gap-1 col-span-2">
                      <span className="font-medium">GST:</span> {selectedWithdrawal.ownerGst}
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">🏦 Bank Details</p>
                <p className="mt-1 font-semibold text-gray-800">{selectedWithdrawal.bankName || 'N/A'}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1 flex-wrap">
                  <span>Ac: {selectedWithdrawal.accountNumber || 'N/A'}</span>
                  <span>•</span>
                  <span className="font-mono">IFSC: {selectedWithdrawal.ifscCode || 'N/A'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-red-50 rounded-xl p-4 border border-red-200 text-center">
                  <p className="text-[10px] font-bold text-red-600 uppercase">Amount</p>
                  <p className="text-2xl font-bold text-red-600">{formatCurrency(selectedWithdrawal.amount)}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Status</p>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full mt-1 ${getStatusBadge(selectedWithdrawal.status).color}`}>
                    {getStatusBadge(selectedWithdrawal.status).icon} {getStatusBadge(selectedWithdrawal.status).label}
                  </span>
                </div>
              </div>

              {selectedWithdrawal.description && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Description</p>
                  <p className="mt-1 text-sm text-gray-700">{selectedWithdrawal.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Requested On</p>
                  <p className="mt-1 font-medium text-gray-800 text-sm">{formatDateTime(selectedWithdrawal.createdAt)}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Wallet Balance</p>
                  <p className="mt-1 font-medium text-gray-800 text-sm">{formatCurrency(selectedWithdrawal.walletBalance || 0)}</p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button onClick={() => { setShowDetailModal(false); downloadWithdrawalDetails(selectedWithdrawal); }} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-sm active:scale-[0.98] flex items-center justify-center gap-2">
                  <FileDown size={16} /> Download Invoice
                </button>
                <button onClick={() => setShowDetailModal(false)} className="w-full py-3 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================== */}
      {/* EDIT STATUS MODAL */}
      {/* ====================== */}
      {showEditModal && editWithdrawal && (
        <div className="fixed inset-0 z-[1300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) { setShowEditModal(false); setEditWithdrawal(null); setEditStatus(""); } }}>
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-5 text-white rounded-t-3xl flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center"><Edit size={20} className="text-white" /></div>
                <div><h3 className="text-xl font-bold">Update Status</h3><p className="text-sm text-amber-100">{formatCurrency(editWithdrawal.amount)}</p></div>
              </div>
              <button onClick={() => { setShowEditModal(false); setEditWithdrawal(null); setEditStatus(""); }} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"><X size={20} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-gray-50 rounded-xl p-4 flex justify-between items-center">
                <span className="text-sm text-gray-500">Current Status</span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full ${getStatusBadge(editWithdrawal.status).color}`}>
                  {getStatusBadge(editWithdrawal.status).icon} {getStatusBadge(editWithdrawal.status).label}
                </span>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Select New Status</label>
                <div className="grid grid-cols-2 gap-2">
                  {['pending', 'completed', 'failed', 'rejected'].map((status) => {
                    const badge = getStatusBadge(status);
                    const isSelected = editStatus === status;
                    return (
                      <button key={status} onClick={() => setEditStatus(status)} className={`py-2.5 rounded-xl text-xs font-bold border transition ${isSelected ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 hover:bg-gray-50 text-gray-700'}`}>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>{badge.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={handleUpdateStatus} disabled={updating || !editStatus} className={`flex-1 py-3 rounded-xl text-white font-bold transition ${(updating || !editStatus) ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:shadow-lg'}`}>
                  {updating ? 'Updating...' : 'Update Status'}
                </button>
                <button onClick={() => { setShowEditModal(false); setEditWithdrawal(null); setEditStatus(""); }} className="px-5 py-3 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================== */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ====================== */}
      {showDeleteModal && deleteWithdrawal && (
        <div className="fixed inset-0 z-[1300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) { setShowDeleteModal(false); setDeleteWithdrawal(null); } }}>
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-br from-red-500 to-red-600 p-5 text-white rounded-t-3xl flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center"><Trash2 size={20} className="text-white" /></div>
                <div><h3 className="text-xl font-bold">Delete Withdrawal</h3><p className="text-sm text-red-200">{formatCurrency(deleteWithdrawal.amount)}</p></div>
              </div>
              <button onClick={() => { setShowDeleteModal(false); setDeleteWithdrawal(null); }} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"><X size={20} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-red-50 rounded-xl p-4 space-y-2 text-sm">
                <p className="font-bold text-red-800">Are you sure you want to delete this withdrawal?</p>
                <div className="space-y-1 text-gray-600">
                  <p><span className="text-gray-500">Amount:</span> {formatCurrency(deleteWithdrawal.amount)}</p>
                  <p><span className="text-gray-500">Owner:</span> {deleteWithdrawal.owner?.name || 'N/A'}</p>
                  <p><span className="text-gray-500">Status:</span> {getStatusBadge(deleteWithdrawal.status).label}</p>
                </div>
              </div>
              <div className="bg-amber-50 rounded-xl p-3 text-xs text-amber-700 flex items-start gap-2 border border-amber-200">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>This action cannot be undone. All associated data will be permanently removed.</span>
              </div>
              <div className="flex gap-3">
                <button onClick={handleDeleteWithdrawal} disabled={deleting} className={`flex-1 py-3 rounded-xl text-white font-bold transition ${deleting ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-red-500 to-red-600 hover:shadow-lg'}`}>
                  {deleting ? 'Deleting...' : 'Confirm Delete'}
                </button>
                <button onClick={() => { setShowDeleteModal(false); setDeleteWithdrawal(null); }} className="px-5 py-3 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllWithdrawals;