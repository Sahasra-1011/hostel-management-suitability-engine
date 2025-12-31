import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { bookHostel } from "../services/api";
import "leaflet/dist/leaflet.css";

function HostelDetails() {
  const { id } = useParams();
  const [hostel, setHostel] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`https://hostel-management-suitability-engine-my7c.onrender.com/hostels/${id}`)
      .then((res) => res.json())
      .then((data) => setHostel(data));
  }, [id]);

  const handleBooking = async () => {
    // ✅ LOGIN CHECK FIRST
    if (!localStorage.getItem("token")) {
      alert("Please login to book a hostel");
      return;
    }

    try {
      setLoading(true);
      await bookHostel(hostel._id);
      alert("Booking successful");
      window.location.reload();
    } catch (error) {
      alert(error.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  if (!hostel) {
    return <p className="loading">Loading hostel details...</p>;
  }

  const position = hostel.location
    ? [hostel.location.lat, hostel.location.lng]
    : [17.385, 78.4867]; // fallback (Hyderabad)

  return (
    <div className="details-container">
      {/* Header */}
      <div className="details-header">
        <h1>{hostel.name}</h1>
        <span className="city-badge">{hostel.city}</span>
      </div>

      <p className="details-address">{hostel.address}</p>

      {/* Info Grid */}
      <div className="info-grid">
        <div className="info-card">
          <h2>Pricing & Stay</h2>
          <p className="price-big">₹{hostel.price} / month</p>
          <p><b>Gender:</b> {hostel.gender}</p>
          <p><b>Check-in:</b> {hostel.checkInTime}</p>
          <p><b>Check-out:</b> {hostel.checkOutTime}</p>
        </div>

        <div className="info-card">
          <h2>Facilities & Availability</h2>
          <p><b>Total Beds:</b> {hostel.totalBeds}</p>
          <p><b>Available Beds:</b> {hostel.availableBeds}</p>
          <ul className="facility-list">
            {hostel.facilities?.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Owner */}
      <div className="section-card">
        <h2>Owner Contact</h2>
        <p><b>Name:</b> {hostel.ownerName}</p>
        <p><b>Phone:</b> {hostel.phone}</p>
      </div>

      {/* Food Menu */}
      <div className="section-card">
        <h2>Weekly Food Menu</h2>
        <div className="food-menu">
          {hostel.foodMenu &&
            Object.entries(hostel.foodMenu).map(([day, meal]) => (
              <div key={day} className="food-day-card">
                <div className="food-day">{day}</div>
                <div className="food-meal">{meal}</div>
              </div>
            ))}
        </div>
      </div>

      {/* Rules */}
      <div className="section-card">
        <h2>House Rules</h2>
        <ul className="rules-list">
          {hostel.rules?.map((rule, i) => (
            <li key={i}>{rule}</li>
          ))}
        </ul>
      </div>

      {/* Images */}
      {hostel.images?.length > 0 && (
        <div className="section-card">
          <h2>Property Images</h2>
          <div className="image-strip">
            {hostel.images.map((img, i) => (
              <img key={i} src={img} alt="hostel" />
            ))}
          </div>
        </div>
      )}

      {/* Map */}
      <div className="section-card">
        <h2>Location</h2>
        <MapContainer
          center={position}
          zoom={14}
          style={{ height: "320px", width: "100%", borderRadius: "12px" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={position}>
            <Popup>{hostel.name}</Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* Booking CTA */}
      <div className="booking-cta">
        <button
          className="book-btn large"
          onClick={handleBooking}
          disabled={hostel.availableBeds === 0 || loading}
        >
          {hostel.availableBeds === 0
            ? "No Beds Available"
            : loading
            ? "Booking..."
            : "Book This Hostel"}
        </button>
      </div>
    </div>
  );
}

export default HostelDetails;