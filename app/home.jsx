import { useLocalSearchParams } from 'expo-router'
import { Fragment } from 'react'
import { SafeAreaView, Text } from "react-native"
import { Colors } from '../constants/Colors'

export default function HomePage(props) {
  const { userData } = useLocalSearchParams()

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.snowWhite,
        padding: 30
      }}
    >
      {Object.entries(JSON.parse(userData)).map(([key, value]) => (
        <Fragment key={key}>
          <Text>{key}</Text>
          <Text>{String(value)}</Text>
        </Fragment>
      ))}
    </SafeAreaView>
  )
}