import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import Input from '../../shared/components/FormElements/Input'
import './Auth.css'
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/components/util/Validator'
import { useForm } from '../../shared/hooks/form-hook'
import Button from '../../shared/components/FormElements/Button'
import { AuthContext } from '../../shared/context/auth-context'
import Card from '../../shared/components/UIElements/Card'

import ImageUpload from '../../shared/components/FormElements/ImageUpload'
import { useHttpClient } from '../../shared/hooks/http-hook'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import { css } from "@emotion/react";
import PuffLoader from "react-spinners/PuffLoader";
import Loading from '../../shared/components/UIElements/Loading'


const Auth = () => {

  const auth = useContext(AuthContext)
  const [isLoginMode, setIsLoginMode] = useState(true)
  const { isLoading, error, sendRequest, clearError } = useHttpClient()
  const navigate = useNavigate();
  
  const override = css`
  border-color: red;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  z-index: 1;
  `;

  

  const [formState, inputHandler, setFormData] = useForm({
    email: {
      value: '',
      isValid: false
    },
    password: {
      value: '',
      isValid: false
    }
  }, false)

  const switchModeHandler = () => {
    
    if(!isLoginMode) {
      setFormData({
        ...formState.inputs, 
        name: undefined,
        image: undefined
      }, formState.inputs.email.isValid && formState.inputs.password.isValid)
    }
    else {
      setFormData({
        ...formState.inputs,
        name: {
          value: '',
          isValid: false
        },
        image: {
          value: null,
          isValid: false  
        }
      }, false)
    }

    setIsLoginMode((isLoginMode) => !isLoginMode)
  }

  const authSubmitHandler = async (event) => {
    event.preventDefault();

    if(isLoginMode) {

      try {
        const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/users/login`, 
        'POST',
        {
          'Content-Type': 'application/json'
        },
        JSON.stringify({
          email: formState.inputs.email.value,
          password: formState.inputs.password.value
        }),
        )

          auth.logIn(responseData.content.id, responseData.token) 
          navigate('/')
      }

      catch(error) {
      }
        
      }
    else {

      try {
        const formData = new FormData();
        formData.append('email', formState.inputs.email.value)
        formData.append('name', formState.inputs.name.value)
        formData.append('password', formState.inputs.password.value)
        formData.append('image', formState.inputs.image.value)


        const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/users/signup`,
          'POST',
          {},
          formData)
          
          auth.logIn(responseData.content.id, responseData.token)  

          navigate('/')
        }

      catch(error) {
         
    }
  }
}


  return (
    <>
    {isLoading && <Loading />}
    
    <ErrorModal error={error} onClear={clearError} />
    
    <Card className='authentication'>
    
      <h2>Login Required</h2>
      <hr />

      <form onSubmit={authSubmitHandler}>
      
          {!isLoginMode && 
          <Input
          element='input'
          id='name'
          type='text'
          label='Your Name'
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please Enter A valid Name"
          onInput={inputHandler} />
          }

          {!isLoginMode && 
          <ImageUpload 
          center 
          id='image' 
          onInput={inputHandler}
          errorText='Please Upload a valid image'
          />}

          <Input 
            element='input'
            id='email'
            type='email'
            label='Email Address'
            validators={[VALIDATOR_EMAIL()]}
            errorText='Please enter A Valid E-mail!'
            onInput={inputHandler}
          />

          <Input 
            element='input'
            id='password'
            type='password'
            label='Password'
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText='Please enter A Valid password! (At least 6 characters)'
            onInput={inputHandler}
          /> 
          <Button type='submit' disabled={!formState.isValid}>
          {isLoginMode ? 'LOG IN' : 'SIGN UP'}
          </Button>     
      </form>
      
          <Button onClick={switchModeHandler}>Switch to {isLoginMode ? 'SIGN UP' : 'LOG IN'}</Button>
    </Card>
    </>
  )

}

export default Auth