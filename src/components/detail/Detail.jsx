import React from 'react'
import "./detail.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleUp, faDownload } from '@fortawesome/free-solid-svg-icons'
import { authentication, db } from '../../lib/firebase'
import { useUserStore } from '../../lib/userStore'
import { useChatStore } from '../../lib/chatStore'
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore'

const Detail = () => {
  const {chatId, user,isCurrentuserBlocked,isReceiverBlocked, changeBlock}= useChatStore()

  const {currentUser} = useUserStore()

  const handleBlock = async () =>{
    if(!user) return;

    const userDocRef = doc(db,"users",currentUser.id)

    try{
      await updateDoc(userDocRef,{
        blocked:isReceiverBlocked ? arrayRemove(user.id):arrayUnion(user.id)
      })
      changeBlock()
    }
    catch(err){
      console.log(err);
    }
  }

  return (
    <div className="detail">
      <div className="user">
      <img src={user?.avatar || "./avatar.png"}alt="" />
      <h2>{user?.username}</h2>
      <p>Lorem ipsum dolor sit amet, </p>
      </div>
      <div className="info">
        <div className="option">
          <div className="title">
            <span>Chat Settings</span>
            <FontAwesomeIcon  className="icon" icon={faAngleUp}/>
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Privacy & help</span>
            <FontAwesomeIcon className="icon"  icon={faAngleUp}/>
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared photos</span>
            <FontAwesomeIcon className="icon"  icon={faAngleUp}/>
          </div>
        </div>
        <div className="photos">
          <div className="photoItem">
            <div className="photoDetail">
              <img src="./avatar.png" alt="" />
              <span>photo_2024.png</span>
            </div>
            <FontAwesomeIcon className="icon"  icon={faDownload} />
          </div>
          <div className="photoItem">
            <div className="photoDetail">
              <img src="./avatar.png" alt="" />
              <span>photo_2024.png</span>
            </div>
            <FontAwesomeIcon className="icon"  icon={faDownload} />
          </div>
          <div className="photoItem">
            <div className="photoDetail">
              <img src="./avatar.png" alt="" />
              <span>photo_2024.png</span>
            </div>
            <FontAwesomeIcon className="icon"  icon={faDownload} />
          </div>
          </div>
        <div className="option">
          <div className="title">
            <span>Shared Files</span>
            <FontAwesomeIcon className="icon"  icon={faAngleUp}/>
          </div>
        </div>
        <button onClick={handleBlock}>{isCurrentuserBlocked ? "You are Blocked!" : isReceiverBlocked ?"User Blocked" : "Block User"}</button>
        <button className="logout" onClick={()=>authentication.signOut()}>Logout</button>
      </div>
    </div>
  )
}

export default Detail