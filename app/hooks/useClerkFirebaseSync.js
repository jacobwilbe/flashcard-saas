import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { signInWithClerk } from '@/firebase';

export function useClerkFirebaseSync() {
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      // Sign in to Firebase with Clerk token
      signInWithClerk();
      
      // Create or sync user in Firebase
      fetch('/api/auth/create-user', {
        method: 'POST',
      });
    }
  }, [isLoaded, isSignedIn, user]);
} 