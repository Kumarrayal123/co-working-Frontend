// MyWallet.jsx - Complete with same UI as DoctorWallet
// Professional design matching ChamberBookings style

import axios from "axios";
import {
  Wallet as WalletIcon,
  IndianRupee,
  Calendar,
  Clock,
  User,
  Phone,
  Building2,
  TrendingUp,
  CreditCard,
  ArrowUpRight,
  Eye,
  Search,
  X,
  Download,
  Banknote,
  AlertCircle,
  History,
  RefreshCw,
  Filter,
  XCircle as XCircleIcon,
  Plus,
  Smartphone,
  Store,
  QrCode,
  FileText,
  Image
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import UsersNavbar from "./UsersNavbar";
import AdminNavbar from "./AdminNavbar";
import * as XLSX from 'xlsx';
import "./Dashboard.css";
import "./UserSiteVisits.css";

const API_URL = "https://spaceapi.iryax.com";

const MyWallet = () => {
  const [wallet, setWallet] = useState({
    balance: 0,
    totalEarned: 0,
    totalTransactions: 0
  });
  const [transactions, setTransactions] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [withdrawStats, setWithdrawStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    failed: 0
  });
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterDate, setFilterDate] = useState("");

  // Withdraw States
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawAccount, setWithdrawAccount] = useState("");
  const [withdrawBank, setWithdrawBank] = useState("");
  const [withdrawIfsc, setWithdrawIfsc] = useState("");
  const [withdrawing, setWithdrawing] = useState(false);

  // Withdrawals View
  const [showWithdrawals, setShowWithdrawals] = useState(false);

  // Withdrawal Detail Modal
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [showWithdrawalDetailModal, setShowWithdrawalDetailModal] = useState(false);

  const isAdmin = localStorage.getItem("admin") !== null;
  const navigate = useNavigate();

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  // Format date to dd/mm/yyyy
  const formatDateDMY = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // ======================
  // GET WALLET
  // ======================
  const fetchWallet = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        navigate("/login");
        return;
      }

      const res = await axios.get(
        `${API_URL}/api/bookings/my-wallet`,
        getAuthHeader()
      );

      if (res.data.success) {
        setWallet(res.data.wallet);
        
        // ✅ FIX: Remove duplicates by using a Map with _id as key
        const transactionMap = new Map();
        (res.data.transactions || []).forEach(t => {
          const key = t._id || t.transactionId || t.createdAt;
          if (!transactionMap.has(key)) {
            transactionMap.set(key, t);
          }
        });
        const uniqueTransactions = Array.from(transactionMap.values());
        
        setTransactions(uniqueTransactions);
        setFilteredTransactions(uniqueTransactions);
      }
    } catch (err) {
      console.error("Error fetching wallet:", err);
      toast.error("Failed to fetch wallet data");
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // GET WITHDRAWALS
  // ======================
  const fetchWithdrawals = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(
        `${API_URL}/api/bookings/withdrawals`,
        getAuthHeader()
      );

      if (res.data.success) {
        // Remove duplicates from withdrawals
        const withdrawalMap = new Map();
        (res.data.withdrawals || []).forEach(w => {
          const key = w._id || w.createdAt;
          if (!withdrawalMap.has(key)) {
            withdrawalMap.set(key, w);
          }
        });
        const uniqueWithdrawals = Array.from(withdrawalMap.values());
        
        setWithdrawals(uniqueWithdrawals);
        setWithdrawStats(res.data.stats || { total: 0, pending: 0, completed: 0, failed: 0 });
      }
    } catch (err) {
      console.error("Error fetching withdrawals:", err);
      toast.error("Failed to fetch withdrawal history");
    }
  };

  // ======================
  // LOAD BOTH APIs ON PAGE LOAD
  // ======================
  useEffect(() => {
    const loadData = async () => {
      await fetchWallet();
      await fetchWithdrawals();
    };
    loadData();
  }, []);

  // Filter Transactions
  useEffect(() => {
    let filtered = transactions;

    if (searchTerm) {
      filtered = filtered.filter(t =>
        t.cabinName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.transactionId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== "all") {
      filtered = filtered.filter(t => t.type === filterType);
    }

    if (filterDate) {
      filtered = filtered.filter(t => t.startDate === filterDate);
    }

    setFilteredTransactions(filtered);
  }, [searchTerm, filterType, filterDate, transactions]);

  const formatCurrency = (amount) => {
    return `₹${amount?.toLocaleString('en-IN') || 0}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return formatDateDMY(dateStr);
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  const getPaymentModeIcon = (mode) => {
    const modes = {
      cash: <Store size={16} className="text-orange-500" />,
      upi: <Smartphone size={16} className="text-purple-500" />,
      card: <CreditCard size={16} className="text-blue-500" />
    };
    return modes[mode] || <CreditCard size={16} className="text-gray-500" />;
  };

  const getPaymentModeLabel = (mode) => {
    const labels = {
      cash: 'Cash',
      upi: 'UPI',
      card: 'Card'
    };
    return labels[mode] || mode || 'N/A';
  };

  const getPaymentModeBadge = (mode) => {
    const modes = {
      cash: { label: 'Cash', color: 'bg-orange-100 text-orange-700' },
      upi: { label: 'UPI', color: 'bg-purple-100 text-purple-700' },
      card: { label: 'Card', color: 'bg-blue-100 text-blue-700' }
    };
    return modes[mode] || { label: mode || 'N/A', color: 'bg-gray-100 text-gray-700' };
  };

  const handleViewDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setShowDetailModal(true);
  };

  const handleViewWithdrawalDetails = (withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setShowWithdrawalDetailModal(true);
  };

  // ======================
  // EXPORT TO EXCEL
  // ======================
  const exportToExcel = () => {
    try {
      if (filteredTransactions.length === 0) {
        toast.warning("No transactions to export");
        return;
      }

      const exportData = filteredTransactions.map((t, index) => ({
        'S.No': index + 1,
        'Cabin Name': t.cabinName || 'Unknown',
        'Customer Name': t.customerName || 'Unknown',
        'Customer Mobile': t.customerMobile || 'N/A',
        'Amount': t.amount || 0,
        'Type': t.type || 'credit',
        'Description': t.description || '',
        'Payment Mode': getPaymentModeLabel(t.paymentMode),
        'Transaction ID': t.transactionId || 'N/A',
        'Start Date': t.startDate ? formatDateDMY(t.startDate) : 'N/A',
        'End Date': t.endDate ? formatDateDMY(t.endDate) : 'N/A',
        'Transaction Date': t.createdAt ? formatDateTime(t.createdAt) : 'N/A'
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      ws['!cols'] = [
        { wch: 6 }, { wch: 25 }, { wch: 20 }, { wch: 15 },
        { wch: 12 }, { wch: 10 }, { wch: 30 }, { wch: 12 },
        { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 15 }
      ];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Wallet');

      const date = new Date().toISOString().split('T')[0];
      XLSX.writeFile(wb, `wallet_${date}.xlsx`);

      toast.success(`Exported ${filteredTransactions.length} transactions!`);
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export");
    }
  };

  // ======================
  // POST WITHDRAW
  // ======================
  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (parseFloat(withdrawAmount) > wallet.balance) {
      toast.error("Insufficient balance");
      return;
    }

    if (!withdrawAccount || !withdrawBank || !withdrawIfsc) {
      toast.error("Please fill all account details");
      return;
    }

    setWithdrawing(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_URL}/api/bookings/withdraw`,
        {
          amount: parseFloat(withdrawAmount),
          accountNumber: withdrawAccount,
          bankName: withdrawBank,
          ifscCode: withdrawIfsc
        },
        getAuthHeader()
      );

      if (res.data.success) {
        toast.success(`₹${withdrawAmount} withdrawal request submitted!`);
        setShowWithdrawModal(false);
        setWithdrawAmount("");
        setWithdrawAccount("");
        setWithdrawBank("");
        setWithdrawIfsc("");

        await fetchWallet();
        await fetchWithdrawals();
      }
    } catch (err) {
      console.error("Withdraw error:", err);
      toast.error(err.response?.data?.error || "Failed to withdraw");
    } finally {
      setWithdrawing(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterType("all");
    setFilterDate("");
  };

  // Withdrawal Status Badge
  const getWithdrawStatusBadge = (status) => {
    const statusMap = {
      pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
      completed: { label: 'Completed', color: 'bg-emerald-100 text-emerald-700' },
      failed: { label: 'Failed', color: 'bg-red-100 text-red-700' }
    };
    return statusMap[status] || statusMap.pending;
  };

  const toggleWithdrawals = () => {
    setShowWithdrawals(!showWithdrawals);
  };

  const totalWithdrawn = withdrawals.reduce((sum, w) => sum + (w.amount || 0), 0);

  if (loading) {
    return (
      <div className="user-visits">
        {isAdmin ? <AdminNavbar /> : <UsersNavbar />}
        <main className="p-2 sm:p-4 lg:p-6">
          <div className="user-visits__loading">
            <div className="user-visits__spinner" />
            <p className="user-visits__loading-text">Loading wallet...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="user-visits">
      {isAdmin ? <AdminNavbar /> : <UsersNavbar />}

      <main className="p-2 sm:p-4 lg:p-6">
        {/* Header */}
        <div className="user-visits__header">
          <div>
            <h1 className="user-visits__greeting">
              My <span>Wallet</span>
            </h1>
            <p className="user-visits__subtitle">Manage your earnings and withdrawals</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="user-visits__stats">
          <div className="user-visits__stat">
            <div className="user-visits__stat-top">
              <span className="user-visits__stat-label">Balance</span>
              <div className="user-visits__stat-icon user-visits__stat-icon--emerald">
                <WalletIcon size={14} />
              </div>
            </div>
            <div className="user-visits__stat-value">{formatCurrency(wallet.balance)}</div>
            <div className="user-visits__stat-meta">Earned: {formatCurrency(wallet.totalEarned)}</div>
          </div>

          <div className="user-visits__stat">
            <div className="user-visits__stat-top">
              <span className="user-visits__stat-label">Earned</span>
              <div className="user-visits__stat-icon user-visits__stat-icon--indigo">
                <TrendingUp size={14} />
              </div>
            </div>
            <div className="user-visits__stat-value">{formatCurrency(wallet.totalEarned)}</div>
            <div className="user-visits__stat-meta">{transactions.length} transactions</div>
          </div>

          <div className="user-visits__stat">
            <div className="user-visits__stat-top">
              <span className="user-visits__stat-label">Withdrawn</span>
              <div className="user-visits__stat-icon user-visits__stat-icon--purple">
                <History size={14} />
              </div>
            </div>
            <div className="user-visits__stat-value">{formatCurrency(totalWithdrawn)}</div>
            <div className="user-visits__stat-meta">{withdrawals.length} requests</div>
          </div>

          <div className="user-visits__stat">
            <div className="user-visits__stat-top">
              <span className="user-visits__stat-label">Pending</span>
              <div className="user-visits__stat-icon user-visits__stat-icon--amber">
                <Clock size={14} />
              </div>
            </div>
            <div className="user-visits__stat-value">{withdrawStats.pending}</div>
            <div className="user-visits__stat-meta">{withdrawStats.completed} completed</div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Wallet Transactions Table Section */}
          <div className="user-visits__card">
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-gray-700">Transaction History</h3>
                <span className="px-2 py-0.5 text-[10px] font-bold text-indigo-700 bg-indigo-100 rounded-full">
                  {filteredTransactions.length}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {/* Search Bar */}
                <div className="user-visits__search-input">
                  <Search size={14} className="user-visits__search-icon" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="user-visits__filter-select"
                >
                  <option value="all">All Types</option>
                  <option value="credit">Credit</option>
                  <option value="debit">Debit</option>
                </select>

                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="user-visits__filter-select"
                />

                {(searchTerm || filterType !== 'all' || filterDate) && (
                  <button
                    onClick={clearFilters}
                    className="user-visits__btn user-visits__btn--secondary"
                    style={{ padding: "0.375rem 0.5rem" }}
                  >
                    <XCircleIcon size={14} /> Clear
                  </button>
                )}

                {wallet.balance > 0 && (
                  <button
                    onClick={() => setShowWithdrawModal(true)}
                    className="user-visits__btn user-visits__btn--primary"
                  >
                    <Banknote size={14} />
                    Withdraw
                  </button>
                )}

                {withdrawals.length > 0 && (
                  <button
                    onClick={toggleWithdrawals}
                    className={`user-visits__btn ${
                      showWithdrawals ? 'user-visits__btn--primary' : 'user-visits__btn--secondary'
                    }`}
                  >
                    <History size={14} />
                    {showWithdrawals ? 'Hide' : 'Show'}
                  </button>
                )}

                {filteredTransactions.length > 0 && (
                  <button
                    onClick={exportToExcel}
                    className="user-visits__btn user-visits__btn--secondary"
                  >
                    <Download size={14} /> Export
                  </button>
                )}
              </div>
            </div>

            {/* ============================================= */}
            {/* WITHDRAWALS TABLE */}
            {/* ============================================= */}
            {showWithdrawals && (
              <div className="border-b border-gray-100">
                <div className="px-3 py-2 bg-purple-50/50 flex justify-between items-center">
                  <h4 className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">Withdrawal History</h4>
                  <div className="flex items-center gap-2 text-[9px] text-purple-600">
                    <span>Total: {withdrawStats.total}</span>
                    <span className="w-px h-3 bg-purple-200"></span>
                    <span className="text-yellow-600">Pending: {withdrawStats.pending}</span>
                    <span className="w-px h-3 bg-purple-200"></span>
                    <span className="text-emerald-600">Completed: {withdrawStats.completed}</span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="user-visits__table">
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>Amount</th>
                        <th>Bank</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th className="text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {withdrawals.length === 0 ? (
                        <tr>
                          <td colSpan={6}><div className="user-visits__empty"><History size={32} className="user-visits__empty-icon" /><p className="user-visits__empty-text">No withdrawals yet</p></div></td>
                        </tr>
                      ) : (
                        withdrawals.slice().reverse().map((w, idx) => {
                          const status = getWithdrawStatusBadge(w.status);
                          return (
                            <tr key={w._id || idx}>
                              <td>
                                <span className="text-[10px] font-semibold text-gray-400">{idx + 1}</span>
                              </td>
                              <td>
                                <span className="text-xs font-bold text-red-600">{formatCurrency(w.amount)}</span>
                              </td>
                              <td>
                                <span className="text-xs text-gray-700">{w.bankName || 'N/A'}</span>
                              </td>
                              <td>
                                <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${status.color}`}>{status.label}</span>
                              </td>
                              <td>
                                <span className="text-xs text-gray-500">{formatDate(w.createdAt)}</span>
                              </td>
                              <td className="text-center">
                                <button
                                  onClick={() => handleViewWithdrawalDetails(w)}
                                  className="user-visits__btn user-visits__btn--secondary"
                                  style={{ padding: "0.375rem 0.5rem" }}
                                  title="View Details"
                                >
                                  <Eye size={14} />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ============================================= */}
            {/* TRANSACTIONS TABLE */}
            {/* ============================================= */}
            <div className="p-0 overflow-x-auto">
              {filteredTransactions.length === 0 ? (
                <div className="user-visits__empty">
                  <WalletIcon size={32} className="user-visits__empty-icon" />
                  <p className="user-visits__empty-text">No transactions found</p>
                  <p className="text-xs text-gray-400">Try adjusting your filters.</p>
                </div>
              ) : (
                <table className="user-visits__table">
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Cabin</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Payment</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((transaction, index) => {
                      const paymentBadge = getPaymentModeBadge(transaction.paymentMode);
                      return (
                        <tr key={transaction._id || transaction.transactionId || index}>
                          <td>
                            <span className="text-[10px] font-semibold text-gray-400">{index + 1}</span>
                          </td>
                          <td>
                            <div>
                              <p className="font-semibold text-gray-900 text-xs">
                                {transaction.cabinName || "Unknown Cabin"}
                              </p>
                              <p className="text-[9px] text-gray-400">
                                Booking #{transaction.bookingId?._id?.slice(-6) || transaction.bookingId?.slice?.(-6) || "N/A"}
                              </p>
                            </div>
                          </td>
                          <td>
                            <p className="font-medium text-gray-800 text-xs">{transaction.customerName || "Unknown"}</p>
                            <p className="text-[9px] text-gray-400">{transaction.customerMobile || "N/A"}</p>
                          </td>
                          <td>
                            <p className="text-xs text-gray-700">{formatDate(transaction.startDate)}</p>
                            <p className="text-[9px] text-gray-400">{formatDate(transaction.endDate)}</p>
                          </td>
                          <td>
                            <span className="text-xs font-bold text-emerald-600">+{formatCurrency(transaction.amount)}</span>
                          </td>
                          <td>
                            <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full inline-flex items-center gap-1 ${paymentBadge.color}`}>
                              {getPaymentModeIcon(transaction.paymentMode)}
                              {paymentBadge.label}
                            </span>
                          </td>
                          <td className="text-center">
                            <button
                              onClick={() => handleViewDetails(transaction)}
                              className="user-visits__btn user-visits__btn--secondary"
                              style={{ padding: "0.375rem 0.5rem" }}
                              title="View Details"
                            >
                              <Eye size={14} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* Footer with stats */}
            {!loading && filteredTransactions.length > 0 && (
              <div className="px-3 py-2 border-t border-gray-100 flex flex-wrap items-center justify-between gap-1 bg-gray-50">
                <span className="text-[9px] text-gray-500">
                  Showing <strong>{filteredTransactions.length}</strong> of <strong>{transactions.length}</strong> transactions
                </span>
                <div className="flex items-center gap-2 text-[9px] text-gray-500">
                  <span className="flex items-center gap-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Credits: {transactions.filter(t => t.type === 'credit').length}
                  </span>
                  <span className="flex items-center gap-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                    Balance: {formatCurrency(wallet.balance)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-[1300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-5 text-white rounded-t-3xl flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Banknote size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Withdraw Funds</h3>
                  <p className="text-sm text-indigo-200">Available: {formatCurrency(wallet.balance)}</p>
                </div>
              </div>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Amount to Withdraw (₹)</label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  min="1"
                  max={wallet.balance}
                />
                <p className="text-xs text-gray-400 mt-1">Max: {formatCurrency(wallet.balance)}</p>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Account Number</label>
                <input
                  type="text"
                  value={withdrawAccount}
                  onChange={(e) => setWithdrawAccount(e.target.value)}
                  placeholder="Enter account number"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Bank Name</label>
                <input
                  type="text"
                  value={withdrawBank}
                  onChange={(e) => setWithdrawBank(e.target.value)}
                  placeholder="Enter bank name"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">IFSC Code</label>
                <input
                  type="text"
                  value={withdrawIfsc}
                  onChange={(e) => setWithdrawIfsc(e.target.value)}
                  placeholder="Enter IFSC code"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="bg-amber-50 rounded-xl p-3 text-xs text-amber-700 flex items-start gap-2 border border-amber-200">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>Withdrawals are processed within 24-48 business hours.</span>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleWithdraw}
                  disabled={withdrawing}
                  className={`flex-1 py-3 rounded-xl text-white font-bold transition shadow-sm active:scale-[0.98] ${
                    withdrawing 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg'
                  }`}
                >
                  {withdrawing ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
                      Processing...
                    </>
                  ) : (
                    'Confirm Withdrawal'
                  )}
                </button>
                <button                  onClick={() => setShowWithdrawModal(false)}
                  className="px-5 py-3 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================= */}
      {/* ENHANCED TRANSACTION DETAIL MODAL - FIXED OVERFLOW */}
      {/* ============================================= */}
      {showDetailModal && selectedTransaction && (
        <div 
          className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowDetailModal(false);
            }
          }}
        >
          <div 
            className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Fixed Header */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-5 text-white rounded-t-3xl flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <WalletIcon size={20} className="text-white" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xl font-bold truncate">Transaction Details</h3>
                  <p className="text-sm text-indigo-200 truncate">
                    Booking #{selectedTransaction.bookingId?._id?.slice(-6) || selectedTransaction.bookingId?.slice?.(-6) || "N/A"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors shrink-0"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-5 space-y-4 overflow-y-auto flex-1">
              {/* Amount */}
              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200 text-center">
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Amount Credited</p>
                <p className="text-3xl font-bold text-emerald-600 mt-1">+{formatCurrency(selectedTransaction.amount)}</p>
              </div>

              {/* Payment Mode Badge */}
              <div className="flex items-center justify-center gap-2">
                <span className={`px-4 py-1.5 text-xs font-bold rounded-full inline-flex items-center gap-2 ${getPaymentModeBadge(selectedTransaction.paymentMode).color}`}>
                  {getPaymentModeIcon(selectedTransaction.paymentMode)}
                  {getPaymentModeLabel(selectedTransaction.paymentMode)}
                </span>
              </div>

              {/* Cabin & Customer */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <Building2 size={12} />
                    Cabin
                  </p>
                  <p className="mt-1 font-semibold text-gray-800 text-sm break-words">{selectedTransaction.cabinName || "Unknown"}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <User size={12} />
                    Customer
                  </p>
                  <p className="mt-1 font-semibold text-gray-800 text-sm break-words">{selectedTransaction.customerName || "Unknown"}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{selectedTransaction.customerMobile || "N/A"}</p>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <Calendar size={12} />
                    Start Date
                  </p>
                  <p className="mt-1 font-semibold text-gray-800 text-sm">{formatDate(selectedTransaction.startDate)}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <Calendar size={12} />
                    End Date
                  </p>
                  <p className="mt-1 font-semibold text-gray-800 text-sm">{formatDate(selectedTransaction.endDate)}</p>
                </div>
              </div>

              {/* Transaction Details - UPI */}
              {selectedTransaction.paymentMode === 'upi' && selectedTransaction.paymentDetails && (
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                  <p className="text-xs font-bold text-purple-700 uppercase tracking-wider flex items-center gap-2 mb-2">
                    <Smartphone size={14} /> UPI Payment Details
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-gray-600 shrink-0">UPI ID</span>
                      <span className="font-medium text-gray-800 break-all text-right">{selectedTransaction.paymentDetails.upiId || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-gray-600 shrink-0">UPI App</span>
                      <span className="font-medium text-gray-800 break-all text-right">{selectedTransaction.paymentDetails.upiApp || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Transaction Details - Card */}
              {selectedTransaction.paymentMode === 'card' && selectedTransaction.paymentDetails && (
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <p className="text-xs font-bold text-blue-700 uppercase tracking-wider flex items-center gap-2 mb-2">
                    <CreditCard size={14} /> Card Payment Details
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-gray-600 shrink-0">Card Number</span>
                      <span className="font-medium text-gray-800 font-mono break-all text-right">{selectedTransaction.paymentDetails.cardNumber || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-gray-600 shrink-0">Card Holder</span>
                      <span className="font-medium text-gray-800 break-all text-right">{selectedTransaction.paymentDetails.cardHolderName || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-gray-600 shrink-0">Expiry</span>
                      <span className="font-medium text-gray-800 break-all text-right">{selectedTransaction.paymentDetails.cardExpiry || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Transaction Details - Cash */}
              {selectedTransaction.paymentMode === 'cash' && (
                <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                  <p className="text-xs font-bold text-orange-700 uppercase tracking-wider flex items-center gap-2">
                    <Store size={14} /> Cash Payment
                  </p>
                  <p className="text-sm text-gray-600 mt-2">Payment made in cash at the counter</p>
                </div>
              )}

              {/* Screenshot */}
              {selectedTransaction.paymentDetails?.screenshot && (
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 mb-2">
                    <Image size={14} /> Payment Screenshot
                  </p>
                  <div className="flex justify-center">
                    <img 
                      src={`${API_URL}${selectedTransaction.paymentDetails.screenshot}`} 
                      alt="Payment Screenshot" 
                      className="max-h-48 rounded-lg border border-gray-200 cursor-pointer hover:opacity-90 transition object-contain"
                      onClick={() => window.open(`${API_URL}${selectedTransaction.paymentDetails.screenshot}`, '_blank')}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1 text-center">Click to view full size</p>
                </div>
              )}

              {/* Transaction ID */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                  <FileText size={12} />
                  Transaction ID
                </p>
                <p className="mt-1 font-mono text-xs text-gray-700 break-all">
                  {selectedTransaction.transactionId || selectedTransaction.paymentDetails?.transactionId || 'N/A'}
                </p>
              </div>

              {/* Description */}
              {selectedTransaction.description && (
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Description</p>
                  <p className="mt-1 text-sm text-gray-700 break-words">{selectedTransaction.description}</p>
                </div>
              )}

              {/* Timestamp */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                  <Clock size={12} />
                  Transaction Date
                </p>
                <p className="mt-1 font-semibold text-gray-800 text-sm">
                  {formatDateTime(selectedTransaction.createdAt)}
                </p>
              </div>

              <button
                onClick={() => setShowDetailModal(false)}
                className="w-full py-3 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================= */}
      {/* WITHDRAWAL DETAIL MODAL - FIXED OVERFLOW */}
      {/* ============================================= */}
      {showWithdrawalDetailModal && selectedWithdrawal && (
        <div 
          className="fixed inset-0 z-[1400] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowWithdrawalDetailModal(false);
            }
          }}
        >
          <div 
            className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-5 text-white rounded-t-3xl flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <History size={20} className="text-white" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xl font-bold truncate">Withdrawal Details</h3>
                  <p className="text-sm text-purple-200 truncate">#{selectedWithdrawal._id?.slice(-6) || "N/A"}</p>
                </div>
              </div>
              <button
                onClick={() => setShowWithdrawalDetailModal(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors shrink-0"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto flex-1">
              <div className={`rounded-xl p-4 border text-center ${
                selectedWithdrawal.status === 'completed' 
                  ? 'bg-emerald-50 border-emerald-200' 
                  : selectedWithdrawal.status === 'failed'
                  ? 'bg-red-50 border-red-200'
                  : 'bg-yellow-50 border-yellow-200'
              }`}>
                <p className="text-xs font-bold uppercase tracking-wider" style={{
                  color: selectedWithdrawal.status === 'completed' 
                    ? '#047857' 
                    : selectedWithdrawal.status === 'failed'
                    ? '#b91c1c'
                    : '#92400e'
                }}>Withdrawal Amount</p>
                <p className="text-3xl font-bold mt-1" style={{
                  color: selectedWithdrawal.status === 'completed' 
                    ? '#047857' 
                    : selectedWithdrawal.status === 'failed'
                    ? '#b91c1c'
                    : '#92400e'
                }}>
                  {formatCurrency(selectedWithdrawal.amount)}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Status</p>
                <div className="mt-1">
                  <span className={`px-3 py-1 text-xs font-bold rounded-full inline-block ${getWithdrawStatusBadge(selectedWithdrawal.status).color}`}>
                    {getWithdrawStatusBadge(selectedWithdrawal.status).label}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <Building2 size={14} />
                  Bank Details
                </p>
                <div className="mt-2 space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 shrink-0">Bank Name</span>
                    <span className="font-medium text-gray-800 break-all text-right">{selectedWithdrawal.bankName || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 shrink-0">Account Number</span>
                    <span className="font-medium text-gray-800 font-mono break-all text-right">
                      {selectedWithdrawal.accountNumber || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 shrink-0">IFSC Code</span>
                    <span className="font-medium text-gray-800 font-mono break-all text-right">{selectedWithdrawal.ifscCode || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <Calendar size={12} />
                    Requested
                  </p>
                  <p className="mt-1 font-semibold text-gray-800 text-sm">{formatDateTime(selectedWithdrawal.createdAt)}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <Clock size={12} />
                    Updated
                  </p>
                  <p className="mt-1 font-semibold text-gray-800 text-sm">{formatDateTime(selectedWithdrawal.updatedAt)}</p>
                </div>
              </div>

              {selectedWithdrawal.note && (
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Note</p>
                  <p className="mt-1 text-sm text-gray-700 break-words">{selectedWithdrawal.note}</p>
                </div>
              )}

              <button
                onClick={() => setShowWithdrawalDetailModal(false)}
                className="w-full py-3 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyWallet;