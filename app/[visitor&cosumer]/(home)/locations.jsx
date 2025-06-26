import { Colors } from '@/constants/Colors'
import HomeTabsIndexs from '@/constants/HomeTabsIndexs'
import useHomeTabsContext from '@/hooks/useHomeTabsContext'
import * as Location from 'expo-location'
import { Redirect, useFocusEffect } from 'expo-router'
import { useEffect, useState } from 'react'
import { Alert, Platform, StyleSheet, View } from 'react-native'
// import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function LocationsScreen() {
  const { setCurrentScreen } = useHomeTabsContext()
  const [region, setRegion] = useState(null)
  const [makersLocation, setMakersLocation] = useState([])

  async function handleLocations(LLParams) {
    const {
      latitude, latitudeDelta,
      longitude, longitudeDelta
    } = LLParams

    console.log(latitude, longitude)

    // const minCurrentLatitude = latitude - (latitudeDelta / 2)
    // const maxCurrentLatitude = latitude + (latitudeDelta / 2)
    // const minCurrentLongitude = longitude - (longitudeDelta / 2)
    // const maxCurrentLongitude = longitude + (longitudeDelta / 2)
    const minCurrentLatitude = Math.trunc(latitude * 10) / 10
    const maxCurrentLatitude = minCurrentLatitude - 0.1
    const minCurrentLongitude = Math.trunc(longitude * 10) / 10
    const maxCurrentLongitude = minCurrentLongitude - 0.1

    // Request body
    // {
    //   latidude: {
    //     min: int,
    //     max: int
    //   },
    //   longitude: {
    //     min: int,
    //     max: int
    //   }
    // }
    const requestData = {
      latitude: {
        min: minCurrentLatitude,
        max: maxCurrentLatitude
      },
      longitude: {
        min: minCurrentLongitude,
        max: maxCurrentLongitude
      }
    }


    const numbersMarks = 20 + Math.random() * 10
    const newArrayMarks = []

    const tamLat = (requestData.latitude.max - requestData.latitude.min)
    const tamLon = (requestData.longitude.max - requestData.longitude.min)


    for (var i = 0; i <= numbersMarks; i++) {
      const newLatitude = requestData.latitude.min + tamLat * Math.random()
      const newLongitude = requestData.longitude.min + tamLon * Math.random()
      newArrayMarks.push({ latitude: newLatitude, longitude: newLongitude })
    }

    console.log(newArrayMarks)
    setMakersLocation(newArrayMarks)
  }

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Permita o acesso à localização nas configurações do app.')
        return
      }

      const loc = await Location.getCurrentPositionAsync({})
      const { latitude, longitude } = loc.coords

      // setLocation(loc)
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      })
    })()
  }, [])


  useFocusEffect(() => {
    setCurrentScreen(HomeTabsIndexs.locations)
  })

  if (Platform.OS=="web")
    return (
      <Redirect
        href={`/pageNotFound?page=${HomeTabsIndexs.locations}`} />
    )

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
        {/*
        TODO: Deve-se, posteriormente configurar a chave da
         API do GOOGLE MAPS (obtida no Google Cloud Console).
        {
          "expo": {
            "android": {
              "config": {
                "googleMaps": {
                  "apiKey": "<SUA_CHAVE_AQUI>"
                }
              }
            }
          }
        }*/}
        <MapView
          provider={PROVIDER_GOOGLE}
          style={StyleSheet.absoluteFill}
          region={region}
          // region={{
          //   latitude: -4.567755968419118,
          //   longitude: -37.79194833868672,
          //   latitudeDelta: 0.005,
          //   longitudeDelta: 0.005
          // }}
          // initialRegion={{
          //   // -4.567755968419118, -37.79194833868672
          //   latitude: -4.567755968419118,
          //   longitude: -37.79194833868672,
          //   latitudeDelta: 0.005,
          //   longitudeDelta: 0.005
          // }}
          zoomEnabled={false}
          // zom
          // onRegionChangeComplete={props => {
          //   console.log(props)
          // }}
          // onRegionChangeComplete={() => handleLocations()}
          onRegionChangeComplete={props => {
            if (makersLocation.length == 0)
              handleLocations(props)
          }}
          // region={{
          //   latitude: -4.567755968419118,
          //   longitude: -37.79194833868672,
          //   latitudeDelta: 0.005,
          //   longitudeDelta: 0.005
          // }}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          {makersLocation.map(({ latitude, longitude }, idx) => (
            <Marker
              key={idx}
              coordinate={{
                latitude: latitude,
                longitude: longitude
              }} />
          ))}
          {/* <Marker
            coordinate={{
              latitude: -4.6,
              longitude: -37.78
            }} /> */}
          {/* <Marker
            coordinate={{
              latitude: -4.5,
              longitude: -37.75
            }} />
          <Marker
            coordinate={{
              latitude: -4.6,
              longitude: -37.8
            }} /> */}
          {/* {location && (
                        <Marker
                            coordinate={{
                                latitude: location.coords.latitude,
                                longitude: location.coords.longitude
                            }}
                            title="Você está aqui"
                        />
                    )} */}
        </MapView>
      </View>
    </SafeAreaView>
  )
}