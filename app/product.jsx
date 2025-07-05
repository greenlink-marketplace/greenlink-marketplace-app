import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowUDownLeft, BookmarkSimple, Check, Ticket } from "phosphor-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  Text, TextInput, TouchableOpacity, useWindowDimensions,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../constants/Colors";
import useAuthContext from "../hooks/useAuthContext";
import deleteSavedProduct from "../services/marketplace/deleteSavedProduct";
import getProductDetail from "../services/marketplace/getProductDetail";
import getProductsRelated from "../services/marketplace/getProductsRelated";
import postCouponGenerate from "../services/marketplace/postCouponGenerate";
import postSavedProductAdd from "../services/marketplace/postSavedProductsAdd";

function CustomModal({
  modalVisible,
  setModalVisible,
  price_cents = 0,
  userCredits,
  handleGenerateCoupon,
  isLoadingGenerateCoupon
}) {
  const [step, setStep] = useState(1);
  const [creditsToUse, setCreditsToUse] = useState('0');

  function checksNotInterchangeability() {
    return creditsToUse <= 0
      || creditsToUse > userCredits
      || creditsToUse < price_cents * 0.05
      || creditsToUse > price_cents * 0.2
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(false);
      }}
    >
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
      }}>
        <View style={{
          backgroundColor: '#fff',
          borderRadius: 12,
          width: '100%',
          maxWidth: 400,
          padding: 24
        }}>
          {step === 1 && (
            <>
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>
                Trocar Créditos por Cupom
              </Text>

              <Text>
                Preço do Produto: R$ {(price_cents / 100.0).toFixed(2).toString().replace('.', ',')}
              </Text>
              <Text>Seus Créditos: {userCredits}</Text>

              <TextInput
                keyboardType="numeric"
                placeholder="Quantos créditos deseja usar?"
                value={creditsToUse}
                onChangeText={(value) => {
                  var newValue = value.replace(/[^0-9]/g, '');
                  if (newValue === '') {
                    newValue = '0';
                  }
                  newValue = parseInt(newValue);
                  setCreditsToUse(newValue)
                }}
                style={{
                  borderWidth: 1,
                  borderColor: '#ccc',
                  borderRadius: 8,
                  padding: 10,
                  marginVertical: 16
                }}
              />

              {/* <Text>Desconto aplicado: R$ {discount.toFixed(2)}</Text> */}
              <Text>
                Valor de Desconto: R$ {creditsToUse
                  ? (creditsToUse / 100.0).toFixed(2).toString().replace('.', ',')
                  : "0,00"}
              </Text>
              {/* <Text>Preço final: R$ {finalPrice.toFixed(2)}</Text> */}
              {/* <Text>Preço final: R$ </Text> */}

              <Text style={{
                marginTop: 5,
                fontSize: 12,
                color: Colors.mediumGreenProfessional
              }}>
                Obs.: A quantidade de créditos deve ser maior que 0, não pode exceder seu saldo, e deve representar entre 5% e 20% do valor do produto. No caso, entre R$ {(price_cents * 0.05 / 100.0).toFixed(2).toString().replace('.', ',')} e R$ {(price_cents * 0.2 / 100.0).toFixed(2).toString().replace('.', ',')}.
              </Text>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 }}>
                <TouchableOpacity
                  style={{ padding: 10 }}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={{ color: 'red' }}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={setStep.bind(null, 2)}
                  disabled={checksNotInterchangeability()}
                  style={[
                    {
                      backgroundColor: Colors.sustainableLightGreen,
                      paddingVertical: 10,
                      paddingHorizontal: 20,
                      borderRadius: 8,
                    },
                    checksNotInterchangeability()
                      ? { opacity: 0.5 }
                      : null
                  ]}
                >
                  <Text style={{ color: '#fff' }}>Continuar</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
          {step === 2 && (
            <>
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>
                Confirmar Troca
              </Text>

              <Text style={{ marginBottom: 8 }}>Você usará <Text style={{ fontWeight: 'bold' }}>{creditsToUse}</Text> créditos.</Text>
              <Text style={{ marginBottom: 8 }}>Desconto aplicado: <Text style={{ fontWeight: 'bold' }}>R$ {(creditsToUse / 100.0).toFixed(2).toString().replace('.', ',')}</Text></Text>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 }}>
                <TouchableOpacity onPress={setStep.bind(null, 1)}>
                  <Text style={{ color: '#555' }}>Voltar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleGenerateCoupon(parseInt(creditsToUse))}
                  style={{
                    backgroundColor: Colors.sustainableLightGreen,
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    borderRadius: 8,
                  }}
                >
                  {isLoadingGenerateCoupon
                    ? (
                      <ActivityIndicator
                        size={20}
                        color={Colors.snowWhite}
                      />
                    ) : (
                      <Text style={{ color: '#fff' }}>Confirmar</Text>
                    )}
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  )
}

export default function ProductScreen() {
  const { width: widthScreen, height: heightScreen } = useWindowDimensions()
  const expandedMode = widthScreen > 800
  // const [isSaved, setIsSaved] = useState(false)
  const { isVisitor, userData } = useAuthContext()
  const { id } = useLocalSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [dataProduct, setDataProduct] = useState(null)
  const router = useRouter()
  const [modalVisible, setModalVisible] = useState(false);
  const [couponConfirmation, setCouponConfirmation] = useState(false);
  const [isLoadingGenerateCoupon, setIsLoadingGenerateCoupon] = useState(false)
  const [relatedProducts, setRelatedProducts] = useState([]);


  function handleMessageError(messageError) {
    // setErrorObj(prev => ({
    //     ...prev,
    //     [indexIsError]: true,
    //     [indexErrorMessage]: messageError
    // }))
    console.log(messageError)
  }

  async function tryProductDetailsRetrieve() {
    try {
      const responseData = await getProductDetail(id)
      // This is the expected structure in request
      // {
      //     "id": int,
      //     "name": string,
      //     "description": string,
      //     "price_cents": int,
      //     "quantity": int,
      //     "purchase_contact": string,
      //     "category": int,
      //     "company": int,
      //     "is_sustainable": bool,
      //     "created_at": string,
      //     "is_saved_by_consumer": bool/null
      // }
      setDataProduct(responseData)
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

  useEffect(() => {
    tryProductDetailsRetrieve()
    handleProductsRelated()
  }, [])

  useEffect(() => {
    if (dataProduct != null)
      setIsLoading(false)
  }, [dataProduct])

  async function changeSaveItem() {
    const prevState = dataProduct.is_saved_by_consumer
    setDataProduct(prev => ({
      ...prev,
      is_saved_by_consumer: null
    }))
    try {
      if (!dataProduct.is_saved_by_consumer)
        await postSavedProductAdd(id)
      else
        await deleteSavedProduct(id)

      const responseData = await getProductDetail(id)
      setDataProduct(prev => ({
        ...prev,
        is_saved_by_consumer: responseData.is_saved_by_consumer
      }))
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
      setDataProduct(prev => ({
        ...prev,
        is_saved_by_consumer: prevState
      }))
    }
  }

  async function handleGenerateCoupon(green_credit_amount) {
    setIsLoadingGenerateCoupon(true)
    try {
      await postCouponGenerate(id, green_credit_amount)
      setModalVisible(false)
      setCouponConfirmation(true)
      setTimeout(() => {
        setCouponConfirmation(false)
      }, 2000)
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
    setIsLoadingGenerateCoupon(false)
  }

  async function handleProductsRelated() {
    try {
      // await postCouponGenerate(id, green_credit_amount)
      const response = await getProductsRelated(id)
      setRelatedProducts(response)
      // setModalVisible(false)
      // setCouponConfirmation(true)
      // setTimeout(() => {
      //   setCouponConfirmation(false)
      // }, 2000)
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

  return (
    <SafeAreaView
      style={[
        {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Colors.snowWhite
        },
        expandedMode
          ? { backgroundColor: Colors.matteNeutralGray, } : null
      ]}>
      <ScrollView
        style={{
          flex: 1,
          width: '100%',
        }}>
        <View
          style={[
            {
              width: '100%',
              alignSelf: 'center',
              borderRadius: 5,
            },
            expandedMode
              ? {
                width: 800,
                marginVertical: 30,
                shadowOffset: {
                  width: 5,
                  height: 5
                },
                shadowOpacity: 0.1
              } : null]}
        >
          <View
            style={[
              {
                backgroundColor: Colors.snowWhite,
                padding: 20,
                gap: 20
              },
              isLoading && dataProduct == null
                ? {
                  height: heightScreen * 0.8
                } : null
            ]}>
            {isLoading
              ? (
                <ActivityIndicator
                  style={{
                    marginVertical: 100
                  }}
                  size={50}
                  color={Colors.mediumGreenProfessional}
                />
              ) : dataProduct == null
                ? (
                  <Text>Ocorreu um erro ao carregar detalhes do produto</Text>
                ) : (
                  <>
                    <View
                      style={{
                        gap: 10,
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                      }}>
                      <View style={{
                        overflow: 'hidden',
                        width: 300,
                        height: 300,
                      }}>
                        <Image
                          // source={require('@/assets/images/LogoGreenLink.png')}
                          source={dataProduct.image
                            ? dataProduct.image
                            : require('@/assets/images/LogoGreenLink.png')}
                          style={{
                            height: '100%',
                            width: '100%',
                            backgroundColor: Colors.matteNeutralGray
                          }} />
                      </View>
                      <View
                        style={{
                          flex: 1,
                          gap: 10,
                          minWidth: 200
                        }}>
                        <View style={{
                          flexDirection: 'row'
                        }}>
                          <View
                            style={{
                              flexGrow: 1
                            }}>
                            <Text style={{
                              fontSize: 20
                            }}>
                              {dataProduct.name}
                            </Text>
                            <Text
                              style={{
                                fontSize: 20
                              }}
                            >
                              R$ {(dataProduct.price_cents / 100.0).toFixed(2).toString().replace('.', ',')}
                            </Text>
                            <Text
                              style={{
                                fontSize: 16
                              }}
                            >
                              {dataProduct.company}
                            </Text>
                          </View>
                          {!isVisitor
                            ? (
                              <>
                                <TouchableOpacity
                                  disabled={couponConfirmation}
                                  onPress={() => setModalVisible(true)}
                                  style={{
                                    alignSelf: 'flex-start',
                                  }}>
                                  {couponConfirmation
                                    ? (
                                      <Check
                                        size={40}
                                        color={Colors.mediumGreenProfessional}
                                        weight={"duotone"}
                                      />
                                    ) : (
                                      <Ticket
                                        size={40}
                                        color={Colors.mediumGreenProfessional}
                                        weight={"duotone"}
                                      />
                                    )}
                                </TouchableOpacity>
                                <TouchableOpacity
                                  disabled={dataProduct.is_saved_by_consumer == null}
                                  onPress={changeSaveItem}
                                  style={{
                                    alignSelf: 'flex-start',
                                  }}>
                                  {dataProduct.is_saved_by_consumer == null
                                    ? (
                                      <ActivityIndicator
                                        size={40}
                                        color={Colors.mediumGreenProfessional}
                                      />
                                    ) : (
                                      <BookmarkSimple
                                        size={40}
                                        color={Colors.mediumGreenProfessional}
                                        weight={dataProduct.is_saved_by_consumer ? "fill" : "regular"}
                                      />
                                    )}
                                </TouchableOpacity>
                              </>
                            ) : null}
                        </View>
                        <Text>
                          <Text
                            style={{ fontWeight: 'bold' }}>
                            Descrição: </Text>
                          {dataProduct.description}
                        </Text>
                        {/* <View style={{ marginTop: 20, gap: 6 }}> */}
                        <Text>
                          <Text style={{ fontWeight: 'bold' }}>Categoria: </Text>
                          {dataProduct.category}
                        </Text>
                        <Text>
                          <Text style={{ fontWeight: 'bold' }}>Quantidade disponível: </Text>
                          {dataProduct.quantity}
                        </Text>
                        <Text>
                          <Text style={{ fontWeight: 'bold' }}>Contato para compra: </Text>
                          {dataProduct.purchase_contact}
                        </Text>
                        <Text>
                          <Text style={{ fontWeight: 'bold' }}>Produto sustentável: </Text>
                          {dataProduct.is_sustainable ? 'Sim' : 'Não'}
                        </Text>
                        <Text>
                          <Text style={{ fontWeight: 'bold' }}>Publicado em: </Text>
                          {new Date(dataProduct.created_at).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </Text>
                        {/* </View> */}
                      </View>
                    </View>
                    <View
                      style={{
                        overflow: 'hidden',
                        backgroundColor: Colors.mediumGreenProfessional,
                        borderRadius: 10,
                        padding: 10,
                        marginTop: 30,
                      }}
                    >
                      <Text
                        style={{
                          color: Colors.snowWhite,
                          fontWeight: '500',
                          fontSize: 16,
                          marginBottom: 10,
                        }}
                      >
                        Itens Relacionados
                      </Text>

                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{
                          flexDirection: 'row',
                          gap: 10,
                          paddingBottom: 10,
                        }}
                      >
                        {relatedProducts.map((item) => (
                          <TouchableOpacity
                            onPress={() => router.push({
                              pathname: "/product",
                              params: { id: item.id }
                            })}
                            key={item.id}
                            style={{
                              width: 140,
                              backgroundColor: Colors.snowWhite,
                              borderRadius: 8,
                              overflow: 'hidden',
                            }}
                          >
                            <View style={{ height: 100, backgroundColor: Colors.matteNeutralGray }}>
                              <Image
                                source={
                                  item.image
                                    ? { uri: item.image }
                                    : require('@/assets/images/LogoGreenLink.png')
                                }
                                style={{
                                  width: '100%',
                                  height: '100%',
                                }}
                                resizeMode="cover"
                              />
                            </View>
                            <View style={{ padding: 8 }}>
                              <Text
                                numberOfLines={1}
                                style={{
                                  fontWeight: 'bold',
                                  fontSize: 14,
                                  color: Colors.mediumGreenProfessional,
                                }}
                              >
                                {item.name}
                              </Text>
                              <Text
                                numberOfLines={2}
                                style={{ fontSize: 12, color: '#333' }}
                              >
                                {item.description}
                              </Text>
                              <Text style={{ fontWeight: 'bold', marginTop: 4 }}>
                                R$ {(item.price_cents / 100).toFixed(2).replace('.', ',')}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  </>
                )}
          </View>
        </View>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            opacity: expandedMode ? 1 : 0.5,
            backgroundColor: Colors.mediumGreenProfessional,
            position: 'absolute',
            top: 10,
            left: 10,
            padding: 2,
            borderRadius: 1000
          }}>
          <ArrowUDownLeft
            size={40}
            color={Colors.snowWhite} />
        </TouchableOpacity>
      </ScrollView>
      {/* Modal for credits exchange */}
      {dataProduct != null && userData ? (
        <CustomModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          userCredits={userData.green_credit_balance}
          price_cents={dataProduct.price_cents}
          handleGenerateCoupon={handleGenerateCoupon}
          isLoadingGenerateCoupon={isLoadingGenerateCoupon} />
      ) : null}
    </SafeAreaView >
  )
}