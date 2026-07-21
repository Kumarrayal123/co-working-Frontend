import axios from "axios";
import { 
  ArrowRight, 
  MapPin, 
  Search, 
  Users, 
  Building2, 
  Edit, 
  Trash2,
  Calendar,
  Filter,
  XCircle,
  Crown,
  Sparkles
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import { toast } from "react-toastify";
import "./Dashboard.css";

const API_URL = "https://spaceapi.iryax.com";
const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000";

const AdminSpaces = () => {
  const [cabins, setCabins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_URL}/api/cabins`)
      .then((res) => {
        setCabins(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (cabinId) => {
    if (!window.confirm("Are you sure you want to delete this cabin?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/api/cabins/${cabinId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Cabin deleted successfully");
      setCabins(cabins.filter(c => c._id !== cabinId));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete cabin");
    }
  };

  const getLocations = () => {
    const locations = cabins
      .filter(c => c.address)
      .map(c => c.address.split(',')[0]?.trim())
      .filter((loc, index, self) => loc && self.indexOf(loc) === index);
    return locations;
  };

  const locations = getLocations();

  const clearFilters = () => {
    setSearchTerm("");
    setFilterLocation("");
    setFilterType("all");
    setFilterStatus("all");
  };

  const filteredCabins = cabins.filter(cabin => {
    const matchSearch = cabin.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        cabin.address?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchLocation = filterLocation ? cabin.address?.toLowerCase().includes(filterLocation.toLowerCase()) : true;
    const matchType = filterType === 'all' || cabin.cabinType === filterType;
    const matchStatus = filterStatus === 'all' || 
                       (filterStatus === 'active' && cabin.isActive === true) ||
                       (filterStatus === 'inactive' && cabin.isActive === false);
    return matchSearch && matchLocation && matchType && matchStatus;
  });

  const getImageUrl = (img) => {
    if (!img) return PLACEHOLDER_IMAGE;
    if (img.startsWith("http")) return img;
    const cleanPath = img.replace(/\\/g, "/").replace(/^\/+/, "");
    return `${API_URL}/${cleanPath}`;
  };

  if (loading) {
    return (
      <div className="admin-dash">
        <AdminNavbar />
        <div className="admin-dash__loading">
          <div className="admin-dash__spinner" />
          <p className="admin-dash__loading-text">Loading spaces...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dash">
      <AdminNavbar />

      <main className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="admin-dash__header">
          <div>
            <h1 className="admin-dash__greeting">
              All <span>Spaces</span>
            </h1>
            <p className="admin-dash__subtitle">
              Manage all coworking spaces and cabins in the platform.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search spaces..."
                className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                showFilters ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Filter size={18} />
              Filters
              {(filterLocation || filterType !== 'all' || filterStatus !== 'all') && (
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
              )}
            </button>

            {/* Clear Filters Button */}
            {(searchTerm || filterLocation || filterType !== 'all' || filterStatus !== 'all') && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 px-4 py-2.5 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors"
              >
                <XCircle size={18} />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6 shadow-sm animate-in slide-in-from-top duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Location
                </label>
                <select
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
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

              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </div>

            {/* Active Filters Display */}
            {(filterLocation || filterType !== 'all' || filterStatus !== 'all') && (
              <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-slate-100">
                {filterLocation && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-medium">
                    Location: {filterLocation}
                    <button onClick={() => setFilterLocation("")} className="hover:text-indigo-900">
                      <XCircle size={10} />
                    </button>
                  </span>
                )}
                {filterType !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-medium">
                    Type: {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                    <button onClick={() => setFilterType("all")} className="hover:text-indigo-900">
                      <XCircle size={10} />
                    </button>
                  </span>
                )}
                {filterStatus !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-medium">
                    Status: {filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
                    <button onClick={() => setFilterStatus("all")} className="hover:text-indigo-900">
                      <XCircle size={10} />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Results Count */}
        {(searchTerm || filterLocation || filterType !== 'all' || filterStatus !== 'all') && (
          <div className="flex items-center justify-between mb-4 px-1">
            <p className="text-sm text-slate-500">
              Showing <strong className="text-slate-900">{filteredCabins.length}</strong> results
            </p>
            <span className="text-xs text-slate-400">
              {filteredCabins.length} of {cabins.length} total spaces
            </span>
          </div>
        )}

        {/* Main Content */}
        {filteredCabins.length === 0 ? (
          <div className="admin-dash__error" style={{ background: '#f8fafc', borderColor: '#e2e8f0' }}>
            <Building2 size={48} className="text-slate-300 mb-4" />
            <p className="admin-dash__error-title" style={{ color: '#475569' }}>No spaces found</p>
            <p className="admin-dash__error-message">Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCabins.map((cabin) => {
              const isActive = cabin.isActive === true;
              const isExclusive = cabin.cabinType === 'exclusive';
              const isNew = new Date(cabin.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
              
              return (
                <div
                  key={cabin._id}
                  className="admin-dash__card group flex flex-col h-full hover:shadow-lg transition-all duration-300"
                >
                  {/* Image Section */}
                  <div className="relative h-48 overflow-hidden rounded-t-2xl">
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

                    {/* Badges */}
                    <div className="absolute top-3 right-3 z-30 flex flex-col gap-1.5">
                      {isExclusive && isActive && (
                        <span className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-2.5 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-1 shadow-lg">
                          <Crown size={11} />
                          Premium
                        </span>
                      )}
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

                  {/* Content Section */}
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="mb-4">
                      <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-1">
                        {isExclusive ? 'Premium Space' : 'Coworking Space'}
                      </p>
                      <h3 className="text-base font-bold text-slate-900 leading-tight line-clamp-1">{cabin.name}</h3>
                    </div>
                    <div className="flex items-start gap-3 mb-3">
                      <div className="p-2 bg-indigo-50 rounded-lg shrink-0 text-indigo-600">
                        <MapPin size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 line-clamp-1">{cabin.address?.split(',')[0] || "Location"}</p>
                        <p className="text-xs text-slate-500 line-clamp-1">{cabin.address}</p>
                      </div>
                    </div>

                    <p className="text-slate-500 text-xs leading-relaxed mb-4 line-clamp-2">
                      {cabin.description || "Experience a premium workspace designed for focus and collaboration, featuring modern amenities."}
                    </p>

                    <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="flex items-baseline gap-0.5">
                          <span className="text-xl font-bold text-slate-900">₹{cabin.price || '0'}</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase">/ Hour</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-medium text-slate-500 mt-0.5">
                          <Users size={10} />
                          {cabin.capacity} Seats
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/cabin/${cabin._id}`)}
                          className="h-10 w-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-colors"
                          title="View Details"
                        >
                          <ArrowRight size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(cabin._id)}
                          className="h-10 w-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors"
                          title="Delete Cabin"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminSpaces;