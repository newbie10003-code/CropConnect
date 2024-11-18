import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Nav from './components/Nav.jsx';
import Home from './components/Home.jsx';
import Footer from './components/Footer.jsx';
import Shop from './components/Shop.jsx';
import Login from './components/Login.jsx';
import Product from './components/Product.jsx';
import Signup from './components/Signup.jsx';
import ForgotPassword from './components/ForgotPassword.jsx';
import ResetPassword from './components/ResetPassword.jsx';
import Contact from './components/Contact.jsx';
import Cart from './components/Cart.jsx';
import UserDetails from './components/UserDetails.jsx';
import ScrollToTop from './components/ScrollToTop';
import Predict from './components/Predict.jsx';
import Cropdisease from './components/Cropdisease.jsx';
import Crop from './components/Crop.jsx';
import { Animation } from './components/Animation';
const AppContent = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const hideNavAndFooter = [
    '/login',
    '/signup',
    '/forgot-password',
    '/reset-password/',
  ].some(path => currentPath.startsWith(path));

  const getIsLoggedInFromCookie = () => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; isLoggedIn=`);
    if (parts.length === 2) return parts.pop().split(';').shift() === 'true';
    return false;
  };

  const [isLoggedIn, setIsLoggedIn] = useState(() => getIsLoggedInFromCookie());

  useEffect(()=>{
    Animation();
  })

  useEffect(() => {
    document.cookie = `isLoggedIn=${isLoggedIn}; max-age=7200; path=/`; 
  }, [isLoggedIn]);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/logout', {
        method: 'POST',
        credentials: 'include',
      });
      setIsLoggedIn(false);
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <>
      <ScrollToTop />
      {!hideNavAndFooter && <Nav isLoggedIn={isLoggedIn} onLogout={handleLogout} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/crop-disease" element={<Cropdisease />} />
        <Route path="/crop-production" element={<Crop />} />
        <Route path="/login" element={<Login setIsLoggedIn={handleLoginSuccess} />} />
        <Route path="/products/:productId" element={<Product />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/predict" element={<Predict />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/user" element={<UserDetails />} />
      </Routes>
      {!hideNavAndFooter && <Footer />}
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
