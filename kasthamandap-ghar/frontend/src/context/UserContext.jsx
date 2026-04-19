import React, { createContext, useState, useEffect, useContext, useCallback } from 'react'

const UserContext = createContext()

export const useUser = () => useContext(UserContext)

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo')
    if (userInfo) {
      try {
        setUser(JSON.parse(userInfo))
      } catch (error) {
        console.error('Error parsing user info:', error)
        localStorage.removeItem('userInfo')
      }
    }
  }, [])

  const login = useCallback((userData) => {
    localStorage.setItem('userInfo', JSON.stringify(userData))
    setUser(userData)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('userInfo')
    localStorage.removeItem('cartItems')
    setUser(null)
  }, [])

  const updateUser = useCallback((userData) => {
    localStorage.setItem('userInfo', JSON.stringify(userData))
    setUser(userData)
  }, [])

  const value = {
    user,
    login,
    logout,
    updateUser
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}