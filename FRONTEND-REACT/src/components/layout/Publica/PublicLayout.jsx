import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '../../../hooks/useAuth'
import { Header } from './Header'

export const PublicLayout = () => {

    const {auth} = useAuth();

    return (
        <>
            {/*LAYOUT*/}

            {/*CABECERA*/}
            <Header></Header>
            {/*CONTENIDO PRINCIPAL*/}
            <section className='layout__content'>
                {/*si existe el usuario mostramos el lado publico si no el privado*/}
                {!auth._id ?
                <Outlet></Outlet>
                :  <Navigate to="/social" ></Navigate>
                }
            </section>
        </>
    )
}
