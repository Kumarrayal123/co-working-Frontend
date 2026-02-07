import axios from "axios";
import { Lock, Mail, ShieldCheck, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Logo from "../assets/Logo.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // 'user' or 'admin'
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Determine endpoint based on role
      const endpoint = role === 'admin'
        ? "http://localhost:5000/api/admin/login"
        : "http://localhost:5000/api/auth/login";

      const res = await axios.post(endpoint, {
        email,
        password,
      });

      // Save token & user details
      localStorage.setItem("token", res.data.token);

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
          <h2 className="text-3xl font-extrabold text-slate-900">
            {role === 'admin' ? "Admin Portal" : "Welcome Back"}
          </h2>
          <p className="text-slate-500 text-sm">
            {role === 'admin' ? "Secure administrator access" : "Sign in to your account"}
          </p>
          {role === 'admin' && (
            <p className="text-xs text-indigo-500 mt-2 font-medium bg-indigo-50 py-1 px-2 rounded-lg inline-block">
              🔒 Connecting to timelyhealth.in via Secure Proxy
            </p>
          )}
        </div>

        {/* Role Toggle */}
        <div className="flex p-1 mb-6 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => setRole("user")}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${role === "user"
              ? "bg-white text-indigo-600 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
              }`}
          >
            <User size={16} /> User
          </button>
          <button
            type="button"
            onClick={() => setRole("admin")}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${role === "admin"
              ? "bg-white text-indigo-600 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
              }`}
          >
            <ShieldCheck size={16} /> Admin
          </button>
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
              placeholder={role === 'admin' ? "Admin Email" : "User Email"}
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
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-60 transition-all"
          >
            {loading ? (
              "Authenticating..."
            ) : (
              <>
                {role === 'admin' ? <ShieldCheck size={18} /> : <User size={18} />}
                Sign In as {role === 'admin' ? "Admin" : "User"}
              </>
            )}
          </button>
        </form>

        {/* Register Link (User Only) */}
        {role === 'user' && (
          <p className="mt-6 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-indigo-600 font-semibold cursor-pointer hover:underline"
            >
              Register here
            </span>
          </p>
        )}
      </div>
    </div>
  );
}

export default Login;
