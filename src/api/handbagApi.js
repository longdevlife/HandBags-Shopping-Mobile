import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://697ff57c6570ee87d50dde43.mockapi.io/handbags",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error(
        `[API Error]
      ${error.response.status}:`,
        error.response.data,
      );
    } else if (error.request) {
      console.error(`[Network Error]: No response      
      received`);
    } else {
      console.error(`[Error]:`, error.message);
    }
    return Promise.reject(error);
  },
);

export const getHandbags = async () => {
  try {
    const response = await apiClient.get("/handbags");
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error server ::", error.response.status);
    } else if (error.request) {
      console.error("Connected error", error.request);
    } else {
      console.error("error code:", error.message);
    }

    return [];
  }
};
