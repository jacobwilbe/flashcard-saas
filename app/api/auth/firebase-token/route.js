import { auth } from '@clerk/nextjs/server';
import { adminAuth } from '@/firebase-admin';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Generate a custom token with the Clerk user ID
    const customToken = await adminAuth.createCustomToken(userId);

    return NextResponse.json({ token: customToken });
  } catch (error) {
    console.error('Error creating custom token:', error);
    return new NextResponse('Error creating token', { status: 500 });
  }
} 