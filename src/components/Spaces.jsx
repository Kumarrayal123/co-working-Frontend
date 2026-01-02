import React, { useEffect, useState } from "react";
import axios from "axios";
import UsersNavbar from "./UsersNavbar";
import { MapPin, Users, ArrowRight, Home, Search, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";


const Spaces = () => {
  const [cabins, setCabins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5050/api/cabins")
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
    <div className="min-h-screen bg-slate-50 font-sans">
      <UsersNavbar />

      {/* Header Section */}
      <div className="pt-28 pb-12 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
                {/* Explore Workspaces */}
                 Explore
              </h1>
              <p className="text-lg text-slate-500 max-w-2xl">
                Find the perfect environment to boost your productivity. From private cabins to open desks.
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={20} className="text-slate-400" />
              </div>
              <input
                type="text" 
                placeholder="Search by name or location..."
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-slate-900"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
          </div>
        ) : filteredCabins.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <div className="mx-auto h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <Home size={32} className="text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No spaces found</h3>
            <p className="text-slate-500">Try adjusting your search terms or check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCabins.map((cabin) => (
              <div
                className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
                key={cabin._id}
              >
                {/* Image */}
                {/* <div className="relative h-60 overflow-hidden bg-slate-100">
                  <img
                    src={`http://localhost:5050/${cabin.images[0]}`}
                    alt={cabin.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000";
                    }}
                  />
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-emerald-700 shadow-sm border border-emerald-100 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Available
                  </div>
                </div> */}
                <div
                  className="relative h-60 overflow-hidden bg-slate-100 cursor-pointer"
                  onClick={() => navigate(`/cabin/${cabin._id}`)}
                >
                  <img
                    src={`http://localhost:5050/${cabin.images[0]}`}
                    alt={cabin.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000";
                    }}
                  />

                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-emerald-700 shadow-sm border border-emerald-100 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Available
                  </div>
                </div>


                {/* Card Body */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-1">
                      {cabin.name}
                    </h3>
                  </div>

                  <p className="text-slate-500 text-sm line-clamp-2 mb-6">
                    {cabin.description || "Experience a premium workspace designed for focus and collaboration."}
                  </p>

                  {/* Features */}
                  <div className="flex items-center gap-5 text-sm text-slate-600 mb-6 mt-auto">
                    <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                      <Users size={16} className="text-emerald-500" />
                      <span className="font-medium">{cabin.capacity} Seats</span>
                    </div>
                    <div className="flex items-center gap-2" title={cabin.address}>
                      <MapPin size={16} className="text-emerald-500 shrink-0" />
                      <span className="truncate max-w-[140px]">{cabin.address}</span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="pt-5 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-0.5">Price</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-slate-900">₹{cabin.price || '5,000'}</span>
                        <span className="text-sm text-slate-400 font-medium">/hour</span>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate(`/book/${cabin._id}`)}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-all"
                    >
                      Book Now
                    </button>


                    <button
                      onClick={() => navigate(`/cabin/${cabin._id}`)}
                      className="h-10 w-10 flex items-center justify-center rounded-full bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300"
                    >
                      <ArrowRight size={20} />
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
