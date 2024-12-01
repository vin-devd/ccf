import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Avatar,
  IconButton,
  Badge,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import ImageIcon from '@mui/icons-material/Image';
import LinkIcon from '@mui/icons-material/Link';
import { motion } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { Channel, Message, User } from '../types';
import { format } from 'date-fns';

const MotionContainer = motion(Container);

const MessageBubble = styled(Paper)(({ theme, isOwn }: { theme: any; isOwn: boolean }) => ({
  padding: theme.spacing(1.5),
  marginBottom: theme.spacing(1),
  maxWidth: '70%',
  wordBreak: 'break-word',
  borderRadius: 16,
  backgroundColor: isOwn ? theme.palette.primary.main : theme.palette.background.paper,
  alignSelf: isOwn ? 'flex-end' : 'flex-start',
}));

const ChatContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  height: 'calc(100vh - 200px)',
  overflow: 'hidden',
});

const MessagesContainer = styled(Box)({
  flex: 1,
  overflowY: 'auto',
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
});

const Chat: React.FC = () => {
  const { channelId } = useParams<{ channelId: string }>();
  const navigate = useNavigate();
  const [channel, setChannel] = useState<Channel | null>(null);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (!userData) {
      navigate('/create-user');
      return;
    }
    setUser(JSON.parse(userData));

    // Load channel data
    const channels = JSON.parse(localStorage.getItem('channels') || '[]');
    const currentChannel = channels.find((ch: Channel) => ch.id === channelId);
    if (!currentChannel) {
      navigate('/channels');
      return;
    }
    setChannel(currentChannel);

    // Scroll to bottom
    scrollToBottom();

    // Cleanup function for channel
    return () => {
      // Update last active timestamp
      if (currentChannel) {
        const updatedChannels = channels.map((ch: Channel) =>
          ch.id === channelId ? { ...ch, lastActive: new Date() } : ch
        );
        localStorage.setItem('channels', JSON.stringify(updatedChannels));
      }
    };
  }, [channelId, navigate]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!message.trim() || !channel || !user) return;

    const newMessage: Message = {
      id: uuidv4(),
      content: message.trim(),
      type: 'text',
      sender: user,
      timestamp: new Date(),
    };

    const updatedChannel = {
      ...channel,
      messages: [...channel.messages, newMessage],
      lastActive: new Date(),
    };

    // Update channel in localStorage
    const channels = JSON.parse(localStorage.getItem('channels') || '[]');
    const updatedChannels = channels.map((ch: Channel) =>
      ch.id === channelId ? updatedChannel : ch
    );
    localStorage.setItem('channels', JSON.stringify(updatedChannels));

    setChannel(updatedChannel);
    setMessage('');
    scrollToBottom();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && channel && user) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newMessage: Message = {
          id: uuidv4(),
          content: reader.result as string,
          type: 'image',
          sender: user,
          timestamp: new Date(),
          oneTimeView: true,
        };

        const updatedChannel = {
          ...channel,
          messages: [...channel.messages, newMessage],
          lastActive: new Date(),
        };

        // Update in localStorage
        const channels = JSON.parse(localStorage.getItem('channels') || '[]');
        const updatedChannels = channels.map((ch: Channel) =>
          ch.id === channelId ? updatedChannel : ch
        );
        localStorage.setItem('channels', JSON.stringify(updatedChannels));

        setChannel(updatedChannel);
        scrollToBottom();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    setIsTyping(true);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  };

  if (!channel || !user) return null;

  return (
    <MotionContainer
      maxWidth="lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ChatContainer>
        <Paper
          elevation={3}
          sx={{
            p: 2,
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            background: 'linear-gradient(45deg, rgba(33, 150, 243, 0.1), rgba(0, 229, 255, 0.1))',
          }}
        >
          <Avatar
            src={channel.image || `https://picsum.photos/seed/${channel.id}/40/40`}
            sx={{ mr: 2 }}
          />
          <Box>
            <Typography variant="h6">{channel.name}</Typography>
            <Typography variant="body2" color="textSecondary">
              {channel.members.length} members
            </Typography>
          </Box>
        </Paper>

        <MessagesContainer>
          {channel.messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              isOwn={msg.sender.id === user.id}
              elevation={1}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                <Avatar
                  src={msg.sender.avatar}
                  sx={{ width: 24, height: 24, mr: 1 }}
                />
                <Typography variant="body2" color="textSecondary">
                  {msg.sender.username}
                </Typography>
              </Box>

              {msg.type === 'text' && (
                <Typography>{msg.content}</Typography>
              )}

              {msg.type === 'image' && (
                <Box
                  component="img"
                  src={msg.content}
                  sx={{
                    maxWidth: '100%',
                    maxHeight: 300,
                    borderRadius: 1,
                    filter: msg.oneTimeView && msg.viewed ? 'blur(20px)' : 'none',
                  }}
                />
              )}

              <Typography
                variant="caption"
                color="textSecondary"
                sx={{ display: 'block', mt: 1 }}
              >
                {format(new Date(msg.timestamp), 'HH:mm')}
              </Typography>
            </MessageBubble>
          ))}
          <div ref={messagesEndRef} />
        </MessagesContainer>

        <Paper
          elevation={3}
          sx={{
            p: 2,
            mt: 2,
            background: 'linear-gradient(45deg, rgba(33, 150, 243, 0.1), rgba(0, 229, 255, 0.1))',
          }}
        >
          {isTyping && (
            <Typography variant="caption" color="textSecondary" sx={{ ml: 2 }}>
              Someone is typing...
            </Typography>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              id="image-upload"
              onChange={handleImageUpload}
            />
            <label htmlFor="image-upload">
              <IconButton component="span" color="primary">
                <ImageIcon />
              </IconButton>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type a message..."
              value={message}
              onChange={handleTyping}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              sx={{ mx: 2 }}
            />
            <IconButton
              color="primary"
              onClick={handleSendMessage}
              disabled={!message.trim()}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      </ChatContainer>
    </MotionContainer>
  );
};

export default Chat;
