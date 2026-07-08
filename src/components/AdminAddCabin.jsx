import axios from "axios";
import { Building2, CheckCircle, FileText, Home, IndianRupee, MapPin, Upload, Users, X, Plus, Pencil, Trash2, Tag, Clock, CalendarDays } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AdminNavbar from "./AdminNavbar";

const EMPTY_PLAN = { label: "", hours: "", cost: "", validity: "" };

function AdminAddCabin() {
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    capacity: "",
    address: "",
    price: "",
    cabin: "",
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

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Pricing Plans state
  const [pricingPlans, setPricingPlans] = useState([]);
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null); // null = new plan
  const [planForm, setPlanForm] = useState(EMPTY_PLAN);

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

  // Handle text input
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

  const toggleAmenity = (key) => {
    setFormData((prev) => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [key]: !prev.amenities[key],
      },
    }));
  };

  // Handle multiple images
  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  // Remove selected image
  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

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
    images.forEach((img) => data.append("images", img));

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in to add a cabin.");
        navigate("/login");
        return;
      }

      // Target Coworking Backend (Port 5050)
      console.log("Submitting to: http://localhost:5000/api/cabins");

      await axios.post("http://localhost:5000/api/cabins", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          // Content-Type is incorrectly set manually in some versions, ensuring it is NOT set here so axios handles multipart/form-data boundary
        },
      });

      toast.success("Cabin added successfully!");
      navigate("/admindashboard");
    } catch (err) {
      console.error("Add Cabin Error:", err);
      const errorMsg = err.response?.data?.message || err.message || "Error adding cabin";
      toast.error(`Failed: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AdminNavbar />

      <div className="flex-grow pt-28 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            {/* Header */}
           <div className="bg-gradient-to-r from-[#1E3A8A] to-[#14B8A6] px-4 py-2 text-white">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Home size={24} /> Add New Cabin
              </h2>
              <p className="mt-1 text-indigo-100">
                Create a new coworking space listing.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6">

              {/* Name & Address */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Building Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="e.g. Executive Boardroom"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Address / Location</label>
                  <div className="relative">
                    <MapPin size={18} className="absolute left-3 top-3.5 text-gray-400" />
                    <input
                      type="text"
                      name="address"
                      placeholder="e.g. Floor 2, Tech Hub"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Capacity & Price */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Cabin Name</label>
                  <div className="relative">
                    <Building2 size={18} className="absolute left-3 top-3.5 text-gray-400" />
                    <input
                      type="text"
                      name="cabin"
                      placeholder="e.g. Meeting Room"
                      value={formData.cabin}
                      onChange={handleChange}
                      required

                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Capacity (Persons)</label>
                  <div className="relative">
                    <Users size={18} className="absolute left-3 top-3.5 text-gray-400" />
                    <input
                      type="number"
                      name="capacity"
                      placeholder="e.g. 10"
                      value={formData.capacity}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Monthly Cost (₹)</label>
                  <div className="relative">
                    <IndianRupee size={18} className="absolute left-3 top-3.5 text-gray-400" />
                    <input
                      type="number"
                      name="monthlyCost"
                      placeholder="e.g. 20000"
                      value={formData.monthlyCost}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Max Working Hours (per month)</label>
                  <div className="relative">
                    <Clock size={18} className="absolute left-3 top-3.5 text-gray-400" />
                    <input
                      type="number"
                      name="maxWorkingHours"
                      placeholder="e.g. 10"
                      value={formData.maxWorkingHours}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Price per Hour (₹) <span className="text-xs text-gray-400 font-normal">(Auto-calculated)</span></label>
                  <div className="relative">
                    <IndianRupee size={18} className="absolute left-3 top-3.5 text-gray-400" />
                    <input
                      type="number"
                      name="price"
                      placeholder="e.g. 2000"
                      value={formData.price}
                      onChange={handleChange}
                      readOnly
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-indigo-600 font-semibold"
                    />
                  </div>
                  {formData.monthlyCost && formData.maxWorkingHours && (
                    <p className="text-xs text-gray-500 mt-1">
                      Calculated: ₹{formData.monthlyCost} ÷ {formData.maxWorkingHours} hrs = ₹{formData.price}/hr
                    </p>
                  )}
                </div>
              </div>

              {/* Pricing Plans Section */}
              <div className="space-y-4 border-t border-gray-100 pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Pricing Plans</label>
                    <p className="text-xs text-gray-400 mt-0.5">Define custom pricing packages for this cabin (optional)</p>
                  </div>
                  <button
                    type="button"
                    onClick={openAddPlan}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition"
                  >
                    <Plus size={14} /> Add Plan
                  </button>
                </div>

                {/* Plans List */}
                {pricingPlans.length === 0 ? (
                  <div className="border border-dashed border-gray-200 rounded-xl p-6 text-center bg-gray-50/50">
                    <IndianRupee size={24} className="mx-auto text-gray-300 mb-2" />
                    <p className="text-xs font-medium text-gray-400">No pricing plans added yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {pricingPlans.map((plan, idx) => (
                      <div
                        key={idx}
                        className="relative bg-gradient-to-br from-indigo-50/40 to-purple-50/40 border border-indigo-100 rounded-xl p-4 shadow-sm"
                      >
                        <div className="absolute top-3 right-3 flex gap-1">
                          <button
                            type="button"
                            onClick={() => openEditPlan(idx)}
                            className="p-1 bg-white rounded border border-indigo-100 text-indigo-600 hover:bg-indigo-50"
                            title="Edit Plan"
                          >
                            <Pencil size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => deletePlan(idx)}
                            className="p-1 bg-white rounded border border-red-100 text-red-500 hover:bg-red-50"
                            title="Delete Plan"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>

                        {plan.label && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-600 text-white text-[10px] font-bold rounded-full mb-2">
                            <Tag size={9} /> {plan.label}
                          </span>
                        )}

                        <div className="space-y-1.5 text-xs text-gray-600">
                          <div className="flex items-center gap-1.5">
                            <Clock size={12} className="text-indigo-500" />
                            <span className="font-semibold text-gray-700">{plan.hours} Hours included</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <IndianRupee size={12} className="text-emerald-600" />
                            <span className="font-semibold text-emerald-700">₹{plan.cost} Cost</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <CalendarDays size={12} className="text-amber-500" />
                            <span className="font-semibold text-gray-700">{plan.validity} Days validity</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Plan Form Modal/Inline */}
                {showPlanForm && (
                  <div className="border border-indigo-200 bg-indigo-50/50 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                        {editingIndex !== null ? "Edit Pricing Plan" : "Add Pricing Plan"}
                      </h4>
                      <button
                        type="button"
                        onClick={() => { setShowPlanForm(false); setPlanForm(EMPTY_PLAN); setEditingIndex(null); }}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X size={14} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="sm:col-span-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Plan Label</label>
                        <input
                          type="text"
                          placeholder="e.g. Monthly, Weekly, Starter Plan..."
                          value={planForm.label}
                          onChange={(e) => setPlanForm({ ...planForm, label: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Hours *</label>
                        <input
                          type="number"
                          placeholder="e.g. 50"
                          value={planForm.hours}
                          onChange={(e) => setPlanForm({ ...planForm, hours: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Cost (₹) *</label>
                        <input
                          type="number"
                          placeholder="e.g. 8000"
                          value={planForm.cost}
                          onChange={(e) => setPlanForm({ ...planForm, cost: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Validity (Days) *</label>
                        <input
                          type="number"
                          placeholder="e.g. 30"
                          value={planForm.validity}
                          onChange={(e) => setPlanForm({ ...planForm, validity: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => { setShowPlanForm(false); setPlanForm(EMPTY_PLAN); setEditingIndex(null); }}
                        className="flex-1 py-1.5 text-xs font-semibold rounded border border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={savePlan}
                        className="flex-1 py-1.5 text-xs font-bold rounded bg-indigo-600 text-white hover:bg-indigo-700"
                      >
                        Save Plan
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div>
                <label className="text-sm font-medium">Amenities</label>
                <div className="grid grid-cols-2 gap-4 mt-2 md:grid-cols-3">
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
                      className={`px-4 py-3 rounded-lg border font-medium transition ${formData.amenities[item.key]
                        ? "bg-emerald-100 border-emerald-500 text-emerald-700"
                        : "border-gray-300 text-gray-600"
                        }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Description</label>
                <div className="relative">
                  <FileText size={18} className="absolute left-3 top-3.5 text-gray-400" />
                  <textarea
                    name="description"
                    placeholder="Describe amenities, equipment..."
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                  />
                </div>
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Upload Photos</label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer relative group">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center gap-2 text-gray-500 group-hover:text-indigo-600 transition-colors">
                    <Upload size={32} />
                    <span className="text-sm font-medium">Click to upload photos</span>
                  </div>
                </div>

                {/* Image Previews */}
                {images.length > 0 && (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 mt-4">
                    {images.map((file, index) => (
                      <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200">
                        <img
                          src={URL.createObjectURL(file)}
                          alt="preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 ${loading
                    ? "bg-indigo-400 text-white cursor-not-allowed"
                    : "bg-gradient-to-r from-[#22C45F] to-[#2563EB] px-4 py-2 text-white hover:from-[#22C45F] hover:to-[#2563EB] hover:shadow-xl"
                    }`}
                >
                  {loading ? (
                    <span className="animate-pulse">Adding Cabin...</span>
                  ) : (
                    <>
                      <CheckCircle size={20} /> Add Cabin Spec
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminAddCabin;
