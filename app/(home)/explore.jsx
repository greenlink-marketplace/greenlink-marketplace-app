import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router'
import { SignIn, SignOut } from 'phosphor-react-native'
import { Image, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '../../constants/Colors'
import HomeTabsIndexs from '../../constants/HomeTabsIndexs'
import useAuthContext from '../../hooks/useAuthContext'
import useHomeTabsContext from '../../hooks/useHomeTabsContext'

export default function ExploreScreen() {
    const router = useRouter()
    const { width: widthScreen } = useWindowDimensions()
    const routeParams = useLocalSearchParams()
    const { setCurrentScreen } = useHomeTabsContext()
    const { tokenAcess, cleanCredetials } = useAuthContext()

    useFocusEffect(() => {
        // console.log('Hello, Im focused!')
        setCurrentScreen(HomeTabsIndexs.explore)
        // if ('setScreen' in routeParams)
        //     console.log(routeParams.setScreen)
        // useCallback(() => {
        //     console.log('Hello, Im focused!')
        //     return () => {
        //         console.log('This route is now unfocused.');
        //     }
        // }, [])
    })

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
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 5,
                    rowGap: 10
                }}
            >
                {widthScreen <= 600
                    ? (<Image
                        source={require('@/assets/images/LogoGreenLink.png')}
                        style={{
                            height: 80,
                            width: 80,
                        }}
                        resizeMode='contain'
                    />) : null}
                <View style={{
                    height: 50,
                    flex: 1,
                    backgroundColor: Colors.matteNeutralGray,
                    paddingVertical: 10,
                    paddingHorizontal: 20
                }}>
                    <TextInput
                        style={{
                            fontSize: 20
                        }}
                        placeholder="Buscar Produtos..."
                    />
                </View>
                <TouchableOpacity
                    onPress={() => {
                        if (tokenAcess) {
                            cleanCredetials()
                            router.replace("/(home)")
                        } else
                            router.push("/login")
                    }}
                >
                    {tokenAcess
                        ? (
                            <SignOut
                                color={Colors.sustainableTerracottaRed}
                                size={50}
                            />
                        ) : (
                            <SignIn
                                color={Colors.mediumGreenProfessional}
                                size={50}
                            />
                        )}
                </TouchableOpacity>
            </View>
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                <TouchableOpacity>
                    <Text>EXPLORAR PRODUTOS</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}