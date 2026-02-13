import axios from "axios";

// Configure your FastAPI backend URL here
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Optional: attach JWT token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface PredictionResult {
  result: "Phishing" | "Safe";
  confidence: number;
}

export interface HistoryEntry {
  url: string;
  result: "Phishing" | "Safe";
  confidence: number;
  timestamp: string;
}

/** POST /predict — check a URL */
export const predictURL = async (url: string): Promise<PredictionResult> => {
  const { data } = await api.post<PredictionResult>("/predict", { url });
  return data;
};

/** GET /history — fetch previously checked URLs */
export const getHistory = async (): Promise<HistoryEntry[]> => {
  const { data } = await api.get<HistoryEntry[]>("/history");
  return data;
};

/** POST /login — authenticate (optional) */
export const login = async (username: string, password: string) => {
  const { data } = await api.post("/login", { username, password });
  if (data.token) localStorage.setItem("token", data.token);
  return data;
};

export default api;
