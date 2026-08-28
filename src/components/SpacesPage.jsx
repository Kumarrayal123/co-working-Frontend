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
  Compass,
  UtensilsCrossed,
  Percent,
  Clock as ClockIcon,
  Gift,
  Pizza,
  CupSoda,
  Sandwich,
  Filter,
  SlidersHorizontal
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
    id: "cafe", 
    label: "Cafe & Dining", 
    icon: UtensilsCrossed, 
    gradient: "from-amber-500 to-orange-500",
    bgGradient: "from-amber-50 to-orange-50",
    borderColor: "border-amber-200",
    textColor: "text-amber-600",
    bgHover: "hover:bg-amber-50",
    description: "Cafes & dining tables",
    stats: "Cafe Tables"
  }
];

// ✅ Helper: Convert 24hr time to 12hr format with AM/PM
const formatTo12Hour = (time24) => {
  if (!time24) return "N/A";
  
  if (time24.includes('AM') || time24.includes('PM')) {
    return time24;
  }
  
  try {
    const [hours, minutes] = time24.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) return time24;
    
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    return `${hours12}:${String(minutes).padStart(2, '0')} ${ampm}`;
  } catch (e) {
    return time24;
  }
};

// ✅ Helper: Format timing display
const getTimingDisplay = (cabin) => {
  if (cabin.is24x7) {
    return { display: "24x7 Open", icon: Clock, color: "text-emerald-600" };
  }
  
  const openTime = cabin.openTime || "09:00";
  const closeTime = cabin.closeTime || "21:00";
  
  if (openTime && closeTime) {
    const open12 = formatTo12Hour(openTime);
    const close12 = formatTo12Hour(closeTime);
    return { 
      display: `${open12} - ${close12}`, 
      icon: Clock, 
      color: "text-blue-600"
    };
  }
  
  return { display: "Timings N/A", icon: Clock, color: "text-gray-400" };
};

// 📍 Unique locations from data
const getUniqueLocations = (data) => {
  const locations = new Set();
  data.forEach(item => {
    if (item.address) {
      const parts = item.address.split(',');
      const city = parts[parts.length - 1]?.trim() || parts[0]?.trim();
      locations.add(city);
    }
    if (item.city) {
      locations.add(item.city);
    }
  });
  return Array.from(locations).filter(Boolean).sort();
};

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
  const [wishlist, setWishlist] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  
  // ✅ FILTER STATES
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [sortOption, setSortOption] = useState("default");

  const navigate = useNavigate();

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
      const data = res.data.cabins || res.data || [];
      // ✅ ONLY ACTIVE CABINS
      const activeCabins = data.filter(cabin => cabin.isActive !== false);
      
      // ✅ LOGGING - SAB DATA DEKHO
      console.log("========================================");
      console.log("📦 TOTAL CABINS FETCHED:", activeCabins.length);
      console.log("========================================");
      
      // ✅ HAR CABIN KA isCafe CHECK KARO
      activeCabins.forEach((cabin, index) => {
        console.log(`📋 Cabin ${index + 1}:`, {
          name: cabin.name,
          isCafe: cabin.isCafe,
          isChamber: cabin.isChamber,
          cabinType: cabin.cabinType,
          tableNumber: cabin.tableNumber,
          isActive: cabin.isActive
        });
      });
      
      // ✅ SIRF isCafe: TRUE WALE COUNT
      const cafeCabins = activeCabins.filter(c => c.isCafe === true);
      console.log("========================================");
      console.log("☕ CAFE CABINS (isCafe: true):", cafeCabins.length);
      cafeCabins.forEach((c, i) => {
        console.log(`  Cafe ${i + 1}: ${c.name} - Table: ${c.tableNumber || c.cabin || 'N/A'}`);
      });
      console.log("========================================");
      
      setCabins(activeCabins);
      setFilteredCabins(activeCabins);
    } catch (err) {
      console.error("Error fetching cabins:", err);
      setError("Failed to load spaces. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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

  const isInWishlist = (cabinId) => {
    return wishlist.some(item => item._id === cabinId || item === cabinId);
  };

  // 📍 Get available locations
  const getAvailableLocations = () => {
    return getUniqueLocations(cabins);
  };

  // ✅ CATEGORY SELECT - SIRF isCafe TRUE WALE
  const handleCategorySelect = (categoryId) => {
    console.log("========================================");
    console.log("🔄 CATEGORY SELECTED:", categoryId);
    console.log("========================================");
    
    setSelectedCategory(categoryId);
    setSelectedLocation("all");
    setPriceRange({ min: "", max: "" });
    setSortOption("default");
    setActiveFilter("all");
    setSearchTerm("");
    
    let filtered = [];
    
    if (categoryId === "cafe") {
      // ✅ SIRF isCafe === TRUE
      filtered = cabins.filter(cabin => cabin.isCafe === true);
      console.log("☕ CAFE FILTER APPLIED!");
      console.log("   Total Cafes Found:", filtered.length);
      filtered.forEach((c, i) => {
        console.log(`   ${i + 1}. ${c.name} - isCafe: ${c.isCafe}, Table: ${c.tableNumber || c.cabin || 'N/A'}`);
      });
      setSelectedType("all");
      setSelectedCabinType("all");
    } else if (categoryId === "coworking") {
      filtered = cabins.filter(cabin => cabin.isChamber === false && cabin.isCafe !== true);
      console.log("💼 CO-WORKING FILTER APPLIED! Found:", filtered.length);
      setSelectedType("coworking");
    } else if (categoryId === "medical") {
      filtered = cabins.filter(cabin => cabin.isChamber === true);
      console.log("🏥 MEDICAL FILTER APPLIED! Found:", filtered.length);
      setSelectedType("chamber");
    } else if (categoryId === "meeting") {
      filtered = cabins.filter(cabin => cabin.cabinType === "meeting");
      console.log("📋 MEETING FILTER APPLIED! Found:", filtered.length);
    } else {
      filtered = [...cabins];
      console.log("📦 ALL CABINS:", filtered.length);
    }
    
    console.log("========================================");
    setFilteredCabins(filtered);
  };

  const applyFilters = () => {
    let filtered = [...cabins];

    // 🔍 Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(item => {
        const name = item.name?.toLowerCase() || '';
        const address = item.address?.toLowerCase() || '';
        const description = item.description?.toLowerCase() || '';
        const tableNumber = item.tableNumber?.toLowerCase() || '';
        const cabin = item.cabin?.toLowerCase() || '';
        return name.includes(term) || address.includes(term) || 
               description.includes(term) || tableNumber.includes(term) ||
               cabin.includes(term);
      });
    }

    // 📍 Location filter
    if (selectedLocation !== "all") {
      filtered = filtered.filter(item => {
        const address = item.address || '';
        const city = item.city || '';
        return address.includes(selectedLocation) || city.includes(selectedLocation);
      });
    }

    // 💰 Price range filter
    const minPrice = parseFloat(priceRange.min);
    const maxPrice = parseFloat(priceRange.max);
    if (!isNaN(minPrice) && minPrice > 0) {
      filtered = filtered.filter(item => (item.price || 0) >= minPrice);
    }
    if (!isNaN(maxPrice) && maxPrice > 0) {
      filtered = filtered.filter(item => (item.price || 0) <= maxPrice);
    }

    // 🏷️ Type filters (only if not cafe category)
    if (selectedCategory !== "cafe") {
      if (selectedType !== "all") {
        filtered = filtered.filter(cabin => {
          if (selectedType === "chamber") {
            return cabin.isChamber === true;
          } else if (selectedType === "coworking") {
            return cabin.isChamber === false && cabin.isCafe !== true;
          }
          return true;
        });
      }

      if (selectedCabinType !== "all") {
        filtered = filtered.filter(cabin => cabin.cabinType === selectedCabinType);
      }
    }

    // 📊 Sorting
    filtered = applySorting(filtered);
    setFilteredCabins(filtered);
  };

  const applySorting = (data) => {
    const sorted = [...data];
    const sortBy = sortOption !== "default" ? sortOption : activeFilter;
    
    switch (sortBy) {
      case "price-low":
        return sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
      case "price-high":
        return sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
      case "top-rated":
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case "new":
        return sorted.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return dateB - dateA;
        });
      case "nearest":
        return sorted.sort((a, b) => {
          const distA = parseFloat(a.distance) || 0;
          const distB = parseFloat(b.distance) || 0;
          return distA - distB;
        });
      case "default":
      default:
        return sorted;
    }
  };

  // Re-apply filters when dependencies change
  useEffect(() => {
    // ✅ Don't override cafe category filter
    if (selectedCategory === "cafe") {
      const cafes = cabins.filter(cabin => cabin.isCafe === true);
      setFilteredCabins(cafes);
      return;
    }
    applyFilters();
  }, [searchTerm, selectedType, selectedCabinType, selectedLocation, 
      priceRange, sortOption, activeFilter, cabins, selectedCategory]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedType("all");
    setSelectedCabinType("all");
    setActiveFilter("all");
    setSelectedCategory("all");
    setSelectedLocation("all");
    setPriceRange({ min: "", max: "" });
    setSortOption("default");
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

  const getTypeLabel = (cabin) => {
    if (cabin.isCafe) return "☕ Cafe Table";
    if (cabin.isChamber) return "Medical Chamber";
    if (cabin.cabinType === "meeting") return "Meeting Room";
    if (cabin.cabinType === "exclusive") return "Private Office";
    return "Workspace";
  };

  const getTypeColor = (cabin) => {
    if (cabin.isCafe) return "bg-amber-100 text-amber-700 border-amber-200";
    if (cabin.isChamber) return "bg-red-100 text-red-700 border-red-200";
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

  const sortOptions = [
    { id: "default", label: "Default" },
    { id: "price-low", label: "Price: Low to High" },
    { id: "price-high", label: "Price: High to Low" },
    { id: "top-rated", label: "Top Rated" },
    { id: "nearest", label: "Nearest First" }
  ];

  const locations = getAvailableLocations();
  const isCafeCategory = selectedCategory === "cafe";

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SimpleUserNavbar />
        <div className="pt-24 px-4 max-w-full mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
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
      <div className="relative pt-16 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/5 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-t from-indigo-900/20 to-transparent"></div>
          <div className="absolute top-5 right-10 w-48 h-48 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-5 left-5 w-56 h-56 bg-indigo-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-300/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white/90 text-[10px] font-medium tracking-wider mb-4">
              <Sparkles size={12} className="text-yellow-300" />
              IRYAX SPACES
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.15]">
              Find Your Perfect
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-300">
                Workspace Today
              </span>
            </h1>

            <p className="mt-3 text-white/80 text-xs sm:text-sm max-w-xl mx-auto font-light leading-relaxed">
              Discover premium co-working spaces, medical chambers, meeting rooms & cafes tailored to your professional needs
            </p>

            <div className="mt-6 max-w-2xl mx-auto">
              <div className="flex items-center bg-white/10 backdrop-blur-md rounded-full border border-white/20 p-1 shadow-lg">
                <div className="flex-1 px-4 flex items-center gap-2">
                  <Search size={16} className="text-white/50" />
                  <input
                    type="text"
                    placeholder="Search for spaces..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-transparent text-white placeholder-white/40 text-xs outline-none"
                  />
                </div>
                <button 
                  onClick={() => {
                    const element = document.getElementById('spaces-section');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-5 py-2 bg-white text-blue-700 rounded-full text-xs font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-1.5"
                >
                  Explore <ArrowRight size={14} />
                </button>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              <div className="flex items-center gap-2 text-white/80">
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Building2 size={14} className="text-white/70" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-white text-sm">{cabins.length}+</p>
                  <p className="text-[7px] text-white/40 font-light uppercase tracking-wider">Spaces</p>
                </div>
              </div>
              <div className="w-px h-8 bg-white/10"></div>
              <div className="flex items-center gap-2 text-white/80">
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Users size={14} className="text-white/70" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-white text-sm">100+</p>
                  <p className="text-[7px] text-white/40 font-light uppercase tracking-wider">Seats</p>
                </div>
              </div>
              <div className="w-px h-8 bg-white/10"></div>
              <div className="flex items-center gap-2 text-white/80">
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Star size={14} className="text-white/70" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-white text-sm">4.8★</p>
                  <p className="text-[7px] text-white/40 font-light uppercase tracking-wider">Rating</p>
                </div>
              </div>
              <div className="w-px h-8 bg-white/10"></div>
              <div className="flex items-center gap-2 text-white/80">
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Clock size={14} className="text-white/70" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-white text-sm">24/7</p>
                  <p className="text-[7px] text-white/40 font-light uppercase tracking-wider">Open</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      </div>

      {/* ============= CATEGORIES SECTION ============= */}
      <div className="relative z-10 -mt-6 px-4 max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                <Compass size={16} className="text-white" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-900">Browse Categories</h2>
                <p className="text-[9px] text-gray-400 font-light">Find the perfect space for your needs</p>
              </div>
            </div>
            {selectedCategory !== "all" && (
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setFilteredCabins(cabins);
                  setSelectedType("all");
                  setSelectedLocation("all");
                  setPriceRange({ min: "", max: "" });
                  setSortOption("default");
                  setActiveFilter("all");
                  setSearchTerm("");
                }}
                className="text-[10px] text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-full"
              >
                <XIcon size={11} /> Clear
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {CATEGORIES.map((category) => {
              const Icon = category.icon;
              const isActive = selectedCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  className={`group relative p-3 rounded-xl border-2 transition-all duration-300 text-left ${
                    isActive
                      ? `${category.bgGradient} ${category.borderColor} shadow-lg`
                      : 'bg-gray-50 border-transparent hover:border-gray-200 hover:bg-white'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      isActive 
                        ? `bg-gradient-to-r ${category.gradient} text-white shadow-md`
                        : 'bg-white border border-gray-200 text-gray-500 group-hover:border-gray-300 group-hover:shadow-sm'
                    }`}>
                      <Icon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-bold ${isActive ? category.textColor : 'text-gray-700'}`}>
                        {category.label}
                      </p>
                      <p className="text-[9px] text-gray-400 font-light truncate">
                        {category.description}
                      </p>
                      <p className="text-[8px] font-medium text-gray-400 mt-0.5">
                        {category.id === "cafe" 
                          ? `${cabins.filter(c => c.isCafe === true).length} Tables`
                          : category.stats}
                      </p>
                    </div>
                  </div>
                  {isActive && (
                    <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-200">
                      <CheckCircle size={11} className="text-white" />
                    </div>
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
              <CircleDot size={20} className="text-blue-500" />
              {isCafeCategory ? (
                <>
                  <span className="text-amber-600">☕ Cafe & Dining Tables</span>
                  <span className="text-sm font-normal text-gray-400">• {filteredCabins.length} tables</span>
                </>
              ) : (
                `${filteredCabins.length} ${filteredCabins.length === 1 ? 'Space' : 'Spaces'} Available`
              )}
            </h2>
            <p className="text-xs text-gray-500">
              {selectedCategory !== "all" ? `Showing ${CATEGORIES.find(c => c.id === selectedCategory)?.label || ''}` : 'All premium spaces'}
              {selectedLocation !== "all" && ` • ${selectedLocation}`}
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

        {/* ============= FILTERS SECTION ============= */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={isCafeCategory ? "Search by cafe name, table number..." : "Search by name, address, or description..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-50 hover:bg-white transition"
              />
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              {/* 📍 Location Filter */}
              {locations.length > 0 && (
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-50 hover:bg-white transition min-w-[120px]"
                >
                  <option value="all">📍 All Locations</option>
                  {locations.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              )}

              {/* 💰 Price Range */}
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  placeholder="Min ₹"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                  className="w-20 px-2 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-50 hover:bg-white transition"
                />
                <span className="text-gray-400 text-xs">-</span>
                <input
                  type="number"
                  placeholder="Max ₹"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                  className="w-20 px-2 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-50 hover:bg-white transition"
                />
              </div>

              {/* 📊 Sort Options */}
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-50 hover:bg-white transition min-w-[150px]"
              >
                {sortOptions.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>

              {!isCafeCategory && (
                <>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-50 hover:bg-white transition"
                  >
                    <option value="all">All Types</option>
                    <option value="coworking">Co-Working</option>
                    <option value="chamber">Medical Chambers</option>
                  </select>
                  <select
                    value={selectedCabinType}
                    onChange={(e) => setSelectedCabinType(e.target.value)}
                    className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-50 hover:bg-white transition"
                  >
                    <option value="all">All Cabin Types</option>
                    <option value="normal">Normal</option>
                    <option value="exclusive">Exclusive</option>
                    <option value="meeting">Meeting Room</option>
                  </select>
                </>
              )}

              {/* Clear filters button */}
              {(searchTerm || selectedLocation !== "all" || priceRange.min || priceRange.max || 
                sortOption !== "default" || selectedType !== "all" || selectedCabinType !== "all" || 
                selectedCategory !== "all") && (
                <button
                  onClick={clearFilters}
                  className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
                  title="Clear all filters"
                >
                  <XIcon size={18} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filter Chips - Active filters display */}
        <div className="flex flex-wrap gap-2 mb-5">
          {filterOptions.map((filter) => {
            const Icon = filter.icon;
            const isActive = activeFilter === filter.id && sortOption === "default";
            return (
              <button
                key={filter.id}
                onClick={() => {
                  setActiveFilter(filter.id);
                  if (filter.id !== "all") {
                    setSortOption(filter.id);
                  } else {
                    setSortOption("default");
                  }
                }}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-200"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                <Icon size={14} />
                {filter.label}
              </button>
            );
          })}
          
          {/* Active location chip */}
          {selectedLocation !== "all" && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
              <MapPin size={12} /> {selectedLocation}
              <button onClick={() => setSelectedLocation("all")} className="hover:text-blue-900">
                <XIcon size={12} />
              </button>
            </span>
          )}

          {/* Active price range chip */}
          {(priceRange.min || priceRange.max) && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
              <IndianRupee size={12} /> 
              {priceRange.min ? `₹${priceRange.min}` : "₹0"} - {priceRange.max ? `₹${priceRange.max}` : "∞"}
              <button onClick={() => setPriceRange({ min: "", max: "" })} className="hover:text-green-900">
                <XIcon size={12} />
              </button>
            </span>
          )}
        </div>

        {/* Results Grid */}
        {filteredCabins.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 size={32} className="text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium text-lg">
              {isCafeCategory ? "No Cafes Found ☕" : "No spaces found"}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {isCafeCategory ? "No cafe tables available at the moment" : "Try adjusting your filters or search terms"}
            </p>
            <button
              onClick={clearFilters}
              className="mt-4 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredCabins.map((cabin) => {
              const inWishlist = isInWishlist(cabin._id);
              const timing = getTimingDisplay(cabin);
              const TimingIcon = timing.icon;
              const isCafe = cabin.isCafe === true;
              const cafeName = cabin.name?.includes(" - ") ? cabin.name.split(" - ")[0] : cabin.name;
              const tableNum = cabin.tableNumber || cabin.cabin || "Table";
              
              return (
                <div
                  key={cabin._id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
                  onClick={() => navigate(`/cabin/${cabin._id}`)}
                >
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <img
                      src={cabin.images?.[0] ? getImageUrl(cabin.images[0]) : "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000"}
                      alt={cabin.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000";
                      }}
                    />
                    
                    {/* Badges - Top Left */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      {isCafe && (
                        <span className="px-2.5 py-0.5 text-[9px] font-bold rounded bg-amber-600 text-white flex items-center gap-0.5">
                          <UtensilsCrossed size={10} /> Cafe Table
                        </span>
                      )}
                      {cabin.cabinType === "exclusive" && (
                        <span className="px-2.5 py-0.5 text-[9px] font-bold rounded bg-purple-600 text-white flex items-center gap-0.5">
                          <Crown size={10} /> Exclusive
                        </span>
                      )}
                      {cabin.isChamber && (
                        <span className="px-2.5 py-0.5 text-[9px] font-bold rounded bg-red-600 text-white flex items-center gap-0.5">
                          <Stethoscope size={10} /> Medical
                        </span>
                      )}
                    </div>

                    {/* Wishlist button */}
                    <button 
                      className={`absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center transition shadow-md ${
                        inWishlist 
                          ? 'text-red-500' 
                          : 'text-gray-400 hover:text-red-500'
                      } ${wishlistLoading ? 'opacity-50 pointer-events-none' : ''}`}
                      onClick={(e) => toggleWishlist(cabin._id, e)}
                      disabled={wishlistLoading}
                    >
                      <Heart 
                        size={15} 
                        className={inWishlist ? 'fill-red-500' : ''} 
                      />
                    </button>
                  </div>

                  <div className="p-4">
                    {/* Name */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm truncate">{cafeName}</h3>
                        {isCafe && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full mt-0.5">
                            <UtensilsCrossed size={10} /> {tableNum}
                          </span>
                        )}
                      </div>
                      {isCafe && (
                        <div className="text-right flex-shrink-0">
                          <span className="text-sm font-bold text-gray-900">{formatCurrency(cabin.price)}</span>
                          <span className="text-[9px] text-gray-400 block">/ hour</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Description */}
                    {cabin.description && (
                      <p className="text-[11px] text-gray-500 line-clamp-1 mt-1">{cabin.description}</p>
                    )}
                    
                    {/* Location */}
                    <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-1.5">
                      <MapPin size={12} />
                      <span className="truncate">{cabin.address?.split(',')[0] || 'N/A'}</span>
                    </p>
                    
                    {/* Timing and Capacity */}
                    <div className="flex items-center gap-2 mt-1">
                      <div className={`flex items-center gap-1 ${timing.color}`}>
                        <TimingIcon size={11} />
                        <span className="text-[10px] font-medium">{timing.display}</span>
                      </div>
                      <span className="text-[10px] text-gray-300">•</span>
                      <span className="flex items-center gap-1 text-[10px] text-gray-500">
                        <Users size={11} />
                        {cabin.capacity || 4} seats
                      </span>
                    </div>
                    
                    {/* Amenities */}
                    {cabin.amenities && Object.keys(cabin.amenities).filter(k => cabin.amenities[k]).length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {Object.keys(cabin.amenities).filter(k => cabin.amenities[k]).slice(0, 3).map((key) => {
                          const amenity = AMENITY_ICONS[key];
                          if (!amenity) return null;
                          const Icon = amenity.icon;
                          return (
                            <span key={key} className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-gray-50 rounded text-[8px] text-gray-500 border border-gray-100">
                              <Icon size={10} />
                              {amenity.label}
                            </span>
                          );
                        })}
                        {Object.keys(cabin.amenities).filter(k => cabin.amenities[k]).length > 3 && (
                          <span className="text-[8px] text-gray-400">+{Object.keys(cabin.amenities).filter(k => cabin.amenities[k]).length - 3}</span>
                        )}
                      </div>
                    )}
                    
                    {/* Type Badge */}
                    <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between">
                      <span className={`text-[9px] font-medium px-2 py-0.5 rounded-full border ${getTypeColor(cabin)}`}>
                        {getTypeLabel(cabin)}
                      </span>
                      {cabin.isActive !== false ? (
                        <span className="flex items-center gap-1 text-[9px] text-emerald-600 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[9px] text-gray-400 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                          Inactive
                        </span>
                      )}
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
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
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
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

export default SpacesPage;