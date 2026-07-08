
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Mail,
  MapPin,
  Pencil,
  Phone
} from "lucide-react";
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

  if (loading) {
    return (
      <div className="admin-dash">
        <UsersNavbar />
        <div className="admin-dash__loading">
          <div className="admin-dash__spinner" />
          <p className="admin-dash__loading-text">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="admin-dash">
        <UsersNavbar />
        <div className="admin-dash__error">
          <p className="admin-dash__error-title">Profile not found</p>
          <p className="admin-dash__error-message">We were unable to load your workspace profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dash">
      <UsersNavbar />

      <main className="pt-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto pb-16">
        {/* ===== Profile Card ===== */}
        <div className="admin-dash__card overflow-hidden">

          {/* Top Section */}
          <div className="flex flex-col items-center py-10 bg-gradient-to-r from-indigo-600 to-purple-600 text-white relative">
            <div className="w-28 h-28 rounded-full bg-white text-indigo-600 flex items-center justify-center text-5xl font-bold shadow-lg">
              {user.name?.charAt(0).toUpperCase()}
            </div>

            <h2 className="mt-4 text-2xl font-bold">{user.name}</h2>
            <p className="text-sm opacity-90">{user.email}</p>

            <button
              className="mt-4 flex items-center gap-2 bg-white text-indigo-600 px-5 py-2.5 rounded-full font-bold hover:bg-slate-50 transition-colors shadow-md text-sm active:scale-95"
            >
              <Pencil size={16} /> Edit Profile
            </button>
          </div>

          {/* Details Section */}
          <div className="p-6 sm:p-8 divide-y divide-slate-100 bg-white">
            <ProfileRow
              icon={<Mail />}
              label="Email Address"
              value={user.email}
            />

            <ProfileRow
              icon={<Phone />}
              label="Mobile Number"
              value={user.mobile || "Not added"}
            />

            <ProfileRow
              icon={<MapPin />}
              label="Default Address"
              value={user.address || "Not added"}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

const ProfileRow = ({ icon, label, value }) => (
  <div className="flex items-center justify-between py-4 sm:py-5">
    <div className="flex items-center gap-4 text-slate-600">
      {React.cloneElement(icon, { size: 18, className: "text-indigo-500 shrink-0" })}
      <span className="font-semibold text-sm">{label}</span>
    </div>
    <span className="font-bold text-slate-800 text-sm">{value}</span>
  </div>
);

export default MyProfile;
