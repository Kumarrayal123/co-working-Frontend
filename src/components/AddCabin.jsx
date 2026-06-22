import axios from "axios";
import { Building2, CheckCircle, FileText, Home, IndianRupee, MapPin, Upload, Users, X, Building2 as BuildingIcon, Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AdminNavbar from "./AdminNavbar";
import "./Dashboard.css";

function AddCabin() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    capacity: "",
    address: "",
    price: "",
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

  // Handle text inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Toggle amenities
  const toggleAmenity = (key) => {
    setFormData((prev) => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [key]: !prev.amenities[key],
      },
    }));
  };

  // Handle images
  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  // Remove selected image
  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("name", cabinType ? `${formData.name} - ${cabinType}` : formData.name);
    data.append("description", formData.description);
    data.append("capacity", formData.capacity);
    data.append("address", formData.address);
    data.append("price", formData.price);

    // Send amenities correctly
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
      await axios.post("http://localhost:5000/api/cabins", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Cabin added successfully!");
      navigate("/spaces");
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || err.message || "Error adding cabin";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dash">
      <AdminNavbar />

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

              {/* Capacity & Price */}
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
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Price per hour (₹)</label>
                  <div className="relative">
                    <IndianRupee size={18} className="absolute left-3 top-3.5 text-slate-400" />
                    <input
                      type="number"
                      name="price"
                      placeholder="e.g. 25000"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none font-medium text-sm"
                    />
                  </div>
                </div>
              </div>
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
                      className={`px-4 py-3 rounded-xl border font-medium transition-all ${formData.amenities[item.key]
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

                {/* Image Previews */}
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
