// import React, { useEffect, useState } from "react";
// import axios from "axios";

// function AllUsers() {
//   const [users, setUsers] = useState([]);

//   useEffect(() => {
//     axios
//       .get("http://localhost:5000/api/auth/users")
//       .then((res) => setUsers(res.data))
//       .catch((err) => console.log(err));
//   }, []);

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>All Registered Users</h2>

//       {users.length === 0 ? (
//         <p>No users found.</p>
//       ) : (
//         <table border="1" cellPadding="10" style={{ width: "100%" }}>
//           <thead>
//             <tr>
//               <th>Name</th>
//               <th>Email</th>
//               <th>Mobile</th>
//               <th>Address</th>
//             </tr>
//           </thead>

//           <tbody>
//             {users.map((u) => (
//               <tr key={u._id}>
//                 <td>{u.name}</td>
//                 <td>{u.email}</td>
//                 <td>{u.mobile}</td>
//                 <td>{u.address}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }

// export default AllUsers;


import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "./AdminNavbar";
import { Search, FileText, Download, User } from "lucide-react";

function AllUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/auth/all-users")
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch users");
        setLoading(false);
      });
  }, []);

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />

      <div className="pt-28 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="mt-1 text-gray-500">View and manage registered members</p>
          </div>

          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500">{error}</div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase font-semibold text-gray-500">
                  <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Contact Info</th>
                    <th className="px-6 py-4">Address</th>
                    <th className="px-6 py-4">Documents</th>
                    <th className="px-6 py-4">Joined On</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-gray-400">
                        No users found matching your search.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold shrink-0">
                              {u.name ? u.name.charAt(0).toUpperCase() : <User size={18} />}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">{u.name}</div>
                              <div className="text-xs text-gray-500">ID: {u._id?.substring(0, 8)}...</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span>{u.email}</span>
                            <span className="text-gray-400 text-xs">{u.mobile}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 max-w-xs truncate" title={u.address}>
                          {u.address}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 flex-wrap">
                            {u.documents?.length > 0 ? (
                              u.documents.map((doc, i) => {
                                const path = doc.replace(/\\/g, "/");
                                const ext = path.split(".").pop().toLowerCase();
                                const isImage = ["jpg", "jpeg", "png", "gif"].includes(ext);

                                return (
                                  <a
                                    key={i}
                                    href={`http://localhost:5000/${path}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={`flex items-center gap-1 px-2 py-1 rounded border text-xs font-medium transition-colors ${isImage
                                        ? "bg-purple-50 text-purple-700 border-purple-100 hover:bg-purple-100"
                                        : "bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100"
                                      }`}
                                  >
                                    {isImage ? <FileText size={12} /> : <Download size={12} />}
                                    {ext.toUpperCase()}
                                  </a>
                                );
                              })
                            ) : (
                              <span className="text-gray-400 text-xs italic">No docs</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(u.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AllUsers;

