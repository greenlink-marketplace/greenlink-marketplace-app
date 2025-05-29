import apiMaster from '../apiMaster'

const MARKETPLACE_ROUTE = 'marketplace/'

// Função genérica para requests dentro de /accounts/
const apiMarketplace = {
  post: (endpoint, data, config) => apiMaster.post(`${MARKETPLACE_ROUTE}${endpoint}`, data, config),
  get: (endpoint, config) => apiMaster.get(`${MARKETPLACE_ROUTE}${endpoint}`, config),
  put: (endpoint, data, config) => apiMaster.put(`${MARKETPLACE_ROUTE}${endpoint}`, data, config),
  delete: (endpoint, config) => apiMaster.delete(`${MARKETPLACE_ROUTE}${endpoint}`, config),
}

export default apiMarketplace
