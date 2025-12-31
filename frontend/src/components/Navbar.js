import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/"); // go to home after logout
  };

  return (
    <nav className="navbar">
      {/* Brand */}
      <Link to="/" className="navbar-brand">
        HostelHub
      </Link>

      {/* Actions */}
      <div className="navbar-actions">
        {!user ? (
          <>
             
            
            {/* Disabled My Bookings */}
            <span
              className="nav-btn disabled"
              title="Login to view your bookings"
            >
              Login to view your bookings
            </span>
             <Link to="/login" className="nav-btn">
              Login
            </Link>
            

            <Link to="/signup" className="nav-btn">
              Sign Up
            </Link>
          </>
        ) : (
          <>
            <span className="nav-user">Hi, {user.name}</span>

            <Link to="/bookings" className="nav-btn primary">
              My Bookings
            </Link>

            <button className="nav-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
