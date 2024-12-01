import React from 'react';
import { Paper, Box, Typography, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import { format } from 'date-fns';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

const StyledPaper = styled(Paper)<{ isOwn: boolean }>(({ theme, isOwn }) => ({
  padding: theme.spacing(1.5),
  marginBottom: theme.spacing(1),
  maxWidth: '70%',
  wordBreak: 'break-word',
  borderRadius: 16,
  position: 'relative',
  backgroundColor: isOwn 
    ? 'linear-gradient(45deg, #2196f3 30%, #00e5ff 90%)'
    : theme.palette.background.paper,
  color: isOwn ? '#fff' : theme.palette.text.primary,
  alignSelf: isOwn ? 'flex-end' : 'flex-start',
  '&::after': {
    content: '""',
    position: 'absolute',
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderWidth: '8px 8px 0',
    borderColor: `${isOwn ? '#00e5ff' : theme.palette.background.paper} transparent transparent transparent`,
    transform: 'translateY(-50%)',
    bottom: -8,
    [isOwn ? 'right' : 'left']: 12,
  },
}));

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwn }) => {
  return (
    <StyledPaper isOwn={isOwn} elevation={2}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
        <Avatar
          src={message.sender.avatar}
          sx={{
            width: 24,
            height: 24,
            mr: 1,
            border: '2px solid',
            borderColor: isOwn ? '#00e5ff' : '#2196f3',
          }}
        />
        <Typography
          variant="body2"
          sx={{
            color: isOwn ? 'rgba(255,255,255,0.9)' : '#2196f3',
            fontWeight: 500,
          }}
        >
          {message.sender.username}
        </Typography>
      </Box>

      {message.type === 'text' && (
        <Typography
          sx={{
            fontSize: '1rem',
            lineHeight: 1.5,
            ml: 4,
          }}
        >
          {message.content}
        </Typography>
      )}

      {message.type === 'image' && (
        <Box
          component="img"
          src={message.content}
          sx={{
            maxWidth: '100%',
            maxHeight: 300,
            borderRadius: 2,
            mt: 1,
            ml: 4,
            filter: message.oneTimeView && message.viewed ? 'blur(20px)' : 'none',
            transition: 'filter 0.3s ease',
          }}
        />
      )}

      <Typography
        variant="caption"
        sx={{
          display: 'block',
          mt: 1,
          ml: 4,
          color: isOwn ? 'rgba(255,255,255,0.7)' : 'text.secondary',
          fontSize: '0.75rem',
        }}
      >
        {format(new Date(message.timestamp), 'HH:mm')}
      </Typography>
    </StyledPaper>
  );
};

export default MessageBubble;
