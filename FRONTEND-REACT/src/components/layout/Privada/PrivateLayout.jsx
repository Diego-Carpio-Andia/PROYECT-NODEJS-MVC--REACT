import React from 'react'
import { Header } from './Header'
import { SideBar } from './SideBar'
import { Outlet, Navigate } from 'react-router-dom'
import useAuth from '../../../hooks/useAuth'

export const PrivateLayout = () => {
    const {auth,loading} = useAuth();

    if(loading){
        return <h1>Cargando...</h1>
    }
    return (
        <>
            {/*LAYOUT*/}

            {/*CABECERA*/}
            <Header></Header>
            {/*CONTENIDO PRINCIPAL*/}
            <section className='layout__content'>
                {/*si existe el usuario mostramos el lado publico si no el privado*/}
                {auth._id ?
                <Outlet></Outlet>
                :  <Navigate to="/login" ></Navigate>
                }
            </section>
            {/*BARRA LATERAL*/}
            <SideBar></SideBar>
        </>
    )
}
