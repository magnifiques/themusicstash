import React, { useState } from 'react'
import MainHeader from "./MainHeader"
import { Link } from 'react-router-dom'
import './MainNavigation.css'
import NavLinks from './NavLinks'

import SideDrawer from './SideDrawer'
import Backdrop from '../UIElements/Backdrop'

const MainNavigation = () => {

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const openDrawer = () => {
    setIsDrawerOpen(true)
  }

  const closeDrawer = () => {
    setIsDrawerOpen(false)
  }

  return (
    <>

      {isDrawerOpen && <Backdrop onClick={closeDrawer}/>}
      
      <SideDrawer show={isDrawerOpen} onClick={closeDrawer}>
          <nav className='main-navigation__drawer-nav'>
            <NavLinks />
          </nav>
      </SideDrawer>

      <MainHeader>
          <button className='main-navigation__menu-btn' onClick={openDrawer}>
              <span />
              <span />
              <span />
          </button>
          <h1 className='main-navigation__title'>
              <Link to="/">The Music Stash</Link>
          </h1>

          <nav className='main-navigation__header-nav'>
            <NavLinks />
          </nav>

      </MainHeader>

    </>
  )
}

export default MainNavigation