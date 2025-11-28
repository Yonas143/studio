import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";
import { firebaseConfig } from './src/firebase/config';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

async function testSubmission() {
    console.log('Testing Submission Creation...');

    try {
        console.log('Signing in anonymously...');
        const userCredential = await signInAnonymously(auth);
        console.log('Signed in as:', userCredential.user.uid);

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
            submitterId: userCredential.user.uid
        };

        const docRef = await addDoc(collection(db, "submissions"), mockSubmission);
        console.log("✅ Submission created successfully!");
        console.log("Document ID:", docRef.id);
    } catch (e) {
        console.error("❌ Error creating submission:", e);
    }
}

testSubmission();
