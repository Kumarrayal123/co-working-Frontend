// AllQueries.jsx - Complete Component with Always Visible Filters, No Date
import axios from "axios";
import {
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Eye,
  Edit,
  Trash2,
  XCircle as XCircleIcon,
  CheckCircle,
  Clock,
  MessageSquare,
  Check,
  X,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  MoreVertical
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AdminNavbar from "./AdminNavbar";
import "./Dashboard.css";

const API_URL = "https://spaceapi.iryax.com";

const AllQueries = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterName, setFilterName] = useState("");
  const [filterEmail, setFilterEmail] = useState("");
  const [filterPhone, setFilterPhone] = useState("");
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteQuery, setDeleteQuery] = useState(null);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    read: 0,
    replied: 0,
    closed: 0
  });

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchQueries = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/cabins/allqueries`);
      const data = res.data.data || [];
      setQueries(data);
      calculateStats(data);
    } catch (error) {
      console.error("Error fetching queries:", error);
      toast.error("Failed to fetch queries");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    const total = data.length;
    const pending = data.filter(q => q.status === 'pending').length;
    const read = data.filter(q => q.status === 'read').length;
    const replied = data.filter(q => q.status === 'replied').length;
    const closed = data.filter(q => q.status === 'closed').length;
    setStats({ total, pending, read, replied, closed });
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  const handleUpdateStatus = async () => {
    if (!selectedQuery || !newStatus) {
      toast.error("Please select a status");
      return;
    }

    setUpdating(true);
    try {
      const res = await axios.patch(
        `${API_URL}/api/cabins/updatequery/${selectedQuery._id}`,
        { status: newStatus }
      );

      if (res.data.success) {
        toast.success(`Query status updated to ${newStatus}`);
        setShowStatusModal(false);
        setSelectedQuery(null);
        setNewStatus("");
        fetchQueries();
      }
    } catch (error) {
      console.error("Update status error:", error);
      toast.error(error.response?.data?.message || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteQuery = async () => {
    if (!deleteQuery) return;

    setDeleting(true);
    try {
      const res = await axios.delete(
        `${API_URL}/api/cabins/deletequery/${deleteQuery._id}`
      );

      if (res.data.success) {
        toast.success("Query deleted successfully");
        setShowDeleteModal(false);
        setDeleteQuery(null);
        fetchQueries();
      }
    } catch (error) {
      console.error("Delete query error:", error);
      toast.error(error.response?.data?.message || "Failed to delete query");
    } finally {
      setDeleting(false);
    }
  };

  const openViewModal = (query) => {
    setSelectedQuery(query);
    setShowViewModal(true);
  };

  const openStatusModal = (query) => {
    setSelectedQuery(query);
    setNewStatus(query.status || "pending");
    setShowStatusModal(true);
  };

  const openDeleteModal = (query) => {
    setDeleteQuery(query);
    setShowDeleteModal(true);
  };

  const getStatusBadge = (status) => {
    const map = {
      pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700', icon: <Clock size={12} className="text-yellow-500" /> },
      read: { label: 'Read', color: 'bg-blue-100 text-blue-700', icon: <CheckCircle size={12} className="text-blue-500" /> },
      replied: { label: 'Replied', color: 'bg-emerald-100 text-emerald-700', icon: <MessageSquare size={12} className="text-emerald-500" /> },
      closed: { label: 'Closed', color: 'bg-gray-100 text-gray-700', icon: <XCircleIcon size={12} className="text-gray-500" /> }
    };
    return map[status?.toLowerCase()] || { label: status || 'Unknown', color: 'bg-gray-100 text-gray-700', icon: <AlertCircle size={12} className="text-gray-500" /> };
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const clearFilters = () => {
    setFilterStatus("all");
    setFilterName("");
    setFilterEmail("");
    setFilterPhone("");
  };

  const filteredQueries = queries.filter(q => {
    const matchName = q.name?.toLowerCase().includes(filterName.toLowerCase()) || filterName === "";
    const matchEmail = q.email?.toLowerCase().includes(filterEmail.toLowerCase()) || filterEmail === "";
    const matchPhone = q.phone?.includes(filterPhone) || filterPhone === "";
    const matchStatus = filterStatus === 'all' || q.status === filterStatus;
    return matchName && matchEmail && matchPhone && matchStatus;
  });

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
              All <span>Queries</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchQueries}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium hover:bg-indigo-100 transition-colors border border-indigo-200"
            >
              <RefreshCw size={14} />
              <span className="hidden xs:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 mb-6">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-4 text-white shadow-lg shadow-indigo-500/25">
            <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-200">Total</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-yellow-600">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Read</p>
            <p className="text-2xl font-bold text-blue-600">{stats.read}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Replied</p>
            <p className="text-2xl font-bold text-emerald-600">{stats.replied}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-600">Closed</p>
            <p className="text-2xl font-bold text-gray-600">{stats.closed}</p>
          </div>
        </div>

        {/* Table Section */}
        <div className="admin-dash__card" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}>
          <div className="admin-dash__card-header flex flex-wrap items-center justify-between gap-3" style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb' }}>
            <div className="flex items-center gap-3">
              <h3 className="admin-dash__card-title">All Queries</h3>
              <span className="px-2.5 py-0.5 text-xs font-bold text-indigo-700 bg-indigo-100 rounded-full">
                {filteredQueries.length}
              </span>
            </div>
          </div>

          {/* ─── FILTERS - ALWAYS VISIBLE ─── */}
          <div className="px-4 pt-4 pb-3 border-b border-gray-100" style={{ backgroundColor: '#fafafa' }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Name</label>
                <input
                  type="text"
                  placeholder="Filter by name..."
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Email</label>
                <input
                  type="text"
                  placeholder="Filter by email..."
                  value={filterEmail}
                  onChange={(e) => setFilterEmail(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Phone</label>
                <input
                  type="text"
                  placeholder="Filter by phone..."
                  value={filterPhone}
                  onChange={(e) => setFilterPhone(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end mt-3">
              <button onClick={clearFilters} className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-red-600 transition-colors">
                <XCircleIcon size={14} /> Clear All Filters
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="admin-dash__card-body p-0 overflow-x-auto" style={{ backgroundColor: '#ffffff' }}>
            {filteredQueries.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-20 text-gray-400">
                <MessageCircle size={48} className="opacity-20" />
                <p className="text-lg font-medium">No queries found</p>
                <p className="text-sm">Try adjusting your filters.</p>
              </div>
            ) : (
              <table className="w-full min-w-[1100px] text-left">
                <thead>
                  <tr className="border-b border-gray-100" style={{ backgroundColor: '#f9fafb' }}>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">#</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Name</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Contact</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Message</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Status</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Date</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredQueries.map((query, idx) => {
                    const statusBadge = getStatusBadge(query.status);
                    return (
                      <tr key={query._id} className="transition-colors group hover:bg-gray-50/80">
                        <td className="p-4">
                          <span className="text-sm font-semibold text-gray-400">#{idx + 1}</span>
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                              <User size={14} className="text-indigo-500" />
                              {query.name || 'N/A'}
                            </p>
                            <p className="text-[10px] text-gray-400">{query.email || 'N/A'}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1.5 text-sm text-gray-700">
                            <Phone size={14} className="text-gray-400" />
                            {query.phone || 'N/A'}
                          </div>
                          {query.address && (
                            <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                              <MapPin size={10} /> {query.address}
                            </p>
                          )}
                        </td>
                        <td className="p-4">
                          <p className="text-sm text-gray-700 truncate max-w-[200px]" title={query.message}>
                            {query.message || 'No message'}
                          </p>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full ${statusBadge.color}`}>
                            {statusBadge.icon} {statusBadge.label}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-gray-500">{formatDate(query.createdAt)}</span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <button
                              onClick={() => openViewModal(query)}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors whitespace-nowrap"
                              title="View Details"
                            >
                              <Eye size={13} /> View
                            </button>
                            <button
                              onClick={() => openStatusModal(query)}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors whitespace-nowrap"
                              title="Update Status"
                            >
                              <Edit size={13} /> Status
                            </button>
                            <button
                              onClick={() => openDeleteModal(query)}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-700 hover:bg-red-100 transition-colors whitespace-nowrap"
                              title="Delete Query"
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
          {!loading && filteredQueries.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-100 rounded-b-2xl flex flex-wrap items-center justify-between gap-2" style={{ backgroundColor: '#fafafa' }}>
              <span className="text-xs text-gray-500">
                Showing <strong>{filteredQueries.length}</strong> of <strong>{queries.length}</strong> queries
              </span>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                  Pending: {stats.pending}
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Read: {stats.read}
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Replied: {stats.replied}
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                  Closed: {stats.closed}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ====================== */}
      {/* VIEW QUERY MODAL */}
      {/* ====================== */}
      {showViewModal && selectedQuery && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowViewModal(false)}>
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-gradient-to-br from-indigo-600 to-purple-600 text-white p-6 rounded-t-3xl flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold">Query Details</h3>
                <p className="text-sm text-indigo-200">#{selectedQuery._id.slice(-6).toUpperCase()}</p>
              </div>
              <button onClick={() => setShowViewModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Name</p>
                  <p className="mt-1 font-semibold text-gray-800">{selectedQuery.name || 'N/A'}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email</p>
                  <p className="mt-1 font-semibold text-gray-800">{selectedQuery.email || 'N/A'}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Phone</p>
                  <p className="mt-1 font-semibold text-gray-800">{selectedQuery.phone || 'N/A'}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Status</p>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full mt-1 ${getStatusBadge(selectedQuery.status).color}`}>
                    {getStatusBadge(selectedQuery.status).icon} {getStatusBadge(selectedQuery.status).label}
                  </span>
                </div>
              </div>

              {selectedQuery.address && (
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Address</p>
                  <p className="mt-1 font-semibold text-gray-800">{selectedQuery.address}</p>
                </div>
              )}

              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Message</p>
                <p className="mt-1 font-semibold text-gray-800 whitespace-pre-wrap">{selectedQuery.message || 'No message'}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Created At</p>
                <p className="mt-1 font-semibold text-gray-800">{formatDate(selectedQuery.createdAt)}</p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => { setShowViewModal(false); openStatusModal(selectedQuery); }}
                  className="flex-1 py-3 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition shadow-sm active:scale-[0.98]"
                >
                  <Edit size={16} className="inline mr-2" />
                  Update Status
                </button>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition shadow-sm active:scale-[0.98]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================== */}
      {/* UPDATE STATUS MODAL */}
      {/* ====================== */}
      {showStatusModal && selectedQuery && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => { if (window.confirm("Close without saving?")) { setShowStatusModal(false); setSelectedQuery(null); setNewStatus(""); } }}>
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-5 text-white rounded-t-3xl flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center"><Edit size={20} className="text-white" /></div>
                <div><h3 className="text-xl font-bold">Update Status</h3><p className="text-sm text-amber-200">{selectedQuery.name}</p></div>
              </div>
              <button onClick={() => { setShowStatusModal(false); setSelectedQuery(null); setNewStatus(""); }} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"><X size={20} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-gray-50 rounded-xl p-4 flex justify-between items-center">
                <span className="text-sm text-gray-500">Current Status</span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full ${getStatusBadge(selectedQuery.status).color}`}>
                  {getStatusBadge(selectedQuery.status).icon} {getStatusBadge(selectedQuery.status).label}
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Select New Status</label>
                <div className="grid grid-cols-2 gap-2">
                  {['pending', 'read', 'replied', 'closed'].map((status) => {
                    const badge = getStatusBadge(status);
                    const isSelected = newStatus === status;
                    return (
                      <button
                        key={status}
                        onClick={() => setNewStatus(status)}
                        className={`py-2.5 rounded-xl text-xs font-bold border transition ${isSelected ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-gray-200 hover:bg-gray-50 text-gray-700'}`}
                      >
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>{badge.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="bg-amber-50 rounded-xl p-3 text-xs text-amber-700 flex items-start gap-2 border border-amber-200">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>Changing status will update the query visibility and tracking.</span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleUpdateStatus}
                  disabled={updating || !newStatus}
                  className={`flex-1 py-3 rounded-xl text-white font-bold transition ${(updating || !newStatus) ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:shadow-lg'}`}
                >
                  {updating ? 'Updating...' : 'Update Status'}
                </button>
                <button
                  onClick={() => { setShowStatusModal(false); setSelectedQuery(null); setNewStatus(""); }}
                  className="px-5 py-3 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================== */}
      {/* DELETE QUERY MODAL */}
      {/* ====================== */}
      {showDeleteModal && deleteQuery && (
        <div className="fixed inset-0 z-[1300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => { setShowDeleteModal(false); setDeleteQuery(null); }}>
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-br from-red-500 to-red-600 p-5 text-white rounded-t-3xl flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center"><Trash2 size={20} className="text-white" /></div>
                <div><h3 className="text-xl font-bold">Delete Query</h3><p className="text-sm text-red-200">{deleteQuery.name}</p></div>
              </div>
              <button onClick={() => { setShowDeleteModal(false); setDeleteQuery(null); }} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"><X size={20} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-red-50 rounded-xl p-4 space-y-2 text-sm">
                <p className="font-bold text-red-800">Are you sure you want to delete this query?</p>
                <div className="space-y-1 text-gray-600">
                  <p><span className="text-gray-500">Name:</span> {deleteQuery.name || 'N/A'}</p>
                  <p><span className="text-gray-500">Email:</span> {deleteQuery.email || 'N/A'}</p>
                  <p><span className="text-gray-500">Message:</span> {deleteQuery.message?.substring(0, 50) || 'N/A'}</p>
                </div>
              </div>

              <div className="bg-amber-50 rounded-xl p-3 text-xs text-amber-700 flex items-start gap-2 border border-amber-200">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>This action cannot be undone. All associated data will be permanently removed.</span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleDeleteQuery}
                  disabled={deleting}
                  className={`flex-1 py-3 rounded-xl text-white font-bold transition ${deleting ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-red-500 to-red-600 hover:shadow-lg'}`}
                >
                  {deleting ? 'Deleting...' : 'Confirm Delete'}
                </button>
                <button
                  onClick={() => { setShowDeleteModal(false); setDeleteQuery(null); }}
                  className="px-5 py-3 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition"
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

export default AllQueries;