import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VideoStream from './components/VideoStream';
import RegionEditor from './components/RegionEditor';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Flow Analysis System
            </h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<VideoStream />} />
              <Route path="/edit" element={<RegionEditor />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;