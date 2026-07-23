// DoctorChamber.jsx - Complete Doctor's Chamber Landing Page with IRYAX SPACE FOR MEDICAL Branding
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Stethoscope,
  Layout,
  ArrowRight,
  CheckCircle,
  X,
  Menu,
  MapPin,
  Phone,
  Mail,
  UserCheck,
  Clock,
  Award,
  Sparkles,
  Shield,
  Users,
  Wallet,
  Star,
  ChevronDown,
  HelpCircle,
  Send,
  Building2,
  Calendar,
  HeartPulse,
  Brain,
  Activity,
  Eye,
  EyeOff,
  Bone,
  Microscope,
  TestTube,
  UsersRound,
  Heart,
  ShieldCheck,
  Target,
  Flag,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Home,
  Zap,
  TrendingUp,
  Smile
} from "lucide-react";
import logo from "../assets/logo.png";
import doctorChamber from "../assets/doctorchamber.png";

// ─── IMAGES ───
const DOCTOR_HERO_IMAGE = doctorChamber;

// ─── CHAMBER DATA WITH MULTIPLE IMAGES ───
const CHAMBERS = [
  { 
    id: 1, 
    name: "Chamber 101 - Premium", 
    floor: "1st Floor", 
    size: "200 sq ft", 
    equipment: "Full Medical Setup", 
    price: "₹2,500", 
    images: [
      "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=800&h=600",
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800&h=600",
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800&h=600",
      "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?auto=format&fit=crop&q=80&w=800&h=600"
    ],
    available: true 
  },
  { 
    id: 2, 
    name: "Chamber 102 - Standard", 
    floor: "1st Floor", 
    size: "150 sq ft", 
    equipment: "Basic Medical Setup", 
    price: "₹1,800", 
    images: [
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800&h=600",
      "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=800&h=600",
      "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?auto=format&fit=crop&q=80&w=800&h=600",
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800&h=600"
    ],
    available: true 
  },
  { 
    id: 3, 
    name: "Chamber 201 - Premium Plus", 
    floor: "2nd Floor", 
    size: "250 sq ft", 
    equipment: "Advanced Medical Setup", 
    price: "₹3,200", 
    images: [
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800&h=600",
      "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=800&h=600",
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800&h=600",
      "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?auto=format&fit=crop&q=80&w=800&h=600"
    ],
    available: false 
  },
  { 
    id: 4, 
    name: "Chamber 202 - Executive", 
    floor: "2nd Floor", 
    size: "180 sq ft", 
    equipment: "Full Medical Setup", 
    price: "₹2,200", 
    images: [
      "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?auto=format&fit=crop&q=80&w=800&h=600",
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800&h=600",
      "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=800&h=600",
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800&h=600"
    ],
    available: true 
  },
  { 
    id: 5, 
    name: "Chamber 301 - Deluxe", 
    floor: "3rd Floor", 
    size: "220 sq ft", 
    equipment: "Premium Medical Setup", 
    price: "₹2,800", 
    images: [
      "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=800&h=600",
      "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?auto=format&fit=crop&q=80&w=800&h=600",
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800&h=600",
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800&h=600"
    ],
    available: true 
  },
  { 
    id: 6, 
    name: "Chamber 302 - Compact", 
    floor: "3rd Floor", 
    size: "120 sq ft", 
    equipment: "Basic Medical Setup", 
    price: "₹1,500", 
    images: [
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800&h=600",
      "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=800&h=600",
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800&h=600",
      "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?auto=format&fit=crop&q=80&w=800&h=600"
    ],
    available: true 
  },
];

// ─── SPECIALTIES DATA ───
const MEDICAL_SPECIALTIES = [
  { name: "Permanent Makeup Artist", icon: Eye, desc: "Advanced clinical spaces suitable for cardiac consultations and care." },
  { name: "Consulting Periodontist", icon: Users, desc: "Specialized care for gum health, periodontal disease management, and advanced gum treatments." },
  { name: "RDI Consultant", icon: Brain, desc: "Expert guidance and diagnostic insight to support accurate treatment planning." },
  { name: "Psychotherapist", icon: Heart, desc: "Advanced clinical spaces suitable for cardiac consultations and care." },
  { name: "Psychiatric", icon: Shield, desc: "Compassionate mental health support for emotional well-being and psychiatric care." },
  { name: "Paramedical Camouflage", icon: Eye, desc: "Advanced skin camouflage techniques to conceal scars and pigmentation." },
  { name: "Implantologist", icon: Stethoscope, desc: "Modern dental implant solutions to restore function and confident smiles." },
  { name: "Hypnotherapist", icon: Brain, desc: "Professional hypnotherapy sessions to manage stress, habits, and anxiety." }
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
  @keyframes heartbeat {
    0%, 100% { transform: scale(1); }
    14% { transform: scale(1.05); }
    28% { transform: scale(1); }
    42% { transform: scale(1.05); }
    70% { transform: scale(1); }
  }
  @keyframes slide-up {
    from { opacity: 0; transform: translateY(60px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes float-glass {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-10px) rotate(2deg); }
  }
  @keyframes scale-in {
    from { opacity: 0; transform: scale(0.8); }
    to { opacity: 1; transform: scale(1); }
  }
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }

  .animate-float { animation: float 6s ease-in-out infinite; }
  .animate-heartbeat { animation: heartbeat 1.5s ease-in-out infinite; }
  .animate-slide-up { animation: slide-up 0.8s ease-out; }
  .animate-gradient { background-size: 200% 200%; animation: gradient 3s ease infinite; }
  .animate-spin-slow { animation: spin-slow 4s linear infinite; }
  .animate-scale-in { animation: scale-in 0.6s ease-out; }
  .animate-float-glass { animation: float-glass 6s ease-in-out infinite; }
  .animate-shimmer { background-size: 200% center; animation: shimmer 3s ease-in-out infinite; }

  .reveal {
    opacity: 0;
    transform: translateY(40px);
    transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .reveal.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .footer-heart {
    color: #ef4444;
    display: inline-block;
    animation: heartbeat 1.5s ease-in-out infinite;
  }

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

  .navbar-custom .nav-links {
    display: flex !important;
    align-items: center !important;
    gap: 4px !important;
    flex-wrap: nowrap !important;
    white-space: nowrap !important;
  }

  .navbar-custom .navbar-link {
    font-size: 0.88rem !important;
    font-weight: 400 !important;
    padding: 8px 14px !important;
    color: #ffffff !important;
    cursor: pointer;
    transition: all 0.3s;
    border-radius: 9999px;
    background: none;
    border: none;
    font-family: inherit;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    letter-spacing: 0.5px;
    white-space: nowrap !important;
  }

  .navbar-custom .navbar-link:hover {
    color: #93c5fd !important;
    background: rgba(255, 255, 255, 0.15) !important;
  }

  .navbar-custom .navbar-brand {
    font-size: 1.2rem !important;
    font-weight: 300 !important;
    color: #ffffff !important;
    display: flex;
    align-items: center;
    gap: 10px;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    white-space: nowrap !important;
    letter-spacing: 0.5px;
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
    font-size: 0.82rem !important;
    font-weight: 400 !important;
    padding: 8px 18px !important;
    background: rgba(255, 255, 255, 0.15) !important;
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #ffffff !important;
    border-radius: 9999px;
    transition: all 0.3s;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    white-space: nowrap !important;
  }

  .navbar-custom .navbar-btn:hover {
    background: rgba(255, 255, 255, 0.25) !important;
    transform: scale(1.05);
  }

  .navbar-custom .navbar-signin {
    font-size: 0.85rem !important;
    font-weight: 400 !important;
    color: #ffffff !important;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    background: none;
    border: none;
    padding: 8px 14px;
    border-radius: 9999px;
    cursor: pointer;
    transition: all 0.3s;
    white-space: nowrap !important;
  }

  .navbar-custom .navbar-signin:hover {
    color: #93c5fd !important;
    background: rgba(255, 255, 255, 0.1);
  }

  .navbar-custom .navbar-logo {
    width: 44px !important;
    height: 44px !important;
    border: 2px solid rgba(255, 255, 255, 0.3) !important;
    border-radius: 50% !important;
    padding: 3px !important;
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

  .navbar-menu-btn {
    display: none !important;
    color: #ffffff !important;
    padding: 8px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    cursor: pointer;
    transition: all 0.3s;
    align-items: center;
    justify-content: center;
  }

  .navbar-menu-btn:hover {
    background: rgba(255, 255, 255, 0.1);
  }

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
    background: linear-gradient(135deg, #4f46e5, #7c3aed);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .navbar-scrolled .navbar-btn {
    background: linear-gradient(135deg, #4f46e5, #7c3aed) !important;
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #ffffff !important;
  }

  .navbar-scrolled .navbar-btn:hover {
    background: linear-gradient(135deg, #5b4fd6, #8b5cf6) !important;
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

  @media (max-width: 992px) {
    .navbar-custom .nav-links {
      display: none !important;
    }
    .navbar-menu-btn {
      display: flex !important;
    }
  }

  @media (max-width: 640px) {
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
    .navbar-custom .navbar-logo {
      width: 38px !important;
      height: 38px !important;
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
  }

  .mobile-menu-close {
    position: absolute;
    top: 16px;
    right: 16px;
    padding: 8px;
    border-radius: 50%;
    background: #f1f5f9;
    border: none;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .mobile-menu-close:hover {
    background: #e2e8f0;
    transform: rotate(90deg);
  }

  /* Hero Section - IRYAX SPACE FOR MEDICAL */
  .doctor-hero-section {
    position: relative;
    min-height: 100vh;
    display: flex;
    align-items: center;
    padding: 80px 24px 60px;
    overflow: hidden;
  }

  .doctor-hero-bg {
    position: absolute;
    inset: 0;
    z-index: 0;
    overflow: hidden;
  }

  .doctor-hero-bg img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .doctor-hero-overlay {
    position: absolute;
    inset: 0;
    z-index: 1;
    background: rgba(0, 0, 0, 0.35);
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
  }

  .doctor-hero-content {
    position: relative;
    z-index: 10;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
  }

  .doctor-hero-text-box {
    max-width: 750px;
    margin-left: 0;
    margin-right: auto;
  }

  /* Hero Badge - India's 1st Medical Co-working Space */
  .hero-badge-top {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 6px 18px 6px 10px;
    background: rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 9999px;
    font-size: 12px;
    font-weight: 700;
    color: #ffffff !important;
    margin-bottom: 16px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }

  .hero-badge-top .badge-icon {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: linear-gradient(135deg, #1a3a6b, #4f46e5);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
  }

  .hero-badge-top .badge-text {
    font-weight: 600;
    color: #ffffff !important;
  }

  .hero-badge-top .badge-highlight {
    background: linear-gradient(135deg, #fbbf24, #f59e0b);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: 800;
  }

  /* Main Hero Title - WHITE TEXT */
  .doctor-hero-title {
    font-size: 3.5rem !important;
    font-weight: 800 !important;
    line-height: 1.1 !important;
    color: #ffffff !important;
    margin-bottom: 4px;
    text-shadow: 0 2px 30px rgba(0, 0, 0, 0.4);
  }

  .doctor-hero-title .brand-name {
    font-size: 3.5rem !important;
    font-weight: 900 !important;
    color: #ffffff !important;
    text-shadow: 0 2px 30px rgba(0, 0, 0, 0.4);
    display: inline-block;
  }

  .doctor-hero-title .brand-sub {
    font-size: 2.5rem !important;
    font-weight: 700 !important;
    color: #ffffff !important;
    display: block;
    margin-top: -4px;
    text-shadow: 0 2px 30px rgba(0, 0, 0, 0.4);
  }

  .doctor-hero-title .brand-sub span {
    color: #ffffff !important;
    text-shadow: 0 2px 30px rgba(0, 0, 0, 0.4);
  }

  /* Hero Description - WHITE TEXT */
  .doctor-hero-desc {
    font-size: 1rem !important;
    line-height: 1.6 !important;
    color: #ffffff !important;
    max-width: 520px;
    margin-top: 8px;
    font-weight: 600 !important;
    text-shadow: 0 2px 20px rgba(0, 0, 0, 0.4);
  }

  .doctor-hero-desc strong {
    color: #ffffff;
    font-weight: 700;
  }

  /* Hero Features List - WHITE TEXT */
  .hero-features-list {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 18px;
    margin-top: 12px;
    max-width: 480px;
  }

  .hero-features-list .feature-item {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #ffffff !important;
    font-size: 0.8rem;
    font-weight: 600;
    text-shadow: 0 2px 15px rgba(0, 0, 0, 0.4);
  }

  .hero-features-list .feature-item svg {
    color: #93c5fd !important;
    flex-shrink: 0;
    width: 16px;
    height: 16px;
  }

  /* Buttons */
  .btn-primary {
    padding: 14px 32px !important;
    font-size: 0.95rem !important;
    font-weight: 700 !important;
    color: white;
    background: linear-gradient(135deg, #0a1628, #1a3a6b);
    border-radius: 14px;
    border: none;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    letter-spacing: 0.5px;
    box-shadow: 0 4px 20px rgba(26, 58, 107, 0.3);
  }

  .btn-primary:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 40px rgba(26, 58, 107, 0.4);
  }

  .btn-secondary {
    padding: 14px 32px !important;
    font-size: 0.95rem !important;
    font-weight: 700 !important;
    color: #1a3a6b;
    background: rgba(255, 255, 255, 0.7);
    border: 1px solid rgba(26, 58, 107, 0.2);
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
    background: rgba(255, 255, 255, 0.9);
  }

  .btn-hero-group {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 14px;
    margin-top: 16px;
  }

  /* Stats - WHITE TEXT */
  .doctor-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-top: 20px;
    background: rgba(255,255,255,0.12);
    backdrop-filter: blur(12px);
    border-radius: 16px;
    padding: 16px 20px;
    border: 1px solid rgba(255,255,255,0.15);
  }

  .doctor-stat-item {
    text-align: center;
  }

  .doctor-stat-item .number {
    font-size: 1.6rem;
    font-weight: 800;
    color: #ffffff !important;
    text-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
  }

  .doctor-stat-item .label {
    font-size: 0.7rem;
    font-weight: 700;
    color: #e2e8f0 !important;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-top: 2px;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  }

  .doctor-features-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
    margin-top: 40px;
  }

  .doctor-feature-card {
    background: rgba(255,255,255,0.12);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 20px;
    padding: 28px 20px;
    text-align: center;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 0 4px 20px rgba(0,0,0,0.04);
  }

  .doctor-feature-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 60px rgba(79, 70, 229, 0.15);
    border-color: rgba(255,255,255,0.25);
  }

  .doctor-feature-card .icon-wrap {
    width: 56px;
    height: 56px;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.12);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 14px;
    color: #ffffff;
    font-size: 24px;
    border: 1px solid rgba(255,255,255,0.12);
  }

  .doctor-feature-card h4 {
    font-size: 0.95rem;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 4px;
    text-shadow: 0 2px 8px rgba(0,0,0,0.3);
    letter-spacing: 0.5px;
  }

  .doctor-feature-card p {
    font-size: 0.8rem;
    font-weight: 500;
    color: #cbd5e1;
    line-height: 1.5;
    text-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }

  .doctor-cta-section {
    background: linear-gradient(135deg, #0a1628, #1a3a6b);
    border-radius: 24px;
    padding: 48px 40px;
    margin-top: 60px;
    text-align: center;
    color: white;
    position: relative;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,0.1);
  }

  .doctor-cta-section::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -20%;
    width: 60%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%);
    pointer-events: none;
  }

  .doctor-cta-section h2 {
    font-size: 2.2rem;
    font-weight: 800;
    margin-bottom: 8px;
    position: relative;
    letter-spacing: 0.5px;
  }

  .doctor-cta-section p {
    font-size: 1rem;
    font-weight: 500;
    opacity: 0.9;
    max-width: 500px;
    margin: 0 auto 24px;
    position: relative;
    color: #cbd5e1;
  }

  .doctor-cta-btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 14px 36px;
    background: rgba(255,255,255,0.15);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255,255,255,0.2);
    color: #ffffff;
    border-radius: 14px;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s;
    position: relative;
    letter-spacing: 0.5px;
  }

  .doctor-cta-btn:hover {
    transform: scale(1.05);
    background: rgba(255,255,255,0.25);
    box-shadow: 0 8px 30px rgba(0,0,0,0.2);
  }

  .glass-card {
    border-radius: 28px !important;
    padding: 32px 28px;
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    position: relative;
    overflow: hidden;
    backdrop-filter: blur(24px) saturate(180%);
    -webkit-backdrop-filter: blur(24px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
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
    font-weight: 800;
    font-size: 1.15rem;
    letter-spacing: 0.5px;
    text-shadow: 0 1px 2px rgba(255, 255, 255, 0.3);
    margin-bottom: 6px;
  }

  .glass-card p {
    position: relative;
    z-index: 1;
    color: #1a2a4a !important;
    font-weight: 600;
    font-size: 0.9rem;
    line-height: 1.7;
    opacity: 0.9;
    flex: 1;
  }

  .glass-blue {
    background: rgba(79, 70, 229, 0.15) !important;
    border-color: rgba(79, 70, 229, 0.2);
  }
  .glass-blue:hover {
    background: rgba(79, 70, 229, 0.25) !important;
  }

  .glass-purple {
    background: rgba(124, 58, 237, 0.15) !important;
    border-color: rgba(124, 58, 237, 0.2);
  }
  .glass-purple:hover {
    background: rgba(124, 58, 237, 0.25) !important;
  }

  .glass-rose {
    background: rgba(220, 38, 38, 0.15) !important;
    border-color: rgba(220, 38, 38, 0.2);
  }
  .glass-rose:hover {
    background: rgba(220, 38, 38, 0.25) !important;
  }

  .glass-teal {
    background: rgba(13, 148, 136, 0.15) !important;
    border-color: rgba(13, 148, 136, 0.2);
  }
  .glass-teal:hover {
    background: rgba(13, 148, 136, 0.25) !important;
  }

  .specialties-gradient-heading {
    background: linear-gradient(135deg, #0a1628, #1a3a6b, #0a1628);
    background-size: 200% 200%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: 900 !important;
    animation: gradient 3s ease infinite;
  }

  /* Chamber Card Styles */
  .chamber-card {
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    border-radius: 20px;
    overflow: hidden;
    background: white;
    border: 1px solid rgba(0,0,0,0.06);
    box-shadow: 0 4px 20px rgba(0,0,0,0.04);
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .chamber-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 60px rgba(0,0,0,0.1);
    border-color: rgba(79, 70, 229, 0.2);
  }

  .chamber-card .chamber-image {
    height: 180px;
    overflow: hidden;
    position: relative;
    flex-shrink: 0;
  }

  .chamber-card .chamber-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s;
  }

  .chamber-card:hover .chamber-image img {
    transform: scale(1.05);
  }

  .chamber-card .chamber-status {
    position: absolute;
    top: 12px;
    right: 12px;
    padding: 4px 14px;
    border-radius: 9999px;
    font-size: 0.7rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    backdrop-filter: blur(4px);
  }

  .chamber-card .chamber-status.available {
    background: rgba(34, 197, 94, 0.9);
    color: white;
  }

  .chamber-card .chamber-status.unavailable {
    background: rgba(239, 68, 68, 0.9);
    color: white;
  }

  .chamber-card .chamber-body {
    padding: 18px 20px 20px;
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .chamber-card .chamber-body h4 {
    font-size: 1rem;
    font-weight: 800;
    color: #0a1628;
    margin-bottom: 4px;
  }

  .chamber-card .chamber-body .chamber-details {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4px 12px;
    font-size: 0.78rem;
    color: #64748b;
    margin: 8px 0 10px;
  }

  .chamber-card .chamber-body .chamber-details span {
    display: flex;
    align-items: center;
    gap: 4px;
    font-weight: 600;
  }

  .chamber-card .chamber-body .chamber-price {
    font-size: 1.1rem;
    font-weight: 800;
    color: #1a3a6b;
    margin-top: auto;
    padding-top: 10px;
    border-top: 1px solid rgba(0,0,0,0.05);
  }

  .chamber-card .chamber-body .chamber-price small {
    font-size: 0.7rem;
    font-weight: 600;
    color: #94a3b8;
  }

  /* Chamber Popup with Slider */
  .chamber-popup-overlay {
    position: fixed;
    inset: 0;
    z-index: 200;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    animation: fadeIn 0.3s ease;
  }

  .chamber-popup {
    background: white;
    border-radius: 28px;
    max-width: 580px;
    width: 100%;
    max-height: 95vh;
    overflow-y: auto;
    animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 0 40px 80px rgba(0,0,0,0.3);
  }

  .chamber-popup .popup-slider {
    position: relative;
    height: 280px;
    overflow: hidden;
    background: #f1f5f9;
  }

  .chamber-popup .popup-slider .slider-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: opacity 0.5s ease;
  }

  .chamber-popup .popup-slider .slider-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(0,0,0,0.5);
    backdrop-filter: blur(4px);
    border: none;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s;
    z-index: 5;
  }

  .chamber-popup .popup-slider .slider-btn:hover {
    background: rgba(0,0,0,0.7);
    transform: translateY(-50%) scale(1.1);
  }

  .chamber-popup .popup-slider .slider-btn.prev {
    left: 12px;
  }

  .chamber-popup .popup-slider .slider-btn.next {
    right: 12px;
  }

  .chamber-popup .popup-slider .slider-dots {
    position: absolute;
    bottom: 16px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 8px;
    z-index: 5;
  }

  .chamber-popup .popup-slider .slider-dots .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: rgba(255,255,255,0.4);
    border: none;
    cursor: pointer;
    transition: all 0.3s;
    padding: 0;
  }

  .chamber-popup .popup-slider .slider-dots .dot.active {
    background: white;
    transform: scale(1.2);
  }

  .chamber-popup .popup-slider .slider-dots .dot:hover {
    background: rgba(255,255,255,0.8);
  }

  .chamber-popup .popup-close {
    position: absolute;
    top: 16px;
    right: 16px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(0,0,0,0.5);
    backdrop-filter: blur(4px);
    border: none;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s;
    z-index: 10;
  }

  .chamber-popup .popup-close:hover {
    background: rgba(0,0,0,0.7);
    transform: rotate(90deg);
  }

  .chamber-popup .popup-content {
    padding: 28px 30px 30px;
  }

  .chamber-popup .popup-content h3 {
    font-size: 1.4rem;
    font-weight: 800;
    color: #0a1628;
    margin-bottom: 2px;
  }

  .chamber-popup .popup-content .popup-sub {
    font-size: 0.85rem;
    color: #64748b;
    margin-bottom: 12px;
    font-weight: 600;
  }

  .chamber-popup .popup-content .popup-details {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px 16px;
    background: #f8fafc;
    padding: 14px 18px;
    border-radius: 14px;
    margin: 10px 0 16px;
  }

  .chamber-popup .popup-content .popup-details .detail-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.85rem;
    color: #334155;
    font-weight: 600;
  }

  .chamber-popup .popup-content .popup-details .detail-item svg {
    color: #4f46e5;
    flex-shrink: 0;
  }

  .chamber-popup .popup-content .popup-price {
    font-size: 1.5rem;
    font-weight: 800;
    color: #1a3a6b;
    margin: 8px 0 16px;
  }

  .chamber-popup .popup-content .popup-price small {
    font-size: 0.85rem;
    font-weight: 600;
    color: #94a3b8;
  }

  .chamber-popup .popup-book-btn {
    width: 100%;
    padding: 14px;
    background: linear-gradient(135deg, #0a1628, #1a3a6b);
    color: white;
    border: none;
    border-radius: 14px;
    font-size: 1rem;
    font-weight: 800;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }

  .chamber-popup .popup-book-btn:hover {
    transform: scale(1.02);
    box-shadow: 0 8px 30px rgba(26, 58, 107, 0.3);
  }

  .chamber-popup .popup-book-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  /* Medical Specialties Cards */
  .specialty-card {
    padding: 20px 18px;
    border-radius: 16px;
    background: white;
    border: 1px solid rgba(0,0,0,0.04);
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 0 2px 12px rgba(0,0,0,0.02);
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .specialty-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(26, 58, 107, 0.08);
    border-color: rgba(26, 58, 107, 0.1);
  }

  .specialty-card .spec-icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: linear-gradient(135deg, #eef2ff, #e0e7ff);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #1a3a6b;
    margin-bottom: 10px;
    flex-shrink: 0;
  }

  .specialty-card h4 {
    font-size: 0.9rem;
    font-weight: 800;
    color: #0a1628;
    margin-bottom: 4px;
  }

  .specialty-card p {
    font-size: 0.75rem;
    color: #64748b;
    line-height: 1.6;
    font-weight: 500;
    flex: 1;
  }

  @media (max-width: 768px) {
    .doctor-stats {
      grid-template-columns: 1fr 1fr 1fr;
      padding: 16px;
      gap: 12px;
    }
    .doctor-stat-item .number {
      font-size: 1.4rem;
    }
    .doctor-features-grid {
      grid-template-columns: 1fr 1fr;
    }
    .doctor-hero-title {
      font-size: 2.8rem !important;
    }
    .doctor-hero-title .brand-name {
      font-size: 2.6rem !important;
    }
    .doctor-hero-title .brand-sub {
      font-size: 2rem !important;
    }
    .doctor-cta-section {
      padding: 32px 20px;
    }
    .doctor-cta-section h2 {
      font-size: 1.6rem;
    }
    .glass-card {
      padding: 20px 16px;
    }
    .chamber-popup {
      max-width: 100%;
      margin: 10px;
    }
    .chamber-popup .popup-content {
      padding: 20px;
    }
    .chamber-popup .popup-content .popup-details {
      grid-template-columns: 1fr;
    }
    .chamber-popup .popup-slider {
      height: 200px;
    }
    .hero-features-list {
      gap: 4px 12px;
    }
    .hero-features-list .feature-item {
      font-size: 0.75rem;
    }
  }

  @media (max-width: 480px) {
    .doctor-features-grid {
      grid-template-columns: 1fr;
    }
    .doctor-stats {
      grid-template-columns: 1fr 1fr;
    }
    .doctor-hero-title {
      font-size: 2rem !important;
    }
    .doctor-hero-title .brand-name {
      font-size: 1.8rem !important;
    }
    .doctor-hero-title .brand-sub {
      font-size: 1.3rem !important;
    }
    .chamber-popup .popup-slider {
      height: 180px;
    }
    .chamber-popup .popup-slider .slider-btn {
      width: 30px;
      height: 30px;
    }
    .hero-badge-top {
      font-size: 10px;
      padding: 4px 12px 4px 6px;
    }
    .hero-badge-top .badge-icon {
      width: 22px;
      height: 22px;
      font-size: 11px;
    }
    .btn-primary, .btn-secondary {
      padding: 12px 24px !important;
      font-size: 0.85rem !important;
    }
    .doctor-hero-desc {
      font-size: 0.9rem !important;
    }
    .hero-features-list .feature-item {
      font-size: 0.7rem;
    }
  }
`;

// ─── HOOKS ───
const useScrollReveal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = React.useRef(null);

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

const BrandWithIcon = () => (
  <span className="navbar-brand hidden sm:block transition flex items-center gap-2">
    IRYAX SPACE
    <span className="brand-icon flex items-center justify-center">
      <Layout size={18} />
    </span>
  </span>
);

// ─── MAIN DOCTOR CHAMBER PAGE ───
const DoctorChamberPage = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", address: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [showThankYouPopup, setShowThankYouPopup] = useState(false);
  
  // Chamber state
  const [selectedChamber, setSelectedChamber] = useState(null);
  const [showChamberPopup, setShowChamberPopup] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleChamberClick = (chamber) => {
    setSelectedChamber(chamber);
    setCurrentImageIndex(0);
    setShowChamberPopup(true);
    document.body.style.overflow = 'hidden';
  };

  const closeChamberPopup = () => {
    setShowChamberPopup(false);
    document.body.style.overflow = 'auto';
    setTimeout(() => setSelectedChamber(null), 300);
  };

  const handleBookChamber = () => {
    setIsBooking(true);
    setTimeout(() => {
      setIsBooking(false);
      closeChamberPopup();
      setShowThankYouPopup(true);
      setTimeout(() => setShowThankYouPopup(false), 5000);
    }, 1500);
  };

  const handlePrevImage = () => {
    if (selectedChamber) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedChamber.images.length - 1 : prev - 1
      );
    }
  };

  const handleNextImage = () => {
    if (selectedChamber) {
      setCurrentImageIndex((prev) => 
        prev === selectedChamber.images.length - 1 ? 0 : prev + 1
      );
    }
  };

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
        setShowThankYouPopup(true);
        setFormData({ name: "", email: "", phone: "", address: "", message: "" });
        setTimeout(() => {
          setShowThankYouPopup(false);
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

  const doctorBenefits = [
    { icon: Shield, title: "No Long Leases", desc: "Avoid long-term commitments and heavy deposits.", glassClass: "glass-blue" },
    { icon: Wallet, title: "Low Operational Costs", desc: "Pay only for what you use. No hidden charges.", glassClass: "glass-teal" },
    { icon: Users, title: "Admin Hassle-Free", desc: "We manage staff, billing, and daily operations for you.", glassClass: "glass-purple" },
    { icon: Sparkles, title: "Modern Infrastructure", desc: "Fully-equipped with state-of-the-art medical tools.", glassClass: "glass-rose" }
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="min-h-screen bg-white text-gray-900 font-light antialiased">

        {/* ─── THANK YOU POPUP ─── */}
        {showThankYouPopup && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl border border-gray-100 animate-slide-up relative">
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
                <p className="text-gray-600 mb-2 font-bold">Thanks for your interest in IRYAX SPACE!</p>
                <p className="text-gray-500 text-sm font-bold">We will contact you soon.</p>
                <button
                  onClick={() => setShowThankYouPopup(false)}
                  className="mt-6 px-6 py-2 bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-xl hover:shadow-lg transition font-bold"
                >
                  Got it
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── CHAMBER POPUP WITH SLIDER ─── */}
        {showChamberPopup && selectedChamber && (
          <div className="chamber-popup-overlay" onClick={closeChamberPopup}>
            <div className="chamber-popup" onClick={(e) => e.stopPropagation()}>
              <div className="popup-slider">
                <img 
                  src={selectedChamber.images[currentImageIndex]} 
                  alt={selectedChamber.name}
                  className="slider-image"
                />
                <button className="popup-close" onClick={closeChamberPopup}>
                  <X size={22} />
                </button>
                <span className={`chamber-status ${selectedChamber.available ? 'available' : 'unavailable'}`} style={{ position: 'absolute', top: '16px', left: '16px', right: 'auto', zIndex: 5 }}>
                  {selectedChamber.available ? 'Available' : 'Booked'}
                </span>
                
                {selectedChamber.images.length > 1 && (
                  <>
                    <button className="slider-btn prev" onClick={handlePrevImage}>
                      <ChevronLeft size={20} />
                    </button>
                    <button className="slider-btn next" onClick={handleNextImage}>
                      <ChevronRight size={20} />
                    </button>
                    <div className="slider-dots">
                      {selectedChamber.images.map((_, idx) => (
                        <button
                          key={idx}
                          className={`dot ${idx === currentImageIndex ? 'active' : ''}`}
                          onClick={() => setCurrentImageIndex(idx)}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
              <div className="popup-content">
                <h3>{selectedChamber.name}</h3>
                <p className="popup-sub">{selectedChamber.floor} • {selectedChamber.size}</p>
                <div className="popup-details">
                  <span className="detail-item"><Building2 size={16} /> {selectedChamber.floor}</span>
                  <span className="detail-item"><Layout size={16} /> {selectedChamber.size}</span>
                  <span className="detail-item"><Stethoscope size={16} /> {selectedChamber.equipment}</span>
                  <span className="detail-item"><CheckCircle size={16} /> {selectedChamber.available ? 'Available Now' : 'Currently Booked'}</span>
                </div>
                <div className="popup-price">
                  {selectedChamber.price} <small>/ hour</small>
                </div>
                <button 
                  className="popup-book-btn" 
                  onClick={handleBookChamber}
                  disabled={!selectedChamber.available || isBooking}
                >
                  {isBooking ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Booking...
                    </>
                  ) : (
                    selectedChamber.available ? (
                      <>Book This Chamber <ArrowRight size={18} /></>
                    ) : (
                      <>Not Available</>
                    )
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── NAVBAR ─── */}
        <nav className={`navbar-custom ${scrolled ? 'navbar-scrolled' : ''}`}>
          <div className="navbar-inner">
            <button onClick={() => navigate('/')} className="flex items-center gap-3 group">
              <div className="navbar-logo">
                <img src={logo} alt="Logo" />
              </div>
              <BrandWithIcon />
            </button>

            <div className="nav-links">
              <button onClick={() => scrollToSection('chambers')} className="navbar-link">Chambers</button>
              <button onClick={() => scrollToSection('benefits')} className="navbar-link">Benefits</button>
              <button onClick={() => scrollToSection('specialties')} className="navbar-link">Specialties</button>
              <button onClick={() => scrollToSection('about')} className="navbar-link">About</button>
              <button onClick={() => scrollToSection('faq')} className="navbar-link">FAQ</button>
              <button onClick={() => scrollToSection('contact')} className="navbar-link">Contact</button>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => navigate("/doctorlogin")} className="navbar-signin hidden sm:block">
                Sign In
              </button>
              <button onClick={() => navigate("/doctorlogin")} className="navbar-btn">
                <Stethoscope size={14} /> Book Chamber
              </button>
              <button 
                onClick={() => setMobileOpen(!mobileOpen)} 
                className="navbar-menu-btn"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </nav>

        {/* ─── MOBILE MENU ─── */}
        <div className={`fixed inset-0 z-40 bg-white pt-20 px-6 transition-all duration-500 ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          <button 
            onClick={() => setMobileOpen(false)} 
            className="mobile-menu-close"
            aria-label="Close menu"
          >
            <X size={22} className="text-gray-700" />
          </button>
          
          <div className="flex flex-col gap-2 max-w-sm mx-auto mt-8">
            <button onClick={() => { setMobileOpen(false); scrollToSection('chambers'); }} className="px-4 py-3 text-base text-gray-700 hover:text-blue-800 bg-gray-50 hover:bg-gray-100 rounded-lg transition font-bold text-left">Chambers</button>
            <button onClick={() => { setMobileOpen(false); scrollToSection('benefits'); }} className="px-4 py-3 text-base text-gray-700 hover:text-blue-800 bg-gray-50 hover:bg-gray-100 rounded-lg transition font-bold text-left">Benefits</button>
            <button onClick={() => { setMobileOpen(false); scrollToSection('specialties'); }} className="px-4 py-3 text-base text-gray-700 hover:text-blue-800 bg-gray-50 hover:bg-gray-100 rounded-lg transition font-bold text-left">Specialties</button>
            <button onClick={() => { setMobileOpen(false); scrollToSection('about'); }} className="px-4 py-3 text-base text-gray-700 hover:text-blue-800 bg-gray-50 hover:bg-gray-100 rounded-lg transition font-bold text-left">About</button>
            <button onClick={() => { setMobileOpen(false); scrollToSection('faq'); }} className="px-4 py-3 text-base text-gray-700 hover:text-blue-800 bg-gray-50 hover:bg-gray-100 rounded-lg transition font-bold text-left">FAQ</button>
            <button onClick={() => { setMobileOpen(false); scrollToSection('contact'); }} className="px-4 py-3 text-base text-gray-700 hover:text-blue-800 bg-gray-50 hover:bg-gray-100 rounded-lg transition font-bold text-left">Contact</button>
            <div className="h-px bg-gray-200 my-1" />
            <button onClick={() => { navigate("/doctorlogin"); setMobileOpen(false); }} className="px-4 py-3 text-base text-center text-white bg-gradient-to-r from-blue-900 to-blue-700 rounded-lg font-extrabold">
              Book Chamber
            </button>
          </div>
        </div>

        {/* ─── HERO SECTION - ALL WHITE TEXT ─── */}
        <section className="doctor-hero-section">
          <div className="doctor-hero-bg">
            <img src={DOCTOR_HERO_IMAGE} alt="IRYAX SPACE FOR MEDICAL" />
          </div>
          <div className="doctor-hero-overlay"></div>
          <div className="doctor-hero-content">
            <div className="doctor-hero-text-box">
              <RevealSection>
                <div className="hero-badge-top">
                  <span className="badge-icon">🇮🇳</span>
                  <span className="badge-text">IRYAX MEDICAL CO-WORKING SPACE</span>
                </div>
              </RevealSection>

              <RevealSection delay={0.1}>
                <h1 className="doctor-hero-title">
                  <span className="brand-name">IRYAX SPACE</span>
                  <span className="brand-sub">Medical <span>Co-working Space</span></span>
                </h1>
              </RevealSection>

              <RevealSection delay={0.15}>
                <p className="doctor-hero-desc">
                  <strong>Premium medical co-working</strong> with flexible spaces, no long leases, and <strong>stress-free</strong> practice management.
                </p>
              </RevealSection>

              <RevealSection delay={0.2}>
                <div className="hero-features-list">
                  <span className="feature-item"><CheckCircle size={14} /> Flexible Spaces</span>
                  <span className="feature-item"><CheckCircle size={14} /> Fully-Equipped</span>
                  <span className="feature-item"><CheckCircle size={14} /> Admin Support</span>
                  <span className="feature-item"><CheckCircle size={14} /> Zero Deposit</span>
                </div>
              </RevealSection>

              <RevealSection delay={0.25}>
                <div className="btn-hero-group">
                  <button onClick={() => navigate("/doctorlogin")} className="btn-primary">
                    <Stethoscope size={18} />
                    Get Your Space Now
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
                  </button>
                  <button onClick={() => scrollToSection('chambers')} className="btn-secondary">
                    <Building2 size={18} /> View Chambers
                  </button>
                </div>
              </RevealSection>

              <RevealSection delay={0.3}>
                <div className="doctor-stats">
                  <div className="doctor-stat-item">
                    <div className="number">50+</div>
                    <div className="label">Chambers</div>
                  </div>
                  <div className="doctor-stat-item">
                    <div className="number">24/7</div>
                    <div className="label">Access</div>
                  </div>
                  <div className="doctor-stat-item">
                    <div className="number">100+</div>
                    <div className="label">Doctors</div>
                  </div>
                  <div className="doctor-stat-item">
                    <div className="number">100%</div>
                    <div className="label">Satisfaction</div>
                  </div>
                </div>
              </RevealSection>
            </div>
          </div>
        </section>

        {/* ─── ABOUT SECTION ─── */}
        <section id="about" className="py-20 px-6 bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <RevealSection>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 text-xs rounded-full mb-4 tracking-widest uppercase font-extrabold shadow-sm">
                  <Flag size={12} className="text-blue-700" /> About IRYAX SPACE
                </span>
              </RevealSection>
              <RevealSection delay={0.1}>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                  We Provide <span className="bg-gradient-to-r from-blue-900 to-purple-700 bg-clip-text text-transparent">Modern Medical Spaces</span> & Seamless Practice Solutions
                </h2>
              </RevealSection>
              <RevealSection delay={0.2}>
                <p className="mt-4 text-base text-gray-600 font-bold max-w-3xl mx-auto leading-relaxed">
                  IRYAX SPACE offers a flexible clinic space for doctors that empowers healthcare professionals to start or expand their independent practice without the burden of long leases, high operational costs, or administrative stress. Experience a fully-equipped, modern healthcare workspace designed for seamless and stress-free medical practice.
                </p>
              </RevealSection>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[
                { icon: Home, label: "Flexible Practice Spaces" },
                { icon: Wallet, label: "Cost-Effective Solutions" },
                { icon: Stethoscope, label: "Fully-Equipped Clinics" },
                { icon: Users, label: "Administrative Support" },
                { icon: Shield, label: "Stress-Free Management" },
                { icon: Layout, label: "Modern Interiors & Comfort" },
                { icon: Microscope, label: "State-of-the-Art Tools" },
                { icon: Star, label: "Positive Feedback" }
              ].map((item, i) => (
                <RevealSection key={i} delay={i * 0.05}>
                  <div className="p-4 rounded-xl bg-white border border-gray-100 hover:border-blue-300 transition hover:shadow-md text-center group">
                    <div className="w-10 h-10 mx-auto rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-700 group-hover:scale-110 transition">
                      <item.icon size={18} />
                    </div>
                    <p className="text-[10px] font-extrabold text-gray-700 mt-2 leading-tight">{item.label}</p>
                  </div>
                </RevealSection>
              ))}
            </div>

            <RevealSection delay={0.3}>
              <div className="mt-10 text-center">
                <div className="inline-flex items-center gap-4 px-6 py-3 bg-white rounded-2xl shadow-md border border-gray-100">
                  <span className="text-2xl font-extrabold text-blue-900">100+</span>
                  <span className="text-sm font-bold text-gray-600">DOCTOR'S REVIEWS</span>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                  </div>
                </div>
              </div>
            </RevealSection>

            <RevealSection delay={0.35}>
              <div className="mt-8 text-center">
                <button onClick={() => scrollToSection('chambers')} className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-xl font-extrabold hover:shadow-lg hover:shadow-blue-900/25 transition hover:scale-105">
                  Discover Our Spaces <ArrowRight size={18} />
                </button>
              </div>
            </RevealSection>
          </div>
        </section>

        {/* ─── CHAMBERS SECTION ─── */}
        <section id="chambers" className="py-20 px-6 bg-gradient-to-b from-white via-blue-50 to-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <RevealSection>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 border border-blue-200 text-blue-800 text-xs rounded-full mb-4 tracking-widest uppercase font-extrabold">
                  <Building2 size={12} /> Our Chambers
                </span>
              </RevealSection>
              <RevealSection delay={0.1}>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                  Choose Your <span className="bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent">Perfect Chamber</span>
                </h2>
              </RevealSection>
              <RevealSection delay={0.2}>
                <p className="mt-3 text-base text-gray-600 font-bold max-w-2xl mx-auto">Click on any chamber to view details and book instantly.</p>
              </RevealSection>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {CHAMBERS.map((chamber, i) => (
                <RevealSection key={chamber.id} delay={i * 0.08}>
                  <div className="chamber-card" onClick={() => handleChamberClick(chamber)}>
                    <div className="chamber-image">
                      <img src={chamber.images[0]} alt={chamber.name} />
                      <span className={`chamber-status ${chamber.available ? 'available' : 'unavailable'}`}>
                        {chamber.available ? 'Available' : 'Booked'}
                      </span>
                    </div>
                    <div className="chamber-body">
                      <h4>{chamber.name}</h4>
                      <div className="chamber-details">
                        <span><Building2 size={14} /> {chamber.floor}</span>
                        <span><Layout size={14} /> {chamber.size}</span>
                      </div>
                      <div className="chamber-price">
                        {chamber.price} <small>/ hour</small>
                      </div>
                    </div>
                  </div>
                </RevealSection>
              ))}
            </div>
          </div>
        </section>

        {/* ─── SPECIALTIES SECTION - Medical Specializations ─── */}
        <section id="specialties" className="py-20 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <RevealSection>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 border border-blue-200 text-blue-800 text-xs rounded-full mb-4 tracking-widest uppercase font-extrabold">
                  <UsersRound size={12} /> Specialties
                </span>
              </RevealSection>
              <RevealSection delay={0.1}>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                  We Serve Across <span className="specialties-gradient-heading">Multiple Medical Specializations</span>
                </h2>
              </RevealSection>
              <RevealSection delay={0.2}>
                <p className="mt-3 text-base text-gray-600 font-bold max-w-2xl mx-auto">Modern consultation rooms designed for every medical specialty.</p>
              </RevealSection>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {MEDICAL_SPECIALTIES.map((spec, i) => {
                const Icon = spec.icon;
                return (
                  <RevealSection key={i} delay={i * 0.06}>
                    <div className="specialty-card">
                      <div className="spec-icon"><Icon size={22} /></div>
                      <h4>{spec.name}</h4>
                      <p>{spec.desc}</p>
                    </div>
                  </RevealSection>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── BENEFITS ─── */}
        <section id="benefits" className="py-20 px-6 bg-gradient-to-b from-gray-100 via-white to-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <RevealSection>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/60 backdrop-blur-sm border border-white/30 text-blue-800 text-xs rounded-full mb-4 tracking-widest uppercase font-extrabold shadow-sm">
                  <Star size={12} className="fill-blue-800 text-blue-800" /> Benefits
                </span>
              </RevealSection>
              <RevealSection delay={0.1}>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                  Helping Doctors <span className="bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent">Focus on Patients</span> Not Admin
                </h2>
              </RevealSection>
              <RevealSection delay={0.2}>
                <p className="mt-3 text-base text-gray-600 font-bold max-w-2xl mx-auto">We handle everything so you can focus on what matters most.</p>
              </RevealSection>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {doctorBenefits.map((benefit, i) => (
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
                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/20 text-white/80 text-xs rounded-full mb-4 tracking-widest uppercase font-extrabold">
                  <Sparkles size={12} /> Why Choose Us
                </span>
              </RevealSection>
              <RevealSection delay={0.1}>
                <h2 className="text-3xl sm:text-4xl font-extrabold">
                  Built for <span className="font-extrabold bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">Modern Healthcare</span>
                </h2>
              </RevealSection>
              <RevealSection delay={0.2}>
                <p className="mt-3 text-base text-blue-200 font-bold max-w-2xl mx-auto">Everything you need to start and grow your medical practice.</p>
              </RevealSection>
            </div>

            <div className="doctor-features-grid">
              {[
                { icon: Stethoscope, title: "Medical Equipment", desc: "State-of-the-art medical tools and equipment" },
                { icon: UserCheck, title: "Admin Support", desc: "Reception, billing, and patient management" },
                { icon: Clock, title: "Flexible Hours", desc: "24/7 access with flexible scheduling" },
                { icon: Award, title: "Premium Location", desc: "High-visibility prime medical locations" }
              ].map((feature, i) => (
                <RevealSection key={i} delay={i * 0.1}>
                  <div className="doctor-feature-card">
                    <div className="icon-wrap"><feature.icon size={24} /></div>
                    <h4>{feature.title}</h4>
                    <p>{feature.desc}</p>
                  </div>
                </RevealSection>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <RevealSection>
              <div className="doctor-cta-section">
                <h2>Start Your Practice Today</h2>
                <p>Join 100+ healthcare professionals who've transformed their practice with IRYAX SPACE</p>
                <button onClick={() => navigate("/doctorlogin")} className="doctor-cta-btn">
                  Get Started Now <ArrowRight size={18} />
                </button>
              </div>
            </RevealSection>
          </div>
        </section>

        {/* ─── FAQ ─── */}
        <section id="faq" className="py-20 px-6 bg-gray-50">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <RevealSection>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-gray-100 border border-gray-200 text-gray-700 text-xs rounded-full mb-4 tracking-widest uppercase font-extrabold">
                  <HelpCircle size={12} /> FAQ
                </span>
              </RevealSection>
              <RevealSection delay={0.1}>
                <h2 className="text-3xl font-extrabold text-gray-900">Frequently Asked <span className="bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent">Questions</span></h2>
              </RevealSection>
              <RevealSection delay={0.2}>
                <p className="mt-2 text-base text-gray-600 font-bold">Find answers about IRYAX SPACE Doctor's Chamber.</p>
              </RevealSection>
            </div>

            <div className="space-y-3">
              {[
                { category: "IRYAX SPACE", q: "What types of consultation rooms are available?", a: "We offer fully-equipped private consultation rooms, examination rooms, and collaborative medical spaces." },
                { category: "Flexibility", q: "Do I need to sign a long-term lease?", a: "No! Our model is completely flexible. You can book by hour, day, or month." },
                { category: "Facilities", q: "What medical facilities are included?", a: "All spaces include state-of-the-art medical equipment, high-speed WiFi, comfortable patient areas, and 24/7 security." },
                { category: "Payment", q: "What payment methods are accepted?", a: "We accept credit/debit cards, UPI, net banking, and offer flexible payment plans." },
                { category: "Support", q: "What administrative support do you provide?", a: "We provide full administrative support including reception services, billing assistance, and patient management." }
              ].map((faq, i) => {
                const [openFaq, setOpenFaq] = useState(false);
                return (
                  <RevealSection key={i} delay={i * 0.06}>
                    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden transition hover:shadow-lg hover:border-blue-200">
                      <button onClick={() => setOpenFaq(!openFaq)} className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition">
                        <div>
                          <span className="text-[10px] text-blue-600 uppercase tracking-wider font-extrabold">{faq.category}</span>
                          <p className="text-base font-extrabold text-gray-900 mt-0.5">{faq.q}</p>
                        </div>
                        <ChevronDown size={18} className={`text-gray-500 transition-all duration-300 ${openFaq ? 'rotate-180' : ''}`} />
                      </button>
                      <div className={`overflow-hidden transition-all duration-500 ${openFaq ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="px-6 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3 font-bold">{faq.a}</div>
                      </div>
                    </div>
                  </RevealSection>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── CONTACT ─── */}
        <section id="contact" className="py-20 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50" />
          <div className="relative max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <RevealSection>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/80 border border-gray-200 text-gray-700 text-xs rounded-full mb-4 tracking-widest uppercase font-extrabold">Get in Touch</span>
              </RevealSection>
              <RevealSection delay={0.1}>
                <h2 className="text-3xl font-extrabold text-gray-900">Ready to <span className="bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent">Start Your Practice?</span></h2>
              </RevealSection>
              <RevealSection delay={0.2}>
                <p className="mt-2 text-base text-gray-600 font-bold">Connect with us and transform your medical practice today.</p>
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
                        <p className="text-sm font-extrabold text-gray-900">{item.label}</p>
                        <p className={`text-sm text-gray-600 group-hover:text-blue-700 transition font-bold ${item.label === 'Address' ? 'text-xs leading-relaxed' : ''}`}>{item.value}</p>
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
                        className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm focus:outline-none transition font-bold" 
                        required 
                      />
                      <input 
                        type="email" 
                        placeholder="Your Email" 
                        value={formData.email} 
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                        className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm focus:outline-none transition font-bold" 
                        required 
                      />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <input 
                        type="tel" 
                        placeholder="Phone Number" 
                        value={formData.phone} 
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                        className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm focus:outline-none transition font-bold" 
                        required 
                      />
                      <input 
                        type="text" 
                        placeholder="Address" 
                        value={formData.address} 
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })} 
                        className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm focus:outline-none transition font-bold" 
                      />
                    </div>
                    <textarea 
                      placeholder="Your Message" 
                      rows="4" 
                      value={formData.message} 
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })} 
                      className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm focus:outline-none transition resize-none font-bold" 
                      required 
                    />
                    {submitError && (
                      <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-bold">
                        {submitError}
                      </div>
                    )}
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 text-sm font-extrabold text-white bg-gradient-to-r from-blue-900 to-blue-700 rounded-xl hover:shadow-lg hover:shadow-blue-900/25 transition hover:scale-105 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
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
                        <>Book Your Chamber <Send size={16} className="group-hover:translate-x-1 transition" /></>
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
                  <button onClick={() => navigate('/')} className="flex items-center gap-3 mb-4 group">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-blue-400/30 shadow-lg shadow-blue-500/20 flex-shrink-0 bg-white/10 group-hover:scale-110 transition">
                      <img src={logo} alt="Logo" className="w-full h-full object-contain p-1.5" />
                    </div>
                    <span className="text-base font-extrabold text-white group-hover:text-blue-400 transition flex items-center gap-2">
                      IRYAX SPACE
                      <Stethoscope size={16} className="text-blue-400" />
                    </span>
                  </button>
                  <p className="text-sm text-gray-400 font-bold">India's 1st Medical Co-working Space</p>
                </div>
              </RevealSection>
              <RevealSection delay={0.1}>
                <div>
                  <h4 className="text-sm font-extrabold text-white mb-4">Explore</h4>
                  <div className="space-y-2">
                    <button onClick={() => scrollToSection('chambers')} className="block text-sm text-gray-400 hover:text-blue-400 transition hover:translate-x-1 text-left font-bold">Chambers</button>
                    <button onClick={() => scrollToSection('benefits')} className="block text-sm text-gray-400 hover:text-blue-400 transition hover:translate-x-1 text-left font-bold">Benefits</button>
                    <button onClick={() => scrollToSection('specialties')} className="block text-sm text-gray-400 hover:text-blue-400 transition hover:translate-x-1 text-left font-bold">Specialties</button>
                    <button onClick={() => scrollToSection('about')} className="block text-sm text-gray-400 hover:text-blue-400 transition hover:translate-x-1 text-left font-bold">About</button>
                    <button onClick={() => scrollToSection('faq')} className="block text-sm text-gray-400 hover:text-blue-400 transition hover:translate-x-1 text-left font-bold">FAQ</button>
                  </div>
                </div>
              </RevealSection>
              <RevealSection delay={0.2}>
                <div>
                  <h4 className="text-sm font-extrabold text-white mb-4">Company</h4>
                  <div className="space-y-2">
                    <button className="block text-sm text-gray-400 hover:text-blue-400 transition hover:translate-x-1 text-left font-bold">About Us</button>
                    <button onClick={() => scrollToSection('contact')} className="block text-sm text-gray-400 hover:text-blue-400 transition hover:translate-x-1 text-left font-bold">Contact</button>
                  </div>
                </div>
              </RevealSection>
              <RevealSection delay={0.3}>
                <div>
                  <h4 className="text-sm font-extrabold text-white mb-4">Legal</h4>
                  <div className="space-y-2">
                    {["Privacy Policy", "Terms & Conditions", "Refund Policy", "Cookie Policy"].map((item) => (
                      <button key={item} className="block text-sm text-gray-400 hover:text-blue-400 transition hover:translate-x-1 text-left font-bold">{item}</button>
                    ))}
                  </div>
                </div>
              </RevealSection>
            </div>
            
            <RevealSection delay={0.4}>
              <div className="mt-10 pt-6 border-t border-gray-800 text-center">
                <div className="flex flex-col items-center gap-3">
                  <p className="text-sm text-gray-400 font-bold">
                    © IRYAX SPACE All Rights Reserved. | Made with 
                    <span className="footer-heart mx-1">❤️</span> 
                    by IRYAX
                  </p>
                  <p className="text-xs text-gray-500 tracking-wider uppercase font-extrabold">IRYAX SPACE FOR MEDICAL</p>
                </div>
              </div>
            </RevealSection>
          </div>
        </footer>
      </div>
    </>
  );
};

export default DoctorChamberPage;