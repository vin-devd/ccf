export interface User {
  id: string;
  username: string;
  avatar: string;
  ip: string;
  lastSeen: Date;
}

export interface Channel {
  id: string;
  name: string;
  code: string;
  image?: string;
  createdAt: Date;
  lastActive: Date;
  members: User[];
  messages: Message[];
}

export interface Message {
  id: string;
  content: string;
  type: 'text' | 'image' | 'link';
  sender: User;
  timestamp: Date;
  oneTimeView?: boolean;
  viewed?: boolean;
}
