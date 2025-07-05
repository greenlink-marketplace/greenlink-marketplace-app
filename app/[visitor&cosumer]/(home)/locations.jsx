import { Colors } from '@/constants/Colors'
import HomeTabsIndexs from '@/constants/HomeTabsIndexs'
import useHomeTabsContext from '@/hooks/useHomeTabsContext'
import * as Location from 'expo-location'
import { Redirect, useFocusEffect, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { Alert, Button, Modal, Platform, StyleSheet, Text, View } from 'react-native'
// import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import { SafeAreaView } from 'react-native-safe-area-context'
import getLocations from '../../../services/recycling/getLocations'

// conditional imports
let MapView, Marker, PROVIDER_GOOGLE;

// if (Platform.OS !== 'web') {
//   console.log('Importing react-native-maps for mobile platforms')
//   const Maps = require('react-native-maps');
//   MapView = Maps.default;
//   Marker = Maps.Marker;
//   PROVIDER_GOOGLE = Maps.PROVIDER_GOOGLE;
// }

export default function LocationsScreen() {
  const router = useRouter()
  const { setCurrentScreen } = useHomeTabsContext()
  const [region, setRegion] = useState(null)
  const [makersLocation, setMakersLocation] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [locationInfo, setLocationInfo] = useState(null)

  // async function handleLocations(LLParams) {
  //   const {
  //     latitude, latitudeDelta,
  //     longitude, longitudeDelta
  //   } = LLParams

  //   console.log(latitude, longitude)

  //   // const minCurrentLatitude = latitude - (latitudeDelta / 2)
  //   // const maxCurrentLatitude = latitude + (latitudeDelta / 2)
  //   // const minCurrentLongitude = longitude - (longitudeDelta / 2)
  //   // const maxCurrentLongitude = longitude + (longitudeDelta / 2)
  //   const minCurrentLatitude = Math.trunc(latitude * 10) / 10
  //   const maxCurrentLatitude = minCurrentLatitude - 0.1
  //   const minCurrentLongitude = Math.trunc(longitude * 10) / 10
  //   const maxCurrentLongitude = minCurrentLongitude - 0.1

  //   // Request body
  //   // {
  //   //   latidude: {
  //   //     min: int,
  //   //     max: int
  //   //   },
  //   //   longitude: {
  //   //     min: int,
  //   //     max: int
  //   //   }
  //   // }
  //   const requestData = {
  //     latitude: {
  //       min: minCurrentLatitude,
  //       max: maxCurrentLatitude
  //     },
  //     longitude: {
  //       min: minCurrentLongitude,
  //       max: maxCurrentLongitude
  //     }
  //   }


  //   const numbersMarks = 20 + Math.random() * 10
  //   const newArrayMarks = []

  //   const tamLat = (requestData.latitude.max - requestData.latitude.min)
  //   const tamLon = (requestData.longitude.max - requestData.longitude.min)


  //   for (var i = 0; i <= numbersMarks; i++) {
  //     const newLatitude = requestData.latitude.min + tamLat * Math.random()
  //     const newLongitude = requestData.longitude.min + tamLon * Math.random()
  //     newArrayMarks.push({ latitude: newLatitude, longitude: newLongitude })
  //   }

  //   console.log(newArrayMarks)
  //   setMakersLocation(newArrayMarks)
  // }

  async function handleLocations(props) {
    if (!region) {
      console.warn('Region is not set yet.')
      return
    }

    const { latitude, longitude, latitudeDelta, longitudeDelta } = props

    const minLatitude = latitude - latitudeDelta
    const maxLatitude = latitude + latitudeDelta
    const minLongitude = longitude - longitudeDelta
    const maxLongitude = longitude + longitudeDelta

    try {
      const locations = await getLocations(
        maxLatitude,
        minLatitude,
        maxLongitude,
        minLongitude
      )
      // console.log('Locations fetched:', locations)
      setMakersLocation(locations)
    } catch (error) {
      console.error('Error fetching locations:', error)
      Alert.alert('Erro', 'Não foi possível carregar os locais.')
    }
  }

  async function onMarkerSelected(location) {
    // console.log('handleLocationInfo', location)
    setLocationInfo(location)
    setShowModal(true)
  }

  // useEffect(() => {
  //   console.log('markersLocation', makersLocation)
  // }, [makersLocation])

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

  if (Platform.OS === "web") {
    return (
      <Redirect
        href={`/pageNotFound?page=${HomeTabsIndexs.locations}`} />
    )
  }

  // Só renderiza MapView se NÃO for web!
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
        {MapView && (
          <MapView
            provider={PROVIDER_GOOGLE}
            style={StyleSheet.absoluteFill}
            region={region}
            onRegionChangeComplete={props => handleLocations(props)}
            showsUserLocation={true}
            showsMyLocationButton={true}
          >
            {makersLocation.map((item, idx) => (
              <Marker
                key={idx}
                coordinate={{
                  latitude: parseFloat(item.latitude),
                  longitude: parseFloat(item.longitude)
                }}
                onPress={() => onMarkerSelected(item)}
              />
            ))}
          </MapView>
        )}
      </View>
      <Modal
        visible={showModal}
        transparent={true}
        animationType="fade" >
        <View style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: 'center',
            alignItems: 'center'
          }
        ]}>
          <View style={{
            width: '80%',
            backgroundColor: Colors.snowWhite,
            padding: 20,
            borderRadius: 10,
            alignItems: 'center'
          }}>
            <View style={{ marginBottom: 10 }}>
              <Text>Informações do Local</Text>
            </View>
            {locationInfo && (
              <>
                <Text>Nome: {locationInfo.name}</Text>
                <Text>Latitude: {locationInfo.latitude}</Text>
                <Text>Longitude: {locationInfo.longitude}</Text>
              </>
            )}
            <Button
              title="Fechar"
              onPress={() => {
                setLocationInfo(null)
                setShowModal(false)
              }}
            />
            {locationInfo && (
              <Button
                title="Ver Detalhes"
                // onPress={() => router.push({
                //   pathname: "/recyclingLocation",
                //   params: { id: locationInfo.id }
                // })}
              />
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}