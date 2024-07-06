import React, { useState , useRef, useEffect } from 'react'
import "./chat.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCamera, faImage, faInfo, faInfoCircle, faMicrophone, faPhone, faSmile, faVideo } from '@fortawesome/free-solid-svg-icons'
import EmojiPicker from 'emoji-picker-react'
import { useUserStore } from '../../lib/userStore'
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { useChatStore } from '../../lib/chatStore'
import upload from '../../lib/upload'

const Chat = () => {

  const {currentUser} = useUserStore()
  const [chat, setChat] = useState()
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [img, setImg] = useState({
    file:null,
    url:""
  });
  const {chatId,user,isCurrentuserBlocked,isReceiverBlocked} = useChatStore()

  const endRef = useRef(null)

  useEffect(() => {
      endRef.current?.scrollIntoView({behavior: "smooth"})
  }, [])

  useEffect(() => {
  const unSub = onSnapshot(doc(db,"chats",chatId), (res) =>{
    setChat(res.data())
  })

  return () => {
    unSub();
  }
  }, [chatId])


  const handleEmoji = (e) => {
    
    setText(prev=>prev+e.emoji);
    setOpen(false);
  }

  const handleImg = (e) => {

    if(e.target.files[0]){
      setImg({
        file:e.target.files[0],
        url: URL.createObjectURL(e.target.files[0])
      })
    }
  }


  const handleSend = async() =>{
    if(text === "") return;

    let imgUrl = null

    try{

      if(img.file){
        imgUrl = await upload(img.file);
      }
      await updateDoc(doc(db,"chats",chatId),{
        messages:arrayUnion({
          senderId : currentUser.id,
          text,
          createdAt:new Date(),
          ...(imgUrl && {img: imgUrl}),
        })
      })

      const userIDs = [currentUser.id, user.id];

      userIDs.forEach(async(id)=>{
  
      const userChatsRef = doc(db,"userchats",id);
      const userChatsSnapshot = await getDoc(userChatsRef)

      if(userChatsSnapshot.exists()){
        const userChatsData = userChatsSnapshot.data()
        const chatIndex = userChatsData.chats.findIndex(c => c.chatId === chatId)
        
        userChatsData.chats[chatIndex].lastMessage = text
        userChatsData.chats[chatIndex].isSeen = id === currentUser.id ?true : false;
        userChatsData.chats[chatIndex].updatedAt = Date.now()
        
        await updateDoc(userChatsRef , {
          chats: userChatsData.chats,
        })
      }
      
    })
    }
    catch(err){
      console.log(err);
    }

    setImg({
      file:null,
      url:""
    })
    setText("")
  }

  return (
    <div className="chat">
      <div className="top">
        <div className="user">
          <img src={user?.avatar || "./avatar.png"} alt="" />
          <div className="texts">
            <span>{user?.username}</span>
            <p>Lorem, ipsum dolor sit amet consectetur.</p>
          </div>
        </div>
        <div className="icons">
          <FontAwesomeIcon className="icon" icon={faPhone}/>
          <FontAwesomeIcon className="icon" icon={faVideo}/>
          <FontAwesomeIcon className="icon" icon={faInfoCircle}/>

        </div>
      </div>
      <div className="center">
      { chat?.messages?.map(message => (
        <div className={message.senderId === currentUser.id ?"message own":"message"} key={message?.createdAt}>
          <div className="texts">
          {message.img && <img src={message.img} alt="" />}
            <p>{message.text}</p>
            {/* <span>{message.createdAt}</span> */}
          </div>
        </div>
      ))
        }
       {img.url && <div className="message own">
          <div className="texts">
            <img src={img.url} alt="" />
          </div>
        </div>
        }
        <div ref={endRef}></div>
      </div>
      <div className="bottom">
        <div className="icons">
          <label htmlFor="file">
          <FontAwesomeIcon className="icon" icon={faImage}/>
          </label>
          <input type="file" id="file" name="file" style={{display: 'none'}} onChange={handleImg} disabled={isCurrentuserBlocked || isReceiverBlocked}/>
          <FontAwesomeIcon className="icon" icon={faCamera}/>
          <FontAwesomeIcon className="icon" icon={faMicrophone}/>
        </div>
        <input type="text" placeholder={(isCurrentuserBlocked || isReceiverBlocked)?"You cannot Send a Message":"Type a message... "} value = {text} onChange={e=>setText(e.target.value)} disabled={isCurrentuserBlocked || isReceiverBlocked}/>
        <div className="emoji">
          <FontAwesomeIcon className="iconemoji" icon={faSmile} onClick={()=>setOpen((prev)=>!prev)} />
            <div className="picker">
          <EmojiPicker open={open} onEmojiClick={handleEmoji}/>
            </div>
        </div>
        <button className="sendButton" onClick={handleSend} disabled={isCurrentuserBlocked || isReceiverBlocked}>Send</button>
      </div>
    </div>
  )
}

export default Chat