import axios from "axios";
import {
  Armchair,
  ArrowLeft,
  Bath,
  Car,
  Clock,
  Lock,
  MapPin,
  Shield,
  ShieldCheck,
  Users,
  Wifi,
  Building2 as BuildingIcon,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UsersNavbar from "./UsersNavbar";
import AdminNavbar from "./AdminNavbar";
import "./Dashboard.css";

const API_URL = "https://spaceapi.iryax.com";
const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000";

export default function CabinDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem("admin") !== null;

  const [cabin, setCabin] = useState(null);
  const [relatedCabins, setRelatedCabins] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [images, setImages] = useState([]);
  const autoSlideRef = useRef(null);

  const getImageUrl = (img) => {
    if (!img) return PLACEHOLDER_IMAGE;
    if (img.startsWith("http")) return img;
    const cleanPath = img.replace(/\\/g, "/").replace(/^\/+/, "");
    return `${API_URL}/${cleanPath}`;
  };

  // Auto-slide effect
  useEffect(() => {
    if (images.length <= 1) return;

    autoSlideRef.current = setInterval(() => {
      setActiveImage((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => {
      if (autoSlideRef.current) clearInterval(autoSlideRef.current);
    };
  }, [images.length]);

  // Reset timer on manual change
  const handleImageChange = (index) => {
    setActiveImage(index);
    if (autoSlideRef.current) {
      clearInterval(autoSlideRef.current);
      autoSlideRef.current = setInterval(() => {
        setActiveImage((prev) => (prev + 1) % images.length);
      }, 4000);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch cabin details
        const cabinRes = await axios.get(`${API_URL}/api/cabins/${id}`);
        setCabin(cabinRes.data);
        
        // Set images
        if (cabinRes.data.images && cabinRes.data.images.length > 0) {
          setImages(cabinRes.data.images.map(img => getImageUrl(img)));
        } else {
          setImages([PLACEHOLDER_IMAGE]);
        }

        // Fetch all cabins for related
        try {
          const allRes = await axios.get(`${API_URL}/api/cabins`);
          setRelatedCabins(
            allRes.data.filter((c) => c._id !== id).slice(0, 3)
          );
        } catch (err) {
          console.error("Error fetching related cabins:", err);
          setRelatedCabins([]);
        }

        // Fetch booked slots
        try {
          const slotsRes = await axios.get(`${API_URL}/api/bookings/cabin/${id}`);
          setBookedSlots(slotsRes.data.bookedSlots || []);
        } catch (err) {
          console.error("Error fetching booked slots:", err);
          setBookedSlots([]);
        }

      } catch (err) {
        console.error("Error fetching cabin:", err);
        setCabin(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Group booked slots by date
  const slotsByDate = bookedSlots.reduce((acc, slot) => {
    const key = slot.startDate;
    if (!acc[key]) acc[key] = [];
    acc[key].push(slot);
    return acc;
  }, {});

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  };

  const formatTime = (t) => {
    if (!t) return "";
    const [h, m] = t.split(":");
    const hour = parseInt(h);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${displayHour}:${m} ${ampm}`;
  };

  const nextImage = () => {
    if (images.length <= 1) return;
    handleImageChange((activeImage + 1) % images.length);
  };

  const prevImage = () => {
    if (images.length <= 1) return;
    handleImageChange((activeImage - 1 + images.length) % images.length);
  };

  if (loading) {
    return (
      <div className="admin-dash">
        {isAdmin ? <AdminNavbar /> : <UsersNavbar />}
        <div className="admin-dash__loading">
          <div className="admin-dash__spinner" />
          <p className="admin-dash__loading-text">Loading cabin details...</p>
        </div>
      </div>
    );
  }

  if (!cabin) {
    return (
      <div className="admin-dash">
        {isAdmin ? <AdminNavbar /> : <UsersNavbar />}
        <main className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16">
          <div className="admin-dash__error" style={{ background: '#f8fafc', borderColor: '#e2e8f0' }}>
            <BuildingIcon size={48} className="text-slate-300 mb-4" />
            <p className="admin-dash__error-title" style={{ color: '#475569' }}>Cabin not found</p>
            <p className="admin-dash__error-message">The cabin you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </main>
      </div>
    );
  }

  const amenityMap = {
    wifi: { label: "High Speed Wi-Fi", icon: Wifi },
    parking: { label: "Parking", icon: Car },
    lockers: { label: "Secure Lockers", icon: Lock },
    privateWashroom: { label: "Private Washroom", icon: Bath },
    secureAccess: { label: "Secure Access", icon: Shield },
    comfortSeating: { label: "Comfort Seating", icon: Armchair },
  };

  const activeAmenities = Object.keys(cabin.amenities || {}).filter(
    (key) => cabin.amenities[key]
  );

  return (
    <div className="admin-dash">
      {isAdmin ? <AdminNavbar /> : <UsersNavbar />}

      <main className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-slate-400 hover:text-indigo-600 mb-6 transition-colors"
        >
          <ArrowLeft size={14} /> Back
        </button>

        {/* Main Section */}
        <div className="admin-dash__card grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 p-6 lg:p-8">

          {/* Left Images with Slider */}
          <div className="flex flex-col gap-4">
            {/* Main Image Slider */}
            <div className="relative overflow-hidden rounded-2xl h-[300px] sm:h-[340px] lg:h-[420px] shadow-lg shadow-slate-200/50 group">
              <img
                src={images[activeImage] || PLACEHOLDER_IMAGE}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                alt={cabin.name}
                onError={(e) => {
                  e.target.src = PLACEHOLDER_IMAGE;
                }}
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-60" />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-indigo-700 shadow-sm z-10">
                Premium Workspace
              </div>
              {cabin.seats && cabin.seats.length > 0 && (
                <div className="absolute top-4 right-4 bg-indigo-600/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-white shadow-sm flex items-center gap-1.5 z-10">
                  <Armchair size={12} />
                  {cabin.seats.length} Seats
                </div>
              )}

              {/* Image Counter */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-white z-10">
                  {activeImage + 1} / {images.length}
                </div>
              )}

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70 transition-all z-10 opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70 transition-all z-10 opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight size={20} />
                  </button>

                  {/* Dots */}
                  <div className="absolute bottom-14 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => handleImageChange(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === activeImage 
                            ? 'bg-white w-6' 
                            : 'bg-white/40 hover:bg-white/60'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    onClick={() => handleImageChange(index)}
                    className={`w-20 h-16 object-cover rounded-lg cursor-pointer flex-shrink-0 transition-all
                      ${activeImage === index
                        ? "ring-2 ring-indigo-600 opacity-100"
                        : "opacity-60 hover:opacity-100"
                      }`}
                    alt=""
                    onError={(e) => {
                      e.target.src = PLACEHOLDER_IMAGE;
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right Details */}
          <div className="flex flex-col justify-center space-y-6">
            <div>
              <span className="inline-block text-[10px] font-bold text-indigo-600 uppercase tracking-[0.2em] mb-3">Workspace Details</span>
              <h1 className="text-2xl sm:text-3xl font-black uppercase text-slate-900 leading-tight mb-3 tracking-tighter">
                {cabin.name}
              </h1>
              <div className="flex items-center gap-2 text-slate-500 text-sm font-semibold">
                <div className="p-1.5 bg-indigo-50 rounded-lg">
                  <MapPin size={16} className="text-indigo-500" />
                </div>
                {cabin.address}
              </div>
            </div>

            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              {cabin.description || "Experience a premium workspace designed for maximum productivity and comfort, featuring modern architecture and essential business amenities."}
            </p>

            <div className="flex items-center gap-2">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter">₹{cabin.price}</span>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2">/ Hour</span>
            </div>

            {/* Seats Display */}
            {cabin.seats && cabin.seats.length > 0 && (
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                    <Armchair size={14} className="text-indigo-600" />
                    Available Seats ({cabin.seats.length})
                  </h3>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                  {cabin.seats.map((seat) => (
                    <div
                      key={seat._id}
                      className="p-2 rounded-xl border-2 border-slate-200 text-center bg-slate-50/50"
                    >
                      <Armchair 
                        size={16} 
                        className="mx-auto mb-1 text-slate-400"
                      />
                      <div className="text-[10px] font-bold text-slate-700 truncate">
                        {seat.name}
                      </div>
                      <div className="text-[8px] text-slate-400 font-medium">
                        #{seat.number}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Amenities */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-4">
                Amenities
              </h3>

              <div className="grid grid-cols-2 gap-3">
                {activeAmenities.map((key) => {
                  const Icon = amenityMap[key]?.icon;
                  return (
                    <div
                      key={key}
                      className="flex items-center gap-3 p-3 rounded-xl bg-indigo-50/30 border border-indigo-100/50 hover:bg-indigo-50 hover:shadow-sm transition-all group"
                    >
                      <div className="p-2 bg-white rounded-lg shadow-sm group-hover:text-indigo-600 transition-colors">
                        {Icon && <Icon size={14} />}
                      </div>
                      <span className="text-[11px] font-bold text-slate-600 uppercase tracking-tight">
                        {amenityMap[key]?.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pricing Plans */}
            {cabin.pricingPlans && cabin.pricingPlans.length > 0 && (
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-3">
                  Pricing Plans (Packages)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {cabin.pricingPlans.map((plan, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-center">
                      <div className="text-[10px] uppercase tracking-[0.1em] text-indigo-700 font-bold mb-1">
                        {plan.label || "Package"}
                      </div>
                      <div className="font-extrabold text-slate-900 text-sm">
                        ₹{plan.cost.toLocaleString("en-IN")} <span className="text-[10px] text-slate-400 font-normal">/ {plan.validity} Days</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1 font-semibold">
                        Included: {plan.hours} Hours
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Info & Book */}
            <div className="pt-6 border-t border-slate-100 flex flex-col gap-6">
              <div className="flex gap-6 sm:gap-8 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <Users size={14} className="text-indigo-500" /> {cabin.capacity} Seats
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-indigo-500" /> Secured Space
                </div>
                {cabin.seats && (
                  <div className="flex items-center gap-2">
                    <Armchair size={14} className="text-indigo-500" /> {cabin.seats.length} Available
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => navigate(`/book/${cabin._id}`)}
                  className="flex-1 py-4 bg-[#007A52] text-white rounded-xl font-bold text-sm uppercase tracking-[0.1em] hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98] flex items-center justify-center gap-3"
                >
                  Book Cabin 
                </button>
                <button
                  onClick={() => navigate(`/site-visit/${cabin._id}`)}
                  className="flex-1 py-4 bg-white border-2 border-emerald-600 text-emerald-700 rounded-xl font-bold text-sm uppercase tracking-[0.1em] hover:bg-emerald-50 transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-3"
                >
                  Site Visit
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Booked Slots Section */}
        <div style={{
          background: "#fff",
          border: "1px solid #e4e7ec",
          borderRadius: 16,
          boxShadow: "0 1px 2px rgba(16,24,40,0.05)",
          padding: "1.5rem",
          marginTop: "1.5rem",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: "linear-gradient(135deg,#fef2f2,#fee2e2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, border: "1.5px solid #fecaca",
              }}>
                <Clock size={20} color="#dc2626" />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "#101828", letterSpacing: "-0.01em" }}>
                  Already Booked Slots
                </h3>
                <p style={{ margin: 0, fontSize: "0.72rem", color: "#98a2b3", marginTop: 2 }}>
                  These time slots are unavailable — please choose a different time
                </p>
              </div>
            </div>
            {bookedSlots.length > 0 && (
              <div style={{
                background: "#fee2e2", color: "#dc2626",
                fontSize: "0.72rem", fontWeight: 700,
                padding: "4px 12px", borderRadius: 999,
                border: "1px solid #fecaca",
                whiteSpace: "nowrap",
              }}>
                {bookedSlots.length} Booking{bookedSlots.length > 1 ? "s" : ""}
              </div>
            )}
          </div>

          {bookedSlots.length === 0 ? (
            <div style={{
              display: "flex", alignItems: "center", gap: "0.875rem",
              padding: "1.125rem 1.25rem",
              background: "#f0fdf4", border: "1.5px solid #86efac",
              borderRadius: 12,
            }}>
              <ShieldCheck size={22} color="#16a34a" />
              <div>
                <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 700, color: "#15803d" }}>All Clear — Fully Available!</p>
                <p style={{ margin: 0, fontSize: "0.75rem", color: "#4ade80", marginTop: 2 }}>No bookings yet for this cabin. Go ahead and book your slot.</p>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {bookedSlots.map((slot, idx) => (
                <div key={idx} style={{
                  display: "flex", alignItems: "center", gap: "1rem",
                  padding: "0.875rem 1.125rem",
                  background: "#fef2f2",
                  border: "1.5px solid #fecaca",
                  borderRadius: 12,
                  flexWrap: "wrap",
                }}>
                  <div style={{
                    width: 10, height: 10, borderRadius: "50%",
                    background: "#dc2626", flexShrink: 0,
                    boxShadow: "0 0 0 3px rgba(220,38,38,0.2)",
                  }} />

                  <div style={{ minWidth: 120 }}>
                    <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#ef4444", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>
                      Date
                    </div>
                    <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#7f1d1d" }}>
                      {formatDate(slot.startDate)}
                      {slot.endDate && slot.endDate !== slot.startDate && (
                        <span style={{ color: "#fca5a5", fontWeight: 500 }}> → {formatDate(slot.endDate)}</span>
                      )}
                    </div>
                  </div>

                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: "0.4rem",
                    padding: "0.3rem 0.875rem",
                    background: "#fff", border: "1.5px solid #fca5a5",
                    borderRadius: 999,
                    fontSize: "0.82rem", fontWeight: 800, color: "#b91c1c",
                  }}>
                    <Clock size={13} color="#ef4444" />
                    {formatTime(slot.startTime)}
                    <span style={{ color: "#fca5a5", fontWeight: 400, margin: "0 2px" }}>→</span>
                    {formatTime(slot.endTime)}
                  </div>

                  {(slot.name || slot.email) && (
                    <div style={{ marginLeft: "auto", textAlign: "right" }}>
                      <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#ef4444", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>
                        Booked By
                      </div>
                      {slot.name && (
                        <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#7f1d1d" }}>{slot.name}</div>
                      )}
                      {slot.email && (
                        <div style={{ fontSize: "0.72rem", color: "#dc2626", fontWeight: 500 }}>{slot.email}</div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Related */}
        {relatedCabins.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl sm:text-2xl font-bold uppercase text-slate-900 mb-8 tracking-tight">
              Related Workspaces
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedCabins.map((rc) => (
                <div
                  key={rc._id}
                  onClick={() => navigate(`/cabin/${rc._id}`)}
                  className="admin-dash__card cursor-pointer hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="h-48 overflow-hidden rounded-t-2xl relative">
                    <img
                      src={getImageUrl(rc.images?.[0])}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      alt=""
                      onError={(e) => {
                        e.target.src = PLACEHOLDER_IMAGE;
                      }}
                    />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-indigo-700 shadow-sm">
                      Available
                    </div>
                    {rc.seats && rc.seats.length > 0 && (
                      <div className="absolute top-3 right-3 bg-indigo-600/95 backdrop-blur-sm px-2 py-1 rounded-full text-[10px] font-bold text-white shadow-sm flex items-center gap-1">
                        <Armchair size={10} />
                        {rc.seats.length}
                      </div>
                    )}
                  </div>
                  <div className="p-5 space-y-2">
                    <h4 className="font-bold uppercase text-slate-900 text-base truncate">
                      {rc.name}
                    </h4>
                    <p className="text-xs font-medium text-slate-500">
                      {rc.address?.split(",")[0]}
                    </p>
                    <p className="font-bold text-slate-900 pt-2 text-base">
                      ₹{rc.price} <span className="text-xs font-medium text-slate-400">/ hr</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trust */}
        <div className="mt-12 text-center text-xs font-semibold text-slate-400 uppercase tracking-widest flex justify-center items-center gap-2">
          <ShieldCheck size={16} />
          Verified professional workspace
        </div>
      </main>
    </div>
  );
}