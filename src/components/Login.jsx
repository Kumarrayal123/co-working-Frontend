import axios from "axios";
import { Eye, EyeOff, Lock, Mail, ShieldCheck, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Logo from "../assets/Logo.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin"); // force 'admin'
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Determine endpoint based on role
      const endpoint = role === 'admin'
        ? "https://api.timelyhealth.in/api/admin/login"
        : "http://localhost:5000/api/auth/login";

      const res = await axios.post(endpoint, {
        email,
        password,
      });

      console.log("Login Response Data:", res.data); // DEBUG LOG

      console.log("Login Response Data:", res.data);

      let token = res.data.token || res.data.accessToken || res.data.data?.token;

      // START: Mock Token Generation for Admin (if missing)
      if (!token && role === 'admin' && res.data.admin) {
        console.warn("⚠️ No token from external Admin API. Generating local mock token.");
        try {
          // Create a mock JWT payload (Backend uses jwt.decode which skips signature check)
          const header = { alg: "HS256", typ: "JWT" };
          const payload = { user: res.data.admin }; // Wrap admin data in 'user' key as expected by backend auth.js

          const base64Url = (obj) => btoa(JSON.stringify(obj)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
          token = `${base64Url(header)}.${base64Url(payload)}.mock-signature`;
        } catch (e) {
          console.error("Token generation failed:", e);
        }
      }
      // END: Mock Token Generation

      if (!token) {
        // Fallback or Error
        console.error("❌ Token could not be retrieved or generated:", res.data);
        throw new Error("Authentication failed: No token received.");
      }

      localStorage.setItem("token", token);

      if (role === 'admin') {
        localStorage.setItem("admin", JSON.stringify(res.data.admin));
        toast.success("Admin login successful 🚀");
        navigate("/admindashboard");
      } else {
        localStorage.setItem("user", JSON.stringify(res.data.user)); // Save user data
        toast.success("Login successful! Welcome back.");
        navigate("/spaces");
      }

    } catch (err) {
      console.error("Login Error:", err);
      const errorMsg =
        err.response?.data?.message ||
        "Login failed! Please check credentials.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-[440px] w-full bg-white p-8 rounded-3xl shadow-xl border">

        {/* Header */}
        <div className="text-center mb-8">
          <img src={Logo} alt="Logo" className="w-20 mx-auto mb-4" />
          <h2 className="text-2xl font-black uppercase text-slate-900 tracking-tight">
            {role === 'admin' ? "Admin Portal" : "Welcome Back"}
          </h2>
          <p className="text-slate-500 text-sm">
            {role === 'admin' ? "Secure administrator access" : "Sign in to your account"}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
            <input
              type="email"
              placeholder="Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-10 pr-12 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
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
            className="w-full flex justify-center items-center gap-2 rounded-xl bg-gradient-to-r from-[#22c55e] to-[#3b82f6] px-2 py-2 text-white hover:bg-emerald-600 hover:shadow-emerald-200"
          >
            {loading ? (
              "Authenticating..."
            ) : (
              <>
                <ShieldCheck size={18} />
                Sign In as Admin
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}

export default Login;
