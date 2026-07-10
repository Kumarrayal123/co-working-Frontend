import { Calendar, Building2, Home, Plus, LogOut, Wallet, IndianRupee, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UsersNavbar from "./UsersNavbar";
import "./Dashboard.css";

const API_URL = "http://localhost:5000";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    totalBookings: 0,
    totalSpent: 0,
    myCabinsCount: 0,
    cabinBookingsCount: 0,
    cabinRevenue: 0,
    totalCabins: 0,
    wallet: {
      balance: 0,
      totalEarned: 0,
      transactions: 0,
      withdrawals: 0
    },
    recentBookings: [],
    recentCabinBookings: [],
    bookingChartData: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchUserDashboard();
  }, []);

  const fetchUserDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");
      
      const res = await fetch(`${API_URL}/api/bookings/user-dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'user': userData || ''
        }
      });
      
      const data = await res.json();

      if (data.success) {
        setDashboardData(data.data);
      } else {
        setError(data.error || "Failed to fetch dashboard data");
      }
    } catch (err) {
      console.error("Dashboard error:", err);
      setError("Failed to fetch dashboard data. Please try again.");
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

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const getStatusBadge = (status, paymentStatus) => {
    if (status === 'confirmed' && paymentStatus === 'paid') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-100 text-emerald-700">
          ✓ Completed
        </span>
      );
    }
    if (status === 'confirmed') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-100 text-blue-700">
          Confirmed
        </span>
      );
    }
    if (status === 'cancelled') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-100 text-red-700">
          ✕ Cancelled
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-yellow-100 text-yellow-700">
        Pending
      </span>
    );
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
      icon: Wallet,
      label: "My Wallet",
      path: "//my-wallet",
      description: "View wallet & transactions"
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

  if (error) {
    return (
      <div className="admin-dash">
        <UsersNavbar />
        <div className="admin-dash__error">
          <p className="admin-dash__error-title">Oops!</p>
          <p className="admin-dash__error-message">{error}</p>
        </div>
      </div>
    );
  }

  const {
    totalBookings,
    totalSpent,
    myCabinsCount,
    cabinBookingsCount,
    cabinRevenue,
    totalCabins,
    wallet,
    recentBookings,
    recentCabinBookings,
    bookingChartData
  } = dashboardData;

  // Stats cards
  const statsCards = [
    {
      label: "My Bookings",
      value: totalBookings,
      meta: "workspace reservations",
      icon: Calendar,
      color: "indigo",
      onClick: () => navigate("/mybookings")
    },
    {
      label: "My Cabins",
      value: myCabinsCount,
      meta: "properties listed",
      icon: Home,
      color: "emerald",
      onClick: () => navigate("/mycabin")
    },
    {
      label: "Cabin Bookings",
      value: cabinBookingsCount,
      meta: "bookings on your cabins",
      icon: Calendar,
      color: "rose",
      onClick: () => navigate("/cabin-bookings")
    },
    {
      label: "Total Cabins",
      value: totalCabins,
      meta: "available spaces",
      icon: Building2,
      color: "violet",
      onClick: () => navigate("/spaces")
    },
    {
      label: "Total Spent",
      value: formatCurrency(totalSpent),
      meta: "on workspace bookings",
      icon: IndianRupee,
      color: "amber"
    },
    {
      label: "Wallet Balance",
      value: formatCurrency(wallet.balance || 0),
      meta: `${wallet.transactions || 0} transactions`,
      icon: Wallet,
      color: "cyan",
      onClick: () => navigate("/userwallet")
    }
  ];

  return (
    <div className="admin-dash">
      <UsersNavbar />

      <main className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16">
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
            <Calendar size={16} />
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
          {statsCards.map((stat, index) => (
            <div
              key={index}
              className="admin-dash__stat"
              onClick={stat.onClick}
              style={{ cursor: stat.onClick ? 'pointer' : 'default' }}
            >
              <div className="admin-dash__stat-top">
                <span className="admin-dash__stat-label">{stat.label}</span>
                <div className={`admin-dash__stat-icon admin-dash__stat-icon--${stat.color}`}>
                  <stat.icon size={18} />
                </div>
              </div>
              <div className="admin-dash__stat-value">{stat.value}</div>
              <div className="admin-dash__stat-meta">{stat.meta}</div>
            </div>
          ))}
        </div>

        {/* Charts/Quick Actions Grid */}
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

          {/* Recent Bookings Card */}
          <div className="admin-dash__card">
            <div className="admin-dash__card-header">
              <div>
                <h3 className="admin-dash__card-title">Recent Bookings</h3>
                <p className="admin-dash__card-desc">Your latest reservations</p>
              </div>
            </div>
            <div className="admin-dash__card-body">
              {recentBookings.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <Calendar size={32} className="mx-auto text-slate-300 mb-2" />
                  <p>No recent bookings</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {recentBookings.map((b) => (
                    <div key={b._id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs shrink-0">
                        {b.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold text-slate-900 truncate">
                            {b.cabinName}
                          </p>
                          {getStatusBadge(b.status, b.paymentStatus)}
                        </div>
                        <p className="text-xs text-slate-500">
                          {b.name} • {formatCurrency(b.amount)}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {new Date(b.createdAt).toLocaleDateString("en-US", {
                            month: 'short',
                            day: 'numeric'
                          })}
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

export default UserDashboard;