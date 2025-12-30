import React, { useEffect, useState } from "react";
import axios from "axios";
import UsersNavbar from "./UsersNavbar";
import { Calendar, User, Phone, MapPin, Clock, IndianRupee, X, ShieldCheck, Search, Filter } from "lucide-react";

const DoctorBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchBookings = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("http://localhost:5050/api/bookings/owner-bookings", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBookings(res.data.bookings || []);
        } catch (err) {
            console.error("Error fetching bookings:", err);
            setError(err.response?.data?.message || err.message || "Failed to fetch bookings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const user = JSON.parse(localStorage.getItem("user"));

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
            <UsersNavbar />

            <div className="flex-grow pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto">

                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
                        <div className="max-w-xl">
                            <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-emerald-100">
                                Management Portal
                            </span>
                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight flex items-center gap-4">
                                Owner <span className="text-emerald-600">Analytics</span>
                            </h1>
                            <div className="mt-4 flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl text-[10px] text-slate-500 font-black uppercase tracking-widest w-fit border border-slate-200">
                                <User size={12} className="text-emerald-600" />
                                Host: {user?.name || "Verified Host"}
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-1">
                                <button className="p-2 bg-slate-900 text-white rounded-xl shadow-lg"><LayoutGrid size={18} /></button>
                                <button className="p-2 text-slate-400 hover:text-emerald-600 transition-colors"><Search size={18} /></button>
                                <button className="p-2 text-slate-400 hover:text-emerald-600 transition-colors"><Filter size={18} /></button>
                            </div>
                            <div className="bg-emerald-600 text-white px-6 py-4 rounded-[1.5rem] font-black text-sm shadow-xl shadow-emerald-200/50 flex flex-col items-center">
                                <span className="text-[10px] uppercase opacity-60 tracking-[0.1em] mb-1">Active Volume</span>
                                {bookings.length} Bookings
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex flex-col justify-center items-center py-40 gap-4">
                            <div className="animate-spin h-14 w-14 border-t-4 border-emerald-600 border-r-transparent rounded-full font-black"></div>
                            <p className="text-xs font-black uppercase tracking-widest text-slate-400">De-encrypting Transactional Data...</p>
                        </div>
                    ) : error ? (
                        <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 p-20 text-center max-w-2xl mx-auto">
                            <div className="mx-auto h-24 w-24 bg-red-50 rounded-[2rem] flex items-center justify-center mb-8">
                                <X size={48} className="text-red-500" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4">Registry Error</h3>
                            <p className="text-slate-500 font-light mb-10 leading-relaxed">{error}</p>
                            <button
                                onClick={fetchBookings}
                                className="px-10 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-black transition-all shadow-xl shadow-slate-200 active:scale-95"
                            >
                                Re-sync Dashboard
                            </button>
                        </div>
                    ) : bookings.length === 0 ? (
                        <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 p-20 text-center max-w-2xl mx-auto">
                            <div className="mx-auto h-24 w-24 bg-emerald-50 rounded-[2rem] flex items-center justify-center mb-8">
                                <Calendar size={48} className="text-emerald-600" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4">Quiet Workspace</h3>
                            <p className="text-slate-500 font-light mb-10 leading-relaxed">No reservations have been recorded for your portfolio in the current cycle. Check your cabin visibility settings.</p>
                            <button className="px-10 py-4 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-200 active:scale-95">Portfolio Review</button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {bookings.map((booking) => (
                                <div key={booking._id} className="group bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-500 flex flex-col h-full hover:-translate-y-2">
                                    <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex justify-between items-start">
                                        <div className="space-y-1">
                                            <h3 className="font-black text-xl text-slate-900 uppercase tracking-tight group-hover:text-emerald-700 transition-colors">
                                                {booking.cabinId?.name || "Premium Suite"}
                                            </h3>
                                            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                                                <MapPin size={12} className="text-emerald-500" />
                                                {booking.cabinId?.address?.split(',')[0]}
                                            </div>
                                        </div>
                                        <div className="px-3 py-1 bg-white border border-slate-200 rounded-lg shadow-sm">
                                            <ShieldCheck size={16} className="text-emerald-600" />
                                        </div>
                                    </div>

                                    <div className="p-8 space-y-8 flex-grow">
                                        {/* Customer Info */}
                                        <div className="flex items-start gap-5">
                                            <div className="w-12 h-12 bg-white rounded-2xl border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                                                <User size={20} strokeWidth={2.5} />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Subscriber</p>
                                                <p className="font-black text-slate-900 text-lg uppercase tracking-tight leading-none">{booking.userId?.name || "Private Client"}</p>
                                                <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold mt-2">
                                                    <Phone size={12} />
                                                    <span>{booking.userId?.mobile || "Encrypted"}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Time Info */}
                                        <div className="flex items-start gap-5">
                                            <div className="w-12 h-12 bg-white rounded-2xl border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                                                <Clock size={20} strokeWidth={2.5} />
                                            </div>
                                            <div className="space-y-3">
                                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Occupation Slot</p>
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex items-center gap-4">
                                                        <div className="text-sm font-black text-slate-800">{booking.startDate}</div>
                                                        <div className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md uppercase">{booking.startTime}</div>
                                                    </div>
                                                    <div className="w-4 h-px bg-slate-200 ml-2"></div>
                                                    <div className="flex items-center gap-4">
                                                        <div className="text-sm font-black text-slate-800">{booking.endDate}</div>
                                                        <div className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md uppercase">{booking.endTime}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Payment Info */}
                                    <div className="p-8 bg-slate-50/80 border-t border-slate-100 flex justify-between items-center group-hover:bg-emerald-50 transition-colors">
                                        <div>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Gross Yield</span>
                                            <div className="flex items-center gap-1.5 text-emerald-700">
                                                <IndianRupee size={22} className="mb-1" />
                                                <span className="font-black text-3xl tracking-tighter">{booking.totalPrice?.toLocaleString("en-IN") || "0"}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs font-black text-slate-900 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm">
                                                {booking.totalHours || '0'} hr Cycle
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const LayoutGrid = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"></rect>
        <rect x="14" y="3" width="7" height="7"></rect>
        <rect x="14" y="14" width="7" height="7"></rect>
        <rect x="3" y="14" width="7" height="7"></rect>
    </svg>
);

export default DoctorBookings;
