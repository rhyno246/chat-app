import { useChatStore } from "../store/useChatStore"

function ActiveTabSwitch() {
  const {activeTabs , setActiveTabs} = useChatStore();
  return (
    <div className="tabs tabs-box bg-transparent p-2 m-2">
      <button 
        onClick={() => setActiveTabs("chats")}
        className={`tab ${
          activeTabs === "chats" ? "bg-cyan-500/20 text-cyan-400" : "text-slate-400"
        }`}
      >
        Chats
      </button>
      <button 
        onClick={() => setActiveTabs("contacts")}
        className={`tab ${
          activeTabs === "contacts" ? "bg-cyan-500/20 text-cyan-400" : "text-slate-400"
        }`}
      >
        Contacts
      </button>
    </div>
  )
}

export default ActiveTabSwitch