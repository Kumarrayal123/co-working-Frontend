// MyWallet.jsx
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
  RefreshCw
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import UsersNavbar from "./UsersNavbar";
import AdminNavbar from "./AdminNavbar";
import * as XLSX from 'xlsx';
import "./Dashboard.css";

const API_URL = "http://localhost:5000";

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
        setTransactions(res.data.transactions || []);
        setFilteredTransactions(res.data.transactions || []);
      }
    } catch (err) {
      console.error("Error fetching wallet:", err);
      toast.error("Failed to fetch wallet data");
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // GET WITHDRAWALS (Auto Called on Page Load)
  // ======================
  const fetchWithdrawals = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(
        `${API_URL}/api/bookings/withdrawals`,
        getAuthHeader()
      );

      console.log("Withdrawals response:", res.data);

      if (res.data.success) {
        setWithdrawals(res.data.withdrawals || []);
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
        t.description?.toLowerCase().includes(searchTerm.toLowerCase())
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
        'Start Date': t.startDate || 'N/A',
        'End Date': t.endDate || 'N/A',
        'Transaction Date': t.createdAt ? formatDate(t.createdAt) : 'N/A'
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      ws['!cols'] = [
        { wch: 6 }, { wch: 25 }, { wch: 20 }, { wch: 15 },
        { wch: 12 }, { wch: 10 }, { wch: 30 }, { wch: 15 },
        { wch: 15 }, { wch: 15 }
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
        
        // Refresh both wallet and withdrawals
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
      pending: { label: 'Pending', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
      completed: { label: 'Completed', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
      failed: { label: 'Failed', color: 'bg-red-50 text-red-700 border-red-200' }
    };
    return statusMap[status] || statusMap.pending;
  };

  // Toggle Withdrawals View (Only Hide/Show, No API Call)
  const toggleWithdrawals = () => {
    setShowWithdrawals(!showWithdrawals);
  };

  // Calculate total withdrawn
  const totalWithdrawn = withdrawals.reduce((sum, w) => sum + (w.amount || 0), 0);

  if (loading) {
    return (
      <div className="admin-dash">
        {isAdmin ? <AdminNavbar /> : <UsersNavbar />}
        <div className="admin-dash__loading">
          <div className="admin-dash__spinner" />
          <p className="admin-dash__loading-text">Loading wallet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dash">
      {isAdmin ? <AdminNavbar /> : <UsersNavbar />}

      <main className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16">
        {/* Header */}
        <div className="admin-dash__header">
          <div>
            <h1 className="admin-dash__greeting">
              My <span>Wallet</span>
            </h1>
            <p className="admin-dash__subtitle">
              Track your earnings and transaction history.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            {/* Withdraw Button */}
            {wallet.balance > 0 && (
              <button
                onClick={() => setShowWithdrawModal(true)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors w-full sm:w-auto"
              >
                <Banknote size={16} />
                Withdraw
              </button>
            )}
            {/* Withdrawals History Button - Only Toggle */}
            {withdrawals.length > 0 && (
              <button
                onClick={toggleWithdrawals}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors w-full sm:w-auto"
              >
                <History size={16} />
                {showWithdrawals ? 'Hide' : 'Show'} Withdrawals
              </button>
            )}
            {/* Export Button */}
            {filteredTransactions.length > 0 && (
              <button
                onClick={exportToExcel}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors w-full sm:w-auto"
              >
                <Download size={16} />
                Export
              </button>
            )}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors w-full sm:w-auto"
            >
              Back
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-500/25">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-indigo-200">Available Balance</p>
                <p className="text-3xl font-bold mt-1">{formatCurrency(wallet.balance)}</p>
              </div>
              <div className="bg-white/20 p-3 rounded-xl">
                <WalletIcon size={24} className="text-white" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/20 flex justify-between text-sm">
              <span className="text-indigo-200">Total Earned</span>
              <span className="font-semibold">{formatCurrency(wallet.totalEarned)}</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Earned</p>
                <p className="text-2xl font-bold text-indigo-600 mt-1">
                  {formatCurrency(wallet.totalEarned)}
                </p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-xl">
                <TrendingUp size={24} className="text-indigo-600" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between text-sm">
              <span className="text-slate-500">Total Transactions</span>
              <span className="font-semibold text-slate-900">{wallet.totalTransactions}</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Withdrawn</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">
                  {formatCurrency(totalWithdrawn)}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-xl">
                <History size={24} className="text-purple-600" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between text-sm">
              <span className="text-slate-500">Withdrawal Requests</span>
              <span className="font-semibold text-slate-900">{withdrawals.length}</span>
            </div>
          </div>
        </div>

        {/* ============================================= */}
        {/* WITHDRAWALS TABLE - Auto Loaded */}
        {/* ============================================= */}
        {showWithdrawals && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-slate-200 bg-purple-50 flex justify-between items-center">
              <h3 className="text-sm font-semibold text-purple-700">Withdrawal History</h3>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-purple-500">
                  {withdrawStats.total} requests · 
                  {withdrawStats.pending} pending · 
                  {withdrawStats.completed} completed · 
                  {withdrawStats.failed} failed
                </span>
              </div>
            </div>

            {withdrawals.length === 0 ? (
              <div className="p-8 text-center">
                <History size={40} className="text-slate-300 mx-auto mb-3" />
                <p className="text-slate-600 font-medium">No withdrawals yet</p>
                <p className="text-sm text-slate-400">Your withdrawal requests will appear here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">#</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Amount</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Bank</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Account</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">IFSC</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Date</th>
                      <th className="text-center py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {withdrawals.slice().reverse().map((w, idx) => {
                      const status = getWithdrawStatusBadge(w.status);
                      return (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-4">
                            <span className="text-sm text-slate-500">{idx + 1}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-bold text-red-600">{formatCurrency(w.amount)}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-sm text-slate-700">{w.bankName || 'N/A'}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-sm text-slate-600">••••{w.accountNumber?.slice(-4) || 'N/A'}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-xs font-mono text-slate-500">{w.ifscCode || 'N/A'}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${status.color}`}>
                              {status.label}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-sm text-slate-600">{formatDate(w.createdAt)}</span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => handleViewWithdrawalDetails(w)}
                              className="p-1.5 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
                              title="View Details"
                            >
                              <Eye size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ============================================= */}
        {/* TRANSACTION FILTERS */}
        {/* ============================================= */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="Search by cabin, customer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Types</option>
              <option value="credit">Credit</option>
              <option value="debit">Debit</option>
            </select>

            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            {(searchTerm || filterType !== "all" || filterDate) && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors"
              >
                <X size={16} />
                Clear Filters
              </button>
            )}

            <span className="text-xs text-slate-500 ml-auto">
              {filteredTransactions.length} transactions
            </span>
          </div>
        </div>

        {/* ============================================= */}
        {/* TRANSACTIONS TABLE */}
        {/* ============================================= */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <h3 className="text-sm font-semibold text-slate-700">Transaction History</h3>
            <span className="text-xs text-slate-500">{filteredTransactions.length} transactions</span>
          </div>

          {filteredTransactions.length === 0 ? (
            <div className="admin-dash__error" style={{ background: '#f8fafc', borderColor: '#e2e8f0' }}>
              <WalletIcon size={48} className="text-slate-300 mb-4" />
              <p className="admin-dash__error-title" style={{ color: '#475569' }}>No transactions found</p>
              <p className="admin-dash__error-message">Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Cabin</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Customer</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Date</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Amount</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Type</th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTransactions.map((transaction, index) => (
                    <tr key={index} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-slate-800 text-sm">
                            {transaction.cabinName || "Unknown Cabin"}
                          </p>
                          <p className="text-xs text-slate-500">
                            Booking #{transaction.bookingId?._id?.slice(-6) || "N/A"}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm text-slate-700">
                            {transaction.customerName || "Unknown"}
                          </p>
                          <p className="text-xs text-slate-500">
                            {transaction.customerMobile || "N/A"}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-slate-600">
                          <div>{formatDate(transaction.startDate)}</div>
                          <div className="text-xs text-slate-400">
                            {transaction.startDate} - {transaction.endDate}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-indigo-600 text-sm">
                          +{formatCurrency(transaction.amount)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
                          <ArrowUpRight size={12} />
                          Credit
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleViewDetails(transaction)}
                          className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-[1300] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div style={{
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 60%, #06b6d4 100%)",
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
                  <Banknote size={20} color="#fff" />
                </div>
                <div>
                  <h3 style={{ margin: 0, color: "#fff", fontSize: "1rem", fontWeight: 700 }}>
                    Withdraw Funds
                  </h3>
                  <p style={{ margin: 0, color: "rgba(255,255,255,0.8)", fontSize: "0.75rem" }}>
                    Available Balance: {formatCurrency(wallet.balance)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowWithdrawModal(false)}
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
                <div>
                  <label style={{
                    display: "block",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: "0.5rem"
                  }}>
                    Amount to Withdraw (₹)
                  </label>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    min="1"
                    max={wallet.balance}
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    Max: {formatCurrency(wallet.balance)}
                  </p>
                </div>

                <div>
                  <label style={{
                    display: "block",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: "0.5rem"
                  }}>
                    Account Number
                  </label>
                  <input
                    type="text"
                    value={withdrawAccount}
                    onChange={(e) => setWithdrawAccount(e.target.value)}
                    placeholder="Enter account number"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label style={{
                    display: "block",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: "0.5rem"
                  }}>
                    Bank Name
                  </label>
                  <input
                    type="text"
                    value={withdrawBank}
                    onChange={(e) => setWithdrawBank(e.target.value)}
                    placeholder="Enter bank name"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label style={{
                    display: "block",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: "0.5rem"
                  }}>
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    value={withdrawIfsc}
                    onChange={(e) => setWithdrawIfsc(e.target.value)}
                    placeholder="Enter IFSC code"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div style={{
                  background: "#fef3c7",
                  borderRadius: 8,
                  padding: "0.75rem",
                  fontSize: "0.75rem",
                  color: "#92400e",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}>
                  <AlertCircle size={16} className="shrink-0" />
                  <span>Withdrawals are processed within 24-48 business hours.</span>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <button
                    onClick={handleWithdraw}
                    disabled={withdrawing}
                    style={{
                      width: "100%",
                      padding: "0.875rem",
                      borderRadius: 10,
                      border: "none",
                      background: withdrawing
                        ? "#a5b4fc"
                        : "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                      color: "#fff",
                      fontFamily: "inherit",
                      fontSize: "0.875rem",
                      fontWeight: 700,
                      cursor: withdrawing ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      boxShadow: withdrawing ? "none" : "0 4px 14px rgba(99,102,241,0.35)",
                      transition: "all 160ms",
                    }}
                  >
                    {withdrawing ? (
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
                      <>Confirm Withdrawal</>
                    )}
                  </button>
                  <button
                    onClick={() => setShowWithdrawModal(false)}
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
        </div>
      )}

      {/* Transaction Detail Modal */}
      {showDetailModal && selectedTransaction && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div style={{
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 60%, #06b6d4 100%)",
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
                  <WalletIcon size={20} color="#fff" />
                </div>
                <div>
                  <h3 style={{ margin: 0, color: "#fff", fontSize: "1rem", fontWeight: 700 }}>
                    Transaction Details
                  </h3>
                  <p style={{ margin: 0, color: "rgba(255,255,255,0.8)", fontSize: "0.75rem" }}>
                    Booking #{selectedTransaction.bookingId?._id?.slice(-6) || "N/A"}
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
                <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-200 text-center">
                  <p className="text-xs font-medium text-indigo-600 uppercase tracking-wider">Amount Credited</p>
                  <p className="text-3xl font-bold text-indigo-600 mt-1">
                    +{formatCurrency(selectedTransaction.amount)}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Cabin Details</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Building2 size={16} className="text-indigo-500" />
                    <p className="font-semibold text-slate-800">
                      {selectedTransaction.cabinName || "Unknown Cabin"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <User size={12} />
                      Customer
                    </p>
                    <p className="font-semibold text-slate-800 mt-1">
                      {selectedTransaction.customerName || "Unknown"}
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <Phone size={12} />
                      Mobile
                    </p>
                    <p className="font-semibold text-slate-800 mt-1">
                      {selectedTransaction.customerMobile || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <Calendar size={12} />
                      Start Date
                    </p>
                    <p className="font-semibold text-slate-800 mt-1">
                      {formatDate(selectedTransaction.startDate)}
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <Calendar size={12} />
                      End Date
                    </p>
                    <p className="font-semibold text-slate-800 mt-1">
                      {formatDate(selectedTransaction.endDate)}
                    </p>
                  </div>
                </div>

                {selectedTransaction.description && (
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Description</p>
                    <p className="text-sm text-slate-700 mt-1">
                      {selectedTransaction.description}
                    </p>
                  </div>
                )}

                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Transaction Date</p>
                  <p className="text-sm text-slate-700 mt-1 flex items-center gap-2">
                    <Clock size={14} className="text-slate-400" />
                    {formatDate(selectedTransaction.createdAt)} at {formatTime(selectedTransaction.createdAt)}
                  </p>
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

      {/* ============================================= */}
      {/* WITHDRAWAL DETAIL MODAL */}
      {/* ============================================= */}
      {showWithdrawalDetailModal && selectedWithdrawal && (
        <div className="fixed inset-0 z-[1400] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div style={{
              background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 60%, #8b5cf6 100%)",
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
                  <History size={20} color="#fff" />
                </div>
                <div>
                  <h3 style={{ margin: 0, color: "#fff", fontSize: "1rem", fontWeight: 700 }}>
                    Withdrawal Details
                  </h3>
                  <p style={{ margin: 0, color: "rgba(255,255,255,0.8)", fontSize: "0.75rem" }}>
                    Request #{selectedWithdrawal._id?.slice(-6) || "N/A"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowWithdrawalDetailModal(false)}
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
                {/* Amount */}
                <div className={`rounded-xl p-4 border text-center ${
                  selectedWithdrawal.status === 'completed' 
                    ? 'bg-emerald-50 border-emerald-200' 
                    : selectedWithdrawal.status === 'failed'
                    ? 'bg-red-50 border-red-200'
                    : 'bg-yellow-50 border-yellow-200'
                }`}>
                  <p className="text-xs font-medium uppercase tracking-wider" style={{
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

                {/* Status */}
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Status</p>
                  <div className="mt-1">
                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${
                      getWithdrawStatusBadge(selectedWithdrawal.status).color
                    }`}>
                      {getWithdrawStatusBadge(selectedWithdrawal.status).label}
                    </span>
                  </div>
                </div>

                {/* Bank Details */}
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <Building2 size={14} />
                    Bank Details
                  </p>
                  <div className="mt-2 space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Bank Name</span>
                      <span className="font-medium text-slate-800">{selectedWithdrawal.bankName || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Account Number</span>
                      <span className="font-medium text-slate-800">
                        {selectedWithdrawal.accountNumber || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">IFSC Code</span>
                      <span className="font-medium text-slate-800 font-mono">{selectedWithdrawal.ifscCode || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Timestamps */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <Calendar size={12} />
                      Requested
                    </p>
                    <p className="font-medium text-slate-800 mt-1 text-sm">
                      {formatDateTime(selectedWithdrawal.createdAt)}
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <Clock size={12} />
                      Updated
                    </p>
                    <p className="font-medium text-slate-800 mt-1 text-sm">
                      {formatDateTime(selectedWithdrawal.updatedAt)}
                    </p>
                  </div>
                </div>

                {/* Description/Note if any */}
                {selectedWithdrawal.note && (
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Note</p>
                    <p className="text-sm text-slate-700 mt-1">{selectedWithdrawal.note}</p>
                  </div>
                )}

                <button
                  onClick={() => setShowWithdrawalDetailModal(false)}
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
    </div>
  );
};

export default MyWallet;