import React, { useEffect, useState } from 'react'
import UsersList from '../components/UsersList'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'


const Users = () => {

 const [isLoading, setIsLoading] = useState(false)
 const [error, setError] = useState()
 const [loadedUsers, setLoadedUsers] = useState([])

 useEffect(() => {
      setLoadedUsers([])
      setIsLoading(true)
     
        const sendRequest = async () =>  {
          
          try {
          const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users/`, { 
            method: 'GET'
          });
  
          const responseData = await response.json()
          
          
          
           setLoadedUsers(responseData.content)
          console.log(loadedUsers)
        }
           catch(error) {
            setError(error.message)
          }
          setIsLoading(false)
        }
      
      sendRequest();

 }, []) 

 const errorHandler = () => {
   setError(null)
 }

  return ( 
  <>
  <ErrorModal error={error} onClear={errorHandler} />
  {isLoading && <div className='center' >
    <LoadingSpinner />
  </div>}
  {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
  </>)
}

export default Users