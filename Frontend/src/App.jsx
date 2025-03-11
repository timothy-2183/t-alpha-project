import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Demo1 from './pages/Demo1';
import Demo2 from './pages/Demo2';

function App() {
  return (
    <BrowserRouter>
      <div className="flex h-dvh w-dvw flex-row">
        <Sidebar key={window.location.pathname}/>
        <div className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element = {<Home/>}/>
            <Route path="/demo1" element = {<Demo1/>}/>
            <Route path="/demo2" element = {<Demo2/>}/>
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;