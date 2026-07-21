// PromotionalPage.jsx - Complete with IRYAX SPACE Custom Images + Send Query API Integration
import React, { useEffect, useState, createContext, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
  Menu,
  X,
  PlayCircle,
  Wallet,
  Sparkles,
  Zap,
  ChevronDown,
  HelpCircle,
  Mail,
  Phone,
  Send,
  Sun,
  Moon,
  ParkingCircle,
  Lock,
  Sofa,
  Bath,
  Tv,
  Printer,
  PhoneCall,
  Fan,
  Eye,
  Grid3x3,
  Heart,
  Activity,
  Brain,
  Bone,
  EyeOff,
  UsersRound,
  Briefcase,
  HeartPulse,
  ClipboardCheck,
  Microscope,
  TestTube,
  ShieldCheck,
  Sparkles as SparklesIcon,
  Star as StarIcon,
  Dumbbell,
  TrendingUp,
  Award,
  Target,
  Rocket,
  Car,
  Wifi as WifiIcon,
  Users as UsersIcon,
  DollarSign,
  Target as TargetIcon,
  Eye as EyeIcon,
  Flag,
  Layout,
  PenTool,
  Palette,
  Camera,
  ShoppingBag,
  Gift,
  Globe,
  Smartphone,
  Monitor,
  Code,
  Layers,
  Zap as ZapIcon,
  Lightbulb,
  Cloud,
  Database,
  Server,
  Cpu,
  HardDrive,
  Film,
  Music,
  Video,
  BookOpen,
  GraduationCap,
  Briefcase as BriefcaseIcon,
  Home,
  Heart as HeartIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  MessageCircle,
  ThumbsUp,
  Share2,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Facebook,
  Stethoscope,
  Clipboard,
  Syringe,
  Pill,
  Ambulance,
  Microscope as MicroscopeIcon,
  Bone as BoneIcon,
  Brain as BrainIcon,
  HeartPulse as HeartPulseIcon
} from "lucide-react";
import logo from "../assets/logo.png";
import iryaxHero from "../assets/iryaxspace.png";

// ─── IRYAX SPACE CUSTOM IMAGES ───
const IRYAX_HERO_IMAGE = iryaxHero;

const IRYAX_SPACE_IMAGES = [
  "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=800&h=600",
  "https://images.unsplash.com/photo-1497366412874-3415097a27e7?auto=format&fit=crop&q=80&w=800&h=600",
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=800&h=600",
  "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800&h=600",
  "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800&h=600",
  "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&q=80&w=800&h=600"
];

const IRYAX_LOCATION_IMAGES = [
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800&h=600",
  "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=800&h=600",
  "https://images.unsplash.com/photo-1497366412874-3415097a27e7?auto=format&fit=crop&q=80&w=800&h=600"
];

// ─── STYLES ───
const styles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }
  @keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes bounce-slow {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes heartbeat {
    0%, 100% { transform: scale(1); }
    14% { transform: scale(1.05); }
    28% { transform: scale(1); }
    42% { transform: scale(1.05); }
    70% { transform: scale(1); }
  }
  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes scale-in {
    from { opacity: 0; transform: scale(0.8); }
    to { opacity: 1; transform: scale(1); }
  }
  @keyframes slide-up {
    from { opacity: 0; transform: translateY(60px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes glass-shine {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes float-glass {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-10px) rotate(2deg); }
  }
  @keyframes modal-in {
    from { opacity: 0; transform: scale(0.9) translateY(30px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }
  @keyframes pulse-ring {
    0% { transform: scale(0.8); opacity: 0.8; }
    100% { transform: scale(1.3); opacity: 0; }
  }
  @keyframes shine {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }

  .animate-float { animation: float 6s ease-in-out infinite; }
  .animate-gradient { background-size: 200% 200%; animation: gradient 3s ease infinite; }
  .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
  .animate-spin-slow { animation: spin-slow 4s linear infinite; }
  .animate-heartbeat { animation: heartbeat 1.5s ease-in-out infinite; }
  .animate-shimmer { background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%); background-size: 200% center; animation: shimmer 3s ease-in-out infinite; }
  .animate-scale-in { animation: scale-in 0.6s ease-out; }
  .animate-slide-up { animation: slide-up 0.8s ease-out; }
  .animate-glass-shine { background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%); background-size: 200% center; animation: glass-shine 4s ease-in-out infinite; }
  .animate-float-glass { animation: float-glass 6s ease-in-out infinite; }
  .animate-modal-in { animation: modal-in 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
  .animate-pulse-ring { animation: pulse-ring 2s ease-out infinite; }
  .animate-shine { background-size: 200% center; animation: shine 3s ease-in-out infinite; }

  .reveal {
    opacity: 0;
    transform: translateY(40px);
    transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .reveal.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #1a3a6b; border-radius: 10px; }
  
  .medical-glow {
    box-shadow: 0 0 40px rgba(26, 58, 107, 0.15);
  }
  .medical-glow:hover {
    box-shadow: 0 0 60px rgba(26, 58, 107, 0.3);
  }

  .typing-text {
    display: inline-block;
  }
  .typing-text .cursor {
    display: none;
  }
  
  .footer-heart {
    color: #ef4444;
    display: inline-block;
    animation: heartbeat 1.5s ease-in-out infinite;
  }

  /* Hero styles */
  .hero-section {
    position: relative;
    min-height: 100vh;
    display: flex;
    align-items: center;
    padding: 80px 24px 60px;
    overflow: hidden;
  }

  .hero-bg {
    position: absolute;
    inset: 0;
    z-index: 0;
  }

  .hero-bg img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }

  /* Hero Overlay - Gray thin layer for better text visibility */
  .hero-overlay {
    position: absolute;
    inset: 0;
    z-index: 1;
    background: rgba(0, 0, 0, 0.35);
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
  }

  .hero-content {
    position: relative;
    z-index: 10;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
  }

  .hero-text-box {
    max-width: 700px;
    margin-left: 0;
    margin-right: auto;
  }

  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 20px;
    background: rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 9999px;
    font-size: 13px;
    font-weight: 600;
    color: #ffffff;
    margin-bottom: 20px;
    backdrop-filter: blur(4px);
  }

  .hero-title {
    font-size: 3.2rem !important;
    font-weight: 300 !important;
    line-height: 1.15 !important;
    color: #ffffff !important;
    margin-bottom: 8px;
    text-shadow: 0 2px 20px rgba(0, 0, 0, 0.4);
  }

  .hero-title-gradient {
    background: linear-gradient(135deg, #ffffff, #93c5fd, #ffffff);
    background-size: 200% 200%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: 800 !important;
    animation: gradient 3s ease infinite;
    text-shadow: none;
  }

  .hero-subtitle {
    font-size: 1.8rem !important;
    font-weight: 200 !important;
    line-height: 1.3 !important;
    color: #ffffff !important;
    text-shadow: 0 2px 20px rgba(0, 0, 0, 0.4);
  }

  .hero-desc {
    font-size: 1.05rem !important;
    line-height: 1.7 !important;
    color: #ffffff !important;
    max-width: 500px;
    margin-top: 12px;
    font-weight: 300;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
  }

  .hero-buttons {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 16px;
    margin-top: 28px;
  }

  .btn-primary {
    padding: 12px 32px !important;
    font-size: 1rem !important;
    font-weight: 600 !important;
    color: white;
    background: linear-gradient(135deg, #0a1628, #1a3a6b);
    border-radius: 14px;
    border: none;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
  }

  .btn-primary:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 30px rgba(26, 58, 107, 0.3);
  }

  .btn-secondary {
    padding: 12px 32px !important;
    font-size: 1rem !important;
    font-weight: 400 !important;
    color: #ffffff;
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 14px;
    backdrop-filter: blur(4px);
    transition: all 0.3s;
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
  }

  .btn-secondary:hover {
    transform: scale(1.05);
    background: rgba(255, 255, 255, 0.25);
  }

  .hero-scroll {
    margin-top: 50px;
    display: flex;
    justify-content: flex-start;
    animation: bounce-slow 2s ease-in-out infinite;
  }

  .hero-scroll-text {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 3px;
    color: #ffffff;
    opacity: 0.7;
  }

  /* ─── NAVBAR STYLES ─── */
  .navbar-custom {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    z-index: 50 !important;
    height: 72px !important;
    padding: 0 24px !important;
    background: transparent !important;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
    display: flex !important;
    align-items: center !important;
  }

  .navbar-custom .navbar-inner {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 72px;
  }

  .navbar-custom .navbar-link {
    font-size: 0.9rem !important;
    font-weight: 700 !important;
    padding: 8px 16px !important;
    color: #ffffff !important;
    cursor: pointer;
    transition: all 0.3s;
    border-radius: 9999px;
    background: none;
    border: none;
    font-family: inherit;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    letter-spacing: 0.3px;
  }

  .navbar-custom .navbar-link:hover {
    color: #93c5fd !important;
    background: rgba(255, 255, 255, 0.15) !important;
  }

  .navbar-custom .navbar-brand {
    font-size: 1.2rem !important;
    font-weight: 700 !important;
    color: #ffffff !important;
    display: flex;
    align-items: center;
    gap: 10px;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  .navbar-custom .navbar-brand .brand-icon {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    flex-shrink: 0;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .navbar-custom .navbar-btn {
    font-size: 0.85rem !important;
    font-weight: 700 !important;
    padding: 8px 20px !important;
    background: rgba(255, 255, 255, 0.15) !important;
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #ffffff !important;
    border-radius: 9999px;
    transition: all 0.3s;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .navbar-custom .navbar-btn:hover {
    background: rgba(255, 255, 255, 0.25) !important;
    transform: scale(1.05);
  }

  .navbar-custom .navbar-signin {
    font-size: 0.85rem !important;
    font-weight: 700 !important;
    color: #ffffff !important;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    background: none;
    border: none;
    padding: 8px 16px;
    border-radius: 9999px;
    cursor: pointer;
    transition: all 0.3s;
  }

  .navbar-custom .navbar-signin:hover {
    color: #93c5fd !important;
    background: rgba(255, 255, 255, 0.1);
  }

  .navbar-custom .navbar-logo {
    width: 48px !important;
    height: 48px !important;
    border: 2px solid rgba(255, 255, 255, 0.3) !important;
    border-radius: 50% !important;
    padding: 4px !important;
    background: rgba(255, 255, 255, 0.05) !important;
    overflow: hidden !important;
    flex-shrink: 0 !important;
    transition: all 0.3s !important;
  }

  .navbar-custom .navbar-logo img {
    width: 100% !important;
    height: 100% !important;
    object-fit: contain !important;
  }

  .navbar-custom .navbar-logo:hover {
    transform: scale(1.1);
    border-color: rgba(255, 255, 255, 0.5) !important;
  }

  .navbar-custom .navbar-menu-btn {
    color: #ffffff !important;
    padding: 8px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .navbar-custom .navbar-menu-btn:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  /* Scrolled state */
  .navbar-scrolled {
    background: rgba(10, 22, 40, 0.92) !important;
    backdrop-filter: blur(16px) !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06) !important;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.15) !important;
    height: 72px !important;
  }

  .navbar-scrolled .navbar-link {
    color: #e2e8f0 !important;
    text-shadow: none !important;
  }

  .navbar-scrolled .navbar-link:hover {
    color: #ffffff !important;
    background: rgba(255, 255, 255, 0.08) !important;
  }

  .navbar-scrolled .navbar-brand {
    color: #ffffff !important;
    text-shadow: none !important;
  }

  .navbar-scrolled .navbar-brand .brand-icon {
    background: linear-gradient(135deg, #1a3a6b, #0a1628);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .navbar-scrolled .navbar-btn {
    background: linear-gradient(135deg, #1a3a6b, #0a1628) !important;
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #ffffff !important;
  }

  .navbar-scrolled .navbar-btn:hover {
    background: linear-gradient(135deg, #2a4a7b, #1a2a4a) !important;
  }

  .navbar-scrolled .navbar-signin {
    color: #cbd5e1 !important;
    text-shadow: none !important;
  }

  .navbar-scrolled .navbar-signin:hover {
    color: #ffffff !important;
  }

  .navbar-scrolled .navbar-logo {
    border-color: rgba(255, 255, 255, 0.15) !important;
    background: rgba(255, 255, 255, 0.05) !important;
  }

  .navbar-scrolled .navbar-menu-btn {
    color: #e2e8f0 !important;
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.05);
  }

  .navbar-scrolled .navbar-menu-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #ffffff !important;
  }

  /* Hide Start Now button on mobile */
  .navbar-btn-mobile-hide {
    display: flex !important;
  }

  @media (max-width: 640px) {
    .navbar-btn-mobile-hide {
      display: none !important;
    }
    .navbar-custom {
      padding: 0 16px !important;
      height: 64px !important;
    }
    .navbar-custom .navbar-inner {
      height: 64px !important;
    }
    .navbar-scrolled {
      height: 64px !important;
    }
    .hero-title {
      font-size: 2rem !important;
    }
    .hero-subtitle {
      font-size: 1.2rem !important;
    }
    .hero-desc {
      font-size: 0.85rem !important;
    }
    .hero-text-box {
      max-width: 100%;
    }
    .btn-primary, .btn-secondary {
      padding: 10px 20px !important;
      font-size: 0.85rem !important;
    }
    .navbar-custom .navbar-link {
      font-size: 0.75rem !important;
      padding: 6px 12px !important;
    }
    .navbar-custom .navbar-brand {
      font-size: 0.9rem !important;
    }
    .navbar-custom .navbar-brand .brand-icon {
      width: 28px;
      height: 28px;
    }
    .navbar-custom .navbar-brand .brand-icon svg {
      width: 14px !important;
      height: 14px !important;
    }
    .navbar-custom .navbar-btn {
      font-size: 0.7rem !important;
      padding: 6px 14px !important;
    }
    .navbar-custom .navbar-signin {
      font-size: 0.7rem !important;
    }
    .navbar-custom .navbar-logo {
      width: 38px !important;
      height: 38px !important;
    }
    .glass-card {
      padding: 20px 16px;
      border-radius: 20px !important;
      min-height: 200px;
    }
    .glass-card .icon-wrapper {
      width: 48px;
      height: 48px;
    }
    .glass-card h3 {
      font-size: 1rem;
    }
    .glass-card p {
      font-size: 0.8rem;
    }
    .feature-card {
      padding: 24px 20px;
    }
    .location-grid-images .img-main {
      height: 180px;
    }
    .location-grid-images .img-side {
      height: 86px;
    }
    .location-list-item {
      padding: 12px 16px;
    }
    .modal-content {
      padding: 16px;
      border-radius: 20px;
      max-height: 95vh;
    }
    .modal-close {
      width: 32px;
      height: 32px;
    }
    .cabin-card-modal .cabin-image {
      height: 120px;
    }
    .modal-content {
      max-width: 100%;
    }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(40px) scale(0.95); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out;
  }
  .animate-slideUp {
    animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  /* Glass Cards */
  .glass-card {
    border-radius: 28px !important;
    padding: 32px 28px;
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    position: relative;
    overflow: hidden;
    backdrop-filter: blur(24px) saturate(180%);
    -webkit-backdrop-filter: blur(24px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.4);
    background: rgba(255, 255, 255, 0.15) !important;
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 240px;
  }

  .glass-card::before {
    content: '';
    position: absolute;
    top: -60%;
    left: -60%;
    width: 220%;
    height: 220%;
    background: radial-gradient(
      circle at 30% 25%,
      rgba(255, 255, 255, 0.4) 0%,
      rgba(255, 255, 255, 0.05) 40%,
      transparent 70%
    );
    pointer-events: none;
    z-index: 0;
    animation: float-glass 8s ease-in-out infinite;
  }

  .glass-card::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 40%;
    background: linear-gradient(
      to top,
      rgba(255, 255, 255, 0.05),
      transparent
    );
    pointer-events: none;
    z-index: 0;
  }

  .glass-card:hover {
    transform: translateY(-10px) scale(1.02);
    box-shadow: 
      0 30px 80px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.5);
    border-color: rgba(255, 255, 255, 0.5);
    background: rgba(255, 255, 255, 0.25) !important;
  }

  .glass-card .icon-wrapper {
    width: 60px;
    height: 60px;
    border-radius: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 18px;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    background: rgba(255, 255, 255, 0.2) !important;
    color: white !important;
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    position: relative;
    z-index: 1;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
    flex-shrink: 0;
  }

  .glass-card:hover .icon-wrapper {
    transform: scale(1.08) rotate(-4deg);
    background: rgba(255, 255, 255, 0.3) !important;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }

  .glass-card h3 {
    position: relative;
    z-index: 1;
    color: #0a1628 !important;
    font-weight: 700;
    font-size: 1.15rem;
    letter-spacing: -0.01em;
    text-shadow: 0 1px 2px rgba(255, 255, 255, 0.3);
    margin-bottom: 6px;
  }

  .glass-card p {
    position: relative;
    z-index: 1;
    color: #1a2a4a !important;
    font-weight: 400;
    font-size: 0.9rem;
    line-height: 1.7;
    opacity: 0.9;
    flex: 1;
  }

  .glass-blue {
    background: rgba(26, 58, 107, 0.2) !important;
    border-color: rgba(26, 58, 107, 0.15);
  }
  .glass-blue:hover {
    background: rgba(26, 58, 107, 0.3) !important;
    border-color: rgba(26, 58, 107, 0.3);
  }
  .glass-blue .icon-wrapper {
    background: rgba(26, 58, 107, 0.3) !important;
    color: #1a3a6b !important;
  }

  .glass-teal {
    background: rgba(13, 148, 136, 0.2) !important;
    border-color: rgba(13, 148, 136, 0.15);
  }
  .glass-teal:hover {
    background: rgba(13, 148, 136, 0.3) !important;
    border-color: rgba(13, 148, 136, 0.3);
  }
  .glass-teal .icon-wrapper {
    background: rgba(13, 148, 136, 0.3) !important;
    color: #0d9488 !important;
  }

  .glass-purple {
    background: rgba(124, 58, 237, 0.2) !important;
    border-color: rgba(124, 58, 237, 0.15);
  }
  .glass-purple:hover {
    background: rgba(124, 58, 237, 0.3) !important;
    border-color: rgba(124, 58, 237, 0.3);
  }
  .glass-purple .icon-wrapper {
    background: rgba(124, 58, 237, 0.3) !important;
    color: #7c3aed !important;
  }

  .glass-rose {
    background: rgba(220, 38, 38, 0.2) !important;
    border-color: rgba(220, 38, 38, 0.15);
  }
  .glass-rose:hover {
    background: rgba(220, 38, 38, 0.3) !important;
    border-color: rgba(220, 38, 38, 0.3);
  }
  .glass-rose .icon-wrapper {
    background: rgba(220, 38, 38, 0.3) !important;
    color: #dc2626 !important;
  }

  /* Feature Cards */
  .feature-card {
    border-radius: 24px !important;
    padding: 32px 28px;
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    border: 1px solid rgba(255,255,255,0.1);
    position: relative;
    background: rgba(255,255,255,0.05) !important;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .feature-card:hover {
    transform: translateY(-10px);
    background: rgba(255,255,255,0.1) !important;
  }

  .feature-card .feature-icon {
    width: 64px;
    height: 64px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    font-size: 28px;
    flex-shrink: 0;
  }

  .specialties-gradient-heading {
    background: linear-gradient(135deg, #0a1628, #1a3a6b, #0a1628);
    background-size: 200% 200%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: 700 !important;
    animation: gradient 3s ease infinite;
  }

  /* Location List Item */
  .location-list-item {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    padding: 16px 20px;
    border-radius: 16px;
    transition: all 0.3s;
    background: white;
    border: 1px solid rgba(0,0,0,0.04);
  }

  .location-list-item:hover {
    background: #f8fafc;
    transform: translateX(4px);
    border-color: rgba(26, 58, 107, 0.15);
  }

  .location-list-item .loc-icon {
    width: 48px;
    height: 48px;
    min-width: 48px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #1a3a6b;
    color: white;
    transition: all 0.3s;
    flex-shrink: 0;
  }

  .location-list-item:hover .loc-icon {
    transform: scale(1.05) rotate(-3deg);
  }

  .location-list-item .loc-content h4 {
    font-size: 1rem;
    font-weight: 700;
    color: #0a1628;
    margin-bottom: 2px;
  }

  .location-list-item .loc-content p {
    font-size: 0.85rem;
    color: #666;
    line-height: 1.5;
  }

  .location-grid-images {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .location-grid-images .img-main {
    grid-row: span 2;
    border-radius: 16px;
    overflow: hidden;
    height: 280px;
  }

  .location-grid-images .img-main img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s;
  }

  .location-grid-images .img-main:hover img {
    transform: scale(1.05);
  }

  .location-grid-images .img-side {
    border-radius: 16px;
    overflow: hidden;
    height: 134px;
  }

  .location-grid-images .img-side img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s;
  }

  .location-grid-images .img-side:hover img {
    transform: scale(1.05);
  }

  /* Modal Styles */
  .modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    animation: fadeIn 0.3s ease;
  }

  .modal-content {
    background: white;
    border-radius: 32px;
    max-width: 900px;
    width: 100%;
    max-height: 85vh;
    overflow-y: auto;
    padding: 24px;
    position: relative;
    animation: modal-in 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 0 40px 120px rgba(0, 0, 0, 0.3);
  }

  .modal-content::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }
  .modal-content {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .modal-close {
    position: sticky;
    top: 0;
    float: right;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #f1f5f9;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s;
    z-index: 10;
    margin-bottom: 8px;
  }

  .modal-close:hover {
    background: #e2e8f0;
    transform: rotate(90deg);
  }

  .modal-close svg {
    color: #1a2a4a;
  }

  .cabin-card-modal {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid #e2e8f0;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .cabin-card-modal:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(26, 58, 107, 0.1);
    border-color: #1a3a6b;
  }

  .cabin-card-modal .cabin-image {
    height: 140px;
    overflow: hidden;
    position: relative;
    background: #f1f5f9;
  }

  .cabin-card-modal .cabin-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s;
  }

  .cabin-card-modal:hover .cabin-image img {
    transform: scale(1.05);
  }

  .cabin-card-modal .cabin-image .cabin-badge {
    position: absolute;
    top: 8px;
    right: 8px;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(8px);
    color: white;
    padding: 3px 10px;
    border-radius: 9999px;
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 0.5px;
  }

  .cabin-card-modal .cabin-body {
    padding: 14px 16px 16px;
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .cabin-card-modal .cabin-body h4 {
    font-size: 0.9rem;
    font-weight: 700;
    color: #0a1628;
    margin-bottom: 2px;
  }

  .cabin-card-modal .cabin-body .cabin-location {
    font-size: 0.7rem;
    color: #64748b;
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 6px;
  }

  .cabin-card-modal .cabin-body .cabin-desc {
    font-size: 0.75rem;
    color: #64748b;
    line-height: 1.4;
    flex: 1;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .cabin-card-modal .cabin-body .cabin-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid #f1f5f9;
  }

  .cabin-card-modal .cabin-body .cabin-price {
    font-size: 0.95rem;
    font-weight: 800;
    color: #0a1628;
  }

  .cabin-card-modal .cabin-body .cabin-price span {
    font-size: 0.65rem;
    font-weight: 400;
    color: #94a3b8;
  }

  .btn-book-now {
    padding: 5px 14px;
    background: linear-gradient(135deg, #0a1628, #1a3a6b);
    color: white;
    border: none;
    border-radius: 9999px;
    font-size: 0.7rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .btn-book-now:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 20px rgba(26, 58, 107, 0.3);
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
    <div ref={ref} className={`reveal ${isVisible ? 'visible' : ''} ${className}`} style={{ transitionDelay: `${delay}s` }}>
      {children}
    </div>
  );
};

// ─── THEME ───
const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.documentElement.className = "light";
  }, []);

  const toggleTheme = () => {};

  return <ThemeContext.Provider value={{ theme: "light", toggleTheme }}>{children}</ThemeContext.Provider>;
};

const useTheme = () => useContext(ThemeContext);

// ─── TYPING ───
const TypingText = ({ words, speed = 130, pause = 2000 }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const word = words[currentWordIndex];
    if (isPaused) {
      const timeout = setTimeout(() => { setIsPaused(false); setIsDeleting(true); }, pause);
      return () => clearTimeout(timeout);
    }
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setCurrentText(word.substring(0, currentText.length + 1));
        if (currentText.length + 1 === word.length) setIsPaused(true);
      } else {
        setCurrentText(word.substring(0, currentText.length - 1));
        if (currentText.length === 0) {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, isPaused, currentWordIndex, words, speed, pause]);

  return <span className="typing-text">{currentText}</span>;
};

// ─── COUNTER ───
const Counter = ({ target, suffix = "", duration = 2000 }) => {
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

// ─── CABINS MODAL ───
const CabinsModal = ({ isOpen, onClose, cabins, loading, onBookClick }) => {
  if (!isOpen) return null;

  const activeCabins = cabins?.filter(c => c.isActive === true) || [];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={18} />
        </button>

        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Building2 size={22} className="text-blue-800" />
            Explore Our Spaces
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Discover fully-equipped workspaces available for booking
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-800 rounded-full animate-spin"></div>
            <p className="text-sm text-gray-500 mt-3">Loading spaces...</p>
          </div>
        ) : activeCabins.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeCabins.map((cabin) => (
              <div key={cabin._id} className="cabin-card-modal">
                <div className="cabin-image">
                  {cabin.images && cabin.images.length > 0 ? (
                    <img 
                      src={`http://localhost:5003/${cabin.images[0]}`} 
                      alt={cabin.name}
                      onError={(e) => {
                        e.target.src = IRYAX_SPACE_IMAGES[0];
                      }}
                    />
                  ) : (
                    <img 
                      src={IRYAX_SPACE_IMAGES[0]} 
                      alt={cabin.name}
                    />
                  )}
                  <span className="cabin-badge" style={{ background: 'rgba(16, 185, 129, 0.8)' }}>
                    Available
                  </span>
                </div>
                <div className="cabin-body">
                  <h4>{cabin.name}</h4>
                  <div className="cabin-location">
                    <MapPin size={11} /> {cabin.address || 'Location not specified'}
                  </div>
                  <p className="cabin-desc">{cabin.description || 'No description available'}</p>
                  <div className="cabin-footer">
                    <div className="cabin-price">
                      ₹{cabin.price?.toLocaleString('en-IN') || 0} <span>/ day</span>
                    </div>
                    <button 
                      className="btn-book-now"
                      onClick={(e) => {
                        e.stopPropagation();
                        onBookClick(cabin);
                      }}
                    >
                      Book Now <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Building2 size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No spaces available at the moment.</p>
          </div>
        )}

        <div className="mt-4 text-center text-xs text-gray-400 border-t border-gray-100 pt-3">
          Showing {activeCabins.length} active spaces
        </div>
      </div>
    </div>
  );
};

// ─── MAIN ───
const PromotionalPage = () => {
  const { theme, toggleTheme } = useTheme();
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
  const [isCabinsModalOpen, setIsCabinsModalOpen] = useState(false);

  const typingWords = ["Workspace", "Studio", "Office", "Creative Space"];

  // Fetch cabins
  useEffect(() => {
    const fetchCabins = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5003/api/cabins");
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

  // ─── HANDLE SEND QUERY ───
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    
    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      setSubmitError("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:5003/api/cabins/sendquery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address || "",
          message: formData.message
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setFormSubmitted(true);
        setShowThankYouPopup(true);
        setFormData({ name: "", email: "", phone: "", address: "", message: "" });
        setTimeout(() => {
          setShowThankYouPopup(false);
          setFormSubmitted(false);
        }, 5000);
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

  const openCabinsModal = () => {
    setIsCabinsModalOpen(true);
  };

  const closeCabinsModal = () => {
    setIsCabinsModalOpen(false);
  };

  const handleBookClick = (cabin) => {
    navigate("/login");
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const stats = [
    { label: "Professionals Trust Us", value: 120, suffix: "+" },
    { label: "Workspaces", value: 15, suffix: "+" },
    { label: "Projects Done", value: 2500, suffix: "+" },
    { label: "Specializations", value: 20, suffix: "+" },
    { label: "Support Hours", value: 24, suffix: "/7" }
  ];

  const specialties = [
    "Medical Practice", "Dental Clinic", "Physiotherapy", "Psychology",
    "Cardiology", "Neurology", "Dermatology", "Orthopedic",
    "Pediatrics", "Gynecology", "ENT Specialist", "Ophthalmology",
    "General Medicine", "Radiology", "Pathology", "Dentistry"
  ];

  const specialtyIconMap = {
    "Medical Practice": Stethoscope,
    "Dental Clinic": Users,
    "Physiotherapy": Activity,
    "Psychology": Brain,
    "Cardiology": HeartPulse,
    "Neurology": Brain,
    "Dermatology": EyeOff,
    "Orthopedic": Bone,
    "Pediatrics": UsersRound,
    "Gynecology": Heart,
    "ENT Specialist": Stethoscope,
    "Ophthalmology": Eye,
    "General Medicine": Stethoscope,
    "Radiology": Microscope,
    "Pathology": TestTube,
    "Dentistry": Users,
  };

  const benefits = [
    { icon: Shield, title: "No Long Leases", desc: "Avoid long-term commitments and heavy deposits.", glassClass: "glass-blue" },
    { icon: Wallet, title: "Low Operational Costs", desc: "Pay only for what you use. No hidden charges.", glassClass: "glass-teal" },
    { icon: Users, title: "Admin Hassle-Free", desc: "We manage staff, billing, and daily operations for you.", glassClass: "glass-purple" },
    { icon: SparklesIcon, title: "Modern Infrastructure", desc: "Fully-equipped with state-of-the-art tools.", glassClass: "glass-rose" }
  ];

  const features = [
    { icon: Rocket, title: "Quick Setup", desc: "Get started in 24 hours with fully-equipped spaces", number: "01", color: "bg-blue-500/20 text-blue-300" },
    { icon: TrendingUp, title: "Grow Your Practice", desc: "Scale your practice without ownership hassles", number: "02", color: "bg-emerald-500/20 text-emerald-300" },
    { icon: Award, title: "Premium Quality", desc: "High-end infrastructure at affordable rates", number: "03", color: "bg-purple-500/20 text-purple-300" },
    { icon: Target, title: "Prime Locations", desc: "High-visibility spaces in premium areas", number: "04", color: "bg-rose-500/20 text-rose-300" }
  ];

  const locationList = [
    { 
      icon: Building2, 
      title: "High-Visibility Locations", 
      desc: "Premium workspaces in prime areas with high foot traffic."
    },
    { 
      icon: Wallet, 
      title: "Easy Start", 
      desc: "Minimal investment required. Everything is set up for you."
    },
    { 
      icon: ShieldCheck, 
      title: "Zero Operational Stress", 
      desc: "We handle staff, billing, and daily operations for you."
    }
  ];

  const faqs = [
    { category: "Workspaces", q: "What types of workspaces are available?", a: "We offer fully-equipped private offices, meeting rooms, and collaborative spaces." },
    { category: "Flexibility", q: "Do I need to sign a long-term lease?", a: "No! Our model is completely flexible. You can book by hour, day, or month." },
    { category: "Facilities", q: "What facilities are included?", a: "All spaces include high-speed WiFi, comfortable work areas, and 24/7 security." },
    { category: "Payment", q: "What payment methods are accepted?", a: "We accept credit/debit cards, UPI, net banking, and offer flexible payment plans." },
    { category: "Support", q: "What administrative support do you provide?", a: "We provide full administrative support including reception services and billing assistance." },
    { category: "Earning", q: "How can I earn from my unused space?", a: "List your space on our platform and connect with trusted professionals." }
  ];

  const handleCabinsClick = (e) => {
    e.preventDefault();
    openCabinsModal();
  };

  const BrandWithIcon = () => (
    <span className="navbar-brand hidden sm:block transition flex items-center gap-2">
      IRYAX SPACE
      <span className="brand-icon flex items-center justify-center">
        <Layout size={18} />
      </span>
    </span>
  );

  const missionVisionData = [
    {
      title: "Our Mission",
      icon: TargetIcon,
      description: "To empower professionals by providing flexible, fully-equipped spaces that eliminate the barriers of high costs and long-term commitments, enabling them to focus entirely on their work.",
      color: "from-blue-600 to-blue-800",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      title: "Our Vision",
      icon: EyeIcon,
      description: "To revolutionize the workspace landscape by creating a seamless ecosystem where every professional can access premium infrastructure without ownership burden, fostering innovation and excellence.",
      color: "from-purple-600 to-indigo-800",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    }
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="min-h-screen bg-white text-gray-900 font-light antialiased">

        {/* ─── CABINS MODAL ─── */}
        <CabinsModal 
          isOpen={isCabinsModalOpen}
          onClose={closeCabinsModal}
          cabins={cabins}
          loading={loading}
          onBookClick={handleBookClick}
        />

        {/* ─── THANK YOU POPUP ─── */}
        {showThankYouPopup && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl border border-gray-100 animate-slideUp relative">
              <button
                onClick={() => setShowThankYouPopup(false)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors group"
              >
                <X size={20} className="text-gray-400 group-hover:text-gray-600" />
              </button>
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={40} className="text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You! 🎉</h3>
                <p className="text-gray-600 mb-2">Thanks for your interest!</p>
                <p className="text-gray-500 text-sm">We will contact you soon.</p>
                <button
                  onClick={() => setShowThankYouPopup(false)}
                  className="mt-6 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition"
                >
                  Got it
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── NAVBAR ─── */}
        <nav className={`navbar-custom ${scrolled ? 'navbar-scrolled' : ''}`}>
          <div className="navbar-inner">
            <button onClick={scrollToTop} className="flex items-center gap-3 group">
              <div className="navbar-logo">
                <img src={logo} alt="Logo" />
              </div>
              <BrandWithIcon />
            </button>

            <div className="hidden md:flex items-center gap-1">
              <button onClick={() => scrollToSection('benefits')} className="navbar-link">Benefits</button>
              <a href="#cabins" onClick={handleCabinsClick} className="navbar-link">Spaces</a>
              <button onClick={() => scrollToSection('specialties')} className="navbar-link">Specialties</button>
              <button onClick={() => scrollToSection('mission-vision')} className="navbar-link">About</button>
              <button onClick={() => scrollToSection('faq')} className="navbar-link">FAQ</button>
              <button onClick={() => scrollToSection('contact')} className="navbar-link">Contact</button>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => navigate("/login")} className="navbar-signin hidden sm:block">
                Sign In
              </button>
              {/* Start Now button - hidden on mobile */}
              <button onClick={() => navigate("/login")} className="navbar-btn navbar-btn-mobile-hide">
                <Layout size={14} /> Start Now
              </button>
              <button 
                onClick={() => setMobileOpen(!mobileOpen)} 
                className="navbar-menu-btn md:hidden"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </nav>

        {/* ─── MOBILE MENU ─── */}
        <div className={`fixed inset-0 z-40 bg-white pt-20 px-6 transition-all duration-500 ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          <div className="flex flex-col gap-2 max-w-sm mx-auto">
            <button onClick={() => { setMobileOpen(false); scrollToSection('benefits'); }} className="px-4 py-3 text-base text-gray-700 hover:text-blue-800 bg-gray-50 hover:bg-gray-100 rounded-lg transition font-medium text-left">Benefits</button>
            <a href="#cabins" onClick={(e) => { e.preventDefault(); setMobileOpen(false); openCabinsModal(); }} className="px-4 py-3 text-base text-gray-700 hover:text-blue-800 bg-gray-50 hover:bg-gray-100 rounded-lg transition font-medium text-left block">Spaces</a>
            <button onClick={() => { setMobileOpen(false); scrollToSection('specialties'); }} className="px-4 py-3 text-base text-gray-700 hover:text-blue-800 bg-gray-50 hover:bg-gray-100 rounded-lg transition font-medium text-left">Specialties</button>
            <button onClick={() => { setMobileOpen(false); scrollToSection('mission-vision'); }} className="px-4 py-3 text-base text-gray-700 hover:text-blue-800 bg-gray-50 hover:bg-gray-100 rounded-lg transition font-medium text-left">About</button>
            <button onClick={() => { setMobileOpen(false); scrollToSection('faq'); }} className="px-4 py-3 text-base text-gray-700 hover:text-blue-800 bg-gray-50 hover:bg-gray-100 rounded-lg transition font-medium text-left">FAQ</button>
            <button onClick={() => { setMobileOpen(false); scrollToSection('contact'); }} className="px-4 py-3 text-base text-gray-700 hover:text-blue-800 bg-gray-50 hover:bg-gray-100 rounded-lg transition font-medium text-left">Contact</button>
            <div className="h-px bg-gray-200 my-1" />
            <button onClick={() => { navigate("/login"); setMobileOpen(false); }} className="px-4 py-3 text-base text-center text-white bg-gradient-to-r from-blue-900 to-blue-700 rounded-lg font-semibold">
              Start Now
            </button>
          </div>
        </div>

        {/* ─── HERO ─── */}
        <section className="hero-section">
          <div className="hero-bg">
            <img src={IRYAX_HERO_IMAGE} alt="IRYAX SPACE Workspace" />
          </div>
          {/* ─── GRAY OVERLAY ─── */}
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <div className="hero-text-box">
              <RevealSection>
                <div className="hero-badge">
                  <Layout size={14} className="animate-heartbeat" />
                  <span>India's Premier Workspace Platform</span>
                </div>
              </RevealSection>

              <RevealSection delay={0.1}>
                <h1 className="hero-title">
                  Modern Workspaces
                  <br />
                  <span className="hero-title-gradient">
                    <TypingText words={typingWords} />
                  </span>
                  <br />
                  <span className="hero-subtitle">for Every Professional</span>
                </h1>
              </RevealSection>

              <RevealSection delay={0.2}>
                <p className="hero-desc">
                  Fully-equipped spaces. Flexible hours. Zero admin stress.
                  Join 120+ professionals who've transformed their work.
                </p>
              </RevealSection>

              <RevealSection delay={0.3}>
                <div className="hero-buttons">
                  <button onClick={() => navigate("/login")} className="btn-primary">
                    <Layout size={16} />
                    Start Your Journey
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition" />
                  </button>
                  <a href="#cabins" onClick={handleCabinsClick} className="btn-secondary" style={{ textDecoration: 'none' }}>
                    <Eye size={16} /> Explore Spaces
                  </a>
                </div>
              </RevealSection>
            </div>
          </div>
        </section>

        {/* ─── STATS ─── */}
        <section className="py-16 px-6 border-t border-gray-100 bg-gray-50">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8">
            {stats.map((stat, i) => (
              <RevealSection key={i} delay={i * 0.1}>
                <div className="text-center group p-4 rounded-2xl hover:bg-white transition shadow-sm hover:shadow-lg">
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent group-hover:scale-110 transition">
                    <Counter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-sm text-gray-500 mt-1 font-medium">{stat.label}</div>
                </div>
              </RevealSection>
            ))}
          </div>
        </section>

        {/* ─── MISSION & VISION ─── */}
        <section id="mission-vision" className="py-16 px-6 bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <RevealSection>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 text-xs rounded-full mb-4 tracking-widest uppercase font-medium shadow-sm">
                  <Flag size={12} className="text-blue-700" /> About Us
                </span>
              </RevealSection>
              <RevealSection delay={0.1}>
                <h2 className="text-2xl sm:text-3xl font-light text-gray-900">
                  Our <span className="bg-gradient-to-r from-blue-900 to-purple-700 bg-clip-text text-transparent font-bold">Mission & Vision</span>
                </h2>
              </RevealSection>
              <RevealSection delay={0.2}>
                <p className="mt-2 text-sm text-gray-600 max-w-2xl mx-auto">
                  Driving innovation by creating accessible, flexible, and premium workspaces for every professional.
                </p>
              </RevealSection>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {missionVisionData.map((item, index) => {
                const Icon = item.icon;
                return (
                  <RevealSection key={index} delay={index * 0.15}>
                    <div className={`relative p-6 rounded-2xl ${item.bgColor} border ${item.borderColor} transition-all duration-500 hover:shadow-xl hover:-translate-y-1 group overflow-hidden`}>
                      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${item.color} rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition`} />
                      <div className="relative z-10">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-md mb-3 group-hover:scale-110 transition group-hover:rotate-6`}>
                          <Icon size={22} />
                        </div>
                        <h3 className={`text-lg font-bold text-gray-900 mb-2`}>{item.title}</h3>
                        <p className="text-gray-700 leading-relaxed text-sm">
                          {item.description}
                        </p>
                        <div className="mt-3 flex items-center gap-2 text-[10px] font-medium text-gray-400">
                          <span className="w-6 h-0.5 bg-gray-300"></span>
                          <span>IRYAX SPACE</span>
                          <span className="w-6 h-0.5 bg-gray-300"></span>
                        </div>
                      </div>
                    </div>
                  </RevealSection>
                );
              })}
            </div>

            <RevealSection delay={0.3}>
              <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: "Innovation", icon: SparklesIcon },
                  { label: "Excellence", icon: Award },
                  { label: "Accessibility", icon: Users },
                  { label: "Trust", icon: ShieldCheck }
                ].map((value, i) => (
                  <div key={i} className="text-center p-3 rounded-xl bg-white border border-gray-100 hover:border-blue-300 transition hover:shadow-md">
                    <value.icon size={20} className="mx-auto text-blue-700 mb-1" />
                    <p className="text-xs font-medium text-gray-700">{value.label}</p>
                  </div>
                ))}
              </div>
            </RevealSection>
          </div>
        </section>

        {/* ─── BENEFITS ─── */}
        <section id="benefits" className="py-20 px-6 bg-gradient-to-b from-gray-100 via-white to-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <RevealSection>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/60 backdrop-blur-sm border border-white/30 text-blue-800 text-xs rounded-full mb-4 tracking-widest uppercase font-medium shadow-sm">
                  <StarIcon size={12} className="fill-blue-800 text-blue-800" /> Benefits
                </span>
              </RevealSection>
              <RevealSection delay={0.1}>
                <h2 className="text-3xl sm:text-4xl font-light text-gray-900">
                  Helping Professionals <span className="bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent font-bold">Avoid Long Leases</span> & High Costs
                </h2>
              </RevealSection>
              <RevealSection delay={0.2}>
                <p className="mt-3 text-base text-gray-600 max-w-2xl mx-auto">Focus on your work while we handle everything else.</p>
              </RevealSection>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, i) => (
                <RevealSection key={i} delay={i * 0.1}>
                  <div className={`glass-card ${benefit.glassClass}`}>
                    <div className="icon-wrapper">
                      <benefit.icon size={24} />
                    </div>
                    <h3>{benefit.title}</h3>
                    <p>{benefit.desc}</p>
                  </div>
                </RevealSection>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FEATURES ─── */}
        <section className="py-20 px-6 bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 text-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <RevealSection>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/20 text-white/80 text-xs rounded-full mb-4 tracking-widest uppercase font-medium">
                  <SparklesIcon size={12} /> Why Choose Us
                </span>
              </RevealSection>
              <RevealSection delay={0.1}>
                <h2 className="text-3xl sm:text-4xl font-light">
                  Built for <span className="font-bold bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">Modern Professionals</span>
                </h2>
              </RevealSection>
              <RevealSection delay={0.2}>
                <p className="mt-3 text-base text-blue-200 max-w-2xl mx-auto">Everything you need to start and grow your work.</p>
              </RevealSection>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, i) => (
                <RevealSection key={i} delay={i * 0.1}>
                  <div className="feature-card">
                    <span className="text-4xl font-bold text-white/10 absolute top-4 right-6">{feature.number}</span>
                    <div className={`feature-icon ${feature.color}`}>
                      <feature.icon size={28} />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-blue-200 leading-relaxed">{feature.desc}</p>
                  </div>
                </RevealSection>
              ))}
            </div>
          </div>
        </section>

        {/* ─── LOCATIONS ─── */}
        <section className="py-20 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <RevealSection>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-full mb-4 tracking-widest uppercase font-medium">
                  <MapPin size={12} /> Prime Locations
                </span>
              </RevealSection>
              <RevealSection delay={0.1}>
                <h2 className="text-3xl sm:text-4xl font-light text-gray-900">
                  Accessible, High-Visibility <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent font-bold">Workspaces</span>
                </h2>
              </RevealSection>
              <RevealSection delay={0.2}>
                <p className="mt-3 text-base text-gray-600 max-w-2xl mx-auto">Minimal investment. No operational stress. Just focus on your work.</p>
              </RevealSection>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div className="space-y-4">
                {locationList.map((item, i) => (
                  <RevealSection key={i} delay={i * 0.1}>
                    <div className="location-list-item">
                      <div className="loc-icon">
                        <item.icon size={22} />
                      </div>
                      <div className="loc-content">
                        <h4>{item.title}</h4>
                        <p>{item.desc}</p>
                      </div>
                    </div>
                  </RevealSection>
                ))}
              </div>

              <RevealSection delay={0.2}>
                <div className="location-grid-images">
                  <div className="img-main">
                    <img src={IRYAX_LOCATION_IMAGES[0]} alt="IRYAX Location" />
                  </div>
                  <div className="img-side">
                    <img src={IRYAX_LOCATION_IMAGES[1]} alt="IRYAX Location" />
                  </div>
                  <div className="img-side">
                    <img src={IRYAX_LOCATION_IMAGES[2]} alt="IRYAX Location" />
                  </div>
                </div>
              </RevealSection>
            </div>
          </div>
        </section>

        {/* ─── EARN ─── */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <RevealSection>
                <div>
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-full mb-4 tracking-widest uppercase font-medium">
                    <Wallet size={12} /> Earn Passive Income
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-light text-gray-900 mb-4">
                    Earn From <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent font-bold">Your Space</span>
                  </h2>
                  <p className="text-base text-gray-600 leading-relaxed mb-6">
                    Monetize your unused workspace and connect with trusted professionals. No added operational stress — we handle everything.
                  </p>
                  <ul className="space-y-3 mb-6">
                    {["List your space on our platform", "Connect with verified professionals", "We handle booking and management", "You earn passive income"].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <CheckCircle size={18} className="text-amber-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <button className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl hover:shadow-lg hover:shadow-amber-500/25 transition hover:scale-105 flex items-center gap-2 group">
                    <Building2 size={16} /> List Your Space <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
                  </button>
                </div>
              </RevealSection>
              <RevealSection delay={0.2}>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-2xl blur-2xl animate-pulse" />
                  <div className="relative rounded-2xl overflow-hidden bg-white border border-gray-200 p-6 shadow-xl">
                    <img src={IRYAX_SPACE_IMAGES[4]} alt="IRYAX Workspace" className="w-full h-64 object-cover rounded-xl" />
                    <div className="mt-4 flex items-center gap-3">
                      <div className="flex -space-x-2">
                        {[1,2,3].map((i) => <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-amber-600/20 flex items-center justify-center text-xs text-amber-600 font-bold">P</div>)}
                      </div>
                      <span className="text-sm text-gray-500">Trusted by 50+ professionals</span>
                    </div>
                  </div>
                </div>
              </RevealSection>
            </div>
          </div>
        </section>

        {/* ─── SPECIALTIES ─── */}
        <section id="specialties" className="py-20 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <RevealSection>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 border border-blue-200 text-blue-800 text-xs rounded-full mb-4 tracking-widest uppercase font-medium">
                  <UsersRound size={12} /> Our Specialties
                </span>
              </RevealSection>
              <RevealSection delay={0.1}>
                <h2 className="text-3xl sm:text-4xl font-light text-gray-900">
                  We Serve Across <span className="specialties-gradient-heading">Multiple Domains</span>
                </h2>
              </RevealSection>
              <RevealSection delay={0.2}>
                <p className="mt-3 text-base text-gray-600 max-w-2xl mx-auto">Modern workspaces designed for every profession.</p>
              </RevealSection>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
              {specialties.map((name, i) => {
                const Icon = specialtyIconMap[name] || Layout;
                return (
                  <RevealSection key={i} delay={i * 0.05}>
                    <div className="group p-4 rounded-2xl bg-white border border-gray-100 hover:border-blue-300 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl text-center">
                      <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center text-blue-700 group-hover:scale-110 transition group-hover:rotate-6">
                        <Icon size={24} />
                      </div>
                      <p className="text-xs text-gray-700 mt-3 group-hover:text-blue-700 transition font-medium">{name}</p>
                    </div>
                  </RevealSection>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── MODERN SPACES ─── */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <RevealSection>
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs rounded-full mb-4 tracking-widest uppercase font-medium">
                    <SparklesIcon size={12} /> Modern Workspaces
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-light text-gray-900 mb-4">
                    Zero Hassle. <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent font-bold">Complete Convenience.</span>
                  </h2>
                  <p className="text-base text-gray-600 leading-relaxed mb-6">
                    Experience co-working like a premium hotel stay — fully-equipped spaces, ready infrastructure, and complete operational support, without owning or renting property.
                  </p>
                  <ul className="space-y-3">
                    {["Fully-equipped workspaces", "State-of-the-art tools", "Professional reception and staff", "24/7 security and support"].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <CheckCircle size={18} className="text-cyan-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <img src={IRYAX_SPACE_IMAGES[0]} alt="IRYAX Workspace" className="rounded-2xl w-full h-48 object-cover hover:scale-105 transition shadow-xl" />
                  <img src={IRYAX_SPACE_IMAGES[1]} alt="IRYAX Workspace" className="rounded-2xl w-full h-48 object-cover hover:scale-105 transition shadow-xl mt-8" />
                  <img src={IRYAX_SPACE_IMAGES[2]} alt="IRYAX Workspace" className="rounded-2xl w-full h-48 object-cover hover:scale-105 transition shadow-xl -mt-4" />
                  <img src={IRYAX_SPACE_IMAGES[3]} alt="IRYAX Workspace" className="rounded-2xl w-full h-48 object-cover hover:scale-105 transition shadow-xl" />
                </div>
              </div>
            </RevealSection>
          </div>
        </section>

        {/* ─── FAQ ─── */}
        <section id="faq" className="py-20 px-6 bg-gray-50">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <RevealSection>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-gray-100 border border-gray-200 text-gray-700 text-xs rounded-full mb-4 tracking-widest uppercase font-medium">
                  <HelpCircle size={12} /> FAQ
                </span>
              </RevealSection>
              <RevealSection delay={0.1}>
                <h2 className="text-3xl font-light text-gray-900">Frequently Asked <span className="bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent font-bold">Questions</span></h2>
              </RevealSection>
              <RevealSection delay={0.2}>
                <p className="mt-2 text-base text-gray-600">Find answers about our workspaces.</p>
              </RevealSection>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <RevealSection key={i} delay={i * 0.06}>
                  <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden transition hover:shadow-lg hover:border-blue-200">
                    <button onClick={() => toggleFaq(i)} className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition">
                      <div>
                        <span className="text-[10px] text-blue-600 uppercase tracking-wider font-semibold">{faq.category}</span>
                        <p className="text-base font-light text-gray-900 mt-0.5">{faq.q}</p>
                      </div>
                      <ChevronDown size={18} className={`text-gray-500 transition-all duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                    </button>
                    <div className={`overflow-hidden transition-all duration-500 ${openFaq === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                      <div className="px-6 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">{faq.a}</div>
                    </div>
                  </div>
                </RevealSection>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CONTACT ─── */}
        <section id="contact" className="py-20 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50" />
          <div className="relative max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <RevealSection>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/80 border border-gray-200 text-gray-700 text-xs rounded-full mb-4 tracking-widest uppercase font-medium">Get in Touch</span>
              </RevealSection>
              <RevealSection delay={0.1}>
                <h2 className="text-3xl font-light text-gray-900">Ready to <span className="bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent font-bold">Start Your Journey?</span></h2>
              </RevealSection>
              <RevealSection delay={0.2}>
                <p className="mt-2 text-base text-gray-600">Connect with us and transform your work experience today.</p>
              </RevealSection>
            </div>

            <div className="grid md:grid-cols-5 gap-8">
              <div className="md:col-span-2 space-y-5">
                {[
                  { icon: Mail, label: "Email", value: "info@iriax.com" },
                  { icon: Phone, label: "Phone", value: "+91-9010481048" },
                  { icon: MapPin, label: "Address", value: "Iryax Global, Flat No: 301, 3rd Floor, Sri Sai Balaji Avenue, H. No: 1-98/9/25/p, VIP Hills, near Bank of Baroda, Arunodaya Colony, Madhapur, Hyderabad, Telangana 500081" }
                ].map((item, i) => (
                  <RevealSection key={i} delay={i * 0.1}>
                    <div className="flex items-start gap-4 group p-4 rounded-xl bg-white/70 backdrop-blur-sm hover:bg-white transition shadow-sm hover:shadow-md">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-700 flex-shrink-0 mt-0.5 transition group-hover:scale-110">
                        <item.icon size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                        <p className={`text-sm text-gray-600 group-hover:text-blue-700 transition ${item.label === "Address" ? 'text-xs leading-relaxed' : ''}`}>{item.value}</p>
                      </div>
                    </div>
                  </RevealSection>
                ))}
              </div>

              <div className="md:col-span-3">
                <RevealSection delay={0.3}>
                  <form onSubmit={handleSubmit} className="space-y-4 bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-white/50">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <input 
                        type="text" 
                        placeholder="Your Name" 
                        value={formData.name} 
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                        className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm focus:outline-none transition" 
                        required 
                      />
                      <input 
                        type="email" 
                        placeholder="Your Email" 
                        value={formData.email} 
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                        className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm focus:outline-none transition" 
                        required 
                      />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <input 
                        type="tel" 
                        placeholder="Phone Number" 
                        value={formData.phone} 
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                        className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm focus:outline-none transition" 
                        required 
                      />
                      <input 
                        type="text" 
                        placeholder="Address" 
                        value={formData.address} 
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })} 
                        className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm focus:outline-none transition" 
                      />
                    </div>
                    <textarea 
                      placeholder="Your Message" 
                      rows="4" 
                      value={formData.message} 
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })} 
                      className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm focus:outline-none transition resize-none" 
                      required 
                    />
                    {submitError && (
                      <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
                        {submitError}
                      </div>
                    )}
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-900 to-blue-700 rounded-xl hover:shadow-lg hover:shadow-blue-900/25 transition hover:scale-105 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
                        </>
                      ) : (
                        <>Start Your Journey <Send size={16} className="group-hover:translate-x-1 transition" /></>
                      )}
                    </button>
                  </form>
                </RevealSection>
              </div>
            </div>
          </div>
        </section>

        {/* ─── FOOTER ─── */}
        <footer className="py-12 px-6 border-t border-gray-200 bg-gray-900 text-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <RevealSection>
                <div>
                  <button onClick={scrollToTop} className="flex items-center gap-3 mb-4 group">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-blue-400/30 shadow-lg shadow-blue-500/20 flex-shrink-0 bg-white/10 group-hover:scale-110 transition">
                      <img src={logo} alt="Logo" className="w-full h-full object-contain p-1.5" />
                    </div>
                    <span className="text-base font-semibold text-white group-hover:text-blue-400 transition flex items-center gap-2">
                      IRYAX SPACE
                      <Layout size={16} className="text-blue-400" />
                    </span>
                  </button>
                  <p className="text-sm text-gray-400">Modern workspaces for every professional.</p>
                </div>
              </RevealSection>
              <RevealSection delay={0.1}>
                <div>
                  <h4 className="text-sm font-medium text-white mb-4">Explore</h4>
                  <div className="space-y-2">
                    <button onClick={() => scrollToSection('benefits')} className="block text-sm text-gray-400 hover:text-blue-400 transition hover:translate-x-1 text-left">Benefits</button>
                    <a href="#cabins" onClick={handleCabinsClick} className="block text-sm text-gray-400 hover:text-blue-400 transition hover:translate-x-1 text-left">Spaces</a>
                    <button onClick={() => scrollToSection('specialties')} className="block text-sm text-gray-400 hover:text-blue-400 transition hover:translate-x-1 text-left">Specialties</button>
                    <button onClick={() => scrollToSection('mission-vision')} className="block text-sm text-gray-400 hover:text-blue-400 transition hover:translate-x-1 text-left">About</button>
                    <button onClick={() => scrollToSection('faq')} className="block text-sm text-gray-400 hover:text-blue-400 transition hover:translate-x-1 text-left">FAQ</button>
                  </div>
                </div>
              </RevealSection>
              <RevealSection delay={0.2}>
                <div>
                  <h4 className="text-sm font-medium text-white mb-4">Company</h4>
                  <div className="space-y-2">
                    <button className="block text-sm text-gray-400 hover:text-blue-400 transition hover:translate-x-1 text-left">About Us</button>
                    <button onClick={() => scrollToSection('contact')} className="block text-sm text-gray-400 hover:text-blue-400 transition hover:translate-x-1 text-left">Contact</button>
                  </div>
                </div>
              </RevealSection>
              <RevealSection delay={0.3}>
                <div>
                  <h4 className="text-sm font-medium text-white mb-4">Legal</h4>
                  <div className="space-y-2">
                    {["Privacy Policy", "Terms & Conditions", "Refund Policy", "Cookie Policy"].map((item) => (
                      <button key={item} className="block text-sm text-gray-400 hover:text-blue-400 transition hover:translate-x-1 text-left">{item}</button>
                    ))}
                  </div>
                </div>
              </RevealSection>
            </div>
            
            <RevealSection delay={0.4}>
              <div className="mt-10 pt-6 border-t border-gray-800 text-center">
                <div className="flex flex-col items-center gap-3">
                  <p className="text-sm text-gray-400">
                    © IRYAX SPACE All Rights Reserved. | Made with 
                    <span className="footer-heart mx-1">❤️</span> 
                    by IRYAX
                  </p>
                  <p className="text-xs text-gray-500 tracking-wider uppercase">IRYAX SPACE</p>
                </div>
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