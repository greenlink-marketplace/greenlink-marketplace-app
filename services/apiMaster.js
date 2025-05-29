import axios from 'axios'

// API base URL
export const API_BASE_URL = 'https://greenlink.app.br/api/'

// Creating an Axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10s timeout for requests
  headers: {
    'Content-Type': 'application/json',
    // you can add standard headers here, e.g. Authorization
  }
})

export default api