
import { useState, useCallback } from 'react';
import useConversationLoader from './messages/useConversationLoader';
import { useMessageSender } from './messages/useMessageSender';
import { useConversationManager } from './messages/useConversationManager';
import { Conversation, Message } from '@/components/messages/types';
import { v4 as uuidv4 } from 'uuid';

export const useMessages = (userId: string | undefined) => {
  const {
    conversations,
    selectedConversation,
    setSelectedConversation,
    getUnreadCount,
    markConversationAsRead,
    updateConversationWithMessage,
    setConversations
  } = useConversationLoader(userId);

  const {
    newMessage,
    setNewMessage,
    handleSendMessage
  } = useMessageSender(
    userId,
    conversations,
    setConversations,
    selectedConversation,
    setSelectedConversation
  );

  const {
    searchQuery,
    setSearchQuery,
    handleSelectConversation,
    onlineUsers,
    isUserOnline
  } = useConversationManager(
    conversations,
    selectedConversation,
    setSelectedConversation,
    markConversationAsRead
  );

  // Fonction pour créer une nouvelle conversation
  const createNewConversation = useCallback((contactUser: any) => {
    if (!userId || !contactUser) return null;

    try {
      // Vérifier si une conversation existe déjà
      const existingConversation = conversations.find(
        conv => conv.with.id === contactUser.id
      );

      if (existingConversation) {
        handleSelectConversation(existingConversation);
        return existingConversation;
      }

      // Créer une nouvelle conversation
      const newConversation: Conversation = {
        id: `user-${userId}-${contactUser.id}-${uuidv4()}`,
        with: {
          id: contactUser.id,
          name: contactUser.name || 'Utilisateur',
          avatar: contactUser.avatar || '/placeholder.svg',
          role: contactUser.role || 'user',
        },
        messages: [
          {
            id: `welcome-${Date.now()}`,
            content: `Bonjour ! Comment puis-je vous aider aujourd'hui ?`,
            timestamp: new Date(),
            read: true,
            sender: contactUser.id === 'admin' ? 'admin' : 'other',
          }
        ],
        lastMessage: {
          content: `Bonjour ! Comment puis-je vous aider aujourd'hui ?`,
          timestamp: new Date(),
          read: true,
          sender: contactUser.id === 'admin' ? 'admin' : 'other',
        }
      };

      // Mettre à jour la liste des conversations
      const updatedConversations = [...conversations, newConversation];
      setConversations(updatedConversations);

      // Sauvegarder dans le localStorage
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(`conversations_${userId}`, JSON.stringify(updatedConversations));
      }

      // Sélectionner la nouvelle conversation
      handleSelectConversation(newConversation);

      return newConversation;
    } catch (error) {
      console.error("Erreur lors de la création d'une nouvelle conversation:", error);
      return null;
    }
  }, [userId, conversations, handleSelectConversation, setConversations]);

  return {
    conversations,
    selectedConversation,
    newMessage,
    searchQuery,
    onlineUsers,
    setNewMessage,
    setSearchQuery,
    handleSendMessage,
    handleSelectConversation,
    getUnreadCount,
    isUserOnline,
    updateConversationWithMessage,
    createNewConversation,
    setConversations
  };
};
