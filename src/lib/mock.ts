import { ImageSourcePropType } from 'react-native';
import { Profile, Message } from '../types';

export const DEFAULT_AVATAR: ImageSourcePropType = require('../../assets/default-avatar.png');

export const DEMO_USER_ID = 'demo-user';

export const DEMO_PROFILE: Profile = {
  id: DEMO_USER_ID,
  name: 'You',
  bio: 'Just exploring the app!',
  age: 25,
  photos: [],
  created_at: new Date().toISOString(),
  university: 'Universidad Complutense de Madrid',
  city: 'Madrid',
  degree: 'Computer Science',
};

export const MOCK_PROFILES_CAMPUS: Profile[] = [
  { id: 'mock-c1', name: 'Sophie', bio: 'Coffee addict & dog lover. Always at the library or the nearest cafe. Let\'s grab a cortado sometime!', age: 24, photos: [], created_at: '', university: 'Universidad Complutense de Madrid', city: 'Madrid', degree: 'Psychology' },
  { id: 'mock-c2', name: 'Emma', bio: 'Travel enthusiast. Spent last summer interrailing across Europe. Looking for someone to plan the next adventure with.', age: 27, photos: [], created_at: '', university: 'Universidad Complutense de Madrid', city: 'Madrid', degree: 'International Relations' },
  { id: 'mock-c3', name: 'Olivia', bio: 'Yoga, hiking, and good vibes. You\'ll find me at Retiro Park on weekends. Vegetarian cook experimenting with new recipes.', age: 23, photos: [], created_at: '', university: 'Universidad Complutense de Madrid', city: 'Madrid', degree: 'Fine Arts' },
  { id: 'mock-c4', name: 'Isabella', bio: 'Med student surviving on coffee and determination. Love salsa dancing on Friday nights.', age: 22, photos: [], created_at: '', university: 'Universidad Complutense de Madrid', city: 'Madrid', degree: 'Medicine' },
  { id: 'mock-c5', name: 'Elena', bio: 'Writing my thesis on contemporary Spanish literature. Always happy to chat about books or recommend a good read.', age: 26, photos: [], created_at: '', university: 'Universidad Complutense de Madrid', city: 'Madrid', degree: 'Spanish Literature' },
  { id: 'mock-c6', name: 'Clara', bio: 'Physics nerd by day, guitarist by night. Looking for someone to watch the stars with.', age: 21, photos: [], created_at: '', university: 'Universidad Complutense de Madrid', city: 'Madrid', degree: 'Physics' },
  { id: 'mock-c7', name: 'Paula', bio: 'Environmental science student. Passionate about sustainability. Let\'s save the planet together!', age: 23, photos: [], created_at: '', university: 'Universidad Complutense de Madrid', city: 'Madrid', degree: 'Environmental Science' },
  { id: 'mock-c8', name: 'Andrea', bio: 'Law student who also paints. Trying to find the balance between logic and creativity.', age: 24, photos: [], created_at: '', university: 'Universidad Complutense de Madrid', city: 'Madrid', degree: 'Law' },
  { id: 'mock-c9', name: 'Martina', bio: 'History major obsessed with medieval Spain. I give great museum tours!', age: 25, photos: [], created_at: '', university: 'Universidad Complutense de Madrid', city: 'Madrid', degree: 'History' },
  { id: 'mock-c10', name: 'Sara', bio: 'Studying economics but my real passion is photography. Always carrying my camera around campus.', age: 22, photos: [], created_at: '', university: 'Universidad Complutense de Madrid', city: 'Madrid', degree: 'Economics' },
];

export const MOCK_PROFILES_CITY: Profile[] = [
  { id: 'mock-t1', name: 'Lucia', bio: 'Architecture student obsessed with Gaudi. Love tapas, flamenco, and long walks through La Latina.', age: 22, photos: [], created_at: '', university: 'Universidad Politecnica de Madrid', city: 'Madrid', degree: 'Architecture' },
  { id: 'mock-t2', name: 'Carmen', bio: 'Film nerd & cat person. Studying directing and hoping to make my first short this year. Always at Cine Dore.', age: 25, photos: [], created_at: '', university: 'Universidad Autonoma de Madrid', city: 'Madrid', degree: 'Film Studies' },
  { id: 'mock-t3', name: 'Ava', bio: 'Bookworm looking for a chapter two. Currently reading everything by Almudena Grandes. Tea over coffee.', age: 26, photos: [], created_at: '', university: 'IE University', city: 'Madrid', degree: 'Business Administration' },
  { id: 'mock-t4', name: 'Mia', bio: 'Foodie. Send me your best recipe. I run a small food blog reviewing hidden gems around Malasana.', age: 25, photos: [], created_at: '', university: 'Universidad Carlos III', city: 'Madrid', degree: 'Journalism' },
  { id: 'mock-t5', name: 'Valentina', bio: 'Dance major at the conservatory. When I\'m not in the studio you\'ll find me at the Rastro flea market.', age: 21, photos: [], created_at: '', university: 'Real Conservatorio', city: 'Madrid', degree: 'Contemporary Dance' },
  { id: 'mock-t6', name: 'Natalia', bio: 'Biotech student who loves board games and escape rooms. Always up for a challenge.', age: 23, photos: [], created_at: '', university: 'Universidad Politecnica de Madrid', city: 'Madrid', degree: 'Biotechnology' },
  { id: 'mock-t7', name: 'Rocio', bio: 'Studying translation. I speak four languages and I\'m working on my fifth. Polyglot in progress!', age: 24, photos: [], created_at: '', university: 'Universidad Autonoma de Madrid', city: 'Madrid', degree: 'Translation & Interpreting' },
  { id: 'mock-t8', name: 'Ines', bio: 'Design student with a love for street art. If you know any good murals in Madrid, tell me!', age: 22, photos: [], created_at: '', university: 'IED Madrid', city: 'Madrid', degree: 'Graphic Design' },
  { id: 'mock-t9', name: 'Alba', bio: 'Nursing student and weekend hiker. The Sierra de Guadarrama is my happy place.', age: 25, photos: [], created_at: '', university: 'Universidad Autonoma de Madrid', city: 'Madrid', degree: 'Nursing' },
  { id: 'mock-t10', name: 'Daniela', bio: 'CS student and hackathon addict. Building my first startup. Coffee is my fuel.', age: 23, photos: [], created_at: '', university: 'Universidad Carlos III', city: 'Madrid', degree: 'Computer Engineering' },
];

// Keep combined list for backwards compat
export const MOCK_PROFILES: Profile[] = [...MOCK_PROFILES_CAMPUS, ...MOCK_PROFILES_CITY];

export const MOCK_MATCHES = [
  { id: 'match-1', created_at: new Date().toISOString(), profile: MOCK_PROFILES_CAMPUS[0] },
  { id: 'match-2', created_at: new Date().toISOString(), profile: MOCK_PROFILES_CITY[0] },
];

export const MOCK_MESSAGES: Message[] = [
  { id: 'msg-1', match_id: 'match-1', sender_id: 'mock-c1', content: 'Hey! How are you?', created_at: new Date(Date.now() - 60000).toISOString() },
  { id: 'msg-2', match_id: 'match-1', sender_id: DEMO_USER_ID, content: 'Hi! I\'m great, you?', created_at: new Date(Date.now() - 30000).toISOString() },
  { id: 'msg-3', match_id: 'match-1', sender_id: 'mock-c1', content: 'Doing well! Love your profile', created_at: new Date().toISOString() },
];
