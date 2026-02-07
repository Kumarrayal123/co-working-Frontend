import axios from "axios";
import {
  Building,
  Calendar,
  TrendingDown,
  TrendingUp,
  Users
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

/* ---------------- STAT CARD ---------------- */

const StatCard = ({ title, value, icon: Icon, colorClass, trend, isPositive }) => (
  // Compact card design: p-4 padding, smaller text sizes
  <div className="bg-white p-4 rounded-[1.25rem] shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 group">
    <div className="flex items-start justify-between mb-3">
      <div className={`p-2.5 rounded-xl ${colorClass} transition-transform group-hover:scale-110`}>
        <Icon size={18} className="text-white" />
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${isPositive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
          }`}>
          {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          <span>{trend}</span>
        </div>
      )}
    </div>

    <h3 className="text-xl font-black text-slate-900 tracking-tight mb-0.5">{value}</h3>
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{title}</p>
  </div>
);

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
  const [totalCabins, setTotalCabins] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [myCabinsCount, setMyCabinsCount] = useState(0);
  const [myBookingsCount, setMyBookingsCount] = useState(0);
  const [recentBookings, setRecentBookings] = useState([]);
  const [bookingChartData, setBookingChartData] = useState([]);

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

  /* ---------- BOOKINGS + CHART ---------- */
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/bookings")
      .then((res) => {
        const bookings = res.data.bookings || res.data;

        setTotalBookings(bookings.length);

        const recent = [...bookings]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);

        setRecentBookings(recent);

        const monthlyData = getMonthlyBookings(bookings);
        setBookingChartData(monthlyData);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <AdminNavbar />

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="pt-2 text-2xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h2>
          <p className="text-slate-500 font-medium text-sm">Welcome back, Admin</p>
        </div>

        {/* ---------- STATS GRID ---------- */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <StatCard
            title="Users"
            value={1}
            icon={Users}
            colorClass="bg-blue-500 shadow-blue-500/30"
          />

          <StatCard
            title="Active Cabins"
            value={totalCabins}
            icon={Building}
            colorClass="bg-emerald-500 shadow-emerald-500/30"
          />

          <StatCard
            title="My Cabins"
            value={myCabinsCount}
            icon={Building}
            colorClass="bg-slate-900 shadow-slate-900/30"
          />

          <StatCard
            title="My Bookings"
            value={myBookingsCount}
            icon={Calendar}
            colorClass="bg-indigo-500 shadow-indigo-500/30"
          />
        </div>

        {/* ---------- CONTENT ---------- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ---------- BOOKINGS BAR CHART ---------- */}
          <div className="lg:col-span-2 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                Booking Trends
              </h3>
              <select className="bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold rounded-lg px-3 py-2 outline-none focus:border-emerald-500">
                <option>This Year</option>
                <option>Last Year</option>
              </select>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={bookingChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis
                  dataKey="month"
                  stroke="#94A3B8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis
                  stroke="#94A3B8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  dx={-10}
                />
                <Tooltip
                  cursor={{ fill: '#F8FAFC' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar
                  dataKey="bookings"
                  fill="#10B981"   // Emerald-500
                  radius={[6, 6, 0, 0]}
                  barSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* ---------- RECENT BOOKINGS ---------- */}
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-6">
              Recent Activity
            </h3>

            <div className="space-y-5">
              {recentBookings.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-sm">
                  No recent activity
                </div>
              ) : (
                recentBookings.map((b) => (
                  <div key={b._id} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold text-xs shrink-0 border border-emerald-100">
                      {b.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">
                        {b.name || "User"}
                      </p>
                      <p className="text-xs font-medium text-slate-500 mb-0.5 truncate">
                        Reserved <span className="text-slate-700">{b.cabinId?.name || "Workspace"}</span>
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        {new Date(b.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button className="w-full mt-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition-colors">
              View All Bookings
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
