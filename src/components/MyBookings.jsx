
import axios from "axios";
import {
  Calendar,
  Clock,
  IndianRupee,
  MapPin,
  Ticket,
  User
} from "lucide-react";
import { useEffect, useState } from "react";
import UsersNavbar from "./UsersNavbar";
import AdminNavbar from "./AdminNavbar";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(
          `http://localhost:5000/api/bookings/user`,
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

  if (loading)
    return (
      <div className="min-h-screen bg-slate-50 flex justify-center items-center">
        <div className="flex gap-2 items-center text-emerald-600 font-medium text-sm animate-pulse">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-600"></div>
          Loading bookings...
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* <UsersNavbar /> */}
      <AdminNavbar />

      <div className="pt-24 px-4 sm:px-6 lg:px-8 pb-16 max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 bg-emerald-100/50 rounded-xl text-emerald-600">
            <Ticket size={24} />
          </div>
          <div>
            <h2 className="pt-4 text-2xl font-bold text-slate-900 tracking-tight mb-2">
              {localStorage.getItem('admin') ? 'Admin Bookings' : 'Bookings'}
            </h2>
            <p className="text-sm text-slate-500 mt-1">Manage your reservations</p>
          </div>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-12 text-center">
            <div className="mx-auto h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Calendar size={28} className="text-slate-300" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-1">No bookings found</h2>
            <p className="text-sm text-slate-500 max-w-xs mx-auto">You haven't made any reservations yet. Explore our spaces.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => (
              <div
                key={b._id}
                className="group bg-white rounded-[1.5rem] border border-slate-100 p-2 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex flex-col sm:flex-row gap-4"
              >
                {/* Image */}
                <div className="w-full sm:w-40 h-40 rounded-2xl overflow-hidden relative shrink-0">
                  <img
                    src={
                      b.cabinId?.images?.[0]
                        ? `http://localhost:5000/${b.cabinId.images[0]}`
                        : "https://via.placeholder.com/300x300?text=No+Image"
                    }
                    alt="cabin"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                </div>

                {/* Content */}
                <div className="flex-1 py-2 pr-4 flex flex-col justify-center">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 leading-tight">
                        {b.cabinId?.name}
                      </h2>
                      <div className="flex items-center gap-1 text-slate-500 text-xs font-medium mt-0.5">
                        <MapPin size={12} className="text-emerald-500" />
                        {b.cabinId?.address}
                      </div>
                    </div>
                    <div className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-emerald-100">
                      Confirmed
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Start</p>
                      <div className="flex items-center gap-1.5 text-slate-900 font-semibold text-sm">
                        <Calendar size={14} className="text-emerald-500" />
                        {b.startDate} <span className="text-slate-300 text-xs">|</span> {b.startTime}
                      </div>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">End</p>
                      <div className="flex items-center gap-1.5 text-slate-900 font-semibold text-sm">
                        <Clock size={14} className="text-emerald-500" />
                        {b.endDate} <span className="text-slate-300 text-xs">|</span> {b.endTime}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                        <User size={12} />
                      </div>
                      <span className="text-xs font-medium text-slate-600">{currentUser?.name || "Member"}</span>
                    </div>
                    <div className="flex items-center gap-0.5 text-slate-900 font-bold text-base">
                      <IndianRupee size={16} className="text-emerald-600" />
                      {b.totalPrice?.toLocaleString("en-IN")}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
