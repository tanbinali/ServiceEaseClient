import axios from "axios";

const apiClient = axios.create({
  baseURL: "serviceease-pi.vercel.app/api",
});

export default apiClient;
