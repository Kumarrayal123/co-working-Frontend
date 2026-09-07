// Survey.jsx - Full survey form with multi-step questions
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Building2,
  Phone,
  MapPin,
  User,
  ChevronLeft,
  CheckCircle,
  X,
  Coffee,
  Stethoscope,
  Send,
  Utensils,
  ChevronRight,
  AlertCircle,
  Clock as ClockIcon
} from "lucide-react";
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

// Generate time slots (30-minute intervals)
const generateTimeSlots = () => {
  const times = [];
  for (let i = 0; i < 24; i++) {
    for (let j = 0; j < 60; j += 30) {
      const hour12 = i % 12 || 12;
      const ampm = i >= 12 ? 'PM' : 'AM';
      const displayHour = hour12.toString().padStart(2, '0');
      const minute = j.toString().padStart(2, '0');
      times.push(`${displayHour}:${minute} ${ampm}`);
    }
  }
  return times;
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
const SuccessPopup = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-popup">
        <div className="absolute -top-3 -right-3 w-16 h-16 bg-emerald-100 rounded-full opacity-50" />
        <div className="absolute -bottom-3 -left-3 w-14 h-14 bg-teal-100 rounded-full opacity-30" />
        <div className="relative">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-400 rounded-full blur-2xl opacity-30 animate-pulse" />
              <div className="relative bg-gradient-to-br from-emerald-500 to-teal-400 rounded-full p-4 shadow-lg shadow-emerald-200/50">
                <CheckCircle size={32} className="text-white" />
              </div>
            </div>
          </div>
          <h3 className="text-lg font-bold text-center text-gray-900 mb-1">
            Survey Submitted! 🎉
          </h3>
          <p className="text-sm text-center text-gray-600 mb-4">
            This is submitted now. You can enter the next survey if you want.
          </p>
          <button
            onClick={onClose}
            className="w-full py-2.5 text-sm bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-lg shadow-lg shadow-emerald-200/50 hover:shadow-xl hover:shadow-emerald-300/50 transition-all duration-200"
          >
            Got it! 👍
          </button>
        </div>
      </div>
    </div>
  );
};

// Question Component
const Question = ({ number, title, description, children, required = false }) => {
  return (
    <div className="mb-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-start gap-2 mb-2">
        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
          {number}
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
          {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
        </div>
        {required && <span className="text-red-500 text-xs ml-auto">*</span>}
      </div>
      <div className="pl-8">
        {children}
      </div>
    </div>
  );
};

const Survey = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const timeSlots = generateTimeSlots();

  // Basic Details
  const [basicDetails, setBasicDetails] = useState({
    spaceName: "",
    spaceType: "co-working",
    mobileNumber: "",
    address: ""
  });

  // Survey Questions
  const [surveyAnswers, setSurveyAnswers] = useState({
    noOfTablesSurvey: "",
    totalSeatsTables: "",
    busiestDays: [],
    busiestStartTime: "",
    busiestEndTime: "",
    slowestStartTime: "",
    slowestEndTime: "",
    unusedTablesPercentage: "",
    currentUnusedTablesAction: "",
    additionalCustomersValuable: "",
    triedOffPeakMethods: "",
    offPeakWhatWorked: "",
    offPeakWhatDidntWork: "",
    biggestConcern: "",
    offerUnusedTables: "",
    controlComfortable: "",
    preferredChargingMethod: "",
    reasonableAmount: "",
    complimentaryDrink: "",
    comfortableOffering: "",
    willingToParticipate: "",
    availableTables: "",
    availableDays: "",
    availableHours: "",
    desiredPrice: "",
    submittedBy: ""
  });

  const steps = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'questions', label: 'Survey Questions' }
  ];

  // Load saved cookie data on mount
  useEffect(() => {
    const savedData = Cookies.get('survey_form_data');
    if (savedData) {
      setBasicDetails(prev => ({ ...prev, ...savedData.basicDetails }));
      setSurveyAnswers(prev => ({ ...prev, ...savedData.surveyAnswers }));
    }
  }, []);

  // Save to cookie on change
  useEffect(() => {
    const timer = setTimeout(() => {
      Cookies.set('survey_form_data', { basicDetails, surveyAnswers }, 7);
    }, 500);
    return () => clearTimeout(timer);
  }, [basicDetails, surveyAnswers]);

  const handleBasicChange = (e) => {
    const { name, value } = e.target;
    setBasicDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSurveyChange = (field, value) => {
    setSurveyAnswers(prev => ({ ...prev, [field]: value }));
  };

  // NO VALIDATION - All fields optional
  const validateBasicDetails = () => {
    return null;
  };

  const validateSurveyQuestions = () => {
    return null;
  };

  const handleNext = () => {
    // Skip validation, just go to next step
    setCurrentStep(1);
  };

  const handleBack = () => {
    setCurrentStep(0);
    setError("");
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const submitData = {
        title: basicDetails.spaceName || "Anonymous Survey",
        description: `${basicDetails.spaceType || "Unknown"} space at ${basicDetails.address || "Unknown location"}`,
        questions: [
          { text: `Space Name: ${basicDetails.spaceName || 'N/A'}`, type: 'text' },
          { text: `Space Type: ${basicDetails.spaceType || 'N/A'}`, type: 'text' },
          { text: `Mobile Number: ${basicDetails.mobileNumber || 'N/A'}`, type: 'text' },
          { text: `Address: ${basicDetails.address || 'N/A'}`, type: 'text' },
          { text: `Q1 - Number of Tables: ${surveyAnswers.noOfTablesSurvey || 'N/A'}`, type: 'text' },
          { text: `Q2 - Total seats/tables: ${surveyAnswers.totalSeatsTables || 'N/A'}`, type: 'text' },
          { text: `Q3 - Busiest days: ${surveyAnswers.busiestDays.join(', ') || 'N/A'}`, type: 'text' },
          { text: `Q4 - Busiest hours: ${surveyAnswers.busiestStartTime || 'N/A'} - ${surveyAnswers.busiestEndTime || 'N/A'}`, type: 'text' },
          { text: `Q5 - Slowest hours: ${surveyAnswers.slowestStartTime || 'N/A'} - ${surveyAnswers.slowestEndTime || 'N/A'}`, type: 'text' },
          { text: `Q6 - Unused tables percentage: ${surveyAnswers.unusedTablesPercentage || 'N/A'}`, type: 'text' },
          { text: `Q7 - Current unused tables action: ${surveyAnswers.currentUnusedTablesAction || 'N/A'}`, type: 'text' },
          { text: `Q8 - Additional customers valuable: ${surveyAnswers.additionalCustomersValuable || 'N/A'}`, type: 'text' },
          { text: `Q9 - Tried off-peak methods: ${surveyAnswers.triedOffPeakMethods || 'N/A'}`, type: 'text' },
          { text: `Q9a - What worked: ${surveyAnswers.offPeakWhatWorked || 'N/A'}`, type: 'text' },
          { text: `Q9b - What didn't work: ${surveyAnswers.offPeakWhatDidntWork || 'N/A'}`, type: 'text' },
          { text: `Q10 - Biggest concern: ${surveyAnswers.biggestConcern || 'N/A'}`, type: 'text' },
          { text: `Q11 - Offer unused tables: ${surveyAnswers.offerUnusedTables || 'N/A'}`, type: 'text' },
          { text: `Q12 - Control comfortable: ${surveyAnswers.controlComfortable || 'N/A'}`, type: 'text' },
          { text: `Q13 - Preferred charging: ${surveyAnswers.preferredChargingMethod || 'N/A'}`, type: 'text' },
          { text: `Q14 - Reasonable amount: ${surveyAnswers.reasonableAmount || 'N/A'}`, type: 'text' },
          { text: `Q15 - Complimentary drink: ${surveyAnswers.complimentaryDrink || 'N/A'}`, type: 'text' },
          { text: `Q16 - Comfortable offering: ${surveyAnswers.comfortableOffering || 'N/A'}`, type: 'text' },
          { text: `Q17 - Willing to participate: ${surveyAnswers.willingToParticipate || 'N/A'}`, type: 'text' },
          { text: `Q17a - Available tables: ${surveyAnswers.availableTables || 'N/A'}`, type: 'text' },
          { text: `Q17b - Available days: ${surveyAnswers.availableDays || 'N/A'}`, type: 'text' },
          { text: `Q17c - Available hours: ${surveyAnswers.availableHours || 'N/A'}`, type: 'text' },
          { text: `Q17d - Desired price: ${surveyAnswers.desiredPrice || 'N/A'}`, type: 'text' },
          { text: `Q18 - Submitted By: ${surveyAnswers.submittedBy || 'N/A'}`, type: 'text' }
        ],
        noOfTables: surveyAnswers.noOfTablesSurvey ? parseInt(surveyAnswers.noOfTablesSurvey) : null,
        spaceName: basicDetails.spaceName || "Anonymous",
        spaceType: basicDetails.spaceType || "co-working",
        mobileNumber: basicDetails.mobileNumber || "",
        address: basicDetails.address || "",
        submittedBy: surveyAnswers.submittedBy || "Anonymous",
        surveyAnswers: surveyAnswers
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setShowSuccessPopup(true);
        Cookies.remove('survey_form_data');
        toast.success("✅ Survey submitted successfully!");
      } else {
        throw new Error(result.error || result.message || "Failed to submit survey");
      }

    } catch (error) {
      console.error("Submit error:", error);
      setError(error.message || "Failed to submit survey. Please try again.");
      toast.error(error.message || "Failed to submit survey");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClosePopup = () => {
    setShowSuccessPopup(false);
    setBasicDetails({
      spaceName: "",
      spaceType: "co-working",
      mobileNumber: "",
      address: ""
    });
    setSurveyAnswers({
      noOfTablesSurvey: "",
      totalSeatsTables: "",
      busiestDays: [],
      busiestStartTime: "",
      busiestEndTime: "",
      slowestStartTime: "",
      slowestEndTime: "",
      unusedTablesPercentage: "",
      currentUnusedTablesAction: "",
      additionalCustomersValuable: "",
      triedOffPeakMethods: "",
      offPeakWhatWorked: "",
      offPeakWhatDidntWork: "",
      biggestConcern: "",
      offerUnusedTables: "",
      controlComfortable: "",
      preferredChargingMethod: "",
      reasonableAmount: "",
      complimentaryDrink: "",
      comfortableOffering: "",
      willingToParticipate: "",
      availableTables: "",
      availableDays: "",
      availableHours: "",
      desiredPrice: "",
      submittedBy: ""
    });
    setError("");
    setCurrentStep(0);
    navigate("/survey");
  };

  const handleClear = () => {
    setBasicDetails({
      spaceName: "",
      spaceType: "co-working",
      mobileNumber: "",
      address: ""
    });
    setSurveyAnswers({
      noOfTablesSurvey: "",
      totalSeatsTables: "",
      busiestDays: [],
      busiestStartTime: "",
      busiestEndTime: "",
      slowestStartTime: "",
      slowestEndTime: "",
      unusedTablesPercentage: "",
      currentUnusedTablesAction: "",
      additionalCustomersValuable: "",
      triedOffPeakMethods: "",
      offPeakWhatWorked: "",
      offPeakWhatDidntWork: "",
      biggestConcern: "",
      offerUnusedTables: "",
      controlComfortable: "",
      preferredChargingMethod: "",
      reasonableAmount: "",
      complimentaryDrink: "",
      comfortableOffering: "",
      willingToParticipate: "",
      availableTables: "",
      availableDays: "",
      availableHours: "",
      desiredPrice: "",
      submittedBy: ""
    });
    setError("");
    setCurrentStep(0);
    Cookies.remove('survey_form_data');
    toast.info("Form cleared");
  };

  const getSpaceTypeIcon = (type) => {
    switch (type) {
      case "co-working":
        return <Building2 size={14} className="text-emerald-500" />;
      case "medical cabin":
        return <Stethoscope size={14} className="text-blue-500" />;
      case "cafe":
        return <Coffee size={14} className="text-amber-500" />;
      default:
        return <Building2 size={14} />;
    }
  };

  return (
    <div className="user-visits" style={{ backgroundColor: "#f5f7fa", minHeight: "100vh" }}>
      <main className="py-6 px-4 max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <RevealSection>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold uppercase tracking-wider mb-3 border border-emerald-200/60">
              <span className="dot w-1 h-1 rounded-full bg-emerald-500 inline-block"></span>
              Survey Form
            </div>
          </RevealSection>
          <RevealSection delay={0.1}>
            <h2 className="text-2xl font-bold text-gray-900">
              Space <span className="text-emerald-600">&amp; Cafe</span> Survey
            </h2>
          </RevealSection>
          <RevealSection delay={0.2}>
            <p className="text-sm text-gray-500 mt-1">
              Please fill out the survey form below
            </p>
          </RevealSection>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-gray-600">Step {currentStep + 1} of 2</span>
              <span className="text-[10px] text-gray-400">{steps[currentStep].label}</span>
            </div>
            <div className="flex-1 max-w-[200px] ml-4">
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}

        {/* Form Content */}
        {currentStep === 0 ? (
          // Basic Details Step
          <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
            <div className="px-5 py-3 bg-gray-50 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-800">Basic Details</h3>
              <p className="text-[10px] text-gray-500">Fill in your basic information</p>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">Name space or cafe</label>
                  <input
                    type="text"
                    name="spaceName"
                    placeholder="Name space or cafe"
                    value={basicDetails.spaceName}
                    onChange={handleBasicChange}
                    className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">Mobile Number</label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    placeholder="Mobile Number"
                    value={basicDetails.mobileNumber}
                    onChange={handleBasicChange}
                    className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">Address link or text</label>
                  <input
                    type="text"
                    name="address"
                    placeholder="Address link or text"
                    value={basicDetails.address}
                    onChange={handleBasicChange}
                    className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">Space Type</label>
                  <select
                    name="spaceType"
                    value={basicDetails.spaceType}
                    onChange={handleBasicChange}
                    className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="co-working">co-working</option>
                    <option value="medical cabin">medical cabin</option>
                    <option value="cafe">cafe</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end mt-5 pt-4 border-t border-gray-100">
                <button
                  onClick={handleNext}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm bg-emerald-500 text-white font-medium rounded-lg hover:bg-emerald-600 transition-all"
                >
                  Next <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Survey Questions Step
          <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
            <div className="px-5 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-800">Survey Questions</h3>
                <p className="text-[10px] text-gray-500">Answer all questions (all optional)</p>
              </div>
              <button
                onClick={handleClear}
                className="text-[10px] text-red-500 hover:text-red-700 transition-colors"
              >
                Clear All
              </button>
            </div>
            <div className="p-4 max-h-[70vh] overflow-y-auto">

              {/* Q1 */}
              <Question number={1} title="How many tables do you have?">
                <input
                  type="number"
                  min="1"
                  placeholder="Enter number of tables"
                  value={surveyAnswers.noOfTablesSurvey}
                  onChange={(e) => handleSurveyChange('noOfTablesSurvey', e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition-all"
                />
              </Question>

              {/* Q2 */}
              <Question number={2} title="How many total seats/tables do you have?">
                <input
                  type="number"
                  min="1"
                  placeholder="Enter total seats/tables"
                  value={surveyAnswers.totalSeatsTables}
                  onChange={(e) => handleSurveyChange('totalSeatsTables', e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition-all"
                />
              </Question>

              {/* Q3 */}
              <Question number={3} title="What are your busiest days?">
                <div className="flex flex-wrap gap-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                    <label key={day} className="flex items-center gap-1.5 cursor-pointer text-sm">
                      <input
                        type="checkbox"
                        checked={surveyAnswers.busiestDays.includes(day)}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          const current = surveyAnswers.busiestDays;
                          if (checked) {
                            handleSurveyChange('busiestDays', [...current, day]);
                          } else {
                            handleSurveyChange('busiestDays', current.filter(d => d !== day));
                          }
                        }}
                        className="w-3.5 h-3.5 text-emerald-500 rounded border-gray-300 focus:ring-emerald-500"
                      />
                      <span className="text-xs text-gray-700">{day}</span>
                    </label>
                  ))}
                </div>
              </Question>

              {/* Q4 */}
              <Question number={4} title="What are your busiest hours?">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-medium text-gray-600 block mb-0.5">Start Time</label>
                    <select
                      value={surveyAnswers.busiestStartTime || ""}
                      onChange={(e) => handleSurveyChange('busiestStartTime', e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition-all"
                    >
                      <option value="">Select</option>
                      {timeSlots.slice(0, 12).map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-medium text-gray-600 block mb-0.5">End Time</label>
                    <select
                      value={surveyAnswers.busiestEndTime || ""}
                      onChange={(e) => handleSurveyChange('busiestEndTime', e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition-all"
                    >
                      <option value="">Select</option>
                      {timeSlots.slice(0, 12).map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </Question>

              {/* Q5 */}
              <Question number={5} title="What are your slowest hours?">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-medium text-gray-600 block mb-0.5">Start Time</label>
                    <select
                      value={surveyAnswers.slowestStartTime || ""}
                      onChange={(e) => handleSurveyChange('slowestStartTime', e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition-all"
                    >
                      <option value="">Select</option>
                      {timeSlots.slice(0, 12).map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-medium text-gray-600 block mb-0.5">End Time</label>
                    <select
                      value={surveyAnswers.slowestEndTime || ""}
                      onChange={(e) => handleSurveyChange('slowestEndTime', e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition-all"
                    >
                      <option value="">Select</option>
                      {timeSlots.slice(0, 12).map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </Question>

              {/* Q6 */}
              <Question number={6} title="During your slowest period, approximately how many tables remain unused?">
                <div className="grid grid-cols-3 gap-2">
                  {['0–10%', '10–25%', '25–40%', '40–60%', '60%+'].map(option => (
                    <label key={option} className="flex items-center gap-1.5 cursor-pointer text-sm p-1.5 border rounded-lg hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="unusedTables"
                        value={option}
                        checked={surveyAnswers.unusedTablesPercentage === option}
                        onChange={(e) => handleSurveyChange('unusedTablesPercentage', e.target.value)}
                        className="w-3.5 h-3.5 text-emerald-500 border-gray-300 focus:ring-emerald-500"
                      />
                      <span className="text-xs text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              </Question>

              {/* Q7 */}
              <Question number={7} title="What do you currently do with your unused tables during slow hours?">
                <textarea
                  placeholder="Describe what you do with unused tables"
                  value={surveyAnswers.currentUnusedTablesAction}
                  onChange={(e) => handleSurveyChange('currentUnusedTablesAction', e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition-all min-h-[60px]"
                />
              </Question>

              {/* Q8 */}
              <Question number={8} title="Would additional customers during these hours be valuable to you?">
                <div className="flex gap-3">
                  {['Yes', 'No', 'Maybe'].map(option => (
                    <label key={option} className="flex items-center gap-1.5 cursor-pointer text-sm p-1.5 border rounded-lg hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="additionalCustomers"
                        value={option}
                        checked={surveyAnswers.additionalCustomersValuable === option}
                        onChange={(e) => handleSurveyChange('additionalCustomersValuable', e.target.value)}
                        className="w-3.5 h-3.5 text-emerald-500 border-gray-300 focus:ring-emerald-500"
                      />
                      <span className="text-xs text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              </Question>

              {/* Q9 */}
              <Question number={9} title="Have you tried any method to increase off-peak revenue?">
                <div className="space-y-2">
                  <div className="flex gap-3">
                    {['Yes', 'No'].map(option => (
                      <label key={option} className="flex items-center gap-1.5 cursor-pointer text-sm p-1.5 border rounded-lg hover:bg-gray-50 transition-colors">
                        <input
                          type="radio"
                          name="triedOffPeak"
                          value={option}
                          checked={surveyAnswers.triedOffPeakMethods === option}
                          onChange={(e) => handleSurveyChange('triedOffPeakMethods', e.target.value)}
                          className="w-3.5 h-3.5 text-emerald-500 border-gray-300 focus:ring-emerald-500"
                        />
                        <span className="text-xs text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                  {surveyAnswers.triedOffPeakMethods === 'Yes' && (
                    <div className="pl-4 border-l-2 border-emerald-200 space-y-2">
                      <input
                        type="text"
                        placeholder="What worked?"
                        value={surveyAnswers.offPeakWhatWorked}
                        onChange={(e) => handleSurveyChange('offPeakWhatWorked', e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition-all"
                      />
                      <input
                        type="text"
                        placeholder="What didn't work?"
                        value={surveyAnswers.offPeakWhatDidntWork}
                        onChange={(e) => handleSurveyChange('offPeakWhatDidntWork', e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition-all"
                      />
                    </div>
                  )}
                </div>
              </Question>

              {/* Q10 */}
              <Question number={10} title="What is your biggest concern about allowing professionals/freelancers to work from your café?">
                <textarea
                  placeholder="Describe your biggest concern"
                  value={surveyAnswers.biggestConcern}
                  onChange={(e) => handleSurveyChange('biggestConcern', e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition-all min-h-[60px]"
                />
              </Question>

              {/* Q11 */}
              <Question number={11} title="Would you consider offering some of your unused tables through this model?">
                <div className="grid grid-cols-2 gap-2">
                  {['Definitely Yes', 'Maybe', 'Probably Not', 'Definitely Not'].map(option => (
                    <label key={option} className="flex items-center gap-1.5 cursor-pointer text-sm p-1.5 border rounded-lg hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="offerUnused"
                        value={option}
                        checked={surveyAnswers.offerUnusedTables === option}
                        onChange={(e) => handleSurveyChange('offerUnusedTables', e.target.value)}
                        className="w-3.5 h-3.5 text-emerald-500 border-gray-300 focus:ring-emerald-500"
                      />
                      <span className="text-[10px] text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              </Question>

              {/* Q12 */}
              <Question number={12} title="Would this level of control make you comfortable participating?">
                <div className="flex gap-3">
                  {['Yes', 'No', 'Maybe'].map(option => (
                    <label key={option} className="flex items-center gap-1.5 cursor-pointer text-sm p-1.5 border rounded-lg hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="controlComfortable"
                        value={option}
                        checked={surveyAnswers.controlComfortable === option}
                        onChange={(e) => handleSurveyChange('controlComfortable', e.target.value)}
                        className="w-3.5 h-3.5 text-emerald-500 border-gray-300 focus:ring-emerald-500"
                      />
                      <span className="text-xs text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              </Question>

              {/* Q13 */}
              <Question number={13} title="How would you prefer IRYAX to charge you?">
                <div className="space-y-1">
                  {['Percentage of every booking', 'Fixed monthly fee', 'Small platform fee per booking', 'Combination', 'Other'].map(option => (
                    <label key={option} className="flex items-center gap-1.5 cursor-pointer text-sm p-1.5 border rounded-lg hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="preferredCharging"
                        value={option}
                        checked={surveyAnswers.preferredChargingMethod === option}
                        onChange={(e) => handleSurveyChange('preferredChargingMethod', e.target.value)}
                        className="w-3.5 h-3.5 text-emerald-500 border-gray-300 focus:ring-emerald-500"
                      />
                      <span className="text-xs text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              </Question>

              {/* Q14 */}
              <Question number={14} title="If a professional books your table for 2 hours, what would you consider a reasonable amount for the café to receive?">
                <input
                  type="text"
                  placeholder="Enter amount (e.g., $10, ₹200)"
                  value={surveyAnswers.reasonableAmount}
                  onChange={(e) => handleSurveyChange('reasonableAmount', e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition-all"
                />
              </Question>

              {/* Q15 */}
              <Question number={15} title="Would you be interested in offering a complimentary drink?">
                <div className="space-y-1">
                  {['Yes, always', 'Yes, during selected hours', 'Only for certain packages', 'No'].map(option => (
                    <label key={option} className="flex items-center gap-1.5 cursor-pointer text-sm p-1.5 border rounded-lg hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="complimentaryDrink"
                        value={option}
                        checked={surveyAnswers.complimentaryDrink === option}
                        onChange={(e) => handleSurveyChange('complimentaryDrink', e.target.value)}
                        className="w-3.5 h-3.5 text-emerald-500 border-gray-300 focus:ring-emerald-500"
                      />
                      <span className="text-xs text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              </Question>

              {/* Q16 */}
              <Question number={16} title="What would you be comfortable offering?">
                <input
                  type="text"
                  placeholder="Describe what you'd be comfortable offering"
                  value={surveyAnswers.comfortableOffering}
                  onChange={(e) => handleSurveyChange('comfortableOffering', e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition-all"
                />
              </Question>

              {/* Q17 */}
              <Question number={17} title="If IRYAX SPACE launches next month, would you be willing to participate in a pilot?">
                <div className="space-y-1">
                  {['YES — I want to participate', 'MAYBE — Contact me when you launch', 'NO'].map(option => (
                    <label key={option} className="flex items-center gap-1.5 cursor-pointer text-sm p-1.5 border rounded-lg hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="willingToParticipate"
                        value={option === 'YES — I want to participate' ? 'yes' : option === 'MAYBE — Contact me when you launch' ? 'maybe' : 'no'}
                        checked={surveyAnswers.willingToParticipate === (option === 'YES — I want to participate' ? 'yes' : option === 'MAYBE — Contact me when you launch' ? 'maybe' : 'no')}
                        onChange={(e) => handleSurveyChange('willingToParticipate', e.target.value)}
                        className="w-3.5 h-3.5 text-emerald-500 border-gray-300 focus:ring-emerald-500"
                      />
                      <span className="text-[10px] text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>

                {surveyAnswers.willingToParticipate === 'yes' && (
                  <div className="mt-3 space-y-3 pl-4 border-l-2 border-emerald-200 animate-slideDown">
                    <input
                      type="number"
                      min="1"
                      placeholder="Available tables"
                      value={surveyAnswers.availableTables}
                      onChange={(e) => handleSurveyChange('availableTables', e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition-all"
                    />
                    <input
                      type="text"
                      placeholder="Which days?"
                      value={surveyAnswers.availableDays}
                      onChange={(e) => handleSurveyChange('availableDays', e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition-all"
                    />
                    <input
                      type="text"
                      placeholder="Which hours?"
                      value={surveyAnswers.availableHours}
                      onChange={(e) => handleSurveyChange('availableHours', e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition-all"
                    />
                    <input
                      type="text"
                      placeholder="What price?"
                      value={surveyAnswers.desiredPrice}
                      onChange={(e) => handleSurveyChange('desiredPrice', e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition-all"
                    />
                  </div>
                )}
              </Question>

              {/* Q18 */}
              <Question number={18} title="Your Name / Submitted By">
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={surveyAnswers.submittedBy}
                  onChange={(e) => handleSurveyChange('submittedBy', e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition-all"
                />
              </Question>

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 mt-6 pt-4 border-t border-gray-100">
                <button
                  onClick={handleBack}
                  className="flex items-center justify-center gap-1.5 px-4 py-2 text-sm bg-gray-100 text-gray-600 font-medium rounded-lg hover:bg-gray-200 transition-all"
                >
                  <ChevronLeft size={15} /> Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-1.5 px-4 py-2 text-sm bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-lg shadow-lg shadow-emerald-200/50 hover:shadow-xl hover:shadow-emerald-300/50 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex-1"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle opacity="0.25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path opacity="0.75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Survey <Send size={15} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Success Popup */}
      <SuccessPopup 
        isOpen={showSuccessPopup} 
        onClose={handleClosePopup} 
      />

      {/* Styles */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(15px);
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
            max-height: 400px;
          }
        }
        @keyframes popup {
          0% {
            opacity: 0;
            transform: scale(0.9) translateY(15px);
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
          animation: popup 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default Survey;