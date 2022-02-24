import { useState, useCallback, useEffect } from 'react'

let logOutTimer 

export const useAuth = () => {

  const [token, setToken] = useState();
  const [userId, setUserId] = useState()
  const [tokenExpiration, setTokenExpiration] = useState()
  
  const logIn = useCallback((uid, token, expirationDate) => {
    setToken(token)
    setUserId(uid)

    const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpiration(tokenExpirationDate)
    
    localStorage.setItem('userData', JSON.stringify({ 
      userId: uid, 
      token: token,
      expirationDate: tokenExpirationDate.toISOString() }))
  }, [])

  const logOut = useCallback(() => {
    setToken(null)
    setTokenExpiration(null)
    setUserId(null)
    localStorage.removeItem('userData')
  }, [])

  useEffect(() => {

    if(token && tokenExpiration) {
      const remainingTime = tokenExpiration.getTime() - new Date().getTime()
      logOutTimer = setTimeout(logOut, remainingTime)
    }

    else {
      clearTimeout(logOutTimer);
    }
  }, [token, logOut, tokenExpiration])

  useEffect(() => {
    const storageData = JSON.parse(localStorage.getItem('userData'))
    if(storageData && 
      storageData.token &&
       new Date(storageData.expirationDate) > new Date()) {
        logIn(storageData.userId, storageData.token, new Date(storageData.expirationDate))
    }
  }, [logIn])

  return {token, logIn, logOut, userId}
}