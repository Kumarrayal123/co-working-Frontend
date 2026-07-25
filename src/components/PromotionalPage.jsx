// // PromotionalPage.jsx - Complete with IRYAX SPACE Custom Images + Send Query API Integration
// // UPDATED: Added clear category division banner between Co-working and Medical Chambers
// // with eye-catching animated division and visual separation
// // UPGRADED: Premium co-working & medical chamber cards (rating, amenity chips, gradient hover border, availability pulse)

// import React, { useEffect, useState, createContext, useContext, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Building2,
//   Users,
//   Calendar,
//   Clock,
//   CheckCircle,
//   ArrowRight,
//   Star,
//   Shield,
//   Headphones,
//   MapPin,
//   Wifi,
//   Coffee,
//   Menu,
//   X,
//   PlayCircle,
//   Wallet,
//   Sparkles,
//   Zap,
//   ChevronDown,
//   HelpCircle,
//   Mail,
//   Phone,
//   Send,
//   Sun,
//   Moon,
//   ParkingCircle,
//   Lock,
//   Sofa,
//   Bath,
//   Tv,
//   Printer,
//   PhoneCall,
//   Fan,
//   Eye,
//   Grid3x3,
//   Heart,
//   Activity,
//   Brain,
//   Bone,
//   EyeOff,
//   UsersRound,
//   Briefcase,
//   HeartPulse,
//   ClipboardCheck,
//   Microscope,
//   TestTube,
//   ShieldCheck,
//   Sparkles as SparklesIcon,
//   Star as StarIcon,
//   Dumbbell,
//   TrendingUp,
//   Award,
//   Target,
//   Rocket,
//   Car,
//   Wifi as WifiIcon,
//   Users as UsersIcon,
//   DollarSign,
//   Target as TargetIcon,
//   Eye as EyeIcon,
//   Flag,
//   Layout,
//   PenTool,
//   Palette,
//   Camera,
//   ShoppingBag,
//   Gift,
//   Globe,
//   Smartphone,
//   Monitor,
//   Code,
//   Layers,
//   Zap as ZapIcon,
//   Lightbulb,
//   Cloud,
//   Database,
//   Server,
//   Cpu,
//   HardDrive,
//   Film,
//   Music,
//   Video,
//   BookOpen,
//   GraduationCap,
//   Briefcase as BriefcaseIcon,
//   Home,
//   Heart as HeartIcon,
//   Mail as MailIcon,
//   Phone as PhoneIcon,
//   MessageCircle,
//   ThumbsUp,
//   Share2,
//   Instagram,
//   Twitter,
//   Linkedin,
//   Youtube,
//   Facebook,
//   Stethoscope,
//   Clipboard,
//   Syringe,
//   Pill,
//   Ambulance,
//   Microscope as MicroscopeIcon,
//   Bone as BoneIcon,
//   Brain as BrainIcon,
//   HeartPulse as HeartPulseIcon,
//   Bed,
//   Pill as PillIcon,
//   Ambulance as AmbulanceIcon,
//   ChevronLeft,
//   ChevronRight,
//   Maximize2,
//   Minimize2,
//   Stethoscope as StethoscopeIcon,
//   UserCheck,
//   Clock as ClockIcon,
//   Award as AwardIcon,
//   BriefcaseMedical,
//   Hospital,
//   Users as UsersIcon2,
//   BadgeCheck,
//   Flame,
//   Gauge
// } from "lucide-react";
// import logo from "../assets/logo.png";
// import iryaxHero from "../assets/iryaxspace.png";

// // ─── IRYAX SPACE CUSTOM IMAGES ───
// const IRYAX_HERO_IMAGE = iryaxHero;

// const IRYAX_SPACE_IMAGES = [
//   "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=800&h=600",
//   "https://images.unsplash.com/photo-1497366412874-3415097a27e7?auto=format&fit=crop&q=80&w=800&h=600",
//   "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=800&h=600",
//   "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800&h=600",
//   "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800&h=600",
//   "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&q=80&w=800&h=600"
// ];

// const DOCTOR_HERO_IMAGE = "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?auto=format&fit=crop&q=80&w=1920&h=800";

// const DOCTOR_SPACE_IMAGES = [
//   "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?auto=format&fit=crop&q=80&w=800&h=600",
//   "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=800&h=600",
//   "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800&h=600",
//   "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800&h=600"
// ];

// const IRYAX_LOCATION_IMAGES = [
//   "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800&h=600",
//   "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=800&h=600",
//   "https://images.unsplash.com/photo-1497366412874-3415097a27e7?auto=format&fit=crop&q=80&w=800&h=600"
// ];

// // ─── STYLES ───
// const styles = `
//   @keyframes float {
//     0%, 100% { transform: translateY(0px); }
//     50% { transform: translateY(-20px); }
//   }
//   @keyframes gradient {
//     0% { background-position: 0% 50%; }
//     50% { background-position: 100% 50%; }
//     100% { background-position: 0% 50%; }
//   }
//   @keyframes bounce-slow {
//     0%, 100% { transform: translateY(0); }
//     50% { transform: translateY(-10px); }
//   }
//   @keyframes spin-slow {
//     from { transform: rotate(0deg); }
//     to { transform: rotate(360deg); }
//   }
//   @keyframes heartbeat {
//     0%, 100% { transform: scale(1); }
//     14% { transform: scale(1.05); }
//     28% { transform: scale(1); }
//     42% { transform: scale(1.05); }
//     70% { transform: scale(1); }
//   }
//   @keyframes shimmer {
//     0% { background-position: -200% center; }
//     100% { background-position: 200% center; }
//   }
//   @keyframes scale-in {
//     from { opacity: 0; transform: scale(0.8); }
//     to { opacity: 1; transform: scale(1); }
//   }
//   @keyframes slide-up {
//     from { opacity: 0; transform: translateY(60px); }
//     to { opacity: 1; transform: translateY(0); }
//   }
//   @keyframes glass-shine {
//     0% { background-position: -200% center; }
//     100% { background-position: 200% center; }
//   }
//   @keyframes float-glass {
//     0%, 100% { transform: translateY(0px) rotate(0deg); }
//     50% { transform: translateY(-10px) rotate(2deg); }
//   }
//   @keyframes modal-in {
//     from { opacity: 0; transform: scale(0.9) translateY(30px); }
//     to { opacity: 1; transform: scale(1) translateY(0); }
//   }
//   @keyframes pulse-ring {
//     0% { transform: scale(0.8); opacity: 0.8; }
//     100% { transform: scale(1.3); opacity: 0; }
//   }
//   @keyframes shine {
//     0% { background-position: -200% center; }
//     100% { background-position: 200% center; }
//   }
//   @keyframes slide-up-fade {
//     0% { opacity: 0; transform: translateY(40px); }
//     100% { opacity: 1; transform: translateY(0); }
//   }
//   @keyframes pulse-glow {
//     0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
//     50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.6); }
//   }
//   @keyframes category-slide {
//     0% { opacity: 0; transform: translateX(-30px); }
//     100% { opacity: 1; transform: translateX(0); }
//   }
//   @keyframes category-slide-right {
//     0% { opacity: 0; transform: translateX(30px); }
//     100% { opacity: 1; transform: translateX(0); }
//   }
//   @keyframes medical-pulse {
//     0%, 100% { transform: scale(1); }
//     50% { transform: scale(1.02); background-color: rgba(220, 38, 38, 0.15); }
//   }
//   @keyframes coworking-pulse {
//     0%, 100% { transform: scale(1); }
//     50% { transform: scale(1.02); background-color: rgba(37, 99, 235, 0.15); }
//   }
//   @keyframes dot-pulse {
//     0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.55); }
//     70% { box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
//     100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
//   }
//   @keyframes border-spin {
//     0% { --border-angle: 0deg; }
//     100% { --border-angle: 360deg; }
//   }
//   @property --border-angle {
//     syntax: '<angle>';
//     inherits: false;
//     initial-value: 0deg;
//   }

//   .animate-float { animation: float 6s ease-in-out infinite; }
//   .animate-gradient { background-size: 200% 200%; animation: gradient 3s ease infinite; }
//   .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
//   .animate-spin-slow { animation: spin-slow 4s linear infinite; }
//   .animate-heartbeat { animation: heartbeat 1.5s ease-in-out infinite; }
//   .animate-shimmer { background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%); background-size: 200% center; animation: shimmer 3s ease-in-out infinite; }
//   .animate-scale-in { animation: scale-in 0.6s ease-out; }
//   .animate-slide-up { animation: slide-up 0.8s ease-out; }
//   .animate-glass-shine { background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%); background-size: 200% center; animation: glass-shine 4s ease-in-out infinite; }
//   .animate-float-glass { animation: float-glass 6s ease-in-out infinite; }
//   .animate-modal-in { animation: modal-in 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
//   .animate-pulse-ring { animation: pulse-ring 2s ease-out infinite; }
//   .animate-shine { background-size: 200% center; animation: shine 3s ease-in-out infinite; }
//   .animate-slide-up-fade { animation: slide-up-fade 0.8s ease-out; }
//   .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
//   .animate-category-slide { animation: category-slide 0.8s ease-out; }
//   .animate-category-slide-right { animation: category-slide-right 0.8s ease-out; }
//   .animate-medical-pulse { animation: medical-pulse 2s ease-in-out infinite; }
//   .animate-coworking-pulse { animation: coworking-pulse 2s ease-in-out infinite; }

//   .reveal {
//     opacity: 0;
//     transform: translateY(40px);
//     transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
//   }
//   .reveal.visible {
//     opacity: 1;
//     transform: translateY(0);
//   }

//   .line-clamp-2 {
//     display: -webkit-box;
//     -webkit-line-clamp: 2;
//     -webkit-box-orient: vertical;
//     overflow: hidden;
//   }

//   ::-webkit-scrollbar { width: 6px; }
//   ::-webkit-scrollbar-track { background: transparent; }
//   ::-webkit-scrollbar-thumb { background: #1a3a6b; border-radius: 10px; }
  
//   .medical-glow {
//     box-shadow: 0 0 40px rgba(26, 58, 107, 0.15);
//   }
//   .medical-glow:hover {
//     box-shadow: 0 0 60px rgba(26, 58, 107, 0.3);
//   }

//   .typing-text {
//     display: inline-block;
//   }
//   .typing-text .cursor {
//     display: none;
//   }
  
//   .footer-heart {
//     color: #ef4444;
//     display: inline-block;
//     animation: heartbeat 1.5s ease-in-out infinite;
//   }

//   /* Hero styles */
//   .hero-section {
//     position: relative;
//     min-height: 100vh;
//     display: flex;
//     align-items: center;
//     padding: 80px 24px 60px;
//     overflow: hidden;
//   }

//   .hero-bg {
//     position: absolute;
//     inset: 0;
//     z-index: 0;
//   }

//   .hero-bg img {
//     width: 100%;
//     height: 100%;
//     object-fit: cover;
//     object-position: center;
//   }

//   .hero-overlay {
//     position: absolute;
//     inset: 0;
//     z-index: 1;
//     background: rgba(0, 0, 0, 0.35);
//     backdrop-filter: blur(2px);
//     -webkit-backdrop-filter: blur(2px);
//   }

//   .hero-content {
//     position: relative;
//     z-index: 10;
//     width: 100%;
//     max-width: 1200px;
//     margin: 0 auto;
//   }

//   .hero-text-box {
//     max-width: 700px;
//     margin-left: 0;
//     margin-right: auto;
//   }

//   .hero-badge {
//     display: inline-flex;
//     align-items: center;
//     gap: 8px;
//     padding: 8px 20px;
//     background: rgba(0, 0, 0, 0.5);
//     border: 1px solid rgba(255, 255, 255, 0.15);
//     border-radius: 9999px;
//     font-size: 13px;
//     font-weight: 600;
//     color: #ffffff;
//     margin-bottom: 20px;
//     backdrop-filter: blur(4px);
//   }

//   .hero-title {
//     font-size: 3.2rem !important;
//     font-weight: 300 !important;
//     line-height: 1.15 !important;
//     color: #ffffff !important;
//     margin-bottom: 8px;
//     text-shadow: 0 2px 20px rgba(0, 0, 0, 0.4);
//   }

//   .hero-title-gradient {
//     background: linear-gradient(135deg, #ffffff, #93c5fd, #ffffff);
//     background-size: 200% 200%;
//     -webkit-background-clip: text;
//     -webkit-text-fill-color: transparent;
//     background-clip: text;
//     font-weight: 800 !important;
//     animation: gradient 3s ease infinite;
//     text-shadow: none;
//   }

//   .hero-subtitle {
//     font-size: 1.8rem !important;
//     font-weight: 200 !important;
//     line-height: 1.3 !important;
//     color: #ffffff !important;
//     text-shadow: 0 2px 20px rgba(0, 0, 0, 0.4);
//   }

//   .hero-desc {
//     font-size: 1.05rem !important;
//     line-height: 1.7 !important;
//     color: #ffffff !important;
//     max-width: 500px;
//     margin-top: 12px;
//     font-weight: 300;
//     text-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
//   }

//   .hero-buttons {
//     display: flex;
//     flex-wrap: wrap;
//     align-items: center;
//     gap: 16px;
//     margin-top: 28px;
//   }

//   .btn-primary {
//     padding: 12px 32px !important;
//     font-size: 1rem !important;
//     font-weight: 600 !important;
//     color: white;
//     background: linear-gradient(135deg, #0a1628, #1a3a6b);
//     border-radius: 14px;
//     border: none;
//     transition: all 0.3s;
//     display: flex;
//     align-items: center;
//     gap: 10px;
//     cursor: pointer;
//   }

//   .btn-primary:hover {
//     transform: scale(1.05);
//     box-shadow: 0 8px 30px rgba(26, 58, 107, 0.3);
//   }

//   .btn-secondary {
//     padding: 12px 32px !important;
//     font-size: 1rem !important;
//     font-weight: 400 !important;
//     color: #ffffff;
//     background: rgba(255, 255, 255, 0.15);
//     border: 1px solid rgba(255, 255, 255, 0.25);
//     border-radius: 14px;
//     backdrop-filter: blur(4px);
//     transition: all 0.3s;
//     display: flex;
//     align-items: center;
//     gap: 10px;
//     cursor: pointer;
//   }

//   .btn-secondary:hover {
//     transform: scale(1.05);
//     background: rgba(255, 255, 255, 0.25);
//   }

//   .hero-scroll {
//     margin-top: 50px;
//     display: flex;
//     justify-content: flex-start;
//     animation: bounce-slow 2s ease-in-out infinite;
//   }

//   .hero-scroll-text {
//     font-size: 11px;
//     text-transform: uppercase;
//     letter-spacing: 3px;
//     color: #ffffff;
//     opacity: 0.7;
//   }

//   /* ─── NAVBAR STYLES ─── */
//   .navbar-custom {
//     position: fixed !important;
//     top: 0 !important;
//     left: 0 !important;
//     right: 0 !important;
//     z-index: 50 !important;
//     height: 72px !important;
//     padding: 0 24px !important;
//     background: transparent !important;
//     transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
//     display: flex !important;
//     align-items: center !important;
//   }

//   .navbar-custom .navbar-inner {
//     width: 100%;
//     max-width: 1200px;
//     margin: 0 auto;
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
//     height: 72px;
//   }

//   .navbar-custom .nav-links {
//     display: flex !important;
//     align-items: center !important;
//     gap: 4px !important;
//     flex-wrap: nowrap !important;
//     white-space: nowrap !important;
//   }

//   .navbar-custom .navbar-link {
//     font-size: 0.88rem !important;
//     font-weight: 700 !important;
//     padding: 8px 14px !important;
//     color: #ffffff !important;
//     cursor: pointer;
//     transition: all 0.3s;
//     border-radius: 9999px;
//     background: none;
//     border: none;
//     font-family: inherit;
//     text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
//     letter-spacing: 0.3px;
//     white-space: nowrap !important;
//   }

//   .navbar-custom .navbar-link:hover {
//     color: #93c5fd !important;
//     background: rgba(255, 255, 255, 0.15) !important;
//   }

//   .navbar-custom .navbar-brand {
//     font-size: 1.2rem !important;
//     font-weight: 700 !important;
//     color: #ffffff !important;
//     display: flex;
//     align-items: center;
//     gap: 10px;
//     text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
//     white-space: nowrap !important;
//   }

//   .navbar-custom .navbar-brand .brand-icon {
//     width: 36px;
//     height: 36px;
//     border-radius: 50%;
//     background: rgba(255, 255, 255, 0.15);
//     backdrop-filter: blur(8px);
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     color: white;
//     flex-shrink: 0;
//     border: 1px solid rgba(255, 255, 255, 0.2);
//   }

//   .navbar-custom .navbar-btn {
//     font-size: 0.82rem !important;
//     font-weight: 700 !important;
//     padding: 8px 18px !important;
//     background: rgba(255, 255, 255, 0.15) !important;
//     backdrop-filter: blur(8px);
//     border: 1px solid rgba(255, 255, 255, 0.2);
//     color: #ffffff !important;
//     border-radius: 9999px;
//     transition: all 0.3s;
//     cursor: pointer;
//     display: flex;
//     align-items: center;
//     gap: 6px;
//     white-space: nowrap !important;
//   }

//   .navbar-custom .navbar-btn:hover {
//     background: rgba(255, 255, 255, 0.25) !important;
//     transform: scale(1.05);
//   }

//   .navbar-custom .navbar-signin {
//     font-size: 0.85rem !important;
//     font-weight: 700 !important;
//     color: #ffffff !important;
//     text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
//     background: none;
//     border: none;
//     padding: 8px 14px;
//     border-radius: 9999px;
//     cursor: pointer;
//     transition: all 0.3s;
//     white-space: nowrap !important;
//   }

//   .navbar-custom .navbar-signin:hover {
//     color: #93c5fd !important;
//     background: rgba(255, 255, 255, 0.1);
//   }

//   .navbar-custom .navbar-logo {
//     width: 44px !important;
//     height: 44px !important;
//     border: 2px solid rgba(255, 255, 255, 0.3) !important;
//     border-radius: 50% !important;
//     padding: 3px !important;
//     background: rgba(255, 255, 255, 0.05) !important;
//     overflow: hidden !important;
//     flex-shrink: 0 !important;
//     transition: all 0.3s !important;
//   }

//   .navbar-custom .navbar-logo img {
//     width: 100% !important;
//     height: 100% !important;
//     object-fit: contain !important;
//   }

//   .navbar-custom .navbar-logo:hover {
//     transform: scale(1.1);
//     border-color: rgba(255, 255, 255, 0.5) !important;
//   }

//   .navbar-menu-btn {
//     display: none !important;
//     color: #ffffff !important;
//     padding: 8px;
//     border-radius: 50%;
//     background: rgba(255, 255, 255, 0.05);
//     border: 1px solid rgba(255, 255, 255, 0.1);
//     cursor: pointer;
//     transition: all 0.3s;
//     align-items: center;
//     justify-content: center;
//   }

//   .navbar-menu-btn:hover {
//     background: rgba(255, 255, 255, 0.1);
//   }

//   .navbar-scrolled {
//     background: rgba(10, 22, 40, 0.92) !important;
//     backdrop-filter: blur(16px) !important;
//     border-bottom: 1px solid rgba(255, 255, 255, 0.06) !important;
//     box-shadow: 0 4px 30px rgba(0, 0, 0, 0.15) !important;
//     height: 72px !important;
//   }

//   .navbar-scrolled .navbar-link {
//     color: #e2e8f0 !important;
//     text-shadow: none !important;
//   }

//   .navbar-scrolled .navbar-link:hover {
//     color: #ffffff !important;
//     background: rgba(255, 255, 255, 0.08) !important;
//   }

//   .navbar-scrolled .navbar-brand {
//     color: #ffffff !important;
//     text-shadow: none !important;
//   }

//   .navbar-scrolled .navbar-brand .brand-icon {
//     background: linear-gradient(135deg, #1a3a6b, #0a1628);
//     border: 1px solid rgba(255, 255, 255, 0.1);
//   }

//   .navbar-scrolled .navbar-btn {
//     background: linear-gradient(135deg, #1a3a6b, #0a1628) !important;
//     border: 1px solid rgba(255, 255, 255, 0.1);
//     color: #ffffff !important;
//   }

//   .navbar-scrolled .navbar-btn:hover {
//     background: linear-gradient(135deg, #2a4a7b, #1a2a4a) !important;
//   }

//   .navbar-scrolled .navbar-signin {
//     color: #cbd5e1 !important;
//     text-shadow: none !important;
//   }

//   .navbar-scrolled .navbar-signin:hover {
//     color: #ffffff !important;
//   }

//   .navbar-scrolled .navbar-logo {
//     border-color: rgba(255, 255, 255, 0.15) !important;
//     background: rgba(255, 255, 255, 0.05) !important;
//   }

//   .navbar-scrolled .navbar-menu-btn {
//     color: #e2e8f0 !important;
//     background: rgba(255, 255, 255, 0.05);
//     border-color: rgba(255, 255, 255, 0.05);
//   }

//   .navbar-scrolled .navbar-menu-btn:hover {
//     background: rgba(255, 255, 255, 0.1);
//     color: #ffffff !important;
//   }

//   @media (max-width: 992px) {
//     .navbar-custom .nav-links {
//       display: none !important;
//     }
//     .navbar-menu-btn {
//       display: flex !important;
//     }
//   }

//   .navbar-btn-mobile-hide {
//     display: flex !important;
//   }

//   @media (max-width: 640px) {
//     .navbar-btn-mobile-hide {
//       display: none !important;
//     }
//     .navbar-custom {
//       padding: 0 16px !important;
//       height: 64px !important;
//     }
//     .navbar-custom .navbar-inner {
//       height: 64px !important;
//     }
//     .navbar-scrolled {
//       height: 64px !important;
//     }
//     .hero-title {
//       font-size: 2rem !important;
//     }
//     .hero-subtitle {
//       font-size: 1.2rem !important;
//     }
//     .hero-desc {
//       font-size: 0.85rem !important;
//     }
//     .hero-text-box {
//       max-width: 100%;
//     }
//     .btn-primary, .btn-secondary {
//       padding: 10px 20px !important;
//       font-size: 0.85rem !important;
//     }
//     .navbar-custom .navbar-link {
//       font-size: 0.75rem !important;
//       padding: 6px 12px !important;
//     }
//     .navbar-custom .navbar-brand {
//       font-size: 0.9rem !important;
//     }
//     .navbar-custom .navbar-brand .brand-icon {
//       width: 28px;
//       height: 28px;
//     }
//     .navbar-custom .navbar-brand .brand-icon svg {
//       width: 14px !important;
//       height: 14px !important;
//     }
//     .navbar-custom .navbar-btn {
//       font-size: 0.7rem !important;
//       padding: 6px 14px !important;
//     }
//     .navbar-custom .navbar-signin {
//       font-size: 0.7rem !important;
//     }
//     .navbar-custom .navbar-logo {
//       width: 38px !important;
//       height: 38px !important;
//     }
//     .glass-card {
//       padding: 20px 16px;
//       border-radius: 20px !important;
//       min-height: 200px;
//     }
//     .glass-card .icon-wrapper {
//       width: 48px;
//       height: 48px;
//     }
//     .glass-card h3 {
//       font-size: 1rem;
//     }
//     .glass-card p {
//       font-size: 0.8rem;
//     }
//     .feature-card {
//       padding: 24px 20px;
//     }
//     .location-grid-images .img-main {
//       height: 180px;
//     }
//     .location-grid-images .img-side {
//       height: 86px;
//     }
//     .location-list-item {
//       padding: 12px 16px;
//     }
//     .modal-content {
//       padding: 16px;
//       border-radius: 20px;
//       max-height: 95vh;
//     }
//     .modal-close {
//       width: 32px;
//       height: 32px;
//     }
//     .cabin-card-modal .cabin-image {
//       height: 120px;
//     }
//     .modal-content {
//       max-width: 100%;
//     }
//     .category-divider {
//       flex-direction: column !important;
//       gap: 20px !important;
//       padding: 30px 16px !important;
//     }
//     .category-divider .divider-line {
//       width: 60% !important;
//       height: 2px !important;
//     }
//     .category-divider .divider-icon {
//       width: 48px !important;
//       height: 48px !important;
//     }
//     .category-divider .divider-icon svg {
//       width: 22px !important;
//       height: 22px !important;
//     }
//     .category-divider .category-label {
//       font-size: 1rem !important;
//     }
//     .pro-cabin-card .pro-card-body {
//       padding: 18px 16px 16px !important;
//     }
//     .pro-cabin-card .pro-amenity-row {
//       gap: 6px !important;
//     }
//   }

//   @keyframes fadeIn {
//     from { opacity: 0; }
//     to { opacity: 1; }
//   }
//   @keyframes slideUp {
//     from { opacity: 0; transform: translateY(40px) scale(0.95); }
//     to { opacity: 1; transform: translateY(0) scale(1); }
//   }
//   .animate-fadeIn {
//     animation: fadeIn 0.3s ease-out;
//   }
//   .animate-slideUp {
//     animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
//   }

//   .mobile-menu-close {
//     position: absolute;
//     top: 16px;
//     right: 16px;
//     padding: 8px;
//     border-radius: 50%;
//     background: #f1f5f9;
//     border: none;
//     cursor: pointer;
//     transition: all 0.3s;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//   }

//   .mobile-menu-close:hover {
//     background: #e2e8f0;
//     transform: rotate(90deg);
//   }

//   /* Glass Cards */
//   .glass-card {
//     border-radius: 28px !important;
//     padding: 32px 28px;
//     transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
//     position: relative;
//     overflow: hidden;
//     backdrop-filter: blur(24px) saturate(180%);
//     -webkit-backdrop-filter: blur(24px) saturate(180%);
//     border: 1px solid rgba(255, 255, 255, 0.3);
//     box-shadow: 
//       0 8px 32px rgba(0, 0, 0, 0.08),
//       inset 0 1px 0 rgba(255, 255, 255, 0.4);
//     background: rgba(255, 255, 255, 0.15) !important;
//     display: flex;
//     flex-direction: column;
//     height: 100%;
//     min-height: 240px;
//   }

//   .glass-card::before {
//     content: '';
//     position: absolute;
//     top: -60%;
//     left: -60%;
//     width: 220%;
//     height: 220%;
//     background: radial-gradient(
//       circle at 30% 25%,
//       rgba(255, 255, 255, 0.4) 0%,
//       rgba(255, 255, 255, 0.05) 40%,
//       transparent 70%
//     );
//     pointer-events: none;
//     z-index: 0;
//     animation: float-glass 8s ease-in-out infinite;
//   }

//   .glass-card::after {
//     content: '';
//     position: absolute;
//     bottom: 0;
//     left: 0;
//     right: 0;
//     height: 40%;
//     background: linear-gradient(
//       to top,
//       rgba(255, 255, 255, 0.05),
//       transparent
//     );
//     pointer-events: none;
//     z-index: 0;
//   }

//   .glass-card:hover {
//     transform: translateY(-10px) scale(1.02);
//     box-shadow: 
//       0 30px 80px rgba(0, 0, 0, 0.15),
//       inset 0 1px 0 rgba(255, 255, 255, 0.5);
//     border-color: rgba(255, 255, 255, 0.5);
//     background: rgba(255, 255, 255, 0.25) !important;
//   }

//   .glass-card .icon-wrapper {
//     width: 60px;
//     height: 60px;
//     border-radius: 18px;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     margin-bottom: 18px;
//     transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
//     background: rgba(255, 255, 255, 0.2) !important;
//     color: white !important;
//     backdrop-filter: blur(8px);
//     border: 1px solid rgba(255, 255, 255, 0.2);
//     position: relative;
//     z-index: 1;
//     box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
//     flex-shrink: 0;
//   }

//   .glass-card:hover .icon-wrapper {
//     transform: scale(1.08) rotate(-4deg);
//     background: rgba(255, 255, 255, 0.3) !important;
//     box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
//   }

//   .glass-card h3 {
//     position: relative;
//     z-index: 1;
//     color: #0a1628 !important;
//     font-weight: 700;
//     font-size: 1.15rem;
//     letter-spacing: -0.01em;
//     text-shadow: 0 1px 2px rgba(255, 255, 255, 0.3);
//     margin-bottom: 6px;
//   }

//   .glass-card p {
//     position: relative;
//     z-index: 1;
//     color: #1a2a4a !important;
//     font-weight: 400;
//     font-size: 0.9rem;
//     line-height: 1.7;
//     opacity: 0.9;
//     flex: 1;
//   }

//   .glass-blue {
//     background: rgba(26, 58, 107, 0.2) !important;
//     border-color: rgba(26, 58, 107, 0.15);
//   }
//   .glass-blue:hover {
//     background: rgba(26, 58, 107, 0.3) !important;
//     border-color: rgba(26, 58, 107, 0.3);
//   }
//   .glass-blue .icon-wrapper {
//     background: rgba(26, 58, 107, 0.3) !important;
//     color: #1a3a6b !important;
//   }

//   .glass-teal {
//     background: rgba(13, 148, 136, 0.2) !important;
//     border-color: rgba(13, 148, 136, 0.15);
//   }
//   .glass-teal:hover {
//     background: rgba(13, 148, 136, 0.3) !important;
//     border-color: rgba(13, 148, 136, 0.3);
//   }
//   .glass-teal .icon-wrapper {
//     background: rgba(13, 148, 136, 0.3) !important;
//     color: #0d9488 !important;
//   }

//   .glass-purple {
//     background: rgba(124, 58, 237, 0.2) !important;
//     border-color: rgba(124, 58, 237, 0.15);
//   }
//   .glass-purple:hover {
//     background: rgba(124, 58, 237, 0.3) !important;
//     border-color: rgba(124, 58, 237, 0.3);
//   }
//   .glass-purple .icon-wrapper {
//     background: rgba(124, 58, 237, 0.3) !important;
//     color: #7c3aed !important;
//   }

//   .glass-rose {
//     background: rgba(220, 38, 38, 0.2) !important;
//     border-color: rgba(220, 38, 38, 0.15);
//   }
//   .glass-rose:hover {
//     background: rgba(220, 38, 38, 0.3) !important;
//     border-color: rgba(220, 38, 38, 0.3);
//   }
//   .glass-rose .icon-wrapper {
//     background: rgba(220, 38, 38, 0.3) !important;
//     color: #dc2626 !important;
//   }

//   .feature-card {
//     border-radius: 24px !important;
//     padding: 32px 28px;
//     transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
//     border: 1px solid rgba(255,255,255,0.1);
//     position: relative;
//     background: rgba(255,255,255,0.05) !important;
//     height: 100%;
//     display: flex;
//     flex-direction: column;
//   }

//   .feature-card:hover {
//     transform: translateY(-10px);
//     background: rgba(255,255,255,0.1) !important;
//   }

//   .feature-card .feature-icon {
//     width: 64px;
//     height: 64px;
//     border-radius: 20px;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     margin-bottom: 20px;
//     font-size: 28px;
//     flex-shrink: 0;
//   }

//   .specialties-gradient-heading {
//     background: linear-gradient(135deg, #0a1628, #1a3a6b, #0a1628);
//     background-size: 200% 200%;
//     -webkit-background-clip: text;
//     -webkit-text-fill-color: transparent;
//     background-clip: text;
//     font-weight: 700 !important;
//     animation: gradient 3s ease infinite;
//   }

//   .location-list-item {
//     display: flex;
//     align-items: flex-start;
//     gap: 16px;
//     padding: 16px 20px;
//     border-radius: 16px;
//     transition: all 0.3s;
//     background: white;
//     border: 1px solid rgba(0,0,0,0.04);
//   }

//   .location-list-item:hover {
//     background: #f8fafc;
//     transform: translateX(4px);
//     border-color: rgba(26, 58, 107, 0.15);
//   }

//   .location-list-item .loc-icon {
//     width: 48px;
//     height: 48px;
//     min-width: 48px;
//     border-radius: 14px;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     background: #1a3a6b;
//     color: white;
//     transition: all 0.3s;
//     flex-shrink: 0;
//   }

//   .location-list-item:hover .loc-icon {
//     transform: scale(1.05) rotate(-3deg);
//   }

//   .location-list-item .loc-content h4 {
//     font-size: 1rem;
//     font-weight: 700;
//     color: #0a1628;
//     margin-bottom: 2px;
//   }

//   .location-list-item .loc-content p {
//     font-size: 0.85rem;
//     color: #666;
//     line-height: 1.5;
//   }

//   .location-grid-images {
//     display: grid;
//     grid-template-columns: 1fr 1fr;
//     gap: 12px;
//   }

//   .location-grid-images .img-main {
//     grid-row: span 2;
//     border-radius: 16px;
//     overflow: hidden;
//     height: 280px;
//   }

//   .location-grid-images .img-main img {
//     width: 100%;
//     height: 100%;
//     object-fit: cover;
//     transition: transform 0.5s;
//   }

//   .location-grid-images .img-main:hover img {
//     transform: scale(1.05);
//   }

//   .location-grid-images .img-side {
//     border-radius: 16px;
//     overflow: hidden;
//     height: 134px;
//   }

//   .location-grid-images .img-side img {
//     width: 100%;
//     height: 100%;
//     object-fit: cover;
//     transition: transform 0.5s;
//   }

//   .location-grid-images .img-side:hover img {
//     transform: scale(1.05);
//   }

//   /* Modal Styles */
//   .modal-overlay {
//     position: fixed;
//     inset: 0;
//     z-index: 9999;
//     background: rgba(0, 0, 0, 0.6);
//     backdrop-filter: blur(8px);
//     -webkit-backdrop-filter: blur(8px);
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     padding: 20px;
//     animation: fadeIn 0.3s ease;
//   }

//   .modal-content {
//     background: white;
//     border-radius: 32px;
//     max-width: 950px;
//     width: 100%;
//     max-height: 90vh;
//     overflow-y: auto;
//     padding: 0;
//     position: relative;
//     animation: modal-in 0.4s cubic-bezier(0.16, 1, 0.3, 1);
//     box-shadow: 0 40px 120px rgba(0, 0, 0, 0.3);
//   }

//   .modal-content::-webkit-scrollbar {
//     width: 0px;
//     background: transparent;
//   }
//   .modal-content {
//     scrollbar-width: none;
//     -ms-overflow-style: none;
//   }

//   .modal-close {
//     position: sticky;
//     top: 12px;
//     float: right;
//     width: 36px;
//     height: 36px;
//     border-radius: 50%;
//     background: rgba(255, 255, 255, 0.9);
//     border: none;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     cursor: pointer;
//     transition: all 0.3s;
//     z-index: 20;
//     margin-right: 12px;
//     margin-top: 12px;
//     backdrop-filter: blur(8px);
//     box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
//   }

//   .modal-close:hover {
//     background: #e2e8f0;
//     transform: rotate(90deg);
//   }

//   .modal-close svg {
//     color: #1a2a4a;
//   }

//   /* Space Detail Modal - Full Width Layout */
//   .space-detail-modal {
//     background: white;
//     border-radius: 32px;
//     overflow: hidden;
//     width: 100%;
//     display: flex;
//     flex-direction: column;
//   }

//   .space-detail-modal .modal-body {
//     display: grid;
//     grid-template-columns: 1fr 1fr;
//     gap: 0;
//     min-height: 500px;
//   }

//   /* Left side - Image Slider */
//   .space-detail-modal .modal-image-section {
//     position: relative;
//     background: #f0f4f8;
//     min-height: 400px;
//     overflow: hidden;
//     border-radius: 0;
//   }

//   .space-detail-modal .modal-image-section .image-slider {
//     width: 100%;
//     height: 100%;
//     position: relative;
//   }

//   .space-detail-modal .modal-image-section .image-slider .slider-image {
//     width: 100%;
//     height: 100%;
//     object-fit: cover;
//     min-height: 400px;
//   }

//   .space-detail-modal .modal-image-section .slider-btn {
//     position: absolute;
//     top: 50%;
//     transform: translateY(-50%);
//     width: 40px;
//     height: 40px;
//     border-radius: 50%;
//     background: rgba(0, 0, 0, 0.6);
//     backdrop-filter: blur(8px);
//     border: 1px solid rgba(255, 255, 255, 0.2);
//     color: white;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     cursor: pointer;
//     transition: all 0.3s;
//     z-index: 5;
//   }

//   .space-detail-modal .modal-image-section .slider-btn:hover {
//     background: rgba(0, 0, 0, 0.8);
//     transform: translateY(-50%) scale(1.1);
//   }

//   .space-detail-modal .modal-image-section .slider-btn.prev {
//     left: 12px;
//   }

//   .space-detail-modal .modal-image-section .slider-btn.next {
//     right: 12px;
//   }

//   .space-detail-modal .modal-image-section .image-dots {
//     position: absolute;
//     bottom: 16px;
//     left: 50%;
//     transform: translateX(-50%);
//     display: flex;
//     gap: 8px;
//     z-index: 5;
//   }

//   .space-detail-modal .modal-image-section .image-dots .dot {
//     width: 10px;
//     height: 10px;
//     border-radius: 50%;
//     background: rgba(255, 255, 255, 0.4);
//     cursor: pointer;
//     transition: all 0.3s;
//     border: none;
//     padding: 0;
//   }

//   .space-detail-modal .modal-image-section .image-dots .dot.active {
//     background: white;
//     transform: scale(1.3);
//   }

//   .space-detail-modal .modal-image-section .image-counter {
//     position: absolute;
//     bottom: 16px;
//     right: 16px;
//     background: rgba(0, 0, 0, 0.6);
//     backdrop-filter: blur(8px);
//     color: white;
//     padding: 4px 14px;
//     border-radius: 9999px;
//     font-size: 12px;
//     font-weight: 500;
//     z-index: 5;
//   }

//   .space-detail-modal .modal-image-section .space-type-badge {
//     position: absolute;
//     top: 16px;
//     left: 16px;
//     background: rgba(0, 0, 0, 0.7);
//     backdrop-filter: blur(8px);
//     color: white;
//     padding: 6px 18px;
//     border-radius: 9999px;
//     font-size: 12px;
//     font-weight: 600;
//     letter-spacing: 0.5px;
//     z-index: 5;
//   }

//   /* Right side - Content */
//   .space-detail-modal .modal-content-section {
//     padding: 32px 28px;
//     display: flex;
//     flex-direction: column;
//     overflow-y: auto;
//     background: white;
//   }

//   .space-detail-modal .modal-content-section .space-title {
//     font-size: 1.6rem;
//     font-weight: 700;
//     color: #0a1628;
//     margin-bottom: 4px;
//     line-height: 1.2;
//   }

//   .space-detail-modal .modal-content-section .space-location {
//     font-size: 0.9rem;
//     color: #64748b;
//     display: flex;
//     align-items: flex-start;
//     gap: 6px;
//     margin-bottom: 14px;
//     line-height: 1.4;
//   }

//   .space-detail-modal .modal-content-section .space-location svg {
//     flex-shrink: 0;
//     margin-top: 2px;
//   }

//   .space-detail-modal .modal-content-section .space-description {
//     font-size: 0.92rem;
//     color: #475569;
//     line-height: 1.7;
//     margin-bottom: 16px;
//     flex: 1;
//   }

//   .space-detail-modal .modal-content-section .space-features {
//     display: grid;
//     grid-template-columns: 1fr 1fr;
//     gap: 6px;
//     margin-bottom: 16px;
//   }

//   .space-detail-modal .modal-content-section .space-features .feature-item {
//     display: flex;
//     align-items: center;
//     gap: 8px;
//     font-size: 0.82rem;
//     color: #334155;
//     padding: 6px 10px;
//     background: #f8fafc;
//     border-radius: 8px;
//   }

//   .space-detail-modal .modal-content-section .space-features .feature-item svg {
//     color: #1a3a6b;
//     flex-shrink: 0;
//   }

//   .space-detail-modal .modal-content-section .space-price {
//     display: flex;
//     align-items: baseline;
//     gap: 8px;
//     padding-top: 14px;
//     border-top: 1px solid #e2e8f0;
//     margin-bottom: 16px;
//   }

//   .space-detail-modal .modal-content-section .space-price .amount {
//     font-size: 1.8rem;
//     font-weight: 800;
//     color: #0a1628;
//   }

//   .space-detail-modal .modal-content-section .space-price .period {
//     font-size: 0.9rem;
//     color: #94a3b8;
//   }

//   .space-detail-modal .modal-content-section .btn-book-now-modal {
//     width: 100%;
//     padding: 14px;
//     background: linear-gradient(135deg, #0a1628, #1a3a6b);
//     color: white;
//     border: none;
//     border-radius: 12px;
//     font-size: 1rem;
//     font-weight: 600;
//     cursor: pointer;
//     transition: all 0.3s;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     gap: 8px;
//     margin-top: auto;
//   }

//   .space-detail-modal .modal-content-section .btn-book-now-modal:hover {
//     transform: scale(1.02);
//     box-shadow: 0 8px 30px rgba(26, 58, 107, 0.3);
//   }

//   /* Thumbnail strip below slider */
//   .space-detail-modal .modal-image-section .thumbnail-strip {
//     position: absolute;
//     bottom: 60px;
//     left: 50%;
//     transform: translateX(-50%);
//     display: flex;
//     gap: 6px;
//     z-index: 5;
//     max-width: 80%;
//     overflow-x: auto;
//     padding: 4px;
//     background: rgba(0, 0, 0, 0.3);
//     backdrop-filter: blur(8px);
//     border-radius: 12px;
//   }

//   .space-detail-modal .modal-image-section .thumbnail-strip .thumb {
//     width: 50px;
//     height: 50px;
//     border-radius: 8px;
//     overflow: hidden;
//     cursor: pointer;
//     border: 2px solid transparent;
//     transition: all 0.3s;
//     flex-shrink: 0;
//   }

//   .space-detail-modal .modal-image-section .thumbnail-strip .thumb.active {
//     border-color: white;
//     transform: scale(1.05);
//   }

//   .space-detail-modal .modal-image-section .thumbnail-strip .thumb img {
//     width: 100%;
//     height: 100%;
//     object-fit: cover;
//   }

//   .space-detail-modal .modal-image-section .thumbnail-strip .thumb:hover {
//     transform: scale(1.05);
//     border-color: rgba(255, 255, 255, 0.5);
//   }

//   /* Category Divider Styles */
//   .category-divider {
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     gap: 12px;
//     padding: 10px 24px;
//     margin: 10px auto 30px;
//     max-width: 900px;
//     border-radius: 60px;
//     background: rgba(255, 255, 255, 0.6);
//     backdrop-filter: blur(12px);
//     border: 1px solid rgba(255, 255, 255, 0.3);
//     box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
//     position: relative;
//     overflow: hidden;
//   }

//   .category-divider::before {
//     content: '';
//     position: absolute;
//     top: -50%;
//     left: -50%;
//     width: 200%;
//     height: 200%;
//     background: radial-gradient(circle at 30% 40%, rgba(59, 130, 246, 0.05), transparent 60%);
//     pointer-events: none;
//     animation: spin-slow 20s linear infinite;
//   }

//   .category-divider .divider-line {
//     flex: 1;
//     height: 2px;
//     background: linear-gradient(90deg, transparent, #3b82f6, #2563eb, #3b82f6, transparent);
//     border-radius: 4px;
//     opacity: 0.4;
//     max-width: 120px;
//   }

//   .category-divider .divider-icon {
//     width: 56px;
//     height: 56px;
//     border-radius: 50%;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     flex-shrink: 0;
//     font-size: 20px;
//     font-weight: 700;
//     position: relative;
//     z-index: 1;
//     box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
//     transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
//     border: 2px solid rgba(255, 255, 255, 0.5);
//   }

//   .category-divider .divider-icon:hover {
//     transform: scale(1.1);
//   }

//   .category-divider .divider-icon.coworking {
//     background: linear-gradient(135deg, #3b82f6, #1d4ed8);
//     color: white;
//     box-shadow: 0 4px 20px rgba(59, 130, 246, 0.3);
//   }

//   .category-divider .divider-icon.medical {
//     background: linear-gradient(135deg, #ef4444, #dc2626);
//     color: white;
//     box-shadow: 0 4px 20px rgba(239, 68, 68, 0.3);
//   }

//   .category-divider .category-label {
//     font-size: 1.1rem;
//     font-weight: 700;
//     color: #0f172a;
//     letter-spacing: 0.5px;
//     position: relative;
//     z-index: 1;
//     display: flex;
//     align-items: center;
//     gap: 8px;
//   }

//   .category-divider .category-label .label-dot {
//     display: inline-block;
//     width: 8px;
//     height: 8px;
//     border-radius: 50%;
//     margin-right: 4px;
//   }

//   .category-divider .category-label .label-dot.blue {
//     background: #3b82f6;
//   }
//   .category-divider .category-label .label-dot.red {
//     background: #ef4444;
//   }

//   .category-divider .category-badge {
//     font-size: 0.65rem;
//     font-weight: 600;
//     text-transform: uppercase;
//     letter-spacing: 0.08em;
//     padding: 3px 12px;
//     border-radius: 9999px;
//     background: rgba(0, 0, 0, 0.05);
//     color: #64748b;
//     position: relative;
//     z-index: 1;
//   }

//   .category-divider .divider-arrow {
//     color: #94a3b8;
//     opacity: 0.4;
//     position: relative;
//     z-index: 1;
//   }

//   .category-divider .category-count {
//     font-size: 0.7rem;
//     font-weight: 600;
//     color: #94a3b8;
//     background: rgba(0, 0, 0, 0.03);
//     padding: 2px 12px;
//     border-radius: 9999px;
//     position: relative;
//     z-index: 1;
//   }

//   /* Responsive for modal */
//   @media (max-width: 768px) {
//     .space-detail-modal .modal-body {
//       grid-template-columns: 1fr;
//     }
    
//     .space-detail-modal .modal-image-section {
//       min-height: 280px;
//     }
    
//     .space-detail-modal .modal-image-section .image-slider .slider-image {
//       min-height: 280px;
//     }
    
//     .space-detail-modal .modal-content-section {
//       padding: 20px 16px;
//     }
    
//     .space-detail-modal .modal-content-section .space-title {
//       font-size: 1.3rem;
//     }
    
//     .space-detail-modal .modal-content-section .space-features {
//       grid-template-columns: 1fr 1fr;
//     }
    
//     .space-detail-modal .modal-image-section .thumbnail-strip .thumb {
//       width: 40px;
//       height: 40px;
//     }
    
//     .modal-content {
//       max-width: 100%;
//       border-radius: 24px;
//     }
    
//     .space-detail-modal .modal-image-section .slider-btn {
//       width: 32px;
//       height: 32px;
//     }
    
//     .space-detail-modal .modal-image-section .slider-btn svg {
//       width: 16px;
//       height: 16px;
//     }
    
//     .modal-close {
//       width: 32px;
//       height: 32px;
//       margin-right: 8px;
//       margin-top: 8px;
//     }

//     .category-divider {
//       padding: 12px 16px;
//       border-radius: 30px;
//       gap: 8px;
//       margin: 0 8px 20px;
//     }
//     .category-divider .divider-line {
//       max-width: 60px;
//     }
//     .category-divider .divider-icon {
//       width: 40px;
//       height: 40px;
//       font-size: 14px;
//     }
//     .category-divider .category-label {
//       font-size: 0.8rem;
//     }
//     .category-divider .category-badge {
//       display: none;
//     }
//     .category-divider .divider-arrow {
//       display: none;
//     }
//     .category-divider .category-count {
//       font-size: 0.6rem;
//       padding: 1px 8px;
//     }
//   }

//   @media (max-width: 480px) {
//     .space-detail-modal .modal-image-section {
//       min-height: 220px;
//     }
    
//     .space-detail-modal .modal-image-section .image-slider .slider-image {
//       min-height: 220px;
//     }
    
//     .space-detail-modal .modal-content-section .space-features {
//       grid-template-columns: 1fr;
//     }
    
//     .space-detail-modal .modal-content-section .space-price .amount {
//       font-size: 1.4rem;
//     }
    
//     .space-detail-modal .modal-image-section .thumbnail-strip .thumb {
//       width: 32px;
//       height: 32px;
//     }

//     .category-divider {
//       padding: 10px 12px;
//       border-radius: 24px;
//       gap: 6px;
//       margin: 0 4px 16px;
//       flex-wrap: wrap;
//     }
//     .category-divider .divider-line {
//       display: none;
//     }
//     .category-divider .divider-icon {
//       width: 36px;
//       height: 36px;
//       font-size: 12px;
//     }
//     .category-divider .category-label {
//       font-size: 0.7rem;
//     }
//     .category-divider .category-count {
//       font-size: 0.55rem;
//       padding: 1px 6px;
//     }
//   }

//   /* Card Image Slider */
//   .card-image-slider {
//     position: relative;
//     height: 100%;
//     width: 100%;
//     overflow: hidden;
//   }

//   .card-image-slider .card-slider-btn {
//     position: absolute;
//     top: 50%;
//     transform: translateY(-50%);
//     width: 28px;
//     height: 28px;
//     border-radius: 50%;
//     background: rgba(0, 0, 0, 0.5);
//     backdrop-filter: blur(4px);
//     border: 1px solid rgba(255, 255, 255, 0.2);
//     color: white;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     cursor: pointer;
//     transition: all 0.3s;
//     z-index: 5;
//     opacity: 0;
//   }

//   .card-image-slider:hover .card-slider-btn {
//     opacity: 1;
//   }

//   .card-image-slider .card-slider-btn:hover {
//     background: rgba(0, 0, 0, 0.8);
//     transform: translateY(-50%) scale(1.1);
//   }

//   .card-image-slider .card-slider-btn.prev {
//     left: 4px;
//   }

//   .card-image-slider .card-slider-btn.next {
//     right: 4px;
//   }

//   .card-image-slider .card-slider-btn svg {
//     width: 14px;
//     height: 14px;
//   }

//   .card-image-slider img {
//     width: 100%;
//     height: 100%;
//     object-fit: cover;
//     transition: transform 0.7s;
//   }

//   .card-image-slider:hover img {
//     transform: scale(1.05);
//   }

//   .card-image-slider .card-dots {
//     position: absolute;
//     bottom: 8px;
//     left: 50%;
//     transform: translateX(-50%);
//     display: flex;
//     gap: 4px;
//     z-index: 5;
//   }

//   .card-image-slider .card-dots .dot {
//     width: 5px;
//     height: 5px;
//     border-radius: 50%;
//     background: rgba(255, 255, 255, 0.3);
//     cursor: pointer;
//     transition: all 0.3s;
//     border: none;
//     padding: 0;
//   }

//   .card-image-slider .card-dots .dot.active {
//     background: white;
//     transform: scale(1.2);
//   }

//   /* ═══════════════════════════════════════════════ */
//   /* PRO CABIN CARD — premium co-working/medical card */
//   /* ═══════════════════════════════════════════════ */
//   .pro-cabin-card {
//     position: relative;
//     border-radius: 24px;
//     background: #ffffff;
//     border: 1px solid rgba(15, 23, 42, 0.07);
//     box-shadow: 0 2px 8px rgba(15, 23, 42, 0.05);
//     overflow: hidden;
//     cursor: pointer;
//     transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.45s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.45s;
//     display: flex;
//     flex-direction: column;
//     height: 100%;
//   }

//   .pro-cabin-card::before {
//     content: '';
//     position: absolute;
//     inset: 0;
//     border-radius: 24px;
//     padding: 1.5px;
//     background: conic-gradient(from var(--border-angle), transparent 0%, transparent 70%, currentColor 90%, transparent 100%);
//     -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
//     -webkit-mask-composite: xor;
//     mask-composite: exclude;
//     opacity: 0;
//     transition: opacity 0.4s;
//     animation: border-spin 3.5s linear infinite;
//     pointer-events: none;
//     z-index: 2;
//   }

//   .pro-cabin-card:hover {
//     transform: translateY(-8px);
//     box-shadow: 0 24px 48px -12px rgba(15, 23, 42, 0.22);
//   }

//   .pro-cabin-card:hover::before {
//     opacity: 1;
//   }

//   .pro-cabin-card.pro-cabin-coworking { color: #2563eb; }
//   .pro-cabin-card.pro-cabin-medical { color: #dc2626; }

//   .pro-card-media {
//     position: relative;
//     height: 216px;
//     overflow: hidden;
//     flex-shrink: 0;
//   }

//   .pro-card-media .pro-media-gradient {
//     position: absolute;
//     inset: 0;
//     background: linear-gradient(180deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.55) 100%);
//     z-index: 3;
//     pointer-events: none;
//   }

//   .pro-badge-row {
//     position: absolute;
//     top: 12px;
//     left: 12px;
//     right: 12px;
//     display: flex;
//     align-items: flex-start;
//     justify-content: space-between;
//     z-index: 4;
//     pointer-events: none;
//   }

//   .pro-type-chip {
//     display: inline-flex;
//     align-items: center;
//     gap: 6px;
//     padding: 6px 12px 6px 8px;
//     border-radius: 9999px;
//     font-size: 11px;
//     font-weight: 700;
//     letter-spacing: 0.02em;
//     color: white;
//     backdrop-filter: blur(6px);
//     box-shadow: 0 4px 14px rgba(0,0,0,0.18);
//   }

//   .pro-type-chip.coworking { background: linear-gradient(135deg, #2563eb, #1d4ed8); }
//   .pro-type-chip.medical { background: linear-gradient(135deg, #dc2626, #b91c1c); }

//   .pro-type-chip .chip-icon-wrap {
//     width: 18px;
//     height: 18px;
//     border-radius: 50%;
//     background: rgba(255,255,255,0.25);
//     display: flex;
//     align-items: center;
//     justify-content: center;
//   }

//   .pro-avail-chip {
//     display: inline-flex;
//     align-items: center;
//     gap: 6px;
//     padding: 5px 10px;
//     border-radius: 9999px;
//     font-size: 10px;
//     font-weight: 700;
//     text-transform: uppercase;
//     letter-spacing: 0.04em;
//     color: #065f46;
//     background: rgba(255,255,255,0.92);
//     backdrop-filter: blur(6px);
//     box-shadow: 0 4px 14px rgba(0,0,0,0.12);
//   }

//   .pro-avail-dot {
//     width: 6px;
//     height: 6px;
//     border-radius: 50%;
//     background: #10b981;
//     animation: dot-pulse 1.8s infinite;
//   }

//   .pro-price-float {
//     position: absolute;
//     bottom: 12px;
//     right: 12px;
//     z-index: 4;
//     background: rgba(10, 22, 40, 0.72);
//     backdrop-filter: blur(10px);
//     -webkit-backdrop-filter: blur(10px);
//     border: 1px solid rgba(255,255,255,0.15);
//     border-radius: 14px;
//     padding: 7px 14px;
//     text-align: right;
//     pointer-events: none;
//   }

//   .pro-price-float .amt {
//     color: white;
//     font-size: 1.05rem;
//     font-weight: 800;
//     line-height: 1;
//   }

//   .pro-price-float .per {
//     color: rgba(255,255,255,0.65);
//     font-size: 9px;
//     text-transform: uppercase;
//     letter-spacing: 0.06em;
//     font-weight: 600;
//   }

//   .pro-quickview-btn {
//     position: absolute;
//     bottom: 12px;
//     left: 12px;
//     z-index: 4;
//     width: 36px;
//     height: 36px;
//     border-radius: 50%;
//     background: rgba(255,255,255,0.9);
//     backdrop-filter: blur(6px);
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     border: none;
//     cursor: pointer;
//     opacity: 0;
//     transform: translateY(6px);
//     transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
//     box-shadow: 0 4px 14px rgba(0,0,0,0.18);
//   }

//   .pro-cabin-card:hover .pro-quickview-btn {
//     opacity: 1;
//     transform: translateY(0);
//   }

//   .pro-card-body {
//     padding: 20px 20px 18px;
//     display: flex;
//     flex-direction: column;
//     flex: 1;
//   }

//   .pro-card-body .pro-title-row {
//     display: flex;
//     align-items: flex-start;
//     justify-content: space-between;
//     gap: 10px;
//     margin-bottom: 4px;
//   }

//   .pro-card-body h3 {
//     font-size: 1.08rem;
//     font-weight: 800;
//     color: #0f172a;
//     letter-spacing: -0.01em;
//     line-height: 1.25;
//   }

//   .pro-rating {
//     flex-shrink: 0;
//     display: inline-flex;
//     align-items: center;
//     gap: 3px;
//     font-size: 0.78rem;
//     font-weight: 700;
//     color: #0f172a;
//     background: #fef3c7;
//     border-radius: 8px;
//     padding: 3px 7px;
//   }

//   .pro-rating svg { fill: #f59e0b; color: #f59e0b; }

//   .pro-loc-row {
//     display: flex;
//     align-items: center;
//     gap: 5px;
//     font-size: 0.8rem;
//     color: #64748b;
//     margin-bottom: 12px;
//   }

//   .pro-amenity-row {
//     display: flex;
//     flex-wrap: wrap;
//     gap: 8px;
//     margin-bottom: 16px;
//   }

//   .pro-amenity-chip {
//     display: inline-flex;
//     align-items: center;
//     gap: 5px;
//     padding: 5px 9px;
//     border-radius: 9px;
//     background: #f8fafc;
//     border: 1px solid #eef2f7;
//     font-size: 0.72rem;
//     font-weight: 600;
//     color: #475569;
//   }

//   .pro-cabin-coworking .pro-amenity-chip svg { color: #2563eb; }
//   .pro-cabin-medical .pro-amenity-chip svg { color: #dc2626; }

//   .pro-card-footer {
//     margin-top: auto;
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
//     padding-top: 14px;
//     border-top: 1px dashed #e2e8f0;
//   }

//   .pro-footer-price .amount {
//     font-size: 1.35rem;
//     font-weight: 800;
//     color: #0f172a;
//     letter-spacing: -0.02em;
//   }

//   .pro-footer-price .unit {
//     font-size: 0.7rem;
//     color: #94a3b8;
//     font-weight: 600;
//   }

//   .pro-cta-btn {
//     display: inline-flex;
//     align-items: center;
//     gap: 6px;
//     padding: 10px 16px;
//     border-radius: 12px;
//     border: none;
//     font-size: 0.82rem;
//     font-weight: 700;
//     color: white;
//     cursor: pointer;
//     transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
//   }

//   .pro-cabin-coworking .pro-cta-btn { background: linear-gradient(135deg, #2563eb, #1d4ed8); box-shadow: 0 6px 16px rgba(37, 99, 235, 0.28); }
//   .pro-cabin-medical .pro-cta-btn { background: linear-gradient(135deg, #dc2626, #b91c1c); box-shadow: 0 6px 16px rgba(220, 38, 38, 0.28); }

//   .pro-cta-btn:hover { transform: translateX(2px) scale(1.04); }
//   .pro-cta-btn svg { transition: transform 0.3s; }
//   .pro-cta-btn:hover svg { transform: translateX(3px); }

//   .pro-section-toolbar {
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     gap: 18px;
//     flex-wrap: wrap;
//     margin-top: -4px;
//     margin-bottom: 36px;
//   }

//   .pro-stat-pill {
//     display: inline-flex;
//     align-items: center;
//     gap: 7px;
//     padding: 8px 16px;
//     border-radius: 9999px;
//     background: white;
//     border: 1px solid #e2e8f0;
//     font-size: 0.78rem;
//     font-weight: 700;
//     color: #334155;
//     box-shadow: 0 2px 6px rgba(15,23,42,0.04);
//   }

//   .pro-stat-pill.coworking svg { color: #2563eb; }
//   .pro-stat-pill.medical svg { color: #dc2626; }

//   @media (max-width: 640px) {
//     .pro-card-media { height: 180px; }
//     .pro-card-body { padding: 16px 16px 14px; }
//     .pro-card-body h3 { font-size: 1rem; }
//     .pro-footer-price .amount { font-size: 1.15rem; }
//   }

//   /* Doctor Page Specific Styles */
//   .doctor-hero-section {
//     position: relative;
//     min-height: 100vh;
//     display: flex;
//     align-items: center;
//     padding: 80px 24px 60px;
//     overflow: hidden;
//     background: linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 50%, #ede9fe 100%);
//   }

//   .doctor-hero-content {
//     position: relative;
//     z-index: 10;
//     width: 100%;
//     max-width: 1200px;
//     margin: 0 auto;
//   }

//   .doctor-hero-text-box {
//     max-width: 650px;
//     margin-left: 0;
//     margin-right: auto;
//   }

//   .doctor-hero-badge {
//     display: inline-flex;
//     align-items: center;
//     gap: 8px;
//     padding: 8px 20px;
//     background: rgba(255, 255, 255, 0.9);
//     backdrop-filter: blur(8px);
//     border: 1px solid rgba(99, 102, 241, 0.2);
//     border-radius: 9999px;
//     font-size: 13px;
//     font-weight: 600;
//     color: #4f46e5;
//     margin-bottom: 20px;
//     box-shadow: 0 4px 12px rgba(79, 70, 229, 0.1);
//   }

//   .doctor-hero-title {
//     font-size: 3.2rem !important;
//     font-weight: 300 !important;
//     line-height: 1.15 !important;
//     color: #0f172a !important;
//     margin-bottom: 8px;
//   }

//   .doctor-hero-title-gradient {
//     background: linear-gradient(135deg, #4f46e5, #7c3aed, #2563eb);
//     background-size: 200% 200%;
//     -webkit-background-clip: text;
//     -webkit-text-fill-color: transparent;
//     background-clip: text;
//     font-weight: 800 !important;
//     animation: gradient 3s ease infinite;
//   }

//   .doctor-hero-subtitle {
//     font-size: 1.8rem !important;
//     font-weight: 200 !important;
//     line-height: 1.3 !important;
//     color: #1e293b !important;
//   }

//   .doctor-hero-desc {
//     font-size: 1.05rem !important;
//     line-height: 1.7 !important;
//     color: #475569 !important;
//     max-width: 500px;
//     margin-top: 12px;
//     font-weight: 300;
//   }

//   .doctor-stats {
//     display: grid;
//     grid-template-columns: repeat(3, 1fr);
//     gap: 20px;
//     margin-top: 30px;
//     background: rgba(255,255,255,0.8);
//     backdrop-filter: blur(8px);
//     border-radius: 20px;
//     padding: 24px 28px;
//     border: 1px solid rgba(255,255,255,0.3);
//   }

//   .doctor-stat-item {
//     text-align: center;
//   }

//   .doctor-stat-item .number {
//     font-size: 2rem;
//     font-weight: 800;
//     color: #4f46e5;
//   }

//   .doctor-stat-item .label {
//     font-size: 0.75rem;
//     font-weight: 600;
//     color: #64748b;
//     text-transform: uppercase;
//     letter-spacing: 0.06em;
//     margin-top: 2px;
//   }

//   .doctor-features-grid {
//     display: grid;
//     grid-template-columns: repeat(4, 1fr);
//     gap: 24px;
//     margin-top: 40px;
//   }

//   .doctor-feature-card {
//     background: rgba(255,255,255,0.85);
//     backdrop-filter: blur(8px);
//     border: 1px solid rgba(255,255,255,0.3);
//     border-radius: 20px;
//     padding: 28px 20px;
//     text-align: center;
//     transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
//     box-shadow: 0 4px 20px rgba(0,0,0,0.04);
//   }

//   .doctor-feature-card:hover {
//     transform: translateY(-8px);
//     box-shadow: 0 20px 60px rgba(79, 70, 229, 0.15);
//     border-color: rgba(79, 70, 229, 0.2);
//   }

//   .doctor-feature-card .icon-wrap {
//     width: 56px;
//     height: 56px;
//     border-radius: 16px;
//     background: linear-gradient(135deg, #eef2ff, #e0e7ff);
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     margin: 0 auto 14px;
//     color: #4f46e5;
//     font-size: 24px;
//   }

//   .doctor-feature-card h4 {
//     font-size: 0.95rem;
//     font-weight: 700;
//     color: #0f172a;
//     margin-bottom: 4px;
//   }

//   .doctor-feature-card p {
//     font-size: 0.8rem;
//     color: #64748b;
//     line-height: 1.5;
//   }

//   .doctor-cta-section {
//     background: linear-gradient(135deg, #4f46e5, #7c3aed);
//     border-radius: 24px;
//     padding: 48px 40px;
//     margin-top: 60px;
//     text-align: center;
//     color: white;
//     position: relative;
//     overflow: hidden;
//   }

//   .doctor-cta-section::before {
//     content: '';
//     position: absolute;
//     top: -50%;
//     right: -20%;
//     width: 60%;
//     height: 200%;
//     background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
//     pointer-events: none;
//   }

//   .doctor-cta-section h2 {
//     font-size: 2.2rem;
//     font-weight: 700;
//     margin-bottom: 8px;
//     position: relative;
//   }

//   .doctor-cta-section p {
//     font-size: 1rem;
//     opacity: 0.9;
//     max-width: 500px;
//     margin: 0 auto 24px;
//     position: relative;
//   }

//   .doctor-cta-btn {
//     display: inline-flex;
//     align-items: center;
//     gap: 10px;
//     padding: 14px 36px;
//     background: white;
//     color: #4f46e5;
//     border: none;
//     border-radius: 14px;
//     font-size: 1rem;
//     font-weight: 700;
//     cursor: pointer;
//     transition: all 0.3s;
//     position: relative;
//     box-shadow: 0 8px 30px rgba(0,0,0,0.15);
//   }

//   .doctor-cta-btn:hover {
//     transform: scale(1.05);
//     box-shadow: 0 12px 40px rgba(0,0,0,0.25);
//   }

//   @media (max-width: 768px) {
//     .doctor-stats {
//       grid-template-columns: 1fr 1fr 1fr;
//       padding: 16px;
//       gap: 12px;
//     }
//     .doctor-stat-item .number {
//       font-size: 1.4rem;
//     }
//     .doctor-features-grid {
//       grid-template-columns: 1fr 1fr;
//     }
//     .doctor-hero-title {
//       font-size: 2.2rem !important;
//     }
//     .doctor-hero-subtitle {
//       font-size: 1.2rem !important;
//     }
//     .doctor-cta-section {
//       padding: 32px 20px;
//     }
//     .doctor-cta-section h2 {
//       font-size: 1.6rem;
//     }
//   }

//   @media (max-width: 480px) {
//     .doctor-features-grid {
//       grid-template-columns: 1fr;
//     }
//     .doctor-stats {
//       grid-template-columns: 1fr;
//     }
//   }
// `;

// // ─── HOOKS ───
// const useScrollReveal = () => {
//   const [isVisible, setIsVisible] = useState(false);
//   const ref = useRef(null);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting && !isVisible) setIsVisible(true);
//       },
//       { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
//     );
//     if (ref.current) observer.observe(ref.current);
//     return () => { if (ref.current) observer.unobserve(ref.current); };
//   }, [isVisible]);

//   return { ref, isVisible };
// };

// const RevealSection = ({ children, delay = 0, className = "" }) => {
//   const { ref, isVisible } = useScrollReveal();
//   return (
//     <div ref={ref} className={`reveal ${isVisible ? 'visible' : ''} ${className}`} style={{ transitionDelay: `${delay}s` }}>
//       {children}
//     </div>
//   );
// };

// // ─── THEME ───
// const ThemeContext = createContext();

// const ThemeProvider = ({ children }) => {
//   const [theme, setTheme] = useState("light");

//   useEffect(() => {
//     document.documentElement.className = "light";
//   }, []);

//   const toggleTheme = () => {};

//   return <ThemeContext.Provider value={{ theme: "light", toggleTheme }}>{children}</ThemeContext.Provider>;
// };

// const useTheme = () => useContext(ThemeContext);

// // ─── TYPING ───
// const TypingText = ({ words, speed = 130, pause = 2000 }) => {
//   const [currentWordIndex, setCurrentWordIndex] = useState(0);
//   const [currentText, setCurrentText] = useState("");
//   const [isDeleting, setIsDeleting] = useState(false);
//   const [isPaused, setIsPaused] = useState(false);

//   useEffect(() => {
//     const word = words[currentWordIndex];
//     if (isPaused) {
//       const timeout = setTimeout(() => { setIsPaused(false); setIsDeleting(true); }, pause);
//       return () => clearTimeout(timeout);
//     }
//     const timeout = setTimeout(() => {
//       if (!isDeleting) {
//         setCurrentText(word.substring(0, currentText.length + 1));
//         if (currentText.length + 1 === word.length) setIsPaused(true);
//       } else {
//         setCurrentText(word.substring(0, currentText.length - 1));
//         if (currentText.length === 0) {
//           setIsDeleting(false);
//           setCurrentWordIndex((prev) => (prev + 1) % words.length);
//         }
//       }
//     }, isDeleting ? speed / 2 : speed);
//     return () => clearTimeout(timeout);
//   }, [currentText, isDeleting, isPaused, currentWordIndex, words, speed, pause]);

//   return <span className="typing-text">{currentText}</span>;
// };

// // ─── COUNTER ───
// const Counter = ({ target, suffix = "", duration = 2000 }) => {
//   const [count, setCount] = useState(0);
//   const [isVisible, setIsVisible] = useState(false);
//   const ref = useRef(null);

//   useEffect(() => {
//     const observer = new IntersectionObserver(([entry]) => {
//       if (entry.isIntersecting && !isVisible) setIsVisible(true);
//     }, { threshold: 0.3 });
//     if (ref.current) observer.observe(ref.current);
//     return () => { if (ref.current) observer.unobserve(ref.current); };
//   }, [isVisible]);

//   useEffect(() => {
//     if (!isVisible) return;
//     let startTime;
//     const update = (timestamp) => {
//       if (!startTime) startTime = timestamp;
//       const progress = Math.min((timestamp - startTime) / duration, 1);
//       const eased = 1 - Math.pow(1 - progress, 3);
//       setCount(Math.floor(eased * target));
//       if (progress < 1) requestAnimationFrame(update);
//     };
//     requestAnimationFrame(update);
//   }, [isVisible, target, duration]);

//   return <span ref={ref}>{count}{suffix}</span>;
// };

// // ─── IMAGE SLIDER COMPONENT ───
// const ImageSlider = ({ images, alt, className = "" }) => {
//   const [currentIndex, setCurrentIndex] = useState(0);

//   if (!images || images.length === 0) return null;

//   const nextSlide = (e) => {
//     e.stopPropagation();
//     setCurrentIndex((prev) => (prev + 1) % images.length);
//   };

//   const prevSlide = (e) => {
//     e.stopPropagation();
//     setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
//   };

//   const goToSlide = (index, e) => {
//     if (e) e.stopPropagation();
//     setCurrentIndex(index);
//   };

//   return (
//     <div className={`card-image-slider ${className}`}>
//       <img 
//         src={images[currentIndex]} 
//         alt={alt || "Space image"} 
//         loading="lazy"
//       />
//       {images.length > 1 && (
//         <>
//           <button 
//             className="card-slider-btn prev" 
//             onClick={prevSlide}
//             aria-label="Previous image"
//           >
//             <ChevronLeft size={14} />
//           </button>
//           <button 
//             className="card-slider-btn next" 
//             onClick={nextSlide}
//             aria-label="Next image"
//           >
//             <ChevronRight size={14} />
//           </button>
//           <div className="card-dots">
//             {images.map((_, index) => (
//               <button
//                 key={index}
//                 className={`dot ${index === currentIndex ? 'active' : ''}`}
//                 onClick={(e) => goToSlide(index, e)}
//                 aria-label={`Go to image ${index + 1}`}
//               />
//             ))}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// // ─── CATEGORY DIVIDER COMPONENT ───
// const CategoryDivider = ({ leftLabel, rightLabel, leftIcon: LeftIcon, rightIcon: RightIcon, leftCount, rightCount }) => {
//   return (
//     <div className="category-divider animate-slide-up-fade">
//       <div className="divider-line"></div>
      
//       <div className="flex items-center gap-3">
//         <div className="divider-icon coworking">
//           <LeftIcon size={22} />
//         </div>
//         <div>
//           <span className="category-label">
//             <span className="label-dot blue"></span>
//             {leftLabel}
//           </span>
//           {leftCount !== undefined && (
//             <span className="category-count">{leftCount} spaces</span>
//           )}
//         </div>
//       </div>

//       <div className="divider-arrow">
//         <ArrowRight size={18} />
//       </div>

//       <div className="flex items-center gap-3">
//         <div>
//           <span className="category-label">
//             <span className="label-dot red"></span>
//             {rightLabel}
//           </span>
//           {rightCount !== undefined && (
//             <span className="category-count">{rightCount} chambers</span>
//           )}
//         </div>
//         <div className="divider-icon medical">
//           <RightIcon size={22} />
//         </div>
//       </div>

//       <div className="divider-line"></div>
//     </div>
//   );
// };

// // ─── AMENITY ICON HELPER (used by pro cabin card) ───
// const AMENITY_ICON_MAP = {
//   wifi: WifiIcon,
//   parking: ParkingCircle,
//   lockers: Lock,
//   comfortSeating: Sofa,
//   privateWashroom: Bath,
//   secureAccess: Shield,
//   coffee: Coffee,
//   gym: Dumbbell,
//   ac: Fan,
//   tv: Tv,
//   printer: Printer,
//   phone: Phone
// };

// const AMENITY_LABEL_MAP = {
//   wifi: "WiFi",
//   parking: "Parking",
//   lockers: "Lockers",
//   comfortSeating: "Seating",
//   privateWashroom: "Washroom",
//   secureAccess: "Secure",
//   coffee: "Coffee",
//   gym: "Gym",
//   ac: "AC",
//   tv: "TV",
//   printer: "Printer",
//   phone: "Phone"
// };

// const getTopAmenities = (cabin, max = 3) => {
//   const amenities = cabin?.amenities || {};
//   const keys = Object.keys(amenities).filter((k) => amenities[k] && AMENITY_ICON_MAP[k]);
//   if (keys.length === 0) {
//     return ["wifi", "secureAccess", "ac"];
//   }
//   return keys.slice(0, max);
// };

// // A lightweight deterministic "rating" derived from the cabin id/name so it
// // stays stable across re-renders instead of jumping around randomly.
// const getDeterministicRating = (seed = "") => {
//   let hash = 0;
//   for (let i = 0; i < seed.length; i++) {
//     hash = (hash * 31 + seed.charCodeAt(i)) % 997;
//   }
//   const rating = 4.3 + (hash % 7) / 10; // 4.3 - 4.9
//   return rating.toFixed(1);
// };

// // ─── PRO CABIN CARD — shared premium card for Co-working + Medical ───
// const ProCabinCard = ({ cabin, variant, onCardClick, onCtaClick, index = 0 }) => {
//   const isMedical = variant === "medical";
//   const fallbackImages = isMedical ? DOCTOR_SPACE_IMAGES : IRYAX_SPACE_IMAGES;

//   const cabinImages = cabin.images && cabin.images.length > 0
//     ? cabin.images.map((img) => `https://spaceapi.iryax.com/${img}`)
//     : [fallbackImages[index % fallbackImages.length]];

//   const topAmenities = getTopAmenities(cabin, 3);
//   const rating = getDeterministicRating(cabin._id || cabin.name || `${index}`);
//   const TypeIcon = isMedical ? StethoscopeIcon : Building2;

//   return (
//     <div
//       className={`pro-cabin-card ${isMedical ? "pro-cabin-medical" : "pro-cabin-coworking"}`}
//       onClick={() => onCardClick(cabin)}
//     >
//       <div className="pro-card-media">
//         <ImageSlider images={cabinImages} alt={cabin.name} />
//         <div className="pro-media-gradient" />

//         <div className="pro-badge-row">
//           <span className={`pro-type-chip ${isMedical ? "medical" : "coworking"}`}>
//             <span className="chip-icon-wrap"><TypeIcon size={11} /></span>
//             {isMedical ? "Medical Chamber" : "Co-Working"}
//           </span>
//           <span className="pro-avail-chip">
//             <span className="pro-avail-dot" />
//             Available
//           </span>
//         </div>

//         <button
//           className="pro-quickview-btn"
//           onClick={(e) => { e.stopPropagation(); onCardClick(cabin); }}
//           aria-label="Quick view"
//         >
//           <Maximize2 size={15} color={isMedical ? "#dc2626" : "#2563eb"} />
//         </button>

//         <div className="pro-price-float">
//           <div className="amt">₹{cabin.price?.toLocaleString("en-IN") || 0}</div>
//           <div className="per">per day</div>
//         </div>
//       </div>

//       <div className="pro-card-body">
//         <div className="pro-title-row">
//           <h3 className="line-clamp-2">{cabin.name}</h3>
//           <span className="pro-rating">
//             <StarIcon size={12} /> {rating}
//           </span>
//         </div>

//         <div className="pro-loc-row">
//           <MapPin size={13} color={isMedical ? "#dc2626" : "#2563eb"} />
//           <span className="line-clamp-1">{cabin.address || "Location not specified"}</span>
//         </div>

//         <div className="pro-amenity-row">
//           {topAmenities.map((key) => {
//             const Icon = AMENITY_ICON_MAP[key] || BadgeCheck;
//             return (
//               <span key={key} className="pro-amenity-chip">
//                 <Icon size={12} /> {AMENITY_LABEL_MAP[key] || key}
//               </span>
//             );
//           })}
//         </div>

//         <div className="pro-card-footer">
//           <div className="pro-footer-price">
//             <div className="amount">₹{cabin.price?.toLocaleString("en-IN") || 0}</div>
//             <div className="unit">per day</div>
//           </div>
//           <button
//             className="pro-cta-btn"
//             onClick={(e) => { e.stopPropagation(); onCtaClick(cabin); }}
//           >
//             View Details <ArrowRight size={14} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ─── SPACE DETAIL MODAL ───
// const SpaceDetailModal = ({ isOpen, onClose, space, onBookClick }) => {
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);

//   if (!isOpen || !space) return null;

//   const images = space.images || [space.image];
//   const imageUrls = images.map(img => 
//     img && img.startsWith('http') ? img : `https://spaceapi.iryax.com/${img}`
//   );

//   const nextImage = (e) => {
//     if (e) e.stopPropagation();
//     setCurrentImageIndex((prev) => (prev + 1) % imageUrls.length);
//   };

//   const prevImage = (e) => {
//     if (e) e.stopPropagation();
//     setCurrentImageIndex((prev) => (prev - 1 + imageUrls.length) % imageUrls.length);
//   };

//   const goToImage = (index, e) => {
//     if (e) e.stopPropagation();
//     setCurrentImageIndex(index);
//   };

//   const getFeatures = (space) => {
//     const features = [];
//     const amenities = space.amenities || {};
    
//     if (amenities.wifi) features.push({ icon: WifiIcon, label: "High-Speed WiFi" });
//     if (amenities.parking) features.push({ icon: ParkingCircle, label: "Parking" });
//     if (amenities.lockers) features.push({ icon: Lock, label: "Lockers" });
//     if (amenities.comfortSeating) features.push({ icon: Sofa, label: "Comfort Seating" });
//     if (amenities.privateWashroom) features.push({ icon: Bath, label: "Private Washroom" });
//     if (amenities.secureAccess) features.push({ icon: Shield, label: "Secure Access" });
//     if (amenities.coffee) features.push({ icon: Coffee, label: "Coffee" });
//     if (amenities.gym) features.push({ icon: Dumbbell, label: "Gym" });
//     if (amenities.ac) features.push({ icon: Fan, label: "AC" });
//     if (amenities.tv) features.push({ icon: Tv, label: "TV" });
//     if (amenities.printer) features.push({ icon: Printer, label: "Printer" });
//     if (amenities.phone) features.push({ icon: Phone, label: "Phone" });
    
//     return features;
//   };

//   const features = getFeatures(space);
//   const thumbnails = imageUrls.slice(0, 5);

//   const isMedical = space.type === "medical";

//   return (
//     <div className="modal-overlay" onClick={onClose}>
//       <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//         <button className="modal-close" onClick={onClose}>
//           <X size={18} />
//         </button>

//         <div className="space-detail-modal">
//           <div className="modal-body">
//             <div className="modal-image-section">
//               <div className="image-slider">
//                 <img 
//                   src={imageUrls[currentImageIndex] || IRYAX_SPACE_IMAGES[0]} 
//                   alt={space.name}
//                   className="slider-image"
//                 />
//                 {imageUrls.length > 1 && (
//                   <>
//                     <button 
//                       className="slider-btn prev" 
//                       onClick={prevImage}
//                       aria-label="Previous image"
//                     >
//                       <ChevronLeft size={20} />
//                     </button>
//                     <button 
//                       className="slider-btn next" 
//                       onClick={nextImage}
//                       aria-label="Next image"
//                     >
//                       <ChevronRight size={20} />
//                     </button>
//                     <div className="image-dots">
//                       {imageUrls.map((_, index) => (
//                         <button
//                           key={index}
//                           className={`dot ${index === currentImageIndex ? 'active' : ''}`}
//                           onClick={(e) => goToImage(index, e)}
//                           aria-label={`Go to image ${index + 1}`}
//                         />
//                       ))}
//                     </div>
//                     <span className="image-counter">{currentImageIndex + 1} / {imageUrls.length}</span>
                    
//                     {imageUrls.length > 1 && (
//                       <div className="thumbnail-strip">
//                         {thumbnails.map((url, index) => (
//                           <div 
//                             key={index}
//                             className={`thumb ${index === currentImageIndex ? 'active' : ''}`}
//                             onClick={(e) => goToImage(index, e)}
//                           >
//                             <img src={url} alt={`Thumbnail ${index + 1}`} />
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </>
//                 )}
//               </div>
//               <span className={`space-type-badge ${isMedical ? 'bg-red-600' : 'bg-blue-600'}`}>
//                 {isMedical ? '🏥 Medical Chamber' : '💼 Co-Working'}
//               </span>
//             </div>

//             <div className="modal-content-section">
//               <h3 className="space-title">{space.name}</h3>
//               <div className="space-location">
//                 <MapPin size={16} /> 
//                 <span>{space.address || "Location not specified"}</span>
//               </div>
//               <p className="space-description">
//                 {space.description || (isMedical 
//                   ? "A fully-equipped medical consultation chamber designed for healthcare professionals." 
//                   : "A fully-equipped modern workspace designed for professionals.")}
//               </p>
              
//               <div className="space-features">
//                 {features.map((feature, i) => (
//                   <div key={i} className="feature-item">
//                     <feature.icon size={16} />
//                     <span>{feature.label}</span>
//                   </div>
//                 ))}
//                 {features.length === 0 && (
//                   <>
//                     <div className="feature-item"><WifiIcon size={16} /> High-Speed WiFi</div>
//                     <div className="feature-item"><ParkingCircle size={16} /> Parking</div>
//                     <div className="feature-item"><Lock size={16} /> Lockers</div>
//                     <div className="feature-item"><Sofa size={16} /> Comfort Seating</div>
//                   </>
//                 )}
//               </div>

//               <div className="space-price">
//                 <span className="amount">₹{space.price?.toLocaleString('en-IN') || 0}</span>
//                 <span className="period">/ day</span>
//               </div>

//               <button 
//                 className="btn-book-now-modal"
//                 onClick={() => onBookClick(space)}
//               >
//                 Book Now <ArrowRight size={18} />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ─── DOCTOR CHAMBER PAGE ───
// const DoctorChamberPage = () => {
//   const navigate = useNavigate();
//   const [scrolled, setScrolled] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => setScrolled(window.scrollY > 50);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   return (
//     <div className="min-h-screen bg-white text-gray-900 font-light antialiased">
//       {/* Navbar for Doctor Page */}
//       <nav className={`navbar-custom ${scrolled ? 'navbar-scrolled' : ''}`}>
//         <div className="navbar-inner">
//           <button onClick={() => navigate('/')} className="flex items-center gap-3 group">
//             <div className="navbar-logo">
//               <img src={logo} alt="Logo" />
//             </div>
//             <span className="navbar-brand hidden sm:block transition flex items-center gap-2">
//               IRYAX SPACE
//               <span className="brand-icon flex items-center justify-center">
//                 <Layout size={18} />
//               </span>
//             </span>
//           </button>

//           <div className="nav-links">
//             <button onClick={() => navigate('/')} className="navbar-link">Home</button>
//             <button onClick={() => navigate('/#benefits')} className="navbar-link">Benefits</button>
//             <button onClick={() => navigate('/#faq')} className="navbar-link">FAQ</button>
//             <button onClick={() => navigate('/#contact')} className="navbar-link">Contact</button>
//           </div>

//           <div className="flex items-center gap-2">
//             <button onClick={() => navigate("/login")} className="navbar-signin hidden sm:block">
//               Sign In
//             </button>
//             <button onClick={() => navigate("/login")} className="navbar-btn navbar-btn-mobile-hide">
//               <Layout size={14} /> Start Now
//             </button>
//             <button 
//               onClick={() => navigate('/')} 
//               className="navbar-menu-btn"
//               aria-label="Go back"
//             >
//               <X size={22} />
//             </button>
//           </div>
//         </div>
//       </nav>

//       {/* Doctor Hero Section */}
//       <section className="doctor-hero-section">
//         <div className="absolute inset-0 z-0 overflow-hidden">
//           <img 
//             src={DOCTOR_HERO_IMAGE} 
//             alt="Doctor Chamber" 
//             className="w-full h-full object-cover opacity-10"
//           />
//           <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/50 to-transparent" />
//         </div>
//         <div className="doctor-hero-content">
//           <div className="doctor-hero-text-box">
//             <RevealSection>
//               <div className="doctor-hero-badge">
//                 <StethoscopeIcon size={14} className="animate-heartbeat" />
//                 <span>Doctor's Chamber</span>
//               </div>
//             </RevealSection>

//             <RevealSection delay={0.1}>
//               <h1 className="doctor-hero-title">
//                 <span className="doctor-hero-title-gradient">Professional</span>
//                 <br />
//                 <span className="doctor-hero-subtitle">Doctor's Chamber</span>
//               </h1>
//             </RevealSection>

//             <RevealSection delay={0.2}>
//               <p className="doctor-hero-desc">
//                 Fully-equipped consultation rooms with premium amenities, flexible hours, and complete admin support for healthcare professionals.
//               </p>
//             </RevealSection>

//             <RevealSection delay={0.3}>
//               <div className="doctor-stats">
//                 <div className="doctor-stat-item">
//                   <div className="number">50+</div>
//                   <div className="label">Chambers</div>
//                 </div>
//                 <div className="doctor-stat-item">
//                   <div className="number">24/7</div>
//                   <div className="label">Access</div>
//                 </div>
//                 <div className="doctor-stat-item">
//                   <div className="number">100+</div>
//                   <div className="label">Happy Doctors</div>
//                 </div>
//               </div>
//             </RevealSection>

//             <RevealSection delay={0.4}>
//               <div className="hero-buttons mt-6">
//                 <button onClick={() => navigate("/login")} className="btn-primary">
//                   <StethoscopeIcon size={16} />
//                   Book Your Chamber
//                   <ArrowRight size={16} className="group-hover:translate-x-1 transition" />
//                 </button>
//                 <button onClick={() => navigate('/#contact')} className="btn-secondary" style={{ textDecoration: 'none', color: '#0f172a', background: 'rgba(255,255,255,0.8)' }}>
//                   <Phone size={16} /> Contact Us
//                 </button>
//               </div>
//             </RevealSection>
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section className="py-20 px-6 bg-white">
//         <div className="max-w-6xl mx-auto">
//           <div className="text-center mb-14">
//             <RevealSection>
//               <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs rounded-full mb-4 tracking-widest uppercase font-medium">
//                 <SparklesIcon size={12} /> Why Doctor's Chamber
//               </span>
//             </RevealSection>
//             <RevealSection delay={0.1}>
//               <h2 className="text-3xl sm:text-4xl font-light text-gray-900">
//                 Everything You Need to <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent font-bold">Practice with Ease</span>
//               </h2>
//             </RevealSection>
//             <RevealSection delay={0.2}>
//               <p className="mt-3 text-base text-gray-600 max-w-2xl mx-auto">
//                 Modern consultation rooms designed for healthcare professionals to deliver the best care.
//               </p>
//             </RevealSection>
//           </div>

//           <div className="doctor-features-grid">
//             {[
//               { icon: StethoscopeIcon, title: "Medical Equipment", desc: "State-of-the-art medical tools and equipment" },
//               { icon: UserCheck, title: "Admin Support", desc: "Reception, billing, and patient management" },
//               { icon: ClockIcon, title: "Flexible Hours", desc: "24/7 access with flexible scheduling" },
//               { icon: AwardIcon, title: "Premium Location", desc: "High-visibility prime medical locations" }
//             ].map((feature, i) => (
//               <RevealSection key={i} delay={i * 0.1}>
//                 <div className="doctor-feature-card">
//                   <div className="icon-wrap"><feature.icon size={24} /></div>
//                   <h4>{feature.title}</h4>
//                   <p>{feature.desc}</p>
//                 </div>
//               </RevealSection>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="py-20 px-6 bg-gray-50">
//         <div className="max-w-6xl mx-auto">
//           <RevealSection>
//             <div className="doctor-cta-section">
//               <h2>Start Your Practice Today</h2>
//               <p>Join 100+ healthcare professionals who've transformed their practice with IRYAX SPACE</p>
//               <button onClick={() => navigate("/login")} className="doctor-cta-btn">
//                 Get Started Now <ArrowRight size={18} />
//               </button>
//             </div>
//           </RevealSection>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="py-12 px-6 border-t border-gray-200 bg-gray-900 text-white">
//         <div className="max-w-6xl mx-auto text-center">
//           <p className="text-sm text-gray-400">
//             © IRYAX SPACE All Rights Reserved. | Made with 
//             <span className="footer-heart mx-1">❤️</span> 
//             by IRYAX
//           </p>
//           <p className="text-xs text-gray-500 tracking-wider uppercase mt-2">Doctor's Chamber - IRYAX SPACE</p>
//         </div>
//       </footer>
//     </div>
//   );
// };

// // ─── MAIN ───
// const PromotionalPage = () => {
//   const { theme, toggleTheme } = useTheme();
//   const navigate = useNavigate();
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);
//   const [openFaq, setOpenFaq] = useState(null);
//   const [formData, setFormData] = useState({ name: "", email: "", phone: "", address: "", message: "" });
//   const [formSubmitted, setFormSubmitted] = useState(false);
//   const [showThankYouPopup, setShowThankYouPopup] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitError, setSubmitError] = useState(null);
//   const [cabins, setCabins] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedSpace, setSelectedSpace] = useState(null);
//   const [isSpaceDetailOpen, setIsSpaceDetailOpen] = useState(false);

//   const typingWords = ["Workspace", "Studio", "Office", "Creative Space"];

//   useEffect(() => {
//     const fetchCabins = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch("https://spaceapi.iryax.com/api/cabins");
//         if (!response.ok) throw new Error("Failed to fetch");
//         const data = await response.json();
//         setCabins(Array.isArray(data) ? data : []);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchCabins();
//   }, []);

//   useEffect(() => {
//     const handleScroll = () => setScrolled(window.scrollY > 50);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
//   const toggleFaq = (index) => setOpenFaq(openFaq === index ? null : index);

//   const coworkingCabins = cabins.filter(cabin => cabin.type === "coworking" || cabin.type === "co-working");
//   const medicalCabins = cabins.filter(cabin => cabin.type === "medical");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitError(null);
    
//     if (!formData.name || !formData.email || !formData.phone || !formData.message) {
//       setSubmitError("Please fill in all required fields");
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const response = await fetch("https://spaceapi.iryax.com/api/cabins/sendquery", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           name: formData.name,
//           email: formData.email,
//           phone: formData.phone,
//           address: formData.address || "",
//           message: formData.message
//         }),
//       });

//       const data = await response.json();

//       if (response.ok && data.success) {
//         setFormSubmitted(true);
//         setShowThankYouPopup(true);
//         setFormData({ name: "", email: "", phone: "", address: "", message: "" });
//         setTimeout(() => {
//           setShowThankYouPopup(false);
//           setFormSubmitted(false);
//         }, 5000);
//       } else {
//         setSubmitError(data.message || "Failed to submit query. Please try again.");
//       }
//     } catch (err) {
//       console.error("Submit query error:", err);
//       setSubmitError("Network error. Please check your connection and try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleBookClick = (space) => {
//     navigate("/login");
//   };

//   const handleSpaceClick = (space) => {
//     const images = space.images && space.images.length > 0 
//       ? space.images.map(img => `https://spaceapi.iryax.com/${img}`)
//       : [IRYAX_SPACE_IMAGES[0]];
    
//     const formattedSpace = {
//       ...space,
//       images: images,
//       image: images[0]
//     };
//     setSelectedSpace(formattedSpace);
//     setIsSpaceDetailOpen(true);
//   };

//   const closeSpaceDetail = () => {
//     setIsSpaceDetailOpen(false);
//     setSelectedSpace(null);
//   };

//   const scrollToSection = (id) => {
//     const element = document.getElementById(id);
//     if (element) {
//       element.scrollIntoView({ behavior: 'smooth' });
//     }
//   };

//   const stats = [
//     { label: "Professionals Trust Us", value: 120, suffix: "+" },
//     { label: "Workspaces", value: cabins.length || 15, suffix: "+" },
//     { label: "Projects Done", value: 2500, suffix: "+" },
//     { label: "Specializations", value: 20, suffix: "+" },
//     { label: "Support Hours", value: 24, suffix: "/7" }
//   ];

//   const specialties = [
//     "Medical Practice", "Dental Clinic", "Physiotherapy", "Psychology",
//     "Cardiology", "Neurology", "Dermatology", "Orthopedic",
//     "Pediatrics", "Gynecology", "ENT Specialist", "Ophthalmology",
//     "General Medicine", "Radiology", "Pathology", "Dentistry"
//   ];

//   const specialtyIconMap = {
//     "Medical Practice": Stethoscope,
//     "Dental Clinic": Users,
//     "Physiotherapy": Activity,
//     "Psychology": Brain,
//     "Cardiology": HeartPulse,
//     "Neurology": Brain,
//     "Dermatology": EyeOff,
//     "Orthopedic": Bone,
//     "Pediatrics": UsersRound,
//     "Gynecology": Heart,
//     "ENT Specialist": Stethoscope,
//     "Ophthalmology": Eye,
//     "General Medicine": Stethoscope,
//     "Radiology": Microscope,
//     "Pathology": TestTube,
//     "Dentistry": Users,
//   };

//   const benefits = [
//     { icon: Shield, title: "No Long Leases", desc: "Avoid long-term commitments and heavy deposits.", glassClass: "glass-blue" },
//     { icon: Wallet, title: "Low Operational Costs", desc: "Pay only for what you use. No hidden charges.", glassClass: "glass-teal" },
//     { icon: Users, title: "Admin Hassle-Free", desc: "We manage staff, billing, and daily operations for you.", glassClass: "glass-purple" },
//     { icon: SparklesIcon, title: "Modern Infrastructure", desc: "Fully-equipped with state-of-the-art tools.", glassClass: "glass-rose" }
//   ];

//   const features = [
//     { icon: Rocket, title: "Quick Setup", desc: "Get started in 24 hours with fully-equipped spaces", number: "01", color: "bg-blue-500/20 text-blue-300" },
//     { icon: TrendingUp, title: "Grow Your Practice", desc: "Scale your practice without ownership hassles", number: "02", color: "bg-emerald-500/20 text-emerald-300" },
//     { icon: Award, title: "Premium Quality", desc: "High-end infrastructure at affordable rates", number: "03", color: "bg-purple-500/20 text-purple-300" },
//     { icon: Target, title: "Prime Locations", desc: "High-visibility spaces in premium areas", number: "04", color: "bg-rose-500/20 text-rose-300" }
//   ];

//   const locationList = [
//     { 
//       icon: Building2, 
//       title: "High-Visibility Locations", 
//       desc: "Premium workspaces in prime areas with high foot traffic."
//     },
//     { 
//       icon: Wallet, 
//       title: "Easy Start", 
//       desc: "Minimal investment required. Everything is set up for you."
//     },
//     { 
//       icon: ShieldCheck, 
//       title: "Zero Operational Stress", 
//       desc: "We handle staff, billing, and daily operations for you."
//     }
//   ];

//   const faqs = [
//     { category: "Workspaces", q: "What types of workspaces are available?", a: "We offer fully-equipped private offices, meeting rooms, and collaborative spaces." },
//     { category: "Flexibility", q: "Do I need to sign a long-term lease?", a: "No! Our model is completely flexible. You can book by hour, day, or month." },
//     { category: "Facilities", q: "What facilities are included?", a: "All spaces include high-speed WiFi, comfortable work areas, and 24/7 security." },
//     { category: "Payment", q: "What payment methods are accepted?", a: "We accept credit/debit cards, UPI, net banking, and offer flexible payment plans." },
//     { category: "Support", q: "What administrative support do you provide?", a: "We provide full administrative support including reception services and billing assistance." },
//     { category: "Earning", q: "How can I earn from my unused space?", a: "List your space on our platform and connect with trusted professionals." }
//   ];

//   const BrandWithIcon = () => (
//     <span className="navbar-brand hidden sm:block transition flex items-center gap-2">
//       IRYAX SPACE
//       <span className="brand-icon flex items-center justify-center">
//         <Layout size={18} />
//       </span>
//     </span>
//   );

//   const missionVisionData = [
//     {
//       title: "Our Mission",
//       icon: TargetIcon,
//       description: "To empower professionals by providing flexible, fully-equipped spaces that eliminate the barriers of high costs and long-term commitments, enabling them to focus entirely on their work.",
//       color: "from-blue-600 to-blue-800",
//       bgColor: "bg-blue-50",
//       borderColor: "border-blue-200"
//     },
//     {
//       title: "Our Vision",
//       icon: EyeIcon,
//       description: "To revolutionize the workspace landscape by creating a seamless ecosystem where every professional can access premium infrastructure without ownership burden, fostering innovation and excellence.",
//       color: "from-purple-600 to-indigo-800",
//       bgColor: "bg-purple-50",
//       borderColor: "border-purple-200"
//     }
//   ];

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-white">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-800 rounded-full animate-spin mx-auto"></div>
//           <p className="mt-4 text-gray-600 text-lg">Loading spaces...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <style>{styles}</style>
//       <div className="min-h-screen bg-white text-gray-900 font-light antialiased">

//         <SpaceDetailModal 
//           isOpen={isSpaceDetailOpen}
//           onClose={closeSpaceDetail}
//           space={selectedSpace}
//           onBookClick={handleBookClick}
//         />

//         {showThankYouPopup && (
//           <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
//             <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl border border-gray-100 animate-slideUp relative">
//               <button
//                 onClick={() => setShowThankYouPopup(false)}
//                 className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors group"
//               >
//                 <X size={20} className="text-gray-400 group-hover:text-gray-600" />
//               </button>
//               <div className="text-center">
//                 <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
//                   <CheckCircle size={40} className="text-green-600" />
//                 </div>
//                 <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You! 🎉</h3>
//                 <p className="text-gray-600 mb-2">Thanks for your interest!</p>
//                 <p className="text-gray-500 text-sm">We will contact you soon.</p>
//                 <button
//                   onClick={() => setShowThankYouPopup(false)}
//                   className="mt-6 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition"
//                 >
//                   Got it
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         <nav className={`navbar-custom ${scrolled ? 'navbar-scrolled' : ''}`}>
//           <div className="navbar-inner">
//             <button onClick={scrollToTop} className="flex items-center gap-3 group">
//               <div className="navbar-logo">
//                 <img src={logo} alt="Logo" />
//               </div>
//               <BrandWithIcon />
//             </button>

//             <div className="nav-links">
//               <button onClick={() => scrollToSection('benefits')} className="navbar-link">Benefits</button>
//               <button onClick={() => { scrollToSection('coworking-section'); }} className="navbar-link">Co-working</button>
//               <button onClick={() => navigate('/doctor-chamber')} className="navbar-link">Doctor's Chamber</button>
//               <button onClick={() => scrollToSection('specialties')} className="navbar-link">Specialties</button>
//               <button onClick={() => scrollToSection('mission-vision')} className="navbar-link">About</button>
//               <button onClick={() => scrollToSection('faq')} className="navbar-link">FAQ</button>
//               <button onClick={() => scrollToSection('contact')} className="navbar-link">Contact</button>
//             </div>

//             <div className="flex items-center gap-2">
//               <button onClick={() => navigate("/login")} className="navbar-signin hidden sm:block">
//                 Sign In
//               </button>
//               <button onClick={() => navigate("/login")} className="navbar-btn navbar-btn-mobile-hide">
//                 <Layout size={14} /> Start Now
//               </button>
//               <button 
//                 onClick={() => setMobileOpen(!mobileOpen)} 
//                 className="navbar-menu-btn"
//                 aria-label="Toggle menu"
//               >
//                 {mobileOpen ? <X size={22} /> : <Menu size={22} />}
//               </button>
//             </div>
//           </div>
//         </nav>

//         <div className={`fixed inset-0 z-40 bg-white pt-20 px-6 transition-all duration-500 ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
//           <button 
//             onClick={() => setMobileOpen(false)} 
//             className="mobile-menu-close"
//             aria-label="Close menu"
//           >
//             <X size={22} className="text-gray-700" />
//           </button>
          
//           <div className="flex flex-col gap-2 max-w-sm mx-auto mt-8">
//             <button onClick={() => { setMobileOpen(false); scrollToSection('benefits'); }} className="px-4 py-3 text-base text-gray-700 hover:text-blue-800 bg-gray-50 hover:bg-gray-100 rounded-lg transition font-medium text-left">Benefits</button>
//             <button onClick={() => { setMobileOpen(false); scrollToSection('coworking-section'); }} className="px-4 py-3 text-base text-gray-700 hover:text-blue-800 bg-gray-50 hover:bg-gray-100 rounded-lg transition font-medium text-left">Co-working Space</button>
//             <button onClick={() => { setMobileOpen(false); navigate('/doctor-chamber'); }} className="px-4 py-3 text-base text-gray-700 hover:text-blue-800 bg-gray-50 hover:bg-gray-100 rounded-lg transition font-medium text-left">Doctor's Chamber</button>
//             <button onClick={() => { setMobileOpen(false); scrollToSection('specialties'); }} className="px-4 py-3 text-base text-gray-700 hover:text-blue-800 bg-gray-50 hover:bg-gray-100 rounded-lg transition font-medium text-left">Specialties</button>
//             <button onClick={() => { setMobileOpen(false); scrollToSection('mission-vision'); }} className="px-4 py-3 text-base text-gray-700 hover:text-blue-800 bg-gray-50 hover:bg-gray-100 rounded-lg transition font-medium text-left">About</button>
//             <button onClick={() => { setMobileOpen(false); scrollToSection('faq'); }} className="px-4 py-3 text-base text-gray-700 hover:text-blue-800 bg-gray-50 hover:bg-gray-100 rounded-lg transition font-medium text-left">FAQ</button>
//             <button onClick={() => { setMobileOpen(false); scrollToSection('contact'); }} className="px-4 py-3 text-base text-gray-700 hover:text-blue-800 bg-gray-50 hover:bg-gray-100 rounded-lg transition font-medium text-left">Contact</button>
//             <div className="h-px bg-gray-200 my-1" />
//             <button onClick={() => { navigate("/login"); setMobileOpen(false); }} className="px-4 py-3 text-base text-center text-white bg-gradient-to-r from-blue-900 to-blue-700 rounded-lg font-semibold">
//               Start Now
//             </button>
//           </div>
//         </div>

//         {/* Hero Section */}
//         <section className="hero-section">
//           <div className="hero-bg">
//             <img src={IRYAX_HERO_IMAGE} alt="IRYAX SPACE Workspace" />
//           </div>
//           <div className="hero-overlay"></div>
//           <div className="hero-content">
//             <div className="hero-text-box">
//               <RevealSection>
//                 <div className="hero-badge">
//                   <Layout size={14} className="animate-heartbeat" />
//                   <span>India's Premier Workspace Platform</span>
//                 </div>
//               </RevealSection>

//               <RevealSection delay={0.1}>
//                 <h1 className="hero-title">
//                   Modern Workspaces
//                   <br />
//                   <span className="hero-title-gradient">
//                     <TypingText words={typingWords} />
//                   </span>
//                   <br />
//                   <span className="hero-subtitle">for Every Professional</span>
//                 </h1>
//               </RevealSection>

//               <RevealSection delay={0.2}>
//                 <p className="hero-desc">
//                   Fully-equipped spaces. Flexible hours. Zero admin stress.
//                   Join 120+ professionals who've transformed their work.
//                 </p>
//               </RevealSection>

//               <RevealSection delay={0.3}>
//                 <div className="hero-buttons">
//                   <button onClick={() => navigate("/login")} className="btn-primary">
//                     <Layout size={16} />
//                     Start Your Journey
//                     <ArrowRight size={16} className="group-hover:translate-x-1 transition" />
//                   </button>
//                   <button onClick={() => { scrollToSection('coworking-section'); }} className="btn-secondary" style={{ textDecoration: 'none' }}>
//                     <Eye size={16} /> Explore Spaces
//                   </button>
//                 </div>
//               </RevealSection>
//             </div>
//           </div>
//         </section>

//         {/* Stats */}
//         <section className="py-16 px-6 border-t border-gray-100 bg-gray-50">
//           <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8">
//             {stats.map((stat, i) => (
//               <RevealSection key={i} delay={i * 0.1}>
//                 <div className="text-center group p-4 rounded-2xl hover:bg-white transition shadow-sm hover:shadow-lg">
//                   <div className="text-4xl font-bold bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent group-hover:scale-110 transition">
//                     {stat.label === "Workspaces" ? cabins.length || 15 : <Counter target={stat.value} suffix={stat.suffix} />}
//                   </div>
//                   <div className="text-sm text-gray-500 mt-1 font-medium">{stat.label}</div>
//                 </div>
//               </RevealSection>
//             ))}
//           </div>
//         </section>

//         {/* 🏷️ CATEGORY DIVIDER - Clear division between Co-working and Medical Chambers */}
//         <div className="py-6 px-4 bg-gradient-to-r from-blue-50 via-white to-red-50">
//           <div className="max-w-6xl mx-auto">
//             <CategoryDivider 
//               leftLabel="Co-Working Spaces"
//               rightLabel="Medical Chambers"
//               leftIcon={Building2}
//               rightIcon={Stethoscope}
//               leftCount={coworkingCabins.length}
//               rightCount={medicalCabins.length}
//             />
//             <p className="text-center text-xs text-gray-500 mt-2 tracking-wider uppercase font-medium">
//               <span className="inline-flex items-center gap-2">
//                 <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>
//                 Flexible workspaces for professionals &amp; teams
//                 <span className="text-gray-300 mx-1">•</span>
//                 <span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span>
//                 Premium consultation rooms for healthcare experts
//               </span>
//             </p>
//           </div>
//         </div>

//         {/* Co-Working Section */}
//         <section id="coworking-section" className="py-8 px-6 bg-gradient-to-b from-blue-50 to-white">
//           <div className="max-w-6xl mx-auto">
//             <div className="text-center mb-10">
//               <RevealSection>
//                 <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-100 border border-blue-300 text-blue-800 text-xs rounded-full mb-4 tracking-widest uppercase font-medium animate-coworking-pulse">
//                   <Building2 size={12} /> Co-Working Spaces
//                 </span>
//               </RevealSection>
//               <RevealSection delay={0.1}>
//                 <h2 className="text-3xl sm:text-4xl font-light text-gray-900">
//                   Premium <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-bold">Co-Working Spaces</span>
//                 </h2>
//               </RevealSection>
//               <RevealSection delay={0.2}>
//                 <p className="mt-3 text-base text-gray-600 max-w-2xl mx-auto">
//                   Modern, flexible workspaces designed for freelancers, startups, and growing teams.
//                 </p>
//               </RevealSection>
//             </div>

//             {coworkingCabins.length > 0 && (
//               <RevealSection delay={0.15}>
//                 <div className="pro-section-toolbar">
//                   <span className="pro-stat-pill coworking"><Building2 size={14} /> {coworkingCabins.length} Live Spaces</span>
//                   <span className="pro-stat-pill coworking"><Gauge size={14} /> Instant Booking</span>
//                   <span className="pro-stat-pill coworking"><ShieldCheck size={14} /> Verified Listings</span>
//                 </div>
//               </RevealSection>
//             )}

//             {coworkingCabins.length === 0 ? (
//               <div className="text-center py-12">
//                 <Building2 size={48} className="mx-auto text-gray-300 mb-4" />
//                 <p className="text-gray-500 text-lg">No co-working spaces available at the moment.</p>
//               </div>
//             ) : (
//               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {coworkingCabins.map((cabin, i) => (
//                   <RevealSection key={cabin._id} delay={i * 0.1}>
//                     <ProCabinCard
//                       cabin={cabin}
//                       variant="coworking"
//                       index={i}
//                       onCardClick={handleSpaceClick}
//                       onCtaClick={handleSpaceClick}
//                     />
//                   </RevealSection>
//                 ))}
//               </div>
//             )}
//           </div>
//         </section>

//         {/* 🏷️ Medical Chambers Section - With its own divider */}
//         <section id="medical-section" className="py-8 px-6 bg-gradient-to-b from-white to-red-50">
//           <div className="max-w-6xl mx-auto">
//             <div className="text-center mb-10">
//               <RevealSection>
//                 <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-100 border border-red-300 text-red-800 text-xs rounded-full mb-4 tracking-widest uppercase font-medium animate-medical-pulse">
//                   <Stethoscope size={12} /> Medical Chambers
//                 </span>
//               </RevealSection>
//               <RevealSection delay={0.1}>
//                 <h2 className="text-3xl sm:text-4xl font-light text-gray-900">
//                   Premium <span className="bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent font-bold">Medical Chambers</span>
//                 </h2>
//               </RevealSection>
//               <RevealSection delay={0.2}>
//                 <p className="mt-3 text-base text-gray-600 max-w-2xl mx-auto">
//                   Fully-equipped consultation rooms designed for healthcare professionals to deliver exceptional care.
//                 </p>
//               </RevealSection>
//             </div>

//             {medicalCabins.length > 0 && (
//               <RevealSection delay={0.15}>
//                 <div className="pro-section-toolbar">
//                   <span className="pro-stat-pill medical"><Stethoscope size={14} /> {medicalCabins.length} Chambers</span>
//                   <span className="pro-stat-pill medical"><ShieldCheck size={14} /> Hygiene Certified</span>
//                   <span className="pro-stat-pill medical"><ClockIcon size={14} /> 24/7 Access</span>
//                 </div>
//               </RevealSection>
//             )}

//             {medicalCabins.length === 0 ? (
//               <div className="text-center py-12">
//                 <Stethoscope size={48} className="mx-auto text-gray-300 mb-4" />
//                 <p className="text-gray-500 text-lg">No medical chambers available at the moment.</p>
//                 <button 
//                   onClick={() => navigate('/doctor-chamber')}
//                   className="mt-4 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-rose-600 rounded-xl hover:shadow-lg transition hover:scale-105 inline-flex items-center gap-2"
//                 >
//                   <Stethoscope size={16} /> Explore Doctor's Chamber
//                 </button>
//               </div>
//             ) : (
//               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {medicalCabins.map((cabin, i) => (
//                   <RevealSection key={cabin._id} delay={i * 0.1}>
//                     <ProCabinCard
//                       cabin={cabin}
//                       variant="medical"
//                       index={i}
//                       onCardClick={handleSpaceClick}
//                       onCtaClick={handleSpaceClick}
//                     />
//                   </RevealSection>
//                 ))}
//               </div>
//             )}

//             {/* Quick link to Doctor Chamber Page */}
//             <div className="text-center mt-8">
//               <RevealSection>
//                 <button 
//                   onClick={() => navigate('/doctor-chamber')}
//                   className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl hover:shadow-lg transition hover:scale-105 text-sm font-semibold"
//                 >
//                   <Stethoscope size={18} /> 
//                   Explore All Medical Chambers
//                   <ArrowRight size={16} className="group-hover:translate-x-1 transition" />
//                 </button>
//               </RevealSection>
//             </div>
//           </div>
//         </section>

//         {/* Mission & Vision */}
//         <section id="mission-vision" className="py-16 px-6 bg-gradient-to-br from-blue-50 via-white to-purple-50">
//           <div className="max-w-5xl mx-auto">
//             <div className="text-center mb-10">
//               <RevealSection>
//                 <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 text-xs rounded-full mb-4 tracking-widest uppercase font-medium shadow-sm">
//                   <Flag size={12} className="text-blue-700" /> About Us
//                 </span>
//               </RevealSection>
//               <RevealSection delay={0.1}>
//                 <h2 className="text-2xl sm:text-3xl font-light text-gray-900">
//                   Our <span className="bg-gradient-to-r from-blue-900 to-purple-700 bg-clip-text text-transparent font-bold">Mission & Vision</span>
//                 </h2>
//               </RevealSection>
//               <RevealSection delay={0.2}>
//                 <p className="mt-2 text-sm text-gray-600 max-w-2xl mx-auto">
//                   Driving innovation by creating accessible, flexible, and premium workspaces for every professional.
//                 </p>
//               </RevealSection>
//             </div>

//             <div className="grid md:grid-cols-2 gap-6">
//               {missionVisionData.map((item, index) => {
//                 const Icon = item.icon;
//                 return (
//                   <RevealSection key={index} delay={index * 0.15}>
//                     <div className={`relative p-6 rounded-2xl ${item.bgColor} border ${item.borderColor} transition-all duration-500 hover:shadow-xl hover:-translate-y-1 group overflow-hidden`}>
//                       <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${item.color} rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition`} />
//                       <div className="relative z-10">
//                         <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-md mb-3 group-hover:scale-110 transition group-hover:rotate-6`}>
//                           <Icon size={22} />
//                         </div>
//                         <h3 className={`text-lg font-bold text-gray-900 mb-2`}>{item.title}</h3>
//                         <p className="text-gray-700 leading-relaxed text-sm">
//                           {item.description}
//                         </p>
//                         <div className="mt-3 flex items-center gap-2 text-[10px] font-medium text-gray-400">
//                           <span className="w-6 h-0.5 bg-gray-300"></span>
//                           <span>IRYAX SPACE</span>
//                           <span className="w-6 h-0.5 bg-gray-300"></span>
//                         </div>
//                       </div>
//                     </div>
//                   </RevealSection>
//                 );
//               })}
//             </div>

//             <RevealSection delay={0.3}>
//               <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
//                 {[
//                   { label: "Innovation", icon: SparklesIcon },
//                   { label: "Excellence", icon: Award },
//                   { label: "Accessibility", icon: Users },
//                   { label: "Trust", icon: ShieldCheck }
//                 ].map((value, i) => (
//                   <div key={i} className="text-center p-3 rounded-xl bg-white border border-gray-100 hover:border-blue-300 transition hover:shadow-md">
//                     <value.icon size={20} className="mx-auto text-blue-700 mb-1" />
//                     <p className="text-xs font-medium text-gray-700">{value.label}</p>
//                   </div>
//                 ))}
//               </div>
//             </RevealSection>
//           </div>
//         </section>

//         {/* Benefits */}
//         <section id="benefits" className="py-20 px-6 bg-gradient-to-b from-gray-100 via-white to-gray-50">
//           <div className="max-w-6xl mx-auto">
//             <div className="text-center mb-14">
//               <RevealSection>
//                 <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/60 backdrop-blur-sm border border-white/30 text-blue-800 text-xs rounded-full mb-4 tracking-widest uppercase font-medium shadow-sm">
//                   <StarIcon size={12} className="fill-blue-800 text-blue-800" /> Benefits
//                 </span>
//               </RevealSection>
//               <RevealSection delay={0.1}>
//                 <h2 className="text-3xl sm:text-4xl font-light text-gray-900">
//                   Helping Professionals <span className="bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent font-bold">Avoid Long Leases</span> & High Costs
//                 </h2>
//               </RevealSection>
//               <RevealSection delay={0.2}>
//                 <p className="mt-3 text-base text-gray-600 max-w-2xl mx-auto">Focus on your work while we handle everything else.</p>
//               </RevealSection>
//             </div>

//             <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
//               {benefits.map((benefit, i) => (
//                 <RevealSection key={i} delay={i * 0.1}>
//                   <div className={`glass-card ${benefit.glassClass}`}>
//                     <div className="icon-wrapper">
//                       <benefit.icon size={24} />
//                     </div>
//                     <h3>{benefit.title}</h3>
//                     <p>{benefit.desc}</p>
//                   </div>
//                 </RevealSection>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* Features */}
//         <section className="py-20 px-6 bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 text-white">
//           <div className="max-w-6xl mx-auto">
//             <div className="text-center mb-14">
//               <RevealSection>
//                 <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/20 text-white/80 text-xs rounded-full mb-4 tracking-widest uppercase font-medium">
//                   <SparklesIcon size={12} /> Why Choose Us
//                 </span>
//               </RevealSection>
//               <RevealSection delay={0.1}>
//                 <h2 className="text-3xl sm:text-4xl font-light">
//                   Built for <span className="font-bold bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">Modern Professionals</span>
//                 </h2>
//               </RevealSection>
//               <RevealSection delay={0.2}>
//                 <p className="mt-3 text-base text-blue-200 max-w-2xl mx-auto">Everything you need to start and grow your work.</p>
//               </RevealSection>
//             </div>

//             <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
//               {features.map((feature, i) => (
//                 <RevealSection key={i} delay={i * 0.1}>
//                   <div className="feature-card">
//                     <span className="text-4xl font-bold text-white/10 absolute top-4 right-6">{feature.number}</span>
//                     <div className={`feature-icon ${feature.color}`}>
//                       <feature.icon size={28} />
//                     </div>
//                     <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
//                     <p className="text-sm text-blue-200 leading-relaxed">{feature.desc}</p>
//                   </div>
//                 </RevealSection>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* Locations */}
//         <section className="py-20 px-6 bg-gray-50">
//           <div className="max-w-6xl mx-auto">
//             <div className="text-center mb-14">
//               <RevealSection>
//                 <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-full mb-4 tracking-widest uppercase font-medium">
//                   <MapPin size={12} /> Prime Locations
//                 </span>
//               </RevealSection>
//               <RevealSection delay={0.1}>
//                 <h2 className="text-3xl sm:text-4xl font-light text-gray-900">
//                   Accessible, High-Visibility <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent font-bold">Workspaces</span>
//                 </h2>
//               </RevealSection>
//               <RevealSection delay={0.2}>
//                 <p className="mt-3 text-base text-gray-600 max-w-2xl mx-auto">Minimal investment. No operational stress. Just focus on your work.</p>
//               </RevealSection>
//             </div>

//             <div className="grid md:grid-cols-2 gap-12 items-start">
//               <div className="space-y-4">
//                 {locationList.map((item, i) => (
//                   <RevealSection key={i} delay={i * 0.1}>
//                     <div className="location-list-item">
//                       <div className="loc-icon">
//                         <item.icon size={22} />
//                       </div>
//                       <div className="loc-content">
//                         <h4>{item.title}</h4>
//                         <p>{item.desc}</p>
//                       </div>
//                     </div>
//                   </RevealSection>
//                 ))}
//               </div>

//               <RevealSection delay={0.2}>
//                 <div className="location-grid-images">
//                   <div className="img-main">
//                     <img src={IRYAX_LOCATION_IMAGES[0]} alt="IRYAX Location" />
//                   </div>
//                   <div className="img-side">
//                     <img src={IRYAX_LOCATION_IMAGES[1]} alt="IRYAX Location" />
//                   </div>
//                   <div className="img-side">
//                     <img src={IRYAX_LOCATION_IMAGES[2]} alt="IRYAX Location" />
//                   </div>
//                 </div>
//               </RevealSection>
//             </div>
//           </div>
//         </section>

//         {/* Earn */}
//         <section className="py-20 px-6 bg-white">
//           <div className="max-w-6xl mx-auto">
//             <div className="grid md:grid-cols-2 gap-12 items-center">
//               <RevealSection>
//                 <div>
//                   <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-full mb-4 tracking-widest uppercase font-medium">
//                     <Wallet size={12} /> Earn Passive Income
//                   </span>
//                   <h2 className="text-3xl sm:text-4xl font-light text-gray-900 mb-4">
//                     Earn From <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent font-bold">Your Space</span>
//                   </h2>
//                   <p className="text-base text-gray-600 leading-relaxed mb-6">
//                     Monetize your unused workspace and connect with trusted professionals. No added operational stress — we handle everything.
//                   </p>
//                   <ul className="space-y-3 mb-6">
//                     {["List your space on our platform", "Connect with verified professionals", "We handle booking and management", "You earn passive income"].map((item, i) => (
//                       <li key={i} className="flex items-start gap-3 text-sm">
//                         <CheckCircle size={18} className="text-amber-600 mt-0.5 flex-shrink-0" />
//                         <span className="text-gray-700">{item}</span>
//                       </li>
//                     ))}
//                   </ul>
//                   <button className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl hover:shadow-lg hover:shadow-amber-500/25 transition hover:scale-105 flex items-center gap-2 group">
//                     <Building2 size={16} /> List Your Space <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
//                   </button>
//                 </div>
//               </RevealSection>
//               <RevealSection delay={0.2}>
//                 <div className="relative">
//                   <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-2xl blur-2xl animate-pulse" />
//                   <div className="relative rounded-2xl overflow-hidden bg-white border border-gray-200 p-6 shadow-xl">
//                     <img src={IRYAX_SPACE_IMAGES[4]} alt="IRYAX Workspace" className="w-full h-64 object-cover rounded-xl" />
//                     <div className="mt-4 flex items-center gap-3">
//                       <div className="flex -space-x-2">
//                         {[1,2,3].map((i) => <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-amber-600/20 flex items-center justify-center text-xs text-amber-600 font-bold">P</div>)}
//                       </div>
//                       <span className="text-sm text-gray-500">Trusted by 50+ professionals</span>
//                     </div>
//                   </div>
//                 </div>
//               </RevealSection>
//             </div>
//           </div>
//         </section>

//         {/* Specialties */}
//         <section id="specialties" className="py-20 px-6 bg-gray-50">
//           <div className="max-w-6xl mx-auto">
//             <div className="text-center mb-14">
//               <RevealSection>
//                 <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 border border-blue-200 text-blue-800 text-xs rounded-full mb-4 tracking-widest uppercase font-medium">
//                   <UsersRound size={12} /> Our Specialties
//                 </span>
//               </RevealSection>
//               <RevealSection delay={0.1}>
//                 <h2 className="text-3xl sm:text-4xl font-light text-gray-900">
//                   We Serve Across <span className="specialties-gradient-heading">Multiple Domains</span>
//                 </h2>
//               </RevealSection>
//               <RevealSection delay={0.2}>
//                 <p className="mt-3 text-base text-gray-600 max-w-2xl mx-auto">Modern workspaces designed for every profession.</p>
//               </RevealSection>
//             </div>

//             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
//               {specialties.map((name, i) => {
//                 const Icon = specialtyIconMap[name] || Layout;
//                 return (
//                   <RevealSection key={i} delay={i * 0.05}>
//                     <div className="group p-4 rounded-2xl bg-white border border-gray-100 hover:border-blue-300 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl text-center">
//                       <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center text-blue-700 group-hover:scale-110 transition group-hover:rotate-6">
//                         <Icon size={24} />
//                       </div>
//                       <p className="text-xs text-gray-700 mt-3 group-hover:text-blue-700 transition font-medium">{name}</p>
//                     </div>
//                   </RevealSection>
//                 );
//               })}
//             </div>
//           </div>
//         </section>

//         {/* Modern Spaces */}
//         <section className="py-20 px-6 bg-white">
//           <div className="max-w-6xl mx-auto">
//             <RevealSection>
//               <div className="grid md:grid-cols-2 gap-12 items-center">
//                 <div>
//                   <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs rounded-full mb-4 tracking-widest uppercase font-medium">
//                     <SparklesIcon size={12} /> Modern Workspaces
//                   </span>
//                   <h2 className="text-3xl sm:text-4xl font-light text-gray-900 mb-4">
//                     Zero Hassle. <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent font-bold">Complete Convenience.</span>
//                   </h2>
//                   <p className="text-base text-gray-600 leading-relaxed mb-6">
//                     Experience co-working like a premium hotel stay — fully-equipped spaces, ready infrastructure, and complete operational support, without owning or renting property.
//                   </p>
//                   <ul className="space-y-3">
//                     {["Fully-equipped workspaces", "State-of-the-art tools", "Professional reception and staff", "24/7 security and support"].map((item, i) => (
//                       <li key={i} className="flex items-start gap-3 text-sm">
//                         <CheckCircle size={18} className="text-cyan-600 mt-0.5 flex-shrink-0" />
//                         <span className="text-gray-700">{item}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <img src={IRYAX_SPACE_IMAGES[0]} alt="IRYAX Workspace" className="rounded-2xl w-full h-48 object-cover hover:scale-105 transition shadow-xl" />
//                   <img src={IRYAX_SPACE_IMAGES[1]} alt="IRYAX Workspace" className="rounded-2xl w-full h-48 object-cover hover:scale-105 transition shadow-xl mt-8" />
//                   <img src={IRYAX_SPACE_IMAGES[2]} alt="IRYAX Workspace" className="rounded-2xl w-full h-48 object-cover hover:scale-105 transition shadow-xl -mt-4" />
//                   <img src={IRYAX_SPACE_IMAGES[3]} alt="IRYAX Workspace" className="rounded-2xl w-full h-48 object-cover hover:scale-105 transition shadow-xl" />
//                 </div>
//               </div>
//             </RevealSection>
//           </div>
//         </section>

//         {/* FAQ */}
//         <section id="faq" className="py-20 px-6 bg-gray-50">
//           <div className="max-w-3xl mx-auto">
//             <div className="text-center mb-12">
//               <RevealSection>
//                 <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-gray-100 border border-gray-200 text-gray-700 text-xs rounded-full mb-4 tracking-widest uppercase font-medium">
//                   <HelpCircle size={12} /> FAQ
//                 </span>
//               </RevealSection>
//               <RevealSection delay={0.1}>
//                 <h2 className="text-3xl font-light text-gray-900">Frequently Asked <span className="bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent font-bold">Questions</span></h2>
//               </RevealSection>
//               <RevealSection delay={0.2}>
//                 <p className="mt-2 text-base text-gray-600">Find answers about our workspaces.</p>
//               </RevealSection>
//             </div>

//             <div className="space-y-3">
//               {faqs.map((faq, i) => (
//                 <RevealSection key={i} delay={i * 0.06}>
//                   <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden transition hover:shadow-lg hover:border-blue-200">
//                     <button onClick={() => toggleFaq(i)} className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition">
//                       <div>
//                         <span className="text-[10px] text-blue-600 uppercase tracking-wider font-semibold">{faq.category}</span>
//                         <p className="text-base font-light text-gray-900 mt-0.5">{faq.q}</p>
//                       </div>
//                       <ChevronDown size={18} className={`text-gray-500 transition-all duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
//                     </button>
//                     <div className={`overflow-hidden transition-all duration-500 ${openFaq === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
//                       <div className="px-6 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">{faq.a}</div>
//                     </div>
//                   </div>
//                 </RevealSection>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* Contact */}
//         <section id="contact" className="py-20 px-6 relative overflow-hidden">
//           <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50" />
//           <div className="relative max-w-4xl mx-auto">
//             <div className="text-center mb-12">
//               <RevealSection>
//                 <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/80 border border-gray-200 text-gray-700 text-xs rounded-full mb-4 tracking-widest uppercase font-medium">Get in Touch</span>
//               </RevealSection>
//               <RevealSection delay={0.1}>
//                 <h2 className="text-3xl font-light text-gray-900">Ready to <span className="bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent font-bold">Start Your Journey?</span></h2>
//               </RevealSection>
//               <RevealSection delay={0.2}>
//                 <p className="mt-2 text-base text-gray-600">Connect with us and transform your work experience today.</p>
//               </RevealSection>
//             </div>

//             <div className="grid md:grid-cols-5 gap-8">
//               <div className="md:col-span-2 space-y-5">
//                 {[
//                   { icon: Mail, label: "Email", value: "info@iriax.com" },
//                   { icon: Phone, label: "Phone", value: "+91-9010481048" },
//                   { icon: MapPin, label: "Address", value: "Iryax Global, Flat No: 301, 3rd Floor, Sri Sai Balaji Avenue, H. No: 1-98/9/25/p, VIP Hills, near Bank of Baroda, Arunodaya Colony, Madhapur, Hyderabad, Telangana 500081" }
//                 ].map((item, i) => (
//                   <RevealSection key={i} delay={i * 0.1}>
//                     <div className="flex items-start gap-4 group p-4 rounded-xl bg-white/70 backdrop-blur-sm hover:bg-white transition shadow-sm hover:shadow-md">
//                       <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-700 flex-shrink-0 mt-0.5 transition group-hover:scale-110">
//                         <item.icon size={18} />
//                       </div>
//                       <div>
//                         <p className="text-sm font-semibold text-gray-900">{item.label}</p>
//                         <p className={`text-sm text-gray-600 group-hover:text-blue-700 transition ${item.label === 'Address' ? 'text-xs leading-relaxed' : ''}`}>{item.value}</p>
//                       </div>
//                     </div>
//                   </RevealSection>
//                 ))}
//               </div>

//               <div className="md:col-span-3">
//                 <RevealSection delay={0.3}>
//                   <form onSubmit={handleSubmit} className="space-y-4 bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-white/50">
//                     <div className="grid sm:grid-cols-2 gap-4">
//                       <input 
//                         type="text" 
//                         placeholder="Your Name" 
//                         value={formData.name} 
//                         onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
//                         className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm focus:outline-none transition" 
//                         required 
//                       />
//                       <input 
//                         type="email" 
//                         placeholder="Your Email" 
//                         value={formData.email} 
//                         onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
//                         className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm focus:outline-none transition" 
//                         required 
//                       />
//                     </div>
//                     <div className="grid sm:grid-cols-2 gap-4">
//                       <input 
//                         type="tel" 
//                         placeholder="Phone Number" 
//                         value={formData.phone} 
//                         onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
//                         className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm focus:outline-none transition" 
//                         required 
//                       />
//                       <input 
//                         type="text" 
//                         placeholder="Address" 
//                         value={formData.address} 
//                         onChange={(e) => setFormData({ ...formData, address: e.target.value })} 
//                         className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm focus:outline-none transition" 
//                       />
//                     </div>
//                     <textarea 
//                       placeholder="Your Message" 
//                       rows="4" 
//                       value={formData.message} 
//                       onChange={(e) => setFormData({ ...formData, message: e.target.value })} 
//                       className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm focus:outline-none transition resize-none" 
//                       required 
//                     />
//                     {submitError && (
//                       <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
//                         {submitError}
//                       </div>
//                     )}
//                     <button 
//                       type="submit" 
//                       disabled={isSubmitting}
//                       className="w-full px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-900 to-blue-700 rounded-xl hover:shadow-lg hover:shadow-blue-900/25 transition hover:scale-105 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
//                     >
//                       {isSubmitting ? (
//                         <>
//                           <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                           </svg>
//                           Submitting...
//                         </>
//                       ) : (
//                         <>Start Your Journey <Send size={16} className="group-hover:translate-x-1 transition" /></>
//                       )}
//                     </button>
//                   </form>
//                 </RevealSection>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Footer */}
//         <footer className="py-12 px-6 border-t border-gray-200 bg-gray-900 text-white">
//           <div className="max-w-6xl mx-auto">
//             <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
//               <RevealSection>
//                 <div>
//                   <button onClick={scrollToTop} className="flex items-center gap-3 mb-4 group">
//                     <div className="w-10 h-10 rounded-full overflow-hidden border border-blue-400/30 shadow-lg shadow-blue-500/20 flex-shrink-0 bg-white/10 group-hover:scale-110 transition">
//                       <img src={logo} alt="Logo" className="w-full h-full object-contain p-1.5" />
//                     </div>
//                     <span className="text-base font-semibold text-white group-hover:text-blue-400 transition flex items-center gap-2">
//                       IRYAX SPACE
//                       <Layout size={16} className="text-blue-400" />
//                     </span>
//                   </button>
//                   <p className="text-sm text-gray-400">Modern workspaces for every professional.</p>
//                 </div>
//               </RevealSection>
//               <RevealSection delay={0.1}>
//                 <div>
//                   <h4 className="text-sm font-medium text-white mb-4">Explore</h4>
//                   <div className="space-y-2">
//                     <button onClick={() => scrollToSection('benefits')} className="block text-sm text-gray-400 hover:text-blue-400 transition hover:translate-x-1 text-left">Benefits</button>
//                     <button onClick={() => scrollToSection('coworking-section')} className="block text-sm text-gray-400 hover:text-blue-400 transition hover:translate-x-1 text-left">Co-working Space</button>
//                     <button onClick={() => navigate('/doctor-chamber')} className="block text-sm text-gray-400 hover:text-blue-400 transition hover:translate-x-1 text-left">Doctor's Chamber</button>
//                     <button onClick={() => scrollToSection('specialties')} className="block text-sm text-gray-400 hover:text-blue-400 transition hover:translate-x-1 text-left">Specialties</button>
//                     <button onClick={() => scrollToSection('mission-vision')} className="block text-sm text-gray-400 hover:text-blue-400 transition hover:translate-x-1 text-left">About</button>
//                     <button onClick={() => scrollToSection('faq')} className="block text-sm text-gray-400 hover:text-blue-400 transition hover:translate-x-1 text-left">FAQ</button>
//                   </div>
//                 </div>
//               </RevealSection>
//               <RevealSection delay={0.2}>
//                 <div>
//                   <h4 className="text-sm font-medium text-white mb-4">Company</h4>
//                   <div className="space-y-2">
//                     <button className="block text-sm text-gray-400 hover:text-blue-400 transition hover:translate-x-1 text-left">About Us</button>
//                     <button onClick={() => scrollToSection('contact')} className="block text-sm text-gray-400 hover:text-blue-400 transition hover:translate-x-1 text-left">Contact</button>
//                   </div>
//                 </div>
//               </RevealSection>
//               <RevealSection delay={0.3}>
//                 <div>
//                   <h4 className="text-sm font-medium text-white mb-4">Legal</h4>
//                   <div className="space-y-2">
//                     {["Privacy Policy", "Terms & Conditions", "Refund Policy", "Cookie Policy"].map((item) => (
//                       <button key={item} className="block text-sm text-gray-400 hover:text-blue-400 transition hover:translate-x-1 text-left">{item}</button>
//                     ))}
//                   </div>
//                 </div>
//               </RevealSection>
//             </div>
            
//             <RevealSection delay={0.4}>
//               <div className="mt-10 pt-6 border-t border-gray-800 text-center">
//                 <div className="flex flex-col items-center gap-3">
//                   <p className="text-sm text-gray-400">
//                     © IRYAX SPACE All Rights Reserved. | Made with 
//                     <span className="footer-heart mx-1">❤️</span> 
//                     by IRYAX
//                   </p>
//                   <p className="text-xs text-gray-500 tracking-wider uppercase">IRYAX SPACE</p>
//                 </div>
//               </div>
//             </RevealSection>
//           </div>
//         </footer>
//       </div>
//     </>
//   );
// };

// // ─── APP ───
// export default function App() {
//   const location = window.location.pathname;
  
//   if (location === '/doctor-chamber') {
//     return (
//       <ThemeProvider>
//         <DoctorChamberPage />
//       </ThemeProvider>
//     );
//   }
  
//   return (
//     <ThemeProvider>
//       <PromotionalPage />
//     </ThemeProvider>
//   );
// }





// PromotionalPage.jsx
// IRYAX SPACE — redesigned for a calmer, more professional "boutique directory" look.
// All original functionality preserved: cabin fetch, contact form -> /api/cabins/sendquery,
// space detail modal, doctor chamber route, navigation, scroll reveal.

import React, { useEffect, useState, createContext, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Users,
  CheckCircle,
  ArrowRight,
  ArrowUpRight,
  Star,
  Shield,
  MapPin,
  Wifi,
  Coffee,
  Menu,
  X,
  Wallet,
  Sparkles,
  ChevronDown,
  HelpCircle,
  Mail,
  Phone,
  Send,
  ParkingCircle,
  Lock,
  Sofa,
  Bath,
  Tv,
  Printer,
  Fan,
  Eye,
  Heart,
  Activity,
  Brain,
  Bone,
  EyeOff,
  UsersRound,
  ShieldCheck,
  Award,
  Target,
  Layout,
  Flag,
  Stethoscope,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  UserCheck,
  Clock,
  BadgeCheck,
  Gauge,
  Microscope,
  TestTube,
  HeartPulse
} from "lucide-react";
import logo from "../assets/logo.png";
import iryaxHero from "../assets/iryaxspace.png";

// ─── IMAGES ───
const IRYAX_HERO_IMAGE = iryaxHero;

const IRYAX_SPACE_IMAGES = [
  "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=800&h=600",
  "https://images.unsplash.com/photo-1497366412874-3415097a27e7?auto=format&fit=crop&q=80&w=800&h=600",
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=800&h=600",
  "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800&h=600",
  "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800&h=600",
  "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&q=80&w=800&h=600"
];

const DOCTOR_HERO_IMAGE = "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?auto=format&fit=crop&q=80&w=1920&h=800";

const DOCTOR_SPACE_IMAGES = [
  "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?auto=format&fit=crop&q=80&w=800&h=600",
  "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=800&h=600",
  "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800&h=600",
  "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800&h=600"
];

const IRYAX_LOCATION_IMAGES = [
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800&h=600",
  "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=800&h=600",
  "https://images.unsplash.com/photo-1497366412874-3415097a27e7?auto=format&fit=crop&q=80&w=800&h=600"
];

// ═══════════════════════════════════════════════════════════════
// DESIGN TOKENS
// Palette   — ink #12181F · paper #FBF9F5 · paper-dim #F1EDE3
//             brass #B08947 (signature) · teal #23474B (co-working)
//             brick #8B4433 (medical) · line #E3DDCE
// Type      — display: 'Fraunces' (editorial serif, used sparingly)
//             body/UI: 'Inter'
// Signature — the category divider is built like a ledger tab/index
//             card, since Co-working / Medical genuinely are the two
//             indexed sections of the directory.
// ═══════════════════════════════════════════════════════════════
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700;800&display=swap');

  :root {
    --ink: #12181F;
    --ink-soft: #4A5160;
    --ink-faint: #8A8F99;
    --paper: #FBF9F5;
    --paper-dim: #F1EDE3;
    --line: #E3DDCE;
    --brass: #B08947;
    --brass-deep: #8C6C31;
    --teal: #23474B;
    --teal-tint: #E9EFEE;
    --brick: #8B4433;
    --brick-tint: #F3E9E3;
  }

  * { box-sizing: border-box; }

  .ix-root {
    font-family: 'Inter', -apple-system, sans-serif;
    color: var(--ink);
    background: var(--paper);
  }

  .ix-serif { font-family: 'Fraunces', Georgia, serif; }

  @keyframes ix-fade-up {
    from { opacity: 0; transform: translateY(28px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes ix-fade {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes ix-scale-in {
    from { opacity: 0; transform: scale(0.96); }
    to { opacity: 1; transform: scale(1); }
  }
  @keyframes ix-pulse-dot {
    0% { box-shadow: 0 0 0 0 rgba(35, 71, 75, 0.35); }
    70% { box-shadow: 0 0 0 7px rgba(35, 71, 75, 0); }
    100% { box-shadow: 0 0 0 0 rgba(35, 71, 75, 0); }
  }
  @keyframes ix-spin { to { transform: rotate(360deg); } }

  .reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1); }
  .reveal.visible { opacity: 1; transform: translateY(0); }

  @media (prefers-reduced-motion: reduce) {
    .reveal { transition: none; opacity: 1; transform: none; }
  }

  .line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
  .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

  ::-webkit-scrollbar { width: 8px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--line); border-radius: 10px; }

  /* ─── EYEBROW ─── */
  .ix-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--brass-deep);
    padding-bottom: 2px;
    border-bottom: 1px solid var(--line);
  }
  .ix-eyebrow .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--brass); flex-shrink: 0; }

  /* ─── NAVBAR ─── */
  .navbar-custom {
    position: fixed !important;
    top: 0; left: 0; right: 0;
    z-index: 50;
    height: 82px;
    padding: 0 32px;
    background: rgba(251, 249, 245, 0.0);
    border-bottom: 1px solid transparent;
    transition: all 0.35s cubic-bezier(0.16,1,0.3,1);
    display: flex;
    align-items: center;
  }
  .navbar-custom .navbar-inner {
    width: 100%;
    max-width: 1240px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .navbar-scrolled {
    background: rgba(251, 249, 245, 0.92) !important;
    backdrop-filter: blur(14px);
    border-bottom: 1px solid var(--line) !important;
    height: 72px !important;
  }
  .navbar-custom .navbar-brand {
    font-family: 'Fraunces', serif;
    font-size: 1.15rem;
    font-weight: 600;
    color: var(--ink);
    display: flex;
    align-items: center;
    gap: 10px;
    letter-spacing: 0.01em;
  }
  .navbar-custom .navbar-logo {
    width: 42px; height: 42px;
    border: 1px solid var(--line);
    border-radius: 50%;
    padding: 3px;
    background: white;
    overflow: hidden;
    flex-shrink: 0;
    transition: border-color 0.3s;
  }
  .navbar-custom .navbar-logo:hover { border-color: var(--brass); }
  .navbar-custom .navbar-logo img { width: 100%; height: 100%; object-fit: contain; }

  .navbar-custom .nav-links { display: flex; align-items: center; gap: 2px; }
  .navbar-custom .navbar-link {
    font-size: 0.86rem;
    font-weight: 500;
    padding: 9px 15px;
    color: var(--ink-soft);
    background: none;
    border: none;
    cursor: pointer;
    border-radius: 999px;
    transition: all 0.25s;
    font-family: inherit;
  }
  .navbar-custom .navbar-link:hover { color: var(--ink); background: var(--paper-dim); }

  .navbar-custom .navbar-signin {
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--ink-soft);
    background: none;
    border: none;
    padding: 9px 14px;
    cursor: pointer;
  }
  .navbar-custom .navbar-signin:hover { color: var(--ink); }

  .navbar-custom .navbar-btn {
    font-size: 0.82rem;
    font-weight: 600;
    padding: 10px 20px;
    background: var(--ink);
    color: var(--paper) !important;
    border: none;
    border-radius: 999px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s;
  }
  .navbar-custom .navbar-btn:hover { background: var(--brass-deep); transform: translateY(-1px); }

  .navbar-menu-btn {
    display: none;
    color: var(--ink);
    padding: 8px;
    border-radius: 50%;
    background: var(--paper-dim);
    border: 1px solid var(--line);
    cursor: pointer;
    align-items: center;
    justify-content: center;
  }

  @media (max-width: 992px) {
    .navbar-custom .nav-links { display: none; }
    .navbar-menu-btn { display: flex; }
  }
  @media (max-width: 640px) {
    .navbar-custom { padding: 0 18px; height: 66px; }
    .navbar-scrolled { height: 66px !important; }
  }

  /* ─── HERO ─── */
  .hero-section {
    padding: 168px 32px 90px;
    background: var(--paper);
  }
  .hero-grid {
    max-width: 1240px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1.05fr 0.95fr;
    gap: 64px;
    align-items: center;
  }
  .hero-title {
    font-family: 'Fraunces', serif;
    font-weight: 400;
    font-size: clamp(2.6rem, 4.6vw, 3.9rem);
    line-height: 1.08;
    color: var(--ink);
    letter-spacing: -0.01em;
    margin: 18px 0 20px;
  }
  .hero-title em {
    font-style: italic;
    font-weight: 500;
    color: var(--brass-deep);
  }
  .hero-desc {
    font-size: 1.05rem;
    line-height: 1.75;
    color: var(--ink-soft);
    max-width: 480px;
    font-weight: 400;
  }
  .hero-buttons { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 34px; }

  .btn-primary {
    padding: 14px 28px;
    font-size: 0.92rem;
    font-weight: 600;
    color: var(--paper);
    background: var(--ink);
    border-radius: 10px;
    border: none;
    transition: all 0.3s;
    display: inline-flex;
    align-items: center;
    gap: 9px;
    cursor: pointer;
  }
  .btn-primary:hover { background: var(--brass-deep); transform: translateY(-2px); }

  .btn-secondary {
    padding: 14px 28px;
    font-size: 0.92rem;
    font-weight: 600;
    color: var(--ink);
    background: transparent;
    border: 1px solid var(--line);
    border-radius: 10px;
    transition: all 0.3s;
    display: inline-flex;
    align-items: center;
    gap: 9px;
    cursor: pointer;
  }
  .btn-secondary:hover { border-color: var(--ink); background: var(--paper-dim); }

  .hero-figure {
    position: relative;
    border-radius: 20px;
    overflow: hidden;
    border: 1px solid var(--line);
    box-shadow: 0 30px 60px -30px rgba(18, 24, 31, 0.28);
  }
  .hero-figure img { width: 100%; height: 480px; object-fit: cover; display: block; }
  .hero-figure-tag {
    position: absolute;
    left: 18px; bottom: 18px;
    background: rgba(251, 249, 245, 0.94);
    backdrop-filter: blur(6px);
    border-radius: 12px;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    gap: 10px;
    border: 1px solid var(--line);
  }
  .hero-figure-tag .num { font-family: 'Fraunces', serif; font-size: 1.3rem; font-weight: 600; color: var(--ink); line-height: 1; }
  .hero-figure-tag .lbl { font-size: 0.68rem; color: var(--ink-faint); text-transform: uppercase; letter-spacing: 0.06em; }

  @media (max-width: 992px) {
    .hero-grid { grid-template-columns: 1fr; gap: 40px; }
    .hero-figure img { height: 340px; }
  }
  @media (max-width: 640px) {
    .hero-section { padding: 130px 20px 60px; }
    .hero-title { font-size: 2.1rem; }
    .btn-primary, .btn-secondary { padding: 12px 20px; font-size: 0.85rem; }
  }

  /* ─── STATS STRIP ─── */
  .stats-strip {
    border-top: 1px solid var(--line);
    border-bottom: 1px solid var(--line);
    background: var(--paper-dim);
  }
  .stats-strip .stat-num {
    font-family: 'Fraunces', serif;
    font-size: 2.1rem;
    font-weight: 500;
    color: var(--ink);
  }
  .stats-strip .stat-label { font-size: 0.76rem; color: var(--ink-faint); margin-top: 4px; font-weight: 500; }

  /* ─── LEDGER / CATEGORY DIVIDER (signature element) ─── */
  .ledger {
    max-width: 1000px;
    margin: 0 auto;
    border: 1px solid var(--line);
    border-radius: 16px;
    background: white;
    display: grid;
    grid-template-columns: 1fr 1fr;
    overflow: hidden;
  }
  .ledger-tab {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 26px 30px;
    position: relative;
    transition: background 0.3s;
  }
  .ledger-tab:first-child { border-right: 1px solid var(--line); }
  .ledger-tab .ledger-index {
    font-family: 'Fraunces', serif;
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--ink-faint);
    letter-spacing: 0.04em;
    min-width: 26px;
  }
  .ledger-tab .ledger-icon {
    width: 42px; height: 42px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .ledger-tab.co .ledger-icon { background: var(--teal-tint); color: var(--teal); }
  .ledger-tab.med .ledger-icon { background: var(--brick-tint); color: var(--brick); }
  .ledger-tab h4 {
    font-family: 'Fraunces', serif;
    font-size: 1.08rem;
    font-weight: 600;
    color: var(--ink);
  }
  .ledger-tab p { font-size: 0.78rem; color: var(--ink-faint); margin-top: 2px; }
  @media (max-width: 640px) {
    .ledger { grid-template-columns: 1fr; }
    .ledger-tab:first-child { border-right: none; border-bottom: 1px solid var(--line); }
  }

  /* ─── SECTION HEADERS ─── */
  .section-head { max-width: 640px; }
  .section-head h2 {
    font-family: 'Fraunces', serif;
    font-weight: 400;
    font-size: clamp(1.9rem, 3vw, 2.6rem);
    line-height: 1.18;
    color: var(--ink);
    margin-top: 10px;
  }
  .section-head p { margin-top: 12px; font-size: 1rem; color: var(--ink-soft); line-height: 1.7; }
  .section-toolbar {
    display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-top: 22px;
  }
  .toolbar-pill {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 7px 14px; border-radius: 999px;
    background: white; border: 1px solid var(--line);
    font-size: 0.76rem; font-weight: 600; color: var(--ink-soft);
  }
  .toolbar-pill.co svg { color: var(--teal); }
  .toolbar-pill.med svg { color: var(--brick); }

  /* ─── LISTING CARD (co-working / medical) ─── */
  .listing-card {
    background: white;
    border: 1px solid var(--line);
    border-radius: 18px;
    overflow: hidden;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    height: 100%;
    transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s cubic-bezier(0.16,1,0.3,1), border-color 0.4s;
  }
  .listing-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 26px 50px -22px rgba(18, 24, 31, 0.22);
    border-color: var(--ink);
  }
  .listing-media { position: relative; height: 208px; flex-shrink: 0; overflow: hidden; }
  .listing-media img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s; }
  .listing-card:hover .listing-media img { transform: scale(1.045); }

  .listing-badge-row {
    position: absolute; top: 12px; left: 12px; right: 12px;
    display: flex; align-items: flex-start; justify-content: space-between;
    z-index: 3; pointer-events: none;
  }
  .listing-type-chip {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 6px 12px; border-radius: 999px;
    font-size: 10.5px; font-weight: 700; letter-spacing: 0.03em;
    color: white;
  }
  .listing-type-chip.co { background: var(--teal); }
  .listing-type-chip.med { background: var(--brick); }

  .listing-avail-chip {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 5px 10px; border-radius: 999px;
    font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.03em;
    color: var(--ink);
    background: rgba(251,249,245,0.94);
  }
  .avail-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--teal); animation: ix-pulse-dot 1.8s infinite; }

  .listing-quickview {
    position: absolute; bottom: 12px; left: 12px; z-index: 3;
    width: 34px; height: 34px; border-radius: 50%;
    background: rgba(251,249,245,0.94);
    display: flex; align-items: center; justify-content: center;
    border: none; cursor: pointer;
    opacity: 0; transform: translateY(6px);
    transition: all 0.3s;
  }
  .listing-card:hover .listing-quickview { opacity: 1; transform: translateY(0); }

  .listing-price-float {
    position: absolute; bottom: 12px; right: 12px; z-index: 3;
    background: rgba(18, 24, 31, 0.82);
    border-radius: 10px; padding: 7px 13px; text-align: right;
  }
  .listing-price-float .amt { color: white; font-size: 1rem; font-weight: 700; line-height: 1; }
  .listing-price-float .per { color: rgba(255,255,255,0.6); font-size: 9px; text-transform: uppercase; letter-spacing: 0.05em; }

  .listing-body { padding: 20px 20px 18px; display: flex; flex-direction: column; flex: 1; }
  .listing-title-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; margin-bottom: 4px; }
  .listing-body h3 { font-family: 'Fraunces', serif; font-size: 1.08rem; font-weight: 600; color: var(--ink); line-height: 1.28; }
  .listing-rating {
    flex-shrink: 0; display: inline-flex; align-items: center; gap: 3px;
    font-size: 0.76rem; font-weight: 700; color: var(--brass-deep);
    background: #FBF3E4; border-radius: 8px; padding: 3px 7px;
  }
  .listing-rating svg { fill: var(--brass); color: var(--brass); }

  .listing-loc { display: flex; align-items: center; gap: 5px; font-size: 0.8rem; color: var(--ink-faint); margin-bottom: 14px; }

  .listing-amenities { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 18px; }
  .listing-amenity-chip {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 5px 9px; border-radius: 8px;
    background: var(--paper-dim); border: 1px solid var(--line);
    font-size: 0.7rem; font-weight: 600; color: var(--ink-soft);
  }
  .listing-card.co .listing-amenity-chip svg { color: var(--teal); }
  .listing-card.med .listing-amenity-chip svg { color: var(--brick); }

  .listing-footer {
    margin-top: auto; display: flex; align-items: center; justify-content: space-between;
    padding-top: 15px; border-top: 1px dashed var(--line);
  }
  .listing-footer .amount { font-family: 'Fraunces', serif; font-size: 1.28rem; font-weight: 600; color: var(--ink); }
  .listing-footer .unit { font-size: 0.68rem; color: var(--ink-faint); font-weight: 600; }

  .listing-cta {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 10px 15px; border-radius: 9px; border: none;
    font-size: 0.8rem; font-weight: 700; color: white; cursor: pointer;
    transition: all 0.3s;
  }
  .listing-card.co .listing-cta { background: var(--teal); }
  .listing-card.med .listing-cta { background: var(--brick); }
  .listing-cta:hover { transform: translateX(2px); filter: brightness(1.1); }

  @media (max-width: 640px) {
    .listing-media { height: 176px; }
    .listing-body { padding: 16px 16px 14px; }
  }

  /* ─── CARD IMAGE SLIDER (shared) ─── */
  .card-image-slider { position: relative; height: 100%; width: 100%; overflow: hidden; }
  .card-image-slider .card-slider-btn {
    position: absolute; top: 50%; transform: translateY(-50%);
    width: 28px; height: 28px; border-radius: 50%;
    background: rgba(18,24,31,0.55); border: 1px solid rgba(255,255,255,0.25);
    color: white; display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all 0.3s; z-index: 4; opacity: 0;
  }
  .card-image-slider:hover .card-slider-btn { opacity: 1; }
  .card-image-slider .card-slider-btn:hover { background: rgba(18,24,31,0.85); }
  .card-image-slider .card-slider-btn.prev { left: 4px; }
  .card-image-slider .card-slider-btn.next { right: 4px; }
  .card-image-slider img { width: 100%; height: 100%; object-fit: cover; }
  .card-image-slider .card-dots { position: absolute; bottom: 8px; left: 50%; transform: translateX(-50%); display: flex; gap: 4px; z-index: 4; }
  .card-image-slider .card-dots .dot { width: 5px; height: 5px; border-radius: 50%; background: rgba(255,255,255,0.4); cursor: pointer; border: none; padding: 0; transition: all 0.3s; }
  .card-image-slider .card-dots .dot.active { background: white; transform: scale(1.3); }

  /* ─── PLAIN CARDS (benefits / values) ─── */
  .plain-card {
    background: white; border: 1px solid var(--line); border-radius: 16px;
    padding: 28px 24px; height: 100%; display: flex; flex-direction: column;
    transition: all 0.35s cubic-bezier(0.16,1,0.3,1);
  }
  .plain-card:hover { transform: translateY(-5px); border-color: var(--ink); box-shadow: 0 20px 40px -24px rgba(18,24,31,0.2); }
  .plain-card .icon-wrapper {
    width: 46px; height: 46px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 16px; background: var(--paper-dim); color: var(--brass-deep);
  }
  .plain-card h3 { font-family: 'Fraunces', serif; font-size: 1.08rem; font-weight: 600; color: var(--ink); margin-bottom: 6px; }
  .plain-card p { font-size: 0.88rem; color: var(--ink-soft); line-height: 1.65; flex: 1; }

  /* ─── DARK FEATURE BAND ─── */
  .feature-band { background: var(--ink); color: var(--paper); }
  .feature-card {
    border-radius: 16px; padding: 28px 24px;
    border: 1px solid rgba(251,249,245,0.12);
    background: rgba(251,249,245,0.04);
    height: 100%; display: flex; flex-direction: column; position: relative;
    transition: all 0.35s;
  }
  .feature-card:hover { background: rgba(251,249,245,0.08); border-color: rgba(251,249,245,0.25); }
  .feature-card .feature-index {
    font-family: 'Fraunces', serif; font-size: 0.78rem; color: var(--brass);
    letter-spacing: 0.06em; margin-bottom: 14px;
  }
  .feature-card .feature-icon {
    width: 42px; height: 42px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    background: rgba(251,249,245,0.1); color: var(--brass); margin-bottom: 16px;
  }
  .feature-card h3 { font-family: 'Fraunces', serif; font-size: 1.05rem; font-weight: 600; margin-bottom: 6px; }
  .feature-card p { font-size: 0.85rem; color: rgba(251,249,245,0.65); line-height: 1.6; }

  /* ─── LOCATION LIST ─── */
  .location-list-item {
    display: flex; align-items: flex-start; gap: 16px;
    padding: 18px; border-radius: 14px;
    background: white; border: 1px solid var(--line);
    transition: all 0.3s;
  }
  .location-list-item:hover { border-color: var(--ink); transform: translateX(4px); }
  .location-list-item .loc-icon {
    width: 44px; height: 44px; min-width: 44px; border-radius: 11px;
    display: flex; align-items: center; justify-content: center;
    background: var(--ink); color: var(--paper); flex-shrink: 0;
  }
  .location-list-item h4 { font-family: 'Fraunces', serif; font-weight: 600; font-size: 1rem; color: var(--ink); margin-bottom: 2px; }
  .location-list-item p { font-size: 0.85rem; color: var(--ink-soft); line-height: 1.55; }

  .location-grid-images { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .location-grid-images .img-main { grid-row: span 2; border-radius: 16px; overflow: hidden; height: 280px; border: 1px solid var(--line); }
  .location-grid-images .img-side { border-radius: 16px; overflow: hidden; height: 134px; border: 1px solid var(--line); }
  .location-grid-images img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
  .location-grid-images div:hover img { transform: scale(1.05); }

  /* ─── SPECIALTIES ─── */
  .specialty-tile {
    padding: 18px 14px; border-radius: 14px; background: white;
    border: 1px solid var(--line); text-align: center; transition: all 0.35s;
  }
  .specialty-tile:hover { border-color: var(--ink); transform: translateY(-4px); box-shadow: 0 18px 30px -22px rgba(18,24,31,0.25); }
  .specialty-tile .icon-wrap {
    width: 46px; height: 46px; margin: 0 auto; border-radius: 12px;
    background: var(--paper-dim); display: flex; align-items: center; justify-content: center; color: var(--brass-deep);
  }
  .specialty-tile p { font-size: 0.75rem; color: var(--ink-soft); margin-top: 10px; font-weight: 600; }

  /* ─── FAQ ─── */
  .faq-item { border-radius: 14px; border: 1px solid var(--line); background: white; overflow: hidden; transition: border-color 0.3s; }
  .faq-item:hover { border-color: var(--ink); }
  .faq-item button { width: 100%; padding: 20px 22px; display: flex; align-items: center; justify-content: space-between; text-align: left; background: none; border: none; cursor: pointer; }
  .faq-item .faq-cat { font-size: 10px; color: var(--brass-deep); text-transform: uppercase; letter-spacing: 0.08em; font-weight: 700; }
  .faq-item .faq-q { font-family: 'Fraunces', serif; font-size: 1rem; font-weight: 500; color: var(--ink); margin-top: 3px; }
  .faq-item .faq-a { padding: 0 22px 20px; font-size: 0.9rem; color: var(--ink-soft); line-height: 1.7; border-top: 1px solid var(--line); padding-top: 14px; }

  /* ─── CONTACT ─── */
  .contact-band { background: var(--paper-dim); }
  .contact-info-item {
    display: flex; align-items: flex-start; gap: 14px; padding: 16px;
    border-radius: 14px; background: white; border: 1px solid var(--line); transition: all 0.3s;
  }
  .contact-info-item:hover { border-color: var(--ink); }
  .contact-info-item .icon-wrap {
    width: 40px; height: 40px; border-radius: 10px; background: var(--ink); color: var(--paper);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .contact-form {
    background: white; border: 1px solid var(--line); border-radius: 18px; padding: 28px;
  }
  .contact-form input, .contact-form textarea {
    width: 100%; padding: 13px 15px; border-radius: 10px;
    background: var(--paper-dim); border: 1px solid var(--line);
    color: var(--ink); font-size: 0.9rem; transition: all 0.25s;
  }
  .contact-form input::placeholder, .contact-form textarea::placeholder { color: var(--ink-faint); }
  .contact-form input:focus, .contact-form textarea:focus { outline: none; border-color: var(--ink); background: white; }
  .contact-submit {
    width: 100%; padding: 14px; font-size: 0.92rem; font-weight: 700; color: var(--paper);
    background: var(--ink); border: none; border-radius: 10px; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.3s;
  }
  .contact-submit:hover:not(:disabled) { background: var(--brass-deep); }
  .contact-submit:disabled { opacity: 0.6; cursor: not-allowed; }

  /* ─── MODAL ─── */
  .modal-overlay {
    position: fixed; inset: 0; z-index: 9999;
    background: rgba(18, 24, 31, 0.55); backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center; padding: 20px;
    animation: ix-fade 0.25s ease;
  }
  .modal-content {
    background: var(--paper); border-radius: 24px; max-width: 940px; width: 100%;
    max-height: 90vh; overflow-y: auto; position: relative;
    animation: ix-scale-in 0.3s cubic-bezier(0.16,1,0.3,1);
    box-shadow: 0 40px 100px rgba(18,24,31,0.35);
    scrollbar-width: none;
  }
  .modal-content::-webkit-scrollbar { width: 0; }
  .modal-close {
    position: sticky; top: 12px; float: right; width: 34px; height: 34px; border-radius: 50%;
    background: white; border: 1px solid var(--line); display: flex; align-items: center; justify-content: center;
    cursor: pointer; z-index: 20; margin: 12px 12px 0 0; transition: all 0.3s;
  }
  .modal-close:hover { background: var(--paper-dim); }

  .space-detail-modal { display: flex; flex-direction: column; }
  .space-detail-modal .modal-body { display: grid; grid-template-columns: 1fr 1fr; gap: 0; min-height: 460px; }
  .space-detail-modal .modal-image-section { position: relative; background: var(--paper-dim); min-height: 380px; overflow: hidden; }
  .space-detail-modal .image-slider { width: 100%; height: 100%; position: relative; }
  .space-detail-modal .slider-image { width: 100%; height: 100%; object-fit: cover; min-height: 380px; }
  .space-detail-modal .slider-btn {
    position: absolute; top: 50%; transform: translateY(-50%);
    width: 38px; height: 38px; border-radius: 50%;
    background: rgba(18,24,31,0.6); border: 1px solid rgba(255,255,255,0.2); color: white;
    display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 5;
  }
  .space-detail-modal .slider-btn.prev { left: 12px; }
  .space-detail-modal .slider-btn.next { right: 12px; }
  .space-detail-modal .image-dots { position: absolute; bottom: 16px; left: 50%; transform: translateX(-50%); display: flex; gap: 8px; z-index: 5; }
  .space-detail-modal .image-dots .dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.4); border: none; cursor: pointer; padding: 0; }
  .space-detail-modal .image-dots .dot.active { background: white; }
  .space-detail-modal .image-counter { position: absolute; bottom: 16px; right: 16px; background: rgba(18,24,31,0.6); color: white; padding: 4px 12px; border-radius: 999px; font-size: 11px; z-index: 5; }
  .space-detail-modal .space-type-badge { position: absolute; top: 16px; left: 16px; padding: 6px 16px; border-radius: 999px; font-size: 11px; font-weight: 700; color: white; z-index: 5; }

  .space-detail-modal .modal-content-section { padding: 32px 28px; display: flex; flex-direction: column; overflow-y: auto; background: var(--paper); }
  .space-detail-modal .space-title { font-family: 'Fraunces', serif; font-size: 1.5rem; font-weight: 600; color: var(--ink); margin-bottom: 6px; }
  .space-detail-modal .space-location { font-size: 0.86rem; color: var(--ink-faint); display: flex; gap: 6px; margin-bottom: 14px; }
  .space-detail-modal .space-description { font-size: 0.9rem; color: var(--ink-soft); line-height: 1.7; margin-bottom: 16px; flex: 1; }
  .space-detail-modal .space-features { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 16px; }
  .space-detail-modal .feature-item { display: flex; align-items: center; gap: 8px; font-size: 0.8rem; color: var(--ink-soft); padding: 7px 10px; background: var(--paper-dim); border-radius: 8px; }
  .space-detail-modal .feature-item svg { color: var(--brass-deep); flex-shrink: 0; }
  .space-detail-modal .space-price { display: flex; align-items: baseline; gap: 8px; padding-top: 16px; border-top: 1px solid var(--line); margin-bottom: 16px; }
  .space-detail-modal .space-price .amount { font-family: 'Fraunces', serif; font-size: 1.7rem; font-weight: 600; color: var(--ink); }
  .space-detail-modal .space-price .period { font-size: 0.86rem; color: var(--ink-faint); }
  .btn-book-now-modal {
    width: 100%; padding: 15px; background: var(--ink); color: var(--paper); border: none; border-radius: 12px;
    font-size: 0.95rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center;
    gap: 8px; margin-top: auto; transition: all 0.3s;
  }
  .btn-book-now-modal:hover { background: var(--brass-deep); }

  @media (max-width: 768px) {
    .space-detail-modal .modal-body { grid-template-columns: 1fr; }
    .space-detail-modal .modal-image-section, .space-detail-modal .slider-image { min-height: 260px; }
    .space-detail-modal .modal-content-section { padding: 22px 18px; }
  }

  /* ─── DOCTOR CHAMBER PAGE ─── */
  .doctor-hero-section { padding: 160px 32px 80px; background: var(--brick-tint); }
  .doctor-hero-content { max-width: 1200px; margin: 0 auto; }
  .doctor-hero-text-box { max-width: 640px; }
  .doctor-hero-title { font-family: 'Fraunces', serif; font-weight: 400; font-size: clamp(2.4rem, 4vw, 3.4rem); line-height: 1.12; color: var(--ink); margin: 16px 0 18px; }
  .doctor-hero-title em { font-style: italic; color: var(--brick); font-weight: 500; }
  .doctor-hero-desc { font-size: 1.02rem; line-height: 1.75; color: var(--ink-soft); max-width: 500px; }
  .doctor-stats {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 32px;
    background: white; border: 1px solid var(--line); border-radius: 16px; padding: 22px 26px;
  }
  .doctor-stat-item { text-align: center; }
  .doctor-stat-item .number { font-family: 'Fraunces', serif; font-size: 1.9rem; font-weight: 600; color: var(--brick); }
  .doctor-stat-item .label { font-size: 0.72rem; font-weight: 600; color: var(--ink-faint); text-transform: uppercase; letter-spacing: 0.05em; margin-top: 2px; }
  .doctor-features-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-top: 40px; }
  .doctor-feature-card { background: white; border: 1px solid var(--line); border-radius: 16px; padding: 26px 18px; text-align: center; transition: all 0.35s; }
  .doctor-feature-card:hover { transform: translateY(-6px); border-color: var(--brick); box-shadow: 0 20px 40px -26px rgba(139,68,51,0.3); }
  .doctor-feature-card .icon-wrap { width: 50px; height: 50px; border-radius: 13px; background: var(--brick-tint); display: flex; align-items: center; justify-content: center; margin: 0 auto 14px; color: var(--brick); }
  .doctor-feature-card h4 { font-family: 'Fraunces', serif; font-size: 0.95rem; font-weight: 600; color: var(--ink); margin-bottom: 4px; }
  .doctor-feature-card p { font-size: 0.8rem; color: var(--ink-soft); line-height: 1.5; }
  .doctor-cta-section { background: var(--ink); border-radius: 22px; padding: 52px 40px; margin-top: 60px; text-align: center; color: var(--paper); }
  .doctor-cta-section h2 { font-family: 'Fraunces', serif; font-size: 2rem; font-weight: 500; margin-bottom: 10px; }
  .doctor-cta-section p { font-size: 0.98rem; opacity: 0.75; max-width: 480px; margin: 0 auto 26px; }
  .doctor-cta-btn {
    display: inline-flex; align-items: center; gap: 10px; padding: 14px 32px;
    background: var(--brass); color: var(--ink); border: none; border-radius: 12px;
    font-size: 0.95rem; font-weight: 700; cursor: pointer; transition: all 0.3s;
  }
  .doctor-cta-btn:hover { background: white; }

  @media (max-width: 768px) {
    .doctor-stats { grid-template-columns: 1fr 1fr 1fr; padding: 16px; gap: 10px; }
    .doctor-stat-item .number { font-size: 1.3rem; }
    .doctor-features-grid { grid-template-columns: 1fr 1fr; }
    .doctor-cta-section { padding: 32px 20px; }
  }
  @media (max-width: 480px) {
    .doctor-features-grid { grid-template-columns: 1fr; }
    .doctor-stats { grid-template-columns: 1fr; }
  }

  /* ─── FOOTER ─── */
  .site-footer { background: var(--ink); color: rgba(251,249,245,0.7); }
  .site-footer h4 { color: var(--paper); font-family: 'Fraunces', serif; font-weight: 600; font-size: 0.95rem; margin-bottom: 16px; }
  .site-footer a, .site-footer button { color: rgba(251,249,245,0.62); font-size: 0.87rem; transition: all 0.25s; }
  .site-footer a:hover, .site-footer button:hover { color: var(--brass); transform: translateX(3px); }

  /* mobile drawer */
  .mobile-menu-close {
    position: absolute; top: 18px; right: 18px; padding: 8px; border-radius: 50%;
    background: var(--paper-dim); border: 1px solid var(--line); cursor: pointer;
  }
`;

// ─── HOOKS ───
const useScrollReveal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) setIsVisible(true);
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => { if (ref.current) observer.unobserve(ref.current); };
  }, [isVisible]);

  return { ref, isVisible };
};

const RevealSection = ({ children, delay = 0, className = "" }) => {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div ref={ref} className={`reveal ${isVisible ? "visible" : ""} ${className}`} style={{ transitionDelay: `${delay}s` }}>
      {children}
    </div>
  );
};

// ─── THEME (kept for API compatibility) ───
const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  useEffect(() => {
    document.documentElement.className = "light";
  }, []);
  return <ThemeContext.Provider value={{ theme: "light", toggleTheme: () => {} }}>{children}</ThemeContext.Provider>;
};

const useTheme = () => useContext(ThemeContext);

// ─── COUNTER ───
const Counter = ({ target, suffix = "", duration = 1400 }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !isVisible) setIsVisible(true);
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => { if (ref.current) observer.unobserve(ref.current); };
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;
    let startTime;
    const update = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }, [isVisible, target, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
};

// ─── IMAGE SLIDER ───
const ImageSlider = ({ images, alt, className = "" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  if (!images || images.length === 0) return null;

  const nextSlide = (e) => { e.stopPropagation(); setCurrentIndex((p) => (p + 1) % images.length); };
  const prevSlide = (e) => { e.stopPropagation(); setCurrentIndex((p) => (p - 1 + images.length) % images.length); };
  const goToSlide = (index, e) => { if (e) e.stopPropagation(); setCurrentIndex(index); };

  return (
    <div className={`card-image-slider ${className}`}>
      <img src={images[currentIndex]} alt={alt || "Space image"} loading="lazy" />
      {images.length > 1 && (
        <>
          <button className="card-slider-btn prev" onClick={prevSlide} aria-label="Previous image"><ChevronLeft size={14} /></button>
          <button className="card-slider-btn next" onClick={nextSlide} aria-label="Next image"><ChevronRight size={14} /></button>
          <div className="card-dots">
            {images.map((_, index) => (
              <button key={index} className={`dot ${index === currentIndex ? "active" : ""}`} onClick={(e) => goToSlide(index, e)} aria-label={`Go to image ${index + 1}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// ─── LEDGER (category divider, signature element) ───
const CategoryLedger = ({ leftLabel, rightLabel, leftCount, rightCount, onLeftClick, onRightClick }) => (
  <div className="ledger">
    <button type="button" onClick={onLeftClick} className="ledger-tab co" style={{ cursor: "pointer", border: "none", background: "none", width: "100%" }}>
      <span className="ledger-index">01</span>
      <span className="ledger-icon"><Building2 size={19} /></span>
      <span style={{ textAlign: "left" }}>
        <h4>{leftLabel}</h4>
        <p>{leftCount} spaces listed</p>
      </span>
    </button>
    <button type="button" onClick={onRightClick} className="ledger-tab med" style={{ cursor: "pointer", border: "none", background: "none", width: "100%" }}>
      <span className="ledger-index">02</span>
      <span className="ledger-icon"><Stethoscope size={19} /></span>
      <span style={{ textAlign: "left" }}>
        <h4>{rightLabel}</h4>
        <p>{rightCount} chambers listed</p>
      </span>
    </button>
  </div>
);

// ─── AMENITY HELPERS ───
const AMENITY_ICON_MAP = {
  wifi: Wifi, parking: ParkingCircle, lockers: Lock, comfortSeating: Sofa,
  privateWashroom: Bath, secureAccess: Shield, coffee: Coffee, gym: Activity,
  ac: Fan, tv: Tv, printer: Printer, phone: Phone
};
const AMENITY_LABEL_MAP = {
  wifi: "WiFi", parking: "Parking", lockers: "Lockers", comfortSeating: "Seating",
  privateWashroom: "Washroom", secureAccess: "Secure", coffee: "Coffee", gym: "Gym",
  ac: "AC", tv: "TV", printer: "Printer", phone: "Phone"
};

const getTopAmenities = (cabin, max = 3) => {
  const amenities = cabin?.amenities || {};
  const keys = Object.keys(amenities).filter((k) => amenities[k] && AMENITY_ICON_MAP[k]);
  if (keys.length === 0) return ["wifi", "secureAccess", "ac"];
  return keys.slice(0, max);
};

const getDeterministicRating = (seed = "") => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) % 997;
  return (4.3 + (hash % 7) / 10).toFixed(1);
};

// ─── LISTING CARD ───
const ListingCard = ({ cabin, variant, onCardClick, onCtaClick, index = 0 }) => {
  const isMedical = variant === "medical";
  const fallbackImages = isMedical ? DOCTOR_SPACE_IMAGES : IRYAX_SPACE_IMAGES;
  const cabinImages = cabin.images && cabin.images.length > 0
    ? cabin.images.map((img) => `https://spaceapi.iryax.com/${img}`)
    : [fallbackImages[index % fallbackImages.length]];

  const topAmenities = getTopAmenities(cabin, 3);
  const rating = getDeterministicRating(cabin._id || cabin.name || `${index}`);
  const TypeIcon = isMedical ? Stethoscope : Building2;

  return (
    <div className={`listing-card ${isMedical ? "med" : "co"}`} onClick={() => onCardClick(cabin)}>
      <div className="listing-media">
        <ImageSlider images={cabinImages} alt={cabin.name} />
        <div className="listing-badge-row">
          <span className={`listing-type-chip ${isMedical ? "med" : "co"}`}>
            <TypeIcon size={11} /> {isMedical ? "Medical Chamber" : "Co-Working"}
          </span>
          <span className="listing-avail-chip"><span className="avail-dot" /> Available</span>
        </div>
        <button className="listing-quickview" onClick={(e) => { e.stopPropagation(); onCardClick(cabin); }} aria-label="Quick view">
          <Maximize2 size={14} color={isMedical ? "#8B4433" : "#23474B"} />
        </button>
        <div className="listing-price-float">
          <div className="amt">₹{cabin.price?.toLocaleString("en-IN") || 0}</div>
          <div className="per">per day</div>
        </div>
      </div>

      <div className="listing-body">
        <div className="listing-title-row">
          <h3 className="line-clamp-2">{cabin.name}</h3>
          <span className="listing-rating"><Star size={11} /> {rating}</span>
        </div>
        <div className="listing-loc">
          <MapPin size={13} />
          <span className="line-clamp-1">{cabin.address || "Location not specified"}</span>
        </div>
        <div className="listing-amenities">
          {topAmenities.map((key) => {
            const Icon = AMENITY_ICON_MAP[key] || BadgeCheck;
            return <span key={key} className="listing-amenity-chip"><Icon size={12} /> {AMENITY_LABEL_MAP[key] || key}</span>;
          })}
        </div>
        <div className="listing-footer">
          <div>
            <div className="amount">₹{cabin.price?.toLocaleString("en-IN") || 0}</div>
            <div className="unit">per day</div>
          </div>
          <button className="listing-cta" onClick={(e) => { e.stopPropagation(); onCtaClick(cabin); }}>
            View details <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── SPACE DETAIL MODAL ───
const SpaceDetailModal = ({ isOpen, onClose, space, onBookClick }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  if (!isOpen || !space) return null;

  const images = space.images || [space.image];
  const imageUrls = images.map((img) => (img && img.startsWith("http") ? img : `https://spaceapi.iryax.com/${img}`));

  const nextImage = (e) => { if (e) e.stopPropagation(); setCurrentImageIndex((p) => (p + 1) % imageUrls.length); };
  const prevImage = (e) => { if (e) e.stopPropagation(); setCurrentImageIndex((p) => (p - 1 + imageUrls.length) % imageUrls.length); };
  const goToImage = (index, e) => { if (e) e.stopPropagation(); setCurrentImageIndex(index); };

  const getFeatures = (space) => {
    const features = [];
    const amenities = space.amenities || {};
    if (amenities.wifi) features.push({ icon: Wifi, label: "High-Speed WiFi" });
    if (amenities.parking) features.push({ icon: ParkingCircle, label: "Parking" });
    if (amenities.lockers) features.push({ icon: Lock, label: "Lockers" });
    if (amenities.comfortSeating) features.push({ icon: Sofa, label: "Comfort Seating" });
    if (amenities.privateWashroom) features.push({ icon: Bath, label: "Private Washroom" });
    if (amenities.secureAccess) features.push({ icon: Shield, label: "Secure Access" });
    if (amenities.coffee) features.push({ icon: Coffee, label: "Coffee" });
    if (amenities.gym) features.push({ icon: Activity, label: "Gym" });
    if (amenities.ac) features.push({ icon: Fan, label: "AC" });
    if (amenities.tv) features.push({ icon: Tv, label: "TV" });
    if (amenities.printer) features.push({ icon: Printer, label: "Printer" });
    if (amenities.phone) features.push({ icon: Phone, label: "Phone" });
    return features;
  };

  const features = getFeatures(space);
  const isMedical = space.type === "medical";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><X size={17} /></button>

        <div className="space-detail-modal">
          <div className="modal-body">
            <div className="modal-image-section">
              <div className="image-slider">
                <img src={imageUrls[currentImageIndex] || IRYAX_SPACE_IMAGES[0]} alt={space.name} className="slider-image" />
                {imageUrls.length > 1 && (
                  <>
                    <button className="slider-btn prev" onClick={prevImage} aria-label="Previous image"><ChevronLeft size={18} /></button>
                    <button className="slider-btn next" onClick={nextImage} aria-label="Next image"><ChevronRight size={18} /></button>
                    <div className="image-dots">
                      {imageUrls.map((_, index) => (
                        <button key={index} className={`dot ${index === currentImageIndex ? "active" : ""}`} onClick={(e) => goToImage(index, e)} aria-label={`Go to image ${index + 1}`} />
                      ))}
                    </div>
                    <span className="image-counter">{currentImageIndex + 1} / {imageUrls.length}</span>
                  </>
                )}
              </div>
              <span className="space-type-badge" style={{ background: isMedical ? "#8B4433" : "#23474B" }}>
                {isMedical ? "Medical Chamber" : "Co-Working"}
              </span>
            </div>

            <div className="modal-content-section">
              <h3 className="space-title">{space.name}</h3>
              <div className="space-location"><MapPin size={15} /><span>{space.address || "Location not specified"}</span></div>
              <p className="space-description">
                {space.description || (isMedical
                  ? "A fully-equipped medical consultation chamber designed for healthcare professionals."
                  : "A fully-equipped modern workspace designed for professionals.")}
              </p>

              <div className="space-features">
                {(features.length ? features : [
                  { icon: Wifi, label: "High-Speed WiFi" },
                  { icon: ParkingCircle, label: "Parking" },
                  { icon: Lock, label: "Lockers" },
                  { icon: Sofa, label: "Comfort Seating" }
                ]).map((feature, i) => (
                  <div key={i} className="feature-item"><feature.icon size={15} /><span>{feature.label}</span></div>
                ))}
              </div>

              <div className="space-price">
                <span className="amount">₹{space.price?.toLocaleString("en-IN") || 0}</span>
                <span className="period">/ day</span>
              </div>

              <button className="btn-book-now-modal" onClick={() => onBookClick(space)}>
                Book now <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── DOCTOR CHAMBER PAGE ───
const DoctorChamberPage = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="ix-root min-h-screen">
      <nav className={`navbar-custom ${scrolled ? "navbar-scrolled" : ""}`}>
        <div className="navbar-inner">
          <button onClick={() => navigate("/")} className="flex items-center gap-3">
            <div className="navbar-logo"><img src={logo} alt="Logo" /></div>
            <span className="navbar-brand hidden sm:flex">IRYAX SPACE</span>
          </button>
          <div className="nav-links">
            <button onClick={() => navigate("/")} className="navbar-link">Home</button>
            <button onClick={() => navigate("/#benefits")} className="navbar-link">Benefits</button>
            <button onClick={() => navigate("/#faq")} className="navbar-link">FAQ</button>
            <button onClick={() => navigate("/#contact")} className="navbar-link">Contact</button>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate("/login")} className="navbar-signin hidden sm:block">Sign in</button>
            <button onClick={() => navigate("/login")} className="navbar-btn">Start now</button>
            <button onClick={() => navigate("/")} className="navbar-menu-btn" aria-label="Go back"><X size={20} /></button>
          </div>
        </div>
      </nav>

      <section className="doctor-hero-section">
        <div className="doctor-hero-content">
          <div className="doctor-hero-text-box">
            <RevealSection>
              <span className="ix-eyebrow"><span className="dot" style={{ background: "#8B4433" }} />Doctor&rsquo;s Chamber</span>
            </RevealSection>
            <RevealSection delay={0.1}>
              <h1 className="doctor-hero-title">A consultation room<br /><em>ready before you arrive.</em></h1>
            </RevealSection>
            <RevealSection delay={0.2}>
              <p className="doctor-hero-desc">
                Fully-equipped chambers with reception support, flexible hours, and complete admin handling — so you can walk in and see patients, nothing else to set up.
              </p>
            </RevealSection>
            <RevealSection delay={0.3}>
              <div className="doctor-stats">
                <div className="doctor-stat-item"><div className="number">50+</div><div className="label">Chambers</div></div>
                <div className="doctor-stat-item"><div className="number">24/7</div><div className="label">Access</div></div>
                <div className="doctor-stat-item"><div className="number">100+</div><div className="label">Doctors</div></div>
              </div>
            </RevealSection>
            <RevealSection delay={0.4}>
              <div className="hero-buttons">
                <button onClick={() => navigate("/login")} className="btn-primary" style={{ background: "#8B4433" }}>
                  <Stethoscope size={16} /> Book your chamber <ArrowRight size={16} />
                </button>
                <button onClick={() => navigate("/#contact")} className="btn-secondary">
                  <Phone size={16} /> Contact us
                </button>
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      <section className="py-24 px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="section-head mx-auto text-center" style={{ maxWidth: 620 }}>
            <RevealSection><span className="ix-eyebrow"><span className="dot" style={{ background: "#8B4433" }} />Why practice here</span></RevealSection>
            <RevealSection delay={0.1}><h2>Everything a clinical practice needs, already in place</h2></RevealSection>
          </div>

          <div className="doctor-features-grid">
            {[
              { icon: Stethoscope, title: "Medical equipment", desc: "Examination essentials and clinical tools on site." },
              { icon: UserCheck, title: "Admin support", desc: "Reception, billing, and patient scheduling handled for you." },
              { icon: Clock, title: "Flexible hours", desc: "Book by the hour, day, or a standing weekly slot." },
              { icon: Award, title: "Prime locations", desc: "High-visibility chambers in established medical areas." }
            ].map((feature, i) => (
              <RevealSection key={i} delay={i * 0.1}>
                <div className="doctor-feature-card">
                  <div className="icon-wrap"><feature.icon size={22} /></div>
                  <h4>{feature.title}</h4>
                  <p>{feature.desc}</p>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <RevealSection>
            <div className="doctor-cta-section">
              <h2>Start seeing patients this week</h2>
              <p>Join 100+ healthcare professionals who moved their practice into a chamber that was ready on day one.</p>
              <button onClick={() => navigate("/login")} className="doctor-cta-btn">Get started <ArrowRight size={18} /></button>
            </div>
          </RevealSection>
        </div>
      </section>

      <footer className="site-footer py-12 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm">© IRYAX SPACE. All rights reserved.</p>
          <p className="text-xs mt-2 tracking-wider uppercase" style={{ opacity: 0.5 }}>Doctor&rsquo;s Chamber — IRYAX SPACE</p>
        </div>
      </footer>
    </div>
  );
};

// ─── MAIN PAGE ───
const PromotionalPage = () => {
  useTheme();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", address: "", message: "" });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showThankYouPopup, setShowThankYouPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [cabins, setCabins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [isSpaceDetailOpen, setIsSpaceDetailOpen] = useState(false);

  useEffect(() => {
    const fetchCabins = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://spaceapi.iryax.com/api/cabins");
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setCabins(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCabins();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const toggleFaq = (index) => setOpenFaq(openFaq === index ? null : index);

  const coworkingCabins = cabins.filter((c) => c.type === "coworking" || c.type === "co-working");
  const medicalCabins = cabins.filter((c) => c.type === "medical");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      setSubmitError("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("https://spaceapi.iryax.com/api/cabins/sendquery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address || "",
          message: formData.message
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setFormSubmitted(true);
        setShowThankYouPopup(true);
        setFormData({ name: "", email: "", phone: "", address: "", message: "" });
        setTimeout(() => { setShowThankYouPopup(false); setFormSubmitted(false); }, 5000);
      } else {
        setSubmitError(data.message || "Failed to submit query. Please try again.");
      }
    } catch (err) {
      console.error("Submit query error:", err);
      setSubmitError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBookClick = () => navigate("/login");

  const handleSpaceClick = (space) => {
    const images = space.images && space.images.length > 0
      ? space.images.map((img) => `https://spaceapi.iryax.com/${img}`)
      : [IRYAX_SPACE_IMAGES[0]];
    setSelectedSpace({ ...space, images, image: images[0] });
    setIsSpaceDetailOpen(true);
  };

  const closeSpaceDetail = () => { setIsSpaceDetailOpen(false); setSelectedSpace(null); };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  const stats = [
    { label: "Professionals trust us", value: 120, suffix: "+" },
    { label: "Workspaces", value: cabins.length || 15, suffix: "+" },
    { label: "Projects completed", value: 2500, suffix: "+" },
    { label: "Specializations", value: 20, suffix: "+" },
    { label: "Support hours", value: 24, suffix: "/7" }
  ];

  const specialties = [
    "Medical Practice", "Dental Clinic", "Physiotherapy", "Psychology",
    "Cardiology", "Neurology", "Dermatology", "Orthopedic",
    "Pediatrics", "Gynecology", "ENT Specialist", "Ophthalmology",
    "General Medicine", "Radiology", "Pathology", "Dentistry"
  ];

  const specialtyIconMap = {
    "Medical Practice": Stethoscope, "Dental Clinic": Users, "Physiotherapy": Activity,
    "Psychology": Brain, "Cardiology": HeartPulse, "Neurology": Brain, "Dermatology": EyeOff,
    "Orthopedic": Bone, "Pediatrics": UsersRound, "Gynecology": Heart, "ENT Specialist": Stethoscope,
    "Ophthalmology": Eye, "General Medicine": Stethoscope, "Radiology": Microscope,
    "Pathology": TestTube, "Dentistry": Users
  };

  const benefits = [
    { icon: Shield, title: "No long leases", desc: "Avoid multi-year commitments and heavy deposits." },
    { icon: Wallet, title: "Lower running costs", desc: "Pay for what you use — no hidden charges." },
    { icon: Users, title: "Admin, handled", desc: "We manage staff, billing, and daily operations." },
    { icon: Sparkles, title: "Modern infrastructure", desc: "Fully-equipped spaces with the tools you need." }
  ];

  const features = [
    { icon: Gauge, title: "Quick setup", desc: "Move into a fully-equipped space within 24 hours." },
    { icon: ArrowUpRight, title: "Room to grow", desc: "Scale your practice without owning property." },
    { icon: Award, title: "Premium quality", desc: "High-end infrastructure at a fair price." },
    { icon: Target, title: "Prime locations", desc: "High-visibility spaces in premium areas." }
  ];

  const locationList = [
    { icon: Building2, title: "High-visibility locations", desc: "Premium workspaces in areas with strong foot traffic." },
    { icon: Wallet, title: "An easy start", desc: "Minimal upfront investment — everything is set up for you." },
    { icon: ShieldCheck, title: "Zero operational stress", desc: "We handle staff, billing, and daily operations." }
  ];

  const faqs = [
    { category: "Workspaces", q: "What types of workspaces are available?", a: "We offer fully-equipped private offices, meeting rooms, and collaborative spaces." },
    { category: "Flexibility", q: "Do I need to sign a long-term lease?", a: "No. Our model is fully flexible — book by the hour, day, or month." },
    { category: "Facilities", q: "What facilities are included?", a: "Every space includes high-speed WiFi, comfortable work areas, and 24/7 security." },
    { category: "Payment", q: "What payment methods are accepted?", a: "We accept credit and debit cards, UPI, net banking, and offer flexible payment plans." },
    { category: "Support", q: "What administrative support do you provide?", a: "Full administrative support, including reception services and billing assistance." },
    { category: "Earning", q: "How can I earn from my unused space?", a: "List your space on our platform and connect with verified professionals." }
  ];

  const missionVisionData = [
    { title: "Our mission", icon: Target, description: "To give professionals flexible, fully-equipped spaces that remove the cost and commitment of a lease, so they can focus entirely on their work." },
    { title: "Our vision", icon: Eye, description: "A workspace ecosystem where every professional can access premium infrastructure without the burden of ownership." }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#FBF9F5" }}>
        <div className="text-center">
          <div className="w-12 h-12 border-2 rounded-full mx-auto" style={{ borderColor: "#E3DDCE", borderTopColor: "#12181F", animation: "ix-spin 0.8s linear infinite" }} />
          <p className="mt-4" style={{ color: "#4A5160" }}>Loading spaces…</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="ix-root min-h-screen">

        <SpaceDetailModal isOpen={isSpaceDetailOpen} onClose={closeSpaceDetail} space={selectedSpace} onBookClick={handleBookClick} />

        {showThankYouPopup && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4" style={{ background: "rgba(18,24,31,0.55)" }}>
            <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl relative" style={{ border: "1px solid #E3DDCE" }}>
              <button onClick={() => setShowThankYouPopup(false)} className="absolute top-4 right-4 p-2 rounded-full" style={{ background: "#F1EDE3" }}>
                <X size={18} />
              </button>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "#E9EFEE" }}>
                  <CheckCircle size={32} color="#23474B" />
                </div>
                <h3 className="ix-serif text-2xl font-semibold mb-2">Message sent</h3>
                <p style={{ color: "#4A5160" }}>Thanks for reaching out.</p>
                <p className="text-sm mt-1" style={{ color: "#8A8F99" }}>We&rsquo;ll get back to you shortly.</p>
                <button onClick={() => setShowThankYouPopup(false)} className="mt-6 px-6 py-2.5 rounded-xl text-white" style={{ background: "#12181F" }}>
                  Got it
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Navbar */}
        <nav className={`navbar-custom ${scrolled ? "navbar-scrolled" : ""}`}>
          <div className="navbar-inner">
            <button onClick={scrollToTop} className="flex items-center gap-3">
              <div className="navbar-logo"><img src={logo} alt="Logo" /></div>
              <span className="navbar-brand hidden sm:flex">IRYAX SPACE</span>
            </button>

            <div className="nav-links">
              <button onClick={() => scrollToSection("benefits")} className="navbar-link">Benefits</button>
              <button onClick={() => scrollToSection("coworking-section")} className="navbar-link">Co-working</button>
              <button onClick={() => navigate("/doctor-chamber")} className="navbar-link">Doctor&rsquo;s Chamber</button>
              <button onClick={() => scrollToSection("specialties")} className="navbar-link">Specialties</button>
              <button onClick={() => scrollToSection("mission-vision")} className="navbar-link">About</button>
              <button onClick={() => scrollToSection("faq")} className="navbar-link">FAQ</button>
              <button onClick={() => scrollToSection("contact")} className="navbar-link">Contact</button>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => navigate("/login")} className="navbar-signin hidden sm:block">Sign in</button>
              <button onClick={() => navigate("/login")} className="navbar-btn"><Layout size={14} /> Start now</button>
              <button onClick={() => setMobileOpen(!mobileOpen)} className="navbar-menu-btn" aria-label="Toggle menu">
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile drawer */}
        <div
          className="fixed inset-0 z-40 pt-24 px-6 transition-all duration-400"
          style={{
            background: "#FBF9F5",
            opacity: mobileOpen ? 1 : 0,
            pointerEvents: mobileOpen ? "auto" : "none"
          }}
        >
          <button onClick={() => setMobileOpen(false)} className="mobile-menu-close" aria-label="Close menu"><X size={20} /></button>
          <div className="flex flex-col gap-2 max-w-sm mx-auto mt-6">
            {[
              ["Benefits", "benefits"], ["Co-working Space", "coworking-section"],
              ["Specialties", "specialties"], ["About", "mission-vision"],
              ["FAQ", "faq"], ["Contact", "contact"]
            ].map(([label, id]) => (
              <button key={id} onClick={() => { setMobileOpen(false); scrollToSection(id); }} className="px-4 py-3.5 text-left rounded-xl font-medium" style={{ background: "#F1EDE3" }}>
                {label}
              </button>
            ))}
            <button onClick={() => { setMobileOpen(false); navigate("/doctor-chamber"); }} className="px-4 py-3.5 text-left rounded-xl font-medium" style={{ background: "#F1EDE3" }}>
              Doctor&rsquo;s Chamber
            </button>
            <div className="h-px my-1" style={{ background: "#E3DDCE" }} />
            <button onClick={() => { navigate("/login"); setMobileOpen(false); }} className="px-4 py-3.5 text-center text-white rounded-xl font-semibold" style={{ background: "#12181F" }}>
              Start now
            </button>
          </div>
        </div>

        {/* Hero */}
        <section className="hero-section">
          <div className="hero-grid">
            <div>
              <RevealSection>
                <span className="ix-eyebrow"><span className="dot" />India&rsquo;s directory for professional space</span>
              </RevealSection>
              <RevealSection delay={0.1}>
                <h1 className="hero-title ix-serif">
                  A space that&rsquo;s ready<br /><em>the day you book it.</em>
                </h1>
              </RevealSection>
              <RevealSection delay={0.2}>
                <p className="hero-desc">
                  Fully-equipped co-working desks and doctor&rsquo;s chambers, on flexible terms. No lease, no setup, no admin — just walk in and get to work.
                </p>
              </RevealSection>
              <RevealSection delay={0.3}>
                <div className="hero-buttons">
                  <button onClick={() => navigate("/login")} className="btn-primary">
                    <Layout size={16} /> Start your journey <ArrowRight size={16} />
                  </button>
                  <button onClick={() => scrollToSection("coworking-section")} className="btn-secondary">
                    <Eye size={16} /> Browse spaces
                  </button>
                </div>
              </RevealSection>
            </div>

            <RevealSection delay={0.15}>
              <div className="hero-figure">
                <img src={IRYAX_HERO_IMAGE} alt="IRYAX SPACE workspace" />
               
              </div>
            </RevealSection>
          </div>
        </section>

        {/* Stats */}
        <section className="stats-strip py-14 px-8">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-6">
            {stats.map((stat, i) => (
              <RevealSection key={i} delay={i * 0.06}>
                <div className="text-center">
                  <div className="stat-num ix-serif">
                    {stat.label === "Workspaces" ? cabins.length || 15 : <Counter target={stat.value} suffix={stat.suffix} />}
                  </div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              </RevealSection>
            ))}
          </div>
        </section>

        {/* Ledger / category divider */}
        <div className="py-16 px-6">
          <RevealSection>
            <CategoryLedger
              leftLabel="Co-Working Spaces"
              rightLabel="Medical Chambers"
              leftCount={coworkingCabins.length}
              rightCount={medicalCabins.length}
              onLeftClick={() => scrollToSection("coworking-section")}
              onRightClick={() => scrollToSection("medical-section")}
            />
          </RevealSection>
        </div>

        {/* Co-Working Section */}
        <section id="coworking-section" className="py-8 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="section-head mx-auto text-center">
              <RevealSection><span className="ix-eyebrow"><span className="dot" style={{ background: "#23474B" }} />Section 01 — Co-Working</span></RevealSection>
              <RevealSection delay={0.1}><h2>Desks and private rooms for focused work</h2></RevealSection>
              <RevealSection delay={0.2}><p className="mx-auto">Flexible workspaces built for freelancers, startups, and growing teams.</p></RevealSection>
            </div>

            {coworkingCabins.length > 0 && (
              <RevealSection delay={0.15}>
                <div className="section-toolbar justify-center">
                  <span className="toolbar-pill co"><Building2 size={14} /> {coworkingCabins.length} live spaces</span>
                  <span className="toolbar-pill co"><Gauge size={14} /> Instant booking</span>
                  <span className="toolbar-pill co"><ShieldCheck size={14} /> Verified listings</span>
                </div>
              </RevealSection>
            )}

            {coworkingCabins.length === 0 ? (
              <div className="text-center py-16">
                <Building2 size={44} className="mx-auto mb-4" color="#C9C2AF" />
                <p style={{ color: "#8A8F99" }}>No co-working spaces available right now.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
                {coworkingCabins.map((cabin, i) => (
                  <RevealSection key={cabin._id} delay={i * 0.08}>
                    <ListingCard cabin={cabin} variant="coworking" index={i} onCardClick={handleSpaceClick} onCtaClick={handleSpaceClick} />
                  </RevealSection>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Medical Chambers Section */}
        <section id="medical-section" className="py-8 px-6" style={{ background: "#FBF6F4" }}>
          <div className="max-w-6xl mx-auto py-8">
            <div className="section-head mx-auto text-center">
              <RevealSection><span className="ix-eyebrow"><span className="dot" style={{ background: "#8B4433" }} />Section 02 — Medical Chambers</span></RevealSection>
              <RevealSection delay={0.1}><h2>Consultation rooms ready for patients</h2></RevealSection>
              <RevealSection delay={0.2}><p className="mx-auto">Fully-equipped chambers for healthcare professionals to practice with confidence.</p></RevealSection>
            </div>

            {medicalCabins.length > 0 && (
              <RevealSection delay={0.15}>
                <div className="section-toolbar justify-center">
                  <span className="toolbar-pill med"><Stethoscope size={14} /> {medicalCabins.length} chambers</span>
                  <span className="toolbar-pill med"><ShieldCheck size={14} /> Hygiene certified</span>
                  <span className="toolbar-pill med"><Clock size={14} /> 24/7 access</span>
                </div>
              </RevealSection>
            )}

            {medicalCabins.length === 0 ? (
              <div className="text-center py-16">
                <Stethoscope size={44} className="mx-auto mb-4" color="#D9C3BA" />
                <p style={{ color: "#8A8F99" }}>No medical chambers available right now.</p>
                <button onClick={() => navigate("/doctor-chamber")} className="mt-5 px-6 py-3 text-sm font-semibold text-white rounded-xl inline-flex items-center gap-2" style={{ background: "#8B4433" }}>
                  <Stethoscope size={16} /> Explore Doctor&rsquo;s Chamber
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
                {medicalCabins.map((cabin, i) => (
                  <RevealSection key={cabin._id} delay={i * 0.08}>
                    <ListingCard cabin={cabin} variant="medical" index={i} onCardClick={handleSpaceClick} onCtaClick={handleSpaceClick} />
                  </RevealSection>
                ))}
              </div>
            )}

            <div className="text-center mt-12">
              <RevealSection>
                <button onClick={() => navigate("/doctor-chamber")} className="inline-flex items-center gap-2 px-6 py-3.5 text-white rounded-xl text-sm font-semibold" style={{ background: "#8B4433" }}>
                  <Stethoscope size={17} /> Explore all medical chambers <ArrowRight size={15} />
                </button>
              </RevealSection>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section id="mission-vision" className="py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="section-head mx-auto text-center">
              <RevealSection><span className="ix-eyebrow"><span className="dot" />About us</span></RevealSection>
              <RevealSection delay={0.1}><h2>Built to remove the friction of finding space</h2></RevealSection>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-14">
              {missionVisionData.map((item, index) => {
                const Icon = item.icon;
                return (
                  <RevealSection key={index} delay={index * 0.12}>
                    <div className="plain-card" style={{ padding: "32px 28px" }}>
                      <div className="icon-wrapper"><Icon size={22} /></div>
                      <h3 style={{ fontSize: "1.2rem" }}>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                  </RevealSection>
                );
              })}
            </div>

            <RevealSection delay={0.3}>
              <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: "Innovation", icon: Sparkles }, { label: "Excellence", icon: Award },
                  { label: "Accessibility", icon: Users }, { label: "Trust", icon: ShieldCheck }
                ].map((value, i) => (
                  <div key={i} className="text-center p-4 rounded-xl bg-white" style={{ border: "1px solid #E3DDCE" }}>
                    <value.icon size={18} className="mx-auto mb-1" color="#B08947" />
                    <p className="text-xs font-medium" style={{ color: "#4A5160" }}>{value.label}</p>
                  </div>
                ))}
              </div>
            </RevealSection>
          </div>
        </section>

        {/* Benefits */}
        <section id="benefits" className="py-24 px-6" style={{ background: "#F1EDE3" }}>
          <div className="max-w-6xl mx-auto">
            <div className="section-head mx-auto text-center">
              <RevealSection><span className="ix-eyebrow"><span className="dot" />Benefits</span></RevealSection>
              <RevealSection delay={0.1}><h2>No lease. No overhead. No admin.</h2></RevealSection>
              <RevealSection delay={0.2}><p className="mx-auto">Focus on your work — we handle everything else.</p></RevealSection>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-14">
              {benefits.map((benefit, i) => (
                <RevealSection key={i} delay={i * 0.08}>
                  <div className="plain-card">
                    <div className="icon-wrapper"><benefit.icon size={22} /></div>
                    <h3>{benefit.title}</h3>
                    <p>{benefit.desc}</p>
                  </div>
                </RevealSection>
              ))}
            </div>
          </div>
        </section>

        {/* Features (dark band) */}
        <section className="feature-band py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="section-head mx-auto text-center">
              <RevealSection><span className="ix-eyebrow" style={{ color: "#D9B77A", borderColor: "rgba(251,249,245,0.15)" }}><span className="dot" style={{ background: "#B08947" }} />Why choose us</span></RevealSection>
              <RevealSection delay={0.1}><h2 className="ix-serif" style={{ color: "#FBF9F5" }}>Built for how professionals actually work</h2></RevealSection>
              <RevealSection delay={0.2}><p className="mx-auto" style={{ color: "rgba(251,249,245,0.6)" }}>Everything you need to start, and grow.</p></RevealSection>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-14">
              {features.map((feature, i) => (
                <RevealSection key={i} delay={i * 0.08}>
                  <div className="feature-card">
                    <span className="feature-index">{String(i + 1).padStart(2, "0")}</span>
                    <div className="feature-icon"><feature.icon size={20} /></div>
                    <h3>{feature.title}</h3>
                    <p>{feature.desc}</p>
                  </div>
                </RevealSection>
              ))}
            </div>
          </div>
        </section>

        {/* Locations */}
        <section className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="section-head mx-auto text-center">
              <RevealSection><span className="ix-eyebrow"><span className="dot" />Prime locations</span></RevealSection>
              <RevealSection delay={0.1}><h2>Accessible, high-visibility workspaces</h2></RevealSection>
              <RevealSection delay={0.2}><p className="mx-auto">Minimal investment. No operational stress. Just your work.</p></RevealSection>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-start mt-14">
              <div className="space-y-4">
                {locationList.map((item, i) => (
                  <RevealSection key={i} delay={i * 0.1}>
                    <div className="location-list-item">
                      <div className="loc-icon"><item.icon size={20} /></div>
                      <div><h4>{item.title}</h4><p>{item.desc}</p></div>
                    </div>
                  </RevealSection>
                ))}
              </div>

              <RevealSection delay={0.2}>
                <div className="location-grid-images">
                  <div className="img-main"><img src={IRYAX_LOCATION_IMAGES[0]} alt="IRYAX Location" /></div>
                  <div className="img-side"><img src={IRYAX_LOCATION_IMAGES[1]} alt="IRYAX Location" /></div>
                  <div className="img-side"><img src={IRYAX_LOCATION_IMAGES[2]} alt="IRYAX Location" /></div>
                </div>
              </RevealSection>
            </div>
          </div>
        </section>

        {/* Earn */}
        <section className="py-24 px-6" style={{ background: "#F1EDE3" }}>
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <RevealSection>
                <div>
                  <span className="ix-eyebrow"><span className="dot" />Earn passive income</span>
                  <h2 className="ix-serif mt-4" style={{ fontSize: "clamp(1.9rem, 3vw, 2.4rem)", lineHeight: 1.2 }}>Turn unused space into income</h2>
                  <p className="mt-4" style={{ color: "#4A5160", lineHeight: 1.75 }}>
                    List your unused workspace and connect with verified professionals. We handle booking and management — you earn.
                  </p>
                  <ul className="space-y-3 mt-6 mb-7">
                    {["List your space on our platform", "Connect with verified professionals", "We handle booking and management", "You earn passive income"].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <CheckCircle size={17} color="#B08947" style={{ marginTop: 2, flexShrink: 0 }} />
                        <span style={{ color: "#3C4451" }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <button className="btn-primary">
                    <Building2 size={16} /> List your space <ArrowRight size={14} />
                  </button>
                </div>
              </RevealSection>
              <RevealSection delay={0.2}>
                <div className="rounded-2xl overflow-hidden bg-white p-6 shadow-sm" style={{ border: "1px solid #E3DDCE" }}>
                  <img src={IRYAX_SPACE_IMAGES[4]} alt="IRYAX Workspace" className="w-full h-64 object-cover rounded-xl" />
                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "#F1EDE3", border: "2px solid white", color: "#B08947" }}>P</div>
                      ))}
                    </div>
                    <span className="text-sm" style={{ color: "#8A8F99" }}>Trusted by 50+ professionals</span>
                  </div>
                </div>
              </RevealSection>
            </div>
          </div>
        </section>

        {/* Specialties */}
        <section id="specialties" className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="section-head mx-auto text-center">
              <RevealSection><span className="ix-eyebrow"><span className="dot" />Our specialties</span></RevealSection>
              <RevealSection delay={0.1}><h2>Serving professionals across every domain</h2></RevealSection>
              <RevealSection delay={0.2}><p className="mx-auto">Modern workspaces designed for every profession.</p></RevealSection>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-14">
              {specialties.map((name, i) => {
                const Icon = specialtyIconMap[name] || Layout;
                return (
                  <RevealSection key={i} delay={i * 0.03}>
                    <div className="specialty-tile">
                      <div className="icon-wrap"><Icon size={20} /></div>
                      <p>{name}</p>
                    </div>
                  </RevealSection>
                );
              })}
            </div>
          </div>
        </section>

        {/* Modern Spaces */}
        <section className="py-24 px-6" style={{ background: "#F1EDE3" }}>
          <div className="max-w-6xl mx-auto">
            <RevealSection>
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <span className="ix-eyebrow"><span className="dot" />Modern workspaces</span>
                  <h2 className="ix-serif mt-4" style={{ fontSize: "clamp(1.9rem, 3vw, 2.4rem)", lineHeight: 1.2 }}>Zero hassle, complete convenience</h2>
                  <p className="mt-4" style={{ color: "#4A5160", lineHeight: 1.75 }}>
                    Co-working that runs like a well-kept property — ready infrastructure and full operational support, without owning or renting.
                  </p>
                  <ul className="space-y-3 mt-6">
                    {["Fully-equipped workspaces", "State-of-the-art tools", "Professional reception and staff", "24/7 security and support"].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <CheckCircle size={17} color="#B08947" style={{ marginTop: 2, flexShrink: 0 }} />
                        <span style={{ color: "#3C4451" }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <img src={IRYAX_SPACE_IMAGES[0]} alt="IRYAX Workspace" className="rounded-2xl w-full h-48 object-cover" style={{ border: "1px solid #E3DDCE" }} />
                  <img src={IRYAX_SPACE_IMAGES[1]} alt="IRYAX Workspace" className="rounded-2xl w-full h-48 object-cover mt-8" style={{ border: "1px solid #E3DDCE" }} />
                  <img src={IRYAX_SPACE_IMAGES[2]} alt="IRYAX Workspace" className="rounded-2xl w-full h-48 object-cover -mt-4" style={{ border: "1px solid #E3DDCE" }} />
                  <img src={IRYAX_SPACE_IMAGES[3]} alt="IRYAX Workspace" className="rounded-2xl w-full h-48 object-cover" style={{ border: "1px solid #E3DDCE" }} />
                </div>
              </div>
            </RevealSection>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-24 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="section-head mx-auto text-center">
              <RevealSection><span className="ix-eyebrow"><span className="dot" />FAQ</span></RevealSection>
              <RevealSection delay={0.1}><h2>Answers about our workspaces</h2></RevealSection>
            </div>

            <div className="space-y-3 mt-12">
              {faqs.map((faq, i) => (
                <RevealSection key={i} delay={i * 0.05}>
                  <div className="faq-item">
                    <button onClick={() => toggleFaq(i)}>
                      <div>
                        <span className="faq-cat">{faq.category}</span>
                        <p className="faq-q">{faq.q}</p>
                      </div>
                      <ChevronDown size={17} style={{ transition: "transform 0.3s", transform: openFaq === i ? "rotate(180deg)" : "none", color: "#8A8F99" }} />
                    </button>
                    <div style={{ maxHeight: openFaq === i ? 300 : 0, opacity: openFaq === i ? 1 : 0, overflow: "hidden", transition: "all 0.4s" }}>
                      <div className="faq-a">{faq.a}</div>
                    </div>
                  </div>
                </RevealSection>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="contact-band py-24 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="section-head mx-auto text-center">
              <RevealSection><span className="ix-eyebrow"><span className="dot" />Get in touch</span></RevealSection>
              <RevealSection delay={0.1}><h2>Ready to start your journey?</h2></RevealSection>
              <RevealSection delay={0.2}><p className="mx-auto">Connect with us and find your next space today.</p></RevealSection>
            </div>

            <div className="grid md:grid-cols-5 gap-8 mt-12">
              <div className="md:col-span-2 space-y-4">
                {[
                  { icon: Mail, label: "Email", value: "info@iriax.com" },
                  { icon: Phone, label: "Phone", value: "+91-9010481048" },
                  { icon: MapPin, label: "Address", value: "Iryax Global, Flat No: 301, 3rd Floor, Sri Sai Balaji Avenue, H. No: 1-98/9/25/p, VIP Hills, near Bank of Baroda, Arunodaya Colony, Madhapur, Hyderabad, Telangana 500081" }
                ].map((item, i) => (
                  <RevealSection key={i} delay={i * 0.1}>
                    <div className="contact-info-item">
                      <div className="icon-wrap"><item.icon size={17} /></div>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: "#12181F" }}>{item.label}</p>
                        <p className={`text-sm mt-0.5 ${item.label === "Address" ? "text-xs" : ""}`} style={{ color: "#4A5160", lineHeight: 1.55 }}>{item.value}</p>
                      </div>
                    </div>
                  </RevealSection>
                ))}
              </div>

              <div className="md:col-span-3">
                <RevealSection delay={0.3}>
                  <form onSubmit={handleSubmit} className="contact-form space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <input type="text" placeholder="Your name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                      <input type="email" placeholder="Your email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <input type="tel" placeholder="Phone number" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
                      <input type="text" placeholder="Address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                    </div>
                    <textarea placeholder="Your message" rows="4" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} required />
                    {submitError && (
                      <div className="p-3 rounded-xl text-sm" style={{ background: "#F3E9E3", color: "#8B4433", border: "1px solid #E3C3B4" }}>{submitError}</div>
                    )}
                    <button type="submit" disabled={isSubmitting} className="contact-submit">
                      {isSubmitting ? (
                        <>
                          <svg className="h-4 w-4" style={{ animation: "ix-spin 0.8s linear infinite" }} viewBox="0 0 24 24" fill="none">
                            <circle opacity="0.25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path opacity="0.75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Sending…
                        </>
                      ) : (
                        <>Send message <Send size={16} /></>
                      )}
                    </button>
                  </form>
                </RevealSection>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="site-footer py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
              <RevealSection>
                <div>
                  <button onClick={scrollToTop} className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0" style={{ background: "rgba(251,249,245,0.08)", border: "1px solid rgba(251,249,245,0.15)" }}>
                      <img src={logo} alt="Logo" className="w-full h-full object-contain p-1.5" />
                    </div>
                    <span className="ix-serif font-semibold" style={{ color: "#FBF9F5" }}>IRYAX SPACE</span>
                  </button>
                  <p className="text-sm" style={{ color: "rgba(251,249,245,0.55)" }}>Modern workspaces for every professional.</p>
                </div>
              </RevealSection>
              <RevealSection delay={0.1}>
                <div>
                  <h4>Explore</h4>
                  <div className="space-y-2.5">
                    <button onClick={() => scrollToSection("benefits")} className="block text-left">Benefits</button>
                    <button onClick={() => scrollToSection("coworking-section")} className="block text-left">Co-working Space</button>
                    <button onClick={() => navigate("/doctor-chamber")} className="block text-left">Doctor&rsquo;s Chamber</button>
                    <button onClick={() => scrollToSection("specialties")} className="block text-left">Specialties</button>
                    <button onClick={() => scrollToSection("mission-vision")} className="block text-left">About</button>
                    <button onClick={() => scrollToSection("faq")} className="block text-left">FAQ</button>
                  </div>
                </div>
              </RevealSection>
              <RevealSection delay={0.2}>
                <div>
                  <h4>Company</h4>
                  <div className="space-y-2.5">
                    <button className="block text-left">About us</button>
                    <button onClick={() => scrollToSection("contact")} className="block text-left">Contact</button>
                  </div>
                </div>
              </RevealSection>
              <RevealSection delay={0.3}>
                <div>
                  <h4>Legal</h4>
                  <div className="space-y-2.5">
                    {["Privacy Policy", "Terms & Conditions", "Refund Policy", "Cookie Policy"].map((item) => (
                      <button key={item} className="block text-left">{item}</button>
                    ))}
                  </div>
                </div>
              </RevealSection>
            </div>

            <RevealSection delay={0.4}>
              <div className="mt-12 pt-6 text-center" style={{ borderTop: "1px solid rgba(251,249,245,0.1)" }}>
                <p className="text-sm">© IRYAX SPACE. All rights reserved.</p>
                <p className="text-xs mt-2 tracking-wider uppercase" style={{ opacity: 0.4 }}>IRYAX SPACE</p>
              </div>
            </RevealSection>
          </div>
        </footer>
      </div>
    </>
  );
};

// ─── APP ───
export default function App() {
  const location = window.location.pathname;

  if (location === "/doctor-chamber") {
    return (
      <ThemeProvider>
        <DoctorChamberPage />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <PromotionalPage />
    </ThemeProvider>
  );
}