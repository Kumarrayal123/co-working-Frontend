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
  Sandwich
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
    label: "Cafe", 
    icon: UtensilsCrossed, 
    gradient: "from-blue-500 to-blue-600",
    bgGradient: "from-blue-50 to-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-600",
    bgHover: "hover:bg-blue-50",
    description: "Cafes & dining",
    stats: "15 Cafes"
  }
];

// Dummy Cafe Data (Zomato style)
const DUMMY_CAFES = [
  {
    _id: "cafe1",
    name: "Palace Heights",
    type: "cafe",
    cabinType: "cafe",
    price: 2000,
    address: "Abids, Hyderabad",
    distance: "3.9 km",
    rating: 4.1,
    reviews: 128,
    openTime: "12:00",
    closeTime: "23:00",
    is24x7: false,
    images: ["https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=1000"],
    cuisines: ["Continental", "Chinese", "Mughlai"],
    capacity: 50,
    offer: "Flat 10% OFF",
    promoted: true,
    amenities: {
      wifi: true,
      parking: true,
      coffee: true,
      ac: true
    },
    description: "Fine dining with a view of the city"
  },
  {
    _id: "cafe2",
    name: "Mirame Cafe & Kitchen",
    type: "cafe",
    cabinType: "cafe",
    price: 1100,
    address: "RTC X roads, Hyderabad",
    distance: "2.8 km",
    rating: 4.4,
    reviews: 256,
    openTime: "12:00",
    closeTime: "23:30",
    is24x7: false,
    images: ["https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=1000"],
    cuisines: ["Chinese", "North Indian", "Cafe"],
    capacity: 40,
    offer: "Flat 10% OFF",
    promoted: true,
    amenities: {
      wifi: true,
      coffee: true,
      ac: true,
      comfortSeating: true
    },
    description: "Cozy cafe with delicious North Indian cuisine"
  },
  {
    _id: "cafe3",
    name: "Karachi Bakery And Cafe",
    type: "cafe",
    cabinType: "cafe",
    price: 600,
    address: "Narayanguda, Hyderabad",
    distance: "4.7 km",
    rating: 4.0,
    reviews: 92,
    openTime: "08:00",
    closeTime: "22:00",
    is24x7: false,
    images: ["https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=1000"],
    cuisines: ["Wraps", "Bakery", "Cake", "Desserts"],
    capacity: 30,
    offer: "Flat 10% OFF",
    promoted: true,
    amenities: {
      wifi: true,
      coffee: true,
      parking: true
    },
    description: "Famous bakery with delicious cakes and wraps"
  },
  {
    _id: "cafe4",
    name: "The Coffee Cup",
    type: "cafe",
    cabinType: "cafe",
    price: 450,
    address: "Jubilee Hills, Hyderabad",
    distance: "5.2 km",
    rating: 4.6,
    reviews: 340,
    openTime: "07:00",
    closeTime: "23:00",
    is24x7: false,
    images: ["https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=1000"],
    cuisines: ["Coffee", "Snacks", "Desserts"],
    capacity: 25,
    offer: "Flat 15% OFF",
    promoted: false,
    amenities: {
      wifi: true,
      coffee: true,
      ac: true,
      comfortSeating: true,
      tv: true
    },
    description: "Artisanal coffee and gourmet snacks"
  },
  {
    _id: "cafe5",
    name: "Bistro Central",
    type: "cafe",
    cabinType: "cafe",
    price: 850,
    address: "Banjara Hills, Hyderabad",
    distance: "3.5 km",
    rating: 4.3,
    reviews: 189,
    openTime: "10:00",
    closeTime: "22:30",
    is24x7: false,
    images: ["https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=80&w=1000"],
    cuisines: ["Italian", "Continental", "Cafe"],
    capacity: 35,
    offer: "Flat 20% OFF",
    promoted: false,
    amenities: {
      wifi: true,
      parking: true,
      coffee: true,
      ac: true,
      comfortSeating: true
    },
    description: "Authentic Italian bistro in the heart of the city"
  },
  {
    _id: "cafe6",
    name: "Green Leaf Cafe",
    type: "cafe",
    cabinType: "cafe",
    price: 350,
    address: "Gachibowli, Hyderabad",
    distance: "6.8 km",
    rating: 4.2,
    reviews: 156,
    openTime: "08:00",
    closeTime: "21:00",
    is24x7: false,
    images: ["https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&q=80&w=1000"],
    cuisines: ["Healthy", "Salads", "Smoothies"],
    capacity: 20,
    offer: "Flat 10% OFF",
    promoted: false,
    amenities: {
      wifi: true,
      coffee: true,
      ac: true
    },
    description: "Healthy and organic cafe with fresh ingredients"
  },
  {
    _id: "cafe7",
    name: "Mocha House",
    type: "cafe",
    cabinType: "cafe",
    price: 550,
    address: "Madhapur, Hyderabad",
    distance: "4.1 km",
    rating: 4.5,
    reviews: 275,
    openTime: "09:00",
    closeTime: "00:00",
    is24x7: false,
    images: ["https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=1000"],
    cuisines: ["Continental", "Desserts", "Beverages"],
    capacity: 45,
    offer: "Flat 12% OFF",
    promoted: false,
    amenities: {
      wifi: true,
      parking: true,
      coffee: true,
      ac: true,
      tv: true,
      comfortSeating: true
    },
    description: "Premium coffee house with live music nights"
  },
  {
    _id: "cafe8",
    name: "Spice Garden Cafe",
    type: "cafe",
    cabinType: "cafe",
    price: 700,
    address: "Hitech City, Hyderabad",
    distance: "7.2 km",
    rating: 4.0,
    reviews: 98,
    openTime: "11:00",
    closeTime: "23:00",
    is24x7: false,
    images: ["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1000"],
    cuisines: ["South Indian", "Chinese", "Cafe"],
    capacity: 60,
    offer: "Flat 10% OFF",
    promoted: true,
    amenities: {
      wifi: true,
      parking: true,
      coffee: true,
      ac: true,
      comfortSeating: true,
      privateWashroom: true
    },
    description: "Multi-cuisine cafe with outdoor seating"
  }
];

// ✅ Helper: Convert 24hr time to 12hr format with AM/PM (NO IST)
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

// ✅ Helper: Format timing display (NO IST)
const getTimingDisplay = (cabin) => {
  if (cabin.is24x7) {
    return { display: "24x7 Open", icon: Clock, color: "text-emerald-600" };
  }
  
  const openTime = cabin.openTime || "09:00";
  const closeTime = cabin.closeTime || "21:00";
  
  if (openTime && closeTime) {
    const open12 = formatTo12Hour(openTime);
    return { 
      display: `Opens at ${open12}`, 
      icon: Clock, 
      color: "text-blue-600"
    };
  }
  
  return { display: "Timings N/A", icon: Clock, color: "text-gray-400" };
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
  const [showAllCabins, setShowAllCabins] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [isCafeDummyData, setIsCafeDummyData] = useState(false);

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
      const data = res.data || [];
      const activeCabins = data.filter(cabin => cabin.isActive !== false);
      setCabins(activeCabins);
      setFilteredCabins(activeCabins);
      setIsCafeDummyData(false);
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

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setShowAllCabins(true);
    
    if (categoryId === "cafe") {
      setIsCafeDummyData(true);
      setFilteredCabins(DUMMY_CAFES);
      setSelectedType("all");
      setSelectedCabinType("all");
      return;
    }
    
    setIsCafeDummyData(false);
    let filtered = [...cabins];
    
    if (categoryId === "coworking") {
      filtered = filtered.filter(cabin => cabin.isChamber === false || cabin.type === "coworking");
      setSelectedType("coworking");
    } else if (categoryId === "medical") {
      filtered = filtered.filter(cabin => cabin.isChamber === true);
      setSelectedType("chamber");
    } else if (categoryId === "meeting") {
      filtered = filtered.filter(cabin => cabin.cabinType === "meeting" || cabin.type === "meeting");
    } else {
      setSelectedType("all");
      filtered = [...cabins];
    }
    
    setFilteredCabins(filtered);
  };

  const applyFilters = () => {
    if (isCafeDummyData) {
      let filtered = [...DUMMY_CAFES];
      
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase().trim();
        filtered = filtered.filter(cafe => {
          const name = cafe.name?.toLowerCase() || '';
          const address = cafe.address?.toLowerCase() || '';
          const description = cafe.description?.toLowerCase() || '';
          const cuisines = cafe.cuisines?.join(' ').toLowerCase() || '';
          return name.includes(term) || address.includes(term) || description.includes(term) || cuisines.includes(term);
        });
      }
      
      const sorted = applySorting(filtered);
      setFilteredCabins(sorted);
      return;
    }
    
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
      case "all":
      default:
        return sorted;
    }
  };

  useEffect(() => {
    if (!showAllCabins && !isCafeDummyData) {
      applyFilters();
    } else if (isCafeDummyData) {
      applyFilters();
    }
  }, [searchTerm, selectedType, selectedCabinType, cabins, activeFilter, showAllCabins, isCafeDummyData]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedType("all");
    setSelectedCabinType("all");
    setActiveFilter("all");
    setSelectedCategory("all");
    setShowAllCabins(false);
    setIsCafeDummyData(false);
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
    if (cabin.cabinType === "cafe") return "Cafe";
    if (cabin.cabinType === "exclusive") return "Private Office";
    return "Workspace";
  };

  const getTypeColor = (cabin) => {
    if (cabin.isChamber) return "bg-red-100 text-red-700 border-red-200";
    if (cabin.type === "coworking") return "bg-blue-100 text-blue-700 border-blue-200";
    if (cabin.cabinType === "meeting") return "bg-purple-100 text-purple-700 border-purple-200";
    if (cabin.cabinType === "cafe") return "bg-blue-50 text-blue-700 border-blue-200";
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
                    placeholder={isCafeDummyData ? "Search for restaurants..." : "Search for spaces..."}
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
                  <p className="font-bold text-white text-sm">{isCafeDummyData ? DUMMY_CAFES.length : cabins.length}+</p>
                  <p className="text-[7px] text-white/40 font-light uppercase tracking-wider">{isCafeDummyData ? "Cafes" : "Spaces"}</p>
                </div>
              </div>
              <div className="w-px h-8 bg-white/10"></div>
              <div className="flex items-center gap-2 text-white/80">
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Users size={14} className="text-white/70" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-white text-sm">{isCafeDummyData ? "200+" : "100+"}</p>
                  <p className="text-[7px] text-white/40 font-light uppercase tracking-wider">Seats</p>
                </div>
              </div>
              <div className="w-px h-8 bg-white/10"></div>
              <div className="flex items-center gap-2 text-white/80">
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Star size={14} className="text-white/70" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-white text-sm">{isCafeDummyData ? "4.3★" : "4.8★"}</p>
                  <p className="text-[7px] text-white/40 font-light uppercase tracking-wider">Rating</p>
                </div>
              </div>
              <div className="w-px h-8 bg-white/10"></div>
              <div className="flex items-center gap-2 text-white/80">
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Clock size={14} className="text-white/70" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-white text-sm">{isCafeDummyData ? "10 AM" : "24/7"}</p>
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
                  setShowAllCabins(false);
                  setIsCafeDummyData(false);
                  setFilteredCabins(cabins);
                  setSelectedType("all");
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
                      ? `${category.bgGradient} ${category.borderColor} shadow-lg shadow-${category.id === 'coworking' ? 'blue' : category.id === 'medical' ? 'red' : category.id === 'meeting' ? 'purple' : 'blue'}-100`
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
                        {category.stats}
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
              {isCafeDummyData ? (
                <>
                  <span className="text-blue-600">Get up to 50% OFF</span>
                  <span className="text-sm font-normal text-gray-400">on your dining bills</span>
                </>
              ) : (
                `${filteredCabins.length} ${filteredCabins.length === 1 ? 'Space' : 'Spaces'} Available`
              )}
            </h2>
            <p className="text-xs text-gray-500">
              {selectedCategory !== "all" ? `Showing ${CATEGORIES.find(c => c.id === selectedCategory)?.label || ''} ${isCafeDummyData ? 'restaurants' : 'spaces'}` : 'All premium spaces'}
            </p>
          </div>
          {filteredCabins.length > 0 && (
            <div className="flex items-center gap-2">
              {isCafeDummyData && (
                <button className="text-[10px] text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 flex items-center gap-1 hover:bg-blue-100 transition">
                  <Gift size={12} />
                  Check out all the restaurants
                </button>
              )}
              <span className="text-[10px] text-gray-400 bg-white px-3 py-1 rounded-full border border-gray-200 flex items-center gap-1">
                <TrendingUp size={12} className="text-green-500" />
                {filteredCabins.length} results
              </span>
            </div>
          )}
        </div>

        {/* ============= ZOMATO-STYLE BANNER - BLUE THEME ============= */}
        {isCafeDummyData && (
          <div className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 shadow-lg shadow-blue-200">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-3xl"></div>
            </div>
            
            <div className="relative px-6 py-5 md:py-6 md:px-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex items-center gap-2">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <Pizza size={24} className="text-white" />
                    </div>
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <CupSoda size={24} className="text-white" />
                    </div>
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <Sandwich size={24} className="text-white" />
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-white">
                      🍽️ Hyderabad Restaurants
                    </h3>
                    <p className="text-white/90 text-sm flex items-center gap-2">
                      <span>Discover the best dining experiences</span>
                      <span className="hidden sm:inline">•</span>
                      <span className="text-white/80 text-xs">Get up to 50% OFF</span>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <Percent size={14} className="text-white" />
                    <span className="text-white text-xs font-medium">Flat 10% OFF</span>
                  </div>
                  <button className="px-5 py-2 bg-white text-blue-600 rounded-full text-xs font-bold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-1.5">
                    View All <ChevronRight size={16} />
                  </button>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-white/20">
                <span className="text-white/70 text-[10px] font-medium flex items-center gap-1">
                  <Rocket size={12} className="text-yellow-300" />
                  Promoted
                </span>
                <span className="text-white/70 text-[10px] font-medium flex items-center gap-1">
                  <Star size={12} className="text-yellow-300 fill-yellow-300" />
                  4.5★ Avg Rating
                </span>
                <span className="text-white/70 text-[10px] font-medium flex items-center gap-1">
                  <Clock size={12} className="text-white/70" />
                  Open Now
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Search & Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={isCafeDummyData ? "Search by restaurant name, cuisine, or location..." : "Search by name, address, or description..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-50 hover:bg-white transition"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {!isCafeDummyData && (
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
                    <option value="cafe">Cafe</option>
                  </select>
                </>
              )}
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
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-200"
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

        {/* Results Grid - Clean Zomato Style */}
        {filteredCabins.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 size={32} className="text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium text-lg">No {isCafeDummyData ? 'restaurants' : 'spaces'} found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or search terms</p>
            <button
              onClick={clearFilters}
              className="mt-4 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredCabins.map((cabin) => {
              const inWishlist = isInWishlist(cabin._id);
              const timing = getTimingDisplay(cabin);
              const TimingIcon = timing.icon;
              const isCafe = cabin.cabinType === "cafe";
              
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
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000";
                      }}
                    />
                    
                    {/* Badges - Top Left */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      {isCafe && cabin.promoted && (
                        <span className="px-2.5 py-0.5 text-[9px] font-bold rounded bg-blue-600 text-white flex items-center gap-0.5">
                          <Rocket size={10} /> Promoted
                        </span>
                      )}
                      {isCafe && cabin.offer && (
                        <span className="px-2.5 py-0.5 text-[9px] font-bold rounded bg-green-500 text-white flex items-center gap-0.5">
                          <Percent size={10} /> {cabin.offer}
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
                    {/* Restaurant Name */}
                    <h3 className="font-semibold text-gray-900 text-sm">{cabin.name}</h3>
                    
                    {/* Cuisines */}
                    {isCafe && cabin.cuisines && (
                      <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                        {cabin.cuisines.join(', ')}
                      </p>
                    )}
                    
                    {/* Location */}
                    <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-1">
                      <MapPin size={12} />
                      <span>{cabin.address?.split(',')[0] || 'N/A'}</span>
                    </p>
                    
                    {/* Timing and Distance */}
                    <div className={`flex items-center gap-1 mt-1 ${timing.color}`}>
                      <TimingIcon size={12} />
                      <span className="text-[11px] font-medium">{timing.display}</span>
                      {isCafe && cabin.distance && (
                        <span className="text-[11px] text-gray-400 ml-1">• {cabin.distance}</span>
                      )}
                    </div>
                    
                    {/* Rating and Price Row */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center gap-0.5 bg-green-600 text-white px-1.5 py-0.5 rounded text-[10px] font-bold">
                          <span>{cabin.rating || 4.8}</span>
                          <Star size={10} className="fill-white" />
                        </div>
                        <span className="text-[10px] text-gray-400">{cabin.reviews || 24} reviews</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-gray-900">{formatCurrency(cabin.price)}</span>
                        <span className="text-[9px] text-gray-400 ml-0.5">for two</span>
                      </div>
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