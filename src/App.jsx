import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AddCabin from "./components/AddCabin";
import AdminDashboard from "./components/AdminDashboard";
import AdminLogin from "./components/AdminLogin";
import AdminNavbar from "./components/AdminNavbar";
import Hero from "./components/Hero";
import Login from "./components/Login";
import Register from "./components/Register";
import SpacesSection from "./components/SpaceSection";
import Spaces from "./components/Spaces";
import UsersNavbar from "./components/UsersNavbar";
// import { User } from "lucide-react";
import AdminAddCabin from "./components/AdminAddCabin";
import AllBookings from "./components/AllBookings";
import AllUsers from "./components/AllUsers";
import BookCabin from "./components/BookCabin";
import CabinDetails from "./components/CabinDetails";
import MyBookings from "./components/MyBookings";
import MyCabin from "./components/MyCabin";
import MyProfile from "./components/MyProfile";
import { AdminCabins } from "./components/AdminCabins";
import { AdminBookings } from "./components/AdminBookings";
import DoctorBookings from "./components/DoctorBookings";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/spaces" />} /> {/* redirect root */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/home" element={<Home />}></Route> */}
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
        <Route path="/mybookings" element={<MyBookings />}></Route>
        <Route path="/myprofile" element={<MyProfile />}></Route>
        <Route path="/admincabin" element={<AdminCabins />}></Route>
        <Route path="/adminbookings" element={<AdminBookings />}></Route>
        <Route path="/doctorbookings" element={<DoctorBookings />}></Route>

      </Routes>
    </Router>
  );
}

export default App;


