// App.js
import { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import MainNavBar from './main/MainNavBar';
import AdminNavBar from './admin/AdminNavBar';
import UserNavBar from './user/UserNavBar';
import './App.css';
import Header from './main/Header';

export default function App() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    const adminLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
    const userLoggedIn = localStorage.getItem('isUserLoggedIn') === 'true';

    setIsAdminLoggedIn(adminLoggedIn);
    setIsUserLoggedIn(userLoggedIn);
  }, []);

  const onAdminLogin = () => {
    localStorage.setItem('isAdminLoggedIn', 'true');
    setIsAdminLoggedIn(true);
  };

  const onUserLogin = () => {
    localStorage.setItem('isUserLoggedIn', 'true');
    setIsUserLoggedIn(true);
  };

  return (
    <div className="App">
      <Header/>
      <Router>
        {isAdminLoggedIn ? (
          <AdminNavBar />
        ) : isUserLoggedIn ? (
          <UserNavBar />
        ) : (
          <MainNavBar
            onAdminLogin={onAdminLogin}
            onUserLogin={onUserLogin}
          />
        )}
      </Router>
    </div>
  );
}
