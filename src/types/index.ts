// src/types/index.ts

// API Response Types
export interface APIUser {
  id: number;
  username: string;
  email: string;
  avatar?: string | null;
}

export interface APIContactDetails {
  id: number;
  username: string;
  email: string;
  avatar: string | null;
}

export interface APIContact {
  id: number;
  contact_details: APIContactDetails;
  last_message: string | null;
  created_at: string;
  online: boolean;
  unread_count: number;
}

export interface APIMessage {
  id: number;
  content: string;
  sender: number;
  receiver: number;
  created_at: string;
  is_read: boolean;
  is_image: boolean;
  image_url?: string | null;
}

// Frontend Types
export interface Message {
  id: string;
  content: string;
  timestamp: string;
  senderId: string;
  receiverId?: string;
  senderName: string;
  senderAvatar?: string;
  isImage: boolean;
  imageUrl?: string;
  isRead: boolean;
}

export interface Contact {
  id: string;         
  userId: string;     
  name: string;
  email: string;
  avatar?: string;
  lastMessage?: Message;
  timestamp?: string;
  unread?: number;
  online?: boolean;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}