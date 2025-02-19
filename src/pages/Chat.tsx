// src/pages/Chat.tsx
import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button,
  Avatar
} from '@mui/material';
import { 
  Search as SearchIcon,
  Add as AddIcon
} from '@mui/icons-material';

// Icons
import { ChatIcon } from '../components/icons';
import { adaptContacts } from '../utils/adapters';

import MainLayout from '../layouts/MainLayout';
import { useAuth } from '../context/AuthContext';
import { chatAPI } from '../services/api';
import { wsService } from '../services/socket';

// Components
import ContactList from '../components/ContactList';
import MessageList from '../components/MessageList';
import ChatInput from '../components/ChatInput';
import AddPersonDialog from '../components/AddPersonDialog';
import SuccessNotification from '../components/SuccessNotification';

// Types
import { Message, Contact } from '../types';

// Contact Header Component
const ContactHeader = ({ contact }: { contact: Contact }) => (
  <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Avatar src={contact.avatar}>
        {contact.name[0]}
      </Avatar>
      <Box>
        <Typography sx={{ fontWeight: 500 }}>
          {contact.name}
        </Typography>
        {contact.online && (
          <Typography variant="caption" sx={{ color: '#22c55e' }}>
            Online
          </Typography>
        )}
      </Box>
    </Box>
  </Box>
);

// EmptyState Component
const EmptyState = ({ onAddPerson }: { onAddPerson: () => void }) => (
  <Box 
    sx={{ 
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      p: 3
    }}
  >
    <Box sx={{ mb: 3 }}>
      <ChatIcon />
    </Box>
    <Typography variant="h6" sx={{ mb: 1 }}>No Chats</Typography>
    <Typography color="text.secondary" sx={{ mb: 4 }}>
      You have not received or sent anyone a message.
    </Typography>
    <Button
      startIcon={<AddIcon />}
      variant="contained"
      onClick={onAddPerson}
      sx={{
        bgcolor: '#1e3a8a',
        '&:hover': { bgcolor: '#1e40af' },
        textTransform: 'none',
        px: 4,
        py: 1.5,
        borderRadius: '8px'
      }}
    >
      Add a person
    </Button>
  </Box>
);

const NoSelectedChat = () => (
  <Box
    sx={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'text.secondary'
    }}
  >
    <Box sx={{ mb: 2 }}>
      <ChatIcon />
    </Box>
    <Typography color="text.secondary">
      Click on chat to read conversation
    </Typography>
  </Box>
);

const ContactsSection = ({ 
  contacts, 
  selectedContact, 
  onSelectContact,
  onAddPerson,
  searchQuery,
  onSearchChange
}: { 
  contacts: Contact[];
  selectedContact: Contact | null;
  onSelectContact: (contact: Contact) => void;
  onAddPerson: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}) => (
  <Box 
    sx={{ 
      width: 320,
      borderRight: 1,
      borderColor: 'divider',
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }}
  >
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Inbox</Typography>
      <TextField
        fullWidth
        size="small"
        placeholder="Search for message"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        InputProps={{
          startAdornment: <SearchIcon sx={{ color: '#6B7280', mr: 1 }} />,
          sx: { bgcolor: '#f8f9fa' }
        }}
      />
    </Box>
    
    <Box sx={{ flex: 1, overflowY: 'auto' }}>
      <ContactList
        contacts={contacts}
        selectedContact={selectedContact}
        onSelectContact={onSelectContact}
      />
    </Box>

    <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
      <Button
        fullWidth
        startIcon={<AddIcon />}
        variant="contained"
        onClick={onAddPerson}
        sx={{
          bgcolor: '#1e3a8a',
          '&:hover': { bgcolor: '#1e40af' },
          textTransform: 'none',
          py: 1.5,
          borderRadius: '8px'
        }}
      >
        Add a person
      </Button>
    </Box>
  </Box>
);

const Chat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isAddPersonOpen, setIsAddPersonOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeChat = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("access_token");
        if (!token) {
          console.error("No token found for WebSocket authentication");
          return;
        }
        await loadContacts();
        // Don't initialize WebSocket here, we'll do it when a contact is selected
      } catch (error) {
        console.error("Failed to initialize chat:", error);
        setError("Failed to connect to chat service");
      } finally {
        setIsLoading(false);
      }
    };
  
    initializeChat();
  
    return () => {
      wsService.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!contacts || !searchQuery) {
      setFilteredContacts(contacts);
      return;
    }
  
    const filtered = contacts.filter(contact => {
      if (!contact || !contact.name) return false;
      
      const nameMatch = contact.name.toLowerCase().includes(searchQuery.toLowerCase());
      const messageMatch = contact.lastMessage ? 
        contact.lastMessage.content.toLowerCase().includes(searchQuery.toLowerCase()) : 
        false;
      
      return nameMatch || messageMatch;
    });
    
    setFilteredContacts(filtered);
  }, [contacts, searchQuery]);

  const loadContacts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Loading contacts...');
      const response = await chatAPI.getContacts();
      console.log('Raw contacts response:', response.data);
  
      const adaptedContacts = adaptContacts(response.data);
      console.log('Adapted contacts:', adaptedContacts);
      
      setContacts(adaptedContacts);
    } catch (error: any) {
      console.error('Failed to load contacts:', error.response?.data || error.message);
      setError(error.response?.data?.detail || 'Failed to load contacts. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedContact) {
      const token = localStorage.getItem("access_token");
      if (!token) {
        console.error("No token found for WebSocket authentication");
        return;
      }
  
      console.log("Connecting WebSocket for contact:", selectedContact);
      wsService.connect(token, selectedContact.userId);
  
      const unsubscribe = wsService.onMessage((data: any) => {
        console.log('WebSocket message received:', data);
  
        // For regular messages
        if (data.id && data.content) {
          console.log('Processing message:', data);
          
          // Ensure this is a message for the current conversation
          const isRelevantMessage = 
            data.senderId === selectedContact.userId || 
            data.senderId === user?.id;
  
          if (isRelevantMessage) {
            const newMessage: Message = {
              id: data.id.toString(),
              content: data.content,
              timestamp: data.timestamp || new Date().toISOString(),
              senderId: data.senderId.toString(),
              receiverId: data.receiverId.toString(),
              senderName: data.senderName,
              senderAvatar: data.senderAvatar,
              isImage: data.isImage || false,
              imageUrl: data.imageUrl,
              isRead: data.isRead || false
            };
  
            console.log('Adding new message to state:', newMessage);
            setMessages(prev => [...prev, newMessage]);
  
            // Update contact's last message
            setContacts(prev => prev.map(contact => {
              if (contact.userId === selectedContact.userId) {
                return {
                  ...contact,
                  lastMessage: data.content,
                  timestamp: data.timestamp || new Date().toISOString()
                };
              }
              return contact;
            }));
          }
        }
      });
  
      // Load messages for the selected contact
      loadMessages(selectedContact);
  
      return () => {
        unsubscribe();
        wsService.disconnect();
      };
    }
  }, [selectedContact, user?.id]);

  const loadMessages = async (contact: Contact) => {
    if (!contact) {
      console.error("No contact provided for loading messages.");
      return;
    }

    const contactUserId = contact.userId; // This is the receiver's user ID
    const contactId = contact.id; // This is the contact object ID in the DB

    try {
      console.log('Fetching messages for contact user ID:', contactUserId);

      const response = await chatAPI.getMessages(contactUserId); // Use userId for API call
      console.log('Raw API Response:', response.data);

      if (Array.isArray(response.data)) {
        const adaptedMessages = response.data.map(msg => ({
          id: msg.id.toString(),
          content: msg.content,
          timestamp: msg.created_at,
          senderId: msg.sender.toString(),
          receiverId: msg.receiver.toString(),
          senderName: msg.sender_name || "Unknown",
          senderAvatar: msg.sender_avatar || undefined,
          isImage: Boolean(msg.is_image),
          imageUrl: msg.image_url || undefined,
          isRead: Boolean(msg.is_read),
        }));

        console.log('Adapted Messages:', adaptedMessages);
        setMessages(adaptedMessages);
      } else {
        console.log('No messages found');
        setMessages([]);
      }

      console.log(`Marking messages as read for contact ID: ${contactId}`);
      await chatAPI.markAsRead(contactId); // Use contact ID for marking as read

    } catch (error) {
      console.error('Failed to load messages:', error);
      setMessages([]);
      setError('Failed to load messages. Please try again.');
    }
};
 

const handleSendMessage = async (content: string) => {
  if (!selectedContact || !content.trim()) {
    return;
  }

  try {
    const newMessage: Message = {
      id: `temp-${Date.now()}`,  // Use a temporary ID until WebSocket confirms
      content: content.trim(),
      timestamp: new Date().toISOString(),
      senderId: user?.id || '',
      receiverId: selectedContact.userId,
      senderName: user?.username || '',
      senderAvatar: user?.avatar,
      isImage: false,
      imageUrl: undefined,
      isRead: false
    };

    // Add message to local UI immediately
    setMessages(prev => [...prev, newMessage]);

    // Send via WebSocket instead of REST API
    wsService.sendMessage({
      type: 'message',
      receiver: parseInt(selectedContact.userId),
      content: content.trim()
    });

  } catch (error: any) {
    console.error('Failed to send message:', error.response?.data || error);
    setError("Failed to send message. Try again.");
  }
};


const handleAddPerson = async (email: string, name: string) => {
  if (!email.trim()) {
    setError("Email is required.");
    console.error("❌ Email is missing.");
    return;
  }

  if (!name.trim()) {
    console.warn("⚠️ Name is empty, defaulting to 'Unknown'.");
    name = "Unknown"; // Provide a default name
  }

  try {
    setError(null);
    console.log('📌 Sending invitation data:', { email, name });

    const response = await chatAPI.invitePerson({ email, name });

    console.log('✅ Invitation response:', response.data);

    setContacts(prev => [...prev, response.data]);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
    setIsAddPersonOpen(false);
  } catch (error: any) {
    console.error('❌ Failed to add person:', error);

    if (error.response) {
      console.log('❌ API Response Data:', error.response.data);
      console.log('❌ Status Code:', error.response.status);
    }

    const errorMessage = error.response?.data?.email?.[0] || 
                         error.response?.data?.detail ||
                         'Failed to add person. Please try again.';

    setError(errorMessage);
  }
};


  
const handleNewMessage = (message: Message) => {
  setMessages((prev) => {
    // Check if message already exists to prevent duplication
    if (prev.some((msg) => msg.id === message.id)) {
      console.log("Duplicate message detected, skipping:", message);
      return prev;
    }

    return [...prev, message];
  });

  // Update last message
  const contactId = message.senderId === user?.id
    ? message.receiverId
    : message.senderId;

  setContacts(prev => prev.map(contact => {
    if (contact.userId === contactId) {
      return {
        ...contact,
        lastMessage: {
          id: message.id,
          content: message.content,
          timestamp: message.timestamp,
          senderId: message.senderId,
          receiverId: message.receiverId,
          senderName: message.senderName,
          senderAvatar: message.senderAvatar,
          isImage: message.isImage,
          imageUrl: message.imageUrl,
          isRead: message.isRead
        }
      };
    }
    return contact;
  }));
};

const updateContactLastMessage = (contactId: string, message: Message) => {
  setContacts(prev => prev.map(contact => {
    if (contact.userId === contactId) {
      return {
        ...contact,
        lastMessage: {
          id: message.id,
          content: message.content,
          timestamp: message.timestamp,
          senderId: message.senderId,
          receiverId: message.receiverId,
          senderName: message.senderName,
          senderAvatar: message.senderAvatar,
          isImage: message.isImage,
          imageUrl: message.imageUrl,
          isRead: message.isRead
        },
        timestamp: message.timestamp
      };
    }
    return contact;
  }));
};

  const handleUserStatusChange = (data: { userId: string; online: boolean }) => {
    setContacts(prev => prev.map(contact => {
      if (contact.id === data.userId) {
        return { ...contact, online: data.online };
      }
      return contact;
    }));
  };

  const handleSelectContact = async (contact: Contact) => {
    console.log('Selecting contact:', contact);
    
    try {
      // Clear previous messages
      setMessages([]);
      
      // Set selected contact (this will trigger the WebSocket connection)
      setSelectedContact(contact);
      
      // Mark messages as read
      await chatAPI.markAsRead(contact.id);
      
      // Update contact's unread count
      setContacts(prev => prev.map(c => {
        if (c.id === contact.id) {
          return { ...c, unread: 0 };
        }
        return c;
      }));
    } catch (error) {
      console.error('Failed to handle contact selection:', error);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          height: '100%' 
        }}>
          <Typography>Loading...</Typography>
        </Box>
      );
    }

    if (error) {
      return (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          height: '100%',
          color: 'error.main'
        }}>
          <Typography>{error}</Typography>
        </Box>
      );
    }

    if (contacts.length === 0) {
      return <EmptyState onAddPerson={() => setIsAddPersonOpen(true)} />;
    }

    return (
      <Box sx={{ height: '100%', display: 'flex' }}>
        <ContactsSection
          contacts={filteredContacts}
          selectedContact={selectedContact}
          onSelectContact={handleSelectContact}
          onAddPerson={() => setIsAddPersonOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        
      {selectedContact ? (
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <ContactHeader contact={selectedContact} />
          <MessageList 
            messages={messages} 
            currentUserId={user?.id.toString() || ''} // Convert to string
          />
          <ChatInput onSendMessage={handleSendMessage} />
        </Box>
      ) : (
        <NoSelectedChat />
      )}
      </Box>
    );
  };

  return (
    <MainLayout>
      {renderContent()}
      <AddPersonDialog
        open={isAddPersonOpen}
        onClose={() => setIsAddPersonOpen(false)}
        onAdd={handleAddPerson}
      />
      {showNotification && (
        <SuccessNotification message="Person has successfully been added" />
      )}
    </MainLayout>
  );
};

export default Chat;