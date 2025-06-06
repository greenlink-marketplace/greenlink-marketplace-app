import apiMarketplace from "./apiMarketplace"

export default async function getProductList() {
  const response = await apiMarketplace.get('products/list/')
  return response.data
}