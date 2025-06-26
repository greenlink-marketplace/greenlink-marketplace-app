import { Stack } from "expo-router"

export default function layout({ }) {
  return (
    <Stack initialRouteName="receiveMaterial">
      <Stack.Screen
        name="index"
        options={{ headerShown: false }} />
      <Stack.Screen
        name="receiveMaterial"
        options={{ headerShown: false }} />
    </Stack>
  )
}