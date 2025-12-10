import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "./AdminNavbar";
import { Search, Calendar, User, Phone, Clock, MapPin, ArrowRight } from "lucide-react";

const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/bookings")
      .then((res) => {
        setBookings(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching bookings:", err);
        setLoading(false);
      });
  }, []);

  const filteredBookings = bookings.filter((b) =>
    b.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.cabinId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.mobile?.includes(searchTerm)
  );

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString("en-IN", {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
    return dateString;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />

      <main className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">All Bookings</h1>
            <p className="mt-1 text-gray-500">Manage and view all cabin reservations</p>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search bookings..."
              className="w-full md:w-64 pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <>
            {/* Desktop Table View (Hidden on Mobile) */}
            <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Cabin Info</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User Details</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Booking Duration</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredBookings.length > 0 ? (
                    filteredBookings.map((b) => (
                      <tr key={b._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-50 rounded-lg">
                              <MapPin size={20} className="text-indigo-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{b.cabinId?.name || "Unknown Cabin"}</p>
                              <p className="text-xs text-gray-500">ID: {b.cabinId?._id?.slice(-6)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xs">
                              {b.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{b.name}</p>
                              <p className="text-xs text-gray-500 flex items-center gap-1">
                                <Phone size={10} /> {b.mobile}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col md:flex-row md:items-center gap-6">
                            {/* Start Date/Time */}
                            <div className="flex items-center gap-3">
                              <div className="p-1.5 bg-indigo-50 rounded text-indigo-600">
                                <Clock size={16} />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-xs font-semibold text-gray-400 uppercase">From</span>
                                <span className="text-sm font-medium text-gray-900">
                                  {formatDate(b.startDate || b.date)}
                                  <span className="text-gray-400 font-normal ml-1">at {b.startTime || b.time || "N/A"}</span>
                                </span>
                              </div>
                            </div>

                            {/* Arrow Indicator */}
                            <ArrowRight size={16} className="text-gray-300 hidden md:block" />

                            {/* End Date/Time */}
                            <div className="flex items-center gap-3">
                              <div className="p-1.5 bg-indigo-50 rounded text-indigo-600">
                                <Clock size={16} />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-xs font-semibold text-gray-400 uppercase">To</span>
                                <span className="text-sm font-medium text-gray-900">
                                  {formatDate(b.endDate)}
                                  <span className="text-gray-400 font-normal ml-1">at {b.endTime || "N/A"}</span>
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                            Confirmed
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                        No bookings found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View (Visible on Mobile) */}
            <div className="md:hidden space-y-4">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((b) => (
                  <div key={b._id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 rounded-lg">
                          <MapPin size={20} className="text-indigo-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{b.cabinId?.name || "Unknown Cabin"}</h3>
                          <span className="inline-flex mt-1 items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800">
                            Confirmed
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 pt-3 border-t border-gray-50">
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <User size={16} className="text-gray-400" />
                        <span className="font-medium">{b.name}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <Phone size={16} className="text-gray-400" />
                        <span>{b.mobile}</span>
                      </div>

                      {/* Mobile Date Section */}
                      <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-xs text-gray-400 uppercase">From</span>
                            <div className="text-sm font-medium text-gray-900">{formatDate(b.startDate || b.date)}</div>
                            <div className="text-xs text-gray-500">{b.startTime || b.time || "N/A"}</div>
                          </div>
                          <ArrowRight size={16} className="text-gray-300 mt-2" />
                          <div className="text-right">
                            <span className="text-xs text-gray-400 uppercase">To</span>
                            <div className="text-sm font-medium text-gray-900">{formatDate(b.endDate)}</div>
                            <div className="text-xs text-gray-500">{b.endTime || "N/A"}</div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-200 text-gray-500">
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
