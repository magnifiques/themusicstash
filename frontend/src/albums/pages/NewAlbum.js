import React, { useContext } from 'react'
import './NewAlbum.css'
import { useNavigate } from 'react-router-dom'
import { VALIDATOR_YEAR, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/components/util/Validator'

import ImageUpload from '../../shared/components/FormElements/ImageUpload'
import Input from "../../shared/components/FormElements/Input"
import Button from '../../shared/components/FormElements/Button'
import ErrorModal from "../../shared/components/UIElements/ErrorModal"
import Loading from '../../shared/components/UIElements/Loading'

import { AuthContext } from '../../shared/context/auth-context'
import { useForm } from '../../shared/hooks/form-hook'
import { useHttpClient } from "../../shared/hooks/http-hook"

const NewAlbum = () => {

    const auth = useContext(AuthContext)
    const { isLoading, error, sendRequest, clearError } = useHttpClient()
    const navigate = useNavigate();


    const [formState, inputHandler] = useForm(
    {  
      title: {
        value: '',
        isValid: false
      },

      artist: {
        value: '',
        isValid: false
      },

      description: {
        value: '',
        isValid: false
      },

      year: {
        value: '',
        isValid: false
      },

      image: {
        value: null,
        isValid: false
      }
    },

    false
  )
  
  
  const formSubmitHandler = async (event) => {

    event.preventDefault();
    try {
      const formData = new FormData()

      formData.append('title', formState.inputs.title.value)
      formData.append('artist', formState.inputs.artist.value)
      formData.append('description', formState.inputs.description.value)
      formData.append('year', formState.inputs.year.value)
      formData.append('image', formState.inputs.image.value)
      formData.append('creator', auth.userId)

      await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/albums/`, 
      'POST', 
      { 'authorization': `Bearer ${auth.token}` }, 
      formData)
      navigate('/')
    }
    catch(error) {}
    
  }

  return (

    <>
    {isLoading && <Loading />}  
    <ErrorModal error={error} onClear={clearError} />

    <form className='album-form' onSubmit={formSubmitHandler}>
    
    
      <Input
      id='title' 
      element='input' 
      type="text" 
      label='title'
      validators={[VALIDATOR_REQUIRE()]}
      onInput={inputHandler}
      errorText="Please Enter the valid title" />

      <Input 
      id="artist"
      element='input' 
      type="text" 
      label='Artist'
      validators={[VALIDATOR_REQUIRE()]}
      onInput={inputHandler}
      errorText="Please Enter the valid name of an Artist" />

      <Input 
      id="description"
      element='textarea'  
      label='Description'
      validators={[VALIDATOR_MINLENGTH(5)]}
      onInput={inputHandler}
      errorText="Please Enter a valid description (at least 5 character)" />

      <Input 
      id="year"
      element='input' 
      type="number" 
      label='Year'
      validators={[VALIDATOR_REQUIRE(), VALIDATOR_YEAR(4)]}
      onInput={inputHandler}
      errorText="Please Enter a valid year" />  

      <ImageUpload center 
      id='image' 
      onInput={inputHandler} 
      errorText='Please Upload a valid image' />
      
      <Button 
            type='submit'
            disabled={!formState.isValid}>
            ADD Album
      </Button>

    </form>
    </>
  )
}

export default NewAlbum