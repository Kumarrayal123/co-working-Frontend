// PromotionalPage.jsx - Capsule Navbar (takeUforward style)
import React, { useEffect, useState, createContext, useContext } from "react";
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
  Moon
} from "lucide-react";
import logo from "../assets/logo.png";

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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleGetStarted = () => navigate("/login");
  const handleExplore = () => navigate("/spaces");

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

  // Theme colors
  const bg = isDark ? "bg-[#0a0a0f]" : "bg-white";
  const bgNav = isDark ? "bg-[#0a0a0f]/80" : "bg-white/80";
  const border = isDark ? "border-white/10" : "border-gray-200";
  const text = isDark ? "text-white" : "text-gray-900";
  const textSecondary = isDark ? "text-gray-400" : "text-gray-600";

  const features = [
    { icon: Building2, title: "Premium Spaces", description: "Fully furnished cabins with high-speed internet and modern amenities." },
    { icon: Clock, title: "Flexible Booking", description: "Book by hour, day, or month. Cancel anytime." },
    { icon: Wallet, title: "Smart Payments", description: "Secure payments with wallet system. Transparent pricing." },
    { icon: Shield, title: "Safe & Secure", description: "24/7 security and insured spaces." },
    { icon: Users, title: "Community Events", description: "Networking events and workshops to grow your business." },
    { icon: Headphones, title: "Dedicated Support", description: "24/7 customer support for all your needs." }
  ];

  const stats = [
    { label: "Happy Users", value: "5,000+" },
    { label: "Spaces", value: "150+" },
    { label: "Bookings", value: "12,000+" },
    { label: "Cities", value: "15+" }
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
    <div className={`min-h-screen ${bg} ${text} font-light antialiased tracking-wide transition-colors duration-300`}>

      {/* ─── NAVBAR - Capsule Style ─── */}
      <nav className={`fixed top-4 left-0 right-0 z-50 px-4 transition-all duration-300 flex items-center justify-center ${
        scrolled ? "backdrop-blur-xl" : ""
      }`}>
        <div className={`max-w-6xl w-full mx-auto flex items-center justify-between px-5 py-2.5 rounded-full ${
          scrolled ? `${bgNav} border ${border} shadow-xl` : "bg-transparent"
        } transition-all duration-300`}>
          
          <Link to="/" className="flex items-center gap-2 no-underline flex-shrink-0">
            <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white/30 shadow-lg shadow-blue-500/20 flex-shrink-0 bg-white/10">
              <img 
                src={logo} 
                alt="IRYAX Space Logo" 
                className="w-full h-full object-contain p-1"
              />
            </div>
            <span className={`text-base font-semibold ${text} tracking-tight hidden sm:block`}>IRYAX Space</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <a href="#features" className={`px-4 py-1.5 text-sm ${textSecondary} hover:${isDark ? 'text-white' : 'text-blue-600'} transition font-light rounded-full hover:bg-white/10`}>Features</a>
            <a href="#spaces" className={`px-4 py-1.5 text-sm ${textSecondary} hover:${isDark ? 'text-white' : 'text-blue-600'} transition font-light rounded-full hover:bg-white/10`}>Spaces</a>
            <a href="#faq" className={`px-4 py-1.5 text-sm ${textSecondary} hover:${isDark ? 'text-white' : 'text-blue-600'} transition font-light rounded-full hover:bg-white/10`}>FAQ</a>
            <a href="#contact" className={`px-4 py-1.5 text-sm ${textSecondary} hover:${isDark ? 'text-white' : 'text-blue-600'} transition font-light rounded-full hover:bg-white/10`}>Contact</a>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className={`p-1.5 rounded-full ${isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200'} transition`}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={16} className="text-yellow-400" /> : <Moon size={16} className="text-gray-700" />}
            </button>

            <button onClick={() => navigate("/login")} className={`hidden sm:block text-sm ${textSecondary} hover:${isDark ? 'text-white' : 'text-blue-600'} transition font-light px-3 py-1.5 rounded-full hover:bg-white/10`}>
              Sign In
            </button>
            <button onClick={handleGetStarted} className="px-4 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full hover:shadow-lg hover:shadow-blue-500/25 transition shadow-sm">
              Get Started
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-1.5 rounded-full hover:bg-white/10 transition">
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* ─── MOBILE MENU ─── */}
      <div className={`fixed inset-0 z-40 ${bg} pt-24 px-6 transition-all duration-300 ${
        mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}>
        <div className="flex flex-col gap-2 max-w-sm mx-auto">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20 flex-shrink-0 bg-white/10">
              <img src={logo} alt="Logo" className="w-full h-full object-contain p-1.5" />
            </div>
            <span className={`text-base font-medium ${text}`}>IRYAX Space</span>
          </div>
          <a href="#features" onClick={() => setMobileMenuOpen(false)} className={`px-4 py-2.5 text-sm ${textSecondary} hover:${isDark ? 'text-white hover:bg-white/5' : 'text-blue-600 hover:bg-gray-100'} rounded-lg transition font-light`}>Features</a>
          <a href="#spaces" onClick={() => setMobileMenuOpen(false)} className={`px-4 py-2.5 text-sm ${textSecondary} hover:${isDark ? 'text-white hover:bg-white/5' : 'text-blue-600 hover:bg-gray-100'} rounded-lg transition font-light`}>Spaces</a>
          <a href="#faq" onClick={() => setMobileMenuOpen(false)} className={`px-4 py-2.5 text-sm ${textSecondary} hover:${isDark ? 'text-white hover:bg-white/5' : 'text-blue-600 hover:bg-gray-100'} rounded-lg transition font-light`}>FAQ</a>
          <a href="#contact" onClick={() => setMobileMenuOpen(false)} className={`px-4 py-2.5 text-sm ${textSecondary} hover:${isDark ? 'text-white hover:bg-white/5' : 'text-blue-600 hover:bg-gray-100'} rounded-lg transition font-light`}>Contact</a>
          <div className="h-px bg-white/10 my-1" />
          <button onClick={() => { navigate("/login"); setMobileMenuOpen(false); }} className={`px-4 py-2.5 text-sm text-center ${textSecondary} hover:${isDark ? 'text-white hover:bg-white/5' : 'text-blue-600 hover:bg-gray-100'} rounded-lg transition font-light`}>
            Sign In
          </button>
          <button onClick={() => { handleGetStarted(); setMobileMenuOpen(false); }} className="px-4 py-2.5 text-sm text-center text-white bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg hover:shadow-lg hover:shadow-blue-500/20 transition font-medium">
            Get Started
          </button>
        </div>
      </div>

      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-24 pb-16 overflow-hidden">
        {isDark && (
          <>
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl animate-pulse delay-1000" />
          </>
        )}

        <div className="relative max-w-4xl mx-auto text-center z-10">
          <div className={`inline-flex items-center gap-2 px-4 py-2 ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-100 border-gray-200'} border rounded-full text-sm ${isDark ? 'text-blue-300' : 'text-blue-600'} mb-6 backdrop-blur-sm font-light tracking-wider`}>
            <Zap size={14} />
            <span>India's Growing Space Platform</span>
          </div>

          <h1 className={`text-5xl sm:text-6xl md:text-7xl font-light leading-tight tracking-tight ${text}`}>
            Find Your Perfect
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent font-normal"> Space</span>
            <br />
            <span className={`text-3xl sm:text-4xl md:text-5xl ${isDark ? 'text-gray-400' : 'text-gray-500'} font-thin`}>in Minutes</span>
          </h1>

          <p className={`mt-6 text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto font-light leading-relaxed`}>
            Book premium coworking spaces, private cabins, and meeting rooms.
            Flexible plans. Join 5,000+ professionals.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={handleGetStarted} className="px-8 py-3.5 text-base font-medium text-white bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl hover:shadow-2xl hover:shadow-blue-500/25 transition shadow-md flex items-center gap-2 tracking-wide">
              Get Started <ArrowRight size={18} />
            </button>
            <button onClick={handleExplore} className={`px-8 py-3.5 text-base font-light ${isDark ? 'text-white border-white/10 hover:bg-white/5' : 'text-gray-700 border-gray-300 hover:bg-gray-50'} border rounded-xl transition flex items-center gap-2 backdrop-blur-sm`}>
              <PlayCircle size={18} /> Explore Spaces
            </button>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((_, i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-gray-700 bg-cover bg-center" style={{ backgroundImage: `url(https://images.unsplash.com/photo-${i === 0 ? '1494790108377-be9c29b29330' : i === 1 ? '1507003211169-0a1dd7228f2d' : i === 2 ? '1438761681033-6461ffad8d80' : '1472099645785-5658abf4ff4e'}?w=150)` }} />
              ))}
              <div className={`w-10 h-10 rounded-full border-2 border-black ${isDark ? 'bg-white/10 text-gray-300' : 'bg-gray-200 text-gray-600'} flex items-center justify-center text-xs font-medium backdrop-blur-sm`}>+2K</div>
            </div>
            <div className="text-left">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => <Star key={i} size={15} fill="#f59e0b" stroke="#f59e0b" />)}
              </div>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} font-light`}>Trusted by 5,000+ professionals</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className={`py-16 px-6 border-t ${isDark ? 'border-white/5 bg-white/5' : 'border-gray-200 bg-gray-50'} transition-colors duration-300`}>
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-medium bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">{stat.value}</div>
              <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-0.5 font-light`}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="features" className="py-20 px-6 transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className={`inline-block px-4 py-1.5 ${isDark ? 'bg-white/5 border-white/10 text-blue-300' : 'bg-gray-100 border-gray-200 text-blue-600'} border text-xs font-light rounded-full mb-4 tracking-widest uppercase`}>Features</span>
            <h2 className={`text-3xl sm:text-4xl font-light ${text}`}>Everything You Need to <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent font-medium">Work Better</span></h2>
            <p className={`mt-2 text-base ${isDark ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto font-light`}>Modern spaces designed for productivity and collaboration.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, index) => (
              <div key={index} className={`group p-6 rounded-xl ${isDark ? 'bg-white/5 border-white/5 hover:border-blue-500/20 hover:bg-white/10' : 'bg-gray-50 border-gray-200 hover:border-blue-300 hover:bg-gray-100'} border transition`}>
                <div className={`w-12 h-12 rounded-lg ${isDark ? 'bg-white/10' : 'bg-gray-200'} flex items-center justify-center text-blue-400 mb-3 group-hover:scale-105 transition`}>
                  <feature.icon size={20} />
                </div>
                <h3 className={`text-base font-medium ${text} mb-1`}>{feature.title}</h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} leading-relaxed font-light`}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SPACES ─── */}
      <section id="spaces" className={`py-20 px-6 ${isDark ? 'bg-white/5' : 'bg-gray-50'} transition-colors duration-300`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className={`inline-block px-4 py-1.5 ${isDark ? 'bg-white/5 border-white/10 text-blue-300' : 'bg-gray-100 border-gray-200 text-blue-600'} border text-xs font-light rounded-full mb-4 tracking-widest uppercase`}>Our Spaces</span>
            <h2 className={`text-3xl sm:text-4xl font-light ${text}`}>Premium Spaces <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent font-medium">for Every Need</span></h2>
            <p className={`mt-2 text-base ${isDark ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto font-light`}>From private cabins to collaborative spaces.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className={`group rounded-xl overflow-hidden ${isDark ? 'bg-white/5 border-white/10 hover:border-blue-500/20' : 'bg-white border-gray-200 hover:border-blue-300'} border transition hover:-translate-y-1`}>
              <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=600" alt="Office" className="w-full h-48 object-cover group-hover:scale-105 transition duration-500" />
              <div className="p-6">
                <h3 className={`text-lg font-medium ${text} mb-1`}>Private Cabins</h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-3 font-light`}>Fully furnished private offices with premium amenities.</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-400 font-medium">₹999/day</span>
                  <button onClick={handleExplore} className="text-sm text-blue-400 hover:text-blue-300 transition font-light">View →</button>
                </div>
              </div>
            </div>

            <div className={`group rounded-xl overflow-hidden ${isDark ? 'bg-white/5 border-white/10 hover:border-blue-500/20' : 'bg-white border-gray-200 hover:border-blue-300'} border transition hover:-translate-y-1`}>
              <img src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600" alt="Coworking" className="w-full h-48 object-cover group-hover:scale-105 transition duration-500" />
              <div className="p-6">
                <h3 className={`text-lg font-medium ${text} mb-1`}>Hot Desks</h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-3 font-light`}>Flexible daily space with all amenities.</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-400 font-medium">₹199/hour</span>
                  <button onClick={handleExplore} className="text-sm text-blue-400 hover:text-blue-300 transition font-light">View →</button>
                </div>
              </div>
            </div>

            <div className={`group rounded-xl overflow-hidden ${isDark ? 'bg-white/5 border-white/10 hover:border-blue-500/20' : 'bg-white border-gray-200 hover:border-blue-300'} border transition hover:-translate-y-1`}>
              <img src="https://images.unsplash.com/photo-1577412647305-99122a04c805?w=600" alt="Meeting" className="w-full h-48 object-cover group-hover:scale-105 transition duration-500" />
              <div className="p-6">
                <h3 className={`text-lg font-medium ${text} mb-1`}>Meeting Rooms</h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-3 font-light`}>Professional meeting rooms with video conferencing.</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-400 font-medium">₹499/hour</span>
                  <button onClick={handleExplore} className="text-sm text-blue-400 hover:text-blue-300 transition font-light">View →</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── AMENITIES ─── */}
      <section className="py-16 px-6 transition-colors duration-300">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className={`inline-block px-4 py-1.5 ${isDark ? 'bg-white/5 border-white/10 text-blue-300' : 'bg-gray-100 border-gray-200 text-blue-600'} border text-xs font-light rounded-full mb-4 tracking-widest uppercase`}>Amenities</span>
            <h2 className={`text-3xl font-light ${text}`}>What's <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent font-medium">Included</span></h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {amenities.map((item, index) => (
              <div key={index} className={`group flex flex-col items-center gap-2 p-4 rounded-xl ${isDark ? 'bg-white/5 border-white/5 hover:border-blue-500/20 hover:bg-white/10' : 'bg-gray-50 border-gray-200 hover:border-blue-300 hover:bg-gray-100'} border transition`}>
                <div className={`w-10 h-10 rounded-full ${isDark ? 'bg-white/10' : 'bg-gray-200'} flex items-center justify-center text-blue-400 group-hover:scale-105 transition`}>
                  <item.icon size={18} />
                </div>
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} text-center font-light`}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ SECTION ─── */}
      <section id="faq" className={`py-20 px-6 ${isDark ? 'bg-white/5' : 'bg-gray-50'} transition-colors duration-300`}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 ${isDark ? 'bg-white/5 border-white/10 text-blue-300' : 'bg-gray-100 border-gray-200 text-blue-600'} border text-xs font-light rounded-full mb-4 tracking-widest uppercase`}>
              <HelpCircle size={14} />
              <span>FAQ</span>
            </div>
            <h2 className={`text-3xl font-light ${text}`}>Frequently Asked <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent font-medium">Questions</span></h2>
            <p className={`mt-2 text-base ${isDark ? 'text-gray-400' : 'text-gray-600'} font-light`}>Find answers to common questions.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className={`rounded-lg border ${isDark ? 'border-white/5 bg-white/5' : 'border-gray-200 bg-white'} overflow-hidden`}>
                <button
                  onClick={() => toggleFaq(index)}
                  className={`w-full px-6 py-4 flex items-center justify-between text-left hover:${isDark ? 'bg-white/5' : 'bg-gray-50'} transition`}
                >
                  <div>
                    <span className={`text-[10px] ${isDark ? 'text-blue-400' : 'text-blue-600'} font-light uppercase tracking-wider`}>{faq.category}</span>
                    <p className={`text-base font-light ${text} mt-0.5`}>{faq.question}</p>
                  </div>
                  {openFaq === index ? (
                    <ChevronUp size={18} className={isDark ? 'text-gray-400' : 'text-gray-500'} flex-shrink-0 />
                  ) : (
                    <ChevronDown size={18} className={isDark ? 'text-gray-400' : 'text-gray-500'} flex-shrink-0 />
                  )}
                </button>
                {openFaq === index && (
                  <div className={`px-6 pb-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} leading-relaxed border-t ${isDark ? 'border-white/5' : 'border-gray-200'} pt-3 font-light`}>
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CONTACT FORM ─── */}
      <section id="contact" className="py-20 px-6 relative overflow-hidden transition-colors duration-300">
        <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-r from-blue-600/5 to-cyan-600/5' : 'bg-gradient-to-r from-blue-100/30 to-cyan-100/30'}`} />
        <div className="relative max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className={`inline-block px-4 py-1.5 ${isDark ? 'bg-white/5 border-white/10 text-blue-300' : 'bg-gray-100 border-gray-200 text-blue-600'} border text-xs font-light rounded-full mb-4 tracking-widest uppercase`}>Contact Us</span>
            <h2 className={`text-3xl font-light ${text}`}>Get in <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent font-medium">Touch</span></h2>
            <p className={`mt-2 text-base ${isDark ? 'text-gray-400' : 'text-gray-600'} font-light`}>Have questions? We'd love to hear from you.</p>
          </div>

          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-2 space-y-5">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-lg ${isDark ? 'bg-white/5' : 'bg-gray-100'} flex items-center justify-center text-blue-400 flex-shrink-0 mt-0.5`}>
                  <Mail size={18} />
                </div>
                <div>
                  <p className={`text-sm font-medium ${text}`}>Email</p>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} font-light`}>support@iryax.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-lg ${isDark ? 'bg-white/5' : 'bg-gray-100'} flex items-center justify-center text-blue-400 flex-shrink-0 mt-0.5`}>
                  <Phone size={18} />
                </div>
                <div>
                  <p className={`text-sm font-medium ${text}`}>Phone</p>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} font-light`}>+91 9876543210</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-lg ${isDark ? 'bg-white/5' : 'bg-gray-100'} flex items-center justify-center text-blue-400 flex-shrink-0 mt-0.5`}>
                  <MapPin size={18} />
                </div>
                <div>
                  <p className={`text-sm font-medium ${text}`}>Address</p>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} font-light`}>Hyderabad, India</p>
                </div>
              </div>
            </div>

            <div className="md:col-span-3">
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg ${isDark ? 'bg-white/5 border-white/10 text-white placeholder-gray-500' : 'bg-gray-100 border-gray-200 text-gray-900 placeholder-gray-400'} border text-sm focus:border-blue-500/50 focus:outline-none transition font-light`}
                  required
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg ${isDark ? 'bg-white/5 border-white/10 text-white placeholder-gray-500' : 'bg-gray-100 border-gray-200 text-gray-900 placeholder-gray-400'} border text-sm focus:border-blue-500/50 focus:outline-none transition font-light`}
                  required
                />
                <textarea
                  placeholder="Your Message"
                  rows="4"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg ${isDark ? 'bg-white/5 border-white/10 text-white placeholder-gray-500' : 'bg-gray-100 border-gray-200 text-gray-900 placeholder-gray-400'} border text-sm focus:border-blue-500/50 focus:outline-none transition font-light resize-none`}
                  required
                />
                <button
                  type="submit"
                  className="w-full px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg hover:shadow-2xl hover:shadow-blue-500/25 transition flex items-center justify-center gap-2"
                >
                  {formSubmitted ? (
                    <>✓ Sent!</>
                  ) : (
                    <>
                      Send Message <Send size={16} />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className={`py-12 px-6 border-t ${isDark ? 'border-white/5 bg-black/50' : 'border-gray-200 bg-gray-50'} transition-colors duration-300`}>
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <Link to="/" className="flex items-center gap-3 no-underline mb-4">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20 shadow-lg shadow-blue-500/20 flex-shrink-0 bg-white/10">
                  <img src={logo} alt="IRYAX Space Logo" className="w-full h-full object-contain p-1.5" />
                </div>
                <span className={`text-base font-semibold ${text} tracking-tight`}>IRYAX Space</span>
              </Link>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} font-light`}>Find and book premium spaces across India.</p>
            </div>

            <div>
              <h4 className={`text-sm font-medium ${text} mb-4`}>Product</h4>
              <div className="space-y-2">
                {["Features", "Spaces", "FAQ"].map((item) => (
                  <a key={item} href={`#${item.toLowerCase()}`} className={`block text-sm ${isDark ? 'text-gray-400 hover:text-blue-400' : 'text-gray-500 hover:text-blue-600'} transition font-light`}>{item}</a>
                ))}
              </div>
            </div>

            <div>
              <h4 className={`text-sm font-medium ${text} mb-4`}>Company</h4>
              <div className="space-y-2">
                {["About Us", "Careers", "Blog", "Contact"].map((item) => (
                  <a key={item} href="#" className={`block text-sm ${isDark ? 'text-gray-400 hover:text-blue-400' : 'text-gray-500 hover:text-blue-600'} transition font-light`}>{item}</a>
                ))}
              </div>
            </div>

            <div>
              <h4 className={`text-sm font-medium ${text} mb-4`}>Support</h4>
              <div className="space-y-2">
                {["Help Center", "Privacy Policy", "Terms of Service", "support@iryax.com"].map((item) => (
                  <a key={item} href={item.includes("@") ? "mailto:support@iryax.com" : "#"} className={`block text-sm ${isDark ? 'text-gray-400 hover:text-blue-400' : 'text-gray-500 hover:text-blue-600'} transition font-light`}>{item}</a>
                ))}
              </div>
            </div>
          </div>

          <div className={`mt-10 pt-6 border-t ${isDark ? 'border-white/5' : 'border-gray-200'} text-center text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'} font-light tracking-wider`}>
            &copy; 2026 IRYAX Space. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

// ─── WRAP WITH THEME PROVIDER ───
export default function App() {
  return (
    <ThemeProvider>
      <PromotionalPage />
    </ThemeProvider>
  );
}