// MyProfile.jsx - Redesigned with Consistent UI
import axios from "axios";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  FileText,
  Clipboard,
  CheckCircle,
  XCircle,
  Calendar,
  Clock,
  Briefcase,
  Upload,
  Loader2,
  Eye,
  Edit,
  ArrowUpRight,
  Shield,
  Award,
  CreditCard,
  Home,
  Wallet,
  IndianRupee,
  Users,
  Star,
  Crown
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import UsersNavbar from "./UsersNavbar";
import "./Dashboard.css";

const API_URL = "http://62.72.29.27:5003";

const MyProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const getUserId = () => {
    let userId = localStorage.getItem("userId");
    
    if (!userId) {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1]));
          userId = payload.id || payload.userId || payload._id;
          if (userId) {
            localStorage.setItem("userId", userId);
          }
        }
      } catch (err) {
        console.error("Error extracting userId from token:", err);
      }
    }
    
    return userId;
  };

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to continue");
        navigate("/login");
        return;
      }

      const userId = getUserId();
      if (!userId) {
        toast.error("User ID not found. Please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        navigate("/login");
        return;
      }

      const res = await axios.get(
        `${API_URL}/api/auth/profile/${userId}`,
        getAuthHeader()
      );

      if (res.data.success && res.data.user) {
        setProfile(res.data.user);
      } else {
        toast.error("Failed to load profile data");
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      if (err.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        navigate("/login");
      } else if (err.response?.status === 404) {
        toast.error("User not found");
        navigate("/login");
      } else {
        toast.error(err.response?.data?.message || "Failed to fetch profile");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'active': { label: 'Active', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: <CheckCircle size={14} /> },
      'pending': { label: 'Pending', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: <Clock size={14} /> },
      'rejected': { label: 'Rejected', color: 'bg-red-100 text-red-700 border-red-200', icon: <XCircle size={14} /> }
    };
    return statusMap[status] || statusMap.pending;
  };

  const getDocStatusBadge = (status) => {
    const statusMap = {
      'approved': { label: 'Verified', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: <CheckCircle size={12} /> },
      'pending': { label: 'Pending', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: <Clock size={12} /> },
      'rejected': { label: 'Rejected', color: 'bg-red-100 text-red-700 border-red-200', icon: <XCircle size={12} /> }
    };
    return statusMap[status] || statusMap.pending;
  };

  const getRoleBadge = (role) => {
    const roleMap = {
      'doctor': { label: 'Doctor', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
      'admin': { label: 'Admin', color: 'bg-purple-100 text-purple-700 border-purple-200' },
      'user': { label: 'User', color: 'bg-slate-100 text-slate-700 border-slate-200' }
    };
    return roleMap[role] || roleMap.user;
  };

  if (loading) {
    return (
      <div className="admin-dash" style={{ backgroundColor: '#ffffff' }}>
        <UsersNavbar />
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="admin-dash" style={{ backgroundColor: '#ffffff' }}>
        <UsersNavbar />
        <div className="pt-24 px-3 sm:px-4 md:px-6 lg:px-8 max-w-full mx-auto pb-16">
          <div className="flex flex-col items-center justify-center gap-4 py-20 text-gray-400">
            <User size={48} className="opacity-20" />
            <p className="text-lg font-medium">No profile data found</p>
          </div>
        </div>
      </div>
    );
  }

  const statusBadge = getStatusBadge(profile.status);
  const roleBadge = getRoleBadge(profile.role);

  // Count verified documents
  const docStatuses = [
    profile.adharCardStatus,
    profile.panCardStatus,
    profile.mbbsCertificateStatus,
    profile.pmcRegistrationStatus,
    profile.nmrIdStatus
  ];
  const verifiedDocs = docStatuses.filter(s => s === 'approved').length;
  const totalDocs = docStatuses.length;

  return (
    <div className="admin-dash" style={{ backgroundColor: '#ffffff' }}>
      <UsersNavbar />

      <div className="pt-24 px-3 sm:px-4 md:px-6 lg:px-8 max-w-full mx-auto pb-16">
        {/* Header */}
        <div className="admin-dash__header">
          <div>
            <h1 className="admin-dash__greeting">
              My <span>Profile</span>
            </h1>
            <p className="admin-dash__subtitle">
              View and manage your profile information.
            </p>
          </div>
          <div className="admin-dash__date-pill">
            <Calendar size={16} />
            <span>
              {new Date().toLocaleDateString("en-US", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Cover Image */}
          <div className="h-32 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 relative">
            <div className="absolute -bottom-12 left-6 sm:left-8">
              <div className="w-24 h-24 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center">
                <span className="text-3xl font-bold text-indigo-600">
                  {profile.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
            </div>
            <div className="absolute bottom-4 right-4 flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border bg-white/90 backdrop-blur-sm ${statusBadge.color}`}>
                {statusBadge.icon}
                {statusBadge.label}
              </span>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border bg-white/90 backdrop-blur-sm ${roleBadge.color}`}>
                {roleBadge.label}
              </span>
            </div>
          </div>

          {/* Profile Content */}
          <div className="pt-14 px-4 sm:px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
                <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
                  <Mail size={14} className="text-gray-400" />
                  {profile.email}
                </p>
              </div>
              <button
                onClick={() => navigate("/edit-profile")}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-sm font-medium hover:bg-indigo-100 transition-colors border border-indigo-200"
              >
                <Edit size={14} />
                Edit Profile
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Role</p>
                <p className="text-lg font-bold text-gray-900 mt-1 capitalize">{profile.role}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</p>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full border mt-1 ${statusBadge.color}`}>
                  {statusBadge.icon}
                  {statusBadge.label}
                </span>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Member Since</p>
                <p className="text-sm font-medium text-gray-900 mt-1">{formatDate(profile.createdAt)}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">User ID</p>
                <p className="text-xs font-mono text-gray-600 mt-1">#{profile._id.slice(-8).toUpperCase()}</p>
              </div>
            </div>

            {/* Profile Details */}
            <div className="mt-6 border-t border-gray-200 pt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-gray-200">
                    <User size={14} className="text-indigo-600" /> Personal Information
                  </h3>
                  <div className="space-y-3 mt-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                        <User size={14} className="text-indigo-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Full Name</p>
                        <p className="font-medium text-gray-800 text-sm truncate">{profile.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Mail size={14} className="text-blue-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Email</p>
                        <p className="font-medium text-gray-800 text-sm truncate">{profile.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <Phone size={14} className="text-emerald-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Mobile</p>
                        <p className="font-medium text-gray-800 text-sm">{profile.mobile}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center flex-shrink-0">
                        <MapPin size={14} className="text-yellow-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Address</p>
                        <p className="font-medium text-gray-800 text-sm">{profile.address}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Organization Details */}
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-gray-200">
                    <Building2 size={14} className="text-purple-600" /> Organization Details
                  </h3>
                  <div className="space-y-3 mt-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <Building2 size={14} className="text-purple-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Organization</p>
                        <p className="font-medium text-gray-800 text-sm truncate">
                          {profile.organizationName || 'Not provided'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                        <FileText size={14} className="text-orange-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">GST Number</p>
                        <p className="font-medium text-gray-800 text-sm">
                          {profile.gstNumber || 'Not provided'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                        <Clipboard size={14} className="text-red-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">DMHO Number</p>
                        <p className="font-medium text-gray-800 text-sm">
                          {profile.dmhoNumber || 'Not provided'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Document Verification - Only for doctor */}
            {profile.role === 'doctor' && (
              <div className="mt-6 border-t border-gray-200 pt-6">
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                      <Upload size={14} className="text-indigo-600" /> Document Verification
                    </h3>
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      {verifiedDocs}/{totalDocs} Verified
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                    <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100">
                      <span className="text-sm font-medium text-gray-700">Aadhar Card</span>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${getDocStatusBadge(profile.adharCardStatus).color}`}>
                        {getDocStatusBadge(profile.adharCardStatus).icon}
                        {getDocStatusBadge(profile.adharCardStatus).label}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100">
                      <span className="text-sm font-medium text-gray-700">PAN Card</span>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${getDocStatusBadge(profile.panCardStatus).color}`}>
                        {getDocStatusBadge(profile.panCardStatus).icon}
                        {getDocStatusBadge(profile.panCardStatus).label}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100">
                      <span className="text-sm font-medium text-gray-700">MBBS Certificate</span>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${getDocStatusBadge(profile.mbbsCertificateStatus).color}`}>
                        {getDocStatusBadge(profile.mbbsCertificateStatus).icon}
                        {getDocStatusBadge(profile.mbbsCertificateStatus).label}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100">
                      <span className="text-sm font-medium text-gray-700">PMC Registration</span>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${getDocStatusBadge(profile.pmcRegistrationStatus).color}`}>
                        {getDocStatusBadge(profile.pmcRegistrationStatus).icon}
                        {getDocStatusBadge(profile.pmcRegistrationStatus).label}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100">
                      <span className="text-sm font-medium text-gray-700">NMR ID</span>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${getDocStatusBadge(profile.nmrIdStatus).color}`}>
                        {getDocStatusBadge(profile.nmrIdStatus).icon}
                        {getDocStatusBadge(profile.nmrIdStatus).label}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  onClick={() => navigate("/mybookings")}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-medium hover:bg-indigo-100 transition-colors border border-indigo-200"
                >
                  <Calendar size={14} />
                  My Bookings
                </button>
                <button
                  onClick={() => navigate("/mycabin")}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-medium hover:bg-emerald-100 transition-colors border border-emerald-200"
                >
                  <Home size={14} />
                  My Cabins
                </button>
                <button
                  onClick={() => navigate("/userwallet")}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-amber-50 text-amber-700 rounded-xl text-xs font-medium hover:bg-amber-100 transition-colors border border-amber-200"
                >
                  <Wallet size={14} />
                  My Wallet
                </button>
                <button
                  onClick={() => navigate("/my-cabin-payments")}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-50 text-purple-700 rounded-xl text-xs font-medium hover:bg-purple-100 transition-colors border border-purple-200"
                >
                  <CreditCard size={14} />
                  Payments
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;