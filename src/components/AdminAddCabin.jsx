import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import { Upload, Home, MapPin, Users, FileText, CheckCircle, X, IndianRupee,Building2 } from "lucide-react";


function AdminAddCabin() {
  const token = localStorage.getItem("token");

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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle text input
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
    setLoading(true);

    const data = new FormData();
    data.append("name", `${formData.name} - ${formData.cabin}`);
    data.append("description", formData.description);
    data.append("capacity", formData.capacity);
    data.append("address", formData.address);
    data.append("price", formData.price);

     data.append("amenities", JSON.stringify(formData.amenities));
    images.forEach((image) => {
      data.append("images", image);
    });

    try {
      await axios.post("http://localhost:5000/api/cabins", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Cabin added successfully!");
      setFormData({ name: "", description: "", capacity: "", address: "", price: "" });
      setImages([]);
      navigate("/admindashboard");
    } catch (err) {
      console.error(err);
      alert("Error adding cabin. Please try again.");
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
                  <label className="text-sm font-medium text-gray-700">Price per hour (₹)</label>
                  <div className="relative">
                    <IndianRupee  size={18} className="absolute left-3 top-3.5 text-gray-400" />
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
                      className={`px-4 py-3 rounded-lg border font-medium transition ${
                        formData.amenities[item.key]
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