import apiMarketplace from "./apiMarketplace"

export default async function postCouponGenerate(
    product_id,
    green_credit_amount
) {
    var requestData = {
        product_id,
        green_credit_amount
    }
    console.log(requestData)
    const response = await apiMarketplace.post('coupon/generate/', requestData)
    return response.data
}
