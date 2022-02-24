import React, { useContext, useEffect, useState } from 'react'
import { useHttpClient } from '../../shared/hooks/http-hook'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import Loading from '../../shared/components/UIElements/Loading'
import { AuthContext } from '../../shared/context/auth-context'
import DeleteUserList from './DeleteUserList'

const DeleteUser = () => {

  const auth = useContext(AuthContext)

  const [ loadedUsers, setLoadedUsers ] = useState()
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
   
    const fetchUsers = async () => {

      try{
         const response = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/users/creator/${auth.userId}`,
         'GET',
         { 'authorization': `Bearer ${auth.token}` },
         null)
         console.log(auth.token)
          setLoadedUsers(response.content)
      }
      catch(error) {}
    }
    
    fetchUsers()
  }, [])

  return (
    <>
        <ErrorModal error={error} onClear={clearError} />
        {isLoading && <Loading />}
        {!isLoading && loadedUsers && <DeleteUserList users={loadedUsers} />}
    </>
  )
}

export default DeleteUser