import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Avatar,
  IconButton,
} from '@mui/material';
import { motion } from 'framer-motion';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

const MotionContainer = motion(Container);

const CreateUser: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState<string>('');
  const [error, setError] = useState('');

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleCreateUser = async () => {
    if (!username.trim()) {
      setError('Username is required');
      return;
    }

    try {
      const userData = {
        username: username.trim(),
        avatar: `https://api.dicebear.com/6.x/avataaars/svg?seed=${username}`,
        createdAt: new Date(),
        lastSeen: new Date(),
        ip: '127.0.0.1'
      };

      // Create user in MongoDB
      const response = await axios.post('http://localhost:3078/api/users', userData);
      const newUser = response.data;
      console.log('Created user:', newUser);

      // Save user data in localStorage for session management
      localStorage.setItem('userData', JSON.stringify(newUser));
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      
      navigate('/channels');
    } catch (error) {
      console.error('Error creating user:', error);
      setError('Failed to create user');
    }
  };

  return (
    <MotionContainer
      maxWidth="sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Paper
        elevation={3}
        sx={{
          mt: 8,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: 'linear-gradient(45deg, rgba(33, 150, 243, 0.1), rgba(0, 229, 255, 0.1))',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Create Your Profile
        </Typography>

        <Box
          component="form"
          sx={{
            width: '100%',
            mt: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box sx={{ position: 'relative', mb: 3 }}>
            <Avatar
              src={avatar || ''}
              sx={{
                width: 100,
                height: 100,
                bgcolor: 'primary.main',
                fontSize: '2rem',
              }}
            >
              {!avatar && (username.charAt(0) || 'U')}
            </Avatar>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="avatar-upload"
              type="file"
              onChange={handleImageUpload}
            />
            <label htmlFor="avatar-upload">
              <IconButton
                component="span"
                sx={{
                  position: 'absolute',
                  bottom: -10,
                  right: -10,
                  bgcolor: 'secondary.main',
                  '&:hover': { bgcolor: 'secondary.dark' },
                }}
              >
                <AddAPhotoIcon />
              </IconButton>
            </label>
          </Box>

          <TextField
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={!!error}
            helperText={error}
            sx={{ mb: 3 }}
          />

          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={handleCreateUser}
            sx={{ mt: 2 }}
          >
            Continue to Chat
          </Button>
        </Box>
      </Paper>
    </MotionContainer>
  );
};

export default CreateUser;
