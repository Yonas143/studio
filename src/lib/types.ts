import type { Timestamp } from 'firebase/firestore';

export type NavItem = {
  title: string;
  href: string;
  disabled?: boolean;
};

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: 'participant' | 'judge' | 'admin';
}

export type Category = {
  id: string; // Corresponds to document ID in Firestore
  name: string;
  description: string;
  imageId: string;
};

export type Nominee = {
  id: string; // Corresponds to document ID in Firestore
  name: string;
  category: string;
  region: string;
  bio: string;
  imageId: string;
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

export type JudgeSubmission = Submission & {
  nomineeName?: string; // This might need to be resolved via submitterId
  status: 'Pending' | 'Scored' | 'Feedback Provided';
};

export type TimelineEvent = {
    id: string;
    date: string;
    title: string;
    description: string;
    order: number;
}
