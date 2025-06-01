import { createContext, useState } from 'react'

const HomeTabsContext = createContext()

export const HomeTabsProvider = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState(null)

  return (
    <HomeTabsContext.Provider value={{ currentScreen, setCurrentScreen }}>
      {children}
    </HomeTabsContext.Provider>
  )
}

export default HomeTabsContext