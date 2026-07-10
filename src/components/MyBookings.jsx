// MyBookings.jsx - Complete with separate Payment Method column
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
  Download,
  Edit,
  RefreshCw,
  Eye,
  FileDown,
  LogIn,
  LogOut,
  Printer,
  UserCheck,
  UserX,
  Loader,
  Timer,
  CreditCard,
  Store,
  Wallet
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import UsersNavbar from "./UsersNavbar";
import AdminNavbar from "./AdminNavbar";
import * as XLSX from 'xlsx';
import "./Dashboard.css";

const API_URL = "http://localhost:5000";
const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const isAdmin = localStorage.getItem("admin") !== null;
  const navigate = useNavigate();
  
  const [countdowns, setCountdowns] = useState({});
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewBooking, setViewBooking] = useState(null);
  const [showCheckModal, setShowCheckModal] = useState(false);
  const [checkBooking, setCheckBooking] = useState(null);
  const [checkType, setCheckType] = useState('');
  const [checking, setChecking] = useState(false);
  const [locationStatus, setLocationStatus] = useState('');

  const currentUser = (() => {
    try {
      const u = localStorage.getItem("user");
      const a = localStorage.getItem("admin");
      if (u) return JSON.parse(u);
      if (a) return JSON.parse(a);
      return null;
    } catch (err) {
      return null;
    }
  })();

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

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

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdowns(prev => {
        const updated = { ...prev };
        let hasChanges = false;
        Object.keys(updated).forEach(key => {
          if (updated[key] > 0) {
            updated[key] = updated[key] - 1;
            hasChanges = true;
          }
        });
        return hasChanges ? updated : prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const newCountdowns = {};
    bookings.forEach(booking => {
      if (booking.isCheckedIn && booking.status === 'active' && booking.remainingHours > 0) {
        if (booking.checkedInAt) {
          const checkInTime = new Date(booking.checkedInAt);
          const currentTime = new Date();
          const elapsedSeconds = Math.floor((currentTime - checkInTime) / 1000);
          const totalSeconds = booking.remainingHours * 60 * 60;
          const remainingSeconds = Math.max(0, totalSeconds - elapsedSeconds);
          newCountdowns[booking._id] = remainingSeconds;
        } else {
          newCountdowns[booking._id] = booking.remainingHours * 60 * 60;
        }
      }
    });
    setCountdowns(newCountdowns);
  }, [bookings]);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const isAdmin = localStorage.getItem("admin") !== null;
      const endpoint = isAdmin ? `${API_URL}/api/bookings` : `${API_URL}/api/bookings/user`;

      const res = await axios.get(
        endpoint,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      let bookingsData = res.data.bookings || [];

      if (isAdmin && currentUser?.email) {
        bookingsData = bookingsData.filter(booking =>
          booking.email === currentUser.email ||
          booking.name === currentUser.name
        );
      }

      setBookings(bookingsData);
    } catch (error) {
      console.error("API ERROR:", error);
      toast.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  const formatCountdown = (seconds) => {
    if (!seconds || seconds <= 0) return '00:00:00';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getCountdownColor = (seconds) => {
    if (!seconds || seconds <= 0) return 'text-red-600';
    if (seconds < 3600) return 'text-orange-500';
    if (seconds < 7200) return 'text-yellow-500';
    return 'text-emerald-600';
  };

  useEffect(() => {
    fetchBookings();
  }, []);

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
          'Customer Name': booking.name || 'Unknown Guest',
          'Mobile': booking.mobile || 'N/A',
          'Email': booking.email || 'N/A',
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
          'Amount (₹)': isVisit ? 'Free' : (booking.totalPrice || 0)
        };
      });

      const ws = XLSX.utils.json_to_sheet(exportData);
      ws['!cols'] = [
        { wch: 6 }, { wch: 18 }, { wch: 25 }, { wch: 30 },
        { wch: 20 }, { wch: 15 }, { wch: 25 }, { wch: 15 },
        { wch: 12 }, { wch: 15 }, { wch: 12 }, { wch: 15 },
        { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 },
        { wch: 15 }, { wch: 15 }
      ];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Bookings');
      
      const date = new Date().toISOString().split('T')[0];
      XLSX.writeFile(wb, `bookings_${date}.xlsx`);
      
      toast.success(`Exported ${filteredBookings.length} bookings to Excel!`);
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export bookings");
    }
  };

  const handleViewBooking = (booking) => {
    setViewBooking(booking);
    setShowViewModal(true);
  };

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
      const totalHours = booking.totalHours || 0;
      const hoursUsed = booking.hoursUsed || 0;
      const remainingHours = booking.remainingHours || 0;

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
              ${booking.transactionId ? `
              <div class="invoice-row">
                <span class="invoice-label">Transaction ID</span>
                <span class="invoice-value" style="font-family:monospace;font-size:12px;">${booking.transactionId}</span>
              </div>
              ` : ''}
              <div class="invoice-row">
                <span class="invoice-label">Customer</span>
                <span class="invoice-value">${booking.name || 'N/A'}</span>
              </div>
              <div class="invoice-row">
                <span class="invoice-label">Mobile</span>
                <span class="invoice-value">${booking.mobile || 'N/A'}</span>
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

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          reject(new Error('Unable to fetch location: ' + error.message));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  };

  const openCheckModal = (booking, type) => {
    setCheckBooking(booking);
    setCheckType(type);
    setLocationStatus('');
    setShowCheckModal(true);
    
    if (navigator.geolocation) {
      setLocationStatus('fetching');
      getCurrentLocation()
        .then((location) => {
          setLocationStatus('fetched');
          setCheckBooking(prev => ({
            ...prev,
            _location: location
          }));
          toast.success('Location captured successfully');
        })
        .catch((err) => {
          console.error('Location error:', err);
          setLocationStatus('error');
          toast.warning('Could not fetch location. You can proceed without location.');
        });
    } else {
      setLocationStatus('error');
      toast.warning('Geolocation not supported. Proceeding without location.');
    }
  };

  const handleConfirmCheck = async () => {
    if (!checkBooking) return;
    
    setChecking(true);
    try {
      const token = localStorage.getItem("token");
      
      let locationData = { lat: null, lng: null };
      if (checkBooking._location) {
        locationData = checkBooking._location;
      }

      const endpoint = checkType === 'in' 
        ? `${API_URL}/api/bookings/check-in/${checkBooking._id}`
        : `${API_URL}/api/bookings/check-out/${checkBooking._id}`;

      const res = await axios.post(
        endpoint,
        locationData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (res.data.success) {
        toast.success(checkType === 'in' ? 'Checked in successfully!' : 'Checked out successfully!');
        if (res.data.location && res.data.location.address) {
          toast.info(`📍 ${res.data.location.address}`);
        }
        setShowCheckModal(false);
        setCheckBooking(null);
        setCheckType('');
        setLocationStatus('');
        fetchBookings();
      }
    } catch (error) {
      console.error('Check error:', error);
      toast.error(error.response?.data?.error || 'Failed to process check');
    } finally {
      setChecking(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch = b.cabinId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          b.cabinId?.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.mobile?.includes(searchTerm);
    const matchesDate = filterDate ? b.startDate === filterDate : true;
    return matchesSearch && matchesDate;
  });

  if (loading)
    return (
      <div className="admin-dash">
        {isAdmin ? <AdminNavbar /> : <UsersNavbar />}
        <div className="admin-dash__loading">
          <div className="admin-dash__spinner" />
          <p className="admin-dash__loading-text">Loading bookings...</p>
        </div>
      </div>
    );

  return (
    <div className="admin-dash">
      {isAdmin ? <AdminNavbar /> : <UsersNavbar />}

      <main className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="admin-dash__header">
          <div>
            <h1 className="admin-dash__greeting">
              {localStorage.getItem('admin') ? 'Admin' : 'My'} <span>Bookings</span>
            </h1>
            <p className="admin-dash__subtitle">
              Manage your workspace reservations and bookings.
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
            
            {(searchTerm || filterDate) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterDate("");
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

        {filteredBookings.length === 0 ? (
          <div className="admin-dash__error" style={{ background: '#f8fafc', borderColor: '#e2e8f0' }}>
            <CalendarIcon size={48} className="text-slate-300 mb-4" />
            <p className="admin-dash__error-title" style={{ color: '#475569' }}>No bookings found</p>
            <p className="admin-dash__error-message">We couldn't find any bookings matching your search criteria.</p>
            {(searchTerm || filterDate) && (
              <button
                onClick={() => { setSearchTerm(""); setFilterDate(""); }}
                className="mt-4 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Reset Filters
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
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Booking Period</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Hours</th>
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
                      const statusBadge = getStatusBadge(booking.status);
                      const paymentMethodBadge = getPaymentMethodBadge(booking.paymentMethod);
                      const paymentStatusBadge = getPaymentStatusBadge(booking.paymentStatus);
                      const isCheckedIn = booking.isCheckedIn || false;
                      const countdown = countdowns[booking._id] || 0;
                      
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
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                              <User size={18} className="text-slate-600" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-900 text-sm">
                                {booking.name || currentUser?.name || "Unknown Guest"}
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
                              {booking.mobile || "No Mobile"}
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
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {isVisit ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">Visit</span>
                          ) : (
                            <div className="space-y-0.5">
                              <span className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">
                                {booking.totalHours}h
                              </span>
                              {booking.isCheckedIn && booking.status === 'active' && countdown > 0 && (
                                <span className={`block text-[9px] font-bold font-mono ${getCountdownColor(countdown)}`}>
                                  ⏱ {formatCountdown(countdown)}
                                </span>
                              )}
                              {booking.remainingHours > 0 && !booking.isCheckedIn && (
                                <span className="block text-[8px] text-emerald-600 font-bold">
                                  {booking.remainingHours}h left
                                </span>
                              )}
                              {booking.remainingHours <= 0 && booking.status !== 'completed' && (
                                <span className="block text-[8px] text-red-500 font-bold">
                                  ⚠️ No hours left
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
                          {isCheckedIn && (
                            <span className="ml-1 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[8px] font-bold bg-emerald-100 text-emerald-700">
                              <LogIn size={10} /> In
                            </span>
                          )}
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
                            
                            {!isCheckedIn && (booking.status === 'confirmed' || booking.status === 'active') && booking.remainingHours > 0 && (
                              <button
                                onClick={() => openCheckModal(booking, 'in')}
                                className="p-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                                title="Check In"
                              >
                                <LogIn size={15} />
                              </button>
                            )}
                            
                            {isCheckedIn && booking.status === 'active' && (
                              <button
                                onClick={() => openCheckModal(booking, 'out')}
                                className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                                title="Check Out"
                              >
                                <LogOut size={15} />
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

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {filteredBookings.map((booking) => {
                const isVisit = booking.bookingType === "visit";
                const userName = booking.name || currentUser?.name || "Unknown Guest";
                const statusBadge = getStatusBadge(booking.status);
                const paymentMethodBadge = getPaymentMethodBadge(booking.paymentMethod);
                const paymentStatusBadge = getPaymentStatusBadge(booking.paymentStatus);
                const isCheckedIn = booking.isCheckedIn || false;
                const countdown = countdowns[booking._id] || 0;
                
                return (
                  <div key={booking._id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col gap-1.5">
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
                        {isCheckedIn && (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[8px] font-bold bg-emerald-100 text-emerald-700 w-fit">
                            <LogIn size={10} /> Checked In
                          </span>
                        )}
                        {!isVisit && (
                          <div className="flex items-center gap-2 text-xs">
                            <span className="font-bold text-indigo-600">{booking.totalHours}h</span>
                            {booking.isCheckedIn && booking.status === 'active' && countdown > 0 && (
                              <span className={`font-mono font-bold ${getCountdownColor(countdown)}`}>
                                ⏱ {formatCountdown(countdown)}
                              </span>
                            )}
                            {booking.remainingHours > 0 && !booking.isCheckedIn && (
                              <span className="text-emerald-600 font-medium">{booking.remainingHours}h left</span>
                            )}
                            {booking.remainingHours <= 0 && booking.status !== 'completed' && (
                              <span className="text-red-500 font-medium">⚠️ No hours left</span>
                            )}
                          </div>
                        )}
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

                    <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                          <User size={12} className="text-slate-600" />
                        </div>
                        <span className="font-medium text-slate-700 text-xs">{userName}</span>
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
                        
                        {!isCheckedIn && (booking.status === 'confirmed' || booking.status === 'active') && booking.remainingHours > 0 && (
                          <button
                            onClick={() => openCheckModal(booking, 'in')}
                            className="p-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                            title="Check In"
                          >
                            <LogIn size={14} />
                          </button>
                        )}
                        
                        {isCheckedIn && booking.status === 'active' && (
                          <button
                            onClick={() => openCheckModal(booking, 'out')}
                            className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                            title="Check Out"
                          >
                            <LogOut size={14} />
                          </button>
                        )}
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
                    <p className="font-semibold text-slate-800 mt-1">{viewBooking.name || 'N/A'}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Mobile</p>
                    <p className="font-semibold text-slate-800 mt-1">{viewBooking.mobile || 'N/A'}</p>
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
                  {viewBooking.bookingType !== 'visit' && (
                    <div className="bg-slate-50 rounded-xl p-4">
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">End</p>
                      <p className="font-semibold text-slate-800 mt-1">{viewBooking.endDate} · {viewBooking.endTime}</p>
                    </div>
                  )}
                </div>

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
                      {viewBooking.isCheckedIn && viewBooking.status === 'active' && countdowns[viewBooking._id] > 0 && (
                        <p className={`text-xs font-mono font-bold ${getCountdownColor(countdowns[viewBooking._id])}`}>
                          ⏱ {formatCountdown(countdowns[viewBooking._id])}
                        </p>
                      )}
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

                {viewBooking.transactionId && (
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Transaction ID</p>
                    <p className="font-mono text-sm text-slate-700 mt-1">{viewBooking.transactionId}</p>
                  </div>
                )}

                {(viewBooking.checkedInLat || viewBooking.checkedOutLat) && (
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">📍 Location Details</p>
                    {viewBooking.isCheckedIn && (
                      <div className="mt-2 space-y-1">
                        <p className="text-xs font-semibold text-emerald-600">Check-in Location</p>
                        <p className="text-sm text-slate-700">{viewBooking.checkedInAddress || 'N/A'}</p>
                        {viewBooking.checkedInLat && (
                          <p className="text-xs text-slate-400 font-mono">
                            {viewBooking.checkedInLat}, {viewBooking.checkedInLng}
                          </p>
                        )}
                        <p className="text-xs text-slate-400">
                          {viewBooking.checkedInAt ? formatDate(viewBooking.checkedInAt) + ' at ' + formatTime(viewBooking.checkedInAt) : ''}
                        </p>
                      </div>
                    )}
                    {viewBooking.checkedOutAt && (
                      <div className="mt-3 pt-3 border-t border-slate-200">
                        <p className="text-xs font-semibold text-blue-600">Check-out Location</p>
                        <p className="text-sm text-slate-700">{viewBooking.checkedOutAddress || 'N/A'}</p>
                        {viewBooking.checkedOutLat && (
                          <p className="text-xs text-slate-400 font-mono">
                            {viewBooking.checkedOutLat}, {viewBooking.checkedOutLng}
                          </p>
                        )}
                        <p className="text-xs text-slate-400">
                          {viewBooking.checkedOutAt ? formatDate(viewBooking.checkedOutAt) + ' at ' + formatTime(viewBooking.checkedOutAt) : ''}
                        </p>
                      </div>
                    )}
                  </div>
                )}

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

      {/* Check-in/Check-out Modal */}
      {showCheckModal && checkBooking && (
        <div className="fixed inset-0 z-[1300] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowCheckModal(false);
            setCheckBooking(null);
            setCheckType('');
          }
        }}>
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div style={{
              background: checkType === 'in' 
                ? "linear-gradient(135deg, #059669 0%, #047857 60%, #065f46 100%)"
                : "linear-gradient(135deg, #2563eb 0%, #1d4ed8 60%, #1e40af 100%)",
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
                  {checkType === 'in' ? <LogIn size={20} color="#fff" /> : <LogOut size={20} color="#fff" />}
                </div>
                <div>
                  <h3 style={{ margin: 0, color: "#fff", fontSize: "1rem", fontWeight: 700 }}>
                    {checkType === 'in' ? 'Check In' : 'Check Out'}
                  </h3>
                  <p style={{ margin: 0, color: "rgba(255,255,255,0.8)", fontSize: "0.75rem" }}>
                    {checkBooking.cabinId?.name || "Cabin"}
                  </p>
                  <p style={{ margin: 0, color: "rgba(255,255,255,0.6)", fontSize: "0.65rem" }}>
                    Remaining: {checkBooking.remainingHours || 0}h
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowCheckModal(false);
                  setCheckBooking(null);
                  setCheckType('');
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
                borderRadius: 12,
                padding: "1rem",
                marginBottom: "1.25rem"
              }}>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span style={{ color: "#64748b", fontSize: "0.875rem" }}>Cabin</span>
                    <span style={{ fontWeight: 600, color: "#1e293b" }}>
                      {checkBooking.cabinId?.name || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: "#64748b", fontSize: "0.875rem" }}>Customer</span>
                    <span style={{ fontWeight: 600, color: "#1e293b" }}>
                      {checkBooking.name || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: "#64748b", fontSize: "0.875rem" }}>Date</span>
                    <span style={{ fontWeight: 600, color: "#1e293b" }}>
                      {checkBooking.startDate} · {checkBooking.startTime}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: "#64748b", fontSize: "0.875rem" }}>Remaining Hours</span>
                    <span style={{ fontWeight: 700, color: checkBooking.remainingHours > 0 ? '#059669' : '#dc2626' }}>
                      {checkBooking.remainingHours || 0}h
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: "#64748b", fontSize: "0.875rem" }}>Current Status</span>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusBadge(checkBooking.status).color}`}>
                      {getStatusBadge(checkBooking.status).icon}
                      {getStatusBadge(checkBooking.status).label}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                    <span style={{ color: "#64748b", fontSize: "0.75rem" }}>📍 Location</span>
                    <span style={{ fontSize: "0.75rem", fontWeight: 500 }}>
                      {locationStatus === 'fetching' && (
                        <span className="flex items-center gap-1 text-yellow-600">
                          <Loader size={14} className="animate-spin" />
                          Fetching...
                        </span>
                      )}
                      {locationStatus === 'fetched' && (
                        <span className="text-emerald-600">✅ Captured</span>
                      )}
                      {locationStatus === 'error' && (
                        <span className="text-red-500">⚠️ Not available</span>
                      )}
                      {!locationStatus && (
                        <span className="text-slate-400">Waiting...</span>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{
                background: "#eff6ff",
                borderRadius: 8,
                padding: "0.75rem",
                marginBottom: "1.25rem",
                fontSize: "0.75rem",
                color: "#1e40af",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                border: "1px solid #93c5fd"
              }}>
                <MapPin size={16} className="shrink-0 text-blue-600" />
                <span>
                  {locationStatus === 'fetched' 
                    ? '✅ Location captured successfully for verification.'
                    : locationStatus === 'error'
                      ? '⚠️ Could not fetch location. You can proceed without it.'
                      : '🔄 Fetching your current location...'}
                </span>
              </div>

              <div style={{
                background: checkType === 'in' ? "#f0fdf4" : "#eff6ff",
                borderRadius: 8,
                padding: "0.75rem",
                marginBottom: "1.25rem",
                fontSize: "0.75rem",
                color: checkType === 'in' ? "#065f46" : "#1e40af",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                border: checkType === 'in' ? "1px solid #86efac" : "1px solid #93c5fd"
              }}>
                {checkType === 'in' ? (
                  <UserCheck size={16} className="shrink-0 text-emerald-600" />
                ) : (
                  <UserX size={16} className="shrink-0 text-blue-600" />
                )}
                <span>
                  {checkType === 'in' 
                    ? `Confirm check-in. You have ${checkBooking.remainingHours}h remaining.`
                    : 'Confirm check-out. Hours used will be calculated.'}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={handleConfirmCheck}
                  disabled={checking}
                  style={{
                    width: "100%",
                    padding: "0.875rem",
                    borderRadius: 10,
                    border: "none",
                    background: checking
                      ? "#a5b4fc"
                      : checkType === 'in'
                        ? "linear-gradient(135deg, #059669 0%, #047857 100%)"
                        : "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                    color: "#fff",
                    fontFamily: "inherit",
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    cursor: checking ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    boxShadow: checking ? "none" : checkType === 'in'
                      ? "0 4px 14px rgba(5,150,105,0.35)"
                      : "0 4px 14px rgba(37,99,235,0.35)",
                    transition: "all 160ms",
                  }}
                >
                  {checking ? (
                    <>
                      <span style={{
                        width: 16, height: 16, borderRadius: "50%",
                        border: "2px solid rgba(255,255,255,0.4)",
                        borderTopColor: "#fff",
                        animation: "spin 0.7s linear infinite",
                        display: "inline-block",
                      }} />
                      Processing...
                    </>
                  ) : (
                    <>{checkType === 'in' ? 'Confirm Check In' : 'Confirm Check Out'}</>
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowCheckModal(false);
                    setCheckBooking(null);
                    setCheckType('');
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

export default MyBookings;