import axios from "axios";
import {
  MapPin,
  Search,
  Users,
  Building2,
  Crown,
  Star,
  AlertCircle,
  X,
  XCircle,
  Clock,
  TrendingUp,
  LayoutGrid,
  ChevronDown,
  Sparkles,
  Flame,
  Award,
  Eye,
  Plus,
  Heart,
  Zap,
  Navigation,
  Stethoscope,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DoctorNavbar from "./DoctorNavbar";
import "./Dashboard.css";

const API_URL = "https://spaceapi.iryax.com";
const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000";

const AllCabins = () => {
  const [cabins, setCabins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [showInactiveModal, setShowInactiveModal] = useState(false);
  const [selectedCabin, setSelectedCabin] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const navigate = useNavigate();

  const currentUser = (() => {
    try {
      const doctorStr = localStorage.getItem("doctor");
      const userStr = localStorage.getItem("user");
      const adminStr = localStorage.getItem("admin");
      if (doctorStr) return JSON.parse(doctorStr);
      if (userStr) return JSON.parse(userStr);
      if (adminStr) return JSON.parse(adminStr);
      return null;
    } catch {
      return null;
    }
  })();

  const userId = currentUser?._id || currentUser?.id;
  const token = localStorage.getItem("token") || localStorage.getItem("doctorToken");

  const getAuthHeader = () => {
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    axios
      .get(`${API_URL}/api/cabins`)
      .then((res) => {
        const allCabins = res.data;
        const chamberCabins = allCabins.filter((c) => c.isChamber === true);
        setCabins(chamberCabins);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (userId && token) {
      fetchWishlist();
    }
  }, [userId, token]);

  const fetchWishlist = async () => {
    if (!userId || !token) return;
    try {
      const res = await axios.get(
        `${API_URL}/api/cabins/mywishlist/${userId}`,
        getAuthHeader()
      );
      setWishlist(res.data.wishlist || []);
    } catch (err) {
      console.error("Error fetching wishlist:", err);
    }
  };

  const toggleWishlist = async (cabinId, e) => {
    if (e) e.stopPropagation();

    if (!userId || !token) {
      toast.error("Please login to add to wishlist");
      navigate("/doctorlogin");
      return;
    }

    setWishlistLoading(true);
    try {
      const res = await axios.post(
        `${API_URL}/api/cabins/toggle/${userId}`,
        { cabinId },
        getAuthHeader()
      );

      if (res.data.action === "added") {
        setWishlist(res.data.wishlist || []);
        toast.success("Added to wishlist! ❤️");
      } else if (res.data.action === "removed") {
        setWishlist(res.data.wishlist || []);
        toast.success("Removed from wishlist");
      }
    } catch (err) {
      console.error("Error toggling wishlist:", err);
      toast.error(err.response?.data?.error || "Failed to update wishlist");
    } finally {
      setWishlistLoading(false);
    }
  };

  const isInWishlist = (cabinId) => {
    return wishlist.some((item) => item._id === cabinId || item === cabinId);
  };

  const activeCabins = cabins.filter((c) => c.isActive === true);

  const newlyAdded = activeCabins
    .filter((c) => new Date(c.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const mostPopular = [...activeCabins]
    .sort((a, b) => (b.bookingCount || 0) - (a.bookingCount || 0))
    .slice(0, 4);

  const trending = [...activeCabins]
    .sort((a, b) => (b.trendingScore || 0) - (a.trendingScore || 0))
    .slice(0, 4);

  const featured = activeCabins.filter((c) => c.cabinType === "exclusive").slice(0, 4);

  const filteredCabins = activeCabins.filter((cabin) => {
    const matchSearch =
      cabin.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cabin.address?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchLocation = locationFilter
      ? cabin.address?.toLowerCase().includes(locationFilter.toLowerCase())
      : true;
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
      .filter((c) => c.address)
      .map((c) => c.address.split(",")[0]?.trim())
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

  const getTypeLabel = (cabin) => {
    if (cabin.isChamber) return "Medical Chamber";
    if (cabin.cabinType === "exclusive") return "Private Chamber";
    if (cabin.cabinType === "meeting") return "Consultation";
    return "Chamber";
  };

  const getTypeColor = (cabin) => {
    if (cabin.cabinType === "exclusive") return "bg-emerald-100 text-emerald-700 border-emerald-200";
    if (cabin.cabinType === "meeting") return "bg-purple-100 text-purple-700 border-purple-200";
    return "bg-red-100 text-red-700 border-red-200";
  };

  const filterOptions = [
    { id: "all", label: "All", icon: Zap },
    { id: "top-rated", label: "Top Rated", icon: Award },
    { id: "new", label: "New Added", icon: Sparkles },
    { id: "nearest", label: "Nearest", icon: Navigation },
  ];

  const isFilterActive = searchTerm || locationFilter || sortBy !== "latest" || activeFilter !== "all";

  const CabinCard = ({ cabin, showBadge = true }) => {
    const isActive = cabin.isActive === true;
    const isExclusive = cabin.cabinType === "exclusive";
    const inWishlist = isInWishlist(cabin._id);
    const cabinType = getTypeLabel(cabin);
    const typeColor = getTypeColor(cabin);

    return (
      <div
        onClick={() => handleCabinClick(cabin)}
        className={`group cursor-pointer flex flex-col h-full rounded-2xl overflow-hidden transition-all duration-300 ${
          isActive
            ? "hover:shadow-2xl hover:-translate-y-2 hover:border-indigo-400/40"
            : "opacity-60 hover:opacity-80"
        } bg-white border border-slate-200/80 shadow-sm hover:shadow-xl`}
      >
        <div className="relative overflow-hidden h-48 sm:h-52 md:h-56 bg-gradient-to-br from-gray-100 to-gray-50">
          <img
            src={cabin.images?.[0] ? getImageUrl(cabin.images[0]) : PLACEHOLDER_IMAGE}
            alt={cabin.name}
            className={`w-full h-full object-cover transition-transform duration-700 ${
              isActive ? "group-hover:scale-110" : ""
            }`}
            onError={(e) => {
              e.target.src = PLACEHOLDER_IMAGE;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-10">
            <span className={`px-3 py-1 text-[10px] font-bold rounded-full border backdrop-blur-md shadow-sm ${typeColor}`}>
              {cabinType}
            </span>
            {isExclusive && isActive && (
              <span className="px-3 py-1 text-[10px] font-bold rounded-full bg-amber-100/95 text-amber-700 border border-amber-300 flex items-center gap-1 backdrop-blur-md shadow-sm">
                <Crown size={11} /> Exclusive
              </span>
            )}
            {cabin.is24x7 && (
              <span className="px-3 py-1 text-[10px] font-bold rounded-full bg-emerald-100/95 text-emerald-700 border border-emerald-300 flex items-center gap-1 backdrop-blur-md shadow-sm">
                <Clock size={11} /> 24x7
              </span>
            )}
            {showBadge && isActive && new Date(cabin.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
              <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-lg flex items-center gap-1">
                <Sparkles size={11} />
                New
              </span>
            )}
          </div>

          <button
            className={`absolute top-3 right-3 w-10 h-10 backdrop-blur-md rounded-full flex items-center justify-center transition-all duration-300 shadow-lg z-10 ${
              inWishlist
                ? "bg-red-500 text-white hover:bg-red-600 hover:scale-110"
                : "bg-white/95 hover:bg-white text-gray-500 hover:text-red-500 hover:scale-110"
            } ${wishlistLoading ? "opacity-50 pointer-events-none" : ""}`}
            onClick={(e) => toggleWishlist(cabin._id, e)}
            disabled={wishlistLoading}
          >
            <Heart size={16} className={inWishlist ? "fill-current" : ""} />
          </button>

          <div className="absolute bottom-3 left-3 z-10">
            <span
              className={`${
                isActive
                  ? "bg-emerald-500/95 backdrop-blur-md text-white"
                  : "bg-red-500/95 backdrop-blur-md text-white"
              } px-3 py-1 rounded-full text-[10px] font-bold shadow-lg flex items-center gap-1.5`}
            >
              <span className={`w-2 h-2 rounded-full ${isActive ? "bg-white animate-pulse" : "bg-white/70"}`}></span>
              {isActive ? "Available" : "Inactive"}
            </span>
          </div>

          <div className="absolute bottom-3 right-3 bg-gradient-to-r from-black/80 to-black/60 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg z-10">
            <span className="text-white font-bold text-base">₹{cabin.price || "0"}</span>
            <span className="text-white/60 text-[10px] font-light ml-1">/hr</span>
          </div>
        </div>

        <div className="p-5 space-y-2 flex-1 flex flex-col">
          <h3
            className={`text-base font-semibold truncate ${
              isActive ? "text-slate-800 group-hover:text-indigo-600" : "text-slate-400"
            } transition-colors duration-300`}
          >
            {cabin.name}
          </h3>

          <div className="flex items-center gap-1 text-xs text-slate-400 truncate">
            <MapPin size={13} className="text-indigo-500 flex-shrink-0" />
            <span className="truncate">{cabin.address?.split(",")[0] || "Location"}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Star size={13} className="text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-medium text-gray-700">4.8</span>
            <span className="text-[10px] text-gray-400">(24 reviews)</span>
          </div>

          <div className="overflow-hidden max-h-0 group-hover:max-h-20 transition-all duration-500 ease-in-out">
            <p className="text-xs text-slate-500 font-light line-clamp-2 leading-relaxed">
              {cabin.description || "Professional medical chamber with modern amenities and a comfortable setup."}
            </p>
          </div>

          <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
              <Users size={12} className="text-indigo-500" /> {cabin.capacity || "N/A"} seats
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCabinClick(cabin);
              }}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-medium rounded-xl transition-all duration-300 flex items-center gap-1.5 shadow-md hover:shadow-lg hover:shadow-indigo-200 transform hover:-translate-y-0.5"
            >
              <Eye size={12} /> View
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="admin-dash" style={{ backgroundColor: "#f8fafc" }}>
      <DoctorNavbar />

      <div className="pt-24 px-3 sm:px-4 md:px-6 lg:px-8 max-w-7xl mx-auto pb-16">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                  <Stethoscope size={24} className="text-white" />
                </div>
                All <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Chambers</span>
              </h1>
              <p className="text-sm text-gray-500 mt-2 font-medium">
                Discover available medical chambers across all locations
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-2 rounded-xl border border-indigo-100 flex items-center gap-2">
                <TrendingUp size={16} className="text-indigo-600" />
                <span className="text-sm font-bold text-gray-700">{activeCabins.length}</span>
                <span className="text-xs text-gray-500 font-medium">chambers</span>
              </div>
              <button
                onClick={() => navigate("/mychambers")}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-indigo-200 transition-all duration-300"
              >
                <Plus size={16} />
                <span>Add Cabin</span>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg shadow-gray-100/50 border border-gray-100 p-5 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, address, or description..."
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-gray-50 hover:bg-white transition-all duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-gray-50 hover:bg-white transition-all duration-200 min-w-[140px] appearance-none cursor-pointer"
                >
                  <option value="">All Locations</option>
                  {locations.map((loc, idx) => (
                    <option key={idx} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              <div className="relative">
                <LayoutGrid size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-gray-50 hover:bg-white transition-all duration-200 min-w-[130px] appearance-none cursor-pointer"
                >
                  <option value="latest">Latest</option>
                  <option value="popular">Popular</option>
                  <option value="priceLow">Price: Low</option>
                  <option value="priceHigh">Price: High</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              {(searchTerm || locationFilter || sortBy !== "latest") && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setLocationFilter("");
                    setSortBy("latest");
                  }}
                  className="p-3 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200"
                  title="Clear filters"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          {filterOptions.map((filter) => {
            const Icon = filter.icon;
            const isActive = activeFilter === filter.id;
            return (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 transform hover:-translate-y-0.5"
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-indigo-300"
                }`}
              >
                <Icon size={16} />
                {filter.label}
              </button>
            );
          })}
          {activeFilter !== "all" && (
            <button
              onClick={() => setActiveFilter("all")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200"
            >
              <X size={16} /> Clear
            </button>
          )}
        </div>

        {isFilterActive && (
          <div className="flex items-center justify-between mb-4 px-2">
            <p className="text-sm text-gray-600 font-medium">
              Showing <strong className="text-indigo-600">{sortedCabins.length}</strong> results
            </p>
            <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
              {sortedCabins.length} of {activeCabins.length} chambers
            </span>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-indigo-200 rounded-full" />
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin" />
            </div>
            <p className="text-base font-medium text-gray-600 mt-6">Loading chambers...</p>
            <p className="text-sm text-gray-400 mt-2">Please wait while we fetch available medical chambers</p>
          </div>
        ) : activeCabins.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-6 py-24 text-gray-400 bg-white rounded-2xl shadow-lg shadow-gray-100/50 border border-gray-100">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl flex items-center justify-center">
              <Building2 size={40} className="text-gray-300" />
            </div>
            <div className="text-center">
              <p className="text-xl font-semibold text-gray-600">No active chambers available</p>
              <p className="text-sm text-gray-400 mt-2">Check back later for available chambers.</p>
            </div>
          </div>
        ) : (
          <>
            {isFilterActive ? (
              <div className="mt-6">
                {sortedCabins.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-6 py-24 text-gray-400 bg-white rounded-2xl shadow-lg shadow-gray-100/50 border border-gray-100">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl flex items-center justify-center">
                      <Search size={40} className="text-gray-300" />
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-semibold text-gray-600">No chambers match your filters</p>
                      <button
                        onClick={() => {
                          setSearchTerm("");
                          setLocationFilter("");
                          setSortBy("latest");
                          setActiveFilter("all");
                        }}
                        className="mt-4 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-indigo-200 transition-all duration-300"
                      >
                        Clear all filters
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-5">
                    {sortedCabins.map((cabin) => (
                      <CabinCard key={cabin._id} cabin={cabin} showBadge={true} />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-10 mt-6">
                {newlyAdded.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <Sparkles size={18} className="text-white" />
                          </div>
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Newly</span> Added
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 font-medium">Recently listed chambers</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-5">
                      {newlyAdded.slice(0, 4).map((cabin) => (
                        <CabinCard key={cabin._id} cabin={cabin} showBadge={false} />
                      ))}
                    </div>
                  </div>
                )}

                {mostPopular.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                            <Award size={18} className="text-white" />
                          </div>
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Most</span> Popular
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 font-medium">Top rated and most booked chambers</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-5">
                      {mostPopular.slice(0, 4).map((cabin) => (
                        <CabinCard key={cabin._id} cabin={cabin} showBadge={false} />
                      ))}
                    </div>
                  </div>
                )}

                {trending.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
                            <Flame size={18} className="text-white" />
                          </div>
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Trending</span> Now
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 font-medium">Currently in high demand</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-5">
                      {trending.slice(0, 4).map((cabin) => (
                        <CabinCard key={cabin._id} cabin={cabin} showBadge={false} />
                      ))}
                    </div>
                  </div>
                )}

                {featured.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-lg flex items-center justify-center">
                            <Crown size={18} className="text-white" />
                          </div>
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-yellow-600">Featured</span> Premium
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 font-medium">Exclusive premium chambers</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-5">
                      {featured.slice(0, 4).map((cabin) => (
                        <CabinCard key={cabin._id} cabin={cabin} showBadge={false} />
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <LayoutGrid size={18} className="text-white" />
                        </div>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">All</span> Chambers
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 font-medium">Complete list of available chambers</p>
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">
                      {activeCabins.length} chambers
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-5">
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

      {showInactiveModal && selectedCabin && (
        <div
          className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowInactiveModal(false);
              setSelectedCabin(null);
            }
          }}
        >
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
              </div>

              <div className="bg-red-50 rounded-xl p-3 text-xs text-red-700 flex items-start gap-2 border border-red-200">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>
                  This chamber is not available for booking at the moment. Please check back later or explore other
                  active chambers.
                </span>
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

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AllCabins;