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
  List,
  ChevronDown,
  Sparkles,
  Flame,
  Zap,
  Award,
  Eye
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import UsersNavbar from "./UsersNavbar";
import AdminNavbar from "./AdminNavbar";
import "./Dashboard.css";

const API_URL = "http://62.72.29.27:5003";
const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000";

// Banner Images
const BANNER_IMAGES = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200",
    title: "Premium Workspaces",
    subtitle: "Designed for focus and productivity"
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1497366811355-6870744d04b2?auto=format&fit=crop&q=80&w=1200",
    title: "Collaborative Environment",
    subtitle: "Connect and grow with professionals"
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1497366811355-6870744d04b2?auto=format&fit=crop&q=80&w=1200",
    title: "Modern Amenities",
    subtitle: "Everything you need to work efficiently"
  }
];

const Spaces = () => {
  const [cabins, setCabins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [showFilters, setShowFilters] = useState(false);
  const [showInactiveModal, setShowInactiveModal] = useState(false);
  const [selectedCabin, setSelectedCabin] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [currentBanner, setCurrentBanner] = useState(0);
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

  // Auto-scroll banner
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % BANNER_IMAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const activeCabins = cabins.filter(c => c.isActive === true);

  const newlyAdded = activeCabins
    .filter(c => new Date(c.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const mostPopular = [...activeCabins]
    .sort((a, b) => (b.bookingCount || 0) - (a.bookingCount || 0))
    .slice(0, 5);

  const trending = [...activeCabins]
    .sort((a, b) => (b.trendingScore || 0) - (a.trendingScore || 0))
    .slice(0, 5);

  const featured = activeCabins
    .filter(c => c.cabinType === 'exclusive')
    .slice(0, 5);

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

  // ─── COMPACT CABIN CARD ───
  const CabinCard = ({ cabin, index, showBadge = true }) => {
    const isActive = cabin.isActive === true;
    const isExclusive = cabin.cabinType === 'exclusive';
    
    return (
      <div
        onClick={() => handleCabinClick(cabin)}
        className={`group cursor-pointer flex flex-col h-full rounded-xl overflow-hidden transition-all duration-300 ${
          isActive 
            ? 'hover:shadow-xl hover:scale-[1.03] hover:border-indigo-500/30' 
            : 'opacity-60 hover:opacity-80'
        } bg-white border border-slate-200/80`}
      >
        {/* ─── Image ─── */}
        <div className="relative overflow-hidden h-36">
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

          {/* ─── Badges ─── */}
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

          {/* ─── New Badge ─── */}
          {showBadge && isActive && new Date(cabin.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
            <div className="absolute top-2 left-2">
              <span className="bg-blue-500 text-white px-2 py-0.5 rounded-full text-[7px] font-bold shadow-lg flex items-center gap-0.5">
                <Clock size={9} />
                New
              </span>
            </div>
          )}

          {/* ─── Price & Capacity on Image ─── */}
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

        {/* ─── Content ─── */}
        <div className="p-3 space-y-1.5">
          {/* ─── Title ─── */}
          <h3 className={`text-xs font-semibold truncate ${isActive ? 'text-slate-800 group-hover:text-indigo-600' : 'text-slate-400'} transition-colors duration-300`}>
            {cabin.name}
          </h3>

          {/* ─── Location ─── */}
          <div className="flex items-center gap-0.5 text-[9px] text-slate-400 truncate">
            <MapPin size={10} className="text-indigo-400 flex-shrink-0" />
            <span className="truncate">{cabin.address || 'Location not specified'}</span>
          </div>

          {/* ─── Description - Hover pe dikhega ─── */}
          <div className="overflow-hidden max-h-0 group-hover:max-h-12 transition-all duration-500 ease-in-out">
            <p className="text-[9px] text-slate-500 font-light line-clamp-2 leading-tight">
              {cabin.description || "Premium workspace with modern amenities."}
            </p>
          </div>

          {/* ─── View Details Link - Hover pe dikhega ─── */}
          <div className="overflow-hidden max-h-0 group-hover:max-h-8 transition-all duration-500 ease-in-out pt-0 group-hover:pt-1">
            <span className={`text-[9px] font-medium flex items-center gap-0.5 ${
              isActive ? 'text-indigo-600' : 'text-slate-400'
            }`}>
              View Details
              <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
        </div>

        {/* ─── Hover Border Glow ─── */}
        <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-indigo-400/50 transition-all duration-500 pointer-events-none" />
      </div>
    );
  };

  const Section = ({ title, subtitle, children, viewAll = true }) => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            {title.split(' ').map((word, i) => (
              i === 0 ? <span key={i} className="text-indigo-600">{word}</span> : <span key={i} className="text-slate-900"> {word}</span>
            ))}
          </h2>
          {subtitle && (
            <p className="text-[10px] text-slate-400 mt-0.5">{subtitle}</p>
          )}
        </div>
        {viewAll && children?.length > 5 && (
          <button 
            onClick={() => { setSearchTerm(''); setShowFilters(true); }}
            className="text-[10px] font-medium text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-0.5"
          >
            View All <ArrowRight size={10} />
          </button>
        )}
      </div>
      <div className={`grid gap-3 ${
        viewMode === 'grid' 
          ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5' 
          : 'grid-cols-1'
      }`}>
        {children}
      </div>
    </div>
  );

  return (
    <div className="admin-dash">
      {isAdmin ? <AdminNavbar /> : <UsersNavbar />}

      <main className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16">
        
        {/* ─── WELCOME BANNER ─── */}
        <div className="text-center mb-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900">
            <span className="text-indigo-600">Welcome</span> to <span className="text-indigo-600">IRYAX Space</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-500 mt-2 max-w-2xl mx-auto">
            Discover professionally equipped cabins and desks designed for focus, collaboration, and growth.
            Find your perfect workspace today.
          </p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              {activeCabins.length} Active Spaces
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
              <Star size={10} />
              {featured.length} Premium
            </span>
          </div>
        </div>

        {/* ─── BANNER SLIDER ─── */}
        <div className="relative w-full h-48 sm:h-56 md:h-64 lg:h-72 rounded-2xl overflow-hidden mb-8 shadow-lg">
          {BANNER_IMAGES.map((banner, index) => (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                index === currentBanner 
                  ? 'opacity-100 scale-100' 
                  : 'opacity-0 scale-105'
              }`}
            >
              <img
                src={banner.url}
                alt={banner.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = PLACEHOLDER_IMAGE;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center text-center text-white">
                <div className="px-4">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                    {banner.title}
                  </h2>
                  <p className="text-xs sm:text-sm md:text-base text-white/80 mt-2 max-w-md mx-auto">
                    {banner.subtitle}
                  </p>
                </div>
              </div>
            </div>
          ))}

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {BANNER_IMAGES.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBanner(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentBanner 
                    ? 'w-6 bg-white' 
                    : 'w-1.5 bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentBanner((prev) => (prev - 1 + BANNER_IMAGES.length) % BANNER_IMAGES.length)}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white rounded-full p-1 sm:p-2 transition-all backdrop-blur-sm"
          >
            <ChevronDown size={16} className="rotate-90" />
          </button>
          <button
            onClick={() => setCurrentBanner((prev) => (prev + 1) % BANNER_IMAGES.length)}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white rounded-full p-1 sm:p-2 transition-all backdrop-blur-sm"
          >
            <ChevronDown size={16} className="-rotate-90" />
          </button>
        </div>

        {/* ─── HEADER ─── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Workspace <span className="text-indigo-600">Spaces</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Discover professionally equipped cabins and desks
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search spaces..."
                className="pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all w-full sm:w-48"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                showFilters ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Filter size={14} />
              Filters
            </button>

            <div className="flex bg-white border border-slate-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 transition-colors ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 transition-colors ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* ─── FILTERS ─── */}
        {showFilters && (
          <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-sm animate-in slide-in-from-top duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
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
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                >
                  <option value="latest">Latest Added</option>
                  <option value="oldest">Oldest First</option>
                  <option value="priceLow">Price: Low to High</option>
                  <option value="priceHigh">Price: High to Low</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setLocationFilter("");
                    setSortBy("latest");
                    setSearchTerm("");
                  }}
                  className="w-full px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </div>

            {(locationFilter || sortBy !== 'latest' || searchTerm) && (
              <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-100">
                {searchTerm && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-medium">
                    Search: {searchTerm}
                    <button onClick={() => setSearchTerm("")} className="hover:text-indigo-900">
                      <X size={10} />
                    </button>
                  </span>
                )}
                {locationFilter && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-medium">
                    Location: {locationFilter}
                    <button onClick={() => setLocationFilter("")} className="hover:text-indigo-900">
                      <X size={10} />
                    </button>
                  </span>
                )}
                {sortBy !== 'latest' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-medium">
                    Sort: {sortBy === 'priceLow' ? 'Price: Low to High' : 
                           sortBy === 'priceHigh' ? 'Price: High to Low' :
                           sortBy === 'popular' ? 'Most Popular' :
                           sortBy === 'oldest' ? 'Oldest First' : 'Latest Added'}
                    <button onClick={() => setSortBy("latest")} className="hover:text-indigo-900">
                      <X size={10} />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* ─── RESULTS COUNT ─── */}
        {searchTerm || locationFilter ? (
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs text-slate-500">
              Showing <strong className="text-slate-900">{sortedCabins.length}</strong> results
            </p>
            <span className="text-[10px] text-slate-400">
              {sortedCabins.length} of {activeCabins.length} active spaces
            </span>
          </div>
        ) : null}

        {/* ─── MAIN CONTENT ─── */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-slate-500 mt-4">Loading spaces...</p>
          </div>
        ) : activeCabins.length === 0 ? (
          <div className="bg-slate-50 rounded-2xl p-16 text-center border border-slate-200">
            <Building2 size={48} className="text-slate-300 mx-auto mb-4" />
            <p className="text-lg font-bold text-slate-600">No active spaces available</p>
            <p className="text-sm text-slate-400">Check back later for available cabins.</p>
          </div>
        ) : (
          <>
            {searchTerm || locationFilter || sortBy !== 'latest' ? (
              <div className="space-y-6">
                <h2 className="text-base font-bold text-slate-900">
                  <span className="text-indigo-600">Search</span> Results
                </h2>
                {sortedCabins.length === 0 ? (
                  <div className="bg-slate-50 rounded-2xl p-12 text-center">
                    <p className="text-slate-500">No cabins match your filters</p>
                  </div>
                ) : (
                  <div className={`grid gap-3 ${
                    viewMode === 'grid' 
                      ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5' 
                      : 'grid-cols-1'
                  }`}>
                    {sortedCabins.map((cabin, idx) => (
                      <CabinCard key={cabin._id} cabin={cabin} index={idx} showBadge={true} />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-8">
                {/* Newly Added */}
                {newlyAdded.length > 0 && (
                  <Section title="Newly Added" subtitle="Recently listed spaces">
                    {newlyAdded.slice(0, 5).map((cabin) => (
                      <CabinCard key={cabin._id} cabin={cabin} showBadge={false} />
                    ))}
                  </Section>
                )}

                {/* Most Popular */}
                {mostPopular.length > 0 && (
                  <Section title="Most Popular" subtitle="Top rated and most booked spaces">
                    {mostPopular.map((cabin) => (
                      <CabinCard key={cabin._id} cabin={cabin} showBadge={false} />
                    ))}
                  </Section>
                )}

                {/* Trending */}
                {trending.length > 0 && (
                  <Section title="Trending Now" subtitle="Currently in high demand">
                    {trending.map((cabin) => (
                      <CabinCard key={cabin._id} cabin={cabin} showBadge={false} />
                    ))}
                  </Section>
                )}

                {/* Featured / Exclusive */}
                {featured.length > 0 && (
                  <Section title="Featured Premium" subtitle="Exclusive premium workspaces">
                    {featured.map((cabin) => (
                      <CabinCard key={cabin._id} cabin={cabin} showBadge={false} />
                    ))}
                  </Section>
                )}

                {/* All Spaces */}
                <Section title="All Spaces" subtitle="Complete list of available workspaces" viewAll={false}>
                  {activeCabins.slice(0, 10).map((cabin) => (
                    <CabinCard key={cabin._id} cabin={cabin} showBadge={true} />
                  ))}
                </Section>
              </div>
            )}
          </>
        )}
      </main>

      {/* ─── INACTIVE MODAL ─── */}
      {showInactiveModal && selectedCabin && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowInactiveModal(false);
            setSelectedCabin(null);
          }
        }}>
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div style={{
              background: "linear-gradient(135deg, #ef4444 0%, #dc2626 60%, #b91c1c 100%)",
              padding: "1.5rem",
              textAlign: "center"
            }}>
              <div style={{
                width: 64, height: 64, borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 0.75rem"
              }}>
                <XCircle size={32} color="#fff" />
              </div>
              <h3 style={{ margin: 0, color: "#fff", fontSize: "1.25rem", fontWeight: 700 }}>
                Cabin Not Available
              </h3>
              <p style={{ margin: "0.25rem 0 0", color: "rgba(255,255,255,0.8)", fontSize: "0.875rem" }}>
                This cabin is currently inactive
              </p>
            </div>

            <div style={{ padding: "1.5rem" }}>
              <div style={{
                background: "#f8fafc",
                borderRadius: 12,
                padding: "1rem",
                marginBottom: "1.25rem"
              }}>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span style={{ color: "#64748b", fontSize: "0.875rem" }}>Cabin Name</span>
                    <span style={{ fontWeight: 600, color: "#1e293b" }}>{selectedCabin.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: "#64748b", fontSize: "0.875rem" }}>Address</span>
                    <span style={{ fontWeight: 500, color: "#1e293b" }}>{selectedCabin.address}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: "#64748b", fontSize: "0.875rem" }}>Status</span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border bg-red-50 text-red-700 border-red-200">
                      <XCircle size={12} />
                      Inactive
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: "#64748b", fontSize: "0.875rem" }}>Price</span>
                    <span style={{ fontWeight: 600, color: "#1e293b" }}>₹{selectedCabin.price}/hour</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: "#64748b", fontSize: "0.875rem" }}>Capacity</span>
                    <span style={{ fontWeight: 500, color: "#1e293b" }}>{selectedCabin.capacity} seats</span>
                  </div>
                </div>
              </div>

              <div style={{
                background: "#fef2f2",
                borderRadius: 8,
                padding: "0.75rem",
                marginBottom: "1.25rem",
                fontSize: "0.75rem",
                color: "#991b1b",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}>
                <AlertCircle size={16} className="shrink-0" />
                <span>This cabin is not available for booking at the moment. Please check back later or explore other active cabins.</span>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    setShowInactiveModal(false);
                    setSelectedCabin(null);
                  }}
                  style={{
                    width: "100%",
                    padding: "0.875rem",
                    borderRadius: 10,
                    border: "none",
                    background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                    color: "#fff",
                    fontFamily: "inherit",
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    boxShadow: "0 4px 14px rgba(239, 68, 68, 0.35)",
                    transition: "all 160ms",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)" }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)" }}
                >
                  <X size={18} />
                  Close
                </button>

                <button
                  onClick={() => {
                    setShowInactiveModal(false);
                    setSelectedCabin(null);
                    navigate('/spaces');
                  }}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: 10,
                    border: "1.5px solid #e2e8f0",
                    background: "#fff",
                    color: "#64748b",
                    fontFamily: "inherit",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 160ms",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#f8fafc"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#fff"; }}
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