import axios from "axios";
import { 
  Building2, 
  CheckCircle, 
  Lock, 
  Mail, 
  MapPin, 
  Phone, 
  User, 
  Briefcase, 
  ArrowRight, 
  Eye, 
  EyeOff,
  ShieldCheck,
  Sparkles,
  Zap,
  Clipboard,
  UserPlus,
  IdCard,
  Upload,
  FileText,
  Users,
  Home,
  Key,
  Store,
  UserCheck,
  UserCog,
  Stethoscope,
  UtensilsCrossed
} from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../assets/logo.png";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    address: "",
    organizationName: "",
    gstNumber: "",
    panNumber: ""
  });

  const [panFile, setPanFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [userName, setUserName] = useState("");
  const [userType, setUserType] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePanFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        toast.error("Please upload a valid file (JPG, PNG, WEBP, or PDF)");
        e.target.value = "";
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        e.target.value = "";
        return;
      }
      setPanFile(file);
      toast.success("PAN Card uploaded successfully!");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleUserTypeSelect = (type) => {
    // Doctor registration - navigate to doctor register page
    if (type === "doctor") {
      navigate("/doctorregister");
      return;
    }
    setUserType(type);
    setCurrentStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("mobile", formData.mobile);
      data.append("address", formData.address);
      
      if (userType === "cabinOwner" || userType === "cafe") {
        data.append("organizationName", formData.organizationName || "");
        data.append("gstNumber", formData.gstNumber || "");
        data.append("panNumber", formData.panNumber || "");
        if (panFile) {
          data.append("panCard", panFile);
        }
        data.append("role", userType);
      } else {
        data.append("role", "user");
      }

      const res = await axios.post("http://localhost:5003/api/auth/register", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(res.data.message || "Registration successful!");
      setUserName(formData.name);
      setShowSuccessPopup(true);
      
      setTimeout(() => {
        setShowSuccessPopup(false);
        navigate("/login");
      }, 2500);
      
    } catch (err) {
      console.error("Registration Error:", err);
      const errorMsg = err.response?.data?.message || err.message || "Registration failed!";
      toast.error(errorMsg);
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

  const goBackToUserType = () => {
    setUserType(null);
    setCurrentStep(1);
  };

  // User Type Selection Screen
  if (!userType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center px-4 relative overflow-hidden py-8">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-4xl w-full">
          <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/10 hover:border-white/20 transition-all duration-500">
            <div className="w-16 h-0.5 bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 rounded-full mx-auto mb-4"></div>

            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-3">
                <div className="w-16 h-16 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 p-2 shadow-lg shadow-emerald-500/10 transition-all duration-300 hover:scale-105 relative">
                  <img src={logo} alt="IRYAX Space Logo" className="w-full h-full object-contain rounded-full" />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full flex items-center justify-center border-2 border-slate-900">
                    <UserPlus size={10} className="text-white" />
                  </div>
                </div>
              </div>
              <h2 className="text-xl font-light text-white tracking-wide">
                <span className="text-emerald-400 font-normal">IRYAX</span> Space
              </h2>
              <p className="text-white/40 text-[10px] font-light tracking-wider mt-1">
                Choose Your Account Type
              </p>
            </div>

            <p className="text-center text-white/30 text-xs font-light tracking-wider mb-6">
              Select how you want to register with IRYAX Space
            </p>

            {/* Grid with 4 options */}
            <div className="grid md:grid-cols-4 gap-4">
              {/* User Card */}
              <button
                onClick={() => handleUserTypeSelect("user")}
                className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-left hover:border-emerald-400/50 hover:bg-white/10 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/10"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/5 group-hover:to-emerald-500/10 rounded-2xl transition-all duration-500"></div>
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform duration-300 mb-4 border border-emerald-400/20 group-hover:border-emerald-400/40">
                    <User size={28} />
                  </div>
                  <h3 className="text-white font-semibold text-base tracking-wide group-hover:text-emerald-400 transition-colors">
                    User
                  </h3>
                  <p className="text-white/40 text-xs font-light mt-1 leading-relaxed">
                    Book workspaces, medical chambers, and manage your professional needs.
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-emerald-400/60 text-xs font-medium group-hover:text-emerald-400 transition-colors">
                    <span>Get Started</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </button>

              {/* Cabin Owner Card */}
              <button
                onClick={() => handleUserTypeSelect("cabinOwner")}
                className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-left hover:border-blue-400/50 hover:bg-white/10 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-blue-500/10 rounded-2xl transition-all duration-500"></div>
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400/20 to-indigo-600/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform duration-300 mb-4 border border-blue-400/20 group-hover:border-blue-400/40">
                    <Building2 size={28} />
                  </div>
                  <h3 className="text-white font-semibold text-base tracking-wide group-hover:text-blue-400 transition-colors">
                    Cabin Owner
                  </h3>
                  <p className="text-white/40 text-xs font-light mt-1 leading-relaxed">
                    List your workspaces, manage bookings, and earn passive income.
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-blue-400/60 text-xs font-medium group-hover:text-blue-400 transition-colors">
                    <span>List Your Space</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </button>

              {/* Medical Cabin / Doctor Card */}
              <button
                onClick={() => handleUserTypeSelect("doctor")}
                className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-left hover:border-purple-400/50 hover:bg-white/10 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-500/0 group-hover:from-purple-500/5 group-hover:to-purple-500/10 rounded-2xl transition-all duration-500"></div>
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-400/20 to-indigo-600/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform duration-300 mb-4 border border-purple-400/20 group-hover:border-purple-400/40">
                    <Stethoscope size={28} />
                  </div>
                  <h3 className="text-white font-semibold text-base tracking-wide group-hover:text-purple-400 transition-colors">
                    Medical Cabin
                  </h3>
                  <p className="text-white/40 text-xs font-light mt-1 leading-relaxed">
                    Register as a doctor, manage your medical practice, and offer consultations.
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-purple-400/60 text-xs font-medium group-hover:text-purple-400 transition-colors">
                    <span>Join as Medical Cabin Owner</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </button>

              {/* Cafe Card */}
              <button
                onClick={() => handleUserTypeSelect("cafe")}
                className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-left hover:border-amber-400/50 hover:bg-white/10 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/10"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-amber-500/0 group-hover:from-amber-500/5 group-hover:to-amber-500/10 rounded-2xl transition-all duration-500"></div>
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400/20 to-orange-600/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform duration-300 mb-4 border border-amber-400/20 group-hover:border-amber-400/40">
                    <UtensilsCrossed size={28} />
                  </div>
                  <h3 className="text-white font-semibold text-base tracking-wide group-hover:text-amber-400 transition-colors">
                    Cafe
                  </h3>
                  <p className="text-white/40 text-xs font-light mt-1 leading-relaxed">
                    Register your cafe, list your menu, manage dining bookings & offers.
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-amber-400/60 text-xs font-medium group-hover:text-amber-400 transition-colors">
                    <span>Register Your Cafe</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs text-white/30 font-light tracking-wide">
                Already have an account?{" "}
                <Link to="/login" className="font-normal text-emerald-400/70 hover:text-emerald-400 transition-colors hover:underline underline-offset-2">
                  Sign In
                </Link>
              </p>
              <div className="flex items-center justify-center gap-3 text-[9px] text-white/20 font-light tracking-wider mt-2">
                <span className="flex items-center gap-1">
                  <ShieldCheck size={10} className="text-emerald-400/30" />
                  SSL Secured
                </span>
                <span className="w-px h-2.5 bg-white/5"></span>
                <span className="flex items-center gap-1">
                  <Zap size={10} className="text-blue-400/30" />
                  Enterprise Grade
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Registration Form (User / Cabin Owner / Cafe)
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center px-4 relative overflow-hidden py-8">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-[600px] w-full">
        <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/10 hover:border-white/20 transition-all duration-500">
          
          <div className="w-16 h-0.5 bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 rounded-full mx-auto mb-4"></div>

          <div className="text-center mb-4">
            <button
              onClick={goBackToUserType}
              className="inline-flex items-center gap-1.5 text-white/30 hover:text-white/60 text-[10px] font-light tracking-wider transition-colors mb-2"
            >
              <ArrowRight size={12} className="rotate-180" />
              Change Account Type
            </button>
            
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className={`px-3 py-1 rounded-full text-[8px] font-bold tracking-wider uppercase border ${
                userType === "user" 
                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-400/30" 
                  : userType === "cafe"
                  ? "bg-amber-500/20 text-amber-400 border-amber-400/30"
                  : "bg-blue-500/20 text-blue-400 border-blue-400/30"
              }`}>
                {userType === "user" ? "👤 User" : userType === "cafe" ? "☕ Cafe" : "🏢 Cabin Owner"}
              </div>
            </div>

            <div className="flex items-center justify-center mb-1">
              <div className="w-12 h-12 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 p-1.5 shadow-lg shadow-emerald-500/10 transition-all duration-300 hover:scale-105 relative">
                <img src={logo} alt="IRYAX Space Logo" className="w-full h-full object-contain rounded-full" />
              </div>
            </div>
            
            <h2 className="text-lg font-light text-white tracking-wide">
              <span className="text-emerald-400 font-normal">IRYAX</span> Space
            </h2>
            <p className="text-white/40 text-[10px] font-light tracking-wider mt-0.5">
              {userType === "user" ? "Create Your User Account" : "Register Your Business"}
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2 mb-4">
            {[1, 2].map((step) => (
              <React.Fragment key={step}>
                <div className="flex items-center gap-1.5">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold transition-all duration-300 ${
                    step <= currentStep 
                      ? 'bg-gradient-to-r from-emerald-400 to-blue-500 text-white shadow-lg shadow-emerald-500/20' 
                      : 'bg-white/5 text-white/30 border border-white/10'
                  }`}>
                    {step}
                  </div>
                  <span className={`text-[8px] font-medium tracking-wider ${
                    step <= currentStep ? 'text-white/60' : 'text-white/20'
                  }`}>
                    {step === 1 ? 'Personal' : userType === "user" ? 'Complete' : 'Organization'}
                  </span>
                </div>
                {step < 2 && (
                  <div className={`w-5 h-0.5 rounded-full transition-all duration-300 ${
                    step < currentStep ? 'bg-gradient-to-r from-emerald-400 to-blue-500' : 'bg-white/10'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {/* Step 1: Personal Information - Same for all */}
            {currentStep === 1 && (
              <div className="space-y-3">
                <p className="text-[9px] text-white/30 font-light tracking-wider uppercase flex items-center gap-2 pb-0.5">
                  <User size={11} className="text-emerald-400/40" />
                  Personal Details
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div className="relative group col-span-2">
                    <User className="absolute left-3 top-2.5 text-white/30 group-focus-within:text-emerald-400/70 transition-colors" size={14} />
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name *"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl focus:ring-1 focus:ring-emerald-400/30 focus:border-emerald-400/30 transition-all outline-none text-white/80 placeholder:text-white/20 font-light text-sm group-hover:border-white/20"
                    />
                  </div>

                  <div className="relative group col-span-2">
                    <Mail className="absolute left-3 top-2.5 text-white/30 group-focus-within:text-emerald-400/70 transition-colors" size={14} />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address *"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl focus:ring-1 focus:ring-emerald-400/30 focus:border-emerald-400/30 transition-all outline-none text-white/80 placeholder:text-white/20 font-light text-sm group-hover:border-white/20"
                    />
                  </div>

                  <div className="relative group">
                    <Lock className="absolute left-3 top-2.5 text-white/30 group-focus-within:text-emerald-400/70 transition-colors" size={14} />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Password *"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full pl-9 pr-8 py-2 bg-white/5 border border-white/10 rounded-xl focus:ring-1 focus:ring-emerald-400/30 focus:border-emerald-400/30 transition-all outline-none text-white/80 placeholder:text-white/20 font-light text-sm group-hover:border-white/20"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-2 top-2 text-white/30 hover:text-white/60 transition-colors focus:outline-none"
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>

                  <div className="relative group">
                    <Phone className="absolute left-3 top-2.5 text-white/30 group-focus-within:text-emerald-400/70 transition-colors" size={14} />
                    <input
                      type="text"
                      name="mobile"
                      placeholder="Mobile Number *"
                      value={formData.mobile}
                      onChange={handleChange}
                      required
                      className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl focus:ring-1 focus:ring-emerald-400/30 focus:border-emerald-400/30 transition-all outline-none text-white/80 placeholder:text-white/20 font-light text-sm group-hover:border-white/20"
                    />
                  </div>

                  <div className="relative group col-span-2">
                    <MapPin className="absolute left-3 top-2.5 text-white/30 group-focus-within:text-emerald-400/70 transition-colors" size={14} />
                    <textarea
                      name="address"
                      placeholder="Address *"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      rows="1.5"
                      className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl focus:ring-1 focus:ring-emerald-400/30 focus:border-emerald-400/30 transition-all outline-none text-white/80 placeholder:text-white/20 font-light text-sm group-hover:border-white/20 resize-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={nextStep}
                    className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-xl font-medium text-sm hover:shadow-lg hover:shadow-emerald-500/25 transition-all hover:scale-105"
                  >
                    Next <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Based on User Type */}
            {currentStep === 2 && (
              <div className="space-y-3">
                {userType === "user" ? (
                  // USER - Simple confirmation
                  <div className="space-y-4">
                    <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                      <p className="text-white/60 text-xs font-light text-center">
                        Complete your registration as a <span className="text-emerald-400 font-medium">User</span>
                      </p>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] text-white/40">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle size={12} className="text-emerald-400" />
                          <span>Book workspaces</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle size={12} className="text-emerald-400" />
                          <span>Access medical chambers</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle size={12} className="text-emerald-400" />
                          <span>Flexible booking</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle size={12} className="text-emerald-400" />
                          <span>24/7 support</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between pt-1">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="inline-flex items-center gap-2 px-5 py-2 bg-white/5 border border-white/10 text-white/60 rounded-xl font-medium text-sm hover:bg-white/10 hover:text-white/80 transition-all"
                      >
                        Previous
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-emerald-500 via-blue-500 to-indigo-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/50 hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      >
                        {loading ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Creating...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles size={14} />
                            <span>Create Account</span>
                            <ArrowRight size={14} />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  // CABIN OWNER OR CAFE - Organization Details
                  <div className="space-y-3">
                    <p className="text-[9px] text-white/30 font-light tracking-wider uppercase flex items-center gap-2 pb-0.5">
                      <Briefcase size={11} className={userType === "cafe" ? "text-amber-400/40" : "text-blue-400/40"} />
                      Organization & Documents
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative group col-span-2">
                        <Building2 className="absolute left-3 top-2.5 text-white/30 group-focus-within:text-emerald-400/70 transition-colors" size={14} />
                        <input
                          type="text"
                          name="organizationName"
                          placeholder="Organization Name"
                          value={formData.organizationName}
                          onChange={handleChange}
                          className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl focus:ring-1 focus:ring-emerald-400/30 focus:border-emerald-400/30 transition-all outline-none text-white/80 placeholder:text-white/20 font-light text-sm group-hover:border-white/20"
                        />
                      </div>

                      <div className="relative group">
                        <Clipboard className="absolute left-3 top-2.5 text-white/30 group-focus-within:text-emerald-400/70 transition-colors" size={14} />
                        <input
                          type="text"
                          name="gstNumber"
                          placeholder="GST Number"
                          value={formData.gstNumber}
                          onChange={handleChange}
                          className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl focus:ring-1 focus:ring-emerald-400/30 focus:border-emerald-400/30 transition-all outline-none text-white/80 placeholder:text-white/20 font-light text-sm group-hover:border-white/20"
                        />
                      </div>

                      <div className="relative group">
                        <IdCard className="absolute left-3 top-2.5 text-white/30 group-focus-within:text-emerald-400/70 transition-colors" size={14} />
                        <input
                          type="text"
                          name="panNumber"
                          placeholder="PAN Number"
                          value={formData.panNumber}
                          onChange={handleChange}
                          className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl focus:ring-1 focus:ring-emerald-400/30 focus:border-emerald-400/30 transition-all outline-none text-white/80 placeholder:text-white/20 font-light text-sm group-hover:border-white/20"
                        />
                      </div>
                    </div>

                    {/* PAN Card Upload */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] text-white/40 font-medium tracking-wider flex items-center gap-1.5">
                        <Upload size={11} className={userType === "cafe" ? "text-amber-400/50" : "text-blue-400/50"} />
                        Upload PAN Card (Optional)
                      </label>
                      <div className="relative group">
                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png,.webp,.pdf"
                          onChange={handlePanFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className={`flex items-center justify-between pl-4 pr-3 py-2.5 bg-white/5 border rounded-xl transition-all ${
                          panFile 
                            ? "border-emerald-400/30 bg-emerald-500/5" 
                            : "border-white/10 group-hover:border-white/20"
                        }`}>
                          <div className="flex items-center gap-3 overflow-hidden">
                            {panFile 
                              ? <FileText size={14} className="text-emerald-400 flex-shrink-0" /> 
                              : <Upload size={14} className="text-white/30 flex-shrink-0" />
                            }
                            <span className={`text-xs truncate ${panFile ? "text-white/80 font-medium" : "text-white/30"}`}>
                              {panFile ? panFile.name : "Upload PAN Card (JPG, PNG, WEBP, PDF)"}
                            </span>
                          </div>
                          {panFile && (
                            <span className="flex-shrink-0 bg-emerald-500/20 text-emerald-400 text-[9px] font-bold px-2 py-0.5 rounded-lg border border-emerald-400/30">
                              Uploaded
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-[7px] text-white/20 font-light tracking-wide ml-1">
                        Max file size: 5MB · Supported: JPG, PNG, WEBP, PDF
                      </p>
                    </div>

                    <div className="bg-white/5 rounded-xl p-2.5 border border-white/5">
                      <p className="text-[9px] text-white/30 font-light leading-relaxed flex items-start gap-1.5">
                        <span className={userType === "cafe" ? "text-amber-400/40 text-[10px]" : "text-blue-400/40 text-[10px]"}>ⓘ</span>
                        <span>GST, PAN numbers and PAN Card upload are optional but recommended for complete verification.</span>
                      </p>
                    </div>

                    <div className="flex justify-between pt-1">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="inline-flex items-center gap-2 px-5 py-2 bg-white/5 border border-white/10 text-white/60 rounded-xl font-medium text-sm hover:bg-white/10 hover:text-white/80 transition-all"
                      >
                        Previous
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-emerald-500 via-blue-500 to-indigo-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/50 hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      >
                        {loading ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Creating...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles size={14} />
                            <span>Register</span>
                            <ArrowRight size={14} />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <div className="relative flex justify-center text-[8px]">
              <span className="px-3 bg-transparent text-white/20 font-light tracking-[0.2em]">SECURE REGISTRATION</span>
            </div>
          </div>

          <div className="text-center space-y-2">
            <p className="text-xs text-white/30 font-light tracking-wide">
              Already have an account?{" "}
              <Link to="/login" className="font-normal text-emerald-400/70 hover:text-emerald-400 transition-colors hover:underline underline-offset-2">
                Sign In
              </Link>
            </p>
            
            <div className="flex items-center justify-center gap-3 text-[9px] text-white/20 font-light tracking-wider">
              <span className="flex items-center gap-1">
                <ShieldCheck size={10} className="text-emerald-400/30" />
                SSL Secured
              </span>
              <span className="w-px h-2.5 bg-white/5"></span>
              <span className="flex items-center gap-1">
                <Zap size={10} className="text-blue-400/30" />
                Enterprise Grade
              </span>
            </div>
          </div>
        </div>
        <div className="w-16 h-0.5 bg-gradient-to-r from-emerald-400/30 via-blue-500/30 to-purple-500/30 rounded-full mx-auto mt-4"></div>
      </div>

      {/* SUCCESS POPUP */}
      {showSuccessPopup && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowSuccessPopup(false);
            }
          }}
        >
          <div className="bg-gradient-to-br from-emerald-500/20 via-blue-500/20 to-indigo-500/20 backdrop-blur-xl border border-white/20 rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="text-center">
              <div className="relative inline-flex items-center justify-center w-20 h-20 mb-4">
                <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping"></div>
                <div className="absolute inset-0 bg-emerald-500/10 rounded-full animate-pulse"></div>
                <div className="relative w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <CheckCircle size={32} className="text-white" />
                </div>
              </div>
              
              <h3 className="text-xl font-light text-white tracking-wide">
                Registration Successful!
              </h3>
              <p className="text-white/60 text-sm font-light mt-1">
                {userName || "User"}
              </p>
              <p className="text-white/40 text-xs font-light mt-2">
                {userType === "cafe" 
                  ? "Your cafe registration is pending admin approval." 
                  : userType === "cabinOwner"
                  ? "Your business registration is pending admin approval." 
                  : "Please wait for admin approval before logging in."}
              </p>
              <div className="mt-2 flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce delay-150"></span>
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce delay-300"></span>
              </div>
              <p className="text-white/30 text-xs font-light mt-3 tracking-wider">
                Redirecting to login...
              </p>
              
              <div className="mt-4 w-full h-0.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-400 via-blue-500 to-indigo-500 rounded-full animate-progress"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes zoom-in-95 {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-in {
          animation: fade-in 0.3s ease-out;
        }
        .zoom-in-95 {
          animation: zoom-in-95 0.3s ease-out;
        }
        .animate-progress {
          animation: progress 2.5s ease-in-out forwards;
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
      `}</style>
    </div>
  );
}

export default Register;