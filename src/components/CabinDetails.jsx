import axios from "axios";
import {
  Armchair,
  ArrowLeft,
  Bath,
  Car,
  Clock,
  Lock,
  MapPin,
  Shield,
  ShieldCheck,
  Users,
  Wifi,
  Building2 as BuildingIcon,
  ChevronLeft,
  ChevronRight,
  Crown,
  Calendar,
  Sun,
  Moon,
  Clock as ClockIcon,
  Video,
  Play,
  X,
  Eye,
  Star
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Dashboard.css";

const API_URL = "https://spaceapi.iryax.com";
const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000";

export default function CabinDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [cabin, setCabin] = useState(null);
  const [relatedCabins, setRelatedCabins] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [filteredBookedSlots, setFilteredBookedSlots] = useState([]);
  const [images, setImages] = useState([]);
  const autoSlideRef = useRef(null);

  // Video Popup State
  const [showVideoPopup, setShowVideoPopup] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState('');

  const getImageUrl = (img) => {
    if (!img) return PLACEHOLDER_IMAGE;
    if (img.startsWith("http")) return img;
    const cleanPath = img.replace(/\\/g, "/").replace(/^\/+/, "");
    return `${API_URL}/${cleanPath}`;
  };

  const getMediaUrl = (media) => {
    if (!media) return null;
    if (media.startsWith("http")) return media;
    const cleanPath = media.replace(/\\/g, "/").replace(/^\/+/, "");
    return `${API_URL}/${cleanPath}`;
  };

  const openVideoPopup = (videoUrl) => {
    setSelectedVideo(videoUrl);
    setShowVideoPopup(true);
  };

  const closeVideoPopup = () => {
    setShowVideoPopup(false);
    setSelectedVideo('');
  };

  // Auto-slide effect
  useEffect(() => {
    if (images.length <= 1) return;

    autoSlideRef.current = setInterval(() => {
      setActiveImage((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => {
      if (autoSlideRef.current) clearInterval(autoSlideRef.current);
    };
  }, [images.length]);

  const handleImageChange = (index) => {
    setActiveImage(index);
    if (autoSlideRef.current) {
      clearInterval(autoSlideRef.current);
      autoSlideRef.current = setInterval(() => {
        setActiveImage((prev) => (prev + 1) % images.length);
      }, 4000);
    }
  };

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Filter bookings to show only today and future
  const filterBookings = (bookings) => {
    const today = getTodayDate();
    return bookings.filter(booking => {
      // Check if booking has startDate
      if (!booking.startDate) return false;
      // Compare startDate with today
      return booking.startDate >= today;
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      setLoading(true);
      try {
        const cabinRes = await axios.get(`${API_URL}/api/cabins/${id}`);
        setCabin(cabinRes.data);
        
        if (cabinRes.data.images && cabinRes.data.images.length > 0) {
          setImages(cabinRes.data.images.map(img => getImageUrl(img)));
        } else {
          setImages([PLACEHOLDER_IMAGE]);
        }

        try {
          const allRes = await axios.get(`${API_URL}/api/cabins`);
          setRelatedCabins(
            allRes.data.filter((c) => c._id !== id && c.isChamber === true).slice(0, 3)
          );
        } catch (err) {
          console.error("Error fetching related cabins:", err);
          setRelatedCabins([]);
        }

        try {
          const slotsRes = await axios.get(`${API_URL}/api/bookings/cabin/${id}`);
          const allBookings = slotsRes.data.bookedSlots || [];
          setBookedSlots(allBookings);
          // Filter bookings to show only today and future
          const filtered = filterBookings(allBookings);
          setFilteredBookedSlots(filtered);
        } catch (err) {
          console.error("Error fetching booked slots:", err);
          setBookedSlots([]);
          setFilteredBookedSlots([]);
        }

      } catch (err) {
        console.error("Error fetching cabin:", err);
        setCabin(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  };

  const formatTime = (t) => {
    if (!t) return "";
    const [h, m] = t.split(":");
    const hour = parseInt(h);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${displayHour}:${m} ${ampm}`;
  };

  const formatTimeDisplay = (time) => {
    if (!time) return 'N/A';
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm}`;
  };

  const nextImage = () => {
    if (images.length <= 1) return;
    handleImageChange((activeImage + 1) % images.length);
  };

  const prevImage = () => {
    if (images.length <= 1) return;
    handleImageChange((activeImage - 1 + images.length) % images.length);
  };

  // Check if a date is today
  const isToday = (dateStr) => {
    return dateStr === getTodayDate();
  };

  // Check if a date is future
  const isFuture = (dateStr) => {
    return dateStr > getTodayDate();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin" />
          <p className="text-sm text-gray-500">Loading cabin details...</p>
        </div>
      </div>
    );
  }

  if (!cabin) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center">
          <BuildingIcon size={48} className="text-slate-300 mx-auto mb-4" />
          <p className="text-lg font-bold text-slate-700">Cabin not found</p>
          <p className="text-sm text-slate-400 mt-1">The cabin you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const amenityMap = {
    wifi: { label: "High Speed Wi-Fi", icon: Wifi },
    parking: { label: "Parking", icon: Car },
    lockers: { label: "Secure Lockers", icon: Lock },
    privateWashroom: { label: "Private Washroom", icon: Bath },
    secureAccess: { label: "Secure Access", icon: Shield },
    comfortSeating: { label: "Comfort Seating", icon: Armchair },
    coffee: { label: "Coffee & Tea", icon: Star },
    gym: { label: "Gym Access", icon: Star },
    ac: { label: "Air Conditioning", icon: Star },
    tv: { label: "Smart TV", icon: Star },
    printer: { label: "Printer Access", icon: Star },
    phone: { label: "Conference Phone", icon: Star },
  };

  const activeAmenities = Object.keys(cabin.amenities || {}).filter(
    (key) => cabin.amenities[key]
  );

  // Get button text based on isChamber
  const getBookButtonText = () => {
    return cabin.isChamber ? "Book Cabin" : "Book Space";
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="p-2 sm:p-4 lg:p-6">
        {/* Header matching attendance list style */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft size={18} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                {cabin.isChamber ? 'Chamber' : 'Space'} Details
              </h1>
              <p className="text-xs text-gray-500">View and book this workspace</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full">
            <BuildingIcon size={14} className="text-blue-600" />
            <span className="text-xs font-semibold text-blue-700">{cabin.isChamber ? 'Chamber' : 'Workspace'}</span>
          </div>
        </div>

        {/* Main Section */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 p-6">

          {/* Left - Images with Slider */}
          <div className="flex flex-col gap-4">
            {/* Main Image Slider */}
            <div className="relative overflow-hidden rounded-xl h-[300px] sm:h-[340px] lg:h-[420px] shadow-sm group">
              <img
                src={images[activeImage] || PLACEHOLDER_IMAGE}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                alt={cabin.name}
                onError={(e) => {
                  e.target.src = PLACEHOLDER_IMAGE;
                }}
              />
              
              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                <span className="bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-semibold text-blue-700 shadow-sm border border-blue-100">
                  {cabin.isChamber ? 'Chamber' : 'Workspace'}
                </span>
                {cabin.cabinType === 'exclusive' && (
                  <span className="bg-amber-500/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-semibold text-white shadow-sm flex items-center gap-1">
                    <Crown size={10} /> Premium
                  </span>
                )}
              </div>
              {cabin.seats && cabin.seats.length > 0 && (
                <div className="absolute top-3 right-3 bg-blue-600/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-semibold text-white shadow-sm flex items-center gap-1.5 z-10">
                  <Armchair size={10} />
                  {cabin.seats.length} Seats
                </div>
              )}

              {/* Image Counter */}
              {images.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-white z-10">
                  {activeImage + 1} / {images.length}
                </div>
              )}

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70 transition-all z-10 opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70 transition-all z-10 opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight size={16} />
                  </button>

                  {/* Dots */}
                  <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => handleImageChange(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === activeImage 
                            ? 'bg-white w-5' 
                            : 'bg-white/40 hover:bg-white/60'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    onClick={() => handleImageChange(index)}
                    className={`w-20 h-16 object-cover rounded-lg cursor-pointer flex-shrink-0 transition-all
                      ${activeImage === index
                        ? "ring-2 ring-indigo-600 opacity-100"
                        : "opacity-60 hover:opacity-100"
                      }`}
                    alt=""
                    onError={(e) => {
                      e.target.src = PLACEHOLDER_IMAGE;
                    }}
                  />
                ))}
              </div>
            )}

            {/* Videos Section */}
            {cabin.videos && cabin.videos.length > 0 && (
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Video size={14} /> Videos ({cabin.videos.length})
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {cabin.videos.map((video, idx) => (
                    <div 
                      key={idx} 
                      className="relative bg-black/5 rounded-lg border border-gray-200 overflow-hidden cursor-pointer group"
                      onClick={() => openVideoPopup(getMediaUrl(video))}
                    >
                      <video 
                        src={getMediaUrl(video)} 
                        className="w-full h-28 object-cover"
                        poster={cabin.images?.[0] ? getImageUrl(cabin.images[0]) : undefined}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full p-2">
                          <Play size={20} className="text-indigo-600" />
                        </div>
                      </div>
                      <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[8px] px-2 py-0.5 rounded-full">
                        Video {idx + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Details */}
          <div className="flex flex-col justify-center space-y-5">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight mb-2">
                {cabin.name}
              </h1>
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <MapPin size={14} className="text-gray-400" />
                {cabin.address}
              </div>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed">
              {cabin.description || "Experience a premium workspace designed for maximum productivity and comfort, featuring modern architecture and essential business amenities."}
            </p>

            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl font-bold text-gray-900">₹{cabin.price}</span>
              <span className="text-xs text-gray-400 font-semibold mt-1">/ Hour</span>
            </div>

            {/* Operating Hours */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2 mb-2">
                <ClockIcon size={14} className="text-blue-600" />
                Operating Hours
              </h3>
              {cabin.is24x7 ? (
                <div className="flex items-center gap-2 text-green-600 font-semibold">
                  <ClockIcon size={16} className="text-green-500" />
                  24×7 Open
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <Sun size={14} className="text-amber-500" />
                    <span className="text-sm font-semibold text-gray-700">
                      {formatTimeDisplay(cabin.openTime || '09:00')}
                    </span>
                  </div>
                  <span className="text-gray-400">—</span>
                  <div className="flex items-center gap-1.5">
                    <Moon size={14} className="text-blue-500" />
                    <span className="text-sm font-semibold text-gray-700">
                      {formatTimeDisplay(cabin.closeTime || '21:00')}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Seats Display */}
            {cabin.seats && cabin.seats.length > 0 && (
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                    <Armchair size={14} className="text-blue-600" />
                    Available Seats ({cabin.seats.length})
                  </h3>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                  {cabin.seats.map((seat) => (
                    <div
                      key={seat._id}
                      className="p-2 rounded-lg border border-gray-200 text-center bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <Armchair 
                        size={14} 
                        className="mx-auto mb-1 text-gray-400"
                      />
                      <div className="text-[10px] font-semibold text-gray-700 truncate">
                        {seat.name}
                      </div>
                      <div className="text-[8px] text-gray-400 font-medium">
                        #{seat.number}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Amenities */}
            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
                Amenities
              </h3>

              <div className="grid grid-cols-2 gap-2">
                {activeAmenities.map((key) => {
                  const Icon = amenityMap[key]?.icon;
                  return (
                    <div
                      key={key}
                      className="flex items-center gap-2 p-2.5 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors"
                    >
                      <div className="p-1.5 bg-white rounded-lg border border-gray-200">
                        {Icon && <Icon size={12} className="text-gray-600" />}
                      </div>
                      <span className="text-[11px] font-semibold text-gray-700">
                        {amenityMap[key]?.label || key}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pricing Plans */}
            {cabin.pricingPlans && cabin.pricingPlans.length > 0 && (
              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
                  Pricing Plans
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {cabin.pricingPlans.map((plan, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <div className="text-[10px] uppercase tracking-wider text-blue-700 font-semibold mb-1">
                        {plan.label || "Package"}
                      </div>
                      <div className="font-bold text-gray-900 text-sm">
                        ₹{plan.cost.toLocaleString("en-IN")} <span className="text-[10px] text-gray-400 font-normal">/ {plan.validity} Days</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {plan.hours} Hours included
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Info & Book */}
            <div className="pt-4 border-t border-gray-100 flex flex-col gap-4">
              <div className="flex gap-4 sm:gap-6 text-[11px] font-semibold text-gray-500 uppercase tracking-wider flex-wrap">
                <div className="flex items-center gap-1.5">
                  <Users size={12} className="text-blue-600" /> {cabin.capacity} Seats
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={12} className="text-blue-600" /> Secured
                </div>
                {cabin.seats && (
                  <div className="flex items-center gap-1.5">
                    <Armchair size={12} className="text-blue-600" /> {cabin.seats.length} Available
                  </div>
                )}
                {cabin.isChamber && (
                  <div className="flex items-center gap-1.5">
                    <BuildingIcon size={12} className="text-rose-500" /> Chamber
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => navigate(`/book/${cabin._id}`)}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-semibold text-sm uppercase tracking-wider hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  {getBookButtonText()}
                </button>
                <button
                  onClick={() => navigate(`/site-visit/${cabin._id}`)}
                  className="flex-1 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold text-sm uppercase tracking-wider hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  Site Visit
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Booked Slots Section */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 mt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center border border-red-200">
                <Clock size={18} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Booked Slots</h3>
                <p className="text-xs text-gray-500">
                  {filteredBookedSlots.length > 0 
                    ? "Unavailable time slots" 
                    : "No upcoming bookings"}
                </p>
              </div>
            </div>
            {filteredBookedSlots.length > 0 && (
              <div className="bg-red-100 text-red-700 text-xs font-semibold px-3 py-1 rounded-full border border-red-200">
                {filteredBookedSlots.length} Booking{filteredBookedSlots.length > 1 ? "s" : ""}
              </div>
            )}
          </div>

          {filteredBookedSlots.length === 0 ? (
            <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <ShieldCheck size={20} className="text-green-600" />
              <div>
                <p className="text-sm font-semibold text-green-700">All Clear — Fully Available!</p>
                <p className="text-xs text-green-600">No upcoming bookings. Go ahead and book your slot.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredBookedSlots.map((slot, idx) => (
                <div 
                  key={idx} 
                  className={`flex items-center gap-3 p-3 rounded-lg flex-wrap ${
                    isToday(slot.startDate) 
                      ? 'bg-amber-50 border border-amber-200' 
                      : 'bg-red-50 border border-red-200'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${
                    isToday(slot.startDate) 
                      ? 'bg-amber-500' 
                      : 'bg-red-500'
                  }`} />
                  <div className="min-w-[100px]">
                    <div className="text-[10px] font-semibold uppercase tracking-wider flex items-center gap-2">
                      <span className={isToday(slot.startDate) ? 'text-amber-600' : 'text-red-500'}>
                        {isToday(slot.startDate) ? 'TODAY' : 'DATE'}
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-gray-800">{formatDate(slot.startDate)}</div>
                  </div>
                  <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-gray-200">
                    <Clock size={12} className="text-gray-500" />
                    <span className="text-sm font-semibold text-gray-700">{formatTime(slot.startTime)}</span>
                    <span className="text-gray-400">→</span>
                    <span className="text-sm font-semibold text-gray-700">{formatTime(slot.endTime)}</span>
                  </div>
                  {(slot.name || slot.email) && (
                    <div className="ml-auto text-right">
                      <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Booked By</div>
                      {slot.name && <div className="text-sm font-semibold text-gray-800">{slot.name}</div>}
                      {slot.email && <div className="text-xs text-gray-500">{slot.email}</div>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Related */}
        {relatedCabins.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Related Spaces
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedCabins.map((rc) => (
                <div
                  key={rc._id}
                  onClick={() => navigate(`/cabin/${rc._id}`)}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition-all duration-300 group overflow-hidden"
                >
                  <div className="h-44 overflow-hidden relative">
                    <img
                      src={getImageUrl(rc.images?.[0])}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      alt=""
                      onError={(e) => {
                        e.target.src = PLACEHOLDER_IMAGE;
                      }}
                    />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] font-semibold text-blue-700 shadow-sm border border-blue-100">
                      {rc.isChamber ? 'Chamber' : 'Workspace'}
                    </div>
                    {rc.seats && rc.seats.length > 0 && (
                      <div className="absolute top-3 right-3 bg-blue-600/95 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] font-semibold text-white shadow-sm flex items-center gap-1">
                        <Armchair size={10} />
                        {rc.seats.length}
                      </div>
                    )}
                  </div>
                  <div className="p-4 space-y-2">
                    <h4 className="font-semibold text-gray-900 text-sm truncate">
                      {rc.name}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {rc.address?.split(",")[0]}
                    </p>
                    <p className="font-semibold text-gray-900 pt-2 text-sm">
                      ₹{rc.price} <span className="text-xs text-gray-400">/ hr</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trust */}
        <div className="mt-8 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider flex justify-center items-center gap-2">
          <ShieldCheck size={14} />
          Verified professional workspace
        </div>
      </main>

      {/* Video Fullscreen Popup */}
      {showVideoPopup && (
        <div 
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/90 backdrop-blur-md"
          onClick={closeVideoPopup}
        >
          <div 
            className="relative max-w-[90vw] max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeVideoPopup}
              className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors p-2 z-10"
            >
              <X size={32} />
            </button>
            <video 
              src={selectedVideo} 
              controls 
              autoPlay
              className="w-full max-h-[85vh] rounded-lg shadow-2xl"
              poster={cabin.images?.[0] ? getImageUrl(cabin.images[0]) : undefined}
            />
            <button
              onClick={closeVideoPopup}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 hover:text-white transition-colors text-sm bg-black/50 px-6 py-2 rounded-full backdrop-blur-sm"
            >
              Click anywhere to close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}