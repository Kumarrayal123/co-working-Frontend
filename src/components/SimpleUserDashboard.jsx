
// import axios from "axios";
// import {
//   Calendar,
//   Ticket,
//   Building2,
//   Home,
//   LogOut,
//   Wallet,
//   IndianRupee,
//   Clock,
//   CheckCircle,
//   XCircle,
//   ArrowUpRight,
//   MapPin,
//   Eye,
//   ChevronDown,
//   Filter,
//   Search,
//   X as XIcon,
//   RefreshCw,
//   FileDown,
//   User,
//   AlertCircle,
//   AlertTriangle,
//   ArrowRight,
//   Mail,
//   Phone
// } from "lucide-react";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import SimpleUserNavbar from "./SimpleUserNavbar";
// import "./Dashboard.css";

// const API_URL = "https://spaceapi.iryax.com";

// function SimpleUserDashboard() {
//   const [user, setUser] = useState(null);
//   const [profile, setProfile] = useState(null);
//   const [completionPercentage, setCompletionPercentage] = useState(0);
//   const [missingFields, setMissingFields] = useState([]);
//   const [animatedPercentage, setAnimatedPercentage] = useState(0);
  
//   const [bookings, setBookings] = useState([]);
//   const [filteredBookings, setFilteredBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [stats, setStats] = useState({
//     total: 0,
//     pending: 0,
//     confirmed: 0,
//     active: 0,
//     completed: 0,
//     cancelled: 0
//   });
  
//   // Filters
//   const [filters, setFilters] = useState({
//     status: "all",
//     paymentStatus: "all"
//   });
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterDate, setFilterDate] = useState("");
//   const [activeTab, setActiveTab] = useState("all");

//   const navigate = useNavigate();

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

//   // Calculate profile completion percentage - ONLY BASIC FIELDS
//   const calculateCompletion = (userData) => {
//     const fields = [
//       { key: 'name', label: 'Full Name', required: true },
//       { key: 'email', label: 'Email Address', required: true },
//       { key: 'mobile', label: 'Mobile Number', required: true },
//       { key: 'address', label: 'Address', required: false },
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

//   useEffect(() => {
//     const userData = localStorage.getItem("user");
//     if (userData) {
//       setUser(JSON.parse(userData));
//     }
//     fetchBookings();
//     fetchProfile();
//   }, []);

//   const fetchBookings = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         setError("Please login to view your bookings");
//         setLoading(false);
//         return;
//       }

//       const res = await axios.get(
//         `${API_URL}/api/bookings/user`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       const bookingsData = res.data.bookings || [];
//       console.log("📦 Bookings Data:", bookingsData);
      
//       setBookings(bookingsData);
//       setFilteredBookings(bookingsData);
      
//       // Calculate stats
//       const statsData = {
//         total: bookingsData.length,
//         pending: 0,
//         confirmed: 0,
//         active: 0,
//         completed: 0,
//         cancelled: 0
//       };

//       bookingsData.forEach(b => {
//         const status = b.status?.toLowerCase() || 'pending';
//         if (status === 'confirmed' && b.paymentStatus === 'paid') {
//           statsData.completed += 1;
//         } else if (status === 'confirmed') {
//           statsData.confirmed += 1;
//         } else if (status === 'cancelled') {
//           statsData.cancelled += 1;
//         } else if (status === 'active') {
//           statsData.active += 1;
//         } else {
//           statsData.pending += 1;
//         }
//       });

//       setStats(statsData);
//     } catch (err) {
//       console.error("Error fetching bookings:", err);
//       setError(err.response?.data?.message || "Failed to fetch bookings");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const applyFilters = () => {
//     let filtered = [...bookings];

//     if (filters.status !== "all") {
//       filtered = filtered.filter(b => {
//         const status = b.status?.toLowerCase() || 'pending';
//         if (filters.status === 'completed') {
//           return status === 'confirmed' && b.paymentStatus === 'paid';
//         } else if (filters.status === 'active') {
//           const today = new Date().toISOString().split('T')[0];
//           return status === 'confirmed' && b.startDate <= today && b.endDate >= today;
//         } else {
//           return status === filters.status;
//         }
//       });
//     }

//     if (searchTerm.trim()) {
//       const term = searchTerm.toLowerCase().trim();
//       filtered = filtered.filter(b => {
//         const cabinName = b.cabin?.name?.toLowerCase() || '';
//         const address = b.cabin?.address?.toLowerCase() || '';
//         const customerName = b.name?.toLowerCase() || '';
//         return cabinName.includes(term) || address.includes(term) || customerName.includes(term);
//       });
//     }

//     if (filterDate) {
//       filtered = filtered.filter(b => b.startDate === filterDate);
//     }

//     if (filters.paymentStatus !== "all") {
//       filtered = filtered.filter(
//         b => (b.paymentStatus?.toLowerCase() || "pending") === filters.paymentStatus
//       );
//     }

//     setFilteredBookings(filtered);
//   };

//   useEffect(() => {
//     applyFilters();
//   }, [filters, searchTerm, filterDate, bookings]);

//   const clearFilters = () => {
//     setFilters({
//       status: "all",
//       paymentStatus: "all"
//     });
//     setSearchTerm("");
//     setFilterDate("");
//     setActiveTab("all");
//   };

//   const formatDate = (dateStr) => {
//     if (!dateStr) return "N/A";
//     const d = new Date(dateStr);
//     return d.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   const formatDateTime = (dateStr) => {
//     if (!dateStr) return "N/A";
//     const d = new Date(dateStr);
//     return d.toLocaleString('en-IN', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const getStatusBadge = (status, paymentStatus) => {
//     const statusMap = {
//       pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
//       confirmed: { 
//         label: paymentStatus === 'paid' ? 'Completed' : 'Confirmed', 
//         color: paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700' 
//       },
//       active: { label: 'Active', color: 'bg-indigo-100 text-indigo-700' },
//       completed: { label: 'Completed', color: 'bg-emerald-100 text-emerald-700' },
//       cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700' }
//     };
//     const key = status?.toLowerCase() || 'pending';
//     return statusMap[key] || { label: status || 'Unknown', color: 'bg-gray-100 text-gray-700' };
//   };

//   const getPaymentMethodBadge = (method) => {
//     if (method === 'cash' || method === 'counter') {
//       return { label: 'Cash', color: 'bg-orange-100 text-orange-700' };
//     }
//     return { label: 'Online', color: 'bg-blue-100 text-blue-700' };
//   };

//   const getPaymentStatusBadge = (status) => {
//     if (status === 'paid') return { label: 'Paid', color: 'bg-emerald-100 text-emerald-700' };
//     if (status === 'failed') return { label: 'Failed', color: 'bg-red-100 text-red-700' };
//     if (status === 'refunded') return { label: 'Refunded', color: 'bg-purple-100 text-purple-700' };
//     return { label: 'Pending', color: 'bg-yellow-100 text-yellow-700' };
//   };

//   const formatCurrency = (amount) => {
//     return `₹${Number(amount).toLocaleString('en-IN')}`;
//   };

//   const handleViewBooking = (booking) => {
//     navigate(`/booking/${booking._id}`);
//   };

//   const downloadInvoice = (booking) => {
//     try {
//       const cabin = booking.cabin || {};
//       const owner = cabin.owner || {};
      
//       const win = window.open('', '_blank', 'width=900,height=700');
//       if (!win) {
//         toast.error('Please allow popups');
//         return;
//       }
      
//       let seatListHtml = '';
//       if (booking.selectedSeats && booking.selectedSeats.length > 0) {
//         seatListHtml = booking.selectedSeats.map(s => 
//           `<span style="display:inline-block;background:#f0fdf4;padding:4px 12px;border-radius:12px;margin:3px;font-size:12px;border:1px solid #86efac;">${s.name} (#${s.number})</span>`
//         ).join('');
//       }

//       const status = getStatusBadge(booking.status, booking.paymentStatus);
//       const pmtMethod = getPaymentMethodBadge(booking.paymentMethod);
//       const pmtStatus = getPaymentStatusBadge(booking.paymentStatus);

//       win.document.write(`
//         <html><head><title>Invoice #${booking._id.slice(-8).toUpperCase()}</title>
//         <style>
//           * { margin: 0; padding: 0; box-sizing: border-box; }
//           body { font-family: 'Segoe UI', Arial, sans-serif; padding: 30px; max-width: 900px; margin: auto; background: #f8fafc; }
//           .invoice-wrapper { background: white; border-radius: 16px; padding: 35px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
//           .header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 20px; border-bottom: 3px solid #e2e8f0; margin-bottom: 25px; }
//           .header-left h1 { color: #4f46e5; font-size: 26px; margin: 0; }
//           .header-left p { color: #64748b; font-size: 13px; margin-top: 4px; }
//           .header-right { text-align: right; }
//           .header-right .invoice-no { font-size: 14px; font-weight: 700; color: #1e293b; }
//           .header-right .invoice-date { font-size: 12px; color: #64748b; }
//           .badge { display: inline-block; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 600; }
//           .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; background: #f8fafc; padding: 20px; border-radius: 12px; margin-bottom: 25px; }
//           .info-item .label { font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; }
//           .info-item .value { font-size: 14px; font-weight: 600; color: #1e293b; margin-top: 3px; }
//           .seat-section { background: #f0fdf4; padding: 15px; border-radius: 12px; margin-bottom: 20px; border: 1px solid #bbf7d0; }
//           .seat-section .seat-title { font-size: 12px; font-weight: 700; color: #166534; }
//           .breakdown-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
//           .breakdown-table th { text-align: left; padding: 10px 12px; font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; border-bottom: 2px solid #e2e8f0; }
//           .breakdown-table td { padding: 10px 12px; border-bottom: 1px solid #f1f5f9; font-size: 13px; color: #1e293b; }
//           .breakdown-table .amount { font-weight: 600; text-align: right; }
//           .breakdown-table .total-row td { font-weight: 700; font-size: 16px; border-top: 2px solid #4f46e5; padding-top: 15px; }
//           .breakdown-table .total-row .amount { font-size: 18px; color: #4f46e5; }
//           .payment-details { background: #f1f5f9; padding: 15px; border-radius: 12px; margin: 15px 0; }
//           .payment-details h4 { font-size: 12px; color: #64748b; margin-bottom: 8px; }
//           .payment-details .detail-row { display: flex; justify-content: space-between; padding: 4px 0; font-size: 13px; }
//           .status-section { display: flex; gap: 15px; flex-wrap: wrap; margin: 20px 0; padding: 15px; background: #f8fafc; border-radius: 12px; }
//           .status-item { display: flex; align-items: center; gap: 6px; font-size: 12px; }
//           .status-item .label { color: #64748b; font-weight: 500; }
//           .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e2e8f0; color: #94a3b8; font-size: 11px; }
//           .footer .brand { font-weight: 700; color: #4f46e5; }
//           @media print { body { background: white; padding: 20px; } .invoice-wrapper { box-shadow: none; padding: 20px; } }
//         </style>
//         </head><body>
//         <div class="invoice-wrapper">
//           <div class="header">
//             <div class="header-left">
//               <h1>${owner.organizationName || 'IRYAX SPACE'}</h1>
//               <p>${owner.address || 'Premium Workspaces'}</p>
//             </div>
//             <div class="header-right">
//               <div class="invoice-no">#${booking._id.slice(-8).toUpperCase()}</div>
//               <div class="invoice-date">${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
//             </div>
//           </div>

//           <div class="info-grid">
//             <div class="info-item">
//               <div class="label">Bill To</div>
//               <div class="value">${booking.name || 'Customer'}</div>
//               <div style="font-size:12px;color:#64748b;">${booking.mobile || 'N/A'}</div>
//               <div style="font-size:12px;color:#64748b;">${booking.email || 'N/A'}</div>
//             </div>
//             <div class="info-item">
//               <div class="label">Cabin Details</div>
//               <div class="value">${cabin.name || 'Unknown'}</div>
//               <div style="font-size:12px;color:#64748b;">${cabin.address || 'N/A'}</div>
//               <div style="font-size:12px;color:#64748b;">Type: ${cabin.cabinType || 'Normal'}</div>
//             </div>
//           </div>

//           <div class="info-grid">
//             <div class="info-item">
//               <div class="label">Start</div>
//               <div class="value">${formatDate(booking.startDate)}</div>
//               <div style="font-size:12px;color:#4f46e5;font-weight:600;">${booking.startTime}</div>
//             </div>
//             <div class="info-item">
//               <div class="label">End</div>
//               <div class="value">${formatDate(booking.endDate)}</div>
//               <div style="font-size:12px;color:#4f46e5;font-weight:600;">${booking.endTime}</div>
//             </div>
//           </div>

//           <div style="display:flex;gap:20px;flex-wrap:wrap;margin-bottom:20px;padding:10px;background:#f1f5f9;border-radius:8px;">
//             <div><strong>Total Hours:</strong> ${booking.totalHours}h</div>
//             <div><strong>Booking Type:</strong> ${booking.bookingBasis || 'Hourly'}</div>
//             ${booking.selectedPlan ? `<div><strong>Plan:</strong> ${booking.selectedPlan.label || 'N/A'}</div>` : ''}
//             <div><strong>Created:</strong> ${formatDateTime(booking.createdAt)}</div>
//           </div>

//           ${booking.selectedSeats && booking.selectedSeats.length > 0 ? `
//             <div class="seat-section">
//               <div class="seat-title">🪑 Selected Seats (${booking.seatCount})</div>
//               <div style="margin-top:8px;">${seatListHtml}</div>
//               <div style="margin-top:6px;font-size:12px;color:#166534;">Extra Charge: ₹${booking.extraCharge || 0}</div>
//             </div>
//           ` : ''}

//           <h3 style="font-size:14px;color:#1e293b;margin-bottom:10px;">Price Breakdown</h3>
//           <table class="breakdown-table">
//             <thead>
//               <tr><th>Description</th><th style="text-align:right;">Amount</th></tr>
//             </thead>
//             <tbody>
//               <tr>
//                 <td>Subtotal (${booking.totalHours}h × ₹${cabin.price || 0})</td>
//                 <td class="amount">₹${(booking.subtotal || 0).toFixed(2)}</td>
//               </tr>
//               ${booking.extraCharge > 0 ? `
//                 <tr>
//                   <td>Seat Charges (${booking.seatCount} seats × ₹${booking.seatExtraChargePerSeat || 100})</td>
//                   <td class="amount">₹${(booking.extraCharge || 0).toFixed(2)}</td>
//                 </tr>
//               ` : ''}
//               <tr>
//                 <td>GST (${(booking.gstRate || 0.18) * 100}%)</td>
//                 <td class="amount">₹${(booking.gstAmount || 0).toFixed(2)}</td>
//               </tr>
//               <tr class="total-row">
//                 <td>Total Amount</td>
//                 <td class="amount">₹${(booking.totalPrice || 0).toFixed(2)}</td>
//               </tr>
//             </tbody>
//           </table>

//           ${booking.transactionId || booking.paymentDetails?.transactionId ? `
//             <div class="payment-details">
//               <h4>💳 Payment Details</h4>
//               <div class="detail-row"><span>Transaction ID:</span> <strong>${booking.transactionId || booking.paymentDetails?.transactionId || 'N/A'}</strong></div>
//               ${booking.paymentDetails?.upiId ? `<div class="detail-row"><span>UPI ID:</span> <strong>${booking.paymentDetails.upiId}</strong></div>` : ''}
//               ${booking.paymentDetails?.upiApp ? `<div class="detail-row"><span>UPI App:</span> <strong>${booking.paymentDetails.upiApp}</strong></div>` : ''}
//               ${booking.paymentDetails?.paymentDate ? `<div class="detail-row"><span>Payment Date:</span> <strong>${formatDate(booking.paymentDetails.paymentDate)}</strong></div>` : ''}
//               <div class="detail-row"><span>Payment Mode:</span> <strong>${pmtMethod.label}</strong></div>
//             </div>
//           ` : ''}

//           <div class="status-section">
//             <div class="status-item"><span class="label">Status:</span> <span class="badge ${status.color}">${status.label}</span></div>
//             <div class="status-item"><span class="label">Payment:</span> <span class="badge ${pmtMethod.color}">${pmtMethod.label}</span></div>
//             <div class="status-item"><span class="label">Payment Status:</span> <span class="badge ${pmtStatus.color}">${pmtStatus.label}</span></div>
//             ${booking.isPaidToOwner ? `<div class="status-item"><span class="label">Paid to Owner:</span> <span class="badge bg-emerald-100 text-emerald-700">✅ Yes</span></div>` : ''}
//           </div>

//           <div class="footer">
//             <span class="brand">IRYAX SPACE</span> — Premium Workspaces<br>
//             Created: ${formatDateTime(booking.createdAt)}<br>
//             This is a system generated invoice. Terms & Conditions apply.
//           </div>
//         </div>
//         </body></html>
//       `);
//       win.document.close();
//       win.focus();
//       toast.success('Invoice generated! Click Print to save as PDF.');
//     } catch (error) {
//       console.error(error);
//       toast.error('Failed to generate invoice');
//     }
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

//   const visitCount = bookings.filter(b => b.bookingType === "visit").length;
//   const regularCount = bookings.filter(b => b.bookingType !== "visit").length;

//   const getDisplayBookings = () => {
//     if (activeTab === "visits") {
//       return filteredBookings.filter(b => b.bookingType === "visit");
//     }

//     if (activeTab === "spaces") {
//       return filteredBookings.filter(b => b.bookingType !== "visit");
//     }

//     return filteredBookings;
//   };

//   const displayBookings = getDisplayBookings();

//   const isStatActive = (value) => filters.status === value;

//   const dashboardStatsCards = [
//     {
//       label: "Total",
//       value: stats.total,
//       meta: "all reservations",
//       icon: Ticket,
//       color: "indigo",
//       filterValue: "all",
//       onClick: () => setFilters(prev => ({ ...prev, status: "all" }))
//     },
//     {
//       label: "Pending",
//       value: stats.pending,
//       meta: "awaiting confirmation",
//       icon: Clock,
//       color: "amber",
//       filterValue: "pending",
//       onClick: () => setFilters(prev => ({ ...prev, status: "pending" }))
//     },
//     {
//       label: "Confirmed",
//       value: stats.confirmed,
//       meta: "approved reservations",
//       icon: CheckCircle,
//       color: "cyan",
//       filterValue: "confirmed",
//       onClick: () => setFilters(prev => ({ ...prev, status: "confirmed" }))
//     },
//     {
//       label: "Active",
//       value: stats.active,
//       meta: "active & confirmed",
//       icon: Building2,
//       color: "emerald",
//       filterValue: "active",
//       onClick: () => setFilters(prev => ({ ...prev, status: "active" }))
//     },
//     {
//       label: "Completed",
//       value: stats.completed,
//       meta: "confirmed & paid",
//       icon: CheckCircle,
//       color: "purple",
//       filterValue: "completed",
//       onClick: () => setFilters(prev => ({ ...prev, status: "completed" }))
//     },
//     {
//       label: "Cancelled",
//       value: stats.cancelled,
//       meta: "cancelled reservations",
//       icon: XCircle,
//       color: "rose",
//       filterValue: "cancelled",
//       onClick: () => setFilters(prev => ({ ...prev, status: "cancelled" }))
//     }
//   ];

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50">
//         <SimpleUserNavbar />
//         <div className="pt-24 px-4 max-w-full mx-auto">
//           <div className="flex items-center justify-center h-64">
//             <div className="text-center">
//               <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
//               <p className="mt-4 text-gray-500 text-sm">Loading your bookings...</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50">
//         <SimpleUserNavbar />
//         <div className="pt-24 px-4 max-w-full mx-auto">
//           <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-md mx-auto">
//             <XCircle size={40} className="text-red-500 mx-auto mb-3" />
//             <p className="text-red-600 font-medium">{error}</p>
//             <button 
//               onClick={fetchBookings}
//               className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition"
//             >
//               Retry
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="admin-dash" style={{ backgroundColor: "#ffffff" }}>
//       <SimpleUserNavbar />

//       <div className="pt-20 px-3 sm:px-4 md:px-6 lg:px-8 max-w-full mx-auto pb-16">
        
//         {/* Header */}
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
//             {/* <button
//               onClick={() => navigate("/spaceforusers")}
//               className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 transition flex items-center gap-2 shadow-sm shadow-indigo-200"
//             >
//               <Building2 size={16} />
//               Find New Space
//             </button> */}
//           </div>
//         </div>

//         {/* Profile Completion Card */}
//         <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-xl border border-indigo-200 shadow-sm p-3 sm:p-4 mb-5">
//           <div className="flex flex-col sm:flex-row sm:items-center gap-3">
//             {/* Circular Progress */}
//             <div className="flex-shrink-0 flex justify-center">
//               <CircularProgress 
//                 percentage={animatedPercentage || completionPercentage} 
//                 size={80}
//                 strokeWidth={7}
//               />
//             </div>

//             {/* Details */}
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
//                     onClick={() => navigate("/userprofile")}
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
            
//             {/* Quick Action Button */}
//             <button
//               onClick={() => navigate("/userprofile")}
//               className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 bg-indigo-600 text-white rounded-lg text-[10px] font-medium hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
//             >
//               <User size={12} />
//               View Profile
//             </button>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div
//           className="admin-dash__stats admin-dash__stats--six"
//           style={{ marginBottom: "16px" }}
//         >
//           {dashboardStatsCards.map((stat, index) => (
//             <div
//               key={index}
//               className={`admin-dash__stat ${isStatActive(stat.filterValue) ? "admin-dash__stat--active" : ""}`}
//               onClick={stat.onClick}
//               style={{
//                 padding: "12px 14px",
//                 minHeight: "80px",
//               }}
//               title="Click to filter"
//             >
//               <div className="admin-dash__stat-top">
//                 <span className="admin-dash__stat-label" style={{ fontSize: "11px" }}>
//                   {stat.label}
//                 </span>
//                 <div
//                   className={`admin-dash__stat-icon admin-dash__stat-icon--${stat.color}`}
//                   style={{ width: "28px", height: "28px" }}
//                 >
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

//         {/* Filters */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 mb-4">
//           <div className="flex flex-col sm:flex-row gap-2">
//             <div className="flex-1 relative">
//               <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search bookings..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
//               />
//             </div>
//             <div className="flex flex-wrap items-center gap-2">
//               <input
//                 type="date"
//                 value={filterDate}
//                 onChange={(e) => setFilterDate(e.target.value)}
//                 className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
//               />
//               <select
//                 value={filters.status}
//                 onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
//                 className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
//               >
//                 <option value="all">All Status</option>
//                 <option value="pending">Pending</option>
//                 <option value="confirmed">Confirmed</option>
//                 <option value="active">Active</option>
//                 <option value="completed">Completed</option>
//                 <option value="cancelled">Cancelled</option>
//               </select>
//               <select
//                 value={activeTab}
//                 onChange={(e) => setActiveTab(e.target.value)}
//                 className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
//               >
//                 <option value="all">All Bookings ({bookings.length})</option>
//                 <option value="visits">Site Visits ({visitCount})</option>
//                 <option value="spaces">Space Bookings ({regularCount})</option>
//               </select>
//               <select
//                 value={filters.paymentStatus}
//                 onChange={(e) => setFilters(prev => ({ ...prev, paymentStatus: e.target.value }))}
//                 className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
//               >
//                 <option value="all">Payment Status</option>
//                 <option value="pending">Pending</option>
//                 <option value="paid">Paid</option>
//                 <option value="failed">Failed</option>
//                 <option value="refunded">Refunded</option>
//               </select>
//               {(filters.status !== "all" || filters.paymentStatus !== "all" || filterDate || searchTerm || activeTab !== "all") && (
//                 <button
//                   onClick={clearFilters}
//                   className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
//                   title="Clear filters"
//                 >
//                   <XIcon size={16} />
//                 </button>
//               )}
//             </div>
//           </div>
//           <div className="mt-1.5 text-[10px] text-gray-400">
//             Showing {displayBookings.length} of {bookings.length} bookings
//           </div>
//         </div>

//         {/* Bookings Table */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
//           {displayBookings.length === 0 ? (
//             <div className="flex flex-col items-center justify-center py-16 text-gray-400">
//               <Calendar size={48} className="opacity-20 mb-3" />
//               <p className="text-sm font-medium">No bookings found</p>
//               <p className="text-xs text-gray-400 mt-1">
//                 {bookings.length === 0 ? "You haven't made any bookings yet." : "Try adjusting your filters."}
//               </p>
//               {bookings.length === 0 && (
//                 <button
//                   onClick={() => navigate("/spaceforusers")}
//                   className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
//                 >
//                   Browse Spaces
//                 </button>
//               )}
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full text-left text-sm">
//                 <thead>
//                   <tr className="bg-gray-50 border-b border-gray-100">
//                     <th className="px-3 py-2.5 text-[9px] font-bold tracking-wider text-gray-500 uppercase">S.No</th>
//                     <th className="px-3 py-2.5 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Cabin</th>
//                     <th className="px-3 py-2.5 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Date &amp; Time</th>
//                     <th className="px-3 py-2.5 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Status</th>
//                     <th className="px-3 py-2.5 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Amount</th>
//                     <th className="px-3 py-2.5 text-[9px] font-bold tracking-wider text-gray-500 uppercase text-center">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-100">
//                   {displayBookings.map((booking, idx) => {
//                     const status = getStatusBadge(booking.status, booking.paymentStatus);
//                     return (
//                       <tr key={booking._id} className="hover:bg-gray-50/80 transition-colors">
//                         <td className="px-3 py-2.5">
//                           <span className="text-[10px] font-semibold text-gray-400">{idx + 1}</span>
//                         </td>
//                         <td className="px-3 py-2.5">
//                           <div>
//                             <p className="font-semibold text-gray-900 text-sm">
//                               {booking.cabin?.name || 'Unknown Cabin'}
//                             </p>
//                             <p className="text-[9px] text-gray-400 flex items-center gap-0.5">
//                               <MapPin size={9} />
//                               {booking.cabin?.address?.split(',')[0] || 'N/A'}
//                             </p>
//                             <p className="text-[8px] text-gray-400">
//                               Owner: {booking.cabin?.owner?.name || 'N/A'}
//                             </p>
//                           </div>
//                         </td>
//                         <td className="px-3 py-2.5">
//                           <p className="text-sm text-gray-700">{formatDate(booking.startDate)}</p>
//                           <p className="text-[9px] text-gray-400">
//                             {booking.startTime} - {booking.endTime} ({booking.totalHours}h)
//                           </p>
//                         </td>
//                         <td className="px-3 py-2.5">
//                           <span className={`px-2.5 py-0.5 text-[9px] font-bold rounded-full ${status.color}`}>
//                             {status.label}
//                           </span>
//                           {booking.paymentStatus && (
//                             <span className={`ml-1 px-2 py-0.5 text-[8px] font-bold rounded-full ${
//                               booking.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-700' : 
//                               booking.paymentStatus === 'failed' ? 'bg-red-100 text-red-700' : 
//                               'bg-yellow-100 text-yellow-700'
//                             }`}>
//                               {booking.paymentStatus}
//                             </span>
//                           )}
//                         </td>
//                         <td className="px-3 py-2.5">
//                           <span className="text-sm font-bold text-indigo-600">
//                             {formatCurrency(booking.totalPrice)}
//                           </span>
//                           {booking.extraCharge > 0 && (
//                             <p className="text-[8px] text-amber-500">+₹{booking.extraCharge} seat</p>
//                           )}
//                         </td>
//                         <td className="px-3 py-2.5 text-center">
//                           <div className="flex items-center justify-center gap-1">
//                             <button
//                               onClick={() => handleViewBooking(booking)}
//                               className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-[9px] font-medium hover:bg-indigo-100 transition"
//                               title="View Details"
//                             >
//                               <Eye size={11} /> View
//                             </button>
//                             <button
//                               onClick={() => downloadInvoice(booking)}
//                               className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[9px] font-medium hover:bg-emerald-100 transition"
//                               title="Download Invoice"
//                             >
//                               <FileDown size={11} /> Invoice
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>

//         {/* Footer */}
//         <div className="mt-6 text-center text-[9px] text-gray-400 font-medium tracking-wider">
//           © IRYAX SPACE — All Rights Reserved
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SimpleUserDashboard;






// SimpleUserDashboard.jsx - With Booking Detail Modal
import axios from "axios";
import {
  Calendar,
  Ticket,
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
  X as XIcon,
  RefreshCw,
  FileDown,
  User,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Mail,
  Phone
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SimpleUserNavbar from "./SimpleUserNavbar";
import "./Dashboard.css";

const API_URL = "https://spaceapi.iryax.com";

function SimpleUserDashboard() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [missingFields, setMissingFields] = useState([]);
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    active: 0,
    completed: 0,
    cancelled: 0
  });
  
  // Filters
  const [filters, setFilters] = useState({
    status: "all",
    paymentStatus: "all"
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const navigate = useNavigate();

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

  // Calculate profile completion percentage - ONLY BASIC FIELDS
  const calculateCompletion = (userData) => {
    const fields = [
      { key: 'name', label: 'Full Name', required: true },
      { key: 'email', label: 'Email Address', required: true },
      { key: 'mobile', label: 'Mobile Number', required: true },
      { key: 'address', label: 'Address', required: false },
      { key: 'organizationName', label: 'Organization Name', required: false },
      { key: 'gstNumber', label: 'GST Number', required: false }
    ];

    let completed = 0;
    let total = 0;
    const missing = [];

    fields.forEach(field => {
      const value = userData[field.key];
      
      if (field.required) {
        total++;
        if (value && value.toString().trim() !== '') {
          completed++;
        } else {
          missing.push(field.label);
        }
      } else {
        total++;
        if (value && value.toString().trim() !== '') {
          completed++;
        } else {
          missing.push(field.label);
        }
      }
    });

    let percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    if (userData._id && percentage < 10) {
      percentage = 10;
    }

    return { percentage, missing };
  };

  // Animate percentage on load
  useEffect(() => {
    if (completionPercentage > 0) {
      let start = 0;
      const duration = 1500;
      const step = Math.max(1, Math.floor(completionPercentage / 60));
      
      const timer = setInterval(() => {
        start += step;
        if (start >= completionPercentage) {
          setAnimatedPercentage(completionPercentage);
          clearInterval(timer);
        } else {
          setAnimatedPercentage(start);
        }
      }, 20);
      
      return () => clearInterval(timer);
    }
  }, [completionPercentage]);

  // Fetch profile for completion
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
        const { percentage, missing } = calculateCompletion(res.data.user);
        setCompletionPercentage(percentage);
        setMissingFields(missing);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchBookings();
    fetchProfile();
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
      console.log("📦 Bookings Data:", bookingsData);
      
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

    if (filters.status !== "all") {
      filtered = filtered.filter(b => {
        const status = b.status?.toLowerCase() || 'pending';
        if (filters.status === 'completed') {
          return status === 'confirmed' && b.paymentStatus === 'paid';
        } else if (filters.status === 'active') {
          const today = new Date().toISOString().split('T')[0];
          return status === 'confirmed' && b.startDate <= today && b.endDate >= today;
        } else {
          return status === filters.status;
        }
      });
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(b => {
        const cabinName = b.cabin?.name?.toLowerCase() || '';
        const address = b.cabin?.address?.toLowerCase() || '';
        const customerName = b.name?.toLowerCase() || '';
        return cabinName.includes(term) || address.includes(term) || customerName.includes(term);
      });
    }

    if (filterDate) {
      filtered = filtered.filter(b => b.startDate === filterDate);
    }

    if (filters.paymentStatus !== "all") {
      filtered = filtered.filter(
        b => (b.paymentStatus?.toLowerCase() || "pending") === filters.paymentStatus
      );
    }

    setFilteredBookings(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [filters, searchTerm, filterDate, bookings]);

  const clearFilters = () => {
    setFilters({
      status: "all",
      paymentStatus: "all"
    });
    setSearchTerm("");
    setFilterDate("");
    setActiveTab("all");
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return "N/A";
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return "N/A";
    }
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return "N/A";
      return d.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return "N/A";
    }
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

  const getPaymentMethodBadge = (method) => {
    if (method === 'cash' || method === 'counter') {
      return { label: 'Cash', color: 'bg-orange-100 text-orange-700' };
    }
    return { label: 'Online', color: 'bg-blue-100 text-blue-700' };
  };

  const getPaymentStatusBadge = (status) => {
    if (status === 'paid') return { label: 'Paid', color: 'bg-emerald-100 text-emerald-700' };
    if (status === 'failed') return { label: 'Failed', color: 'bg-red-100 text-red-700' };
    if (status === 'refunded') return { label: 'Refunded', color: 'bg-purple-100 text-purple-700' };
    return { label: 'Pending', color: 'bg-yellow-100 text-yellow-700' };
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '₹0';
    return `₹${Number(amount).toLocaleString('en-IN')}`;
  };

  // NEW: Handle View Booking - Open Modal instead of navigation
  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  // FIXED: Invoice download function with better error handling
  const downloadInvoice = (booking) => {
    try {
      // Check if booking data exists
      if (!booking) {
        toast.error('No booking data available');
        return;
      }

      // Get cabin and owner data with fallbacks
      const cabin = booking.cabin || {};
      const owner = cabin.owner || {};
      
      // Create a new window
      const win = window.open('', '_blank', 'width=900,height=700');
      if (!win) {
        toast.error('Please allow popups for invoice download');
        return;
      }

      // Format seat list HTML
      let seatListHtml = '';
      if (booking.selectedSeats && booking.selectedSeats.length > 0) {
        seatListHtml = booking.selectedSeats.map(s => 
          `<span style="display:inline-block;background:#f0fdf4;padding:4px 12px;border-radius:12px;margin:3px;font-size:12px;border:1px solid #86efac;">${s.name || 'Seat'} (#${s.number || 'N/A'})</span>`
        ).join('');
      }

      // Get status badges
      const status = getStatusBadge(booking.status, booking.paymentStatus);
      const pmtMethod = getPaymentMethodBadge(booking.paymentMethod);
      const pmtStatus = getPaymentStatusBadge(booking.paymentStatus);

      // Safely get amounts with fallbacks
      const subtotal = booking.subtotal || 0;
      const extraCharge = booking.extraCharge || 0;
      const gstAmount = booking.gstAmount || 0;
      const totalPrice = booking.totalPrice || 0;
      const gstRate = (booking.gstRate || 0.18) * 100;
      const cabinPrice = cabin.price || 0;
      const totalHours = booking.totalHours || 0;
      const seatCount = booking.seatCount || 0;
      const seatExtraChargePerSeat = booking.seatExtraChargePerSeat || 100;

      // Build the invoice HTML
      win.document.write(`
        <html>
          <head>
            <title>Invoice #${booking._id ? booking._id.slice(-8).toUpperCase() : 'N/A'}</title>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { 
                font-family: 'Segoe UI', Arial, sans-serif; 
                padding: 30px; 
                max-width: 900px; 
                margin: auto; 
                background: #f8fafc; 
              }
              .invoice-wrapper { 
                background: white; 
                border-radius: 16px; 
                padding: 35px; 
                box-shadow: 0 4px 20px rgba(0,0,0,0.08); 
              }
              .header { 
                display: flex; 
                justify-content: space-between; 
                align-items: flex-start; 
                padding-bottom: 20px; 
                border-bottom: 3px solid #e2e8f0; 
                margin-bottom: 25px; 
              }
              .header-left h1 { 
                color: #4f46e5; 
                font-size: 26px; 
                margin: 0; 
              }
              .header-left p { 
                color: #64748b; 
                font-size: 13px; 
                margin-top: 4px; 
              }
              .header-right { 
                text-align: right; 
              }
              .header-right .invoice-no { 
                font-size: 14px; 
                font-weight: 700; 
                color: #1e293b; 
              }
              .header-right .invoice-date { 
                font-size: 12px; 
                color: #64748b; 
              }
              .badge { 
                display: inline-block; 
                padding: 3px 12px; 
                border-radius: 20px; 
                font-size: 11px; 
                font-weight: 600; 
              }
              .info-grid { 
                display: grid; 
                grid-template-columns: 1fr 1fr; 
                gap: 20px; 
                background: #f8fafc; 
                padding: 20px; 
                border-radius: 12px; 
                margin-bottom: 25px; 
              }
              .info-item .label { 
                font-size: 10px; 
                font-weight: 700; 
                color: #94a3b8; 
                text-transform: uppercase; 
                letter-spacing: 0.5px; 
              }
              .info-item .value { 
                font-size: 14px; 
                font-weight: 600; 
                color: #1e293b; 
                margin-top: 3px; 
              }
              .seat-section { 
                background: #f0fdf4; 
                padding: 15px; 
                border-radius: 12px; 
                margin-bottom: 20px; 
                border: 1px solid #bbf7d0; 
              }
              .seat-section .seat-title { 
                font-size: 12px; 
                font-weight: 700; 
                color: #166534; 
              }
              .breakdown-table { 
                width: 100%; 
                border-collapse: collapse; 
                margin: 20px 0; 
              }
              .breakdown-table th { 
                text-align: left; 
                padding: 10px 12px; 
                font-size: 10px; 
                font-weight: 700; 
                color: #94a3b8; 
                text-transform: uppercase; 
                border-bottom: 2px solid #e2e8f0; 
              }
              .breakdown-table td { 
                padding: 10px 12px; 
                border-bottom: 1px solid #f1f5f9; 
                font-size: 13px; 
                color: #1e293b; 
              }
              .breakdown-table .amount { 
                font-weight: 600; 
                text-align: right; 
              }
              .breakdown-table .total-row td { 
                font-weight: 700; 
                font-size: 16px; 
                border-top: 2px solid #4f46e5; 
                padding-top: 15px; 
              }
              .breakdown-table .total-row .amount { 
                font-size: 18px; 
                color: #4f46e5; 
              }
              .payment-details { 
                background: #f1f5f9; 
                padding: 15px; 
                border-radius: 12px; 
                margin: 15px 0; 
              }
              .payment-details h4 { 
                font-size: 12px; 
                color: #64748b; 
                margin-bottom: 8px; 
              }
              .payment-details .detail-row { 
                display: flex; 
                justify-content: space-between; 
                padding: 4px 0; 
                font-size: 13px; 
              }
              .status-section { 
                display: flex; 
                gap: 15px; 
                flex-wrap: wrap; 
                margin: 20px 0; 
                padding: 15px; 
                background: #f8fafc; 
                border-radius: 12px; 
              }
              .status-item { 
                display: flex; 
                align-items: center; 
                gap: 6px; 
                font-size: 12px; 
              }
              .status-item .label { 
                color: #64748b; 
                font-weight: 500; 
              }
              .footer { 
                text-align: center; 
                margin-top: 30px; 
                padding-top: 20px; 
                border-top: 2px solid #e2e8f0; 
                color: #94a3b8; 
                font-size: 11px; 
              }
              .footer .brand { 
                font-weight: 700; 
                color: #4f46e5; 
              }
              @media print { 
                body { 
                  background: white; 
                  padding: 20px; 
                } 
                .invoice-wrapper { 
                  box-shadow: none; 
                  padding: 20px; 
                } 
              }
            </style>
          </head>
          <body>
            <div class="invoice-wrapper">
              <div class="header">
                <div class="header-left">
                  <h1>${owner.organizationName || cabin.organizationName || 'IRYAX SPACE'}</h1>
                  <p>${owner.address || cabin.address || 'Premium Workspaces'}</p>
                </div>
                <div class="header-right">
                  <div class="invoice-no">#${booking._id ? booking._id.slice(-8).toUpperCase() : 'N/A'}</div>
                  <div class="invoice-date">${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                </div>
              </div>

              <div class="info-grid">
                <div class="info-item">
                  <div class="label">Bill To</div>
                  <div class="value">${booking.name || 'Customer'}</div>
                  <div style="font-size:12px;color:#64748b;">${booking.mobile || 'N/A'}</div>
                  <div style="font-size:12px;color:#64748b;">${booking.email || 'N/A'}</div>
                </div>
                <div class="info-item">
                  <div class="label">Cabin Details</div>
                  <div class="value">${cabin.name || 'Unknown Cabin'}</div>
                  <div style="font-size:12px;color:#64748b;">${cabin.address || 'N/A'}</div>
                  <div style="font-size:12px;color:#64748b;">Type: ${cabin.cabinType || 'Normal'}</div>
                </div>
              </div>

              <div class="info-grid">
                <div class="info-item">
                  <div class="label">Start</div>
                  <div class="value">${formatDate(booking.startDate)}</div>
                  <div style="font-size:12px;color:#4f46e5;font-weight:600;">${booking.startTime || 'N/A'}</div>
                </div>
                <div class="info-item">
                  <div class="label">End</div>
                  <div class="value">${formatDate(booking.endDate)}</div>
                  <div style="font-size:12px;color:#4f46e5;font-weight:600;">${booking.endTime || 'N/A'}</div>
                </div>
              </div>

              <div style="display:flex;gap:20px;flex-wrap:wrap;margin-bottom:20px;padding:10px;background:#f1f5f9;border-radius:8px;">
                <div><strong>Total Hours:</strong> ${totalHours}h</div>
                <div><strong>Booking Type:</strong> ${booking.bookingBasis || 'Hourly'}</div>
                ${booking.selectedPlan ? `<div><strong>Plan:</strong> ${booking.selectedPlan.label || 'N/A'}</div>` : ''}
                <div><strong>Created:</strong> ${formatDateTime(booking.createdAt)}</div>
              </div>

              ${booking.selectedSeats && booking.selectedSeats.length > 0 ? `
                <div class="seat-section">
                  <div class="seat-title">🪑 Selected Seats (${seatCount})</div>
                  <div style="margin-top:8px;">${seatListHtml}</div>
                  <div style="margin-top:6px;font-size:12px;color:#166534;">Extra Charge: ₹${extraCharge.toFixed(2)}</div>
                </div>
              ` : ''}

              <h3 style="font-size:14px;color:#1e293b;margin-bottom:10px;">Price Breakdown</h3>
              <table class="breakdown-table">
                <thead>
                  <tr><th>Description</th><th style="text-align:right;">Amount</th></tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Subtotal (${totalHours}h × ₹${cabinPrice})</td>
                    <td class="amount">₹${subtotal.toFixed(2)}</td>
                  </tr>
                  ${extraCharge > 0 ? `
                    <tr>
                      <td>Seat Charges (${seatCount} seats × ₹${seatExtraChargePerSeat})</td>
                      <td class="amount">₹${extraCharge.toFixed(2)}</td>
                    </tr>
                  ` : ''}
                  <tr>
                    <td>GST (${gstRate.toFixed(0)}%)</td>
                    <td class="amount">₹${gstAmount.toFixed(2)}</td>
                  </tr>
                  <tr class="total-row">
                    <td>Total Amount</td>
                    <td class="amount">₹${totalPrice.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>

              ${booking.transactionId || booking.paymentDetails?.transactionId ? `
                <div class="payment-details">
                  <h4>💳 Payment Details</h4>
                  <div class="detail-row"><span>Transaction ID:</span> <strong>${booking.transactionId || booking.paymentDetails?.transactionId || 'N/A'}</strong></div>
                  ${booking.paymentDetails?.upiId ? `<div class="detail-row"><span>UPI ID:</span> <strong>${booking.paymentDetails.upiId}</strong></div>` : ''}
                  ${booking.paymentDetails?.upiApp ? `<div class="detail-row"><span>UPI App:</span> <strong>${booking.paymentDetails.upiApp}</strong></div>` : ''}
                  ${booking.paymentDetails?.paymentDate ? `<div class="detail-row"><span>Payment Date:</span> <strong>${formatDate(booking.paymentDetails.paymentDate)}</strong></div>` : ''}
                  <div class="detail-row"><span>Payment Mode:</span> <strong>${pmtMethod.label}</strong></div>
                </div>
              ` : ''}

              <div class="status-section">
                <div class="status-item"><span class="label">Status:</span> <span class="badge ${status.color}">${status.label}</span></div>
                <div class="status-item"><span class="label">Payment:</span> <span class="badge ${pmtMethod.color}">${pmtMethod.label}</span></div>
                <div class="status-item"><span class="label">Payment Status:</span> <span class="badge ${pmtStatus.color}">${pmtStatus.label}</span></div>
                ${booking.isPaidToOwner ? `<div class="status-item"><span class="label">Paid to Owner:</span> <span class="badge bg-emerald-100 text-emerald-700">✅ Yes</span></div>` : ''}
              </div>

              <div class="footer">
                <span class="brand">IRYAX SPACE</span> — Premium Workspaces<br>
                Created: ${formatDateTime(booking.createdAt)}<br>
                This is a system generated invoice. Terms & Conditions apply.
              </div>
            </div>
            <script>
              // Auto-print after load
              window.onload = function() {
                setTimeout(function() {
                  window.print();
                }, 500);
              };
            <\/script>
          </body>
        </html>
      `);
      
      win.document.close();
      win.focus();
      toast.success('Invoice generated! Printing now...');
      
    } catch (error) {
      console.error("Invoice generation error:", error);
      toast.error('Failed to generate invoice: ' + error.message);
    }
  };

  const getProfileName = () => {
    return profile?.name || user?.name || 'User';
  };

  const visitCount = bookings.filter(b => b.bookingType === "visit").length;
  const regularCount = bookings.filter(b => b.bookingType !== "visit").length;

  const getDisplayBookings = () => {
    if (activeTab === "visits") {
      return filteredBookings.filter(b => b.bookingType === "visit");
    }

    if (activeTab === "spaces") {
      return filteredBookings.filter(b => b.bookingType !== "visit");
    }

    return filteredBookings;
  };

  const displayBookings = getDisplayBookings();

  const isStatActive = (value) => filters.status === value;

  const dashboardStatsCards = [
    {
      label: "Total",
      value: stats.total,
      meta: "all reservations",
      icon: Ticket,
      color: "indigo",
      filterValue: "all",
      onClick: () => setFilters(prev => ({ ...prev, status: "all" }))
    },
    {
      label: "Pending",
      value: stats.pending,
      meta: "awaiting confirmation",
      icon: Clock,
      color: "amber",
      filterValue: "pending",
      onClick: () => setFilters(prev => ({ ...prev, status: "pending" }))
    },
    {
      label: "Confirmed",
      value: stats.confirmed,
      meta: "approved reservations",
      icon: CheckCircle,
      color: "cyan",
      filterValue: "confirmed",
      onClick: () => setFilters(prev => ({ ...prev, status: "confirmed" }))
    },
    {
      label: "Active",
      value: stats.active,
      meta: "active & confirmed",
      icon: Building2,
      color: "emerald",
      filterValue: "active",
      onClick: () => setFilters(prev => ({ ...prev, status: "active" }))
    },
    {
      label: "Completed",
      value: stats.completed,
      meta: "confirmed & paid",
      icon: CheckCircle,
      color: "purple",
      filterValue: "completed",
      onClick: () => setFilters(prev => ({ ...prev, status: "completed" }))
    },
    {
      label: "Cancelled",
      value: stats.cancelled,
      meta: "cancelled reservations",
      icon: XCircle,
      color: "rose",
      filterValue: "cancelled",
      onClick: () => setFilters(prev => ({ ...prev, status: "cancelled" }))
    }
  ];

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
    <div className="admin-dash" style={{ backgroundColor: "#ffffff" }}>
      <SimpleUserNavbar />

      <div className="pt-20 px-3 sm:px-4 md:px-6 lg:px-8 max-w-full mx-auto pb-16">
        
        {/* Header */}
        <div className="admin-dash__header" style={{ marginBottom: "8px" }}>
          <div>
            <h1 className="admin-dash__greeting" style={{ fontSize: "1.25rem" }}>
              My <span>Dashboard</span>
            </h1>
            <p className="admin-dash__subtitle" style={{ fontSize: "11px" }}>
              Welcome back, <span className="font-semibold text-gray-700">{getProfileName()}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* <button
              onClick={() => navigate("/spaceforusers")}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 transition flex items-center gap-2 shadow-sm shadow-indigo-200"
            >
              <Building2 size={16} />
              Find New Space
            </button> */}
          </div>
        </div>

        {/* Profile Completion Card */}
        <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-xl border border-indigo-200 shadow-sm p-3 sm:p-4 mb-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            {/* Circular Progress */}
            <div className="flex-shrink-0 flex justify-center">
              <CircularProgress 
                percentage={animatedPercentage || completionPercentage} 
                size={80}
                strokeWidth={7}
              />
            </div>

            {/* Details */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-lg">{getCompletionEmoji(completionPercentage)}</span>
                <h3 className="text-xs font-semibold text-gray-800">Profile Completion</h3>
              </div>
              
              <div className="flex flex-wrap items-center gap-1.5">
                <div className="flex items-center gap-1 bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded-lg border border-gray-200">
                  <span className="text-[8px] font-medium text-gray-500">Completed:</span>
                  <span className={`text-xs font-bold ${getCompletionColor(completionPercentage)}`}>{completionPercentage}%</span>
                </div>
                <div className="flex items-center gap-1 bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded-lg border border-gray-200">
                  <span className="text-[8px] font-medium text-gray-500">Pending:</span>
                  <span className="text-xs font-bold text-amber-600">{missingFields.length}</span>
                </div>
              </div>

              {missingFields.length > 0 && (
                <div className="mt-1 flex flex-wrap items-center gap-1 bg-white/60 backdrop-blur-sm px-2 py-1 rounded-lg border border-amber-200">
                  <AlertTriangle size={10} className="text-amber-500 flex-shrink-0" />
                  <p className="text-[8px] text-gray-700">
                    <span className="font-semibold text-amber-600">{missingFields.length}</span> fields remaining
                  </p>
                  <button
                    onClick={() => navigate("/userprofile")}
                    className="inline-flex items-center gap-0.5 text-[8px] font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    Complete Now <ArrowRight size={8} />
                  </button>
                </div>
              )}
              
              {missingFields.length === 0 && (
                <div className="mt-1 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                  <CheckCircle size={10} className="text-emerald-500" />
                  <p className="text-[8px] font-medium text-emerald-700">100% complete! 🎉</p>
                </div>
              )}
            </div>
            
            {/* Quick Action Button */}
            <button
              onClick={() => navigate("/userprofile")}
              className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 bg-indigo-600 text-white rounded-lg text-[10px] font-medium hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
            >
              <User size={12} />
              View Profile
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div
          className="admin-dash__stats admin-dash__stats--six"
          style={{ marginBottom: "16px" }}
        >
          {dashboardStatsCards.map((stat, index) => (
            <div
              key={index}
              className={`admin-dash__stat ${isStatActive(stat.filterValue) ? "admin-dash__stat--active" : ""}`}
              onClick={stat.onClick}
              style={{
                padding: "12px 14px",
                minHeight: "80px",
              }}
              title="Click to filter"
            >
              <div className="admin-dash__stat-top">
                <span className="admin-dash__stat-label" style={{ fontSize: "11px" }}>
                  {stat.label}
                </span>
                <div
                  className={`admin-dash__stat-icon admin-dash__stat-icon--${stat.color}`}
                  style={{ width: "28px", height: "28px" }}
                >
                  <stat.icon size={14} />
                </div>
              </div>
              <div className="admin-dash__stat-value" style={{ fontSize: "18px", fontWeight: "700" }}>
                {stat.value}
              </div>
              <div className="admin-dash__stat-meta" style={{ fontSize: "9px" }}>
                {stat.meta}
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 mb-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
              />
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
              >
                <option value="all">All Bookings ({bookings.length})</option>
                <option value="visits">Site Visits ({visitCount})</option>
                <option value="spaces">Space Bookings ({regularCount})</option>
              </select>
              <select
                value={filters.paymentStatus}
                onChange={(e) => setFilters(prev => ({ ...prev, paymentStatus: e.target.value }))}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
              >
                <option value="all">Payment Status</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
              {(filters.status !== "all" || filters.paymentStatus !== "all" || filterDate || searchTerm || activeTab !== "all") && (
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
            Showing {displayBookings.length} of {bookings.length} bookings
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          {displayBookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <Calendar size={48} className="opacity-20 mb-3" />
              <p className="text-sm font-medium">No bookings found</p>
              <p className="text-xs text-gray-400 mt-1">
                {bookings.length === 0 ? "You haven't made any bookings yet." : "Try adjusting your filters."}
              </p>
              {bookings.length === 0 && (
                <button
                  onClick={() => navigate("/spaceforusers")}
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
                    <th className="px-3 py-2.5 text-[9px] font-bold tracking-wider text-gray-500 uppercase">S.No</th>
                    <th className="px-3 py-2.5 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Cabin</th>
                    <th className="px-3 py-2.5 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Date &amp; Time</th>
                    <th className="px-3 py-2.5 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Status</th>
                    <th className="px-3 py-2.5 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Amount</th>
                    <th className="px-3 py-2.5 text-[9px] font-bold tracking-wider text-gray-500 uppercase text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {displayBookings.map((booking, idx) => {
                    const status = getStatusBadge(booking.status, booking.paymentStatus);
                    return (
                      <tr key={booking._id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="px-3 py-2.5">
                          <span className="text-[10px] font-semibold text-gray-400">{idx + 1}</span>
                        </td>
                        <td className="px-3 py-2.5">
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">
                              {booking.cabin?.name || 'Unknown Cabin'}
                            </p>
                            <p className="text-[9px] text-gray-400 flex items-center gap-0.5">
                              <MapPin size={9} />
                              {booking.cabin?.address?.split(',')[0] || 'N/A'}
                            </p>
                            <p className="text-[8px] text-gray-400">
                              Owner: {booking.cabin?.owner?.name || 'N/A'}
                            </p>
                          </div>
                        </td>
                        <td className="px-3 py-2.5">
                          <p className="text-sm text-gray-700">{formatDate(booking.startDate)}</p>
                          <p className="text-[9px] text-gray-400">
                            {booking.startTime} - {booking.endTime} ({booking.totalHours}h)
                          </p>
                        </td>
                        <td className="px-3 py-2.5">
                          <span className={`px-2.5 py-0.5 text-[9px] font-bold rounded-full ${status.color}`}>
                            {status.label}
                          </span>
                          {booking.paymentStatus && (
                            <span className={`ml-1 px-2 py-0.5 text-[8px] font-bold rounded-full ${
                              booking.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-700' : 
                              booking.paymentStatus === 'failed' ? 'bg-red-100 text-red-700' : 
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {booking.paymentStatus}
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-2.5">
                          <span className="text-sm font-bold text-indigo-600">
                            {formatCurrency(booking.totalPrice)}
                          </span>
                          {booking.extraCharge > 0 && (
                            <p className="text-[8px] text-amber-500">+₹{booking.extraCharge} seat</p>
                          )}
                        </td>
                        <td className="px-3 py-2.5 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleViewBooking(booking)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-[9px] font-medium hover:bg-indigo-100 transition"
                              title="View Details"
                            >
                              <Eye size={11} /> View
                            </button>
                            <button
                              onClick={() => downloadInvoice(booking)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[9px] font-medium hover:bg-emerald-100 transition"
                              title="Download Invoice"
                            >
                              <FileDown size={11} /> Invoice
                            </button>
                          </div>
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

      {/* Booking Detail Modal */}
      {isModalOpen && selectedBooking && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Ticket size={20} className="text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Booking Details</h2>
                  <p className="text-xs text-gray-500">#{selectedBooking._id?.slice(-8).toUpperCase()}</p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XIcon size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Customer & Cabin Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Customer Details</h3>
                  <div className="space-y-1.5">
                    <p className="text-sm font-semibold text-gray-900">{selectedBooking.name || 'N/A'}</p>
                    <p className="text-xs text-gray-600 flex items-center gap-1.5">
                      <Mail size={12} /> {selectedBooking.email || 'N/A'}
                    </p>
                    <p className="text-xs text-gray-600 flex items-center gap-1.5">
                      <Phone size={12} /> {selectedBooking.mobile || 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Cabin Details</h3>
                  <div className="space-y-1.5">
                    <p className="text-sm font-semibold text-gray-900">{selectedBooking.cabin?.name || 'N/A'}</p>
                    <p className="text-xs text-gray-600 flex items-center gap-1.5">
                      <MapPin size={12} /> {selectedBooking.cabin?.address || 'N/A'}
                    </p>
                    <p className="text-xs text-gray-600">Type: {selectedBooking.cabin?.cabinType || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Start</h3>
                  <p className="text-sm font-semibold text-gray-900">{formatDate(selectedBooking.startDate)}</p>
                  <p className="text-xs text-blue-600 font-medium">{selectedBooking.startTime}</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                  <h3 className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-2">End</h3>
                  <p className="text-sm font-semibold text-gray-900">{formatDate(selectedBooking.endDate)}</p>
                  <p className="text-xs text-purple-600 font-medium">{selectedBooking.endTime}</p>
                </div>
              </div>

              {/* Booking Details */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Booking Information</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <p className="text-[10px] text-gray-400">Total Hours</p>
                    <p className="text-sm font-semibold text-gray-900">{selectedBooking.totalHours || 0}h</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400">Booking Type</p>
                    <p className="text-sm font-semibold text-gray-900">{selectedBooking.bookingBasis || 'Hourly'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400">Seats</p>
                    <p className="text-sm font-semibold text-gray-900">{selectedBooking.seatCount || 0}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400">Created</p>
                    <p className="text-xs font-semibold text-gray-900">{formatDateTime(selectedBooking.createdAt)}</p>
                  </div>
                </div>
              </div>

              {/* Selected Seats */}
              {selectedBooking.selectedSeats && selectedBooking.selectedSeats.length > 0 && (
                <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                  <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">🪑 Selected Seats</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedBooking.selectedSeats.map((seat, idx) => (
                      <span 
                        key={idx}
                        className="px-2.5 py-1 bg-white rounded-lg text-xs font-medium text-emerald-700 border border-emerald-200"
                      >
                        {seat.name || 'Seat'} (#{seat.number || 'N/A'})
                      </span>
                    ))}
                  </div>
                  {selectedBooking.extraCharge > 0 && (
                    <p className="text-xs text-emerald-600 mt-2 font-medium">
                      Extra Charge: {formatCurrency(selectedBooking.extraCharge)}
                    </p>
                  )}
                </div>
              )}

              {/* Price Breakdown */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Price Breakdown</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal ({selectedBooking.totalHours || 0}h × ₹{selectedBooking.cabin?.price || 0})</span>
                    <span className="font-medium">{formatCurrency(selectedBooking.subtotal)}</span>
                  </div>
                  {selectedBooking.extraCharge > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Seat Charges ({selectedBooking.seatCount} seats)</span>
                      <span className="font-medium">{formatCurrency(selectedBooking.extraCharge)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">GST ({(selectedBooking.gstRate || 0.18) * 100}%)</span>
                    <span className="font-medium">{formatCurrency(selectedBooking.gstAmount)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200">
                    <span>Total Amount</span>
                    <span className="text-indigo-600">{formatCurrency(selectedBooking.totalPrice)}</span>
                  </div>
                </div>
              </div>

              {/* Statuses */}
              <div className="flex flex-wrap gap-3 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Status:</span>
                  <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${getStatusBadge(selectedBooking.status, selectedBooking.paymentStatus).color}`}>
                    {getStatusBadge(selectedBooking.status, selectedBooking.paymentStatus).label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Payment:</span>
                  <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${getPaymentMethodBadge(selectedBooking.paymentMethod).color}`}>
                    {getPaymentMethodBadge(selectedBooking.paymentMethod).label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Payment Status:</span>
                  <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${getPaymentStatusBadge(selectedBooking.paymentStatus).color}`}>
                    {getPaymentStatusBadge(selectedBooking.paymentStatus).label}
                  </span>
                </div>
                {selectedBooking.isPaidToOwner && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Paid to Owner:</span>
                    <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-100 text-emerald-700">✅ Yes</span>
                  </div>
                )}
              </div>

              {/* Payment Details */}
              {(selectedBooking.transactionId || selectedBooking.paymentDetails?.transactionId) && (
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">💳 Payment Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Transaction ID:</span>
                      <p className="font-medium text-gray-900">{selectedBooking.transactionId || selectedBooking.paymentDetails?.transactionId || 'N/A'}</p>
                    </div>
                    {selectedBooking.paymentDetails?.upiId && (
                      <div>
                        <span className="text-gray-500">UPI ID:</span>
                        <p className="font-medium text-gray-900">{selectedBooking.paymentDetails.upiId}</p>
                      </div>
                    )}
                    {selectedBooking.paymentDetails?.upiApp && (
                      <div>
                        <span className="text-gray-500">UPI App:</span>
                        <p className="font-medium text-gray-900">{selectedBooking.paymentDetails.upiApp}</p>
                      </div>
                    )}
                    {selectedBooking.paymentDetails?.paymentDate && (
                      <div>
                        <span className="text-gray-500">Payment Date:</span>
                        <p className="font-medium text-gray-900">{formatDate(selectedBooking.paymentDetails.paymentDate)}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => downloadInvoice(selectedBooking)}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition flex items-center gap-2"
              >
                <FileDown size={16} />
                Download Invoice
              </button>
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Circular Progress Component
const CircularProgress = ({ percentage, size = 100, strokeWidth = 8 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;
  
  const getColor = (p) => {
    if (p >= 80) return '#10b981';
    if (p >= 50) return '#f59e0b';
    return '#ef4444';
  };
  const color = getColor(percentage);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500 ease-in-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold" style={{ color: color }}>
          {percentage}%
        </span>
        <span className="text-[7px] font-medium text-gray-500 uppercase tracking-wider">
          Complete
        </span>
      </div>
    </div>
  );
};

const getCompletionColor = (percentage) => {
  if (percentage >= 80) return 'text-emerald-600';
  if (percentage >= 50) return 'text-yellow-600';
  return 'text-red-500';
};

const getCompletionEmoji = (percentage) => {
  if (percentage >= 80) return '🎉';
  if (percentage >= 50) return '📈';
  if (percentage >= 30) return '📝';
  return '⚠️';
};

export default SimpleUserDashboard;
