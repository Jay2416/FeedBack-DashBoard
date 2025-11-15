import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const api = axios.create({
  baseURL
});

export const fetchFeedbacks = () => api.get("/feedback");
export const createFeedback = (data) => api.post("/feedback", data);
export const fetchStats = () => api.get("/stats");
