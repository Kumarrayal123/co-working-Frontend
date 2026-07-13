import axios from "axios";
import { ArrowRight, MapPin, Search, Users, Building2, Edit, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import { toast } from "react-toastify";
import "./Dashboard.css";

const API_URL = "http://62.72.29.27:5003";
const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000";

const AdminSpaces = () => {
  const [cabins, setCabins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_URL}/api/cabins`)
      .then((res) => {
        setCabins(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (cabinId) => {
    if (!window.confirm("Are you sure you want to delete this cabin?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/api/cabins/${cabinId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Cabin deleted successfully");
      setCabins(cabins.filter(c => c._id !== cabinId));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete cabin");
    }
  };

  const filteredCabins = cabins.filter(cabin =>
    cabin.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cabin.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-dash">
      <AdminNavbar />

      <main className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="admin-dash__header">
          <div>
            <h1 className="admin-dash__greeting">
              All <span>Spaces</span>
            </h1>
            <p className="admin-dash__subtitle">
              Manage all coworking spaces and cabins in the platform.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search spaces..."
                className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        {loading ? (
          <div className="admin-dash__loading">
            <div className="admin-dash__spinner" />
            <p className="admin-dash__loading-text">Loading spaces...</p>
          </div>
        ) : filteredCabins.length === 0 ? (
          <div className="admin-dash__error" style={{ background: '#f8fafc', borderColor: '#e2e8f0' }}>
            <Building2 size={48} className="text-slate-300 mb-4" />
            <p className="admin-dash__error-title" style={{ color: '#475569' }}>No spaces found</p>
            <p className="admin-dash__error-message">We couldn't find any cabins matching "{searchTerm}".</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCabins.map((cabin) => (
              <div
                key={cabin._id}
                className="admin-dash__card group flex flex-col h-full hover:shadow-lg transition-all duration-300"
              >
                {/* Image Section */}
                <div className="relative h-48 overflow-hidden rounded-t-2xl">
                  <div className="absolute inset-0 bg-slate-200 animate-pulse" />
                  <img
                    src={cabin.images?.[0] ? `${API_URL}/${cabin.images[0].replace(/\\/g, "/")}` : PLACEHOLDER_IMAGE}
                    alt={cabin.name}
                    className="w-full h-full object-cover relative z-10 group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = PLACEHOLDER_IMAGE;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent z-20 opacity-40" />

                  <div className="absolute top-3 right-3 z-30 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-indigo-700 shadow-sm flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                    Active
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5 flex flex-col flex-grow">
                  <div className="mb-4">
                    <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-1">Coworking Space</p>
                    <h3 className="text-base font-bold text-slate-900 leading-tight line-clamp-1">{cabin.name}</h3>
                  </div>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 bg-indigo-50 rounded-lg shrink-0 text-indigo-600">
                      <MapPin size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 line-clamp-1">{cabin.address?.split(',')[0] || "Location"}</p>
                      <p className="text-xs text-slate-500 line-clamp-1">{cabin.address}</p>
                    </div>
                  </div>

                  <p className="text-slate-500 text-xs leading-relaxed mb-4 line-clamp-2">
                    {cabin.description || "Experience a premium workspace designed for focus and collaboration, featuring modern amenities."}
                  </p>

                  <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-0.5">
                        <span className="text-xl font-bold text-slate-900">₹{cabin.price || '0'}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">/ Hour</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-medium text-slate-500 mt-0.5">
                        <Users size={10} />
                        {cabin.capacity} Seats
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/cabin/${cabin._id}`)}
                        className="h-10 w-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-colors"
                        title="View Details"
                      >
                        <ArrowRight size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(cabin._id)}
                        className="h-10 w-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors"
                        title="Delete Cabin"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminSpaces;
