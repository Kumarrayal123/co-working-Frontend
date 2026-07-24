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
  Stethoscope,
  Briefcase,
  Plus,
  Upload,
  Home,
  CreditCard,
  Clock,
  Info,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import { toast } from "react-toastify";
import "./Dashboard.css";

const API_URL = "http://localhost:5003";
const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000";

// ─── ALL AMENITIES ───
const ALL_AMENITIES = [
  { key: "wifi", label: "Wi-Fi", icon: Wifi },
  { key: "parking", label: "Parking", icon: Car },
  { key: "lockers", label: "Lockers", icon: Lock },
  { key: "comfortSeating", label: "Comfort Seating", icon: Armchair },
  { key: "privateWashroom", label: "Private Washroom", icon: Bath },
  { key: "secureAccess", label: "Secure Access", icon: Shield },
  { key: "coffee", label: "Coffee", icon: Coffee },
  { key: "gym", label: "Gym", icon: Dumbbell },
  { key: "ac", label: "AC", icon: Wind },
  { key: "tv", label: "TV", icon: Tv },
  { key: "printer", label: "Printer", icon: Printer },
  { key: "phone", label: "Phone", icon: Phone },
];

const AdminSpaces = () => {
  const [cabins, setCabins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedCabin, setSelectedCabin] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // ─── ADD SPACE MODAL STATE ───
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [pricingPlans, setPricingPlans] = useState([]);
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    capacity: "",
    address: "",
    price: "",
    cabin: "",
    cabinType: "normal",
    isChamber: false,
    amenities: {
      wifi: false,
      parking: false,
      lockers: false,
      comfortSeating: false,
      privateWashroom: false,
      secureAccess: false,
      coffee: false,
      gym: false,
      ac: false,
      tv: false,
      printer: false,
      phone: false,
    },
  });

  const navigate = useNavigate();

  // ─── FETCH CABINS ───
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

  // ─── DELETE ───
  const handleDelete = async (cabinId) => {
    if (!window.confirm("Are you sure you want to delete this space?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/api/cabins/${cabinId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Space deleted successfully");
      setCabins(cabins.filter(c => c._id !== cabinId));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete space");
    }
  };

  // ─── VIEW DETAILS ───
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

  // ─── FILTERS ───
  const getFilteredByTab = () => {
    if (activeTab === "chambers") {
      return cabins.filter(c => c.isChamber === true);
    } else if (activeTab === "coworking") {
      return cabins.filter(c => c.isChamber === false);
    }
    return cabins;
  };

  const tabFilteredCabins = getFilteredByTab();

  const getLocations = () => {
    const locations = tabFilteredCabins
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

  const filteredCabins = tabFilteredCabins.filter(cabin => {
    const matchLocation = filterLocation ? cabin.address?.toLowerCase().includes(filterLocation.toLowerCase()) : true;
    const matchType = filterType === 'all' || cabin.cabinType === filterType;
    const matchStatus = filterStatus === 'all' || 
                       (filterStatus === 'active' && cabin.isActive === true) ||
                       (filterStatus === 'inactive' && cabin.isActive === false);
    return matchLocation && matchType && matchStatus;
  });

  // ─── HELPERS ───
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

  const chamberCount = cabins.filter(c => c.isChamber === true).length;
  const coworkingCount = cabins.filter(c => c.isChamber === false).length;

  // ─── ADD SPACE FUNCTIONS ───
  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const toggleAddAmenity = (key) => {
    setFormData((prev) => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [key]: !prev.amenities[key],
      },
    }));
  };

  const handleAddImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const removeAddImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const addPlan = () => {
    const label = prompt("Plan Label:");
    const hours = prompt("Included Hours:");
    const cost = prompt("Cost (₹):");
    const validity = prompt("Validity (Days):");
    if (hours && cost && validity) {
      setPricingPlans([...pricingPlans, {
        label: (label || "").trim(),
        hours: Number(hours),
        cost: Number(cost),
        validity: Number(validity)
      }]);
    }
  };

  const removePlan = (index) => {
    setPricingPlans(pricingPlans.filter((_, i) => i !== index));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const data = new FormData();
    const cabinName = formData.cabin ? `${formData.name} - ${formData.cabin}` : formData.name;
    data.append("name", cabinName);
    data.append("description", formData.description);
    data.append("capacity", formData.capacity);
    data.append("address", formData.address);
    data.append("price", formData.price);
    data.append("cabinType", formData.cabinType);
    data.append("isChamber", formData.isChamber);
    data.append("pricingPlans", JSON.stringify(pricingPlans));
    data.append("amenities", JSON.stringify(formData.amenities));
    images.forEach((img) => data.append("images", img));

    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_URL}/api/cabins`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`${formData.isChamber ? 'Medical Chamber' : 'Co-Working Space'} added successfully!`);
      setIsAddModalOpen(false);
      
      // Reset form
      setFormData({
        name: "",
        description: "",
        capacity: "",
        address: "",
        price: "",
        cabin: "",
        cabinType: "normal",
        isChamber: false,
        amenities: {
          wifi: false,
          parking: false,
          lockers: false,
          comfortSeating: false,
          privateWashroom: false,
          secureAccess: false,
          coffee: false,
          gym: false,
          ac: false,
          tv: false,
          printer: false,
          phone: false,
        },
      });
      setImages([]);
      setPricingPlans([]);
      
      // Refresh list
      const res = await axios.get(`${API_URL}/api/cabins`);
      setCabins(res.data);
    } catch (err) {
      console.error("Add Space Error:", err);
      toast.error("Failed to add space");
    } finally {
      setSubmitting(false);
    }
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
        {/* Header with Add Button */}
        <div className="admin-dash__header mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="admin-dash__greeting">
              All <span>Spaces</span>
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage all your medical chambers and co-working spaces
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm hover:shadow-md whitespace-nowrap"
          >
            <Plus size={18} />
            Add Space
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-200 pb-0">
          <button
            onClick={() => {
              setActiveTab("all");
              clearFilters();
            }}
            className={`
              px-5 py-2.5 rounded-t-lg text-sm font-medium transition-all flex items-center gap-2
              ${activeTab === "all" 
                ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }
            `}
          >
            <Building2 size={16} />
            All Spaces
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
              {cabins.length}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab("chambers");
              clearFilters();
            }}
            className={`
              px-5 py-2.5 rounded-t-lg text-sm font-medium transition-all flex items-center gap-2
              ${activeTab === "chambers" 
                ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }
            `}
          >
            <Stethoscope size={16} />
            Medical Chambers
            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
              {chamberCount}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab("coworking");
              clearFilters();
            }}
            className={`
              px-5 py-2.5 rounded-t-lg text-sm font-medium transition-all flex items-center gap-2
              ${activeTab === "coworking" 
                ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }
            `}
          >
            <Briefcase size={16} />
            Co-Working Spaces
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
              {coworkingCount}
            </span>
          </button>
        </div>

        {/* Filters Panel */}
        {tabFilteredCabins.length > 0 && (
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
        )}

        {/* Results Count */}
        {(filterLocation || filterType !== 'all' || filterStatus !== 'all') && (
          <div className="flex items-center justify-between mb-4 px-1">
            <p className="text-sm text-slate-500">
              Showing <strong className="text-slate-900">{filteredCabins.length}</strong> results
            </p>
            <span className="text-xs text-slate-400">
              {filteredCabins.length} of {tabFilteredCabins.length} total spaces
            </span>
          </div>
        )}

        {/* Main Content */}
        {filteredCabins.length === 0 ? (
          <div className="admin-dash__error" style={{ background: '#f8fafc', borderColor: '#e2e8f0' }}>
            {activeTab === "chambers" ? (
              <Stethoscope size={48} className="text-slate-300 mb-4" />
            ) : activeTab === "coworking" ? (
              <Briefcase size={48} className="text-slate-300 mb-4" />
            ) : (
              <Building2 size={48} className="text-slate-300 mb-4" />
            )}
            <p className="admin-dash__error-title" style={{ color: '#475569' }}>
              No {activeTab === "chambers" ? "medical chambers" : activeTab === "coworking" ? "co-working spaces" : "spaces"} found
            </p>
            <p className="admin-dash__error-message">Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCabins.map((cabin) => {
              const isActive = cabin.isActive === true;
              const isExclusive = cabin.cabinType === 'exclusive';
              const isNew = new Date(cabin.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
              const isChamber = cabin.isChamber === true;
              
              return (
                <div
                  key={cabin._id}
                  className="admin-dash__card group flex flex-col h-full hover:shadow-lg transition-all duration-300 cursor-pointer"
                  onClick={() => handleViewDetails(cabin)}
                >
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

                    <div className="absolute top-3 right-3 z-30 flex flex-col gap-1.5">
                      <span className={`
                        px-2.5 py-0.5 rounded-full text-[9px] font-bold shadow-lg flex items-center gap-1
                        ${isChamber 
                          ? 'bg-emerald-500 text-white' 
                          : 'bg-blue-500 text-white'
                        }
                      `}>
                        {isChamber ? (
                          <>
                            <Stethoscope size={10} />
                            Chamber
                          </>
                        ) : (
                          <>
                            <Briefcase size={10} />
                            Co-Working
                          </>
                        )}
                      </span>

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

                  <div className="p-5 flex flex-col flex-grow">
                    <div className="mb-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest mb-1 flex items-center gap-1.5">
                        <span className={isChamber ? 'text-emerald-600' : 'text-blue-600'}>
                          {isChamber ? 'Medical Chamber' : 'Co-Working Space'}
                        </span>
                        {isChamber && (
                          <span className="text-[8px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">
                            Doctor's Cabin
                          </span>
                        )}
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
                      {cabin.description || (isChamber 
                        ? "Professional medical chamber designed for consultations and patient care." 
                        : "Experience a premium workspace designed for focus and collaboration.")}
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
                          title="Delete Space"
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

      {/* ─── DETAIL POPUP ─── */}
      {showPopup && selectedCabin && (
        <div 
          className="fixed inset-0 z-[9999] flex items-start justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowPopup(false);
          }}
        >
          <div className="bg-white rounded-2xl max-w-3xl w-full mt-16 mb-8 shadow-2xl relative overflow-y-auto max-h-[85vh]">
            <button
              onClick={() => setShowPopup(false)}
              className="sticky top-4 right-4 z-10 float-right p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-lg border border-slate-200"
            >
              <X size={20} className="text-slate-600" />
            </button>

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
              
              <div className="absolute bottom-4 left-4 flex gap-2 pointer-events-none flex-wrap">
                <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5 ${
                  selectedCabin.isActive ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${selectedCabin.isActive ? 'bg-white animate-pulse' : 'bg-white/70'}`}></span>
                  {selectedCabin.isActive ? 'Active' : 'Inactive'}
                </span>
                {selectedCabin.isChamber && (
                  <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                    <Stethoscope size={14} />
                    Medical Chamber
                  </span>
                )}
                {!selectedCabin.isChamber && (
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                    <Briefcase size={14} />
                    Co-Working
                  </span>
                )}
                {selectedCabin.cabinType === 'exclusive' && (
                  <span className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                    <Crown size={14} />
                    Premium
                  </span>
                )}
              </div>
            </div>

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

            <div className="p-6 md:p-8 pt-4">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-1 flex items-center gap-1.5">
                    <span className={selectedCabin.isChamber ? 'text-emerald-600' : 'text-blue-600'}>
                      {selectedCabin.isChamber ? 'Medical Chamber' : 'Co-Working Space'}
                    </span>
                    {selectedCabin.isChamber && (
                      <span className="text-[8px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">
                        Doctor's Cabin
                      </span>
                    )}
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

              <div className="flex items-start gap-2 mb-4 p-3 bg-slate-50 rounded-xl">
                <MapPin size={16} className="text-indigo-600 mt-0.5 shrink-0" />
                <p className="text-sm text-slate-600">{selectedCabin.address}</p>
              </div>

              {selectedCabin.description && (
                <div className="mb-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {selectedCabin.description}
                  </p>
                </div>
              )}

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

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Type</p>
                  <p className="text-sm font-semibold text-slate-900 capitalize">
                    {selectedCabin.isChamber ? 'Medical Chamber' : 'Co-Working'}
                  </p>
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

      {/* ─── ADD SPACE MODAL (FIXED) ─── */}
      {isAddModalOpen && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsAddModalOpen(false);
            }
          }}
        >
          <div 
            className="bg-white w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 sm:p-5 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-white/20 flex items-center justify-center">
                  <Plus size={18} className="text-white sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white">Add New Space</h2>
                  <p className="text-[10px] sm:text-xs text-white/75">
                    {formData.isChamber ? 'Medical Chamber' : 'Co-Working Space'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-white/15 hover:bg-white/25 transition-colors flex items-center justify-center text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="overflow-y-auto p-4 sm:p-6 flex-1">
              <form onSubmit={handleAddSubmit} className="space-y-4">
                {/* ─── SPACE TYPE SELECTION ─── */}
                <div>
                  <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Space Type *</label>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-1">
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, isChamber: true})}
                      className={`py-2.5 sm:py-3 px-3 rounded-xl text-xs sm:text-sm font-semibold border-2 transition-all flex items-center justify-center gap-2 ${
                        formData.isChamber === true
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Stethoscope size={16} className={formData.isChamber ? 'text-emerald-500' : 'text-slate-400'} />
                      Medical Chamber
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, isChamber: false})}
                      className={`py-2.5 sm:py-3 px-3 rounded-xl text-xs sm:text-sm font-semibold border-2 transition-all flex items-center justify-center gap-2 ${
                        formData.isChamber === false
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Briefcase size={16} className={formData.isChamber === false ? 'text-blue-500' : 'text-slate-400'} />
                      Co-Working Space
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Building Name *</label>
                    <input
                      className="w-full mt-1 px-3 py-2.5 sm:py-3 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                      type="text" name="name"
                      placeholder="e.g. Tech Hub"
                      value={formData.name}
                      onChange={handleAddChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Address *</label>
                    <input
                      className="w-full mt-1 px-3 py-2.5 sm:py-3 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                      type="text" name="address"
                      placeholder="e.g. Bangalore, Karnataka"
                      value={formData.address}
                      onChange={handleAddChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 xs:grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Cabin Spec *</label>
                    <input
                      className="w-full mt-1 px-3 py-2.5 sm:py-3 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                      type="text" name="cabin"
                      placeholder="e.g. Office B"
                      value={formData.cabin}
                      onChange={handleAddChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Capacity *</label>
                    <input
                      className="w-full mt-1 px-3 py-2.5 sm:py-3 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                      type="number" name="capacity" min="1"
                      placeholder="10"
                      value={formData.capacity}
                      onChange={handleAddChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Price/hr *</label>
                    <input
                      className="w-full mt-1 px-3 py-2.5 sm:py-3 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                      type="number" name="price" min="0"
                      placeholder="25000"
                      value={formData.price}
                      onChange={handleAddChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Cabin Type</label>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-1">
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, cabinType: "normal"})}
                      className={`py-2.5 sm:py-3 px-3 rounded-xl text-xs sm:text-sm font-semibold border-2 transition-all ${
                        formData.cabinType === 'normal'
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Building2 size={14} className="inline mr-1.5" />
                      Normal
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, cabinType: "exclusive"})}
                      className={`py-2.5 sm:py-3 px-3 rounded-xl text-xs sm:text-sm font-semibold border-2 transition-all ${
                        formData.cabinType === 'exclusive'
                          ? 'border-amber-500 bg-amber-50 text-amber-600'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Crown size={14} className="inline mr-1.5 text-amber-500" />
                      Exclusive
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Amenities</label>
                  <div className="grid grid-cols-2 xs:grid-cols-3 gap-1.5 mt-1">
                    {ALL_AMENITIES.map(item => {
                      const isActive = formData.amenities[item.key] || false;
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => toggleAddAmenity(item.key)}
                          className={`flex items-center gap-1.5 p-2 rounded-lg text-[10px] sm:text-xs font-semibold border transition-all ${
                            isActive
                              ? 'border-indigo-500 bg-indigo-50 text-indigo-600'
                              : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <Icon size={14} className={isActive ? 'text-indigo-500' : 'text-gray-400'} />
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Pricing Plans</label>
                    <button
                      type="button"
                      onClick={addPlan}
                      className="text-[10px] sm:text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 sm:px-3 py-1 rounded-lg hover:bg-indigo-100 transition-colors"
                    >
                      + Add Plan
                    </button>
                  </div>
                  {pricingPlans.length > 0 ? (
                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-1.5">
                      {pricingPlans.map((plan, idx) => (
                        <div key={idx} className="p-2 bg-slate-50 rounded-lg text-[10px] sm:text-xs border border-slate-200 relative">
                          <div><strong>{plan.label || "Plan"}</strong></div>
                          <div>{plan.hours}h · ₹{plan.cost}</div>
                          <div className="text-slate-400">{plan.validity}d validity</div>
                          <button
                            type="button"
                            onClick={() => removePlan(idx)}
                            className="absolute top-1 right-1 text-red-500 hover:text-red-700 text-xs font-bold"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[10px] sm:text-xs text-slate-400">No plans defined. Hourly booking only.</p>
                  )}
                </div>

                <div>
                  <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Description</label>
                  <textarea
                    className="w-full mt-1 px-3 py-2.5 sm:py-3 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all resize-none"
                    name="description"
                    placeholder="Describe your space..."
                    value={formData.description}
                    onChange={handleAddChange}
                    rows={2}
                  />
                </div>

                <div>
                  <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Photos</label>
                  <div className="mt-1 border-2 border-dashed border-indigo-200 rounded-xl p-4 sm:p-6 text-center hover:border-indigo-400 transition-colors relative">
                    <input
                      type="file" multiple accept="image/*"
                      onChange={handleAddImageChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Upload size={20} className="mx-auto text-indigo-400 sm:w-6 sm:h-6" />
                    <p className="text-[10px] sm:text-xs text-slate-500 mt-1">Click to upload photos</p>
                    <p className="text-[8px] sm:text-[10px] text-slate-400">PNG, JPG, WEBP</p>
                  </div>
                  {images.length > 0 && (
                    <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 gap-2 mt-2">
                      {images.map((file, index) => (
                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200">
                          <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeAddImage(index)}
                            className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* ─── FORM ACTIONS ─── */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="py-2.5 sm:py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs sm:text-sm hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`py-2.5 sm:py-3 rounded-xl text-white font-bold text-xs sm:text-sm transition-all ${
                      submitting
                        ? 'bg-slate-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg'
                    }`}
                  >
                    {submitting ? 'Adding...' : 'Add Space'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSpaces;