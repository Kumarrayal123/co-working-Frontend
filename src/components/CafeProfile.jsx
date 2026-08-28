// CafeProfile.jsx - Complete Cafe Owner & Partner Profile Management
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CafeNavbar from "./CafeNavbar";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  FileText,
  CheckCircle,
  XCircle,
  Calendar,
  Clock,
  Briefcase,
  Upload,
  Loader2,
  Eye,
  Edit,
  Shield,
  Award,
  CreditCard,
  Home,
  Wallet,
  IndianRupee,
  Users,
  Star,
  Crown,
  AlertCircle,
  Check,
  X,
  IdCard,
  FileCheck,
  FileImage,
  UtensilsCrossed,
  Coffee,
  Sparkles,
  Lock,
  Download
} from "lucide-react";
import { toast } from "react-toastify";
import "./Dashboard.css";

const API_URL = import.meta.env.VITE_API_URL || "https://spaceapi.iryax.com";

const CafeProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [missingFields, setMissingFields] = useState([]);
  const [stats, setStats] = useState({
    totalTables: 0,
    totalBookings: 0,
    totalRevenue: 0,
    walletBalance: 0,
  });

  // Edit Profile State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    organizationName: "",
    gstNumber: "",
    panNumber: "",
    licenseNumber: "",
  });

  // Change Password State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  // Document View State
  const [showDocModal, setShowDocModal] = useState(false);
  const [viewDoc, setViewDoc] = useState({ title: "", url: "" });

  const navigate = useNavigate();

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const getUserId = () => {
    let userId = localStorage.getItem("userId");
    if (!userId) {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const u = JSON.parse(userStr);
          userId = u._id || u.id;
        } catch (e) {
          console.error(e);
        }
      }
    }
    if (!userId) {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const payload = JSON.parse(atob(token.split(".")[1]));
          userId = payload.id || payload.userId || payload._id;
        }
      } catch (err) {
        console.error("Error extracting userId from token:", err);
      }
    }
    return userId;
  };

  // Calculate completion
  const calculateCompletion = (user) => {
    const requiredFields = [
      { key: "name", label: "Full Name" },
      { key: "email", label: "Email Address" },
      { key: "mobile", label: "Mobile Number" },
      { key: "address", label: "Address" },
      { key: "organizationName", label: "Cafe / Business Name" },
      { key: "gstNumber", label: "GST Number" },
      { key: "panNumber", label: "PAN Number" },
    ];

    let completed = 0;
    const missing = [];

    requiredFields.forEach((f) => {
      if (user[f.key] && user[f.key].toString().trim() !== "") {
        completed++;
      } else {
        missing.push(f.label);
      }
    });

    const pct = Math.round((completed / requiredFields.length) * 100);
    return { percentage: Math.max(pct, 20), missing };
  };

  // ─── FETCH PROFILE & STATS ───
  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const userId = getUserId();
      const token = localStorage.getItem("token");

      if (!userId || !token) {
        toast.error("Please login to view your profile");
        navigate("/login");
        return;
      }

      // 1. Fetch user data
      const res = await axios.get(`${API_URL}/api/auth/profile/${userId}`, getAuthHeader());
      if (res.data.success && res.data.user) {
        const userData = res.data.user;
        setProfile(userData);
        const { percentage, missing } = calculateCompletion(userData);
        setCompletionPercentage(percentage);
        setMissingFields(missing);

        setEditFormData({
          name: userData.name || "",
          email: userData.email || "",
          mobile: userData.mobile || "",
          address: userData.address || "",
          organizationName: userData.organizationName || "",
          gstNumber: userData.gstNumber || "",
          panNumber: userData.panNumber || "",
          licenseNumber: userData.licenseNumber || "",
        });
      } else {
        // Fallback to localStorage data
        const localUser = localStorage.getItem("user");
        if (localUser) {
          const u = JSON.parse(localUser);
          setProfile(u);
        }
      }

      // 2. Fetch cafe tables & bookings count
      try {
        const [cabinsRes, bookingsRes] = await Promise.all([
          axios.get(`${API_URL}/api/cabins`),
          axios.get(`${API_URL}/api/bookings/owner-bookings`, getAuthHeader()),
        ]);

        const allCabins = Array.isArray(cabinsRes.data.cabins || cabinsRes.data)
          ? cabinsRes.data.cabins || cabinsRes.data
          : [];
        const ownerTables = allCabins.filter((c) => {
          const ownerId = typeof c.owner === "object" ? c.owner?._id : c.owner;
          return ownerId === userId && (c.isCafe || !c.isChamber);
        });

        const allBookings = bookingsRes.data.bookings || bookingsRes.data || [];
        const totalRev = allBookings.reduce((sum, b) => sum + (b.totalPrice || b.amount || 0), 0);

        setStats({
          totalTables: ownerTables.length,
          totalBookings: allBookings.length,
          totalRevenue: totalRev,
          walletBalance: 0,
        });
      } catch (statsErr) {
        console.warn("Could not fetch auxiliary stats", statsErr);
      }
    } catch (err) {
      console.error("Error fetching cafe profile:", err);
      // Fallback
      const localUser = localStorage.getItem("user");
      if (localUser) {
        try {
          const u = JSON.parse(localUser);
          setProfile(u);
        } catch (e) {
          console.error(e);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  // ─── UPDATE PROFILE HANDLER ───
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      const userId = getUserId();
      const token = localStorage.getItem("token");

      const res = await axios.put(
        `${API_URL}/api/auth/profile/${userId}`,
        editFormData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success || res.data.user) {
        const updated = res.data.user || { ...profile, ...editFormData };
        setProfile(updated);
        localStorage.setItem("user", JSON.stringify(updated));
        const { percentage, missing } = calculateCompletion(updated);
        setCompletionPercentage(percentage);
        setMissingFields(missing);

        toast.success("Profile updated successfully!");
        setShowEditModal(false);
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setEditLoading(false);
    }
  };

  // ─── RESET / CHANGE PASSWORD ───
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setPasswordLoading(true);
    try {
      await axios.post(`${API_URL}/api/auth/reset-password`, {
        email: profile.email,
        newPassword: passwordData.newPassword,
      });

      toast.success("Password changed successfully!");
      setShowPasswordModal(false);
      setPasswordData({ newPassword: "", confirmPassword: "" });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setPasswordLoading(false);
    }
  };

  const initials = profile?.name ? profile.name.slice(0, 2).toUpperCase() : "CO";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5]">
        <CafeNavbar />
        <div className="flex flex-col items-center justify-center h-[70vh] gap-3">
          <Loader2 size={40} className="text-amber-600 animate-spin" />
          <p className="text-sm font-semibold text-slate-600">Loading your profile details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]" style={{ fontFamily: "Inter, sans-serif" }}>
      <CafeNavbar />

      <div className="pt-24 px-3 sm:px-4 md:px-6 lg:px-8 max-w-6xl mx-auto pb-20">
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-6">
          <div className="h-32 sm:h-40 bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 relative">
            <div className="absolute top-4 right-4 flex gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-md border border-white/20 flex items-center gap-1.5">
                <Coffee size={13} /> Cafe Dining Partner
              </span>
            </div>
          </div>

          <div className="px-6 pb-6 pt-0 relative flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-16 sm:-mt-12 text-center sm:text-left">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-amber-500 to-amber-800 text-white font-black text-2xl sm:text-3xl flex items-center justify-center border-4 border-white shadow-lg shadow-amber-900/20 flex-shrink-0">
                {initials}
              </div>
              <div className="pt-2">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">{profile?.name || "Cafe Partner"}</h2>
                  <CheckCircle size={18} className="text-emerald-500" />
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {profile?.organizationName ? `${profile.organizationName} • ` : ""}Cafe Owner & Table Host
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{profile?.email}</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2.5 flex-wrap">
              <button
                onClick={() => setShowPasswordModal(true)}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Lock size={13} />
                <span>Password</span>
              </button>
              <button
                onClick={() => setShowEditModal(true)}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-amber-600/20 cursor-pointer flex items-center gap-1.5"
              >
                <Edit size={13} />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>
        </div>

        {/* ─── QUICK METRICS STRIP ─── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Active Tables</span>
              <UtensilsCrossed size={16} className="text-amber-600" />
            </div>
            <p className="text-2xl font-black text-slate-900">{stats.totalTables}</p>
            <span className="text-[10px] text-slate-400">Listed on IRYAX</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Total Bookings</span>
              <Calendar size={16} className="text-indigo-600" />
            </div>
            <p className="text-2xl font-black text-slate-900">{stats.totalBookings}</p>
            <span className="text-[10px] text-slate-400">Guest dining sessions</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Total Revenue</span>
              <IndianRupee size={16} className="text-emerald-600" />
            </div>
            <p className="text-2xl font-black text-slate-900">₹{stats.totalRevenue.toLocaleString("en-IN")}</p>
            <span className="text-[10px] text-slate-400">Earned from dining</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Profile Score</span>
              <Award size={16} className="text-amber-500" />
            </div>
            <p className="text-2xl font-black text-amber-600">{completionPercentage}%</p>
            <span className="text-[10px] text-emerald-600 font-semibold">Verified Partner</span>
          </div>
        </div>

        {/* ─── DETAILS GRID ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Personal & Contact Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Candidate / Personal Details Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <User size={16} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Personal & Contact Details</h3>
                    <p className="text-[11px] text-slate-400">Primary candidate information</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Full Name
                  </span>
                  <p className="font-bold text-slate-800 text-sm">{profile?.name || "N/A"}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Email Address
                  </span>
                  <p className="font-bold text-slate-800 text-sm">{profile?.email || "N/A"}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Mobile Number
                  </span>
                  <p className="font-bold text-slate-800 text-sm">{profile?.mobile || "Not specified"}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Role & Account Type
                  </span>
                  <p className="font-bold text-amber-700 text-sm uppercase">Cafe Owner & Partner</p>
                </div>

                <div className="sm:col-span-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Official Address / Registered Location
                  </span>
                  <p className="font-semibold text-slate-700 leading-relaxed flex items-center gap-1.5">
                    <MapPin size={14} className="text-amber-600 flex-shrink-0" />
                    {profile?.address || "Address not provided yet"}
                  </p>
                </div>
              </div>
            </div>

            {/* Business & Organization Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Building2 size={16} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Cafe & Business Registration</h3>
                    <p className="text-[11px] text-slate-400">Legal business entity credentials</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Cafe / Establishment Name
                  </span>
                  <p className="font-bold text-slate-800 text-sm">
                    {profile?.organizationName || "The Roastery Coffee & Dining"}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    GSTIN / Tax ID
                  </span>
                  <p className="font-mono font-bold text-slate-800 text-sm">
                    {profile?.gstNumber || "GSTIN Not Provided"}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    PAN Card Number
                  </span>
                  <p className="font-mono font-bold text-slate-800 text-sm">
                    {profile?.panNumber || "PAN Not Provided"}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Verification Status
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle size={12} /> Approved Partner
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Actions & Quick Links */}
          <div className="space-y-6">
            {/* Quick Actions Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <h4 className="font-bold text-slate-900 text-sm mb-3">Quick Navigation</h4>
              <div className="space-y-2">
                <button
                  onClick={() => navigate("/mycafes")}
                  className="w-full p-3 rounded-xl bg-amber-50/70 hover:bg-amber-100/70 border border-amber-200 text-amber-900 text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <UtensilsCrossed size={16} className="text-amber-700" />
                    <span>Manage Cafe Tables</span>
                  </div>
                  <span className="text-[10px] bg-amber-600 text-white px-2 py-0.5 rounded-full">
                    {stats.totalTables} Tables
                  </span>
                </button>

                <button
                  onClick={() => navigate("/cafebookings")}
                  className="w-full p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-indigo-600" />
                    <span>View Dining Bookings</span>
                  </div>
                  <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full">
                    {stats.totalBookings}
                  </span>
                </button>

                <button
                  onClick={() => navigate("/cafewallet")}
                  className="w-full p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Wallet size={16} className="text-emerald-600" />
                    <span>My Cafe Wallet</span>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-black">₹{stats.totalRevenue}</span>
                </button>

                <button
                  onClick={() => navigate("/cafe")}
                  className="w-full p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Coffee size={16} className="text-amber-600" />
                    <span>IRYAX Cafe Dining Page</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Profile Health / Missing Fields */}
            {missingFields.length > 0 && (
              <div className="bg-amber-50 rounded-2xl border border-amber-200 p-4">
                <div className="flex items-center gap-2 text-amber-800 font-bold text-xs mb-1">
                  <AlertCircle size={15} />
                  <span>Profile Suggestions</span>
                </div>
                <p className="text-[11px] text-amber-700 leading-relaxed mb-2">
                  Complete these details to enhance your venue listing credibility:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {missingFields.map((f, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-white border border-amber-200 text-[10px] font-semibold text-amber-900">
                      + {f}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── EDIT PROFILE MODAL ─── */}
      {showEditModal && (
        <div className="fixed inset-0 z-[10500] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden p-6 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Edit size={16} />
                </div>
                <h4 className="text-base font-bold text-slate-900">Edit Candidate Details</h4>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center"
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-3.5 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-amber-500 text-xs sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Mobile Number *</label>
                  <input
                    type="text"
                    required
                    value={editFormData.mobile}
                    onChange={(e) => setEditFormData({ ...editFormData, mobile: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-amber-500 text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Email (Read-only)</label>
                  <input
                    type="email"
                    disabled
                    value={editFormData.email}
                    className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Cafe / Business Name</label>
                <input
                  type="text"
                  placeholder="e.g. Roastery Coffee House"
                  value={editFormData.organizationName}
                  onChange={(e) => setEditFormData({ ...editFormData, organizationName: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-amber-500 text-xs sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">GSTIN Number</label>
                  <input
                    type="text"
                    placeholder="29AAAAA0000A1Z5"
                    value={editFormData.gstNumber}
                    onChange={(e) => setEditFormData({ ...editFormData, gstNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-amber-500 text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">PAN Card Number</label>
                  <input
                    type="text"
                    placeholder="ABCDE1234F"
                    value={editFormData.panNumber}
                    onChange={(e) => setEditFormData({ ...editFormData, panNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-amber-500 text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Address / City *</label>
                <textarea
                  rows={2}
                  required
                  value={editFormData.address}
                  onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-amber-500 text-xs sm:text-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition-all shadow"
                >
                  {editLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── CHANGE PASSWORD MODAL ─── */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-[10500] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <h4 className="text-base font-bold text-slate-900">Change Account Password</h4>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center"
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">New Password *</label>
                <input
                  type="password"
                  required
                  placeholder="Min 6 characters"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Confirm Password *</label>
                <input
                  type="password"
                  required
                  placeholder="Repeat new password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="py-2 rounded-xl border border-slate-200 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition-all shadow"
                >
                  {passwordLoading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CafeProfile;