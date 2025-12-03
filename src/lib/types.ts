import type { Timestamp } from 'firebase/firestore';

export type NavItem = {
  title: string;
  href: string;
  disabled?: boolean;
};

export interface UserProfile {
  id?: string;
  uid: string;
  email: string;
  name: string;
  role: 'participant' | 'admin';
}

export type Category = {
  id: string; // Corresponds to document ID in Firestore
  name: string;
  description: string;
  imageId: string;
  imageUrl?: string;
};

export type Nominee = {
  id: string; // Corresponds to document ID in Firestore
  name: string;
  category: string;
  region: string;
  scope?: 'ethiopia' | 'worldwide'; // New field for filtering
  bio: string;
  imageId: string;
  imageUrl?: string;
  media: {
    type: 'image' | 'video' | 'audio';
    url: string;
    thumbnail: string;
    description: string;
    hint: string;
  }[];
  votes: number;
  featured?: boolean;
};

export type Submission = {
  id?: string; // Firestore document ID
  title: string;
  categoryId: string;
  submitterId?: string;
  culturalRelevance: string;
  mediaUrl?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string; // Should be handled as a server timestamp
};



export type TimelineEvent = {
  id: string;
  date: string;
  title: string;
  description: string;
  order: number;
}

export type Vote = {
  id: string;
  userId: string;
  nomineeId: string;
  createdAt: string;
}
