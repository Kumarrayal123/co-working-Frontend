// DoctorChamber.jsx
// IRYAX SPACE FOR MEDICAL — redesigned to match the calm "boutique directory"
// look used on PromotionalPage.jsx. All original functionality preserved:
// live chamber fetch (filtered by isChamber), image/video chamber popup,
// simulated booking flow, contact form -> /api/cabins/sendquery, FAQ, nav.

import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
  Eye,
  Brain,
  Heart,
  Microscope,
  Home as HomeIcon,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Video as VideoIcon,
  Loader2,
  Gauge,
  ShieldCheck,
  BadgeCheck,
  Target
} from "lucide-react";
import logo from "../assets/logo.png";
import doctorChamber from "../assets/doctorchamber.png";

const API_URL = "https://spaceapi.iryax.com";
const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?auto=format&fit=crop&q=80&w=1000&h=750";

// ─── SPECIALTIES DATA ───
const MEDICAL_SPECIALTIES = [
  { name: "Permanent Makeup Artist", icon: Eye, desc: "Precision spaces suited for detailed cosmetic and clinical work." },
  { name: "Consulting Periodontist", icon: Users, desc: "Specialized care for gum health and advanced periodontal treatment." },
  { name: "RDI Consultant", icon: Brain, desc: "Expert guidance and diagnostic insight for accurate treatment planning." },
  { name: "Psychotherapist", icon: Heart, desc: "Calm, private rooms suited for one-on-one therapeutic sessions." },
  { name: "Psychiatric", icon: Shield, desc: "Compassionate mental health support in a discreet setting." },
  { name: "Paramedical Camouflage", icon: Eye, desc: "Advanced skin camouflage techniques to conceal scars and pigmentation." },
  { name: "Implantologist", icon: Stethoscope, desc: "Modern dental implant solutions to restore function and confidence." },
  { name: "Hypnotherapist", icon: Brain, desc: "Professional sessions to manage stress, habits, and anxiety." }
];

// ─── FAQ DATA ───
const FAQ_DATA = [
  { category: "Chambers", q: "What types of consultation rooms are available?", a: "Fully-equipped private consultation rooms, examination rooms, and collaborative medical spaces." },
  { category: "Flexibility", q: "Do I need to sign a long-term lease?", a: "No. Our model is fully flexible — book by the hour, day, or month." },
  { category: "Facilities", q: "What medical facilities are included?", a: "Every chamber includes clinical equipment, high-speed WiFi, comfortable patient areas, and 24/7 security." },
  { category: "Payment", q: "What payment methods are accepted?", a: "We accept credit and debit cards, UPI, net banking, and offer flexible payment plans." },
  { category: "Support", q: "What administrative support do you provide?", a: "Full administrative support, including reception, billing assistance, and patient management." }
];

// ═══════════════════════════════════════════════════════════════
// DESIGN TOKENS — shared with PromotionalPage.jsx
// Palette   — ink #12181F · paper #FBF9F5 · paper-dim #F1EDE3
//             brass #B08947 (signature) · teal #23474B · brick #8B4433 (medical)
// Type      — display: 'Fraunces' · body/UI: 'Inter'
// Signature — chamber media card doubles as a compact clinical dossier:
//             a status ribbon + spec row, echoing how a chart is read.
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

  .ix-root { font-family: 'Inter', -apple-system, sans-serif; color: var(--ink); background: var(--paper); }
  .ix-serif { font-family: 'Fraunces', Georgia, serif; }

  @keyframes ix-fade-up { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes ix-fade { from { opacity: 0; } to { opacity: 1; } }
  @keyframes ix-scale-in { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
  @keyframes ix-pulse-dot { 0% { box-shadow: 0 0 0 0 rgba(139,68,51,0.35); } 70% { box-shadow: 0 0 0 7px rgba(139,68,51,0); } 100% { box-shadow: 0 0 0 0 rgba(139,68,51,0); } }
  @keyframes ix-spin { to { transform: rotate(360deg); } }

  .reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1); }
  .reveal.visible { opacity: 1; transform: translateY(0); }
  @media (prefers-reduced-motion: reduce) { .reveal { transition: none; opacity: 1; transform: none; } }

  .line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
  .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

  ::-webkit-scrollbar { width: 8px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--line); border-radius: 10px; }

  /* ─── EYEBROW ─── */
  .ix-eyebrow { display: inline-flex; align-items: center; gap: 8px; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--brass-deep); padding-bottom: 2px; border-bottom: 1px solid var(--line); }
  .ix-eyebrow .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--brass); flex-shrink: 0; }
  .ix-eyebrow.med { color: #A85A3F; }
  .ix-eyebrow.med .dot { background: var(--brick); }

  /* ─── NAVBAR ─── */
  .navbar-custom { position: fixed !important; top: 0; left: 0; right: 0; z-index: 50; height: 82px; padding: 0 32px; background: rgba(251, 249, 245, 0.0); border-bottom: 1px solid transparent; transition: all 0.35s cubic-bezier(0.16,1,0.3,1); display: flex; align-items: center; }
  .navbar-custom .navbar-inner { width: 100%; max-width: 1240px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; }
  .navbar-scrolled { background: rgba(251, 249, 245, 0.92) !important; backdrop-filter: blur(14px); border-bottom: 1px solid var(--line) !important; height: 72px !important; }
  .navbar-custom .navbar-brand { font-family: 'Fraunces', serif; font-size: 1.15rem; font-weight: 600; color: var(--ink); display: flex; align-items: center; gap: 10px; letter-spacing: 0.01em; }
  .navbar-custom .navbar-logo { width: 42px; height: 42px; border: 1px solid var(--line); border-radius: 50%; padding: 3px; background: white; overflow: hidden; flex-shrink: 0; transition: border-color 0.3s; }
  .navbar-custom .navbar-logo:hover { border-color: var(--brick); }
  .navbar-custom .navbar-logo img { width: 100%; height: 100%; object-fit: contain; }
  .navbar-custom .nav-links { display: flex; align-items: center; gap: 2px; }
  .navbar-custom .navbar-link { font-size: 0.86rem; font-weight: 500; padding: 9px 15px; color: var(--ink-soft); background: none; border: none; cursor: pointer; border-radius: 999px; transition: all 0.25s; font-family: inherit; }
  .navbar-custom .navbar-link:hover { color: var(--ink); background: var(--paper-dim); }
  .navbar-custom .navbar-signin { font-size: 0.85rem; font-weight: 500; color: var(--ink-soft); background: none; border: none; padding: 9px 14px; cursor: pointer; }
  .navbar-custom .navbar-signin:hover { color: var(--ink); }
  .navbar-custom .navbar-btn { font-size: 0.82rem; font-weight: 600; padding: 10px 20px; background: var(--brick); color: var(--paper) !important; border: none; border-radius: 999px; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.3s; }
  .navbar-custom .navbar-btn:hover { background: #723627; transform: translateY(-1px); }
  .navbar-menu-btn { display: none; color: var(--ink); padding: 8px; border-radius: 50%; background: var(--paper-dim); border: 1px solid var(--line); cursor: pointer; align-items: center; justify-content: center; }
  @media (max-width: 992px) { .navbar-custom .nav-links { display: none; } .navbar-menu-btn { display: flex; } }
  @media (max-width: 640px) { .navbar-custom { padding: 0 18px; height: 66px; } .navbar-scrolled { height: 66px !important; } }

  .mobile-menu-close { position: absolute; top: 18px; right: 18px; padding: 8px; border-radius: 50%; background: var(--paper-dim); border: 1px solid var(--line); cursor: pointer; }

  /* ─── HERO ─── */
  .hero-section { padding: 168px 32px 90px; background: var(--paper); }
  .hero-grid { max-width: 1240px; margin: 0 auto; display: grid; grid-template-columns: 1.05fr 0.95fr; gap: 64px; align-items: center; }
  .hero-title { font-family: 'Fraunces', serif; font-weight: 400; font-size: clamp(2.6rem, 4.6vw, 3.9rem); line-height: 1.08; color: var(--ink); letter-spacing: -0.01em; margin: 18px 0 20px; }
  .hero-title em { font-style: italic; font-weight: 500; color: var(--brick); }
  .hero-desc { font-size: 1.05rem; line-height: 1.75; color: var(--ink-soft); max-width: 480px; font-weight: 400; }
  .hero-feature-list { display: flex; flex-wrap: wrap; gap: 10px 20px; margin-top: 22px; }
  .hero-feature-list .item { display: flex; align-items: center; gap: 7px; font-size: 0.84rem; font-weight: 600; color: var(--ink-soft); }
  .hero-feature-list .item svg { color: var(--brick); flex-shrink: 0; }
  .hero-buttons { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 30px; }

  .btn-primary { padding: 14px 28px; font-size: 0.92rem; font-weight: 600; color: var(--paper); background: var(--brick); border-radius: 10px; border: none; transition: all 0.3s; display: inline-flex; align-items: center; gap: 9px; cursor: pointer; }
  .btn-primary:hover { background: #723627; transform: translateY(-2px); }
  .btn-secondary { padding: 14px 28px; font-size: 0.92rem; font-weight: 600; color: var(--ink); background: transparent; border: 1px solid var(--line); border-radius: 10px; transition: all 0.3s; display: inline-flex; align-items: center; gap: 9px; cursor: pointer; }
  .btn-secondary:hover { border-color: var(--ink); background: var(--paper-dim); }

  .hero-figure { position: relative; border-radius: 20px; overflow: hidden; border: 1px solid var(--line); box-shadow: 0 30px 60px -30px rgba(18, 24, 31, 0.28); }
  .hero-figure img { width: 100%; height: 480px; object-fit: cover; display: block; }
  .hero-figure-tag { position: absolute; left: 18px; bottom: 18px; background: rgba(251, 249, 245, 0.94); backdrop-filter: blur(6px); border-radius: 12px; padding: 12px 16px; display: flex; align-items: center; gap: 10px; border: 1px solid var(--line); }
  .hero-figure-tag .num { font-family: 'Fraunces', serif; font-size: 1.3rem; font-weight: 600; color: var(--ink); line-height: 1; }
  .hero-figure-tag .lbl { font-size: 0.68rem; color: var(--ink-faint); text-transform: uppercase; letter-spacing: 0.06em; }

  @media (max-width: 992px) { .hero-grid { grid-template-columns: 1fr; gap: 40px; } .hero-figure img { height: 340px; } }
  @media (max-width: 640px) { .hero-section { padding: 130px 20px 60px; } .hero-title { font-size: 2.1rem; } .btn-primary, .btn-secondary { padding: 12px 20px; font-size: 0.85rem; } }

  /* ─── STATS STRIP ─── */
  .stats-strip { border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); background: var(--paper-dim); }
  .stats-strip .stat-num { font-family: 'Fraunces', serif; font-size: 2.1rem; font-weight: 500; color: var(--ink); }
  .stats-strip .stat-label { font-size: 0.76rem; color: var(--ink-faint); margin-top: 4px; font-weight: 500; }

  /* ─── SECTION HEADERS ─── */
  .section-head { max-width: 640px; }
  .section-head h2 { font-family: 'Fraunces', serif; font-weight: 400; font-size: clamp(1.9rem, 3vw, 2.6rem); line-height: 1.18; color: var(--ink); margin-top: 10px; }
  .section-head p { margin-top: 12px; font-size: 1rem; color: var(--ink-soft); line-height: 1.7; }
  .section-toolbar { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-top: 22px; }
  .toolbar-pill { display: inline-flex; align-items: center; gap: 7px; padding: 7px 14px; border-radius: 999px; background: white; border: 1px solid var(--line); font-size: 0.76rem; font-weight: 600; color: var(--ink-soft); }
  .toolbar-pill.med svg { color: var(--brick); }

  /* ─── CHAMBER CARD ─── */
  .chamber-card { background: white; border: 1px solid var(--line); border-radius: 18px; overflow: hidden; cursor: pointer; display: flex; flex-direction: column; height: 100%; transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s cubic-bezier(0.16,1,0.3,1), border-color 0.4s; }
  .chamber-card:hover { transform: translateY(-6px); box-shadow: 0 26px 50px -22px rgba(18, 24, 31, 0.22); border-color: var(--ink); }
  .chamber-media { position: relative; height: 208px; flex-shrink: 0; overflow: hidden; }
  .chamber-media img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s; }
  .chamber-card:hover .chamber-media img { transform: scale(1.045); }

  .chamber-badge-row { position: absolute; top: 12px; left: 12px; right: 12px; display: flex; align-items: flex-start; justify-content: space-between; z-index: 3; pointer-events: none; }
  .chamber-type-chip { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 999px; font-size: 10.5px; font-weight: 700; letter-spacing: 0.03em; color: white; background: var(--brick); }
  .chamber-avail-chip { display: inline-flex; align-items: center; gap: 6px; padding: 5px 10px; border-radius: 999px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.03em; color: var(--ink); background: rgba(251,249,245,0.94); }
  .chamber-avail-chip.unavailable { color: var(--brick); }
  .avail-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--brick); animation: ix-pulse-dot 1.8s infinite; }

  .chamber-quickview { position: absolute; bottom: 12px; left: 12px; z-index: 3; width: 34px; height: 34px; border-radius: 50%; background: rgba(251,249,245,0.94); display: flex; align-items: center; justify-content: center; border: none; cursor: pointer; opacity: 0; transform: translateY(6px); transition: all 0.3s; }
  .chamber-card:hover .chamber-quickview { opacity: 1; transform: translateY(0); }

  .chamber-price-float { position: absolute; bottom: 12px; right: 12px; z-index: 3; background: rgba(18, 24, 31, 0.82); border-radius: 10px; padding: 7px 13px; text-align: right; }
  .chamber-price-float .amt { color: white; font-size: 1rem; font-weight: 700; line-height: 1; }
  .chamber-price-float .per { color: rgba(255,255,255,0.6); font-size: 9px; text-transform: uppercase; letter-spacing: 0.05em; }

  .chamber-body { padding: 20px 20px 18px; display: flex; flex-direction: column; flex: 1; }
  .chamber-title-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; margin-bottom: 4px; }
  .chamber-body h3 { font-family: 'Fraunces', serif; font-size: 1.08rem; font-weight: 600; color: var(--ink); line-height: 1.28; }
  .chamber-verified { flex-shrink: 0; display: inline-flex; align-items: center; gap: 3px; font-size: 0.7rem; font-weight: 700; color: var(--brick); background: var(--brick-tint); border-radius: 8px; padding: 3px 7px; }

  .chamber-loc { display: flex; align-items: center; gap: 5px; font-size: 0.8rem; color: var(--ink-faint); margin-bottom: 14px; }

  .chamber-specs { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 18px; }
  .chamber-spec-chip { display: inline-flex; align-items: center; gap: 5px; padding: 5px 9px; border-radius: 8px; background: var(--paper-dim); border: 1px solid var(--line); font-size: 0.7rem; font-weight: 600; color: var(--ink-soft); }
  .chamber-spec-chip svg { color: var(--brick); }

  .chamber-footer { margin-top: auto; display: flex; align-items: center; justify-content: space-between; padding-top: 15px; border-top: 1px dashed var(--line); }
  .chamber-footer .amount { font-family: 'Fraunces', serif; font-size: 1.28rem; font-weight: 600; color: var(--ink); }
  .chamber-footer .unit { font-size: 0.68rem; color: var(--ink-faint); font-weight: 600; }

  .chamber-cta { display: inline-flex; align-items: center; gap: 6px; padding: 10px 15px; border-radius: 9px; border: none; font-size: 0.8rem; font-weight: 700; color: white; cursor: pointer; transition: all 0.3s; background: var(--brick); }
  .chamber-cta:hover { transform: translateX(2px); filter: brightness(1.1); }

  @media (max-width: 640px) { .chamber-media { height: 176px; } .chamber-body { padding: 16px 16px 14px; } }

  /* ─── CARD IMAGE SLIDER ─── */
  .card-image-slider { position: relative; height: 100%; width: 100%; overflow: hidden; }
  .card-image-slider img { width: 100%; height: 100%; object-fit: cover; }

  /* ─── PLAIN CARDS (benefits / specialties) ─── */
  .plain-card { background: white; border: 1px solid var(--line); border-radius: 16px; padding: 28px 24px; height: 100%; display: flex; flex-direction: column; transition: all 0.35s cubic-bezier(0.16,1,0.3,1); }
  .plain-card:hover { transform: translateY(-5px); border-color: var(--ink); box-shadow: 0 20px 40px -24px rgba(18,24,31,0.2); }
  .plain-card .icon-wrapper { width: 46px; height: 46px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; background: var(--brick-tint); color: var(--brick); }
  .plain-card h3 { font-family: 'Fraunces', serif; font-size: 1.05rem; font-weight: 600; color: var(--ink); margin-bottom: 6px; }
  .plain-card p { font-size: 0.86rem; color: var(--ink-soft); line-height: 1.65; flex: 1; }

  /* ─── ABOUT TILE GRID ─── */
  .about-tile { padding: 16px 12px; border-radius: 14px; background: white; border: 1px solid var(--line); text-align: center; transition: all 0.3s; }
  .about-tile:hover { border-color: var(--brick); transform: translateY(-3px); }
  .about-tile .icon-wrap { width: 40px; height: 40px; margin: 0 auto; border-radius: 10px; background: var(--brick-tint); display: flex; align-items: center; justify-content: center; color: var(--brick); }
  .about-tile p { font-size: 0.72rem; color: var(--ink-soft); margin-top: 9px; font-weight: 600; line-height: 1.4; }

  /* ─── SPECIALTY TILE ─── */
  .specialty-tile { padding: 18px 14px; border-radius: 14px; background: white; border: 1px solid var(--line); text-align: center; transition: all 0.35s; }
  .specialty-tile:hover { border-color: var(--ink); transform: translateY(-4px); box-shadow: 0 18px 30px -22px rgba(18,24,31,0.25); }
  .specialty-tile .icon-wrap { width: 46px; height: 46px; margin: 0 auto; border-radius: 12px; background: var(--brick-tint); display: flex; align-items: center; justify-content: center; color: var(--brick); }
  .specialty-tile h4 { font-size: 0.82rem; font-weight: 700; color: var(--ink); margin-top: 12px; }
  .specialty-tile p { font-size: 0.74rem; color: var(--ink-faint); margin-top: 5px; line-height: 1.5; }

  /* ─── DARK FEATURE BAND ─── */
  .feature-band { background: var(--ink); color: var(--paper); }
  .feature-card { border-radius: 16px; padding: 28px 24px; border: 1px solid rgba(251,249,245,0.12); background: rgba(251,249,245,0.04); height: 100%; display: flex; flex-direction: column; transition: all 0.35s; }
  .feature-card:hover { background: rgba(251,249,245,0.08); border-color: rgba(251,249,245,0.25); }
  .feature-card .feature-icon { width: 42px; height: 42px; border-radius: 10px; display: flex; align-items: center; justify-content: center; background: rgba(251,249,245,0.1); color: var(--brass); margin-bottom: 16px; }
  .feature-card h3 { font-family: 'Fraunces', serif; font-size: 1.05rem; font-weight: 600; margin-bottom: 6px; }
  .feature-card p { font-size: 0.85rem; color: rgba(251,249,245,0.65); line-height: 1.6; }

  /* ─── CTA ─── */
  .doctor-cta-section { background: var(--ink); border-radius: 22px; padding: 52px 40px; text-align: center; color: var(--paper); }
  .doctor-cta-section h2 { font-family: 'Fraunces', serif; font-size: 2rem; font-weight: 500; margin-bottom: 10px; }
  .doctor-cta-section p { font-size: 0.98rem; opacity: 0.75; max-width: 480px; margin: 0 auto 26px; }
  .doctor-cta-btn { display: inline-flex; align-items: center; gap: 10px; padding: 14px 32px; background: var(--brass); color: var(--ink); border: none; border-radius: 12px; font-size: 0.95rem; font-weight: 700; cursor: pointer; transition: all 0.3s; }
  .doctor-cta-btn:hover { background: white; }
  @media (max-width: 640px) { .doctor-cta-section { padding: 32px 20px; } }

  /* ─── FAQ ─── */
  .faq-item { border-radius: 14px; border: 1px solid var(--line); background: white; overflow: hidden; transition: border-color 0.3s; }
  .faq-item:hover { border-color: var(--ink); }
  .faq-item button { width: 100%; padding: 20px 22px; display: flex; align-items: center; justify-content: space-between; text-align: left; background: none; border: none; cursor: pointer; }
  .faq-item .faq-cat { font-size: 10px; color: var(--brick); text-transform: uppercase; letter-spacing: 0.08em; font-weight: 700; }
  .faq-item .faq-q { font-family: 'Fraunces', serif; font-size: 1rem; font-weight: 500; color: var(--ink); margin-top: 3px; }
  .faq-item .faq-a { padding: 0 22px 20px; font-size: 0.9rem; color: var(--ink-soft); line-height: 1.7; border-top: 1px solid var(--line); padding-top: 14px; }

  /* ─── CONTACT ─── */
  .contact-band { background: var(--paper-dim); }
  .contact-info-item { display: flex; align-items: flex-start; gap: 14px; padding: 16px; border-radius: 14px; background: white; border: 1px solid var(--line); transition: all 0.3s; }
  .contact-info-item:hover { border-color: var(--ink); }
  .contact-info-item .icon-wrap { width: 40px; height: 40px; border-radius: 10px; background: var(--ink); color: var(--paper); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .contact-form { background: white; border: 1px solid var(--line); border-radius: 18px; padding: 28px; }
  .contact-form input, .contact-form textarea { width: 100%; padding: 13px 15px; border-radius: 10px; background: var(--paper-dim); border: 1px solid var(--line); color: var(--ink); font-size: 0.9rem; transition: all 0.25s; }
  .contact-form input::placeholder, .contact-form textarea::placeholder { color: var(--ink-faint); }
  .contact-form input:focus, .contact-form textarea:focus { outline: none; border-color: var(--ink); background: white; }
  .contact-submit { width: 100%; padding: 14px; font-size: 0.92rem; font-weight: 700; color: var(--paper); background: var(--brick); border: none; border-radius: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.3s; }
  .contact-submit:hover:not(:disabled) { background: #723627; }
  .contact-submit:disabled { opacity: 0.6; cursor: not-allowed; }

  /* ─── MODAL (thank-you + chamber detail) ─── */
  .modal-overlay { position: fixed; inset: 0; z-index: 9999; background: rgba(18, 24, 31, 0.55); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; padding: 20px; animation: ix-fade 0.25s ease; }
  .modal-content { background: var(--paper); border-radius: 24px; max-width: 940px; width: 100%; max-height: 90vh; overflow-y: auto; position: relative; animation: ix-scale-in 0.3s cubic-bezier(0.16,1,0.3,1); box-shadow: 0 40px 100px rgba(18,24,31,0.35); scrollbar-width: none; }
  .modal-content::-webkit-scrollbar { width: 0; }
  .modal-content.small { max-width: 460px; }
  .modal-close { position: sticky; top: 12px; float: right; width: 34px; height: 34px; border-radius: 50%; background: white; border: 1px solid var(--line); display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 20; margin: 12px 12px 0 0; transition: all 0.3s; }
  .modal-close:hover { background: var(--paper-dim); }

  .chamber-detail-modal { display: flex; flex-direction: column; }
  .chamber-detail-modal .modal-body { display: grid; grid-template-columns: 1fr 1fr; gap: 0; min-height: 460px; }
  .chamber-detail-modal .modal-image-section { position: relative; background: #0f1216; min-height: 380px; overflow: hidden; }
  .chamber-detail-modal .media-slider { width: 100%; height: 100%; position: relative; display: flex; align-items: center; justify-content: center; }
  .chamber-detail-modal .slider-image, .chamber-detail-modal .slider-video { width: 100%; height: 100%; object-fit: cover; min-height: 380px; }
  .chamber-detail-modal .slider-video { object-fit: contain; background: #0f1216; }
  .chamber-detail-modal .slider-btn { position: absolute; top: 50%; transform: translateY(-50%); width: 38px; height: 38px; border-radius: 50%; background: rgba(18,24,31,0.6); border: 1px solid rgba(255,255,255,0.2); color: white; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 5; }
  .chamber-detail-modal .slider-btn.prev { left: 12px; }
  .chamber-detail-modal .slider-btn.next { right: 12px; }
  .chamber-detail-modal .media-dots { position: absolute; bottom: 16px; left: 50%; transform: translateX(-50%); display: flex; gap: 8px; z-index: 5; }
  .chamber-detail-modal .media-dots .dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.4); border: none; cursor: pointer; padding: 0; }
  .chamber-detail-modal .media-dots .dot.video { width: 14px; border-radius: 4px; }
  .chamber-detail-modal .media-dots .dot.active { background: white; }
  .chamber-detail-modal .media-type-badge { position: absolute; top: 16px; right: 16px; background: rgba(18,24,31,0.65); color: white; padding: 5px 12px; border-radius: 999px; font-size: 10.5px; font-weight: 700; z-index: 5; display: flex; align-items: center; gap: 5px; text-transform: uppercase; letter-spacing: 0.04em; }
  .chamber-detail-modal .chamber-type-badge { position: absolute; top: 16px; left: 16px; padding: 6px 16px; border-radius: 999px; font-size: 11px; font-weight: 700; color: white; background: var(--brick); z-index: 5; }

  .chamber-detail-modal .modal-content-section { padding: 32px 28px; display: flex; flex-direction: column; overflow-y: auto; background: var(--paper); }
  .chamber-detail-modal .chamber-title { font-family: 'Fraunces', serif; font-size: 1.5rem; font-weight: 600; color: var(--ink); margin-bottom: 6px; }
  .chamber-detail-modal .chamber-sub { font-size: 0.86rem; color: var(--ink-faint); margin-bottom: 16px; }
  .chamber-detail-modal .chamber-desc { font-size: 0.9rem; color: var(--ink-soft); line-height: 1.7; margin-bottom: 16px; flex: 1; }
  .chamber-detail-modal .chamber-detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 16px; }
  .chamber-detail-modal .detail-item { display: flex; align-items: center; gap: 8px; font-size: 0.8rem; color: var(--ink-soft); padding: 7px 10px; background: var(--paper-dim); border-radius: 8px; }
  .chamber-detail-modal .detail-item svg { color: var(--brick); flex-shrink: 0; }
  .chamber-detail-modal .chamber-price { display: flex; align-items: baseline; gap: 8px; padding-top: 16px; border-top: 1px solid var(--line); margin-bottom: 16px; }
  .chamber-detail-modal .chamber-price .amount { font-family: 'Fraunces', serif; font-size: 1.7rem; font-weight: 600; color: var(--ink); }
  .chamber-detail-modal .chamber-price .period { font-size: 0.86rem; color: var(--ink-faint); }
  .btn-book-now-modal { width: 100%; padding: 15px; background: var(--brick); color: var(--paper); border: none; border-radius: 12px; font-size: 0.95rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: auto; transition: all 0.3s; }
  .btn-book-now-modal:hover:not(:disabled) { background: #723627; }
  .btn-book-now-modal:disabled { opacity: 0.55; cursor: not-allowed; }

  @media (max-width: 768px) {
    .chamber-detail-modal .modal-body { grid-template-columns: 1fr; }
    .chamber-detail-modal .modal-image-section, .chamber-detail-modal .slider-image, .chamber-detail-modal .slider-video { min-height: 260px; }
    .chamber-detail-modal .modal-content-section { padding: 22px 18px; }
  }

  /* ─── FOOTER ─── */
  .site-footer { background: var(--ink); color: rgba(251,249,245,0.7); }
  .site-footer h4 { color: var(--paper); font-family: 'Fraunces', serif; font-weight: 600; font-size: 0.95rem; margin-bottom: 16px; }
  .site-footer a, .site-footer button { color: rgba(251,249,245,0.62); font-size: 0.87rem; transition: all 0.25s; }
  .site-footer a:hover, .site-footer button:hover { color: var(--brass); transform: translateX(3px); }
`;

// ─── HOOKS ───
const useScrollReveal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !isVisible) setIsVisible(true); },
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

// ─── CARD IMAGE SLIDER (thumbnail — images only) ───
const CardImage = ({ src, alt }) => (
  <div className="card-image-slider">
    <img src={src} alt={alt || "Chamber"} loading="lazy" onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }} />
  </div>
);

// ─── FAQ ITEM ───
const FAQItem = ({ faq, index, isOpen, onToggle }) => (
  <RevealSection delay={index * 0.05}>
    <div className="faq-item">
      <button onClick={onToggle}>
        <div>
          <span className="faq-cat">{faq.category}</span>
          <p className="faq-q">{faq.q}</p>
        </div>
        <ChevronDown size={17} style={{ transition: "transform 0.3s", transform: isOpen ? "rotate(180deg)" : "none", color: "#8A8F99", flexShrink: 0 }} />
      </button>
      <div style={{ maxHeight: isOpen ? 300 : 0, opacity: isOpen ? 1 : 0, overflow: "hidden", transition: "all 0.4s" }}>
        <div className="faq-a">{faq.a}</div>
      </div>
    </div>
  </RevealSection>
);

// ─── CHAMBER CARD ───
const ChamberCard = ({ chamber, index, onClick }) => (
  <div className="chamber-card" onClick={() => onClick(chamber)}>
    <div className="chamber-media">
      <CardImage src={chamber.images[0]} alt={chamber.name} />
      <div className="chamber-badge-row">
        <span className="chamber-type-chip"><Stethoscope size={11} /> Medical Chamber</span>
        <span className={`chamber-avail-chip ${chamber.available ? "" : "unavailable"}`}>
          {chamber.available ? <><span className="avail-dot" /> Available</> : "Booked"}
        </span>
      </div>
      <button className="chamber-quickview" onClick={(e) => { e.stopPropagation(); onClick(chamber); }} aria-label="Quick view">
        <Maximize2 size={14} color="#8B4433" />
      </button>
      <div className="chamber-price-float">
        <div className="amt">{chamber.price}</div>
        <div className="per">per hour</div>
      </div>
    </div>

    <div className="chamber-body">
      <div className="chamber-title-row">
        <h3 className="line-clamp-2">{chamber.name}</h3>
        <span className="chamber-verified"><BadgeCheck size={11} /> Verified</span>
      </div>
      <div className="chamber-loc"><MapPin size={13} /><span className="line-clamp-1">{chamber.floor}</span></div>
      <div className="chamber-specs">
        <span className="chamber-spec-chip"><Layout size={12} /> {chamber.size}</span>
        <span className="chamber-spec-chip"><Stethoscope size={12} /> {chamber.equipment}</span>
      </div>
      <div className="chamber-footer">
        <div>
          <div className="amount">{chamber.price}</div>
          <div className="unit">per hour</div>
        </div>
        <button className="chamber-cta" onClick={(e) => { e.stopPropagation(); onClick(chamber); }}>
          View details <ArrowRight size={14} />
        </button>
      </div>
    </div>
  </div>
);

// ─── MAIN PAGE ───
const DoctorChamberPage = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const [formData, setFormData] = useState({ name: "", email: "", phone: "", address: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [showThankYouPopup, setShowThankYouPopup] = useState(false);
  const [thankYouText, setThankYouText] = useState({ title: "Message sent", body: "Thanks for reaching out. We'll get back to you shortly." });

  const [chambers, setChambers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const [selectedChamber, setSelectedChamber] = useState(null);
  const [showChamberModal, setShowChamberModal] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [mediaItems, setMediaItems] = useState([]);

  const getImageUrl = (img) => {
    if (!img) return PLACEHOLDER_IMAGE;
    if (img.startsWith("http")) return img;
    const cleanPath = img.replace(/\\/g, "/").replace(/^\/+/, "");
    return `${API_URL}/${cleanPath}`;
  };

  const getMediaItems = (chamber) => {
    const items = [];
    if (chamber.images && chamber.images.length > 0) {
      chamber.images.forEach((img) => items.push({ type: "image", url: img }));
    }
    if (chamber.rawData && chamber.rawData.videos && chamber.rawData.videos.length > 0) {
      chamber.rawData.videos.forEach((video) => items.push({ type: "video", url: getImageUrl(video) }));
    }
    if (items.length === 0) items.push({ type: "image", url: PLACEHOLDER_IMAGE });
    return items;
  };

  useEffect(() => {
    const fetchChambers = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        const res = await axios.get(`${API_URL}/api/cabins`);
        const data = res.data.cabins || res.data;
        const allCabins = Array.isArray(data) ? data : [];
        const chamberCabins = allCabins.filter((c) => c.isChamber === true);

        const formatted = chamberCabins.map((cabin, index) => ({
          id: cabin._id,
          name: cabin.name || `Chamber ${index + 1}`,
          floor: cabin.address?.split(",")[0] || "Ground Floor",
          size: `${cabin.capacity || 1} Seats`,
          equipment: cabin.cabinType === "exclusive" ? "Premium Medical Setup" : "Basic Medical Setup",
          price: `₹${cabin.price || 0}`,
          images: cabin.images && cabin.images.length > 0 ? cabin.images.map((img) => getImageUrl(img)) : [PLACEHOLDER_IMAGE],
          available: cabin.isActive === true,
          description: cabin.description || "",
          rawData: cabin
        }));

        setChambers(formatted);
      } catch (err) {
        console.error("Error fetching chambers:", err);
        setFetchError("Failed to load chambers. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchChambers();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const toggleFaq = (i) => setOpenFaq(openFaq === i ? null : i);

  const handleChamberClick = (chamber) => {
    setMediaItems(getMediaItems(chamber));
    setSelectedChamber(chamber);
    setCurrentMediaIndex(0);
    setShowChamberModal(true);
  };
  const closeChamberModal = () => { setShowChamberModal(false); setSelectedChamber(null); setMediaItems([]); };

  const handlePrevMedia = () => setCurrentMediaIndex((p) => (p === 0 ? mediaItems.length - 1 : p - 1));
  const handleNextMedia = () => setCurrentMediaIndex((p) => (p === mediaItems.length - 1 ? 0 : p + 1));

  const handleBookChamber = () => {
    setIsBooking(true);
    setTimeout(() => {
      setIsBooking(false);
      closeChamberModal();
      setThankYouText({ title: "Chamber booked", body: "We've reserved your slot. Our team will confirm the details shortly." });
      setShowThankYouPopup(true);
      setTimeout(() => setShowThankYouPopup(false), 5000);
    }, 1400);
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
      const response = await fetch(`${API_URL}/api/cabins/sendquery`, {
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
        setThankYouText({ title: "Message sent", body: "Thanks for reaching out. We'll get back to you shortly." });
        setShowThankYouPopup(true);
        setFormData({ name: "", email: "", phone: "", address: "", message: "" });
        setTimeout(() => setShowThankYouPopup(false), 5000);
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
    { icon: Shield, title: "No long leases", desc: "Avoid multi-year commitments and heavy deposits." },
    { icon: Wallet, title: "Lower running costs", desc: "Pay for what you use — no hidden charges." },
    { icon: Users, title: "Admin, handled", desc: "We manage staff, billing, and patient scheduling." },
    { icon: Sparkles, title: "Modern infrastructure", desc: "Fully-equipped chambers with clinical tools ready." }
  ];

  const features = [
    { icon: Stethoscope, title: "Medical equipment", desc: "Examination essentials and clinical tools on site." },
    { icon: UserCheck, title: "Admin support", desc: "Reception, billing, and patient scheduling handled for you." },
    { icon: Clock, title: "Flexible hours", desc: "Book by the hour, day, or a standing weekly slot." },
    { icon: Award, title: "Premium locations", desc: "High-visibility chambers in established medical areas." }
  ];

  const aboutTiles = [
    { icon: HomeIcon, label: "Flexible practice spaces" },
    { icon: Wallet, label: "Cost-effective solutions" },
    { icon: Stethoscope, label: "Fully-equipped clinics" },
    { icon: Users, label: "Administrative support" },
    { icon: Shield, label: "Stress-free management" },
    { icon: Layout, label: "Modern interiors" },
    { icon: Microscope, label: "State-of-the-art tools" },
    { icon: Star, label: "Trusted by 100+ doctors" }
  ];

  const stats = [
    { label: "Chambers", value: chambers.length || 50, suffix: "+" },
    { label: "Doctors", value: 100, suffix: "+" },
    { label: "Support", value: 24, suffix: "/7" },
    { label: "Satisfaction", value: 100, suffix: "%" }
  ];

  const renderModalMedia = () => {
    if (!mediaItems.length) return null;
    const item = mediaItems[currentMediaIndex];
    if (item.type === "video") {
      return <video src={item.url} className="slider-video" controls playsInline controlsList="nodownload" />;
    }
    return <img src={item.url} alt={selectedChamber?.name || "Chamber"} className="slider-image" onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }} />;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#FBF9F5" }}>
        <div className="text-center">
          <div className="w-12 h-12 border-2 rounded-full mx-auto" style={{ borderColor: "#E3DDCE", borderTopColor: "#8B4433", animation: "ix-spin 0.8s linear infinite" }} />
          <p className="mt-4" style={{ color: "#4A5160" }}>Loading chambers…</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="ix-root min-h-screen">

        {/* Thank you popup */}
        {showThankYouPopup && (
          <div className="modal-overlay" style={{ zIndex: 300 }} onClick={() => setShowThankYouPopup(false)}>
            <div className="modal-content small" onClick={(e) => e.stopPropagation()} style={{ padding: "36px 32px" }}>
              <button onClick={() => setShowThankYouPopup(false)} className="absolute" style={{ position: "absolute", top: 16, right: 16 }} aria-label="Close">
                <span style={{ display: "inline-flex", padding: 8, borderRadius: 999, background: "#F1EDE3" }}><X size={18} /></span>
              </button>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "#F3E9E3" }}>
                  <CheckCircle size={32} color="#8B4433" />
                </div>
                <h3 className="ix-serif text-2xl font-semibold mb-2">{thankYouText.title}</h3>
                <p style={{ color: "#4A5160" }}>{thankYouText.body}</p>
                <button onClick={() => setShowThankYouPopup(false)} className="mt-6 px-6 py-2.5 rounded-xl text-white" style={{ background: "#12181F" }}>
                  Got it
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Chamber detail modal */}
        {showChamberModal && selectedChamber && (
          <div className="modal-overlay" onClick={closeChamberModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={closeChamberModal}><X size={17} /></button>

              <div className="chamber-detail-modal">
                <div className="modal-body">
                  <div className="modal-image-section">
                    <div className="media-slider">
                      {renderModalMedia()}
                      {mediaItems.length > 1 && (
                        <>
                          <button className="slider-btn prev" onClick={handlePrevMedia} aria-label="Previous"><ChevronLeft size={18} /></button>
                          <button className="slider-btn next" onClick={handleNextMedia} aria-label="Next"><ChevronRight size={18} /></button>
                          <div className="media-dots">
                            {mediaItems.map((m, idx) => (
                              <button key={idx} className={`dot ${m.type === "video" ? "video" : ""} ${idx === currentMediaIndex ? "active" : ""}`} onClick={() => setCurrentMediaIndex(idx)} aria-label={`Go to ${idx + 1}`} />
                            ))}
                          </div>
                        </>
                      )}
                      <span className="media-type-badge">
                        {mediaItems[currentMediaIndex]?.type === "video" ? <><VideoIcon size={11} /> Video</> : <><Layout size={11} /> Photo</>}
                      </span>
                    </div>
                    <span className="chamber-type-badge">Medical Chamber</span>
                  </div>

                  <div className="modal-content-section">
                    <h3 className="chamber-title">{selectedChamber.name}</h3>
                    <p className="chamber-sub">{selectedChamber.floor} · {selectedChamber.size}</p>
                    <p className="chamber-desc">
                      {selectedChamber.description || "A fully-equipped medical consultation chamber designed for healthcare professionals to practice with confidence."}
                    </p>

                    <div className="chamber-detail-grid">
                      <div className="detail-item"><Building2 size={15} /><span>{selectedChamber.floor}</span></div>
                      <div className="detail-item"><Layout size={15} /><span>{selectedChamber.size}</span></div>
                      <div className="detail-item"><Stethoscope size={15} /><span>{selectedChamber.equipment}</span></div>
                      <div className="detail-item">
                        {selectedChamber.available ? <><CheckCircle size={15} color="#23474B" /><span>Available now</span></> : <><X size={15} color="#8B4433" /><span>Currently booked</span></>}
                      </div>
                    </div>

                    <div className="chamber-price">
                      <span className="amount">{selectedChamber.price}</span>
                      <span className="period">/ hour</span>
                    </div>

                    <button className="btn-book-now-modal" onClick={handleBookChamber} disabled={!selectedChamber.available || isBooking}>
                      {isBooking ? (
                        <>
                          <svg className="h-4 w-4" style={{ animation: "ix-spin 0.8s linear infinite" }} viewBox="0 0 24 24" fill="none">
                            <circle opacity="0.25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path opacity="0.75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Booking…
                        </>
                      ) : selectedChamber.available ? (
                        <>Book this chamber <ArrowRight size={18} /></>
                      ) : (
                        "Not available"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navbar */}
        <nav className={`navbar-custom ${scrolled ? "navbar-scrolled" : ""}`}>
          <div className="navbar-inner">
            <button onClick={() => navigate("/")} className="flex items-center gap-3">
              <div className="navbar-logo"><img src={logo} alt="Logo" /></div>
              <span className="navbar-brand hidden sm:flex">IRYAX SPACE</span>
            </button>

            <div className="nav-links">
              <button onClick={() => scrollToSection("chambers")} className="navbar-link">Chambers</button>
              <button onClick={() => scrollToSection("benefits")} className="navbar-link">Benefits</button>
              <button onClick={() => scrollToSection("specialties")} className="navbar-link">Specialties</button>
              <button onClick={() => scrollToSection("about")} className="navbar-link">About</button>
              <button onClick={() => scrollToSection("faq")} className="navbar-link">FAQ</button>
              <button onClick={() => scrollToSection("contact")} className="navbar-link">Contact</button>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => navigate("/doctorlogin")} className="navbar-signin hidden sm:block">Sign in</button>
              <button onClick={() => navigate("/doctorlogin")} className="navbar-btn"><Stethoscope size={14} /> Book chamber</button>
              <button onClick={() => setMobileOpen(!mobileOpen)} className="navbar-menu-btn" aria-label="Toggle menu">
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile drawer */}
        <div
          className="fixed inset-0 z-40 pt-24 px-6 transition-all duration-400"
          style={{ background: "#FBF9F5", opacity: mobileOpen ? 1 : 0, pointerEvents: mobileOpen ? "auto" : "none" }}
        >
          <button onClick={() => setMobileOpen(false)} className="mobile-menu-close" aria-label="Close menu"><X size={20} /></button>
          <div className="flex flex-col gap-2 max-w-sm mx-auto mt-6">
            {[["Chambers", "chambers"], ["Benefits", "benefits"], ["Specialties", "specialties"], ["About", "about"], ["FAQ", "faq"], ["Contact", "contact"]].map(([label, id]) => (
              <button key={id} onClick={() => { setMobileOpen(false); scrollToSection(id); }} className="px-4 py-3.5 text-left rounded-xl font-medium" style={{ background: "#F1EDE3" }}>
                {label}
              </button>
            ))}
            <div className="h-px my-1" style={{ background: "#E3DDCE" }} />
            <button onClick={() => { navigate("/doctorlogin"); setMobileOpen(false); }} className="px-4 py-3.5 text-center text-white rounded-xl font-semibold" style={{ background: "#8B4433" }}>
              Book chamber
            </button>
          </div>
        </div>

        {/* Hero */}
        <section className="hero-section">
          <div className="hero-grid">
            <div>
              <RevealSection>
                <span className="ix-eyebrow med"><span className="dot" />India&rsquo;s medical co-working space</span>
              </RevealSection>
              <RevealSection delay={0.1}>
                <h1 className="hero-title ix-serif">A consultation room<br /><em>ready before you arrive.</em></h1>
              </RevealSection>
              <RevealSection delay={0.2}>
                <p className="hero-desc">
                  Fully-equipped chambers with reception support, flexible hours, and complete admin handling — so you can walk in and see patients, nothing else to set up.
                </p>
              </RevealSection>
              <RevealSection delay={0.25}>
                <div className="hero-feature-list">
                  <span className="item"><CheckCircle size={14} /> Flexible spaces</span>
                  <span className="item"><CheckCircle size={14} /> Fully-equipped</span>
                  <span className="item"><CheckCircle size={14} /> Admin support</span>
                  <span className="item"><CheckCircle size={14} /> Zero deposit</span>
                </div>
              </RevealSection>
              <RevealSection delay={0.3}>
                <div className="hero-buttons">
                  <button onClick={() => navigate("/doctorlogin")} className="btn-primary">
                    <Stethoscope size={16} /> Get your space now <ArrowRight size={16} />
                  </button>
                  <button onClick={() => scrollToSection("chambers")} className="btn-secondary">
                    <Eye size={16} /> View chambers
                  </button>
                </div>
              </RevealSection>
            </div>

            <RevealSection delay={0.15}>
              <div className="hero-figure">
                <img src={doctorChamber} alt="IRYAX SPACE medical chamber" />
               
              </div>
            </RevealSection>
          </div>
        </section>

        {/* Stats */}
        <section className="stats-strip py-14 px-8">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <RevealSection key={i} delay={i * 0.06}>
                <div className="text-center">
                  <div className="stat-num ix-serif">
                    {stat.label === "Chambers" ? <>{chambers.length || 50}+</> : <Counter target={stat.value} suffix={stat.suffix} />}
                  </div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              </RevealSection>
            ))}
          </div>
        </section>

        {/* About */}
        <section id="about" className="py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="section-head mx-auto text-center">
              <RevealSection><span className="ix-eyebrow med"><span className="dot" />About IRYAX SPACE</span></RevealSection>
              <RevealSection delay={0.1}><h2>Modern medical spaces, without the overhead</h2></RevealSection>
              <RevealSection delay={0.2}>
                <p className="mx-auto">
                  IRYAX SPACE gives healthcare professionals a flexible clinic space to start or expand an independent practice, without the burden of long leases, high operational costs, or administrative stress.
                </p>
              </RevealSection>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-14">
              {aboutTiles.map((item, i) => (
                <RevealSection key={i} delay={i * 0.05}>
                  <div className="about-tile">
                    <div className="icon-wrap"><item.icon size={18} /></div>
                    <p>{item.label}</p>
                  </div>
                </RevealSection>
              ))}
            </div>
          </div>
        </section>

        {/* Chambers */}
        <section id="chambers" className="py-8 px-6" style={{ background: "#FBF6F4" }}>
          <div className="max-w-6xl mx-auto py-8">
            <div className="section-head mx-auto text-center">
              <RevealSection><span className="ix-eyebrow med"><span className="dot" />Our chambers</span></RevealSection>
              <RevealSection delay={0.1}><h2>Choose your consultation room</h2></RevealSection>
              <RevealSection delay={0.2}><p className="mx-auto">Click on any chamber to view details, media, and book instantly.</p></RevealSection>
            </div>

            {chambers.length > 0 && (
              <RevealSection delay={0.15}>
                <div className="section-toolbar justify-center">
                  <span className="toolbar-pill med"><Stethoscope size={14} /> {chambers.length} chambers</span>
                  <span className="toolbar-pill med"><ShieldCheck size={14} /> Hygiene certified</span>
                  <span className="toolbar-pill med"><Clock size={14} /> 24/7 access</span>
                </div>
              </RevealSection>
            )}

            {fetchError ? (
              <div className="text-center py-16">
                <Stethoscope size={44} className="mx-auto mb-4" color="#D9C3BA" />
                <p style={{ color: "#8A8F99" }}>{fetchError}</p>
              </div>
            ) : chambers.length === 0 ? (
              <div className="text-center py-16">
                <Building2 size={44} className="mx-auto mb-4" color="#D9C3BA" />
                <p style={{ color: "#8A8F99" }}>No medical chambers available right now.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
                {chambers.map((chamber, i) => (
                  <RevealSection key={chamber.id || i} delay={i * 0.08}>
                    <ChamberCard chamber={chamber} index={i} onClick={handleChamberClick} />
                  </RevealSection>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Specialties */}
        <section id="specialties" className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="section-head mx-auto text-center">
              <RevealSection><span className="ix-eyebrow med"><span className="dot" />Specialties</span></RevealSection>
              <RevealSection delay={0.1}><h2>Serving professionals across every specialty</h2></RevealSection>
              <RevealSection delay={0.2}><p className="mx-auto">Modern consultation rooms designed for every medical specialty.</p></RevealSection>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-14">
              {MEDICAL_SPECIALTIES.map((spec, i) => (
                <RevealSection key={i} delay={i * 0.05}>
                  <div className="specialty-tile">
                    <div className="icon-wrap"><spec.icon size={20} /></div>
                    <h4>{spec.name}</h4>
                    <p>{spec.desc}</p>
                  </div>
                </RevealSection>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section id="benefits" className="py-24 px-6" style={{ background: "#F1EDE3" }}>
          <div className="max-w-6xl mx-auto">
            <div className="section-head mx-auto text-center">
              <RevealSection><span className="ix-eyebrow med"><span className="dot" />Benefits</span></RevealSection>
              <RevealSection delay={0.1}><h2>Helping doctors focus on patients, not admin</h2></RevealSection>
              <RevealSection delay={0.2}><p className="mx-auto">We handle everything else so you can focus on what matters.</p></RevealSection>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-14">
              {doctorBenefits.map((benefit, i) => (
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
              <RevealSection><span className="ix-eyebrow" style={{ color: "#D9B77A", borderColor: "rgba(251,249,245,0.15)" }}><span className="dot" style={{ background: "#B08947" }} />Why practice here</span></RevealSection>
              <RevealSection delay={0.1}><h2 className="ix-serif" style={{ color: "#FBF9F5" }}>Everything a clinical practice needs, already in place</h2></RevealSection>
              <RevealSection delay={0.2}><p className="mx-auto" style={{ color: "rgba(251,249,245,0.6)" }}>Move in and start seeing patients within 24 hours.</p></RevealSection>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-14">
              {features.map((feature, i) => (
                <RevealSection key={i} delay={i * 0.08}>
                  <div className="feature-card">
                    <div className="feature-icon"><feature.icon size={20} /></div>
                    <h3>{feature.title}</h3>
                    <p>{feature.desc}</p>
                  </div>
                </RevealSection>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <RevealSection>
              <div className="doctor-cta-section">
                <h2>Start seeing patients this week</h2>
                <p>Join 100+ healthcare professionals who moved their practice into a chamber that was ready on day one.</p>
                <button onClick={() => navigate("/doctorlogin")} className="doctor-cta-btn">Get started <ArrowRight size={18} /></button>
              </div>
            </RevealSection>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-24 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="section-head mx-auto text-center">
              <RevealSection><span className="ix-eyebrow med"><span className="dot" />FAQ</span></RevealSection>
              <RevealSection delay={0.1}><h2>Answers about the doctor&rsquo;s chamber</h2></RevealSection>
            </div>

            <div className="space-y-3 mt-12">
              {FAQ_DATA.map((faq, i) => (
                <FAQItem key={i} faq={faq} index={i} isOpen={openFaq === i} onToggle={() => toggleFaq(i)} />
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="contact-band py-24 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="section-head mx-auto text-center">
              <RevealSection><span className="ix-eyebrow med"><span className="dot" />Get in touch</span></RevealSection>
              <RevealSection delay={0.1}><h2>Ready to start your practice?</h2></RevealSection>
              <RevealSection delay={0.2}><p className="mx-auto">Connect with us and book your chamber today.</p></RevealSection>
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
                  <p className="text-sm" style={{ color: "rgba(251,249,245,0.55)" }}>India&rsquo;s medical co-working space.</p>
                </div>
              </RevealSection>
              <RevealSection delay={0.1}>
                <div>
                  <h4>Explore</h4>
                  <div className="space-y-2.5">
                    <button onClick={() => scrollToSection("chambers")} className="block text-left">Chambers</button>
                    <button onClick={() => scrollToSection("benefits")} className="block text-left">Benefits</button>
                    <button onClick={() => scrollToSection("specialties")} className="block text-left">Specialties</button>
                    <button onClick={() => scrollToSection("about")} className="block text-left">About</button>
                    <button onClick={() => scrollToSection("faq")} className="block text-left">FAQ</button>
                  </div>
                </div>
              </RevealSection>
              <RevealSection delay={0.2}>
                <div>
                  <h4>Company</h4>
                  <div className="space-y-2.5">
                    <button onClick={() => navigate("/")} className="block text-left">Home</button>
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
                <p className="text-xs mt-2 tracking-wider uppercase" style={{ opacity: 0.4 }}>IRYAX SPACE FOR MEDICAL</p>
              </div>
            </RevealSection>
          </div>
        </footer>
      </div>
    </>
  );
};

export default DoctorChamberPage;