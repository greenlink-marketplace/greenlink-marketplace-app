import api from './apiMaster'

export default function setHeaderAuthorization(token) {
  if (token) {
    // Apply token to every request
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    // Delete auth header
    delete api.defaults.headers.common['Authorization']
  }
}
