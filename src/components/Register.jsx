// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";


// function Register() {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     mobile: "",
//     address: "",
//   });

//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post("http://localhost:5000/api/auth/register", formData);
//       alert(res.data.message);
//       navigate("/login");
//     } catch (err) {
//       alert(err.response.data.message);
//     }
//   };

//   return (
//     <div className="page-wrapper">
//       <div className="register-container">
//         <h2>Register</h2>
//         <form onSubmit={handleSubmit}>
//           <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
//           <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
//           <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
//           <input type="text" name="mobile" placeholder="Mobile" onChange={handleChange} required />
//           <input type="text" name="address" placeholder="Address" onChange={handleChange} required />
//           <button type="submit">Register</button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default Register;




import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, Phone, MapPin, Upload, FileText, CheckCircle } from "lucide-react";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    address: "",
  });

  const [files, setFiles] = useState({
    adharCard: null,
    panCard: null,
    mbbsCertificate: null,
    pmcRegistration: null,
    nmrId: null,
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    Object.keys(files).forEach((key) => data.append(key, files[key]));

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert(res.data.message);
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const FileInput = ({ label, name, file }) => (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <input
          type="file"
          name={name}
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          required
        />
        <div className={`flex items-center justify-between p-3 border rounded-lg transition-colors ${file ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}>
          <div className="flex items-center gap-2 text-gray-600">
            {file ? <CheckCircle size={18} className="text-emerald-500" /> : <Upload size={18} />}
            <span className={`text-sm ${file ? 'text-emerald-700 font-medium' : 'text-gray-500'}`}>
              {file ? file.name : "Choose file..."}
            </span>
          </div>
          {file && <span className="text-xs text-emerald-600 bg-emerald-100 px-2 py-1 rounded">Uploaded</span>}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center">
          {/* Logo placeholder - replace with actual logo later */}
          <div className="mx-auto h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
            <User size={24} className="text-emerald-600" />
          </div>

          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Create Account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Join our co-working community today
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>

          <div className="space-y-4">
            {/* Name */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                onChange={handleChange}
                required
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                onChange={handleChange}
                required
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                required
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
              />
            </div>

            {/* Mobile */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                name="mobile"
                placeholder="Mobile Number"
                onChange={handleChange}
                required
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
              />
            </div>

            {/* Address */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                name="address"
                placeholder="Address"
                onChange={handleChange}
                required
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
              />
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4 space-y-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Required Documents</p>
            <FileInput label="Aadhar Card" name="adharCard" file={files.adharCard} />
            <FileInput label="PAN Card" name="panCard" file={files.panCard} />
            <FileInput label="MBBS Certificate" name="mbbsCertificate" file={files.mbbsCertificate} />
            <FileInput label="PMC Registration" name="pmcRegistration" file={files.pmcRegistration} />
            <FileInput label="NMR ID" name="nmrId" file={files.nmrId} />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white ${loading ? 'bg-emerald-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors shadow-lg shadow-emerald-200`}
          >
            {loading ? "Registering..." : "Create Account"}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;

