import apiMaster from '../apiMaster'

const ACCOUNTS_ROUTE = 'accounts/'

// Função genérica para requests dentro de /accounts/
const apiAccounts = {
  post: (endpoint, data, config) => apiMaster.post(`${ACCOUNTS_ROUTE}${endpoint}`, data, config),
  get: (endpoint, config) => apiMaster.get(`${ACCOUNTS_ROUTE}${endpoint}`, config),
  put: (endpoint, data, config) => apiMaster.put(`${ACCOUNTS_ROUTE}${endpoint}`, data, config),
  delete: (endpoint, config) => apiMaster.delete(`${ACCOUNTS_ROUTE}${endpoint}`, config),
}

export default apiAccounts
