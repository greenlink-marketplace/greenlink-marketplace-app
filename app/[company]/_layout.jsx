import { Stack } from "expo-router"

export default function layout({ }) {
  return (
    <Stack initialRouteName="index">
      <Stack.Screen
        name="index"
        options={{ headerShown: false }} />
      <Stack.Screen
        name="verifyCoupon"
        options={{ headerShown: false }} />
    </Stack>
  )
}