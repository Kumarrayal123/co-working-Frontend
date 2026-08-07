// // ChamberBookings.jsx - Complete with Clean UI + Tabs + Indian Time Format + Site Visit Status Update
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import DoctorNavbar from "./DoctorNavbar";
// import {
//   Calendar,
//   User,
//   Phone,
//   MapPin,
//   Clock,
//   IndianRupee,
//   Search,
//   X,
//   Calendar as CalendarIcon,
//   CheckCircle,
//   XCircle,
//   Clock as ClockIcon,
//   AlertCircle,
//   Eye,
//   Edit,
//   FileDown,
//   Timer,
//   Download,
//   TrendingUp,
//   Users,
//   CreditCard,
//   PieChart,
//   Store,
//   Building2,
//   Receipt,
//   Hash,
//   Crown,
//   Star,
//   Plus,
//   Trash2,
//   History,
//   Filter,
//   XCircle as XCircleIcon,
//   ArrowUpRight,
//   Image,
//   Upload,
//   QrCode,
//   Smartphone,
//   Printer,
//   Armchair,
//   CalendarPlus,
//   Stethoscope,
//   Briefcase,
//   Layers,
//   Wallet,
//   Calculator,
//   Info,
//   CalendarDays,
// } from "lucide-react";
// import { toast } from "react-toastify";
// import * as XLSX from 'xlsx';
// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';
// import "./Dashboard.css";

// const API_URL = "https://spaceapi.iryax.com";

// const ChamberBookings = () => {
//   const [bookings, setBookings] = useState([]);
//   const [allChambers, setAllChambers] = useState([]);
//   const [loading, setLoading] = useState(true);
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

//   const [showStatusModal, setShowStatusModal] = useState(false);
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const [newStatus, setNewStatus] = useState("");
//   const [updating, setUpdating] = useState(false);

//   const [showPaymentModal, setShowPaymentModal] = useState(false);
//   const [paymentBooking, setPaymentBooking] = useState(null);
//   const [newPaymentStatus, setNewPaymentStatus] = useState("");
//   const [amountPaid, setAmountPaid] = useState(0);
//   const [updatingPayment, setUpdatingPayment] = useState(false);

//   const [paymentDetails, setPaymentDetails] = useState({
//     paymentMode: 'cash',
//     cardNumber: '',
//     cardHolderName: '',
//     cardExpiry: '',
//     cardCVV: '',
//     upiId: '',
//     upiApp: '',
//     transactionId: '',
//     paymentDate: '',
//     notes: ''
//   });
//   const [paymentScreenshot, setPaymentScreenshot] = useState(null);
//   const [paymentScreenshotPreview, setPaymentScreenshotPreview] = useState(null);
//   const [uploadingScreenshot, setUploadingScreenshot] = useState(false);

//   const [showViewModal, setShowViewModal] = useState(false);
//   const [viewBooking, setViewBooking] = useState(null);

//   const [showTimingModal, setShowTimingModal] = useState(false);
//   const [timingBooking, setTimingBooking] = useState(null);
//   const [newTiming, setNewTiming] = useState({
//     date: "",
//     checkIn: "",
//     checkOut: ""
//   });
//   const [updatingTiming, setUpdatingTiming] = useState(false);

//   const [stats, setStats] = useState({
//     totalBookings: 0,
//     confirmed: 0,
//     active: 0,
//     completed: 0,
//     cancelled: 0,
//     pending: 0,
//     totalRevenue: 0,
//     confirmedRevenue: 0,
//     completedRevenue: 0
//   });

//   const getAuthHeader = () => {
//     const token = localStorage.getItem("token");
//     return { headers: { Authorization: `Bearer ${token}` } };
//   };

//   const getStatusBadge = (status) => {
//     const statusMap = {
//       pending: {
//         label: 'Pending',
//         color: 'bg-yellow-100 text-yellow-700',
//         icon: <ClockIcon size={12} className="text-yellow-500" />
//       },
//       confirmed: {
//         label: 'Confirmed',
//         color: 'bg-emerald-100 text-emerald-700',
//         icon: <CheckCircle size={12} className="text-emerald-500" />
//       },
//       active: {
//         label: 'Active',
//         color: 'bg-indigo-100 text-indigo-700',
//         icon: <Timer size={12} className="text-indigo-500" />
//       },
//       completed: {
//         label: 'Completed',
//         color: 'bg-blue-100 text-blue-700',
//         icon: <CheckCircle size={12} className="text-blue-500" />
//       },
//       cancelled: {
//         label: 'Cancelled',
//         color: 'bg-red-100 text-red-700',
//         icon: <XCircle size={12} className="text-red-500" />
//       }
//     };
//     return statusMap[status?.toLowerCase()] || { label: status || 'Unknown', color: 'bg-gray-100 text-gray-700', icon: <AlertCircle size={12} className="text-gray-500" /> };
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
//     if (status === 'refunded') return { label: 'Refunded', color: 'bg-purple-100 text-purple-700', icon: <XCircle size={12} className="text-purple-500" /> };
//     if (status === 'failed') return { label: 'Failed', color: 'bg-red-100 text-red-700', icon: <XCircle size={12} className="text-red-500" /> };
//     return { label: 'Pending', color: 'bg-yellow-100 text-yellow-700', icon: <ClockIcon size={12} className="text-yellow-500" /> };
//   };

//   const calculateStats = (bookingsData) => {
//     const total = bookingsData.length;
//     const confirmed = bookingsData.filter(b => b.status === 'confirmed').length;
//     const active = bookingsData.filter(b => b.status === 'active').length;
//     const completed = bookingsData.filter(b => b.status === 'completed').length;
//     const cancelled = bookingsData.filter(b => b.status === 'cancelled').length;
//     const pending = bookingsData.filter(b => b.status === 'pending').length;

//     const totalRevenue = bookingsData.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
//     const confirmedRevenue = bookingsData.filter(b => b.status === 'confirmed').reduce((sum, b) => sum + (b.totalPrice || 0), 0);
//     const completedRevenue = bookingsData.filter(b => b.status === 'completed').reduce((sum, b) => sum + (b.totalPrice || 0), 0);

//     setStats({ totalBookings: total, confirmed, active, completed, cancelled, pending, totalRevenue, confirmedRevenue, completedRevenue });
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
//     const fetchBookings = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) { setLoading(false); return; }

//         const res = await axios.get(`${API_URL}/api/bookings/owner-bookings`, { headers: { Authorization: `Bearer ${token}` } });
//         const bookingsData = res.data.bookings || [];
//         setBookings(bookingsData);
//         calculateStats(bookingsData);
//       } catch (err) {
//         console.error("Failed to fetch chamber bookings:", err);
//         toast.error("Failed to fetch bookings");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchBookings();
//     fetchChambers();
//   }, []);

//   const formatDate = (dateStr) => {
//     if (!dateStr) return "N/A";
//     const d = new Date(dateStr);
//     return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
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

//   const formatTimeOnly = (dateStr) => {
//     if (!dateStr) return "N/A";
//     const d = new Date(dateStr);
//     return d.toLocaleTimeString('en-IN', {
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const formatCurrency = (amount) => {
//     return `₹${amount.toLocaleString('en-IN')}`;
//   };

//   const formatDateIndian = (dateStr) => {
//     if (!dateStr) return "N/A";
//     const d = new Date(dateStr);
//     const day = String(d.getDate()).padStart(2, '0');
//     const month = String(d.getMonth() + 1).padStart(2, '0');
//     const year = String(d.getFullYear()).slice(2);
//     return `${day}/${month}/${year}`;
//   };

//   const formatTimeIndian = (timeStr) => {
//     if (!timeStr) return "N/A";
//     if (timeStr.includes('AM') || timeStr.includes('PM')) return timeStr;
//     try {
//       const parts = timeStr.split(':');
//       if (parts.length < 2) return timeStr;
//       let hours = parseInt(parts[0]);
//       const minutes = parts[1];
//       if (isNaN(hours)) return timeStr;
//       const ampm = hours >= 12 ? 'PM' : 'AM';
//       const hour12 = hours % 12 || 12;
//       return `${hour12}:${minutes} ${ampm}`;
//     } catch (e) {
//       return timeStr;
//     }
//   };

//   const getTotalDays = (booking) => {
//     if (booking.bookingSlots && booking.bookingSlots.length > 0) {
//       return booking.bookingSlots.length;
//     }
//     return booking.totalDays || 1;
//   };

//   const getTotalHoursDisplay = (booking) => {
//     if (booking.bookingSlots && booking.bookingSlots.length > 0) {
//       const total = booking.bookingSlots.reduce((sum, slot) => sum + (slot.hours || 0), 0);
//       return total;
//     }
//     return booking.totalHours || 0;
//   };

//   const handleUpdateStatus = async () => {
//     if (!selectedBooking || !newStatus) { toast.error("Please select a status"); return; }
//     setUpdating(true);
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.put(`${API_URL}/api/bookings/update-status/${selectedBooking._id}`, { status: newStatus }, { headers: { Authorization: `Bearer ${token}` } });
//       if (response.data.success) {
//         const updatedBookings = bookings.map(b => b._id === selectedBooking._id ? { ...b, status: newStatus } : b);
//         setBookings(updatedBookings);
//         calculateStats(updatedBookings);
//         toast.success(`Booking status updated to ${newStatus}`);
//         setShowStatusModal(false);
//         setSelectedBooking(null);
//         setNewStatus("");
//       } else {
//         toast.error(response.data.message || "Failed to update status");
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.error || "Failed to update status");
//     } finally { setUpdating(false); }
//   };

//   const handlePaymentScreenshotChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setPaymentScreenshot(file);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPaymentScreenshotPreview(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleUpdatePaymentStatus = async () => {
//     if (!paymentBooking || !newPaymentStatus) { toast.error("Please select a payment status"); return; }
//     if (newPaymentStatus === 'paid' && (!amountPaid || amountPaid <= 0)) { toast.error("Please enter amount paid"); return; }

//     if (paymentDetails.paymentMode === 'card') {
//       if (!paymentDetails.cardNumber || paymentDetails.cardNumber.replace(/\s/g, '').length < 16) {
//         toast.error("Please enter valid card number");
//         return;
//       }
//       if (!paymentDetails.cardHolderName) {
//         toast.error("Please enter card holder name");
//         return;
//       }
//       if (!paymentDetails.cardExpiry) {
//         toast.error("Please enter card expiry date");
//         return;
//       }
//       if (!paymentDetails.cardCVV || paymentDetails.cardCVV.length < 3) {
//         toast.error("Please enter valid CVV");
//         return;
//       }
//     }

//     if (paymentDetails.paymentMode === 'upi') {
//       if (!paymentDetails.upiId) {
//         toast.error("Please enter UPI ID");
//         return;
//       }
//       if (!paymentDetails.upiApp) {
//         toast.error("Please enter UPI app name");
//         return;
//       }
//     }

//     if (!paymentDetails.transactionId) {
//       toast.error("Please enter transaction ID");
//       return;
//     }

//     setUpdatingPayment(true);
//     try {
//       const token = localStorage.getItem("token");

//       const formData = new FormData();
//       formData.append('paymentStatus', newPaymentStatus);
//       formData.append('amountPaid', amountPaid || paymentBooking.totalPrice);
//       formData.append('paymentMode', paymentDetails.paymentMode);
//       formData.append('transactionId', paymentDetails.transactionId);
//       formData.append('paymentDate', paymentDetails.paymentDate || new Date().toISOString().split('T')[0]);
//       formData.append('notes', paymentDetails.notes || '');

//       if (paymentDetails.paymentMode === 'card') {
//         formData.append('cardNumber', paymentDetails.cardNumber);
//         formData.append('cardHolderName', paymentDetails.cardHolderName);
//         formData.append('cardExpiry', paymentDetails.cardExpiry);
//         formData.append('cardCVV', paymentDetails.cardCVV);
//       }

//       if (paymentDetails.paymentMode === 'upi') {
//         formData.append('upiId', paymentDetails.upiId);
//         formData.append('upiApp', paymentDetails.upiApp);
//       }

//       if (paymentScreenshot) {
//         formData.append('screenshot', paymentScreenshot);
//       }

//       const response = await axios.put(
//         `${API_URL}/api/bookings/bookingpayment-status/${paymentBooking._id}`,
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'multipart/form-data'
//           }
//         }
//       );

//       if (response.data.success) {
//         const updatedBookings = bookings.map(b =>
//           b._id === paymentBooking._id ? {
//             ...b,
//             paymentStatus: newPaymentStatus,
//             paymentDetails: {
//               mode: paymentDetails.paymentMode,
//               transactionId: paymentDetails.transactionId,
//               paymentDate: paymentDetails.paymentDate,
//               ...(paymentDetails.paymentMode === 'card' && {
//                 cardNumber: paymentDetails.cardNumber,
//                 cardHolderName: paymentDetails.cardHolderName
//               }),
//               ...(paymentDetails.paymentMode === 'upi' && {
//                 upiId: paymentDetails.upiId,
//                 upiApp: paymentDetails.upiApp
//               }),
//               screenshot: response.data.screenshotUrl || null
//             }
//           } : b
//         );
//         setBookings(updatedBookings);
//         calculateStats(updatedBookings);
//         toast.success(`Payment status updated to ${newPaymentStatus}`);
//         setShowPaymentModal(false);
//         setPaymentBooking(null);
//         setNewPaymentStatus("");
//         setAmountPaid(0);
//         setPaymentDetails({
//           paymentMode: 'cash',
//           cardNumber: '',
//           cardHolderName: '',
//           cardExpiry: '',
//           cardCVV: '',
//           upiId: '',
//           upiApp: '',
//           transactionId: '',
//           paymentDate: '',
//           notes: ''
//         });
//         setPaymentScreenshot(null);
//         setPaymentScreenshotPreview(null);
//       } else {
//         toast.error(response.data.error || "Failed to update payment status");
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.error || "Failed to update payment status");
//     } finally { setUpdatingPayment(false); }
//   };

//   const resetPaymentModal = () => {
//     setShowPaymentModal(false);
//     setPaymentBooking(null);
//     setNewPaymentStatus("");
//     setAmountPaid(0);
//     setPaymentDetails({
//       paymentMode: 'cash',
//       cardNumber: '',
//       cardHolderName: '',
//       cardExpiry: '',
//       cardCVV: '',
//       upiId: '',
//       upiApp: '',
//       transactionId: '',
//       paymentDate: '',
//       notes: ''
//     });
//     setPaymentScreenshot(null);
//     setPaymentScreenshotPreview(null);
//   };

//   const handleAddTiming = async () => {
//     if (!timingBooking || !newTiming.date || !newTiming.checkIn || !newTiming.checkOut) {
//       toast.error("Please fill all timing fields");
//       return;
//     }
//     setUpdatingTiming(true);
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.put(`${API_URL}/api/bookings/update-timings/${timingBooking._id}`, { date: newTiming.date, checkIn: newTiming.checkIn, checkOut: newTiming.checkOut }, { headers: { Authorization: `Bearer ${token}` } });
//       if (response.data.success) {
//         const updatedBookings = bookings.map(b => b._id === timingBooking._id ? { ...b, visitingTimings: response.data.booking.visitingTimings } : b);
//         setBookings(updatedBookings);
//         toast.success("Timing added successfully!");
//         setShowTimingModal(false);
//         setTimingBooking(null);
//         setNewTiming({ date: "", checkIn: "", checkOut: "" });
//         const res = await axios.get(`${API_URL}/api/bookings/owner-bookings`, { headers: { Authorization: `Bearer ${token}` } });
//         setBookings(res.data.bookings || []);
//         calculateStats(res.data.bookings || []);
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.error || "Failed to update timing");
//     } finally { setUpdatingTiming(false); }
//   };

//   const handleDeleteTiming = async (bookingId, timingIndex) => {
//     if (!window.confirm("Are you sure you want to delete this timing entry?")) return;
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.put(`${API_URL}/api/bookings/delete-timing/${bookingId}`, { timingIndex }, { headers: { Authorization: `Bearer ${token}` } });
//       if (response.data.success) {
//         const updatedBookings = bookings.map(b => b._id === bookingId ? { ...b, visitingTimings: response.data.booking.visitingTimings } : b);
//         setBookings(updatedBookings);
//         toast.success("Timing deleted successfully!");
//         const res = await axios.get(`${API_URL}/api/bookings/owner-bookings`, { headers: { Authorization: `Bearer ${token}` } });
//         setBookings(res.data.bookings || []);
//         calculateStats(res.data.bookings || []);
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.error || "Failed to delete timing");
//     }
//   };

//   const handleViewBooking = (booking) => {
//     setViewBooking(booking);
//     setShowViewModal(true);
//   };

//   const exportToExcel = () => {
//     try {
//       if (displayBookings.length === 0) { toast.warning("No bookings to export"); return; }
//       const exportData = displayBookings.map((booking, index) => {
//         const statusBadge = getStatusBadge(booking.status);
//         const paymentMethod = getPaymentMethodBadge(booking.paymentMethod);
//         const paymentStatus = getPaymentStatusBadge(booking.paymentStatus);
//         const totalDays = getTotalDays(booking);
//         const totalHours = getTotalHoursDisplay(booking);
//         return {
//           'S.No': index + 1,
//           'Booking Type': booking.bookingBasis === 'plan' ? 'Plan Booking' : 'Hourly Booking',
//           'Chamber Name': booking.cabin?.name || 'Unknown Chamber',
//           'Address': booking.cabin?.address || 'No Address',
//           'Customer Name': booking.name || booking.user?.name || 'Unknown Guest',
//           'Mobile': booking.mobile || booking.user?.mobile || 'N/A',
//           'Email': booking.email || booking.user?.email || 'N/A',
//           'From Date': booking.startDate || 'N/A',
//           'To Date': booking.endDate || 'N/A',
//           'From Time': formatTimeIndian(booking.startTime),
//           'To Time': formatTimeIndian(booking.endTime),
//           'Duration (Hours)': totalHours,
//           'Total Days': totalDays,
//           'Subtotal (₹)': booking.subtotal || 0,
//           'GST (18%)': booking.gstAmount || 0,
//           'Total (₹)': booking.totalPrice || 0,
//           'Seats': booking.seatCount || 0,
//           'Extra Charge': booking.extraCharge || 0,
//           'Status': statusBadge.label,
//           'Payment Method': paymentMethod.label,
//           'Payment Status': paymentStatus.label,
//           'Transaction ID': booking.transactionId || 'N/A',
//           'Visiting Days': booking.visitingTimings?.length || 0,
//           'Created At': booking.createdAt ? formatDateTime(booking.createdAt) : 'N/A'
//         };
//       });
//       const ws = XLSX.utils.json_to_sheet(exportData);
//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, 'Chamber_Bookings');
//       const date = new Date().toISOString().split('T')[0];
//       XLSX.writeFile(wb, `chamber_bookings_${date}.xlsx`);
//       toast.success(`Exported ${displayBookings.length} bookings to Excel!`);
//     } catch (error) {
//       console.error("Export error:", error);
//       toast.error("Failed to export bookings");
//     }
//   };

//   // ============================================================
//   // GENERATE THERMAL RECEIPT HTML
//   // ============================================================
//   const generateReceiptHTML = (booking) => {
//     const cabin = booking.cabin || {};
//     const cabinName = cabin.name || 'Unknown Chamber';
//     const cabinAddress = cabin.address || 'N/A';
//     const amount = booking.totalPrice || 0;
//     const subtotal = booking.subtotal || 0;
//     const gstAmount = booking.gstAmount || 0;
//     const extraCharge = booking.extraCharge || 0;
//     const seatCount = booking.seatCount || 0;
//     const selectedSeats = booking.selectedSeats || [];
//     const orderId = booking._id.slice(-8).toUpperCase();
//     const startDate = booking.startDate || 'N/A';
//     const startTime = formatTimeIndian(booking.startTime);
//     const endDate = booking.endDate || 'N/A';
//     const endTime = formatTimeIndian(booking.endTime);
//     const totalDays = getTotalDays(booking);
//     const totalHours = getTotalHoursDisplay(booking);
//     const status = booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1) || 'N/A';
//     const paymentStatus = booking.paymentStatus === 'paid' ? 'PAID' : 'PENDING';
//     const paymentMethod = booking.paymentMethod === 'cash' || booking.paymentMethod === 'counter' ? 'CASH' :
//                          booking.paymentMethod === 'upi' ? 'UPI' :
//                          booking.paymentMethod === 'card' ? 'CARD' : 'ONLINE';
//     const customerName = booking.name || booking.user?.name || 'Customer';
//     const customerMobile = booking.mobile || booking.user?.mobile || 'N/A';
//     const customerEmail = booking.email || booking.user?.email || 'N/A';
//     const transactionId = booking.transactionId || 'N/A';
//     const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
//     const visitingTimings = booking.visitingTimings || [];
//     const currentTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

//     const pmtDetails = booking.paymentDetails || {};
//     const upiId = pmtDetails.upiId || 'N/A';
//     const upiApp = pmtDetails.upiApp || 'N/A';
//     const cardNumber = pmtDetails.cardNumber || 'N/A';
//     const cardHolder = pmtDetails.cardHolderName || 'N/A';

//     const formatDateFn = (dateStr) => {
//       if (!dateStr) return "N/A";
//       const d = new Date(dateStr);
//       return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
//     };

//     let seatListHtml = '';
//     if (selectedSeats && selectedSeats.length > 0) {
//       seatListHtml = selectedSeats.map(s => 
//         `<span style="display:inline-block;background:#f0fdf4;padding:1px 8px;border-radius:10px;margin:1px;font-size:8px;border:1px solid #86efac;">${s.name} (#${s.number})</span>`
//       ).join('');
//     }

//     const isChamber = cabin.isChamber || false;
//     const spaceTypeLabel = isChamber ? '🏥 MEDICAL CHAMBER' : '💼 CO-WORKING SPACE';

//     let slotsHtml = '';
//     if (booking.bookingSlots && booking.bookingSlots.length > 0) {
//       slotsHtml = booking.bookingSlots.map((slot, i) => `
//         <div style="display:flex;justify-content:space-between;padding:1px 0;font-size:8px;">
//           <span>Day ${i+1}: ${formatDateFn(slot.date)}</span>
//           <span>${formatTimeIndian(slot.startTime)} - ${formatTimeIndian(slot.endTime)} (${slot.hours}h)</span>
//         </div>
//       `).join('');
//     }

//     return `
//       <div id="receipt-content" style="font-family:'Courier New',Courier,monospace;max-width:280px;margin:0 auto;padding:8px 6px;background:#fff;color:#000;font-size:11px;line-height:1.5;">
//         <div style="text-align:center;border-bottom:1px dashed #000;padding-bottom:6px;margin-bottom:6px;">
//           <h1 style="font-size:15px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#000;margin:0;">${cabinName.toUpperCase()}</h1>
//           <div style="font-size:9px;color:#444;margin-top:2px;">${cabinAddress}</div>
//           <div style="font-size:9px;color:#666;margin-top:2px;">${spaceTypeLabel}</div>
//           <div style="font-size:9px;color:#666;margin-top:2px;">GST: 18%</div>
//         </div>

//         <div style="text-align:center;font-size:13px;font-weight:700;margin:3px 0;">#${orderId}</div>
//         <div style="text-align:center;font-size:9px;color:#666;margin-bottom:4px;">${today}</div>

//         <div style="border-top:1px dashed #000;margin:4px 0;"></div>

//         <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-top:4px;margin-bottom:2px;color:#000;border-bottom:1px solid #000;padding-bottom:2px;">Customer Details</div>
//         <div style="display:flex;justify-content:space-between;padding:1px 0;font-size:10px;"><span style="color:#555;">Name</span><span style="font-weight:600;">${customerName}</span></div>
//         <div style="display:flex;justify-content:space-between;padding:1px 0;font-size:10px;"><span style="color:#555;">Mobile</span><span style="font-weight:600;">${customerMobile}</span></div>
//         ${customerEmail !== 'N/A' ? `<div style="display:flex;justify-content:space-between;padding:1px 0;font-size:9px;"><span style="color:#555;">Email</span><span style="font-weight:600;font-size:8px;">${customerEmail}</span></div>` : ''}

//         <div style="border-top:1px dashed #000;margin:4px 0;"></div>

//         <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-top:4px;margin-bottom:2px;color:#000;border-bottom:1px solid #000;padding-bottom:2px;">Booking Details</div>
//         <div style="display:flex;justify-content:space-between;padding:1px 0;font-size:10px;"><span style="color:#555;">From Date</span><span style="font-weight:600;">${startDate}</span></div>
//         <div style="display:flex;justify-content:space-between;padding:1px 0;font-size:10px;"><span style="color:#555;">To Date</span><span style="font-weight:600;">${endDate}</span></div>
//         <div style="display:flex;justify-content:space-between;padding:1px 0;font-size:10px;"><span style="color:#555;">Time</span><span style="font-weight:600;">${startTime} - ${endTime}</span></div>
//         <div style="display:flex;justify-content:space-between;padding:1px 0;font-size:10px;"><span style="color:#555;">Duration</span><span style="font-weight:600;">${totalHours} Hrs</span></div>
//         <div style="display:flex;justify-content:space-between;padding:1px 0;font-size:10px;"><span style="color:#555;">Total Days</span><span style="font-weight:600;">${totalDays}</span></div>
//         <div style="display:flex;justify-content:space-between;padding:1px 0;font-size:10px;"><span style="color:#555;">Type</span><span style="font-weight:600;">${booking.bookingBasis === 'plan' ? 'PLAN' : 'HOURLY'}</span></div>
//         ${booking.bookingBasis === 'plan' && booking.selectedPlan ? `<div style="display:flex;justify-content:space-between;padding:1px 0;font-size:10px;"><span style="color:#555;">Plan</span><span style="font-weight:600;">${booking.selectedPlan.label || 'Subscription'}</span></div>` : ''}
//         ${seatCount > 0 ? `<div style="display:flex;justify-content:space-between;padding:1px 0;font-size:10px;"><span style="color:#555;">Seats</span><span style="font-weight:600;">${seatCount}</span></div>` : ''}

//         ${selectedSeats.length > 0 ? `
//           <div style="margin:3px 0;padding:3px;background:#f8fafc;border-radius:4px;border:1px solid #e2e8f0;">
//             <div style="font-size:8px;color:#555;margin-bottom:2px;">Selected Seats:</div>
//             <div style="display:flex;flex-wrap:wrap;gap:2px;">${seatListHtml}</div>
//           </div>
//         ` : ''}

//         ${slotsHtml ? `
//           <div style="margin:3px 0;padding:3px;background:#f0fdf4;border-radius:4px;border:1px solid #bbf7d0;">
//             <div style="font-size:8px;color:#555;margin-bottom:2px;">Booking Slots:</div>
//             ${slotsHtml}
//           </div>
//         ` : ''}

//         <div style="border-top:1px dashed #000;margin:4px 0;"></div>

//         <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-top:4px;margin-bottom:2px;color:#000;border-bottom:1px solid #000;padding-bottom:2px;">Price Breakdown</div>
//         <div style="display:flex;justify-content:space-between;padding:1px 0;font-size:10px;"><span style="color:#555;">Subtotal (${totalHours}h)</span><span style="font-weight:600;">₹${subtotal.toFixed(2)}</span></div>
//         ${extraCharge > 0 ? `<div style="display:flex;justify-content:space-between;padding:1px 0;font-size:10px;"><span style="color:#555;">Seat Charges</span><span style="font-weight:600;">₹${extraCharge.toFixed(2)}</span></div>` : ''}
//         <div style="display:flex;justify-content:space-between;padding:1px 0;font-size:10px;"><span style="color:#555;">GST (18%)</span><span style="font-weight:600;">₹${gstAmount.toFixed(2)}</span></div>
//         <div style="border-top:2px solid #000;margin:4px 0;"></div>

//         <div style="background:#ffffff;padding:6px;margin:4px 0;border:1.5px solid #000;text-align:center;">
//           <div style="font-size:8px;text-transform:uppercase;color:#000;font-weight:700;">Total Amount</div>
//           <div style="font-size:18px;font-weight:700;color:#000;">₹${amount.toFixed(2)}</div>
//         </div>

//         <div style="border-top:1px dashed #000;margin:4px 0;"></div>
//         <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-top:4px;margin-bottom:2px;color:#000;border-bottom:1px solid #000;padding-bottom:2px;">Payment Details</div>
//         <div style="display:flex;justify-content:space-between;padding:1px 0;font-size:10px;"><span style="color:#555;">Method</span><span style="font-weight:600;">${paymentMethod}</span></div>
//         <div style="display:flex;justify-content:space-between;padding:1px 0;font-size:10px;"><span style="color:#555;">Status</span><span style="font-weight:600;">${paymentStatus}</span></div>
//         ${paymentMethod === 'UPI' && upiId !== 'N/A' ? `<div style="display:flex;justify-content:space-between;padding:1px 0;font-size:9px;"><span style="color:#555;">UPI ID</span><span style="font-weight:600;font-size:8px;">${upiId}</span></div>` : ''}
//         ${paymentMethod === 'UPI' && upiApp !== 'N/A' ? `<div style="display:flex;justify-content:space-between;padding:1px 0;font-size:10px;"><span style="color:#555;">UPI App</span><span style="font-weight:600;">${upiApp}</span></div>` : ''}
//         ${paymentMethod === 'CARD' && cardNumber !== 'N/A' ? `<div style="display:flex;justify-content:space-between;padding:1px 0;font-size:9px;"><span style="color:#555;">Card</span><span style="font-weight:600;font-size:8px;">${cardNumber}</span></div>` : ''}
//         ${paymentMethod === 'CARD' && cardHolder !== 'N/A' ? `<div style="display:flex;justify-content:space-between;padding:1px 0;font-size:10px;"><span style="color:#555;">Card Holder</span><span style="font-weight:600;">${cardHolder}</span></div>` : ''}
//         ${transactionId !== 'N/A' ? `<div style="display:flex;justify-content:space-between;padding:1px 0;font-size:9px;"><span style="color:#555;">TXN ID</span><span style="font-weight:600;font-size:8px;">${transactionId}</span></div>` : ''}

//         <div style="padding:3px 6px;text-align:center;font-weight:700;font-size:10px;letter-spacing:0.5px;margin:3px 0;background:#ffffff;color:#000;border:1.5px solid #000;">
//           ${paymentStatus === 'PAID' ? '✓ PAID' : 'PENDING PAYMENT'}
//         </div>

//         ${visitingTimings.length > 0 ? `
//           <div style="border-top:1px dashed #000;margin:4px 0;"></div>
//           <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-top:4px;margin-bottom:2px;color:#000;border-bottom:1px solid #000;padding-bottom:2px;">Visit Log</div>
//           ${visitingTimings.map((t, i) => `
//             <div style="display:flex;justify-content:space-between;padding:1px 0;font-size:8px;">
//               <span>Day ${i+1}: ${formatDateFn(t.date)}</span>
//               <span>${formatTimeIndian(t.checkIn)} - ${formatTimeIndian(t.checkOut)}</span>
//             </div>
//           `).join('')}
//         ` : ''}

//         <div style="text-align:center;font-size:8px;color:#666;border-top:1px dashed #000;padding-top:6px;margin-top:6px;">
//           <div style="font-size:10px;font-weight:700;color:#000;letter-spacing:0.5px;">IRYAX SPACE</div>
//           <div>Thank you for choosing ${cabinName}</div>
//           <div>System Generated Receipt</div>
//           <div>${today} ${currentTime}</div>
//         </div>
//       </div>
//     `;
//   };

//   const getReceiptPageStyles = () => `
//     * {
//       margin: 0;
//       padding: 0;
//       box-sizing: border-box;
//       -webkit-print-color-adjust: exact !important;
//       print-color-adjust: exact !important;
//       color-adjust: exact !important;
//     }
//     html, body {
//       background: #ffffff;
//       padding: 4px;
//       margin: 0 auto;
//       max-width: 280px;
//     }
//     @page {
//       size: 80mm auto;
//       margin: 0;
//     }
//     @media print {
//       html, body { padding: 2px; width: 80mm; }
//       .no-print { display: none !important; }
//     }
//     .action-btn {
//       display: block;
//       width: 100%;
//       max-width: 280px;
//       padding: 10px;
//       margin: 8px auto;
//       border: none;
//       border-radius: 4px;
//       font-size: 12px;
//       font-weight: 600;
//       cursor: pointer;
//       font-family: 'Courier New', monospace;
//       color: #fff;
//     }
//     .btn-print { background: #1a56db; }
//     .btn-print:hover { background: #1e40af; }
//     .btn-pdf { background: #059669; }
//     .btn-pdf:hover { background: #047857; }
//     .btn-close { background: #6b7280; }
//     .btn-close:hover { background: #4b5563; }
//     .hint {
//       text-align: center;
//       font-size: 10px;
//       color: #6b7280;
//       margin: 4px auto 0;
//       max-width: 280px;
//       font-family: 'Courier New', monospace;
//     }
//   `;

//   const printReceipt = (booking) => {
//     try {
//       const html = generateReceiptHTML(booking);
//       const win = window.open('', '_blank', 'width=300,height=600');
//       if (win) {
//         win.document.write(`
//           <!DOCTYPE html>
//           <html>
//           <head>
//             <meta charset="UTF-8">
//             <meta name="viewport" content="width=device-width, initial-scale=1.0">
//             <title>Receipt</title>
//             <style>${getReceiptPageStyles()}</style>
//           </head>
//           <body>
//             ${html}
//             <button class="action-btn btn-print no-print" onclick="window.print()">🖨️ PRINT RECEIPT</button>
//             <button class="action-btn btn-close no-print" onclick="window.close()">✕ CLOSE</button>
//             <p class="hint no-print">Print dialog me "Background graphics" ON rakhein, warna colors nahi aayenge.</p>
//           </body>
//           </html>
//         `);
//         win.document.close();
//         win.focus();
//         toast.success('Receipt ready! Click Print.');
//       } else {
//         toast.error('Please allow popups');
//       }
//     } catch (error) {
//       console.error('Receipt error:', error);
//       toast.error('Failed to generate receipt');
//     }
//   };

//   const downloadPDF = async (booking) => {
//     const toastId = toast.loading('Generating PDF...');
//     let iframe = null;
//     try {
//       const html = generateReceiptHTML(booking);

//       iframe = document.createElement('iframe');
//       iframe.style.position = 'fixed';
//       iframe.style.top = '0';
//       iframe.style.left = '-99999px';
//       iframe.style.width = '320px';
//       iframe.style.height = '900px';
//       iframe.style.border = 'none';
//       document.body.appendChild(iframe);

//       const idoc = iframe.contentDocument || iframe.contentWindow.document;
//       idoc.open();
//       idoc.write(`
//         <!DOCTYPE html>
//         <html>
//         <head>
//           <meta charset="UTF-8">
//           <style>
//             * { margin: 0; padding: 0; box-sizing: border-box; }
//             html, body { background: #ffffff; }
//           </style>
//         </head>
//         <body>${html}</body>
//         </html>
//       `);
//       idoc.close();

//       await new Promise((resolve) => setTimeout(resolve, 120));

//       const target = idoc.querySelector('#receipt-content') || idoc.body;

//       const canvas = await html2canvas(target, {
//         scale: 3,
//         backgroundColor: '#ffffff',
//         useCORS: true,
//         logging: false
//       });

//       const imgData = canvas.toDataURL('image/png');

//       const pageWidthMM = 80;
//       const pageHeightMM = (canvas.height * pageWidthMM) / canvas.width;

//       const pdf = new jsPDF({
//         orientation: 'portrait',
//         unit: 'mm',
//         format: [pageWidthMM, pageHeightMM]
//       });

//       pdf.addImage(imgData, 'PNG', 0, 0, pageWidthMM, pageHeightMM);

//       const orderId = booking._id.slice(-8).toUpperCase();
//       pdf.save(`receipt_${orderId}.pdf`);

//       toast.update(toastId, { render: 'Receipt downloaded as PDF!', type: 'success', isLoading: false, autoClose: 2500 });
//     } catch (error) {
//       console.error('PDF download error:', error);
//       toast.update(toastId, { render: 'Failed to download PDF', type: 'error', isLoading: false, autoClose: 3000 });
//     } finally {
//       if (iframe && iframe.parentNode) {
//         iframe.parentNode.removeChild(iframe);
//       }
//     }
//   };

//   const clearFilters = () => {
//     setFilters({ status: 'all', paymentStatus: 'all', paymentMethod: 'all', cabinId: 'all' });
//     setFilterDateFrom('');
//     setFilterDateTo('');
//   };

//   const filteredBookings = bookings.filter((b) => {
//     const bookingDate = b.startDate || b.date;

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

//     return matchDateRange && matchCabin && matchStatus && matchPaymentStatus && matchPaymentMethod;
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
//   const visitCount = bookings.filter(b => b.bookingType === 'visit').length;
//   const chamberCount = bookings.filter(b => b.bookingType !== 'visit').length;

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

//       <div className="pt-24 px-3 sm:px-4 md:px-6 lg:px-8 max-w-full mx-auto pb-16">
//         <div className="admin-dash__header">
//           <div>
//             <h1 className="admin-dash__greeting">
//               Chamber <span>Bookings</span>
//             </h1>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div className="admin-dash__stats">
//           <div className="admin-dash__stat">
//             <div className="admin-dash__stat-top">
//               <span className="admin-dash__stat-label">Total Bookings</span>
//               <div className="admin-dash__stat-icon bg-indigo-100 text-indigo-600">
//                 <Calendar size={18} />
//               </div>
//             </div>
//             <div className="admin-dash__stat-value">{stats.totalBookings}</div>
//             <div className="admin-dash__stat-meta">Rev: {formatCurrency(stats.totalRevenue)}</div>
//           </div>

//           <div className="admin-dash__stat">
//             <div className="admin-dash__stat-top">
//               <span className="admin-dash__stat-label">Confirmed</span>
//               <div className="admin-dash__stat-icon bg-emerald-100 text-emerald-600">
//                 <CheckCircle size={18} />
//               </div>
//             </div>
//             <div className="admin-dash__stat-value">{stats.confirmed}</div>
//             <div className="admin-dash__stat-meta">Rev: {formatCurrency(stats.confirmedRevenue)}</div>
//           </div>

//           <div className="admin-dash__stat">
//             <div className="admin-dash__stat-top">
//               <span className="admin-dash__stat-label">Active</span>
//               <div className="admin-dash__stat-icon bg-amber-100 text-amber-600">
//                 <Timer size={18} />
//               </div>
//             </div>
//             <div className="admin-dash__stat-value">{stats.active}</div>
//             <div className="admin-dash__stat-meta">{stats.pending} pending approval</div>
//           </div>

//           <div className="admin-dash__stat">
//             <div className="admin-dash__stat-top">
//               <span className="admin-dash__stat-label">Completed</span>
//               <div className="admin-dash__stat-icon bg-blue-100 text-blue-600">
//                 <CheckCircle size={18} />
//               </div>
//             </div>
//             <div className="admin-dash__stat-value">{stats.completed}</div>
//             <div className="admin-dash__stat-meta">Rev: {formatCurrency(stats.completedRevenue)}</div>
//           </div>

//           <div className="admin-dash__stat">
//             <div className="admin-dash__stat-top">
//               <span className="admin-dash__stat-label">Site Visits</span>
//               <div className="admin-dash__stat-icon bg-purple-100 text-purple-600">
//                 <Eye size={18} />
//               </div>
//             </div>
//             <div className="admin-dash__stat-value">{visitCount}</div>
//             <div className="admin-dash__stat-meta">{stats.cancelled} cancelled</div>
//           </div>
//         </div>

//         {/* Mini Stats - Pending, Cancelled, Revenue */}
//         <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-4">
//           <div className="bg-amber-50/80 rounded-xl border border-amber-200/80 p-3 sm:p-3.5 flex items-center justify-between shadow-sm">
//             <div>
//               <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Pending</p>
//               <p className="text-lg font-bold text-amber-900 mt-0.5">{stats.pending}</p>
//             </div>
//             <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-xs">
//               ⏳
//             </div>
//           </div>
//           <div className="bg-rose-50/80 rounded-xl border border-rose-200/80 p-3 sm:p-3.5 flex items-center justify-between shadow-sm">
//             <div>
//               <p className="text-[10px] font-bold uppercase tracking-wider text-rose-700">Cancelled</p>
//               <p className="text-lg font-bold text-rose-900 mt-0.5">{stats.cancelled}</p>
//             </div>
//             <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center text-rose-600 font-bold text-xs">
//               ✕
//             </div>
//           </div>
//           <div className="bg-indigo-50/80 rounded-xl border border-indigo-200/80 p-3 sm:p-3.5 flex items-center justify-between shadow-sm">
//             <div>
//               <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">Total Revenue</p>
//               <p className="text-lg font-bold text-indigo-900 mt-0.5">{formatCurrency(stats.totalRevenue)}</p>
//             </div>
//             <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
//               ₹
//             </div>
//           </div>
//         </div>

//         {/* Main Table */}
//         <div className="admin-dash__card" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}>
//           <div className="admin-dash__card-header flex flex-wrap items-center justify-between gap-3" style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb' }}>
//             <div className="flex items-center gap-3">
//               <h3 className="admin-dash__card-title">
//                 {activeTab === 'all' ? 'All Bookings' : activeTab === 'visits' ? 'Site Visits' : 'Chamber Bookings'}
//               </h3>
//               <span className="px-2.5 py-0.5 text-xs font-bold text-indigo-700 bg-indigo-100 rounded-full">
//                 {displayBookings.length}
//               </span>
//             </div>
//             <div className="flex flex-wrap items-center gap-2">
//               {/* From Date Filter */}
//               <div className="flex items-center gap-1">
//                 <span className="text-xs text-gray-500 font-medium">From:</span>
//                 <input
//                   type="date"
//                   value={filterDateFrom}
//                   onChange={(e) => setFilterDateFrom(e.target.value)}
//                   className="text-sm bg-white border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium text-gray-700"
//                 />
//               </div>

//               {/* To Date Filter */}
//               <div className="flex items-center gap-1">
//                 <span className="text-xs text-gray-500 font-medium">To:</span>
//                 <input
//                   type="date"
//                   value={filterDateTo}
//                   onChange={(e) => setFilterDateTo(e.target.value)}
//                   className="text-sm bg-white border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium text-gray-700"
//                 />
//               </div>

//               {/* Chamber Filter */}
//               <select
//                 value={filters.cabinId}
//                 onChange={(e) => setFilters({...filters, cabinId: e.target.value})}
//                 className="text-sm bg-white border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium text-gray-700 min-w-[150px]"
//               >
//                 <option value="all">All Chambers</option>
//                 {allChambers.map(chamber => (
//                   <option key={chamber._id} value={chamber._id}>
//                     {chamber.name}
//                   </option>
//                 ))}
//               </select>

//               {/* Status Filter */}
//               <select
//                 value={filters.status}
//                 onChange={(e) => setFilters({...filters, status: e.target.value})}
//                 className="text-sm bg-white border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium text-gray-700"
//               >
//                 <option value="all">All Status</option>
//                 <option value="pending">Pending</option>
//                 <option value="confirmed">Confirmed</option>
//                 <option value="active">Active</option>
//                 <option value="completed">Completed</option>
//                 <option value="cancelled">Cancelled</option>
//               </select>

//               {/* Payment Status Filter */}
//               <select
//                 value={filters.paymentStatus}
//                 onChange={(e) => setFilters({...filters, paymentStatus: e.target.value})}
//                 className="text-sm bg-white border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium text-gray-700"
//               >
//                 <option value="all">All Payment</option>
//                 <option value="pending">Pending</option>
//                 <option value="paid">Paid</option>
//                 <option value="failed">Failed</option>
//                 <option value="refunded">Refunded</option>
//               </select>

//               {/* Payment Method Filter */}
//               <select
//                 value={filters.paymentMethod}
//                 onChange={(e) => setFilters({...filters, paymentMethod: e.target.value})}
//                 className="text-sm bg-white border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium text-gray-700"
//               >
//                 <option value="all">All Method</option>
//                 <option value="online">Online</option>
//                 <option value="cash">Cash</option>
//                 <option value="counter">Counter</option>
//                 <option value="upi">UPI</option>
//                 <option value="card">Card</option>
//               </select>

//               {/* Clear Filters */}
//               {(filterDateFrom || filterDateTo || filters.status !== 'all' || filters.paymentStatus !== 'all' || filters.paymentMethod !== 'all' || filters.cabinId !== 'all') && (
//                 <button
//                   onClick={clearFilters}
//                   className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                 >
//                   <XCircleIcon size={14} />
//                   Clear
//                 </button>
//               )}

//               {displayBookings.length > 0 && (
//                 <button onClick={exportToExcel} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium hover:bg-indigo-100 transition-colors border border-indigo-200">
//                   <Download size={14} />
//                   <span className="hidden xs:inline">Export</span>
//                 </button>
//               )}

//               <button onClick={() => navigate("/mychamberpayments")} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors">
//                 <CreditCard size={14} className="text-indigo-600" />
//                 <span className="hidden xs:inline">Payments</span>
//               </button>
//               <button onClick={() => navigate("/mychambers")} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 transition-colors">
//                 <Building2 size={14} />
//                 <span className="hidden xs:inline">Chambers</span>
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* ✅ TAB SWITCHER */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 mt-4 mb-4 flex">
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

//         {/* Table - Updated with Indian Time Format */}
//         <div className="admin-dash__card" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}>
//           <div className="admin-dash__card-body p-0 overflow-x-auto" style={{ backgroundColor: '#ffffff' }}>
//             {displayBookings.length === 0 ? (
//               <div className="flex flex-col items-center justify-center gap-3 py-20 text-gray-400">
//                 <Calendar size={48} className="opacity-20" />
//                 <p className="text-lg font-medium">No bookings found</p>
//                 <p className="text-sm">Try adjusting your filters.</p>
//               </div>
//             ) : (
//               <table className="w-full min-w-[1550px] text-left">
//                 <thead>
//                   <tr className="border-b border-gray-100" style={{ backgroundColor: '#f9fafb' }}>
//                     <th className="p-3 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">#</th>
//                     <th className="p-3 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Chamber</th>
//                     <th className="p-3 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Space</th>
//                     <th className="p-3 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Customer</th>
//                     {activeTab === 'visits' ? (
//                       <>
//                         <th className="p-3 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Visit Date</th>
//                         <th className="p-3 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Visit Time</th>
//                         <th className="p-3 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Status</th>
//                         <th className="p-3 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Created At</th>
//                         <th className="p-3 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap text-center">Actions</th>
//                       </>
//                     ) : (
//                       <>
//                         <th className="p-3 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">From Date</th>
//                         <th className="p-3 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">To Date</th>
//                         <th className="p-3 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">From Time</th>
//                         <th className="p-3 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">To Time</th>
//                         <th className="p-3 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Hours</th>
//                         <th className="p-3 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Days</th>
//                         <th className="p-3 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Seats</th>
//                         <th className="p-3 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Status</th>
//                         <th className="p-3 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Payment</th>
//                         <th className="p-3 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Pmt Status</th>
//                         <th className="p-3 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Visits</th>
//                         <th className="p-3 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Amount</th>
//                         <th className="p-3 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Created At</th>
//                         <th className="p-3 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap text-center">Actions</th>
//                       </>
//                     )}
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-100">
//                   {displayBookings.map((booking, idx) => {
//                     const statusBadge = getStatusBadge(booking.status);
//                     const paymentMethodBadge = getPaymentMethodBadge(booking.paymentMethod);
//                     const paymentStatusBadge = getPaymentStatusBadge(booking.paymentStatus);
//                     const visitCount = booking.visitingTimings?.length || 0;
//                     const isCashPending = (booking.paymentMethod === 'cash' || booking.paymentMethod === 'counter') && booking.paymentStatus === 'pending';
//                     const seatCount = booking.seatCount || 0;
//                     const seatNames = booking.selectedSeats?.map(s => s.name).join(', ') || 'N/A';
//                     const isVisit = booking.bookingType === 'visit';
//                     const isChamber = booking.cabin?.isChamber || false;
//                     const totalDays = getTotalDays(booking);
//                     const totalHours = getTotalHoursDisplay(booking);

//                     return (
//                       <tr key={booking._id} className="transition-colors group hover:bg-gray-50/80">
//                         <td className="p-3"><span className="text-sm font-semibold text-gray-400">#{idx + 1}</span></td>
//                         <td className="p-3">
//                           <div>
//                             <p className="font-semibold text-gray-900 text-sm">{booking.cabin?.name || "Unknown"}</p>
//                             <p className="text-xs text-gray-500 mt-0.5">{booking.cabin?.address?.split(",")[0] || "No Address"}</p>
//                           </div>
//                         </td>
//                         <td className="p-3">
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
//                         <td className="p-3">
//                           <div>
//                             <p className="font-medium text-gray-800 text-sm">{booking.name || booking.user?.name || "Unknown"}</p>
//                             <p className="text-xs text-gray-400">{booking.mobile || booking.user?.mobile || "N/A"}</p>
//                           </div>
//                         </td>

//                         {isVisit ? (
//                           // ✅ SITE VISIT ROW - Limited columns with View & Status Update
//                           <>
//                             <td className="p-3">
//                               <p className="text-sm text-gray-900 font-medium">{booking.startDate || 'N/A'}</p>
//                             </td>
//                             <td className="p-3">
//                               <p className="text-sm text-gray-700 font-medium">{formatTimeIndian(booking.startTime)}</p>
//                             </td>
//                             <td className="p-3">
//                               <span className={`px-3 py-1 text-xs font-bold rounded-full inline-flex items-center gap-1.5 ${statusBadge.color}`}>
//                                 {statusBadge.icon} {statusBadge.label}
//                               </span>
//                             </td>
//                             <td className="p-3">
//                               <div className="flex flex-col">
//                                 <span className="text-xs font-medium text-gray-700">{formatDate(booking.createdAt)}</span>
//                                 <span className="text-[10px] text-gray-400">{formatTimeOnly(booking.createdAt)}</span>
//                               </div>
//                             </td>
//                             <td className="p-3 text-center">
//                               <div className="flex items-center justify-center gap-1">
//                                 <button onClick={() => handleViewBooking(booking)} className="flex items-center gap-0.5 px-2 py-1 rounded text-[10px] font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors whitespace-nowrap">
//                                   <Eye size={12} /> View
//                                 </button>
//                                 {/* ✅ STATUS UPDATE BUTTON FOR SITE VISIT */}
//                                 <button onClick={() => { setSelectedBooking(booking); setNewStatus(booking.status || 'pending'); setShowStatusModal(true); }} className="flex items-center gap-0.5 px-2 py-1 rounded text-[10px] font-medium bg-orange-50 text-orange-700 hover:bg-orange-100 transition-colors whitespace-nowrap">
//                                   <Edit size={12} /> Status
//                                 </button>
//                               </div>
//                             </td>
//                           </>
//                         ) : (
//                           // ✅ CHAMBER BOOKING ROW - Full columns
//                           <>
//                             <td className="p-3">
//                               <p className="text-sm text-gray-900 font-medium">{booking.startDate || 'N/A'}</p>
//                             </td>
//                             <td className="p-3">
//                               <p className="text-sm text-gray-900 font-medium">{booking.endDate || booking.startDate || 'N/A'}</p>
//                             </td>
//                             <td className="p-3">
//                               <p className="text-sm text-gray-700 font-medium">{formatTimeIndian(booking.startTime)}</p>
//                             </td>
//                             <td className="p-3">
//                               <p className="text-sm text-gray-700 font-medium">{formatTimeIndian(booking.endTime)}</p>
//                             </td>
//                             <td className="p-3">
//                               <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold">{totalHours}h</span>
//                             </td>
//                             <td className="p-3">
//                               <span className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-bold">{totalDays}</span>
//                             </td>
//                             <td className="p-3">
//                               <div>
//                                 <span className="text-sm font-medium text-gray-700">{seatCount}</span>
//                                 {seatCount > 0 && (
//                                   <p className="text-[10px] text-gray-400 truncate max-w-[100px]" title={seatNames}>
//                                     {seatNames}
//                                   </p>
//                                 )}
//                               </div>
//                             </td>
//                             <td className="p-3">
//                               <span className={`px-3 py-1 text-xs font-bold rounded-full inline-flex items-center gap-1.5 ${statusBadge.color}`}>
//                                 {statusBadge.icon} {statusBadge.label}
//                               </span>
//                             </td>
//                             <td className="p-3">
//                               <span className={`px-3 py-1 text-xs font-bold rounded-full inline-flex items-center gap-1.5 ${paymentMethodBadge.color}`}>
//                                 {paymentMethodBadge.icon} {paymentMethodBadge.label}
//                               </span>
//                             </td>
//                             <td className="p-3">
//                               <span className={`px-3 py-1 text-xs font-bold rounded-full inline-flex items-center gap-1.5 ${paymentStatusBadge.color}`}>
//                                 {paymentStatusBadge.icon} {paymentStatusBadge.label}
//                               </span>
//                             </td>
//                             <td className="p-3">
//                               <span className="text-sm font-semibold text-gray-700">{visitCount}</span>
//                             </td>
//                             <td className="p-3">
//                               <span className="text-indigo-600 font-bold text-sm">₹{booking.totalPrice?.toLocaleString("en-IN") || "0"}</span>
//                             </td>
//                             <td className="p-3">
//                               <div className="flex flex-col">
//                                 <span className="text-xs font-medium text-gray-700">{formatDate(booking.createdAt)}</span>
//                                 <span className="text-[10px] text-gray-400">{formatTimeOnly(booking.createdAt)}</span>
//                               </div>
//                             </td>
//                             <td className="p-3">
//                               <div className="flex items-center gap-1 overflow-x-auto max-w-[320px] py-1">
//                                 <button onClick={() => handleViewBooking(booking)} className="flex items-center gap-0.5 px-2 py-1 rounded text-[10px] font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors whitespace-nowrap">
//                                   <Eye size={12} /> View
//                                 </button>
//                                 <button onClick={() => printReceipt(booking)} className="flex items-center gap-0.5 px-2 py-1 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors whitespace-nowrap">
//                                   <Printer size={12} /> Print
//                                 </button>
//                                 <button onClick={() => downloadPDF(booking)} className="flex items-center gap-0.5 px-2 py-1 rounded text-[10px] font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors whitespace-nowrap">
//                                   <FileDown size={12} /> PDF
//                                 </button>
//                                 <button onClick={() => { setTimingBooking(booking); setNewTiming({ date: "", checkIn: "", checkOut: "" }); setShowTimingModal(true); }} className="flex items-center gap-0.5 px-2 py-1 rounded text-[10px] font-medium bg-cyan-50 text-cyan-700 hover:bg-cyan-100 transition-colors whitespace-nowrap">
//                                   <Plus size={12} /> Timing
//                                 </button>
//                                 <button onClick={() => { setSelectedBooking(booking); setNewStatus(booking.status || 'pending'); setShowStatusModal(true); }} className="flex items-center gap-0.5 px-2 py-1 rounded text-[10px] font-medium bg-orange-50 text-orange-700 hover:bg-orange-100 transition-colors whitespace-nowrap">
//                                   <Edit size={12} /> Status
//                                 </button>
//                                 {isCashPending && (
//                                   <button onClick={() => {
//                                     setPaymentBooking(booking);
//                                     setNewPaymentStatus(booking.paymentStatus || 'pending');
//                                     setAmountPaid(booking.totalPrice || 0);
//                                     setPaymentDetails({
//                                       paymentMode: 'cash',
//                                       cardNumber: '',
//                                       cardHolderName: '',
//                                       cardExpiry: '',
//                                       cardCVV: '',
//                                       upiId: '',
//                                       upiApp: '',
//                                       transactionId: '',
//                                       paymentDate: new Date().toISOString().split('T')[0],
//                                       notes: ''
//                                     });
//                                     setPaymentScreenshot(null);
//                                     setPaymentScreenshotPreview(null);
//                                     setShowPaymentModal(true);
//                                   }} className="flex items-center gap-0.5 px-2 py-1 rounded text-[10px] font-medium bg-yellow-50 text-yellow-700 hover:bg-yellow-100 transition-colors whitespace-nowrap">
//                                     <CreditCard size={12} /> Pay
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

//           {!loading && displayBookings.length > 0 && (
//             <div className="px-4 py-3 border-t border-gray-100 rounded-b-2xl flex flex-wrap items-center justify-between gap-2" style={{ backgroundColor: '#fafafa' }}>
//               <span className="text-xs text-gray-500">
//                 Showing <strong>{displayBookings.length}</strong> of <strong>{bookings.length}</strong> bookings
//               </span>
//               <div className="flex items-center gap-3 text-xs text-gray-500">
//                 <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Confirmed: {stats.confirmed}</span>
//                 <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-500"></span> Active: {stats.active}</span>
//                 <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500"></span> Pending: {stats.pending}</span>
//                 <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Cancelled: {stats.cancelled}</span>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ============================================================ */}
//       {/* VIEW BOOKING MODAL - COMPLETE WITH ALL FIELDS & INDIAN TIME */}
//       {/* ============================================================ */}
//       {showViewModal && viewBooking && (
//         <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) setShowViewModal(false); }}>
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
//                     <Building2 size={12} /> Chamber Details
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
//                   <p className="text-sm font-bold text-indigo-600">{formatTimeIndian(viewBooking.startTime)}</p>
//                 </div>
//                 <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
//                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
//                     <CalendarDays size={12} /> End
//                   </p>
//                   <p className="mt-1 font-semibold text-gray-800">{formatDateIndian(viewBooking.endDate)}</p>
//                   <p className="text-sm font-bold text-indigo-600">{formatTimeIndian(viewBooking.endTime)}</p>
//                 </div>
//               </div>

//               {/* ===== BOOKING INFO ===== */}
//               <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
//                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
//                   <Info size={12} /> Booking Info
//                 </p>
//                 <div className="mt-2 flex flex-wrap items-center gap-2">
//                   <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold">
//                     {getTotalHoursDisplay(viewBooking)}h Total
//                   </span>
//                   <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
//                     {getTotalDays(viewBooking)} Days
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
//                         <p className="text-[10px] text-gray-500">{formatTimeIndian(slot.startTime)} - {formatTimeIndian(slot.endTime)}</p>
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
//                     <span className="text-gray-600">Subtotal ({getTotalHoursDisplay(viewBooking)}h × ₹{viewBooking.cabin?.price || 0})</span>
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

//               {/* ===== STATUS ===== */}
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
//                           <span className="text-xs font-medium text-emerald-600">IN: {formatTimeIndian(timing.checkIn)}</span>
//                           <span className="text-xs font-medium text-red-500">OUT: {formatTimeIndian(timing.checkOut)}</span>
//                         </div>
//                       </div>
//                     ))}
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
//                   onClick={() => { setShowViewModal(false); printReceipt(viewBooking); }}
//                   className="flex-1 min-w-[120px] py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition shadow-sm"
//                 >
//                   <Printer size={16} className="inline mr-2" />
//                   Print Receipt
//                 </button>
//                 <button
//                   onClick={() => { setShowViewModal(false); downloadPDF(viewBooking); }}
//                   className="flex-1 min-w-[120px] py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-sm"
//                 >
//                   <FileDown size={16} className="inline mr-2" />
//                   Download PDF
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

//       {/* STATUS UPDATE MODAL */}
//       {showStatusModal && selectedBooking && (
//         <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) { setShowStatusModal(false); setSelectedBooking(null); setNewStatus(""); } }}>
//           <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
//             <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-5 text-white rounded-t-3xl flex justify-between items-center">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center"><Edit size={20} className="text-white" /></div>
//                 <div><h3 className="text-xl font-bold">Update Status</h3><p className="text-sm text-indigo-200">{selectedBooking.cabin?.name}</p></div>
//               </div>
//               <button onClick={() => { setShowStatusModal(false); setSelectedBooking(null); setNewStatus(""); }} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"><X size={20} /></button>
//             </div>
//             <div className="p-5 space-y-4">
//               <div className="bg-gray-50 rounded-xl p-4 flex justify-between items-center">
//                 <span className="text-sm text-gray-500">Current Status</span>
//                 <span className={`px-3 py-1 text-xs font-bold rounded-full inline-flex items-center gap-1.5 ${getStatusBadge(selectedBooking.status).color}`}>
//                   {getStatusBadge(selectedBooking.status).icon} {getStatusBadge(selectedBooking.status).label}
//                 </span>
//               </div>
//               <div>
//                 <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Select New Status</label>
//                 <div className="grid grid-cols-2 gap-2">
//                   {['pending', 'confirmed', 'active', 'completed', 'cancelled'].map((status) => {
//                     const badge = getStatusBadge(status);
//                     const isSelected = newStatus === status;
//                     return (
//                       <button key={status} onClick={() => setNewStatus(status)} className={`py-2.5 rounded-xl text-xs font-bold border transition ${isSelected ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 hover:bg-gray-50 text-gray-700'}`}>
//                         <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>{badge.label}</span>
//                       </button>
//                     );
//                   })}
//                 </div>
//               </div>
//               <div className="bg-amber-50 rounded-xl p-3 text-xs text-amber-700 flex items-start gap-2 border border-amber-200">
//                 <AlertCircle size={16} className="shrink-0 mt-0.5" />
//                 <span>Changing status will update the booking visibility and availability.</span>
//               </div>
//               <div className="flex gap-3">
//                 <button onClick={handleUpdateStatus} disabled={updating || !newStatus} className={`flex-1 py-3 rounded-xl text-white font-bold transition ${(updating || !newStatus) ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg'}`}>
//                   {updating ? 'Updating...' : 'Update Status'}
//                 </button>
//                 <button onClick={() => { setShowStatusModal(false); setSelectedBooking(null); setNewStatus(""); }} className="px-5 py-3 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition">Cancel</button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* PAYMENT STATUS UPDATE MODAL */}
//       {showPaymentModal && paymentBooking && (
//         <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) resetPaymentModal(); }}>
//           <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-y-auto max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
//             <div className="sticky top-0 bg-gradient-to-br from-amber-500 to-amber-600 p-5 text-white rounded-t-3xl flex justify-between items-center z-10">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center"><CreditCard size={20} className="text-white" /></div>
//                 <div><h3 className="text-xl font-bold">Update Payment</h3><p className="text-sm text-amber-100">₹{paymentBooking.totalPrice}</p></div>
//               </div>
//               <button onClick={resetPaymentModal} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"><X size={20} /></button>
//             </div>
//             <div className="p-5 space-y-4">
//               <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
//                 <div className="flex justify-between"><span className="text-gray-500">Customer</span><span className="font-semibold">{paymentBooking.name || 'N/A'}</span></div>
//                 <div className="flex justify-between"><span className="text-gray-500">Chamber</span><span className="font-semibold">{paymentBooking.cabin?.name || 'N/A'}</span></div>
//                 <div className="flex justify-between"><span className="text-gray-500">Current Status</span><span className={`px-3 py-1 text-xs font-bold rounded-full ${getPaymentStatusBadge(paymentBooking.paymentStatus).color}`}>{getPaymentStatusBadge(paymentBooking.paymentStatus).label}</span></div>
//                 <div className="flex justify-between"><span className="text-gray-500">Total Amount</span><span className="font-bold text-gray-800">₹{paymentBooking.totalPrice}</span></div>
//               </div>

//               <div>
//                 <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">New Payment Status</label>
//                 <div className="grid grid-cols-2 gap-2">
//                   {['pending','paid','failed','refunded'].map(s => {
//                     const badge = getPaymentStatusBadge(s);
//                     const isSelected = newPaymentStatus === s;
//                     return (
//                       <button key={s} onClick={() => { setNewPaymentStatus(s); if(s === 'paid') setAmountPaid(paymentBooking.totalPrice); else setAmountPaid(0); }} className={`py-2.5 rounded-xl text-xs font-bold border transition ${isSelected ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-gray-200 hover:bg-gray-50 text-gray-700'}`}>
//                         <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>{badge.label}</span>
//                       </button>
//                     );
//                   })}
//                 </div>
//               </div>

//               {newPaymentStatus === 'paid' && (
//                 <div>
//                   <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Amount Paid (₹)</label>
//                   <input type="number" value={amountPaid} onChange={(e) => setAmountPaid(Number(e.target.value))} placeholder="Enter amount" className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
//                 </div>
//               )}

//               {newPaymentStatus === 'paid' && (
//                 <div>
//                   <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Payment Mode</label>
//                   <div className="grid grid-cols-3 gap-2">
//                     <button onClick={() => setPaymentDetails({...paymentDetails, paymentMode: 'cash'})} className={`py-2.5 rounded-xl text-xs font-bold border transition ${paymentDetails.paymentMode === 'cash' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-200 hover:bg-gray-50 text-gray-700'}`}>
//                       <Store size={16} className="mx-auto mb-1" /> Cash
//                     </button>
//                     <button onClick={() => setPaymentDetails({...paymentDetails, paymentMode: 'upi'})} className={`py-2.5 rounded-xl text-xs font-bold border transition ${paymentDetails.paymentMode === 'upi' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 hover:bg-gray-50 text-gray-700'}`}>
//                       <Smartphone size={16} className="mx-auto mb-1" /> UPI
//                     </button>
//                     <button onClick={() => setPaymentDetails({...paymentDetails, paymentMode: 'card'})} className={`py-2.5 rounded-xl text-xs font-bold border transition ${paymentDetails.paymentMode === 'card' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:bg-gray-50 text-gray-700'}`}>
//                       <CreditCard size={16} className="mx-auto mb-1" /> Card
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {paymentDetails.paymentMode === 'card' && newPaymentStatus === 'paid' && (
//                 <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-blue-200">
//                   <p className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center gap-2">
//                     <CreditCard size={14} /> Card Details
//                   </p>
//                   <div>
//                     <label className="text-xs font-medium text-gray-600 block mb-1">Card Number</label>
//                     <input type="text" placeholder="1234 5678 9012 3456" value={paymentDetails.cardNumber} onChange={(e) => setPaymentDetails({...paymentDetails, cardNumber: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
//                   </div>
//                   <div>
//                     <label className="text-xs font-medium text-gray-600 block mb-1">Card Holder Name</label>
//                     <input type="text" placeholder="John Doe" value={paymentDetails.cardHolderName} onChange={(e) => setPaymentDetails({...paymentDetails, cardHolderName: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
//                   </div>
//                   <div className="grid grid-cols-2 gap-3">
//                     <div>
//                       <label className="text-xs font-medium text-gray-600 block mb-1">Expiry Date</label>
//                       <input type="text" placeholder="MM/YY" value={paymentDetails.cardExpiry} onChange={(e) => setPaymentDetails({...paymentDetails, cardExpiry: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
//                     </div>
//                     <div>
//                       <label className="text-xs font-medium text-gray-600 block mb-1">CVV</label>
//                       <input type="password" placeholder="***" maxLength="4" value={paymentDetails.cardCVV} onChange={(e) => setPaymentDetails({...paymentDetails, cardCVV: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {paymentDetails.paymentMode === 'upi' && newPaymentStatus === 'paid' && (
//                 <div className="space-y-3 bg-purple-50 p-4 rounded-xl border border-purple-200">
//                   <p className="text-xs font-bold text-purple-600 uppercase tracking-wider flex items-center gap-2">
//                     <Smartphone size={14} /> UPI Details
//                   </p>
//                   <div>
//                     <label className="text-xs font-medium text-gray-600 block mb-1">UPI ID</label>
//                     <input type="text" placeholder="example@upi" value={paymentDetails.upiId} onChange={(e) => setPaymentDetails({...paymentDetails, upiId: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
//                   </div>
//                   <div>
//                     <label className="text-xs font-medium text-gray-600 block mb-1">UPI App</label>
//                     <select value={paymentDetails.upiApp} onChange={(e) => setPaymentDetails({...paymentDetails, upiApp: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
//                       <option value="">Select UPI App</option>
//                       <option value="Google Pay">Google Pay</option>
//                       <option value="PhonePe">PhonePe</option>
//                       <option value="Paytm">Paytm</option>
//                       <option value="Amazon Pay">Amazon Pay</option>
//                       <option value="BHIM">BHIM</option>
//                       <option value="Other">Other</option>
//                     </select>
//                   </div>
//                 </div>
//               )}

//               {newPaymentStatus === 'paid' && (
//                 <div className="space-y-3">
//                   <div>
//                     <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Transaction ID</label>
//                     <input type="text" placeholder="TXN123456789" value={paymentDetails.transactionId} onChange={(e) => setPaymentDetails({...paymentDetails, transactionId: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
//                   </div>
//                   <div>
//                     <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Payment Date</label>
//                     <input type="date" value={paymentDetails.paymentDate} onChange={(e) => setPaymentDetails({...paymentDetails, paymentDate: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
//                   </div>
//                 </div>
//               )}

//               {newPaymentStatus === 'paid' && paymentDetails.paymentMode !== 'cash' && (
//                 <div>
//                   <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Payment Screenshot</label>
//                   <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-amber-400 transition cursor-pointer relative" onClick={() => document.getElementById('screenshotUpload').click()}>
//                     <input id="screenshotUpload" type="file" accept="image/*" className="hidden" onChange={handlePaymentScreenshotChange} />
//                     {paymentScreenshotPreview ? (
//                       <div className="relative">
//                         <img src={paymentScreenshotPreview} alt="Screenshot Preview" className="max-h-48 mx-auto rounded-lg" />
//                         <button onClick={(e) => { e.stopPropagation(); setPaymentScreenshot(null); setPaymentScreenshotPreview(null); }} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition">
//                           <X size={16} />
//                         </button>
//                       </div>
//                     ) : (
//                       <div className="py-4">
//                         <Upload size={32} className="mx-auto text-gray-400 mb-2" />
//                         <p className="text-sm text-gray-500">Click to upload screenshot</p>
//                         <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}

//               {newPaymentStatus === 'paid' && (
//                 <div>
//                   <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Notes (Optional)</label>
//                   <textarea rows="2" placeholder="Any additional notes about this payment..." value={paymentDetails.notes} onChange={(e) => setPaymentDetails({...paymentDetails, notes: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none" />
//                 </div>
//               )}

//               <div className="bg-amber-50 rounded-xl p-3 text-xs text-amber-700 flex items-start gap-2 border border-amber-200">
//                 <AlertCircle size={16} className="shrink-0 mt-0.5" />
//                 <span>Marking as paid will add the amount to the owner's wallet. All payment details will be securely stored.</span>
//               </div>
//               <div className="flex gap-3">
//                 <button onClick={handleUpdatePaymentStatus} disabled={updatingPayment || !newPaymentStatus || (newPaymentStatus === 'paid' && (!amountPaid || amountPaid <= 0))} className={`flex-1 py-3 rounded-xl text-white font-bold transition ${(updatingPayment || !newPaymentStatus || (newPaymentStatus === 'paid' && (!amountPaid || amountPaid <= 0))) ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:shadow-lg'}`}>
//                   {updatingPayment ? 'Updating...' : 'Update Payment'}
//                 </button>
//                 <button onClick={resetPaymentModal} className="px-5 py-3 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition">Cancel</button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* VISITING TIMINGS MODAL */}
//       {showTimingModal && timingBooking && (
//         <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) { setShowTimingModal(false); setTimingBooking(null); setNewTiming({ date: "", checkIn: "", checkOut: "" }); } }}>
//           <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
//             <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-5 text-white rounded-t-3xl flex justify-between items-center">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center"><Plus size={20} className="text-white" /></div>
//                 <div><h3 className="text-xl font-bold">Add Visit Timing</h3><p className="text-sm text-blue-200">{timingBooking.cabin?.name}</p></div>
//               </div>
//               <button onClick={() => { setShowTimingModal(false); setTimingBooking(null); setNewTiming({ date: "", checkIn: "", checkOut: "" }); }} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"><X size={20} /></button>
//             </div>
//             <div className="p-5 space-y-4">
//               <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
//                 <div className="flex justify-between"><span className="text-gray-500">Customer</span><span className="font-semibold">{timingBooking.name || 'N/A'}</span></div>
//                 <div className="flex justify-between"><span className="text-gray-500">Period</span><span className="font-medium">{timingBooking.startDate} - {timingBooking.endDate}</span></div>
//                 <div className="flex justify-between pt-2 border-t border-gray-200"><span className="text-gray-500">Visits Logged</span><span className="font-bold text-blue-600">{timingBooking.visitingTimings?.length || 0}</span></div>
//               </div>
//               <div>
//                 <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Visit Date</label>
//                 <input type="date" value={newTiming.date} onChange={(e) => setNewTiming({ ...newTiming, date: e.target.value })} className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
//               </div>
//               <div className="grid grid-cols-2 gap-3">
//                 <div>
//                   <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Check In</label>
//                   <input type="time" value={newTiming.checkIn} onChange={(e) => setNewTiming({ ...newTiming, checkIn: e.target.value })} className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
//                 </div>
//                 <div>
//                   <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Check Out</label>
//                   <input type="time" value={newTiming.checkOut} onChange={(e) => setNewTiming({ ...newTiming, checkOut: e.target.value })} className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
//                 </div>
//               </div>
//               {timingBooking.visitingTimings && timingBooking.visitingTimings.length > 0 && (
//                 <div className="bg-gray-50 rounded-xl p-3">
//                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Existing Visits</p>
//                   <div className="space-y-1 mt-1.5">
//                     {timingBooking.visitingTimings.map((t, idx) => (
//                       <div key={idx} className="flex items-center justify-between text-xs">
//                         <span className="text-gray-600">{formatDate(t.date)}</span>
//                         <div className="flex items-center gap-2">
//                           <span className="text-emerald-600 font-medium">{formatTimeIndian(t.checkIn)}</span>
//                           <span className="text-gray-300">-</span>
//                           <span className="text-red-500 font-medium">{formatTimeIndian(t.checkOut)}</span>
//                           <button onClick={() => { if (window.confirm("Delete this timing entry?")) { handleDeleteTiming(timingBooking._id, idx); } }} className="text-red-400 hover:text-red-600 transition-colors"><Trash2 size={12} /></button>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//               <div className="bg-blue-50 rounded-xl p-3 text-xs text-blue-700 flex items-start gap-2 border border-blue-200">
//                 <Clock size={16} className="shrink-0 mt-0.5" />
//                 <span>Add check-in and check-out times for each visit day.</span>
//               </div>
//               <div className="flex gap-3">
//                 <button onClick={handleAddTiming} disabled={updatingTiming} className={`flex-1 py-3 rounded-xl text-white font-bold transition ${updatingTiming ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:shadow-lg'}`}>
//                   {updatingTiming ? 'Adding...' : 'Add Timing'}
//                 </button>
//                 <button onClick={() => { setShowTimingModal(false); setTimingBooking(null); setNewTiming({ date: "", checkIn: "", checkOut: "" }); }} className="px-5 py-3 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition">Cancel</button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChamberBookings;








// ChamberBookings.jsx - Complete updated code with tabs, ONLY MEDICAL BOOKINGS, DD/MM/YYYY date format, and Professional Black & Gray Invoice
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DoctorNavbar from "./DoctorNavbar";
import {
  Calendar,
  User,
  Phone,
  MapPin,
  Clock,
  IndianRupee,
  Search,
  X,
  Calendar as CalendarIcon,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  AlertCircle,
  Eye,
  Edit,
  FileDown,
  Timer,
  Download,
  TrendingUp,
  Users,
  CreditCard,
  PieChart,
  Store,
  Building2,
  Receipt,
  Hash,
  Crown,
  Star,
  Plus,
  Trash2,
  History,
  Filter,
  XCircle as XCircleIcon,
  ArrowUpRight,
  Image,
  Upload,
  QrCode,
  Smartphone,
  Printer,
  Armchair,
  CalendarPlus,
  Stethoscope,
  Briefcase,
  Layers,
  Wallet,
  Calculator,
  Info,
  CalendarDays,
  Ticket
} from "lucide-react";
import { toast } from "react-toastify";
import * as XLSX from 'xlsx';
import "./Dashboard.css";

const API_URL = "https://spaceapi.iryax.com";

const ChamberBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [allChambers, setAllChambers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [activeTab, setActiveTab] = useState('cabin');
  const [filters, setFilters] = useState({
    status: 'all',
    paymentStatus: 'all'
  });

  const navigate = useNavigate();

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [updating, setUpdating] = useState(false);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentBooking, setPaymentBooking] = useState(null);
  const [newPaymentStatus, setNewPaymentStatus] = useState("");
  const [amountPaid, setAmountPaid] = useState(0);
  const [updatingPayment, setUpdatingPayment] = useState(false);

  const [paymentDetails, setPaymentDetails] = useState({
    paymentMode: 'cash',
    cardNumber: '',
    cardHolderName: '',
    cardExpiry: '',
    cardCVV: '',
    upiId: '',
    upiApp: '',
    transactionId: '',
    paymentDate: '',
    notes: ''
  });
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [paymentScreenshotPreview, setPaymentScreenshotPreview] = useState(null);
  const [uploadingScreenshot, setUploadingScreenshot] = useState(false);

  const [showViewModal, setShowViewModal] = useState(false);
  const [viewBooking, setViewBooking] = useState(null);

  const [showTimingModal, setShowTimingModal] = useState(false);
  const [timingBooking, setTimingBooking] = useState(null);
  const [newTiming, setNewTiming] = useState({
    date: "",
    checkIn: "",
    checkOut: ""
  });
  const [updatingTiming, setUpdatingTiming] = useState(false);

  const [stats, setStats] = useState({
    totalBookings: 0,
    confirmed: 0,
    active: 0,
    completed: 0,
    cancelled: 0,
    pending: 0,
    totalRevenue: 0,
    confirmedRevenue: 0,
    completedRevenue: 0
  });

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: {
        label: 'Pending',
        color: 'bg-yellow-100 text-yellow-700',
        icon: <ClockIcon size={12} className="text-yellow-500" />
      },
      confirmed: {
        label: 'Confirmed',
        color: 'bg-emerald-100 text-emerald-700',
        icon: <CheckCircle size={12} className="text-emerald-500" />
      },
      active: {
        label: 'Active',
        color: 'bg-indigo-100 text-indigo-700',
        icon: <Timer size={12} className="text-indigo-500" />
      },
      completed: {
        label: 'Completed',
        color: 'bg-blue-100 text-blue-700',
        icon: <CheckCircle size={12} className="text-blue-500" />
      },
      cancelled: {
        label: 'Cancelled',
        color: 'bg-red-100 text-red-700',
        icon: <XCircle size={12} className="text-red-500" />
      }
    };
    return statusMap[status?.toLowerCase()] || { label: status || 'Unknown', color: 'bg-gray-100 text-gray-700', icon: <AlertCircle size={12} className="text-gray-500" /> };
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
    if (status === 'refunded') return { label: 'Refunded', color: 'bg-purple-100 text-purple-700' };
    if (status === 'failed') return { label: 'Failed', color: 'bg-red-100 text-red-700' };
    return { label: 'Pending', color: 'bg-yellow-100 text-yellow-700' };
  };

  const formatDateDMY = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return d.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTimeOnly = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const formatDateIndian = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = String(d.getFullYear()).slice(2);
    return `${day}/${month}/${year}`;
  };

  const formatTimeIndian = (timeStr) => {
    if (!timeStr) return "N/A";
    if (timeStr.includes('AM') || timeStr.includes('PM')) return timeStr;
    try {
      const parts = timeStr.split(':');
      if (parts.length < 2) return timeStr;
      let hours = parseInt(parts[0]);
      const minutes = parts[1];
      if (isNaN(hours)) return timeStr;
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const hour12 = hours % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    } catch (e) {
      return timeStr;
    }
  };

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

  const formatDateTimeDDMMYYYY = (dateStr) => {
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

  const getTotalDays = (booking) => {
    if (booking.bookingSlots && booking.bookingSlots.length > 0) {
      return booking.bookingSlots.length;
    }
    return booking.totalDays || 1;
  };

  const getTotalHoursDisplay = (booking) => {
    if (booking.bookingSlots && booking.bookingSlots.length > 0) {
      const total = booking.bookingSlots.reduce((sum, slot) => sum + (slot.hours || 0), 0);
      return total;
    }
    return booking.totalHours || 0;
  };

  const fetchChambers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await axios.get(`${API_URL}/api/cabins`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const activeChambers = res.data.filter(c => c.isActive === true && c.isChamber === true);
      setAllChambers(activeChambers);
    } catch (error) {
      console.error("Failed to fetch cabins:", error);
    }
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) { setLoading(false); return; }

        const res = await axios.get(`${API_URL}/api/bookings/owner-bookings`, { headers: { Authorization: `Bearer ${token}` } });
        const allBookings = res.data.bookings || [];
        // Filter ONLY medical bookings (isChamber === true)
        const medicalBookings = allBookings.filter(b => b.cabin?.isChamber === true);
        setBookings(medicalBookings);
        calculateStats(medicalBookings);
      } catch (err) {
        console.error("Failed to fetch cabin bookings:", err);
        toast.error("Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
    fetchChambers();
  }, []);

  const calculateStats = (bookingsData) => {
    const total = bookingsData.length;
    const confirmed = bookingsData.filter(b => b.status === 'confirmed').length;
    const active = bookingsData.filter(b => b.status === 'active').length;
    const completed = bookingsData.filter(b => b.status === 'completed').length;
    const cancelled = bookingsData.filter(b => b.status === 'cancelled').length;
    const pending = bookingsData.filter(b => b.status === 'pending').length;

    const totalRevenue = bookingsData.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    const confirmedRevenue = bookingsData.filter(b => b.status === 'confirmed').reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    const completedRevenue = bookingsData.filter(b => b.status === 'completed').reduce((sum, b) => sum + (b.totalPrice || 0), 0);

    setStats({ totalBookings: total, confirmed, active, completed, cancelled, pending, totalRevenue, confirmedRevenue, completedRevenue });
  };

  const handleUpdateStatus = async () => {
    if (!selectedBooking || !newStatus) { toast.error("Please select a status"); return; }
    setUpdating(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`${API_URL}/api/bookings/update-status/${selectedBooking._id}`, { status: newStatus }, { headers: { Authorization: `Bearer ${token}` } });
      if (response.data.success) {
        const updatedBookings = bookings.map(b => b._id === selectedBooking._id ? { ...b, status: newStatus } : b);
        setBookings(updatedBookings);
        calculateStats(updatedBookings);
        toast.success(`Booking status updated to ${newStatus}`);
        setShowStatusModal(false);
        setSelectedBooking(null);
        setNewStatus("");
      } else {
        toast.error(response.data.message || "Failed to update status");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update status");
    } finally { setUpdating(false); }
  };

  const handlePaymentScreenshotChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPaymentScreenshot(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentScreenshotPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdatePaymentStatus = async () => {
    if (!paymentBooking || !newPaymentStatus) { toast.error("Please select a payment status"); return; }
    if (newPaymentStatus === 'paid' && (!amountPaid || amountPaid <= 0)) { toast.error("Please enter amount paid"); return; }

    if (paymentDetails.paymentMode === 'card') {
      if (!paymentDetails.cardNumber || paymentDetails.cardNumber.replace(/\s/g, '').length < 16) {
        toast.error("Please enter valid card number");
        return;
      }
      if (!paymentDetails.cardHolderName) {
        toast.error("Please enter card holder name");
        return;
      }
      if (!paymentDetails.cardExpiry) {
        toast.error("Please enter card expiry date");
        return;
      }
      if (!paymentDetails.cardCVV || paymentDetails.cardCVV.length < 3) {
        toast.error("Please enter valid CVV");
        return;
      }
    }

    if (paymentDetails.paymentMode === 'upi') {
      if (!paymentDetails.upiId) {
        toast.error("Please enter UPI ID");
        return;
      }
      if (!paymentDetails.upiApp) {
        toast.error("Please enter UPI app name");
        return;
      }
    }

    if (!paymentDetails.transactionId) {
      toast.error("Please enter transaction ID");
      return;
    }

    setUpdatingPayment(true);
    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append('paymentStatus', newPaymentStatus);
      formData.append('amountPaid', amountPaid || paymentBooking.totalPrice);
      formData.append('paymentMode', paymentDetails.paymentMode);
      formData.append('transactionId', paymentDetails.transactionId);
      formData.append('paymentDate', paymentDetails.paymentDate || new Date().toISOString().split('T')[0]);
      formData.append('notes', paymentDetails.notes || '');

      if (paymentDetails.paymentMode === 'card') {
        formData.append('cardNumber', paymentDetails.cardNumber);
        formData.append('cardHolderName', paymentDetails.cardHolderName);
        formData.append('cardExpiry', paymentDetails.cardExpiry);
        formData.append('cardCVV', paymentDetails.cardCVV);
      }

      if (paymentDetails.paymentMode === 'upi') {
        formData.append('upiId', paymentDetails.upiId);
        formData.append('upiApp', paymentDetails.upiApp);
      }

      if (paymentScreenshot) {
        formData.append('screenshot', paymentScreenshot);
      }

      const response = await axios.put(
        `${API_URL}/api/bookings/bookingpayment-status/${paymentBooking._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        const updatedBookings = bookings.map(b =>
          b._id === paymentBooking._id ? {
            ...b,
            paymentStatus: newPaymentStatus,
            paymentDetails: {
              mode: paymentDetails.paymentMode,
              transactionId: paymentDetails.transactionId,
              paymentDate: paymentDetails.paymentDate,
              ...(paymentDetails.paymentMode === 'card' && {
                cardNumber: paymentDetails.cardNumber,
                cardHolderName: paymentDetails.cardHolderName
              }),
              ...(paymentDetails.paymentMode === 'upi' && {
                upiId: paymentDetails.upiId,
                upiApp: paymentDetails.upiApp
              }),
              screenshot: response.data.screenshotUrl || null
            }
          } : b
        );
        setBookings(updatedBookings);
        calculateStats(updatedBookings);
        toast.success(`Payment status updated to ${newPaymentStatus}`);
        setShowPaymentModal(false);
        setPaymentBooking(null);
        setNewPaymentStatus("");
        setAmountPaid(0);
        setPaymentDetails({
          paymentMode: 'cash',
          cardNumber: '',
          cardHolderName: '',
          cardExpiry: '',
          cardCVV: '',
          upiId: '',
          upiApp: '',
          transactionId: '',
          paymentDate: '',
          notes: ''
        });
        setPaymentScreenshot(null);
        setPaymentScreenshotPreview(null);
      } else {
        toast.error(response.data.error || "Failed to update payment status");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update payment status");
    } finally { setUpdatingPayment(false); }
  };

  const resetPaymentModal = () => {
    setShowPaymentModal(false);
    setPaymentBooking(null);
    setNewPaymentStatus("");
    setAmountPaid(0);
    setPaymentDetails({
      paymentMode: 'cash',
      cardNumber: '',
      cardHolderName: '',
      cardExpiry: '',
      cardCVV: '',
      upiId: '',
      upiApp: '',
      transactionId: '',
      paymentDate: '',
      notes: ''
    });
    setPaymentScreenshot(null);
    setPaymentScreenshotPreview(null);
  };

  const handleAddTiming = async () => {
    if (!timingBooking || !newTiming.date || !newTiming.checkIn || !newTiming.checkOut) {
      toast.error("Please fill all timing fields");
      return;
    }
    setUpdatingTiming(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`${API_URL}/api/bookings/update-timings/${timingBooking._id}`, { date: newTiming.date, checkIn: newTiming.checkIn, checkOut: newTiming.checkOut }, { headers: { Authorization: `Bearer ${token}` } });
      if (response.data.success) {
        const updatedBookings = bookings.map(b => b._id === timingBooking._id ? { ...b, visitingTimings: response.data.booking.visitingTimings } : b);
        setBookings(updatedBookings);
        toast.success("Timing added successfully!");
        setShowTimingModal(false);
        setTimingBooking(null);
        setNewTiming({ date: "", checkIn: "", checkOut: "" });
        const res = await axios.get(`${API_URL}/api/bookings/owner-bookings`, { headers: { Authorization: `Bearer ${token}` } });
        const allBookings = res.data.bookings || [];
        const medicalBookings = allBookings.filter(b => b.cabin?.isChamber === true);
        setBookings(medicalBookings);
        calculateStats(medicalBookings);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update timing");
    } finally { setUpdatingTiming(false); }
  };

  const handleDeleteTiming = async (bookingId, timingIndex) => {
    if (!window.confirm("Are you sure you want to delete this timing entry?")) return;
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`${API_URL}/api/bookings/delete-timing/${bookingId}`, { timingIndex }, { headers: { Authorization: `Bearer ${token}` } });
      if (response.data.success) {
        const updatedBookings = bookings.map(b => b._id === bookingId ? { ...b, visitingTimings: response.data.booking.visitingTimings } : b);
        setBookings(updatedBookings);
        toast.success("Timing deleted successfully!");
        const res = await axios.get(`${API_URL}/api/bookings/owner-bookings`, { headers: { Authorization: `Bearer ${token}` } });
        const allBookings = res.data.bookings || [];
        const medicalBookings = allBookings.filter(b => b.cabin?.isChamber === true);
        setBookings(medicalBookings);
        calculateStats(medicalBookings);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to delete timing");
    }
  };

  const handleViewBooking = (booking) => {
    setViewBooking(booking);
    setShowViewModal(true);
  };

  const exportToExcel = () => {
    try {
      if (displayBookings.length === 0) { toast.warning("No bookings to export"); return; }
      const exportData = displayBookings.map((booking, index) => {
        const statusBadge = getStatusBadge(booking.status);
        const paymentMethod = getPaymentMethodBadge(booking.paymentMethod);
        const paymentStatus = getPaymentStatusBadge(booking.paymentStatus);
        const totalDays = getTotalDays(booking);
        const totalHours = getTotalHoursDisplay(booking);
        return {
          'S.No': index + 1,
          'Space Type': 'Medical Chamber',
          'Booking Type': booking.bookingBasis === 'plan' ? 'Plan Booking' : 'Hourly Booking',
          'Cabin Name': booking.cabin?.name || 'Unknown Cabin',
          'Address': booking.cabin?.address || 'No Address',
          'Customer Name': booking.name || booking.user?.name || 'Unknown Guest',
          'Mobile': booking.mobile || booking.user?.mobile || 'N/A',
          'Email': booking.email || booking.user?.email || 'N/A',
          'From Date': booking.startDate ? formatDateDMY(booking.startDate) : 'N/A',
          'To Date': booking.endDate ? formatDateDMY(booking.endDate) : 'N/A',
          'From Time': formatTimeIndian(booking.startTime),
          'To Time': formatTimeIndian(booking.endTime),
          'Duration (Hours)': totalHours,
          'Total Days': totalDays,
          'Subtotal (₹)': booking.subtotal || 0,
          'GST (18%)': booking.gstAmount || 0,
          'Total (₹)': booking.totalPrice || 0,
          'Seats': booking.seatCount || 0,
          'Extra Charge': booking.extraCharge || 0,
          'Status': statusBadge.label,
          'Payment Method': paymentMethod.label,
          'Payment Status': paymentStatus.label,
          'Transaction ID': booking.transactionId || 'N/A',
          'Visiting Days': booking.visitingTimings?.length || 0,
          'Created At': booking.createdAt ? formatDateTime(booking.createdAt) : 'N/A'
        };
      });
      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Medical_Bookings');
      const date = new Date().toISOString().split('T')[0];
      XLSX.writeFile(wb, `medical_bookings_${date}.xlsx`);
      toast.success(`Exported ${displayBookings.length} bookings to Excel!`);
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export bookings");
    }
  };

  // ✅ PROFESSIONAL BLACK & GRAY INVOICE - MEDICAL ONLY
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
          .header-right .space-type {
            font-size: 11px;
            font-weight: 600;
            color: #555555;
            margin-top: 4px;
            padding: 2px 12px;
            background: #f0f0f0;
            display: inline-block;
            border-radius: 2px;
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
                <span style="font-size:11px;font-weight:600;color:#555555;background:#f0f0f0;padding:2px 12px;border-radius:2px;">MEDICAL CHAMBER</span>
              </div>
            </div>
            <div class="header-right">
              <div class="invoice-date">${formatDateDMY(new Date().toISOString())}</div>
            </div>
          </div>

          <!-- BILL TO & CABIN -->
          <div class="info-grid">
            <div class="info-item">
              <div class="label">Bill To</div>
              <div class="value">${booking.name || booking.user?.name || 'Customer'}</div>
              <div class="sub-value">${booking.mobile || booking.user?.mobile || 'N/A'}</div>
              <div class="sub-value">${booking.email || booking.user?.email || 'N/A'}</div>
            </div>
            <div class="info-item">
              <div class="label">Cabin Details</div>
              <div class="value">${cabin.name || 'Unknown'}</div>
              <div class="sub-value">${cabin.address || 'N/A'}</div>
              <div class="sub-value">Capacity: ${cabin.capacity || 'N/A'} seats | Type: ${cabin.cabinType || 'Normal'}</div>
            </div>
          </div>

          <!-- SCHEDULE -->
          <div class="info-grid">
            <div class="info-item">
              <div class="label">Start</div>
              <div class="value">${formatDateDMY(booking.startDate)}</div>
              <div class="sub-value" style="color:#000000;font-weight:600;">${formatTime12(booking.startTime)}</div>
            </div>
            <div class="info-item">
              <div class="label">End</div>
              <div class="value">${formatDateDMY(booking.endDate)}</div>
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
                  <td class="amount">₹${(booking.totalPrice || 0).toFixed(2)}</td>
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
            Created: ${formatDateTimeDDMMYYYY(booking.createdAt)}<br>
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

  // FILTERED BOOKINGS - ONLY MEDICAL
  const filteredBookings = bookings.filter((b) => {
    const search = searchTerm.toLowerCase();
    const matchSearch = b.cabin?.name?.toLowerCase().includes(search) ||
                        b.cabin?.address?.toLowerCase().includes(search) ||
                        b.name?.toLowerCase().includes(search) ||
                        b.mobile?.includes(searchTerm) ||
                        b.user?.name?.toLowerCase().includes(search) ||
                        b.user?.mobile?.includes(searchTerm);
    const matchDate = filterDate ? b.startDate === filterDate : true;
    const matchStatus = filters.status === 'all' || b.status === filters.status;
    const matchPaymentStatus = filters.paymentStatus === 'all' || b.paymentStatus === filters.paymentStatus;
    return matchSearch && matchDate && matchStatus && matchPaymentStatus;
  });

  const filteredVisitBookings = filteredBookings.filter(b => b.bookingType === 'visit');
  const filteredCabinBookings = filteredBookings.filter(b => b.bookingType !== 'visit');

  const getFilteredByTab = () => {
    if (activeTab === 'visits') {
      return filteredVisitBookings;
    } else if (activeTab === 'cabin') {
      return filteredCabinBookings;
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
  const cabinCount = bookings.filter(b => b.bookingType !== 'visit').length;

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
      onClick: () => setFilters(prev => ({ ...prev, status: 'all' }))
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
              Medical <span>Bookings</span>
            </h1>
            <p className="admin-dash__subtitle" style={{ fontSize: '11px' }}>
              Manage all your medical chamber bookings
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
              onClick={() => navigate("/mychamberpayments")}
              className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50 transition"
            >
              <CreditCard size={14} className="text-indigo-600" />
              Payments
            </button>
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

      

        {/* Tabs - Cabin Bookings | Site Visits */}
        <div className="flex items-center gap-2 mb-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('cabin')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
              activeTab === 'cabin'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Stethoscope size={16} className="inline mr-2" />
            Medical Bookings ({cabinCount})
          </button>
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
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 mb-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search medical bookings..."
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
                value={filters.paymentStatus}
                onChange={(e) => setFilters({...filters, paymentStatus: e.target.value})}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
              >
                <option value="all">Payment Status</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
              {(filters.status !== 'all' || filters.paymentStatus !== 'all' || filterDate || searchTerm) && (
                <button
                  onClick={clearFilters}
                  className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
                  title="Clear filters"
                >
                  <XCircleIcon size={16} />
                </button>
              )}
            </div>
          </div>
          <div className="mt-1.5 text-[10px] text-gray-400">
            Showing {displayBookings.length} of {bookings.length} medical bookings
          </div>
        </div>

        {/* Render based on active tab */}
        {activeTab === 'cabin' && renderCabinTable(displayBookings)}
        {activeTab === 'visits' && renderVisitTable(displayBookings)}
        {displayBookings.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-12 text-center">
            <Stethoscope size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium">No medical bookings found</p>
            <p className="text-sm text-gray-400 mt-1">
              {bookings.length === 0 ? "You haven't made any medical bookings yet." : "Try adjusting your filters."}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 text-center text-[9px] text-gray-400 font-medium tracking-wider">
          © IRYAX SPACE — All Rights Reserved
        </div>
      </div>

      {/* ===== VIEW MODAL ===== */}
      {showViewModal && viewBooking && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) setShowViewModal(false); }}>
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-gradient-to-br from-rose-600 to-pink-600 text-white p-6 rounded-t-3xl flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold">Medical Booking Details</h3>
                <p className="text-sm text-rose-200 flex items-center gap-2">
                  <Hash size={14} /> #{viewBooking._id?.slice(-8).toUpperCase()}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-[10px] font-medium">
                    {viewBooking.bookingType === 'visit' ? 'Site Visit' : 'Medical Booking'}
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
              {/* Cabin & Space Type */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <Building2 size={12} /> Cabin Details
                  </p>
                  <p className="mt-1 font-semibold text-gray-800 text-sm">{viewBooking.cabin?.name || 'N/A'}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-0.5 mt-0.5">
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
                <div className="p-4 bg-rose-50 rounded-xl border border-rose-200">
                  <p className="text-[10px] font-bold text-rose-600 uppercase tracking-wider flex items-center gap-1">
                    <Stethoscope size={12} /> Medical
                  </p>
                  <div className="mt-2">
                    <span className="px-3 py-1.5 text-xs font-bold rounded-full inline-flex items-center gap-2 bg-rose-100 text-rose-700">
                      <Stethoscope size={14} /> Medical Chamber
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    <p><span className="font-medium">Booking Type:</span> {viewBooking.bookingType || 'booking'}</p>
                    <p><span className="font-medium">Basis:</span> {viewBooking.bookingBasis || 'hourly'}</p>
                    {viewBooking.selectedPlan && (
                      <p><span className="font-medium">Plan:</span> {viewBooking.selectedPlan.label || 'N/A'}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Customer Details */}
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1">
                  <User size={12} /> Customer Details
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

              {/* Schedule - using DD/MM/YYYY format */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <CalendarDays size={12} /> Start
                  </p>
                  <p className="mt-1 font-semibold text-gray-800">{formatDateDMY(viewBooking.startDate)}</p>
                  <p className="text-sm font-bold text-rose-600">{formatTimeIndian(viewBooking.startTime)}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <CalendarDays size={12} /> End
                  </p>
                  <p className="mt-1 font-semibold text-gray-800">{formatDateDMY(viewBooking.endDate)}</p>
                  <p className="text-sm font-bold text-rose-600">{formatTimeIndian(viewBooking.endTime)}</p>
                </div>
              </div>

              {/* Booking Info */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                  <Info size={12} /> Booking Info
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold">
                    {getTotalHoursDisplay(viewBooking)}h Total
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
                    {getTotalDays(viewBooking)} Days
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

              {/* Multi-day Slots */}
              {viewBooking.bookingSlots && viewBooking.bookingSlots.length > 0 && (
                <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200">
                  <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-2">
                    <CalendarDays size={14} />
                    Booking Slots ({viewBooking.bookingSlots.length} days)
                  </p>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {viewBooking.bookingSlots.map((slot, idx) => (
                      <div key={idx} className="bg-white p-2 rounded-lg border border-indigo-100">
                        <p className="text-xs font-bold text-gray-700">{formatDateDMY(slot.date)}</p>
                        <p className="text-[10px] text-gray-500">{formatTimeIndian(slot.startTime)} - {formatTimeIndian(slot.endTime)}</p>
                        <p className="text-[10px] font-bold text-indigo-600">{slot.hours}h</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Seats */}
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

              {/* Price Breakdown */}
              <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
                <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-2 mb-3">
                  <Calculator size={14} />
                  Price Breakdown
                </p>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center border-b border-emerald-100 pb-1.5">
                    <span className="text-gray-600">Subtotal ({getTotalHoursDisplay(viewBooking)}h × ₹{viewBooking.cabin?.price || 0})</span>
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

              {/* Payment Details */}
              {(viewBooking.transactionId || viewBooking.paymentDetails) && (
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <p className="text-[10px] font-bold text-blue-700 uppercase tracking-wider flex items-center gap-2 mb-2">
                    <Wallet size={14} />
                    Payment Details
                  </p>
                  <div className="grid grid-cols-2 gap-1 text-sm">
                    <div>
                      <p className="text-gray-500 text-xs">Transaction ID</p>
                      <p className="font-mono font-medium text-xs break-all">{viewBooking.transactionId || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Payment Mode</p>
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${getPaymentMethodBadge(viewBooking.paymentMethod).color}`}>
                        {getPaymentMethodBadge(viewBooking.paymentMethod).label}
                      </span>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Payment Status</p>
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${getPaymentStatusBadge(viewBooking.paymentStatus).color}`}>
                        {getPaymentStatusBadge(viewBooking.paymentStatus).label}
                      </span>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Paid to Owner</p>
                      <p className="font-medium">{viewBooking.isPaidToOwner ? '✅ Yes' : '❌ No'}</p>
                    </div>
                    {viewBooking.paymentDetails?.upiId && (
                      <div className="col-span-2">
                        <p className="text-gray-500 text-xs">UPI ID</p>
                        <p className="font-mono text-xs">{viewBooking.paymentDetails.upiId}</p>
                      </div>
                    )}
                    {viewBooking.paymentDetails?.upiApp && (
                      <div>
                        <p className="text-gray-500 text-xs">UPI App</p>
                        <p className="font-medium text-xs">{viewBooking.paymentDetails.upiApp}</p>
                      </div>
                    )}
                    {viewBooking.paymentDetails?.cardNumber && (
                      <div>
                        <p className="text-gray-500 text-xs">Card Number</p>
                        <p className="font-mono text-xs">•••• {viewBooking.paymentDetails.cardNumber.slice(-4)}</p>
                      </div>
                    )}
                    {viewBooking.paymentDetails?.paymentDate && (
                      <div>
                        <p className="text-gray-500 text-xs">Payment Date</p>
                        <p className="font-medium text-xs">{formatDateDMY(viewBooking.paymentDetails.paymentDate)}</p>
                      </div>
                    )}
                    {viewBooking.paymentDetails?.screenshot && (
                      <div className="col-span-2 mt-1">
                        <p className="text-gray-500 text-xs">Screenshot</p>
                        <img 
                          src={`${API_URL}${viewBooking.paymentDetails.screenshot}`} 
                          alt="Payment Screenshot" 
                          className="mt-1 max-h-32 rounded-lg border border-gray-200"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Status */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-gray-50 rounded-xl text-center border border-gray-200">
                  <p className="text-[10px] text-gray-500 font-bold uppercase">Status</p>
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

              {/* Visiting Timings */}
              {viewBooking.visitingTimings && viewBooking.visitingTimings.length > 0 && (
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-[10px] font-medium text-blue-600 uppercase tracking-wider flex items-center gap-1">
                    <History size={14} /> Visit Log ({viewBooking.visitingTimings.length} entries)
                  </p>
                  <div className="space-y-1.5 mt-2">
                    {viewBooking.visitingTimings.map((timing, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm bg-white rounded-lg p-2 border border-blue-100">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-blue-600">Day {idx + 1}</span>
                          <span className="text-slate-600">{formatDateDMY(timing.date)}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-medium text-emerald-600">IN: {formatTimeIndian(timing.checkIn)}</span>
                          <span className="text-xs font-medium text-red-500">OUT: {formatTimeIndian(timing.checkOut)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Extra Info */}
              {(viewBooking.isReplaced || viewBooking.isExtended || viewBooking.cancellationReason) && (
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider flex items-center gap-2">
                    <AlertCircle size={14} /> Additional Info
                  </p>
                  <div className="space-y-1 text-sm mt-1">
                    {viewBooking.isReplaced && (
                      <p><span className="text-gray-500">Replaced:</span> Yes</p>
                    )}
                    {viewBooking.isExtended && (
                      <p><span className="text-gray-500">Extended:</span> Yes</p>
                    )}
                    {viewBooking.cancellationReason && (
                      <p><span className="text-gray-500">Cancellation Reason:</span> {viewBooking.cancellationReason}</p>
                    )}
                    {viewBooking.refundAmount > 0 && (
                      <p><span className="text-gray-500">Refund Amount:</span> ₹{viewBooking.refundAmount}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Created At */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                  <CalendarPlus size={12} /> Booking Created
                </p>
                <p className="mt-1 font-semibold text-gray-800">{formatDateTime(viewBooking.createdAt)}</p>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-200">
                <button
                  onClick={() => { setShowViewModal(false); downloadInvoice(viewBooking); }}
                  className="flex-1 min-w-[120px] py-3 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 transition shadow-sm"
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

      {/* STATUS UPDATE MODAL */}
      {showStatusModal && selectedBooking && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) { setShowStatusModal(false); setSelectedBooking(null); setNewStatus(""); } }}>
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-br from-rose-600 to-pink-600 p-5 text-white rounded-t-3xl flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center"><Edit size={20} className="text-white" /></div>
                <div><h3 className="text-xl font-bold">Update Status</h3><p className="text-sm text-rose-200">{selectedBooking.cabin?.name}</p></div>
              </div>
              <button onClick={() => { setShowStatusModal(false); setSelectedBooking(null); setNewStatus(""); }} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"><X size={20} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-gray-50 rounded-xl p-4 flex justify-between items-center">
                <span className="text-sm text-gray-500">Current Status</span>
                <span className={`px-3 py-1 text-xs font-bold rounded-full inline-flex items-center gap-1.5 ${getStatusBadge(selectedBooking.status).color}`}>
                  {getStatusBadge(selectedBooking.status).icon} {getStatusBadge(selectedBooking.status).label}
                </span>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Select New Status</label>
                <div className="grid grid-cols-2 gap-2">
                  {['pending', 'confirmed', 'active', 'completed', 'cancelled'].map((status) => {
                    const badge = getStatusBadge(status);
                    const isSelected = newStatus === status;
                    return (
                      <button key={status} onClick={() => setNewStatus(status)} className={`py-2.5 rounded-xl text-xs font-bold border transition ${isSelected ? 'border-rose-500 bg-rose-50 text-rose-700' : 'border-gray-200 hover:bg-gray-50 text-gray-700'}`}>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>{badge.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="bg-amber-50 rounded-xl p-3 text-xs text-amber-700 flex items-start gap-2 border border-amber-200">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>Changing status will update the booking visibility and availability.</span>
              </div>
              <div className="flex gap-3">
                <button onClick={handleUpdateStatus} disabled={updating || !newStatus} className={`flex-1 py-3 rounded-xl text-white font-bold transition ${(updating || !newStatus) ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-rose-600 to-pink-600 hover:shadow-lg'}`}>
                  {updating ? 'Updating...' : 'Update Status'}
                </button>
                <button onClick={() => { setShowStatusModal(false); setSelectedBooking(null); setNewStatus(""); }} className="px-5 py-3 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PAYMENT STATUS UPDATE MODAL */}
      {showPaymentModal && paymentBooking && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) resetPaymentModal(); }}>
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-y-auto max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-gradient-to-br from-amber-500 to-amber-600 p-5 text-white rounded-t-3xl flex justify-between items-center z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center"><CreditCard size={20} className="text-white" /></div>
                <div><h3 className="text-xl font-bold">Update Payment</h3><p className="text-sm text-amber-100">₹{paymentBooking.totalPrice}</p></div>
              </div>
              <button onClick={resetPaymentModal} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"><X size={20} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Customer</span><span className="font-semibold">{paymentBooking.name || 'N/A'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Cabin</span><span className="font-semibold">{paymentBooking.cabin?.name || 'N/A'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Current Status</span><span className={`px-3 py-1 text-xs font-bold rounded-full ${getPaymentStatusBadge(paymentBooking.paymentStatus).color}`}>{getPaymentStatusBadge(paymentBooking.paymentStatus).label}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Total Amount</span><span className="font-bold text-gray-800">₹{paymentBooking.totalPrice}</span></div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">New Payment Status</label>
                <div className="grid grid-cols-2 gap-2">
                  {['pending','paid','failed','refunded'].map(s => {
                    const badge = getPaymentStatusBadge(s);
                    const isSelected = newPaymentStatus === s;
                    return (
                      <button key={s} onClick={() => { setNewPaymentStatus(s); if(s === 'paid') setAmountPaid(paymentBooking.totalPrice); else setAmountPaid(0); }} className={`py-2.5 rounded-xl text-xs font-bold border transition ${isSelected ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-gray-200 hover:bg-gray-50 text-gray-700'}`}>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>{badge.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {newPaymentStatus === 'paid' && (
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Amount Paid (₹)</label>
                  <input type="number" value={amountPaid} onChange={(e) => setAmountPaid(Number(e.target.value))} placeholder="Enter amount" className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>
              )}

              {newPaymentStatus === 'paid' && (
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Payment Mode</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button onClick={() => setPaymentDetails({...paymentDetails, paymentMode: 'cash'})} className={`py-2.5 rounded-xl text-xs font-bold border transition ${paymentDetails.paymentMode === 'cash' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-200 hover:bg-gray-50 text-gray-700'}`}>
                      <Store size={16} className="mx-auto mb-1" /> Cash
                    </button>
                    <button onClick={() => setPaymentDetails({...paymentDetails, paymentMode: 'upi'})} className={`py-2.5 rounded-xl text-xs font-bold border transition ${paymentDetails.paymentMode === 'upi' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 hover:bg-gray-50 text-gray-700'}`}>
                      <Smartphone size={16} className="mx-auto mb-1" /> UPI
                    </button>
                    <button onClick={() => setPaymentDetails({...paymentDetails, paymentMode: 'card'})} className={`py-2.5 rounded-xl text-xs font-bold border transition ${paymentDetails.paymentMode === 'card' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:bg-gray-50 text-gray-700'}`}>
                      <CreditCard size={16} className="mx-auto mb-1" /> Card
                    </button>
                  </div>
                </div>
              )}

              {paymentDetails.paymentMode === 'card' && newPaymentStatus === 'paid' && (
                <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-blue-200">
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center gap-2">
                    <CreditCard size={14} /> Card Details
                  </p>
                  <div>
                    <label className="text-xs font-medium text-gray-600 block mb-1">Card Number</label>
                    <input type="text" placeholder="1234 5678 9012 3456" value={paymentDetails.cardNumber} onChange={(e) => setPaymentDetails({...paymentDetails, cardNumber: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 block mb-1">Card Holder Name</label>
                    <input type="text" placeholder="John Doe" value={paymentDetails.cardHolderName} onChange={(e) => setPaymentDetails({...paymentDetails, cardHolderName: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-gray-600 block mb-1">Expiry Date</label>
                      <input type="text" placeholder="MM/YY" value={paymentDetails.cardExpiry} onChange={(e) => setPaymentDetails({...paymentDetails, cardExpiry: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600 block mb-1">CVV</label>
                      <input type="password" placeholder="***" maxLength="4" value={paymentDetails.cardCVV} onChange={(e) => setPaymentDetails({...paymentDetails, cardCVV: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                </div>
              )}

              {paymentDetails.paymentMode === 'upi' && newPaymentStatus === 'paid' && (
                <div className="space-y-3 bg-purple-50 p-4 rounded-xl border border-purple-200">
                  <p className="text-xs font-bold text-purple-600 uppercase tracking-wider flex items-center gap-2">
                    <Smartphone size={14} /> UPI Details
                  </p>
                  <div>
                    <label className="text-xs font-medium text-gray-600 block mb-1">UPI ID</label>
                    <input type="text" placeholder="example@upi" value={paymentDetails.upiId} onChange={(e) => setPaymentDetails({...paymentDetails, upiId: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 block mb-1">UPI App</label>
                    <select value={paymentDetails.upiApp} onChange={(e) => setPaymentDetails({...paymentDetails, upiApp: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                      <option value="">Select UPI App</option>
                      <option value="Google Pay">Google Pay</option>
                      <option value="PhonePe">PhonePe</option>
                      <option value="Paytm">Paytm</option>
                      <option value="Amazon Pay">Amazon Pay</option>
                      <option value="BHIM">BHIM</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              )}

              {newPaymentStatus === 'paid' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Transaction ID</label>
                    <input type="text" placeholder="TXN123456789" value={paymentDetails.transactionId} onChange={(e) => setPaymentDetails({...paymentDetails, transactionId: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Payment Date</label>
                    <input type="date" value={paymentDetails.paymentDate} onChange={(e) => setPaymentDetails({...paymentDetails, paymentDate: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
                  </div>
                </div>
              )}

              {newPaymentStatus === 'paid' && paymentDetails.paymentMode !== 'cash' && (
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Payment Screenshot</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-amber-400 transition cursor-pointer relative" onClick={() => document.getElementById('screenshotUpload').click()}>
                    <input id="screenshotUpload" type="file" accept="image/*" className="hidden" onChange={handlePaymentScreenshotChange} />
                    {paymentScreenshotPreview ? (
                      <div className="relative">
                        <img src={paymentScreenshotPreview} alt="Screenshot Preview" className="max-h-48 mx-auto rounded-lg" />
                        <button onClick={(e) => { e.stopPropagation(); setPaymentScreenshot(null); setPaymentScreenshotPreview(null); }} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition">
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="py-4">
                        <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">Click to upload screenshot</p>
                        <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {newPaymentStatus === 'paid' && (
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Notes (Optional)</label>
                  <textarea rows="2" placeholder="Any additional notes about this payment..." value={paymentDetails.notes} onChange={(e) => setPaymentDetails({...paymentDetails, notes: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none" />
                </div>
              )}

              <div className="bg-amber-50 rounded-xl p-3 text-xs text-amber-700 flex items-start gap-2 border border-amber-200">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>Marking as paid will add the amount to the owner's wallet. All payment details will be securely stored.</span>
              </div>
              <div className="flex gap-3">
                <button onClick={handleUpdatePaymentStatus} disabled={updatingPayment || !newPaymentStatus || (newPaymentStatus === 'paid' && (!amountPaid || amountPaid <= 0))} className={`flex-1 py-3 rounded-xl text-white font-bold transition ${(updatingPayment || !newPaymentStatus || (newPaymentStatus === 'paid' && (!amountPaid || amountPaid <= 0))) ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:shadow-lg'}`}>
                  {updatingPayment ? 'Updating...' : 'Update Payment'}
                </button>
                <button onClick={resetPaymentModal} className="px-5 py-3 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VISITING TIMINGS MODAL */}
      {showTimingModal && timingBooking && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) { setShowTimingModal(false); setTimingBooking(null); setNewTiming({ date: "", checkIn: "", checkOut: "" }); } }}>
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-5 text-white rounded-t-3xl flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center"><Plus size={20} className="text-white" /></div>
                <div><h3 className="text-xl font-bold">Add Visit Timing</h3><p className="text-sm text-blue-200">{timingBooking.cabin?.name}</p></div>
              </div>
              <button onClick={() => { setShowTimingModal(false); setTimingBooking(null); setNewTiming({ date: "", checkIn: "", checkOut: "" }); }} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"><X size={20} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Customer</span><span className="font-semibold">{timingBooking.name || 'N/A'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Period</span><span className="font-medium">{formatDateDMY(timingBooking.startDate)} - {formatDateDMY(timingBooking.endDate)}</span></div>
                <div className="flex justify-between pt-2 border-t border-gray-200"><span className="text-gray-500">Visits Logged</span><span className="font-bold text-blue-600">{timingBooking.visitingTimings?.length || 0}</span></div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Visit Date</label>
                <input type="date" value={newTiming.date} onChange={(e) => setNewTiming({ ...newTiming, date: e.target.value })} className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Check In</label>
                  <input type="time" value={newTiming.checkIn} onChange={(e) => setNewTiming({ ...newTiming, checkIn: e.target.value })} className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Check Out</label>
                  <input type="time" value={newTiming.checkOut} onChange={(e) => setNewTiming({ ...newTiming, checkOut: e.target.value })} className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              {timingBooking.visitingTimings && timingBooking.visitingTimings.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Existing Visits</p>
                  <div className="space-y-1 mt-1.5">
                    {timingBooking.visitingTimings.map((t, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">{formatDateDMY(t.date)}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-600 font-medium">{formatTimeIndian(t.checkIn)}</span>
                          <span className="text-gray-300">-</span>
                          <span className="text-red-500 font-medium">{formatTimeIndian(t.checkOut)}</span>
                          <button onClick={() => { if (window.confirm("Delete this timing entry?")) { handleDeleteTiming(timingBooking._id, idx); } }} className="text-red-400 hover:text-red-600 transition-colors"><Trash2 size={12} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="bg-blue-50 rounded-xl p-3 text-xs text-blue-700 flex items-start gap-2 border border-blue-200">
                <Clock size={16} className="shrink-0 mt-0.5" />
                <span>Add check-in and check-out times for each visit day.</span>
              </div>
              <div className="flex gap-3">
                <button onClick={handleAddTiming} disabled={updatingTiming} className={`flex-1 py-3 rounded-xl text-white font-bold transition ${updatingTiming ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:shadow-lg'}`}>
                  {updatingTiming ? 'Adding...' : 'Add Timing'}
                </button>
                <button onClick={() => { setShowTimingModal(false); setTimingBooking(null); setNewTiming({ date: "", checkIn: "", checkOut: "" }); }} className="px-5 py-3 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ===== RENDER SITE VISIT TABLE =====
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

                return (
                  <tr key={b._id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-3 py-2">
                      <span className="text-[10px] font-semibold text-gray-400">#{idx + 1}</span>
                    </td>
                    <td className="px-3 py-2">
                      <div>
                        <p className="font-semibold text-gray-900 text-xs">
                          {b.cabin?.name || 'Unknown Cabin'}
                        </p>
                        <p className="text-[9px] text-gray-400 flex items-center gap-0.5">
                          <MapPin size={9} />
                          {b.cabin?.address?.split(',')[0] || 'N/A'}
                        </p>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <span className="px-2 py-0.5 text-[9px] font-bold rounded-full inline-flex items-center gap-1 bg-rose-100 text-rose-700">
                        <Stethoscope size={9} /> Medical
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <span className="text-xs font-medium text-gray-700">{formatDateDMY(b.startDate)}</span>
                    </td>
                    <td className="px-3 py-2">
                      <span className="text-xs font-medium text-gray-700">{formatTimeIndian(b.startTime)}</span>
                    </td>
                    <td className="px-3 py-2">
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${status.color}`}>{status.label}</span>
                    </td>
                    <td className="px-3 py-2">
                      <span className="text-[10px] text-gray-500 font-medium">{formatDateTime(b.createdAt)}</span>
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
                        <button 
                          onClick={() => { setSelectedBooking(b); setNewStatus(b.status || 'pending'); setShowStatusModal(true); }} 
                          className="p-1 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition"
                          title="Update Status"
                        >
                          <Edit size={13} />
                        </button>
                        <button
                          onClick={() => downloadInvoice(b)}
                          className="p-1 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition"
                          title="Invoice"
                        >
                          <FileDown size={13} />
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

  // ===== RENDER CABIN BOOKINGS TABLE =====
  function renderCabinTable(bookingsList) {
    if (bookingsList.length === 0) {
      return (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <div className="flex flex-col items-center text-gray-400">
            <Stethoscope size={32} className="opacity-20 mb-2" />
            <p className="text-sm font-medium">No medical bookings found</p>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-4 py-3 bg-rose-50 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Stethoscope size={16} className="text-rose-600" />
            <h3 className="font-bold text-gray-800">Medical Bookings</h3>
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
                const totalDays = getTotalDays(b);
                const totalHours = getTotalHoursDisplay(b);

                return (
                  <tr key={b._id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-3 py-2">
                      <span className="text-[10px] font-semibold text-gray-400">{idx + 1}</span>
                    </td>
                    <td className="px-3 py-2">
                      <div>
                        <p className="font-semibold text-gray-900 text-xs">
                          {b.cabin?.name || 'Unknown'}
                        </p>
                        <p className="text-[9px] text-gray-400 flex items-center gap-0.5">
                          <MapPin size={9} />
                          {b.cabin?.address?.split(',')[0] || 'N/A'}
                        </p>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <span className="px-2 py-0.5 text-[9px] font-bold rounded-full inline-flex items-center gap-1 bg-rose-100 text-rose-700">
                        <Stethoscope size={9} /> Medical
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <div>
                        <span className="text-xs font-medium text-gray-700">{formatDateDMY(b.startDate)}</span>
                        <p className="text-[9px] text-rose-600 font-medium">{formatTimeIndian(b.startTime)}</p>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <div>
                        <span className="text-xs font-medium text-gray-700">{formatDateDMY(b.endDate)}</span>
                        <p className="text-[9px] text-rose-600 font-medium">{formatTimeIndian(b.endTime)}</p>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full text-[9px] font-bold">{totalHours}h</span>
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
                      <span className="text-xs font-bold text-indigo-600">₹{b.totalPrice || 0}</span>
                      {b.extraCharge > 0 && (
                        <p className="text-[8px] text-amber-500">+₹{b.extraCharge} seat</p>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <span className="text-[10px] text-gray-500 font-medium">{formatDateTime(b.createdAt)}</span>
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
                        <button 
                          onClick={() => { setTimingBooking(b); setNewTiming({ date: "", checkIn: "", checkOut: "" }); setShowTimingModal(true); }} 
                          className="p-1 bg-cyan-50 text-cyan-700 rounded-lg hover:bg-cyan-100 transition"
                          title="Add Timing"
                        >
                          <Plus size={13} />
                        </button>
                        <button 
                          onClick={() => { setSelectedBooking(b); setNewStatus(b.status || 'pending'); setShowStatusModal(true); }} 
                          className="p-1 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition"
                          title="Update Status"
                        >
                          <Edit size={13} />
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
};

export default ChamberBookings;