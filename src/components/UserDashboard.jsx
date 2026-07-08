import { Calendar, Building2, Home, Plus, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UsersNavbar from "./UsersNavbar";
import "./Dashboard.css";

const API_URL = "http://localhost:5000";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalBookings: 0,
    myCabins: 0,
    totalSpent: 0,
    totalCabins: 0,
    cabinBookings: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    // Fetch user stats
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      // Fetch bookings
      const bookingsRes = await fetch(`${API_URL}/api/bookings/user`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const bookingsData = await bookingsRes.json();
      const bookings = bookingsData.bookings || [];

      // Fetch my cabins
      const cabinsRes = await fetch(`${API_URL}/api/cabins/user`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const cabinsData = await cabinsRes.json();
      const cabins = cabinsData.cabins || cabinsData || [];

      // Fetch owner bookings
      const ownerBookingsRes = await fetch(`${API_URL}/api/bookings/owner-bookings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const ownerBookingsData = await ownerBookingsRes.json();
      const ownerBookings = ownerBookingsData.bookings || [];

      // Fetch ALL cabins (public endpoint)
      const allCabinsRes = await fetch(`${API_URL}/api/cabins`);
      const allCabinsData = await allCabinsRes.json();
      const allCabins = Array.isArray(allCabinsData) ? allCabinsData : [];

      // Calculate stats
      const totalSpent = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);

      setStats({
        totalBookings: bookings.length,
        myCabins: cabins.length,
        totalSpent,
        totalCabins: allCabins.length,
        cabinBookings: ownerBookings.length
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    navigate("/login");
  };

  const navItems = [
    {
      icon: Building2,
      label: "All Spaces",
      path: "/spaces",
      description: "Browse available coworking spaces"
    },
    {
      icon: Calendar,
      label: "My Bookings",
      path: "/mybookings",
      description: "View your booking history"
    },
    {
      icon: Home,
      label: "My Cabins",
      path: "/mycabin",
      description: "Manage your listed properties"
    },
    {
      icon: Plus,
      label: "Add Cabin",
      path: "/addcabin",
      description: "List a new workspace"
    }
  ];

  if (loading) {
    return (
      <div className="admin-dash">
        <UsersNavbar />
        <div className="admin-dash__loading">
          <div className="admin-dash__spinner" />
          <p className="admin-dash__loading-text">Loading dashboard analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dash">
      <UsersNavbar />

      <main className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="admin-dash__header">
          <div>
            <h1 className="admin-dash__greeting">
              Welcome back, <span>{user?.name?.split(' ')[0] || 'User'}</span>!
            </h1>
            <p className="admin-dash__subtitle">
              Manage your workspace bookings and properties from one place.
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
          <div className="admin-dash__stat" onClick={() => navigate("/mybookings")}>
            <div className="admin-dash__stat-top">
              <span className="admin-dash__stat-label">Total Bookings</span>
              <div className="admin-dash__stat-icon admin-dash__stat-icon--indigo">
                <Calendar />
              </div>
            </div>
            <div className="admin-dash__stat-value">{stats.totalBookings}</div>
            <div className="admin-dash__stat-meta">workspace reservations</div>
          </div>

          <div className="admin-dash__stat" onClick={() => navigate("/mycabin")}>
            <div className="admin-dash__stat-top">
              <span className="admin-dash__stat-label">My Cabins</span>
              <div className="admin-dash__stat-icon admin-dash__stat-icon--emerald">
                <Home />
              </div>
            </div>
            <div className="admin-dash__stat-value">{stats.myCabins}</div>
            <div className="admin-dash__stat-meta">properties listed</div>
          </div>

          <div className="admin-dash__stat" onClick={() => navigate("/cabin-bookings")}>
            <div className="admin-dash__stat-top">
              <span className="admin-dash__stat-label">Cabin Bookings</span>
              <div className="admin-dash__stat-icon admin-dash__stat-icon--rose">
                <Calendar />
              </div>
            </div>
            <div className="admin-dash__stat-value">{stats.cabinBookings || 0}</div>
            <div className="admin-dash__stat-meta">bookings on your cabins</div>
          </div>

          <div className="admin-dash__stat" onClick={() => navigate("/spaces")}>
            <div className="admin-dash__stat-top">
              <span className="admin-dash__stat-label">Total Cabins</span>
              <div className="admin-dash__stat-icon admin-dash__stat-icon--violet">
                <Building2 />
              </div>
            </div>
            <div className="admin-dash__stat-value">{stats.totalCabins}</div>
            <div className="admin-dash__stat-meta">available spaces</div>
          </div>

          <div className="admin-dash__stat">
            <div className="admin-dash__stat-top">
              <span className="admin-dash__stat-label">Total Spent</span>
              <div className="admin-dash__stat-icon admin-dash__stat-icon--amber">
                <span className="font-bold text-base">₹</span>
              </div>
            </div>
            <div className="admin-dash__stat-value">₹{stats.totalSpent.toLocaleString('en-IN')}</div>
            <div className="admin-dash__stat-meta">on workspace bookings</div>
          </div>
        </div>

        {/* Charts/Card Grid */}
        <div className="admin-dash__charts-grid">
          {/* Quick Actions Card */}
          <div className="admin-dash__card">
            <div className="admin-dash__card-header">
              <div>
                <h3 className="admin-dash__card-title">Quick Actions</h3>
                <p className="admin-dash__card-desc">Common shortcuts and workspace tools</p>
              </div>
            </div>
            <div className="admin-dash__card-body">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {navItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className="group bg-slate-50 rounded-xl p-4 border border-slate-100 shadow-sm hover:shadow-md hover:bg-slate-100 transition-all text-left flex items-start gap-4"
                  >
                    <div className="p-3 bg-white rounded-xl w-fit group-hover:bg-indigo-50 transition-colors shrink-0">
                      <item.icon className="text-slate-600 group-hover:text-indigo-600 transition-colors" size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">{item.label}</h4>
                      <p className="text-xs text-slate-500 mt-1">{item.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Member Profile Info */}
          <div className="admin-dash__card">
            <div className="admin-dash__card-header">
              <div>
                <h3 className="admin-dash__card-title">Member Profile</h3>
                <p className="admin-dash__card-desc">Your personal space credentials</p>
              </div>
            </div>
            <div className="admin-dash__card-body flex flex-col justify-between h-[calc(100%-70px)] min-h-[220px]">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
                  {user?.name?.substring(0, 2).toUpperCase() || "US"}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">{user?.name || 'User'}</h4>
                  <p className="text-slate-500 text-sm">{user?.email || 'user@example.com'}</p>
                  <p className="text-slate-400 text-xs mt-1 font-medium">
                    {user?.mobile ? `+91 ${user.mobile}` : 'No phone number added'}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => navigate("/myprofile")}
                  className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors text-center"
                >
                  Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
