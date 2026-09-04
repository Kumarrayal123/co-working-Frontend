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
  MoreVertical,
  Search
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
      <div className="admin-dash" style={{ backgroundColor: '#f8fafc' }}>
        <AdminNavbar />
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin" />
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
              All <span>Support Tickets</span>
            </h1>
            <p className="admin-dash__subtitle">Manage and monitor all user support queries</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchQueries}
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
              label: "Total",
              value: stats.total,
              meta: "all support tickets",
              icon: MessageCircle,
              color: "indigo"
            },
            {
              label: "Pending",
              value: stats.pending,
              meta: "awaiting response",
              icon: Clock,
              color: "amber"
            },
            {
              label: "Read",
              value: stats.read,
              meta: "viewed tickets",
              icon: CheckCircle,
              color: "blue"
            },
            {
              label: "Replied",
              value: stats.replied,
              meta: "responded tickets",
              icon: MessageSquare,
              color: "emerald"
            },
            {
              label: "Closed",
              value: stats.closed,
              meta: "resolved tickets",
              icon: XCircleIcon,
              color: "gray"
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

        {/* Table Section */}
        <div className="admin-dash__card" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div className="admin-dash__card-header flex flex-wrap items-center justify-between gap-3" style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb' }}>
            <div className="flex items-center gap-3">
              <h3 className="admin-dash__card-title">All Queries</h3>
              <span className="px-2.5 py-0.5 text-xs font-bold text-indigo-700 bg-indigo-100 rounded-full shadow-sm">
                {filteredQueries.length}
              </span>
            </div>
          </div>

          {/* ─── FILTERS - ALWAYS VISIBLE ─── */}
          <div className="px-4 pt-4 pb-3 border-b border-gray-200" style={{ backgroundColor: '#f8fafc' }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <User size={12} className="text-indigo-500" /> Name
                </label>
                <input
                  type="text"
                  placeholder="Filter by name..."
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <Mail size={12} className="text-indigo-500" /> Email
                </label>
                <input
                  type="text"
                  placeholder="Filter by email..."
                  value={filterEmail}
                  onChange={(e) => setFilterEmail(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <Phone size={12} className="text-indigo-500" /> Phone
                </label>
                <input
                  type="text"
                  placeholder="Filter by phone..."
                  value={filterPhone}
                  onChange={(e) => setFilterPhone(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <CheckCircle size={12} className="text-indigo-500" /> Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 cursor-pointer"
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
              <button onClick={clearFilters} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-red-600 transition-all duration-200 hover:bg-red-50 rounded-lg">
                <XCircleIcon size={14} /> Clear All Filters
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="admin-dash__card-body p-0 overflow-x-auto" style={{ backgroundColor: '#ffffff' }}>
            {filteredQueries.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4 py-24 text-gray-400">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                  <MessageCircle size={40} className="text-gray-400" />
                </div>
                <p className="text-lg font-semibold text-gray-600">No queries found</p>
                <p className="text-sm text-gray-500">Try adjusting your filters.</p>
              </div>
            ) : (
              <table className="w-full min-w-[1100px] text-left">
                <thead>
                  <tr className="border-b border-gray-200" style={{ backgroundColor: '#f8fafc' }}>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-600 uppercase whitespace-nowrap">#</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-600 uppercase whitespace-nowrap">Name</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-600 uppercase whitespace-nowrap">Contact</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-600 uppercase whitespace-nowrap">Message</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-600 uppercase whitespace-nowrap">Status</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-600 uppercase whitespace-nowrap">Date</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-600 uppercase whitespace-nowrap text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredQueries.map((query, idx) => {
                    const statusBadge = getStatusBadge(query.status);
                    return (
                      <tr key={query._id} className="transition-all duration-200 group hover:bg-indigo-50/50 hover:shadow-sm">
                        <td className="p-4">
                          <span className="text-sm font-bold text-gray-400 group-hover:text-indigo-600 transition-colors">#{idx + 1}</span>
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="font-bold text-gray-900 text-sm flex items-center gap-2">
                              <User size={14} className="text-indigo-500" />
                              {query.name || 'N/A'}
                            </p>
                            <p className="text-xs text-gray-500">{query.email || 'N/A'}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1.5 text-sm text-gray-700 font-medium">
                            <Phone size={14} className="text-gray-400" />
                            {query.phone || 'N/A'}
                          </div>
                          {query.address && (
                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                              <MapPin size={10} /> {query.address}
                            </p>
                          )}
                        </td>
                        <td className="p-4">
                          <p className="text-sm text-gray-700 truncate max-w-[220px]" title={query.message}>
                            {query.message || 'No message'}
                          </p>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full shadow-sm ${statusBadge.color}`}>
                            {statusBadge.icon} {statusBadge.label}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-gray-600 font-medium">{formatDateDDMMYYYY(query.createdAt)}</span>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-2 flex-wrap">
                            <button
                              onClick={() => openViewModal(query)}
                              className="p-2.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-all duration-200 shadow-sm hover:shadow-md"
                              title="View Details"
                            >
                              <Eye size={15} />
                            </button>
                            <button
                              onClick={() => openStatusModal(query)}
                              className="p-2.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 transition-all duration-200 shadow-sm hover:shadow-md"
                              title="Update Status"
                            >
                              <Edit size={15} />
                            </button>
                            <button
                              onClick={() => openDeleteModal(query)}
                              className="p-2.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-all duration-200 shadow-sm hover:shadow-md"
                              title="Delete Query"
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
            )}
          </div>

          {/* Footer with stats */}
          {!loading && filteredQueries.length > 0 && (
            <div className="px-5 py-4 border-t border-gray-200 rounded-b-2xl flex flex-wrap items-center justify-between gap-3" style={{ backgroundColor: '#f8fafc' }}>
              <span className="text-sm text-gray-600 font-medium">
                Showing <strong className="text-indigo-600">{filteredQueries.length}</strong> of <strong className="text-gray-800">{queries.length}</strong> queries
              </span>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm"></span>
                  <span className="font-medium">Pending: {stats.pending}</span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm"></span>
                  <span className="font-medium">Read: {stats.read}</span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm"></span>
                  <span className="font-medium">Replied: {stats.replied}</span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-gray-400 shadow-sm"></span>
                  <span className="font-medium">Closed: {stats.closed}</span>
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
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setShowViewModal(false)}>
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 text-white p-6 rounded-t-3xl flex justify-between items-center shadow-lg">
              <div>
                <h3 className="text-2xl font-bold tracking-tight">Query Details</h3>
                <p className="text-sm text-indigo-200">#{selectedQuery._id.slice(-6).toUpperCase()}</p>
              </div>
              <button onClick={() => setShowViewModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 hover:scale-110" title="Close">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-4 custom-scrollbar">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <User size={12} className="text-indigo-500" /> Name
                  </p>
                  <p className="font-semibold text-gray-800">{selectedQuery.name || 'N/A'}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <Mail size={12} className="text-indigo-500" /> Email
                  </p>
                  <p className="font-semibold text-gray-800">{selectedQuery.email || 'N/A'}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <Phone size={12} className="text-indigo-500" /> Phone
                  </p>
                  <p className="font-semibold text-gray-800">{selectedQuery.phone || 'N/A'}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <CheckCircle size={12} className="text-indigo-500" /> Status
                  </p>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full shadow-sm mt-1 ${getStatusBadge(selectedQuery.status).color}`}>
                    {getStatusBadge(selectedQuery.status).icon} {getStatusBadge(selectedQuery.status).label}
                  </span>
                </div>
              </div>

              {selectedQuery.address && (
                <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <MapPin size={12} className="text-indigo-500" /> Address
                  </p>
                  <p className="font-semibold text-gray-800">{selectedQuery.address}</p>
                </div>
              )}

              <div className="p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl border border-indigo-200">
                <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <MessageCircle size={12} /> Message
                </p>
                <p className="font-semibold text-gray-800 whitespace-pre-wrap">{selectedQuery.message || 'No message'}</p>
              </div>

              <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <Calendar size={12} className="text-indigo-500" /> Created At
                </p>
                <p className="font-semibold text-gray-800">{formatDateTimeDDMMYYYY(selectedQuery.createdAt)}</p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => { setShowViewModal(false); openStatusModal(selectedQuery); }}
                  className="flex-1 py-3 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98]"
                >
                  <Edit size={16} className="inline mr-2" />
                  Update Status
                </button>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all duration-200 shadow-sm active:scale-[0.98]"
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
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => { if (window.confirm("Close without saving?")) { setShowStatusModal(false); setSelectedQuery(null); setNewStatus(""); } }}>
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-5 text-white rounded-t-3xl flex justify-between items-center shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shadow-inner backdrop-blur-sm"><Edit size={24} className="text-white" /></div>
                <div><h3 className="text-xl font-bold tracking-tight">Update Status</h3><p className="text-sm text-amber-200">{selectedQuery.name}</p></div>
              </div>
              <button onClick={() => { setShowStatusModal(false); setSelectedQuery(null); setNewStatus(""); }} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 hover:scale-110" title="Close">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 flex justify-between items-center border border-gray-200">
                <span className="text-sm text-gray-600 font-medium">Current Status</span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full shadow-sm ${getStatusBadge(selectedQuery.status).color}`}>
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
                        className={`py-2.5 rounded-xl text-xs font-bold border transition-all duration-200 ${isSelected ? 'border-amber-500 bg-amber-50 text-amber-700 shadow-sm' : 'border-gray-200 hover:bg-gray-50 text-gray-700'}`}
                      >
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>{badge.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-3 text-xs text-amber-700 flex items-start gap-2 border border-amber-200">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span className="font-medium">Changing status will update the query visibility and tracking.</span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleUpdateStatus}
                  disabled={updating || !newStatus}
                  className={`flex-1 py-3 rounded-xl text-white font-bold transition-all duration-200 ${(updating || !newStatus) ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:shadow-lg'}`}
                >
                  {updating ? 'Updating...' : 'Update Status'}
                </button>
                <button
                  onClick={() => { setShowStatusModal(false); setSelectedQuery(null); setNewStatus(""); }}
                  className="px-5 py-3 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-all duration-200"
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
        <div className="fixed inset-0 z-[1300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => { setShowDeleteModal(false); setDeleteQuery(null); }}>
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-br from-red-500 to-red-600 p-5 text-white rounded-t-3xl flex justify-between items-center shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shadow-inner backdrop-blur-sm"><Trash2 size={24} className="text-white" /></div>
                <div><h3 className="text-xl font-bold tracking-tight">Delete Query</h3><p className="text-sm text-red-200">{deleteQuery.name}</p></div>
              </div>
              <button onClick={() => { setShowDeleteModal(false); setDeleteQuery(null); }} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 hover:scale-110" title="Close">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 space-y-2 text-sm border border-red-200">
                <p className="font-bold text-red-800">Are you sure you want to delete this query?</p>
                <div className="space-y-1 text-gray-600">
                  <p><span className="text-gray-500">Name:</span> {deleteQuery.name || 'N/A'}</p>
                  <p><span className="text-gray-500">Email:</span> {deleteQuery.email || 'N/A'}</p>
                  <p><span className="text-gray-500">Message:</span> {deleteQuery.message?.substring(0, 50) || 'N/A'}</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-3 text-xs text-amber-700 flex items-start gap-2 border border-amber-200">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span className="font-medium">This action cannot be undone. All associated data will be permanently removed.</span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleDeleteQuery}
                  disabled={deleting}
                  className={`flex-1 py-3 rounded-xl text-white font-bold transition-all duration-200 ${deleting ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-red-500 to-red-600 hover:shadow-lg'}`}
                >
                  {deleting ? 'Deleting...' : 'Confirm Delete'}
                </button>
                <button
                  onClick={() => { setShowDeleteModal(false); setDeleteQuery(null); }}
                  className="px-5 py-3 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-all duration-200"
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