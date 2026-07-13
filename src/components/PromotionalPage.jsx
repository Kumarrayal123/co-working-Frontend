// PromotionalPage.jsx
import React, { useEffect, useState, createContext, useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Building2,
  Users,
  Calendar,
  Clock,
  CheckCircle,
  ArrowRight,
  Star,
  Shield,
  Headphones,
  MapPin,
  Wifi,
  Coffee,
  Monitor,
  Menu,
  X,
  PlayCircle,
  Wallet,
  Globe,
  Sparkles,
  Zap,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Mail,
  Phone,
  Send,
  Sun,
  Moon,
  Award,
  TrendingUp,
  Rocket,
  Target,
  ParkingCircle,
  Lock,
  Sofa,
  Bath,
  Dumbbell,
  Tv,
  Printer,
  PhoneCall,
  Fan,
  Eye,
  Grid3x3,
  Bed,
  Square,
  LayoutGrid
} from "lucide-react";
import logo from "../assets/logo.png";

// ─── INLINE STYLES FOR ANIMATIONS ───
const animationStyles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-30px) rotate(180deg); }
  }
  @keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes fade-in-up {
    from { opacity: 0; transform: translateY(50px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes bounce-slow {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-12px); }
  }
  @keyframes pulse-slow {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.7; transform: scale(0.98); }
  }
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes scale-in {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
  }

  .animate-float {
    animation: float linear infinite;
  }
  .animate-gradient {
    background-size: 200% 200%;
    animation: gradient 3s ease infinite;
  }
  .animate-bounce-slow {
    animation: bounce-slow 2s ease-in-out infinite;
  }
  .animate-pulse-slow {
    animation: pulse-slow 3s ease-in-out infinite;
  }
  .animate-spin-slow {
    animation: spin-slow 4s linear infinite;
  }
  .animate-spin {
    animation: spin 0.5s linear;
  }

  .reveal {
    opacity: 0;
    transform: translateY(50px);
    transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .reveal.visible {
    opacity: 1;
    transform: translateY(0);
  }
  .reveal-delay-100 { transition-delay: 0.1s; }
  .reveal-delay-200 { transition-delay: 0.2s; }
  .reveal-delay-300 { transition-delay: 0.3s; }
  .reveal-delay-400 { transition-delay: 0.4s; }
  .reveal-delay-500 { transition-delay: 0.5s; }
  .reveal-delay-600 { transition-delay: 0.6s; }

  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  ::-webkit-scrollbar {
    width: 8px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background: #3b82f6;
    border-radius: 10px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #2563eb;
  }
`;

// ─── SCROLL REVEAL HOOK ───
const useScrollReveal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [isVisible]);

  return { ref, isVisible };
};

// ─── THEME CONTEXT ───
const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("iryax-theme");
    return saved || "dark";
  });

  useEffect(() => {
    localStorage.setItem("iryax-theme", theme);
    document.documentElement.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => useContext(ThemeContext);

// ─── REVEAL SECTION COMPONENT ───
const RevealSection = ({ children, delay = 0, className = "" }) => {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div 
      ref={ref} 
      className={`reveal ${isVisible ? 'visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
};

// ─── TYPING ANIMATION ───
const TypingText = ({ words, speed = 150, pause = 2000 }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const word = words[currentWordIndex];
    const shouldDelete = isDeleting;
    const shouldPause = isPaused;

    if (shouldPause) {
      const pauseTimeout = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, pause);
      return () => clearTimeout(pauseTimeout);
    }

    const timeout = setTimeout(() => {
      if (!shouldDelete) {
        setCurrentText(word.substring(0, currentText.length + 1));
        if (currentText.length + 1 === word.length) {
          setIsPaused(true);
        }
      } else {
        setCurrentText(word.substring(0, currentText.length - 1));
        if (currentText.length === 0) {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, shouldDelete ? speed / 2 : speed);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, isPaused, currentWordIndex, words, speed, pause]);

  return (
    <span className="inline-block min-w-[140px]">
      {currentText}
      <span className="animate-pulse text-blue-400 font-bold">|</span>
    </span>
  );
};

// ─── COUNTER ANIMATION ───
const Counter = ({ target, suffix = "", duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let startTime;
    let animationFrame;

    const updateCount = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateCount);
      }
    };

    animationFrame = requestAnimationFrame(updateCount);
    return () => cancelAnimationFrame(animationFrame);
  }, [isVisible, target, duration]);

  return (
    <span ref={elementRef}>
      {count}{suffix}
    </span>
  );
};

// ─── GET AMENITY FUNCTIONS ───
const getAmenityIcon = (amenityKey) => {
  const icons = {
    wifi: Wifi,
    parking: ParkingCircle,
    lockers: Lock,
    comfortSeating: Sofa,
    privateWashroom: Bath,
    secureAccess: Shield,
    coffee: Coffee,
    gym: Dumbbell,
    ac: Fan,
    tv: Tv,
    printer: Printer,
    phone: PhoneCall
  };
  return icons[amenityKey] || null;
};

const getAmenityLabel = (amenityKey) => {
  const labels = {
    wifi: "WiFi",
    parking: "Parking",
    lockers: "Lockers",
    comfortSeating: "Comfort Seating",
    privateWashroom: "Private Washroom",
    secureAccess: "Secure Access",
    coffee: "Coffee",
    gym: "Gym",
    ac: "AC",
    tv: "TV",
    printer: "Printer",
    phone: "Phone"
  };
  return labels[amenityKey] || amenityKey;
};

// ─── MAIN COMPONENT ───
const PromotionalPage = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [cabins, setCabins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const typingWords = ["Space", "Office", "Cabin", "Meeting Room", "Workspace"];

  // Fetch cabins from API
  useEffect(() => {
    const fetchCabins = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://62.72.29.27:5003/api/cabins");
        if (!response.ok) throw new Error("Failed to fetch cabins");
        const data = await response.json();
        const activeCabins = data.filter(cabin => cabin.isActive === true);
        setCabins(activeCabins);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCabins();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleGetStarted = () => navigate("/login");
  const handleExplore = () => navigate("/spaces");
  const handleViewAll = () => navigate("/spaces");

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setFormSubmitted(true);
      setTimeout(() => setFormSubmitted(false), 3000);
      setFormData({ name: "", email: "", message: "" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Theme colors
  const bg = isDark ? "bg-[#0a0a0f]" : "bg-white";
  const bgNav = isDark ? "bg-[#0a0a0f]/80" : "bg-white/80";
  const border = isDark ? "border-white/10" : "border-gray-200";
  const text = isDark ? "text-white" : "text-gray-900";
  const textSecondary = isDark ? "text-gray-400" : "text-gray-600";

  const features = [
    { icon: Building2, title: "Premium Spaces", description: "Fully furnished cabins with high-speed internet and modern amenities.", delay: 0 },
    { icon: Clock, title: "Flexible Booking", description: "Book by hour, day, or month. Cancel anytime.", delay: 0.1 },
    { icon: Wallet, title: "Smart Payments", description: "Secure payments with wallet system. Transparent pricing.", delay: 0.2 },
    { icon: Shield, title: "Safe & Secure", description: "24/7 security and insured spaces.", delay: 0.3 },
    { icon: Users, title: "Community Events", description: "Networking events and workshops to grow your business.", delay: 0.4 },
    { icon: Headphones, title: "Dedicated Support", description: "24/7 customer support for all your needs.", delay: 0.5 }
  ];

  const stats = [
    { label: "Happy Users", value: 5000, suffix: "+" },
    { label: "Spaces", value: 150, suffix: "+" },
    { label: "Bookings", value: 12000, suffix: "+" },
    { label: "Cities", value: 15, suffix: "+" }
  ];

  const amenities = [
    { icon: Wifi, label: "High-Speed WiFi" },
    { icon: Coffee, label: "Free Coffee" },
    { icon: Monitor, label: "Meeting Rooms" },
    { icon: MapPin, label: "Prime Locations" },
    { icon: Shield, label: "24/7 Security" }
  ];

  const faqs = [
    {
      category: "Subscription & Plans",
      question: "What are the subscription plans available?",
      answer: "We offer flexible plans - Hourly (₹199/hr), Daily (₹999/day), and Monthly (₹19,999/month)."
    },
    {
      category: "Features & Functionality",
      question: "What amenities are included?",
      answer: "All spaces include high-speed WiFi, free coffee/tea, ergonomic seating, meeting room access, and 24/7 security."
    },
    {
      category: "Booking & Access",
      question: "How do I book a space?",
      answer: "Browse available spaces, select your preferred cabin, choose date/time, and complete booking."
    },
    {
      category: "Payment & Billing",
      question: "What payment methods are accepted?",
      answer: "We accept credit/debit cards, UPI, net banking, Razorpay, and counter payments."
    },
    {
      category: "Support & Help",
      question: "How can I get support?",
      answer: "Our support team is available 24/7 via email at support@iryax.com."
    },
    {
      category: "Cancellation & Refund",
      question: "Can I cancel my booking?",
      answer: "Yes, cancellations are allowed. Refunds are processed based on our policy."
    }
  ];

  return (
    <>
      <style>{animationStyles}</style>

      <div className={`min-h-screen ${bg} ${text} font-light antialiased tracking-wide transition-colors duration-300`}>

        {/* ─── NAVBAR ─── */}
        <nav className={`fixed top-4 left-0 right-0 z-50 px-4 transition-all duration-300 flex items-center justify-center ${
          scrolled ? "backdrop-blur-xl" : ""
        }`}>
          <div className={`max-w-6xl w-full mx-auto flex items-center justify-between px-5 py-2.5 rounded-full ${
            scrolled ? `${bgNav} border ${border} shadow-xl` : "bg-transparent"
          } transition-all duration-300`}>
            
            <button onClick={scrollToTop} className="flex items-center gap-2 no-underline flex-shrink-0 cursor-pointer group">
              <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white/30 shadow-lg shadow-blue-500/20 flex-shrink-0 bg-white/10 group-hover:scale-110 transition-transform duration-300">
                <img src={logo} alt="IRYAX Space Logo" className="w-full h-full object-contain p-1" />
              </div>
              <span className={`text-base font-semibold ${text} tracking-tight hidden sm:block group-hover:text-blue-400 transition-colors duration-300`}>IRYAX Space</span>
            </button>

            <div className="hidden md:flex items-center gap-1">
              {["Features", "Spaces", "About", "FAQ", "Contact"].map((item, idx) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase()}`} 
                  className={`px-4 py-1.5 text-sm ${textSecondary} hover:${isDark ? 'text-white' : 'text-blue-600'} transition-all duration-300 font-light rounded-full hover:bg-white/10 hover:scale-105`}
                >
                  {item}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className={`p-1.5 rounded-full ${isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200'} transition-all duration-300 hover:scale-110`}
              >
                {isDark ? <Sun size={16} className="text-yellow-400 animate-spin-slow" /> : <Moon size={16} className="text-gray-700" />}
              </button>
              <button onClick={() => navigate("/login")} className={`hidden sm:block text-sm ${textSecondary} hover:${isDark ? 'text-white' : 'text-blue-600'} transition-all duration-300 font-light px-3 py-1.5 rounded-full hover:bg-white/10 hover:scale-105`}>Sign In</button>
              <button onClick={handleGetStarted} className="px-4 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm">Get Started</button>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-1.5 rounded-full hover:bg-white/10 transition-all duration-300 hover:scale-110">
                {mobileMenuOpen ? <X size={20} className="animate-spin" /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </nav>

        {/* ─── MOBILE MENU ─── */}
        <div className={`fixed inset-0 z-40 ${bg} pt-24 px-6 transition-all duration-500 ${
          mobileMenuOpen ? "opacity-100 pointer-events-auto translate-x-0" : "opacity-0 pointer-events-none translate-x-full"
        }`}>
          <div className="flex flex-col gap-2 max-w-sm mx-auto">
            <button onClick={() => { scrollToTop(); setMobileMenuOpen(false); }} className="flex items-center gap-3 px-4 py-2 cursor-pointer group">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20 flex-shrink-0 bg-white/10 group-hover:scale-110 transition-transform duration-300">
                <img src={logo} alt="Logo" className="w-full h-full object-contain p-1.5" />
              </div>
              <span className={`text-base font-medium ${text} group-hover:text-blue-400 transition-colors duration-300`}>IRYAX Space</span>
            </button>
            {["Features", "Spaces", "About", "FAQ", "Contact"].map((item) => (
              <a 
                key={item}
                href={`#${item.toLowerCase()}`} 
                onClick={() => setMobileMenuOpen(false)} 
                className={`px-4 py-2.5 text-sm ${textSecondary} hover:${isDark ? 'text-white hover:bg-white/5' : 'text-blue-600 hover:bg-gray-100'} rounded-lg transition-all duration-300 hover:translate-x-2`}
              >
                {item}
              </a>
            ))}
            <div className="h-px bg-white/10 my-1" />
            <button onClick={() => { navigate("/login"); setMobileMenuOpen(false); }} className={`px-4 py-2.5 text-sm text-center ${textSecondary} hover:${isDark ? 'text-white hover:bg-white/5' : 'text-blue-600 hover:bg-gray-100'} rounded-lg transition-all duration-300 hover:translate-x-2`}>Sign In</button>
            <button onClick={() => { handleGetStarted(); setMobileMenuOpen(false); }} className="px-4 py-2.5 text-sm text-center text-white bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105 active:scale-95 font-medium">Get Started</button>
          </div>
        </div>

        {/* ─── HERO ─── */}
        <section className="relative min-h-screen flex items-center justify-center px-6 pt-24 pb-16 overflow-hidden">
          {isDark && (
            <>
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl animate-pulse delay-1000" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-2000" />
            </>
          )}

          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className={`absolute rounded-full ${isDark ? 'bg-blue-400/20' : 'bg-blue-400/10'} animate-float`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDuration: `${8 + Math.random() * 15}s`,
                  animationDelay: `${Math.random() * 10}s`,
                  width: `${2 + Math.random() * 6}px`,
                  height: `${2 + Math.random() * 6}px`,
                }}
              />
            ))}
          </div>

          <div className="relative max-w-4xl mx-auto text-center z-10">
            <RevealSection delay={0}>
              <div className={`inline-flex items-center gap-2 px-4 py-2 ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-100 border-gray-200'} border rounded-full text-sm ${isDark ? 'text-blue-300' : 'text-blue-600'} mb-6 backdrop-blur-sm font-light tracking-wider hover:scale-105 transition-transform duration-300`}>
                <Zap size={14} className="animate-pulse" />
                <span>India's Growing Space Platform</span>
              </div>
            </RevealSection>

            <RevealSection delay={0.1}>
              <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light leading-tight tracking-tight ${text}`}>
                Find Your Perfect
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent font-bold animate-gradient bg-[length:200%]">
                  <TypingText words={typingWords} speed={130} pause={1800} />
                </span>
                <br />
                <span className={`text-2xl sm:text-3xl md:text-4xl ${isDark ? 'text-gray-400' : 'text-gray-500'} font-thin`}>in Minutes</span>
              </h1>
            </RevealSection>

            <RevealSection delay={0.2}>
              <p className={`mt-6 text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto font-light leading-relaxed`}>
                Book premium coworking spaces, private cabins, and meeting rooms.
                Flexible plans. Join 5,000+ professionals.
              </p>
            </RevealSection>

            <RevealSection delay={0.3}>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button onClick={handleGetStarted} className="px-8 py-3.5 text-base font-medium text-white bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 shadow-md flex items-center gap-2 tracking-wide hover:scale-105 active:scale-95 group">
                  Get Started 
                  <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-300" />
                </button>
                <button onClick={handleExplore} className={`px-8 py-3.5 text-base font-light ${isDark ? 'text-white border-white/10 hover:bg-white/5' : 'text-gray-700 border-gray-300 hover:bg-gray-50'} border rounded-xl transition-all duration-300 flex items-center gap-2 backdrop-blur-sm hover:scale-105 active:scale-95 group`}>
                  <PlayCircle size={18} className="text-blue-400 group-hover:scale-110 transition-transform duration-300" /> Explore Spaces
                </button>
              </div>
            </RevealSection>

            <RevealSection delay={0.4}>
              <div className="mt-16 flex justify-center">
                <div className="flex flex-col items-center gap-2 animate-bounce-slow">
                  <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'} font-light tracking-widest uppercase`}>Scroll</span>
                  <ChevronDown size={20} className={isDark ? 'text-gray-500' : 'text-gray-400'} />
                </div>
              </div>
            </RevealSection>
          </div>
        </section>

        {/* ─── STATS WITH COUNTER ─── */}
        <section className={`py-16 px-6 border-t ${isDark ? 'border-white/5 bg-white/5' : 'border-gray-200 bg-gray-50'} transition-colors duration-300`}>
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <RevealSection key={index} delay={index * 0.1}>
                <div className="text-center group">
                  <div className="text-3xl font-medium bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                    <Counter target={stat.value} suffix={stat.suffix} duration={2000 + index * 500} />
                  </div>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-0.5 font-light`}>{stat.label}</div>
                </div>
              </RevealSection>
            ))}
          </div>
        </section>

        {/* ─── FEATURES ─── */}
        <section id="features" className="py-20 px-6 transition-colors duration-300">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <RevealSection delay={0}>
                <span className={`inline-block px-4 py-1.5 ${isDark ? 'bg-white/5 border-white/10 text-blue-300' : 'bg-gray-100 border-gray-200 text-blue-600'} border text-xs font-light rounded-full mb-4 tracking-widest uppercase`}>Features</span>
              </RevealSection>
              <RevealSection delay={0.1}>
                <h2 className={`text-3xl sm:text-4xl font-light ${text}`}>Everything You Need to <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent font-medium">Work Better</span></h2>
              </RevealSection>
              <RevealSection delay={0.2}>
                <p className={`mt-2 text-base ${isDark ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto font-light`}>Modern spaces designed for productivity and collaboration.</p>
              </RevealSection>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((feature, index) => (
                <RevealSection key={index} delay={feature.delay}>
                  <div className={`group p-6 rounded-xl ${isDark ? 'bg-white/5 border-white/5 hover:border-blue-500/20 hover:bg-white/10' : 'bg-gray-50 border-gray-200 hover:border-blue-300 hover:bg-gray-100'} border transition-all duration-500 hover:-translate-y-2 hover:shadow-xl`}>
                    <div className={`w-12 h-12 rounded-lg ${isDark ? 'bg-white/10' : 'bg-gray-200'} flex items-center justify-center text-blue-400 mb-3 group-hover:scale-110 transition-transform duration-300 group-hover:rotate-6`}>
                      <feature.icon size={20} />
                    </div>
                    <h3 className={`text-base font-medium ${text} mb-1 group-hover:text-blue-400 transition-colors duration-300`}>{feature.title}</h3>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} leading-relaxed font-light`}>{feature.description}</p>
                  </div>
                </RevealSection>
              ))}
            </div>
          </div>
        </section>

        {/* ─── SPACES FROM API - COMPACT CARDS ─── */}
        <section id="spaces" className={`py-20 px-6 ${isDark ? 'bg-white/5' : 'bg-gray-50'} transition-colors duration-300`}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <RevealSection delay={0}>
                <span className={`inline-block px-4 py-1.5 ${isDark ? 'bg-white/5 border-white/10 text-blue-300' : 'bg-gray-100 border-gray-200 text-blue-600'} border text-xs font-light rounded-full mb-4 tracking-widest uppercase`}>Our Spaces</span>
              </RevealSection>
              <RevealSection delay={0.1}>
                <h2 className={`text-3xl sm:text-4xl font-light ${text}`}>Premium Spaces <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent font-medium">for Every Need</span></h2>
              </RevealSection>
              <RevealSection delay={0.2}>
                <p className={`mt-2 text-base ${isDark ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto font-light`}>From private cabins to collaborative spaces.</p>
              </RevealSection>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <div className="text-center py-10 text-red-500">Failed to load spaces: {error}</div>
            ) : cabins.length === 0 ? (
              <div className="text-center py-10 text-gray-400">No active spaces available right now.</div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {cabins.slice(0, 3).map((cabin, index) => {
                    const activeAmenities = cabin.amenities ? Object.keys(cabin.amenities).filter(key => cabin.amenities[key] === true) : [];
                    const price = cabin.price || 0;
                    const capacity = cabin.capacity || "N/A";
                    
                    return (
                      <RevealSection key={cabin._id} delay={index * 0.1}>
                        <div className={`group relative rounded-xl overflow-hidden ${isDark ? 'bg-[#141416]' : 'bg-white'} border ${isDark ? 'border-white/10' : 'border-gray-200'} transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/15 cursor-pointer`}>
                          
                          {/* Hover Glow */}
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                          
                          {/* Image */}
                          <div className="relative overflow-hidden h-44">
                            <img 
                              src={cabin.images && cabin.images.length > 0 ? `http://62.72.29.27:5003/${cabin.images[0]}` : "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600"} 
                              alt={cabin.name} 
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                            
                            {/* Available Badge */}
                            {cabin.isActive && (
                              <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-emerald-500/90 backdrop-blur-sm text-white text-[10px] px-2.5 py-1 rounded-full font-medium shadow-lg shadow-emerald-500/20">
                                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                                Available
                              </div>
                            )}
                            
                            {/* Price */}
                            <div className="absolute bottom-3 left-3">
                              <span className="text-white font-bold text-lg">₹{price}</span>
                              <span className="text-white/70 text-xs ml-1">/ hr</span>
                            </div>
                            
                            {/* Capacity */}
                            <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white text-[10px] px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                              <Users size={12} className="text-blue-400" />
                              {capacity}
                            </div>
                          </div>
                          
                          {/* Content */}
                          <div className="p-4 space-y-2">
                            {/* Title */}
                            <h3 className={`text-sm font-semibold ${text} group-hover:text-blue-400 transition-colors duration-300 truncate`}>
                              {cabin.name}
                            </h3>
                            
                            {/* Description - Shows on hover */}
                            <div className="overflow-hidden max-h-0 group-hover:max-h-20 transition-all duration-500 ease-in-out">
                              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} font-light line-clamp-2`}>
                                {cabin.description || "Premium workspace with modern amenities."}
                              </p>
                            </div>
                            
                            {/* Location */}
                            <div className="flex items-center gap-1 text-[10px] text-gray-400">
                              <MapPin size={12} className="text-blue-400 flex-shrink-0" />
                              <span className="truncate">{cabin.address || "Location not specified"}</span>
                            </div>
                            
                            {/* Amenities - Shows on hover */}
                            <div className="flex flex-wrap gap-1 max-h-0 group-hover:max-h-20 overflow-hidden transition-all duration-500 ease-in-out pt-0 group-hover:pt-1">
                              {activeAmenities.slice(0, 4).map((amenity) => {
                                const Icon = getAmenityIcon(amenity);
                                return Icon ? (
                                  <span 
                                    key={amenity} 
                                    className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[8px] font-medium ${isDark ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-600'} border ${isDark ? 'border-white/5' : 'border-gray-200'}`}
                                  >
                                    <Icon size={10} className="text-blue-400" />
                                    {getAmenityLabel(amenity)}
                                  </span>
                                ) : null;
                              })}
                              {activeAmenities.length > 4 && (
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[8px] font-medium ${isDark ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-600'} border ${isDark ? 'border-white/5' : 'border-gray-200'}`}>
                                  +{activeAmenities.length - 4}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {/* Hover Border */}
                          <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-blue-500/40 transition-all duration-500 pointer-events-none" />
                        </div>
                      </RevealSection>
                    );
                  })}
                </div>
                
                {/* ─── VIEW ALL BUTTON - SIMPLE TEXT ─── */}
                {cabins.length > 3 && (
                  <RevealSection delay={0.3}>
                    <div className="text-center mt-10">
                      <button 
                        onClick={handleViewAll}
                        className={`px-6 py-2.5 text-sm font-medium ${isDark ? 'text-white border-white/20 hover:bg-white/5' : 'text-gray-700 border-gray-300 hover:bg-gray-100'} border rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 mx-auto group`}
                      >
                        <Grid3x3 size={16} className="text-blue-400 group-hover:rotate-12 transition-transform duration-300" />
                        View All Spaces
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
                      </button>
                    </div>
                  </RevealSection>
                )}
              </>
            )}
          </div>
        </section>

        {/* ─── AMENITIES ─── */}
        <section className="py-16 px-6 transition-colors duration-300">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <RevealSection delay={0}>
                <span className={`inline-block px-4 py-1.5 ${isDark ? 'bg-white/5 border-white/10 text-blue-300' : 'bg-gray-100 border-gray-200 text-blue-600'} border text-xs font-light rounded-full mb-4 tracking-widest uppercase`}>Amenities</span>
              </RevealSection>
              <RevealSection delay={0.1}>
                <h2 className={`text-3xl font-light ${text}`}>What's <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent font-medium">Included</span></h2>
              </RevealSection>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {amenities.map((item, index) => (
                <RevealSection key={index} delay={index * 0.08}>
                  <div className={`group flex flex-col items-center gap-2 p-4 rounded-xl ${isDark ? 'bg-white/5 border-white/5 hover:border-blue-500/20 hover:bg-white/10' : 'bg-gray-50 border-gray-200 hover:border-blue-300 hover:bg-gray-100'} border transition-all duration-500 hover:-translate-y-2 hover:shadow-lg`}>
                    <div className={`w-10 h-10 rounded-full ${isDark ? 'bg-white/10' : 'bg-gray-200'} flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform duration-300 group-hover:rotate-12`}>
                      <item.icon size={18} />
                    </div>
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} text-center font-light group-hover:text-blue-400 transition-colors duration-300`}>{item.label}</span>
                  </div>
                </RevealSection>
              ))}
            </div>
          </div>
        </section>

        {/* ─── ABOUT ─── */}
        <section id="about" className={`py-20 px-6 ${isDark ? 'bg-white/5' : 'bg-gray-50'} transition-colors duration-300`}>
          <div className="max-w-4xl mx-auto text-center">
            <RevealSection delay={0}>
              <div className={`inline-flex items-center gap-2 px-4 py-1.5 ${isDark ? 'bg-white/5 border-white/10 text-blue-300' : 'bg-gray-100 border-gray-200 text-blue-600'} border text-xs font-light rounded-full mb-6 tracking-widest uppercase`}>
                <Users size={14} />
                <span>About Us</span>
              </div>
            </RevealSection>
            <RevealSection delay={0.1}>
              <h2 className={`text-3xl sm:text-4xl font-light ${text} mb-6`}>
                Who We <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent font-medium">Are</span>
              </h2>
            </RevealSection>
            <RevealSection delay={0.2}>
              <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'} max-w-3xl mx-auto font-light leading-relaxed`}>
                IRYAX Space is India's growing platform for finding and booking premium coworking spaces, 
                private cabins, and meeting rooms. We connect professionals with the perfect workspace 
                to boost productivity and collaboration.
              </p>
            </RevealSection>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-3xl mx-auto">
              {[
                { icon: "🚀", title: "Our Mission", desc: "Empower professionals with flexible, premium workspaces.", delay: 0 },
                { icon: "💡", title: "Our Vision", desc: "Transform how India works by making spaces accessible.", delay: 0.1 },
                { icon: "❤️", title: "Our Promise", desc: "Quality spaces, transparent pricing, dedicated support.", delay: 0.2 }
              ].map((item, index) => (
                <RevealSection key={index} delay={item.delay}>
                  <div className={`p-6 rounded-xl ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} border transition-all duration-500 hover:-translate-y-2 hover:shadow-xl`}>
                    <div className="text-2xl mb-2 animate-bounce-slow">{item.icon}</div>
                    <h4 className={`text-sm font-medium ${text} mb-1`}>{item.title}</h4>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} font-light`}>{item.desc}</p>
                  </div>
                </RevealSection>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FAQ ─── */}
        <section id="faq" className={`py-20 px-6 ${isDark ? 'bg-white/5' : 'bg-gray-50'} transition-colors duration-300`}>
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <RevealSection delay={0}>
                <div className={`inline-flex items-center gap-2 px-4 py-1.5 ${isDark ? 'bg-white/5 border-white/10 text-blue-300' : 'bg-gray-100 border-gray-200 text-blue-600'} border text-xs font-light rounded-full mb-4 tracking-widest uppercase`}>
                  <HelpCircle size={14} />
                  <span>FAQ</span>
                </div>
              </RevealSection>
              <RevealSection delay={0.1}>
                <h2 className={`text-3xl font-light ${text}`}>Frequently Asked <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent font-medium">Questions</span></h2>
              </RevealSection>
              <RevealSection delay={0.2}>
                <p className={`mt-2 text-base ${isDark ? 'text-gray-400' : 'text-gray-600'} font-light`}>Find answers to common questions.</p>
              </RevealSection>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <RevealSection key={index} delay={index * 0.06}>
                  <div className={`rounded-lg border ${isDark ? 'border-white/5 bg-white/5' : 'border-gray-200 bg-white'} overflow-hidden transition-all duration-500 hover:shadow-lg`}>
                    <button 
                      onClick={() => toggleFaq(index)} 
                      className={`w-full px-6 py-4 flex items-center justify-between text-left hover:${isDark ? 'bg-white/5' : 'bg-gray-50'} transition-all duration-300`}
                    >
                      <div>
                        <span className={`text-[10px] ${isDark ? 'text-blue-400' : 'text-blue-600'} font-light uppercase tracking-wider`}>{faq.category}</span>
                        <p className={`text-base font-light ${text} mt-0.5`}>{faq.question}</p>
                      </div>
                      <ChevronDown 
                        size={18} 
                        className={`${isDark ? 'text-gray-400' : 'text-gray-500'} transition-all duration-300 ${openFaq === index ? 'rotate-180' : ''}`} 
                      />
                    </button>
                    <div 
                      className={`overflow-hidden transition-all duration-500 ${openFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                    >
                      <div className={`px-6 pb-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} leading-relaxed border-t ${isDark ? 'border-white/5' : 'border-gray-200'} pt-3 font-light`}>
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                </RevealSection>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CONTACT ─── */}
        <section id="contact" className="py-20 px-6 relative overflow-hidden transition-colors duration-300">
          <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-r from-blue-600/5 to-cyan-600/5' : 'bg-gradient-to-r from-blue-100/30 to-cyan-100/30'}`} />
          <div className="relative max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <RevealSection delay={0}>
                <span className={`inline-block px-4 py-1.5 ${isDark ? 'bg-white/5 border-white/10 text-blue-300' : 'bg-gray-100 border-gray-200 text-blue-600'} border text-xs font-light rounded-full mb-4 tracking-widest uppercase`}>Get in Touch</span>
              </RevealSection>
              <RevealSection delay={0.1}>
                <h2 className={`text-3xl font-light ${text}`}>Let's <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent font-medium">Connect</span></h2>
              </RevealSection>
              <RevealSection delay={0.2}>
                <p className={`mt-2 text-base ${isDark ? 'text-gray-400' : 'text-gray-600'} font-light`}>Have questions? We'd love to hear from you.</p>
              </RevealSection>
            </div>

            <div className="grid md:grid-cols-5 gap-8">
              <div className="md:col-span-2 space-y-5">
                {[
                  { icon: Mail, label: "Email", value: "support@iryax.com", delay: 0 },
                  { icon: Phone, label: "Phone", value: "+91 9876543210", delay: 0.1 },
                  { icon: MapPin, label: "Address", value: "Hyderabad, India", delay: 0.2 }
                ].map((item, index) => (
                  <RevealSection key={index} delay={item.delay}>
                    <div className={`flex items-start gap-4 group`}>
                      <div className={`w-10 h-10 rounded-lg ${isDark ? 'bg-white/5 group-hover:bg-white/10' : 'bg-gray-100 group-hover:bg-gray-200'} flex items-center justify-center text-blue-400 flex-shrink-0 mt-0.5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                        <item.icon size={18} />
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${text}`}>{item.label}</p>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} font-light group-hover:text-blue-400 transition-colors duration-300`}>{item.value}</p>
                      </div>
                    </div>
                  </RevealSection>
                ))}
              </div>

              <div className="md:col-span-3">
                <RevealSection delay={0.3}>
                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <input type="text" placeholder="Your Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={`w-full px-4 py-3 rounded-lg ${isDark ? 'bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-blue-500/50' : 'bg-gray-100 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-300'} border text-sm focus:outline-none transition-all duration-300 font-light focus:scale-[1.01]`} required />
                    <input type="email" placeholder="Your Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={`w-full px-4 py-3 rounded-lg ${isDark ? 'bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-blue-500/50' : 'bg-gray-100 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-300'} border text-sm focus:outline-none transition-all duration-300 font-light focus:scale-[1.01]`} required />
                    <textarea placeholder="Your Message" rows="4" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className={`w-full px-4 py-3 rounded-lg ${isDark ? 'bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-blue-500/50' : 'bg-gray-100 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-300'} border text-sm focus:outline-none transition-all duration-300 font-light resize-none focus:scale-[1.01]`} required />
                    <button type="submit" className="w-full px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105 active:scale-95 group">
                      {formSubmitted ? (
                        <>✓ Sent!</>
                      ) : (
                        <>Send Message <Send size={16} className="group-hover:translate-x-1 transition-transform duration-300" /></>
                      )}
                    </button>
                  </form>
                </RevealSection>
              </div>
            </div>
          </div>
        </section>

        {/* ─── FOOTER ─── */}
        <footer className={`py-12 px-6 border-t ${isDark ? 'border-white/5 bg-black/50' : 'border-gray-200 bg-gray-50'} transition-colors duration-300`}>
          <div className="max-w-6xl mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <RevealSection delay={0}>
                <div>
                  <button onClick={scrollToTop} className="flex items-center gap-3 no-underline mb-4 cursor-pointer group">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20 shadow-lg shadow-blue-500/20 flex-shrink-0 bg-white/10 group-hover:scale-110 transition-transform duration-300">
                      <img src={logo} alt="IRYAX Space Logo" className="w-full h-full object-contain p-1.5" />
                    </div>
                    <span className={`text-base font-semibold ${text} tracking-tight group-hover:text-blue-400 transition-colors duration-300`}>IRYAX Space</span>
                  </button>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} font-light`}>Find and book premium spaces across India.</p>
                </div>
              </RevealSection>

              <RevealSection delay={0.1}>
                <div>
                  <h4 className={`text-sm font-medium ${text} mb-4`}>Product</h4>
                  <div className="space-y-2">
                    {["Features", "Spaces", "FAQ"].map((item) => (
                      <a key={item} href={`#${item.toLowerCase()}`} className={`block text-sm ${isDark ? 'text-gray-400 hover:text-blue-400' : 'text-gray-500 hover:text-blue-600'} transition-all duration-300 font-light hover:translate-x-1`}>{item}</a>
                    ))}
                  </div>
                </div>
              </RevealSection>

              <RevealSection delay={0.2}>
                <div>
                  <h4 className={`text-sm font-medium ${text} mb-4`}>Company</h4>
                  <div className="space-y-2">
                    <a href="#about" className={`block text-sm ${isDark ? 'text-gray-400 hover:text-blue-400' : 'text-gray-500 hover:text-blue-600'} transition-all duration-300 font-light hover:translate-x-1`}>About Us</a>
                    <a href="#contact" className={`block text-sm ${isDark ? 'text-gray-400 hover:text-blue-400' : 'text-gray-500 hover:text-blue-600'} transition-all duration-300 font-light hover:translate-x-1`}>Contact</a>
                  </div>
                </div>
              </RevealSection>

              <RevealSection delay={0.3}>
                <div>
                  <h4 className={`text-sm font-medium ${text} mb-4`}>Legal</h4>
                  <div className="space-y-2">
                    {[
                      { label: "Privacy Policy", href: "https://iryax.com/privacy-policy" },
                      { label: "Terms & Conditions", href: "https://iryax.com/terms-and-conditions" },
                      { label: "Refund Policy", href: "https://iryax.com/refund-policy" },
                      { label: "Cookie Policy", href: "https://iryax.com/cookie-policy" }
                    ].map((item) => (
                      <a 
                        key={item.label}
                        href={item.href} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`block text-sm ${isDark ? 'text-gray-400 hover:text-blue-400' : 'text-gray-500 hover:text-blue-600'} transition-all duration-300 font-light hover:translate-x-1`}
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                </div>
              </RevealSection>
            </div>

            <RevealSection delay={0.4}>
              <div className={`mt-10 pt-6 border-t ${isDark ? 'border-white/5' : 'border-gray-200'} text-center text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'} font-light tracking-wider`}>
                &copy; 2026 IRYAX Space. All rights reserved.
              </div>
            </RevealSection>
          </div>
        </footer>
      </div>
    </>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <PromotionalPage />
    </ThemeProvider>
  );
}