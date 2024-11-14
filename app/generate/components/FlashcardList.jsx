export default function FlashcardList({ flashcards }) {
    if (flashcards.length === 0) return null;
  
    return (
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6">Generated Flashcards</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {flashcards.map((flashcard, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-lg mb-2">Question:</h3>
                  <p className="text-gray-700">{flashcard.front}</p>
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-2">Answer:</h3>
                  <p className="text-gray-700">{flashcard.back}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }