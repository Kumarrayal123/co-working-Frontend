import React, { useState } from "react";
import axios from "axios";
import {useNavigate } from "react-router-dom";

function AdminAddCabin() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    capacity: "",
    address: "",
  });

  const [images, setImages] = useState([]);
  const navigate = useNavigate()

  // Handle text input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle multiple images
  const handleImageChange = (e) => {
    setImages(e.target.files);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("capacity", formData.capacity);
    data.append("address", formData.address);

    // append multiple images
    for (let i = 0; i < images.length; i++) {
      data.append("images", images[i]);
    }

    try {
      await axios.post("http://localhost:5000/api/cabins", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Cabin added successfully!");
      setFormData({
        name: "",
        description: "",
        capacity: "",
        address: "",
      });
      setImages([]);
      navigate("/admindashboard");
    } catch (err) {
      console.log(err);
      alert("Error adding cabin");
    }
  };

  return (
    <div className="add-cabin-main">
      <h2>Add New Cabin / Space</h2>

      <form onSubmit={handleSubmit} className="add-cabin-form">
        <input
          type="text"
          name="name"
          placeholder="Cabin Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />

        <input
          type="number"
          name="capacity"
          placeholder="Capacity"
          value={formData.capacity}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          required
        />

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
        />

        <button type="submit">Add Cabin</button>
      </form>
    </div>
  );
}

export default AdminAddCabin;