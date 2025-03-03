
import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import useAuth from '@/hooks/useAuth';
import { useMessages } from '@/hooks/useMessages';

// Message components
import ConversationList from '@/components/messages/ConversationList';
import ConversationView from '@/components/messages/ConversationView';
import EmptyConversation from '@/components/messages/EmptyConversation';
import NotAuthenticated from '@/components/messages/NotAuthenticated';

const Messages = () => {
  const { user } = useAuth();
  const [showMobileConversation, setShowMobileConversation] = useState(false);
  
  // Use the messages hook for all messaging functionality
  const {
    conversations,
    selectedConversation,
    newMessage,
    searchQuery,
    setNewMessage,
    setSearchQuery,
    handleSendMessage,
    handleSelectConversation,
    getUnreadCount,
    onlineUsers
  } = useMessages(user?.id);

  // Handle selecting a conversation on mobile
  const handleMobileSelectConversation = (conversation: any) => {
    handleSelectConversation(conversation);
    setShowMobileConversation(true);
  };

  // Handle back button on mobile
  const handleMobileBack = () => {
    setShowMobileConversation(false);
  };

  // Check if user is authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <NotAuthenticated />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-24">
        <h1 className="text-3xl font-bold mb-8 mt-8">Messages</h1>
        
        <Card className="h-[calc(80vh-8rem)] overflow-hidden rounded-lg shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 h-full">
            {/* Conversation List - Hide on mobile when viewing a conversation */}
            <div className={`${showMobileConversation ? 'hidden md:block' : 'block'}`}>
              <ConversationList 
                conversations={conversations}
                selectedConversation={selectedConversation}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                handleSelectConversation={handleMobileSelectConversation}
                getUnreadCount={getUnreadCount}
              />
            </div>
            
            {/* Conversation View - Show on mobile only when a conversation is selected */}
            {selectedConversation ? (
              <div className={`col-span-2 ${!showMobileConversation ? 'hidden md:block' : 'block'}`}>
                <ConversationView 
                  conversation={selectedConversation}
                  newMessage={newMessage}
                  setNewMessage={setNewMessage}
                  handleSendMessage={handleSendMessage}
                  isOnline={onlineUsers && selectedConversation 
                    ? onlineUsers[selectedConversation.with.id] 
                    : false}
                  onBack={handleMobileBack}
                />
              </div>
            ) : (
              <div className="col-span-2 hidden md:block">
                <EmptyConversation />
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Messages;
