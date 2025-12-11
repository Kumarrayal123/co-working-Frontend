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
import { MapPin, Building, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const MyCabin = () => {
  const [cabins, setCabins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    axios
      .get("http://localhost:5000/api/cabins/user", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setCabins(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <UsersNavbar />

      <div className="pt-28 pb-12 max-w-7xl mx-auto px-4">

        <div className="flex justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Properties</h1>

          <Link
            to="/addcabin"
            className="flex items-center gap-2 px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            <Plus size={18} /> Add New Property
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin h-10 w-10 border-t-2 border-emerald-600 rounded-full"></div>
          </div>
        ) : cabins.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-xl border shadow-sm">
            <div className="mx-auto h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Building size={32} className="text-gray-400" />
            </div>

            <h3 className="text-lg font-medium">No properties yet</h3>
            <p className="text-gray-500 mt-1">Start listing your workspace today.</p>

            <Link
              to="/addcabin"
              className="mt-6 inline-flex px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              List Your First Property
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cabins.map((cabin) => (
              <div
                key={cabin._id}
                className="bg-white rounded-xl border shadow-sm overflow-hidden"
              >
                <img
                  src={`http://localhost:5000/${cabin.images[0]}`}
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800";
                  }}
                  className="h-48 w-full object-cover"
                />

                <div className="p-5">
                  <h3 className="text-xl font-bold">{cabin.name}</h3>

                  <div className="flex items-center gap-2 text-gray-500 text-sm my-2">
                    <MapPin size={14} />
                    {cabin.address}
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2 h-10">
                    {cabin.description}
                  </p>

                  <div className="flex justify-between mt-4 pt-4 border-t">
                    <span className="font-bold">₹{cabin.price}/mo</span>

                    <Link
                      to={`/cabin/${cabin._id}`}
                      className="text-emerald-600 hover:underline"
                    >
                      Manage
                    </Link>
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





