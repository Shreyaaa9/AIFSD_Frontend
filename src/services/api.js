// src/services/api.js - Centralized Axios API service (Q4 - MERN Integration)
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// ─── Request Interceptor: attach JWT token ────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor: handle 401 ────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ─── Complaint API Calls ──────────────────────────────
export const complaintAPI = {
  // POST /api/complaints
  addComplaint: (data) => api.post("/complaints", data),

  // GET /api/complaints
  getAllComplaints: (params) => api.get("/complaints", { params }),

  // GET /api/complaints/:id
  getComplaintById: (id) => api.get(`/complaints/${id}`),

  // PUT /api/complaints/:id
  updateStatus: (id, status) => api.put(`/complaints/${id}`, { status }),

  // DELETE /api/complaints/:id
  deleteComplaint: (id) => api.delete(`/complaints/${id}`),

  // GET /api/complaints/search?location=X
  searchByLocation: (location) =>
    api.get("/complaints/search", { params: { location } }),
};

// ─── AI API Calls ─────────────────────────────────────
export const aiAPI = {
  // POST /api/ai/analyze
  analyzeComplaint: (data) => api.post("/ai/analyze", data),

  // GET /api/ai/analysis/:id
  getAnalysis: (id) => api.get(`/ai/analysis/${id}`),
};

// ─── Auth API Calls ───────────────────────────────────
export const authAPI = {
  // POST /api/auth/register
  register: (data) => api.post("/auth/register", data),

  // POST /api/auth/login
  login: (data) => api.post("/auth/login", data),

  // GET /api/auth/profile
  getProfile: () => api.get("/auth/profile"),
};

export default api;
