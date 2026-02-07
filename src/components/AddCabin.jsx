import axios from "axios";
import { FileText, Home, MapPin, Users, IndianRupee, Upload, CheckCircle, X, Building2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UsersNavbar from "./UsersNavbar";
import { toast } from "react-toastify";

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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <UsersNavbar />

      <div className="flex-grow pt-28 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            {/* Header */}
            <div className="bg-indigo-600 px-8 py-6 text-white">
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
                  <label className="text-sm font-medium text-gray-700">Cabin Type</label>
                  <div className="relative">
                    <Building2 size={18} className="absolute left-3 top-3.5 text-gray-400" />
                    <input
                      type="text"
                      value={cabinType}
                      onChange={(e) => setCabinType(e.target.value)}
                      placeholder="e.g. Meeting Room"
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
                  <label className="text-sm font-medium text-gray-700">Price per hour (₹)</label>
                  <div className="relative">
                    <IndianRupee size={18} className="absolute left-3 top-3.5 text-gray-400" />
                    <input
                      type="number"
                      name="price"
                      placeholder="e.g. 25000"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                    />
                  </div>
                </div>
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
                    : "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-300 transform hover:-translate-y-1"
                    }`}
                >
                  {loading ? (
                    <span className="animate-pulse">Publishing Listing...</span>
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
      </div>
    </div>
  );
}

export default AddCabin;
