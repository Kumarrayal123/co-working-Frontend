import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Building2,
  Coffee,
  Stethoscope,
  Search,
  Phone,
  MapPin,
  User,
  Calendar,
  Trash2,
  ExternalLink,
  RefreshCw,
  Eye,
  X,
  FileText,
  Briefcase,
  Layers,
  Download,
  X as XIcon,
  Ticket,
  Hash,
  Utensils,
  Edit,
  Save
} from "lucide-react";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import AdminNavbar from "./AdminNavbar";
import "./UserSiteVisits.css";

const API_URL = "https://spaceapi.iryax.com/api/surveys";

const SurveyDetails = () => {
  const navigate = useNavigate();
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [filterMonth, setFilterMonth] = useState("");
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 20 });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const formatDateDDMMYYYY = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "N/A";
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "N/A";
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const isUrl = (string) => {
    if (!string) return false;
    return string.startsWith("http://") || string.startsWith("https://") || string.startsWith("www.");
  };

  const loadSurveys = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/allsurveys`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setSurveys(data.surveys || []);
          setPagination(data.pagination || { total: 0, page: 1, limit: 20 });
        } else {
          toast.error("Failed to load surveys");
        }
      } else {
        toast.error("Failed to fetch surveys");
      }
    } catch (err) {
      console.error("Error fetching surveys:", err);
      toast.error("Error loading surveys");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSurveys();
  }, []);

  // Delete Survey
  const handleDeleteSurvey = async (idToDelete) => {
    if (!window.confirm("Are you sure you want to delete this survey?")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${idToDelete}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success("Survey deleted successfully!");
        const updated = surveys.filter((s) => s._id !== idToDelete && s.id !== idToDelete);
        setSurveys(updated);
        if (selectedSurvey && (selectedSurvey._id === idToDelete || selectedSurvey.id === idToDelete)) {
          closeViewModal();
        }
      } else {
        toast.error(result.message || "Failed to delete survey");
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Error deleting survey");
    }
  };

  // Start Edit
  const handleEditClick = (survey) => {
    setEditingId(survey._id || survey.id);
    setEditData({
      title: survey.title || survey.name || survey.spaceName || "",
      description: survey.description || "",
      noOfTables: survey.noOfTables || "",
      spaceName: survey.spaceName || survey.name || "",
      spaceType: survey.spaceType || "",
      mobileNumber: survey.mobileNumber || "",
      address: survey.address || "",
      submittedBy: survey.submittedBy || ""
    });
  };

  // Cancel Edit
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  // Save Edit
  const handleSaveEdit = async (id) => {
    try {
      const response = await fetch(`${API_URL}/updatesurvey/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editData.title,
          description: editData.description,
          noOfTables: editData.noOfTables ? parseInt(editData.noOfTables) : null,
          questions: [
            { text: `Space Type: ${editData.spaceType}`, type: 'text' },
            { text: `Mobile Number: ${editData.mobileNumber}`, type: 'text' },
            { text: `Address: ${editData.address}`, type: 'text' },
            { text: `Submitted By: ${editData.submittedBy}`, type: 'text' }
          ]
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success("Survey updated successfully!");
        const updatedSurveys = surveys.map((s) => {
          if (s._id === id || s.id === id) {
            return {
              ...s,
              title: editData.title,
              name: editData.spaceName,
              spaceName: editData.spaceName,
              spaceType: editData.spaceType,
              mobileNumber: editData.mobileNumber,
              address: editData.address,
              submittedBy: editData.submittedBy,
              noOfTables: editData.noOfTables ? parseInt(editData.noOfTables) : null,
              description: editData.description
            };
          }
          return s;
        });
        setSurveys(updatedSurveys);
        setEditingId(null);
        setEditData({});
      } else {
        toast.error(result.message || "Failed to update survey");
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Error updating survey");
    }
  };

  const handleViewSurvey = (survey) => {
    setSelectedSurvey(survey);
    setShowModal(true);
    document.body.style.overflow = "hidden";
  };

  const closeViewModal = () => {
    setShowModal(false);
    setSelectedSurvey(null);
    document.body.style.overflow = "";
  };

  const filteredSurveys = surveys.filter((item) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      (item.name || item.spaceName || item.title || "").toLowerCase().includes(search) ||
      (item.mobileNumber || "").toLowerCase().includes(search) ||
      (item.address || "").toLowerCase().includes(search) ||
      (item.submittedBy || "").toLowerCase().includes(search);

    const matchesType =
      selectedType === "all" ||
      (item.spaceType || "").toLowerCase() === selectedType.toLowerCase();

    const matchesMonth =
      !filterMonth ||
      (item.createdAt && item.createdAt.startsWith(filterMonth));

    return matchesSearch && matchesType && matchesMonth;
  });

  const totalCount = surveys.length;
  const coworkingCount = surveys.filter(
    (s) => (s.spaceType || "").toLowerCase() === "co-working"
  ).length;
  const medicalCount = surveys.filter(
    (s) => (s.spaceType || "").toLowerCase() === "medical cabin"
  ).length;
  const cafeCount = surveys.filter(
    (s) => (s.spaceType || "").toLowerCase() === "cafe"
  ).length;

  const statsCards = [
    {
      label: "Total Submissions",
      value: totalCount,
      meta: "all survey responses",
      icon: Ticket,
      color: "blue"
    },
    {
      label: "Co-Working",
      value: coworkingCount,
      meta: "co-working spaces",
      icon: Briefcase,
      color: "blue"
    },
    {
      label: "Medical Cabin",
      value: medicalCount,
      meta: "medical cabins",
      icon: Stethoscope,
      color: "green"
    },
    {
      label: "Cafe",
      value: cafeCount,
      meta: "cafes & dining",
      icon: Coffee,
      color: "amber"
    }
  ];

  const getSpaceTypeBadge = (type) => {
    const formatted = (type || "").toLowerCase();
    if (formatted === "medical cabin") {
      return {
        label: "Medical Chamber",
        color: "bg-green-100 text-green-700",
        icon: <Stethoscope size={10} />
      };
    }
    if (formatted === "cafe") {
      return {
        label: "Cafe",
        color: "bg-amber-100 text-amber-700",
        icon: <Coffee size={10} />
      };
    }
    return {
      label: "Co-Working Space",
      color: "bg-blue-100 text-blue-700",
      icon: <Briefcase size={10} />
    };
  };

  const exportToExcel = () => {
    try {
      if (filteredSurveys.length === 0) {
        toast.warning("No survey details to export");
        return;
      }
      const data = filteredSurveys.map((s, i) => ({
        "S.No": i + 1,
        "Space / Cafe Name": s.name || s.spaceName || s.title || "N/A",
        "Space Type": s.spaceType || "N/A",
        "Mobile Number": s.mobileNumber || "N/A",
        "Address": s.address || "N/A",
        "Number of Tables": s.spaceType === "cafe" ? (s.noOfTables || "N/A") : "N/A",
        "Submitted By": s.submittedBy || "N/A",
        "Created At": formatDateTime(s.createdAt)
      }));
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Survey Details");
      XLSX.writeFile(wb, `survey_details_${new Date().toISOString().split("T")[0]}.xlsx`);
      toast.success(`Exported ${filteredSurveys.length} survey details!`);
    } catch (error) {
      console.error(error);
      toast.error("Export failed");
    }
  };

  if (loading) {
    return (
      <div className="user-visits">
        <AdminNavbar />
        <main className="p-2 sm:p-4 lg:p-6">
          <div className="user-visits__loading">
            <div className="user-visits__spinner" />
            <p className="user-visits__loading-text">Loading survey details...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="user-visits">
      <AdminNavbar />

      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-wide">
              Survey <span className="text-blue-600">Details</span>
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              View and manage all space & cafe survey submissions
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={loadSurveys}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Building2 size={16} />
              New Survey
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-5">
          {statsCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">{stat.label}</span>
                <div className={`p-1 rounded-lg bg-${stat.color}-100`}>
                  <stat.icon size={12} className={`text-${stat.color}-600`} />
                </div>
              </div>
              <div className="text-xl font-semibold text-gray-800 mt-0.5">{stat.value}</div>
              <div className="text-[9px] text-gray-400 mt-0.5">{stat.meta}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-3 mb-5">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, mobile, address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-2.5 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
              >
                <option value="all">All Types</option>
                <option value="co-working">Co-Working</option>
                <option value="medical cabin">Medical Cabin</option>
                <option value="cafe">Cafe</option>
              </select>
              <button
                onClick={exportToExcel}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download size={14} />
                Export
              </button>
              {(selectedType !== "all" || searchTerm) && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedType("all");
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-sm text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <XIcon size={14} />
                  Clear
                </button>
              )}
            </div>
          </div>
          <div className="text-xs text-gray-400 mt-1.5">
            Showing {filteredSurveys.length} of {pagination.total || surveys.length} submissions
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <div className="px-3 py-2 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FileText size={14} className="text-blue-600" />
                Survey Submissions
                <span className="ml-1 px-1.5 py-0.5 text-[10px] bg-blue-100 text-blue-700 rounded-full">
                  {filteredSurveys.length}
                </span>
              </h3>
            </div>
          </div>

          {filteredSurveys.length === 0 ? (
            <div className="text-center py-10">
              <FileText size={32} className="mx-auto text-gray-300 mb-2" />
              <p className="text-sm text-gray-500">No survey details found</p>
              <button
                onClick={() => navigate("/")}
                className="mt-2 inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Building2 size={14} />
                Submit New Survey
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-3 py-1.5 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">#</th>
                    <th className="px-3 py-1.5 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-3 py-1.5 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-3 py-1.5 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Mobile</th>
                    <th className="px-3 py-1.5 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Address</th>
                    <th className="px-3 py-1.5 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Tables</th>
                    <th className="px-3 py-1.5 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">By</th>
                    <th className="px-3 py-1.5 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-3 py-1.5 text-center text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSurveys.map((s, idx) => {
                    const spaceBadge = getSpaceTypeBadge(s.spaceType);
                    const isCafe = s.spaceType === "cafe";
                    const surveyId = s._id || s.id;
                    const isEditing = editingId === surveyId;

                    return (
                      <tr key={surveyId} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="px-3 py-1.5 text-xs text-gray-400">{idx + 1}</td>
                        <td className="px-3 py-1.5">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editData.title || editData.spaceName || ""}
                              onChange={(e) => setEditData({ ...editData, title: e.target.value, spaceName: e.target.value })}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                          ) : (
                            <span className="font-medium text-gray-800">{s.name || s.spaceName || s.title || "N/A"}</span>
                          )}
                        </td>
                        <td className="px-3 py-1.5">
                          {isEditing ? (
                            <select
                              value={editData.spaceType || ""}
                              onChange={(e) => setEditData({ ...editData, spaceType: e.target.value })}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            >
                              <option value="co-working">Co-Working</option>
                              <option value="medical cabin">Medical Cabin</option>
                              <option value="cafe">Cafe</option>
                            </select>
                          ) : (
                            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-semibold rounded-full ${spaceBadge.color}`}>
                              {spaceBadge.icon}
                              {spaceBadge.label}
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-1.5">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editData.mobileNumber || ""}
                              onChange={(e) => setEditData({ ...editData, mobileNumber: e.target.value })}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                          ) : (
                            <a href={`tel:${s.mobileNumber}`} className="text-blue-600 hover:underline">
                              {s.mobileNumber || "N/A"}
                            </a>
                          )}
                        </td>
                        <td className="px-3 py-1.5">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editData.address || ""}
                              onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                          ) : (
                            isUrl(s.address) ? (
                              <a href={s.address.startsWith("http") ? s.address : `https://${s.address}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-1">
                                <MapPin size={10} />
                                View
                                <ExternalLink size={8} />
                              </a>
                            ) : (
                              <span className="text-gray-600">{s.address || "N/A"}</span>
                            )
                          )}
                        </td>
                        <td className="px-3 py-1.5">
                          {isEditing ? (
                            <input
                              type="number"
                              min="0"
                              value={editData.noOfTables || ""}
                              onChange={(e) => setEditData({ ...editData, noOfTables: e.target.value })}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                              placeholder="Tables"
                            />
                          ) : (
                            isCafe ? (
                              <span className="inline-flex items-center gap-1 text-amber-700 font-medium">
                                <Utensils size={10} />
                                {s.noOfTables || "N/A"} {s.noOfTables > 1 ? "tables" : "table"}
                              </span>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )
                          )}
                        </td>
                        <td className="px-3 py-1.5">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editData.submittedBy || ""}
                              onChange={(e) => setEditData({ ...editData, submittedBy: e.target.value })}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                          ) : (
                            <span className="flex items-center gap-1 text-gray-700">
                              <User size={10} className="text-gray-400" />
                              {s.submittedBy || "N/A"}
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-1.5 text-xs text-gray-500">
                          {formatDateDDMMYYYY(s.createdAt)}
                        </td>
                        <td className="px-3 py-1.5">
                          <div className="flex items-center justify-center gap-1">
                            {isEditing ? (
                              <>
                                <button
                                  onClick={() => handleSaveEdit(surveyId)}
                                  className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                                  title="Save"
                                >
                                  <Save size={13} />
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                  title="Cancel"
                                >
                                  <X size={13} />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleViewSurvey(s)}
                                  className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                  title="View"
                                >
                                  <Eye size={13} />
                                </button>
                                <button
                                  onClick={() => handleEditClick(s)}
                                  className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                                  title="Edit"
                                >
                                  <Edit size={13} />
                                </button>
                                <button
                                  onClick={() => handleDeleteSurvey(surveyId)}
                                  className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-[9px] text-gray-400 mt-4">
          © IRYAX SPACE — All Rights Reserved
        </div>
      </main>

      {/* View Modal */}
      {showModal && selectedSurvey && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={closeViewModal}
        >
          <div
            className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold">Survey Details</h3>
                <p className="text-sm text-blue-200 font-light">#{String(selectedSurvey._id || selectedSurvey.id).slice(-8).toUpperCase()}</p>
              </div>
              <button
                onClick={closeViewModal}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-2.5 bg-gray-50 rounded-lg">
                  <p className="text-[9px] font-semibold text-gray-400 uppercase">Name</p>
                  <p className="font-semibold text-gray-800">{selectedSurvey.name || selectedSurvey.spaceName || selectedSurvey.title || "N/A"}</p>
                </div>
                <div className="p-2.5 bg-blue-50 rounded-lg">
                  <p className="text-[9px] font-semibold text-blue-600 uppercase">Type</p>
                  <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold rounded-full ${getSpaceTypeBadge(selectedSurvey.spaceType).color}`}>
                    {getSpaceTypeBadge(selectedSurvey.spaceType).icon}
                    {getSpaceTypeBadge(selectedSurvey.spaceType).label}
                  </span>
                </div>
              </div>

              {selectedSurvey.spaceType === "cafe" && (
                <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-[9px] font-semibold text-amber-600 uppercase flex items-center gap-1">
                    <Utensils size={10} /> Tables
                  </p>
                  <p className="font-semibold text-amber-800">
                    {selectedSurvey.noOfTables || "N/A"} {selectedSurvey.noOfTables > 1 ? "tables" : "table"}
                  </p>
                </div>
              )}

              <div className="p-2.5 bg-blue-50 rounded-lg">
                <p className="text-[9px] font-semibold text-blue-600 uppercase flex items-center gap-1">
                  <User size={10} /> Submitter
                </p>
                <div className="grid grid-cols-2 gap-2 mt-0.5">
                  <div>
                    <p className="text-[9px] text-gray-500">Name</p>
                    <p className="font-semibold">{selectedSurvey.submittedBy || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-500">Mobile</p>
                    <a href={`tel:${selectedSurvey.mobileNumber}`} className="font-semibold text-blue-600 hover:underline">
                      {selectedSurvey.mobileNumber || "N/A"}
                    </a>
                  </div>
                </div>
              </div>

              <div className="p-2.5 bg-gray-50 rounded-lg">
                <p className="text-[9px] font-semibold text-gray-400 uppercase flex items-center gap-1">
                  <MapPin size={10} /> Address
                </p>
                {isUrl(selectedSurvey.address) ? (
                  <a href={selectedSurvey.address.startsWith("http") ? selectedSurvey.address : `https://${selectedSurvey.address}`} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 hover:underline inline-flex items-center gap-1">
                    {selectedSurvey.address}
                    <ExternalLink size={10} />
                  </a>
                ) : (
                  <p className="font-semibold text-gray-800">{selectedSurvey.address || "N/A"}</p>
                )}
              </div>

              <div className="p-2.5 bg-gray-50 rounded-lg">
                <p className="text-[9px] font-semibold text-gray-400 uppercase flex items-center gap-1">
                  <Calendar size={10} /> Submitted On
                </p>
                <p className="font-semibold text-gray-800">{formatDateTime(selectedSurvey.createdAt)}</p>
              </div>

              <button
                onClick={closeViewModal}
                className="w-full py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SurveyDetails;