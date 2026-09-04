// MyProfile.jsx - Complete with Quick Actions Below Percentage (Same as DoctorProfile)
// PAN Card Status Fixed, Quick Actions added below completion card

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
  Crown,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  IdCard,
  Sparkles,
  X,
  Trash2,
  Eye as EyeIcon,
  Download,
  FileImage,
  File,
  BarChart3,
  Ticket
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import UsersNavbar from "./UsersNavbar";
import "./Dashboard.css";
import "./UserSiteVisits.css";

const API_URL = "https://spaceapi.iryax.com";

const MyProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [missingFields, setMissingFields] = useState([]);
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  
  // Edit Profile State
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    organizationName: "",
    gstNumber: "",
    panNumber: ""
  });
  
  // File upload states
  const [selectedFiles, setSelectedFiles] = useState({
    panCard: null,
    adharCard: null
  });
  const [filePreviews, setFilePreviews] = useState({
    panCard: null,
    adharCard: null
  });
  const [showImagePreview, setShowImagePreview] = useState({
    panCard: false,
    adharCard: false
  });

  // Document View Popup State
  const [showDocViewPopup, setShowDocViewPopup] = useState(false);
  const [viewingDoc, setViewingDoc] = useState({
    name: "",
    url: "",
    status: "",
    type: ""
  });
  
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

  // Calculate profile completion percentage - ONLY FOR CABIN OWNER
  const calculateCompletion = (userData) => {
    const fields = [
      { key: 'name', label: 'Full Name', required: true },
      { key: 'email', label: 'Email Address', required: true },
      { key: 'mobile', label: 'Mobile Number', required: true },
      { key: 'address', label: 'Address', required: true },
      { key: 'organizationName', label: 'Organization Name', required: false },
      { key: 'gstNumber', label: 'GST Number', required: false },
      { key: 'panNumber', label: 'PAN Number', required: false },
      // Check PAN Card Status - not just if uploaded
      { key: 'panCardStatus', label: 'PAN Card Verification', required: false, isDoc: true },
      { key: 'adharCardStatus', label: 'Aadhar Card Verification', required: false, isDoc: true }
    ];

    let completed = 0;
    let total = 0;
    const missing = [];

    fields.forEach(field => {
      const value = userData[field.key];
      
      if (field.isDoc) {
        if (value === 'approved') {
          completed++;
        }
        total++;
        if (value !== 'approved') {
          missing.push(field.label);
        }
      } 
      else {
        if (field.required) {
          total++;
          if (value && value.toString().trim() !== '') {
            completed++;
          } else {
            missing.push(field.label);
          }
        } else {
          if (value && value.toString().trim() !== '') {
            completed++;
          }
          total++;
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

  // Open Edit Popup
  const openEditPopup = () => {
    if (profile) {
      setEditFormData({
        name: profile.name || "",
        email: profile.email || "",
        mobile: profile.mobile || "",
        address: profile.address || "",
        organizationName: profile.organizationName || "",
        gstNumber: profile.gstNumber || "",
        panNumber: profile.panNumber || ""
      });
      setSelectedFiles({
        panCard: null,
        adharCard: null
      });
      setFilePreviews({
        panCard: null,
        adharCard: null
      });
      setShowImagePreview({
        panCard: false,
        adharCard: false
      });
      setShowEditPopup(true);
    }
  };

  // Close Edit Popup
  const closeEditPopup = () => {
    setShowEditPopup(false);
    setEditFormData({});
    setSelectedFiles({
      panCard: null,
      adharCard: null
    });
    setFilePreviews({
      panCard: null,
      adharCard: null
    });
    setShowImagePreview({
      panCard: false,
      adharCard: false
    });
  };

  // Handle edit form change
  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  // Handle file selection
  const handleFileSelect = (field, file) => {
    if (!file) return;
    
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid file (JPG, PNG, WEBP, or PDF)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }
    
    setSelectedFiles(prev => ({ ...prev, [field]: file }));
    
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreviews(prev => ({ ...prev, [field]: reader.result }));
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreviews(prev => ({ ...prev, [field]: file.name }));
    }
  };

  // Remove selected file
  const removeFile = (field) => {
    setSelectedFiles(prev => ({ ...prev, [field]: null }));
    setFilePreviews(prev => ({ ...prev, [field]: null }));
    setShowImagePreview(prev => ({ ...prev, [field]: false }));
    toast.info(`${field} file removed`);
  };

  // Toggle image preview
  const toggleImagePreview = (field) => {
    setShowImagePreview(prev => ({ ...prev, [field]: !prev[field] }));
  };

  // Open Document View Popup
  const openDocView = (docName, docUrl, docStatus) => {
    if (!docUrl) {
      toast.info("No document uploaded yet");
      return;
    }
    setViewingDoc({
      name: docName,
      url: docUrl,
      status: docStatus || 'pending',
      type: 'image'
    });
    setShowDocViewPopup(true);
  };

  // Close Document View Popup
  const closeDocView = () => {
    setShowDocViewPopup(false);
    setViewingDoc({
      name: "",
      url: "",
      status: "",
      type: ""
    });
  };

  // Download Document
  const downloadDocument = (url, name) => {
    if (!url) {
      toast.error("No document to download");
      return;
    }
    
    const extension = url.split('.').pop() || 'pdf';
    const fileName = `${name.replace(/\s+/g, '_')}.${extension}`;
    
    const downloadUrl = `${API_URL}/${url}`;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`Downloading ${name}...`);
  };

  // Submit Edit Profile
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to continue");
        return;
      }

      const userId = getUserId();
      if (!userId) {
        toast.error("User ID not found");
        return;
      }

      const formData = new FormData();
      
      Object.keys(editFormData).forEach(key => {
        if (editFormData[key]) {
          formData.append(key, editFormData[key]);
        }
      });
      
      Object.keys(selectedFiles).forEach(key => {
        if (selectedFiles[key]) {
          formData.append(key, selectedFiles[key]);
        }
      });

      const res = await axios.put(
        `${API_URL}/api/auth/profile/${userId}`,
        formData,
        {
          ...getAuthHeader(),
          headers: { 
            ...getAuthHeader().headers,
            'Content-Type': 'multipart/form-data' 
          }
        }
      );

      if (res.data.success) {
        toast.success("Profile updated successfully!");
        setShowEditPopup(false);
        await fetchProfile();
      } else {
        toast.error(res.data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setEditLoading(false);
    }
  };

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

  const getCompletionEmoji = (percentage) => {
    if (percentage >= 80) return '🎉';
    if (percentage >= 50) return '📈';
    if (percentage >= 30) return '📝';
    return '⚠️';
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'active': { label: 'Active', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: <CheckCircle size={14} /> },
      'approved': { label: 'Approved', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: <CheckCircle size={14} /> },
      'pending': { label: 'Pending', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: <Clock size={14} /> },
      'rejected': { label: 'Rejected', color: 'bg-red-100 text-red-700 border-red-200', icon: <XCircle size={14} /> }
    };
    return statusMap[status] || statusMap.pending;
  };

  const getDocStatusBadge = (status) => {
    const statusMap = {
      'approved': { label: 'Verified ✅', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: <CheckCircle size={12} /> },
      'pending': { label: 'Pending ⏳', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: <Clock size={12} /> },
      'rejected': { label: 'Rejected ❌', color: 'bg-red-100 text-red-700 border-red-200', icon: <XCircle size={12} /> }
    };
    return statusMap[status] || statusMap.pending;
  };

  const getDocStatusDisplay = (status) => {
    const statusMap = {
      'approved': { label: 'Verified ✅', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
      'pending': { label: 'Pending ⏳', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
      'rejected': { label: 'Rejected ❌', color: 'bg-red-50 text-red-700 border-red-200' }
    };
    return statusMap[status] || statusMap.pending;
  };

  const getRoleBadge = (role) => {
    const roleMap = {
      'doctor': { label: 'Doctor', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
      'admin': { label: 'Admin', color: 'bg-purple-100 text-purple-700 border-purple-200' },
      'cabinOwner': { label: 'Cabin Owner', color: 'bg-amber-100 text-amber-700 border-amber-200' },
      'user': { label: 'User', color: 'bg-slate-100 text-slate-700 border-slate-200' }
    };
    return roleMap[role] || roleMap.user;
  };

  if (loading) {
    return (
      <div className="user-visits">
        <UsersNavbar />
        <main className="p-2 sm:p-4 lg:p-6">
          <div className="user-visits__loading">
            <div className="user-visits__spinner" />
            <p className="user-visits__loading-text">Loading profile...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="user-visits">
        <UsersNavbar />
        <main className="p-2 sm:p-4 lg:p-6">
          <div className="user-visits__empty">
            <User size={32} className="user-visits__empty-icon" />
            <p className="user-visits__empty-text">No profile data found</p>
          </div>
        </main>
      </div>
    );
  }

  const statusBadge = getStatusBadge(profile.status);
  const roleBadge = getRoleBadge(profile.role);

  const hasPanCardFile = profile.panCard && profile.panCard.trim() !== '';
  const hasAadharCardFile = profile.adharCard && profile.adharCard.trim() !== '';

  return (
    <div className="user-visits">
      <UsersNavbar />

      <main className="p-2 sm:p-4 lg:p-6">
        {/* Header */}
        <div className="user-visits__header">
          <div>
            <h1 className="user-visits__greeting">
              My <span>Profile</span>
            </h1>
            <p className="user-visits__subtitle">Manage your personal information and documents</p>
          </div>
        </div>

        {/* Profile Completion Card */}
        <div className="user-visits__card mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="flex-shrink-0 flex justify-center">
              <CircularProgress 
                percentage={animatedPercentage || completionPercentage} 
                size={110}
                strokeWidth={9}
              />
            </div>

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
                    onClick={openEditPopup}
                    className="inline-flex items-center gap-0.5 text-[10px] font-medium text-amber-600 hover:text-amber-800 transition-colors"
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

        {/* ✅ QUICK ACTION BUTTONS - ALAG DIV MEIN, PERCENTAGE KE NICHE (SAME AS DOCTORPROFILE) */}
        <div className="mb-5">
          <div className="user-visits__card">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                <ArrowRight size={16} className="text-amber-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-700">Quick Actions</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              <button
                onClick={() => navigate("/mybookings")}
                className="user-visits__btn user-visits__btn--secondary"
              >
                <Ticket size={18} />
                <span className="hidden sm:inline">My Bookings</span>
                <span className="sm:hidden">Bookings</span>
              </button>
              <button
                onClick={() => navigate("/mycabin")}
                className="user-visits__btn user-visits__btn--secondary"
              >
                <Home size={18} />
                <span className="hidden sm:inline">My Cabins</span>
                <span className="sm:hidden">Cabins</span>
              </button>
              <button
                onClick={() => navigate("/my-wallet")}
                className="user-visits__btn user-visits__btn--secondary"
              >
                <Wallet size={18} />
                <span className="hidden sm:inline">Wallet</span>
                <span className="sm:hidden">Wallet</span>
              </button>
              <button
                onClick={() => navigate("/my-cabin-payments")}
                className="user-visits__btn user-visits__btn--secondary"
              >
                <CreditCard size={18} />
                <span className="hidden sm:inline">Payments</span>
                <span className="sm:hidden">Payments</span>
              </button>
              <button
                onClick={() => navigate("/spacerevenue")}
                className="user-visits__btn user-visits__btn--secondary"
              >
                <BarChart3 size={18} />
                <span className="hidden sm:inline">Revenue</span>
                <span className="sm:hidden">Revenue</span>
              </button>
            </div>
          </div>
        </div>

        {/* Profile Card */}
        <div className="user-visits__card">
          {/* Cover Image */}
          <div className="h-32 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 relative">
            <div className="absolute -bottom-12 left-6 sm:left-8">
              <div className="w-24 h-24 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center">
                <span className="text-3xl font-bold text-amber-600">
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
                onClick={openEditPopup}
                className="user-visits__btn user-visits__btn--primary"
              >
                <Edit size={14} />
                Edit Profile
              </button>
            </div>

            {/* Stats Cards */}
            <div className="user-visits__stats mt-6">
              <div className="user-visits__stat">
                <div className="user-visits__stat-top">
                  <span className="user-visits__stat-label">Role</span>
                  <div className="user-visits__stat-icon user-visits__stat-icon--indigo">
                    <User size={14} />
                  </div>
                </div>
                <div className="user-visits__stat-value capitalize">{profile.role || 'User'}</div>
              </div>
              <div className="user-visits__stat">
                <div className="user-visits__stat-top">
                  <span className="user-visits__stat-label">Status</span>
                  <div className="user-visits__stat-icon user-visits__stat-icon--emerald">
                    <CheckCircle size={14} />
                  </div>
                </div>
                <div className="user-visits__stat-value">{statusBadge.label}</div>
              </div>
              <div className="user-visits__stat">
                <div className="user-visits__stat-top">
                  <span className="user-visits__stat-label">Member Since</span>
                  <div className="user-visits__stat-icon user-visits__stat-icon--blue">
                    <Calendar size={14} />
                  </div>
                </div>
                <div className="user-visits__stat-value">{formatDate(profile.createdAt)}</div>
              </div>
              <div className="user-visits__stat">
                <div className="user-visits__stat-top">
                  <span className="user-visits__stat-label">User ID</span>
                  <div className="user-visits__stat-icon user-visits__stat-icon--purple">
                    <IdCard size={14} />
                  </div>
                </div>
                <div className="user-visits__stat-value text-xs font-mono">#{profile._id.slice(-8).toUpperCase()}</div>
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
                      <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Mail size={14} className="text-blue-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Email</p>
                        <p className="font-medium text-gray-800 text-sm truncate">{profile.email}</p>
                      </div>
                      <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <Phone size={14} className="text-emerald-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Mobile</p>
                        <p className="font-medium text-gray-800 text-sm">{profile.mobile}</p>
                      </div>
                      <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center flex-shrink-0">
                        <MapPin size={14} className="text-yellow-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Address</p>
                        <p className={`font-medium text-sm ${profile.address ? 'text-gray-800' : 'text-gray-400 italic'}`}>
                          {profile.address || 'Not provided'}
                        </p>
                      </div>
                      {profile.address && (
                        <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Organization Details */}
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-gray-200">
                    <Building2 size={14} className="text-amber-600" /> Organization Details
                  </h3>
                  <div className="space-y-3 mt-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                        <Building2 size={14} className="text-amber-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Organization</p>
                        <p className={`font-medium text-sm ${profile.organizationName ? 'text-gray-800' : 'text-gray-400 italic'}`}>
                          {profile.organizationName || 'Not provided'}
                        </p>
                      </div>
                      {profile.organizationName && (
                        <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                        <FileText size={14} className="text-orange-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">GST Number</p>
                        <p className={`font-medium text-sm ${profile.gstNumber ? 'text-gray-800' : 'text-gray-400 italic'}`}>
                          {profile.gstNumber || 'Not provided'}
                        </p>
                      </div>
                      {profile.gstNumber && (
                        <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                        <IdCard size={14} className="text-indigo-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">PAN Number</p>
                        <p className={`font-medium text-sm ${profile.panNumber ? 'text-gray-800' : 'text-gray-400 italic'}`}>
                          {profile.panNumber || 'Not provided'}
                        </p>
                      </div>
                      {profile.panNumber && (
                        <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Document Status - With Status Badges */}
            <div className="mt-6 border-t border-gray-200 pt-6">
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <Upload size={14} className="text-amber-600" /> Document Status
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  {/* PAN Card Status */}
                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 hover:border-amber-200 transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                        <FileText size={14} className="text-orange-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">PAN Card</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {hasPanCardFile && (
                        <>
                          <button
                            onClick={() => openDocView('PAN Card', profile.panCard, profile.panCardStatus)}
                            className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors border border-indigo-200"
                            title="View Document"
                          >
                            <EyeIcon size={14} />
                          </button>
                          <button
                            onClick={() => downloadDocument(profile.panCard, 'PAN Card')}
                            className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors border border-emerald-200"
                            title="Download Document"
                          >
                            <Download size={14} />
                          </button>
                        </>
                      )}
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${getDocStatusBadge(profile.panCardStatus).color}`}>
                        {getDocStatusBadge(profile.panCardStatus).icon}
                        {getDocStatusBadge(profile.panCardStatus).label}
                      </span>
                    </div>
                  </div>

                  {/* Aadhar Card Status */}
                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 hover:border-amber-200 transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                        <IdCard size={14} className="text-indigo-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">Aadhar Card</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {hasAadharCardFile && (
                        <>
                          <button
                            onClick={() => openDocView('Aadhar Card', profile.adharCard, profile.adharCardStatus)}
                            className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors border border-indigo-200"
                            title="View Document"
                          >
                            <EyeIcon size={14} />
                          </button>
                          <button
                            onClick={() => downloadDocument(profile.adharCard, 'Aadhar Card')}
                            className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors border border-emerald-200"
                            title="Download Document"
                          >
                            <Download size={14} />
                          </button>
                        </>
                      )}
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${getDocStatusBadge(profile.adharCardStatus).color}`}>
                        {getDocStatusBadge(profile.adharCardStatus).icon}
                        {getDocStatusBadge(profile.adharCardStatus).label}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ====================== */}
      {/* DOCUMENT VIEW POPUP */}
      {/* ====================== */}
      {showDocViewPopup && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeDocView();
            }
          }}
        >
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="sticky top-0 bg-white z-10 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <EyeIcon size={20} className="text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{viewingDoc.name}</h2>
                  <p className="text-xs text-gray-500 flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${getDocStatusDisplay(viewingDoc.status).color}`}>
                      {viewingDoc.status || 'Pending'}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {viewingDoc.url && (
                  <button
                    onClick={() => downloadDocument(viewingDoc.url, viewingDoc.name)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors border border-emerald-200 text-sm font-medium"
                    title="Download Document"
                  >
                    <Download size={16} />
                    Download
                  </button>
                )}
                <button
                  onClick={closeDocView}
                  className="w-8 h-8 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 min-h-[300px] flex items-center justify-center">
                {viewingDoc.url ? (
                  viewingDoc.url.endsWith('.pdf') ? (
                    <div className="text-center">
                      <FileText size={64} className="text-red-500 mx-auto mb-4" />
                      <p className="text-sm text-gray-600">PDF Document</p>
                      <div className="flex items-center justify-center gap-3 mt-3">
                        <a
                          href={`${API_URL}/${viewingDoc.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                        >
                          <EyeIcon size={16} />
                          View PDF
                        </a>
                        <button
                          onClick={() => downloadDocument(viewingDoc.url, viewingDoc.name)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
                        >
                          <Download size={16} />
                          Download PDF
                        </button>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={`${API_URL}/${viewingDoc.url}`}
                      alt={viewingDoc.name}
                      className="max-w-full max-h-[60vh] object-contain rounded-lg"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '';
                        e.target.alt = 'Failed to load image';
                      }}
                    />
                  )
                ) : (
                  <div className="text-center text-gray-400">
                    <FileImage size={48} className="mx-auto mb-2 opacity-30" />
                    <p>No document uploaded</p>
                  </div>
                )}
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">Document Name</p>
                  <p className="text-xs font-medium text-gray-700 mt-0.5">{viewingDoc.name}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">Status</p>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border mt-0.5 ${getDocStatusDisplay(viewingDoc.status).color}`}>
                    {viewingDoc.status || 'Pending'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================== */}
      {/* EDIT PROFILE POPUP */}
      {/* ====================== */}
      {showEditPopup && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeEditPopup();
            }
          }}
        >
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white z-10 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <Edit size={20} className="text-amber-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Edit Profile</h2>
                  <p className="text-xs text-gray-500">Update your personal, organization & document details</p>
                </div>
              </div>
              <button
                onClick={closeEditPopup}
                className="w-8 h-8 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Personal Information */}
                <div className="md:col-span-2">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 mb-3">
                    <User size={14} className="text-indigo-600" /> Personal Information
                  </h3>
                </div>

                <div className="relative group">
                  <User className="absolute left-3 top-3 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={16} />
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name *"
                    value={editFormData.name}
                    onChange={handleEditChange}
                    required
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-gray-800 placeholder:text-gray-400 text-sm"
                  />
                </div>

                <div className="relative group">
                  <Mail className="absolute left-3 top-3 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={16} />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address *"
                    value={editFormData.email}
                    onChange={handleEditChange}
                    required
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-gray-800 placeholder:text-gray-400 text-sm"
                  />
                </div>

                <div className="relative group">
                  <Phone className="absolute left-3 top-3 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={16} />
                  <input
                    type="text"
                    name="mobile"
                    placeholder="Mobile Number *"
                    value={editFormData.mobile}
                    onChange={handleEditChange}
                    required
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-gray-800 placeholder:text-gray-400 text-sm"
                  />
                </div>

                <div className="relative group md:col-span-2">
                  <MapPin className="absolute left-3 top-3 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={16} />
                  <input
                    type="text"
                    name="address"
                    placeholder="Address *"
                    value={editFormData.address}
                    onChange={handleEditChange}
                    required
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-gray-800 placeholder:text-gray-400 text-sm"
                  />
                </div>

                {/* Organization Details */}
                <div className="md:col-span-2 mt-2">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 mb-3">
                    <Building2 size={14} className="text-amber-600" /> Organization Details
                  </h3>
                </div>

                <div className="relative group md:col-span-2">
                  <Building2 className="absolute left-3 top-3 text-gray-400 group-focus-within:text-amber-600 transition-colors" size={16} />
                  <input
                    type="text"
                    name="organizationName"
                    placeholder="Organization Name"
                    value={editFormData.organizationName}
                    onChange={handleEditChange}
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none text-gray-800 placeholder:text-gray-400 text-sm"
                  />
                </div>

                <div className="relative group">
                  <FileText className="absolute left-3 top-3 text-gray-400 group-focus-within:text-amber-600 transition-colors" size={16} />
                  <input
                    type="text"
                    name="gstNumber"
                    placeholder="GST Number"
                    value={editFormData.gstNumber}
                    onChange={handleEditChange}
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none text-gray-800 placeholder:text-gray-400 text-sm"
                  />
                </div>

                <div className="relative group md:col-span-2">
                  <IdCard className="absolute left-3 top-3 text-gray-400 group-focus-within:text-amber-600 transition-colors" size={16} />
                  <input
                    type="text"
                    name="panNumber"
                    placeholder="PAN Number"
                    value={editFormData.panNumber}
                    onChange={handleEditChange}
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none text-gray-800 placeholder:text-gray-400 text-sm"
                  />
                </div>

                {/* Document Uploads - PAN & Aadhar */}
                <div className="md:col-span-2 mt-2">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 mb-3">
                    <Upload size={14} className="text-amber-600" /> Document Uploads
                  </h3>
                  <p className="text-[10px] text-gray-400 mb-3">Upload or update your documents (JPG, PNG, WEBP, PDF - Max 5MB each)</p>
                </div>

                {/* PAN Card Upload */}
                <div className="md:col-span-2">
                  <div className={`border-2 rounded-xl p-4 transition-colors ${
                    filePreviews.panCard ? 'border-emerald-400 bg-emerald-50' : 'border-dashed border-gray-300 hover:border-amber-400'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                          <FileText size={18} className="text-orange-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">PAN Card</p>
                          {profile.panCard && !filePreviews.panCard && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                              ✅ Uploaded
                            </span>
                          )}
                          {filePreviews.panCard && (
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] font-medium text-emerald-600">✅ File selected</span>
                              <button
                                type="button"
                                onClick={() => toggleImagePreview('panCard')}
                                className="text-[10px] text-amber-600 hover:text-amber-800 underline"
                              >
                                {showImagePreview.panCard ? 'Hide' : 'Preview'}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {filePreviews.panCard && (
                          <button
                            type="button"
                            onClick={() => removeFile('panCard')}
                            className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors border border-red-200"
                            title="Remove file"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                        <label className="cursor-pointer">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border ${
                            filePreviews.panCard 
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100' 
                              : 'bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100'
                          }`}>
                            <Upload size={14} />
                            {filePreviews.panCard ? 'Change' : 'Choose File'}
                          </span>
                          <input
                            type="file"
                            accept=".jpg,.jpeg,.png,.webp,.pdf"
                            onChange={(e) => handleFileSelect('panCard', e.target.files[0])}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                    
                    {showImagePreview.panCard && filePreviews.panCard && (
                      <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-medium text-gray-500">Preview</span>
                          <button
                            type="button"
                            onClick={() => toggleImagePreview('panCard')}
                            className="text-xs text-gray-400 hover:text-gray-600"
                          >
                            <X size={14} />
                          </button>
                        </div>
                        <img 
                          src={filePreviews.panCard} 
                          alt="PAN Card Preview" 
                          className="max-h-40 w-auto mx-auto rounded-lg border border-gray-200"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Aadhar Card Upload */}
                <div className="md:col-span-2">
                  <div className={`border-2 rounded-xl p-4 transition-colors ${
                    filePreviews.adharCard ? 'border-emerald-400 bg-emerald-50' : 'border-dashed border-gray-300 hover:border-amber-400'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                          <IdCard size={18} className="text-indigo-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Aadhar Card</p>
                          {profile.adharCard && !filePreviews.adharCard && (
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${getDocStatusDisplay(profile.adharCardStatus).color}`}>
                              {profile.adharCardStatus === 'approved' ? '✅' : profile.adharCardStatus === 'pending' ? '⏳' : '❌'} {profile.adharCardStatus}
                            </span>
                          )}
                          {filePreviews.adharCard && (
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] font-medium text-emerald-600">✅ File selected</span>
                              <button
                                type="button"
                                onClick={() => toggleImagePreview('adharCard')}
                                className="text-[10px] text-amber-600 hover:text-amber-800 underline"
                              >
                                {showImagePreview.adharCard ? 'Hide' : 'Preview'}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {filePreviews.adharCard && (
                          <button
                            type="button"
                            onClick={() => removeFile('adharCard')}
                            className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors border border-red-200"
                            title="Remove file"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                        <label className="cursor-pointer">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border ${
                            filePreviews.adharCard 
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100' 
                              : 'bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100'
                          }`}>
                            <Upload size={14} />
                            {filePreviews.adharCard ? 'Change' : 'Choose File'}
                          </span>
                          <input
                            type="file"
                            accept=".jpg,.jpeg,.png,.webp,.pdf"
                            onChange={(e) => handleFileSelect('adharCard', e.target.files[0])}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                    
                    {showImagePreview.adharCard && filePreviews.adharCard && (
                      <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-medium text-gray-500">Preview</span>
                          <button
                            type="button"
                            onClick={() => toggleImagePreview('adharCard')}
                            className="text-xs text-gray-400 hover:text-gray-600"
                          >
                            <X size={14} />
                          </button>
                        </div>
                        <img 
                          src={filePreviews.adharCard} 
                          alt="Aadhar Card Preview" 
                          className="max-h-40 w-auto mx-auto rounded-lg border border-gray-200"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeEditPopup}
                  className="px-6 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium text-sm rounded-xl hover:shadow-lg hover:shadow-amber-500/25 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {editLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={16} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Animations */}
      <style>{`
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
};

export default MyProfile;