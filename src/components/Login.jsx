// import React, { useState } from "react";
// import axios from "axios";
// import "./Login.css";

// function Login() {
//   const [formData, setFormData] = useState({ email: "", password: "" });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post("http://localhost:5000/api/auth/login", formData);
//       alert("Welcome " + res.data.user.name);
//       localStorage.setItem("token", res.data.token);
//     } catch (err) {
//       alert(err.response.data.message);
//     }
//   };

//   return (
//     <div className="page-wrapper">
//       <div className="login-container">
//         <h2>Login</h2>
//         <form onSubmit={handleSubmit}>
//           <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
//           <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
//           <button type="submit">Login</button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default Login;



// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import 'react-toastify/dist/ReactToastify.css';


// function Login() {
//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post("http://localhost:5000/api/auth/login", formData);
//       alert("Welcome " + res.data.user.name);

//       // Save user info to localStorage
//       localStorage.setItem("user", JSON.stringify(res.data.user));

//       // Redirect to homepage or dashboard
//       navigate("/home"); // change as per your route
//     } catch (err) {
//       alert(err.response.data.message);
//     }
//   };

//   return (
//     <div className="page-wrapper">
//       <div className="login-container">
//         <h2>Login</h2>
//         <form onSubmit={handleSubmit}>
//           <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
//           <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
//           <button type="submit">Login</button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default Login;



// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import 'react-toastify/dist/ReactToastify.css'; // ✅ important

// function Login() {
//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post("http://localhost:5000/api/auth/login", formData);

//       // Show success toast
//       toast.success(`Welcome ${res.data.user.name}!`, {
//         position: "top-right",
//         autoClose: 3000,
//         hideProgressBar: false,
//         pauseOnHover: true,
//         draggable: true,
//       });

//       // Save user info to localStorage
//       localStorage.setItem("user", JSON.stringify(res.data.user));

//       // Redirect after toast
//       setTimeout(() => {
//         navigate("/home");
//       }, 1500);

//     } catch (err) {
//       toast.error(err.response?.data?.message || "Login failed", {
//         position: "top-right",
//         autoClose: 3000,
//         hideProgressBar: false,
//         pauseOnHover: true,
//         draggable: true,
//       });
//     }
//   };

//   return (
//     <div className="page-wrapper">
//       <div className="login-container">
//         <h2>Login</h2>
//         <form onSubmit={handleSubmit}>
//           <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
//           <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
//           <button type="submit">Login</button>
//         </form>
//       </div>

//       {/* ToastContainer must be rendered somewhere in the app */}
//       <ToastContainer />
//     </div>
//   );
// }

// export default Login;


// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate()

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await axios.post("http://localhost:5000/api/auth/login", {
//         email,
//         password,
//       });

//       // Store token
//       localStorage.setItem("token", res.data.token);

//       alert("Login Successful!");

//       // Navigate to Admin Dashboard
//       // window.location.href = "/all-users";
//       navigate('/home')

//     } catch (err) {
//       setError(err.response?.data?.message || "Login failed!");
//     }
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>Login</h2>

//       {error && <p style={{ color: "red" }}>{error}</p>}

//       <form onSubmit={handleLogin}>
//         <input
//           type="email"
//           placeholder="Enter email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         /><br/><br/>

//         <input
//           type="password"
//           placeholder="Enter password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         /><br/><br/>

//         <button type="submit">Login</button>
//       </form>
//     </div>
//   );
// }

// export default Login;

import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, LogIn } from "lucide-react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user._id); // Assuming backend sends user object or ID

      // alert("Login Successful!"); // Removed alert for smoother UX, can use Toast if needed

      // Navigate to Home component
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed! Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-emerald-500/5 blur-3xl"></div>
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] rounded-full bg-indigo-500/5 blur-3xl"></div>
      </div>

      <div className="max-w-[440px] w-full bg-white p-10 rounded-3xl shadow-2xl border border-slate-100 z-10 relative">
        <div className="text-center mb-10">
          <div className="mx-auto h-14 w-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-5 shadow-sm rotate-3 transform hover:rotate-6 transition-transform">
            <LogIn size={26} className="text-emerald-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h2>
          <p className="mt-3 text-slate-500 text-base">
            Sign in to access your workspace
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100 flex items-center gap-2 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-5">
            {/* Email */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail size={18} className="text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
              </div>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
              />
            </div>

            {/* Password */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock size={18} className="text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
              </div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-3.5 px-4 border border-transparent text-base font-semibold rounded-xl text-white ${loading ? 'bg-emerald-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 hover:scale-[1.02] active:scale-[0.98]'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all shadow-lg shadow-emerald-500/20`}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>
        </form>

        <div className="text-center mt-8 pt-6 border-t border-slate-100">
          <p className="text-slate-500 text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;


