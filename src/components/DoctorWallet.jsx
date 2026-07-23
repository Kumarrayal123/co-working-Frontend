// DoctorWallet.jsx - Complete with Fixed View Popup Overflow
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
import DoctorNavbar from "./DoctorNavbar";
import * as XLSX from 'xlsx';
import "./Dashboard.css";

const API_URL = "http://localhost:5003";

const DoctorWallet = () => {
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
        'Chamber Name': t.cabinName || 'Unknown',
        'Customer Name': t.customerName || 'Unknown',
        'Customer Mobile': t.customerMobile || 'N/A',
        'Amount': t.amount || 0,
        'Type': t.type || 'credit',
        'Description': t.description || '',
        'Payment Mode': getPaymentModeLabel(t.paymentMode),
        'Transaction ID': t.transactionId || 'N/A',
        'Start Date': t.startDate || 'N/A',
        'End Date': t.endDate || 'N/A',
        'Transaction Date': t.createdAt ? formatDate(t.createdAt) : 'N/A'
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      ws['!cols'] = [
        { wch: 6 }, { wch: 25 }, { wch: 20 }, { wch: 15 },
        { wch: 12 }, { wch: 10 }, { wch: 30 }, { wch: 12 },
        { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 15 }
      ];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Doctor_Wallet');
      
      const date = new Date().toISOString().split('T')[0];
      XLSX.writeFile(wb, `doctor_wallet_${date}.xlsx`);
      
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
      <div className="admin-dash" style={{ backgroundColor: '#ffffff' }}>
        <DoctorNavbar />
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dash" style={{ backgroundColor: '#ffffff' }}>
      <DoctorNavbar />

      <div className="pt-24 px-3 sm:px-4 md:px-6 lg:px-8 max-w-full mx-auto pb-16">
        {/* Header */}
        <div className="admin-dash__header">
          <div>
            <h1 className="admin-dash__greeting">
              Doctor <span>Wallet</span>
            </h1>
          
          </div>
         
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-4 sm:p-5 text-white shadow-lg shadow-indigo-500/25">
            <p className="text-xs font-medium text-indigo-200">Available Balance</p>
            <p className="text-2xl sm:text-3xl font-bold mt-1">{formatCurrency(wallet.balance)}</p>
            <div className="mt-3 pt-3 border-t border-white/20 flex justify-between text-xs">
              <span className="text-indigo-200">Total Earned</span>
              <span className="font-semibold">{formatCurrency(wallet.totalEarned)}</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500">Total Earned</p>
                <p className="text-xl sm:text-2xl font-bold text-indigo-600 mt-1">
                  {formatCurrency(wallet.totalEarned)}
                </p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-xl">
                <TrendingUp size={20} className="text-indigo-600" />
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between text-xs">
              <span className="text-gray-500">Transactions</span>
              <span className="font-semibold text-gray-900">{wallet.totalTransactions}</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500">Total Withdrawn</p>
                <p className="text-xl sm:text-2xl font-bold text-purple-600 mt-1">
                  {formatCurrency(totalWithdrawn)}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-xl">
                <History size={20} className="text-purple-600" />
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between text-xs">
              <span className="text-gray-500">Requests</span>
              <span className="font-semibold text-gray-900">{withdrawals.length}</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500">Pending Requests</p>
                <p className="text-xl sm:text-2xl font-bold text-yellow-600 mt-1">
                  {withdrawStats.pending}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-xl">
                <Clock size={20} className="text-yellow-600" />
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between text-xs">
              <span className="text-gray-500">Completed</span>
              <span className="font-semibold text-gray-900">{withdrawStats.completed}</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Wallet Transactions Table Section */}
          <div className="admin-dash__card" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}>
            <div className="admin-dash__card-header flex flex-wrap items-center justify-between gap-3" style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb' }}>
              <div className="flex items-center gap-3">
                <h3 className="admin-dash__card-title">Transaction History</h3>
                <span className="px-2.5 py-0.5 text-xs font-bold text-indigo-700 bg-indigo-100 rounded-full">
                  {filteredTransactions.length}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {/* Search Bar */}
                <div className="relative w-full sm:w-48">
                  <Search
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                {/* Filters - Always Visible */}
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="text-sm bg-white border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium text-gray-700"
                >
                  <option value="all">All Types</option>
                  <option value="credit">Credit</option>
                  <option value="debit">Debit</option>
                </select>

                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="text-sm bg-white border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium text-gray-700"
                />

                {/* Clear Filters */}
                {(searchTerm || filterType !== 'all' || filterDate) && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <XCircleIcon size={14} />
                    Clear
                  </button>
                )}

                {wallet.balance > 0 && (
                  <button
                    onClick={() => setShowWithdrawModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 transition-colors"
                  >
                    <Banknote size={14} />
                    <span className="hidden xs:inline">Withdraw</span>
                    <span className="xs:hidden">Withdraw</span>
                  </button>
                )}

                {withdrawals.length > 0 && (
                  <button
                    onClick={toggleWithdrawals}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      showWithdrawals ? 'bg-purple-600 text-white' : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
                    }`}
                  >
                    <History size={14} />
                    <span className="hidden xs:inline">{showWithdrawals ? 'Hide' : 'Show'} Withdrawals</span>
                    <span className="xs:hidden">{showWithdrawals ? 'Hide' : 'Show'}</span>
                  </button>
                )}

                {filteredTransactions.length > 0 && (
                  <button
                    onClick={exportToExcel}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium hover:bg-indigo-100 transition-colors border border-indigo-200"
                  >
                    <Download size={14} />
                    <span className="hidden xs:inline">Export</span>
                  </button>
                )}

                <button
                  onClick={() => navigate("/my-cabins")}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors"
                >
                  <Building2 size={14} className="text-indigo-600" />
                  <span className="hidden xs:inline">Chambers</span>
                </button>
              </div>
            </div>

            {/* ============================================= */}
            {/* WITHDRAWALS TABLE */}
            {/* ============================================= */}
            {showWithdrawals && (
              <div className="border-b border-gray-100">
                <div className="px-4 py-2 bg-purple-50/50 flex justify-between items-center">
                  <h4 className="text-xs font-bold text-purple-700 uppercase tracking-wider">Withdrawal History</h4>
                  <div className="flex items-center gap-2 text-[10px] text-purple-600">
                    <span>Total: {withdrawStats.total}</span>
                    <span className="w-px h-3 bg-purple-200"></span>
                    <span className="text-yellow-600">Pending: {withdrawStats.pending}</span>
                    <span className="w-px h-3 bg-purple-200"></span>
                    <span className="text-emerald-600">Completed: {withdrawStats.completed}</span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[700px]">
                    <thead>
                      <tr className="border-b border-gray-100" style={{ backgroundColor: '#f9fafb' }}>
                        <th className="p-3 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">#</th>
                        <th className="p-3 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Amount</th>
                        <th className="p-3 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Bank</th>
                        <th className="p-3 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Account</th>
                        <th className="p-3 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Status</th>
                        <th className="p-3 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Date</th>
                        <th className="p-3 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {withdrawals.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-gray-400">
                            <History size={32} className="mx-auto mb-2 opacity-20" />
                            <p className="text-sm font-medium">No withdrawals yet</p>
                          </td>
                        </tr>
                      ) : (
                        withdrawals.slice().reverse().map((w, idx) => {
                          const status = getWithdrawStatusBadge(w.status);
                          return (
                            <tr key={idx} className="transition-colors hover:bg-gray-50/80">
                              <td className="p-3">
                                <span className="text-sm font-semibold text-gray-400">#{idx + 1}</span>
                              </td>
                              <td className="p-3">
                                <span className="text-sm font-bold text-red-600">{formatCurrency(w.amount)}</span>
                              </td>
                              <td className="p-3">
                                <span className="text-sm text-gray-700">{w.bankName || 'N/A'}</span>
                              </td>
                              <td className="p-3">
                                <span className="text-sm text-gray-600 font-mono">••••{w.accountNumber?.slice(-4) || 'N/A'}</span>
                              </td>
                              <td className="p-3">
                                <span className={`px-3 py-1 text-xs font-bold rounded-full ${status.color}`}>{status.label}</span>
                              </td>
                              <td className="p-3">
                                <span className="text-sm text-gray-500">{formatDate(w.createdAt)}</span>
                              </td>
                              <td className="p-3">
                                <button
                                  onClick={() => handleViewWithdrawalDetails(w)}
                                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors whitespace-nowrap"
                                >
                                  <Eye size={13} /> View
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
            <div className="admin-dash__card-body p-0 overflow-x-auto" style={{ backgroundColor: '#ffffff' }}>
              {filteredTransactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 py-20 text-gray-400">
                  <WalletIcon size={48} className="opacity-20" />
                  <p className="text-lg font-medium">No transactions found</p>
                  <p className="text-sm">Try adjusting your filters.</p>
                </div>
              ) : (
                <table className="w-full min-w-[1000px] text-left">
                  <thead>
                    <tr className="border-b border-gray-100" style={{ backgroundColor: '#f9fafb' }}>
                      <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">#</th>
                      <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Chamber</th>
                      <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Customer</th>
                      <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Date</th>
                      <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Amount</th>
                      <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Payment</th>
                      <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredTransactions.map((transaction, index) => {
                      const paymentBadge = getPaymentModeBadge(transaction.paymentMode);
                      return (
                        <tr key={index} className="transition-colors hover:bg-gray-50/80">
                          <td className="p-4">
                            <span className="text-sm font-semibold text-gray-400">#{index + 1}</span>
                          </td>
                          <td className="p-4">
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">
                                {transaction.cabinName || "Unknown Chamber"}
                              </p>
                              <p className="text-[10px] text-gray-400">
                                Booking #{transaction.bookingId?._id?.slice(-6) || transaction.bookingId?.slice?.(-6) || "N/A"}
                              </p>
                            </div>
                          </td>
                          <td className="p-4">
                            <p className="font-medium text-gray-800 text-sm">{transaction.customerName || "Unknown"}</p>
                            <p className="text-xs text-gray-400">{transaction.customerMobile || "N/A"}</p>
                          </td>
                          <td className="p-4">
                            <p className="text-sm text-gray-700">{formatDate(transaction.startDate)}</p>
                            <p className="text-xs text-gray-400">{transaction.startDate} - {transaction.endDate}</p>
                          </td>
                          <td className="p-4">
                            <span className="text-sm font-bold text-emerald-600">+{formatCurrency(transaction.amount)}</span>
                          </td>
                          <td className="p-4">
                            <span className={`px-3 py-1 text-xs font-bold rounded-full inline-flex items-center gap-1.5 ${paymentBadge.color}`}>
                              {getPaymentModeIcon(transaction.paymentMode)}
                              {paymentBadge.label}
                            </span>
                          </td>
                          <td className="p-4">
                            <button
                              onClick={() => handleViewDetails(transaction)}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors whitespace-nowrap"
                            >
                              <Eye size={13} /> View
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
              <div className="px-4 py-3 border-t border-gray-100 rounded-b-2xl flex flex-wrap items-center justify-between gap-2" style={{ backgroundColor: '#fafafa' }}>
                <span className="text-xs text-gray-500">
                  Showing <strong>{filteredTransactions.length}</strong> of <strong>{transactions.length}</strong> transactions
                </span>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Credits: {transactions.filter(t => t.type === 'credit').length}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                    Balance: {formatCurrency(wallet.balance)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

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
                <button
                  onClick={() => setShowWithdrawModal(false)}
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

              {/* Chamber & Customer */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <Building2 size={12} />
                    Chamber
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

export default DoctorWallet;