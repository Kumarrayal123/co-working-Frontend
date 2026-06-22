import axios from "axios";
import {
  Building,
  Calendar,
  Ticket,
  Users,
  TrendingUp
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import AdminNavbar from "./AdminNavbar";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";


/* ---------------- HELPER: MONTH-WISE BOOKINGS ---------------- */

const getMonthlyBookings = (bookings) => {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  const map = {};

  bookings.forEach((b) => {
    const date = new Date(b.createdAt);
    const month = months[date.getMonth()];
    map[month] = (map[month] || 0) + 1;
  });

  return months.map((m) => ({
    month: m,
    bookings: map[m] || 0,
  }));
};

/* ---------------- DASHBOARD ---------------- */

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [totalCabins, setTotalCabins] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [ownerBookingsCount, setOwnerBookingsCount] = useState(0);
  const [myCabinsCount, setMyCabinsCount] = useState(0);
  const [myBookingsCount, setMyBookingsCount] = useState(0);
  const [recentBookings, setRecentBookings] = useState([]);
  const [bookingChartData, setBookingChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  /* ---------- CABINS ---------- */
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/cabins")
      .then((res) => {
        const cabins = res.data.cabins || res.data;
        setTotalCabins(cabins.length);
      })
      .catch((err) => console.log(err));
  }, []);

  /* ---------- MY CABINS ---------- */
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/cabins/user", getAuthHeader())
      .then((res) => {
        const cabins = res.data.cabins || res.data;
        setMyCabinsCount(Array.isArray(cabins) ? cabins.length : 0);
      })
      .catch((err) => console.error("Error fetching my cabins", err));
  }, []);

  /* ---------- MY BOOKINGS ---------- */
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/bookings/user", getAuthHeader())
      .then((res) => {
        const bookings = res.data.bookings || res.data;
        setMyBookingsCount(Array.isArray(bookings) ? bookings.length : 0);
      })
      .catch((err) => console.error("Error fetching my bookings", err));
  }, []);

  /* ---------- OWNER CABINS BOOKINGS ---------- */
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/bookings/owner-bookings", getAuthHeader())
      .then((res) => {
        const bookings = res.data.bookings || res.data;
        setOwnerBookingsCount(Array.isArray(bookings) ? bookings.length : 0);
      })
      .catch((err) => console.error("Error fetching owner bookings", err));
  }, []);

  /* ---------- BOOKINGS + CHART ---------- */
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [bookingsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/bookings")
        ]);

        const bookings = bookingsRes.data.bookings || bookingsRes.data;
        setTotalBookings(bookings.length);

        const recent = [...bookings]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);

        setRecentBookings(recent);

        const monthlyData = getMonthlyBookings(bookings);
        setBookingChartData(monthlyData);
        
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch dashboard data. Please try again.");
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const adminString = localStorage.getItem("admin");
  const adminUser = adminString ? JSON.parse(adminString) : { name: "Admin" };

  // Custom tooltip for chart
  const ChartTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="admin-dash__tooltip">
          <p className="admin-dash__tooltip-title">{payload[0].payload.month}</p>
          <p className="admin-dash__tooltip-value">Bookings: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="admin-dash">
        <AdminNavbar />
        <div className="admin-dash__loading">
          <div className="admin-dash__spinner" />
          <p className="admin-dash__loading-text">Loading dashboard analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dash">
        <AdminNavbar />
        <div className="admin-dash__error">
          <p className="admin-dash__error-title">Oops!</p>
          <p className="admin-dash__error-message">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dash">
      <AdminNavbar />

      <main className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="admin-dash__header">
          <div>
            <h1 className="admin-dash__greeting">
              Admin <span>Dashboard</span>
            </h1>
            <p className="admin-dash__subtitle">
              Welcome back, <span className="font-bold">{adminUser.name}</span>! Track your workspace bookings and performance.
            </p>
          </div>
          <div className="admin-dash__date-pill">
            <Calendar />
            <span>
              {new Date().toLocaleDateString("en-US", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="admin-dash__stats">
          <div className="admin-dash__stat" onClick={() => navigate("/spaces")}>
            <div className="admin-dash__stat-top">
              <span className="admin-dash__stat-label">Active Cabins</span>
              <div className="admin-dash__stat-icon admin-dash__stat-icon--emerald">
                <Building />
              </div>
            </div>
            <div className="admin-dash__stat-value">{totalCabins}</div>
            <div className="admin-dash__stat-meta">total workspaces</div>
          </div>

          <div className="admin-dash__stat" onClick={() => navigate("/doctorbookings")}>
            <div className="admin-dash__stat-top">
              <span className="admin-dash__stat-label">Cabin Bookings</span>
              <div className="admin-dash__stat-icon admin-dash__stat-icon--indigo">
                <Ticket />
              </div>
            </div>
            <div className="admin-dash__stat-value">{ownerBookingsCount}</div>
            <div className="admin-dash__stat-meta">owner bookings</div>
          </div>

          <div className="admin-dash__stat" onClick={() => navigate("/admincabin")}>
            <div className="admin-dash__stat-top">
              <span className="admin-dash__stat-label">My Cabins</span>
              <div className="admin-dash__stat-icon admin-dash__stat-icon--rose">
                <Building />
              </div>
            </div>
            <div className="admin-dash__stat-value">{myCabinsCount}</div>
            <div className="admin-dash__stat-meta">owned spaces</div>
          </div>

          <div className="admin-dash__stat" onClick={() => navigate("/mybookings")}>
            <div className="admin-dash__stat-top">
              <span className="admin-dash__stat-label">My Bookings</span>
              <div className="admin-dash__stat-icon admin-dash__stat-icon--cyan">
                <Calendar />
              </div>
            </div>
            <div className="admin-dash__stat-value">{myBookingsCount}</div>
            <div className="admin-dash__stat-meta">my reservations</div>
          </div>

          <div className="admin-dash__stat">
            <div className="admin-dash__stat-top">
              <span className="admin-dash__stat-label">Total Bookings</span>
              <div className="admin-dash__stat-icon admin-dash__stat-icon--amber">
                <TrendingUp />
              </div>
            </div>
            <div className="admin-dash__stat-value">{totalBookings}</div>
            <div className="admin-dash__stat-meta">all reservations</div>
          </div>
        </div>
        {/* Charts Grid */}
        <div className="admin-dash__charts-grid">
          {/* Booking Trends Chart */}
          <div className="admin-dash__card admin-dash__chart-wrap">
            <div className="admin-dash__card-header">
              <div>
                <h3 className="admin-dash__card-title">Booking Trends</h3>
              </div>
              <select className="admin-dash__month-input">
                <option>This Year</option>
                <option>Last Year</option>
              </select>
            </div>
            <div className="admin-dash__card-body flex-1">
              {bookingChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bookingChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748b', fontSize: 11 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748b', fontSize: 11 }}
                    />
                    <Tooltip content={<ChartTooltip />} cursor={{ fill: '#f8fafc' }} />
                    <Bar dataKey="bookings" radius={[4, 4, 0, 0]} barSize={20} fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="admin-dash__empty-chart">No booking data available</div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="admin-dash__card admin-dash__chart-wrap">
            <div className="admin-dash__card-header">
              <div>
                <h3 className="admin-dash__card-title">Recent Activity</h3>
                <p className="admin-dash__card-desc">Latest workspace reservations</p>
              </div>
            </div>
            <div className="admin-dash__card-body flex-1">
              {recentBookings.length === 0 ? (
                <div className="admin-dash__empty-chart">
                  <Calendar />
                  <p>No recent activity</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentBookings.slice(0, 5).map((b) => (
                    <div key={b._id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold text-sm shrink-0 border border-emerald-100">
                        {b.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {b.name || "User"}
                        </p>
                        <p className="text-xs text-slate-500 mb-1 truncate">
                          Reserved <span className="font-medium text-slate-700">{b.cabinId?.name || "Workspace"}</span>
                        </p>
                        <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wide">
                          {new Date(b.createdAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
