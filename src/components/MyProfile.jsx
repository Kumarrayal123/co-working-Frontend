import axios from "axios";
import {
    Mail,
    MapPin,
    Pencil,
    Phone
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UsersNavbar from "./UsersNavbar";

const MyProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data.user))
      .catch(() => {
        localStorage.clear();
        navigate("/login");
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) return <p className="text-center mt-40">Loading...</p>;
  if (!user) return <p className="text-center mt-40">Profile not found</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      <UsersNavbar />

      <div className="max-w-4xl mx-auto pt-28 px-4">
        {/* ===== Profile Card ===== */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">

          {/* Top Section */}
          <div className="flex flex-col items-center py-10 bg-gradient-to-r from-emerald-600 to-green-500 text-white">
            <div className="w-28 h-28 rounded-full bg-white text-emerald-600 flex items-center justify-center text-5xl font-bold">
              {user.name?.charAt(0).toUpperCase()}
            </div>

            <h2 className="mt-4 text-2xl font-bold">{user.name}</h2>
            <p className="text-sm opacity-90">{user.email}</p>

            <button
              className="mt-4 flex items-center gap-2 bg-white text-emerald-600 px-4 py-2 rounded-full font-semibold hover:bg-gray-100"
            >
              <Pencil size={16} /> Edit Profile
            </button>
          </div>

          {/* Details Section */}
          <div className="p-6 divide-y">
            <ProfileRow
              icon={<Mail />}
              label="Email"
              value={user.email}
            />

            <ProfileRow
              icon={<Phone />}
              label="Mobile"
              value={user.mobile || "Not added"}
            />

            <ProfileRow
              icon={<MapPin />}
              label="Address"
              value={user.address || "Not added"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileRow = ({ icon, label, value }) => (
  <div className="flex items-center justify-between py-4">
    <div className="flex items-center gap-4 text-gray-600">
      {icon}
      <span className="font-medium">{label}</span>
    </div>
    <span className="font-semibold text-gray-800">{value}</span>
  </div>
);

export default MyProfile;
