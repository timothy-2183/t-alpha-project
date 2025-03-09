import React, { useState } from 'react';

const ModelConfidence = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.detail || 'Error processing image');
        return;
      }
      
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Model Confidence</h1>
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
          {/* Display the annotated image */}
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

export default ModelConfidence;
