'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SignedIn, UserButton, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import StyleIcon from '@mui/icons-material/Style'
import { collection, doc, getDoc, writeBatch } from 'firebase/firestore'
import { db } from '@/firebase'

export default function Generate() {
  const { isSignedIn, user } = useUser()
  const [flashcards, setFlashcards] = useState([])
  const [flipped, setFlipped] = useState({})
  const [text, setText] = useState('')
  const [setName, setSetName] = useState('')
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const [textType, setTextType] = useState(true)
  const [pdfType, setPdfType] = useState(false)
  const [pdfFile, setPdfFile] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleFileChange = (event) => {
    setPdfFile(event.target.files[0])
  }

  const handleSubmit = async (e) => {
    if (textType) {
      try {
        fetch('/api/generate', {
          method: 'POST',
          body: text,
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data)
            setFlashcards(data)
            setLoading(false)
          })
      } catch (error) {
        console.error('Error: this is the error', error)
      }
    }
  }

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const saveFlashcards =  async () => { 
    if (!isSignedIn || !user) {
        router.push('/sign-in')
        return
    }
    if (!setName) {
        alert('Please enter a name for your flashcard set.')
    }
    try {
      const userDocRef = doc(collection(db, 'users'), user.id)
      const userDocSnap = await getDoc(userDocRef)
      const batch = writeBatch(db)

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data()
        const updatedSets = [...(userData.flashcardSets || []), { name: setName }]
        batch.update(userDocRef, { flashcardSets: updatedSets })
      } else {
        batch.set(userDocRef, { flashcardSets: [{ name: setName}] })
      }
  
      const setDocRef = doc(collection(userDocRef, 'flashcardSets'), setName)
      batch.set(setDocRef, { flashcards })
  
      await batch.commit()
  
      alert('Flashcards saved successfully!')
      handleClose()
      setSetName('')
      router.push('/flashcards')
    } catch (error) {
      console.error('Error saving flashcards:', error)
      alert('An error occurred while saving flashcards. Please try again.')
    }
  }

  const textOn = () => {
    setTextType(true)
    setPdfType(false)
  }

  const pdfOn = () => {
    setTextType(false)
    setPdfType(true)
  }

  if (!isSignedIn) {
    router.push('/sign-in')
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* AppBar */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-indigo-600 flex items-center">
              <StyleIcon className="mr-2" />
              FlashStudy
            </h1>
            <div className="flex space-x-4">
              <Link href="/" className="text-indigo-600 hover:text-indigo-800">
                Home
              </Link>
              <Link href="/flashcards" className="text-indigo-600 hover:text-indigo-800">
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
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900">Generate Flashcards</h2>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="flex justify-center gap-4 mb-4">
            <button
              className={`px-4 py-2 rounded-full border ${
                textType ? 'bg-indigo-600 text-white' : 'bg-transparent text-indigo-600'
              }`}
              onClick={textOn}
            >
              Text
            </button>
            <button
              className={`px-4 py-2 rounded-full border ${
                pdfType ? 'bg-indigo-600 text-white' : 'bg-transparent text-indigo-600'
              }`}
              onClick={pdfOn}
            >
              PDF
            </button>
          </div>
          {textType && (
            <>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text"
                className="w-full p-4 mb-4 bg-gray-100 rounded-lg text-gray-900"
                rows={4}
              />
              <button
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-full"
                onClick={() => {
                  handleSubmit()
                  setLoading(true)
                }}
              >
                Generate Flashcards
              </button>
            </>
          )}
          {pdfType && (
            <div className="mb-4">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="mb-2"
              />
              {pdfFile && <p>Selected file: {pdfFile.name}</p>}
              <button
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-full mt-2"
                onClick={(e) => {
                  handleSubmit(e)
                  setLoading(true)
                }}
                disabled={!pdfFile}
              >
                Generate Flashcards
              </button>
            </div>
          )}
        </div>

        {loading && (
          <div className="flex justify-center mt-8">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600"></div>
          </div>
        )}

        {flashcards.length > 0 && (
          <div className="mt-8">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Flashcards Preview</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {flashcards.map((flashcard, index) => (
                <div
                  key={index}
                  className="bg-white text-gray-900 p-4 rounded-lg shadow-md"
                >
                  <div
                    className={`transform transition-transform duration-500 ${
                      flipped[index] ? 'rotate-y-180' : ''
                    }`}
                    onClick={() => handleCardClick(index)}
                  >
                    <div className="text-center">
                      <h4 className="text-lg font-bold">{flashcard.front}</h4>
                      <p className="mt-2">{flashcard.back}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-8">
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded-full"
                onClick={handleOpen}
              >
                Save Flashcards
              </button>
            </div>
          </div>
        )}

        {open && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h4 className="text-xl font-bold mb-4 text-gray-900">Save Flashcards</h4>
              <p className="mb-4 text-gray-700">Please enter a name for your flashcard collection.</p>
              <input
                type="text"
                value={setName}
                onChange={(e) => setSetName(e.target.value)}
                className="w-full p-2 mb-4 border rounded-lg"
                placeholder="Set Name"
              />
              <div className="flex justify-end space-x-4">
                <button
                  className="px-4 py-2 bg-gray-300 rounded-full"
                  onClick={handleClose}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-indigo-600 text-white rounded-full"
                  onClick={saveFlashcards}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}