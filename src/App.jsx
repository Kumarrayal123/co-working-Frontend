import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddCabin from "./components/AddCabin";
import AdminDashboard from "./components/AdminDashboard";
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
// import { AdminCabins } from "./components/AdminCabins";
// import { AdminBookings } from "./components/AdminBookings";
import DoctorBookings from "./components/DoctorBookings";
import CabinBookings from "./components/CabinBookings";
import SiteVisit from "./components/SiteVisit";
import Dashboard from "./components/Dashboard";
import UserDashboard from "./components/UserDashboard";
import UserRoute from "./components/UserRoute";
import AdminRoute from "./components/AdminRoute";
import AdminSpaces from "./components/AdminSpaces";
import AdminCabins from "./components/AdminCabins";
import AdminBookings from "./components/AdminBookings";
import MyCabinPayments from "./components/MyCabinPayments";
import MyWallet from "./components/MyWallet";
import AllCabinPayments from "./components/AllCabinPayments";
import AllWallets from "./components/AllWallets";
import AllWithdrawals from "./components/AllWithdrawals";
import PromotionalPage from "./components/PromotionalPage";
import AllQueries from "./components/AllQueries";

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<PromotionalPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/home" element={<Home />}></Route> */}
        <Route path="/usernavbar" element={<UsersNavbar />}></Route>
        <Route path="/addcabin" element={<UserRoute><AddCabin /></UserRoute>}></Route>
        <Route path="/hero" element={<Hero />}></Route>
        <Route path="/spacesection" element={<SpacesSection />}></Route>
        <Route path="/spaces" element={<UserRoute><Spaces /></UserRoute>}></Route>
        <Route path="/adminspaces" element={<AdminRoute><AdminSpaces /></AdminRoute>}></Route>
        <Route path="/admindashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>}></Route>
        <Route path="/adminnavbar" element={<AdminNavbar />}></Route>
        <Route path="/allusers" element={<AdminRoute><AllUsers /></AdminRoute>}></Route>
        <Route path="/adminaddcabin" element={<AdminRoute><AdminAddCabin /></AdminRoute>}></Route>
        <Route path="/mycabin" element={<UserRoute><MyCabin /></UserRoute>}></Route>
        <Route path="/my-cabin-payments" element={<UserRoute><MyCabinPayments /></UserRoute>}></Route>
        <Route path="/book/:id" element={<UserRoute><BookCabin /></UserRoute>} />
        <Route path="/site-visit/:id" element={<UserRoute><SiteVisit /></UserRoute>}></Route>
        <Route path="/cabin/:id" element={<UserRoute><CabinDetails /></UserRoute>} />
        <Route path="/allbookings" element={<AdminRoute><AllBookings /></AdminRoute>}></Route>
        <Route path="/mybookings" element={<UserRoute><MyBookings /></UserRoute>}></Route>
        <Route path="/my-wallet" element={<UserRoute><MyWallet /></UserRoute>}></Route>
        <Route path="/myprofile" element={<UserRoute><MyProfile /></UserRoute>}></Route>
        {/* <Route path="/admincabin" element={<AdminRoute><AdminCabins /></AdminRoute>}></Route> */}
        <Route path="/adminbookings" element={<AdminRoute><AdminBookings /></AdminRoute>}></Route>
        {/* <Route path="/doctorbookings" element={<UserRoute><CabinBookings /></UserRoute>}></Route> */}
        <Route path="/cabin-bookings" element={<UserRoute><CabinBookings /></UserRoute>}></Route>
        <Route path="/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>}></Route>
        <Route path="/userdashboard" element={<UserRoute><UserDashboard /></UserRoute>}></Route>
        <Route path ="/admincabin" element={<AdminRoute><AdminCabins /></AdminRoute>}></Route>
        <Route path ="/cabinpayments" element={<AdminRoute><AllCabinPayments /></AdminRoute>}></Route>
        <Route path ="/userwallets" element={<AdminRoute><AllWallets /></AdminRoute>}></Route>
        <Route path ="/withdrawals" element={<AdminRoute><AllWithdrawals /></AdminRoute>}></Route>
        <Route path ="/userqueries" element={<AdminRoute><AllQueries /></AdminRoute>}></Route>
      

      </Routes>
    </Router>
  );
}

export default App;


