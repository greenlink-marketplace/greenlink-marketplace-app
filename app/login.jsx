import { CustomTextInput } from "@/components/CustomTextInput"
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
import { SafeAreaView } from "react-native-safe-area-context"
import { Colors } from "../constants/Colors"
import UserRoleIndexs from '../constants/UserRoleIndexs'
import useAuthContext from "../hooks/useAuthContext"
import postTokenObtainPair from "../services/accounts/postTokenObtainPair"

export default function LoginScreen() {
  const { width: widthScreen, height } = useWindowDimensions()
  const [isLoading, setIsLoading] = useState(false)
  const [login, setLogin] = useState("")
  const [password, setPassword] = useState("")
  const [isButtonRegisterPressed, setIsButtonRegisterPressed] = useState(false)
  const indexIsError = "isError"
  const indexMessageError = "messageError"
  const defaultErroObj = {
    [indexIsError]: false,
    [indexMessageError]: ""
  }
  const [errorObj, setErrorObj] = useState(defaultErroObj)
  const { handleCredentials } = useAuthContext()

  const router = useRouter()

  async function tryLogin() {
    setIsLoading(true)
    setErrorObj(defaultErroObj)

    try {
      var resquestData = {
        login,
        password
      }
      const userData = await postTokenObtainPair(resquestData)
      handleCredentials({
        tokenAcess: userData.tokens.access,
        tokenRefresh: userData.tokens.refresh,
        userId: userData.user.id,
        userRole: userData.user.role
      })
      if (userData.user.role == UserRoleIndexs.consumer)
        router.replace({ pathname: '/(home)' })
      else
        router.replace({
          pathname: `/pageUserRoleUnknow?userRole=${userData.user.role}`
        })
    } catch (error) {
      var newErrorObj = {
        [indexIsError]: true
      }
      if (error.response) {
        if (error.response.status === 401) {
          newErrorObj[indexMessageError] = "Credenciais inválidas"
        } else if (error.response.status === 403) {
          newErrorObj[indexMessageError] = "Usuário desativado"
        } else if (error.response.status === 404) {
          newErrorObj[indexMessageError] = "API não encontrada"
        } else {
          newErrorObj[indexMessageError] = "Ocorreu um erro ao " +
            `autentificar-se. CODE_STATUS: ${error.response.status}`
        }
      } else if (error.request) {
        newErrorObj[indexMessageError] = "Sem resposta do servidor"
      } else {
        // Error in request configures
        newErrorObj[indexMessageError] = `Erro inesperado: ${error.message}`
      }
      setErrorObj(newErrorObj)
    }

    setIsLoading(false)
  }

  function navigateRegisterLogin() {
    router.push({ pathname: '/register' })
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
        // Platform.OS == "web"
        widthScreen > 600
          ? { backgroundColor: Colors.matteNeutralGray }
          : null
      ]}
    >
      {widthScreen > 600
        ? (
          // Logo image
          <Image
            source={require('@/assets/images/LogoVersaoExetendida.png')}
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
            flexDirection: 'column',
            alignItems: 'center',
            padding: 30,
            rowGap: 40
          },
          widthScreen > 600
            ? {
              maxWidth: 600,
              maxHeight: 450,
              borderRadius: 5,
              paddingHorizontal: 80,
              paddingVertical: 20
            } : null
        ]}
      >
        {widthScreen <= 600
          ? (
            <Image
              source={require('@/assets/images/LogoVersaoExetendida.png')}
              style={{
                height: 100,
                width: "100%",
                // maxWidth: 310,
                // marginVertical: 50
              }}
              resizeMode='contain'
            />)
          : null}
        <View
          style={{
            width: '100%',
            rowGap: 15,
            flexDirection: 'column',
            alignItems: 'center'
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
            Faça seu Login
          </Text>
          <CustomTextInput
            editable={!isLoading}
            placeholder="Username ou E-mail"
            value={login}
            onChangeText={setLogin}
            keyboardType="email-address"
            error={errorObj[indexIsError]}
          />
          <CustomTextInput
            editable={!isLoading}
            placeholder="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            error={errorObj[indexIsError]}
          />
          <Pressable
            disabled={login == "" || password == "" || isLoading}
            style={({ pressed }) => ({
              opacity: login == "" || password == "" ? 0.75 : 1,
              backgroundColor: pressed
                ? Colors.sustainableLightGreen
                : Colors.darkLeafGreen,
              width: 130,
              height: 50,
              borderRadius: 8,
              justifyContent: 'center',
              alignItems: 'center'
            })}
            onPress={tryLogin}
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
                {login != "" && password != ""
                  ? "Entrar"
                  : "--"}
              </Text>
            )}
          </Pressable>
          {errorObj[indexIsError]
            ? (
              <Text
                style={{
                  fontSize: 18,
                  color: Colors.sustainableTerracottaRed,
                  alignSelf: 'flex-start'
                }}
              >
                {errorObj[indexMessageError]}!
              </Text>
            ) : null}
        </View>
        <View style={{ flex: 1, flexDirection: 'column-reverse' }}>
          <Pressable
            disabled={isLoading}
            style={{ opacity: isLoading ? 0.5 : 1 }}
            onPressIn={() => setIsButtonRegisterPressed(true)}
            onPressOut={() => setIsButtonRegisterPressed(false)}
            onPress={navigateRegisterLogin}
          >
            <Text
              style={{
                textDecorationLine: isButtonRegisterPressed
                  ? 'underline'
                  : 'none',
                color: isButtonRegisterPressed
                  ? Colors.mediumGreenProfessional
                  : "#000",
                fontSize: 16
              }}
            >
              Novo por aqui? Crie sua conta.
            </Text>
          </Pressable>
        </View>
      </ThemedView>
    </SafeAreaView>
  )
}