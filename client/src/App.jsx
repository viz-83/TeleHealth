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
import DoctorAvailability from './pages/DoctorAvailability';

import DoctorPrescriptions from './pages/DoctorPrescriptions';
import DoctorViewPrescription from './pages/DoctorViewPrescription';
import DoctorOnboarding from './pages/DoctorOnboarding';
import VideoCallPage from './pages/VideoCallPage';
import ChatPage from './pages/ChatPage';
import CreatePrescription from './pages/CreatePrescription';
import MyPrescriptions from './pages/MyPrescriptions';
import UploadLabReport from './pages/UploadLabReport';
import ViewReportsDoctor from './pages/ViewReportsDoctor';
import SymptomChecker from './pages/SymptomChecker';
import AmbulanceBooking from './pages/AmbulanceBooking';
import HealthTracker from './pages/HealthTracker';
import PatientVitals from './pages/PatientVitals';

import Tests from './pages/Tests';
import TestCart from './pages/TestCart';
import TestOrderDetails from './pages/TestOrderDetails';
import CollectorDashboard from './pages/CollectorDashboard';

import Medicines from './pages/Medicines';
import MedicineCart from './pages/MedicineCart';
import MedicineOrderDetails from './pages/MedicineOrderDetails';
import PharmacyDashboard from './pages/PharmacyDashboard';

import { TestCartProvider } from './context/TestCartContext';
import { MedicineCartProvider } from './context/MedicineCartContext';

import useAutoLogout from './hooks/useAutoLogout';

const AutoLogoutHandler = () => {
  useAutoLogout(); // Default 15 mins
  return null;
};

import Home from './pages/Home';
import Layout from './components/Layout';

// ... imports ...

import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'react-hot-toast';
import AIAssistantButton from './components/AIAssistant/AIAssistantButton';

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <Toaster position="top-right" />
        <AutoLogoutHandler />
        <StreamSessionProvider>
          <TestCartProvider>
            <MedicineCartProvider>
              <Routes>
                {/* Unified Home Route */}
                <Route path="/" element={<Landing />} />

                <Route path="/signup" element={<Signup />} />
                <Route path="/verify-otp" element={<VerifyOTP />} />
                <Route path="/login" element={<Login />} />

                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />

                <Route path="/doctor/onboarding" element={
                  <ProtectedRoute>
                    <DoctorOnboarding />
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
                <Route path="/doctor/appointments/:id/prescription" element={
                  <ProtectedRoute>
                    <DoctorViewPrescription />
                  </ProtectedRoute>
                } />
                <Route path="/doctor/prescriptions" element={
                  <ProtectedRoute>
                    <DoctorPrescriptions />
                  </ProtectedRoute>
                } />
                <Route path="/doctor/availability" element={
                  <ProtectedRoute>
                    <DoctorAvailability />
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
                <Route path="/doctor/appointments/:id/prescribe" element={
                  <ProtectedRoute>
                    <CreatePrescription />
                  </ProtectedRoute>
                } />
                <Route path="/patient/prescriptions" element={
                  <ProtectedRoute>
                    <MyPrescriptions />
                  </ProtectedRoute>
                } />
                <Route path="/patient/reports/upload" element={
                  <ProtectedRoute>
                    <UploadLabReport />
                  </ProtectedRoute>
                } />
                <Route path="/doctor/patient/:id/reports" element={
                  <ProtectedRoute>
                    <ViewReportsDoctor />
                  </ProtectedRoute>
                } />
                <Route path="/symptom-checker" element={
                  <ProtectedRoute>
                    <SymptomChecker />
                  </ProtectedRoute>
                } />
                <Route path="/ambulance/book" element={
                  <ProtectedRoute>
                    <AmbulanceBooking />
                  </ProtectedRoute>
                } />
                <Route path="/patient/health-tracker" element={
                  <ProtectedRoute>
                    <HealthTracker />
                  </ProtectedRoute>
                } />
                <Route path="/doctor/patient/:id/vitals" element={
                  <ProtectedRoute>
                    <PatientVitals />
                  </ProtectedRoute>
                } />

                {/* Diagnostic & Medicine Systems */}
                <Route path="/tests" element={<ProtectedRoute><Layout><Tests /></Layout></ProtectedRoute>} />
                <Route path="/tests/cart" element={<ProtectedRoute><Layout><TestCart /></Layout></ProtectedRoute>} />
                <Route path="/tests/orders/:id" element={<ProtectedRoute><Layout><TestOrderDetails /></Layout></ProtectedRoute>} />
                <Route path="/collector/dashboard" element={<ProtectedRoute><Layout><CollectorDashboard /></Layout></ProtectedRoute>} />

                <Route path="/medicines" element={<ProtectedRoute><Layout><Medicines /></Layout></ProtectedRoute>} />
                <Route path="/medicines/cart" element={<ProtectedRoute><Layout><MedicineCart /></Layout></ProtectedRoute>} />
                <Route path="/medicines/orders/:id" element={<ProtectedRoute><Layout><MedicineOrderDetails /></Layout></ProtectedRoute>} />
                <Route path="/pharmacy/dashboard" element={<ProtectedRoute><Layout><PharmacyDashboard /></Layout></ProtectedRoute>} />
              </Routes>
            </MedicineCartProvider>
          </TestCartProvider>
        </StreamSessionProvider>
        <AIAssistantButton />
      </Router>
    </ThemeProvider>
  );
};

export default App;
