import apiMarketplace from "./apiMarketplace"

export default async function getProductDetail(product_id) {
    const response = await apiMarketplace.get(`products/detail/${product_id}/`)
    return response.data
}