import { useNavigate } from "react-router-dom";
import { bookHostel } from "../services/api";

function HostelCard({ hostel }) {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const handleBooking = async () => {
    if (!isLoggedIn) {
      alert("Login to book a hostel");
      return;
    }

    try {
      await bookHostel(hostel._id);
      alert("Booking successful");
      window.location.reload();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="hostel-card">
      {/* HEADER */}
      <div className="card-header">
        <h3>{hostel.name}</h3>
        <span className="city-badge">{hostel.city}</span>
      </div>

      <p className="address">{hostel.address}</p>

      <div className="price">
        ₹{hostel.price} <span>/ month</span>
      </div>

      <div className="tags">
        <span className="tag gender">{hostel.gender}</span>
        <span className="tag beds">
          {hostel.availableBeds} beds available
        </span>
      </div>

      {/* 🌟 ONLY SCORE ON CARD (NO REASONS) */}
      {isLoggedIn && hostel.suitability && (
        <div className="suitability-box">
          <div className="score">
            {hostel.suitability.score}% Match for You
          </div>
        </div>
      )}

      <button
        className="view-btn"
        onClick={() => navigate(`/hostels/${hostel._id}`)}
      >
        View Hostel
      </button>

      <button
        className="book-btn"
        onClick={handleBooking}
        disabled={hostel.availableBeds === 0}
      >
        {hostel.availableBeds === 0 ? "Sold Out" : "Book Now"}
      </button>
    </div>
  );
}

export default HostelCard;
