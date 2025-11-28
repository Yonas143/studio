
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { firebaseConfig } from './src/firebase/config';

// Polyfill for fetch if needed in node environment (though newer node has it)
// validation of config
console.log('Config:', firebaseConfig);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testWrite() {
    try {
        console.log('Attempting to write to Firestore...');
        const docRef = await addDoc(collection(db, "test_collection"), {
            test: "data",
            timestamp: new Date()
        });
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

testWrite();
