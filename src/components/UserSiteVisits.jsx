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
  Layers,
  Coffee
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SimpleUserNavbar from "./SimpleUserNavbar";
import * as XLSX from 'xlsx';
import "./UserSiteVisits.css";

const API_URL = "https://spaceapi.iryax.com";

const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null")
      || JSON.parse(localStorage.getItem("admin") || "null");
  } catch {
    return null;
  }
};

const normalizeId = (value) => {
  if (!value) return "";
  if (typeof value === "object") return String(value._id || value.id || "");
  return String(value);
};

const normalizeEmail = (value) => String(value || "").trim().toLowerCase();

const getBookingUserId = (booking) =>
  normalizeId(booking?.user?._id || booking?.userId?._id || booking?.userId || booking?.user);

const belongsToCurrentUser = (booking, currentUser) => {
  if (!booking || !currentUser) return false;

  const currentUserId = normalizeId(currentUser._id || currentUser.id);
  const currentEmail = normalizeEmail(currentUser.email);
  const bookingUserId = getBookingUserId(booking);
  const bookingEmails = [
    booking.email,
    booking.user?.email,
  ].map(normalizeEmail).filter(Boolean);

  const idMatch = Boolean(currentUserId && bookingUserId && bookingUserId === currentUserId);
  const emailMatch = Boolean(currentEmail && bookingEmails.includes(currentEmail));
  return idMatch || emailMatch;
};

const normalizeVisit = (booking) => ({
  ...booking,
  cabin: booking.cabin || (booking.cabinId && typeof booking.cabinId === "object" ? booking.cabinId : null),
});

const isSiteVisit = (booking) => booking?.bookingType === "visit";

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

  // ✅ UPDATED: Space Type detection - isCafe, isChamber, otherwise co-working
  const getSpaceType = (visit) => {
    const cabin = visit.cabin || {};
    if (cabin.isChamber) return 'medical';
    if (cabin.isCafe) return 'cafe';
    return 'coworking';
  };

  const getSpaceTypeBadge = (visit) => {
    const cabin = visit.cabin || {};
    if (cabin.isChamber) {
      return {
        label: 'Medical Chamber',
        color: 'bg-emerald-100 text-emerald-700',
        icon: <Stethoscope size={9} />
      };
    }
    if (cabin.isCafe) {
      return {
        label: 'Cafe',
        color: 'bg-amber-100 text-amber-700',
        icon: <Coffee size={9} />
      };
    }
    return {
      label: 'Co-Working Space',
      color: 'bg-blue-100 text-blue-700',
      icon: <Briefcase size={9} />
    };
  };

  const fetchSiteVisits = async () => {
    try {
      const token = localStorage.getItem("token");
      const currentUser = getCurrentUser();
      const currentUserId = normalizeId(currentUser?._id || currentUser?.id);

      if (!token || !currentUserId) {
        toast.error("Please login to view your site visits");
        navigate("/login");
        return;
      }

      const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

      const [userByIdRes, userRes] = await Promise.allSettled([
        axios.get(`${API_URL}/api/bookings/userbookings/${currentUserId}`, authHeaders),
        axios.get(`${API_URL}/api/bookings/user`, authHeaders),
      ]);

      const collect = (result) =>
        result.status === "fulfilled"
          ? (result.value.data?.bookings || [])
          : [];

      const mergedById = new Map();
      [...collect(userByIdRes), ...collect(userRes)].forEach((booking) => {
        if (booking?._id) mergedById.set(String(booking._id), normalizeVisit(booking));
      });

      const typedVisitsNeeded = [...mergedById.values()].some((b) => !b.bookingType);
      if (typedVisitsNeeded || mergedById.size === 0) {
        try {
          const allRes = await axios.get(`${API_URL}/api/bookings`, authHeaders);
          (allRes.data?.bookings || []).forEach((booking) => {
            if (!belongsToCurrentUser(booking, currentUser)) return;
            const id = String(booking._id);
            mergedById.set(id, {
              ...(mergedById.get(id) || {}),
              ...normalizeVisit(booking),
            });
          });
        } catch (lookupError) {
          console.error("Could not look up booking types:", lookupError);
        }
      }

      const siteVisits = [...mergedById.values()].filter((booking) =>
        isSiteVisit(booking) && belongsToCurrentUser(booking, currentUser)
      );

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
    document.body.style.overflow = 'hidden';
  };

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
      const data = filteredVisits.map((v, i) => {
        const cabin = v.cabin || {};
        let typeLabel = 'Co-Working Space';
        if (cabin.isChamber) typeLabel = 'Medical Chamber';
        else if (cabin.isCafe) typeLabel = 'Cafe';
        
        return {
          'S.No': i + 1,
          'Cabin': v.cabin?.name || 'Unknown',
          'Type': typeLabel,
          'Visit Date': formatDateDDMMYYYY(v.startDate),
          'Visit Time': formatTime12(v.startTime),
          'Status': getStatusBadge(v.status).label,
          'Name': v.name || 'N/A',
          'Mobile': v.mobile || 'N/A',
          'Email': v.email || 'N/A',
          'Created At': formatDateTime(v.createdAt)
        };
      });
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
      <div className="user-visits">
        <SimpleUserNavbar />
        <main className="p-2 sm:p-4 lg:p-6" style={{ paddingTop: "1.5rem" }}>
          <div className="user-visits__loading">
            <div className="user-visits__spinner" />
            <p className="user-visits__loading-text">Loading site visits...</p>
          </div>
        </main>
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
      color: "purple",
      onClick: () => setStatusFilter('all')
    },
    {
      label: "Pending",
      value: statsCount.pending,
      meta: "awaiting confirmation",
      icon: ClockIcon,
      color: "amber",
      onClick: () => setStatusFilter('pending')
    },
    {
      label: "Confirmed",
      value: statsCount.confirmed,
      meta: "confirmed visits",
      icon: Calendar,
      color: "emerald",
      onClick: () => setStatusFilter('confirmed')
    },
    {
      label: "Completed",
      value: statsCount.completed,
      meta: "completed visits",
      icon: CalendarDays,
      color: "blue",
      onClick: () => setStatusFilter('completed')
    },
    {
      label: "Cancelled",
      value: statsCount.cancelled,
      meta: "cancelled visits",
      icon: XIcon,
      color: "rose",
      onClick: () => setStatusFilter('cancelled')
    }
  ];

  return (
    <div className="user-visits">
      <SimpleUserNavbar />

      <main className="p-2 sm:p-4 lg:p-6" style={{ paddingTop: "1.5rem" }}>
        {/* Header */}
        <div className="user-visits__header">
          <div>
            <h1 className="user-visits__greeting">
              My <span>Site Visits</span>
            </h1>
            <p className="user-visits__subtitle">Manage all your site visit appointments</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/userbooking")}
              className="user-visits__btn user-visits__btn--primary"
            >
              <Building2 size={16} />
              View Space Bookings
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="user-visits__stats">
          {statsCards.map((stat, index) => (
            <div
              key={index}
              className={`user-visits__stat ${statusFilter === stat.label.toLowerCase() ? 'user-visits__stat--active' : ''}`}
              onClick={stat.onClick}
            >
              <div className="user-visits__stat-top">
                <span className="user-visits__stat-label">{stat.label}</span>
                <div className={`user-visits__stat-icon user-visits__stat-icon--${stat.color}`}>
                  <stat.icon size={14} />
                </div>
              </div>
              <div className="user-visits__stat-value">{stat.value}</div>
              <div className="user-visits__stat-meta">{stat.meta}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="user-visits__filters">
          <div className="user-visits__filter-row">
            <div className="user-visits__search-input">
              <Search size={14} className="user-visits__search-icon" />
              <input
                type="text"
                placeholder="Search visits..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="user-visits__filter-select"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="user-visits__filter-select"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              {/* ✅ UPDATED: Space Type filter with Cafe option */}
              <select
                value={spaceTypeFilter}
                onChange={(e) => setSpaceTypeFilter(e.target.value)}
                className="user-visits__filter-select"
              >
                <option value="all">All Types</option>
                <option value="medical">🏥 Medical Chamber</option>
                <option value="cafe">☕ Cafe</option>
                <option value="coworking">💼 Co-Working Space</option>
              </select>
              {(statusFilter !== 'all' || spaceTypeFilter !== 'all' || filterDate || searchTerm) && (
                <button
                  onClick={clearFilters}
                  className="user-visits__btn user-visits__btn--secondary"
                  title="Clear filters"
                >
                  <XIcon size={16} />
                </button>
              )}
              {filteredVisits.length > 0 && (
                <button
                  onClick={exportToExcel}
                  className="user-visits__btn user-visits__btn--secondary"
                >
                  <Download size={14} />
                  <span className="hidden xs:inline">Export</span>
                </button>
              )}
            </div>
          </div>
          <div className="mt-1.5 text-[10px] text-gray-400">
            Showing {filteredVisits.length} of {visits.length} site visits
            {spaceTypeFilter !== 'all' && ` • Filtered by: ${spaceTypeFilter === 'medical' ? 'Medical Chamber' : spaceTypeFilter === 'cafe' ? 'Cafe' : 'Co-Working Space'}`}
          </div>
        </div>

        {/* Visits Table */}
        <div className="user-visits__card">
          <div className="user-visits__card-header">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-purple-600" />
              <h3 className="user-visits__card-title">Site Visits</h3>
              <span className="px-2 py-0.5 bg-white/60 rounded-full text-xs font-bold text-gray-600">{filteredVisits.length}</span>
            </div>
          </div>

          {filteredVisits.length === 0 ? (
            <div className="user-visits__empty">
              <Calendar size={32} className="user-visits__empty-icon" />
              <p className="user-visits__empty-text">No site visits found</p>
              <button
                onClick={() => navigate("/spaceforusers")}
                className="user-visits__btn user-visits__btn--primary"
              >
                Browse Spaces
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="user-visits__table">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Cabin</th>
                    <th>Type</th>
                    <th>Visit Date</th>
                    <th>Visit Time</th>
                    <th>Visitor</th>
                    <th>Status</th>
                    <th>Created At</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVisits.map((v, idx) => {
                    const status = getStatusBadge(v.status);
                    const spaceTypeBadge = getSpaceTypeBadge(v);

                    return (
                      <tr key={v._id}>
                        <td>
                          <span className="text-[10px] font-semibold text-gray-400">{idx + 1}</span>
                        </td>
                        <td>
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
                        <td>
                          <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full inline-flex items-center gap-1 ${spaceTypeBadge.color}`}>
                            {spaceTypeBadge.icon}
                            {spaceTypeBadge.label}
                          </span>
                        </td>
                        <td>
                          <span className="text-xs font-medium text-gray-700">{formatDateDDMMYYYY(v.startDate)}</span>
                        </td>
                        <td>
                          <span className="text-xs font-medium text-gray-700">{formatTime12(v.startTime)}</span>
                        </td>
                        <td>
                          <div>
                            <p className="text-xs font-medium text-gray-700">{v.name || 'N/A'}</p>
                            <p className="text-[9px] text-gray-400">{v.mobile || 'N/A'}</p>
                          </div>
                        </td>
                        <td>
                          <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${status.color}`}>{status.label}</span>
                        </td>
                        <td>
                          <span className="text-[10px] text-gray-500 font-medium">{formatDateTime(v.createdAt)}</span>
                        </td>
                        <td className="text-center">
                          <button
                            onClick={() => handleViewVisit(v)}
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
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-[9px] text-gray-400 font-medium tracking-wider">
          © IRYAX SPACE — All Rights Reserved
        </div>
      </main>

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
                {/* ✅ UPDATED: Space Type with Cafe support */}
                <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <p className="text-[10px] font-bold text-purple-600 uppercase tracking-wider flex items-center gap-1">
                    <Layers size={12} /> Space Type
                  </p>
                  <div className="mt-2">
                    {viewVisit.cabin?.isChamber ? (
                      <span className="px-3 py-1.5 text-xs font-bold rounded-full inline-flex items-center gap-2 bg-emerald-100 text-emerald-700">
                        <Stethoscope size={14} /> Medical Chamber
                      </span>
                    ) : viewVisit.cabin?.isCafe ? (
                      <span className="px-3 py-1.5 text-xs font-bold rounded-full inline-flex items-center gap-2 bg-amber-100 text-amber-700">
                        <Coffee size={14} /> Cafe
                      </span>
                    ) : (
                      <span className="px-3 py-1.5 text-xs font-bold rounded-full inline-flex items-center gap-2 bg-blue-100 text-blue-700">
                        <Briefcase size={14} /> Co-Working Space
                      </span>
                    )}
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
                  className="user-visits__btn user-visits__btn--primary"
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