import axios from "axios";
import {
  Calendar,
  Clock,
  IndianRupee,
  MapPin,
  Search,
  User,
  X,
  Calendar as CalendarIcon
} from "lucide-react";
import { useEffect, useState } from "react";
import AdminNavbar from "./AdminNavbar";
import "./Dashboard.css";
const API_URL = "http://localhost:5000";
const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000";


const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const getImageUrl = (img) => {
    if (!img) return PLACEHOLDER_IMAGE;
    if (img.startsWith("http")) return img;
    const cleanPath = img.replace(/\\/g, "/").replace(/^\/+/, "");
    return `${API_URL}/${cleanPath}`;
  };

  useEffect(() => {
    axios
      .get(`${API_URL}/api/bookings`)
      .then((res) => {
        setBookings(res.data.bookings || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching bookings:", err);
        setLoading(false);
      });
  }, []);

  const filteredBookings = bookings.filter((b) => {
    const userName = b.userId?.name || b.name || "";
    const userMobile = b.userId?.mobile || b.mobile || "";
    const cabinName = b.cabinId?.name || "";
    const matchesSearch =
      userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cabinName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userMobile.includes(searchTerm);
    const matchesDate = filterDate ? b.startDate === filterDate : true;
    return matchesSearch && matchesDate;
  });

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
              All <span>Bookings</span>
            </h1>
            <p className="admin-dash__subtitle">
              Manage and track all workspace reservations.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-grow sm:flex-grow-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all w-full sm:w-64"
              />
            </div>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all w-full sm:w-auto"
            />
            {(searchTerm || filterDate) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterDate("");
                }}
                className="flex items-center justify-center gap-2 p-2.5 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 transition-colors w-full sm:w-auto"
                title="Clear Filters"
              >
                <X size={18} />
                <span className="sm:hidden text-sm font-medium">Clear Filters</span>
              </button>
            )}
            <div className="px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm flex sm:flex-col justify-between items-center sm:items-start gap-2 sm:gap-1">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider leading-none mb-0 sm:mb-1">Found</p>
              <p className="text-lg font-black text-slate-900 leading-none">
                {filteredBookings.length} <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest ml-1">Results</span>
              </p>
            </div>
          </div>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="admin-dash__error" style={{ background: '#f8fafc', borderColor: '#e2e8f0' }}>
            <CalendarIcon size={48} className="text-slate-300 mb-4" />
            <p className="admin-dash__error-title" style={{ color: '#475569' }}>No bookings found</p>
            <p className="admin-dash__error-message">We couldn't find any bookings matching your search criteria.</p>
            {(searchTerm || filterDate) && (
              <button
                onClick={() => { setSearchTerm(""); setFilterDate(""); }}
                className="mt-4 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Type
                      </th>
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
                      <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredBookings.map((booking) => {
                      const isVisit = booking.bookingType === "visit";
                      const userName = booking.userId?.name || booking.name || "Unknown";
                      return (
                      <tr 
                        key={booking._id} 
                        className="hover:bg-slate-50 transition-colors"
                      >
                        {/* Type Badge */}
                        <td className="px-6 py-4">
                          {isVisit ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block"></span>
                              Site Visit
                            </span>
                          ) : booking.bookingBasis === "plan" ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-100">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 inline-block"></span>
                              Plan: {booking.selectedPlan?.label || "Subscription"}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                              Hourly Booking
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${isVisit ? "bg-blue-50" : "bg-indigo-50"}`}>
                              <Calendar size={18} className={isVisit ? "text-blue-500" : "text-indigo-600"} />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900 text-sm">
                                {booking.cabinId?.name || "Unknown Cabin"}
                              </p>
                              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                                <MapPin size={12} className="text-indigo-500" />
                                {booking.cabinId?.address?.split(",")[0] || "No Address"}
                              </div>
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
                                {userName}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                              </svg>
                              {booking.userId?.mobile || booking.mobile || "No Mobile"}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-start gap-2">
                            <Clock size={16} className="text-indigo-500 mt-0.5 flex-shrink-0" />
                            <div className="space-y-1">
                              <p className="text-sm text-slate-900 font-medium">
                                {booking.startDate} · {booking.startTime}
                              </p>
                              {!isVisit && (
                                <p className="text-sm text-slate-500">
                                  {booking.endDate} · {booking.endTime}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {isVisit ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">Visit</span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">{booking.totalHours} hrs</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {isVisit ? (
                            <span className="font-bold text-emerald-600 text-sm">Free</span>
                          ) : (
                            <div className="flex items-center justify-end gap-1 text-indigo-600 font-bold text-lg">
                              <IndianRupee size={18} />
                              {booking.totalPrice?.toLocaleString("en-IN") || "0"}
                            </div>
                          )}
                        </td>
                      </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {filteredBookings.map((booking) => {
                const isVisit = booking.bookingType === "visit";
                const userName = booking.userId?.name || booking.name || "Unknown";
                return (
                  <div key={booking._id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-4">
                    {/* Top Badge and Price */}
                    <div className="flex justify-between items-center">
                      <div>
                        {isVisit ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block"></span>
                            Site Visit
                          </span>
                        ) : booking.bookingBasis === "plan" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 inline-block"></span>
                            Plan: {booking.selectedPlan?.label || "Subscription"}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                            Hourly Booking
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        {isVisit ? (
                          <span className="font-bold text-emerald-600 text-sm">Free</span>
                        ) : (
                          <div className="flex items-center gap-0.5 text-indigo-600 font-bold text-base">
                            <IndianRupee size={14} />
                            {booking.totalPrice?.toLocaleString("en-IN") || "0"}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Cabin Details */}
                    <div className="flex items-start gap-3 border-t border-slate-100 pt-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${isVisit ? "bg-blue-50" : "bg-indigo-50"}`}>
                        <Calendar size={18} className={isVisit ? "text-blue-500" : "text-indigo-600"} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 text-sm">
                          {booking.cabinId?.name || "Unknown Cabin"}
                        </h4>
                        <p className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                          <MapPin size={12} className="text-indigo-500" />
                          {booking.cabinId?.address || "No Address"}
                        </p>
                      </div>
                    </div>

                    {/* Booking Period */}
                    <div className="bg-slate-50 rounded-xl p-3 flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-400 uppercase tracking-wider">
                        <Clock size={12} className="text-indigo-500" />
                        <span>Booking Period</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-slate-950">
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">From</p>
                          <p className="text-xs font-semibold">{booking.startDate}</p>
                          <p className="text-[11px] text-slate-500">{booking.startTime}</p>
                        </div>
                        {!isVisit && (
                          <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">To</p>
                            <p className="text-xs font-semibold">{booking.endDate}</p>
                            <p className="text-[11px] text-slate-500">{booking.endTime}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="flex justify-between items-center pt-3 border-t border-slate-100 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                          <User size={12} className="text-slate-600" />
                        </div>
                        <span className="font-medium text-slate-700">{userName}</span>
                      </div>
                      <div className="text-slate-500 flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                        </svg>
                        {booking.userId?.mobile || booking.mobile || "No Mobile"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AllBookings;
