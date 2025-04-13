import { useState } from "react";
import axios from "axios";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");
  const [itemInfo, setItemInfo] = useState(null);
  const [error, setError] = useState(null);

  const handleFileDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/analyze-image",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const predictions = response.data.predictions;
      setResult(predictions);

      const highestPrediction = predictions.reduce((prev, current) =>
        prev.confidence > current.confidence ? prev : current
      );

      fetchItemInfo(highestPrediction.label);
    } catch (error) {
      console.error("Upload failed:", error);
      setResult("Error processing image.");
    }
  };

  const fetchItemInfo = async (itemName) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/item-info/${itemName}`
      );
      setItemInfo(response.data);
      setError(null);
    } catch (error) {
      console.error("Failed to fetch item information:", error);
      setItemInfo(null);
      setError(
        error.response?.data?.message || "Failed to fetch item information."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1f] via-[#1a2238] to-[#0a0f1f] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-4xl p-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20">
        <h1 className="text-4xl font-bold text-center mb-6 text-cyan-400">
          AI Image Analyzer
        </h1>
        <p className="text-center text-gray-300 mb-8">
          Drag and drop an image below to analyze it using our advanced{" "}
          <span className="text-cyan-400">
            Convolutional Neural Network (CNN)
          </span>{" "}
          technology.
        </p>

        {/* Drag-and-Drop Upload Section */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleFileDrop}
          onClick={() => document.getElementById("fileUpload").click()}
          className={`relative flex flex-col items-center justify-center mx-auto mb-8 border-2 border-dashed border-cyan-500 rounded-lg p-6 bg-[#1a2238]/50 hover:bg-[#1a2238]/70 transition duration-300 cursor-pointer ${
            file ? "border-none" : ""
          }`}
          style={{ height: "300px", width: "300px", display: "flex", alignItems: "center", justifyContent: "center" }} // 3x3 grid size
        >
          {file ? (
            <div className="relative w-full h-full rounded-lg overflow-hidden shadow-lg">
              <img
                src={URL.createObjectURL(file)}
                alt="Uploaded Preview"
                className="w-full h-full object-cover transition-opacity duration-300 hover:opacity-80"
              />
              <p className="absolute inset-0 flex items-center justify-center text-white text-lg font-semibold bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-300">
                Upload File
              </p>
            </div>
          ) : (
            <p className="text-gray-400 text-center">
              Drag and drop an image here, or click to select a file.
            </p>
          )}
          <input
            id="fileUpload"
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="hidden"
          />
        </div>

        {/* Analyze Button */}
        {file && (
          <button
            onClick={handleUpload}
            className="w-full bg-cyan-500/80 text-white px-6 py-3 rounded-lg hover:bg-cyan-600/90 transition duration-300 font-semibold shadow-md"
          >
            Analyze Image
          </button>
        )}

        {/* Prediction Results */}
        {result && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-cyan-400 mb-4 text-center">
              Predictions:
            </h3>
            <ul className="space-y-2">
              {result.map((item, index) => (
                <li
                  key={index}
                  className="text-gray-300 bg-[#1a2238]/50 p-3 rounded-lg shadow-md text-center"
                >
                  {item.label} -{" "}
                  <span className="font-medium text-cyan-400">
                    {(item.confidence * 100).toFixed(2)}%
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Item Information */}
        {itemInfo && (
          <div className="mt-8 bg-[#1a2238]/50 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-cyan-400 mb-4 text-center">
              Item Information
            </h3>
            <p className="text-gray-300">
              <strong className="text-cyan-400">Name:</strong> {itemInfo.name}
            </p>
            <p className="text-gray-300">
              <strong className="text-cyan-400">Inventor:</strong>{" "}
              {itemInfo.inventor || "Unknown"}
            </p>
            <p className="text-gray-300">
              <strong className="text-cyan-400">Uses:</strong>{" "}
              {itemInfo.uses || "Not specified"}
            </p>
            <p className="text-gray-300">
              <strong className="text-cyan-400">Made in:</strong>{" "}
              {itemInfo.madeIn || "Unknown"}
            </p>
            <p className="text-gray-300">
              <strong className="text-cyan-400">History:</strong>{" "}
              {itemInfo.history || "No history available"}
            </p>
            {itemInfo.link && (
              <p className="text-gray-300">
                <strong className="text-cyan-400">More Info:</strong>{" "}
                <a
                  href={itemInfo.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 underline"
                >
                  Learn more
                </a>
              </p>
            )}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-8 text-red-500 text-center">
            <h3 className="text-lg font-semibold mb-2">Error:</h3>
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
