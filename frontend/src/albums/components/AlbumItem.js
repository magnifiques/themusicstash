import React, { useState, useContext } from 'react'
import Card from '../../shared/components/UIElements/Card'
import Button from '../../shared/components/FormElements/Button'
import Modal from '../../shared/components/UIElements/Modal'
import { AuthContext } from '../../shared/context/auth-context'
import './AlbumItem.css'
import { useHttpClient } from '../../shared/hooks/http-hook'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import { useNavigate } from 'react-router-dom'
import Loading from '../../shared/components/UIElements/Loading'


const AlbumItem = ({ id, title, artist, description, image, year, creator, onDelete }) => {

  const { isLoading, error, sendRequest, clearError } = useHttpClient()
  const navigate = useNavigate()

  const auth = useContext(AuthContext)
  const [ showConfirmModal, setShowConfirmModal ]  = useState(false)

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true)
  }

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false)
  }

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false)

    try{
      await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/albums/${id}`, 'DELETE', {
        'authorization': `Bearer ${auth.token}`
      },
      null )
      onDelete(id)
      navigate('/')
    }
    catch(error) {}
    
  }

  if(!auth.isLoggedIn) {
    return (
      <div className='center'>
        <Card>
          <h2>Please Log in to see the data</h2>
        </Card>
      </div>
    )
  }
  
  return (
    
    <>
      <ErrorModal error={error} onClear={clearError}/>
        <Modal 
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header='Are You Sure?' 
        footerClass='album-item__modal-actions'
        footer={
          <>
            {auth.isLoggedIn && <Button danger onClick={confirmDeleteHandler}>DELETE</Button>}
            {auth.isLoggedIn && <Button inverse onClick={cancelDeleteHandler}>CANCEL</Button>}
          </>
        }
        >
            <p>Do you want to proceed and delete this album? Please note that it can not be undone!</p>
        </Modal>
    
        <li className='album-item'>
          
          <Card className='album-item__content'>
              {isLoading && <Loading />}
              <div className='album-item__image'>
                <img src={`${process.env.REACT_APP_BACKEND_URL}/${image}`} alt={title}/>
              </div>

              <div className='album-item__info'>
                <h2>{title}</h2>
                <h3>{artist}</h3>
                <p>{description}</p>
                <p>Released In: {year}</p>
              </div>

              <div className='album-item__actions'>
                  {auth.userId === creator && <Button to={`/albums/${id}`}>EDIT</Button>}
                  {auth.userId === creator && <Button danger onClick={showDeleteWarningHandler}>DELETE</Button>}
              </div>
              
          </Card>
        </li>
    </>
  )
}

export default AlbumItem