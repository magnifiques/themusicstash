import React, { useContext } from 'react'
import AlbumItem from './AlbumItem'
import Card from '../../shared/components/UIElements/Card'
import Button from '../../shared/components/FormElements/Button'

import './AlbumList.css'
import './AlbumItem.css'
import { AuthContext } from '../../shared/context/auth-context'


const AlbumList = ({albums, onDeleteAlbum}) => {

    const auth = useContext(AuthContext)
    
  if(albums.length === 0) {
      return(

          <div className='album-list center'>
          {auth.isLoggedIn ? 
            <Card className='album-item__content'>
              <h2>No Albums Found. Maybe Add one?</h2>
              <Button to='/albums/new'>Add Album</Button>
          </Card> :
          <h2>Log In to See the Albums</h2>}
          
      </div> 
          
      )
  }

  return(
     <ul className='album-list'>
         {albums.map((album) => <AlbumItem 
             key={album.id}
             id={album.id}
             title={album.title}
             artist={album.artist}
             description={album.description}
             image={album.image}
             year={album.year}
             creator={album.creator}
             onDelete={onDeleteAlbum}
         />)}
     </ul> 
  )
}

export default AlbumList