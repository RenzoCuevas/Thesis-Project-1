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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Upload an Image for Analysis</h2>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} className="mb-4" />
      <button onClick={handleUpload} className="bg-blue-500 text-white px-4 py-2 rounded">
        Upload & Analyze
      </button>
      {result && (
        <div className="mt-4 p-4 bg-white shadow-md rounded">
          <h3 className="text-lg font-semibold">Predictions:</h3>
          <ul>
            {result.map((item, index) => (
              <li key={index} className="text-gray-700">{`${item.label} (${(item.confidence * 100).toFixed(2)}%)`}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
