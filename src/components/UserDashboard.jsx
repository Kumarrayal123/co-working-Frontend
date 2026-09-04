




// // UserDashboard.jsx - With Profile Completion Circle
// import axios from "axios";
// import {
//   Calendar,
//   Building2,
//   Home,
//   Plus,
//   LogOut,
//   Wallet,
//   IndianRupee,
//   TrendingUp,
//   TrendingDown,
//   Clock,
//   CheckCircle,
//   XCircle,
//   BarChart3,
//   PieChart,
//   Activity,
//   DollarSign,
//   Users,
//   ArrowUpRight,
//   ArrowDownRight,
//   RefreshCw,
//   Sparkles,
//   Zap,
//   Star,
//   Gift,
//   Filter,
//   ChevronDown,
//   Search,
//   Eye,
//   Edit,
//   MapPin,
//   ChevronRight,
//   FileText,
//   Crown,
//   Wifi,
//   ParkingCircle,
//   Lock,
//   Bath,
//   Shield,
//   Armchair,
//   Coffee,
//   Dumbbell,
//   Fan,
//   Tv,
//   Printer,
//   Phone,
//   Upload,
//   Loader2,
//   Receipt,
//   X as XIcon,
//   CreditCard,
//   Menu,
//   ArrowLeft,
//   Clipboard,
//   Percent,
//   Sun,
//   Moon,
//   Clock as ClockIcon,
//   Video,
//   FileVideo,
//   Play,
//   User,
//   AlertCircle,
//   AlertTriangle,
//   ArrowRight
// } from "lucide-react";
// import { useEffect, useState, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import UsersNavbar from "./UsersNavbar";
// import "./Dashboard.css";

// const API_URL = "https://spaceapi.iryax.com";
// const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000";

// // Normal Amenities
// const NORMAL_AMENITIES = [
//   { key: "wifi", label: "Wi-Fi", icon: Wifi },
//   { key: "parking", label: "Parking", icon: ParkingCircle },
//   { key: "lockers", label: "Lockers", icon: Lock },
//   { key: "comfortSeating", label: "Comfort Seating", icon: Armchair },
// ];

// // Exclusive Amenities
// const EXCLUSIVE_AMENITIES = [
//   { key: "wifi", label: "High-Speed Wi-Fi", icon: Wifi },
//   { key: "parking", label: "Reserved Parking", icon: ParkingCircle },
//   { key: "lockers", label: "Secure Lockers", icon: Lock },
//   { key: "privateWashroom", label: "Private Washroom", icon: Bath },
//   { key: "secureAccess", label: "24/7 Secure Access", icon: Shield },
//   { key: "comfortSeating", label: "Premium Seating", icon: Armchair },
//   { key: "coffee", label: "Coffee & Tea", icon: Coffee },
//   { key: "gym", label: "Gym Access", icon: Dumbbell },
//   { key: "ac", label: "Air Conditioning", icon: Fan },
//   { key: "tv", label: "Smart TV", icon: Tv },
//   { key: "printer", label: "Printer Access", icon: Printer },
//   { key: "phone", label: "Conference Phone", icon: Phone },
// ];

// const UserDashboard = () => {
//   const [user, setUser] = useState(null);
//   const [profile, setProfile] = useState(null);
//   const [completionPercentage, setCompletionPercentage] = useState(0);
//   const [missingFields, setMissingFields] = useState([]);
//   const [animatedPercentage, setAnimatedPercentage] = useState(0);
  
//   const [dashboardData, setDashboardData] = useState({
//     totalBookings: 0,
//     totalSpent: 0,
//     myCabinsCount: 0,
//     cabinBookingsCount: 0,
//     cabinRevenue: 0,
//     totalCabins: 0,
//     wallet: {
//       balance: 0,
//       totalEarned: 0,
//       transactions: 0,
//       withdrawals: 0
//     },
//     recentBookings: [],
//     recentCabinBookings: [],
//     bookingChartData: [],
//     monthlyStats: {
//       bookingsThisMonth: 0,
//       spentThisMonth: 0,
//       earningsThisMonth: 0,
//       growth: 0
//     },
//     statusDistribution: {
//       pending: 0,
//       confirmed: 0,
//       active: 0,
//       completed: 0,
//       cancelled: 0
//     }
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   // Filter States
//   const [selectedMonth, setSelectedMonth] = useState("all");
//   const [selectedStatus, setSelectedStatus] = useState("all");
//   const [filteredBookings, setFilteredBookings] = useState([]);
//   const [availableMonths, setAvailableMonths] = useState([]);
//   const [originalBookings, setOriginalBookings] = useState([]);
//   const [dateFrom, setDateFrom] = useState("");
//   const [dateTo, setDateTo] = useState("");
  
//   // My Cabins data
//   const [cabins, setCabins] = useState([]);
  
//   // Cabin Payments data (for total spent)
//   const [cabinPayments, setCabinPayments] = useState({
//     totalAmount: 0,
//     totalOrders: 0,
//     activeOrders: 0,
//     expiredOrders: 0
//   });
  
//   const navigate = useNavigate();

//   // Calculate profile completion percentage - FOR USER
//   const calculateCompletion = (userData) => {
//     const fields = [
//       { key: 'name', label: 'Full Name', required: true },
//       { key: 'email', label: 'Email Address', required: true },
//       { key: 'mobile', label: 'Mobile Number', required: true },
//       { key: 'address', label: 'Address', required: true },
//       { key: 'organizationName', label: 'Organization Name', required: false },
//       { key: 'gstNumber', label: 'GST Number', required: false }
//     ];

//     let completed = 0;
//     let total = 0;
//     const missing = [];

//     fields.forEach(field => {
//       const value = userData[field.key];
      
//       if (field.required) {
//         total++;
//         if (value && value.toString().trim() !== '') {
//           completed++;
//         } else {
//           missing.push(field.label);
//         }
//       } else {
//         total++;
//         if (value && value.toString().trim() !== '') {
//           completed++;
//         } else {
//           missing.push(field.label);
//         }
//       }
//     });

//     let percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
//     if (userData._id && percentage < 10) {
//       percentage = 10;
//     }

//     return { percentage, missing };
//   };

//   // Animate percentage on load
//   useEffect(() => {
//     if (completionPercentage > 0) {
//       let start = 0;
//       const duration = 1500;
//       const step = Math.max(1, Math.floor(completionPercentage / 60));
      
//       const timer = setInterval(() => {
//         start += step;
//         if (start >= completionPercentage) {
//           setAnimatedPercentage(completionPercentage);
//           clearInterval(timer);
//         } else {
//           setAnimatedPercentage(start);
//         }
//       }, 20);
      
//       return () => clearInterval(timer);
//     }
//   }, [completionPercentage]);

//   // Fetch profile for completion
//   const fetchProfile = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) return;

//       const userId = getUserId();
//       if (!userId) return;

//       const res = await axios.get(
//         `${API_URL}/api/auth/profile/${userId}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (res.data.success && res.data.user) {
//         setProfile(res.data.user);
//         const { percentage, missing } = calculateCompletion(res.data.user);
//         setCompletionPercentage(percentage);
//         setMissingFields(missing);
//       }
//     } catch (err) {
//       console.error("Error fetching profile:", err);
//     }
//   };

//   const getUserId = () => {
//     let userId = localStorage.getItem("userId");
    
//     if (!userId) {
//       try {
//         const token = localStorage.getItem("token");
//         if (token) {
//           const payload = JSON.parse(atob(token.split('.')[1]));
//           userId = payload.id || payload.userId || payload._id;
//           if (userId) {
//             localStorage.setItem("userId", userId);
//           }
//         }
//       } catch (err) {
//         console.error("Error extracting userId from token:", err);
//       }
//     }
    
//     return userId;
//   };

//   useEffect(() => {
//     const userData = localStorage.getItem("user");
//     if (userData) {
//       setUser(JSON.parse(userData));
//     }
//     fetchAllData();
//     fetchProfile();
//   }, []);

//   // Fetch ALL data
//   const fetchAllData = async () => {
//     setLoading(true);
//     setError(null);
    
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         setError("Please login to view dashboard");
//         setLoading(false);
//         return;
//       }

//       await fetchUserDashboard();
//       await fetchCabins();
//       await fetchCabinPayments();
      
//     } catch (err) {
//       console.error("Error fetching data:", err);
//       setError("Failed to load dashboard data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // User Dashboard API Call
//   const fetchUserDashboard = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const userData = localStorage.getItem("user");
      
//       const res = await fetch(`${API_URL}/api/bookings/user-dashboard`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'user': userData || ''
//         }
//       });
      
//       const data = await res.json();

//       if (data.success) {
//         const apiData = data.data;
        
//         const bookings = apiData.recentBookings || [];
//         const cabinBookings = apiData.recentCabinBookings || [];
        
//         const statusDist = {
//           pending: 0,
//           confirmed: 0,
//           active: 0,
//           completed: 0,
//           cancelled: 0
//         };

//         console.log('All bookings:', bookings);
//         console.log('All cabin bookings:', cabinBookings);

//         cabinBookings.forEach(booking => {
//           const status = booking.status?.toLowerCase() || 'pending';
//           console.log('Cabin booking status:', booking.status, 'Lowercased:', status);
//           if (status === 'active') {
//             statusDist.active += 1;
//           } else if (status === 'confirmed') {
//             statusDist.confirmed += 1;
//           } else if (status === 'cancelled') {
//             statusDist.cancelled += 1;
//           } else if (status === 'completed') {
//             statusDist.completed += 1;
//           } else {
//             statusDist.pending += 1;
//           }
//         });

//         bookings.forEach(booking => {
//           const status = booking.status?.toLowerCase() || 'pending';
//           console.log('Booking status:', booking.status, 'Lowercased:', status);
//           if (status === 'active') {
//             statusDist.active += 1;
//           } else if (status === 'confirmed') {
//             statusDist.confirmed += 1;
//           } else if (status === 'cancelled') {
//             statusDist.cancelled += 1;
//           } else if (status === 'completed') {
//             statusDist.completed += 1;
//           } else {
//             statusDist.pending += 1;
//           }
//         });

//         console.log('Final status distribution:', statusDist);
        
//         const recentBookings = bookings.length > 0 ? bookings : cabinBookings;
        
//         const now = new Date();
//         const currentMonth = now.getMonth();
//         const currentYear = now.getFullYear();
        
//         const bookingsThisMonth = [...bookings, ...cabinBookings].filter(b => {
//           const date = new Date(b.createdAt);
//           return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
//         }).length;
        
//         setDashboardData({
//           totalBookings: bookings.length,
//           totalSpent: apiData.totalSpent || 0,
//           myCabinsCount: apiData.myCabinsCount || 0,
//           cabinBookingsCount: cabinBookings.length,
//           cabinRevenue: apiData.cabinRevenue || 0,
//           totalCabins: apiData.totalCabins || 0,
//           wallet: apiData.wallet || { balance: 0, totalEarned: 0, transactions: 0, withdrawals: 0 },
//           recentBookings: bookings,
//           recentCabinBookings: cabinBookings,
//           bookingChartData: apiData.bookingChartData || [],
//           monthlyStats: {
//             bookingsThisMonth: bookingsThisMonth,
//             spentThisMonth: apiData.totalSpent || 0,
//             earningsThisMonth: apiData.cabinRevenue || 0,
//             growth: 0
//           },
//           statusDistribution: statusDist
//         });
        
//         setOriginalBookings(recentBookings);
//         setFilteredBookings(recentBookings);
//         generateAvailableMonths(recentBookings);
        
//       } else {
//         console.error("Dashboard API error:", data.error);
//         setError(data.error || "Failed to fetch dashboard data");
//       }
//     } catch (err) {
//       console.error("Dashboard fetch error:", err);
//       setError("Network error. Please check your connection.");
//     }
//   };

//   // Fetch My Cabins
//   const fetchCabins = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) return;
//       const res = await axios.get(`${API_URL}/api/cabins/user`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       const data = res.data.cabins || res.data;
//       const cabinList = Array.isArray(data) ? data : [];
//       setCabins(cabinList);
      
//       setDashboardData(prev => ({
//         ...prev,
//         myCabinsCount: cabinList.length,
//         totalCabins: cabinList.reduce((sum, c) => sum + (parseInt(c.capacity) || 0), 0)
//       }));
//     } catch (err) {
//       console.error("Error fetching cabins:", err);
//       setCabins([]);
//     }
//   };

//   // Fetch Cabin Payments for Total Spent
//   const fetchCabinPayments = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) return;
      
//       const res = await axios.get(
//         `${API_URL}/api/cabins/my-cabinpayments`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
      
//       if (res.data.success) {
//         const stats = res.data.stats || {};
//         const totalAmount = stats.totalAmount || 0;
        
//         setCabinPayments({
//           totalAmount,
//           totalOrders: stats.total || 0,
//           activeOrders: stats.active || 0,
//           expiredOrders: stats.expired || 0
//         });
        
//         setDashboardData(prev => ({
//           ...prev,
//           totalSpent: totalAmount,
//           monthlyStats: {
//             ...prev.monthlyStats,
//             spentThisMonth: totalAmount
//           }
//         }));
//       }
//     } catch (error) {
//       console.error("Failed to fetch cabin payments:", error);
//     }
//   };

//   // Generate available months for filter
//   const generateAvailableMonths = (bookings) => {
//     const months = new Set();
//     bookings.forEach(booking => {
//       if (booking.createdAt) {
//         const date = new Date(booking.createdAt);
//         const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
//         months.add(monthKey);
//       }
//     });
    
//     if (months.size === 0) {
//       const now = new Date();
//       const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
//       months.add(currentMonth);
//     }
    
//     setAvailableMonths(Array.from(months).sort());
//   };

//   // Apply filters
//   const applyFilters = useCallback(() => {
//     let filtered = [...originalBookings];

//     if (selectedMonth !== "all") {
//       const [year, month] = selectedMonth.split('-');
//       filtered = filtered.filter(booking => {
//         if (!booking.createdAt) return false;
//         const date = new Date(booking.createdAt);
//         return date.getFullYear() === parseInt(year) &&
//                (date.getMonth() + 1) === parseInt(month);
//       });
//     }

//     if (selectedStatus !== "all") {
//       filtered = filtered.filter(booking => {
//         if (selectedStatus === 'completed') {
//           return booking.status === 'confirmed' && booking.paymentStatus === 'paid';
//         } else if (selectedStatus === 'active') {
//           const today = new Date().toISOString().split('T')[0];
//           return booking.status === 'confirmed' &&
//                  booking.startDate <= today &&
//                  booking.endDate >= today;
//         } else {
//           return booking.status === selectedStatus;
//         }
//       });
//     }

//     if (dateFrom) {
//       const from = new Date(dateFrom);
//       filtered = filtered.filter(booking => {
//         if (!booking.createdAt) return false;
//         return new Date(booking.createdAt) >= from;
//       });
//     }

//     if (dateTo) {
//       const to = new Date(dateTo);
//       filtered = filtered.filter(booking => {
//         if (!booking.createdAt) return false;
//         return new Date(booking.createdAt) <= to;
//       });
//     }

//     setFilteredBookings(filtered);
//     updateChartData(filtered);
//   }, [originalBookings, selectedMonth, selectedStatus, dateFrom, dateTo]);

//   // Update chart data
//   const updateChartData = (filtered) => {
//     if (filtered.length === 0) {
//       setDashboardData(prev => ({
//         ...prev,
//         bookingChartData: []
//       }));
//       return;
//     }
    
//     const monthMap = {};
//     filtered.forEach(booking => {
//       if (!booking.createdAt) return;
//       const date = new Date(booking.createdAt);
//       const monthName = date.toLocaleString('default', { month: 'short' });
      
//       if (!monthMap[monthName]) {
//         monthMap[monthName] = { month: monthName, bookings: 0 };
//       }
//       monthMap[monthName].bookings += 1;
//     });
    
//     const chartData = Object.values(monthMap);
//     setDashboardData(prev => ({
//       ...prev,
//       bookingChartData: chartData
//     }));
//   };

//   // Clear filters
//   const clearFilters = () => {
//     setSelectedMonth("all");
//     setSelectedStatus("all");
//     setDateFrom("");
//     setDateTo("");
//     setFilteredBookings(originalBookings);
    
//     if (originalBookings.length > 0) {
//       const monthMap = {};
//       originalBookings.forEach(booking => {
//         if (!booking.createdAt) return;
//         const date = new Date(booking.createdAt);
//         const monthName = date.toLocaleString('default', { month: 'short' });
        
//         if (!monthMap[monthName]) {
//           monthMap[monthName] = { month: monthName, bookings: 0 };
//         }
//         monthMap[monthName].bookings += 1;
//       });
      
//       const chartData = Object.values(monthMap);
//       setDashboardData(prev => ({
//         ...prev,
//         bookingChartData: chartData
//       }));
//     }
//   };

//   // Helper functions
//   const formatCurrency = (amount) => {
//     return `₹${amount.toLocaleString('en-IN')}`;
//   };

//   const getStatusBadgeSimple = (status) => {
//     const map = {
//       pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
//       confirmed: { label: 'Confirmed', color: 'bg-emerald-100 text-emerald-700' },
//       active: { label: 'Active', color: 'bg-indigo-100 text-indigo-700' },
//       completed: { label: 'Completed', color: 'bg-blue-100 text-blue-700' },
//       cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700' }
//     };
//     return map[status?.toLowerCase()] || { label: status || 'Unknown', color: 'bg-gray-100 text-gray-700' };
//   };

//   const getCabinStatus = (cabin) => {
//     if (cabin.isActive === true) {
//       return { status: 'Active', color: 'green' };
//     }
//     return { status: 'Inactive', color: 'gray' };
//   };

//   const getImageUrl = (img) => {
//     if (!img) return PLACEHOLDER_IMAGE;
//     if (img.startsWith("http")) return img;
//     const cleanPath = img.replace(/\\/g, "/").replace(/^\/+/, "");
//     return `${API_URL}/${cleanPath}`;
//   };

//   // Circular Progress Component
//   const CircularProgress = ({ percentage, size = 100, strokeWidth = 8 }) => {
//     const radius = (size - strokeWidth) / 2;
//     const circumference = radius * 2 * Math.PI;
//     const offset = circumference - (percentage / 100) * circumference;
    
//     const getColor = (p) => {
//       if (p >= 80) return '#10b981';
//       if (p >= 50) return '#f59e0b';
//       return '#ef4444';
//     };
//     const color = getColor(percentage);

//     return (
//       <div className="relative inline-flex items-center justify-center">
//         <svg
//           width={size}
//           height={size}
//           className="transform -rotate-90"
//         >
//           <circle
//             cx={size / 2}
//             cy={size / 2}
//             r={radius}
//             stroke="#e5e7eb"
//             strokeWidth={strokeWidth}
//             fill="none"
//           />
//           <circle
//             cx={size / 2}
//             cy={size / 2}
//             r={radius}
//             stroke={color}
//             strokeWidth={strokeWidth}
//             fill="none"
//             strokeLinecap="round"
//             strokeDasharray={circumference}
//             strokeDashoffset={offset}
//             className="transition-all duration-500 ease-in-out"
//           />
//         </svg>
//         <div className="absolute inset-0 flex flex-col items-center justify-center">
//           <span className="text-xl font-bold" style={{ color: color }}>
//             {percentage}%
//           </span>
//           <span className="text-[7px] font-medium text-gray-500 uppercase tracking-wider">
//             Complete
//           </span>
//         </div>
//       </div>
//     );
//   };

//   const getCompletionColor = (percentage) => {
//     if (percentage >= 80) return 'text-emerald-600';
//     if (percentage >= 50) return 'text-yellow-600';
//     return 'text-red-500';
//   };

//   const getCompletionEmoji = (percentage) => {
//     if (percentage >= 80) return '🎉';
//     if (percentage >= 50) return '📈';
//     if (percentage >= 30) return '📝';
//     return '⚠️';
//   };

//   const getProfileName = () => {
//     return profile?.name || user?.name || 'User';
//   };

//   // Loading state
//   if (loading) {
//     return (
//       <div className="admin-dash">
//         <UsersNavbar />
//         <div className="admin-dash__loading">
//           <div className="admin-dash__spinner" />
//           <p className="admin-dash__loading-text">Loading dashboard analytics...</p>
//         </div>
//       </div>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <div className="admin-dash">
//         <UsersNavbar />
//         <div className="admin-dash__error">
//           <p className="admin-dash__error-title">Oops!</p>
//           <p className="admin-dash__error-message">{error}</p>
//           <button 
//             onClick={() => fetchAllData()}
//             className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Destructure data
//   const {
//     totalBookings,
//     totalSpent,
//     myCabinsCount,
//     cabinBookingsCount,
//     cabinRevenue,
//     totalCabins,
//     wallet,
//     bookingChartData,
//     monthlyStats,
//     statusDistribution,
//     recentCabinBookings,
//     recentBookings
//   } = dashboardData;

//   // Stats Cards
//   const statsCards = [
//     {
//       label: "My Bookings",
//       value: totalBookings,
//       meta: `${monthlyStats?.bookingsThisMonth || 0} this month`,
//       icon: Calendar,
//       color: "indigo",
//       onClick: () => navigate("/mybookings")
//     },
//     {
//       label: "Pending",
//       value: statusDistribution.pending || 0,
//       meta: "awaiting confirmation",
//       icon: Clock,
//       color: "amber",
//       onClick: () => {
//         setSelectedStatus("pending");
//         setTimeout(() => {
//           window.scrollTo({ top: 1000, behavior: 'smooth' });
//         }, 200);
//       }
//     },
//     {
//       label: "My Cabins",
//       value: myCabinsCount,
//       meta: `${totalCabins} total spaces available`,
//       icon: Home,
//       color: "emerald",
//       onClick: () => navigate("/mycabin")
//     },
//     {
//       label: "Cabin Bookings",
//       value: cabinBookingsCount,
//       meta: `₹${cabinRevenue.toLocaleString('en-IN')} revenue`,
//       icon: Building2,
//       color: "rose",
//       onClick: () => navigate("/cabin-bookings")
//     },
//     {
//       label: "Total Spent",
//       value: formatCurrency(totalSpent),
//       meta: `₹${monthlyStats?.spentThisMonth || 0} total spent`,
//       icon: IndianRupee,
//       color: "purple"
//     },
//     {
//       label: "Wallet Balance",
//       value: formatCurrency(wallet.balance || 0),
//       meta: `${wallet.transactions || 0} transactions`,
//       icon: Wallet,
//       color: "cyan",
//       onClick: () => navigate("/my-wallet")
//     }
//   ];

//   const latestMyBookings = recentBookings.slice(0, 5);
//   const latestCabinBookings = recentCabinBookings.slice(0, 5);
//   const activeBookingsCount = statusDistribution.active || 0;

//   return (
//     <div className="admin-dash" style={{ backgroundColor: '#ffffff' }}>
//       <UsersNavbar />

//       <div className="pt-20 px-3 sm:px-4 md:px-6 lg:px-8 max-w-full mx-auto pb-16">
//         {/* Header (match /userdashboard UI) */}
//         <div className="admin-dash__header" style={{ marginBottom: "8px" }}>
//           <div>
//             <h1 className="admin-dash__greeting" style={{ fontSize: "1.25rem" }}>
//               My <span>Dashboard</span>
//             </h1>
//             <p className="admin-dash__subtitle" style={{ fontSize: "11px" }}>
//               Welcome back, <span className="font-semibold text-gray-700">{getProfileName()}</span>
//             </p>
//           </div>
//           <div className="flex items-center gap-2">
//             {activeBookingsCount > 0 && (
//               <span className="admin-dash__date-pill">
//                 <Activity size={14} />
//                 {activeBookingsCount} Active
//               </span>
//             )}
//           </div>
//         </div>

//         {/* Profile Completion Card (compact to match /userdashboard) */}
//         <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-xl border border-indigo-200 shadow-sm p-3 sm:p-4 mb-5">
//           <div className="flex flex-col sm:flex-row sm:items-center gap-3">
//             <div className="flex-shrink-0 flex justify-center">
//               <CircularProgress 
//                 percentage={animatedPercentage || completionPercentage} 
//                 size={80}
//                 strokeWidth={7}
//               />
//             </div>

//             <div className="flex-1">
//               <div className="flex items-center gap-2 mb-0.5">
//                 <span className="text-lg">{getCompletionEmoji(completionPercentage)}</span>
//                 <h3 className="text-xs font-semibold text-gray-800">Profile Completion</h3>
//               </div>
              
//               <div className="flex flex-wrap items-center gap-1.5">
//                 <div className="flex items-center gap-1 bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded-lg border border-gray-200">
//                   <span className="text-[8px] font-medium text-gray-500">Completed:</span>
//                   <span className={`text-xs font-bold ${getCompletionColor(completionPercentage)}`}>{completionPercentage}%</span>
//                 </div>
//                 <div className="flex items-center gap-1 bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded-lg border border-gray-200">
//                   <span className="text-[8px] font-medium text-gray-500">Pending:</span>
//                   <span className="text-xs font-bold text-amber-600">{missingFields.length}</span>
//                 </div>
//               </div>

//               {missingFields.length > 0 && (
//                 <div className="mt-1 flex flex-wrap items-center gap-1 bg-white/60 backdrop-blur-sm px-2 py-1 rounded-lg border border-amber-200">
//                   <AlertTriangle size={10} className="text-amber-500 flex-shrink-0" />
//                   <p className="text-[8px] text-gray-700">
//                     <span className="font-semibold text-amber-600">{missingFields.length}</span> fields remaining
//                   </p>
//                   <button
//                     onClick={() => navigate("/myprofile")}
//                     className="inline-flex items-center gap-0.5 text-[8px] font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
//                   >
//                     Complete Now <ArrowRight size={8} />
//                   </button>
//                 </div>
//               )}
              
//               {missingFields.length === 0 && (
//                 <div className="mt-1 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
//                   <CheckCircle size={10} className="text-emerald-500" />
//                   <p className="text-[8px] font-medium text-emerald-700">100% complete! 🎉</p>
//                 </div>
//               )}
//             </div>
            
//             <button
//               onClick={() => navigate("/myprofile")}
//               className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 bg-indigo-600 text-white rounded-lg text-[10px] font-medium hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
//             >
//               <User size={12} />
//               View Profile
//             </button>
//           </div>
//         </div>

//         {/* Stats Cards (match /userdashboard card style) */}
//         <div className="admin-dash__stats admin-dash__stats--six" style={{ marginBottom: "16px" }}>
//           {statsCards.map((stat, index) => (
//             <div
//               key={index}
//               className="admin-dash__stat"
//               onClick={stat.onClick}
//               title={stat.onClick ? "Click to view" : undefined}
//             >
//               <div className="admin-dash__stat-top">
//                 <span className="admin-dash__stat-label" style={{ fontSize: "11px" }}>
//                   {stat.label}
//                 </span>
//                 <div className={`admin-dash__stat-icon admin-dash__stat-icon--${stat.color}`}>
//                   <stat.icon size={14} />
//                 </div>
//               </div>
//               <div className="admin-dash__stat-value" style={{ fontSize: "18px", fontWeight: "700" }}>
//                 {stat.value}
//               </div>
//               <div className="admin-dash__stat-meta" style={{ fontSize: "9px" }}>
//                 {stat.meta}
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Row 2: Filter Section */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 mb-4">
//           <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
//             <div className="flex items-center gap-3 w-full lg:w-auto">
//               <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl shadow-md shadow-indigo-200">
//                 <Filter size={18} className="text-white" />
//               </div>
//               <div>
//                 <h4 className="text-sm font-bold text-gray-800">Filter Analytics</h4>
//                 <p className="text-xs text-gray-500 font-medium">
//                   <span className="text-indigo-600 font-bold">{filteredBookings.length}</span> of <span className="text-gray-700 font-bold">{originalBookings.length}</span> bookings found
//                 </p>
//               </div>
//             </div>
//             <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full lg:w-auto">
//               <select
//                 value={selectedMonth}
//                 onChange={(e) => setSelectedMonth(e.target.value)}
//                 className="text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
//               >
//                 <option value="all">All Months</option>
//                 {availableMonths.map(month => {
//                   const [year, monthNum] = month.split('-');
//                   const date = new Date(parseInt(year), parseInt(monthNum) - 1);
//                   return (
//                     <option key={month} value={month}>
//                       {date.toLocaleString('default', { month: 'long', year: 'numeric' })}
//                     </option>
//                   );
//                 })}
//               </select>

//               <select
//                 value={selectedStatus}
//                 onChange={(e) => setSelectedStatus(e.target.value)}
//                 className="text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
//               >
//                 <option value="all">All Status</option>
//                 <option value="pending">Pending</option>
//                 <option value="confirmed">Confirmed</option>
//                 <option value="active">Active</option>
//                 <option value="completed">Completed</option>
//                 <option value="cancelled">Cancelled</option>
//               </select>

//               <div className="flex items-center gap-2 bg-gray-50 px-3 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors">
//                 <Calendar size={14} className="text-gray-400" />
//                 <input
//                   type="date"
//                   value={dateFrom}
//                   onChange={(e) => setDateFrom(e.target.value)}
//                   className="bg-transparent text-xs font-semibold outline-none text-gray-700"
//                   placeholder="From"
//                 />
//               </div>
//               <div className="flex items-center gap-2 bg-gray-50 px-3 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors">
//                 <Calendar size={14} className="text-gray-400" />
//                 <input
//                   type="date"
//                   value={dateTo}
//                   onChange={(e) => setDateTo(e.target.value)}
//                   className="bg-transparent text-xs font-semibold outline-none text-gray-700"
//                   placeholder="To"
//                 />
//               </div>

//               <button
//                 onClick={applyFilters}
//                 className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-xs sm:text-sm font-bold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md shadow-indigo-200/50 hover:shadow-indigo-300/50 flex items-center gap-2"
//               >
//                 <Filter size={14} />
//                 Apply
//               </button>

//               {(selectedMonth !== "all" || selectedStatus !== "all" || dateFrom || dateTo) && (
//                 <button
//                   onClick={clearFilters}
//                   className="px-3 py-2.5 text-xs sm:text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-1.5"
//                 >
//                   <XIcon size={14} />
//                   Reset
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Row 4: Charts Section */}
//         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 mb-6">
//           <div className="flex items-center justify-between mb-4">
//             <div className="flex items-center gap-2">
//               <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl shadow-md shadow-indigo-200">
//                 <BarChart3 size={18} className="text-white" />
//               </div>
//               <div>
//                 <h3 className="text-sm font-bold text-gray-800">Monthly Bookings</h3>
//                 <p className="text-xs text-gray-500">Booking trends over time</p>
//               </div>
//             </div>
//           </div>
//           <div className="h-48 flex items-end justify-between gap-2 px-2">
//             {bookingChartData && bookingChartData.length > 0 ? (
//               bookingChartData.map((item, idx) => {
//                 const maxVal = Math.max(...bookingChartData.map(d => d.bookings), 1);
//                 const height = maxVal > 0 ? (item.bookings / maxVal) * 100 : 0;
//                 return (
//                   <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
//                     <div className="w-full flex justify-center items-end h-32 relative">
//                       <div 
//                         className="w-full max-w-[50px] rounded-t-xl bg-gradient-to-t from-indigo-500 via-indigo-400 to-purple-400 hover:from-indigo-600 hover:via-indigo-500 hover:to-purple-500 transition-all duration-500 shadow-lg shadow-indigo-200/50 group-hover:shadow-indigo-300/50"
//                         style={{ height: `${Math.max(height, 5)}%` }}
//                       />
//                       <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-bold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
//                         {item.bookings} bookings
//                       </div>
//                     </div>
//                     <span className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wide truncate max-w-[50px]">{item.month}</span>
//                   </div>
//                 );
//               })
//             ) : (
//               <div className="w-full text-center text-gray-400 py-12 flex flex-col items-center gap-3">
//                 <BarChart3 size={48} className="opacity-20" />
//                 <p className="text-sm font-medium">No booking data available</p>
//               </div>
//             )}
//           </div>
//           <div className="flex justify-between mt-4 text-xs text-gray-500 bg-gray-50 rounded-xl px-4 py-3">
//             <span className="flex items-center gap-2 font-medium">
//               <span className="w-3 h-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"></span>
//               Total: <span className="text-indigo-600 font-bold">{bookingChartData?.reduce((sum, d) => sum + d.bookings, 0) || 0}</span> bookings
//             </span>
//             <span className="flex items-center gap-2 font-medium">
//               <span className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"></span>
//               <span className="text-emerald-600 font-bold">{bookingChartData?.filter(d => d.bookings > 0).length || 0}</span> active months
//             </span>
//           </div>
//         </div>

//         {/* Row 5: My Cabins Section */}
//         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
//           <div className="flex flex-wrap items-center justify-between gap-3 p-5 border-b border-gray-100 bg-gray-50/50">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl shadow-md shadow-emerald-200">
//                 <Home size={18} className="text-white" />
//               </div>
//               <div>
//                 <h3 className="text-sm font-bold text-gray-800">My Cabins</h3>
//                 <p className="text-xs text-gray-500">Manage your registered spaces</p>
//               </div>
//               <span className="px-3 py-1 text-xs font-bold text-emerald-700 bg-emerald-100 rounded-full">
//                 {cabins.length}
//               </span>
//             </div>
//             <button
//               onClick={() => navigate("/mycabin")}
//               className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
//             >
//               View All <ArrowUpRight size={14} />
//             </button>
//           </div>
//           <div className="p-0 overflow-x-auto">
//             {cabins.length === 0 ? (
//               <div className="flex flex-col items-center justify-center gap-4 py-16 text-gray-400">
//                 <div className="p-4 bg-gray-100 rounded-2xl">
//                   <Home size={48} className="text-gray-300" />
//                 </div>
//                 <div className="text-center">
//                   <p className="text-sm font-semibold text-gray-500">No cabins found</p>
//                   <p className="text-xs text-gray-400 mt-1">You haven't registered any cabins yet.</p>
//                 </div>
//               </div>
//             ) : (
//               <table className="w-full min-w-[700px] text-left">
//                 <thead>
//                   <tr className="border-b border-gray-100 bg-gray-50/50">
//                     <th className="p-4 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">#</th>
//                     <th className="p-4 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Cabin</th>
//                     <th className="p-4 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Address</th>
//                     <th className="p-4 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Type</th>
//                     <th className="p-4 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Price</th>
//                     <th className="p-4 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Status</th>
//                     <th className="p-4 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap text-center">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-100">
//                   {cabins.slice(0, 5).map((cabin, index) => {
//                     const cabinStatus = getCabinStatus(cabin);
//                     const isExclusive = cabin.cabinType === 'exclusive';
//                     return (
//                       <tr key={cabin._id} className="transition-all hover:bg-gradient-to-r hover:from-gray-50 hover:to-indigo-50/30 cursor-pointer group" onClick={() => navigate(`/cabin/${cabin._id}`)}>
//                         <td className="p-4">
//                           <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-xs font-bold text-gray-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
//                             #{index + 1}
//                           </span>
//                         </td>
//                         <td className="p-4">
//                           <div className="flex items-center gap-3">
//                             <div className="flex-shrink-0 w-12 h-12 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shadow-sm">
//                               <img
//                                 src={cabin.images?.[0] ? getImageUrl(cabin.images[0]) : PLACEHOLDER_IMAGE}
//                                 alt={cabin.name}
//                                 className="w-full h-full object-cover"
//                                 onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }}
//                               />
//                             </div>
//                             <div>
//                               <p className="font-bold text-gray-900 text-sm">{cabin.name || 'N/A'}</p>
//                               <p className="text-[10px] text-gray-500 font-medium">{cabin.cabin || 'N/A'}</p>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="p-4">
//                           <div className="flex items-center gap-1.5 text-sm text-gray-600">
//                             <MapPin size={14} className="text-gray-400 flex-shrink-0" />
//                             <span className="truncate max-w-[140px]">{cabin.address || "N/A"}</span>
//                           </div>
//                         </td>
//                         <td className="p-4">
//                           <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold rounded-lg ${
//                             isExclusive 
//                               ? 'bg-gradient-to-r from-amber-100 to-amber-50 text-amber-700 border border-amber-200' 
//                               : 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 border border-blue-200'
//                           }`}>
//                             {isExclusive ? <Crown size={11} /> : null}
//                             {isExclusive ? 'Exclusive' : 'Normal'}
//                           </span>
//                         </td>
//                         <td className="p-4">
//                           <div className="flex items-baseline gap-1">
//                             <span className="text-base font-bold text-gray-900">₹{cabin.price || 0}</span>
//                             <span className="text-[10px] text-gray-400 font-medium">/hr</span>
//                           </div>
//                         </td>
//                         <td className="p-4">
//                           <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold rounded-lg ${
//                             cabinStatus.color === 'green' 
//                               ? 'bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-700 border border-emerald-200' 
//                               : 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-600 border border-gray-200'
//                           }`}>
//                             {cabinStatus.color === 'green' && <CheckCircle size={11} />}
//                             {cabinStatus.status}
//                           </span>
//                         </td>
//                         <td className="p-4 text-center">
//                           <button
//                             onClick={(e) => { e.stopPropagation(); navigate(`/cabin/${cabin._id}`); }}
//                             className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-bold bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 transition-all shadow-md shadow-indigo-200/50 hover:shadow-indigo-300/50"
//                           >
//                             <Eye size={11} /> View
//                           </button>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             )}
//           </div>
//         </div>

//         {/* Row 6: My Latest Bookings */}
//         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
//           <div className="flex flex-wrap items-center justify-between gap-3 p-5 border-b border-gray-100 bg-gray-50/50">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl shadow-md shadow-indigo-200">
//                 <Calendar size={18} className="text-white" />
//               </div>
//               <div>
//                 <h3 className="text-sm font-bold text-gray-800">My Latest Bookings</h3>
//                 <p className="text-xs text-gray-500">Recent space reservations</p>
//               </div>
//               <span className="px-3 py-1 text-xs font-bold text-indigo-700 bg-indigo-100 rounded-full">
//                 {latestMyBookings.length}
//               </span>
//             </div>
//             <button
//               onClick={() => navigate("/mybookings")}
//               className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
//             >
//               View All <ArrowUpRight size={14} />
//             </button>
//           </div>
//           <div className="p-0 overflow-x-auto">
//             {latestMyBookings.length === 0 ? (
//               <div className="flex flex-col items-center justify-center gap-4 py-16 text-gray-400">
//                 <div className="p-4 bg-gray-100 rounded-2xl">
//                   <Calendar size={48} className="text-gray-300" />
//                 </div>
//                 <div className="text-center">
//                   <p className="text-sm font-semibold text-gray-500">No bookings found</p>
//                   <p className="text-xs text-gray-400 mt-1">You haven't made any bookings yet.</p>
//                 </div>
//               </div>
//             ) : (
//               <table className="w-full min-w-[700px] text-left">
//                 <thead>
//                   <tr className="border-b border-gray-100 bg-gray-50/50">
//                     <th className="p-4 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">#</th>
//                     <th className="p-4 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Cabin</th>
//                     <th className="p-4 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Date</th>
//                     <th className="p-4 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Status</th>
//                     <th className="p-4 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Amount</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-100">
//                   {latestMyBookings.map((b, idx) => {
//                     const status = getStatusBadgeSimple(b.status);
//                     return (
//                       <tr key={b._id} className="transition-all hover:bg-gradient-to-r hover:from-gray-50 hover:to-indigo-50/30 cursor-pointer group" onClick={() => navigate("/mybookings")}>
//                         <td className="p-4">
//                           <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-xs font-bold text-gray-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
//                             #{idx + 1}
//                           </span>
//                         </td>
//                         <td className="p-4">
//                           <div>
//                             <p className="font-bold text-gray-900 text-sm">{b.cabinName || 'Unknown'}</p>
//                             <p className="text-[10px] text-gray-500 font-medium flex items-center gap-1">
//                               <MapPin size={10} /> {b.address || 'N/A'}
//                             </p>
//                           </div>
//                         </td>
//                         <td className="p-4">
//                           <p className="text-sm font-semibold text-gray-700">{b.startDate || b.date}</p>
//                           <p className="text-[10px] text-gray-500">{b.startTime || ''} {b.endTime ? `- ${b.endTime}` : ''}</p>
//                         </td>
//                         <td className="p-4">
//                           <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold rounded-lg ${status.color}`}>{status.label}</span>
//                         </td>
//                         <td className="p-4">
//                           <span className="text-base font-bold text-indigo-600">₹{b.amount || b.totalPrice || 0}</span>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             )}
//           </div>
//         </div>

//         {/* Row 7: My Cabin Bookings */}
//         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
//           <div className="flex flex-wrap items-center justify-between gap-3 p-5 border-b border-gray-100 bg-gray-50/50">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl shadow-md shadow-rose-200">
//                 <Building2 size={18} className="text-white" />
//               </div>
//               <div>
//                 <h3 className="text-sm font-bold text-gray-800">My Cabin Bookings</h3>
//                 <p className="text-xs text-gray-500">Bookings received for your cabins</p>
//               </div>
//               <span className="px-3 py-1 text-xs font-bold text-rose-700 bg-rose-100 rounded-full">
//                 {recentCabinBookings.length}
//               </span>
//             </div>
//             <button
//               onClick={() => navigate("/cabin-bookings")}
//               className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
//             >
//               View All <ArrowUpRight size={14} />
//             </button>
//           </div>
//           <div className="p-0 overflow-x-auto">
//             {recentCabinBookings.length === 0 ? (
//               <div className="flex flex-col items-center justify-center gap-4 py-16 text-gray-400">
//                 <div className="p-4 bg-gray-100 rounded-2xl">
//                   <Building2 size={48} className="text-gray-300" />
//                 </div>
//                 <div className="text-center">
//                   <p className="text-sm font-semibold text-gray-500">No cabin bookings found</p>
//                   <p className="text-xs text-gray-400 mt-1">No one has booked your cabins yet.</p>
//                 </div>
//               </div>
//             ) : (
//               <table className="w-full min-w-[700px] text-left">
//                 <thead>
//                   <tr className="border-b border-gray-100 bg-gray-50/50">
//                     <th className="p-4 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">#</th>
//                     <th className="p-4 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Cabin</th>
//                     <th className="p-4 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Customer</th>
//                     <th className="p-4 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Date</th>
//                     <th className="p-4 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Status</th>
//                     <th className="p-4 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Amount</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-100">
//                   {recentCabinBookings.slice(0, 5).map((b, idx) => {
//                     const status = getStatusBadgeSimple(b.status);
//                     return (
//                       <tr key={b._id} className="transition-all hover:bg-gradient-to-r hover:from-gray-50 hover:to-rose-50/30 cursor-pointer group" onClick={() => navigate("/cabin-bookings")}>
//                         <td className="p-4">
//                           <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-xs font-bold text-gray-500 group-hover:bg-rose-100 group-hover:text-rose-600 transition-colors">
//                             #{idx + 1}
//                           </span>
//                         </td>
//                         <td className="p-4">
//                           <div>
//                             <p className="font-bold text-gray-900 text-sm">{b.cabinName || 'Unknown Cabin'}</p>
//                             <p className="text-[10px] text-gray-500 font-medium flex items-center gap-1">
//                               <MapPin size={10} /> {b.address || 'N/A'}
//                             </p>
//                           </div>
//                         </td>
//                         <td className="p-4">
//                           <p className="font-semibold text-gray-800 text-sm">{b.name || 'Unknown'}</p>
//                           <p className="text-[10px] text-gray-500">{b.mobile || b.email || 'N/A'}</p>
//                         </td>
//                         <td className="p-4">
//                           <p className="text-sm font-semibold text-gray-700">{b.startDate || 'N/A'}</p>
//                           <p className="text-[10px] text-gray-500">
//                             {b.startTime || ''} {b.endTime ? `- ${b.endTime}` : ''}
//                           </p>
//                         </td>
//                         <td className="p-4">
//                           <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold rounded-lg ${status.color}`}>
//                             {status.label}
//                           </span>
//                         </td>
//                         <td className="p-4">
//                           <span className="text-base font-bold text-rose-600">₹{b.amount || b.totalPrice || 0}</span>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserDashboard;



// UserDashboard.jsx - Without Profile Completion Circle
import axios from "axios";
import {
  Calendar,
  Building2,
  Home,
  Plus,
  LogOut,
  Wallet,
  IndianRupee,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  BarChart3,
  PieChart,
  DollarSign,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Sparkles,
  Zap,
  Star,
  Gift,
  Filter,
  ChevronDown,
  Search,
  Eye,
  Edit,
  MapPin,
  ChevronRight,
  FileText,
  Crown,
  Wifi,
  ParkingCircle,
  Lock,
  Bath,
  Shield,
  Armchair,
  Coffee,
  Dumbbell,
  Fan,
  Tv,
  Printer,
  Phone,
  Upload,
  Loader2,
  Receipt,
  X as XIcon,
  CreditCard,
  Menu,
  ArrowLeft,
  Clipboard,
  Percent,
  Sun,
  Moon,
  Video,
  FileVideo,
  Play,
  User,
  AlertCircle,
  AlertTriangle,
  ArrowRight
} from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import UsersNavbar from "./UsersNavbar";
import "./UserDashboard.css";

const API_URL = "https://spaceapi.iryax.com";
const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000";

// Normal Amenities
const NORMAL_AMENITIES = [
  { key: "wifi", label: "Wi-Fi", icon: Wifi },
  { key: "parking", label: "Parking", icon: ParkingCircle },
  { key: "lockers", label: "Lockers", icon: Lock },
  { key: "comfortSeating", label: "Comfort Seating", icon: Armchair },
];

// Exclusive Amenities
const EXCLUSIVE_AMENITIES = [
  { key: "wifi", label: "High-Speed Wi-Fi", icon: Wifi },
  { key: "parking", label: "Reserved Parking", icon: ParkingCircle },
  { key: "lockers", label: "Secure Lockers", icon: Lock },
  { key: "privateWashroom", label: "Private Washroom", icon: Bath },
  { key: "secureAccess", label: "24/7 Secure Access", icon: Shield },
  { key: "comfortSeating", label: "Premium Seating", icon: Armchair },
  { key: "coffee", label: "Coffee & Tea", icon: Coffee },
  { key: "gym", label: "Gym Access", icon: Dumbbell },
  { key: "ac", label: "Air Conditioning", icon: Fan },
  { key: "tv", label: "Smart TV", icon: Tv },
  { key: "printer", label: "Printer Access", icon: Printer },
  { key: "phone", label: "Conference Phone", icon: Phone },
];

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  
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
    bookingChartData: [],
    monthlyStats: {
      bookingsThisMonth: 0,
      spentThisMonth: 0,
      earningsThisMonth: 0,
      growth: 0
    },
    statusDistribution: {
      pending: 0,
      confirmed: 0,
      active: 0,
      completed: 0,
      cancelled: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter States
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [availableMonths, setAvailableMonths] = useState([]);
  const [originalBookings, setOriginalBookings] = useState([]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    paymentStatus: "all"
  });
  
  // My Cabins data
  const [cabins, setCabins] = useState([]);
  
  // Cabin Payments data (for total spent)
  const [cabinPayments, setCabinPayments] = useState({
    totalAmount: 0,
    totalOrders: 0,
    activeOrders: 0,
    expiredOrders: 0
  });
  
  const navigate = useNavigate();

  // Fetch profile
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const userId = getUserId();
      if (!userId) return;

      const res = await axios.get(
        `${API_URL}/api/auth/profile/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success && res.data.user) {
        setProfile(res.data.user);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  const getUserId = () => {
    let userId = localStorage.getItem("userId");
    
    if (!userId) {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1]));
          userId = payload.id || payload.userId || payload._id;
          if (userId) {
            localStorage.setItem("userId", userId);
          }
        }
      } catch (err) {
        console.error("Error extracting userId from token:", err);
      }
    }
    
    return userId;
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchAllData();
    fetchProfile();
  }, []);

  // Fetch ALL data
  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login to view dashboard");
        setLoading(false);
        return;
      }

      await fetchUserDashboard();
      await fetchCabins();
      await fetchCabinPayments();
      
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // User Dashboard API Call
  const fetchUserDashboard = async () => {
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
        const apiData = data.data;
        
        const bookings = apiData.recentBookings || [];
        const cabinBookings = apiData.recentCabinBookings || [];
        
        const statusDist = {
          pending: 0,
          confirmed: 0,
          active: 0,
          completed: 0,
          cancelled: 0
        };

        console.log('All bookings:', bookings);
        console.log('All cabin bookings:', cabinBookings);

        cabinBookings.forEach(booking => {
          const status = booking.status?.toLowerCase() || 'pending';
          console.log('Cabin booking status:', booking.status, 'Lowercased:', status);
          if (status === 'active') {
            statusDist.active += 1;
          } else if (status === 'confirmed') {
            statusDist.confirmed += 1;
          } else if (status === 'cancelled') {
            statusDist.cancelled += 1;
          } else if (status === 'completed') {
            statusDist.completed += 1;
          } else {
            statusDist.pending += 1;
          }
        });

        bookings.forEach(booking => {
          const status = booking.status?.toLowerCase() || 'pending';
          console.log('Booking status:', booking.status, 'Lowercased:', status);
          if (status === 'active') {
            statusDist.active += 1;
          } else if (status === 'confirmed') {
            statusDist.confirmed += 1;
          } else if (status === 'cancelled') {
            statusDist.cancelled += 1;
          } else if (status === 'completed') {
            statusDist.completed += 1;
          } else {
            statusDist.pending += 1;
          }
        });

        console.log('Final status distribution:', statusDist);
        
        const recentBookings = bookings.length > 0 ? bookings : cabinBookings;
        
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        const bookingsThisMonth = [...bookings, ...cabinBookings].filter(b => {
          const date = new Date(b.createdAt);
          return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        }).length;
        
        setDashboardData({
          totalBookings: bookings.length,
          totalSpent: apiData.totalSpent || 0,
          myCabinsCount: apiData.myCabinsCount || 0,
          cabinBookingsCount: cabinBookings.length,
          cabinRevenue: apiData.cabinRevenue || 0,
          totalCabins: apiData.totalCabins || 0,
          wallet: apiData.wallet || { balance: 0, totalEarned: 0, transactions: 0, withdrawals: 0 },
          recentBookings: bookings,
          recentCabinBookings: cabinBookings,
          bookingChartData: apiData.bookingChartData || [],
          monthlyStats: {
            bookingsThisMonth: bookingsThisMonth,
            spentThisMonth: apiData.totalSpent || 0,
            earningsThisMonth: apiData.cabinRevenue || 0,
            growth: 0
          },
          statusDistribution: statusDist
        });
        
        setOriginalBookings(recentBookings);
        setFilteredBookings(recentBookings);
        generateAvailableMonths(recentBookings);
        
      } else {
        console.error("Dashboard API error:", data.error);
        setError(data.error || "Failed to fetch dashboard data");
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError("Network error. Please check your connection.");
    }
  };

  // Fetch My Cabins
  const fetchCabins = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await axios.get(`${API_URL}/api/cabins/user`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = res.data.cabins || res.data;
      const cabinList = Array.isArray(data) ? data : [];
      setCabins(cabinList);
      
      setDashboardData(prev => ({
        ...prev,
        myCabinsCount: cabinList.length,
        totalCabins: cabinList.reduce((sum, c) => sum + (parseInt(c.capacity) || 0), 0)
      }));
    } catch (err) {
      console.error("Error fetching cabins:", err);
      setCabins([]);
    }
  };

  // Fetch Cabin Payments for Total Spent
  const fetchCabinPayments = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      
      const res = await axios.get(
        `${API_URL}/api/cabins/my-cabinpayments`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (res.data.success) {
        const stats = res.data.stats || {};
        const totalAmount = stats.totalAmount || 0;
        
        setCabinPayments({
          totalAmount,
          totalOrders: stats.total || 0,
          activeOrders: stats.active || 0,
          expiredOrders: stats.expired || 0
        });
        
        setDashboardData(prev => ({
          ...prev,
          totalSpent: totalAmount,
          monthlyStats: {
            ...prev.monthlyStats,
            spentThisMonth: totalAmount
          }
        }));
      }
    } catch (error) {
      console.error("Failed to fetch cabin payments:", error);
    }
  };

  // Generate available months for filter
  const generateAvailableMonths = (bookings) => {
    const months = new Set();
    bookings.forEach(booking => {
      if (booking.createdAt) {
        const date = new Date(booking.createdAt);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        months.add(monthKey);
      }
    });
    
    if (months.size === 0) {
      const now = new Date();
      const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      months.add(currentMonth);
    }
    
    setAvailableMonths(Array.from(months).sort());
  };

  // Apply filters
  const applyFilters = useCallback(() => {
    let filtered = [...originalBookings];

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(b => {
        const cabinName = b.cabinName?.toLowerCase() || b.cabin?.name?.toLowerCase() || '';
        const address = b.address?.toLowerCase() || b.cabin?.address?.toLowerCase() || '';
        const customerName = b.name?.toLowerCase() || '';
        return cabinName.includes(term) || address.includes(term) || customerName.includes(term);
      });
    }

    // Month filter
    if (selectedMonth !== "all") {
      const [year, month] = selectedMonth.split('-');
      filtered = filtered.filter(booking => {
        if (!booking.createdAt) return false;
        const date = new Date(booking.createdAt);
        return date.getFullYear() === parseInt(year) &&
               (date.getMonth() + 1) === parseInt(month);
      });
    }

    // Status filter
    if (selectedStatus !== "all") {
      filtered = filtered.filter(booking => {
        if (selectedStatus === 'completed') {
          return booking.status === 'confirmed' && booking.paymentStatus === 'paid';
        } else if (selectedStatus === 'active') {
          const today = new Date().toISOString().split('T')[0];
          return booking.status === 'confirmed' &&
                 booking.startDate <= today &&
                 booking.endDate >= today;
        } else {
          return booking.status === selectedStatus;
        }
      });
    }

    // Date from filter
    if (dateFrom) {
      const from = new Date(dateFrom);
      filtered = filtered.filter(booking => {
        if (!booking.createdAt) return false;
        return new Date(booking.createdAt) >= from;
      });
    }

    // Date to filter
    if (dateTo) {
      const to = new Date(dateTo);
      filtered = filtered.filter(booking => {
        if (!booking.createdAt) return false;
        return new Date(booking.createdAt) <= to;
      });
    }

    // Payment status filter
    if (filters.paymentStatus !== "all") {
      filtered = filtered.filter(
        b => (b.paymentStatus?.toLowerCase() || "pending") === filters.paymentStatus
      );
    }

    setFilteredBookings(filtered);
    updateChartData(filtered);
  }, [originalBookings, selectedMonth, selectedStatus, dateFrom, dateTo, searchTerm, filters]);

  // Update chart data
  const updateChartData = (filtered) => {
    if (filtered.length === 0) {
      setDashboardData(prev => ({
        ...prev,
        bookingChartData: []
      }));
      return;
    }
    
    const monthMap = {};
    filtered.forEach(booking => {
      if (!booking.createdAt) return;
      const date = new Date(booking.createdAt);
      const monthName = date.toLocaleString('default', { month: 'short' });
      
      if (!monthMap[monthName]) {
        monthMap[monthName] = { month: monthName, bookings: 0 };
      }
      monthMap[monthName].bookings += 1;
    });
    
    const chartData = Object.values(monthMap);
    setDashboardData(prev => ({
      ...prev,
      bookingChartData: chartData
    }));
  };

  // Clear filters
  const clearFilters = () => {
    setSelectedMonth("all");
    setSelectedStatus("all");
    setDateFrom("");
    setDateTo("");
    setSearchTerm("");
    setFilters({ paymentStatus: "all" });
    setFilteredBookings(originalBookings);
    
    if (originalBookings.length > 0) {
      const monthMap = {};
      originalBookings.forEach(booking => {
        if (!booking.createdAt) return;
        const date = new Date(booking.createdAt);
        const monthName = date.toLocaleString('default', { month: 'short' });
        
        if (!monthMap[monthName]) {
          monthMap[monthName] = { month: monthName, bookings: 0 };
        }
        monthMap[monthName].bookings += 1;
      });
      
      const chartData = Object.values(monthMap);
      setDashboardData(prev => ({
        ...prev,
        bookingChartData: chartData
      }));
    }
  };

  // Helper functions
  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const getStatusBadgeSimple = (status) => {
    const map = {
      pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
      confirmed: { label: 'Confirmed', color: 'bg-emerald-100 text-emerald-700' },
      active: { label: 'Active', color: 'bg-indigo-100 text-indigo-700' },
      completed: { label: 'Completed', color: 'bg-blue-100 text-blue-700' },
      cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700' }
    };
    return map[status?.toLowerCase()] || { label: status || 'Unknown', color: 'bg-gray-100 text-gray-700' };
  };

  const getCabinStatus = (cabin) => {
    if (cabin.isActive === true) {
      return { status: 'Active', color: 'green' };
    }
    return { status: 'Inactive', color: 'gray' };
  };

  const getImageUrl = (img) => {
    if (!img) return PLACEHOLDER_IMAGE;
    if (img.startsWith("http")) return img;
    const cleanPath = img.replace(/\\/g, "/").replace(/^\/+/, "");
    return `${API_URL}/${cleanPath}`;
  };

  const getProfileName = () => {
    return profile?.name || user?.name || 'User';
  };

  // Loading state
  if (loading) {
    return (
      <div className="user-dash">
        <UsersNavbar />
        <div className="user-dash__loading">
          <div className="user-dash__spinner" />
          <p className="user-dash__loading-text">Loading dashboard analytics...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="user-dash">
        <UsersNavbar />
        <div className="user-dash__error">
          <p className="user-dash__error-title">Oops!</p>
          <p className="user-dash__error-message">{error}</p>
          <button
            onClick={() => fetchAllData()}
            className="user-dash__btn user-dash__btn--primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Destructure data
  const {
    totalBookings,
    totalSpent,
    myCabinsCount,
    cabinBookingsCount,
    cabinRevenue,
    totalCabins,
    wallet,
    bookingChartData,
    monthlyStats,
    statusDistribution,
    recentCabinBookings,
    recentBookings
  } = dashboardData;

  // Stats Cards
  const statsCards = [
    {
      label: "My Bookings",
      value: totalBookings,
      meta: `${monthlyStats?.bookingsThisMonth || 0} this month`,
      icon: Calendar,
      color: "indigo",
      onClick: () => navigate("/mybookings")
    },
    {
      label: "My Cabins",
      value: myCabinsCount,
      meta: `${totalCabins} total spaces available`,
      icon: Home,
      color: "emerald",
      onClick: () => navigate("/mycabin")
    },
    {
      label: "Cabin Bookings",
      value: cabinBookingsCount,
      meta: `₹${cabinRevenue.toLocaleString('en-IN')} revenue`,
      icon: Building2,
      color: "rose",
      onClick: () => navigate("/cabin-bookings")
    },
    {
      label: "Total Spent",
      value: formatCurrency(totalSpent),
      meta: `₹${monthlyStats?.spentThisMonth || 0} total spent`,
      icon: IndianRupee,
      color: "purple"
    },
    {
      label: "Wallet Balance",
      value: formatCurrency(wallet.balance || 0),
      meta: `${wallet.transactions || 0} transactions`,
      icon: Wallet,
      color: "cyan",
      onClick: () => navigate("/my-wallet")
    }
  ];

  const latestMyBookings = recentBookings.slice(0, 5);
  const latestCabinBookings = recentCabinBookings.slice(0, 5);

  // Check if any filter is active
  const isFilterActive = selectedMonth !== "all" || 
                         selectedStatus !== "all" || 
                         dateFrom || 
                         dateTo || 
                         searchTerm || 
                         filters.paymentStatus !== "all";

  return (
    <div className="user-dash">
      <UsersNavbar />

      <main className="pt-20 px-3 sm:px-4 md:px-6 lg:px-8 max-w-full mx-auto pb-16">
        {/* Header */}
        <div className="user-dash__header">
          <div>
            <h1 className="user-dash__greeting">
              My <span>Dashboard</span>
            </h1>
            <p className="user-dash__subtitle">
              Welcome back, <span className="font-semibold text-gray-700">{getProfileName()}</span>
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 mb-6">
          {statsCards.map((stat, index) => (
            <div
              key={index}
              className="user-dash__stat cursor-pointer hover:scale-105 transition-transform duration-200"
              onClick={stat.onClick}
              title={stat.onClick ? "Click to view" : undefined}
            >
              <div className="user-dash__stat-top">
                <span className="user-dash__stat-label">
                  {stat.label}
                </span>
                <div className={`user-dash__stat-icon user-dash__stat-icon--${stat.color}`}>
                  <stat.icon size={14} />
                </div>
              </div>
              <div className="user-dash__stat-value">
                {stat.value}
              </div>
              <div className="user-dash__stat-meta">
                {stat.meta}
              </div>
            </div>
          ))}
        </div>

        {/* Row 4: Charts Section */}
        <div className="user-dash__chart">
          <div className="user-dash__chart-header">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl shadow-md shadow-indigo-200">
                <BarChart3 size={18} className="text-white" />
              </div>
              <div>
                <h3 className="user-dash__card-title">Monthly Bookings</h3>
                <p className="user-dash__card-desc">Booking trends over time</p>
              </div>
            </div>
          </div>
          <div className="user-dash__card-body h-48 flex items-end justify-between gap-2 px-2">
            {bookingChartData && bookingChartData.length > 0 ? (
              bookingChartData.map((item, idx) => {
                const maxVal = Math.max(...bookingChartData.map(d => d.bookings), 1);
                const height = maxVal > 0 ? (item.bookings / maxVal) * 100 : 0;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="w-full flex justify-center items-end h-32 relative">
                      <div 
                        className="w-full max-w-[50px] rounded-t-xl bg-gradient-to-t from-indigo-500 via-indigo-400 to-purple-400 hover:from-indigo-600 hover:via-indigo-500 hover:to-purple-500 transition-all duration-500 shadow-lg shadow-indigo-200/50 group-hover:shadow-indigo-300/50"
                        style={{ height: `${Math.max(height, 5)}%` }}
                      />
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-bold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {item.bookings} bookings
                      </div>
                    </div>
                    <span className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wide truncate max-w-[50px]">{item.month}</span>
                  </div>
                );
              })
            ) : (
              <div className="w-full text-center text-gray-400 py-12 flex flex-col items-center gap-3">
                <BarChart3 size={48} className="opacity-20" />
                <p className="text-sm font-medium">No booking data available</p>
              </div>
            )}
          </div>
          <div className="flex justify-between mt-4 text-xs text-gray-500 bg-gray-50 rounded-xl px-4 py-3 user-dash__card-body">
            <span className="flex items-center gap-2 font-medium">
              <span className="w-3 h-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"></span>
              Total: <span className="text-indigo-600 font-bold">{bookingChartData?.reduce((sum, d) => sum + d.bookings, 0) || 0}</span> bookings
            </span>
            <span className="flex items-center gap-2 font-medium">
              <span className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"></span>
              <span className="text-emerald-600 font-bold">{bookingChartData?.filter(d => d.bookings > 0).length || 0}</span> active months
            </span>
          </div>
        </div>

        {/* Filter Section */}
        <div className="user-dash__filters">
          <div className="user-dash__filter-group">
            <div className="flex-1 relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="user-dash__filter-input w-full pl-8"
              />
            </div>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="user-dash__filter-input"
            />
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="user-dash__filter-input"
            />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="user-dash__filter-select"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="user-dash__filter-select"
            >
              <option value="all">All Months</option>
              {availableMonths.map(month => {
                const [year, monthNum] = month.split('-');
                const date = new Date(parseInt(year), parseInt(monthNum) - 1);
                return (
                  <option key={month} value={month}>
                    {date.toLocaleString('default', { month: 'long', year: 'numeric' })}
                  </option>
                );
              })}
            </select>
            <select
              value={filters.paymentStatus}
              onChange={(e) => setFilters(prev => ({ ...prev, paymentStatus: e.target.value }))}
              className="user-dash__filter-select"
            >
              <option value="all">Payment Status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
            {isFilterActive && (
              <button
                onClick={clearFilters}
                className="user-dash__btn"
                title="Clear filters"
              >
                <XIcon size={16} />
              </button>
            )}
          </div>
          <div className="mt-1.5 text-[10px] text-gray-400">
            Showing {filteredBookings.length} of {originalBookings.length} bookings
          </div>
        </div>

        {/* Row 5: My Cabins Section */}
        <div className="user-dash__card">
          <div className="user-dash__card-header">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl shadow-md shadow-emerald-200">
                <Home size={18} className="text-white" />
              </div>
              <div>
                <h3 className="user-dash__card-title">My Cabins</h3>
                <p className="user-dash__card-desc">Manage your registered spaces</p>
              </div>
              <span className="user-dash__badge user-dash__badge--success">
                {cabins.length}
              </span>
            </div>
            <button
              onClick={() => navigate("/mycabin")}
              className="user-dash__card-link"
            >
              View All <ArrowUpRight size={14} />
            </button>
          </div>
          <div className="user-dash__card-body p-0 overflow-x-auto">
            {cabins.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4 py-16 text-gray-400">
                <div className="p-4 bg-gray-100 rounded-2xl">
                  <Home size={48} className="text-gray-300" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-500">No cabins found</p>
                  <p className="text-xs text-gray-400 mt-1">You haven't registered any cabins yet.</p>
                </div>
              </div>
            ) : (
              <table className="user-dash__table">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Cabin</th>
                    <th>Address</th>
                    <th>Type</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cabins.slice(0, 5).map((cabin, index) => {
                    const cabinStatus = getCabinStatus(cabin);
                    const isExclusive = cabin.cabinType === 'exclusive';
                    return (
                      <tr key={cabin._id} className="group cursor-pointer" onClick={() => navigate(`/cabin/${cabin._id}`)}>
                        <td>
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-xs font-bold text-gray-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                            {index + 1}
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-12 h-12 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shadow-sm">
                              <img
                                src={cabin.images?.[0] ? getImageUrl(cabin.images[0]) : PLACEHOLDER_IMAGE}
                                alt={cabin.name}
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }}
                              />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 text-sm">{cabin.name || 'N/A'}</p>
                              <p className="text-[10px] text-gray-500 font-medium">{cabin.cabin || 'N/A'}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center gap-1.5 text-sm text-gray-600">
                            <MapPin size={14} className="text-gray-400 flex-shrink-0" />
                            <span className="truncate max-w-[140px]">{cabin.address || "N/A"}</span>
                          </div>
                        </td>
                        <td>
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold rounded-lg ${
                            isExclusive
                              ? 'bg-gradient-to-r from-amber-100 to-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 border border-blue-200'
                          }`}>
                            {isExclusive ? <Crown size={11} /> : null}
                            {isExclusive ? 'Exclusive' : 'Normal'}
                          </span>
                        </td>
                        <td>
                          <div className="flex items-baseline gap-1">
                            <span className="text-base font-bold text-gray-900">₹{cabin.price || 0}</span>
                            <span className="text-[10px] text-gray-400 font-medium">/hr</span>
                          </div>
                        </td>
                        <td>
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold rounded-lg ${
                            cabinStatus.color === 'green'
                              ? 'bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-600 border border-gray-200'
                          }`}>
                            {cabinStatus.color === 'green' && <CheckCircle size={11} />}
                            {cabinStatus.status}
                          </span>
                        </td>
                        <td className="text-center">
                          <button
                            onClick={(e) => { e.stopPropagation(); navigate(`/cabin/${cabin._id}`); }}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[11px] font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 bg-[length:200%_100%] text-white hover:bg-[position:100%_0] transition-all duration-500 shadow-lg shadow-indigo-300/50 hover:shadow-xl hover:shadow-indigo-400/60 transform hover:scale-105 active:scale-95"
                          >
                            <Eye size={12} /> View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Row 6: My Latest Bookings */}
        <div className="user-dash__card">
          <div className="user-dash__card-header">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl shadow-md shadow-indigo-200">
                <Calendar size={18} className="text-white" />
              </div>
              <div>
                <h3 className="user-dash__card-title">My Latest Bookings</h3>
                <p className="user-dash__card-desc">Recent space reservations</p>
              </div>
              <span className="user-dash__badge user-dash__badge--info">
                {latestMyBookings.length}
              </span>
            </div>
            <button
              onClick={() => navigate("/mybookings")}
              className="user-dash__card-link"
            >
              View All <ArrowUpRight size={14} />
            </button>
          </div>
          <div className="user-dash__card-body p-0 overflow-x-auto">
            {latestMyBookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4 py-16 text-gray-400">
                <div className="p-4 bg-gray-100 rounded-2xl">
                  <Calendar size={48} className="text-gray-300" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-500">No bookings found</p>
                  <p className="text-xs text-gray-400 mt-1">You haven't made any bookings yet.</p>
                </div>
              </div>
            ) : (
              <table className="user-dash__table">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Cabin</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Amount</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {latestMyBookings.map((b, idx) => {
                    const status = getStatusBadgeSimple(b.status);
                    return (
                      <tr key={b._id} className="group cursor-pointer" onClick={() => navigate("/mybookings")}>
                        <td>
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-xs font-bold text-gray-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                           {idx + 1}
                          </span>
                        </td>
                        <td>
                          <div>
                            <p className="font-bold text-gray-900 text-sm">{b.cabinName || 'Unknown'}</p>
                            <p className="text-[10px] text-gray-500 font-medium flex items-center gap-1">
                              <MapPin size={10} /> {b.address || 'N/A'}
                            </p>
                          </div>
                        </td>
                        <td>
                          <p className="text-sm font-semibold text-gray-700">{b.startDate || b.date}</p>
                          <p className="text-[10px] text-gray-500">{b.startTime || ''} {b.endTime ? `- ${b.endTime}` : ''}</p>
                        </td>
                        <td>
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold rounded-lg ${status.color}`}>{status.label}</span>
                        </td>
                        <td>
                          <span className="text-base font-bold text-indigo-600">₹{b.amount || b.totalPrice || 0}</span>
                        </td>
                        <td className="text-center">
                          <button
                            onClick={(e) => { e.stopPropagation(); navigate(`/booking/${b._id}`); }}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[11px] font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 bg-[length:200%_100%] text-white hover:bg-[position:100%_0] transition-all duration-500 shadow-lg shadow-indigo-300/50 hover:shadow-xl hover:shadow-indigo-400/60 transform hover:scale-105 active:scale-95"
                          >
                            <Eye size={12} /> View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Row 7: My Cabin Bookings */}
        <div className="user-dash__card">
          <div className="user-dash__card-header">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl shadow-md shadow-rose-200">
                <Building2 size={18} className="text-white" />
              </div>
              <div>
                <h3 className="user-dash__card-title">My Cabin Bookings</h3>
                <p className="user-dash__card-desc">Bookings received for your cabins</p>
              </div>
              <span className="user-dash__badge user-dash__badge--danger">
                {recentCabinBookings.length}
              </span>
            </div>
            <button
              onClick={() => navigate("/cabin-bookings")}
              className="user-dash__card-link"
            >
              View All <ArrowUpRight size={14} />
            </button>
          </div>
          <div className="user-dash__card-body p-0 overflow-x-auto">
            {recentCabinBookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4 py-16 text-gray-400">
                <div className="p-4 bg-gray-100 rounded-2xl">
                  <Building2 size={48} className="text-gray-300" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-500">No cabin bookings found</p>
                  <p className="text-xs text-gray-400 mt-1">No one has booked your cabins yet.</p>
                </div>
              </div>
            ) : (
              <table className="user-dash__table">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Cabin</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Amount</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentCabinBookings.slice(0, 5).map((b, idx) => {
                    const status = getStatusBadgeSimple(b.status);
                    return (
                      <tr key={b._id} className="group cursor-pointer" onClick={() => navigate("/cabin-bookings")}>
                        <td>
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-xs font-bold text-gray-500 group-hover:bg-rose-100 group-hover:text-rose-600 transition-colors">
                           {idx + 1}
                          </span>
                        </td>
                        <td>
                          <div>
                            <p className="font-bold text-gray-900 text-sm">{b.cabinName || 'Unknown Cabin'}</p>
                            <p className="text-[10px] text-gray-500 font-medium flex items-center gap-1">
                              <MapPin size={10} /> {b.address || 'N/A'}
                            </p>
                          </div>
                        </td>
                        <td>
                          <p className="font-semibold text-gray-800 text-sm">{b.name || 'Unknown'}</p>
                          <p className="text-[10px] text-gray-500">{b.mobile || b.email || 'N/A'}</p>
                        </td>
                        <td>
                          <p className="text-sm font-semibold text-gray-700">{b.startDate || 'N/A'}</p>
                          <p className="text-[10px] text-gray-500">
                            {b.startTime || ''} {b.endTime ? `- ${b.endTime}` : ''}
                          </p>
                        </td>
                        <td>
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold rounded-lg ${status.color}`}>
                            {status.label}
                          </span>
                        </td>
                        <td>
                          <span className="text-base font-bold text-rose-600">₹{b.amount || b.totalPrice || 0}</span>
                        </td>
                        <td className="text-center">
                          <button
                            onClick={(e) => { e.stopPropagation(); navigate(`/cabin-booking/${b._id}`); }}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[11px] font-bold bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 bg-[length:200%_100%] text-white hover:bg-[position:100%_0] transition-all duration-500 shadow-lg shadow-rose-300/50 hover:shadow-xl hover:shadow-rose-400/60 transform hover:scale-105 active:scale-95"
                          >
                            <Eye size={12} /> View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;