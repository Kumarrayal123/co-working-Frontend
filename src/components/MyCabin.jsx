// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const MyCabin = () => {
//   const [cabins, setCabins] = useState([]);

//   useEffect(() => {
//   axios.get("http://localhost:5000/api/cabins")
//     .then((res) => setCabins(res.data))
//     .catch((err) => console.error(err));
// }, []);


//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>My Cabins</h2>

//       {cabins.length === 0 ? (
//         <p>You have not added any cabins yet.</p>
//       ) : (
//         <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
//           {cabins.map((cabin) => (
//             <div
//               key={cabin._id}
//               style={{
//                 border: "1px solid #ccc",
//                 borderRadius: "8px",
//                 width: "250px",
//                 padding: "10px",
//               }}
//             >
//               {cabin.images && cabin.images[0] && (
//                 <img
//                   src={`http://localhost:5000/${cabin.images[0]}`}
//                   alt={cabin.name}
//                   style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "5px" }}
//                 />
//               )}
//               <h3>{cabin.name}</h3>
//               <p>{cabin.description}</p>
//               <p>
//                 <strong>Capacity:</strong> {cabin.capacity}
//               </p>
//               <p>
//                 <strong>Address:</strong> {cabin.address}
//               </p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyCabin;


// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const MyCabin = () => {
//   const [cabins, setCabins] = useState([]);

//   useEffect(() => {
//     // 1️⃣ Get the token stored in localStorage at login
//     const token = localStorage.getItem("token");

//     if (token) {
//       // 2️⃣ Make a request to the protected route
//       axios
//         .get("http://localhost:5000/api/cabins/user", {
//           headers: {
//             Authorization: `Bearer ${token}`, // send token in header
//           },
//         })
//         .then((res) => setCabins(res.data))
//         .catch((err) => console.error(err));
//     } else {
//       console.log("No token found. Please login.");
//     }
//   }, []);

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>My Cabins</h2>

//       {cabins.length === 0 ? (
//         <p>You have not added any cabins yet.</p>
//       ) : (
//         <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
//           {cabins.map((cabin) => (
//             <div
//               key={cabin._id}
//               style={{
//                 border: "1px solid #ccc",
//                 borderRadius: "8px",
//                 width: "250px",
//                 padding: "10px",
//               }}
//             >
//               {cabin.images && cabin.images[0] && (
//                 <img
//                   src={`http://localhost:5000/${cabin.images[0]}`}
//                   alt={cabin.name}
//                   style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "5px" }}
//                 />
//               )}
//               <h3>{cabin.name}</h3>
//               <p>{cabin.description}</p>
//               <p>
//                 <strong>Capacity:</strong> {cabin.capacity}
//               </p>
//               <p>
//                 <strong>Address:</strong> {cabin.address}
//               </p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyCabin;





import React, { useEffect, useState } from "react";
import axios from "axios";
import UsersNavbar from "./UsersNavbar";
import { MapPin, Users, Building, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const MyCabin = () => {
  const [cabins, setCabins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:5000/api/cabins/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setCabins(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    } else {
      loading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <UsersNavbar />

      <div className="pt-28 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Properties</h1>
            <p className="mt-1 text-gray-500">Manage your listed cabins and workspaces</p>
          </div>
          <Link
            to="/addcabin"
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <Plus size={18} /> Add New Property
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-600"></div>
          </div>
        ) : cabins.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm border-dashed">
            <div className="mx-auto h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Building size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No properties listed yet</h3>
            <p className="mt-1 text-gray-500 max-w-sm mx-auto mb-6">Start earning by listing your spare office space or cabin today.</p>
            <Link
              to="/addcabin"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
            >
              List Your First Property
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cabins.map((cabin) => (
              <div
                key={cabin._id}
                className="group bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="relative h-48 bg-gray-200">
                  <img
                    src={`http://localhost:5000/${cabin.images[0]}`}
                    alt={cabin.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000";
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-md text-xs font-semibold text-gray-700 shadow-sm">
                    {cabin.capacity} Seats
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">{cabin.name}</h3>
                  <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-3">
                    <MapPin size={14} />
                    <span className="truncate">{cabin.address}</span>
                  </div>

                  <p className="text-gray-600 text-sm line-clamp-2 mb-4 h-10">
                    {cabin.description || "No description provided."}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="font-bold text-gray-900">
                      ₹{cabin.price || '5,000'} <span className="text-xs font-normal text-gray-500">/mo</span>
                    </span>
                    <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:underline">
                      Manage Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCabin;




