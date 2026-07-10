import axios from "axios";
import { Eye, EyeOff, Lock, Mail, ShieldCheck, User, Building2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Logo from "../assets/Selection (1).png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
        toast.success("Admin login successful 🚀");
        navigate("/admindashboard");
        return;
      }

      // If not admin, try user login with backend API
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password
      });

      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      toast.success("Login successful! 🎉");
      navigate("/userdashboard");
    } catch (err) {
      console.error("Login Error:", err);
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Login failed! Please check credentials.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-[440px] w-full">
        <div className="bg-white/95 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20">

          {/* Header */}
          <div className="text-center mb-8">
            {/* <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl mb-4 shadow-lg shadow-emerald-500/30">
              <Building2 className="text-white" size={36} />
            </div> */}
               <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto'}} className="an-nav__logo-icon">
              <span className="an-nav__logo-ig">IG</span>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
              IRYAX Workspace
            </h2>
            <p className="text-slate-500 text-sm">
              Sign in to access your workspace dashboard
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg flex items-center gap-2">
              <ShieldCheck size={16} />
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div className="relative group">
              <Mail className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
              <input
                type="email"
                placeholder="Admin Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none group-hover:border-slate-300"
              />
            </div>

            {/* Password */}
            <div className="relative group">
              <Lock className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none group-hover:border-slate-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-600 px-4 py-3.5 text-white font-semibold hover:from-emerald-600 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Authenticating...
                </>
              ) : (
                <>
                  <ShieldCheck size={18} />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center space-y-3">
            <p className="text-sm text-slate-500">
              Don't have an account?{" "}
              <a href="/register" className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline transition-colors">
                Create Account
              </a>
            </p>
            <p className="text-xs text-slate-400">
              Protected by enterprise-grade security
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;
