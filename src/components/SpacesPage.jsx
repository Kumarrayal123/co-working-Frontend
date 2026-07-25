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
  Grid,
  List,
  Stethoscope,
  Briefcase,
  TrendingUp,
  Sparkles,
  Navigation,
  Award,
  Zap
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

function SpacesPage() {
  const [cabins, setCabins] = useState([]);
  const [filteredCabins, setFilteredCabins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCabinType, setSelectedCabinType] = useState("all");
  const [activeFilter, setActiveFilter] = useState("all");
  
  // Category selection popup
  const [showCategoryPopup, setShowCategoryPopup] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCabins();
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

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setShowCategoryPopup(false);
    
    let filtered = [...cabins];
    if (category === "coworking") {
      filtered = filtered.filter(cabin => cabin.isChamber === false || cabin.type === "coworking");
      setSelectedType("coworking");
    } else if (category === "medical") {
      filtered = filtered.filter(cabin => cabin.isChamber === true);
      setSelectedType("chamber");
    }
    setFilteredCabins(filtered);
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
    if (!showCategoryPopup) {
      applyFilters();
    }
  }, [searchTerm, selectedType, selectedCabinType, cabins, showCategoryPopup, activeFilter]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedType("all");
    setSelectedCabinType("all");
    setActiveFilter("all");
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
    if (cabin.type === "coworking") return "Co-Working Space";
    return "Workspace";
  };

  const getTypeColor = (cabin) => {
    if (cabin.isChamber) return "bg-red-100 text-red-700 border-red-200";
    if (cabin.type === "coworking") return "bg-blue-100 text-blue-700 border-blue-200";
    return "bg-emerald-100 text-emerald-700 border-emerald-200";
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

      {/* Category Selection Popup */}
      {showCategoryPopup && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 size={28} className="text-indigo-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Choose Space Type</h2>
              <p className="text-sm text-gray-500 mt-1">Select what you're looking for</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <button
                onClick={() => handleCategorySelect("coworking")}
                className="group relative p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border-2 border-transparent hover:border-blue-400 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
              >
                <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 rounded-xl transition"></div>
                <div className="relative">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition">
                    <Briefcase size={24} className="text-blue-600" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">Co-Working</h3>
                  <p className="text-[10px] text-gray-500 mt-0.5">Flexible workspaces</p>
                  <div className="mt-2 text-[9px] font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition">
                    Browse Spaces →
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleCategorySelect("medical")}
                className="group relative p-4 bg-gradient-to-br from-red-50 to-red-100/50 rounded-xl border-2 border-transparent hover:border-red-400 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
              >
                <div className="absolute inset-0 bg-red-500/0 group-hover:bg-red-500/5 rounded-xl transition"></div>
                <div className="relative">
                  <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition">
                    <Stethoscope size={24} className="text-red-600" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">Medical</h3>
                  <p className="text-[10px] text-gray-500 mt-0.5">Healthcare chambers</p>
                  <div className="mt-2 text-[9px] font-medium text-red-600 opacity-0 group-hover:opacity-100 transition">
                    Browse Chambers →
                  </div>
                </div>
              </button>
            </div>

            <button
              onClick={() => setShowCategoryPopup(false)}
              className="mt-4 text-xs text-gray-400 hover:text-gray-600 transition w-full text-center"
            >
              Skip for now
            </button>
          </div>
        </div>
      )}

      <div className="pt-24 px-4 sm:px-6 md:px-8 max-w-full mx-auto pb-16">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {selectedCategory === "coworking" ? "Co-Working Spaces" : 
               selectedCategory === "medical" ? "Medical Chambers" : 
               "Browse Spaces"}
            </h1>
            <p className="text-sm text-gray-500">
              {filteredCabins.length} {selectedCategory === "medical" ? "chambers" : "spaces"} available
            </p>
          </div>
          <div className="flex items-center gap-2">
            {selectedCategory && (
              <button
                onClick={() => setShowCategoryPopup(true)}
                className="px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition flex items-center gap-1"
              >
                <Building2 size={14} /> Switch Category
              </button>
            )}
            {/* View toggle buttons REMOVED - only grid view now */}
          </div>
        </div>

        {/* Filters - Search + Type */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, address, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
              >
                <option value="all">All Types</option>
                <option value="coworking">Co-Working</option>
                <option value="chamber">Medical Chambers</option>
              </select>
              <select
                value={selectedCabinType}
                onChange={(e) => setSelectedCabinType(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
              >
                <option value="all">All Cabin Types</option>
                <option value="normal">Normal</option>
                <option value="exclusive">Exclusive</option>
              </select>
              {(searchTerm || selectedType !== "all" || selectedCabinType !== "all") && (
                <button
                  onClick={clearFilters}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
                  title="Clear filters"
                >
                  <XIcon size={18} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filter Chips - Top Rated, New Added, Nearest */}
        <div className="flex flex-wrap gap-2 mb-4">
          {filterOptions.map((filter) => {
            const Icon = filter.icon;
            const isActive = activeFilter === filter.id;
            return (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                <Icon size={14} />
                {filter.label}
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white/50 ml-0.5"></span>
                )}
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
          <span className="text-[10px] text-gray-400 self-center ml-auto">
            {filteredCabins.length} results
          </span>
        </div>

        {/* Results - Only Grid View */}
        {filteredCabins.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-12 text-center">
            <Building2 size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">No spaces found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or search terms</p>
            <button
              onClick={clearFilters}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCabins.map((cabin) => (
              <div
                key={cabin._id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition cursor-pointer group"
                onClick={() => navigate(`/cabin/${cabin._id}`)}
              >
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <img
                    src={cabin.images?.[0] ? getImageUrl(cabin.images[0]) : "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000"}
                    alt={cabin.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000";
                    }}
                  />
                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-wrap gap-1.5">
                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full border ${getTypeColor(cabin)}`}>
                      {getTypeLabel(cabin)}
                    </span>
                    {cabin.cabinType === "exclusive" && (
                      <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-amber-100 text-amber-700 border border-amber-200 flex items-center gap-0.5">
                        <Crown size={10} /> Exclusive
                      </span>
                    )}
                  </div>
                  {/* Price */}
                  <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-lg">
                    <span className="text-white font-bold text-sm">{formatCurrency(cabin.price)}</span>
                    <span className="text-white/60 text-[9px]">/day</span>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">{cabin.name}</h3>
                  <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                    <MapPin size={11} />
                    <span className="line-clamp-1">{cabin.address?.split(',')[0] || 'N/A'}</span>
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {getActiveAmenities(cabin.amenities).slice(0, 4).map((key) => {
                      const amenity = AMENITY_ICONS[key];
                      if (!amenity) return null;
                      const Icon = amenity.icon;
                      return (
                        <span key={key} className="p-1 bg-gray-50 rounded-lg" title={amenity.label}>
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
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[10px] text-gray-400 flex items-center gap-1">
                      <Users size={11} /> {cabin.capacity || 'N/A'} seats
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate(`/cabin/${cabin._id}`); }}
                      className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-medium rounded-lg transition flex items-center gap-1"
                    >
                      <Eye size={11} /> View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-[9px] text-gray-400 font-medium tracking-wider">
          © IRYAX SPACE — All Rights Reserved
        </div>
      </div>
    </div>
  );
}

export default SpacesPage;