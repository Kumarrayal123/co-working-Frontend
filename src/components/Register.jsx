import axios from "axios";
import { Building2, CheckCircle, Lock, Mail, MapPin, Phone, Upload, User } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    address: "",
    organizationName: "",
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
    data.append("role", "doctor"); // Default to doctor for document verification
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));

    // Add documents if provided (optional)
    Object.keys(files).forEach((key) => {
      if (files[key]) data.append(key, files[key]);
    });

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(res.data.message);
      toast.info("Please wait for admin approval before logging in.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col relative overflow-hidden font-sans">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="flex-grow flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 z-10 relative">
        <div className="max-w-[1000px] w-full bg-white/95 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/20">

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 rounded-2xl mb-4 shadow-lg shadow-indigo-500/30 transform hover:scale-105 transition-all duration-300">
              <span className="font-sans text-xl font-extrabold text-white tracking-tighter select-none">IG</span>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Ingrain Workspace</h2>
            <p className="text-slate-500 text-sm">Join the Ingrain Workspace community</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              {/* Personal Information Section (Left Side) */}
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
                      className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 hover:border-slate-300 transition-all shadow-sm resize-none"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>
                  <InputField
                    icon={<Building2 size={18} />}
                    name="organizationName"
                    type="text"
                    placeholder="Organization Name"
                    value={formData.organizationName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Documentation Section (Right Side) */}
              <div className="space-y-6">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Upload size={16} /> Documents Verification (Optional)
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
                className="w-full flex justify-center items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-600 px-4 py-3.5 text-white font-semibold hover:from-emerald-600 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Registering...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>

              <p className="mt-8 text-slate-500 text-sm">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline transition-colors">
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
      className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 hover:border-slate-300 transition-all shadow-sm"
    />
  </div>
);

const FileInput = ({ label, name, file, onChange }) => (
  <div className="space-y-1.5">
    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">{label}</label>
    <div className="relative group">
      <input
        type="file"
        name={name}
        accept=".jpg,.jpeg,.png,.webp,.pdf"
        onChange={onChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />
      <div className={`flex items-center justify-between pl-4 pr-3 py-3 bg-slate-50 border rounded-xl transition-all shadow-sm ${file ? "border-emerald-500/30 bg-emerald-50/20" : "border-slate-200 group-hover:border-slate-300"
        }`}>
        <div className="flex items-center gap-3 overflow-hidden">
          {file ? <CheckCircle size={18} className="text-emerald-500 flex-shrink-0" /> : <Upload size={18} className="text-slate-400 flex-shrink-0" />}
          <span className={`text-sm truncate ${file ? "text-slate-900 font-medium" : "text-slate-400"}`}>
            {file ? file.name : "Choose file... (Optional)"}
          </span>
        </div>
        {file && (
          <span className="flex-shrink-0 bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-lg border border-emerald-500/30">
            Selected
          </span>
        )}
      </div>
    </div>
  </div>
);

export default Register;
