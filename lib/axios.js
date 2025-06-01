import axios from "axios"

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://api.example.com",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // You can modify the request config here
    // For example, add auth token from localStorage (client-side only)
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // You can modify the response data here
    return response
  },
  (error) => {
    // Handle errors globally
    const { response } = error

    if (response && response.status === 401) {
      // Handle unauthorized errors
      if (typeof window !== "undefined") {
        // Redirect to login or refresh token
        console.log("Unauthorized, redirecting to login...")
        // window.location.href = '/login';
      }
    }

    return Promise.reject(error)
  },
)

export default api
