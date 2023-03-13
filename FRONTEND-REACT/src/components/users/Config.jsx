import React, { useState } from 'react'
import useAuth from '../../hooks/useAuth';
import avatar from '../../../src/assets/img/user.png';
import { Global } from '../../helpers/Global';
import { SerializeForm } from '../../helpers/SerializeForm';

export const Config = () => {

    const { auth, setAuth } = useAuth();

    const [saved, setSaved] = useState("not_sended");

    const token = localStorage.getItem("token");

    const updateUser = async(e) => {
        e.preventDefault();

        let newDataUser = SerializeForm(e.target);
        delete newDataUser.file0;

        const request = await fetch(Global.url + "user/update", {
            method: "PUT",
            body: JSON.stringify(newDataUser),
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        })

        const data = await request.json();
        console.log(data.user);

        if(data.status === "success" && data.user){
            delete data.user.password;

            setAuth(data.user);
            setSaved("saved");
            console.log(auth);
        }else{
            setSaved("error");
        }

        const fileInput = document.querySelector("#file");
        if(data.status === "success" && fileInput.files[0]){
            const formData = new FormData();
            formData.append('file0', fileInput.files[0]);
            const uploadRequest = await fetch(Global.url + "user/upload", {
                method: "POST",
                body: formData,
                headers: {
                    "Authorization": token
                }
            });

            const uploadData = await uploadRequest.json();

            if(uploadData.status === "success" && uploadData.user){
                delete uploadData.user.password;
                setAuth(uploadData.user);
                setSaved("saved");
            }else{
                setSaved("error");
            }


        }


    }
    return (
        <>
            <header className="content__header content__header--public">
                <h1 className="content__title">Ajustes</h1>
            </header>

            <div className="content__posts">
                {saved === "saved" ?
                    <strong className='alert alert-success'>Usuario actualizado Correctamente</strong>
                    : ""}

                {saved === "error" ?
                    <strong className='alert alert-danger'>El usuario no ha podido actualizarse</strong>
                    : ""}


                <form className='config-form' onSubmit={updateUser}>

                    <div className='form-group'>
                        <label htmlFor='name'>Nombre</label>
                        <input type="text" name="name" defaultValue={auth.name}></input>
                    </div>

                    <div className='form-group'>
                        <label htmlFor='surname'>Apellidos</label>
                        <input type="text" name="surname" defaultValue={auth.surname}></input>
                    </div>

                    <div className='form-group'>
                        <label htmlFor='nick'>Nick</label>
                        <input type="text" name="nick" defaultValue={auth.nick}></input>
                    </div>

                    <div className='form-group'>
                        <label htmlFor='email'>Correo Electronico</label>
                        <input type="email" name="email" defaultValue={auth.email}></input>
                    </div>


                    <div className='form-group'>
                        <label htmlFor='bio'>Biografia</label>
                        <textarea name="bio" defaultValue={auth.bio} />
                    </div>

                    <div className='form-group'>
                        <label htmlFor='password'>Contraseña</label>
                        <input type="password" name="password" ></input>
                    </div>

                    <div className='form-group'>
                        <label htmlFor='file0'>Avatar</label>
                        
                        {/*mostrar imagen*/}
                        <div className="general-info__container-avatar">
                            {auth.image != "dafault.png" ?
                                <img  src={Global.url + "user/avatar/" + auth.image} className="container-avatar__img avatargod" alt="Foto de perfil" />
                                : <img  src={avatar} className="container-avatar__img avatargod" alt="Foto de perfil" />
                            }
                        </div>


                        <input  id="file" className='custom-file-input' type="file" name="file0" ></input>
                    </div>


                    <input type={"submit"} value="Actualizar" className='btn btn-success'></input>

                </form>

            </div>
        </>
    )
}
