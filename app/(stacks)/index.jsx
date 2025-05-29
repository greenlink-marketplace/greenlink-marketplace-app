import { CustomTextInput } from "@/components/CustomTextInput"
import { ThemedView } from '@/components/ThemedView'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  Text,
  View
} from 'react-native'
import { Colors } from "../../constants/Colors"
import tokenObtainPair from "../../services/accounts/tokenObtainPair"

export default function LoginScreen() {
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

  const router = useRouter()

  async function tryLogin() {
    setIsLoading(true)
    setErrorObj(defaultErroObj)

    try {
      var resquestData = {
        login,
        password
      }
      const userData = await tokenObtainPair(resquestData)
      router.push({
        pathname: '/home',
        params: { userData: JSON.stringify(userData) },
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
          alignItems: 'center'
        },
        Platform.OS == "web"
          ? { backgroundColor: Colors.matteNeutralGray }
          : null
      ]}
    >
      {Platform.OS == "web"
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
            gap: 16
          },
          Platform.OS == "web"
            ? {
              maxWidth: 600,
              maxHeight: 450,
              borderRadius: 5,
              paddingHorizontal: 80,
              paddingVertical: 20
            } : null
        ]}
      >
        {Platform.OS != "web"
          ? (
            // Imagem do logo
            <Image
              source={require('@/assets/images/LogoVersaoExetendida.png')}
              style={{
                height: 100,
                width: "100%",
                maxWidth: 310,
                marginVertical: 50
              }}
              resizeMode='contain'
            />
          ) : null}
        <Text
          style={[
            {
              color: '#000',
              fontSize: 28,
              fontWeight: 'bold',
            },
            Platform.OS == "web"
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
