import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "./AdminNavbar";
import { Search, FileText, Download, User, Edit, Trash2, CheckCircle, XCircle, Clock, Eye, File } from "lucide-react";

function AllUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editPopupOpen, setEditPopupOpen] = useState(false);
  const [viewPopupOpen, setViewPopupOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
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

  const openEditPopup = (user) => {
    setSelectedUser(user);
    // Pre-fill status data from user or set defaults
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
    setStatusData({
      adharCardStatus: "pending",
      panCardStatus: "pending",
      mbbsCertificateStatus: "pending",
      pmcRegistrationStatus: "pending",
      nmrIdStatus: "pending",
      status: "active"
    });
  };

  const closeViewPopup = () => {
    setViewPopupOpen(false);
    setSelectedUser(null);
  };

  const handleStatusChange = (field, value) => {
    setStatusData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateUserStatus = () => {
    if (!selectedUser) return;
    
    setUpdateLoading(true);
    axios
      .put(`http://localhost:5000/api/auth/update-status/${selectedUser._id}`, statusData)
      .then((res) => {
        // Update local state
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user._id === selectedUser._id 
              ? { ...user, ...statusData }
              : user
          )
        );
        setUpdateLoading(false);
        closeEditPopup();
        alert("User status updated successfully!");
      })
      .catch((err) => {
        console.error(err);
        setUpdateLoading(false);
        alert("Failed to update user status");
      });
  };

  const deleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      axios
        .delete(`http://localhost:5000/api/auth/delete/${userId}`)
        .then(() => {
          // Remove from local state
          setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
          alert("User deleted successfully!");
        })
        .catch((err) => {
          console.error(err);
          alert("Failed to delete user");
        });
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "approved":
        return <CheckCircle size={14} className="text-green-500" />;
      case "rejected":
        return <XCircle size={14} className="text-red-500" />;
      case "pending":
        return <Clock size={14} className="text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "approved":
        return "bg-green-50 text-green-700 border-green-200";
      case "rejected":
        return "bg-red-50 text-red-700 border-red-200";
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const formatFileName = (path) => {
    if (!path) return "";
    const parts = path.split(/[\\/]/);
    return parts[parts.length - 1];
  };

  const getFileIcon = (path) => {
    if (!path) return <File size={16} />;
    const ext = path.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'].includes(ext)) {
      return <FileText size={16} className="text-purple-600" />;
    } else if (['pdf'].includes(ext)) {
      return <FileText size={16} className="text-red-600" />;
    } else if (['doc', 'docx'].includes(ext)) {
      return <FileText size={16} className="text-blue-600" />;
    }
    return <FileText size={16} />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />

      {/* Edit Status Popup - No overlay, just the popup */}
      {editPopupOpen && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-200">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Update User Status</h2>
                <button
                  onClick={closeEditPopup}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  &times;
                </button>
              </div>

              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
                    {selectedUser.name ? selectedUser.name.charAt(0).toUpperCase() : <User size={24} />}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{selectedUser.name}</div>
                    <div className="text-sm text-gray-500">{selectedUser.email}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aadhar Card Status
                  </label>
                  <div className="flex gap-2">
                    {["approved", "rejected", "pending"].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange("adharCardStatus", status)}
                        className={`flex-1 py-2 px-4 rounded-lg border text-sm font-medium transition-colors ${
                          statusData.adharCardStatus === status
                            ? getStatusColor(status)
                            : "bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200"
                        }`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PAN Card Status
                  </label>
                  <div className="flex gap-2">
                    {["approved", "rejected", "pending"].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange("panCardStatus", status)}
                        className={`flex-1 py-2 px-4 rounded-lg border text-sm font-medium transition-colors ${
                          statusData.panCardStatus === status
                            ? getStatusColor(status)
                            : "bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200"
                        }`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    MBBS Certificate Status
                  </label>
                  <div className="flex gap-2">
                    {["approved", "rejected", "pending"].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange("mbbsCertificateStatus", status)}
                        className={`flex-1 py-2 px-4 rounded-lg border text-sm font-medium transition-colors ${
                          statusData.mbbsCertificateStatus === status
                            ? getStatusColor(status)
                            : "bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200"
                        }`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PMC Registration Status
                  </label>
                  <div className="flex gap-2">
                    {["approved", "rejected", "pending"].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange("pmcRegistrationStatus", status)}
                        className={`flex-1 py-2 px-4 rounded-lg border text-sm font-medium transition-colors ${
                          statusData.pmcRegistrationStatus === status
                            ? getStatusColor(status)
                            : "bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200"
                        }`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    NMR ID Status
                  </label>
                  <div className="flex gap-2">
                    {["approved", "rejected", "pending"].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange("nmrIdStatus", status)}
                        className={`flex-1 py-2 px-4 rounded-lg border text-sm font-medium transition-colors ${
                          statusData.nmrIdStatus === status
                            ? getStatusColor(status)
                            : "bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200"
                        }`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    User Status
                  </label>
                  <div className="flex gap-2">
                    {["active", "inactive", "suspended"].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange("status", status)}
                        className={`flex-1 py-2 px-4 rounded-lg border text-sm font-medium transition-colors ${
                          statusData.status === status
                            ? status === "active"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : status === "inactive"
                              ? "bg-gray-50 text-gray-700 border-gray-200"
                              : "bg-red-50 text-red-700 border-red-200"
                            : "bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200"
                        }`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button
                  onClick={closeEditPopup}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  disabled={updateLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={updateUserStatus}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={updateLoading}
                >
                  {updateLoading ? "Updating..." : "Update Status"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View User Details Popup - No overlay, just the popup */}
      {viewPopupOpen && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
                <button
                  onClick={closeViewPopup}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  &times;
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* User Information */}
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <User size={18} />
                      Personal Information
                    </h3>
                    <div className="space-y-2">
                      <div>
                        <label className="text-sm text-gray-500">Full Name</label>
                        <p className="font-medium">{selectedUser.name || "Not provided"}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Email</label>
                        <p className="font-medium">{selectedUser.email}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Mobile</label>
                        <p className="font-medium">{selectedUser.mobile || "Not provided"}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Address</label>
                        <p className="font-medium">{selectedUser.address || "Not provided"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-3">Account Status</h3>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        selectedUser.status === "active" 
                          ? "bg-green-100 text-green-800"
                          : selectedUser.status === "inactive"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {selectedUser.status || "active"}
                      </span>
                      <span className="text-sm text-gray-500">
                        Joined on {new Date(selectedUser.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Documents Section */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <FileText size={18} />
                    Documents
                  </h3>
                  <div className="space-y-3">
                    {documentKeys.map((key) => {
                      const documentPath = selectedUser[key];
                      const documentStatus = selectedUser[`${key}Status`] || "pending";
                      
                      if (!documentPath) return null;
                      
                      const fileName = formatFileName(documentPath);
                      const fileUrl = `http://localhost:5000/${documentPath.replace(/\\/g, "/")}`;
                      const isImage = fileName.match(/\.(jpg|jpeg|png|gif|bmp|svg)$/i);
                      
                      return (
                        <div key={key} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                          <div className="flex items-center gap-3">
                            {getFileIcon(fileName)}
                            <div>
                              <div className="font-medium text-gray-900">
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                              </div>
                              <div className="text-xs text-gray-500 truncate max-w-[150px]">
                                {fileName}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(documentStatus)}`}>
                              {documentStatus}
                            </span>
                            <div className="flex gap-1">
                              {isImage ? (
                                <a
                                  href={fileUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                  title="View Document"
                                >
                                  <Eye size={16} />
                                </a>
                              ) : (
                                <a
                                  href={fileUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-1.5 text-purple-600 hover:bg-purple-50 rounded transition-colors"
                                  title="View Document"
                                >
                                  <Eye size={16} />
                                </a>
                              )}
                              <a
                                href={fileUrl}
                                download
                                className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                                title="Download Document"
                              >
                                <Download size={16} />
                              </a>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    
                    {!documentKeys.some(key => selectedUser[key]) && (
                      <div className="text-center py-4 text-gray-400">
                        No documents uploaded
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Document Status Summary */}
              <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-3">Document Status Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {documentKeys.map((key) => {
                    const status = selectedUser[`${key}Status`] || "pending";
                    return (
                      <div key={key} className="text-center">
                        <div className={`px-3 py-2 rounded-lg ${getStatusColor(status)}`}>
                          <div className="font-medium text-sm">
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                          </div>
                          <div className="text-xs mt-1 capitalize">{status}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={closeViewPopup}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                    <th className="px-6 py-4">Documents Status</th>
                    <th className="px-6 py-4">User Status</th>
                    <th className="px-6 py-4">Joined On</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-gray-400">
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
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1">
                              {getStatusIcon(u.adharCardStatus || "pending")}
                              <span className={`text-xs px-2 py-1 rounded ${getStatusColor(u.adharCardStatus || "pending")}`}>
                                Aadhar: {u.adharCardStatus || "pending"}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(u.panCardStatus || "pending")}
                              <span className={`text-xs px-2 py-1 rounded ${getStatusColor(u.panCardStatus || "pending")}`}>
                                PAN: {u.panCardStatus || "pending"}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(u.mbbsCertificateStatus || "pending")}
                              <span className={`text-xs px-2 py-1 rounded ${getStatusColor(u.mbbsCertificateStatus || "pending")}`}>
                                MBBS: {u.mbbsCertificateStatus || "pending"}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            u.status === "active" 
                              ? "bg-green-100 text-green-800"
                              : u.status === "inactive"
                              ? "bg-gray-100 text-gray-800"
                              : "bg-red-100 text-red-800"
                          }`}>
                            {u.status || "active"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(u.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openViewPopup(u)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => openEditPopup(u)}
                              className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                              title="Edit Status"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => deleteUser(u._id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete User"
                            >
                              <Trash2 size={16} />
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
      </div>
    </div>
  );
}

export default AllUsers;