import React, { useEffect } from 'react'
import { useState } from 'react'
import "./chatlist.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinus, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons'
import UserAdd from './useradd/UserAdd'
import { useUserStore } from '../../../lib/userStore'
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../../../lib/firebase'
import { useChatStore } from '../../../lib/chatStore'


const ChatList = () => {

  const [addMode, setAddMode] = useState(false)
  const {currentUser} = useUserStore()
  const {chatId,changeChat} = useChatStore()
  const [chats, setChats] = useState([])
  const [input, setinput] = useState("")

  console.log(chatId);
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "userchats", currentUser.id), async (res) => {
      const items = res.data().chats;

      const promises = items.map(async (item) =>{
        const userDocRef = doc(db, "users", item.receiverId);
        const userDocSnap = await getDoc(userDocRef);

        const user = userDocSnap.data()

        return{...item , user}
      })

      const chatData = await Promise.all(promises)

      setChats(chatData.sort((a,b)=>b.updatedAt - a.updatedAt))

    });
    console.log(chats)
  return () =>{
    unsub()
  }
  }, [currentUser.id])


  const handleSelect = async (chat) =>{

    const userChats = chats.map(item =>{
      const {user, ...rest} =item;
      return rest;
    })

    const chatIndex = userChats.findIndex((item)=>item.chatId ===chat.chatId)

    userChats[chatIndex].isSeen = true

    const userChatsRef = doc(db,"userchats",currentUser.id)

    try{
      await updateDoc(userChatsRef,{
        chats:userChats,
      }
      )
    changeChat(chat.chatId,chat.user)
    }
    catch(err){
      console.log(err);
    }
  }

  const filteredChats = chats.filter((c)=>c.user.username.toLowerCase().includes(input.toLowerCase()));

  return (
    <div className="chatlist">
      <div className="search">
        <div className="searchBar">
          <FontAwesomeIcon  className="icon" icon={faSearch}/>
          <input type="text" placeholder="Search" onChange={(e)=>setinput(e.target.value)} />
        </div>
        <FontAwesomeIcon  className="add" icon={addMode?faMinus: faPlus} onClick={()=>setAddMode((prev)=>!prev)}/>
      </div>

   
      {filteredChats.map((chat)=>( 
        <div className="item" key={chat.chatId} id={chat.chatId}  onClick={()=>handleSelect(chat)}
        style={{backgroundColor:chat?.isSeen?"transparent":"#5183fe",}} >
        <img src={chat.user.blocked.includes(currentUser.id)? "./avatar.png" :chat.user.avatar} alt="" />
        <div className="texts">
          <span>{chat.user.blocked.includes(currentUser.id)?"User":chat.user.username}</span>
          <p>{chat.lastMessage}</p>
        </div>
      </div>
    ))}
      
      { addMode && <UserAdd/>}
    </div>
  )
}

export default ChatList