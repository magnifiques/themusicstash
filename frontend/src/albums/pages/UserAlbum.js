import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import AlbumList from '../components/AlbumList'
import { useHttpClient } from '../../shared/hooks/http-hook'

import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'

const UserAlbum = () => {

  const [ loadedAlbums, setLoadedAlbums ] = useState()
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const userId = useParams().userId;
  useEffect(() => {
    const fetchAlbums = async () => {
      try{
         const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/albums/creator/${userId}`,
         'GET')
         
         setLoadedAlbums(responseData.content.albums)
      }
      catch(error) {}
    }
    
    fetchAlbums()
  }, [sendRequest, userId])
  
  const albumsDeletedHandler = (deletedAlbumId) => {
    setLoadedAlbums(prevAlbums => prevAlbums.filter(album => album.id !== deletedAlbumId))
  }


  return (
    <>
    <ErrorModal error={error} onClear={clearError} />
    { isLoading &&
     <div className='center'>
      <LoadingSpinner />
    </div> }
    {!isLoading && loadedAlbums && <AlbumList albums={loadedAlbums} onDeleteAlbum={albumsDeletedHandler}/>}
    </>
  )
}

export default UserAlbum