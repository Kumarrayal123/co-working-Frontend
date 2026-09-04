// AdminSpaces.jsx - Polished UI matching Owner Dashboard design language
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
  Search,
  LayoutGrid,
  List,
  CheckCircle,
  RefreshCw,
  ExternalLink,
  Coffee as CoffeeIcon
} from "lucide-react";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import { toast } from "react-toastify";
import "./Dashboard.css";

const API_URL = "https://spaceapi.iryax.com";
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
  const navigate = useNavigate();
  const [cabins, setCabins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'table'
  const [searchTerm, setSearchTerm] = useState("");
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
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [editingPlanIndex, setEditingPlanIndex] = useState(null);
  const [planInput, setPlanInput] = useState({
    label: "",
    hours: "",
    cost: "",
    validity: ""
  });
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
    isCafe: false,
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

  const [errors, setErrors] = useState({
    name: "",
    address: "",
    cabin: "",
    description: "",
  });

  // Validation functions
  const validateField = (name, value) => {
    let error = "";
    
    switch (name) {
      case "name":
        if (!value) {
          error = "Building Name is required";
        } else if (value.length > 30) {
          error = "Building Name must be 30 characters or less";
        } else if (!/^[a-zA-Z0-9\s]+$/.test(value)) {
          error = "Building Name can only contain letters, digits, and spaces";
        }
        break;
      case "address":
        if (!value) {
          error = "Address is required";
        } else if (value.length > 50) {
          error = "Address must be 50 characters or less";
        } else if (!/^[a-zA-Z0-9\s,.-]+$/.test(value)) {
          error = "Address can only contain letters, digits, spaces, commas, dots, and hyphens";
        }
        break;
      case "cabin":
        if (!value) {
          error = "Cabin Spec is required";
        } else if (value.length > 15) {
          error = "Cabin Spec must be 15 characters or less";
        } else if (!/^[a-zA-Z0-9-]+$/.test(value)) {
          error = "Cabin Spec can only contain letters, digits, and hyphens";
        }
        break;
      case "description":
        if (value && (value.length < 150 || value.length > 200)) {
          error = "Description must be between 150 and 200 characters";
        }
        break;
      default:
        break;
    }
    
    return error;
  };

  // ─── FETCH CABINS ───
  const fetchCabins = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    try {
      const res = await axios.get(`${API_URL}/api/cabins`);
      setCabins(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load spaces:", err);
      toast.error("Failed to fetch spaces list");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCabins();
  }, []);

  // ─── DELETE ───
  const handleDelete = async (cabinId, cabinName = "Space") => {
    if (!window.confirm(`Are you sure you want to delete "${cabinName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/api/cabins/${cabinId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Space deleted successfully");
      setCabins(prev => prev.filter(c => c._id !== cabinId));
      if (selectedCabin && selectedCabin._id === cabinId) {
        setShowPopup(false);
      }
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
    if (selectedCabin && selectedCabin.images && selectedCabin.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === selectedCabin.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedCabin && selectedCabin.images && selectedCabin.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedCabin.images.length - 1 : prev - 1
      );
    }
  };

  // ─── STAT COUNTS ───
  const chamberCount = useMemo(() => cabins.filter(c => c.isChamber === true).length, [cabins]);
  const coworkingCount = useMemo(() => cabins.filter(c => c.isChamber !== true && c.isCafe !== true).length, [cabins]);
  const cafeCount = useMemo(() => cabins.filter(c => c.isCafe === true).length, [cabins]);
  const activeCount = useMemo(() => cabins.filter(c => c.isActive === true).length, [cabins]);
  const exclusiveCount = useMemo(() => cabins.filter(c => c.cabinType === 'exclusive').length, [cabins]);

  // ─── LOCATIONS LIST ───
  const locations = useMemo(() => {
    const locSet = new Set();
    cabins.forEach(c => {
      if (c.address) {
        const primary = c.address.split(',')[0]?.trim();
        if (primary) locSet.add(primary);
      }
    });
    return Array.from(locSet).sort();
  }, [cabins]);

  // ─── CLEAR FILTERS ───
  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setFilterLocation("");
    setFilterType("all");
    setFilterStatus("all");
  }, []);

  const isFilterActive = searchTerm || filterLocation || filterType !== "all" || filterStatus !== "all";

  // ─── TAB FILTERING ───
  const tabFilteredCabins = useMemo(() => {
    if (activeTab === "chambers") {
      return cabins.filter(c => c.isChamber === true);
    } else if (activeTab === "coworking") {
      return cabins.filter(c => c.isChamber !== true && c.isCafe !== true);
    } else if (activeTab === "cafe") {
      return cabins.filter(c => c.isCafe === true);
    }
    return cabins;
  }, [cabins, activeTab]);

  // ─── FINAL FILTERED CABINS ───
  const filteredCabins = useMemo(() => {
    return tabFilteredCabins.filter(cabin => {
      // Search term (name, address, spec)
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase().trim();
        const name = (cabin.name || "").toLowerCase();
        const addr = (cabin.address || "").toLowerCase();
        const spec = (cabin.cabin || "").toLowerCase();
        if (!name.includes(term) && !addr.includes(term) && !spec.includes(term)) {
          return false;
        }
      }

      // Location
      if (filterLocation && !cabin.address?.toLowerCase().includes(filterLocation.toLowerCase())) {
        return false;
      }

      // Cabin Type
      if (filterType !== "all" && cabin.cabinType !== filterType) {
        return false;
      }

      // Status
      if (filterStatus === "active" && cabin.isActive !== true) return false;
      if (filterStatus === "inactive" && cabin.isActive === true) return false;

      return true;
    });
  }, [tabFilteredCabins, searchTerm, filterLocation, filterType, filterStatus]);

  // ─── HELPERS ───
  const getImageUrl = (img) => {
    if (!img) return PLACEHOLDER_IMAGE;
    if (img.startsWith("http")) return img;
    const cleanPath = img.replace(/\\/g, "/").replace(/^\/+/, "");
    return `${API_URL}/${cleanPath}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
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

  // ─── ADD SPACE FORM HANDLERS ───
  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
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

  const openPlanModal = () => {
    setPlanInput({ label: "", hours: "", cost: "", validity: "" });
    setEditingPlanIndex(null);
    setShowPlanModal(true);
  };

  const openEditPlanModal = (index) => {
    const targetPlan = pricingPlans[index];
    if (targetPlan) {
      setPlanInput({
        label: targetPlan.label || "",
        hours: targetPlan.hours !== undefined ? targetPlan.hours.toString() : "",
        cost: targetPlan.cost !== undefined ? targetPlan.cost.toString() : "",
        validity: targetPlan.validity !== undefined ? targetPlan.validity.toString() : ""
      });
      setEditingPlanIndex(index);
      setShowPlanModal(true);
    }
  };

  const savePlanModal = () => {
    if (!planInput.hours || Number(planInput.hours) <= 0) {
      toast.error("Please enter valid included hours");
      return;
    }
    if (!planInput.cost || Number(planInput.cost) <= 0) {
      toast.error("Please enter valid cost (₹)");
      return;
    }
    if (!planInput.validity || Number(planInput.validity) <= 0) {
      toast.error("Please enter valid validity days");
      return;
    }

    const newPlan = {
      label: planInput.label.trim() || `${planInput.hours} Hours Plan`,
      hours: Number(planInput.hours),
      cost: Number(planInput.cost),
      validity: Number(planInput.validity)
    };

    if (editingPlanIndex !== null) {
      setPricingPlans(prev => prev.map((p, i) => (i === editingPlanIndex ? newPlan : p)));
    } else {
      setPricingPlans(prev => [...prev, newPlan]);
    }

    setShowPlanModal(false);
    setPlanInput({ label: "", hours: "", cost: "", validity: "" });
    setEditingPlanIndex(null);
  };

  const removePlan = (index) => {
    setPricingPlans(pricingPlans.filter((_, i) => i !== index));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    
    const nameError = validateField("name", formData.name);
    const addressError = validateField("address", formData.address);
    const cabinError = validateField("cabin", formData.cabin);
    const descriptionError = validateField("description", formData.description);
    
    const newErrors = {
      name: nameError,
      address: addressError,
      cabin: cabinError,
      description: descriptionError,
    };
    
    setErrors(newErrors);
    
    if (nameError || addressError || cabinError || descriptionError) {
      toast.error("Please fix the validation errors before submitting");
      return;
    }
    
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
    data.append("isCafe", formData.isCafe);
    data.append("pricingPlans", JSON.stringify(pricingPlans));
    data.append("amenities", JSON.stringify(formData.amenities));
    images.forEach((img) => data.append("images", img));

    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_URL}/api/cabins`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      let typeLabel = 'Co-Working Space';
      if (formData.isChamber) typeLabel = 'Medical Chamber';
      else if (formData.isCafe) typeLabel = 'Cafe';
      
      toast.success(`${typeLabel} added successfully!`);
      setIsAddModalOpen(false);
      
      setFormData({
        name: "",
        description: "",
        capacity: "",
        address: "",
        price: "",
        cabin: "",
        cabinType: "normal",
        isChamber: false,
        isCafe: false,
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
      fetchCabins(true);
    } catch (err) {
      console.error("Add Space Error:", err);
      toast.error("Failed to add space");
    } finally {
      setSubmitting(false);
    }
  };

  // ─── 6 KPI STAT CARDS (Added Cafe) ───
  const statsCards = [
    {
      label: "Total Spaces",
      value: cabins.length,
      meta: "all listed properties",
      icon: Home,
      color: "indigo",
      tab: "all",
      onClick: () => {
        setActiveTab("all");
        clearFilters();
      }
    },
    {
      label: "Medical Chambers",
      value: chamberCount,
      meta: "doctor consultation cabins",
      icon: Stethoscope,
      color: "emerald",
      tab: "chambers",
      onClick: () => {
        setActiveTab("chambers");
        clearFilters();
      }
    },
    {
      label: "Co-Working Spaces",
      value: coworkingCount,
      meta: "shared & private desks",
      icon: Briefcase,
      color: "blue",
      tab: "coworking",
      onClick: () => {
        setActiveTab("coworking");
        clearFilters();
      }
    },
    {
      label: "Cafes",
      value: cafeCount,
      meta: "coffee & dining spaces",
      icon: CoffeeIcon,
      color: "amber",
      tab: "cafe",
      onClick: () => {
        setActiveTab("cafe");
        clearFilters();
      }
    },
    {
      label: "Active Spaces",
      value: activeCount,
      meta: "live & bookable",
      icon: CheckCircle,
      color: "cyan",
      onClick: () => {
        setFilterStatus(prev => prev === "active" ? "all" : "active");
      }
    },
    {
      label: "Exclusive Spaces",
      value: exclusiveCount,
      meta: "premium cabins",
      icon: Crown,
      color: "purple",
      onClick: () => {
        setFilterType(prev => prev === "exclusive" ? "all" : "exclusive");
      }
    }
  ];

  const currentDateFormatted = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric"
  });

  if (loading) {
    return (
      <div className="admin-dash">
        <AdminNavbar />
        <div className="admin-dash__loading">
          <div className="admin-dash__spinner" />
          <p className="admin-dash__loading-text">Loading workspace spaces...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dash">
      <AdminNavbar />

      <main className="pt-20 px-3 sm:px-4 md:px-6 lg:px-8 max-w-full mx-auto pb-16">
        {/* Header - Matching Owner Dashboard reference */}
        <div className="admin-dash__header">
          <div>
            <h1 className="admin-dash__greeting">
              All <span>Spaces</span>
            </h1>
            <p className="admin-dash__subtitle">
              Manage and monitor medical chambers, co-working workspaces & cafes across all locations
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-2.5">
            <div className="admin-dash__date-pill">
              <Calendar size={14} />
              <span>{currentDateFormatted}</span>
            </div>

            <button
              onClick={() => fetchCabins(true)}
              className="admin-dash__btn hover:border-indigo-300"
              title="Refresh spaces"
              disabled={refreshing}
            >
              <RefreshCw size={14} className={refreshing ? "animate-spin text-indigo-600" : "text-gray-500"} />
              <span className="text-xs font-medium">{refreshing ? "Refreshing..." : "Refresh"}</span>
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 bg-[length:200%_100%] text-white hover:bg-[position:100%_0] transition-all duration-500 shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-300 transform hover:scale-105 active:scale-95"
            >
              <Plus size={14} /> Add Space
            </button>
          </div>
        </div>

        {/* 6 KPI Stat Summary Cards (Added Cafe) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-6">
          {statsCards.map((stat, index) => (
            <div
              key={index}
              className={`admin-dash__stat cursor-pointer hover:scale-105 transition-transform duration-200 ${
                activeTab === stat.tab ? 'ring-2 ring-indigo-500/80 shadow-md' : ''
              }`}
              onClick={stat.onClick}
              title="Click to filter by this category"
            >
              <div className="admin-dash__stat-top">
                <span className="admin-dash__stat-label">{stat.label}</span>
                <div className={`admin-dash__stat-icon admin-dash__stat-icon--${stat.color}`}>
                  <stat.icon size={15} />
                </div>
              </div>
              <div className="admin-dash__stat-value">{stat.value}</div>
              <div className="admin-dash__stat-meta">{stat.meta}</div>
            </div>
          ))}
        </div>

        {/* Tab Navigation and View Mode Bar */}
        <div className="bg-white rounded-2xl border border-gray-200 p-2 sm:p-2.5 mb-5 shadow-sm flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center flex-wrap gap-1.5 sm:gap-2">
            <button
              onClick={() => {
                setActiveTab("all");
                clearFilters();
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === "all"
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-200'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Building2 size={14} />
              <span>All Spaces</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                activeTab === "all" ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-700'
              }`}>
                {cabins.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab("chambers");
                clearFilters();
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === "chambers"
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-200'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Stethoscope size={14} />
              <span>Medical Chambers</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                activeTab === "chambers" ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-700'
              }`}>
                {chamberCount}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab("coworking");
                clearFilters();
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === "coworking"
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-200'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Briefcase size={14} />
              <span>Co-Working</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                activeTab === "coworking" ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-700'
              }`}>
                {coworkingCount}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab("cafe");
                clearFilters();
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === "cafe"
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md shadow-amber-200'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <CoffeeIcon size={14} />
              <span>Cafes</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                activeTab === "cafe" ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-700'
              }`}>
                {cafeCount}
              </span>
            </button>
          </div>

          {/* View Toggle (Grid vs Table) */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === "grid"
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
              title="Grid View"
            >
              <LayoutGrid size={15} />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === "table"
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
              title="Table View"
            >
              <List size={15} />
              <span className="hidden sm:inline">Table</span>
            </button>
          </div>
        </div>

        {/* Enhanced Filters Bar */}
        <div className="admin-dash__filters mb-6">
          <div className="admin-dash__filter-group">
            {/* Search Box */}
            <div className="flex-1 min-w-[220px] relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by space name, spec, address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="admin-dash__filter-input w-full pl-9"
              />
            </div>

            {/* Location Filter */}
            <select
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="admin-dash__filter-select min-w-[140px]"
            >
              <option value="">All Locations</option>
              {locations.map((loc, idx) => (
                <option key={idx} value={loc}>{loc}</option>
              ))}
            </select>

            {/* Cabin Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="admin-dash__filter-select min-w-[130px]"
            >
              <option value="all">All Types</option>
              <option value="normal">Normal</option>
              <option value="exclusive">Exclusive</option>
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="admin-dash__filter-select min-w-[130px]"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>

            {/* Clear All */}
            {isFilterActive && (
              <button
                onClick={clearFilters}
                className="admin-dash__btn hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                title="Clear all filters"
              >
                <XCircle size={15} /> Clear
              </button>
            )}
          </div>

          {/* Active Filter Tags */}
          <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
            <div className="flex items-center flex-wrap gap-1.5">
              <span>Showing <strong>{filteredCabins.length}</strong> of {tabFilteredCabins.length} spaces</span>
              {filterLocation && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-semibold border border-indigo-200">
                  Location: {filterLocation}
                  <button onClick={() => setFilterLocation("")} className="hover:text-indigo-900">×</button>
                </span>
              )}
              {filterType !== "all" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-semibold border border-indigo-200">
                  Type: {filterType}
                  <button onClick={() => setFilterType("all")} className="hover:text-indigo-900">×</button>
                </span>
              )}
              {filterStatus !== "all" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-semibold border border-indigo-200">
                  Status: {filterStatus}
                  <button onClick={() => setFilterStatus("all")} className="hover:text-indigo-900">×</button>
                </span>
              )}
            </div>

            {isFilterActive && (
              <span className="text-indigo-600 font-semibold">• Filters Active</span>
            )}
          </div>
        </div>

        {/* Main Spaces List */}
        {filteredCabins.length === 0 ? (
          <div className="admin-dash__card p-12 text-center flex flex-col items-center justify-center gap-3">
            <div className="p-4 bg-gray-100 rounded-2xl text-gray-400">
              {activeTab === "chambers" ? (
                <Stethoscope size={40} />
              ) : activeTab === "coworking" ? (
                <Briefcase size={40} />
              ) : activeTab === "cafe" ? (
                <CoffeeIcon size={40} />
              ) : (
                <Building2 size={40} />
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-800">No spaces found</h3>
              <p className="text-xs text-gray-400 mt-1">
                {isFilterActive ? "Try clearing your filters or changing search query" : "Get started by adding your first space"}
              </p>
            </div>
            {isFilterActive ? (
              <button
                onClick={clearFilters}
                className="mt-2 admin-dash__btn"
              >
                Clear Filters
              </button>
            ) : (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="mt-2 admin-dash__btn admin-dash__btn--primary"
              >
                <Plus size={14} /> Add First Space
              </button>
            )}
          </div>
        ) : viewMode === "grid" ? (
          /* ─── GRID VIEW ─── */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredCabins.map((cabin) => {
              const isActive = cabin.isActive === true;
              const isExclusive = cabin.cabinType === 'exclusive';
              const isNew = new Date(cabin.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
              const isChamber = cabin.isChamber === true;
              const isCafe = cabin.isCafe === true;

              let typeLabel = 'Co-Working';
              let typeIcon = Briefcase;
              let typeColor = 'bg-blue-600/90';
              if (isChamber) {
                typeLabel = 'Chamber';
                typeIcon = Stethoscope;
                typeColor = 'bg-emerald-600/90';
              } else if (isCafe) {
                typeLabel = 'Cafe';
                typeIcon = CoffeeIcon;
                typeColor = 'bg-amber-600/90';
              }
              const TypeIcon = typeIcon;

              return (
                <div
                  key={cabin._id}
                  onClick={() => handleViewDetails(cabin)}
                  className="admin-dash__card group flex flex-col h-full hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-200 hover:border-indigo-300"
                >
                  {/* Image Container */}
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <img
                      src={cabin.images?.[0] ? getImageUrl(cabin.images[0]) : PLACEHOLDER_IMAGE}
                      alt={cabin.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950/70 via-gray-900/20 to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 items-end">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold shadow-md flex items-center gap-1 backdrop-blur-md ${typeColor} text-white`}>
                        <TypeIcon size={10} />
                        {typeLabel}
                      </span>

                      {isExclusive && (
                        <span className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-2.5 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-1 shadow-md">
                          <Crown size={10} /> Exclusive
                        </span>
                      )}

                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold shadow-md flex items-center gap-1.5 ${
                        isActive ? 'bg-emerald-500 text-white' : 'bg-gray-600 text-white'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white animate-pulse' : 'bg-gray-300'}`}></span>
                        {isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    {isNew && (
                      <div className="absolute top-3 left-3 z-10">
                        <span className="bg-indigo-600 text-white px-2.5 py-0.5 rounded-full text-[9px] font-bold shadow-md flex items-center gap-1">
                          <Sparkles size={10} /> New
                        </span>
                      </div>
                    )}

                    {/* Quick Capacity on Image Bottom */}
                    <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 text-white/90 text-[11px] font-medium drop-shadow">
                      <Users size={12} />
                      <span>{cabin.capacity || 1} Seats</span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 sm:p-5 flex flex-col flex-1">
                    <div className="mb-2.5">
                      <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${
                        isChamber ? 'text-emerald-600' : isCafe ? 'text-amber-600' : 'text-indigo-600'
                      }`}>
                        {isChamber ? 'Medical Chamber' : isCafe ? 'Cafe' : 'Workspace'}
                      </p>
                      <h3 className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1 leading-snug">
                        {cabin.name}
                      </h3>
                    </div>

                    {/* Address */}
                    <div className="flex items-start gap-1.5 text-xs text-gray-500 mb-3">
                      <MapPin size={13} className="text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-1">{cabin.address || "No address provided"}</span>
                    </div>

                    {/* Description preview */}
                    <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed mb-4">
                      {cabin.description || (isChamber
                        ? "Specialized clinical chamber equipped for medical consultations."
                        : isCafe
                        ? "Cozy cafe with premium coffee and comfortable seating."
                        : "Premium co-working desk space with modern amenities and high-speed Wi-Fi.")}
                    </p>

                    {/* Amenities Preview Icons */}
                    {cabin.amenities && (
                      <div className="flex items-center gap-1 mb-4 flex-wrap">
                        {Object.entries(cabin.amenities)
                          .filter(([_, val]) => val === true)
                          .slice(0, 4)
                          .map(([key]) => {
                            const item = amenityIcons[key];
                            if (!item) return null;
                            const Icon = item.icon;
                            return (
                              <span
                                key={key}
                                className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center text-gray-600 text-xs"
                                title={item.label}
                              >
                                <Icon size={12} />
                              </span>
                            );
                          })}
                        {Object.values(cabin.amenities).filter(v => v === true).length > 4 && (
                          <span className="text-[10px] font-semibold text-gray-400 px-1">
                            +{Object.values(cabin.amenities).filter(v => v === true).length - 4} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Card Footer: Price + Action Buttons */}
                    <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                      <div>
                        <div className="flex items-baseline gap-0.5">
                          <span className="text-base sm:text-lg font-bold text-gray-900">₹{cabin.price || '0'}</span>
                          <span className="text-[10px] text-gray-400 font-bold uppercase">/hr</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleViewDetails(cabin)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all duration-200"
                          title="Quick View"
                        >
                          <Eye size={12} /> Details
                        </button>
                        <button
                          onClick={() => handleDelete(cabin._id, cabin.name)}
                          className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors"
                          title="Delete Space"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* ─── TABLE VIEW ─── */
          <div className="admin-dash__card overflow-hidden">
            <div className="admin-dash__card-body p-0 overflow-x-auto">
              <table className="admin-dash__table">
                <thead>
                  <tr>
                    <th className="w-14 text-center">#</th>
                    <th>Space / Cabin</th>
                    <th>Type</th>
                    <th>Location / Address</th>
                    <th>Capacity</th>
                    <th>Hourly Rate</th>
                    <th>Status</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCabins.map((cabin, idx) => {
                    const isChamber = cabin.isChamber === true;
                    const isCafe = cabin.isCafe === true;
                    const isActive = cabin.isActive === true;
                    const isExclusive = cabin.cabinType === 'exclusive';

                    let typeLabel = 'Co-Working';
                    let typeIcon = Briefcase;
                    let typeColor = 'bg-blue-50 text-blue-700 border-blue-200';
                    if (isChamber) {
                      typeLabel = 'Medical Chamber';
                      typeIcon = Stethoscope;
                      typeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                    } else if (isCafe) {
                      typeLabel = 'Cafe';
                      typeIcon = CoffeeIcon;
                      typeColor = 'bg-amber-50 text-amber-700 border-amber-200';
                    }
                    const TypeIcon = typeIcon;

                    return (
                      <tr
                        key={cabin._id}
                        className="group cursor-pointer hover:bg-indigo-50/40 transition-colors"
                        onClick={() => handleViewDetails(cabin)}
                      >
                        <td className="text-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-xs font-bold text-gray-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                            {idx + 1}
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-11 h-11 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shadow-sm">
                              <img
                                src={cabin.images?.[0] ? getImageUrl(cabin.images[0]) : PLACEHOLDER_IMAGE}
                                alt={cabin.name}
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }}
                              />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 text-xs sm:text-sm group-hover:text-indigo-600 transition-colors">
                                {cabin.name}
                              </p>
                              <p className="text-[11px] text-gray-400">{cabin.cabin || "Space"}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-lg border ${typeColor}`}>
                            <TypeIcon size={10} />
                            {typeLabel}
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center gap-1.5 text-xs text-gray-600">
                            <MapPin size={12} className="text-gray-400 flex-shrink-0" />
                            <span className="truncate max-w-[200px]">{cabin.address || "—"}</span>
                          </div>
                        </td>
                        <td>
                          <span className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                            <Users size={12} className="text-gray-400" />
                            {cabin.capacity || 1} Seats
                          </span>
                        </td>
                        <td>
                          <div className="flex items-baseline gap-0.5">
                            <span className="text-sm font-bold text-gray-900">₹{cabin.price || 0}</span>
                            <span className="text-[10px] text-gray-400">/hr</span>
                          </div>
                        </td>
                        <td>
                          <div className="flex flex-col gap-1 items-start">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold rounded-lg ${
                              isActive
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-gray-100 text-gray-600 border border-gray-200'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-gray-400'}`}></span>
                              {isActive ? 'Active' : 'Inactive'}
                            </span>
                            {isExclusive && (
                              <span className="text-[9px] font-bold text-amber-600 flex items-center gap-0.5">
                                <Crown size={9} /> Exclusive
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="text-center" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleViewDetails(cabin)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all"
                              title="View Details"
                            >
                              <Eye size={12} /> View
                            </button>
                            <button
                              onClick={() => handleDelete(cabin._id, cabin.name)}
                              className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors"
                              title="Delete Space"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* ─── DETAIL POPUP (POLISHED) ─── */}
      {showPopup && selectedCabin && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowPopup(false);
          }}
        >
          <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl relative overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Close Button Floating */}
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 z-20 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-md transition-colors"
            >
              <X size={18} />
            </button>

            {/* Modal Hero Image Carousel */}
            <div className="relative h-72 sm:h-80 bg-slate-900 flex-shrink-0">
              <img
                src={selectedCabin.images && selectedCabin.images.length > 0 
                  ? getImageUrl(selectedCabin.images[currentImageIndex]) 
                  : PLACEHOLDER_IMAGE}
                alt={selectedCabin.name}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

              {/* Prev / Next Controls */}
              {selectedCabin.images && selectedCabin.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/70 text-white rounded-full transition-colors backdrop-blur-sm"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/70 text-white rounded-full transition-colors backdrop-blur-sm"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              {/* Floating Hero Badges */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-2 flex-wrap pointer-events-none">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1.5 ${
                    selectedCabin.isActive ? 'bg-emerald-500 text-white' : 'bg-gray-600 text-white'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${selectedCabin.isActive ? 'bg-white animate-pulse' : 'bg-gray-300'}`}></span>
                    {selectedCabin.isActive ? 'Active' : 'Inactive'}
                  </span>

                  <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1.5 ${
                    selectedCabin.isChamber ? 'bg-emerald-600 text-white' : 
                    selectedCabin.isCafe ? 'bg-amber-600 text-white' : 
                    'bg-blue-600 text-white'
                  }`}>
                    {selectedCabin.isChamber ? <Stethoscope size={13} /> : 
                     selectedCabin.isCafe ? <CoffeeIcon size={13} /> : 
                     <Briefcase size={13} />}
                    {selectedCabin.isChamber ? 'Medical Chamber' : 
                     selectedCabin.isCafe ? 'Cafe' : 
                     'Co-Working Space'}
                  </span>

                  {selectedCabin.cabinType === 'exclusive' && (
                    <span className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md">
                      <Crown size={13} /> Premium Exclusive
                    </span>
                  )}
                </div>

                <div className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-bold text-gray-900 shadow">
                  ₹{selectedCabin.price || '0'} <span className="text-[10px] text-gray-500 font-normal">/hr</span>
                </div>
              </div>
            </div>

            {/* Thumbnail Strip */}
            {selectedCabin.images && selectedCabin.images.length > 1 && (
              <div className="px-5 py-2.5 bg-gray-50 border-b border-gray-100 flex gap-2 overflow-x-auto">
                {selectedCabin.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-14 h-11 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                      idx === currentImageIndex ? 'border-indigo-600 ring-2 ring-indigo-200' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{selectedCabin.name}</h2>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                  <MapPin size={13} className="text-indigo-600 flex-shrink-0" />
                  <span>{selectedCabin.address || "Address not provided"}</span>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Capacity</p>
                  <p className="text-sm font-bold text-gray-800">{selectedCabin.capacity} Seats</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Rate</p>
                  <p className="text-sm font-bold text-indigo-600">₹{selectedCabin.price}/hr</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Type</p>
                  <p className="text-sm font-bold text-gray-800 capitalize">{selectedCabin.cabinType || 'Normal'}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Listed</p>
                  <p className="text-sm font-bold text-gray-800">{formatDate(selectedCabin.createdAt)}</p>
                </div>
              </div>

              {/* Description */}
              {selectedCabin.description && (
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Description</h4>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                    {selectedCabin.description}
                  </p>
                </div>
              )}

              {/* Amenities */}
              {selectedCabin.amenities && Object.values(selectedCabin.amenities).some(v => v === true) && (
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Available Amenities</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(selectedCabin.amenities).map(([key, value]) => {
                      const amenity = amenityIcons[key];
                      if (!amenity || !value) return null;
                      const Icon = amenity.icon;
                      return (
                        <span key={key} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg text-xs font-semibold text-gray-700 border border-gray-100">
                          <Icon size={14} className="text-indigo-600" />
                          {amenity.label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Pricing Plans */}
              {selectedCabin.pricingPlans && selectedCabin.pricingPlans.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Pricing Plans</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedCabin.pricingPlans.map((plan, i) => (
                      <div key={i} className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-gray-800 text-xs">{plan.label || "Plan"}</p>
                          <p className="text-[11px] text-gray-500">{plan.hours} Hours · {plan.validity} Days Validity</p>
                        </div>
                        <span className="text-sm font-bold text-indigo-600">₹{plan.cost}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="p-4 sm:p-5 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-2.5 flex-wrap">
              <button
                onClick={() => navigate(`/cabin/${selectedCabin._id}`)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm"
              >
                <ExternalLink size={14} /> Open Public Page
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDelete(selectedCabin._id, selectedCabin.name)}
                  className="px-3.5 py-2.5 rounded-xl text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex items-center gap-1.5"
                >
                  <Trash2 size={14} /> Delete
                </button>
                <button
                  onClick={() => setShowPopup(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white text-gray-700 border border-gray-200 hover:bg-gray-100 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── ADD SPACE MODAL ─── */}
      {isAddModalOpen && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAddModalOpen(false);
          }}
        >
          <div 
            className="bg-white w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 p-4 sm:p-5 flex items-center justify-between flex-shrink-0 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <Plus size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white">Add New Workspace</h2>
                  <p className="text-xs text-white/80">
                    Register a new space - Chamber, Co-Working or Cafe
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

            <div className="overflow-y-auto p-4 sm:p-6 flex-1 space-y-4">
              <form onSubmit={handleAddSubmit} className="space-y-4">
                {/* Space Type Picker - 3 Options */}
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Space Category *</label>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-1.5">
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, isChamber: false, isCafe: false})}
                      className={`py-2.5 sm:py-3 px-3 rounded-xl text-xs sm:text-sm font-bold border-2 transition-all flex items-center justify-center gap-2 ${
                        formData.isChamber === false && formData.isCafe === false
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Briefcase size={16} className={formData.isChamber === false && formData.isCafe === false ? 'text-indigo-600' : 'text-gray-400'} />
                      Co-Working
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, isChamber: true, isCafe: false})}
                      className={`py-2.5 sm:py-3 px-3 rounded-xl text-xs sm:text-sm font-bold border-2 transition-all flex items-center justify-center gap-2 ${
                        formData.isChamber === true
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-700 shadow-sm'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Stethoscope size={16} className={formData.isChamber ? 'text-emerald-600' : 'text-gray-400'} />
                      Chamber
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, isChamber: false, isCafe: true})}
                      className={`py-2.5 sm:py-3 px-3 rounded-xl text-xs sm:text-sm font-bold border-2 transition-all flex items-center justify-center gap-2 ${
                        formData.isCafe === true
                          ? 'border-amber-600 bg-amber-50 text-amber-700 shadow-sm'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <CoffeeIcon size={16} className={formData.isCafe ? 'text-amber-600' : 'text-gray-400'} />
                      Cafe
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Building Name *</label>
                    <input
                      className={`w-full mt-1 px-3 py-2.5 border rounded-xl text-sm outline-none transition-all ${
                        errors.name ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
                      }`}
                      type="text" 
                      name="name"
                      placeholder="e.g. Prestige Tech Park"
                      value={formData.name}
                      onChange={handleAddChange}
                      required
                    />
                    {errors.name && <p className="text-[10px] text-red-500 mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Address *</label>
                    <input
                      className={`w-full mt-1 px-3 py-2.5 border rounded-xl text-sm outline-none transition-all ${
                        errors.address ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
                      }`}
                      type="text" 
                      name="address"
                      placeholder="e.g. Marathahalli, Bangalore, Karnataka"
                      value={formData.address}
                      onChange={handleAddChange}
                      required
                    />
                    {errors.address && <p className="text-[10px] text-red-500 mt-1">{errors.address}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Cabin Spec *</label>
                    <input
                      className={`w-full mt-1 px-3 py-2.5 border rounded-xl text-sm outline-none transition-all ${
                        errors.cabin ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
                      }`}
                      type="text" 
                      name="cabin"
                      placeholder="e.g. Suite-204"
                      value={formData.cabin}
                      onChange={handleAddChange}
                      required
                    />
                    {errors.cabin && <p className="text-[10px] text-red-500 mt-1">{errors.cabin}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Capacity (Seats) *</label>
                    <input
                      className="w-full mt-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                      type="number" 
                      name="capacity" 
                      min="1"
                      placeholder="10"
                      value={formData.capacity}
                      onChange={handleAddChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Price / hr (₹) *</label>
                    <input
                      className="w-full mt-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                      type="number" 
                      name="price" 
                      min="0"
                      placeholder="500"
                      value={formData.price}
                      onChange={handleAddChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Cabin Tier</label>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-1.5">
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, cabinType: "normal"})}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold border-2 transition-all ${
                        formData.cabinType === 'normal'
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Building2 size={14} className="inline mr-1.5" />
                      Normal Space
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, cabinType: "exclusive"})}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold border-2 transition-all ${
                        formData.cabinType === 'exclusive'
                          ? 'border-amber-500 bg-amber-50 text-amber-700'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Crown size={14} className="inline mr-1.5 text-amber-500" />
                      Exclusive Tier
                    </button>
                  </div>
                </div>

                {/* Amenities Selection */}
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Amenities</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1.5">
                    {ALL_AMENITIES.map(item => {
                      const isActive = formData.amenities[item.key] || false;
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => toggleAddAmenity(item.key)}
                          className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold border transition-all ${
                            isActive
                              ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm'
                              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <Icon size={14} className={isActive ? 'text-indigo-600' : 'text-gray-400'} />
                          <span className="truncate">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Pricing Plans */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Pricing Plans ({pricingPlans.length})
                    </label>
                    <button
                      type="button"
                      onClick={openPlanModal}
                      className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg hover:bg-indigo-100 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Plus size={12} /> Add Custom Plan
                    </button>
                  </div>
                  {pricingPlans.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {pricingPlans.map((plan, idx) => (
                        <div key={idx} className="p-3 bg-gray-50 rounded-xl text-xs border border-gray-200 relative group flex justify-between items-center">
                          <div>
                            <div className="font-bold text-gray-800">{plan.label || "Plan"}</div>
                            <div className="text-indigo-600 font-bold">{plan.hours}h · ₹{plan.cost}</div>
                            <div className="text-[10px] text-gray-400">{plan.validity} days validity</div>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => openEditPlanModal(idx)}
                              className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs hover:bg-indigo-200"
                            >
                              ✎
                            </button>
                            <button
                              type="button"
                              onClick={() => removePlan(idx)}
                              className="w-6 h-6 rounded-lg bg-red-100 text-red-600 flex items-center justify-center text-xs hover:bg-red-200"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-3 text-center">
                      <p className="text-xs text-gray-400">No custom packages added. Standard hourly rate applies.</p>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Description</label>
                  <textarea
                    className={`w-full mt-1 px-3 py-2.5 border rounded-xl text-sm outline-none transition-all resize-none ${
                      errors.description ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
                    }`}
                    name="description"
                    placeholder="Describe the workspace (150-200 characters)..."
                    value={formData.description}
                    onChange={handleAddChange}
                    rows={2}
                  />
                  {errors.description && <p className="text-[10px] text-red-500 mt-1">{errors.description}</p>}
                  {!errors.description && formData.description && (
                    <p className="text-[10px] text-gray-400 mt-1">{formData.description.length}/200 characters</p>
                  )}
                </div>

                {/* Photos Dropzone */}
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Workspace Photos</label>
                  <div className="mt-1 border-2 border-dashed border-indigo-200 rounded-xl p-5 text-center hover:border-indigo-400 transition-colors relative bg-indigo-50/20">
                    <input
                      type="file" multiple accept="image/*"
                      onChange={handleAddImageChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Upload size={24} className="mx-auto text-indigo-500" />
                    <p className="text-xs font-semibold text-gray-700 mt-1.5">Click or drag images to upload</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">PNG, JPG, WEBP formats</p>
                  </div>
                  {images.length > 0 && (
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mt-2.5">
                      {images.map((file, index) => (
                        <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                          <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeAddImage(index)}
                            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Modal Submit Actions */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold text-xs sm:text-sm hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`py-2.5 rounded-xl text-white font-bold text-xs sm:text-sm transition-all shadow-md ${
                      submitting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:shadow-lg'
                    }`}
                  >
                    {submitting ? 'Creating Space...' : 'Create Space'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ─── ADD/EDIT PRICING PLAN MODAL ─── */}
      {showPlanModal && (
        <div className="fixed inset-0 z-[10500] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-gray-900">
                  {editingPlanIndex !== null ? 'Edit Pricing Plan' : 'Add Pricing Plan'}
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setShowPlanModal(false);
                    setPlanInput({ label: '', hours: '', cost: '', validity: '' });
                    setEditingPlanIndex(null);
                  }}
                  className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center text-gray-600"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Plan Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Weekly Pass, 50h Pack"
                    value={planInput.label}
                    onChange={(e) => setPlanInput({ ...planInput, label: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                    autoFocus
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Hours *</label>
                    <input
                      type="number"
                      min="1"
                      placeholder="40"
                      value={planInput.hours}
                      onChange={(e) => setPlanInput({ ...planInput, hours: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Cost (₹) *</label>
                    <input
                      type="number"
                      min="1"
                      placeholder="4500"
                      value={planInput.cost}
                      onChange={(e) => setPlanInput({ ...planInput, cost: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Validity (Days) *</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="30"
                    value={planInput.validity}
                    onChange={(e) => setPlanInput({ ...planInput, validity: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPlanModal(false);
                      setPlanInput({ label: '', hours: '', cost: '', validity: '' });
                      setEditingPlanIndex(null);
                    }}
                    className="py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold text-xs hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={savePlanModal}
                    className="py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 shadow-sm"
                  >
                    {editingPlanIndex !== null ? 'Update' : 'Add'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSpaces;