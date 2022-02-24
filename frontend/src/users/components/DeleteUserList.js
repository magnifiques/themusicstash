import React, { useState, useContext } from 'react'
import Button from '../../shared/components/FormElements/Button'
import Modal from '../../shared/components/UIElements/Modal'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import { useHttpClient } from '../../shared/hooks/http-hook'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../shared/context/auth-context'
import Card from '../../shared/components/UIElements/Card'
import Loading from '../../shared/components/UIElements/Loading'

import './DeleteUserList.css'


const DeleteUserList = (props) => {

  
  

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
      await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/users/delete/${auth.userId}`, 'DELETE', {
        'authorization': `Bearer ${auth.token}`
      },
      null )
      auth.logOut()
      navigate('/')
    }
    catch(error) {}
    
  }
  return (
    <>
      <ErrorModal error={error} onClear={clearError}/>
        <Modal 
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header='Are You Sure?' 
        footerClass='delete-item__modal-actions'
        footer={
          <>
            <Button danger onClick={confirmDeleteHandler}>DELETE</Button>
            <Button inverse onClick={cancelDeleteHandler}>CANCEL</Button>
          </>
        }
        >
            <p>Do you want to proceed and delete your account? Please note that it can not be undone!</p>
        </Modal>
        <h1 className='center'>Delete Your Account</h1>
        <ul className='delete-list'>
        <li className='delete-item'>
          
          <Card className='delete-item__content'>
              {isLoading && <Loading />}
              <div className='delete-item__image'>
                <img src={`${process.env.REACT_APP_BACKEND_URL}/${props.users.image}`} alt={props.users.name}/>
              </div>

              <div className='delete-item__info'>
                <h2>{props.users.name}</h2>
                <h3>{props.users.email}</h3>
                
              </div>

              <div className='delete-item__actions'> 
                 <Button danger onClick={showDeleteWarningHandler}>DELETE</Button>
              </div>
              
          </Card>
        </li>
        </ul>
    </>
  )
}

export default DeleteUserList