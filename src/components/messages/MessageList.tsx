
import React, { useEffect, useRef, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Conversation } from './types';
import { Button } from '@/components/ui/button';

interface MessageListProps {
  conversation: Conversation;
}

const MessageList: React.FC<MessageListProps> = ({ conversation }) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);

  // Scrolling automatique vers le dernier message
  useEffect(() => {
    if (messagesEndRef.current && isAtBottom) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation.messages, isAtBottom]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const isScrollable = target.scrollHeight > target.clientHeight;
    
    setShowScrollButtons(isScrollable);
    
    // Check if we're at the bottom
    const isBottom = Math.abs(target.scrollHeight - target.clientHeight - target.scrollTop) < 10;
    setIsAtBottom(isBottom);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    setIsAtBottom(true);
  };

  const scrollToTop = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = 0;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  const renderMessageStatus = (message: any) => {
    if (message.sender !== 'user') return null;
    
    if (message.read) {
      return (
        <span className="whatsapp-tick whatsapp-read-tick">
          <Check className="h-3 w-3 inline" />
          <Check className="h-3 w-3 inline -ml-1" />
        </span>
      );
    } else {
      return (
        <span className="whatsapp-tick whatsapp-single-tick">
          <Check className="h-3 w-3 inline" />
        </span>
      );
    }
  };

  return (
    <div className="whatsapp-message-area relative flex-1 overflow-hidden">
      <div 
        className="h-full overflow-y-auto px-4 py-2" 
        onScroll={handleScroll}
        ref={scrollAreaRef}
      >
        <div className="space-y-1">
          {conversation.messages.map((message) => (
            <div 
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.sender !== 'user' && (
                <Avatar className="h-8 w-8 mr-2 mt-1">
                  <AvatarImage src={conversation.with.avatar} />
                  <AvatarFallback className={
                    conversation.with.role === 'admin' ? 'bg-emerald-500 text-white' : ''
                  }>
                    {conversation.with.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              )}
              <div 
                className={`whatsapp-message ${
                  message.sender === 'user' 
                    ? 'whatsapp-user-message' 
                    : 'whatsapp-other-message'
                }`}
              >
                {message.sender === 'user' && <div className="whatsapp-tail-out"></div>}
                {message.sender !== 'user' && <div className="whatsapp-tail-in"></div>}
                
                <p className="whitespace-pre-wrap">{message.content}</p>
                
                <div className="whatsapp-message-time">
                  {formatTime(message.timestamp)}
                  {renderMessageStatus(message)}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Scroll buttons */}
      {showScrollButtons && (
        <div className="absolute right-4 bottom-4 flex flex-col items-center space-y-2">
          {!isAtBottom && (
            <Button 
              variant="secondary" 
              size="icon" 
              className="rounded-full shadow-md bg-white"
              onClick={scrollToBottom}
            >
              <ChevronDown className="h-5 w-5" />
            </Button>
          )}
          <Button 
            variant="secondary" 
            size="icon" 
            className="rounded-full shadow-md bg-white"
            onClick={scrollToTop}
          >
            <ChevronUp className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default MessageList;
