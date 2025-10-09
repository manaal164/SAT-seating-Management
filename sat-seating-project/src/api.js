import axios from "axios";

// set your backend base URL
const api = axios.create({
  baseURL: "http://localhost:5000/api", // adjust if backend runs on another port
});

export default api;
