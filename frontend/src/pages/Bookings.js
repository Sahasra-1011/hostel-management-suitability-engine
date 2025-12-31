import { useEffect, useState } from "react";

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  // Fetch bookings (protected)
  const fetchBookings = () => {
    const token = localStorage.getItem("token");

    // If not logged in
    if (!token) {
      setBookings([]);
      setLoading(false);
      return;
    }

    fetch("https://hostel-management-suitability-engine-my7c.onrender.com/bookings", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setBookings(data);
        } else {
          setBookings([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setBookings([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Cancel booking (protected)
  const cancelBooking = async (id) => {
    try {
      setCancellingId(id);

      const token = localStorage.getItem("token");

      await fetch(`https://hostel-management-suitability-engine-my7c.onrender.com/bookings/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchBookings(); // refresh bookings list
    } catch (error) {
      alert("Failed to cancel booking");
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return <p className="loading">Loading bookings...</p>;
  }

  return (
    <div className="bookings-container">
      <h1>My Bookings</h1>

      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="bookings-grid">
          {bookings.map((booking) => (
            <div className="booking-card" key={booking._id}>
              <h3>{booking.hostelId?.name}</h3>
              <p className="city">{booking.hostelId?.city}</p>

              <p>
                <b>Price:</b> ₹{booking.hostelId?.price} / month
              </p>

              <p>
                <b>Booked on:</b>{" "}
                {new Date(booking.createdAt).toLocaleDateString()}
              </p>

              <span className="status confirmed">Confirmed</span>

              <button
                className="cancel-btn"
                onClick={() => cancelBooking(booking._id)}
                disabled={cancellingId === booking._id}
              >
                {cancellingId === booking._id
                  ? "Cancelling..."
                  : "Cancel Booking"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Bookings;
