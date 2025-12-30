import axios from "axios";
import {
    ArrowLeft,
    ArrowRight,
    CheckCircle,
    Clock,
    CreditCard,
    History,
    Info,
    MapPin,
    ShieldCheck,
    User,
    Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UsersNavbar from "./UsersNavbar";

const BookCabin = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const PRICE_PER_HOUR = 5000;

    const [cabin, setCabin] = useState(null);
    const [relatedCabins, setRelatedCabins] = useState([]);
    const [activeImage, setActiveImage] = useState(0);

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

    // Fetch cabin and related spaces
    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchData = async () => {
            try {
                const [cabinRes, spacesRes] = await Promise.all([
                    axios.get(`http://localhost:5050/api/cabins/${id}`),
                    axios.get("http://localhost:5050/api/cabins"),
                ]);
                setCabin(cabinRes.data);
                // Suggested cabins: excluding current one
                setRelatedCabins(spacesRes.data.filter((c) => c._id !== id).slice(0, 3));
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, [id]);

    // CALCULATE HOURS & PRICE
    useEffect(() => {
        if (startDate && startTime && endDate && endTime) {
            const start = new Date(`${startDate}T${startTime}`);
            const end = new Date(`${endDate}T${endTime}`);

            if (end <= start) {
                setTotalHours(0);
                setTotalPrice(0);
                return;
            }

            const diffMs = end - start;
            const hours = diffMs / (1000 * 60 * 60);

            const billableHours = Math.ceil(hours);
            setTotalHours(billableHours);
            setTotalPrice(billableHours * PRICE_PER_HOUR);
            setAvailabilityError("");
        }
    }, [startDate, startTime, endDate, endTime]);

    // BOOKING FUNCTION
    const handleBooking = async (e) => {
        e.preventDefault();
        setLoading(true);

        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user?._id;

        if (!userId) {
            alert("Please login before booking a cabin.");
            navigate("/login");
            return;
        }

        const bookingData = {
            cabinId: id,
            name,
            mobile,
            startDate,
            startTime,
            endDate,
            endTime,
            totalHours,
            totalPrice
        };

        try {
            await axios.post(
                `http://localhost:5050/api/bookings/createbooking/${userId}`,
                bookingData
            );

            alert("Booking Confirmed Successfully!");
            navigate("/mybookings");

        } catch (error) {
            console.log(error);
            if (error.response?.data?.error) {
                setAvailabilityError(error.response.data.error);
            } else {
                setAvailabilityError("Booking failed. Please check availability for selected slots.");
            }
        } finally {
            setLoading(false);
        }
    };

    const getImageUrl = (img) => {
        if (!img) return "";
        if (img.startsWith("http")) return img;
        return `http://localhost:5050/${img.replace(/\\/g, "/")}`;
    };

    if (!cabin) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-slate-50 gap-4">
                <div className="animate-spin w-14 h-14 border-t-4 border-emerald-600 border-r-transparent rounded-full"></div>
                <p className="text-slate-400 font-black tracking-widest uppercase text-xs">Preparing Checkout...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fcfdfe] font-sans selection:bg-emerald-100 selection:text-emerald-900 pb-20">
            <UsersNavbar />

            <div className="max-w-[1200px] mx-auto px-6 pt-32">

                {/* Header Area */}
                <div className="mb-12">
                    <button
                        onClick={() => navigate(-1)}
                        className="group flex items-center gap-3 text-slate-400 hover:text-emerald-600 transition-all font-black uppercase text-[10px] tracking-widest mb-8"
                    >
                        <ArrowLeft size={14} /> Back to Details
                    </button>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                        Secure Your <span className="text-emerald-600">Workspace</span>
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

                    {/* Left Side: Summary & Image */}
                    <div className="lg:col-span-5 space-y-10">
                        <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-2xl shadow-slate-100/50 relative overflow-hidden">

                            <div className="relative aspect-square rounded-[2rem] overflow-hidden mb-10 shadow-lg border border-slate-100">
                                <img
                                    src={getImageUrl(cabin.images?.[activeImage])}
                                    className="w-full h-full object-cover"
                                    alt={cabin.name}
                                />
                                <div className="absolute top-6 left-6 px-4 py-1.5 bg-emerald-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                                    Verified Premium
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tight mb-2">{cabin.name}</h3>
                                    <div className="flex items-start gap-2 text-slate-500 font-bold text-sm">
                                        <MapPin size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                                        <span>{cabin.address}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Capacity</span>
                                        <div className="flex items-center gap-2 text-slate-700 font-bold">
                                            <Users size={14} className="text-emerald-500" />
                                            <span>{cabin.capacity} Seats</span>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                                        <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest block mb-1">Base Rate</span>
                                        <div className="flex items-center gap-2 text-slate-900 font-black">
                                            <span>₹{PRICE_PER_HOUR}/hr</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Verification Badge */}
                            <div className="mt-10 pt-8 border-t border-slate-50 flex items-center gap-4">
                                <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                                    <ShieldCheck size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Check</p>
                                    <p className="text-xs font-bold text-slate-600">Identity & Compliance verified for active booking.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Form */}
                    <div className="lg:col-span-1"></div>

                    <div className="lg:col-span-6 space-y-10">
                        <form onSubmit={handleBooking} className="space-y-10">

                            {/* Personal Details */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-xs italic">01</div>
                                    <h3 className="text-xs font-black  uppercase tracking-widest">Registrant Details</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="group relative">
                                        <User size={18} className="absolute left-5 top-5  group-focus-within:text-emerald-500 transition-colors" />
                                        <input
                                            type="text"
                                            placeholder="Full Name"
                                            className="w-full pl-14 pr-6 py-5 bg-white border border-slate-100 rounded-[2rem] shadow-sm focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none font-bold  transition-all"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="group relative">
                                        <History size={18} className="absolute left-5 top-5  group-focus-within:text-emerald-500 transition-colors" />
                                        <input
                                            type="text"
                                            placeholder="Mobile"
                                            className="w-full pl-14 pr-6 py-5 bg-white border border-slate-100 rounded-[2rem] shadow-sm focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none font-bold  transition-all"
                                            value={mobile}
                                            onChange={(e) => setMobile(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Schedule Details */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-xs italic">02</div>
                                    <h3 className="text-xs font-black  uppercase tracking-widest">Temporal Allocation</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black  uppercase tracking-widest ml-4">Start Date</label>
                                        <div className="flex gap-2">
                                            <input type="date" className="flex-1 px-6 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm outline-none font-bold text-slate-900 text-sm focus:border-emerald-500 transition-all" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                                            <input type="time" className="w-32 px-4 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm outline-none font-bold text-slate-900 text-sm focus:border-emerald-500 transition-all" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black  uppercase tracking-widest ml-4">End Date</label>
                                        <div className="flex gap-2">
                                            <input type="date" className="flex-1 px-6 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm outline-none font-bold text-slate-900 text-sm focus:border-emerald-500 transition-all" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
                                            <input type="time" className="w-32 px-4 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm outline-none font-bold text-slate-900 text-sm focus:border-emerald-500 transition-all" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Price Summary */}
                            {totalHours > 0 && (
                                <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white shadow-2xl shadow-emerald-900/10 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>

                                    <div className="flex items-center justify-between mb-8">
                                        <h4 className="text-xs font-black text-emerald-400 uppercase tracking-[0.2em] italic">Investment Summary</h4>
                                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase">
                                            <Clock size={12} /> Live Calculation
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-10 pt-4 border-t border-white/5">
                                        <div className="flex justify-between items-center text-sm font-bold text-slate-400">
                                            <span>Billable Duration</span>
                                            <span className="text-white">{totalHours} Hours</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm font-bold text-slate-400">
                                            <span>Service Level</span>
                                            <span className="text-white">Elite Executive</span>
                                        </div>
                                    </div>

                                    <div className="flex items-end justify-between">
                                        <div>
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Gross Total</span>
                                            <span className="text-5xl font-black tracking-tighter">₹{totalPrice.toLocaleString("en-IN")}</span>
                                        </div>
                                        <div className="mb-1 p-2 bg-emerald-500/10 rounded-lg text-emerald-400 font-black text-[10px] uppercase tracking-widest">
                                            INR
                                        </div>
                                    </div>
                                </div>
                            )}

                            {availabilityError && (
                                <div className="flex items-center gap-4 bg-red-50 p-6 rounded-[2rem] border border-red-100 animate-shake">
                                    <div className="w-1.5 h-10 bg-red-500 rounded-full"></div>
                                    <p className="text-sm font-bold text-red-700 leading-snug">{availabilityError}</p>
                                </div>
                            )}

                            <div className="space-y-6 pt-4">
                                <button
                                    type="submit"
                                    disabled={loading || !!availabilityError}
                                    className={`w-full py-7 rounded-[2rem] font-black text-xl transition-all flex items-center justify-center gap-4 shadow-2xl relative overflow-hidden ${loading || !!availabilityError
                                        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                        : "bg-emerald-600 text-white hover:bg-emerald-500 hover:scale-[1.02] shadow-emerald-500/20 active:scale-95 group/btn"
                                        }`}
                                >
                                    {loading ? "Decrypting..." : "Confirm Booking"}
                                    {!loading && !availabilityError && <ArrowRight size={24} className="group-hover/btn:translate-x-1 transition-transform" />}
                                </button>

                                {/* <div className="flex items-center justify-center gap-8 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
                                    <div className="flex items-center gap-2"><CreditCard size={14} /> PCI Compliant</div>
                                    <div className="flex items-center gap-2"><CheckCircle size={14} /> End-to-End Secure</div>
                                </div> */}
                            </div>
                        </form>
                    </div>

                </div>

                {/* SUGGESTED CONTINUATIONS SECTION */}
                {relatedCabins.length > 0 && (
                    <div className="mt-40">
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                            <div>
                                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] block mb-4">Discovery Engine</span>
                                <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Suggested <span className="text-emerald-600">Continuations</span></h2>
                            </div>
                            <button
                                onClick={() => navigate("/spaces")}
                                className="flex items-center gap-2 font-black text-xs text-slate-400 uppercase tracking-widest hover:text-emerald-600 transition-colors"
                            >
                                View All Catalogue <ArrowRight size={14} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                            {relatedCabins.map((rc) => (
                                <div
                                    key={rc._id}
                                    onClick={() => navigate(`/cabin/${rc._id}`)}
                                    className="group bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-lg shadow-slate-100/50 hover:shadow-2xl transition-all duration-500 cursor-pointer"
                                >
                                    <div className="h-48 overflow-hidden relative">
                                        <img
                                            src={getImageUrl(rc.images?.[0])}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]"
                                            alt=""
                                            onError={(e) => (e.target.src = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800")}
                                        />
                                        <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-lg text-[10px] font-black text-emerald-800 border border-white/20">
                                            Available
                                        </div>
                                    </div>
                                    <div className="p-8">
                                        <h4 className="text-xl font-black text-slate-900 mb-2 truncate uppercase tracking-tight">{rc.name}</h4>
                                        <div className="flex items-center gap-2 text-slate-400 text-xs font-bold mb-6">
                                            <MapPin size={14} /> {rc.address?.split(',')[0]}
                                        </div>
                                        <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                                            <span className="text-2xl font-black text-slate-900">₹{rc.price}</span>
                                            <div className="flex items-center gap-1.5 text-xs font-black text-emerald-600 uppercase tracking-widest">
                                                Explore <ArrowRight size={14} />
                                            </div>
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
