// AllWallets.jsx - Complete with Organization Name & GST in Invoice
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
  ArrowDownRight,
  Receipt,
  Building2,
  User,
  Mail,
  History,
  DollarSign
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AdminNavbar from "./AdminNavbar";
import * as XLSX from 'xlsx';
import "./Dashboard.css";

const API_URL = "http://62.72.29.27:5003";

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
  // PROFESSIONAL WALLET INVOICE - With Organization & GST
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
      const today = new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });

      // Format functions for HTML
      const fmtDate = (d) => {
        if (!d) return 'N/A';
        return new Date(d).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });
      };

      const fmtTime = (d) => {
        if (!d) return 'N/A';
        return new Date(d).toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit'
        });
      };

      const fmtDateTime = (d) => {
        if (!d) return 'N/A';
        return new Date(d).toLocaleString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      };

      const fmtCurrency = (amount) => {
        return `₹${(amount || 0).toLocaleString('en-IN')}`;
      };

      const statementHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Invoice #${walletId}</title>
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
              max-width: 900px;
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
            .summary-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 16px;
              margin-bottom: 25px;
              padding-bottom: 20px;
              border-bottom: 1px solid #cccccc;
            }
            .summary-card {
              text-align: center;
              padding: 12px;
              border: 1px solid #e0e0e0;
              border-radius: 4px;
            }
            .summary-card .label {
              font-size: 9px;
              text-transform: uppercase;
              letter-spacing: 0.06em;
              color: #666666;
              font-weight: 700;
            }
            .summary-card .value {
              font-size: 22px;
              font-weight: 700;
              color: #000000;
              margin-top: 4px;
            }
            .summary-card .value.green { color: #059669; }
            .summary-card .value.blue { color: #1a56db; }
            .summary-card .value.purple { color: #7c3aed; }
            .transaction-table {
              width: 100%;
              border-collapse: collapse;
              margin: 15px 0;
            }
            .transaction-table thead {
              border-top: 2px solid #000000;
              border-bottom: 2px solid #000000;
            }
            .transaction-table thead th {
              padding: 10px 12px;
              text-align: left;
              font-size: 9px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.06em;
              color: #000000;
            }
            .transaction-table thead th:last-child {
              text-align: right;
            }
            .transaction-table tbody td {
              padding: 10px 12px;
              font-size: 12px;
              color: #000000;
              border-bottom: 1px solid #eeeeee;
            }
            .transaction-table tbody td:last-child {
              text-align: right;
              font-weight: 600;
            }
            .transaction-table tbody tr:last-child td {
              border-bottom: none;
            }
            .badge {
              display: inline-block;
              padding: 2px 10px;
              border-radius: 12px;
              font-size: 10px;
              font-weight: 600;
            }
            .badge.credit { background: #d1fae5; color: #065f46; }
            .badge.debit { background: #fee2e2; color: #991b1b; }
            .badge.pending { background: #fef3c7; color: #92400e; }
            .badge.completed { background: #d1fae5; color: #065f46; }
            .badge.rejected { background: #fee2e2; color: #991b1b; }
            .totals {
              margin-top: 20px;
              padding-top: 20px;
              border-top: 2px solid #000000;
              display: flex;
              justify-content: flex-end;
            }
            .totals-box { width: 320px; }
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
              .badge { -webkit-print-color-adjust: exact; }
            }
            @media (max-width: 640px) {
              body { padding: 20px; }
              .invoice-container { padding: 25px; }
              .invoice-header { flex-direction: column; text-align: center; gap: 15px; }
              .invoice-number { text-align: center; }
              .info-grid { grid-template-columns: 1fr; gap: 15px; }
              .summary-grid { grid-template-columns: 1fr; }
              .totals { justify-content: center; }
              .totals-box { width: 100%; }
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <div class="invoice-header">
              <div class="brand">
                <h1>${ownerOrganization.toUpperCase()}</h1>
                <div class="gst">GST: ${ownerGst}</div>
                <div class="address-line">${ownerAddress}</div>
              </div>
              <div class="invoice-number">
                <div class="label">Invoice</div>
                <div class="number">#${walletId}</div>
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
                <div class="title">Wallet Details</div>
                <div class="value">Wallet ID</div>
                <div class="value-small" style="font-family:monospace;">${wallet._id}</div>
                <div class="value-small" style="margin-top:4px;">Created: ${fmtDateTime(wallet.createdAt)}</div>
                <div class="value-small">Last Updated: ${fmtDateTime(wallet.updatedAt)}</div>
              </div>
            </div>

            <div class="summary-grid">
              <div class="summary-card">
                <div class="label">Current Balance</div>
                <div class="value green">${fmtCurrency(wallet.balance)}</div>
              </div>
              <div class="summary-card">
                <div class="label">Total Earned</div>
                <div class="value blue">${fmtCurrency(wallet.totalEarned)}</div>
              </div>
              <div class="summary-card">
                <div class="label">Transactions</div>
                <div class="value purple">${(wallet.transactions || []).length + (wallet.withdrawals || []).length}</div>
              </div>
            </div>

            <h4 style="font-size:14px;font-weight:700;margin-bottom:12px;color:#000000;">Transaction History</h4>
            
            ${(wallet.transactions || []).length === 0 && (wallet.withdrawals || []).length === 0 ? `
              <p style="text-align:center;color:#999999;padding:30px 0;font-size:14px;">No transactions found</p>
            ` : `
              <table class="transaction-table">
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
                      <td style="font-size:11px;">${fmtDate(t.createdAt)}<br><span style="color:#999999;font-size:10px;">${fmtTime(t.createdAt)}</span></td>
                      <td>
                        <span style="font-weight:600;">${t.description || 'Transaction'}</span>
                        ${t.cabinName ? `<br><span style="font-size:10px;color:#666666;">🏢 ${t.cabinName}</span>` : ''}
                        ${t.customerName ? `<br><span style="font-size:10px;color:#666666;">👤 ${t.customerName}</span>` : ''}
                      </td>
                      <td><span class="badge ${t.type}">${t.type.toUpperCase()}</span></td>
                      <td class="${t.type === 'credit' ? 'text-green-600' : 'text-red-600'}" style="font-weight:600;">
                        ${t.type === 'credit' ? '+' : '-'}${fmtCurrency(t.amount)}
                      </td>
                      <td>—</td>
                    </tr>
                  `).join('')}
                  ${(wallet.withdrawals || []).map(w => {
                    const statusBadge = getWithdrawalStatusBadge(w.status);
                    return `
                      <tr>
                        <td style="font-size:11px;">${fmtDate(w.createdAt)}<br><span style="color:#999999;font-size:10px;">${fmtTime(w.createdAt)}</span></td>
                        <td>
                          <span style="font-weight:600;">${w.description || 'Withdrawal'}</span>
                          ${w.bankName ? `<br><span style="font-size:10px;color:#666666;">🏦 ${w.bankName} (${w.ifscCode})</span>` : ''}
                        </td>
                        <td><span class="badge debit">DEBIT</span></td>
                        <td style="color:#dc2626;font-weight:600;">-${fmtCurrency(w.amount)}</td>
                        <td><span class="badge ${w.status}">${w.status.toUpperCase()}</span></td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            `}

            <div class="totals">
              <div class="totals-box">
                <div class="totals-row">
                  <span>Total Credits</span>
                  <span style="color:#059669;font-weight:600;">${fmtCurrency(wallet.totalEarned)}</span>
                </div>
                <div class="totals-row">
                  <span>Total Debits</span>
                  <span style="color:#dc2626;font-weight:600;">${fmtCurrency((wallet.withdrawals || []).reduce((sum, w) => sum + w.amount, 0))}</span>
                </div>
                <div class="totals-row total">
                  <span>Net Balance</span>
                  <span style="color:#059669;">${fmtCurrency(wallet.balance)}</span>
                </div>
              </div>
            </div>

            <div class="footer">
              <div class="powered">POWERED BY <span>IRYAX SPACE</span></div>
              <div class="sub">Thank you for choosing ${ownerOrganization}</div>
              <div class="sub" style="margin-top:2px;">This is a system generated invoice</div>
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
        win.document.write(statementHTML);
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
        'Wallet ID': wallet._id,
        'Created': wallet.createdAt ? formatDate(wallet.createdAt) : 'N/A'
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      ws['!cols'] = [
        { wch: 6 }, { wch: 20 }, { wch: 20 }, { wch: 15 },
        { wch: 25 }, { wch: 15 }, { wch: 30 }, { wch: 12 },
        { wch: 12 }, { wch: 10 }, { wch: 10 }, { wch: 10 },
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
                    const ownerOrganization = wallet.ownerId?.organizationName || '';
                    const totalTransactions = (wallet.transactions || []).length + (wallet.withdrawals || []).length;
                    const hasBalance = (wallet.balance || 0) > 0;
                    
                    return (
                      <tr key={wallet._id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-semibold text-slate-800 text-sm">
                              {ownerName}
                            </p>
                            {ownerOrganization && (
                              <p className="text-xs text-indigo-600 font-medium">
                                🏢 {ownerOrganization}
                              </p>
                            )}
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
                            <History size={14} className="text-purple-400" />
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
                              title="Download Invoice"
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
                  <Receipt size={20} color="#fff" />
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
                  {selectedWallet.ownerId?.organizationName && (
                    <p className="text-sm text-indigo-600 font-medium mt-1">
                      🏢 {selectedWallet.ownerId.organizationName}
                    </p>
                  )}
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <p className="text-sm text-slate-600 flex items-center gap-1">
                      <Mail size={14} className="text-indigo-500" />
                      {selectedWallet.ownerId?.email || 'N/A'}
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
                    {selectedWallet.ownerId?.gstNumber && (
                      <p className="text-sm text-slate-600 flex items-center gap-1 col-span-2">
                        <span className="font-medium">GST:</span> {selectedWallet.ownerId.gstNumber}
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
                                  {t.cabinName && <span>🏢 {t.cabinName}</span>}
                                  {t.customerName && <span>• 👤 {t.customerName}</span>}
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
                                  {w.bankName && <span>🏦 {w.bankName}</span>}
                                  {w.ifscCode && <span>• {w.ifscCode}</span>}
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