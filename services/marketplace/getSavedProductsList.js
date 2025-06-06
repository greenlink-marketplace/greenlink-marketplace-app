import apiMarketplace from "./apiMarketplace"

export default async function getSavedProductsList() {
  const response = await apiMarketplace.get('saved-products/list/')
  return response.data
}