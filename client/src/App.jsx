import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Signup from './pages/Signup';
import Login from './pages/Login';
import VerifyOTP from './pages/VerifyOTP';
import Dashboard from './pages/Dashboard';

import { StreamProvider } from './context/StreamContext';
import VideoCall from './components/VideoCall';

import ChatInterface from './components/ChatInterface';

function App() {
  return (
    <Router>
      <StreamProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/video" element={<VideoCall />} />
          <Route path="/chat" element={<ChatInterface />} />
        </Routes>
      </StreamProvider>
    </Router>
  );
}

export default App;
