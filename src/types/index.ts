export interface Profile {
  id: string;
  name: string;
  bio: string;
  age: number;
  photos: string[];
  created_at: string;
}

export interface Match {
  id: string;
  user1_id: string;
  user2_id: string;
  created_at: string;
  profile?: Profile;
}

export interface Message {
  id: string;
  match_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

export interface Swipe {
  id: string;
  swiper_id: string;
  swiped_id: string;
  direction: 'like' | 'pass';
  created_at: string;
}
