import axios from "axios";
import { 
  Building2, 
  CheckCircle, 
  FileText, 
  Lock, 
  Mail, 
  MapPin, 
  Phone, 
  Upload, 
  User, 
  Briefcase, 
  Clipboard, 
  ArrowRight, 
  Eye, 
  EyeOff,
  Stethoscope,
  HeartPulse,
  ShieldCheck,
  Zap,
  Sparkles,
  Award,
  Users,
  Calendar,
  FileCheck,
  IdCard
} from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../assets/logo.png";

function DoctorRegister() {
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
  const [currentStep, setCurrentStep] = useState(1);
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
      const res = await axios.post("http://localhost:5003/api/auth/register", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(res.data.message);
      toast.info("Please wait for admin approval before logging in.");
      navigate("/doctorlogin");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col relative overflow-hidden font-sans">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"></div>
        
        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-emerald-400 rounded-full blur-sm animate-ping"></div>
        <div className="absolute bottom-20 right-10 w-3 h-3 bg-blue-400 rounded-full blur-sm animate-ping delay-700"></div>
        <div className="absolute top-1/2 left-1/4 w-1.5 h-1.5 bg-purple-400 rounded-full blur-sm animate-ping delay-1500"></div>
      </div>

      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 z-10 relative">
        <div className="max-w-[1200px] w-full bg-white/5 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/10 hover:border-white/20 transition-all duration-500">

          {/* Header with Logo */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-emerald-400/30 shadow-lg shadow-emerald-500/20 bg-white/10 flex items-center justify-center p-1.5">
                <img src={logo} alt="IRYAX MEDICAL SPACE" className="w-full h-full object-contain" />
              </div>
              <Stethoscope size={20} className="text-emerald-400/50" />
            </div>
            
            <h2 className="text-2xl font-light text-white tracking-wide mb-0.5">
              <span className="text-emerald-400 font-normal">IRYAX</span> 
              <span className="text-white/90"> MEDICAL</span>
              <span className="text-blue-400 font-light"> SPACE</span>
            </h2>
            <div className="flex items-center justify-center gap-2 mt-1">
              <HeartPulse size={12} className="text-emerald-400/40" />
              <p className="text-white/30 text-[10px] font-light tracking-[0.15em] uppercase">
                Doctor's Registration Portal
              </p>
              <HeartPulse size={12} className="text-emerald-400/40" />
            </div>
            <p className="text-white/20 text-[9px] font-light tracking-widest mt-1.5">
              Join India's 1st Medical Co-working Space
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3].map((step) => (
              <React.Fragment key={step}>
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    step <= currentStep 
                      ? 'bg-gradient-to-r from-emerald-400 to-blue-500 text-white shadow-lg shadow-emerald-500/20' 
                      : 'bg-white/10 text-white/30 border border-white/10'
                  }`}>
                    {step}
                  </div>
                  <span className={`text-[10px] font-medium tracking-wider hidden sm:block ${
                    step <= currentStep ? 'text-white/70' : 'text-white/30'
                  }`}>
                    {step === 1 ? 'Personal' : step === 2 ? 'Organization' : 'Documents'}
                  </span>
                </div>
                {step < 3 && (
                  <div className={`w-8 h-0.5 rounded-full transition-all duration-300 ${
                    step < currentStep ? 'bg-gradient-to-r from-emerald-400 to-blue-500' : 'bg-white/10'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="lg:col-span-3 space-y-6">
                  <h3 className="text-sm font-bold text-emerald-400/70 uppercase tracking-widest flex items-center gap-3 border-b border-white/10 pb-3">
                    <User size={16} className="text-emerald-400" /> 
                    <span className="text-white/60">Personal Information</span>
                    <span className="text-[10px] text-emerald-400/40 ml-auto">Step 1 of 3</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      placeholder="Medical Email Address"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock size={18} className="text-white/30 group-focus-within:text-emerald-400/70 transition-colors" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="block w-full pl-11 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white/80 placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400/30 hover:border-white/20 transition-all shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/30 hover:text-white/60 transition-colors"
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
                    <div className="relative group md:col-span-2">
                      <div className="absolute top-3.5 left-0 pl-4 flex items-center pointer-events-none">
                        <MapPin size={18} className="text-white/30 group-focus-within:text-emerald-400/70 transition-colors" />
                      </div>
                      <textarea
                        name="address"
                        placeholder="Clinic Address"
                        required
                        rows="2"
                        className="block w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white/80 placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400/30 hover:border-white/20 transition-all shadow-sm resize-none"
                        value={formData.address}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button type="button" onClick={nextStep} className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-xl font-medium text-sm hover:shadow-lg hover:shadow-emerald-500/25 transition-all hover:scale-105">
                      Next Step <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Organization Details */}
              {currentStep === 2 && (
                <div className="lg:col-span-3 space-y-6">
                  <h3 className="text-sm font-bold text-emerald-400/70 uppercase tracking-widest flex items-center gap-3 border-b border-white/10 pb-3">
                    <Briefcase size={16} className="text-emerald-400" /> 
                    <span className="text-white/60">Organization Details</span>
                    <span className="text-[10px] text-emerald-400/40 ml-auto">Step 2 of 3</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      icon={<Building2 size={18} />}
                      name="organizationName"
                      type="text"
                      placeholder="Organization / Clinic Name"
                      value={formData.organizationName}
                      onChange={handleChange}
                    />
                    <InputField
                      icon={<FileText size={18} />}
                      name="gstNumber"
                      type="text"
                      placeholder="GST Number (Optional)"
                      value={formData.gstNumber}
                      onChange={handleChange}
                    />
                    <InputField
                      icon={<Clipboard size={18} />}
                      name="dmhoNumber"
                      type="text"
                      placeholder="DMHO Registration Number (Optional)"
                      value={formData.dmhoNumber}
                      onChange={handleChange}
                    />
                    
                    <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                            <Sparkles size={12} className="text-emerald-400" />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-white/50 leading-relaxed">
                            <span className="font-semibold text-white/70">Medical Registration:</span> GST and DMHO numbers are optional but recommended for complete verification and practice setup.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button type="button" onClick={prevStep} className="inline-flex items-center gap-2 px-6 py-2.5 bg-white/5 border border-white/10 text-white/60 rounded-xl font-medium text-sm hover:bg-white/10 hover:text-white/80 transition-all">
                      Previous
                    </button>
                    <button type="button" onClick={nextStep} className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-xl font-medium text-sm hover:shadow-lg hover:shadow-emerald-500/25 transition-all hover:scale-105">
                      Next Step <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Documents */}
              {currentStep === 3 && (
                <div className="lg:col-span-3 space-y-6">
                  <h3 className="text-sm font-bold text-emerald-400/70 uppercase tracking-widest flex items-center gap-3 border-b border-white/10 pb-3">
                    <Upload size={16} className="text-emerald-400" /> 
                    <span className="text-white/60">Medical Documents</span>
                    <span className="text-[10px] text-emerald-400/40 ml-auto">Step 3 of 3</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FileInput label="Aadhar Card" name="adharCard" file={files.adharCard} onChange={handleFileChange} />
                    <FileInput label="PAN Card" name="panCard" file={files.panCard} onChange={handleFileChange} />
                    <FileInput label="MBBS Certificate" name="mbbsCertificate" file={files.mbbsCertificate} onChange={handleFileChange} />
                    <FileInput label="PMC Registration" name="pmcRegistration" file={files.pmcRegistration} onChange={handleFileChange} />
                    <FileInput label="NMR ID Card" name="nmrId" file={files.nmrId} onChange={handleFileChange} />
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <ShieldCheck size={12} className="text-blue-400" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-white/50 leading-relaxed">
                          <span className="font-semibold text-white/70">Medical Verification:</span> All documents are encrypted and securely stored. Uploading these documents helps in faster verification and approval.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button type="button" onClick={prevStep} className="inline-flex items-center gap-2 px-6 py-2.5 bg-white/5 border border-white/10 text-white/60 rounded-xl font-medium text-sm hover:bg-white/10 hover:text-white/80 transition-all">
                      Previous
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-500 via-blue-500 to-indigo-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/50 hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Registering...</span>
                        </>
                      ) : (
                        <>
                          <Stethoscope size={16} />
                          <span>Register as Doctor</span>
                          <ArrowRight size={16} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

            </div>

            <div className="pt-6 border-t border-white/10">
              <div className="flex flex-col items-center gap-4">
                {/* Footer */}
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <p className="text-sm text-white/40 font-light">
                    Already have an account?{" "}
                    <Link to="/doctorlogin" className="font-semibold text-emerald-400/70 hover:text-emerald-400 transition-colors hover:underline underline-offset-2">
                      Sign In
                    </Link>
                  </p>
                  <div className="flex items-center gap-3 text-[10px] text-white/20 font-light">
                    <span className="flex items-center gap-1.5">
                      <Lock size={12} className="text-emerald-400/30" />
                      Encrypted
                    </span>
                    <span className="w-px h-3 bg-white/10"></span>
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck size={12} className="text-blue-400/30" />
                      HIPAA Compliant
                    </span>
                    <span className="w-px h-3 bg-white/10"></span>
                    <span className="flex items-center gap-1.5">
                      <Zap size={12} className="text-emerald-400/30" />
                      Medical Grade
                    </span>
                  </div>
                </div>

                <p className="text-[8px] text-white/10 font-light tracking-[0.15em]">
                  Protected by advanced medical-grade encryption & security protocols
                </p>
              </div>
            </div>

          </form>
        </div>
      </div>

      {/* Custom Animation Keyframes */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-3px); }
          20%, 40%, 60%, 80% { transform: translateX(3px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
        .delay-1000 {
          animation-delay: 1000ms;
        }
        .delay-1500 {
          animation-delay: 1500ms;
        }
        .delay-700 {
          animation-delay: 700ms;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes zoom-in-95 {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-in {
          animation: fade-in 0.3s ease-out;
        }
        .zoom-in-95 {
          animation: zoom-in-95 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

const InputField = ({ icon, ...props }) => (
  <div className="relative group">
    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
      {React.cloneElement(icon, {
        className: "text-white/30 group-focus-within:text-emerald-400/70 transition-colors"
      })}
    </div>
    <input
      {...props}
      required
      className="block w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white/80 placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400/30 hover:border-white/20 transition-all shadow-sm"
    />
  </div>
);

const FileInput = ({ label, name, file, onChange }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-bold text-white/30 uppercase tracking-wider ml-1">{label}</label>
    <div className="relative group">
      <input
        type="file"
        name={name}
        accept=".jpg,.jpeg,.png,.webp,.pdf"
        onChange={onChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />
      <div className={`flex items-center justify-between pl-4 pr-3 py-3 bg-white/5 border rounded-xl transition-all shadow-sm ${
        file 
          ? "border-emerald-400/30 bg-emerald-500/5" 
          : "border-white/10 group-hover:border-white/20"
      }`}>
        <div className="flex items-center gap-3 overflow-hidden">
          {file 
            ? <CheckCircle size={18} className="text-emerald-400 flex-shrink-0" /> 
            : <Upload size={18} className="text-white/30 flex-shrink-0" />
          }
          <span className={`text-sm truncate ${file ? "text-white/80 font-medium" : "text-white/30"}`}>
            {file ? file.name : "Choose file..."}
          </span>
        </div>
        {file && (
          <span className="flex-shrink-0 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-lg border border-emerald-400/30">
            Selected
          </span>
        )}
      </div>
    </div>
  </div>
);

export default DoctorRegister;