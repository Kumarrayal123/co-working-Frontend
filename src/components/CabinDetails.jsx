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
  Building2 as BuildingIcon
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import "./Dashboard.css";
const API_URL = "http://localhost:5000";
const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000";


export default function CabinDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [cabin, setCabin] = useState(null);
  const [relatedCabins, setRelatedCabins] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);

  const getImageUrl = (img) => {
    if (!img) return PLACEHOLDER_IMAGE;
    if (img.startsWith("http")) return img;
    // Normalize path separators and remove any leading / if it exists
    const cleanPath = img.replace(/\\/g, "/").replace(/^\/+/, "");
    return `${API_URL}/${cleanPath}`;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      setLoading(true);
      try {
        const [cabinRes, allRes] = await Promise.all([
          axios.get(`${API_URL}/api/cabins/${id}`),
          axios.get(`${API_URL}/api/cabins`),
        ]);
        setCabin(cabinRes.data);
        setRelatedCabins(
          allRes.data.filter((c) => c._id !== id).slice(0, 3)
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading || !cabin) {
    return (
      <div className="admin-dash">
        <AdminNavbar/>
        <div className="admin-dash__loading">
          <div className="admin-dash__spinner" />
          <p className="admin-dash__loading-text">Loading cabin details...</p>
        </div>
      </div>
    );
  }

  /* AMENITIES WITH ICONS */
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
      <AdminNavbar/>

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

          {/* Left Images */}
          <div className="flex flex-col gap-4">
            <div className="relative overflow-hidden rounded-2xl h-[300px] sm:h-[340px] lg:h-[420px] shadow-lg shadow-slate-200/50 group">
              <img
                src={getImageUrl(cabin.images?.[activeImage])}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                alt={cabin.name}
                onError={(e) => {
                  e.target.src = PLACEHOLDER_IMAGE;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-60" />
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-indigo-700 shadow-sm">
                Premium Workspace
              </div>
            </div>

            {cabin.images?.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {cabin.images.map((img, index) => (
                  <img
                    key={index}
                    src={getImageUrl(img)}
                    onClick={() => setActiveImage(index)}
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

            {/* Workspace Features */}
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

            {/* Info & Book */}
            <div className="pt-6 border-t border-slate-100 flex flex-col gap-6">
              <div className="flex gap-6 sm:gap-8 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <Users size={14} className="text-indigo-500" /> {cabin.capacity} Seats
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-indigo-500" /> Secured Space
                </div>
              </div>

              <button
                onClick={() => navigate(`/book/${cabin._id}`)}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-sm uppercase tracking-[0.1em] hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98] flex items-center justify-center gap-3"
              >
               Book Cabin 
              </button>
            </div>
          </div>
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
