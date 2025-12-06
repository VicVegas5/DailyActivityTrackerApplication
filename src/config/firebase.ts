import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Firebase configuration
// IMPORTANT: Replace these placeholder values with your actual Firebase config
// You'll get these values from the Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyBxw10Tr2ioC84GZlOAfglzGydTwlDENRw",
    authDomain: "daily-activity-tracker-6c93c.firebaseapp.com",
    databaseURL: "https://daily-activity-tracker-6c93c-default-rtdb.firebaseio.com",
    projectId: "daily-activity-tracker-6c93c",
    storageBucket: "daily-activity-tracker-6c93c.firebasestorage.app",
    messagingSenderId: "121093653572",
    appId: "1:121093653572:web:dc76b7088bfe89e2f3a811"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);
