import axios from "axios";
import { Building2, CheckCircle, FileText, Lock, Mail, MapPin, Phone, Upload, User, Briefcase, Clipboard, ArrowRight, Eye, EyeOff } from "lucide-react";
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
    gstNumber: "",
    dmhoNumber: ""
  });

  const [files, setFiles] = useState({
    adharCard: null,
    panCard: null,
    mbbsCertificate: null,
    pmcRegistration: null,
    nmrId: null,
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("role", "doctor");
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));

    Object.keys(files).forEach((key) => {
      if (files[key]) data.append(key, files[key]);
    });

    try {
      const res = await axios.post("https://spaceapi.iryax.com/api/auth/register", data, {
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

      <div className="flex-grow flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 z-10 relative">
        <div className="max-w-[1200px] w-full bg-white/95 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/20">

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 rounded-2xl mb-4 shadow-lg shadow-indigo-500/30 transform hover:scale-105 transition-all duration-300">
              <span className="font-sans text-xl font-extrabold text-white tracking-tighter select-none">IG</span>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">IRYAX Workspace</h2>
            <p className="text-slate-500 text-sm">Join the IRYAX Workspace community</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Personal Information Section */}
              <div className="space-y-6">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 border-b border-slate-100 pb-3">
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
                  
                  {/* Password Field with Toggle */}
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock size={18} className="text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="block w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-slate-300 transition-all shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

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
                      <MapPin size={18} className="text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <textarea
                      name="address"
                      placeholder="Address"
                      required
                      rows="2"
                      className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-slate-300 transition-all shadow-sm resize-none"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Organization & Registration Section */}
              <div className="space-y-6">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Briefcase size={16} /> Organization Details
                </h3>

                <div className="space-y-4">
                  <InputField
                    icon={<Building2 size={18} />}
                    name="organizationName"
                    type="text"
                    placeholder="Organization Name"
                    value={formData.organizationName}
                    onChange={handleChange}
                  />
                  <InputField
                    icon={<FileText size={18} />}
                    name="gstNumber"
                    type="text"
                    placeholder="GST Number"
                    value={formData.gstNumber}
                    onChange={handleChange}
                  />
                  <InputField
                    icon={<Clipboard size={18} />}
                    name="dmhoNumber"
                    type="text"
                    placeholder="DMHO Registration Number"
                    value={formData.dmhoNumber}
                    onChange={handleChange}
                  />
                  
                  {/* Info Cards */}
                  <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl p-4 border border-emerald-100/50 mt-2">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                          <span className="text-xs font-bold text-emerald-600">i</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-slate-600 leading-relaxed">
                          <span className="font-semibold text-slate-700">Note:</span> GST and DMHO numbers are optional but recommended for complete verification.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documentation Section */}
              <div className="space-y-6">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Upload size={16} /> Documents (Optional)
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

            <div className="pt-6 border-t border-slate-100">
              {/* Clean Capsule Button with Blue to White Gradient */}
              <div className="flex flex-col items-center gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-10 py-3 bg-gradient-to-r from-blue-600 via-blue-500 to-white text-blue-900 font-semibold text-sm rounded-full shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 border border-blue-400/30"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-blue-700">Creating...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-white">Create Account</span>
                      <ArrowRight size={16} className="text-white" />
                    </>
                  )}
                </button>

                {/* Progress Steps */}
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-slate-400 font-medium">Personal</span>
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">Organization</span>
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">Documents</span>
                </div>

                {/* Footer */}
                <div className="flex items-center gap-6 pt-2">
                  <p className="text-sm text-slate-500">
                    Already have an account?{" "}
                    <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors">
                      Sign In
                    </Link>
                  </p>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <Lock size={13} />
                    <span>Secure</span>
                  </div>
                </div>
              </div>
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
        className: "text-slate-400 group-focus-within:text-blue-500 transition-colors"
      })}
    </div>
    <input
      {...props}
      required
      className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-slate-300 transition-all shadow-sm"
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
      <div className={`flex items-center justify-between pl-4 pr-3 py-3 bg-slate-50 border rounded-xl transition-all shadow-sm ${file ? "border-blue-500/30 bg-blue-50/20" : "border-slate-200 group-hover:border-slate-300"
        }`}>
        <div className="flex items-center gap-3 overflow-hidden">
          {file ? <CheckCircle size={18} className="text-blue-500 flex-shrink-0" /> : <Upload size={18} className="text-slate-400 flex-shrink-0" />}
          <span className={`text-sm truncate ${file ? "text-slate-900 font-medium" : "text-slate-400"}`}>
            {file ? file.name : "Choose file..."}
          </span>
        </div>
        {file && (
          <span className="flex-shrink-0 bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-lg border border-blue-500/30">
            Selected
          </span>
        )}
      </div>
    </div>
  </div>
);

export default Register;