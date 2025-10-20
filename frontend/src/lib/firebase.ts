import { getAnalytics } from "firebase/analytics"
import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyB86zEZ-u2CDej0WpluHsc7Yfa5DiqEQ-Y",
  authDomain: "shift-2143b.firebaseapp.com",
  projectId: "shift-2143b",
  storageBucket: "shift-2143b.firebasestorage.app",
  messagingSenderId: "179121843981",
  appId: "1:179121843981:web:51fb183fe474df93168a44",
  measurementId: "G-GBWXCC5PMW",
}

const app = initializeApp(firebaseConfig)

export const analytics = getAnalytics(app)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()
