import { Redirect, useFocusEffect } from 'expo-router'
import { Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '../../constants/Colors'
import HomeTabsIndexs from '../../constants/HomeTabsIndexs'
import useAuthContext from '../../hooks/useAuthContext'
import useHomeTabsContext from '../../hooks/useHomeTabsContext'

export default function SavedItensScreen() {
    const { setCurrentScreen } = useHomeTabsContext()
    const { isVisitor } = useAuthContext()

    useFocusEffect(() => {
        setCurrentScreen(HomeTabsIndexs.savedItens)
    })

    if (isVisitor)
        return <Redirect href={`/pageNotFound?page=${HomeTabsIndexs.savedItens}`} />

    return (
        <SafeAreaView style={[
            {
                flex: 1,
                // paddingTop: 30,
                backgroundColor: Colors.snowWhite
            },
            // Platform.OS == "web"
            //   ? {
            //     paddingTop: 0
            //   } : null
        ]}>
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                <TouchableOpacity>
                    <Text>Pagina SAVEDITENS</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}
