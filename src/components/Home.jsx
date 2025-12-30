
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import img1 from "../assets/Selection (1).png";
// import img2 from "../assets/Selection (2).png";
// import img3 from "../assets/Selection (3).png";
// import UsersNavbar from "./UsersNavbar";
// import { PlusCircle } from "lucide-react";


// function Home() {
//   const [user, setUser] = useState(null);


//   useEffect(() => {
//     const userId = localStorage.getItem("userId");
//     if (userId) {
//       axios
//         .get(`http://localhost:5050/api/auth/user/${userId}`)
//         .then((res) => setUser(res.data))
//         .catch((err) => console.log(err));
//     }
//   }, []);

//   return (
//     <div className="home-main">
//       {/* <UserSidebar user={user} /> */}
//       <UsersNavbar />

//       <div className="home-content">

//         <button className="add-space-btn">
//           <PlusCircle size={20} /> Add Cabin / Space
//         </button>

//         <h2 className="section-title">Available Co-Working Spaces</h2>

//       </div>
//     </div>
//   );
// }

// export default Home;


import React, { useEffect, useState } from "react";
import axios from "axios";
import UsersNavbar from "./UsersNavbar";
import { PlusCircle, MapPin, Users, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Hero from "./Hero";
import SpacesSection from "./SpaceSection";

function Home() {
  const [user, setUser] = useState(null);
  const [cabins, setCabins] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      axios
        .get(`http://localhost:5050/api/auth/user/${userId}`)
        .then((res) => setUser(res.data))
        .catch((err) => console.log(err));
    }

    // Fetch cabins
    axios
      .get("http://localhost:5050/api/cabins")
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
    <div className="bg-gray-50 min-h-screen font-sans">
      <UsersNavbar />

      <div className="pt-24 pb-12 w-full">
        {/* Helper wrapper to constrain content width generally, but allow hero to go wide */}
        <div className="flex flex-col gap-16">

          <Hero />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                  Available Spaces
                </h2>
                <p className="mt-2 text-gray-600">
                  Choose the perfect cabin for your team and start working today.
                </p>
              </div>

              <button
                onClick={() => navigate("/addcabin")}
                className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
              >
                <PlusCircle size={20} />
                <span>List Your Space</span>
              </button>
            </div>

            {/* Cabin Listing Grid */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
              </div>
            ) : cabins.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <p className="text-xl text-gray-500">No cabins available at the moment.</p>
                <button onClick={() => navigate('/addcabin')} className="mt-4 text-emerald-600 font-medium hover:underline">Be the first to list one!</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {cabins.map((cabin) => (
                  <div
                    className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                    key={cabin._id}
                  >
                    {/* Image Container */}
                    <div className="relative h-64 overflow-hidden bg-gray-100">
                      <img
                        src={`http://localhost:5050/${cabin.images[0]}`}
                        alt={cabin.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000"; // Fallback image
                        }}
                      />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-900 border border-gray-200 shadow-sm">
                        {cabin.capacity} Seats
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors mb-2">
                        {cabin.name}
                      </h3>

                      <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                        {cabin.description || "A modern workspace equipped with high-speed internet and premium amenities."}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
                        <div className="flex items-center gap-1.5">
                          <Users size={16} className="text-emerald-500" />
                          <span>{cabin.capacity} People</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin size={16} className="text-emerald-500" />
                          <span className="truncate max-w-[120px]" title={cabin.address}>{cabin.address}</span>
                        </div>
                      </div>

                      {/* Footer / Price Action */}
                      <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-400 font-medium uppercase">Starting from</span>
                          <span className="text-lg font-bold text-gray-900">₹{cabin.price || '5,000'}<span className="text-sm text-gray-400 font-normal">/mo</span></span>
                        </div>
                        <button className="p-2 rounded-full bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                          <ArrowRight size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <SpacesSection />
        </div>
      </div>
    </div>
  );
}

export default Home;
