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
      <img src="/chat-icon.svg" alt="No chat selected" width="48" height="48" />
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
        const token = localStorage.getItem("access_token"); // Retrieve token
        if (!token) {
          console.error("No token found for WebSocket authentication");
          return;
        }
        wsService.connect(token);  // ✅ Pass token to WebSocket
        await loadContacts();
      } catch (error) {
        console.error("Failed to initialize chat:", error);
        setError("Failed to connect to chat service");
      } finally {
        setIsLoading(false);
      }
    };
  
    initializeChat();
  
    const unsubscribe = wsService.onMessage((data: any) => {
      console.log('WebSocket message received:', data);
  
      if (data.type === 'chat_message') {
        const message = data.message;
        console.log('New message received:', message);
  
        // Add message to messages list if current contact is selected
        if (selectedContact && 
            (message.sender_id === selectedContact.userId || 
             message.sender_id === user?.id)) {
          const newMessage: Message = {
            id: message.id.toString(),
            content: message.content,
            timestamp: message.timestamp,
            senderId: message.sender_id.toString(),
            receiverId: message.receiver_id.toString(),
            senderName: message.sender_name,
            senderAvatar: message.sender_avatar,
            isImage: message.is_image,
            imageUrl: message.image_url,
            isRead: message.is_read
          };
          setMessages(prev => [...prev, newMessage]);
        }
  
        // Update contact's last message and unread count
        const contactId = message.sender_id === user?.id ? 
          message.receiver_id : 
          message.sender_id;
  
        setContacts(prev => prev.map(contact => {
          if (contact.userId === contactId.toString()) {
            return {
              ...contact,
              lastMessage: message.content,
              timestamp: message.timestamp,
              unread: selectedContact?.userId === contactId.toString() ? 
                0 : (contact.unread || 0) + 1
            };
          }
          return contact;
        }));
      }
    });
  
    return () => {
      unsubscribe();
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
        contact.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()) : 
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
      loadMessages(selectedContact.id);
    }
  }, [selectedContact]);

  const loadMessages = async (contactId: string) => {
    if (!contactId) {
      console.error("❌ No contact ID provided for loading messages.");
      return;
    }
  
    try {
      console.log('📌 Fetching messages for contact:', contactId);
  
      const response = await chatAPI.getMessages(contactId); // ✅ Use correct contact ID
      console.log('📌 Raw API Response:', response.data);
  
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
  
        console.log('📌 Adapted Messages:', adaptedMessages);
        setMessages(adaptedMessages);
      } else {
        console.log('📌 No messages found');
        setMessages([]);
      }
  
      await chatAPI.markAsRead(contactId);
  
    } catch (error) {
      console.error('❌ Failed to load messages:', error);
      setMessages([]);
      setError('Failed to load messages. Please try again.');
    }
  };  
  

  const handleSendMessage = async (content: string) => {
    if (!selectedContact || !content.trim()) {
      return;
    }
  
    try {
      // Use userId (from contact_details.id) for sending messages
      const response = await chatAPI.sendMessage(
        selectedContact.userId,  // Use userId instead of id
        content.trim()
      );
  
      console.log('Message sent response:', response.data);
  
      // Add the new message to the messages list
      const newMessage: Message = {
        id: response.data.id.toString(),
        content: response.data.content,
        timestamp: response.data.created_at,
        senderId: user?.id || '',
        receiverId: selectedContact.userId,  // Use userId here too
        senderName: user?.username || '',
        senderAvatar: user?.avatar,
        isImage: response.data.is_image,
        imageUrl: response.data.image_url || undefined,
        isRead: response.data.is_read
      };
  
      setMessages(prev => [...prev, newMessage]);
  
      // Update the contact's last message
      setContacts(prev => prev.map(contact => {
        if (contact.id === selectedContact.id) {
          return {
            ...contact,
            lastMessage: content.trim(),
            timestamp: response.data.created_at
          };
        }
        return contact;
      }));
  
      // Send via WebSocket for real-time updates
      wsService.sendMessage({
        type: 'message',
        receiver: parseInt(selectedContact.userId),  // Use userId here too
        content: content.trim()
      });
  
    } catch (error: any) {
      console.error('Failed to send message:', error.response?.data || error);
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.error || 
                          'Failed to send message';
      setError(errorMessage);
    }
  };

  const handleAddPerson = async (email: string, name: string) => {
    try {
      setError(null);
      console.log('Sending invitation data:', { email, name });  // Debug log
      const response = await chatAPI.invitePerson({ email, name });
      console.log('Invitation response:', response.data);  // Debug log
      setContacts(prev => [...prev, response.data]);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      setIsAddPersonOpen(false);
    } catch (error) {
      console.error('Failed to add person:', error);
      const axiosError = error as any;
      setError(
        axiosError.response?.data?.detail || 
        'Failed to add person. Please try again.'
      );
    }
  };

  const handleNewMessage = (message: Message) => {
    if (selectedContact && 
        (message.senderId === selectedContact.id || 
         message.senderId === user?.id)) {
      setMessages(prev => [...prev, message]);
    }

    const contactId = message.senderId === user?.id
      ? message.receiverId ?? selectedContact?.id ?? ""  // Use selected contact as fallback
      : message.senderId;

    updateContactLastMessage(contactId, message);
};


  const updateContactLastMessage = (contactId: string, message: Message) => {
    setContacts(prev => prev.map(contact => {
      if (contact.id === contactId) {
        return {
          ...contact,
          lastMessage: message.content,
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
    setSelectedContact(contact);
    
    try {
      // Clear previous messages
      setMessages([]);
      
      // Load messages for the selected contact
      await loadMessages(contact.id);
      
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