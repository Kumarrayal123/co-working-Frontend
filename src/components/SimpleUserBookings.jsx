// SimpleUserBookings.jsx - Only Space Bookings (Site Visits Removed)
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
  ArrowUpRight,
  ReceiptText,
  Calculator,
  Clock as ClockIcon,
  Wallet,
  CreditCard as CreditCardIcon,
  Banknote,
  CalendarDays,
  Info,
  Image as ImageIcon,
  CalendarPlus,
  Layers,
  Stethoscope,
  Briefcase,
  Ticket,
  Hash,
  QrCode,
  History,
  Timer
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SimpleUserNavbar from "./SimpleUserNavbar";
import * as XLSX from 'xlsx';
import "./Dashboard.css";

const API_URL = "https://spaceapi.iryax.com";

const SimpleUserBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [allCabins, setAllCabins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filters, setFilters] = useState({
    status: 'all',
    paymentStatus: 'all',
    spaceType: 'all'
  });
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();

  const [showViewModal, setShowViewModal] = useState(false);
  const [viewBooking, setViewBooking] = useState(null);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelBooking, setCancelBooking] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  const [showReplaceModal, setShowReplaceModal] = useState(false);
  const [replaceBooking, setReplaceBooking] = useState(null);
  const [selectedCabin, setSelectedCabin] = useState("");
  const [replaceLoading, setReplaceLoading] = useState(false);
  const [selectedCabinData, setSelectedCabinData] = useState(null);

  const currentUser = (() => {
    try {
      const u = localStorage.getItem("user");
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

  // ✅ FORMAT DATE to dd/mm/yyyy
  const formatDateDDMMYYYY = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatDateTimeDDMMYYYY = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  // ✅ Keep for Indian style (dd/mm/yy) - used in slots and invoice
  const formatDateIndian = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = String(d.getFullYear()).slice(2);
    return `${day}/${month}/${year}`;
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

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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

  const fetchBookings = async () => {
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

      // ✅ FILTER: Only Space Bookings, remove Site Visits
      const allBookings = res.data.bookings || [];
      const spaceBookings = allBookings.filter(b => b.bookingType !== 'visit');
      setBookings(spaceBookings);

      if (spaceBookings.length === 0) {
        toast.info("You have no space bookings yet");
      }

    } catch (error) {
      console.error("Error fetching bookings:", error);

      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      } else {
        toast.error("Failed to fetch bookings");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchCabins = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token for cabins fetch");
        return;
      }
      const res = await axios.get(`${API_URL}/api/cabins`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const activeCabins = res.data.filter(c => c.isActive === true);
      setAllCabins(activeCabins);
    } catch (error) {
      console.error("Failed to fetch cabins:", error);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchCabins();
  }, []);

  useEffect(() => {
    if (selectedCabin && replaceBooking) {
      const cabin = allCabins.find(c => c._id === selectedCabin);
      setSelectedCabinData(cabin || null);
    } else {
      setSelectedCabinData(null);
    }
  }, [selectedCabin, allCabins, replaceBooking]);

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

  const getSpaceType = (booking) => {
    if (booking.cabin?.isChamber) return 'medical';
    return 'coworking';
  };

  const getSpaceTypeLabel = (booking) => {
    if (booking.cabin?.isChamber) return 'Medical Chamber';
    return 'Co-Working Space';
  };

  const getSpaceTypeBadge = (booking) => {
    const isChamber = booking.cabin?.isChamber || false;
    return {
      label: isChamber ? 'Medical Chamber' : 'Co-Working Space',
      color: isChamber ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700',
      icon: isChamber ? <Stethoscope size={9} /> : <Briefcase size={9} />
    };
  };

  const exportToExcel = () => {
    try {
      if (displayBookings.length === 0) {
        toast.warning("No bookings to export");
        return;
      }
      const data = displayBookings.map((b, i) => ({
        'S.No': i + 1,
        'Booking ID': b._id?.slice(-8).toUpperCase() || 'N/A',
        'Type': getSpaceTypeLabel(b),
        'Basis': b.bookingBasis || 'hourly',
        'Cabin': b.cabin?.name || 'Unknown',
        'Start Date': formatDateDDMMYYYY(b.startDate),
        'Start Time': formatTime12(b.startTime),
        'End Date': formatDateDDMMYYYY(b.endDate),
        'End Time': formatTime12(b.endTime),
        'Total Hours': b.totalHours || 0,
        'Total Days': b.totalDays || 0,
        'Daily Hours': b.dailyHours?.join(', ') || 'N/A',
        'Slots': b.bookingSlots?.map(s => `${formatDateIndian(s.date)} ${s.startTime}-${s.endTime}`).join('; ') || 'N/A',
        'Seats': b.seatCount || 0,
        'Seat Names': b.selectedSeats?.map(s => s.name).join(', ') || 'N/A',
        'Extra Charge': b.extraCharge || 0,
        'Subtotal (₹)': b.subtotal || 0,
        'GST (₹)': b.gstAmount || 0,
        'Total (₹)': b.totalPrice || 0,
        'Status': getStatusBadge(b.status).label,
        'Payment': getPaymentMethodBadge(b.paymentMethod).label,
        'Pmt Status': getPaymentStatusBadge(b.paymentStatus).label,
        'Transaction ID': b.transactionId || 'N/A',
        'UPI ID': b.paymentDetails?.upiId || 'N/A',
        'UPI App': b.paymentDetails?.upiApp || 'N/A',
        'Check-in': b.checkInTime || 'N/A',
        'Check-out': b.checkOutTime || 'N/A',
        'Visits': b.visitingTimings?.length || 0,
        'Created At': formatDateTimeDDMMYYYY(b.createdAt)
      }));
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Bookings');
      XLSX.writeFile(wb, `my_bookings_${new Date().toISOString().split('T')[0]}.xlsx`);
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

  const handleReplaceBooking = async () => {
    if (!selectedCabin) {
      toast.error("Please select a cabin to replace");
      return;
    }

    setReplaceLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_URL}/api/bookings/replace-booking/${replaceBooking._id}`,
        { newCabinId: selectedCabin },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Booking replaced successfully!");
        setShowReplaceModal(false);
        setReplaceBooking(null);
        setSelectedCabin("");
        setSelectedCabinData(null);
        fetchBookings();
        fetchCabins();
      } else {
        toast.error(response.data.error || "Failed to replace booking");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to replace booking");
    } finally {
      setReplaceLoading(false);
    }
  };

  const getPriceDifference = () => {
    if (!replaceBooking || !selectedCabinData) return null;

    const currentPrice = replaceBooking.totalPrice || 0;
    const newPrice = selectedCabinData.price || 0;
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

 // ✅ PROFESSIONAL BLACK & GRAY INVOICE - OWNER NAME AT TOP LEFT & BOTTOM with POWERED BY
const downloadInvoice = (booking) => {
  try {
    const cabin = booking.cabin || {};
    const owner = cabin.owner || {};
    const paymentDetails = booking.paymentDetails || {};

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
    const isChamber = cabin.isChamber || false;
    const spaceTypeLabel = isChamber ? 'MEDICAL CHAMBER' : 'CO-WORKING SPACE';

    // ✅ Get owner name from owner object
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
            <div class="value">${cabin.name || 'Unknown'}</div>
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
          <div><span style="color:#999999;font-size:10px;text-transform:uppercase;letter-spacing:0.3px;">Total Hours</span><br><strong>${booking.totalHours}h</strong></div>
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
                <td>Subtotal (${booking.totalHours}h × ₹${cabin.price || 0})</td>
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
  // ✅ FILTER: Space Type filter added
  const filteredBookings = bookings.filter((b) => {
    const search = searchTerm.toLowerCase();
    const matchSearch = b.cabin?.name?.toLowerCase().includes(search) ||
                        b.cabin?.address?.toLowerCase().includes(search) ||
                        b.name?.toLowerCase().includes(search) ||
                        b.mobile?.includes(searchTerm);
    const matchDate = filterDate ? b.startDate === filterDate : true;
    const matchStatus = filters.status === 'all' || b.status === filters.status;
    const matchPaymentStatus = filters.paymentStatus === 'all' || b.paymentStatus === filters.paymentStatus;
    
    const spaceType = getSpaceType(b);
    const matchSpaceType = filters.spaceType === 'all' || spaceType === filters.spaceType;
    
    return matchSearch && matchDate && matchStatus && matchPaymentStatus && matchSpaceType;
  });

  const displayBookings = filteredBookings;

  const totalCount = bookings.length;
  const activeCount = bookings.filter(b => b.status === 'active' || b.status === 'confirmed').length;
  const pendingCount = bookings.filter(b => b.status === 'pending').length;
  const completedCount = bookings.filter(b => b.status === 'completed').length;
  const cancelledCount = bookings.filter(b => b.status === 'cancelled').length;

  const clearFilters = () => {
    setFilters({
      status: 'all',
      paymentStatus: 'all',
      spaceType: 'all'
    });
    setSearchTerm('');
    setFilterDate('');
  };

  // ✅ RENDER SPACE BOOKINGS TABLE
  const renderBookingsTable = (bookingsList) => {
    if (bookingsList.length === 0) {
      return (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <div className="flex flex-col items-center text-gray-400">
            <Building2 size={32} className="opacity-20 mb-2" />
            <p className="text-sm font-medium">No space bookings found</p>
            <button
              onClick={() => navigate("/spaceforusers")}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
            >
              Browse Spaces
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-4 py-3 bg-indigo-50 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 size={16} className="text-indigo-600" />
            <h3 className="font-bold text-gray-800">Space Bookings</h3>
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
                const totalDays = b.totalDays || 0;
                const bookingId = b._id?.slice(-8).toUpperCase() || 'N/A';
                const spaceTypeBadge = getSpaceTypeBadge(b);

                return (
                  <tr key={b._id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-3 py-2">
                      <span className="text-[10px] font-semibold text-gray-400">{idx + 1}</span>
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
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full inline-flex items-center gap-1 ${spaceTypeBadge.color}`}>
                        {spaceTypeBadge.icon}
                        {spaceTypeBadge.label}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <div>
                        <span className="text-xs font-medium text-gray-700">{formatDateDDMMYYYY(b.startDate)}</span>
                        <p className="text-[9px] text-indigo-600 font-medium">{formatTime12(b.startTime)}</p>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <div>
                        <span className="text-xs font-medium text-gray-700">{formatDateDDMMYYYY(b.endDate)}</span>
                        <p className="text-[9px] text-indigo-600 font-medium">{formatTime12(b.endTime)}</p>
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
                      <span className="text-xs font-bold text-indigo-600">₹{b.totalPrice}</span>
                      {b.extraCharge > 0 && (
                        <p className="text-[8px] text-amber-500">+₹{b.extraCharge} seat</p>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <span className="text-[10px] text-gray-500 font-medium">{formatDateTimeDDMMYYYY(b.createdAt)}</span>
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
                              setSelectedCabin("");
                              setSelectedCabinData(null);
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
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SimpleUserNavbar />
        <div className="pt-24 px-4 max-w-full mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-gray-500 text-sm">Loading bookings...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
      onClick: () => setFilters({ status: 'all', paymentStatus: 'all', spaceType: 'all' })
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

  return (
    <div className="admin-dash" style={{ backgroundColor: '#ffffff' }}>
      <SimpleUserNavbar />

      <div className="pt-20 px-3 sm:px-4 md:px-6 lg:px-8 max-w-full mx-auto pb-16">
        {/* Header */}
        <div className="admin-dash__header" style={{ marginBottom: '8px' }}>
          <div>
            <h1 className="admin-dash__greeting" style={{ fontSize: '1.25rem' }}>
              My <span>Space Bookings</span>
            </h1>
            <p className="admin-dash__subtitle" style={{ fontSize: '11px' }}>Manage all your workspace bookings</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/usersitevisits")}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg text-xs font-medium hover:bg-purple-700 transition flex items-center gap-2 shadow-sm shadow-purple-200"
            >
              <Calendar size={16} />
              View Site Visits
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
                value={filters.spaceType}
                onChange={(e) => setFilters({...filters, spaceType: e.target.value})}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
              >
                <option value="all">All Types</option>
                <option value="medical">🏥 Medical Chamber</option>
                <option value="coworking">💼 Co-Working Space</option>
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
              {(filters.status !== 'all' || filters.paymentStatus !== 'all' || filters.spaceType !== 'all' || filterDate || searchTerm) && (
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
            {filters.spaceType !== 'all' && ` • Filtered by: ${filters.spaceType === 'medical' ? 'Medical Chamber' : 'Co-Working Space'}`}
          </div>
        </div>

        {/* Bookings Table */}
        {renderBookingsTable(displayBookings)}

        {/* Footer */}
        <div className="mt-6 text-center text-[9px] text-gray-400 font-medium tracking-wider">
          © IRYAX SPACE — All Rights Reserved
        </div>
      </div>

      {/* ============================================================ */}
      {/* VIEW MODAL - All dates in dd/mm/yyyy format */}
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
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-gradient-to-br from-indigo-600 to-purple-600 text-white p-6 rounded-t-3xl flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold">Booking Details</h3>
                <p className="text-sm text-indigo-200 flex items-center gap-2">
                  <Hash size={14} /> #{viewBooking._id?.slice(-8).toUpperCase()}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-[10px] font-medium">
                    Space Booking
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
              {/* Cabin Details */}
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
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1">
                    <Layers size={12} /> Space Type
                  </p>
                  <div className="mt-2">
                    <span className={`px-3 py-1.5 text-xs font-bold rounded-full inline-flex items-center gap-2 ${
                      viewBooking.cabin?.isChamber 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {viewBooking.cabin?.isChamber ? (
                        <><Stethoscope size={14} /> Medical Chamber</>
                      ) : (
                        <><Briefcase size={14} /> Co-Working Space</>
                      )}
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
                </div>
              </div>

              {/* Schedule - in dd/mm/yyyy format */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <CalendarDays size={12} /> Start
                  </p>
                  <p className="mt-1 font-semibold text-gray-800">{formatDateDDMMYYYY(viewBooking.startDate)}</p>
                  <p className="text-sm font-bold text-indigo-600">{formatTime12(viewBooking.startTime)}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <CalendarDays size={12} /> End
                  </p>
                  <p className="mt-1 font-semibold text-gray-800">{formatDateDDMMYYYY(viewBooking.endDate)}</p>
                  <p className="text-sm font-bold text-indigo-600">{formatTime12(viewBooking.endTime)}</p>
                </div>
              </div>

              {/* Booking Info */}
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

              {/* Multi-day Slots - using formatDateIndian (dd/mm/yy) */}
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

              {/* Seats */}
              {viewBooking.selectedSeats && viewBooking.selectedSeats.length > 0 && (
                <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                  <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-2">
                    <Armchair size={14} />
                    Selected Seats ({viewBooking.seatCount})
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {viewBooking.selectedSeats.map((seat) => (
                      <span key={seat._id} className="px-3 py-1.5 bg-white rounded-lg border border-indigo-200 text-sm font-medium text-gray-700">
                        {seat.name} <span className="text-gray-400 text-xs">#{seat.number}</span>
                      </span>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-indigo-600 font-medium">
                    Extra Charge: ₹{viewBooking.extraCharge || 0}
                  </p>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
                <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-2 mb-3">
                  <Calculator size={14} /> Price Breakdown
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center border-b border-emerald-100 pb-1.5">
                    <span className="text-gray-600">Subtotal ({viewBooking.totalHours}h × ₹{viewBooking.cabin?.price || 0})</span>
                    <span className="font-semibold text-gray-800">₹{(viewBooking.subtotal || 0).toFixed(2)}</span>
                  </div>
                  {viewBooking.extraCharge > 0 && (
                    <div className="flex justify-between items-center border-b border-emerald-100 pb-1.5">
                      <span className="text-gray-600">Seat Charges</span>
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

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-200">
                <button
                  onClick={() => { setShowViewModal(false); downloadInvoice(viewBooking); }}
                  className="flex-1 min-w-[120px] py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-sm"
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

      {/* REPLACE MODAL - Dates in dd/mm/yyyy format */}
      {showReplaceModal && replaceBooking && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowReplaceModal(false)}>
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-5 rounded-t-3xl flex justify-between items-center shrink-0">
              <div>
                <h3 className="text-xl font-bold">Replace Space</h3>
                <p className="text-sm text-blue-200">{replaceBooking.cabin?.name} → New Space</p>
              </div>
              <button onClick={() => setShowReplaceModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4 overflow-y-auto flex-1">
              <div className="bg-blue-50 rounded-xl p-4 text-sm">
                <p className="font-bold text-blue-800">Current Booking</p>
                <p className="text-slate-600 mt-1">{replaceBooking.cabin?.name}</p>
                <p className="text-xs text-slate-500">{formatDateDDMMYYYY(replaceBooking.startDate)} {formatTime12(replaceBooking.startTime)} - {formatDateDDMMYYYY(replaceBooking.endDate)} {formatTime12(replaceBooking.endTime)}</p>
                <p className="text-xs font-bold text-slate-700 mt-1">Total: ₹{replaceBooking.totalPrice}</p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Select New Cabin</label>
                <div className="relative">
                  <select
                    value={selectedCabin}
                    onChange={(e) => setSelectedCabin(e.target.value)}
                    className="w-full p-3 pr-10 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                  >
                    <option value="">Select a cabin...</option>
                    {allCabins
                      .filter(c => c._id !== replaceBooking.cabin?._id)
                      .map(c => (
                        <option key={c._id} value={c._id}>
                          {c.name} - ₹{c.price}/hr {c.isChamber ? '🏥' : '💼'}
                        </option>
                      ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {selectedCabinData && priceDiff && (
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-3">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Price Comparison</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-[10px] text-blue-600 font-medium">Current</p>
                      <p className="font-bold text-slate-800">₹{replaceBooking.cabin?.price}/hr</p>
                      <p className="text-xs text-slate-500">₹{replaceBooking.totalPrice}</p>
                    </div>
                    <div className="bg-emerald-50 rounded-lg p-3">
                      <p className="text-[10px] text-emerald-600 font-medium">New</p>
                      <p className="font-bold text-slate-800">₹{selectedCabinData.price}/hr</p>
                      <p className="text-xs text-slate-500">₹{priceDiff.newTotal}</p>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    {priceDiff.finalDifference > 0 ? (
                      <div className="flex items-center justify-between text-amber-600 bg-amber-50 rounded-lg p-3">
                        <span className="text-sm font-medium">Extra to pay</span>
                        <span className="font-bold text-lg">+₹{Math.round(priceDiff.finalDifference)}</span>
                      </div>
                    ) : priceDiff.finalDifference < 0 ? (
                      <div className="flex items-center justify-between text-emerald-600 bg-emerald-50 rounded-lg p-3">
                        <span className="text-sm font-medium">Refund</span>
                        <span className="font-bold text-lg">-₹{Math.round(Math.abs(priceDiff.finalDifference))}</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-slate-600 bg-slate-100 rounded-lg p-3">
                        <span className="text-sm font-medium">No difference</span>
                        <span className="font-bold text-lg">₹0</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-200 shrink-0">
              <button
                onClick={handleReplaceBooking}
                disabled={replaceLoading || !selectedCabin}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {replaceLoading ? 'Replacing...' : <><RefreshCw size={16} /> Replace Booking</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CANCEL MODAL - Dates in dd/mm/yyyy format */}
      {showCancelModal && cancelBooking && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowCancelModal(false)}>
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-br from-red-600 to-red-700 text-white p-5 rounded-t-3xl flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">Cancel Booking</h3>
                <p className="text-sm text-red-200">{cancelBooking.cabin?.name}</p>
              </div>
              <button onClick={() => setShowCancelModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-red-50 rounded-xl p-4 text-sm">
                <p className="font-bold text-red-800">Are you sure you want to cancel this booking?</p>
                <div className="mt-2 space-y-1 text-slate-600">
                  <p><span className="text-slate-500">Cabin:</span> {cancelBooking.cabin?.name}</p>
                  <p><span className="text-slate-500">Start:</span> {formatDateDDMMYYYY(cancelBooking.startDate)} {formatTime12(cancelBooking.startTime)}</p>
                  <p><span className="text-slate-500">End:</span> {formatDateDDMMYYYY(cancelBooking.endDate)} {formatTime12(cancelBooking.endTime)}</p>
                  <p><span className="text-slate-500">Total:</span> ₹{cancelBooking.totalPrice}</p>
                </div>
              </div>
              <div className="bg-amber-50 rounded-xl p-3 text-xs text-amber-700 flex items-start gap-2">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Cancellation Policy:</p>
                  <ul className="list-disc pl-4 mt-1 space-y-0.5">
                    <li>Free cancellation within 24 hours</li>
                    <li>50% refund after 24 hours</li>
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
};

export default SimpleUserBookings;