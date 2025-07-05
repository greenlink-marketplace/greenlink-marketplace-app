// import { format } from 'date-fns'
// import { ptBR } from 'date-fns/locale'
import { useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '../constants/Colors'

export default function RecyclingLocationDetails() {
  const { id } = useLocalSearchParams()
  const [location, setLocation] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    //     if (!id) return

    //     async function fetchData() {
    //       try {
    //         const response = await api.get(`/recycling/location/${id}/`)
    //         setLocation(response.data)
    //       } catch (error) {
    //         console.error('Erro ao buscar ponto de coleta:', error)
    //       } finally {
    //         setLoading(false)
    //       }
    //     }

    //     fetchData()
  }, [id])

  return (
    <SafeAreaView
      style={[
        StyleSheet.absoluteFill,
        { backgroundColor: Colors.snowWhite }
      ]}>
      {loading
        ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={Colors.mediumGreenProfessional} />
          </View>
        ) : !location
          ? (
            <View style={styles.center}>
              <Text>Não foi possível carregar os dados do ponto de coleta.</Text>
            </View>
          )
          : (
            <ScrollView contentContainerStyle={styles.container}>
              <Text style={styles.title}>{location.name}</Text>

              <Text style={styles.label}>Endereço:</Text>
              <Text style={styles.text}>{location.address}</Text>

              <Text style={styles.label}>Contato:</Text>
              <Text style={styles.text}>{location.contact}</Text>

              <Text style={styles.label}>Localização:</Text>
              <Text style={styles.text}>Latitude: {location.latitude}</Text>
              <Text style={styles.text}>Longitude: {location.longitude}</Text>

              <Text style={styles.label}>Preços por categoria:</Text>
              {location.prices.map((item, index) => (
                <View key={index} style={styles.priceItem}>
                  <Text style={styles.priceTitle}>{item.category_name}</Text>
                  <Text style={styles.text}>{item.category_description}</Text>
                  <Text style={styles.text}>
                    R$ {(item.price_per_kg_cents / 100).toFixed(2)} por kg
                  </Text>
                  <Text style={styles.text}>
                    Atualizado em:{' '}
                    {/* {format(new Date(item.updated_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })} */}
                  </Text>
                </View>
              ))}
            </ScrollView>
          )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#2E7D32',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
  },
  text: {
    fontSize: 14,
    color: '#444',
    marginBottom: 4,
  },
  priceItem: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
  },
  priceTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 4,
  },
})