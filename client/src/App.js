import Header from './Components/Header/Header';
import Login from './Pages/Authorization/Login/Login';
import Logout from './Pages/Authorization/Logout/Logout';
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import Schedule from './Pages/Schedule/Schedule';
import Analytics from './Pages/Analytics/Analytics';

function App() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');
  const [userName, setUserName] = useState(localStorage.getItem('userName') || '');

  const handleLogoutClick = () => {
    setIsLoggedIn(false);
    setUserName('');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  useEffect(() => {
    const storedIsLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const storedUserName = localStorage.getItem('userName') || '';
    setIsLoggedIn(storedIsLoggedIn);
    setUserName(storedUserName);
  }, []);

  return (
    <div className='App'>
      <Header isLoggedIn={isLoggedIn} userName={userName} onLogoutClick={handleLogoutClick} />
      <Routes>
        <Route path="/" element={isLoggedIn ? <Schedule /> : <Login setIsLoggedIn={setIsLoggedIn} setUserName={setUserName} />} />
        <Route path="/schedule" element={isLoggedIn ? <Schedule /> : <Navigate to="/login" />} />
        <Route path="/analytics" element={isLoggedIn ? <Analytics /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUserName={setUserName} />} />
        <Route path="/logout" element={<Logout onLogoutClick={handleLogoutClick} />} />
      </Routes>
    </div>
  );
}

export default App;
