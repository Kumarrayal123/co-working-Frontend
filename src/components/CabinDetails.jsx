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
  Wifi
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
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
      <div className="h-screen flex items-center justify-center text-slate-400 font-medium">
        Loading...
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
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      {/* <UsersNavbar /> */}
      <AdminNavbar/>

      <div className="w-full mx-auto px-6 pt-20">
        {/* BACK */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-slate-400 hover:text-emerald-600 mb-8 transition-colors"
        >
          <ArrowLeft size={14} /> Back
        </button>

        {/* MAIN SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">

          {/* LEFT IMAGES */}
          <div className="flex flex-col gap-4">
            <div className="relative overflow-hidden rounded-[2rem] h-[340px] lg:h-[420px] shadow-lg shadow-slate-200/50 group">
              <img
                src={getImageUrl(cabin.images?.[activeImage])}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                alt={cabin.name}
                onError={(e) => {
                  e.target.src = PLACEHOLDER_IMAGE;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-60" />
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
                        ? "ring-2 ring-emerald-600 opacity-100"
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

          {/* RIGHT DETAILS */}
          <div className="flex flex-col justify-center space-y-6">
            <div>
              <span className="inline-block text-[10px] font-bold text-emerald-600 uppercase tracking-[0.2em] mb-3">Premium Workspace</span>
              <h1 className="text-3xl font-black uppercase text-slate-900 leading-tight mb-3 tracking-tighter">
                {cabin.name}
              </h1>
              <div className="flex items-center gap-2 text-slate-500 text-sm font-semibold">
                <div className="p-1.5 bg-emerald-50 rounded-lg">
                  <MapPin size={16} className="text-emerald-500" />
                </div>
                {cabin.address}
              </div>
            </div>

            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              {cabin.description || "Experience a premium workspace designed for maximum productivity and comfort, featuring modern architecture and essential business amenities."}
            </p>

            <div className="flex items-center gap-2">
              <span className="text-4xl font-black text-slate-900 tracking-tighter">₹{cabin.price}</span>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2">/ Hour</span>
            </div>

            {/* WORKSPACE FEATURES */}
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
                      className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/50 border border-slate-100/50 hover:bg-white hover:shadow-sm transition-all group"
                    >
                      <div className="p-2 bg-white rounded-lg shadow-sm group-hover:text-emerald-600">
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

            {/* INFO & BOOK */}
            <div className="pt-6 border-t border-slate-100 flex flex-col gap-8">
              <div className="flex gap-8 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <Users size={14} className="text-emerald-500" /> {cabin.capacity} Seats
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-emerald-500" /> Secured Space
                </div>
              </div>

              <button
                onClick={() => navigate(`/book/${cabin._id}`)}
                className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all shadow-xl shadow-slate-900/20 active:scale-[0.98] flex items-center justify-center gap-3"
              >
                Instant Booking
              </button>
            </div>
          </div>
        </div>

        {/* RELATED */}
        {relatedCabins.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-bold uppercase text-slate-900 mb-8 tracking-tight">
              Related Workspaces
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedCabins.map((rc) => (
                <div
                  key={rc._id}
                  onClick={() => navigate(`/cabin/${rc._id}`)}
                  className="bg-white rounded-[1.5rem] border border-slate-100 overflow-hidden cursor-pointer
                             hover:shadow-xl hover:shadow-slate-200/40 hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={getImageUrl(rc.images?.[0])}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      alt=""
                      onError={(e) => {
                        e.target.src = PLACEHOLDER_IMAGE;
                      }}
                    />
                  </div>
                  <div className="p-5 space-y-1">
                    <h4 className="font-bold uppercase text-slate-900 text-lg truncate">
                      {rc.name}
                    </h4>
                    <p className="text-xs font-medium text-slate-500">
                      {rc.address?.split(",")[0]}
                    </p>
                    <p className="font-bold text-slate-900 pt-2 text-lg">
                      ₹{rc.price} <span className="text-xs font-medium text-slate-400">/ hr</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TRUST */}
        <div className="mt-16 text-center text-xs font-semibold text-slate-400 uppercase tracking-widest flex justify-center items-center gap-2">
          <ShieldCheck size={16} />
          Verified professional workspace
        </div>
      </div>
    </div>
  );
}
