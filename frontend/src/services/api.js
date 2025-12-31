const BASE_URL = "https://hostel-management-suitability-engine-my7c.onrender.com";

export const getHostels = async (city = "") => {
  const url = city
    ? `${BASE_URL}/hostels?city=${city}`
    : `${BASE_URL}/hostels`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch hostels");
  }

  return response.json();
};

export default getHostels;

export const bookHostel = async (hostelId) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ hostelId }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Booking failed");
  }

  return res.json();
};

export const getRecommendedHostels = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/hostels/recommended`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch recommendations");
  }

  return res.json();
};
