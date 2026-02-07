import axios from "axios";
import { ArrowRight, Calendar, Clock, MapPin, Phone, Search, SlidersHorizontal, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import AdminNavbar from "./AdminNavbar";

const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/bookings")
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
    return (
      userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cabinName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userMobile.includes(searchTerm)
    );
  });

  const formatDate = (dateString, timeString) => {
    if (!dateString) return { date: "N/A", time: "" };
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' });
    return { date: formattedDate, time: timeString || "N/A" };
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <AdminNavbar />

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h2 className="pt-2 text-2xl font-bold text-slate-900 tracking-tight ">All Bookings</h2>
            <p className="text-slate-500 font-medium text-sm">Manage and track workspace reservations.</p>
          </div>

          <div className="w-full md:w-auto flex gap-3">
            <div className="relative flex-grow md:w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search bookings..."
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-sm transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-emerald-600 hover:border-emerald-200 transition shadow-sm">
              <SlidersHorizontal size={20} />
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="animate-spin h-10 w-10 border-t-4 border-emerald-600 border-r-transparent rounded-full"></div>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest pl-8">Cabin Information</th>
                    <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">User Details</th>
                    <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Schedule</th>
                    <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest text-right pr-8">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredBookings.length > 0 ? (
                    filteredBookings.map((b) => {
                      const userName = b.userId?.name || b.name || "Unknown";
                      const userMobile = b.userId?.mobile || b.mobile || "N/A";
                      const start = formatDate(b.startDate || b.date, b.startTime || b.time);
                      const end = formatDate(b.endDate, b.endTime);

                      return (
                        <tr key={b._id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-6 py-5 pl-8">
                            <div className="flex items-center gap-4">
                              <div className="h-12 w-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                                <MapPin size={20} />
                              </div>
                              <div>
                                <p className="font-bold text-slate-900">{b.cabinId?.name || "Unknown Workspace"}</p>
                                <p className="text-xs font-medium text-slate-400">ID: <span className="uppercase">{b.cabinId?._id?.slice(-6)}</span></p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-bold border border-emerald-100">
                                {userName.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-slate-900">{userName}</p>
                                <p className="text-xs font-medium text-slate-500 flex items-center gap-1">
                                  <Phone size={10} className="text-slate-400" /> {userMobile}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-4">
                              <div>
                                <p className="text-xs font-bold text-slate-400 uppercase">From</p>
                                <p className="text-sm font-bold text-slate-900">{start.date}</p>
                                <p className="text-xs text-slate-500">{start.time}</p>
                              </div>
                              <ArrowRight size={16} className="text-slate-300" />
                              <div>
                                <p className="text-xs font-bold text-slate-400 uppercase">To</p>
                                <p className="text-sm font-bold text-slate-900">{end.date}</p>
                                <p className="text-xs text-slate-500">{end.time}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-right pr-8">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                              Confirmed
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center text-slate-400 font-medium">
                        No bookings found matching "{searchTerm}"
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((b) => {
                  const userName = b.userId?.name || b.name || "Unknown";
                  const start = formatDate(b.startDate || b.date, b.startTime || b.time);
                  const end = formatDate(b.endDate, b.endTime);

                  return (
                    <div key={b._id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                            <MapPin size={20} />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 text-lg">{b.cabinId?.name || "Workspace"}</h3>
                            <span className="inline-flex mt-1 items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                              Confirmed
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center font-bold text-slate-600 shadow-sm">
                            {userName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Booked By</p>
                            <p className="text-sm font-bold text-slate-900">{userName}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Start</p>
                            <p className="text-sm font-bold text-slate-900">{start.date}</p>
                            <p className="text-xs text-slate-500">{start.time}</p>
                          </div>
                          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">End</p>
                            <p className="text-sm font-bold text-slate-900">{end.date}</p>
                            <p className="text-xs text-slate-500">{end.time}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 bg-white rounded-[2rem] border border-dashed border-slate-200 text-slate-400 font-medium">
                  No bookings found.
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AllBookings;
