// AllBookings.jsx - Complete with Payment Method & Payment Status

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
  Store
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AdminNavbar from "./AdminNavbar";
import * as XLSX from 'xlsx';
import "./Dashboard.css";

const API_URL = "http://localhost:5000";
const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000";

const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

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

  // Payment Status Modal
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
        color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
        icon: <ClockIcon size={12} className="text-yellow-500" />
      },
      confirmed: {
        label: 'Confirmed',
        color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        icon: <CheckCircle size={12} className="text-emerald-500" />
      },
      active: {
        label: 'Active',
        color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        icon: <Timer size={12} className="text-indigo-500" />
      },
      completed: {
        label: 'Completed',
        color: 'bg-blue-50 text-blue-700 border-blue-200',
        icon: <CheckCircle size={12} className="text-blue-500" />
      },
      cancelled: {
        label: 'Cancelled',
        color: 'bg-red-50 text-red-700 border-red-200',
        icon: <XCircle size={12} className="text-red-500" />
      }
    };
    const defaultStatus = {
      label: status || 'Unknown',
      color: 'bg-gray-50 text-gray-700 border-gray-200',
      icon: <AlertCircle size={12} className="text-gray-500" />
    };
    return statusMap[status?.toLowerCase()] || defaultStatus;
  };

  // Payment Method Badge
  const getPaymentMethodBadge = (method) => {
    if (method === 'counter') {
      return {
        label: 'Counter',
        color: 'bg-orange-50 text-orange-700 border-orange-200',
        icon: <Store size={12} className="text-orange-500" />
      };
    }
    return {
      label: 'Online',
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: <CreditCard size={12} className="text-blue-500" />
    };
  };

  // Payment Status Badge
  const getPaymentStatusBadge = (status) => {
    if (status === 'paid') {
      return {
        label: 'Paid',
        color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        icon: <CheckCircle size={12} className="text-emerald-500" />
      };
    }
    return {
      label: 'Pending',
      color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      icon: <ClockIcon size={12} className="text-yellow-500" />
    };
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

  // ======================
  // UPDATE STATUS
  // ======================
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

  // ======================
  // UPDATE PAYMENT STATUS
  // ======================
  const handleUpdatePaymentStatus = async () => {
    if (!paymentBooking || !newPaymentStatus) {
      toast.error("Please select a payment status");
      return;
    }
    
    setUpdatingPayment(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_URL}/api/bookings/booking/${paymentBooking._id}/payment-status`,
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

  // ======================
  // VIEW BOOKING
  // ======================
  const handleViewBooking = (booking) => {
    setViewBooking(booking);
    setShowViewModal(true);
  };

  // ======================
  // DELETE BOOKING
  // ======================
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

  // ======================
  // EXPORT TO EXCEL
  // ======================
  const exportToExcel = () => {
    try {
      if (filteredBookings.length === 0) {
        toast.warning("No bookings to export");
        return;
      }

      const exportData = filteredBookings.map((booking, index) => {
        const isVisit = booking.bookingType === "visit";
        const statusBadge = getStatusBadge(booking.status);
        const paymentMethod = getPaymentMethodBadge(booking.paymentMethod);
        const paymentStatus = getPaymentStatusBadge(booking.paymentStatus);
        return {
          'S.No': index + 1,
          'Booking Type': isVisit ? 'Site Visit' : 
                           booking.bookingBasis === 'plan' ? 'Plan Booking' : 'Hourly Booking',
          'Cabin Name': booking.cabinId?.name || 'Unknown Cabin',
          'Address': booking.cabinId?.address || 'No Address',
          'Owner Name': booking.cabinId?.owner?.name || 'N/A',
          'Owner Mobile': booking.cabinId?.owner?.mobile || 'N/A',
          'Customer Name': booking.name || booking.userId?.name || 'Unknown Guest',
          'Customer Mobile': booking.mobile || booking.userId?.mobile || 'N/A',
          'Email': booking.email || booking.userId?.email || 'N/A',
          'Start Date': booking.startDate || 'N/A',
          'Start Time': booking.startTime || 'N/A',
          'End Date': booking.endDate || 'N/A',
          'End Time': booking.endTime || 'N/A',
          'Duration (Hours)': isVisit ? 'Visit' : (booking.totalHours || 0),
          'Hours Used': booking.hoursUsed || 0,
          'Remaining Hours': booking.remainingHours || 0,
          'Status': statusBadge.label,
          'Payment Method': paymentMethod.label,
          'Payment Status': paymentStatus.label,
          'Amount (₹)': isVisit ? 'Free' : (booking.totalPrice || 0),
          'Transaction ID': booking.transactionId || 'N/A'
        };
      });

      const ws = XLSX.utils.json_to_sheet(exportData);
      ws['!cols'] = [
        { wch: 6 }, { wch: 18 }, { wch: 25 }, { wch: 30 },
        { wch: 20 }, { wch: 15 }, { wch: 20 }, { wch: 15 },
        { wch: 25 }, { wch: 15 }, { wch: 12 }, { wch: 15 },
        { wch: 12 }, { wch: 15 }, { wch: 15 }, { wch: 15 },
        { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 20 }
      ];

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

  // ======================
  // DOWNLOAD INVOICE
  // ======================
  const downloadInvoice = (booking) => {
    try {
      const cabinName = booking.cabinId?.name || 'Unknown Cabin';
      const cabinAddress = booking.cabinId?.address || 'N/A';
      const amount = booking.totalPrice || 0;
      const orderId = booking._id.slice(-8).toUpperCase();
      const startDate = booking.startDate || 'N/A';
      const startTime = booking.startTime || 'N/A';
      const endDate = booking.endDate || 'N/A';
      const endTime = booking.endTime || 'N/A';
      const status = booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1) || 'N/A';
      const paymentStatus = booking.paymentStatus === 'paid' ? 'Paid ✅' : 'Pending ⏳';
      const paymentMethod = booking.paymentMethod === 'counter' ? 'Pay at Counter' : 'Online Payment';
      const isVisit = booking.bookingType === 'visit';
      const customerName = booking.name || booking.userId?.name || 'N/A';
      const customerMobile = booking.mobile || booking.userId?.mobile || 'N/A';
      const customerEmail = booking.email || booking.userId?.email || 'N/A';
      const ownerName = booking.cabinId?.owner?.name || 'N/A';
      const totalHours = booking.totalHours || 0;
      const hoursUsed = booking.hoursUsed || 0;
      const remainingHours = booking.remainingHours || 0;
      const transactionId = booking.transactionId || 'N/A';

      const invoiceHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Invoice #${orderId}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: 'Segoe UI', Arial, sans-serif;
              background: #f0f2f5;
              padding: 40px;
              display: flex;
              justify-content: center;
              min-height: 100vh;
            }
            .invoice-container {
              max-width: 800px;
              width: 100%;
              background: white;
              border-radius: 16px;
              box-shadow: 0 10px 40px rgba(0,0,0,0.08);
              overflow: hidden;
            }
            .invoice-header {
              background: linear-gradient(135deg, #1e1b4b 0%, #4f46e5 100%);
              padding: 30px 40px;
              color: white;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .invoice-header h1 { font-size: 28px; font-weight: 700; }
            .invoice-header .sub { font-size: 14px; opacity: 0.8; }
            .invoice-header .order-id {
              background: rgba(255,255,255,0.2);
              padding: 8px 16px;
              border-radius: 8px;
              font-size: 14px;
              font-weight: 600;
            }
            .invoice-body { padding: 40px; }
            .invoice-row {
              display: flex;
              justify-content: space-between;
              padding: 12px 0;
              border-bottom: 1px solid #f1f5f9;
            }
            .invoice-row:last-child { border-bottom: none; }
            .invoice-label { color: #64748b; font-size: 14px; font-weight: 500; }
            .invoice-value { color: #0f172a; font-size: 14px; font-weight: 600; }
            .invoice-value.amount { font-size: 24px; color: #4f46e5; }
            .invoice-total {
              background: #f8fafc;
              border-radius: 12px;
              padding: 20px 24px;
              margin-top: 20px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .invoice-total .label { color: #475569; font-size: 16px; font-weight: 600; }
            .invoice-total .amount { font-size: 28px; font-weight: 700; color: #4f46e5; }
            .status-badge {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: 600;
            }
            .status-badge.confirmed { background: #d1fae5; color: #065f46; }
            .status-badge.pending { background: #fef3c7; color: #92400e; }
            .status-badge.active { background: #e0e7ff; color: #3730a3; }
            .status-badge.completed { background: #dbeafe; color: #1e40af; }
            .status-badge.cancelled { background: #fee2e2; color: #991b1b; }
            .status-badge.paid { background: #d1fae5; color: #065f46; }
            .payment-badge {
              display: inline-block;
              padding: 2px 10px;
              border-radius: 12px;
              font-size: 11px;
              font-weight: 600;
            }
            .payment-badge.online { background: #dbeafe; color: #1e40af; }
            .payment-badge.counter { background: #fffbeb; color: #92400e; }
            .footer {
              text-align: center;
              padding: 20px 40px;
              border-top: 1px solid #f1f5f9;
              color: #94a3b8;
              font-size: 12px;
            }
            .footer strong { color: #4f46e5; }
            .print-btn {
              position: fixed;
              bottom: 30px;
              right: 30px;
              padding: 12px 24px;
              background: #4f46e5;
              color: white;
              border: none;
              border-radius: 12px;
              font-weight: 600;
              cursor: pointer;
              box-shadow: 0 4px 14px rgba(79,70,229,0.4);
              display: flex;
              align-items: center;
              gap: 10px;
            }
            .print-btn:hover { background: #4338ca; }
            @media print {
              body { background: white; padding: 0; }
              .invoice-container { box-shadow: none; border-radius: 0; }
              .print-btn { display: none !important; }
              .invoice-header { background: #1e1b4b !important; -webkit-print-color-adjust: exact; }
              .status-badge { -webkit-print-color-adjust: exact; }
              .payment-badge { -webkit-print-color-adjust: exact; }
            }
            @media (max-width: 640px) {
              body { padding: 20px; }
              .invoice-header { flex-direction: column; text-align: center; gap: 15px; padding: 25px; }
              .invoice-body { padding: 25px; }
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <div class="invoice-header">
              <div>
                <h1>🧾 INVOICE</h1>
                <div class="sub">IRYAX Workspace • Booking</div>
              </div>
              <div class="order-id">#${orderId}</div>
            </div>
            <div class="invoice-body">
              <div class="invoice-row">
                <span class="invoice-label">Cabin</span>
                <span class="invoice-value">${cabinName}</span>
              </div>
              <div class="invoice-row">
                <span class="invoice-label">Address</span>
                <span class="invoice-value">${cabinAddress}</span>
              </div>
              <div class="invoice-row">
                <span class="invoice-label">Payment Method</span>
                <span class="invoice-value"><span class="payment-badge ${booking.paymentMethod}">${paymentMethod}</span></span>
              </div>
              <div class="invoice-row">
                <span class="invoice-label">Payment Status</span>
                <span class="invoice-value"><span class="status-badge ${booking.paymentStatus}">${paymentStatus}</span></span>
              </div>
              <div class="invoice-row">
                <span class="invoice-label">Owner</span>
                <span class="invoice-value">${ownerName}</span>
              </div>
              <div class="invoice-row">
                <span class="invoice-label">Customer</span>
                <span class="invoice-value">${customerName}</span>
              </div>
              <div class="invoice-row">
                <span class="invoice-label">Mobile</span>
                <span class="invoice-value">${customerMobile}</span>
              </div>
              <div class="invoice-row">
                <span class="invoice-label">Email</span>
                <span class="invoice-value">${customerEmail}</span>
              </div>
              ${isVisit ? `
              <div class="invoice-row">
                <span class="invoice-label">Type</span>
                <span class="invoice-value">Site Visit</span>
              </div>
              ` : `
              <div class="invoice-row">
                <span class="invoice-label">Total Hours</span>
                <span class="invoice-value">${totalHours} Hours</span>
              </div>
              <div class="invoice-row">
                <span class="invoice-label">Hours Used</span>
                <span class="invoice-value">${hoursUsed} Hours</span>
              </div>
              <div class="invoice-row">
                <span class="invoice-label">Remaining</span>
                <span class="invoice-value">${remainingHours} Hours</span>
              </div>
              `}
              <div class="invoice-row">
                <span class="invoice-label">Start</span>
                <span class="invoice-value">${startDate} · ${startTime}</span>
              </div>
              ${!isVisit ? `
              <div class="invoice-row">
                <span class="invoice-label">End</span>
                <span class="invoice-value">${endDate} · ${endTime}</span>
              </div>
              ` : ''}
              <div class="invoice-row">
                <span class="invoice-label">Status</span>
                <span class="invoice-value"><span class="status-badge ${booking.status}">${status}</span></span>
              </div>
              <div class="invoice-row">
                <span class="invoice-label">Transaction ID</span>
                <span class="invoice-value" style="font-family:monospace;font-size:12px;">${transactionId}</span>
              </div>
              ${isVisit ? `
              <div class="invoice-total">
                <span class="label">Site Visit</span>
                <span class="amount" style="color:#059669;">FREE</span>
              </div>
              ` : `
              <div class="invoice-total">
                <span class="label">Total Amount</span>
                <span class="amount">₹${amount.toLocaleString('en-IN')}</span>
              </div>
              `}
            </div>
            <div class="footer">
              Thank you for choosing <strong>IRYAX Workspace</strong> • System generated invoice
            </div>
          </div>
          <button class="print-btn" onclick="window.print()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 6 2 18 2 18 9"/>
              <path d="M18 9H6"/>
              <path d="M18 13v6H6v-6"/>
              <rect x="8" y="2" width="8" height="4" rx="1"/>
              <rect x="8" y="13" width="8" height="4" rx="1"/>
            </svg>
            Print / Save PDF
          </button>
        </body>
        </html>
      `;

      const win = window.open('', '_blank', 'width=900,height=700');
      if (win) {
        win.document.write(invoiceHTML);
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

  // Amenity Icon Map
  const amenityMap = {
    wifi: { label: "Wi-Fi", icon: Wifi },
    parking: { label: "Parking", icon: Car },
    lockers: { label: "Lockers", icon: Lock },
    privateWashroom: { label: "Private Washroom", icon: Bath },
    secureAccess: { label: "Secure Access", icon: Shield },
    comfortSeating: { label: "Comfort Seating", icon: Armchair },
  };

  const filteredBookings = bookings.filter((b) => {
    const userName = b.userId?.name || b.name || "";
    const userMobile = b.userId?.mobile || b.mobile || "";
    const cabinName = b.cabinId?.name || "";
    const ownerName = b.cabinId?.owner?.name || "";
    
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

  if (loading)
    return (
      <div className="admin-dash">
        <AdminNavbar />
        <div className="admin-dash__loading">
          <div className="admin-dash__spinner" />
          <p className="admin-dash__loading-text">Loading bookings...</p>
        </div>
      </div>
    );

  return (
    <div className="admin-dash">
      <AdminNavbar />

      <main className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
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
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-grow sm:flex-grow-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all w-full sm:w-64"
              />
            </div>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all w-full sm:w-auto"
            >
              <option value="all">All Types</option>
              <option value="visit">Site Visits</option>
              <option value="hourly">Hourly</option>
              <option value="plan">Plan</option>
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all w-full sm:w-auto"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all w-full sm:w-auto"
            />
            
            {filteredBookings.length > 0 && (
              <button
                onClick={exportToExcel}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors w-full sm:w-auto"
              >
                <Download size={16} />
                Export Excel
              </button>
            )}
            
            {(searchTerm || filterDate || filterType !== "all" || filterStatus !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterDate("");
                  setFilterType("all");
                  setFilterStatus("all");
                }}
                className="flex items-center justify-center gap-2 p-2.5 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 transition-colors w-full sm:w-auto"
                title="Clear Filters"
              >
                <X size={18} />
                <span className="sm:hidden text-sm font-medium">Clear Filters</span>
              </button>
            )}
            <div className="px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm flex sm:flex-col justify-between items-center sm:items-start gap-2 sm:gap-1">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider leading-none mb-0 sm:mb-1">Found</p>
              <p className="text-lg font-black text-slate-900 leading-none">
                {filteredBookings.length} <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest ml-1">Results</span>
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-4 text-white shadow-lg shadow-indigo-500/25">
            <p className="text-[8px] font-bold uppercase tracking-wider text-indigo-200">Total</p>
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-[8px] text-indigo-200 mt-1">{formatCurrency(stats.totalRevenue)}</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm text-center">
            <p className="text-[8px] font-bold uppercase tracking-wider text-emerald-600">Confirmed</p>
            <p className="text-2xl font-bold text-emerald-600">{stats.confirmed}</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm text-center">
            <p className="text-[8px] font-bold uppercase tracking-wider text-indigo-600">Active</p>
            <p className="text-2xl font-bold text-indigo-600">{stats.active}</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm text-center">
            <p className="text-[8px] font-bold uppercase tracking-wider text-blue-600">Completed</p>
            <p className="text-2xl font-bold text-blue-600">{stats.completed}</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm text-center">
            <p className="text-[8px] font-bold uppercase tracking-wider text-yellow-600">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm text-center">
            <p className="text-[8px] font-bold uppercase tracking-wider text-red-600">Cancelled</p>
            <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-blue-50 rounded-2xl border border-blue-200 p-3 text-center">
            <p className="text-[8px] font-bold uppercase tracking-wider text-blue-600">📋 Bookings</p>
            <p className="text-2xl font-bold text-blue-700">{stats.totalBookings}</p>
          </div>
          <div className="bg-purple-50 rounded-2xl border border-purple-200 p-3 text-center">
            <p className="text-[8px] font-bold uppercase tracking-wider text-purple-600">👀 Visits</p>
            <p className="text-2xl font-bold text-purple-700">{stats.totalVisits}</p>
          </div>
          <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-3 text-center">
            <p className="text-[8px] font-bold uppercase tracking-wider text-emerald-600">💰 Revenue</p>
            <p className="text-xl font-bold text-emerald-700">{formatCurrency(stats.totalRevenue)}</p>
          </div>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="admin-dash__error" style={{ background: '#f8fafc', borderColor: '#e2e8f0' }}>
            <CalendarIcon size={48} className="text-slate-300 mb-4" />
            <p className="admin-dash__error-title" style={{ color: '#475569' }}>No bookings found</p>
            <p className="admin-dash__error-message">We couldn't find any bookings matching your search criteria.</p>
            {(searchTerm || filterDate || filterType !== "all" || filterStatus !== "all") && (
              <button
                onClick={() => { 
                  setSearchTerm(""); 
                  setFilterDate(""); 
                  setFilterType("all");
                  setFilterStatus("all");
                }}
                className="mt-4 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Reset All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Cabin Details</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Owner</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Booking Period</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Duration</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Payment Method</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Payment Status</th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredBookings.map((booking) => {
                      const isVisit = booking.bookingType === "visit";
                      const userName = booking.userId?.name || booking.name || "Unknown";
                      const statusBadge = getStatusBadge(booking.status);
                      const paymentMethodBadge = getPaymentMethodBadge(booking.paymentMethod);
                      const paymentStatusBadge = getPaymentStatusBadge(booking.paymentStatus);
                      const ownerName = booking.cabinId?.owner?.name || "N/A";
                      
                      return (
                      <tr key={booking._id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          {isVisit ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block"></span>
                              Site Visit
                            </span>
                          ) : booking.bookingBasis === "plan" ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-100">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 inline-block"></span>
                              Plan: {booking.selectedPlan?.label || "Subscription"}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                              Hourly Booking
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${isVisit ? "bg-blue-50" : "bg-indigo-50"}`}>
                              <Calendar size={18} className={isVisit ? "text-blue-500" : "text-indigo-600"} />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900 text-sm">
                                {booking.cabinId?.name || "Unknown Cabin"}
                              </p>
                              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                                <MapPin size={12} className="text-indigo-500" />
                                {booking.cabinId?.address?.split(",")[0] || "No Address"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-slate-800 text-sm">
                              {ownerName}
                            </p>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                              <Phone size={12} className="text-indigo-400" />
                              {booking.cabinId?.owner?.mobile || "N/A"}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                              <User size={18} className="text-slate-600" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-900 text-sm">
                                {userName}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                              </svg>
                              {booking.userId?.mobile || booking.mobile || "No Mobile"}
                            </div>
                            {booking.email && (
                              <div className="text-xs text-slate-400">{booking.email}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-start gap-2">
                            <Clock size={16} className="text-indigo-500 mt-0.5 flex-shrink-0" />
                            <div className="space-y-1">
                              <p className="text-sm text-slate-900 font-medium">
                                {booking.startDate} · {booking.startTime}
                              </p>
                              {!isVisit && (
                                <p className="text-sm text-slate-500">
                                  {booking.endDate} · {booking.endTime}
                                </p>
                              )}
                              {booking.isCheckedIn && (
                                <p className="text-[8px] text-emerald-600 font-bold mt-0.5">
                                  ⏱ Checked In
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {isVisit ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">Visit</span>
                          ) : (
                            <div>
                              <span className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">
                                {booking.totalHours}h
                              </span>
                              {booking.remainingHours > 0 && (
                                <span className="block text-[8px] text-emerald-600 font-bold">
                                  {booking.remainingHours}h left
                                </span>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${statusBadge.color}`}>
                            {statusBadge.icon}
                            {statusBadge.label}
                          </span>
                        </td>
                        {/* Payment Method - Separate Column */}
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${paymentMethodBadge.color}`}>
                            {paymentMethodBadge.icon}
                            {paymentMethodBadge.label}
                          </span>
                        </td>
                        {/* Payment Status - Separate Column */}
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${paymentStatusBadge.color}`}>
                            {paymentStatusBadge.icon}
                            {paymentStatusBadge.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {isVisit ? (
                            <span className="font-bold text-emerald-600 text-sm">Free</span>
                          ) : (
                            <div className="flex items-center justify-end gap-1 text-indigo-600 font-bold text-lg">
                              <IndianRupee size={18} />
                              {booking.totalPrice?.toLocaleString("en-IN") || "0"}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-1.5 flex-wrap">
                            <button
                              onClick={() => handleViewBooking(booking)}
                              className="p-1.5 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                              title="View Details"
                            >
                              <Eye size={15} />
                            </button>
                            
                            <button
                              onClick={() => downloadInvoice(booking)}
                              className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
                              title="Download Invoice"
                            >
                              <FileDown size={15} />
                            </button>
                            
                            <button
                              onClick={() => {
                                setSelectedBooking(booking);
                                setNewStatus(booking.status || 'pending');
                                setShowStatusModal(true);
                              }}
                              className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                              title="Update Status"
                            >
                              <Edit size={15} />
                            </button>

                            {/* Payment Status Update - Only for counter payments with pending status */}
                            {booking.paymentMethod === 'counter' && booking.paymentStatus === 'pending' && (
                              <button
                                onClick={() => {
                                  setPaymentBooking(booking);
                                  setNewPaymentStatus(booking.paymentStatus || 'pending');
                                  setShowPaymentModal(true);
                                }}
                                className="p-1.5 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition-colors"
                                title="Mark as Paid"
                              >
                                <CreditCard size={15} />
                              </button>
                            )}
                            
                            <button
                              onClick={() => {
                                setDeleteBooking(booking);
                                setShowDeleteModal(true);
                              }}
                              className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                              title="Delete Booking"
                            >
                              <Trash2 size={15} />
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

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {filteredBookings.map((booking) => {
                const isVisit = booking.bookingType === "visit";
                const userName = booking.userId?.name || booking.name || "Unknown";
                const statusBadge = getStatusBadge(booking.status);
                const paymentMethodBadge = getPaymentMethodBadge(booking.paymentMethod);
                const paymentStatusBadge = getPaymentStatusBadge(booking.paymentStatus);
                const ownerName = booking.cabinId?.owner?.name || "N/A";
                
                return (
                  <div key={booking._id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 flex-wrap">
                        {isVisit ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block"></span>
                            Site Visit
                          </span>
                        ) : booking.bookingBasis === "plan" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 inline-block"></span>
                            Plan: {booking.selectedPlan?.label || "Subscription"}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                            Hourly Booking
                          </span>
                        )}
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${statusBadge.color}`}>
                          {statusBadge.icon}
                          {statusBadge.label}
                        </span>
                      </div>
                      <div className="text-right">
                        {isVisit ? (
                          <span className="font-bold text-emerald-600 text-sm">Free</span>
                        ) : (
                          <div className="flex items-center gap-0.5 text-indigo-600 font-bold text-base">
                            <IndianRupee size={14} />
                            {booking.totalPrice?.toLocaleString("en-IN") || "0"}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-3 border-t border-slate-100 pt-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${isVisit ? "bg-blue-50" : "bg-indigo-50"}`}>
                        <Calendar size={18} className={isVisit ? "text-blue-500" : "text-indigo-600"} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 text-sm">
                          {booking.cabinId?.name || "Unknown Cabin"}
                        </h4>
                        <p className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                          <MapPin size={12} className="text-indigo-500" />
                          {booking.cabinId?.address || "No Address"}
                        </p>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-3 flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-400 uppercase tracking-wider">
                        <Clock size={12} className="text-indigo-500" />
                        <span>Booking Period</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-slate-950">
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">From</p>
                          <p className="text-xs font-semibold">{booking.startDate}</p>
                          <p className="text-[11px] text-slate-500">{booking.startTime}</p>
                        </div>
                        {!isVisit && (
                          <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">To</p>
                            <p className="text-xs font-semibold">{booking.endDate}</p>
                            <p className="text-[11px] text-slate-500">{booking.endTime}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Payment Info in Mobile */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold border ${paymentMethodBadge.color}`}>
                        {paymentMethodBadge.icon}
                        {paymentMethodBadge.label}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold border ${paymentStatusBadge.color}`}>
                        {paymentStatusBadge.icon}
                        {paymentStatusBadge.label}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-slate-100 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                          <User size={12} className="text-slate-600" />
                        </div>
                        <span className="font-medium text-slate-700">{userName}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleViewBooking(booking)}
                          className="p-1 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                          title="View"
                        >
                          <Eye size={12} />
                        </button>
                        <button
                          onClick={() => downloadInvoice(booking)}
                          className="p-1 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
                          title="Invoice"
                        >
                          <FileDown size={12} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedBooking(booking);
                            setNewStatus(booking.status || 'pending');
                            setShowStatusModal(true);
                          }}
                          className="p-1 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                          title="Update"
                        >
                          <Edit size={12} />
                        </button>
                        <button
                          onClick={() => {
                            setDeleteBooking(booking);
                            setShowDeleteModal(true);
                          }}
                          className="p-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                    
                    {/* Owner Info in Mobile */}
                    <div className="pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400 font-medium">Owner</span>
                        <span className="text-xs font-medium text-indigo-600">{ownerName}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* View Booking Modal */}
      {showViewModal && viewBooking && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={(e) => {
          if (e.target === e.currentTarget) setShowViewModal(false);
        }}>
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div style={{
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 60%, #06b6d4 100%)",
              padding: "1.25rem 1.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              position: "sticky",
              top: 0,
              zIndex: 10
            }}>
              <div className="flex items-center gap-3">
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: "rgba(255,255,255,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <Eye size={20} color="#fff" />
                </div>
                <div>
                  <h3 style={{ margin: 0, color: "#fff", fontSize: "1rem", fontWeight: 700 }}>
                    Booking Details
                  </h3>
                  <p style={{ margin: 0, color: "rgba(255,255,255,0.8)", fontSize: "0.75rem" }}>
                    #{viewBooking._id.slice(-6)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowViewModal(false)}
                style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: "rgba(255,255,255,0.15)", border: "none",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", color: "#fff"
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: "1.5rem" }}>
              <div className="space-y-4">
                {/* Cabin Details */}
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Cabin Details</p>
                  <p className="font-semibold text-slate-800 mt-1">{viewBooking.cabinId?.name || 'Unknown'}</p>
                  <p className="text-sm text-slate-600 flex items-center gap-1 mt-0.5">
                    <MapPin size={14} />
                    {viewBooking.cabinId?.address || 'N/A'}
                  </p>
                </div>

                {/* Owner Details */}
                <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                  <p className="text-xs font-medium text-indigo-600 uppercase tracking-wider">👤 Owner</p>
                  <p className="font-semibold text-slate-800 mt-1">
                    {viewBooking.cabinId?.owner?.name || 'N/A'}
                  </p>
                  <p className="text-sm text-slate-600 flex items-center gap-1 mt-0.5">
                    <Phone size={14} className="text-indigo-500" />
                    {viewBooking.cabinId?.owner?.mobile || 'N/A'}
                  </p>
                </div>

                {/* Payment Method & Status */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                    <p className="text-xs font-medium text-orange-600 uppercase tracking-wider">Payment Method</p>
                    <div className="mt-1">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${getPaymentMethodBadge(viewBooking.paymentMethod).color}`}>
                        {getPaymentMethodBadge(viewBooking.paymentMethod).icon}
                        {getPaymentMethodBadge(viewBooking.paymentMethod).label}
                      </span>
                    </div>
                  </div>
                  <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
                    <p className="text-xs font-medium text-yellow-600 uppercase tracking-wider">Payment Status</p>
                    <div className="mt-1">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${getPaymentStatusBadge(viewBooking.paymentStatus).color}`}>
                        {getPaymentStatusBadge(viewBooking.paymentStatus).icon}
                        {getPaymentStatusBadge(viewBooking.paymentStatus).label}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Customer</p>
                    <p className="font-semibold text-slate-800 mt-1">{viewBooking.name || viewBooking.userId?.name || 'N/A'}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Mobile</p>
                    <p className="font-semibold text-slate-800 mt-1">{viewBooking.mobile || viewBooking.userId?.mobile || 'N/A'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Start</p>
                    <p className="font-semibold text-slate-800 mt-1">{viewBooking.startDate} · {viewBooking.startTime}</p>
                  </div>
                  {viewBooking.bookingType !== 'visit' && (
                    <div className="bg-slate-50 rounded-xl p-4">
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">End</p>
                      <p className="font-semibold text-slate-800 mt-1">{viewBooking.endDate} · {viewBooking.endTime}</p>
                    </div>
                  )}
                </div>

                {/* Hours Info */}
                {viewBooking.bookingType !== 'visit' && (
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-indigo-50 rounded-xl p-3 text-center">
                      <p className="text-[8px] font-bold text-indigo-500 uppercase tracking-wider">Total</p>
                      <p className="text-lg font-bold text-indigo-700">{viewBooking.totalHours}h</p>
                    </div>
                    <div className="bg-emerald-50 rounded-xl p-3 text-center">
                      <p className="text-[8px] font-bold text-emerald-500 uppercase tracking-wider">Used</p>
                      <p className="text-lg font-bold text-emerald-700">{viewBooking.hoursUsed || 0}h</p>
                    </div>
                    <div className={`rounded-xl p-3 text-center ${viewBooking.remainingHours > 0 ? 'bg-blue-50' : 'bg-red-50'}`}>
                      <p className={`text-[8px] font-bold uppercase tracking-wider ${viewBooking.remainingHours > 0 ? 'text-blue-500' : 'text-red-500'}`}>Remaining</p>
                      <p className={`text-lg font-bold ${viewBooking.remainingHours > 0 ? 'text-blue-700' : 'text-red-700'}`}>{viewBooking.remainingHours || 0}h</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Status</p>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border mt-1 ${getStatusBadge(viewBooking.status).color}`}>
                      {getStatusBadge(viewBooking.status).icon}
                      {getStatusBadge(viewBooking.status).label}
                    </span>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Amount</p>
                    <p className="text-xl font-bold text-indigo-600 mt-1">
                      {viewBooking.bookingType === 'visit' ? 'Free' : `₹${viewBooking.totalPrice?.toLocaleString('en-IN') || 0}`}
                    </p>
                  </div>
                </div>

                {/* Check History */}
                {viewBooking.checkHistory && viewBooking.checkHistory.length > 0 && (
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Check History</p>
                    <div className="mt-2 space-y-1">
                      {viewBooking.checkHistory.map((entry, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs border-b border-slate-200 pb-1 last:border-0">
                          <div className="flex items-center gap-2">
                            {entry.type === 'in' ? (
                              <span className="text-emerald-600 font-bold">IN</span>
                            ) : (
                              <span className="text-blue-600 font-bold">OUT</span>
                            )}
                            <span className="text-slate-600">{formatDate(entry.timestamp)} {formatTime(entry.timestamp)}</span>
                          </div>
                          <div className="text-slate-500">
                            {entry.hoursUsed}h used · {entry.remainingHours}h left
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {viewBooking.transactionId && (
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Transaction ID</p>
                    <p className="font-mono text-sm text-slate-700 mt-1">{viewBooking.transactionId}</p>
                  </div>
                )}

                <button
                  onClick={() => {
                    setShowViewModal(false);
                    downloadInvoice(viewBooking);
                  }}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: 10,
                    border: "none",
                    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                    color: "#fff",
                    fontFamily: "inherit",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    boxShadow: "0 4px 14px rgba(99,102,241,0.35)",
                    transition: "all 160ms",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)" }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)" }}
                >
                  <FileDown size={18} />
                  Download Invoice
                </button>

                <button
                  onClick={() => setShowViewModal(false)}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: 10,
                    border: "1.5px solid #e2e8f0",
                    background: "#fff",
                    color: "#64748b",
                    fontFamily: "inherit",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 160ms",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#f8fafc"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#fff"; }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {showStatusModal && selectedBooking && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowStatusModal(false);
            setSelectedBooking(null);
            setNewStatus("");
          }
        }}>
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div style={{
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 60%, #06b6d4 100%)",
              padding: "1.25rem 1.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}>
              <div className="flex items-center gap-3">
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: "rgba(255,255,255,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <Edit size={20} color="#fff" />
                </div>
                <div>
                  <h3 style={{ margin: 0, color: "#fff", fontSize: "1rem", fontWeight: 700 }}>
                    Update Booking Status
                  </h3>
                  <p style={{ margin: 0, color: "rgba(255,255,255,0.8)", fontSize: "0.75rem" }}>
                    {selectedBooking.cabinId?.name || "Cabin"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowStatusModal(false);
                  setSelectedBooking(null);
                  setNewStatus("");
                }}
                style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: "rgba(255,255,255,0.15)", border: "none",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", color: "#fff"
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: "1.5rem" }}>
              <div style={{
                background: "#f8fafc",
                borderRadius: 10,
                padding: "0.75rem 1rem",
                marginBottom: "1.25rem"
              }}>
                <div className="flex justify-between items-center">
                  <span style={{ color: "#64748b", fontSize: "0.875rem" }}>Current Status</span>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusBadge(selectedBooking.status).color}`}>
                    {getStatusBadge(selectedBooking.status).icon}
                    {getStatusBadge(selectedBooking.status).label}
                  </span>
                </div>
              </div>

              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{
                  display: "block",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: "0.5rem"
                }}>
                  Select New Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['pending', 'confirmed', 'active', 'completed', 'cancelled'].map((status) => {
                    const badge = getStatusBadge(status);
                    const isSelected = newStatus === status;
                    return (
                      <button
                        key={status}
                        onClick={() => setNewStatus(status)}
                        style={{
                          padding: "0.6rem",
                          borderRadius: 10,
                          border: isSelected ? `2px solid #6366f1` : "1.5px solid #e2e8f0",
                          background: isSelected ? "rgba(99,102,241,0.06)" : "#fff",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.5rem",
                          transition: "all 160ms",
                          fontWeight: isSelected ? 700 : 500,
                          color: isSelected ? "#4f46e5" : "#64748b"
                        }}
                      >
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${badge.color}`}>
                          {badge.icon}
                          {badge.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{
                background: "#fef3c7",
                borderRadius: 8,
                padding: "0.75rem",
                marginBottom: "1.25rem",
                fontSize: "0.75rem",
                color: "#92400e",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}>
                <AlertCircle size={16} className="shrink-0" />
                <span>Changing status will update the booking visibility and availability.</span>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={handleUpdateStatus}
                  disabled={updating || !newStatus}
                  style={{
                    width: "100%",
                    padding: "0.875rem",
                    borderRadius: 10,
                    border: "none",
                    background: (updating || !newStatus)
                      ? "#a5b4fc"
                      : "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                    color: "#fff",
                    fontFamily: "inherit",
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    cursor: (updating || !newStatus) ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    boxShadow: (updating || !newStatus) ? "none" : "0 4px 14px rgba(99,102,241,0.35)",
                    transition: "all 160ms",
                  }}
                >
                  {updating ? (
                    <>
                      <span style={{
                        width: 16, height: 16, borderRadius: "50%",
                        border: "2px solid rgba(255,255,255,0.4)",
                        borderTopColor: "#fff",
                        animation: "spin 0.7s linear infinite",
                        display: "inline-block",
                      }} />
                      Updating...
                    </>
                  ) : (
                    <>Update Status</>
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowStatusModal(false);
                    setSelectedBooking(null);
                    setNewStatus("");
                  }}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: 10,
                    border: "1.5px solid #e2e8f0",
                    background: "#fff",
                    color: "#64748b",
                    fontFamily: "inherit",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 160ms",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#f8fafc"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#fff"; }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {showDeleteModal && deleteBooking && (
        <div className="fixed inset-0 z-[1300] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowDeleteModal(false);
            setDeleteBooking(null);
          }
        }}>
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div style={{
              background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 60%, #991b1b 100%)",
              padding: "1.25rem 1.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}>
              <div className="flex items-center gap-3">
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: "rgba(255,255,255,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <Trash2 size={20} color="#fff" />
                </div>
                <div>
                  <h3 style={{ margin: 0, color: "#fff", fontSize: "1rem", fontWeight: 700 }}>
                    Delete Booking
                  </h3>
                  <p style={{ margin: 0, color: "rgba(255,255,255,0.8)", fontSize: "0.75rem" }}>
                    {deleteBooking.cabinId?.name || "Booking"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteBooking(null);
                }}
                style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: "rgba(255,255,255,0.15)", border: "none",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", color: "#fff"
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: "1.5rem" }}>
              <div style={{
                background: "#fef2f2",
                borderRadius: 12,
                padding: "1rem",
                marginBottom: "1.25rem",
                border: "1px solid #fecaca"
              }}>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span style={{ color: "#64748b", fontSize: "0.875rem" }}>Cabin</span>
                    <span style={{ fontWeight: 600, color: "#1e293b" }}>
                      {deleteBooking.cabinId?.name || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: "#64748b", fontSize: "0.875rem" }}>Customer</span>
                    <span style={{ fontWeight: 600, color: "#1e293b" }}>
                      {deleteBooking.name || deleteBooking.userId?.name || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: "#64748b", fontSize: "0.875rem" }}>Date</span>
                    <span style={{ fontWeight: 600, color: "#1e293b" }}>
                      {deleteBooking.startDate} · {deleteBooking.startTime}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-red-200">
                    <span style={{ color: "#991b1b", fontSize: "0.75rem" }}>⚠️ This action cannot be undone</span>
                  </div>
                </div>
              </div>

              <div style={{
                background: "#fef3c7",
                borderRadius: 8,
                padding: "0.75rem",
                marginBottom: "1.25rem",
                fontSize: "0.75rem",
                color: "#92400e",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}>
                <AlertCircle size={16} className="shrink-0" />
                <span>Deleting this booking will permanently remove all associated data.</span>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={handleDeleteBooking}
                  disabled={deleting}
                  style={{
                    width: "100%",
                    padding: "0.875rem",
                    borderRadius: 10,
                    border: "none",
                    background: deleting
                      ? "#fca5a5"
                      : "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
                    color: "#fff",
                    fontFamily: "inherit",
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    cursor: deleting ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    boxShadow: deleting ? "none" : "0 4px 14px rgba(220,38,38,0.35)",
                    transition: "all 160ms",
                  }}
                >
                  {deleting ? (
                    <>
                      <span style={{
                        width: 16, height: 16, borderRadius: "50%",
                        border: "2px solid rgba(255,255,255,0.4)",
                        borderTopColor: "#fff",
                        animation: "spin 0.7s linear infinite",
                        display: "inline-block",
                      }} />
                      Deleting...
                    </>
                  ) : (
                    <>Confirm Delete</>
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteBooking(null);
                  }}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: 10,
                    border: "1.5px solid #e2e8f0",
                    background: "#fff",
                    color: "#64748b",
                    fontFamily: "inherit",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 160ms",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#f8fafc"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#fff"; }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================== */}
      {/* PAYMENT STATUS UPDATE MODAL */}
      {/* ====================== */}
      {showPaymentModal && paymentBooking && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowPaymentModal(false);
            setPaymentBooking(null);
            setNewPaymentStatus("");
          }
        }}>
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div style={{
              background: "linear-gradient(135deg, #f59e0b 0%, #d97706 60%, #b45309 100%)",
              padding: "1.25rem 1.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}>
              <div className="flex items-center gap-3">
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: "rgba(255,255,255,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <CreditCard size={20} color="#fff" />
                </div>
                <div>
                  <h3 style={{ margin: 0, color: "#fff", fontSize: "1rem", fontWeight: 700 }}>
                    Update Payment Status
                  </h3>
                  <p style={{ margin: 0, color: "rgba(255,255,255,0.8)", fontSize: "0.75rem" }}>
                    {paymentBooking.cabinId?.name || "Cabin"} - ₹{paymentBooking.totalPrice}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setPaymentBooking(null);
                  setNewPaymentStatus("");
                }}
                style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: "rgba(255,255,255,0.15)", border: "none",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", color: "#fff"
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: "1.5rem" }}>
              <div style={{
                background: "#f8fafc",
                borderRadius: 10,
                padding: "0.75rem 1rem",
                marginBottom: "1.25rem"
              }}>
                <div className="flex justify-between items-center">
                  <span style={{ color: "#64748b", fontSize: "0.875rem" }}>Current Status</span>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${getPaymentStatusBadge(paymentBooking.paymentStatus).color}`}>
                    {getPaymentStatusBadge(paymentBooking.paymentStatus).icon}
                    {getPaymentStatusBadge(paymentBooking.paymentStatus).label}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-200">
                  <span style={{ color: "#64748b", fontSize: "0.875rem" }}>Payment Method</span>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${getPaymentMethodBadge(paymentBooking.paymentMethod).color}`}>
                    {getPaymentMethodBadge(paymentBooking.paymentMethod).icon}
                    {getPaymentMethodBadge(paymentBooking.paymentMethod).label}
                  </span>
                </div>
              </div>

              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{
                  display: "block",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: "0.5rem"
                }}>
                  Select New Payment Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['pending', 'paid', 'failed', 'refunded'].map((status) => {
                    const badge = getPaymentStatusBadge(status);
                    const isSelected = newPaymentStatus === status;
                    return (
                      <button
                        key={status}
                        onClick={() => setNewPaymentStatus(status)}
                        style={{
                          padding: "0.6rem",
                          borderRadius: 10,
                          border: isSelected ? `2px solid #6366f1` : "1.5px solid #e2e8f0",
                          background: isSelected ? "rgba(99,102,241,0.06)" : "#fff",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.5rem",
                          transition: "all 160ms",
                          fontWeight: isSelected ? 700 : 500,
                          color: isSelected ? "#4f46e5" : "#64748b"
                        }}
                      >
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${badge.color}`}>
                          {badge.icon}
                          {badge.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{
                background: "#fef3c7",
                borderRadius: 8,
                padding: "0.75rem",
                marginBottom: "1.25rem",
                fontSize: "0.75rem",
                color: "#92400e",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}>
                <AlertCircle size={16} className="shrink-0" />
                <span>Marking as paid will add the amount to the owner's wallet.</span>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={handleUpdatePaymentStatus}
                  disabled={updatingPayment || !newPaymentStatus}
                  style={{
                    width: "100%",
                    padding: "0.875rem",
                    borderRadius: 10,
                    border: "none",
                    background: (updatingPayment || !newPaymentStatus)
                      ? "#fcd34d"
                      : "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                    color: "#fff",
                    fontFamily: "inherit",
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    cursor: (updatingPayment || !newPaymentStatus) ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    boxShadow: (updatingPayment || !newPaymentStatus) ? "none" : "0 4px 14px rgba(245, 158, 11, 0.35)",
                    transition: "all 160ms",
                  }}
                >
                  {updatingPayment ? (
                    <>
                      <span style={{
                        width: 16, height: 16, borderRadius: "50%",
                        border: "2px solid rgba(255,255,255,0.4)",
                        borderTopColor: "#fff",
                        animation: "spin 0.7s linear infinite",
                        display: "inline-block",
                      }} />
                      Updating...
                    </>
                  ) : (
                    <>Update Payment Status</>
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    setPaymentBooking(null);
                    setNewPaymentStatus("");
                  }}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: 10,
                    border: "1.5px solid #e2e8f0",
                    background: "#fff",
                    color: "#64748b",
                    fontFamily: "inherit",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 160ms",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#f8fafc"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#fff"; }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllBookings;