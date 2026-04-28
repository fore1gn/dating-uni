import { Profile, Message } from '../types';

export const DEMO_USER_ID = 'demo-user';

export const DEMO_PROFILE: Profile = {
  id: DEMO_USER_ID,
  name: 'You',
  bio: 'Just exploring the app!',
  age: 25,
  photos: ['https://i.pravatar.cc/400?img=68'],
  created_at: new Date().toISOString(),
};

export const MOCK_PROFILES: Profile[] = [
  { id: 'mock-1', name: 'Sophie', bio: 'Coffee addict & dog lover', age: 24, photos: ['https://i.pravatar.cc/400?img=1'], created_at: '' },
  { id: 'mock-2', name: 'Emma', bio: 'Travel enthusiast. Let\'s explore!', age: 27, photos: ['https://i.pravatar.cc/400?img=5'], created_at: '' },
  { id: 'mock-3', name: 'Olivia', bio: 'Yoga, hiking, and good vibes', age: 23, photos: ['https://i.pravatar.cc/400?img=9'], created_at: '' },
  { id: 'mock-4', name: 'Ava', bio: 'Bookworm looking for a chapter two', age: 26, photos: ['https://i.pravatar.cc/400?img=16'], created_at: '' },
  { id: 'mock-5', name: 'Mia', bio: 'Foodie. Send me your best recipe', age: 25, photos: ['https://i.pravatar.cc/400?img=20'], created_at: '' },
];

export const MOCK_MATCHES = [
  { id: 'match-1', created_at: new Date().toISOString(), profile: MOCK_PROFILES[0] },
  { id: 'match-2', created_at: new Date().toISOString(), profile: MOCK_PROFILES[1] },
];

export const MOCK_MESSAGES: Message[] = [
  { id: 'msg-1', match_id: 'match-1', sender_id: 'mock-1', content: 'Hey! How are you? 😊', created_at: new Date(Date.now() - 60000).toISOString() },
  { id: 'msg-2', match_id: 'match-1', sender_id: DEMO_USER_ID, content: 'Hi! I\'m great, you?', created_at: new Date(Date.now() - 30000).toISOString() },
  { id: 'msg-3', match_id: 'match-1', sender_id: 'mock-1', content: 'Doing well! Love your profile', created_at: new Date().toISOString() },
];
