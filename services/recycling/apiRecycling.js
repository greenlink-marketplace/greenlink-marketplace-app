import apiMaster from '../apiMaster'

const RECYCLING_ROUTE = 'recycling/'

const apiRecycling = {
  post: (endpoint, data, config) => apiMaster.post(`${RECYCLING_ROUTE}${endpoint}`, data, config),
  get: (endpoint, config) => apiMaster.get(`${RECYCLING_ROUTE}${endpoint}`, config),
  put: (endpoint, data, config) => apiMaster.put(`${RECYCLING_ROUTE}${endpoint}`, data, config),
  delete: (endpoint, config) => apiMaster.delete(`${RECYCLING_ROUTE}${endpoint}`, config),
}

export default apiRecycling