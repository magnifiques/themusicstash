import React, { useContext } from 'react'
import './NavLinks.css'
import { NavLink, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/auth-context'
import Button from '../FormElements/Button'

const NavLinks = () => {

    const auth = useContext(AuthContext);
    const navigate = useNavigate()

    const logOutHandler = () => {
      auth.logOut()
      navigate('/auth')
    }
    return (
      <ul className='nav-links'>
          <li>
              <NavLink to="/">All Users</NavLink>
          </li>

          {auth.isLoggedIn && 
            <li>
              <NavLink to={`/${auth.userId}/albums`}>My Albums</NavLink>
            </li>}
         
          {auth.isLoggedIn && 
            <li>
              <NavLink to="/albums/new">Add New Album(s)</NavLink>
            </li>}
          
          {auth.isLoggedIn &&  <li>
              <NavLink to="/users/delete">Delete Your Account</NavLink>
            </li>}
          

          {!auth.isLoggedIn && 
          <li>
              <NavLink to="/auth">Authenticate</NavLink>
          </li>}

          
          {auth.isLoggedIn && <Button onClick={logOutHandler}>LOG OUT</Button>}
          
      </ul>
  )
}

export default NavLinks