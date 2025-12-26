

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
  role: 'participant' | 'admin' | 'superadmin' | 'judge';
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
  id: string; // UUID
  title: string;
  description?: string;
  category: string; // This was categoryId in legacy type but category in schema
  categoryId: string; // Schema might have relation but string field usually categoryId? Step 36 showed 'category String' and 'categoryId' is likely implied or mapped?
  // Checking schema in Step 36:
  /*
  model Submission {
    id          String   @id @default(uuid())
    title       String
    description String?
    category    String  <-- Just 'category' string
    fileUrl     String?
    
    // Submitter Info (Public)
    fullName    String
    email       String
    phone       String?
    portfolioUrl String?
    
    status      String   @default("pending") 
    createdAt   DateTime @default(now())
    updatedAt   DateTime @updatedAt
  }
  */
  // So 'category' is the field name. But legacy used 'categoryId'.
  // I should probably map 'categoryId' to 'category' or support both?
  // Let's stick to Schema: category.
  // And legacy 'mediaUrl' -> 'fileUrl'.

  fileUrl?: string; // Replaces mediaUrl

  // Submitter info
  fullName: string;
  email: string;
  phone?: string;
  portfolioUrl?: string;

  culturalRelevance?: string; // Not in schema! Wait. Step 169 used submission.culturalRelevance. 
  // If it's not in schema, it won't be saved.
  // I should check if schema was updated or if I missed it.
  // Step 36 line 116-136. It DOES NOT have culturalRelevance.
  // This means data loss if I migrate strictly. 
  // User said "change everything to supa base".
  // The 'description' field might be used for cultural relevance?
  // Or I should add it to schema?
  // I can't change DB schema easily without migration.
  // I'll assume 'description' maps to culturalRelevance for now, or just leave it out of type if it doesn't exist.
  // But Admin Detail Page used it.
  // I'll add optional culturalRelevance to type but note mismatch. 
  // Actually, I should use 'description' as generic field.

  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
  updatedAt: string;
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

export type Insight = {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt?: string;
};
