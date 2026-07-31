// SimpleUserProfile.jsx - With Profile Completion Percentage
import axios from "axios";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Shield,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Crown
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SimpleUserNavbar from "./SimpleUserNavbar";

const API_URL = "https://spaceapi.iryax.com";

const SimpleUserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [missingFields, setMissingFields] = useState([]);
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
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

  // Calculate profile completion percentage - ONLY BASIC FIELDS
  const calculateCompletion = (userData) => {
    const fields = [
      { key: 'name', label: 'Full Name', required: true },
      { key: 'email', label: 'Email Address', required: true },
      { key: 'mobile', label: 'Mobile Number', required: true },
      { key: 'address', label: 'Address', required: false },
      { key: 'organizationName', label: 'Organization Name', required: false },
      { key: 'gstNumber', label: 'GST Number', required: false }
    ];

    let completed = 0;
    let total = 0;
    const missing = [];

    fields.forEach(field => {
      const value = userData[field.key];
      
      if (field.required) {
        total++;
        if (value && value.toString().trim() !== '') {
          completed++;
        } else {
          missing.push(field.label);
        }
      } else {
        // Optional fields - only count if they have value
        total++;
        if (value && value.toString().trim() !== '') {
          completed++;
        } else {
          missing.push(field.label);
        }
      }
    });

    let percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    if (userData._id && percentage < 10) {
      percentage = 10;
    }

    return { percentage, missing };
  };

  // Animate percentage on load
  useEffect(() => {
    if (completionPercentage > 0) {
      let start = 0;
      const duration = 1500;
      const step = Math.max(1, Math.floor(completionPercentage / 60));
      
      const timer = setInterval(() => {
        start += step;
        if (start >= completionPercentage) {
          setAnimatedPercentage(completionPercentage);
          clearInterval(timer);
        } else {
          setAnimatedPercentage(start);
        }
      }, 20);
      
      return () => clearInterval(timer);
    }
  }, [completionPercentage]);

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
        const { percentage, missing } = calculateCompletion(res.data.user);
        setCompletionPercentage(percentage);
        setMissingFields(missing);
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

  // Circular Progress Component
  const CircularProgress = ({ percentage, size = 120, strokeWidth = 10 }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;
    
    const getColor = (p) => {
      if (p >= 80) return '#10b981';
      if (p >= 50) return '#f59e0b';
      return '#ef4444';
    };
    const color = getColor(percentage);

    return (
      <div className="relative inline-flex items-center justify-center">
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-500 ease-in-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold" style={{ color: color }}>
            {percentage}%
          </span>
          <span className="text-[8px] font-medium text-gray-500 uppercase tracking-wider">
            Complete
          </span>
        </div>
      </div>
    );
  };

  const getCompletionColor = (percentage) => {
    if (percentage >= 80) return 'text-emerald-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-red-500';
  };

  const getCompletionBgColor = (percentage) => {
    if (percentage >= 80) return 'bg-emerald-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getCompletionEmoji = (percentage) => {
    if (percentage >= 80) return '🎉';
    if (percentage >= 50) return '📈';
    if (percentage >= 30) return '📝';
    return '⚠️';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SimpleUserNavbar />
        <div className="pt-24 px-4 max-w-full mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-gray-500 text-sm">Loading profile...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SimpleUserNavbar />
        <div className="pt-24 px-4 max-w-full mx-auto">
          <div className="flex flex-col items-center justify-center gap-4 py-20 text-gray-400">
            <User size={48} className="opacity-20" />
            <p className="text-lg font-medium">No profile data found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SimpleUserNavbar />

      <div className="pt-24 px-4 sm:px-6 md:px-8 max-w-full mx-auto pb-16">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            <p className="text-sm text-gray-500">View your profile information</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/edit-profile")}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition shadow-sm shadow-indigo-200"
            >
              <Edit size={16} />
              Edit Profile
            </button>
          </div>
        </div>

        {/* Profile Completion Card */}
        <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-xl border border-indigo-200 shadow-sm p-4 sm:p-5 mb-6 max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            {/* Circular Progress */}
            <div className="flex-shrink-0 flex justify-center">
              <CircularProgress 
                percentage={animatedPercentage || completionPercentage} 
                size={110}
                strokeWidth={9}
              />
            </div>

            {/* Details */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{getCompletionEmoji(completionPercentage)}</span>
                <h3 className="text-sm font-semibold text-gray-800">Profile Completion</h3>
              </div>
              
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-lg border border-gray-200">
                  <span className="text-[9px] font-medium text-gray-500">Completed:</span>
                  <span className={`text-sm font-bold ${getCompletionColor(completionPercentage)}`}>{completionPercentage}%</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-lg border border-gray-200">
                  <span className="text-[9px] font-medium text-gray-500">Pending:</span>
                  <span className="text-sm font-bold text-amber-600">{missingFields.length}</span>
                </div>
              </div>

              {missingFields.length > 0 && (
                <div className="mt-2 flex flex-wrap items-center gap-1.5 bg-white/60 backdrop-blur-sm px-2.5 py-1.5 rounded-lg border border-amber-200">
                  <AlertTriangle size={13} className="text-amber-500 flex-shrink-0" />
                  <p className="text-[10px] text-gray-700">
                    <span className="font-semibold text-amber-600">{missingFields.length}</span> fields remaining
                  </p>
                  <button
                    onClick={() => navigate("/edit-profile")}
                    className="inline-flex items-center gap-0.5 text-[10px] font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    Complete Now <ArrowRight size={10} />
                  </button>
                </div>
              )}
              
              {missingFields.length === 0 && (
                <div className="mt-2 flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  <CheckCircle size={13} className="text-emerald-500" />
                  <p className="text-[10px] font-medium text-emerald-700">Your profile is 100% complete! 🎉</p>
                </div>
              )}

              {/* Missing Fields Tags */}
              {missingFields.length > 0 && (
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {missingFields.slice(0, 6).map((field, index) => (
                    <span key={index} className="inline-flex items-center gap-0.5 bg-white/70 backdrop-blur-sm px-1.5 py-0.5 rounded border border-red-200 text-[7px] font-medium text-gray-700">
                      <AlertCircle size={8} className="text-red-400" />
                      {field}
                    </span>
                  ))}
                  {missingFields.length > 6 && (
                    <span className="text-[7px] font-medium text-gray-400 px-1 py-0.5">
                      +{missingFields.length - 6} more
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden max-w-2xl mx-auto">
          {/* Cover */}
          <div className="h-20 bg-gradient-to-r from-indigo-500 to-purple-500 relative">
            <div className="absolute -bottom-10 left-6">
              <div className="w-20 h-20 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-indigo-600">
                  {profile.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="pt-12 px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
                <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
                  <Mail size={14} className="text-gray-400" />
                  {profile.email}
                </p>
              </div>
            </div>

            {/* Details - Basic only */}
            <div className="mt-5 border-t border-gray-200 pt-5">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 mb-4">
                <User size={14} className="text-indigo-600" /> Personal Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                    <User size={14} className="text-indigo-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Full Name</p>
                    <p className="font-medium text-gray-800 text-sm truncate">{profile.name}</p>
                  </div>
                  {profile.name && (
                    <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Mail size={14} className="text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Email</p>
                    <p className="font-medium text-gray-800 text-sm truncate">{profile.email}</p>
                  </div>
                  {profile.email && (
                    <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <Phone size={14} className="text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Mobile</p>
                    <p className="font-medium text-gray-800 text-sm">{profile.mobile}</p>
                  </div>
                  {profile.mobile && (
                    <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center flex-shrink-0">
                    <MapPin size={14} className="text-yellow-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Address</p>
                    <p className={`font-medium text-sm ${profile.address ? 'text-gray-800' : 'text-gray-400 italic'}`}>
                      {profile.address || 'Not provided'}
                    </p>
                  </div>
                  {profile.address && (
                    <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <Calendar size={14} className="text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Member Since</p>
                    <p className="font-medium text-gray-800 text-sm">{formatDate(profile.createdAt)}</p>
                  </div>
                </div>

                {/* Organization Details - Only if present */}
                {(profile.organizationName || profile.gstNumber) && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 mb-3">
                      <Crown size={14} className="text-amber-600" /> Organization Details
                    </h3>
                    {profile.organizationName && (
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                          <Crown size={14} className="text-amber-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Organization</p>
                          <p className="font-medium text-gray-800 text-sm truncate">{profile.organizationName}</p>
                        </div>
                        <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />
                      </div>
                    )}
                    {profile.gstNumber && (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                          <Shield size={14} className="text-orange-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">GST Number</p>
                          <p className="font-medium text-gray-800 text-sm truncate">{profile.gstNumber}</p>
                        </div>
                        <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions - Only 2 buttons */}
            <div className="mt-5 pt-5 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => navigate("/userbooking")}
                  className="flex items-center justify-center gap-2 px-3 py-2.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium hover:bg-indigo-100 transition border border-indigo-200"
                >
                  <Calendar size={14} />
                  My Bookings
                </button>
                <button
                  onClick={() => navigate("/spaceforusers")}
                  className="flex items-center justify-center gap-2 px-3 py-2.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-medium hover:bg-emerald-100 transition border border-emerald-200"
                >
                  <Shield size={14} />
                  Browse Spaces
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-[9px] text-gray-400 font-medium tracking-wider">
          © IRYAX SPACE — All Rights Reserved
        </div>
      </div>
    </div>
  );
};

export default SimpleUserProfile;