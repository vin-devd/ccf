import { Channel, User } from '../types';
import fs from 'fs';
import path from 'path';

const channelsPath = path.join(__dirname, '../data/channels.json');
const usersPath = path.join(__dirname, '../data/users.json');

// Channels
export const getChannels = (): Channel[] => {
  try {
    const data = fs.readFileSync(channelsPath, 'utf8');
    return JSON.parse(data).channels;
  } catch (error) {
    console.error('Error reading channels:', error);
    return [];
  }
};

export const saveChannel = (channel: Channel): void => {
  try {
    const channels = getChannels();
    channels.push(channel);
    fs.writeFileSync(channelsPath, JSON.stringify({ channels }, null, 2));
  } catch (error) {
    console.error('Error saving channel:', error);
  }
};

export const updateChannel = (updatedChannel: Channel): void => {
  try {
    const channels = getChannels();
    const index = channels.findIndex(ch => ch.id === updatedChannel.id);
    if (index !== -1) {
      channels[index] = updatedChannel;
      fs.writeFileSync(channelsPath, JSON.stringify({ channels }, null, 2));
    }
  } catch (error) {
    console.error('Error updating channel:', error);
  }
};

export const deleteInactiveChannels = (): void => {
  try {
    const channels = getChannels();
    const activeChannels = channels.filter(channel => {
      const lastActive = new Date(channel.lastActive).getTime();
      const fiveHoursAgo = new Date().getTime() - (5 * 60 * 60 * 1000);
      return lastActive > fiveHoursAgo || channel.members.length > 0;
    });
    fs.writeFileSync(channelsPath, JSON.stringify({ channels: activeChannels }, null, 2));
  } catch (error) {
    console.error('Error cleaning inactive channels:', error);
  }
};

// Users
export const getUsers = (): User[] => {
  try {
    const data = fs.readFileSync(usersPath, 'utf8');
    return JSON.parse(data).users;
  } catch (error) {
    console.error('Error reading users:', error);
    return [];
  }
};

export const saveUser = (user: User): void => {
  try {
    const users = getUsers();
    // Check if user already exists
    const existingUserIndex = users.findIndex(u => u.ip === user.ip);
    if (existingUserIndex !== -1) {
      // Update existing user
      users[existingUserIndex] = {
        ...users[existingUserIndex],
        lastSeen: new Date(),
      };
    } else {
      // Add new user
      users.push(user);
    }
    fs.writeFileSync(usersPath, JSON.stringify({ users }, null, 2));
  } catch (error) {
    console.error('Error saving user:', error);
  }
};

export const cleanupOldUsers = (): void => {
  try {
    const users = getUsers();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const activeUsers = users.filter(user => {
      const lastSeen = new Date(user.lastSeen);
      return lastSeen > oneMonthAgo;
    });

    fs.writeFileSync(usersPath, JSON.stringify({ users: activeUsers }, null, 2));
  } catch (error) {
    console.error('Error cleaning old users:', error);
  }
};
