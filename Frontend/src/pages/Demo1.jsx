import React, {useState} from 'react';
import {analyzeImage} from '../components/ImageAnalysis';
import Demo from './Demo1.module.css';

export default function Demo1() {
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
    <div className="flex items-center justify-center h-screen">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Image Emotion Analysis</h1>
        
        <div className="flex justify-center items-center mb-4">
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <button onClick={handleSubmit} className={`${Demo.button} ml-2`}>
            Upload and Analyze
          </button>
        </div>

        {error && <p className="text-red-500 mt-4">{error}</p>}

        {result && (
          <div className="mt-4">
            <p className="text-xl">
              Emotion: <strong>{result.emotion}</strong>
            </p>
            <p className="text-xl">
              Confidence: <strong>{result.confidence}</strong>
            </p>
            {result.image && (
              <img
                src={`data:image/jpeg;base64,${result.image}`}
                alt="Annotated"
                className="mt-4 mx-auto block"
                style={{maxWidth: '100%', height: 'auto'}}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
