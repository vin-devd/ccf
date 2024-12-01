import React from 'react';
import { Box, Typography, keyframes } from '@mui/material';
import { User } from '../types';

interface TypingIndicatorProps {
  typingUsers: User[];
}

const dotAnimation = keyframes`
  0% { opacity: 0; }
  50% { opacity: 1; }
  100% { opacity: 0; }
`;

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ typingUsers }) => {
  if (typingUsers.length === 0) return null;

  const getTypingText = () => {
    if (typingUsers.length === 1) {
      return `${typingUsers[0].username} is typing`;
    } else if (typingUsers.length === 2) {
      return `${typingUsers[0].username} and ${typingUsers[1].username} are typing`;
    } else {
      return 'Several people are typing';
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        p: 1,
      }}
    >
      <Typography
        variant="body2"
        sx={{
          color: '#2196f3',
          fontStyle: 'italic',
        }}
      >
        {getTypingText()}
      </Typography>
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        {[0, 1, 2].map((i) => (
          <Box
            key={i}
            sx={{
              width: 4,
              height: 4,
              borderRadius: '50%',
              backgroundColor: '#2196f3',
              animation: `${dotAnimation} 1.4s infinite`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default TypingIndicator;
