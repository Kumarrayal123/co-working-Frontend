// CafeDiningPage.jsx
// IRYAX SPACE FOR CAFE & DINING — book tables only

import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Coffee,
  Utensils,
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
  Send,
  Building2,
  Eye,
  ChefHat,
  Pizza,
  Home as HomeIcon,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Video as VideoIcon,
  ShieldCheck,
  BadgeCheck,
  Table2,
  Clock as ClockIcon,
  Layout
} from "lucide-react";
import logo from "../assets/logo.png";

const API_URL = "https://spaceapi.iryax.com";
const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1000&h=750";
const HERO_IMAGE = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200&h=600";

// ─── FAQ DATA ───
const FAQ_DATA = [
  { category: "Booking", q: "How do I book a table?", a: "Select your preferred date, time, and number of guests. You'll get instant confirmation." },
  { category: "Timings", q: "What are the operating hours?", a: "Most venues are open 8 AM to 11 PM. Check individual venue pages for exact timings." },
  { category: "Amenities", q: "What amenities are available?", a: "High-speed WiFi, private dining rooms, outdoor seating, and valet parking at select venues." },
  { category: "Payment", q: "What payment methods are accepted?", a: "We accept credit/debit cards, UPI, net banking, and digital wallets." },
  { category: "Group", q: "Can I book for large groups?", a: "Yes! Contact us for groups of 10+ and we'll arrange a custom package." }
];

// ═══════════════════════════════════════════════════════════════
// STYLES
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
    --cafe: #C67B3D;
    --cafe-deep: #9E5F2E;
    --cafe-tint: #F5EDE5;
    --teal: #23474B;
    --teal-tint: #E9EFEE;
    --warm: #D4A373;
  }

  * { box-sizing: border-box; }

  .ix-root { font-family: 'Inter', -apple-system, sans-serif; color: var(--ink); background: var(--paper); }
  .ix-serif { font-family: 'Fraunces', Georgia, serif; }

  @keyframes ix-fade-up { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes ix-fade { from { opacity: 0; } to { opacity: 1; } }
  @keyframes ix-scale-in { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
  @keyframes ix-pulse-dot { 0% { box-shadow: 0 0 0 0 rgba(198,123,61,0.35); } 70% { box-shadow: 0 0 0 7px rgba(198,123,61,0); } 100% { box-shadow: 0 0 0 0 rgba(198,123,61,0); } }
  @keyframes ix-spin { to { transform: rotate(360deg); } }

  .reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1); }
  .reveal.visible { opacity: 1; transform: translateY(0); }
  @media (prefers-reduced-motion: reduce) { .reveal { transition: none; opacity: 1; transform: none; } }

  .line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
  .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

  ::-webkit-scrollbar { width: 8px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--line); border-radius: 10px; }

  .ix-eyebrow { display: inline-flex; align-items: center; gap: 8px; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--cafe-deep); padding-bottom: 2px; border-bottom: 1px solid var(--line); }
  .ix-eyebrow .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--cafe); flex-shrink: 0; }
  .ix-eyebrow.cafe { color: var(--cafe-deep); }
  .ix-eyebrow.cafe .dot { background: var(--cafe); }

  .navbar-custom { position: fixed !important; top: 0; left: 0; right: 0; z-index: 50; height: 82px; padding: 0 32px; background: rgba(251, 249, 245, 0.0); border-bottom: 1px solid transparent; transition: all 0.35s cubic-bezier(0.16,1,0.3,1); display: flex; align-items: center; }
  .navbar-custom .navbar-inner { width: 100%; max-width: 1240px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; }
  .navbar-scrolled { background: rgba(251, 249, 245, 0.92) !important; backdrop-filter: blur(14px); border-bottom: 1px solid var(--line) !important; height: 72px !important; }
  .navbar-custom .navbar-brand { font-family: 'Fraunces', serif; font-size: 1.15rem; font-weight: 600; color: var(--ink); display: flex; align-items: center; gap: 10px; letter-spacing: 0.01em; }
  .navbar-custom .navbar-logo { width: 42px; height: 42px; border: 1px solid var(--line); border-radius: 50%; padding: 3px; background: white; overflow: hidden; flex-shrink: 0; transition: border-color 0.3s; }
  .navbar-custom .navbar-logo:hover { border-color: var(--cafe); }
  .navbar-custom .navbar-logo img { width: 100%; height: 100%; object-fit: contain; }
  .navbar-custom .nav-links { display: flex; align-items: center; gap: 2px; }
  .navbar-custom .navbar-link { font-size: 0.86rem; font-weight: 500; padding: 9px 15px; color: var(--ink-soft); background: none; border: none; cursor: pointer; border-radius: 999px; transition: all 0.25s; font-family: inherit; }
  .navbar-custom .navbar-link:hover { color: var(--ink); background: var(--paper-dim); }
  .navbar-custom .navbar-signin { font-size: 0.85rem; font-weight: 500; color: var(--ink-soft); background: none; border: none; padding: 9px 14px; cursor: pointer; }
  .navbar-custom .navbar-signin:hover { color: var(--ink); }
  .navbar-custom .navbar-btn { font-size: 0.82rem; font-weight: 600; padding: 10px 20px; background: var(--cafe); color: var(--paper) !important; border: none; border-radius: 999px; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.3s; }
  .navbar-custom .navbar-btn:hover { background: var(--cafe-deep); transform: translateY(-1px); }
  .navbar-menu-btn { display: none; color: var(--ink); padding: 8px; border-radius: 50%; background: var(--paper-dim); border: 1px solid var(--line); cursor: pointer; align-items: center; justify-content: center; }
  @media (max-width: 992px) { .navbar-custom .nav-links { display: none; } .navbar-menu-btn { display: flex; } }
  @media (max-width: 640px) { .navbar-custom { padding: 0 18px; height: 66px; } .navbar-scrolled { height: 66px !important; } }

  .mobile-menu-close { position: absolute; top: 18px; right: 18px; padding: 8px; border-radius: 50%; background: var(--paper-dim); border: 1px solid var(--line); cursor: pointer; }

  .hero-section { padding: 168px 32px 90px; background: var(--paper); }
  .hero-grid { max-width: 1240px; margin: 0 auto; display: grid; grid-template-columns: 1.05fr 0.95fr; gap: 64px; align-items: center; }
  .hero-title { font-family: 'Fraunces', serif; font-weight: 400; font-size: clamp(2.6rem, 4.6vw, 3.9rem); line-height: 1.08; color: var(--ink); letter-spacing: -0.01em; margin: 18px 0 20px; }
  .hero-title em { font-style: italic; font-weight: 500; color: var(--cafe); }
  .hero-desc { font-size: 1.05rem; line-height: 1.75; color: var(--ink-soft); max-width: 480px; font-weight: 400; }
  .hero-feature-list { display: flex; flex-wrap: wrap; gap: 10px 20px; margin-top: 22px; }
  .hero-feature-list .item { display: flex; align-items: center; gap: 7px; font-size: 0.84rem; font-weight: 600; color: var(--ink-soft); }
  .hero-feature-list .item svg { color: var(--cafe); flex-shrink: 0; }
  .hero-buttons { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 30px; }

  .btn-primary { padding: 14px 28px; font-size: 0.92rem; font-weight: 600; color: var(--paper); background: var(--cafe); border-radius: 10px; border: none; transition: all 0.3s; display: inline-flex; align-items: center; gap: 9px; cursor: pointer; }
  .btn-primary:hover { background: var(--cafe-deep); transform: translateY(-2px); }
  .btn-secondary { padding: 14px 28px; font-size: 0.92rem; font-weight: 600; color: var(--ink); background: transparent; border: 1px solid var(--line); border-radius: 10px; transition: all 0.3s; display: inline-flex; align-items: center; gap: 9px; cursor: pointer; }
  .btn-secondary:hover { border-color: var(--ink); background: var(--paper-dim); }

  .hero-figure { position: relative; border-radius: 20px; overflow: hidden; border: 1px solid var(--line); box-shadow: 0 30px 60px -30px rgba(18, 24, 31, 0.28); }
  .hero-figure img { width: 100%; height: 480px; object-fit: cover; display: block; }
  .hero-figure-tag { position: absolute; left: 18px; bottom: 18px; background: rgba(251, 249, 245, 0.94); backdrop-filter: blur(6px); border-radius: 12px; padding: 12px 16px; display: flex; align-items: center; gap: 10px; border: 1px solid var(--line); }
  .hero-figure-tag .num { font-family: 'Fraunces', serif; font-size: 1.3rem; font-weight: 600; color: var(--ink); line-height: 1; }
  .hero-figure-tag .lbl { font-size: 0.68rem; color: var(--ink-faint); text-transform: uppercase; letter-spacing: 0.06em; }

  @media (max-width: 992px) { .hero-grid { grid-template-columns: 1fr; gap: 40px; } .hero-figure img { height: 340px; } }
  @media (max-width: 640px) { .hero-section { padding: 130px 20px 60px; } .hero-title { font-size: 2.1rem; } .btn-primary, .btn-secondary { padding: 12px 20px; font-size: 0.85rem; } }

  .stats-strip { border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); background: var(--paper-dim); }
  .stats-strip .stat-num { font-family: 'Fraunces', serif; font-size: 2.1rem; font-weight: 500; color: var(--ink); }
  .stats-strip .stat-label { font-size: 0.76rem; color: var(--ink-faint); margin-top: 4px; font-weight: 500; }

  .section-head { max-width: 640px; }
  .section-head h2 { font-family: 'Fraunces', serif; font-weight: 400; font-size: clamp(1.9rem, 3vw, 2.6rem); line-height: 1.18; color: var(--ink); margin-top: 10px; }
  .section-head p { margin-top: 12px; font-size: 1rem; color: var(--ink-soft); line-height: 1.7; }
  .section-toolbar { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-top: 22px; }
  .toolbar-pill { display: inline-flex; align-items: center; gap: 7px; padding: 7px 14px; border-radius: 999px; background: white; border: 1px solid var(--line); font-size: 0.76rem; font-weight: 600; color: var(--ink-soft); }
  .toolbar-pill.cafe svg { color: var(--cafe); }

  .venue-card { background: white; border: 1px solid var(--line); border-radius: 18px; overflow: hidden; cursor: pointer; display: flex; flex-direction: column; height: 100%; transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s cubic-bezier(0.16,1,0.3,1), border-color 0.4s; }
  .venue-card:hover { transform: translateY(-6px); box-shadow: 0 26px 50px -22px rgba(18, 24, 31, 0.22); border-color: var(--cafe); }
  .venue-media { position: relative; height: 208px; flex-shrink: 0; overflow: hidden; }
  .venue-media img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s; }
  .venue-card:hover .venue-media img { transform: scale(1.045); }

  .venue-badge-row { position: absolute; top: 12px; left: 12px; right: 12px; display: flex; align-items: flex-start; justify-content: space-between; z-index: 3; pointer-events: none; }
  .venue-type-chip { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 999px; font-size: 10.5px; font-weight: 700; letter-spacing: 0.03em; color: white; background: var(--cafe); }
  .venue-avail-chip { display: inline-flex; align-items: center; gap: 6px; padding: 5px 10px; border-radius: 999px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.03em; color: var(--ink); background: rgba(251,249,245,0.94); }
  .venue-avail-chip.unavailable { color: var(--cafe); }
  .avail-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--cafe); animation: ix-pulse-dot 1.8s infinite; }

  .venue-quickview { position: absolute; bottom: 12px; left: 12px; z-index: 3; width: 34px; height: 34px; border-radius: 50%; background: rgba(251,249,245,0.94); display: flex; align-items: center; justify-content: center; border: none; cursor: pointer; opacity: 0; transform: translateY(6px); transition: all 0.3s; }
  .venue-card:hover .venue-quickview { opacity: 1; transform: translateY(0); }

  .venue-price-float { position: absolute; bottom: 12px; right: 12px; z-index: 3; background: rgba(18, 24, 31, 0.82); border-radius: 10px; padding: 7px 13px; text-align: right; }
  .venue-price-float .amt { color: white; font-size: 1rem; font-weight: 700; line-height: 1; }
  .venue-price-float .per { color: rgba(255,255,255,0.6); font-size: 9px; text-transform: uppercase; letter-spacing: 0.05em; }

  .venue-body { padding: 20px 20px 18px; display: flex; flex-direction: column; flex: 1; }
  .venue-title-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; margin-bottom: 4px; }
  .venue-body h3 { font-family: 'Fraunces', serif; font-size: 1.08rem; font-weight: 600; color: var(--ink); line-height: 1.28; }
  .venue-verified { flex-shrink: 0; display: inline-flex; align-items: center; gap: 3px; font-size: 0.7rem; font-weight: 700; color: var(--cafe); background: var(--cafe-tint); border-radius: 8px; padding: 3px 7px; }

  .venue-loc { display: flex; align-items: center; gap: 5px; font-size: 0.8rem; color: var(--ink-faint); margin-bottom: 14px; }

  .venue-specs { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 18px; }
  .venue-spec-chip { display: inline-flex; align-items: center; gap: 5px; padding: 5px 9px; border-radius: 8px; background: var(--paper-dim); border: 1px solid var(--line); font-size: 0.7rem; font-weight: 600; color: var(--ink-soft); }
  .venue-spec-chip svg { color: var(--cafe); }

  .venue-footer { margin-top: auto; display: flex; align-items: center; justify-content: space-between; padding-top: 15px; border-top: 1px dashed var(--line); }
  .venue-footer .amount { font-family: 'Fraunces', serif; font-size: 1.28rem; font-weight: 600; color: var(--ink); }
  .venue-footer .unit { font-size: 0.68rem; color: var(--ink-faint); font-weight: 600; }

  .venue-cta { display: inline-flex; align-items: center; gap: 6px; padding: 10px 15px; border-radius: 9px; border: none; font-size: 0.8rem; font-weight: 700; color: white; cursor: pointer; transition: all 0.3s; background: var(--cafe); }
  .venue-cta:hover { transform: translateX(2px); filter: brightness(1.1); }

  @media (max-width: 640px) { .venue-media { height: 176px; } .venue-body { padding: 16px 16px 14px; } }

  .card-image-slider { position: relative; height: 100%; width: 100%; overflow: hidden; }
  .card-image-slider img { width: 100%; height: 100%; object-fit: cover; }

  .plain-card { background: white; border: 1px solid var(--line); border-radius: 16px; padding: 28px 24px; height: 100%; display: flex; flex-direction: column; transition: all 0.35s cubic-bezier(0.16,1,0.3,1); }
  .plain-card:hover { transform: translateY(-5px); border-color: var(--cafe); box-shadow: 0 20px 40px -24px rgba(18,24,31,0.2); }
  .plain-card .icon-wrapper { width: 46px; height: 46px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; background: var(--cafe-tint); color: var(--cafe); }
  .plain-card h3 { font-family: 'Fraunces', serif; font-size: 1.05rem; font-weight: 600; color: var(--ink); margin-bottom: 6px; }
  .plain-card p { font-size: 0.86rem; color: var(--ink-soft); line-height: 1.65; flex: 1; }

  .about-tile { padding: 16px 12px; border-radius: 14px; background: white; border: 1px solid var(--line); text-align: center; transition: all 0.3s; }
  .about-tile:hover { border-color: var(--cafe); transform: translateY(-3px); }
  .about-tile .icon-wrap { width: 40px; height: 40px; margin: 0 auto; border-radius: 10px; background: var(--cafe-tint); display: flex; align-items: center; justify-content: center; color: var(--cafe); }
  .about-tile p { font-size: 0.72rem; color: var(--ink-soft); margin-top: 9px; font-weight: 600; line-height: 1.4; }

  .feature-band { background: var(--ink); color: var(--paper); }
  .feature-card { border-radius: 16px; padding: 28px 24px; border: 1px solid rgba(251,249,245,0.12); background: rgba(251,249,245,0.04); height: 100%; display: flex; flex-direction: column; transition: all 0.35s; }
  .feature-card:hover { background: rgba(251,249,245,0.08); border-color: rgba(251,249,245,0.25); }
  .feature-card .feature-icon { width: 42px; height: 42px; border-radius: 10px; display: flex; align-items: center; justify-content: center; background: rgba(251,249,245,0.1); color: var(--warm); margin-bottom: 16px; }
  .feature-card h3 { font-family: 'Fraunces', serif; font-size: 1.05rem; font-weight: 600; margin-bottom: 6px; }
  .feature-card p { font-size: 0.85rem; color: rgba(251,249,245,0.65); line-height: 1.6; }

  .cafe-cta-section { background: var(--ink); border-radius: 22px; padding: 52px 40px; text-align: center; color: var(--paper); }
  .cafe-cta-section h2 { font-family: 'Fraunces', serif; font-size: 2rem; font-weight: 500; margin-bottom: 10px; }
  .cafe-cta-section p { font-size: 0.98rem; opacity: 0.75; max-width: 480px; margin: 0 auto 26px; }
  .cafe-cta-btn { display: inline-flex; align-items: center; gap: 10px; padding: 14px 32px; background: var(--cafe); color: var(--paper); border: none; border-radius: 12px; font-size: 0.95rem; font-weight: 700; cursor: pointer; transition: all 0.3s; }
  .cafe-cta-btn:hover { background: var(--warm); transform: translateY(-2px); }
  @media (max-width: 640px) { .cafe-cta-section { padding: 32px 20px; } }

  .faq-item { border-radius: 14px; border: 1px solid var(--line); background: white; overflow: hidden; transition: border-color 0.3s; }
  .faq-item:hover { border-color: var(--cafe); }
  .faq-item button { width: 100%; padding: 20px 22px; display: flex; align-items: center; justify-content: space-between; text-align: left; background: none; border: none; cursor: pointer; }
  .faq-item .faq-cat { font-size: 10px; color: var(--cafe); text-transform: uppercase; letter-spacing: 0.08em; font-weight: 700; }
  .faq-item .faq-q { font-family: 'Fraunces', serif; font-size: 1rem; font-weight: 500; color: var(--ink); margin-top: 3px; }
  .faq-item .faq-a { padding: 0 22px 20px; font-size: 0.9rem; color: var(--ink-soft); line-height: 1.7; border-top: 1px solid var(--line); padding-top: 14px; }

  .contact-band { background: var(--paper-dim); }
  .contact-info-item { display: flex; align-items: flex-start; gap: 14px; padding: 16px; border-radius: 14px; background: white; border: 1px solid var(--line); transition: all 0.3s; }
  .contact-info-item:hover { border-color: var(--cafe); }
  .contact-info-item .icon-wrap { width: 40px; height: 40px; border-radius: 10px; background: var(--cafe); color: var(--paper); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .contact-form { background: white; border: 1px solid var(--line); border-radius: 18px; padding: 28px; }
  .contact-form input, .contact-form textarea { width: 100%; padding: 13px 15px; border-radius: 10px; background: var(--paper-dim); border: 1px solid var(--line); color: var(--ink); font-size: 0.9rem; transition: all 0.25s; }
  .contact-form input::placeholder, .contact-form textarea::placeholder { color: var(--ink-faint); }
  .contact-form input:focus, .contact-form textarea:focus { outline: none; border-color: var(--cafe); background: white; }
  .contact-submit { width: 100%; padding: 14px; font-size: 0.92rem; font-weight: 700; color: var(--paper); background: var(--cafe); border: none; border-radius: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.3s; }
  .contact-submit:hover:not(:disabled) { background: var(--cafe-deep); }
  .contact-submit:disabled { opacity: 0.6; cursor: not-allowed; }

  .modal-overlay { position: fixed; inset: 0; z-index: 9999; background: rgba(18, 24, 31, 0.55); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; padding: 20px; animation: ix-fade 0.25s ease; }
  .modal-content { background: var(--paper); border-radius: 24px; max-width: 940px; width: 100%; max-height: 90vh; overflow-y: auto; position: relative; animation: ix-scale-in 0.3s cubic-bezier(0.16,1,0.3,1); box-shadow: 0 40px 100px rgba(18,24,31,0.35); scrollbar-width: none; }
  .modal-content::-webkit-scrollbar { width: 0; }
  .modal-content.small { max-width: 460px; }
  .modal-close { position: sticky; top: 12px; float: right; width: 34px; height: 34px; border-radius: 50%; background: white; border: 1px solid var(--line); display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 20; margin: 12px 12px 0 0; transition: all 0.3s; }
  .modal-close:hover { background: var(--paper-dim); }

  .venue-detail-modal { display: flex; flex-direction: column; }
  .venue-detail-modal .modal-body { display: grid; grid-template-columns: 1fr 1fr; gap: 0; min-height: 460px; }
  .venue-detail-modal .modal-image-section { position: relative; background: #0f1216; min-height: 380px; overflow: hidden; }
  .venue-detail-modal .media-slider { width: 100%; height: 100%; position: relative; display: flex; align-items: center; justify-content: center; }
  .venue-detail-modal .slider-image, .venue-detail-modal .slider-video { width: 100%; height: 100%; object-fit: cover; min-height: 380px; }
  .venue-detail-modal .slider-video { object-fit: contain; background: #0f1216; }
  .venue-detail-modal .slider-btn { position: absolute; top: 50%; transform: translateY(-50%); width: 38px; height: 38px; border-radius: 50%; background: rgba(18,24,31,0.6); border: 1px solid rgba(255,255,255,0.2); color: white; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 5; }
  .venue-detail-modal .slider-btn.prev { left: 12px; }
  .venue-detail-modal .slider-btn.next { right: 12px; }
  .venue-detail-modal .media-dots { position: absolute; bottom: 16px; left: 50%; transform: translateX(-50%); display: flex; gap: 8px; z-index: 5; }
  .venue-detail-modal .media-dots .dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.4); border: none; cursor: pointer; padding: 0; }
  .venue-detail-modal .media-dots .dot.video { width: 14px; border-radius: 4px; }
  .venue-detail-modal .media-dots .dot.active { background: white; }
  .venue-detail-modal .media-type-badge { position: absolute; top: 16px; right: 16px; background: rgba(18,24,31,0.65); color: white; padding: 5px 12px; border-radius: 999px; font-size: 10.5px; font-weight: 700; z-index: 5; display: flex; align-items: center; gap: 5px; text-transform: uppercase; letter-spacing: 0.04em; }
  .venue-detail-modal .venue-type-badge { position: absolute; top: 16px; left: 16px; padding: 6px 16px; border-radius: 999px; font-size: 11px; font-weight: 700; color: white; background: var(--cafe); z-index: 5; }

  .venue-detail-modal .modal-content-section { padding: 32px 28px; display: flex; flex-direction: column; overflow-y: auto; background: var(--paper); }
  .venue-detail-modal .venue-title { font-family: 'Fraunces', serif; font-size: 1.5rem; font-weight: 600; color: var(--ink); margin-bottom: 6px; }
  .venue-detail-modal .venue-sub { font-size: 0.86rem; color: var(--ink-faint); margin-bottom: 16px; }
  .venue-detail-modal .venue-desc { font-size: 0.9rem; color: var(--ink-soft); line-height: 1.7; margin-bottom: 16px; flex: 1; }
  .venue-detail-modal .venue-detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 16px; }
  .venue-detail-modal .detail-item { display: flex; align-items: center; gap: 8px; font-size: 0.8rem; color: var(--ink-soft); padding: 7px 10px; background: var(--paper-dim); border-radius: 8px; }
  .venue-detail-modal .detail-item svg { color: var(--cafe); flex-shrink: 0; }
  .venue-detail-modal .venue-price { display: flex; align-items: baseline; gap: 8px; padding-top: 16px; border-top: 1px solid var(--line); margin-bottom: 16px; }
  .venue-detail-modal .venue-price .amount { font-family: 'Fraunces', serif; font-size: 1.7rem; font-weight: 600; color: var(--ink); }
  .venue-detail-modal .venue-price .period { font-size: 0.86rem; color: var(--ink-faint); }
  .btn-book-now-modal { width: 100%; padding: 15px; background: var(--cafe); color: var(--paper); border: none; border-radius: 12px; font-size: 0.95rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: auto; transition: all 0.3s; }
  .btn-book-now-modal:hover:not(:disabled) { background: var(--cafe-deep); }
  .btn-book-now-modal:disabled { opacity: 0.55; cursor: not-allowed; }

  @media (max-width: 768px) {
    .venue-detail-modal .modal-body { grid-template-columns: 1fr; }
    .venue-detail-modal .modal-image-section, .venue-detail-modal .slider-image, .venue-detail-modal .slider-video { min-height: 260px; }
    .venue-detail-modal .modal-content-section { padding: 22px 18px; }
  }

  .site-footer { background: var(--ink); color: rgba(251,249,245,0.7); }
  .site-footer h4 { color: var(--paper); font-family: 'Fraunces', serif; font-weight: 600; font-size: 0.95rem; margin-bottom: 16px; }
  .site-footer a, .site-footer button { color: rgba(251,249,245,0.62); font-size: 0.87rem; transition: all 0.25s; }
  .site-footer a:hover, .site-footer button:hover { color: var(--warm); transform: translateX(3px); }
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

// ─── CARD IMAGE SLIDER ───
const CardImage = ({ src, alt }) => (
  <div className="card-image-slider">
    <img src={src} alt={alt || "Venue"} loading="lazy" onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }} />
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

// ─── VENUE CARD ───
const VenueCard = ({ venue, index, onClick }) => (
  <div className="venue-card" onClick={() => onClick(venue)}>
    <div className="venue-media">
      <CardImage src={venue.images[0]} alt={venue.name} />
      <div className="venue-badge-row">
        <span className="venue-type-chip"><Coffee size={11} /> {venue.cuisineType || "Cafe"}</span>
        <span className={`venue-avail-chip ${venue.available ? "" : "unavailable"}`}>
          {venue.available ? <><span className="avail-dot" /> Available</> : "Fully Booked"}
        </span>
      </div>
      <button className="venue-quickview" onClick={(e) => { e.stopPropagation(); onClick(venue); }} aria-label="Quick view">
        <Maximize2 size={14} color="#C67B3D" />
      </button>
      <div className="venue-price-float">
        <div className="amt">{venue.price}</div>
        <div className="per">per table</div>
      </div>
    </div>

    <div className="venue-body">
      <div className="venue-title-row">
        <h3 className="line-clamp-2">{venue.name}</h3>
        <span className="venue-verified"><BadgeCheck size={11} /> Verified</span>
      </div>
      <div className="venue-loc"><MapPin size={13} /><span className="line-clamp-1">{venue.location}</span></div>
      <div className="venue-specs">
        <span className="venue-spec-chip"><Table2 size={12} /> {venue.tables} tables</span>
        <span className="venue-spec-chip"><Users size={12} /> {venue.capacity} seats</span>
        <span className="venue-spec-chip"><ClockIcon size={12} /> {venue.timing || "8AM - 11PM"}</span>
      </div>
      <div className="venue-footer">
        <div>
          <div className="amount">{venue.price}</div>
          <div className="unit">per table</div>
        </div>
        <button className="venue-cta" onClick={(e) => { e.stopPropagation(); onClick(venue); }}>
          Book table <ArrowRight size={14} />
        </button>
      </div>
    </div>
  </div>
);

// ─── MAIN PAGE ───
const CafeDiningPage = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const [formData, setFormData] = useState({ name: "", email: "", phone: "", address: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [showThankYouPopup, setShowThankYouPopup] = useState(false);
  const [thankYouText, setThankYouText] = useState({ title: "Booking confirmed", body: "Your table has been reserved. We'll send you a confirmation shortly." });

  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const [selectedVenue, setSelectedVenue] = useState(null);
  const [showVenueModal, setShowVenueModal] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [mediaItems, setMediaItems] = useState([]);

  const getImageUrl = (img) => {
    if (!img) return PLACEHOLDER_IMAGE;
    if (img.startsWith("http")) return img;
    const cleanPath = img.replace(/\\/g, "/").replace(/^\/+/, "");
    return `${API_URL}/${cleanPath}`;
  };

  const getMediaItems = (venue) => {
    const items = [];
    if (venue.images && venue.images.length > 0) {
      venue.images.forEach((img) => items.push({ type: "image", url: img }));
    }
    if (venue.rawData && venue.rawData.videos && venue.rawData.videos.length > 0) {
      venue.rawData.videos.forEach((video) => items.push({ type: "video", url: getImageUrl(video) }));
    }
    if (items.length === 0) items.push({ type: "image", url: PLACEHOLDER_IMAGE });
    return items;
  };

  useEffect(() => {
    const fetchVenues = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        const res = await axios.get(`${API_URL}/api/venues`);
        const data = res.data.venues || res.data;
        const allVenues = Array.isArray(data) ? data : [];
        
        const cafeVenues = allVenues.filter((v) => v.type === "cafe" || v.type === "restaurant");

        const formatted = cafeVenues.map((venue, index) => ({
          id: venue._id,
          name: venue.name || `Venue ${index + 1}`,
          location: venue.address?.split(",")[0] || "Main Street",
          tables: venue.tables || 10,
          capacity: venue.capacity || 40,
          cuisineType: venue.cuisine || "Cafe",
          price: `₹${venue.price || 599}`,
          timing: venue.timing || "8AM - 11PM",
          images: venue.images && venue.images.length > 0 ? venue.images.map((img) => getImageUrl(img)) : [PLACEHOLDER_IMAGE],
          available: venue.isActive === true,
          description: venue.description || "",
          rawData: venue
        }));

        setVenues(formatted);
      } catch (err) {
        console.error("Error fetching venues:", err);
        setFetchError("Failed to load venues. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchVenues();
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

  const handleVenueClick = (venue) => {
    setMediaItems(getMediaItems(venue));
    setSelectedVenue(venue);
    setCurrentMediaIndex(0);
    setShowVenueModal(true);
  };
  const closeVenueModal = () => { setShowVenueModal(false); setSelectedVenue(null); setMediaItems([]); };

  const handlePrevMedia = () => setCurrentMediaIndex((p) => (p === 0 ? mediaItems.length - 1 : p - 1));
  const handleNextMedia = () => setCurrentMediaIndex((p) => (p === mediaItems.length - 1 ? 0 : p + 1));

  const handleBookVenue = () => {
    setIsBooking(true);
    setTimeout(() => {
      setIsBooking(false);
      closeVenueModal();
      setThankYouText({ 
        title: "Table booked! 🎉", 
        body: `Your table at ${selectedVenue?.name} has been reserved. We'll send you a confirmation with details.` 
      });
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
      const response = await fetch(`${API_URL}/api/venues/sendquery`, {
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

  const venueBenefits = [
    { icon: Shield, title: "Zero hidden fees", desc: "No deposits, no service charges, just pay for your table." },
    { icon: Wallet, title: "Flexible pricing", desc: "Pay by the hour, meal, or full evening." },
    { icon: Users, title: "Group bookings", desc: "Reserve for 2 to 50+ guests effortlessly." },
    { icon: Sparkles, title: "Curated menus", desc: "Handpicked cuisine from top chefs." }
  ];

  const features = [
    { icon: Coffee, title: "Premium coffee", desc: "Artisanal brews from single-origin beans." },
    { icon: ChefHat, title: "Expert chefs", desc: "Michelin-trained culinary team." },
    { icon: Clock, title: "Flexible hours", desc: "Book morning brunch or late-night dinner." },
    { icon: Award, title: "Top-rated venues", desc: "4.8+ average rating from diners." }
  ];

  const aboutTiles = [
    { icon: HomeIcon, label: "Premium dining spaces" },
    { icon: Wallet, label: "Affordable bookings" },
    { icon: Coffee, label: "Artisanal coffee" },
    { icon: Users, label: "Group-friendly" },
    { icon: Shield, label: "Sanitized spaces" },
    { icon: Layout, label: "Aesthetic interiors" },
    { icon: Utensils, label: "Multi-cuisine" },
    { icon: Star, label: "Trusted by 500+ diners" }
  ];

  const stats = [
    { label: "Venues", value: venues.length || 25, suffix: "+" },
    { label: "Happy Diners", value: 500, suffix: "+" },
    { label: "Satisfaction", value: 98, suffix: "%" }
  ];

  const renderModalMedia = () => {
    if (!mediaItems.length) return null;
    const item = mediaItems[currentMediaIndex];
    if (item.type === "video") {
      return <video src={item.url} className="slider-video" controls playsInline controlsList="nodownload" />;
    }
    return <img src={item.url} alt={selectedVenue?.name || "Venue"} className="slider-image" onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }} />;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#FBF9F5" }}>
        <div className="text-center">
          <div className="w-12 h-12 border-2 rounded-full mx-auto" style={{ borderColor: "#E3DDCE", borderTopColor: "#C67B3D", animation: "ix-spin 0.8s linear infinite" }} />
          <p className="mt-4" style={{ color: "#4A5160" }}>Loading dining venues…</p>
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
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "#F5EDE5" }}>
                  <CheckCircle size={32} color="#C67B3D" />
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

        {/* Venue detail modal */}
        {showVenueModal && selectedVenue && (
          <div className="modal-overlay" onClick={closeVenueModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={closeVenueModal}><X size={17} /></button>

              <div className="venue-detail-modal">
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
                    <span className="venue-type-badge">Cafe / Restaurant</span>
                  </div>

                  <div className="modal-content-section">
                    <h3 className="venue-title">{selectedVenue.name}</h3>
                    <p className="venue-sub">{selectedVenue.location} · {selectedVenue.cuisineType}</p>
                    <p className="venue-desc">
                      {selectedVenue.description || "A cozy dining space perfect for intimate meals, group gatherings, or business meetings."}
                    </p>

                    <div className="venue-detail-grid">
                      <div className="detail-item"><Table2 size={15} /><span>{selectedVenue.tables} tables</span></div>
                      <div className="detail-item"><Users size={15} /><span>{selectedVenue.capacity} seats</span></div>
                      <div className="detail-item"><ClockIcon size={15} /><span>{selectedVenue.timing}</span></div>
                      <div className="detail-item">
                        {selectedVenue.available ? <><CheckCircle size={15} color="#23474B" /><span>Available now</span></> : <><X size={15} color="#C67B3D" /><span>Fully booked</span></>}
                      </div>
                    </div>

                    <div className="venue-price">
                      <span className="amount">{selectedVenue.price}</span>
                      <span className="period">/ table</span>
                    </div>

                    <button className="btn-book-now-modal" onClick={handleBookVenue} disabled={!selectedVenue.available || isBooking}>
                      {isBooking ? (
                        <>
                          <svg className="h-4 w-4" style={{ animation: "ix-spin 0.8s linear infinite" }} viewBox="0 0 24 24" fill="none">
                            <circle opacity="0.25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path opacity="0.75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Booking…
                        </>
                      ) : selectedVenue.available ? (
                        <>Book this table <ArrowRight size={18} /></>
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
              <span className="navbar-brand hidden sm:flex">IRYAX DINING</span>
            </button>

            <div className="nav-links">
              <button onClick={() => scrollToSection("venues")} className="navbar-link">Venues</button>
              <button onClick={() => scrollToSection("benefits")} className="navbar-link">Benefits</button>
              <button onClick={() => scrollToSection("about")} className="navbar-link">About</button>
              <button onClick={() => scrollToSection("faq")} className="navbar-link">FAQ</button>
              <button onClick={() => scrollToSection("contact")} className="navbar-link">Contact</button>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => navigate("/login")} className="navbar-signin hidden sm:block">Sign in</button>
              <button onClick={() => navigate("/login")} className="navbar-btn"><Utensils size={14} /> Book a table</button>
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
            {[["Venues", "venues"], ["Benefits", "benefits"], ["About", "about"], ["FAQ", "faq"], ["Contact", "contact"]].map(([label, id]) => (
              <button key={id} onClick={() => { setMobileOpen(false); scrollToSection(id); }} className="px-4 py-3.5 text-left rounded-xl font-medium" style={{ background: "#F1EDE3" }}>
                {label}
              </button>
            ))}
            <div className="h-px my-1" style={{ background: "#E3DDCE" }} />
            <button onClick={() => { navigate("/login"); setMobileOpen(false); }} className="px-4 py-3.5 text-center text-white rounded-xl font-semibold" style={{ background: "#C67B3D" }}>
              Book a table
            </button>
          </div>
        </div>

        {/* Hero */}
        <section className="hero-section">
          <div className="hero-grid">
            <div>
              <RevealSection>
                <span className="ix-eyebrow cafe"><span className="dot" />India&rsquo;s curated dining spaces</span>
              </RevealSection>
              <RevealSection delay={0.1}>
                <h1 className="hero-title ix-serif">Your table <em>is waiting.</em></h1>
              </RevealSection>
              <RevealSection delay={0.2}>
                <p className="hero-desc">
                  Book the perfect table for any occasion — from intimate dinners to large group gatherings. 
                  Curated cafes and restaurants, ready when you are.
                </p>
              </RevealSection>
              <RevealSection delay={0.25}>
                <div className="hero-feature-list">
                  <span className="item"><CheckCircle size={14} /> Instant booking</span>
                  <span className="item"><CheckCircle size={14} /> No deposit</span>
                  <span className="item"><CheckCircle size={14} /> Flexible cancellations</span>
                  <span className="item"><CheckCircle size={14} /> Best prices</span>
                </div>
              </RevealSection>
              <RevealSection delay={0.3}>
                <div className="hero-buttons">
                  <button onClick={() => navigate("/login")} className="btn-primary">
                    <Coffee size={16} /> Find your table <ArrowRight size={16} />
                  </button>
                  <button onClick={() => scrollToSection("venues")} className="btn-secondary">
                    <Eye size={16} /> Explore venues
                  </button>
                </div>
              </RevealSection>
            </div>

            <RevealSection delay={0.15}>
              <div className="hero-figure">
                <img src={HERO_IMAGE} alt="IRYAX DINING - Premium dining spaces" />
              </div>
            </RevealSection>
          </div>
        </section>

        {/* Stats */}
        <section className="stats-strip py-14 px-8">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-6">
            {stats.map((stat, i) => (
              <RevealSection key={i} delay={i * 0.06}>
                <div className="text-center">
                  <div className="stat-num ix-serif">
                    {stat.label === "Venues" ? <>{venues.length || 25}+</> : <Counter target={stat.value} suffix={stat.suffix} />}
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
              <RevealSection><span className="ix-eyebrow cafe"><span className="dot" />About IRYAX DINING</span></RevealSection>
              <RevealSection delay={0.1}><h2>Book experiences, not just tables</h2></RevealSection>
              <RevealSection delay={0.2}>
                <p className="mx-auto">
                  IRYAX DINING connects you with the best cafes and restaurants in the city. 
                  Curated spaces, verified reviews, and seamless booking — all in one place.
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

        {/* Venues */}
        <section id="venues" className="py-8 px-6" style={{ background: "#F5EDE5" }}>
          <div className="max-w-6xl mx-auto py-8">
            <div className="section-head mx-auto text-center">
              <RevealSection><span className="ix-eyebrow cafe"><span className="dot" />Our venues</span></RevealSection>
              <RevealSection delay={0.1}><h2>Choose your dining experience</h2></RevealSection>
              <RevealSection delay={0.2}><p className="mx-auto">Click on any venue to view details and book a table.</p></RevealSection>
            </div>

            {venues.length > 0 && (
              <RevealSection delay={0.15}>
                <div className="section-toolbar justify-center">
                  <span className="toolbar-pill cafe"><Coffee size={14} /> {venues.length} venues</span>
                  <span className="toolbar-pill cafe"><ShieldCheck size={14} /> Verified</span>
                  <span className="toolbar-pill cafe"><ClockIcon size={14} /> 8AM - 11PM</span>
                </div>
              </RevealSection>
            )}

            {fetchError ? (
              <div className="text-center py-16">
                <Coffee size={44} className="mx-auto mb-4" color="#D9C3BA" />
                <p style={{ color: "#8A8F99" }}>{fetchError}</p>
              </div>
            ) : venues.length === 0 ? (
              <div className="text-center py-16">
                <Building2 size={44} className="mx-auto mb-4" color="#D9C3BA" />
                <p style={{ color: "#8A8F99" }}>No dining venues available right now.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
                {venues.map((venue, i) => (
                  <RevealSection key={venue.id || i} delay={i * 0.08}>
                    <VenueCard venue={venue} index={i} onClick={handleVenueClick} />
                  </RevealSection>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Benefits */}
        <section id="benefits" className="py-24 px-6" style={{ background: "#F1EDE3" }}>
          <div className="max-w-6xl mx-auto">
            <div className="section-head mx-auto text-center">
              <RevealSection><span className="ix-eyebrow cafe"><span className="dot" />Benefits</span></RevealSection>
              <RevealSection delay={0.1}><h2>Book smarter, dine better</h2></RevealSection>
              <RevealSection delay={0.2}><p className="mx-auto">We make dining reservations effortless and rewarding.</p></RevealSection>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-14">
              {venueBenefits.map((benefit, i) => (
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
              <RevealSection><span className="ix-eyebrow" style={{ color: "#D4A373", borderColor: "rgba(251,249,245,0.15)" }}><span className="dot" style={{ background: "#D4A373" }} />Why dine here</span></RevealSection>
              <RevealSection delay={0.1}><h2 className="ix-serif" style={{ color: "#FBF9F5" }}>Every meal is an experience</h2></RevealSection>
              <RevealSection delay={0.2}><p className="mx-auto" style={{ color: "rgba(251,249,245,0.6)" }}>Curated spaces, exceptional service, unforgettable memories.</p></RevealSection>
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
              <div className="cafe-cta-section">
                <h2>Hungry for a great experience?</h2>
                <p>Join 500+ diners who book their perfect table with us every day.</p>
                <button onClick={() => navigate("/login")} className="cafe-cta-btn">Explore venues <ArrowRight size={18} /></button>
              </div>
            </RevealSection>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-24 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="section-head mx-auto text-center">
              <RevealSection><span className="ix-eyebrow cafe"><span className="dot" />FAQ</span></RevealSection>
              <RevealSection delay={0.1}><h2>Answers about dining &amp; booking</h2></RevealSection>
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
              <RevealSection><span className="ix-eyebrow cafe"><span className="dot" />Get in touch</span></RevealSection>
              <RevealSection delay={0.1}><h2>Questions? We're here to help</h2></RevealSection>
              <RevealSection delay={0.2}><p className="mx-auto">Reach out for reservations, group bookings, or any queries.</p></RevealSection>
            </div>

            <div className="grid md:grid-cols-5 gap-8 mt-12">
              <div className="md:col-span-2 space-y-4">
                {[
                  { icon: Mail, label: "Email", value: "dining@iryax.com" },
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
                      <div className="p-3 rounded-xl text-sm" style={{ background: "#F5EDE5", color: "#C67B3D", border: "1px solid #E3C3B4" }}>{submitError}</div>
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
                    <span className="ix-serif font-semibold" style={{ color: "#FBF9F5" }}>IRYAX DINING</span>
                  </button>
                  <p className="text-sm" style={{ color: "rgba(251,249,245,0.55)" }}>India&rsquo;s curated dining spaces.</p>
                </div>
              </RevealSection>
              <RevealSection delay={0.1}>
                <div>
                  <h4>Explore</h4>
                  <div className="space-y-2.5">
                    <button onClick={() => scrollToSection("venues")} className="block text-left">Venues</button>
                    <button onClick={() => scrollToSection("benefits")} className="block text-left">Benefits</button>
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
                <p className="text-sm">© IRYAX DINING. All rights reserved.</p>
                <p className="text-xs mt-2 tracking-wider uppercase" style={{ opacity: 0.4 }}>IRYAX SPACE FOR CAFE &amp; RESTAURANT</p>
              </div>
            </RevealSection>
          </div>
        </footer>
      </div>
    </>
  );
};

export default CafeDiningPage;