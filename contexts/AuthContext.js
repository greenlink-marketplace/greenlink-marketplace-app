import { createContext, useState } from 'react'
import setHeaderAuthorization from '../services/headerAuthorization'
// import * as SecureStore from 'expo-secure-store'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [isVisitor, setIsVisitor] = useState(true)
  const [tokenAcess, setTokenAcess] = useState(null)
  const [tokenRefresh, setTokenRefresh] = useState(null)
  const [userId, setUserId] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [userData, setUserData] = useState(null)

  //   useEffect(() => {
  //     SecureStore.getItemAsync('token').then(setToken)
  //   }, [])

  function handleCredentials({
    tokenAcess,
    tokenRefresh,
    userId,
    userRole,
    userData = {}
  }) {
    //     await SecureStore.setItemAsync('token', token)
    setHeaderAuthorization(tokenAcess)
    setIsVisitor(false)
    setTokenAcess(tokenAcess)
    setTokenRefresh(tokenRefresh)
    setUserId(userId)
    setUserRole(userRole)
    setUserData(userData)
  }

  function updateUserData(newData) {
    setUserData(newData)
  }

  function cleanCredetials() {
    //     await SecureStore.deleteItemAsync('token')
    setIsVisitor(true)
    setTokenAcess(null)
    setTokenRefresh(null)
    setUserId(null)
    setUserRole(null)
    setUserData(null)
  }

  return (
    <AuthContext.Provider value={{
      isVisitor,
      tokenAcess,
      tokenRefresh,
      userId,
      userRole,
      userData,
      handleCredentials,
      updateUserData,
      cleanCredetials
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext