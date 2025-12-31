import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import HostelDetails from "./pages/HostelDetails";
import Layout from "./components/Layout";
import Bookings from "./pages/Bookings";
import Signup from "./pages/Signup";
import Login from "./pages/Login";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/hostels/:id" element={<HostelDetails />} />
          <Route path="/bookings" element={<Bookings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
