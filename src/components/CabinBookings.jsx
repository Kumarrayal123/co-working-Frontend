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
  Calendar as CalendarIcon
} from "lucide-react";
import "./Dashboard.css";

const API_URL = "http://localhost:5000";

const CabinBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${API_URL}/api/bookings/owner-bookings`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBookings(res.data.bookings || []);
      } catch (err) {
        console.error("Failed to fetch owner bookings:", err);
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
      b.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = filterDate ? b.startDate === filterDate : true;
    return matchesSearch && matchesDate;
  });

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
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all w-64"
              />
            </div>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
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
            <div className="px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider leading-none mb-1">Found</p>
              <p className="text-lg font-black text-slate-900 leading-none">
                {filteredBookings.length} <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest ml-1">Results</span>
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
            {(searchTerm || filterDate) && (
              <button
                onClick={() => { setSearchTerm(""); setFilterDate(""); }}
                className="mt-4 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Reset Filters
              </button>
            )}
          </div>
        )}

        {/* Table */}
        {!loading && filteredBookings.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
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
                      Date / Period
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
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${isVisit ? "bg-blue-50" : "bg-emerald-50"}`}>
                            <Calendar size={18} className={isVisit ? "text-blue-500" : "text-emerald-600"} />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 text-sm">
                              {booking.cabinId?.name || "Unknown Cabin"}
                            </p>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                              <MapPin size={12} className="text-emerald-500" />
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
                              {booking.name || booking.userId?.name || "Unknown Guest"}
                            </p>
                            {booking.userId?.address && (
                              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                                <MapPin size={12} className="text-emerald-500" />
                                {booking.userId?.address}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Phone size={14} className="text-emerald-500" />
                            {booking.mobile || booking.userId?.mobile || "No Mobile"}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                            </svg>
                            {booking.userId?.email || booking.email || "No Email"}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-2">
                          <Clock size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
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
                          <div className="flex items-center justify-end gap-1 text-emerald-600 font-bold text-lg">
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
        )}
      </main>
    </div>
  );
};

export default CabinBookings;
