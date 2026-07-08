import axios from "axios";
import {
  Building2,
  FileText,
  Home,
  IndianRupee,
  MapPin,
  Upload,
  Users,
  X,
  Plus,
  Clock,
  CalendarDays,
  Tag,
  Pencil,
  Trash2,
  CheckCircle,
} from "lucide-react";
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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ── Pricing Plans state ──────────────────────────────────────────────────
  const [pricingPlans, setPricingPlans] = useState([]);
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null); // null = new plan
  const [planForm, setPlanForm] = useState(EMPTY_PLAN);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Auto-calculate price per hour when monthlyCost or maxWorkingHours changes
    if (name === "monthlyCost" || name === "maxWorkingHours") {
      const monthlyCost = name === "monthlyCost" ? Number(value) : Number(formData.monthlyCost);
      const maxHours = name === "maxWorkingHours" ? Number(value) : Number(formData.maxWorkingHours);
      
      if (monthlyCost && maxHours && maxHours > 0) {
        const pricePerHour = Math.round(monthlyCost / maxHours);
        setFormData(prev => ({ ...prev, [name]: value, price: pricePerHour.toString() }));
      }
    }
  };

  const toggleAmenity = (key) =>
    setFormData((prev) => ({
      ...prev,
      amenities: { ...prev.amenities, [key]: !prev.amenities[key] },
    }));

  const handleImageChange = (e) => setImages(Array.from(e.target.files));
  const removeImage = (index) =>
    setImages(images.filter((_, i) => i !== index));

  // ── Plan form helpers ─────────────────────────────────────────────────────
  const openAddPlan = () => {
    setPlanForm(EMPTY_PLAN);
    setEditingIndex(null);
    setShowPlanForm(true);
  };

  const openEditPlan = (idx) => {
    setPlanForm({ ...pricingPlans[idx] });
    setEditingIndex(idx);
    setShowPlanForm(true);
  };

  const deletePlan = (idx) =>
    setPricingPlans((prev) => prev.filter((_, i) => i !== idx));

  const savePlan = () => {
    if (!planForm.hours || !planForm.cost || !planForm.validity) {
      toast.error("Please fill in Hours, Cost and Validity.");
      return;
    }
    const plan = {
      label: planForm.label.trim(),
      hours: Number(planForm.hours),
      cost: Number(planForm.cost),
      validity: Number(planForm.validity),
    };
    if (editingIndex !== null) {
      setPricingPlans((prev) => prev.map((p, i) => (i === editingIndex ? plan : p)));
    } else {
      setPricingPlans((prev) => [...prev, plan]);
    }
    setShowPlanForm(false);
    setPlanForm(EMPTY_PLAN);
    setEditingIndex(null);
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.price && pricingPlans.length === 0) {
      toast.error("Please specify either an Hourly Price or add at least one Pricing Plan.");
      return;
    }
    setLoading(true);

    const data = new FormData();
    data.append("name", cabinType ? `${formData.name} - ${cabinType}` : formData.name);
    data.append("description", formData.description);
    data.append("capacity", formData.capacity);
    data.append("address", formData.address);
    data.append("price", formData.price);
    data.append("amenities", JSON.stringify(formData.amenities));
    data.append("pricingPlans", JSON.stringify(pricingPlans));
    images.forEach((img) => data.append("images", img));

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in to add a cabin.");
        navigate("/login");
        return;
      }
      await axios.post("http://localhost:5000/api/cabins", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Cabin added successfully!");
      navigate("/spaces");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message || "Error adding cabin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dash">
      <UsersNavbar />

      <main className="pt-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto pb-16">
        {/* Header */}
        <div className="admin-dash__header">
          <div>
            <h1 className="admin-dash__greeting">
              Add <span>Cabin</span>
            </h1>
            <p className="admin-dash__subtitle">
              Create a new coworking space listing and share your workspace with the community.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="admin-dash__card mt-8">
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">

            {/* Name & Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Building Name</label>
                <div className="relative">
                  <Building2 size={18} className="absolute left-3 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    name="name"
                    placeholder="e.g. Executive Boardroom"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none font-medium text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Address / Location</label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-3 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    name="address"
                    placeholder="e.g. Floor 2, Tech Hub"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none font-medium text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Cabin Type & Capacity & Price */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Cabin Type</label>
                <div className="relative">
                  <Home size={18} className="absolute left-3 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={cabinType}
                    onChange={(e) => setCabinType(e.target.value)}
                    placeholder="e.g. Meeting Room"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none font-medium text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Capacity (Persons)</label>
                <div className="relative">
                  <Users size={18} className="absolute left-3 top-3.5 text-slate-400" />
                  <input
                    type="number"
                    name="capacity"
                    placeholder="e.g. 10"
                    value={formData.capacity}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none font-medium text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Monthly Cost (₹)</label>
                <div className="relative">
                  <IndianRupee size={18} className="absolute left-3 top-3.5 text-slate-400" />
                  <input
                    type="number"
                    name="monthlyCost"
                    placeholder="e.g. 20000"
                    value={formData.monthlyCost}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none font-medium text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Max Working Hours & Auto-calculated Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Max Working Hours (per month)</label>
                <div className="relative">
                  <Clock size={18} className="absolute left-3 top-3.5 text-slate-400" />
                  <input
                    type="number"
                    name="maxWorkingHours"
                    placeholder="e.g. 10"
                    value={formData.maxWorkingHours}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none font-medium text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Price per Hour (₹) <span className="text-xs text-slate-400 font-normal normal-case">(Auto-calculated)</span></label>
                <div className="relative">
                  <IndianRupee size={18} className="absolute left-3 top-3.5 text-slate-400" />
                  <input
                    type="number"
                    name="price"
                    placeholder="e.g. 2000"
                    value={formData.price}
                    onChange={handleChange}
                    readOnly
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none font-medium text-sm text-indigo-600 font-semibold"
                  />
                </div>
                {formData.monthlyCost && formData.maxWorkingHours && (
                  <p className="text-xs text-slate-500 mt-1 ml-1">
                    Calculated: ₹{formData.monthlyCost} ÷ {formData.maxWorkingHours} hrs = ₹{formData.price}/hr
                  </p>
                )}
              </div>
            </div>

            {/* ── Pricing Plans ────────────────────────────────────────────── */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
                    Pricing Plans
                  </label>
                  <p className="text-xs text-slate-400 ml-1 mt-0.5">Define one or more pricing packages for your cabin</p>
                </div>
                <button
                  type="button"
                  onClick={openAddPlan}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-500/20"
                >
                  <Plus size={14} /> Add Plan
                </button>
              </div>

              {/* Plan list */}
              {pricingPlans.length === 0 ? (
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center">
                  <IndianRupee size={28} className="mx-auto text-slate-300 mb-2" />
                  <p className="text-sm text-slate-400 font-medium">No pricing plans yet</p>
                  <p className="text-xs text-slate-300 mt-1">Click "Add Plan" to create your first pricing package</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {pricingPlans.map((plan, idx) => (
                    <div
                      key={idx}
                      className="relative bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-4 shadow-sm"
                    >
                      {/* Edit / Delete */}
                      <div className="absolute top-3 right-3 flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditPlan(idx)}
                          className="p-1.5 bg-white rounded-lg text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm border border-indigo-100"
                          title="Edit Plan"
                        >
                          <Pencil size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => deletePlan(idx)}
                          className="p-1.5 bg-white rounded-lg text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm border border-red-100"
                          title="Delete Plan"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>

                      {/* Plan label */}
                      {plan.label && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-600 text-white text-[10px] font-bold rounded-full mb-3">
                          <Tag size={9} /> {plan.label}
                        </span>
                      )}

                      {/* Stats */}
                      <div className="space-y-2 mt-1 pr-12">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                            <Clock size={12} className="text-indigo-600" />
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 font-semibold uppercase leading-none">Hours</p>
                            <p className="text-sm font-bold text-slate-800">{plan.hours} hrs</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                            <IndianRupee size={12} className="text-emerald-600" />
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 font-semibold uppercase leading-none">Cost</p>
                            <p className="text-sm font-bold text-emerald-700">₹{Number(plan.cost).toLocaleString("en-IN")}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                            <CalendarDays size={12} className="text-amber-600" />
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 font-semibold uppercase leading-none">Validity</p>
                            <p className="text-sm font-bold text-slate-800">{plan.validity} Days</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ── Inline Plan Form ─────────────────────────────────────── */}
              {showPlanForm && (
                <div className="border border-indigo-200 bg-indigo-50/60 rounded-2xl p-5 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-bold text-indigo-700">
                      {editingIndex !== null ? "Edit Plan" : "New Pricing Plan"}
                    </h4>
                    <button
                      type="button"
                      onClick={() => { setShowPlanForm(false); setPlanForm(EMPTY_PLAN); setEditingIndex(null); }}
                      className="p-1.5 rounded-lg hover:bg-indigo-100 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Label (optional) */}
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Plan Label <span className="text-slate-300 font-normal normal-case">(optional)</span></label>
                      <div className="relative">
                        <Tag size={16} className="absolute left-3 top-3 text-slate-400" />
                        <input
                          type="text"
                          placeholder="e.g. Monthly, Weekly, Starter..."
                          value={planForm.label}
                          onChange={(e) => setPlanForm({ ...planForm, label: e.target.value })}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-indigo-200 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm font-medium"
                        />
                      </div>
                    </div>

                    {/* Hours */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Hours *</label>
                      <div className="relative">
                        <Clock size={16} className="absolute left-3 top-3 text-slate-400" />
                        <input
                          type="number"
                          min="1"
                          placeholder="e.g. 30"
                          value={planForm.hours}
                          onChange={(e) => setPlanForm({ ...planForm, hours: e.target.value })}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-indigo-200 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm font-medium"
                        />
                      </div>
                    </div>

                    {/* Cost */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Cost (₹) *</label>
                      <div className="relative">
                        <IndianRupee size={16} className="absolute left-3 top-3 text-slate-400" />
                        <input
                          type="number"
                          min="0"
                          placeholder="e.g. 20000"
                          value={planForm.cost}
                          onChange={(e) => setPlanForm({ ...planForm, cost: e.target.value })}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-indigo-200 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm font-medium"
                        />
                      </div>
                    </div>

                    {/* Validity */}
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Validity (Days) *</label>
                      <div className="relative">
                        <CalendarDays size={16} className="absolute left-3 top-3 text-slate-400" />
                        <input
                          type="number"
                          min="1"
                          placeholder="e.g. 30"
                          value={planForm.validity}
                          onChange={(e) => setPlanForm({ ...planForm, validity: e.target.value })}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-indigo-200 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => { setShowPlanForm(false); setPlanForm(EMPTY_PLAN); setEditingIndex(null); }}
                      className="flex-1 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={savePlan}
                      className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={15} />
                      {editingIndex !== null ? "Save Changes" : "Add Plan"}
                    </button>
                  </div>
                </div>
              )}
            </div>
            {/* ── /Pricing Plans ────────────────────────────────────────────── */}

            {/* Amenities */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Amenities</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
                {[
                  { key: "wifi", label: "Wi-Fi" },
                  { key: "parking", label: "Parking" },
                  { key: "lockers", label: "Lockers" },
                  { key: "privateWashroom", label: "Private Washroom" },
                  { key: "secureAccess", label: "Secure Access" },
                  { key: "comfortSeating", label: "Comfort Seating" },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => toggleAmenity(item.key)}
                    className={`px-4 py-3 rounded-xl border font-medium transition-all text-sm ${formData.amenities[item.key]
                      ? "bg-indigo-600 border-indigo-600 text-white shadow-md"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                      }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Description</label>
              <div className="relative">
                <FileText size={18} className="absolute left-3 top-3.5 text-slate-400" />
                <textarea
                  name="description"
                  placeholder="Describe amenities, equipment..."
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none font-medium text-sm"
                />
              </div>
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Upload Photos</label>
              <div className="border-2 border-dashed border-indigo-200 rounded-xl p-8 text-center hover:bg-indigo-50 transition-colors cursor-pointer relative group">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center gap-2 text-slate-500 group-hover:text-indigo-600 transition-colors">
                  <div className="p-3 bg-indigo-50 rounded-full group-hover:bg-indigo-100 transition-colors">
                    <Upload size={24} className="text-indigo-600" />
                  </div>
                  <span className="text-sm font-medium">Click to upload photos</span>
                  <span className="text-xs text-slate-400">PNG, JPG up to 5MB</span>
                </div>
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 mt-4">
                  {images.map((file, index) => (
                    <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                      <img
                        src={URL.createObjectURL(file)}
                        alt="preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-xl font-bold text-sm uppercase tracking-[0.1em] shadow-lg transition-all flex items-center justify-center gap-2 ${loading
                  ? "bg-indigo-400 text-white cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-indigo-500/30"
                  }`}
              >
                {loading ? (
                  <span className="animate-pulse">Publishing Listing...</span>
                ) : (
                  <>
                    <Plus size={18} /> Add Cabin
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}

export default AddCabin;
