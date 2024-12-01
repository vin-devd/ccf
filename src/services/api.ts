import axios from 'axios';
import { User, Channel } from '../types';

const API_URL = 'http://localhost:5000/api';

export const api = {
  // Users
  createUser: async (userData: Partial<User>) => {
    const response = await axios.post(`${API_URL}/users`, userData);
    return response.data;
  },

  // Channels
  getChannels: async () => {
    const response = await axios.get(`${API_URL}/channels`);
    return response.data;
  },

  createChannel: async (channelData: Partial<Channel>) => {
    const response = await axios.post(`${API_URL}/channels`, channelData);
    return response.data;
  },

  joinChannel: async (channelId: string, userId: string) => {
    const response = await axios.post(`${API_URL}/channels/${channelId}/join`, { userId });
    return response.data;
  },

  joinChannelByCode: async (code: string, userId: string) => {
    const response = await axios.post(`${API_URL}/channels/join-by-code`, { code, userId });
    return response.data;
  },

  // Get channel by ID
  getChannel: async (channelId: string) => {
    const response = await axios.get(`${API_URL}/channels/${channelId}`);
    return response.data;
  },

  // Send message
  sendMessage: async (channelId: string, content: string, sender: string) => {
    const response = await axios.post(`${API_URL}/channels/${channelId}/messages`, {
      content,
      sender
    });
    return response.data;
  }
};
