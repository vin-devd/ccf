import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Chip,
  Tooltip,
  Snackbar,
} from '@mui/material';
import { motion } from 'framer-motion';
import AddIcon from '@mui/icons-material/Add';
import GroupIcon from '@mui/icons-material/Group';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { Channel, User } from '../types';

const MotionContainer = motion(Container);
const MotionCard = motion(Card);

const Channels: React.FC = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [channelName, setChannelName] = useState('');
  const [channelCode, setChannelCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadChannels = async () => {
      try {
        // Check if user is logged in
        const currentUser = localStorage.getItem('currentUser');
        if (!currentUser) {
          navigate('/create-user');
          return;
        }

        // Load channels from MongoDB
        const response = await axios.get('http://localhost:5000/api/channels');
        console.log('Loaded channels:', response.data);
        setChannels(response.data);
      } catch (error) {
        console.error('Error loading channels:', error);
        setError('Failed to load channels');
      }
    };

    loadChannels();
  }, [navigate]);

  const handleCreateChannel = async () => {
    if (!channelName.trim()) {
      setError('Channel name is required');
      return;
    }

    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const channelCode = uuidv4().slice(0, 6).toUpperCase();
      
      const channelData = {
        name: channelName.trim(),
        code: channelCode,
        createdAt: new Date(),
        lastActive: new Date(),
        members: [currentUser._id], // Use MongoDB _id
        messages: [],
        image: `https://picsum.photos/seed/${uuidv4()}/400/200`,
      };

      // Create channel in MongoDB
      const response = await axios.post('http://localhost:5000/api/channels', channelData);
      const newChannel = response.data;
      console.log('Created channel:', newChannel);
      
      setChannels([...channels, newChannel]);
      setCreateDialogOpen(false);
      setChannelName('');
      setError('');
      navigate(`/chat/${newChannel._id}`);
    } catch (error) {
      console.error('Error creating channel:', error);
      setError('Failed to create channel');
    }
  };

  const handleJoinChannel = async () => {
    if (!channelCode.trim()) {
      setError('Please enter a channel code');
      return;
    }

    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      
      // Join channel in MongoDB
      const response = await axios.post('http://localhost:5000/api/channels/join-by-code', {
        code: channelCode.trim(),
        userId: currentUser._id
      });
      
      const joinedChannel = response.data;
      console.log('Joined channel:', joinedChannel);

      // Update channels list
      const updatedChannels = channels.map(ch => 
        ch._id === joinedChannel._id ? joinedChannel : ch
      );
      setChannels(updatedChannels);

      setJoinDialogOpen(false);
      setChannelCode('');
      setError('');
      navigate(`/chat/${joinedChannel._id}`);
    } catch (error) {
      console.error('Error joining channel:', error);
      if (error.response?.status === 404) {
        setError('Invalid channel code');
      } else {
        setError('Failed to join channel');
      }
    }
  };

  const copyChannelCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setError('');
  };

  return (
    <MotionContainer
      maxWidth="lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ 
        mt: 4, 
        mb: 4, 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'stretch', sm: 'center' },
        gap: 2,
        justifyContent: 'space-between' 
      }}>
        <Typography 
          variant="h4" 
          component="h1"
          sx={{
            background: 'linear-gradient(45deg, #2196f3 30%, #00e5ff 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Chat Channels
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
            sx={{
              background: 'linear-gradient(45deg, #2196f3 30%, #00e5ff 90%)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(45deg, #1976d2 30%, #00b8d4 90%)',
              },
            }}
          >
            Create Channel
          </Button>
          <Button
            variant="outlined"
            onClick={() => setJoinDialogOpen(true)}
            sx={{
              borderColor: '#2196f3',
              color: '#2196f3',
              '&:hover': {
                borderColor: '#1976d2',
                background: 'rgba(33, 150, 243, 0.1)',
              },
            }}
          >
            Join Channel
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {channels.map((channel, index) => (
          <Grid item xs={12} sm={6} md={4} key={channel._id}>
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              sx={{ 
                cursor: 'pointer',
                background: 'linear-gradient(45deg, rgba(33, 150, 243, 0.1), rgba(0, 229, 255, 0.1))',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                '&:hover': { 
                  transform: 'translateY(-4px)',
                  transition: '0.3s',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                }
              }}
            >
              <CardMedia
                component="img"
                height="140"
                image={channel.image}
                alt={channel.name}
                onClick={() => navigate(`/chat/${channel._id}`)}
              />
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ color: '#2196f3' }}>
                    {channel.name}
                  </Typography>
                  <Tooltip title="Copy channel code">
                    <Chip
                      label={channel.code}
                      onClick={() => copyChannelCode(channel.code)}
                      onDelete={() => copyChannelCode(channel.code)}
                      deleteIcon={<ContentCopyIcon />}
                      sx={{
                        background: 'linear-gradient(45deg, #2196f3 30%, #00e5ff 90%)',
                        color: 'white',
                      }}
                    />
                  </Tooltip>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <GroupIcon sx={{ mr: 1, color: '#2196f3' }} />
                  <Typography variant="body2" color="textSecondary">
                    {channel.members.length} members
                  </Typography>
                </Box>
              </CardContent>
            </MotionCard>
          </Grid>
        ))}
      </Grid>

      {/* Create Channel Dialog */}
      <Dialog 
        open={createDialogOpen} 
        onClose={() => setCreateDialogOpen(false)}
        PaperProps={{
          sx: {
            background: 'linear-gradient(45deg, rgba(33, 150, 243, 0.1), rgba(0, 229, 255, 0.1))',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }
        }}
      >
        <DialogTitle>Create New Channel</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Channel Name"
            fullWidth
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            error={!!error}
            helperText={error}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(33, 150, 243, 0.5)',
                },
                '&:hover fieldset': {
                  borderColor: '#2196f3',
                },
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleCreateChannel} 
            variant="contained"
            sx={{
              background: 'linear-gradient(45deg, #2196f3 30%, #00e5ff 90%)',
            }}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Join Channel Dialog */}
      <Dialog 
        open={joinDialogOpen} 
        onClose={() => setJoinDialogOpen(false)}
        PaperProps={{
          sx: {
            background: 'linear-gradient(45deg, rgba(33, 150, 243, 0.1), rgba(0, 229, 255, 0.1))',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }
        }}
      >
        <DialogTitle>Join Channel</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Channel Code"
            fullWidth
            value={channelCode}
            onChange={(e) => setChannelCode(e.target.value)}
            error={!!error}
            helperText={error}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(33, 150, 243, 0.5)',
                },
                '&:hover fieldset': {
                  borderColor: '#2196f3',
                },
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setJoinDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleJoinChannel} 
            variant="contained"
            sx={{
              background: 'linear-gradient(45deg, #2196f3 30%, #00e5ff 90%)',
            }}
          >
            Join
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!error}
        autoHideDuration={2000}
        onClose={() => setError('')}
        message={error}
      />
    </MotionContainer>
  );
};

export default Channels;
