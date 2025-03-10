import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import Demo1 from './pages/Demo1';
import TestCenter from './pages/TestCenter';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Demo1/>} />
        {/* Additional Routes */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;