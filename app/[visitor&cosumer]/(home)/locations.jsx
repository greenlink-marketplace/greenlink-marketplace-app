import { Colors } from '@/constants/Colors'
import HomeTabsIndexs from '@/constants/HomeTabsIndexs'
import useHomeTabsContext from '@/hooks/useHomeTabsContext'
import { useFocusEffect } from 'expo-router'
import { Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function LocationsScreen() {
    const { setCurrentScreen } = useHomeTabsContext()

    useFocusEffect(() => {
        setCurrentScreen(HomeTabsIndexs.locations)
    })

    return (
        <SafeAreaView style={[
            {
                flex: 1,
                backgroundColor: Colors.snowWhite
            },
        ]}>
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                <TouchableOpacity>
                    <Text>LOCAIS DE COLETA</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}