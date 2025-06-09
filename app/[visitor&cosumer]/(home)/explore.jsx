import { Colors } from '@/constants/Colors'
import HomeTabsIndexs from '@/constants/HomeTabsIndexs'
import useAuthContext from '@/hooks/useAuthContext'
import useHomeTabsContext from '@/hooks/useHomeTabsContext'
import getProductList from "@/services/marketplace/getProductList"
import axios from 'axios'
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router'
import { SignIn, SignOut } from 'phosphor-react-native'
import { useEffect, useState } from 'react'
import {
    ActivityIndicator, Image, ScrollView,
    Text, TextInput, TouchableOpacity,
    useWindowDimensions, View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

function SearchBar() {
    const { width: widthScreen } = useWindowDimensions()
    const router = useRouter()
    const { tokenAcess, cleanCredetials } = useAuthContext()

    return (
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
    )
}

function ProductItem({
    url_images,
    id,
    description = "",
    name,
    price_cents,
}) {
    const router = useRouter()
    const widthImagePx = 150

    function descriptionFormated() {
        const lengthDescripton = 60
        if (description.length > lengthDescripton)
            return description.slice(0, lengthDescripton) + "..."
        else
            return description
    }

    function goProductScreen() {
        router.push({
            pathname: "/product",
            params: { id }
        })
    }

    return (
        <View
            style={{
                // flex: 1 120,
                // alignContent: 'center',
                flexGrow: 1,
                // width: 120,
                flexBasis: widthImagePx,
                maxWidth: 320,
                // maxWidth: 180
                // maxWidth: 120,
                // backgroundColor
                alignItems: 'center',
            }}>
            <TouchableOpacity
                onPress={goProductScreen}
                style={{
                    width: '100%',

                }}>
                <View
                    style={{
                        // flex: 1,
                        // height: 120,
                        // width: 120,
                        // width: '100%',
                        overflow: 'hidden',
                        // borderWidth: 1,
                        // borderRadius: 2,
                        // backgroundColor: "#2781",
                        flexDirection: 'row',
                        flexWrap: 'wrap'
                    }}
                >
                    <Image
                        source={url_images && url_images.length
                            ? url_images[0]
                            : require('@/assets/images/LogoGreenLink.png')}
                        style={{
                            overflow: 'hidden',
                            flexGrow: 1,
                            flexBasis: widthImagePx,
                            // maxWidth: 140,
                            height: 120,
                            // width: 120,
                            backgroundColor: Colors.matteNeutralGray
                        }}
                    />
                    {/* <View
                        style={{
                            flexBasis: widthImagePx,
                            flexGrow: 1,
                            // maxWidth: 140,
                            height: 120,
                            backgroundColor: '#985'
                        }} /> */}
                    <View
                        style={{
                            flexGrow: 10,
                            flexBasis: 100,
                            // minHeight: 60,
                            // backgroundColor: "#816",
                            padding: 2,
                            borderWidth: 1,
                            borderColor: Colors.matteNeutralGray
                        }}>
                        <Text style={{
                            fontSize: 14
                        }}>
                            {name}
                        </Text>
                        {/* <Text style={{
                            fontSize: 12
                        }}>
                            {company}
                        </Text> */}
                        <View
                            style={{
                                overflow: 'hidden',
                                // height: 0,
                                flexGrow: 1,
                                flexBasis: 0
                                // flexGrow: 1,
                            }}>
                            <Text
                                style={{
                                    fontSize: 10
                                }}>
                                {descriptionFormated()}
                            </Text>
                        </View>
                        <Text style={{
                            fontSize: 15,
                            textAlign: 'right'
                        }}>
                            R$ {(price_cents / 100.0)
                                .toFixed(2)
                                .toString()
                                .replace('.', ',')}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    )
}

export default function ExploreScreen() {
    const routeParams = useLocalSearchParams()
    const router = useRouter()
    const { setCurrentScreen } = useHomeTabsContext()
    const [isLoadingProducts, setIsLoadingProducts] = useState(true)
    // const [isLoadingNextPage, setIsLoadingNextPage] = useState(false)
    const indexIsError = "isError"
    const indexErrorMessage = "errorMessage"
    const defaultErrorObj = {
        [indexIsError]: false,
        [indexErrorMessage]: null
    }
    const [errorObj, setErrorObj] = useState(defaultErrorObj)
    const [dataProducts, setDataProducts] = useState(null)
    const [urlNextPage, setUrlNextPage] = useState(null)
    // var scrollTemp = 0
    const [scrollTemp, setScrollTemp] = useState(0)

    function handleMessageError(messageError) {
        setErrorObj(prev => ({
            ...prev,
            [indexIsError]: true,
            [indexErrorMessage]: messageError
        }))
    }

    const handleScroll = (event) => {
        const {
            layoutMeasurement, contentOffset, contentSize
        } = event.nativeEvent

        const isScrolledToEnd =
            layoutMeasurement.height + contentOffset.y >= contentSize.height - 20 // 20 é uma margem de tolerância

        if (isScrolledToEnd && scrollTemp == 0 && urlNextPage != null) {
            // if (isScrolledToEnd && urlNextPage != null) {
            setScrollTemp(prev => prev + 1)
            // console.log('Usuário chegou ao final do ScrollView')
            // setIsLoadingNextPage(true)
            // getNextPageProducts()
            // Aqui você pode disparar uma ação,
            //  como carregar mais conteúdo, etc.
        }
    }

    async function getDataProducts() {
        try {
            if (dataProducts == null) {
                var dataResquest = await getProductList()
                // This is the expected structure in request
                // {
                //     count: int,
                //     next: string, // URL the next page products
                //     previous: null, // URL the previous page products
                //     results: [ // Arrays of products infos
                //         {
                //             category: string,
                //             company: string,
                //             created_at: "AAAA-MM-DDTHH:mm:ss.mmmmm-03:00",
                //             description: string,
                //             id: int,
                //             is_sustainable: boolean,
                //             name: string,
                //             price_cents: int,
                //             purchase_contact: string,
                //             quantity: int
                //         }
                //     ]
                // }
                if (dataResquest.results.length == 0)
                    handleMessageError("Nenhum produto encontrado")
                else {
                    setDataProducts(dataResquest.results)
                    setUrlNextPage(dataResquest.next)
                }
            }
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
        setIsLoadingProducts(false)
    }

    async function getNextPageProducts() {
        // console.log("BUSCOU")
        setIsLoadingProducts(true)

        const api = axios.create({
            baseURL: urlNextPage,
            timeout: 10000, // 10s timeout for requests
            headers: {
                'Content-Type': 'application/json',
                // you can add standard headers here, e.g. Authorization
            }
        })
        try {
            var dataResquest = await api.get()
            // console.log(newDataProducts)
            setDataProducts(prev => ([
                ...prev,
                ...dataResquest.data.results
            ]))
            setUrlNextPage(dataResquest.data.next)
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

        setIsLoadingProducts(false)
        setScrollTemp(0)
    }

    useEffect(() => {
        // console.log(`scrollTemp: ${scrollTemp}`)
        if (scrollTemp == 1)
            getNextPageProducts()
    }, [scrollTemp])

    // useEffect(() => {
    //     if (isLoadingNextPage)
    // }, [isLoadingNextPage])

    useEffect(() => {
        // scrollTemp = false
    }, [dataProducts])

    useEffect(() => {
        getDataProducts()
    }, [])

    useEffect(() => {
        if (dataProducts != null && isLoadingProducts) {
            setIsLoadingProducts(false)
        }
    }, [dataProducts])

    useFocusEffect(() => {
        setCurrentScreen(HomeTabsIndexs.explore)
    })

    return (
        <SafeAreaView style={[
            {
                flex: 1,
                backgroundColor: Colors.snowWhite
            },
        ]}>
            <ScrollView
                onScroll={handleScroll}
                scrollEventThrottle={16}>
                <SearchBar />
                {errorObj[indexIsError]
                    ? (
                        <Text
                            style={{
                                marginTop: 100,
                                flexGrow: 1,
                                textAlign: 'center',
                                fontSize: 18
                            }}>
                            {`${errorObj[indexErrorMessage]}! :(`}
                        </Text>
                    ) : dataProducts != null
                        ? (
                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    justifyContent: 'space-evenly',
                                    // alignItems: 'center',
                                    flexWrap: 'wrap',
                                    gap: 20,
                                    padding: 20
                                    // alignItems: 'center'
                                }}>
                                {dataProducts.map(({
                                    url_images = null,
                                    id,
                                    description,
                                    name,
                                    price_cents,
                                }, idx) => (
                                    <ProductItem
                                        key={idx}
                                        id={id}
                                        description={description}
                                        name={name}
                                        price_cents={price_cents} />
                                ))}
                            </View>
                        ) : null}
                {isLoadingProducts
                    ? (
                        <ActivityIndicator
                            style={{
                                marginVertical: 100
                            }}
                            size={50}
                            color={Colors.mediumGreenProfessional}
                        />
                    ) : null}
            </ScrollView>
        </SafeAreaView>
    )
}