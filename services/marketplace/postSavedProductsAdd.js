import apiMarketplace from "./apiMarketplace"

export default async function postSavedProductAdd(product_id) {
    var requestData = { product_id }
    const response = await apiMarketplace.post('saved-products/add/', requestData)
    return response.data
}