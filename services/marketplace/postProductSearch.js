import apiMarketplace from "./apiMarketplace"

export default async function getProductList(search_term) {
  const response = await apiMarketplace.get(
    `products/search/?search=${search_term}`
  )
  return response.data
}