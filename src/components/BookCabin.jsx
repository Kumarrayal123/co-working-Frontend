

// // export default BookCabin;

// import React, { useState, useEffect } from "react";
// import UsersNavbar from "./UsersNavbar";
// import axios from "axios";
// import { useParams, useNavigate } from "react-router-dom";

// const BookCabin = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [cabin, setCabin] = useState(null);

//   // User Details
//   const [name, setName] = useState("");
//   const [mobile, setMobile] = useState("");

//   // Start & End Dates / Times
//   const [startDate, setStartDate] = useState("");
//   const [startTime, setStartTime] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [endTime, setEndTime] = useState("");

//   // Fetch cabin details
//   useEffect(() => {
//     axios
//       .get(`http://localhost:5000/api/cabins/${id}`)
//       .then((res) => setCabin(res.data))
//       .catch((err) => console.log(err));
//   }, [id]);

//   // Submit booking
//   const handleBooking = async (e) => {
//     e.preventDefault();

//     const bookingData = {
//       cabinId: id,
//       name,
//       mobile,
//       startDate,
//       startTime,
//       endDate,
//       endTime,
//     };

//     try {
//       await axios.post("http://localhost:5000/api/bookings", bookingData);
//       alert("Booking Confirmed Successfully!");
//       navigate("/spaces");
//     } catch (error) {
//       console.log(error);
//       alert("Something went wrong. Please try again.");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 p-8">

//       <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-lg border">
//             <UsersNavbar/>
//         <h2 className="text-3xl font-bold mb-6 text-emerald-600">
//           Book Your Cabin
//         </h2>

//         {/* Cabin Details */}
//         {cabin && (
//           <div className="mb-6 p-4 border rounded-xl bg-gray-100">
//             <h3 className="text-xl font-semibold text-emerald-700 mb-2">
//               {cabin.name}
//             </h3>

//             {cabin.images?.length > 0 && (
//               <img
//                 src={`http://localhost:5000/${cabin.images[0]}`}
//                 alt={cabin.name}
//                 className="w-full h-48 object-cover rounded-xl mb-3"
//               />
//             )}

//             <p className="text-gray-700">
//               <strong>Location:</strong> {cabin.address}
//             </p>

//             <p className="text-gray-700">
//               <strong>Capacity:</strong> {cabin.capacity} People
//             </p>

//             <p className="text-gray-700">
//               <strong>Price:</strong> ₹{cabin.price}
//             </p>

//             {cabin.description && (
//               <p className="text-gray-600 mt-2">{cabin.description}</p>
//             )}
//           </div>
//         )}

//         {/* Booking Form */}
//         <form onSubmit={handleBooking} className="space-y-5">

//           <div>
//             <label className="text-gray-700 font-medium">Your Name</label>
//             <input
//               type="text"
//               placeholder="Enter your full name"
//               className="w-full p-3 border rounded-xl mt-1"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               required
//             />
//           </div>

//           <div>
//             <label className="text-gray-700 font-medium">Mobile Number</label>
//             <input
//               type="text"
//               placeholder="Enter your mobile number"
//               className="w-full p-3 border rounded-xl mt-1"
//               value={mobile}
//               onChange={(e) => setMobile(e.target.value)}
//               required
//             />
//           </div>

//           {/* Start Section */}
//           <div>
//             <label className="text-gray-700 font-medium">Start Date & Time</label>
//             <div className="grid grid-cols-2 gap-4 mt-1">
//               <input
//                 type="date"
//                 className="p-3 border rounded-xl"
//                 value={startDate}
//                 onChange={(e) => setStartDate(e.target.value)}
//                 required
//               />

//               <input
//                 type="time"
//                 className="p-3 border rounded-xl"
//                 value={startTime}
//                 onChange={(e) => setStartTime(e.target.value)}
//                 required
//               />
//             </div>
//           </div>

//           {/* End Section */}
//           <div>
//             <label className="text-gray-700 font-medium">End Date & Time</label>
//             <div className="grid grid-cols-2 gap-4 mt-1">
//               <input
//                 type="date"
//                 className="p-3 border rounded-xl"
//                 value={endDate}
//                 onChange={(e) => setEndDate(e.target.value)}
//                 required
//               />

//               <input
//                 type="time"
//                 className="p-3 border rounded-xl"
//                 value={endTime}
//                 onChange={(e) => setEndTime(e.target.value)}
//                 required
//               />
//             </div>
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-emerald-600 text-white py-3 rounded-xl hover:bg-emerald-700 transition"
//           >
//             Confirm Booking
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default BookCabin;



// import React, { useState, useEffect } from "react";
// import UsersNavbar from "./UsersNavbar";
// import axios from "axios";
// import { useParams, useNavigate } from "react-router-dom";

// // Icons
// import {
//     Wifi,
//     Car,
//     Lock,
//     ShieldCheck,
//     Armchair,
//     ShowerHead,
//     MapPin,
//     Users
// } from "lucide-react";

// const BookCabin = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();

//     const [cabin, setCabin] = useState(null);
//     const [activeImage, setActiveImage] = useState(0); // ⭐ New for image switching

//     // Form states
//     const [name, setName] = useState("");
//     const [mobile, setMobile] = useState("");
//     const [startDate, setStartDate] = useState("");
//     const [startTime, setStartTime] = useState("");
//     const [endDate, setEndDate] = useState("");
//     const [endTime, setEndTime] = useState("");

//     useEffect(() => {
//         axios
//             .get(`http://localhost:5000/api/cabins/${id}`)
//             .then((res) => setCabin(res.data))
//             .catch((err) => console.log(err));
//     }, [id]);

//     const handleBooking = async (e) => {
//         e.preventDefault();

//         const bookingData = {
//             cabinId: id,
//             name,
//             mobile,
//             startDate,
//             startTime,
//             endDate,
//             endTime,
//         };

//         try {
//             await axios.post("http://localhost:5000/api/bookings", bookingData);
//             alert("Booking Confirmed Successfully!");
//             navigate("/spaces");
//         } catch (error) {
//             console.log(error);
//             alert("Something went wrong. Please try again.");
//         }
//     };

//     return (
//         <div className="min-h-screen bg-slate-50">
//             <UsersNavbar />

//             <div className="max-w-7xl mx-auto px-4 md:px-10 py-20">
//                 <h2 className="text-4xl font-bold mb-10 text-emerald-700 text-center">
//                     Book Your Workspace
//                 </h2>

//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

//                     {/* LEFT DETAILS */}
//                     <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
//                         {cabin && (
//                             <>
//                                 {/* ⭐ MAIN IMAGE */}
//                                 <div className="w-full h-72 rounded-xl overflow-hidden mb-5">
//                                     <img
//                                         src={`http://localhost:5000/${cabin.images?.[activeImage]}`}
//                                         alt="main"
//                                         className="w-full h-full object-cover"
//                                     />
//                                 </div>

//                                 {/* ⭐ THUMBNAIL IMAGES */}
//                                 <div className="grid grid-cols-3 gap-3 mb-6">
//                                     {cabin.images?.slice(0, 3).map((img, index) => (
//                                         <div
//                                             key={index}
//                                             onClick={() => setActiveImage(index)}
//                                             className={`cursor-pointer rounded-xl overflow-hidden border 
//                                         ${activeImage === index
//                                                     ? "border-2 border-emerald-600"
//                                                     : "border-gray-200"
//                                                 }`}
//                                         >
//                                             <img
//                                                 src={`http://localhost:5000/${img}`}
//                                                 alt="thumb"
//                                                 className="w-full h-24 object-cover hover:opacity-80 transition"
//                                             />
//                                         </div>
//                                     ))}
//                                 </div>

//                                 {/* TITLE */}
//                                 <h3 className="text-3xl font-semibold text-gray-900 mb-3">
//                                     {cabin.name}
//                                 </h3>

//                                 <p className="text-gray-700 text-lg mb-2 flex items-center gap-2">
//                                     <MapPin className="text-emerald-700 w-5 h-5" />
//                                     <strong>Location:</strong> {cabin.address}
//                                 </p>

//                                 <p className="text-gray-700 text-lg mb-2 flex items-center gap-2">
//                                     <Users className="text-emerald-700 w-5 h-5" />
//                                     <strong>Capacity:</strong> {cabin.capacity} People
//                                 </p>

//                                 {cabin.description && (
//                                     <p className="text-gray-600 text-md mt-3 leading-relaxed">
//                                         {cabin.description}
//                                     </p>
//                                 )}

//                                 {/* FEATURES */}
//                                 <h4 className="text-2xl font-bold text-emerald-700 mt-8 mb-4">
//                                     Workspace Features
//                                 </h4>

//                                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

//                                     <div className="flex items-center gap-3 p-3 bg-slate-100 rounded-xl">
//                                         <Wifi className="text-emerald-700" />
//                                         <span className="font-medium text-gray-700">High-Speed WiFi</span>
//                                     </div>

//                                     <div className="flex items-center gap-3 p-3 bg-slate-100 rounded-xl">
//                                         <Car className="text-emerald-700" />
//                                         <span className="font-medium text-gray-700">Parking</span>
//                                     </div>

//                                     <div className="flex items-center gap-3 p-3 bg-slate-100 rounded-xl">
//                                         <Lock className="text-emerald-700" />
//                                         <span className="font-medium text-gray-700">Secure Lockers</span>
//                                     </div>

//                                     <div className="flex items-center gap-3 p-3 bg-slate-100 rounded-xl">
//                                         <ShowerHead className="text-emerald-700" />
//                                         <span className="font-medium text-gray-700">Private Washrooms</span>
//                                     </div>

//                                     <div className="flex items-center gap-3 p-3 bg-slate-100 rounded-xl">
//                                         <Armchair className="text-emerald-700" />
//                                         <span className="font-medium text-gray-700">Comfort Seating</span>
//                                     </div>

//                                     <div className="flex items-center gap-3 p-3 bg-slate-100 rounded-xl">
//                                         <ShieldCheck className="text-emerald-700" />
//                                         <span className="font-medium text-gray-700">24/7 Security</span>
//                                     </div>

//                                 </div>
//                             </>
//                         )}
//                     </div>

//                     {/* RIGHT FORM */}
//                     <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
//                         <h3 className="text-2xl font-bold text-emerald-700 mb-6">
//                             Enter Booking Details
//                         </h3>

//                         <form onSubmit={handleBooking} className="space-y-6">

//                             <div>
//                                 <label className="text-gray-700 font-medium">Your Name</label>
//                                 <input
//                                     type="text"
//                                     className="w-full p-3 border rounded-xl mt-1 focus:ring-2 focus:ring-emerald-500"
//                                     placeholder="Enter your full name"
//                                     value={name}
//                                     onChange={(e) => setName(e.target.value)}
//                                     required
//                                 />
//                             </div>

//                             <div>
//                                 <label className="text-gray-700 font-medium">Mobile Number</label>
//                                 <input
//                                     type="text"
//                                     className="w-full p-3 border rounded-xl mt-1 focus:ring-2 focus:ring-emerald-500"
//                                     placeholder="Enter your mobile number"
//                                     value={mobile}
//                                     onChange={(e) => setMobile(e.target.value)}
//                                     required
//                                 />
//                             </div>

//                             {/* Start */}
//                             <div>
//                                 <label className="text-gray-700 font-medium">Start Date & Time</label>
//                                 <div className="grid grid-cols-2 gap-4 mt-1">
//                                     <input
//                                         type="date"
//                                         className="p-3 border rounded-xl"
//                                         value={startDate}
//                                         onChange={(e) => setStartDate(e.target.value)}
//                                         required
//                                     />
//                                     <input
//                                         type="time"
//                                         className="p-3 border rounded-xl"
//                                         value={startTime}
//                                         onChange={(e) => setStartTime(e.target.value)}
//                                         required
//                                     />
//                                 </div>
//                             </div>

//                             {/* End */}
//                             <div>
//                                 <label className="text-gray-700 font-medium">End Date & Time</label>
//                                 <div className="grid grid-cols-2 gap-4 mt-1">
//                                     <input
//                                         type="date"
//                                         className="p-3 border rounded-xl"
//                                         value={endDate}
//                                         onChange={(e) => setEndDate(e.target.value)}
//                                         required
//                                     />
//                                     <input
//                                         type="time"
//                                         className="p-3 border rounded-xl"
//                                         value={endTime}
//                                         onChange={(e) => setEndTime(e.target.value)}
//                                         required
//                                     />
//                                 </div>
//                             </div>

//                             <button
//                                 type="submit"
//                                 className="w-full bg-emerald-600 text-white py-3 rounded-xl text-lg font-medium hover:bg-emerald-700 transition"
//                             >
//                                 Confirm Booking
//                             </button>

//                         </form>
//                     </div>

//                 </div>
//             </div>
//         </div>
//     );
// };

// export default BookCabin;


// import React, { useState, useEffect } from "react";
// import UsersNavbar from "./UsersNavbar";
// import axios from "axios";
// import { useParams, useNavigate } from "react-router-dom";
// import { useNavigation } from "react-router-dom";

// // Icons
// import {
//     Wifi,
//     Car,
//     Lock,
//     ShieldCheck,
//     Armchair,
//     ShowerHead,
//     MapPin,
//     Users
// } from "lucide-react";

// const BookCabin = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();

//     const [cabin, setCabin] = useState(null);
//     const [activeImage, setActiveImage] = useState(0);

//     const [name, setName] = useState("");
//     const [mobile, setMobile] = useState("");
//     const [startDate, setStartDate] = useState("");
//     const [startTime, setStartTime] = useState("");
//     const [endDate, setEndDate] = useState("");
//     const [endTime, setEndTime] = useState("");

  

//     useEffect(() => {
//         axios
//             .get(`http://localhost:5000/api/cabins/${id}`)
//             .then((res) => setCabin(res.data))
//             .catch((err) => console.log(err));
//     }, [id]);


//     // ⭐ BOOKING FUNCTION (FIXED)
//     const handleBooking = async (e) => {
//         e.preventDefault();

//         const user = JSON.parse(localStorage.getItem("user"));
//         const userId = user?._id;

//         if (!userId) {
//             alert("Please login before booking a cabin.");
//             navigate("/login");
//             return;
//         }

//         const bookingData = {
//             cabinId: id,
//             startDate,
//             startTime,
//             endDate,
//             endTime,
//         };

//         try {
//             await axios.post(
//                 `http://localhost:5000/api/bookings/createbooking/${userId}`,
//                 bookingData
//             );

//             alert("Booking Confirmed Successfully!");
//             navigate("/mybookings");

//         } catch (error) {
//             console.log(error);
//             alert("Something went wrong. Please try again.");
//         }
//     };


//     return (
//         <div className="min-h-screen bg-slate-50">
//             <UsersNavbar />

//             <div className="max-w-7xl mx-auto px-4 md:px-10 py-20">
//                 <h2 className="text-4xl font-bold mb-10 text-emerald-700 text-center">
//                     Book Your Workspace
//                 </h2>

//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

//                     {/* LEFT DETAILS */}
//                     <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
//                         {cabin && (
//                             <>
//                                 {/* Main Image */}
//                                 <div className="w-full h-72 rounded-xl overflow-hidden mb-5">
//                                     <img
//                                         src={`http://localhost:5000/${cabin.images?.[activeImage]}`}
//                                         alt="main"
//                                         className="w-full h-full object-cover"
//                                     />
//                                 </div>

//                                 {/* Thumbnails */}
//                                 <div className="grid grid-cols-3 gap-3 mb-6">
//                                     {cabin.images?.slice(0, 3).map((img, index) => (
//                                         <div
//                                             key={index}
//                                             onClick={() => setActiveImage(index)}
//                                             className={`cursor-pointer rounded-xl overflow-hidden border 
//                                                 ${activeImage === index
//                                                     ? "border-2 border-emerald-600"
//                                                     : "border-gray-200"
//                                                 }`}
//                                         >
//                                             <img
//                                                 src={`http://localhost:5000/${img}`}
//                                                 alt="thumb"
//                                                 className="w-full h-24 object-cover hover:opacity-80 transition"
//                                             />
//                                         </div>
//                                     ))}
//                                 </div>

//                                 <h3 className="text-3xl font-semibold text-gray-900 mb-3">
//                                     {cabin.name}
//                                 </h3>

//                                 <p className="text-gray-700 text-lg mb-2 flex items-center gap-2">
//                                     <MapPin className="text-emerald-700 w-5 h-5" />
//                                     <strong>Location:</strong> {cabin.address}
//                                 </p>

//                                 <p className="text-gray-700 text-lg mb-2 flex items-center gap-2">
//                                     <Users className="text-emerald-700 w-5 h-5" />
//                                     <strong>Capacity:</strong> {cabin.capacity} People
//                                 </p>

//                                 {cabin.description && (
//                                     <p className="text-gray-600 text-md mt-3 leading-relaxed">
//                                         {cabin.description}
//                                     </p>
//                                 )}

//                                 <h4 className="text-2xl font-bold text-emerald-700 mt-8 mb-4">
//                                     Workspace Features
//                                 </h4>

//                                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

//                                     <div className="flex items-center gap-3 p-3 bg-slate-100 rounded-xl">
//                                         <Wifi className="text-emerald-700" />
//                                         <span className="font-medium text-gray-700">High-Speed WiFi</span>
//                                     </div>

//                                     <div className="flex items-center gap-3 p-3 bg-slate-100 rounded-xl">
//                                         <Car className="text-emerald-700" />
//                                         <span className="font-medium text-gray-700">Parking</span>
//                                     </div>

//                                     <div className="flex items-center gap-3 p-3 bg-slate-100 rounded-xl">
//                                         <Lock className="text-emerald-700" />
//                                         <span className="font-medium text-gray-700">Secure Lockers</span>
//                                     </div>

//                                     <div className="flex items-center gap-3 p-3 bg-slate-100 rounded-xl">
//                                         <ShowerHead className="text-emerald-700" />
//                                         <span className="font-medium text-gray-700">Private Washrooms</span>
//                                     </div>

//                                     <div className="flex items-center gap-3 p-3 bg-slate-100 rounded-xl">
//                                         <Armchair className="text-emerald-700" />
//                                         <span className="font-medium text-gray-700">Comfort Seating</span>
//                                     </div>

//                                     <div className="flex items-center gap-3 p-3 bg-slate-100 rounded-xl">
//                                         <ShieldCheck className="text-emerald-700" />
//                                         <span className="font-medium text-gray-700">24/7 Security</span>
//                                     </div>

//                                 </div>
//                             </>
//                         )}
//                     </div>


//                     {/* RIGHT FORM */}
//                     <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
//                         <h3 className="text-2xl font-bold text-emerald-700 mb-6">
//                             Enter Booking Details
//                         </h3>

//                         <form onSubmit={handleBooking} className="space-y-6">

//                             <div>
//                                 <label className="text-gray-700 font-medium">Your Name</label>
//                                 <input
//                                     type="text"
//                                     className="w-full p-3 border rounded-xl mt-1"
//                                     placeholder="Enter your full name"
//                                     value={name}
//                                     onChange={(e) => setName(e.target.value)}
//                                     required
//                                 />
//                             </div>

//                             <div>
//                                 <label className="text-gray-700 font-medium">Mobile Number</label>
//                                 <input
//                                     type="text"
//                                     className="w-full p-3 border rounded-xl mt-1"
//                                     placeholder="Enter your mobile number"
//                                     value={mobile}
//                                     onChange={(e) => setMobile(e.target.value)}
//                                     required
//                                 />
//                             </div>

//                             {/* Start */}
//                             <div>
//                                 <label className="text-gray-700 font-medium">Start Date & Time</label>
//                                 <div className="grid grid-cols-2 gap-4 mt-1">
//                                     <input
//                                         type="date"
//                                         className="p-3 border rounded-xl"
//                                         value={startDate}
//                                         onChange={(e) => setStartDate(e.target.value)}
//                                         required
//                                     />
//                                     <input
//                                         type="time"
//                                         className="p-3 border rounded-xl"
//                                         value={startTime}
//                                         onChange={(e) => setStartTime(e.target.value)}
//                                         required
//                                     />
//                                 </div>
//                             </div>

//                             {/* End */}
//                             <div>
//                                 <label className="text-gray-700 font-medium">End Date & Time</label>
//                                 <div className="grid grid-cols-2 gap-4 mt-1">
//                                     <input
//                                         type="date"
//                                         className="p-3 border rounded-xl"
//                                         value={endDate}
//                                         onChange={(e) => setEndDate(e.target.value)}
//                                         required
//                                     />
//                                     <input
//                                         type="time"
//                                         className="p-3 border rounded-xl"
//                                         value={endTime}
//                                         onChange={(e) => setEndTime(e.target.value)}
//                                         required
//                                     />
//                                 </div>
//                             </div>

//                             <button
//                                 type="submit"
//                                 className="w-full bg-emerald-600 text-white py-3 rounded-xl text-lg font-medium hover:bg-emerald-700 transition"
//                             >
//                                 Confirm Booking
//                             </button>

//                         </form>
//                     </div>

//                 </div>
//             </div>
//         </div>
//     );
// };

// export default BookCabin;



import React, { useState, useEffect } from "react";
import UsersNavbar from "./UsersNavbar";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

// Icons
import {
    Wifi,
    Car,
    Lock,
    ShieldCheck,
    Armchair,
    ShowerHead,
    MapPin,
    Users
} from "lucide-react";

const BookCabin = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const PRICE_PER_HOUR = 5000;

    const [cabin, setCabin] = useState(null);
    const [activeImage, setActiveImage] = useState(0);

    const [name, setName] = useState("");
    const [mobile, setMobile] = useState("");
    const [startDate, setStartDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endDate, setEndDate] = useState("");
    const [endTime, setEndTime] = useState("");

    const [totalHours, setTotalHours] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);

    // Fetch cabin
    useEffect(() => {
        axios
            .get(`http://localhost:5000/api/cabins/${id}`)
            .then((res) => setCabin(res.data))
            .catch((err) => console.log(err));
    }, [id]);

    // ⭐ CALCULATE HOURS & PRICE (MAIN LOGIC)
    useEffect(() => {
        if (startDate && startTime && endDate && endTime) {
            const start = new Date(`${startDate}T${startTime}`);
            const end = new Date(`${endDate}T${endTime}`);

            if (end <= start) {
                setTotalHours(0);
                setTotalPrice(0);
                return;
            }

            const diffMs = end - start;
            const hours = diffMs / (1000 * 60 * 60);

            const billableHours = Math.ceil(hours); // round up
            setTotalHours(billableHours);
            setTotalPrice(billableHours * PRICE_PER_HOUR);
        }
    }, [startDate, startTime, endDate, endTime]);

    // ⭐ BOOKING FUNCTION
    const handleBooking = async (e) => {
        e.preventDefault();

        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user?._id;

        if (!userId) {
            alert("Please login before booking a cabin.");
            navigate("/login");
            return;
        }

        const bookingData = {
            cabinId: id,
            name,
            mobile,
            startDate,
            startTime,
            endDate,
            endTime,
            totalHours,
            totalPrice
        };

        try {
            await axios.post(
                `http://localhost:5000/api/bookings/createbooking/${userId}`,
                bookingData
            );

            alert("Booking Confirmed Successfully!");
            navigate("/mybookings");
        } catch (error) {
            console.log(error);
            alert("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <UsersNavbar />

            <div className="max-w-7xl mx-auto px-4 md:px-10 py-20">
                <h2 className="text-4xl font-bold mb-10 text-emerald-700 text-center">
                    Book Your Workspace
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                    {/* LEFT DETAILS */}
                    <div className="bg-white p-6 rounded-2xl shadow-lg border">
                        {cabin && (
                            <>
                                <div className="w-full h-72 rounded-xl overflow-hidden mb-5">
                                    <img
                                        src={`http://localhost:5000/${cabin.images?.[activeImage]}`}
                                        alt="cabin"
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="grid grid-cols-3 gap-3 mb-6">
                                    {cabin.images?.slice(0, 3).map((img, index) => (
                                        <img
                                            key={index}
                                            src={`http://localhost:5000/${img}`}
                                            alt="thumb"
                                            onClick={() => setActiveImage(index)}
                                            className="h-24 w-full object-cover rounded-xl cursor-pointer border"
                                        />
                                    ))}
                                </div>

                                <h3 className="text-3xl font-semibold">{cabin.name}</h3>

                                <p className="flex gap-2 mt-2">
                                    <MapPin className="text-emerald-600" />
                                    {cabin.address}
                                </p>

                                <p className="flex gap-2 mt-2">
                                    <Users className="text-emerald-600" />
                                    Capacity: {cabin.capacity}
                                </p>
                            </>
                        )}
                    </div>

                    {/* RIGHT FORM */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg border">
                        <form onSubmit={handleBooking} className="space-y-6">

                            <input
                                type="text"
                                placeholder="Your Name"
                                className="w-full p-3 border rounded-xl"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />

                            <input
                                type="text"
                                placeholder="Mobile Number"
                                className="w-full p-3 border rounded-xl"
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                                required
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="date"
                                    className="p-3 border rounded-xl"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    required
                                />
                                <input
                                    type="time"
                                    className="p-3 border rounded-xl"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="date"
                                    className="p-3 border rounded-xl"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    required
                                />
                                <input
                                    type="time"
                                    className="p-3 border rounded-xl"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    required
                                />
                            </div>

                            {/* PRICE DISPLAY */}
                            {totalHours > 0 && (
                                <div className="bg-emerald-50 border p-4 rounded-xl">
                                    <p><b>Total Hours:</b> {totalHours}</p>
                                    <p className="text-xl font-bold text-emerald-700">
                                        Total Price: ₹{totalPrice.toLocaleString("en-IN")}
                                    </p>
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full bg-emerald-600 text-white py-3 rounded-xl text-lg hover:bg-emerald-700"
                            >
                                Confirm Booking
                            </button>

                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default BookCabin;
