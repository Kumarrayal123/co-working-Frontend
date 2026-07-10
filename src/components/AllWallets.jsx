// AllWallets.jsx
import axios from "axios";
import {
  Wallet,
  Calendar,
  Clock,
  Phone,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Search,
  X,
  Download,
  RefreshCw,
  FileDown,
  Trash2,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AdminNavbar from "./AdminNavbar";
import * as XLSX from 'xlsx';
import "./Dashboard.css";

const API_URL = "http://localhost:5000";

const AllWallets = () => {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    totalWallets: 0,
    totalBalance: 0,
    totalEarned: 0,
    totalTransactions: 0,
    activeWallets: 0,
    zeroBalanceWallets: 0
  });
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteWallet, setDeleteWallet] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [filterType, setFilterType] = useState("all");

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchWallets = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${API_URL}/api/bookings/all-wallets`,
        token ? getAuthHeader() : {}
      );

      if (res.data.success) {
        setWallets(res.data.wallets || []);
        setStats(res.data.stats || {
          totalWallets: 0,
          totalBalance: 0,
          totalEarned: 0,
          totalTransactions: 0,
          activeWallets: 0,
          zeroBalanceWallets: 0
        });
      }
    } catch (err) {
      console.error("Error fetching wallets:", err);
      toast.error("Failed to fetch wallets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallets();
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

  const getTransactionTypeBadge = (type) => {
    if (type === 'credit') {
      return {
        label: 'Credit',
        color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        icon: <ArrowUpRight size={12} className="text-emerald-500" />
      };
    }
    return {
      label: 'Debit',
      color: 'bg-red-50 text-red-700 border-red-200',
      icon: <ArrowDownRight size={12} className="text-red-500" />
    };
  };

  const getWithdrawalStatusBadge = (status) => {
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
      rejected: {
        label: 'Rejected',
        color: 'bg-red-50 text-red-700 border-red-200',
        icon: <XCircle size={12} className="text-red-500" />
      }
    };
    return statusMap[status?.toLowerCase()] || {
      label: status || 'Unknown',
      color: 'bg-gray-50 text-gray-700 border-gray-200',
      icon: <AlertCircle size={12} className="text-gray-500" />
    };
  };

  const handleViewDetails = (wallet) => {
    setSelectedWallet(wallet);
    setShowDetailModal(true);
  };

  // DELETE WALLET - Now with actual API call
  const handleDeleteWallet = async () => {
    if (!deleteWallet) return;
    
    setDeleting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(
        `${API_URL}/api/bookings/wallet/${deleteWallet._id}`,
        token ? getAuthHeader() : {}
      );

      if (res.data.success) {
        // Remove deleted wallet from state
        const updatedWallets = wallets.filter(w => w._id !== deleteWallet._id);
        setWallets(updatedWallets);
        
        // Update stats
        const newStats = {
          totalWallets: updatedWallets.length,
          totalBalance: updatedWallets.reduce((sum, w) => sum + (w.balance || 0), 0),
          totalEarned: updatedWallets.reduce((sum, w) => sum + (w.totalEarned || 0), 0),
          totalTransactions: updatedWallets.reduce((sum, w) => sum + (w.transactions || []).length + (w.withdrawals || []).length, 0),
          activeWallets: updatedWallets.filter(w => (w.balance || 0) > 0).length,
          zeroBalanceWallets: updatedWallets.filter(w => (w.balance || 0) === 0).length
        };
        setStats(newStats);

        toast.success("Wallet deleted successfully");
        setShowDeleteModal(false);
        setDeleteWallet(null);
      }
    } catch (error) {
      console.error("Delete wallet error:", error);
      toast.error(error.response?.data?.error || "Failed to delete wallet");
    } finally {
      setDeleting(false);
    }
  };

  const downloadWalletStatement = (wallet) => {
    try {
      const ownerName = wallet.ownerId?.name || 'N/A';
      const ownerEmail = wallet.ownerId?.email || 'N/A';
      const ownerMobile = wallet.ownerId?.mobile || 'N/A';
      const walletId = wallet._id.slice(-8).toUpperCase();

      const statementHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Wallet Statement #${walletId}</title>
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
            .statement-container {
              max-width: 900px;
              width: 100%;
              background: white;
              border-radius: 16px;
              box-shadow: 0 10px 40px rgba(0,0,0,0.08);
              overflow: hidden;
            }
            .statement-header {
              background: linear-gradient(135deg, #1e1b4b 0%, #4f46e5 100%);
              padding: 30px 40px;
              color: white;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .statement-header h1 { font-size: 28px; font-weight: 700; }
            .statement-header .sub { font-size: 14px; opacity: 0.8; }
            .statement-header .wallet-id {
              background: rgba(255,255,255,0.2);
              padding: 8px 16px;
              border-radius: 8px;
              font-size: 14px;
              font-weight: 600;
            }
            .statement-body { padding: 40px; }
            .summary-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 16px;
              margin-bottom: 30px;
            }
            .summary-card {
              background: #f8fafc;
              border-radius: 12px;
              padding: 16px 20px;
              text-align: center;
            }
            .summary-card .label {
              font-size: 12px;
              color: #64748b;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.06em;
            }
            .summary-card .value {
              font-size: 24px;
              font-weight: 700;
              color: #0f172a;
              margin-top: 4px;
            }
            .summary-card .value.green { color: #059669; }
            .summary-card .value.blue { color: #4f46e5; }
            .summary-card .value.purple { color: #7c3aed; }
            .owner-info {
              background: #f1f5f9;
              border-radius: 12px;
              padding: 16px 20px;
              margin-bottom: 30px;
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 12px;
            }
            .owner-info .field { display: flex; flex-direction: column; }
            .owner-info .field .label {
              font-size: 11px;
              color: #64748b;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.06em;
            }
            .owner-info .field .value {
              font-size: 14px;
              font-weight: 600;
              color: #0f172a;
              margin-top: 2px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th {
              text-align: left;
              padding: 12px 16px;
              background: #f8fafc;
              font-size: 11px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.06em;
              color: #64748b;
              border-bottom: 2px solid #e2e8f0;
            }
            td {
              padding: 12px 16px;
              font-size: 13px;
              color: #0f172a;
              border-bottom: 1px solid #f1f5f9;
            }
            td .badge {
              display: inline-block;
              padding: 2px 10px;
              border-radius: 12px;
              font-size: 11px;
              font-weight: 600;
            }
            .badge.credit { background: #d1fae5; color: #065f46; }
            .badge.debit { background: #fee2e2; color: #991b1b; }
            .badge.pending { background: #fef3c7; color: #92400e; }
            .badge.completed { background: #d1fae5; color: #065f46; }
            .badge.rejected { background: #fee2e2; color: #991b1b; }
            .text-amount { font-weight: 600; }
            .text-amount.credit { color: #059669; }
            .text-amount.debit { color: #dc2626; }
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
              .statement-container { box-shadow: none; border-radius: 0; }
              .print-btn { display: none !important; }
              .statement-header { background: #1e1b4b !important; -webkit-print-color-adjust: exact; }
              .badge { -webkit-print-color-adjust: exact; }
            }
            @media (max-width: 640px) {
              .summary-grid { grid-template-columns: 1fr; }
              body { padding: 20px; }
              .statement-header { flex-direction: column; text-align: center; gap: 15px; padding: 25px; }
              .statement-body { padding: 20px; }
              .owner-info { grid-template-columns: 1fr; }
            }
          </style>
        </head>
        <body>
          <div class="statement-container">
            <div class="statement-header">
              <div>
                <h1>💰 WALLET STATEMENT</h1>
                <div class="sub">IRYAX Workspace • Wallet Report</div>
              </div>
              <div class="wallet-id">#${walletId}</div>
            </div>
            <div class="statement-body">
              <div class="summary-grid">
                <div class="summary-card">
                  <div class="label">Balance</div>
                  <div class="value green">${formatCurrency(wallet.balance || 0)}</div>
                </div>
                <div class="summary-card">
                  <div class="label">Total Earned</div>
                  <div class="value blue">${formatCurrency(wallet.totalEarned || 0)}</div>
                </div>
                <div class="summary-card">
                  <div class="label">Transactions</div>
                  <div class="value purple">${(wallet.transactions || []).length + (wallet.withdrawals || []).length}</div>
                </div>
              </div>

              <div class="owner-info">
                <div class="field">
                  <span class="label">Owner Name</span>
                  <span class="value">${ownerName}</span>
                </div>
                <div class="field">
                  <span class="label">Email</span>
                  <span class="value">${ownerEmail}</span>
                </div>
                <div class="field">
                  <span class="label">Mobile</span>
                  <span class="value">${ownerMobile}</span>
                </div>
                <div class="field">
                  <span class="label">Wallet ID</span>
                  <span class="value" style="font-family:monospace;font-size:12px;">${wallet._id}</span>
                </div>
              </div>

              <h4 style="margin-bottom:16px;color:#0f172a;font-size:16px;">Transaction History</h4>
              
              ${(wallet.transactions || []).length === 0 && (wallet.withdrawals || []).length === 0 ? `
                <p style="text-align:center;color:#94a3b8;padding:40px 0;">No transactions found</p>
              ` : `
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Description</th>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${(wallet.transactions || []).map(t => `
                      <tr>
                        <td>${formatDate(t.createdAt)} ${formatTime(t.createdAt)}</td>
                        <td>${t.description || 'N/A'}</td>
                        <td><span class="badge ${t.type}">${t.type.toUpperCase()}</span></td>
                        <td class="text-amount ${t.type}">${formatCurrency(t.amount)}</td>
                        <td>—</td>
                      </tr>
                    `).join('')}
                    ${(wallet.withdrawals || []).map(w => {
                      const statusBadge = getWithdrawalStatusBadge(w.status);
                      return `
                        <tr>
                          <td>${formatDate(w.createdAt)} ${formatTime(w.createdAt)}</td>
                          <td>${w.description || 'Withdrawal'}</td>
                          <td><span class="badge debit">DEBIT</span></td>
                          <td class="text-amount debit">${formatCurrency(w.amount)}</td>
                          <td><span class="badge ${w.status}">${w.status.toUpperCase()}</span></td>
                        </tr>
                      `;
                    }).join('')}
                  </tbody>
                </table>
              `}
            </div>
            <div class="footer">
              Generated by <strong>IRYAX Workspace</strong> • System generated statement
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
        win.document.write(statementHTML);
        win.document.close();
        win.focus();
        toast.success('Statement opened! Click Print to save as PDF.');
      } else {
        toast.error('Please allow popups to download statement');
      }
    } catch (error) {
      console.error('Statement download error:', error);
      toast.error('Failed to generate statement');
    }
  };

  const exportToExcel = () => {
    try {
      if (filteredWallets.length === 0) {
        toast.warning("No wallets to export");
        return;
      }

      const exportData = filteredWallets.map((wallet, index) => ({
        'S.No': index + 1,
        'Owner Name': wallet.ownerId?.name || 'N/A',
        'Email': wallet.ownerId?.email || 'N/A',
        'Mobile': wallet.ownerId?.mobile || 'N/A',
        'Balance': wallet.balance || 0,
        'Total Earned': wallet.totalEarned || 0,
        'Transactions': (wallet.transactions || []).length,
        'Withdrawals': (wallet.withdrawals || []).length,
        'Wallet ID': wallet._id,
        'Created': wallet.createdAt ? formatDate(wallet.createdAt) : 'N/A'
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      ws['!cols'] = [
        { wch: 6 }, { wch: 20 }, { wch: 25 }, { wch: 15 },
        { wch: 12 }, { wch: 12 }, { wch: 10 }, { wch: 10 },
        { wch: 25 }, { wch: 12 }
      ];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Wallets');
      
      const date = new Date().toISOString().split('T')[0];
      XLSX.writeFile(wb, `wallets_${date}.xlsx`);
      
      toast.success(`Exported ${filteredWallets.length} wallets to Excel!`);
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export");
    }
  };

  const filteredWallets = wallets.filter((wallet) => {
    const ownerName = wallet.ownerId?.name?.toLowerCase() || "";
    const ownerEmail = wallet.ownerId?.email?.toLowerCase() || "";
    const ownerMobile = wallet.ownerId?.mobile || "";
    const walletId = wallet._id?.toLowerCase() || "";
    
    const matchesSearch =
      ownerName.includes(searchTerm.toLowerCase()) ||
      ownerEmail.includes(searchTerm.toLowerCase()) ||
      ownerMobile.includes(searchTerm) ||
      walletId.includes(searchTerm.toLowerCase());
    
    if (filterType === "hasBalance") {
      return matchesSearch && (wallet.balance || 0) > 0;
    } else if (filterType === "zeroBalance") {
      return matchesSearch && (wallet.balance || 0) === 0;
    } else if (filterType === "hasTransactions") {
      return matchesSearch && ((wallet.transactions || []).length > 0 || (wallet.withdrawals || []).length > 0);
    }
    
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="admin-dash">
        <AdminNavbar />
        <div className="admin-dash__loading">
          <div className="admin-dash__spinner" />
          <p className="admin-dash__loading-text">Loading wallets...</p>
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
              All <span>Wallets</span>
            </h1>
            <p className="admin-dash__subtitle">
              Manage and track all user wallets and transactions.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-grow sm:flex-grow-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search by name, email, wallet ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all w-full sm:w-64"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all w-full sm:w-auto"
            >
              <option value="all">All Wallets</option>
              <option value="hasBalance">Has Balance</option>
              <option value="zeroBalance">Zero Balance</option>
              <option value="hasTransactions">Has Transactions</option>
            </select>

            {filteredWallets.length > 0 && (
              <button
                onClick={exportToExcel}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors w-full sm:w-auto"
              >
                <Download size={16} />
                Export Excel
              </button>
            )}

            <button
              onClick={fetchWallets}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors w-full sm:w-auto"
            >
              <RefreshCw size={16} />
              Refresh
            </button>

            {(searchTerm || filterType !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterType("all");
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
                {filteredWallets.length} <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest ml-1">Wallets</span>
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-4 text-white shadow-lg shadow-indigo-500/25">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[8px] font-bold uppercase tracking-wider text-indigo-200">Total Wallets</p>
                <p className="text-2xl font-bold">{stats.totalWallets}</p>
              </div>
              <div className="bg-white/20 p-2 rounded-xl">
                <Wallet size={20} className="text-white" />
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-white/20 flex justify-between text-[10px]">
              <span className="text-indigo-200">Total Balance</span>
              <span className="font-semibold">{formatCurrency(stats.totalBalance)}</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm text-center">
            <p className="text-[8px] font-bold uppercase tracking-wider text-emerald-600">Active Wallets</p>
            <p className="text-2xl font-bold text-emerald-600">{stats.activeWallets}</p>
            <p className="text-[8px] text-slate-400 mt-1">With balance &gt; 0</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm text-center">
            <p className="text-[8px] font-bold uppercase tracking-wider text-amber-600">Total Earned</p>
            <p className="text-2xl font-bold text-amber-600">{formatCurrency(stats.totalEarned)}</p>
            <p className="text-[8px] text-slate-400 mt-1">All credits</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm text-center">
            <p className="text-[8px] font-bold uppercase tracking-wider text-purple-600">Transactions</p>
            <p className="text-2xl font-bold text-purple-600">{stats.totalTransactions}</p>
            <p className="text-[8px] text-slate-400 mt-1">Total transactions</p>
          </div>
        </div>

        {filteredWallets.length === 0 ? (
          <div className="admin-dash__error" style={{ background: '#f8fafc', borderColor: '#e2e8f0' }}>
            <Wallet size={48} className="text-slate-300 mb-4" />
            <p className="admin-dash__error-title" style={{ color: '#475569' }}>No wallets found</p>
            <p className="admin-dash__error-message">We couldn't find any wallets matching your search criteria.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Owner</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Balance</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Total Earned</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Transactions</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Wallet ID</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredWallets.map((wallet) => {
                    const ownerName = wallet.ownerId?.name || 'N/A';
                    const ownerEmail = wallet.ownerId?.email || 'N/A';
                    const ownerMobile = wallet.ownerId?.mobile || 'N/A';
                    const totalTransactions = (wallet.transactions || []).length + (wallet.withdrawals || []).length;
                    const hasBalance = (wallet.balance || 0) > 0;
                    
                    return (
                      <tr key={wallet._id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-semibold text-slate-800 text-sm">
                              {ownerName}
                            </p>
                            <p className="text-xs text-slate-500">{ownerEmail}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            <Phone size={14} className="text-indigo-400" />
                            <span className="font-medium text-slate-700 text-sm">{ownerMobile}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className={`font-bold text-sm ${hasBalance ? 'text-emerald-600' : 'text-slate-400'}`}>
                              {formatCurrency(wallet.balance || 0)}
                            </span>
                            {!hasBalance && (
                              <span className="text-[8px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">Zero</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-bold text-indigo-600 text-sm">
                            {formatCurrency(wallet.totalEarned || 0)}
                          </p>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            <CreditCard size={14} className="text-purple-400" />
                            <span className="font-semibold text-slate-700 text-sm">
                              {totalTransactions}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-mono text-[10px] text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                            {wallet._id.slice(-8)}
                          </p>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center gap-1.5 flex-wrap">
                            <button
                              onClick={() => handleViewDetails(wallet)}
                              className="p-1.5 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                              title="View Details"
                            >
                              <Eye size={15} />
                            </button>
                            
                            <button
                              onClick={() => downloadWalletStatement(wallet)}
                              className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
                              title="Download Statement"
                            >
                              <FileDown size={15} />
                            </button>
                            
                            <button
                              onClick={() => {
                                setDeleteWallet(wallet);
                                setShowDeleteModal(true);
                              }}
                              className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                              title="Delete Wallet"
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

      {/* Wallet Detail Modal */}
      {showDetailModal && selectedWallet && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={(e) => {
          if (e.target === e.currentTarget) setShowDetailModal(false);
        }}>
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
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
                  <Wallet size={20} color="#fff" />
                </div>
                <div>
                  <h3 style={{ margin: 0, color: "#fff", fontSize: "1rem", fontWeight: 700 }}>
                    Wallet Details
                  </h3>
                  <p style={{ margin: 0, color: "rgba(255,255,255,0.8)", fontSize: "0.75rem" }}>
                    #{selectedWallet._id.slice(-8)}
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
                <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                  <p className="text-xs font-medium text-indigo-600 uppercase tracking-wider">👤 Owner</p>
                  <p className="font-semibold text-slate-800 text-lg mt-1">
                    {selectedWallet.ownerId?.name || 'N/A'}
                  </p>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <p className="text-sm text-slate-600 flex items-center gap-1">
                      <span className="font-medium">Email:</span> {selectedWallet.ownerId?.email || 'N/A'}
                    </p>
                    <p className="text-sm text-slate-600 flex items-center gap-1">
                      <Phone size={14} className="text-indigo-500" />
                      {selectedWallet.ownerId?.mobile || 'N/A'}
                    </p>
                    {selectedWallet.ownerId?.address && (
                      <p className="text-sm text-slate-600 flex items-center gap-1 col-span-2">
                        <MapPin size={14} className="text-indigo-500" />
                        {selectedWallet.ownerId.address}
                      </p>
                    )}
                  </div>
                </div>

                {/* Balance Summary */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200 text-center">
                    <p className="text-[8px] font-bold text-emerald-600 uppercase tracking-wider">Balance</p>
                    <p className="text-2xl font-bold text-emerald-600">
                      {formatCurrency(selectedWallet.balance || 0)}
                    </p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 text-center">
                    <p className="text-[8px] font-bold text-blue-600 uppercase tracking-wider">Total Earned</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatCurrency(selectedWallet.totalEarned || 0)}
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4 border border-purple-200 text-center">
                    <p className="text-[8px] font-bold text-purple-600 uppercase tracking-wider">Transactions</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {(selectedWallet.transactions || []).length + (selectedWallet.withdrawals || []).length}
                    </p>
                  </div>
                </div>

                {/* Transactions */}
                <div>
                  <h4 className="text-sm font-bold text-slate-700 mb-3">📊 Transaction History</h4>
                  {(selectedWallet.transactions || []).length === 0 && (selectedWallet.withdrawals || []).length === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-sm bg-slate-50 rounded-xl">
                      No transactions found
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {/* Credit Transactions */}
                      {(selectedWallet.transactions || []).map((t, idx) => {
                        const typeBadge = getTransactionTypeBadge(t.type);
                        return (
                          <div key={idx} className="bg-slate-50 rounded-xl p-3 flex items-center justify-between hover:bg-slate-100 transition-colors">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className={`p-1.5 rounded-lg ${t.type === 'credit' ? 'bg-emerald-100' : 'bg-red-100'}`}>
                                {t.type === 'credit' ? <ArrowUpRight size={14} className="text-emerald-600" /> : <ArrowDownRight size={14} className="text-red-600" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-800 truncate">{t.description || 'Transaction'}</p>
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                  <span>{t.cabinName || 'N/A'}</span>
                                  <span>•</span>
                                  <span>{t.customerName || 'N/A'}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className={`font-bold ${t.type === 'credit' ? 'text-emerald-600' : 'text-red-600'}`}>
                                {t.type === 'credit' ? '+' : '-'}{formatCurrency(t.amount)}
                              </p>
                              <p className="text-[10px] text-slate-400">{formatDate(t.createdAt)}</p>
                            </div>
                          </div>
                        );
                      })}

                      {/* Withdrawals */}
                      {(selectedWallet.withdrawals || []).map((w, idx) => {
                        const statusBadge = getWithdrawalStatusBadge(w.status);
                        return (
                          <div key={`wd-${idx}`} className="bg-red-50 rounded-xl p-3 flex items-center justify-between hover:bg-red-100 transition-colors border border-red-100">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="p-1.5 rounded-lg bg-red-200">
                                <ArrowDownRight size={14} className="text-red-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-800 truncate">{w.description || 'Withdrawal'}</p>
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                  <span>Bank: {w.bankName || 'N/A'}</span>
                                  <span>•</span>
                                  <span>IFSC: {w.ifscCode || 'N/A'}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-red-600">-{formatCurrency(w.amount)}</p>
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${statusBadge.color}`}>
                                {statusBadge.icon}
                                {statusBadge.label}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deleteWallet && (
        <div className="fixed inset-0 z-[1300] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowDeleteModal(false);
            setDeleteWallet(null);
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
                    Delete Wallet
                  </h3>
                  <p style={{ margin: 0, color: "rgba(255,255,255,0.8)", fontSize: "0.75rem" }}>
                    {deleteWallet.ownerId?.name || 'Wallet'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteWallet(null);
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
                    <span style={{ color: "#64748b", fontSize: "0.875rem" }}>Wallet</span>
                    <span style={{ fontWeight: 600, color: "#1e293b" }}>
                      #{deleteWallet._id.slice(-8)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: "#64748b", fontSize: "0.875rem" }}>Owner</span>
                    <span style={{ fontWeight: 600, color: "#1e293b" }}>
                      {deleteWallet.ownerId?.name || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: "#64748b", fontSize: "0.875rem" }}>Balance</span>
                    <span style={{ fontWeight: 600, color: "#1e293b" }}>
                      {formatCurrency(deleteWallet.balance || 0)}
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
                <span>Deleting this wallet will permanently remove all associated data including transactions.</span>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={handleDeleteWallet}
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
                    setDeleteWallet(null);
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

export default AllWallets;