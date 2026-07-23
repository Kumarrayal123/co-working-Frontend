import axios from "axios";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  MapPin,
  Phone,
  User,
  Users
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import UsersNavbar from "./UsersNavbar";
import AdminNavbar from "./AdminNavbar";
import "./Dashboard.css";

const API_URL = "http://localhost:5003";
const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000";

const SiteVisit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem("admin") !== null;

  const [cabin, setCabin] = useState(null);
  const [relatedCabins, setRelatedCabins] = useState([]);

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [visitTime, setVisitTime] = useState("");
  const [loading, setLoading] = useState(false);

  const getImageUrl = (img) => {
    if (!img) return PLACEHOLDER_IMAGE;
    if (img.startsWith("http")) return img;
    const cleanPath = img.replace(/\\/g, "/").replace(/^\/+/, "");
    return `${API_URL}/${cleanPath}`;
  };

  /* FETCH DATA */
  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      try {
        const [cabinRes, spacesRes] = await Promise.all([
          axios.get(`${API_URL}/api/cabins/${id}`),
          axios.get(`${API_URL}/api/cabins`),
        ]);
        setCabin(cabinRes.data);
        setRelatedCabins(
          spacesRes.data.filter((c) => c._id !== id).slice(0, 3)
        );
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [id]);

  /* SCHEDULE VISIT */
  const handleSiteVisit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const userStr = localStorage.getItem("user");
    const adminStr = localStorage.getItem("admin");

    let currentUser = null;
    if (userStr) currentUser = JSON.parse(userStr);
    else if (adminStr) currentUser = JSON.parse(adminStr);

    const userId = currentUser?._id || currentUser?.id;

    if (!userId) {
      toast.error("Please log in to schedule a site visit.");
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        `${API_URL}/api/bookings/createvisit/${userId}`,
        {
          cabinId: id,
          name,
          mobile,
          email: currentUser?.email || "",
          startDate: visitDate,
          startTime: visitTime,
        }
      );
      toast.success("Site visit scheduled successfully!");
      navigate("/mybookings");
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Scheduling failed. Please try again.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!cabin) {
    return (
      <div className="admin-dash">
        {isAdmin ? <AdminNavbar /> : <UsersNavbar />}
        <div className="admin-dash__loading">
          <div className="admin-dash__spinner" />
          <p className="admin-dash__loading-text">Preparing workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dash">
      {isAdmin ? <AdminNavbar /> : <UsersNavbar />}

      <main className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16">
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-slate-400 hover:text-[#007A52] mb-6 transition-colors"
        >
          <ArrowLeft size={14} /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
          {/* Left Summary */}
          <div className="lg:col-span-5">
            <div className="admin-dash__card p-6 sticky top-28">
              <div className="h-48 sm:h-60 rounded-2xl overflow-hidden mb-6 relative group">
                <img
                  src={getImageUrl(cabin.images?.[0])}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  alt=""
                  onError={(e) => {
                    e.target.src = PLACEHOLDER_IMAGE;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-[#007A52] shadow-sm">
                  Premium
                </div>
              </div>

              <h2 className="text-xl font-bold uppercase text-slate-900 mb-1">
                {cabin.name}
              </h2>

              <div className="flex items-center gap-2 text-slate-500 text-sm font-semibold mb-6">
                <div className="p-1.5 bg-emerald-50 rounded-lg">
                  <MapPin size={16} className="text-[#007A52]" />
                </div>
                {cabin.address}
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-4 bg-emerald-50/20 rounded-2xl border border-emerald-100 flex flex-col justify-center">
                  <div className="text-[10px] uppercase tracking-[0.1em] text-[#007A52] font-bold mb-1">
                    Capacity Profile
                  </div>
                  <div className="font-black text-slate-900 text-base flex items-center gap-1.5">
                    <Users size={18} className="text-[#007A52]" /> {cabin.capacity} <span className="text-[10px] text-slate-400 uppercase">Seats</span>
                  </div>
                </div>

                <div className="p-4 bg-emerald-50/20 rounded-2xl border border-emerald-100 flex flex-col justify-center">
                  <div className="text-[10px] uppercase tracking-[0.1em] text-[#007A52] font-bold mb-1">
                    Visit Cost
                  </div>
                  <div className="font-black text-emerald-700 text-lg uppercase">
                    Free
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="lg:col-span-7 space-y-6">
            <form onSubmit={handleSiteVisit} className="space-y-6">
              {/* User */}
              <div className="admin-dash__card p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6 sm:mb-8">
                  <div className="p-2.5 bg-[#007A52] rounded-xl text-white shadow-lg">
                    <User size={20} />
                  </div>
                  <h3 className="text-base sm:text-lg font-black uppercase text-slate-900 tracking-tight">
                    Visitor Details
                  </h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-4 text-slate-400" size={18} />
                      <input
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#007A52] focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all font-semibold text-sm text-slate-900 placeholder:text-slate-300"
                        placeholder="e.g. John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Mobile Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-4 text-slate-400" size={18} />
                      <input
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#007A52] focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all font-semibold text-sm text-slate-900 placeholder:text-slate-300"
                        placeholder="e.g. +91 9876543210"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Schedule */}
              <div className="admin-dash__card p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6 sm:mb-8">
                  <div className="p-2.5 bg-[#007A52] rounded-xl text-white shadow-lg">
                    <Calendar size={20} />
                  </div>
                  <h3 className="text-base sm:text-lg font-black uppercase text-slate-900 tracking-tight">
                    Visit Time Slot
                  </h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-500 mb-2 block uppercase tracking-widest px-1">Select Date</label>
                    <input
                      type="date"
                      className="w-full rounded-xl bg-slate-50 border border-slate-200 p-4 outline-none font-bold text-sm text-slate-900 focus:bg-white focus:border-[#007A52] focus:ring-2 focus:ring-emerald-500/20 transition-all cursor-pointer"
                      value={visitDate}
                      onChange={(e) => setVisitDate(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-500 mb-2 block uppercase tracking-widest px-1">Select Time</label>
                    <input
                      type="time"
                      className="w-full rounded-xl bg-slate-50 border border-slate-200 p-4 outline-none font-bold text-sm text-slate-900 focus:bg-white focus:border-[#007A52] focus:ring-2 focus:ring-emerald-500/20 transition-all cursor-pointer"
                      value={visitTime}
                      onChange={(e) => setVisitTime(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                disabled={loading}
                className={`w-full py-4 rounded-xl font-bold text-sm uppercase tracking-[0.1em] flex justify-center items-center gap-3 transition-all shadow-lg active:scale-[0.98] ${loading
                  ? "bg-slate-100 text-slate-300 cursor-not-allowed"
                  : "bg-[#007A52] text-white hover:bg-emerald-700 shadow-emerald-500/20"
                  }`}
              >
                {loading ? "Scheduling Visit…" : "Confirm Visit"}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>
          </div>
        </div>

        {/* Related */}
        {relatedCabins.length > 0 && (
          <div className="mt-16 border-t border-slate-200 pt-12">
            <h2 className="text-xl sm:text-2xl font-bold uppercase text-slate-900 mb-6 sm:mb-8 tracking-tight">
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
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      alt=""
                      onError={(e) => {
                        e.target.src = PLACEHOLDER_IMAGE;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-[#007A52] shadow-sm">
                      Available
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <h4 className="text-base font-bold uppercase text-slate-900 truncate">
                      {rc.name}
                    </h4>

                    <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                      <MapPin size={14} />
                      {rc.address?.split(",")[0]}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <span className="text-base font-bold text-slate-900">
                        ₹{rc.price}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#007A52] group-hover:underline">
                        View
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SiteVisit;
