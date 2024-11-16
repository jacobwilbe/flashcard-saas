import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// Check if any Firebase admin apps have been initialized
const apps = getApps();

if (!apps.length) {
  // Initialize the app if it hasn't been already
  try {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        // Make sure to properly format the private key
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
  }
}

export const adminAuth = getAuth(); 