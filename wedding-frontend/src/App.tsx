import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import Admin from './components/Admin';
import GuestPage from './components/GuestPage';
import InfoPage from './components/InfoPage';
import SignupPage from './components/SignupPage';
import LoginPage from './components/LoginPage';
import './global.css';

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/info" element={<InfoPage/>} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/guest/:rsvpCode" element={<GuestPage />} />
        <Route path="/signup/:rsvpCode" element={<SignupPage/>} />
      </Routes>
    </Router>
  );
}

export default App;