import React, { useEffect, useState } from "react";
import axios from "axios";
import UsersNavbar from "./UsersNavbar";
import { MapPin, Users, ArrowRight, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";

const Spaces = () => {
  const [cabins, setCabins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/cabins")
      .then((res) => {
        setCabins(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredCabins = cabins.filter(cabin =>
    cabin.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cabin.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* <UsersNavbar /> */}
      <AdminNavbar />

      {/* Hero / Header Section */}
      <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="max-w-2xl">
            {/* <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-[1.1] mb-4">
              Find your perfect <br />
              <span className="text-emerald-600">Space</span>
            </h1> */}
            <h2 className="pt-4 text-2xl font-bold text-slate-900 tracking-tight mb-2">
              Find your perfect spaces
            </h2>

            <p className="text-base text-slate-500 font-medium leading-relaxed max-w-lg">
              Discover professionally equipped cabins and desks designed for focus, collaboration, and growth.
            </p>
          </div>

          {/* Refined Search Bar */}
          <div className="w-full md:w-[380px]">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={18} className="text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search location or cabin name..."
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-emerald-600 border-r-transparent"></div>
          </div>
        ) : filteredCabins.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[2rem] border border-slate-100 shadow-sm max-w-xl mx-auto">
            <div className="mx-auto h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Search size={28} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No spaces found</h3>
            <p className="text-sm text-slate-500">We couldn't find any cabins matching "{searchTerm}".</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCabins.map((cabin) => (
              <div
                key={cabin._id}
                onClick={() => navigate(`/cabin/${cabin._id}`)}
                className="group bg-white rounded-[1.5rem] border border-slate-100 overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full"
              >
                {/* Image Section */}
                <div className="relative h-56 overflow-hidden">
                  <div className="absolute inset-0 bg-slate-200 animate-pulse" />
                  <img
                    src={`http://localhost:5000/${cabin.images[0]}`}
                    alt={cabin.name}
                    className="w-full h-full object-cover relative z-10 group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent z-20 opacity-60 group-hover:opacity-40 transition-opacity" />

                  <div className="absolute top-3 right-3 z-30 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-emerald-700 shadow-sm flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Available
                  </div>

                  <div className="absolute bottom-3 left-3 z-30 text-white">
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-90 mb-0.5">Coworking</p>
                    <h3 className="text-lg font-bold leading-tight">{cabin.name}</h3>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 bg-emerald-50 rounded-lg shrink-0 text-emerald-600">
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

                  <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-0.5">
                        <span className="text-xl font-bold text-slate-900">₹{cabin.price || '0'}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">/ Month</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-medium text-slate-500 mt-0.5">
                        <Users size={10} />
                        {cabin.capacity} Seats
                      </div>
                    </div>

                    <button className="h-10 w-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <ArrowRight size={16} />
                    </button>
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

export default Spaces;
