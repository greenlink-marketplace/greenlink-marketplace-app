import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowUDownLeft, BookmarkSimple } from "phosphor-react-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../constants/Colors";
import useAuthContext from "../hooks/useAuthContext";
import deleteSavedProduct from "../services/marketplace/deleteSavedProduct";
import getProductDetail from "../services/marketplace/getProductDetail";
import postSavedProductAdd from "../services/marketplace/postSavedProductsAdd";

export default function ProductScreen() {
    const { width: widthScreen, height: heightScreen } = useWindowDimensions()
    const expandedMode = widthScreen > 800
    // const [isSaved, setIsSaved] = useState(false)
    const { isVisitor } = useAuthContext()
    const { id } = useLocalSearchParams()
    const [isLoading, setIsLoading] = useState(true)
    const [dataProduct, setDataProduct] = useState(null)
    const router = useRouter()

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
                                                    source={dataProduct.url_images && dataProduct.url_images.length
                                                        ? dataProduct.url_images[0]
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
                                                        ) : null}
                                                </View>
                                                <Text>
                                                    <Text
                                                        style={{ fontWeight: 'bold' }}>
                                                        Descrição: </Text>
                                                    {dataProduct.description}
                                                </Text>
                                            </View>
                                        </View>
                                        <View
                                            style={{
                                                overflow: 'hidden',
                                                backgroundColor: Colors.mediumGreenProfessional,
                                                borderRadius: 10,
                                                padding: 10
                                            }}>
                                            <Text
                                                style={{
                                                    color: Colors.snowWhite,
                                                    fontWeight: '500'
                                                }}>
                                                Itens Relacionados
                                            </Text>
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    flexWrap: 'wrap',
                                                    padding: 10,
                                                    gap: 10,
                                                }}>
                                                {Array.from({ length: 30 }).map((_, idx) => (
                                                    <View
                                                        key={idx}
                                                        style={{
                                                            flex: 1,
                                                            minWidth: 120,
                                                            height: 120,
                                                            backgroundColor: '#231'
                                                        }} />
                                                ))}
                                            </View>
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
        </SafeAreaView >
    )
}