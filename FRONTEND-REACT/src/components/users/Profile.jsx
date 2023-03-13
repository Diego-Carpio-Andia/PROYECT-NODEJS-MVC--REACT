import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import avatar from '../../assets/img/user.png';
import { GetProfile } from '../../helpers/GetProfile';
import { Global } from '../../helpers/Global';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { PublicationList } from '../publication/PublicationList';
export const Profile = () => {
    const [user, setUser] = useState({});
    const params = useParams();
    const [counters, setCounters] = useState({});
    const { auth } = useAuth();
    const [iFollow, setIfollow] = useState(false);
    const [publications, setPublications] = useState([]);
    const [page, setPage] = useState(1);
    const [more, setMore] = useState(true);








    

    useEffect(() => {
        getDataUser();
        getCounters();
        getPublications(1,true);
    }, []);

    useEffect(() => {
        getDataUser();
        getCounters();
        setMore(true);
        getPublications(1, true);
    }, [params]);

    const getDataUser = async () => {
        let datauser = await GetProfile(params.userId, setUser);
        if (datauser.following && datauser.following._id) setIfollow(true);

        console.log(datauser);

    }

    const getCounters = async () => {
        const request = await fetch(Global.url + "user/counters/" + params.userId, {
            method: "GET",
            headers: {
                "content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        })

        const data = await request.json();
        console.log(data);
        if (data.status == "success") {
            setCounters(data);
        }
    }


    //seguir
    const follow = async (userId) => {
        const request = await fetch(Global.url + "follow/save", {
            method: "POST",
            body: JSON.stringify({ followed: userId }),
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        })

        const data = await request.json();
        if (data.status == "success") {
            setIfollow(true);
        }


    }

    const unfollow = async (userId) => {
        const request = await fetch(Global.url + "follow/unfollow/" + userId, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        })
        const data = await request.json();
        if (data.status == "success") {
            setIfollow(false);
        }

    }


    const getPublications = async (nextPage = 1, newProfile = false) => {
        const request = await fetch(Global.url + "publication/list/" + params.userId + "/" + nextPage, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }

        })

        const data = await request.json();
        console.log(data);
        if (data.status == "success") {
            let newPublications = data.publications;
            if(!newProfile && publications.length >= 1){
                newPublications = [...publications, ...data.publications];
            }

            if(newProfile){
                newPublications = data.publications;
                setMore(true);
                setPage(1);
            }
            setPublications(newPublications);
            console.log(publications.length);
            console.log(data.total);
            console.log(data.publications.length);

            if(!newProfile && publications.length >= (data.total*data.publications.length - data.publications.length)){
                setMore(false);
            }

            if(data.pages <= 1){
                setMore(false);
            }

        }
    }




    return (
        <>

            <header className="aside__profile-info">

                <div className="profile-info__general-info">
                    <div className="general-info__container-avatar">
                        {user.image != "dafault.png" ?
                            <img src={Global.url + "user/avatar/" + user.image} className="container-avatar__img" alt="Foto de perfil" />
                            : <img src={avatar} className="container-avatar__img" alt="Foto de perfil" />
                        }
                    </div>

                    <div className="general-info__container-names">
                        <div className="container-names__name">
                            <h1>{user.name} {user.surname}</h1>
                            {auth._id !== user._id &&
                                (iFollow ?
                                    <button onClick={e => unfollow(user._id)} className="post__button">Dejar de Seguir</button>
                                    :
                                    <button onClick={e => follow(user._id)} className="post__button post__button--green">Seguir</button>

                                )
                            }
                        </div>
                        <h2 className="container-names__nickname">{user.nick}</h2>
                        <p>{user.bio}</p>
                    </div>
                </div>

                <div className="profile-info__stats">

                    <div className="stats__following">
                        <Link to={"/social/siguiendo/" + user._id} className="following__link">
                            <span className="following__title">Siguiendo</span>
                            <span className="following__number">{counters.following >= 1 ? counters.following : "0"}</span>
                        </Link>
                    </div>
                    <div className="stats__following">
                        <Link to={"/social/seguidores/" + user._id} className="following__link">
                            <span className="following__title">Seguidores</span>
                            <span className="following__number">{counters.followed >= 1 ? counters.followed : "0"}</span>
                        </Link>
                    </div>


                    <div className="stats__following">
                        <Link to={"/social/perfil/" + user._id} className="following__link">
                            <span className="following__title">Publicaciones</span>
                            <span className="following__number">{counters.publications >= 1 ? counters.publications : "0"}</span>
                        </Link>
                    </div>


                </div>
            </header>

            <PublicationList 
                publications = {publications}
                getPublications = {getPublications}                
                page={page}
                setPage={setPage}
                more={more}
                setMore={setMore}
            ></PublicationList>
            


            


        </>
    )
}
