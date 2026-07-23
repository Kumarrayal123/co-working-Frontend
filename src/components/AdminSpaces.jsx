import axios from "axios";
import { 
  ArrowRight, 
  MapPin, 
  Users, 
  Building2, 
  Trash2,
  Calendar,
  XCircle,
  Crown,
  Sparkles,
  Wifi,
  Car,
  Lock,
  Armchair,
  Bath,
  Shield,
  Coffee,
  Dumbbell,
  Tv,
  Printer,
  Phone,
  Wind,
  X,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import { toast } from "react-toastify";
import "./Dashboard.css";

const API_URL = "http://localhost:5003";
const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000";

const AdminSpaces = () => {
  const [cabins, setCabins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterLocation, setFilterLocation] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedCabin, setSelectedCabin] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
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

  const handleViewDetails = (cabin) => {
    setSelectedCabin(cabin);
    setCurrentImageIndex(0);
    setShowPopup(true);
  };

  const nextImage = () => {
    if (selectedCabin && selectedCabin.images) {
      setCurrentImageIndex((prev) => 
        prev === selectedCabin.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedCabin && selectedCabin.images) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedCabin.images.length - 1 : prev - 1
      );
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
    setFilterLocation("");
    setFilterType("all");
    setFilterStatus("all");
  };

  const filteredCabins = cabins.filter(cabin => {
    const matchLocation = filterLocation ? cabin.address?.toLowerCase().includes(filterLocation.toLowerCase()) : true;
    const matchType = filterType === 'all' || cabin.cabinType === filterType;
    const matchStatus = filterStatus === 'all' || 
                       (filterStatus === 'active' && cabin.isActive === true) ||
                       (filterStatus === 'inactive' && cabin.isActive === false);
    return matchLocation && matchType && matchStatus;
  });

  const getImageUrl = (img) => {
    if (!img) return PLACEHOLDER_IMAGE;
    if (img.startsWith("http")) return img;
    const cleanPath = img.replace(/\\/g, "/").replace(/^\/+/, "");
    return `${API_URL}/${cleanPath}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const amenityIcons = {
    wifi: { icon: Wifi, label: "WiFi" },
    parking: { icon: Car, label: "Parking" },
    lockers: { icon: Lock, label: "Lockers" },
    comfortSeating: { icon: Armchair, label: "Comfort Seating" },
    privateWashroom: { icon: Bath, label: "Private Washroom" },
    secureAccess: { icon: Shield, label: "Secure Access" },
    coffee: { icon: Coffee, label: "Coffee" },
    gym: { icon: Dumbbell, label: "Gym" },
    ac: { icon: Wind, label: "AC" },
    tv: { icon: Tv, label: "TV" },
    printer: { icon: Printer, label: "Printer" },
    phone: { icon: Phone, label: "Phone" }
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
        <div className="admin-dash__header mb-4">
          <div>
            <h1 className="admin-dash__greeting">
              All <span>Spaces</span>
            </h1>
          </div>
        </div>

        {/* Filters Panel */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6 shadow-sm">
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

            <div className="flex items-end gap-2">
              <button
                onClick={clearFilters}
                className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-1.5"
              >
                <XCircle size={16} />
                Clear All
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

        {/* Results Count */}
        {(filterLocation || filterType !== 'all' || filterStatus !== 'all') && (
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
                  className="admin-dash__card group flex flex-col h-full hover:shadow-lg transition-all duration-300 cursor-pointer"
                  onClick={() => handleViewDetails(cabin)}
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

                      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleViewDetails(cabin)}
                          className="h-10 w-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} />
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

      {/* Detail Popup */}
      {showPopup && selectedCabin && (
        <div 
          className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowPopup(false);
          }}
        >
          <div className="bg-white rounded-2xl max-w-3xl w-full mt-16 mb-8 shadow-2xl animate-in slide-in-from-bottom duration-300 relative overflow-y-auto max-h-[85vh]">
            {/* Close Button */}
            <button
              onClick={() => setShowPopup(false)}
              className="sticky top-4 right-4 z-10 float-right p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-lg border border-slate-200"
            >
              <X size={20} className="text-slate-600" />
            </button>

            {/* Main Image with Navigation */}
            <div className="relative h-80 md:h-96 overflow-hidden -mt-12 bg-slate-900">
              <div className="flex h-full">
                <img
                  src={selectedCabin.images && selectedCabin.images.length > 0 
                    ? getImageUrl(selectedCabin.images[currentImageIndex]) 
                    : PLACEHOLDER_IMAGE}
                  alt={`${selectedCabin.name}`}
                  className="w-full h-full object-contain"
                  onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }}
                />
              </div>
              
              {/* Navigation Arrows */}
              {selectedCabin.images && selectedCabin.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none" />
              
              {/* Status Badge */}
              <div className="absolute bottom-4 left-4 flex gap-2 pointer-events-none">
                <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5 ${
                  selectedCabin.isActive ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${selectedCabin.isActive ? 'bg-white animate-pulse' : 'bg-white/70'}`}></span>
                  {selectedCabin.isActive ? 'Active' : 'Inactive'}
                </span>
                {selectedCabin.cabinType === 'exclusive' && (
                  <span className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                    <Crown size={14} />
                    Premium
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Images */}
            {selectedCabin.images && selectedCabin.images.length > 1 && (
              <div className="px-6 pt-4 pb-2">
                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                  {selectedCabin.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        idx === currentImageIndex 
                          ? 'border-indigo-600 ring-2 ring-indigo-200' 
                          : 'border-transparent hover:border-slate-300'
                      }`}
                    >
                      <img
                        src={getImageUrl(img)}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Content */}
            <div className="p-6 md:p-8 pt-4">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-1">
                    {selectedCabin.cabinType === 'exclusive' ? 'Premium Space' : 'Coworking Space'}
                  </p>
                  <h2 className="text-2xl font-bold text-slate-900">{selectedCabin.name}</h2>
                </div>
                <div className="text-right bg-indigo-50 px-4 py-2 rounded-xl">
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-2xl font-bold text-indigo-600">₹{selectedCabin.price || '0'}</span>
                    <span className="text-xs text-slate-400 font-bold uppercase">/ Hour</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-medium text-slate-500 mt-0.5 justify-end">
                    <Users size={12} />
                    {selectedCabin.capacity} Seats
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-2 mb-4 p-3 bg-slate-50 rounded-xl">
                <MapPin size={16} className="text-indigo-600 mt-0.5 shrink-0" />
                <p className="text-sm text-slate-600">{selectedCabin.address}</p>
              </div>

              {/* Description */}
              {selectedCabin.description && (
                <div className="mb-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {selectedCabin.description}
                  </p>
                </div>
              )}

              {/* Amenities */}
              {selectedCabin.amenities && Object.values(selectedCabin.amenities).some(v => v === true) && (
                <div className="mb-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Amenities</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(selectedCabin.amenities).map(([key, value]) => {
                      const amenity = amenityIcons[key];
                      if (!amenity || !value) return null;
                      const Icon = amenity.icon;
                      return (
                        <span key={key} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-full text-xs font-medium text-slate-700 border border-slate-100">
                          <Icon size={14} className="text-indigo-500" />
                          {amenity.label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Type</p>
                  <p className="text-sm font-semibold text-slate-900 capitalize">{selectedCabin.cabinType || 'Normal'}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Capacity</p>
                  <p className="text-sm font-semibold text-slate-900">{selectedCabin.capacity} Seats</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Created</p>
                  <p className="text-sm font-semibold text-slate-900">{formatDate(selectedCabin.createdAt)}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-100">
                <button
                  onClick={() => navigate(`/cabin/${selectedCabin._id}`)}
                  className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Eye size={16} />
                  View Full Details
                </button>
                <button
                  onClick={() => {
                    setShowPopup(false);
                    handleDelete(selectedCabin._id);
                  }}
                  className="px-4 py-2.5 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
                <button
                  onClick={() => setShowPopup(false)}
                  className="px-4 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSpaces;