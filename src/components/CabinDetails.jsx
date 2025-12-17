

// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Wifi, Car, Lock, UserCheck, AirVent } from "lucide-react"; // icons

// export default function CabinDetails() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [cabin, setCabin] = useState(null);
//   const [activeImage, setActiveImage] = useState(0);

//   const getImageUrl = (img) => {
//     if (!img) return null;
//     if (img.startsWith("http")) return img;
//     return `http://localhost:5000/${img.replace(/\\/g, "/")}`; // fix Windows path
//   };

//   useEffect(() => {
//     const fetchCabin = async () => {
//       try {
//         const response = await axios.get(`http://localhost:5000/api/cabins/${id}`);
//         setCabin(response.data);
//       } catch (error) {
//         console.error("Error fetching cabin:", error);
//       }
//     };
//     fetchCabin();
//   }, [id]);

//   if (!cabin) return <p className="text-center p-10">Loading...</p>;

//   const displayImages = cabin.images || [];

//   // Features with icons
//   const features = [
//     { name: "Parking", available: true, icon: <Car className="w-6 h-6 text-green-600" /> },
//     { name: "Lockers", available: true, icon: <Lock className="w-6 h-6 text-green-600" /> },
//     { name: "Private Washrooms", available: true, icon: <UserCheck className="w-6 h-6 text-green-600" /> },
//     { name: "Wi-Fi", available: true, icon: <Wifi className="w-6 h-6 text-green-600" /> },
//     { name: "Air Conditioning", available: true, icon: <AirVent className="w-6 h-6 text-green-600" /> },
//   ];

//   return (
//     <div className="bg-gray-50 min-h-screen p-6 md:p-10">
//       <button
//         onClick={() => navigate(-1)}
//         className="mb-6 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
//       >
//         ⬅ Back
//       </button>

//       <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
//         {/* Cabin Name */}
//         <h1 className="text-4xl font-bold text-gray-800 mb-4">{cabin.name}</h1>

//         {/* Main Image */}
//         {displayImages.length > 0 && (
//           <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-lg border border-gray-100 mb-4">
//             <img
//               src={getImageUrl(displayImages[activeImage])}
//               alt={cabin.name}
//               className="w-full h-full object-cover"
//             />
//           </div>
//         )}

//         {/* Details */}
//         <div className="space-y-2 mb-6">
//           <p><strong>Description:</strong> {cabin.description}</p>
//           <p><strong>Capacity:</strong> {cabin.capacity}</p>
//           <p><strong>Address:</strong> {cabin.address}</p>
//         </div>

//         {/* Features Section */}
//         <div className="mt-8">
//           <h2 className="text-2xl font-semibold text-gray-800 mb-4">Features</h2>
//           <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
//             {features
//               .filter(f => f.available)
//               .map((feature, index) => (
//                 <div
//                   key={index}
//                   className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition"
//                 >
//                   {feature.icon}
//                   <span className="text-gray-700 font-medium">{feature.name}</span>
//                 </div>
//               ))}
//           </div>
//         </div>

//         {/* Book Now Button */}
//         <button
//           onClick={() => navigate(`/book/${cabin._id}`)}
//           className="mt-8 w-full py-3 bg-green-700 text-white rounded-xl hover:bg-green-800 transition"
//         >
//           Book Now
//         </button>
//       </div>
//     </div>
//   );
// }




// import React, { useEffect, useState } from "react";
// import UsersNavbar from "./UsersNavbar";
// import axios from "axios";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   MapPin,
//   Users,
//   Wifi,
//   Car,
//   Lock,
//   ShieldCheck,
//   Armchair,
//   Bath,
//   ArrowLeft,
// } from "lucide-react";

// export default function CabinDetails() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [cabin, setCabin] = useState(null);
//   const [activeImage, setActiveImage] = useState(0);

//   const getImageUrl = (img) => {
//     if (!img) return "";
//     if (img.startsWith("http")) return img;
//     return `http://localhost:5000/${img.replace(/\\/g, "/")}`;
//   };

//   useEffect(() => {
//     axios
//       .get(`http://localhost:5000/api/cabins/${id}`)
//       .then((res) => setCabin(res.data))
//       .catch((err) => console.error(err));
//   }, [id]);

//   if (!cabin)
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin w-12 h-12 border-t-2 border-b-2 border-emerald-600 rounded-full"></div>
//       </div>
//     );

//   const features = [
//     { name: "Wi-Fi", icon: <Wifi className="w-6 h-6 text-emerald-600" /> },
//     { name: "Parking", icon: <Car className="w-6 h-6 text-emerald-600" /> },
//     { name: "Lockers", icon: <Lock className="w-6 h-6 text-emerald-600" /> },
//     { name: "Private Washrooms", icon: <Bath className="w-6 h-6 text-emerald-600" /> },
//     { name: "Secure Access", icon: <ShieldCheck className="w-6 h-6 text-emerald-600" /> },
//     { name: "Comfort Seating", icon: <Armchair className="w-6 h-6 text-emerald-600" /> },
//   ];

//   return (
//     <div className="min-h-screen bg-slate-50">
//         <UsersNavbar/>
//       {/* BACK BUTTON */}
//       <div className="p-6">
//         <button
//           onClick={() => navigate(-1)}
//           className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 transition"
//         >
//           <ArrowLeft size={20} />
//           Back
//         </button>
//       </div>

//       {/* MAIN CONTENT */}
//       <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-3xl border border-slate-100 overflow-hidden mb-20">

//         {/* HERO IMAGE */}
//         <div className="relative h-[420px] bg-slate-100">
//           <img
//             src={getImageUrl(cabin.images[activeImage])}
//             alt={cabin.name}
//             className="w-full h-full object-cover"
//             onError={(e) =>
//               (e.target.src =
//                 "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&q=80&w=1200")
//             }
//           />

//           {/* BADGE */}
//           <div className="absolute top-6 left-6 bg-emerald-600 text-white px-4 py-1.5 rounded-full shadow-lg text-sm font-semibold">
//             Premium Workspace
//           </div>
//         </div>

//         {/* CONTENT */}
//         <div className="p-10">
//           {/* NAME & ADDRESS */}
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//             <h1 className="text-4xl font-bold text-slate-900">{cabin.name}</h1>

//             <div className="flex items-center gap-2 text-slate-600">
//               <MapPin size={20} className="text-emerald-600" />
//               <span className="font-medium">{cabin.address}</span>
//             </div>
//           </div>

//           {/* OVERVIEW */}
//           <div className="mt-6 flex flex-wrap items-center gap-6">
//             <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
//               <Users size={18} className="text-emerald-600" />
//               <span className="text-slate-700 font-medium">
//                 {cabin.capacity} Seats
//               </span>
//             </div>

//             <div className="flex items-baseline gap-1">
//               <span className="text-3xl font-bold text-slate-900">
//                 ₹{cabin.price || 5000}
//               </span>
//               <span className="text-slate-500 text-sm">/month</span>
//             </div>
//           </div>

//           {/* DESCRIPTION */}
//           <p className="mt-6 text-slate-600 text-lg leading-relaxed">
//             {cabin.description}
//           </p>

//           {/* THUMBNAIL IMAGES */}
//           <div className="flex gap-4 mt-8 overflow-x-auto pb-2">
//             {cabin.images.map((img, index) => (
//               <img
//                 key={index}
//                 src={getImageUrl(img)}
//                 alt=""
//                 onClick={() => setActiveImage(index)}
//                 className={`w-32 h-24 object-cover rounded-xl cursor-pointer border transition 
//                 ${
//                   activeImage === index
//                     ? "border-emerald-600 shadow-md"
//                     : "border-slate-200 opacity-80 hover:opacity-100"
//                 }`}
//               />
//             ))}
//           </div>

//           {/* FEATURES SECTION */}
//           <div className="mt-12">
//             <h2 className="text-2xl font-bold text-slate-900 mb-5">
//               Workspace Features
//             </h2>

//             <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
//               {features.map((f, i) => (
//                 <div
//                   key={i}
//                   className="flex items-center gap-3 p-5 bg-slate-50 rounded-2xl border border-slate-200 hover:shadow-lg hover:border-emerald-500 transition-all"
//                 >
//                   {f.icon}
//                   <span className="font-medium text-slate-700">{f.name}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* BOOK BUTTON */}
//           <div className="mt-12">
//             <button
//               onClick={() => navigate(`/book/${cabin._id}`)}
//               className="w-full bg-emerald-600 text-white text-lg py-4 rounded-2xl hover:bg-emerald-700 shadow-lg transition-all"
//             >
//               Book Cabin
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import axios from "axios";
import {
  Armchair,
  ArrowLeft,
  Bath,
  Car,
  Lock,
  MapPin,
  ShieldCheck,
  Users,
  Wifi,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UsersNavbar from "./UsersNavbar";

export default function CabinDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [cabin, setCabin] = useState(null);
  const [activeImage, setActiveImage] = useState(0);

  const getImageUrl = (img) => {
    if (!img) return "";
    if (img.startsWith("http")) return img;
    return `http://localhost:5000/${img.replace(/\\/g, "/")}`;
  };

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/cabins/${id}`)
      .then((res) => setCabin(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!cabin) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin w-12 h-12 border-t-2 border-b-2 border-emerald-600 rounded-full"></div>
      </div>
    );
  }

  // 🔥 AMENITIES MAP (DB key → UI)
  const amenityMap = {
    wifi: {
      label: "Wi-Fi",
      icon: <Wifi className="w-6 h-6 text-emerald-600" />,
    },
    parking: {
      label: "Parking",
      icon: <Car className="w-6 h-6 text-emerald-600" />,
    },
    lockers: {
      label: "Lockers",
      icon: <Lock className="w-6 h-6 text-emerald-600" />,
    },
    privateWashroom: {
      label: "Private Washroom",
      icon: <Bath className="w-6 h-6 text-emerald-600" />,
    },
    secureAccess: {
      label: "Secure Access",
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
    },
    comfortSeating: {
      label: "Comfort Seating",
      icon: <Armchair className="w-6 h-6 text-emerald-600" />,
    },
  };

  // ✅ Only true amenities
  const activeAmenities = Object.keys(cabin.amenities || {}).filter(
    (key) => cabin.amenities[key]
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <UsersNavbar />

      {/* BACK BUTTON */}
      <div className="p-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 transition"
        >
          <ArrowLeft size={20} />
          Back
        </button>
      </div>

      {/* MAIN CARD */}
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-3xl border border-slate-100 overflow-hidden mb-20">
        {/* HERO IMAGE */}
        <div className="relative h-[420px] bg-slate-100">
          <img
            src={getImageUrl(cabin.images?.[activeImage])}
            alt={cabin.name}
            className="w-full h-full object-cover"
            onError={(e) =>
              (e.target.src =
                "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&q=80&w=1200")
            }
          />
          <div className="absolute top-6 left-6 bg-emerald-600 text-white px-4 py-1.5 rounded-full shadow-lg text-sm font-semibold">
            Premium Workspace
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-10">
          {/* NAME & ADDRESS */}
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <h1 className="text-4xl font-bold text-slate-900">{cabin.name}</h1>
            <div className="flex items-center gap-2 text-slate-600">
              <MapPin size={20} className="text-emerald-600" />
              <span>{cabin.address}</span>
            </div>
          </div>

          {/* OVERVIEW */}
          <div className="mt-6 flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-lg border">
              <Users size={18} className="text-emerald-600" />
              <span>{cabin.capacity} Seats</span>
            </div>

            <div className="text-3xl font-bold text-slate-900">
              ₹{cabin.price || 5000}
              <span className="text-sm text-slate-500"> / month</span>
            </div>
          </div>

          {/* DESCRIPTION */}
          <p className="mt-6 text-slate-600 text-lg">{cabin.description}</p>

          {/* THUMBNAILS */}
          {cabin.images?.length > 0 && (
            <div className="flex gap-4 mt-8 overflow-x-auto">
              {cabin.images.map((img, index) => (
                <img
                  key={index}
                  src={getImageUrl(img)}
                  onClick={() => setActiveImage(index)}
                  className={`w-32 h-24 rounded-xl object-cover cursor-pointer border ${
                    activeImage === index
                      ? "border-emerald-600"
                      : "border-slate-200"
                  }`}
                  alt=""
                />
              ))}
            </div>
          )}

          {/* AMENITIES */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-5">Workspace Features</h2>

            {activeAmenities.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {activeAmenities.map((key) => (
                  <div
                    key={key}
                    className="flex items-center gap-3 p-5 bg-slate-50 rounded-2xl border hover:border-emerald-500 hover:shadow-md transition"
                  >
                    {amenityMap[key].icon}
                    <span className="font-medium">
                      {amenityMap[key].label}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500">No amenities available</p>
            )}
          </div>

          {/* BOOK BUTTON */}
          <div className="mt-12">
            <button
              onClick={() => navigate(`/book/${cabin._id}`)}
              className="w-full bg-emerald-600 text-white text-lg py-4 rounded-2xl hover:bg-emerald-700 transition"
            >
              Book Cabin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

