import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from "react-router-dom"
import './NewAlbum.css'

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH, VALIDATOR_YEAR } from '../../shared/components/util/Validator';
import { useForm } from '../../shared/hooks/form-hook';
import Loading from '../../shared/components/UIElements/Loading';

import { useHttpClient } from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { AuthContext } from '../../shared/context/auth-context';

const UpdateAlbum = () => {
 
  const auth = useContext(AuthContext)

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [ loadedAlbums, setLoadedAlbums ] = useState()
  const albumId = useParams().albumId;
  const navigate = useNavigate();

  const [formState, inputHandler, setFormData] = useForm({
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
      
  }, false)

  useEffect(() => {
    
    const fetchAlbum = async () => {

      try {

        const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/albums/${albumId}`, 'GET',
        { 'authorization': `Bearer ${auth.token}` })
        setLoadedAlbums(responseData.content)

        setFormData({
          title: {
            value: responseData.content.title,
            isValid: true
          },
      
          artist: {
            value: responseData.content.artist,
            isValid: true
          },
      
          description: {
            value: responseData.content.description,
            isValid: true
          },
      
          year: {
            value: responseData.content.year,
            isValid: true
          },
        }, true)
      }
      catch(error) {}
    };

    fetchAlbum()
  }, [sendRequest, albumId, setFormData])

  const albumsUpdateHandler = async (event) => {

    event.preventDefault();
    console.log(auth.token);
    try {
      await sendRequest(`http://localhost:5000/albums/${albumId}`, 'PATCH', 
      {'authorization': 'Bearer ' + auth.token,
       'Content-Type': 'application/json'},
      JSON.stringify({
        title: formState.inputs.title.value,
        artist: formState.inputs.artist.value,
        description: formState.inputs.description.value,
        year: formState.inputs.year.value
      })
      )

      navigate(`/${auth.userId}/albums`)
    }
    
    catch(error) {}
    
  }

 

  


  if(isLoading) {
    return (<Loading />)
  }
  

  if(!loadedAlbums && !error) {
      return(
          <div className='center'>
              <h2>Album Not Found</h2>
          </div>
      )
  }

 
  return (

    <>

    <ErrorModal error={error} onClear={clearError} />
    {!isLoading && loadedAlbums && <form className='album-form' onSubmit={albumsUpdateHandler}>
        <Input 
            id='title' 
            element='input' 
            type="text" 
            label='title'
            validators={[VALIDATOR_REQUIRE()]}
            onInput={inputHandler}
            initialValue={loadedAlbums.title}
            initialValid={true}
            errorText="Please Enter the valid title"
        />

        <Input 
            id="artist"
            element='input' 
            type="text" 
            label='Artist'
            validators={[VALIDATOR_REQUIRE()]}
            onInput={inputHandler}
            initialValue={loadedAlbums.artist}
            initialValid={true}
            errorText="Please Enter the valid name of an artist" />

        <Input 
            id='description' 
            element='textarea'  
            label='description'
            validators={[VALIDATOR_MINLENGTH(5)]}
            onInput={inputHandler}
            initialValue={loadedAlbums.description}
            initialValid={true}
            errorText="Please Enter a valid description (at least 5 character)"
        />

        <Input 
            id="year"
            element='input' 
            type="number" 
            label='Year'
            validators={[VALIDATOR_REQUIRE(), VALIDATOR_YEAR(4)]}
            onInput={inputHandler}
            initialValue={loadedAlbums.year}
            initialValid={true}
            errorText="Please Enter a valid year" /> 

    <Button disabled={!formState.isValid}>Update Album</Button>
    </form>}
    </>

  )
}

export default UpdateAlbum