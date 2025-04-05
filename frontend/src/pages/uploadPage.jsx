import { useState } from "react";
import axios from "axios";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:5000/api/analyze-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResult(response.data.predictions);
    } catch (error) {
      console.error("Upload failed:", error);
      setResult("Error processing image.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
        <h2 className="text-3xl font-bold text-blue-600 mb-6">AI Image Analyzer</h2>
        <p className="text-gray-500 mb-4">Upload an educational tool image to identify and learn more about it.</p>
  
        {/* Upload Button */}
        <div className="mb-6">
          <label
            htmlFor="fileUpload"
            className="w-full flex items-center justify-center gap-2 cursor-pointer px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition duration-300"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12v6m0 0l-3-3m3 3l3-3m-3-9v6" />
            </svg>
            Upload Image
          </label>
          <input
            id="fileUpload"
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="hidden"
          />
        </div>
  
        {/* Upload Button */}
        <button
          onClick={handleUpload}
          className="w-full bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition duration-300 font-semibold"
        >
          Analyze Image
        </button>
  
        {/* Prediction Results */}
        {result && (
          <div className="mt-8 text-left">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Predictions:</h3>
            <ul className="space-y-1">
              {result.map((item, index) => (
                <li
                  key={index}
                  className="text-gray-700 border-b border-gray-200 py-1"
                >
                  {item.label} - <span className="font-medium">{(item.confidence * 100).toFixed(2)}%</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}  