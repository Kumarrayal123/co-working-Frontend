import axios from "axios";
import { CheckCircle, Lock, Mail, MapPin, Phone, Upload, User, LogIn } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UsersNavbar from "./UsersNavbar";

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
    Object.keys(files).forEach((key) => {
      if (files[key]) data.append(key, files[key]);
    });

    try {
      const res = await axios.post("http://localhost:5050/api/auth/register", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert(res.data.message);
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden font-sans">
      <UsersNavbar />

      {/* Decorative background Elements (Matched from Login) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-emerald-500/5 blur-3xl"></div>
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] rounded-full bg-indigo-500/5 blur-3xl"></div>
      </div>

      <div className="flex-grow flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 z-10 relative">
        <div className="max-w-[900px] w-full bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-slate-100">

          <div className="text-center mb-12">
            <div className="mx-auto h-14 w-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-5 shadow-sm rotate-3 transform hover:rotate-6 transition-transform">
              <User size={26} className="text-emerald-600" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create Account</h2>
            <p className="mt-3 text-slate-500 text-base">Register your medical professional profile</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-12">

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

              {/* Profile Section */}
              <div className="space-y-6">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <User size={16} /> Personal Information
                </h3>

                <div className="space-y-4">
                  <InputField
                    icon={<User size={18} />}
                    name="name"
                    type="text"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  <InputField
                    icon={<Mail size={18} />}
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <InputField
                    icon={<Lock size={18} />}
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <InputField
                    icon={<Phone size={18} />}
                    name="mobile"
                    type="text"
                    placeholder="Mobile Number"
                    value={formData.mobile}
                    onChange={handleChange}
                  />
                  <div className="relative group">
                    <div className="absolute top-3.5 left-0 pl-4 flex items-center pointer-events-none">
                      <MapPin size={18} className="text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                    </div>
                    <textarea
                      name="address"
                      placeholder="Address"
                      required
                      rows="3"
                      className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm resize-none"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Documentation Section */}
              <div className="space-y-6">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Upload size={16} /> Documents Verification
                </h3>

                <div className="space-y-4">
                  <FileInput label="Aadhar Card" name="adharCard" file={files.adharCard} onChange={handleFileChange} />
                  <FileInput label="PAN Card" name="panCard" file={files.panCard} onChange={handleFileChange} />
                  <FileInput label="MBBS Certificate" name="mbbsCertificate" file={files.mbbsCertificate} onChange={handleFileChange} />
                  <FileInput label="PMC Registration" name="pmcRegistration" file={files.pmcRegistration} onChange={handleFileChange} />
                  <FileInput label="NMR ID Card" name="nmrId" file={files.nmrId} onChange={handleFileChange} />
                </div>
              </div>

            </div>

            <div className="pt-6 border-t border-slate-100 text-center">
              <button
                type="submit"
                disabled={loading}
                className={`w-full max-w-md mx-auto flex justify-center py-3.5 px-4 border border-transparent text-base font-semibold rounded-xl text-white ${loading ? 'bg-emerald-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 hover:scale-[1.02] active:scale-[0.98]'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all shadow-lg shadow-emerald-500/20`}
              >
                {loading ? "Registering..." : "Sign Up"}
              </button>

              <p className="mt-8 text-slate-500 text-sm">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline transition-colors">
                  Sign In
                </Link>
              </p>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

/* Simplified InputField (Matched from Login) */
const InputField = ({ icon, ...props }) => (
  <div className="relative group">
    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
      {React.cloneElement(icon, {
        className: "text-slate-400 group-focus-within:text-emerald-500 transition-colors"
      })}
    </div>
    <input
      {...props}
      required
      className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
    />
  </div>
);

/* Simplified FileInput */
const FileInput = ({ label, name, file, onChange }) => (
  <div className="space-y-1">
    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">{label}</label>
    <div className="relative group">
      <input
        type="file"
        name={name}
        accept=".jpg,.jpeg,.png,.webp,.pdf"
        onChange={onChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        required
      />
      <div className={`flex items-center justify-between pl-4 pr-3 py-3 bg-slate-50 border rounded-xl transition-all shadow-sm ${file ? "border-emerald-500/30 bg-emerald-50/20" : "border-slate-200 group-hover:border-slate-300"
        }`}>
        <div className="flex items-center gap-3 overflow-hidden">
          {file ? <CheckCircle size={18} className="text-emerald-500 flex-shrink-0" /> : <Upload size={18} className="text-slate-400 flex-shrink-0" />}
          <span className={`text-sm truncate ${file ? "text-slate-900 font-medium" : "text-slate-400"}`}>
            {file ? file.name : "Choose file..."}
          </span>
        </div>
        {file && (
          <span className="flex-shrink-0 bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-lg">
            Selected
          </span>
        )}
      </div>
    </div>
  </div>
);

export default Register;
