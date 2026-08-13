// UserSiteVisits.jsx - Separate page for Site Visit bookings with Type column & filter
import axios from "axios";
import {
  Calendar,
  MapPin,
  Search,
  User,
  X,
  Eye,
  Building2,
  Stethoscope,
  Briefcase,
  Ticket,
  Hash,
  CalendarDays,
  Clock as ClockIcon,
  X as XIcon,
  Download,
  FileDown,
  CalendarPlus,
  Info,
  Layers
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SimpleUserNavbar from "./SimpleUserNavbar";
import * as XLSX from 'xlsx';
import "./Dashboard.css";

const API_URL = "https://spaceapi.iryax.com";

const UserSiteVisits = () => {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [spaceTypeFilter, setSpaceTypeFilter] = useState("all");
  const navigate = useNavigate();

  const [showViewModal, setShowViewModal] = useState(false);
  const [viewVisit, setViewVisit] = useState(null);

  // ✅ FORMAT DATE to dd/mm/yyyy
  const formatDateDDMMYYYY = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // ✅ FORMAT DATE for Indian style (dd/mm/yy)
  const formatDateIndian = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = String(d.getFullYear()).slice(2);
    return `${day}/${month}/${year}`;
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const formatTime12 = (timeStr) => {
    if (!timeStr) return "N/A";
    try {
      const [hours, minutes] = timeStr.split(':').map(Number);
      if (isNaN(hours) || isNaN(minutes)) return timeStr;
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const hours12 = hours % 12 || 12;
      return `${hours12}:${String(minutes).padStart(2, '0')} ${ampm}`;
    } catch {
      return timeStr;
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
      confirmed: { label: 'Confirmed', color: 'bg-emerald-100 text-emerald-700' },
      active: { label: 'Active', color: 'bg-indigo-100 text-indigo-700' },
      completed: { label: 'Completed', color: 'bg-blue-100 text-blue-700' },
      cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700' }
    };
    return map[status?.toLowerCase()] || { label: status || 'Unknown', color: 'bg-gray-100 text-gray-700' };
  };

  const getSpaceType = (visit) => {
    if (visit.cabin?.isChamber) return 'medical';
    return 'coworking';
  };

  const getSpaceTypeBadge = (visit) => {
    const isChamber = visit.cabin?.isChamber || false;
    return {
      label: isChamber ? 'Medical Chamber' : 'Co-Working Space',
      color: isChamber ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700',
      icon: isChamber ? <Stethoscope size={9} /> : <Briefcase size={9} />
    };
  };

  const fetchSiteVisits = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to view your site visits");
        navigate("/login");
        return;
      }

      const res = await axios.get(
        `${API_URL}/api/bookings/user`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const allBookings = res.data.bookings || [];
      const siteVisits = allBookings.filter(b => b.bookingType === 'visit');
      setVisits(siteVisits);

      if (siteVisits.length === 0) {
        toast.info("You have no site visits scheduled");
      }

    } catch (error) {
      console.error("Error fetching site visits:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      } else {
        toast.error("Failed to fetch site visits");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSiteVisits();
  }, []);

  const filteredVisits = visits.filter((v) => {
    const search = searchTerm.toLowerCase();
    const matchSearch = v.cabin?.name?.toLowerCase().includes(search) ||
                        v.cabin?.address?.toLowerCase().includes(search) ||
                        v.name?.toLowerCase().includes(search) ||
                        v.mobile?.includes(searchTerm);
    const matchDate = filterDate ? v.startDate === filterDate : true;
    const matchStatus = statusFilter === 'all' || v.status === statusFilter;
    
    const spaceType = getSpaceType(v);
    const matchSpaceType = spaceTypeFilter === 'all' || spaceType === spaceTypeFilter;
    
    return matchSearch && matchDate && matchStatus && matchSpaceType;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setFilterDate("");
    setStatusFilter("all");
    setSpaceTypeFilter("all");
  };

  const handleViewVisit = (visit) => {
    setViewVisit(visit);
    setShowViewModal(true);
    // ✅ Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  };

  // ✅ Close modal with body scroll restore
  const closeViewModal = () => {
    setShowViewModal(false);
    setViewVisit(null);
    document.body.style.overflow = '';
  };

  const exportToExcel = () => {
    try {
      if (filteredVisits.length === 0) {
        toast.warning("No visits to export");
        return;
      }
      const data = filteredVisits.map((v, i) => ({
        'S.No': i + 1,
        'Cabin': v.cabin?.name || 'Unknown',
        'Type': v.cabin?.isChamber ? 'Medical Chamber' : 'Co-Working Space',
        'Visit Date': formatDateDDMMYYYY(v.startDate),
        'Visit Time': formatTime12(v.startTime),
        'Status': getStatusBadge(v.status).label,
        'Name': v.name || 'N/A',
        'Mobile': v.mobile || 'N/A',
        'Email': v.email || 'N/A',
        'Created At': formatDateTime(v.createdAt)
      }));
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Site Visits');
      XLSX.writeFile(wb, `site_visits_${new Date().toISOString().split('T')[0]}.xlsx`);
      toast.success(`Exported ${filteredVisits.length} visits!`);
    } catch (error) {
      console.error(error);
      toast.error("Export failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SimpleUserNavbar />
        <div className="pt-24 px-4 max-w-full mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-gray-500 text-sm">Loading site visits...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statsCount = {
    total: visits.length,
    pending: visits.filter(v => v.status === 'pending').length,
    confirmed: visits.filter(v => v.status === 'confirmed').length,
    completed: visits.filter(v => v.status === 'completed').length,
    cancelled: visits.filter(v => v.status === 'cancelled').length
  };

  const statsCards = [
    {
      label: "Total",
      value: statsCount.total,
      meta: "all visits",
      icon: Ticket,
      color: "purple"
    },
    {
      label: "Pending",
      value: statsCount.pending,
      meta: "awaiting confirmation",
      icon: ClockIcon,
      color: "amber"
    },
    {
      label: "Confirmed",
      value: statsCount.confirmed,
      meta: "confirmed visits",
      icon: Calendar,
      color: "emerald"
    },
    {
      label: "Completed",
      value: statsCount.completed,
      meta: "completed visits",
      icon: CalendarDays,
      color: "blue"
    },
    {
      label: "Cancelled",
      value: statsCount.cancelled,
      meta: "cancelled visits",
      icon: XIcon,
      color: "rose"
    }
  ];

  return (
    <div className="admin-dash" style={{ backgroundColor: '#ffffff' }}>
      <SimpleUserNavbar />

      <div className="pt-20 px-3 sm:px-4 md:px-6 lg:px-8 max-w-full mx-auto pb-16">
        {/* Header */}
        <div className="admin-dash__header" style={{ marginBottom: '8px' }}>
          <div>
            <h1 className="admin-dash__greeting" style={{ fontSize: '1.25rem' }}>
              My <span style={{ color: '#7c3aed' }}>Site Visits</span>
            </h1>
            <p className="admin-dash__subtitle" style={{ fontSize: '11px' }}>Manage all your site visit appointments</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/userbooking")}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 transition flex items-center gap-2 shadow-sm shadow-indigo-200"
            >
              <Building2 size={16} />
              View Space Bookings
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="admin-dash__stats" style={{ marginBottom: '16px' }}>
          {statsCards.map((stat, index) => (
            <div
              key={index}
              className="admin-dash__stat"
              style={{
                padding: '12px 14px',
                minHeight: '80px'
              }}
            >
              <div className="admin-dash__stat-top">
                <span className="admin-dash__stat-label" style={{ fontSize: '11px' }}>{stat.label}</span>
                <div className={`admin-dash__stat-icon admin-dash__stat-icon--${stat.color}`} style={{ width: '28px', height: '28px' }}>
                  <stat.icon size={14} />
                </div>
              </div>
              <div className="admin-dash__stat-value" style={{ fontSize: '18px', fontWeight: '700' }}>{stat.value}</div>
              <div className="admin-dash__stat-meta" style={{ fontSize: '9px' }}>{stat.meta}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 mb-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search visits..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 bg-white"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 bg-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select
                value={spaceTypeFilter}
                onChange={(e) => setSpaceTypeFilter(e.target.value)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 bg-white"
              >
                <option value="all">All Types</option>
                <option value="medical">🏥 Medical Chamber</option>
                <option value="coworking">💼 Co-Working Space</option>
              </select>
              {(statusFilter !== 'all' || spaceTypeFilter !== 'all' || filterDate || searchTerm) && (
                <button
                  onClick={clearFilters}
                  className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
                  title="Clear filters"
                >
                  <XIcon size={16} />
                </button>
              )}
              {filteredVisits.length > 0 && (
                <button
                  onClick={exportToExcel}
                  className="flex items-center gap-1 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium hover:bg-purple-100 transition"
                >
                  <Download size={14} />
                  <span className="hidden xs:inline">Export</span>
                </button>
              )}
            </div>
          </div>
          <div className="mt-1.5 text-[10px] text-gray-400">
            Showing {filteredVisits.length} of {visits.length} site visits
            {spaceTypeFilter !== 'all' && ` • Filtered by: ${spaceTypeFilter === 'medical' ? 'Medical Chamber' : 'Co-Working Space'}`}
          </div>
        </div>

        {/* Visits Table - Visit ID column REMOVED */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 bg-purple-50 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-purple-600" />
              <h3 className="font-bold text-gray-800">Site Visits</h3>
              <span className="px-2 py-0.5 bg-white/60 rounded-full text-xs font-bold text-gray-600">{filteredVisits.length}</span>
            </div>
          </div>

          {filteredVisits.length === 0 ? (
            <div className="p-8 text-center">
              <div className="flex flex-col items-center text-gray-400">
                <Calendar size={32} className="opacity-20 mb-2" />
                <p className="text-sm font-medium">No site visits found</p>
                <button
                  onClick={() => navigate("/spaceforusers")}
                  className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition"
                >
                  Browse Spaces
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">S.No</th>
                    {/* ✅ Visit ID column REMOVED */}
                    <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Cabin</th>
                    <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Type</th>
                    <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Visit Date</th>
                    <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Visit Time</th>
                    <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Visitor</th>
                    <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Status</th>
                    <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Created At</th>
                    <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredVisits.map((v, idx) => {
                    const status = getStatusBadge(v.status);
                    const spaceTypeBadge = getSpaceTypeBadge(v);

                    return (
                      <tr key={v._id} className="hover:bg-purple-50/30 transition-colors">
                        <td className="px-3 py-2">
                          <span className="text-[10px] font-semibold text-gray-400">{idx + 1}</span>
                        </td>
                        {/* ✅ Visit ID column REMOVED */}
                        <td className="px-3 py-2">
                          <div>
                            <p className="font-semibold text-gray-900 text-xs">
                              {v.cabin?.name || 'Unknown Cabin'}
                            </p>
                            <p className="text-[9px] text-gray-400 flex items-center gap-0.5">
                              <MapPin size={9} />
                              {v.cabin?.address?.split(',')[0] || 'N/A'}
                            </p>
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full inline-flex items-center gap-1 ${spaceTypeBadge.color}`}>
                            {spaceTypeBadge.icon}
                            {spaceTypeBadge.label}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          <span className="text-xs font-medium text-gray-700">{formatDateDDMMYYYY(v.startDate)}</span>
                        </td>
                        <td className="px-3 py-2">
                          <span className="text-xs font-medium text-gray-700">{formatTime12(v.startTime)}</span>
                        </td>
                        <td className="px-3 py-2">
                          <div>
                            <p className="text-xs font-medium text-gray-700">{v.name || 'N/A'}</p>
                            <p className="text-[9px] text-gray-400">{v.mobile || 'N/A'}</p>
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${status.color}`}>{status.label}</span>
                        </td>
                        <td className="px-3 py-2">
                          <span className="text-[10px] text-gray-500 font-medium">{formatDateTime(v.createdAt)}</span>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <button
                            onClick={() => handleViewVisit(v)}
                            className="p-1.5 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition"
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
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-[9px] text-gray-400 font-medium tracking-wider">
          © IRYAX SPACE — All Rights Reserved
        </div>
      </div>

      {/* ============================================================ */}
      {/* ✅ FIXED VIEW MODAL - Properly Centered with No Overflow */}
      {/* ============================================================ */}
      {showViewModal && viewVisit && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={closeViewModal}
        >
          <div 
            className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 bg-gradient-to-br from-purple-600 to-indigo-600 text-white p-6 rounded-t-3xl flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold">Site Visit Details</h3>
                <p className="text-sm text-purple-200 flex items-center gap-2">
                  <Hash size={14} /> #{viewVisit._id?.slice(-8).toUpperCase()}
                </p>
                <span className="px-2 py-0.5 bg-white/20 rounded-full text-[10px] font-medium mt-1 inline-block">
                  Site Visit
                </span>
              </div>
              <button 
                onClick={closeViewModal} 
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Cabin Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <Building2 size={12} /> Cabin Details
                  </p>
                  <p className="mt-1 font-semibold text-gray-800 text-sm">{viewVisit.cabin?.name || 'N/A'}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-0.5 mt-0.5">
                    <MapPin size={10} /> {viewVisit.cabin?.address?.split(',')[0] || 'N/A'}
                  </p>
                  <div className="grid grid-cols-2 gap-1 mt-1 text-xs text-gray-500">
                    <span>Capacity: {viewVisit.cabin?.capacity || 'N/A'}</span>
                    <span>Type: {viewVisit.cabin?.cabinType || 'Normal'}</span>
                  </div>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <p className="text-[10px] font-bold text-purple-600 uppercase tracking-wider flex items-center gap-1">
                    <Layers size={12} /> Space Type
                  </p>
                  <div className="mt-2">
                    <span className={`px-3 py-1.5 text-xs font-bold rounded-full inline-flex items-center gap-2 ${
                      viewVisit.cabin?.isChamber 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {viewVisit.cabin?.isChamber ? (
                        <><Stethoscope size={14} /> Medical Chamber</>
                      ) : (
                        <><Briefcase size={14} /> Co-Working Space</>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Visitor Details */}
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1">
                  <User size={12} /> Visitor Details
                </p>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs">Name</p>
                    <p className="font-semibold">{viewVisit.name || viewVisit.user?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Mobile</p>
                    <p className="font-medium">{viewVisit.mobile || viewVisit.user?.mobile || 'N/A'}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-500 text-xs">Email</p>
                    <p className="font-medium break-all">{viewVisit.email || viewVisit.user?.email || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Visit Schedule */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <CalendarDays size={12} /> Visit Date
                  </p>
                  <p className="mt-1 font-semibold text-gray-800">{formatDateDDMMYYYY(viewVisit.startDate)}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <ClockIcon size={12} /> Visit Time
                  </p>
                  <p className="mt-1 font-bold text-purple-600">{formatTime12(viewVisit.startTime)}</p>
                </div>
              </div>

              {/* Status */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                  <Info size={12} /> Status
                </p>
                <div className="mt-2">
                  <span className={`px-3 py-1.5 text-sm font-bold rounded-full ${getStatusBadge(viewVisit.status).color}`}>
                    {getStatusBadge(viewVisit.status).label}
                  </span>
                </div>
              </div>

              {/* Created At */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                  <CalendarPlus size={12} /> Created At
                </p>
                <p className="mt-1 font-semibold text-gray-800">{formatDateTime(viewVisit.createdAt)}</p>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-200">
                <button
                  onClick={closeViewModal}
                  className="flex-1 min-w-[120px] py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition shadow-sm"
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

export default UserSiteVisits;