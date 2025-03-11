import React, { useState, useEffect } from 'react';
import { liveAnalysis } from '../components/LiveAnalysis';
import Demo from './Demo.module.css';

export default function Demo2() {
  const [liveActive, setLiveActive] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleLiveToggle = () => {
    setLiveActive((prev) => !prev);
  };

  useEffect(() => {
    let cancelled = false;
    async function startLiveLoop() {
      while (!cancelled && liveActive) {
        try {
          const data = await liveAnalysis();
          setResult(data);
          setError(null);
        } catch (err) {
          setError(err.message);
        }
      }
    }
    if (liveActive) {
      startLiveLoop();
    }
    return () => {
      cancelled = true;
    };
  }, [liveActive]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Live Emotion Analysis</h1>
        <button
          onClick={handleLiveToggle}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          {liveActive ? 'Stop Live Analysis' : 'Start Live Analysis'}
        </button>
        {error && <p className="text-red-500">{error}</p>}
        {result && (
          <div className="text-white">
            <p>Emotion: {result.emotion}</p>
            <p>Confidence: {result.confidence}</p>
            <p>Empathy Score: {result.empathy_score}</p>
            <p>Empathy Detected: {result.empathy_detected ? 'Yes' : 'No'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
