import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Button, Box, Container, Grid, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import ChatIcon from '@mui/icons-material/Chat';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';

const MotionBox = motion(Box);

const Home: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <ChatIcon sx={{ fontSize: 40 }} />,
      title: 'Real-Time Chat',
      description: 'Enjoy instant messaging with real-time updates and no refresh needed'
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: 'Secure & Private',
      description: 'Create private channels with unique codes and one-time view messages'
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 40 }} />,
      title: 'Fast & Efficient',
      description: 'Quick setup without registration, just choose a username and start chatting'
    }
  ];

  return (
    <Container maxWidth="lg">
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        sx={{ textAlign: 'center', mt: 8, mb: 6 }}
      >
        <Typography variant="h1" component="h1" gutterBottom>
          FCC Floating Channel Chat
        </Typography>
        <Typography variant="h5" color="textSecondary" paragraph>
          Create or join instant chat channels. No registration required.
          Share messages, images, and links in real-time.
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/create-user')}
          sx={{ mt: 4 }}
        >
          Get Started
        </Button>
      </MotionBox>

      <Grid container spacing={4} sx={{ mt: 4 }}>
        {features.map((feature, index) => (
          <Grid item xs={12} md={4} key={index}>
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <Paper
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  background: 'linear-gradient(45deg, rgba(33, 150, 243, 0.1), rgba(0, 229, 255, 0.1))',
                }}
              >
                {feature.icon}
                <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                  {feature.title}
                </Typography>
                <Typography color="textSecondary">
                  {feature.description}
                </Typography>
              </Paper>
            </MotionBox>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home;
