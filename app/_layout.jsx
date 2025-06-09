import { useColorScheme } from '@/hooks/useColorScheme'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import { AuthProvider } from '../contexts/AuthContext'

export default function RootLayout() {
  const colorScheme = useColorScheme()
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  })

  if (!loaded) {
    // Async font loading only occurs in development.
    return null
  }

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack initialRouteName='index'>
          {[
            "index",
            "[visitor&cosumer]/(home)",
            "login",
            "register",
            "pageNotFound",
            "pageUserRoleUnknow",
            "product",
          ].map((screen, idx) => (
            <Stack.Screen
              key={idx}
              name={screen}
              options={{ headerShown: false }} />
          ))}
        </Stack>
      </ThemeProvider>
    </AuthProvider>
  )
}