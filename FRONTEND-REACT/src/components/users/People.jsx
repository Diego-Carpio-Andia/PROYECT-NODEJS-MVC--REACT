import React, { useEffect, useState } from 'react'
import { Global } from '../../helpers/Global';
import { UserList } from './userList';


export const People = () => {

  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    getUsers(1);
  }, [])

  const getUsers = async (nextPage = 1) => {

    setLoading(true);

    const request = await fetch(Global.url + "user/list/" + nextPage, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem("token")
      }


    });



    const data = await request.json();



    console.log(data);
    if (data.users && data.status == "success") {
      let newUsers = data.users;
      console.log(users.length); 
      if (users.length >= 1) {
        newUsers = [...users, ...data.users];

      }

      setUsers(newUsers);
      setFollowing(data.followInfo.following);
      setLoading(false);
      console.log(following);




      console.log(users.length); 
      console.log(data.total); 
      console.log(data.users.length);
      console.log("resta:", data.total - data.users.length);
      if (users.length >= (data.total - data.users.length)) {
        setMore(false);
      }

    }

  }






  return (
    <>
      <header className="content__header">
        <h1 className="content__title">Gente</h1>
      </header>




      <UserList users={users}
        getUsers={getUsers}
        following={following}
        setFollowing={setFollowing}
        page={page}
        setPage={setPage}
        loading={loading}
        more={more}
      ></UserList>




    </>

  )
}
