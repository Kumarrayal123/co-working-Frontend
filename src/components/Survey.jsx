// Survey.jsx - Full survey form component with popup, conditional fields, and cookie support
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Building2,
  Calendar,
  Phone,
  MapPin,
  User,
  Save,
  ChevronLeft,
  ArrowRight,
  Plus,
  CheckCircle,
  X,
  Info,
  Coffee,
  Home,
  Stethoscope,
  Send,
  Utensils,
  Award,
  Star,
  Clock
} from "lucide-react";
import UsersNavbar from "./UsersNavbar";
import "./UserSiteVisits.css";

const API_URL = "https://spaceapi.iryax.com/api/surveys/submitsurvey";

// Cookie management functions
const Cookies = {
  set: (name, value, days = 30) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${encodeURIComponent(JSON.stringify(value))};expires=${expires.toUTCString()};path=/`;
  },
  get: (name) => {
    const cookies = document.cookie.split('; ');
    for (let cookie of cookies) {
      const [key, value] = cookie.split('=');
      if (key === name) {
        try {
          return JSON.parse(decodeURIComponent(value));
        } catch {
          return decodeURIComponent(value);
        }
      }
    }
    return null;
  },
  remove: (name) => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  }
};

// RevealSection component for animations
const RevealSection = ({ children, delay = 0 }) => {
  return (
    <div 
      className="reveal-section" 
      style={{ 
        animationDelay: `${delay}s`,
        opacity: 0,
        animation: `fadeInUp 0.6s ease forwards ${delay}s`
      }}
    >
      {children}
    </div>
  );
};

// Success Popup Modal
const SuccessPopup = ({ isOpen, onClose, surveyData }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-popup">
        {/* Decorative elements */}
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-emerald-100 rounded-full opacity-50" />
        <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-teal-100 rounded-full opacity-30" />
        
        <div className="relative">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-400 rounded-full blur-2xl opacity-30 animate-pulse" />
              <div className="relative bg-gradient-to-br from-emerald-500 to-teal-400 rounded-full p-5 shadow-xl shadow-emerald-200/50">
                <CheckCircle size={48} className="text-white" />
              </div>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-center text-gray-900 mb-2">
            Survey Submitted! 🎉
          </h3>
          <p className="text-center text-gray-600 mb-6">
            Thank you for submitting your space/cafe survey.
          </p>

          {/* Survey Summary */}
          <div className="bg-gray-50/80 rounded-2xl p-5 mb-6 border border-gray-100/80">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Space Name</span>
                <span className="text-sm font-semibold text-gray-800">{surveyData.spaceName || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Space Type</span>
                <span className="text-sm font-semibold capitalize text-gray-800">{surveyData.spaceType || 'N/A'}</span>
              </div>
              {surveyData.spaceType === 'cafe' && surveyData.noOfTables && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Number of Tables</span>
                  <span className="text-sm font-semibold text-gray-800">{surveyData.noOfTables}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Submitted By</span>
                <span className="text-sm font-semibold text-gray-800">{surveyData.submittedBy || 'N/A'}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-200/50 hover:shadow-xl hover:shadow-emerald-300/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            Got it! 👍
          </button>
        </div>
      </div>
    </div>
  );
};

const Survey = () => {
  const navigate = useNavigate();
  const [surveyData, setSurveyData] = useState({
    spaceName: "",
    spaceType: "co-working",
    mobileNumber: "",
    address: "",
    submittedBy: "",
    noOfTables: ""
  });

  const [isSurveySubmitting, setIsSurveySubmitting] = useState(false);
  const [surveyError, setSurveyError] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [submittedData, setSubmittedData] = useState({});
  const [formKey, setFormKey] = useState(0);

  // Load saved cookie data on mount
  useEffect(() => {
    const savedData = Cookies.get('survey_form_data');
    if (savedData) {
      setSurveyData(prev => ({ ...prev, ...savedData }));
    }
  }, []);

  // Save to cookie on change (with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      Cookies.set('survey_form_data', surveyData, 7);
    }, 500);
    return () => clearTimeout(timer);
  }, [surveyData]);

  const handleSurveySubmit = async (e) => {
  e.preventDefault();
  setIsSurveySubmitting(true);
  setSurveyError("");

  // Validate mobile number
  const mobileRegex = /^[0-9]{10}$/;
  if (!mobileRegex.test(surveyData.mobileNumber.replace(/[^0-9]/g, ''))) {
    setSurveyError("Please enter a valid 10-digit mobile number.");
    setIsSurveySubmitting(false);
    return;
  }

  // Validate noOfTables if cafe
  if (surveyData.spaceType === 'cafe') {
    if (!surveyData.noOfTables || parseInt(surveyData.noOfTables) <= 0) {
      setSurveyError("Please enter a valid number of tables for the cafe.");
      setIsSurveySubmitting(false);
      return;
    }
  }

  try {
    // Prepare data for API - questions should match QuestionSchema
    const submitData = {
      title: surveyData.spaceName,
      description: `${surveyData.spaceType} space at ${surveyData.address}`,
      questions: [
        { text: `Space Type: ${surveyData.spaceType}`, type: 'text' },
        { text: `Mobile Number: ${surveyData.mobileNumber}`, type: 'text' },
        { text: `Address: ${surveyData.address}`, type: 'text' },
        { text: `Submitted By: ${surveyData.submittedBy}`, type: 'text' }
      ],
      noOfTables: surveyData.spaceType === 'cafe' ? parseInt(surveyData.noOfTables) : null,
      spaceName: surveyData.spaceName,
      spaceType: surveyData.spaceType,
      mobileNumber: surveyData.mobileNumber,
      address: surveyData.address,
      submittedBy: surveyData.submittedBy
    };

    console.log("Submitting survey data:", JSON.stringify(submitData, null, 2));

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submitData)
    });

    const result = await response.json();
    console.log("API Response:", result);

    if (response.ok && result.success) {
      setSubmittedData(surveyData);
      setShowSuccessPopup(true);
      setSurveyData({
        spaceName: "",
        spaceType: "co-working",
        mobileNumber: "",
        address: "",
        submittedBy: "",
        noOfTables: ""
      });
      Cookies.remove('survey_form_data');
      toast.success("✅ Survey submitted successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } else {
      throw new Error(result.error || result.message || "Failed to submit survey");
    }

  } catch (error) {
    console.error("Submit error:", error);
    setSurveyError(error.message || "Failed to submit survey. Please try again.");
    toast.error(error.message || "Failed to submit survey");
  } finally {
    setIsSurveySubmitting(false);
  }
};

  const handleClosePopup = () => {
    setShowSuccessPopup(false);
  };

  const handleClear = () => {
    setSurveyData({
      spaceName: "",
      spaceType: "co-working",
      mobileNumber: "",
      address: "",
      submittedBy: "",
      noOfTables: ""
    });
    setSurveyError("");
    Cookies.remove('survey_form_data');
    toast.info("Form cleared", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const getSpaceTypeIcon = (type) => {
    switch (type) {
      case "co-working":
        return <Building2 size={18} className="text-emerald-500" />;
      case "medical cabin":
        return <Stethoscope size={18} className="text-blue-500" />;
      case "cafe":
        return <Coffee size={18} className="text-amber-500" />;
      default:
        return <Building2 size={18} />;
    }
  };

  // Check if cafe is selected to show additional fields
  const isCafeSelected = surveyData.spaceType === 'cafe';

  return (
    <div className="user-visits" style={{ backgroundColor: "#f8fafc" }}>
      {/* <UsersNavbar /> */}
      <main className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        {/* Survey Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <RevealSection>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold uppercase tracking-wider mb-5 border border-emerald-200/60 shadow-sm">
              <span className="dot w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block mr-1"></span>
              Survey Form
            </div>
          </RevealSection>
          <RevealSection delay={0.1}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-3 tracking-tight">
              Space <span className="bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent">&amp; Cafe</span> Survey
            </h2>
          </RevealSection>
          <RevealSection delay={0.2}>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Please fill out the survey form below to submit details about your space or cafe.
            </p>
          </RevealSection>
        </div>

        {/* Survey Form Card */}
        <RevealSection delay={0.3}>
          <div className="max-w-xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl shadow-emerald-50/40 border border-gray-100/80 overflow-hidden transition-all duration-200 hover:shadow-2xl hover:shadow-emerald-50/50">
              {/* Card Header */}
              <div className="px-6 py-5 bg-gradient-to-r from-emerald-50/80 to-teal-50/60 border-b border-gray-100/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-xl">
                    <Award size={20} className="text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Share Your Experience</h3>
                    <p className="text-xs text-gray-500">Fill in the details below</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock size={12} />
                    Auto-saved
                  </span>
                  <button
                    type="button"
                    className="p-1.5 rounded-lg hover:bg-emerald-100/50 transition-colors group"
                    title="All fields are required"
                  >
                    <Info size={18} className="text-gray-400 group-hover:text-emerald-600 transition-colors" />
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="px-6 py-6">
                <form onSubmit={handleSurveySubmit} className="space-y-5">
                  {/* Space Name & Mobile - Row 1 */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-2 text-xs font-semibold mb-1.5" style={{ color: "#12181F" }}>
                        <Building2 size={14} className="text-emerald-500" />
                        Name space or cafe
                        <span className="text-red-500 text-xs font-normal">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Name space or cafe"
                        value={surveyData.spaceName}
                        onChange={(e) => setSurveyData({ ...surveyData, spaceName: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 focus:border-emerald-400 transition-all duration-200 hover:bg-white hover:border-emerald-200"
                        required
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-xs font-semibold mb-1.5" style={{ color: "#12181F" }}>
                        <Phone size={14} className="text-emerald-500" />
                        Mobile Number
                        <span className="text-red-500 text-xs font-normal">*</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="Mobile Number"
                        value={surveyData.mobileNumber}
                        onChange={(e) => setSurveyData({ ...surveyData, mobileNumber: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 focus:border-emerald-400 transition-all duration-200 hover:bg-white hover:border-emerald-200"
                        required
                      />
                    </div>
                  </div>

                  {/* Address & Space Type - Row 2 */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-2 text-xs font-semibold mb-1.5" style={{ color: "#12181F" }}>
                        <MapPin size={14} className="text-emerald-500" />
                        Address link or text
                        <span className="text-red-500 text-xs font-normal">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Address link or text"
                        value={surveyData.address}
                        onChange={(e) => setSurveyData({ ...surveyData, address: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 focus:border-emerald-400 transition-all duration-200 hover:bg-white hover:border-emerald-200"
                        required
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-xs font-semibold mb-1.5" style={{ color: "#12181F" }}>
                        {getSpaceTypeIcon(surveyData.spaceType)}
                        Space Type
                        <span className="text-red-500 text-xs font-normal">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={surveyData.spaceType}
                          onChange={(e) => {
                            const newType = e.target.value;
                            setSurveyData({ 
                              ...surveyData, 
                              spaceType: newType,
                              // Clear noOfTables if not cafe
                              noOfTables: newType === 'cafe' ? surveyData.noOfTables : ""
                            });
                          }}
                          className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 focus:border-emerald-400 transition-all duration-200 hover:bg-white hover:border-emerald-200 appearance-none cursor-pointer"
                          required
                        >
                          <option value="co-working">🏢 co-working</option>
                          <option value="medical cabin">🏥 medical cabin</option>
                          <option value="cafe">☕ cafe</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Conditional Field: Number of Tables (only for cafe) */}
                  {isCafeSelected && (
                    <div className="animate-slideDown">
                      <label className="flex items-center gap-2 text-xs font-semibold mb-1.5" style={{ color: "#12181F" }}>
                        <Utensils size={14} className="text-amber-500" />
                        Number of Tables
                        <span className="text-red-500 text-xs font-normal">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min="1"
                          placeholder="Enter number of tables"
                          value={surveyData.noOfTables}
                          onChange={(e) => setSurveyData({ ...surveyData, noOfTables: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400/60 focus:border-amber-400 transition-all duration-200 hover:bg-white hover:border-amber-200"
                          required
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                          <Utensils size={16} />
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">Please enter the total number of tables available at the cafe.</p>
                    </div>
                  )}

                  {/* Submitted By */}
                  <div>
                    <label className="flex items-center gap-2 text-xs font-semibold mb-1.5" style={{ color: "#12181F" }}>
                      <User size={14} className="text-gray-400" />
                      Submitted By
                      <span className="text-red-500 text-xs font-normal">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Submitted by"
                      value={surveyData.submittedBy}
                      onChange={(e) => setSurveyData({ ...surveyData, submittedBy: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 focus:border-emerald-400 transition-all duration-200 hover:bg-white hover:border-emerald-200"
                      required
                    />
                  </div>

                  {/* Error Message */}
                  {surveyError && (
                    <div className="p-3 rounded-xl text-sm" style={{ background: "#F3E9E3", color: "#8B4433", border: "1px solid #E3C3B4" }}>
                      {surveyError}
                    </div>
                  )}

                  {/* Divider */}
                  <div className="border-t border-gray-100/80 pt-4"></div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-stretch gap-3">
                    <button
                      type="submit"
                      disabled={isSurveySubmitting}
                      className="flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-200/50 hover:shadow-xl hover:shadow-emerald-300/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex-1"
                    >
                      {isSurveySubmitting ? (
                        <>
                          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle opacity="0.25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path opacity="0.75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Submitting Survey…
                        </>
                      ) : (
                        <>
                          Submit Survey <Send size={16} />
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleClear}
                      className="flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-100/80 text-gray-600 font-semibold rounded-xl hover:bg-gray-200/80 hover:text-gray-800 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <X size={18} />
                      Clear All
                    </button>
                  </div>

                  {/* Form hint */}
                  <p className="text-xs text-center text-gray-400 mt-2 flex items-center justify-center gap-4">
                    <span><span className="text-red-400">*</span> All fields are required</span>
                    <span className="w-px h-3 bg-gray-200"></span>
                    <span className="flex items-center gap-1">
                      <Star size={10} className="text-emerald-400 fill-emerald-400" />
                      Auto-saved in cookies
                    </span>
                  </p>
                </form>
              </div>
            </div>

            {/* Back navigation link */}
            <div className="text-center mt-6">
              <button
                onClick={() => navigate("/surveydetails")}
                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-600 transition-colors duration-200 group"
              >
                <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Back to Survey Details
              </button>
            </div>
          </div>
        </RevealSection>
      </main>

      {/* Success Popup */}
      <SuccessPopup 
        isOpen={showSuccessPopup} 
        onClose={handleClosePopup} 
        surveyData={submittedData}
      />

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
            max-height: 0;
          }
          to {
            opacity: 1;
            transform: translateY(0);
            max-height: 200px;
          }
        }
        @keyframes popup {
          0% {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .reveal-section {
          opacity: 0;
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease forwards;
          overflow: hidden;
        }
        .animate-popup {
          animation: popup 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default Survey;