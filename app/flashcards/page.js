'use client'
import { SignedIn, UserButton, useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { doc, getDoc, setDoc, collection } from 'firebase/firestore'
import { db } from '@/firebase'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Flashcards() {
  const { isLoaded, isSignedIn, user } = useUser()
  const [flashcards, setFlashcards] = useState([])
  const router = useRouter()

  useEffect(() => {
    async function getFlashcards() {
      if (!user?.id) return
      const docRef = doc(collection(db, 'users'), user.id)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const collections = docSnap.data().flashcardSets || []
        console.log(collections)
        setFlashcards(collections)
      } else {
        await setDoc(docRef, { flashcardSets: [] })
      }
    }
    getFlashcards()
  }, [user?.id])

  if (!isLoaded || !isSignedIn) {
    return <></>
  }

  const handleCardClick = (name) => {
    router.push(`/flashcard?id=${name}`)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* AppBar */}
      <header className="bg-transparent border-b border-white/20 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-xl font-bold">FlashStudy</h1>
            <div className="flex space-x-4">
              <Link href="/generate" className="text-white hover:text-gray-300">
                Generate
              </Link>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold">Your Flashcards</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {flashcards.map((flashcard, index) => (
            <div
              key={index}
              className="bg-white text-black p-4 rounded-lg shadow-lg cursor-pointer"
              onClick={() => handleCardClick(flashcard.name)}
            >
              <h3 className="text-lg font-bold">{flashcard.name}</h3>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
