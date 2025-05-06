// filepath: d:\t-alpha-project-main\teamAlpha\t-alpha-project\Frontend\src\pages\SignIn.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

function SignIn() {
  const navigate = useNavigate();

  const handleSignIn = () => {
    // Simulate authentication (replace with real logic)
    localStorage.setItem('isAuthenticated', 'true');
    navigate('/home'); // Redirect to the home page after sign-in
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="p-6 bg-white shadow-md rounded">
        <h1 className="text-2xl font-bold mb-4">Sign In</h1>
        <button
          onClick={handleSignIn}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Sign In
        </button>
      </div>
    </div>
  );
}

export default SignIn;