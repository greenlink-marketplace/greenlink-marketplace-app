import apiMarketplace from "./apiMarketplace"

export default async function getConsumerRetreve(product_id) {
    const response = await apiMarketplace.get(`consumer/me/`)
    return response.data
}