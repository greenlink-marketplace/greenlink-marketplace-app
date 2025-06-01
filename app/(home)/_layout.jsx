import { Stack, Tabs, useRouter } from 'expo-router'
import { Basket, BookmarkSimple, MapPin, Recycle, Ticket } from "phosphor-react-native"
import { Image, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '../../constants/Colors'
import HomeTabsIndexs from '../../constants/HomeTabsIndexs'
import { HomeTabsProvider } from '../../contexts/HomeTabsContext'
import useAuthContext from '../../hooks/useAuthContext'
import useHomeTabsContext from '../../hooks/useHomeTabsContext'

function CustomTabBarIcon({
  focused,
  name = null,
  label = false
}) {
  const TabBarIconColor = Colors.naturalLightYellow
  const TabBarIconSize = 35
  const iconProps = {
    size: TabBarIconSize,
    color: TabBarIconColor,
    weight: focused ? 'fill' : 'regular'
  }
  const labelDicionary = {
    [HomeTabsIndexs.explore]: "Explorar",
    [HomeTabsIndexs.savedItens]: "Itens Salvos",
    [HomeTabsIndexs.coupons]: "Cupons",
    [HomeTabsIndexs.historic]: "Histórico",
    [HomeTabsIndexs.locations]: "Locais"
  }

  function getIconComponent() {
    if (name == HomeTabsIndexs.explore)
      return <Basket {...iconProps} />
    if (name == HomeTabsIndexs.savedItens)
      return <BookmarkSimple {...iconProps} />
    if (name == HomeTabsIndexs.coupons)
      return <Ticket {...iconProps} />
    if (name == HomeTabsIndexs.historic)
      return <Recycle {...iconProps} />
    if (name == HomeTabsIndexs.locations)
      return <MapPin {...iconProps} />

    return null
  }


  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 10
      }}
    >
      {getIconComponent()}
      {label
        ? (
          <Text
            style={{
              fontSize: 20,
              color: Colors.naturalLightYellow,
              textDecorationLine: focused ? 'underline' : 'none'
            }}
          >
            {labelDicionary[name]}
          </Text>) : null}
    </View>
  )
}

function CustomTabBarBottom({ isVisitor }) {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarShowLabel: false,
      tabBarPosition: 'bottom',
      tabBarStyle: {
        backgroundColor: Colors.mediumGreenProfessional,
        height: 80,
      }
    }}>
      <Tabs.Screen
        name="index"
        options={{
          href: null,
          tabBarIcon: ({ focused }) => (
            <CustomTabBarIcon
              name={HomeTabsIndexs.explore}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          tabBarIcon: ({ focused }) => (
            <CustomTabBarIcon
              name={HomeTabsIndexs.explore}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="savedItens"
        options={{
          href: isVisitor
            ? null
            : '/(home)/savedItens',
          tabBarIcon: ({ focused }) => (
            <CustomTabBarIcon
              name={HomeTabsIndexs.savedItens}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="coupons"
        options={{
          href: isVisitor
            ? null
            : '/(home)/coupons',
          tabBarIcon: ({ focused }) => (
            <CustomTabBarIcon
              name={HomeTabsIndexs.coupons}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="historic"
        options={{
          href: isVisitor
            ? null
            : '/(home)/historic',
          tabBarIcon: ({ focused }) => (
            <CustomTabBarIcon
              name={HomeTabsIndexs.historic}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="locations"
        options={{
          tabBarIcon: ({ focused }) => (
            <CustomTabBarIcon
              name={HomeTabsIndexs.locations}
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  )
}

function CustomTabBarLeth({ isVisitor }) {
  const { width: widthScreen } = useWindowDimensions()
  const compressedVersion = widthScreen < 800
  const { currentScreen } = useHomeTabsContext()

  const router = useRouter()

  function goRoute(indexScreen) {
    router.replace(`/(home)/${indexScreen}`)
  }

  const buttonsValues = isVisitor
    ? [
      HomeTabsIndexs.explore,
      HomeTabsIndexs.locations
    ]
    : [
      HomeTabsIndexs.explore,
      HomeTabsIndexs.savedItens,
      HomeTabsIndexs.coupons,
      HomeTabsIndexs.historic,
      HomeTabsIndexs.locations
    ]

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.snowWhite,
        flexDirection: 'row'
      }}
    >
      <View style={{
        flex: 1,
        maxWidth: compressedVersion ? 100 : 200,
        backgroundColor: Colors.mediumGreenProfessional,
        alignItems: 'center',
        padding: 20,
        rowGap: 30
      }}>
        <Image
          source={require('@/assets/images/LogoGreenLink.png')}
          style={{
            height: 80,
            maxWidth: 310
          }}
          resizeMode='contain'
        />
        <View
          style={{
            rowGap: 10
          }}
        >
          {buttonsValues.map(item => (
            <TouchableOpacity
              key={item}
              disabled={currentScreen == item}
              onPress={() => goRoute(item)}
            >
              <CustomTabBarIcon
                name={item}
                focused={currentScreen == item}
                label={!compressedVersion}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <Stack initialRouteName={HomeTabsIndexs.explore}>
        <Stack.Screen
          name={HomeTabsIndexs.explore}
          options={{ headerShown: false }} />
        <Stack.Screen
          name={HomeTabsIndexs.savedItens}
          options={{ headerShown: false }} />
        <Stack.Screen
          name={HomeTabsIndexs.coupons}
          options={{ headerShown: false }} />
        <Stack.Screen
          name={HomeTabsIndexs.historic}
          options={{ headerShown: false }} />
        <Stack.Screen
          name={HomeTabsIndexs.locations}
          options={{ headerShown: false }} />
      </Stack>
    </SafeAreaView>
  )
}

export default function HomeLayout() {
  const { width: widthScreen } = useWindowDimensions()
  const { isVisitor } = useAuthContext()

  return (
    <HomeTabsProvider>
      {widthScreen > 600
        ? <CustomTabBarLeth isVisitor={isVisitor} />
        : <CustomTabBarBottom isVisitor={isVisitor} />
      }
    </HomeTabsProvider>
  )
}