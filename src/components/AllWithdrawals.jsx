// AllWithdrawals.jsx - Complete with Organization & GST
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
  Receipt
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
      pending: {
        label: 'Pending',
        color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
        icon: <Clock size={12} className="text-yellow-500" />
      },
      completed: {
        label: 'Completed',
        color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        icon: <CheckCircle size={12} className="text-emerald-500" />
      },
      failed: {
        label: 'Failed',
        color: 'bg-red-50 text-red-700 border-red-200',
        icon: <XCircle size={12} className="text-red-500" />
      },
      rejected: {
        label: 'Rejected',
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

  // ======================
  // PROFESSIONAL WITHDRAWAL DETAILS - WITH ORGANIZATION & GST
  // ======================
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

      const detailsHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Withdrawal #${withdrawalId}</title>
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
            .container {
              max-width: 800px;
              width: 100%;
              background: #ffffff;
              border: 2px solid #000000;
              padding: 40px 45px;
            }
            .header {
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
            .brand .org-name {
              font-size: 14px;
              font-weight: 600;
              color: #000000;
              margin-top: 4px;
            }
            .withdrawal-number {
              text-align: right;
            }
            .withdrawal-number .label {
              font-size: 10px;
              text-transform: uppercase;
              letter-spacing: 1px;
              color: #666666;
            }
            .withdrawal-number .number {
              font-size: 22px;
              font-weight: 700;
              color: #000000;
              margin-top: 2px;
            }
            .withdrawal-number .date {
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
            .amount-box {
              background: #fef2f2;
              border: 2px solid #dc2626;
              border-radius: 4px;
              padding: 16px 20px;
              margin: 15px 0;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .amount-box .label {
              font-size: 14px;
              font-weight: 600;
              color: #991b1b;
            }
            .amount-box .amount {
              font-size: 28px;
              font-weight: 700;
              color: #dc2626;
            }
            .details-table {
              width: 100%;
              border-collapse: collapse;
              margin: 15px 0;
            }
            .details-table thead {
              border-top: 2px solid #000000;
              border-bottom: 2px solid #000000;
            }
            .details-table thead th {
              padding: 10px 12px;
              text-align: left;
              font-size: 9px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.06em;
              color: #000000;
            }
            .details-table tbody td {
              padding: 10px 12px;
              font-size: 12px;
              color: #000000;
              border-bottom: 1px solid #eeeeee;
            }
            .badge {
              display: inline-block;
              padding: 2px 10px;
              border-radius: 12px;
              font-size: 10px;
              font-weight: 600;
            }
            .badge.pending { background: #fef3c7; color: #92400e; }
            .badge.completed { background: #d1fae5; color: #065f46; }
            .badge.failed { background: #fee2e2; color: #991b1b; }
            .badge.rejected { background: #f1f5f9; color: #475569; }
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
              .container { border: 1px solid #000000; padding: 30px; }
              .print-btn { display: none !important; }
              .badge { -webkit-print-color-adjust: exact; }
            }
            @media (max-width: 640px) {
              body { padding: 20px; }
              .container { padding: 25px; }
              .header { flex-direction: column; text-align: center; gap: 15px; }
              .withdrawal-number { text-align: center; }
              .info-grid { grid-template-columns: 1fr; gap: 15px; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="brand">
                <h1>${ownerOrganization.toUpperCase()}</h1>
                <div class="org-name">${ownerName}</div>
                <div class="gst">GST: ${ownerGst}</div>
                <div class="address-line">${ownerAddress}</div>
              </div>
              <div class="withdrawal-number">
                <div class="label">Withdrawal</div>
                <div class="number">#${withdrawalId}</div>
                <div class="date">${today}</div>
              </div>
            </div>

            <div class="info-grid">
              <div>
                <div class="title">Account Holder</div>
                <div class="value">${ownerName}</div>
                <div class="value-small">${ownerEmail}</div>
                <div class="value-small">${ownerMobile}</div>
              </div>
              <div>
                <div class="title">Bank Details</div>
                <div class="value">${withdrawal.bankName || 'N/A'}</div>
                <div class="value-small">Account: ${withdrawal.accountNumber || 'N/A'}</div>
                <div class="value-small">IFSC: ${withdrawal.ifscCode || 'N/A'}</div>
              </div>
            </div>

            <div class="amount-box">
              <span class="label">Withdrawal Amount</span>
              <span class="amount">${formatCurrency(withdrawal.amount)}</span>
            </div>

            <table class="details-table">
              <thead>
                <tr>
                  <th>Field</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Status</strong></td>
                  <td><span class="badge ${withdrawal.status}">${withdrawal.status.toUpperCase()}</span></td>
                </tr>
                <tr>
                  <td><strong>Description</strong></td>
                  <td>${withdrawal.description || 'N/A'}</td>
                </tr>
                <tr>
                  <td><strong>Requested On</strong></td>
                  <td>${formatDate(withdrawal.createdAt)} ${formatTime(withdrawal.createdAt)}</td>
                </tr>
                <tr>
                  <td><strong>Wallet Balance</strong></td>
                  <td>${formatCurrency(withdrawal.walletBalance || 0)}</td>
                </tr>
                <tr>
                  <td><strong>Organization</strong></td>
                  <td>${ownerOrganization}</td>
                </tr>
                <tr>
                  <td><strong>GST Number</strong></td>
                  <td>${ownerGst}</td>
                </tr>
              </tbody>
            </table>

            <div class="footer">
              <div class="powered">POWERED BY <span>IRYAX SPACE</span></div>
              <div class="sub">Thank you for choosing ${ownerOrganization}</div>
              <div class="sub" style="margin-top:2px;">This is a system generated document</div>
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
        win.document.write(detailsHTML);
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
      ws['!cols'] = [
        { wch: 6 }, { wch: 20 }, { wch: 20 }, { wch: 15 },
        { wch: 25 }, { wch: 15 }, { wch: 12 }, { wch: 12 },
        { wch: 20 }, { wch: 15 }, { wch: 12 }, { wch: 30 },
        { wch: 15 }, { wch: 12 }
      ];

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
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="admin-dash">
        <AdminNavbar />
        <div className="admin-dash__loading">
          <div className="admin-dash__spinner" />
          <p className="admin-dash__loading-text">Loading withdrawals...</p>
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
              Withdrawal <span>Requests</span>
            </h1>
            <p className="admin-dash__subtitle">
              Manage and track all user withdrawal requests.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-grow sm:flex-grow-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search by owner, organization, bank..."
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
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="rejected">Rejected</option>
            </select>

            {filteredWithdrawals.length > 0 && (
              <button
                onClick={exportToExcel}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors w-full sm:w-auto"
              >
                <Download size={16} />
                Export Excel
              </button>
            )}

            <button
              onClick={fetchWithdrawals}
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
                {filteredWithdrawals.length} <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest ml-1">Requests</span>
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-4 text-white shadow-lg shadow-red-500/25">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[8px] font-bold uppercase tracking-wider text-red-200">Total Requests</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div className="bg-white/20 p-2 rounded-xl">
                <Banknote size={20} className="text-white" />
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-white/20 flex justify-between text-[10px]">
              <span className="text-red-200">Total Amount</span>
              <span className="font-semibold">{formatCurrency(stats.totalAmount)}</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm text-center">
            <p className="text-[8px] font-bold uppercase tracking-wider text-yellow-600">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            <p className="text-[8px] text-slate-400 mt-1">Awaiting action</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm text-center">
            <p className="text-[8px] font-bold uppercase tracking-wider text-emerald-600">Completed</p>
            <p className="text-2xl font-bold text-emerald-600">{stats.completed}</p>
            <p className="text-[8px] text-slate-400 mt-1">Successfully processed</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm text-center">
            <p className="text-[8px] font-bold uppercase tracking-wider text-purple-600">Unique Users</p>
            <p className="text-2xl font-bold text-purple-600">{stats.uniqueUsers}</p>
            <p className="text-[8px] text-slate-400 mt-1">Distinct users</p>
          </div>
        </div>

        {filteredWithdrawals.length === 0 ? (
          <div className="admin-dash__error" style={{ background: '#f8fafc', borderColor: '#e2e8f0' }}>
            <Banknote size={48} className="text-slate-300 mb-4" />
            <p className="admin-dash__error-title" style={{ color: '#475569' }}>No withdrawals found</p>
            <p className="admin-dash__error-message">We couldn't find any withdrawal requests matching your search criteria.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Owner</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Organization</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Bank Details</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Requested</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredWithdrawals.map((withdrawal) => {
                    const statusBadge = getStatusBadge(withdrawal.status);
                    const ownerName = withdrawal.owner?.name || 'N/A';
                    const ownerOrganization = withdrawal.ownerOrganization || 'N/A';
                    const ownerMobile = withdrawal.owner?.mobile || 'N/A';
                    
                    return (
                      <tr key={withdrawal._id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-semibold text-slate-800 text-sm">
                              {ownerName}
                            </p>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                              <Phone size={12} className="text-indigo-400" />
                              {ownerMobile}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-indigo-600 text-sm">
                              {ownerOrganization}
                            </p>
                            {withdrawal.ownerGst && withdrawal.ownerGst !== 'N/A' && (
                              <p className="text-xs text-slate-400">GST: {withdrawal.ownerGst}</p>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-slate-700 text-sm">
                              {withdrawal.bankName || 'N/A'}
                            </p>
                            <p className="text-xs text-slate-500">
                              Ac: {withdrawal.accountNumber || 'N/A'}
                            </p>
                            <p className="text-xs text-slate-400 font-mono">
                              IFSC: {withdrawal.ifscCode || 'N/A'}
                            </p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-bold text-red-600 text-sm">
                            {formatCurrency(withdrawal.amount)}
                          </p>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${statusBadge.color}`}>
                            {statusBadge.icon}
                            {statusBadge.label}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5 text-xs text-slate-600">
                              <Calendar size={12} className="text-indigo-400" />
                              <span>{formatDate(withdrawal.createdAt)}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-400">
                              <Clock size={12} className="text-indigo-400" />
                              <span>{formatTime(withdrawal.createdAt)}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center gap-1.5 flex-wrap">
                            <button
                              onClick={() => handleViewDetails(withdrawal)}
                              className="p-1.5 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                              title="View Details"
                            >
                              <Eye size={15} />
                            </button>
                            
                            <button
                              onClick={() => downloadWithdrawalDetails(withdrawal)}
                              className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
                              title="Download Details"
                            >
                              <FileDown size={15} />
                            </button>
                            
                            <button
                              onClick={() => {
                                setEditWithdrawal(withdrawal);
                                setEditStatus(withdrawal.status || 'pending');
                                setShowEditModal(true);
                              }}
                              className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                              title="Edit Status"
                            >
                              <Edit size={15} />
                            </button>
                            
                            <button
                              onClick={() => {
                                setDeleteWithdrawal(withdrawal);
                                setShowDeleteModal(true);
                              }}
                              className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                              title="Delete Withdrawal"
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

      {/* Detail Modal */}
      {showDetailModal && selectedWithdrawal && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={(e) => {
          if (e.target === e.currentTarget) setShowDetailModal(false);
        }}>
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div style={{
              background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 60%, #991b1b 100%)",
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
                  <Receipt size={20} color="#fff" />
                </div>
                <div>
                  <h3 style={{ margin: 0, color: "#fff", fontSize: "1rem", fontWeight: 700 }}>
                    Withdrawal Details
                  </h3>
                  <p style={{ margin: 0, color: "rgba(255,255,255,0.8)", fontSize: "0.75rem" }}>
                    #{selectedWithdrawal._id.slice(-6)}
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
                {/* Owner Info */}
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">👤 Owner</p>
                  <p className="font-semibold text-slate-800 mt-1">
                    {selectedWithdrawal.owner?.name || 'N/A'}
                  </p>
                  {selectedWithdrawal.ownerOrganization && selectedWithdrawal.ownerOrganization !== 'N/A' && (
                    <p className="text-sm text-indigo-600 font-medium mt-1">
                      🏢 {selectedWithdrawal.ownerOrganization}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-slate-600 mt-1 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Mail size={12} />
                      {selectedWithdrawal.owner?.email || 'N/A'}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Phone size={12} />
                      {selectedWithdrawal.owner?.mobile || 'N/A'}
                    </span>
                    {selectedWithdrawal.ownerGst && selectedWithdrawal.ownerGst !== 'N/A' && (
                      <>
                        <span>•</span>
                        <span className="text-xs text-slate-500">GST: {selectedWithdrawal.ownerGst}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Bank Info */}
                <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                  <p className="text-xs font-medium text-indigo-600 uppercase tracking-wider">🏦 Bank Details</p>
                  <p className="font-semibold text-slate-800 mt-1">
                    {selectedWithdrawal.bankName || 'N/A'}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-slate-600 mt-1 flex-wrap">
                    <span>Ac: {selectedWithdrawal.accountNumber || 'N/A'}</span>
                    <span>•</span>
                    <span className="font-mono">IFSC: {selectedWithdrawal.ifscCode || 'N/A'}</span>
                  </div>
                </div>

                {/* Amount & Status */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-red-50 rounded-xl p-4 border border-red-200 text-center">
                    <p className="text-[8px] font-bold text-red-600 uppercase tracking-wider">Amount</p>
                    <p className="text-2xl font-bold text-red-600">
                      {formatCurrency(selectedWithdrawal.amount)}
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 text-center">
                    <p className="text-[8px] font-bold text-slate-500 uppercase tracking-wider">Status</p>
                    <div className="mt-1">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadge(selectedWithdrawal.status).color}`}>
                        {getStatusBadge(selectedWithdrawal.status).icon}
                        {getStatusBadge(selectedWithdrawal.status).label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {selectedWithdrawal.description && (
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">📝 Description</p>
                    <p className="text-sm text-slate-700 mt-1">{selectedWithdrawal.description}</p>
                  </div>
                )}

                {/* Dates */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <Calendar size={12} />
                      Requested On
                    </p>
                    <p className="font-semibold text-slate-800 mt-1">
                      {formatDate(selectedWithdrawal.createdAt)}
                    </p>
                    <p className="text-xs text-slate-400">{formatTime(selectedWithdrawal.createdAt)}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <Wallet size={12} />
                      Wallet Balance
                    </p>
                    <p className="font-semibold text-slate-800 mt-1">
                      {formatCurrency(selectedWithdrawal.walletBalance || 0)}
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
      {showEditModal && editWithdrawal && (
        <div className="fixed inset-0 z-[1300] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowEditModal(false);
            setEditWithdrawal(null);
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
                    Update Withdrawal Status
                  </h3>
                  <p style={{ margin: 0, color: "rgba(255,255,255,0.8)", fontSize: "0.75rem" }}>
                    {formatCurrency(editWithdrawal.amount)} - {editWithdrawal.owner?.name || 'N/A'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditWithdrawal(null);
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
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusBadge(editWithdrawal.status).color}`}>
                    {getStatusBadge(editWithdrawal.status).icon}
                    {getStatusBadge(editWithdrawal.status).label}
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
                  {['pending', 'completed', 'failed', 'rejected'].map((status) => {
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
                    setEditWithdrawal(null);
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
      {showDeleteModal && deleteWithdrawal && (
        <div className="fixed inset-0 z-[1300] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowDeleteModal(false);
            setDeleteWithdrawal(null);
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
                    Delete Withdrawal
                  </h3>
                  <p style={{ margin: 0, color: "rgba(255,255,255,0.8)", fontSize: "0.75rem" }}>
                    {formatCurrency(deleteWithdrawal.amount)} - {deleteWithdrawal.owner?.name || 'N/A'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteWithdrawal(null);
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
                    <span style={{ color: "#64748b", fontSize: "0.875rem" }}>Amount</span>
                    <span style={{ fontWeight: 600, color: "#dc2626" }}>
                      {formatCurrency(deleteWithdrawal.amount)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: "#64748b", fontSize: "0.875rem" }}>Owner</span>
                    <span style={{ fontWeight: 600, color: "#1e293b" }}>
                      {deleteWithdrawal.owner?.name || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: "#64748b", fontSize: "0.875rem" }}>Status</span>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(deleteWithdrawal.status).color}`}>
                      {getStatusBadge(deleteWithdrawal.status).icon}
                      {getStatusBadge(deleteWithdrawal.status).label}
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
                <span>
                  {deleteWithdrawal.status === 'pending' 
                    ? 'Deleting this pending withdrawal will refund the amount to the wallet.'
                    : 'This withdrawal will be permanently removed.'}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={handleDeleteWithdrawal}
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
                    setDeleteWithdrawal(null);
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

export default AllWithdrawals;