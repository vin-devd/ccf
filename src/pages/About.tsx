import React from 'react';
import { Typography, Paper, Box } from '@mui/material';

const About: React.FC = () => {
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h1" component="h1" gutterBottom>
        About
      </Typography>
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Typography variant="body1" paragraph>
          This is a modern React application that demonstrates best practices in:
        </Typography>
        <Typography component="ul" sx={{ pl: 3 }}>
          <li>TypeScript integration</li>
          <li>Component organization</li>
          <li>Routing with React Router</li>
          <li>Material-UI theming</li>
          <li>Responsive design</li>
        </Typography>
      </Paper>
    </Box>
  );
};

export default About;
