
import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useMessages } from '@/hooks/useMessages';
import { ThemeToggle } from '@/components/messages/ThemeToggle';
import { AccessibilityMenu } from '@/components/messages/AccessibilityMenu';
import { OfflineIndicator } from '@/components/messages/OfflineIndicator';

// Message components
import ConversationList from '@/components/messages/ConversationList';
import EnhancedConversationView from '@/components/messages/EnhancedConversationView';
import EmptyConversation from '@/components/messages/EmptyConversation';
import NotAuthenticated from '@/components/messages/NotAuthenticated';

const Messages = () => {
  const { user } = useAuth();
  const [showMobileConversation, setShowMobileConversation] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 768);
  
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
    onlineUsers,
    updateConversationWithMessage,
    createNewConversation,
    setConversations
  } = useMessages(user?.id);

  // Track window size to determine mobile view
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 768) {
        setShowMobileConversation(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      <div className="min-h-screen bg-background">
        <Navbar />
        <NotAuthenticated />
      </div>
    );
  }

  const isMobile = windowWidth < 768;

  return (
    <div className="min-h-screen bg-background no-overflow-x">
      <Navbar />
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 md:py-8 pt-20">
        <div className="flex items-center justify-between mb-4 sm:mb-6 mt-4">
          <h1 className="text-2xl sm:text-3xl font-bold">Messages</h1>
          <div className="flex items-center gap-2">
            <AccessibilityMenu />
            <ThemeToggle />
          </div>
        </div>
        
        <Card className="h-[calc(80vh-6rem)] sm:h-[calc(80vh-8rem)] overflow-hidden rounded-lg shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 h-full">
            {/* Conversation List - Hide on mobile when viewing a conversation */}
            <div className={`${isMobile && showMobileConversation ? 'hidden' : 'block'} md:block border-r border-gray-200`}>
              <ConversationList 
                conversations={conversations}
                selectedConversation={selectedConversation}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                handleSelectConversation={handleMobileSelectConversation}
                getUnreadCount={getUnreadCount}
                updateConversationWithMessage={updateConversationWithMessage}
                setConversations={setConversations}
              />
            </div>
            
            {/* Conversation View - Show on mobile only when a conversation is selected */}
            <div className={`col-span-2 ${isMobile && !showMobileConversation ? 'hidden' : 'block'} md:block`}>
              {selectedConversation ? (
                <EnhancedConversationView 
                  conversation={selectedConversation}
                  conversations={conversations}
                  newMessage={newMessage}
                  setNewMessage={setNewMessage}
                  handleSendMessage={handleSendMessage}
                  isOnline={onlineUsers && selectedConversation 
                    ? onlineUsers[selectedConversation.with.id] 
                    : false}
                  onBack={handleMobileBack}
                  updateConversationWithMessage={updateConversationWithMessage}
                />
              ) : (
                <EmptyConversation />
              )}
            </div>
          </div>
        </Card>
      </div>
      
      {/* Offline indicator */}
      <OfflineIndicator />
    </div>
  );
};

export default Messages;
