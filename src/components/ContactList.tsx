// src/components/ContactList.tsx
import { Box, Typography, Avatar } from '@mui/material';
import { Contact, Message } from '../types';
import { ChatIcon } from '../components/icons'
import { format } from 'date-fns';

interface ContactListProps {
  contacts: Contact[];
  selectedContact: Contact | null;
  onSelectContact: (contact: Contact) => void;
}

const ContactList = ({ contacts, selectedContact, onSelectContact }: ContactListProps) => {
  // Add debug logging
  // console.log('ContactList received contacts:', contacts);

  if (!contacts || contacts.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography color="text.secondary">No contacts yet</Typography>
      </Box>
    );
  }

  const formatTime = (timestamp: string) => {
    try {
      return format(new Date(timestamp), 'HH:mm a');
    } catch (error) {
      return '';
    }
  };

  return (
    <Box>
      {contacts.map((contact) => {
        // Add debug logging for each contact
        // console.log('Rendering contact:', contact);
        
        // Safely access contact properties
        const name = contact?.name || 'Unknown';
        const avatar = contact?.avatar;
        const lastMessage = contact.lastMessage ? contact.lastMessage.content : 'No messages';
        const timestamp = contact.lastMessage ? formatTime(contact.lastMessage.timestamp) : '';

        const unread = typeof contact?.unread === 'number' ? contact.unread : 0;

        return (
          <Box
            key={contact.id}
            onClick={() => onSelectContact(contact)}
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              cursor: 'pointer',
              bgcolor: selectedContact?.id === contact.id ? '#f8f9fa' : 'transparent',
              '&:hover': {
                bgcolor: '#f8f9fa'
              }
            }}
          >
            <Avatar src={avatar}>
              {name.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography sx={{ fontWeight: 500 }}>
                  {name}
                </Typography>
                {timestamp && (
                  <Typography variant="caption" color="text.secondary">
                    {timestamp}
                  </Typography>
                )}
              </Box>
              <Typography variant="body2" color="text.secondary" noWrap>
                {lastMessage && typeof lastMessage === 'object' && 'content' in lastMessage 
                  ? (lastMessage as Message).content 
                  : 'No messages'}
              </Typography>



            </Box>
            {unread > 0 && (
              <Box
                sx={{
                  bgcolor: '#1e3a8a',
                  color: 'white',
                  borderRadius: '50%',
                  width: 24,
                  height: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem'
                }}
              >
                {unread}
              </Box>
            )}
          </Box>
        );
      })}
    </Box>
  );
};

export default ContactList;