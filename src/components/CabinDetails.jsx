import axios from "axios";
import {
  Armchair,
  ArrowLeft,
  ArrowRight,
  Bath,
  Bus,
  Car,
  CheckCircle,
  Clock,
  Coffee,
  Globe,
  Lock,
  MapPin,
  Monitor,
  Printer,
  ShieldCheck,
  Star,
  Users,
  Wifi,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UsersNavbar from "./UsersNavbar";

export default function CabinDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [cabin, setCabin] = useState(null);
  const [relatedCabins, setRelatedCabins] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);

  const getImageUrl = (img) => {
    if (!img) return "";
    if (img.startsWith("http")) return img;
    return `http://localhost:5050/${img.replace(/\\/g, "/")}`;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      setLoading(true);
      try {
        const [cabinRes, spacesRes] = await Promise.all([
          axios.get(`http://localhost:5050/api/cabins/${id}`),
          axios.get("http://localhost:5050/api/cabins"),
        ]);
        setCabin(cabinRes.data);
        // Suggested cabins: excluding current one
        setRelatedCabins(spacesRes.data.filter((c) => c._id !== id).slice(0, 3));
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
      <div className="flex flex-col justify-center items-center h-screen bg-slate-50 gap-4">
        <div className="animate-spin w-14 h-14 border-t-4 border-emerald-600 border-r-transparent rounded-full"></div>
        <p className="text-slate-400 font-black tracking-widest uppercase text-xs">Synchronizing Details...</p>
      </div>
    );
  }

  const amenityMap = {
    wifi: { label: "Ultra-Fast Wi-Fi", icon: <Wifi size={20} /> },
    parking: { label: "Dedicated Parking", icon: <Car size={20} /> },
    lockers: { label: "Secure Lockers", icon: <Lock size={20} /> },
    privateWashroom: { label: "Executive Washroom", icon: <Bath size={20} /> },
    secureAccess: { label: "Biometric Access", icon: <ShieldCheck size={20} /> },
    comfortSeating: { label: "Ergonomic Chairs", icon: <Armchair size={20} /> },
  };

  const activeAmenities = Object.keys(cabin.amenities || {}).filter(
    (key) => cabin.amenities[key]
  );

  return (
    <div className="min-h-screen bg-[#fcfdfe] font-sans selection:bg-emerald-100 selection:text-emerald-900 pb-32">
      <UsersNavbar />

      <div className="max-w-[1400px] mx-auto px-6 pt-32">
        {/* Breadcrumb / Back */}
        <div className="mb-10 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-3 text-slate-400 hover:text-emerald-600 transition-all font-black uppercase text-[10px] tracking-widest"
          >
            <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-emerald-200 group-hover:bg-emerald-50 transition-all">
              <ArrowLeft size={14} />
            </div>
            Back to Discovery
          </button>
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
            <span className="text-slate-400">TimelySpaces</span> / <span className="text-slate-400">Elite</span> / <span className="text-emerald-600">{cabin.name}</span>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

          {/* Left Column: Images & Identity */}
          <div className="lg:col-span-7 space-y-10">
            <div className="group relative aspect-[16/10] bg-slate-100 rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-200 border border-slate-100">
              <img
                src={getImageUrl(cabin.images?.[activeImage])}
                alt={cabin.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]"
                onError={(e) =>
                  (e.target.src = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200")
                }
              />

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-60"></div>

              <div className="absolute bottom-10 left-10 right-10 flex items-end justify-between gap-6 pointer-events-none">
                <div className="pointer-events-auto">
                  <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/90 text-white text-[10px] font-black uppercase tracking-[0.2em] mb-4 shadow-xl">
                    Premium Suite
                  </span>
                  <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-2xl uppercase italic">
                    {cabin.name}
                  </h1>
                </div>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {cabin.images?.length > 1 && (
              <div className="flex gap-6 overflow-x-auto pb-4 px-2 no-scrollbar">
                {cabin.images.map((img, index) => (
                  <div
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`relative flex-shrink-0 w-32 h-24 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border-2 ${activeImage === index ? "border-emerald-500 scale-105 shadow-lg shadow-emerald-100" : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                  >
                    <img src={getImageUrl(img)} className="w-full h-full object-cover" alt="" />
                  </div>
                ))}
              </div>
            )}

            {/* Description Card */}
            <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-100/50">
              <h3 className="text-xs font-black text-emerald-600 uppercase tracking-[0.2em] mb-8">About the Environment</h3>
              <p className="text-xl text-slate-800 font-light leading-relaxed mb-10">
                {cabin.description || "A meticulously curated executive workspace featuring premium ergonomics, industrial acoustic treatment, and state-of-the-art digital infrastructure designed for maximum cognitive performance."}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-10 border-t border-slate-50">
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Primary Address</span>
                  <div className="flex items-start gap-2 text-slate-700 font-bold">
                    <MapPin size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>{cabin.address}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Strategic Seating</span>
                  <div className="flex items-center gap-2 text-slate-700 font-bold">
                    <Users size={16} className="text-emerald-500" />
                    <span>{cabin.capacity} Executive Placements</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Access Protocol</span>
                  <div className="flex items-center gap-2 text-slate-700 font-bold">
                    <Clock size={16} className="text-emerald-500" />
                    <span>24/7 Priority Entry</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Features & CTA */}
          <div className="lg:col-span-1"></div> {/* Spacer */}

          <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit space-y-8">
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl shadow-emerald-900/10 border border-emerald-500/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl -mr-16 -mt-16"></div>

              <div className="relative z-10 mb-10">
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em] block mb-2">Investment Detail</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black">₹{cabin.price}</span>
                  <span className="text-slate-500 font-bold">/ MONTH</span>
                </div>
              </div>

              <div className="space-y-6 mb-12">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 pb-4 border-b border-white/5">Workspace Features</h4>
                <div className="space-y-4">
                  {activeAmenities.map((key) => (
                    <div key={key} className="flex items-center gap-4 group">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                        {amenityMap[key].icon}
                      </div>
                      <span className="text-sm font-bold text-slate-300 tracking-tight">{amenityMap[key].label}</span>
                      <CheckCircle size={14} className="ml-auto text-emerald-500/30" />
                    </div>
                  ))}
                  {activeAmenities.length === 0 && <p className="text-slate-500 italic text-sm">Standard Executive amenities apply.</p>}
                </div>
              </div>

              <button
                onClick={() => navigate(`/book/${cabin._id}`)}
                className="w-full py-6 rounded-3xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-lg transition-all active:scale-95 shadow-2xl shadow-emerald-500/20 flex items-center justify-center gap-3 group"
              >
                Book Workspace <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <p className="mt-8 text-center text-slate-500 font-bold text-[10px] uppercase tracking-widest">Instant Activation after Approval</p>
            </div>

            <div className="bg-emerald-50 rounded-3xl p-8 border border-emerald-100 flex items-center gap-6">
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-emerald-600">
                <ShieldCheck size={28} />
              </div>
              <div>
                <h5 className="font-black text-emerald-900 text-sm tracking-tight uppercase">Verified Space</h5>
                <p className="text-emerald-700/70 text-xs font-bold leading-relaxed">This property has been vetted for enterprise compliance.</p>
              </div>
            </div>
          </div>
        </div>

        {/* RELATED SPACES SECTION */}
        {relatedCabins.length > 0 && (
          <div className="mt-40">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
              <div>
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] block mb-4">Discovery Engine</span>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Suggested <span className="text-emerald-600">Continuations</span></h2>
              </div>
              <button
                onClick={() => navigate("/spaces")}
                className="flex items-center gap-2 font-black text-xs text-slate-400 uppercase tracking-widest hover:text-emerald-600 transition-colors"
              >
                View All Catalogue <ArrowRight size={14} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {relatedCabins.map((rc) => (
                <div
                  key={rc._id}
                  onClick={() => navigate(`/cabin/${rc._id}`)}
                  className="group bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-lg shadow-slate-100/50 hover:shadow-2xl transition-all duration-500 cursor-pointer"
                >
                  <div className="h-48 overflow-hidden relative">
                    <img src={getImageUrl(rc.images?.[0])} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" alt="" />
                    <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-lg text-[10px] font-black text-emerald-800 border border-white/20">
                      Available
                    </div>
                  </div>
                  <div className="p-8">
                    <h4 className="text-xl font-black text-slate-900 mb-2 truncate uppercase tracking-tight">{rc.name}</h4>
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-bold mb-6">
                      <MapPin size={14} /> {rc.address?.split(',')[0]}
                    </div>
                    <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                      <span className="text-2xl font-black text-slate-900">₹{rc.price}</span>
                      <div className="flex items-center gap-1.5 text-xs font-black text-emerald-600 uppercase tracking-widest">
                        Explore <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
