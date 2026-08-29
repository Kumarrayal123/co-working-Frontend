// AllCafes.jsx - Complete All Cafe & Dining Tables with CafeNavbar
import axios from "axios";
import {
  ArrowRight,
  MapPin,
  Search,
  Users,
  UtensilsCrossed,
  Coffee,
  Crown,
  Star,
  Clock,
  CheckCircle,
  Plus,
  Loader2,
  Calendar,
  Sparkles,
  Award,
  Filter,
  X,
  Eye,
  Building2,
  Trash2,
  Download,
  XCircle,
  Edit
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CafeNavbar from "./CafeNavbar";
import { toast } from "react-toastify";
import "./Dashboard.css";

const API_URL = import.meta.env.VITE_API_URL || "https://spaceapi.iryax.com";
const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=1000";

const AllCafes = () => {
  const [cabins, setCabins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const navigate = useNavigate();

  // ✅ SIRF isCafe === true WALE SHOW KARENGE
  useEffect(() => {
    axios
      .get(`${API_URL}/api/cabins`)
      .then((res) => {
        const data = res.data.cabins || res.data;
        const allCabins = Array.isArray(data) ? data : [];
        
        // ✅ SIRF isCafe === true WALE FILTER
        const cafeCabins = allCabins.filter(c => c.isCafe === true);
        
        console.log(`✅ Found ${cafeCabins.length} cafes (isCafe: true)`);
        setCabins(cafeCabins);
        setLoading(false);
        
        if (cafeCabins.length === 0) {
          toast.info("No cafes found. Add a cafe to get started.");
        }
      })
      .catch((err) => {
        console.error("Error fetching cafes:", err);
        toast.error("Failed to load cafes");
        setLoading(false);
      });
  }, []);

  // ✅ FILTERED CAFES
  const filteredCabins = cabins.filter((cabin) => {
    const matchSearch =
      cabin.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cabin.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cabin.cabin?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchLocation = locationFilter
      ? cabin.address?.toLowerCase().includes(locationFilter.toLowerCase())
      : true;
    const matchType = filterType === 'all' || cabin.cabinType === filterType;
    const matchStatus = filterStatus === 'all' || 
                       (filterStatus === 'active' && cabin.isActive === true) ||
                       (filterStatus === 'inactive' && cabin.isActive === false);
    return matchSearch && matchLocation && matchType && matchStatus;
  });

  const getSortedCabins = () => {
    let filtered = [...filteredCabins];
    if (sortBy === "latest") {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "priceLow") {
      filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === "priceHigh") {
      filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
    }
    return filtered;
  };

  const sortedCabins = getSortedCabins();

  const getImageUrl = (img) => {
    if (!img) return PLACEHOLDER_IMAGE;
    if (img.startsWith("http")) return img;
    const cleanPath = img.replace(/\\/g, "/").replace(/^\/+/, "");
    return `${API_URL}/${cleanPath}`;
  };

  // Clear filters
  const clearFilters = () => {
    setSearchTerm("");
    setLocationFilter("");
    setFilterType("all");
    setFilterStatus("all");
    setSortBy("latest");
  };

  const hasActiveFilters = searchTerm || locationFilter || filterType !== 'all' || filterStatus !== 'all';

  // Get unique locations
  const locations = [...new Set(cabins.map(c => c.address?.split(',')[0]?.trim()).filter(Boolean))];

  // Stats
  const totalCount = cabins.length;
  const activeCount = cabins.filter(c => c.isActive === true).length;
  const inactiveCount = cabins.filter(c => c.isActive === false).length;
  const exclusiveCount = cabins.filter(c => c.cabinType === 'exclusive').length;
  const normalCount = cabins.filter(c => c.cabinType !== 'exclusive').length;

  if (loading) {
    return (
      <div className="admin-dash">
        <CafeNavbar />
        <div className="admin-dash__loading">
          <div className="admin-dash__spinner" />
          <p className="admin-dash__loading-text">Loading cafes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dash" style={{ backgroundColor: '#ffffff' }}>
      <CafeNavbar />

      <main className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header - "Cafes" text color = Add Cafe button color (Indigo) */}
        <div className="admin-dash__header mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="admin-dash__greeting">
              All <span style={{ color: '#4f46e5' }}>Cafes</span>
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage all your cafe and dining spaces
            </p>
          </div>
          <button
            onClick={() => navigate("/mycafes")}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm hover:shadow-md whitespace-nowrap"
          >
            <Plus size={18} />
            Add Cafe
          </button>
        </div>

        {/* Stats Cards */}
        <div className="admin-dash__stats" style={{ marginBottom: '16px' }}>
          {[
            {
              label: "Total Cafes",
              value: totalCount,
              meta: "all dining spaces",
              icon: Coffee,
              color: "indigo"
            },
            {
              label: "Active",
              value: activeCount,
              meta: "currently active",
              icon: CheckCircle,
              color: "emerald"
            },
            {
              label: "Inactive",
              value: inactiveCount,
              meta: "currently inactive",
              icon: XCircle,
              color: "red"
            },
            {
              label: "Exclusive",
              value: exclusiveCount,
              meta: "VIP lounge",
              icon: Crown,
              color: "amber"
            },
            {
              label: "Normal",
              value: normalCount,
              meta: "regular tables",
              icon: UtensilsCrossed,
              color: "blue"
            }
          ].map((stat, index) => (
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

        {/* Filters Panel */}
        {cabins.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Search
                </label>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search cafes..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Location
                </label>
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                >
                  <option value="">All Locations</option>
                  {locations.map((loc, idx) => (
                    <option key={idx} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Type
                </label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                >
                  <option value="all">All Types</option>
                  <option value="normal">Normal</option>
                  <option value="exclusive">Exclusive</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                >
                  <option value="latest">Newest First</option>
                  <option value="priceLow">Price: Low to High</option>
                  <option value="priceHigh">Price: High to Low</option>
                </select>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-slate-100">
                {searchTerm && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-medium">
                    Search: {searchTerm}
                    <button onClick={() => setSearchTerm("")} className="hover:text-indigo-900">
                      <XCircle size={10} />
                    </button>
                  </span>
                )}
                {locationFilter && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-medium">
                    Location: {locationFilter}
                    <button onClick={() => setLocationFilter("")} className="hover:text-indigo-900">
                      <XCircle size={10} />
                    </button>
                  </span>
                )}
                {filterType !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-medium">
                    Type: {filterType}
                    <button onClick={() => setFilterType("all")} className="hover:text-indigo-900">
                      <XCircle size={10} />
                    </button>
                  </span>
                )}
                {filterStatus !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-medium">
                    Status: {filterStatus}
                    <button onClick={() => setFilterStatus("all")} className="hover:text-indigo-900">
                      <XCircle size={10} />
                    </button>
                  </span>
                )}
                <button
                  onClick={clearFilters}
                  className="px-2.5 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-medium hover:bg-red-100 transition-colors flex items-center gap-1"
                >
                  <X size={12} /> Clear All
                </button>
              </div>
            )}
          </div>
        )}

        {/* Results Count */}
        {(hasActiveFilters) && (
          <div className="flex items-center justify-between mb-4 px-1">
            <p className="text-sm text-slate-500">
              Showing <strong className="text-slate-900">{sortedCabins.length}</strong> results
            </p>
            <span className="text-xs text-slate-400">
              {sortedCabins.length} of {cabins.length} total cafes
            </span>
          </div>
        )}

        {/* Main Content - Card Grid with Book Now Button */}
        {sortedCabins.length === 0 ? (
          <div className="admin-dash__error" style={{ background: '#f8fafc', borderColor: '#e2e8f0' }}>
            <Coffee size={48} className="text-slate-300 mb-4" />
            <p className="admin-dash__error-title" style={{ color: '#475569' }}>
              No cafes found
            </p>
            <p className="admin-dash__error-message">
              {hasActiveFilters ? "Try adjusting your filters." : "No cafes have been added yet."}
            </p>
            {!hasActiveFilters && (
              <button
                onClick={() => navigate("/mycafes")}
                className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                Add Your First Cafe
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedCabins.map((cabin) => {
              const isActive = cabin.isActive === true;
              const isExclusive = cabin.cabinType === 'exclusive';
              const isNew = new Date(cabin.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
              const cafeName = cabin.name?.includes(" - ") ? cabin.name.split(" - ")[0] : cabin.name;
              const tableNum = cabin.cabin || cabin.tableNumber || (cabin.name?.includes(" - ") ? cabin.name.split(" - ")[1] : "Table");
              
              return (
                <div
                  key={cabin._id}
                  className="admin-dash__card group flex flex-col h-full hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative h-48 overflow-hidden rounded-t-2xl cursor-pointer" onClick={() => navigate(`/cafe/${cabin._id}`)}>
                    <div className="absolute inset-0 bg-slate-200 animate-pulse" />
                    <img
                      src={cabin.images?.[0] ? getImageUrl(cabin.images[0]) : PLACEHOLDER_IMAGE}
                      alt={cabin.name}
                      className="w-full h-full object-cover relative z-10 group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = PLACEHOLDER_IMAGE;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent z-20 opacity-40" />

                    <div className="absolute top-3 right-3 z-30 flex flex-col gap-1.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold shadow-lg flex items-center gap-1 ${
                        isExclusive 
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white' 
                          : 'bg-blue-500 text-white'
                      }`}>
                        {isExclusive ? <Crown size={10} /> : <UtensilsCrossed size={10} />}
                        {isExclusive ? 'VIP' : 'Cafe'}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold shadow-lg flex items-center gap-1 ${
                        isActive ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white animate-pulse' : 'bg-white/70'}`}></span>
                        {isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    {isNew && isActive && (
                      <div className="absolute top-3 left-3 z-30">
                        <span className="bg-blue-500 text-white px-2.5 py-0.5 rounded-full text-[8px] font-bold shadow-lg flex items-center gap-1">
                          <Sparkles size={10} />
                          New
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex flex-col flex-grow">
                    <div className="mb-4 cursor-pointer" onClick={() => navigate(`/cafe/${cabin._id}`)}>
                      <p className="text-[10px] font-bold uppercase tracking-widest mb-1 flex items-center gap-1.5">
                        <span className={isExclusive ? 'text-amber-600' : 'text-blue-600'}>
                          {isExclusive ? 'VIP Lounge' : 'Cafe Table'}
                        </span>
                      </p>
                      <h3 className="text-base font-bold text-slate-900 leading-tight line-clamp-1">{cafeName}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{tableNum}</p>
                    </div>
                    <div className="flex items-start gap-3 mb-3 cursor-pointer" onClick={() => navigate(`/cafe/${cabin._id}`)}>
                      <div className="p-2 bg-indigo-50 rounded-lg shrink-0 text-indigo-600">
                        <MapPin size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 line-clamp-1">{cabin.address?.split(',')[0] || "Location"}</p>
                        <p className="text-xs text-slate-500 line-clamp-1">{cabin.address}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-600 py-2.5 border-y border-slate-100 my-2 cursor-pointer" onClick={() => navigate(`/cafe/${cabin._id}`)}>
                      <span className="flex items-center gap-1 font-semibold">
                        <Users size={13} className="text-slate-400" /> {cabin.capacity || 4} Guests
                      </span>
                      <span className="flex items-center gap-1 font-semibold">
                        <Clock size={13} className="text-slate-400" /> {cabin.is24x7 ? "24x7" : `${cabin.openTime || "08:00"} - ${cabin.closeTime || "23:00"}`}
                      </span>
                    </div>

                    <p className="text-slate-500 text-xs leading-relaxed mb-4 line-clamp-2 cursor-pointer" onClick={() => navigate(`/cafe/${cabin._id}`)}>
                      {cabin.description || (isExclusive 
                        ? "Premium VIP lounge with exclusive amenities and personalized service." 
                        : "Cozy cafe perfect for work, meetings, and networking.")}
                    </p>

                    <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="cursor-pointer" onClick={() => navigate(`/cafe/${cabin._id}`)}>
                        <div className="flex items-baseline gap-0.5">
                          <span className="text-xl font-bold text-slate-900">₹{cabin.price || '0'}</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase">/ Hour</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-medium text-slate-500 mt-0.5">
                          <Users size={10} />
                          {cabin.capacity || 4} Guests
                        </div>
                      </div>

                      {/* ✅ ONLY BOOK NOW BUTTON - NO EDIT/DELETE ICONS */}
                      <button
                        onClick={() => navigate(`/book/${cabin._id}`)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200 flex items-center gap-1.5"
                      >
                        <Calendar size={14} />
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <div className="mt-12 text-center text-[9px] text-slate-400 font-medium tracking-wider border-t border-slate-200 pt-6 max-w-7xl mx-auto px-4">
        © IRYAX SPACE — All Rights Reserved
      </div>
    </div>
  );
};

export default AllCafes;