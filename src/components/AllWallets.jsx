// AllWallets.jsx - Complete with Organization Name & GST in Invoice (Redesigned)
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
  X,
  Download,
  RefreshCw,
  FileDown,
  Trash2,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
  Building2,
  User,
  Mail,
  History,
  DollarSign,
  XCircle as XCircleIcon,
  Home,
  Users,
  TrendingUp,
  Search
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AdminNavbar from "./AdminNavbar";
import * as XLSX from 'xlsx';
import "./Dashboard.css";

const API_URL = "https://spaceapi.iryax.com";

const AllWallets = () => {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const [filterHasBalance, setFilterHasBalance] = useState("all");
  const [filterOwnerName, setFilterOwnerName] = useState("");
  const [filterOrganization, setFilterOrganization] = useState("");
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

  const getTransactionTypeBadge = (type) => {
    if (type === 'credit') {
      return {
        label: 'Credit',
        color: 'bg-emerald-100 text-emerald-700',
        icon: <ArrowUpRight size={12} className="text-emerald-500" />
      };
    }
    return {
      label: 'Debit',
      color: 'bg-red-100 text-red-700',
      icon: <ArrowDownRight size={12} className="text-red-500" />
    };
  };

  const getWithdrawalStatusBadge = (status) => {
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
      rejected: {
        label: 'Rejected',
        color: 'bg-red-100 text-red-700',
        icon: <XCircle size={12} className="text-red-500" />
      }
    };
    return statusMap[status?.toLowerCase()] || {
      label: status || 'Unknown',
      color: 'bg-gray-100 text-gray-700',
      icon: <AlertCircle size={12} className="text-gray-500" />
    };
  };

  const clearFilters = () => {
    setFilterType("all");
    setFilterHasBalance("all");
    setFilterOwnerName("");
    setFilterOrganization("");
  };

  const filteredWallets = wallets.filter((wallet) => {
    const ownerName = wallet.ownerId?.name?.toLowerCase() || "";
    const organization = wallet.ownerId?.organizationName?.toLowerCase() || "";
    
    const matchesType = filterType === "all" || 
                       (filterType === "hasBalance" && (wallet.balance || 0) > 0) ||
                       (filterType === "zeroBalance" && (wallet.balance || 0) === 0);
    
    const matchesHasBalance = filterHasBalance === "all" ||
                             (filterHasBalance === "hasBalance" && (wallet.balance || 0) > 0) ||
                             (filterHasBalance === "zeroBalance" && (wallet.balance || 0) === 0);
    
    const matchesOwnerName = filterOwnerName === "" || ownerName.includes(filterOwnerName.toLowerCase());
    const matchesOrganization = filterOrganization === "" || organization.includes(filterOrganization.toLowerCase());
    
    return matchesType && matchesHasBalance && matchesOwnerName && matchesOrganization;
  });

  const handleViewDetails = (wallet) => {
    setSelectedWallet(wallet);
    setShowDetailModal(true);
  };

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
        const updatedWallets = wallets.filter(w => w._id !== deleteWallet._id);
        setWallets(updatedWallets);
        
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

  // ======================
  // PROFESSIONAL WALLET INVOICE
  // ======================
  const downloadWalletStatement = (wallet) => {
    try {
      const ownerName = wallet.ownerId?.name || 'N/A';
      const ownerEmail = wallet.ownerId?.email || 'N/A';
      const ownerMobile = wallet.ownerId?.mobile || 'N/A';
      const ownerAddress = wallet.ownerId?.address || 'N/A';
      const ownerOrganization = wallet.ownerId?.organizationName || 'IRYAX Workspace';
      const ownerGst = wallet.ownerId?.gstNumber || 'N/A';
      const walletId = wallet._id.slice(-8).toUpperCase();
      const today = formatDateDDMMYYYY(new Date());

      const fmtDate = (d) => {
        if (!d) return 'N/A';
        return formatDateDDMMYYYY(d);
      };

      const fmtCurrency = (amount) => {
        return `₹${(amount || 0).toLocaleString('en-IN')}`;
      };

      const win = window.open('', '_blank', 'width=900,height=700');
      if (win) {
        win.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <title>Invoice #${walletId}</title>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { font-family: 'Times New Roman', 'Georgia', serif; background: #ffffff; padding: 40px; display: flex; justify-content: center; min-height: 100vh; color: #000000; }
              .invoice-container { max-width: 900px; width: 100%; background: #ffffff; border: 2px solid #000000; padding: 40px 45px; }
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
              .summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 25px; padding-bottom: 20px; border-bottom: 1px solid #cccccc; }
              .summary-card { text-align: center; padding: 12px; border: 1px solid #e0e0e0; border-radius: 4px; }
              .summary-card .label { font-size: 9px; text-transform: uppercase; letter-spacing: 0.06em; color: #666666; font-weight: 700; }
              .summary-card .value { font-size: 22px; font-weight: 700; color: #000000; margin-top: 4px; }
              .summary-card .value.green { color: #059669; }
              .summary-card .value.blue { color: #1a56db; }
              .summary-card .value.purple { color: #7c3aed; }
              .transaction-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
              .transaction-table thead { border-top: 2px solid #000000; border-bottom: 2px solid #000000; }
              .transaction-table thead th { padding: 10px 12px; text-align: left; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #000000; }
              .transaction-table thead th:last-child { text-align: right; }
              .transaction-table tbody td { padding: 10px 12px; font-size: 12px; color: #000000; border-bottom: 1px solid #eeeeee; }
              .transaction-table tbody td:last-child { text-align: right; font-weight: 600; }
              .badge { display: inline-block; padding: 2px 10px; border-radius: 12px; font-size: 10px; font-weight: 600; }
              .badge.credit { background: #d1fae5; color: #065f46; }
              .badge.debit { background: #fee2e2; color: #991b1b; }
              .badge.pending { background: #fef3c7; color: #92400e; }
              .badge.completed { background: #d1fae5; color: #065f46; }
              .badge.rejected { background: #fee2e2; color: #991b1b; }
              .totals { margin-top: 20px; padding-top: 20px; border-top: 2px solid #000000; display: flex; justify-content: flex-end; }
              .totals-box { width: 320px; }
              .totals-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; color: #333333; }
              .totals-row.total { font-size: 20px; font-weight: 700; color: #000000; border-top: 2px solid #000000; padding-top: 12px; margin-top: 6px; }
              .footer { text-align: center; padding-top: 25px; margin-top: 25px; border-top: 2px solid #000000; }
              .footer .powered { font-size: 14px; font-weight: 700; letter-spacing: 2px; color: #1a56db; }
              .footer .sub { font-size: 10px; color: #666666; margin-top: 4px; }
              .print-btn { position: fixed; bottom: 30px; right: 30px; padding: 14px 28px; background: #000000; color: #ffffff; border: none; border-radius: 4px; font-weight: 600; font-size: 13px; cursor: pointer; box-shadow: 0 4px 20px rgba(0,0,0,0.15); display: flex; align-items: center; gap: 10px; font-family: 'Segoe UI', Arial, sans-serif; letter-spacing: 0.5px; }
              .print-btn:hover { background: #222222; }
              @media print { body { background: white; padding: 20px; } .invoice-container { border: 1px solid #000000; padding: 30px; } .print-btn { display: none !important; } }
              @media (max-width: 640px) { body { padding: 20px; } .invoice-container { padding: 25px; } .invoice-header { flex-direction: column; text-align: center; gap: 15px; } .invoice-number { text-align: center; } .info-grid { grid-template-columns: 1fr; gap: 15px; } .summary-grid { grid-template-columns: 1fr; } .totals { justify-content: center; } .totals-box { width: 100%; } }
            </style>
          </head>
          <body>
            <div class="invoice-container">
              <div class="invoice-header">
                <div class="brand"><h1>${ownerOrganization.toUpperCase()}</h1><div class="gst">GST: ${ownerGst}</div><div class="address-line">${ownerAddress}</div></div>
                <div class="invoice-number"><div class="label">Invoice</div><div class="number">#${walletId}</div><div class="date">${today}</div></div>
              </div>
              <div class="info-grid">
                <div><div class="title">Account Holder</div><div class="value">${ownerName}</div><div class="value-small">${ownerEmail}</div><div class="value-small">${ownerMobile}</div></div>
                <div><div class="title">Wallet Details</div><div class="value">Wallet ID</div><div class="value-small" style="font-family:monospace;">${wallet._id}</div><div class="value-small" style="margin-top:4px;">Created: ${formatDateTimeDDMMYYYY(wallet.createdAt)}</div></div>
              </div>
              <div class="summary-grid">
                <div class="summary-card"><div class="label">Current Balance</div><div class="value green">${fmtCurrency(wallet.balance)}</div></div>
                <div class="summary-card"><div class="label">Total Earned</div><div class="value blue">${fmtCurrency(wallet.totalEarned)}</div></div>
                <div class="summary-card"><div class="label">Transactions</div><div class="value purple">${(wallet.transactions || []).length + (wallet.withdrawals || []).length}</div></div>
              </div>
              <h4 style="font-size:14px;font-weight:700;margin-bottom:12px;color:#000000;">Transaction History</h4>
              ${(wallet.transactions || []).length === 0 && (wallet.withdrawals || []).length === 0 ? `
                <p style="text-align:center;color:#999999;padding:30px 0;font-size:14px;">No transactions found</p>
              ` : `
                <table class="transaction-table">
                  <thead><tr><th>Date</th><th>Description</th><th>Type</th><th>Amount</th><th>Status</th></tr></thead>
                  <tbody>
                    ${(wallet.transactions || []).map(t => `
                      <tr>
                        <td style="font-size:11px;">${fmtDate(t.createdAt)}<br><span style="color:#999999;font-size:10px;">${new Date(t.createdAt).toLocaleTimeString('en-IN', {hour:'2-digit',minute:'2-digit'})}</span></td>
                        <td><span style="font-weight:600;">${t.description || 'Transaction'}</span>${t.cabinName ? `<br><span style="font-size:10px;color:#666666;">🏢 ${t.cabinName}</span>` : ''}</td>
                        <td><span class="badge credit">CREDIT</span></td>
                        <td style="color:#059669;font-weight:600;">+${fmtCurrency(t.amount)}</td>
                        <td>—</td>
                      </tr>
                    `).join('')}
                    ${(wallet.withdrawals || []).map(w => {
                      const statusBadge = getWithdrawalStatusBadge(w.status);
                      return `
                        <tr>
                          <td style="font-size:11px;">${fmtDate(w.createdAt)}<br><span style="color:#999999;font-size:10px;">${new Date(w.createdAt).toLocaleTimeString('en-IN', {hour:'2-digit',minute:'2-digit'})}</span></td>
                          <td><span style="font-weight:600;">${w.description || 'Withdrawal'}</span>${w.bankName ? `<br><span style="font-size:10px;color:#666666;">🏦 ${w.bankName}</span>` : ''}</td>
                          <td><span class="badge debit">DEBIT</span></td>
                          <td style="color:#dc2626;font-weight:600;">-${fmtCurrency(w.amount)}</td>
                          <td><span class="badge ${w.status}">${w.status.toUpperCase()}</span></td>
                        </tr>
                      `;
                    }).join('')}
                  </tbody>
                </table>
              `}
              <div class="totals"><div class="totals-box"><div class="totals-row"><span>Total Credits</span><span style="color:#059669;font-weight:600;">${fmtCurrency(wallet.totalEarned)}</span></div><div class="totals-row"><span>Total Debits</span><span style="color:#dc2626;font-weight:600;">${fmtCurrency((wallet.withdrawals || []).reduce((sum, w) => sum + w.amount, 0))}</span></div><div class="totals-row total"><span>Net Balance</span><span style="color:#059669;">${fmtCurrency(wallet.balance)}</span></div></div></div>
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
      toast.error('Failed to generate invoice: ' + error.message);
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
        'Organization': wallet.ownerId?.organizationName || 'N/A',
        'GST Number': wallet.ownerId?.gstNumber || 'N/A',
        'Email': wallet.ownerId?.email || 'N/A',
        'Mobile': wallet.ownerId?.mobile || 'N/A',
        'Address': wallet.ownerId?.address || 'N/A',
        'Balance': wallet.balance || 0,
        'Total Earned': wallet.totalEarned || 0,
        'Transactions': (wallet.transactions || []).length,
        'Withdrawals': (wallet.withdrawals || []).length,
        'Total Transactions': (wallet.transactions || []).length + (wallet.withdrawals || []).length,
        'Created': wallet.createdAt ? formatDateDDMMYYYY(wallet.createdAt) : 'N/A'
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
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

  if (loading) {
    return (
      <div className="admin-dash" style={{ backgroundColor: '#ffffff' }}>
        <AdminNavbar />
        <div className="flex flex-col justify-center items-center h-64 gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-200 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="text-sm font-medium text-gray-500">Loading wallet data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dash" style={{ backgroundColor: '#ffffff' }}>
      <AdminNavbar />

      <div className="pt-24 px-3 sm:px-4 md:px-6 lg:px-8 max-w-full mx-auto pb-16">
        {/* Header */}
        <div className="user-visits__header">
          <div>
            <h1 className="user-visits__greeting">
              All <span>Wallets</span>
            </h1>
            <p className="user-visits__subtitle">Manage and monitor all user wallets</p>
          </div>
          <div className="flex items-center gap-2">
            {filteredWallets.length > 0 && (
              <button
                onClick={exportToExcel}
                className="user-visits__btn user-visits__btn--primary"
              >
                <Download size={14} />
                Export
              </button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
          <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl p-5 text-white shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 hover:-translate-y-1 cursor-pointer" onClick={() => clearFilters()}>
            <div className="flex items-center gap-2 mb-2">
              <Wallet size={16} className="text-purple-200" />
              <p className="text-[10px] font-bold uppercase tracking-wider text-purple-200">Total Wallets</p>
            </div>
            <p className="text-2xl sm:text-3xl font-bold">{stats.totalWallets}</p>
            <div className="mt-3 pt-2 border-t border-white/20 flex justify-between text-[10px]">
              <span className="text-purple-200">Registered</span>
              <span className="font-semibold">User Wallets</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer" onClick={() => setFilterHasBalance("hasBalance")}>
            <div className="flex items-center gap-2 mb-2">
              <CreditCard size={16} className="text-emerald-500" />
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Total Balance</p>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-emerald-600">{formatCurrency(stats.totalBalance)}</p>
            <div className="mt-3 pt-2 border-t border-gray-100 flex justify-between text-[10px]">
              <span className="text-gray-500">Current</span>
              <span className="font-semibold text-gray-900">Balance</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer" onClick={() => setFilterHasBalance("hasBalance")}>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle size={16} className="text-blue-500" />
              <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Active Wallets</p>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-blue-600">{stats.activeWallets}</p>
            <div className="mt-3 pt-2 border-t border-gray-100 flex justify-between text-[10px]">
              <span className="text-gray-500">With</span>
              <span className="font-semibold text-gray-900">Balance</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={16} className="text-amber-500" />
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Total Earned</p>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-amber-600">{formatCurrency(stats.totalEarned)}</p>
            <div className="mt-3 pt-2 border-t border-gray-100 flex justify-between text-[10px]">
              <span className="text-gray-500">Lifetime</span>
              <span className="font-semibold text-gray-900">Earnings</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-2 mb-2">
              <History size={16} className="text-violet-500" />
              <p className="text-[10px] font-bold uppercase tracking-wider text-violet-600">Transactions</p>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-violet-600">{stats.totalTransactions}</p>
            <div className="mt-3 pt-2 border-t border-gray-100 flex justify-between text-[10px]">
              <span className="text-gray-500">Credits &</span>
              <span className="font-semibold text-gray-900">Withdrawals</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-2xl p-4 mb-6 border border-gray-200 shadow-sm">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by owner or organization..."
                  value={filterOwnerName}
                  onChange={(e) => setFilterOwnerName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 bg-white"
                />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2.5 text-xs border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 bg-white"
              >
                <option value="all">All Types</option>
                <option value="hasBalance">Has Balance</option>
                <option value="zeroBalance">Zero Balance</option>
              </select>
              {(filterOwnerName || filterType !== 'all') && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-200"
                >
                  <XCircleIcon size={14} /> Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <h3 className="text-sm font-bold text-gray-800">Wallet List</h3>
              <span className="px-2.5 py-0.5 text-xs font-bold text-indigo-700 bg-indigo-100 rounded-full">
                {filteredWallets.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={fetchWallets} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-200 hover:scale-105 active:scale-95">
                <RefreshCw size={13} /> Refresh
              </button>
              {filteredWallets.length > 0 && (
                <button onClick={exportToExcel} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm shadow-indigo-500/25">
                  <Download size={13} /> Export Excel
                </button>
              )}
            </div>
          </div>

          {/* Table Container */}
          <div className="p-0 overflow-x-auto">
            {filteredWallets.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-20 text-gray-400">
                <Wallet size={48} className="opacity-20" />
                <p className="text-lg font-medium">No wallets found</p>
                <p className="text-sm">Try adjusting your filters.</p>
              </div>
            ) : (
              <table className="w-full min-w-[900px] text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-100" style={{ backgroundColor: '#f9fafb' }}>
                    <th className="p-3 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">#</th>
                    <th className="p-3 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Owner</th>
                    <th className="p-3 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Contact</th>
                    <th className="p-3 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Balance</th>
                    <th className="p-3 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Earned</th>
                    <th className="p-3 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Txns</th>
                    <th className="p-3 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredWallets.map((wallet, idx) => {
                    const ownerName = wallet.ownerId?.name || 'N/A';
                    const ownerEmail = wallet.ownerId?.email || 'N/A';
                    const ownerMobile = wallet.ownerId?.mobile || 'N/A';
                    const ownerOrganization = wallet.ownerId?.organizationName || '';
                    const totalTransactions = (wallet.transactions || []).length + (wallet.withdrawals || []).length;
                    const hasBalance = (wallet.balance || 0) > 0;
                    
                    return (
                      <tr key={wallet._id} className="transition-colors hover:bg-gray-50/80">
                        <td className="p-3"><span className="text-xs font-semibold text-gray-400">#{idx + 1}</span></td>
                        <td className="p-3">
                          <div>
                            <p className="font-semibold text-gray-800 text-xs">{ownerName}</p>
                            {ownerOrganization && (
                              <p className="text-[10px] text-indigo-600 flex items-center gap-1 mt-0.5">
                                <Building2 size={10} />
                                {ownerOrganization}
                              </p>
                            )}
                            <p className="text-[9px] text-gray-400 flex items-center gap-1 mt-0.5">
                              <Mail size={8} className="text-gray-400" />
                              {ownerEmail}
                            </p>
                          </div>
                        </td>
                        <td className="p-3">
                          <div>
                            <p className="text-xs text-gray-700 flex items-center gap-1.5">
                              <Phone size={12} className="text-gray-400" />
                              {ownerMobile}
                            </p>
                            {wallet.ownerId?.address && (
                              <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                                <MapPin size={8} className="text-gray-400" />
                                <span className="truncate max-w-[120px]">{wallet.ownerId.address}</span>
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="p-3">
                          <span className={`text-xs font-bold ${hasBalance ? 'text-emerald-600' : 'text-gray-400'}`}>
                            {formatCurrency(wallet.balance || 0)}
                          </span>
                          {!hasBalance && (
                            <span className="ml-1 text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">Zero</span>
                          )}
                        </td>
                        <td className="p-3">
                          <span className="text-xs font-bold text-indigo-600">{formatCurrency(wallet.totalEarned || 0)}</span>
                        </td>
                        <td className="p-3">
                          <span className="text-xs font-semibold flex items-center gap-1 text-gray-700">
                            <History size={12} className="text-purple-400" />
                            {totalTransactions}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleViewDetails(wallet)}
                              className="flex items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
                              title="View Details"
                            >
                              <Eye size={11} /> View
                            </button>
                            <button
                              onClick={() => downloadWalletStatement(wallet)}
                              className="flex items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                              title="Download Statement"
                            >
                              <FileDown size={11} /> Inv
                            </button>
                            <button
                              onClick={() => { setDeleteWallet(wallet); setShowDeleteModal(true); }}
                              className="flex items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] font-medium bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                              title="Delete Wallet"
                            >
                              <Trash2 size={11} />
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
          {!loading && filteredWallets.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-100 rounded-b-2xl flex flex-wrap items-center justify-between gap-2 bg-gray-50">
              <span className="text-[10px] text-gray-500">
                Showing <strong>{filteredWallets.length}</strong> of <strong>{wallets.length}</strong> wallets
              </span>
              <div className="flex items-center gap-3 text-[10px] text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Active: {stats.activeWallets}
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  Zero Balance: {stats.zeroBalanceWallets}
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  Total: {stats.totalWallets}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ====================== */}
      {/* WALLET DETAIL MODAL */}
      {/* ====================== */}
      {showDetailModal && selectedWallet && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={(e) => { if (e.target === e.currentTarget) setShowDetailModal(false); }}>
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-gradient-to-br from-indigo-600 via-indigo-600 to-purple-600 text-white p-6 rounded-t-3xl flex justify-between items-center shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <Wallet size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Wallet Details</h3>
                  <p className="text-sm text-indigo-200 font-medium">#{selectedWallet._id.slice(-6).toUpperCase()}</p>
                </div>
              </div>
              <button onClick={() => setShowDetailModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 hover:scale-110">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-5">
              {/* Owner Details */}
              <div className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 hover:border-indigo-200 transition-all duration-200">
                <div className="flex items-center gap-2 mb-3">
                  <User size={16} className="text-indigo-600" />
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Owner Details</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Name</span>
                    <span className="font-semibold text-gray-800">{selectedWallet.ownerId?.name || 'N/A'}</span>
                  </div>
                  {selectedWallet.ownerId?.organizationName && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Organization</span>
                      <span className="font-medium text-gray-800">{selectedWallet.ownerId.organizationName}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500">Email</span>
                    <span className="font-medium text-gray-800">{selectedWallet.ownerId?.email || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Mobile</span>
                    <span className="font-medium text-gray-800">{selectedWallet.ownerId?.mobile || 'N/A'}</span>
                  </div>
                  {selectedWallet.ownerId?.address && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Address</span>
                      <span className="font-medium text-gray-800 truncate max-w-[200px]">{selectedWallet.ownerId.address}</span>
                    </div>
                  )}
                  {selectedWallet.ownerId?.gstNumber && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">GST</span>
                      <span className="font-medium text-gray-800">{selectedWallet.ownerId.gstNumber}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl border border-emerald-200 text-center hover:shadow-md transition-all duration-200">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <Wallet size={14} className="text-emerald-600" />
                    <p className="text-[10px] font-bold text-emerald-600 uppercase">Balance</p>
                  </div>
                  <p className="text-xl font-bold text-emerald-600">{formatCurrency(selectedWallet.balance || 0)}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-200 text-center hover:shadow-md transition-all duration-200">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <TrendingUp size={14} className="text-blue-600" />
                    <p className="text-[10px] font-bold text-blue-600 uppercase">Earned</p>
                  </div>
                  <p className="text-xl font-bold text-blue-600">{formatCurrency(selectedWallet.totalEarned || 0)}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl border border-purple-200 text-center hover:shadow-md transition-all duration-200">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <History size={14} className="text-purple-600" />
                    <p className="text-[10px] font-bold text-purple-600 uppercase">Txns</p>
                  </div>
                  <p className="text-xl font-bold text-purple-600">
                    {(selectedWallet.transactions || []).length + (selectedWallet.withdrawals || []).length}
                  </p>
                </div>
              </div>

              {/* Transactions */}
              <div className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <History size={16} className="text-purple-600" />
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Transaction History</p>
                </div>
                {(selectedWallet.transactions || []).length === 0 && (selectedWallet.withdrawals || []).length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                    <History size={32} className="opacity-20 mb-2" />
                    <p className="text-sm">No transactions found</p>
                  </div>
                ) : (
                  <div className="space-y-2 mt-3 max-h-60 overflow-y-auto">
                    {(selectedWallet.transactions || []).map((t, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-white rounded-xl p-3 border border-gray-200 hover:border-emerald-200 hover:shadow-sm transition-all duration-200">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-800 text-sm truncate">{t.description || 'Transaction'}</p>
                          {t.cabinName && <p className="text-xs text-gray-500 flex items-center gap-1"><Building2 size={10} /> {t.cabinName}</p>}
                        </div>
                        <div className="text-right ml-3">
                          <span className="text-sm font-bold text-emerald-600">+{formatCurrency(t.amount)}</span>
                          <p className="text-[10px] text-gray-400">{formatDateDDMMYYYY(t.createdAt)}</p>
                        </div>
                      </div>
                    ))}
                    {(selectedWallet.withdrawals || []).map((w, idx) => {
                      const statusBadge = getWithdrawalStatusBadge(w.status);
                      return (
                        <div key={`wd-${idx}`} className="flex items-center justify-between bg-gradient-to-r from-red-50 to-red-100/30 rounded-xl p-3 border border-red-200 hover:border-red-300 hover:shadow-sm transition-all duration-200">
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-gray-800 text-sm truncate">{w.description || 'Withdrawal'}</p>
                            {w.bankName && <p className="text-xs text-gray-500 flex items-center gap-1"><Building2 size={10} /> {w.bankName}</p>}
                          </div>
                          <div className="text-right ml-3">
                            <span className="text-sm font-bold text-red-600">-{formatCurrency(w.amount)}</span>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full ${statusBadge.color}`}>
                              {statusBadge.icon} {statusBadge.label}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <button onClick={() => { setShowDetailModal(false); downloadWalletStatement(selectedWallet); }} className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-indigo-500/25 active:scale-[0.98] flex items-center justify-center gap-2">
                  <FileDown size={18} /> Download Statement
                </button>
                <button onClick={() => setShowDetailModal(false)} className="w-full py-3.5 border-2 border-gray-200 rounded-xl text-gray-600 font-bold hover:bg-gray-50 hover:border-gray-300 transition-all duration-200">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================== */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ====================== */}
      {showDeleteModal && deleteWallet && (
        <div className="fixed inset-0 z-[1300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) { setShowDeleteModal(false); setDeleteWallet(null); } }}>
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-red-50 p-5 text-red-900 rounded-t-3xl flex justify-between items-center border-b border-red-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                  <Trash2 size={20} className="text-red-600" />
                </div>
                <div><h3 className="text-xl font-bold">Delete Wallet</h3><p className="text-sm text-red-700">{deleteWallet.ownerId?.name}</p></div>
              </div>
              <button onClick={() => { setShowDeleteModal(false); setDeleteWallet(null); }} className="w-10 h-10 flex items-center justify-center rounded-full bg-red-100 hover:bg-red-200 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-red-50 rounded-xl p-4 space-y-2 text-sm border border-red-200">
                <p className="font-bold text-red-800">Are you sure you want to delete this wallet?</p>
                <div className="space-y-1 text-gray-600">
                  <p><span className="text-gray-500">Wallet:</span> #{deleteWallet._id.slice(-6)}</p>
                  <p><span className="text-gray-500">Owner:</span> {deleteWallet.ownerId?.name || 'N/A'}</p>
                  <p><span className="text-gray-500">Balance:</span> {formatCurrency(deleteWallet.balance || 0)}</p>
                </div>
              </div>
              <div className="bg-amber-50 rounded-xl p-3 text-xs text-amber-700 flex items-start gap-2 border border-amber-200">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>This action cannot be undone. All associated data will be permanently removed.</span>
              </div>
              <div className="flex gap-3">
                <button onClick={handleDeleteWallet} disabled={deleting} className={`flex-1 py-3 rounded-xl text-white font-bold transition ${deleting ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}>
                  {deleting ? 'Deleting...' : 'Confirm Delete'}
                </button>
                <button onClick={() => { setShowDeleteModal(false); setDeleteWallet(null); }} className="px-5 py-3 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllWallets;