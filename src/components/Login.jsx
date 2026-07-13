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
  Loader2
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // First try admin login with hardcoded credentials
      if (email === "saidulureddy@gmail.com" && password === "reddy123") {
        const token = "mocked-admin-token-for-saidulu";
        const adminData = {
          _id: "68ebe9ee8f06d33ee022d665",
          name: "Saidulu Reddy",
          email: "saidulureddy@gmail.com",
          role: "admin"
        };

        localStorage.setItem("token", token);
        localStorage.setItem("admin", JSON.stringify(adminData));
        
        setUserName(adminData.name);
        setShowSuccessPopup(true);
        setLoading(false);
        
        setTimeout(() => {
          setShowSuccessPopup(false);
          navigate("/admindashboard");
        }, 2000);
        return;
      }

      // If not admin, try user login with backend API
      const res = await axios.post("http://62.72.29.27:5003/api/auth/login", {
        email,
        password
      });

      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      
      setUserName(user.name || "User");
      setShowSuccessPopup(true);
      setLoading(false);
      
      setTimeout(() => {
        setShowSuccessPopup(false);
        navigate("/userdashboard");
      }, 2000);
      
    } catch (err) {
      console.error("Login Error:", err);
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Login failed! Please check credentials.";
      setError(errorMsg);
      toast.error(errorMsg);
      setLoading(false);
    }
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

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-400/20 to-blue-500/20 rounded-2xl mb-4 shadow-lg shadow-emerald-500/10 border border-white/10 backdrop-blur-sm relative group transition-all duration-300 hover:scale-105">
              <span className="text-2xl font-light tracking-wider text-white/90 group-hover:text-white transition-colors">IG</span>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full blur-sm animate-pulse"></div>
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
                className="text-[11px] text-emerald-400/50 hover:text-emerald-400/80 transition-colors font-light tracking-wider"
                onClick={() => toast.info("Contact support to reset password")}
              >
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
              <a href="/register" className="font-normal text-emerald-400/70 hover:text-emerald-400 transition-colors hover:underline underline-offset-2">
                Create Account
              </a>
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
      {/* SUCCESS POPUP */}
      {/* ====================== */}
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
            {/* Success Animation */}
            <div className="text-center">
              <div className="relative inline-flex items-center justify-center w-20 h-20 mb-4">
                <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping"></div>
                <div className="absolute inset-0 bg-emerald-500/10 rounded-full animate-pulse"></div>
                <div className="relative w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <CheckCircle size={32} className="text-white" />
                </div>
              </div>
              
              <h3 className="text-xl font-light text-white tracking-wide">
                Welcome Back!
              </h3>
              <p className="text-white/60 text-sm font-light mt-1">
                {userName || "User"}
              </p>
              <div className="mt-2 flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce delay-150"></span>
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce delay-300"></span>
              </div>
              <p className="text-white/30 text-xs font-light mt-3 tracking-wider">
                Redirecting to dashboard...
              </p>
              
              {/* Loading Progress Bar */}
              <div className="mt-4 w-full h-0.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-400 via-blue-500 to-indigo-500 rounded-full animate-progress"></div>
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
          animation: progress 2s ease-in-out forwards;
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
      `}</style>
    </div>
  );
}

export default Login;