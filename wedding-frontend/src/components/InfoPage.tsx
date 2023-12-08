import React from 'react';
import image1 from '../assets/images/piombaia1.png';
import image2 from '../assets/images/piombaia2.jpg';
import image3 from '../assets/images/piombaia3.jpg';
import image4 from '../assets/images/piombaia4.jpg';
import './GuestPage.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom';
import { Guest } from '../apiClient';
import { useLocation } from 'react-router-dom';
import { OpenAPI } from '../apiClient'; // replace './apiClient' with the correct path to the OpenAPI module

const InfoPage = () => {
    const location = useLocation();
    const token = localStorage.getItem('token');
    if (token) {
        OpenAPI.HEADERS = { 
          ...OpenAPI.HEADERS, 
          'Authorization': `Bearer ${token}` 
        };
      }
    const navigate = useNavigate();
    const loadData = (): Guest | undefined => {
        const data = localStorage.getItem('guest');
        return data ? JSON.parse(data) : null;
      };
      const guest = loadData();
      const handleNavigation = () => {
        if (guest && guest.rsvpCode) {
            navigate(`/guest/${guest.rsvpCode}`);
        } else {
            // Handle the case where guest or rsvpcode is not available
            console.error('Guest data or RSVP code is missing');
            // Optionally navigate to a different route or show an error message
        }
    };

const handleNavigationToInfo = () => {
    navigate('/info');
    };
      
    return (
        <div className="container-fluid guest-page my-font">
                <nav className="nav">
                    <ul>
                    <li><button className={`nav-link ${location.pathname.startsWith('/guest') ? 'active' : ''}`} onClick={handleNavigation}>OSA</button></li>
                    <li><button className={`nav-link ${location.pathname.startsWith('/info') ? 'active' : ''}`} onClick={handleNavigationToInfo}>Information</button></li>
                    </ul>
                </nav>
                <div className="card">
                    <h1 className="title-font">Bröllopet i Montalcino</h1>
                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                    <img src={image2} alt="Image 1" />
                    <img src={image3} alt="Image 2" />
                    <img src={image1} alt="Image 3" />
                    <img src={image4} alt="Image 4" />
                </div>
        </div>
    );
};

export default InfoPage;