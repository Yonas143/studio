export type NavItem = {
  title: string;
  href: string;
  disabled?: boolean;
};

export type Category = {
  id: string;
  name: string;
  description: string;
  imageId: string;
};

export type Nominee = {
  id: string;
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
};

export type Submission = {
  id: string;
  title: string;
  category: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  submissionDate: string;
};

export type JudgeSubmission = {
  id: string;
  nomineeName: string;
  category: string;
  submissionText: string;
  mediaUrl: string;
  status: 'Pending' | 'Scored' | 'Feedback Provided';
};
