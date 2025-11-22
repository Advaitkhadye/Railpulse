import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyD4EueEufKjXLNsZH6SxURMYGBEPaqMQrg",
    authDomain: "railpulse-a10f1.firebaseapp.com",
    projectId: "railpulse-a10f1",
    storageBucket: "railpulse-a10f1.firebasestorage.app",
    messagingSenderId: "1085095795322",
    appId: "1:1085095795322:web:ba8422d97b570ef1bcf9c3",
    measurementId: "G-2G224234EZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
const analytics = getAnalytics(app);