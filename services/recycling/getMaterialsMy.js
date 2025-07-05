import apiRecycling from "./apiRecycling"

export default async function getMaterialsMy() {
  const response = await apiRecycling.get('materials/my/')
  return response.data
}