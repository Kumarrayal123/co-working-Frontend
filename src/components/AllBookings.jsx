// AllBookings.jsx - Complete with Professional Invoice
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
  Hash
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AdminNavbar from "./AdminNavbar";
import * as XLSX from 'xlsx';
import "./Dashboard.css";

const API_URL = "http://62.72.29.27:5003";
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

  const getPaymentMethodBadge = (method) => {
    if (method === 'cash' || method === 'counter') {
      return {
        label: 'Cash',
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

  const getPaymentStatusBadge = (status) => {
    if (status === 'paid') {
      return {
        label: 'Paid',
        color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        icon: <CheckCircle size={12} className="text-emerald-500" />
      };
    }
    if (status === 'refunded') {
      return {
        label: 'Refunded',
        color: 'bg-purple-50 text-purple-700 border-purple-200',
        icon: <XCircle size={12} className="text-purple-500" />
      };
    }
    if (status === 'failed') {
      return {
        label: 'Failed',
        color: 'bg-red-50 text-red-700 border-red-200',
        icon: <XCircle size={12} className="text-red-500" />
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
        return {
          'S.No': index + 1,
          'Booking Type': booking.bookingBasis === 'plan' ? 'Plan Booking' : 'Hourly Booking',
          'Cabin Name': booking.cabinId?.name || 'Unknown Cabin',
          'Address': booking.cabinId?.address || 'No Address',
          'Owner Name': booking.cabinId?.owner?.name || 'N/A',
          'Customer Name': booking.name || booking.userId?.name || 'Unknown Guest',
          'Mobile': booking.mobile || booking.userId?.mobile || 'N/A',
          'Email': booking.email || booking.userId?.email || 'N/A',
          'Start Date': booking.startDate || 'N/A',
          'Start Time': booking.startTime || 'N/A',
          'End Date': booking.endDate || 'N/A',
          'End Time': booking.endTime || 'N/A',
          'Duration (Hours)': booking.totalHours || 0,
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

  // ======================
  // PROFESSIONAL INVOICE DOWNLOAD
  // ======================
  const downloadInvoice = (booking) => {
    try {
      const cabin = booking.cabinId || {};
      const owner = cabin.owner || {};
      const cabinName = cabin.name || 'Unknown Cabin';
      const cabinAddress = cabin.address || 'N/A';
      const ownerOrganization = owner.organizationName || 'IRYAX Workspace';
      const ownerGst = owner.gstNumber || 'N/A';
      const ownerAddress = owner.address || 'N/A';
      
      const amount = booking.totalPrice || 0;
      const subtotal = booking.subtotal || 0;
      const gstAmount = booking.gstAmount || 0;
      const orderId = booking._id.slice(-8).toUpperCase();
      const startDate = booking.startDate || 'N/A';
      const startTime = booking.startTime || 'N/A';
      const endDate = booking.endDate || 'N/A';
      const endTime = booking.endTime || 'N/A';
      const status = booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1) || 'N/A';
      const paymentStatus = booking.paymentStatus === 'paid' ? 'Paid' : 'Pending';
      const paymentMethod = booking.paymentMethod === 'cash' || booking.paymentMethod === 'counter' ? 'Cash' : 'Online';
      const totalHours = booking.totalHours || 0;
      const customerName = booking.name || booking.userId?.name || 'Customer';
      const customerMobile = booking.mobile || booking.userId?.mobile || 'N/A';
      const customerEmail = booking.email || booking.userId?.email || 'N/A';
      const transactionId = booking.transactionId || 'N/A';
      const termsAccepted = booking.termsAccepted ? 'Yes' : 'No';
      const today = new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });

      const invoiceHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Invoice #${orderId}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: 'Times New Roman', 'Georgia', serif;
              background: #ffffff;
              padding: 40px;
              display: flex;
              justify-content: center;
              min-height: 100vh;
              color: #000000;
            }
            .invoice-container {
              max-width: 800px;
              width: 100%;
              background: #ffffff;
              border: 2px solid #000000;
              padding: 40px 45px;
            }
            .invoice-header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              border-bottom: 3px double #000000;
              padding-bottom: 20px;
              margin-bottom: 25px;
            }
            .brand h1 {
              font-size: 28px;
              font-weight: 700;
              letter-spacing: 2px;
              text-transform: uppercase;
              color: #1a56db;
            }
            .brand .gst {
              font-size: 11px;
              color: #666666;
              margin-top: 2px;
            }
            .brand .address-line {
              font-size: 11px;
              color: #666666;
              margin-top: 2px;
            }
            .invoice-number {
              text-align: right;
            }
            .invoice-number .label {
              font-size: 10px;
              text-transform: uppercase;
              letter-spacing: 1px;
              color: #666666;
            }
            .invoice-number .number {
              font-size: 22px;
              font-weight: 700;
              color: #000000;
              margin-top: 2px;
            }
            .invoice-number .date {
              font-size: 12px;
              color: #333333;
              margin-top: 4px;
            }
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 30px;
              margin-bottom: 25px;
              padding-bottom: 20px;
              border-bottom: 1px solid #cccccc;
            }
            .info-group .title {
              font-size: 10px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 1px;
              color: #666666;
              margin-bottom: 6px;
            }
            .info-group .value {
              font-size: 14px;
              font-weight: 600;
              color: #000000;
              line-height: 1.6;
            }
            .info-group .value-small {
              font-size: 12px;
              font-weight: 400;
              color: #333333;
            }
            .info-group .address-line {
              font-size: 12px;
              color: #333333;
              margin-top: 2px;
            }
            .invoice-table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0 25px;
            }
            .invoice-table thead {
              border-top: 2px solid #000000;
              border-bottom: 2px solid #000000;
            }
            .invoice-table thead th {
              padding: 10px 12px;
              text-align: left;
              font-size: 10px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 1px;
              color: #000000;
            }
            .invoice-table thead th:last-child {
              text-align: right;
            }
            .invoice-table tbody td {
              padding: 10px 12px;
              font-size: 13px;
              color: #000000;
              border-bottom: 1px solid #eeeeee;
            }
            .invoice-table tbody td:last-child {
              text-align: right;
              font-weight: 600;
            }
            .invoice-table tbody tr:last-child td {
              border-bottom: none;
            }
            .totals {
              margin-top: 20px;
              padding-top: 20px;
              border-top: 2px solid #000000;
              display: flex;
              justify-content: flex-end;
            }
            .totals-box {
              width: 320px;
            }
            .totals-row {
              display: flex;
              justify-content: space-between;
              padding: 6px 0;
              font-size: 13px;
              color: #333333;
            }
            .totals-row.total {
              font-size: 20px;
              font-weight: 700;
              color: #000000;
              border-top: 2px solid #000000;
              padding-top: 12px;
              margin-top: 6px;
            }
            .status-row {
              display: flex;
              gap: 30px;
              margin-top: 15px;
              padding-top: 15px;
              border-top: 1px solid #cccccc;
              flex-wrap: wrap;
            }
            .status-row .item {
              font-size: 12px;
            }
            .status-row .item .label {
              color: #666666;
              text-transform: uppercase;
              font-weight: 700;
              font-size: 9px;
              letter-spacing: 0.5px;
            }
            .status-row .item .value {
              font-weight: 600;
              color: #000000;
              margin-top: 2px;
            }
            .footer {
              text-align: center;
              padding-top: 25px;
              margin-top: 25px;
              border-top: 2px solid #000000;
            }
            .footer .powered {
              font-size: 14px;
              font-weight: 700;
              letter-spacing: 2px;
              color: #1a56db;
            }
            .footer .powered span {
              color: #1a56db;
            }
            .footer .sub {
              font-size: 10px;
              color: #666666;
              margin-top: 4px;
            }
            .print-btn {
              position: fixed;
              bottom: 30px;
              right: 30px;
              padding: 14px 28px;
              background: #000000;
              color: #ffffff;
              border: none;
              border-radius: 4px;
              font-weight: 600;
              font-size: 13px;
              cursor: pointer;
              box-shadow: 0 4px 20px rgba(0,0,0,0.15);
              display: flex;
              align-items: center;
              gap: 10px;
              font-family: 'Segoe UI', Arial, sans-serif;
              letter-spacing: 0.5px;
            }
            .print-btn:hover {
              background: #222222;
            }
            @media print {
              body { background: white; padding: 20px; }
              .invoice-container { border: 1px solid #000000; padding: 30px; }
              .print-btn { display: none !important; }
            }
            @media (max-width: 640px) {
              body { padding: 20px; }
              .invoice-container { padding: 25px; }
              .invoice-header { flex-direction: column; text-align: center; gap: 15px; }
              .invoice-number { text-align: center; }
              .info-grid { grid-template-columns: 1fr; gap: 15px; }
              .totals { justify-content: center; }
              .totals-box { width: 100%; }
              .status-row { flex-direction: column; gap: 8px; }
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <div class="invoice-header">
              <div class="brand">
                <h1>${ownerOrganization.toUpperCase()}</h1>
                <div class="gst">GST: ${ownerGst}</div>
                <div class="address-line">${ownerAddress}</div>
              </div>
              <div class="invoice-number">
                <div class="label">Invoice</div>
                <div class="number">#${orderId}</div>
                <div class="date">${today}</div>
              </div>
            </div>

            <div class="info-grid">
              <div>
                <div class="title">Bill To</div>
                <div class="value">${customerName}</div>
                <div class="value-small">${customerMobile}</div>
                <div class="value-small">${customerEmail}</div>
              </div>
              <div>
                <div class="title">Cabin Details</div>
                <div class="value">${cabinName}</div>
                <div class="address-line">${cabinAddress}</div>
                <div class="value-small" style="margin-top:4px;">${totalHours} Hours • ${booking.bookingBasis === 'plan' ? 'Plan Booking' : 'Hourly'}</div>
              </div>
            </div>

            <table class="invoice-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Details</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Cabin Booking</strong></td>
                  <td>
                    ${cabinName}<br>
                    <span style="font-size:11px;color:#666666;">${startDate} · ${startTime} to ${endDate} · ${endTime}</span>
                    ${booking.bookingBasis === 'plan' && booking.selectedPlan ? `<br><span style="font-size:11px;color:#666666;">Plan: ${booking.selectedPlan.label || 'Subscription'}</span>` : ''}
                    ${transactionId !== 'N/A' ? `<br><span style="font-size:10px;color:#888888;font-family:monospace;">TXN: ${transactionId}</span>` : ''}
                    <br><span style="font-size:10px;color:#888888;">Terms Accepted: ${termsAccepted}</span>
                  </td>
                  <td>₹${subtotal.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>

            <div class="status-row">
              <div class="item">
                <div class="label">Payment Method</div>
                <div class="value">${paymentMethod}</div>
              </div>
              <div class="item">
                <div class="label">Payment Status</div>
                <div class="value">${paymentStatus}</div>
              </div>
              <div class="item">
                <div class="label">Booking Status</div>
                <div class="value">${status}</div>
              </div>
              ${transactionId !== 'N/A' ? `
              <div class="item">
                <div class="label">Transaction ID</div>
                <div class="value" style="font-family:monospace;font-size:11px;">${transactionId}</div>
              </div>
              ` : ''}
            </div>

            <div class="totals">
              <div class="totals-box">
                <div class="totals-row">
                  <span>Subtotal</span>
                  <span>₹${subtotal.toFixed(2)}</span>
                </div>
                <div class="totals-row">
                  <span>GST (18%)</span>
                  <span>₹${gstAmount.toFixed(2)}</span>
                </div>
                <div class="totals-row total">
                  <span>Total Amount</span>
                  <span>₹${amount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div class="footer">
              <div class="powered">POWERED BY <span>IRYAX SPACE</span></div>
              <div class="sub">Thank you for choosing ${ownerOrganization}</div>
              <div class="sub" style="margin-top:2px;">This is a system generated invoice</div>
            </div>
          </div>

          <button class="print-btn" onclick="window.print()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Cabin</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Owner</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Period</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Hours</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Payment</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Pmt Status</th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredBookings.map((booking) => {
                      const statusBadge = getStatusBadge(booking.status);
                      const paymentMethodBadge = getPaymentMethodBadge(booking.paymentMethod);
                      const paymentStatusBadge = getPaymentStatusBadge(booking.paymentStatus);
                      const ownerName = booking.cabinId?.owner?.name || "N/A";
                      
                      return (
                      <tr key={booking._id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
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
                        <td className="px-6 py-4">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                              <Building2 size={18} className="text-indigo-600" />
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
                            <p className="font-medium text-slate-800 text-sm">{ownerName}</p>
                            <p className="text-xs text-slate-400">{booking.cabinId?.owner?.mobile || "N/A"}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                              <User size={18} className="text-slate-600" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-900 text-sm">
                                {booking.name || booking.userId?.name || "Unknown Guest"}
                              </p>
                              <p className="text-xs text-slate-400">{booking.mobile || "No Mobile"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <p className="text-sm text-slate-900 font-medium">
                              {booking.startDate} · {booking.startTime}
                            </p>
                            <p className="text-sm text-slate-500">
                              {booking.endDate} · {booking.endTime}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">
                            {booking.totalHours}h
                          </span>
                          {booking.remainingHours > 0 && (
                            <span className="block text-[8px] text-emerald-600 font-bold">
                              {booking.remainingHours}h left
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${statusBadge.color}`}>
                            {statusBadge.icon}
                            {statusBadge.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${paymentMethodBadge.color}`}>
                            {paymentMethodBadge.icon}
                            {paymentMethodBadge.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${paymentStatusBadge.color}`}>
                            {paymentStatusBadge.icon}
                            {paymentStatusBadge.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1 text-indigo-600 font-bold text-lg">
                            <IndianRupee size={18} />
                            {booking.totalPrice?.toLocaleString("en-IN") || "0"}
                          </div>
                          {booking.subtotal && booking.gstAmount && (
                            <p className="text-[8px] text-slate-400">
                              Base: ₹{booking.subtotal} + GST: ₹{booking.gstAmount}
                            </p>
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

                            {(booking.paymentMethod === 'cash' || booking.paymentMethod === 'counter') && booking.paymentStatus === 'pending' && (
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
                const statusBadge = getStatusBadge(booking.status);
                const paymentMethodBadge = getPaymentMethodBadge(booking.paymentMethod);
                const paymentStatusBadge = getPaymentStatusBadge(booking.paymentStatus);
                const ownerName = booking.cabinId?.owner?.name || "N/A";
                
                return (
                  <div key={booking._id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
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
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${statusBadge.color}`}>
                            {statusBadge.icon}
                            {statusBadge.label}
                          </span>
                        </div>
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
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-0.5 text-indigo-600 font-bold text-base">
                          <IndianRupee size={14} />
                          {booking.totalPrice?.toLocaleString("en-IN") || "0"}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 border-t border-slate-100 pt-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                        <Building2 size={18} className="text-indigo-600" />
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
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">To</p>
                          <p className="text-xs font-semibold">{booking.endDate}</p>
                          <p className="text-[11px] text-slate-500">{booking.endTime}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                          <User size={12} className="text-slate-600" />
                        </div>
                        <span className="font-medium text-slate-700 text-xs">{booking.name || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleViewBooking(booking)}
                          className="p-1.5 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                          title="View"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => downloadInvoice(booking)}
                          className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
                          title="Invoice"
                        >
                          <FileDown size={14} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedBooking(booking);
                            setNewStatus(booking.status || 'pending');
                            setShowStatusModal(true);
                          }}
                          className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                          title="Update"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => {
                            setDeleteBooking(booking);
                            setShowDeleteModal(true);
                          }}
                          className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
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
                  <Receipt size={20} color="#fff" />
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
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Cabin</p>
                  <p className="font-semibold text-slate-800 mt-1">{viewBooking.cabinId?.name || 'Unknown'}</p>
                  <p className="text-sm text-slate-600 flex items-center gap-1 mt-0.5">
                    <MapPin size={14} />
                    {viewBooking.cabinId?.address || 'N/A'}
                  </p>
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
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Start</p>
                    <p className="font-semibold text-slate-800 mt-1">{viewBooking.startDate} · {viewBooking.startTime}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">End</p>
                    <p className="font-semibold text-slate-800 mt-1">{viewBooking.endDate} · {viewBooking.endTime}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-indigo-50 rounded-xl p-3 text-center">
                    <p className="text-[8px] font-bold text-indigo-500 uppercase tracking-wider">Total</p>
                    <p className="text-lg font-bold text-indigo-700">{viewBooking.totalHours}h</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 text-center">
                    <p className="text-[8px] font-bold text-slate-500 uppercase tracking-wider">Booking</p>
                    <p className="text-lg font-bold text-slate-700">{viewBooking.bookingBasis === 'plan' ? 'Plan' : 'Hourly'}</p>
                  </div>
                  <div className="bg-emerald-50 rounded-xl p-3 text-center">
                    <p className="text-[8px] font-bold text-emerald-500 uppercase tracking-wider">Amount</p>
                    <p className="text-lg font-bold text-emerald-700">₹{viewBooking.totalPrice}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Subtotal</p>
                    <p className="font-semibold text-slate-800 mt-1">₹{viewBooking.subtotal?.toFixed(2) || '0'}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">GST (18%)</p>
                    <p className="font-semibold text-slate-800 mt-1">₹{viewBooking.gstAmount?.toFixed(2) || '0'}</p>
                  </div>
                </div>

                {/* Terms Accepted Display */}
                <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                  <p className="text-xs font-medium text-green-600 uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle size={14} />
                    Terms & Conditions
                  </p>
                  <p className="font-semibold text-green-700 mt-1">
                    {viewBooking.termsAccepted ? '✅ Accepted' : '❌ Not Accepted'}
                  </p>
                </div>

                {/* Visiting Timings Display */}
                {viewBooking.visitingTimings && viewBooking.visitingTimings.length > 0 && (
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-medium text-blue-600 uppercase tracking-wider flex items-center gap-1">
                        <Clock size={14} />
                        Visit Log ({viewBooking.visitingTimings.length} entries)
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      {viewBooking.visitingTimings.map((timing, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm bg-white rounded-lg p-2 border border-blue-100">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-blue-600">Day {idx + 1}</span>
                            <span className="text-slate-600">{formatDate(timing.date)}</span>
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

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Status</p>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border mt-1 ${getStatusBadge(viewBooking.status).color}`}>
                      {getStatusBadge(viewBooking.status).icon}
                      {getStatusBadge(viewBooking.status).label}
                    </span>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Amount</p>
                    <p className="text-xl font-bold text-indigo-600 mt-1">
                      ₹{viewBooking.totalPrice?.toLocaleString('en-IN') || 0}
                    </p>
                  </div>
                </div>

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

      {/* Payment Status Update Modal */}
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