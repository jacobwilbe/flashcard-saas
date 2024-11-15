"use client";


export default function FileUpload({ file, setFile, onFileSelect, isLoading }) {

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setFile(file);
    if (file && file.type === "application/pdf") {
      onFileSelect(file);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
      <input
        type="file"
        accept=".pdf"
        name="pdfFile"
        onChange={handleFileChange}
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
  );
}