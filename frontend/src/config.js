// Backend API URL - Update this based on your environment
// Default to port 5001 because the backend dev server may run there locally
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

export default API_BASE_URL;
export const API_BASE = "http://localhost:5001";
