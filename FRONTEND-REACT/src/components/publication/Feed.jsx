import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import avatar from '../../assets/img/user.png';
import { Global } from '../../helpers/Global';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { PublicationList } from '../publication/PublicationList';

export const Feed = () => {
    const params = useParams();
    const { auth } = useAuth();
    const [publications, setPublications] = useState([]);
    const [page, setPage] = useState(1);
    const [more, setMore] = useState(true);

    useEffect(() => {
        getPublications(1, false);
    }, []);


    const getPublications = async (nextPage = 1, showNews = false) => {
        
        if(showNews){
            setPublications([]);
            setPage(1);
            nextPage = 1;


        }

        const request = await fetch(Global.url + "publication/feed/" + nextPage, {
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
            if(!showNews && publications.length >= 1){
                newPublications = [...publications, ...data.publications];
            }

            
            setPublications(newPublications);
            console.log(publications.length);
            console.log(data.total);
            console.log(data.publications.length);

            if(!showNews  && publications.length >= (data.total*data.publications.length - data.publications.length)){
                setMore(false);
            }

            if(data.pages <= 1){
                setMore(false);
            }

        }
    }






    return (

        <>
            <header className="content__header">
                <h1 className="content__title">Feed</h1>
                <button className="content__button" onClick={()=>getPublications(1,true)}>Mostrar nuevas</button>
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
