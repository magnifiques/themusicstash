import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"

import { useAuth } from './shared/hooks/auth-hook';
import { AuthContext } from './shared/context/auth-context';
import MainNavigation from './shared/components/Navigation/MainNavigation'
import Loading from './shared/components/UIElements/Loading';

const Auth = React.lazy(() => import('./users/pages/Auth'));

const Users = React.lazy(() => import('./users/pages/Users'));
const UserAlbum = React.lazy(() => import('./albums/pages/UserAlbum'));
const NewAlbum = React.lazy(() => import('./albums/pages/NewAlbum'));
const UpdateAlbum = React.lazy(() => import('./albums/pages/UpdateAlbum'));
const DeleteUser = React.lazy(() => import('./users/components/DeleteUser'));

const App = () => {

  const { token, logIn, logOut, userId } = useAuth()

  let routes;

  if(token) {
    routes = (
      <Routes>
        <Route path="/" element={<Users />} />
        <Route path='/:userId/albums' element={<UserAlbum />} /> 
        <Route path='/albums/new' element={<NewAlbum />} /> 
        <Route path='/albums/:albumId' element={<UpdateAlbum />} />
        <Route path='/users/delete' element={<DeleteUser />} />
      </Routes>
    )
  }
  else {
    routes = (
      <Routes>
        <Route path="/" element={<Users />} />
        <Route path='/:userId/albums' element={<UserAlbum />} /> 
        <Route path="/auth" element={<Auth />} />
        
      </Routes>
    )
  }

  return (
  <AuthContext.Provider value={{
          isLoggedIn: !!token,
          token: token, 
          userId: userId,
          logIn: logIn, 
          logOut: logOut}}>
      <Router>
        <MainNavigation />
        <main>
            <Suspense fallback={
            <div className='center'>
              <Loading />
            </div>} >
            {routes}
            </Suspense>
        </main>
    </Router>
  </AuthContext.Provider>
  )
}

export default App;
