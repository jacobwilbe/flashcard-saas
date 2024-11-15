"use client";

export default function TextInput({ text, setText, onSubmit, isLoading }) {
  return (
    <div className="space-y-4">
      <textarea
        placeholder="Enter your text here..."
        className="w-full min-h-[200px] p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={isLoading}
      />
      <button
        className={`w-full py-3 px-4 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors ${
          isLoading ? "opacity-75 cursor-not-allowed" : ""
        }`}
        onClick={onSubmit}
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
  );
}