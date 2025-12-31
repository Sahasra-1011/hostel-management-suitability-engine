const BASE_URL = "http://localhost:4003";

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

  const res = await fetch("http://localhost:4003/bookings", {
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

  const res = await fetch("http://localhost:4003/hostels/recommended", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch recommendations");
  }

  return res.json();
};
