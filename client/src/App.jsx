import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Signup from './pages/Signup';
import Login from './pages/Login';
import VerifyOTP from './pages/VerifyOTP';
import Dashboard from './pages/Dashboard';

import ProtectedRoute from './components/ProtectedRoute';

import { StreamSessionProvider } from './context/StreamSessionContext';

import FindDoctors from './pages/FindDoctors';
import MyAppointments from './pages/MyAppointments';
import DoctorDashboard from './pages/DoctorDashboard';
import VideoCallPage from './pages/VideoCallPage';
import ChatPage from './pages/ChatPage';

function App() {
  return (
    <Router>
      <StreamSessionProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/find-doctors" element={
            <ProtectedRoute>
              <FindDoctors />
            </ProtectedRoute>
          } />
          <Route path="/my-appointments" element={
            <ProtectedRoute>
              <MyAppointments />
            </ProtectedRoute>
          } />
          <Route path="/doctor/dashboard" element={
            <ProtectedRoute>
              <DoctorDashboard />
            </ProtectedRoute>
          } />
          <Route path="/appointments/:appointmentId/call" element={
            <ProtectedRoute>
              <VideoCallPage />
            </ProtectedRoute>
          } />
          <Route path="/appointments/:appointmentId/chat" element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          } />
        </Routes>
      </StreamSessionProvider>
    </Router>
  );
}

export default App;
