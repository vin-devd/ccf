import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import Home from './pages/Home';
import CreateUser from './pages/CreateUser';
import Channels from './pages/Channels';
import Chat from './pages/Chat';
import Debug from './pages/Debug';

const App: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-user" element={<CreateUser />} />
        <Route path="/channels" element={<Channels />} />
        <Route path="/chat/:channelId" element={<Chat />} />
        <Route path="/debug" element={<Debug />} />
      </Routes>
    </Box>
  );
};

export default App;
