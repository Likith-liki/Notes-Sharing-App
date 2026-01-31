import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
// Add this to the authAPI object:
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  getUsers: () => api.get('/auth/users'),
  createAdmin: (adminData) => api.post('/auth/admin/create', adminData), // Add this line
}

// Notes API
export const notesAPI = {
  getNotes: () => api.get("/notes"),
  getNote: (id) => api.get(`/notes/${id}`),
  createNote: (noteData) => {
    const formData = new FormData();
    Object.keys(noteData).forEach((key) => {
      if (noteData[key] !== undefined && noteData[key] !== null) {
        formData.append(key, noteData[key]);
      }
    });
    return api.post("/notes", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  updateNote: (id, noteData) => {
    const formData = new FormData();
    Object.keys(noteData).forEach((key) => {
      if (noteData[key] !== undefined && noteData[key] !== null) {
        formData.append(key, noteData[key]);
      }
    });
    return api.put(`/notes/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  deleteNote: (id) => api.delete(`/notes/${id}`),
  downloadFile: (id) => api.get(`/notes/${id}/file`, { responseType: "blob" }),
};

export default api;
