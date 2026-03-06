import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyDvWBDKoou0g0w1LArmw5NWh0bDjyXeRJQ",
    authDomain: "trusiq-6d9f5.firebaseapp.com",
    projectId: "trusiq-6d9f5",
    storageBucket: "trusiq-6d9f5.firebasestorage.app",
    messagingSenderId: "1087651530501",
    appId: "1:1087651530501:web:e7abdfb83c418fed02196c",
    measurementId: "G-SR86SXMLXZ"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

// Initialize Analytics conditionally (it only works in the browser)
let analytics;
if (typeof window !== 'undefined') {
    isSupported().then((supported) => {
        if (supported) {
            analytics = getAnalytics(app);
        }
    });
}

export { app, auth, analytics };
