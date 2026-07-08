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
  Building2 as BuildingIcon
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AdminNavbar from "./AdminNavbar";
import "./Dashboard.css";
const API_URL = "http://localhost:5000";
const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000";


const AdminCabins = () => {
  const [cabins, setCabins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [pricingPlans, setPricingPlans] = useState([]);
  const navigate = useNavigate();

  // Add Cabin Form State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    capacity: "",
    address: "",
    price: "",
    cabin: "",
    amenities: {
      wifi: false,
      parking: false,
      lockers: false,
      privateWashroom: false,
      secureAccess: false,
      comfortSeating: false,
    },
  });
  const [images, setImages] = useState([]);

  const fetchCabins = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/cabins`);

      const data = res.data.cabins || res.data;
      const allCabins = Array.isArray(data) ? data : [];

      // Filter to show only admin's cabins (admin ID: 68ebe9ee8f06d33ee022d665)
      const adminCabins = allCabins.filter(cabin =>
        cabin.owner === "68ebe9ee8f06d33ee022d665"
      );

      setCabins(adminCabins);
    } catch (err) {
      console.error("Error fetching cabins:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCabins();
  }, []);

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this cabin?")) return;

    try {
      await axios.delete(`${API_URL}/api/cabins/${id}`);
      setCabins(cabins.filter(c => c._id !== id));
      toast.success("Cabin deleted successfully");
    } catch (error) {
      console.error("Error deleting cabin", error);
      toast.error("Failed to delete cabin");
    }
  }

  // Form Handlers
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const data = new FormData();
    data.append("name", formData.cabin ? `${formData.name} - ${formData.cabin}` : formData.name);
    data.append("description", formData.description);
    data.append("capacity", formData.capacity);
    data.append("address", formData.address);
    data.append("price", formData.price);
    data.append("pricingPlans", JSON.stringify(pricingPlans));
    data.append("amenities", JSON.stringify(formData.amenities));
    images.forEach((img) => data.append("images", img));

    try {
      await axios.post(`${API_URL}/api/cabins`, data);

      toast.success("Cabin added successfully!");
      setIsModalOpen(false);
      // Reset Form
      setFormData({
        name: "",
        description: "",
        capacity: "",
        address: "",
        price: "",
        cabin: "",
        amenities: {
          wifi: false,
          parking: false,
          lockers: false,
          privateWashroom: false,
          secureAccess: false,
          comfortSeating: false,
        },
      });
      setImages([]);
      setPricingPlans([]);
      fetchCabins();
    } catch (err) {
      console.error("Add Cabin Error:", err);
      toast.error("Failed to add cabin");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCabins = cabins.filter(cabin =>
    cabin.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cabin.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-dash">
      <AdminNavbar />

      <main className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="admin-dash__header">
          <div>
            <h1 className="admin-dash__greeting">
              My <span>Cabins</span>
            </h1>
            <p className="admin-dash__subtitle">
              Manage your workspace listings and properties.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search cabins..."
                className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all w-full sm:w-56"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => navigate("/adminbookings")}
              className="flex items-center justify-center gap-2 px-3 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors flex-1 sm:flex-none"
            >
              <FileText size={16} className="text-indigo-600" />
              <span className="hidden xs:inline">View Bookings</span>
              <span className="xs:hidden"> Cabin Bookings</span>
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2 px-3 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors flex-1 sm:flex-none"
            >
              <Plus size={16} />
              Add Cabin
            </button>
          </div>
        </div>

        {loading ? (
          <div className="admin-dash__loading">
            <div className="admin-dash__spinner" />
            <p className="admin-dash__loading-text">Loading cabins...</p>
          </div>
        ) : filteredCabins.length === 0 ? (
          <div className="admin-dash__error" style={{ background: '#f8fafc', borderColor: '#e2e8f0' }}>
            <BuildingIcon size={48} className="text-slate-300 mb-4" />
            <p className="admin-dash__error-title" style={{ color: '#475569' }}>No cabins found</p>
            <p className="admin-dash__error-message">Add your first workspace to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCabins.map((cabin) => (
              <div
                key={cabin._id}
                onClick={() => navigate(`/cabin/${cabin._id}`)}
                className="admin-dash__card group cursor-pointer flex flex-col h-full relative"
              >
                {/* Image Section */}
                <div className="relative h-48 overflow-hidden rounded-t-2xl">
                  <div className="absolute inset-0 bg-slate-200 animate-pulse" />
                  <img
                    src={cabin.images?.[0] ? `${API_URL}/${cabin.images[0].replace(/\\/g, "/")}` : PLACEHOLDER_IMAGE}
                    alt={cabin.name}
                    className="w-full h-full object-cover relative z-10 group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = PLACEHOLDER_IMAGE;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent z-20 opacity-40" />

                  {/* Actions Layer */}
                  <div className="absolute top-3 left-3 z-30 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-indigo-700 shadow-sm flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                    Available
                  </div>

                  <div className="absolute top-3 right-3 z-30">
                    <button
                      onClick={(e) => handleDelete(e, cabin._id)}
                      className="p-2.5 bg-white/90 backdrop-blur-sm text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-colors shadow-sm"
                      title="Delete Cabin"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5 flex flex-col flex-grow">
                  <div className="mb-4">
                    <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-1">Coworking Space</p>
                    <h3 className="text-base font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {cabin.name}
                    </h3>
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

                    <div className="h-10 w-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors"
                      onClick={(e) => handleDelete(e, cabin._id)}>
                      <Trash2 size={16} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Add Cabin Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1100] flex items-end justify-center p-4 pb-8 bg-slate-900/50 backdrop-blur-sm">
          <div
            className="bg-white w-full max-w-3xl rounded-t-2xl shadow-2xl overflow-hidden flex flex-col"
            style={{
              maxHeight: "80vh",
              animation: "cabinModalIn 220ms cubic-bezier(0.34,1.3,0.64,1) forwards",
            }}
          >
            <style>{`
              @keyframes cabinModalIn {
                from { opacity:0; transform:scale(0.94) translateY(16px); }
                to   { opacity:1; transform:scale(1)   translateY(0); }
              }
              .cabin-field {
                width:100%; padding:0.65rem 0.875rem;
                border:1.5px solid #e2e8f0; border-radius:10px;
                font-size:0.875rem; font-family:inherit; color:#1e293b;
                outline:none; transition:border-color 180ms, box-shadow 180ms;
                background:#fff; box-sizing:border-box;
              }
              .cabin-field:focus {
                border-color:#6366f1;
                box-shadow:0 0 0 3px rgba(99,102,241,0.12);
              }
              .cabin-field-icon { position:relative; }
              .cabin-field-icon svg {
                position:absolute; left:12px; top:50%;
                transform:translateY(-50%); color:#94a3b8; pointer-events:none;
              }
              .cabin-field-icon .cabin-field { padding-left:2.5rem; }
              .cabin-amenity {
                display:flex; align-items:center; gap:8px;
                padding:0.5rem 0.875rem; border-radius:10px;
                border:1.5px solid #e2e8f0; background:#fff;
                font-size:0.8rem; font-weight:600; color:#64748b;
                cursor:pointer; transition:all 180ms; user-select:none;
              }
              .cabin-amenity.active {
                border-color:#6366f1; background:rgba(99,102,241,0.07);
                color:#4f46e5;
              }
              .cabin-amenity .dot {
                width:8px; height:8px; border-radius:50%;
                border:2px solid #cbd5e1; flex-shrink:0; transition:all 180ms;
              }
              .cabin-amenity.active .dot {
                border-color:#6366f1; background:#6366f1;
                box-shadow:0 0 0 3px rgba(99,102,241,0.2);
              }
              .cabin-label {
                display:block; font-size:0.7rem; font-weight:700;
                letter-spacing:0.06em; text-transform:uppercase;
                color:#64748b; margin-bottom:6px;
              }
              .cabin-form-row-2 {
                display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1rem;
              }
              .cabin-form-row-3 {
                display:grid; grid-template-columns:1fr 1fr 1fr; gap:1rem; margin-bottom:1rem;
              }
              .cabin-amenities-grid {
                display:grid; grid-template-columns:repeat(3,1fr); gap:0.5rem;
              }
              @media (max-width: 600px) {
                .cabin-form-row-2, .cabin-form-row-3 {
                  grid-template-columns:1fr;
                }
                .cabin-amenities-grid {
                  grid-template-columns:repeat(2,1fr);
                }
              }
            `}</style>

            {/* ── Modal Header ── */}
            <div style={{
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 60%, #06b6d4 100%)",
              padding: "1.25rem 1.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Home size={22} color="#fff" />
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>
                    Add New Cabin
                  </h2>
                  <p style={{ margin: 0, fontSize: "0.75rem", color: "rgba(255,255,255,0.75)", marginTop: 2 }}>
                    Create a new workspace listing for Ingarin
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: "rgba(255,255,255,0.15)", border: "none",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", color: "#fff", transition: "background 150ms",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.25)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
              >
                <X size={20} />
              </button>
            </div>

            {/* ── Modal Body ── */}
            <div style={{ overflowY: "auto", padding: "1.5rem", flex: 1 }} className="custom-scrollbar">
              <form onSubmit={handleSubmit}>
                {/* ── Row 1: Building Name + Address ── */}
                <div className="cabin-form-row-2">
                  <div>
                    <label className="cabin-label">Building Name</label>
                    <input
                      className="cabin-field"
                      type="text" name="name"
                      placeholder="e.g. Tech Hub Alpha"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="cabin-label">Address / Location</label>
                    <div className="cabin-field-icon">
                      <MapPin size={16} />
                      <input
                        className="cabin-field"
                        type="text" name="address"
                        placeholder="e.g. Floor 4, Suite 10, Bangalore"
                        value={formData.address}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* ── Row 2: Cabin Spec + Capacity + Price ── */}
                <div className="cabin-form-row-3">
                  <div>
                    <label className="cabin-label">Cabin Spec</label>
                    <div className="cabin-field-icon">
                      <Building2 size={16} />
                      <input
                        className="cabin-field"
                        type="text" name="cabin"
                        placeholder="e.g. Private Office B"
                        value={formData.cabin}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="cabin-label">Capacity (Seats)</label>
                    <div className="cabin-field-icon">
                      <Users size={16} />
                      <input
                        className="cabin-field"
                        type="number" name="capacity" min="1"
                        placeholder="e.g. 10"
                        value={formData.capacity}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="cabin-label">Price / Hour (₹)</label>
                    <div className="cabin-field-icon">
                      <IndianRupee size={16} />
                      <input
                        className="cabin-field"
                        type="number" name="price" min="0"
                        placeholder="e.g. 25000"
                        value={formData.price}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* ── Pricing Plans Section ── */}
                <div style={{ marginBottom: "1rem", borderTop: "1.5px solid #f1f5f9", paddingTop: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                    <label className="cabin-label" style={{ margin: 0 }}>Pricing Plans (Packages)</label>
                    <button
                      type="button"
                      onClick={() => {
                        const label = prompt("Plan Label (e.g. Monthly Plan, Weekly Plan):");
                        const hours = prompt("Included Hours (e.g. 50):");
                        const cost = prompt("Cost (e.g. 8000):");
                        const validity = prompt("Validity in Days (e.g. 30):");
                        if (hours && cost && validity) {
                          setPricingPlans([...pricingPlans, {
                            label: (label || "").trim(),
                            hours: Number(hours),
                            cost: Number(cost),
                            validity: Number(validity)
                          }]);
                        }
                      }}
                      style={{
                        padding: "0.25rem 0.65rem", borderRadius: 8, border: "1.5px solid #6366f1",
                        fontSize: "0.75rem", cursor: "pointer", background: "rgba(99,102,241,0.07)",
                        color: "#4f46e5", fontWeight: "bold"
                      }}
                    >
                      + Add Plan
                    </button>
                  </div>
                  {pricingPlans.length > 0 ? (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                      {pricingPlans.map((plan, idx) => (
                        <div key={idx} style={{ padding: "0.65rem", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: "0.75rem", background: "#f8fafc", position: "relative" }}>
                          <div><strong>{plan.label || "Plan"}</strong></div>
                          <div>Hours: {plan.hours} hrs | Price: ₹{plan.cost}</div>
                          <div>Validity: {plan.validity} Days</div>
                          <button
                            type="button"
                            onClick={() => setPricingPlans(pricingPlans.filter((_, i) => i !== idx))}
                            style={{ position: "absolute", top: 4, right: 4, border: "none", background: "none", color: "#ef4444", cursor: "pointer", fontSize: "1rem", fontWeight: "bold" }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ margin: 0, fontSize: "0.75rem", color: "#94a3b8" }}>No plans defined. Cabin will only support hourly booking.</p>
                  )}
                </div>

                {/* ── Amenities ── */}
                <div style={{ marginBottom: "1rem" }}>
                  <label className="cabin-label">Included Amenities</label>
                  <div className="cabin-amenities-grid">
                    {[
                      { key: "wifi",            label: "Wi-Fi",            emoji: "📶" },
                      { key: "parking",         label: "Parking",          emoji: "🅿️" },
                      { key: "lockers",         label: "Lockers",          emoji: "🔐" },
                      { key: "privateWashroom", label: "Private Washroom", emoji: "🚿" },
                      { key: "secureAccess",    label: "Secure Access",    emoji: "🛡️" },
                      { key: "comfortSeating",  label: "Comfort Seating",  emoji: "🪑" },
                    ].map(item => (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => toggleAmenity(item.key)}
                        className={`cabin-amenity${formData.amenities[item.key] ? " active" : ""}`}
                      >
                        <span className="dot" />
                        <span style={{ fontSize: "1rem" }}>{item.emoji}</span>
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ── Description ── */}
                <div style={{ marginBottom: "1rem" }}>
                  <label className="cabin-label">Space Description</label>
                  <div className="cabin-field-icon" style={{ alignItems: "flex-start" }}>
                    <FileText size={16} style={{ top: "14px" }} />
                    <textarea
                      className="cabin-field"
                      name="description"
                      placeholder="Describe this workspace — layout, vibe, special features…"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      style={{ resize: "vertical", paddingTop: "0.65rem" }}
                    />
                  </div>
                </div>

                {/* ── Photo Upload ── */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <label className="cabin-label">Photo Gallery</label>
                  <div style={{
                    border: "2px dashed #c7d2fe", borderRadius: 14,
                    padding: "1.5rem", textAlign: "center",
                    background: "rgba(99,102,241,0.03)",
                    cursor: "pointer", position: "relative",
                    transition: "border-color 180ms, background 180ms",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#6366f1"; e.currentTarget.style.background = "rgba(99,102,241,0.06)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#c7d2fe"; e.currentTarget.style.background = "rgba(99,102,241,0.03)"; }}
                  >
                    <input
                      type="file" multiple accept="image/*"
                      onChange={handleImageChange}
                      style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", width: "100%", height: "100%" }}
                    />
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, pointerEvents: "none" }}>
                      <div style={{
                        width: 48, height: 48, borderRadius: 12,
                        background: "rgba(99,102,241,0.1)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <Upload size={22} color="#6366f1" />
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 600, color: "#4f46e5" }}>
                          Click to upload photos
                        </p>
                        <p style={{ margin: "2px 0 0", fontSize: "0.72rem", color: "#94a3b8" }}>
                          PNG, JPG, WEBP — multiple files allowed
                        </p>
                      </div>
                    </div>
                  </div>

                  {images.length > 0 && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "0.5rem", marginTop: "0.75rem" }}>
                      {images.map((file, index) => (
                        <div key={index} style={{
                          position: "relative", aspectRatio: "1",
                          borderRadius: 10, overflow: "hidden",
                          border: "1.5px solid #e2e8f0",
                          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                        }}>
                          <img src={URL.createObjectURL(file)} alt="preview"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            style={{
                              position: "absolute", top: 4, right: 4,
                              width: 20, height: 20, borderRadius: "50%",
                              background: "#ef4444", border: "none",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              cursor: "pointer", color: "#fff",
                              boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
                            }}
                          >
                            <X size={11} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* ── Action Buttons ── */}
                <div style={{ display: "flex", gap: "0.75rem", borderTop: "1px solid #f1f5f9", paddingTop: "1.25rem" }}>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    style={{
                      flex: 1, padding: "0.75rem",
                      borderRadius: 10, border: "1.5px solid #e2e8f0",
                      background: "#fff", fontFamily: "inherit",
                      fontSize: "0.875rem", fontWeight: 600, color: "#64748b",
                      cursor: "pointer", transition: "all 160ms",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.borderColor = "#cbd5e1"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#e2e8f0"; }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      flex: 2, padding: "0.75rem",
                      borderRadius: 10, border: "none",
                      background: submitting
                        ? "#a5b4fc"
                        : "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                      color: "#fff", fontFamily: "inherit",
                      fontSize: "0.875rem", fontWeight: 700,
                      cursor: submitting ? "not-allowed" : "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      boxShadow: submitting ? "none" : "0 4px 14px rgba(99,102,241,0.35)",
                      transition: "all 160ms",
                    }}
                  >
                    {submitting ? (
                      <>
                        <span style={{
                          width: 16, height: 16, borderRadius: "50%",
                          border: "2px solid rgba(255,255,255,0.4)",
                          borderTopColor: "#fff",
                          animation: "spin 0.7s linear infinite",
                          display: "inline-block",
                        }} />
                        Saving…
                      </>
                    ) : (
                      <><CheckCircle size={17} /> Confirm &amp; Add Cabin</>
                    )}
                  </button>
                </div>
                <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminCabins;
