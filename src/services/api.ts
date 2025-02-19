// src/services/api.ts
import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  // Don't add token for auth endpoints
  if (config.url?.includes('/auth/')) {
    return config;
  }
  
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (data: { email: string; password: string }) => 
    api.post('/auth/login/', data),
  
  register: (data: { email: string; password: string; password2: string }) => 
    api.post('/auth/register/', data),
  
  logout: () => 
    api.post('/auth/logout/', {
      refresh: localStorage.getItem('refresh_token')
    }),
  
  googleLogin: (token: string) => 
    api.post('/auth/google-auth/', { access_token: token }),

  updateProfile: (data: FormData) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      return Promise.reject(new Error("No authentication token found"));
    }
  
    return api.patch('/auth/avatar/', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`,  // Ensure token is included
      },
    });
  },
};

// Add chatAPI export
export const chatAPI = {
  getContacts: () => 
    api.get('/messaging/contacts/'),
  
  invitePerson: async (data: { email: string; name?: string }) => {
    if (!data.email.trim()) {
      console.error("Email is missing. Cannot send request.");
      throw new Error("Email is required.");
    }

    const payload = {
      email: data.email, 
      username: data.name || "Unknown" // Provide a fallback name
    };

    console.log("Sending invite request with payload:", payload);

    return api.post('/messaging/contacts/invite/', payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  },
  
    getMessages: async (contactId: string) => {
      if (!contactId) {
        console.error("Cannot fetch messages: contactId is missing.");
        return { data: [] }; // Return empty array instead of breaking
      }
      
      console.log('Fetching messages with contact param:', contactId);
      console.log("this is the contact id", contactId)
      return api.get(`/messaging/messages/`, {
        params: { contact: contactId } // Use actual `contactId`
      });
    },  
  
  sendMessage: (contactId: string, content: string) => {
    const messageData = {
      receiver: parseInt(contactId),
      content: content.trim()
    };
    console.log('Sending message:', messageData);
    return api.post('/messaging/messages/', messageData);
  },
  
  markAsRead: (contactId: string) =>
    api.post(`/messaging/contacts/${contactId}/mark_read/`)
};

export default api;