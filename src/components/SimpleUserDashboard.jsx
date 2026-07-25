import axios from "axios";
import {
  Calendar,
  Building2,
  Home,
  LogOut,
  Wallet,
  IndianRupee,
  Clock,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  MapPin,
  Eye,
  ChevronDown,
  Filter,
  Search,
  X as XIcon
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SimpleUserNavbar from "./SimpleUserNavbar";

const API_URL = "https://spaceapi.iryax.com";

function SimpleUserDashboard() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    active: 0,
    completed: 0,
    cancelled: 0
  });
  
  // Filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login to view your bookings");
        setLoading(false);
        return;
      }

      const res = await axios.get(
        `${API_URL}/api/bookings/user`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const bookingsData = res.data.bookings || [];
      setBookings(bookingsData);
      setFilteredBookings(bookingsData);
      
      // Calculate stats
      const statsData = {
        total: bookingsData.length,
        pending: 0,
        confirmed: 0,
        active: 0,
        completed: 0,
        cancelled: 0
      };

      bookingsData.forEach(b => {
        const status = b.status?.toLowerCase() || 'pending';
        if (status === 'confirmed' && b.paymentStatus === 'paid') {
          statsData.completed += 1;
        } else if (status === 'confirmed') {
          statsData.confirmed += 1;
        } else if (status === 'cancelled') {
          statsData.cancelled += 1;
        } else if (status === 'active') {
          statsData.active += 1;
        } else {
          statsData.pending += 1;
        }
      });

      setStats(statsData);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError(err.response?.data?.message || "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...bookings];

    if (statusFilter !== "all") {
      filtered = filtered.filter(b => {
        const status = b.status?.toLowerCase() || 'pending';
        if (statusFilter === 'completed') {
          return status === 'confirmed' && b.paymentStatus === 'paid';
        } else if (statusFilter === 'active') {
          const today = new Date().toISOString().split('T')[0];
          return status === 'confirmed' && b.startDate <= today && b.endDate >= today;
        } else {
          return status === statusFilter;
        }
      });
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(b => {
        const cabinName = b.cabinId?.name?.toLowerCase() || '';
        const address = b.cabinId?.address?.toLowerCase() || '';
        const customerName = b.name?.toLowerCase() || '';
        return cabinName.includes(term) || address.includes(term) || customerName.includes(term);
      });
    }

    setFilteredBookings(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [statusFilter, searchTerm, bookings]);

  const clearFilters = () => {
    setStatusFilter("all");
    setSearchTerm("");
    setFilteredBookings(bookings);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status, paymentStatus) => {
    const statusMap = {
      pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
      confirmed: { 
        label: paymentStatus === 'paid' ? 'Completed' : 'Confirmed', 
        color: paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700' 
      },
      active: { label: 'Active', color: 'bg-indigo-100 text-indigo-700' },
      completed: { label: 'Completed', color: 'bg-emerald-100 text-emerald-700' },
      cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700' }
    };
    const key = status?.toLowerCase() || 'pending';
    return statusMap[key] || { label: status || 'Unknown', color: 'bg-gray-100 text-gray-700' };
  };

  const formatCurrency = (amount) => {
    return `₹${Number(amount).toLocaleString('en-IN')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SimpleUserNavbar />
        <div className="pt-24 px-4 max-w-full mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-gray-500 text-sm">Loading your bookings...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SimpleUserNavbar />
        <div className="pt-24 px-4 max-w-full mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-md mx-auto">
            <XCircle size={40} className="text-red-500 mx-auto mb-3" />
            <p className="text-red-600 font-medium">{error}</p>
            <button 
              onClick={fetchBookings}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SimpleUserNavbar />

      {/* Full width container - NO left/right padding restrictions */}
      <div className="pt-24 px-4 sm:px-6 md:px-8 max-w-full mx-auto pb-16">
        
        {/* Header - Full Width */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
            <p className="text-sm text-gray-500">Manage all your workspace bookings in one place</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/spaces")}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition flex items-center gap-2 shadow-sm shadow-indigo-200"
            >
              <Building2 size={16} />
              Find New Space
            </button>
          </div>
        </div>

        {/* Stats Cards - Full width with proper spacing */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3 mb-4">
          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 text-center">
            <p className="text-[9px] sm:text-[10px] text-gray-500 font-medium uppercase tracking-wider">Total</p>
            <p className="text-lg sm:text-xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 text-center">
            <p className="text-[9px] sm:text-[10px] text-gray-500 font-medium uppercase tracking-wider">Pending</p>
            <p className="text-lg sm:text-xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 text-center">
            <p className="text-[9px] sm:text-[10px] text-gray-500 font-medium uppercase tracking-wider">Confirmed</p>
            <p className="text-lg sm:text-xl font-bold text-blue-600">{stats.confirmed}</p>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 text-center">
            <p className="text-[9px] sm:text-[10px] text-gray-500 font-medium uppercase tracking-wider">Active</p>
            <p className="text-lg sm:text-xl font-bold text-indigo-600">{stats.active}</p>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 text-center">
            <p className="text-[9px] sm:text-[10px] text-gray-500 font-medium uppercase tracking-wider">Completed</p>
            <p className="text-lg sm:text-xl font-bold text-emerald-600">{stats.completed}</p>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 text-center">
            <p className="text-[9px] sm:text-[10px] text-gray-500 font-medium uppercase tracking-wider">Cancelled</p>
            <p className="text-lg sm:text-xl font-bold text-red-600">{stats.cancelled}</p>
          </div>
        </div>

        {/* Filters - Full width */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 mb-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by cabin name or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              {(statusFilter !== "all" || searchTerm) && (
                <button
                  onClick={clearFilters}
                  className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
                  title="Clear filters"
                >
                  <XIcon size={16} />
                </button>
              )}
            </div>
          </div>
          <div className="mt-1.5 text-[10px] text-gray-400">
            Showing {filteredBookings.length} of {bookings.length} bookings
          </div>
        </div>

        {/* Bookings Table - Full width with no padding constraints */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          {filteredBookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <Calendar size={48} className="opacity-20 mb-3" />
              <p className="text-sm font-medium">No bookings found</p>
              <p className="text-xs text-gray-400 mt-1">
                {bookings.length === 0 ? "You haven't made any bookings yet." : "Try adjusting your filters."}
              </p>
              {bookings.length === 0 && (
                <button
                  onClick={() => navigate("/spaces")}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
                >
                  Browse Spaces
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-3 py-2.5 text-[9px] font-bold tracking-wider text-gray-500 uppercase">#</th>
                    <th className="px-3 py-2.5 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Cabin</th>
                    <th className="px-3 py-2.5 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Date &amp; Time</th>
                    <th className="px-3 py-2.5 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Status</th>
                    <th className="px-3 py-2.5 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Amount</th>
                    <th className="px-3 py-2.5 text-[9px] font-bold tracking-wider text-gray-500 uppercase text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredBookings.map((booking, idx) => {
                    const status = getStatusBadge(booking.status, booking.paymentStatus);
                    return (
                      <tr key={booking._id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="px-3 py-2.5">
                          <span className="text-[10px] font-semibold text-gray-400">#{idx + 1}</span>
                        </td>
                        <td className="px-3 py-2.5">
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">
                              {booking.cabinId?.name || 'Unknown Cabin'}
                            </p>
                            <p className="text-[9px] text-gray-400 flex items-center gap-0.5">
                              <MapPin size={9} />
                              {booking.cabinId?.address?.split(',')[0] || 'N/A'}
                            </p>
                          </div>
                        </td>
                        <td className="px-3 py-2.5">
                          <p className="text-sm text-gray-700">{formatDate(booking.startDate)}</p>
                          <p className="text-[9px] text-gray-400">
                            {booking.startTime} - {booking.endTime}
                          </p>
                        </td>
                        <td className="px-3 py-2.5">
                          <span className={`px-2.5 py-0.5 text-[9px] font-bold rounded-full ${status.color}`}>
                            {status.label}
                          </span>
                        </td>
                        <td className="px-3 py-2.5">
                          <span className="text-sm font-bold text-indigo-600">
                            {formatCurrency(booking.totalPrice)}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-center">
                          <button
                            onClick={() => navigate(`/booking/${booking._id}`)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-[9px] font-medium hover:bg-indigo-100 transition"
                          >
                            <Eye size={11} /> View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-[9px] text-gray-400 font-medium tracking-wider">
          © IRYAX SPACE — All Rights Reserved
        </div>
      </div>
    </div>
  );
}

export default SimpleUserDashboard;