import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import Admin from './components/Admin';
import GuestPage from './components/GuestPage';
import './global.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/guest/:rsvpCode" element={<GuestPage />} />
      </Routes>
    </Router>
  );
}

export default App;