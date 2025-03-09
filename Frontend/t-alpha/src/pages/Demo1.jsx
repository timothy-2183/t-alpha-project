import React, { useState } from 'react';
import { analyzeImage } from '../components/ImageAnalysis';

const Demo1 = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    setError(null);
    try {
      const res = await analyzeImage(file);
      setResult(res);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Image Emotion Analysis</h1>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button
        onClick={handleSubmit}
        className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Upload and Analyze
      </button>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {result && (
        <div className="mt-4">
          <p className="text-xl">
            Emotion: <strong>{result.emotion}</strong>
          </p>
          <p className="text-xl">
            Confidence: <strong>{(result.confidence * 100).toFixed(2)}%</strong>
          </p>
          <img
            src={`data:image/jpeg;base64,${result.image}`}
            alt="Annotated"
            className="mt-4"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>
      )}
    </div>
  );
};

export default Demo1;
