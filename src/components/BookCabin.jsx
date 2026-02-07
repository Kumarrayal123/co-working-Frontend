import axios from "axios";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  ShieldCheck,
  User,
  Users,
  History
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import UsersNavbar from "./UsersNavbar";
import AdminNavbar from "./AdminNavbar";

const BookCabin = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const PRICE_PER_HOUR = 5000;

  const [cabin, setCabin] = useState(null);
  const [relatedCabins, setRelatedCabins] = useState([]);

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");

  const [totalHours, setTotalHours] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [availabilityError, setAvailabilityError] = useState("");
  const [loading, setLoading] = useState(false);

  const getImageUrl = (img) => {
    if (!img) return "";
    if (img.startsWith("http")) return img;
    return `http://localhost:5000/${img.replace(/\\/g, "/")}`;
  };

  /* FETCH DATA */
  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      try {
        const [cabinRes, spacesRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/cabins/${id}`),
          axios.get("http://localhost:5000/api/cabins"),
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

  /* PRICE CALC */
  useEffect(() => {
    if (startDate && startTime && endDate && endTime) {
      const start = new Date(`${startDate}T${startTime}`);
      const end = new Date(`${endDate}T${endTime}`);

      if (end <= start) {
        setTotalHours(0);
        setTotalPrice(0);
        return;
      }

      const hours = Math.ceil((end - start) / (1000 * 60 * 60));
      setTotalHours(hours);
      setTotalPrice(hours * PRICE_PER_HOUR);
      setAvailabilityError("");
    }
  }, [startDate, startTime, endDate, endTime]);

  /* BOOK */
  const handleBooking = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Check for User OR Admin
    const userStr = localStorage.getItem("user");
    const adminStr = localStorage.getItem("admin");

    let currentUser = null;
    if (userStr) currentUser = JSON.parse(userStr);
    else if (adminStr) currentUser = JSON.parse(adminStr);

    // Normalize ID (Admin login returns 'id', User might use '_id')
    const userId = currentUser?._id || currentUser?.id;

    if (!userId) {
      toast.error("Please log in to book a cabin.");
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        `http://localhost:5000/api/bookings/createbooking/${userId}`,
        {
          cabinId: id,
          name,
          mobile,
          startDate,
          startTime,
          endDate,
          endTime,
          totalHours,
          totalPrice,
        }
      );
      toast.success("Booking confirmed successfully!");
      navigate("/mybookings");
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Selected slot is not available. Please try another time.";
      setAvailabilityError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!cabin) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50 text-slate-400 font-bold text-sm">
        Preparing workspace...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
      {/* <UsersNavbar /> */}
      <AdminNavbar/>

      <div className="max-w-6xl mx-auto px-6 pt-16">
        {/* HEADER */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-slate-400 hover:text-emerald-600 mb-8 transition-colors"
        >
          <ArrowLeft size={14} /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* LEFT SUMMARY */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 sticky top-28">
              <div className="h-60 rounded-2xl overflow-hidden mb-6 relative">
                <img
                  src={getImageUrl(cabin.images?.[0])}
                  className="w-full h-full object-cover"
                  alt=""
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-emerald-800">
                  Premium
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mb-1">
                {cabin.name}
              </h2>

              <div className="flex items-center gap-2 text-slate-500 text-sm mb-6">
                <MapPin size={16} className="text-emerald-500" /> {cabin.address}
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">
                    Capacity
                  </div>
                  <div className="flex items-center gap-1.5 font-bold text-slate-700 text-sm">
                    <Users size={14} /> {cabin.capacity} Seats
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                  <div className="text-[10px] uppercase tracking-widest text-emerald-700 font-bold mb-1">
                    Rate
                  </div>
                  <div className="font-bold text-slate-900 text-sm">
                    ₹{PRICE_PER_HOUR} / hr
                  </div>
                </div>
              </div>

              {/* <div className="flex items-center gap-3 pt-5 border-t border-slate-100 text-slate-500 text-xs font-medium">
                <ShieldCheck size={16} className="text-emerald-600" />
                Verified professional workspace
              </div> */}
            </div>
          </div>

          {/* RIGHT FORM */}
          <div className="lg:col-span-7 space-y-6">
            <form onSubmit={handleBooking} className="space-y-6">
              {/* USER */}
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                <h3 className="font-bold uppercase text-xs tracking-widest text-slate-900 mb-6">
                  Registrant Details
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="relative">
                    <User className="absolute left-4 top-4 text-slate-400" size={18} />
                    <input
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-emerald-500/20 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium text-sm text-slate-900 placeholder:text-slate-400"
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="relative">
                    <History className="absolute left-4 top-4 text-slate-400" size={18} />
                    <input
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-emerald-500/20 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium text-sm text-slate-900 placeholder:text-slate-400"
                      placeholder="Mobile Number"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* SCHEDULE */}
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                <h3 className="font-bold uppercase text-xs tracking-widest text-slate-900 mb-6">
                  Temporal Allocation
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-2 block uppercase tracking-wider">Start</label>
                    <div className="flex gap-2">
                      <input
                        type="date"
                        className="flex-1 rounded-xl bg-slate-50 p-3.5 outline-none font-medium text-sm text-slate-700 focus:ring-2 focus:ring-emerald-500/20"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                      />
                      <input
                        type="time"
                        className="w-28 rounded-xl bg-slate-50 p-3.5 outline-none font-medium text-sm text-slate-700 focus:ring-2 focus:ring-emerald-500/20"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-2 block uppercase tracking-wider">End</label>
                    <div className="flex gap-2">
                      <input
                        type="date"
                        className="flex-1 rounded-xl bg-slate-50 p-3.5 outline-none font-medium text-sm text-slate-700 focus:ring-2 focus:ring-emerald-500/20"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                      />
                      <input
                        type="time"
                        className="w-28 rounded-xl bg-slate-50 p-3.5 outline-none font-medium text-sm text-slate-700 focus:ring-2 focus:ring-emerald-500/20"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* PRICE */}
              {totalHours > 0 && (
                <div className="bg-slate-900 text-white rounded-[2rem] p-8 shadow-xl shadow-slate-900/10">
                  <div className="flex justify-between items-center text-sm text-slate-400 mb-2 font-medium">
                    <span>{totalHours} hrs × ₹{PRICE_PER_HOUR}</span>
                    <span className="uppercase tracking-widest text-[10px] font-bold bg-white/10 px-2 py-1 rounded">Billable</span>
                  </div>
                  <div className="text-4xl font-bold tracking-tight">
                    ₹{totalPrice.toLocaleString("en-IN")}
                  </div>
                </div>
              )}

              {availabilityError && (
                <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm font-semibold border border-red-100 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  {availabilityError}
                </div>
              )}

              <button
                disabled={loading}
                className={`w-full py-4 rounded-xl font-bold text-lg flex justify-center items-center gap-2 transition-all shadow-lg ${loading
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                  : "bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-600/20 hover:shadow-emerald-600/30 active:scale-95"
                  }`}
              >
                {loading ? "Processing…" : "Confirm Booking"}
                {!loading && <ArrowRight size={20} />}
              </button>
            </form>
          </div>
        </div>

        {/* RELATED */}
        {relatedCabins.length > 0 && (
          <div className="mt-24 border-t border-slate-200 pt-16">
            <h2 className="text-2xl font-bold text-slate-900 mb-8 tracking-tight">
              Related Workspaces
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedCabins.map((rc) => (
                <div
                  key={rc._id}
                  onClick={() => navigate(`/cabin/${rc._id}`)}
                  className="bg-white rounded-[1.5rem] overflow-hidden cursor-pointer
                             border border-slate-100
                             hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1
                             transition-all duration-300 group"
                >
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={getImageUrl(rc.images?.[0])}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      alt=""
                    />
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                  </div>

                  <div className="p-5 space-y-2">
                    <h4 className="text-lg font-bold text-slate-900 truncate">
                      {rc.name}
                    </h4>

                    <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                      <MapPin size={14} />
                      {rc.address?.split(",")[0]}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                      <span className="text-lg font-bold text-slate-900">
                        ₹{rc.price}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 group-hover:underline">
                        View
                      </span>
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
};

export default BookCabin;
