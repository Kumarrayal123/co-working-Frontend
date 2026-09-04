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
import SimpleUserNavbar from "./SimpleUserNavbar";
import "./Dashboard.css";

const API_URL = "https://spaceapi.iryax.com";
const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000";

const SiteVisit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // ✅ Get user data from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const admin = JSON.parse(localStorage.getItem("admin") || "null");
  
  // ✅ Determine user role
  const userRole = user?.role || admin?.role || null;
  const isAdmin = userRole === "admin";
  const isCabinOwner = userRole === "cabinOwner";
  const isRegularUser = userRole === "user";

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
      
      // ✅ ROLE BASED NAVIGATION AFTER BOOKING
      const userRole = currentUser?.role;
      
      if (userRole === "user") {
        console.log("👤 Regular user booking → Navigating to /userbooking");
        navigate("/userbooking");
      } else if (userRole === "cabinOwner") {
        console.log("🏪 Cabin Owner booking → Navigating to /mybookings");
        navigate("/mybookings");
      } else if (userRole === "admin") {
        console.log("👑 Admin booking → Navigating to /mybookings");
        navigate("/mybookings");
      } else {
        // Fallback for any other role
        console.log("⚠️ Unknown role → Navigating to /mybookings");
        navigate("/mybookings");
      }
      
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Scheduling failed. Please try again.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Function to render correct navbar based on role
  const renderNavbar = () => {
    if (isAdmin) {
      return <AdminNavbar />;
    } else if (isCabinOwner) {
      return <UsersNavbar />;
    } else if (isRegularUser) {
      return <SimpleUserNavbar />;
    } else {
      // Fallback - if no role found, show nothing or default
      return <UsersNavbar />;
    }
  };

  if (!cabin) {
    return (
      <div className="admin-dash">
        {renderNavbar()}
        <div className="admin-dash__loading">
          <div className="admin-dash__spinner" />
          <p className="admin-dash__loading-text">Preparing workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dash">
      {renderNavbar()}

      <main className="p-2 sm:p-4 lg:p-6">
        {/* Header matching attendance list style */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft size={18} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                Site Visit
              </h1>
              <p className="text-xs text-gray-500">Schedule a visit to this workspace</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full">
            <Calendar size={14} className="text-blue-600" />
            <span className="text-xs font-semibold text-blue-700">Visit</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
          {/* Left Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-28">
              <div className="h-48 sm:h-60 rounded-xl overflow-hidden mb-6 relative group">
                <img
                  src={getImageUrl(cabin.images?.[0])}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  alt=""
                  onError={(e) => {
                    e.target.src = PLACEHOLDER_IMAGE;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/30 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-semibold text-blue-700 shadow-sm border border-blue-100">
                  Premium
                </div>
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-1">
                {cabin.name}
              </h2>

              <div className="flex items-center gap-2 text-gray-500 text-sm font-semibold mb-6">
                <div className="p-1.5 bg-blue-50 rounded-lg">
                  <MapPin size={16} className="text-blue-600" />
                </div>
                {cabin.address}
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex flex-col justify-center">
                  <div className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">
                    Capacity Profile
                  </div>
                  <div className="font-bold text-gray-900 text-base flex items-center gap-1.5">
                    <Users size={18} className="text-blue-600" /> {cabin.capacity} <span className="text-[10px] text-gray-400 uppercase">Seats</span>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex flex-col justify-center">
                  <div className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">
                    Visit Cost
                  </div>
                  <div className="font-bold text-green-600 text-lg uppercase">
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
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6 sm:mb-8">
                  <div className="p-2.5 bg-blue-600 rounded-lg text-white">
                    <User size={18} />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">
                    Visitor Details
                  </h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-4 text-gray-400" size={18} />
                      <input
                        className="w-full pl-11 pr-4 py-3.5 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-semibold text-sm text-gray-900 placeholder:text-gray-300"
                        placeholder="e.g. John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Mobile Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-4 text-gray-400" size={18} />
                      <input
                        className="w-full pl-11 pr-4 py-3.5 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-semibold text-sm text-gray-900 placeholder:text-gray-300"
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
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6 sm:mb-8">
                  <div className="p-2.5 bg-blue-600 rounded-lg text-white">
                    <Calendar size={18} />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">
                    Visit Time Slot
                  </h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-500 mb-2 block uppercase tracking-wider px-1">Select Date</label>
                    <input
                      type="date"
                      className="w-full rounded-lg bg-gray-50 border border-gray-200 p-4 outline-none font-semibold text-sm text-gray-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
                      value={visitDate}
                      onChange={(e) => setVisitDate(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-500 mb-2 block uppercase tracking-wider px-1">Select Time</label>
                    <input
                      type="time"
                      className="w-full rounded-lg bg-gray-50 border border-gray-200 p-4 outline-none font-semibold text-sm text-gray-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
                      value={visitTime}
                      onChange={(e) => setVisitTime(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                disabled={loading}
                className={`w-full py-4 rounded-lg font-semibold text-sm uppercase tracking-wider flex justify-center items-center gap-3 transition-all ${loading
                  ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
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
          <div className="mt-8 border-t border-gray-200 pt-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Related Workspaces
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedCabins.map((rc) => (
                <div
                  key={rc._id}
                  onClick={() => navigate(`/cabin/${rc._id}`)}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-all duration-300 group overflow-hidden"
                >
                  <div className="h-44 overflow-hidden relative">
                    <img
                      src={getImageUrl(rc.images?.[0])}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      alt=""
                      onError={(e) => {
                        e.target.src = PLACEHOLDER_IMAGE;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] font-semibold text-blue-700 shadow-sm border border-blue-100">
                      Available
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <h4 className="text-sm font-semibold text-gray-900 truncate">
                      {rc.name}
                    </h4>

                    <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                      <MapPin size={12} />
                      {rc.address?.split(",")[0]}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-sm font-semibold text-gray-900">
                        ₹{rc.price}
                      </span>
                      <span className="text-[10px] font-semibold text-blue-600 group-hover:underline">
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