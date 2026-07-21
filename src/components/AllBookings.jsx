// AllBookings.jsx - Redesigned with Consistent UI (Updated with new response structure)
import axios from "axios";
import {
  Calendar,
  Clock,
  IndianRupee,
  MapPin,
  Search,
  User,
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
  Trash2,
  Download,
  TrendingUp,
  CreditCard,
  Users,
  Filter,
  Phone,
  Building2,
  Wifi,
  Car,
  Lock,
  Bath,
  Shield,
  Armchair,
  Store,
  Receipt,
  Hash,
  ArrowUpRight,
  XCircle as XCircleIcon
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AdminNavbar from "./AdminNavbar";
import * as XLSX from 'xlsx';
import "./Dashboard.css";

const API_URL = "https://spaceapi.iryax.com";
const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000";

const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    active: 0,
    completed: 0,
    cancelled: 0,
    pending: 0,
    totalRevenue: 0,
    totalVisits: 0,
    totalBookings: 0
  });

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [updating, setUpdating] = useState(false);

  const [showViewModal, setShowViewModal] = useState(false);
  const [viewBooking, setViewBooking] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteBooking, setDeleteBooking] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentBooking, setPaymentBooking] = useState(null);
  const [newPaymentStatus, setNewPaymentStatus] = useState("");
  const [updatingPayment, setUpdatingPayment] = useState(false);

  const getImageUrl = (img) => {
    if (!img) return PLACEHOLDER_IMAGE;
    if (img.startsWith("http")) return img;
    const cleanPath = img.replace(/\\/g, "/").replace(/^\/+/, "");
    return `${API_URL}/${cleanPath}`;
  };

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
      return { label: 'Cash', color: 'bg-orange-100 text-orange-700', icon: <Store size={12} className="text-orange-500" /> };
    }
    return { label: 'Online', color: 'bg-blue-100 text-blue-700', icon: <CreditCard size={12} className="text-blue-500" /> };
  };

  const getPaymentStatusBadge = (status) => {
    if (status === 'paid') return { label: 'Paid', color: 'bg-emerald-100 text-emerald-700', icon: <CheckCircle size={12} className="text-emerald-500" /> };
    if (status === 'refunded') return { label: 'Refunded', color: 'bg-purple-100 text-purple-700', icon: <XCircle size={12} className="text-purple-500" /> };
    if (status === 'failed') return { label: 'Failed', color: 'bg-red-100 text-red-700', icon: <XCircle size={12} className="text-red-500" /> };
    return { label: 'Pending', color: 'bg-yellow-100 text-yellow-700', icon: <ClockIcon size={12} className="text-yellow-500" /> };
  };

  const calculateStats = (data) => {
    const total = data.length;
    const confirmed = data.filter(b => b.status === 'confirmed').length;
    const active = data.filter(b => b.status === 'active').length;
    const completed = data.filter(b => b.status === 'completed').length;
    const cancelled = data.filter(b => b.status === 'cancelled').length;
    const pending = data.filter(b => b.status === 'pending').length;
    const totalRevenue = data.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    const totalVisits = data.filter(b => b.bookingType === 'visit').length;
    const totalBookings = data.filter(b => b.bookingType !== 'visit').length;

    setStats({ total, confirmed, active, completed, cancelled, pending, totalRevenue, totalVisits, totalBookings });
  };

  useEffect(() => {
    axios
      .get(`${API_URL}/api/bookings`)
      .then((res) => {
        const data = res.data.bookings || [];
        setBookings(data);
        calculateStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching bookings:", err);
        setLoading(false);
      });
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (dateStr) => {
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

  const clearFilters = () => {
    setSearchTerm("");
    setFilterDate("");
    setFilterType("all");
    setFilterStatus("all");
  };

  const handleUpdateStatus = async () => {
    if (!selectedBooking || !newStatus) {
      toast.error("Please select a status");
      return;
    }
    
    setUpdating(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_URL}/api/bookings/update-status/${selectedBooking._id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        const updatedBookings = bookings.map(b =>
          b._id === selectedBooking._id ? { ...b, status: newStatus } : b
        );
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
      console.error("Update status error:", error);
      toast.error(error.response?.data?.error || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdatePaymentStatus = async () => {
    if (!paymentBooking || !newPaymentStatus) {
      toast.error("Please select a payment status");
      return;
    }
    
    setUpdatingPayment(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_URL}/api/bookings/bookingpayment-status/${paymentBooking._id}`,
        { paymentStatus: newPaymentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        const updatedBookings = bookings.map(b =>
          b._id === paymentBooking._id ? { ...b, paymentStatus: newPaymentStatus } : b
        );
        setBookings(updatedBookings);
        calculateStats(updatedBookings);

        toast.success(`Payment status updated to ${newPaymentStatus}`);
        setShowPaymentModal(false);
        setPaymentBooking(null);
        setNewPaymentStatus("");
      } else {
        toast.error(response.data.error || "Failed to update payment status");
      }
    } catch (error) {
      console.error("Update payment status error:", error);
      toast.error(error.response?.data?.error || "Failed to update payment status");
    } finally {
      setUpdatingPayment(false);
    }
  };

  const handleViewBooking = (booking) => {
    setViewBooking(booking);
    setShowViewModal(true);
  };

  const handleDeleteBooking = async () => {
    if (!deleteBooking) return;
    
    setDeleting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${API_URL}/api/bookings/${deleteBooking._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedBookings = bookings.filter(b => b._id !== deleteBooking._id);
      setBookings(updatedBookings);
      calculateStats(updatedBookings);

      toast.success("Booking deleted successfully");
      setShowDeleteModal(false);
      setDeleteBooking(null);
    } catch (error) {
      console.error("Delete booking error:", error);
      toast.error(error.response?.data?.error || "Failed to delete booking");
    } finally {
      setDeleting(false);
    }
  };

  const exportToExcel = () => {
    try {
      if (filteredBookings.length === 0) {
        toast.warning("No bookings to export");
        return;
      }

      const exportData = filteredBookings.map((booking, index) => {
        const statusBadge = getStatusBadge(booking.status);
        const paymentMethod = getPaymentMethodBadge(booking.paymentMethod);
        const paymentStatus = getPaymentStatusBadge(booking.paymentStatus);
        const seatNames = booking.selectedSeats?.map(s => s.name).join(', ') || 'N/A';
        
        return {
          'S.No': index + 1,
          'Booking Type': booking.bookingBasis === 'plan' ? 'Plan Booking' : 'Hourly Booking',
          'Cabin Name': booking.cabin?.name || 'Unknown Cabin',
          'Address': booking.cabin?.address || 'No Address',
          'Owner Name': booking.cabin?.owner?.name || 'N/A',
          'Customer Name': booking.name || booking.user?.name || 'Unknown Guest',
          'Mobile': booking.mobile || booking.user?.mobile || 'N/A',
          'Email': booking.email || booking.user?.email || 'N/A',
          'Start Date': booking.startDate || 'N/A',
          'Start Time': booking.startTime || 'N/A',
          'End Date': booking.endDate || 'N/A',
          'End Time': booking.endTime || 'N/A',
          'Duration (Hours)': booking.totalHours || 0,
          'Seats': booking.seatCount || 0,
          'Seat Names': seatNames,
          'Extra Charge': booking.extraCharge || 0,
          'Subtotal (₹)': booking.subtotal || 0,
          'GST (18%)': booking.gstAmount || 0,
          'Total (₹)': booking.totalPrice || 0,
          'Status': statusBadge.label,
          'Payment Method': paymentMethod.label,
          'Payment Status': paymentStatus.label,
          'Transaction ID': booking.transactionId || 'N/A',
          'Terms Accepted': booking.termsAccepted ? 'Yes' : 'No'
        };
      });

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'All_Bookings');
      
      const date = new Date().toISOString().split('T')[0];
      XLSX.writeFile(wb, `all_bookings_${date}.xlsx`);
      
      toast.success(`Exported ${filteredBookings.length} bookings to Excel!`);
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export bookings");
    }
  };

  const downloadInvoice = (booking) => {
    try {
      const cabin = booking.cabin || {};
      const owner = cabin.owner || {};
      const cabinName = cabin.name || 'Unknown Cabin';
      const cabinAddress = cabin.address || 'N/A';
      const ownerOrganization = owner.organizationName || 'IRYAX Workspace';
      const ownerGst = owner.gstNumber || 'N/A';
      const ownerAddress = owner.address || 'N/A';
      
      const amount = booking.totalPrice || 0;
      const subtotal = booking.subtotal || 0;
      const gstAmount = booking.gstAmount || 0;
      const extraCharge = booking.extraCharge || 0;
      const seatCount = booking.seatCount || 0;
      const selectedSeats = booking.selectedSeats || [];
      const orderId = booking._id.slice(-8).toUpperCase();
      const startDate = booking.startDate || 'N/A';
      const startTime = booking.startTime || 'N/A';
      const endDate = booking.endDate || 'N/A';
      const endTime = booking.endTime || 'N/A';
      const status = booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1) || 'N/A';
      const paymentStatus = booking.paymentStatus === 'paid' ? 'Paid' : 'Pending';
      const paymentMethod = booking.paymentMethod === 'cash' || booking.paymentMethod === 'counter' ? 'Cash' : 'Online';
      const totalHours = booking.totalHours || 0;
      const customerName = booking.name || booking.user?.name || 'Customer';
      const customerMobile = booking.mobile || booking.user?.mobile || 'N/A';
      const customerEmail = booking.email || booking.user?.email || 'N/A';
      const transactionId = booking.transactionId || 'N/A';
      const termsAccepted = booking.termsAccepted ? 'Yes' : 'No';
      const today = new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });

      // Generate seat list HTML
      let seatListHtml = '';
      if (selectedSeats && selectedSeats.length > 0) {
        seatListHtml = selectedSeats.map(s => 
          `<span style="display:inline-block;background:#f0fdf4;padding:1px 10px;border-radius:12px;margin:2px;font-size:11px;border:1px solid #86efac;">${s.name} (#${s.number})</span>`
        ).join('');
      }

      const win = window.open('', '_blank', 'width=900,height=700');
      if (win) {
        win.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <title>Invoice #${orderId}</title>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { font-family: 'Times New Roman', 'Georgia', serif; background: #ffffff; padding: 40px; display: flex; justify-content: center; min-height: 100vh; color: #000000; }
              .invoice-container { max-width: 800px; width: 100%; background: #ffffff; border: 2px solid #000000; padding: 40px 45px; }
              .invoice-header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px double #000000; padding-bottom: 20px; margin-bottom: 25px; }
              .brand h1 { font-size: 28px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #1a56db; }
              .brand .gst { font-size: 11px; color: #666666; margin-top: 2px; }
              .brand .address-line { font-size: 11px; color: #666666; margin-top: 2px; }
              .invoice-number { text-align: right; }
              .invoice-number .label { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #666666; }
              .invoice-number .number { font-size: 22px; font-weight: 700; color: #000000; margin-top: 2px; }
              .invoice-number .date { font-size: 12px; color: #333333; margin-top: 4px; }
              .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 25px; padding-bottom: 20px; border-bottom: 1px solid #cccccc; }
              .info-group .title { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #666666; margin-bottom: 6px; }
              .info-group .value { font-size: 14px; font-weight: 600; color: #000000; line-height: 1.6; }
              .info-group .value-small { font-size: 12px; font-weight: 400; color: #333333; }
              .info-group .address-line { font-size: 12px; color: #333333; margin-top: 2px; }
              .seat-section { margin: 15px 0; padding: 12px; background: #f8fafc; border-radius: 6px; border: 1px solid #e2e8f0; }
              .seat-section .title { font-size: 10px; font-weight: 700; text-transform: uppercase; color: #666666; }
              .seat-section .seats { margin-top: 5px; display: flex; flex-wrap: wrap; gap: 3px; }
              .invoice-table { width: 100%; border-collapse: collapse; margin: 20px 0 25px; }
              .invoice-table thead { border-top: 2px solid #000000; border-bottom: 2px solid #000000; }
              .invoice-table thead th { padding: 10px 12px; text-align: left; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #000000; }
              .invoice-table thead th:last-child { text-align: right; }
              .invoice-table tbody td { padding: 10px 12px; font-size: 13px; color: #000000; border-bottom: 1px solid #eeeeee; }
              .invoice-table tbody td:last-child { text-align: right; font-weight: 600; }
              .totals { margin-top: 20px; padding-top: 20px; border-top: 2px solid #000000; display: flex; justify-content: flex-end; }
              .totals-box { width: 320px; }
              .totals-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; color: #333333; }
              .totals-row.total { font-size: 20px; font-weight: 700; color: #000000; border-top: 2px solid #000000; padding-top: 12px; margin-top: 6px; }
              .status-row { display: flex; gap: 30px; margin-top: 15px; padding-top: 15px; border-top: 1px solid #cccccc; flex-wrap: wrap; }
              .status-row .item { font-size: 12px; }
              .status-row .item .label { color: #666666; text-transform: uppercase; font-weight: 700; font-size: 9px; letter-spacing: 0.5px; }
              .status-row .item .value { font-weight: 600; color: #000000; margin-top: 2px; }
              .footer { text-align: center; padding-top: 25px; margin-top: 25px; border-top: 2px solid #000000; }
              .footer .powered { font-size: 14px; font-weight: 700; letter-spacing: 2px; color: #1a56db; }
              .footer .sub { font-size: 10px; color: #666666; margin-top: 4px; }
              .print-btn { position: fixed; bottom: 30px; right: 30px; padding: 14px 28px; background: #000000; color: #ffffff; border: none; border-radius: 4px; font-weight: 600; font-size: 13px; cursor: pointer; box-shadow: 0 4px 20px rgba(0,0,0,0.15); display: flex; align-items: center; gap: 10px; font-family: 'Segoe UI', Arial, sans-serif; letter-spacing: 0.5px; }
              .print-btn:hover { background: #222222; }
              @media print { body { background: white; padding: 20px; } .invoice-container { border: 1px solid #000000; padding: 30px; } .print-btn { display: none !important; } }
              @media (max-width: 640px) { body { padding: 20px; } .invoice-container { padding: 25px; } .invoice-header { flex-direction: column; text-align: center; gap: 15px; } .invoice-number { text-align: center; } .info-grid { grid-template-columns: 1fr; gap: 15px; } .totals { justify-content: center; } .totals-box { width: 100%; } .status-row { flex-direction: column; gap: 8px; } }
            </style>
          </head>
          <body>
            <div class="invoice-container">
              <div class="invoice-header">
                <div class="brand"><h1>${ownerOrganization.toUpperCase()}</h1><div class="gst">GST: ${ownerGst}</div><div class="address-line">${ownerAddress}</div></div>
                <div class="invoice-number"><div class="label">Invoice</div><div class="number">#${orderId}</div><div class="date">${today}</div></div>
              </div>
              <div class="info-grid">
                <div><div class="title">Bill To</div><div class="value">${customerName}</div><div class="value-small">${customerMobile}</div><div class="value-small">${customerEmail}</div></div>
                <div><div class="title">Cabin Details</div><div class="value">${cabinName}</div><div class="address-line">${cabinAddress}</div><div class="value-small" style="margin-top:4px;">${totalHours} Hours • ${booking.bookingBasis === 'plan' ? 'Plan Booking' : 'Hourly'}</div></div>
              </div>
              ${selectedSeats.length > 0 ? `
                <div class="seat-section">
                  <div class="title">Selected Seats (${seatCount})</div>
                  <div class="seats">${seatListHtml}</div>
                  <div style="margin-top:6px;font-size:11px;color:#666666;">Extra Charge: ₹${extraCharge}</div>
                </div>
              ` : ''}
              <table class="invoice-table"><thead><tr><th>Description</th><th>Details</th><th>Amount</th></tr></thead>
                <tbody>
                  <tr><td><strong>Cabin Booking</strong></td><td>${cabinName}<br><span style="font-size:11px;color:#666666;">${startDate} · ${startTime} to ${endDate} · ${endTime}</span>${booking.bookingBasis === 'plan' && booking.selectedPlan ? `<br><span style="font-size:11px;color:#666666;">Plan: ${booking.selectedPlan.label || 'Subscription'}</span>` : ''}${transactionId !== 'N/A' ? `<br><span style="font-size:10px;color:#888888;font-family:monospace;">TXN: ${transactionId}</span>` : ''}<br><span style="font-size:10px;color:#888888;">Terms Accepted: ${termsAccepted}</span></td><td>₹${subtotal.toFixed(2)}</td></tr>
                  ${extraCharge > 0 ? `<tr><td><strong>Seat Charges</strong></td><td>${seatCount} seats × ₹100</td><td>₹${extraCharge.toFixed(2)}</td></tr>` : ''}
                </tbody></table>
              <div class="status-row"><div class="item"><div class="label">Payment Method</div><div class="value">${paymentMethod}</div></div><div class="item"><div class="label">Payment Status</div><div class="value">${paymentStatus}</div></div><div class="item"><div class="label">Booking Status</div><div class="value">${status}</div></div>${transactionId !== 'N/A' ? `<div class="item"><div class="label">Transaction ID</div><div class="value" style="font-family:monospace;font-size:11px;">${transactionId}</div></div>` : ''}</div>
              <div class="totals"><div class="totals-box"><div class="totals-row"><span>Subtotal</span><span>₹${subtotal.toFixed(2)}</span></div>${extraCharge > 0 ? `<div class="totals-row"><span>Seat Charges</span><span>₹${extraCharge.toFixed(2)}</span></div>` : ''}<div class="totals-row"><span>GST (18%)</span><span>₹${gstAmount.toFixed(2)}</span></div><div class="totals-row total"><span>Total Amount</span><span>₹${amount.toFixed(2)}</span></div></div></div>
              <div class="footer"><div class="powered">POWERED BY <span>IRYAX SPACE</span></div><div class="sub">Thank you for choosing ${ownerOrganization}</div><div class="sub" style="margin-top:2px;">This is a system generated invoice</div></div>
            </div>
            <button class="print-btn" onclick="window.print()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M18 9H6"/><path d="M18 13v6H6v-6"/><rect x="8" y="2" width="8" height="4" rx="1"/><rect x="8" y="13" width="8" height="4" rx="1"/></svg>Print / Save PDF</button>
          </body></html>
        `);
        win.document.close();
        win.focus();
        toast.success('Invoice opened! Click Print to save as PDF.');
      } else {
        toast.error('Please allow popups to download invoice');
      }
    } catch (error) {
      console.error('Invoice download error:', error);
      toast.error('Failed to generate invoice');
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const userName = b.user?.name || b.name || "";
    const userMobile = b.user?.mobile || b.mobile || "";
    const cabinName = b.cabin?.name || "";
    const ownerName = b.cabin?.owner?.name || "";
    
    const matchesSearch =
      userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cabinName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userMobile.includes(searchTerm) ||
      ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.status?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = filterDate ? b.startDate === filterDate : true;
    
    let matchesType = true;
    if (filterType === "visit") {
      matchesType = b.bookingType === "visit";
    } else if (filterType === "hourly") {
      matchesType = b.bookingType !== "visit" && b.bookingBasis === "hourly";
    } else if (filterType === "plan") {
      matchesType = b.bookingType !== "visit" && b.bookingBasis === "plan";
    }
    
    let matchesStatus = true;
    if (filterStatus !== "all") {
      matchesStatus = b.status === filterStatus;
    }
    
    return matchesSearch && matchesDate && matchesType && matchesStatus;
  });

  if (loading) {
    return (
      <div className="admin-dash" style={{ backgroundColor: '#ffffff' }}>
        <AdminNavbar />
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dash" style={{ backgroundColor: '#ffffff' }}>
      <AdminNavbar />

      <div className="pt-24 px-3 sm:px-4 md:px-6 lg:px-8 max-w-full mx-auto pb-16">
        {/* Header */}
        <div className="admin-dash__header">
          <div>
            <h1 className="admin-dash__greeting">
              All <span>Bookings</span>
            </h1>
            <p className="admin-dash__subtitle">
              Manage and track all workspace reservations.
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

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-4 text-white shadow-lg shadow-indigo-500/25">
            <p className="text-[8px] font-bold uppercase tracking-wider text-indigo-200">Total</p>
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-[8px] text-indigo-200 mt-1">{formatCurrency(stats.totalRevenue)}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm text-center">
            <p className="text-[8px] font-bold uppercase tracking-wider text-emerald-600">Confirmed</p>
            <p className="text-2xl font-bold text-emerald-600">{stats.confirmed}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm text-center">
            <p className="text-[8px] font-bold uppercase tracking-wider text-indigo-600">Active</p>
            <p className="text-2xl font-bold text-indigo-600">{stats.active}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm text-center">
            <p className="text-[8px] font-bold uppercase tracking-wider text-blue-600">Completed</p>
            <p className="text-2xl font-bold text-blue-600">{stats.completed}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm text-center">
            <p className="text-[8px] font-bold uppercase tracking-wider text-yellow-600">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm text-center">
            <p className="text-[8px] font-bold uppercase tracking-wider text-red-600">Cancelled</p>
            <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-blue-50 rounded-xl border border-blue-200 p-3 text-center">
            <p className="text-[8px] font-bold uppercase tracking-wider text-blue-600">Bookings</p>
            <p className="text-2xl font-bold text-blue-700">{stats.totalBookings}</p>
          </div>
          <div className="bg-purple-50 rounded-xl border border-purple-200 p-3 text-center">
            <p className="text-[8px] font-bold uppercase tracking-wider text-purple-600">Visits</p>
            <p className="text-2xl font-bold text-purple-700">{stats.totalVisits}</p>
          </div>
          <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-3 text-center">
            <p className="text-[8px] font-bold uppercase tracking-wider text-emerald-600">Revenue</p>
            <p className="text-xl font-bold text-emerald-700">{formatCurrency(stats.totalRevenue)}</p>
          </div>
        </div>

        {/* Table Section */}
        <div className="admin-dash__card" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}>
          <div className="admin-dash__card-header flex flex-wrap items-center justify-between gap-3" style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb' }}>
            <div className="flex items-center gap-3">
              <h3 className="admin-dash__card-title">All Bookings</h3>
              <span className="px-2.5 py-0.5 text-xs font-bold text-indigo-700 bg-indigo-100 rounded-full">
                {filteredBookings.length}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {/* Search Bar */}
              <div className="relative w-full sm:w-48">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
              
              {/* Filter Toggle Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${showFilters ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                <Filter size={14} />
                Filters
                {(filterType !== 'all' || filterStatus !== 'all' || filterDate) && (
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                )}
              </button>

              {filteredBookings.length > 0 && (
                <button onClick={exportToExcel} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium hover:bg-indigo-100 transition-colors border border-indigo-200">
                  <Download size={14} />
                  <span className="hidden xs:inline">Export</span>
                </button>
              )}

              <button onClick={() => navigate("/my-cabins")} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors">
                <Building2 size={14} className="text-indigo-600" />
                <span className="hidden xs:inline">Cabins</span>
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="px-4 pt-4 pb-3 border-b border-gray-100" style={{ backgroundColor: '#fafafa' }}>
              <div className="flex flex-wrap items-end gap-3">
                <div className="min-w-[130px]">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Date</label>
                  <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                </div>
                <div className="min-w-[130px]">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Booking Type</label>
                  <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
                    <option value="all">All</option>
                    <option value="visit">Site Visits</option>
                    <option value="hourly">Hourly</option>
                    <option value="plan">Plan</option>
                  </select>
                </div>
                <div className="min-w-[130px]">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status</label>
                  <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
                    <option value="all">All</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <button onClick={clearFilters} className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-red-600 transition-colors">
                  <XCircleIcon size={14} /> Clear
                </button>
              </div>
            </div>
          )}

          {/* Table Container */}
          <div className="admin-dash__card-body p-0 overflow-x-auto" style={{ backgroundColor: '#ffffff' }}>
            {filteredBookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-20 text-gray-400">
                <Calendar size={48} className="opacity-20" />
                <p className="text-lg font-medium">No bookings found</p>
                <p className="text-sm">Try adjusting your filters.</p>
              </div>
            ) : (
              <table className="w-full min-w-[1300px] text-left">
                <thead>
                  <tr className="border-b border-gray-100" style={{ backgroundColor: '#f9fafb' }}>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">#</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Type</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Cabin</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Owner</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Customer</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Period</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Seats</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Status</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Payment</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Amount</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredBookings.map((booking, idx) => {
                    const statusBadge = getStatusBadge(booking.status);
                    const paymentMethodBadge = getPaymentMethodBadge(booking.paymentMethod);
                    const paymentStatusBadge = getPaymentStatusBadge(booking.paymentStatus);
                    const ownerName = booking.cabin?.owner?.name || "N/A";
                    const isCashPending = (booking.paymentMethod === 'cash' || booking.paymentMethod === 'counter') && booking.paymentStatus === 'pending';
                    const seatCount = booking.seatCount || 0;
                    const seatNames = booking.selectedSeats?.map(s => s.name).join(', ') || 'N/A';
                    
                    return (
                      <tr key={booking._id} className="transition-colors group hover:bg-gray-50/80">
                        <td className="p-4">
                          <span className="text-sm font-semibold text-gray-400">#{idx + 1}</span>
                        </td>
                        <td className="p-4">
                          {booking.bookingBasis === "plan" ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-100">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 inline-block"></span>
                              Plan
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                              Hourly
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                              <Building2 size={18} className="text-indigo-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">{booking.cabin?.name || "Unknown"}</p>
                              <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                                <MapPin size={12} className="text-indigo-500" />
                                {booking.cabin?.address?.split(",")[0] || "No Address"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="font-medium text-gray-800 text-sm">{ownerName}</p>
                            <p className="text-xs text-gray-400">{booking.cabin?.owner?.mobile || "N/A"}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                              <User size={18} className="text-gray-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-800 text-sm">{booking.name || booking.user?.name || "Unknown"}</p>
                              <p className="text-xs text-gray-400">{booking.mobile || "N/A"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            <p className="text-sm text-gray-900 font-medium">{booking.startDate} · {booking.startTime}</p>
                            <p className="text-sm text-gray-500">{booking.endDate} · {booking.endTime}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <div>
                            <span className="flex items-center gap-1 text-sm font-medium text-gray-700">
                              <Armchair size={14} className="text-indigo-500" />
                              {seatCount}
                            </span>
                            {seatCount > 0 && (
                              <p className="text-[10px] text-gray-400 truncate max-w-[120px]" title={seatNames}>
                                {seatNames}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full ${statusBadge.color}`}>
                            {statusBadge.icon} {statusBadge.label}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col gap-1">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-full ${paymentMethodBadge.color}`}>
                              {paymentMethodBadge.icon} {paymentMethodBadge.label}
                            </span>
                            <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-full ${paymentStatusBadge.color}`}>
                              {paymentStatusBadge.icon} {paymentStatusBadge.label}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div>
                            <span className="flex items-center gap-0.5 text-indigo-600 font-bold text-sm">
                              <IndianRupee size={14} />
                              {booking.totalPrice?.toLocaleString("en-IN") || "0"}
                            </span>
                            {booking.extraCharge > 0 && (
                              <p className="text-[9px] text-amber-500">+₹{booking.extraCharge} seat</p>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <button onClick={() => handleViewBooking(booking)} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors whitespace-nowrap">
                              <Eye size={13} /> View
                            </button>
                            <button onClick={() => downloadInvoice(booking)} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors whitespace-nowrap">
                              <FileDown size={13} /> Invoice
                            </button>
                            <button onClick={() => { setSelectedBooking(booking); setNewStatus(booking.status || 'pending'); setShowStatusModal(true); }} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-orange-50 text-orange-700 hover:bg-orange-100 transition-colors whitespace-nowrap">
                              <Edit size={13} /> Status
                            </button>
                            {isCashPending && (
                              <button onClick={() => { setPaymentBooking(booking); setNewPaymentStatus(booking.paymentStatus || 'pending'); setShowPaymentModal(true); }} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-yellow-50 text-yellow-700 hover:bg-yellow-100 transition-colors whitespace-nowrap">
                                <CreditCard size={13} /> Payment
                              </button>
                            )}
                            <button onClick={() => { setDeleteBooking(booking); setShowDeleteModal(true); }} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-700 hover:bg-red-100 transition-colors whitespace-nowrap">
                              <Trash2 size={13} /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Footer with stats */}
          {!loading && filteredBookings.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-100 rounded-b-2xl flex flex-wrap items-center justify-between gap-2" style={{ backgroundColor: '#fafafa' }}>
              <span className="text-xs text-gray-500">
                Showing <strong>{filteredBookings.length}</strong> of <strong>{bookings.length}</strong> bookings
              </span>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Confirmed: {stats.confirmed}</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-500"></span> Active: {stats.active}</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500"></span> Pending: {stats.pending}</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Cancelled: {stats.cancelled}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ====================== */}
      {/* VIEW BOOKING MODAL */}
      {/* ====================== */}
      {showViewModal && viewBooking && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) setShowViewModal(false); }}>
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-gradient-to-br from-indigo-600 to-purple-600 text-white p-6 rounded-t-3xl flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Receipt size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Booking Details</h3>
                  <p className="text-sm text-indigo-200">#{viewBooking._id.slice(-6).toUpperCase()}</p>
                </div>
              </div>
              <button onClick={() => setShowViewModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Cabin</p>
                  <p className="mt-1 font-semibold text-gray-800">{viewBooking.cabin?.name || 'N/A'}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Customer</p>
                  <p className="mt-1 font-semibold text-gray-800">{viewBooking.name || viewBooking.user?.name || 'N/A'}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Mobile</p>
                  <p className="mt-1 font-semibold text-gray-800">{viewBooking.mobile || viewBooking.user?.mobile || 'N/A'}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email</p>
                  <p className="mt-1 font-semibold text-gray-800 text-sm break-all">{viewBooking.email || viewBooking.user?.email || 'N/A'}</p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Schedule</p>
                <p className="mt-1 font-semibold text-gray-800">{viewBooking.startDate} {viewBooking.startTime} - {viewBooking.endDate} {viewBooking.endTime}</p>
                <p className="text-xs text-gray-500 mt-0.5">{viewBooking.totalHours}h • {viewBooking.bookingBasis === 'plan' ? 'Plan' : 'Hourly'}</p>
              </div>

              {/* Seats Section */}
              {viewBooking.selectedSeats && viewBooking.selectedSeats.length > 0 && (
                <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200">
                  <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-2">
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
                  {viewBooking.extraCharge > 0 && (
                    <p className="text-xs text-amber-600 mt-2">Extra Charge: ₹{viewBooking.extraCharge}</p>
                  )}
                </div>
              )}

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-indigo-50 rounded-xl text-center">
                  <p className="text-[10px] text-indigo-500 font-bold uppercase">Status</p>
                  <span className={`px-3 py-1 text-xs font-bold rounded-full inline-block mt-1 ${getStatusBadge(viewBooking.status).color}`}>
                    {getStatusBadge(viewBooking.status).label}
                  </span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl text-center">
                  <p className="text-[10px] text-gray-500 font-bold uppercase">Payment</p>
                  <span className={`px-3 py-1 text-xs font-bold rounded-full inline-block mt-1 ${getPaymentMethodBadge(viewBooking.paymentMethod).color}`}>
                    {getPaymentMethodBadge(viewBooking.paymentMethod).label}
                  </span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl text-center">
                  <p className="text-[10px] text-gray-500 font-bold uppercase">Pmt Status</p>
                  <span className={`px-3 py-1 text-xs font-bold rounded-full inline-block mt-1 ${getPaymentStatusBadge(viewBooking.paymentStatus).color}`}>
                    {getPaymentStatusBadge(viewBooking.paymentStatus).label}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Subtotal</p>
                  <p className="mt-1 font-semibold text-gray-800">₹{viewBooking.subtotal?.toFixed(2) || '0'}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">GST (18%)</p>
                  <p className="mt-1 font-semibold text-gray-800">₹{viewBooking.gstAmount?.toFixed(2) || '0'}</p>
                </div>
              </div>

              <div className="bg-green-50 rounded-xl p-3 border border-green-100">
                <p className="text-xs font-bold text-green-600 uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle size={14} /> Terms
                </p>
                <p className="font-semibold text-green-700 mt-1">{viewBooking.termsAccepted ? 'Accepted' : 'Not Accepted'}</p>
              </div>

              {viewBooking.visitingTimings && viewBooking.visitingTimings.length > 0 && (
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <p className="text-xs font-medium text-blue-600 uppercase tracking-wider flex items-center gap-1">
                    <Clock size={14} /> Visit Log ({viewBooking.visitingTimings.length} entries)
                  </p>
                  <div className="space-y-1.5 mt-2">
                    {viewBooking.visitingTimings.map((timing, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm bg-white rounded-lg p-2 border border-blue-100">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-blue-600">Day {idx + 1}</span>
                          <span className="text-gray-600">{formatDate(timing.date)}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-medium text-emerald-600">IN: {timing.checkIn}</span>
                          <span className="text-xs font-medium text-red-500">OUT: {timing.checkOut}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Amount</p>
                  <p className="text-xl font-bold text-indigo-600 mt-1">₹{viewBooking.totalPrice?.toLocaleString('en-IN') || 0}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Created</p>
                  <p className="mt-1 font-semibold text-gray-800 text-sm">{formatDate(viewBooking.createdAt)}</p>
                </div>
              </div>

              {viewBooking.transactionId && (
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Transaction ID</p>
                  <p className="mt-1 font-mono text-xs text-gray-700 break-all">{viewBooking.transactionId}</p>
                </div>
              )}

              <button onClick={() => { setShowViewModal(false); downloadInvoice(viewBooking); }} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-sm active:scale-[0.98] flex items-center justify-center gap-2">
                <FileDown size={16} /> Download Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================== */}
      {/* STATUS UPDATE MODAL */}
      {/* ====================== */}
      {showStatusModal && selectedBooking && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) { setShowStatusModal(false); setSelectedBooking(null); setNewStatus(""); } }}>
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-5 text-white rounded-t-3xl flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center"><Edit size={20} className="text-white" /></div>
                <div><h3 className="text-xl font-bold">Update Status</h3><p className="text-sm text-indigo-200">{selectedBooking.cabin?.name}</p></div>
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
                      <button key={status} onClick={() => setNewStatus(status)} className={`py-2.5 rounded-xl text-xs font-bold border transition ${isSelected ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 hover:bg-gray-50 text-gray-700'}`}>
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
                <button onClick={handleUpdateStatus} disabled={updating || !newStatus} className={`flex-1 py-3 rounded-xl text-white font-bold transition ${(updating || !newStatus) ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg'}`}>
                  {updating ? 'Updating...' : 'Update Status'}
                </button>
                <button onClick={() => { setShowStatusModal(false); setSelectedBooking(null); setNewStatus(""); }} className="px-5 py-3 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================== */}
      {/* PAYMENT STATUS UPDATE MODAL */}
      {/* ====================== */}
      {showPaymentModal && paymentBooking && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) { setShowPaymentModal(false); setPaymentBooking(null); setNewPaymentStatus(""); } }}>
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-5 text-white rounded-t-3xl flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center"><CreditCard size={20} className="text-white" /></div>
                <div><h3 className="text-xl font-bold">Update Payment</h3><p className="text-sm text-amber-100">₹{paymentBooking.totalPrice}</p></div>
              </div>
              <button onClick={() => { setShowPaymentModal(false); setPaymentBooking(null); setNewPaymentStatus(""); }} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"><X size={20} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between"><span className="text-gray-500">Current Status</span><span className={`px-3 py-1 text-xs font-bold rounded-full ${getPaymentStatusBadge(paymentBooking.paymentStatus).color}`}>{getPaymentStatusBadge(paymentBooking.paymentStatus).label}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Method</span><span className={`px-3 py-1 text-xs font-bold rounded-full ${getPaymentMethodBadge(paymentBooking.paymentMethod).color}`}>{getPaymentMethodBadge(paymentBooking.paymentMethod).label}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Total</span><span className="font-bold text-gray-800">₹{paymentBooking.totalPrice}</span></div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">New Status</label>
                <div className="grid grid-cols-2 gap-2">
                  {['pending','paid','failed','refunded'].map(s => {
                    const badge = getPaymentStatusBadge(s);
                    const isSelected = newPaymentStatus === s;
                    return (
                      <button key={s} onClick={() => setNewPaymentStatus(s)} className={`py-2.5 rounded-xl text-xs font-bold border transition ${isSelected ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 hover:bg-gray-50 text-gray-700'}`}>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>{badge.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="bg-amber-50 rounded-xl p-3 text-xs text-amber-700 flex items-start gap-2 border border-amber-200">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>Marking as paid will add the amount to the owner's wallet.</span>
              </div>
              <div className="flex gap-3">
                <button onClick={handleUpdatePaymentStatus} disabled={updatingPayment || !newPaymentStatus} className={`flex-1 py-3 rounded-xl text-white font-bold transition ${(updatingPayment || !newPaymentStatus) ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:shadow-lg'}`}>
                  {updatingPayment ? 'Updating...' : 'Update Payment'}
                </button>
                <button onClick={() => { setShowPaymentModal(false); setPaymentBooking(null); setNewPaymentStatus(""); }} className="px-5 py-3 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================== */}
      {/* DELETE BOOKING MODAL */}
      {/* ====================== */}
      {showDeleteModal && deleteBooking && (
        <div className="fixed inset-0 z-[1300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) { setShowDeleteModal(false); setDeleteBooking(null); } }}>
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-br from-red-500 to-red-600 p-5 text-white rounded-t-3xl flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center"><Trash2 size={20} className="text-white" /></div>
                <div><h3 className="text-xl font-bold">Delete Booking</h3><p className="text-sm text-red-200">{deleteBooking.cabin?.name}</p></div>
              </div>
              <button onClick={() => { setShowDeleteModal(false); setDeleteBooking(null); }} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"><X size={20} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-red-50 rounded-xl p-4 space-y-2 text-sm">
                <p className="font-bold text-red-800">Are you sure you want to delete this booking?</p>
                <div className="space-y-1 text-gray-600">
                  <p><span className="text-gray-500">Cabin:</span> {deleteBooking.cabin?.name || 'N/A'}</p>
                  <p><span className="text-gray-500">Customer:</span> {deleteBooking.name || deleteBooking.user?.name || 'N/A'}</p>
                  <p><span className="text-gray-500">Date:</span> {deleteBooking.startDate} · {deleteBooking.startTime}</p>
                  <p><span className="text-gray-500">Amount:</span> ₹{deleteBooking.totalPrice}</p>
                </div>
              </div>
              <div className="bg-amber-50 rounded-xl p-3 text-xs text-amber-700 flex items-start gap-2 border border-amber-200">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>This action cannot be undone. All associated data will be permanently removed.</span>
              </div>
              <div className="flex gap-3">
                <button onClick={handleDeleteBooking} disabled={deleting} className={`flex-1 py-3 rounded-xl text-white font-bold transition ${deleting ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-red-500 to-red-600 hover:shadow-lg'}`}>
                  {deleting ? 'Deleting...' : 'Confirm Delete'}
                </button>
                <button onClick={() => { setShowDeleteModal(false); setDeleteBooking(null); }} className="px-5 py-3 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllBookings;