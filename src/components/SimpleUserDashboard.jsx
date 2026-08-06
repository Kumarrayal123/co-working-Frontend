// SimpleUserDashboard.jsx - With Fixed Modal (Centered + No Overflow)
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

  // ✅ FORMAT DATE to dd/mm/yyyy
  const formatDateDDMMYYYY = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return "N/A";
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (e) {
      return "N/A";
    }
  };

  const formatDateTimeDDMMYYYY = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return "N/A";
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch (e) {
      return "N/A";
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

  // Calculate profile completion percentage
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
    return formatDateDDMMYYYY(dateStr);
  };

  const formatDateTime = (dateStr) => {
    return formatDateTimeDDMMYYYY(dateStr);
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

  // ✅ FIXED: Handle View Booking - Open Modal with body scroll lock
  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  // ✅ FIXED: Close modal with body scroll restore
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
    document.body.style.overflow = '';
  };

  // ✅ PROFESSIONAL BLACK & GRAY INVOICE - NO EMOJIS, NO IRYAX AT TOP
  const downloadInvoice = (booking) => {
    try {
      if (!booking) {
        toast.error('No booking data available');
        return;
      }

      const cabin = booking.cabin || {};
      const owner = cabin.owner || {};
      
      const win = window.open('', '_blank', 'width=900,height=700');
      if (!win) {
        toast.error('Please allow popups for invoice download');
        return;
      }

      let seatListHtml = '';
      if (booking.selectedSeats && booking.selectedSeats.length > 0) {
        seatListHtml = booking.selectedSeats.map(s => 
          `<span style="display:inline-block;background:#f5f5f5;padding:4px 12px;border-radius:2px;margin:3px;font-size:11px;border:1px solid #e0e0e0;color:#333;">${s.name || 'Seat'} (#${s.number || 'N/A'})</span>`
        ).join('');
      }

      const status = getStatusBadge(booking.status, booking.paymentStatus);
      const pmtMethod = getPaymentMethodBadge(booking.paymentMethod);
      const pmtStatus = getPaymentStatusBadge(booking.paymentStatus);

      const subtotal = booking.subtotal || 0;
      const extraCharge = booking.extraCharge || 0;
      const gstAmount = booking.gstAmount || 0;
      const totalPrice = booking.totalPrice || 0;
      const gstRate = (booking.gstRate || 0.18) * 100;
      const cabinPrice = cabin.price || 0;
      const totalHours = booking.totalHours || 0;
      const seatCount = booking.seatCount || 0;
      const seatExtraChargePerSeat = booking.seatExtraChargePerSeat || 100;

      // Get owner name
      const ownerName = owner.name || owner.organizationName || 'IRYAX SPACE';
      const ownerAddress = owner.address || 'Premium Workspaces';
      const isChamber = cabin.isChamber || false;
      const spaceTypeLabel = isChamber ? 'MEDICAL CHAMBER' : 'CO-WORKING SPACE';

      win.document.write(`
        <html>
          <head>
            <title>Invoice</title>
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
              @media print { 
                body { background: #ffffff; padding: 20px; } 
                .invoice-wrapper { box-shadow: none; padding: 20px; } 
              }
            </style>
          </head>
          <body>
            <div class="invoice-wrapper">
              <!-- HEADER -->
              <div class="header">
                <div class="header-left">
                  <h1>${ownerName}</h1>
                  <div class="subtitle">${ownerAddress}</div>
                  <div style="margin-top:6px;">
                    <span style="font-size:11px;font-weight:600;color:#555555;background:#f0f0f0;padding:2px 12px;border-radius:2px;">${spaceTypeLabel}</span>
                  </div>
                </div>
                <div class="header-right">
                  <div class="invoice-date">${formatDateDDMMYYYY(new Date())}</div>
                </div>
              </div>

              <!-- BILL TO & CABIN -->
              <div class="info-grid">
                <div class="info-item">
                  <div class="label">Bill To</div>
                  <div class="value">${booking.name || 'Customer'}</div>
                  <div class="sub-value">${booking.mobile || 'N/A'}</div>
                  <div class="sub-value">${booking.email || 'N/A'}</div>
                </div>
                <div class="info-item">
                  <div class="label">Cabin Details</div>
                  <div class="value">${cabin.name || 'Unknown Cabin'}</div>
                  <div class="sub-value">${cabin.address || 'N/A'}</div>
                  <div class="sub-value">Capacity: ${cabin.capacity || 'N/A'} seats | Type: ${cabin.cabinType || 'Normal'}</div>
                </div>
              </div>

              <!-- SCHEDULE -->
              <div class="info-grid">
                <div class="info-item">
                  <div class="label">Start</div>
                  <div class="value">${formatDateDDMMYYYY(booking.startDate)}</div>
                  <div class="sub-value" style="color:#000000;font-weight:600;">${formatTime12(booking.startTime)}</div>
                </div>
                <div class="info-item">
                  <div class="label">End</div>
                  <div class="value">${formatDateDDMMYYYY(booking.endDate)}</div>
                  <div class="sub-value" style="color:#000000;font-weight:600;">${formatTime12(booking.endTime)}</div>
                </div>
              </div>

              <!-- BOOKING INFO -->
              <div style="display:flex;gap:16px;flex-wrap:wrap;margin-bottom:20px;padding:12px 16px;background:#fafafa;border:1px solid #eeeeee;">
                <div><span style="color:#999999;font-size:10px;text-transform:uppercase;letter-spacing:0.3px;">Total Hours</span><br><strong>${totalHours}h</strong></div>
                <div><span style="color:#999999;font-size:10px;text-transform:uppercase;letter-spacing:0.3px;">Booking Type</span><br><strong>${booking.bookingBasis || 'Hourly'}</strong></div>
                ${booking.selectedPlan ? `<div><span style="color:#999999;font-size:10px;text-transform:uppercase;letter-spacing:0.3px;">Plan</span><br><strong>${booking.selectedPlan.label || 'N/A'}</strong></div>` : ''}
                <div><span style="color:#999999;font-size:10px;text-transform:uppercase;letter-spacing:0.3px;">Created</span><br><strong>${formatDateTimeDDMMYYYY(booking.createdAt)}</strong></div>
              </div>

              <!-- SEATS -->
              ${booking.selectedSeats && booking.selectedSeats.length > 0 ? `
                <div class="seat-section">
                  <div class="seat-title">Selected Seats (${seatCount})</div>
                  <div class="seat-list">${seatListHtml}</div>
                  <div style="margin-top:6px;font-size:11px;color:#666666;">Extra Charge: ₹${extraCharge.toFixed(2)}</div>
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
              </div>

              <!-- PAYMENT DETAILS -->
              ${booking.transactionId || booking.paymentDetails?.transactionId ? `
                <div class="payment-details">
                  <div style="font-size:9px;font-weight:700;color:#999999;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;">Payment Details</div>
                  <div class="detail-row"><span class="label-text">Transaction ID</span> <strong>${booking.transactionId || booking.paymentDetails?.transactionId || 'N/A'}</strong></div>
                  ${booking.paymentDetails?.upiId ? `<div class="detail-row"><span class="label-text">UPI ID</span> <strong>${booking.paymentDetails.upiId}</strong></div>` : ''}
                  ${booking.paymentDetails?.upiApp ? `<div class="detail-row"><span class="label-text">UPI App</span> <strong>${booking.paymentDetails.upiApp}</strong></div>` : ''}
                  ${booking.paymentDetails?.paymentDate ? `<div class="detail-row"><span class="label-text">Payment Date</span> <strong>${formatDateDDMMYYYY(booking.paymentDetails.paymentDate)}</strong></div>` : ''}
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

              <!-- FOOTER -->
              <div class="footer">
                <span class="brand">${ownerName}</span> — ${ownerAddress}<br>
                Created: ${formatDateTimeDDMMYYYY(booking.createdAt)}<br>
                This is a system generated invoice. Terms & Conditions apply.
              </div>
            </div>
          </body>
        </html>
      `);
      
      win.document.close();
      win.focus();
      toast.success('Invoice generated! Click Print to save as PDF.');
      
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

  // ✅ FIXED: Modal close handler
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
    document.body.style.overflow = '';
  };

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
            {/* Optional: Add button here */}
          </div>
        </div>

        {/* Profile Completion Card */}
        <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-xl border border-indigo-200 shadow-sm p-3 sm:p-4 mb-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-shrink-0 flex justify-center">
              <CircularProgress 
                percentage={animatedPercentage || completionPercentage} 
                size={80}
                strokeWidth={7}
              />
            </div>

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
                          <p className="text-sm text-gray-700">{formatDateDDMMYYYY(booking.startDate)}</p>
                          <p className="text-[9px] text-gray-400">
                            {formatTime12(booking.startTime)} - {formatTime12(booking.endTime)} ({booking.totalHours}h)
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

      {/* ============================================================ */}
      {/* ✅ FIXED MODAL - Properly Centered with No Overflow */}
      {/* ============================================================ */}
      {isModalOpen && selectedBooking && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={handleModalClose}
        >
          <div 
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header - Sticky */}
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
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
                onClick={handleModalClose}
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
                    <p className="text-xs text-gray-600">Type: {selectedBooking.cabin?.cabinType || 'Normal'}</p>
                  </div>
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Start</h3>
                  <p className="text-sm font-semibold text-gray-900">{formatDateDDMMYYYY(selectedBooking.startDate)}</p>
                  <p className="text-xs text-blue-600 font-medium">{formatTime12(selectedBooking.startTime)}</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                  <h3 className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-2">End</h3>
                  <p className="text-sm font-semibold text-gray-900">{formatDateDDMMYYYY(selectedBooking.endDate)}</p>
                  <p className="text-xs text-purple-600 font-medium">{formatTime12(selectedBooking.endTime)}</p>
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
                    <p className="text-xs font-semibold text-gray-900">{formatDateTimeDDMMYYYY(selectedBooking.createdAt)}</p>
                  </div>
                </div>
              </div>

              {/* Selected Seats */}
              {selectedBooking.selectedSeats && selectedBooking.selectedSeats.length > 0 && (
                <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                  <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">Selected Seats</h3>
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
                    <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-100 text-emerald-700">Yes</span>
                  </div>
                )}
              </div>

              {/* Payment Details */}
              {(selectedBooking.transactionId || selectedBooking.paymentDetails?.transactionId) && (
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Payment Details</h3>
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
                        <p className="font-medium text-gray-900">{formatDateDDMMYYYY(selectedBooking.paymentDetails.paymentDate)}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer - Sticky */}
            <div className="sticky bottom-0 z-10 bg-white border-t border-gray-200 px-6 py-4 flex justify-end gap-3 rounded-b-2xl">
              <button
                onClick={() => downloadInvoice(selectedBooking)}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition flex items-center gap-2"
              >
                <FileDown size={16} />
                Download Invoice
              </button>
              <button
                onClick={handleModalClose}
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