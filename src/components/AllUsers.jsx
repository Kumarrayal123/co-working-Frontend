import axios from "axios";
import { CheckCircle, Clock, Download, Edit, Eye, File, FileText, Search, Trash2, User, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import AdminNavbar from "./AdminNavbar";

function AllUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editPopupOpen, setEditPopupOpen] = useState(false);
  const [viewPopupOpen, setViewPopupOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Status state
  const [statusData, setStatusData] = useState({
    adharCardStatus: "pending",
    panCardStatus: "pending",
    mbbsCertificateStatus: "pending",
    pmcRegistrationStatus: "pending",
    nmrIdStatus: "pending",
    status: "active"
  });
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    axios
      .get("http://localhost:5000/api/auth/all")
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch users");
        setLoading(false);
      });
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const documentKeys = ["adharCard", "panCard", "mbbsCertificate", "pmcRegistration", "nmrId"];

  /* ---------------- HANDLERS ---------------- */

  const openEditPopup = (user) => {
    setSelectedUser(user);
    setStatusData({
      adharCardStatus: user.adharCardStatus || "pending",
      panCardStatus: user.panCardStatus || "pending",
      mbbsCertificateStatus: user.mbbsCertificateStatus || "pending",
      pmcRegistrationStatus: user.pmcRegistrationStatus || "pending",
      nmrIdStatus: user.nmrIdStatus || "pending",
      status: user.status || "active"
    });
    setEditPopupOpen(true);
  };

  const openViewPopup = (user) => {
    setSelectedUser(user);
    setViewPopupOpen(true);
  };

  const closeEditPopup = () => {
    setEditPopupOpen(false);
    setSelectedUser(null);
  };

  const closeViewPopup = () => {
    setViewPopupOpen(false);
    setSelectedUser(null);
  };

  const handleStatusChange = (field, value) => {
    setStatusData((prev) => {
      const newState = { ...prev, [field]: value };

      // Check if all documents are approved
      const allApproved = documentKeys.every((key) => {
        const statusKey = `${key}Status`;
        // If the current field being updated is this key, use the new value
        if (statusKey === field) return value === "approved";
        // Otherwise use the existing state value
        return prev[statusKey] === "approved";
      });

      // Auto-update status based on documents
      newState.status = allApproved ? "active" : "inactive";

      return newState;
    });
  };

  const updateUserStatus = () => {
    if (!selectedUser) return;
    setUpdateLoading(true);
    axios
      .put(`http://localhost:5000/api/auth/update-status/${selectedUser._id}`, statusData)
      .then((res) => {
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user._id === selectedUser._id
              ? { ...user, ...statusData }
              : user
          )
        );
        setUpdateLoading(false);
        closeEditPopup();
      })
      .catch((err) => {
        console.error(err);
        setUpdateLoading(false);
        alert("Failed to update status");
      });
  };

  const deleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      axios
        .delete(`http://localhost:5000/api/auth/delete/${userId}`)
        .then(() => {
          setUsers(prev => prev.filter(u => u._id !== userId));
        })
        .catch(err => {
          console.error(err);
          alert("Failed to delete user");
        })
    }
  }

  /* ---------------- HELPERS ---------------- */

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved": return <CheckCircle size={14} className="text-emerald-500" />;
      case "rejected": return <XCircle size={14} className="text-red-500" />;
      case "pending": return <Clock size={14} className="text-amber-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "rejected": return "bg-red-50 text-red-700 border-red-200";
      case "pending": return "bg-amber-50 text-amber-700 border-amber-200";
      default: return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const formatFileName = (path) => path ? path.split(/[\\/]/).pop() : "";

  const getFileIcon = (path) => {
    if (!path) return <File size={16} />;
    const ext = path.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png'].includes(ext)) return <FileText size={16} className="text-purple-600" />;
    if (['pdf'].includes(ext)) return <FileText size={16} className="text-red-600" />;
    return <FileText size={16} />;
  };

  return (
    <div className="min-h-screen pt-4 bg-slate-50 font-sans">
      <AdminNavbar />

      {/* EDIT POPUP */}
      {editPopupOpen && selectedUser && (
        <div className="fixed  inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900">Update Status</h2>
              <button onClick={closeEditPopup} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition">
                <XCircle size={24} />
              </button>
            </div>

            <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-emerald-600 font-bold text-lg shadow-sm border border-slate-100">
                  {selectedUser.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{selectedUser.name}</h3>
                  <p className="text-sm text-slate-500">{selectedUser.email}</p>
                </div>
              </div>

              {documentKeys.map((key) => (
                <div key={key}>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <div className="flex bg-slate-100 p-1 rounded-xl">
                    {["approved", "rejected", "pending"].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(`${key}Status`, status)}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${statusData[`${key}Status`] === status
                          ? status === "approved" ? "bg-white text-emerald-600 shadow-sm"
                            : status === "rejected" ? "bg-white text-red-600 shadow-sm"
                              : "bg-white text-amber-600 shadow-sm"
                          : "text-slate-400 hover:text-slate-600"
                          }`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button onClick={closeEditPopup} className="px-5 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-200 transition text-sm">Cancel</button>
              <button
                onClick={updateUserStatus}
                disabled={updateLoading}
                className="px-5 py-2.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition shadow-lg shadow-emerald-500/20 text-sm"
              >
                {updateLoading ? "Updating..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW POPUP */}
      {viewPopupOpen && selectedUser && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-3xl overflow-hidden border border-slate-100 max-h-[90vh] flex flex-col">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center shrink-0">
              <h2 className="text-xl font-bold text-slate-900">User Details</h2>
              <button onClick={closeViewPopup} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition">
                <XCircle size={24} />
              </button>
            </div>

            <div className="p-8 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Personal Info</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <label className="text-xs text-slate-400 font-bold block mb-1">Full Name</label>
                      <p className="font-bold text-slate-900">{selectedUser.name}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <label className="text-xs text-slate-400 font-bold block mb-1">Email Address</label>
                      <p className="font-bold text-slate-900">{selectedUser.email}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <label className="text-xs text-slate-400 font-bold block mb-1">Phone</label>
                      <p className="font-bold text-slate-900">{selectedUser.mobile || "N/A"}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Documents</h3>
                  <div className="space-y-3">
                    {documentKeys.map(key => {
                      const path = selectedUser[key];
                      const status = selectedUser[`${key}Status`] || 'pending';
                      if (!path) return null;

                      return (
                        <div key={key} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="p-2 bg-slate-50 rounded-lg shrink-0">
                              {getFileIcon(path)}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-900 truncate">{key.replace(/([A-Z])/g, ' $1')}</p>
                              <a href={`http://localhost:5050/${path}`} target="_blank" rel="noreferrer" className="text-[10px] text-emerald-600 font-bold hover:underline truncate block">View File</a>
                            </div>
                          </div>
                          <div className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${getStatusColor(status)}`}>
                            {status}
                          </div>
                        </div>
                      )
                    })}
                    {!documentKeys.some(key => selectedUser[key]) && (
                      <div className="text-slate-400 text-sm font-medium italic">No documents uploaded.</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


      <main className="pt-20 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
          <div>
            <h2 className="pt-2 text-2xl font-bold text-slate-900 tracking-tight">User Management</h2>
            <p className="text-slate-500 font-medium text-sm">Monitor and manage registered members.</p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-sm transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="animate-spin h-10 w-10 border-t-4 border-emerald-600 border-r-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">User</th>
                    <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Role</th>
                    <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Joined</th>
                    <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-slate-400 font-medium">
                        No users found matching "{searchTerm}"
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user._id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 font-bold shadow-sm">
                              {user.name ? user.name.charAt(0).toUpperCase() : <User size={18} />}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 text-sm">{user.name}</p>
                              <p className="text-xs text-slate-500">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                            Member
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${user.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                            <span className={`text-xs font-bold uppercase ${user.status === 'active' ? 'text-emerald-700' : 'text-red-700'}`}>
                              {user.status || 'Active'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openViewPopup(user)} className="p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition" title="View">
                              <Eye size={18} />
                            </button>
                            <button onClick={() => openEditPopup(user)} className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition" title="Edit">
                              <Edit size={18} />
                            </button>
                            <button onClick={() => deleteUser(user._id)} className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition" title="Delete">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default AllUsers;
