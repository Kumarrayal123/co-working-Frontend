// MyProfile.jsx
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
  Loader2
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
      <div className="admin-dash">
        <UsersNavbar />
        <div className="pt-24 px-4 max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="admin-dash__spinner mx-auto" />
            <p className="text-sm text-slate-500 mt-3">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="admin-dash">
        <UsersNavbar />
        <div className="pt-24 px-4 max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <User size={48} className="text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600 font-medium">No profile data found</p>
          </div>
        </div>
      </div>
    );
  }

  const statusBadge = getStatusBadge(profile.status);
  const roleBadge = getRoleBadge(profile.role);

  return (
    <div className="admin-dash">
      <UsersNavbar />

      <main className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16">
        {/* Header */}
        <div className="admin-dash__header">
          <div>
            <h1 className="admin-dash__greeting">
              My <span>Profile</span>
            </h1>
            <p className="admin-dash__subtitle">
              View your profile information.
            </p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Cover Image */}
          <div className="h-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 relative">
            <div className="absolute -bottom-12 left-8">
              <div className="w-24 h-24 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center">
                <User size={40} className="text-indigo-600" />
              </div>
            </div>
            <div className="absolute bottom-4 right-8 flex items-center gap-2">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${statusBadge.color}`}>
                {statusBadge.icon}
                {statusBadge.label}
              </span>
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${roleBadge.color}`}>
                {roleBadge.label}
              </span>
            </div>
          </div>

          {/* Profile Content */}
          <div className="pt-14 px-6 pb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{profile.name}</h2>
              <p className="text-slate-500 text-sm flex items-center gap-1 mt-0.5">
                <Mail size={14} />
                {profile.email}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs font-medium text-slate-500 uppercase">Role</p>
                <p className="text-lg font-bold text-slate-900 mt-1 capitalize">{profile.role}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs font-medium text-slate-500 uppercase">Status</p>
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border mt-1 ${statusBadge.color}`}>
                  {statusBadge.icon}
                  {statusBadge.label}
                </span>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs font-medium text-slate-500 uppercase">Member Since</p>
                <p className="text-sm font-medium text-slate-900 mt-1">{formatDate(profile.createdAt)}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs font-medium text-slate-500 uppercase">User ID</p>
                <p className="text-xs font-mono text-slate-600 mt-1">{profile._id.slice(-8)}</p>
              </div>
            </div>

            {/* Profile Details */}
            <div className="mt-6 border-t border-slate-200 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 border-b border-slate-100 pb-3">
                    <User size={16} /> Personal Information
                  </h3>
                  <div className="space-y-3 mt-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        <User size={16} className="text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Full Name</p>
                        <p className="font-medium text-slate-800">{profile.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <Mail size={16} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Email</p>
                        <p className="font-medium text-slate-800">{profile.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                        <Phone size={16} className="text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Mobile</p>
                        <p className="font-medium text-slate-800">{profile.mobile}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                        <MapPin size={16} className="text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Address</p>
                        <p className="font-medium text-slate-800">{profile.address}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Organization & Documents */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 border-b border-slate-100 pb-3">
                      <Briefcase size={16} /> Organization Details
                    </h3>
                    <div className="space-y-3 mt-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                          <Building2 size={16} className="text-purple-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Organization</p>
                          <p className="font-medium text-slate-800">
                            {profile.organizationName || 'Not provided'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                          <FileText size={16} className="text-orange-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">GST Number</p>
                          <p className="font-medium text-slate-800">
                            {profile.gstNumber || 'Not provided'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                          <Clipboard size={16} className="text-red-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">DMHO Number</p>
                          <p className="font-medium text-slate-800">
                            {profile.dmhoNumber || 'Not provided'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Documents Status */}
                  {profile.role === 'doctor' && (
                    <div>
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 border-b border-slate-100 pb-3">
                        <Upload size={16} /> Document Verification
                      </h3>
                      <div className="space-y-2 mt-4">
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                          <span className="text-sm font-medium text-slate-700">Aadhar Card</span>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getDocStatusBadge(profile.adharCardStatus).color}`}>
                            {getDocStatusBadge(profile.adharCardStatus).icon}
                            {getDocStatusBadge(profile.adharCardStatus).label}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                          <span className="text-sm font-medium text-slate-700">PAN Card</span>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getDocStatusBadge(profile.panCardStatus).color}`}>
                            {getDocStatusBadge(profile.panCardStatus).icon}
                            {getDocStatusBadge(profile.panCardStatus).label}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                          <span className="text-sm font-medium text-slate-700">MBBS Certificate</span>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getDocStatusBadge(profile.mbbsCertificateStatus).color}`}>
                            {getDocStatusBadge(profile.mbbsCertificateStatus).icon}
                            {getDocStatusBadge(profile.mbbsCertificateStatus).label}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                          <span className="text-sm font-medium text-slate-700">PMC Registration</span>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getDocStatusBadge(profile.pmcRegistrationStatus).color}`}>
                            {getDocStatusBadge(profile.pmcRegistrationStatus).icon}
                            {getDocStatusBadge(profile.pmcRegistrationStatus).label}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                          <span className="text-sm font-medium text-slate-700">NMR ID</span>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getDocStatusBadge(profile.nmrIdStatus).color}`}>
                            {getDocStatusBadge(profile.nmrIdStatus).icon}
                            {getDocStatusBadge(profile.nmrIdStatus).label}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyProfile;