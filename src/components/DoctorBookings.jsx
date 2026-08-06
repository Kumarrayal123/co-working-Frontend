// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import UsersNavbar from "./UsersNavbar";
// import { Calendar, User, Phone, MapPin, Clock, IndianRupee, X, ShieldCheck, Search, Filter } from "lucide-react";

// const DoctorBookings = () => {
//     const [bookings, setBookings] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     const fetchBookings = async () => {
//         setLoading(true);
//         setError(null);
//         try {
//             const token = localStorage.getItem("token");
//             const res = await axios.get("https://spaceapi.iryax.com/api/bookings/owner-bookings", {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             setBookings(res.data.bookings || []);
//         } catch (err) {
//             console.error("Error fetching bookings:", err);
//             setError(err.response?.data?.message || err.message || "Failed to fetch bookings");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchBookings();
//     }, []);

//     const user = JSON.parse(localStorage.getItem("user"));

//     return (
//         <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
//             <UsersNavbar />

//             <div className="flex-grow pt-32 pb-20 px-6">
//                 <div className="max-w-7xl mx-auto">

//                     {/* Header Section */}
//                     <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
//                         <div className="max-w-xl">
//                             <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-emerald-100">
//                                 Management Portal
//                             </span>
//                             <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight flex items-center gap-4">
//                                 Owner <span className="text-emerald-600">Analytics</span>
//                             </h1>
//                             <div className="mt-4 flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl text-[10px] text-slate-500 font-black uppercase tracking-widest w-fit border border-slate-200">
//                                 <User size={12} className="text-emerald-600" />
//                                 Host: {user?.name || "Verified Host"}
//                             </div>
//                         </div>

//                         <div className="flex items-center gap-4">
//                             <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-1">
//                                 <button className="p-2 bg-slate-900 text-white rounded-xl shadow-lg"><LayoutGrid size={18} /></button>
//                                 <button className="p-2 text-slate-400 hover:text-emerald-600 transition-colors"><Search size={18} /></button>
//                                 <button className="p-2 text-slate-400 hover:text-emerald-600 transition-colors"><Filter size={18} /></button>
//                             </div>
//                             <div className="bg-emerald-600 text-white px-6 py-4 rounded-[1.5rem] font-black text-sm shadow-xl shadow-emerald-200/50 flex flex-col items-center">
//                                 <span className="text-[10px] uppercase opacity-60 tracking-[0.1em] mb-1">Active Volume</span>
//                                 {bookings.length} Bookings
//                             </div>
//                         </div>
//                     </div>

//                     {loading ? (
//                         <div className="flex flex-col justify-center items-center py-40 gap-4">
//                             <div className="animate-spin h-14 w-14 border-t-4 border-emerald-600 border-r-transparent rounded-full font-black"></div>
//                             <p className="text-xs font-black uppercase tracking-widest text-slate-400">De-encrypting Transactional Data...</p>
//                         </div>
//                     ) : error ? (
//                         <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 p-20 text-center max-w-2xl mx-auto">
//                             <div className="mx-auto h-24 w-24 bg-red-50 rounded-[2rem] flex items-center justify-center mb-8">
//                                 <X size={48} className="text-red-500" />
//                             </div>
//                             <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4">Registry Error</h3>
//                             <p className="text-slate-500 font-light mb-10 leading-relaxed">{error}</p>
//                             <button
//                                 onClick={fetchBookings}
//                                 className="px-10 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-black transition-all shadow-xl shadow-slate-200 active:scale-95"
//                             >
//                                 Re-sync Dashboard
//                             </button>
//                         </div>
//                     ) : bookings.length === 0 ? (
//                         <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 p-20 text-center max-w-2xl mx-auto">
//                             <div className="mx-auto h-24 w-24 bg-emerald-50 rounded-[2rem] flex items-center justify-center mb-8">
//                                 <Calendar size={48} className="text-emerald-600" />
//                             </div>
//                             <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4">Quiet Workspace</h3>
//                             <p className="text-slate-500 font-light mb-10 leading-relaxed">No reservations have been recorded for your portfolio in the current cycle. Check your cabin visibility settings.</p>
//                             <button className="px-10 py-4 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-200 active:scale-95">Portfolio Review</button>
//                         </div>
//                     ) : (
//                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
//                             {bookings.map((booking) => (
//                                 <div key={booking._id} className="group bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-500 flex flex-col h-full hover:-translate-y-2">
//                                     <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex justify-between items-start">
//                                         <div className="space-y-1">
//                                             <h3 className="font-black text-xl text-slate-900 uppercase tracking-tight group-hover:text-emerald-700 transition-colors">
//                                                 {booking.cabinId?.name || "Premium Suite"}
//                                             </h3>
//                                             <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
//                                                 <MapPin size={12} className="text-emerald-500" />
//                                                 {booking.cabinId?.address?.split(',')[0]}
//                                             </div>
//                                         </div>
//                                         <div className="px-3 py-1 bg-white border border-slate-200 rounded-lg shadow-sm">
//                                             <ShieldCheck size={16} className="text-emerald-600" />
//                                         </div>
//                                     </div>

//                                     <div className="p-8 space-y-8 flex-grow">
//                                         {/* Customer Info */}
//                                         <div className="flex items-start gap-5">
//                                             <div className="w-12 h-12 bg-white rounded-2xl border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
//                                                 <User size={20} strokeWidth={2.5} />
//                                             </div>
//                                             <div className="space-y-1">
//                                                 <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Subscriber</p>
//                                                 <p className="font-black text-slate-900 text-lg uppercase tracking-tight leading-none">{booking.userId?.name || "Private Client"}</p>
//                                                 <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold mt-2">
//                                                     <Phone size={12} />
//                                                     <span>{booking.userId?.mobile || "Encrypted"}</span>
//                                                 </div>
//                                             </div>
//                                         </div>

//                                         {/* Time Info */}
//                                         <div className="flex items-start gap-5">
//                                             <div className="w-12 h-12 bg-white rounded-2xl border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
//                                                 <Clock size={20} strokeWidth={2.5} />
//                                             </div>
//                                             <div className="space-y-3">
//                                                 <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Occupation Slot</p>
//                                                 <div className="flex flex-col gap-2">
//                                                     <div className="flex items-center gap-4">
//                                                         <div className="text-sm font-black text-slate-800">{booking.startDate}</div>
//                                                         <div className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md uppercase">{booking.startTime}</div>
//                                                     </div>
//                                                     <div className="w-4 h-px bg-slate-200 ml-2"></div>
//                                                     <div className="flex items-center gap-4">
//                                                         <div className="text-sm font-black text-slate-800">{booking.endDate}</div>
//                                                         <div className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md uppercase">{booking.endTime}</div>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     {/* Payment Info */}
//                                     <div className="p-8 bg-slate-50/80 border-t border-slate-100 flex justify-between items-center group-hover:bg-emerald-50 transition-colors">
//                                         <div>
//                                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Gross Yield</span>
//                                             <div className="flex items-center gap-1.5 text-emerald-700">
//                                                 <IndianRupee size={22} className="mb-1" />
//                                                 <span className="font-black text-3xl tracking-tighter">{booking.totalPrice?.toLocaleString("en-IN") || "0"}</span>
//                                             </div>
//                                         </div>
//                                         <div className="text-right">
//                                             <div className="text-xs font-black text-slate-900 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm">
//                                                 {booking.totalHours || '0'} hr Cycle
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// const LayoutGrid = ({ size }) => (
//     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//         <rect x="3" y="3" width="7" height="7"></rect>
//         <rect x="14" y="3" width="7" height="7"></rect>
//         <rect x="14" y="14" width="7" height="7"></rect>
//         <rect x="3" y="14" width="7" height="7"></rect>
//     </svg>
// );

// export default DoctorBookings;



import React, { useEffect, useState } from "react";
import axios from "axios";
import UsersNavbar from "./UsersNavbar";
import {
  Calendar,
  User,
  Phone,
  MapPin,
  Clock,
  IndianRupee,
  Search,
  X,
  Calendar as CalendarIcon,
  Building2,
  Filter,
  Crown,
  Stethoscope,
  Layout
} from "lucide-react";
import "./Dashboard.css";

// ─── HELPER: Format date to dd/mm/yyyy ───
const formatDateToDDMMYYYY = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "N/A";
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// ─── FORMAT TIME ───
const formatTime = (timeString) => {
  if (!timeString) return "N/A";
  const [hours, minutes] = timeString.split(':');
  const h = parseInt(hours);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${minutes} ${ampm}`;
};

const DoctorBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterType, setFilterType] = useState("all"); // all, normal, exclusive, chamber

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "https://spaceapi.iryax.com/api/bookings/owner-bookings",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBookings(res.data.bookings || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch = 
      b.cabinId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      b.cabinId?.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.cabinId?.cabin?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = filterDate ? b.startDate === filterDate : true;
    
    // Filter by cabin type
    let matchesType = true;
    if (filterType === "normal") {
      matchesType = b.cabinId?.cabinType === "normal";
    } else if (filterType === "exclusive") {
      matchesType = b.cabinId?.cabinType === "exclusive";
    } else if (filterType === "chamber") {
      matchesType = b.cabinId?.isChamber === true;
    }
    
    return matchesSearch && matchesDate && matchesType;
  });

  // ─── CLEAR FILTERS ───
  const clearFilters = () => {
    setSearchTerm("");
    setFilterDate("");
    setFilterType("all");
  };

  const getCabinTypeBadge = (cabin) => {
    if (!cabin) return null;
    
    if (cabin.isChamber) {
      return {
        label: "Chamber",
        icon: Stethoscope,
        className: "bg-rose-100 text-rose-700"
      };
    }
    
    if (cabin.cabinType === "exclusive") {
      return {
        label: "Exclusive",
        icon: Crown,
        className: "bg-amber-100 text-amber-700"
      };
    }
    
    return {
      label: "Normal",
      icon: Layout,
      className: "bg-blue-100 text-blue-700"
    };
  };

  const totalBookings = bookings.length;
  const normalCount = bookings.filter(b => b.cabinId?.cabinType === "normal" && !b.cabinId?.isChamber).length;
  const exclusiveCount = bookings.filter(b => b.cabinId?.cabinType === "exclusive" && !b.cabinId?.isChamber).length;
  const chamberCount = bookings.filter(b => b.cabinId?.isChamber === true).length;

  return (
    <div className="admin-dash">
      <UsersNavbar />

      <main className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="admin-dash__header">
          <div>
            <h1 className="admin-dash__greeting">
              Cabin <span>Bookings</span>
            </h1>
            <p className="admin-dash__subtitle">
              A live overview of reservations across your listed cabins
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Bookings</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{totalBookings}</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Normal</p>
            <p className="text-2xl font-black text-blue-600 mt-1">{normalCount}</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Exclusive</p>
            <p className="text-2xl font-black text-amber-600 mt-1">{exclusiveCount}</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Chamber</p>
            <p className="text-2xl font-black text-rose-600 mt-1">{chamberCount}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all w-48"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none cursor-pointer min-w-[160px]"
              >
                <option value="all">All Types</option>
                <option value="normal">Normal</option>
                <option value="exclusive">Exclusive</option>
                <option value="chamber">Chamber</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>

            {(searchTerm || filterDate || filterType !== "all") && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors text-sm font-medium"
              >
                <X size={18} />
                Clear Filters
              </button>
            )}

            <div className="ml-auto px-4 py-2 bg-indigo-50 border border-indigo-200 rounded-xl">
              <p className="text-[10px] uppercase font-bold text-indigo-500 tracking-wider leading-none mb-1">Found</p>
              <p className="text-lg font-black text-indigo-700 leading-none">
                {filteredBookings.length}
              </p>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="admin-dash__loading">
            <div className="admin-dash__spinner" />
            <p className="admin-dash__loading-text">Loading bookings...</p>
          </div>
        )}

        {/* Empty */}
        {!loading && filteredBookings.length === 0 && (
          <div className="admin-dash__error" style={{ background: '#f8fafc', borderColor: '#e2e8f0' }}>
            <CalendarIcon size={48} className="text-slate-300 mb-4" />
            <p className="admin-dash__error-title" style={{ color: '#475569' }}>No bookings found</p>
            <p className="admin-dash__error-message">We couldn't find any bookings matching your search criteria.</p>
            {(searchTerm || filterDate || filterType !== "all") && (
              <button
                onClick={clearFilters}
                className="mt-4 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Reset Filters
              </button>
            )}
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Cabin Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Booking Period
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Price
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBookings.map((booking, index) => {
                  const typeBadge = getCabinTypeBadge(booking.cabinId);
                  const Icon = typeBadge?.icon || Layout;
                  
                  return (
                    <tr 
                      key={booking._id} 
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                            <Building2 size={18} className="text-indigo-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 text-sm">
                              {booking.cabinId?.name || "Unknown Cabin"}
                            </p>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                              <MapPin size={12} className="text-indigo-500" />
                              {booking.cabinId?.address?.split(",")[0] || "No Address"}
                            </div>
                            {booking.cabinId?.cabin && (
                              <div className="text-[10px] text-slate-400 mt-0.5">
                                Suite: {booking.cabinId?.cabin}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                            <User size={18} className="text-slate-600" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 text-sm">
                              {booking.name || booking.userId?.name || "Unknown Guest"}
                            </p>
                            {booking.userId?.address && (
                              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                                <MapPin size={12} className="text-indigo-500" />
                                {booking.userId?.address}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Phone size={14} className="text-indigo-500" />
                            {booking.mobile || booking.userId?.mobile || "No Mobile"}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                            </svg>
                            {booking.userId?.email || "No Email"}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-2">
                          <Clock size={16} className="text-indigo-500 mt-0.5 flex-shrink-0" />
                          <div className="space-y-1">
                            <p className="text-sm text-slate-900 font-medium">
                              {formatDateToDDMMYYYY(booking.startDate)} · {formatTime(booking.startTime)}
                            </p>
                            <p className="text-sm text-slate-500">
                              {formatDateToDDMMYYYY(booking.endDate)} · {formatTime(booking.endTime)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                          {booking.totalHours} hrs
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {typeBadge && (
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${typeBadge.className}`}>
                            <Icon size={12} />
                            {typeBadge.label}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1 text-indigo-600 font-bold text-lg">
                          <IndianRupee size={18} />
                          {booking.totalPrice?.toLocaleString("en-IN") || "0"}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        {!loading && filteredBookings.length > 0 && (
          <div className="mt-4 px-6 py-3 bg-white rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs text-slate-500">
              Showing <strong>{filteredBookings.length}</strong> of <strong>{bookings.length}</strong> bookings
            </span>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                Normal: {normalCount}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                Exclusive: {exclusiveCount}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                Chamber: {chamberCount}
              </span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DoctorBookings;