import axios from "axios";
import { Building2, FileText, Home, IndianRupee, MapPin, Upload, Users, X, Plus, Clock, CalendarDays, Tag, Pencil, Trash2, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import UsersNavbar from "./UsersNavbar";
import "./Dashboard.css";

const EMPTY_PLAN = { label: "", hours: "", cost: "", validity: "" };

function AddCabin() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    capacity: "",
    address: "",
    price: "",
    monthlyCost: "",
    maxWorkingHours: "",
    operatingHours: "",
    amenities: {
      wifi: false,
      parking: false,
      lockers: false,
      privateWashroom: false,
      secureAccess: false,
      comfortSeating: false,
    },
  });

  const [cabinType, setCabinType] = useState("");
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openTime, setOpenTime] = useState('09:00');
  const [closeTime, setCloseTime] = useState('21:00');
  const [pricingPlans, setPricingPlans] = useState([]);
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [planForm, setPlanForm] = useState(EMPTY_PLAN);
  const [editingIndex, setEditingIndex] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "monthlyCost" || name === "maxWorkingHours") {
      const monthlyCost = name === "monthlyCost" ? Number(value) : Number(formData.monthlyCost);
      const maxHours = name === "maxWorkingHours" ? Number(value) : Number(formData.maxWorkingHours);
      if (monthlyCost && maxHours && maxHours > 0) {
        const pricePerHour = Math.round(monthlyCost / maxHours);
        setFormData((prev) => ({ ...prev, price: pricePerHour.toString() }));
      }
    }
  };

  const toggleAmenity = (key) =>
    setFormData((prev) => ({
      ...prev,
      amenities: { ...prev.amenities, [key]: !prev.amenities[key] },
    }));

  const handleImageChange = (e) => setImages(Array.from(e.target.files));
  const removeImage = (index) => setImages(images.filter((_, i) => i !== index));
  const handleVideoChange = (e) => setVideos(Array.from(e.target.files));
  const removeVideo = (index) => setVideos(videos.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.price && pricingPlans.length === 0) {
      toast.error("Please specify either an Hourly Price or add at least one Pricing Plan.");
      return;
    }
    setLoading(true);
    const data = new FormData();
    data.append("name", formData.cabin ? `${formData.name} - ${formData.cabin}` : formData.name);
    data.append("description", formData.description);
    data.append("capacity", formData.capacity);
    data.append("address", formData.address);
    data.append("price", formData.price);
    data.append("pricingPlans", JSON.stringify(pricingPlans));
    data.append("amenities", JSON.stringify(formData.amenities));
    data.append("operatingHours", formData.operatingHours);
    data.append("openTime", openTime);
    data.append("closeTime", closeTime);
    images.forEach((img) => data.append("images", img));
    videos.forEach((vid) => data.append("videos", vid));

    try {
      const token = localStorage.getItem("token");
      const isAdminUser = localStorage.getItem("admin") !== null;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await axios.post("https://spaceapi.iryax.com/api/cabins", data, { headers });
      toast.success("Cabin added successfully!");
      navigate("/admindashboard");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add cabin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <UsersNavbar />
      <h1 className="text-3xl font-bold mb-4">Add Cabin</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow-md max-w-2xl">
        <input type="text" name="name" placeholder="Cabin Name" value={formData.name} onChange={handleChange} className="input" required />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="input" />
        <input type="number" name="capacity" placeholder="Capacity" value={formData.capacity} onChange={handleChange} className="input" />
        <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} className="input" />
        <input type="number" name="price" placeholder="Hourly Price" value={formData.price} onChange={handleChange} className="input" />
        <input type="number" name="monthlyCost" placeholder="Monthly Cost" value={formData.monthlyCost} onChange={handleChange} className="input" />
        <input type="number" name="maxWorkingHours" placeholder="Max Working Hours" value={formData.maxWorkingHours} onChange={handleChange} className="input" />
        <input type="text" name="operatingHours" placeholder="Operating Hours" value={formData.operatingHours} onChange={handleChange} className="input" />
        <label className="block"><span>Open Time</span><input type="time" value={openTime} onChange={(e) => setOpenTime(e.target.value)} className="input" /></label>
        <label className="block"><span>Close Time</span><input type="time" value={closeTime} onChange={(e) => setCloseTime(e.target.value)} className="input" /></label>
        <label className="block"><span>Images</span><input type="file" multiple accept="image/*" onChange={handleImageChange} className="input" /></label>
        <label className="block"><span>Videos (Optional)</span><input type="file" multiple accept="video/*" onChange={handleVideoChange} className="input" /></label>
        <button type="submit" disabled={loading} className={`w-full py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition ${loading ? "opacity-50" : ""}`}>
          {loading ? "Publishing..." : <><Plus size={18} /> Add Cabin</>}
        </button>
      </form>
    </div>
  );
}

export default AddCabin;
