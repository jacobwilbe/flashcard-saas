import { auth } from '@clerk/nextjs/server';
import { db } from '@/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export async function POST() {
  try {
    const { userId } = auth();
    if (!userId) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Check if user already exists in Firebase
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      // Create new user document in Firebase
      await setDoc(userRef, {
        clerkId: userId,
        flashcardSets: [],
        createdAt: new Date().toISOString()
      });
    }

    return new Response('User created successfully', { status: 200 });
  } catch (error) {
    return new Response('Error creating user', { status: 500 });
  }
} 