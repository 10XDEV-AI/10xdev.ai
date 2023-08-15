import React,{useState} from 'react'
import DemoWelcome from './demoWelcome'
import Chat from "../Chat";
const Demo = () => {
    const [showChat,setShowChat] = useState(false)
  return (
    <div className="bg-gray-50 dark:bg-gray-800 " >
            <div class=" mx-auto  text-center">
                <h2 class="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">Have a Demo here ‼️</h2>
            </div>
        <div className="mx-20 bg-gray-50 rounded">
        {/* chat-container css in chat.css */}
        {showChat ? <div className="chat-container"> 
          <Chat Nonav="true" searchBar="nonsticky" />
        </div> : <div ><DemoWelcome setShowChat={setShowChat} showChat={showChat} /></div>}
        </div>
    </div>
  )
}

export default Demo;