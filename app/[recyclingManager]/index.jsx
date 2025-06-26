import { useRouter } from 'expo-router'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '../../constants/Colors'

const routerRoot = "[recyclingManager]/"

function MenuButton({
  label,
  screenNavigation = null
}) {
  const router = useRouter()
  const disabled = screenNavigation == null

  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={() => router.push(
        { pathname: `${routerRoot}${screenNavigation}` }
      )}
      style={[
        {
          height: 110,
          width: 'auto',
          backgroundColor: Colors.snowWhite,
          borderRadius: 10,
          padding: 10,
          justifyContent: 'center',
          alignItems: 'center'
        },
        disabled ? {
          opacity: 0.6
        } : null
      ]}>
      <Text
        style={{ fontSize: 16 }}>
        {label}</Text>
    </TouchableOpacity>
  )
}

export default function Index() {
  const menuOptions = [
    { label: "Receber Reciclagem", screenNavigation: "receiveMaterial" },
    { label: "Vender Reciclagem" }
  ]

  return (
    <SafeAreaView
      style={[
        StyleSheet.absoluteFill,
        { backgroundColor: Colors.matteNeutralGray }
      ]}>
      <View
        style={{
          flexBasis: 100,
          backgroundColor: Colors.mediumGreenProfessional,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
        <Text
          style={{
            fontSize: 22,
            fontWeight: 'bold',
            color: Colors.snowWhite
          }}>
          Gerente de Coleta</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
          gap: 10
        }}>
        {menuOptions.map((item, idx) => (
          <MenuButton
            key={idx}
            {...item}
          />
        ))}
      </View>
    </SafeAreaView>
  )
}