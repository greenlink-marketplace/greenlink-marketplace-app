import { Redirect, useFocusEffect } from 'expo-router'
import { Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '../../constants/Colors'
import HomeTabsIndexs from '../../constants/HomeTabsIndexs'
import useAuthContext from '../../hooks/useAuthContext'
import useHomeTabsContext from '../../hooks/useHomeTabsContext'

export default function HistoricScreen() {
    const { setCurrentScreen } = useHomeTabsContext()
    const { isVisitor } = useAuthContext()

    useFocusEffect(() => {
        setCurrentScreen(HomeTabsIndexs.historic)
    })

    if (isVisitor)
        return <Redirect href={`/pageNotFound?page=${HomeTabsIndexs.historic}`} />

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
                    <Text>Pagina HISTORIC</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}
