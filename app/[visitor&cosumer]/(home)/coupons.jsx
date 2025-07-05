import { Colors } from '@/constants/Colors'
import HomeTabsIndexs from '@/constants/HomeTabsIndexs'
import useAuthContext from '@/hooks/useAuthContext'
import useHomeTabsContext from '@/hooks/useHomeTabsContext'
import { Redirect, useFocusEffect, useRouter } from 'expo-router'
import { Eye, EyeSlash } from 'phosphor-react-native'
import { useState } from 'react'
import { FlatList, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import getCouponList from '../../../services/marketplace/getCouponList'

function CouponItem({
  is_valid,
  coupon_code,
  discount_value_cents,
  generated_at,
  product_id
}) {
  const [showCode, setShowCode] = useState(false)
  const router = useRouter()

  return (
    <View style={{
      // backgroundColor: '#fff',
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderRadius: 8,
      padding: 16,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: is_valid ? Colors.primary : '#ccc',
      opacity: is_valid ? 1 : 0.5
    }}>
      <View>
        <View
          style={{
            flexDirection: 'row',
            gap: 10
          }}>
          <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
            Código: {showCode ? coupon_code : '**********'}
          </Text>
          <TouchableOpacity
            onPress={() => setShowCode(!showCode)}>
            {showCode ? (
              <EyeSlash />
            ) : (
              <Eye />
            )}
          </TouchableOpacity>
        </View>
        <Text>
          Valor: R$ {(discount_value_cents / 100).toFixed(2)}
        </Text>
        <Text>
          Gerado em: {new Date(generated_at).toLocaleString('pt-BR')}
        </Text>
        <Text style={{ color: is_valid ? 'green' : 'red' }}>
          {is_valid ? 'Válido' : 'Inválido'}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          router.push({
            pathname: "/product",
            params: { id: product_id }
          })
        }}>
        <Text>Ver Produto</Text>
      </TouchableOpacity>
    </View>
  )
}

export default function CounponsScreen() {
  const { setCurrentScreen } = useHomeTabsContext()
  const { isVisitor } = useAuthContext()

  // Array mockado de cupons
  const [coupons, setCoupons] = useState([
    // {
    //     id: 1,
    //     coupon_code: "5SXVSXNRPG",
    //     discount_value_cents: 195,
    //     generated_at: "2025-06-26T19:40:59.692532-03:00",
    //     is_valid: true
    // },
    // {
    //     id: 2,
    //     coupon_code: "8JDKS9QWPL",
    //     discount_value_cents: 250,
    //     generated_at: "2025-06-25T15:20:10.123456-03:00",
    //     is_valid: false
    // }
  ])

  useFocusEffect(() => {
    setCurrentScreen(HomeTabsIndexs.coupons)
    handleCoupons()
  })

  // Função reservada para buscar cupons do endpoint
  async function handleCoupons() {
    try {
      const response = await getCouponList()
      setCoupons(response)
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          handleMessageError("Credenciais inválidas")
        } else if (error.response.status === 403) {
          handleMessageError("Usuário desativado")
        } else if (error.response.status === 404) {
          handleMessageError("API não encontrada")
        } else {
          handleMessageError("Requisição feita mas sem sucess")
        }
      } else if (error.request) {
        // console.log("Sem resposta do servidor")
        handleMessageError("Sem resposta do servidor")
      } else {
        // Error in request configures
        // console.log(`Erro inesperado: ${error.message}`)
        handleMessageError(`Erro inesperado: ${error.message}`)
      }
    }
  }

  if (isVisitor)
    return (
      <Redirect
        href={`/pageNotFound?page=${HomeTabsIndexs.coupons}`} />
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
          padding: 16,
        }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 16 }}>
          Meus Cupons
        </Text>
        <FlatList
          style={{
            gap: 10
          }}
          data={coupons}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => <CouponItem {...item} />}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', marginTop: 32 }}>
              Nenhum cupom encontrado.
            </Text>
          }
        />
      </View>
    </SafeAreaView>
  )
}