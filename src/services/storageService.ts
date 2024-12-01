import { Channel, User } from '../types';

const DB_NAME = 'chatApp';
const DB_VERSION = 1;
const CHANNELS_STORE = 'channels';
const USERS_STORE = 'users';

class StorageService {
  private db: IDBDatabase | null = null;

  async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains(CHANNELS_STORE)) {
          db.createObjectStore(CHANNELS_STORE, { keyPath: 'id' });
        }
        
        if (!db.objectStoreNames.contains(USERS_STORE)) {
          db.createObjectStore(USERS_STORE, { keyPath: 'id' });
        }
      };
    });
  }

  // Channels
  async getChannels(): Promise<Channel[]> {
    if (!this.db) await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(CHANNELS_STORE, 'readonly');
      const store = transaction.objectStore(CHANNELS_STORE);
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async saveChannel(channel: Channel): Promise<void> {
    if (!this.db) await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(CHANNELS_STORE, 'readwrite');
      const store = transaction.objectStore(CHANNELS_STORE);
      const request = store.put(channel);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async updateChannel(channel: Channel): Promise<void> {
    return this.saveChannel(channel);
  }

  async deleteInactiveChannels(): Promise<void> {
    if (!this.db) await this.initDB();
    const channels = await this.getChannels();
    const fiveHoursAgo = new Date().getTime() - (5 * 60 * 60 * 1000);
    
    const activeChannels = channels.filter(channel => {
      const lastActive = new Date(channel.lastActive).getTime();
      return lastActive > fiveHoursAgo || channel.members.length > 0;
    });

    const transaction = this.db!.transaction(CHANNELS_STORE, 'readwrite');
    const store = transaction.objectStore(CHANNELS_STORE);
    
    // Clear all channels
    store.clear();
    
    // Add active channels back
    activeChannels.forEach(channel => {
      store.add(channel);
    });
  }

  // Users
  async getUsers(): Promise<User[]> {
    if (!this.db) await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(USERS_STORE, 'readonly');
      const store = transaction.objectStore(USERS_STORE);
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async saveUser(user: User): Promise<void> {
    if (!this.db) await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(USERS_STORE, 'readwrite');
      const store = transaction.objectStore(USERS_STORE);
      const request = store.put(user);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async cleanupOldUsers(): Promise<void> {
    if (!this.db) await this.initDB();
    const users = await this.getUsers();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const activeUsers = users.filter(user => {
      const lastSeen = new Date(user.lastSeen);
      return lastSeen > oneMonthAgo;
    });

    const transaction = this.db!.transaction(USERS_STORE, 'readwrite');
    const store = transaction.objectStore(USERS_STORE);
    
    // Clear all users
    store.clear();
    
    // Add active users back
    activeUsers.forEach(user => {
      store.add(user);
    });
  }
}

export const storageService = new StorageService();
