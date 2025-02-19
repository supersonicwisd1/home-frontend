// src/utils/adapters.ts
import { 
    Contact, 
    Message, 
    APIContact, 
    APIMessage,
    APIContactDetails
  } from '../types';
  
  export const adaptContact = (apiContact: APIContact): Contact => {
    // Create a Message object from the last_message string
    const lastMessage = apiContact.last_message ? {
      id: 'temp-' + Date.now(),  // Generate temporary ID for display
      content: apiContact.last_message,
      timestamp: apiContact.created_at,
      senderId: apiContact.contact_details.id.toString(),
      receiverId: undefined, // We don't have this info from the API
      senderName: apiContact.contact_details.username,
      senderAvatar: apiContact.contact_details.avatar || undefined,
      isImage: false,
      isRead: true
    } : undefined;
  
    return {
      id: apiContact.id.toString(),
      userId: apiContact.contact_details.id.toString(),
      name: apiContact.contact_details.username,
      email: apiContact.contact_details.email,
      avatar: apiContact.contact_details.avatar || undefined,
      lastMessage: lastMessage,
      timestamp: apiContact.created_at,
      unread: apiContact.unread_count,
      online: apiContact.online
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