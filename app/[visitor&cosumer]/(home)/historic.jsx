import { Colors } from '@/constants/Colors'
import HomeTabsIndexs from '@/constants/HomeTabsIndexs'
import useAuthContext from '@/hooks/useAuthContext'
import useHomeTabsContext from '@/hooks/useHomeTabsContext'
import getMaterialsMy from '@/services/recycling/getMaterialsMy'
import { Redirect, useFocusEffect } from 'expo-router'
import { useCallback, useState } from 'react'
import { FlatList, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

// Utilitário para formatar datas (ex: 05/07/2025)
function formatDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

function MaterialItem({ name, description, quantity_gram, created_at }) {
  const quantityKg = (quantity_gram / 1000).toFixed(2)

  return (
    <View
      style={{
        backgroundColor: Colors.matteNeutralGray,
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
      }}
    >
      <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{name}</Text>
      <Text style={{ marginTop: 4, color: '#444' }}>{description}</Text>
      <Text style={{ marginTop: 8, color: '#333' }}>
        Quantidade: {quantityKg} kg
      </Text>
      <Text style={{ color: '#666', fontSize: 12 }}>
        Reciclado em: {formatDate(created_at)}
      </Text>
    </View>
  )
}

export default function RecyclingListScreen() {
  const { setCurrentScreen } = useHomeTabsContext()
  const { isVisitor } = useAuthContext()

  const [recycles, setRecycles] = useState([])

  useFocusEffect(
    useCallback(() => {
      setCurrentScreen(HomeTabsIndexs.historic)
      handleRecycling()
    }, [])
  )

  async function handleRecycling() {
    try {
      // TODO: Substitua esta parte com uma chamada real à API
      const data = await getMaterialsMy()
      if (!data || !Array.isArray(data)) {
        throw new Error("Dados inválidos recebidos da API")
      }
      setRecycles(data)
    } catch (error) {
      const handleMessageError = (msg) => console.error(msg)

      if (error.response) {
        if (error.response.status === 401) handleMessageError("Credenciais inválidas")
        else if (error.response.status === 403) handleMessageError("Usuário desativado")
        else if (error.response.status === 404) handleMessageError("API não encontrada")
        else handleMessageError("Requisição feita mas sem sucesso")
      } else if (error.request) {
        handleMessageError("Sem resposta do servidor")
      } else {
        handleMessageError(`Erro inesperado: ${error.message}`)
      }
    }
  }

  if (isVisitor)
    return <Redirect href={`/pageNotFound?page=${HomeTabsIndexs.historic}`} />

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.snowWhite }}>
      <View style={{ flex: 1, padding: 16 }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 16 }}>
          Minhas Reciclagens
        </Text>

        <FlatList
          data={recycles}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <MaterialItem {...item} />}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', marginTop: 32 }}>
              Nenhuma reciclagem encontrada.
            </Text>
          }
        />
      </View>
    </SafeAreaView>
  )
}