import axios from "axios";
import {
  Building,
  Building2,
  FileText,
  Home,
  IndianRupee,
  MapPin,
  Plus,
  Upload,
  Users,
  X,
  CheckCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UsersNavbar from "./UsersNavbar";

const MyCabin = () => {
  const [cabins, setCabins] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formLoading, setFormLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    name: "", // Building Name
    cabin: "", // Cabin Name
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

  const navigate = useNavigate();

  const fetchCabins = async () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    // 🔴 Not logged in
    if (!token || !user?._id) {
      setLoading(false);
      navigate("/login");
      return;
    }

    try {
      const res = await axios.get("http://localhost:5000/api/cabins/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const cabinsData = res.data.cabins || res.data;
      setCabins(cabinsData);
    } catch (err) {
      console.error("Failed to fetch cabins", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCabins();
  }, [navigate]);

  /* ---------------- FORM HANDLERS ---------------- */

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
    setFormLoading(true);

    const data = new FormData();
    // Combine names
    data.append("name", `${formData.name} - ${formData.cabin}`);
    data.append("description", formData.description);
    data.append("capacity", formData.capacity);
    data.append("address", formData.address);
    data.append("price", formData.price);
    data.append("amenities", JSON.stringify(formData.amenities));

    images.forEach((img) => data.append("images", img));

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/cabins", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Cabin added successfully!");
      setIsModalOpen(false);

      // Reset Form
      setFormData({
        name: "", // Building Name
        cabin: "", // Cabin Name
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
      setImages([]);

      // Refresh list
      fetchCabins();
    } catch (err) {
      console.error(err);
      alert("Error adding cabin");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <UsersNavbar />

      {/* ---------------- MODAL ---------------- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-3xl overflow-hidden border border-slate-100 my-8">

            {/* Modal Header */}
            <div className="bg-[#007A52] px-8 py-6 text-white flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Home size={24} className="text-emerald-400" /> Add New Cabin
                </h2>
                <p className="mt-1 text-slate-400 text-sm">
                  Create a new coworking space listing.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">

              {/* Name & Address */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Building Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="e.g. Executive Boardroom"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Address / Location</label>
                  <div className="relative">
                    <MapPin size={18} className="absolute left-3 top-3.5 text-slate-400" />
                    <input
                      type="text"
                      name="address"
                      placeholder="e.g. Floor 2, Tech Hub"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Capacity & Price */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Cabin Name</label>
                  <div className="relative">
                    <Building2 size={18} className="absolute left-3 top-3.5 text-slate-400" />
                    <input
                      type="text"
                      name="cabin"
                      placeholder="e.g. Meeting Room"
                      value={formData.cabin}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Capacity (Persons)</label>
                  <div className="relative">
                    <Users size={18} className="absolute left-3 top-3.5 text-slate-400" />
                    <input
                      type="number"
                      name="capacity"
                      placeholder="e.g. 10"
                      value={formData.capacity}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-slate-700">Price per month (₹)</label>
                  <div className="relative">
                    <IndianRupee size={18} className="absolute left-3 top-3.5 text-slate-400" />
                    <input
                      type="number"
                      name="price"
                      placeholder="e.g. 25000"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Amenities</label>
                <div className="grid grid-cols-2 gap-3 mt-2 md:grid-cols-3">
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
                      className={`px-3 py-2.5 rounded-xl border text-sm font-bold transition-all ${formData.amenities[item.key]
                        ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm"
                        : "border-slate-200 text-slate-500 hover:border-slate-300"
                        }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Description</label>
                <div className="relative">
                  <FileText size={18} className="absolute left-3 top-3.5 text-slate-400" />
                  <textarea
                    name="description"
                    placeholder="Describe amenities, equipment..."
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none font-medium resize-none"
                  />
                </div>
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Upload Photos</label>
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:bg-slate-50 hover:border-emerald-400 transition-colors cursor-pointer relative group">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center gap-3 text-slate-400 group-hover:text-emerald-600 transition-colors">
                    <div className="p-3 bg-white rounded-full shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                      <Upload size={24} />
                    </div>
                    <span className="text-sm font-bold">Click to upload photos</span>
                  </div>
                </div>

                {/* Image Previews */}
                {images.length > 0 && (
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 mt-4">
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
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="pt-4 flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3.5 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className={`flex-[2] py-3.5 rounded-xl font-bold text-white shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 ${formLoading
                    ? "bg-emerald-400 cursor-not-allowed"
                    : "bg-emerald-600 hover:bg-emerald-700 hover:-translate-y-1"
                    }`}
                >
                  {formLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Publishing...
                    </span>
                  ) : (
                    <>
                      <CheckCircle size={20} /> Add Cabin
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
          <div>
            <h2 className="pt-4 text-2xl font-bold text-slate-900 tracking-tight mb-2">My Cabins</h2>
            <p className="text-slate-500 font-medium text-sm">Manage your listed workspace properties.</p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#007A52] text-white text-sm font-semibold rounded-xl hover:bg-emerald-600 transition-all shadow-md active:scale-95"
          >
            <Plus size={18} />
            <span>Add New Cabin</span>
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="animate-spin h-10 w-10 border-t-4 border-emerald-600 border-r-transparent rounded-full"></div>
          </div>
        ) : cabins.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[2rem] border border-slate-100 shadow-sm max-w-xl mx-auto">
            <div className="mx-auto h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Building size={32} className="text-slate-300" />
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-1">
              No properties listed yet
            </h3>
            <p className="text-sm text-slate-500 mb-6 max-w-xs mx-auto">
              Start earning by listing your spare workspace cabins today.
            </p>

            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-bold text-sm rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
            >
              List Your First Property
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cabins.map((cabin) => (
              <div
                key={cabin._id}
                className="group bg-white rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
              >
                {/* Image */}
                <div className="h-48 overflow-hidden relative">
                  <div className="absolute inset-0 bg-slate-100 animate-pulse" />
                  <img
                    src={`http://localhost:5050/${cabin.images?.[0]}`}
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800";
                    }}
                    className="h-full w-full object-cover relative z-10 group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 right-3 z-20 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-emerald-700 shadow-sm">
                    Published
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-slate-900 leading-tight mb-1 group-hover:text-emerald-600 transition-colors">
                    {cabin.name}
                  </h3>

                  <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold mb-3">
                    <MapPin size={14} className="text-emerald-500" />
                    {cabin.address}
                  </div>

                  <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mb-6">
                    {cabin.description}
                  </p>

                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Price</p>
                      <span className="text-lg font-bold text-slate-900">
                        ₹{cabin.price || 0}<span className="text-xs font-medium text-slate-400">/mo</span>
                      </span>
                    </div>

                    <Link
                      to={`/cabin/${cabin._id}`}
                      className="h-9 px-4 rounded-lg bg-slate-50 text-slate-600 text-sm hover:bg-emerald-600 hover:text-white font-semibold flex items-center gap-2 transition-all"
                    >
                      Manage
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCabin;
