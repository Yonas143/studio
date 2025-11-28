
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { firebaseConfig } from './src/firebase/config';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testSubmission() {
    console.log('Testing Submission Creation...');

    const mockSubmission = {
        fullName: "Test User",
        email: "test@example.com",
        nomineeName: "Test Nominee",
        category: "Traditional Music",
        biography: "This is a test biography for the submission verification process. It needs to be long enough to pass validation.",
        culturalRelevance: "This is a test cultural relevance statement. It also needs to be long enough to pass validation.",
        mediaUrl: "https://example.com",
        photoUrl: "https://example.com/photo.jpg",
        status: 'pending',
        submittedAt: new Date(),
        submitterId: "test-user-id" // Simulating a logged-in user
    };

    try {
        const docRef = await addDoc(collection(db, "submissions"), mockSubmission);
        console.log("✅ Submission created successfully!");
        console.log("Document ID:", docRef.id);
    } catch (e) {
        console.error("❌ Error creating submission:", e);
    }
}

testSubmission();
