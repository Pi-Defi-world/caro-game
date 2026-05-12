import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatComponentProps {
  chatMessages: { player: string; message: string }[];
  newMessage: string;
  onSendMessage: (message: string) => void;
  onNewMessageChange: (value: string) => void;
  statusMessage?: string;
  isOpen?: boolean;
  onToggle?: () => void;
  className?: string;
}

const ChatComponent: React.FC<ChatComponentProps> = ({
  chatMessages,
  newMessage,
  onSendMessage,
  onNewMessageChange,
  statusMessage,
  isOpen: externalIsOpen,
  onToggle: externalOnToggle,
  className,
}) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle external control or internal state
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : isChatOpen;
  const toggleChat = externalOnToggle || (() => setIsChatOpen(prev => !prev));

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Mobile layout - floating chat button and overlay
  if (isMobile) {
    return (
      <>
        {/* Floating Chat Button */}
        <div className="fixed bottom-4 right-4 z-[40]">
          <Button
            className="p-4 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 text-white"
            onClick={toggleChat}
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        </div>

        {/* Mobile Chat Overlay */}
        {isOpen && (
          <div className="fixed inset-0 z-[50] bg-black/50 backdrop-blur-sm">
            <div className="absolute bottom-0 left-0 right-0 bg-gray-900 rounded-t-2xl shadow-2xl">
              {/* Header */}
              <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">Game Chat</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white"
                  onClick={toggleChat}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Content */}
              <div className="p-4 max-h-[70vh] overflow-hidden">
                {/* Status Message */}
                {statusMessage && (
                  <div className="mb-4 p-3 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white font-semibold rounded-lg text-center text-sm">
                    {statusMessage}
                  </div>
                )}

                {/* Messages */}
                <ScrollArea className="h-[50vh] mb-4">
                  {chatMessages.length === 0 ? (
                    <div className="text-center text-gray-400 py-8">
                      <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No messages yet</p>
                      <p className="text-xs">Start the conversation!</p>
                    </div>
                  ) : (
                    chatMessages.map((msg, index) => (
                      <div key={index} className="mb-3 p-3 bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-blue-400 font-semibold text-sm">@{msg.player}</span>
                          <span className="text-gray-500 text-xs">
                            {new Date().toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-gray-200 text-sm">{msg.message}</p>
                      </div>
                    ))
                  )}
                </ScrollArea>

                {/* Input */}
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => onNewMessageChange(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                  />
                  <Button 
                    onClick={handleSendMessage}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4"
                  >
                    <Send size={16} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Desktop layout - sidebar
  return (
    <div className={cn("bg-gray-900 border border-gray-700 rounded-lg shadow-xl", className)}>
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-white">Game Chat</h3>
        <p className="text-gray-400 text-sm">Stay connected with your opponent</p>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col h-full">
        {/* Status Message */}
        {statusMessage && (
          <div className="mb-4 p-3 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white font-semibold rounded-lg text-center text-sm">
            {statusMessage}
          </div>
        )}

        {/* Messages */}
        <ScrollArea className="flex-1 mb-4">
          {chatMessages.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No messages yet</p>
              <p className="text-xs">Start the conversation!</p>
            </div>
          ) : (
            chatMessages.map((msg, index) => (
              <div key={index} className="mb-3 p-3 bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-blue-400 font-semibold text-sm">@{msg.player}</span>
                  <span className="text-gray-500 text-xs">
                    {new Date().toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-gray-200 text-sm">{msg.message}</p>
              </div>
            ))
          )}
        </ScrollArea>

        {/* Input */}
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => onNewMessageChange(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
          />
          <Button 
            onClick={handleSendMessage}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4"
          >
            <Send size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
