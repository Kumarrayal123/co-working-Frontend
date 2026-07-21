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
  RefreshCw
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import UsersNavbar from "./UsersNavbar";
import AdminNavbar from "./AdminNavbar";
import "./Dashboard.css";

const API_URL = "https://spaceapi.iryax.com";
const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000";

const Spaces = () => {
  const [cabins, setCabins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [showFilters, setShowFilters] = useState(false);
  const [showInactiveModal, setShowInactiveModal] = useState(false);
  const [selectedCabin, setSelectedCabin] = useState(null);
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem("admin") !== null;

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

  // ─── CABIN CARD ─── (Height increased)
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
        {/* Image - Height increased */}
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

        {/* Content - More padding for height */}
        <div className="p-3 sm:p-4 space-y-1.5 sm:space-y-2 flex-1 flex flex-col">
          <h3 className={`text-sm font-semibold truncate ${isActive ? 'text-slate-800 group-hover:text-indigo-600' : 'text-slate-400'} transition-colors duration-300`}>
            {cabin.name}
          </h3>

          <div className="flex items-center gap-0.5 text-[10px] text-slate-400 truncate">
            <MapPin size={12} className="text-indigo-400 flex-shrink-0" />
            <span className="truncate">{cabin.address?.split(',')[0] || 'Location'}</span>
          </div>

          <div className="overflow-hidden max-h-0 group-hover:max-h-16 transition-all duration-500 ease-in-out">
            <p className="text-[10px] text-slate-500 font-light line-clamp-2 leading-relaxed">
              {cabin.description || "Premium workspace with modern amenities and high-speed internet."}
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

  return (
    <div className="admin-dash" style={{ backgroundColor: '#ffffff' }}>
      {isAdmin ? <AdminNavbar /> : <UsersNavbar />}

      <div className="pt-24 px-3 sm:px-4 md:px-6 lg:px-8 max-w-full mx-auto pb-16">
        {/* Header */}
        <div className="admin-dash__header">
          <div>
            <h1 className="admin-dash__greeting">
              Workspace <span>Spaces</span>
            </h1>
            <p className="admin-dash__subtitle">
              Discover professionally equipped cabins and desks for your work.
            </p>
          </div>
          <div className="admin-dash__date-pill">
            <Calendar size={16} />
            <span>
              {new Date().toLocaleDateString("en-US", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Filter Section */}
        <div className="admin-dash__card">
          <div className="admin-dash__card-body py-3 px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                  <Filter size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-800">Filter Spaces</h4>
                  <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">Find your perfect workspace</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                {/* Search */}
                <div className="relative flex-1 md:flex-none">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <input
                    type="text"
                    placeholder="Search spaces..."
                    className="pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 w-full md:w-44"
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
              {sortedCabins.length} of {activeCabins.length} active spaces
            </span>
          </div>
        )}

        {/* Main Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin" />
            <p className="text-sm text-gray-500 mt-4">Loading spaces...</p>
          </div>
        ) : activeCabins.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-20 text-gray-400">
            <Building2 size={48} className="opacity-20" />
            <p className="text-lg font-medium">No active spaces available</p>
            <p className="text-sm">Check back later for available cabins.</p>
          </div>
        ) : (
          <>
            {searchTerm || locationFilter || sortBy !== 'latest' ? (
              // Search Results - 4 columns
              <div className="mt-6">
                {sortedCabins.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-3 py-20 text-gray-400">
                    <Search size={48} className="opacity-20" />
                    <p className="text-lg font-medium">No cabins match your filters</p>
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
                        <p className="text-[10px] text-gray-400">Recently listed spaces</p>
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
                        <p className="text-[10px] text-gray-400">Top rated and most booked spaces</p>
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
                        <p className="text-[10px] text-gray-400">Exclusive premium workspaces</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                      {featured.slice(0, 4).map((cabin) => (
                        <CabinCard key={cabin._id} cabin={cabin} showBadge={false} />
                      ))}
                    </div>
                  </div>
                )}

                {/* All Spaces */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">
                        <span className="text-indigo-600">All</span> Spaces
                      </h3>
                      <p className="text-[10px] text-gray-400">Complete list of available workspaces</p>
                    </div>
                    <span className="text-[10px] text-gray-400">{activeCabins.length} spaces</span>
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
              <h3 className="text-xl font-bold">Cabin Not Available</h3>
              <p className="text-sm text-red-100 mt-1">This cabin is currently inactive</p>
            </div>

            <div className="p-5 space-y-4">
              <div className="bg-gray-50 rounded-xl p-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Cabin Name</span>
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
              </div>

              <div className="bg-red-50 rounded-xl p-3 text-xs text-red-700 flex items-start gap-2 border border-red-200">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>This cabin is not available for booking at the moment. Please check back later or explore other active cabins.</span>
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
                  Explore Active Cabins
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Spaces;