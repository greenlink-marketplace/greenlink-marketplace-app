import apiMarketplace from "./apiMarketplace"

export default async function getProductSearch(search_term) {
  const response = await apiMarketplace.get(
    `products/search/?search=${search_term}`
  )
  return response.data
}