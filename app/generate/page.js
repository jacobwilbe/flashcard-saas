'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import StyleIcon from '@mui/icons-material/Style';
import { collection, doc, getDoc, writeBatch } from 'firebase/firestore';
import { db } from '@/firebase';
import TextInput from "./components/TextInput";
import FileUpload from "./components/FileUpload";
import FlashcardList from "./components/FlashcardList";

export default function Generate() {

  const [activeTab, setActiveTab] = useState("text");
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  // State for the user
  const { isSignedIn, user } = useUser();

  // State for the flashcards
  const [flashcards, setFlashcards] = useState([]);


  // State for the flashcard set name
  const [setName, setSetName] = useState('');

  // State for the modal
  const [open, setOpen] = useState(false);

  // State for the router
  const router = useRouter();

  // State for the type of flashcard generation
  const [isLoading, setIsLoading] = useState(false);


  const handleTextSubmit = async () => {
    if (!text.trim()) {
      alert("Please enter some text to generate flashcards.");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('text', text);

      const response = await fetch('/api/generate', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to generate flashcards');

      const data = await response.json();
      setFlashcards(data);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate flashcards. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('pdfFile', file);
      const response = await fetch('/api/generatePDF', {
        method: 'POST',
        body: formData,
      });
      console.log(response);

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to generate flashcards');
      setFlashcards(data);
    } catch (error) {
      console.error('Error:', error);
      alert(`Failed to process PDF. Please try again. ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle the submit button
  /*
  const handleSubmit = async (e) => {
    if (textType) {
      try {
        fetch('/api/generate', {
          method: 'POST',
          body: text,
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            setFlashcards(data);
            setLoading(false);
          });
      } catch (error) {
        console.error('Error: this is the error', error);
      }
    }
  };
  */

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const saveFlashcards = async () => {
    if (!isSignedIn || !user) {
      router.push('/sign-in');
      return;
    }
    if (!setName) {
      alert('Please enter a name for your flashcard set.');
    }
    try {
      const userDocRef = doc(collection(db, 'users'), user.id);
      const userDocSnap = await getDoc(userDocRef);
      const batch = writeBatch(db);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const updatedSets = [...(userData.flashcardSets || []), { name: setName }];
        batch.update(userDocRef, { flashcardSets: updatedSets });
      } else {
        batch.set(userDocRef, { flashcardSets: [{ name: setName }] });
      }

      const setDocRef = doc(collection(userDocRef, 'flashcardSets'), setName);
      batch.set(setDocRef, { flashcards });

      await batch.commit();

      alert('Flashcards saved successfully!');
      handleClose();
      setSetName('');
      router.push('/flashcards');
    } catch (error) {
      console.error('Error saving flashcards:', error);
      alert('An error occurred while saving flashcards. Please try again.');
    }
  };

 
  return (
    <div className="bg-white min-h-screen">
      {/* AppBar */}
      <header className="absolute inset-x-0 top-0 z-50 sticky">
        <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">FlashStudy</span>
              <StyleIcon className="mr-2" />
            </a>
          </div>
          <div className="flex lg:gap-x-12 md:gap-x-6 gap-x-6">
            <Link href="/" className="text-sm/6 font-semibold text-gray-900">
              Home
            </Link>
            <Link href="/flashcards" className="text-sm/6 font-semibold text-gray-900">
              Flashcards
            </Link>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-4xl font-bold  text-center mb-8">Generate Flashcards</h1>
        
        {/* Tabs */}
        <div className="mb-8">
          <div className="flex rounded-lg bg-gray-100 p-1">
            <button
              className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                activeTab === "text" ? "bg-white shadow-sm" : "hover:bg-gray-200"
              }`}
              onClick={() => setActiveTab("text")}
            >
              Text Input
            </button>
            <button
              className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                activeTab === "pdf" ? "bg-white shadow-sm" : "hover:bg-gray-200"
              }`}
              onClick={() => setActiveTab("pdf")}
            >
              PDF Upload
            </button>
          </div>
        </div>

        {/* Text Input Tab */}
        <div className={activeTab === "text" ? "block" : "hidden"}>
          <TextInput
            text={text}
            setText={setText}
            onSubmit={handleTextSubmit}
            isLoading={isLoading}
          />
        </div>

        {/* PDF Upload Tab */}
        <div className={activeTab === "pdf" ? "block" : "hidden"}>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-4 text-center">
            <input
              type="file"
              accept=".pdf"
              name="pdfFile"
              onChange={e => setFile(e.target.files[0])}
              className="hidden"
              id="pdf-upload"
              disabled={isLoading}
            />
            <label
              htmlFor="pdf-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <svg className="h-12 w-12 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
              </svg>
              <p className="text-lg mb-2">Drop your PDF here or click to upload</p>
              <p className="text-sm text-gray-500">Maximum file size: 10MB</p>
            </label>
          </div>
          {file && (
            <p>Selected file: {file.name}</p>
          )}
          <button
            className={`w-full py-3 px-4 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors ${
              isLoading ? "opacity-75 cursor-not-allowed" : ""
            }`}
            onClick={handleFileUpload}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </div>
            ) : (
              "Generate Flashcards"
            )}
          </button>
        </div>

        {/* Flashcards Display */}
        <FlashcardList flashcards={flashcards} />
        {flashcards.length > 0 && (
          <div className="flex justify-center mt-8">
            <button
            className="px-4 py-2 bg-indigo-600 text-white rounded-full"
            onClick={handleOpen}
          >
            Save Flashcards
            </button>
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
  );
}


