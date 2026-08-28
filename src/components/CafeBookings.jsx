// CafeBookings.jsx - Complete Cafe & Dining Table Bookings Management
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CafeNavbar from "./CafeNavbar";
import {
  Calendar,
  User,
  Phone,
  MapPin,
  Clock,
  IndianRupee,
  Search,
  X,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  AlertCircle,
  Eye,
  Edit,
  Timer,
  Download,
  Users,
  CreditCard,
  Building2,
  Receipt,
  Crown,
  Filter,
  XCircle as XCircleIcon,
  UtensilsCrossed,
  Loader2,
  ReceiptText,
  Layout,
  Calendar as CalendarIcon,
  DollarSign,
  FileText,
  Check,
  Clock as ClockIcon2,
  AlertTriangle,
  Hash,
  History,
  Armchair,
  Stethoscope,
  Briefcase,
  Layers,
  Wallet,
  Info,
  CalendarDays,
  Ticket,
  Printer,
  Store,
  Smartphone,
  Upload,
  Trash2,
  Plus,
  ArrowUpRight,
  QrCode
} from "lucide-react";
import { toast } from "react-toastify";
import * as XLSX from 'xlsx';
import "./Dashboard.css";

const API_URL = import.meta.env.VITE_API_URL || "https://spaceapi.iryax.com";

const CafeBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();

  // ─── MODALS ───
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [updating, setUpdating] = useState(false);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentBooking, setPaymentBooking] = useState(null);
  const [newPaymentStatus, setNewPaymentStatus] = useState("");
  const [amountPaid, setAmountPaid] = useState(0);
  const [updatingPayment, setUpdatingPayment] = useState(false);
  const [paymentMode, setPaymentMode] = useState("cash");
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [paymentScreenshotPreview, setPaymentScreenshotPreview] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState({
    transactionId: "",
    paymentDate: "",
    notes: "",
    upiId: "",
    upiApp: "",
    cardNumber: "",
    cardHolderName: "",
    cardExpiry: "",
    cardCVV: ""
  });

  const [showViewModal, setShowViewModal] = useState(false);
  const [viewBooking, setViewBooking] = useState(null);

  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceBooking, setInvoiceBooking] = useState(null);

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

  // ─── HELPERS ───
  const isCafeBooking = (b) => {
    if (!b) return false;
    const cabin = b.cabin || b.cabinId;
    if (!cabin) return true;
    if (cabin.isChamber === true) return false;
    if (cabin.isCafe === true) return true;
    if (cabin.spaceType === "cafe" || cabin.type === "cafe") return true;

    const name = (cabin.name || "").toLowerCase();
    const spec = (cabin.cabin || cabin.tableNumber || "").toLowerCase();

    return (
      name.includes("cafe") ||
      name.includes("coffee") ||
      name.includes("dining") ||
      name.includes("bistro") ||
      name.includes("restaurant") ||
      name.includes("tea") ||
      spec.includes("table") ||
      spec.includes("booth") ||
      Boolean(cabin.tableNumber)
    );
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700', icon: <ClockIcon size={12} className="text-yellow-500" /> },
      confirmed: { label: 'Confirmed', color: 'bg-emerald-100 text-emerald-700', icon: <CheckCircle size={12} className="text-emerald-500" /> },
      active: { label: 'Active', color: 'bg-indigo-100 text-indigo-700', icon: <Timer size={12} className="text-indigo-500" /> },
      completed: { label: 'Completed', color: 'bg-blue-100 text-blue-700', icon: <CheckCircle size={12} className="text-blue-500" /> },
      cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700', icon: <XCircle size={12} className="text-red-500" /> }
    };
    return statusMap[status?.toLowerCase()] || { label: status || 'Unknown', color: 'bg-gray-100 text-gray-700', icon: <AlertCircle size={12} className="text-gray-500" /> };
  };

  const getPaymentMethodBadge = (method) => {
    if (method === 'cash' || method === 'counter') return { label: 'Cash', color: 'bg-orange-100 text-orange-700' };
    if (method === 'upi') return { label: 'UPI', color: 'bg-purple-100 text-purple-700' };
    if (method === 'card') return { label: 'Card', color: 'bg-blue-100 text-blue-700' };
    return { label: method || 'Online', color: 'bg-blue-100 text-blue-700' };
  };

  const getPaymentStatusBadge = (status) => {
    if (status === 'paid') return { label: 'Paid', color: 'bg-emerald-100 text-emerald-700' };
    if (status === 'refunded') return { label: 'Refunded', color: 'bg-purple-100 text-purple-700' };
    if (status === 'failed') return { label: 'Failed', color: 'bg-red-100 text-red-700' };
    return { label: 'Pending', color: 'bg-yellow-100 text-yellow-700' };
  };

  const getCafeTypeBadge = (cabin) => {
    if (!cabin) return { label: 'Standard', icon: Layout, className: 'bg-blue-100 text-blue-700' };
    if (cabin.isCafe) return { label: 'Cafe', icon: UtensilsCrossed, className: 'bg-amber-100 text-amber-700' };
    if (cabin.cabinType === 'exclusive') return { label: 'VIP', icon: Crown, className: 'bg-purple-100 text-purple-700' };
    return { label: 'Standard', icon: Layout, className: 'bg-blue-100 text-blue-700' };
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
    return d.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
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
    } catch (e) { return timeStr; }
  };

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const getTotalDays = (booking) => {
    if (booking.bookingSlots && booking.bookingSlots.length > 0) return booking.bookingSlots.length;
    return booking.totalDays || 1;
  };

  const getTotalHoursDisplay = (booking) => {
    if (booking.bookingSlots && booking.bookingSlots.length > 0) {
      return booking.bookingSlots.reduce((sum, slot) => sum + (slot.hours || 0), 0);
    }
    return booking.totalHours || 0;
  };

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

  // ─── FETCH ───
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) { setLoading(false); return; }

      const res = await axios.get(`${API_URL}/api/bookings/owner-bookings`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const allBookings = res.data.bookings || res.data || [];
      const cafeBookings = allBookings.filter(isCafeBooking);

      setBookings(cafeBookings);
      setFilteredBookings(cafeBookings);
      calculateStats(cafeBookings);
    } catch (err) {
      console.error("Failed to fetch cafe bookings:", err);
      toast.error("Could not load cafe bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // ─── FILTERS ───
  const applyFilters = () => {
    let filtered = [...bookings];

    if (activeTab !== "all") {
      filtered = filtered.filter(b => b.status?.toLowerCase() === activeTab);
    }

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(b => {
        const cabin = b.cabin || b.cabinId;
        return (
          cabin?.name?.toLowerCase().includes(q) ||
          b.name?.toLowerCase().includes(q) ||
          b.user?.name?.toLowerCase().includes(q) ||
          cabin?.tableNumber?.toLowerCase().includes(q)
        );
      });
    }

    if (filterDate) {
      filtered = filtered.filter(b => b.startDate === filterDate);
    }

    if (filterType !== "all") {
      filtered = filtered.filter(b => {
        const cabin = b.cabin || b.cabinId;
        if (filterType === "cafe") return cabin?.isCafe === true;
        if (filterType === "exclusive") return cabin?.cabinType === "exclusive" && !cabin?.isCafe;
        if (filterType === "normal") return cabin?.cabinType === "normal" && !cabin?.isCafe;
        return true;
      });
    }

    setFilteredBookings(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [bookings, activeTab, searchTerm, filterDate, filterType]);

  const clearFilters = () => {
    setSearchTerm("");
    setFilterDate("");
    setFilterType("all");
    setActiveTab("all");
  };

  // ─── STATUS UPDATE ───
  const handleUpdateStatus = async () => {
    if (!selectedBooking || !newStatus) { toast.error("Please select a status"); return; }
    setUpdating(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_URL}/api/bookings/update-status/${selectedBooking._id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updated = bookings.map((b) => (b._id === selectedBooking._id ? { ...b, status: newStatus } : b));
      setBookings(updated);
      calculateStats(updated);

      toast.success(`Booking status updated to "${newStatus}"`);
      setShowStatusModal(false);
      setSelectedBooking(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateStatusFromView = async (bookingId, status) => {
    if (!status) { toast.error("Please select a status"); return; }
    setUpdating(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_URL}/api/bookings/update-status/${bookingId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updated = bookings.map((b) => (b._id === bookingId ? { ...b, status } : b));
      setBookings(updated);
      calculateStats(updated);
      if (viewBooking && viewBooking._id === bookingId) {
        setViewBooking({ ...viewBooking, status });
      }
      toast.success(`Booking status updated to ${status}`);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  // ─── PAYMENT UPDATE ───
  const handlePaymentScreenshotChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPaymentScreenshot(file);
      const reader = new FileReader();
      reader.onloadend = () => { setPaymentScreenshotPreview(reader.result); };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdatePayment = async () => {
    if (!paymentBooking || !newPaymentStatus) { toast.error("Please select a payment status"); return; }
    if (newPaymentStatus === 'paid' && (!amountPaid || amountPaid <= 0)) { toast.error("Please enter amount paid"); return; }

    if (paymentDetails.paymentMode === 'card') {
      if (!paymentDetails.cardNumber || paymentDetails.cardNumber.replace(/\s/g, '').length < 16) { toast.error("Please enter valid card number"); return; }
      if (!paymentDetails.cardHolderName) { toast.error("Please enter card holder name"); return; }
      if (!paymentDetails.cardExpiry) { toast.error("Please enter card expiry date"); return; }
      if (!paymentDetails.cardCVV || paymentDetails.cardCVV.length < 3) { toast.error("Please enter valid CVV"); return; }
    }

    if (paymentDetails.paymentMode === 'upi') {
      if (!paymentDetails.upiId) { toast.error("Please enter UPI ID"); return; }
      if (!paymentDetails.upiApp) { toast.error("Please enter UPI app name"); return; }
    }

    if (!paymentDetails.transactionId) { toast.error("Please enter transaction ID"); return; }

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
        if (viewBooking && viewBooking._id === paymentBooking._id) {
          setViewBooking({ ...viewBooking, paymentStatus: newPaymentStatus });
        }
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
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update payment status");
    } finally {
      setUpdatingPayment(false);
    }
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

  // ─── EXPORT ───
  const exportToExcel = () => {
    try {
      if (filteredBookings.length === 0) { toast.warning("No bookings to export"); return; }
      const exportData = filteredBookings.map((booking, index) => {
        const cabin = booking.cabin || booking.cabinId;
        const statusBadge = getStatusBadge(booking.status);
        const paymentMethod = getPaymentMethodBadge(booking.paymentMethod);
        const paymentStatus = getPaymentStatusBadge(booking.paymentStatus);
        const typeBadge = getCafeTypeBadge(cabin);
        return {
          'S.No': index + 1,
          'Cafe Name': cabin?.name || 'Unknown Cafe',
          'Table': cabin?.tableNumber || cabin?.cabin || 'N/A',
          'Address': cabin?.address || 'No Address',
          'Type': typeBadge.label,
          'Guest Name': booking.name || booking.user?.name || 'Guest',
          'Mobile': booking.mobile || booking.user?.mobile || 'N/A',
          'Email': booking.email || booking.user?.email || 'N/A',
          'Start Date': formatDateDMY(booking.startDate),
          'Start Time': formatTimeIndian(booking.startTime),
          'End Date': formatDateDMY(booking.endDate),
          'End Time': formatTimeIndian(booking.endTime),
          'Hours': getTotalHoursDisplay(booking),
          'Days': getTotalDays(booking),
          'Seats': booking.seatCount || 0,
          'Seat Names': booking.selectedSeats?.map(s => s.name).join(', ') || 'N/A',
          'Subtotal (₹)': booking.subtotal || 0,
          'GST (18%)': booking.gstAmount || 0,
          'Total (₹)': booking.totalPrice || 0,
          'Status': statusBadge.label,
          'Payment Method': paymentMethod.label,
          'Payment Status': paymentStatus.label,
          'Created At': formatDateTime(booking.createdAt) || 'N/A'
        };
      });
      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Cafe_Bookings');
      const date = new Date().toISOString().split('T')[0];
      XLSX.writeFile(wb, `cafe_bookings_${date}.xlsx`);
      toast.success(`Exported ${filteredBookings.length} bookings to Excel!`);
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export bookings");
    }
  };

  // ─── INVOICE ───
  const handlePrintInvoice = (booking) => {
    setInvoiceBooking(booking);
    setShowInvoiceModal(true);
  };

  const printInvoice = () => {
    const win = window.open('', '_blank', 'width=900,height=700');
    if (!win) {
      toast.error('Please allow popups to print invoice');
      return;
    }

    const formatDateDMYFn = (dateStr) => {
      if (!dateStr) return "N/A";
      const d = new Date(dateStr);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    };

    const formatTimeIndianFn = (timeStr) => {
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
      } catch (e) { return timeStr; }
    };

    const getTotalHoursDisplayFn = (booking) => {
      if (booking.bookingSlots && booking.bookingSlots.length > 0) {
        return booking.bookingSlots.reduce((sum, slot) => sum + (slot.hours || 0), 0);
      }
      return booking.totalHours || 0;
    };

    const getTotalDaysFn = (booking) => {
      if (booking.bookingSlots && booking.bookingSlots.length > 0) return booking.bookingSlots.length;
      return booking.totalDays || 1;
    };

    const getStatusBadgeFn = (status) => {
      const map = {
        pending: 'badge-pending',
        confirmed: 'badge-confirmed',
        active: 'badge-active',
        completed: 'badge-completed',
        cancelled: 'badge-cancelled'
      };
      return map[status?.toLowerCase()] || 'badge-pending';
    };

    const getPaymentStatusBadgeFn = (status) => {
      const map = {
        paid: 'badge-paid',
        pending: 'badge-pending',
        failed: 'badge-pending',
        refunded: 'badge-pending'
      };
      return map[status?.toLowerCase()] || 'badge-pending';
    };

    const getPaymentMethodBadgeFn = (method) => {
      const map = {
        cash: 'badge-cash',
        upi: 'badge-upi',
        card: 'badge-card'
      };
      return map[method?.toLowerCase()] || 'badge-cash';
    };

    const b = invoiceBooking;

    win.document.write(`
      <html>
        <head>
          <title>Invoice - ${b?.name || 'Guest'}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; 
              background: #f5f7fa; 
              padding: 30px; 
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
            }
            .invoice-container {
              max-width: 720px;
              width: 100%;
              background: #ffffff;
              border-radius: 16px;
              padding: 35px 40px 30px;
              box-shadow: 0 4px 24px rgba(0,0,0,0.06);
            }
            .invoice-header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              border-bottom: 2px solid #e5e7eb;
              padding-bottom: 18px;
              margin-bottom: 20px;
            }
            .invoice-header .cafe-name {
              font-size: 22px;
              font-weight: 700;
              color: #111827;
            }
            .invoice-header .cafe-address {
              font-size: 13px;
              color: #6b7280;
              margin-top: 2px;
            }
            .invoice-header .cafe-type {
              font-size: 11px;
              color: #9ca3af;
              font-weight: 600;
              letter-spacing: 0.5px;
              text-transform: uppercase;
              margin-top: 2px;
            }
            .invoice-header .right-section {
              text-align: right;
            }
            .invoice-header .right-section .invoice-label {
              font-size: 11px;
              color: #9ca3af;
              font-weight: 600;
              letter-spacing: 0.5px;
              text-transform: uppercase;
            }
            .invoice-header .right-section .invoice-number {
              font-size: 14px;
              font-weight: 600;
              color: #111827;
            }
            .section-title {
              font-size: 10px;
              font-weight: 700;
              color: #9ca3af;
              letter-spacing: 0.8px;
              text-transform: uppercase;
              margin-bottom: 8px;
            }
            .bill-to {
              background: #f9fafb;
              border-radius: 10px;
              padding: 14px 18px;
              margin-bottom: 16px;
            }
            .bill-to .name {
              font-size: 16px;
              font-weight: 600;
              color: #111827;
            }
            .bill-to .phone {
              font-size: 13px;
              color: #4b5563;
            }
            .bill-to .email {
              font-size: 13px;
              color: #4b5563;
            }
            .details-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 12px;
              margin-bottom: 16px;
            }
            .details-grid .detail-box {
              background: #f9fafb;
              border-radius: 10px;
              padding: 12px 16px;
            }
            .details-grid .detail-box .label {
              font-size: 9px;
              font-weight: 700;
              color: #9ca3af;
              letter-spacing: 0.5px;
              text-transform: uppercase;
            }
            .details-grid .detail-box .value {
              font-size: 14px;
              font-weight: 600;
              color: #111827;
              margin-top: 2px;
            }
            .details-grid .detail-box .value-small {
              font-size: 13px;
              font-weight: 500;
              color: #4b5563;
              margin-top: 2px;
            }
            .slots-section {
              background: #f9fafb;
              border-radius: 10px;
              padding: 14px 18px;
              margin-bottom: 16px;
            }
            .slots-section .slots-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 10px;
              margin-top: 8px;
            }
            .slots-section .slot-item {
              background: white;
              border-radius: 8px;
              padding: 10px 14px;
              border: 1px solid #e5e7eb;
            }
            .slots-section .slot-item .date {
              font-size: 13px;
              font-weight: 600;
              color: #111827;
            }
            .slots-section .slot-item .time {
              font-size: 12px;
              color: #4b5563;
            }
            .slots-section .slot-item .hours {
              font-size: 12px;
              font-weight: 600;
              color: #f59e0b;
            }
            .seats-section {
              background: #f9fafb;
              border-radius: 10px;
              padding: 14px 18px;
              margin-bottom: 16px;
            }
            .seats-section .seats-list {
              display: flex;
              flex-wrap: wrap;
              gap: 6px;
              margin-top: 6px;
            }
            .seats-section .seats-list .seat-tag {
              background: white;
              border: 1px solid #e5e7eb;
              border-radius: 6px;
              padding: 4px 12px;
              font-size: 13px;
              font-weight: 500;
              color: #111827;
            }
            .seats-section .extra-charge {
              font-size: 12px;
              color: #6b7280;
              margin-top: 6px;
            }
            .price-breakdown {
              background: #f9fafb;
              border-radius: 10px;
              padding: 14px 18px;
              margin-bottom: 16px;
            }
            .price-breakdown .row {
              display: flex;
              justify-content: space-between;
              padding: 5px 0;
              font-size: 13px;
              color: #4b5563;
              border-bottom: 1px solid #f3f4f6;
            }
            .price-breakdown .row:last-child {
              border-bottom: none;
            }
            .price-breakdown .row .label {
              color: #6b7280;
            }
            .price-breakdown .row .amount {
              font-weight: 500;
              color: #111827;
            }
            .price-breakdown .total-row {
              display: flex;
              justify-content: space-between;
              padding: 10px 0 4px;
              border-top: 2px solid #d1d5db;
              margin-top: 4px;
            }
            .price-breakdown .total-row .label {
              font-size: 15px;
              font-weight: 700;
              color: #111827;
            }
            .price-breakdown .total-row .amount {
              font-size: 20px;
              font-weight: 800;
              color: #f59e0b;
            }
            .payment-status-row {
              display: grid;
              grid-template-columns: 1fr 1fr 1fr;
              gap: 12px;
              margin-bottom: 16px;
            }
            .payment-status-row .status-box {
              background: #f9fafb;
              border-radius: 10px;
              padding: 12px 16px;
              text-align: center;
            }
            .payment-status-row .status-box .label {
              font-size: 9px;
              font-weight: 700;
              color: #9ca3af;
              letter-spacing: 0.5px;
              text-transform: uppercase;
            }
            .payment-status-row .status-box .value {
              font-size: 13px;
              font-weight: 600;
              color: #111827;
              margin-top: 3px;
            }
            .payment-status-row .status-box .badge {
              display: inline-block;
              padding: 2px 12px;
              border-radius: 20px;
              font-size: 11px;
              font-weight: 600;
            }
            .badge-confirmed { background: #dbeafe; color: #1e40af; }
            .badge-pending { background: #fef3c7; color: #92400e; }
            .badge-paid { background: #d1fae5; color: #065f46; }
            .badge-completed { background: #d1fae5; color: #065f46; }
            .badge-cancelled { background: #fee2e2; color: #991b1b; }
            .badge-active { background: #e0e7ff; color: #3730a3; }
            .badge-cash { background: #fef3c7; color: #92400e; }
            .badge-upi { background: #ede9fe; color: #5b21b6; }
            .badge-card { background: #dbeafe; color: #1e40af; }
            .invoice-footer {
              text-align: center;
              padding-top: 16px;
              border-top: 1px solid #e5e7eb;
              margin-top: 8px;
            }
            .invoice-footer .powered {
              font-size: 11px;
              color: #9ca3af;
              font-weight: 500;
            }
            .invoice-footer .created {
              font-size: 10px;
              color: #d1d5db;
              margin-top: 2px;
            }
            .print-btn-container {
              text-align: center;
              margin-top: 20px;
            }
            .print-btn-container button {
              padding: 10px 36px;
              border-radius: 10px;
              font-weight: 600;
              font-size: 14px;
              border: none;
              cursor: pointer;
              transition: all 0.2s;
            }
            .print-btn-container .print-btn {
              background: #f59e0b;
              color: white;
            }
            .print-btn-container .print-btn:hover {
              background: #d97706;
            }
            .print-btn-container .close-btn {
              background: #e5e7eb;
              color: #374151;
              margin-left: 10px;
            }
            .print-btn-container .close-btn:hover {
              background: #d1d5db;
            }
            @media print {
              body { background: white; padding: 0; }
              .invoice-container { box-shadow: none; border-radius: 0; padding: 30px; }
              .print-btn-container { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="invoice-container" id="invoice-print-content">
            <!-- HEADER -->
            <div class="invoice-header">
              <div>
                <div class="cafe-name">${b?.cabin?.name || 'Cafe'}</div>
                <div class="cafe-address">${b?.cabin?.address || ''}</div>
                <div class="cafe-type">${b?.cabin?.spaceType || 'CO-WORKING SPACE'}</div>
              </div>
              <div class="right-section">
                <div class="invoice-label">Invoice</div>
                <div class="invoice-number">#${b?._id?.slice(-8).toUpperCase()}</div>
              </div>
            </div>

            <!-- BILL TO -->
            <div class="bill-to">
              <div class="section-title">BILL TO</div>
              <div class="name">${b?.name || 'Guest'}</div>
              <div class="phone">${b?.mobile || 'N/A'}</div>
              <div class="email">${b?.email || 'N/A'}</div>
            </div>

            <!-- CABIN DETAILS -->
            <div style="margin-bottom:12px;">
              <div class="section-title">CABIN DETAILS</div>
              <div style="background:#f9fafb;border-radius:10px;padding:12px 16px;">
                <div style="font-size:14px;font-weight:600;color:#111827;">${b?.cabin?.name || 'Unknown'}</div>
                <div style="font-size:12px;color:#6b7280;">${b?.cabin?.address?.split(',')[0] || ''}</div>
                <div style="font-size:12px;color:#6b7280;margin-top:4px;">
                  Capacity: ${b?.cabin?.capacity || 'N/A'} seats 
                  | Type: ${b?.cabin?.cabinType || 'normal'}
                </div>
              </div>
            </div>

            <!-- START / END -->
            <div class="details-grid">
              <div class="detail-box">
                <div class="label">START</div>
                <div class="value">${formatDateDMYFn(b?.startDate)}</div>
                <div class="value-small">${formatTimeIndianFn(b?.startTime)}</div>
              </div>
              <div class="detail-box">
                <div class="label">END</div>
                <div class="value">${formatDateDMYFn(b?.endDate)}</div>
                <div class="value-small">${formatTimeIndianFn(b?.endTime)}</div>
              </div>
            </div>

            <!-- TOTAL HOURS / DAYS -->
            <div class="details-grid">
              <div class="detail-box">
                <div class="label">TOTAL HOURS</div>
                <div class="value">${getTotalHoursDisplayFn(b)}h</div>
              </div>
              <div class="detail-box">
                <div class="label">TOTAL DAYS</div>
                <div class="value">${getTotalDaysFn(b)} days</div>
              </div>
            </div>

            <!-- BOOKING SLOTS -->
            ${b?.bookingSlots && b.bookingSlots.length > 0 ? `
              <div class="slots-section">
                <div class="section-title">BOOKING SLOTS (${b.bookingSlots.length} DAYS)</div>
                <div class="slots-grid">
                  ${b.bookingSlots.map(slot => `
                    <div class="slot-item">
                      <div class="date">${formatDateDMYFn(slot.date)}</div>
                      <div class="time">${formatTimeIndianFn(slot.startTime)} - ${formatTimeIndianFn(slot.endTime)}</div>
                      <div class="hours">${slot.hours}h</div>
                    </div>
                  `).join('')}
                </div>
                <div style="font-size:12px;color:#6b7280;margin-top:8px;">
                  Daily Hours: ${b.dailyHours?.join(', ') || 'N/A'}h
                </div>
              </div>
            ` : ''}

            <!-- SELECTED SEATS -->
            ${b?.selectedSeats && b.selectedSeats.length > 0 ? `
              <div class="seats-section">
                <div class="section-title">SELECTED SEATS (${b.seatCount})</div>
                <div class="seats-list">
                  ${b.selectedSeats.map(seat => `
                    <span class="seat-tag">${seat.name} (#${seat.number})</span>
                  `).join('')}
                </div>
                ${b.extraCharge > 0 ? `
                  <div class="extra-charge">Extra Charge: ₹${b.extraCharge}</div>
                ` : ''}
              </div>
            ` : ''}

            <!-- PRICE BREAKDOWN -->
            <div class="price-breakdown">
              <div class="section-title">PRICE BREAKDOWN</div>
              <div class="row">
                <span class="label">Subtotal (${getTotalHoursDisplayFn(b)}h × ₹${Math.round((b?.subtotal || 0) / (getTotalHoursDisplayFn(b) || 1))})</span>
                <span class="amount">₹${(b?.subtotal || 0).toFixed(2)}</span>
              </div>
              ${b?.extraCharge > 0 ? `
                <div class="row">
                  <span class="label">Seat Charges (${b.seatCount || 0} seats × ₹${Math.round((b?.extraCharge || 0) / (b?.seatCount || 1))})</span>
                  <span class="amount">₹${(b?.extraCharge || 0).toFixed(2)}</span>
                </div>
              ` : ''}
              <div class="row">
                <span class="label">GST (18%)</span>
                <span class="amount">₹${(b?.gstAmount || 0).toFixed(2)}</span>
              </div>
              <div class="total-row">
                <span class="label">Total Amount</span>
                <span class="amount">₹${(b?.totalPrice || 0).toFixed(2)}</span>
              </div>
            </div>

            <!-- PAYMENT & STATUS -->
            <div class="payment-status-row">
              <div class="status-box">
                <div class="label">STATUS</div>
                <div class="value"><span class="badge ${getStatusBadgeFn(b?.status)}">${(b?.status || 'PENDING').toUpperCase()}</span></div>
              </div>
              <div class="status-box">
                <div class="label">PAYMENT</div>
                <div class="value"><span class="badge ${getPaymentStatusBadgeFn(b?.paymentStatus)}">${(b?.paymentStatus || 'PENDING').toUpperCase()}</span></div>
              </div>
              <div class="status-box">
                <div class="label">PAYMENT METHOD</div>
                <div class="value"><span class="badge ${getPaymentMethodBadgeFn(b?.paymentMethod)}">${(b?.paymentMethod || 'CASH').toUpperCase()}</span></div>
              </div>
            </div>

            <!-- FOOTER -->
            <div class="invoice-footer">
              <div class="powered">POWERED BY IRYAX SPACE</div>
              <div class="created">Created: ${new Date(b?.createdAt).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })}</div>
            </div>
          </div>

          <div class="print-btn-container">
            <button class="print-btn" onclick="window.print()">🖨️ Print Invoice</button>
            <button class="close-btn" onclick="window.close()">Close</button>
          </div>
        </body>
      </html>
    `);
    win.document.close();
    setTimeout(() => { win.focus(); }, 500);
  };

  // ─── STATS ───
  const totalBookings = bookings.length;
  const normalCount = bookings.filter(b => b.cabin?.cabinType === "normal" && !b.cabin?.isCafe).length;
  const exclusiveCount = bookings.filter(b => b.cabin?.cabinType === "exclusive" && !b.cabin?.isCafe).length;
  const cafeCount = bookings.filter(b => b.cabin?.isCafe === true).length;

  const tabs = [
    { key: "all", label: "All Bookings", count: stats.totalBookings },
    { key: "pending", label: "Pending", count: stats.pending },
    { key: "confirmed", label: "Confirmed", count: stats.confirmed },
    { key: "active", label: "Active", count: stats.active },
    { key: "completed", label: "Completed", count: stats.completed },
    { key: "cancelled", label: "Cancelled", count: stats.cancelled },
  ];

  // ─── RENDER ───
  if (loading) {
    return (
      <div className="admin-dash" style={{ backgroundColor: '#ffffff' }}>
        <CafeNavbar />
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-amber-500 rounded-full border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dash" style={{ backgroundColor: '#ffffff' }}>
      <CafeNavbar />

      <div className="pt-20 px-3 sm:px-4 md:px-6 lg:px-8 max-w-full mx-auto pb-16">
        {/* Header */}
        <div className="admin-dash__header" style={{ marginBottom: '8px' }}>
          <div>
            <h1 className="admin-dash__greeting" style={{ fontSize: '1.25rem' }}>
              Cafe <span>Bookings</span>
            </h1>
            <p className="admin-dash__subtitle" style={{ fontSize: '11px' }}>
              Manage all your cafe & dining table bookings
            </p>
          </div>
          <div className="flex items-center gap-2">
            {filteredBookings.length > 0 && (
              <button
                onClick={exportToExcel}
                className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 text-amber-700 rounded-lg text-xs font-medium hover:bg-amber-100 transition border border-amber-200"
              >
                <Download size={14} />
                Export
              </button>
            )}
            <button
              onClick={() => navigate("/mycafes")}
              className="flex items-center gap-1.5 px-3 py-2 bg-amber-600 text-white rounded-lg text-xs font-medium hover:bg-amber-700 transition shadow-sm shadow-amber-200"
            >
              <UtensilsCrossed size={14} />
              My Tables
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-sm">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total</p>
            <p className="text-xl font-black text-slate-900 mt-1">{stats.totalBookings}</p>
            <p className="text-[9px] text-slate-400 mt-0.5">all reservations</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-sm">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Pending</p>
            <p className="text-xl font-black text-yellow-600 mt-1">{stats.pending}</p>
            <p className="text-[9px] text-slate-400 mt-0.5">awaiting confirmation</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-sm">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Active</p>
            <p className="text-xl font-black text-indigo-600 mt-1">{stats.active + stats.confirmed}</p>
            <p className="text-[9px] text-slate-400 mt-0.5">active & confirmed</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-sm">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Completed</p>
            <p className="text-xl font-black text-emerald-600 mt-1">{stats.completed}</p>
            <p className="text-[9px] text-slate-400 mt-0.5">confirmed & paid</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-sm">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Cancelled</p>
            <p className="text-xl font-black text-red-600 mt-1">{stats.cancelled}</p>
            <p className="text-[9px] text-slate-400 mt-0.5">cancelled reservations</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-4 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
                activeTab === tab.key
                  ? 'border-amber-600 text-amber-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 mb-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search cafe bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white"
              />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white"
              >
                <option value="all">All Types</option>
                <option value="normal">Standard</option>
                <option value="exclusive">VIP</option>
                <option value="cafe">Cafe</option>
              </select>
              {(searchTerm || filterDate || filterType !== "all" || activeTab !== "all") && (
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
            Showing {filteredBookings.length} of {bookings.length} bookings
          </div>
        </div>

        {/* Table */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-12 text-center">
            <UtensilsCrossed size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium">No cafe bookings found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm min-w-[1500px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">S.No</th>
                    <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Cafe & Table</th>
                    <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Type</th>
                    <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Guest</th>
                    <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Start</th>
                    <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">End</th>
                    <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Hours</th>
                    <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Days</th>
                    <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Seats</th>
                    <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Payment</th>
                    <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Pmt Status</th>
                    <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Amount</th>
                    <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase">Created</th>
                    <th className="px-3 py-2 text-[9px] font-bold tracking-wider text-gray-500 uppercase text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredBookings.map((booking, idx) => {
                    const cabin = booking.cabin || booking.cabinId;
                    const typeBadge = getCafeTypeBadge(cabin);
                    const Icon = typeBadge.icon || Layout;
                    const statusInfo = getStatusBadge(booking.status);
                    const pmtMethod = getPaymentMethodBadge(booking.paymentMethod);
                    const pmtStatus = getPaymentStatusBadge(booking.paymentStatus);
                    const guestCount = booking.seatCount || booking.selectedSeats?.length || 0;
                    const totalDays = getTotalDays(booking);
                    const totalHours = getTotalHoursDisplay(booking);
                    const isCashPending = (booking.paymentMethod === 'cash' || booking.paymentMethod === 'counter') && booking.paymentStatus === 'pending';
                    const guestName = booking.name || booking.user?.name || 'Guest';

                    return (
                      <tr key={booking._id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="px-3 py-2">
                          <span className="text-[10px] font-semibold text-gray-400">{idx + 1}</span>
                        </td>
                        <td className="px-3 py-2">
                          <div>
                            <p className="font-semibold text-gray-900 text-xs">
                              {cabin?.name?.split(" - ")[0] || "Cafe"}
                            </p>
                            <p className="text-[9px] text-gray-400 flex items-center gap-0.5">
                              <MapPin size={9} />
                              {cabin?.address?.split(',')[0] || 'N/A'}
                            </p>
                            <p className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md inline-block mt-0.5">
                              {cabin?.tableNumber || cabin?.cabin || "Table"}
                            </p>
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${typeBadge.className}`}>
                            <Icon size={10} /> {typeBadge.label}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          <div>
                            <p className="font-medium text-gray-800 text-xs">
                              {guestName}
                            </p>
                            <p className="text-[9px] text-gray-400">{booking.mobile || booking.user?.mobile || 'N/A'}</p>
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <div>
                            <span className="text-xs font-medium text-gray-700">{formatDateDMY(booking.startDate)}</span>
                            <p className="text-[9px] text-amber-600 font-medium">{formatTimeIndian(booking.startTime)}</p>
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <div>
                            <span className="text-xs font-medium text-gray-700">{formatDateDMY(booking.endDate)}</span>
                            <p className="text-[9px] text-amber-600 font-medium">{formatTimeIndian(booking.endTime)}</p>
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full text-[9px] font-bold">{totalHours}h</span>
                        </td>
                        <td className="px-3 py-2">
                          <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full text-[9px] font-bold">{totalDays}d</span>
                        </td>
                        <td className="px-3 py-2">
                          <span className="flex items-center gap-1 text-xs font-medium text-gray-700">
                            <Armchair size={12} className="text-amber-500" />
                            {guestCount}
                          </span>
                          {guestCount > 0 && (
                            <p className="text-[8px] text-gray-400 truncate max-w-[80px]">
                              {booking.selectedSeats?.map(s => s.name).join(', ') || 'N/A'}
                            </p>
                          )}
                        </td>
                        <td className="px-3 py-2">
                          <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${pmtMethod.color}`}>
                            {pmtMethod.label}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${pmtStatus.color}`}>
                            {pmtStatus.label}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          <span className="text-xs font-bold text-amber-600">₹{booking.totalPrice || 0}</span>
                          {booking.extraCharge > 0 && (
                            <p className="text-[8px] text-amber-500">+₹{booking.extraCharge} seat</p>
                          )}
                        </td>
                        <td className="px-3 py-2">
                          <span className="text-[9px] text-gray-500 font-medium">{formatDateTime(booking.createdAt)}</span>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <div className="flex items-center justify-center gap-1 flex-wrap">
                            <button
                              onClick={() => { setViewBooking(booking); setShowViewModal(true); }}
                              className="p-1 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition"
                              title="View"
                            >
                              <Eye size={13} />
                            </button>
                            <button
                              onClick={() => { setSelectedBooking(booking); setNewStatus(booking.status || 'pending'); setShowStatusModal(true); }}
                              className="p-1 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition"
                              title="Update Status"
                            >
                              <Edit size={13} />
                            </button>
                            <button
                              onClick={() => handlePrintInvoice(booking)}
                              className="p-1 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition"
                              title="Invoice"
                            >
                              <Receipt size={13} />
                            </button>
                            {isCashPending && (
                              <button
                                onClick={() => {
                                  setPaymentBooking(booking);
                                  setNewPaymentStatus(booking.paymentStatus || 'pending');
                                  setAmountPaid(booking.totalPrice || 0);
                                  setPaymentDetails({
                                    paymentMode: 'cash',
                                    cardNumber: '',
                                    cardHolderName: '',
                                    cardExpiry: '',
                                    cardCVV: '',
                                    upiId: '',
                                    upiApp: '',
                                    transactionId: '',
                                    paymentDate: new Date().toISOString().split('T')[0],
                                    notes: ''
                                  });
                                  setPaymentScreenshot(null);
                                  setPaymentScreenshotPreview(null);
                                  setShowPaymentModal(true);
                                }}
                                className="p-1 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition"
                                title="Update Payment"
                              >
                                <CreditCard size={13} />
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

            {/* Footer */}
            <div className="px-4 py-2.5 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
              <span className="text-[10px] text-gray-500">
                Showing <strong>{filteredBookings.length}</strong> of <strong>{bookings.length}</strong> bookings
              </span>
              <div className="flex items-center gap-3 text-[10px] text-gray-500">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Std: {normalCount}</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500"></span> VIP: {exclusiveCount}</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Cafe: {cafeCount}</span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 text-center text-[9px] text-gray-400 font-medium tracking-wider">
          © IRYAX SPACE — All Rights Reserved
        </div>
      </div>

      {/* ─── STATUS UPDATE MODAL ─── */}
      {showStatusModal && selectedBooking && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) { setShowStatusModal(false); setSelectedBooking(null); setNewStatus(""); } }}>
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-br from-amber-600 to-orange-600 p-5 text-white rounded-t-3xl flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center"><Edit size={20} className="text-white" /></div>
                <div><h3 className="text-xl font-bold">Update Status</h3><p className="text-sm text-amber-100">{selectedBooking.cabin?.name || 'Cafe'}</p></div>
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
                      <button key={status} onClick={() => setNewStatus(status)} className={`py-2.5 rounded-xl text-xs font-bold border transition ${isSelected ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-gray-200 hover:bg-gray-50 text-gray-700'}`}>
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
                <button onClick={handleUpdateStatus} disabled={updating || !newStatus} className={`flex-1 py-3 rounded-xl text-white font-bold transition ${(updating || !newStatus) ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:shadow-lg'}`}>
                  {updating ? 'Updating...' : 'Update Status'}
                </button>
                <button onClick={() => { setShowStatusModal(false); setSelectedBooking(null); setNewStatus(""); }} className="px-5 py-3 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── PAYMENT UPDATE MODAL ─── */}
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
                <div className="flex justify-between"><span className="text-gray-500">Customer</span><span className="font-semibold">{paymentBooking.name || 'Guest'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Cafe</span><span className="font-semibold">{paymentBooking.cabin?.name || 'N/A'}</span></div>
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
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center gap-2"><CreditCard size={14} /> Card Details</p>
                  <div><label className="text-xs font-medium text-gray-600 block mb-1">Card Number</label><input type="text" placeholder="1234 5678 9012 3456" value={paymentDetails.cardNumber} onChange={(e) => setPaymentDetails({...paymentDetails, cardNumber: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                  <div><label className="text-xs font-medium text-gray-600 block mb-1">Card Holder Name</label><input type="text" placeholder="John Doe" value={paymentDetails.cardHolderName} onChange={(e) => setPaymentDetails({...paymentDetails, cardHolderName: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="text-xs font-medium text-gray-600 block mb-1">Expiry Date</label><input type="text" placeholder="MM/YY" value={paymentDetails.cardExpiry} onChange={(e) => setPaymentDetails({...paymentDetails, cardExpiry: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                    <div><label className="text-xs font-medium text-gray-600 block mb-1">CVV</label><input type="password" placeholder="***" maxLength="4" value={paymentDetails.cardCVV} onChange={(e) => setPaymentDetails({...paymentDetails, cardCVV: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                  </div>
                </div>
              )}

              {paymentDetails.paymentMode === 'upi' && newPaymentStatus === 'paid' && (
                <div className="space-y-3 bg-purple-50 p-4 rounded-xl border border-purple-200">
                  <p className="text-xs font-bold text-purple-600 uppercase tracking-wider flex items-center gap-2"><Smartphone size={14} /> UPI Details</p>
                  <div><label className="text-xs font-medium text-gray-600 block mb-1">UPI ID</label><input type="text" placeholder="example@upi" value={paymentDetails.upiId} onChange={(e) => setPaymentDetails({...paymentDetails, upiId: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" /></div>
                  <div><label className="text-xs font-medium text-gray-600 block mb-1">UPI App</label><select value={paymentDetails.upiApp} onChange={(e) => setPaymentDetails({...paymentDetails, upiApp: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"><option value="">Select UPI App</option><option value="Google Pay">Google Pay</option><option value="PhonePe">PhonePe</option><option value="Paytm">Paytm</option><option value="BHIM">BHIM</option></select></div>
                </div>
              )}

              {newPaymentStatus === 'paid' && (
                <div className="space-y-3">
                  <div><label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Transaction ID</label><input type="text" placeholder="TXN123456789" value={paymentDetails.transactionId} onChange={(e) => setPaymentDetails({...paymentDetails, transactionId: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" /></div>
                  <div><label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Payment Date</label><input type="date" value={paymentDetails.paymentDate} onChange={(e) => setPaymentDetails({...paymentDetails, paymentDate: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" /></div>
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
                        <button onClick={(e) => { e.stopPropagation(); setPaymentScreenshot(null); setPaymentScreenshotPreview(null); }} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"><X size={16} /></button>
                      </div>
                    ) : (
                      <div className="py-4"><Upload size={32} className="mx-auto text-gray-400 mb-2" /><p className="text-sm text-gray-500">Click to upload screenshot</p><p className="text-xs text-gray-400">PNG, JPG up to 5MB</p></div>
                    )}
                  </div>
                </div>
              )}

              <div className="bg-amber-50 rounded-xl p-3 text-xs text-amber-700 flex items-start gap-2 border border-amber-200">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>Marking as paid will add the amount to the owner's wallet. All payment details will be securely stored.</span>
              </div>
              <div className="flex gap-3">
                <button onClick={handleUpdatePayment} disabled={updatingPayment || !newPaymentStatus || (newPaymentStatus === 'paid' && (!amountPaid || amountPaid <= 0))} className={`flex-1 py-3 rounded-xl text-white font-bold transition ${(updatingPayment || !newPaymentStatus || (newPaymentStatus === 'paid' && (!amountPaid || amountPaid <= 0))) ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:shadow-lg'}`}>
                  {updatingPayment ? 'Updating...' : 'Update Payment'}
                </button>
                <button onClick={resetPaymentModal} className="px-5 py-3 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── VIEW MODAL ─── */}
      {showViewModal && viewBooking && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) setShowViewModal(false); }}>
          <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-gradient-to-br from-amber-600 to-orange-600 text-white p-6 rounded-t-3xl flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold">Booking Details</h3>
                <p className="text-sm text-amber-200 flex items-center gap-2"><Hash size={14} /> #{viewBooking._id?.slice(-8).toUpperCase()}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-[10px] font-medium capitalize">{viewBooking.bookingBasis || 'Hourly'}</span>
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-[10px] font-medium">Cafe Table</span>
                </div>
              </div>
              <button onClick={() => setShowViewModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"><X size={20} /></button>
            </div>

            <div className="p-6 space-y-4">
              {/* Cabin Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1"><Building2 size={12} /> Cafe Details</p>
                  <p className="mt-1 font-semibold text-gray-800 text-sm">{viewBooking.cabin?.name || 'Unknown Cafe'}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-0.5 mt-0.5"><MapPin size={10} /> {viewBooking.cabin?.address?.split(',')[0] || 'N/A'}</p>
                  <div className="grid grid-cols-2 gap-1 mt-1 text-xs text-gray-500">
                    <span>Table: {viewBooking.cabin?.tableNumber || viewBooking.cabin?.cabin || 'N/A'}</span>
                    <span>Capacity: {viewBooking.cabin?.capacity || 'N/A'}</span>
                  </div>
                </div>
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1"><UtensilsCrossed size={12} /> Table Type</p>
                  <div className="mt-2">
                    {(() => {
                      const badge = getCafeTypeBadge(viewBooking.cabin);
                      const IconComponent = badge.icon;
                      return (
                        <span className={`px-3 py-1.5 text-xs font-bold rounded-full inline-flex items-center gap-2 ${badge.className}`}>
                          <IconComponent size={14} /> {badge.label}
                        </span>
                      );
                    })()}
                  </div>
                  {viewBooking.selectedPlan && (
                    <div className="mt-2 text-xs text-gray-500"><p><span className="font-medium">Plan:</span> {viewBooking.selectedPlan.label || 'N/A'}</p></div>
                  )}
                </div>
              </div>

              {/* Customer Details - Guest name fixed */}
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1"><User size={12} /> Guest Details</p>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                  <div><p className="text-gray-500 text-xs">Name</p><p className="font-semibold">{viewBooking.name || viewBooking.user?.name || 'Guest'}</p></div>
                  <div><p className="text-gray-500 text-xs">Mobile</p><p className="font-medium">{viewBooking.mobile || viewBooking.user?.mobile || 'N/A'}</p></div>
                  <div className="col-span-2"><p className="text-gray-500 text-xs">Email</p><p className="font-medium break-all">{viewBooking.email || viewBooking.user?.email || 'N/A'}</p></div>
                </div>
              </div>

              {/* Schedule */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1"><CalendarDays size={12} /> Start</p>
                  <p className="mt-1 font-semibold text-gray-800">{formatDateDMY(viewBooking.startDate)}</p>
                  <p className="text-sm font-bold text-amber-600">{formatTimeIndian(viewBooking.startTime)}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1"><CalendarDays size={12} /> End</p>
                  <p className="mt-1 font-semibold text-gray-800">{formatDateDMY(viewBooking.endDate)}</p>
                  <p className="text-sm font-bold text-amber-600">{formatTimeIndian(viewBooking.endTime)}</p>
                </div>
              </div>

              {/* Booking Info */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1"><Info size={12} /> Booking Info</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">{getTotalHoursDisplay(viewBooking)}h Total</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">{getTotalDays(viewBooking)} Days</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Daily: {viewBooking.dailyHours?.join(', ') || 'N/A'}h</span>
                </div>
              </div>

              {/* Booking Slots */}
              {viewBooking.bookingSlots && viewBooking.bookingSlots.length > 0 && (
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider flex items-center gap-2"><CalendarDays size={14} /> Booking Slots ({viewBooking.bookingSlots.length} days)</p>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {viewBooking.bookingSlots.map((slot, idx) => (
                      <div key={idx} className="bg-white p-2 rounded-lg border border-amber-100">
                        <p className="text-xs font-bold text-gray-700">{formatDateDMY(slot.date)}</p>
                        <p className="text-[10px] text-gray-500">{formatTimeIndian(slot.startTime)} - {formatTimeIndian(slot.endTime)}</p>
                        <p className="text-[10px] font-bold text-amber-600">{slot.hours}h</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Seats */}
              {viewBooking.selectedSeats && viewBooking.selectedSeats.length > 0 && (
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-2"><Armchair size={14} /> Selected Seats ({viewBooking.seatCount})</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {viewBooking.selectedSeats.map((seat) => (
                      <span key={seat._id} className="px-3 py-1.5 bg-white rounded-lg border border-emerald-200 text-sm font-medium text-gray-700">
                        {seat.name} <span className="text-gray-400 text-xs">#{seat.number}</span>
                      </span>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-emerald-600 font-medium">Extra Charge: ₹{viewBooking.extraCharge || 0}</p>
                </div>
              )}

              {/* Status Update */}
              <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                <p className="text-[10px] font-bold text-orange-600 uppercase tracking-wider flex items-center gap-2"><Edit size={14} /> Update Status</p>
                <div className="mt-3">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-sm text-gray-600 font-medium">Current:</span>
                    <span className={`px-3 py-1 text-xs font-bold rounded-full inline-flex items-center gap-1.5 ${getStatusBadge(viewBooking.status).color}`}>
                      {getStatusBadge(viewBooking.status).icon} {getStatusBadge(viewBooking.status).label}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {['pending', 'confirmed', 'active', 'completed', 'cancelled'].map((status) => {
                      const badge = getStatusBadge(status);
                      const isSelected = viewBooking.status === status;
                      return (
                        <button
                          key={status}
                          onClick={() => handleUpdateStatusFromView(viewBooking._id, status)}
                          disabled={updating || isSelected}
                          className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all flex items-center justify-center gap-1 ${isSelected ? 'border-orange-500 bg-orange-100 text-orange-700 cursor-default' : 'border-gray-200 hover:bg-gray-50 text-gray-600 hover:text-gray-800'} ${updating ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {badge.icon} {badge.label} {isSelected && <Check size={12} className="text-orange-600" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="grid grid-cols-3 gap-3">
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
                <div className="p-3 bg-gray-50 rounded-xl text-center border border-gray-200">
                  <p className="text-[10px] text-gray-500 font-bold uppercase">Amount</p>
                  <p className="mt-1 font-bold text-amber-600 text-lg">₹{viewBooking.totalPrice || 0}</p>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider flex items-center gap-2 mb-3"><IndianRupee size={14} /> Price Breakdown</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center border-b border-amber-100 pb-1.5">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold text-gray-800">₹{(viewBooking.subtotal || 0).toFixed(2)}</span>
                  </div>
                  {viewBooking.extraCharge > 0 && (
                    <div className="flex justify-between items-center border-b border-amber-100 pb-1.5">
                      <span className="text-gray-600">Seat Charges</span>
                      <span className="font-semibold text-amber-600">₹{(viewBooking.extraCharge || 0).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center border-b border-amber-100 pb-1.5">
                    <span className="text-gray-600">GST (18%)</span>
                    <span className="font-semibold text-gray-800">₹{(viewBooking.gstAmount || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t-2 border-amber-300">
                    <span className="font-bold text-gray-800">Total Amount</span>
                    <span className="text-xl font-bold text-amber-700">₹{(viewBooking.totalPrice || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-200">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition"
                >
                  Close
                </button>
                <button
                  onClick={() => { handlePrintInvoice(viewBooking); setShowViewModal(false); }}
                  className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition flex items-center gap-2"
                >
                  <Receipt size={16} /> Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── INVOICE MODAL ─── */}
      {showInvoiceModal && invoiceBooking && (
        <div className="fixed inset-0 z-[1300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) setShowInvoiceModal(false); }}>
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl max-h-[95vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-gradient-to-br from-emerald-600 to-teal-600 text-white p-5 rounded-t-3xl flex justify-between items-center z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center"><Receipt size={20} className="text-white" /></div>
                <div><h3 className="text-xl font-bold">Invoice</h3><p className="text-sm text-emerald-100">#{invoiceBooking._id?.slice(-8).toUpperCase()}</p></div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={printInvoice}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium text-white transition flex items-center gap-2"
                >
                  <Printer size={16} /> Print
                </button>
                <button onClick={() => setShowInvoiceModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"><X size={20} /></button>
              </div>
            </div>

            <div className="p-8" id="invoice-content">
              {/* Header - Cafe name on top */}
              <div className="flex justify-between items-start border-b-2 border-emerald-200 pb-6 mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">{invoiceBooking?.cabin?.name || 'Cafe'}</h1>
                  <p className="text-sm text-gray-500">{invoiceBooking?.cabin?.address || ''}</p>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">{invoiceBooking?.cabin?.spaceType || 'CO-WORKING SPACE'}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Invoice</p>
                  <p className="text-sm font-bold text-gray-700">#{invoiceBooking._id?.slice(-8).toUpperCase()}</p>
                </div>
              </div>

              {/* Bill To */}
              <div className="bg-gray-50 p-4 rounded-xl mb-5">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">BILL TO</p>
                <p className="font-bold text-gray-800 text-lg">{invoiceBooking.name || 'Guest'}</p>
                <p className="text-sm text-gray-600">{invoiceBooking.mobile || 'N/A'}</p>
                <p className="text-sm text-gray-600">{invoiceBooking.email || 'N/A'}</p>
              </div>

              {/* Cabin Details */}
              <div className="bg-gray-50 p-4 rounded-xl mb-5">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">CABIN DETAILS</p>
                <p className="font-bold text-gray-800">{invoiceBooking?.cabin?.name || 'Unknown'}</p>
                <p className="text-sm text-gray-500">{invoiceBooking?.cabin?.address?.split(',')[0] || ''}</p>
                <div className="flex gap-4 mt-1 text-sm text-gray-600">
                  <span>Capacity: {invoiceBooking?.cabin?.capacity || 'N/A'} seats</span>
                  <span>Type: {invoiceBooking?.cabin?.cabinType || 'normal'}</span>
                </div>
              </div>

              {/* Start / End */}
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">START</p>
                  <p className="font-bold text-gray-800">{formatDateDMY(invoiceBooking.startDate)}</p>
                  <p className="text-sm text-amber-600 font-medium">{formatTimeIndian(invoiceBooking.startTime)}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">END</p>
                  <p className="font-bold text-gray-800">{formatDateDMY(invoiceBooking.endDate)}</p>
                  <p className="text-sm text-amber-600 font-medium">{formatTimeIndian(invoiceBooking.endTime)}</p>
                </div>
              </div>

              {/* Hours / Days */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="bg-amber-50 p-3 rounded-xl text-center">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">TOTAL HOURS</p>
                  <p className="font-bold text-amber-600 text-lg">{getTotalHoursDisplay(invoiceBooking)}h</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-xl text-center">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">TOTAL DAYS</p>
                  <p className="font-bold text-purple-600 text-lg">{getTotalDays(invoiceBooking)} days</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-xl text-center">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">BOOKING TYPE</p>
                  <p className="font-bold text-blue-600 text-lg uppercase">{invoiceBooking.bookingBasis || 'hourly'}</p>
                </div>
              </div>

              {/* Booking Slots */}
              {invoiceBooking.bookingSlots && invoiceBooking.bookingSlots.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-xl mb-5">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">BOOKING SLOTS ({invoiceBooking.bookingSlots.length} DAYS)</p>
                  <div className="grid grid-cols-2 gap-3">
                    {invoiceBooking.bookingSlots.map((slot, idx) => (
                      <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200">
                        <p className="font-bold text-gray-800 text-sm">{formatDateDMY(slot.date)}</p>
                        <p className="text-sm text-gray-600">{formatTimeIndian(slot.startTime)} - {formatTimeIndian(slot.endTime)}</p>
                        <p className="text-sm font-bold text-amber-600">{slot.hours}h</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Daily Hours: {invoiceBooking.dailyHours?.join(', ') || 'N/A'}h</p>
                </div>
              )}

              {/* Selected Seats */}
              {invoiceBooking.selectedSeats && invoiceBooking.selectedSeats.length > 0 && (
                <div className="bg-emerald-50 p-4 rounded-xl mb-5">
                  <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">SELECTED SEATS ({invoiceBooking.seatCount})</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {invoiceBooking.selectedSeats.map((seat) => (
                      <span key={seat._id} className="bg-white px-3 py-1.5 rounded-lg border border-emerald-200 text-sm font-medium">
                        {seat.name} (#{seat.number})
                      </span>
                    ))}
                  </div>
                  {invoiceBooking.extraCharge > 0 && (
                    <p className="text-sm text-emerald-600 mt-2">Extra Charge: ₹{invoiceBooking.extraCharge}</p>
                  )}
                </div>
              )}

              {/* Price Breakdown */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-5 rounded-xl border-2 border-amber-200 mb-5">
                <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-3">PRICE BREAKDOWN</p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center border-b border-amber-100 pb-2">
                    <span className="text-gray-600 text-sm">Subtotal ({getTotalHoursDisplay(invoiceBooking)}h × ₹{Math.round((invoiceBooking?.subtotal || 0) / (getTotalHoursDisplay(invoiceBooking) || 1))})</span>
                    <span className="font-semibold text-gray-800">₹{(invoiceBooking.subtotal || 0).toFixed(2)}</span>
                  </div>
                  {invoiceBooking.extraCharge > 0 && (
                    <div className="flex justify-between items-center border-b border-amber-100 pb-2">
                      <span className="text-gray-600 text-sm">Seat Charges ({invoiceBooking.seatCount || 0} seats × ₹{Math.round((invoiceBooking?.extraCharge || 0) / (invoiceBooking?.seatCount || 1))})</span>
                      <span className="font-semibold text-amber-600">₹{(invoiceBooking.extraCharge || 0).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center border-b border-amber-100 pb-2">
                    <span className="text-gray-600 text-sm">GST (18%)</span>
                    <span className="font-semibold text-gray-800">₹{(invoiceBooking.gstAmount || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t-2 border-amber-400">
                    <span className="font-bold text-gray-800 text-lg">Total Amount</span>
                    <span className="text-2xl font-extrabold text-amber-700">₹{(invoiceBooking.totalPrice || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="bg-gray-50 p-3 rounded-xl text-center">
                  <p className="text-[10px] text-gray-400 font-bold uppercase">STATUS</p>
                  <span className={`px-3 py-1 text-xs font-bold rounded-full inline-block mt-1 ${getStatusBadge(invoiceBooking.status).color}`}>
                    {getStatusBadge(invoiceBooking.status).label}
                  </span>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl text-center">
                  <p className="text-[10px] text-gray-400 font-bold uppercase">PAYMENT</p>
                  <span className={`px-3 py-1 text-xs font-bold rounded-full inline-block mt-1 ${getPaymentStatusBadge(invoiceBooking.paymentStatus).color}`}>
                    {getPaymentStatusBadge(invoiceBooking.paymentStatus).label}
                  </span>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl text-center">
                  <p className="text-[10px] text-gray-400 font-bold uppercase">PAYMENT METHOD</p>
                  <span className={`px-3 py-1 text-xs font-bold rounded-full inline-block mt-1 ${getPaymentMethodBadge(invoiceBooking.paymentMethod).color}`}>
                    {getPaymentMethodBadge(invoiceBooking.paymentMethod).label}
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-xs font-medium text-gray-500">POWERED BY IRYAX SPACE</p>
                <p className="text-[10px] text-gray-400 mt-1">
                  Created: {new Date(invoiceBooking.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CafeBookings;