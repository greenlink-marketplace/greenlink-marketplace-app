import apiRecycling from "./apiRecycling"

export default async function getLocations(
  latitude_max,
  latitude_min,
  longitude_max,
  longitude_min
) {
  const response = await apiRecycling.get(
    `locations/?latitude_max=${latitude_max}&latitude_min=${latitude_min}&longitude_max=${longitude_max}&longitude_min=${longitude_min}`
  )
  return response.data
}