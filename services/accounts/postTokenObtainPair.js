import apiAccounts from "./apiAccounts"

export default async function tokenObtainPair({ login, password }) {
  const response = await apiAccounts.post('token/', { login, password })
  return response.data
}
