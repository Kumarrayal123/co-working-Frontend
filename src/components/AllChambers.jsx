// AllChambers.jsx - Complete All Chambers Component with DoctorNavbar (Only isChamber: true)
import axios from "axios";
import { 
  ArrowRight, 
  MapPin, 
  Search, 
  Users, 
  Building2, 
  Crown, 
  Star, 
  AlertCircle, 
  X, 
  XCircle,
  Filter,
  Clock,
  TrendingUp,
  LayoutGrid,
  ChevronDown,
  Sparkles,
  Flame,
  Zap,
  Award,
  Eye,
  Calendar,
  Home,
  Wallet,
  IndianRupee,
  Plus,
  ArrowUpRight,
  RefreshCw,
  Activity,
  CheckCircle,
  Shield,
  Stethoscope
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DoctorNavbar from "./DoctorNavbar";
import "./Dashboard.css";

const API_URL = "https://spaceapi.iryax.com";
const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000";

const AllChambers = () => {
  const [cabins, setCabins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [showFilters, setShowFilters] = useState(false);
  const [showInactiveModal, setShowInactiveModal] = useState(false);
  const [selectedCabin, setSelectedCabin] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_URL}/api/cabins`)
      .then((res) => {
        // ✅ ONLY FILTER isChamber === true
        const allCabins = res.data;
        const chamberCabins = allCabins.filter(c => c.isChamber === true);
        setCabins(chamberCabins);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // ✅ Only active chambers (isChamber: true already filtered)
  const activeCabins = cabins.filter(c => c.isActive === true);

  const newlyAdded = activeCabins
    .filter(c => new Date(c.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const mostPopular = [...activeCabins]
    .sort((a, b) => (b.bookingCount || 0) - (a.bookingCount || 0))
    .slice(0, 4);

  const trending = [...activeCabins]
    .sort((a, b) => (b.trendingScore || 0) - (a.trendingScore || 0))
    .slice(0, 4);

  const featured = activeCabins
    .filter(c => c.cabinType === 'exclusive')
    .slice(0, 4);

  const filteredCabins = activeCabins.filter(cabin => {
    const matchSearch = cabin.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        cabin.address?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchLocation = locationFilter ? cabin.address?.toLowerCase().includes(locationFilter.toLowerCase()) : true;
    return matchSearch && matchLocation;
  });

  const getSortedCabins = () => {
    let filtered = [...filteredCabins];
    if (sortBy === "latest") {
      filtered = filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "oldest") {
      filtered = filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === "priceLow") {
      filtered = filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === "priceHigh") {
      filtered = filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === "popular") {
      filtered = filtered.sort((a, b) => (b.bookingCount || 0) - (a.bookingCount || 0));
    }
    return filtered;
  };

  const sortedCabins = getSortedCabins();

  const getLocations = () => {
    const locations = cabins
      .filter(c => c.address)
      .map(c => c.address.split(',')[0]?.trim())
      .filter((loc, index, self) => loc && self.indexOf(loc) === index);
    return locations;
  };

  const locations = getLocations();

  const handleCabinClick = (cabin) => {
    if (cabin.isActive === true) {
      navigate(`/cabin/${cabin._id}`);
    } else {
      setSelectedCabin(cabin);
      setShowInactiveModal(true);
    }
  };

  const getImageUrl = (img) => {
    if (!img) return PLACEHOLDER_IMAGE;
    if (img.startsWith("http")) return img;
    const cleanPath = img.replace(/\\/g, "/").replace(/^\/+/, "");
    return `${API_URL}/${cleanPath}`;
  };

  // ─── CABIN CARD ───
  const CabinCard = ({ cabin, showBadge = true }) => {
    const isActive = cabin.isActive === true;
    const isExclusive = cabin.cabinType === 'exclusive';

    return (
      <div
        onClick={() => handleCabinClick(cabin)}
        className={`group cursor-pointer flex flex-col h-full rounded-xl overflow-hidden transition-all duration-300 ${
          isActive 
            ? 'hover:shadow-xl hover:scale-[1.02] hover:border-indigo-500/30' 
            : 'opacity-60 hover:opacity-80'
        } bg-white border border-slate-200/80`}
      >
        {/* Image */}
        <div className="relative overflow-hidden h-44 sm:h-48 md:h-52">
          <img
            src={cabin.images?.[0] ? getImageUrl(cabin.images[0]) : PLACEHOLDER_IMAGE}
            alt={cabin.name}
            className={`w-full h-full object-cover transition-transform duration-500 ${
              isActive ? 'group-hover:scale-110' : ''
            }`}
            onError={(e) => {
              e.target.src = PLACEHOLDER_IMAGE;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Badges */}
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            {isExclusive && isActive && (
              <span className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-2 py-0.5 rounded-full text-[8px] font-bold flex items-center gap-0.5 shadow-lg">
                <Crown size={10} />
                Premium
              </span>
            )}
            {/* ✅ Chamber Badge */}
            {cabin.isChamber && isActive && (
              <span className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-2 py-0.5 rounded-full text-[8px] font-bold flex items-center gap-0.5 shadow-lg">
                🏛️ Chamber
              </span>
            )}
            <span className={`${
              isActive 
                ? 'bg-emerald-500 text-white' 
                : 'bg-red-500 text-white'
            } px-2 py-0.5 rounded-full text-[8px] font-bold shadow-lg flex items-center gap-0.5`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white animate-pulse' : 'bg-white/70'}`}></span>
              {isActive ? 'Available' : 'Inactive'}
            </span>
          </div>

          {/* New Badge */}
          {showBadge && isActive && new Date(cabin.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
            <div className="absolute top-2 left-2">
              <span className="bg-blue-500 text-white px-2 py-0.5 rounded-full text-[7px] font-bold shadow-lg flex items-center gap-0.5">
                <Clock size={9} />
                New
              </span>
            </div>
          )}

          {/* Price & Capacity on Image */}
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
            <span className="text-white font-bold text-sm">
              ₹{cabin.price || '0'}
              <span className="text-white/70 text-[9px] ml-0.5">/hr</span>
            </span>
            <span className="bg-black/50 backdrop-blur-sm text-white text-[9px] px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <Users size={10} />
              {cabin.capacity || 'N/A'}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4 space-y-1.5 sm:space-y-2 flex-1 flex flex-col">
          <h3 className={`text-sm font-semibold truncate ${isActive ? 'text-slate-800 group-hover:text-indigo-600' : 'text-slate-400'} transition-colors duration-300`}>
            {cabin.name}
          </h3>

          <div className="flex items-center gap-0.5 text-[10px] text-slate-400 truncate">
            <MapPin size={12} className="text-indigo-400 flex-shrink-0" />
            <span className="truncate">{cabin.address?.split(',')[0] || 'Location'}</span>
          </div>

          {/* Timing */}
          <div className="flex items-center gap-1 text-[9px] text-slate-400">
            <Clock size={10} className="text-indigo-400 flex-shrink-0" />
            {cabin.is24x7 ? (
              <span className="text-emerald-600 font-medium">24×7</span>
            ) : (
              <span>
                {cabin.openTime ? formatTimeDisplay(cabin.openTime) : 'N/A'} - {cabin.closeTime ? formatTimeDisplay(cabin.closeTime) : 'N/A'}
              </span>
            )}
          </div>

          <div className="overflow-hidden max-h-0 group-hover:max-h-16 transition-all duration-500 ease-in-out">
            <p className="text-[10px] text-slate-500 font-light line-clamp-2 leading-relaxed">
              {cabin.description || "Premium chamber with modern amenities."}
            </p>
          </div>

          <div className="overflow-hidden max-h-0 group-hover:max-h-8 transition-all duration-500 ease-in-out pt-0 group-hover:pt-1 mt-auto">
            <span className={`text-[10px] font-medium flex items-center gap-0.5 ${
              isActive ? 'text-indigo-600' : 'text-slate-400'
            }`}>
              View Details
              <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
        </div>

        <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-indigo-400/50 transition-all duration-500 pointer-events-none" />
      </div>
    );
  };

  // Format time for display
  const formatTimeDisplay = (time) => {
    if (!time) return 'N/A';
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm}`;
  };

  return (
    <div className="admin-dash" style={{ backgroundColor: '#ffffff' }}>
      <DoctorNavbar />

      <div className="pt-24 px-3 sm:px-4 md:px-6 lg:px-8 max-w-full mx-auto pb-16">
        {/* Header */}
        <div className="admin-dash__header mb-4 flex items-center justify-between">
          <div>
            <h1 className="admin-dash__greeting">
              All <span>Chambers</span>
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Browse and discover available chambers across all locations
            </p>
          </div>
          <button
            onClick={() => navigate("/mychambers")}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
          >
            <Plus size={14} />
            <span>Add Chamber</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="admin-dash__stats">
          <div className="admin-dash__stat cursor-pointer" onClick={() => navigate("/mychambers")}>
            <div className="admin-dash__stat-top">
              <span className="admin-dash__stat-label">Total Chambers</span>
              <div className="admin-dash__stat-icon bg-indigo-100 text-indigo-600">
                <Home size={18} />
              </div>
            </div>
            <div className="admin-dash__stat-value">{cabins.length}</div>
            <div className="admin-dash__stat-meta">{activeCabins.length} active</div>
          </div>
          <div className="admin-dash__stat">
            <div className="admin-dash__stat-top">
              <span className="admin-dash__stat-label">Active</span>
              <div className="admin-dash__stat-icon bg-emerald-100 text-emerald-600">
                <CheckCircle size={18} />
              </div>
            </div>
            <div className="admin-dash__stat-value">{activeCabins.length}</div>
            <div className="admin-dash__stat-meta">Available for booking</div>
          </div>
          <div className="admin-dash__stat">
            <div className="admin-dash__stat-top">
              <span className="admin-dash__stat-label">Inactive</span>
              <div className="admin-dash__stat-icon bg-gray-100 text-gray-600">
                <XCircle size={18} />
              </div>
            </div>
            <div className="admin-dash__stat-value">{cabins.length - activeCabins.length}</div>
            <div className="admin-dash__stat-meta">Currently unavailable</div>
          </div>
          <div className="admin-dash__stat">
            <div className="admin-dash__stat-top">
              <span className="admin-dash__stat-label">Premium</span>
              <div className="admin-dash__stat-icon bg-amber-100 text-amber-600">
                <Crown size={18} />
              </div>
            </div>
            <div className="admin-dash__stat-value">{cabins.filter(c => c.cabinType === 'exclusive').length}</div>
            <div className="admin-dash__stat-meta">Exclusive chambers</div>
          </div>
          <div className="admin-dash__stat">
            <div className="admin-dash__stat-top">
              <span className="admin-dash__stat-label">Medical</span>
              <div className="admin-dash__stat-icon bg-rose-100 text-rose-600">
                <Stethoscope size={18} />
              </div>
            </div>
            <div className="admin-dash__stat-value">{cabins.filter(c => c.isChamber === true).length}</div>
            <div className="admin-dash__stat-meta">Chamber spaces</div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="admin-dash__card mt-6">
          <div className="admin-dash__card-body py-3 px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                  <Filter size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-800">Filter Chambers</h4>
                  <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">Find your perfect chamber</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                {/* Search */}
                <div className="relative flex-1 md:flex-none">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <input
                    type="text"
                    placeholder="Search chambers..."
                    className="pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 w-full md:w-44 shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Location Filter */}
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="text-xs bg-white border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold text-gray-700 shadow-sm"
                >
                  <option value="">All Locations</option>
                  {locations.map((loc, idx) => (
                    <option key={idx} value={loc}>{loc}</option>
                  ))}
                </select>

                {/* Sort By */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-xs bg-white border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold text-gray-700 shadow-sm"
                >
                  <option value="latest">Latest</option>
                  <option value="popular">Popular</option>
                  <option value="priceLow">Price: Low</option>
                  <option value="priceHigh">Price: High</option>
                </select>

                {/* Clear Filters */}
                {(searchTerm || locationFilter || sortBy !== 'latest') && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setLocationFilter("");
                      setSortBy("latest");
                    }}
                    className="px-3 py-1.5 text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        {(searchTerm || locationFilter || sortBy !== 'latest') && (
          <div className="flex items-center justify-between mt-4 px-1">
            <p className="text-xs text-gray-500">
              Showing <strong className="text-gray-900">{sortedCabins.length}</strong> results
            </p>
            <span className="text-[10px] text-gray-400">
              {sortedCabins.length} of {activeCabins.length} active chambers
            </span>
          </div>
        )}

        {/* Main Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin" />
            <p className="text-sm text-gray-500 mt-4">Loading chambers...</p>
          </div>
        ) : activeCabins.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-20 text-gray-400">
            <Building2 size={48} className="opacity-20" />
            <p className="text-lg font-medium">No active chambers available</p>
            <p className="text-sm">Check back later for available chambers.</p>
          </div>
        ) : (
          <>
            {searchTerm || locationFilter || sortBy !== 'latest' ? (
              // Search Results - 4 columns
              <div className="mt-6">
                {sortedCabins.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-3 py-20 text-gray-400">
                    <Search size={48} className="opacity-20" />
                    <p className="text-lg font-medium">No chambers match your filters</p>
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setLocationFilter("");
                        setSortBy("latest");
                      }}
                      className="text-xs font-medium text-indigo-600 hover:text-indigo-800"
                    >
                      Clear all filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                    {sortedCabins.map((cabin) => (
                      <CabinCard key={cabin._id} cabin={cabin} showBadge={true} />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              // Sections - 4 columns
              <div className="space-y-8 mt-6">
                {/* Newly Added */}
                {newlyAdded.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-sm font-bold text-gray-900">
                          <span className="text-indigo-600">Newly</span> Added
                        </h3>
                        <p className="text-[10px] text-gray-400">Recently listed chambers</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                      {newlyAdded.slice(0, 4).map((cabin) => (
                        <CabinCard key={cabin._id} cabin={cabin} showBadge={false} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Most Popular */}
                {mostPopular.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-sm font-bold text-gray-900">
                          <span className="text-indigo-600">Most</span> Popular
                        </h3>
                        <p className="text-[10px] text-gray-400">Top rated and most booked chambers</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                      {mostPopular.slice(0, 4).map((cabin) => (
                        <CabinCard key={cabin._id} cabin={cabin} showBadge={false} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Trending */}
                {trending.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-sm font-bold text-gray-900">
                          <span className="text-indigo-600">Trending</span> Now
                        </h3>
                        <p className="text-[10px] text-gray-400">Currently in high demand</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                      {trending.slice(0, 4).map((cabin) => (
                        <CabinCard key={cabin._id} cabin={cabin} showBadge={false} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Featured Premium */}
                {featured.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-sm font-bold text-gray-900">
                          <span className="text-amber-600">Featured</span> Premium
                        </h3>
                        <p className="text-[10px] text-gray-400">Exclusive premium chambers</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                      {featured.slice(0, 4).map((cabin) => (
                        <CabinCard key={cabin._id} cabin={cabin} showBadge={false} />
                      ))}
                    </div>
                  </div>
                )}

                {/* All Chambers */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">
                        <span className="text-indigo-600">All</span> Chambers
                      </h3>
                      <p className="text-[10px] text-gray-400">Complete list of available chambers</p>
                    </div>
                    <span className="text-[10px] text-gray-400">{activeCabins.length} chambers</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                    {activeCabins.map((cabin) => (
                      <CabinCard key={cabin._id} cabin={cabin} showBadge={true} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ─── INACTIVE MODAL ─── */}
      {showInactiveModal && selectedCabin && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowInactiveModal(false);
            setSelectedCabin(null);
          }
        }}>
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 text-center text-white">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
                <XCircle size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold">Chamber Not Available</h3>
              <p className="text-sm text-red-100 mt-1">This chamber is currently inactive</p>
            </div>

            <div className="p-5 space-y-4">
              <div className="bg-gray-50 rounded-xl p-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Chamber Name</span>
                  <span className="font-semibold text-gray-800">{selectedCabin.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Address</span>
                  <span className="font-medium text-gray-700">{selectedCabin.address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status</span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                    <XCircle size={12} />
                    Inactive
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Price</span>
                  <span className="font-bold text-gray-800">₹{selectedCabin.price}/hour</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Capacity</span>
                  <span className="font-medium text-gray-700">{selectedCabin.capacity} seats</span>
                </div>
                {selectedCabin.isChamber && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Type</span>
                    <span className="font-medium text-rose-600">🏛️ Chamber</span>
                  </div>
                )}
              </div>

              <div className="bg-red-50 rounded-xl p-3 text-xs text-red-700 flex items-start gap-2 border border-red-200">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>This chamber is not available for booking at the moment. Please check back later or explore other active chambers.</span>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    setShowInactiveModal(false);
                    setSelectedCabin(null);
                  }}
                  className="w-full py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition shadow-sm active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <X size={16} />
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowInactiveModal(false);
                    setSelectedCabin(null);
                  }}
                  className="w-full py-3 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition"
                >
                  Explore Active Chambers
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllChambers;