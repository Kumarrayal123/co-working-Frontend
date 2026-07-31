import axios from "axios";
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  CheckCircle,
  LogIn,
  Zap,
  User,
  Building2,
  Loader2,
  Stethoscope,
  Crown,
  PartyPopper,
  Rocket,
  Star,
  Heart,
  Coffee,
  KeyRound,
  Send,
  ArrowLeft,
  X,
  Key,
  Check,
  AlertCircle
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../assets/logo.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");
  
  // Forgot Password States
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const navigate = useNavigate();

  // ✅ Log all localStorage data on page load
  useEffect(() => {
    console.log("========== LOGIN PAGE LOADED ==========");
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    const admin = localStorage.getItem("admin");
    
    console.log("🔑 Token:", token ? "✅ Present" : "❌ Not found");
    console.log("👤 User data:", user ? JSON.parse(user) : "❌ Not found");
    console.log("👑 Admin data:", admin ? JSON.parse(admin) : "❌ Not found");
    
    if (user) {
      const userData = JSON.parse(user);
      console.log("📋 User Details:");
      console.log("  - ID:", userData._id);
      console.log("  - Name:", userData.name);
      console.log("  - Email:", userData.email);
      console.log("  - Role:", userData.role);
    }
    console.log("========================================");
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    console.log("========================================");
    console.log("🔐 LOGIN ATTEMPT");
    console.log("📧 Email:", email);
    console.log("========================================");

    try {
      console.log("👤 Attempting login via API...");
      
      const res = await axios.post("https://spaceapi.iryax.com/api/auth/login", {
        email,
        password
      });

      console.log("📡 Login API Response:", res.data);

      const { token, user } = res.data;
      
      console.log("📋 User Data from API:");
      console.log("  - ID:", user._id);
      console.log("  - Name:", user.name);
      console.log("  - Email:", user.email);
      console.log("  - Role:", user.role);
      console.log("  - Mobile:", user.mobile);
      console.log("  - Address:", user.address);

      localStorage.removeItem("admin");
      localStorage.removeItem("user");
      localStorage.removeItem("isDoctor");
      
      localStorage.setItem("token", token);
      
      if (user.role === "admin") {
        const adminData = {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        };
        localStorage.setItem("admin", JSON.stringify(adminData));
        console.log("👑 Admin data stored:", adminData);
      } else {
        localStorage.setItem("user", JSON.stringify(user));
        console.log("👤 User data stored:", user);
        
        if (user.role === "doctor") {
          localStorage.setItem("isDoctor", "true");
          console.log("👨‍⚕️ Doctor flag set");
        }
      }
      
      console.log("🆔 ID stored:", user._id);
      console.log("👤 Role stored:", user.role);
      
      setUserName(user.name || "User");
      setUserRole(user.role || "user");
      setUserId(user._id);
      setShowSuccessPopup(true);
      setLoading(false);
      
      let redirectPath = "/spaceforusers";
      let roleDisplay = "User";
      
      if (user.role === "admin") {
        redirectPath = "/admindashboard";
        roleDisplay = "Admin";
        console.log("👑 ADMIN LOGIN! Redirecting to /admindashboard");
      } else if (user.role === "cabinOwner") {
        redirectPath = "/ownerdashboard";
        roleDisplay = "Cabin Owner";
        console.log("🏪 CABIN OWNER LOGIN! Redirecting to /ownerdashboard");
      } else if (user.role === "doctor") {
        redirectPath = "/doctordashbaord";
        roleDisplay = "Doctor";
        console.log("👨‍⚕️ DOCTOR LOGIN! Redirecting to /doctordashbaord");
      } else if (user.role === "user") {
        redirectPath = "/spaceforusers";
        roleDisplay = "User";
        console.log("👤 USER LOGIN! Redirecting to /spaceforusers");
      } else {
        redirectPath = "/spaceforusers";
        roleDisplay = "User";
        console.log("👤 DEFAULT USER! Redirecting to /spaceforusers");
      }
      
      console.log(`🔀 Redirecting to: ${redirectPath} (Role: ${roleDisplay})`);
      console.log("========================================");
      
      if (user.role === "admin") {
        toast.success(`👑 Welcome Admin! ${user.name}`);
      } else if (user.role === "cabinOwner") {
        toast.success(`🏪 Welcome Cabin Owner! ${user.name}`);
      } else if (user.role === "doctor") {
        toast.success(`👨‍⚕️ Welcome Doctor! ${user.name}`);
      } else {
        toast.success(`👤 Welcome ${user.name}!`);
      }
      
      setTimeout(() => {
        setShowSuccessPopup(false);
        console.log(`🚀 Navigating to: ${redirectPath}`);
        navigate(redirectPath);
      }, 2500);
      
    } catch (err) {
      console.error("❌ LOGIN ERROR:", err);
      console.error("❌ Error Response:", err.response?.data);
      console.error("❌ Error Message:", err.message);
      
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Login failed! Please check credentials.";
      setError(errorMsg);
      toast.error(errorMsg);
      setLoading(false);
      console.log("========================================");
    }
  };

  // ============================================
  // FORGOT PASSWORD - STEP 1: VERIFY EMAIL
  // ============================================
  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotError("");
    setEmailVerified(false);

    try {
      const res = await axios.post("https://spaceapi.iryax.com/api/auth/forgot-password", {
        email: forgotEmail
      });

      if (res.data.success) {
        setEmailVerified(true);
        toast.success(res.data.message || "Email verified successfully!");
      } else {
        setForgotError(res.data.message || "Email not found");
        toast.error(res.data.message || "Email not found");
      }
    } catch (err) {
      console.error("❌ Verify Email Error:", err);
      const errorMsg = err.response?.data?.message || err.message || "Failed to verify email";
      setForgotError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setForgotLoading(false);
    }
  };

  // ============================================
  // FORGOT PASSWORD - STEP 2: RESET PASSWORD
  // ============================================
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setForgotLoading(true);
    setForgotError("");

    try {
      const res = await axios.post("https://spaceapi.iryax.com/api/auth/reset-password", {
        email: forgotEmail,
        newPassword: newPassword
      });

      if (res.data.success) {
        toast.success("Password reset successfully! Please login.");
        closeForgotPassword();
        setForgotEmail("");
        setNewPassword("");
        setConfirmPassword("");
        setEmailVerified(false);
      } else {
        setForgotError(res.data.message || "Failed to reset password");
        toast.error(res.data.message || "Failed to reset password");
      }
    } catch (err) {
      console.error("❌ Reset Password Error:", err);
      const errorMsg = err.response?.data?.message || err.message || "Failed to reset password";
      setForgotError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setForgotLoading(false);
    }
  };

  const closeForgotPassword = () => {
    setShowForgotPassword(false);
    setForgotEmail("");
    setForgotError("");
    setEmailVerified(false);
    setNewPassword("");
    setConfirmPassword("");
    setForgotLoading(false);
  };

  // Get role-specific emoji and color
  const getRoleStyle = (role) => {
    const styles = {
      admin: { emoji: '👑', color: 'from-purple-500 to-pink-500', icon: ShieldCheck, label: 'Admin' },
      cabinOwner: { emoji: '🏪', color: 'from-amber-500 to-orange-500', icon: Building2, label: 'Cabin Owner' },
      doctor: { emoji: '👨‍⚕️', color: 'from-emerald-500 to-teal-500', icon: Stethoscope, label: 'Doctor' },
      user: { emoji: '👤', color: 'from-indigo-500 to-blue-500', icon: User, label: 'User' }
    };
    return styles[role] || styles.user;
  };

  // Get welcome message based on role and time
  const getWelcomeMessage = (role, name) => {
    const hour = new Date().getHours();
    let greeting = '';
    if (hour < 12) greeting = 'Good Morning';
    else if (hour < 17) greeting = 'Good Afternoon';
    else greeting = 'Good Evening';
    
    const roleEmojis = {
      admin: '👑',
      cabinOwner: '🏪',
      doctor: '👨‍⚕️',
      user: '👤'
    };
    
    return `${greeting}, ${roleEmojis[role] || '👤'} ${name}!`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"></div>
        
        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-emerald-400 rounded-full blur-sm animate-ping"></div>
        <div className="absolute bottom-20 right-10 w-3 h-3 bg-blue-400 rounded-full blur-sm animate-ping delay-700"></div>
        <div className="absolute top-1/2 left-1/4 w-1.5 h-1.5 bg-purple-400 rounded-full blur-sm animate-ping delay-1500"></div>
      </div>

      <div className="relative z-10 max-w-[420px] w-full">
        {/* Card with Glass Effect */}
        <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/10 hover:border-white/20 transition-all duration-500">
          
          {/* Decorative Top Line */}
          <div className="w-16 h-0.5 bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 rounded-full mx-auto mb-6"></div>

          {/* Header with Logo */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-20 h-20 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 p-2 shadow-lg shadow-emerald-500/10 transition-all duration-300 hover:scale-105 hover:shadow-emerald-500/20">
                <img 
                  src={logo} 
                  alt="IRYAX Space Logo" 
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
            </div>
            
            <h2 className="text-2xl font-light text-white tracking-wide mb-1">
              <span className="text-emerald-400 font-normal">IRYAX</span> Space
            </h2>
            <p className="text-white/40 text-xs font-light tracking-wider mt-2">
              Welcome Back · How are you today?
            </p>
            <p className="text-white/30 text-[10px] font-light tracking-widest mt-0.5">
              Sign in to continue your journey
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-2.5 bg-red-500/10 border border-red-500/20 text-red-400/80 text-xs rounded-xl flex items-center gap-2 backdrop-blur-sm animate-shake font-light">
              <ShieldCheck size={14} className="flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div className="relative group">
              <Mail className="absolute left-3 top-3 text-white/30 group-focus-within:text-emerald-400/70 transition-colors" size={16} />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:ring-1 focus:ring-emerald-400/30 focus:border-emerald-400/30 transition-all outline-none text-white/80 placeholder:text-white/20 font-light text-sm group-hover:border-white/20"
              />
            </div>

            {/* Password with Show/Hide */}
            <div className="relative group">
              <Lock className="absolute left-3 top-3 text-white/30 group-focus-within:text-emerald-400/70 transition-colors" size={16} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-9 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:ring-1 focus:ring-emerald-400/30 focus:border-emerald-400/30 transition-all outline-none text-white/80 placeholder:text-white/20 font-light text-sm group-hover:border-white/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-white/30 hover:text-white/60 transition-colors focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="w-3.5 h-3.5 rounded border border-white/20 bg-white/5 flex items-center justify-center transition-all group-hover:border-white/30">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="hidden"
                  />
                  {rememberMe && <CheckCircle size={11} className="text-emerald-400" />}
                </div>
                <span className="text-[11px] text-white/40 group-hover:text-white/60 transition-colors font-light tracking-wider">Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-[11px] text-emerald-400/50 hover:text-emerald-400/80 transition-colors font-light tracking-wider flex items-center gap-1"
              >
                <KeyRound size={12} />
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2.5 rounded-xl bg-gradient-to-r from-emerald-500/80 via-blue-500/80 to-indigo-500/80 px-4 py-3 text-white/90 font-light text-sm tracking-wide hover:from-emerald-500 hover:via-blue-500 hover:to-indigo-500 transition-all duration-300 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span className="font-light text-xs tracking-wider">Authenticating...</span>
                </>
              ) : (
                <>
                  <LogIn size={16} className="group-hover:scale-110 transition-transform" />
                  <span className="font-light tracking-wider">Sign In</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <div className="relative flex justify-center text-[9px]">
              <span className="px-3 bg-transparent text-white/20 font-light tracking-[0.2em]">SECURE ACCESS</span>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center space-y-3">
            <p className="text-sm text-white/30 font-light tracking-wide">
              Don't have an account?{" "}
              <Link to="/register" className="font-normal text-emerald-400/70 hover:text-emerald-400 transition-colors hover:underline underline-offset-2">
                Create Account
              </Link>
            </p>
            
            {/* Security Badges */}
            <div className="flex items-center justify-center gap-4 text-[10px] text-white/20 font-light tracking-wider">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={11} className="text-emerald-400/30" />
                SSL Secured
              </span>
              <span className="w-px h-3 bg-white/5"></span>
              <span className="flex items-center gap-1.5">
                <Zap size={11} className="text-blue-400/30" />
                Enterprise Grade
              </span>
            </div>

            <p className="text-[8px] text-white/10 font-light tracking-[0.15em] mt-2">
              Protected by advanced encryption & security protocols
            </p>
          </div>

        </div>

        {/* Bottom Decorative Line */}
        <div className="w-16 h-0.5 bg-gradient-to-r from-emerald-400/30 via-blue-500/30 to-purple-500/30 rounded-full mx-auto mt-5"></div>
      </div>

      {/* ====================== */}
      {/* FORGOT PASSWORD POPUP - NO OTP */}
      {/* ====================== */}
      {showForgotPassword && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeForgotPassword();
            }
          }}
        >
          <div className="relative max-w-md w-full">
            {/* Animated Background Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-purple-500 to-blue-500 rounded-2xl blur-xl opacity-20 animate-pulse"></div>
            
            {/* Main Card */}
            <div className="relative bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
              {/* Decorative Top Gradient */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-purple-400 to-blue-400"></div>
              
              <div className="p-6 text-center relative z-10">
                {/* Close Button */}
                <button
                  onClick={closeForgotPassword}
                  className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-white/10 transition-colors text-white/40 hover:text-white/60"
                >
                  <X size={18} />
                </button>

                {/* Icon */}
                <div className="relative inline-flex items-center justify-center w-20 h-20 mb-3">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-blue-400/20 rounded-full animate-ping"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-blue-400/10 rounded-full animate-pulse"></div>
                  <div className="relative w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/30">
                    {emailVerified ? (
                      <CheckCircle size={32} className="text-white" />
                    ) : (
                      <KeyRound size={32} className="text-white" />
                    )}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {emailVerified ? "Set New Password 🔐" : "Reset Password"}
                </h3>
                
                <p className="text-white/40 text-xs mt-1 font-light">
                  {emailVerified 
                    ? "Enter your new password below" 
                    : "Enter your email to reset your password"}
                </p>

                {/* Step 1: Email */}
                {!emailVerified ? (
                  <form onSubmit={handleVerifyEmail} className="mt-4 space-y-3">
                    <div className="relative group">
                      <Mail className="absolute left-3 top-3 text-white/30 group-focus-within:text-emerald-400/70 transition-colors" size={16} />
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        required
                        className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:ring-1 focus:ring-emerald-400/30 focus:border-emerald-400/30 transition-all outline-none text-white/80 placeholder:text-white/20 font-light text-sm"
                      />
                    </div>

                    {forgotError && (
                      <p className="text-[10px] text-red-400 bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20 flex items-center gap-1.5">
                        <AlertCircle size={12} />
                        {forgotError}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="w-full flex justify-center items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500 px-4 py-2.5 text-white/90 font-light text-sm hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {forgotLoading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>Verifying...</span>
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          <span>Verify Email</span>
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  /* Step 2: New Password */
                  <form onSubmit={handleResetPassword} className="mt-4 space-y-3">
                    <div className="relative group">
                      <Lock className="absolute left-3 top-3 text-white/30 group-focus-within:text-emerald-400/70 transition-colors" size={16} />
                      <input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="New Password (min 6 chars)"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="w-full pl-9 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:ring-1 focus:ring-emerald-400/30 focus:border-emerald-400/30 transition-all outline-none text-white/80 placeholder:text-white/20 font-light text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-2.5 text-white/30 hover:text-white/60 transition-colors"
                      >
                        {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>

                    <div className="relative group">
                      <Lock className="absolute left-3 top-3 text-white/30 group-focus-within:text-emerald-400/70 transition-colors" size={16} />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full pl-9 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:ring-1 focus:ring-emerald-400/30 focus:border-emerald-400/30 transition-all outline-none text-white/80 placeholder:text-white/20 font-light text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-2.5 text-white/30 hover:text-white/60 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>

                    {forgotError && (
                      <p className="text-[10px] text-red-400 bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20 flex items-center gap-1.5">
                        <AlertCircle size={12} />
                        {forgotError}
                      </p>
                    )}

                    {newPassword && confirmPassword && newPassword === confirmPassword && (
                      <p className="text-[10px] text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 flex items-center gap-1.5">
                        <Check size={12} />
                        Passwords match!
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="w-full flex justify-center items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500 px-4 py-2.5 text-white/90 font-light text-sm hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {forgotLoading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>Resetting...</span>
                        </>
                      ) : (
                        <>
                          <KeyRound size={16} />
                          <span>Reset Password</span>
                        </>
                      )}
                    </button>
                  </form>
                )}

                <button
                  type="button"
                  onClick={closeForgotPassword}
                  className="mt-3 text-[10px] text-white/30 hover:text-white/50 transition-colors flex items-center justify-center gap-1 w-full"
                >
                  <ArrowLeft size={12} />
                  Back to Login
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================== */}
      {/* ATTRACTIVE SUCCESS POPUP */}
      {/* ====================== */}
      {showSuccessPopup && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowSuccessPopup(false);
            }
          }}
        >
          <div className="relative max-w-md w-full">
            {/* Animated Background Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-purple-500 to-pink-500 rounded-2xl blur-xl opacity-30 animate-pulse"></div>
            
            {/* Main Card */}
            <div className="relative bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
              {/* Decorative Top Gradient */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-purple-400 to-pink-400"></div>
              
              {/* Confetti Particles - Decorative */}
              <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-5 w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="absolute top-20 right-10 w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                <div className="absolute top-32 left-20 w-2.5 h-2.5 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute top-40 right-20 w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.7s' }}></div>
                <div className="absolute bottom-10 left-10 w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="absolute bottom-20 right-15 w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>

              <div className="p-8 text-center relative z-10">
                {/* Icon Container */}
                <div className="relative inline-flex items-center justify-center w-24 h-24 mb-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-purple-400/20 rounded-full animate-ping"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-purple-400/10 rounded-full animate-pulse"></div>
                  <div className={`relative w-20 h-20 bg-gradient-to-br ${getRoleStyle(userRole).color} rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/30`}>
                    {userRole === "admin" ? (
                      <ShieldCheck size={36} className="text-white" />
                    ) : userRole === "cabinOwner" ? (
                      <Building2 size={36} className="text-white" />
                    ) : userRole === "doctor" ? (
                      <Stethoscope size={36} className="text-white" />
                    ) : (
                      <User size={36} className="text-white" />
                    )}
                  </div>
                  
                  {/* Floating Badge */}
                  <div className="absolute -top-1 -right-1 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full p-1.5 shadow-lg shadow-emerald-500/30">
                    <CheckCircle size={14} className="text-white" />
                  </div>
                </div>

                {/* Welcome Message */}
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  {getWelcomeMessage(userRole, userName)}
                </h3>
                
                <p className="text-white/50 text-sm mt-1 font-light">
                  {userRole === "admin" ? "👑 Administrator Access Granted" : 
                   userRole === "cabinOwner" ? "🏪 Cabin Owner Access Granted" : 
                   userRole === "doctor" ? "👨‍⚕️ Medical Professional Access Granted" : 
                   "👤 User Access Granted"}
                </p>

                {/* User Info Chips */}
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                  <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-[10px] text-white/60 border border-white/5">
                    {userName}
                  </span>
                  <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-[10px] text-white/60 border border-white/5">
                    {userRole}
                  </span>
                </div>

                {/* Divider */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-3 bg-transparent text-white/20 text-[8px] font-light tracking-[0.15em]">
                      SECURE SESSION
                    </span>
                  </div>
                </div>

                {/* Loading Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-white/30">
                    <span>Redirecting to Dashboard</span>
                    <span className="text-white/50 font-medium">2s</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-400 via-purple-400 to-pink-400 rounded-full animate-progress"></div>
                  </div>
                </div>

                {/* Footer Text */}
                <p className="mt-4 text-[8px] text-white/20 font-light tracking-widest">
                  {userRole === "admin" ? "👑 Welcome to the Admin Panel" : 
                   userRole === "cabinOwner" ? "🏪 Welcome to Your Dashboard" : 
                   userRole === "doctor" ? "👨‍⚕️ Welcome to Your Medical Dashboard" : 
                   "✨ Explore the best workspaces"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

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
        .animate-progress {
          animation: progress 2.5s ease-in-out forwards;
        }
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
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
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-bounce {
          animation: bounce 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default Login;