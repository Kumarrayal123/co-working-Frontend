import axios from "axios";
import {
  Building2,
  MapPin,
  Wifi,
  ParkingCircle,
  Lock,
  Armchair,
  Bath,
  Shield,
  Coffee,
  Dumbbell,
  Fan,
  Tv,
  Printer,
  Phone,
  Star,
  Clock,
  Users,
  IndianRupee,
  Search,
  X as XIcon,
  Eye,
  Crown,
  Stethoscope,
  Briefcase,
  Sparkles,
  Navigation,
  Award,
  Zap,
  ArrowRight,
  CheckCircle,
  Heart,
  Calendar,
  TrendingUp,
  ChevronRight,
  CircleDot,
  ExternalLink,
  Rocket,
  Target,
  Compass
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SimpleUserNavbar from "./SimpleUserNavbar";

const API_URL = "https://spaceapi.iryax.com";

// Amenities mapping
const AMENITY_ICONS = {
  wifi: { icon: Wifi, label: "Wi-Fi" },
  parking: { icon: ParkingCircle, label: "Parking" },
  lockers: { icon: Lock, label: "Lockers" },
  comfortSeating: { icon: Armchair, label: "Comfort Seating" },
  privateWashroom: { icon: Bath, label: "Private Washroom" },
  secureAccess: { icon: Shield, label: "Secure Access" },
  coffee: { icon: Coffee, label: "Coffee & Tea" },
  gym: { icon: Dumbbell, label: "Gym Access" },
  ac: { icon: Fan, label: "Air Conditioning" },
  tv: { icon: Tv, label: "Smart TV" },
  printer: { icon: Printer, label: "Printer" },
  phone: { icon: Phone, label: "Conference Phone" }
};

// Category icons
const CATEGORIES = [
  { 
    id: "coworking", 
    label: "Co-Working", 
    icon: Briefcase, 
    gradient: "from-blue-500 to-cyan-400",
    bgGradient: "from-blue-50 to-cyan-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-600",
    bgHover: "hover:bg-blue-50",
    description: "Flexible workspaces",
    stats: "24 Spaces"
  },
  { 
    id: "medical", 
    label: "Medical Chambers", 
    icon: Stethoscope, 
    gradient: "from-red-500 to-rose-400",
    bgGradient: "from-red-50 to-rose-50",
    borderColor: "border-red-200",
    textColor: "text-red-600",
    bgHover: "hover:bg-red-50",
    description: "Healthcare spaces",
    stats: "18 Chambers"
  },
  { 
    id: "meeting", 
    label: "Meeting Rooms", 
    icon: Users, 
    gradient: "from-purple-500 to-violet-400",
    bgGradient: "from-purple-50 to-violet-50",
    borderColor: "border-purple-200",
    textColor: "text-purple-600",
    bgHover: "hover:bg-purple-50",
    description: "Conference & events",
    stats: "12 Rooms"
  },
  { 
    id: "private", 
    label: "Private Offices", 
    icon: Lock, 
    gradient: "from-emerald-500 to-teal-400",
    bgGradient: "from-emerald-50 to-teal-50",
    borderColor: "border-emerald-200",
    textColor: "text-emerald-600",
    bgHover: "hover:bg-emerald-50",
    description: "Dedicated spaces",
    stats: "15 Offices"
  }
];

function SpacesPage() {
  const [cabins, setCabins] = useState([]);
  const [filteredCabins, setFilteredCabins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCabinType, setSelectedCabinType] = useState("all");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showAllCabins, setShowAllCabins] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const navigate = useNavigate();

  // Get current user
  const currentUser = (() => {
    try {
      const userStr = localStorage.getItem("user");
      const adminStr = localStorage.getItem("admin");
      if (userStr) return JSON.parse(userStr);
      if (adminStr) return JSON.parse(adminStr);
      return null;
    } catch (err) {
      return null;
    }
  })();

  const userId = currentUser?._id || currentUser?.id;
  const token = localStorage.getItem("token");

  const getAuthHeader = () => {
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    fetchCabins();
    if (userId && token) {
      fetchWishlist();
    }
  }, []);

  const fetchCabins = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_URL}/api/cabins`);
      const data = res.data || [];
      const activeCabins = data.filter(cabin => cabin.isActive !== false);
      setCabins(activeCabins);
      setFilteredCabins(activeCabins);
    } catch (err) {
      console.error("Error fetching cabins:", err);
      setError("Failed to load spaces. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ FETCH WISHLIST - GET /api/cabins/mywishlist/:userId
  const fetchWishlist = async () => {
    if (!userId || !token) return;
    try {
      const res = await axios.get(
        `${API_URL}/api/cabins/mywishlist/${userId}`,
        getAuthHeader()
      );
      console.log("Wishlist Response:", res.data);
      setWishlist(res.data.wishlist || []);
    } catch (err) {
      console.error("Error fetching wishlist:", err);
    }
  };

  // ✅ TOGGLE WISHLIST - POST /api/cabins/toggle/:userId
  const toggleWishlist = async (cabinId, e) => {
    if (e) e.stopPropagation();
    
    if (!userId || !token) {
      toast.error("Please login to add to wishlist");
      navigate("/login");
      return;
    }

    setWishlistLoading(true);
    try {
      const res = await axios.post(
        `${API_URL}/api/cabins/toggle/${userId}`,
        { cabinId },
        getAuthHeader()
      );

      console.log("Toggle Response:", res.data);
      
      // ✅ Update wishlist based on action
      if (res.data.action === 'added') {
        setWishlist(res.data.wishlist || []);
        toast.success("Added to wishlist! ❤️");
      } else if (res.data.action === 'removed') {
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

  // ✅ CHECK IF CABIN IS IN WISHLIST
  const isInWishlist = (cabinId) => {
    return wishlist.some(item => item._id === cabinId || item === cabinId);
  };

  // ✅ GET WISHLIST COUNT
  const getWishlistCount = () => {
    return wishlist.length;
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    
    let filtered = [...cabins];
    
    if (categoryId === "coworking") {
      filtered = filtered.filter(cabin => cabin.isChamber === false || cabin.type === "coworking");
      setSelectedType("coworking");
    } else if (categoryId === "medical") {
      filtered = filtered.filter(cabin => cabin.isChamber === true);
      setSelectedType("chamber");
    } else if (categoryId === "meeting") {
      filtered = filtered.filter(cabin => cabin.cabinType === "meeting" || cabin.type === "meeting");
    } else if (categoryId === "private") {
      filtered = filtered.filter(cabin => cabin.cabinType === "exclusive" || cabin.type === "private");
    } else {
      setSelectedType("all");
      filtered = [...cabins];
    }
    
    setFilteredCabins(filtered);
    setShowAllCabins(true);
  };

  const applyFilters = () => {
    let filtered = [...cabins];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(cabin => {
        const name = cabin.name?.toLowerCase() || '';
        const address = cabin.address?.toLowerCase() || '';
        const description = cabin.description?.toLowerCase() || '';
        return name.includes(term) || address.includes(term) || description.includes(term);
      });
    }

    if (selectedType !== "all") {
      filtered = filtered.filter(cabin => {
        if (selectedType === "chamber") {
          return cabin.isChamber === true;
        } else if (selectedType === "coworking") {
          return cabin.isChamber === false || cabin.type === "coworking";
        }
        return true;
      });
    }

    if (selectedCabinType !== "all") {
      filtered = filtered.filter(cabin => cabin.cabinType === selectedCabinType);
    }

    filtered = applySorting(filtered);
    setFilteredCabins(filtered);
  };

  const applySorting = (data) => {
    const sorted = [...data];
    
    switch (activeFilter) {
      case "top-rated":
        return sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
      case "new":
        return sorted.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return dateB - dateA;
        });
      case "nearest":
        return sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      case "all":
      default:
        return sorted;
    }
  };

  useEffect(() => {
    if (!showAllCabins) {
      applyFilters();
    }
  }, [searchTerm, selectedType, selectedCabinType, cabins, activeFilter, showAllCabins]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedType("all");
    setSelectedCabinType("all");
    setActiveFilter("all");
    setSelectedCategory("all");
    setShowAllCabins(false);
    setFilteredCabins(cabins);
  };

  const getImageUrl = (img) => {
    if (!img) return "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000";
    if (img.startsWith("http")) return img;
    const cleanPath = img.replace(/\\/g, "/").replace(/^\/+/, "");
    return `${API_URL}/${cleanPath}`;
  };

  const formatCurrency = (amount) => {
    return `₹${Number(amount).toLocaleString('en-IN')}`;
  };

  const getActiveAmenities = (amenities) => {
    if (!amenities) return [];
    return Object.keys(amenities).filter(key => amenities[key] === true);
  };

  const getTypeLabel = (cabin) => {
    if (cabin.isChamber) return "Medical Chamber";
    if (cabin.type === "coworking") return "Co-Working";
    if (cabin.cabinType === "meeting") return "Meeting Room";
    if (cabin.cabinType === "exclusive") return "Private Office";
    return "Workspace";
  };

  const getTypeColor = (cabin) => {
    if (cabin.isChamber) return "bg-red-100 text-red-700 border-red-200";
    if (cabin.type === "coworking") return "bg-blue-100 text-blue-700 border-blue-200";
    if (cabin.cabinType === "meeting") return "bg-purple-100 text-purple-700 border-purple-200";
    if (cabin.cabinType === "exclusive") return "bg-emerald-100 text-emerald-700 border-emerald-200";
    return "bg-gray-100 text-gray-700 border-gray-200";
  };

  const filterOptions = [
    { id: "all", label: "All", icon: Zap },
    { id: "top-rated", label: "Top Rated", icon: Award },
    { id: "new", label: "New Added", icon: Sparkles },
    { id: "nearest", label: "Nearest", icon: Navigation }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SimpleUserNavbar />
        <div className="pt-24 px-4 max-w-full mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-gray-500 text-sm">Loading spaces...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SimpleUserNavbar />
        <div className="pt-24 px-4 max-w-full mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-md mx-auto">
            <p className="text-red-600 font-medium">{error}</p>
            <button 
              onClick={fetchCabins}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SimpleUserNavbar />

      {/* ============= HERO BANNER ============= */}
      <div className="relative pt-20 overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/5 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-t from-purple-900/20 to-transparent"></div>
          
          {/* Floating Orbs */}
          <div className="absolute top-10 right-20 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-300/10 rounded-full blur-3xl"></div>
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] bg-repeat"></div>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-white/90 text-xs font-medium tracking-wider mb-5">
              <Sparkles size={14} className="text-yellow-300" />
              IRYAX SPACES
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-[1.1]">
              Find Your Perfect
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-300">
                Workspace Today
              </span>
            </h1>

            {/* Description */}
            <p className="mt-4 text-white/80 text-sm md:text-base max-w-xl mx-auto font-light leading-relaxed">
              Discover premium co-working spaces, medical chambers, meeting rooms & private offices tailored to your professional needs
            </p>

            {/* Search Bar */}
            <div className="mt-8 max-w-2xl mx-auto">
              <div className="flex items-center bg-white/10 backdrop-blur-md rounded-full border border-white/20 p-1.5 shadow-lg">
                <div className="flex-1 px-4 flex items-center gap-2">
                  <Search size={18} className="text-white/50" />
                  <input
                    type="text"
                    placeholder="Search for spaces..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-transparent text-white placeholder-white/40 text-sm outline-none"
                  />
                </div>
                <button 
                  onClick={() => {
                    const element = document.getElementById('spaces-section');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-2.5 bg-white text-indigo-700 rounded-full text-sm font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2"
                >
                  Explore <ArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
              <div className="flex items-center gap-2 text-white/80">
                <div className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Building2 size={16} className="text-white/70" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-white text-lg">{cabins.length}+</p>
                  <p className="text-[8px] text-white/40 font-light uppercase tracking-wider">Spaces</p>
                </div>
              </div>
              <div className="w-px h-10 bg-white/10"></div>
              <div className="flex items-center gap-2 text-white/80">
                <div className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Users size={16} className="text-white/70" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-white text-lg">100+</p>
                  <p className="text-[8px] text-white/40 font-light uppercase tracking-wider">Seats</p>
                </div>
              </div>
              <div className="w-px h-10 bg-white/10"></div>
              <div className="flex items-center gap-2 text-white/80">
                <div className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Star size={16} className="text-white/70" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-white text-lg">4.8★</p>
                  <p className="text-[8px] text-white/40 font-light uppercase tracking-wider">Rating</p>
                </div>
              </div>
              <div className="w-px h-10 bg-white/10"></div>
              <div className="flex items-center gap-2 text-white/80">
                <div className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Clock size={16} className="text-white/70" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-white text-lg">24/7</p>
                  <p className="text-[8px] text-white/40 font-light uppercase tracking-wider">Access</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Curved Bottom */}
        <div className="relative h-8">
          <svg className="absolute bottom-0 w-full h-10 text-gray-50" viewBox="0 0 1440 48" fill="currentColor" preserveAspectRatio="none">
            <path d="M0 48h1440V0c-192 32-384 48-576 48S384 32 192 0L0 48z"/>
          </svg>
        </div>
      </div>

      {/* ============= CATEGORIES SECTION ============= */}
      <div className="relative z-10 -mt-6 px-4 max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                <Compass size={18} className="text-white" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-900">Browse Categories</h2>
                <p className="text-[10px] text-gray-400 font-light">Find the perfect space for your needs</p>
              </div>
            </div>
            {selectedCategory !== "all" && (
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setShowAllCabins(false);
                  setFilteredCabins(cabins);
                  setSelectedType("all");
                }}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 bg-indigo-50 px-3 py-1.5 rounded-full"
              >
                <XIcon size={12} /> Clear
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {CATEGORIES.map((category) => {
              const Icon = category.icon;
              const isActive = selectedCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  className={`group relative p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                    isActive
                      ? `${category.bgGradient} ${category.borderColor} shadow-lg shadow-${category.id === 'coworking' ? 'blue' : category.id === 'medical' ? 'red' : category.id === 'meeting' ? 'purple' : 'emerald'}-100`
                      : 'bg-gray-50 border-transparent hover:border-gray-200 hover:bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      isActive 
                        ? `bg-gradient-to-r ${category.gradient} text-white shadow-md`
                        : 'bg-white border border-gray-200 text-gray-500 group-hover:border-gray-300 group-hover:shadow-sm'
                    }`}>
                      <Icon size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-bold ${isActive ? category.textColor : 'text-gray-700'}`}>
                        {category.label}
                      </p>
                      <p className="text-[10px] text-gray-400 font-light truncate">
                        {category.description}
                      </p>
                      <p className="text-[9px] font-medium text-gray-400 mt-0.5">
                        {category.stats}
                      </p>
                    </div>
                  </div>
                  {isActive && (
                    <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-200">
                      <CheckCircle size={13} className="text-white" />
                    </div>
                  )}
                  {!isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-transparent group-hover:from-gray-50/50 group-hover:to-transparent rounded-xl transition"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ============= MAIN CONTENT ============= */}
      <div id="spaces-section" className="pt-6 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto pb-16">
        
        {/* Header with results */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <CircleDot size={20} className="text-indigo-500" />
              {filteredCabins.length} {filteredCabins.length === 1 ? 'Space' : 'Spaces'} Available
            </h2>
            <p className="text-xs text-gray-500">
              {selectedCategory !== "all" ? `Showing ${CATEGORIES.find(c => c.id === selectedCategory)?.label || ''} spaces` : 'All premium spaces'}
            </p>
          </div>
          {filteredCabins.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-400 bg-white px-3 py-1 rounded-full border border-gray-200 flex items-center gap-1">
                <TrendingUp size={12} className="text-green-500" />
                {filteredCabins.length} results
              </span>
            </div>
          )}
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, address, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-gray-50 hover:bg-white transition"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-gray-50 hover:bg-white transition"
              >
                <option value="all">All Types</option>
                <option value="coworking">Co-Working</option>
                <option value="chamber">Medical Chambers</option>
              </select>
              <select
                value={selectedCabinType}
                onChange={(e) => setSelectedCabinType(e.target.value)}
                className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-gray-50 hover:bg-white transition"
              >
                <option value="all">All Cabin Types</option>
                <option value="normal">Normal</option>
                <option value="exclusive">Exclusive</option>
                <option value="meeting">Meeting Room</option>
              </select>
              {(searchTerm || selectedType !== "all" || selectedCabinType !== "all" || selectedCategory !== "all") && (
                <button
                  onClick={clearFilters}
                  className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
                  title="Clear filters"
                >
                  <XIcon size={18} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2 mb-5">
          {filterOptions.map((filter) => {
            const Icon = filter.icon;
            const isActive = activeFilter === filter.id;
            return (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-200"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                <Icon size={14} />
                {filter.label}
              </button>
            );
          })}
          {activeFilter !== "all" && (
            <button
              onClick={() => setActiveFilter("all")}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium text-gray-400 hover:text-gray-600 transition"
            >
              <XIcon size={14} /> Clear
            </button>
          )}
        </div>

        {/* Results Grid */}
        {filteredCabins.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 size={32} className="text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium text-lg">No spaces found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or search terms</p>
            <button
              onClick={clearFilters}
              className="mt-4 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredCabins.map((cabin) => {
              const inWishlist = isInWishlist(cabin._id);
              return (
                <div
                  key={cabin._id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1.5"
                  onClick={() => navigate(`/cabin/${cabin._id}`)}
                >
                  <div className="relative h-52 overflow-hidden bg-gray-100">
                    <img
                      src={cabin.images?.[0] ? getImageUrl(cabin.images[0]) : "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000"}
                      alt={cabin.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000";
                      }}
                    />
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      <span className={`px-2.5 py-0.5 text-[9px] font-bold rounded-full border backdrop-blur-sm ${getTypeColor(cabin)}`}>
                        {getTypeLabel(cabin)}
                      </span>
                      {cabin.cabinType === "exclusive" && (
                        <span className="px-2.5 py-0.5 text-[9px] font-bold rounded-full bg-amber-100/90 text-amber-700 border border-amber-200 flex items-center gap-0.5 backdrop-blur-sm">
                          <Crown size={10} /> Exclusive
                        </span>
                      )}
                    </div>
                    {/* Price */}
                    <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-lg">
                      <span className="text-white font-bold text-sm">{formatCurrency(cabin.price)}</span>
                      <span className="text-white/50 text-[8px] font-light">/hour</span>
                    </div>
                    {/* ✅ Wishlist button with API integration */}
                    <button 
                      className={`absolute top-3 right-3 w-8 h-8 backdrop-blur-sm rounded-full flex items-center justify-center transition shadow-md ${
                        inWishlist 
                          ? 'bg-red-500 text-white hover:bg-red-600' 
                          : 'bg-white/90 hover:bg-white text-gray-500 hover:text-red-500'
                      } ${wishlistLoading ? 'opacity-50 pointer-events-none' : ''}`}
                      onClick={(e) => toggleWishlist(cabin._id, e)}
                      disabled={wishlistLoading}
                    >
                      <Heart 
                        size={14} 
                        className={inWishlist ? 'fill-current' : ''} 
                      />
                    </button>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">{cabin.name}</h3>
                    <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                      <MapPin size={11} />
                      <span className="line-clamp-1">{cabin.address?.split(',')[0] || 'N/A'}</span>
                    </p>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-1 mt-1.5">
                      <Star size={12} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-[10px] font-medium text-gray-700">4.8</span>
                      <span className="text-[9px] text-gray-400">(24 reviews)</span>
                    </div>
                    
                    {/* Amenities */}
                    <div className="mt-2 flex flex-wrap gap-1">
                      {getActiveAmenities(cabin.amenities).slice(0, 4).map((key) => {
                        const amenity = AMENITY_ICONS[key];
                        if (!amenity) return null;
                        const Icon = amenity.icon;
                        return (
                          <span key={key} className="p-1.5 bg-gray-50 rounded-lg" title={amenity.label}>
                            <Icon size={12} className="text-gray-500" />
                          </span>
                        );
                      })}
                      {getActiveAmenities(cabin.amenities).length > 4 && (
                        <span className="text-[9px] text-gray-400 font-medium px-1.5 py-0.5 bg-gray-50 rounded-lg">
                          +{getActiveAmenities(cabin.amenities).length - 4}
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-3 flex items-center justify-between pt-3 border-t border-gray-50">
                      <span className="text-[10px] text-gray-400 flex items-center gap-1">
                        <Users size={11} /> {cabin.capacity || 'N/A'} seats
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/cabin/${cabin._id}`); }}
                        className="px-4 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-[10px] font-medium rounded-lg transition flex items-center gap-1 shadow-sm hover:shadow"
                      >
                        <Eye size={11} /> View
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Building2 size={14} className="text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">IRYAX SPACE</p>
                  <p className="text-[8px] text-gray-400 font-light tracking-wider">PREMIUM WORKSPACES</p>
                </div>
              </div>
              <div className="hidden sm:block w-px h-8 bg-gray-200"></div>
              <div className="flex items-center gap-3 text-[10px] text-gray-400 font-light">
                <span className="flex items-center gap-1">
                  <Shield size={11} className="text-green-500" /> Secure
                </span>
                <span className="w-px h-3 bg-gray-200"></span>
                <span className="flex items-center gap-1">
                  <Clock size={11} className="text-blue-500" /> 24/7 Access
                </span>
              </div>
            </div>
            <p className="text-[9px] text-gray-400 font-medium tracking-wider">
              © {new Date().getFullYear()} IRYAX SPACE — All Rights Reserved
            </p>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-in {
          animation: fade-in 0.3s ease-out;
        }
        .delay-1000 {
          animation-delay: 1000ms;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        .animate-pulse {
          animation: pulse 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default SpacesPage;