
import axios from "axios";
import {
  Calendar,
  Clock,
  IndianRupee,
  MapPin,
  Search,
  Ticket,
  User,
  Download,
  X,
  Calendar as CalendarIcon
} from "lucide-react";
import { useEffect, useState } from "react";
import AdminNavbar from "./AdminNavbar";
import "./Dashboard.css";
const API_URL = "http://localhost:5000";
const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000";


const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");

  // Safe parsing for localStorage
  // Check for User OR Admin
  const currentUser = (() => {
    try {
      const u = localStorage.getItem("user");
      const a = localStorage.getItem("admin");
      if (u) return JSON.parse(u);
      if (a) return JSON.parse(a);
      return null;
    } catch (err) {
      return null;
    }
  })();

  const userId = currentUser?._id || currentUser?.id;

  const getImageUrl = (img) => {
    if (!img) return PLACEHOLDER_IMAGE;
    if (img.startsWith("http")) return img;
    const cleanPath = img.replace(/\\/g, "/").replace(/^\/+/, "");
    return `${API_URL}/${cleanPath}`;
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const isAdmin = localStorage.getItem("admin") !== null;
        const endpoint = isAdmin ? `${API_URL}/api/bookings` : `${API_URL}/api/bookings/user`;

        const res = await axios.get(
          endpoint,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBookings(res.data.bookings || []);
      } catch (error) {
        console.error("API ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch = b.cabinId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          b.cabinId?.address?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = filterDate ? b.startDate === filterDate : true;
    return matchesSearch && matchesDate;
  });

  const downloadData = () => {
    if (filteredBookings.length === 0) return;
    
    const headers = ["Cabin Name", "Address", "Start Date", "Start Time", "End Date", "End Time", "Total Hours", "Total Price", "Status"];
    const csvRows = [headers.join(",")];
    
    filteredBookings.forEach(b => {
      const row = [
        `"${b.cabinId?.name || ''}"`,
        `"${b.cabinId?.address || ''}"`,
        b.startDate,
        b.startTime,
        b.endDate,
        b.endTime,
        b.totalHours || 0,
        b.totalPrice,
        "Confirmed"
      ];
      csvRows.push(row.join(","));
    });
    
    const blob = new Blob([csvRows.join("\n")], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'my-bookings.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (loading)
    return (
      <div className="admin-dash">
        <AdminNavbar />
        <div className="admin-dash__loading">
          <div className="admin-dash__spinner" />
          <p className="admin-dash__loading-text">Loading bookings...</p>
        </div>
      </div>
    );

  return (
    <div className="admin-dash">
      <AdminNavbar />

      <main className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="admin-dash__header">
          <div>
            <h1 className="admin-dash__greeting">
              {localStorage.getItem('admin') ? 'Admin' : 'My'} <span>Bookings</span>
            </h1>
            <p className="admin-dash__subtitle">
              Manage your workspace reservations and bookings.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all w-64"
              />
            </div>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            {(searchTerm || filterDate) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterDate("");
                }}
                className="p-2.5 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 transition-colors"
                title="Clear Filters"
              >
                <X size={18} />
              </button>
            )}
            <button
              onClick={downloadData}
              disabled={filteredBookings.length === 0}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download size={16} />
              Download CSV
            </button>
          </div>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="admin-dash__error" style={{ background: '#f8fafc', borderColor: '#e2e8f0' }}>
            <CalendarIcon size={48} className="text-slate-300 mb-4" />
            <p className="admin-dash__error-title" style={{ color: '#475569' }}>No bookings found</p>
            <p className="admin-dash__error-message">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((b) => (
              <div
                key={b._id}
                className="admin-dash__card group flex flex-col sm:flex-row gap-4 hover:shadow-lg transition-all duration-300"
              >
                {/* Image */}
                <div className="w-full sm:w-36 h-32 rounded-2xl overflow-hidden relative shrink-0">
                  <img
                    src={getImageUrl(b.cabinId?.images?.[0])}
                    alt="cabin"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = PLACEHOLDER_IMAGE;
                    }}
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                </div>

                {/* Content */}
                <div className="flex-1 py-4 pr-3 flex flex-col justify-center">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h2 className="text-base font-bold text-slate-900 leading-tight">
                        {b.cabinId?.name}
                      </h2>
                      <div className="flex items-center gap-1 text-slate-500 text-xs font-medium mt-0.5">
                        <MapPin size={12} className="text-indigo-500" />
                        {b.cabinId?.address}
                      </div>
                    </div>
                    <div className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-indigo-100">
                      Confirmed
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Start</p>
                      <div className="flex items-center gap-1.5 text-slate-900 font-semibold text-xs">
                        <Calendar size={12} className="text-indigo-500" />
                        {b.startDate} <span className="text-slate-300 text-[10px]">|</span> {b.startTime}
                      </div>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">End</p>
                      <div className="flex items-center gap-1.5 text-slate-900 font-semibold text-xs">
                        <Clock size={12} className="text-indigo-500" />
                        {b.endDate} <span className="text-slate-300 text-[10px]">|</span> {b.endTime}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                        <User size={14} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-tight">
                          {b.name || currentUser?.name || "Member"}
                        </span>
                        <div className="flex items-center gap-1 mt-0.5 text-[10px] font-medium text-slate-500">
                           <svg viewBox="0 0 24 24" width="10" height="10" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.0 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                          {b.mobile || "No Mobile Provided"}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-0.5 mt-auto">
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        {b.totalHours || 0} Hrs
                      </div>
                      <div className="flex items-center gap-0.5 text-slate-900 font-bold text-base">
                        <IndianRupee size={16} className="text-indigo-600" />
                        {b.totalPrice?.toLocaleString("en-IN")}
                      </div>
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

export default MyBookings;
