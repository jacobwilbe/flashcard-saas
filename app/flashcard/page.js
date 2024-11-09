'use client'

import { SignedIn, UserButton, useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { collection, doc, getDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser()
  const [flashcards, setFlashcards] = useState([])
  const [flipped, setFlipped] = useState({})
  const [testMode, setTestMode] = useState(false)
  const [answers, setAnswers] = useState({})
  const [correctAnswers, setCorrectAnswers] = useState({})
  const [percentage, setPercentage] = useState(0)
  const [finalScore, setFinalScore] = useState(0)

  const handleCorrect = async (answer, back, index) => {
    const text = "Answer: " + answer + " " + "Back: " + back
    console.log(text)

    try {
      const response = await fetch('/api/testMode', {
        method: 'POST',
        body: text,
      })
      const result = await response.json()
      console.log(result)
      setCorrectAnswers(prev => {
        const newCorrectAnswers = { ...prev, [index]: result.result === "True" }

        // Calculate percentage using the updated correctAnswers
        const correctCount = Object.values(newCorrectAnswers).filter(bool => bool === true).length
        const totalAnswers = Object.keys(newCorrectAnswers).length
        const newPercentage = totalAnswers > 0 ? (correctCount / totalAnswers) * 100 : 0

        console.log(`Correct: ${correctCount}, Total: ${totalAnswers}, Percentage: ${newPercentage}`)

        if (totalAnswers === 10) {
          setFinalScore(newPercentage)
        }

        // Update percentage state
        setPercentage(Math.round(newPercentage))

        return newCorrectAnswers
      })
    } catch (error) {
      console.log(error)
    }
  }

  const searchParams = useSearchParams()
  const id = searchParams.get('id')

  useEffect(() => {
    async function getFlashcard() {
      if (!id || !user) return
      console.log(user.id)

      const docRef = doc(collection(doc(collection(db, 'users'), user.id), 'flashcardSets'), id)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const data = docSnap.data()
        console.log("Retrieved data:", data)
        setFlashcards(data.flashcards || [])
      } else {
        console.log("No such document!")
      }
    }
    getFlashcard()
  }, [id, user])

  const handleCardClick = (id) => {
    if (testMode) return
    setFlipped(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  if (!isLoaded || !isSignedIn) {
    return <></>
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
              <Link href="/flashcards" className="text-white hover:text-gray-300">
                Flashcards
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
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold">{id} Flashcards</h2>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-green-500"
                checked={testMode}
                onChange={() => setTestMode(prev => !prev)}
              />
              <span>{testMode ? "Test Mode" : "Study Mode"}</span>
            </label>
            {testMode && (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={percentage}
                  text={`${percentage}%`}
                  styles={buildStyles({
                    rotation: 0.25,
                    strokeLinecap: 'butt',
                    textSize: '16px',
                    pathTransitionDuration: 0.5,
                    pathColor: 'green',
                    textColor: 'white',
                    trailColor: 'white',
                    backgroundColor: '#3e98c7',
                  })}
                />
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {flashcards.map((flashcard, index) => (
            <div
              key={index}
              className={`bg-white text-black p-4 rounded-lg shadow-lg cursor-pointer border-4 ${
                testMode
                  ? correctAnswers[index] === true
                    ? 'border-green-500'
                    : correctAnswers[index] === false
                    ? 'border-red-500'
                    : 'border-white'
                  : 'border-white'
              }`}
              onClick={() => handleCardClick(index)}
            >
              <div className={`transform transition-transform duration-500 ${flipped[index] ? 'rotate-y-180' : ''}`}>
                <div className="text-center">
                  <h4 className="text-lg font-bold">{flashcard.front}</h4>
                  <p className="mt-2">{flashcard.back}</p>
                </div>
              </div>
              {testMode && (
                <div className="mt-4">
                  <input
                    type="text"
                    value={answers[index] || ''}
                    onChange={(e) => setAnswers(prev => ({ ...prev, [index]: e.target.value }))}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Your answer"
                  />
                  <button
                    className="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded-full"
                    onClick={() => handleCorrect(answers[index], flashcard.back, index)}
                  >
                    Submit
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {finalScore > 0 && (
          <div className="flex justify-center mt-8">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-full">
              View Results
            </button>
          </div>
        )}
      </main>
    </div>
  )
}