import axios from 'axios'

// Create an Axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  timeout: 10000, // Request timeout
  headers: {
    'Content-Type': 'application/json' // Default headers
  }
})

// Add a request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // You can modify config before the request is sent
    // For example, add an authorization token
    const token = localStorage.getItem('app_accessToken')

    if (token) {
      config.headers.Authorization = `${token}`
    }
    return config
  },
  (error) => {
    // Handle the error
    return Promise.reject(error)
  }
)

// Add a response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Handle the response data
    return response
  },
  (error) => {
    // Handle the error
    if (error.response && error.response.status === 401) {
      // For example, redirect to the login page if unauthorized
      // window.location.href = '/login';
    }
    return Promise.reject(error)
  }
)

export default apiClient
