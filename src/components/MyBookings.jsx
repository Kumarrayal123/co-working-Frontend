

// // MyBookings.jsx - Complete with ALL Fields from API Response
// import axios from "axios";
// import {
//   Calendar,
//   Clock,
//   IndianRupee,
//   MapPin,
//   Search,
//   User,
//   X,
//   CheckCircle,
//   XCircle,
//   AlertCircle,
//   Download,
//   Eye,
//   FileDown,
//   CreditCard,
//   Store,
//   Receipt,
//   Building2,
//   Edit,
//   RefreshCw,
//   X as XIcon,
//   ChevronDown,
//   TrendingUp,
//   TrendingDown,
//   Filter,
//   XCircle as XCircleIcon,
//   Users,
//   Armchair,
//   CalendarPlus,
//   Stethoscope,
//   Briefcase,
//   Layers,
//   CalendarDays,
//   Wallet,
//   Clock as ClockIcon,
//   History,
//   Calculator,
//   Info,
//   Star,
//   Timer,
//   AlertTriangle,
//   Hash,
//   Phone,
//   Mail,
//   Check,
//   Smartphone,
//   Printer,
//   Upload,
//   Ticket,
//   Image,
//   QrCode
// } from "lucide-react";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import UsersNavbar from "./UsersNavbar";
// import AdminNavbar from "./AdminNavbar";
// import SimpleUserNavbar from "./SimpleUserNavbar";
// import * as XLSX from 'xlsx';
// import "./Dashboard.css";

// const API_URL = "https://spaceapi.iryax.com";

// const MyBookings = () => {
//   const [bookings, setBookings] = useState([]);
//   const [allCabins, setAllCabins] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterDate, setFilterDate] = useState("");
//   const [filters, setFilters] = useState({
//     status: 'all',
//     paymentStatus: 'all',
//     paymentMethod: 'all'
//   });
//   const [activeTab, setActiveTab] = useState('all');
//   const isAdmin = localStorage.getItem("admin") !== null;
//   const user = JSON.parse(localStorage.getItem("user") || "null");
//   const isRegularUser = user?.role === "user";
//   const navigate = useNavigate();
  
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [viewBooking, setViewBooking] = useState(null);

//   const [showReplaceModal, setShowReplaceModal] = useState(false);
//   const [replaceBooking, setReplaceBooking] = useState(null);
//   const [selectedCabin, setSelectedCabin] = useState("");
//   const [replaceLoading, setReplaceLoading] = useState(false);
//   const [selectedCabinData, setSelectedCabinData] = useState(null);

//   const [showCancelModal, setShowCancelModal] = useState(false);
//   const [cancelBooking, setCancelBooking] = useState(null);
//   const [cancelLoading, setCancelLoading] = useState(false);

//   const currentUser = (() => {
//     try {
//       const u = localStorage.getItem("user");
//       const a = localStorage.getItem("admin");
//       if (u) return JSON.parse(u);
//       if (a) return JSON.parse(a);
//       return null;
//     } catch (err) {
//       return null;
//     }
//   })();

//   const getAuthHeader = () => {
//     const token = localStorage.getItem("token");
//     return { headers: { Authorization: `Bearer ${token}` } };
//   };

//   // ✅ Indian Time Format
//   const convertToIndianTime = (timeStr) => {
//     if (!timeStr) return "N/A";
//     if (timeStr.includes('AM') || timeStr.includes('PM')) return timeStr;
//     try {
//       const parts = timeStr.split(':');
//       if (parts.length >= 2) {
//         let hours = parseInt(parts[0]);
//         const minutes = parts[1];
//         if (isNaN(hours)) return timeStr;
//         const ampm = hours >= 12 ? 'PM' : 'AM';
//         const hour12 = hours % 12 || 12;
//         return `${hour12}:${minutes} ${ampm}`;
//       }
//       return timeStr;
//     } catch (e) {
//       return timeStr;
//     }
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

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   const formatDateIndian = (dateStr) => {
//     if (!dateStr) return "N/A";
//     const d = new Date(dateStr);
//     const day = String(d.getDate()).padStart(2, '0');
//     const month = String(d.getMonth() + 1).padStart(2, '0');
//     const year = String(d.getFullYear()).slice(2);
//     return `${day}/${month}/${year}`;
//   };

//   const formatTime12 = (timeStr) => {
//     if (!timeStr) return "N/A";
//     try {
//       const [hours, minutes] = timeStr.split(':').map(Number);
//       if (isNaN(hours) || isNaN(minutes)) return timeStr;
//       const ampm = hours >= 12 ? 'PM' : 'AM';
//       const hours12 = hours % 12 || 12;
//       return `${hours12}:${String(minutes).padStart(2, '0')} ${ampm}`;
//     } catch {
//       return timeStr;
//     }
//   };

//   const fetchBookings = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       console.log("Token:", token);
      
//       if (!token) {
//         console.log("No token found, redirecting to login...");
//         toast.error("Please login to view your bookings");
//         navigate("/login");
//         return;
//       }

//       const isAdminUser = localStorage.getItem("admin") !== null;
      
//       let url;
//       if (isAdminUser) {
//         url = `${API_URL}/api/bookings`;
//       } else {
//         url = `${API_URL}/api/bookings/user`;
//       }
      
//       console.log("Fetching from URL:", url);
//       console.log("Is Admin:", isAdminUser);
      
//       const res = await axios.get(
//         url,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
      
//       console.log("Response data:", res.data);
      
//       let bookingsData = res.data.bookings || [];
      
//       if (isAdminUser) {
//         const adminId = currentUser?._id || currentUser?.id;
//         console.log("Admin ID:", adminId);
        
//         bookingsData = bookingsData.filter(b => {
//           const userId = b.user?._id || b.userId?.toString() || b.userId;
          
//           if (!userId) {
//             console.log("Guest booking found:", b._id, b.name);
//             return true;
//           }
          
//           if (userId === adminId) {
//             console.log("Admin's own booking found:", b._id, b.name);
//             return true;
//           }
          
//           console.log("Filtered out booking:", b._id, "user:", userId);
//           return false;
//         });
        
//         console.log("Filtered bookings for admin:", bookingsData.length);
//       }
      
//       setBookings(bookingsData);
      
//       if (bookingsData.length === 0) {
//         console.log("No bookings found");
//         if (isAdminUser) {
//           toast.info("No bookings found for admin");
//         } else {
//           toast.info("You have no bookings yet");
//         }
//       }
      
//     } catch (error) {
//       console.error("Error fetching bookings:", error);
      
//       if (error.response?.status === 401) {
//         toast.error("Session expired. Please login again.");
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//         localStorage.removeItem("admin");
//         navigate("/login");
//       } else {
//         toast.error("Failed to fetch bookings: " + (error.response?.data?.error || error.message));
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchCabins = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         console.log("No token for cabins fetch");
//         return;
//       }
//       const res = await axios.get(`${API_URL}/api/cabins`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       const activeCabins = res.data.filter(c => c.isActive === true);
//       setAllCabins(activeCabins);
//     } catch (error) {
//       console.error("Failed to fetch cabins:", error);
//     }
//   };

//   useEffect(() => {
//     fetchBookings();
//     fetchCabins();
//   }, []);

//   useEffect(() => {
//     if (selectedCabin && replaceBooking) {
//       const cabin = allCabins.find(c => c._id === selectedCabin);
//       setSelectedCabinData(cabin || null);
//     } else {
//       setSelectedCabinData(null);
//     }
//   }, [selectedCabin, allCabins, replaceBooking]);

//   const getStatusBadge = (status) => {
//     const map = {
//       pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700', icon: <ClockIcon size={12} className="text-yellow-500" /> },
//       confirmed: { label: 'Confirmed', color: 'bg-emerald-100 text-emerald-700', icon: <CheckCircle size={12} className="text-emerald-500" /> },
//       active: { label: 'Active', color: 'bg-indigo-100 text-indigo-700', icon: <Timer size={12} className="text-indigo-500" /> },
//       completed: { label: 'Completed', color: 'bg-blue-100 text-blue-700', icon: <CheckCircle size={12} className="text-blue-500" /> },
//       cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700', icon: <XCircle size={12} className="text-red-500" /> }
//     };
//     return map[status?.toLowerCase()] || { label: status || 'Unknown', color: 'bg-gray-100 text-gray-700', icon: <AlertCircle size={12} className="text-gray-500" /> };
//   };

//   const getPaymentMethodBadge = (method) => {
//     if (method === 'cash' || method === 'counter') {
//       return { label: 'Cash', color: 'bg-orange-100 text-orange-700', icon: <Store size={12} className="text-orange-500" /> };
//     }
//     if (method === 'upi') {
//       return { label: 'UPI', color: 'bg-purple-100 text-purple-700', icon: <Smartphone size={12} className="text-purple-500" /> };
//     }
//     if (method === 'card') {
//       return { label: 'Card', color: 'bg-blue-100 text-blue-700', icon: <CreditCard size={12} className="text-blue-500" /> };
//     }
//     return { label: 'Online', color: 'bg-blue-100 text-blue-700', icon: <CreditCard size={12} className="text-blue-500" /> };
//   };

//   const getPaymentStatusBadge = (status) => {
//     if (status === 'paid') return { label: 'Paid', color: 'bg-emerald-100 text-emerald-700', icon: <CheckCircle size={12} className="text-emerald-500" /> };
//     if (status === 'failed') return { label: 'Failed', color: 'bg-red-100 text-red-700', icon: <XCircle size={12} className="text-red-500" /> };
//     if (status === 'refunded') return { label: 'Refunded', color: 'bg-purple-100 text-purple-700', icon: <XCircle size={12} className="text-purple-500" /> };
//     return { label: 'Pending', color: 'bg-yellow-100 text-yellow-700', icon: <ClockIcon size={12} className="text-yellow-500" /> };
//   };

//   const getTermsBadge = (accepted) => {
//     if (accepted) return { label: '✓ Accepted', color: 'bg-emerald-100 text-emerald-700' };
//     return { label: '✗ Not Accepted', color: 'bg-red-100 text-red-700' };
//   };

//   const exportToExcel = () => {
//     try {
//       if (displayBookings.length === 0) {
//         toast.warning("No bookings to export");
//         return;
//       }
//       const data = displayBookings.map((b, i) => ({
//         'S.No': i + 1,
//         'Booking ID': b._id?.slice(-8).toUpperCase() || 'N/A',
//         'Type': b.bookingType || 'booking',
//         'Basis': b.bookingBasis || 'hourly',
//         'Cabin': b.cabin?.name || 'Unknown',
//         'Space Type': b.cabin?.isChamber ? 'Medical Chamber' : 'Co-Working Space',
//         'Customer': b.name || 'N/A',
//         'Mobile': b.mobile || 'N/A',
//         'Start Date': b.startDate || 'N/A',
//         'Start Time': formatTime12(b.startTime),
//         'End Date': b.endDate || 'N/A',
//         'End Time': formatTime12(b.endTime),
//         'Total Hours': b.totalHours || 0,
//         'Total Days': b.totalDays || 0,
//         'Daily Hours': b.dailyHours?.join(', ') || 'N/A',
//         'Slots': b.bookingSlots?.map(s => `${formatDateIndian(s.date)} ${s.startTime}-${s.endTime}`).join('; ') || 'N/A',
//         'Seats': b.seatCount || 0,
//         'Seat Names': b.selectedSeats?.map(s => s.name).join(', ') || 'N/A',
//         'Extra Charge': b.extraCharge || 0,
//         'Subtotal (₹)': b.subtotal || 0,
//         'GST (₹)': b.gstAmount || 0,
//         'Total (₹)': b.totalPrice || 0,
//         'Status': getStatusBadge(b.status).label,
//         'Payment': getPaymentMethodBadge(b.paymentMethod).label,
//         'Pmt Status': getPaymentStatusBadge(b.paymentStatus).label,
//         'Terms': b.termsAccepted ? 'Yes' : 'No',
//         'Transaction ID': b.transactionId || 'N/A',
//         'UPI ID': b.paymentDetails?.upiId || 'N/A',
//         'UPI App': b.paymentDetails?.upiApp || 'N/A',
//         'Card Number': b.paymentDetails?.cardNumber || 'N/A',
//         'Check-in': b.checkInTime || 'N/A',
//         'Check-out': b.checkOutTime || 'N/A',
//         'Visits': b.visitingTimings?.length || 0,
//         'Created At': b.createdAt ? formatDateTime(b.createdAt) : 'N/A'
//       }));
//       const ws = XLSX.utils.json_to_sheet(data);
//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, 'Bookings');
//       XLSX.writeFile(wb, `bookings_${new Date().toISOString().split('T')[0]}.xlsx`);
//       toast.success(`Exported ${displayBookings.length} bookings!`);
//     } catch (error) {
//       console.error(error);
//       toast.error("Export failed");
//     }
//   };

//   const handleViewBooking = (booking) => {
//     setViewBooking(booking);
//     setShowViewModal(true);
//   };

//   const handleReplaceBooking = async () => {
//     if (!selectedCabin) {
//       toast.error("Please select a cabin to replace");
//       return;
//     }

//     setReplaceLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.put(
//         `${API_URL}/api/bookings/replace-booking/${replaceBooking._id}`,
//         { newCabinId: selectedCabin },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (response.data.success) {
//         toast.success("Booking replaced successfully!");
//         setShowReplaceModal(false);
//         setReplaceBooking(null);
//         setSelectedCabin("");
//         setSelectedCabinData(null);
//         fetchBookings();
//       } else {
//         toast.error(response.data.error || "Failed to replace booking");
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.error || "Failed to replace booking");
//     } finally {
//       setReplaceLoading(false);
//     }
//   };

//   const handleCancelBooking = async () => {
//     setCancelLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.put(
//         `${API_URL}/api/bookings/cancel-booking/${cancelBooking._id}`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (response.data.success) {
//         toast.success(response.data.message || "Booking cancelled successfully!");
//         setShowCancelModal(false);
//         setCancelBooking(null);
//         fetchBookings();
//       } else {
//         toast.error(response.data.error || "Failed to cancel booking");
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.error || "Failed to cancel booking");
//     } finally {
//       setCancelLoading(false);
//     }
//   };

//   const downloadInvoice = (booking) => {
//     try {
//       const cabin = booking.cabin || {};
//       const owner = cabin.owner || {};
//       const win = window.open('', '_blank', 'width=800,height=600');
//       if (!win) {
//         toast.error('Please allow popups');
//         return;
//       }
      
//       let seatListHtml = '';
//       if (booking.selectedSeats && booking.selectedSeats.length > 0) {
//         seatListHtml = booking.selectedSeats.map(s => 
//           `<span style="display:inline-block;background:#f0fdf4;padding:2px 10px;border-radius:12px;margin:2px;font-size:11px;border:1px solid #86efac;">${s.name} (#${s.number})</span>`
//         ).join('');
//       }

//       let slotsHtml = '';
//       if (booking.bookingSlots && booking.bookingSlots.length > 0) {
//         slotsHtml = booking.bookingSlots.map(s => 
//           `<span style="display:inline-block;background:#eff6ff;padding:2px 10px;border-radius:10px;margin:2px;font-size:10px;border:1px solid #93c5fd;">${formatDateIndian(s.date)} ${s.startTime}-${s.endTime} (${s.hours}h)</span>`
//         ).join('');
//       }

//       const isChamber = cabin.isChamber || false;
//       const spaceTypeLabel = isChamber ? '🏥 MEDICAL CHAMBER' : '💼 CO-WORKING SPACE';

//       win.document.write(`
//         <html><head><title>Invoice</title>
//         <style>
//           body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: auto; }
//           .header { border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 20px; display: flex; justify-content: space-between; }
//           h1 { color: #1a56db; margin: 0; }
//           .info { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
//           table { width: 100%; border-collapse: collapse; margin: 20px 0; }
//           th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
//           th { background: #f8fafc; font-weight: 700; }
//           .total { font-size: 20px; font-weight: 700; text-align: right; margin-top: 20px; border-top: 2px solid #000; padding-top: 15px; }
//           .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 2px solid #000; color: #666; font-size: 12px; }
//           .badge { display: inline-block; padding: 2px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; }
//           .seat-section { margin: 10px 0; padding: 10px; background: #f8fafc; border-radius: 8px; }
//           .slot-section { margin: 10px 0; padding: 10px; background: #f0f9ff; border-radius: 8px; border: 1px solid #bae6fd; }
//           .space-type { font-size: 12px; font-weight: 700; color: ${isChamber ? '#166534' : '#1e40af'}; }
//         </style>
//         </head><body>
//           <div class="header">
//             <div><h1>${(owner.organizationName || 'IRYAX Workspace').toUpperCase()}</h1>
//             <div class="space-type">${spaceTypeLabel}</div>
//             <p>GST: ${owner.gstNumber || 'N/A'}</p></div>
//             <div><p><strong>Invoice #${booking._id.slice(-8).toUpperCase()}</strong></p>
//             <p>${new Date().toLocaleDateString()}</p></div>
//           </div>
//           <div class="info">
//             <div><strong>Bill To:</strong><br>${booking.name || 'Customer'}<br>${booking.mobile || 'N/A'}<br>${booking.email || 'N/A'}</div>
//             <div><strong>Cabin:</strong><br>${cabin.name || 'Unknown'}<br>${cabin.address || 'N/A'}<br>Capacity: ${cabin.capacity || 'N/A'} seats</div>
//           </div>
//           ${booking.bookingSlots && booking.bookingSlots.length > 0 ? `
//             <div class="slot-section">
//               <strong>📅 Booking Slots (${booking.bookingSlots.length} days)</strong>
//               <div style="margin-top:5px;">${slotsHtml}</div>
//               <div style="margin-top:5px;font-size:12px;color:#1e40af;">Daily Hours: ${booking.dailyHours?.join(', ') || 'N/A'}h</div>
//             </div>
//           ` : ''}
//           ${booking.selectedSeats && booking.selectedSeats.length > 0 ? `
//             <div class="seat-section">
//               <strong>🪑 Selected Seats (${booking.seatCount})</strong>
//               <div style="margin-top:5px;">${seatListHtml}</div>
//               <div style="margin-top:5px;font-size:12px;color:#666;">Extra Charge: ₹${booking.extraCharge || 0}</div>
//             </div>
//           ` : ''}
//           <table>
//             <tr><th>Description</th><th>Details</th><th>Amount</th></tr>
//             <tr><td><strong>${cabin.name || 'Cabin Booking'}</strong></td>
//             <td>${booking.startDate} ${formatTime12(booking.startTime)} - ${booking.endDate} ${formatTime12(booking.endTime)}<br>${booking.totalHours}h • ${booking.totalDays || 0} days • ${booking.bookingBasis === 'plan' ? 'Plan' : 'Hourly'}</td>
//             <td>₹${(booking.subtotal || 0).toFixed(2)}</td></tr>
//             ${booking.extraCharge > 0 ? `
//             <tr><td><strong>Seat Charges</strong></td>
//             <td>${booking.seatCount} seats × ₹${booking.seatExtraChargePerSeat || 100}</td>
//             <td>₹${(booking.extraCharge || 0).toFixed(2)}</td></tr>
//             ` : ''}
//           </table>
//           <div style="display:flex;gap:20px;margin:10px 0;flex-wrap:wrap;">
//             <span><strong>Payment:</strong> <span class="badge ${getPaymentMethodBadge(booking.paymentMethod).color}">${getPaymentMethodBadge(booking.paymentMethod).label}</span></span>
//             <span><strong>Status:</strong> <span class="badge ${getStatusBadge(booking.status).color}">${getStatusBadge(booking.status).label}</span></span>
//             <span><strong>Pmt Status:</strong> <span class="badge ${getPaymentStatusBadge(booking.paymentStatus).color}">${getPaymentStatusBadge(booking.paymentStatus).label}</span></span>
//             <span><strong>Terms:</strong> <span class="badge ${getTermsBadge(booking.termsAccepted).color}">${booking.termsAccepted ? 'Accepted' : 'Not Accepted'}</span></span>
//           </div>
//           <div class="total">Subtotal: ₹${(booking.subtotal || 0).toFixed(2)}<br>${booking.extraCharge > 0 ? `Seat Charges: ₹${(booking.extraCharge || 0).toFixed(2)}<br>` : ''}GST (18%): ₹${(booking.gstAmount || 0).toFixed(2)}<br>Total: ₹${(booking.totalPrice || 0).toFixed(2)}</div>
//           <div class="footer">Powered by IRYAX SPACE<br>${formatDateTime(booking.createdAt)}</div>
//         </body></html>
//       `);
//       win.document.close();
//       win.focus();
//       toast.success('Invoice opened! Click Print to save as PDF.');
//     } catch (error) {
//       toast.error('Failed to generate invoice');
//     }
//   };

//   // ✅ FILTERED BOOKINGS
//   const filteredBookings = bookings.filter((b) => {
//     const search = searchTerm.toLowerCase();
//     const matchSearch = b.cabin?.name?.toLowerCase().includes(search) ||
//                         b.cabin?.address?.toLowerCase().includes(search) ||
//                         b.name?.toLowerCase().includes(search) ||
//                         b.mobile?.includes(searchTerm);
//     const matchDate = filterDate ? b.startDate === filterDate : true;
//     const matchStatus = filters.status === 'all' || b.status === filters.status;
//     const matchPaymentStatus = filters.paymentStatus === 'all' || b.paymentStatus === filters.paymentStatus;
//     const matchPaymentMethod = filters.paymentMethod === 'all' || b.paymentMethod === filters.paymentMethod;
//     return matchSearch && matchDate && matchStatus && matchPaymentStatus && matchPaymentMethod;
//   });

//   // ✅ TAB BASED FILTERING
//   const getFilteredByTab = () => {
//     if (activeTab === 'visits') {
//       return filteredBookings.filter(b => b.bookingType === 'visit');
//     } else if (activeTab === 'spaces') {
//       return filteredBookings.filter(b => b.bookingType !== 'visit');
//     } else {
//       return filteredBookings;
//     }
//   };

//   const displayBookings = getFilteredByTab();

//   // Stats
//   const totalCount = bookings.length;
//   const activeCount = bookings.filter(b => b.status === 'active' || b.status === 'confirmed').length;
//   const pendingCount = bookings.filter(b => b.status === 'pending').length;
//   const completedCount = bookings.filter(b => b.status === 'completed').length;
//   const visitCount = bookings.filter(b => b.bookingType === 'visit').length;
//   const spaceCount = bookings.filter(b => b.bookingType !== 'visit').length;

//   const getPriceDifference = () => {
//     if (!replaceBooking || !selectedCabinData) return null;
    
//     const currentPrice = replaceBooking.totalPrice || 0;
//     const newPrice = selectedCabinData.price || 0;
//     const totalHours = replaceBooking.totalHours || 1;
//     const newTotal = newPrice * totalHours;
//     const difference = newTotal - currentPrice;
//     const gstDifference = difference * 0.18;
//     const totalWithGst = newTotal + (newTotal * 0.18);
//     const currentWithGst = currentPrice + (currentPrice * 0.18);
//     const finalDifference = totalWithGst - currentWithGst;
    
//     return {
//       currentPrice,
//       newPrice,
//       totalHours,
//       newTotal,
//       difference,
//       gstDifference,
//       totalWithGst,
//       currentWithGst,
//       finalDifference
//     };
//   };

//   const priceDiff = getPriceDifference();

//   const clearFilters = () => {
//     setFilters({
//       status: 'all',
//       paymentStatus: 'all',
//       paymentMethod: 'all'
//     });
//     setSearchTerm('');
//     setFilterDate('');
//   };

//   // ✅ RENDER NAVBAR
//   const renderNavbar = () => {
//     if (isAdmin) return <AdminNavbar />;
//     if (isRegularUser) return <SimpleUserNavbar />;
//     return <UsersNavbar />;
//   };

//   if (loading) {
//     return (
//       <div className="admin-dash" style={{ backgroundColor: '#ffffff' }}>
//         {renderNavbar()}
//         <div className="flex justify-center items-center h-64">
//           <div className="w-12 h-12 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin" />
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="admin-dash" style={{ backgroundColor: '#ffffff' }}>
//       {renderNavbar()}

//       <div className="pt-24 px-3 sm:px-4 md:px-6 lg:px-8 max-w-full mx-auto pb-16">
//         {/* Header */}
//         <div className="admin-dash__header">
//           <div>
//             <h1 className="admin-dash__greeting">
//               {isAdmin ? 'Admin' : 'My'} <span>Bookings</span>
//             </h1>
//             <p className="admin-dash__subtitle">
//               {isAdmin ? 'Manage and view bookings created by you.' : 'Manage and view all your bookings.'}
//             </p>
//           </div>
//         </div>

//         {/* Stats Cards - Exact AdminDashboard style */}
//         <div className="admin-dash__stats" style={{ marginBottom: '16px' }}>
//           {[
//             {
//               label: "Total Bookings",
//               value: totalCount,
//               meta: "all reservations",
//               icon: Ticket,
//               color: "indigo"
//             },
//             {
//               label: "Active",
//               value: activeCount,
//               meta: "confirmed & active",
//               icon: Timer,
//               color: "emerald"
//             },
//             {
//               label: "Pending",
//               value: pendingCount,
//               meta: "awaiting payment",
//               icon: ClockIcon,
//               color: "amber"
//             },
//             {
//               label: "Completed",
//               value: completedCount,
//               meta: "finished reservations",
//               icon: CheckCircle,
//               color: "purple"
//             },
//             {
//               label: "Visits",
//               value: visitCount,
//               meta: "site visits",
//               icon: Eye,
//               color: "cyan"
//             }
//           ].map((stat, index) => (
//             <div
//               key={index}
//               className="admin-dash__stat"
//               style={{ 
//                 padding: '12px 14px',
//                 minHeight: '80px'
//               }}
//             >
//               <div className="admin-dash__stat-top">
//                 <span className="admin-dash__stat-label" style={{ fontSize: '11px' }}>{stat.label}</span>
//                 <div className={`admin-dash__stat-icon admin-dash__stat-icon--${stat.color}`} style={{ width: '28px', height: '28px' }}>
//                   <stat.icon size={14} />
//                 </div>
//               </div>
//               <div className="admin-dash__stat-value" style={{ fontSize: '18px', fontWeight: '700' }}>{stat.value}</div>
//               <div className="admin-dash__stat-meta" style={{ fontSize: '9px' }}>{stat.meta}</div>
//             </div>
//           ))}
//         </div>

//         {/* Filters */}
//         <div className="bg-gray-50 rounded-xl p-3 mb-4 border border-gray-200">
//           <div className="flex flex-wrap items-center gap-3">
//             <div className="flex-1 min-w-[200px] relative">
//               <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search bookings..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
//               />
//             </div>
//             <div className="min-w-[140px]">
//               <input
//                 type="date"
//                 value={filterDate}
//                 onChange={(e) => setFilterDate(e.target.value)}
//                 className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
//               />
//             </div>
//             <div className="min-w-[120px]">
//               <select
//                 value={filters.status}
//                 onChange={(e) => setFilters({...filters, status: e.target.value})}
//                 className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
//               >
//                 <option value="all">All Status</option>
//                 <option value="pending">Pending</option>
//                 <option value="confirmed">Confirmed</option>
//                 <option value="active">Active</option>
//                 <option value="completed">Completed</option>
//                 <option value="cancelled">Cancelled</option>
//               </select>
//             </div>
//             <div className="min-w-[130px]">
//               <select
//                 value={filters.paymentStatus}
//                 onChange={(e) => setFilters({...filters, paymentStatus: e.target.value})}
//                 className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
//               >
//                 <option value="all">Payment Status</option>
//                 <option value="pending">Pending</option>
//                 <option value="paid">Paid</option>
//                 <option value="failed">Failed</option>
//                 <option value="refunded">Refunded</option>
//               </select>
//             </div>
//             <div className="min-w-[130px]">
//               <select
//                 value={filters.paymentMethod}
//                 onChange={(e) => setFilters({...filters, paymentMethod: e.target.value})}
//                 className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
//               >
//                 <option value="all">Payment Method</option>
//                 <option value="online">Online</option>
//                 <option value="cash">Cash</option>
//                 <option value="counter">Counter</option>
//                 <option value="upi">UPI</option>
//                 <option value="card">Card</option>
//               </select>
//             </div>
//             {(filters.status !== 'all' || filters.paymentStatus !== 'all' || filters.paymentMethod !== 'all' || filterDate || searchTerm) && (
//               <button onClick={clearFilters} className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors">
//                 <XCircleIcon size={14} /> Clear
//               </button>
//             )}
//             {displayBookings.length > 0 && (
//               <button onClick={exportToExcel} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium hover:bg-indigo-100 transition-colors border border-indigo-200">
//                 <Download size={14} /> Export
//               </button>
//             )}
//           </div>
//         </div>

//         {/* ✅ TAB SWITCHER */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 mb-4 flex">
//           <button
//             onClick={() => setActiveTab('all')}
//             className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
//               activeTab === 'all'
//                 ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
//                 : 'text-gray-500 hover:bg-gray-50'
//             }`}
//           >
//             All Bookings
//             <span className={`ml-1.5 px-1.5 py-0.5 text-[9px] rounded-full ${
//               activeTab === 'all' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
//             }`}>
//               {totalCount}
//             </span>
//           </button>
//           <button
//             onClick={() => setActiveTab('visits')}
//             className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
//               activeTab === 'visits'
//                 ? 'bg-purple-600 text-white shadow-sm shadow-purple-200'
//                 : 'text-gray-500 hover:bg-gray-50'
//             }`}
//           >
//             Site Visits
//             <span className={`ml-1.5 px-1.5 py-0.5 text-[9px] rounded-full ${
//               activeTab === 'visits' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
//             }`}>
//               {visitCount}
//             </span>
//           </button>
//           <button
//             onClick={() => setActiveTab('spaces')}
//             className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
//               activeTab === 'spaces'
//                 ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-200'
//                 : 'text-gray-500 hover:bg-gray-50'
//             }`}
//           >
//             Space Bookings
//             <span className={`ml-1.5 px-1.5 py-0.5 text-[9px] rounded-full ${
//               activeTab === 'spaces' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
//             }`}>
//               {spaceCount}
//             </span>
//           </button>
//         </div>

//         {/* Table Section */}
//         <div className="admin-dash__card" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}>
//           <div className="admin-dash__card-header flex flex-wrap items-center justify-between gap-3" style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb' }}>
//             <div className="flex items-center gap-3">
//               <h3 className="admin-dash__card-title">
//                 {activeTab === 'all' ? 'All Bookings' : activeTab === 'visits' ? 'Site Visits' : 'Space Bookings'}
//               </h3>
//               <span className="px-2.5 py-0.5 text-xs font-bold text-indigo-700 bg-indigo-100 rounded-full">
//                 {displayBookings.length}
//               </span>
//             </div>
//           </div>

//           <div className="admin-dash__card-body p-0 overflow-x-auto" style={{ backgroundColor: '#ffffff' }}>
//             {displayBookings.length === 0 ? (
//               <div className="flex flex-col items-center justify-center gap-3 py-20 text-gray-400">
//                 <Calendar size={48} className="opacity-20" />
//                 <p className="text-lg font-medium">No bookings found</p>
//                 <p className="text-sm">Try adjusting your filters.</p>
//               </div>
//             ) : (
//               <table className="w-full min-w-[1500px] text-left">
//                 <thead>
//                   <tr className="border-b border-gray-100" style={{ backgroundColor: '#f9fafb' }}>
//                     <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">#</th>
//                     <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Booking ID</th>
//                     <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Cabin</th>
//                     <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Space</th>
//                     <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Customer</th>
//                     {activeTab === 'visits' ? (
//                       <>
//                         <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Visit Date</th>
//                         <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Visit Time</th>
//                         <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Status</th>
//                         <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Created At</th>
//                         <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Actions</th>
//                       </>
//                     ) : (
//                       <>
//                         <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Start</th>
//                         <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">End</th>
//                         <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Hours</th>
//                         <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Days</th>
//                         <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Daily Hrs</th>
//                         <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Seats</th>
//                         <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Status</th>
//                         <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Payment</th>
//                         <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Pmt Status</th>
//                         <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Amount</th>
//                         <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Actions</th>
//                       </>
//                     )}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {displayBookings.map((b, idx) => {
//                     const status = getStatusBadge(b.status);
//                     const pmtMethod = getPaymentMethodBadge(b.paymentMethod);
//                     const pmtStatus = getPaymentStatusBadge(b.paymentStatus);
//                     const seatCount = b.seatCount || 0;
//                     const seatNames = b.selectedSeats?.map(s => s.name).join(', ') || 'N/A';
//                     const isVisit = b.bookingType === 'visit';
//                     const isChamber = b.cabin?.isChamber || false;
//                     const totalDays = b.totalDays || 0;
//                     const dailyHours = b.dailyHours?.join(', ') || 'N/A';
//                     const bookingId = b._id?.slice(-8).toUpperCase() || 'N/A';

//                     return (
//                       <tr key={b._id} className="transition-colors group hover:bg-gray-50/80">
//                         <td className="p-4">
//                           <span className="text-sm font-semibold text-gray-400">#{idx + 1}</span>
//                         </td>
//                         <td className="p-4">
//                           <div>
//                             <p className="font-mono text-xs font-bold text-indigo-600">{bookingId}</p>
//                             <p className="text-[9px] text-gray-400">{b.bookingType === 'visit' ? 'Visit' : 'Booking'}</p>
//                           </div>
//                         </td>
//                         <td className="p-4">
//                           <div>
//                             <p className="font-semibold text-gray-900 text-sm">{b.cabin?.name || 'Unknown'}</p>
//                             <p className="text-[10px] text-gray-400 flex items-center gap-1">
//                               <MapPin size={10} /> {b.cabin?.address?.split(',')[0] || 'N/A'}
//                             </p>
//                           </div>
//                         </td>
//                         <td className="p-4">
//                           <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full inline-flex items-center gap-1 ${
//                             isChamber 
//                               ? 'bg-emerald-100 text-emerald-700' 
//                               : 'bg-blue-100 text-blue-700'
//                           }`}>
//                             {isChamber ? (
//                               <>
//                                 <Stethoscope size={10} /> Medical
//                               </>
//                             ) : (
//                               <>
//                                 <Briefcase size={10} /> Co-Working
//                               </>
//                             )}
//                           </span>
//                         </td>
//                         <td className="p-4">
//                           <p className="font-medium text-gray-800 text-sm">{b.name || 'N/A'}</p>
//                           <p className="text-xs text-gray-400">{b.mobile || 'N/A'}</p>
//                         </td>

//                         {isVisit ? (
//                           <>
//                             <td className="p-4">
//                               <span className="text-sm font-medium text-gray-700">{b.startDate || 'N/A'}</span>
//                             </td>
//                             <td className="p-4">
//                               <span className="text-sm font-medium text-gray-700">{formatTime12(b.startTime)}</span>
//                             </td>
//                             <td className="p-4">
//                               <span className={`px-3 py-1 text-xs font-bold rounded-full ${status.color}`}>{status.label}</span>
//                             </td>
//                             <td className="p-4">
//                               <span className="text-[10px] text-gray-500 font-medium">{formatDateTime(b.createdAt)}</span>
//                             </td>
//                             <td className="p-4">
//                               <div className="flex items-center gap-1">
//                                 <button
//                                   onClick={() => handleViewBooking(b)}
//                                   className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors whitespace-nowrap"
//                                   title="View"
//                                 >
//                                   <Eye size={12} /> View
//                                 </button>
//                               </div>
//                             </td>
//                           </>
//                         ) : (
//                           <>
//                             <td className="p-4">
//                               <div>
//                                 <span className="text-sm font-medium text-gray-700">{b.startDate || 'N/A'}</span>
//                                 <p className="text-[10px] text-indigo-600 font-medium">{formatTime12(b.startTime)}</p>
//                               </div>
//                             </td>
//                             <td className="p-4">
//                               <div>
//                                 <span className="text-sm font-medium text-gray-700">{b.endDate || 'N/A'}</span>
//                                 <p className="text-[10px] text-indigo-600 font-medium">{formatTime12(b.endTime)}</p>
//                               </div>
//                             </td>
//                             <td className="p-4">
//                               <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold">{b.totalHours}h</span>
//                             </td>
//                             <td className="p-4">
//                               <span className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-bold">{totalDays}d</span>
//                             </td>
//                             <td className="p-4">
//                               <div className="flex flex-wrap gap-0.5">
//                                 {b.dailyHours?.map((h, i) => (
//                                   <span key={i} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[9px] font-medium">
//                                     {h}h
//                                   </span>
//                                 )) || <span className="text-xs text-gray-400">N/A</span>}
//                               </div>
//                             </td>
//                             <td className="p-4">
//                               <div>
//                                 <span className="flex items-center gap-1 text-sm font-medium text-gray-700">
//                                   <Armchair size={14} className="text-indigo-500" />
//                                   {seatCount}
//                                 </span>
//                                 {seatCount > 0 && (
//                                   <p className="text-[10px] text-gray-400 truncate max-w-[120px]" title={seatNames}>
//                                     {seatNames}
//                                   </p>
//                                 )}
//                               </div>
//                             </td>
//                             <td className="p-4">
//                               <span className={`px-3 py-1 text-xs font-bold rounded-full ${status.color}`}>{status.label}</span>
//                             </td>
//                             <td className="p-4">
//                               <span className={`px-3 py-1 text-xs font-bold rounded-full ${pmtMethod.color}`}>{pmtMethod.label}</span>
//                             </td>
//                             <td className="p-4">
//                               <span className={`px-3 py-1 text-xs font-bold rounded-full ${pmtStatus.color}`}>{pmtStatus.label}</span>
//                             </td>
//                             <td className="p-4">
//                               <div>
//                                 <span className="text-sm font-bold text-indigo-600">₹{b.totalPrice}</span>
//                                 {b.extraCharge > 0 && (
//                                   <p className="text-[9px] text-amber-500">+₹{b.extraCharge} seat</p>
//                                 )}
//                               </div>
//                             </td>
//                             <td className="p-4">
//                               <div className="flex items-center gap-1 flex-wrap max-w-[220px]">
//                                 <button
//                                   onClick={() => handleViewBooking(b)}
//                                   className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors whitespace-nowrap"
//                                   title="View"
//                                 >
//                                   <Eye size={12} /> View
//                                 </button>
//                                 <button
//                                   onClick={() => downloadInvoice(b)}
//                                   className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors whitespace-nowrap"
//                                   title="Invoice"
//                                 >
//                                   <FileDown size={12} /> Invoice
//                                 </button>
//                                 {(b.status === 'confirmed' || b.status === 'active') && (
//                                   <button
//                                     onClick={() => {
//                                       setReplaceBooking(b);
//                                       setSelectedCabin("");
//                                       setSelectedCabinData(null);
//                                       setShowReplaceModal(true);
//                                     }}
//                                     className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors whitespace-nowrap"
//                                     title="Replace Space"
//                                   >
//                                     <RefreshCw size={12} /> Replace
//                                   </button>
//                                 )}
//                                 {(b.status === 'pending' || b.status === 'confirmed') && (
//                                   <button
//                                     onClick={() => {
//                                       setCancelBooking(b);
//                                       setShowCancelModal(true);
//                                     }}
//                                     className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium bg-red-50 text-red-700 hover:bg-red-100 transition-colors whitespace-nowrap"
//                                     title="Cancel Booking"
//                                   >
//                                     <XIcon size={12} /> Cancel
//                                   </button>
//                                 )}
//                               </div>
//                             </td>
//                           </>
//                         )}
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             )}
//           </div>

//           {/* Footer */}
//           {!loading && displayBookings.length > 0 && (
//             <div className="px-4 py-3 border-t border-gray-100 rounded-b-2xl flex flex-wrap items-center justify-between gap-2" style={{ backgroundColor: '#fafafa' }}>
//               <span className="text-xs text-gray-500">
//                 Showing <strong>{displayBookings.length}</strong> of <strong>{bookings.length}</strong> bookings
//               </span>
//               <div className="flex items-center gap-3 text-xs text-gray-500">
//                 <span className="flex items-center gap-1">
//                   <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
//                   Active: {activeCount}
//                 </span>
//                 <span className="flex items-center gap-1">
//                   <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
//                   Pending: {pendingCount}
//                 </span>
//                 <span className="flex items-center gap-1">
//                   <span className="w-2 h-2 rounded-full bg-blue-500"></span>
//                   Completed: {completedCount}
//                 </span>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ============================================================== */}
//       {/* 📋 VIEW BOOKING MODAL - UPDATED WITH ALL API FIELDS */}
//       {/* ============================================================== */}
//       {showViewModal && viewBooking && (
//         <div 
//           className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
//           onClick={(e) => {
//             if (e.target === e.currentTarget) {
//               setShowViewModal(false);
//             }
//           }}
//         >
//           <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
//             {/* Header */}
//             <div className="sticky top-0 bg-gradient-to-br from-indigo-600 to-purple-600 text-white p-6 rounded-t-3xl flex justify-between items-center">
//               <div>
//                 <h3 className="text-2xl font-bold">Booking Details</h3>
//                 <div className="flex items-center gap-3 mt-1">
//                   <span className="text-sm text-indigo-200 flex items-center gap-1">
//                     <Hash size={14} /> #{viewBooking._id?.slice(-8).toUpperCase()}
//                   </span>
//                   <span className="px-2 py-0.5 bg-white/20 rounded-full text-[10px] font-medium">
//                     {viewBooking.bookingType === 'visit' ? 'Site Visit' : 'Space Booking'}
//                   </span>
//                   <span className="px-2 py-0.5 bg-white/20 rounded-full text-[10px] font-medium capitalize">
//                     {viewBooking.bookingBasis || 'Hourly'}
//                   </span>
//                 </div>
//               </div>
//               <button onClick={() => setShowViewModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="p-6 space-y-4">
//               {/* Cabin & Space Type */}
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
//                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
//                     <Building2 size={12} /> Cabin
//                   </p>
//                   <p className="mt-1 font-semibold text-gray-800 text-sm">{viewBooking.cabin?.name || 'N/A'}</p>
//                   <p className="text-xs text-gray-400 flex items-center gap-0.5 mt-0.5">
//                     <MapPin size={10} /> {viewBooking.cabin?.address?.split(',')[0] || 'N/A'}
//                   </p>
//                   <div className="grid grid-cols-2 gap-1 mt-1 text-xs text-gray-500">
//                     <span>Capacity: {viewBooking.cabin?.capacity || 'N/A'}</span>
//                     <span>Price: ₹{viewBooking.cabin?.price || 0}/hr</span>
//                   </div>
//                   <div className="mt-1 text-xs text-gray-500">
//                     <span className="font-medium">Owner:</span> {viewBooking.cabin?.owner?.name || 'N/A'}
//                   </div>
//                 </div>
//                 <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
//                   <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1">
//                     <Layers size={12} /> Space Type
//                   </p>
//                   <div className="mt-2">
//                     <span className={`px-3 py-1.5 text-xs font-bold rounded-full inline-flex items-center gap-2 ${
//                       viewBooking.cabin?.isChamber 
//                         ? 'bg-emerald-100 text-emerald-700' 
//                         : 'bg-blue-100 text-blue-700'
//                     }`}>
//                       {viewBooking.cabin?.isChamber ? (
//                         <><Stethoscope size={14} /> Medical Chamber</>
//                       ) : (
//                         <><Briefcase size={14} /> Co-Working Space</>
//                       )}
//                     </span>
//                   </div>
//                   {viewBooking.selectedPlan && (
//                     <div className="mt-2 text-xs text-gray-500">
//                       <span className="font-medium">Plan:</span> {viewBooking.selectedPlan.label || 'N/A'}
//                     </div>
//                   )}
//                   <div className="mt-1 text-xs text-gray-500">
//                     <span className="font-medium">Terms:</span>{' '}
//                     <span className={viewBooking.termsAccepted ? 'text-emerald-600 font-medium' : 'text-red-600 font-medium'}>
//                       {viewBooking.termsAccepted ? 'Accepted' : 'Not Accepted'}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* Customer Details */}
//               <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
//                 <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1">
//                   <User size={12} /> Customer Details
//                 </p>
//                 <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
//                   <div>
//                     <p className="text-gray-500 text-xs flex items-center gap-1"><User size={10} /> Name</p>
//                     <p className="font-semibold">{viewBooking.name || viewBooking.user?.name || 'N/A'}</p>
//                   </div>
//                   <div>
//                     <p className="text-gray-500 text-xs flex items-center gap-1"><Phone size={10} /> Mobile</p>
//                     <p className="font-medium">{viewBooking.mobile || viewBooking.user?.mobile || 'N/A'}</p>
//                   </div>
//                   <div className="col-span-2">
//                     <p className="text-gray-500 text-xs flex items-center gap-1"><Mail size={10} /> Email</p>
//                     <p className="font-medium break-all">{viewBooking.email || viewBooking.user?.email || 'N/A'}</p>
//                   </div>
//                 </div>
//               </div>

//               {/* Schedule */}
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
//                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
//                     <CalendarDays size={12} /> Start
//                   </p>
//                   <p className="mt-1 font-semibold text-gray-800">{viewBooking.startDate || 'N/A'}</p>
//                   <p className="text-sm font-bold text-indigo-600">{convertToIndianTime(viewBooking.startTime)}</p>
//                 </div>
//                 <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
//                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
//                     <CalendarDays size={12} /> End
//                   </p>
//                   <p className="mt-1 font-semibold text-gray-800">{viewBooking.endDate || 'N/A'}</p>
//                   <p className="text-sm font-bold text-indigo-600">{convertToIndianTime(viewBooking.endTime)}</p>
//                 </div>
//               </div>

//               {/* Booking Info */}
//               <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
//                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
//                   <Info size={12} /> Booking Info
//                 </p>
//                 <div className="mt-2 flex flex-wrap items-center gap-2">
//                   <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold">
//                     {viewBooking.totalHours || 0}h Total
//                   </span>
//                   <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
//                     {viewBooking.totalDays || 0} Days
//                   </span>
//                   <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
//                     Daily: {viewBooking.dailyHours?.join(', ') || 'N/A'}h
//                   </span>
//                   <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
//                     Remaining: {viewBooking.remainingHours || 0}h
//                   </span>
//                   <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
//                     Used: {viewBooking.hoursUsed || 0}h
//                   </span>
//                 </div>
//               </div>

//               {/* ⭐ MULTI-DAY BOOKING SLOTS */}
//               {viewBooking.bookingSlots && viewBooking.bookingSlots.length > 0 && (
//                 <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200">
//                   <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-2">
//                     <CalendarDays size={14} />
//                     Booking Slots ({viewBooking.bookingSlots.length} days)
//                   </p>
//                   <div className="grid grid-cols-2 gap-2 mt-2">
//                     {viewBooking.bookingSlots.map((slot, idx) => (
//                       <div key={idx} className="bg-white p-2 rounded-lg border border-indigo-100">
//                         <p className="text-xs font-bold text-gray-700">{formatDate(slot.date)}</p>
//                         <p className="text-[10px] text-gray-500">{convertToIndianTime(slot.startTime)} - {convertToIndianTime(slot.endTime)}</p>
//                         <p className="text-[10px] font-bold text-indigo-600">{slot.hours}h</p>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* ⭐ SELECTED SEATS */}
//               {viewBooking.selectedSeats && viewBooking.selectedSeats.length > 0 && (
//                 <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
//                   <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-2">
//                     <Armchair size={14} />
//                     Selected Seats ({viewBooking.seatCount})
//                   </p>
//                   <div className="flex flex-wrap gap-2 mt-2">
//                     {viewBooking.selectedSeats.map((seat) => (
//                       <span key={seat._id} className="px-3 py-1.5 bg-white rounded-lg border border-emerald-200 text-sm font-medium text-gray-700">
//                         {seat.name} <span className="text-gray-400 text-xs">#{seat.number}</span>
//                       </span>
//                     ))}
//                   </div>
//                   <p className="mt-2 text-xs text-emerald-600 font-medium">
//                     Extra Charge: ₹{viewBooking.extraCharge || 0} ({viewBooking.seatCount} × ₹{viewBooking.seatExtraChargePerSeat || 100})
//                   </p>
//                 </div>
//               )}

//               {/* ⭐ VISITING TIMINGS LOG */}
//               {viewBooking.visitingTimings && viewBooking.visitingTimings.length > 0 && (
//                 <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
//                   <p className="text-[10px] font-medium text-blue-600 uppercase tracking-wider flex items-center gap-1">
//                     <History size={14} /> Visit Log ({viewBooking.visitingTimings.length} entries)
//                   </p>
//                   <div className="space-y-1.5 mt-2">
//                     {viewBooking.visitingTimings.map((timing, idx) => (
//                       <div key={idx} className="flex items-center justify-between text-sm bg-white rounded-lg p-2 border border-blue-100">
//                         <div className="flex items-center gap-3">
//                           <span className="text-xs font-bold text-blue-600">Day {idx + 1}</span>
//                           <span className="text-slate-600">{formatDate(timing.date)}</span>
//                         </div>
//                         <div className="flex items-center gap-3">
//                           <span className="text-xs font-medium text-emerald-600">IN: {convertToIndianTime(timing.checkIn)}</span>
//                           <span className="text-xs font-medium text-red-500">OUT: {convertToIndianTime(timing.checkOut)}</span>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* ⭐ CHECK-IN/CHECK-OUT */}
//               {(viewBooking.checkInTime || viewBooking.checkOutTime) && (
//                 <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
//                   <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
//                     <Timer size={14} /> Check-in / Check-out
//                   </p>
//                   <div className="grid grid-cols-2 gap-2 mt-1 text-sm">
//                     <div>
//                       <p className="text-gray-500 text-xs">Scheduled Check-in</p>
//                       <p className="font-medium">{viewBooking.checkInTime || 'N/A'}</p>
//                       {viewBooking.actualCheckIn && (
//                         <p className="text-xs text-emerald-600">✓ Actual: {viewBooking.actualCheckIn}</p>
//                       )}
//                     </div>
//                     <div>
//                       <p className="text-gray-500 text-xs">Scheduled Check-out</p>
//                       <p className="font-medium">{viewBooking.checkOutTime || 'N/A'}</p>
//                       {viewBooking.actualCheckOut && (
//                         <p className="text-xs text-red-500">✓ Actual: {viewBooking.actualCheckOut}</p>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* ⭐ EXTENSION INFO */}
//               {viewBooking.isExtended && (
//                 <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
//                   <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider flex items-center gap-2">
//                     <ClockIcon size={14} /> Booking Extended
//                   </p>
//                   <div className="mt-1">
//                     <p className="text-sm text-gray-700">{viewBooking.extensionDetails || 'Booking was extended'}</p>
//                   </div>
//                 </div>
//               )}

//               {/* ⭐ CANCELLATION INFO */}
//               {viewBooking.status === 'cancelled' && (
//                 <div className="p-4 bg-red-50 rounded-xl border border-red-200">
//                   <p className="text-[10px] font-bold text-red-600 uppercase tracking-wider flex items-center gap-2">
//                     <AlertTriangle size={14} /> Cancelled
//                   </p>
//                   <div className="grid grid-cols-2 gap-2 mt-1">
//                     <div>
//                       <p className="text-[10px] text-gray-400">Cancelled At</p>
//                       <p className="text-sm font-medium text-gray-700">{viewBooking.cancelledAt ? formatDateTime(viewBooking.cancelledAt) : 'N/A'}</p>
//                     </div>
//                     <div>
//                       <p className="text-[10px] text-gray-400">Cancelled By</p>
//                       <p className="text-sm font-medium text-gray-700">{viewBooking.cancelledBy || 'N/A'}</p>
//                     </div>
//                     <div className="col-span-2">
//                       <p className="text-[10px] text-gray-400">Reason</p>
//                       <p className="text-sm font-medium text-gray-700">{viewBooking.cancellationReason || 'No reason provided'}</p>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* ⭐ REVIEW & RATING */}
//               {(viewBooking.review || viewBooking.rating) && (
//                 <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
//                   <p className="text-[10px] font-bold text-yellow-600 uppercase tracking-wider flex items-center gap-2">
//                     <Star size={14} /> Review
//                   </p>
//                   <div className="mt-1 flex items-center gap-3">
//                     <span className="text-lg font-bold text-yellow-500">{viewBooking.rating} ⭐</span>
//                     <span className="text-sm text-gray-700">{viewBooking.review}</span>
//                   </div>
//                 </div>
//               )}

//               {/* ⭐ PRICE BREAKDOWN */}
//               <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
//                 <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-2 mb-3">
//                   <IndianRupee size={14} />
//                   Price Breakdown
//                 </p>
//                 <div className="space-y-2 text-sm">
//                   <div className="flex justify-between items-center border-b border-emerald-100 pb-1.5">
//                     <span className="text-gray-600">Subtotal ({viewBooking.totalHours || 0}h)</span>
//                     <span className="font-semibold text-gray-800">₹{(viewBooking.subtotal || 0).toFixed(2)}</span>
//                   </div>
//                   {viewBooking.extraCharge > 0 && (
//                     <div className="flex justify-between items-center border-b border-emerald-100 pb-1.5">
//                       <span className="text-gray-600">Seat Charges ({viewBooking.seatCount} × ₹{viewBooking.seatExtraChargePerSeat || 100})</span>
//                       <span className="font-semibold text-amber-600">₹{(viewBooking.extraCharge || 0).toFixed(2)}</span>
//                     </div>
//                   )}
//                   <div className="flex justify-between items-center border-b border-emerald-100 pb-1.5">
//                     <span className="text-gray-600">GST ({(viewBooking.gstRate || 0.18) * 100}%)</span>
//                     <span className="font-semibold text-gray-800">₹{(viewBooking.gstAmount || 0).toFixed(2)}</span>
//                   </div>
//                   <div className="flex justify-between items-center pt-2 border-t-2 border-emerald-300">
//                     <span className="font-bold text-gray-800">Total Amount</span>
//                     <span className="text-xl font-bold text-emerald-700">₹{(viewBooking.totalPrice || 0).toFixed(2)}</span>
//                   </div>
//                 </div>
//               </div>

//               {/* ⭐ PAYMENT DETAILS - Full */}
//               <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
//                 <p className="text-[10px] font-bold text-blue-700 uppercase tracking-wider flex items-center gap-2 mb-2">
//                   <Wallet size={14} /> Payment Details
//                 </p>
//                 <div className="grid grid-cols-2 gap-2 text-sm">
//                   <div>
//                     <p className="text-gray-500 text-xs">Payment Method</p>
//                     <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full inline-flex items-center gap-1 ${getPaymentMethodBadge(viewBooking.paymentMethod).color}`}>
//                       {getPaymentMethodBadge(viewBooking.paymentMethod).icon} {getPaymentMethodBadge(viewBooking.paymentMethod).label}
//                     </span>
//                   </div>
//                   <div>
//                     <p className="text-gray-500 text-xs">Payment Status</p>
//                     <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full inline-flex items-center gap-1 ${getPaymentStatusBadge(viewBooking.paymentStatus).color}`}>
//                       {getPaymentStatusBadge(viewBooking.paymentStatus).icon} {getPaymentStatusBadge(viewBooking.paymentStatus).label}
//                     </span>
//                   </div>
//                   <div>
//                     <p className="text-gray-500 text-xs">Transaction ID</p>
//                     <p className="font-mono font-medium text-xs break-all">{viewBooking.transactionId || 'N/A'}</p>
//                   </div>
//                   <div>
//                     <p className="text-gray-500 text-xs">Paid to Owner</p>
//                     <p className="font-medium">{viewBooking.isPaidToOwner ? '✅ Yes' : '❌ No'}</p>
//                   </div>
                  
//                   {/* UPI Details */}
//                   {viewBooking.paymentDetails?.upiId && (
//                     <>
//                       <div className="col-span-2">
//                         <p className="text-gray-500 text-xs">UPI ID</p>
//                         <p className="font-mono text-xs">{viewBooking.paymentDetails.upiId}</p>
//                       </div>
//                       {viewBooking.paymentDetails?.upiApp && (
//                         <div className="col-span-2">
//                           <p className="text-gray-500 text-xs">UPI App</p>
//                           <p className="font-medium text-xs">{viewBooking.paymentDetails.upiApp}</p>
//                         </div>
//                       )}
//                     </>
//                   )}

//                   {/* Card Details */}
//                   {viewBooking.paymentDetails?.cardNumber && (
//                     <>
//                       <div>
//                         <p className="text-gray-500 text-xs">Card Number</p>
//                         <p className="font-mono text-xs">•••• {viewBooking.paymentDetails.cardNumber.slice(-4)}</p>
//                       </div>
//                       {viewBooking.paymentDetails?.cardHolderName && (
//                         <div>
//                           <p className="text-gray-500 text-xs">Card Holder</p>
//                           <p className="font-medium text-xs">{viewBooking.paymentDetails.cardHolderName}</p>
//                         </div>
//                       )}
//                     </>
//                   )}

//                   {/* Payment Date */}
//                   {viewBooking.paymentDetails?.paymentDate && (
//                     <div className="col-span-2">
//                       <p className="text-gray-500 text-xs">Payment Date</p>
//                       <p className="font-medium text-xs">{formatDate(viewBooking.paymentDetails.paymentDate)}</p>
//                     </div>
//                   )}

//                   {/* Screenshot */}
//                   {viewBooking.paymentDetails?.screenshot && (
//                     <div className="col-span-2 mt-1">
//                       <p className="text-gray-500 text-xs flex items-center gap-1"><Image size={10} /> Payment Screenshot</p>
//                       <img 
//                         src={`${API_URL}${viewBooking.paymentDetails.screenshot}`} 
//                         alt="Payment Screenshot" 
//                         className="mt-1 max-h-40 rounded-lg border border-gray-200"
//                       />
//                     </div>
//                   )}

//                   {/* Razorpay IDs */}
//                   {viewBooking.razorpayOrderId && (
//                     <div className="col-span-2">
//                       <p className="text-gray-500 text-xs">Razorpay Order ID</p>
//                       <p className="font-mono text-xs break-all">{viewBooking.razorpayOrderId}</p>
//                     </div>
//                   )}
//                   {viewBooking.razorpayPaymentId && (
//                     <div className="col-span-2">
//                       <p className="text-gray-500 text-xs">Razorpay Payment ID</p>
//                       <p className="font-mono text-xs break-all">{viewBooking.razorpayPaymentId}</p>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Status & Payment Summary */}
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//                 <div className="p-3 bg-indigo-50 rounded-xl text-center border border-indigo-200">
//                   <p className="text-[10px] text-indigo-500 font-bold uppercase">Status</p>
//                   <span className={`px-3 py-1 text-xs font-bold rounded-full inline-block mt-1 ${getStatusBadge(viewBooking.status).color}`}>
//                     {getStatusBadge(viewBooking.status).label}
//                   </span>
//                 </div>
//                 <div className="p-3 bg-gray-50 rounded-xl text-center border border-gray-200">
//                   <p className="text-[10px] text-gray-500 font-bold uppercase">Payment</p>
//                   <span className={`px-3 py-1 text-xs font-bold rounded-full inline-block mt-1 ${getPaymentMethodBadge(viewBooking.paymentMethod).color}`}>
//                     {getPaymentMethodBadge(viewBooking.paymentMethod).label}
//                   </span>
//                 </div>
//                 <div className="p-3 bg-gray-50 rounded-xl text-center border border-gray-200">
//                   <p className="text-[10px] text-gray-500 font-bold uppercase">Pmt Status</p>
//                   <span className={`px-3 py-1 text-xs font-bold rounded-full inline-block mt-1 ${getPaymentStatusBadge(viewBooking.paymentStatus).color}`}>
//                     {getPaymentStatusBadge(viewBooking.paymentStatus).label}
//                   </span>
//                 </div>
//                 <div className="p-3 bg-gray-50 rounded-xl text-center border border-gray-200">
//                   <p className="text-[10px] text-gray-500 font-bold uppercase">Created</p>
//                   <p className="mt-1 font-semibold text-gray-800 text-[11px]">{formatDateTime(viewBooking.createdAt)}</p>
//                 </div>
//               </div>

//               {/* ✅ Actions Buttons */}
//               <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-200">
//                 {viewBooking.bookingType !== 'visit' && (
//                   <>
//                     <button
//                       onClick={() => { setShowViewModal(false); downloadInvoice(viewBooking); }}
//                       className="flex-1 min-w-[120px] py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition shadow-sm active:scale-[0.98] flex items-center justify-center gap-2"
//                     >
//                       <FileDown size={16} /> Invoice
//                     </button>
//                   </>
//                 )}
//                 <button
//                   onClick={() => setShowViewModal(false)}
//                   className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Replace Modal */}
//       {showReplaceModal && replaceBooking && (
//         <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowReplaceModal(false)}>
//           <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
//             <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-5 rounded-t-3xl flex justify-between items-center shrink-0">
//               <div>
//                 <h3 className="text-xl font-bold">Replace Space</h3>
//                 <p className="text-sm text-blue-200">{replaceBooking.cabin?.name} → New Space</p>
//               </div>
//               <button onClick={() => setShowReplaceModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
//                 <X size={20} />
//               </button>
//             </div>
//             <div className="p-5 space-y-4 overflow-y-auto flex-1">
//               <div className="bg-blue-50 rounded-xl p-4 text-sm">
//                 <p className="font-bold text-blue-800">Current Booking</p>
//                 <p className="text-slate-600 mt-1">{replaceBooking.cabin?.name}</p>
//                 <p className="text-xs text-slate-500">{replaceBooking.startDate} {formatTime12(replaceBooking.startTime)} - {replaceBooking.endDate} {formatTime12(replaceBooking.endTime)}</p>
//                 <p className="text-xs font-bold text-slate-700 mt-1">Total: ₹{replaceBooking.totalPrice}</p>
//                 {replaceBooking.totalDays > 0 && (
//                   <p className="text-xs text-slate-500">{replaceBooking.totalDays} days • {replaceBooking.totalHours}h total</p>
//                 )}
//               </div>

//               <div>
//                 <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Select New Cabin</label>
//                 <div className="relative">
//                   <select
//                     value={selectedCabin}
//                     onChange={(e) => setSelectedCabin(e.target.value)}
//                     className="w-full p-3 pr-10 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
//                   >
//                     <option value="">Select a cabin...</option>
//                     {allCabins
//                       .filter(c => c._id !== replaceBooking.cabin?._id)
//                       .map(c => (
//                         <option key={c._id} value={c._id}>
//                           {c.name} - ₹{c.price}/hr
//                         </option>
//                       ))}
//                   </select>
//                   <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
//                 </div>
//               </div>

//               {selectedCabinData && priceDiff && (
//                 <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-3">
//                   <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Price Comparison</p>
                  
//                   <div className="grid grid-cols-2 gap-2 text-sm">
//                     <div className="bg-blue-50 rounded-lg p-3">
//                       <p className="text-[10px] text-blue-600 font-medium">Current Cabin</p>
//                       <p className="font-bold text-slate-800">₹{replaceBooking.cabin?.price}/hr</p>
//                       <p className="text-xs text-slate-500">{replaceBooking.totalHours}h = ₹{replaceBooking.totalPrice}</p>
//                     </div>
//                     <div className="bg-emerald-50 rounded-lg p-3">
//                       <p className="text-[10px] text-emerald-600 font-medium">New Cabin</p>
//                       <p className="font-bold text-slate-800">₹{selectedCabinData.price}/hr</p>
//                       <p className="text-xs text-slate-500">{replaceBooking.totalHours}h = ₹{priceDiff.newTotal}</p>
//                     </div>
//                   </div>

//                   <div className="border-t border-gray-200 pt-3">
//                     {priceDiff.finalDifference > 0 ? (
//                       <div className="flex items-center justify-between text-amber-600 bg-amber-50 rounded-lg p-3">
//                         <div className="flex items-center gap-2">
//                           <TrendingUp size={16} />
//                           <span className="text-sm font-medium">You need to pay extra</span>
//                         </div>
//                         <span className="font-bold text-lg">+₹{Math.round(priceDiff.finalDifference)}</span>
//                       </div>
//                     ) : priceDiff.finalDifference < 0 ? (
//                       <div className="flex items-center justify-between text-emerald-600 bg-emerald-50 rounded-lg p-3">
//                         <div className="flex items-center gap-2">
//                           <TrendingDown size={16} />
//                           <span className="text-sm font-medium">You will get refund</span>
//                         </div>
//                         <span className="font-bold text-lg">-₹{Math.round(Math.abs(priceDiff.finalDifference))}</span>
//                       </div>
//                     ) : (
//                       <div className="flex items-center justify-between text-slate-600 bg-slate-100 rounded-lg p-3">
//                         <span className="text-sm font-medium">No price difference</span>
//                         <span className="font-bold text-lg">₹0</span>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}

//               <div className="bg-amber-50 rounded-xl p-3 text-xs text-amber-700 flex items-start gap-2">
//                 <AlertCircle size={16} className="shrink-0 mt-0.5" />
//                 <span>Replacement is subject to availability. Price difference (if any) will be adjusted.</span>
//               </div>
//             </div>

//             <div className="p-4 border-t border-gray-200 shrink-0">
//               <button
//                 onClick={handleReplaceBooking}
//                 disabled={replaceLoading || !selectedCabin}
//                 className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
//               >
//                 {replaceLoading ? 'Replacing...' : <><RefreshCw size={16} /> Replace Booking</>}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Cancel Modal */}
//       {showCancelModal && cancelBooking && (
//         <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowCancelModal(false)}>
//           <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
//             <div className="bg-gradient-to-br from-red-600 to-red-700 text-white p-5 rounded-t-3xl flex justify-between items-center">
//               <div>
//                 <h3 className="text-xl font-bold">Cancel Booking</h3>
//                 <p className="text-sm text-red-200">{cancelBooking.cabin?.name}</p>
//               </div>
//               <button onClick={() => setShowCancelModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
//                 <X size={20} />
//               </button>
//             </div>
//             <div className="p-5 space-y-4">
//               <div className="bg-red-50 rounded-xl p-4 text-sm">
//                 <p className="font-bold text-red-800">Are you sure you want to cancel this booking?</p>
//                 <div className="mt-2 space-y-1 text-slate-600">
//                   <p><span className="text-slate-500">Cabin:</span> {cancelBooking.cabin?.name}</p>
//                   <p><span className="text-slate-500">Start:</span> {cancelBooking.startDate} {formatTime12(cancelBooking.startTime)}</p>
//                   <p><span className="text-slate-500">End:</span> {cancelBooking.endDate} {formatTime12(cancelBooking.endTime)}</p>
//                   <p><span className="text-slate-500">Total:</span> ₹{cancelBooking.totalPrice}</p>
//                   {cancelBooking.totalDays > 0 && (
//                     <p><span className="text-slate-500">Days:</span> {cancelBooking.totalDays} days ({cancelBooking.totalHours}h)</p>
//                   )}
//                 </div>
//               </div>

//               <div className="bg-amber-50 rounded-xl p-3 text-xs text-amber-700 flex items-start gap-2">
//                 <AlertCircle size={16} className="shrink-0 mt-0.5" />
//                 <div>
//                   <p className="font-bold">Cancellation Policy:</p>
//                   <ul className="list-disc pl-4 mt-1 space-y-0.5">
//                     <li>Free cancellation within <span className="font-bold">24 hours</span> of booking</li>
//                     <li>50% refund for cancellations after 24 hours</li>
//                     <li>No refund for no-shows</li>
//                   </ul>
//                 </div>
//               </div>

//               <div className="flex gap-3">
//                 <button
//                   onClick={handleCancelBooking}
//                   disabled={cancelLoading}
//                   className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
//                 >
//                   {cancelLoading ? 'Cancelling...' : <><XIcon size={16} /> Cancel Booking</>}
//                 </button>
//                 <button
//                   onClick={() => setShowCancelModal(false)}
//                   className="px-5 py-3 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyBookings;




// MyBookings.jsx - Complete with ALL Fields from API Response
// import axios from "axios";
// import {
//   Calendar,
//   Clock,
//   IndianRupee,
//   MapPin,
//   Search,
//   User,
//   X,
//   CheckCircle,
//   XCircle,
//   AlertCircle,
//   Download,
//   Eye,
//   FileDown,
//   CreditCard,
//   Store,
//   Receipt,
//   Building2,
//   Edit,
//   RefreshCw,
//   X as XIcon,
//   ChevronDown,
//   TrendingUp,
//   TrendingDown,
//   Filter,
//   XCircle as XCircleIcon,
//   Users,
//   Armchair,
//   CalendarPlus,
//   Stethoscope,
//   Briefcase,
//   Layers,
//   CalendarDays,
//   Wallet,
//   Clock as ClockIcon,
//   History,
//   Calculator,
//   Info,
//   Star,
//   Timer,
//   AlertTriangle,
//   Hash,
//   Phone,
//   Mail,
//   Check,
//   Smartphone,
//   Printer,
//   Upload,
//   Ticket,
//   Image,
//   QrCode
// } from "lucide-react";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import UsersNavbar from "./UsersNavbar";
// import AdminNavbar from "./AdminNavbar";
// import SimpleUserNavbar from "./SimpleUserNavbar";
// import * as XLSX from 'xlsx';
// import "./Dashboard.css";

// const API_URL = "https://spaceapi.iryax.com";

// const MyBookings = () => {
//   const [bookings, setBookings] = useState([]);
//   const [allCabins, setAllCabins] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterDate, setFilterDate] = useState("");
//   const [filters, setFilters] = useState({
//     status: 'all',
//     paymentStatus: 'all',
//     paymentMethod: 'all'
//   });
//   const [activeTab, setActiveTab] = useState('all');
//   const isAdmin = localStorage.getItem("admin") !== null;
//   const user = JSON.parse(localStorage.getItem("user") || "null");
//   const isRegularUser = user?.role === "user";
//   const navigate = useNavigate();
  
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [viewBooking, setViewBooking] = useState(null);

//   const [showReplaceModal, setShowReplaceModal] = useState(false);
//   const [replaceBooking, setReplaceBooking] = useState(null);
//   const [selectedCabin, setSelectedCabin] = useState("");
//   const [replaceLoading, setReplaceLoading] = useState(false);
//   const [selectedCabinData, setSelectedCabinData] = useState(null);

//   const [showCancelModal, setShowCancelModal] = useState(false);
//   const [cancelBooking, setCancelBooking] = useState(null);
//   const [cancelLoading, setCancelLoading] = useState(false);

//   const currentUser = (() => {
//     try {
//       const u = localStorage.getItem("user");
//       const a = localStorage.getItem("admin");
//       if (u) return JSON.parse(u);
//       if (a) return JSON.parse(a);
//       return null;
//     } catch (err) {
//       return null;
//     }
//   })();

//   const getAuthHeader = () => {
//     const token = localStorage.getItem("token");
//     return { headers: { Authorization: `Bearer ${token}` } };
//   };

//   // ✅ Indian Time Format
//   const convertToIndianTime = (timeStr) => {
//     if (!timeStr) return "N/A";
//     if (timeStr.includes('AM') || timeStr.includes('PM')) return timeStr;
//     try {
//       const parts = timeStr.split(':');
//       if (parts.length >= 2) {
//         let hours = parseInt(parts[0]);
//         const minutes = parts[1];
//         if (isNaN(hours)) return timeStr;
//         const ampm = hours >= 12 ? 'PM' : 'AM';
//         const hour12 = hours % 12 || 12;
//         return `${hour12}:${minutes} ${ampm}`;
//       }
//       return timeStr;
//     } catch (e) {
//       return timeStr;
//     }
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

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   const formatDateIndian = (dateStr) => {
//     if (!dateStr) return "N/A";
//     const d = new Date(dateStr);
//     const day = String(d.getDate()).padStart(2, '0');
//     const month = String(d.getMonth() + 1).padStart(2, '0');
//     const year = String(d.getFullYear()).slice(2);
//     return `${day}/${month}/${year}`;
//   };

//   const formatTime12 = (timeStr) => {
//     if (!timeStr) return "N/A";
//     try {
//       const [hours, minutes] = timeStr.split(':').map(Number);
//       if (isNaN(hours) || isNaN(minutes)) return timeStr;
//       const ampm = hours >= 12 ? 'PM' : 'AM';
//       const hours12 = hours % 12 || 12;
//       return `${hours12}:${String(minutes).padStart(2, '0')} ${ampm}`;
//     } catch {
//       return timeStr;
//     }
//   };

//   const fetchBookings = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       console.log("Token:", token);
      
//       if (!token) {
//         console.log("No token found, redirecting to login...");
//         toast.error("Please login to view your bookings");
//         navigate("/login");
//         return;
//       }

//       const isAdminUser = localStorage.getItem("admin") !== null;
      
//       let url;
//       if (isAdminUser) {
//         url = `${API_URL}/api/bookings`;
//       } else {
//         url = `${API_URL}/api/bookings/user`;
//       }
      
//       console.log("Fetching from URL:", url);
//       console.log("Is Admin:", isAdminUser);
      
//       const res = await axios.get(
//         url,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
      
//       console.log("Response data:", res.data);
      
//       let bookingsData = res.data.bookings || [];
      
//       if (isAdminUser) {
//         const adminId = currentUser?._id || currentUser?.id;
//         console.log("Admin ID:", adminId);
        
//         bookingsData = bookingsData.filter(b => {
//           const userId = b.user?._id || b.userId?.toString() || b.userId;
          
//           if (!userId) {
//             console.log("Guest booking found:", b._id, b.name);
//             return true;
//           }
          
//           if (userId === adminId) {
//             console.log("Admin's own booking found:", b._id, b.name);
//             return true;
//           }
          
//           console.log("Filtered out booking:", b._id, "user:", userId);
//           return false;
//         });
        
//         console.log("Filtered bookings for admin:", bookingsData.length);
//       }
      
//       setBookings(bookingsData);
      
//       if (bookingsData.length === 0) {
//         console.log("No bookings found");
//         if (isAdminUser) {
//           toast.info("No bookings found for admin");
//         } else {
//           toast.info("You have no bookings yet");
//         }
//       }
      
//     } catch (error) {
//       console.error("Error fetching bookings:", error);
      
//       if (error.response?.status === 401) {
//         toast.error("Session expired. Please login again.");
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//         localStorage.removeItem("admin");
//         navigate("/login");
//       } else {
//         toast.error("Failed to fetch bookings: " + (error.response?.data?.error || error.message));
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchCabins = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         console.log("No token for cabins fetch");
//         return;
//       }
//       const res = await axios.get(`${API_URL}/api/cabins`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       const activeCabins = res.data.filter(c => c.isActive === true);
//       setAllCabins(activeCabins);
//     } catch (error) {
//       console.error("Failed to fetch cabins:", error);
//     }
//   };

//   useEffect(() => {
//     fetchBookings();
//     fetchCabins();
//   }, []);

//   useEffect(() => {
//     if (selectedCabin && replaceBooking) {
//       const cabin = allCabins.find(c => c._id === selectedCabin);
//       setSelectedCabinData(cabin || null);
//     } else {
//       setSelectedCabinData(null);
//     }
//   }, [selectedCabin, allCabins, replaceBooking]);

//   const getStatusBadge = (status) => {
//     const map = {
//       pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
//       confirmed: { label: 'Confirmed', color: 'bg-emerald-100 text-emerald-700' },
//       active: { label: 'Active', color: 'bg-indigo-100 text-indigo-700' },
//       completed: { label: 'Completed', color: 'bg-blue-100 text-blue-700' },
//       cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700' }
//     };
//     return map[status?.toLowerCase()] || { label: status || 'Unknown', color: 'bg-gray-100 text-gray-700' };
//   };

//   const getPaymentMethodBadge = (method) => {
//     if (method === 'cash' || method === 'counter') {
//       return { label: 'Cash', color: 'bg-orange-100 text-orange-700' };
//     }
//     if (method === 'upi') {
//       return { label: 'UPI', color: 'bg-purple-100 text-purple-700' };
//     }
//     if (method === 'card') {
//       return { label: 'Card', color: 'bg-blue-100 text-blue-700' };
//     }
//     return { label: 'Online', color: 'bg-blue-100 text-blue-700' };
//   };

//   const getPaymentStatusBadge = (status) => {
//     if (status === 'paid') return { label: 'Paid', color: 'bg-emerald-100 text-emerald-700' };
//     if (status === 'failed') return { label: 'Failed', color: 'bg-red-100 text-red-700' };
//     if (status === 'refunded') return { label: 'Refunded', color: 'bg-purple-100 text-purple-700' };
//     return { label: 'Pending', color: 'bg-yellow-100 text-yellow-700' };
//   };

//   const getTermsBadge = (accepted) => {
//     if (accepted) return { label: '✓ Accepted', color: 'bg-emerald-100 text-emerald-700' };
//     return { label: '✗ Not Accepted', color: 'bg-red-100 text-red-700' };
//   };

//   const exportToExcel = () => {
//     try {
//       if (displayBookings.length === 0) {
//         toast.warning("No bookings to export");
//         return;
//       }
//       const data = displayBookings.map((b, i) => ({
//         'S.No': i + 1,
//         'Booking ID': b._id?.slice(-8).toUpperCase() || 'N/A',
//         'Type': b.bookingType || 'booking',
//         'Basis': b.bookingBasis || 'hourly',
//         'Cabin': b.cabin?.name || 'Unknown',
//         'Space Type': b.cabin?.isChamber ? 'Medical Chamber' : 'Co-Working Space',
//         'Customer': b.name || 'N/A',
//         'Mobile': b.mobile || 'N/A',
//         'Start Date': b.startDate || 'N/A',
//         'Start Time': formatTime12(b.startTime),
//         'End Date': b.endDate || 'N/A',
//         'End Time': formatTime12(b.endTime),
//         'Total Hours': b.totalHours || 0,
//         'Total Days': b.totalDays || 0,
//         'Daily Hours': b.dailyHours?.join(', ') || 'N/A',
//         'Slots': b.bookingSlots?.map(s => `${formatDateIndian(s.date)} ${s.startTime}-${s.endTime}`).join('; ') || 'N/A',
//         'Seats': b.seatCount || 0,
//         'Seat Names': b.selectedSeats?.map(s => s.name).join(', ') || 'N/A',
//         'Extra Charge': b.extraCharge || 0,
//         'Subtotal (₹)': b.subtotal || 0,
//         'GST (₹)': b.gstAmount || 0,
//         'Total (₹)': b.totalPrice || 0,
//         'Status': getStatusBadge(b.status).label,
//         'Payment': getPaymentMethodBadge(b.paymentMethod).label,
//         'Pmt Status': getPaymentStatusBadge(b.paymentStatus).label,
//         'Terms': b.termsAccepted ? 'Yes' : 'No',
//         'Transaction ID': b.transactionId || 'N/A',
//         'UPI ID': b.paymentDetails?.upiId || 'N/A',
//         'UPI App': b.paymentDetails?.upiApp || 'N/A',
//         'Card Number': b.paymentDetails?.cardNumber || 'N/A',
//         'Check-in': b.checkInTime || 'N/A',
//         'Check-out': b.checkOutTime || 'N/A',
//         'Visits': b.visitingTimings?.length || 0,
//         'Created At': b.createdAt ? formatDateTime(b.createdAt) : 'N/A'
//       }));
//       const ws = XLSX.utils.json_to_sheet(data);
//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, 'Bookings');
//       XLSX.writeFile(wb, `bookings_${new Date().toISOString().split('T')[0]}.xlsx`);
//       toast.success(`Exported ${displayBookings.length} bookings!`);
//     } catch (error) {
//       console.error(error);
//       toast.error("Export failed");
//     }
//   };

//   const handleViewBooking = (booking) => {
//     setViewBooking(booking);
//     setShowViewModal(true);
//   };

//   const handleReplaceBooking = async () => {
//     if (!selectedCabin) {
//       toast.error("Please select a cabin to replace");
//       return;
//     }

//     setReplaceLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.put(
//         `${API_URL}/api/bookings/replace-booking/${replaceBooking._id}`,
//         { newCabinId: selectedCabin },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (response.data.success) {
//         toast.success("Booking replaced successfully!");
//         setShowReplaceModal(false);
//         setReplaceBooking(null);
//         setSelectedCabin("");
//         setSelectedCabinData(null);
//         fetchBookings();
//       } else {
//         toast.error(response.data.error || "Failed to replace booking");
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.error || "Failed to replace booking");
//     } finally {
//       setReplaceLoading(false);
//     }
//   };

//   const handleCancelBooking = async () => {
//     setCancelLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.put(
//         `${API_URL}/api/bookings/cancel-booking/${cancelBooking._id}`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (response.data.success) {
//         toast.success(response.data.message || "Booking cancelled successfully!");
//         setShowCancelModal(false);
//         setCancelBooking(null);
//         fetchBookings();
//       } else {
//         toast.error(response.data.error || "Failed to cancel booking");
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.error || "Failed to cancel booking");
//     } finally {
//       setCancelLoading(false);
//     }
//   };

//   const downloadInvoice = (booking) => {
//     try {
//       const cabin = booking.cabin || {};
//       const owner = cabin.owner || {};
//       const win = window.open('', '_blank', 'width=800,height=600');
//       if (!win) {
//         toast.error('Please allow popups');
//         return;
//       }
      
//       let seatListHtml = '';
//       if (booking.selectedSeats && booking.selectedSeats.length > 0) {
//         seatListHtml = booking.selectedSeats.map(s => 
//           `<span style="display:inline-block;background:#f0fdf4;padding:2px 10px;border-radius:12px;margin:2px;font-size:11px;border:1px solid #86efac;">${s.name} (#${s.number})</span>`
//         ).join('');
//       }

//       let slotsHtml = '';
//       if (booking.bookingSlots && booking.bookingSlots.length > 0) {
//         slotsHtml = booking.bookingSlots.map(s => 
//           `<span style="display:inline-block;background:#eff6ff;padding:2px 10px;border-radius:10px;margin:2px;font-size:10px;border:1px solid #93c5fd;">${formatDateIndian(s.date)} ${s.startTime}-${s.endTime} (${s.hours}h)</span>`
//         ).join('');
//       }

//       const isChamber = cabin.isChamber || false;
//       const spaceTypeLabel = isChamber ? '🏥 MEDICAL CHAMBER' : '💼 CO-WORKING SPACE';

//       win.document.write(`
//         <html><head><title>Invoice</title>
//         <style>
//           body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: auto; }
//           .header { border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 20px; display: flex; justify-content: space-between; }
//           h1 { color: #1a56db; margin: 0; }
//           .info { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
//           table { width: 100%; border-collapse: collapse; margin: 20px 0; }
//           th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
//           th { background: #f8fafc; font-weight: 700; }
//           .total { font-size: 20px; font-weight: 700; text-align: right; margin-top: 20px; border-top: 2px solid #000; padding-top: 15px; }
//           .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 2px solid #000; color: #666; font-size: 12px; }
//           .badge { display: inline-block; padding: 2px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; }
//           .seat-section { margin: 10px 0; padding: 10px; background: #f8fafc; border-radius: 8px; }
//           .slot-section { margin: 10px 0; padding: 10px; background: #f0f9ff; border-radius: 8px; border: 1px solid #bae6fd; }
//           .space-type { font-size: 12px; font-weight: 700; color: ${isChamber ? '#166534' : '#1e40af'}; }
//         </style>
//         </head><body>
//           <div class="header">
//             <div><h1>${(owner.organizationName || 'IRYAX Workspace').toUpperCase()}</h1>
//             <div class="space-type">${spaceTypeLabel}</div>
//             <p>GST: ${owner.gstNumber || 'N/A'}</p></div>
//             <div><p><strong>Invoice #${booking._id.slice(-8).toUpperCase()}</strong></p>
//             <p>${new Date().toLocaleDateString()}</p></div>
//           </div>
//           <div class="info">
//             <div><strong>Bill To:</strong><br>${booking.name || 'Customer'}<br>${booking.mobile || 'N/A'}<br>${booking.email || 'N/A'}</div>
//             <div><strong>Cabin:</strong><br>${cabin.name || 'Unknown'}<br>${cabin.address || 'N/A'}<br>Capacity: ${cabin.capacity || 'N/A'} seats</div>
//           </div>
//           ${booking.bookingSlots && booking.bookingSlots.length > 0 ? `
//             <div class="slot-section">
//               <strong>📅 Booking Slots (${booking.bookingSlots.length} days)</strong>
//               <div style="margin-top:5px;">${slotsHtml}</div>
//               <div style="margin-top:5px;font-size:12px;color:#1e40af;">Daily Hours: ${booking.dailyHours?.join(', ') || 'N/A'}h</div>
//             </div>
//           ` : ''}
//           ${booking.selectedSeats && booking.selectedSeats.length > 0 ? `
//             <div class="seat-section">
//               <strong>🪑 Selected Seats (${booking.seatCount})</strong>
//               <div style="margin-top:5px;">${seatListHtml}</div>
//               <div style="margin-top:5px;font-size:12px;color:#666;">Extra Charge: ₹${booking.extraCharge || 0}</div>
//             </div>
//           ` : ''}
//           <table>
//             <tr><th>Description</th><th>Details</th><th>Amount</th></tr>
//             <tr><td><strong>${cabin.name || 'Cabin Booking'}</strong></td>
//             <td>${booking.startDate} ${formatTime12(booking.startTime)} - ${booking.endDate} ${formatTime12(booking.endTime)}<br>${booking.totalHours}h • ${booking.totalDays || 0} days • ${booking.bookingBasis === 'plan' ? 'Plan' : 'Hourly'}</td>
//             <td>₹${(booking.subtotal || 0).toFixed(2)}</td></tr>
//             ${booking.extraCharge > 0 ? `
//             <tr><td><strong>Seat Charges</strong></td>
//             <td>${booking.seatCount} seats × ₹${booking.seatExtraChargePerSeat || 100}</td>
//             <td>₹${(booking.extraCharge || 0).toFixed(2)}</td></tr>
//             ` : ''}
//           </table>
//           <div style="display:flex;gap:20px;margin:10px 0;flex-wrap:wrap;">
//             <span><strong>Payment:</strong> <span class="badge ${getPaymentMethodBadge(booking.paymentMethod).color}">${getPaymentMethodBadge(booking.paymentMethod).label}</span></span>
//             <span><strong>Status:</strong> <span class="badge ${getStatusBadge(booking.status).color}">${getStatusBadge(booking.status).label}</span></span>
//             <span><strong>Pmt Status:</strong> <span class="badge ${getPaymentStatusBadge(booking.paymentStatus).color}">${getPaymentStatusBadge(booking.paymentStatus).label}</span></span>
//             <span><strong>Terms:</strong> <span class="badge ${getTermsBadge(booking.termsAccepted).color}">${booking.termsAccepted ? 'Accepted' : 'Not Accepted'}</span></span>
//           </div>
//           <div class="total">Subtotal: ₹${(booking.subtotal || 0).toFixed(2)}<br>${booking.extraCharge > 0 ? `Seat Charges: ₹${(booking.extraCharge || 0).toFixed(2)}<br>` : ''}GST (18%): ₹${(booking.gstAmount || 0).toFixed(2)}<br>Total: ₹${(booking.totalPrice || 0).toFixed(2)}</div>
//           <div class="footer">Powered by IRYAX SPACE<br>${formatDateTime(booking.createdAt)}</div>
//         </body></html>
//       `);
//       win.document.close();
//       win.focus();
//       toast.success('Invoice opened! Click Print to save as PDF.');
//     } catch (error) {
//       toast.error('Failed to generate invoice');
//     }
//   };

//   // ✅ FILTERED BOOKINGS
//   const filteredBookings = bookings.filter((b) => {
//     const search = searchTerm.toLowerCase();
//     const matchSearch = b.cabin?.name?.toLowerCase().includes(search) ||
//                         b.cabin?.address?.toLowerCase().includes(search) ||
//                         b.name?.toLowerCase().includes(search) ||
//                         b.mobile?.includes(searchTerm);
//     const matchDate = filterDate ? b.startDate === filterDate : true;
//     const matchStatus = filters.status === 'all' || b.status === filters.status;
//     const matchPaymentStatus = filters.paymentStatus === 'all' || b.paymentStatus === filters.paymentStatus;
//     const matchPaymentMethod = filters.paymentMethod === 'all' || b.paymentMethod === filters.paymentMethod;
//     return matchSearch && matchDate && matchStatus && matchPaymentStatus && matchPaymentMethod;
//   });

//   // ✅ TAB BASED FILTERING
//   const getFilteredByTab = () => {
//     if (activeTab === 'visits') {
//       return filteredBookings.filter(b => b.bookingType === 'visit');
//     } else if (activeTab === 'spaces') {
//       return filteredBookings.filter(b => b.bookingType !== 'visit');
//     } else {
//       return filteredBookings;
//     }
//   };

//   const displayBookings = getFilteredByTab();

//   // Stats
//   const totalCount = bookings.length;
//   const activeCount = bookings.filter(b => b.status === 'active' || b.status === 'confirmed').length;
//   const pendingCount = bookings.filter(b => b.status === 'pending').length;
//   const completedCount = bookings.filter(b => b.status === 'completed').length;
//   const visitCount = bookings.filter(b => b.bookingType === 'visit').length;
//   const spaceCount = bookings.filter(b => b.bookingType !== 'visit').length;

//   const getPriceDifference = () => {
//     if (!replaceBooking || !selectedCabinData) return null;
    
//     const currentPrice = replaceBooking.totalPrice || 0;
//     const newPrice = selectedCabinData.price || 0;
//     const totalHours = replaceBooking.totalHours || 1;
//     const newTotal = newPrice * totalHours;
//     const difference = newTotal - currentPrice;
//     const gstDifference = difference * 0.18;
//     const totalWithGst = newTotal + (newTotal * 0.18);
//     const currentWithGst = currentPrice + (currentPrice * 0.18);
//     const finalDifference = totalWithGst - currentWithGst;
    
//     return {
//       currentPrice,
//       newPrice,
//       totalHours,
//       newTotal,
//       difference,
//       gstDifference,
//       totalWithGst,
//       currentWithGst,
//       finalDifference
//     };
//   };

//   const priceDiff = getPriceDifference();

//   const clearFilters = () => {
//     setFilters({
//       status: 'all',
//       paymentStatus: 'all',
//       paymentMethod: 'all'
//     });
//     setSearchTerm('');
//     setFilterDate('');
//   };

//   // ✅ RENDER SITE VISIT TABLE
//   const renderVisitTable = (bookingsList) => {
//     if (bookingsList.length === 0) {
//       return (
//         <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
//           <div className="flex flex-col items-center text-gray-400">
//             <Calendar size={32} className="opacity-20 mb-2" />
//             <p className="text-sm font-medium">No site visits found</p>
//           </div>
//         </div>
//       );
//     }

//     return (
//       <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
//         <div className="px-4 py-3 bg-purple-50 border-b border-gray-200 flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <Calendar size={16} className="text-purple-600" />
//             <h3 className="font-bold text-gray-800">Site Visits</h3>
//             <span className="px-2 py-0.5 bg-white/60 rounded-full text-xs font-bold text-gray-600">{bookingsList.length}</span>
//           </div>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="w-full text-left text-sm min-w-[1200px]">
//             <thead>
//               <tr className="bg-gray-50 border-b border-gray-100">
//                 <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">#</th>
//                 {/* <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Booking ID</th> */}
//                 <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Cabin</th>
//                 <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Space</th>
//                 <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Visit Date</th>
//                 <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Visit Time</th>
//                 <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Status</th>
//                 <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Created At</th>
//                 <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase text-center">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100">
//               {bookingsList.map((b, idx) => {
//                 const status = getStatusBadge(b.status);
//                 const isChamber = b.cabin?.isChamber || false;
//                 const bookingId = b._id?.slice(-8).toUpperCase() || 'N/A';

//                 return (
//                   <tr key={b._id} className="hover:bg-gray-50/80 transition-colors">
//                     <td className="px-3 py-2">
//                       <span className="text-[10px] font-semibold text-gray-400">#{idx + 1}</span>
//                     </td>
//                     {/* <td className="px-3 py-2">
//                       <span className="font-mono text-[10px] font-bold text-indigo-600">{bookingId}</span>
//                     </td> */}
//                     <td className="px-3 py-2">
//                       <div>
//                         <p className="font-semibold text-gray-900 text-xs">
//                           {b.cabin?.name || 'Unknown Cabin'}
//                         </p>
//                         <p className="text-[9px] text-gray-400 flex items-center gap-0.5">
//                           <MapPin size={9} />
//                           {b.cabin?.address?.split(',')[0] || 'N/A'}
//                         </p>
//                       </div>
//                     </td>
//                     <td className="px-3 py-2">
//                       <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full inline-flex items-center gap-1 ${
//                         isChamber 
//                           ? 'bg-emerald-100 text-emerald-700' 
//                           : 'bg-blue-100 text-blue-700'
//                       }`}>
//                         {isChamber ? (
//                           <><Stethoscope size={9} /> Medical</>
//                         ) : (
//                           <><Briefcase size={9} /> Co-Working</>
//                         )}
//                       </span>
//                     </td>
//                     <td className="px-3 py-2">
//                       <span className="text-xs font-medium text-gray-700">{b.startDate || 'N/A'}</span>
//                     </td>
//                     <td className="px-3 py-2">
//                       <span className="text-xs font-medium text-gray-700">{formatTime12(b.startTime)}</span>
//                     </td>
//                     <td className="px-3 py-2">
//                       <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${status.color}`}>{status.label}</span>
//                     </td>
//                     <td className="px-3 py-2">
//                       <span className="text-[10px] text-gray-500 font-medium">{formatDateTime(b.createdAt)}</span>
//                     </td>
//                     <td className="px-3 py-2 text-center">
//                       <div className="flex items-center justify-center gap-1">
//                         <button
//                           onClick={() => handleViewBooking(b)}
//                           className="p-1 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition"
//                           title="View"
//                         >
//                           <Eye size={13} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     );
//   };

//   // ✅ RENDER REGULAR BOOKINGS TABLE
//   const renderRegularTable = (bookingsList) => {
//     if (bookingsList.length === 0) {
//       return (
//         <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
//           <div className="flex flex-col items-center text-gray-400">
//             <Building2 size={32} className="opacity-20 mb-2" />
//             <p className="text-sm font-medium">No space bookings found</p>
//           </div>
//         </div>
//       );
//     }

//     return (
//       <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
//         <div className="px-4 py-3 bg-indigo-50 border-b border-gray-200 flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <Building2 size={16} className="text-indigo-600" />
//             <h3 className="font-bold text-gray-800">Space Bookings</h3>
//             <span className="px-2 py-0.5 bg-white/60 rounded-full text-xs font-bold text-gray-600">{bookingsList.length}</span>
//           </div>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="w-full text-left text-sm min-w-[1400px]">
//             <thead>
//               <tr className="bg-gray-50 border-b border-gray-100">
//                 <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">S. No</th>
//                 {/* <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Booking ID</th> */}
//                 <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Cabin</th>
//                 <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Space</th>
//                 <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Start</th>
//                 <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">End</th>
//                 <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Hours</th>
//                 <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Days</th>
//                 <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Seats</th>
//                 <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Status</th>
//                 <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Payment</th>
//                 <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Amount</th>
//                 <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Created At</th>
//                 <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase text-center">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100">
//               {bookingsList.map((b, idx) => {
//                 const status = getStatusBadge(b.status);
//                 const pmtMethod = getPaymentMethodBadge(b.paymentMethod);
//                 const pmtStatus = getPaymentStatusBadge(b.paymentStatus);
//                 const seatCount = b.seatCount || 0;
//                 const canCancel = b.status === 'pending' || b.status === 'confirmed';
//                 const canReplace = b.status === 'confirmed' || b.status === 'active';
//                 const isChamber = b.cabin?.isChamber || false;
//                 const totalDays = b.totalDays || 0;
//                 const bookingId = b._id?.slice(-8).toUpperCase() || 'N/A';

//                 return (
//                   <tr key={b._id} className="hover:bg-gray-50/80 transition-colors">
//                     <td className="px-3 py-2">
//                       <span className="text-[10px] font-semibold text-gray-400">{idx + 1}</span>
//                     </td>
//                     {/* <td className="px-3 py-2">
//                       <span className="font-mono text-[10px] font-bold text-indigo-600">{bookingId}</span>
//                     </td> */}
//                     <td className="px-3 py-2">
//                       <div>
//                         <p className="font-semibold text-gray-900 text-xs">
//                           {b.cabin?.name || 'Unknown Cabin'}
//                         </p>
//                         <p className="text-[9px] text-gray-400 flex items-center gap-0.5">
//                           <MapPin size={9} />
//                           {b.cabin?.address?.split(',')[0] || 'N/A'}
//                         </p>
//                       </div>
//                     </td>
//                     <td className="px-3 py-2">
//                       <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full inline-flex items-center gap-1 ${
//                         isChamber 
//                           ? 'bg-emerald-100 text-emerald-700' 
//                           : 'bg-blue-100 text-blue-700'
//                       }`}>
//                         {isChamber ? (
//                           <><Stethoscope size={9} /> Medical</>
//                         ) : (
//                           <><Briefcase size={9} /> Co-Working</>
//                         )}
//                       </span>
//                     </td>
//                     <td className="px-3 py-2">
//                       <div>
//                         <span className="text-xs font-medium text-gray-700">{b.startDate || 'N/A'}</span>
//                         <p className="text-[9px] text-indigo-600 font-medium">{formatTime12(b.startTime)}</p>
//                       </div>
//                     </td>
//                     <td className="px-3 py-2">
//                       <div>
//                         <span className="text-xs font-medium text-gray-700">{b.endDate || 'N/A'}</span>
//                         <p className="text-[9px] text-indigo-600 font-medium">{formatTime12(b.endTime)}</p>
//                       </div>
//                     </td>
//                     <td className="px-3 py-2">
//                       <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full text-[9px] font-bold">{b.totalHours}h</span>
//                     </td>
//                     <td className="px-3 py-2">
//                       <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full text-[9px] font-bold">{totalDays}d</span>
//                     </td>
//                     <td className="px-3 py-2">
//                       <span className="flex items-center gap-1 text-xs font-medium text-gray-700">
//                         <Armchair size={12} className="text-indigo-500" />
//                         {seatCount}
//                       </span>
//                     </td>
//                     <td className="px-3 py-2">
//                       <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${status.color}`}>{status.label}</span>
//                     </td>
//                     <td className="px-3 py-2">
//                       <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${pmtMethod.color}`}>{pmtMethod.label}</span>
//                       <span className={`ml-1 px-2 py-0.5 text-[9px] font-bold rounded-full ${pmtStatus.color}`}>{pmtStatus.label}</span>
//                     </td>
//                     <td className="px-3 py-2">
//                       <span className="text-xs font-bold text-indigo-600">₹{b.totalPrice}</span>
//                       {b.extraCharge > 0 && (
//                         <p className="text-[8px] text-amber-500">+₹{b.extraCharge} seat</p>
//                       )}
//                     </td>
//                     <td className="px-3 py-2">
//                       <span className="text-[10px] text-gray-500 font-medium">{formatDateTime(b.createdAt)}</span>
//                     </td>
//                     <td className="px-3 py-2 text-center">
//                       <div className="flex items-center justify-center gap-1 flex-wrap">
//                         <button
//                           onClick={() => handleViewBooking(b)}
//                           className="p-1 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition"
//                           title="View"
//                         >
//                           <Eye size={13} />
//                         </button>
//                         <button
//                           onClick={() => downloadInvoice(b)}
//                           className="p-1 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition"
//                           title="Invoice"
//                         >
//                           <FileDown size={13} />
//                         </button>
//                         {canReplace && (
//                           <button
//                             onClick={() => {
//                               setReplaceBooking(b);
//                               setSelectedCabin("");
//                               setSelectedCabinData(null);
//                               setShowReplaceModal(true);
//                             }}
//                             className="p-1 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition"
//                             title="Replace Space"
//                           >
//                             <RefreshCw size={13} />
//                           </button>
//                         )}
//                         {canCancel && (
//                           <button
//                             onClick={() => {
//                               setCancelBooking(b);
//                               setShowCancelModal(true);
//                             }}
//                             className="p-1 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition"
//                             title="Cancel Booking"
//                           >
//                             <XIcon size={13} />
//                           </button>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     );
//   };

//   // ✅ RENDER NAVBAR
//   const renderNavbar = () => {
//     if (isAdmin) return <AdminNavbar />;
//     if (isRegularUser) return <SimpleUserNavbar />;
//     return <UsersNavbar />;
//   };

//   // Stats for cards
//   const statsCount = {
//     total: bookings.length,
//     pending: bookings.filter(b => b.status === 'pending').length,
//     active: bookings.filter(b => b.status === 'active' || (b.status === 'confirmed' && b.paymentStatus !== 'paid')).length,
//     completed: bookings.filter(b => b.status === 'completed' || (b.status === 'confirmed' && b.paymentStatus === 'paid')).length,
//     cancelled: bookings.filter(b => b.status === 'cancelled').length
//   };

//   const bookingStatsCards = [
//     {
//       label: "Total",
//       value: statsCount.total,
//       meta: "all reservations",
//       icon: Ticket,
//       color: "indigo",
//       onClick: () => setFilters(prev => ({ ...prev, status: 'all' }))
//     },
//     {
//       label: "Pending",
//       value: statsCount.pending,
//       meta: "awaiting confirmation",
//       icon: Clock,
//       color: "amber",
//       onClick: () => setFilters(prev => ({ ...prev, status: 'pending' }))
//     },
//     {
//       label: "Active",
//       value: statsCount.active,
//       meta: "active & confirmed",
//       icon: Building2,
//       color: "emerald",
//       onClick: () => setFilters(prev => ({ ...prev, status: 'confirmed' }))
//     },
//     {
//       label: "Completed",
//       value: statsCount.completed,
//       meta: "confirmed & paid",
//       icon: CheckCircle,
//       color: "purple",
//       onClick: () => setFilters(prev => ({ ...prev, status: 'completed' }))
//     },
//     {
//       label: "Cancelled",
//       value: statsCount.cancelled,
//       meta: "cancelled reservations",
//       icon: XCircle,
//       color: "rose",
//       onClick: () => setFilters(prev => ({ ...prev, status: 'cancelled' }))
//     }
//   ];

//   if (loading) {
//     return (
//       <div className="admin-dash" style={{ backgroundColor: '#ffffff' }}>
//         {renderNavbar()}
//         <div className="flex justify-center items-center h-64">
//           <div className="w-12 h-12 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin" />
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="admin-dash" style={{ backgroundColor: '#ffffff' }}>
//       {renderNavbar()}

//       <div className="pt-20 px-3 sm:px-4 md:px-6 lg:px-8 max-w-full mx-auto pb-16">
//         {/* Header */}
//         <div className="admin-dash__header" style={{ marginBottom: '8px' }}>
//           <div>
//             <h1 className="admin-dash__greeting" style={{ fontSize: '1.25rem' }}>
//               {isAdmin ? 'Admin' : 'My'} <span>Bookings</span>
//             </h1>
//             <p className="admin-dash__subtitle" style={{ fontSize: '11px' }}>
//               {isAdmin ? 'Manage and view bookings created by you.' : 'Manage and view all your bookings.'}
//             </p>
//           </div>
//           <div className="flex items-center gap-2">
//             {displayBookings.length > 0 && (
//               <button
//                 onClick={exportToExcel}
//                 className="flex items-center gap-1.5 px-3 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium hover:bg-indigo-100 transition border border-indigo-200"
//               >
//                 <Download size={14} />
//                 Export
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Stats Cards - Same design as SimpleUserBookings */}
//         <div className="admin-dash__stats" style={{ marginBottom: '16px' }}>
//           {bookingStatsCards.map((stat, index) => (
//             <div
//               key={index}
//               className="admin-dash__stat"
//               onClick={stat.onClick}
//               style={{ 
//                 cursor: stat.onClick ? 'pointer' : 'default',
//                 padding: '12px 14px',
//                 minHeight: '80px'
//               }}
//             >
//               <div className="admin-dash__stat-top">
//                 <span className="admin-dash__stat-label" style={{ fontSize: '11px' }}>{stat.label}</span>
//                 <div className={`admin-dash__stat-icon admin-dash__stat-icon--${stat.color}`} style={{ width: '28px', height: '28px' }}>
//                   <stat.icon size={14} />
//                 </div>
//               </div>
//               <div className="admin-dash__stat-value" style={{ fontSize: '18px', fontWeight: '700' }}>{stat.value}</div>
//               <div className="admin-dash__stat-meta" style={{ fontSize: '9px' }}>{stat.meta}</div>
//             </div>
//           ))}
//         </div>

//         {/* Filters - Same design as SimpleUserBookings */}
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
//                 placeholder="Filter by date"
//               />
//               <select
//                 value={filters.status}
//                 onChange={(e) => setFilters({...filters, status: e.target.value})}
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
//                 <option value="spaces">Space Bookings ({spaceCount})</option>
//               </select>
//               <select
//                 value={filters.paymentStatus}
//                 onChange={(e) => setFilters({...filters, paymentStatus: e.target.value})}
//                 className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
//               >
//                 <option value="all">Payment Status</option>
//                 <option value="pending">Pending</option>
//                 <option value="paid">Paid</option>
//                 <option value="failed">Failed</option>
//                 <option value="refunded">Refunded</option>
//               </select>
//               <select
//                 value={filters.paymentMethod}
//                 onChange={(e) => setFilters({...filters, paymentMethod: e.target.value})}
//                 className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
//               >
//                 <option value="all">Payment Method</option>
//                 <option value="online">Online</option>
//                 <option value="cash">Cash</option>
//                 <option value="counter">Counter</option>
//                 <option value="upi">UPI</option>
//                 <option value="card">Card</option>
//               </select>
//               {(filters.status !== 'all' || filters.paymentStatus !== 'all' || filters.paymentMethod !== 'all' || filterDate || searchTerm) && (
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

//         {/* ✅ RENDER BASED ON ACTIVE TAB */}
//         {activeTab === 'all' && (
//           <>
//             {filteredBookings.filter(b => b.bookingType === 'visit').length > 0 && 
//               renderVisitTable(filteredBookings.filter(b => b.bookingType === 'visit'))}
//             {filteredBookings.filter(b => b.bookingType !== 'visit').length > 0 && 
//               renderRegularTable(filteredBookings.filter(b => b.bookingType !== 'visit'))}
//             {filteredBookings.length === 0 && (
//               <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-12 text-center">
//                 <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
//                 <p className="text-gray-500 font-medium">No bookings found</p>
//                 <p className="text-sm text-gray-400 mt-1">
//                   {bookings.length === 0 ? "You haven't made any bookings yet." : "Try adjusting your filters."}
//                 </p>
//               </div>
//             )}
//           </>
//         )}

//         {activeTab === 'visits' && (
//           renderVisitTable(displayBookings)
//         )}

//         {activeTab === 'spaces' && (
//           renderRegularTable(displayBookings)
//         )}

//         {/* Footer */}
//         <div className="mt-6 text-center text-[9px] text-gray-400 font-medium tracking-wider">
//           © IRYAX SPACE — All Rights Reserved
//         </div>
//       </div>

//       {/* ============================================================ */}
//       {/* VIEW MODAL - COMPLETE WITH ALL FIELDS FROM RESPONSE */}
//       {/* ============================================================ */}
//       {showViewModal && viewBooking && (
//         <div 
//           className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
//           onClick={(e) => {
//             if (e.target === e.currentTarget) {
//               setShowViewModal(false);
//             }
//           }}
//         >
//           <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
//             <div className="sticky top-0 bg-gradient-to-br from-indigo-600 to-purple-600 text-white p-6 rounded-t-3xl flex justify-between items-center">
//               <div>
//                 <h3 className="text-2xl font-bold">Booking Details</h3>
//                 <p className="text-sm text-indigo-200 flex items-center gap-2">
//                   <Hash size={14} /> #{viewBooking._id?.slice(-8).toUpperCase()}
//                 </p>
//                 <div className="flex items-center gap-2 mt-1">
//                   <span className="px-2 py-0.5 bg-white/20 rounded-full text-[10px] font-medium">
//                     {viewBooking.bookingType === 'visit' ? 'Site Visit' : 'Space Booking'}
//                   </span>
//                   <span className="px-2 py-0.5 bg-white/20 rounded-full text-[10px] font-medium capitalize">
//                     {viewBooking.bookingBasis || 'Hourly'}
//                   </span>
//                 </div>
//               </div>
//               <button onClick={() => setShowViewModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="p-6 space-y-4">
//               {/* ===== CABIN & SPACE TYPE ===== */}
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
//                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
//                     <Building2 size={12} /> Cabin Details
//                   </p>
//                   <p className="mt-1 font-semibold text-gray-800 text-sm">{viewBooking.cabin?.name || 'N/A'}</p>
//                   <p className="text-xs text-gray-500 flex items-center gap-0.5 mt-0.5">
//                     <MapPin size={10} /> {viewBooking.cabin?.address?.split(',')[0] || 'N/A'}
//                   </p>
//                   <div className="grid grid-cols-2 gap-1 mt-1 text-xs text-gray-500">
//                     <span>Capacity: {viewBooking.cabin?.capacity || 'N/A'}</span>
//                     <span>Type: {viewBooking.cabin?.cabinType || 'Normal'}</span>
//                     <span>Price: ₹{viewBooking.cabin?.price || 0}/hr</span>
//                     <span className={viewBooking.cabin?.isActive ? 'text-emerald-600' : 'text-red-500'}>
//                       {viewBooking.cabin?.isActive ? '✅ Active' : '❌ Inactive'}
//                     </span>
//                   </div>
//                 </div>
//                 <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
//                   <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1">
//                     <Layers size={12} /> Space Type
//                   </p>
//                   <div className="mt-2">
//                     <span className={`px-3 py-1.5 text-xs font-bold rounded-full inline-flex items-center gap-2 ${
//                       viewBooking.cabin?.isChamber 
//                         ? 'bg-emerald-100 text-emerald-700' 
//                         : 'bg-blue-100 text-blue-700'
//                     }`}>
//                       {viewBooking.cabin?.isChamber ? (
//                         <><Stethoscope size={14} /> Medical Chamber</>
//                       ) : (
//                         <><Briefcase size={14} /> Co-Working Space</>
//                       )}
//                     </span>
//                   </div>
//                   <div className="mt-2 text-xs text-gray-500">
//                     <p><span className="font-medium">Booking Type:</span> {viewBooking.bookingType || 'booking'}</p>
//                     <p><span className="font-medium">Basis:</span> {viewBooking.bookingBasis || 'hourly'}</p>
//                     {viewBooking.selectedPlan && (
//                       <p><span className="font-medium">Plan:</span> {viewBooking.selectedPlan.label || 'N/A'}</p>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* ===== CUSTOMER DETAILS ===== */}
//               <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
//                 <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1">
//                   <User size={12} /> Customer Details
//                 </p>
//                 <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
//                   <div>
//                     <p className="text-gray-500 text-xs">Name</p>
//                     <p className="font-semibold">{viewBooking.name || viewBooking.user?.name || 'N/A'}</p>
//                   </div>
//                   <div>
//                     <p className="text-gray-500 text-xs">Mobile</p>
//                     <p className="font-medium">{viewBooking.mobile || viewBooking.user?.mobile || 'N/A'}</p>
//                   </div>
//                   <div className="col-span-2">
//                     <p className="text-gray-500 text-xs">Email</p>
//                     <p className="font-medium break-all">{viewBooking.email || viewBooking.user?.email || 'N/A'}</p>
//                   </div>
//                   <div className="col-span-2">
//                     <p className="text-gray-500 text-xs">User ID</p>
//                     <p className="font-mono text-xs text-gray-500">{viewBooking.userId || 'N/A'}</p>
//                   </div>
//                 </div>
//               </div>

//               {/* ===== SCHEDULE ===== */}
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
//                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
//                     <CalendarDays size={12} /> Start
//                   </p>
//                   <p className="mt-1 font-semibold text-gray-800">{formatDateIndian(viewBooking.startDate)}</p>
//                   <p className="text-sm font-bold text-indigo-600">{formatTime12(viewBooking.startTime)}</p>
//                 </div>
//                 <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
//                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
//                     <CalendarDays size={12} /> End
//                   </p>
//                   <p className="mt-1 font-semibold text-gray-800">{formatDateIndian(viewBooking.endDate)}</p>
//                   <p className="text-sm font-bold text-indigo-600">{formatTime12(viewBooking.endTime)}</p>
//                 </div>
//               </div>

//               {/* ===== BOOKING INFO ===== */}
//               <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
//                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
//                   <Info size={12} /> Booking Info
//                 </p>
//                 <div className="mt-2 flex flex-wrap items-center gap-2">
//                   <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold">
//                     {viewBooking.totalHours || 0}h Total
//                   </span>
//                   <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
//                     {viewBooking.totalDays || 0} Days
//                   </span>
//                   <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
//                     Daily: {viewBooking.dailyHours?.join(', ') || 'N/A'}h
//                   </span>
//                   <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
//                     Remaining: {viewBooking.remainingHours || 0}h
//                   </span>
//                   <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
//                     Used: {viewBooking.hoursUsed || 0}h
//                   </span>
//                 </div>
//               </div>

//               {/* ===== MULTI-DAY SLOTS ===== */}
//               {viewBooking.bookingSlots && viewBooking.bookingSlots.length > 0 && (
//                 <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200">
//                   <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-2">
//                     <CalendarDays size={14} />
//                     Booking Slots ({viewBooking.bookingSlots.length} days)
//                   </p>
//                   <div className="grid grid-cols-2 gap-2 mt-2">
//                     {viewBooking.bookingSlots.map((slot, idx) => (
//                       <div key={idx} className="bg-white p-2 rounded-lg border border-indigo-100">
//                         <p className="text-xs font-bold text-gray-700">{formatDateIndian(slot.date)}</p>
//                         <p className="text-[10px] text-gray-500">{slot.startTime} - {slot.endTime}</p>
//                         <p className="text-[10px] font-bold text-indigo-600">{slot.hours}h</p>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* ===== SEATS ===== */}
//               {viewBooking.selectedSeats && viewBooking.selectedSeats.length > 0 && (
//                 <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
//                   <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-2">
//                     <Armchair size={14} />
//                     Selected Seats ({viewBooking.seatCount})
//                   </p>
//                   <div className="flex flex-wrap gap-2 mt-2">
//                     {viewBooking.selectedSeats.map((seat) => (
//                       <span key={seat._id} className="px-3 py-1.5 bg-white rounded-lg border border-indigo-200 text-sm font-medium text-gray-700">
//                         {seat.name} <span className="text-gray-400 text-xs">#{seat.number}</span>
//                       </span>
//                     ))}
//                   </div>
//                   <p className="mt-2 text-xs text-indigo-600 font-medium">
//                     Extra Charge: ₹{viewBooking.extraCharge || 0} ({viewBooking.seatCount} × ₹{viewBooking.seatExtraChargePerSeat || 100})
//                   </p>
//                 </div>
//               )}

//               {/* ===== PRICE BREAKDOWN ===== */}
//               <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
//                 <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-2 mb-3">
//                   <Calculator size={14} />
//                   Price Breakdown
//                 </p>

//                 <div className="space-y-2 text-sm">
//                   <div className="flex justify-between items-center border-b border-emerald-100 pb-1.5">
//                     <span className="text-gray-600">Subtotal ({viewBooking.totalHours}h × ₹{viewBooking.cabin?.price || 0})</span>
//                     <span className="font-semibold text-gray-800">₹{(viewBooking.subtotal || 0).toFixed(2)}</span>
//                   </div>

//                   {viewBooking.extraCharge > 0 && (
//                     <div className="flex justify-between items-center border-b border-emerald-100 pb-1.5">
//                       <span className="text-gray-600">Seat Charges ({viewBooking.seatCount} × ₹{viewBooking.seatExtraChargePerSeat || 100})</span>
//                       <span className="font-semibold text-amber-600">₹{(viewBooking.extraCharge || 0).toFixed(2)}</span>
//                     </div>
//                   )}

//                   <div className="flex justify-between items-center border-b border-emerald-100 pb-1.5">
//                     <span className="text-gray-600">GST ({(viewBooking.gstRate || 0.18) * 100}%)</span>
//                     <span className="font-semibold text-gray-800">₹{(viewBooking.gstAmount || 0).toFixed(2)}</span>
//                   </div>

//                   <div className="flex justify-between items-center pt-2 border-t-2 border-emerald-300">
//                     <span className="font-bold text-gray-800">Total Amount</span>
//                     <span className="text-xl font-bold text-emerald-700">₹{(viewBooking.totalPrice || 0).toFixed(2)}</span>
//                   </div>
//                 </div>
//               </div>

//               {/* ===== PAYMENT DETAILS ===== */}
//               {(viewBooking.transactionId || viewBooking.paymentDetails) && (
//                 <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
//                   <p className="text-[10px] font-bold text-blue-700 uppercase tracking-wider flex items-center gap-2 mb-2">
//                     <Wallet size={14} />
//                     Payment Details
//                   </p>
//                   <div className="grid grid-cols-2 gap-1 text-sm">
//                     <div>
//                       <p className="text-gray-500 text-xs">Transaction ID</p>
//                       <p className="font-mono font-medium text-xs break-all">{viewBooking.transactionId || 'N/A'}</p>
//                     </div>
//                     <div>
//                       <p className="text-gray-500 text-xs">Payment Mode</p>
//                       <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${getPaymentMethodBadge(viewBooking.paymentMethod).color}`}>
//                         {getPaymentMethodBadge(viewBooking.paymentMethod).label}
//                       </span>
//                     </div>
//                     <div>
//                       <p className="text-gray-500 text-xs">Payment Status</p>
//                       <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${getPaymentStatusBadge(viewBooking.paymentStatus).color}`}>
//                         {getPaymentStatusBadge(viewBooking.paymentStatus).label}
//                       </span>
//                     </div>
//                     <div>
//                       <p className="text-gray-500 text-xs">Paid to Owner</p>
//                       <p className="font-medium">{viewBooking.isPaidToOwner ? '✅ Yes' : '❌ No'}</p>
//                     </div>
//                     {viewBooking.paymentDetails?.upiId && (
//                       <div className="col-span-2">
//                         <p className="text-gray-500 text-xs">UPI ID</p>
//                         <p className="font-mono text-xs">{viewBooking.paymentDetails.upiId}</p>
//                       </div>
//                     )}
//                     {viewBooking.paymentDetails?.upiApp && (
//                       <div>
//                         <p className="text-gray-500 text-xs">UPI App</p>
//                         <p className="font-medium text-xs">{viewBooking.paymentDetails.upiApp}</p>
//                       </div>
//                     )}
//                     {viewBooking.paymentDetails?.cardNumber && (
//                       <div>
//                         <p className="text-gray-500 text-xs">Card Number</p>
//                         <p className="font-mono text-xs">•••• {viewBooking.paymentDetails.cardNumber.slice(-4)}</p>
//                       </div>
//                     )}
//                     {viewBooking.paymentDetails?.paymentDate && (
//                       <div>
//                         <p className="text-gray-500 text-xs">Payment Date</p>
//                         <p className="font-medium text-xs">{formatDate(viewBooking.paymentDetails.paymentDate)}</p>
//                       </div>
//                     )}
//                     {viewBooking.paymentDetails?.screenshot && (
//                       <div className="col-span-2 mt-1">
//                         <p className="text-gray-500 text-xs">Screenshot</p>
//                         <img 
//                           src={`${API_URL}${viewBooking.paymentDetails.screenshot}`} 
//                           alt="Payment Screenshot" 
//                           className="mt-1 max-h-32 rounded-lg border border-gray-200"
//                         />
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}

//               {/* ===== STATUS & PAYMENT ===== */}
//               <div className="grid grid-cols-3 gap-3">
//                 <div className="p-3 bg-gray-50 rounded-xl text-center border border-gray-200">
//                   <p className="text-[10px] text-gray-500 font-bold uppercase">Status</p>
//                   <span className={`px-3 py-1 text-xs font-bold rounded-full inline-block mt-1 ${getStatusBadge(viewBooking.status).color}`}>
//                     {getStatusBadge(viewBooking.status).label}
//                   </span>
//                 </div>
//                 <div className="p-3 bg-gray-50 rounded-xl text-center border border-gray-200">
//                   <p className="text-[10px] text-gray-500 font-bold uppercase">Payment</p>
//                   <span className={`px-3 py-1 text-xs font-bold rounded-full inline-block mt-1 ${getPaymentMethodBadge(viewBooking.paymentMethod).color}`}>
//                     {getPaymentMethodBadge(viewBooking.paymentMethod).label}
//                   </span>
//                 </div>
//                 <div className="p-3 bg-gray-50 rounded-xl text-center border border-gray-200">
//                   <p className="text-[10px] text-gray-500 font-bold uppercase">Pmt Status</p>
//                   <span className={`px-3 py-1 text-xs font-bold rounded-full inline-block mt-1 ${getPaymentStatusBadge(viewBooking.paymentStatus).color}`}>
//                     {getPaymentStatusBadge(viewBooking.paymentStatus).label}
//                   </span>
//                 </div>
//               </div>

//               {/* ===== VISITING TIMINGS ===== */}
//               {viewBooking.visitingTimings && viewBooking.visitingTimings.length > 0 && (
//                 <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
//                   <p className="text-[10px] font-medium text-blue-600 uppercase tracking-wider flex items-center gap-1">
//                     <History size={14} /> Visit Log ({viewBooking.visitingTimings.length} entries)
//                   </p>
//                   <div className="space-y-1.5 mt-2">
//                     {viewBooking.visitingTimings.map((timing, idx) => (
//                       <div key={idx} className="flex items-center justify-between text-sm bg-white rounded-lg p-2 border border-blue-100">
//                         <div className="flex items-center gap-3">
//                           <span className="text-xs font-bold text-blue-600">Day {idx + 1}</span>
//                           <span className="text-slate-600">{formatDateIndian(timing.date)}</span>
//                         </div>
//                         <div className="flex items-center gap-3">
//                           <span className="text-xs font-medium text-emerald-600">IN: {formatTime12(timing.checkIn)}</span>
//                           <span className="text-xs font-medium text-red-500">OUT: {formatTime12(timing.checkOut)}</span>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* ===== CHECK-IN/CHECK-OUT ===== */}
//               {(viewBooking.checkInTime || viewBooking.checkOutTime) && (
//                 <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
//                   <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
//                     <ClockIcon size={14} /> Check-in/Check-out
//                   </p>
//                   <div className="grid grid-cols-2 gap-2 mt-1 text-sm">
//                     <div>
//                       <p className="text-gray-500 text-xs">Check-in</p>
//                       <p className="font-medium">{viewBooking.checkInTime || 'Not checked in'}</p>
//                       {viewBooking.actualCheckIn && (
//                         <p className="text-xs text-gray-400">Actual: {viewBooking.actualCheckIn}</p>
//                       )}
//                     </div>
//                     <div>
//                       <p className="text-gray-500 text-xs">Check-out</p>
//                       <p className="font-medium">{viewBooking.checkOutTime || 'Not checked out'}</p>
//                       {viewBooking.actualCheckOut && (
//                         <p className="text-xs text-gray-400">Actual: {viewBooking.actualCheckOut}</p>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* ===== EXTRA INFO ===== */}
//               {(viewBooking.isReplaced || viewBooking.isExtended || viewBooking.cancellationReason) && (
//                 <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
//                   <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider flex items-center gap-2">
//                     <AlertCircle size={14} /> Additional Info
//                   </p>
//                   <div className="space-y-1 text-sm mt-1">
//                     {viewBooking.isReplaced && (
//                       <p><span className="text-gray-500">Replaced:</span> Yes</p>
//                     )}
//                     {viewBooking.isExtended && (
//                       <p><span className="text-gray-500">Extended:</span> Yes</p>
//                     )}
//                     {viewBooking.cancellationReason && (
//                       <p><span className="text-gray-500">Cancellation Reason:</span> {viewBooking.cancellationReason}</p>
//                     )}
//                     {viewBooking.refundAmount > 0 && (
//                       <p><span className="text-gray-500">Refund Amount:</span> ₹{viewBooking.refundAmount}</p>
//                     )}
//                   </div>
//                 </div>
//               )}

//               {/* ===== CREATED AT ===== */}
//               <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
//                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
//                   <CalendarPlus size={12} /> Booking Created
//                 </p>
//                 <p className="mt-1 font-semibold text-gray-800">{formatDateTime(viewBooking.createdAt)}</p>
//               </div>

//               {/* ===== ACTIONS ===== */}
//               <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-200">
//                 <button
//                   onClick={() => { setShowViewModal(false); downloadInvoice(viewBooking); }}
//                   className="flex-1 min-w-[120px] py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-sm"
//                 >
//                   <FileDown size={16} className="inline mr-2" />
//                   Download Invoice
//                 </button>
//                 <button
//                   onClick={() => setShowViewModal(false)}
//                   className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* REPLACE MODAL */}
//       {showReplaceModal && replaceBooking && (
//         <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowReplaceModal(false)}>
//           <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
//             <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-5 rounded-t-3xl flex justify-between items-center shrink-0">
//               <div>
//                 <h3 className="text-xl font-bold">Replace Space</h3>
//                 <p className="text-sm text-blue-200">{replaceBooking.cabin?.name} → New Space</p>
//               </div>
//               <button onClick={() => setShowReplaceModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
//                 <X size={20} />
//               </button>
//             </div>
//             <div className="p-5 space-y-4 overflow-y-auto flex-1">
//               <div className="bg-blue-50 rounded-xl p-4 text-sm">
//                 <p className="font-bold text-blue-800">Current Booking</p>
//                 <p className="text-slate-600 mt-1">{replaceBooking.cabin?.name}</p>
//                 <p className="text-xs text-slate-500">{formatDateIndian(replaceBooking.startDate)} {formatTime12(replaceBooking.startTime)} - {formatDateIndian(replaceBooking.endDate)} {formatTime12(replaceBooking.endTime)}</p>
//                 <p className="text-xs font-bold text-slate-700 mt-1">Total: ₹{replaceBooking.totalPrice}</p>
//                 {replaceBooking.totalDays > 0 && (
//                   <p className="text-xs text-slate-500">{replaceBooking.totalDays} days • {replaceBooking.totalHours}h total</p>
//                 )}
//               </div>

//               <div>
//                 <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Select New Cabin</label>
//                 <div className="relative">
//                   <select
//                     value={selectedCabin}
//                     onChange={(e) => setSelectedCabin(e.target.value)}
//                     className="w-full p-3 pr-10 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
//                   >
//                     <option value="">Select a cabin...</option>
//                     {allCabins
//                       .filter(c => c._id !== replaceBooking.cabin?._id)
//                       .map(c => (
//                         <option key={c._id} value={c._id}>
//                           {c.name} - ₹{c.price}/hr
//                         </option>
//                       ))}
//                   </select>
//                   <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
//                 </div>
//               </div>

//               {selectedCabinData && priceDiff && (
//                 <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-3">
//                   <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Price Comparison</p>

//                   <div className="grid grid-cols-2 gap-2 text-sm">
//                     <div className="bg-blue-50 rounded-lg p-3">
//                       <p className="text-[10px] text-blue-600 font-medium">Current Cabin</p>
//                       <p className="font-bold text-slate-800">₹{replaceBooking.cabin?.price}/hr</p>
//                       <p className="text-xs text-slate-500">{replaceBooking.totalHours}h = ₹{replaceBooking.totalPrice}</p>
//                     </div>
//                     <div className="bg-emerald-50 rounded-lg p-3">
//                       <p className="text-[10px] text-emerald-600 font-medium">New Cabin</p>
//                       <p className="font-bold text-slate-800">₹{selectedCabinData.price}/hr</p>
//                       <p className="text-xs text-slate-500">{replaceBooking.totalHours}h = ₹{priceDiff.newTotal}</p>
//                     </div>
//                   </div>

//                   <div className="border-t border-gray-200 pt-3">
//                     {priceDiff.finalDifference > 0 ? (
//                       <div className="flex items-center justify-between text-amber-600 bg-amber-50 rounded-lg p-3">
//                         <div className="flex items-center gap-2">
//                           <TrendingUp size={16} />
//                           <span className="text-sm font-medium">You need to pay extra</span>
//                         </div>
//                         <span className="font-bold text-lg">+₹{Math.round(priceDiff.finalDifference)}</span>
//                       </div>
//                     ) : priceDiff.finalDifference < 0 ? (
//                       <div className="flex items-center justify-between text-emerald-600 bg-emerald-50 rounded-lg p-3">
//                         <div className="flex items-center gap-2">
//                           <TrendingDown size={16} />
//                           <span className="text-sm font-medium">You will get refund</span>
//                         </div>
//                         <span className="font-bold text-lg">-₹{Math.round(Math.abs(priceDiff.finalDifference))}</span>
//                       </div>
//                     ) : (
//                       <div className="flex items-center justify-between text-slate-600 bg-slate-100 rounded-lg p-3">
//                         <span className="text-sm font-medium">No price difference</span>
//                         <span className="font-bold text-lg">₹0</span>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}

//               <div className="bg-amber-50 rounded-xl p-3 text-xs text-amber-700 flex items-start gap-2">
//                 <AlertCircle size={16} className="shrink-0 mt-0.5" />
//                 <span>Replacement is subject to availability. Price difference (if any) will be adjusted.</span>
//               </div>
//             </div>

//             <div className="p-4 border-t border-gray-200 shrink-0">
//               <button
//                 onClick={handleReplaceBooking}
//                 disabled={replaceLoading || !selectedCabin}
//                 className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
//               >
//                 {replaceLoading ? 'Replacing...' : <><RefreshCw size={16} /> Replace Booking</>}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* CANCEL MODAL */}
//       {showCancelModal && cancelBooking && (
//         <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowCancelModal(false)}>
//           <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
//             <div className="bg-gradient-to-br from-red-600 to-red-700 text-white p-5 rounded-t-3xl flex justify-between items-center">
//               <div>
//                 <h3 className="text-xl font-bold">Cancel Booking</h3>
//                 <p className="text-sm text-red-200">{cancelBooking.cabin?.name}</p>
//               </div>
//               <button onClick={() => setShowCancelModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
//                 <X size={20} />
//               </button>
//             </div>
//             <div className="p-5 space-y-4">
//               <div className="bg-red-50 rounded-xl p-4 text-sm">
//                 <p className="font-bold text-red-800">Are you sure you want to cancel this booking?</p>
//                 <div className="mt-2 space-y-1 text-slate-600">
//                   <p><span className="text-slate-500">Cabin:</span> {cancelBooking.cabin?.name}</p>
//                   <p><span className="text-slate-500">Start:</span> {formatDateIndian(cancelBooking.startDate)} {formatTime12(cancelBooking.startTime)}</p>
//                   <p><span className="text-slate-500">End:</span> {formatDateIndian(cancelBooking.endDate)} {formatTime12(cancelBooking.endTime)}</p>
//                   <p><span className="text-slate-500">Total:</span> ₹{cancelBooking.totalPrice}</p>
//                   {cancelBooking.totalDays > 0 && (
//                     <p><span className="text-slate-500">Days:</span> {cancelBooking.totalDays} days ({cancelBooking.totalHours}h)</p>
//                   )}
//                 </div>
//               </div>

//               <div className="bg-amber-50 rounded-xl p-3 text-xs text-amber-700 flex items-start gap-2">
//                 <AlertCircle size={16} className="shrink-0 mt-0.5" />
//                 <div>
//                   <p className="font-bold">Cancellation Policy:</p>
//                   <ul className="list-disc pl-4 mt-1 space-y-0.5">
//                     <li>Free cancellation within <span className="font-bold">24 hours</span> of booking</li>
//                     <li>50% refund for cancellations after 24 hours</li>
//                     <li>No refund for no-shows</li>
//                   </ul>
//                 </div>
//               </div>

//               <div className="flex gap-3">
//                 <button
//                   onClick={handleCancelBooking}
//                   disabled={cancelLoading}
//                   className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
//                 >
//                   {cancelLoading ? 'Cancelling...' : <><XIcon size={16} /> Cancel Booking</>}
//                 </button>
//                 <button
//                   onClick={() => setShowCancelModal(false)}
//                   className="px-5 py-3 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyBookings;











// MyBookings.jsx - Complete with ALL Fields - ONLY CO-WORKING BOOKINGS (UI like BookingDoctor)
import axios from "axios";
import {
  Calendar,
  Clock,
  IndianRupee,
  MapPin,
  Search,
  User,
  X,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Eye,
  FileDown,
  CreditCard,
  Store,
  Receipt,
  Building2,
  Edit,
  RefreshCw,
  X as XIcon,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Filter,
  XCircle as XCircleIcon,
  Users,
  Armchair,
  Plus,
  Calendar as CalendarIcon,
  Stethoscope,
  Briefcase,
  Clock as ClockIcon,
  Layers,
  Hash,
  MessageSquare,
  Star,
  Check,
  AlertTriangle,
  Wallet,
  CalendarDays,
  Info,
  Timer,
  History,
  Bell,
  CalendarPlus,
  Calculator,
  Ticket,
  Crown,
  Layout
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import UsersNavbar from "./UsersNavbar";
import SimpleUserNavbar from "./SimpleUserNavbar";
import AdminNavbar from "./AdminNavbar";
import * as XLSX from 'xlsx';
import "./Dashboard.css";
import "./UserSiteVisits.css";

const API_URL = "https://spaceapi.iryax.com";

// ─── HELPER: Format date to dd/mm/yyyy ───
const formatDateToDDMMYYYY = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "N/A";
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// ─── HELPER: Format datetime to dd/mm/yyyy with time ───
const formatDateTimeToDDMMYYYY = (dateStr) => {
  if (!dateStr) return "N/A";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "N/A";
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

// ─── FORMAT TIME ───
const formatTime12 = (timeStr) => {
  if (!timeStr) return "N/A";
  try {
    const [hours, minutes] = timeStr.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) return timeStr;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    return `${hours12}:${String(minutes).padStart(2, '0')} ${ampm}`;
  } catch {
    return timeStr;
  }
};

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [allChambers, setAllChambers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filters, setFilters] = useState({
    status: 'all',
    paymentStatus: 'all'
  });
  const [activeTab, setActiveTab] = useState('spaces');
  const navigate = useNavigate();

  const [showViewModal, setShowViewModal] = useState(false);
  const [viewBooking, setViewBooking] = useState(null);

  const [showReplaceModal, setShowReplaceModal] = useState(false);
  const [replaceBooking, setReplaceBooking] = useState(null);
  const [selectedChamber, setSelectedChamber] = useState("");
  const [replaceLoading, setReplaceLoading] = useState(false);
  const [selectedChamberData, setSelectedChamberData] = useState(null);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelBooking, setCancelBooking] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  // ✅ Determine user role for navbar
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const admin = JSON.parse(localStorage.getItem("admin") || "null");
  
  // ✅ Check if user is admin or regular user
  const isAdmin = admin !== null || user?.role === "admin";
  const isRegularUser = user?.role === "user" && !isAdmin;

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const formatDateTime = (dateStr) => {
    return formatDateTimeToDDMMYYYY(dateStr);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateIndian = (dateStr) => {
    return formatDateToDDMMYYYY(dateStr);
  };

  const convertToIndianTime = (timeStr) => {
    if (!timeStr) return "N/A";
    if (timeStr.includes('AM') || timeStr.includes('PM')) return timeStr;
    try {
      const parts = timeStr.split(':');
      if (parts.length >= 2) {
        let hours = parseInt(parts[0]);
        const minutes = parts[1];
        if (isNaN(hours)) return timeStr;
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const hour12 = hours % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
      }
      return timeStr;
    } catch (e) {
      return timeStr;
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
      confirmed: { label: 'Confirmed', color: 'bg-emerald-100 text-emerald-700' },
      active: { label: 'Active', color: 'bg-indigo-100 text-indigo-700' },
      completed: { label: 'Completed', color: 'bg-blue-100 text-blue-700' },
      cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700' }
    };
    return map[status?.toLowerCase()] || { label: status || 'Unknown', color: 'bg-gray-100 text-gray-700' };
  };

  const getPaymentMethodBadge = (method) => {
    if (method === 'cash' || method === 'counter') {
      return { label: 'Cash', color: 'bg-orange-100 text-orange-700' };
    }
    if (method === 'upi') {
      return { label: 'UPI', color: 'bg-purple-100 text-purple-700' };
    }
    if (method === 'card') {
      return { label: 'Card', color: 'bg-blue-100 text-blue-700' };
    }
    return { label: 'Online', color: 'bg-blue-100 text-blue-700' };
  };

  const getPaymentStatusBadge = (status) => {
    if (status === 'paid') return { label: 'Paid', color: 'bg-emerald-100 text-emerald-700' };
    if (status === 'failed') return { label: 'Failed', color: 'bg-red-100 text-red-700' };
    if (status === 'refunded') return { label: 'Refunded', color: 'bg-purple-100 text-purple-700' };
    return { label: 'Pending', color: 'bg-yellow-100 text-yellow-700' };
  };

  const getTermsBadge = (accepted) => {
    if (accepted) return { label: '✓ Accepted', color: 'bg-emerald-100 text-emerald-700' };
    return { label: '✗ Not Accepted', color: 'bg-red-100 text-red-700' };
  };

  const getSlotsDisplay = (slots) => {
    if (!slots || slots.length === 0) return 'N/A';
    return slots.map(s => `${formatDateIndian(s.date)} ${s.startTime}-${s.endTime} (${s.hours}h)`).join(' | ');
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to view your bookings");
        navigate("/login");
        return;
      }

      const res = await axios.get(
        `${API_URL}/api/bookings/user`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const bookingsData = res.data.bookings || [];
      // Filter ONLY CO-WORKING bookings (isChamber === false or undefined)
      const coWorkingBookings = bookingsData.filter(b => b.cabin?.isChamber !== true);
      setBookings(coWorkingBookings);

      if (coWorkingBookings.length === 0) {
        toast.info("You have no bookings yet");
      }

    } catch (error) {
      console.error("Error fetching bookings:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("admin");
        navigate("/login");
      } else {
        toast.error("Failed to fetch bookings: " + (error.response?.data?.error || error.message));
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchChambers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await axios.get(`${API_URL}/api/cabins`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const activeChambers = res.data.filter(c => c.isActive === true);
      setAllChambers(activeChambers);
    } catch (error) {
      console.error("Failed to fetch chambers:", error);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchChambers();
  }, []);

  useEffect(() => {
    if (selectedChamber && replaceBooking) {
      const chamber = allChambers.find(c => c._id === selectedChamber);
      setSelectedChamberData(chamber || null);
    } else {
      setSelectedChamberData(null);
    }
  }, [selectedChamber, allChambers, replaceBooking]);

  const exportToExcel = () => {
    try {
      if (displayBookings.length === 0) {
        toast.warning("No bookings to export");
        return;
      }
      const data = displayBookings.map((b, i) => ({
        'S.No': i + 1,
        'Booking ID': b._id?.slice(-8).toUpperCase() || 'N/A',
        'Type': b.bookingType || 'booking',
        'Space': b.cabin?.name || b.chamberName || 'Unknown',
        'User': b.name || b.patientName || 'N/A',
        'Mobile': b.mobile || b.patientMobile || 'N/A',
        'Email': b.email || b.patientEmail || 'N/A',
        'From Date': formatDateIndian(b.startDate || b.date),
        'To Date': formatDateIndian(b.endDate),
        'From Time': convertToIndianTime(b.startTime || b.time),
        'To Time': convertToIndianTime(b.endTime),
        'Total Hours': b.totalHours || 0,
        'Total Days': b.totalDays || 0,
        'Daily Hours': b.dailyHours?.join(', ') || 'N/A',
        'Slots': getSlotsDisplay(b.bookingSlots),
        'Seats': b.seatCount || 0,
        'Seat Names': b.selectedSeats?.map(s => s.name).join(', ') || 'N/A',
        'Extra Charge': b.extraCharge || 0,
        'Subtotal': b.subtotal || 0,
        'GST': b.gstAmount || 0,
        'GST Rate': `${(b.gstRate || 0.18) * 100}%`,
        'Total (₹)': b.totalPrice || b.amount || 0,
        'Status': getStatusBadge(b.status).label,
        'Payment': getPaymentMethodBadge(b.paymentMethod).label,
        'Pmt Status': getPaymentStatusBadge(b.paymentStatus).label,
        'Terms': b.termsAccepted ? 'Yes' : 'No',
        'Transaction ID': b.transactionId || 'N/A',
        'Booked On': b.createdAt ? formatDateTimeToDDMMYYYY(b.createdAt) : 'N/A'
      }));
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'CoWorking_Bookings');
      XLSX.writeFile(wb, `coworking_bookings_${new Date().toISOString().split('T')[0]}.xlsx`);
      toast.success(`Exported ${displayBookings.length} bookings!`);
    } catch (error) {
      console.error(error);
      toast.error("Export failed");
    }
  };

  const handleViewBooking = (booking) => {
    setViewBooking(booking);
    setShowViewModal(true);
  };

  const handleReplaceBooking = async () => {
    if (!selectedChamber) {
      toast.error("Please select a space to replace");
      return;
    }

    setReplaceLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_URL}/api/bookings/replace-booking/${replaceBooking._id}`,
        { newCabinId: selectedChamber },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Booking replaced successfully!");
        setShowReplaceModal(false);
        setReplaceBooking(null);
        setSelectedChamber("");
        setSelectedChamberData(null);
        fetchBookings();
      } else {
        toast.error(response.data.error || "Failed to replace booking");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to replace booking");
    } finally {
      setReplaceLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    setCancelLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_URL}/api/bookings/cancel-booking/${cancelBooking._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success(response.data.message || "Booking cancelled successfully!");
        setShowCancelModal(false);
        setCancelBooking(null);
        fetchBookings();
      } else {
        toast.error(response.data.error || "Failed to cancel booking");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to cancel booking");
    } finally {
      setCancelLoading(false);
    }
  };

  // ✅ PROFESSIONAL BLACK & GRAY INVOICE - MATCHES BookingDoctor EXACTLY
  const downloadInvoice = (booking) => {
    try {
      const cabin = booking.cabin || {};
      const owner = cabin.owner || {};

      const win = window.open('', '_blank', 'width=900,height=700');
      if (!win) {
        toast.error('Please allow popups');
        return;
      }

      let seatListHtml = '';
      if (booking.selectedSeats && booking.selectedSeats.length > 0) {
        seatListHtml = booking.selectedSeats.map(s => 
          `<span style="display:inline-block;background:#f5f5f5;padding:4px 12px;border-radius:2px;margin:3px;font-size:11px;border:1px solid #e0e0e0;color:#333;">${s.name} (#${s.number})</span>`
        ).join('');
      }

      let slotsHtml = '';
      if (booking.bookingSlots && booking.bookingSlots.length > 0) {
        slotsHtml = booking.bookingSlots.map(s => 
          `<span style="display:inline-block;background:#f5f5f5;padding:2px 10px;border-radius:2px;margin:2px;font-size:10px;border:1px solid #e0e0e0;color:#333;">${formatDateIndian(s.date)} ${s.startTime}-${s.endTime} (${s.hours}h)</span>`
        ).join('');
      }

      const status = getStatusBadge(booking.status);
      const pmtMethod = getPaymentMethodBadge(booking.paymentMethod);
      const pmtStatus = getPaymentStatusBadge(booking.paymentStatus);

      const ownerName = owner.name || owner.organizationName || 'IRYAX SPACE';
      const ownerAddress = owner.address || 'Premium Workspaces';

      win.document.write(`
        <html><head><title>Invoice</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Arial, sans-serif; 
            padding: 40px; 
            max-width: 900px; 
            margin: auto; 
            background: #f5f5f5; 
          }
          .invoice-wrapper { 
            background: #ffffff; 
            padding: 40px; 
            box-shadow: 0 2px 20px rgba(0,0,0,0.08); 
          }
          .header { 
            display: flex; 
            justify-content: space-between; 
            align-items: flex-start; 
            padding-bottom: 25px; 
            border-bottom: 2px solid #333333; 
            margin-bottom: 30px; 
          }
          .header-left h1 { 
            color: #000000; 
            font-size: 24px; 
            font-weight: 700; 
            margin: 0; 
            letter-spacing: -0.5px;
          }
          .header-left .subtitle { 
            color: #666666; 
            font-size: 12px; 
            margin-top: 4px; 
            letter-spacing: 0.5px;
          }
          .header-right { 
            text-align: right; 
          }
          .header-right .invoice-date { 
            font-size: 12px; 
            color: #666666; 
            margin-top: 2px;
          }
          .badge { 
            display: inline-block; 
            padding: 2px 10px; 
            border-radius: 2px; 
            font-size: 10px; 
            font-weight: 600; 
            text-transform: uppercase;
            letter-spacing: 0.3px;
          }
          .badge-pending { background: #f5f5f5; color: #666666; }
          .badge-confirmed { background: #e8f5e9; color: #2e7d32; }
          .badge-active { background: #e3f2fd; color: #1565c0; }
          .badge-completed { background: #e8f5e9; color: #2e7d32; }
          .badge-cancelled { background: #fce4ec; color: #c62828; }
          .info-grid { 
            display: grid; 
            grid-template-columns: 1fr 1fr; 
            gap: 20px; 
            background: #fafafa; 
            padding: 20px; 
            margin-bottom: 25px; 
            border: 1px solid #eeeeee;
          }
          .info-item .label { 
            font-size: 9px; 
            font-weight: 700; 
            color: #999999; 
            text-transform: uppercase; 
            letter-spacing: 0.5px; 
          }
          .info-item .value { 
            font-size: 14px; 
            font-weight: 600; 
            color: #000000; 
            margin-top: 3px; 
          }
          .info-item .sub-value {
            font-size: 12px;
            color: #666666;
            margin-top: 1px;
          }
          .section { 
            margin-bottom: 25px; 
          }
          .section-title { 
            font-size: 10px; 
            font-weight: 700; 
            color: #999999; 
            text-transform: uppercase; 
            letter-spacing: 0.5px; 
            margin-bottom: 10px; 
            border-bottom: 1px solid #eeeeee;
            padding-bottom: 6px;
          }
          .slots-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
            gap: 6px;
            margin-top: 8px;
          }
          .slots-grid .slot-item {
            background: #fafafa;
            padding: 6px 10px;
            border: 1px solid #eeeeee;
            font-size: 11px;
            color: #333333;
          }
          .slots-grid .slot-item .slot-date {
            font-weight: 600;
            color: #000000;
          }
          .seat-section { 
            background: #fafafa; 
            padding: 15px; 
            margin-bottom: 20px; 
            border: 1px solid #eeeeee; 
          }
          .seat-section .seat-title {
            font-size: 10px;
            font-weight: 700;
            color: #999999;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .seat-section .seat-list {
            margin-top: 8px;
          }
          .breakdown-table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 15px 0; 
          }
          .breakdown-table th { 
            text-align: left; 
            padding: 8px 0; 
            font-size: 9px; 
            font-weight: 700; 
            color: #999999; 
            text-transform: uppercase; 
            letter-spacing: 0.5px;
            border-bottom: 1px solid #eeeeee; 
          }
          .breakdown-table td { 
            padding: 8px 0; 
            border-bottom: 1px solid #f5f5f5; 
            font-size: 13px; 
            color: #333333; 
          }
          .breakdown-table .amount { 
            font-weight: 600; 
            text-align: right; 
          }
          .breakdown-table .total-row td { 
            font-weight: 700; 
            font-size: 16px; 
            border-top: 2px solid #333333; 
            padding-top: 12px; 
          }
          .breakdown-table .total-row .amount { 
            font-size: 18px; 
            color: #000000; 
          }
          .payment-details { 
            background: #fafafa; 
            padding: 15px; 
            margin: 15px 0; 
            border: 1px solid #eeeeee; 
          }
          .payment-details .detail-row { 
            display: flex; 
            justify-content: space-between; 
            padding: 3px 0; 
            font-size: 12px; 
            color: #333333; 
          }
          .payment-details .detail-row .label-text {
            color: #999999;
          }
          .status-section { 
            display: flex; 
            gap: 20px; 
            flex-wrap: wrap; 
            margin: 20px 0; 
            padding: 15px; 
            background: #fafafa; 
            border: 1px solid #eeeeee; 
          }
          .status-item { 
            display: flex; 
            align-items: center; 
            gap: 6px; 
            font-size: 12px; 
          }
          .status-item .label-text { 
            color: #999999; 
            font-weight: 500; 
          }
          .footer { 
            text-align: center; 
            margin-top: 30px; 
            padding-top: 20px; 
            border-top: 1px solid #eeeeee; 
            color: #999999; 
            font-size: 10px; 
            letter-spacing: 0.3px;
          }
          .footer .brand { 
            font-weight: 700; 
            color: #000000; 
          }
          .footer .powered {
            font-weight: 700;
            color: #000000;
            letter-spacing: 1px;
            font-size: 11px;
          }
          @media print { 
            body { background: #ffffff; padding: 20px; } 
            .invoice-wrapper { box-shadow: none; padding: 20px; } 
          }
        </style>
        </head><body>
        <div class="invoice-wrapper">
          <!-- HEADER -->
          <div class="header">
            <div class="header-left">
              <h1>${ownerName}</h1>
              <div class="subtitle">${ownerAddress}</div>
              <div style="margin-top:6px;">
                <span style="font-size:11px;font-weight:600;color:#555555;background:#f0f0f0;padding:2px 12px;border-radius:2px;">CO-WORKING SPACE</span>
              </div>
            </div>
            <div class="header-right">
              <div class="invoice-date">${formatDateToDDMMYYYY(new Date().toISOString())}</div>
            </div>
          </div>

          <!-- BILL TO & CABIN -->
          <div class="info-grid">
            <div class="info-item">
              <div class="label">Bill To</div>
              <div class="value">${booking.name || booking.patientName || 'Customer'}</div>
              <div class="sub-value">${booking.mobile || booking.patientMobile || 'N/A'}</div>
              <div class="sub-value">${booking.email || booking.patientEmail || 'N/A'}</div>
            </div>
            <div class="info-item">
              <div class="label">Space Details</div>
              <div class="value">${cabin.name || booking.chamberName || 'Unknown'}</div>
              <div class="sub-value">${cabin.address || 'N/A'}</div>
              <div class="sub-value">Capacity: ${cabin.capacity || 'N/A'} seats | Type: ${cabin.cabinType || 'Normal'}</div>
            </div>
          </div>

          <!-- SCHEDULE -->
          <div class="info-grid">
            <div class="info-item">
              <div class="label">Start</div>
              <div class="value">${formatDateToDDMMYYYY(booking.startDate || booking.date)}</div>
              <div class="sub-value" style="color:#000000;font-weight:600;">${formatTime12(booking.startTime || booking.time)}</div>
            </div>
            <div class="info-item">
              <div class="label">End</div>
              <div class="value">${formatDateToDDMMYYYY(booking.endDate || booking.startDate)}</div>
              <div class="sub-value" style="color:#000000;font-weight:600;">${formatTime12(booking.endTime)}</div>
            </div>
          </div>

          <!-- BOOKING INFO -->
          <div style="display:flex;gap:16px;flex-wrap:wrap;margin-bottom:20px;padding:12px 16px;background:#fafafa;border:1px solid #eeeeee;">
            <div><span style="color:#999999;font-size:10px;text-transform:uppercase;letter-spacing:0.3px;">Total Hours</span><br><strong>${booking.totalHours || 0}h</strong></div>
            <div><span style="color:#999999;font-size:10px;text-transform:uppercase;letter-spacing:0.3px;">Total Days</span><br><strong>${booking.totalDays || 0} days</strong></div>
            <div><span style="color:#999999;font-size:10px;text-transform:uppercase;letter-spacing:0.3px;">Daily Hours</span><br><strong>${booking.dailyHours?.join(', ') || 'N/A'}</strong></div>
            <div><span style="color:#999999;font-size:10px;text-transform:uppercase;letter-spacing:0.3px;">Booking Type</span><br><strong>${booking.bookingBasis || 'Hourly'}</strong></div>
            ${booking.selectedPlan ? `<div><span style="color:#999999;font-size:10px;text-transform:uppercase;letter-spacing:0.3px;">Plan</span><br><strong>${booking.selectedPlan.label || 'N/A'}</strong></div>` : ''}
          </div>

          <!-- SLOTS -->
          ${booking.bookingSlots && booking.bookingSlots.length > 0 ? `
            <div class="section">
              <div class="section-title">Booking Slots (${booking.bookingSlots.length} days)</div>
              <div class="slots-grid">
                ${booking.bookingSlots.map(s => `
                  <div class="slot-item">
                    <div class="slot-date">${formatDateIndian(s.date)}</div>
                    <div>${s.startTime} - ${s.endTime}</div>
                    <div style="font-size:10px;color:#999999;">${s.hours}h</div>
                  </div>
                `).join('')}
              </div>
              <div style="margin-top:8px;font-size:11px;color:#666666;">Daily Hours: ${booking.dailyHours?.join(', ') || 'N/A'}h</div>
            </div>
          ` : ''}

          <!-- SEATS -->
          ${booking.selectedSeats && booking.selectedSeats.length > 0 ? `
            <div class="seat-section">
              <div class="seat-title">Selected Seats (${booking.seatCount})</div>
              <div class="seat-list">${seatListHtml}</div>
              <div style="margin-top:6px;font-size:11px;color:#666666;">Extra Charge: ₹${booking.extraCharge || 0}</div>
            </div>
          ` : ''}

          <!-- PRICE BREAKDOWN -->
          <div class="section">
            <div class="section-title">Price Breakdown</div>
            <table class="breakdown-table">
              <thead>
                <tr><th>Description</th><th style="text-align:right;">Amount</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td>Subtotal (${booking.totalHours || 0}h × ₹${cabin.price || 0})</td>
                  <td class="amount">₹${(booking.subtotal || 0).toFixed(2)}</td>
                </tr>
                ${booking.extraCharge > 0 ? `
                  <tr>
                    <td>Seat Charges (${booking.seatCount} seats × ₹${booking.seatExtraChargePerSeat || 100})</td>
                    <td class="amount">₹${(booking.extraCharge || 0).toFixed(2)}</td>
                  </tr>
                ` : ''}
                <tr>
                  <td>GST (${(booking.gstRate || 0.18) * 100}%)</td>
                  <td class="amount">₹${(booking.gstAmount || 0).toFixed(2)}</td>
                </tr>
                <tr class="total-row">
                  <td>Total Amount</td>
                  <td class="amount">₹${(booking.totalPrice || booking.amount || 0).toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- PAYMENT DETAILS -->
          ${booking.transactionId || booking.paymentDetails?.transactionId ? `
            <div class="payment-details">
              <div style="font-size:9px;font-weight:700;color:#999999;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;">Payment Details</div>
              <div class="detail-row"><span class="label-text">Transaction ID</span> <strong>${booking.transactionId || booking.paymentDetails?.transactionId || 'N/A'}</strong></div>
              ${booking.paymentDetails?.upiId ? `<div class="detail-row"><span class="label-text">UPI ID</span> <strong>${booking.paymentDetails.upiId}</strong></div>` : ''}
              ${booking.paymentDetails?.upiApp ? `<div class="detail-row"><span class="label-text">UPI App</span> <strong>${booking.paymentDetails.upiApp}</strong></div>` : ''}
              ${booking.paymentDetails?.cardNumber ? `<div class="detail-row"><span class="label-text">Card</span> <strong>•••• ${booking.paymentDetails.cardNumber.slice(-4)}</strong></div>` : ''}
              <div class="detail-row"><span class="label-text">Payment Mode</span> <strong>${pmtMethod.label}</strong></div>
            </div>
          ` : ''}

          <!-- STATUS -->
          <div class="status-section">
            <div class="status-item"><span class="label-text">Status</span> <span class="badge badge-${booking.status}">${status.label}</span></div>
            <div class="status-item"><span class="label-text">Payment</span> <span class="badge badge-${booking.paymentStatus === 'paid' ? 'confirmed' : 'pending'}">${pmtStatus.label}</span></div>
            <div class="status-item"><span class="label-text">Payment Method</span> <span style="font-weight:600;color:#333333;font-size:12px;">${pmtMethod.label}</span></div>
            ${booking.isPaidToOwner ? `<div class="status-item"><span class="label-text">Paid to Owner</span> <span style="font-weight:600;color:#2e7d32;font-size:12px;">Yes</span></div>` : ''}
          </div>

          <!-- VISIT LOG -->
          ${booking.visitingTimings && booking.visitingTimings.length > 0 ? `
            <div style="background:#fafafa;padding:12px 16px;margin:10px 0;border:1px solid #eeeeee;">
              <div style="font-size:9px;font-weight:700;color:#999999;text-transform:uppercase;letter-spacing:0.5px;">Visit Log (${booking.visitingTimings.length} entries)</div>
              ${booking.visitingTimings.map((t, i) => `
                <div style="display:flex;justify-content:space-between;font-size:12px;padding:4px 0;border-bottom:1px solid #f0f0f0;color:#333333;">
                  <span>Day ${i+1}: ${formatDateIndian(t.date)}</span>
                  <span>${formatTime12(t.checkIn)} - ${formatTime12(t.checkOut)}</span>
                </div>
              `).join('')}
            </div>
          ` : ''}

          <!-- FOOTER -->
          <div class="footer">
            <span class="brand">${ownerName}</span> — ${ownerAddress}<br>
            Created: ${formatDateTimeToDDMMYYYY(booking.createdAt)}<br>
            <div style="margin-top:6px;padding-top:6px;border-top:1px solid #eeeeee;">
              <span class="powered">POWERED BY IRYAX SPACE</span>
            </div>
          </div>
        </div>
        </body></html>
      `);
      win.document.close();
      win.focus();
      toast.success('Invoice generated! Click Print to save as PDF.');
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate invoice');
    }
  };

  // ─── FILTER: ONLY CO-WORKING (isChamber !== true) ───
  const coWorkingBookings = bookings.filter(b => b.cabin?.isChamber !== true);
  const filteredBookings = coWorkingBookings.filter((b) => {
    const search = searchTerm.toLowerCase();
    const matchSearch = b.cabin?.name?.toLowerCase().includes(search) ||
                        b.cabin?.address?.toLowerCase().includes(search) ||
                        b.name?.toLowerCase().includes(search) ||
                        b.mobile?.includes(searchTerm) ||
                        b.patientName?.toLowerCase().includes(search) ||
                        b.patientMobile?.includes(searchTerm) ||
                        b.chamberName?.toLowerCase().includes(search);
    const matchDate = filterDate ? b.startDate === filterDate : true;
    const matchStatus = filters.status === 'all' || b.status === filters.status;
    const matchPaymentStatus = filters.paymentStatus === 'all' || b.paymentStatus === filters.paymentStatus;
    
    return matchSearch && matchDate && matchStatus && matchPaymentStatus;
  });

  // Separate filtered lists for tabs
  const filteredVisitBookings = filteredBookings.filter(b => b.bookingType === 'visit');
  const filteredSpaceBookings = filteredBookings.filter(b => b.bookingType !== 'visit');

  const getFilteredByTab = () => {
    if (activeTab === 'visits') {
      return filteredVisitBookings;
    } else if (activeTab === 'spaces') {
      return filteredSpaceBookings;
    }
    return filteredBookings;
  };

  const displayBookings = getFilteredByTab();

  const totalCount = bookings.length;
  const activeCount = bookings.filter(b => (b.status === 'active' || b.status === 'confirmed') && b.cabin?.isChamber !== true).length;
  const pendingCount = bookings.filter(b => b.status === 'pending' && b.cabin?.isChamber !== true).length;
  const completedCount = bookings.filter(b => b.status === 'completed' && b.cabin?.isChamber !== true).length;
  const cancelledCount = bookings.filter(b => b.status === 'cancelled' && b.cabin?.isChamber !== true).length;
  const visitCount = bookings.filter(b => b.bookingType === 'visit' && b.cabin?.isChamber !== true).length;
  const spaceCount = bookings.filter(b => b.bookingType !== 'visit' && b.cabin?.isChamber !== true).length;

  const coWorkingTotalCount = bookings.filter(b => b.cabin?.isChamber !== true).length;

  const getPriceDifference = () => {
    if (!replaceBooking || !selectedChamberData) return null;

    const currentPrice = replaceBooking.totalPrice || 0;
    const newPrice = selectedChamberData.price || 0;
    const totalHours = replaceBooking.totalHours || 1;
    const newTotal = newPrice * totalHours;
    const difference = newTotal - currentPrice;
    const gstDifference = difference * 0.18;
    const totalWithGst = newTotal + (newTotal * 0.18);
    const currentWithGst = currentPrice + (currentPrice * 0.18);
    const finalDifference = totalWithGst - currentWithGst;

    return {
      currentPrice,
      newPrice,
      totalHours,
      newTotal,
      difference,
      gstDifference,
      totalWithGst,
      currentWithGst,
      finalDifference
    };
  };

  const priceDiff = getPriceDifference();

  const clearFilters = () => {
    setFilters({
      status: 'all',
      paymentStatus: 'all'
    });
    setSearchTerm('');
    setFilterDate('');
  };

  // Stats for cards
  const statsCount = {
    total: coWorkingTotalCount,
    pending: bookings.filter(b => b.status === 'pending' && b.cabin?.isChamber !== true).length,
    active: bookings.filter(b => (b.status === 'active' || b.status === 'confirmed') && b.cabin?.isChamber !== true).length,
    completed: bookings.filter(b => b.status === 'completed' && b.cabin?.isChamber !== true).length,
    cancelled: bookings.filter(b => b.status === 'cancelled' && b.cabin?.isChamber !== true).length
  };

  const bookingStatsCards = [
    {
      label: "Total",
      value: statsCount.total,
      meta: "total bookings",
      icon: Ticket,
      color: "indigo",
      onClick: () => setFilters({ status: 'all', paymentStatus: 'all' })
    },
    {
      label: "Pending",
      value: statsCount.pending,
      meta: "awaiting confirmation",
      icon: Clock,
      color: "amber",
      onClick: () => setFilters(prev => ({ ...prev, status: 'pending' }))
    },
    {
      label: "Active",
      value: statsCount.active,
      meta: "active & confirmed",
      icon: Building2,
      color: "emerald",
      onClick: () => setFilters(prev => ({ ...prev, status: 'confirmed' }))
    },
    {
      label: "Completed",
      value: statsCount.completed,
      meta: "completed bookings",
      icon: CheckCircle,
      color: "purple",
      onClick: () => setFilters(prev => ({ ...prev, status: 'completed' }))
    },
    {
      label: "Cancelled",
      value: statsCount.cancelled,
      meta: "cancelled bookings",
      icon: XCircle,
      color: "rose",
      onClick: () => setFilters(prev => ({ ...prev, status: 'cancelled' }))
    }
  ];

  if (loading) {
    return (
      <div className="user-visits">
        {/* ✅ Show navbar based on role */}
        {isAdmin ? <AdminNavbar /> : isRegularUser ? <SimpleUserNavbar /> : <UsersNavbar />}
        <main className="p-2 sm:p-4 lg:p-6">
          <div className="user-visits__loading">
            <div className="user-visits__spinner" />
            <p className="user-visits__loading-text">Loading bookings...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="user-visits">
      {/* ✅ Show navbar based on role */}
      {isAdmin ? <AdminNavbar /> : isRegularUser ? <SimpleUserNavbar /> : <UsersNavbar />}

      <main className="p-2 sm:p-4 lg:p-6">
        {/* Header */}
        <div className="user-visits__header">
          <div>
            <h1 className="user-visits__greeting">
              My <span>Bookings</span>
            </h1>
            <p className="user-visits__subtitle">Manage all your space bookings</p>
          </div>
          <div className="flex items-center gap-2">
            {displayBookings.length > 0 && (
              <button
                onClick={exportToExcel}
                className="user-visits__btn user-visits__btn--primary"
              >
                <Download size={14} />
                Export
              </button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="user-visits__stats">
          {bookingStatsCards.map((stat, index) => (
            <div
              key={index}
              className="user-visits__stat"
              onClick={stat.onClick}
            >
              <div className="user-visits__stat-top">
                <span className="user-visits__stat-label">{stat.label}</span>
                <div className={`user-visits__stat-icon user-visits__stat-icon--${stat.color}`}>
                  <stat.icon size={14} />
                </div>
              </div>
              <div className="user-visits__stat-value">{stat.value}</div>
              <div className="user-visits__stat-meta">{stat.meta}</div>
            </div>
          ))}
        </div>

        {/* Tabs - Site Visits | Space Bookings */}
        <div className="flex items-center gap-2 mb-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('visits')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
              activeTab === 'visits'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Calendar size={16} className="inline mr-2" />
            Site Visits ({visitCount})
          </button>
          <button
            onClick={() => setActiveTab('spaces')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
              activeTab === 'spaces'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Building2 size={16} className="inline mr-2" />
            Space Bookings ({spaceCount})
          </button>
        </div>

        {/* Filters */}
        <div className="user-visits__filters">
          <div className="user-visits__filter-row">
            <div className="user-visits__search-input">
              <Search size={14} className="user-visits__search-icon" />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="user-visits__filter-select"
              />
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="user-visits__filter-select"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select
                value={filters.paymentStatus}
                onChange={(e) => setFilters({...filters, paymentStatus: e.target.value})}
                className="user-visits__filter-select"
              >
                <option value="all">Payment Status</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
              </select>
              {(filters.status !== 'all' || filters.paymentStatus !== 'all' || filterDate || searchTerm) && (
                <button
                  onClick={clearFilters}
                  className="user-visits__btn user-visits__btn--secondary"
                  title="Clear filters"
                >
                  <XIcon size={16} />
                </button>
              )}
              {displayBookings.length > 0 && (
                <button
                  onClick={exportToExcel}
                  className="user-visits__btn user-visits__btn--secondary"
                >
                  <Download size={14} />
                  <span className="hidden xs:inline">Export</span>
                </button>
              )}
            </div>
          </div>
          <div className="mt-1.5 text-[10px] text-gray-400">
            Showing {displayBookings.length} of {filteredBookings.length} bookings
          </div>
        </div>

        {/* RENDER BASED ON ACTIVE TAB */}
        {activeTab === 'visits' && renderVisitTable(displayBookings)}

        {activeTab === 'spaces' && renderSpaceTable(displayBookings)}

        {/* Footer */}
        <div className="mt-6 text-center text-[9px] text-gray-400 font-medium tracking-wider">
          © IRYAX SPACE — All Rights Reserved
        </div>
      </main>

      {/* ============================================================ */}
      {/* VIEW MODAL */}
      {/* ============================================================ */}
      {showViewModal && viewBooking && (
        <div 
          className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowViewModal(false);
            }
          }}
        >
          <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-gradient-to-br from-blue-600 to-cyan-600 text-white p-6 rounded-t-3xl flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold">Co-Working Booking Details</h3>
                <p className="text-sm text-blue-200 flex items-center gap-2">
                  <Hash size={14} /> #{viewBooking._id?.slice(-8).toUpperCase()}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-[10px] font-medium">
                    {viewBooking.bookingType === 'visit' ? 'Site Visit' : 'Space Booking'}
                  </span>
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-[10px] font-medium capitalize">
                    {viewBooking.bookingBasis || 'Hourly'}
                  </span>
                </div>
              </div>
              <button onClick={() => setShowViewModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* BASIC INFO */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Booking ID</p>
                  <p className="mt-1 font-mono text-sm font-semibold text-gray-800">{viewBooking._id?.slice(-8).toUpperCase()}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Type</p>
                  <span className={`mt-1 inline-block px-3 py-1 text-xs font-bold rounded-full ${viewBooking.bookingType === 'visit' ? 'bg-purple-100 text-purple-700' : 'bg-indigo-100 text-indigo-700'}`}>
                    {viewBooking.bookingType === 'visit' ? 'Site Visit' : 'Space Booking'}
                  </span>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Basis</p>
                  <span className="mt-1 inline-block px-3 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-700 capitalize">
                    {viewBooking.bookingBasis || 'Hourly'}
                  </span>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Terms</p>
                  <span className={`mt-1 inline-block px-3 py-1 text-xs font-bold rounded-full ${getTermsBadge(viewBooking.termsAccepted).color}`}>
                    {viewBooking.termsAccepted ? 'Accepted' : 'Not Accepted'}
                  </span>
                </div>
              </div>

              {/* CABIN & TYPE */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <Building2 size={12} /> Space
                  </p>
                  <p className="mt-1 font-semibold text-gray-800 text-sm">{viewBooking.cabin?.name || viewBooking.chamberName || 'N/A'}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-0.5 mt-0.5">
                    <MapPin size={10} /> {viewBooking.cabin?.address?.split(',')[0] || 'N/A'}
                  </p>
                  <div className="grid grid-cols-2 gap-1 mt-1 text-xs text-gray-500">
                    <span>Capacity: {viewBooking.cabin?.capacity || 'N/A'}</span>
                    <span>Type: {viewBooking.cabin?.cabinType || 'Normal'}</span>
                    <span>Price: ₹{viewBooking.cabin?.price || 0}/hr</span>
                    <span className={viewBooking.cabin?.isActive ? 'text-emerald-600' : 'text-red-500'}>
                      {viewBooking.cabin?.isActive ? '✅ Active' : '❌ Inactive'}
                    </span>
                  </div>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1">
                    <Briefcase size={12} /> Co-Working
                  </p>
                  <div className="mt-2">
                    <span className="px-3 py-1.5 text-xs font-bold rounded-full inline-flex items-center gap-2 bg-blue-100 text-blue-700">
                      <Briefcase size={14} /> Co-Working Space
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    <p><span className="font-medium">Booking Type:</span> {viewBooking.bookingType || 'booking'}</p>
                    <p><span className="font-medium">Basis:</span> {viewBooking.bookingBasis || 'hourly'}</p>
                    {viewBooking.selectedPlan && (
                      <p><span className="font-medium">Plan:</span> {viewBooking.selectedPlan.label || 'N/A'}</p>
                    )}
                    <p><span className="font-medium">Owner:</span> {viewBooking.cabin?.owner?.name || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* USER DETAILS */}
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1">
                  <User size={12} /> User Details
                </p>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs">Name</p>
                    <p className="font-semibold">{viewBooking.name || viewBooking.user?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Mobile</p>
                    <p className="font-medium">{viewBooking.mobile || viewBooking.user?.mobile || 'N/A'}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-500 text-xs">Email</p>
                    <p className="font-medium break-all">{viewBooking.email || viewBooking.user?.email || 'N/A'}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-500 text-xs">User ID</p>
                    <p className="font-mono text-xs text-gray-500">{viewBooking.userId || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* SCHEDULE */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <CalendarDays size={12} /> Start
                  </p>
                  <p className="mt-1 font-semibold text-gray-800">{formatDateIndian(viewBooking.startDate || viewBooking.date)}</p>
                  <p className="text-sm font-bold text-blue-600">{convertToIndianTime(viewBooking.startTime || viewBooking.time)}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <CalendarDays size={12} /> End
                  </p>
                  <p className="mt-1 font-semibold text-gray-800">{formatDateIndian(viewBooking.endDate || viewBooking.startDate)}</p>
                  <p className="text-sm font-bold text-blue-600">{convertToIndianTime(viewBooking.endTime)}</p>
                </div>
              </div>

              {/* BOOKING INFO */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                  <Info size={12} /> Booking Info
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold">
                    {viewBooking.totalHours || 0}h Total
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
                    {viewBooking.totalDays || 0} Days
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    Daily: {viewBooking.dailyHours?.join(', ') || 'N/A'}h
                  </span>
                  <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                    Remaining: {viewBooking.remainingHours || 0}h
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                    Used: {viewBooking.hoursUsed || 0}h
                  </span>
                </div>
              </div>

              {/* MULTI-DAY SLOTS */}
              {viewBooking.bookingSlots && viewBooking.bookingSlots.length > 0 && (
                <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200">
                  <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-2">
                    <CalendarDays size={14} />
                    Booking Slots ({viewBooking.bookingSlots.length} days)
                  </p>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {viewBooking.bookingSlots.map((slot, idx) => (
                      <div key={idx} className="bg-white p-2 rounded-lg border border-indigo-100">
                        <p className="text-xs font-bold text-gray-700">{formatDateIndian(slot.date)}</p>
                        <p className="text-[10px] text-gray-500">{slot.startTime} - {slot.endTime}</p>
                        <p className="text-[10px] font-bold text-indigo-600">{slot.hours}h</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SEATS */}
              {viewBooking.selectedSeats && viewBooking.selectedSeats.length > 0 && (
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-2">
                    <Armchair size={14} />
                    Selected Seats ({viewBooking.seatCount})
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {viewBooking.selectedSeats.map((seat) => (
                      <span key={seat._id} className="px-3 py-1.5 bg-white rounded-lg border border-emerald-200 text-sm font-medium text-gray-700">
                        {seat.name} <span className="text-gray-400 text-xs">#{seat.number}</span>
                      </span>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-emerald-600 font-medium">
                    Extra Charge: ₹{viewBooking.extraCharge || 0} ({viewBooking.seatCount} × ₹{viewBooking.seatExtraChargePerSeat || 100})
                  </p>
                </div>
              )}

              {/* STATUS & PAYMENT */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-indigo-50 rounded-xl text-center border border-indigo-200">
                  <p className="text-[10px] text-indigo-500 font-bold uppercase">Status</p>
                  <span className={`px-3 py-1 text-xs font-bold rounded-full inline-block mt-1 ${getStatusBadge(viewBooking.status).color}`}>
                    {getStatusBadge(viewBooking.status).label}
                  </span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl text-center border border-gray-200">
                  <p className="text-[10px] text-gray-500 font-bold uppercase">Payment</p>
                  <span className={`px-3 py-1 text-xs font-bold rounded-full inline-block mt-1 ${getPaymentMethodBadge(viewBooking.paymentMethod).color}`}>
                    {getPaymentMethodBadge(viewBooking.paymentMethod).label}
                  </span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl text-center border border-gray-200">
                  <p className="text-[10px] text-gray-500 font-bold uppercase">Pmt Status</p>
                  <span className={`px-3 py-1 text-xs font-bold rounded-full inline-block mt-1 ${getPaymentStatusBadge(viewBooking.paymentStatus).color}`}>
                    {getPaymentStatusBadge(viewBooking.paymentStatus).label}
                  </span>
                </div>
              </div>

              {/* PRICE BREAKDOWN */}
              <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
                <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-2 mb-3">
                  <Calculator size={14} />
                  Price Breakdown
                </p>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center border-b border-emerald-100 pb-1.5">
                    <span className="text-gray-600">Subtotal ({viewBooking.totalHours || 0}h × ₹{viewBooking.cabin?.price || 0})</span>
                    <span className="font-semibold text-gray-800">₹{(viewBooking.subtotal || 0).toFixed(2)}</span>
                  </div>

                  {viewBooking.extraCharge > 0 && (
                    <div className="flex justify-between items-center border-b border-emerald-100 pb-1.5">
                      <span className="text-gray-600">Seat Charges ({viewBooking.seatCount} × ₹{viewBooking.seatExtraChargePerSeat || 100})</span>
                      <span className="font-semibold text-amber-600">₹{(viewBooking.extraCharge || 0).toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center border-b border-emerald-100 pb-1.5">
                    <span className="text-gray-600">GST ({(viewBooking.gstRate || 0.18) * 100}%)</span>
                    <span className="font-semibold text-gray-800">₹{(viewBooking.gstAmount || 0).toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t-2 border-emerald-300">
                    <span className="font-bold text-gray-800">Total Amount</span>
                    <span className="text-xl font-bold text-emerald-700">₹{(viewBooking.totalPrice || viewBooking.amount || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* CREATED AT */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                  <CalendarPlus size={12} /> Booked On
                </p>
                <p className="mt-1 font-semibold text-gray-800">{formatDateTimeToDDMMYYYY(viewBooking.createdAt)}</p>
              </div>

              {/* ACTIONS */}
              <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-200">
                <button
                  onClick={() => { setShowViewModal(false); downloadInvoice(viewBooking); }}
                  className="flex-1 min-w-[120px] py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-sm active:scale-[0.98]"
                >
                  <FileDown size={16} className="inline mr-2" />
                  Download Invoice
                </button>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REPLACE MODAL */}
      {showReplaceModal && replaceBooking && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowReplaceModal(false)}>
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-5 rounded-t-3xl flex justify-between items-center shrink-0">
              <div>
                <h3 className="text-xl font-bold">Replace Space</h3>
                <p className="text-sm text-blue-200">{replaceBooking.cabin?.name || replaceBooking.chamberName} → New Space</p>
              </div>
              <button onClick={() => setShowReplaceModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4 overflow-y-auto flex-1">
              <div className="bg-blue-50 rounded-xl p-4 text-sm">
                <p className="font-bold text-blue-800">Current Booking</p>
                <p className="text-slate-600 mt-1">{replaceBooking.cabin?.name || replaceBooking.chamberName}</p>
                <p className="text-xs text-slate-500">{formatDateIndian(replaceBooking.startDate || replaceBooking.date)} {convertToIndianTime(replaceBooking.startTime || replaceBooking.time)} - {formatDateIndian(replaceBooking.endDate || replaceBooking.startDate)} {convertToIndianTime(replaceBooking.endTime)}</p>
                <p className="text-xs font-bold text-slate-700 mt-1">Total: ₹{replaceBooking.totalPrice || replaceBooking.amount}</p>
                {replaceBooking.totalDays > 0 && (
                  <p className="text-xs text-slate-500">{replaceBooking.totalDays} days • {replaceBooking.totalHours}h total</p>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Select New Space</label>
                <div className="relative">
                  <select
                    value={selectedChamber}
                    onChange={(e) => setSelectedChamber(e.target.value)}
                    className="w-full p-3 pr-10 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                  >
                    <option value="">Select a space...</option>
                    {allChambers
                      .filter(c => c._id !== replaceBooking.cabin?._id)
                      .map(c => (
                        <option key={c._id} value={c._id}>
                          {c.name} - ₹{c.price}/hr
                        </option>
                      ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {selectedChamberData && priceDiff && (
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-3">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Price Comparison</p>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-[10px] text-blue-600 font-medium">Current Space</p>
                      <p className="font-bold text-slate-800">₹{replaceBooking.cabin?.price || 0}/hr</p>
                      <p className="text-xs text-slate-500">{replaceBooking.totalHours || 1}h = ₹{replaceBooking.totalPrice || replaceBooking.amount || 0}</p>
                    </div>
                    <div className="bg-emerald-50 rounded-lg p-3">
                      <p className="text-[10px] text-emerald-600 font-medium">New Space</p>
                      <p className="font-bold text-slate-800">₹{selectedChamberData.price}/hr</p>
                      <p className="text-xs text-slate-500">{replaceBooking.totalHours || 1}h = ₹{priceDiff.newTotal}</p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-3">
                    {priceDiff.finalDifference > 0 ? (
                      <div className="flex items-center justify-between text-amber-600 bg-amber-50 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <TrendingUp size={16} />
                          <span className="text-sm font-medium">You need to pay extra</span>
                        </div>
                        <span className="font-bold text-lg">+₹{Math.round(priceDiff.finalDifference)}</span>
                      </div>
                    ) : priceDiff.finalDifference < 0 ? (
                      <div className="flex items-center justify-between text-emerald-600 bg-emerald-50 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <TrendingDown size={16} />
                          <span className="text-sm font-medium">You will get refund</span>
                        </div>
                        <span className="font-bold text-lg">-₹{Math.round(Math.abs(priceDiff.finalDifference))}</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-slate-600 bg-slate-100 rounded-lg p-3">
                        <span className="text-sm font-medium">No price difference</span>
                        <span className="font-bold text-lg">₹0</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="bg-amber-50 rounded-xl p-3 text-xs text-amber-700 flex items-start gap-2">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>Replacement is subject to availability. Price difference (if any) will be adjusted.</span>
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 shrink-0">
              <button
                onClick={handleReplaceBooking}
                disabled={replaceLoading || !selectedChamber}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {replaceLoading ? 'Replacing...' : <><RefreshCw size={16} /> Replace Booking</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CANCEL MODAL */}
      {showCancelModal && cancelBooking && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowCancelModal(false)}>
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-br from-red-600 to-red-700 text-white p-5 rounded-t-3xl flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">Cancel Booking</h3>
                <p className="text-sm text-red-200">{cancelBooking.cabin?.name || cancelBooking.chamberName}</p>
              </div>
              <button onClick={() => setShowCancelModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-red-50 rounded-xl p-4 text-sm">
                <p className="font-bold text-red-800">Are you sure you want to cancel this booking?</p>
                <div className="mt-2 space-y-1 text-slate-600">
                  <p><span className="text-slate-500">Space:</span> {cancelBooking.cabin?.name || cancelBooking.chamberName}</p>
                  <p><span className="text-slate-500">Start:</span> {formatDateIndian(cancelBooking.startDate || cancelBooking.date)} {convertToIndianTime(cancelBooking.startTime || cancelBooking.time)}</p>
                  <p><span className="text-slate-500">End:</span> {formatDateIndian(cancelBooking.endDate || cancelBooking.startDate)} {convertToIndianTime(cancelBooking.endTime)}</p>
                  <p><span className="text-slate-500">Total:</span> ₹{cancelBooking.totalPrice || cancelBooking.amount || 0}</p>
                  {cancelBooking.totalDays > 0 && (
                    <p><span className="text-slate-500">Days:</span> {cancelBooking.totalDays} days ({cancelBooking.totalHours}h)</p>
                  )}
                </div>
              </div>

              <div className="bg-amber-50 rounded-xl p-3 text-xs text-amber-700 flex items-start gap-2">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Cancellation Policy:</p>
                  <ul className="list-disc pl-4 mt-1 space-y-0.5">
                    <li>Free cancellation within <span className="font-bold">24 hours</span> of booking</li>
                    <li>50% refund for cancellations after 24 hours</li>
                    <li>No refund for no-shows</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCancelBooking}
                  disabled={cancelLoading}
                  className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {cancelLoading ? 'Cancelling...' : <><XIcon size={16} /> Cancel Booking</>}
                </button>
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="px-5 py-3 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ✅ RENDER SITE VISIT TABLE
  function renderVisitTable(bookingsList) {
    if (bookingsList.length === 0) {
      return (
        <div className="user-visits__empty">
          <Calendar size={32} className="user-visits__empty-icon" />
          <p className="user-visits__empty-text">No site visits found</p>
        </div>
      );
    }

    return (
      <div className="user-visits__card">
        <div className="user-visits__card-header">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-purple-600" />
            <h3 className="user-visits__card-title">Site Visits</h3>
            <span className="px-2 py-0.5 bg-white/60 rounded-full text-xs font-bold text-gray-600">{bookingsList.length}</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="user-visits__table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Space</th>
                <th>Type</th>
                <th>Visit Date</th>
                <th>Visit Time</th>
                <th>Status</th>
                <th>Created At</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookingsList.map((b, idx) => {
                const status = getStatusBadge(b.status);
                const bookingId = b._id?.slice(-8).toUpperCase() || 'N/A';

                return (
                  <tr key={b._id}>
                    <td>
                      <span className="text-[10px] font-semibold text-gray-400">{idx + 1}</span>
                    </td>
                    <td>
                      <div>
                        <p className="font-semibold text-gray-900 text-xs">
                          {b.cabin?.name || b.chamberName || 'Unknown Space'}
                        </p>
                        <p className="text-[9px] text-gray-400 flex items-center gap-0.5">
                          <MapPin size={9} />
                          {b.cabin?.address?.split(',')[0] || 'N/A'}
                        </p>
                      </div>
                    </td>
                    <td>
                      <span className="px-2 py-0.5 text-[9px] font-bold rounded-full inline-flex items-center gap-1 bg-blue-100 text-blue-700">
                        <Briefcase size={9} /> Co-Working
                      </span>
                    </td>
                    <td>
                      <span className="text-xs font-medium text-gray-700">{formatDateIndian(b.startDate || b.date)}</span>
                    </td>
                    <td>
                      <span className="text-xs font-medium text-gray-700">{convertToIndianTime(b.startTime || b.time)}</span>
                    </td>
                    <td>
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${status.color}`}>{status.label}</span>
                    </td>
                    <td>
                      <span className="text-[10px] text-gray-500 font-medium">{formatDateTimeToDDMMYYYY(b.createdAt)}</span>
                    </td>
                    <td className="text-center">
                      <button
                        onClick={() => handleViewBooking(b)}
                        className="user-visits__btn user-visits__btn--secondary"
                        style={{ padding: "0.375rem 0.5rem" }}
                        title="View"
                      >
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ✅ RENDER SPACE BOOKINGS TABLE
  function renderSpaceTable(bookingsList) {
    if (bookingsList.length === 0) {
      return (
        <div className="user-visits__empty">
          <Briefcase size={32} className="user-visits__empty-icon" />
          <p className="user-visits__empty-text">No space bookings found</p>
        </div>
      );
    }

    return (
      <div className="user-visits__card">
        <div className="user-visits__card-header">
          <div className="flex items-center gap-2">
            <Briefcase size={16} className="text-blue-600" />
            <h3 className="user-visits__card-title">Co-Working Space Bookings</h3>
            <span className="px-2 py-0.5 bg-white/60 rounded-full text-xs font-bold text-gray-600">{bookingsList.length}</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="user-visits__table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Space</th>
                <th>Type</th>
                <th>Start</th>
                <th>End</th>
                <th>Hours</th>
                <th>Days</th>
                <th>Seats</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Amount</th>
                <th>Created At</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookingsList.map((b, idx) => {
                const status = getStatusBadge(b.status);
                const pmtMethod = getPaymentMethodBadge(b.paymentMethod);
                const pmtStatus = getPaymentStatusBadge(b.paymentStatus);
                const seatCount = b.seatCount || 0;
                const canCancel = b.status === 'pending' || b.status === 'confirmed';
                const canReplace = b.status === 'confirmed' || b.status === 'active';
                const totalDays = b.totalDays || 0;
                const bookingId = b._id?.slice(-8).toUpperCase() || 'N/A';

                return (
                  <tr key={b._id}>
                    <td>
                      <span className="text-[10px] font-semibold text-gray-400">{idx + 1}</span>
                    </td>
                    <td>
                      <div>
                        <p className="font-semibold text-gray-900 text-xs">
                          {b.cabin?.name || b.chamberName || 'Unknown'}
                        </p>
                        <p className="text-[9px] text-gray-400 flex items-center gap-0.5">
                          <MapPin size={9} />
                          {b.cabin?.address?.split(',')[0] || 'N/A'}
                        </p>
                      </div>
                    </td>
                    <td>
                      <span className="px-2 py-0.5 text-[9px] font-bold rounded-full inline-flex items-center gap-1 bg-blue-100 text-blue-700">
                        <Briefcase size={9} /> Co-Working
                      </span>
                    </td>
                    <td>
                      <div>
                        <span className="text-xs font-medium text-gray-700">{formatDateIndian(b.startDate || b.date)}</span>
                        <p className="text-[9px] text-blue-600 font-medium">{convertToIndianTime(b.startTime || b.time)}</p>
                      </div>
                    </td>
                    <td>
                      <div>
                        <span className="text-xs font-medium text-gray-700">{formatDateIndian(b.endDate || b.startDate || b.date)}</span>
                        <p className="text-[9px] text-blue-600 font-medium">{convertToIndianTime(b.endTime)}</p>
                      </div>
                    </td>
                    <td>
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full text-[9px] font-bold">{b.totalHours || 0}h</span>
                    </td>
                    <td>
                      <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full text-[9px] font-bold">{totalDays}d</span>
                    </td>
                    <td>
                      <span className="flex items-center gap-1 text-xs font-medium text-gray-700">
                        <Armchair size={12} className="text-indigo-500" />
                        {seatCount}
                      </span>
                    </td>
                    <td>
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${status.color}`}>{status.label}</span>
                    </td>
                    <td>
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${pmtMethod.color}`}>{pmtMethod.label}</span>
                      <span className={`ml-1 px-2 py-0.5 text-[9px] font-bold rounded-full ${pmtStatus.color}`}>{pmtStatus.label}</span>
                    </td>
                    <td>
                      <span className="text-xs font-bold text-blue-600">₹{b.totalPrice || b.amount || 0}</span>
                      {b.extraCharge > 0 && (
                        <p className="text-[8px] text-amber-500">+₹{b.extraCharge} seat</p>
                      )}
                    </td>
                    <td>
                      <span className="text-[10px] text-gray-500 font-medium">{formatDateTimeToDDMMYYYY(b.createdAt)}</span>
                    </td>
                    <td className="text-center">
                      <div className="flex items-center justify-center gap-1 flex-wrap">
                        <button
                          onClick={() => handleViewBooking(b)}
                          className="user-visits__btn user-visits__btn--secondary"
                          style={{ padding: "0.375rem 0.5rem" }}
                          title="View"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => downloadInvoice(b)}
                          className="user-visits__btn user-visits__btn--secondary"
                          style={{ padding: "0.375rem 0.5rem" }}
                          title="Invoice"
                        >
                          <FileDown size={14} />
                        </button>
                        {canReplace && (
                          <button
                            onClick={() => {
                              setReplaceBooking(b);
                              setSelectedChamber("");
                              setSelectedChamberData(null);
                              setShowReplaceModal(true);
                            }}
                            className="user-visits__btn user-visits__btn--secondary"
                            style={{ padding: "0.375rem 0.5rem" }}
                            title="Replace"
                          >
                            <RefreshCw size={14} />
                          </button>
                        )}
                        {canCancel && (
                          <button
                            onClick={() => {
                              setCancelBooking(b);
                              setShowCancelModal(true);
                            }}
                            className="user-visits__btn user-visits__btn--secondary"
                            style={{ padding: "0.375rem 0.5rem" }}
                            title="Cancel"
                          >
                            <XIcon size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
};

export default MyBookings;