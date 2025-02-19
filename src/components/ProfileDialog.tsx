import { 
    Dialog, 
    DialogTitle, 
    DialogContent,
    TextField,
    Button,
    Box
} from '@mui/material';
import { useState } from 'react';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface ProfileDialogProps {
    open: boolean;
    onClose: () => void;
}

const ProfileDialog = ({ open, onClose }: ProfileDialogProps) => {
    const { user, setUser } = useAuth();
    const [username, setUsername] = useState(user?.username || '');
    const [avatar, setAvatar] = useState<File | null>(null);

    const handleUpdate = async () => {
        try {
            const formData = new FormData();
            formData.append('email', user!.email);
            formData.append('username', username);
            if (avatar) {
                formData.append('avatar', avatar);
            }

            const response = await authAPI.updateProfile(formData);
            setUser(response.data);
            onClose();
        } catch (error) {
            console.error('Profile update failed:', error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogContent>
                <TextField label="Username" fullWidth value={username} onChange={e => setUsername(e.target.value)} />
                <input type="file" onChange={e => setAvatar(e.target.files?.[0] || null)} />
                <Box mt={2}>
                    <Button variant="contained" onClick={handleUpdate}>Save</Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default ProfileDialog;
