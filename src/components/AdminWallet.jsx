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
      <div className="admin-dash" style={{ backgroundColor: '#f8fafc' }}>
        <AdminNavbar />
        <div className="flex justify-center items-center h-64">
          <Loader2 size={48} className="text-indigo-500 animate-spin" />
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
              Admin <span>Wallet</span>
            </h1>
            <p className="admin-dash__subtitle">Manage and monitor all financial transactions</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
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
              label: "Available Balance",
              value: formatCurrency(walletData?.balance || 0),
              meta: `${walletData?.totalTransactions || 0} transactions`,
              icon: Wallet,
              color: "indigo"
            },
            {
              label: "Total Credits",
              value: formatCurrency(walletData?.totalCredits || 0),
              meta: "money received",
              icon: TrendingUp,
              color: "emerald"
            },
            {
              label: "Total Debits",
              value: formatCurrency(walletData?.totalDebits || 0),
              meta: "money spent",
              icon: TrendingDown,
              color: "rose"
            },
            {
              label: "Pending Credits",
              value: formatCurrency(walletData?.pendingCredits || 0),
              meta: "awaiting confirmation",
              icon: Clock,
              color: "amber"
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

        {/* Transaction Stats Summary */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 p-4 text-center shadow-sm hover:shadow-md transition-shadow">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Total Transactions</p>
            <p className="text-xl font-bold text-gray-700">{walletData?.totalTransactions || 0}</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200 p-4 text-center shadow-sm hover:shadow-md transition-shadow">
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Credits</p>
            <p className="text-xl font-bold text-emerald-700">{walletData?.totalCredits || 0}</p>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200 p-4 text-center shadow-sm hover:shadow-md transition-shadow">
            <p className="text-[10px] font-bold uppercase tracking-wider text-red-600">Debits</p>
            <p className="text-xl font-bold text-red-700">{walletData?.totalDebits || 0}</p>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="admin-dash__card" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div className="admin-dash__card-header flex flex-wrap items-center justify-between gap-3" style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb' }}>
            <div className="flex items-center gap-3">
              <h3 className="admin-dash__card-title">Transactions</h3>
              <span className="px-2.5 py-0.5 text-xs font-bold text-indigo-700 bg-indigo-100 rounded-full shadow-sm">
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
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
                />
              </div>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white transition-all duration-200 cursor-pointer"
              >
                <option value="all">All Types</option>
                <option value="credit">Credits</option>
                <option value="debit">Debits</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white transition-all duration-200 cursor-pointer"
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
                  className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md"
                  title="Export to Excel"
                >
                  <Download size={16} />
                  Export
                </button>
              )}
            </div>
          </div>

          <div className="admin-dash__card-body p-0 overflow-x-auto" style={{ backgroundColor: '#ffffff' }}>
            {transactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4 py-24 text-gray-400">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                  <Banknote size={40} className="text-gray-400" />
                </div>
                <p className="text-lg font-semibold text-gray-600">No transactions found</p>
                <p className="text-sm text-gray-500">Try adjusting your filters.</p>
              </div>
            ) : (
              <table className="w-full min-w-[900px] text-left">
                <thead>
                  <tr className="border-b border-gray-200" style={{ backgroundColor: '#f8fafc' }}>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-600 uppercase whitespace-nowrap">#</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-600 uppercase whitespace-nowrap">Date</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-600 uppercase whitespace-nowrap">Customer</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-600 uppercase whitespace-nowrap">Cabin</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-600 uppercase whitespace-nowrap">Type</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-600 uppercase whitespace-nowrap">Amount</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-600 uppercase whitespace-nowrap">Payment</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-600 uppercase whitespace-nowrap text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {transactions.map((tx, idx) => {
                    const typeBadge = getTransactionTypeBadge(tx.type);
                    const isCredit = tx.type === 'credit';

                    return (
                      <tr key={tx._id || idx} className="transition-all duration-200 group hover:bg-indigo-50/50 hover:shadow-sm">
                        <td className="p-4">
                          <span className="text-sm font-bold text-gray-400 group-hover:text-indigo-600 transition-colors">#{idx + 1}</span>
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="text-sm font-medium text-gray-700">{formatDateDDMMYYYY(tx.createdAt)}</p>
                            <p className="text-xs text-gray-500">{formatTime(tx.createdAt)}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="text-sm font-bold text-gray-800">{tx.customerName || 'N/A'}</p>
                            <p className="text-xs text-gray-500">{tx.customerMobile || 'N/A'}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="text-sm text-gray-700 truncate max-w-[140px]">{tx.cabinName || 'N/A'}</p>
                          {tx.bookingId && (
                            <p className="text-xs text-gray-500">#{tx.bookingId.slice(-8).toUpperCase()}</p>
                          )}
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 text-xs font-bold rounded-full inline-flex items-center gap-1.5 shadow-sm ${typeBadge.color}`}>
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
                          <p className="text-[9px] text-gray-400 truncate max-w-[90px]">{tx.transactionId || 'N/A'}</p>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => viewTransactionDetails(tx)}
                            className="p-2.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-all duration-200 shadow-sm hover:shadow-md"
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
            <div className="px-5 py-4 border-t border-gray-200 flex items-center justify-between" style={{ backgroundColor: '#f8fafc' }}>
              <button
                onClick={() => fetchWalletData(pagination.page - 1)}
                disabled={pagination.page === 1}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${pagination.page === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-indigo-600 hover:bg-indigo-50'}`}
              >
                Previous
              </button>
              <span className="text-sm text-gray-600 font-medium">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() => fetchWalletData(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${pagination.page === pagination.pages ? 'text-gray-400 cursor-not-allowed' : 'text-indigo-600 hover:bg-indigo-50'}`}
              >
                Next
              </button>
            </div>
          )}

          {!loading && transactions.length > 0 && (
            <div className="px-5 py-4 border-t border-gray-200 rounded-b-2xl flex flex-wrap items-center justify-between gap-3" style={{ backgroundColor: '#f8fafc' }}>
              <span className="text-sm text-gray-600 font-medium">
                Showing <strong className="text-indigo-600">{transactions.length}</strong> of <strong className="text-gray-800">{walletData?.totalTransactions || 0}</strong> transactions
              </span>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm"></span>
                  <span className="font-medium">Credits: {formatCurrency(walletData?.totalCredits || 0)}</span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm"></span>
                  <span className="font-medium">Debits: {formatCurrency(walletData?.totalDebits || 0)}</span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm"></span>
                  <span className="font-medium">Pending: {formatCurrency(walletData?.pendingCredits || 0)}</span>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── TRANSACTION DETAIL MODAL ─── */}
      {showTransactionModal && selectedTransaction && (
        <div 
          className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowTransactionModal(false);
              setSelectedTransaction(null);
            }
          }}
        >
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className={`p-6 text-white ${selectedTransaction.type === 'credit' ? 'bg-gradient-to-br from-emerald-600 to-emerald-700' : 'bg-gradient-to-br from-red-600 to-red-700'} shadow-lg`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shadow-inner backdrop-blur-sm">
                    {selectedTransaction.type === 'credit' ? (
                      <TrendingUp size={24} className="text-white" />
                    ) : (
                      <TrendingDown size={24} className="text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold tracking-tight">
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
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 hover:scale-110"
                  title="Close"
                >
                  <XIcon size={20} className="text-white" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-4 custom-scrollbar">
              {/* Amount */}
              <div className="text-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                <p className="text-sm text-gray-500 font-medium">Amount</p>
                <p className={`text-4xl font-bold ${selectedTransaction.type === 'credit' ? 'text-emerald-600' : 'text-red-600'}`}>
                  {selectedTransaction.type === 'credit' ? '+' : '-'} {formatCurrency(selectedTransaction.amount)}
                </p>
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-3">
                {/* Customer Details */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2 mb-3">
                    <User size={14} className="text-indigo-500" /> Customer Details
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Name</span>
                      <span className="text-sm font-semibold text-gray-800">{selectedTransaction.customerName || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Mobile</span>
                      <span className="text-sm font-semibold text-gray-800">{selectedTransaction.customerMobile || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Cabin Details */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2 mb-3">
                    <Building2 size={14} className="text-indigo-500" /> Cabin Details
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Cabin Name</span>
                      <span className="text-sm font-semibold text-gray-800">{selectedTransaction.cabinName || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Booking ID</span>
                      <span className="text-sm font-mono text-gray-800">{selectedTransaction.bookingId || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Start Date</span>
                      <span className="text-sm font-semibold text-gray-800">{selectedTransaction.startDate ? formatDateDDMMYYYY(selectedTransaction.startDate) : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">End Date</span>
                      <span className="text-sm font-semibold text-gray-800">{selectedTransaction.endDate ? formatDateDDMMYYYY(selectedTransaction.endDate) : 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Details */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2 mb-3">
                    <CreditCard size={14} className="text-indigo-500" /> Payment Details
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Payment Mode</span>
                      <span className="flex items-center gap-1.5 text-sm font-semibold text-gray-800">
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
                        <span className="text-sm font-semibold text-gray-800">{selectedTransaction.paymentDetails.upiId}</span>
                      </div>
                    )}
                    {selectedTransaction.paymentDetails?.upiApp && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">UPI App</span>
                        <span className="text-sm font-semibold text-gray-800">{selectedTransaction.paymentDetails.upiApp}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Transaction Details */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2 mb-3">
                    <History size={14} className="text-indigo-500" /> Transaction Details
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Description</span>
                      <span className="text-sm font-semibold text-gray-800 text-right max-w-[200px]">{selectedTransaction.description || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Type</span>
                      <span className={`px-3 py-1 text-xs font-bold rounded-full inline-flex items-center gap-1.5 shadow-sm ${selectedTransaction.type === 'credit' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
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
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2 mb-3">
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
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200"
                >
                  Close
                </button>
                {selectedTransaction.bookingId && (
                  <button
                    onClick={() => {
                      setShowTransactionModal(false);
                      navigate(`/adminbookings`);
                    }}
                    className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
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