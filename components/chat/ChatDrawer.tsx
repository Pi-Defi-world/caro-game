"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { X, ChevronDown, Flag, Megaphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSocket } from "@/hooks/useSocket"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { fetchChats, fetchMessages, IChat, setChatModerator } from "@/redux/slices/message"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import ApplyModerator from "@/components/chat/ApplyModerator"
import Announcement from "@/components/chat/Announcement"
import ChatBanner from "./ChatBanner"

interface ChatMessage {
  id: number,
  _id: string
  user: string
  message: string
  chat: string 
  highlight?: boolean
  mention?: string
}

interface ChatDrawerProps {
  isOpen: boolean
  onClose: () => void
}


const RoleBadge = ({ username }: { username?: string }) => {
  const {privileges} = useAppSelector(state => state.auth)
  const user = privileges.find(p => p.username === username)
 
  if (!user) {
    return null;
  }

  const roleStyles: { [key: string]: { text: string; className: string } } = {
    admin: { text: "A", className: "bg-red-500 text-white" },
    superadmin: { text: "S", className: "bg-yellow-400 text-black" },
    developer: { text: "D", className: "bg-purple-600 text-white" },
    moderator: { text: "M", className: "bg-blue-500 text-white" },
  };

  const style = roleStyles[user.role?.toLowerCase()];

  if (!style) {
    return null;
  }

  return (
    <span
      className={`ml-1.5 px-1.5 text-xs font-bold rounded-full leading-tight inline-flex items-center justify-center ${style.className}`}
      title={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
    >
      {style.text}
    </span>
  );
};

export function ChatDrawer({ isOpen, onClose }: ChatDrawerProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const { currentUser } = useAppSelector(state => state.auth)
  const { messages: initialMessages, chats: languages } = useAppSelector(state => state.messages)
  const [selectedLanguage, setSelectedLanguage] = useState<IChat | null>(null)
  const [charLimit, setCharLimit] = useState(120)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!languages.length) {
      dispatch(fetchChats())
    }
    if (!initialMessages.length) {
      dispatch(fetchMessages())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 2. Set selected language from localStorage or default to English when languages are loaded
  useEffect(() => {
    if (languages.length) {
      const savedLangId = localStorage.getItem("selectedChatLangId")
      let lang = null
      if (savedLangId) {
        lang = languages.find(l => l._id === savedLangId)
      }
      if (!lang) {
        lang = languages.find(l => l.name.toLowerCase() === "english")
      }
      setSelectedLanguage(lang || languages[0])
    }
  }, [languages])

  // 3. Save selected language to localStorage when it changes
  useEffect(() => {
    if (selectedLanguage) {
      localStorage.setItem("selectedChatLangId", selectedLanguage._id)
    }
  }, [selectedLanguage])

  // 4. Update local messages when initialMessages change
  useEffect(() => {
    if (initialMessages.length > 0) {
      setMessages(initialMessages.map((msg, index) => ({
        id: index + 1,
        _id: msg._id,
        user: msg.username,
        role: (msg as any).role,
        message: msg.message,
        chat: msg.chat,
        highlight: false,
        mention: ""
      })))
    }
  }, [initialMessages])

  const { sendJsonMessage, lastJsonMessage } = useSocket()
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 5. Scroll to bottom on new messages
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [isOpen, messages])

  // 6. Only add new incoming messages for the selected language
  useEffect(() => {
    if (lastJsonMessage  && selectedLanguage) {
      //@ts-ignore
      if (lastJsonMessage.type === "global_message") {

        //@ts-ignore
        const chatId = lastJsonMessage.payload.chatId
        if (chatId === selectedLanguage._id) {
          const chatMessage = {
            id: messages.length + 1,
            //@ts-ignore
            user: lastJsonMessage.payload.username,
            //@ts-ignore
            role: lastJsonMessage.payload.role,
            //@ts-ignore
            message: lastJsonMessage.payload.message,
            //@ts-ignore
            chat: chatId,
            //@ts-ignore
            _id: lastJsonMessage.payload._id, // Use payload ID or generate a new one
            //@ts-ignore
            mention: lastJsonMessage.payload.mention,
            //@ts-ignore
            highlight: lastJsonMessage.payload.highlight
          }
          setMessages(prev => [...prev, chatMessage])
        }
        //@ts-ignore
      } else if(lastJsonMessage.type ==="chat-moderator-added"){
        dispatch(setChatModerator({
          //@ts-ignore
          chatId: lastJsonMessage.payload,
          hasModerator: true
        }))
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastJsonMessage, selectedLanguage])

  const filteredMessages = selectedLanguage
    ? messages.filter(msg => msg.chat === selectedLanguage._id)
    : []

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim() && selectedLanguage) {
      sendJsonMessage({
        type: "global_message",
        payload: {
          username: currentUser?.username || "Anonymous",
          message: newMessage.trim(),
          chatId: selectedLanguage._id,
          timestamp: Date.now()
        }
      })
      setNewMessage("")
    }
  }

  const [flagDialogOpen, setFlagDialogOpen] = useState(false)
  const [flagTarget, setFlagTarget] = useState<{msgId: string, chatId: string} | null>(null)

  const handleFlagMessage = (msgId: string, chatId: string) => {
    if (!msgId) return
    setFlagTarget({ msgId, chatId })
    setFlagDialogOpen(true)
  }

  const confirmFlag = () => {
    if (flagTarget) {
      sendJsonMessage({
        type: "flag_message",
        payload: {
          messageId: flagTarget.msgId,
          chatId: flagTarget.chatId,
          moderatorId: currentUser?._id
        },
      })
      setMessages((prev) => prev.filter((msg) => msg._id !== flagTarget.msgId))
    }
    setFlagDialogOpen(false)
    setFlagTarget(null)
  }

  const cancelFlag = () => {
    setFlagDialogOpen(false)
    setFlagTarget(null)
  }

  useEffect(() => {
    // Set character limit based on user role
    if (currentUser) {
      const role = currentUser.role;
      if (role === "admin" || role === "developer") {
        setCharLimit(500);
      } else if (role === "moderator") {
        setCharLimit(250);
      } else {
        setCharLimit(120);
      }
    } else {
      setCharLimit(120);
    }
  }, [currentUser]);



  return (
    <div
      className={`fixed inset-0 bottom-[60px] bg-slate-950 z-50 transition-transform duration-300 ${
        isOpen ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex flex-col h-full relative">
      {/* <Announcement /> */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 bg-slate-800 rounded-full px-4 py-2 text-white">
                  <span>{selectedLanguage?.name || "Select Language"}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-slate-800 border-white/10 text-white">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang._id}
                    onSelect={() => setSelectedLanguage(lang)}
                    className="focus:bg-slate-700 focus:text-white"
                  >
                    <span>{lang.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full bg-slate-800 text-white">
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
           
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {
            selectedLanguage?.hasModerator ? <>
              {filteredMessages.map((msg) => (
                <div key={msg._id} className="px-2 py-1 rounded-lg bg-slate-800/50 relative">
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${msg.highlight ? "bg-amber-500" : "bg-indigo-500"}`}></div>
                      <span className="font-semibold text-white/90">{msg.user === currentUser?.username ? "Me" :msg.user}</span>
                      <RoleBadge username={msg.user} />
                      {['admin', 'developer', 'superadmin', 'moderator'].includes(currentUser?.role as never) && (
                        <button
                          className="ml-auto p-1 rounded hover:bg-red-100/10 text-red-400 absolute top-1 right-1"
                          title="Flag this message"
                          onClick={() => handleFlagMessage(msg._id, msg.chat)}
                        >
                          <Flag className="w-4 h-4" />
                        </button>
                      )}
                      
                    </div>
                    <div className="pl-5">
                      <span className="text-white/80">
                        {msg.message}
                        {msg.mention && <span className="text-indigo-400"> {msg.mention}</span>}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* <ChatBanner message="test" subMessage="submessage" type="info" icon="shield" dismissible={false} /> */}
            </>:
            selectedLanguage && (
              <ApplyModerator chat={selectedLanguage} />
            )
          }
          <div ref={messagesEndRef} />
        </div>

        <div className="p-2 border-t border-slate-700">
          {
           currentUser && currentUser?.flagCount < 4 && <div className="flex justify-between items-center mb-1">
            <div className="text-white/80 text-sm">Chat violations {currentUser?.flagCount}/4</div>
            {(() => {
              const remaining = charLimit - newMessage.length;
              const countColor = remaining < 0 ? 'text-red-500' : remaining < 20 ? 'text-yellow-400' : 'text-white/50';
              return <div className={`text-sm font-medium transition-colors ${countColor}`}>{remaining}/{charLimit}</div>
            })()}
          </div>
          }
          {currentUser && (() => {
            if (currentUser.flagCount < 4) {
              return (
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Enter a message"
                    className="flex-1 bg-slate-800 text-white rounded-full px-4 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    maxLength={charLimit}
                  />
                  <Button type="submit" className="rounded-full bg-indigo-600 text-white p-3 disabled:bg-slate-700 disabled:cursor-not-allowed" disabled={!newMessage.trim()}>
                    <span className="sr-only">Send</span>
                    <span className="text-xl">▶</span>
                  </Button>
                </form>
              )
            } else {
              return (
                <div className="text-red-500 text-sm text-center p-4">
                  You have been banned for violating community chat guidelines. Please contact the support team to appeal.
                </div>
              )
            }
          })()}
        </div>

        <Dialog open={flagDialogOpen} onOpenChange={setFlagDialogOpen}>
          <DialogContent className="max-w-xs rounded-xl">
            <DialogHeader>
              <DialogTitle>Report Message</DialogTitle>
            </DialogHeader>
            <div className="py-2 text-sm text-gray-700 dark:text-gray-300">
              Please use the report feature responsibly.<br />
              Only flag messages that are abusive, spam, or violate community guidelines.<br />
              False reports may result in action against your account.
            </div>
            <DialogFooter className="flex gap-2 justify-end">
              <Button variant="outline" onClick={cancelFlag}>Cancel</Button>
              <Button variant="destructive" onClick={confirmFlag}>Report & Remove</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
