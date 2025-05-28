// frontend/utils/config.ts

export const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://plumbsched-backend.onrender.com"
    : "http://localhost:8000";
