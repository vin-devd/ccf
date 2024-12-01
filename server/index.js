require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');
const Channel = require('./models/Channel');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
// Users
app.post('/api/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Channels
app.post('/api/channels', async (req, res) => {
  try {
    console.log('Creating channel with data:', req.body);
    const channel = new Channel(req.body);
    console.log('Channel instance created:', channel);
    await channel.save();
    console.log('Channel saved successfully:', channel);
    res.status(201).json(channel);
  } catch (error) {
    console.error('Error creating channel:', error);
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/channels', async (req, res) => {
  try {
    const channels = await Channel.find().populate('members');
    res.json(channels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/channels/:id', async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id).populate('members');
    if (!channel) {
      return res.status(404).json({ error: 'Channel not found' });
    }
    res.json(channel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/channels/:id/join', async (req, res) => {
  try {
    const { userId } = req.body;
    const channel = await Channel.findById(req.params.id);
    
    if (!channel) {
      return res.status(404).json({ error: 'Channel not found' });
    }

    if (!channel.members.includes(userId)) {
      channel.members.push(userId);
      channel.lastActive = new Date();
      await channel.save();
    }

    res.json(channel);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/channels/join-by-code', async (req, res) => {
  try {
    const { code, userId } = req.body;
    const channel = await Channel.findOne({ code: code.toUpperCase() });
    
    if (!channel) {
      return res.status(404).json({ error: 'Invalid channel code' });
    }

    if (!channel.members.includes(userId)) {
      channel.members.push(userId);
      channel.lastActive = new Date();
      await channel.save();
    }

    res.json(channel);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/channels/:id/messages', async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) {
      return res.status(404).json({ error: 'Channel not found' });
    }

    const { content, sender } = req.body;
    channel.messages.push({ content, sender });
    channel.lastActive = new Date();
    await channel.save();

    res.json(channel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Clean up inactive channels
setInterval(async () => {
  const fiveHoursAgo = new Date(Date.now() - 5 * 60 * 60 * 1000);
  await Channel.deleteMany({
    lastActive: { $lt: fiveHoursAgo },
    members: { $size: 0 }
  });
}, 60 * 60 * 1000); // Run every hour

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
