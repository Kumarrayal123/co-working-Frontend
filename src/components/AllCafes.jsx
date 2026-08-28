// AllCafes.jsx - Complete All Cafe & Dining Tables with CafeNavbar
import axios from "axios";
import {
  ArrowRight,
  MapPin,
  Search,
  Users,
  UtensilsCrossed,
  Coffee,
  Crown,
  Star,
  Clock,
  CheckCircle,
  Plus,
  Loader2,
  Calendar,
  Sparkles,
  Award,
  Filter
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CafeNavbar from "./CafeNavbar";
import "./Dashboard.css";

const API_URL = import.meta.env.VITE_API_URL || "https://spaceapi.iryax.com";
const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=1000";

const AllCafes = () => {
  const [cabins, setCabins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const navigate = useNavigate();

  // Helper to determine if a space is a Cafe / Dining Table
  const isCafeSpace = (c) => {
    if (!c) return false;
    // Exclude doctor chambers
    if (c.isChamber === true) return false;
    // Explicitly marked cafe
    if (c.isCafe === true) return true;
    if (c.spaceType === "cafe" || c.type === "cafe") return true;

    const name = (c.name || "").toLowerCase();
    const spec = (c.cabin || c.tableNumber || "").toLowerCase();

    return (
      name.includes("cafe") ||
      name.includes("coffee") ||
      name.includes("dining") ||
      name.includes("bistro") ||
      name.includes("restaurant") ||
      name.includes("tea") ||
      spec.includes("table") ||
      spec.includes("booth") ||
      Boolean(c.tableNumber)
    );
  };

  useEffect(() => {
    axios
      .get(`${API_URL}/api/cabins`)
      .then((res) => {
        const data = res.data.cabins || res.data;
        const allCabins = Array.isArray(data) ? data : [];
        // ✅ ONLY SHOW CAFES
        const cafeCabins = allCabins.filter(isCafeSpace);
        setCabins(cafeCabins);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching cafes:", err);
        setLoading(false);
      });
  }, []);

  const activeCabins = cabins.filter((c) => c.isActive !== false);

  const filteredCabins = activeCabins.filter((cabin) => {
    const matchSearch =
      cabin.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cabin.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cabin.cabin?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchLocation = locationFilter
      ? cabin.address?.toLowerCase().includes(locationFilter.toLowerCase())
      : true;
    return matchSearch && matchLocation;
  });

  const getSortedCabins = () => {
    let filtered = [...filteredCabins];
    if (sortBy === "latest") {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "priceLow") {
      filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === "priceHigh") {
      filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
    }
    return filtered;
  };

  const sortedCabins = getSortedCabins();

  const getImageUrl = (img) => {
    if (!img) return PLACEHOLDER_IMAGE;
    if (img.startsWith("http")) return img;
    const cleanPath = img.replace(/\\/g, "/").replace(/^\/+/, "");
    return `${API_URL}/${cleanPath}`;
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <CafeNavbar />

      <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
              ☕ Cafe & Dining Spaces
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-2">
              All Available <span className="text-[#C67B3D]">Cafe Tables</span>
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Explore and reserve dining tables, coffee workstations, and VIP lounge booths.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/mycafes")}
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-amber-600/20 transition-all cursor-pointer"
            >
              <Plus size={16} />
              <span>Manage My Tables</span>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by cafe name or table..."
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              />
            </div>

            <div className="relative">
              <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                placeholder="Filter by city or location..."
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              />
            </div>

            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              >
                <option value="latest">Sort: Newest First</option>
                <option value="priceLow">Sort: Price Low to High</option>
                <option value="priceHigh">Sort: Price High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 size={36} className="text-amber-600 animate-spin" />
            <p className="text-sm font-semibold text-slate-500">Loading tables...</p>
          </div>
        ) : sortedCabins.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 p-8">
            <UtensilsCrossed size={48} className="mx-auto text-slate-300 mb-3" />
            <h3 className="text-base font-bold text-slate-800">No Cafe Tables Found</h3>
            <p className="text-xs text-slate-500 mt-1">Try modifying your search or location filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedCabins.map((cabin) => {
              const isExclusive = cabin.cabinType === "exclusive";
              const firstImg = cabin.images?.[0] ? getImageUrl(cabin.images[0]) : PLACEHOLDER_IMAGE;
              const cafeName = cabin.name?.includes(" - ") ? cabin.name.split(" - ")[0] : cabin.name;
              const tableNum = cabin.cabin || cabin.tableNumber || (cabin.name?.includes(" - ") ? cabin.name.split(" - ")[1] : "Table");

              return (
                <div
                  key={cabin._id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group"
                >
                  <div className="relative h-52 overflow-hidden bg-slate-100">
                    <img
                      src={firstImg}
                      alt={cabin.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }}
                    />
                    <div className="absolute top-3 left-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10.5px] font-bold text-white shadow ${
                        isExclusive ? "bg-amber-600" : "bg-slate-800"
                      }`}>
                        {isExclusive ? "👑 VIP Lounge" : "☕ Dining Table"}
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-sm text-white px-3 py-1 rounded-xl text-right">
                      <span className="text-sm font-black">₹{cabin.price || 0}</span>
                      <span className="text-[9px] block text-white/70 uppercase">per hour</span>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <h3 className="font-bold text-slate-900 text-base">{cafeName}</h3>
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 mt-0.5">
                          <UtensilsCrossed size={12} /> {tableNum}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 flex items-center gap-1.5 my-2">
                      <MapPin size={13} className="text-amber-600 flex-shrink-0" />
                      <span className="truncate">{cabin.address}</span>
                    </p>

                    <div className="flex items-center gap-3 text-xs text-slate-600 py-2.5 border-y border-slate-100 my-2">
                      <span className="flex items-center gap-1 font-semibold">
                        <Users size={13} className="text-slate-400" /> {cabin.capacity || 4} Guests
                      </span>
                      <span className="flex items-center gap-1 font-semibold">
                        <Clock size={13} className="text-slate-400" /> {cabin.is24x7 ? "24x7 Open" : `${cabin.openTime || "08:00"} - ${cabin.closeTime || "23:00"}`}
                      </span>
                    </div>

                    <div className="mt-auto pt-3 flex gap-2">
                      <button
                        onClick={() => navigate(`/book/${cabin._id}`)}
                        className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-xs font-bold transition-all shadow-md shadow-amber-600/20 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>Reserve Table</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllCafes;