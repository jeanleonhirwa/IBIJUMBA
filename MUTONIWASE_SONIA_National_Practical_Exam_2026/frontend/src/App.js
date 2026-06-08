import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Vehicles from './components/Vehicles';
import VehicleForm from './components/VehicleForm';
import Customers from './components/Customers';
import CustomerForm from './components/CustomerForm';
import Promotions from './components/Promotions';
import PromotionForm from './components/PromotionForm';
import PromotionVehicles from './components/PromotionVehicles';
import Report from './components/Report';
import './App.css';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="d-flex justify-content-center mt-5"><div className="spinner-border text-primary" /></div>;
  return user ? children : <Navigate to="/login" />;
}

function AppContent() {
  const { user } = useAuth();
  return (
    <div className="app-container">
      {user && <Navbar />}
      <div className={user ? 'main-content' : ''}>
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/vehicles" element={<PrivateRoute><Vehicles /></PrivateRoute>} />
          <Route path="/vehicles/new" element={<PrivateRoute><VehicleForm /></PrivateRoute>} />
          <Route path="/vehicles/edit/:id" element={<PrivateRoute><VehicleForm /></PrivateRoute>} />
          <Route path="/customers" element={<PrivateRoute><Customers /></PrivateRoute>} />
          <Route path="/customers/new" element={<PrivateRoute><CustomerForm /></PrivateRoute>} />
          <Route path="/customers/edit/:id" element={<PrivateRoute><CustomerForm /></PrivateRoute>} />
          <Route path="/promotions" element={<PrivateRoute><Promotions /></PrivateRoute>} />
          <Route path="/promotions/new" element={<PrivateRoute><PromotionForm /></PrivateRoute>} />
          <Route path="/promotions/edit/:id" element={<PrivateRoute><PromotionForm /></PrivateRoute>} />
          <Route path="/promotion-vehicles" element={<PrivateRoute><PromotionVehicles /></PrivateRoute>} />
          <Route path="/reports" element={<PrivateRoute><Report /></PrivateRoute>} />
        </Routes>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
