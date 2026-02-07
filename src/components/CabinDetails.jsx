import axios from "axios";
import {
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
  Armchair
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UsersNavbar from "./UsersNavbar";
import AdminNavbar from "./AdminNavbar";

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
    return `http://localhost:5000/${img.replace(/\\/g, "/")}`;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      setLoading(true);
      try {
        const [cabinRes, allRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/cabins/${id}`),
          axios.get("http://localhost:5000/api/cabins"),
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

      <div className="max-w-6xl mx-auto px-6 pt-20">
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
            <div className="relative overflow-hidden rounded-2xl h-[340px] lg:h-[400px]">
              <img
                src={getImageUrl(cabin.images?.[activeImage])}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                alt={cabin.name}
              />
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
                  />
                ))}
              </div>
            )}
          </div>

          {/* RIGHT DETAILS */}
          <div className="flex flex-col justify-center space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 leading-tight mb-2">
                {cabin.name}
              </h1>
              <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                <MapPin size={16} className="text-emerald-500" />
                {cabin.address}
              </div>
            </div>

            <p className="text-slate-600 text-sm leading-relaxed">
              {cabin.description || "Experience a premium workspace designed for maximum productivity and comfort."}
            </p>

            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-slate-900">₹{cabin.price}</span>
              <span className="text-sm text-slate-500 font-medium">/ hour</span>
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
                      className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100"
                    >
                      {Icon && (
                        <Icon size={16} className="text-emerald-600" />
                      )}
                      <span className="text-xs font-semibold text-slate-700">
                        {amenityMap[key]?.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* INFO & BOOK */}
            <div className="pt-6 border-t border-slate-100 flex flex-col gap-6">
              <div className="flex gap-6 text-xs font-semibold text-slate-600">
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-slate-400" /> {cabin.capacity} Seats
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-slate-400" /> 24/7 Access
                </div>
              </div>

              <button
                onClick={() => navigate(`/book/${cabin._id}`)}
                className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold text-lg hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/20 active:scale-95"
              >
                Book Workspace
              </button>
            </div>
          </div>
        </div>

        {/* RELATED */}
        {relatedCabins.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-bold text-slate-900 mb-8 tracking-tight">
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
                    />
                  </div>
                  <div className="p-5 space-y-1">
                    <h4 className="font-bold text-slate-900 text-lg truncate">
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
