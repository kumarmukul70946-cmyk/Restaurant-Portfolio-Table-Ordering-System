import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Restaurants from './pages/Restaurants';
import Booking from './pages/Booking';
import AdminDashboard from './pages/AdminDashboard';
import UserMenu from './pages/UserMenu';
import Login from './pages/Login';
import ChatWidget from './components/ChatWidget';
import Footer from './components/Footer';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Restaurants />} />
        <Route path="/book/:id" element={<Booking />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/usermenu" element={<UserMenu />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ChatWidget />
      <Footer />
    </BrowserRouter>
  );
}

export default App;
