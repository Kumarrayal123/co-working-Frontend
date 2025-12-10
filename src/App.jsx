import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import UsersNavbar from "./components/UsersNavbar";
import AddCabin from "./components/AddCabin";
import Hero from "./components/Hero";
import SpacesSection from "./components/SpaceSection";
import Spaces from "./components/Spaces";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import AdminNavbar from "./components/AdminNavbar";
// import { User } from "lucide-react";
import AllUsers from "./components/AllUsers";
import AdminAddCabin from "./components/AdminAddCabin";
import MyCabin from "./components/MyCabin";
import BookCabin from "./components/BookCabin";
import Bookings from "./components/AllBookings";
import AllBookings from "./components/AllBookings";
import CabinDetails from "./components/CabinDetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/register" />} /> {/* redirect root */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />}></Route>
        <Route path="/usernavbar" element={<UsersNavbar />}></Route>
        <Route path="/addcabin" element={<AddCabin />}></Route>
        <Route path="/hero" element={<Hero />}></Route>
        <Route path="/spacesection" element={<SpacesSection />}></Route>
        <Route path="/spaces" element={<Spaces />}></Route>
        <Route path="/adminlogin" element={<AdminLogin />}></Route>
        <Route path="/admindashboard" element={<AdminDashboard />}></Route>
        <Route path="/adminnavbar" element={<AdminNavbar />}></Route>
        <Route path="allusers" element={<AllUsers />}></Route>
        <Route path="/adminaddcabin" element={<AdminAddCabin />}></Route>
        <Route path="/mycabin" element={<MyCabin />}></Route>
        <Route path="/book/:id" element={<BookCabin />} />
        <Route path="/cabin/:id" element={<CabinDetails />} />
        <Route path="/allbookings" element={<AllBookings />}></Route>
      </Routes>
    </Router>
  );
}

export default App;


