// MyCafes.jsx - Complete My Cafe & Dining Tables Management
import axios from "axios";
import {
  UtensilsCrossed,
  Coffee,
  Building2,
  CheckCircle,
  FileText,
  Home,
  IndianRupee,
  MapPin,
  Plus,
  Search,
  Trash2,
  Upload,
  Users,
  X,
  Calendar,
  Clock,
  Eye,
  Edit,
  Filter,
  XCircle as XCircleIcon,
  Crown,
  Timer,
  Pencil,
  Wifi,
  ParkingCircle,
  Lock,
  Bath,
  Shield,
  Armchair,
  Tv,
  Printer,
  Phone,
  Grid as GridIcon,
  List as ListIcon,
  CreditCard,
  Loader2,
  Receipt,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Images,
  Sparkles,
  Music,
  Wine,
  Wind,
  Sun,
  Moon,
  Check,
  XCircle
} from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CafeNavbar from "./CafeNavbar";
import "./Dashboard.css";

const API_URL = import.meta.env.VITE_API_URL || "https://spaceapi.iryax.com";
const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=1000";

// Load Razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// ─── AMENITIES LIST FOR CAFES & DINING ───
const CAFE_AMENITIES = [
  { key: "wifi", label: "High-Speed Wi-Fi", icon: Wifi },
  { key: "ac", label: "Air Conditioning", icon: Wind },
  { key: "parking", label: "Valet / Parking", icon: ParkingCircle },
  { key: "comfortSeating", label: "Plush Seating / Booth", icon: Armchair },
  { key: "coffee", label: "Artisan Coffee & Bar", icon: Coffee },
  { key: "privateWashroom", label: "Private Restroom", icon: Bath },
  { key: "music", label: "Acoustic Ambient Music", icon: Music },
  { key: "tv", label: "Display Screen / TV", icon: Tv },
  { key: "secureAccess", label: "Reserved / VIP Access", icon: Shield },
  { key: "phone", label: "Power & Charging Ports", icon: ZapIcon },
  { key: "wine", label: "Bar & Cocktails", icon: Wine },
  { key: "lockers", label: "Coat & Bag Storage", icon: Lock },
];

function ZapIcon(props) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

// ─── MAIN MY CAFES & TABLES COMPONENT ───
const MyCafes = () => {
  const [cabins, setCabins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [cabinCount, setCabinCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedCabin, setSelectedCabin] = useState(null);
  const [editingCabin, setEditingCabin] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [countdowns, setCountdowns] = useState({});
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    exclusive: 0,
    normal: 0,
    withExpiry: 0
  });

  // Address popup tooltip
  const [addressPopup, setAddressPopup] = useState({
    show: false,
    address: "",
    x: 0,
    y: 0
  });

  const navigate = useNavigate();

  // ─── FORM STATE FOR ADD TABLE ───
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    tableNumber: "",
    capacity: "4",
    price: "200",
    cabinType: "normal",
    description: "",
    openTime: "08:00",
    closeTime: "23:00",
    is24x7: false,
    isCafe: true,
    isChamber: false,
    amenities: {
      wifi: true,
      ac: true,
      parking: false,
      comfortSeating: true,
      coffee: true,
      privateWashroom: false,
      music: true,
      tv: false,
      secureAccess: false,
      phone: true,
      wine: false,
      lockers: false,
    }
  });

  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [pricingPlans, setPricingPlans] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState({
    name: "",
    address: "",
    tableNumber: "",
    capacity: "",
    price: "",
    description: ""
  });

  // Manual Pricing Plan modal state
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [editingPlanIndex, setEditingPlanIndex] = useState(null);
  const [planInput, setPlanInput] = useState({
    label: "",
    hours: "",
    cost: "",
    validity: ""
  });

  // ─── EDIT FORM STATE ───
  const [editFormData, setEditFormData] = useState({
    name: "",
    address: "",
    tableNumber: "",
    capacity: "",
    price: "",
    cabinType: "normal",
    description: "",
    openTime: "08:00",
    closeTime: "23:00",
    is24x7: false,
    isActive: true,
    isCafe: true,
    isChamber: false,
    amenities: {}
  });
  const [editImages, setEditImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [editPricingPlans, setEditPricingPlans] = useState([]);

  // ─── FILTERS ───
  const [filters, setFilters] = useState({
    search: "",
    tableType: "all",
    status: "all",
    priceMin: "",
    priceMax: "",
    address: ""
  });

  // ─── VALIDATION ───
  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "name":
        if (!value.trim()) error = "Cafe Name is required";
        else if (value.length > 50) error = "Cafe Name must be 50 characters or less";
        break;
      case "address":
        if (!value.trim()) error = "Address is required";
        else if (value.length > 100) error = "Address must be 100 characters or less";
        break;
      case "tableNumber":
        if (!value.trim()) error = "Table Number is required (e.g. Table #1, Booth A)";
        else if (value.length > 25) error = "Table Number must be 25 characters or less";
        break;
      case "capacity":
        if (!value || Number(value) < 1) error = "Seats must be at least 1";
        break;
      case "price":
        if (value === "" || Number(value) < 0) error = "Price must be 0 or more";
        break;
      default:
        break;
    }
    return error;
  };

  // ─── EFFECTS ───
  useEffect(() => {
    loadRazorpayScript().then((loaded) => {
      setRazorpayLoaded(loaded);
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdowns((prev) => {
        const updated = { ...prev };
        let hasChanges = false;
        Object.keys(updated).forEach((key) => {
          if (updated[key] > 0) {
            updated[key] = updated[key] - 1;
            hasChanges = true;
          }
        });
        return hasChanges ? updated : prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getImageUrl = (img) => {
    if (!img) return PLACEHOLDER_IMAGE;
    if (img.startsWith("http") || img.startsWith("blob:")) return img;
    const cleanPath = img.replace(/\\/g, "/").replace(/^\/+/, "");
    return `${API_URL}/${cleanPath}`;
  };

  const getAllImageUrls = (item) => {
    if (!item.images || item.images.length === 0) {
      return [PLACEHOLDER_IMAGE];
    }
    return item.images.map((img) => getImageUrl(img));
  };

  // ─── GET USER ID ───
  const getUserId = () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const id = payload.id || payload.userId || payload._id;
        if (id) return id;
      }
    } catch (e) {
      console.warn("JWT parse failed:", e);
    }

    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const u = JSON.parse(userStr);
        if (u._id || u.id) return u._id || u.id;
      }
    } catch (e) { console.error(e); }

    try {
      const adminStr = localStorage.getItem("admin");
      if (adminStr) {
        const a = JSON.parse(adminStr);
        if (a._id || a.id) return a._id || a.id;
      }
    } catch (e) { console.error(e); }

    return null;
  };

  const getToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to manage your cafe tables");
      return null;
    }
    return token;
  };

  // ─── FETCH CAFE TABLES ───
  const fetchCabins = async () => {
    setLoading(true);
    try {
      const userId = getUserId();

      if (!userId) {
        setCabins([]);
        setCabinCount(0);
        setLoading(false);
        return;
      }

      const res = await axios.get(`${API_URL}/api/cabins/my-cafes/${userId}`);

      if (res.data.success) {
        const cabinData = res.data.cabins || [];
        setCabins(cabinData);
        setCabinCount(res.data.count || 0);
        
        if (res.data.stats) {
          setStats(res.data.stats);
        }

        const initialCountdowns = {};
        cabinData.forEach((c) => {
          if (c.expiryDate) {
            const expiry = new Date(c.expiryDate);
            const now = new Date();
            const diff = Math.max(0, Math.floor((expiry - now) / 1000));
            initialCountdowns[c._id] = diff;
          }
        });
        setCountdowns(initialCountdowns);
      } else {
        toast.error(res.data.error || "Failed to load tables");
      }
    } catch (err) {
      console.error("Error fetching cafe tables:", err);
      toast.error(err.response?.data?.error || "Could not load tables. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCabins();
  }, []);

  // ─── FILTERING ───
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearAllFilters = () => {
    setFilters({
      search: "",
      tableType: "all",
      status: "all",
      priceMin: "",
      priceMax: "",
      address: ""
    });
  };

  const filteredCabins = cabins.filter((c) => {
    const tableName = `${c.name || ''} ${c.tableNumber || ''} ${c.cabin || ''}`.toLowerCase();
    if (filters.search && !tableName.includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.tableType !== "all" && c.cabinType !== filters.tableType) {
      return false;
    }
    if (filters.status !== "all") {
      if (filters.status === "active" && c.isActive !== true) return false;
      if (filters.status === "inactive" && c.isActive !== false) return false;
    }
    if (filters.priceMin && (c.price || 0) < Number(filters.priceMin)) return false;
    if (filters.priceMax && (c.price || 0) > Number(filters.priceMax)) return false;
    if (filters.address && !c.address?.toLowerCase().includes(filters.address.toLowerCase())) {
      return false;
    }
    return true;
  });

  const activeCount = stats.active || cabins.filter((c) => c.isActive === true).length;
  const inactiveCount = stats.inactive || cabins.filter((c) => c.isActive === false).length;
  const exclusiveCount = stats.exclusive || cabins.filter((c) => c.cabinType === "exclusive").length;
  const normalCount = stats.normal || cabins.filter((c) => c.cabinType === "normal" || !c.cabinType).length;

  // ─── HANDLERS FOR ADD TABLE ───
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const toggleAmenity = (key) => {
    setFormData((prev) => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [key]: !prev.amenities[key],
      },
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // Plan helpers
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
        validity: targetPlan.validity !== undefined ? targetPlan.validity.toString() : "",
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
      label: planInput.label.trim() || `${planInput.hours} Hours Dining Plan`,
      hours: Number(planInput.hours),
      cost: Number(planInput.cost),
      validity: Number(planInput.validity),
    };

    if (editingPlanIndex !== null) {
      setPricingPlans((prev) => prev.map((p, i) => (i === editingPlanIndex ? newPlan : p)));
    } else {
      setPricingPlans((prev) => [...prev, newPlan]);
    }

    setShowPlanModal(false);
    setPlanInput({ label: "", hours: "", cost: "", validity: "" });
    setEditingPlanIndex(null);
  };

  const removePlan = (index) => {
    setPricingPlans(pricingPlans.filter((_, i) => i !== index));
  };

  // ─── SUBMIT NEW TABLE ───
  const handleAddTableSubmit = (e) => {
    e.preventDefault();

    const nameErr = validateField("name", formData.name);
    const addressErr = validateField("address", formData.address);
    const tableErr = validateField("tableNumber", formData.tableNumber);
    const capErr = validateField("capacity", formData.capacity);
    const priceErr = validateField("price", formData.price);

    const newErrors = {
      name: nameErr,
      address: addressErr,
      tableNumber: tableErr,
      capacity: capErr,
      price: priceErr,
      description: "",
    };

    setErrors(newErrors);

    if (nameErr || addressErr || tableErr || capErr || priceErr) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    setShowConfirmModal(true);
  };

  // ─── EXECUTE CREATION ───
  const createTableAndOrder = async () => {
    setSubmitting(true);
    try {
      const token = getToken();
      if (!token) {
        setSubmitting(false);
        return;
      }

      const tableData = new FormData();
      const fullName = formData.tableNumber
        ? `${formData.name} - ${formData.tableNumber}`
        : formData.name;

      tableData.append("name", fullName);
      tableData.append("cabin", formData.tableNumber);
      tableData.append("tableNumber", formData.tableNumber);
      tableData.append("description", formData.description || `Table seating for ${formData.capacity} guests at ${formData.name}`);
      tableData.append("capacity", formData.capacity);
      tableData.append("address", formData.address);
      tableData.append("price", formData.price);
      tableData.append("cabinType", formData.cabinType);
      tableData.append("isCafe", "true");
      tableData.append("isChamber", "false");
      tableData.append("openTime", formData.openTime);
      tableData.append("closeTime", formData.closeTime);
      tableData.append("is24x7", formData.is24x7);
      tableData.append("pricingPlans", JSON.stringify(pricingPlans));
      tableData.append("amenities", JSON.stringify(formData.amenities));

      const seatCount = parseInt(formData.capacity) || 4;
      const seatsArr = [];
      for (let i = 1; i <= seatCount; i++) {
        seatsArr.push({ name: `Seat ${i}`, number: i });
      }
      tableData.append("seats", JSON.stringify(seatsArr));

      images.forEach((img) => tableData.append("images", img));

      const res = await axios.post(`${API_URL}/api/cabins`, tableData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success || res.data.cabin) {
        toast.success(`🎉 Table "${formData.tableNumber}" at ${formData.name} created successfully!`);
        setFormData({
          name: "",
          address: "",
          tableNumber: "",
          capacity: "4",
          price: "200",
          cabinType: "normal",
          description: "",
          openTime: "08:00",
          closeTime: "23:00",
          is24x7: false,
          isCafe: true,
          isChamber: false,
          amenities: {
            wifi: true,
            ac: true,
            parking: false,
            comfortSeating: true,
            coffee: true,
            privateWashroom: false,
            music: true,
            tv: false,
            secureAccess: false,
            phone: true,
            wine: false,
            lockers: false,
          }
        });
        setImages([]);
        setPricingPlans([]);
        setShowConfirmModal(false);
        setIsModalOpen(false);
        await fetchCabins();
      }
    } catch (err) {
      console.error("Create Table Error:", err);
      const errMsg = err.response?.data?.message || err.response?.data?.error || "Failed to add table";
      toast.error(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  // ─── EDIT TABLE ───
  const openEditModal = (cabin) => {
    setEditingCabin(cabin);
    setEditFormData({
      name: cabin.name?.includes(" - ") ? cabin.name.split(" - ")[0] : cabin.name || "",
      address: cabin.address || "",
      tableNumber: cabin.tableNumber || cabin.cabin || "Table",
      capacity: cabin.capacity || "4",
      price: cabin.price || "200",
      cabinType: cabin.cabinType || "normal",
      description: cabin.description || "",
      openTime: cabin.openTime || "08:00",
      closeTime: cabin.closeTime || "23:00",
      is24x7: cabin.is24x7 || false,
      isActive: cabin.isActive !== false,
      isCafe: true,
      isChamber: false,
      amenities: cabin.amenities || {}
    });
    setExistingImages(cabin.images || []);
    setEditPricingPlans(cabin.pricingPlans || []);
    setEditImages([]);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = getToken();
      if (!token) {
        setSubmitting(false);
        return;
      }

      const updateData = new FormData();
      const fullName = editFormData.tableNumber
        ? `${editFormData.name} - ${editFormData.tableNumber}`
        : editFormData.name;

      updateData.append("name", fullName);
      updateData.append("cabin", editFormData.tableNumber);
      updateData.append("tableNumber", editFormData.tableNumber);
      updateData.append("description", editFormData.description);
      updateData.append("capacity", editFormData.capacity);
      updateData.append("address", editFormData.address);
      updateData.append("price", editFormData.price);
      updateData.append("cabinType", editFormData.cabinType);
      updateData.append("isCafe", "true");
      updateData.append("isChamber", "false");
      updateData.append("isActive", editFormData.isActive);
      updateData.append("openTime", editFormData.openTime);
      updateData.append("closeTime", editFormData.closeTime);
      updateData.append("is24x7", editFormData.is24x7);
      updateData.append("pricingPlans", JSON.stringify(editPricingPlans));
      updateData.append("amenities", JSON.stringify(editFormData.amenities));

      existingImages.forEach((img) => {
        if (typeof img === 'string') {
          updateData.append("existingImages", img);
        }
      });

      editImages.forEach((img) => updateData.append("images", img));

      await axios.put(`${API_URL}/api/cabins/${editingCabin._id}`, updateData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Table updated successfully!");
      setIsEditModalOpen(false);
      setEditingCabin(null);
      fetchCabins();
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Failed to update table details");
    } finally {
      setSubmitting(false);
    }
  };

  // ─── DELETE TABLE ───
  const handleDelete = async (e, id, tableName) => {
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to delete "${tableName || 'this table'}"?`)) return;

    try {
      const token = getToken();
      await axios.delete(`${API_URL}/api/cabins/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCabins((prev) => prev.filter((c) => c._id !== id));
      setCabinCount((prev) => prev - 1);
      toast.success("Table deleted successfully");
      fetchCabins();
    } catch (error) {
      console.error("Error deleting table", error);
      toast.error("Failed to delete table");
    }
  };

  // ─── VIEW DETAILS MODAL ───
  const openViewModal = (cabin) => {
    setSelectedCabin(cabin);
    setIsViewModalOpen(true);
  };

  const handleAddressClick = (e, address) => {
    const rect = e.target.getBoundingClientRect();
    setAddressPopup({
      show: true,
      address: address || "No address specified",
      x: rect.left,
      y: rect.bottom + 8,
    });
  };

  // ─── RENDER ───
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7]">
        <CafeNavbar />
        <div className="flex flex-col items-center justify-center h-[70vh] gap-3">
          <Loader2 size={42} className="text-amber-600 animate-spin" />
          <p className="text-sm font-semibold text-slate-600">Loading your cafe tables...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]" style={{ fontFamily: "Inter, sans-serif" }}>
      <CafeNavbar />

      <div className="pt-24 px-3 sm:px-4 md:px-6 lg:px-8 max-w-full mx-auto pb-20">
        {/* ─── PAGE HEADER ─── */}
        <div className="admin-dash__header mb-4 flex items-center justify-between">
          <div>
            <h1 className="admin-dash__greeting">
              My <span>Cafe Tables</span>
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Manage all your cafe & dining table listings
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/cafebookings")}
              className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors"
            >
              <FileText size={14} className="text-amber-600" />
              <span>Bookings</span>
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-amber-600 text-white rounded-lg text-xs font-medium hover:bg-amber-700 transition shadow-sm shadow-amber-200"
            >
              <Plus size={14} />
              <span>Add Table</span>
            </button>
          </div>
        </div>

        {/* ─── STATS CARDS - Same as MyCabins ─── */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-sm" style={{ minHeight: '85px' }}>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Tables</p>
            <p className="text-xl font-black text-slate-900 mt-1">{stats.total || cabins.length}</p>
            <p className="text-[9px] text-slate-400 mt-0.5">all listings</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-sm" style={{ minHeight: '85px' }}>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Active</p>
            <p className="text-xl font-black text-emerald-600 mt-1">{stats.active || activeCount}</p>
            <p className="text-[9px] text-slate-400 mt-0.5">available for diners</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-sm" style={{ minHeight: '85px' }}>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Inactive</p>
            <p className="text-xl font-black text-gray-600 mt-1">{stats.inactive || inactiveCount}</p>
            <p className="text-[9px] text-slate-400 mt-0.5">paused / maintenance</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-sm" style={{ minHeight: '85px' }}>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">VIP / Exclusive</p>
            <p className="text-xl font-black text-amber-600 mt-1">{stats.exclusive || exclusiveCount}</p>
            <p className="text-[9px] text-slate-400 mt-0.5">private dining</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-sm" style={{ minHeight: '85px' }}>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Standard</p>
            <p className="text-xl font-black text-blue-600 mt-1">{stats.normal || normalCount}</p>
            <p className="text-[9px] text-slate-400 mt-0.5">regular tables</p>
          </div>
        </div>

        {/* ─── MAIN CARD CONTAINER ─── */}
        <div className="admin-dash__card" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}>
          {/* Card Top Bar */}
          <div className="admin-dash__card-header flex flex-wrap items-center justify-between gap-2 p-3" style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb' }}>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-gray-700">Registered Tables & Cafes</h3>
              <span className="px-2 py-0.5 text-[9px] font-bold text-amber-700 bg-amber-100 rounded-full">
                {filteredCabins.length}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <input
                type="text"
                placeholder="Search..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="w-20 sm:w-28 px-2 py-1 text-[10px] border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
              <select
                value={filters.tableType}
                onChange={(e) => handleFilterChange("tableType", e.target.value)}
                className="text-[10px] bg-white border border-gray-200 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-amber-500/20 font-medium text-gray-700"
              >
                <option value="all">All Types</option>
                <option value="normal">Standard</option>
                <option value="exclusive">VIP</option>
              </select>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="text-[10px] bg-white border border-gray-200 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-amber-500/20 font-medium text-gray-700"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <input
                type="text"
                placeholder="City..."
                value={filters.address}
                onChange={(e) => handleFilterChange("address", e.target.value)}
                className="w-16 sm:w-24 px-2 py-1 text-[10px] border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
              {(filters.search || filters.tableType !== "all" || filters.status !== "all" || filters.address) && (
                <button
                  onClick={clearAllFilters}
                  className="flex items-center gap-0.5 px-2 py-1 text-[9px] font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <XCircle size={12} />
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* ─── TABLE VIEW ─── */}
          <div className="admin-dash__card-body p-0 overflow-x-auto" style={{ backgroundColor: '#ffffff' }}>
            {filteredCabins.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 mb-3">
                  <UtensilsCrossed size={32} />
                </div>
                <h4 className="text-base font-bold text-slate-800">No Cafe Tables Found</h4>
                <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4">
                  You haven't added any tables yet or no tables match your current filters.
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow transition-all"
                >
                  <Plus size={15} />
                  <span>Add Your First Table</span>
                </button>
              </div>
            ) : (
              <table className="w-full min-w-[1100px] text-left">
                <thead>
                  <tr className="border-b border-gray-100" style={{ backgroundColor: '#f9fafb' }}>
                    <th className="p-2.5 text-[8px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">S.No</th>
                    <th className="p-2.5 text-[8px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Cafe & Table</th>
                    <th className="p-2.5 text-[8px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Address</th>
                    <th className="p-2.5 text-[8px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Type</th>
                    <th className="p-2.5 text-[8px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Seats</th>
                    <th className="p-2.5 text-[8px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Price/Hr</th>
                    <th className="p-2.5 text-[8px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Timings</th>
                    <th className="p-2.5 text-[8px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Status</th>
                    <th className="p-2.5 text-[8px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Expiry</th>
                    <th className="p-2.5 text-[8px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredCabins.map((cabin, idx) => {
                    const isExclusive = cabin.cabinType === "exclusive";
                    const cabinImages = getAllImageUrls(cabin);
                    const cafeName = cabin.name?.includes(" - ") ? cabin.name.split(" - ")[0] : cabin.name || "Cafe";
                    const tableNum = cabin.tableNumber || cabin.cabin || "Table";
                    const countdown = countdowns[cabin._id] || 0;
                    const hasExpiry = cabin.expiryDate ? true : false;
                    const isExpired = cabin.expiryDate && new Date(cabin.expiryDate) < new Date();

                    return (
                      <tr key={cabin._id} className="hover:bg-amber-50/30 transition-colors group">
                        <td className="p-2.5">
                          <span className="text-[10px] font-semibold text-gray-400">{idx + 1}</span>
                        </td>
                        <td className="p-2.5">
                          <div className="flex items-center gap-2">
                            <div className="flex-shrink-0 w-8 h-8 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                              <img
                                src={cabinImages[0]}
                                alt={cafeName}
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }}
                              />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 text-xs">{cafeName}</p>
                              <p className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md inline-block mt-0.5">
                                {tableNum}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-2.5">
                          <button
                            onClick={(e) => handleAddressClick(e, cabin.address)}
                            className="text-[10px] font-medium text-gray-700 flex items-center gap-1 hover:text-amber-700 transition-colors cursor-pointer max-w-[140px]"
                          >
                            <MapPin size={10} className="text-gray-400 flex-shrink-0" />
                            <span className="truncate">{cabin.address?.split(",")[0] || "N/A"}</span>
                          </button>
                        </td>
                        <td className="p-2.5">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-bold ${
                            isExclusive ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {isExclusive ? <><Crown size={8} /> VIP</> : 'Standard'}
                          </span>
                        </td>
                        <td className="p-2.5">
                          <span className="flex items-center gap-1 text-xs font-medium text-gray-700">
                            <Users size={12} className="text-amber-500" />
                            {cabin.capacity || 4}
                          </span>
                        </td>
                        <td className="p-2.5">
                          <span className="text-xs font-bold text-amber-600">₹{cabin.price || 0}</span>
                          <span className="text-[8px] text-gray-400 ml-0.5">/hr</span>
                        </td>
                        <td className="p-2.5">
                          {cabin.is24x7 ? (
                            <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-[8px] font-medium flex items-center gap-1 w-fit">
                              <Clock size={9} /> 24×7
                            </span>
                          ) : (
                            <div className="flex flex-col gap-0.5 text-[8px]">
                              <span className="flex items-center gap-0.5 text-gray-600">
                                <Sun size={8} className="text-amber-500" />
                                {cabin.openTime || "08:00"}
                              </span>
                              <span className="flex items-center gap-0.5 text-gray-600">
                                <Moon size={8} className="text-indigo-500" />
                                {cabin.closeTime || "23:00"}
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="p-2.5">
                          <span className={`px-2 py-0.5 text-[8px] font-bold rounded-full ${
                            cabin.isActive !== false ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {cabin.isActive !== false ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="p-2.5">
                          {hasExpiry ? (
                            <div className="flex flex-col gap-0.5">
                              <span className="text-[9px] text-gray-600">{new Date(cabin.expiryDate).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })}</span>
                              {countdown > 0 && (
                                <span className={`text-[8px] font-mono font-medium flex items-center gap-0.5 ${countdown < 86400 ? 'text-orange-500' : countdown < 172800 ? 'text-yellow-500' : 'text-emerald-600'}`}>
                                  <Timer size={8} />
                                  {countdown > 86400 ? `${Math.floor(countdown / 86400)}d ${Math.floor((countdown % 86400) / 3600)}h` : `${Math.floor(countdown / 3600)}h ${Math.floor((countdown % 3600) / 60)}m`}
                                </span>
                              )}
                              {isExpired && <span className="text-[8px] text-red-500 font-medium">🔴 Expired</span>}
                            </div>
                          ) : (
                            <span className="text-[9px] text-gray-400">No expiry</span>
                          )}
                        </td>
                        <td className="p-2.5">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => openViewModal(cabin)}
                              className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                              title="View"
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              onClick={() => openEditModal(cabin)}
                              className="p-1.5 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors"
                              title="Edit"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={(e) => handleDelete(e, cabin._id, cabin.name)}
                              className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Footer */}
          {!loading && filteredCabins.length > 0 && (
            <div className="px-3 py-2 border-t border-gray-100 rounded-b-2xl flex flex-wrap items-center justify-between gap-2" style={{ backgroundColor: '#fafafa' }}>
              <span className="text-[9px] text-gray-500">
                Showing <strong>{filteredCabins.length}</strong> of <strong>{cabins.length}</strong> tables
              </span>
              <div className="flex items-center gap-2 text-[9px] text-gray-500">
                <span className="flex items-center gap-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Active: {activeCount}
                </span>
                <span className="flex items-center gap-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                  Inactive: {inactiveCount}
                </span>
                <span className="flex items-center gap-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  VIP: {exclusiveCount}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── FLOATING ADDRESS POPUP ─── */}
      {addressPopup.show && (
        <div
          className="fixed z-[1200] bg-white rounded-xl shadow-2xl border border-slate-200 p-4 max-w-xs animate-in fade-in zoom-in-95 duration-150"
          style={{
            left: Math.min(addressPopup.x, window.innerWidth - 320),
            top: Math.min(addressPopup.y, window.innerHeight - 150),
            transform: "translateX(-50%)",
          }}
          onMouseLeave={() => setAddressPopup({ show: false, address: "", x: 0, y: 0 })}
        >
          <div className="flex items-start gap-2">
            <MapPin size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-slate-700 leading-relaxed font-medium">{addressPopup.address}</p>
          </div>
          <button onClick={() => setAddressPopup({ show: false, address: "", x: 0, y: 0 })} className="absolute top-1.5 right-1.5 p-1 rounded-full hover:bg-slate-100 text-slate-400">
            <X size={12} />
          </button>
        </div>
      )}

      {/* ─── VIEW DETAILS MODAL ─── */}
      {isViewModalOpen && selectedCabin && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm" onClick={() => setIsViewModalOpen(false)}>
          <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="relative h-56 bg-slate-900">
              <img src={getAllImageUrls(selectedCabin)[0]} alt={selectedCabin.name} className="w-full h-full object-cover opacity-90" />
              <button onClick={() => setIsViewModalOpen(false)} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80">
                <X size={18} />
              </button>
              <div className="absolute bottom-3 left-4 text-white">
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${selectedCabin.cabinType === "exclusive" ? "bg-amber-600" : "bg-blue-600"}`}>
                  {selectedCabin.cabinType === "exclusive" ? "VIP Booth" : "Standard Table"}
                </span>
                <h3 className="text-xl font-bold mt-1">{selectedCabin.name}</h3>
              </div>
            </div>

            <div className="p-5 overflow-y-auto space-y-4">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100">
                  <p className="text-[10px] text-amber-800 font-bold uppercase">Rate</p>
                  <p className="text-lg font-black text-amber-900">₹{selectedCabin.price || 0}/hr</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Capacity</p>
                  <p className="text-lg font-black text-slate-800">{selectedCabin.capacity || 4} Seats</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Timings</p>
                  <p className="text-sm font-bold text-slate-800 mt-1">
                    {selectedCabin.is24x7 ? "24x7" : `${selectedCabin.openTime || "08:00"} - ${selectedCabin.closeTime || "23:00"}`}
                  </p>
                </div>
              </div>

              <div>
                <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Table Number</h5>
                <p className="text-sm font-bold text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                  {selectedCabin.tableNumber || selectedCabin.cabin || "N/A"}
                </p>
              </div>

              <div>
                <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Address</h5>
                <p className="text-xs text-slate-600 flex items-center gap-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <MapPin size={14} className="text-amber-600 flex-shrink-0" />
                  {selectedCabin.address}
                </p>
              </div>

              {selectedCabin.description && (
                <div>
                  <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Description</h5>
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {selectedCabin.description}
                  </p>
                </div>
              )}

              {/* ─── SEATS SECTION ─── */}
              {selectedCabin.seats && selectedCabin.seats.length > 0 && (
                <div>
                  <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-2">
                    <Users size={14} className="text-amber-600" />
                    Seats Configuration ({selectedCabin.seats.length})
                  </h5>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {selectedCabin.seats.map((seat, idx) => (
                      <div key={idx} className="p-2 bg-slate-50 rounded-lg border border-slate-200 text-center">
                        <p className="font-bold text-slate-800 text-sm">{seat.name}</p>
                        <p className="text-[10px] text-slate-400">Seat #{seat.number}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ─── AMENITIES ─── */}
              {selectedCabin.amenities && Object.keys(selectedCabin.amenities).filter(k => selectedCabin.amenities[k]).length > 0 && (
                <div>
                  <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Amenities</h5>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.keys(selectedCabin.amenities).filter(k => selectedCabin.amenities[k]).map((key) => {
                      const amenity = CAFE_AMENITIES.find(a => a.key === key);
                      return amenity ? (
                        <span key={key} className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-800 text-[10px] rounded-full border border-amber-200">
                          <amenity.icon size={12} />
                          {amenity.label}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              )}

              {/* ─── PRICING PLANS ─── */}
              {selectedCabin.pricingPlans && selectedCabin.pricingPlans.length > 0 && (
                <div>
                  <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Dining Packages</h5>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedCabin.pricingPlans.map((plan, idx) => (
                      <div key={idx} className="p-2 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                        <p className="font-bold text-slate-800">{plan.label || 'Plan'}</p>
                        <p className="text-amber-700 font-semibold">{plan.hours}h · ₹{plan.cost}</p>
                        <p className="text-[10px] text-slate-400">{plan.validity} days validity</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ─── EXPIRY ─── */}
              {selectedCabin.expiryDate && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Expiry Date</h5>
                  <p className="text-sm font-medium text-slate-800 mt-0.5 flex items-center gap-2">
                    {new Date(selectedCabin.expiryDate).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })}
                    {new Date(selectedCabin.expiryDate) < new Date() ? (
                      <span className="px-2 py-0.5 text-[8px] font-bold bg-red-100 text-red-700 rounded-full">Expired</span>
                    ) : (
                      <span className="px-2 py-0.5 text-[8px] font-bold bg-emerald-100 text-emerald-700 rounded-full">Valid</span>
                    )}
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setIsViewModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200">
                  Close
                </button>
                <button onClick={() => { setIsViewModalOpen(false); openEditModal(selectedCabin); }} className="px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 flex items-center gap-1.5">
                  <Edit size={14} /> Edit Table
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── ADD TABLE MODAL ─── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1100] flex items-end sm:items-center justify-center p-2 sm:p-4 bg-slate-900/50 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}>
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200" style={{ maxHeight: "95vh" }}>
            <div className="bg-gradient-to-r from-amber-600 to-amber-700 p-4 sm:p-5 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-white/20 flex items-center justify-center">
                  <UtensilsCrossed size={18} className="text-white sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white">Add Cafe Table</h2>
                  <p className="text-[10px] sm:text-xs text-white/75">List a new dining table with seating, location, and photos</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-xl bg-white/15 hover:bg-white/25 transition-colors flex items-center justify-center text-white">
                <X size={18} />
              </button>
            </div>

            <div className="overflow-y-auto p-4 sm:p-6 flex-1">
              <form onSubmit={handleAddTableSubmit} className="space-y-4 sm:space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Cafe / Restaurant Name *</label>
                    <input
                      type="text" name="name"
                      placeholder="e.g. The Roastery Coffee House"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full mt-1 px-3 py-2.5 sm:py-3 border rounded-xl text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all ${errors.name ? 'border-red-500 focus:border-red-500' : 'border-slate-200'}`}
                      required
                    />
                    {errors.name && <p className="text-[10px] text-red-500 mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Address / Location *</label>
                    <input
                      type="text" name="address"
                      placeholder="e.g. 100 Feet Rd, Indiranagar, Bangalore"
                      value={formData.address}
                      onChange={handleChange}
                      className={`w-full mt-1 px-3 py-2.5 sm:py-3 border rounded-xl text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all ${errors.address ? 'border-red-500 focus:border-red-500' : 'border-slate-200'}`}
                      required
                    />
                    {errors.address && <p className="text-[10px] text-red-500 mt-1">{errors.address}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 xs:grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Table Number *</label>
                    <input
                      type="text" name="tableNumber"
                      placeholder="e.g. Table #4, Booth B-2"
                      value={formData.tableNumber}
                      onChange={handleChange}
                      className={`w-full mt-1 px-3 py-2.5 sm:py-3 border rounded-xl text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all ${errors.tableNumber ? 'border-red-500 focus:border-red-500' : 'border-slate-200'}`}
                      required
                    />
                    {errors.tableNumber && <p className="text-[10px] text-red-500 mt-1">{errors.tableNumber}</p>}
                  </div>
                  <div>
                    <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Seats / Capacity *</label>
                    <input
                      type="number" name="capacity" min="1"
                      placeholder="4"
                      value={formData.capacity}
                      onChange={handleChange}
                      className="w-full mt-1 px-3 py-2.5 sm:py-3 border border-slate-200 rounded-xl text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Price / Hour (₹) *</label>
                    <input
                      type="number" name="price" min="0"
                      placeholder="200"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full mt-1 px-3 py-2.5 sm:py-3 border border-slate-200 rounded-xl text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Table Type</label>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-1">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, cabinType: "normal" })}
                      className={`py-2.5 sm:py-3 px-3 rounded-xl text-xs sm:text-sm font-semibold border-2 transition-all flex items-center justify-center gap-2 ${formData.cabinType === "normal" ? "border-amber-600 bg-amber-50 text-amber-800" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                    >
                      <Coffee size={15} /> Standard Table
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, cabinType: "exclusive" })}
                      className={`py-2.5 sm:py-3 px-3 rounded-xl text-xs sm:text-sm font-semibold border-2 transition-all flex items-center justify-center gap-2 ${formData.cabinType === "exclusive" ? "border-amber-600 bg-amber-50 text-amber-800" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                    >
                      <Crown size={15} className="text-amber-600" /> VIP / Private Booth
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Open Time</label>
                    <input
                      type="time" name="openTime"
                      value={formData.openTime}
                      onChange={handleChange}
                      disabled={formData.is24x7}
                      className="w-full mt-1 px-3 py-2.5 sm:py-3 border border-slate-200 rounded-xl text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Close Time</label>
                    <input
                      type="time" name="closeTime"
                      value={formData.closeTime}
                      onChange={handleChange}
                      disabled={formData.is24x7}
                      className="w-full mt-1 px-3 py-2.5 sm:py-3 border border-slate-200 rounded-xl text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                    />
                  </div>
                  <div className="flex items-center sm:pt-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox" name="is24x7"
                        checked={formData.is24x7}
                        onChange={handleChange}
                        className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300"
                      />
                      <span className="text-xs font-semibold text-slate-700">Open 24x7</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Amenities & Facilities</label>
                  <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-1.5 sm:gap-2 mt-1">
                    {CAFE_AMENITIES.map((item) => {
                      const isActive = formData.amenities[item.key] || false;
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => toggleAmenity(item.key)}
                          className={`flex items-center gap-1.5 p-2 sm:p-2.5 rounded-lg text-[10px] sm:text-xs font-semibold border transition-all ${isActive ? "border-amber-600 bg-amber-50/80 text-amber-900" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                        >
                          <Icon size={14} className={isActive ? "text-amber-600" : "text-slate-400"} />
                          <span className="truncate">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Dining Packages ({pricingPlans.length})</label>
                    <button
                      type="button"
                      onClick={openPlanModal}
                      className="text-[10px] sm:text-xs font-bold text-amber-700 bg-amber-50 px-2.5 sm:px-3 py-1 rounded-lg hover:bg-amber-100 transition-colors flex items-center gap-1 border border-amber-200"
                    >
                      <Plus size={12} /> Add Plan
                    </button>
                  </div>
                  {pricingPlans.length > 0 ? (
                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-2">
                      {pricingPlans.map((plan, idx) => (
                        <div key={idx} className="p-2.5 bg-slate-50 rounded-xl text-xs border border-slate-200 flex justify-between items-center">
                          <div>
                            <div className="font-bold text-slate-900">{plan.label || "Plan"}</div>
                            <div className="text-amber-700 font-semibold">{plan.hours}h · ₹{plan.cost}</div>
                            <div className="text-[10px] text-slate-400">{plan.validity} days</div>
                          </div>
                          <div className="flex items-center gap-1">
                            <button type="button" onClick={() => openEditPlanModal(idx)} className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-xs hover:bg-amber-200">✎</button>
                            <button type="button" onClick={() => removePlan(idx)} className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs hover:bg-red-200">×</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-3 text-center bg-slate-50/50">
                      <p className="text-xs text-slate-400">Optional: Add multi-hour dining packages</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Table & Cafe Photos</label>
                  <div className="mt-1 border-2 border-dashed border-amber-200 hover:border-amber-400 bg-amber-50/30 rounded-2xl p-4 sm:p-6 text-center transition-colors relative cursor-pointer">
                    <input type="file" multiple accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                    <Upload size={20} className="mx-auto text-amber-600 sm:w-6 sm:h-6" />
                    <p className="text-[10px] sm:text-xs font-bold text-slate-700 mt-1">Upload Cafe & Table Photos</p>
                    <p className="text-[8px] sm:text-[10px] text-slate-400">PNG, JPG, WEBP formats supported</p>
                  </div>
                  {images.length > 0 && (
                    <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-6 gap-2 mt-2">
                      {images.map((file, index) => (
                        <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group">
                          <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                          <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-xs shadow">×</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Description & Special Notes</label>
                  <textarea
                    name="description"
                    rows={2}
                    placeholder="Describe seating area, atmosphere, power outlets, window view, etc..."
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full mt-1 px-3 py-2.5 sm:py-3 border border-slate-200 rounded-xl text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all resize-none"
                  />
                </div>

                <input type="hidden" name="isCafe" value="true" />
                <input type="hidden" name="isChamber" value="false" />

                <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="py-2.5 sm:py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs sm:text-sm hover:bg-slate-50 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" className="py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-amber-600/20">
                    Add Table
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ─── EDIT TABLE MODAL ─── */}
      {isEditModalOpen && editingCabin && (
        <div className="fixed inset-0 z-[1100] flex items-end sm:items-center justify-center p-2 sm:p-4 bg-slate-900/50 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) setIsEditModalOpen(false); }}>
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200" style={{ maxHeight: "95vh" }}>
            <div className="bg-gradient-to-r from-amber-600 to-amber-700 p-4 sm:p-5 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-white/20 flex items-center justify-center">
                  <Pencil size={18} className="text-white sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white">Edit Table Listing</h2>
                  <p className="text-[10px] sm:text-xs text-white/75">Update details for {editingCabin.name}</p>
                </div>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="w-8 h-8 rounded-xl bg-white/15 hover:bg-white/25 transition-colors flex items-center justify-center text-white">
                <X size={18} />
              </button>
            </div>

            <div className="overflow-y-auto p-4 sm:p-6 flex-1">
              <form onSubmit={handleEditSubmit} className="space-y-4 sm:space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Cafe / Restaurant Name *</label>
                    <input
                      type="text"
                      value={editFormData.name}
                      onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                      className="w-full mt-1 px-3 py-2.5 sm:py-3 border border-slate-200 rounded-xl text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Address / Location *</label>
                    <input
                      type="text"
                      value={editFormData.address}
                      onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                      className="w-full mt-1 px-3 py-2.5 sm:py-3 border border-slate-200 rounded-xl text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 xs:grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Table Number *</label>
                    <input
                      type="text"
                      value={editFormData.tableNumber}
                      onChange={(e) => setEditFormData({ ...editFormData, tableNumber: e.target.value })}
                      className="w-full mt-1 px-3 py-2.5 sm:py-3 border border-slate-200 rounded-xl text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Seats / Capacity *</label>
                    <input
                      type="number" min="1"
                      value={editFormData.capacity}
                      onChange={(e) => setEditFormData({ ...editFormData, capacity: e.target.value })}
                      className="w-full mt-1 px-3 py-2.5 sm:py-3 border border-slate-200 rounded-xl text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Price / Hour (₹) *</label>
                    <input
                      type="number" min="0"
                      value={editFormData.price}
                      onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
                      className="w-full mt-1 px-3 py-2.5 sm:py-3 border border-slate-200 rounded-xl text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Table Type</label>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-1">
                    <button
                      type="button"
                      onClick={() => setEditFormData({ ...editFormData, cabinType: "normal" })}
                      className={`py-2.5 sm:py-3 px-3 rounded-xl text-xs sm:text-sm font-semibold border-2 transition-all flex items-center justify-center gap-2 ${editFormData.cabinType === "normal" ? "border-amber-600 bg-amber-50 text-amber-800" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                    >
                      <Coffee size={15} /> Standard Table
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditFormData({ ...editFormData, cabinType: "exclusive" })}
                      className={`py-2.5 sm:py-3 px-3 rounded-xl text-xs sm:text-sm font-semibold border-2 transition-all flex items-center justify-center gap-2 ${editFormData.cabinType === "exclusive" ? "border-amber-600 bg-amber-50 text-amber-800" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                    >
                      <Crown size={15} className="text-amber-600" /> VIP / Private Booth
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Open Time</label>
                    <input
                      type="time"
                      value={editFormData.openTime}
                      onChange={(e) => setEditFormData({ ...editFormData, openTime: e.target.value })}
                      disabled={editFormData.is24x7}
                      className="w-full mt-1 px-3 py-2.5 sm:py-3 border border-slate-200 rounded-xl text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Close Time</label>
                    <input
                      type="time"
                      value={editFormData.closeTime}
                      onChange={(e) => setEditFormData({ ...editFormData, closeTime: e.target.value })}
                      disabled={editFormData.is24x7}
                      className="w-full mt-1 px-3 py-2.5 sm:py-3 border border-slate-200 rounded-xl text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                    />
                  </div>
                  <div className="flex items-center sm:pt-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editFormData.is24x7}
                        onChange={(e) => setEditFormData({ ...editFormData, is24x7: e.target.checked })}
                        className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300"
                      />
                      <span className="text-xs font-semibold text-slate-700">Open 24x7</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Amenities & Facilities</label>
                  <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-1.5 sm:gap-2 mt-1">
                    {CAFE_AMENITIES.map((item) => {
                      const isActive = editFormData.amenities[item.key] || false;
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => {
                            setEditFormData(prev => ({
                              ...prev,
                              amenities: { ...prev.amenities, [item.key]: !prev.amenities[item.key] }
                            }));
                          }}
                          className={`flex items-center gap-1.5 p-2 sm:p-2.5 rounded-lg text-[10px] sm:text-xs font-semibold border transition-all ${isActive ? "border-amber-600 bg-amber-50/80 text-amber-900" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                        >
                          <Icon size={14} className={isActive ? "text-amber-600" : "text-slate-400"} />
                          <span className="truncate">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Dining Packages ({editPricingPlans.length})</label>
                    <button
                      type="button"
                      onClick={() => {
                        setPlanInput({ label: "", hours: "", cost: "", validity: "" });
                        setEditingPlanIndex(null);
                        setShowPlanModal(true);
                      }}
                      className="text-[10px] sm:text-xs font-bold text-amber-700 bg-amber-50 px-2.5 sm:px-3 py-1 rounded-lg hover:bg-amber-100 transition-colors flex items-center gap-1 border border-amber-200"
                    >
                      <Plus size={12} /> Add Plan
                    </button>
                  </div>
                  {editPricingPlans.length > 0 ? (
                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-2">
                      {editPricingPlans.map((plan, idx) => (
                        <div key={idx} className="p-2.5 bg-slate-50 rounded-xl text-xs border border-slate-200 flex justify-between items-center">
                          <div>
                            <div className="font-bold text-slate-900">{plan.label || "Plan"}</div>
                            <div className="text-amber-700 font-semibold">{plan.hours}h · ₹{plan.cost}</div>
                            <div className="text-[10px] text-slate-400">{plan.validity} days</div>
                          </div>
                          <div className="flex items-center gap-1">
                            <button type="button" onClick={() => {
                              setPlanInput({ label: plan.label || "", hours: plan.hours?.toString() || "", cost: plan.cost?.toString() || "", validity: plan.validity?.toString() || "" });
                              setEditingPlanIndex(idx);
                              setShowPlanModal(true);
                            }} className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-xs hover:bg-amber-200">✎</button>
                            <button type="button" onClick={() => setEditPricingPlans(editPricingPlans.filter((_, i) => i !== idx))} className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs hover:bg-red-200">×</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-3 text-center bg-slate-50/50">
                      <p className="text-xs text-slate-400">Optional: Add multi-hour dining packages</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Table & Cafe Photos</label>
                  
                  {existingImages.length > 0 && (
                    <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-6 gap-2 mt-1 mb-2">
                      {existingImages.map((img, idx) => (
                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group">
                          <img src={getImageUrl(img)} alt="existing" className="w-full h-full object-cover" />
                          <button type="button" onClick={() => setExistingImages(existingImages.filter((_, i) => i !== idx))}
                            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-xs shadow">×</button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-1 border-2 border-dashed border-amber-200 hover:border-amber-400 bg-amber-50/30 rounded-2xl p-4 sm:p-6 text-center transition-colors relative cursor-pointer">
                    <input type="file" multiple accept="image/*" onChange={(e) => {
                      const files = Array.from(e.target.files);
                      setEditImages(prev => [...prev, ...files]);
                    }} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                    <Upload size={20} className="mx-auto text-amber-600 sm:w-6 sm:h-6" />
                    <p className="text-[10px] sm:text-xs font-bold text-slate-700 mt-1">Upload New Photos</p>
                    <p className="text-[8px] sm:text-[10px] text-slate-400">PNG, JPG, WEBP formats supported</p>
                  </div>

                  {editImages.length > 0 && (
                    <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-6 gap-2 mt-2">
                      {editImages.map((file, index) => (
                        <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group">
                          <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                          <button type="button" onClick={() => setEditImages(editImages.filter((_, i) => i !== index))}
                            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-xs shadow">×</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Description & Special Notes</label>
                  <textarea
                    rows={2}
                    value={editFormData.description}
                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                    className="w-full mt-1 px-3 py-2.5 sm:py-3 border border-slate-200 rounded-xl text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all resize-none"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <p className="text-xs font-bold text-slate-800">Table Active Status</p>
                    <p className="text-[10px] text-slate-400">Diners can discover and book when active</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditFormData({ ...editFormData, isActive: !editFormData.isActive })}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${editFormData.isActive ? "bg-emerald-500 text-white" : "bg-slate-300 text-slate-700"}`}
                  >
                    {editFormData.isActive ? "Active" : "Inactive"}
                  </button>
                </div>

                <input type="hidden" name="isCafe" value="true" />
                <input type="hidden" name="isChamber" value="false" />

                <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-2">
                  <button type="button" onClick={() => setIsEditModalOpen(false)} className="py-2.5 sm:py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs sm:text-sm hover:bg-slate-50 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting} className="py-2.5 sm:py-3 rounded-xl bg-amber-600 text-white font-bold text-xs sm:text-sm hover:bg-amber-700 transition-all shadow-md shadow-amber-600/20 disabled:opacity-50">
                    {submitting ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ─── CONFIRMATION MODAL ─── */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[10500] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center mb-2">
                <UtensilsCrossed size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Publish Table Listing</h3>
              <p className="text-xs text-slate-500 mt-0.5">Ready to publish <strong>{formData.name} ({formData.tableNumber})</strong></p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 text-xs space-y-1.5 border border-slate-200 mb-4">
              <div className="flex justify-between text-slate-600"><span>Location:</span><span className="font-semibold truncate max-w-[180px]">{formData.address}</span></div>
              <div className="flex justify-between text-slate-600"><span>Capacity:</span><span className="font-semibold">{formData.capacity} Guests</span></div>
              <div className="flex justify-between text-slate-600"><span>Hourly Rate:</span><span className="font-semibold">₹{formData.price}/hr</span></div>
              <div className="flex justify-between text-slate-600"><span>Photos Attached:</span><span className="font-semibold">{images.length} images</span></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setShowConfirmModal(false)} className="py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50">Go Back</button>
              <button type="button" onClick={createTableAndOrder} disabled={submitting} className="py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold text-xs hover:shadow transition-all flex items-center justify-center gap-1.5 disabled:opacity-50">
                {submitting ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                <span>Confirm & Publish</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MANUAL PLAN MODAL ─── */}
      {showPlanModal && (
        <div className="fixed inset-0 z-[11000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-base font-bold text-slate-900">{editingPlanIndex !== null ? "Edit Plan" : "Add Dining Package"}</h4>
              <button onClick={() => setShowPlanModal(false)} className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"><X size={15} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Plan Label</label>
                <input type="text" placeholder="e.g. 2h Candlelight Dinner" value={planInput.label} onChange={(e) => setPlanInput({ ...planInput, label: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-amber-500" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Hours *</label>
                  <input type="number" min="1" placeholder="2" value={planInput.hours} onChange={(e) => setPlanInput({ ...planInput, hours: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-amber-500" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Cost (₹) *</label>
                  <input type="number" min="0" placeholder="500" value={planInput.cost} onChange={(e) => setPlanInput({ ...planInput, cost: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-amber-500" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Validity (Days) *</label>
                <input type="number" min="1" placeholder="30" value={planInput.validity} onChange={(e) => setPlanInput({ ...planInput, validity: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-amber-500" />
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button type="button" onClick={() => setShowPlanModal(false)} className="py-2 rounded-xl border border-slate-200 text-xs font-semibold hover:bg-slate-50">Cancel</button>
                <button type="button" onClick={() => {
                  if (!planInput.hours || Number(planInput.hours) <= 0) { toast.error("Please enter valid hours"); return; }
                  if (!planInput.cost || Number(planInput.cost) <= 0) { toast.error("Please enter valid cost"); return; }
                  if (!planInput.validity || Number(planInput.validity) <= 0) { toast.error("Please enter valid validity days"); return; }
                  const newPlan = { label: planInput.label.trim() || `${planInput.hours} Hours Plan`, hours: Number(planInput.hours), cost: Number(planInput.cost), validity: Number(planInput.validity) };
                  if (editingPlanIndex !== null) {
                    const targetList = isModalOpen ? pricingPlans : editPricingPlans;
                    const setter = isModalOpen ? setPricingPlans : setEditPricingPlans;
                    setter(targetList.map((p, i) => i === editingPlanIndex ? newPlan : p));
                  } else {
                    const targetList = isModalOpen ? pricingPlans : editPricingPlans;
                    const setter = isModalOpen ? setPricingPlans : setEditPricingPlans;
                    setter([...targetList, newPlan]);
                  }
                  setShowPlanModal(false);
                  setPlanInput({ label: "", hours: "", cost: "", validity: "" });
                  setEditingPlanIndex(null);
                }} className="py-2 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-700">Save Plan</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCafes;