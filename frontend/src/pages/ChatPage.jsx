import ActiveTabSwitch from "../components/ActiveTabSwitch"
import ChatsList from "../components/ChatsList"
import ContactList from "../components/ContactList"
import ProfileHeader from "../components/ProfileHeader"
import ChatContainer from "../components/ChatContainer"
import NoConversationPlaceholder from "../components/NoConversationPlaceholder"
import { useChatStore } from "../store/useChatStore"

function ChatPage() {
  const { activeTabs , selectedUser } = useChatStore();
  return (
    <div className="relative w-full max-w-6xl h-200">
      <div className="w-full h-full rounded-2xl border border-transparent animate-border  flex overflow-hidden">
          {/* LEFT SIDE */}
        <div className="w-80 bg-slate-800/50 backdrop-blur-sm flex flex-col">
          <ProfileHeader />
          <ActiveTabSwitch />
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            { activeTabs === "chats" ? <ChatsList /> : <ContactList />} 
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex-1 flex flex-col bg-slate-900/50 backdrop-blur-sm">
          { selectedUser ? <ChatContainer /> : <NoConversationPlaceholder /> }
        </div>
      </div>
   
    </div>
  )
}

export default ChatPage