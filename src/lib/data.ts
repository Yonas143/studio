import type { Category, Nominee, Submission, JudgeSubmission } from './types';

export const categories: Category[] = [
  {
    id: 'performing-arts',
    name: 'Performing Arts',
    description: 'Celebrating the best in traditional and contemporary Ethiopian dance and theatre.',
    imageId: 'category-performing-arts',
  },
  {
    id: 'traditional-music',
    name: 'Traditional Music',
    description: 'Honoring excellence in Ethiopian cultural music performance and arrangement.',
    imageId: 'category-traditional-music',
  },
  {
    id: 'digital-arts',
    name: 'Digital Arts',
    description: 'Recognizing innovative digital creations inspired by Ethiopian culture.',
    imageId: 'category-digital-arts',
  },
  {
    id: 'poetry',
    name: 'Poetry',
    description: 'Awarding the most moving traditional and modern cultural poems and recitations.',
    imageId: 'category-poetry',
  },
];

export const nominees: Nominee[] = [
  {
    id: '1',
    name: 'Abebe Bikila',
    category: 'Performing Arts',
    region: 'Addis Ababa',
    bio: 'Abebe Bikila is a celebrated dancer known for his innovative fusion of traditional Eskista with contemporary movements. He has performed on international stages, bringing Ethiopian dance to a global audience.',
    imageId: 'nominee-1',
    media: [{
      type: 'video',
      url: '#',
      thumbnail: 'https://picsum.photos/seed/abebe-media/400/225',
      description: 'Abebe Bikila performing at the National Theatre.',
      hint: 'ethiopian dance'
    }],
    votes: 12503,
  },
  {
    id: '2',
    name: 'Aster Aweke',
    category: 'Traditional Music',
    region: 'Oromia',
    bio: 'A legendary vocalist, Aster Aweke has been a prominent figure in Ethiopian music for decades. Her powerful voice and emotional delivery have earned her the title "The Queen of Ethiopian Soul".',
    imageId: 'nominee-2',
    media: [{
      type: 'audio',
      url: '#',
      thumbnail: 'https://picsum.photos/seed/aster-media/400/225',
      description: 'Studio recording of Aster Aweke\'s latest single.',
      hint: 'music album'
    }],
    votes: 21890,
  },
  {
    id: '3',
    name: 'Haile Gebrselassie',
    category: 'Digital Arts',
    region: 'Amhara',
    bio: 'Haile Gebrselassie is a digital artist who creates stunning visual art that reinterprets ancient Ethiopian patterns and stories through modern technology. His work has been featured in galleries worldwide.',
    imageId: 'nominee-3',
    media: [{
      type: 'image',
      url: 'https://picsum.photos/seed/haile-media/1200/800',
      thumbnail: 'https://picsum.photos/seed/haile-media/400/225',
      description: 'Digital artwork "Gondar Reimagined".',
      hint: 'digital art'
    }],
    votes: 8450,
  },
  {
    id: '4',
    name: 'Liya Kebede',
    category: 'Poetry',
    region: 'SNNPR',
    bio: 'Liya Kebede is a powerful voice in modern Ethiopian poetry. Her work explores themes of identity, heritage, and social justice, resonating deeply with the younger generation.',
    imageId: 'nominee-4',
    media: [{
      type: 'video',
      url: '#',
      thumbnail: 'https://picsum.photos/seed/liya-media/400/225',
      description: 'Liya Kebede reciting her poem "Motherland".',
      hint: 'woman reading'
    }],
    votes: 15230,
  },
  {
    id: '5',
    name: 'Mahlet Zeleke',
    category: 'Traditional Music',
    region: 'Addis Ababa',
    bio: 'A virtuoso of the Masenqo, Mahlet Zeleke is dedicated to preserving the traditional stringed instrument while exploring its potential in contemporary compositions.',
    imageId: 'nominee-5',
    media: [],
    votes: 9800,
  },
  {
    id: '6',
    name: 'Dawit Getahun',
    category: 'Performing Arts',
    region: 'Tigray',
    bio: 'As the leader of the "Axumite Roots" dance troupe, Dawit Getahun has revitalized ancient dance forms, ensuring their survival for future generations.',
    imageId: 'nominee-6',
    media: [],
    votes: 7600,
  },
  {
    id: '7',
    name: 'Sara Abera',
    category: 'Poetry',
    region: 'Amhara',
    bio: 'Sara Abera\'s poetic works, written in Amharic, are known for their lyrical quality and profound connection to Ethiopian folklore and history.',
    imageId: 'nominee-7',
    media: [],
    votes: 11200,
  },
  {
    id: '8',
    name: 'Henok Abebe',
    category: 'Digital Arts',
    region: 'Oromia',
    bio: 'Henok Abebe is a 3D artist who creates immersive virtual reality experiences of Ethiopian historical sites, making heritage accessible to all.',
    imageId: 'nominee-8',
    media: [],
    votes: 6500,
  },
];

export const featuredNominees = nominees.slice(0, 4);

export const timelineEvents = [
  {
    date: 'June 1 - July 31',
    title: 'Submissions Open',
    description: 'Artists and creators can submit their work for consideration.',
  },
  {
    date: 'August 1 - August 31',
    title: 'Judging Period',
    description: 'Our panel of expert judges reviews all submissions.',
  },
  {
    date: 'September 1 - September 30',
    title: 'Public Voting',
    description: 'The public votes for their favorite nominees in each category.',
  },
  {
    date: 'October 15',
    title: 'Winners Announced',
    description: 'The winners of the Cultural Ambassadors Award are revealed!',
  },
];

export const userSubmissions: Submission[] = [
  {
    id: 'sub001',
    title: 'Echoes of Lalibela',
    category: 'Traditional Music',
    status: 'Approved',
    submissionDate: '2024-06-15',
  },
  {
    id: 'sub002',
    title: 'Gondar Awakening',
    category: 'Digital Arts',
    status: 'Pending',
    submissionDate: '2024-07-02',
  },
  {
    id: 'sub003',
    title: 'The Coffee Seller\'s Song',
    category: 'Poetry',
    status: 'Rejected',
    submissionDate: '2024-06-28',
  },
];

export const judgeSubmissions: JudgeSubmission[] = [
  {
    id: 'judge001',
    nomineeName: 'Abebe Bikila',
    category: 'Performing Arts',
    submissionText: 'This dance piece explores the intersection of warrior chants and the delicate footwork of the Gurage region. The choreography aims to tell a story of resilience and community, using traditional costumes with a modern twist. The music is an original composition blending the sounds of the Kirar with electronic beats.',
    mediaUrl: '#',
    status: 'Pending',
  },
  {
    id: 'judge002',
    nomineeName: 'Liya Kebede',
    category: 'Poetry',
    submissionText: 'This collection of poems, titled "Wax and Gold," uses the traditional Ethiopian poetic form of "Sem-ena Werq" (Wax and Gold) to comment on contemporary social issues. Each poem has an obvious surface meaning (the Wax) and a deeper, hidden meaning (the Gold). Themes include diaspora identity, generational change, and the enduring strength of Ethiopian women.',
    mediaUrl: '#',
    status: 'Pending',
  },
  {
    id: 'judge003',
    nomineeName: 'Haile Gebrselassie',
    category: 'Digital Arts',
    submissionText: 'A series of animated digital paintings based on the epic of the Queen of Sheba and King Solomon. The art style is inspired by the flattened perspectives and bold outlines of ancient Ethiopian church frescoes, but brought to life with subtle animation and a rich, cinematic color palette. The goal is to make this foundational story accessible and engaging for a new, digital-native generation.',
    mediaUrl: '#',
    status: 'Scored',
  },
];
