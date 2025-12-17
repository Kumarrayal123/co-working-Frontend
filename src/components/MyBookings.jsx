// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const MyBookings = () => {
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const user = JSON.parse(localStorage.getItem("user")); // Logged in user
//   const userId = user?._id;

//   useEffect(() => {
//     if (!userId) return;

//     const fetchBookings = async () => {
//       try {
//         const res = await axios.get(
//           `http://localhost:5000/api/bookings/userbookings/${userId}`
//         );
//         setBookings(res.data.bookings);
//       } catch (error) {
//         console.log(error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBookings();
//   }, [userId]);

//   if (loading) return <p>Loading...</p>;

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-4">My Bookings</h1>

//       {bookings.length === 0 ? (
//         <p>No bookings found.</p>
//       ) : (
//         bookings.map((b) => (
//           <div key={b._id} className="shadow-md p-4 mb-3 rounded-lg border">
//             <h2 className="text-xl font-semibold">
//               {b.cabinId?.name}
//             </h2>

//             <p><strong>Start:</strong> {b.startDate} {b.startTime}</p>
//             <p><strong>End:</strong> {b.endDate} {b.endTime}</p>

//             <p><strong>Price:</strong> ₹{b.cabinId?.price}</p>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default MyBookings;



// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import UsersNavbar from "./UsersNavbar";
// import {
//   Calendar,
//   MapPin,
//   IndianRupee,
//   User,
//   Clock,
//   Home,
// } from "lucide-react";

// const MyBookings = () => {
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const user = JSON.parse(localStorage.getItem("user"));
//   const userId = user?._id;

//   useEffect(() => {
//     if (!userId) return;

//     const fetchBookings = async () => {
//       try {
//         const res = await axios.get(
//           `http://localhost:5000/api/bookings/userbookings/${userId}`
//         );
//         setBookings(res.data.bookings);
//       } catch (error) {
//         console.log(error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBookings();
//   }, [userId]);

//   if (loading)
//     return (
//       <p className="text-center py-10 text-lg font-medium animate-pulse">
//         Fetching your bookings...
//       </p>
//     );

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col">
//       <UsersNavbar />

//       <div className="flex-grow pt-28 px-4 sm:px-6 lg:px-8 pb-12">
//         <div className="max-w-3xl mx-auto">

//           {/* Heading */}
//           <h1 className="text-3xl font-bold text-emerald-700 mb-6 flex items-center gap-2">
//             <Home size={28} /> My Bookings
//           </h1>

//           {/* No Bookings */}
//           {bookings.length === 0 ? (
//             <p className="text-gray-600 text-center mt-10 text-lg">
//               You haven’t made any bookings yet.
//             </p>
//           ) : (
//             <div className="space-y-5">
//               {bookings.map((b) => (
//                 <div
//                   key={b._id}
//                   className="bg-white flex flex-col sm:flex-row gap-4 items-start 
//                   shadow-sm hover:shadow-md transition-all 
//                   rounded-2xl border border-gray-100 p-4 hover:-translate-y-1"
//                 >
//                   {/* Image */}
//                   <div className="w-full sm:w-36 h-36 rounded-xl overflow-hidden shadow-sm">
//                     <img
//                       src={
//                         b.cabinId?.images?.[0]
//                           ? `http://localhost:5000/${b.cabinId.images[0]}`
//                           : "https://via.placeholder.com/300x300?text=No+Image"
//                       }
//                       alt="cabin"
//                       className="w-full h-full object-cover"
//                     />
//                   </div>

//                   {/* Content */}
//                   <div className="flex-1 space-y-2">

//                     {/* Property Name */}
//                     <div>
//                       <h2 className="text-xl font-semibold text-gray-800 leading-tight">
//                         {b.cabinId?.name}
//                       </h2>
//                       <p className="text-gray-500 text-sm flex items-center gap-1 mt-0.5">
//                         <MapPin size={15} />
//                         {b.cabinId?.address}
//                       </p>
//                     </div>

//                     {/* User */}
//                     <p className="flex items-center gap-1 text-gray-600 text-sm">
//                       <User size={15} /> {user?.name}
//                     </p>

//                     {/* Dates */}
//                     <div className="flex flex-wrap gap-3 mt-1">
//                       {/* Start */}
//                       <div className="bg-gray-100 px-3 py-2 rounded-lg border flex items-center gap-2">
//                         <Calendar className="text-emerald-600" size={18} />
//                         <div>
//                           <p className="font-semibold text-sm">{b.startDate}</p>
//                           <p className="text-gray-500 text-xs">{b.startTime}</p>
//                         </div>
//                       </div>

//                       {/* End */}
//                       <div className="bg-gray-100 px-3 py-2 rounded-lg border flex items-center gap-2">
//                         <Clock className="text-emerald-600" size={18} />
//                         <div>
//                           <p className="font-semibold text-sm">{b.endDate}</p>
//                           <p className="text-gray-500 text-xs">{b.endTime}</p>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Footer */}
//                     <div className="flex justify-between items-center pt-1">
//                       <p className="flex items-center gap-1 text-emerald-700 font-semibold text-lg">
//                         <IndianRupee size={18} />
//                         {b.cabinId?.price}
//                       </p>

//                       <span className="px-4 py-1 text-sm rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
//                         Confirmed
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}

//         </div>
//       </div>
//     </div>
//   );
// };

// export default MyBookings;


import axios from "axios";
import {
  Calendar,
  Clock,
  Home,
  IndianRupee,
  MapPin,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import UsersNavbar from "./UsersNavbar";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fix: Safe parsing for localStorage
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch (err) {
      return null;
    }
  })();

  const userId = user?._id;

  useEffect(() => {
    if (!userId) {
      console.log("❌ No userId found → API not called");
      setLoading(false);
      return;
    }

    const fetchBookings = async () => {
      try {
        console.log("📌 API HIT →", `http://localhost:5000/api/bookings/userbookings/${userId}`);

        const res = await axios.get(
          `http://localhost:5000/api/bookings/userbookings/${userId}`
        );

        setBookings(res.data.bookings || []);
      } catch (error) {
        console.log("API ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [userId]);

  if (loading)
    return (
      <p className="text-center py-10 text-lg font-medium animate-pulse">
        Fetching your bookings...
      </p>
    );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <UsersNavbar />

      <div className="flex-grow pt-28 px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-3xl mx-auto">

          <h1 className="text-3xl font-bold text-emerald-700 mb-6 flex items-center gap-2">
            <Home size={28} /> My Bookings
          </h1>

          {bookings.length === 0 ? (
            <p className="text-gray-600 text-center mt-10 text-lg">
              You haven’t made any bookings yet.
            </p>
          ) : (
            <div className="space-y-5">
              {bookings.map((b) => (
                <div
                  key={b._id}
                  className="bg-white flex flex-col sm:flex-row gap-4 items-start 
                  shadow-sm hover:shadow-md transition-all 
                  rounded-2xl border border-gray-100 p-4 hover:-translate-y-1"
                >
                  {/* Image */}
                  <div className="w-full sm:w-36 h-36 rounded-xl overflow-hidden shadow-sm">
                    <img
                      src={
                        b.cabinId?.images?.[0]
                          ? `http://localhost:5000/${b.cabinId.images[0]}`
                          : "https://via.placeholder.com/300x300?text=No+Image"
                      }
                      alt="cabin"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-2">

                    <div>
                      <h2 className="text-xl font-semibold text-gray-800 leading-tight">
                        {b.cabinId?.name}
                      </h2>
                      <p className="text-gray-500 text-sm flex items-center gap-1 mt-0.5">
                        <MapPin size={15} />
                        {b.cabinId?.address}
                      </p>
                    </div>

                    <p className="flex items-center gap-1 text-gray-600 text-sm">
                      <User size={15} /> {user?.name}
                    </p>

                    <div className="flex flex-wrap gap-3 mt-1">
                      <div className="bg-gray-100 px-3 py-2 rounded-lg border flex items-center gap-2">
                        <Calendar className="text-emerald-600" size={18} />
                        <div>
                          <p className="font-semibold text-sm">
                            {b.startDate}
                          </p>
                          <p className="text-gray-500 text-xs">
                            {b.startTime}
                          </p>
                        </div>
                      </div>

                      <div className="bg-gray-100 px-3 py-2 rounded-lg border flex items-center gap-2">
                        <Clock className="text-emerald-600" size={18} />
                        <div>
                          <p className="font-semibold text-sm">
                            {b.endDate}
                          </p>
                          <p className="text-gray-500 text-xs">
                            {b.endTime}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* <div className="flex justify-between items-center pt-1">
                      <p className="flex items-center gap-1 text-emerald-700 font-semibold text-lg">
                        <IndianRupee size={18} />
                        {b.cabinId?.price}
                      </p>

                      <span className="px-4 py-1 text-sm rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                        Confirmed
                      </span>
                    </div> */}
                    <div className="flex justify-between items-center pt-1">
  <p className="flex items-center gap-1 text-emerald-700 font-semibold text-lg">
    <IndianRupee size={18} />
    {b.totalPrice?.toLocaleString("en-IN")}
  </p>

  <span className="px-4 py-1 text-sm rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
    Confirmed
  </span>
</div>

                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default MyBookings;
