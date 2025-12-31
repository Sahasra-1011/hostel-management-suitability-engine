import { useEffect, useState } from "react";
import { getHostels, getRecommendedHostels } from "../services/api";
import HostelCard from "../components/HostelCard";

function Home() {
  const [hostels, setHostels] = useState([]);
  const [filteredHostels, setFilteredHostels] = useState([]);

  const [city, setCity] = useState("");
  const [gender, setGender] = useState("");
  const [maxPrice, setMaxPrice] = useState(20000);

  const isLoggedIn = !!localStorage.getItem("token");

  // 🔹 Initial fetch (keeps old UI behaviour)
  useEffect(() => {
    fetchHostels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 🔹 Fetch hostels (recommended if logged in)
  const fetchHostels = async (selectedCity = "") => {
    try {
      let data;

      if (isLoggedIn) {
        data = await getRecommendedHostels();
      } else {
        data = await getHostels(selectedCity);
      }

      // City filter still respected
      if (selectedCity) {
        data = data.filter(
          (h) => h.city.toLowerCase() === selectedCity.toLowerCase()
        );
      }

      setHostels(data);
      setFilteredHostels(data);
    } catch {
      alert("Failed to load hostels");
    }
  };

  // 🔹 Apply filters (UNCHANGED LOGIC)
  const applyFilters = () => {
    let filtered = [...hostels];

    if (gender) {
      filtered = filtered.filter(
        (h) => h.gender.toLowerCase() === gender.toLowerCase()
      );
    }

    filtered = filtered.filter((h) => h.price <= maxPrice);

    setFilteredHostels(filtered);
  };

  return (
    <div className="container">
      {/* 🔍 SEARCH + FILTER UI (UNCHANGED STRUCTURE) */}
      <div className="search-box">
        <div className="HeadSection">
          <h2>Find Hostels Near You</h2>

          <div className="search-controls">
            <div className="search-box">
              {/* 🔍 Search Row */}
              <div className="search-row">
                <select
                  className="city-select"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                >
                  <option value="">All Cities</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Pune">Pune</option>
                </select>

                <button
                  className="btn-primary"
                  onClick={() => fetchHostels(city)}
                >
                  Search
                </button>
              </div>

              <br />

              {/* 🎛️ Filter Row */}
              <div className="filter-row">
                <select
                  className="filter-select"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="">All Genders</option>
                  <option value="Boys">Boys</option>
                  <option value="Girls">Girls</option>
                  <option value="Co-ed">Co-ed</option>
                </select>

                <div className="price-filter">
                  <label>Max ₹{maxPrice}</label>
                  <input
                    type="range"
                    min="3000"
                    max="20000"
                    step="500"
                    value={maxPrice}
                    onChange={(e) =>
                      setMaxPrice(Number(e.target.value))
                    }
                  />
                </div>

                <button className="btn-filter" onClick={applyFilters}>
                  Apply Filters
                </button>
              </div>

              <p className="results-count">
                {filteredHostels.length} hostel
                {filteredHostels.length !== 1 ? "s" : ""} found
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 🏠 HOSTEL GRID (UNCHANGED LOOK) */}
      <div className="hostel-grid">
        {filteredHostels.length === 0 && <p>No hostels found</p>}

        {filteredHostels.map((hostel) => (
          <HostelCard key={hostel._id} hostel={hostel} />
        ))}
      </div>
    </div>
  );
}

export default Home;
