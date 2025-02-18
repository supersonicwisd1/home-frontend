// src/utils/adapters.ts
import { 
    Contact, 
    Message, 
    APIContact, 
    APIMessage,
    APIContactDetails
  } from '../types';
  
  export const adaptContact = (apiContact: APIContact): Contact => {
    return {
      id: apiContact.id.toString(),  // Use Contact record ID for contact operations
      name: apiContact.contact_details.username,
      email: apiContact.contact_details.email,
      avatar: apiContact.contact_details.avatar || undefined,
      lastMessage: apiContact.last_message || undefined,
      timestamp: apiContact.created_at,
      unread: apiContact.unread_count,
      online: apiContact.online,
      userId: apiContact.contact_details.id.toString()  // Keep User ID for messages
    };
  };
  
  export const adaptContacts = (apiContacts: APIContact[]): Contact[] => {
    return apiContacts.map(adaptContact);
  };
  
  export const adaptMessage = (apiMessage: APIMessage): Message => {
    console.log('Adapting message:', apiMessage);
    
    return {
      id: apiMessage.id.toString(),
      content: apiMessage.content,
      timestamp: apiMessage.created_at,
      senderId: apiMessage.sender.toString(),
      receiverId: apiMessage.receiver.toString(),
      senderName: '', // This will be filled from contacts
      senderAvatar: undefined,
      isImage: apiMessage.is_image,
      imageUrl: apiMessage.image_url || undefined,
      isRead: apiMessage.is_read
    };
  };
  
  export const adaptMessages = (apiMessages: APIMessage[]): Message[] => {
    if (!Array.isArray(apiMessages)) {
      console.error('Expected array of messages, got:', apiMessages);
      return [];
    }
    return apiMessages.map(adaptMessage);
  };