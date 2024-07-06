import React from 'react'
import "./userinfo.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsis, faVideo } from '@fortawesome/free-solid-svg-icons'
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons'
import { useUserStore } from '../../../lib/userStore'

const UserInfo = () => {

  const {currentUser} = useUserStore()


  return (
    <div className="userInfo">
      <div className="user">
        <img src={currentUser.avatar ||"./avatar.png" } className="avatar" alt="avatar" />
        <h3>{currentUser.username}</h3>
      </div>
      <div className="icons">
      <FontAwesomeIcon  className="icon" icon={faEllipsis} />   
      <FontAwesomeIcon  className="icon" icon={faVideo} />   
      <FontAwesomeIcon  className="icon" icon={faPenToSquare} />   
      </div>
    </div>
  )
}

export default UserInfo