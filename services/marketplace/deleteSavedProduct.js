import apiMarketplace from "./apiMarketplace"

export default async function deleteSavedProduct(product_id) {
    const response = await apiMarketplace.delete(
        `saved-products/delete/${product_id}/`
    )
    return response.data
}