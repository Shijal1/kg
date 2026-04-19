import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import AboutPage from './pages/AboutPage';
import ProfilePage from './pages/ProfilePage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import PaymentPage from './pages/PaymentPage';
import BookingPage from './pages/BookingPage'; // ADD THIS
import Header from './components/Header';
import Footer from './components/Footer';
import { UserProvider, useUser } from './context/UserContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Component to sync localStorage with context
const UserContextSyncer = ({ children }) => {
  const { updateUser } = useUser();
  
  useEffect(() => {
    // Update context on storage changes
    const handleStorageChange = () => {
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        try {
          updateUser(JSON.parse(userInfo));
        } catch (error) {
          console.error('Error parsing user info:', error);
        }
      }
    };
    
    // Listen for custom user login event
    const handleUserLogin = () => {
      handleStorageChange();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userLogin', handleUserLogin);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userLogin', handleUserLogin);
    };
  }, [updateUser]);
  
  return children;
};

function App() {
  return (
    <UserProvider>
      <UserContextSyncer>
        <div className="app-container">
          <Header />
          <main className="main-content" style={{ minHeight: '70vh' }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/order/:id" element={<OrderDetailsPage />} />
              <Route path="/payment/:orderId" element={<PaymentPage />} />
              <Route path="/booking" element={<BookingPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </UserContextSyncer>
    </UserProvider>
  );
}

export default App;