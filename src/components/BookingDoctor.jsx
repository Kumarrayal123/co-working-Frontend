// // DoctorBookings.jsx - Complete with ALL Fields from API Response (UPDATED UI - Matches SimpleUserBookings)
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
//   Plus,
//   Calendar as CalendarIcon,
//   Stethoscope,
//   Briefcase,
//   Clock as ClockIcon,
//   Layers,
//   Hash,
//   MessageSquare,
//   Star,
//   Check,
//   AlertTriangle,
//   Wallet,
//   CalendarDays,
//   Info,
//   Timer,
//   History,
//   Bell,
//   CalendarPlus,
//   Calculator,
//   Ticket
// } from "lucide-react";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import DoctorNavbar from "./DoctorNavbar";
// import * as XLSX from 'xlsx';
// import "./Dashboard.css";

// const API_URL = "https://spaceapi.iryax.com";

// const BookingDoctor = () => {
//   const [bookings, setBookings] = useState([]);
//   const [allChambers, setAllChambers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterDateFrom, setFilterDateFrom] = useState("");
//   const [filterDateTo, setFilterDateTo] = useState("");
//   const [activeTab, setActiveTab] = useState('all');
//   const [filters, setFilters] = useState({
//     status: 'all',
//     paymentStatus: 'all',
//     paymentMethod: 'all',
//     cabinId: 'all'
//   });
//   const navigate = useNavigate();

//   const [showViewModal, setShowViewModal] = useState(false);
//   const [viewBooking, setViewBooking] = useState(null);

//   const [showReplaceModal, setShowReplaceModal] = useState(false);
//   const [replaceBooking, setReplaceBooking] = useState(null);
//   const [selectedChamber, setSelectedChamber] = useState("");
//   const [replaceLoading, setReplaceLoading] = useState(false);
//   const [selectedChamberData, setSelectedChamberData] = useState(null);

//   const [showCancelModal, setShowCancelModal] = useState(false);
//   const [cancelBooking, setCancelBooking] = useState(null);
//   const [cancelLoading, setCancelLoading] = useState(false);

//   const currentUser = (() => {
//     try {
//       const u = localStorage.getItem("doctor");
//       if (u) return JSON.parse(u);
//       return null;
//     } catch (err) {
//       return null;
//     }
//   })();

//   const getAuthHeader = () => {
//     const token = localStorage.getItem("token");
//     return { headers: { Authorization: `Bearer ${token}` } };
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

//   const formatBookedDate = (dateString) => {
//     if (!dateString) return "N/A";
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-IN', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric'
//     });
//   };

//   const formatBookedTime = (dateString) => {
//     if (!dateString) return "N/A";
//     const date = new Date(dateString);
//     return date.toLocaleTimeString('en-IN', {
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: true
//     });
//   };

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
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         toast.error("Please login to view your bookings");
//         navigate("/login");
//         return;
//       }

//       const res = await axios.get(
//         `${API_URL}/api/bookings/user`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       const bookingsData = res.data.bookings || [];
//       setBookings(bookingsData);

//       if (bookingsData.length === 0) {
//         toast.info("You have no bookings yet");
//       }

//     } catch (error) {
//       console.error("Error fetching bookings:", error);
//       if (error.response?.status === 401) {
//         toast.error("Session expired. Please login again.");
//         localStorage.removeItem("token");
//         localStorage.removeItem("doctor");
//         navigate("/login");
//       } else {
//         toast.error("Failed to fetch bookings: " + (error.response?.data?.error || error.message));
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchChambers = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) return;
//       const res = await axios.get(`${API_URL}/api/cabins`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       const activeChambers = res.data.filter(c => c.isActive === true);
//       setAllChambers(activeChambers);
//     } catch (error) {
//       console.error("Failed to fetch chambers:", error);
//     }
//   };

//   useEffect(() => {
//     fetchBookings();
//     fetchChambers();
//   }, []);

//   useEffect(() => {
//     if (selectedChamber && replaceBooking) {
//       const chamber = allChambers.find(c => c._id === selectedChamber);
//       setSelectedChamberData(chamber || null);
//     } else {
//       setSelectedChamberData(null);
//     }
//   }, [selectedChamber, allChambers, replaceBooking]);

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

//   const getSlotsDisplay = (slots) => {
//     if (!slots || slots.length === 0) return 'N/A';
//     return slots.map(s => `${formatDate(s.date)} ${s.startTime}-${s.endTime} (${s.hours}h)`).join(' | ');
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
//         'Chamber': b.cabin?.name || b.chamberName || 'Unknown',
//         'Space Type': b.cabin?.isChamber ? 'Medical' : 'Co-Working',
//         'User': b.name || b.patientName || 'N/A',
//         'Mobile': b.mobile || b.patientMobile || 'N/A',
//         'Email': b.email || b.patientEmail || 'N/A',
//         'From Date': b.startDate || b.date || 'N/A',
//         'To Date': b.endDate || 'N/A',
//         'From Time': convertToIndianTime(b.startTime || b.time),
//         'To Time': convertToIndianTime(b.endTime),
//         'Total Hours': b.totalHours || 0,
//         'Total Days': b.totalDays || 0,
//         'Daily Hours': b.dailyHours?.join(', ') || 'N/A',
//         'Slots': getSlotsDisplay(b.bookingSlots),
//         'Seats': b.seatCount || 0,
//         'Seat Names': b.selectedSeats?.map(s => s.name).join(', ') || 'N/A',
//         'Extra Charge': b.extraCharge || 0,
//         'Subtotal': b.subtotal || 0,
//         'GST': b.gstAmount || 0,
//         'GST Rate': `${(b.gstRate || 0.18) * 100}%`,
//         'Total (₹)': b.totalPrice || b.amount || 0,
//         'Status': getStatusBadge(b.status).label,
//         'Payment': getPaymentMethodBadge(b.paymentMethod).label,
//         'Pmt Status': getPaymentStatusBadge(b.paymentStatus).label,
//         'Terms': b.termsAccepted ? 'Yes' : 'No',
//         'Transaction ID': b.transactionId || 'N/A',
//         'Razorpay Order': b.razorpayOrderId || 'N/A',
//         'Payment Mode': b.paymentDetails?.mode || 'N/A',
//         'Payment Date': b.paymentDetails?.paymentDate ? formatDate(b.paymentDetails.paymentDate) : 'N/A',
//         'UPI ID': b.paymentDetails?.upiId || 'N/A',
//         'UPI App': b.paymentDetails?.upiApp || 'N/A',
//         'Screenshot': b.paymentDetails?.screenshot ? 'Yes' : 'No',
//         'Check-in': b.checkInTime || 'N/A',
//         'Check-out': b.checkOutTime || 'N/A',
//         'Actual Check-in': b.actualCheckIn || 'N/A',
//         'Actual Check-out': b.actualCheckOut || 'N/A',
//         'Is Extended': b.isExtended ? 'Yes' : 'No',
//         'Cancelled At': b.cancelledAt ? formatDateTime(b.cancelledAt) : 'N/A',
//         'Cancellation Reason': b.cancellationReason || 'N/A',
//         'Review': b.review || 'N/A',
//         'Rating': b.rating || 'N/A',
//         'Booked On': b.createdAt ? formatDateTime(b.createdAt) : 'N/A'
//       }));
//       const ws = XLSX.utils.json_to_sheet(data);
//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, 'Bookings');
//       XLSX.writeFile(wb, `doctor_bookings_${new Date().toISOString().split('T')[0]}.xlsx`);
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
//     if (!selectedChamber) {
//       toast.error("Please select a chamber to replace");
//       return;
//     }

//     setReplaceLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.put(
//         `${API_URL}/api/bookings/replace-booking/${replaceBooking._id}`,
//         { newCabinId: selectedChamber },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (response.data.success) {
//         toast.success("Booking replaced successfully!");
//         setShowReplaceModal(false);
//         setReplaceBooking(null);
//         setSelectedChamber("");
//         setSelectedChamberData(null);
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
//           `<div style="display:inline-block;background:#eff6ff;padding:3px 12px;border-radius:8px;margin:3px;font-size:10px;border:1px solid #93c5fd;">
//             ${formatDate(s.date)} ${s.startTime}-${s.endTime} (${s.hours}h)
//           </div>`
//         ).join('');
//       }

//       win.document.write(`
//         <html><head><title>Invoice</title>
//         <style>
//           body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: auto; }
//           .header { border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 20px; display: flex; justify-content: space-between; }
//           h1 { color: #1a56db; margin: 0; font-size: 24px; }
//           .info { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
//           table { width: 100%; border-collapse: collapse; margin: 20px 0; }
//           th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
//           th { background: #f8fafc; font-weight: 700; }
//           .total { font-size: 20px; font-weight: 700; text-align: right; margin-top: 20px; border-top: 2px solid #000; padding-top: 15px; }
//           .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 2px solid #000; color: #666; font-size: 12px; }
//           .badge { display: inline-block; padding: 2px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; }
//           .seat-section, .slot-section { margin: 10px 0; padding: 10px; background: #f8fafc; border-radius: 8px; }
//           .meta-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin: 10px 0; }
//         </style>
//         </head><body>
//           <div class="header">
//             <div><h1>${(owner.organizationName || 'IRYAX SPACE').toUpperCase()}</h1>
//             <p>GST: ${owner.gstNumber || 'N/A'}</p></div>
//             <div><p><strong>Invoice #${booking._id?.slice(-8).toUpperCase() || 'N/A'}</strong></p>
//             <p>${new Date().toLocaleDateString()}</p></div>
//           </div>
//           <div class="info">
//             <div><strong>User:</strong><br>${booking.name || booking.patientName || 'User'}<br>${booking.mobile || booking.patientMobile || 'N/A'}<br>${booking.email || booking.patientEmail || 'N/A'}</div>
//             <div><strong>Chamber:</strong><br>${cabin.name || booking.chamberName || 'Unknown'}<br>${cabin.address || 'N/A'}</div>
//           </div>
//           ${booking.bookingSlots && booking.bookingSlots.length > 0 ? `
//             <div class="slot-section">
//               <strong>Booking Slots (${booking.totalDays} days, ${booking.totalHours}h total):</strong>
//               <div style="margin-top:5px;">${slotsHtml}</div>
//               <div style="margin-top:5px;font-size:12px;color:#666;">Daily Hours: ${booking.dailyHours?.join(', ')}h</div>
//             </div>
//           ` : ''}
//           ${booking.selectedSeats && booking.selectedSeats.length > 0 ? `
//             <div class="seat-section">
//               <strong>Selected Seats:</strong>
//               <div style="margin-top:5px;">${seatListHtml}</div>
//               <div style="margin-top:5px;font-size:12px;color:#666;">Total: ${booking.seatCount} seats • Extra Charge: ₹${booking.extraCharge || 0}</div>
//             </div>
//           ` : ''}
//           <table>
//             <tr><th>Description</th><th>Details</th><th>Amount</th></tr>
//             <tr><td><strong>${cabin.name || booking.chamberName || 'Chamber Booking'}</strong></td>
//             <td>${booking.startDate || booking.date} ${convertToIndianTime(booking.startTime || booking.time)} - ${booking.endDate} ${convertToIndianTime(booking.endTime)}<br>${booking.totalHours}h • ${booking.totalDays || 0} days • ${booking.bookingBasis === 'plan' ? 'Plan' : 'Hourly'}</td>
//             <td>₹${(booking.subtotal || 0).toFixed(2)}</td></tr>
//             ${booking.extraCharge > 0 ? `
//             <tr><td><strong>Seat Charges</strong></td>
//             <td>${booking.seatCount} seats × ₹${booking.seatExtraChargePerSeat || 100}</td>
//             <td>₹${(booking.extraCharge || 0).toFixed(2)}</td></tr>
//             ` : ''}
//           </table>
//           <div class="meta-grid">
//             <span><strong>Payment:</strong> <span class="badge ${getPaymentMethodBadge(booking.paymentMethod).color.replace('bg-','bg-')}">${getPaymentMethodBadge(booking.paymentMethod).label}</span></span>
//             <span><strong>Status:</strong> <span class="badge ${getStatusBadge(booking.status).color}">${getStatusBadge(booking.status).label}</span></span>
//             <span><strong>Pmt Status:</strong> <span class="badge ${getPaymentStatusBadge(booking.paymentStatus).color}">${getPaymentStatusBadge(booking.paymentStatus).label}</span></span>
//           </div>
//           <div class="total">Subtotal: ₹${(booking.subtotal || 0).toFixed(2)}<br>${booking.extraCharge > 0 ? `Seat Charges: ₹${(booking.extraCharge || 0).toFixed(2)}<br>` : ''}GST (${(booking.gstRate || 0.18) * 100}%): ₹${(booking.gstAmount || 0).toFixed(2)}<br>Total: ₹${(booking.totalPrice || 0).toFixed(2)}</div>
//           <div class="footer">Powered by IRYAX SPACE<br>Booked On: ${formatDateTime(booking.createdAt)}<br>Booking ID: ${booking._id}</div>
//         </body></html>
//       `);
//       win.document.close();
//       win.focus();
//       toast.success('Invoice opened! Click Print to save as PDF.');
//     } catch (error) {
//       toast.error('Failed to generate invoice');
//     }
//   };

//   // FILTERED BOOKINGS with search
//   const filteredBookings = bookings.filter((b) => {
//     const search = searchTerm.toLowerCase();
//     const bookingDate = b.startDate || b.date;

//     const matchSearch = b.cabin?.name?.toLowerCase().includes(search) ||
//                         b.cabin?.address?.toLowerCase().includes(search) ||
//                         b.name?.toLowerCase().includes(search) ||
//                         b.mobile?.includes(searchTerm) ||
//                         b.patientName?.toLowerCase().includes(search) ||
//                         b.patientMobile?.includes(searchTerm) ||
//                         b.chamberName?.toLowerCase().includes(search);

//     let matchDateRange = true;
//     if (filterDateFrom && filterDateTo) {
//       matchDateRange = bookingDate >= filterDateFrom && bookingDate <= filterDateTo;
//     } else if (filterDateFrom) {
//       matchDateRange = bookingDate >= filterDateFrom;
//     } else if (filterDateTo) {
//       matchDateRange = bookingDate <= filterDateTo;
//     }

//     const matchCabin = filters.cabinId === 'all' || b.cabin?._id === filters.cabinId;
//     const matchStatus = filters.status === 'all' || b.status === filters.status;
//     const matchPaymentStatus = filters.paymentStatus === 'all' || b.paymentStatus === filters.paymentStatus;
//     const matchPaymentMethod = filters.paymentMethod === 'all' || b.paymentMethod === filters.paymentMethod;

//     return matchSearch && matchDateRange && matchCabin && matchStatus && matchPaymentStatus && matchPaymentMethod;
//   });

//   const getFilteredByTab = () => {
//     if (activeTab === 'visits') {
//       return filteredBookings.filter(b => b.bookingType === 'visit');
//     } else if (activeTab === 'chambers') {
//       return filteredBookings.filter(b => b.bookingType !== 'visit');
//     } else {
//       return filteredBookings;
//     }
//   };

//   const displayBookings = getFilteredByTab();

//   const totalCount = bookings.length;
//   const activeCount = bookings.filter(b => b.status === 'active' || b.status === 'confirmed').length;
//   const pendingCount = bookings.filter(b => b.status === 'pending').length;
//   const completedCount = bookings.filter(b => b.status === 'completed').length;
//   const cancelledCount = bookings.filter(b => b.status === 'cancelled').length;
//   const visitCount = bookings.filter(b => b.bookingType === 'visit').length;
//   const chamberCount = bookings.filter(b => b.bookingType !== 'visit').length;

//   const getPriceDifference = () => {
//     if (!replaceBooking || !selectedChamberData) return null;

//     const currentPrice = replaceBooking.totalPrice || 0;
//     const newPrice = selectedChamberData.price || 0;
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
//       paymentMethod: 'all',
//       cabinId: 'all'
//     });
//     setFilterDateFrom('');
//     setFilterDateTo('');
//     setSearchTerm('');
//   };

//   // Stats for cards - matching SimpleUserBookings style
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
//         <DoctorNavbar />
//         <div className="flex justify-center items-center h-64">
//           <div className="w-12 h-12 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin" />
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="admin-dash" style={{ backgroundColor: '#ffffff' }}>
//       <DoctorNavbar />

//       <div className="pt-20 px-3 sm:px-4 md:px-6 lg:px-8 max-w-full mx-auto pb-16">
//         {/* Header */}
//         <div className="admin-dash__header" style={{ marginBottom: '8px' }}>
//           <div>
//             <h1 className="admin-dash__greeting" style={{ fontSize: '1.25rem' }}>
//               Doctor <span>Bookings</span>
//             </h1>
//             <p className="admin-dash__subtitle" style={{ fontSize: '11px' }}>
//               Manage all your chamber and site visit bookings
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
//             <button
//               onClick={() => navigate("/mychambers")}
//               className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 transition shadow-sm shadow-indigo-200"
//             >
//               <Building2 size={14} />
//               My Chambers
//             </button>
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
//                 value={filterDateFrom}
//                 onChange={(e) => setFilterDateFrom(e.target.value)}
//                 className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
//                 placeholder="From Date"
//               />
//               <input
//                 type="date"
//                 value={filterDateTo}
//                 onChange={(e) => setFilterDateTo(e.target.value)}
//                 className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
//                 placeholder="To Date"
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
//                 <option value="chambers">Chamber Bookings ({chamberCount})</option>
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
//               <select
//                 value={filters.cabinId}
//                 onChange={(e) => setFilters({...filters, cabinId: e.target.value})}
//                 className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
//               >
//                 <option value="all">All Chambers</option>
//                 {allChambers.map(cabin => (
//                   <option key={cabin._id} value={cabin._id}>
//                     {cabin.name}
//                   </option>
//                 ))}
//               </select>
//               {(filters.status !== 'all' || filters.paymentStatus !== 'all' || filters.paymentMethod !== 'all' || filters.cabinId !== 'all' || filterDateFrom || filterDateTo || searchTerm) && (
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

//         {/* Tab Buttons - Clean design matching SimpleUserBookings */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-1 mb-4 flex">
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
//             onClick={() => setActiveTab('chambers')}
//             className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
//               activeTab === 'chambers'
//                 ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-200'
//                 : 'text-gray-500 hover:bg-gray-50'
//             }`}
//           >
//             Chamber Bookings
//             <span className={`ml-1.5 px-1.5 py-0.5 text-[9px] rounded-full ${
//               activeTab === 'chambers' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
//             }`}>
//               {chamberCount}
//             </span>
//           </button>
//         </div>

//         {/* Table */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
//           {displayBookings.length === 0 ? (
//             <div className="flex flex-col items-center justify-center gap-3 py-20 text-gray-400">
//               <Calendar size={48} className="opacity-20" />
//               <p className="text-lg font-medium">No bookings found</p>
//               <p className="text-sm">Try adjusting your filters.</p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full text-left text-sm min-w-[1400px]">
//                 <thead>
//                   <tr className="bg-gray-50 border-b border-gray-100">
//                     <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">S. No</th>
//                     <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Booking ID</th>
//                     <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Chamber</th>
//                     <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Space</th>
//                     <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">User</th>
//                     {activeTab === 'visits' ? (
//                       <>
//                         <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Visit Date</th>
//                         <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Visit Time</th>
//                         <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Status</th>
//                         <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Booked On</th>
//                         <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase text-center">Actions</th>
//                       </>
//                     ) : (
//                       <>
//                         <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Start</th>
//                         <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">End</th>
//                         <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Hours</th>
//                         <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Days</th>
//                         <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Seats</th>
//                         <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Status</th>
//                         <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Payment</th>
//                         <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Amount</th>
//                         <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Booked On</th>
//                         <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase text-center">Actions</th>
//                       </>
//                     )}
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-100">
//                   {displayBookings.map((b, idx) => {
//                     const status = getStatusBadge(b.status);
//                     const pmtMethod = getPaymentMethodBadge(b.paymentMethod);
//                     const pmtStatus = getPaymentStatusBadge(b.paymentStatus);
//                     const seatCount = b.seatCount || 0;
//                     const seatNames = b.selectedSeats?.map(s => s.name).join(', ') || 'N/A';
//                     const isVisit = b.bookingType === 'visit';
//                     const isChamber = b.cabin?.isChamber || false;

//                     const fromTimeIndian = convertToIndianTime(b.startTime || b.time);
//                     const toTimeIndian = convertToIndianTime(b.endTime);
//                     const dailyHoursStr = b.dailyHours?.join(', ') || 'N/A';
//                     const totalDays = b.totalDays || 0;
//                     const bookingId = b._id?.slice(-8).toUpperCase() || 'N/A';
//                     const canCancel = b.status === 'pending' || b.status === 'confirmed';
//                     const canReplace = b.status === 'confirmed' || b.status === 'active';

//                     return (
//                       <tr key={b._id} className="transition-colors group hover:bg-gray-50/80">
//                         <td className="px-3 py-2">
//                           <span className="text-[10px] font-semibold text-gray-400">{idx + 1}</span>
//                         </td>
//                         <td className="px-3 py-2">
//                           <span className="font-mono text-[10px] font-bold text-indigo-600">{bookingId}</span>
//                         </td>
//                         <td className="px-3 py-2">
//                           <div>
//                             <p className="font-semibold text-gray-900 text-xs">
//                               {b.cabin?.name || b.chamberName || 'Unknown'}
//                             </p>
//                             <p className="text-[9px] text-gray-400 flex items-center gap-0.5">
//                               <MapPin size={9} />
//                               {b.cabin?.address?.split(',')[0] || 'N/A'}
//                             </p>
//                           </div>
//                         </td>
//                         <td className="px-3 py-2">
//                           <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full inline-flex items-center gap-1 ${
//                             isChamber 
//                               ? 'bg-emerald-100 text-emerald-700' 
//                               : 'bg-blue-100 text-blue-700'
//                           }`}>
//                             {isChamber ? (
//                               <><Stethoscope size={9} /> Medical</>
//                             ) : (
//                               <><Briefcase size={9} /> Co-Working</>
//                             )}
//                           </span>
//                         </td>
//                         <td className="px-3 py-2">
//                           <div>
//                             <p className="font-medium text-gray-800 text-xs">{b.name || b.patientName || 'N/A'}</p>
//                             <p className="text-[9px] text-gray-400">{b.mobile || b.patientMobile || 'N/A'}</p>
//                           </div>
//                         </td>

//                         {isVisit ? (
//                           <>
//                             <td className="px-3 py-2">
//                               <span className="text-xs font-medium text-gray-700">{b.startDate || b.date || 'N/A'}</span>
//                             </td>
//                             <td className="px-3 py-2">
//                               <span className="text-xs font-medium text-gray-700">{fromTimeIndian}</span>
//                             </td>
//                             <td className="px-3 py-2">
//                               <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${status.color}`}>{status.label}</span>
//                             </td>
//                             <td className="px-3 py-2">
//                               <span className="text-[10px] text-gray-500 font-medium">{formatDateTime(b.createdAt)}</span>
//                             </td>
//                             <td className="px-3 py-2 text-center">
//                               <div className="flex items-center justify-center gap-1">
//                                 <button
//                                   onClick={() => handleViewBooking(b)}
//                                   className="p-1 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition"
//                                   title="View"
//                                 >
//                                   <Eye size={13} />
//                                 </button>
//                               </div>
//                             </td>
//                           </>
//                         ) : (
//                           <>
//                             <td className="px-3 py-2">
//                               <div>
//                                 <span className="text-xs font-medium text-gray-700">{b.startDate || b.date || 'N/A'}</span>
//                                 <p className="text-[9px] text-indigo-600 font-medium">{fromTimeIndian}</p>
//                               </div>
//                             </td>
//                             <td className="px-3 py-2">
//                               <div>
//                                 <span className="text-xs font-medium text-gray-700">{b.endDate || b.startDate || b.date || 'N/A'}</span>
//                                 <p className="text-[9px] text-indigo-600 font-medium">{toTimeIndian}</p>
//                               </div>
//                             </td>
//                             <td className="px-3 py-2">
//                               <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full text-[9px] font-bold">{b.totalHours}h</span>
//                             </td>
//                             <td className="px-3 py-2">
//                               <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full text-[9px] font-bold">{totalDays}d</span>
//                             </td>
//                             <td className="px-3 py-2">
//                               <span className="flex items-center gap-1 text-xs font-medium text-gray-700">
//                                 <Armchair size={12} className="text-indigo-500" />
//                                 {seatCount}
//                               </span>
//                             </td>
//                             <td className="px-3 py-2">
//                               <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${status.color}`}>{status.label}</span>
//                             </td>
//                             <td className="px-3 py-2">
//                               <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${pmtMethod.color}`}>{pmtMethod.label}</span>
//                               <span className={`ml-1 px-2 py-0.5 text-[9px] font-bold rounded-full ${pmtStatus.color}`}>{pmtStatus.label}</span>
//                             </td>
//                             <td className="px-3 py-2">
//                               <span className="text-xs font-bold text-indigo-600">₹{b.totalPrice || b.amount || 0}</span>
//                               {b.extraCharge > 0 && (
//                                 <p className="text-[8px] text-amber-500">+₹{b.extraCharge} seat</p>
//                               )}
//                             </td>
//                             <td className="px-3 py-2">
//                               <span className="text-[10px] text-gray-500 font-medium">{formatDateTime(b.createdAt)}</span>
//                             </td>
//                             <td className="px-3 py-2 text-center">
//                               <div className="flex items-center justify-center gap-1 flex-wrap">
//                                 <button
//                                   onClick={() => handleViewBooking(b)}
//                                   className="p-1 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition"
//                                   title="View"
//                                 >
//                                   <Eye size={13} />
//                                 </button>
//                                 <button
//                                   onClick={() => downloadInvoice(b)}
//                                   className="p-1 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition"
//                                   title="Invoice"
//                                 >
//                                   <FileDown size={13} />
//                                 </button>
//                                 {canReplace && (
//                                   <button
//                                     onClick={() => {
//                                       setReplaceBooking(b);
//                                       setSelectedChamber("");
//                                       setSelectedChamberData(null);
//                                       setShowReplaceModal(true);
//                                     }}
//                                     className="p-1 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition"
//                                     title="Replace Space"
//                                   >
//                                     <RefreshCw size={13} />
//                                   </button>
//                                 )}
//                                 {canCancel && (
//                                   <button
//                                     onClick={() => {
//                                       setCancelBooking(b);
//                                       setShowCancelModal(true);
//                                     }}
//                                     className="p-1 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition"
//                                     title="Cancel Booking"
//                                   >
//                                     <XIcon size={13} />
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
//             </div>
//           )}

//           {/* Footer with stats */}
//           {!loading && displayBookings.length > 0 && (
//             <div className="px-4 py-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2" style={{ backgroundColor: '#fafafa' }}>
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
//           <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
//             <div className="sticky top-0 bg-gradient-to-br from-indigo-600 to-purple-600 text-white p-6 rounded-t-3xl flex justify-between items-center">
//               <div>
//                 <h3 className="text-2xl font-bold">Booking Details</h3>
//                 <p className="text-sm text-indigo-200 flex items-center gap-2">
//                   <Hash size={14} /> #{viewBooking._id?.slice(-8).toUpperCase()}
//                 </p>
//                 <div className="flex items-center gap-2 mt-1">
//                   <span className="px-2 py-0.5 bg-white/20 rounded-full text-[10px] font-medium">
//                     {viewBooking.bookingType === 'visit' ? 'Site Visit' : 'Chamber Booking'}
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
//               {/* ===== BASIC INFO ===== */}
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//                 <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
//                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Booking ID</p>
//                   <p className="mt-1 font-mono text-sm font-semibold text-gray-800">{viewBooking._id?.slice(-8).toUpperCase()}</p>
//                 </div>
//                 <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
//                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Type</p>
//                   <span className={`mt-1 inline-block px-3 py-1 text-xs font-bold rounded-full ${viewBooking.bookingType === 'visit' ? 'bg-purple-100 text-purple-700' : 'bg-indigo-100 text-indigo-700'}`}>
//                     {viewBooking.bookingType === 'visit' ? 'Site Visit' : 'Chamber Booking'}
//                   </span>
//                 </div>
//                 <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
//                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Basis</p>
//                   <span className="mt-1 inline-block px-3 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-700 capitalize">
//                     {viewBooking.bookingBasis || 'Hourly'}
//                   </span>
//                 </div>
//                 <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
//                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Terms</p>
//                   <span className={`mt-1 inline-block px-3 py-1 text-xs font-bold rounded-full ${getTermsBadge(viewBooking.termsAccepted).color}`}>
//                     {viewBooking.termsAccepted ? 'Accepted' : 'Not Accepted'}
//                   </span>
//                 </div>
//               </div>

//               {/* ===== CABIN & SPACE TYPE ===== */}
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
//                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
//                     <Building2 size={12} /> Chamber
//                   </p>
//                   <p className="mt-1 font-semibold text-gray-800 text-sm">{viewBooking.cabin?.name || viewBooking.chamberName || 'N/A'}</p>
//                   <p className="text-xs text-gray-400 flex items-center gap-0.5 mt-0.5">
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
//                     <p><span className="font-medium">Owner:</span> {viewBooking.cabin?.owner?.name || 'N/A'}</p>
//                   </div>
//                 </div>
//               </div>

//               {/* ===== USER DETAILS ===== */}
//               <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
//                 <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1">
//                   <User size={12} /> User Details
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
//                   <p className="text-sm font-bold text-indigo-600">{convertToIndianTime(viewBooking.startTime)}</p>
//                 </div>
//                 <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
//                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
//                     <CalendarDays size={12} /> End
//                   </p>
//                   <p className="mt-1 font-semibold text-gray-800">{formatDateIndian(viewBooking.endDate)}</p>
//                   <p className="text-sm font-bold text-indigo-600">{convertToIndianTime(viewBooking.endTime)}</p>
//                 </div>
//               </div>

//               {/* ===== BOOKING INFO ===== */}
//               <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
//                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
//                   <Info size={12} /> Booking Info
//                 </p>
//                 <div className="mt-2 flex flex-wrap items-center gap-2">
//                   <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold">
//                     {viewBooking.totalHours}h Total
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

//               {/* ===== STATUS & PAYMENT ===== */}
//               <div className="grid grid-cols-3 gap-3">
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
//               </div>

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

//               {/* ===== TRANSACTION IDs ===== */}
//               <div className="grid grid-cols-2 gap-3">
//                 <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
//                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Transaction ID</p>
//                   <p className="mt-1 font-mono text-xs text-gray-700 break-all">{viewBooking.transactionId || 'N/A'}</p>
//                 </div>
//                 <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
//                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Razorpay Order ID</p>
//                   <p className="mt-1 font-mono text-xs text-gray-700 break-all">{viewBooking.razorpayOrderId || 'N/A'}</p>
//                 </div>
//               </div>

//               {/* ===== CHECK-IN/CHECK-OUT ===== */}
//               {(viewBooking.checkInTime || viewBooking.checkOutTime) && (
//                 <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
//                   <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
//                     <Timer size={14} /> Check-in/Check-out
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

//               {/* ===== EXTENSION ===== */}
//               {viewBooking.isExtended && (
//                 <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
//                   <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider flex items-center gap-2">
//                     <ClockIcon size={14} />
//                     Booking Extended
//                   </p>
//                   <div className="grid grid-cols-2 gap-2 mt-1">
//                     <div>
//                       <p className="text-[10px] text-gray-400">Extension Details</p>
//                       <p className="text-sm font-medium text-gray-700">{viewBooking.extensionDetails || 'N/A'}</p>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* ===== CANCELLATION ===== */}
//               {viewBooking.status === 'cancelled' && (
//                 <div className="p-4 bg-red-50 rounded-xl border border-red-200">
//                   <p className="text-[10px] font-bold text-red-600 uppercase tracking-wider flex items-center gap-2">
//                     <AlertTriangle size={14} />
//                     Cancelled
//                   </p>
//                   <div className="grid grid-cols-2 gap-2 mt-1">
//                     <div>
//                       <p className="text-[10px] text-gray-400">Cancelled At</p>
//                       <p className="text-sm font-medium text-gray-700">{viewBooking.cancelledAt ? formatDateTime(viewBooking.cancelledAt) : 'N/A'}</p>
//                     </div>
//                     <div>
//                       <p className="text-[10px] text-gray-400">Reason</p>
//                       <p className="text-sm font-medium text-gray-700">{viewBooking.cancellationReason || 'N/A'}</p>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* ===== REVIEW & RATING ===== */}
//               {(viewBooking.review || viewBooking.rating) && (
//                 <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
//                   <p className="text-[10px] font-bold text-yellow-600 uppercase tracking-wider flex items-center gap-2">
//                     <Star size={14} />
//                     Review
//                   </p>
//                   <div className="mt-1">
//                     <div className="flex items-center gap-2">
//                       <span className="text-sm font-bold text-yellow-600">{viewBooking.rating} ⭐</span>
//                       <span className="text-sm text-gray-700">{viewBooking.review}</span>
//                     </div>
//                   </div>
//                 </div>
//               )}

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
//                           <span className="text-xs font-medium text-emerald-600">IN: {convertToIndianTime(timing.checkIn)}</span>
//                           <span className="text-xs font-medium text-red-500">OUT: {convertToIndianTime(timing.checkOut)}</span>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* ===== NOTIFICATIONS ===== */}
//               {viewBooking.notifications && (
//                 <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
//                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
//                     <Bell size={12} /> Notifications
//                   </p>
//                   <div className="mt-2 flex flex-wrap gap-2">
//                     <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${viewBooking.notifications.bookingConfirmed ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'}`}>
//                       {viewBooking.notifications.bookingConfirmed ? '✅ Confirmed' : '❌ Not Confirmed'}
//                     </span>
//                     <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${viewBooking.notifications.paymentReceived ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'}`}>
//                       {viewBooking.notifications.paymentReceived ? '✅ Payment' : '❌ No Payment'}
//                     </span>
//                     <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${viewBooking.notifications.reminderSent ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'}`}>
//                       {viewBooking.notifications.reminderSent ? '✅ Reminder' : '❌ No Reminder'}
//                     </span>
//                   </div>
//                 </div>
//               )}

//               {/* ===== CREATED AT ===== */}
//               <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
//                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
//                   <CalendarPlus size={12} /> Booked On
//                 </p>
//                 <p className="mt-1 font-semibold text-gray-800">{formatDateTime(viewBooking.createdAt)}</p>
//               </div>

//               {/* ===== ACTIONS ===== */}
//               <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-200">
//                 <button
//                   onClick={() => { setShowViewModal(false); downloadInvoice(viewBooking); }}
//                   className="flex-1 min-w-[120px] py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-sm active:scale-[0.98]"
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

//       {/* Replace Modal */}
//       {showReplaceModal && replaceBooking && (
//         <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowReplaceModal(false)}>
//           <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
//             <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-5 rounded-t-3xl flex justify-between items-center shrink-0">
//               <div>
//                 <h3 className="text-xl font-bold">Replace Space</h3>
//                 <p className="text-sm text-blue-200">{replaceBooking.cabin?.name || replaceBooking.chamberName} → New Space</p>
//               </div>
//               <button onClick={() => setShowReplaceModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
//                 <X size={20} />
//               </button>
//             </div>
//             <div className="p-5 space-y-4 overflow-y-auto flex-1">
//               <div className="bg-blue-50 rounded-xl p-4 text-sm">
//                 <p className="font-bold text-blue-800">Current Booking</p>
//                 <p className="text-slate-600 mt-1">{replaceBooking.cabin?.name || replaceBooking.chamberName}</p>
//                 <p className="text-xs text-slate-500">From: {replaceBooking.startDate || replaceBooking.date} {convertToIndianTime(replaceBooking.startTime || replaceBooking.time)}</p>
//                 <p className="text-xs text-slate-500">To: {replaceBooking.endDate || replaceBooking.startDate || replaceBooking.date} {convertToIndianTime(replaceBooking.endTime)}</p>
//                 <p className="text-xs font-bold text-slate-700 mt-1">Total: ₹{replaceBooking.totalPrice || replaceBooking.amount}</p>
//                 {replaceBooking.totalDays > 0 && (
//                   <p className="text-xs text-slate-500">{replaceBooking.totalDays} days • {replaceBooking.totalHours}h total</p>
//                 )}
//               </div>

//               <div>
//                 <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Select New Chamber</label>
//                 <div className="relative">
//                   <select
//                     value={selectedChamber}
//                     onChange={(e) => setSelectedChamber(e.target.value)}
//                     className="w-full p-3 pr-10 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
//                   >
//                     <option value="">Select a chamber...</option>
//                     {allChambers
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

//               {selectedChamberData && priceDiff && (
//                 <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-3">
//                   <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Price Comparison</p>

//                   <div className="grid grid-cols-2 gap-2 text-sm">
//                     <div className="bg-blue-50 rounded-lg p-3">
//                       <p className="text-[10px] text-blue-600 font-medium">Current Chamber</p>
//                       <p className="font-bold text-slate-800">₹{replaceBooking.cabin?.price || 0}/hr</p>
//                       <p className="text-xs text-slate-500">{replaceBooking.totalHours}h = ₹{replaceBooking.totalPrice || replaceBooking.amount}</p>
//                     </div>
//                     <div className="bg-emerald-50 rounded-lg p-3">
//                       <p className="text-[10px] text-emerald-600 font-medium">New Chamber</p>
//                       <p className="font-bold text-slate-800">₹{selectedChamberData.price}/hr</p>
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
//                 disabled={replaceLoading || !selectedChamber}
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
//                 <p className="text-sm text-red-200">{cancelBooking.cabin?.name || cancelBooking.chamberName}</p>
//               </div>
//               <button onClick={() => setShowCancelModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
//                 <X size={20} />
//               </button>
//             </div>
//             <div className="p-5 space-y-4">
//               <div className="bg-red-50 rounded-xl p-4 text-sm">
//                 <p className="font-bold text-red-800">Are you sure you want to cancel this booking?</p>
//                 <div className="mt-2 space-y-1 text-slate-600">
//                   <p><span className="text-slate-500">Chamber:</span> {cancelBooking.cabin?.name || cancelBooking.chamberName}</p>
//                   <p><span className="text-slate-500">From:</span> {cancelBooking.startDate || cancelBooking.date} {convertToIndianTime(cancelBooking.startTime || cancelBooking.time)}</p>
//                   <p><span className="text-slate-500">To:</span> {cancelBooking.endDate || cancelBooking.startDate || cancelBooking.date} {convertToIndianTime(cancelBooking.endTime)}</p>
//                   <p><span className="text-slate-500">Total:</span> ₹{cancelBooking.totalPrice || cancelBooking.amount}</p>
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

// export default BookingDoctor;





// DoctorBookings.jsx - Complete with ALL Fields from API Response (MATCHES SimpleUserBookings UI EXACTLY)
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
//   Plus,
//   Calendar as CalendarIcon,
//   Stethoscope,
//   Briefcase,
//   Clock as ClockIcon,
//   Layers,
//   Hash,
//   MessageSquare,
//   Star,
//   Check,
//   AlertTriangle,
//   Wallet,
//   CalendarDays,
//   Info,
//   Timer,
//   History,
//   Bell,
//   CalendarPlus,
//   Calculator,
//   Ticket
// } from "lucide-react";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import DoctorNavbar from "./DoctorNavbar";
// import * as XLSX from 'xlsx';
// import "./Dashboard.css";

// const API_URL = "https://spaceapi.iryax.com";

// const BookingDoctor = () => {
//   const [bookings, setBookings] = useState([]);
//   const [allChambers, setAllChambers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterDate, setFilterDate] = useState("");
//   const [filters, setFilters] = useState({
//     status: 'all',
//     paymentStatus: 'all'
//   });
//   const [activeTab, setActiveTab] = useState('all');
//   const navigate = useNavigate();

//   const [showViewModal, setShowViewModal] = useState(false);
//   const [viewBooking, setViewBooking] = useState(null);

//   const [showReplaceModal, setShowReplaceModal] = useState(false);
//   const [replaceBooking, setReplaceBooking] = useState(null);
//   const [selectedChamber, setSelectedChamber] = useState("");
//   const [replaceLoading, setReplaceLoading] = useState(false);
//   const [selectedChamberData, setSelectedChamberData] = useState(null);

//   const [showCancelModal, setShowCancelModal] = useState(false);
//   const [cancelBooking, setCancelBooking] = useState(null);
//   const [cancelLoading, setCancelLoading] = useState(false);

//   const currentUser = (() => {
//     try {
//       const u = localStorage.getItem("doctor");
//       if (u) return JSON.parse(u);
//       return null;
//     } catch (err) {
//       return null;
//     }
//   })();

//   const getAuthHeader = () => {
//     const token = localStorage.getItem("token");
//     return { headers: { Authorization: `Bearer ${token}` } };
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

//   const formatBookedDate = (dateString) => {
//     if (!dateString) return "N/A";
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-IN', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric'
//     });
//   };

//   const formatBookedTime = (dateString) => {
//     if (!dateString) return "N/A";
//     const date = new Date(dateString);
//     return date.toLocaleTimeString('en-IN', {
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: true
//     });
//   };

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
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         toast.error("Please login to view your bookings");
//         navigate("/login");
//         return;
//       }

//       const res = await axios.get(
//         `${API_URL}/api/bookings/user`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       const bookingsData = res.data.bookings || [];
//       setBookings(bookingsData);

//       if (bookingsData.length === 0) {
//         toast.info("You have no bookings yet");
//       }

//     } catch (error) {
//       console.error("Error fetching bookings:", error);
//       if (error.response?.status === 401) {
//         toast.error("Session expired. Please login again.");
//         localStorage.removeItem("token");
//         localStorage.removeItem("doctor");
//         navigate("/login");
//       } else {
//         toast.error("Failed to fetch bookings: " + (error.response?.data?.error || error.message));
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchChambers = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) return;
//       const res = await axios.get(`${API_URL}/api/cabins`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       const activeChambers = res.data.filter(c => c.isActive === true);
//       setAllChambers(activeChambers);
//     } catch (error) {
//       console.error("Failed to fetch chambers:", error);
//     }
//   };

//   useEffect(() => {
//     fetchBookings();
//     fetchChambers();
//   }, []);

//   useEffect(() => {
//     if (selectedChamber && replaceBooking) {
//       const chamber = allChambers.find(c => c._id === selectedChamber);
//       setSelectedChamberData(chamber || null);
//     } else {
//       setSelectedChamberData(null);
//     }
//   }, [selectedChamber, allChambers, replaceBooking]);

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

//   const getSlotsDisplay = (slots) => {
//     if (!slots || slots.length === 0) return 'N/A';
//     return slots.map(s => `${formatDate(s.date)} ${s.startTime}-${s.endTime} (${s.hours}h)`).join(' | ');
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
//         'Chamber': b.cabin?.name || b.chamberName || 'Unknown',
//         'Space Type': b.cabin?.isChamber ? 'Medical' : 'Co-Working',
//         'User': b.name || b.patientName || 'N/A',
//         'Mobile': b.mobile || b.patientMobile || 'N/A',
//         'Email': b.email || b.patientEmail || 'N/A',
//         'From Date': b.startDate || b.date || 'N/A',
//         'To Date': b.endDate || 'N/A',
//         'From Time': convertToIndianTime(b.startTime || b.time),
//         'To Time': convertToIndianTime(b.endTime),
//         'Total Hours': b.totalHours || 0,
//         'Total Days': b.totalDays || 0,
//         'Daily Hours': b.dailyHours?.join(', ') || 'N/A',
//         'Slots': getSlotsDisplay(b.bookingSlots),
//         'Seats': b.seatCount || 0,
//         'Seat Names': b.selectedSeats?.map(s => s.name).join(', ') || 'N/A',
//         'Extra Charge': b.extraCharge || 0,
//         'Subtotal': b.subtotal || 0,
//         'GST': b.gstAmount || 0,
//         'GST Rate': `${(b.gstRate || 0.18) * 100}%`,
//         'Total (₹)': b.totalPrice || b.amount || 0,
//         'Status': getStatusBadge(b.status).label,
//         'Payment': getPaymentMethodBadge(b.paymentMethod).label,
//         'Pmt Status': getPaymentStatusBadge(b.paymentStatus).label,
//         'Terms': b.termsAccepted ? 'Yes' : 'No',
//         'Transaction ID': b.transactionId || 'N/A',
//         'Razorpay Order': b.razorpayOrderId || 'N/A',
//         'Payment Mode': b.paymentDetails?.mode || 'N/A',
//         'Payment Date': b.paymentDetails?.paymentDate ? formatDate(b.paymentDetails.paymentDate) : 'N/A',
//         'UPI ID': b.paymentDetails?.upiId || 'N/A',
//         'UPI App': b.paymentDetails?.upiApp || 'N/A',
//         'Screenshot': b.paymentDetails?.screenshot ? 'Yes' : 'No',
//         'Check-in': b.checkInTime || 'N/A',
//         'Check-out': b.checkOutTime || 'N/A',
//         'Actual Check-in': b.actualCheckIn || 'N/A',
//         'Actual Check-out': b.actualCheckOut || 'N/A',
//         'Is Extended': b.isExtended ? 'Yes' : 'No',
//         'Cancelled At': b.cancelledAt ? formatDateTime(b.cancelledAt) : 'N/A',
//         'Cancellation Reason': b.cancellationReason || 'N/A',
//         'Review': b.review || 'N/A',
//         'Rating': b.rating || 'N/A',
//         'Booked On': b.createdAt ? formatDateTime(b.createdAt) : 'N/A'
//       }));
//       const ws = XLSX.utils.json_to_sheet(data);
//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, 'Bookings');
//       XLSX.writeFile(wb, `doctor_bookings_${new Date().toISOString().split('T')[0]}.xlsx`);
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
//     if (!selectedChamber) {
//       toast.error("Please select a chamber to replace");
//       return;
//     }

//     setReplaceLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.put(
//         `${API_URL}/api/bookings/replace-booking/${replaceBooking._id}`,
//         { newCabinId: selectedChamber },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (response.data.success) {
//         toast.success("Booking replaced successfully!");
//         setShowReplaceModal(false);
//         setReplaceBooking(null);
//         setSelectedChamber("");
//         setSelectedChamberData(null);
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
//           `<div style="display:inline-block;background:#eff6ff;padding:3px 12px;border-radius:8px;margin:3px;font-size:10px;border:1px solid #93c5fd;">
//             ${formatDate(s.date)} ${s.startTime}-${s.endTime} (${s.hours}h)
//           </div>`
//         ).join('');
//       }

//       win.document.write(`
//         <html><head><title>Invoice</title>
//         <style>
//           body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: auto; }
//           .header { border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 20px; display: flex; justify-content: space-between; }
//           h1 { color: #1a56db; margin: 0; font-size: 24px; }
//           .info { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
//           table { width: 100%; border-collapse: collapse; margin: 20px 0; }
//           th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
//           th { background: #f8fafc; font-weight: 700; }
//           .total { font-size: 20px; font-weight: 700; text-align: right; margin-top: 20px; border-top: 2px solid #000; padding-top: 15px; }
//           .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 2px solid #000; color: #666; font-size: 12px; }
//           .badge { display: inline-block; padding: 2px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; }
//           .seat-section, .slot-section { margin: 10px 0; padding: 10px; background: #f8fafc; border-radius: 8px; }
//           .meta-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin: 10px 0; }
//         </style>
//         </head><body>
//           <div class="header">
//             <div><h1>${(owner.organizationName || 'IRYAX SPACE').toUpperCase()}</h1>
//             <p>GST: ${owner.gstNumber || 'N/A'}</p></div>
//             <div><p><strong>Invoice #${booking._id?.slice(-8).toUpperCase() || 'N/A'}</strong></p>
//             <p>${new Date().toLocaleDateString()}</p></div>
//           </div>
//           <div class="info">
//             <div><strong>User:</strong><br>${booking.name || booking.patientName || 'User'}<br>${booking.mobile || booking.patientMobile || 'N/A'}<br>${booking.email || booking.patientEmail || 'N/A'}</div>
//             <div><strong>Chamber:</strong><br>${cabin.name || booking.chamberName || 'Unknown'}<br>${cabin.address || 'N/A'}</div>
//           </div>
//           ${booking.bookingSlots && booking.bookingSlots.length > 0 ? `
//             <div class="slot-section">
//               <strong>Booking Slots (${booking.totalDays} days, ${booking.totalHours}h total):</strong>
//               <div style="margin-top:5px;">${slotsHtml}</div>
//               <div style="margin-top:5px;font-size:12px;color:#666;">Daily Hours: ${booking.dailyHours?.join(', ')}h</div>
//             </div>
//           ` : ''}
//           ${booking.selectedSeats && booking.selectedSeats.length > 0 ? `
//             <div class="seat-section">
//               <strong>Selected Seats:</strong>
//               <div style="margin-top:5px;">${seatListHtml}</div>
//               <div style="margin-top:5px;font-size:12px;color:#666;">Total: ${booking.seatCount} seats • Extra Charge: ₹${booking.extraCharge || 0}</div>
//             </div>
//           ` : ''}
//           <table>
//             <tr><th>Description</th><th>Details</th><th>Amount</th></tr>
//             <tr><td><strong>${cabin.name || booking.chamberName || 'Chamber Booking'}</strong></td>
//             <td>${booking.startDate || booking.date} ${convertToIndianTime(booking.startTime || booking.time)} - ${booking.endDate} ${convertToIndianTime(booking.endTime)}<br>${booking.totalHours}h • ${booking.totalDays || 0} days • ${booking.bookingBasis === 'plan' ? 'Plan' : 'Hourly'}</td>
//             <td>₹${(booking.subtotal || 0).toFixed(2)}</td></tr>
//             ${booking.extraCharge > 0 ? `
//             <tr><td><strong>Seat Charges</strong></td>
//             <td>${booking.seatCount} seats × ₹${booking.seatExtraChargePerSeat || 100}</td>
//             <td>₹${(booking.extraCharge || 0).toFixed(2)}</td></tr>
//             ` : ''}
//           </table>
//           <div class="meta-grid">
//             <span><strong>Payment:</strong> <span class="badge ${getPaymentMethodBadge(booking.paymentMethod).color.replace('bg-','bg-')}">${getPaymentMethodBadge(booking.paymentMethod).label}</span></span>
//             <span><strong>Status:</strong> <span class="badge ${getStatusBadge(booking.status).color}">${getStatusBadge(booking.status).label}</span></span>
//             <span><strong>Pmt Status:</strong> <span class="badge ${getPaymentStatusBadge(booking.paymentStatus).color}">${getPaymentStatusBadge(booking.paymentStatus).label}</span></span>
//           </div>
//           <div class="total">Subtotal: ₹${(booking.subtotal || 0).toFixed(2)}<br>${booking.extraCharge > 0 ? `Seat Charges: ₹${(booking.extraCharge || 0).toFixed(2)}<br>` : ''}GST (${(booking.gstRate || 0.18) * 100}%): ₹${(booking.gstAmount || 0).toFixed(2)}<br>Total: ₹${(booking.totalPrice || 0).toFixed(2)}</div>
//           <div class="footer">Powered by IRYAX SPACE<br>Booked On: ${formatDateTime(booking.createdAt)}<br>Booking ID: ${booking._id}</div>
//         </body></html>
//       `);
//       win.document.close();
//       win.focus();
//       toast.success('Invoice opened! Click Print to save as PDF.');
//     } catch (error) {
//       toast.error('Failed to generate invoice');
//     }
//   };

//   // FILTERED BOOKINGS with search - matching SimpleUserBookings
//   const filteredBookings = bookings.filter((b) => {
//     const search = searchTerm.toLowerCase();
//     const matchSearch = b.cabin?.name?.toLowerCase().includes(search) ||
//                         b.cabin?.address?.toLowerCase().includes(search) ||
//                         b.name?.toLowerCase().includes(search) ||
//                         b.mobile?.includes(searchTerm) ||
//                         b.patientName?.toLowerCase().includes(search) ||
//                         b.patientMobile?.includes(searchTerm) ||
//                         b.chamberName?.toLowerCase().includes(search);
//     const matchDate = filterDate ? b.startDate === filterDate : true;
//     const matchStatus = filters.status === 'all' || b.status === filters.status;
//     const matchPaymentStatus = filters.paymentStatus === 'all' || b.paymentStatus === filters.paymentStatus;
//     return matchSearch && matchDate && matchStatus && matchPaymentStatus;
//   });

//   const filteredVisitBookings = filteredBookings.filter(b => b.bookingType === 'visit');
//   const filteredChamberBookings = filteredBookings.filter(b => b.bookingType !== 'visit');

//   const getFilteredByTab = () => {
//     if (activeTab === 'visits') {
//       return filteredBookings.filter(b => b.bookingType === 'visit');
//     } else if (activeTab === 'chambers') {
//       return filteredBookings.filter(b => b.bookingType !== 'visit');
//     } else {
//       return filteredBookings;
//     }
//   };

//   const displayBookings = getFilteredByTab();

//   const totalCount = bookings.length;
//   const activeCount = bookings.filter(b => b.status === 'active' || b.status === 'confirmed').length;
//   const pendingCount = bookings.filter(b => b.status === 'pending').length;
//   const completedCount = bookings.filter(b => b.status === 'completed').length;
//   const cancelledCount = bookings.filter(b => b.status === 'cancelled').length;
//   const visitCount = bookings.filter(b => b.bookingType === 'visit').length;
//   const chamberCount = bookings.filter(b => b.bookingType !== 'visit').length;

//   const getPriceDifference = () => {
//     if (!replaceBooking || !selectedChamberData) return null;

//     const currentPrice = replaceBooking.totalPrice || 0;
//     const newPrice = selectedChamberData.price || 0;
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
//       paymentStatus: 'all'
//     });
//     setSearchTerm('');
//     setFilterDate('');
//   };

//   // Stats for cards - matching SimpleUserBookings
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
//       onClick: () => setFilters({ status: 'all', paymentStatus: 'all' })
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
//         <DoctorNavbar />
//         <div className="flex justify-center items-center h-64">
//           <div className="w-12 h-12 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin" />
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="admin-dash" style={{ backgroundColor: '#ffffff' }}>
//       <DoctorNavbar />

//       <div className="pt-20 px-3 sm:px-4 md:px-6 lg:px-8 max-w-full mx-auto pb-16">
//         {/* Header */}
//         <div className="admin-dash__header" style={{ marginBottom: '8px' }}>
//           <div>
//             <h1 className="admin-dash__greeting" style={{ fontSize: '1.25rem' }}>
//               Doctor <span>Bookings</span>
//             </h1>
//             <p className="admin-dash__subtitle" style={{ fontSize: '11px' }}>
//               Manage all your chamber and site visit bookings
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
//             <button
//               onClick={() => navigate("/mychambers")}
//               className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 transition shadow-sm shadow-indigo-200"
//             >
//               <Building2 size={14} />
//               My Chambers
//             </button>
//           </div>
//         </div>

//         {/* Stats Cards - Same as SimpleUserBookings */}
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

//         {/* Filters - Exactly same as SimpleUserBookings */}
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
//                 <option value="chambers">Chamber Bookings ({chamberCount})</option>
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
//               </select>
//               {(filters.status !== 'all' || filters.paymentStatus !== 'all' || filterDate || searchTerm) && (
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

//         {/* Tab Buttons - Clean design matching SimpleUserBookings */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-1 mb-4 flex">
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
//             onClick={() => setActiveTab('chambers')}
//             className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
//               activeTab === 'chambers'
//                 ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-200'
//                 : 'text-gray-500 hover:bg-gray-50'
//             }`}
//           >
//             Chamber Bookings
//             <span className={`ml-1.5 px-1.5 py-0.5 text-[9px] rounded-full ${
//               activeTab === 'chambers' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
//             }`}>
//               {chamberCount}
//             </span>
//           </button>
//         </div>

//         {/* ✅ RENDER BASED ON ACTIVE TAB - Same as SimpleUserBookings */}
//         {activeTab === 'all' && (
//           <>
//             {filteredVisitBookings.length > 0 && renderVisitTable(filteredVisitBookings)}
//             {filteredChamberBookings.length > 0 && renderChamberTable(filteredChamberBookings)}
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

//         {activeTab === 'visits' && renderVisitTable(displayBookings)}

//         {activeTab === 'chambers' && renderChamberTable(displayBookings)}

//         {/* Footer */}
//         <div className="mt-6 text-center text-[9px] text-gray-400 font-medium tracking-wider">
//           © IRYAX SPACE — All Rights Reserved
//         </div>
//       </div>

//       {/* ============================================================ */}
//       {/* VIEW MODAL - Keep as is */}
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
//           <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
//             <div className="sticky top-0 bg-gradient-to-br from-indigo-600 to-purple-600 text-white p-6 rounded-t-3xl flex justify-between items-center">
//               <div>
//                 <h3 className="text-2xl font-bold">Booking Details</h3>
//                 <p className="text-sm text-indigo-200 flex items-center gap-2">
//                   <Hash size={14} /> #{viewBooking._id?.slice(-8).toUpperCase()}
//                 </p>
//                 <div className="flex items-center gap-2 mt-1">
//                   <span className="px-2 py-0.5 bg-white/20 rounded-full text-[10px] font-medium">
//                     {viewBooking.bookingType === 'visit' ? 'Site Visit' : 'Chamber Booking'}
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
//               {/* All view modal content - keep as is */}
//               {/* ... (same as before) ... */}
              
//               {/* ACTIONS */}
//               <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-200">
//                 <button
//                   onClick={() => { setShowViewModal(false); downloadInvoice(viewBooking); }}
//                   className="flex-1 min-w-[120px] py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-sm active:scale-[0.98]"
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
//                 <p className="text-sm text-blue-200">{replaceBooking.cabin?.name || replaceBooking.chamberName} → New Space</p>
//               </div>
//               <button onClick={() => setShowReplaceModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
//                 <X size={20} />
//               </button>
//             </div>
//             <div className="p-5 space-y-4 overflow-y-auto flex-1">
//               <div className="bg-blue-50 rounded-xl p-4 text-sm">
//                 <p className="font-bold text-blue-800">Current Booking</p>
//                 <p className="text-slate-600 mt-1">{replaceBooking.cabin?.name || replaceBooking.chamberName}</p>
//                 <p className="text-xs text-slate-500">{formatDateIndian(replaceBooking.startDate)} {convertToIndianTime(replaceBooking.startTime)} - {formatDateIndian(replaceBooking.endDate)} {convertToIndianTime(replaceBooking.endTime)}</p>
//                 <p className="text-xs font-bold text-slate-700 mt-1">Total: ₹{replaceBooking.totalPrice || replaceBooking.amount}</p>
//                 {replaceBooking.totalDays > 0 && (
//                   <p className="text-xs text-slate-500">{replaceBooking.totalDays} days • {replaceBooking.totalHours}h total</p>
//                 )}
//               </div>

//               <div>
//                 <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Select New Chamber</label>
//                 <div className="relative">
//                   <select
//                     value={selectedChamber}
//                     onChange={(e) => setSelectedChamber(e.target.value)}
//                     className="w-full p-3 pr-10 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
//                   >
//                     <option value="">Select a chamber...</option>
//                     {allChambers
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

//               {selectedChamberData && priceDiff && (
//                 <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-3">
//                   <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Price Comparison</p>

//                   <div className="grid grid-cols-2 gap-2 text-sm">
//                     <div className="bg-blue-50 rounded-lg p-3">
//                       <p className="text-[10px] text-blue-600 font-medium">Current Chamber</p>
//                       <p className="font-bold text-slate-800">₹{replaceBooking.cabin?.price || 0}/hr</p>
//                       <p className="text-xs text-slate-500">{replaceBooking.totalHours}h = ₹{replaceBooking.totalPrice || replaceBooking.amount}</p>
//                     </div>
//                     <div className="bg-emerald-50 rounded-lg p-3">
//                       <p className="text-[10px] text-emerald-600 font-medium">New Chamber</p>
//                       <p className="font-bold text-slate-800">₹{selectedChamberData.price}/hr</p>
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
//                 disabled={replaceLoading || !selectedChamber}
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
//                 <p className="text-sm text-red-200">{cancelBooking.cabin?.name || cancelBooking.chamberName}</p>
//               </div>
//               <button onClick={() => setShowCancelModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
//                 <X size={20} />
//               </button>
//             </div>
//             <div className="p-5 space-y-4">
//               <div className="bg-red-50 rounded-xl p-4 text-sm">
//                 <p className="font-bold text-red-800">Are you sure you want to cancel this booking?</p>
//                 <div className="mt-2 space-y-1 text-slate-600">
//                   <p><span className="text-slate-500">Chamber:</span> {cancelBooking.cabin?.name || cancelBooking.chamberName}</p>
//                   <p><span className="text-slate-500">Start:</span> {formatDateIndian(cancelBooking.startDate)} {convertToIndianTime(cancelBooking.startTime)}</p>
//                   <p><span className="text-slate-500">End:</span> {formatDateIndian(cancelBooking.endDate)} {convertToIndianTime(cancelBooking.endTime)}</p>
//                   <p><span className="text-slate-500">Total:</span> ₹{cancelBooking.totalPrice || cancelBooking.amount}</p>
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

//   // ✅ RENDER SITE VISIT TABLE - Same as SimpleUserBookings
//   function renderVisitTable(bookingsList) {
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
//           <table className="w-full text-left text-sm">
//             <thead>
//               <tr className="bg-gray-50 border-b border-gray-100">
//                 <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">#</th>
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
//                     <td className="px-3 py-2">
//                       <span className="font-mono text-[10px] font-bold text-indigo-600">{bookingId}</span>
//                     </td>
//                     <td className="px-3 py-2">
//                       <div>
//                         <p className="font-semibold text-gray-900 text-xs">
//                           {b.cabin?.name || b.chamberName || 'Unknown Cabin'}
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
//                       <span className="text-xs font-medium text-gray-700">{b.startDate || b.date || 'N/A'}</span>
//                     </td>
//                     <td className="px-3 py-2">
//                       <span className="text-xs font-medium text-gray-700">{convertToIndianTime(b.startTime || b.time)}</span>
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
//   }

//   // ✅ RENDER CHAMBER BOOKINGS TABLE - Same as SimpleUserBookings
//   function renderChamberTable(bookingsList) {
//     if (bookingsList.length === 0) {
//       return (
//         <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
//           <div className="flex flex-col items-center text-gray-400">
//             <Building2 size={32} className="opacity-20 mb-2" />
//             <p className="text-sm font-medium">No chamber bookings found</p>
//           </div>
//         </div>
//       );
//     }

//     return (
//       <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
//         <div className="px-4 py-3 bg-indigo-50 border-b border-gray-200 flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <Building2 size={16} className="text-indigo-600" />
//             <h3 className="font-bold text-gray-800">Chamber Bookings</h3>
//             <span className="px-2 py-0.5 bg-white/60 rounded-full text-xs font-bold text-gray-600">{bookingsList.length}</span>
//           </div>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="w-full text-left text-sm min-w-[1400px]">
//             <thead>
//               <tr className="bg-gray-50 border-b border-gray-100">
//                 <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">S. No</th>
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
//                     <td className="px-3 py-2">
//                       <div>
//                         <p className="font-semibold text-gray-900 text-xs">
//                           {b.cabin?.name || b.chamberName || 'Unknown'}
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
//                         <span className="text-xs font-medium text-gray-700">{b.startDate || b.date || 'N/A'}</span>
//                         <p className="text-[9px] text-indigo-600 font-medium">{convertToIndianTime(b.startTime || b.time)}</p>
//                       </div>
//                     </td>
//                     <td className="px-3 py-2">
//                       <div>
//                         <span className="text-xs font-medium text-gray-700">{b.endDate || b.startDate || b.date || 'N/A'}</span>
//                         <p className="text-[9px] text-indigo-600 font-medium">{convertToIndianTime(b.endTime)}</p>
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
//                       <span className="text-xs font-bold text-indigo-600">₹{b.totalPrice || b.amount || 0}</span>
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
//                               setSelectedChamber("");
//                               setSelectedChamberData(null);
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
//   }
// };

// export default BookingDoctor;








// DoctorBookings.jsx - Complete with ALL Fields (MATCHES SimpleUserBookings UI EXACTLY)
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
import DoctorNavbar from "./DoctorNavbar";
import * as XLSX from 'xlsx';
import "./Dashboard.css";

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

// ─── GET TYPE BADGE - Based ONLY on isChamber ───
const getCabinTypeBadge = (cabin) => {
  if (!cabin) return null;
  // If isChamber is true -> Medical Chamber
  if (cabin.isChamber === true) {
    return { label: 'Medical Chamber', icon: Stethoscope, className: 'bg-rose-100 text-rose-700' };
  }
  // If isChamber is false -> Co-Working Space
  return { label: 'Co-Working', icon: Briefcase, className: 'bg-blue-100 text-blue-700' };
};

const BookingDoctor = () => {
  const [bookings, setBookings] = useState([]);
  const [allChambers, setAllChambers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterType, setFilterType] = useState("all"); // all, chamber, coworking
  const [filters, setFilters] = useState({
    status: 'all',
    paymentStatus: 'all'
  });
  const [activeTab, setActiveTab] = useState('all');
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

  const currentUser = (() => {
    try {
      const u = localStorage.getItem("doctor");
      if (u) return JSON.parse(u);
      return null;
    } catch (err) {
      return null;
    }
  })();

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  // ─── UPDATED: Use dd/mm/yyyy format for datetime ───
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

  // ─── UPDATED: Use dd/mm/yyyy format ───
  const formatDateIndian = (dateStr) => {
    return formatDateToDDMMYYYY(dateStr);
  };

  const formatBookedDate = (dateString) => {
    return formatDateToDDMMYYYY(dateString);
  };

  const formatBookedTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
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
      setBookings(bookingsData);

      if (bookingsData.length === 0) {
        toast.info("You have no bookings yet");
      }

    } catch (error) {
      console.error("Error fetching bookings:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("doctor");
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
        'Chamber': b.cabin?.name || b.chamberName || 'Unknown',
        'Cabin Type': b.cabin?.isChamber ? 'Medical Chamber' : 'Co-Working',
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
        'Razorpay Order': b.razorpayOrderId || 'N/A',
        'Payment Mode': b.paymentDetails?.mode || 'N/A',
        'Payment Date': b.paymentDetails?.paymentDate ? formatDate(b.paymentDetails.paymentDate) : 'N/A',
        'UPI ID': b.paymentDetails?.upiId || 'N/A',
        'UPI App': b.paymentDetails?.upiApp || 'N/A',
        'Screenshot': b.paymentDetails?.screenshot ? 'Yes' : 'No',
        'Check-in': b.checkInTime || 'N/A',
        'Check-out': b.checkOutTime || 'N/A',
        'Actual Check-in': b.actualCheckIn || 'N/A',
        'Actual Check-out': b.actualCheckOut || 'N/A',
        'Is Extended': b.isExtended ? 'Yes' : 'No',
        'Cancelled At': b.cancelledAt ? formatDateTimeToDDMMYYYY(b.cancelledAt) : 'N/A',
        'Cancellation Reason': b.cancellationReason || 'N/A',
        'Review': b.review || 'N/A',
        'Rating': b.rating || 'N/A',
        'Booked On': b.createdAt ? formatDateTimeToDDMMYYYY(b.createdAt) : 'N/A'
      }));
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Bookings');
      XLSX.writeFile(wb, `doctor_bookings_${new Date().toISOString().split('T')[0]}.xlsx`);
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
      toast.error("Please select a chamber to replace");
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

  const downloadInvoice = (booking) => {
    try {
      const cabin = booking.cabin || {};
      const owner = cabin.owner || {};
      const win = window.open('', '_blank', 'width=800,height=600');
      if (!win) {
        toast.error('Please allow popups');
        return;
      }

      let seatListHtml = '';
      if (booking.selectedSeats && booking.selectedSeats.length > 0) {
        seatListHtml = booking.selectedSeats.map(s => 
          `<span style="display:inline-block;background:#f0fdf4;padding:2px 10px;border-radius:12px;margin:2px;font-size:11px;border:1px solid #86efac;">${s.name} (#${s.number})</span>`
        ).join('');
      }

      let slotsHtml = '';
      if (booking.bookingSlots && booking.bookingSlots.length > 0) {
        slotsHtml = booking.bookingSlots.map(s => 
          `<div style="display:inline-block;background:#eff6ff;padding:3px 12px;border-radius:8px;margin:3px;font-size:10px;border:1px solid #93c5fd;">
            ${formatDateIndian(s.date)} ${s.startTime}-${s.endTime} (${s.hours}h)
          </div>`
        ).join('');
      }

      win.document.write(`
        <html><head><title>Invoice</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: auto; }
          .header { border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 20px; display: flex; justify-content: space-between; }
          h1 { color: #1a56db; margin: 0; font-size: 24px; }
          .info { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background: #f8fafc; font-weight: 700; }
          .total { font-size: 20px; font-weight: 700; text-align: right; margin-top: 20px; border-top: 2px solid #000; padding-top: 15px; }
          .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 2px solid #000; color: #666; font-size: 12px; }
          .badge { display: inline-block; padding: 2px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; }
          .seat-section, .slot-section { margin: 10px 0; padding: 10px; background: #f8fafc; border-radius: 8px; }
          .meta-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin: 10px 0; }
        </style>
        </head><body>
          <div class="header">
            <div><h1>${(owner.organizationName || 'IRYAX SPACE').toUpperCase()}</h1>
            <p>GST: ${owner.gstNumber || 'N/A'}</p></div>
            <div><p><strong>Invoice #${booking._id?.slice(-8).toUpperCase() || 'N/A'}</strong></p>
            <p>${formatDateIndian(new Date().toISOString())}</p></div>
          </div>
          <div class="info">
            <div><strong>User:</strong><br>${booking.name || booking.patientName || 'User'}<br>${booking.mobile || booking.patientMobile || 'N/A'}<br>${booking.email || booking.patientEmail || 'N/A'}</div>
            <div><strong>Chamber:</strong><br>${cabin.name || booking.chamberName || 'Unknown'}<br>${cabin.address || 'N/A'}</div>
          </div>
          ${booking.bookingSlots && booking.bookingSlots.length > 0 ? `
            <div class="slot-section">
              <strong>Booking Slots (${booking.totalDays} days, ${booking.totalHours}h total):</strong>
              <div style="margin-top:5px;">${slotsHtml}</div>
              <div style="margin-top:5px;font-size:12px;color:#666;">Daily Hours: ${booking.dailyHours?.join(', ')}h</div>
            </div>
          ` : ''}
          ${booking.selectedSeats && booking.selectedSeats.length > 0 ? `
            <div class="seat-section">
              <strong>Selected Seats:</strong>
              <div style="margin-top:5px;">${seatListHtml}</div>
              <div style="margin-top:5px;font-size:12px;color:#666;">Total: ${booking.seatCount} seats • Extra Charge: ₹${booking.extraCharge || 0}</div>
            </div>
          ` : ''}
          <table>
            <tr><th>Description</th><th>Details</th><th>Amount</th></tr>
            <tr><td><strong>${cabin.name || booking.chamberName || 'Chamber Booking'}</strong></td>
            <td>${formatDateIndian(booking.startDate || booking.date)} ${convertToIndianTime(booking.startTime || booking.time)} - ${formatDateIndian(booking.endDate)} ${convertToIndianTime(booking.endTime)}<br>${booking.totalHours}h • ${booking.totalDays || 0} days • ${booking.bookingBasis === 'plan' ? 'Plan' : 'Hourly'}</td>
            <td>₹${(booking.subtotal || 0).toFixed(2)}</td></tr>
            ${booking.extraCharge > 0 ? `
            <tr><td><strong>Seat Charges</strong></td>
            <td>${booking.seatCount} seats × ₹${booking.seatExtraChargePerSeat || 100}</td>
            <td>₹${(booking.extraCharge || 0).toFixed(2)}</td></tr>
            ` : ''}
          </table>
          <div class="meta-grid">
            <span><strong>Payment:</strong> <span class="badge ${getPaymentMethodBadge(booking.paymentMethod).color.replace('bg-','bg-')}">${getPaymentMethodBadge(booking.paymentMethod).label}</span></span>
            <span><strong>Status:</strong> <span class="badge ${getStatusBadge(booking.status).color}">${getStatusBadge(booking.status).label}</span></span>
            <span><strong>Pmt Status:</strong> <span class="badge ${getPaymentStatusBadge(booking.paymentStatus).color}">${getPaymentStatusBadge(booking.paymentStatus).label}</span></span>
          </div>
          <div class="total">Subtotal: ₹${(booking.subtotal || 0).toFixed(2)}<br>${booking.extraCharge > 0 ? `Seat Charges: ₹${(booking.extraCharge || 0).toFixed(2)}<br>` : ''}GST (${(booking.gstRate || 0.18) * 100}%): ₹${(booking.gstAmount || 0).toFixed(2)}<br>Total: ₹${(booking.totalPrice || 0).toFixed(2)}</div>
          <div class="footer">Powered by IRYAX SPACE<br>Booked On: ${formatDateTimeToDDMMYYYY(booking.createdAt)}<br>Booking ID: ${booking._id}</div>
        </body></html>
      `);
      win.document.close();
      win.focus();
      toast.success('Invoice opened! Click Print to save as PDF.');
    } catch (error) {
      toast.error('Failed to generate invoice');
    }
  };

  // ─── FILTERED BOOKINGS with TYPE filter ───
  const filteredBookings = bookings.filter((b) => {
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
    
    // ─── TYPE FILTER - Based ONLY on isChamber ───
    let matchType = true;
    if (filterType === 'chamber') {
      matchType = b.cabin?.isChamber === true;
    } else if (filterType === 'coworking') {
      matchType = b.cabin?.isChamber === false || b.cabin?.isChamber === undefined;
    }
    
    return matchSearch && matchDate && matchStatus && matchPaymentStatus && matchType;
  });

  // Separate filtered lists for tabs
  const filteredVisitBookings = filteredBookings.filter(b => b.bookingType === 'visit');
  const filteredChamberBookings = filteredBookings.filter(b => b.bookingType !== 'visit');

  const getFilteredByTab = () => {
    if (activeTab === 'visits') {
      return filteredVisitBookings;
    } else if (activeTab === 'chambers') {
      return filteredChamberBookings;
    } else {
      return filteredBookings;
    }
  };

  const displayBookings = getFilteredByTab();

  const totalCount = bookings.length;
  const activeCount = bookings.filter(b => b.status === 'active' || b.status === 'confirmed').length;
  const pendingCount = bookings.filter(b => b.status === 'pending').length;
  const completedCount = bookings.filter(b => b.status === 'completed').length;
  const cancelledCount = bookings.filter(b => b.status === 'cancelled').length;
  const visitCount = bookings.filter(b => b.bookingType === 'visit').length;
  const chamberCount = bookings.filter(b => b.bookingType !== 'visit').length;

  // ─── TYPE STATS - Based ONLY on isChamber ───
  const medicalChamberCount = bookings.filter(b => b.cabin?.isChamber === true).length;
  const coWorkingCount = bookings.filter(b => b.cabin?.isChamber === false || b.cabin?.isChamber === undefined).length;

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
    setFilterType('all');
  };

  // Stats for cards
  const statsCount = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    active: bookings.filter(b => b.status === 'active' || (b.status === 'confirmed' && b.paymentStatus !== 'paid')).length,
    completed: bookings.filter(b => b.status === 'completed' || (b.status === 'confirmed' && b.paymentStatus === 'paid')).length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length
  };

  const bookingStatsCards = [
    {
      label: "Total",
      value: statsCount.total,
      meta: "all reservations",
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
      meta: "confirmed & paid",
      icon: CheckCircle,
      color: "purple",
      onClick: () => setFilters(prev => ({ ...prev, status: 'completed' }))
    },
    {
      label: "Cancelled",
      value: statsCount.cancelled,
      meta: "cancelled reservations",
      icon: XCircle,
      color: "rose",
      onClick: () => setFilters(prev => ({ ...prev, status: 'cancelled' }))
    }
  ];

  if (loading) {
    return (
      <div className="admin-dash" style={{ backgroundColor: '#ffffff' }}>
        <DoctorNavbar />
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dash" style={{ backgroundColor: '#ffffff' }}>
      <DoctorNavbar />

      <div className="pt-20 px-3 sm:px-4 md:px-6 lg:px-8 max-w-full mx-auto pb-16">
        {/* Header */}
        <div className="admin-dash__header" style={{ marginBottom: '8px' }}>
          <div>
            <h1 className="admin-dash__greeting" style={{ fontSize: '1.25rem' }}>
              Doctor <span>Bookings</span>
            </h1>
            <p className="admin-dash__subtitle" style={{ fontSize: '11px' }}>
              Manage all your chamber and site visit bookings
            </p>
          </div>
          <div className="flex items-center gap-2">
            {displayBookings.length > 0 && (
              <button
                onClick={exportToExcel}
                className="flex items-center gap-1.5 px-3 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium hover:bg-indigo-100 transition border border-indigo-200"
              >
                <Download size={14} />
                Export
              </button>
            )}
            <button
              onClick={() => navigate("/mychambers")}
              className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 transition shadow-sm shadow-indigo-200"
            >
              <Building2 size={14} />
              My Chambers
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="admin-dash__stats" style={{ marginBottom: '16px' }}>
          {bookingStatsCards.map((stat, index) => (
            <div
              key={index}
              className="admin-dash__stat"
              onClick={stat.onClick}
              style={{ 
                cursor: stat.onClick ? 'pointer' : 'default',
                padding: '12px 14px',
                minHeight: '80px'
              }}
            >
              <div className="admin-dash__stat-top">
                <span className="admin-dash__stat-label" style={{ fontSize: '11px' }}>{stat.label}</span>
                <div className={`admin-dash__stat-icon admin-dash__stat-icon--${stat.color}`} style={{ width: '28px', height: '28px' }}>
                  <stat.icon size={14} />
                </div>
              </div>
              <div className="admin-dash__stat-value" style={{ fontSize: '18px', fontWeight: '700' }}>{stat.value}</div>
              <div className="admin-dash__stat-meta" style={{ fontSize: '9px' }}>{stat.meta}</div>
            </div>
          ))}
        </div>

        {/* Type Stats Row */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-rose-50 rounded-lg p-3 text-center border border-rose-200">
            <p className="text-[10px] font-bold text-rose-600 uppercase tracking-wider flex items-center justify-center gap-1">
              <Stethoscope size={12} /> Medical Chamber
            </p>
            <p className="text-xl font-black text-rose-700">{medicalChamberCount}</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-200">
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider flex items-center justify-center gap-1">
              <Briefcase size={12} /> Co-Working
            </p>
            <p className="text-xl font-black text-blue-700">{coWorkingCount}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 mb-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input                type="text"
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
                placeholder="Filter by date"
              />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
              >
                <option value="all">All Types</option>
                <option value="chamber">Medical Chamber</option>
                <option value="coworking">Co-Working</option>
              </select>
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
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
                <option value="chambers">Chamber Bookings ({chamberCount})</option>
              </select>
              <select
                value={filters.paymentStatus}
                onChange={(e) => setFilters({...filters, paymentStatus: e.target.value})}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
              >
                <option value="all">Payment Status</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
              </select>
              {(filters.status !== 'all' || filters.paymentStatus !== 'all' || filterDate || searchTerm || filterType !== 'all') && (
                <button
                  onClick={clearFilters}
                  className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
                  title="Clear filters"
                >
                  <XIcon size={16} />
                </button>
              )}
              {displayBookings.length > 0 && (
                <button
                  onClick={exportToExcel}
                  className="flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium hover:bg-indigo-100 transition"
                >
                  <Download size={14} />
                  <span className="hidden xs:inline">Export</span>
                </button>
              )}
            </div>
          </div>
          <div className="mt-1.5 text-[10px] text-gray-400">
            Showing {displayBookings.length} of {bookings.length} bookings
          </div>
        </div>

        {/* RENDER BASED ON ACTIVE TAB */}
        {activeTab === 'all' && (
          <>
            {filteredVisitBookings.length > 0 && renderVisitTable(filteredVisitBookings)}
            {filteredChamberBookings.length > 0 && renderChamberTable(filteredChamberBookings)}
            {filteredBookings.length === 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-12 text-center">
                <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 font-medium">No bookings found</p>
                <p className="text-sm text-gray-400 mt-1">
                  {bookings.length === 0 ? "You haven't made any bookings yet." : "Try adjusting your filters."}
                </p>
              </div>
            )}
          </>
        )}

        {activeTab === 'visits' && renderVisitTable(displayBookings)}

        {activeTab === 'chambers' && renderChamberTable(displayBookings)}

        {/* Footer */}
        <div className="mt-6 text-center text-[9px] text-gray-400 font-medium tracking-wider">
          © IRYAX SPACE — All Rights Reserved
        </div>
      </div>

      {/* ============================================================ */}
      {/* VIEW MODAL - Keep as is */}
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
            <div className="sticky top-0 bg-gradient-to-br from-indigo-600 to-purple-600 text-white p-6 rounded-t-3xl flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold">Booking Details</h3>
                <p className="text-sm text-indigo-200 flex items-center gap-2">
                  <Hash size={14} /> #{viewBooking._id?.slice(-8).toUpperCase()}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-[10px] font-medium">
                    {viewBooking.bookingType === 'visit' ? 'Site Visit' : 'Chamber Booking'}
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
              {/* ===== BASIC INFO ===== */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Booking ID</p>
                  <p className="mt-1 font-mono text-sm font-semibold text-gray-800">{viewBooking._id?.slice(-8).toUpperCase()}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Type</p>
                  <span className={`mt-1 inline-block px-3 py-1 text-xs font-bold rounded-full ${viewBooking.bookingType === 'visit' ? 'bg-purple-100 text-purple-700' : 'bg-indigo-100 text-indigo-700'}`}>
                    {viewBooking.bookingType === 'visit' ? 'Site Visit' : 'Chamber Booking'}
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

              {/* ===== CABIN & TYPE ===== */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <Building2 size={12} /> Chamber
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
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1">
                    <Layers size={12} /> Type
                  </p>
                  <div className="mt-2">
                    {(() => {
                      const typeBadge = getCabinTypeBadge(viewBooking.cabin);
                      if (!typeBadge) return <span className="text-gray-400 text-sm">N/A</span>;
                      const Icon = typeBadge.icon;
                      return (
                        <span className={`px-3 py-1.5 text-xs font-bold rounded-full inline-flex items-center gap-2 ${typeBadge.className}`}>
                          <Icon size={14} /> {typeBadge.label}
                        </span>
                      );
                    })()}
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

              {/* ===== USER DETAILS ===== */}
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

              {/* ===== SCHEDULE ===== */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <CalendarDays size={12} /> Start
                  </p>
                  <p className="mt-1 font-semibold text-gray-800">{formatDateIndian(viewBooking.startDate)}</p>
                  <p className="text-sm font-bold text-indigo-600">{convertToIndianTime(viewBooking.startTime)}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <CalendarDays size={12} /> End
                  </p>
                  <p className="mt-1 font-semibold text-gray-800">{formatDateIndian(viewBooking.endDate)}</p>
                  <p className="text-sm font-bold text-indigo-600">{convertToIndianTime(viewBooking.endTime)}</p>
                </div>
              </div>

              {/* ===== BOOKING INFO ===== */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                  <Info size={12} /> Booking Info
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold">
                    {viewBooking.totalHours}h Total
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

              {/* ===== MULTI-DAY SLOTS ===== */}
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

              {/* ===== SEATS ===== */}
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

              {/* ===== STATUS & PAYMENT ===== */}
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

              {/* ===== PRICE BREAKDOWN ===== */}
              <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
                <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-2 mb-3">
                  <Calculator size={14} />
                  Price Breakdown
                </p>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center border-b border-emerald-100 pb-1.5">
                    <span className="text-gray-600">Subtotal ({viewBooking.totalHours}h × ₹{viewBooking.cabin?.price || 0})</span>
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
                    <span className="text-xl font-bold text-emerald-700">₹{(viewBooking.totalPrice || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* ===== CREATED AT ===== */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                  <CalendarPlus size={12} /> Booked On
                </p>
                <p className="mt-1 font-semibold text-gray-800">{formatDateTimeToDDMMYYYY(viewBooking.createdAt)}</p>
              </div>

              {/* ===== ACTIONS ===== */}
              <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-200">
                <button
                  onClick={() => { setShowViewModal(false); downloadInvoice(viewBooking); }}
                  className="flex-1 min-w-[120px] py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-sm active:scale-[0.98]"
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
                <p className="text-xs text-slate-500">{formatDateIndian(replaceBooking.startDate)} {convertToIndianTime(replaceBooking.startTime)} - {formatDateIndian(replaceBooking.endDate)} {convertToIndianTime(replaceBooking.endTime)}</p>
                <p className="text-xs font-bold text-slate-700 mt-1">Total: ₹{replaceBooking.totalPrice || replaceBooking.amount}</p>
                {replaceBooking.totalDays > 0 && (
                  <p className="text-xs text-slate-500">{replaceBooking.totalDays} days • {replaceBooking.totalHours}h total</p>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Select New Chamber</label>
                <div className="relative">
                  <select
                    value={selectedChamber}
                    onChange={(e) => setSelectedChamber(e.target.value)}
                    className="w-full p-3 pr-10 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                  >
                    <option value="">Select a chamber...</option>
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
                      <p className="text-[10px] text-blue-600 font-medium">Current Chamber</p>
                      <p className="font-bold text-slate-800">₹{replaceBooking.cabin?.price || 0}/hr</p>
                      <p className="text-xs text-slate-500">{replaceBooking.totalHours}h = ₹{replaceBooking.totalPrice || replaceBooking.amount}</p>
                    </div>
                    <div className="bg-emerald-50 rounded-lg p-3">
                      <p className="text-[10px] text-emerald-600 font-medium">New Chamber</p>
                      <p className="font-bold text-slate-800">₹{selectedChamberData.price}/hr</p>
                      <p className="text-xs text-slate-500">{replaceBooking.totalHours}h = ₹{priceDiff.newTotal}</p>
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
                  <p><span className="text-slate-500">Chamber:</span> {cancelBooking.cabin?.name || cancelBooking.chamberName}</p>
                  <p><span className="text-slate-500">Start:</span> {formatDateIndian(cancelBooking.startDate)} {convertToIndianTime(cancelBooking.startTime)}</p>
                  <p><span className="text-slate-500">End:</span> {formatDateIndian(cancelBooking.endDate)} {convertToIndianTime(cancelBooking.endTime)}</p>
                  <p><span className="text-slate-500">Total:</span> ₹{cancelBooking.totalPrice || cancelBooking.amount}</p>
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
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <div className="flex flex-col items-center text-gray-400">
            <Calendar size={32} className="opacity-20 mb-2" />
            <p className="text-sm font-medium">No site visits found</p>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-4 py-3 bg-purple-50 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-purple-600" />
            <h3 className="font-bold text-gray-800">Site Visits</h3>
            <span className="px-2 py-0.5 bg-white/60 rounded-full text-xs font-bold text-gray-600">{bookingsList.length}</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[1200px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">#</th>
                <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Cabin</th>
                <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Type</th>
                <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Visit Date</th>
                <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Visit Time</th>
                <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Status</th>
                <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Created At</th>
                <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookingsList.map((b, idx) => {
                const status = getStatusBadge(b.status);
                const typeBadge = getCabinTypeBadge(b.cabin);
                const Icon = typeBadge?.icon || Briefcase;
                const bookingId = b._id?.slice(-8).toUpperCase() || 'N/A';

                return (
                  <tr key={b._id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-3 py-2">
                      <span className="text-[10px] font-semibold text-gray-400">#{idx + 1}</span>
                    </td>
                    <td className="px-3 py-2">
                      <span className="font-mono text-[10px] font-bold text-indigo-600">{bookingId}</span>
                    </td>
                    <td className="px-3 py-2">
                      <div>
                        <p className="font-semibold text-gray-900 text-xs">
                          {b.cabin?.name || b.chamberName || 'Unknown Cabin'}
                        </p>
                        <p className="text-[9px] text-gray-400 flex items-center gap-0.5">
                          <MapPin size={9} />
                          {b.cabin?.address?.split(',')[0] || 'N/A'}
                        </p>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      {typeBadge ? (
                        <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full inline-flex items-center gap-1 ${typeBadge.className}`}>
                          <Icon size={9} /> {typeBadge.label}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-[9px]">N/A</span>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <span className="text-xs font-medium text-gray-700">{formatDateIndian(b.startDate || b.date)}</span>
                    </td>
                    <td className="px-3 py-2">
                      <span className="text-xs font-medium text-gray-700">{convertToIndianTime(b.startTime || b.time)}</span>
                    </td>
                    <td className="px-3 py-2">
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${status.color}`}>{status.label}</span>
                    </td>
                    <td className="px-3 py-2">
                      <span className="text-[10px] text-gray-500 font-medium">{formatDateTimeToDDMMYYYY(b.createdAt)}</span>
                    </td>
                    <td className="px-3 py-2 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleViewBooking(b)}
                          className="p-1 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition"
                          title="View"
                        >
                          <Eye size={13} />
                        </button>
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

  // ✅ RENDER CHAMBER BOOKINGS TABLE
  function renderChamberTable(bookingsList) {
    if (bookingsList.length === 0) {
      return (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <div className="flex flex-col items-center text-gray-400">
            <Building2 size={32} className="opacity-20 mb-2" />
            <p className="text-sm font-medium">No chamber bookings found</p>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-4 py-3 bg-indigo-50 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 size={16} className="text-indigo-600" />
            <h3 className="font-bold text-gray-800">Chamber Bookings</h3>
            <span className="px-2 py-0.5 bg-white/60 rounded-full text-xs font-bold text-gray-600">{bookingsList.length}</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[1400px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">S. No</th>
                <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Cabin</th>
                <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Type</th>
                <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Start</th>
                <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">End</th>
                <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Hours</th>
                <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Days</th>
                <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Seats</th>
                <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Status</th>
                <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Payment</th>
                <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Amount</th>
                <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Created At</th>
                <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookingsList.map((b, idx) => {
                const status = getStatusBadge(b.status);
                const pmtMethod = getPaymentMethodBadge(b.paymentMethod);
                const pmtStatus = getPaymentStatusBadge(b.paymentStatus);
                const seatCount = b.seatCount || 0;
                const canCancel = b.status === 'pending' || b.status === 'confirmed';
                const canReplace = b.status === 'confirmed' || b.status === 'active';
                const typeBadge = getCabinTypeBadge(b.cabin);
                const Icon = typeBadge?.icon || Briefcase;
                const totalDays = b.totalDays || 0;
                const bookingId = b._id?.slice(-8).toUpperCase() || 'N/A';

                return (
                  <tr key={b._id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-3 py-2">
                      <span className="text-[10px] font-semibold text-gray-400">{idx + 1}</span>
                    </td>
                    <td className="px-3 py-2">
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
                    <td className="px-3 py-2">
                      {typeBadge ? (
                        <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full inline-flex items-center gap-1 ${typeBadge.className}`}>
                          <Icon size={9} /> {typeBadge.label}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-[9px]">N/A</span>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <div>
                        <span className="text-xs font-medium text-gray-700">{formatDateIndian(b.startDate || b.date)}</span>
                        <p className="text-[9px] text-indigo-600 font-medium">{convertToIndianTime(b.startTime || b.time)}</p>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <div>
                        <span className="text-xs font-medium text-gray-700">{formatDateIndian(b.endDate || b.startDate || b.date)}</span>
                        <p className="text-[9px] text-indigo-600 font-medium">{convertToIndianTime(b.endTime)}</p>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full text-[9px] font-bold">{b.totalHours}h</span>
                    </td>
                    <td className="px-3 py-2">
                      <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full text-[9px] font-bold">{totalDays}d</span>
                    </td>
                    <td className="px-3 py-2">
                      <span className="flex items-center gap-1 text-xs font-medium text-gray-700">
                        <Armchair size={12} className="text-indigo-500" />
                        {seatCount}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${status.color}`}>{status.label}</span>
                    </td>
                    <td className="px-3 py-2">
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${pmtMethod.color}`}>{pmtMethod.label}</span>
                      <span className={`ml-1 px-2 py-0.5 text-[9px] font-bold rounded-full ${pmtStatus.color}`}>{pmtStatus.label}</span>
                    </td>
                    <td className="px-3 py-2">
                      <span className="text-xs font-bold text-indigo-600">₹{b.totalPrice || b.amount || 0}</span>
                      {b.extraCharge > 0 && (
                        <p className="text-[8px] text-amber-500">+₹{b.extraCharge} seat</p>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <span className="text-[10px] text-gray-500 font-medium">{formatDateTimeToDDMMYYYY(b.createdAt)}</span>
                    </td>
                    <td className="px-3 py-2 text-center">
                      <div className="flex items-center justify-center gap-1 flex-wrap">
                        <button
                          onClick={() => handleViewBooking(b)}
                          className="p-1 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition"
                          title="View"
                        >
                          <Eye size={13} />
                        </button>
                        <button
                          onClick={() => downloadInvoice(b)}
                          className="p-1 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition"
                          title="Invoice"
                        >
                          <FileDown size={13} />
                        </button>
                        {canReplace && (
                          <button
                            onClick={() => {
                              setReplaceBooking(b);
                              setSelectedChamber("");
                              setSelectedChamberData(null);
                              setShowReplaceModal(true);
                            }}
                            className="p-1 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition"
                            title="Replace Space"
                          >
                            <RefreshCw size={13} />
                          </button>
                        )}
                        {canCancel && (
                          <button
                            onClick={() => {
                              setCancelBooking(b);
                              setShowCancelModal(true);
                            }}
                            className="p-1 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition"
                            title="Cancel Booking"
                          >
                            <XIcon size={13} />
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

export default BookingDoctor;