import { Stack } from 'expo-router'

export default function StackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Oculta o cabeçalho padrão, se preferir um layout limpo
      }}
    />
  )
}
