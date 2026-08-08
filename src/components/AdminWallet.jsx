// AdminWallet.jsx - Admin Wallet Dashboard
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminNavbar from "./AdminNavbar";
import {
  Wallet,
  CreditCard,
  IndianRupee,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Download,
  Eye,
  Filter,
  X as XIcon,
  RefreshCw,
  Receipt,
  User,
  Building2,
  MapPin,
  Users,
  Crown,
  Star,
  Timer,
  Hash,
  FileText,
  Plus,
  Minus,
  History,
  Banknote,
  Loader2,
  Smartphone,
  Store,
  Image,
  QrCode
} from "lucide-react";
import { toast } from "react-toastify";
import * as XLSX from 'xlsx';
import "./Dashboard.css";

const API_URL = "https://spaceapi.iryax.com";

const AdminWallet = () => {
  const [walletData, setWalletData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 0 });
  const navigate = useNavigate();

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
  const formatTime = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "N/A";
    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  };

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  // ─── FETCH WALLET DATA ───
  const fetchWalletData = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page,
        limit: 50
      });

      if (searchTerm) params.append('search', searchTerm);
      if (filterType !== 'all') params.append('type', filterType);
      if (filterStatus !== 'all') params.append('status', filterStatus);

      const res = await axios.get(`${API_URL}/api/bookings/admin-wallet?${params.toString()}`);

      if (res.data.success) {
        setWalletData(res.data.wallet);
        setTransactions(res.data.transactions);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error("Error fetching wallet:", err);
      toast.error(err.response?.data?.error || "Failed to fetch wallet");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  // ─── REFRESH ───
  const handleRefresh = () => {
    fetchWalletData(1);
    toast.info("Refreshed wallet data");
  };

  // ─── SEARCH/FILTER ───
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchWalletData(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, filterType, filterStatus]);

  // ─── EXPORT TO EXCEL ───
  const exportToExcel = () => {
    try {
      if (transactions.length === 0) {
        toast.warning("No transactions to export");
        return;
      }

      const exportData = transactions.map((tx, index) => ({
        'S.No': index + 1,
        'Date': formatDateDDMMYYYY(tx.createdAt),
        'Time': formatTime(tx.createdAt),
        'Type': tx.type === 'credit' ? 'Credit' : 'Debit',
        'Amount (₹)': tx.amount,
        'Description': tx.description || tx.reason || 'N/A',
        'Reference ID': tx.transactionId || 'N/A',
        'Booking ID': tx.bookingId || 'N/A',
        'Payment Method': tx.paymentMode || 'N/A',
        'Customer Name': tx.customerName || 'N/A',
        'Customer Mobile': tx.customerMobile || 'N/A',
        'Cabin Name': tx.cabinName || 'N/A',
        'Start Date': tx.startDate ? formatDateDDMMYYYY(tx.startDate) : 'N/A',
        'End Date': tx.endDate ? formatDateDDMMYYYY(tx.endDate) : 'N/A'
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Wallet_Transactions');
      const date = new Date().toISOString().split('T')[0];
      XLSX.writeFile(wb, `admin_wallet_${date}.xlsx`);
      toast.success(`Exported ${transactions.length} transactions!`);
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export transactions");
    }
  };

  // ─── VIEW TRANSACTION DETAILS ───
  const viewTransactionDetails = (tx) => {
    setSelectedTransaction(tx);
    setShowTransactionModal(true);
  };

  const getTransactionTypeBadge = (type) => {
    if (type === 'credit') {
      return { label: 'Credit', color: 'bg-emerald-100 text-emerald-700', icon: <TrendingUp size={14} className="text-emerald-500" /> };
    }
    return { label: 'Debit', color: 'bg-red-100 text-red-700', icon: <TrendingDown size={14} className="text-red-500" /> };
  };

  const getPaymentMethodIcon = (method) => {
    if (method === 'upi') return <Smartphone size={16} className="text-purple-500" />;
    if (method === 'cash' || method === 'counter') return <Store size={16} className="text-orange-500" />;
    if (method === 'card') return <CreditCard size={16} className="text-blue-500" />;
    return <CreditCard size={16} className="text-gray-500" />;
  };

  const getPaymentMethodLabel = (method) => {
    if (method === 'upi') return 'UPI';
    if (method === 'cash' || method === 'counter') return 'Cash';
    if (method === 'card') return 'Card';
    return method || 'N/A';
  };

  if (loading) {
    return (
      <div className="admin-dash" style={{ backgroundColor: '#ffffff' }}>
        <AdminNavbar />
        <div className="flex justify-center items-center h-64">
          <Loader2 size={48} className="text-indigo-500 animate-spin" />
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
              Admin <span>Wallet</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium hover:bg-indigo-100 transition-colors border border-indigo-200"
              title="Refresh"
            >
              <RefreshCw size={14} />
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-4 sm:p-5 text-white shadow-lg shadow-indigo-500/25">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-200">Available Balance</p>
                <p className="text-2xl sm:text-3xl font-bold mt-1">{formatCurrency(walletData?.balance || 0)}</p>
              </div>
              <div className="bg-white/20 p-2.5 rounded-xl">
                <Wallet size={22} className="text-white" />
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-white/20 flex justify-between text-[10px]">
              <span className="text-indigo-200">Total Transactions</span>
              <span className="font-semibold">{walletData?.totalTransactions || 0}</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Total Credits</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{formatCurrency(walletData?.totalCredits || 0)}</p>
              </div>
              <div className="bg-emerald-100 p-2.5 rounded-xl">
                <TrendingUp size={20} className="text-emerald-600" />
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-100 text-[10px] text-gray-500">
              Money received
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-red-600">Total Debits</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{formatCurrency(walletData?.totalDebits || 0)}</p>
              </div>
              <div className="bg-red-100 p-2.5 rounded-xl">
                <TrendingDown size={20} className="text-red-600" />
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-100 text-[10px] text-gray-500">
              Money spent
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-yellow-600">Pending Credits</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">{formatCurrency(walletData?.pendingCredits || 0)}</p>
              </div>
              <div className="bg-yellow-100 p-2.5 rounded-xl">
                <Clock size={20} className="text-yellow-600" />
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-100 text-[10px] text-gray-500">
              Awaiting confirmation
            </div>
          </div>
        </div>

        {/* Transaction Stats Summary */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-3 text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Total Transactions</p>
            <p className="text-xl font-bold text-gray-700">{walletData?.totalTransactions || 0}</p>
          </div>
          <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-3 text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Credits</p>
            <p className="text-xl font-bold text-emerald-700">{walletData?.totalCredits || 0}</p>
          </div>
          <div className="bg-red-50 rounded-xl border border-red-200 p-3 text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-red-600">Debits</p>
            <p className="text-xl font-bold text-red-700">{walletData?.totalDebits || 0}</p>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="admin-dash__card" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}>
          <div className="admin-dash__card-header flex flex-wrap items-center justify-between gap-3" style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb' }}>
            <div className="flex items-center gap-3">
              <h3 className="admin-dash__card-title">Transactions</h3>
              <span className="px-2.5 py-0.5 text-xs font-bold text-indigo-700 bg-indigo-100 rounded-full">
                {transactions.length}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-full sm:w-48">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
              >
                <option value="all">All Types</option>
                <option value="credit">Credits</option>
                <option value="debit">Debits</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>

              {transactions.length > 0 && (
                <button
                  onClick={exportToExcel}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium hover:bg-indigo-100 transition-colors border border-indigo-200"
                  title="Export to Excel"
                >
                  <Download size={14} />
                </button>
              )}
            </div>
          </div>

          <div className="admin-dash__card-body p-0 overflow-x-auto" style={{ backgroundColor: '#ffffff' }}>
            {transactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-20 text-gray-400">
                <Banknote size={48} className="opacity-20" />
                <p className="text-lg font-medium">No transactions found</p>
                <p className="text-sm">Try adjusting your filters.</p>
              </div>
            ) : (
              <table className="w-full min-w-[900px] text-left">
                <thead>
                  <tr className="border-b border-gray-100" style={{ backgroundColor: '#f9fafb' }}>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">#</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Date</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Customer</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Cabin</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Type</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Amount</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Payment</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {transactions.map((tx, idx) => {
                    const typeBadge = getTransactionTypeBadge(tx.type);
                    const isCredit = tx.type === 'credit';

                    return (
                      <tr key={tx._id || idx} className="transition-colors group hover:bg-gray-50/80">
                        <td className="p-4">
                          <span className="text-sm font-semibold text-gray-400">#{idx + 1}</span>
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="text-sm font-medium text-gray-700">{formatDateDDMMYYYY(tx.createdAt)}</p>
                            <p className="text-[10px] text-gray-400">{formatTime(tx.createdAt)}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="text-sm font-semibold text-gray-800">{tx.customerName || 'N/A'}</p>
                            <p className="text-[10px] text-gray-400">{tx.customerMobile || 'N/A'}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="text-sm text-gray-700 truncate max-w-[120px]">{tx.cabinName || 'N/A'}</p>
                          {tx.bookingId && (
                            <p className="text-[10px] text-gray-400">#{tx.bookingId.slice(-8).toUpperCase()}</p>
                          )}
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 text-xs font-bold rounded-full inline-flex items-center gap-1.5 ${typeBadge.color}`}>
                            {typeBadge.icon} {typeBadge.label}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`text-sm font-bold ${isCredit ? 'text-emerald-600' : 'text-red-600'}`}>
                            {isCredit ? '+' : '-'} {formatCurrency(tx.amount)}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1.5">
                            {getPaymentMethodIcon(tx.paymentMode)}
                            <span className="text-xs font-medium text-gray-600">{getPaymentMethodLabel(tx.paymentMode)}</span>
                          </div>
                          <p className="text-[9px] text-gray-400 truncate max-w-[80px]">{tx.transactionId || 'N/A'}</p>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => viewTransactionDetails(tx)}
                            className="p-2 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
                            title="View Details"
                          >
                            <Eye size={15} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {!loading && transactions.length > 0 && pagination.pages > 1 && (
            <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between" style={{ backgroundColor: '#fafafa' }}>
              <button
                onClick={() => fetchWalletData(pagination.page - 1)}
                disabled={pagination.page === 1}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${pagination.page === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-indigo-600 hover:bg-indigo-50'}`}
              >
                Previous
              </button>
              <span className="text-sm text-gray-500">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() => fetchWalletData(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${pagination.page === pagination.pages ? 'text-gray-400 cursor-not-allowed' : 'text-indigo-600 hover:bg-indigo-50'}`}
              >
                Next
              </button>
            </div>
          )}

          {!loading && transactions.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-100 rounded-b-2xl flex flex-wrap items-center justify-between gap-2" style={{ backgroundColor: '#fafafa' }}>
              <span className="text-xs text-gray-500">
                Showing <strong>{transactions.length}</strong> of <strong>{walletData?.totalTransactions || 0}</strong> transactions
              </span>
              <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Credits: {formatCurrency(walletData?.totalCredits || 0)}
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  Debits: {formatCurrency(walletData?.totalDebits || 0)}
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                  Pending: {formatCurrency(walletData?.pendingCredits || 0)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── TRANSACTION DETAIL MODAL ─── */}
      {showTransactionModal && selectedTransaction && (
        <div 
          className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowTransactionModal(false);
              setSelectedTransaction(null);
            }
          }}
        >
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-y-auto max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className={`p-5 text-white ${selectedTransaction.type === 'credit' ? 'bg-gradient-to-br from-emerald-600 to-emerald-700' : 'bg-gradient-to-br from-red-600 to-red-700'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                    {selectedTransaction.type === 'credit' ? (
                      <TrendingUp size={24} className="text-white" />
                    ) : (
                      <TrendingDown size={24} className="text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">
                      {selectedTransaction.type === 'credit' ? 'Credit' : 'Debit'} Transaction
                    </h3>
                    <p className="text-sm opacity-80">
                      {formatDateTimeDDMMYYYY(selectedTransaction.createdAt)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowTransactionModal(false);
                    setSelectedTransaction(null);
                  }}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  title="Close"
                >
                  <XIcon size={20} className="text-white" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Amount */}
              <div className="text-center">
                <p className="text-sm text-gray-500">Amount</p>
                <p className={`text-4xl font-bold ${selectedTransaction.type === 'credit' ? 'text-emerald-600' : 'text-red-600'}`}>
                  {selectedTransaction.type === 'credit' ? '+' : '-'} {formatCurrency(selectedTransaction.amount)}
                </p>
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-3">
                {/* Customer Details */}
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 mb-2">
                    <User size={14} className="text-indigo-500" /> Customer Details
                  </p>
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Name</span>
                      <span className="text-sm font-medium text-gray-800">{selectedTransaction.customerName || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Mobile</span>
                      <span className="text-sm font-medium text-gray-800">{selectedTransaction.customerMobile || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Cabin Details */}
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 mb-2">
                    <Building2 size={14} className="text-indigo-500" /> Cabin Details
                  </p>
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Cabin Name</span>
                      <span className="text-sm font-medium text-gray-800">{selectedTransaction.cabinName || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Booking ID</span>
                      <span className="text-sm font-mono text-gray-800">{selectedTransaction.bookingId || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Start Date</span>
                      <span className="text-sm font-medium text-gray-800">{selectedTransaction.startDate ? formatDateDDMMYYYY(selectedTransaction.startDate) : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">End Date</span>
                      <span className="text-sm font-medium text-gray-800">{selectedTransaction.endDate ? formatDateDDMMYYYY(selectedTransaction.endDate) : 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Details */}
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 mb-2">
                    <CreditCard size={14} className="text-indigo-500" /> Payment Details
                  </p>
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Payment Mode</span>
                      <span className="flex items-center gap-1.5 text-sm font-medium text-gray-800">
                        {getPaymentMethodIcon(selectedTransaction.paymentMode)}
                        {getPaymentMethodLabel(selectedTransaction.paymentMode)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Transaction ID</span>
                      <span className="text-sm font-mono text-gray-800">{selectedTransaction.transactionId || 'N/A'}</span>
                    </div>
                    {selectedTransaction.paymentDetails?.upiId && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">UPI ID</span>
                        <span className="text-sm font-medium text-gray-800">{selectedTransaction.paymentDetails.upiId}</span>
                      </div>
                    )}
                    {selectedTransaction.paymentDetails?.upiApp && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">UPI App</span>
                        <span className="text-sm font-medium text-gray-800">{selectedTransaction.paymentDetails.upiApp}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Transaction Details */}
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 mb-2">
                    <History size={14} className="text-indigo-500" /> Transaction Details
                  </p>
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Description</span>
                      <span className="text-sm font-medium text-gray-800 text-right max-w-[200px]">{selectedTransaction.description || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Type</span>
                      <span className={`px-3 py-1 text-xs font-bold rounded-full inline-flex items-center gap-1.5 ${selectedTransaction.type === 'credit' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {selectedTransaction.type === 'credit' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {selectedTransaction.type === 'credit' ? 'Credit' : 'Debit'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Date</span>
                      <span className="text-sm text-gray-800">{formatDateDDMMYYYY(selectedTransaction.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Time</span>
                      <span className="text-sm text-gray-800">{formatTime(selectedTransaction.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Screenshot */}
                {selectedTransaction.paymentDetails?.screenshot && (
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 mb-2">
                      <Image size={14} className="text-indigo-500" /> Payment Screenshot
                    </p>
                    <img 
                      src={`${API_URL}${selectedTransaction.paymentDetails.screenshot}`} 
                      alt="Payment Screenshot" 
                      className="w-full max-h-60 object-contain rounded-lg border border-gray-200"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/400x200?text=No+Image'; }}
                    />
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowTransactionModal(false);
                    setSelectedTransaction(null);
                  }}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition"
                >
                  Close
                </button>
                {selectedTransaction.bookingId && (
                  <button
                    onClick={() => {
                      setShowTransactionModal(false);
                      navigate(`/adminbookings`);
                    }}
                    className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition"
                  >
                    View Booking
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminWallet;