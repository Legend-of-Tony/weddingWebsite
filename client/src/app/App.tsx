import { Routes, Route } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import Hero from "../features/hero/Hero";
import Map from "../features/map/Map";
import Rsvp from "../features/rsvpForm/Rsvp";
//import Donation from "../features/donation/Donation";

// NEW pages
import AdminLogin from "../features/login/AdminLogin";
import AdminGuests from "../features/login/AdminGuests";
import ProtectedRoute from "../features/login/ProtectedRoute";

const HomePage = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <Map />

      <Rsvp />
    </>
  );
};

const App = () => {
  return (
    <Routes>
      {/* MAIN WEBSITE */}
      <Route path="/" element={<HomePage />} />

      {/* ADMIN LOGIN */}
      <Route path="/admin" element={<AdminLogin />} />

      {/* PROTECTED DASHBOARD */}
      <Route
        path="/admin/guests"
        element={
          <ProtectedRoute>
            <AdminGuests />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;

