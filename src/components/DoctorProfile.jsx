// DoctorProfile.jsx - With View & Download
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
  ArrowRight,
  Circle,
  Check,
  AlertTriangle,
  X,
  IdCard,
  Stethoscope,
  FileCheck,
  File,
  Image,
  Trash2,
  Eye as EyeIcon,
  FileImage,
  Download
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DoctorNavbar from "./DoctorNavbar";
import "./Dashboard.css";

const API_URL = "https://spaceapi.iryax.com";

const DoctorProfile = () => {
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
    dmhoNumber: "",
    panNumber: ""
  });
  
  // File upload states
  const [selectedFiles, setSelectedFiles] = useState({
    adharCard: null,
    panCard: null,
    mbbsCertificate: null,
    pmcRegistration: null,
    nmrId: null
  });
  const [filePreviews, setFilePreviews] = useState({
    adharCard: null,
    panCard: null,
    mbbsCertificate: null,
    pmcRegistration: null,
    nmrId: null
  });
  const [showImagePreview, setShowImagePreview] = useState({
    adharCard: false,
    panCard: false,
    mbbsCertificate: false,
    pmcRegistration: false,
    nmrId: false
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

  // Calculate profile completion percentage
  const calculateCompletion = (userData) => {
    const fields = [
      { key: 'name', label: 'Full Name', required: true },
      { key: 'email', label: 'Email Address', required: true },
      { key: 'mobile', label: 'Mobile Number', required: true },
      { key: 'address', label: 'Address', required: true },
      { key: 'organizationName', label: 'Organization Name', required: false },
      { key: 'gstNumber', label: 'GST Number', required: false },
      { key: 'dmhoNumber', label: 'DMHO Number', required: false },
      { key: 'panNumber', label: 'PAN Number', required: false },
      { key: 'adharCardStatus', label: 'Aadhar Card', required: false, isDoc: true },
      { key: 'panCardStatus', label: 'PAN Card', required: false, isDoc: true },
      { key: 'mbbsCertificateStatus', label: 'MBBS Certificate', required: false, isDoc: true },
      { key: 'pmcRegistrationStatus', label: 'PMC Registration', required: false, isDoc: true },
      { key: 'nmrIdStatus', label: 'NMR ID', required: false, isDoc: true },
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
      } else {
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
        dmhoNumber: profile.dmhoNumber || "",
        panNumber: profile.panNumber || ""
      });
      setSelectedFiles({
        adharCard: null,
        panCard: null,
        mbbsCertificate: null,
        pmcRegistration: null,
        nmrId: null
      });
      setFilePreviews({
        adharCard: null,
        panCard: null,
        mbbsCertificate: null,
        pmcRegistration: null,
        nmrId: null
      });
      setShowImagePreview({
        adharCard: false,
        panCard: false,
        mbbsCertificate: false,
        pmcRegistration: false,
        nmrId: false
      });
      setShowEditPopup(true);
    }
  };

  // Close Edit Popup
  const closeEditPopup = () => {
    setShowEditPopup(false);
    setEditFormData({});
    setSelectedFiles({
      adharCard: null,
      panCard: null,
      mbbsCertificate: null,
      pmcRegistration: null,
      nmrId: null
    });
    setFilePreviews({
      adharCard: null,
      panCard: null,
      mbbsCertificate: null,
      pmcRegistration: null,
      nmrId: null
    });
    setShowImagePreview({
      adharCard: false,
      panCard: false,
      mbbsCertificate: false,
      pmcRegistration: false,
      nmrId: false
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
  const openDocView = (docName, docUrl, docStatus, docType) => {
    if (!docUrl) {
      toast.info("No document uploaded yet");
      return;
    }
    setViewingDoc({
      name: docName,
      url: docUrl,
      status: docStatus,
      type: docType
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
    
    // Get file extension from URL
    const extension = url.split('.').pop() || 'pdf';
    const fileName = `${name.replace(/\s+/g, '_')}.${extension}`;
    
    // Create download link
    const downloadUrl = `${API_URL}/${url}`;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`Downloading ${name}...`);
  };

  // Get document status display
  const getDocStatusDisplay = (status) => {
    const statusMap = {
      'approved': { label: 'Verified ✅', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
      'pending': { label: 'Pending ⏳', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
      'rejected': { label: 'Rejected ❌', color: 'bg-red-50 text-red-700 border-red-200' }
    };
    return statusMap[status] || statusMap.pending;
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
      'approved': { label: 'Approved', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: <CheckCircle size={14} /> },
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

  const getCompletionColor = (percentage) => {
    if (percentage >= 80) return '#10b981';
    if (percentage >= 50) return '#f59e0b';
    return '#ef4444';
  };

  const getCompletionEmoji = (percentage) => {
    if (percentage >= 80) return '🎉';
    if (percentage >= 50) return '📈';
    if (percentage >= 30) return '📝';
    return '⚠️';
  };

  // Circular Progress Component
  const CircularProgress = ({ percentage, size = 120, strokeWidth = 8 }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;
    const color = getCompletionColor(percentage);

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
            className="transition-all duration-300 ease-in-out"
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

  if (loading) {
    return (
      <div className="admin-dash" style={{ backgroundColor: '#ffffff' }}>
        <DoctorNavbar />
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="admin-dash" style={{ backgroundColor: '#ffffff' }}>
        <DoctorNavbar />
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

  const docStatuses = [
    profile.adharCardStatus,
    profile.panCardStatus,
    profile.mbbsCertificateStatus,
    profile.pmcRegistrationStatus,
    profile.nmrIdStatus
  ];
  const verifiedDocs = docStatuses.filter(s => s === 'approved').length;
  const totalDocs = docStatuses.length;

  // Document config for view popup
  const docConfigs = [
    { key: 'adharCard', label: 'Aadhar Card', icon: <IdCard size={18} className="text-indigo-600" />, bgColor: 'bg-indigo-100' },
    { key: 'panCard', label: 'PAN Card', icon: <FileText size={18} className="text-orange-600" />, bgColor: 'bg-orange-100' },
    { key: 'mbbsCertificate', label: 'MBBS Certificate', icon: <Stethoscope size={18} className="text-emerald-600" />, bgColor: 'bg-emerald-100' },
    { key: 'pmcRegistration', label: 'PMC Registration', icon: <FileCheck size={18} className="text-purple-600" />, bgColor: 'bg-purple-100' },
    { key: 'nmrId', label: 'NMR ID', icon: <Image size={18} className="text-rose-600" />, bgColor: 'bg-rose-100' }
  ];

  return (
    <div className="admin-dash" style={{ backgroundColor: '#ffffff' }}>
      <DoctorNavbar />

      <div className="pt-24 px-3 sm:px-4 md:px-6 lg:px-8 max-w-full mx-auto pb-16">
        {/* Header */}
        <div className="admin-dash__header mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Doctor <span className="text-indigo-600">Profile</span>
            </h1>
          </div>
        </div>

        {/* Profile Completion Card */}
        <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-2xl border border-indigo-200 shadow-sm p-4 sm:p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-shrink-0 flex justify-center">
              <CircularProgress 
                percentage={animatedPercentage || completionPercentage} 
                size={140} 
                strokeWidth={10}
              />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{getCompletionEmoji(completionPercentage)}</span>
                <h3 className="text-base font-semibold text-gray-800">Profile Completion</h3>
              </div>
              
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
                  <span className="text-xs font-medium text-gray-500">Completed:</span>
                  <span className="text-base font-bold text-indigo-600">{completionPercentage}%</span>
                </div>
                <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
                  <span className="text-xs font-medium text-gray-500">Pending:</span>
                  <span className="text-base font-bold text-amber-600">{missingFields.length}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
                  <span className="text-xs font-medium text-gray-500">Verified Docs:</span>
                  <span className="text-base font-bold text-emerald-600">{verifiedDocs}/{totalDocs}</span>
                </div>
              </div>

              {missingFields.length > 0 && (
                <div className="mt-3 flex flex-wrap items-center gap-2 bg-white/60 backdrop-blur-sm px-3 py-2 rounded-xl border border-amber-200">
                  <AlertTriangle size={16} className="text-amber-500 flex-shrink-0" />
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-amber-600">{missingFields.length}</span> fields remaining to complete your profile
                  </p>
                  <button
                    onClick={openEditPopup}
                    className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors ml-2"
                  >
                    Complete Now <ArrowRight size={14} />
                  </button>
                </div>
              )}
              
              {missingFields.length === 0 && (
                <div className="mt-3 flex items-center gap-2 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
                  <CheckCircle size={16} className="text-emerald-500" />
                  <p className="text-sm font-medium text-emerald-700">Your profile is 100% complete! 🎉</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
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
                        <p className="font-medium text-gray-800 text-sm truncate">
                          {profile.name || '⚠️ Not provided'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Mail size={14} className="text-blue-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Email</p>
                        <p className="font-medium text-gray-800 text-sm truncate">
                          {profile.email || '⚠️ Not provided'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <Phone size={14} className="text-emerald-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Mobile</p>
                        <p className="font-medium text-gray-800 text-sm">
                          {profile.mobile || '⚠️ Not provided'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center flex-shrink-0">
                        <MapPin size={14} className="text-yellow-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Address</p>
                        <p className="font-medium text-gray-800 text-sm">
                          {profile.address || '⚠️ Not provided'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

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
                          {profile.organizationName || '⚠️ Not provided'}
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
                          {profile.gstNumber || '⚠️ Not provided'}
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
                          {profile.dmhoNumber || '⚠️ Not provided'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                        <Clipboard size={14} className="text-indigo-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">PAN Number</p>
                        <p className="font-medium text-gray-800 text-sm">
                          {profile.panNumber || '⚠️ Not provided'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Document Verification - WITH VIEW & DOWNLOAD */}
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
                    {docConfigs.map((doc) => {
                      const docKey = doc.key;
                      const docPath = profile[docKey];
                      const docStatus = profile[docKey + 'Status'];
                      const statusBadge = getDocStatusBadge(docStatus);
                      
                      return (
                        <div key={docKey} className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 hover:border-indigo-200 transition-colors">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className={`w-8 h-8 rounded-lg ${doc.bgColor} flex items-center justify-center flex-shrink-0`}>
                              {doc.icon}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-medium text-gray-700 truncate">{doc.label}</p>
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-medium border ${statusBadge.color}`}>
                                {statusBadge.icon}
                                {statusBadge.label}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            {docPath ? (
                              <>
                                <button
                                  onClick={() => openDocView(doc.label, docPath, docStatus, 'image')}
                                  className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors border border-indigo-200"
                                  title="View Document"
                                >
                                  <EyeIcon size={14} />
                                </button>
                                <button
                                  onClick={() => downloadDocument(docPath, doc.label)}
                                  className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors border border-emerald-200"
                                  title="Download Document"
                                >
                                  <Download size={14} />
                                </button>
                              </>
                            ) : (
                              <span className="text-[8px] text-gray-400 font-medium">Not uploaded</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  onClick={() => navigate("/doctorbookings")}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-medium hover:bg-indigo-100 transition-colors border border-indigo-200"
                >
                  <Calendar size={14} />
                  My Bookings
                </button>
                <button
                  onClick={() => navigate("/mychambers")}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-medium hover:bg-emerald-100 transition-colors border border-emerald-200"
                >
                  <Home size={14} />
                  My Chambers
                </button>
                <button
                  onClick={() => navigate("/doctorwallet")}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-amber-50 text-amber-700 rounded-xl text-xs font-medium hover:bg-amber-100 transition-colors border border-amber-200"
                >
                  <Wallet size={14} />
                  My Wallet
                </button>
                <button
                  onClick={() => navigate("/mychamberpayments")}
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

      {/* ====================== */}
      {/* DOCUMENT VIEW POPUP WITH DOWNLOAD */}
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
            {/* Header */}
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

            {/* Document Content */}
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
              
              {/* Document Info */}
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
            {/* Header */}
            <div className="sticky top-0 bg-white z-10 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <Edit size={20} className="text-indigo-600" />
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

            {/* Form */}
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
                    <Building2 size={14} className="text-purple-600" /> Organization Details
                  </h3>
                </div>

                <div className="relative group md:col-span-2">
                  <Building2 className="absolute left-3 top-3 text-gray-400 group-focus-within:text-purple-600 transition-colors" size={16} />
                  <input
                    type="text"
                    name="organizationName"
                    placeholder="Organization Name"
                    value={editFormData.organizationName}
                    onChange={handleEditChange}
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all outline-none text-gray-800 placeholder:text-gray-400 text-sm"
                  />
                </div>

                <div className="relative group">
                  <FileText className="absolute left-3 top-3 text-gray-400 group-focus-within:text-purple-600 transition-colors" size={16} />
                  <input
                    type="text"
                    name="gstNumber"
                    placeholder="GST Number"
                    value={editFormData.gstNumber}
                    onChange={handleEditChange}
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all outline-none text-gray-800 placeholder:text-gray-400 text-sm"
                  />
                </div>

                <div className="relative group">
                  <Clipboard className="absolute left-3 top-3 text-gray-400 group-focus-within:text-purple-600 transition-colors" size={16} />
                  <input
                    type="text"
                    name="dmhoNumber"
                    placeholder="DMHO Number"
                    value={editFormData.dmhoNumber}
                    onChange={handleEditChange}
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all outline-none text-gray-800 placeholder:text-gray-400 text-sm"
                  />
                </div>

                <div className="relative group md:col-span-2">
                  <Clipboard className="absolute left-3 top-3 text-gray-400 group-focus-within:text-purple-600 transition-colors" size={16} />
                  <input
                    type="text"
                    name="panNumber"
                    placeholder="PAN Number"
                    value={editFormData.panNumber}
                    onChange={handleEditChange}
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all outline-none text-gray-800 placeholder:text-gray-400 text-sm"
                  />
                </div>

                {/* Document Uploads - ALL 5 */}
                <div className="md:col-span-2 mt-2">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 mb-3">
                    <Upload size={14} className="text-emerald-600" /> Document Uploads
                  </h3>
                  <p className="text-[10px] text-gray-400 mb-3">Upload or update your documents (JPG, PNG, WEBP, PDF - Max 5MB each)</p>
                </div>

                {/* Aadhar Card Upload */}
                <div className="md:col-span-2">
                  <div className={`border-2 rounded-xl p-4 transition-colors ${
                    filePreviews.adharCard ? 'border-emerald-400 bg-emerald-50' : 'border-dashed border-gray-300 hover:border-indigo-400'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                          <IdCard size={18} className="text-indigo-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Aadhar Card</p>
                          {profile.adharCardStatus && !filePreviews.adharCard && (
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
                                className="text-[10px] text-indigo-600 hover:text-indigo-800 underline"
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

                {/* PAN Card Upload */}
                <div className="md:col-span-2">
                  <div className={`border-2 rounded-xl p-4 transition-colors ${
                    filePreviews.panCard ? 'border-emerald-400 bg-emerald-50' : 'border-dashed border-gray-300 hover:border-indigo-400'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                          <FileText size={18} className="text-orange-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">PAN Card</p>
                          {profile.panCardStatus && !filePreviews.panCard && (
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${getDocStatusDisplay(profile.panCardStatus).color}`}>
                              {profile.panCardStatus === 'approved' ? '✅' : profile.panCardStatus === 'pending' ? '⏳' : '❌'} {profile.panCardStatus}
                            </span>
                          )}
                          {filePreviews.panCard && (
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] font-medium text-emerald-600">✅ File selected</span>
                              <button
                                type="button"
                                onClick={() => toggleImagePreview('panCard')}
                                className="text-[10px] text-indigo-600 hover:text-indigo-800 underline"
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

                {/* MBBS Certificate Upload */}
                <div className="md:col-span-2">
                  <div className={`border-2 rounded-xl p-4 transition-colors ${
                    filePreviews.mbbsCertificate ? 'border-emerald-400 bg-emerald-50' : 'border-dashed border-gray-300 hover:border-indigo-400'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                          <Stethoscope size={18} className="text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">MBBS Certificate</p>
                          {profile.mbbsCertificateStatus && !filePreviews.mbbsCertificate && (
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${getDocStatusDisplay(profile.mbbsCertificateStatus).color}`}>
                              {profile.mbbsCertificateStatus === 'approved' ? '✅' : profile.mbbsCertificateStatus === 'pending' ? '⏳' : '❌'} {profile.mbbsCertificateStatus}
                            </span>
                          )}
                          {filePreviews.mbbsCertificate && (
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] font-medium text-emerald-600">✅ File selected</span>
                              <button
                                type="button"
                                onClick={() => toggleImagePreview('mbbsCertificate')}
                                className="text-[10px] text-indigo-600 hover:text-indigo-800 underline"
                              >
                                {showImagePreview.mbbsCertificate ? 'Hide' : 'Preview'}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {filePreviews.mbbsCertificate && (
                          <button
                            type="button"
                            onClick={() => removeFile('mbbsCertificate')}
                            className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors border border-red-200"
                            title="Remove file"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                        <label className="cursor-pointer">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border ${
                            filePreviews.mbbsCertificate 
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100' 
                              : 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100'
                          }`}>
                            <Upload size={14} />
                            {filePreviews.mbbsCertificate ? 'Change' : 'Choose File'}
                          </span>
                          <input
                            type="file"
                            accept=".jpg,.jpeg,.png,.webp,.pdf"
                            onChange={(e) => handleFileSelect('mbbsCertificate', e.target.files[0])}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                    
                    {showImagePreview.mbbsCertificate && filePreviews.mbbsCertificate && (
                      <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-medium text-gray-500">Preview</span>
                          <button
                            type="button"
                            onClick={() => toggleImagePreview('mbbsCertificate')}
                            className="text-xs text-gray-400 hover:text-gray-600"
                          >
                            <X size={14} />
                          </button>
                        </div>
                        <img 
                          src={filePreviews.mbbsCertificate} 
                          alt="MBBS Certificate Preview" 
                          className="max-h-40 w-auto mx-auto rounded-lg border border-gray-200"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* PMC Registration Upload */}
                <div className="md:col-span-2">
                  <div className={`border-2 rounded-xl p-4 transition-colors ${
                    filePreviews.pmcRegistration ? 'border-emerald-400 bg-emerald-50' : 'border-dashed border-gray-300 hover:border-indigo-400'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                          <FileCheck size={18} className="text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">PMC Registration</p>
                          {profile.pmcRegistrationStatus && !filePreviews.pmcRegistration && (
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${getDocStatusDisplay(profile.pmcRegistrationStatus).color}`}>
                              {profile.pmcRegistrationStatus === 'approved' ? '✅' : profile.pmcRegistrationStatus === 'pending' ? '⏳' : '❌'} {profile.pmcRegistrationStatus}
                            </span>
                          )}
                          {filePreviews.pmcRegistration && (
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] font-medium text-emerald-600">✅ File selected</span>
                              <button
                                type="button"
                                onClick={() => toggleImagePreview('pmcRegistration')}
                                className="text-[10px] text-indigo-600 hover:text-indigo-800 underline"
                              >
                                {showImagePreview.pmcRegistration ? 'Hide' : 'Preview'}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {filePreviews.pmcRegistration && (
                          <button
                            type="button"
                            onClick={() => removeFile('pmcRegistration')}
                            className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors border border-red-200"
                            title="Remove file"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                        <label className="cursor-pointer">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border ${
                            filePreviews.pmcRegistration 
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100' 
                              : 'bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100'
                          }`}>
                            <Upload size={14} />
                            {filePreviews.pmcRegistration ? 'Change' : 'Choose File'}
                          </span>
                          <input
                            type="file"
                            accept=".jpg,.jpeg,.png,.webp,.pdf"
                            onChange={(e) => handleFileSelect('pmcRegistration', e.target.files[0])}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                    
                    {showImagePreview.pmcRegistration && filePreviews.pmcRegistration && (
                      <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-medium text-gray-500">Preview</span>
                          <button
                            type="button"
                            onClick={() => toggleImagePreview('pmcRegistration')}
                            className="text-xs text-gray-400 hover:text-gray-600"
                          >
                            <X size={14} />
                          </button>
                        </div>
                        <img 
                          src={filePreviews.pmcRegistration} 
                          alt="PMC Registration Preview" 
                          className="max-h-40 w-auto mx-auto rounded-lg border border-gray-200"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* NMR ID Upload */}
                <div className="md:col-span-2">
                  <div className={`border-2 rounded-xl p-4 transition-colors ${
                    filePreviews.nmrId ? 'border-emerald-400 bg-emerald-50' : 'border-dashed border-gray-300 hover:border-indigo-400'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-rose-100 flex items-center justify-center flex-shrink-0">
                          <Image size={18} className="text-rose-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">NMR ID</p>
                          {profile.nmrIdStatus && !filePreviews.nmrId && (
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${getDocStatusDisplay(profile.nmrIdStatus).color}`}>
                              {profile.nmrIdStatus === 'approved' ? '✅' : profile.nmrIdStatus === 'pending' ? '⏳' : '❌'} {profile.nmrIdStatus}
                            </span>
                          )}
                          {filePreviews.nmrId && (
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] font-medium text-emerald-600">✅ File selected</span>
                              <button
                                type="button"
                                onClick={() => toggleImagePreview('nmrId')}
                                className="text-[10px] text-indigo-600 hover:text-indigo-800 underline"
                              >
                                {showImagePreview.nmrId ? 'Hide' : 'Preview'}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {filePreviews.nmrId && (
                          <button
                            type="button"
                            onClick={() => removeFile('nmrId')}
                            className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors border border-red-200"
                            title="Remove file"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                        <label className="cursor-pointer">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border ${
                            filePreviews.nmrId 
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100' 
                              : 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100'
                          }`}>
                            <Upload size={14} />
                            {filePreviews.nmrId ? 'Change' : 'Choose File'}
                          </span>
                          <input
                            type="file"
                            accept=".jpg,.jpeg,.png,.webp,.pdf"
                            onChange={(e) => handleFileSelect('nmrId', e.target.files[0])}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                    
                    {showImagePreview.nmrId && filePreviews.nmrId && (
                      <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-medium text-gray-500">Preview</span>
                          <button
                            type="button"
                            onClick={() => toggleImagePreview('nmrId')}
                            className="text-xs text-gray-400 hover:text-gray-600"
                          >
                            <X size={14} />
                          </button>
                        </div>
                        <img 
                          src={filePreviews.nmrId} 
                          alt="NMR ID Preview" 
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
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium text-sm rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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

export default DoctorProfile;