import React from 'react'
import { Routes, Route, BrowserRouter, Navigate, Link } from 'react-router-dom';
import { Followers } from '../components/follow/Followers';
import { Following } from '../components/follow/Following';
import { PrivateLayout } from '../components/layout/Privada/PrivateLayout';
import { PublicLayout } from '../components/layout/Publica/PublicLayout';
import { Feed } from '../components/publication/Feed';
import { Config } from '../components/users/Config';
import { Login } from '../components/users/Login';
import { Logout } from '../components/users/Logout';
import { People } from '../components/users/People';
import { Profile } from '../components/users/Profile';
import { Register } from '../components/users/Register';
import { AuthProvider } from '../context/AuthProvider';

export const Routing = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/*solo ingresa con esa ruta base (/) */}
          <Route path="/" element={<PublicLayout></PublicLayout>}>
            {/*index => ruta predeterminada*/}
            <Route index element={<Login></Login>}></Route>
            <Route path="login" element={<Login></Login>}></Route>
            <Route path="registro" element={<Register></Register>}></Route>
          </Route>
          {/*solo ingresa con esa ruta de /social esta ruta ya tiene el prefijo =>  /social/ */}
          <Route path='/social' element={<PrivateLayout></PrivateLayout>}>
            {/*index => ruta predeterminada*/}
            <Route index element={<Feed></Feed>}></Route>
            <Route path='feed' element={<Feed></Feed>}></Route>
            <Route path='gente' element={<People></People>}></Route>
            <Route path='ajustes' element={<Config></Config>}></Route>
            <Route path='logout' element={<Logout></Logout>}></Route>
            <Route path='siguiendo/:userId' element={<Following></Following>}></Route>
            <Route path='seguidores/:userId' element={<Followers></Followers>}></Route>
            <Route path='perfil/:userId' element={<Profile></Profile>}></Route>
            
          </Route>

          <Route path="*" element={
            <>
              <p>
                <h1>Error 404</h1>
                <Link to="/">Volver al inicio</Link>
              </p>
            </>
          }></Route>

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}



{/* formatear fechas con react time ago de npm 
npm install react-time-ago javascript-time-ago --save
 */}
