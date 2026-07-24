// AdminCabins.jsx - Complete with Multi-Filter, All Images in Cards & Modal + Razorpay
import axios from "axios";
import {
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
  Building2 as BuildingIcon,
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
  Sofa,
  Info,
  ChevronLeft,
  ChevronRight,
  Images,
  Search as SearchIcon,
  Video,
  Clock as ClockIcon,
  Sun,
  Moon,
  Stethoscope,
  Briefcase,
  Armchair,
  Coffee,
  Dumbbell,
  Wind,
  Tv,
  Printer,
  Phone,
  Grid as GridIcon,
  CreditCard,
  Loader2,
  Receipt,
  AlertCircle
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AdminNavbar from "./AdminNavbar";
import "./Dashboard.css";

const API_URL = "http://localhost:5003";
const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000";

// Load Razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// ─── IMAGE SLIDER COMPONENT ───
const ImageSlider = ({ images, alt, onImageClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <Building2 size={32} className="text-gray-300" />
      </div>
    );
  }

  const nextSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToSlide = (index, e) => {
    if (e) e.stopPropagation();
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full h-full overflow-hidden group cursor-pointer" onClick={() => onImageClick && onImageClick()}>
      <img
        src={images[currentIndex]}
        alt={alt || "Cabin image"}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }}
      />
      
      {images.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
          >
            <ChevronRight size={14} />
          </button>
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => goToSlide(index, e)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  index === currentIndex ? 'bg-white w-3' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
          <span className="absolute top-1 right-1 bg-black/60 text-white text-[8px] px-1.5 py-0.5 rounded">
            {currentIndex + 1}/{images.length}
          </span>
        </>
      )}
    </div>
  );
};

// ─── IMAGE MODAL ───
const ImageGalleryModal = ({ images, isOpen, onClose, cabinName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!isOpen || !images || images.length === 0) return null;

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="fixed inset-0 z-[1300] bg-black/90 flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={onClose}>
      <div className="relative max-w-5xl w-full max-h-[90vh] bg-black rounded-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/70 to-transparent flex items-center justify-between">
          <h3 className="text-white font-semibold text-sm truncate max-w-[200px]">{cabinName || "Gallery"}</h3>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="relative h-[70vh] flex items-center justify-center">
          <img
            src={images[currentIndex]}
            alt={`Gallery ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain"
            onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }}
          />
          
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
        </div>

        {images.length > 1 && (
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex gap-2 overflow-x-auto justify-center px-4">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentIndex ? 'border-white' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumb ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── MAIN ADMIN CABINS ───
const AdminCabins = () => {
  const [cabins, setCabins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [cabinCount, setCabinCount] = useState(0);
  
  const [filters, setFilters] = useState({
    search: "",
    cabinType: "all",
    status: "all",
    priceMin: "",
    priceMax: "",
    address: ""
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCabin, setEditingCabin] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [pricingPlans, setPricingPlans] = useState([]);
  const [editPricingPlans, setEditPricingPlans] = useState([]);
  const [countdowns, setCountdowns] = useState({});
  const [addressPopup, setAddressPopup] = useState({ show: false, address: "", x: 0, y: 0 });
  const [galleryModal, setGalleryModal] = useState({ isOpen: false, images: [], cabinName: "" });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [newCabinData, setNewCabinData] = useState(null);
  const navigate = useNavigate();

  // ─── SEAT MANAGEMENT ───
  const [seats, setSeats] = useState([]);
  const [seatInput, setSeatInput] = useState({ name: '', number: '' });
  const [showSeatModal, setShowSeatModal] = useState(false);
  const [editingSeatIndex, setEditingSeatIndex] = useState(null);
  const [seatBatchMode, setSeatBatchMode] = useState(false);
  const [batchSeatNumber, setBatchSeatNumber] = useState(1);

  // ─── ADD FORM STATE ───
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    capacity: "",
    address: "",
    price: "",
    cabin: "",
    cabinType: "normal",
    isChamber: false,
    is24x7: false,
    openTime: "09:00",
    closeTime: "21:00",
    amenities: {
      wifi: false,
      parking: false,
      lockers: false,
      privateWashroom: false,
      secureAccess: false,
      comfortSeating: false,
      coffee: false,
      gym: false,
      ac: false,
      tv: false,
      printer: false,
      phone: false,
    },
  });
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);

  // ─── EDIT FORM STATE ───
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    capacity: "",
    address: "",
    price: "",
    cabin: "",
    cabinType: "",
    isChamber: false,
    is24x7: false,
    openTime: "09:00",
    closeTime: "21:00",
    isActive: null,
    amenities: {
      wifi: false,
      parking: false,
      lockers: false,
      privateWashroom: false,
      secureAccess: false,
      comfortSeating: false,
      coffee: false,
      gym: false,
      ac: false,
      tv: false,
      printer: false,
      phone: false,
    },
  });
  const [editImages, setEditImages] = useState([]);
  const [editVideos, setEditVideos] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [existingVideos, setExistingVideos] = useState([]);
  const [removeExistingImageIndexes, setRemoveExistingImageIndexes] = useState([]);
  const [removeExistingVideoIndexes, setRemoveExistingVideoIndexes] = useState([]);

  // ─── ALL AMENITIES ───
  const ALL_AMENITIES = [
    { key: "wifi", label: "Wi-Fi", icon: Wifi },
    { key: "parking", label: "Parking", icon: ParkingCircle },
    { key: "lockers", label: "Lockers", icon: Lock },
    { key: "comfortSeating", label: "Comfort Seating", icon: Sofa },
    { key: "privateWashroom", label: "Private Washroom", icon: Bath },
    { key: "secureAccess", label: "Secure Access", icon: Shield },
    { key: "coffee", label: "Coffee", icon: Coffee },
    { key: "gym", label: "Gym", icon: Dumbbell },
    { key: "ac", label: "AC", icon: Wind },
    { key: "tv", label: "TV", icon: Tv },
    { key: "printer", label: "Printer", icon: Printer },
    { key: "phone", label: "Phone", icon: Phone },
  ];

  // ─── EFFECTS ───
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdowns(prev => {
        const updated = { ...prev };
        let hasChanges = false;
        Object.keys(updated).forEach(key => {
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

  // ─── LOAD RAZORPAY ───
  useEffect(() => {
    loadRazorpayScript().then((loaded) => {
      setRazorpayLoaded(loaded);
      if (!loaded) {
        toast.error("Failed to load Razorpay. Please refresh the page.");
      }
    });
  }, []);

  // ─── HELPERS ───
  const getImageUrl = (img) => {
    if (!img) return PLACEHOLDER_IMAGE;
    if (img.startsWith("http")) return img;
    const cleanPath = img.replace(/\\/g, "/").replace(/^\/+/, "");
    return `${API_URL}/${cleanPath}`;
  };

  const getAllImageUrls = (cabin) => {
    if (!cabin.images || cabin.images.length === 0) {
      return [PLACEHOLDER_IMAGE];
    }
    return cabin.images.map(img => getImageUrl(img));
  };

  const fetchCabins = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/cabins`);
      const data = res.data.cabins || res.data;
      const allCabins = Array.isArray(data) ? data : [];

      const adminCabins = allCabins.filter(cabin =>
        cabin.owner === "68ebe9ee8f06d33ee022d665"
      );

      setCabins(adminCabins);
      setCabinCount(adminCabins.length);
      
      const initialCountdowns = {};
      adminCabins.forEach(cabin => {
        if (cabin.expiryDate) {
          const expiry = new Date(cabin.expiryDate);
          const now = new Date();
          const diff = Math.max(0, Math.floor((expiry - now) / 1000));
          initialCountdowns[cabin._id] = diff;
        }
      });
      setCountdowns(initialCountdowns);
      
    } catch (err) {
      console.error("Error fetching cabins:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCabins();
  }, []);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this cabin?")) return;

    try {
      await axios.delete(`${API_URL}/api/cabins/${id}`);
      setCabins(cabins.filter(c => c._id !== id));
      setCabinCount(prev => prev - 1);
      toast.success("Cabin deleted successfully");
    } catch (error) {
      console.error("Error deleting cabin", error);
      toast.error("Failed to delete cabin");
    }
  };

  // ─── FILTERS ───
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearAllFilters = () => {
    setFilters({
      search: "",
      cabinType: "all",
      status: "all",
      priceMin: "",
      priceMax: "",
      address: ""
    });
  };

  const filteredCabins = cabins.filter(cabin => {
    if (filters.search && !cabin.name?.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.cabinType !== "all" && cabin.cabinType !== filters.cabinType) {
      return false;
    }
    if (filters.status !== "all") {
      if (filters.status === "active" && cabin.isActive !== true) return false;
      if (filters.status === "inactive" && cabin.isActive !== false) return false;
    }
    if (filters.priceMin && (cabin.price || 0) < Number(filters.priceMin)) return false;
    if (filters.priceMax && (cabin.price || 0) > Number(filters.priceMax)) return false;
    if (filters.address && !cabin.address?.toLowerCase().includes(filters.address.toLowerCase())) {
      return false;
    }
    return true;
  });

  const activeCount = cabins.filter(c => c.isActive === true).length;
  const inactiveCount = cabins.filter(c => c.isActive === false).length;
  const exclusiveCount = cabins.filter(c => c.cabinType === 'exclusive').length;
  const normalCount = cabins.filter(c => c.cabinType === 'normal').length;
  const withExpiryCount = cabins.filter(c => c.expiryDate).length;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCountdown = (seconds) => {
    if (!seconds || seconds <= 0) return 'Expired';
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) {
      return `${days}d ${hours}h`;
    }
    return `${hours}h ${minutes}m`;
  };

  const getCountdownColor = (seconds) => {
    if (!seconds || seconds <= 0) return 'text-red-600';
    if (seconds < 86400) return 'text-orange-500';
    if (seconds < 172800) return 'text-yellow-500';
    return 'text-emerald-600';
  };

  const handleAddressClick = (e, address) => {
    const rect = e.target.getBoundingClientRect();
    setAddressPopup({
      show: true,
      address: address || "No address available",
      x: rect.left,
      y: rect.bottom + 8
    });
  };

  const closeAddressPopup = () => {
    setAddressPopup({ show: false, address: "", x: 0, y: 0 });
  };

  const openGallery = (cabin) => {
    const images = getAllImageUrls(cabin);
    setGalleryModal({
      isOpen: true,
      images: images,
      cabinName: cabin.name || "Cabin"
    });
  };

  const closeGallery = () => {
    setGalleryModal({ isOpen: false, images: [], cabinName: "" });
  };

  // ─── SEAT FUNCTIONS ───
  const openSeatModal = () => {
    setSeatInput({ name: '', number: '' });
    setEditingSeatIndex(null);
    setSeatBatchMode(false);
    setShowSeatModal(true);
  };

  const openBatchSeatModal = () => {
    const capacity = parseInt(formData.capacity);
    if (!capacity || capacity < 1) {
      toast.error("Please enter number of seats first");
      return;
    }
    if (seats.length >= capacity) {
      toast.error(`Already added ${seats.length} seats. Capacity is ${capacity}`);
      return;
    }
    const nextNumber = seats.length + 1;
    setBatchSeatNumber(nextNumber);
    setSeatBatchMode(true);
    setSeatInput({ name: `Seat ${nextNumber}`, number: nextNumber.toString() });
    setEditingSeatIndex(null);
    setShowSeatModal(true);
  };

  const addSeat = () => {
    if (!seatInput.name.trim()) {
      toast.error("Please enter a seat name");
      return;
    }
    if (!seatInput.number || seatInput.number < 1) {
      toast.error("Please enter a valid seat number");
      return;
    }

    const seatNumber = parseInt(seatInput.number);
    if (seats.some(s => s.number === seatNumber)) {
      toast.error(`Seat #${seatNumber} already exists`);
      return;
    }

    const capacity = parseInt(formData.capacity);
    if (capacity && seats.length >= capacity) {
      toast.error(`Cannot add more than ${capacity} seats`);
      return;
    }

    if (editingSeatIndex !== null) {
      const updatedSeats = [...seats];
      updatedSeats[editingSeatIndex] = { name: seatInput.name.trim(), number: seatNumber };
      setSeats(updatedSeats);
      setEditingSeatIndex(null);
      toast.success("Seat updated successfully");
    } else {
      setSeats([...seats, { name: seatInput.name.trim(), number: seatNumber }]);
      toast.success(`Seat #${seatNumber} added successfully`);
    }

    setSeatInput({ name: '', number: '' });
    setShowSeatModal(false);
    setSeatBatchMode(false);
    
    if (capacity && seats.length + 1 >= capacity) {
      toast.success(`✅ All ${capacity} seats added!`);
    }
  };

  const editSeat = (index) => {
    setSeatInput({ name: seats[index].name, number: seats[index].number.toString() });
    setEditingSeatIndex(index);
    setSeatBatchMode(false);
    setShowSeatModal(true);
  };

  const removeSeat = (index) => {
    if (window.confirm(`Remove seat "${seats[index].name}"?`)) {
      setSeats(seats.filter((_, i) => i !== index));
      if (editingSeatIndex === index) {
        setEditingSeatIndex(null);
        setSeatInput({ name: '', number: '' });
      }
      toast.success("Seat removed");
    }
  };

  const generateAllSeats = () => {
    const capacity = parseInt(formData.capacity);
    if (!capacity || capacity < 1) {
      toast.error("Please enter a valid number of seats");
      return;
    }
    if (seats.length > 0) {
      if (!window.confirm(`This will replace all ${seats.length} existing seats. Continue?`)) {
        return;
      }
    }
    const newSeats = [];
    for (let i = 1; i <= capacity; i++) {
      newSeats.push({ name: `Seat ${i}`, number: i });
    }
    setSeats(newSeats);
    toast.success(`✅ Generated ${capacity} seats`);
  };

  // ─── EDIT FUNCTIONS ───
  const openEditModal = (cabin) => {
    setEditingCabin(cabin);
    setEditFormData({
      name: cabin.name || "",
      description: cabin.description || "",
      capacity: cabin.capacity || "",
      address: cabin.address || "",
      price: cabin.price || "",
      cabin: cabin.cabin || "",
      cabinType: cabin.cabinType || "",
      isChamber: cabin.isChamber || false,
      is24x7: cabin.is24x7 || false,
      openTime: cabin.openTime || "09:00",
      closeTime: cabin.closeTime || "21:00",
      isActive: cabin.isActive,
      amenities: cabin.amenities || {
        wifi: false,
        parking: false,
        lockers: false,
        privateWashroom: false,
        secureAccess: false,
        comfortSeating: false,
        coffee: false,
        gym: false,
        ac: false,
        tv: false,
        printer: false,
        phone: false,
      },
    });
    setEditPricingPlans(cabin.pricingPlans || []);
    setExistingImages(cabin.images || []);
    setExistingVideos(cabin.videos || []);
    setRemoveExistingImageIndexes([]);
    setRemoveExistingVideoIndexes([]);
    setEditImages([]);
    setEditVideos([]);
    setIsEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setEditFormData({ ...editFormData, [name]: checked });
    } else {
      setEditFormData({ ...editFormData, [name]: value });
    }
  };

  const toggleEditAmenity = (key) => {
    setEditFormData((prev) => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [key]: !prev.amenities[key],
      },
    }));
  };

  const handleEditImageChange = (e) => {
    setEditImages(Array.from(e.target.files));
  };

  const handleEditVideoChange = (e) => {
    setEditVideos(Array.from(e.target.files));
  };

  const removeEditImage = (index) => {
    setEditImages(editImages.filter((_, i) => i !== index));
  };

  const removeEditVideo = (index) => {
    setEditVideos(editVideos.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setRemoveExistingImageIndexes([...removeExistingImageIndexes, index]);
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const removeExistingVideo = (index) => {
    setRemoveExistingVideoIndexes([...removeExistingVideoIndexes, index]);
    setExistingVideos(existingVideos.filter((_, i) => i !== index));
  };

  const addEditPlan = () => {
    const label = prompt("Plan Label:");
    const hours = prompt("Included Hours:");
    const cost = prompt("Cost (₹):");
    const validity = prompt("Validity (Days):");
    if (hours && cost && validity) {
      setEditPricingPlans([...editPricingPlans, {
        label: (label || "").trim(),
        hours: Number(hours),
        cost: Number(cost),
        validity: Number(validity)
      }]);
    }
  };

  const removeEditPlan = (index) => {
    setEditPricingPlans(editPricingPlans.filter((_, i) => i !== index));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData();
      
      if (editFormData.name) {
        const cabinName = editFormData.cabin ? `${editFormData.name} - ${editFormData.cabin}` : editFormData.name;
        formData.append("name", cabinName);
      }
      if (editFormData.description) formData.append("description", editFormData.description);
      if (editFormData.capacity) formData.append("capacity", editFormData.capacity);
      if (editFormData.address) formData.append("address", editFormData.address);
      if (editFormData.price) formData.append("price", editFormData.price);
      if (editFormData.cabinType) formData.append("cabinType", editFormData.cabinType);
      formData.append("isChamber", editFormData.isChamber);
      formData.append("is24x7", editFormData.is24x7);
      formData.append("openTime", editFormData.openTime);
      formData.append("closeTime", editFormData.closeTime);
      
      if (editFormData.isActive !== null && editFormData.isActive !== undefined) {
        formData.append("isActive", editFormData.isActive);
      }
      
      if (editPricingPlans.length > 0) {
        formData.append("pricingPlans", JSON.stringify(editPricingPlans));
      }
      
      const hasAmenity = Object.values(editFormData.amenities).some(v => v === true);
      if (hasAmenity) {
        formData.append("amenities", JSON.stringify(editFormData.amenities));
      }
      
      editImages.forEach((img) => formData.append("images", img));
      editVideos.forEach((video) => formData.append("videos", video));

      await axios.put(`${API_URL}/api/cabins/${editingCabin._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      toast.success("Cabin updated successfully!");
      setIsEditModalOpen(false);
      setEditingCabin(null);
      fetchCabins();
    } catch (err) {
      console.error("Update Cabin Error:", err);
      toast.error("Failed to update cabin");
    } finally {
      setSubmitting(false);
    }
  };

  // ─── ADD FUNCTIONS ───
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
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
    setImages(Array.from(e.target.files));
  };

  const handleVideoChange = (e) => {
    setVideos(Array.from(e.target.files));
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const removeVideo = (index) => {
    setVideos(videos.filter((_, i) => i !== index));
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

  // ─── GET TOKEN ───
  const getToken = () => {
    return localStorage.getItem("token");
  };

  // ─── INITIATE RAZORPAY PAYMENT ───
  const initiateRazorpayPayment = (orderData, cabinId) => {
    setPaymentProcessing(true);
    try {
      if (typeof window.Razorpay === 'undefined') {
        toast.error('Razorpay not loaded. Please refresh the page.');
        setPaymentProcessing(false);
        return;
      }

      const razorpayKey = orderData.razorpayKey || 'rzp_test_BxtRNvflG06PTV';
      
      const options = {
        key: razorpayKey,
        amount: orderData.order.amount * 100,
        currency: "INR",
        name: "Cabin Registration",
        description: `Cabin #${cabinCount + 1} Registration Fee (incl. GST)`,
        order_id: orderData.order.razorpayOrderId,
        handler: async function(response) {
          try {
            const token = getToken();
            const verifyRes = await axios.post(
              `${API_URL}/api/cabins/verify-cabin-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                cabinId: cabinId
              },
              {
                headers: { Authorization: `Bearer ${token}` }
              }
            );

            if (verifyRes.data.success) {
              const transactionId = verifyRes.data.transactionId || 'N/A';
              
              toast.success(
                <div>
                  <div style={{ fontWeight: 'bold' }}>Payment Successful! 🎉</div>
                  <div style={{ fontSize: '0.8rem', marginTop: '4px' }}>
                    Transaction ID: {transactionId}
                  </div>
                </div>,
                { autoClose: 5000 }
              );
              
              setShowConfirmModal(false);
              setIsModalOpen(false);
              setPaymentProcessing(false);
              
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
                is24x7: false,
                openTime: "09:00",
                closeTime: "21:00",
                amenities: {
                  wifi: false,
                  parking: false,
                  lockers: false,
                  privateWashroom: false,
                  secureAccess: false,
                  comfortSeating: false,
                  coffee: false,
                  gym: false,
                  ac: false,
                  tv: false,
                  printer: false,
                  phone: false,
                },
              });
              setImages([]);
              setVideos([]);
              setSeats([]);
              setPricingPlans([]);
              
              await fetchCabins();
            } else {
              toast.error('Payment verification failed');
              setPaymentProcessing(false);
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            toast.error(error.response?.data?.error || "Payment verification failed");
            setPaymentProcessing(false);
          }
        },
        prefill: {
          name: "Admin",
          email: "admin@iriax.com",
          contact: "9999999999",
        },
        theme: {
          color: "#6366f1",
        },
        modal: {
          ondismiss: function() {
            toast.warning("Payment cancelled");
            setPaymentProcessing(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Razorpay error:", error);
      toast.error("Failed to initiate payment: " + error.message);
      setPaymentProcessing(false);
    }
  };

  // ─── CREATE CABIN AND ORDER ───
  const createCabinAndOrder = async () => {
    setSubmitting(true);

    try {
      const data = new FormData();
      const cabinName = formData.cabin ? `${formData.name} - ${formData.cabin}` : formData.name;
      data.append("name", cabinName);
      data.append("description", formData.description || '');
      data.append("capacity", formData.capacity);
      data.append("address", formData.address);
      data.append("price", formData.price);
      data.append("cabinType", formData.cabinType);
      data.append("isChamber", formData.isChamber);
      data.append("is24x7", formData.is24x7);
      data.append("openTime", formData.openTime);
      data.append("closeTime", formData.closeTime);
      data.append("pricingPlans", JSON.stringify(pricingPlans));
      data.append("amenities", JSON.stringify(formData.amenities));
      
      if (!formData.isChamber) {
        data.append("seats", JSON.stringify(seats));
      }
      
      images.forEach((img) => data.append("images", img));
      videos.forEach((video) => data.append("videos", video));

      const token = getToken();
      const cabinRes = await axios.post(`${API_URL}/api/cabins`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (cabinRes.data.success) {
        const newCabin = cabinRes.data.cabin;
        toast.success("Cabin created successfully!");

        // ─── CREATE ORDER ───
        const orderRes = await axios.post(
          `${API_URL}/api/cabins/createcabinorder`,
          { cabinId: newCabin._id },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        if (orderRes.data.success) {
          setShowConfirmModal(false);
          setSubmitting(false);
          await initiateRazorpayPayment(orderRes.data, newCabin._id);
        } else {
          toast.error("Failed to create order");
          setSubmitting(false);
        }
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error(err.response?.data?.error || "Failed to create cabin and order");
      setSubmitting(false);
    } finally {
      setSubmitting(false);
    }
  };

  // ─── HANDLE SUBMIT ───
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.address || !formData.capacity || !formData.price || !formData.cabin) {
      toast.error("Please fill all required fields");
      return;
    }

    // Validate seats for Co-Working
    if (!formData.isChamber) {
      if (seats.length === 0) {
        toast.error("Please add at least one seat to the cabin");
        return;
      }
      if (seats.length !== parseInt(formData.capacity)) {
        toast.error(`Number of seats (${seats.length}) does not match capacity (${formData.capacity})`);
        return;
      }
    }
    
    // Check Razorpay
    if (!razorpayLoaded) {
      toast.error("Payment system not loaded. Please refresh the page.");
      return;
    }

    setShowConfirmModal(true);
  };

  // Check if seats should be shown
  const showSeatsSection = !formData.isChamber;

  // Calculate fee
  const isFirstCabin = cabinCount === 0;
  const baseFee = isFirstCabin ? 2000 : 1000;
  const gstAmount = baseFee * 0.18;
  const totalWithGST = baseFee + gstAmount;

  // ─── RENDER ───
  if (loading) {
    return (
      <div className="admin-dash" style={{ backgroundColor: '#ffffff' }}>
        <AdminNavbar />
        <div className="flex justify-center items-center h-64">
          <Loader2 size={48} className="text-indigo-500 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dash" style={{ backgroundColor: '#ffffff' }}>
      <AdminNavbar />

      <div className="pt-24 px-3 sm:px-4 md:px-6 lg:px-8 max-w-full mx-auto pb-16">
        {/* Header */}
        <div className="admin-dash__header">
          <div>
            <h1 className="admin-dash__greeting">
              My <span>Cabins</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/adminbookings")}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors"
            >
              <FileText size={14} className="text-indigo-600" />
              <span className="hidden xs:inline">Bookings</span>
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 transition-colors"
            >
              <Plus size={14} />
              <span className="hidden xs:inline">Add Cabin</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 sm:gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Total Cabins</p>
            <p className="text-2xl font-bold text-indigo-600 mt-1">{cabins.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Active</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{activeCount}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-600">Inactive</p>
            <p className="text-2xl font-bold text-gray-600 mt-1">{inactiveCount}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Exclusive</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">{exclusiveCount}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Normal</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{normalCount}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-purple-600">With Expiry</p>
            <p className="text-2xl font-bold text-purple-600 mt-1">{withExpiryCount}</p>
          </div>
        </div>

        {/* Table Section */}
        <div className="admin-dash__card" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}>
          <div className="admin-dash__card-header flex flex-wrap items-center justify-between gap-3" style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb' }}>
            <div className="flex items-center gap-3">
              <h3 className="admin-dash__card-title">My Cabins</h3>
              <span className="px-2.5 py-0.5 text-xs font-bold text-indigo-700 bg-indigo-100 rounded-full">
                {filteredCabins.length}
              </span>
            </div>
          </div>

          {/* ─── MULTI FILTER PANEL ─── */}
          <div className="px-4 pt-4 pb-3 border-b border-gray-100" style={{ backgroundColor: '#fafafa' }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Search</label>
                <div className="relative">
                  <SearchIcon size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    placeholder="Cabin name..."
                    className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Cabin Type</label>
                <select
                  value={filters.cabinType}
                  onChange={(e) => handleFilterChange('cabinType', e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  <option value="all">All Types</option>
                  <option value="normal">Normal</option>
                  <option value="exclusive">Exclusive</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Min Price</label>
                <input
                  type="number"
                  value={filters.priceMin}
                  onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Max Price</label>
                <input
                  type="number"
                  value={filters.priceMax}
                  onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                  placeholder="999999"
                  className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Address</label>
                <input
                  type="text"
                  value={filters.address}
                  onChange={(e) => handleFilterChange('address', e.target.value)}
                  placeholder="City/Location..."
                  className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex justify-end mt-3">
              <button 
                onClick={clearAllFilters} 
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-red-600 transition-colors"
              >
                <XCircleIcon size={14} /> Clear All Filters
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="admin-dash__card-body p-0 overflow-x-auto" style={{ backgroundColor: '#ffffff' }}>
            {filteredCabins.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-20 text-gray-400">
                <BuildingIcon size={48} className="opacity-20" />
                <p className="text-lg font-medium">No cabins found</p>
                <p className="text-sm">Try adjusting your filters or add a new cabin.</p>
              </div>
            ) : (
              <table className="w-full min-w-[1300px] text-left">
                <thead>
                  <tr className="border-b border-gray-100" style={{ backgroundColor: '#f9fafb' }}>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">#</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Cabin</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Images</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Address</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Type</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Price</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Capacity</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Status</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Expiry</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredCabins.map((cabin, idx) => {
                    const isActive = cabin.isActive === true;
                    const isExclusive = cabin.cabinType === 'exclusive';
                    const hasExpiry = cabin.expiryDate ? true : false;
                    const countdown = countdowns[cabin._id] || 0;
                    const isExpired = cabin.expiryDate && new Date(cabin.expiryDate) < new Date();
                    const cabinImages = getAllImageUrls(cabin);
                    
                    return (
                      <tr key={cabin._id} className="transition-colors group hover:bg-gray-50/80">
                        <td className="p-4">
                          <span className="text-sm font-semibold text-gray-400">#{idx + 1}</span>
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{cabin.name || 'N/A'}</p>
                            <p className="text-[10px] text-gray-400">{cabin.cabin || 'N/A'}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => openGallery(cabin)}
                            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors text-xs font-medium"
                          >
                            <Images size={14} />
                            <span>{cabinImages.length}</span>
                          </button>
                        </td>
                        <td className="p-4">
                          <span 
                            className="text-sm font-medium text-gray-700 flex items-center gap-1.5 cursor-pointer hover:text-indigo-600 transition-colors group"
                            onClick={(e) => handleAddressClick(e, cabin.address)}
                          >
                            <MapPin size={14} className="text-gray-400 flex-shrink-0 group-hover:text-indigo-500" />
                            <span className="truncate max-w-[120px]">{cabin.address?.split(",")[0] || "N/A"}</span>
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 text-xs font-bold rounded-full inline-flex items-center gap-1.5 ${
                            isExclusive 
                              ? 'bg-amber-100 text-amber-700' 
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {isExclusive ? (
                              <>
                                <Crown size={12} />
                                Exclusive
                              </>
                            ) : 'Normal'}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm font-bold text-gray-900">
                            ₹{cabin.price || 0}
                          </span>
                          <span className="text-xs text-gray-400 ml-0.5">/hr</span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-gray-700 flex items-center gap-1.5">
                            <Users size={14} className="text-gray-400" />
                            {cabin.capacity || 0}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                            isActive 
                              ? 'bg-emerald-100 text-emerald-700' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="p-4">
                          {hasExpiry ? (
                            <div className="flex flex-col gap-0.5">
                              <span className="text-sm text-gray-600">
                                {formatDate(cabin.expiryDate)}
                              </span>
                              {countdown > 0 && (
                                <span className={`text-[10px] font-mono font-medium flex items-center gap-1 ${getCountdownColor(countdown)}`}>
                                  <Timer size={10} />
                                  {formatCountdown(countdown)}
                                </span>
                              )}
                              {isExpired && (
                                <span className="text-[10px] text-red-500 font-medium">🔴 Expired</span>
                              )}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">N/A</span>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1 flex-nowrap">
                            <button
                              onClick={() => openGallery(cabin)}
                              className="p-1.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors"
                              title="Gallery"
                            >
                              <Images size={14} />
                            </button>
                            <button
                              onClick={() => navigate(`/cabin/${cabin._id}`)}
                              className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
                              title="View"
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              onClick={() => openEditModal(cabin)}
                              className="p-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors"
                              title="Edit"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={(e) => handleDelete(e, cabin._id)}
                              className="p-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
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
            <div className="px-4 py-3 border-t border-gray-100 rounded-b-2xl flex flex-wrap items-center justify-between gap-2" style={{ backgroundColor: '#fafafa' }}>
              <span className="text-xs text-gray-500">
                Showing <strong>{filteredCabins.length}</strong> of <strong>{cabins.length}</strong> cabins
              </span>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Active: {activeCount}
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                  Inactive: {inactiveCount}
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  Exclusive: {exclusiveCount}
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Normal: {normalCount}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Address Popup */}
      {addressPopup.show && (
        <div 
          className="fixed z-[1200] bg-white rounded-xl shadow-2xl border border-gray-200 p-4 max-w-xs animate-in fade-in zoom-in-95 duration-150"
          style={{ 
            left: Math.min(addressPopup.x, window.innerWidth - 320),
            top: Math.min(addressPopup.y, window.innerHeight - 150),
            transform: 'translateX(-50%)'
          }}
          onMouseLeave={closeAddressPopup}
        >
          <div className="flex items-start gap-2">
            <MapPin size={16} className="text-indigo-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-700 leading-relaxed">{addressPopup.address}</p>
          </div>
          <button 
            onClick={closeAddressPopup}
            className="absolute top-1 right-1 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={14} className="text-gray-400" />
          </button>
        </div>
      )}

      {/* Image Gallery Modal */}
      <ImageGalleryModal
        isOpen={galleryModal.isOpen}
        images={galleryModal.images}
        cabinName={galleryModal.cabinName}
        onClose={closeGallery}
      />

      {/* ====================== */}
      {/* ADD CABIN MODAL - COMPLETE */}
      {/* ====================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1100] flex items-end sm:items-center justify-center p-2 sm:p-4 bg-slate-900/50 backdrop-blur-sm">
          <div
            className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200"
            style={{ maxHeight: "95vh" }}
          >
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 sm:p-5 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-white/20 flex items-center justify-center">
                  <Home size={18} className="text-white sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white">Add New Cabin #{cabinCount + 1}</h2>
                  <p className="text-[10px] sm:text-xs text-white/75">
                    Fee: ₹{isFirstCabin ? '2,000' : '1,000'} + GST (18%)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-white/15 hover:bg-white/25 transition-colors flex items-center justify-center text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="overflow-y-auto p-4 sm:p-6 flex-1">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* ─── SPACE TYPE (isChamber) ─── */}
                <div>
                  <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Space Type *</label>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({...formData, isChamber: true});
                        setSeats([]);
                      }}
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
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Address *</label>
                    <input
                      className="w-full mt-1 px-3 py-2.5 sm:py-3 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                      type="text" name="address"
                      placeholder="e.g. Bangalore"
                      value={formData.address}
                      onChange={handleChange}
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
                      onChange={handleChange}
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
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Number of Seats *</label>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        className="flex-1 px-3 py-2.5 sm:py-3 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                        type="number" name="capacity" min="1"
                        placeholder="e.g. 5"
                        value={formData.capacity}
                        onChange={handleChange}
                        required
                      />
                      <button
                        type="button"
                        onClick={openBatchSeatModal}
                        disabled={!formData.capacity || parseInt(formData.capacity) < 1 || formData.isChamber}
                        className={`px-3 py-2.5 sm:py-3 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                          !formData.capacity || parseInt(formData.capacity) < 1 || formData.isChamber
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                        }`}
                      >
                        <Plus size={14} className="inline mr-1" /> Add
                      </button>
                    </div>
                    {formData.capacity && parseInt(formData.capacity) > 0 && !formData.isChamber && (
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {seats.length} of {formData.capacity} seats added
                        {seats.length > 0 && seats.length === parseInt(formData.capacity) && (
                          <span className="text-emerald-600 font-bold ml-1">✅ Complete!</span>
                        )}
                        {seats.length > 0 && seats.length < parseInt(formData.capacity) && (
                          <span className="text-amber-600 ml-1">⚠️ {parseInt(formData.capacity) - seats.length} more needed</span>
                        )}
                      </p>
                    )}
                    {formData.isChamber && (
                      <p className="text-[10px] text-slate-400 mt-0.5">🚫 Seats not required for Medical Chamber</p>
                    )}
                  </div>
                </div>

                {/* ─── SEAT LIST (Only for Co-Working) ─── */}
                {showSeatsSection && (
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Seat List ({seats.length} / {formData.capacity || '0'})
                      </label>
                      <div className="flex gap-1.5">
                        {formData.capacity && parseInt(formData.capacity) > 0 && seats.length === 0 && (
                          <button
                            type="button"
                            onClick={generateAllSeats}
                            className="text-[10px] sm:text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 sm:px-3 py-1 rounded-lg hover:bg-emerald-100 transition-colors flex items-center gap-1"
                          >
                            <GridIcon size={12} /> Generate All
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={openSeatModal}
                          className="text-[10px] sm:text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 sm:px-3 py-1 rounded-lg hover:bg-indigo-100 transition-colors flex items-center gap-1"
                        >
                          <Plus size={12} /> Add Manual
                        </button>
                      </div>
                    </div>
                    
                    {seats.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        {seats.map((seat, idx) => (
                          <div key={idx} className="bg-slate-50 rounded-lg border border-slate-200 p-2 text-center relative group">
                            <Armchair size={14} className="mx-auto text-indigo-500 mb-1" />
                            <p className="text-xs font-medium text-gray-700 truncate">{seat.name}</p>
                            <p className="text-[10px] text-gray-400">#{seat.number}</p>
                            <div className="absolute top-1 right-1 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                type="button"
                                onClick={() => editSeat(idx)}
                                className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[8px] hover:bg-indigo-200 transition-colors"
                              >
                                ✎
                              </button>
                              <button
                                type="button"
                                onClick={() => removeSeat(idx)}
                                className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-[8px] hover:bg-red-200 transition-colors"
                              >
                                ×
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center">
                        <p className="text-xs text-slate-400">
                          {formData.capacity && parseInt(formData.capacity) > 0 ? (
                            <>Click <strong>"Add"</strong> next to seats field to add seats one by one, or <strong>"Generate All"</strong> to create all at once.</>
                          ) : (
                            <>Enter number of seats first, then click <strong>"Add"</strong> to add seats.</>
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* ─── MEDICAL CHAMBER NOTE ─── */}
                {formData.isChamber && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Stethoscope size={16} className="text-emerald-600" />
                      <p className="text-xs text-emerald-700 font-medium">Medical Chamber - No seats required</p>
                    </div>
                  </div>
                )}

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

                {/* ─── TIMINGS ─── */}
                <div>
                  <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Timings</label>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-1">
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, is24x7: !formData.is24x7})}
                      className={`py-2.5 sm:py-3 px-3 rounded-xl text-xs sm:text-sm font-semibold border-2 transition-all flex items-center justify-center gap-2 ${
                        formData.is24x7
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {formData.is24x7 ? '✅ 24x7' : '⏰ Set Hours'}
                    </button>
                    {!formData.is24x7 && (
                      <>
                        <div>
                          <label className="text-[8px] font-bold text-slate-400">Open</label>
                          <input
                            type="time"
                            name="openTime"
                            value={formData.openTime}
                            onChange={handleChange}
                            className="w-full mt-0.5 px-2 py-1.5 border border-slate-200 rounded-lg text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[8px] font-bold text-slate-400">Close</label>
                          <input
                            type="time"
                            name="closeTime"
                            value={formData.closeTime}
                            onChange={handleChange}
                            className="w-full mt-0.5 px-2 py-1.5 border border-slate-200 rounded-lg text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* ─── AMENITIES ─── */}
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
                          onClick={() => toggleAmenity(item.key)}
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

                {/* ─── PRICING PLANS ─── */}
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

                {/* ─── DESCRIPTION ─── */}
                <div>
                  <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Description</label>
                  <textarea
                    className="w-full mt-1 px-3 py-2.5 sm:py-3 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all resize-none"
                    name="description"
                    placeholder="Describe your workspace..."
                    value={formData.description}
                    onChange={handleChange}
                    rows={2}
                  />
                </div>

                {/* ─── PHOTOS ─── */}
                <div>
                  <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Photos</label>
                  <div className="mt-1 border-2 border-dashed border-indigo-200 rounded-xl p-4 sm:p-6 text-center hover:border-indigo-400 transition-colors relative">
                    <input
                      type="file" multiple accept="image/*"
                      onChange={handleImageChange}
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
                            onClick={() => removeImage(index)}
                            className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* ─── VIDEOS ─── */}
                <div>
                  <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Videos</label>
                  <div className="mt-1 border-2 border-dashed border-purple-200 rounded-xl p-4 sm:p-6 text-center hover:border-purple-400 transition-colors relative">
                    <input
                      type="file" multiple accept="video/*"
                      onChange={handleVideoChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Video size={20} className="mx-auto text-purple-400 sm:w-6 sm:h-6" />
                    <p className="text-[10px] sm:text-xs text-slate-500 mt-1">Click to upload videos</p>
                    <p className="text-[8px] sm:text-[10px] text-slate-400">MP4, MOV, AVI</p>
                  </div>
                  {videos.length > 0 && (
                    <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 gap-2 mt-2">
                      {videos.map((file, index) => (
                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 bg-slate-900 flex items-center justify-center">
                          <Video size={24} className="text-white/50" />
                          <p className="absolute bottom-1 left-1 right-1 text-[8px] text-white truncate">{file.name}</p>
                          <button
                            type="button"
                            onClick={() => removeVideo(index)}
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
                    onClick={() => setIsModalOpen(false)}
                    className="py-2.5 sm:py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs sm:text-sm hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || !razorpayLoaded}
                    className={`py-2.5 sm:py-3 rounded-xl text-white font-bold text-xs sm:text-sm transition-all ${
                      (submitting || !razorpayLoaded)
                        ? 'bg-slate-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg'
                    }`}
                  >
                    {submitting ? 'Processing...' : !razorpayLoaded ? 'Loading Payment...' : `Pay ₹${totalWithGST.toFixed(2)}`}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ─── SEAT ADD/EDIT MODAL ─── */}
      {showSeatModal && (
        <div className="fixed inset-0 z-[1150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900">
                  {editingSeatIndex !== null ? 'Edit Seat' : seatBatchMode ? `Add Seat ${batchSeatNumber}` : 'Add Seat'}
                </h3>
                <button
                  onClick={() => {
                    setShowSeatModal(false);
                    setSeatInput({ name: '', number: '' });
                    setEditingSeatIndex(null);
                    setSeatBatchMode(false);
                  }}
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center text-slate-600"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Seat Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Seat A1, Desk 1, CEO Chair"
                    value={seatInput.name}
                    onChange={(e) => setSeatInput({ ...seatInput, name: e.target.value })}
                    className="w-full mt-1 px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                    autoFocus
                  />
                  {seatBatchMode && (
                    <p className="text-[10px] text-indigo-500 mt-0.5">💡 Seat {batchSeatNumber} of {formData.capacity}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Seat Number *</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 1"
                    value={seatInput.number}
                    onChange={(e) => setSeatInput({ ...seatInput, number: e.target.value })}
                    className="w-full mt-1 px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                  />
                  <p className="text-[10px] text-slate-400 mt-0.5">Each seat must have a unique number</p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => {
                      setShowSeatModal(false);
                      setSeatInput({ name: '', number: '' });
                      setEditingSeatIndex(null);
                      setSeatBatchMode(false);
                    }}
                    className="py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addSeat}
                    className="py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-colors"
                  >
                    {editingSeatIndex !== null ? 'Update' : seatBatchMode ? 'Add & Next' : 'Add'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================== */}
      {/* EDIT CABIN MODAL */}
      {/* ====================== */}
      {isEditModalOpen && editingCabin && (
        <div className="fixed inset-0 z-[1100] flex items-end sm:items-center justify-center p-2 sm:p-4 bg-slate-900/50 backdrop-blur-sm">
          <div
            className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200"
            style={{ maxHeight: "95vh" }}
          >
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-4 sm:p-5 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-white/20 flex items-center justify-center">
                  <Pencil size={18} className="text-white sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white">Edit Cabin</h2>
                  <p className="text-[10px] sm:text-xs text-white/75">Update your workspace listing</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-white/15 hover:bg-white/25 transition-colors flex items-center justify-center text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="overflow-y-auto p-4 sm:p-6 flex-1">
              <form onSubmit={handleEditSubmit} className="space-y-4">
                {/* ─── EDIT: SPACE TYPE ─── */}
                <div>
                  <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Space Type</label>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-1">
                    <button
                      type="button"
                      onClick={() => setEditFormData({...editFormData, isChamber: true})}
                      className={`py-2.5 sm:py-3 px-3 rounded-xl text-xs sm:text-sm font-semibold border-2 transition-all flex items-center justify-center gap-2 ${
                        editFormData.isChamber === true
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Stethoscope size={16} /> Medical Chamber
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditFormData({...editFormData, isChamber: false})}
                      className={`py-2.5 sm:py-3 px-3 rounded-xl text-xs sm:text-sm font-semibold border-2 transition-all flex items-center justify-center gap-2 ${
                        editFormData.isChamber === false
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Briefcase size={16} /> Co-Working Space
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Building Name</label>
                    <input
                      className="w-full mt-1 px-3 py-2.5 sm:py-3 border border-slate-200 rounded-xl text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                      type="text" name="name"
                      value={editFormData.name}
                      onChange={handleEditChange}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Address</label>
                    <input
                      className="w-full mt-1 px-3 py-2.5 sm:py-3 border border-slate-200 rounded-xl text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                      type="text" name="address"
                      value={editFormData.address}
                      onChange={handleEditChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 xs:grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Cabin Spec</label>
                    <input
                      className="w-full mt-1 px-3 py-2.5 sm:py-3 border border-slate-200 rounded-xl text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                      type="text" name="cabin"
                      value={editFormData.cabin}
                      onChange={handleEditChange}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Capacity</label>
                    <input
                      className="w-full mt-1 px-3 py-2.5 sm:py-3 border border-slate-200 rounded-xl text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                      type="number" name="capacity" min="1"
                      value={editFormData.capacity}
                      onChange={handleEditChange}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Price/hr</label>
                    <input
                      className="w-full mt-1 px-3 py-2.5 sm:py-3 border border-slate-200 rounded-xl text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                      type="number" name="price" min="0"
                      value={editFormData.price}
                      onChange={handleEditChange}
                    />
                  </div>
                </div>

                {/* Status Toggle */}
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Status</label>
                  <button
                    type="button"
                    onClick={() => setEditFormData({...editFormData, isActive: !editFormData.isActive})}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                      editFormData.isActive
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {editFormData.isActive ? 'Active' : 'Inactive'}
                  </button>
                </div>

                {/* Cabin Type */}
                <div>
                  <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Cabin Type</label>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-1">
                    <button
                      type="button"
                      onClick={() => setEditFormData({...editFormData, cabinType: "normal"})}
                      className={`py-2.5 sm:py-3 px-3 rounded-xl text-xs sm:text-sm font-semibold border-2 transition-all ${
                        editFormData.cabinType === 'normal'
                          ? 'border-amber-500 bg-amber-50 text-amber-600'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Building2 size={14} className="inline mr-1.5" />
                      Normal
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditFormData({...editFormData, cabinType: "exclusive"})}
                      className={`py-2.5 sm:py-3 px-3 rounded-xl text-xs sm:text-sm font-semibold border-2 transition-all ${
                        editFormData.cabinType === 'exclusive'
                          ? 'border-amber-500 bg-amber-50 text-amber-600'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Crown size={14} className="inline mr-1.5 text-amber-500" />
                      Exclusive
                    </button>
                  </div>
                </div>

                {/* Timings */}
                <div>
                  <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Timings</label>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-1">
                    <button
                      type="button"
                      onClick={() => setEditFormData({...editFormData, is24x7: !editFormData.is24x7})}
                      className={`py-2.5 sm:py-3 px-3 rounded-xl text-xs sm:text-sm font-semibold border-2 transition-all flex items-center justify-center gap-2 ${
                        editFormData.is24x7
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {editFormData.is24x7 ? '✅ 24x7' : '⏰ Set Hours'}
                    </button>
                    {!editFormData.is24x7 && (
                      <>
                        <div>
                          <label className="text-[8px] font-bold text-slate-400">Open</label>
                          <input
                            type="time"
                            name="openTime"
                            value={editFormData.openTime}
                            onChange={handleEditChange}
                            className="w-full mt-0.5 px-2 py-1.5 border border-slate-200 rounded-lg text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[8px] font-bold text-slate-400">Close</label>
                          <input
                            type="time"
                            name="closeTime"
                            value={editFormData.closeTime}
                            onChange={handleEditChange}
                            className="w-full mt-0.5 px-2 py-1.5 border border-slate-200 rounded-lg text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Amenities</label>
                  <div className="grid grid-cols-2 xs:grid-cols-3 gap-1.5 mt-1">
                    {ALL_AMENITIES.map(item => {
                      const isActive = editFormData.amenities[item.key] || false;
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => toggleEditAmenity(item.key)}
                          className={`flex items-center gap-1.5 p-2 rounded-lg text-[10px] sm:text-xs font-semibold border transition-all ${
                            isActive
                              ? 'border-amber-500 bg-amber-50 text-amber-600'
                              : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <Icon size={14} className={isActive ? 'text-amber-500' : 'text-gray-400'} />
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Pricing Plans */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Pricing Plans</label>
                    <button
                      type="button"
                      onClick={addEditPlan}
                      className="text-[10px] sm:text-xs font-bold text-amber-600 bg-amber-50 px-2.5 sm:px-3 py-1 rounded-lg hover:bg-amber-100 transition-colors"
                    >
                      + Add Plan
                    </button>
                  </div>
                  {editPricingPlans.length > 0 ? (
                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-1.5">
                      {editPricingPlans.map((plan, idx) => (
                        <div key={idx} className="p-2 bg-slate-50 rounded-lg text-[10px] sm:text-xs border border-slate-200 relative">
                          <div><strong>{plan.label || "Plan"}</strong></div>
                          <div>{plan.hours}h · ₹{plan.cost}</div>
                          <div className="text-slate-400">{plan.validity}d validity</div>
                          <button
                            type="button"
                            onClick={() => removeEditPlan(idx)}
                            className="absolute top-1 right-1 text-red-500 hover:text-red-700 text-xs font-bold"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[10px] sm:text-xs text-slate-400">No plans defined.</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Description</label>
                  <textarea
                    className="w-full mt-1 px-3 py-2.5 sm:py-3 border border-slate-200 rounded-xl text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all resize-none"
                    name="description"
                    value={editFormData.description}
                    onChange={handleEditChange}
                    rows={2}
                  />
                </div>

                {/* Images */}
                <div>
                  <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Photos</label>
                  
                  {existingImages.length > 0 && (
                    <div className="mt-2">
                      <p className="text-[10px] text-slate-500 mb-1">Current Images:</p>
                      <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 gap-2">
                        {existingImages.map((img, index) => (
                          <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200">
                            <img src={getImageUrl(img)} alt="existing" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removeExistingImage(index)}
                              className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-2 border-2 border-dashed border-amber-200 rounded-xl p-4 sm:p-6 text-center hover:border-amber-400 transition-colors relative">
                    <input
                      type="file" multiple accept="image/*"
                      onChange={handleEditImageChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Upload size={20} className="mx-auto text-amber-400 sm:w-6 sm:h-6" />
                    <p className="text-[10px] sm:text-xs text-slate-500 mt-1">Add new photos</p>
                  </div>

                  {editImages.length > 0 && (
                    <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 gap-2 mt-2">
                      {editImages.map((file, index) => (
                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200">
                          <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeEditImage(index)}
                            className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Videos */}
                <div>
                  <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Videos</label>
                  
                  {existingVideos.length > 0 && (
                    <div className="mt-2">
                      <p className="text-[10px] text-slate-500 mb-1">Current Videos:</p>
                      <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 gap-2">
                        {existingVideos.map((video, index) => (
                          <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 bg-slate-900 flex items-center justify-center">
                            <Video size={24} className="text-white/50" />
                            <p className="absolute bottom-1 left-1 right-1 text-[8px] text-white truncate">{video.split('/').pop()}</p>
                            <button
                              type="button"
                              onClick={() => removeExistingVideo(index)}
                              className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-2 border-2 border-dashed border-purple-200 rounded-xl p-4 sm:p-6 text-center hover:border-purple-400 transition-colors relative">
                    <input
                      type="file" multiple accept="video/*"
                      onChange={handleEditVideoChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Video size={20} className="mx-auto text-purple-400 sm:w-6 sm:h-6" />
                    <p className="text-[10px] sm:text-xs text-slate-500 mt-1">Add new videos</p>
                  </div>

                  {editVideos.length > 0 && (
                    <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 gap-2 mt-2">
                      {editVideos.map((file, index) => (
                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 bg-slate-900 flex items-center justify-center">
                          <Video size={24} className="text-white/50" />
                          <p className="absolute bottom-1 left-1 right-1 text-[8px] text-white truncate">{file.name}</p>
                          <button
                            type="button"
                            onClick={() => removeEditVideo(index)}
                            className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
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
                        : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:shadow-lg'
                    }`}
                  >
                    {submitting ? 'Updating...' : 'Update Cabin'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ─── CONFIRM PAYMENT MODAL ─── */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm sm:max-w-md rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 sm:p-6 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto">
                <CreditCard size={24} className="text-white sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-white font-bold text-base sm:text-lg mt-2">
                Confirm Cabin Registration
              </h3>
              <p className="text-white/80 text-xs sm:text-sm">
                Review details below
              </p>
            </div>

            <div className="p-4 sm:p-6">
              <div className="bg-slate-50 rounded-xl p-3 sm:p-4 space-y-2 sm:space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Cabin</span>
                  <span className="font-semibold">#{cabinCount + 1}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Type</span>
                  <span className={`font-semibold ${formData.isChamber ? 'text-emerald-600' : 'text-blue-600'}`}>
                    {formData.isChamber ? '🏥 Medical Chamber' : '💼 Co-Working Space'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Capacity</span>
                  <span className="font-semibold">{formData.capacity} {formData.isChamber ? '' : 'seats'}</span>
                </div>
                {!formData.isChamber && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Seats Added</span>
                    <span className="font-semibold">{seats.length} seats</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">Amenities</span>
                  <span className="font-semibold">{Object.values(formData.amenities).filter(v => v).length} / {ALL_AMENITIES.length}</span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between">
                  <span className="text-slate-500">Base Fee</span>
                  <span>₹{baseFee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">GST (18%)</span>
                  <span>₹{gstAmount.toFixed(2)}</span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-indigo-600">₹{totalWithGST.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-3 sm:mt-4 p-2.5 sm:p-3 bg-amber-50 rounded-lg text-[10px] sm:text-xs text-amber-700 flex items-start gap-2">
                <Receipt size={14} className="shrink-0 mt-0.5" />
                <span>Total includes 18% GST (₹{gstAmount.toFixed(2)})</span>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-3 sm:mt-4">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  disabled={paymentProcessing}
                  className="py-2.5 sm:py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs sm:text-sm hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={createCabinAndOrder}
                  disabled={submitting || !razorpayLoaded || paymentProcessing}
                  className={`py-2.5 sm:py-3 rounded-xl text-white font-bold text-xs sm:text-sm transition-all ${
                    (submitting || !razorpayLoaded || paymentProcessing)
                      ? 'bg-slate-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg'
                  }`}
                >
                  {submitting || paymentProcessing ? (
                    <Loader2 size={16} className="animate-spin mx-auto" />
                  ) : !razorpayLoaded ? (
                    "Loading..."
                  ) : (
                    `Pay ₹${totalWithGST.toFixed(2)}`
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCabins;