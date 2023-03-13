import React from 'react'
import { useState } from 'react';
import { Global } from '../../helpers/Global';
import { useForm } from '../../hooks/useForm'

export const Register = () => {

  const { form, changed } = useForm({});
  const [saved, setSaved] = useState("not_sended");

  const saveUser = async (e) => {
    e.preventDefault();
    let NewUser = form;
    const request = await fetch(Global.url + "user/register", {
      method: "POST",
      body: JSON.stringify(NewUser),
      headers: {
        "Content-Type": "application/json"
      }

    })

    const data = await request.json();
    if (data.status === "success") {
      setSaved("saved");
    } else {
      setSaved("error");
    }


    console.log(data);

  }


  return (
    <>
      <header className="content__header content__header--public">
        <h1 className="content__title">Registro</h1>
      </header>

      <div className="content__posts">
        {saved === "saved" ?
          <strong className='alert alert-success'>Usuario Registrado Correctamente</strong>
          : ""}

        {saved === "error" ?
          <strong className='alert alert-danger'>No se pudo registrar el usuario</strong>
          : ""}


        <form className='register-form' onSubmit={saveUser}>

          <div className='form-group'>
            <label htmlFor='name'>Nombre</label>
            <input type="text" name="name" onChange={changed}></input>
          </div>

          <div className='form-group'>
            <label htmlFor='surname'>Apellidos</label>
            <input type="text" name="surname" onChange={changed}></input>
          </div>

          <div className='form-group'>
            <label htmlFor='nick'>Nick</label>
            <input type="text" name="nick" onChange={changed}></input>
          </div>

          <div className='form-group'>
            <label htmlFor='email'>Correo Electronico</label>
            <input type="email" name="email" onChange={changed}></input>
          </div>

          <div className='form-group'>
            <label htmlFor='password'>Contraseña</label>
            <input type="password" name="password" onChange={changed}></input>
          </div>

          <input type={"submit"} value="Registrate" className='btn btn-success'></input>


        </form>
      </div>
    </>
  )
}
