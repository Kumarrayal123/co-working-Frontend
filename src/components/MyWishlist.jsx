// MyWishlist.jsx - Complete Wishlist Page with Get and Delete APIs
import axios from "axios";
import {
  Heart,
  MapPin,
  IndianRupee,
  Eye,
  Trash2,
  Building2,
  Users,
  Star,
  Clock,
  Search,
  X as XIcon,
  Sparkles,
  ArrowLeft,
  HeartPulse,
  Crown,
  Stethoscope,
  Briefcase,
  Lock,
  Armchair,
  Wifi,
  ParkingCircle,
  Bath,
  Shield,
  Coffee,
  Dumbbell,
  Fan,
  Tv,
  Printer,
  Phone
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

function MyWishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleting, setDeleting] = useState(false);

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

  // ✅ FETCH WISHLIST - GET /api/cabins/mywishlist/:userId
  const fetchWishlist = async () => {
    if (!userId || !token) {
      toast.error("Please login to view wishlist");
      navigate("/login");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        `${API_URL}/api/cabins/mywishlist/${userId}`,
        getAuthHeader()
      );
      console.log("Wishlist Response:", res.data);
      setWishlist(res.data.wishlist || []);
      
      if (res.data.wishlist?.length === 0) {
        toast.info("Your wishlist is empty");
      }
    } catch (err) {
      console.error("Error fetching wishlist:", err);
      setError("Failed to load wishlist. Please try again.");
      toast.error("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  // ✅ DELETE FROM WISHLIST - DELETE /api/cabins/toggle/:userId/:cabinId
  const removeFromWishlist = async (cabinId, cabinName) => {
    if (!userId || !token) {
      toast.error("Please login to manage wishlist");
      navigate("/login");
      return;
    }

    setDeleting(true);
    try {
      const res = await axios.delete(
        `${API_URL}/api/cabins/${userId}/${cabinId}`,
        getAuthHeader()
      );
      
      console.log("Delete Response:", res.data);
      
      // ✅ Update wishlist
      setWishlist(res.data.wishlist || []);
      toast.success(`Removed "${cabinName || 'Cabin'}" from wishlist`);
      
      if (res.data.wishlist?.length === 0) {
        toast.info("Your wishlist is now empty");
      }
    } catch (err) {
      console.error("Error removing from wishlist:", err);
      toast.error(err.response?.data?.error || "Failed to remove from wishlist");
    } finally {
      setDeleting(false);
    }
  };

  // ✅ FILTER WISHLIST
  const filteredWishlist = wishlist.filter((cabin) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase().trim();
    const name = cabin.name?.toLowerCase() || '';
    const address = cabin.address?.toLowerCase() || '';
    return name.includes(term) || address.includes(term);
  });

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

  useEffect(() => {
    fetchWishlist();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SimpleUserNavbar />
        <div className="pt-24 px-4 max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-gray-500 text-sm">Loading wishlist...</p>
            </div>
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
        <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-pink-600 to-rose-700">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/5 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-t from-rose-900/20 to-transparent"></div>
          <div className="absolute top-10 right-20 w-72 h-72 bg-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-rose-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] bg-repeat"></div>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <Heart size={24} className="text-white fill-current" />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                      My Wishlist
                    </h1>
                    <p className="text-white/70 text-sm font-light">
                      {wishlist.length} {wishlist.length === 1 ? 'space' : 'spaces'} saved
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex items-center bg-white/10 backdrop-blur-md rounded-full border border-white/20 p-1.5 shadow-lg w-full sm:w-72">
              <div className="flex-1 px-3 flex items-center gap-2">
                <Search size={16} className="text-white/50" />
                <input
                  type="text"
                  placeholder="Search wishlist..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent text-white placeholder-white/40 text-sm outline-none"
                />
              </div>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="p-1.5 text-white/50 hover:text-white transition"
                >
                  <XIcon size={14} />
                </button>
              )}
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

      {/* ============= MAIN CONTENT ============= */}
      <div className="px-4 sm:px-6 md:px-8 max-w-7xl mx-auto -mt-2 pb-16">
        
        {/* Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-xs text-gray-500 font-medium">Total Saved</p>
                <p className="text-2xl font-bold text-red-600">{wishlist.length}</p>
              </div>
              <div className="w-px h-10 bg-gray-200"></div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Categories</p>
                <p className="text-lg font-bold text-gray-700">
                  {new Set(wishlist.map(c => getTypeLabel(c))).size}
                </p>
              </div>
            </div>
            {wishlist.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm("Are you sure you want to clear your wishlist?")) {
                    // Clear all - sequential delete
                    const clearAll = async () => {
                      for (const cabin of wishlist) {
                        try {
                          await axios.delete(
                            `${API_URL}/api/cabins/${userId}/${cabin._id}`,
                            getAuthHeader()
                          );
                        } catch (err) {
                          console.error("Error removing:", err);
                        }
                      }
                      fetchWishlist();
                      toast.success("Wishlist cleared");
                    };
                    clearAll();
                  }
                }}
                className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1 bg-red-50 px-3 py-1.5 rounded-full hover:bg-red-100 transition"
              >
                <Trash2 size={14} /> Clear All
              </button>
            )}
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-md mx-auto mb-6">
            <p className="text-red-600 font-medium">{error}</p>
            <button 
              onClick={fetchWishlist}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {wishlist.length === 0 && !error && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16 text-center">
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart size={40} className="text-red-300" />
            </div>
            <p className="text-gray-500 font-medium text-xl">Your wishlist is empty</p>
            <p className="text-sm text-gray-400 mt-2 max-w-sm mx-auto">
              Start saving your favorite workspaces by tapping the ❤️ icon on any space
            </p>
            <button
              onClick={() => navigate("/spaceforusers")}
              className="mt-6 px-6 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-lg text-sm font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Browse Spaces
            </button>
          </div>
        )}

        {/* Results Grid */}
        {filteredWishlist.length > 0 && (
          <>
            {searchTerm && (
              <p className="text-xs text-gray-400 mb-3">
                Showing {filteredWishlist.length} of {wishlist.length} results
              </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredWishlist.map((cabin) => (
                <div
                  key={cabin._id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="relative h-48 overflow-hidden bg-gray-100">
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
                    {/* Remove button */}
                    <button 
                      className="absolute top-3 right-3 w-8 h-8 bg-red-500 backdrop-blur-sm rounded-full flex items-center justify-center transition shadow-md hover:bg-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromWishlist(cabin._id, cabin.name);
                      }}
                      disabled={deleting}
                    >
                      <Trash2 size={14} className="text-white" />
                    </button>
                    {/* Heart badge */}
                    <div className="absolute bottom-3 left-3 bg-red-500/90 backdrop-blur-sm px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                      <Heart size={12} className="text-white fill-current" />
                      <span className="text-white text-[9px] font-medium">Saved</span>
                    </div>
                  </div>

                  <div className="p-4">
                    <div 
                      className="cursor-pointer"
                      onClick={() => navigate(`/cabin/${cabin._id}`)}
                    >
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
                    </div>
                    
                    <div className="mt-3 flex items-center justify-between pt-3 border-t border-gray-50">
                      <span className="text-[10px] text-gray-400 flex items-center gap-1">
                        <Users size={11} /> {cabin.capacity || 'N/A'} seats
                      </span>
                      <button
                        onClick={() => navigate(`/cabin/${cabin._id}`)}
                        className="px-4 py-1.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-[10px] font-medium rounded-lg transition flex items-center gap-1 shadow-sm hover:shadow"
                      >
                        <Eye size={11} /> View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-rose-500 rounded-lg flex items-center justify-center">
                  <HeartPulse size={14} className="text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">IRYAX SPACE</p>
                  <p className="text-[8px] text-gray-400 font-light tracking-wider">MY WISHLIST</p>
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
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        .animate-pulse {
          animation: pulse 3s ease-in-out infinite;
        }
        .delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>
    </div>
  );
}

export default MyWishlist;