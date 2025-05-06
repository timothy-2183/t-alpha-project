import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Demo1 from './pages/Demo1';
import Demo2 from './pages/Demo2';
import './SignIn.css';
function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  const handleSignIn = () => {
    setIsSignedIn(true); // Set the user as signed in
  };
  if (!isSignedIn) {
    return (
      <div className="signin-container">
        <div className="signin-card">
          <h1 className="signin-title">Sign In</h1>
          <label htmlFor="username" className="sr-only">
            Username
          </label>
          <input
            id="username"
            type="text"
            placeholder="Enter your username"
            className="signin-input"
          />
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            className="signin-input"
          />
          <button
            onClick={handleSignIn}
            className="signin-button"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }
  // Render the main app layout if the user is signed in
  return (
    <BrowserRouter>
      <div className="flex h-dvh w-dvw flex-row">
        <Sidebar key={window.location.pathname} />
        <div className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/demo1" element={<Demo1 />} />
            <Route path="/demo2" element={<Demo2 />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;