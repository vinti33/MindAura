export const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://mindaura.onrender.com"
    : "http://localhost:5000"; // replace 5000 with your local backend port