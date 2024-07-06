import { onAuthStateChanged } from "firebase/auth"
import AppLogin from "./components/applogin/AppLogin"
import Chat from "./components/chat/Chat"
import Detail from "./components/detail/Detail"
import List from "./components/list/List"
import Notification from "./components/notification/Notification"
import { authentication } from "./lib/firebase"
import { useEffect } from "react"
import { useUserStore } from "./lib/userStore"
import { useChatStore } from "./lib/chatStore"


const App = () => {

  const {currentUser,isLoading,fetchUserInfo} = useUserStore()
  const {chatId} = useChatStore()

  const user=false

  useEffect(() => {
    const unSub = onAuthStateChanged(authentication,(user)=>{
      fetchUserInfo(user?.uid);
    });
    return()=>{
      unSub();
    }
  }, [fetchUserInfo])

  console.log(currentUser)

  if(isLoading) return <div className="loading">Loading...</div>

  return (
    <div className='container'>
      {
        currentUser ? (
          <>
          <List/>
          {chatId && <Chat/>}
          {chatId && <Detail/>}
          </>

        ): (<AppLogin/>)
      }
      <Notification/>
    </div>
  )
}

export default App