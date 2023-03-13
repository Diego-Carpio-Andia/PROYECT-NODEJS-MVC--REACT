import React,  {useState} from 'react'
import { Global } from '../../helpers/Global';
import useAuth from '../../hooks/useAuth';
import { useForm } from '../../hooks/useForm'


export const Login = () => {
  const { form, changed } = useForm({});
  const [saved, setSaved] = useState("not_sended");

  const {setAuth} = useAuth();

  const loginUser = async (e) => {
    e.preventDefault();
    let userToLogin = form;
    console.log(form);
    const request = await fetch(Global.url + "user/login", {
      method: "POST",
      body: JSON.stringify(userToLogin),
      headers: {
        "Content-Type": "application/json"
      }

    });

    const data = await request.json();
    console.log(data);

    if (data.status === "success") {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      setSaved("saved");
      setAuth(data.user);

      setTimeout(()=>{
        window.location.reload();
      }, 1000)


    } else {
      setSaved("error");
    }

  }

  return (
    <>
      <header className="content__header content__header--public">
        <h1 className="content__title">Login</h1>
      </header>



      <div className="content__posts">

        {saved === "saved" ?
          <strong className='alert alert-success'>Usuario Identificado Correctamente</strong>
          : ""}

        {saved === "error" ?
          <strong className='alert alert-danger'>No se pudo Identificar el usuario</strong>
          : ""}



        <form className='form-login' onSubmit={loginUser}>


          <div className='form-group'>
            <label htmlFor='email'>Email</label>
            <input type="email" name="email" onChange={changed}></input>
          </div>


          <div className='form-group'>
            <label htmlFor='password'>Contraseña</label>
            <input type="password" name="password" onChange={changed}></input>
          </div>

          <input type="submit" value="Identificate" className='btn btn-success'></input>


        </form>
      </div>
    </>
  )
}
