import { ThemedView } from '@/components/ThemedView'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import {
  ActivityIndicator,
  Image,
  Pressable,
  Text,
  useWindowDimensions,
  View
} from 'react-native'
import {
  KeyboardAwareScrollView
} from "react-native-keyboard-aware-scroll-view"
import { SafeAreaView } from "react-native-safe-area-context"
import { CustomTextInput } from '../components/CustomTextInput'
import { Colors } from "../constants/Colors"
import UserRoleIndexs from '../constants/UserRoleIndexs'
import useAuthContext from '../hooks/useAuthContext'
import postTokenObtainPair from '../services/accounts/postTokenObtainPair'
import postConsumerRegister from "../services/marketplace/postConsumerRegister"

export default function RegisterScreen() {
  const { width: widthScreen } = useWindowDimensions()
  const { handleCredentials } = useAuthContext()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [cpf, setCpf] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirmed, setPasswordConfirmed] = useState("")
  const [
    isButtonRegisterPressed,
    setIsButtonRegisterPressed
  ] = useState(false)
  const indexIsError = "isError"
  const indexMessageError = "messageError"
  const indexFirstNameError = 0
  const indexLastNameError = 1
  const indexUsernameError = 2
  const indexEmailError = 3
  const indexCPFError = 4
  const indexPhoneError = 5
  const indexAddressError = 6
  const indexPasswordError = 7
  const indexPasswordConfirmedError = 8
  const indexGeneralError = 9
  const defaultErrorArray = Array(10).fill({
    [indexIsError]: false,
    [indexMessageError]: ""
  })
  const [errorArray, setErrorArray] = useState(defaultErrorArray)
  const textInputsInfosArray = [
    { // First Name
      placeholder: "Nome",
      value: firstName,
      onChangeText: setFirstName,
      error: errorArray
      [indexFirstNameError]
      [indexIsError],
      messageError: errorArray
      [indexFirstNameError]
      [indexMessageError]
    },
    { // Last Name
      placeholder: "Sobrenome",
      value: lastName,
      onChangeText: setLastName,
      error: errorArray
      [indexLastNameError]
      [indexIsError],
      messageError: errorArray
      [indexLastNameError]
      [indexMessageError]
    },
    { // Username
      placeholder: "Nome de usuário",
      value: username,
      onChangeText: setUsername,
      error: errorArray
      [indexUsernameError]
      [indexIsError],
      messageError: errorArray
      [indexUsernameError]
      [indexMessageError]
    },
    { // Email
      placeholder: "E-mail",
      value: email,
      onChangeText: setEmail,
      keyboardType: "email-address",
      error: errorArray
      [indexEmailError]
      [indexIsError],
      messageError: errorArray
      [indexEmailError]
      [indexMessageError]
    },
    { // CPF
      placeholder: "CPF",
      value: cpf,
      onChangeText: setCpf,
      keyboardType: "numeric",
      error: errorArray
      [indexCPFError]
      [indexIsError],
      messageError: errorArray
      [indexCPFError]
      [indexMessageError]
    },
    { // Phone
      placeholder: "Número de Celular",
      value: phone,
      onChangeText: setPhone,
      keyboardType: "numeric",
      error: errorArray
      [indexPhoneError]
      [indexIsError],
      messageError: errorArray
      [indexPhoneError]
      [indexMessageError]
    },
    { // Address
      placeholder: "Endereço",
      value: address,
      onChangeText: setAddress,
      error: errorArray
      [indexAddressError]
      [indexIsError],
      messageError: errorArray
      [indexAddressError]
      [indexMessageError]
    },
    { // Password
      placeholder: "Senha",
      value: password,
      onChangeText: setPassword,
      secureTextEntry: true,
      error: errorArray
      [indexPasswordError]
      [indexIsError],
      messageError: errorArray
      [indexPasswordError]
      [indexMessageError]
    },
    { // Password Confirmation
      placeholder: "Confirme sua Senha",
      value: passwordConfirmed,
      onChangeText: setPasswordConfirmed,
      secureTextEntry: true,
      error: errorArray
      [indexPasswordConfirmedError]
      [indexIsError],
      messageError: errorArray
      [indexPasswordConfirmedError]
      [indexMessageError]
    }
  ]

  function handleErros(errosObj) {
    const errorsIndexDictionary = {
      first_name: indexFirstNameError,
      last_name: indexLastNameError,
      username: indexUsernameError,
      email: indexEmailError,
      cpf: indexCPFError,
      phone: indexPhoneError,
      address: indexAddressError,
      password: indexPasswordError,
      general: indexGeneralError
    }

    var newErrorArray = [
      ...defaultErrorArray
    ]

    for (var keyError in errosObj) {
      var indexError = errorsIndexDictionary[keyError]
      newErrorArray[indexError] = {
        [indexIsError]: true,
        [indexMessageError]: errosObj[keyError]
      }
    }

    setErrorArray(newErrorArray)
  }

  async function tryRegister() {
    setIsLoading(true)
    setErrorArray(defaultErrorArray)

    try {
      // Check that the password and password 
      // confirmation fields have the same value
      if (password != passwordConfirmed) {
        setErrorArray(prev => {
          var newErrorArray = [...prev]
          newErrorArray[indexPasswordError] = {
            ...newErrorArray[indexPasswordError],
            [indexIsError]: true
          }
          newErrorArray[indexPasswordConfirmedError] = {
            [indexIsError]: true,
            [indexMessageError]: "Suas senhas não correspondem."
          }
          newErrorArray[indexGeneralError] = {
            [indexIsError]: true,
            [indexMessageError]: "Ocorreu um Erro"
          }
          return newErrorArray
        })
        throw Error
      }
      try {
        const registerData = {
          first_name: firstName,
          last_name: lastName,
          username,
          email,
          cpf,
          phone,
          address,
          password
        }
        await postConsumerRegister(registerData)
      } catch (error) {
        if (error.response) {
          if (error.response.status === 400) {
            var errorsObj = error.response.data
            handleErros(errorsObj)
          }
          // else if (error.response.status === 401) {
          //     // console.log('Credenciais inválidas')
          //     newErrorObj[indexMessageError] = "Credenciais inválidas"
          // } else if (error.response.status === 403) {
          //     // console.log('Endpoint não encontrado')
          //     newErrorObj[indexMessageError] = "Usuário desativado"
          // } else if (error.response.status === 404) {
          //     // console.log('Endpoint não encontrado')
          //     newErrorObj[indexMessageError] = "API não encontrada"
          // } else {
          //     // console.log('Endpoint não encontrado')
          //     newErrorObj[indexMessageError] = "Ocorreu um erro ao " +
          //         `autentificar-se. CODE_STATUS: ${error.response.status}`
          // }
        } else if (error.request) {
          var errorsObj = {
            general: "Sem resposta do servidor"
          }
          handleErros(errorsObj)
        } else {
          var errorsObj = {
            general: `Erro inesperado: ${error.message}`
          }
          handleErros(errorsObj)
          // Error in request configures
        }
        throw Error
      }
      try {
        const loginData = {
          login: username,
          password: password
        }
        console.log(loginData)

        const userData = await postTokenObtainPair(loginData)

        console.log(userData)

        handleCredentials({
          tokenAcess: userData.tokens.access,
          tokenRefresh: userData.tokens.refresh,
          userId: userData.user.id,
          userRole: userData.user.role
        })
        if (userData.user.role == UserRoleIndexs.consumer)
          router.replace({ pathname: '[visitor&cosumer]/(home)' })
        else
          router.replace({
            pathname: `/pageUserRoleUnknow?userRole=${userData.user.role}`
          })
      } catch (error) {
        var errorMessage = ""
        if (error.response) {
          if (error.response.status === 401) {
            errorMessage = "Credenciais inválidas"
          } else if (error.response.status === 403) {
            errorMessage = "Usuário desativado"
          } else if (error.response.status === 404) {
            errorMessage = "API não encontrada"
          } else {
            errorMessage = "Ocorreu um erro ao " +
              `autentificar-se. CODE_STATUS: ${error.response.status}`
          }
        } else if (error.request) {
          errorMessage = "Sem resposta do servidor"
        } else {
          // Error in request configures
          errorMessage = `Erro inesperado: ${error.message}`
        }
        var errorsObj = {
          general: `Cadastro realizado, porém erro ao realizar login: ${errorMessage}`
        }
        handleErros(errorsObj)
        throw Error
      }
    } finally { setIsLoading(false) }
  }

  return (
    <SafeAreaView style={[{
      flex: 1,
      backgroundColor: Colors.snowWhite
    },
    widthScreen > 600
      ? { backgroundColor: Colors.matteNeutralGray }
      : null
    ]}>
      {/* FIXME: Find a more robust solution than using a constant 
                 value for `extraScrollHeight`. The current approach does 
                 not adapt well to different screen sizes or keyboard heights.
                 Ideally, dynamically calculate the keyboard height to adjust 
                 the scroll offset accurately.
            */}
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        style={{ width: "100%" }}
        showsVerticalScrollIndicator={false}
        enableOnAndroid
        extraScrollHeight={300}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={{
            marginVertical: 20,
            flex: 1,
            alignItems: 'center'
          }}
        >
          {widthScreen > 600
            ? (
              // Logo image
              <Image
                source={require(
                  '@/assets/images/LogoVersaoExetendida.png'
                )}
                style={{
                  height: 100,
                  width: "100%",
                  maxWidth: 310
                }}
                resizeMode='contain'
              />
            ) : null}
          <ThemedView
            style={[
              {
                flex: 1,
                width: "100%",
                backgroundColor: Colors.snowWhite,
                paddingHorizontal: 24,
                flexDirection: 'column',
                alignItems: 'center',
                paddingVertical: 30,
                rowGap: 40
              },
              widthScreen > 600
                ? {
                  maxWidth: 600,
                  paddingHorizontal: 80,
                  borderRadius: 5
                } : null
            ]}
          >
            {widthScreen <= 600
              ? (
                // Logo image
                <Image
                  source={require(
                    '@/assets/images/LogoVersaoExetendida.png'
                  )}
                  style={{
                    height: 100,
                    width: "100%",
                    maxWidth: 310
                  }}
                  resizeMode='contain'
                />
              ) : null}
            <View
              style={{
                width: '100%',
                flexDirection: 'column',
                alignItems: 'center',
                rowGap: 15
              }}
            >
              <Text
                style={[
                  {
                    color: '#000',
                    fontSize: 28,
                    fontWeight: 'bold',
                  },
                  widthScreen > 600
                    ? { alignSelf: 'flex-start' }
                    : null
                ]}
              >
                Cadastre-se
              </Text>
              {textInputsInfosArray.map(item => (
                <CustomTextInput
                  key={item.placeholder}
                  editable={!isLoading}
                  {...item}
                />
              ))}
              <Pressable
                disabled={firstName == "" ||
                  lastName == "" ||
                  username == "" ||
                  email == "" ||
                  cpf == "" ||
                  phone == "" ||
                  address == "" ||
                  password == "" ||
                  passwordConfirmed == "" ||
                  isLoading}
                style={({ pressed }) => ({
                  opacity: firstName != "" &&
                    lastName != "" &&
                    username != "" &&
                    email != "" &&
                    cpf != "" &&
                    phone != "" &&
                    address != "" &&
                    password != "" &&
                    passwordConfirmed != ""
                    ? 1
                    : 0.75,
                  backgroundColor: pressed
                    ? Colors.sustainableLightGreen
                    : Colors.darkLeafGreen,
                  width: 130,
                  height: 50,
                  borderRadius: 8,
                  justifyContent: 'center',
                  alignItems: 'center'
                })}
                onPress={tryRegister}
              >
                {isLoading ? (
                  <ActivityIndicator
                    color={Colors.snowWhite}
                    size='large'
                  />
                ) : (
                  <Text
                    style={{
                      color: Colors.snowWhite,
                      fontSize: 16,
                      fontWeight: 'bold',
                    }}
                  >
                    {firstName != "" &&
                      lastName != "" &&
                      username != "" &&
                      email != "" &&
                      cpf != "" &&
                      phone != "" &&
                      address != "" &&
                      password != "" &&
                      passwordConfirmed != ""
                      ? "Cadastrar-se"
                      : "--"}
                  </Text>
                )}
              </Pressable>
              {errorArray[indexGeneralError][indexIsError]
                ? (
                  <Text
                    style={{
                      fontSize: 18,
                      color: Colors.sustainableTerracottaRed,
                      alignSelf: 'flex-start'
                    }}
                  >
                    {errorArray[indexGeneralError][indexMessageError]}!
                  </Text>
                ) : null}
            </View>
          </ThemedView>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView >
  )
}
