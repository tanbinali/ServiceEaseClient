import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://serviceease-pi.vercel.app/api",
});

export default apiClient;
