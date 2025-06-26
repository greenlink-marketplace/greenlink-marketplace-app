import apiMarketplace from "./apiMarketplace"

export default async function getCouponList() {
  const response = await apiMarketplace.get('coupon/list/')
  return response.data
}